let Tr = 0;
const Si = /* @__PURE__ */ Object.create(null);
function vi(e) {
  try {
    const t = Number(e);
    Tr = Number.isFinite(t) && t >= 0 ? Math.max(0, Math.min(3, Math.floor(t))) : 0;
  } catch {
    Tr = 0;
  }
}
function Yt(e = 1) {
  try {
    return Number(Tr) >= Number(e || 1);
  } catch {
    return !1;
  }
}
function Wr() {
  return Yt(1);
}
function Yn(...e) {
  try {
    if (!Yt(1) || !console || typeof console.error != "function") return;
    const t = e.map((n) => typeof n == "function" ? n() : n);
    console.error(...t);
  } catch {
  }
}
function k(...e) {
  try {
    if (!Yt(2) || !console || typeof console.warn != "function") return;
    const t = e.map((n) => typeof n == "function" ? n() : n);
    console.warn(...t);
  } catch {
  }
}
function zt(...e) {
  try {
    if (!Yt(3) || !console || typeof console.info != "function") return;
    const t = e.map((n) => typeof n == "function" ? n() : n);
    console.info(...t);
  } catch {
  }
}
function Bt(...e) {
  try {
    if (!Yt(3) || !console || typeof console.log != "function") return;
    const t = e.map((n) => typeof n == "function" ? n() : n);
    console.log(...t);
  } catch {
  }
}
function Vi(e) {
  try {
    if (!Wr()) return;
    const t = String(e || "");
    if (!t) return;
    Si[t] = (Si[t] || 0) + 1;
  } catch {
  }
}
function Ji(e) {
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
const En = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: []
};
function Zr(e, t) {
  if (!Object.prototype.hasOwnProperty.call(En, e))
    throw new Error('Unknown hook "' + e + '"');
  if (typeof t != "function")
    throw new TypeError("hook callback must be a function");
  En[e].push(t);
}
function sc(e) {
  Zr("onPageLoad", e);
}
function oc(e) {
  Zr("onNavBuild", e);
}
function lc(e) {
  Zr("transformHtml", e);
}
async function Ai(e, t) {
  const n = En[e] || [];
  for (const i of n)
    try {
      await i(t);
    } catch (r) {
      try {
        k("[nimbi-cms] runHooks callback failed", r);
      } catch {
      }
    }
}
function cc() {
  Object.keys(En).forEach((e) => {
    En[e].length = 0;
  });
}
function ea(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var _r, Ei;
function ys() {
  if (Ei) return _r;
  Ei = 1;
  function e(x) {
    return x instanceof Map ? x.clear = x.delete = x.set = function() {
      throw new Error("map is read-only");
    } : x instanceof Set && (x.add = x.clear = x.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(x), Object.getOwnPropertyNames(x).forEach((N) => {
      const J = x[N], we = typeof J;
      (we === "object" || we === "function") && !Object.isFrozen(J) && e(J);
    }), x;
  }
  class t {
    /**
     * @param {CompiledMode} mode
     */
    constructor(N) {
      N.data === void 0 && (N.data = {}), this.data = N.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  }
  function n(x) {
    return x.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function i(x, ...N) {
    const J = /* @__PURE__ */ Object.create(null);
    for (const we in x)
      J[we] = x[we];
    return N.forEach(function(we) {
      for (const Ue in we)
        J[Ue] = we[Ue];
    }), /** @type {T} */
    J;
  }
  const r = "</span>", a = (x) => !!x.scope, s = (x, { prefix: N }) => {
    if (x.startsWith("language:"))
      return x.replace("language:", "language-");
    if (x.includes(".")) {
      const J = x.split(".");
      return [
        `${N}${J.shift()}`,
        ...J.map((we, Ue) => `${we}${"_".repeat(Ue + 1)}`)
      ].join(" ");
    }
    return `${N}${x}`;
  };
  class o {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(N, J) {
      this.buffer = "", this.classPrefix = J.classPrefix, N.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(N) {
      this.buffer += n(N);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(N) {
      if (!a(N)) return;
      const J = s(
        N.scope,
        { prefix: this.classPrefix }
      );
      this.span(J);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(N) {
      a(N) && (this.buffer += r);
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
    span(N) {
      this.buffer += `<span class="${N}">`;
    }
  }
  const l = (x = {}) => {
    const N = { children: [] };
    return Object.assign(N, x), N;
  };
  class c {
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
    add(N) {
      this.top.children.push(N);
    }
    /** @param {string} scope */
    openNode(N) {
      const J = l({ scope: N });
      this.add(J), this.stack.push(J);
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
    walk(N) {
      return this.constructor._walk(N, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(N, J) {
      return typeof J == "string" ? N.addText(J) : J.children && (N.openNode(J), J.children.forEach((we) => this._walk(N, we)), N.closeNode(J)), N;
    }
    /**
     * @param {Node} node
     */
    static _collapse(N) {
      typeof N != "string" && N.children && (N.children.every((J) => typeof J == "string") ? N.children = [N.children.join("")] : N.children.forEach((J) => {
        c._collapse(J);
      }));
    }
  }
  class u extends c {
    /**
     * @param {*} options
     */
    constructor(N) {
      super(), this.options = N;
    }
    /**
     * @param {string} text
     */
    addText(N) {
      N !== "" && this.add(N);
    }
    /** @param {string} scope */
    startScope(N) {
      this.openNode(N);
    }
    endScope() {
      this.closeNode();
    }
    /**
     * @param {Emitter & {root: DataNode}} emitter
     * @param {string} name
     */
    __addSublanguage(N, J) {
      const we = N.root;
      J && (we.scope = `language:${J}`), this.add(we);
    }
    toHTML() {
      return new o(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function d(x) {
    return x ? typeof x == "string" ? x : x.source : null;
  }
  function h(x) {
    return m("(?=", x, ")");
  }
  function f(x) {
    return m("(?:", x, ")*");
  }
  function g(x) {
    return m("(?:", x, ")?");
  }
  function m(...x) {
    return x.map((J) => d(J)).join("");
  }
  function p(x) {
    const N = x[x.length - 1];
    return typeof N == "object" && N.constructor === Object ? (x.splice(x.length - 1, 1), N) : {};
  }
  function b(...x) {
    return "(" + (p(x).capture ? "" : "?:") + x.map((we) => d(we)).join("|") + ")";
  }
  function y(x) {
    return new RegExp(x.toString() + "|").exec("").length - 1;
  }
  function _(x, N) {
    const J = x && x.exec(N);
    return J && J.index === 0;
  }
  const w = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function A(x, { joinWith: N }) {
    let J = 0;
    return x.map((we) => {
      J += 1;
      const Ue = J;
      let We = d(we), oe = "";
      for (; We.length > 0; ) {
        const ae = w.exec(We);
        if (!ae) {
          oe += We;
          break;
        }
        oe += We.substring(0, ae.index), We = We.substring(ae.index + ae[0].length), ae[0][0] === "\\" && ae[1] ? oe += "\\" + String(Number(ae[1]) + Ue) : (oe += ae[0], ae[0] === "(" && J++);
      }
      return oe;
    }).map((we) => `(${we})`).join(N);
  }
  const S = /\b\B/, M = "[a-zA-Z]\\w*", I = "[a-zA-Z_]\\w*", q = "\\b\\d+(\\.\\d+)?", Q = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", R = "\\b(0b[01]+)", O = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", G = (x = {}) => {
    const N = /^#![ ]*\//;
    return x.binary && (x.begin = m(
      N,
      /.*\b/,
      x.binary,
      /\b.*/
    )), i({
      scope: "meta",
      begin: N,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (J, we) => {
        J.index !== 0 && we.ignoreMatch();
      }
    }, x);
  }, re = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, D = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [re]
  }, L = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [re]
  }, H = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, W = function(x, N, J = {}) {
    const we = i(
      {
        scope: "comment",
        begin: x,
        end: N,
        contains: []
      },
      J
    );
    we.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const Ue = b(
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
    return we.contains.push(
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
          Ue,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), we;
  }, ie = W("//", "$"), ye = W("/\\*", "\\*/"), ee = W("#", "$"), Pe = {
    scope: "number",
    begin: q,
    relevance: 0
  }, ke = {
    scope: "number",
    begin: Q,
    relevance: 0
  }, xe = {
    scope: "number",
    begin: R,
    relevance: 0
  }, Ee = {
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
  }, qe = {
    scope: "title",
    begin: M,
    relevance: 0
  }, T = {
    scope: "title",
    begin: I,
    relevance: 0
  }, $ = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + I,
    relevance: 0
  };
  var v = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: D,
    BACKSLASH_ESCAPE: re,
    BINARY_NUMBER_MODE: xe,
    BINARY_NUMBER_RE: R,
    COMMENT: W,
    C_BLOCK_COMMENT_MODE: ye,
    C_LINE_COMMENT_MODE: ie,
    C_NUMBER_MODE: ke,
    C_NUMBER_RE: Q,
    END_SAME_AS_BEGIN: function(x) {
      return Object.assign(
        x,
        {
          /** @type {ModeCallback} */
          "on:begin": (N, J) => {
            J.data._beginMatch = N[1];
          },
          /** @type {ModeCallback} */
          "on:end": (N, J) => {
            J.data._beginMatch !== N[1] && J.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: ee,
    IDENT_RE: M,
    MATCH_NOTHING_RE: S,
    METHOD_GUARD: $,
    NUMBER_MODE: Pe,
    NUMBER_RE: q,
    PHRASAL_WORDS_MODE: H,
    QUOTE_STRING_MODE: L,
    REGEXP_MODE: Ee,
    RE_STARTERS_RE: O,
    SHEBANG: G,
    TITLE_MODE: qe,
    UNDERSCORE_IDENT_RE: I,
    UNDERSCORE_TITLE_MODE: T
  });
  function C(x, N) {
    x.input[x.index - 1] === "." && N.ignoreMatch();
  }
  function F(x, N) {
    x.className !== void 0 && (x.scope = x.className, delete x.className);
  }
  function V(x, N) {
    N && x.beginKeywords && (x.begin = "\\b(" + x.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", x.__beforeBegin = C, x.keywords = x.keywords || x.beginKeywords, delete x.beginKeywords, x.relevance === void 0 && (x.relevance = 0));
  }
  function B(x, N) {
    Array.isArray(x.illegal) && (x.illegal = b(...x.illegal));
  }
  function P(x, N) {
    if (x.match) {
      if (x.begin || x.end) throw new Error("begin & end are not supported with match");
      x.begin = x.match, delete x.match;
    }
  }
  function z(x, N) {
    x.relevance === void 0 && (x.relevance = 1);
  }
  const j = (x, N) => {
    if (!x.beforeMatch) return;
    if (x.starts) throw new Error("beforeMatch cannot be used with starts");
    const J = Object.assign({}, x);
    Object.keys(x).forEach((we) => {
      delete x[we];
    }), x.keywords = J.keywords, x.begin = m(J.beforeMatch, h(J.begin)), x.starts = {
      relevance: 0,
      contains: [
        Object.assign(J, { endsParent: !0 })
      ]
    }, x.relevance = 0, delete J.beforeMatch;
  }, Z = [
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
  ], se = "keyword";
  function ge(x, N, J = se) {
    const we = /* @__PURE__ */ Object.create(null);
    return typeof x == "string" ? Ue(J, x.split(" ")) : Array.isArray(x) ? Ue(J, x) : Object.keys(x).forEach(function(We) {
      Object.assign(
        we,
        ge(x[We], N, We)
      );
    }), we;
    function Ue(We, oe) {
      N && (oe = oe.map((ae) => ae.toLowerCase())), oe.forEach(function(ae) {
        const me = ae.split("|");
        we[me[0]] = [We, be(me[0], me[1])];
      });
    }
  }
  function be(x, N) {
    return N ? Number(N) : pe(x) ? 0 : 1;
  }
  function pe(x) {
    return Z.includes(x.toLowerCase());
  }
  const Se = {}, Te = (x) => {
    console.error(x);
  }, Fe = (x, ...N) => {
    console.log(`WARN: ${x}`, ...N);
  }, Ge = (x, N) => {
    Se[`${x}/${N}`] || (console.log(`Deprecated as of ${x}. ${N}`), Se[`${x}/${N}`] = !0);
  }, At = new Error();
  function sn(x, N, { key: J }) {
    let we = 0;
    const Ue = x[J], We = {}, oe = {};
    for (let ae = 1; ae <= N.length; ae++)
      oe[ae + we] = Ue[ae], We[ae + we] = !0, we += y(N[ae - 1]);
    x[J] = oe, x[J]._emit = We, x[J]._multi = !0;
  }
  function Et(x) {
    if (Array.isArray(x.begin)) {
      if (x.skip || x.excludeBegin || x.returnBegin)
        throw Te("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), At;
      if (typeof x.beginScope != "object" || x.beginScope === null)
        throw Te("beginScope must be object"), At;
      sn(x, x.begin, { key: "beginScope" }), x.begin = A(x.begin, { joinWith: "" });
    }
  }
  function Wa(x) {
    if (Array.isArray(x.end)) {
      if (x.skip || x.excludeEnd || x.returnEnd)
        throw Te("skip, excludeEnd, returnEnd not compatible with endScope: {}"), At;
      if (typeof x.endScope != "object" || x.endScope === null)
        throw Te("endScope must be object"), At;
      sn(x, x.end, { key: "endScope" }), x.end = A(x.end, { joinWith: "" });
    }
  }
  function Za(x) {
    x.scope && typeof x.scope == "object" && x.scope !== null && (x.beginScope = x.scope, delete x.scope);
  }
  function Ga(x) {
    Za(x), typeof x.beginScope == "string" && (x.beginScope = { _wrap: x.beginScope }), typeof x.endScope == "string" && (x.endScope = { _wrap: x.endScope }), Et(x), Wa(x);
  }
  function Xa(x) {
    function N(oe, ae) {
      return new RegExp(
        d(oe),
        "m" + (x.case_insensitive ? "i" : "") + (x.unicodeRegex ? "u" : "") + (ae ? "g" : "")
      );
    }
    class J {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(ae, me) {
        me.position = this.position++, this.matchIndexes[this.matchAt] = me, this.regexes.push([me, ae]), this.matchAt += y(ae) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const ae = this.regexes.map((me) => me[1]);
        this.matcherRe = N(A(ae, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(ae) {
        this.matcherRe.lastIndex = this.lastIndex;
        const me = this.matcherRe.exec(ae);
        if (!me)
          return null;
        const Ke = me.findIndex((on, pr) => pr > 0 && on !== void 0), Ze = this.matchIndexes[Ke];
        return me.splice(0, Ke), Object.assign(me, Ze);
      }
    }
    class we {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(ae) {
        if (this.multiRegexes[ae]) return this.multiRegexes[ae];
        const me = new J();
        return this.rules.slice(ae).forEach(([Ke, Ze]) => me.addRule(Ke, Ze)), me.compile(), this.multiRegexes[ae] = me, me;
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
        let Ke = me.exec(ae);
        if (this.resumingScanAtSamePosition() && !(Ke && Ke.index === this.lastIndex)) {
          const Ze = this.getMatcher(0);
          Ze.lastIndex = this.lastIndex + 1, Ke = Ze.exec(ae);
        }
        return Ke && (this.regexIndex += Ke.position + 1, this.regexIndex === this.count && this.considerAll()), Ke;
      }
    }
    function Ue(oe) {
      const ae = new we();
      return oe.contains.forEach((me) => ae.addRule(me.begin, { rule: me, type: "begin" })), oe.terminatorEnd && ae.addRule(oe.terminatorEnd, { type: "end" }), oe.illegal && ae.addRule(oe.illegal, { type: "illegal" }), ae;
    }
    function We(oe, ae) {
      const me = (
        /** @type CompiledMode */
        oe
      );
      if (oe.isCompiled) return me;
      [
        F,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        P,
        Ga,
        j
      ].forEach((Ze) => Ze(oe, ae)), x.compilerExtensions.forEach((Ze) => Ze(oe, ae)), oe.__beforeBegin = null, [
        V,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        B,
        // default to 1 relevance if not specified
        z
      ].forEach((Ze) => Ze(oe, ae)), oe.isCompiled = !0;
      let Ke = null;
      return typeof oe.keywords == "object" && oe.keywords.$pattern && (oe.keywords = Object.assign({}, oe.keywords), Ke = oe.keywords.$pattern, delete oe.keywords.$pattern), Ke = Ke || /\w+/, oe.keywords && (oe.keywords = ge(oe.keywords, x.case_insensitive)), me.keywordPatternRe = N(Ke, !0), ae && (oe.begin || (oe.begin = /\B|\b/), me.beginRe = N(me.begin), !oe.end && !oe.endsWithParent && (oe.end = /\B|\b/), oe.end && (me.endRe = N(me.end)), me.terminatorEnd = d(me.end) || "", oe.endsWithParent && ae.terminatorEnd && (me.terminatorEnd += (oe.end ? "|" : "") + ae.terminatorEnd)), oe.illegal && (me.illegalRe = N(
        /** @type {RegExp | string} */
        oe.illegal
      )), oe.contains || (oe.contains = []), oe.contains = [].concat(...oe.contains.map(function(Ze) {
        return Qa(Ze === "self" ? oe : Ze);
      })), oe.contains.forEach(function(Ze) {
        We(
          /** @type Mode */
          Ze,
          me
        );
      }), oe.starts && We(oe.starts, ae), me.matcher = Ue(me), me;
    }
    if (x.compilerExtensions || (x.compilerExtensions = []), x.contains && x.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return x.classNameAliases = i(x.classNameAliases || {}), We(
      /** @type Mode */
      x
    );
  }
  function hi(x) {
    return x ? x.endsWithParent || hi(x.starts) : !1;
  }
  function Qa(x) {
    return x.variants && !x.cachedVariants && (x.cachedVariants = x.variants.map(function(N) {
      return i(x, { variants: null }, N);
    })), x.cachedVariants ? x.cachedVariants : hi(x) ? i(x, { starts: x.starts ? i(x.starts) : null }) : Object.isFrozen(x) ? i(x) : x;
  }
  var Ka = "11.11.1";
  class Ya extends Error {
    constructor(N, J) {
      super(N), this.name = "HTMLInjectionError", this.html = J;
    }
  }
  const fr = n, di = i, fi = /* @__PURE__ */ Symbol("nomatch"), Va = 7, pi = function(x) {
    const N = /* @__PURE__ */ Object.create(null), J = /* @__PURE__ */ Object.create(null), we = [];
    let Ue = !0;
    const We = "Could not find the language '{}', did you forget to load/include a language module?", oe = { disableAutodetect: !0, name: "Plain text", contains: [] };
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
      __emitter: u
    };
    function me(X) {
      return ae.noHighlightRe.test(X);
    }
    function Ke(X) {
      let ue = X.className + " ";
      ue += X.parentNode ? X.parentNode.className : "";
      const Me = ae.languageDetectRe.exec(ue);
      if (Me) {
        const Oe = Lt(Me[1]);
        return Oe || (Fe(We.replace("{}", Me[1])), Fe("Falling back to no-highlight mode for this block.", X)), Oe ? Me[1] : "no-highlight";
      }
      return ue.split(/\s+/).find((Oe) => me(Oe) || Lt(Oe));
    }
    function Ze(X, ue, Me) {
      let Oe = "", Xe = "";
      typeof ue == "object" ? (Oe = X, Me = ue.ignoreIllegals, Xe = ue.language) : (Ge("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Ge("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), Xe = X, Oe = ue), Me === void 0 && (Me = !0);
      const yt = {
        code: Oe,
        language: Xe
      };
      Bn("before:highlight", yt);
      const Tt = yt.result ? yt.result : on(yt.language, yt.code, Me);
      return Tt.code = yt.code, Bn("after:highlight", Tt), Tt;
    }
    function on(X, ue, Me, Oe) {
      const Xe = /* @__PURE__ */ Object.create(null);
      function yt(te, ce) {
        return te.keywords[ce];
      }
      function Tt() {
        if (!_e.keywords) {
          Ve.addText(je);
          return;
        }
        let te = 0;
        _e.keywordPatternRe.lastIndex = 0;
        let ce = _e.keywordPatternRe.exec(je), ve = "";
        for (; ce; ) {
          ve += je.substring(te, ce.index);
          const Ie = _t.case_insensitive ? ce[0].toLowerCase() : ce[0], Je = yt(_e, Ie);
          if (Je) {
            const [Ct, gs] = Je;
            if (Ve.addText(ve), ve = "", Xe[Ie] = (Xe[Ie] || 0) + 1, Xe[Ie] <= Va && (qn += gs), Ct.startsWith("_"))
              ve += ce[0];
            else {
              const ms = _t.classNameAliases[Ct] || Ct;
              wt(ce[0], ms);
            }
          } else
            ve += ce[0];
          te = _e.keywordPatternRe.lastIndex, ce = _e.keywordPatternRe.exec(je);
        }
        ve += je.substring(te), Ve.addText(ve);
      }
      function On() {
        if (je === "") return;
        let te = null;
        if (typeof _e.subLanguage == "string") {
          if (!N[_e.subLanguage]) {
            Ve.addText(je);
            return;
          }
          te = on(_e.subLanguage, je, !0, xi[_e.subLanguage]), xi[_e.subLanguage] = /** @type {CompiledMode} */
          te._top;
        } else
          te = gr(je, _e.subLanguage.length ? _e.subLanguage : null);
        _e.relevance > 0 && (qn += te.relevance), Ve.__addSublanguage(te._emitter, te.language);
      }
      function lt() {
        _e.subLanguage != null ? On() : Tt(), je = "";
      }
      function wt(te, ce) {
        te !== "" && (Ve.startScope(ce), Ve.addText(te), Ve.endScope());
      }
      function bi(te, ce) {
        let ve = 1;
        const Ie = ce.length - 1;
        for (; ve <= Ie; ) {
          if (!te._emit[ve]) {
            ve++;
            continue;
          }
          const Je = _t.classNameAliases[te[ve]] || te[ve], Ct = ce[ve];
          Je ? wt(Ct, Je) : (je = Ct, Tt(), je = ""), ve++;
        }
      }
      function wi(te, ce) {
        return te.scope && typeof te.scope == "string" && Ve.openNode(_t.classNameAliases[te.scope] || te.scope), te.beginScope && (te.beginScope._wrap ? (wt(je, _t.classNameAliases[te.beginScope._wrap] || te.beginScope._wrap), je = "") : te.beginScope._multi && (bi(te.beginScope, ce), je = "")), _e = Object.create(te, { parent: { value: _e } }), _e;
      }
      function _i(te, ce, ve) {
        let Ie = _(te.endRe, ve);
        if (Ie) {
          if (te["on:end"]) {
            const Je = new t(te);
            te["on:end"](ce, Je), Je.isMatchIgnored && (Ie = !1);
          }
          if (Ie) {
            for (; te.endsParent && te.parent; )
              te = te.parent;
            return te;
          }
        }
        if (te.endsWithParent)
          return _i(te.parent, ce, ve);
      }
      function us(te) {
        return _e.matcher.regexIndex === 0 ? (je += te[0], 1) : (wr = !0, 0);
      }
      function hs(te) {
        const ce = te[0], ve = te.rule, Ie = new t(ve), Je = [ve.__beforeBegin, ve["on:begin"]];
        for (const Ct of Je)
          if (Ct && (Ct(te, Ie), Ie.isMatchIgnored))
            return us(ce);
        return ve.skip ? je += ce : (ve.excludeBegin && (je += ce), lt(), !ve.returnBegin && !ve.excludeBegin && (je = ce)), wi(ve, te), ve.returnBegin ? 0 : ce.length;
      }
      function ds(te) {
        const ce = te[0], ve = ue.substring(te.index), Ie = _i(_e, te, ve);
        if (!Ie)
          return fi;
        const Je = _e;
        _e.endScope && _e.endScope._wrap ? (lt(), wt(ce, _e.endScope._wrap)) : _e.endScope && _e.endScope._multi ? (lt(), bi(_e.endScope, te)) : Je.skip ? je += ce : (Je.returnEnd || Je.excludeEnd || (je += ce), lt(), Je.excludeEnd && (je = ce));
        do
          _e.scope && Ve.closeNode(), !_e.skip && !_e.subLanguage && (qn += _e.relevance), _e = _e.parent;
        while (_e !== Ie.parent);
        return Ie.starts && wi(Ie.starts, te), Je.returnEnd ? 0 : ce.length;
      }
      function fs() {
        const te = [];
        for (let ce = _e; ce !== _t; ce = ce.parent)
          ce.scope && te.unshift(ce.scope);
        te.forEach((ce) => Ve.openNode(ce));
      }
      let jn = {};
      function ki(te, ce) {
        const ve = ce && ce[0];
        if (je += te, ve == null)
          return lt(), 0;
        if (jn.type === "begin" && ce.type === "end" && jn.index === ce.index && ve === "") {
          if (je += ue.slice(ce.index, ce.index + 1), !Ue) {
            const Ie = new Error(`0 width match regex (${X})`);
            throw Ie.languageName = X, Ie.badRule = jn.rule, Ie;
          }
          return 1;
        }
        if (jn = ce, ce.type === "begin")
          return hs(ce);
        if (ce.type === "illegal" && !Me) {
          const Ie = new Error('Illegal lexeme "' + ve + '" for mode "' + (_e.scope || "<unnamed>") + '"');
          throw Ie.mode = _e, Ie;
        } else if (ce.type === "end") {
          const Ie = ds(ce);
          if (Ie !== fi)
            return Ie;
        }
        if (ce.type === "illegal" && ve === "")
          return je += `
`, 1;
        if (br > 1e5 && br > ce.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return je += ve, ve.length;
      }
      const _t = Lt(X);
      if (!_t)
        throw Te(We.replace("{}", X)), new Error('Unknown language: "' + X + '"');
      const ps = Xa(_t);
      let yr = "", _e = Oe || ps;
      const xi = {}, Ve = new ae.__emitter(ae);
      fs();
      let je = "", qn = 0, Ht = 0, br = 0, wr = !1;
      try {
        if (_t.__emitTokens)
          _t.__emitTokens(ue, Ve);
        else {
          for (_e.matcher.considerAll(); ; ) {
            br++, wr ? wr = !1 : _e.matcher.considerAll(), _e.matcher.lastIndex = Ht;
            const te = _e.matcher.exec(ue);
            if (!te) break;
            const ce = ue.substring(Ht, te.index), ve = ki(ce, te);
            Ht = te.index + ve;
          }
          ki(ue.substring(Ht));
        }
        return Ve.finalize(), yr = Ve.toHTML(), {
          language: X,
          value: yr,
          relevance: qn,
          illegal: !1,
          _emitter: Ve,
          _top: _e
        };
      } catch (te) {
        if (te.message && te.message.includes("Illegal"))
          return {
            language: X,
            value: fr(ue),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: te.message,
              index: Ht,
              context: ue.slice(Ht - 100, Ht + 100),
              mode: te.mode,
              resultSoFar: yr
            },
            _emitter: Ve
          };
        if (Ue)
          return {
            language: X,
            value: fr(ue),
            illegal: !1,
            relevance: 0,
            errorRaised: te,
            _emitter: Ve,
            _top: _e
          };
        throw te;
      }
    }
    function pr(X) {
      const ue = {
        value: fr(X),
        illegal: !1,
        relevance: 0,
        _top: oe,
        _emitter: new ae.__emitter(ae)
      };
      return ue._emitter.addText(X), ue;
    }
    function gr(X, ue) {
      ue = ue || ae.languages || Object.keys(N);
      const Me = pr(X), Oe = ue.filter(Lt).filter(yi).map(
        (lt) => on(lt, X, !1)
      );
      Oe.unshift(Me);
      const Xe = Oe.sort((lt, wt) => {
        if (lt.relevance !== wt.relevance) return wt.relevance - lt.relevance;
        if (lt.language && wt.language) {
          if (Lt(lt.language).supersetOf === wt.language)
            return 1;
          if (Lt(wt.language).supersetOf === lt.language)
            return -1;
        }
        return 0;
      }), [yt, Tt] = Xe, On = yt;
      return On.secondBest = Tt, On;
    }
    function Ja(X, ue, Me) {
      const Oe = ue && J[ue] || Me;
      X.classList.add("hljs"), X.classList.add(`language-${Oe}`);
    }
    function mr(X) {
      let ue = null;
      const Me = Ke(X);
      if (me(Me)) return;
      if (Bn(
        "before:highlightElement",
        { el: X, language: Me }
      ), X.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", X);
        return;
      }
      if (X.children.length > 0 && (ae.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(X)), ae.throwUnescapedHTML))
        throw new Ya(
          "One of your code blocks includes unescaped HTML.",
          X.innerHTML
        );
      ue = X;
      const Oe = ue.textContent, Xe = Me ? Ze(Oe, { language: Me, ignoreIllegals: !0 }) : gr(Oe);
      X.innerHTML = Xe.value, X.dataset.highlighted = "yes", Ja(X, Me, Xe.language), X.result = {
        language: Xe.language,
        // TODO: remove with version 11.0
        re: Xe.relevance,
        relevance: Xe.relevance
      }, Xe.secondBest && (X.secondBest = {
        language: Xe.secondBest.language,
        relevance: Xe.secondBest.relevance
      }), Bn("after:highlightElement", { el: X, result: Xe, text: Oe });
    }
    function es(X) {
      ae = di(ae, X);
    }
    const ts = () => {
      Nn(), Ge("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function ns() {
      Nn(), Ge("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let gi = !1;
    function Nn() {
      function X() {
        Nn();
      }
      if (document.readyState === "loading") {
        gi || window.addEventListener("DOMContentLoaded", X, !1), gi = !0;
        return;
      }
      document.querySelectorAll(ae.cssSelector).forEach(mr);
    }
    function rs(X, ue) {
      let Me = null;
      try {
        Me = ue(x);
      } catch (Oe) {
        if (Te("Language definition for '{}' could not be registered.".replace("{}", X)), Ue)
          Te(Oe);
        else
          throw Oe;
        Me = oe;
      }
      Me.name || (Me.name = X), N[X] = Me, Me.rawDefinition = ue.bind(null, x), Me.aliases && mi(Me.aliases, { languageName: X });
    }
    function is(X) {
      delete N[X];
      for (const ue of Object.keys(J))
        J[ue] === X && delete J[ue];
    }
    function as() {
      return Object.keys(N);
    }
    function Lt(X) {
      return X = (X || "").toLowerCase(), N[X] || N[J[X]];
    }
    function mi(X, { languageName: ue }) {
      typeof X == "string" && (X = [X]), X.forEach((Me) => {
        J[Me.toLowerCase()] = ue;
      });
    }
    function yi(X) {
      const ue = Lt(X);
      return ue && !ue.disableAutodetect;
    }
    function ss(X) {
      X["before:highlightBlock"] && !X["before:highlightElement"] && (X["before:highlightElement"] = (ue) => {
        X["before:highlightBlock"](
          Object.assign({ block: ue.el }, ue)
        );
      }), X["after:highlightBlock"] && !X["after:highlightElement"] && (X["after:highlightElement"] = (ue) => {
        X["after:highlightBlock"](
          Object.assign({ block: ue.el }, ue)
        );
      });
    }
    function os(X) {
      ss(X), we.push(X);
    }
    function ls(X) {
      const ue = we.indexOf(X);
      ue !== -1 && we.splice(ue, 1);
    }
    function Bn(X, ue) {
      const Me = X;
      we.forEach(function(Oe) {
        Oe[Me] && Oe[Me](ue);
      });
    }
    function cs(X) {
      return Ge("10.7.0", "highlightBlock will be removed entirely in v12.0"), Ge("10.7.0", "Please use highlightElement now."), mr(X);
    }
    Object.assign(x, {
      highlight: Ze,
      highlightAuto: gr,
      highlightAll: Nn,
      highlightElement: mr,
      // TODO: Remove with v12 API
      highlightBlock: cs,
      configure: es,
      initHighlighting: ts,
      initHighlightingOnLoad: ns,
      registerLanguage: rs,
      unregisterLanguage: is,
      listLanguages: as,
      getLanguage: Lt,
      registerAliases: mi,
      autoDetection: yi,
      inherit: di,
      addPlugin: os,
      removePlugin: ls
    }), x.debugMode = function() {
      Ue = !1;
    }, x.safeMode = function() {
      Ue = !0;
    }, x.versionString = Ka, x.regex = {
      concat: m,
      lookahead: h,
      either: b,
      optional: g,
      anyNumberOfTimes: f
    };
    for (const X in v)
      typeof v[X] == "object" && e(v[X]);
    return Object.assign(x, v), x;
  }, Vt = pi({});
  return Vt.newInstance = () => pi({}), _r = Vt, Vt.HighlightJS = Vt, Vt.default = Vt, _r;
}
var bs = /* @__PURE__ */ ys();
const Re = /* @__PURE__ */ ea(bs);
class sr {
  /**
   * Create an LRU cache.
   * @param {{maxSize?:number,ttlMs?:number,onEvict?:function}} [opts]
   */
  constructor(t = {}) {
    const { maxSize: n = 0, ttlMs: i = 0, onEvict: r = null } = t || {};
    this._map = /* @__PURE__ */ new Map(), this._maxSize = Math.max(0, Number(n) || 0), this._ttlMs = Math.max(0, Number(i) || 0), this._onEvict = typeof r == "function" ? r : null;
  }
  get size() {
    return this._map.size;
  }
  /**
   * Check if key exists and is not expired.
   * @param {*} key
   * @returns {boolean}
   */
  has(t) {
    const n = this._map.get(t);
    return n ? this._ttlMs && Date.now() - (n.ts || 0) >= this._ttlMs ? (this._evictKey(t, n), !1) : (this._map.delete(t), this._map.set(t, n), !0) : !1;
  }
  /**
   * Get value for key or undefined if missing/expired.
   * @param {*} key
   */
  get(t) {
    const n = this._map.get(t);
    if (n) {
      if (this._ttlMs && Date.now() - (n.ts || 0) >= this._ttlMs) {
        this._evictKey(t, n);
        return;
      }
      return this._map.delete(t), this._map.set(t, n), n.value;
    }
  }
  /**
   * Set a key/value pair and enforce maxSize eviction.
   * @param {*} key
   * @param {*} value
   */
  set(t, n) {
    if (this._map.has(t) && this._map.delete(t), this._map.set(t, { value: n, ts: Date.now() }), this._maxSize && this._map.size > this._maxSize)
      for (; this._map.size > this._maxSize; ) {
        const i = this._map.keys().next().value, r = this._map.get(i);
        if (this._map.delete(i), this._onEvict)
          try {
            this._onEvict(i, r && r.value);
          } catch {
          }
      }
    return this;
  }
  /**
   * Delete key from cache.
   * @param {*} key
   * @returns {boolean}
   */
  delete(t) {
    return this._map.delete(t);
  }
  /**
   * Clear the cache and call eviction callback for each entry.
   */
  clear() {
    if (this._onEvict)
      for (const [t, n] of this._map.entries())
        try {
          this._onEvict(t, n && n.value);
        } catch {
        }
    this._map.clear();
  }
  _evictKey(t, n) {
    try {
      this._map.delete(t);
    } catch {
    }
    if (this._onEvict) try {
      this._onEvict(t, n && n.value);
    } catch {
    }
  }
}
const kr = new sr({ maxSize: 500 });
let ws = 300 * 1e3;
async function Gr(e, t) {
  try {
    if (!e) return null;
    const n = Date.now();
    let i = kr.get(e);
    if (i && i.ok === !1 && n - (i.ts || 0) >= ws && (kr.delete(e), i = void 0), i) {
      if (i.module) return i.module;
      if (i.promise)
        try {
          return await i.promise;
        } catch {
          return null;
        }
    }
    const r = { promise: null, module: null, ok: null, ts: Date.now() };
    kr.set(e, r), r.promise = (async () => {
      try {
        return await t();
      } catch {
        return null;
      }
    })();
    try {
      const a = await r.promise;
      return r.module = a, r.ok = !!a, r.ts = Date.now(), a;
    } catch {
      return r.module = null, r.ok = !1, r.ts = Date.now(), null;
    }
  } catch {
    return null;
  }
}
async function _s(e) {
  return await Gr(e, async () => {
    try {
      return await import(e);
    } catch {
      return null;
    }
  });
}
const ks = "11.11.1", Ce = /* @__PURE__ */ new Map(), xs = "https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md", ht = {
  shell: "bash",
  sh: "bash",
  zsh: "bash",
  js: "javascript",
  ts: "typescript",
  py: "python",
  csharp: "cs",
  "c#": "cs"
};
ht.html = "xml";
ht.xhtml = "xml";
ht.markup = "xml";
const ta = /* @__PURE__ */ new Set(["magic", "undefined"]);
let It = null, Ss = null;
async function na(e = xs) {
  if (e)
    return It || (It = (async () => {
      try {
        const t = await fetch(e);
        if (!t.ok) return;
        const i = (await t.text()).split(/\r?\n/);
        let r = -1;
        for (let c = 0; c < i.length; c++)
          if (/\|\s*Language\s*\|/i.test(i[c])) {
            r = c;
            break;
          }
        if (r === -1) return;
        const a = i[r].replace(/^\||\|$/g, "").split("|").map((c) => c.trim().toLowerCase());
        let s = a.findIndex((c) => /alias|aliases|equivalent|alt|alternates?/i.test(c));
        s === -1 && (s = 1);
        let o = a.findIndex((c) => /file|filename|module|module name|module-name|short|slug/i.test(c));
        if (o === -1) {
          const c = a.findIndex((u) => /language/i.test(u));
          o = c !== -1 ? c : 0;
        }
        let l = [];
        for (let c = r + 1; c < i.length; c++) {
          const u = i[c].trim();
          if (!u || !u.startsWith("|")) break;
          const d = u.replace(/^\||\|$/g, "").split("|").map((p) => p.trim());
          if (d.every((p) => /^-+$/.test(p))) continue;
          const h = d;
          if (!h.length) continue;
          const g = (h[o] || h[0] || "").toString().trim().toLowerCase();
          if (!g || /^-+$/.test(g)) continue;
          Ce.set(g, g);
          const m = h[s] || "";
          if (m) {
            const p = String(m).split(",").map((b) => b.replace(/`/g, "").trim()).filter(Boolean);
            if (p.length) {
              const y = p[0].toLowerCase().replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
              y && /[a-z0-9]/i.test(y) && (Ce.set(y, y), l.push(y));
            }
          }
        }
        try {
          const c = [];
          for (const u of l) {
            const d = String(u || "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
            d && /[a-z0-9]/i.test(d) ? c.push(d) : Ce.delete(u);
          }
          l = c;
        } catch (c) {
          k("[codeblocksManager] cleanup aliases failed", c);
        }
        try {
          let c = 0;
          for (const u of Array.from(Ce.keys())) {
            if (!u || /^-+$/.test(u) || !/[a-z0-9]/i.test(u)) {
              Ce.delete(u), c++;
              continue;
            }
            if (/^[:]+/.test(u)) {
              const d = u.replace(/^[:]+/, "");
              if (d && /[a-z0-9]/i.test(d)) {
                const h = Ce.get(u);
                Ce.delete(u), Ce.set(d, h);
              } else
                Ce.delete(u), c++;
            }
          }
          for (const [u, d] of Array.from(Ce.entries()))
            (!d || /^-+$/.test(d) || !/[a-z0-9]/i.test(d)) && (Ce.delete(u), c++);
          try {
            const u = ":---------------------";
            Ce.has(u) && (Ce.delete(u), c++);
          } catch (u) {
            k("[codeblocksManager] remove sep key failed", u);
          }
          try {
            const u = Array.from(Ce.keys()).sort();
          } catch (u) {
            k("[codeblocksManager] compute supported keys failed", u);
          }
        } catch (c) {
          k("[codeblocksManager] ignored error", c);
        }
      } catch (t) {
        k("[codeblocksManager] loadSupportedLanguages failed", t);
      }
    })(), It);
}
const ln = /* @__PURE__ */ new Set();
async function Cn(e, t) {
  if (It || (async () => {
    try {
      await na();
    } catch (r) {
      k("[codeblocksManager] loadSupportedLanguages (IIFE) failed", r);
    }
  })(), It)
    try {
      await It;
    } catch {
    }
  if (e = e == null ? "" : String(e), e = e.trim(), !e) return !1;
  const n = e.toLowerCase();
  if (ta.has(n)) return !1;
  if (Ce.size && !Ce.has(n)) {
    const r = ht;
    if (!r[n] && !r[e])
      return !1;
  }
  if (ln.has(e)) return !0;
  const i = ht;
  try {
    const r = (t || e || "").toString().replace(/\.js$/i, "").trim(), a = (i[e] || e || "").toString(), s = (i[r] || r || "").toString();
    let o = Array.from(new Set([
      a,
      s,
      r,
      e,
      i[r],
      i[e]
    ].filter(Boolean))).map((u) => String(u).toLowerCase()).filter((u) => u && u !== "undefined");
    Ce.size && (o = o.filter((u) => {
      if (Ce.has(u)) return !0;
      const d = ht[u];
      return !!(d && Ce.has(d));
    }));
    let l = null, c = null;
    for (const u of o)
      try {
        if (l = await Gr(u, async () => {
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
                return await import(`https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${u}.js`);
              } catch {
                try {
                  return await import(`https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${u}.js`);
                } catch {
                  return null;
                }
              }
            }
          } catch {
            return null;
          }
        }), l) {
          const d = l.default || l;
          try {
            const h = Ce.size && Ce.get(e) || u || e;
            return Re.registerLanguage(h, d), ln.add(h), h !== e && (Re.registerLanguage(e, d), ln.add(e)), !0;
          } catch (h) {
            c = h;
          }
        } else
          try {
            if (Ce.has(u) || Ce.has(e)) {
              const d = () => ({});
              try {
                Re.registerLanguage(u, d), ln.add(u);
              } catch {
              }
              try {
                u !== e && (Re.registerLanguage(e, d), ln.add(e));
              } catch {
              }
              return !0;
            }
          } catch {
          }
      } catch (d) {
        c = d;
      }
    if (c)
      throw c;
    return !1;
  } catch {
    return !1;
  }
}
let Hn = null;
function vs(e) {
  const t = e && e.querySelector ? e : typeof document < "u" ? document : null;
  It || (async () => {
    try {
      await na();
    } catch (s) {
      k("[codeblocksManager] loadSupportedLanguages (observer) failed", s);
    }
  })();
  const n = ht, r = Hn || (typeof IntersectionObserver > "u" ? null : (Hn = new IntersectionObserver((s, o) => {
    s.forEach((l) => {
      if (!l.isIntersecting) return;
      const c = l.target;
      try {
        o.unobserve(c);
      } catch (u) {
        k("[codeblocksManager] observer unobserve failed", u);
      }
      (async () => {
        try {
          const u = c.getAttribute && c.getAttribute("class") || c.className || "", d = u.match(/language-([a-zA-Z0-9_+-]+)/) || u.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (d && d[1]) {
            const h = (d[1] || "").toLowerCase(), f = n[h] || h, g = Ce.size && (Ce.get(f) || Ce.get(String(f).toLowerCase())) || f;
            try {
              await Cn(g);
            } catch (m) {
              k("[codeblocksManager] registerLanguage failed", m);
            }
            try {
              try {
                const m = c.textContent || c.innerText || "";
                m != null && (c.textContent = m);
              } catch {
              }
              try {
                c && c.dataset && c.dataset.highlighted && delete c.dataset.highlighted;
              } catch {
              }
              Re.highlightElement(c);
            } catch (m) {
              k("[codeblocksManager] hljs.highlightElement failed", m);
            }
          } else
            try {
              const h = c.textContent || "";
              try {
                if (Re && typeof Re.getLanguage == "function" && Re.getLanguage("plaintext")) {
                  const f = Re.highlight(h, { language: "plaintext" });
                  if (f && f.value)
                    try {
                      if (typeof document < "u" && document.createRange && typeof document.createRange == "function") {
                        const g = document.createRange().createContextualFragment(f.value);
                        if (typeof c.replaceChildren == "function") c.replaceChildren(...Array.from(g.childNodes));
                        else {
                          for (; c.firstChild; ) c.removeChild(c.firstChild);
                          c.appendChild(g);
                        }
                      } else
                        c.innerHTML = f.value;
                    } catch {
                      try {
                        c.innerHTML = f.value;
                      } catch {
                      }
                    }
                }
              } catch {
                try {
                  Re.highlightElement(c);
                } catch (g) {
                  k("[codeblocksManager] fallback highlightElement failed", g);
                }
              }
            } catch (h) {
              k("[codeblocksManager] auto-detect plaintext failed", h);
            }
        } catch (u) {
          k("[codeblocksManager] observer entry processing failed", u);
        }
      })();
    });
  }, { root: null, rootMargin: "300px", threshold: 0.1 }), Hn)), a = t && t.querySelectorAll ? t.querySelectorAll("pre code") : [];
  if (!r) {
    a.forEach(async (s) => {
      try {
        const o = s.getAttribute && s.getAttribute("class") || s.className || "", l = o.match(/language-([a-zA-Z0-9_+-]+)/) || o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (l && l[1]) {
          const c = (l[1] || "").toLowerCase(), u = n[c] || c, d = Ce.size && (Ce.get(u) || Ce.get(String(u).toLowerCase())) || u;
          try {
            await Cn(d);
          } catch (h) {
            k("[codeblocksManager] registerLanguage failed (no observer)", h);
          }
        }
        try {
          try {
            const c = s.textContent || s.innerText || "";
            c != null && (s.textContent = c);
          } catch {
          }
          try {
            s && s.dataset && s.dataset.highlighted && delete s.dataset.highlighted;
          } catch {
          }
          Re.highlightElement(s);
        } catch (c) {
          k("[codeblocksManager] hljs.highlightElement failed (no observer)", c);
        }
      } catch (o) {
        k("[codeblocksManager] loadSupportedLanguages fallback ignored error", o);
      }
    });
    return;
  }
  a.forEach((s) => {
    try {
      r.observe(s);
    } catch (o) {
      k("[codeblocksManager] observe failed", o);
    }
  });
}
function uc(e, { useCdn: t = !0 } = {}) {
  const n = typeof document < "u" && document.head && document.head.querySelector ? document.head.querySelector("link[data-hl-theme]") : typeof document < "u" ? document.querySelector("link[data-hl-theme]") : null, i = n && n.getAttribute ? n.getAttribute("data-hl-theme") : null, r = e == null ? "default" : String(e), a = r && String(r).toLowerCase() || "";
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
      k("Requested highlight theme not bundled; set useCdn=true to load theme from CDN");
    } catch {
    }
    return;
  }
  const s = a, o = `https://cdn.jsdelivr.net/npm/highlight.js@${ks}/styles/${s}.css`, l = document.createElement("link");
  l.rel = "stylesheet", l.href = o, l.setAttribute("data-hl-theme", s), l.addEventListener("load", () => {
    try {
      n && n.parentNode && n.parentNode.removeChild(n);
    } catch {
    }
  }), document.head.appendChild(l);
}
let Ft = "light";
function As(e, t = {}) {
  if (document.querySelector(`link[href="${e}"]`)) return;
  const n = document.createElement("link");
  if (n.rel = "stylesheet", n.href = e, Object.entries(t).forEach(([i, r]) => n.setAttribute(i, r)), document.head.appendChild(n), t["data-bulmaswatch-theme"])
    try {
      if (n.getAttribute("data-bulmaswatch-observer")) return;
      let i = Number(n.getAttribute("data-bulmaswatch-move-count") || 0), r = !1;
      const a = new MutationObserver(() => {
        try {
          if (r) return;
          const o = n.parentNode;
          if (!o || o.lastElementChild === n) return;
          if (i >= 1e3) {
            n.setAttribute("data-bulmaswatch-move-stopped", "1");
            return;
          }
          r = !0;
          try {
            o.appendChild(n);
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
function xr() {
  try {
    const e = typeof document < "u" && document.head ? document.head : document, t = Array.from(e.querySelectorAll("link[data-bulmaswatch-theme]"));
    for (const n of t) n && n.parentNode && n.parentNode.removeChild(n);
  } catch {
  }
  try {
    const e = typeof document < "u" && document.head ? document.head : document, t = Array.from(e.querySelectorAll("style[data-bulma-override]"));
    for (const n of t) n && n.parentNode && n.parentNode.removeChild(n);
  } catch {
  }
}
async function Es(e = "none", t = "/") {
  try {
    Bt("[bulmaManager] ensureBulma called", { bulmaCustomize: e, pageDir: t });
  } catch {
  }
  if (!e) return;
  if (e === "none") {
    try {
      xr();
    } catch {
    }
    return;
  }
  const n = [t + "bulma.css", "/bulma.css"], i = Array.from(new Set(n));
  if (e === "local") {
    if (xr(), document.querySelector("style[data-bulma-override]")) return;
    for (const r of i)
      try {
        const a = await fetch(r, { method: "GET" });
        if (a.ok) {
          const s = await a.text(), o = document.createElement("style");
          o.setAttribute("data-bulma-override", r), o.appendChild(document.createTextNode(`
/* bulma override: ${r} */
` + s)), document.head.appendChild(o);
          return;
        }
      } catch (a) {
        k("[bulmaManager] fetch local bulma candidate failed", a);
      }
    return;
  }
  try {
    const r = String(e).trim();
    if (!r) return;
    xr();
    const a = `https://unpkg.com/bulmaswatch/${encodeURIComponent(r)}/bulmaswatch.min.css`;
    As(a, { "data-bulmaswatch-theme": r });
  } catch (r) {
    k("[bulmaManager] ensureBulma failed", r);
  }
}
function Cs(e) {
  Ft = e === "dark" ? "dark" : e === "system" ? "system" : "light";
  try {
    const t = Array.from(document.querySelectorAll(".nimbi-mount"));
    if (t.length > 0)
      for (const n of t)
        Ft === "dark" ? n.setAttribute("data-theme", "dark") : Ft === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    else {
      const n = document.documentElement;
      Ft === "dark" ? n.setAttribute("data-theme", "dark") : Ft === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    }
  } catch {
  }
}
function hc(e) {
  const t = document.documentElement;
  for (const [n, i] of Object.entries(e || {}))
    try {
      t.style.setProperty(`--${n}`, i);
    } catch (r) {
      k("[bulmaManager] setThemeVars failed for", n, r);
    }
}
function ra(e) {
  if (!e || !(e instanceof HTMLElement)) return () => {
  };
  const t = e.closest && e.closest(".nimbi-mount") || null;
  try {
    t && (Ft === "dark" ? t.setAttribute("data-theme", "dark") : Ft === "light" ? t.setAttribute("data-theme", "light") : t.removeAttribute("data-theme"));
  } catch {
  }
  return () => {
  };
}
const ia = {
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
}, tn = JSON.parse(JSON.stringify(ia));
let Vn = "en";
if (typeof navigator < "u") {
  const e = navigator.language || navigator.languages && navigator.languages[0] || "en";
  Vn = String(e).split("-")[0].toLowerCase();
}
ia[Vn] || (Vn = "en");
let Ot = Vn;
function fn(e, t = {}) {
  const n = tn[Ot] || tn.en;
  let i = n && n[e] ? n[e] : tn.en[e] || "";
  for (const r of Object.keys(t))
    i = i.replace(new RegExp(`{${r}}`, "g"), String(t[r]));
  return i;
}
async function aa(e, t) {
  if (!e) return;
  let n = e;
  try {
    /^https?:\/\//.test(e) || (n = new URL(e, location.origin + t).toString());
    const i = await fetch(n);
    if (!i.ok) return;
    const r = await i.json();
    for (const a of Object.keys(r || {}))
      tn[a] = Object.assign({}, tn[a] || {}, r[a]);
  } catch {
  }
}
function sa(e) {
  const t = String(e).split("-")[0].toLowerCase();
  Ot = tn[t] ? t : "en";
}
const Ms = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get currentLang() {
    return Ot;
  },
  loadL10nFile: aa,
  setLang: sa,
  t: fn
}, Symbol.toStringTag, { value: "Module" }));
function Ls(e) {
  try {
    return String(e || "").split("/").map((t) => encodeURIComponent(t)).join("/");
  } catch {
    return String(e || "");
  }
}
function Ci(e, t = null, n = void 0) {
  let r = "#/" + Ls(String(e || ""));
  t && (r += "#" + encodeURIComponent(String(t)));
  try {
    let a = "";
    if (typeof n == "string")
      a = n;
    else if (typeof location < "u" && location && location.search)
      a = location.search;
    else if (typeof location < "u" && location && location.hash)
      try {
        const s = it(location.href);
        s && s.params && (a = s.params);
      } catch {
      }
    if (a) {
      const s = typeof a == "string" && a.startsWith("?") ? a.slice(1) : a;
      try {
        const o = new URLSearchParams(s);
        o.delete("page");
        const l = o.toString();
        l && (r += "?" + l);
      } catch {
        const l = String(s || "").replace(/^page=[^&]*&?/, "");
        l && (r += "?" + l);
      }
    }
  } catch {
  }
  return r;
}
function it(e) {
  try {
    const t = new URL(e, typeof location < "u" ? location.href : "http://localhost/"), n = t.searchParams.get("page");
    if (n) {
      let r = null, a = "";
      if (t.hash) {
        const c = t.hash.replace(/^#/, "");
        if (c.includes("&")) {
          const u = c.split("&");
          r = u.shift() || null, a = u.join("&");
        } else
          r = c || null;
      }
      const s = new URLSearchParams(t.search);
      s.delete("page");
      const l = [s.toString(), a].filter(Boolean).join("&");
      return { type: "canonical", page: decodeURIComponent(n), anchor: r, params: l };
    }
    const i = t.hash ? decodeURIComponent(t.hash.replace(/^#/, "")) : "";
    if (i && i.startsWith("/")) {
      let r = i, a = "";
      if (r.indexOf("?") !== -1) {
        const c = r.split("?");
        r = c.shift() || "", a = c.join("?") || "";
      }
      let s = r, o = null;
      if (s.indexOf("#") !== -1) {
        const c = s.split("#");
        s = c.shift() || "", o = c.join("#") || null;
      }
      return { type: "cosmetic", page: s.replace(/^\/+/, "") || null, anchor: o, params: a };
    }
    return { type: "path", page: (t.pathname || "").replace(/^\//, "") || null, anchor: t.hash ? t.hash.replace(/^#/, "") : null, params: t.search ? t.search.replace(/^\?/, "") : "" };
  } catch {
    return { type: "unknown", page: e, anchor: null, params: "" };
  }
}
let Fn = typeof DOMParser < "u" ? new DOMParser() : null;
function He() {
  return Fn || (typeof DOMParser < "u" ? (Fn = new DOMParser(), Fn) : null);
}
async function Mn(e, t, n = 4) {
  if (!Array.isArray(e) || e.length === 0) return [];
  const i = new Array(e.length);
  let r = 0;
  const a = [], s = Math.max(1, Number(n) || 1);
  async function o() {
    for (; ; ) {
      const l = r++;
      if (l >= e.length) return;
      try {
        i[l] = await t(e[l], l);
      } catch {
        i[l] = void 0;
      }
    }
  }
  for (let l = 0; l < Math.min(s, e.length); l++) a.push(o());
  return await Promise.all(a), i;
}
const Ts = `/**
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
function Rs(e, t = "worker") {
  let n = null;
  function i(...l) {
    try {
      k(...l);
    } catch {
    }
  }
  function r() {
    if (!n)
      try {
        const l = e();
        n = l || null, l && l.addEventListener("error", () => {
          try {
            n === l && (n = null, l.terminate && l.terminate());
          } catch (c) {
            i("[" + t + "] worker termination failed", c);
          }
        });
      } catch (l) {
        n = null, i("[" + t + "] worker init failed", l);
      }
    return n;
  }
  function a() {
    try {
      n && (n.terminate && n.terminate(), n = null);
    } catch (l) {
      i("[" + t + "] worker termination failed", l);
    }
  }
  function s(l, c = 1e4) {
    return new Promise((u, d) => {
      const h = r();
      if (!h) return d(new Error("worker unavailable"));
      const f = String(Math.random()), g = Object.assign({}, l, { id: f });
      let m = null;
      const p = () => {
        m && clearTimeout(m), h.removeEventListener("message", b), h.removeEventListener("error", y);
      }, b = (_) => {
        const w = _.data || {};
        w.id === f && (p(), w.error ? d(new Error(w.error)) : u(w.result));
      }, y = (_) => {
        p(), i("[" + t + "] worker error event", _);
        try {
          n === h && (n = null, h.terminate && h.terminate());
        } catch (w) {
          i("[" + t + "] worker termination failed", w);
        }
        d(new Error(_ && _.message || "worker error"));
      };
      m = setTimeout(() => {
        p(), i("[" + t + "] worker timed out");
        try {
          n === h && (n = null, h.terminate && h.terminate());
        } catch (_) {
          i("[" + t + "] worker termination on timeout failed", _);
        }
        d(new Error("worker timeout"));
      }, c), h.addEventListener("message", b), h.addEventListener("error", y);
      try {
        h.postMessage(g);
      } catch (_) {
        p(), d(_);
      }
    });
  }
  return { get: r, send: s, terminate: a };
}
function oa(e, t = "worker-pool", n = 2) {
  const i = new Array(n).fill(null);
  let r = 0;
  function a(...g) {
    try {
      k(...g);
    } catch {
    }
  }
  function s(g) {
    if (!i[g])
      try {
        const m = e();
        i[g] = m || null, m && m.addEventListener("error", () => {
          try {
            i[g] === m && (i[g] = null, m.terminate && m.terminate());
          } catch (p) {
            a("[" + t + "] worker termination failed", p);
          }
        });
      } catch (m) {
        i[g] = null, a("[" + t + "] worker init failed", m);
      }
    return i[g];
  }
  const o = new Array(n).fill(0), l = new Array(n).fill(null), c = 30 * 1e3;
  function u(g) {
    try {
      o[g] = Date.now(), l[g] && (clearTimeout(l[g]), l[g] = null), l[g] = setTimeout(() => {
        try {
          i[g] && (i[g].terminate && i[g].terminate(), i[g] = null);
        } catch (m) {
          a("[" + t + "] idle termination failed", m);
        }
        l[g] = null;
      }, c);
    } catch {
    }
  }
  function d() {
    for (let g = 0; g < i.length; g++) {
      const m = s(g);
      if (m) return m;
    }
    return null;
  }
  function h() {
    for (let g = 0; g < i.length; g++)
      try {
        i[g] && (i[g].terminate && i[g].terminate(), i[g] = null);
      } catch (m) {
        a("[" + t + "] worker termination failed", m);
      }
  }
  function f(g, m = 1e4) {
    return new Promise((p, b) => {
      const y = r++ % i.length, _ = (w) => {
        const A = (y + w) % i.length, S = s(A);
        if (!S)
          return w + 1 < i.length ? _(w + 1) : b(new Error("worker pool unavailable"));
        const M = String(Math.random()), I = Object.assign({}, g, { id: M });
        let q = null;
        const Q = () => {
          q && clearTimeout(q), S.removeEventListener("message", R), S.removeEventListener("error", O);
        }, R = (G) => {
          const re = G.data || {};
          re.id === M && (Q(), re.error ? b(new Error(re.error)) : p(re.result));
        }, O = (G) => {
          Q(), a("[" + t + "] worker error event", G);
          try {
            i[A] === S && (i[A] = null, S.terminate && S.terminate());
          } catch (re) {
            a("[" + t + "] worker termination failed", re);
          }
          b(new Error(G && G.message || "worker error"));
        };
        q = setTimeout(() => {
          Q(), a("[" + t + "] worker timed out");
          try {
            i[A] === S && (i[A] = null, S.terminate && S.terminate());
          } catch (G) {
            a("[" + t + "] worker termination on timeout failed", G);
          }
          b(new Error("worker timeout"));
        }, m), S.addEventListener("message", R), S.addEventListener("error", O);
        try {
          u(A), S.postMessage(I);
        } catch (G) {
          Q(), b(G);
        }
      };
      _(0);
    });
  }
  return { get: d, send: f, terminate: h };
}
function zs(e, t, n = "worker") {
  return Rs(() => {
    try {
      const a = Zt(e);
      if (a)
        try {
          if (!(typeof process < "u" && process.env && process.env.VITEST)) return a;
        } catch {
          return a;
        }
    } catch {
    }
    if (typeof t != "function") return null;
    const r = { message: [], error: [] };
    return {
      addEventListener(a, s) {
        r[a] || (r[a] = []), r[a].push(s);
      },
      removeEventListener(a, s) {
        if (!r[a]) return;
        const o = r[a].indexOf(s);
        o !== -1 && r[a].splice(o, 1);
      },
      postMessage(a) {
        setTimeout(async () => {
          try {
            const o = { data: await t(a) };
            (r.message || []).forEach((l) => l(o));
          } catch (s) {
            const o = { data: { id: a && a.id, error: String(s) } };
            (r.message || []).forEach((l) => l(o));
          }
        }, 0);
      },
      terminate() {
        Object.keys(r).forEach((a) => r[a].length = 0);
      }
    };
  }, n);
}
function Zt(e) {
  try {
    if (typeof Blob < "u" && typeof URL < "u" && e)
      try {
        Zt._blobUrlCache || (Zt._blobUrlCache = new sr({ maxSize: 200, onEvict: (i, r) => {
          try {
            typeof URL < "u" && r && URL.revokeObjectURL(r);
          } catch {
          }
        } }));
        const t = Zt._blobUrlCache;
        let n = t.get(e);
        if (!n) {
          const i = new Blob([e], { type: "application/javascript" });
          n = URL.createObjectURL(i), t.set(e, n);
        }
        return new Worker(n, { type: "module" });
      } catch (t) {
        try {
          k("[worker-manager] createWorkerFromRaw failed", t);
        } catch {
        }
      }
  } catch (t) {
    try {
      k("[worker-manager] createWorkerFromRaw failed", t);
    } catch {
    }
  }
  return null;
}
function Ps() {
  return typeof requestIdleCallback == "function" ? new Promise((e) => {
    try {
      requestIdleCallback(e, { timeout: 50 });
    } catch {
      setTimeout(e, 0);
    }
  }) : new Promise((e) => setTimeout(e, 0));
}
async function Pt(e, t = 50) {
  try {
    if (!e || !t) return;
    e % t === 0 && await Ps();
  } catch {
  }
}
const rt = /* @__PURE__ */ new Set();
function Gt(e) {
  if ($s(), rt.clear(), Array.isArray(Ne) && Ne.length)
    for (const t of Ne)
      t && rt.add(t);
  else
    for (const t of ze)
      t && rt.add(t);
  Mi(K), Mi(U), Gt._refreshed = !0;
}
function Mi(e) {
  if (!(!e || typeof e.values != "function"))
    for (const t of e.values())
      t && rt.add(t);
}
function Li(e) {
  if (!e || typeof e.set != "function") return;
  const t = e.set;
  e.set = function(n, i) {
    return i && rt.add(i), t.call(this, n, i);
  };
}
let Ti = !1;
function $s() {
  Ti || (Li(K), Li(U), Ti = !0);
}
const Sr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  indexSet: rt,
  refreshIndexPaths: Gt
}, Symbol.toStringTag, { value: "Module" }));
function an(e, t = 1e3) {
  const n = /* @__PURE__ */ new Map();
  function i(r) {
    const a = r === void 0 ? "__undefined" : String(r);
    if (n.has(a)) {
      const o = n.get(a);
      return n.delete(a), n.set(a, o), o;
    }
    const s = e(r);
    try {
      if (n.set(a, s), n.size > t) {
        const o = n.keys().next().value;
        n.delete(o);
      }
    } catch {
    }
    return s;
  }
  return i._cache = n, i._reset = () => n.clear(), i;
}
function Rr(e) {
  return !e || typeof e != "string" ? !1 : /^(https?:)?\/\//.test(e) || e.startsWith("mailto:") || e.startsWith("tel:");
}
const Y = an(function(e) {
  return String(e || "").replace(/^[.\/]+/, "");
}, 2e3), nn = an(function(e) {
  return String(e || "").replace(/\/+$/, "");
}, 2e3), Qt = an(function(e) {
  return nn(String(e || "")) + "/";
}, 2e3);
function Is(e) {
  try {
    if (!e || typeof document > "u" || !document.head || e.startsWith("data:") || document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`)) return;
    const n = document.createElement("link");
    n.rel = "preload", n.as = "image", n.href = e, document.head.appendChild(n);
  } catch (t) {
    k("[helpers] preloadImage failed", t);
  }
}
function Dn(e, t = 0, n = !1) {
  try {
    if (typeof window > "u" || !e || !e.querySelectorAll) return;
    const i = Array.from(e.querySelectorAll("img"));
    if (!i.length) return;
    const r = e, a = r && r.getBoundingClientRect ? r.getBoundingClientRect() : null, s = 0, o = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, l = a ? Math.max(s, a.top) : s, u = (a ? Math.min(o, a.bottom) : o) + Number(t || 0);
    let d = 0;
    r && (d = r.clientHeight || (a ? a.height : 0)), d || (d = o - s);
    let h = 0.6;
    try {
      const p = r && window.getComputedStyle ? window.getComputedStyle(r) : null, b = p && p.getPropertyValue("--nimbi-image-max-height-ratio"), y = b ? parseFloat(b) : NaN;
      !Number.isNaN(y) && y > 0 && y <= 1 && (h = y);
    } catch (p) {
      k("[helpers] read CSS ratio failed", p);
    }
    const f = Math.max(200, Math.floor(d * h));
    let g = !1, m = null;
    if (i.forEach((p) => {
      try {
        const b = p.getAttribute ? p.getAttribute("loading") : void 0;
        b !== "eager" && p.setAttribute && p.setAttribute("loading", "lazy");
        const y = p.getBoundingClientRect ? p.getBoundingClientRect() : null, _ = p.src || p.getAttribute && p.getAttribute("src"), w = y && y.height > 1 ? y.height : f, A = y ? y.top : 0, S = A + w;
        y && w > 0 && A <= u && S >= l && (p.setAttribute ? (p.setAttribute("loading", "eager"), p.setAttribute("fetchpriority", "high"), p.setAttribute("data-eager-by-nimbi", "1")) : (p.loading = "eager", p.fetchPriority = "high"), Is(_), g = !0), !m && y && y.top <= u && (m = { img: p, src: _, rect: y, beforeLoading: b });
      } catch (b) {
        k("[helpers] setEagerForAboveFoldImages per-image failed", b);
      }
    }), !g && m) {
      const { img: p, src: b, rect: y, beforeLoading: _ } = m;
      try {
        p.setAttribute ? (p.setAttribute("loading", "eager"), p.setAttribute("fetchpriority", "high"), p.setAttribute("data-eager-by-nimbi", "1")) : (p.loading = "eager", p.fetchPriority = "high");
      } catch (w) {
        k("[helpers] setEagerForAboveFoldImages fallback failed", w);
      }
    }
  } catch (i) {
    k("[helpers] setEagerForAboveFoldImages failed", i);
  }
}
function $e(e, t = null, n) {
  try {
    const i = typeof n == "string" ? n : typeof window < "u" && window.location ? window.location.search : "", r = new URLSearchParams(i.startsWith("?") ? i.slice(1) : i), a = String(e || "");
    r.delete("page");
    const s = new URLSearchParams();
    s.set("page", a);
    for (const [c, u] of r.entries())
      s.append(c, u);
    const o = s.toString();
    let l = o ? `?${o}` : "";
    return t && (l += `#${encodeURIComponent(t)}`), l || `?page=${encodeURIComponent(a)}`;
  } catch {
    const r = `?page=${encodeURIComponent(String(e || ""))}`;
    return t ? `${r}#${encodeURIComponent(t)}` : r;
  }
}
an(function(e) {
  try {
    const t = String(e || "");
    return t.includes("%") ? t : encodeURI(t);
  } catch (t) {
    return k("[helpers] encodeURL failed", t), String(e || "");
  }
}, 2e3);
function Jn(e) {
  try {
    const t = e();
    return t && typeof t.then == "function" ? t.catch((n) => {
      k("[helpers] safe swallowed error", n);
    }) : t;
  } catch (t) {
    k("[helpers] safe swallowed error", t);
  }
}
try {
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = Jn);
} catch (e) {
  k("[helpers] global attach failed", e);
}
const Ns = an(function(e) {
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
}, 2e3), K = /* @__PURE__ */ new Map();
let st = [], Xr = !1;
function Bs(e) {
  Xr = !!e;
}
function la(e) {
  st = Array.isArray(e) ? e.slice() : [];
}
function Os() {
  return st;
}
const or = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2, ca = oa(() => Zt(Ts), "slugManager", or);
function js() {
  try {
    if (Wr()) return !0;
  } catch {
  }
  try {
    return !!(typeof le == "string" && le);
  } catch {
    return !1;
  }
}
function fe(...e) {
  try {
    Bt(...e);
  } catch {
  }
}
function qs() {
  return ca.get();
}
function ua(e) {
  return ca.send(e, 5e3);
}
async function zr(e, t = 1, n = void 0) {
  const i = await Promise.resolve().then(() => at);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return await ua({ type: "buildSearchIndex", contentBase: e, indexDepth: t, noIndexing: n });
}
async function Hs(e, t, n) {
  const i = await Promise.resolve().then(() => at);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return ua({ type: "crawlForSlug", slug: e, base: t, maxQueue: n });
}
function nt(e, t) {
  if (!e) return;
  let n = null;
  try {
    n = Y(typeof t == "string" ? t : String(t || ""));
  } catch {
    n = String(t || "");
  }
  if (n) {
    try {
      if (st && st.length) {
        const r = String(n).split("/")[0], a = st.includes(r);
        let s = K.get(e);
        if (!s || typeof s == "string")
          s = { default: typeof s == "string" ? Y(s) : void 0, langs: {} };
        else
          try {
            s.default && (s.default = Y(s.default));
          } catch {
          }
        a ? s.langs[r] = n : s.default = n, K.set(e, s);
      } else {
        const i = K.has(e) ? K.get(e) : void 0;
        if (!i)
          K.set(e, n);
        else {
          let r = null;
          try {
            typeof i == "string" ? r = Y(i) : i && typeof i == "object" && (r = i.default ? Y(i.default) : null);
          } catch {
            r = null;
          }
          if (r === n)
            K.set(e, n);
          else {
            let a = null, s = 2;
            for (; a = `${e}-${s}`, !!K.has(a); ) {
              let o = K.get(a), l = null;
              try {
                typeof o == "string" ? l = Y(o) : o && typeof o == "object" && (l = o.default ? Y(o.default) : null);
              } catch {
                l = null;
              }
              if (l === n) {
                e = a;
                break;
              }
              if (s += 1, s > 1e4) break;
            }
            try {
              if (!K.has(a))
                K.set(a, n), e = a;
              else if (K.get(a) === n) e = a;
              else {
                const o = /* @__PURE__ */ new Set();
                for (const c of K.keys()) o.add(c);
                const l = typeof Xt == "function" ? Xt(e, o) : `${e}-2`;
                K.set(l, n), e = l;
              }
            } catch {
            }
          }
        }
      }
    } catch {
    }
    try {
      if (n) {
        try {
          U.set(n, e);
        } catch {
        }
        try {
          if (ze && typeof ze.has == "function") {
            if (!ze.has(n)) {
              try {
                ze.add(n);
              } catch {
              }
              try {
                Array.isArray(Ne) && !Ne.includes(n) && Ne.push(n);
              } catch {
              }
            }
          } else
            try {
              Array.isArray(Ne) && !Ne.includes(n) && Ne.push(n);
            } catch {
            }
        } catch {
        }
      }
    } catch {
    }
  }
}
const lr = /* @__PURE__ */ new Set();
function Fs(e) {
  typeof e == "function" && lr.add(e);
}
function Ds(e) {
  typeof e == "function" && lr.delete(e);
}
const U = /* @__PURE__ */ new Map();
let Pr = {}, Ne = [];
const ze = /* @__PURE__ */ new Set();
let le = "_404.md", bt = null;
const Qr = "_home";
function ha(e) {
  if (e == null) {
    le = null;
    return;
  }
  le = String(e || "");
}
function da(e) {
  if (e == null) {
    bt = null;
    return;
  }
  bt = String(e || "");
}
function Us(e) {
  Pr = e || {};
}
function fa(e) {
  try {
    if (Array.isArray(ne) || (ne = []), !Array.isArray(e)) return;
    try {
      Array.isArray(ne) || (ne = []), ne.length = 0;
      for (const t of e) ne.push(t);
      try {
        if (typeof window < "u")
          try {
            window.__nimbiLiveSearchIndex = ne;
          } catch {
          }
      } catch {
      }
    } catch (t) {
      fe("[slugManager] replacing searchIndex by assignment fallback", t);
      try {
        ne = Array.from(e);
      } catch {
      }
    }
  } catch {
  }
}
const mn = /* @__PURE__ */ new Map(), er = /* @__PURE__ */ new Set();
function Ws() {
  mn.clear(), er.clear();
}
function Zs(e) {
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
const he = an(function(e) {
  let n = String(e || "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return n = n.replace(/(?:-?)(?:md|html)$/, ""), n = n.replace(/-+/g, "-"), n = n.replace(/^-|-$/g, ""), n.length > 80 && (n = n.slice(0, 80).replace(/-+$/g, "")), n;
}, 2e3);
function Kr(e) {
  K.clear(), U.clear(), Ne = [];
  try {
    ze.clear();
  } catch {
  }
  st = st || [];
  const t = Object.keys(Pr || {});
  if (!t.length) return;
  let n = "";
  try {
    if (e) {
      try {
        /^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? n = new URL(String(e)).pathname : n = String(e || "");
      } catch (i) {
        n = String(e || ""), fe("[slugManager] parse contentBase failed", i);
      }
      n = Qt(n);
    }
  } catch (i) {
    n = "", fe("[slugManager] setContentBase prefix derivation failed", i);
  }
  n || (n = Zs(t));
  for (const i of t) {
    let r = i;
    n && i.startsWith(n) ? r = Y(i.slice(n.length)) : r = Y(i), Ne.push(r);
    try {
      ze.add(r);
    } catch {
    }
    try {
      Gt();
    } catch (s) {
      fe("[slugManager] refreshIndexPaths failed", s);
    }
    const a = Pr[i];
    if (typeof a == "string") {
      const s = (a || "").match(/^#\s+(.+)$/m);
      if (s && s[1]) {
        const o = he(s[1].trim());
        if (o)
          try {
            let l = o;
            if ((!st || !st.length) && (l = Xt(l, new Set(K.keys()))), st && st.length) {
              const u = r.split("/")[0], d = st.includes(u);
              let h = K.get(l);
              (!h || typeof h == "string") && (h = { default: typeof h == "string" ? h : void 0, langs: {} }), d ? h.langs[u] = r : h.default = r, K.set(l, h);
            } else
              K.set(l, r);
            U.set(r, l);
          } catch (l) {
            fe("[slugManager] set slug mapping failed", l);
          }
      }
    }
  }
}
try {
  Kr();
} catch (e) {
  fe("[slugManager] initial setContentBase failed", e);
}
function Xt(e, t) {
  if (!t.has(e)) return e;
  let n = 2, i = `${e}-${n}`;
  for (; t.has(i); )
    n += 1, i = `${e}-${n}`;
  return i;
}
function Gs(e) {
  return Pn(e, void 0);
}
function Pn(e, t) {
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
function Gn(e) {
  return e == null ? e : String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g, (t, n) => n);
}
function rn(e) {
  if (!e || !K.has(e)) return null;
  const t = K.get(e);
  if (!t) return null;
  if (typeof t == "string") return t;
  if (st && st.length && Ot && t.langs && t.langs[Ot])
    return t.langs[Ot];
  if (t.default) return t.default;
  if (t.langs) {
    const n = Object.keys(t.langs);
    if (n.length) return t.langs[n[0]];
  }
  return null;
}
const ft = new sr({ maxSize: 2e3 });
function Xs() {
  ft.clear(), jt.clear();
}
const jt = new sr({ maxSize: 2e3 });
let pa = 60 * 1e3;
function Qs(e) {
  pa = Number(e) || 0;
}
function Ks(e) {
  try {
    const t = Math.max(0, Number(e) || 0);
    ft && typeof ft._maxSize < "u" && (ft._maxSize = t);
  } catch {
  }
}
function Ys(e) {
  try {
    const t = Math.max(0, Number(e) || 0);
    ft && typeof ft._ttlMs < "u" && (ft._ttlMs = t);
  } catch {
  }
}
function Vs(e) {
  try {
    const t = Math.max(0, Number(e) || 0);
    jt && typeof jt._maxSize < "u" && (jt._maxSize = t);
  } catch {
  }
}
let $r = Math.max(1, Math.min(or, 5));
function Js(e) {
  try {
    $r = Math.max(1, Number(e) || 1);
  } catch {
    $r = 1;
  }
}
function yn() {
  return $r;
}
let Be = async function(e, t, n) {
  if (!e) throw new Error("path required");
  try {
    if (typeof e == "string" && (e.indexOf("?page=") !== -1 || e.startsWith("?") || e.startsWith("#/") || e.indexOf("#/") !== -1))
      try {
        const c = it(e);
        c && c.page && (e = c.page);
      } catch {
      }
  } catch {
  }
  try {
    const c = (String(e || "").match(/([^\/]+)\.md(?:$|[?#])/) || [])[1], u = typeof e == "string" && String(e).indexOf("/") === -1;
    if (c && (u || !1) && K.has(c)) {
      const h = rn(c) || K.get(c);
      h && h !== e && (e = h);
    }
  } catch (c) {
    fe("[slugManager] slug mapping normalization failed", c);
  }
  try {
    if (typeof e == "string" && e.indexOf("::") !== -1) {
      const c = String(e).split("::", 1)[0];
      if (c)
        try {
          if (K.has(c)) {
            const u = rn(c) || K.get(c);
            u ? e = u : e = c;
          } else
            e = c;
        } catch {
          e = c;
        }
    }
  } catch (c) {
    fe("[slugManager] path sanitize failed", c);
  }
  if (!(n && n.force === !0 || typeof le == "string" && le || K && K.size || ze && ze.size || Wr()))
    throw new Error("failed to fetch md");
  const r = t == null ? "" : nn(String(t));
  let a = "";
  try {
    const c = typeof location < "u" && location.origin ? location.origin : "http://localhost";
    if (r && r.startsWith("/") && !/^[a-z][a-z0-9+.-]*:/i.test(r)) {
      const u = r.replace(/\/$/, "") + "/" + e.replace(/^\//, "");
      a = (typeof location < "u" && location && location.origin ? location.origin : "http://localhost").replace(/\/$/, "") + u;
    } else {
      let u = c + "/";
      r && (/^[a-z][a-z0-9+.-]*:/i.test(r) ? u = r.replace(/\/$/, "") + "/" : r.startsWith("/") ? u = c + r.replace(/\/$/, "") + "/" : u = c + "/" + r.replace(/\/$/, "") + "/"), a = new URL(e.replace(/^\//, ""), u).toString();
    }
  } catch {
    a = (typeof location < "u" && location.origin ? location.origin : "http://localhost") + "/" + e.replace(/^\//, "");
  }
  const s = n && n.signal;
  try {
    const c = jt.get(a);
    if (c && c > Date.now())
      return Promise.reject(new Error("failed to fetch md"));
    c && jt.delete(a);
  } catch {
  }
  if (ft.has(a))
    return ft.get(a);
  const l = (async () => {
    const c = await fetch(a, s ? { signal: s } : void 0);
    if (!c || typeof c.ok != "boolean" || !c.ok) {
      if (c && c.status === 404 && typeof le == "string" && le)
        try {
          const m = `${r}/${le}`, p = await globalThis.fetch(m, s ? { signal: s } : void 0);
          if (p && typeof p.ok == "boolean" && p.ok)
            return { raw: await p.text(), status: 404 };
        } catch (m) {
          fe("[slugManager] fetching fallback 404 failed", m);
        }
      let g = "";
      try {
        c && typeof c.clone == "function" ? g = await c.clone().text() : c && typeof c.text == "function" ? g = await c.text() : g = "";
      } catch (m) {
        g = "", fe("[slugManager] reading error body failed", m);
      }
      try {
        const m = c ? c.status : void 0;
        if (m === 404)
          try {
            k("fetchMarkdown failed (404):", () => ({ url: a, status: m, statusText: c ? c.statusText : void 0, body: g.slice(0, 200) }));
          } catch {
          }
        else
          try {
            Yn("fetchMarkdown failed:", () => ({ url: a, status: m, statusText: c ? c.statusText : void 0, body: g.slice(0, 200) }));
          } catch {
          }
      } catch {
      }
      throw new Error("failed to fetch md");
    }
    const u = await c.text(), d = u.trim().slice(0, 128).toLowerCase(), h = /^(?:<!doctype|<html|<title|<h1)/.test(d), f = h || String(e || "").toLowerCase().endsWith(".html");
    if (h && String(e || "").toLowerCase().endsWith(".md")) {
      try {
        if (typeof le == "string" && le) {
          const g = `${r}/${le}`, m = await globalThis.fetch(g, s ? { signal: s } : void 0);
          if (m.ok)
            return { raw: await m.text(), status: 404 };
        }
      } catch (g) {
        fe("[slugManager] fetching fallback 404 failed", g);
      }
      throw js() && Yn("fetchMarkdown: server returned HTML for .md request", a), new Error("failed to fetch md");
    }
    return f ? { raw: u, isHtml: !0 } : { raw: u };
  })().catch((c) => {
    if (c && c.name === "AbortError") {
      try {
        ft.delete(a);
      } catch {
      }
      throw c;
    }
    try {
      jt.set(a, Date.now() + pa);
    } catch {
    }
    try {
      ft.delete(a);
    } catch {
    }
    throw c;
  });
  return ft.set(a, l), l;
};
function eo(e) {
  typeof e == "function" && (Be = e);
}
const Xn = /* @__PURE__ */ new Map();
function to(e) {
  if (!e || typeof e != "string") return "";
  let t = e.replace(/```[\s\S]*?```/g, "");
  return t = t.replace(/<pre[\s\S]*?<\/pre>/gi, ""), t = t.replace(/<code[\s\S]*?<\/code>/gi, ""), t = t.replace(/<!--([\s\S]*?)-->/g, ""), t = t.replace(/^ {4,}.*$/gm, ""), t = t.replace(/`[^`]*`/g, ""), t;
}
let ne = [];
function no() {
  return ne;
}
try {
  if (typeof window < "u")
    try {
      Object.defineProperty(window, "__nimbiSearchIndex", {
        get() {
          return ne;
        },
        enumerable: !0,
        configurable: !0
      });
    } catch {
      try {
        window.__nimbiSearchIndex = ne;
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
          return Ir;
        },
        enumerable: !0,
        configurable: !0
      });
    } catch {
      try {
        window.__nimbiIndexReady = Ir;
      } catch {
      }
    }
} catch {
}
let $t = null;
async function Ut(e, t = 1, n = void 0, i = void 0) {
  const r = Array.isArray(n) ? Array.from(new Set((n || []).map((a) => Y(String(a || ""))))) : [];
  try {
    const a = Y(String(le || ""));
    a && !r.includes(a) && r.push(a);
  } catch {
  }
  if (ne && ne.length && t === 1 && !ne.some((s) => {
    try {
      return r.includes(Y(String(s.path || "")));
    } catch {
      return !1;
    }
  }))
    return ne;
  if ($t) return $t;
  $t = (async () => {
    let a = Array.isArray(n) ? Array.from(new Set((n || []).map((p) => Y(String(p || ""))))) : [];
    try {
      const p = Y(String(le || ""));
      p && !a.includes(p) && a.push(p);
    } catch {
    }
    const s = (p) => {
      if (!a || !a.length) return !1;
      for (const b of a)
        if (b && (p === b || p.startsWith(b + "/")))
          return !0;
      return !1;
    };
    let o = [];
    try {
      if (Array.isArray(i) && i.length)
        for (const p of i)
          try {
            const b = Y(String(p || ""));
            b && o.push(b);
          } catch {
          }
    } catch {
    }
    if (Array.isArray(Ne) && Ne.length && (o = Array.from(Ne)), !o.length) {
      if (U && typeof U.size == "number" && U.size)
        try {
          o = Array.from(U.keys());
        } catch {
          o = [];
        }
      else
        for (const p of K.values())
          if (p) {
            if (typeof p == "string")
              o.push(p);
            else if (p && typeof p == "object") {
              p.default && o.push(p.default);
              const b = p.langs || {};
              for (const y of Object.keys(b || {}))
                try {
                  b[y] && o.push(b[y]);
                } catch {
                }
            }
          }
    }
    try {
      const p = await wa(e);
      p && p.length && (o = o.concat(p));
    } catch (p) {
      fe("[slugManager] crawlAllMarkdown during buildSearchIndex failed", p);
    }
    try {
      const p = new Set(o), b = [...o], y = Math.max(1, Math.min(yn(), b.length || yn()));
      let _ = 0;
      const w = async () => {
        for (; !(p.size > $n); ) {
          const S = b.shift();
          if (!S) break;
          try {
            const M = await Be(S, e);
            if (M && M.raw) {
              if (M.status === 404) continue;
              let I = M.raw;
              const q = [], Q = String(S || "").replace(/^.*\//, "");
              if (/^readme(?:\.md)?$/i.test(Q) && Xr && (!S || !S.includes("/")))
                continue;
              const R = to(I), O = /\[[^\]]+\]\(([^)]+)\)/g;
              let G;
              for (; G = O.exec(R); )
                q.push(G[1]);
              const re = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
              for (; G = re.exec(R); )
                q.push(G[1]);
              const D = S && S.includes("/") ? S.substring(0, S.lastIndexOf("/") + 1) : "";
              for (let L of q)
                try {
                  if (Pn(L, e) || L.startsWith("..") || L.indexOf("/../") !== -1 || (D && !L.startsWith("./") && !L.startsWith("/") && !L.startsWith("../") && (L = D + L), L = Y(L), !/\.(md|html?)(?:$|[?#])/i.test(L)) || (L = L.split(/[?#]/)[0], s(L))) continue;
                  p.has(L) || (p.add(L), b.push(L), o.push(L));
                } catch (H) {
                  fe("[slugManager] href processing failed", L, H);
                }
            }
          } catch (M) {
            fe("[slugManager] discovery fetch failed for", S, M);
          }
          try {
            _++, await Pt(_, 32);
          } catch {
          }
        }
      }, A = [];
      for (let S = 0; S < y; S++) A.push(w());
      await Promise.all(A);
    } catch (p) {
      fe("[slugManager] discovery loop failed", p);
    }
    const l = /* @__PURE__ */ new Set();
    o = o.filter((p) => !p || l.has(p) || s(p) ? !1 : (l.add(p), !0));
    const c = [], u = /* @__PURE__ */ new Map(), d = o.filter((p) => /\.(?:md|html?)(?:$|[?#])/i.test(p)), h = Math.max(1, Math.min(yn(), d.length || 1)), f = d.slice(), g = [];
    for (let p = 0; p < h; p++)
      g.push((async () => {
        for (; f.length; ) {
          const b = f.shift();
          if (!b) break;
          try {
            const y = await Be(b, e);
            u.set(b, y);
          } catch (y) {
            fe("[slugManager] buildSearchIndex: entry fetch failed", b, y), u.set(b, null);
          }
        }
      })());
    await Promise.all(g);
    let m = 0;
    for (const p of o) {
      try {
        m++, await Pt(m, 16);
      } catch {
      }
      if (/\.(?:md|html?)(?:$|[?#])/i.test(p))
        try {
          const b = u.get(p);
          if (!b || !b.raw || b.status === 404) continue;
          let y = "", _ = "", w = null;
          if (b.isHtml)
            try {
              const S = He(), M = S ? S.parseFromString(b.raw, "text/html") : null, I = M ? M.querySelector("title") || M.querySelector("h1") : null;
              I && I.textContent && (y = I.textContent.trim());
              const q = M ? M.querySelector("p") : null;
              if (q && q.textContent && (_ = q.textContent.trim()), t >= 2)
                try {
                  const Q = M ? M.querySelector("h1") : null, R = Q && Q.textContent ? Q.textContent.trim() : y || "";
                  try {
                    const G = U && typeof U.has == "function" && U.has(p) ? U.get(p) : null;
                    if (G)
                      w = G;
                    else {
                      let re = he(y || p);
                      const D = /* @__PURE__ */ new Set();
                      try {
                        for (const H of K.keys()) D.add(H);
                      } catch {
                      }
                      try {
                        for (const H of c)
                          H && H.slug && D.add(String(H.slug).split("::")[0]);
                      } catch {
                      }
                      let L = !1;
                      try {
                        if (K.has(re)) {
                          const H = K.get(re);
                          if (typeof H == "string")
                            H === p && (L = !0);
                          else if (H && typeof H == "object") {
                            H.default === p && (L = !0);
                            for (const W of Object.keys(H.langs || {}))
                              if (H.langs[W] === p) {
                                L = !0;
                                break;
                              }
                          }
                        }
                      } catch {
                      }
                      !L && D.has(re) && (re = Xt(re, D)), w = re;
                      try {
                        U.has(p) || nt(w, p);
                      } catch {
                      }
                    }
                  } catch (G) {
                    fe("[slugManager] derive pageSlug failed", G);
                  }
                  const O = Array.from(M.querySelectorAll("h2"));
                  for (const G of O)
                    try {
                      const re = (G.textContent || "").trim();
                      if (!re) continue;
                      const D = G.id ? G.id : he(re), L = w ? `${w}::${D}` : `${he(p)}::${D}`;
                      let H = "", W = G.nextElementSibling;
                      for (; W && W.tagName && W.tagName.toLowerCase() === "script"; ) W = W.nextElementSibling;
                      W && W.textContent && (H = String(W.textContent).trim()), c.push({ slug: L, title: re, excerpt: H, path: p, parentTitle: R });
                    } catch (re) {
                      fe("[slugManager] indexing H2 failed", re);
                    }
                  if (t === 3)
                    try {
                      const G = Array.from(M.querySelectorAll("h3"));
                      for (const re of G)
                        try {
                          const D = (re.textContent || "").trim();
                          if (!D) continue;
                          const L = re.id ? re.id : he(D), H = w ? `${w}::${L}` : `${he(p)}::${L}`;
                          let W = "", ie = re.nextElementSibling;
                          for (; ie && ie.tagName && ie.tagName.toLowerCase() === "script"; ) ie = ie.nextElementSibling;
                          ie && ie.textContent && (W = String(ie.textContent).trim()), c.push({ slug: H, title: D, excerpt: W, path: p, parentTitle: R });
                        } catch (D) {
                          fe("[slugManager] indexing H3 failed", D);
                        }
                    } catch (G) {
                      fe("[slugManager] collect H3s failed", G);
                    }
                } catch (Q) {
                  fe("[slugManager] collect H2s failed", Q);
                }
            } catch (S) {
              fe("[slugManager] parsing HTML for index failed", S);
            }
          else {
            const S = b.raw, M = S.match(/^#\s+(.+)$/m);
            y = M ? M[1].trim() : "";
            try {
              y = Gn(y);
            } catch {
            }
            const I = S.split(/\r?\n\s*\r?\n/);
            if (I.length > 1)
              for (let q = 1; q < I.length; q++) {
                const Q = I[q].trim();
                if (Q && !/^#/.test(Q)) {
                  _ = Q.replace(/\r?\n/g, " ");
                  break;
                }
              }
            if (t >= 2) {
              let q = "";
              try {
                const Q = (S.match(/^#\s+(.+)$/m) || [])[1];
                q = Q ? Q.trim() : "";
                try {
                  const G = U && typeof U.has == "function" && U.has(p) ? U.get(p) : null;
                  if (G)
                    w = G;
                  else {
                    let re = he(y || p);
                    const D = /* @__PURE__ */ new Set();
                    try {
                      for (const H of K.keys()) D.add(H);
                    } catch {
                    }
                    try {
                      for (const H of c)
                        H && H.slug && D.add(String(H.slug).split("::")[0]);
                    } catch {
                    }
                    let L = !1;
                    try {
                      if (K.has(re)) {
                        const H = K.get(re);
                        if (typeof H == "string")
                          H === p && (L = !0);
                        else if (H && typeof H == "object") {
                          H.default === p && (L = !0);
                          for (const W of Object.keys(H.langs || {}))
                            if (H.langs[W] === p) {
                              L = !0;
                              break;
                            }
                        }
                      }
                    } catch {
                    }
                    !L && D.has(re) && (re = Xt(re, D)), w = re;
                    try {
                      U.has(p) || nt(w, p);
                    } catch {
                    }
                  }
                } catch (G) {
                  fe("[slugManager] derive pageSlug failed", G);
                }
                const R = /^##\s+(.+)$/gm;
                let O;
                for (; O = R.exec(S); )
                  try {
                    const G = (O[1] || "").trim(), re = Gn(G);
                    if (!G) continue;
                    const D = he(G), L = w ? `${w}::${D}` : `${he(p)}::${D}`, W = S.slice(R.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), ie = W && W[1] ? String(W[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                    c.push({ slug: L, title: re, excerpt: ie, path: p, parentTitle: q });
                  } catch (G) {
                    fe("[slugManager] indexing markdown H2 failed", G);
                  }
              } catch (Q) {
                fe("[slugManager] collect markdown H2s failed", Q);
              }
              if (t === 3)
                try {
                  const Q = /^###\s+(.+)$/gm;
                  let R;
                  for (; R = Q.exec(S); )
                    try {
                      const O = (R[1] || "").trim(), G = Gn(O);
                      if (!O) continue;
                      const re = he(O), D = w ? `${w}::${re}` : `${he(p)}::${re}`, H = S.slice(Q.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), W = H && H[1] ? String(H[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                      c.push({ slug: D, title: G, excerpt: W, path: p, parentTitle: q });
                    } catch (O) {
                      fe("[slugManager] indexing markdown H3 failed", O);
                    }
                } catch (Q) {
                  fe("[slugManager] collect markdown H3s failed", Q);
                }
            }
          }
          let A = "";
          try {
            U.has(p) && (A = U.get(p));
          } catch (S) {
            fe("[slugManager] mdToSlug access failed", S);
          }
          if (!A) {
            try {
              if (!w) {
                const S = U && typeof U.has == "function" && U.has(p) ? U.get(p) : null;
                if (S)
                  w = S;
                else {
                  let M = he(y || p);
                  const I = /* @__PURE__ */ new Set();
                  try {
                    for (const Q of K.keys()) I.add(Q);
                  } catch {
                  }
                  try {
                    for (const Q of c)
                      Q && Q.slug && I.add(String(Q.slug).split("::")[0]);
                  } catch {
                  }
                  let q = !1;
                  try {
                    if (K.has(M)) {
                      const Q = K.get(M);
                      if (typeof Q == "string")
                        Q === p && (q = !0);
                      else if (Q && typeof Q == "object") {
                        Q.default === p && (q = !0);
                        for (const R of Object.keys(Q.langs || {}))
                          if (Q.langs[R] === p) {
                            q = !0;
                            break;
                          }
                      }
                    }
                  } catch {
                  }
                  !q && I.has(M) && (M = Xt(M, I)), w = M;
                  try {
                    U.has(p) || nt(w, p);
                  } catch {
                  }
                }
              }
            } catch (S) {
              fe("[slugManager] derive pageSlug failed", S);
            }
            A = w || he(y || p);
          }
          c.push({ slug: A, title: y, excerpt: _, path: p });
        } catch (b) {
          fe("[slugManager] buildSearchIndex: entry processing failed", b);
        }
    }
    try {
      const p = c.filter((b) => {
        try {
          return !s(String(b.path || ""));
        } catch {
          return !0;
        }
      });
      try {
        Array.isArray(ne) || (ne = []), ne.length = 0;
        for (const b of p) ne.push(b);
      } catch {
        try {
          ne = Array.from(p);
        } catch {
          ne = p;
        }
      }
      try {
        if (typeof window < "u") {
          try {
            window.__nimbiResolvedIndex = ne;
          } catch {
          }
          try {
            const b = [], y = /* @__PURE__ */ new Set();
            for (const _ of ne)
              try {
                if (!_ || !_.slug) continue;
                const w = String(_.slug).split("::")[0];
                if (y.has(w)) continue;
                y.add(w);
                const A = { slug: w };
                _.title ? A.title = String(_.title) : _.parentTitle && (A.title = String(_.parentTitle)), _.path && (A.path = String(_.path)), b.push(A);
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
    } catch (p) {
      fe("[slugManager] filtering index by excludes failed", p);
      try {
        Array.isArray(ne) || (ne = []), ne.length = 0;
        for (const b of c) ne.push(b);
      } catch {
        try {
          ne = Array.from(c);
        } catch {
          ne = c;
        }
      }
      try {
        if (typeof window < "u")
          try {
            window.__nimbiResolvedIndex = ne;
          } catch {
          }
      } catch {
      }
    }
    return ne;
  })();
  try {
    await $t;
  } catch (a) {
    fe("[slugManager] awaiting _indexPromise failed", a);
  }
  return $t = null, ne;
}
async function Nt(e = {}) {
  try {
    const t = typeof e.timeoutMs == "number" ? e.timeoutMs : 8e3, n = e.contentBase, i = typeof e.indexDepth == "number" ? e.indexDepth : 1, r = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, a = Array.isArray(e.seedPaths) ? e.seedPaths : void 0, s = typeof e.startBuild == "boolean" ? e.startBuild : !0;
    if (Array.isArray(ne) && ne.length && !$t && !s) return ne;
    if ($t) {
      try {
        await $t;
      } catch {
      }
      return ne;
    }
    if (s) {
      try {
        if (typeof zr == "function")
          try {
            const l = await zr(n, i, r, a);
            if (Array.isArray(l) && l.length) {
              try {
                fa(l);
              } catch {
              }
              return ne;
            }
          } catch {
          }
      } catch {
      }
      try {
        return await Ut(n, i, r, a), ne;
      } catch {
      }
    }
    const o = Date.now();
    for (; Date.now() - o < t; ) {
      if (Array.isArray(ne) && ne.length) return ne;
      await new Promise((l) => setTimeout(l, 150));
    }
    return ne;
  } catch {
    return ne;
  }
}
async function Ir(e = {}) {
  try {
    const t = Object.assign({}, e);
    typeof t.startBuild != "boolean" && (t.startBuild = !0), typeof t.timeoutMs != "number" && (t.timeoutMs = 1 / 0);
    try {
      return await Nt(t);
    } catch {
      return ne;
    }
  } catch {
    return ne;
  }
}
const ga = 1e3;
let $n = ga;
function ro(e) {
  typeof e == "number" && e >= 0 && ($n = e);
}
const ma = He(), ya = "a[href]";
let ba = async function(e, t, n = $n) {
  if (Xn.has(e)) return Xn.get(e);
  let i = null;
  const r = /* @__PURE__ */ new Set(), a = [""], s = typeof location < "u" && location.origin ? location.origin : "http://localhost";
  let o = s + "/";
  try {
    t && (/^[a-z][a-z0-9+.-]*:/i.test(String(t)) ? o = String(t).replace(/\/$/, "") + "/" : String(t).startsWith("/") ? o = s + String(t).replace(/\/$/, "") + "/" : o = s + "/" + String(t).replace(/\/$/, "") + "/");
  } catch {
    o = s + "/";
  }
  const l = Math.max(1, Math.min(or, 6));
  for (; a.length && !i && !(a.length > n); ) {
    const c = a.splice(0, l);
    await Mn(c, async (u) => {
      if (u == null || r.has(u)) return;
      r.add(u);
      let d = "";
      try {
        d = new URL(u || "", o).toString();
      } catch {
        d = (String(t || "") || s) + "/" + String(u || "").replace(/^\//, "");
      }
      try {
        let h;
        try {
          h = await globalThis.fetch(d);
        } catch (b) {
          fe("[slugManager] crawlForSlug: fetch failed", { url: d, error: b });
          return;
        }
        if (!h || !h.ok) {
          h && !h.ok && fe("[slugManager] crawlForSlug: directory fetch non-ok", { url: d, status: h.status });
          return;
        }
        const f = await h.text(), g = ma.parseFromString(f, "text/html");
        let m = [];
        try {
          g && typeof g.getElementsByTagName == "function" ? m = g.getElementsByTagName("a") : g && typeof g.querySelectorAll == "function" ? m = g.querySelectorAll(ya) : m = [];
        } catch {
          try {
            m = g.getElementsByTagName ? g.getElementsByTagName("a") : [];
          } catch {
            m = [];
          }
        }
        const p = d;
        for (const b of m)
          try {
            if (i) break;
            let y = b.getAttribute("href") || "";
            if (!y || Pn(y, t) || y.startsWith("..") || y.indexOf("/../") !== -1) continue;
            if (y.endsWith("/")) {
              try {
                const _ = new URL(y, p), w = new URL(o).pathname, A = _.pathname.startsWith(w) ? _.pathname.slice(w.length) : _.pathname.replace(/^\//, ""), S = Qt(Y(A));
                r.has(S) || a.push(S);
              } catch {
                const w = Y(u + y);
                r.has(w) || a.push(w);
              }
              continue;
            }
            if (y.toLowerCase().endsWith(".md")) {
              let _ = "";
              try {
                const w = new URL(y, p), A = new URL(o).pathname;
                _ = w.pathname.startsWith(A) ? w.pathname.slice(A.length) : w.pathname.replace(/^\//, "");
              } catch {
                _ = (u + y).replace(/^\//, "");
              }
              _ = Y(_);
              try {
                if (U.has(_))
                  continue;
                for (const w of K.values())
                  ;
              } catch (w) {
                fe("[slugManager] slug map access failed", w);
              }
              try {
                const w = await Be(_, t);
                if (w && w.raw) {
                  const A = (w.raw || "").match(/^#\s+(.+)$/m);
                  if (A && A[1] && he(A[1].trim()) === e) {
                    i = _;
                    break;
                  }
                }
              } catch (w) {
                fe("[slugManager] crawlForSlug: fetchMarkdown failed", w);
              }
            }
          } catch (y) {
            fe("[slugManager] crawlForSlug: link iteration failed", y);
          }
      } catch (h) {
        fe("[slugManager] crawlForSlug: directory fetch failed", h);
      }
    }, l);
  }
  return Xn.set(e, i), i;
};
async function wa(e, t = $n) {
  const n = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), r = [""], a = typeof location < "u" && location.origin ? location.origin : "http://localhost";
  let s = a + "/";
  try {
    e && (/^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? s = String(e).replace(/\/$/, "") + "/" : String(e).startsWith("/") ? s = a + String(e).replace(/\/$/, "") + "/" : s = a + "/" + String(e).replace(/\/$/, "") + "/");
  } catch {
    s = a + "/";
  }
  const o = Math.max(1, Math.min(or, 6));
  for (; r.length && !(r.length > t); ) {
    const l = r.splice(0, o);
    await Mn(l, async (c) => {
      if (c == null || i.has(c)) return;
      i.add(c);
      let u = "";
      try {
        u = new URL(c || "", s).toString();
      } catch {
        u = (String(e || "") || a) + "/" + String(c || "").replace(/^\//, "");
      }
      try {
        let d;
        try {
          d = await globalThis.fetch(u);
        } catch (p) {
          fe("[slugManager] crawlAllMarkdown: fetch failed", { url: u, error: p });
          return;
        }
        if (!d || !d.ok) {
          d && !d.ok && fe("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: u, status: d.status });
          return;
        }
        const h = await d.text(), f = ma.parseFromString(h, "text/html");
        let g = [];
        try {
          f && typeof f.getElementsByTagName == "function" ? g = f.getElementsByTagName("a") : f && typeof f.querySelectorAll == "function" ? g = f.querySelectorAll(ya) : g = [];
        } catch {
          try {
            g = f.getElementsByTagName ? f.getElementsByTagName("a") : [];
          } catch {
            g = [];
          }
        }
        const m = u;
        for (const p of g)
          try {
            let b = p.getAttribute("href") || "";
            if (!b || Pn(b, e) || b.startsWith("..") || b.indexOf("/../") !== -1) continue;
            if (b.endsWith("/")) {
              try {
                const _ = new URL(b, m), w = new URL(s).pathname, A = _.pathname.startsWith(w) ? _.pathname.slice(w.length) : _.pathname.replace(/^\//, ""), S = Qt(Y(A));
                i.has(S) || r.push(S);
              } catch {
                const w = c + b;
                i.has(w) || r.push(w);
              }
              continue;
            }
            let y = "";
            try {
              const _ = new URL(b, m), w = new URL(s).pathname;
              y = _.pathname.startsWith(w) ? _.pathname.slice(w.length) : _.pathname.replace(/^\//, "");
            } catch {
              y = (c + b).replace(/^\//, "");
            }
            y = Y(y), /\.(md|html?)$/i.test(y) && n.add(y);
          } catch (b) {
            fe("[slugManager] crawlAllMarkdown: link iteration failed", b);
          }
      } catch (d) {
        fe("[slugManager] crawlAllMarkdown: directory fetch failed", d);
      }
    }, o);
  }
  return Array.from(n);
}
async function _a(e, t, n) {
  if (e && typeof e == "string" && (e = Y(e), e = nn(e)), K.has(e))
    return rn(e) || K.get(e);
  try {
    if (!(typeof le == "string" && le || K.has(e) || ze && ze.size || Gt._refreshed || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t))) return null;
  } catch {
  }
  for (const r of lr)
    try {
      const a = await r(e, t);
      if (a)
        return nt(e, a), a;
    } catch (a) {
      fe("[slugManager] slug resolver failed", a);
    }
  if (ze && ze.size) {
    if (mn.has(e)) {
      const r = mn.get(e);
      return nt(e, r), r;
    }
    for (const r of Ne)
      if (!er.has(r))
        try {
          const a = await Be(r, t);
          if (a && a.raw) {
            const s = (a.raw || "").match(/^#\s+(.+)$/m);
            if (s && s[1]) {
              const o = he(s[1].trim());
              if (er.add(r), o && mn.set(o, r), o === e)
                return nt(e, r), r;
            }
          }
        } catch (a) {
          fe("[slugManager] manifest title fetch failed", a);
        }
    try {
      crawlBatchYieldCount++, await Pt(crawlBatchYieldCount, 8);
    } catch {
    }
  }
  try {
    const r = await Ut(t);
    if (r && r.length) {
      const a = r.find((s) => s.slug === e);
      if (a)
        return nt(e, a.path), a.path;
    }
  } catch (r) {
    fe("[slugManager] buildSearchIndex lookup failed", r);
  }
  try {
    const r = await ba(e, t, n);
    if (r)
      return nt(e, r), r;
  } catch (r) {
    fe("[slugManager] crawlForSlug lookup failed", r);
  }
  const i = [`${e}.html`, `${e}.md`];
  for (const r of i)
    try {
      const a = await Be(r, t);
      if (a && a.raw)
        return nt(e, r), r;
    } catch (a) {
      fe("[slugManager] candidate fetch failed", a);
    }
  if (ze && ze.size)
    for (const r of Ne)
      try {
        const a = r.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
        if (he(a) === e)
          return nt(e, r), r;
      } catch (a) {
        fe("[slugManager] build-time filename match failed", a);
      }
  try {
    if (bt && typeof bt == "string" && bt.trim())
      try {
        const r = await Be(bt, t);
        if (r && r.raw) {
          const a = (r.raw || "").match(/^#\s+(.+)$/m);
          if (a && a[1] && he(a[1].trim()) === e)
            return nt(e, bt), bt;
        }
      } catch (r) {
        fe("[slugManager] home page fetch failed", r);
      }
  } catch (r) {
    fe("[slugManager] home page fetch failed", r);
  }
  return null;
}
const at = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CRAWL_MAX_QUEUE: ga,
  HOME_SLUG: Qr,
  _setAllMd: Us,
  _setSearchIndex: fa,
  _storeSlugMapping: nt,
  addSlugResolver: Fs,
  get allMarkdownPaths() {
    return Ne;
  },
  allMarkdownPathsSet: ze,
  get availableLanguages() {
    return st;
  },
  awaitSearchIndex: Ir,
  buildSearchIndex: Ut,
  buildSearchIndexWorker: zr,
  clearFetchCache: Xs,
  clearListCaches: Ws,
  crawlAllMarkdown: wa,
  crawlCache: Xn,
  crawlForSlug: ba,
  crawlForSlugWorker: Hs,
  get defaultCrawlMaxQueue() {
    return $n;
  },
  ensureSlug: _a,
  fetchCache: ft,
  get fetchMarkdown() {
    return Be;
  },
  getFetchConcurrency: yn,
  getLanguages: Os,
  getSearchIndex: no,
  get homePage() {
    return bt;
  },
  initSlugWorker: qs,
  isExternalLink: Gs,
  isExternalLinkWithBase: Pn,
  listPathsFetched: er,
  listSlugCache: mn,
  mdToSlug: U,
  negativeFetchCache: jt,
  get notFoundPage() {
    return le;
  },
  removeSlugResolver: Ds,
  resolveSlugPath: rn,
  get searchIndex() {
    return ne;
  },
  setContentBase: Kr,
  setDefaultCrawlMaxQueue: ro,
  setFetchCacheMaxSize: Ks,
  setFetchCacheTTL: Ys,
  setFetchConcurrency: Js,
  setFetchMarkdown: eo,
  setFetchNegativeCacheTTL: Qs,
  setHomePage: da,
  setLanguages: la,
  setNegativeFetchCacheMaxSize: Vs,
  setNotFoundPage: ha,
  setSkipRootReadme: Bs,
  get skipRootReadme() {
    return Xr;
  },
  slugResolvers: lr,
  slugToMd: K,
  slugify: he,
  unescapeMarkdown: Gn,
  uniqueSlug: Xt,
  whenSearchIndexReady: Nt
}, Symbol.toStringTag, { value: "Module" }));
var vr, Ri;
function io() {
  if (Ri) return vr;
  Ri = 1;
  function e(a, s) {
    return s.some(
      ([o, l]) => o <= a && a <= l
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
    let o = 0, l = 0, c = a.length - 1;
    const u = s.wordsPerMinute || 200, d = s.wordBound || n;
    for (; d(a[l]); ) l++;
    for (; d(a[c]); ) c--;
    const h = `${a}
`;
    for (let p = l; p <= c; p++)
      if ((t(h[p]) || !d(h[p]) && (d(h[p + 1]) || t(h[p + 1]))) && o++, t(h[p]))
        for (; p <= c && (i(h[p + 1]) || d(h[p + 1])); )
          p++;
    const f = o / u, g = Math.round(f * 60 * 1e3);
    return {
      text: Math.ceil(f.toFixed(2)) + " min read",
      minutes: f,
      time: g,
      words: o
    };
  }
  return vr = r, vr;
}
var ao = io();
const so = /* @__PURE__ */ ea(ao), pn = /* @__PURE__ */ new Map(), oo = 200;
function lo(e) {
  return String(e || "");
}
function co(e, t) {
  if (pn.set(e, t), pn.size > oo) {
    const n = pn.keys().next().value;
    n && pn.delete(n);
  }
}
function uo(e) {
  return e ? String(e).trim().split(/\s+/).filter(Boolean).length : 0;
}
function ho(e) {
  const t = lo(e), n = pn.get(t);
  if (n) return Object.assign({}, n);
  const i = so(e || ""), r = typeof i.words == "number" ? i.words : uo(e), a = { readingTime: i, wordCount: r };
  return co(t, a), Object.assign({}, a);
}
function Ln(e, t) {
  let n = document.querySelector(`meta[name="${e}"]`);
  n || (n = document.createElement("meta"), n.setAttribute("name", e), document.head.appendChild(n)), n.setAttribute("content", t);
}
function Rt(e, t, n) {
  let i = `meta[${e}="${t}"]`, r = document.querySelector(i);
  r || (r = document.createElement("meta"), r.setAttribute(e, t), document.head.appendChild(r)), r.setAttribute("content", n);
}
function ka(e, t) {
  try {
    let n = document.querySelector(`link[rel="${e}"]`);
    n || (n = document.createElement("link"), n.setAttribute("rel", e), document.head.appendChild(n)), n.setAttribute("href", t);
  } catch (n) {
    k("[seoManager] upsertLinkRel failed", n);
  }
}
function fo(e, t, n, i) {
  const r = t && String(t).trim() ? t : e.title || document.title;
  Rt("property", "og:title", r);
  const a = i && String(i).trim() ? i : e.description || "";
  a && String(a).trim() && Rt("property", "og:description", a), a && String(a).trim() && Rt("name", "twitter:description", a), Rt("name", "twitter:card", e.twitter_card || "summary_large_image");
  const s = n || e.image;
  s && (Rt("property", "og:image", s), Rt("name", "twitter:image", s));
}
function Yr(e, t, n, i, r = "") {
  const a = e.meta || {}, s = document && document.querySelector && document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", o = i && String(i).trim() ? i : a.description && String(a.description).trim() ? a.description : s && String(s).trim() ? s : "";
  o && String(o).trim() && Ln("description", o), Ln("robots", a.robots || "index,follow"), fo(a, t, n, o);
}
function po() {
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
    k("[seoManager] getSiteNameFromMeta failed", e);
  }
  return "";
}
function Vr(e, t, n, i, r, a = "") {
  try {
    const s = e.meta || {}, o = n && String(n).trim() ? n : s.title || a || document.title, l = r && String(r).trim() ? r : s.description || document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", c = i || s.image || null;
    let u = "";
    try {
      if (t) {
        const g = Y(t);
        try {
          u = (location.origin + location.pathname).split("?")[0] + "?page=" + encodeURIComponent(g);
        } catch {
          u = location.href.split("#")[0];
        }
      } else
        u = location.href.split("#")[0];
    } catch (g) {
      u = location.href.split("#")[0], k("[seoManager] compute canonical failed", g);
    }
    u && ka("canonical", u);
    try {
      Rt("property", "og:url", u);
    } catch (g) {
      k("[seoManager] upsertMeta og:url failed", g);
    }
    const d = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: o || "",
      description: l || "",
      url: u || location.href.split("#")[0]
    };
    c && (d.image = String(c)), s.date && (d.datePublished = s.date), s.dateModified && (d.dateModified = s.dateModified);
    const h = "nimbi-jsonld";
    let f = document.getElementById(h);
    f || (f = document.createElement("script"), f.type = "application/ld+json", f.id = h, document.head.appendChild(f)), f.textContent = JSON.stringify(d, null, 2);
  } catch (s) {
    k("[seoManager] setStructuredData failed", s);
  }
}
let bn = typeof window < "u" && window.__SEO_MAP ? window.__SEO_MAP : {};
function go(e) {
  try {
    if (!e || typeof e != "object") {
      bn = {};
      return;
    }
    bn = Object.assign({}, e);
  } catch (t) {
    k("[seoManager] setSeoMap failed", t);
  }
}
function mo(e, t = "") {
  try {
    if (!e) return;
    const n = bn && bn[e] ? bn[e] : typeof window < "u" && window.__SEO_MAP && window.__SEO_MAP[e] ? window.__SEO_MAP[e] : null;
    try {
      const i = location.origin + location.pathname + "?page=" + encodeURIComponent(String(e || ""));
      ka("canonical", i);
      try {
        Rt("property", "og:url", i);
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
      n.description && Ln("description", String(n.description));
    } catch {
    }
    try {
      try {
        Yr({ meta: n }, n.title || void 0, n.image || void 0, n.description || void 0, t);
      } catch {
      }
    } catch {
    }
    try {
      Vr({ meta: n }, e, n.title || void 0, n.image || void 0, n.description || void 0, t);
    } catch (i) {
      k("[seoManager] inject structured data failed", i);
    }
  } catch (n) {
    k("[seoManager] injectSeoForPage failed", n);
  }
}
function Qn(e = {}, t = "", n = void 0, i = void 0) {
  try {
    const r = e || {}, a = typeof n == "string" && n.trim() ? n : r.title || "Not Found", s = typeof i == "string" && i.trim() ? i : r.description || "";
    try {
      Ln("robots", "noindex,follow");
    } catch {
    }
    try {
      s && String(s).trim() && Ln("description", String(s));
    } catch {
    }
    try {
      Yr({ meta: Object.assign({}, r, { robots: "noindex,follow" }) }, a, r.image || void 0, s);
    } catch {
    }
    try {
      Vr({ meta: Object.assign({}, r, { title: a, description: s }) }, t || "", a, r.image || void 0, s);
    } catch {
    }
  } catch (r) {
    k("[seoManager] markNotFound failed", r);
  }
}
function yo(e, t, n, i, r, a, s, o, l, c, u) {
  try {
    if (i && i.querySelector) {
      const d = i.querySelector(".menu-label");
      d && (d.textContent = o && o.textContent || e("onThisPage"));
    }
  } catch (d) {
    k("[seoManager] update toc label failed", d);
  }
  try {
    const d = n.meta && n.meta.title ? String(n.meta.title).trim() : "", h = r.querySelector("img"), f = h && (h.getAttribute("src") || h.src) || null;
    let g = "";
    try {
      let b = "";
      try {
        const y = o || (r && r.querySelector ? r.querySelector("h1") : null);
        if (y) {
          let _ = y.nextElementSibling;
          const w = [];
          for (; _ && !(_.tagName && _.tagName.toLowerCase() === "h2"); ) {
            try {
              if (_.classList && _.classList.contains("nimbi-article-subtitle")) {
                _ = _.nextElementSibling;
                continue;
              }
            } catch {
            }
            const A = (_.textContent || "").trim();
            A && w.push(A), _ = _.nextElementSibling;
          }
          w.length && (b = w.join(" ").replace(/\s+/g, " ").trim()), !b && l && (b = String(l).trim());
        }
      } catch (y) {
        k("[seoManager] compute descOverride failed", y);
      }
      b && String(b).length > 160 && (b = String(b).slice(0, 157).trim() + "..."), g = b;
    } catch (b) {
      k("[seoManager] compute descOverride failed", b);
    }
    let m = "";
    try {
      d && (m = d);
    } catch {
    }
    if (!m)
      try {
        o && o.textContent && (m = String(o.textContent).trim());
      } catch {
      }
    if (!m)
      try {
        const b = r.querySelector("h2");
        b && b.textContent && (m = String(b.textContent).trim());
      } catch {
      }
    m || (m = a || "");
    try {
      Yr(n, m || void 0, f, g);
    } catch (b) {
      k("[seoManager] setMetaTags failed", b);
    }
    try {
      Vr(n, c, m || void 0, f, g, t);
    } catch (b) {
      k("[seoManager] setStructuredData failed", b);
    }
    const p = po();
    m ? p ? document.title = `${p} - ${m}` : document.title = `${t || "Site"} - ${m}` : d ? document.title = d : document.title = t || document.title;
  } catch (d) {
    k("[seoManager] applyPageMeta failed", d);
  }
  try {
    try {
      const d = r.querySelectorAll(".nimbi-reading-time");
      d && d.forEach((h) => h.remove());
    } catch {
    }
    if (l) {
      const d = ho(u.raw || ""), h = d && d.readingTime ? d.readingTime : null, f = h && typeof h.minutes == "number" ? Math.ceil(h.minutes) : 0, g = f ? e("readingTime", { minutes: f }) : "";
      if (!g) return;
      const m = r.querySelector("h1");
      if (m) {
        const p = r.querySelector(".nimbi-article-subtitle");
        try {
          if (p) {
            const b = document.createElement("span");
            b.className = "nimbi-reading-time", b.textContent = g, p.appendChild(b);
          } else {
            const b = document.createElement("p");
            b.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const y = document.createElement("span");
            y.className = "nimbi-reading-time", y.textContent = g, b.appendChild(y);
            try {
              m.parentElement.insertBefore(b, m.nextSibling);
            } catch {
              try {
                m.insertAdjacentElement("afterend", b);
              } catch {
              }
            }
          }
        } catch {
          try {
            const y = document.createElement("p");
            y.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const _ = document.createElement("span");
            _.className = "nimbi-reading-time", _.textContent = g, y.appendChild(_), m.insertAdjacentElement("afterend", y);
          } catch {
          }
        }
      }
    }
  } catch (d) {
    k("[seoManager] reading time update failed", d);
  }
}
let xa = 100;
function zi(e) {
  xa = e;
}
function ct() {
  try {
    if (Yt(2)) return !0;
  } catch {
  }
  try {
    return !1;
  } catch {
    return !1;
  }
}
let wn = 300 * 1e3, cn = null;
function ut(e, t, n) {
  try {
    if (typeof Be == "function" && typeof Be.length == "number" && Be.length >= 3)
      return Be(e, t, { signal: n });
  } catch {
  }
  return Be(e, t);
}
function Pi(e) {
  wn = e;
}
const mt = /* @__PURE__ */ new Map();
function bo(e) {
  if (!mt.has(e)) return;
  const t = mt.get(e), n = Date.now();
  if (t.ts + wn < n) {
    mt.delete(e);
    return;
  }
  return mt.delete(e), mt.set(e, t), t.value;
}
function wo(e, t) {
  if ($i(), $i(), mt.delete(e), mt.set(e, { value: t, ts: Date.now() }), mt.size > xa) {
    const n = mt.keys().next().value;
    n !== void 0 && mt.delete(n);
  }
}
function $i() {
  if (!wn || wn <= 0) return;
  const e = Date.now();
  for (const [t, n] of mt.entries())
    n.ts + wn < e && mt.delete(t);
}
async function _o(e, t, n) {
  const i = new Set(rt);
  let r = [];
  try {
    if (typeof document < "u" && document.getElementsByClassName) {
      const a = (s) => {
        const o = document.getElementsByClassName(s);
        for (let l = 0; l < o.length; l++) {
          const c = o[l].getElementsByTagName("a");
          for (let u = 0; u < c.length; u++) r.push(c[u]);
        }
      };
      a("nimbi-site-navbar"), a("navbar"), a("nimbi-nav");
    } else
      r = Array.from(document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a"));
  } catch {
    try {
      r = Array.from(document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a"));
    } catch {
      r = [];
    }
  }
  for (const a of Array.from(r || [])) {
    const s = a.getAttribute("href") || "";
    if (s)
      try {
        try {
          const h = it(s);
          if (h) {
            if (h.type === "canonical" && h.page) {
              const f = Y(h.page);
              if (f) {
                i.add(f);
                continue;
              }
            }
            if (h.type === "cosmetic" && h.page) {
              const f = h.page;
              if (K.has(f)) {
                const g = K.get(f);
                if (g) return g;
              }
              continue;
            }
          }
        } catch {
        }
        const o = new URL(s, location.href);
        if (o.origin !== location.origin) continue;
        const l = (o.hash || o.pathname).match(/([^#?]+\.md)(?:$|[?#])/) || (o.pathname || "").match(/([^#?]+\.md)(?:$|[?#])/);
        if (l) {
          let h = Y(l[1]);
          h && i.add(h);
          continue;
        }
        const c = (a.textContent || "").trim(), u = (o.pathname || "").replace(/^.*\//, "");
        if (c && he(c) === e || u && he(u.replace(/\.(html?|md)$/i, "")) === e) return o.toString();
        if (/\.(html?)$/i.test(o.pathname)) {
          let h = o.pathname.replace(/^\//, "");
          i.add(h);
          continue;
        }
        const d = o.pathname || "";
        if (d) {
          const h = new URL(t), f = Qt(h.pathname);
          if (d.indexOf(f) !== -1) {
            let g = d.startsWith(f) ? d.slice(f.length) : d;
            g = Y(g), g && i.add(g);
          }
        }
      } catch (o) {
        k("[router] malformed URL while discovering index candidates", o);
      }
  }
  for (const a of i)
    try {
      if (!a || !String(a).includes(".md")) continue;
      const s = await ut(a, t, n);
      if (!s || !s.raw) continue;
      const o = (s.raw || "").match(/^#\s+(.+)$/m);
      if (o) {
        const l = (o[1] || "").trim();
        if (l && he(l) === e)
          return a;
      }
    } catch (s) {
      k("[router] fetchMarkdown during index discovery failed", s);
    }
  return null;
}
function ko(e) {
  const t = [];
  if (String(e).includes(".md") || String(e).includes(".html"))
    /index\.html$/i.test(e) || t.push(e);
  else
    try {
      const n = decodeURIComponent(String(e || ""));
      if (K.has(n)) {
        const i = rn(n) || K.get(n);
        i && (/\.(md|html?)$/i.test(i) ? /index\.html$/i.test(i) || t.push(i) : (t.push(i), t.push(i + ".html")));
      } else {
        if (rt && rt.size)
          for (const i of rt) {
            const r = i.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
            if (he(r) === n && !/index\.html$/i.test(i)) {
              t.push(i);
              break;
            }
          }
        !t.length && n && !/\.(md|html?)$/i.test(n) && (t.push(n + ".html"), t.push(n + ".md"));
      }
    } catch (n) {
      k("[router] buildPageCandidates failed during slug handling", n);
    }
  return t;
}
async function xo(e, t) {
  const n = e || "";
  try {
    try {
      Vi("fetchPageData");
    } catch {
    }
    try {
      Ji("fetchPageData");
    } catch {
    }
  } catch {
  }
  try {
    if (cn && typeof cn.abort == "function")
      try {
        cn.abort();
      } catch {
      }
  } catch {
  }
  cn = typeof AbortController < "u" ? new AbortController() : null;
  const i = cn;
  let r = null;
  try {
    const y = it(typeof location < "u" ? location.href : "");
    y && y.anchor && (r = y.anchor);
  } catch {
    try {
      r = location && location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : null;
    } catch {
      r = null;
    }
  }
  let a = e || "", s = null;
  const o = String(n || "").includes(".md") || String(n || "").includes(".html");
  if (a && String(a).includes("::")) {
    const y = String(a).split("::", 2);
    a = y[0], s = y[1] || null;
  }
  const c = `${e}|||${typeof Ms < "u" && Ot ? Ot : ""}`, u = bo(c);
  if (u)
    a = u.resolved, s = u.anchor || s;
  else {
    if (!String(a).includes(".md") && !String(a).includes(".html")) {
      let y = decodeURIComponent(String(a || ""));
      if (y && typeof y == "string" && (y = Y(y), y = nn(y)), K.has(y))
        a = rn(y) || K.get(y);
      else {
        let _ = await _o(y, t, i ? i.signal : void 0);
        if (_)
          a = _;
        else if (Gt._refreshed && rt && rt.size || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t)) {
          const w = await _a(y, t);
          w && (a = w);
        }
      }
    }
    wo(c, { resolved: a, anchor: s });
  }
  let d = !0;
  try {
    const y = String(a || "").includes(".md") || String(a || "").includes(".html") || a && (a.startsWith("http://") || a.startsWith("https://") || a.startsWith("/"));
    d = typeof le == "string" && le || K.has(a) || rt && rt.size || Gt._refreshed || o || y;
  } catch {
    d = !0;
  }
  !s && r && (s = r);
  try {
    if (d && a && (a.startsWith("http://") || a.startsWith("https://") || a.startsWith("/"))) {
      const y = a.startsWith("/") ? new URL(a, location.origin).toString() : a;
      try {
        const _ = await fetch(y, i ? { signal: i.signal } : void 0);
        if (_ && _.ok) {
          const w = await _.text(), A = _ && _.headers && typeof _.headers.get == "function" && _.headers.get("content-type") || "", S = (w || "").toLowerCase();
          if (A && A.indexOf && A.indexOf("text/html") !== -1 || S.indexOf("<!doctype") !== -1 || S.indexOf("<html") !== -1) {
            if (!o)
              try {
                let q = y;
                try {
                  q = new URL(y).pathname.replace(/^\//, "");
                } catch {
                  q = String(y || "").replace(/^\//, "");
                }
                const Q = q.replace(/\.html$/i, ".md");
                try {
                  const R = await ut(Q, t, i ? i.signal : void 0);
                  if (R && R.raw)
                    return { data: R, pagePath: Q, anchor: s };
                } catch {
                }
                if (typeof le == "string" && le)
                  try {
                    const R = await ut(le, t, i ? i.signal : void 0);
                    if (R && R.raw) {
                      try {
                        Qn(R.meta || {}, le);
                      } catch {
                      }
                      return { data: R, pagePath: le, anchor: s };
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
                let q = y;
                try {
                  q = new URL(y).pathname.replace(/^\//, "");
                } catch {
                  q = String(y || "").replace(/^\//, "");
                }
                const Q = q.replace(/\.html$/i, ".md");
                try {
                  const R = await ut(Q, t, i ? i.signal : void 0);
                  if (R && R.raw)
                    return { data: R, pagePath: Q, anchor: s };
                } catch {
                }
                if (typeof le == "string" && le)
                  try {
                    const R = await ut(le, t, i ? i.signal : void 0);
                    if (R && R.raw) {
                      try {
                        Qn(R.meta || {}, le);
                      } catch {
                      }
                      return { data: R, pagePath: le, anchor: s };
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
  const h = ko(a);
  try {
    if (ct())
      try {
        Bt("[router-debug] fetchPageData candidates", { originalRaw: n, resolved: a, pageCandidates: h });
      } catch {
      }
  } catch {
  }
  const f = String(n || "").includes(".md") || String(n || "").includes(".html");
  let g = null;
  if (!f)
    try {
      let y = decodeURIComponent(String(n || ""));
      y = Y(y), y = nn(y), y && !/\.(md|html?)$/i.test(y) && (g = y);
    } catch {
      g = null;
    }
  if (f && h.length === 0 && (String(a).includes(".md") || String(a).includes(".html")) && h.push(a), h.length === 0 && (String(a).includes(".md") || String(a).includes(".html")) && h.push(a), h.length === 1 && /index\.html$/i.test(h[0]) && !f && !K.has(a) && !K.has(decodeURIComponent(String(a || ""))) && !String(a || "").includes("/"))
    throw new Error("Unknown slug: index.html fallback prevented");
  let m = null, p = null, b = null;
  try {
    const y = String(a || "").includes(".md") || String(a || "").includes(".html") || a && (a.startsWith("http://") || a.startsWith("https://") || a.startsWith("/"));
    d = typeof le == "string" && le || K.has(a) || rt && rt.size || Gt._refreshed || f || y;
  } catch {
    d = !0;
  }
  if (!d)
    b = new Error("no page data");
  else
    for (const y of h)
      if (y)
        try {
          const _ = Y(y);
          if (m = await ut(_, t, i ? i.signal : void 0), p = _, g && !K.has(g))
            try {
              let w = "";
              if (m && m.isHtml)
                try {
                  const A = He();
                  if (A) {
                    const S = A.parseFromString(m.raw || "", "text/html"), M = S.querySelector("h1") || S.querySelector("title");
                    M && M.textContent && (w = M.textContent.trim());
                  }
                } catch {
                }
              else {
                const A = (m && m.raw || "").match(/^#\s+(.+)$/m);
                A && A[1] && (w = A[1].trim());
              }
              if (w && he(w) !== g)
                try {
                  if (/\.html$/i.test(_)) {
                    const S = _.replace(/\.html$/i, ".md");
                    if (h.includes(S))
                      try {
                        const M = await ut(S, t, i ? i.signal : void 0);
                        if (M && M.raw)
                          m = M, p = S;
                        else if (typeof le == "string" && le)
                          try {
                            const I = await ut(le, t, i ? i.signal : void 0);
                            if (I && I.raw)
                              m = I, p = le;
                            else {
                              m = null, p = null, b = new Error("slug mismatch for candidate");
                              continue;
                            }
                          } catch {
                            m = null, p = null, b = new Error("slug mismatch for candidate");
                            continue;
                          }
                        else {
                          m = null, p = null, b = new Error("slug mismatch for candidate");
                          continue;
                        }
                      } catch {
                        try {
                          const I = await ut(le, t, i ? i.signal : void 0);
                          if (I && I.raw)
                            m = I, p = le;
                          else {
                            m = null, p = null, b = new Error("slug mismatch for candidate");
                            continue;
                          }
                        } catch {
                          m = null, p = null, b = new Error("slug mismatch for candidate");
                          continue;
                        }
                      }
                    else {
                      m = null, p = null, b = new Error("slug mismatch for candidate");
                      continue;
                    }
                  } else {
                    m = null, p = null, b = new Error("slug mismatch for candidate");
                    continue;
                  }
                } catch {
                  m = null, p = null, b = new Error("slug mismatch for candidate");
                  continue;
                }
            } catch {
            }
          try {
            if (!f && /\.html$/i.test(_)) {
              const w = _.replace(/\.html$/i, ".md");
              if (h.includes(w))
                try {
                  const S = String(m && m.raw || "").trim().slice(0, 128).toLowerCase();
                  if (m && m.isHtml || /^(?:<!doctype|<html|<title|<h1)/i.test(S) || S.indexOf('<div id="app"') !== -1 || S.indexOf("nimbi-") !== -1 || S.indexOf("nimbi") !== -1 || S.indexOf("initcms(") !== -1) {
                    let I = !1;
                    try {
                      const q = await ut(w, t, i ? i.signal : void 0);
                      if (q && q.raw)
                        m = q, p = w, I = !0;
                      else if (typeof le == "string" && le)
                        try {
                          const Q = await ut(le, t, i ? i.signal : void 0);
                          Q && Q.raw && (m = Q, p = le, I = !0);
                        } catch {
                        }
                    } catch {
                      try {
                        const Q = await ut(le, t, i ? i.signal : void 0);
                        Q && Q.raw && (m = Q, p = le, I = !0);
                      } catch {
                      }
                    }
                    if (!I) {
                      m = null, p = null, b = new Error("site shell detected (candidate HTML rejected)");
                      continue;
                    }
                  }
                } catch {
                }
            }
          } catch {
          }
          try {
            if (ct())
              try {
                Bt("[router-debug] fetchPageData accepted candidate", { candidate: _, pagePath: p, isHtml: m && m.isHtml, snippet: m && m.raw ? String(m.raw).slice(0, 160) : null });
              } catch {
              }
          } catch {
          }
          break;
        } catch (_) {
          b = _;
          try {
            ct() && k("[router] candidate fetch failed", { candidate: y, contentBase: t, err: _ && _.message || _ });
          } catch {
          }
        }
  if (!m) {
    const y = b && (b.message || String(b)) || null, _ = y && /failed to fetch md|site shell detected/i.test(y);
    try {
      if (ct())
        try {
          Bt("[router-debug] fetchPageData no data", { originalRaw: n, resolved: a, pageCandidates: h, fetchError: y });
        } catch {
        }
    } catch {
    }
    if (_)
      try {
        if (ct())
          try {
            k("[router] fetchPageData: no page data (expected)", { originalRaw: n, resolved: a, pageCandidates: h, contentBase: t, fetchError: y });
          } catch {
          }
      } catch {
      }
    else
      try {
        if (ct())
          try {
            Yn("[router] fetchPageData: no page data for", { originalRaw: n, resolved: a, pageCandidates: h, contentBase: t, fetchError: y });
          } catch {
          }
      } catch {
      }
    if (typeof le == "string" && le)
      try {
        const w = await ut(le, t, i ? i.signal : void 0);
        if (w && w.raw) {
          try {
            Qn(w.meta || {}, le);
          } catch {
          }
          return { data: w, pagePath: le, anchor: s };
        }
      } catch {
      }
    try {
      if (f && String(n || "").toLowerCase().includes(".html"))
        try {
          const w = new URL(String(n || ""), location.href).toString();
          ct() && k("[router] attempting absolute HTML fetch fallback", w);
          const A = await fetch(w, i ? { signal: i.signal } : void 0);
          if (A && A.ok) {
            const S = await A.text(), M = A && A.headers && typeof A.headers.get == "function" && A.headers.get("content-type") || "", I = (S || "").toLowerCase(), q = M && M.indexOf && M.indexOf("text/html") !== -1 || I.indexOf("<!doctype") !== -1 || I.indexOf("<html") !== -1;
            if (!q && ct())
              try {
                k("[router] absolute fetch returned non-HTML", () => ({ abs: w, contentType: M, snippet: I.slice(0, 200) }));
              } catch {
              }
            if (q) {
              const Q = (S || "").toLowerCase();
              if (/<title>\s*index of\b/i.test(S) || /<h1>\s*index of\b/i.test(S) || Q.indexOf("parent directory") !== -1 || /<title>\s*directory listing/i.test(S) || /<h1>\s*directory listing/i.test(S))
                try {
                  ct() && k("[router] absolute fetch returned directory listing; treating as not found", { abs: w });
                } catch {
                }
              else
                try {
                  const O = w, G = new URL(".", O).toString();
                  try {
                    const D = He();
                    if (D) {
                      const L = D.parseFromString(S || "", "text/html"), H = (ee, Pe) => {
                        try {
                          const ke = Pe.getAttribute(ee) || "";
                          if (!ke || /^(https?:)?\/\//i.test(ke) || ke.startsWith("/") || ke.startsWith("#")) return;
                          try {
                            const xe = new URL(ke, O).toString();
                            Pe.setAttribute(ee, xe);
                          } catch (xe) {
                            k("[router] rewrite attribute failed", ee, xe);
                          }
                        } catch (ke) {
                          k("[router] rewrite helper failed", ke);
                        }
                      }, W = L.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"), ie = [];
                      for (const ee of Array.from(W || []))
                        try {
                          const Pe = ee.tagName ? ee.tagName.toLowerCase() : "";
                          if (Pe === "a") continue;
                          if (ee.hasAttribute("src")) {
                            const ke = ee.getAttribute("src");
                            H("src", ee);
                            const xe = ee.getAttribute("src");
                            ke !== xe && ie.push({ attr: "src", tag: Pe, before: ke, after: xe });
                          }
                          if (ee.hasAttribute("href") && Pe === "link") {
                            const ke = ee.getAttribute("href");
                            H("href", ee);
                            const xe = ee.getAttribute("href");
                            ke !== xe && ie.push({ attr: "href", tag: Pe, before: ke, after: xe });
                          }
                          if (ee.hasAttribute("href") && Pe !== "link") {
                            const ke = ee.getAttribute("href");
                            H("href", ee);
                            const xe = ee.getAttribute("href");
                            ke !== xe && ie.push({ attr: "href", tag: Pe, before: ke, after: xe });
                          }
                          if (ee.hasAttribute("xlink:href")) {
                            const ke = ee.getAttribute("xlink:href");
                            H("xlink:href", ee);
                            const xe = ee.getAttribute("xlink:href");
                            ke !== xe && ie.push({ attr: "xlink:href", tag: Pe, before: ke, after: xe });
                          }
                          if (ee.hasAttribute("poster")) {
                            const ke = ee.getAttribute("poster");
                            H("poster", ee);
                            const xe = ee.getAttribute("poster");
                            ke !== xe && ie.push({ attr: "poster", tag: Pe, before: ke, after: xe });
                          }
                          if (ee.hasAttribute("srcset")) {
                            const Ee = (ee.getAttribute("srcset") || "").split(",").map((qe) => qe.trim()).filter(Boolean).map((qe) => {
                              const [T, $] = qe.split(/\s+/, 2);
                              if (!T || /^(https?:)?\/\//i.test(T) || T.startsWith("/")) return qe;
                              try {
                                const E = new URL(T, O).toString();
                                return $ ? `${E} ${$}` : E;
                              } catch {
                                return qe;
                              }
                            }).join(", ");
                            ee.setAttribute("srcset", Ee);
                          }
                        } catch {
                        }
                      const ye = L.documentElement && L.documentElement.outerHTML ? L.documentElement.outerHTML : S;
                      try {
                        ct() && ie && ie.length && k("[router] rewritten asset refs", { abs: w, rewritten: ie });
                      } catch {
                      }
                      return { data: { raw: ye, isHtml: !0 }, pagePath: String(n || ""), anchor: s };
                    }
                  } catch {
                  }
                  let re = S;
                  return /<base\s+[^>]*>/i.test(S) || (/<head[^>]*>/i.test(S) ? re = S.replace(/(<head[^>]*>)/i, `$1<base href="${G}">`) : re = `<base href="${G}">` + S), { data: { raw: re, isHtml: !0 }, pagePath: String(n || ""), anchor: s };
                } catch {
                  return { data: { raw: S, isHtml: !0 }, pagePath: String(n || ""), anchor: s };
                }
            }
          }
        } catch (w) {
          ct() && k("[router] absolute HTML fetch fallback failed", w);
        }
    } catch {
    }
    try {
      const w = decodeURIComponent(String(a || ""));
      if (w && !/\.(md|html?)$/i.test(w) && typeof le == "string" && le && ct()) {
        const S = [
          `/assets/${w}.html`,
          `/assets/${w}/index.html`
        ];
        for (const M of S)
          try {
            const I = await fetch(M, Object.assign({ method: "GET" }, i ? { signal: i.signal } : {}));
            if (I && I.ok)
              return { data: { raw: await I.text(), isHtml: !0 }, pagePath: M.replace(/^\//, ""), anchor: s };
          } catch {
          }
      }
    } catch (w) {
      ct() && k("[router] assets fallback failed", w);
    }
    throw new Error("no page data");
  }
  return { data: m, pagePath: p, anchor: s };
}
function cr() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var qt = cr();
function Sa(e) {
  qt = e;
}
var Dt = { exec: () => null };
function Le(e, t = "") {
  let n = typeof e == "string" ? e : e.source, i = { replace: (r, a) => {
    let s = typeof a == "string" ? a : a.source;
    return s = s.replace(ot.caret, "$1"), n = n.replace(r, s), i;
  }, getRegex: () => new RegExp(n, t) };
  return i;
}
var So = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), ot = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (e) => new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}#`), htmlBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}>`) }, vo = /^(?:[ \t]*(?:\n|$))+/, Ao = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Eo = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, In = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Co = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Jr = / {0,3}(?:[*+-]|\d{1,9}[.)])/, va = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Aa = Le(va).replace(/bull/g, Jr).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Mo = Le(va).replace(/bull/g, Jr).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), ei = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Lo = /^[^\n]+/, ti = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, To = Le(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", ti).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Ro = Le(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Jr).getRegex(), ur = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", ni = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, zo = Le("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", ni).replace("tag", ur).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Ea = Le(ei).replace("hr", In).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ur).getRegex(), Po = Le(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Ea).getRegex(), ri = { blockquote: Po, code: Ao, def: To, fences: Eo, heading: Co, hr: In, html: zo, lheading: Aa, list: Ro, newline: vo, paragraph: Ea, table: Dt, text: Lo }, Ii = Le("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", In).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ur).getRegex(), $o = { ...ri, lheading: Mo, table: Ii, paragraph: Le(ei).replace("hr", In).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Ii).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", ur).getRegex() }, Io = { ...ri, html: Le(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", ni).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Dt, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: Le(ei).replace("hr", In).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Aa).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, No = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Bo = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Ca = /^( {2,}|\\)\n(?!\s*$)/, Oo = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, hr = /[\p{P}\p{S}]/u, ii = /[\s\p{P}\p{S}]/u, Ma = /[^\s\p{P}\p{S}]/u, jo = Le(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, ii).getRegex(), La = /(?!~)[\p{P}\p{S}]/u, qo = /(?!~)[\s\p{P}\p{S}]/u, Ho = /(?:[^\s\p{P}\p{S}]|~)/u, Ta = /(?![*_])[\p{P}\p{S}]/u, Fo = /(?![*_])[\s\p{P}\p{S}]/u, Do = /(?:[^\s\p{P}\p{S}]|[*_])/u, Uo = Le(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", So ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Ra = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, Wo = Le(Ra, "u").replace(/punct/g, hr).getRegex(), Zo = Le(Ra, "u").replace(/punct/g, La).getRegex(), za = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Go = Le(za, "gu").replace(/notPunctSpace/g, Ma).replace(/punctSpace/g, ii).replace(/punct/g, hr).getRegex(), Xo = Le(za, "gu").replace(/notPunctSpace/g, Ho).replace(/punctSpace/g, qo).replace(/punct/g, La).getRegex(), Qo = Le("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Ma).replace(/punctSpace/g, ii).replace(/punct/g, hr).getRegex(), Ko = Le(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Ta).getRegex(), Yo = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", Vo = Le(Yo, "gu").replace(/notPunctSpace/g, Do).replace(/punctSpace/g, Fo).replace(/punct/g, Ta).getRegex(), Jo = Le(/\\(punct)/, "gu").replace(/punct/g, hr).getRegex(), el = Le(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), tl = Le(ni).replace("(?:-->|$)", "-->").getRegex(), nl = Le("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", tl).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), tr = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, rl = Le(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", tr).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Pa = Le(/^!?\[(label)\]\[(ref)\]/).replace("label", tr).replace("ref", ti).getRegex(), $a = Le(/^!?\[(ref)\](?:\[\])?/).replace("ref", ti).getRegex(), il = Le("reflink|nolink(?!\\()", "g").replace("reflink", Pa).replace("nolink", $a).getRegex(), Ni = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, ai = { _backpedal: Dt, anyPunctuation: Jo, autolink: el, blockSkip: Uo, br: Ca, code: Bo, del: Dt, delLDelim: Dt, delRDelim: Dt, emStrongLDelim: Wo, emStrongRDelimAst: Go, emStrongRDelimUnd: Qo, escape: No, link: rl, nolink: $a, punctuation: jo, reflink: Pa, reflinkSearch: il, tag: nl, text: Oo, url: Dt }, al = { ...ai, link: Le(/^!?\[(label)\]\((.*?)\)/).replace("label", tr).getRegex(), reflink: Le(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", tr).getRegex() }, Nr = { ...ai, emStrongRDelimAst: Xo, emStrongLDelim: Zo, delLDelim: Ko, delRDelim: Vo, url: Le(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Ni).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: Le(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Ni).getRegex() }, sl = { ...Nr, br: Le(Ca).replace("{2,}", "*").getRegex(), text: Le(Nr.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Un = { normal: ri, gfm: $o, pedantic: Io }, un = { normal: ai, gfm: Nr, breaks: sl, pedantic: al }, ol = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Bi = (e) => ol[e];
function kt(e, t) {
  if (t) {
    if (ot.escapeTest.test(e)) return e.replace(ot.escapeReplace, Bi);
  } else if (ot.escapeTestNoEncode.test(e)) return e.replace(ot.escapeReplaceNoEncode, Bi);
  return e;
}
function Oi(e) {
  try {
    e = encodeURI(e).replace(ot.percentDecode, "%");
  } catch {
    return null;
  }
  return e;
}
function ji(e, t) {
  let n = e.replace(ot.findPipe, (a, s, o) => {
    let l = !1, c = s;
    for (; --c >= 0 && o[c] === "\\"; ) l = !l;
    return l ? "|" : " |";
  }), i = n.split(ot.splitPipe), r = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !i.at(-1)?.trim() && i.pop(), t) if (i.length > t) i.splice(t);
  else for (; i.length < t; ) i.push("");
  for (; r < i.length; r++) i[r] = i[r].trim().replace(ot.slashPipe, "|");
  return i;
}
function hn(e, t, n) {
  let i = e.length;
  if (i === 0) return "";
  let r = 0;
  for (; r < i && e.charAt(i - r - 1) === t; )
    r++;
  return e.slice(0, i - r);
}
function ll(e, t) {
  if (e.indexOf(t[1]) === -1) return -1;
  let n = 0;
  for (let i = 0; i < e.length; i++) if (e[i] === "\\") i++;
  else if (e[i] === t[0]) n++;
  else if (e[i] === t[1] && (n--, n < 0)) return i;
  return n > 0 ? -2 : -1;
}
function cl(e, t = 0) {
  let n = t, i = "";
  for (let r of e) if (r === "	") {
    let a = 4 - n % 4;
    i += " ".repeat(a), n += a;
  } else i += r, n++;
  return i;
}
function qi(e, t, n, i, r) {
  let a = t.href, s = t.title || null, o = e[1].replace(r.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  let l = { type: e[0].charAt(0) === "!" ? "image" : "link", raw: n, href: a, title: s, text: o, tokens: i.inlineTokens(o) };
  return i.state.inLink = !1, l;
}
function ul(e, t, n) {
  let i = e.match(n.other.indentCodeCompensation);
  if (i === null) return t;
  let r = i[1];
  return t.split(`
`).map((a) => {
    let s = a.match(n.other.beginningSpace);
    if (s === null) return a;
    let [o] = s;
    return o.length >= r.length ? a.slice(r.length) : a;
  }).join(`
`);
}
var Tn = class {
  options;
  rules;
  lexer;
  constructor(e) {
    this.options = e || qt;
  }
  space(e) {
    let t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0) return { type: "space", raw: t[0] };
  }
  code(e) {
    let t = this.rules.block.code.exec(e);
    if (t) {
      let n = t[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : hn(n, `
`) };
    }
  }
  fences(e) {
    let t = this.rules.block.fences.exec(e);
    if (t) {
      let n = t[0], i = ul(n, t[3] || "", this.rules);
      return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: i };
    }
  }
  heading(e) {
    let t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let i = hn(n, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceChar.test(i)) && (n = i.trim());
      }
      return { type: "heading", raw: t[0], depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t) return { type: "hr", raw: hn(t[0], `
`) };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = hn(t[0], `
`).split(`
`), i = "", r = "", a = [];
      for (; n.length > 0; ) {
        let s = !1, o = [], l;
        for (l = 0; l < n.length; l++) if (this.rules.other.blockquoteStart.test(n[l])) o.push(n[l]), s = !0;
        else if (!s) o.push(n[l]);
        else break;
        n = n.slice(l);
        let c = o.join(`
`), u = c.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${c}` : c, r = r ? `${r}
${u}` : u;
        let d = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(u, a, !0), this.lexer.state.top = d, n.length === 0) break;
        let h = a.at(-1);
        if (h?.type === "code") break;
        if (h?.type === "blockquote") {
          let f = h, g = f.raw + `
` + n.join(`
`), m = this.blockquote(g);
          a[a.length - 1] = m, i = i.substring(0, i.length - f.raw.length) + m.raw, r = r.substring(0, r.length - f.text.length) + m.text;
          break;
        } else if (h?.type === "list") {
          let f = h, g = f.raw + `
` + n.join(`
`), m = this.list(g);
          a[a.length - 1] = m, i = i.substring(0, i.length - h.raw.length) + m.raw, r = r.substring(0, r.length - f.raw.length) + m.raw, n = g.substring(a.at(-1).raw.length).split(`
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
        let l = !1, c = "", u = "";
        if (!(t = a.exec(e)) || this.rules.block.hr.test(e)) break;
        c = t[0], e = e.substring(c.length);
        let d = cl(t[2].split(`
`, 1)[0], t[1].length), h = e.split(`
`, 1)[0], f = !d.trim(), g = 0;
        if (this.options.pedantic ? (g = 2, u = d.trimStart()) : f ? g = t[1].length + 1 : (g = d.search(this.rules.other.nonSpaceChar), g = g > 4 ? 1 : g, u = d.slice(g), g += t[1].length), f && this.rules.other.blankLine.test(h) && (c += h + `
`, e = e.substring(h.length + 1), l = !0), !l) {
          let m = this.rules.other.nextBulletRegex(g), p = this.rules.other.hrRegex(g), b = this.rules.other.fencesBeginRegex(g), y = this.rules.other.headingBeginRegex(g), _ = this.rules.other.htmlBeginRegex(g), w = this.rules.other.blockquoteBeginRegex(g);
          for (; e; ) {
            let A = e.split(`
`, 1)[0], S;
            if (h = A, this.options.pedantic ? (h = h.replace(this.rules.other.listReplaceNesting, "  "), S = h) : S = h.replace(this.rules.other.tabCharGlobal, "    "), b.test(h) || y.test(h) || _.test(h) || w.test(h) || m.test(h) || p.test(h)) break;
            if (S.search(this.rules.other.nonSpaceChar) >= g || !h.trim()) u += `
` + S.slice(g);
            else {
              if (f || d.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || b.test(d) || y.test(d) || p.test(d)) break;
              u += `
` + h;
            }
            f = !h.trim(), c += A + `
`, e = e.substring(A.length + 1), d = S.slice(g);
          }
        }
        r.loose || (s ? r.loose = !0 : this.rules.other.doubleBlankLine.test(c) && (s = !0)), r.items.push({ type: "list_item", raw: c, task: !!this.options.gfm && this.rules.other.listIsTask.test(u), loose: !1, text: u, tokens: [] }), r.raw += c;
      }
      let o = r.items.at(-1);
      if (o) o.raw = o.raw.trimEnd(), o.text = o.text.trimEnd();
      else return;
      r.raw = r.raw.trimEnd();
      for (let l of r.items) {
        if (this.lexer.state.top = !1, l.tokens = this.lexer.blockTokens(l.text, []), l.task) {
          if (l.text = l.text.replace(this.rules.other.listReplaceTask, ""), l.tokens[0]?.type === "text" || l.tokens[0]?.type === "paragraph") {
            l.tokens[0].raw = l.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), l.tokens[0].text = l.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let u = this.lexer.inlineQueue.length - 1; u >= 0; u--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[u].src)) {
              this.lexer.inlineQueue[u].src = this.lexer.inlineQueue[u].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let c = this.rules.other.listTaskCheckbox.exec(l.raw);
          if (c) {
            let u = { type: "checkbox", raw: c[0] + " ", checked: c[0] !== "[ ]" };
            l.checked = u.checked, r.loose ? l.tokens[0] && ["paragraph", "text"].includes(l.tokens[0].type) && "tokens" in l.tokens[0] && l.tokens[0].tokens ? (l.tokens[0].raw = u.raw + l.tokens[0].raw, l.tokens[0].text = u.raw + l.tokens[0].text, l.tokens[0].tokens.unshift(u)) : l.tokens.unshift({ type: "paragraph", raw: u.raw, text: u.raw, tokens: [u] }) : l.tokens.unshift(u);
          }
        }
        if (!r.loose) {
          let c = l.tokens.filter((d) => d.type === "space"), u = c.length > 0 && c.some((d) => this.rules.other.anyLine.test(d.raw));
          r.loose = u;
        }
      }
      if (r.loose) for (let l of r.items) {
        l.loose = !0;
        for (let c of l.tokens) c.type === "text" && (c.type = "paragraph");
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
    let n = ji(t[1]), i = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: t[0], header: [], align: [], rows: [] };
    if (n.length === i.length) {
      for (let s of i) this.rules.other.tableAlignRight.test(s) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(s) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(s) ? a.align.push("left") : a.align.push(null);
      for (let s = 0; s < n.length; s++) a.header.push({ text: n[s], tokens: this.lexer.inline(n[s]), header: !0, align: a.align[s] });
      for (let s of r) a.rows.push(ji(s, a.header.length).map((o, l) => ({ text: o, tokens: this.lexer.inline(o), header: !1, align: a.align[l] })));
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
        let a = hn(n.slice(0, -1), "\\");
        if ((n.length - a.length) % 2 === 0) return;
      } else {
        let a = ll(t[2], "()");
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
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? i = i.slice(1) : i = i.slice(1, -1)), qi(t, { href: i && i.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
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
      return qi(n, r, n[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, n = "") {
    let i = this.rules.inline.emStrongLDelim.exec(e);
    if (!(!i || i[3] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(i[1] || i[2]) || !n || this.rules.inline.punctuation.exec(n))) {
      let r = [...i[0]].length - 1, a, s, o = r, l = 0, c = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (c.lastIndex = 0, t = t.slice(-1 * e.length + r); (i = c.exec(t)) != null; ) {
        if (a = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !a) continue;
        if (s = [...a].length, i[3] || i[4]) {
          o += s;
          continue;
        } else if ((i[5] || i[6]) && r % 3 && !((r + s) % 3)) {
          l += s;
          continue;
        }
        if (o -= s, o > 0) continue;
        s = Math.min(s, s + o + l);
        let u = [...i[0]][0].length, d = e.slice(0, r + i.index + u + s);
        if (Math.min(r, s) % 2) {
          let f = d.slice(1, -1);
          return { type: "em", raw: d, text: f, tokens: this.lexer.inlineTokens(f) };
        }
        let h = d.slice(2, -2);
        return { type: "strong", raw: d, text: h, tokens: this.lexer.inlineTokens(h) };
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
      let r = [...i[0]].length - 1, a, s, o = r, l = this.rules.inline.delRDelim;
      for (l.lastIndex = 0, t = t.slice(-1 * e.length + r); (i = l.exec(t)) != null; ) {
        if (a = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !a || (s = [...a].length, s !== r)) continue;
        if (i[3] || i[4]) {
          o += s;
          continue;
        }
        if (o -= s, o > 0) continue;
        s = Math.min(s, s + o);
        let c = [...i[0]][0].length, u = e.slice(0, r + i.index + c + s), d = u.slice(r, -r);
        return { type: "del", raw: u, text: d, tokens: this.lexer.inlineTokens(d) };
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
}, pt = class Br {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(t) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || qt, this.options.tokenizer = this.options.tokenizer || new Tn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: ot, block: Un.normal, inline: un.normal };
    this.options.pedantic ? (n.block = Un.pedantic, n.inline = un.pedantic) : this.options.gfm && (n.block = Un.gfm, this.options.breaks ? n.inline = un.breaks : n.inline = un.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: Un, inline: un };
  }
  static lex(t, n) {
    return new Br(n).lex(t);
  }
  static lexInline(t, n) {
    return new Br(n).inlineTokens(t);
  }
  lex(t) {
    t = t.replace(ot.carriageReturn, `
`), this.blockTokens(t, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let i = this.inlineQueue[n];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(t, n = [], i = !1) {
    for (this.options.pedantic && (t = t.replace(ot.tabCharGlobal, "    ").replace(ot.spaceLine, "")); t; ) {
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
        let s = 1 / 0, o = t.slice(1), l;
        this.options.extensions.startBlock.forEach((c) => {
          l = c.call({ lexer: this }, o), typeof l == "number" && l >= 0 && (s = Math.min(s, l));
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
      let l = Object.keys(this.tokens.links);
      if (l.length > 0) for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(i)) != null; ) l.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (i = i.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(i)) != null; ) i = i.slice(0, r.index) + "++" + i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let a;
    for (; (r = this.tokenizer.rules.inline.blockSkip.exec(i)) != null; ) a = r[2] ? r[2].length : 0, i = i.slice(0, r.index + a) + "[" + "a".repeat(r[0].length - a - 2) + "]" + i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    i = this.options.hooks?.emStrongMask?.call({ lexer: this }, i) ?? i;
    let s = !1, o = "";
    for (; t; ) {
      s || (o = ""), s = !1;
      let l;
      if (this.options.extensions?.inline?.some((u) => (l = u.call({ lexer: this }, t, n)) ? (t = t.substring(l.raw.length), n.push(l), !0) : !1)) continue;
      if (l = this.tokenizer.escape(t)) {
        t = t.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.tag(t)) {
        t = t.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.link(t)) {
        t = t.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.reflink(t, this.tokens.links)) {
        t = t.substring(l.raw.length);
        let u = n.at(-1);
        l.type === "text" && u?.type === "text" ? (u.raw += l.raw, u.text += l.text) : n.push(l);
        continue;
      }
      if (l = this.tokenizer.emStrong(t, i, o)) {
        t = t.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.codespan(t)) {
        t = t.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.br(t)) {
        t = t.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.del(t, i, o)) {
        t = t.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.autolink(t)) {
        t = t.substring(l.raw.length), n.push(l);
        continue;
      }
      if (!this.state.inLink && (l = this.tokenizer.url(t))) {
        t = t.substring(l.raw.length), n.push(l);
        continue;
      }
      let c = t;
      if (this.options.extensions?.startInline) {
        let u = 1 / 0, d = t.slice(1), h;
        this.options.extensions.startInline.forEach((f) => {
          h = f.call({ lexer: this }, d), typeof h == "number" && h >= 0 && (u = Math.min(u, h));
        }), u < 1 / 0 && u >= 0 && (c = t.substring(0, u + 1));
      }
      if (l = this.tokenizer.inlineText(c)) {
        t = t.substring(l.raw.length), l.raw.slice(-1) !== "_" && (o = l.raw.slice(-1)), s = !0;
        let u = n.at(-1);
        u?.type === "text" ? (u.raw += l.raw, u.text += l.text) : n.push(l);
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
}, Rn = class {
  options;
  parser;
  constructor(e) {
    this.options = e || qt;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    let i = (t || "").match(ot.notSpaceStart)?.[0], r = e.replace(ot.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + kt(i) + '">' + (n ? r : kt(r, !0)) + `</code></pre>
` : "<pre><code>" + (n ? r : kt(r, !0)) + `</code></pre>
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
      let o = e.items[s];
      i += this.listitem(o);
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
    return `<code>${kt(e, !0)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    let i = this.parser.parseInline(n), r = Oi(e);
    if (r === null) return i;
    e = r;
    let a = '<a href="' + e + '"';
    return t && (a += ' title="' + kt(t) + '"'), a += ">" + i + "</a>", a;
  }
  image({ href: e, title: t, text: n, tokens: i }) {
    i && (n = this.parser.parseInline(i, this.parser.textRenderer));
    let r = Oi(e);
    if (r === null) return kt(n);
    e = r;
    let a = `<img src="${e}" alt="${kt(n)}"`;
    return t && (a += ` title="${kt(t)}"`), a += ">", a;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : kt(e.text);
  }
}, dr = class {
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
}, gt = class Or {
  options;
  renderer;
  textRenderer;
  constructor(t) {
    this.options = t || qt, this.options.renderer = this.options.renderer || new Rn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new dr();
  }
  static parse(t, n) {
    return new Or(n).parse(t);
  }
  static parseInline(t, n) {
    return new Or(n).parseInline(t);
  }
  parse(t) {
    let n = "";
    for (let i = 0; i < t.length; i++) {
      let r = t[i];
      if (this.options.extensions?.renderers?.[r.type]) {
        let s = r, o = this.options.extensions.renderers[s.type].call({ parser: this }, s);
        if (o !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(s.type)) {
          n += o || "";
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
        let o = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (o !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(a.type)) {
          i += o || "";
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
          let o = 'Token with "' + s.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return i;
  }
}, en = class {
  options;
  block;
  constructor(e) {
    this.options = e || qt;
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
    return this.block ? pt.lex : pt.lexInline;
  }
  provideParser() {
    return this.block ? gt.parse : gt.parseInline;
  }
}, Ia = class {
  defaults = cr();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = gt;
  Renderer = Rn;
  TextRenderer = dr;
  Lexer = pt;
  Tokenizer = Tn;
  Hooks = en;
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
            let o = r.renderer.apply(this, s);
            return o === !1 && (o = a.apply(this, s)), o;
          } : t.renderers[r.name] = r.renderer;
        }
        if ("tokenizer" in r) {
          if (!r.level || r.level !== "block" && r.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let a = t[r.level];
          a ? a.unshift(r.tokenizer) : t[r.level] = [r.tokenizer], r.start && (r.level === "block" ? t.startBlock ? t.startBlock.push(r.start) : t.startBlock = [r.start] : r.level === "inline" && (t.startInline ? t.startInline.push(r.start) : t.startInline = [r.start]));
        }
        "childTokens" in r && r.childTokens && (t.childTokens[r.name] = r.childTokens);
      }), i.extensions = t), n.renderer) {
        let r = this.defaults.renderer || new Rn(this.defaults);
        for (let a in n.renderer) {
          if (!(a in r)) throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a)) continue;
          let s = a, o = n.renderer[s], l = r[s];
          r[s] = (...c) => {
            let u = o.apply(r, c);
            return u === !1 && (u = l.apply(r, c)), u || "";
          };
        }
        i.renderer = r;
      }
      if (n.tokenizer) {
        let r = this.defaults.tokenizer || new Tn(this.defaults);
        for (let a in n.tokenizer) {
          if (!(a in r)) throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a)) continue;
          let s = a, o = n.tokenizer[s], l = r[s];
          r[s] = (...c) => {
            let u = o.apply(r, c);
            return u === !1 && (u = l.apply(r, c)), u;
          };
        }
        i.tokenizer = r;
      }
      if (n.hooks) {
        let r = this.defaults.hooks || new en();
        for (let a in n.hooks) {
          if (!(a in r)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let s = a, o = n.hooks[s], l = r[s];
          en.passThroughHooks.has(a) ? r[s] = (c) => {
            if (this.defaults.async && en.passThroughHooksRespectAsync.has(a)) return (async () => {
              let d = await o.call(r, c);
              return l.call(r, d);
            })();
            let u = o.call(r, c);
            return l.call(r, u);
          } : r[s] = (...c) => {
            if (this.defaults.async) return (async () => {
              let d = await o.apply(r, c);
              return d === !1 && (d = await l.apply(r, c)), d;
            })();
            let u = o.apply(r, c);
            return u === !1 && (u = l.apply(r, c)), u;
          };
        }
        i.hooks = r;
      }
      if (n.walkTokens) {
        let r = this.defaults.walkTokens, a = n.walkTokens;
        i.walkTokens = function(s) {
          let o = [];
          return o.push(a.call(this, s)), r && (o = o.concat(r.call(this, s))), o;
        };
      }
      this.defaults = { ...this.defaults, ...i };
    }), this;
  }
  setOptions(e) {
    return this.defaults = { ...this.defaults, ...e }, this;
  }
  lexer(e, t) {
    return pt.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return gt.parse(e, t ?? this.defaults);
  }
  parseMarkdown(e) {
    return (t, n) => {
      let i = { ...n }, r = { ...this.defaults, ...i }, a = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && i.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof t > "u" || t === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof t != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = e), r.async) return (async () => {
        let s = r.hooks ? await r.hooks.preprocess(t) : t, o = await (r.hooks ? await r.hooks.provideLexer() : e ? pt.lex : pt.lexInline)(s, r), l = r.hooks ? await r.hooks.processAllTokens(o) : o;
        r.walkTokens && await Promise.all(this.walkTokens(l, r.walkTokens));
        let c = await (r.hooks ? await r.hooks.provideParser() : e ? gt.parse : gt.parseInline)(l, r);
        return r.hooks ? await r.hooks.postprocess(c) : c;
      })().catch(a);
      try {
        r.hooks && (t = r.hooks.preprocess(t));
        let s = (r.hooks ? r.hooks.provideLexer() : e ? pt.lex : pt.lexInline)(t, r);
        r.hooks && (s = r.hooks.processAllTokens(s)), r.walkTokens && this.walkTokens(s, r.walkTokens);
        let o = (r.hooks ? r.hooks.provideParser() : e ? gt.parse : gt.parseInline)(s, r);
        return r.hooks && (o = r.hooks.postprocess(o)), o;
      } catch (s) {
        return a(s);
      }
    };
  }
  onError(e, t) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
        let i = "<p>An error occurred:</p><pre>" + kt(n.message + "", !0) + "</pre>";
        return t ? Promise.resolve(i) : i;
      }
      if (t) return Promise.reject(n);
      throw n;
    };
  }
}, Kt = new Ia();
function Ae(e, t) {
  return Kt.parse(e, t);
}
Ae.options = Ae.setOptions = function(e) {
  return Kt.setOptions(e), Ae.defaults = Kt.defaults, Sa(Ae.defaults), Ae;
};
Ae.getDefaults = cr;
Ae.defaults = qt;
Ae.use = function(...e) {
  return Kt.use(...e), Ae.defaults = Kt.defaults, Sa(Ae.defaults), Ae;
};
Ae.walkTokens = function(e, t) {
  return Kt.walkTokens(e, t);
};
Ae.parseInline = Kt.parseInline;
Ae.Parser = gt;
Ae.parser = gt.parse;
Ae.Renderer = Rn;
Ae.TextRenderer = dr;
Ae.Lexer = pt;
Ae.lexer = pt.lex;
Ae.Tokenizer = Tn;
Ae.Hooks = en;
Ae.parse = Ae;
var hl = Ae.options, dl = Ae.setOptions, fl = Ae.use, pl = Ae.walkTokens, gl = Ae.parseInline, ml = Ae, yl = gt.parse, bl = pt.lex;
const Hi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hooks: en,
  Lexer: pt,
  Marked: Ia,
  Parser: gt,
  Renderer: Rn,
  TextRenderer: dr,
  Tokenizer: Tn,
  get defaults() {
    return qt;
  },
  getDefaults: cr,
  lexer: bl,
  marked: Ae,
  options: hl,
  parse: ml,
  parseInline: gl,
  parser: yl,
  setOptions: dl,
  use: fl,
  walkTokens: pl
}, Symbol.toStringTag, { value: "Module" })), wl = `/**
 * @module worker/renderer
 */
import * as _markedModule from 'marked'
import { parseFrontmatter } from '../utils/frontmatter.js'
import { importUrlWithCache, runImportWithCache, clearImportCache, setImportNegativeCacheTTL } from '../utils/importCache.js'

// Lightweight local HTML entity decoder to avoid importing utils in worker
function decodeHtmlEntitiesLocal(s) {
  try {
    if (!s && s !== 0) return ''
    const str = String(s)
    const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }
    return str.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, g) => {
      if (!g) return m
      if (g[0] === '#') {
        try {
          if (g[1] === 'x' || g[1] === 'X') return String.fromCharCode(parseInt(g.slice(2), 16))
          return String.fromCharCode(parseInt(g.slice(1), 10))
        } catch (e) {
          return m
        }
      }
      return (named[g] !== undefined) ? named[g] : m
    })
  } catch (err) {
    return String(s || '')
  }
}

const marked = (_markedModule && (_markedModule.marked || _markedModule)) || undefined

// Hoisted regex and helpers to avoid reallocation per-message
const FENCE_RE = /\`\`\`\\s*([a-zA-Z0-9_\\-+]+)?/g
const FALLBACK_KNOWN = new Set(['bash','sh','zsh','javascript','js','python','py','php','java','c','cpp','rust','go','ruby','perl','r','scala','swift','kotlin','cs','csharp','html','css','json','xml','yaml','yml','dockerfile','docker'])
function slugifyHeading(s) { try { return String(s || '').toLowerCase().trim().replace(/[^a-z0-9\\-\\s]+/g, '').replace(/\\s+/g, '-') } catch (e) { return 'heading' } }

/**
 * Worker entrypoint for rendering markdown to HTML and registering
 * highlight.js languages on demand.
 *
 * Accepted messages:
 * - \`{ type: 'register', name: string, url: string }\` — dynamically import
 *   a highlight.js language module and register it. Replies with
 *   \`{ type: 'registered', name }\` or \`{ type: 'register-error', name, error }\`.
 * - \`{ id: string, md: string }\` — render \`md\` (which may contain frontmatter)
 *   and reply with \`{ id, result: { html: string, meta: Record<string,string>, toc: Array<{level:number,text:string}> } }\`.
 *
 * On error the worker posts \`{ id, error: string }\`.
 */

/**
 * Worker \`onmessage\` handler for renderer tasks is defined below. The worker
 * listens for messages like \`{ type: 'register', name, url }\`, \`{ type: 'detect', id, md, supported }\`,
 * or rendering requests \`{ id, md }\` and replies with \`{ id, result }\` or \`{ id, error }\`.
 *
 * The top-level \`onmessage\` assignment directly handles posting results; see function body below.
 */

let hljs = null
const HLJS_CDN_BASE = 'https://cdn.jsdelivr.net/npm/highlight.js'

/** Clear renderer import cache (useful for tests). */
export function clearRendererImportCache() { clearImportCache(); hljs = null }

/** Adjust negative-cache TTL for renderer dynamic imports. */
export function setRendererImportNegativeCacheTTL(ms) { setImportNegativeCacheTTL(ms) }

/** Import a module URL using the shared import cache. */
async function importModuleWithCache(url) { return await importUrlWithCache(url) }

async function ensureHljs() {
  if (hljs) return hljs
    try {
      const url = HLJS_CDN_BASE + '/lib/core.js'
      // Try a static import for the known CDN core path so test mocks
      // (vitest \`vi.mock('https://cdn.jsdelivr.net/...')\`) can intercept it.
      try {
        const mod = await import('https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js')
        if (mod) {
          hljs = mod.default || mod
          try { await runImportWithCache(url, async () => mod) } catch (_) {}
        } else {
          hljs = null
        }
      } catch (e) {
        const mod = await importModuleWithCache(url)
        if (mod) hljs = mod.default || mod
        else hljs = null
      }
    } catch (e) {
      hljs = null
    }
  return hljs
}

function extractToc(md) {
  const lines = md.split('\\n')
  const toc = []
  for (const line of lines) {
    const m = line.match(/^(#{1,6})\\s+(.*)$/)
    if (m) toc.push({ level: m[1].length, text: m[2].trim() })
  }
  return toc
}

if (marked && typeof marked.setOptions === 'function') {
  marked.setOptions({
  gfm: true,
  headerIds: true,
  mangle: false,
    highlighted: (code, lang) => {
    try {
      if (hljs && lang && typeof hljs.getLanguage === 'function' && hljs.getLanguage(lang)) return hljs.highlight(code, { language: lang }).value
      if (hljs && typeof hljs.getLanguage === 'function' && hljs.getLanguage('plaintext')) {
        return hljs.highlight(code, { language: 'plaintext' }).value
      }
      return code
    } catch (e) {
      return code
    }
  }
  })
}

/**
 * Worker \`onmessage\` handler implementation for renderer (attached to global \`onmessage\`).
 * @param {MessageEvent} ev - Event carrying the request data in \`ev.data\`.
 * @returns {Promise<void>} Posts worker reply messages (\`{id, result}\` or \`{id, error}\`).
 */
onmessage = async (ev) => {
  const msg = ev.data || {}
  try {
    if (msg.type === 'register') {
      const { name, url } = msg
      try {
        const availableHljs = await ensureHljs()
        if (!availableHljs) {
          postMessage({ type: 'register-error', name, error: 'hljs unavailable' })
          return
        }
        const mod = await importModuleWithCache(url)
        const lang = mod ? (mod.default || mod) : null
        if (!lang) throw new Error('failed to import language module')
        hljs.registerLanguage(name, lang)
        postMessage({ type: 'registered', name })
      } catch (e) {
        postMessage({ type: 'register-error', name, error: String(e) })
      }
      return
    }

    if (msg.type === 'detect') {
      const mdText = msg.md || ''
      const supported = msg.supported || []
      const res = new Set()
      const re = new RegExp(FENCE_RE.source, FENCE_RE.flags)
      let m
      while ((m = re.exec(mdText))) {
        if (m[1]) {
          const name = String(m[1]).toLowerCase()
          if (!name) continue
          if (name.length >= 5 && name.length <= 30 && /^[a-z][a-z0-9_\\-+]*$/.test(name)) res.add(name)
          if (FALLBACK_KNOWN.has(name)) res.add(name)
          if (supported && supported.length) {
            try {
              if (supported.indexOf(name) !== -1) res.add(name)
            } catch (e) {}
          }
        }
      }
      postMessage({ id: msg.id, result: Array.from(res) })
      return
    }

    const { id, md } = msg
    const { content, data } = parseFrontmatter(md || '')
    await ensureHljs().catch(() => {})
    let html = marked.parse(content)
    
    const heads = []
    const idCounts = new Map()
    const slugify = slugifyHeading
    html = html.replace(/<h([1-6])([^>]*)>([\\s\\S]*?)<\\/h\\1>/g, (full, lvl, attrs, inner) => {
      const level = Number(lvl)
      let text = inner.replace(/<[^>]+>/g, '').trim()
      try { text = decodeHtmlEntitiesLocal(text) } catch (e) {}
      let existingId = null
      const idMatch = (attrs || '').match(/\\sid="([^"]+)"/)
      if (idMatch) existingId = idMatch[1]
      const base = existingId || slugify(text) || 'heading'
      const prev = idCounts.get(base) || 0
      const idx = prev + 1
      idCounts.set(base, idx)
      const candidate = idx === 1 ? base : base + '-' + idx
      heads.push({ level, text, id: candidate })
      const resp = {
        1: 'is-size-3-mobile is-size-2-tablet is-size-1-desktop',
        2: 'is-size-4-mobile is-size-3-tablet is-size-2-desktop',
        3: 'is-size-5-mobile is-size-4-tablet is-size-3-desktop',
        4: 'is-size-6-mobile is-size-5-tablet is-size-4-desktop',
        5: 'is-size-6-mobile is-size-6-tablet is-size-5-desktop',
        6: 'is-size-6-mobile is-size-6-tablet is-size-6-desktop'
      }
      const weight = (level <= 2) ? 'has-text-weight-bold' : (level <= 4) ? 'has-text-weight-semibold' : 'has-text-weight-normal'
      const classes = (resp[level] + ' ' + weight).trim()
      const cleanAttrs = (attrs || '').replace(/\\s*(id|class)="[^"]*"/g, '')
      const newAttrs = (cleanAttrs + \` id="\${candidate}" class="\${classes}"\`).trim()
      return \`<h\${level} \${newAttrs}>\${inner}</h\${level}>\`
    })

    html = html.replace(/<img([^>]*)>/g, (full, attrs) => {
      if (/\\bloading=/.test(attrs)) return \`<img\${attrs}>\`
      if (/\\bdata-want-lazy=/.test(attrs)) return \`<img\${attrs}>\`
      return \`<img\${attrs} loading="lazy">\`
    })
    postMessage({ id, result: { html, meta: data || {}, toc: heads } })
  } catch (e) {
    postMessage({ id: msg.id, error: String(e) })
  }
}

/**
 * Helper to process renderer worker messages outside of a Worker.
 * @param {Object} msg - Message object sent to the renderer (see worker accepted messages above).
 * @returns {Promise<Object>} Response shaped like worker replies: \`{id, result}\` or \`{id, error}\`.
 */
export async function handleWorkerMessage(msg) {
  try {
    if (msg && msg.type === 'register') {
      const { name, url } = msg
      try {
        const availableHljs = await ensureHljs()
        if (!availableHljs) return { type: 'register-error', name, error: 'hljs unavailable' }
        const mod = await importModuleWithCache(url)
        const lang = mod ? (mod.default || mod) : null
        if (!lang) return { type: 'register-error', name, error: 'failed to import language module' }
        hljs.registerLanguage(name, lang)
        return { type: 'registered', name }
      } catch (e) {
        return { type: 'register-error', name, error: String(e) }
      }
    }

    if (msg && msg.type === 'detect') {
      const mdText = msg.md || ''
      const supported = msg.supported || []
      const res = new Set()
      const re = new RegExp(FENCE_RE.source, FENCE_RE.flags)
      let m
      while ((m = re.exec(mdText))) {
        if (m[1]) {
          const name = String(m[1]).toLowerCase()
          if (!name) continue
          if (name.length >= 5 && name.length <= 30 && /^[a-z][a-z0-9_\\-+]*$/.test(name)) res.add(name)
          if (FALLBACK_KNOWN.has(name)) res.add(name)
          if (supported && supported.length) {
            try {
              if (supported.indexOf(name) !== -1) res.add(name)
            } catch (e) {}
          }
        }
      }
      return { id: msg.id, result: Array.from(res) }
    }

    const id = msg && msg.id
    const { content, data } = parseFrontmatter(msg && msg.md || '')
    await ensureHljs().catch(() => {})
    let html = marked.parse(content)

    const heads = []
    const idCounts = new Map()
    const slugify = slugifyHeading
    html = html.replace(/<h([1-6])([^>]*)>([\\s\\S]*?)<\\/h\\1>/g, (full, lvl, attrs, inner) => {
      const level = Number(lvl)
      let text = inner.replace(/<[^>]+>/g, '').trim()
      try { text = decodeHtmlEntitiesLocal(text) } catch (e) {}
      let existingId = null
      const idMatch = (attrs || '').match(/\\sid="([^"]+)"/)
      if (idMatch) existingId = idMatch[1]
      const base = existingId || slugify(text) || 'heading'
      const prev = idCounts.get(base) || 0
      const idx = prev + 1
      idCounts.set(base, idx)
      const candidate = idx === 1 ? base : base + '-' + idx
      heads.push({ level, text, id: candidate })
      const resp = {
        1: 'is-size-3-mobile is-size-2-tablet is-size-1-desktop',
        2: 'is-size-4-mobile is-size-3-tablet is-size-2-desktop',
        3: 'is-size-5-mobile is-size-4-tablet is-size-3-desktop',
        4: 'is-size-6-mobile is-size-5-tablet is-size-4-desktop',
        5: 'is-size-6-mobile is-size-6-tablet is-size-5-desktop',
        6: 'is-size-6-mobile is-size-6-tablet is-size-6-desktop'
      }
      const weight = (level <= 2) ? 'has-text-weight-bold' : (level <= 4) ? 'has-text-weight-semibold' : 'has-text-weight-normal'
      const classes = (resp[level] + ' ' + weight).trim()
      const cleanAttrs = (attrs || '').replace(/\\s*(id|class)="[^"]*"/g, '')
      const newAttrs = (cleanAttrs + \` id="\${candidate}" class="\${classes}"\`).trim()
      return \`<h\${level} \${newAttrs}>\${inner}</h\${level}>\`
    })

    html = html.replace(/<img([^>]*)>/g, (full, attrs) => {
      if (/\\bloading=/.test(attrs)) return \`<img\${attrs}>\`
      if (/\\bdata-want-lazy=/.test(attrs)) return \`<img\${attrs}>\`
      return \`<img\${attrs} loading="lazy">\`
    })

    return { id, result: { html, meta: data || {}, toc: heads } }
  } catch (e) {
    return { id: msg && msg.id, error: String(e) }
  }
}
`, Na = `function H() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var $ = H();
function ue(s) {
  $ = s;
}
var z = { exec: () => null };
function f(s, e = "") {
  let r = typeof s == "string" ? s : s.source, n = { replace: (t, l) => {
    let i = typeof l == "string" ? l : l.source;
    return i = i.replace(m.caret, "$1"), r = r.replace(t, i), n;
  }, getRegex: () => new RegExp(r, e) };
  return n;
}
var Pe = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), m = { codeRemoveIndent: /^(?: {1,4}| {0,3}\\t)/gm, outputLinkReplace: /\\\\([\\[\\]])/g, indentCodeCompensation: /^(\\s+)(?:\`\`\`)/, beginningSpace: /^\\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\\n/g, tabCharGlobal: /\\t/g, multipleSpaceGlobal: /\\s+/g, blankLine: /^[ \\t]*$/, doubleBlankLine: /\\n[ \\t]*\\n[ \\t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\\n {0,3}((?:=+|-+) *)(?=\\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \\t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\\[[ xX]\\] +\\S/, listReplaceTask: /^\\[[ xX]\\] +/, listTaskCheckbox: /\\[[ xX]\\]/, anyLine: /\\n.*\\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\\||\\| *$/g, tableRowBlankLine: /\\n[ \\t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\\s|>)/i, endPreScriptTag: /^<\\/(pre|code|kbd|script)(\\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\\s])\\s+(['"])(.*)\\2/, unicodeAlphaNumeric: /[\\p{L}\\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\\w+);)/g, caret: /(^|[^\\[])\\^/g, percentDecode: /%25/g, findPipe: /\\|/g, splitPipe: / \\|/, slashPipe: /\\\\\\|/g, carriageReturn: /\\r\\n|\\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\\S*/, endingNewline: /\\n$/, listItemRegex: (s) => new RegExp(\`^( {0,3}\${s})((?:[	 ][^\\\\n]*)?(?:\\\\n|$))\`), nextBulletRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}(?:[*+-]|\\\\d{1,9}[.)])((?:[ 	][^\\\\n]*)?(?:\\\\n|$))\`), hrRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\\\* *){3,})(?:\\\\n+|$)\`), fencesBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}(?:\\\`\\\`\\\`|~~~)\`), headingBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}#\`), htmlBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}<(?:[a-z].*>|!--)\`, "i"), blockquoteBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}>\`) }, Ee = /^(?:[ \\t]*(?:\\n|$))+/, Le = /^((?: {4}| {0,3}\\t)[^\\n]+(?:\\n(?:[ \\t]*(?:\\n|$))*)?)+/, Ce = /^ {0,3}(\`{3,}(?=[^\`\\n]*(?:\\n|$))|~{3,})([^\\n]*)(?:\\n|$)(?:|([\\s\\S]*?)(?:\\n|$))(?: {0,3}\\1[~\`]* *(?=\\n|$)|$)/, q = /^ {0,3}((?:-[\\t ]*){3,}|(?:_[ \\t]*){3,}|(?:\\*[ \\t]*){3,})(?:\\n+|$)/, Ie = /^ {0,3}(#{1,6})(?=\\s|$)(.*)(?:\\n+|$)/, K = / {0,3}(?:[*+-]|\\d{1,9}[.)])/, ge = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\\n(?!\\s*?\\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/, fe = f(ge).replace(/bull/g, K).replace(/blockCode/g, /(?: {4}| {0,3}\\t)/).replace(/fences/g, / {0,3}(?:\`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\\n>]+>\\n/).replace(/\\|table/g, "").getRegex(), Me = f(ge).replace(/bull/g, K).replace(/blockCode/g, /(?: {4}| {0,3}\\t)/).replace(/fences/g, / {0,3}(?:\`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\\n>]+>\\n/).replace(/table/g, / {0,3}\\|?(?:[:\\- ]*\\|)+[\\:\\- ]*\\n/).getRegex(), U = /^([^\\n]+(?:\\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\\n)[^\\n]+)*)/, Be = /^[^\\n]+/, J = /(?!\\s*\\])(?:\\\\[\\s\\S]|[^\\[\\]\\\\])+/, qe = f(/^ {0,3}\\[(label)\\]: *(?:\\n[ \\t]*)?([^<\\s][^\\s]*|<.*?>)(?:(?: +(?:\\n[ \\t]*)?| *\\n[ \\t]*)(title))? *(?:\\n+|$)/).replace("label", J).replace("title", /(?:"(?:\\\\"?|[^"\\\\])*"|'[^'\\n]*(?:\\n[^'\\n]+)*\\n?'|\\([^()]*\\))/).getRegex(), De = f(/^(bull)([ \\t][^\\n]+?)?(?:\\n|$)/).replace(/bull/g, K).getRegex(), N = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", V = /<!--(?:-?>|[\\s\\S]*?(?:-->|$))/, Ze = f("^ {0,3}(?:<(script|pre|style|textarea)[\\\\s>][\\\\s\\\\S]*?(?:</\\\\1>[^\\\\n]*\\\\n+|$)|comment[^\\\\n]*(\\\\n+|$)|<\\\\?[\\\\s\\\\S]*?(?:\\\\?>\\\\n*|$)|<![A-Z][\\\\s\\\\S]*?(?:>\\\\n*|$)|<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?(?:\\\\]\\\\]>\\\\n*|$)|</?(tag)(?: +|\\\\n|/?>)[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$)|<(?!script|pre|style|textarea)([a-z][\\\\w-]*)(?:attribute)*? */?>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$)|</(?!script|pre|style|textarea)[a-z][\\\\w-]*\\\\s*>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$))", "i").replace("comment", V).replace("tag", N).replace("attribute", / +[a-zA-Z:_][\\w.:-]*(?: *= *"[^"\\n]*"| *= *'[^'\\n]*'| *= *[^\\s"'=<>\`]+)?/).getRegex(), ke = f(U).replace("hr", q).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", N).getRegex(), je = f(/^( {0,3}> ?(paragraph|[^\\n]*)(?:\\n|$))+/).replace("paragraph", ke).getRegex(), Y = { blockquote: je, code: Le, def: qe, fences: Ce, heading: Ie, hr: q, html: Ze, lheading: fe, list: De, newline: Ee, paragraph: ke, table: z, text: Be }, se = f("^ *([^\\\\n ].*)\\\\n {0,3}((?:\\\\| *)?:?-+:? *(?:\\\\| *:?-+:? *)*(?:\\\\| *)?)(?:\\\\n((?:(?! *\\\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\\\n|$))*)\\\\n*|$)").replace("hr", q).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\\\n]").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", N).getRegex(), He = { ...Y, lheading: Me, table: se, paragraph: f(U).replace("hr", q).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("|lheading", "").replace("table", se).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", N).getRegex() }, Ne = { ...Y, html: f(\`^ *(?:comment *(?:\\\\n|\\\\s*$)|<(tag)[\\\\s\\\\S]+?</\\\\1> *(?:\\\\n{2,}|\\\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\\\s[^'"/>\\\\s]*)*?/?> *(?:\\\\n{2,}|\\\\s*$))\`).replace("comment", V).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\\\b)\\\\w+(?!:|[^\\\\w\\\\s@]*@)\\\\b").getRegex(), def: /^ *\\[([^\\]]+)\\]: *<?([^\\s>]+)>?(?: +(["(][^\\n]+[")]))? *(?:\\n+|$)/, heading: /^(#{1,6})(.*)(?:\\n+|$)/, fences: z, lheading: /^(.+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/, paragraph: f(U).replace("hr", q).replace("heading", \` *#{1,6} *[^
]\`).replace("lheading", fe).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Oe = /^\\\\([!"#$%&'()*+,\\-./:;<=>?@\\[\\]\\\\^_\`{|}~])/, Qe = /^(\`+)([^\`]|[^\`][\\s\\S]*?[^\`])\\1(?!\`)/, de = /^( {2,}|\\\\)\\n(?!\\s*$)/, Ge = /^(\`+|[^\`])(?:(?= {2,}\\n)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*_]|\\b_|$)|[^ ](?= {2,}\\n)))/, O = /[\\p{P}\\p{S}]/u, ee = /[\\s\\p{P}\\p{S}]/u, xe = /[^\\s\\p{P}\\p{S}]/u, We = f(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, ee).getRegex(), be = /(?!~)[\\p{P}\\p{S}]/u, Fe = /(?!~)[\\s\\p{P}\\p{S}]/u, Xe = /(?:[^\\s\\p{P}\\p{S}]|~)/u, me = /(?![*_])[\\p{P}\\p{S}]/u, Ke = /(?![*_])[\\s\\p{P}\\p{S}]/u, Ue = /(?:[^\\s\\p{P}\\p{S}]|[*_])/u, Je = f(/link|precode-code|html/, "g").replace("link", /\\[(?:[^\\[\\]\`]|(?<a>\`+)[^\`]+\\k<a>(?!\`))*?\\]\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)]|\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)])*\\))*\\)/).replace("precode-", Pe ? "(?<!\`)()" : "(^^|[^\`])").replace("code", /(?<b>\`+)[^\`]+\\k<b>(?!\`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), we = /^(?:\\*+(?:((?!\\*)punct)|[^\\s*]))|^_+(?:((?!_)punct)|([^\\s_]))/, Ve = f(we, "u").replace(/punct/g, O).getRegex(), Ye = f(we, "u").replace(/punct/g, be).getRegex(), ye = "^[^_*]*?__[^_*]*?\\\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\\\*)punct(\\\\*+)(?=[\\\\s]|$)|notPunctSpace(\\\\*+)(?!\\\\*)(?=punctSpace|$)|(?!\\\\*)punctSpace(\\\\*+)(?=notPunctSpace)|[\\\\s](\\\\*+)(?!\\\\*)(?=punct)|(?!\\\\*)punct(\\\\*+)(?!\\\\*)(?=punct)|notPunctSpace(\\\\*+)(?=notPunctSpace)", et = f(ye, "gu").replace(/notPunctSpace/g, xe).replace(/punctSpace/g, ee).replace(/punct/g, O).getRegex(), tt = f(ye, "gu").replace(/notPunctSpace/g, Xe).replace(/punctSpace/g, Fe).replace(/punct/g, be).getRegex(), rt = f("^[^_*]*?\\\\*\\\\*[^_*]*?_[^_*]*?(?=\\\\*\\\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, xe).replace(/punctSpace/g, ee).replace(/punct/g, O).getRegex(), st = f(/^~~?(?:((?!~)punct)|[^\\s~])/, "u").replace(/punct/g, me).getRegex(), nt = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", it = f(nt, "gu").replace(/notPunctSpace/g, Ue).replace(/punctSpace/g, Ke).replace(/punct/g, me).getRegex(), lt = f(/\\\\(punct)/, "gu").replace(/punct/g, O).getRegex(), at = f(/^<(scheme:[^\\s\\x00-\\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), ot = f(V).replace("(?:-->|$)", "-->").getRegex(), ct = f("^comment|^</[a-zA-Z][\\\\w:-]*\\\\s*>|^<[a-zA-Z][\\\\w-]*(?:attribute)*?\\\\s*/?>|^<\\\\?[\\\\s\\\\S]*?\\\\?>|^<![a-zA-Z]+\\\\s[\\\\s\\\\S]*?>|^<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?\\\\]\\\\]>").replace("comment", ot).replace("attribute", /\\s+[a-zA-Z:_][\\w.:-]*(?:\\s*=\\s*"[^"]*"|\\s*=\\s*'[^']*'|\\s*=\\s*[^\\s"'=<>\`]+)?/).getRegex(), j = /(?:\\[(?:\\\\[\\s\\S]|[^\\[\\]\\\\])*\\]|\\\\[\\s\\S]|\`+[^\`]*?\`+(?!\`)|[^\\[\\]\\\\\`])*?/, ht = f(/^!?\\[(label)\\]\\(\\s*(href)(?:(?:[ \\t]+(?:\\n[ \\t]*)?|\\n[ \\t]*)(title))?\\s*\\)/).replace("label", j).replace("href", /<(?:\\\\.|[^\\n<>\\\\])+>|[^ \\t\\n\\x00-\\x1f]*/).replace("title", /"(?:\\\\"?|[^"\\\\])*"|'(?:\\\\'?|[^'\\\\])*'|\\((?:\\\\\\)?|[^)\\\\])*\\)/).getRegex(), Se = f(/^!?\\[(label)\\]\\[(ref)\\]/).replace("label", j).replace("ref", J).getRegex(), $e = f(/^!?\\[(ref)\\](?:\\[\\])?/).replace("ref", J).getRegex(), pt = f("reflink|nolink(?!\\\\()", "g").replace("reflink", Se).replace("nolink", $e).getRegex(), ne = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, te = { _backpedal: z, anyPunctuation: lt, autolink: at, blockSkip: Je, br: de, code: Qe, del: z, delLDelim: z, delRDelim: z, emStrongLDelim: Ve, emStrongRDelimAst: et, emStrongRDelimUnd: rt, escape: Oe, link: ht, nolink: $e, punctuation: We, reflink: Se, reflinkSearch: pt, tag: ct, text: Ge, url: z }, ut = { ...te, link: f(/^!?\\[(label)\\]\\((.*?)\\)/).replace("label", j).getRegex(), reflink: f(/^!?\\[(label)\\]\\s*\\[([^\\]]*)\\]/).replace("label", j).getRegex() }, W = { ...te, emStrongRDelimAst: tt, emStrongLDelim: Ye, delLDelim: st, delRDelim: it, url: f(/^((?:protocol):\\/\\/|www\\.)(?:[a-zA-Z0-9\\-]+\\.?)+[^\\s<]*|^email/).replace("protocol", ne).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\\([^)]*\\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\\s~])((?:\\\\[\\s\\S]|[^\\\\])*?(?:\\\\[\\s\\S]|[^\\s~\\\\]))\\1(?=[^~]|$)/, text: f(/^([\`~]+|[^\`~])(?:(?= {2,}\\n)|(?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*~_]|\\b_|protocol:\\/\\/|www\\.|$)|[^ ](?= {2,}\\n)|[^a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-](?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@)))/).replace("protocol", ne).getRegex() }, gt = { ...W, br: f(de).replace("{2,}", "*").getRegex(), text: f(W.text).replace("\\\\b_", "\\\\b_| {2,}\\\\n").replace(/\\{2,\\}/g, "*").getRegex() }, D = { normal: Y, gfm: He, pedantic: Ne }, C = { normal: te, gfm: W, breaks: gt, pedantic: ut }, ft = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, ie = (s) => ft[s];
function S(s, e) {
  if (e) {
    if (m.escapeTest.test(s)) return s.replace(m.escapeReplace, ie);
  } else if (m.escapeTestNoEncode.test(s)) return s.replace(m.escapeReplaceNoEncode, ie);
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
function ae(s, e) {
  let r = s.replace(m.findPipe, (l, i, o) => {
    let a = !1, h = i;
    for (; --h >= 0 && o[h] === "\\\\"; ) a = !a;
    return a ? "|" : " |";
  }), n = r.split(m.splitPipe), t = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e) if (n.length > e) n.splice(e);
  else for (; n.length < e; ) n.push("");
  for (; t < n.length; t++) n[t] = n[t].trim().replace(m.slashPipe, "|");
  return n;
}
function I(s, e, r) {
  let n = s.length;
  if (n === 0) return "";
  let t = 0;
  for (; t < n && s.charAt(n - t - 1) === e; )
    t++;
  return s.slice(0, n - t);
}
function kt(s, e) {
  if (s.indexOf(e[1]) === -1) return -1;
  let r = 0;
  for (let n = 0; n < s.length; n++) if (s[n] === "\\\\") n++;
  else if (s[n] === e[0]) r++;
  else if (s[n] === e[1] && (r--, r < 0)) return n;
  return r > 0 ? -2 : -1;
}
function dt(s, e = 0) {
  let r = e, n = "";
  for (let t of s) if (t === "	") {
    let l = 4 - r % 4;
    n += " ".repeat(l), r += l;
  } else n += t, r++;
  return n;
}
function oe(s, e, r, n, t) {
  let l = e.href, i = e.title || null, o = s[1].replace(t.other.outputLinkReplace, "$1");
  n.state.inLink = !0;
  let a = { type: s[0].charAt(0) === "!" ? "image" : "link", raw: r, href: l, title: i, text: o, tokens: n.inlineTokens(o) };
  return n.state.inLink = !1, a;
}
function xt(s, e, r) {
  let n = s.match(r.other.indentCodeCompensation);
  if (n === null) return e;
  let t = n[1];
  return e.split(\`
\`).map((l) => {
    let i = l.match(r.other.beginningSpace);
    if (i === null) return l;
    let [o] = i;
    return o.length >= t.length ? l.slice(t.length) : l;
  }).join(\`
\`);
}
var M = class {
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
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? r : I(r, \`
\`) };
    }
  }
  fences(s) {
    let e = this.rules.block.fences.exec(s);
    if (e) {
      let r = e[0], n = xt(r, e[3] || "", this.rules);
      return { type: "code", raw: r, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: n };
    }
  }
  heading(s) {
    let e = this.rules.block.heading.exec(s);
    if (e) {
      let r = e[2].trim();
      if (this.rules.other.endingHash.test(r)) {
        let n = I(r, "#");
        (this.options.pedantic || !n || this.rules.other.endingSpaceChar.test(n)) && (r = n.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: r, tokens: this.lexer.inline(r) };
    }
  }
  hr(s) {
    let e = this.rules.block.hr.exec(s);
    if (e) return { type: "hr", raw: I(e[0], \`
\`) };
  }
  blockquote(s) {
    let e = this.rules.block.blockquote.exec(s);
    if (e) {
      let r = I(e[0], \`
\`).split(\`
\`), n = "", t = "", l = [];
      for (; r.length > 0; ) {
        let i = !1, o = [], a;
        for (a = 0; a < r.length; a++) if (this.rules.other.blockquoteStart.test(r[a])) o.push(r[a]), i = !0;
        else if (!i) o.push(r[a]);
        else break;
        r = r.slice(a);
        let h = o.join(\`
\`), c = h.replace(this.rules.other.blockquoteSetextReplace, \`
    $1\`).replace(this.rules.other.blockquoteSetextReplace2, "");
        n = n ? \`\${n}
\${h}\` : h, t = t ? \`\${t}
\${c}\` : c;
        let p = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(c, l, !0), this.lexer.state.top = p, r.length === 0) break;
        let u = l.at(-1);
        if (u?.type === "code") break;
        if (u?.type === "blockquote") {
          let d = u, g = d.raw + \`
\` + r.join(\`
\`), x = this.blockquote(g);
          l[l.length - 1] = x, n = n.substring(0, n.length - d.raw.length) + x.raw, t = t.substring(0, t.length - d.text.length) + x.text;
          break;
        } else if (u?.type === "list") {
          let d = u, g = d.raw + \`
\` + r.join(\`
\`), x = this.list(g);
          l[l.length - 1] = x, n = n.substring(0, n.length - u.raw.length) + x.raw, t = t.substring(0, t.length - d.raw.length) + x.raw, r = g.substring(l.at(-1).raw.length).split(\`
\`);
          continue;
        }
      }
      return { type: "blockquote", raw: n, tokens: l, text: t };
    }
  }
  list(s) {
    let e = this.rules.block.list.exec(s);
    if (e) {
      let r = e[1].trim(), n = r.length > 1, t = { type: "list", raw: "", ordered: n, start: n ? +r.slice(0, -1) : "", loose: !1, items: [] };
      r = n ? \`\\\\d{1,9}\\\\\${r.slice(-1)}\` : \`\\\\\${r}\`, this.options.pedantic && (r = n ? r : "[*+-]");
      let l = this.rules.other.listItemRegex(r), i = !1;
      for (; s; ) {
        let a = !1, h = "", c = "";
        if (!(e = l.exec(s)) || this.rules.block.hr.test(s)) break;
        h = e[0], s = s.substring(h.length);
        let p = dt(e[2].split(\`
\`, 1)[0], e[1].length), u = s.split(\`
\`, 1)[0], d = !p.trim(), g = 0;
        if (this.options.pedantic ? (g = 2, c = p.trimStart()) : d ? g = e[1].length + 1 : (g = p.search(this.rules.other.nonSpaceChar), g = g > 4 ? 1 : g, c = p.slice(g), g += e[1].length), d && this.rules.other.blankLine.test(u) && (h += u + \`
\`, s = s.substring(u.length + 1), a = !0), !a) {
          let x = this.rules.other.nextBulletRegex(g), A = this.rules.other.hrRegex(g), E = this.rules.other.fencesBeginRegex(g), R = this.rules.other.headingBeginRegex(g), re = this.rules.other.htmlBeginRegex(g), L = this.rules.other.blockquoteBeginRegex(g);
          for (; s; ) {
            let v = s.split(\`
\`, 1)[0], _;
            if (u = v, this.options.pedantic ? (u = u.replace(this.rules.other.listReplaceNesting, "  "), _ = u) : _ = u.replace(this.rules.other.tabCharGlobal, "    "), E.test(u) || R.test(u) || re.test(u) || L.test(u) || x.test(u) || A.test(u)) break;
            if (_.search(this.rules.other.nonSpaceChar) >= g || !u.trim()) c += \`
\` + _.slice(g);
            else {
              if (d || p.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || E.test(p) || R.test(p) || A.test(p)) break;
              c += \`
\` + u;
            }
            d = !u.trim(), h += v + \`
\`, s = s.substring(v.length + 1), p = _.slice(g);
          }
        }
        t.loose || (i ? t.loose = !0 : this.rules.other.doubleBlankLine.test(h) && (i = !0)), t.items.push({ type: "list_item", raw: h, task: !!this.options.gfm && this.rules.other.listIsTask.test(c), loose: !1, text: c, tokens: [] }), t.raw += h;
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
          let h = a.tokens.filter((p) => p.type === "space"), c = h.length > 0 && h.some((p) => this.rules.other.anyLine.test(p.raw));
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
    let r = ae(e[1]), n = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), t = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(\`
\`) : [], l = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (r.length === n.length) {
      for (let i of n) this.rules.other.tableAlignRight.test(i) ? l.align.push("right") : this.rules.other.tableAlignCenter.test(i) ? l.align.push("center") : this.rules.other.tableAlignLeft.test(i) ? l.align.push("left") : l.align.push(null);
      for (let i = 0; i < r.length; i++) l.header.push({ text: r[i], tokens: this.lexer.inline(r[i]), header: !0, align: l.align[i] });
      for (let i of t) l.rows.push(ae(i, l.header.length).map((o, a) => ({ text: o, tokens: this.lexer.inline(o), header: !1, align: l.align[a] })));
      return l;
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
        let l = I(r.slice(0, -1), "\\\\");
        if ((r.length - l.length) % 2 === 0) return;
      } else {
        let l = kt(e[2], "()");
        if (l === -2) return;
        if (l > -1) {
          let i = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + l;
          e[2] = e[2].substring(0, l), e[0] = e[0].substring(0, i).trim(), e[3] = "";
        }
      }
      let n = e[2], t = "";
      if (this.options.pedantic) {
        let l = this.rules.other.pedanticHrefTitle.exec(n);
        l && (n = l[1], t = l[3]);
      } else t = e[3] ? e[3].slice(1, -1) : "";
      return n = n.trim(), this.rules.other.startAngleBracket.test(n) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? n = n.slice(1) : n = n.slice(1, -1)), oe(e, { href: n && n.replace(this.rules.inline.anyPunctuation, "$1"), title: t && t.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(s, e) {
    let r;
    if ((r = this.rules.inline.reflink.exec(s)) || (r = this.rules.inline.nolink.exec(s))) {
      let n = (r[2] || r[1]).replace(this.rules.other.multipleSpaceGlobal, " "), t = e[n.toLowerCase()];
      if (!t) {
        let l = r[0].charAt(0);
        return { type: "text", raw: l, text: l };
      }
      return oe(r, t, r[0], this.lexer, this.rules);
    }
  }
  emStrong(s, e, r = "") {
    let n = this.rules.inline.emStrongLDelim.exec(s);
    if (!(!n || n[3] && r.match(this.rules.other.unicodeAlphaNumeric)) && (!(n[1] || n[2]) || !r || this.rules.inline.punctuation.exec(r))) {
      let t = [...n[0]].length - 1, l, i, o = t, a = 0, h = n[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (h.lastIndex = 0, e = e.slice(-1 * s.length + t); (n = h.exec(e)) != null; ) {
        if (l = n[1] || n[2] || n[3] || n[4] || n[5] || n[6], !l) continue;
        if (i = [...l].length, n[3] || n[4]) {
          o += i;
          continue;
        } else if ((n[5] || n[6]) && t % 3 && !((t + i) % 3)) {
          a += i;
          continue;
        }
        if (o -= i, o > 0) continue;
        i = Math.min(i, i + o + a);
        let c = [...n[0]][0].length, p = s.slice(0, t + n.index + c + i);
        if (Math.min(t, i) % 2) {
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
      let t = [...n[0]].length - 1, l, i, o = t, a = this.rules.inline.delRDelim;
      for (a.lastIndex = 0, e = e.slice(-1 * s.length + t); (n = a.exec(e)) != null; ) {
        if (l = n[1] || n[2] || n[3] || n[4] || n[5] || n[6], !l || (i = [...l].length, i !== t)) continue;
        if (n[3] || n[4]) {
          o += i;
          continue;
        }
        if (o -= i, o > 0) continue;
        i = Math.min(i, i + o);
        let h = [...n[0]][0].length, c = s.slice(0, t + n.index + h + i), p = c.slice(t, -t);
        return { type: "del", raw: c, text: p, tokens: this.lexer.inlineTokens(p) };
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
}, w = class F {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || $, this.options.tokenizer = this.options.tokenizer || new M(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let r = { other: m, block: D.normal, inline: C.normal };
    this.options.pedantic ? (r.block = D.pedantic, r.inline = C.pedantic) : this.options.gfm && (r.block = D.gfm, this.options.breaks ? r.inline = C.breaks : r.inline = C.gfm), this.tokenizer.rules = r;
  }
  static get rules() {
    return { block: D, inline: C };
  }
  static lex(e, r) {
    return new F(r).lex(e);
  }
  static lexInline(e, r) {
    return new F(r).inlineTokens(e);
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
      if (this.options.extensions?.block?.some((i) => (t = i.call({ lexer: this }, e, r)) ? (e = e.substring(t.raw.length), r.push(t), !0) : !1)) continue;
      if (t = this.tokenizer.space(e)) {
        e = e.substring(t.raw.length);
        let i = r.at(-1);
        t.raw.length === 1 && i !== void 0 ? i.raw += \`
\` : r.push(t);
        continue;
      }
      if (t = this.tokenizer.code(e)) {
        e = e.substring(t.raw.length);
        let i = r.at(-1);
        i?.type === "paragraph" || i?.type === "text" ? (i.raw += (i.raw.endsWith(\`
\`) ? "" : \`
\`) + t.raw, i.text += \`
\` + t.text, this.inlineQueue.at(-1).src = i.text) : r.push(t);
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
        let i = r.at(-1);
        i?.type === "paragraph" || i?.type === "text" ? (i.raw += (i.raw.endsWith(\`
\`) ? "" : \`
\`) + t.raw, i.text += \`
\` + t.raw, this.inlineQueue.at(-1).src = i.text) : this.tokens.links[t.tag] || (this.tokens.links[t.tag] = { href: t.href, title: t.title }, r.push(t));
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
      let l = e;
      if (this.options.extensions?.startBlock) {
        let i = 1 / 0, o = e.slice(1), a;
        this.options.extensions.startBlock.forEach((h) => {
          a = h.call({ lexer: this }, o), typeof a == "number" && a >= 0 && (i = Math.min(i, a));
        }), i < 1 / 0 && i >= 0 && (l = e.substring(0, i + 1));
      }
      if (this.state.top && (t = this.tokenizer.paragraph(l))) {
        let i = r.at(-1);
        n && i?.type === "paragraph" ? (i.raw += (i.raw.endsWith(\`
\`) ? "" : \`
\`) + t.raw, i.text += \`
\` + t.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = i.text) : r.push(t), n = l.length !== e.length, e = e.substring(t.raw.length);
        continue;
      }
      if (t = this.tokenizer.text(e)) {
        e = e.substring(t.raw.length);
        let i = r.at(-1);
        i?.type === "text" ? (i.raw += (i.raw.endsWith(\`
\`) ? "" : \`
\`) + t.raw, i.text += \`
\` + t.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = i.text) : r.push(t);
        continue;
      }
      if (e) {
        let i = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(i);
          break;
        } else throw new Error(i);
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
    let l;
    for (; (t = this.tokenizer.rules.inline.blockSkip.exec(n)) != null; ) l = t[2] ? t[2].length : 0, n = n.slice(0, t.index + l) + "[" + "a".repeat(t[0].length - l - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
    let i = !1, o = "";
    for (; e; ) {
      i || (o = ""), i = !1;
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
      if (a = this.tokenizer.emStrong(e, n, o)) {
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
      if (a = this.tokenizer.del(e, n, o)) {
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
        let c = 1 / 0, p = e.slice(1), u;
        this.options.extensions.startInline.forEach((d) => {
          u = d.call({ lexer: this }, p), typeof u == "number" && u >= 0 && (c = Math.min(c, u));
        }), c < 1 / 0 && c >= 0 && (h = e.substring(0, c + 1));
      }
      if (a = this.tokenizer.inlineText(h)) {
        e = e.substring(a.raw.length), a.raw.slice(-1) !== "_" && (o = a.raw.slice(-1)), i = !0;
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
}, B = class {
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
    for (let i = 0; i < s.items.length; i++) {
      let o = s.items[i];
      n += this.listitem(o);
    }
    let t = e ? "ol" : "ul", l = e && r !== 1 ? ' start="' + r + '"' : "";
    return "<" + t + l + \`>
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
      let l = s.rows[t];
      r = "";
      for (let i = 0; i < l.length; i++) r += this.tablecell(l[i]);
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
    let l = '<a href="' + s + '"';
    return e && (l += ' title="' + S(e) + '"'), l += ">" + n + "</a>", l;
  }
  image({ href: s, title: e, text: r, tokens: n }) {
    n && (r = this.parser.parseInline(n, this.parser.textRenderer));
    let t = le(s);
    if (t === null) return S(r);
    s = t;
    let l = \`<img src="\${s}" alt="\${S(r)}"\`;
    return e && (l += \` title="\${S(e)}"\`), l += ">", l;
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
}, y = class X {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || $, this.options.renderer = this.options.renderer || new B(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Q();
  }
  static parse(e, r) {
    return new X(r).parse(e);
  }
  static parseInline(e, r) {
    return new X(r).parseInline(e);
  }
  parse(e) {
    let r = "";
    for (let n = 0; n < e.length; n++) {
      let t = e[n];
      if (this.options.extensions?.renderers?.[t.type]) {
        let i = t, o = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (o !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(i.type)) {
          r += o || "";
          continue;
        }
      }
      let l = t;
      switch (l.type) {
        case "space": {
          r += this.renderer.space(l);
          break;
        }
        case "hr": {
          r += this.renderer.hr(l);
          break;
        }
        case "heading": {
          r += this.renderer.heading(l);
          break;
        }
        case "code": {
          r += this.renderer.code(l);
          break;
        }
        case "table": {
          r += this.renderer.table(l);
          break;
        }
        case "blockquote": {
          r += this.renderer.blockquote(l);
          break;
        }
        case "list": {
          r += this.renderer.list(l);
          break;
        }
        case "checkbox": {
          r += this.renderer.checkbox(l);
          break;
        }
        case "html": {
          r += this.renderer.html(l);
          break;
        }
        case "def": {
          r += this.renderer.def(l);
          break;
        }
        case "paragraph": {
          r += this.renderer.paragraph(l);
          break;
        }
        case "text": {
          r += this.renderer.text(l);
          break;
        }
        default: {
          let i = 'Token with "' + l.type + '" type was not found.';
          if (this.options.silent) return console.error(i), "";
          throw new Error(i);
        }
      }
    }
    return r;
  }
  parseInline(e, r = this.renderer) {
    let n = "";
    for (let t = 0; t < e.length; t++) {
      let l = e[t];
      if (this.options.extensions?.renderers?.[l.type]) {
        let o = this.options.extensions.renderers[l.type].call({ parser: this }, l);
        if (o !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(l.type)) {
          n += o || "";
          continue;
        }
      }
      let i = l;
      switch (i.type) {
        case "escape": {
          n += r.text(i);
          break;
        }
        case "html": {
          n += r.html(i);
          break;
        }
        case "link": {
          n += r.link(i);
          break;
        }
        case "image": {
          n += r.image(i);
          break;
        }
        case "checkbox": {
          n += r.checkbox(i);
          break;
        }
        case "strong": {
          n += r.strong(i);
          break;
        }
        case "em": {
          n += r.em(i);
          break;
        }
        case "codespan": {
          n += r.codespan(i);
          break;
        }
        case "br": {
          n += r.br(i);
          break;
        }
        case "del": {
          n += r.del(i);
          break;
        }
        case "text": {
          n += r.text(i);
          break;
        }
        default: {
          let o = 'Token with "' + i.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return n;
  }
}, P = class {
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
}, Re = class {
  defaults = H();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = y;
  Renderer = B;
  TextRenderer = Q;
  Lexer = w;
  Tokenizer = M;
  Hooks = P;
  constructor(...s) {
    this.use(...s);
  }
  walkTokens(s, e) {
    let r = [];
    for (let n of s) switch (r = r.concat(e.call(this, n)), n.type) {
      case "table": {
        let t = n;
        for (let l of t.header) r = r.concat(this.walkTokens(l.tokens, e));
        for (let l of t.rows) for (let i of l) r = r.concat(this.walkTokens(i.tokens, e));
        break;
      }
      case "list": {
        let t = n;
        r = r.concat(this.walkTokens(t.items, e));
        break;
      }
      default: {
        let t = n;
        this.defaults.extensions?.childTokens?.[t.type] ? this.defaults.extensions.childTokens[t.type].forEach((l) => {
          let i = t[l].flat(1 / 0);
          r = r.concat(this.walkTokens(i, e));
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
          let l = e.renderers[t.name];
          l ? e.renderers[t.name] = function(...i) {
            let o = t.renderer.apply(this, i);
            return o === !1 && (o = l.apply(this, i)), o;
          } : e.renderers[t.name] = t.renderer;
        }
        if ("tokenizer" in t) {
          if (!t.level || t.level !== "block" && t.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let l = e[t.level];
          l ? l.unshift(t.tokenizer) : e[t.level] = [t.tokenizer], t.start && (t.level === "block" ? e.startBlock ? e.startBlock.push(t.start) : e.startBlock = [t.start] : t.level === "inline" && (e.startInline ? e.startInline.push(t.start) : e.startInline = [t.start]));
        }
        "childTokens" in t && t.childTokens && (e.childTokens[t.name] = t.childTokens);
      }), n.extensions = e), r.renderer) {
        let t = this.defaults.renderer || new B(this.defaults);
        for (let l in r.renderer) {
          if (!(l in t)) throw new Error(\`renderer '\${l}' does not exist\`);
          if (["options", "parser"].includes(l)) continue;
          let i = l, o = r.renderer[i], a = t[i];
          t[i] = (...h) => {
            let c = o.apply(t, h);
            return c === !1 && (c = a.apply(t, h)), c || "";
          };
        }
        n.renderer = t;
      }
      if (r.tokenizer) {
        let t = this.defaults.tokenizer || new M(this.defaults);
        for (let l in r.tokenizer) {
          if (!(l in t)) throw new Error(\`tokenizer '\${l}' does not exist\`);
          if (["options", "rules", "lexer"].includes(l)) continue;
          let i = l, o = r.tokenizer[i], a = t[i];
          t[i] = (...h) => {
            let c = o.apply(t, h);
            return c === !1 && (c = a.apply(t, h)), c;
          };
        }
        n.tokenizer = t;
      }
      if (r.hooks) {
        let t = this.defaults.hooks || new P();
        for (let l in r.hooks) {
          if (!(l in t)) throw new Error(\`hook '\${l}' does not exist\`);
          if (["options", "block"].includes(l)) continue;
          let i = l, o = r.hooks[i], a = t[i];
          P.passThroughHooks.has(l) ? t[i] = (h) => {
            if (this.defaults.async && P.passThroughHooksRespectAsync.has(l)) return (async () => {
              let p = await o.call(t, h);
              return a.call(t, p);
            })();
            let c = o.call(t, h);
            return a.call(t, c);
          } : t[i] = (...h) => {
            if (this.defaults.async) return (async () => {
              let p = await o.apply(t, h);
              return p === !1 && (p = await a.apply(t, h)), p;
            })();
            let c = o.apply(t, h);
            return c === !1 && (c = a.apply(t, h)), c;
          };
        }
        n.hooks = t;
      }
      if (r.walkTokens) {
        let t = this.defaults.walkTokens, l = r.walkTokens;
        n.walkTokens = function(i) {
          let o = [];
          return o.push(l.call(this, i)), t && (o = o.concat(t.call(this, i))), o;
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
      let n = { ...r }, t = { ...this.defaults, ...n }, l = this.onError(!!t.silent, !!t.async);
      if (this.defaults.async === !0 && n.async === !1) return l(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return l(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return l(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (t.hooks && (t.hooks.options = t, t.hooks.block = s), t.async) return (async () => {
        let i = t.hooks ? await t.hooks.preprocess(e) : e, o = await (t.hooks ? await t.hooks.provideLexer() : s ? w.lex : w.lexInline)(i, t), a = t.hooks ? await t.hooks.processAllTokens(o) : o;
        t.walkTokens && await Promise.all(this.walkTokens(a, t.walkTokens));
        let h = await (t.hooks ? await t.hooks.provideParser() : s ? y.parse : y.parseInline)(a, t);
        return t.hooks ? await t.hooks.postprocess(h) : h;
      })().catch(l);
      try {
        t.hooks && (e = t.hooks.preprocess(e));
        let i = (t.hooks ? t.hooks.provideLexer() : s ? w.lex : w.lexInline)(e, t);
        t.hooks && (i = t.hooks.processAllTokens(i)), t.walkTokens && this.walkTokens(i, t.walkTokens);
        let o = (t.hooks ? t.hooks.provideParser() : s ? y.parse : y.parseInline)(i, t);
        return t.hooks && (o = t.hooks.postprocess(o)), o;
      } catch (i) {
        return l(i);
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
}, T = new Re();
function k(s, e) {
  return T.parse(s, e);
}
k.options = k.setOptions = function(s) {
  return T.setOptions(s), k.defaults = T.defaults, ue(k.defaults), k;
};
k.getDefaults = H;
k.defaults = $;
k.use = function(...s) {
  return T.use(...s), k.defaults = T.defaults, ue(k.defaults), k;
};
k.walkTokens = function(s, e) {
  return T.walkTokens(s, e);
};
k.parseInline = T.parseInline;
k.Parser = y;
k.parser = y.parse;
k.Renderer = B;
k.TextRenderer = Q;
k.Lexer = w;
k.lexer = w.lex;
k.Tokenizer = M;
k.Hooks = P;
k.parse = k;
var bt = k.options, mt = k.setOptions, wt = k.use, yt = k.walkTokens, St = k.parseInline, $t = k, Rt = y.parse, _t = w.lex, ce = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  Hooks: P,
  Lexer: w,
  Marked: Re,
  Parser: y,
  Renderer: B,
  TextRenderer: Q,
  Tokenizer: M,
  get defaults() {
    return $;
  },
  getDefaults: H,
  lexer: _t,
  marked: k,
  options: bt,
  parse: $t,
  parseInline: St,
  parser: Rt,
  setOptions: mt,
  use: wt,
  walkTokens: yt
});
function zt(s) {
  if (s.startsWith("---")) {
    const e = s.indexOf(\`
---\`, 3);
    if (e !== -1) {
      const r = s.slice(3, e + 0).trim(), n = s.slice(e + 4).trimStart(), t = {};
      return r.split(/\\r?\\n/).forEach((l) => {
        const i = l.match(/^([^:]+):\\s*(.*)$/);
        i && (t[i[1].trim()] = i[2].trim());
      }), { content: n, data: t };
    }
  }
  return { content: s, data: {} };
}
class Tt {
  /**
   * Create an LRU cache.
   * @param {{maxSize?:number,ttlMs?:number,onEvict?:function}} [opts]
   */
  constructor(e = {}) {
    const { maxSize: r = 0, ttlMs: n = 0, onEvict: t = null } = e || {};
    this._map = /* @__PURE__ */ new Map(), this._maxSize = Math.max(0, Number(r) || 0), this._ttlMs = Math.max(0, Number(n) || 0), this._onEvict = typeof t == "function" ? t : null;
  }
  get size() {
    return this._map.size;
  }
  /**
   * Check if key exists and is not expired.
   * @param {*} key
   * @returns {boolean}
   */
  has(e) {
    const r = this._map.get(e);
    return r ? this._ttlMs && Date.now() - (r.ts || 0) >= this._ttlMs ? (this._evictKey(e, r), !1) : (this._map.delete(e), this._map.set(e, r), !0) : !1;
  }
  /**
   * Get value for key or undefined if missing/expired.
   * @param {*} key
   */
  get(e) {
    const r = this._map.get(e);
    if (r) {
      if (this._ttlMs && Date.now() - (r.ts || 0) >= this._ttlMs) {
        this._evictKey(e, r);
        return;
      }
      return this._map.delete(e), this._map.set(e, r), r.value;
    }
  }
  /**
   * Set a key/value pair and enforce maxSize eviction.
   * @param {*} key
   * @param {*} value
   */
  set(e, r) {
    if (this._map.has(e) && this._map.delete(e), this._map.set(e, { value: r, ts: Date.now() }), this._maxSize && this._map.size > this._maxSize)
      for (; this._map.size > this._maxSize; ) {
        const n = this._map.keys().next().value, t = this._map.get(n);
        if (this._map.delete(n), this._onEvict)
          try {
            this._onEvict(n, t && t.value);
          } catch {
          }
      }
    return this;
  }
  /**
   * Delete key from cache.
   * @param {*} key
   * @returns {boolean}
   */
  delete(e) {
    return this._map.delete(e);
  }
  /**
   * Clear the cache and call eviction callback for each entry.
   */
  clear() {
    if (this._onEvict)
      for (const [e, r] of this._map.entries())
        try {
          this._onEvict(e, r && r.value);
        } catch {
        }
    this._map.clear();
  }
  _evictKey(e, r) {
    try {
      this._map.delete(e);
    } catch {
    }
    if (this._onEvict) try {
      this._onEvict(e, r && r.value);
    } catch {
    }
  }
}
const G = new Tt({ maxSize: 500 });
let At = 300 * 1e3;
async function _e(s, e) {
  try {
    if (!s) return null;
    const r = Date.now();
    let n = G.get(s);
    if (n && n.ok === !1 && r - (n.ts || 0) >= At && (G.delete(s), n = void 0), n) {
      if (n.module) return n.module;
      if (n.promise)
        try {
          return await n.promise;
        } catch {
          return null;
        }
    }
    const t = { promise: null, module: null, ok: null, ts: Date.now() };
    G.set(s, t), t.promise = (async () => {
      try {
        return await e();
      } catch {
        return null;
      }
    })();
    try {
      const l = await t.promise;
      return t.module = l, t.ok = !!l, t.ts = Date.now(), l;
    } catch {
      return t.module = null, t.ok = !1, t.ts = Date.now(), null;
    }
  } catch {
    return null;
  }
}
async function vt(s) {
  return await _e(s, async () => {
    try {
      return await import(s);
    } catch {
      return null;
    }
  });
}
function Pt(s) {
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
const Z = ce && (k || ce) || void 0, he = /\`\`\`\\s*([a-zA-Z0-9_\\-+]+)?/g, Et = /* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"]);
function Lt(s) {
  try {
    return String(s || "").toLowerCase().trim().replace(/[^a-z0-9\\-\\s]+/g, "").replace(/\\s+/g, "-");
  } catch {
    return "heading";
  }
}
let b = null;
const Ct = "https://cdn.jsdelivr.net/npm/highlight.js";
async function ze(s) {
  return await vt(s);
}
async function pe() {
  if (b) return b;
  try {
    const s = Ct + "/lib/core.js";
    try {
      const e = await import("https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js");
      if (e) {
        b = e.default || e;
        try {
          await _e(s, async () => e);
        } catch {
        }
      } else
        b = null;
    } catch {
      const r = await ze(s);
      r ? b = r.default || r : b = null;
    }
  } catch {
    b = null;
  }
  return b;
}
Z && typeof Z.setOptions == "function" && Z.setOptions({
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
      const { name: c, url: p } = e;
      try {
        if (!await pe()) {
          postMessage({ type: "register-error", name: c, error: "hljs unavailable" });
          return;
        }
        const d = await ze(p), g = d ? d.default || d : null;
        if (!g) throw new Error("failed to import language module");
        b.registerLanguage(c, g), postMessage({ type: "registered", name: c });
      } catch (u) {
        postMessage({ type: "register-error", name: c, error: String(u) });
      }
      return;
    }
    if (e.type === "detect") {
      const c = e.md || "", p = e.supported || [], u = /* @__PURE__ */ new Set(), d = new RegExp(he.source, he.flags);
      let g;
      for (; g = d.exec(c); )
        if (g[1]) {
          const x = String(g[1]).toLowerCase();
          if (!x) continue;
          if (x.length >= 5 && x.length <= 30 && /^[a-z][a-z0-9_\\-+]*$/.test(x) && u.add(x), Et.has(x) && u.add(x), p && p.length)
            try {
              p.indexOf(x) !== -1 && u.add(x);
            } catch {
            }
        }
      postMessage({ id: e.id, result: Array.from(u) });
      return;
    }
    const { id: r, md: n } = e, { content: t, data: l } = zt(n || "");
    await pe().catch(() => {
    });
    let i = Z.parse(t);
    const o = [], a = /* @__PURE__ */ new Map(), h = Lt;
    i = i.replace(/<h([1-6])([^>]*)>([\\s\\S]*?)<\\/h\\1>/g, (c, p, u, d) => {
      const g = Number(p);
      let x = d.replace(/<[^>]+>/g, "").trim();
      try {
        x = Pt(x);
      } catch {
      }
      let A = null;
      const E = (u || "").match(/\\sid="([^"]+)"/);
      E && (A = E[1]);
      const R = A || h(x) || "heading", L = (a.get(R) || 0) + 1;
      a.set(R, L);
      const v = L === 1 ? R : R + "-" + L;
      o.push({ level: g, text: x, id: v });
      const _ = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, Te = g <= 2 ? "has-text-weight-bold" : g <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", Ae = (_[g] + " " + Te).trim(), ve = ((u || "").replace(/\\s*(id|class)="[^"]*"/g, "") + \` id="\${v}" class="\${Ae}"\`).trim();
      return \`<h\${g} \${ve}>\${d}</h\${g}>\`;
    }), i = i.replace(/<img([^>]*)>/g, (c, p) => /\\bloading=/.test(p) ? \`<img\${p}>\` : /\\bdata-want-lazy=/.test(p) ? \`<img\${p}>\` : \`<img\${p} loading="lazy">\`), postMessage({ id: r, result: { html: i, meta: l || {}, toc: o } });
  } catch (r) {
    postMessage({ id: e.id, error: String(r) });
  }
};
`, Fi = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", Na], { type: "text/javascript;charset=utf-8" });
function _l(e) {
  let t;
  try {
    if (t = Fi && (self.URL || self.webkitURL).createObjectURL(Fi), !t) throw "";
    const n = new Worker(t, {
      type: "module",
      name: e?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(t);
    }), n;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(Na),
      {
        type: "module",
        name: e?.name
      }
    );
  }
}
function nr(e) {
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
function Ba(e) {
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
const _n = Hi && (Ae || Hi) || void 0, rr = /```\s*([a-zA-Z0-9_\-+]+)?/g, Oa = /* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"]);
function ja(e) {
  try {
    return String(e || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
  } catch {
    return "heading";
  }
}
let Ye = null;
const kl = "https://cdn.jsdelivr.net/npm/highlight.js";
async function si(e) {
  return await _s(e);
}
async function ir() {
  if (Ye) return Ye;
  try {
    const e = kl + "/lib/core.js";
    try {
      const t = await import("https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js");
      if (t) {
        Ye = t.default || t;
        try {
          await Gr(e, async () => t);
        } catch {
        }
      } else
        Ye = null;
    } catch {
      const n = await si(e);
      n ? Ye = n.default || n : Ye = null;
    }
  } catch {
    Ye = null;
  }
  return Ye;
}
_n && typeof _n.setOptions == "function" && _n.setOptions({
  gfm: !0,
  headerIds: !0,
  mangle: !1,
  highlighted: (e, t) => {
    try {
      return Ye && t && typeof Ye.getLanguage == "function" && Ye.getLanguage(t) ? Ye.highlight(e, { language: t }).value : Ye && typeof Ye.getLanguage == "function" && Ye.getLanguage("plaintext") ? Ye.highlight(e, { language: "plaintext" }).value : e;
    } catch {
      return e;
    }
  }
});
onmessage = async (e) => {
  const t = e.data || {};
  try {
    if (t.type === "register") {
      const { name: u, url: d } = t;
      try {
        if (!await ir()) {
          postMessage({ type: "register-error", name: u, error: "hljs unavailable" });
          return;
        }
        const f = await si(d), g = f ? f.default || f : null;
        if (!g) throw new Error("failed to import language module");
        Ye.registerLanguage(u, g), postMessage({ type: "registered", name: u });
      } catch (h) {
        postMessage({ type: "register-error", name: u, error: String(h) });
      }
      return;
    }
    if (t.type === "detect") {
      const u = t.md || "", d = t.supported || [], h = /* @__PURE__ */ new Set(), f = new RegExp(rr.source, rr.flags);
      let g;
      for (; g = f.exec(u); )
        if (g[1]) {
          const m = String(g[1]).toLowerCase();
          if (!m) continue;
          if (m.length >= 5 && m.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(m) && h.add(m), Oa.has(m) && h.add(m), d && d.length)
            try {
              d.indexOf(m) !== -1 && h.add(m);
            } catch {
            }
        }
      postMessage({ id: t.id, result: Array.from(h) });
      return;
    }
    const { id: n, md: i } = t, { content: r, data: a } = nr(i || "");
    await ir().catch(() => {
    });
    let s = _n.parse(r);
    const o = [], l = /* @__PURE__ */ new Map(), c = ja;
    s = s.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (u, d, h, f) => {
      const g = Number(d);
      let m = f.replace(/<[^>]+>/g, "").trim();
      try {
        m = Ba(m);
      } catch {
      }
      let p = null;
      const b = (h || "").match(/\sid="([^"]+)"/);
      b && (p = b[1]);
      const y = p || c(m) || "heading", w = (l.get(y) || 0) + 1;
      l.set(y, w);
      const A = w === 1 ? y : y + "-" + w;
      o.push({ level: g, text: m, id: A });
      const S = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, M = g <= 2 ? "has-text-weight-bold" : g <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", I = (S[g] + " " + M).trim(), Q = ((h || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${A}" class="${I}"`).trim();
      return `<h${g} ${Q}>${f}</h${g}>`;
    }), s = s.replace(/<img([^>]*)>/g, (u, d) => /\bloading=/.test(d) ? `<img${d}>` : /\bdata-want-lazy=/.test(d) ? `<img${d}>` : `<img${d} loading="lazy">`), postMessage({ id: n, result: { html: s, meta: a || {}, toc: o } });
  } catch (n) {
    postMessage({ id: t.id, error: String(n) });
  }
};
async function xl(e) {
  try {
    if (e && e.type === "register") {
      const { name: l, url: c } = e;
      try {
        if (!await ir()) return { type: "register-error", name: l, error: "hljs unavailable" };
        const d = await si(c), h = d ? d.default || d : null;
        return h ? (Ye.registerLanguage(l, h), { type: "registered", name: l }) : { type: "register-error", name: l, error: "failed to import language module" };
      } catch (u) {
        return { type: "register-error", name: l, error: String(u) };
      }
    }
    if (e && e.type === "detect") {
      const l = e.md || "", c = e.supported || [], u = /* @__PURE__ */ new Set(), d = new RegExp(rr.source, rr.flags);
      let h;
      for (; h = d.exec(l); )
        if (h[1]) {
          const f = String(h[1]).toLowerCase();
          if (!f) continue;
          if (f.length >= 5 && f.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(f) && u.add(f), Oa.has(f) && u.add(f), c && c.length)
            try {
              c.indexOf(f) !== -1 && u.add(f);
            } catch {
            }
        }
      return { id: e.id, result: Array.from(u) };
    }
    const t = e && e.id, { content: n, data: i } = nr(e && e.md || "");
    await ir().catch(() => {
    });
    let r = _n.parse(n);
    const a = [], s = /* @__PURE__ */ new Map(), o = ja;
    return r = r.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (l, c, u, d) => {
      const h = Number(c);
      let f = d.replace(/<[^>]+>/g, "").trim();
      try {
        f = Ba(f);
      } catch {
      }
      let g = null;
      const m = (u || "").match(/\sid="([^"]+)"/);
      m && (g = m[1]);
      const p = g || o(f) || "heading", y = (s.get(p) || 0) + 1;
      s.set(p, y);
      const _ = y === 1 ? p : p + "-" + y;
      a.push({ level: h, text: f, id: _ });
      const w = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, A = h <= 2 ? "has-text-weight-bold" : h <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", S = (w[h] + " " + A).trim(), I = ((u || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${_}" class="${S}"`).trim();
      return `<h${h} ${I}>${d}</h${h}>`;
    }), r = r.replace(/<img([^>]*)>/g, (l, c) => /\bloading=/.test(c) ? `<img${c}>` : /\bdata-want-lazy=/.test(c) ? `<img${c}>` : `<img${c} loading="lazy">`), { id: t, result: { html: r, meta: i || {}, toc: a } };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
const Ar = {
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
}, Sl = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2, qa = oa(() => {
  if (typeof Worker < "u")
    try {
      return new _l();
    } catch {
    }
  try {
    if (Zt) return Zt(wl);
  } catch {
  }
  const e = { message: [], error: [] };
  return {
    addEventListener(t, n) {
      e[t] || (e[t] = []), e[t].push(n);
    },
    removeEventListener(t, n) {
      if (!e[t]) return;
      const i = e[t].indexOf(n);
      i !== -1 && e[t].splice(i, 1);
    },
    postMessage(t) {
      setTimeout(async () => {
        try {
          const i = { data: await xl(t) };
          (e.message || []).forEach((r) => r(i));
        } catch (n) {
          const i = { data: { id: t && t.id, error: String(n) } };
          (e.message || []).forEach((r) => r(i));
        }
      }, 0);
    },
    terminate() {
      Object.keys(e).forEach((t) => e[t].length = 0);
    }
  };
}, "markdown", Sl), Wt = () => qa.get(), oi = (e, t = 3e3) => qa.send(e, t), vt = [];
function jr(e) {
  if (e && (typeof e == "object" || typeof e == "function")) {
    vt.push(e);
    try {
      Ae.use(e);
    } catch (t) {
      k("[markdown] failed to apply plugin", t);
    }
  }
}
function vl(e) {
  vt.length = 0, Array.isArray(e) && vt.push(...e.filter((t) => t && typeof t == "object"));
  try {
    vt.forEach((t) => Ae.use(t));
  } catch (t) {
    k("[markdown] failed to apply markdown extensions", t);
  }
}
async function zn(e) {
  if (vt && vt.length) {
    let { content: i, data: r } = nr(e || "");
    try {
      i = String(i || "").replace(/:([^:\s]+):/g, (s, o) => Ar[o] || s);
    } catch {
    }
    Ae.setOptions({ gfm: !0, mangle: !1, headerIds: !1, headerPrefix: "" });
    try {
      vt.forEach((s) => Ae.use(s));
    } catch (s) {
      k("[markdown] apply plugins failed", s);
    }
    const a = Ae.parse(i);
    try {
      const s = He();
      if (s) {
        const o = s.parseFromString(a, "text/html"), l = o.querySelectorAll("h1,h2,h3,h4,h5,h6"), c = [], u = /* @__PURE__ */ new Set(), d = (f) => {
          try {
            return String(f || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
          } catch {
            return "heading";
          }
        }, h = (f) => {
          const g = {
            1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
            2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
            3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
            4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
            5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
            6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
          }, m = f <= 2 ? "has-text-weight-bold" : f <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
          return (g[f] + " " + m).trim();
        };
        l.forEach((f) => {
          try {
            const g = Number(f.tagName.substring(1)), m = (f.textContent || "").trim();
            let p = d(m) || "heading", b = p, y = 2;
            for (; u.has(b); )
              b = p + "-" + y, y += 1;
            u.add(b), f.id = b, f.className = h(g), c.push({ level: g, text: m, id: b });
          } catch {
          }
        });
        try {
          (o && typeof o.getElementsByTagName == "function" ? Array.from(o.getElementsByTagName("img")) : o && typeof o.querySelectorAll == "function" ? Array.from(o.querySelectorAll("img")) : []).forEach((g) => {
            try {
              const m = g.getAttribute && g.getAttribute("loading"), p = g.getAttribute && g.getAttribute("data-want-lazy");
              !m && !p && g.setAttribute && g.setAttribute("loading", "lazy");
            } catch {
            }
          });
        } catch {
        }
        try {
          o.querySelectorAll("pre code, code[class]").forEach((f) => {
            try {
              const g = f.getAttribute && f.getAttribute("class") || f.className || "", m = String(g || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
              if (m)
                try {
                  f.setAttribute && f.setAttribute("class", m);
                } catch {
                  f.className = m;
                }
              else
                try {
                  f.removeAttribute && f.removeAttribute("class");
                } catch {
                  f.className = "";
                }
            } catch {
            }
          });
        } catch {
        }
        try {
          let f = null;
          try {
            typeof XMLSerializer < "u" ? f = new XMLSerializer().serializeToString(o.body).replace(/^<body[^>]*>/i, "").replace(/<\/body>$/i, "") : f = Array.from(o.body.childNodes || []).map((m) => m && typeof m.outerHTML == "string" ? m.outerHTML : m && typeof m.textContent == "string" ? m.textContent : "").join("");
          } catch {
            try {
              f = o.body.innerHTML;
            } catch {
              f = "";
            }
          }
          return { html: f, meta: r || {}, toc: c };
        } catch {
          return { html: "", meta: r || {}, toc: c };
        }
      }
    } catch {
    }
    return { html: a, meta: r || {}, toc: [] };
  }
  let t;
  if (typeof process < "u" && process.env && process.env.VITEST)
    try {
      const i = await Promise.resolve().then(() => Ha);
      t = i.initRendererWorker && i.initRendererWorker();
    } catch {
      t = Wt && Wt();
    }
  else
    t = Wt && Wt();
  try {
    e = String(e || "").replace(/:([^:\s]+):/g, (i, r) => Ar[r] || i);
  } catch {
  }
  try {
    if (typeof Re < "u" && Re && typeof Re.getLanguage == "function" && Re.getLanguage("plaintext") && /```\s*\n/.test(String(e || ""))) {
      let { content: i, data: r } = nr(e || "");
      try {
        i = String(i || "").replace(/:([^:\s]+):/g, (c, u) => Ar[u] || c);
      } catch {
      }
      Ae.setOptions({ gfm: !0, headerIds: !0, mangle: !1, highlighted: (c, u) => {
        try {
          return u && Re.getLanguage && Re.getLanguage(u) ? Re.highlight(c, { language: u }).value : Re && typeof Re.getLanguage == "function" && Re.getLanguage("plaintext") ? Re.highlight(c, { language: "plaintext" }).value : c;
        } catch {
          return c;
        }
      } });
      let a = Ae.parse(i);
      try {
        a = a.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (c, u) => {
          try {
            if (u && Re && typeof Re.highlight == "function")
              try {
                const d = Re.highlight(u, { language: "plaintext" });
                return `<pre><code>${d && d.value ? d.value : d}</code></pre>`;
              } catch {
                try {
                  if (Re && typeof Re.highlightElement == "function") {
                    const h = { innerHTML: u };
                    return Re.highlightElement(h), `<pre><code>${h.innerHTML}</code></pre>`;
                  }
                } catch {
                }
              }
          } catch {
          }
          return c;
        });
      } catch {
      }
      const s = [], o = /* @__PURE__ */ new Set(), l = (c) => {
        try {
          return String(c || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
        } catch {
          return "heading";
        }
      };
      return a = a.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (c, u, d, h) => {
        const f = Number(u), g = h.replace(/<[^>]+>/g, "").trim();
        let m = l(g) || "heading", p = m, b = 2;
        for (; o.has(p); )
          p = m + "-" + b, b += 1;
        o.add(p), s.push({ level: f, text: g, id: p });
        const y = {
          1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
          2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
          3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
          4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
          5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
          6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
        }, _ = f <= 2 ? "has-text-weight-bold" : f <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", w = (y[f] + " " + _).trim(), S = ((d || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${p}" class="${w}"`).trim();
        return `<h${f} ${S}>${h}</h${f}>`;
      }), a = a.replace(/<img([^>]*)>/g, (c, u) => /\bloading=/.test(u) ? `<img${u}>` : /\bdata-want-lazy=/.test(u) ? `<img${u}>` : `<img${u} loading="lazy">`), { html: a, meta: r || {}, toc: s };
    }
  } catch {
  }
  if (!t) throw new Error("renderer worker required but unavailable");
  const n = await oi({ type: "render", md: e });
  if (!n || typeof n != "object" || n.html === void 0) throw new Error("renderer worker returned invalid response");
  try {
    const i = /* @__PURE__ */ new Map(), r = [], a = (l) => {
      try {
        return String(l || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    }, s = (l) => {
      const c = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, u = l <= 2 ? "has-text-weight-bold" : l <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
      return (c[l] + " " + u).trim();
    };
    let o = n.html;
    o = o.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (l, c, u, d) => {
      const h = Number(c), f = d.replace(/<[^>]+>/g, "").trim(), g = (u || "").match(/\sid="([^"]+)"/), m = g ? g[1] : a(f) || "heading", b = (i.get(m) || 0) + 1;
      i.set(m, b);
      const y = b === 1 ? m : m + "-" + b;
      r.push({ level: h, text: f, id: y });
      const _ = s(h), A = ((u || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${y}" class="${_}"`).trim();
      return `<h${h} ${A}>${d}</h${h}>`;
    });
    try {
      const l = typeof document < "u" && document.documentElement && document.documentElement.getAttribute && document.documentElement.getAttribute("data-nimbi-logo-moved") || "";
      if (l) {
        const c = He();
        if (c) {
          const u = c.parseFromString(o, "text/html");
          (u && typeof u.getElementsByTagName == "function" ? Array.from(u.getElementsByTagName("img")) : u && typeof u.querySelectorAll == "function" ? Array.from(u.querySelectorAll("img")) : []).forEach((h) => {
            try {
              const f = h.getAttribute("src") || "";
              (f ? new URL(f, location.href).toString() : "") === l && h.remove();
            } catch {
            }
          });
          try {
            typeof XMLSerializer < "u" ? o = new XMLSerializer().serializeToString(u.body).replace(/^<body[^>]*>/i, "").replace(/<\/body>$/i, "") : o = Array.from(u.body.childNodes || []).map((f) => f && typeof f.outerHTML == "string" ? f.outerHTML : f && typeof f.textContent == "string" ? f.textContent : "").join("");
          } catch {
            try {
              o = u.body.innerHTML;
            } catch {
            }
          }
        } else
          try {
            const u = l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            o = o.replace(new RegExp(`<img[^>]*src=\\"${u}\\"[^>]*>`, "g"), "");
          } catch {
          }
      }
    } catch {
    }
    return { html: o, meta: n.meta || {}, toc: r };
  } catch {
    return { html: n.html, meta: n.meta || {}, toc: n.toc || [] };
  }
}
function kn(e, t) {
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
      const o = s[1].toLowerCase();
      if (ta.has(o) || t && t.size && o.length < 3 && !t.has(o) && !(ht && ht[o] && t.has(ht[o]))) continue;
      if (t && t.size) {
        if (t.has(o)) {
          const c = t.get(o);
          c && n.add(c);
          continue;
        }
        if (ht && ht[o]) {
          const c = ht[o];
          if (t.has(c)) {
            const u = t.get(c) || c;
            n.add(u);
            continue;
          }
        }
      }
      (a.has(o) || o.length >= 5 && o.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(o) && !r.has(o)) && n.add(o);
    }
  return n;
}
async function qr(e, t) {
  if (vt && vt.length || typeof process < "u" && process.env && process.env.VITEST) return kn(e || "", t);
  if (Wt && Wt())
    try {
      const i = t && t.size ? Array.from(t.keys()) : [], r = await oi({ type: "detect", md: String(e || ""), supported: i });
      if (Array.isArray(r)) return new Set(r);
    } catch (i) {
      k("[markdown] detectFenceLanguagesAsync worker failed", i);
    }
  return kn(e || "", t);
}
const Ha = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _sendToRenderer: oi,
  addMarkdownExtension: jr,
  detectFenceLanguages: kn,
  detectFenceLanguagesAsync: qr,
  initRendererWorker: Wt,
  markdownPlugins: vt,
  parseMarkdownToHtml: zn,
  setMarkdownExtensions: vl
}, Symbol.toStringTag, { value: "Module" }));
function Al(e, t = 150, n = {}) {
  let i = null;
  const r = !!n.leading;
  return function(...s) {
    const o = this;
    if (i && clearTimeout(i), r && !i)
      try {
        e.apply(o, s);
      } catch {
      }
    i = setTimeout(() => {
      if (i = null, !r)
        try {
          e.apply(o, s);
        } catch {
        }
    }, t);
  };
}
function El(e) {
  let t = !1;
  return function(...i) {
    const r = this;
    if (!t) {
      try {
        e.apply(r, i);
      } catch {
      }
      t = !0;
      const a = () => {
        t = !1;
      };
      typeof requestAnimationFrame == "function" ? requestAnimationFrame(a) : setTimeout(a, 16);
      return;
    }
  };
}
function Cl() {
  let e = [], t = !1;
  return function(i) {
    typeof i == "function" && (e.push(i), !t && (t = !0, typeof requestAnimationFrame == "function" ? requestAnimationFrame(() => {
      t = !1;
      const r = e.slice(0);
      e.length = 0;
      for (const a of r)
        try {
          a();
        } catch {
        }
    }) : setTimeout(() => {
      t = !1;
      const r = e.slice(0);
      e.length = 0;
      for (const a of r)
        try {
          a();
        } catch {
        }
    }, 0)));
  };
}
const Di = Cl(), Ml = `/**
 * @module worker/anchorWorker
 */
import { _rewriteAnchors } from '../htmlBuilder.js'
import { getSharedParser } from '../utils/sharedDomParser.js'

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
        
        const parser = getSharedParser()
        if (!parser) {
          // No DOMParser available in this environment; return original HTML unchanged
          postMessage({ id, result: html })
        } else {
          const doc = parser.parseFromString(html || '', 'text/html')
          const article = doc.body
          await _rewriteAnchors(article, contentBase, pagePath, { canonical: true })
          postMessage({ id, result: doc.body.innerHTML })
        }
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
        const parser = getSharedParser()
        if (!parser) {
          return { id, result: html }
        }
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
        const s = He();
        if (!s)
          postMessage({ id: n, result: i });
        else {
          const o = s.parseFromString(i || "", "text/html"), l = o.body;
          await li(l, r, a, { canonical: !0 }), postMessage({ id: n, result: o.body.innerHTML });
        }
      } catch (s) {
        postMessage({ id: n, error: String(s) });
      }
      return;
    }
  } catch (n) {
    postMessage({ id: t.id, error: String(n) });
  }
};
async function Fa(e) {
  try {
    if (e && e.type === "rewriteAnchors") {
      const { id: t, html: n, contentBase: i, pagePath: r } = e;
      try {
        const a = He();
        if (!a)
          return { id: t, result: n };
        const s = a.parseFromString(n || "", "text/html"), o = s.body;
        return await li(o, i, r, { canonical: !0 }), { id: t, result: s.body.innerHTML };
      } catch (a) {
        return { id: t, error: String(a) };
      }
    }
    return { id: e && e.id, error: "unsupported message" };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
const Ll = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  handleAnchorWorkerMessage: Fa
}, Symbol.toStringTag, { value: "Module" }));
function dt(e, t = null) {
  try {
    const n = typeof location < "u" && location && typeof location.pathname == "string" && location.pathname || "/";
    return String(n) + Ci(e, t);
  } catch {
    return Ci(e, t);
  }
}
function Tl(...e) {
  try {
    k(...e);
  } catch {
  }
}
function ar(e) {
  try {
    if (Yt(3)) return !0;
  } catch {
  }
  try {
    if (typeof le == "string" && le) return !0;
  } catch {
  }
  try {
    if (K && K.size) return !0;
  } catch {
  }
  try {
    if (ze && ze.size) return !0;
  } catch {
  }
  return !1;
}
function St(e, t) {
  try {
    if (typeof nt == "function")
      try {
        nt(e, t);
        return;
      } catch {
      }
  } catch {
  }
  try {
    e && t && K && typeof K.set == "function" && !K.has(e) && K.set(e, t);
  } catch {
  }
  try {
    t && U && typeof U.set == "function" && U.set(t, e);
  } catch {
  }
  try {
    if (ze && typeof ze.has == "function") {
      if (!ze.has(t)) {
        try {
          ze.add(t);
        } catch {
        }
        try {
          Array.isArray(Ne) && !Ne.includes(t) && Ne.push(t);
        } catch {
        }
      }
    } else
      try {
        Array.isArray(Ne) && !Ne.includes(t) && Ne.push(t);
      } catch {
      }
  } catch {
  }
}
function Rl(e, t) {
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
function zl(e, t) {
  const n = document.createElement("aside");
  n.className = "menu box nimbi-nav";
  const i = document.createElement("p");
  i.className = "menu-label", i.textContent = e("navigation"), n.appendChild(i);
  const r = document.createElement("ul");
  r.className = "menu-list";
  try {
    const a = document.createDocumentFragment();
    t.forEach((s) => {
      const o = document.createElement("li"), l = document.createElement("a");
      try {
        const c = String(s.path || "");
        try {
          l.setAttribute("href", $e(c));
        } catch {
          c && c.indexOf("/") === -1 ? l.setAttribute("href", "#" + encodeURIComponent(c)) : l.setAttribute("href", dt(c));
        }
      } catch {
        l.setAttribute("href", "#" + s.path);
      }
      if (l.textContent = s.name, o.appendChild(l), s.children && s.children.length) {
        const c = document.createElement("ul");
        s.children.forEach((u) => {
          const d = document.createElement("li"), h = document.createElement("a");
          try {
            const f = String(u.path || "");
            try {
              h.setAttribute("href", $e(f));
            } catch {
              f && f.indexOf("/") === -1 ? h.setAttribute("href", "#" + encodeURIComponent(f)) : h.setAttribute("href", dt(f));
            }
          } catch {
            h.setAttribute("href", "#" + u.path);
          }
          h.textContent = u.name, d.appendChild(h), c.appendChild(d);
        }), o.appendChild(c);
      }
      a.appendChild(o);
    }), r.appendChild(a);
  } catch {
    t.forEach((s) => {
      try {
        const o = document.createElement("li"), l = document.createElement("a");
        try {
          const c = String(s.path || "");
          try {
            l.setAttribute("href", $e(c));
          } catch {
            c && c.indexOf("/") === -1 ? l.setAttribute("href", "#" + encodeURIComponent(c)) : l.setAttribute("href", dt(c));
          }
        } catch {
          l.setAttribute("href", "#" + s.path);
        }
        if (l.textContent = s.name, o.appendChild(l), s.children && s.children.length) {
          const c = document.createElement("ul");
          s.children.forEach((u) => {
            const d = document.createElement("li"), h = document.createElement("a");
            try {
              const f = String(u.path || "");
              try {
                h.setAttribute("href", $e(f));
              } catch {
                f && f.indexOf("/") === -1 ? h.setAttribute("href", "#" + encodeURIComponent(f)) : h.setAttribute("href", dt(f));
              }
            } catch {
              h.setAttribute("href", "#" + u.path);
            }
            h.textContent = u.name, d.appendChild(h), c.appendChild(d);
          }), o.appendChild(c);
        }
        r.appendChild(o);
      } catch (o) {
        k("[htmlBuilder] createNavTree item failed", o);
      }
    });
  }
  return n.appendChild(r), n;
}
function Pl(e, t, n = "") {
  const i = document.createElement("aside");
  i.className = "menu box nimbi-toc-inner is-hidden-mobile";
  const r = document.createElement("p");
  r.className = "menu-label", r.textContent = e("onThisPage"), i.appendChild(r);
  const a = document.createElement("ul");
  a.className = "menu-list";
  try {
    const o = {};
    (t || []).forEach((l) => {
      try {
        if (!l || l.level === 1) return;
        const c = Number(l.level) >= 2 ? Number(l.level) : 2, u = document.createElement("li"), d = document.createElement("a"), h = Ns(l.text || ""), f = l.id || he(h);
        d.textContent = h;
        try {
          const b = String(n || "").replace(/^[\\.\\/]+/, ""), y = b && U && U.has && U.has(b) ? U.get(b) : b;
          y ? d.href = $e(y, f) : d.href = `#${encodeURIComponent(f)}`;
        } catch (b) {
          k("[htmlBuilder] buildTocElement href normalization failed", b), d.href = `#${encodeURIComponent(f)}`;
        }
        if (u.appendChild(d), c === 2) {
          a.appendChild(u), o[2] = u, Object.keys(o).forEach((b) => {
            Number(b) > 2 && delete o[b];
          });
          return;
        }
        let g = c - 1;
        for (; g > 2 && !o[g]; ) g--;
        g < 2 && (g = 2);
        let m = o[g];
        if (!m) {
          a.appendChild(u), o[c] = u;
          return;
        }
        let p = m.querySelector("ul");
        p || (p = document.createElement("ul"), m.appendChild(p)), p.appendChild(u), o[c] = u;
      } catch (c) {
        k("[htmlBuilder] buildTocElement item failed", c, l);
      }
    });
  } catch (o) {
    k("[htmlBuilder] buildTocElement failed", o);
  }
  return i.appendChild(a), a.querySelectorAll("li").length <= 1 ? null : i;
}
function Da(e) {
  e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((n) => {
    n.id || (n.id = he(n.textContent || ""));
  });
}
function $l(e, t, n) {
  try {
    const i = e.querySelectorAll("img");
    if (i && i.length) {
      const r = t && t.includes("/") ? t.substring(0, t.lastIndexOf("/") + 1) : "";
      i.forEach((a) => {
        const s = a.getAttribute("src") || "";
        if (s && !(/^(https?:)?\/\//.test(s) || s.startsWith("/")))
          try {
            const o = new URL(r + s, n).toString();
            a.src = o;
            try {
              a.getAttribute("loading") || a.setAttribute("data-want-lazy", "1");
            } catch (l) {
              k("[htmlBuilder] set image loading attribute failed", l);
            }
          } catch (o) {
            k("[htmlBuilder] resolve image src failed", o);
          }
      });
    }
  } catch (i) {
    k("[htmlBuilder] lazyLoadImages failed", i);
  }
}
function Ui(e, t, n) {
  try {
    const i = t && t.includes("/") ? t.substring(0, t.lastIndexOf("/") + 1) : "";
    let r = null;
    try {
      const o = new URL(n, location.href);
      r = new URL(i || ".", o).toString();
    } catch {
      try {
        r = new URL(i || ".", location.href).toString();
      } catch {
        r = i || "./";
      }
    }
    let a = null;
    try {
      a = e.querySelectorAll("[src],[href],[srcset],[poster]");
    } catch {
      const l = [];
      try {
        l.push(...Array.from(e.getElementsByTagName("img") || []));
      } catch {
      }
      try {
        l.push(...Array.from(e.getElementsByTagName("link") || []));
      } catch {
      }
      try {
        l.push(...Array.from(e.getElementsByTagName("video") || []));
      } catch {
      }
      try {
        l.push(...Array.from(e.getElementsByTagName("use") || []));
      } catch {
      }
      try {
        l.push(...Array.from(e.querySelectorAll("[srcset]") || []));
      } catch {
      }
      a = l;
    }
    let s = Array.from(a || []);
    try {
      const o = Array.from(e.getElementsByTagName("use") || []);
      for (const l of o) s.indexOf(l) === -1 && s.push(l);
    } catch {
    }
    for (const o of Array.from(s || []))
      try {
        const l = o.tagName ? o.tagName.toLowerCase() : "", c = (u) => {
          try {
            const d = o.getAttribute(u) || "";
            if (!d || /^(https?:)?\/\//i.test(d) || d.startsWith("/") || d.startsWith("#")) return;
            try {
              o.setAttribute(u, new URL(d, r).toString());
            } catch (h) {
              k("[htmlBuilder] rewrite asset attribute failed", u, d, h);
            }
          } catch (d) {
            k("[htmlBuilder] rewriteAttr failed", d);
          }
        };
        if (o.hasAttribute && o.hasAttribute("src") && c("src"), o.hasAttribute && o.hasAttribute("href") && l !== "a" && c("href"), o.hasAttribute && o.hasAttribute("xlink:href") && c("xlink:href"), o.hasAttribute && o.hasAttribute("poster") && c("poster"), o.hasAttribute && o.hasAttribute("srcset")) {
          const h = (o.getAttribute("srcset") || "").split(",").map((f) => f.trim()).filter(Boolean).map((f) => {
            const [g, m] = f.split(/\s+/, 2);
            if (!g || /^(https?:)?\/\//i.test(g) || g.startsWith("/")) return f;
            try {
              const p = new URL(g, r).toString();
              return m ? `${p} ${m}` : p;
            } catch {
              return f;
            }
          }).join(", ");
          o.setAttribute("srcset", h);
        }
      } catch (l) {
        k("[htmlBuilder] rewriteRelativeAssets node processing failed", l);
      }
  } catch (i) {
    k("[htmlBuilder] rewriteRelativeAssets failed", i);
  }
}
let Wi = "", Er = null, Zi = "";
async function li(e, t, n, i = {}) {
  try {
    i = i || {}, typeof i.canonical > "u" && (i.canonical = !0);
    const r = e.querySelectorAll("a");
    if (!r || !r.length) return;
    let a, s;
    if (t === Wi && Er)
      a = Er, s = Zi;
    else {
      try {
        a = new URL(t, location.href), s = Qt(a.pathname);
      } catch {
        try {
          a = new URL(t, location.href), s = Qt(a.pathname);
        } catch {
          a = null, s = "/";
        }
      }
      Wi = t, Er = a, Zi = s;
    }
    const o = /* @__PURE__ */ new Set(), l = [], c = /* @__PURE__ */ new Set(), u = [];
    for (const d of Array.from(r))
      try {
        try {
          if (d.closest && d.closest("h1,h2,h3,h4,h5,h6")) continue;
        } catch {
        }
        const h = d.getAttribute("href") || "";
        if (!h || Rr(h)) continue;
        try {
          if (h.startsWith("?") || h.indexOf("?") !== -1)
            try {
              const g = new URL(h, t || location.href), m = g.searchParams.get("page");
              if (m && m.indexOf("/") === -1 && n) {
                const p = n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "";
                if (p) {
                  const b = Y(p + m), y = i && i.canonical ? $e(b, g.hash ? g.hash.replace(/^#/, "") : null) : dt(b, g.hash ? g.hash.replace(/^#/, "") : null);
                  d.setAttribute("href", y);
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
          let g = f[1];
          const m = f[2];
          !g.startsWith("/") && n && (g = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + g);
          try {
            const p = new URL(g, t).pathname;
            let b = p.startsWith(s) ? p.slice(s.length) : p;
            b = Y(b), l.push({ node: d, mdPathRaw: g, frag: m, rel: b }), U.has(b) || o.add(b);
          } catch (p) {
            k("[htmlBuilder] resolve mdPath failed", p);
          }
          continue;
        }
        try {
          let g = h;
          !h.startsWith("/") && n && (h.startsWith("#") ? g = n + h : g = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + h);
          const p = new URL(g, t).pathname || "";
          if (p && p.indexOf(s) !== -1) {
            let b = p.startsWith(s) ? p.slice(s.length) : p;
            if (b = Y(b), b = nn(b), b || (b = Qr), !b.endsWith(".md")) {
              let y = null;
              try {
                if (U && U.has && U.has(b))
                  y = U.get(b);
                else
                  try {
                    const _ = String(b || "").replace(/^.*\//, "");
                    _ && U.has && U.has(_) && (y = U.get(_));
                  } catch (_) {
                    k("[htmlBuilder] mdToSlug baseName check failed", _);
                  }
              } catch (_) {
                k("[htmlBuilder] mdToSlug access check failed", _);
              }
              if (!y)
                try {
                  const _ = String(b || "").replace(/^.*\//, "");
                  for (const [w, A] of K || [])
                    if (A === b || A === _) {
                      y = w;
                      break;
                    }
                } catch {
                }
              if (y) {
                const _ = i && i.canonical ? $e(y, null) : dt(y);
                d.setAttribute("href", _);
              } else {
                let _ = b;
                try {
                  /\.[^\/]+$/.test(String(b || "")) || (_ = String(b || "") + ".html");
                } catch {
                  _ = b;
                }
                c.add(_), u.push({ node: d, rel: _ });
              }
            }
          }
        } catch (g) {
          k("[htmlBuilder] resolving href to URL failed", g);
        }
      } catch (h) {
        k("[htmlBuilder] processing anchor failed", h);
      }
    if (o.size)
      if (ar(t))
        await Mn(Array.from(o), async (d) => {
          try {
            try {
              const f = String(d).match(/([^\/]+)\.md$/), g = f && f[1];
              if (g && K.has(g)) {
                try {
                  const m = K.get(g);
                  if (m)
                    try {
                      const p = typeof m == "string" ? m : m && m.default ? m.default : null;
                      p && St(g, p);
                    } catch (p) {
                      k("[htmlBuilder] _storeSlugMapping failed", p);
                    }
                } catch (m) {
                  k("[htmlBuilder] reading slugToMd failed", m);
                }
                return;
              }
            } catch (f) {
              k("[htmlBuilder] basename slug lookup failed", f);
            }
            const h = await Be(d, t);
            if (h && h.raw) {
              const f = (h.raw || "").match(/^#\s+(.+)$/m);
              if (f && f[1]) {
                const g = he(f[1].trim());
                if (g)
                  try {
                    St(g, d);
                  } catch (m) {
                    k("[htmlBuilder] setting slug mapping failed", m);
                  }
              }
            }
          } catch (h) {
            k("[htmlBuilder] fetchMarkdown during rewriteAnchors failed", h);
          }
        }, 6);
      else {
        try {
          k("[htmlBuilder] skipping md title probes (probing disabled)");
        } catch {
        }
        for (const d of Array.from(o))
          try {
            const h = String(d).match(/([^\/]+)\.md$/), f = h && h[1];
            if (f) {
              const g = he(f);
              if (g)
                try {
                  St(g, d);
                } catch (m) {
                  k("[htmlBuilder] setting fallback slug mapping failed", m);
                }
            }
          } catch {
          }
      }
    if (c.size)
      if (ar(t))
        await Mn(Array.from(c), async (d) => {
          try {
            const h = await Be(d, t);
            if (h && h.raw)
              try {
                const f = He(), g = f ? f.parseFromString(h.raw, "text/html") : null, m = g ? g.querySelector("title") : null, p = g ? g.querySelector("h1") : null, b = m && m.textContent && m.textContent.trim() ? m.textContent.trim() : p && p.textContent ? p.textContent.trim() : null;
                if (b) {
                  const y = he(b);
                  if (y)
                    try {
                      St(y, d);
                    } catch (_) {
                      k("[htmlBuilder] setting html slug mapping failed", _);
                    }
                }
              } catch (f) {
                k("[htmlBuilder] parse fetched HTML failed", f);
              }
          } catch (h) {
            k("[htmlBuilder] fetchMarkdown for htmlPending failed", h);
          }
        }, 5);
      else {
        try {
          k("[htmlBuilder] skipping html title probes (probing disabled)");
        } catch {
        }
        for (const d of Array.from(c))
          try {
            const h = String(d).match(/([^\/]+)\.html$/), f = h && h[1];
            if (f) {
              const g = he(f);
              if (g)
                try {
                  St(g, d);
                } catch (m) {
                  k("[htmlBuilder] setting fallback html slug mapping failed", m);
                }
            }
          } catch {
          }
      }
    for (const d of l) {
      const { node: h, frag: f, rel: g } = d;
      let m = null;
      try {
        U.has(g) && (m = U.get(g));
      } catch (p) {
        k("[htmlBuilder] mdToSlug access failed", p);
      }
      if (m) {
        const p = i && i.canonical ? $e(m, f) : dt(m, f);
        h.setAttribute("href", p);
      } else {
        const p = i && i.canonical ? $e(g, f) : dt(g, f);
        h.setAttribute("href", p);
      }
    }
    for (const d of u) {
      const { node: h, rel: f } = d;
      let g = null;
      try {
        U.has(f) && (g = U.get(f));
      } catch (m) {
        k("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo", m);
      }
      if (!g)
        try {
          const m = String(f || "").replace(/^.*\//, "");
          U.has(m) && (g = U.get(m));
        } catch (m) {
          k("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo", m);
        }
      if (g) {
        const m = i && i.canonical ? $e(g, null) : dt(g);
        h.setAttribute("href", m);
      } else {
        const m = i && i.canonical ? $e(f, null) : dt(f);
        h.setAttribute("href", m);
      }
    }
  } catch (r) {
    k("[htmlBuilder] rewriteAnchors failed", r);
  }
}
function Il(e, t, n, i) {
  const r = t.querySelector("h1"), a = r ? (r.textContent || "").trim() : "";
  let s = "";
  try {
    let o = "";
    try {
      e && e.meta && e.meta.title && (o = String(e.meta.title).trim());
    } catch {
    }
    if (!o && a && (o = a), !o)
      try {
        const l = t.querySelector("h2");
        l && l.textContent && (o = String(l.textContent).trim());
      } catch {
      }
    !o && n && (o = String(n)), o && (s = he(o)), s || (s = Qr);
    try {
      if (n) {
        try {
          St(s, n);
        } catch (l) {
          k("[htmlBuilder] computeSlug set slug mapping failed", l);
        }
        try {
          const l = Y(String(n || ""));
          if (U && typeof U.has == "function" && U.has(l))
            s = U.get(l);
          else
            try {
              for (const [c, u] of K || [])
                try {
                  const d = typeof u == "string" ? u : u && u.default ? u.default : null;
                  if (d && Y(String(d)) === l) {
                    s = c;
                    break;
                  }
                } catch {
                }
            } catch {
            }
        } catch {
        }
      }
    } catch (l) {
      k("[htmlBuilder] computeSlug set slug mapping failed", l);
    }
    try {
      let l = i || "";
      if (!l)
        try {
          const c = it(typeof location < "u" ? location.href : "");
          c && c.anchor && c.page && String(c.page) === String(s) ? l = c.anchor : l = "";
        } catch {
          l = "";
        }
      try {
        history.replaceState({ page: s }, "", dt(s, l));
      } catch (c) {
        k("[htmlBuilder] computeSlug history replace failed", c);
      }
    } catch (l) {
      k("[htmlBuilder] computeSlug inner failed", l);
    }
  } catch (o) {
    k("[htmlBuilder] computeSlug failed", o);
  }
  try {
    if (e && e.meta && e.meta.title && r) {
      const o = String(e.meta.title).trim();
      if (o && o !== a) {
        try {
          s && (r.id = s);
        } catch {
        }
        try {
          if (Array.isArray(e.toc))
            for (const l of e.toc)
              try {
                if (l && Number(l.level) === 1 && String(l.text).trim() === (a || "").trim()) {
                  l.id = s;
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
async function Nl(e, t) {
  if (!e || !e.length) return;
  const n = /* @__PURE__ */ new Set();
  for (const s of Array.from(e || []))
    try {
      const o = s.getAttribute("href") || "";
      if (!o) continue;
      let u = Y(o).split(/::|#/, 2)[0];
      try {
        const h = u.indexOf("?");
        h !== -1 && (u = u.slice(0, h));
      } catch {
      }
      if (!u || (u.includes(".") || (u = u + ".html"), !/\.html(?:$|[?#])/.test(u) && !u.toLowerCase().endsWith(".html"))) continue;
      const d = u;
      try {
        if (U && U.has && U.has(d)) continue;
      } catch (h) {
        k("[htmlBuilder] mdToSlug check failed", h);
      }
      try {
        let h = !1;
        for (const f of K.values())
          if (f === d) {
            h = !0;
            break;
          }
        if (h) continue;
      } catch (h) {
        k("[htmlBuilder] slugToMd iteration failed", h);
      }
      n.add(d);
    } catch (o) {
      k("[htmlBuilder] preScanHtmlSlugs anchor iteration failed", o);
    }
  if (!n.size) return;
  if (!ar()) {
    try {
      k("[htmlBuilder] skipping preScanHtmlSlugs (probing disabled)");
    } catch {
    }
    for (const s of Array.from(n))
      try {
        const o = String(s).match(/([^\/]+)\.html$/), l = o && o[1];
        if (l) {
          const c = he(l);
          if (c)
            try {
              St(c, s);
            } catch (u) {
              k("[htmlBuilder] setting fallback preScanHtmlSlugs mapping failed", u);
            }
        }
      } catch {
      }
    return;
  }
  const i = async (s) => {
    try {
      const o = await Be(s, t);
      if (o && o.raw)
        try {
          const c = He().parseFromString(o.raw, "text/html"), u = c.querySelector("title"), d = c.querySelector("h1"), h = u && u.textContent && u.textContent.trim() ? u.textContent.trim() : d && d.textContent ? d.textContent.trim() : null;
          if (h) {
            const f = he(h);
            if (f)
              try {
                St(f, s);
              } catch (g) {
                k("[htmlBuilder] set slugToMd/mdToSlug failed", g);
              }
          }
        } catch (l) {
          k("[htmlBuilder] parse HTML title failed", l);
        }
    } catch (o) {
      k("[htmlBuilder] fetchAndExtract failed", o);
    }
  }, r = Array.from(n), a = Math.max(1, Math.min(yn(), r.length || 1));
  await Mn(r, i, a);
}
async function Bl(e, t) {
  if (!e || !e.length) return;
  const n = [], i = /* @__PURE__ */ new Set();
  let r = "";
  try {
    const a = new URL(t, typeof location < "u" ? location.href : "http://localhost/");
    r = Qt(a.pathname);
  } catch (a) {
    r = "", k("[htmlBuilder] preMapMdSlugs parse base failed", a);
  }
  for (const a of Array.from(e || []))
    try {
      const s = a.getAttribute("href") || "";
      if (!s) continue;
      const o = s.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (o) {
        let l = Y(o[1]);
        try {
          let c;
          try {
            c = Rl(l, t);
          } catch (d) {
            c = l, k("[htmlBuilder] resolve mdPath URL failed", d);
          }
          const u = c && r && c.startsWith(r) ? c.slice(r.length) : String(c || "").replace(/^\//, "");
          n.push({ rel: u }), U.has(u) || i.add(u);
        } catch (c) {
          k("[htmlBuilder] rewriteAnchors failed", c);
        }
        continue;
      }
    } catch (s) {
      k("[htmlBuilder] preMapMdSlugs anchor iteration failed", s);
    }
  if (i.size)
    if (ar())
      await Promise.all(Array.from(i).map(async (a) => {
        try {
          const s = String(a).match(/([^\/]+)\.md$/), o = s && s[1];
          if (o && K.has(o)) {
            try {
              const l = K.get(o);
              if (l)
                try {
                  const c = typeof l == "string" ? l : l && l.default ? l.default : null;
                  c && St(o, c);
                } catch (c) {
                  k("[htmlBuilder] _storeSlugMapping failed", c);
                }
            } catch (l) {
              k("[htmlBuilder] preMapMdSlugs slug map access failed", l);
            }
            return;
          }
        } catch (s) {
          k("[htmlBuilder] preMapMdSlugs basename check failed", s);
        }
        try {
          const s = await Be(a, t);
          if (s && s.raw) {
            const o = (s.raw || "").match(/^#\s+(.+)$/m);
            if (o && o[1]) {
              const l = he(o[1].trim());
              if (l)
                try {
                  St(l, a);
                } catch (c) {
                  k("[htmlBuilder] preMapMdSlugs setting slug mapping failed", c);
                }
            }
          }
        } catch (s) {
          k("[htmlBuilder] preMapMdSlugs fetch failed", s);
        }
      }));
    else
      try {
        k("[htmlBuilder] skipping preMapMdSlugs probes (probing disabled)");
      } catch {
      }
}
He();
function Cr(e) {
  try {
    const n = He().parseFromString(e || "", "text/html");
    Da(n);
    try {
      n.querySelectorAll("img").forEach((l) => {
        try {
          l.getAttribute("loading") || l.setAttribute("data-want-lazy", "1");
        } catch (c) {
          k("[htmlBuilder] parseHtml set image loading attribute failed", c);
        }
      });
    } catch (o) {
      k("[htmlBuilder] parseHtml query images failed", o);
    }
    n.querySelectorAll("pre code, code[class]").forEach((o) => {
      try {
        const l = o.getAttribute && o.getAttribute("class") || o.className || "", c = l.match(/language-([a-zA-Z0-9_+-]+)/) || l.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (c && c[1]) {
          const u = (c[1] || "").toLowerCase(), d = Ce.size && (Ce.get(u) || Ce.get(String(u).toLowerCase())) || u;
          try {
            (async () => {
              try {
                await Cn(d);
              } catch (h) {
                k("[htmlBuilder] registerLanguage failed", h);
              }
            })();
          } catch (h) {
            k("[htmlBuilder] schedule registerLanguage failed", h);
          }
        } else
          try {
            if (Re && typeof Re.getLanguage == "function" && Re.getLanguage("plaintext")) {
              const u = Re.highlight ? Re.highlight(o.textContent || "", { language: "plaintext" }) : null;
              if (u && u.value)
                try {
                  if (typeof document < "u" && document.createRange && typeof document.createRange == "function") {
                    const d = document.createRange().createContextualFragment(u.value);
                    if (typeof o.replaceChildren == "function") o.replaceChildren(...Array.from(d.childNodes));
                    else {
                      for (; o.firstChild; ) o.removeChild(o.firstChild);
                      o.appendChild(d);
                    }
                  } else
                    o.innerHTML = u.value;
                } catch {
                  try {
                    o.innerHTML = u.value;
                  } catch {
                  }
                }
            }
          } catch (u) {
            k("[htmlBuilder] plaintext highlight fallback failed", u);
          }
      } catch (l) {
        k("[htmlBuilder] code element processing failed", l);
      }
    });
    const r = [];
    n.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((o) => {
      r.push({ level: Number(o.tagName.substring(1)), text: (o.textContent || "").trim(), id: o.id });
    });
    const s = {};
    try {
      const o = n.querySelector("title");
      o && o.textContent && String(o.textContent).trim() && (s.title = String(o.textContent).trim());
    } catch {
    }
    return { html: n.body.innerHTML, meta: s, toc: r };
  } catch (t) {
    return k("[htmlBuilder] parseHtml failed", t), { html: e || "", meta: {}, toc: [] };
  }
}
async function Ol(e) {
  const t = qr ? await qr(e || "", Ce) : kn(e || "", Ce), n = new Set(t), i = [];
  for (const r of n)
    try {
      const a = Ce.size && (Ce.get(r) || Ce.get(String(r).toLowerCase())) || r;
      try {
        i.push(Cn(a));
      } catch (s) {
        k("[htmlBuilder] ensureLanguages push canonical failed", s);
      }
      if (String(r) !== String(a))
        try {
          i.push(Cn(r));
        } catch (s) {
          k("[htmlBuilder] ensureLanguages push alias failed", s);
        }
    } catch (a) {
      k("[htmlBuilder] ensureLanguages inner failed", a);
    }
  try {
    await Promise.all(i);
  } catch (r) {
    k("[htmlBuilder] ensureLanguages failed", r);
  }
}
async function jl(e) {
  if (await Ol(e), zn) {
    const t = await zn(e || "");
    return !t || typeof t != "object" ? { html: String(e || ""), meta: {}, toc: [] } : (Array.isArray(t.toc) || (t.toc = []), t.meta || (t.meta = {}), t);
  }
  return { html: String(e || ""), meta: {}, toc: [] };
}
async function ql(e, t, n, i, r) {
  let a = null;
  if (t.isHtml)
    try {
      const d = He();
      if (d) {
        const h = d.parseFromString(t.raw || "", "text/html");
        try {
          Ui(h.body, n, r);
        } catch (f) {
          k("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)", f);
        }
        a = Cr(h.documentElement && h.documentElement.outerHTML ? h.documentElement.outerHTML : t.raw || "");
      } else
        a = Cr(t.raw || "");
    } catch {
      a = Cr(t.raw || "");
    }
  else
    a = await jl(t.raw || "");
  const s = document.createElement("article");
  s.className = "nimbi-article content";
  try {
    const d = He && He();
    if (d) {
      const h = d.parseFromString(String(a.html || ""), "text/html"), f = Array.from(h.body.childNodes || []);
      f.length ? s.replaceChildren(...f) : s.innerHTML = a.html;
    } else
      try {
        const h = document && typeof document.createRange == "function" ? document.createRange() : null;
        if (h && typeof h.createContextualFragment == "function") {
          const f = h.createContextualFragment(String(a.html || ""));
          s.replaceChildren(...Array.from(f.childNodes));
        } else
          s.innerHTML = a.html;
      } catch {
        s.innerHTML = a.html;
      }
  } catch {
    try {
      s.innerHTML = a.html;
    } catch (h) {
      k("[htmlBuilder] set article html failed", h);
    }
  }
  try {
    Ui(s, n, r);
  } catch (d) {
    k("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle", d);
  }
  try {
    Da(s);
  } catch (d) {
    k("[htmlBuilder] addHeadingIds failed", d);
  }
  try {
    s.querySelectorAll("pre code, code[class]").forEach((h) => {
      try {
        const f = h.getAttribute && h.getAttribute("class") || h.className || "", g = String(f || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
        if (g)
          try {
            h.setAttribute && h.setAttribute("class", g);
          } catch (m) {
            h.className = g, k("[htmlBuilder] set element class failed", m);
          }
        else
          try {
            h.removeAttribute && h.removeAttribute("class");
          } catch (m) {
            h.className = "", k("[htmlBuilder] remove element class failed", m);
          }
      } catch (f) {
        k("[htmlBuilder] code element cleanup failed", f);
      }
    });
  } catch (d) {
    k("[htmlBuilder] processing code elements failed", d);
  }
  try {
    vs(s);
  } catch (d) {
    k("[htmlBuilder] observeCodeBlocks failed", d);
  }
  $l(s, n, r);
  try {
    (s.querySelectorAll && s.querySelectorAll("img") || []).forEach((h) => {
      try {
        const f = h.parentElement;
        if (!f || f.tagName.toLowerCase() !== "p" || f.childNodes.length !== 1) return;
        const g = document.createElement("figure");
        g.className = "image", f.replaceWith(g), g.appendChild(h);
      } catch {
      }
    });
  } catch (d) {
    k("[htmlBuilder] wrap images in Bulma image helper failed", d);
  }
  try {
    (s.querySelectorAll && s.querySelectorAll("table") || []).forEach((h) => {
      try {
        if (h.classList)
          h.classList.contains("table") || h.classList.add("table");
        else {
          const f = h.getAttribute && h.getAttribute("class") ? h.getAttribute("class") : "", g = String(f || "").split(/\s+/).filter(Boolean);
          g.indexOf("table") === -1 && g.push("table");
          try {
            h.setAttribute && h.setAttribute("class", g.join(" "));
          } catch {
            h.className = g.join(" ");
          }
        }
      } catch {
      }
    });
  } catch (d) {
    k("[htmlBuilder] add Bulma table class failed", d);
  }
  const { topH1: o, h1Text: l, slugKey: c } = Il(a, s, n, i);
  try {
    if (o && a && a.meta && (a.meta.author || a.meta.date) && !(o.parentElement && o.parentElement.querySelector && o.parentElement.querySelector(".nimbi-article-subtitle"))) {
      const h = a.meta.author ? String(a.meta.author).trim() : "", f = a.meta.date ? String(a.meta.date).trim() : "";
      let g = "";
      try {
        const p = new Date(f);
        f && !isNaN(p.getTime()) ? g = p.toLocaleDateString() : g = f;
      } catch {
        g = f;
      }
      const m = [];
      if (h && m.push(h), g && m.push(g), m.length) {
        const p = document.createElement("p"), b = m[0] ? String(m[0]).replace(/"/g, "").trim() : "", y = m.slice(1);
        if (p.className = "nimbi-article-subtitle is-6 has-text-grey-light", b) {
          const _ = document.createElement("span");
          _.className = "nimbi-article-author", _.textContent = b, p.appendChild(_);
        }
        if (y.length) {
          const _ = document.createElement("span");
          _.className = "nimbi-article-meta", _.textContent = y.join(" • "), p.appendChild(_);
        }
        try {
          o.parentElement.insertBefore(p, o.nextSibling);
        } catch {
          try {
            o.insertAdjacentElement("afterend", p);
          } catch {
          }
        }
      }
    }
  } catch {
  }
  try {
    await Ul(s, r, n);
  } catch (d) {
    Tl("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", d), await li(s, r, n);
  }
  const u = Pl(e, a.toc, n);
  return { article: s, parsed: a, toc: u, topH1: o, h1Text: l, slugKey: c };
}
function Hl(e) {
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
                zt("[htmlBuilder] executed inline script via Function");
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
              k("[htmlBuilder] injected script error", { src: r, ev: a });
            } catch {
            }
          }), i.addEventListener("load", () => {
            try {
              zt("[htmlBuilder] injected script loaded", { src: r, hasNimbi: !!(window && window.nimbiCMS) });
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
                k("[htmlBuilder] injected script append failed, skipping", { src: r, err: s });
              } catch {
              }
            }
          }
          n.parentNode && n.parentNode.removeChild(n);
          try {
            zt("[htmlBuilder] executed injected script", r);
          } catch {
          }
        } catch (i) {
          k("[htmlBuilder] execute injected script failed", i);
        }
    } catch {
    }
}
function Gi(e, t, n) {
  if (e)
    try {
      typeof e.replaceChildren == "function" ? e.replaceChildren() : e.innerHTML = "";
    } catch {
      try {
        e.innerHTML = "";
      } catch {
      }
    }
  const i = document.createElement("article");
  i.className = "nimbi-article content nimbi-not-found";
  const r = document.createElement("h1");
  r.textContent = t && t("notFound") || "Page not found";
  const a = document.createElement("p");
  a.textContent = n && n.message ? String(n.message) : "Failed to resolve the requested page.", i.appendChild(r), i.appendChild(a), e && e.appendChild && e.appendChild(i);
  try {
    if (!le)
      try {
        const s = document.createElement("p"), o = t && t("goHome") || "Go back to";
        s.textContent = o + " ";
        const l = document.createElement("a");
        try {
          l.href = $e(bt);
        } catch {
          l.href = $e(bt || "");
        }
        l.textContent = t && t("home") || "Home", s.appendChild(l), e && e.appendChild && e.appendChild(s);
      } catch {
      }
  } catch {
  }
  try {
    try {
      Qn({ title: t && t("notFound") || "Not Found", description: t && t("notFoundDescription") || "" }, le, t && t("notFound") || "Not Found", t && t("notFoundDescription") || "");
    } catch {
    }
  } catch {
  }
  try {
    try {
      const s = typeof window < "u" && window.__nimbiNotFoundRedirect ? String(window.__nimbiNotFoundRedirect).trim() : null;
      if (s)
        try {
          const o = new URL(s, location.origin).toString();
          if ((location.href || "").split("#")[0] !== o)
            try {
              location.replace(o);
            } catch {
              location.href = o;
            }
        } catch {
        }
    } catch {
    }
  } catch {
  }
}
const Ua = zs(Ml, Ll && Fa, "anchor");
function Fl() {
  return Ua.get();
}
function Dl(e) {
  return Ua.send(e, 2e3);
}
async function Ul(e, t, n) {
  if (!Fl()) throw new Error("anchor worker unavailable");
  if (!e || typeof e.innerHTML != "string") throw new Error("invalid article element");
  const r = String(e.innerHTML), a = await Dl({ type: "rewriteAnchors", html: r, contentBase: t, pagePath: n });
  if (a && typeof a == "string")
    try {
      const s = He && He();
      if (s) {
        const o = s.parseFromString(String(a || ""), "text/html"), l = Array.from(o.body.childNodes || []);
        l.length ? e.replaceChildren(...l) : e.innerHTML = a;
      } else
        try {
          const o = document && typeof document.createRange == "function" ? document.createRange() : null;
          if (o && typeof o.createContextualFragment == "function") {
            const l = o.createContextualFragment(String(a || ""));
            e.replaceChildren(...Array.from(l.childNodes));
          } else
            e.innerHTML = a;
        } catch {
          e.innerHTML = a;
        }
    } catch (s) {
      k("[htmlBuilder] applying rewritten anchors failed", s);
    }
}
function Wl(e) {
  try {
    e.addEventListener("click", (t) => {
      const n = t.target && t.target.closest ? t.target.closest("a") : null;
      if (!n) return;
      const i = n.getAttribute("href") || "";
      try {
        const r = it(i), a = r && r.page ? r.page : null, s = r && r.anchor ? r.anchor : null;
        if (!a && !s) return;
        t.preventDefault();
        let o = null;
        try {
          history && history.state && history.state.page && (o = history.state.page);
        } catch (l) {
          o = null, k("[htmlBuilder] access history.state failed", l);
        }
        try {
          o || (o = new URL(location.href).searchParams.get("page"));
        } catch (l) {
          k("[htmlBuilder] parse current location failed", l);
        }
        if (!a && s || a && o && String(a) === String(o)) {
          try {
            if (!a && s)
              try {
                history.replaceState(history.state, "", (location.pathname || "") + (location.search || "") + (s ? "#" + encodeURIComponent(s) : ""));
              } catch (l) {
                k("[htmlBuilder] history.replaceState failed", l);
              }
            else
              try {
                history.replaceState({ page: o || a }, "", dt(o || a, s));
              } catch (l) {
                k("[htmlBuilder] history.replaceState failed", l);
              }
          } catch (l) {
            k("[htmlBuilder] update history for anchor failed", l);
          }
          try {
            t.stopImmediatePropagation && t.stopImmediatePropagation(), t.stopPropagation && t.stopPropagation();
          } catch (l) {
            k("[htmlBuilder] stopPropagation failed", l);
          }
          try {
            Hr(s);
          } catch (l) {
            k("[htmlBuilder] scrollToAnchorOrTop failed", l);
          }
          return;
        }
        history.pushState({ page: a }, "", dt(a, s));
        try {
          if (typeof window < "u" && typeof window.renderByQuery == "function")
            try {
              window.renderByQuery();
            } catch (l) {
              k("[htmlBuilder] window.renderByQuery failed", l);
            }
          else if (typeof window < "u")
            try {
              window.dispatchEvent(new PopStateEvent("popstate"));
            } catch (l) {
              k("[htmlBuilder] dispatch popstate failed", l);
            }
          else
            try {
              renderByQuery();
            } catch (l) {
              k("[htmlBuilder] renderByQuery failed", l);
            }
        } catch (l) {
          k("[htmlBuilder] SPA navigation invocation failed", l);
        }
      } catch (r) {
        k("[htmlBuilder] non-URL href in attachTocClickHandler", r);
      }
    });
  } catch (t) {
    k("[htmlBuilder] attachTocClickHandler failed", t);
  }
}
function Hr(e) {
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
                  k("[htmlBuilder] scrollIntoView failed", a);
                }
              }
          } catch {
            try {
              n.scrollIntoView();
            } catch (a) {
              k("[htmlBuilder] final scroll fallback failed", a);
            }
          }
        };
        try {
          requestAnimationFrame(() => setTimeout(i, 50));
        } catch (r) {
          k("[htmlBuilder] scheduling scroll failed", r), setTimeout(i, 50);
        }
      } catch (i) {
        try {
          n.scrollIntoView();
        } catch (r) {
          k("[htmlBuilder] final scroll fallback failed", r);
        }
        k("[htmlBuilder] doScroll failed", i);
      }
  } else
    try {
      t && t.scrollTo ? t.scrollTo({ top: 0, behavior: "smooth" }) : window.scrollTo(0, 0);
    } catch (n) {
      try {
        window.scrollTo(0, 0);
      } catch (i) {
        k("[htmlBuilder] window.scrollTo failed", i);
      }
      k("[htmlBuilder] scroll to top failed", n);
    }
}
function Zl(e, t, { mountOverlay: n = null, container: i = null, mountEl: r = null, navWrap: a = null, t: s = null } = {}) {
  try {
    const o = s || ((m) => typeof m == "string" ? m : ""), l = i || document.querySelector(".nimbi-cms"), c = r || document.querySelector(".nimbi-mount"), u = n || document.querySelector(".nimbi-overlay"), d = a || document.querySelector(".nimbi-nav-wrap");
    let f = document.querySelector(".nimbi-scroll-top");
    if (!f) {
      f = document.createElement("button"), f.className = "nimbi-scroll-top button is-primary is-rounded is-small", f.setAttribute("aria-label", o("scrollToTop")), f.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';
      try {
        u && u.appendChild ? u.appendChild(f) : l && l.appendChild ? l.appendChild(f) : c && c.appendChild ? c.appendChild(f) : document.body.appendChild(f);
      } catch {
        try {
          document.body.appendChild(f);
        } catch (p) {
          k("[htmlBuilder] append scroll top button failed", p);
        }
      }
      try {
        try {
          ra(f);
        } catch {
        }
      } catch (m) {
        k("[htmlBuilder] set scroll-top button theme registration failed", m);
      }
      f.addEventListener("click", () => {
        try {
          i && i.scrollTo ? i.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : r && r.scrollTo ? r.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } catch {
          try {
            i && (i.scrollTop = 0);
          } catch (p) {
            k("[htmlBuilder] fallback container scrollTop failed", p);
          }
          try {
            r && (r.scrollTop = 0);
          } catch (p) {
            k("[htmlBuilder] fallback mountEl scrollTop failed", p);
          }
          try {
            document.documentElement.scrollTop = 0;
          } catch (p) {
            k("[htmlBuilder] fallback document scrollTop failed", p);
          }
        }
      });
    }
    const g = d && d.querySelector ? d.querySelector(".menu-label") : null;
    if (t) {
      if (!f._nimbiObserver)
        if (typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u") {
          const m = globalThis.IntersectionObserver, p = new m((b) => {
            for (const y of b)
              y.target instanceof Element && (y.isIntersecting ? (f.classList.remove("show"), g && g.classList.remove("show")) : (f.classList.add("show"), g && g.classList.add("show")));
          }, { root: i instanceof Element ? i : r instanceof Element ? r : null, threshold: 0 });
          f._nimbiObserver = p;
        } else
          f._nimbiObserver = null;
      try {
        f._nimbiObserver && typeof f._nimbiObserver.disconnect == "function" && f._nimbiObserver.disconnect();
      } catch (m) {
        k("[htmlBuilder] observer disconnect failed", m);
      }
      try {
        f._nimbiObserver && typeof f._nimbiObserver.observe == "function" && f._nimbiObserver.observe(t);
      } catch (m) {
        k("[htmlBuilder] observer observe failed", m);
      }
      try {
        const m = () => {
          try {
            const p = l instanceof Element ? l.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }, b = t.getBoundingClientRect();
            !(b.bottom < p.top || b.top > p.bottom) ? (f.classList.remove("show"), g && g.classList.remove("show")) : (f.classList.add("show"), g && g.classList.add("show"));
          } catch (p) {
            k("[htmlBuilder] checkIntersect failed", p);
          }
        };
        m(), typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u" || setTimeout(m, 100);
      } catch (m) {
        k("[htmlBuilder] checkIntersect outer failed", m);
      }
    } else {
      f.classList.remove("show"), g && g.classList.remove("show");
      const m = i instanceof Element ? i : r instanceof Element ? r : window, p = () => {
        try {
          (m === window ? window.scrollY : m.scrollTop || 0) > 10 ? (f.classList.add("show"), g && g.classList.add("show")) : (f.classList.remove("show"), g && g.classList.remove("show"));
        } catch (b) {
          k("[htmlBuilder] onScroll handler failed", b);
        }
      };
      Jn(() => m.addEventListener("scroll", El(p))), p();
    }
  } catch (o) {
    k("[htmlBuilder] ensureScrollTopButton failed", o);
  }
}
function Jt(e, t) {
  try {
    if (typeof nt == "function")
      try {
        nt(e, t);
        return;
      } catch {
      }
  } catch {
  }
  try {
    e && t && K && typeof K.set == "function" && !K.has(e) && K.set(e, t);
  } catch {
  }
  try {
    t && U && typeof U.set == "function" && U.set(t, e);
  } catch {
  }
  try {
    if (ze && typeof ze.has == "function") {
      if (!ze.has(t)) {
        try {
          ze.add(t);
        } catch {
        }
        try {
          Array.isArray(Ne) && !Ne.includes(t) && Ne.push(t);
        } catch {
        }
      }
    } else
      try {
        Array.isArray(Ne) && !Ne.includes(t) && Ne.push(t);
      } catch {
      }
  } catch {
  }
}
function Xi(e, t) {
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
function Gl(e) {
  try {
    if (!Array.isArray(e)) return e;
    e.forEach((t) => {
      try {
        if (!t || typeof t != "object") return;
        let n = typeof t.slug == "string" ? String(t.slug) : "", i = null;
        if (n && n.indexOf("::") !== -1) {
          const o = n.split("::");
          n = o[0] || "", i = o.slice(1).join("::") || null;
        }
        const r = !!(n && (n.indexOf(".") !== -1 || n.indexOf("/") !== -1));
        let a = "";
        try {
          if (t.path && typeof t.path == "string") {
            const o = Y(String(t.path || ""));
            if (a = findSlugForPath(o) || (U && U.has(o) ? U.get(o) : "") || "", !a)
              if (t.title && String(t.title).trim())
                a = he(String(t.title).trim());
              else {
                const l = o.replace(/^.*\//, "").replace(/\.(?:md|html?)$/i, "");
                a = he(l || o);
              }
          } else if (r) {
            const o = String(n).replace(/\.(?:md|html?)$/i, ""), l = findSlugForPath(o) || (U && U.has(o) ? U.get(o) : "") || "";
            l ? a = l : t.title && String(t.title).trim() ? a = he(String(t.title).trim()) : a = he(o);
          } else
            !n && t.title && String(t.title).trim() ? a = he(String(t.title).trim()) : a = n || "";
        } catch {
          try {
            a = t.title && String(t.title).trim() ? he(String(t.title).trim()) : n ? he(n) : "";
          } catch {
            a = n;
          }
        }
        let s = a || "";
        i && (s = s ? `${s}::${i}` : `${he(i)}`), s && (t.slug = s);
        try {
          if (t.path && s) {
            const o = String(s).split("::")[0];
            try {
              Jt(o, Y(String(t.path || "")));
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
async function Xl(e, t, n, i, r, a, s, o, l = "eager", c = 1, u = void 0, d = "favicon") {
  if (!e || !(e instanceof HTMLElement))
    throw new TypeError("navbarWrap must be an HTMLElement");
  const h = He(), f = h ? h.parseFromString(n || "", "text/html") : null, g = f ? f.querySelectorAll("a") : [];
  await Jn(() => Nl(g, i)), await Jn(() => Bl(g, i));
  try {
    ie(g, i);
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
  let m = null, p = null, b = null, y = null, _ = null, w = null, A = !1, S = null;
  const M = /* @__PURE__ */ new Map();
  function I() {
    try {
      const T = typeof O < "u" && O && O.querySelector ? O.querySelector(".navbar-burger") : e && e.querySelector ? e.querySelector(".navbar-burger") : typeof document < "u" ? document.querySelector(".navbar-burger") : null, $ = T && T.dataset ? T.dataset.target : null, E = $ ? typeof O < "u" && O && O.querySelector ? O.querySelector(`#${$}`) || document.getElementById($) : e && e.querySelector ? e.querySelector(`#${$}`) : typeof document < "u" ? document.getElementById($) : null : null;
      if (T && T.classList && T.classList.contains("is-active")) {
        try {
          T.classList.remove("is-active");
        } catch {
        }
        try {
          T.setAttribute("aria-expanded", "false");
        } catch {
        }
        if (E && E.classList)
          try {
            E.classList.remove("is-active");
          } catch {
          }
      }
    } catch (T) {
      k("[nimbi-cms] closeMobileMenu failed", T);
    }
  }
  async function q() {
    const T = t && t instanceof HTMLElement ? t : typeof document < "u" ? document.querySelector(".nimbi-content") : null;
    try {
      T && T.classList.add("is-inactive");
    } catch {
    }
    try {
      const $ = s && s();
      $ && typeof $.then == "function" && await $;
    } catch ($) {
      try {
        k("[nimbi-cms] renderByQuery failed", $);
      } catch {
      }
    } finally {
      try {
        if (typeof requestAnimationFrame == "function")
          requestAnimationFrame(() => {
            try {
              T && T.classList.remove("is-inactive");
            } catch {
            }
          });
        else
          try {
            T && T.classList.remove("is-inactive");
          } catch {
          }
      } catch {
        try {
          T && T.classList.remove("is-inactive");
        } catch {
        }
      }
    }
  }
  function Q(T) {
    try {
      let $ = T && typeof T.slug == "string" ? String(T.slug) : "", E = null;
      try {
        $ && $.indexOf("::") !== -1 && (E = $.split("::").slice(1).join("::") || null);
      } catch {
      }
      try {
        if (T && T.path && typeof T.path == "string") {
          const v = Y(String(T.path || "")), C = v.replace(/^.*\//, "");
          try {
            if (M && M.has(v)) return { page: M.get(v), hash: E };
            if (M && M.has(C)) return { page: M.get(C), hash: E };
          } catch {
          }
          try {
            if (U && U.has(v)) return { page: U.get(v), hash: E };
          } catch {
          }
          try {
            const F = W(v);
            if (F) return { page: F, hash: E };
          } catch {
          }
        }
      } catch {
      }
      if ($ && $.indexOf("::") !== -1) {
        const v = $.split("::");
        $ = v[0] || "", E = v.slice(1).join("::") || null;
      }
      if ($ && ($.includes(".") || $.includes("/"))) {
        const v = Y(T && T.path ? String(T.path) : $), C = v.replace(/^.*\//, "");
        try {
          if (M && M.has(v)) return { page: M.get(v), hash: E };
          if (M && M.has(C)) return { page: M.get(C), hash: E };
        } catch {
        }
        try {
          let F = W(v);
          if (!F)
            try {
              const V = String(v || "").replace(/^\/+/, ""), B = V.replace(/^.*\//, "");
              for (const [P, z] of K.entries())
                try {
                  let j = null;
                  if (typeof z == "string" ? j = Y(String(z || "")) : z && typeof z == "object" && (z.default ? j = Y(String(z.default || "")) : j = null), !j) continue;
                  if (j === V || j.endsWith("/" + V) || V.endsWith("/" + j) || j.endsWith(B) || V.endsWith(B)) {
                    F = P;
                    break;
                  }
                } catch {
                }
            } catch {
            }
          if (F) $ = F;
          else
            try {
              const V = String($).replace(/\.(?:md|html?)$/i, "");
              $ = he(V || v);
            } catch {
              $ = he(v);
            }
        } catch {
          $ = he(v);
        }
      }
      return !$ && T && T.path && ($ = he(Y(String(T.path || "")))), { page: $, hash: E };
    } catch {
      return { page: T && T.slug || "", hash: null };
    }
  }
  const R = () => m || (m = (async () => {
    try {
      const T = await Promise.resolve().then(() => at), $ = typeof globalThis < "u" ? globalThis.buildSearchIndex : void 0, E = typeof globalThis < "u" ? globalThis.buildSearchIndexWorker : void 0, v = Xi(T, "buildSearchIndex"), C = Xi(T, "buildSearchIndexWorker"), F = typeof $ == "function" ? $ : v || void 0, V = typeof E == "function" ? E : C || void 0;
      Bt("[nimbi-cms test] ensureSearchIndex: buildFn=" + typeof F + " workerFn=" + typeof V + " (global preferred)");
      const B = [];
      try {
        r && B.push(r);
      } catch {
      }
      try {
        navigationPage && B.push(navigationPage);
      } catch {
      }
      if (l === "lazy" && typeof V == "function")
        try {
          const P = await V(i, c, u, B.length ? B : void 0);
          if (P && P.length) {
            try {
              if (T && typeof T._setSearchIndex == "function")
                try {
                  T._setSearchIndex(P);
                } catch {
                }
            } catch {
            }
            return P;
          }
        } catch (P) {
          k("[nimbi-cms] worker builder threw", P);
        }
      return typeof F == "function" ? (Bt("[nimbi-cms test] calling buildFn"), await F(i, c, u, B.length ? B : void 0)) : [];
    } catch (T) {
      return k("[nimbi-cms] buildSearchIndex failed", T), [];
    } finally {
      if (p) {
        try {
          p.removeAttribute("disabled");
        } catch {
        }
        try {
          b && b.classList.remove("is-loading");
        } catch {
        }
      }
    }
  })(), m.then((T) => {
    try {
      try {
        S = Array.isArray(T) ? T : null;
      } catch {
        S = null;
      }
      try {
        Gl(T);
      } catch {
      }
      try {
        if (typeof window < "u") {
          try {
            (async () => {
              try {
                const C = await Promise.resolve().then(() => at);
                try {
                  try {
                    C && typeof C._setSearchIndex == "function" && C._setSearchIndex(Array.isArray(T) ? T : []);
                  } catch {
                  }
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
                  window.__nimbiResolvedIndex = Array.isArray(ne) ? ne : Array.isArray(S) ? S : [];
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
            window.__nimbi_indexDepth = c;
          } catch {
          }
          try {
            window.__nimbi_noIndexing = u;
          } catch {
          }
        }
      } catch {
      }
      const $ = String(p && p.value || "").trim().toLowerCase();
      if (!$ || !Array.isArray(T) || !T.length) return;
      const E = T.filter((C) => C.title && C.title.toLowerCase().includes($) || C.excerpt && C.excerpt.toLowerCase().includes($));
      if (!E || !E.length) return;
      const v = typeof _ < "u" && _ ? _ : typeof document < "u" ? document.getElementById("nimbi-search-results") : null;
      if (!v) return;
      try {
        typeof v.replaceChildren == "function" ? v.replaceChildren() : v.innerHTML = "";
      } catch {
        try {
          v.innerHTML = "";
        } catch {
        }
      }
      try {
        const C = document.createElement("div");
        C.className = "panel nimbi-search-panel", E.slice(0, 10).forEach((F) => {
          try {
            if (F.parentTitle) {
              const z = document.createElement("p");
              z.className = "panel-heading nimbi-search-title nimbi-search-parent", z.textContent = F.parentTitle, C.appendChild(z);
            }
            const V = document.createElement("a");
            V.className = "panel-block nimbi-search-result";
            const B = Q(F);
            V.href = $e(B.page, B.hash), V.setAttribute("role", "button");
            try {
              if (F.path && typeof F.path == "string")
                try {
                  Jt(B.page, F.path);
                } catch {
                }
            } catch {
            }
            const P = document.createElement("div");
            P.className = "is-size-6 has-text-weight-semibold", P.textContent = F.title, V.appendChild(P), V.addEventListener("click", () => {
              try {
                v.style.display = "none";
              } catch {
              }
            }), C.appendChild(V);
          } catch {
          }
        }), Di(() => {
          try {
            v.appendChild(C);
          } catch {
          }
        });
        try {
          v.style.display = "block";
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
        if (A) return;
        A = !0;
        const T = await Promise.resolve().then(() => An);
        try {
          await T.handleSitemapRequest({ homePage: r, contentBase: i, indexDepth: c, noIndexing: u, includeAllMarkdown: !0 });
        } catch ($) {
          k("[nimbi-cms] sitemap trigger failed", $);
        }
      } catch (T) {
        try {
          k("[nimbi-cms] sitemap dynamic import failed", T);
        } catch {
        }
      }
    })();
  }), m), O = document.createElement("nav");
  O.className = "navbar", O.setAttribute("role", "navigation"), O.setAttribute("aria-label", "main navigation");
  const G = document.createElement("div");
  G.className = "navbar-brand";
  const re = g[0], D = document.createElement("a");
  if (D.className = "navbar-item", re) {
    const T = re.getAttribute("href") || "#";
    try {
      const E = new URL(T, location.href).searchParams.get("page"), v = E ? decodeURIComponent(E) : r;
      let C = null;
      try {
        typeof v == "string" && (/(?:\.md|\.html?)$/i.test(v) || v.includes("/")) && (C = W(v));
      } catch {
      }
      !C && typeof v == "string" && !String(v).includes(".") && (C = v);
      const F = C || v;
      D.href = $e(F), (!D.textContent || !String(D.textContent).trim()) && (D.textContent = a("home"));
    } catch {
      try {
        const E = typeof r == "string" && (/(?:\.md|\.html?)$/i.test(r) || r.includes("/")) ? W(r) : typeof r == "string" && !r.includes(".") ? r : null;
        D.href = $e(E || r);
      } catch {
        D.href = $e(r);
      }
      D.textContent = a("home");
    }
  } else
    D.href = $e(r), D.textContent = a("home");
  async function L(T) {
    try {
      if (!T || T === "none") return null;
      if (T === "favicon")
        try {
          const $ = document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');
          if (!$) return null;
          const E = $.getAttribute("href") || "";
          return E && /\.png(?:\?|$)/i.test(E) ? new URL(E, location.href).toString() : null;
        } catch {
          return null;
        }
      if (T === "copy-first" || T === "move-first")
        try {
          const $ = await Be(r, i);
          if (!$ || !$.raw) return null;
          const E = He(), v = E ? E.parseFromString($.raw, "text/html") : null, C = v ? v.querySelector("img") : null;
          if (!C) return null;
          const F = C.getAttribute("src") || "";
          if (!F) return null;
          const V = new URL(F, location.href).toString();
          if (T === "move-first")
            try {
              document.documentElement.setAttribute("data-nimbi-logo-moved", V);
            } catch {
            }
          return V;
        } catch {
          return null;
        }
      try {
        return new URL(T, location.href).toString();
      } catch {
        return null;
      }
    } catch {
      return null;
    }
  }
  let H = null;
  try {
    H = await L(d);
  } catch {
    H = null;
  }
  if (H)
    try {
      const T = document.createElement("img");
      T.className = "nimbi-navbar-logo";
      const $ = a && typeof a == "function" && (a("home") || a("siteLogo")) || "";
      T.alt = $, T.title = $, T.src = H;
      try {
        T.style.marginRight = "0.5em";
      } catch {
      }
      try {
        (!D.textContent || !String(D.textContent).trim()) && (D.textContent = $);
      } catch {
      }
      try {
        D.insertBefore(T, D.firstChild);
      } catch {
        try {
          D.appendChild(T);
        } catch {
        }
      }
    } catch {
    }
  G.appendChild(D), D.addEventListener("click", function(T) {
    const $ = D.getAttribute("href") || "";
    if ($.startsWith("?page=")) {
      T.preventDefault();
      const E = new URL($, location.href), v = E.searchParams.get("page"), C = E.hash ? E.hash.replace(/^#/, "") : null;
      history.pushState({ page: v }, "", $e(v, C)), q();
      try {
        I();
      } catch {
      }
    }
  });
  function W(T) {
    try {
      if (!T) return null;
      const $ = Y(String(T || ""));
      try {
        if (U && U.has($)) return U.get($);
      } catch {
      }
      const E = $.replace(/^.*\//, "");
      try {
        if (U && U.has(E)) return U.get(E);
      } catch {
      }
      try {
        for (const [v, C] of K.entries())
          if (C) {
            if (typeof C == "string") {
              if (Y(C) === $) return v;
            } else if (C && typeof C == "object") {
              if (C.default && Y(C.default) === $) return v;
              const F = C.langs || {};
              for (const V in F)
                if (F[V] && Y(F[V]) === $) return v;
            }
          }
      } catch {
      }
      return null;
    } catch {
      return null;
    }
  }
  async function ie(T, $) {
    try {
      if (!T || !T.length) return;
      const E = [];
      for (let B = 0; B < T.length; B++)
        try {
          const P = T[B];
          if (!P || typeof P.getAttribute != "function") continue;
          const z = P.getAttribute("href") || "";
          if (!z || Rr(z)) continue;
          let j = null;
          try {
            const Se = it(z);
            Se && Se.page && (j = Se.page);
          } catch {
          }
          if (!j) {
            const Se = String(z || "").split(/[?#]/, 1), Te = Se && Se[0] ? Se[0] : z;
            (/\.(?:md|html?)$/i.test(Te) || Te.indexOf("/") !== -1) && (j = Y(String(Te || "")));
          }
          if (!j) continue;
          const Z = Y(String(j || "")), se = Z.replace(/^.*\//, "");
          let ge = null;
          try {
            M && M.has(Z) && (ge = M.get(Z));
          } catch {
          }
          try {
            !ge && U && U.has(Z) && (ge = U.get(Z));
          } catch {
          }
          if (ge) continue;
          let be = null;
          try {
            be = P.textContent && String(P.textContent).trim() ? String(P.textContent).trim() : null;
          } catch {
            be = null;
          }
          let pe = null;
          if (be) pe = he(be);
          else {
            const Se = se.replace(/\.(?:md|html?)$/i, "");
            pe = he(Se || Z);
          }
          if (pe)
            try {
              E.push({ path: Z, candidate: pe });
            } catch {
            }
        } catch {
        }
      if (!E.length) return;
      const v = 3;
      let C = 0;
      const F = async () => {
        for (; C < E.length; ) {
          const B = E[C++];
          if (!(!B || !B.path))
            try {
              const P = await Be(B.path, $);
              if (!P || !P.raw) continue;
              let z = null;
              if (P.isHtml)
                try {
                  const j = He(), Z = j ? j.parseFromString(P.raw, "text/html") : null, se = Z ? Z.querySelector("h1") || Z.querySelector("title") : null;
                  se && se.textContent && (z = String(se.textContent).trim());
                } catch {
                }
              else
                try {
                  const j = P.raw.match(/^#\s+(.+)$/m);
                  j && j[1] && (z = String(j[1]).trim());
                } catch {
                }
              if (z) {
                const j = he(z);
                if (j && j !== B.candidate) {
                  try {
                    Jt(j, B.path);
                  } catch {
                  }
                  try {
                    M.set(B.path, j);
                  } catch {
                  }
                  try {
                    M.set(B.path.replace(/^.*\//, ""), j);
                  } catch {
                  }
                  try {
                    const Z = await Promise.resolve().then(() => at);
                    try {
                      if (Array.isArray(Z.searchIndex)) {
                        let se = !1;
                        for (const ge of Z.searchIndex)
                          try {
                            if (ge && ge.path === B.path && ge.slug) {
                              const pe = String(ge.slug).split("::").slice(1).join("::");
                              ge.slug = pe ? `${j}::${pe}` : j, se = !0;
                            }
                          } catch {
                          }
                        try {
                          se && typeof Z._setSearchIndex == "function" && Z._setSearchIndex(Z.searchIndex);
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
      }, V = [];
      for (let B = 0; B < v; B++) V.push(F());
      try {
        await Promise.all(V);
      } catch {
      }
    } catch {
    }
  }
  const ye = document.createElement("a");
  ye.className = "navbar-burger", ye.setAttribute("role", "button"), ye.setAttribute("aria-label", "menu"), ye.setAttribute("aria-expanded", "false");
  const ee = "nimbi-navbar-menu";
  ye.dataset.target = ee, ye.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>', G.appendChild(ye);
  try {
    ye.addEventListener("click", (T) => {
      try {
        const $ = ye.dataset && ye.dataset.target ? ye.dataset.target : null, E = $ ? O && O.querySelector ? O.querySelector(`#${$}`) || (e && e.querySelector ? e.querySelector(`#${$}`) : document.getElementById($)) : e && e.querySelector ? e.querySelector(`#${$}`) || document.getElementById($) : typeof document < "u" ? document.getElementById($) : null : null;
        ye.classList.contains("is-active") ? (ye.classList.remove("is-active"), ye.setAttribute("aria-expanded", "false"), E && E.classList.remove("is-active")) : (ye.classList.add("is-active"), ye.setAttribute("aria-expanded", "true"), E && E.classList.add("is-active"));
      } catch ($) {
        k("[nimbi-cms] navbar burger toggle failed", $);
      }
    });
  } catch (T) {
    k("[nimbi-cms] burger event binding failed", T);
  }
  const Pe = document.createElement("div");
  Pe.className = "navbar-menu", Pe.id = ee;
  const ke = document.createElement("div");
  ke.className = "navbar-start";
  let xe = null, Ee = null;
  if (!o)
    xe = null, p = null, y = null, _ = null, w = null;
  else {
    xe = document.createElement("div"), xe.className = "navbar-end", Ee = document.createElement("div"), Ee.className = "navbar-item", p = document.createElement("input"), p.className = "input", p.type = "search", p.placeholder = a("searchPlaceholder") || "", p.id = "nimbi-search";
    try {
      const v = (a && typeof a == "function" ? a("searchAria") : null) || p.placeholder || "Search";
      try {
        p.setAttribute("aria-label", v);
      } catch {
      }
      try {
        p.setAttribute("aria-controls", "nimbi-search-results");
      } catch {
      }
      try {
        p.setAttribute("aria-autocomplete", "list");
      } catch {
      }
      try {
        p.setAttribute("role", "combobox");
      } catch {
      }
    } catch {
    }
    l === "eager" && (p.disabled = !0), b = document.createElement("div"), b.className = "control", l === "eager" && b.classList.add("is-loading"), b.appendChild(p), Ee.appendChild(b), y = document.createElement("div"), y.className = "dropdown is-right", y.id = "nimbi-search-dropdown";
    const T = document.createElement("div");
    T.className = "dropdown-trigger", T.appendChild(Ee);
    const $ = document.createElement("div");
    $.className = "dropdown-menu", $.setAttribute("role", "menu"), _ = document.createElement("div"), _.id = "nimbi-search-results", _.className = "dropdown-content nimbi-search-results", w = _, $.appendChild(_), y.appendChild(T), y.appendChild($), xe.appendChild(y);
    const E = (v) => {
      if (!_) return;
      try {
        if (typeof _.replaceChildren == "function") _.replaceChildren();
        else
          for (; _.firstChild; ) _.removeChild(_.firstChild);
      } catch {
        try {
          _.innerHTML = "";
        } catch {
        }
      }
      let C = -1;
      function F(P) {
        try {
          const z = _.querySelector(".nimbi-search-result.is-selected");
          z && z.classList.remove("is-selected");
          const j = _.querySelectorAll(".nimbi-search-result");
          if (!j || !j.length) return;
          if (P < 0) {
            C = -1;
            return;
          }
          P >= j.length && (P = j.length - 1);
          const Z = j[P];
          if (Z) {
            Z.classList.add("is-selected"), C = P;
            try {
              Z.scrollIntoView({ block: "nearest" });
            } catch {
            }
          }
        } catch {
        }
      }
      function V(P) {
        try {
          const z = P.key, j = _.querySelectorAll(".nimbi-search-result");
          if (!j || !j.length) return;
          if (z === "ArrowDown") {
            P.preventDefault();
            const Z = C < 0 ? 0 : Math.min(j.length - 1, C + 1);
            F(Z);
            return;
          }
          if (z === "ArrowUp") {
            P.preventDefault();
            const Z = C <= 0 ? 0 : C - 1;
            F(Z);
            return;
          }
          if (z === "Enter") {
            P.preventDefault();
            const Z = _.querySelector(".nimbi-search-result.is-selected") || _.querySelector(".nimbi-search-result");
            if (Z)
              try {
                Z.click();
              } catch {
              }
            return;
          }
          if (z === "Escape") {
            try {
              y.classList.remove("is-active");
            } catch {
            }
            try {
              document.documentElement.classList.remove("nimbi-search-open");
            } catch {
            }
            try {
              _.style.display = "none";
            } catch {
            }
            try {
              _.classList.remove("is-open");
            } catch {
            }
            try {
              _.removeAttribute("tabindex");
            } catch {
            }
            try {
              _.removeEventListener("keydown", V);
            } catch {
            }
            try {
              p && p.focus();
            } catch {
            }
            try {
              p && p.removeEventListener("keydown", B);
            } catch {
            }
            return;
          }
        } catch {
        }
      }
      function B(P) {
        try {
          if (P && P.key === "ArrowDown") {
            P.preventDefault();
            try {
              _.focus();
            } catch {
            }
            F(0);
          }
        } catch {
        }
      }
      try {
        const P = document.createElement("div");
        P.className = "panel nimbi-search-panel";
        const z = document.createDocumentFragment();
        v.forEach((j) => {
          if (j.parentTitle) {
            const be = document.createElement("p");
            be.textContent = j.parentTitle, be.className = "panel-heading nimbi-search-title nimbi-search-parent", z.appendChild(be);
          }
          const Z = document.createElement("a");
          Z.className = "panel-block nimbi-search-result";
          const se = Q(j);
          Z.href = $e(se.page, se.hash), Z.setAttribute("role", "button");
          try {
            if (j.path && typeof j.path == "string")
              try {
                Jt(se.page, j.path);
              } catch {
              }
          } catch {
          }
          const ge = document.createElement("div");
          ge.className = "is-size-6 has-text-weight-semibold", ge.textContent = j.title, Z.appendChild(ge), Z.addEventListener("click", (be) => {
            try {
              try {
                be && be.preventDefault && be.preventDefault();
              } catch {
              }
              try {
                be && be.stopPropagation && be.stopPropagation();
              } catch {
              }
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
              try {
                _.removeAttribute("tabindex");
              } catch {
              }
              try {
                _.removeEventListener("keydown", V);
              } catch {
              }
              try {
                p && p.removeEventListener("keydown", B);
              } catch {
              }
              try {
                const pe = Z.getAttribute && Z.getAttribute("href") || "";
                let Se = null, Te = null;
                try {
                  const Fe = new URL(pe, location.href);
                  Se = Fe.searchParams.get("page"), Te = Fe.hash ? Fe.hash.replace(/^#/, "") : null;
                } catch {
                }
                if (Se)
                  try {
                    history.pushState({ page: Se }, "", $e(Se, Te));
                    try {
                      q();
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
                window.location.href = Z.href;
              } catch {
              }
            } catch {
            }
          }), z.appendChild(Z);
        }), P.appendChild(z), Di(() => {
          try {
            _.appendChild(P);
          } catch {
          }
        });
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
        _.style.display = "block";
      } catch {
      }
      try {
        _.classList.add("is-open");
      } catch {
      }
      try {
        _.setAttribute("tabindex", "0");
      } catch {
      }
      try {
        _.addEventListener("keydown", V);
      } catch {
      }
      try {
        p && p.addEventListener("keydown", B);
      } catch {
      }
    };
    if (p) {
      const v = Al(async () => {
        const C = p || (typeof O < "u" && O && O.querySelector ? O.querySelector("input#nimbi-search") : e && e.querySelector ? e.querySelector("input#nimbi-search") : typeof document < "u" ? document.querySelector("input#nimbi-search") : null), F = String(C && C.value || "").trim().toLowerCase();
        if (!F) {
          E([]);
          return;
        }
        try {
          await R();
          const V = await m, B = Array.isArray(V) ? V.filter((P) => P.title && P.title.toLowerCase().includes(F) || P.excerpt && P.excerpt.toLowerCase().includes(F)) : [];
          E(B.slice(0, 10));
        } catch (V) {
          k("[nimbi-cms] search input handler failed", V), E([]);
        }
      }, 50);
      try {
        p.addEventListener("input", v);
      } catch {
      }
      try {
        document.addEventListener("input", (C) => {
          try {
            C && C.target && C.target.id === "nimbi-search" && v(C);
          } catch {
          }
        }, !0);
      } catch {
      }
    }
    if (l === "eager") {
      try {
        m = R();
      } catch (v) {
        k("[nimbi-cms] eager search index init failed", v), m = Promise.resolve([]);
      }
      m.finally(() => {
        const v = p || (typeof O < "u" && O && O.querySelector ? O.querySelector("input#nimbi-search") : e && e.querySelector ? e.querySelector("input#nimbi-search") : typeof document < "u" ? document.querySelector("input#nimbi-search") : null);
        if (v) {
          try {
            v.removeAttribute("disabled");
          } catch {
          }
          try {
            b && b.classList.remove("is-loading");
          } catch {
          }
        }
        (async () => {
          try {
            if (A) return;
            A = !0;
            const C = await m.catch(() => []), F = await Promise.resolve().then(() => An);
            try {
              await F.handleSitemapRequest({ index: Array.isArray(C) ? C : void 0, homePage: r, contentBase: i, indexDepth: c, noIndexing: u, includeAllMarkdown: !0 });
            } catch (V) {
              k("[nimbi-cms] sitemap trigger failed", V);
            }
          } catch (C) {
            try {
              k("[nimbi-cms] sitemap dynamic import failed", C);
            } catch {
            }
          }
        })();
      });
    }
    try {
      const v = (C) => {
        try {
          const F = C && C.target;
          if (!w || !w.classList.contains("is-open") && w.style && w.style.display !== "block" || F && (w.contains(F) || p && (F === p || p.contains && p.contains(F)))) return;
          if (y) {
            y.classList.remove("is-active");
            try {
              document.documentElement.classList.remove("nimbi-search-open");
            } catch {
            }
          }
          try {
            w.style.display = "none";
          } catch {
          }
          try {
            w.classList.remove("is-open");
          } catch {
          }
        } catch {
        }
      };
      document.addEventListener("click", v, !0), document.addEventListener("touchstart", v, !0);
    } catch {
    }
  }
  const qe = document.createDocumentFragment();
  for (let T = 0; T < g.length; T++) {
    const $ = g[T];
    if (T === 0) continue;
    const E = $.getAttribute("href") || "#";
    let v = E;
    const C = document.createElement("a");
    C.className = "navbar-item";
    try {
      let F = null;
      try {
        F = it(String(E || ""));
      } catch {
        F = null;
      }
      let V = null, B = null;
      if (F && (F.type === "canonical" && F.page || F.type === "cosmetic" && F.page) && (V = F.page, B = F.anchor), V && (/\.(?:md|html?)$/i.test(V) || V.includes("/") ? v = V : C.href = $e(V, B)), /^[^#]*\.md(?:$|[#?])/.test(v) || v.endsWith(".md")) {
        const z = Y(v).split(/::|#/, 2), j = z[0], Z = z[1], se = W(j);
        se ? C.href = $e(se, Z) : C.href = $e(j, Z);
      } else if (/\.html(?:$|[#?])/.test(v) || v.endsWith(".html")) {
        const z = Y(v).split(/::|#/, 2);
        let j = z[0];
        j && !j.toLowerCase().endsWith(".html") && (j = j + ".html");
        const Z = z[1], se = W(j);
        if (se)
          C.href = $e(se, Z);
        else
          try {
            const ge = await Be(j, i);
            if (ge && ge.raw)
              try {
                const be = He(), pe = be ? be.parseFromString(ge.raw, "text/html") : null, Se = pe ? pe.querySelector("title") : null, Te = pe ? pe.querySelector("h1") : null, Fe = Se && Se.textContent && Se.textContent.trim() ? Se.textContent.trim() : Te && Te.textContent ? Te.textContent.trim() : null;
                if (Fe) {
                  const Ge = he(Fe);
                  if (Ge) {
                    try {
                      Jt(Ge, j);
                    } catch (At) {
                      k("[nimbi-cms] slugToMd/mdToSlug set failed", At);
                    }
                    C.href = $e(Ge, Z);
                  } else
                    C.href = $e(j, Z);
                } else
                  C.href = $e(j, Z);
              } catch {
                C.href = $e(j, Z);
              }
            else
              C.href = v;
          } catch {
            C.href = v;
          }
      } else
        C.href = v;
    } catch (F) {
      k("[nimbi-cms] nav item href parse failed", F), C.href = v;
    }
    try {
      const F = $.textContent && String($.textContent).trim() ? String($.textContent).trim() : null;
      if (F)
        try {
          const V = he(F);
          if (V) {
            const B = C.getAttribute("href") || "";
            let P = null;
            if (/^[^#?]*\.(?:md|html?)(?:$|[?#])/i.test(B))
              P = Y(String(B || "").split(/[?#]/)[0]);
            else
              try {
                const z = it(B);
                z && z.type === "canonical" && z.page && (P = Y(z.page));
              } catch {
              }
            if (P) {
              let z = !1;
              try {
                if (/\.(?:html?)(?:$|[?#])/i.test(String(P || "")))
                  z = !0;
                else if (/\.(?:md)(?:$|[?#])/i.test(String(P || "")))
                  z = !1;
                else {
                  const j = String(P || "").replace(/^\.\//, ""), Z = j.replace(/^.*\//, "");
                  ze && ze.size && (ze.has(j) || ze.has(Z)) && (z = !0);
                }
              } catch {
                z = !1;
              }
              if (z)
                try {
                  const j = Y(String(P || "").split(/[?#]/)[0]);
                  let Z = !1;
                  try {
                    W && typeof W == "function" && W(j) && (Z = !0);
                  } catch {
                  }
                  try {
                    Jt(V, P);
                  } catch {
                  }
                  try {
                    if (j) {
                      try {
                        M.set(j, V);
                      } catch {
                      }
                      try {
                        const se = j.replace(/^.*\//, "");
                        se && M.set(se, V);
                      } catch {
                      }
                    }
                  } catch {
                  }
                  if (Z)
                    try {
                      C.href = $e(V);
                    } catch {
                    }
                } catch {
                }
            }
          }
        } catch (V) {
          k("[nimbi-cms] nav slug mapping failed", V);
        }
    } catch (F) {
      k("[nimbi-cms] nav slug mapping failed", F);
    }
    C.textContent = $.textContent || v, qe.appendChild(C);
  }
  try {
    ke.appendChild(qe);
  } catch {
  }
  Pe.appendChild(ke), xe && Pe.appendChild(xe), O.appendChild(G), O.appendChild(Pe), e.appendChild(O);
  try {
    const T = ($) => {
      try {
        const E = typeof O < "u" && O && O.querySelector ? O.querySelector(".navbar-burger") : e && e.querySelector ? e.querySelector(".navbar-burger") : typeof document < "u" ? document.querySelector(".navbar-burger") : null;
        if (!E || !E.classList.contains("is-active")) return;
        const v = E && E.closest ? E.closest(".navbar") : O;
        if (v && v.contains($.target)) return;
        I();
      } catch {
      }
    };
    document.addEventListener("click", T, !0), document.addEventListener("touchstart", T, !0);
  } catch {
  }
  try {
    Pe.addEventListener("click", (T) => {
      const $ = T.target && T.target.closest ? T.target.closest("a") : null;
      if (!$) return;
      const E = $.getAttribute("href") || "";
      try {
        const v = new URL(E, location.href), C = v.searchParams.get("page"), F = v.hash ? v.hash.replace(/^#/, "") : null;
        C && (T.preventDefault(), history.pushState({ page: C }, "", $e(C, F)), q());
      } catch (v) {
        k("[nimbi-cms] navbar click handler failed", v);
      }
      try {
        const v = typeof O < "u" && O && O.querySelector ? O.querySelector(".navbar-burger") : e && e.querySelector ? e.querySelector(".navbar-burger") : null, C = v && v.dataset ? v.dataset.target : null, F = C ? O && O.querySelector ? O.querySelector(`#${C}`) || (e && e.querySelector ? e.querySelector(`#${C}`) : document.getElementById(C)) : e && e.querySelector ? e.querySelector(`#${C}`) || document.getElementById(C) : typeof document < "u" ? document.getElementById(C) : null : null;
        v && v.classList.contains("is-active") && (v.classList.remove("is-active"), v.setAttribute("aria-expanded", "false"), F && F.classList.remove("is-active"));
      } catch (v) {
        k("[nimbi-cms] mobile menu close failed", v);
      }
    });
  } catch (T) {
    k("[nimbi-cms] attach content click handler failed", T);
  }
  try {
    t.addEventListener("click", (T) => {
      const $ = T.target && T.target.closest ? T.target.closest("a") : null;
      if (!$) return;
      const E = $.getAttribute("href") || "";
      if (E && !Rr(E))
        try {
          const v = new URL(E, location.href), C = v.searchParams.get("page"), F = v.hash ? v.hash.replace(/^#/, "") : null;
          C && (T.preventDefault(), history.pushState({ page: C }, "", $e(C, F)), q());
        } catch (v) {
          k("[nimbi-cms] container click URL parse failed", v);
        }
    });
  } catch (T) {
    k("[nimbi-cms] build navbar failed", T);
  }
  return { navbar: O, linkEls: g };
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
let tt = null, de = null, Qe = 1, xt = (e, t) => t, xn = 0, Sn = 0, Kn = () => {
}, gn = 0.25;
function Ql() {
  if (tt && document.contains(tt)) return tt;
  tt = null;
  const e = document.createElement("dialog");
  e.className = "nimbi-image-preview modal", e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), e.setAttribute("aria-label", xt("imagePreviewTitle", "Image preview"));
  try {
    const L = document.createElement("div");
    L.className = "modal-background";
    const H = document.createElement("div");
    H.className = "modal-content";
    const W = document.createElement("div");
    W.className = "nimbi-image-preview__content box", W.setAttribute("role", "document");
    const ie = document.createElement("button");
    ie.className = "button is-small nimbi-image-preview__close", ie.type = "button", ie.setAttribute("data-nimbi-preview-close", ""), ie.textContent = "✕";
    const ye = document.createElement("div");
    ye.className = "nimbi-image-preview__image-wrapper";
    const ee = document.createElement("img");
    ee.setAttribute("data-nimbi-preview-image", ""), ee.alt = "", ye.appendChild(ee);
    const Pe = document.createElement("div");
    Pe.className = "nimbi-image-preview__controls";
    const ke = document.createElement("div");
    ke.className = "nimbi-image-preview__group";
    const xe = document.createElement("button");
    xe.className = "button is-small", xe.type = "button", xe.setAttribute("data-nimbi-preview-fit", ""), xe.textContent = "⤢";
    const Ee = document.createElement("button");
    Ee.className = "button is-small", Ee.type = "button", Ee.setAttribute("data-nimbi-preview-original", ""), Ee.textContent = "1:1";
    const qe = document.createElement("button");
    qe.className = "button is-small", qe.type = "button", qe.setAttribute("data-nimbi-preview-reset", ""), qe.textContent = "⟲", ke.appendChild(xe), ke.appendChild(Ee), ke.appendChild(qe);
    const T = document.createElement("div");
    T.className = "nimbi-image-preview__group";
    const $ = document.createElement("button");
    $.className = "button is-small", $.type = "button", $.setAttribute("data-nimbi-preview-zoom-out", ""), $.textContent = "−";
    const E = document.createElement("div");
    E.className = "nimbi-image-preview__zoom", E.setAttribute("data-nimbi-preview-zoom-label", ""), E.textContent = "100%";
    const v = document.createElement("button");
    v.className = "button is-small", v.type = "button", v.setAttribute("data-nimbi-preview-zoom-in", ""), v.textContent = "＋", T.appendChild($), T.appendChild(E), T.appendChild(v), Pe.appendChild(ke), Pe.appendChild(T), W.appendChild(ie), W.appendChild(ye), W.appendChild(Pe), H.appendChild(W), e.appendChild(L), e.appendChild(H);
  } catch {
    e.innerHTML = `
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
    `;
  }
  e.addEventListener("click", (L) => {
    L.target === e && Mr();
  }), e.addEventListener("wheel", (L) => {
    if (!Q()) return;
    L.preventDefault();
    const H = L.deltaY < 0 ? gn : -gn;
    Mt(Qe + H), c(), u();
  }, { passive: !1 }), e.addEventListener("keydown", (L) => {
    if (L.key === "Escape") {
      Mr();
      return;
    }
    if (Qe > 1) {
      const H = e.querySelector(".nimbi-image-preview__image-wrapper");
      if (!H) return;
      const W = 40;
      switch (L.key) {
        case "ArrowUp":
          H.scrollTop -= W, L.preventDefault();
          break;
        case "ArrowDown":
          H.scrollTop += W, L.preventDefault();
          break;
        case "ArrowLeft":
          H.scrollLeft -= W, L.preventDefault();
          break;
        case "ArrowRight":
          H.scrollLeft += W, L.preventDefault();
          break;
      }
    }
  }), document.body.appendChild(e), tt = e, de = e.querySelector("[data-nimbi-preview-image]");
  const t = e.querySelector("[data-nimbi-preview-fit]"), n = e.querySelector("[data-nimbi-preview-original]"), i = e.querySelector("[data-nimbi-preview-zoom-in]"), r = e.querySelector("[data-nimbi-preview-zoom-out]"), a = e.querySelector("[data-nimbi-preview-reset]"), s = e.querySelector("[data-nimbi-preview-close]"), o = e.querySelector("[data-nimbi-preview-zoom-label]"), l = e.querySelector("[data-nimbi-preview-zoom-hud]");
  function c() {
    o && (o.textContent = `${Math.round(Qe * 100)}%`);
  }
  const u = () => {
    l && (l.textContent = `${Math.round(Qe * 100)}%`, l.classList.add("visible"), clearTimeout(l._timeout), l._timeout = setTimeout(() => l.classList.remove("visible"), 800));
  };
  Kn = c, i.addEventListener("click", () => {
    Mt(Qe + gn), c(), u();
  }), r.addEventListener("click", () => {
    Mt(Qe - gn), c(), u();
  }), t.addEventListener("click", () => {
    vn(), c(), u();
  }), n.addEventListener("click", () => {
    Mt(1), c(), u();
  }), a.addEventListener("click", () => {
    vn(), c(), u();
  }), s.addEventListener("click", Mr), t.title = xt("imagePreviewFit", "Fit to screen"), n.title = xt("imagePreviewOriginal", "Original size"), r.title = xt("imagePreviewZoomOut", "Zoom out"), i.title = xt("imagePreviewZoomIn", "Zoom in"), s.title = xt("imagePreviewClose", "Close"), s.setAttribute("aria-label", xt("imagePreviewClose", "Close"));
  let d = !1, h = 0, f = 0, g = 0, m = 0;
  const p = /* @__PURE__ */ new Map();
  let b = 0, y = 1;
  const _ = (L, H) => {
    const W = L.x - H.x, ie = L.y - H.y;
    return Math.hypot(W, ie);
  }, w = () => {
    d = !1, p.clear(), b = 0, de && (de.classList.add("is-panning"), de.classList.remove("is-grabbing"));
  };
  let A = 0, S = 0, M = 0;
  const I = (L) => {
    const H = Date.now(), W = H - A, ie = L.clientX - S, ye = L.clientY - M;
    A = H, S = L.clientX, M = L.clientY, W < 300 && Math.hypot(ie, ye) < 30 && (Mt(Qe > 1 ? 1 : 2), c(), L.preventDefault());
  }, q = (L) => {
    Mt(Qe > 1 ? 1 : 2), c(), L.preventDefault();
  }, Q = () => tt ? typeof tt.open == "boolean" ? tt.open : tt.classList.contains("is-active") : !1, R = (L, H, W = 1) => {
    if (p.has(W) && p.set(W, { x: L, y: H }), p.size === 2) {
      const Pe = Array.from(p.values()), ke = _(Pe[0], Pe[1]);
      if (b > 0) {
        const xe = ke / b;
        Mt(y * xe);
      }
      return;
    }
    if (!d) return;
    const ie = de.closest(".nimbi-image-preview__image-wrapper");
    if (!ie) return;
    const ye = L - h, ee = H - f;
    ie.scrollLeft = g - ye, ie.scrollTop = m - ee;
  }, O = (L, H, W = 1) => {
    if (!Q()) return;
    if (p.set(W, { x: L, y: H }), p.size === 2) {
      const ee = Array.from(p.values());
      b = _(ee[0], ee[1]), y = Qe;
      return;
    }
    const ie = de.closest(".nimbi-image-preview__image-wrapper");
    !ie || !(ie.scrollWidth > ie.clientWidth || ie.scrollHeight > ie.clientHeight) || (d = !0, h = L, f = H, g = ie.scrollLeft, m = ie.scrollTop, de.classList.add("is-panning"), de.classList.remove("is-grabbing"), window.addEventListener("pointermove", G), window.addEventListener("pointerup", re), window.addEventListener("pointercancel", re));
  }, G = (L) => {
    d && (L.preventDefault(), R(L.clientX, L.clientY, L.pointerId));
  }, re = () => {
    w(), window.removeEventListener("pointermove", G), window.removeEventListener("pointerup", re), window.removeEventListener("pointercancel", re);
  };
  de.addEventListener("pointerdown", (L) => {
    L.preventDefault(), O(L.clientX, L.clientY, L.pointerId);
  }), de.addEventListener("pointermove", (L) => {
    (d || p.size === 2) && L.preventDefault(), R(L.clientX, L.clientY, L.pointerId);
  }), de.addEventListener("pointerup", (L) => {
    L.preventDefault(), L.pointerType === "touch" && I(L), w();
  }), de.addEventListener("dblclick", q), de.addEventListener("pointercancel", w), de.addEventListener("mousedown", (L) => {
    L.preventDefault(), O(L.clientX, L.clientY, 1);
  }), de.addEventListener("mousemove", (L) => {
    d && L.preventDefault(), R(L.clientX, L.clientY, 1);
  }), de.addEventListener("mouseup", (L) => {
    L.preventDefault(), w();
  });
  const D = e.querySelector(".nimbi-image-preview__image-wrapper");
  return D && (D.addEventListener("pointerdown", (L) => {
    if (O(L.clientX, L.clientY, L.pointerId), L && L.target && L.target.tagName === "IMG")
      try {
        L.target.classList.add("is-grabbing");
      } catch {
      }
  }), D.addEventListener("pointermove", (L) => {
    R(L.clientX, L.clientY, L.pointerId);
  }), D.addEventListener("pointerup", w), D.addEventListener("pointercancel", w), D.addEventListener("mousedown", (L) => {
    if (O(L.clientX, L.clientY, 1), L && L.target && L.target.tagName === "IMG")
      try {
        L.target.classList.add("is-grabbing");
      } catch {
      }
  }), D.addEventListener("mousemove", (L) => {
    R(L.clientX, L.clientY, 1);
  }), D.addEventListener("mouseup", w)), e;
}
function Mt(e) {
  if (!de) return;
  const t = Number(e);
  Qe = Number.isFinite(t) ? Math.max(0.1, Math.min(4, t)) : 1;
  const i = de.getBoundingClientRect(), r = xn || de.naturalWidth || de.width || i.width || 0, a = Sn || de.naturalHeight || de.height || i.height || 0;
  if (r && a) {
    de.style.setProperty("--nimbi-preview-img-max-width", "none"), de.style.setProperty("--nimbi-preview-img-max-height", "none"), de.style.setProperty("--nimbi-preview-img-width", `${r * Qe}px`), de.style.setProperty("--nimbi-preview-img-height", `${a * Qe}px`), de.style.setProperty("--nimbi-preview-img-transform", "none");
    try {
      de.style.width = `${r * Qe}px`, de.style.height = `${a * Qe}px`, de.style.transform = "none";
    } catch {
    }
  } else {
    de.style.setProperty("--nimbi-preview-img-max-width", ""), de.style.setProperty("--nimbi-preview-img-max-height", ""), de.style.setProperty("--nimbi-preview-img-width", ""), de.style.setProperty("--nimbi-preview-img-height", ""), de.style.setProperty("--nimbi-preview-img-transform", `scale(${Qe})`);
    try {
      de.style.transform = `scale(${Qe})`;
    } catch {
    }
  }
  de && (de.classList.add("is-panning"), de.classList.remove("is-grabbing"));
}
function vn() {
  if (!de) return;
  const e = de.closest(".nimbi-image-preview__image-wrapper");
  if (!e) return;
  const t = e.getBoundingClientRect();
  if (t.width === 0 || t.height === 0) return;
  const n = xn || de.naturalWidth || t.width, i = Sn || de.naturalHeight || t.height;
  if (!n || !i) return;
  const r = t.width / n, a = t.height / i, s = Math.min(r, a, 1);
  Mt(Number.isFinite(s) ? s : 1);
}
function Kl(e, t = "", n = 0, i = 0) {
  const r = Ql();
  Qe = 1, xn = n || 0, Sn = i || 0, de.src = e;
  try {
    if (!t)
      try {
        const o = new URL(e, typeof location < "u" ? location.href : "").pathname || "", c = (o.substring(o.lastIndexOf("/") + 1) || e).replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
        t = xt("imagePreviewDefaultAlt", c || "Image");
      } catch {
        t = xt("imagePreviewDefaultAlt", "Image");
      }
  } catch {
  }
  de.alt = t, de.style.transform = "scale(1)";
  const a = () => {
    xn = de.naturalWidth || de.width || 0, Sn = de.naturalHeight || de.height || 0;
  };
  if (a(), vn(), Kn(), requestAnimationFrame(() => {
    vn(), Kn();
  }), !xn || !Sn) {
    const s = () => {
      a(), requestAnimationFrame(() => {
        vn(), Kn();
      }), de.removeEventListener("load", s);
    };
    de.addEventListener("load", s);
  }
  typeof r.showModal == "function" && (r.open || r.showModal()), r.classList.add("is-active");
  try {
    document.documentElement.classList.add("nimbi-image-preview-open");
  } catch {
  }
  r.focus();
}
function Mr() {
  if (tt) {
    typeof tt.close == "function" && tt.open && tt.close(), tt.classList.remove("is-active");
    try {
      document.documentElement.classList.remove("nimbi-image-preview-open");
    } catch {
    }
  }
}
function Yl(e, { t, zoomStep: n = 0.25 } = {}) {
  if (!e || !e.querySelectorAll) return;
  xt = (f, g) => (typeof t == "function" ? t(f) : void 0) || g, gn = n, e.addEventListener("click", (f) => {
    const g = (
      /** @type {HTMLElement} */
      f.target
    );
    if (!g || g.tagName !== "IMG") return;
    const m = (
      /** @type {HTMLImageElement} */
      g
    );
    if (!m.src) return;
    const p = m.closest("a");
    p && p.getAttribute("href") || Kl(m.src, m.alt || "", m.naturalWidth || 0, m.naturalHeight || 0);
  });
  let i = !1, r = 0, a = 0, s = 0, o = 0;
  const l = /* @__PURE__ */ new Map();
  let c = 0, u = 1;
  const d = (f, g) => {
    const m = f.x - g.x, p = f.y - g.y;
    return Math.hypot(m, p);
  };
  e.addEventListener("pointerdown", (f) => {
    const g = (
      /** @type {HTMLElement} */
      f.target
    );
    if (!g || g.tagName !== "IMG") return;
    const m = g.closest("a");
    if (m && m.getAttribute("href") || !tt || !tt.open) return;
    if (l.set(f.pointerId, { x: f.clientX, y: f.clientY }), l.size === 2) {
      const b = Array.from(l.values());
      c = d(b[0], b[1]), u = Qe;
      return;
    }
    const p = g.closest(".nimbi-image-preview__image-wrapper");
    if (p && !(Qe <= 1)) {
      f.preventDefault(), i = !0, r = f.clientX, a = f.clientY, s = p.scrollLeft, o = p.scrollTop, g.setPointerCapture(f.pointerId);
      try {
        g.classList.add("is-grabbing");
      } catch {
      }
    }
  }), e.addEventListener("pointermove", (f) => {
    if (l.has(f.pointerId) && l.set(f.pointerId, { x: f.clientX, y: f.clientY }), l.size === 2) {
      f.preventDefault();
      const _ = Array.from(l.values()), w = d(_[0], _[1]);
      if (c > 0) {
        const A = w / c;
        Mt(u * A);
      }
      return;
    }
    if (!i) return;
    f.preventDefault();
    const g = (
      /** @type {HTMLElement} */
      f.target
    ), m = g.closest && g.closest("a");
    if (m && m.getAttribute && m.getAttribute("href")) return;
    const p = g.closest(".nimbi-image-preview__image-wrapper");
    if (!p) return;
    const b = f.clientX - r, y = f.clientY - a;
    p.scrollLeft = s - b, p.scrollTop = o - y;
  });
  const h = () => {
    i = !1, l.clear(), c = 0;
    try {
      const f = document.querySelector("[data-nimbi-preview-image]");
      f && (f.classList.add("is-panning"), f.classList.remove("is-grabbing"));
    } catch {
    }
  };
  e.addEventListener("pointerup", h), e.addEventListener("pointercancel", h);
}
function Vl(e) {
  const {
    contentWrap: t,
    navWrap: n,
    container: i,
    mountOverlay: r = null,
    t: a,
    contentBase: s,
    homePage: o,
    initialDocumentTitle: l,
    runHooks: c
  } = e || {};
  if (!t || !(t instanceof HTMLElement))
    throw new TypeError("contentWrap must be an HTMLElement");
  let u = null;
  const d = zl(a, [{ path: o, name: a("home"), isIndex: !0, children: [] }]);
  let h = !1, f = !1;
  function g(w) {
    try {
      if (!w) return;
      if (typeof w.replaceChildren == "function") return w.replaceChildren();
      for (; w.firstChild; ) w.removeChild(w.firstChild);
    } catch {
      try {
        w && (w.innerHTML = "");
      } catch {
      }
    }
  }
  async function m(w, A) {
    let S, M, I;
    try {
      ({ data: S, pagePath: M, anchor: I } = await xo(w, s));
    } catch (D) {
      const L = D && D.message ? String(D.message) : "", H = (!le || typeof le != "string" || !le) && /no page data/i.test(L);
      try {
        if (H)
          try {
            k("[nimbi-cms] fetchPageData (expected missing)", D);
          } catch {
          }
        else
          try {
            Yn("[nimbi-cms] fetchPageData failed", D);
          } catch {
          }
      } catch {
      }
      try {
        !le && n && g(n);
      } catch {
      }
      Gi(t, a, D);
      return;
    }
    !I && A && (I = A);
    try {
      Hr(null);
    } catch (D) {
      k("[nimbi-cms] scrollToAnchorOrTop failed", D);
    }
    try {
      g(t);
    } catch {
      try {
        t.innerHTML = "";
      } catch {
      }
    }
    const { article: q, parsed: Q, toc: R, topH1: O, h1Text: G, slugKey: re } = await ql(a, S, M, I, s);
    yo(a, l, Q, R, q, M, I, O, G, re, S);
    try {
      g(n);
    } catch {
      try {
        n.innerHTML = "";
      } catch {
      }
    }
    R && (n.appendChild(R), Wl(R));
    try {
      await c("transformHtml", { article: q, parsed: Q, toc: R, pagePath: M, anchor: I, topH1: O, h1Text: G, slugKey: re, data: S });
    } catch (D) {
      k("[nimbi-cms] transformHtml hooks failed", D);
    }
    t.appendChild(q);
    try {
      Hl(q);
    } catch (D) {
      k("[nimbi-cms] executeEmbeddedScripts failed", D);
    }
    try {
      Yl(q, { t: a });
    } catch (D) {
      k("[nimbi-cms] attachImagePreview failed", D);
    }
    try {
      Dn(i, 100, !1), requestAnimationFrame(() => Dn(i, 100, !1)), setTimeout(() => Dn(i, 100, !1), 250);
    } catch (D) {
      k("[nimbi-cms] setEagerForAboveFoldImages failed", D);
    }
    Hr(I), Zl(q, O, { mountOverlay: r, container: i, navWrap: n, t: a });
    try {
      await c("onPageLoad", { data: S, pagePath: M, anchor: I, article: q, toc: R, topH1: O, h1Text: G, slugKey: re, contentWrap: t, navWrap: n });
    } catch (D) {
      k("[nimbi-cms] onPageLoad hooks failed", D);
    }
    u = M;
  }
  async function p() {
    if (h) {
      f = !0;
      return;
    }
    h = !0;
    try {
      try {
        Vi("renderByQuery");
      } catch {
      }
      try {
        Ji("renderByQuery");
      } catch {
      }
      let w = it(location.href);
      if (w && w.type === "path" && w.page)
        try {
          let M = "?page=" + encodeURIComponent(w.page || "");
          w.params && (M += (M.includes("?") ? "&" : "?") + w.params), w.anchor && (M += "#" + encodeURIComponent(w.anchor));
          try {
            history.replaceState(history.state, "", M);
          } catch {
            try {
              history.replaceState({}, "", M);
            } catch {
            }
          }
          w = it(location.href);
        } catch {
        }
      const A = w && w.page ? w.page : o, S = w && w.anchor ? w.anchor : null;
      await m(A, S);
    } catch (w) {
      k("[nimbi-cms] renderByQuery failed", w);
      try {
        !le && n && g(n);
      } catch {
      }
      Gi(t, a, w);
    } finally {
      if (h = !1, f) {
        f = !1;
        try {
          await p();
        } catch {
        }
      }
    }
  }
  window.addEventListener("popstate", p);
  const b = () => `nimbi-cms-scroll:${location.pathname}${location.search}`, y = () => {
    try {
      const w = i || document.querySelector(".nimbi-cms");
      if (!w) return;
      const A = {
        top: w.scrollTop || 0,
        left: w.scrollLeft || 0
      };
      sessionStorage.setItem(b(), JSON.stringify(A));
    } catch (w) {
      k("[nimbi-cms] save scroll position failed", w);
    }
  }, _ = () => {
    try {
      const w = i || document.querySelector(".nimbi-cms");
      if (!w) return;
      const A = sessionStorage.getItem(b());
      if (!A) return;
      const S = JSON.parse(A);
      S && typeof S.top == "number" && w.scrollTo({ top: S.top, left: S.left || 0, behavior: "auto" });
    } catch {
    }
  };
  return window.addEventListener("pageshow", (w) => {
    if (w.persisted)
      try {
        _(), Dn(i, 100, !1);
      } catch (A) {
        k("[nimbi-cms] bfcache restore failed", A);
      }
  }), window.addEventListener("pagehide", () => {
    try {
      y();
    } catch (w) {
      k("[nimbi-cms] save scroll position failed", w);
    }
  }), { renderByQuery: p, siteNav: d, getCurrentPagePath: () => u };
}
function Jl(e) {
  try {
    let t = typeof e == "string" ? e : typeof window < "u" && window.location ? window.location.search : "";
    if (!t && typeof window < "u" && window.location && window.location.hash)
      try {
        const a = it(window.location.href);
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
    if (n.has("availableLanguages") && (i.availableLanguages = n.get("availableLanguages").split(",").map((a) => a.trim()).filter(Boolean)), n.has("fetchConcurrency")) {
      const a = Number(n.get("fetchConcurrency"));
      Number.isInteger(a) && a >= 1 && (i.fetchConcurrency = a);
    }
    if (n.has("negativeFetchCacheTTL")) {
      const a = Number(n.get("negativeFetchCacheTTL"));
      Number.isFinite(a) && a >= 0 && (i.negativeFetchCacheTTL = a);
    }
    if (n.has("indexDepth")) {
      const a = Number(n.get("indexDepth"));
      Number.isInteger(a) && (a === 1 || a === 2 || a === 3) && (i.indexDepth = a);
    }
    if (n.has("noIndexing")) {
      const s = (n.get("noIndexing") || "").split(",").map((o) => o.trim()).filter(Boolean);
      s.length && (i.noIndexing = s);
    }
    return i;
  } catch {
    return {};
  }
}
function Lr(e) {
  if (typeof e != "string") return !1;
  const t = e.trim();
  if (!t || t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t)) return !1;
  const n = t.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n);
}
function ec(e) {
  if (typeof e != "string") return !1;
  const t = e.trim();
  if (!t) return !1;
  if (t === "." || t === "./") return !0;
  if (t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t)) return !1;
  const n = t.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\/?$/.test(n);
}
let Wn = "";
async function dc(e = {}) {
  if (!e || typeof e != "object")
    throw new TypeError("initCMS(options): options must be an object");
  const t = Jl();
  if (t && (t.contentPath || t.homePage || t.notFoundPage || t.navigationPage))
    if (e && e.allowUrlPathOverrides === !0)
      try {
        k("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage/navigationPage");
      } catch {
      }
    else {
      try {
        k("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage/navigationPage");
      } catch {
      }
      delete t.contentPath, delete t.homePage, delete t.notFoundPage, delete t.navigationPage;
    }
  const n = Object.assign({}, t, e);
  try {
    if (Object.prototype.hasOwnProperty.call(n, "debugLevel"))
      vi(n.debugLevel);
    else if (typeof globalThis < "u" && globalThis.__nimbiCMSDebug && typeof globalThis.__nimbiCMSDebug.debugLevel < "u")
      try {
        const R = Number(globalThis.__nimbiCMSDebug.debugLevel);
        Number.isFinite(R) && vi(Math.max(0, Math.min(3, Math.floor(R))));
      } catch {
      }
  } catch {
  }
  try {
    zt("[nimbi-cms] initCMS called", () => ({ options: n }));
  } catch {
  }
  t && typeof t.bulmaCustomize == "string" && t.bulmaCustomize.trim() && (n.bulmaCustomize = t.bulmaCustomize);
  let {
    el: i,
    contentPath: r = "/content",
    crawlMaxQueue: a = 1e3,
    searchIndex: s = !0,
    searchIndexMode: o = "eager",
    indexDepth: l = 1,
    noIndexing: c = void 0,
    defaultStyle: u = "light",
    bulmaCustomize: d = "none",
    lang: h = void 0,
    l10nFile: f = null,
    cacheTtlMinutes: g = 5,
    cacheMaxEntries: m,
    markdownExtensions: p,
    availableLanguages: b,
    homePage: y = null,
    notFoundPage: _ = null,
    navigationPage: w = "_navigation.md",
    exposeSitemap: A = !0
  } = n;
  try {
    typeof y == "string" && y.startsWith("./") && (y = y.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof _ == "string" && _.startsWith("./") && (_ = _.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof w == "string" && w.startsWith("./") && (w = w.replace(/^[.]\//, ""));
  } catch {
  }
  const { navbarLogo: S = "favicon" } = n, { skipRootReadme: M = !1 } = n, I = (R) => {
    try {
      const O = document.querySelector(i);
      if (O && O instanceof Element)
        try {
          const G = document.createElement("div");
          G.style.padding = "1rem";
          try {
            G.style.fontFamily = "system-ui, sans-serif";
          } catch {
          }
          G.style.color = "#b00", G.style.background = "#fee", G.style.border = "1px solid #b00";
          const re = document.createElement("strong");
          re.textContent = "NimbiCMS failed to initialize:", G.appendChild(re);
          try {
            G.appendChild(document.createElement("br"));
          } catch {
          }
          const D = document.createElement("pre");
          try {
            D.style.whiteSpace = "pre-wrap";
          } catch {
          }
          D.textContent = String(R), G.appendChild(D);
          try {
            if (typeof O.replaceChildren == "function") O.replaceChildren(G);
            else {
              for (; O.firstChild; ) O.removeChild(O.firstChild);
              O.appendChild(G);
            }
          } catch {
            try {
              O.innerHTML = '<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;"><strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">' + String(R) + "</pre></div>";
            } catch {
            }
          }
        } catch {
        }
    } catch {
    }
  };
  if (n.contentPath != null && !ec(n.contentPath))
    throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');
  if (y != null && !Lr(y))
    throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');
  if (_ != null && !Lr(_))
    throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');
  if (w != null && !Lr(w))
    throw new TypeError('initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html');
  if (!i)
    throw new Error("el is required");
  let q = i;
  if (typeof i == "string") {
    if (q = document.querySelector(i), !q) throw new Error(`el selector "${i}" did not match any element`);
  } else if (!(i instanceof Element))
    throw new TypeError("el must be a CSS selector string or a DOM element");
  if (typeof r != "string" || !r.trim())
    throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');
  if (typeof s != "boolean")
    throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');
  if (o != null && o !== "eager" && o !== "lazy")
    throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');
  if (l != null && l !== 1 && l !== 2 && l !== 3)
    throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');
  if (u !== "light" && u !== "dark" && u !== "system")
    throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');
  if (d != null && typeof d != "string")
    throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');
  if (h != null && typeof h != "string")
    throw new TypeError('initCMS(options): "lang" must be a string when provided');
  if (f != null && typeof f != "string")
    throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');
  if (g != null && (typeof g != "number" || !Number.isFinite(g) || g < 0))
    throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');
  if (m != null && (typeof m != "number" || !Number.isInteger(m) || m < 0))
    throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');
  if (p != null && (!Array.isArray(p) || p.some((R) => !R || typeof R != "object")))
    throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');
  if (b != null && (!Array.isArray(b) || b.some((R) => typeof R != "string" || !R.trim())))
    throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');
  if (c != null && (!Array.isArray(c) || c.some((R) => typeof R != "string" || !R.trim())))
    throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');
  if (M != null && typeof M != "boolean")
    throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');
  if (n.fetchConcurrency != null && (typeof n.fetchConcurrency != "number" || !Number.isInteger(n.fetchConcurrency) || n.fetchConcurrency < 1))
    throw new TypeError('initCMS(options): "fetchConcurrency" must be a positive integer when provided');
  if (n.negativeFetchCacheTTL != null && (typeof n.negativeFetchCacheTTL != "number" || !Number.isFinite(n.negativeFetchCacheTTL) || n.negativeFetchCacheTTL < 0))
    throw new TypeError('initCMS(options): "negativeFetchCacheTTL" must be a non-negative number (ms) when provided');
  if (y != null && (typeof y != "string" || !y.trim() || !/\.(md|html)$/.test(y)))
    throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');
  if (_ != null && (typeof _ != "string" || !_.trim() || !/\.(md|html)$/.test(_)))
    throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');
  const Q = !!s;
  try {
    Promise.resolve().then(() => at).then((R) => {
      try {
        R && typeof R.setSkipRootReadme == "function" && R.setSkipRootReadme(!!M);
      } catch (O) {
        k("[nimbi-cms] setSkipRootReadme failed", O);
      }
    }).catch((R) => {
    });
  } catch (R) {
    k("[nimbi-cms] setSkipRootReadme dynamic import failed", R);
  }
  try {
    try {
      n && n.seoMap && typeof n.seoMap == "object" && go(n.seoMap);
    } catch {
    }
    try {
      typeof window < "u" && (window.__nimbiRenderingErrors__ || (window.__nimbiRenderingErrors__ = []), window.addEventListener("error", function(R) {
        try {
          const O = { type: "error", message: R && R.message ? String(R.message) : "", filename: R && R.filename ? String(R.filename) : "", lineno: R && R.lineno ? R.lineno : null, colno: R && R.colno ? R.colno : null, stack: R && R.error && R.error.stack ? R.error.stack : null, time: Date.now() };
          try {
            k("[nimbi-cms] runtime error", O.message);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(O);
        } catch {
        }
      }), window.addEventListener("unhandledrejection", function(R) {
        try {
          const O = { type: "unhandledrejection", reason: R && R.reason ? String(R.reason) : "", time: Date.now() };
          try {
            k("[nimbi-cms] unhandledrejection", O.reason);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(O);
        } catch {
        }
      }));
    } catch {
    }
    try {
      const R = it(typeof window < "u" ? window.location.href : ""), O = R && R.page ? R.page : y || void 0;
      try {
        O && mo(O, Wn || "");
      } catch {
      }
    } catch {
    }
    await (async () => {
      try {
        q.classList.add("nimbi-mount");
      } catch (E) {
        k("[nimbi-cms] mount element setup failed", E);
      }
      const R = document.createElement("section");
      R.className = "section";
      const O = document.createElement("div");
      O.className = "container nimbi-cms";
      const G = document.createElement("div");
      G.className = "columns";
      const re = document.createElement("div");
      re.className = "column is-hidden-mobile is-3-tablet nimbi-nav-wrap", re.setAttribute("role", "navigation");
      try {
        const E = typeof fn == "function" ? fn("navigation") : null;
        E && re.setAttribute("aria-label", E);
      } catch (E) {
        k("[nimbi-cms] set nav aria-label failed", E);
      }
      G.appendChild(re);
      const D = document.createElement("main");
      D.className = "column nimbi-content", D.setAttribute("role", "main"), G.appendChild(D), O.appendChild(G), R.appendChild(O);
      const L = re, H = D;
      q.appendChild(R);
      let W = null;
      try {
        W = q.querySelector(".nimbi-overlay"), W || (W = document.createElement("div"), W.className = "nimbi-overlay", q.appendChild(W));
      } catch (E) {
        W = null, k("[nimbi-cms] mount overlay setup failed", E);
      }
      const ie = location.pathname || "/";
      let ye;
      if (ie.endsWith("/"))
        ye = ie;
      else {
        const E = ie.substring(ie.lastIndexOf("/") + 1);
        E && !E.includes(".") ? ye = ie + "/" : ye = ie.substring(0, ie.lastIndexOf("/") + 1);
      }
      try {
        Wn = document.title || "";
      } catch (E) {
        Wn = "", k("[nimbi-cms] read initial document title failed", E);
      }
      let ee = r;
      const Pe = Object.prototype.hasOwnProperty.call(n, "contentPath"), ke = typeof location < "u" && location.origin ? location.origin : "http://localhost", xe = new URL(ye, ke).toString();
      (ee === "." || ee === "./") && (ee = "");
      try {
        ee = String(ee || "").replace(/\\/g, "/");
      } catch {
        ee = String(ee || "");
      }
      ee.startsWith("/") && (ee = ee.replace(/^\/+/, "")), ee && !ee.endsWith("/") && (ee = ee + "/");
      try {
        if (ee && ye && ye !== "/") {
          const E = ye.replace(/^\/+/, "").replace(/\/+$/, "") + "/";
          E && ee.startsWith(E) && (ee = ee.slice(E.length));
        }
      } catch {
      }
      try {
        if (ee)
          var Ee = new URL(ee, xe.endsWith("/") ? xe : xe + "/").toString();
        else
          var Ee = xe;
      } catch {
        try {
          if (ee) var Ee = new URL("/" + ee, ke).toString();
          else var Ee = new URL(ye, ke).toString();
        } catch {
          var Ee = ke;
        }
      }
      if (f && await aa(f, ye), b && Array.isArray(b) && la(b), h && sa(h), typeof g == "number" && g >= 0 && typeof Pi == "function" && Pi(g * 60 * 1e3), typeof m == "number" && m >= 0 && typeof zi == "function" && zi(m), p && Array.isArray(p) && p.length)
        try {
          p.forEach((E) => {
            typeof E == "object" && Ha && typeof jr == "function" && jr(E);
          });
        } catch (E) {
          k("[nimbi-cms] applying markdownExtensions failed", E);
        }
      try {
        typeof a == "number" && Promise.resolve().then(() => at).then(({ setDefaultCrawlMaxQueue: E }) => {
          try {
            E(a);
          } catch (v) {
            k("[nimbi-cms] setDefaultCrawlMaxQueue failed", v);
          }
        }), typeof n.fetchConcurrency == "number" && Promise.resolve().then(() => at).then(({ setFetchConcurrency: E }) => {
          try {
            E(n.fetchConcurrency);
          } catch (v) {
            k("[nimbi-cms] setFetchConcurrency failed", v);
          }
        }).catch(() => {
        }), typeof n.negativeFetchCacheTTL == "number" && Promise.resolve().then(() => at).then(({ setFetchNegativeCacheTTL: E }) => {
          try {
            E(n.negativeFetchCacheTTL);
          } catch (v) {
            k("[nimbi-cms] setFetchNegativeCacheTTL failed", v);
          }
        }).catch(() => {
        });
      } catch (E) {
        k("[nimbi-cms] setDefaultCrawlMaxQueue import failed", E);
      }
      try {
        try {
          const E = n && n.manifest ? n.manifest : typeof globalThis < "u" && globalThis.__NIMBI_CMS_MANIFEST__ ? globalThis.__NIMBI_CMS_MANIFEST__ : typeof window < "u" && window.__NIMBI_CMS_MANIFEST__ ? window.__NIMBI_CMS_MANIFEST__ : null;
          if (E && typeof E == "object")
            try {
              const v = await Promise.resolve().then(() => at);
              if (v && typeof v._setAllMd == "function") {
                v._setAllMd(E);
                try {
                  zt("[nimbi-cms diagnostic] applied content manifest", () => ({ manifestKeys: Object.keys(E).length }));
                } catch {
                }
              }
            } catch (v) {
              k("[nimbi-cms] applying content manifest failed", v);
            }
          try {
            Kr(Ee);
          } catch (v) {
            k("[nimbi-cms] setContentBase failed", v);
          }
          try {
            try {
              const v = await Promise.resolve().then(() => at);
              try {
                zt("[nimbi-cms diagnostic] after setContentBase", () => ({
                  manifestKeys: E && typeof E == "object" ? Object.keys(E).length : 0,
                  slugToMdSize: v && v.slugToMd && typeof v.slugToMd.size == "number" ? v.slugToMd.size : void 0,
                  allMarkdownPathsLength: v && Array.isArray(v.allMarkdownPaths) ? v.allMarkdownPaths.length : void 0,
                  allMarkdownPathsSetSize: v && v.allMarkdownPathsSet && typeof v.allMarkdownPathsSet.size == "number" ? v.allMarkdownPathsSet.size : void 0,
                  searchIndexLength: v && Array.isArray(v.searchIndex) ? v.searchIndex.length : void 0
                }));
              } catch {
              }
            } catch {
            }
          } catch {
          }
        } catch {
        }
      } catch (E) {
        k("[nimbi-cms] setContentBase failed", E);
      }
      try {
        ha(_);
      } catch (E) {
        k("[nimbi-cms] setNotFoundPage failed", E);
      }
      try {
        typeof window < "u" && window.__nimbiAutoAttachSitemapUI && Promise.resolve().then(() => An).then((E) => {
          try {
            E && typeof E.attachSitemapDownloadUI == "function" && E.attachSitemapDownloadUI(document.body, { filename: "sitemap.json" });
          } catch {
          }
        }).catch(() => {
        });
      } catch {
      }
      let qe = null, T = null;
      try {
        if (!Object.prototype.hasOwnProperty.call(n, "homePage") && w)
          try {
            const C = [], F = [];
            try {
              w && F.push(String(w));
            } catch {
            }
            try {
              const B = String(w || "").replace(/^_/, "");
              B && B !== String(w) && F.push(B);
            } catch {
            }
            try {
              F.push("navigation.md");
            } catch {
            }
            try {
              F.push("assets/navigation.md");
            } catch {
            }
            const V = [];
            for (const B of F)
              try {
                if (!B) continue;
                const P = String(B);
                V.includes(P) || V.push(P);
              } catch {
              }
            for (const B of V) {
              C.push(B);
              try {
                if (T = await Be(B, Ee, { force: !0 }), T && T.raw) {
                  try {
                    w = B;
                  } catch {
                  }
                  try {
                    k("[nimbi-cms] fetched navigation candidate", B, "contentBase=", Ee);
                  } catch {
                  }
                  qe = await zn(T.raw || "");
                  try {
                    const P = He();
                    if (P && qe && qe.html) {
                      const j = P.parseFromString(qe.html, "text/html").querySelector("a");
                      if (j)
                        try {
                          const Z = j.getAttribute("href") || "", se = it(Z);
                          try {
                            k("[nimbi-cms] parsed nav first-link href", Z, "->", se);
                          } catch {
                          }
                          if (se && se.page && (se.type === "path" || se.type === "canonical" && (se.page.includes(".") || se.page.includes("/")))) {
                            y = se.page;
                            try {
                              k("[nimbi-cms] derived homePage from navigation", y);
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
          k("[nimbi-cms] final homePage before slugManager setHomePage", y);
        } catch {
        }
        try {
          da(y);
        } catch (C) {
          k("[nimbi-cms] setHomePage failed", C);
        }
        let v = !0;
        try {
          const C = it(typeof location < "u" ? location.href : "");
          C && C.type === "cosmetic" && (typeof _ > "u" || _ == null) && (v = !1);
        } catch {
        }
        if (v && y)
          try {
            await Be(y, Ee, { force: !0 });
          } catch (C) {
            throw new Error(`Required ${y} not found at ${Ee}${y}: ${C && C.message ? C.message : String(C)}`);
          }
      } catch (E) {
        throw E;
      }
      Cs(u), await Es(d, ye);
      const $ = Vl({ contentWrap: H, navWrap: L, container: O, mountOverlay: W, t: fn, contentBase: Ee, homePage: y, initialDocumentTitle: Wn, runHooks: Ai });
      try {
        const E = document.createElement("header");
        E.className = "nimbi-site-navbar", q.insertBefore(E, R);
        let v = T, C = qe;
        C || (v = await Be(w, Ee, { force: !0 }), C = await zn(v.raw || ""));
        const { navbar: F, linkEls: V } = await Xl(E, O, C.html || "", Ee, y, fn, $.renderByQuery, Q, o, l, c, S);
        try {
          await Ai("onNavBuild", { navWrap: L, navbar: F, linkEls: V, contentBase: Ee });
        } catch (B) {
          k("[nimbi-cms] onNavBuild hooks failed", B);
        }
        try {
          try {
            if (V && V.length) {
              const B = await Promise.resolve().then(() => at);
              for (const P of Array.from(V || []))
                try {
                  const z = P && P.getAttribute && P.getAttribute("href") || "";
                  if (!z) continue;
                  let j = String(z || "").split(/::|#/, 1)[0];
                  if (j = String(j || "").split("?")[0], !j) continue;
                  /\.(?:md|html?)$/.test(j) || (j = j + ".html");
                  let Z = null;
                  try {
                    Z = Y(String(j || ""));
                  } catch {
                    Z = String(j || "");
                  }
                  const se = String(Z || "").replace(/^.*\//, "").replace(/\?.*$/, "");
                  if (!se) continue;
                  try {
                    let ge = null;
                    try {
                      B && typeof B.slugify == "function" && (ge = B.slugify(se.replace(/\.(?:md|html?)$/i, "")));
                    } catch {
                      ge = String(se || "").replace(/\s+/g, "-").toLowerCase();
                    }
                    if (!ge) continue;
                    let be = ge;
                    try {
                      if (B && B.slugToMd && typeof B.slugToMd.has == "function" && B.slugToMd.has(ge)) {
                        const pe = B.slugToMd.get(ge);
                        let Se = !1;
                        try {
                          if (typeof pe == "string")
                            pe === j && (Se = !0);
                          else if (pe && typeof pe == "object") {
                            pe.default === j && (Se = !0);
                            for (const Te of Object.keys(pe.langs || {}))
                              if (pe.langs[Te] === j) {
                                Se = !0;
                                break;
                              }
                          }
                        } catch {
                        }
                        if (!Se && typeof B.uniqueSlug == "function")
                          try {
                            be = B.uniqueSlug(ge, new Set(B.slugToMd.keys()));
                          } catch {
                            be = ge;
                          }
                      }
                    } catch {
                    }
                    try {
                      if (B && typeof B._storeSlugMapping == "function")
                        try {
                          B._storeSlugMapping(be, Z);
                        } catch {
                        }
                      else if (B && B.slugToMd && typeof B.slugToMd.set == "function")
                        try {
                          B.slugToMd.set(be, Z);
                        } catch {
                        }
                      try {
                        B && B.mdToSlug && typeof B.mdToSlug.set == "function" && B.mdToSlug.set(Z, be);
                      } catch {
                      }
                      try {
                        B && Array.isArray(B.allMarkdownPaths) && !B.allMarkdownPaths.includes(Z) && B.allMarkdownPaths.push(Z);
                      } catch {
                      }
                      try {
                        B && B.allMarkdownPathsSet && typeof B.allMarkdownPathsSet.add == "function" && B.allMarkdownPathsSet.add(Z);
                      } catch {
                      }
                    } catch {
                    }
                  } catch {
                  }
                } catch {
                }
              try {
                const P = await Promise.resolve().then(() => Sr);
                P && typeof P.refreshIndexPaths == "function" && P.refreshIndexPaths(Ee);
              } catch {
              }
            }
          } catch {
          }
        } catch {
        }
        try {
          let B = !1;
          try {
            const P = new URLSearchParams(location.search || "");
            (P.has("sitemap") || P.has("rss") || P.has("atom")) && (B = !0);
          } catch {
          }
          try {
            const z = (location.pathname || "/").replace(/\/\/+/g, "/").split("/").filter(Boolean).pop() || "";
            z && /^(sitemap|sitemap\.xml|rss|rss\.xml|atom|atom\.xml)$/i.test(z) && (B = !0);
          } catch {
          }
          if (B || A === !0 || typeof window < "u" && window.__nimbiExposeSitemap)
            try {
              try {
                const z = await Promise.resolve().then(() => at);
                if (z && typeof z.awaitSearchIndex == "function") {
                  const j = [];
                  y && j.push(y), w && j.push(w);
                  try {
                    await z.awaitSearchIndex({ contentBase: Ee, indexDepth: Math.max(l || 1, 3), noIndexing: c, seedPaths: j.length ? j : void 0, startBuild: !0, timeoutMs: 1 / 0 });
                  } catch {
                  }
                }
              } catch {
              }
              const P = await Promise.resolve().then(() => An);
              try {
                if (P && typeof P.handleSitemapRequest == "function" && await P.handleSitemapRequest({ includeAllMarkdown: !0, homePage: y, navigationPage: w, notFoundPage: _, contentBase: Ee, indexDepth: l, noIndexing: c }))
                  return;
              } catch {
              }
            } catch {
            }
          try {
            Promise.resolve().then(() => An).then((P) => {
              try {
                if (P && typeof P.exposeSitemapGlobals == "function")
                  try {
                    P.exposeSitemapGlobals({ includeAllMarkdown: !0, homePage: y, navigationPage: w, notFoundPage: _, contentBase: Ee, indexDepth: l, noIndexing: c, waitForIndexMs: 1 / 0 }).catch(() => {
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
            const P = await Promise.resolve().then(() => Sr);
            if (P && typeof P.refreshIndexPaths == "function")
              try {
                P.refreshIndexPaths(Ee);
                try {
                  try {
                    const z = await Promise.resolve().then(() => at);
                    try {
                      zt("[nimbi-cms diagnostic] after refreshIndexPaths", () => ({ slugToMdSize: z && z.slugToMd && typeof z.slugToMd.size == "number" ? z.slugToMd.size : void 0, allMarkdownPathsLength: z && Array.isArray(z.allMarkdownPaths) ? z.allMarkdownPaths.length : void 0, allMarkdownPathsSetSize: z && z.allMarkdownPathsSet && typeof z.allMarkdownPathsSet.size == "number" ? z.allMarkdownPathsSet.size : void 0 }));
                    } catch {
                    }
                  } catch {
                  }
                } catch {
                }
                try {
                  const z = await Promise.resolve().then(() => at), j = z && z.slugToMd && typeof z.slugToMd.size == "number" ? z.slugToMd.size : 0;
                  let Z = !1;
                  try {
                    if (!manifest) {
                      j < 30 && (Z = !0);
                      try {
                        const se = it(typeof location < "u" ? location.href : "");
                        if (se) {
                          if (se.type === "cosmetic" && se.page)
                            try {
                              z.slugToMd.has(se.page) || (Z = !0);
                            } catch {
                            }
                          else if ((se.type === "path" || se.type === "canonical") && se.page)
                            try {
                              const ge = Y(se.page);
                              !(z.mdToSlug && z.mdToSlug.has(ge)) && !(z.allMarkdownPathsSet && z.allMarkdownPathsSet.has(ge)) && (Z = !0);
                            } catch {
                            }
                        }
                      } catch {
                      }
                    }
                  } catch {
                  }
                  if (Z) {
                    let se = null;
                    try {
                      se = typeof window < "u" && (window.__nimbiSitemapFinal || window.__nimbiResolvedIndex || window.__nimbiSearchIndex || window.__nimbiLiveSearchIndex || window.__nimbiSearchIndex) || null;
                    } catch {
                      se = null;
                    }
                    if (Array.isArray(se) && se.length) {
                      let ge = 0;
                      for (const be of se)
                        try {
                          if (!be || !be.slug) continue;
                          const pe = String(be.slug).split("::")[0];
                          if (z.slugToMd.has(pe)) continue;
                          let Se = be.sourcePath || be.path || null;
                          if (!Se && Array.isArray(se)) {
                            const Fe = (se || []).find((Ge) => Ge && Ge.slug === be.slug);
                            Fe && Fe.path && (Se = Fe.path);
                          }
                          if (!Se) continue;
                          try {
                            Se = String(Se);
                          } catch {
                            continue;
                          }
                          let Te = null;
                          try {
                            const Fe = Ee && typeof Ee == "string" ? Ee : typeof location < "u" && location.origin ? location.origin + "/" : "";
                            try {
                              const Ge = new URL(Se, Fe), At = new URL(Fe);
                              if (Ge.origin === At.origin) {
                                const sn = At.pathname || "/";
                                let Et = Ge.pathname || "";
                                Et.startsWith(sn) && (Et = Et.slice(sn.length)), Et.startsWith("/") && (Et = Et.slice(1)), Te = Y(Et);
                              } else
                                Te = Y(Ge.pathname || "");
                            } catch {
                              Te = Y(Se);
                            }
                          } catch {
                            Te = Y(Se);
                          }
                          if (!Te) continue;
                          Te = String(Te).split(/[?#]/)[0], Te = Y(Te);
                          try {
                            z._storeSlugMapping(pe, Te);
                          } catch {
                          }
                          ge++;
                        } catch {
                        }
                      if (ge) {
                        try {
                          zt("[nimbi-cms diagnostic] populated slugToMd from sitemap/searchIndex", () => ({ added: ge, total: z && z.slugToMd && typeof z.slugToMd.size == "number" ? z.slugToMd.size : void 0 }));
                        } catch {
                        }
                        try {
                          const be = await Promise.resolve().then(() => Sr);
                          be && typeof be.refreshIndexPaths == "function" && be.refreshIndexPaths(Ee);
                        } catch {
                        }
                      }
                    }
                  }
                } catch {
                }
              } catch (z) {
                k("[nimbi-cms] refreshIndexPaths after nav build failed", z);
              }
          } catch {
          }
          const B = () => {
            const P = E && E.getBoundingClientRect && Math.round(E.getBoundingClientRect().height) || E && E.offsetHeight || 0;
            if (P > 0) {
              try {
                q.style.setProperty("--nimbi-site-navbar-height", `${P}px`);
              } catch (z) {
                k("[nimbi-cms] set CSS var failed", z);
              }
              try {
                O.style.paddingTop = "";
              } catch (z) {
                k("[nimbi-cms] set container paddingTop failed", z);
              }
              try {
                const z = q && q.getBoundingClientRect && Math.round(q.getBoundingClientRect().height) || q && q.clientHeight || 0;
                if (z > 0) {
                  const j = Math.max(0, z - P);
                  try {
                    O.style.setProperty("--nimbi-cms-height", `${j}px`);
                  } catch (Z) {
                    k("[nimbi-cms] set --nimbi-cms-height failed", Z);
                  }
                } else
                  try {
                    O.style.setProperty("--nimbi-cms-height", "calc(100vh - var(--nimbi-site-navbar-height))");
                  } catch (j) {
                    k("[nimbi-cms] set --nimbi-cms-height failed", j);
                  }
              } catch (z) {
                k("[nimbi-cms] compute container height failed", z);
              }
              try {
                E.style.setProperty("--nimbi-site-navbar-height", `${P}px`);
              } catch (z) {
                k("[nimbi-cms] set navbar CSS var failed", z);
              }
            }
          };
          B();
          try {
            if (typeof ResizeObserver < "u") {
              const P = new ResizeObserver(() => B());
              try {
                P.observe(E);
              } catch (z) {
                k("[nimbi-cms] ResizeObserver.observe failed", z);
              }
            }
          } catch (P) {
            k("[nimbi-cms] ResizeObserver setup failed", P);
          }
        } catch (B) {
          k("[nimbi-cms] compute navbar height failed", B);
        }
      } catch (E) {
        k("[nimbi-cms] build navigation failed", E);
      }
      await $.renderByQuery();
      try {
        Promise.resolve().then(() => nc).then(({ getVersion: E }) => {
          typeof E == "function" && E().then((v) => {
            try {
              const C = v || "0.0.0";
              try {
                const F = (P) => {
                  const z = document.createElement("a");
                  z.className = "nimbi-version-label tag is-small", z.textContent = `nimbiCMS v. ${C}`, z.href = P || "#", z.target = "_blank", z.rel = "noopener noreferrer nofollow", z.setAttribute("aria-label", `nimbiCMS version ${C}`);
                  try {
                    ra(z);
                  } catch {
                  }
                  try {
                    q.appendChild(z);
                  } catch (j) {
                    k("[nimbi-cms] append version label failed", j);
                  }
                }, V = "https://abelvm.github.io/nimbiCMS/", B = (() => {
                  try {
                    if (V && typeof V == "string")
                      return new URL(V).toString();
                  } catch {
                  }
                  return "#";
                })();
                F(B);
              } catch (F) {
                k("[nimbi-cms] building version label failed", F);
              }
            } catch (C) {
              k("[nimbi-cms] building version label failed", C);
            }
          }).catch((v) => {
            k("[nimbi-cms] getVersion() failed", v);
          });
        }).catch((E) => {
          k("[nimbi-cms] import version module failed", E);
        });
      } catch (E) {
        k("[nimbi-cms] version label setup failed", E);
      }
    })();
  } catch (R) {
    throw I(R), R;
  }
}
async function tc() {
  try {
    if ("1.0.5".trim())
      return "1.0.5";
  } catch {
  }
  return "0.0.0";
}
const nc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getVersion: tc
}, Symbol.toStringTag, { value: "Module" })), et = Bt, dn = k;
function ci() {
  try {
    if (typeof location < "u" && location && typeof location.pathname == "string")
      return String(location.origin + location.pathname.split("?")[0]);
  } catch {
  }
  return "http://localhost/";
}
function De(e) {
  return String(e || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function Qi(e) {
  try {
    return !e || typeof e != "string" ? "" : (e.split("/").filter(Boolean).pop() || e).replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").split(" ").map((r) => r ? r.charAt(0).toUpperCase() + r.slice(1) : "").join(" ").trim();
  } catch {
    return String(e);
  }
}
function rc(e, t) {
  try {
    const n = t && t.slug ? String(t.slug) : null;
    if (!n) return null;
    const r = { loc: e + "?page=" + encodeURIComponent(n), slug: n };
    return t.title && (r.title = String(t.title)), t.excerpt && (r.excerpt = String(t.excerpt)), t.path && (r.sourcePath = Y(String(t.path))), r;
  } catch {
    return null;
  }
}
async function ui(e = {}) {
  const {
    includeAllMarkdown: t = !0,
    index: n,
    homePage: i,
    navigationPage: r,
    notFoundPage: a
  } = e || {}, o = ci().split("?")[0];
  let l = Array.isArray(ne) && ne.length ? ne : Array.isArray(n) ? n : [];
  if (Array.isArray(n) && n.length && Array.isArray(ne) && ne.length) {
    const b = /* @__PURE__ */ new Map();
    try {
      for (const y of n)
        try {
          y && y.slug && b.set(String(y.slug), y);
        } catch {
        }
      for (const y of ne)
        try {
          y && y.slug && b.set(String(y.slug), y);
        } catch {
        }
    } catch {
    }
    l = Array.from(b.values());
  }
  const c = /* @__PURE__ */ new Set();
  try {
    typeof a == "string" && a.trim() && c.add(Y(String(a)));
  } catch {
  }
  try {
    typeof r == "string" && r.trim() && c.add(Y(String(r)));
  } catch {
  }
  const u = /* @__PURE__ */ new Set();
  try {
    if (typeof a == "string" && a.trim()) {
      const b = Y(String(a));
      try {
        if (U && typeof U.has == "function" && U.has(b))
          try {
            u.add(U.get(b));
          } catch {
          }
        else
          try {
            const y = await Be(b, e && e.contentBase ? e.contentBase : void 0);
            if (y && y.raw)
              try {
                let _ = null;
                if (y.isHtml)
                  try {
                    const w = He();
                    if (w) {
                      const A = w.parseFromString(y.raw, "text/html"), S = A.querySelector("h1") || A.querySelector("title");
                      S && S.textContent && (_ = S.textContent.trim());
                    } else {
                      const A = (y.raw || "").match(/<h1[^>]*>(.*?)<\/h1>|<title[^>]*>(.*?)<\/title>/i);
                      A && (_ = (A[1] || A[2] || "").trim());
                    }
                  } catch {
                  }
                else {
                  const w = (y.raw || "").match(/^#\s+(.+)$/m);
                  w && w[1] && (_ = w[1].trim());
                }
                _ && u.add(he(_));
              } catch {
              }
          } catch {
          }
      } catch {
      }
    }
  } catch {
  }
  const d = /* @__PURE__ */ new Set(), h = [], f = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), m = (b) => {
    try {
      if (!b || typeof b != "string") return !1;
      const y = Y(String(b));
      try {
        if (ze && typeof ze.has == "function" && ze.has(y)) return !0;
      } catch {
      }
      try {
        if (U && typeof U.has == "function" && U.has(y)) return !0;
      } catch {
      }
      try {
        if (g && g.has(y)) return !0;
      } catch {
      }
      try {
        if (U && typeof U.keys == "function" && U.size)
          for (const _ of U.keys())
            try {
              if (Y(String(_)) === y) return !0;
            } catch {
            }
        else
          for (const _ of K.values())
            try {
              if (!_) continue;
              if (typeof _ == "string") {
                if (Y(String(_)) === y) return !0;
              } else if (_ && typeof _ == "object") {
                if (_.default && Y(String(_.default)) === y) return !0;
                const w = _.langs || {};
                for (const A of Object.keys(w || {}))
                  try {
                    if (w[A] && Y(String(w[A])) === y) return !0;
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
  if (Array.isArray(l) && l.length) {
    let b = 0;
    for (const y of l) {
      try {
        b++, await Pt(b, 64);
      } catch {
      }
      try {
        if (!y || !y.slug) continue;
        const _ = String(y.slug), w = String(_).split("::")[0];
        if (u.has(w)) continue;
        const A = y.path ? Y(String(y.path)) : null;
        if (A && c.has(A)) continue;
        const S = y.title ? String(y.title) : y.parentTitle ? String(y.parentTitle) : void 0;
        f.set(_, { title: S || void 0, excerpt: y.excerpt ? String(y.excerpt) : void 0, path: A, source: "index" }), A && g.set(A, { title: S || void 0, excerpt: y.excerpt ? String(y.excerpt) : void 0, slug: _ });
        const M = rc(o, y);
        if (!M || !M.slug || d.has(M.slug)) continue;
        if (d.add(M.slug), f.has(M.slug)) {
          const I = f.get(M.slug);
          I && I.title && (M.title = I.title, M._titleSource = "index"), I && I.excerpt && (M.excerpt = I.excerpt);
        }
        h.push(M);
      } catch {
        continue;
      }
    }
  }
  if (t)
    try {
      let b = 0;
      for (const [y, _] of K.entries()) {
        try {
          b++, await Pt(b, 128);
        } catch {
        }
        try {
          if (!y) continue;
          const w = String(y).split("::")[0];
          if (d.has(y) || u.has(w)) continue;
          let A = null;
          if (typeof _ == "string" ? A = Y(String(_)) : _ && typeof _ == "object" && (A = Y(String(_.default || ""))), A && c.has(A)) continue;
          const M = { loc: o + "?page=" + encodeURIComponent(y), slug: y };
          if (f.has(y)) {
            const I = f.get(y);
            I && I.title && (M.title = I.title, M._titleSource = "index"), I && I.excerpt && (M.excerpt = I.excerpt);
          } else if (A) {
            const I = g.get(A);
            I && I.title && (M.title = I.title, M._titleSource = "path", !M.excerpt && I.excerpt && (M.excerpt = I.excerpt));
          }
          if (d.add(y), typeof y == "string") {
            const I = y.indexOf("/") !== -1 || /\.(md|html?)$/i.test(y), q = M.title && typeof M.title == "string" && (M.title.indexOf("/") !== -1 || /\.(md|html?)$/i.test(M.title));
            (!M.title || q || I) && (M.title = Qi(y), M._titleSource = "humanize");
          }
          h.push(M);
        } catch {
        }
      }
      try {
        if (i && typeof i == "string") {
          const y = Y(String(i));
          let _ = null;
          try {
            U && U.has(y) && (_ = U.get(y));
          } catch {
          }
          _ || (_ = y);
          const w = String(_).split("::")[0];
          if (!d.has(_) && !c.has(y) && !u.has(w)) {
            const A = { loc: o + "?page=" + encodeURIComponent(_), slug: _ };
            if (f.has(_)) {
              const S = f.get(_);
              S && S.title && (A.title = S.title, A._titleSource = "index"), S && S.excerpt && (A.excerpt = S.excerpt);
            }
            d.add(_), h.push(A);
          }
        }
      } catch {
      }
    } catch {
    }
  try {
    const b = /* @__PURE__ */ new Set(), y = new Set(h.map((M) => String(M && M.slug ? M.slug : ""))), _ = /* @__PURE__ */ new Set();
    for (const M of h)
      try {
        M && M.sourcePath && _.add(String(M.sourcePath));
      } catch {
      }
    const w = 30;
    let A = 0, S = 0;
    for (const M of _) {
      try {
        S++, await Pt(S, 8);
      } catch {
      }
      if (A >= w) break;
      try {
        if (!M || typeof M != "string" || !m(M)) continue;
        A += 1;
        const I = await Be(M, e && e.contentBase ? e.contentBase : void 0);
        if (!I || !I.raw || I && typeof I.status == "number" && I.status === 404) continue;
        const q = I.raw, Q = (function(D) {
          try {
            return String(D || "");
          } catch {
            return "";
          }
        })(q), R = [], O = /\[[^\]]+\]\(([^)]+)\)/g;
        let G;
        for (; G = O.exec(Q); )
          try {
            G && G[1] && R.push(G[1]);
          } catch {
          }
        const re = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
        for (; G = re.exec(Q); )
          try {
            G && G[1] && R.push(G[1]);
          } catch {
          }
        for (const D of R)
          try {
            if (!D) continue;
            if (D.indexOf("?") !== -1 || D.indexOf("=") !== -1)
              try {
                const W = new URL(D, o).searchParams.get("page");
                if (W) {
                  const ie = String(W);
                  !y.has(ie) && !b.has(ie) && (b.add(ie), h.push({ loc: o + "?page=" + encodeURIComponent(ie), slug: ie }));
                  continue;
                }
              } catch {
              }
            let L = String(D).split(/[?#]/)[0];
            if (L = L.replace(/^\.\//, "").replace(/^\//, ""), !L || !/\.(md|html?)$/i.test(L)) continue;
            try {
              const H = Y(L);
              if (U && U.has(H)) {
                const W = U.get(H), ie = String(W).split("::")[0];
                W && !y.has(W) && !b.has(W) && !u.has(ie) && !c.has(H) && (b.add(W), h.push({ loc: o + "?page=" + encodeURIComponent(W), slug: W, sourcePath: H }));
                continue;
              }
              try {
                if (!m(H)) continue;
                const W = await Be(H, e && e.contentBase ? e.contentBase : void 0);
                if (W && typeof W.status == "number" && W.status === 404) continue;
                if (W && W.raw) {
                  const ie = (W.raw || "").match(/^#\s+(.+)$/m), ye = ie && ie[1] ? ie[1].trim() : "", ee = he(ye || H), Pe = String(ee).split("::")[0];
                  ee && !y.has(ee) && !b.has(ee) && !u.has(Pe) && (b.add(ee), h.push({ loc: o + "?page=" + encodeURIComponent(ee), slug: ee, sourcePath: H, title: ye || void 0 }));
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
    const b = /* @__PURE__ */ new Map();
    let y = 0;
    for (const w of h) {
      try {
        y++, await Pt(y, 128);
      } catch {
      }
      try {
        if (!w || !w.slug) continue;
        b.set(String(w.slug), w);
      } catch {
      }
    }
    const _ = /* @__PURE__ */ new Set();
    for (const w of h)
      try {
        if (!w || !w.slug) continue;
        const A = String(w.slug), S = A.split("::")[0];
        if (!S) continue;
        A !== S && !b.has(S) && _.add(S);
      } catch {
      }
    for (const w of _)
      try {
        let A = null;
        if (f.has(w)) {
          const S = f.get(w);
          A = { loc: o + "?page=" + encodeURIComponent(w), slug: w }, S && S.title && (A.title = S.title, A._titleSource = "index"), S && S.excerpt && (A.excerpt = S.excerpt), S && S.path && (A.sourcePath = S.path);
        } else if (g && K && K.has(w)) {
          const S = K.get(w);
          let M = null;
          if (typeof S == "string" ? M = Y(String(S)) : S && typeof S == "object" && (M = Y(String(S.default || ""))), A = { loc: o + "?page=" + encodeURIComponent(w), slug: w }, M && g.has(M)) {
            const I = g.get(M);
            I && I.title && (A.title = I.title, A._titleSource = "path"), I && I.excerpt && (A.excerpt = I.excerpt), A.sourcePath = M;
          }
        }
        A || (A = { loc: o + "?page=" + encodeURIComponent(w), slug: w, title: Qi(w) }, A._titleSource = "humanize"), b.has(w) || (h.push(A), b.set(w, A));
      } catch {
      }
  } catch {
  }
  const p = [];
  try {
    const b = /* @__PURE__ */ new Set();
    let y = 0;
    for (const _ of h) {
      try {
        y++, await Pt(y, 128);
      } catch {
      }
      try {
        if (!_ || !_.slug) continue;
        const w = String(_.slug), A = String(w).split("::")[0];
        if (u.has(A) || w.indexOf("::") !== -1 || b.has(w)) continue;
        b.add(w), p.push(_);
      } catch {
      }
    }
  } catch {
  }
  try {
    try {
      et(() => "[runtimeSitemap] generateSitemapJson finalEntries.titleSource: " + JSON.stringify(p.map((b) => ({ slug: b.slug, title: b.title, titleSource: b._titleSource || null })), null, 2));
    } catch {
    }
  } catch {
  }
  try {
    let y = 0;
    const _ = p.length, w = Array.from({ length: Math.min(4, _) }).map(async () => {
      for (; ; ) {
        const A = y++;
        if (A >= _) break;
        const S = p[A];
        try {
          if (!S || !S.slug) continue;
          const M = String(S.slug).split("::")[0];
          if (u.has(M) || S._titleSource === "index") continue;
          let I = null;
          try {
            if (K && K.has(S.slug)) {
              const q = K.get(S.slug);
              typeof q == "string" ? I = Y(String(q)) : q && typeof q == "object" && (I = Y(String(q.default || "")));
            }
            !I && S.sourcePath && (I = S.sourcePath);
          } catch {
            continue;
          }
          if (!I || c.has(I) || !m(I)) continue;
          try {
            const q = await Be(I, e && e.contentBase ? e.contentBase : void 0);
            if (!q || !q.raw || q && typeof q.status == "number" && q.status === 404) continue;
            if (q && q.raw) {
              const Q = (q.raw || "").match(/^#\s+(.+)$/m), R = Q && Q[1] ? Q[1].trim() : "";
              R && (S.title = R, S._titleSource = "fetched");
            }
          } catch (q) {
            et("[runtimeSitemap] fetch title failed for", I, q);
          }
        } catch (M) {
          et("[runtimeSitemap] worker loop failure", M);
        }
      }
    });
    await Promise.all(w);
  } catch (b) {
    et("[runtimeSitemap] title enrichment failed", b);
  }
  return { generatedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: p };
}
function Fr(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [];
  let n = `<?xml version="1.0" encoding="UTF-8"?>
`;
  n += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  for (const i of t)
    try {
      n += `  <url>
`, n += `    <loc>${De(String(i.loc || ""))}</loc>
`, n += `  </url>
`;
    } catch {
    }
  return n += `</urlset>
`, n;
}
function Dr(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [], n = ci().split("?")[0];
  let i = `<?xml version="1.0" encoding="UTF-8"?>
`;
  i += `<rss version="2.0">
`, i += `<channel>
`, i += `<title>${De("Sitemap RSS")}</title>
`, i += `<link>${De(n)}</link>
`, i += `<description>${De("RSS feed generated from site index")}</description>
`, i += `<lastBuildDate>${De(e && e.generatedAt ? new Date(e.generatedAt).toUTCString() : (/* @__PURE__ */ new Date()).toUTCString())}</lastBuildDate>
`;
  for (const r of t)
    try {
      const a = String(r.loc || "");
      i += `<item>
`, i += `<title>${De(String(r.title || r.slug || r.loc || ""))}</title>
`, r.excerpt && (i += `<description>${De(String(r.excerpt))}</description>
`), i += `<link>${De(a)}</link>
`, i += `<guid>${De(a)}</guid>
`, i += `</item>
`;
    } catch {
    }
  return i += `</channel>
`, i += `</rss>
`, i;
}
function Ur(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [], n = ci().split("?")[0], i = e && e.generatedAt ? new Date(e.generatedAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
  let r = `<?xml version="1.0" encoding="utf-8"?>
`;
  r += `<feed xmlns="http://www.w3.org/2005/Atom">
`, r += `<title>${De("Sitemap Atom")}</title>
`, r += `<link href="${De(n)}" />
`, r += `<updated>${De(i)}</updated>
`, r += `<id>${De(n)}</id>
`;
  for (const a of t)
    try {
      const s = String(a.loc || ""), o = a && a.lastmod ? new Date(a.lastmod).toISOString() : i;
      r += `<entry>
`, r += `<title>${De(String(a.title || a.slug || a.loc || ""))}</title>
`, a.excerpt && (r += `<summary>${De(String(a.excerpt))}</summary>
`), r += `<link href="${De(s)}" />
`, r += `<id>${De(s)}</id>
`, r += `<updated>${De(o)}</updated>
`, r += `</entry>
`;
    } catch {
    }
  return r += `</feed>
`, r;
}
function Ki(e, t = "application/xml") {
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
      try {
        const i = document.createElement("pre");
        try {
          i.textContent = De(e);
        } catch {
          try {
            i.textContent = String(e);
          } catch {
          }
        }
        if (document && document.body)
          try {
            if (typeof document.body.replaceChildren == "function") document.body.replaceChildren(i);
            else {
              for (; document.body.firstChild; ) document.body.removeChild(document.body.firstChild);
              document.body.appendChild(i);
            }
          } catch {
            try {
              document.body.innerHTML = "<pre>" + De(e) + "</pre>";
            } catch {
            }
          }
      } catch {
      }
    } catch {
    }
  }
}
function Yi(e) {
  try {
    const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [];
    let n = '<!doctype html><html><head><meta charset="utf-8"><title>Sitemap</title></head><body>';
    n += "<h1>Sitemap</h1><ul>";
    for (const i of t)
      try {
        n += `<li><a href="${De(String(i && i.loc ? i.loc : ""))}">${De(String(i && (i.title || i.slug) || i && i.loc || ""))}</a></li>`;
      } catch {
      }
    return n += "</ul></body></html>", n;
  } catch {
    return "<!doctype html><html><body><pre>failed to render sitemap</pre></body></html>";
  }
}
function Zn(e, t = "application/xml") {
  try {
    if (typeof window > "u") {
      try {
        let i = null;
        t === "application/rss+xml" ? i = Dr(e) : t === "application/atom+xml" ? i = Ur(e) : t === "text/html" ? i = Yi(e) : i = Fr(e), Ki(i, t);
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
          r.mimeType === "application/rss+xml" ? a = Dr(r.finalJson) : r.mimeType === "application/atom+xml" ? a = Ur(r.finalJson) : r.mimeType === "text/html" ? a = Yi(r.finalJson) : a = Fr(r.finalJson);
          try {
            Ki(a, r.mimeType);
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
async function ic(e = {}) {
  try {
    if (typeof document > "u" || typeof location > "u") return !1;
    let t = !1, n = !1, i = !1, r = !1;
    try {
      const u = new URLSearchParams(location.search || "");
      if (u.has("sitemap")) {
        let d = !0;
        for (const h of u.keys()) h !== "sitemap" && (d = !1);
        d && (t = !0);
      }
      if (u.has("rss")) {
        let d = !0;
        for (const h of u.keys()) h !== "rss" && (d = !1);
        d && (n = !0);
      }
      if (u.has("atom")) {
        let d = !0;
        for (const h of u.keys()) h !== "atom" && (d = !1);
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
      if (typeof Nt == "function")
        try {
          const u = await Nt({ timeoutMs: s, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 });
          if (Array.isArray(u) && u.length)
            if (Array.isArray(e.index) && e.index.length) {
              const d = /* @__PURE__ */ new Map();
              try {
                for (const h of e.index)
                  try {
                    h && h.slug && d.set(String(h.slug), h);
                  } catch {
                  }
                for (const h of u)
                  try {
                    h && h.slug && d.set(String(h.slug), h);
                  } catch {
                  }
              } catch {
              }
              a = Array.from(d.values());
            } else
              a = u;
          else
            a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(ne) && ne.length ? ne : [];
        } catch {
          a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(ne) && ne.length ? ne : [];
        }
      else
        a = Array.isArray(ne) && ne.length ? ne : Array.isArray(e.index) && e.index.length ? e.index : [];
    } catch {
      a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(ne) && ne.length ? ne : [];
    }
    try {
      if (Array.isArray(e.index) && e.index.length)
        try {
          const u = /* @__PURE__ */ new Map();
          for (const d of e.index)
            try {
              if (!d || !d.slug) continue;
              const h = String(d.slug).split("::")[0];
              if (!u.has(h)) u.set(h, d);
              else {
                const f = u.get(h);
                f && String(f.slug || "").indexOf("::") !== -1 && String(d.slug || "").indexOf("::") === -1 && u.set(h, d);
              }
            } catch {
            }
          try {
            et(() => "[runtimeSitemap] providedIndex.dedupedByBase: " + JSON.stringify(Array.from(u.values()), null, 2));
          } catch {
            et(() => "[runtimeSitemap] providedIndex.dedupedByBase (count): " + String(u.size));
          }
        } catch (u) {
          dn("[runtimeSitemap] logging provided index failed", u);
        }
    } catch {
    }
    if ((!Array.isArray(a) || !a.length) && typeof Ut == "function")
      try {
        const u = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
        let d = null;
        try {
          typeof Nt == "function" && (d = await Nt({ timeoutMs: u, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 }));
        } catch {
          d = null;
        }
        if (Array.isArray(d) && d.length)
          a = d;
        else {
          const h = typeof e.indexDepth == "number" ? e.indexDepth : 3, f = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, g = [];
          e && e.homePage && g.push(e.homePage), e && e.navigationPage && g.push(e.navigationPage), a = await Ut(e && e.contentBase ? e.contentBase : void 0, h, f, g.length ? g : void 0);
        }
      } catch (u) {
        dn("[runtimeSitemap] rebuild index failed", u), a = Array.isArray(ne) && ne.length ? ne : [];
      }
    try {
      const u = Array.isArray(a) ? a.length : 0;
      try {
        et(() => "[runtimeSitemap] usedIndex.full.length (before rebuild): " + String(u));
      } catch {
      }
      try {
        et(() => "[runtimeSitemap] usedIndex.full (before rebuild): " + JSON.stringify(a, null, 2));
      } catch {
      }
    } catch {
    }
    try {
      const u = [];
      e && e.homePage && u.push(e.homePage), e && e.navigationPage && u.push(e.navigationPage);
      const d = typeof e.indexDepth == "number" ? e.indexDepth : 3, h = Array.isArray(e.noIndexing) ? e.noIndexing : void 0;
      let f = null;
      try {
        const g = typeof globalThis < "u" && typeof globalThis.buildSearchIndexWorker == "function" ? globalThis.buildSearchIndexWorker : void 0;
        if (typeof g == "function")
          try {
            f = await g(e && e.contentBase ? e.contentBase : void 0, d, h);
          } catch {
            f = null;
          }
      } catch {
        f = null;
      }
      if ((!f || !f.length) && typeof Ut == "function")
        try {
          f = await Ut(e && e.contentBase ? e.contentBase : void 0, d, h, u.length ? u : void 0);
        } catch {
          f = null;
        }
      if (Array.isArray(f) && f.length) {
        const g = /* @__PURE__ */ new Map();
        try {
          for (const m of a)
            try {
              m && m.slug && g.set(String(m.slug), m);
            } catch {
            }
          for (const m of f)
            try {
              m && m.slug && g.set(String(m.slug), m);
            } catch {
            }
        } catch {
        }
        a = Array.from(g.values());
      }
    } catch (u) {
      try {
        dn("[runtimeSitemap] rebuild index call failed", u);
      } catch {
      }
    }
    try {
      const u = Array.isArray(a) ? a.length : 0;
      try {
        et(() => "[runtimeSitemap] usedIndex.full.length (after rebuild): " + String(u));
      } catch {
      }
      try {
        et(() => "[runtimeSitemap] usedIndex.full (after rebuild): " + JSON.stringify(a, null, 2));
      } catch {
      }
    } catch {
    }
    const o = await ui(Object.assign({}, e, { index: a }));
    let l = [];
    try {
      const u = /* @__PURE__ */ new Set(), d = Array.isArray(o && o.entries) ? o.entries : [];
      for (const h of d)
        try {
          let f = null;
          if (h && h.slug) f = String(h.slug);
          else if (h && h.loc)
            try {
              f = new URL(String(h.loc)).searchParams.get("page");
            } catch {
            }
          if (!f) continue;
          const g = String(f).split("::")[0];
          if (!u.has(g)) {
            u.add(g);
            const m = Object.assign({}, h);
            m.baseSlug = g, l.push(m);
          }
        } catch {
        }
      try {
        et(() => "[runtimeSitemap] finalEntries.dedupedByBase: " + JSON.stringify(l, null, 2));
      } catch {
        et(() => "[runtimeSitemap] finalEntries.dedupedByBase (count): " + String(l.length));
      }
    } catch {
      try {
        l = Array.isArray(o && o.entries) ? o.entries.slice(0) : [];
      } catch {
        l = [];
      }
    }
    const c = Object.assign({}, o || {}, { entries: Array.isArray(l) ? l : Array.isArray(o && o.entries) ? o.entries : [] });
    try {
      if (typeof window < "u")
        try {
          window.__nimbiSitemapJson = c, window.__nimbiSitemapFinal = l;
        } catch {
        }
    } catch {
    }
    if (n) {
      const u = Array.isArray(c && c.entries) ? c.entries.length : 0;
      let d = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (d = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (d > u) {
        try {
          et("[runtimeSitemap] skip RSS write: existing rendered sitemap larger", d, u);
        } catch {
        }
        return !0;
      }
      return Zn(c, "application/rss+xml"), !0;
    }
    if (i) {
      const u = Array.isArray(c && c.entries) ? c.entries.length : 0;
      let d = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (d = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (d > u) {
        try {
          et("[runtimeSitemap] skip Atom write: existing rendered sitemap larger", d, u);
        } catch {
        }
        return !0;
      }
      return Zn(c, "application/atom+xml"), !0;
    }
    if (t) {
      const u = Array.isArray(c && c.entries) ? c.entries.length : 0;
      let d = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (d = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (d > u) {
        try {
          et("[runtimeSitemap] skip XML write: existing rendered sitemap larger", d, u);
        } catch {
        }
        return !0;
      }
      return Zn(c, "application/xml"), !0;
    }
    if (r)
      try {
        const d = (Array.isArray(c && c.entries) ? c.entries : []).length;
        let h = -1;
        try {
          typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (h = window.__nimbiSitemapFinal.length);
        } catch {
        }
        if (h > d) {
          try {
            et("[runtimeSitemap] skip HTML write: existing rendered sitemap larger", h, d);
          } catch {
          }
          return !0;
        }
        return Zn(c, "text/html"), !0;
      } catch (u) {
        return dn("[runtimeSitemap] render HTML failed", u), !1;
      }
    return !1;
  } catch (t) {
    return dn("[runtimeSitemap] handleSitemapRequest failed", t), !1;
  }
}
async function ac(e = {}) {
  try {
    const t = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
    let n = [];
    try {
      if (typeof Nt == "function")
        try {
          const s = await Nt({ timeoutMs: t, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 });
          Array.isArray(s) && s.length && (n = s);
        } catch {
        }
    } catch {
    }
    (!Array.isArray(n) || !n.length) && Array.isArray(ne) && ne.length && (n = ne), (!Array.isArray(n) || !n.length) && Array.isArray(e.index) && e.index.length && (n = e.index);
    const i = await ui(Object.assign({}, e, { index: n }));
    let r = [];
    try {
      const s = /* @__PURE__ */ new Set(), o = Array.isArray(i && i.entries) ? i.entries : [];
      for (const l of o)
        try {
          let c = null;
          if (l && l.slug) c = String(l.slug);
          else if (l && l.loc)
            try {
              c = new URL(String(l.loc)).searchParams.get("page");
            } catch {
              c = null;
            }
          if (!c) continue;
          const u = String(c).split("::")[0];
          if (!s.has(u)) {
            s.add(u);
            const d = Object.assign({}, l);
            d.baseSlug = u, r.push(d);
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
const An = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  exposeSitemapGlobals: ac,
  generateAtomXml: Ur,
  generateRssXml: Dr,
  generateSitemapJson: ui,
  generateSitemapXml: Fr,
  handleSitemapRequest: ic
}, Symbol.toStringTag, { value: "Module" }));
export {
  ta as BAD_LANGUAGES,
  Ce as SUPPORTED_HLJS_MAP,
  cc as _clearHooks,
  Zr as addHook,
  dc as default,
  Es as ensureBulma,
  tc as getVersion,
  dc as initCMS,
  aa as loadL10nFile,
  na as loadSupportedLanguages,
  vs as observeCodeBlocks,
  oc as onNavBuild,
  sc as onPageLoad,
  Cn as registerLanguage,
  Ai as runHooks,
  uc as setHighlightTheme,
  sa as setLang,
  Cs as setStyle,
  hc as setThemeVars,
  fn as t,
  lc as transformHtml
};
