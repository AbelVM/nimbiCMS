let $r = 0;
const Ti = /* @__PURE__ */ Object.create(null);
function zi(e) {
  try {
    const t = Number(e);
    $r = Number.isFinite(t) && t >= 0 ? Math.max(0, Math.min(3, Math.floor(t))) : 0;
  } catch {
    $r = 0;
  }
}
function Jt(e = 1) {
  try {
    return Number($r) >= Number(e || 1);
  } catch {
    return !1;
  }
}
function Kr() {
  return Jt(1);
}
function nr(...e) {
  try {
    if (!Jt(1) || !console || typeof console.error != "function") return;
    const t = e.map((n) => typeof n == "function" ? n() : n);
    console.error(...t);
  } catch {
  }
}
function k(...e) {
  try {
    if (!Jt(2) || !console || typeof console.warn != "function") return;
    const t = e.map((n) => typeof n == "function" ? n() : n);
    console.warn(...t);
  } catch {
  }
}
function $t(...e) {
  try {
    if (!Jt(3) || !console || typeof console.info != "function") return;
    const t = e.map((n) => typeof n == "function" ? n() : n);
    console.info(...t);
  } catch {
  }
}
function Bt(...e) {
  try {
    if (!Jt(3) || !console || typeof console.log != "function") return;
    const t = e.map((n) => typeof n == "function" ? n() : n);
    console.log(...t);
  } catch {
  }
}
function aa(e) {
  try {
    if (!Kr()) return;
    const t = String(e || "");
    if (!t) return;
    Ti[t] = (Ti[t] || 0) + 1;
  } catch {
  }
}
function sa(e) {
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
const Ln = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: []
};
function Vr(e, t) {
  if (!Object.prototype.hasOwnProperty.call(Ln, e))
    throw new Error('Unknown hook "' + e + '"');
  if (typeof t != "function")
    throw new TypeError("hook callback must be a function");
  Ln[e].push(t);
}
function mc(e) {
  Vr("onPageLoad", e);
}
function yc(e) {
  Vr("onNavBuild", e);
}
function bc(e) {
  Vr("transformHtml", e);
}
async function Ri(e, t) {
  const n = Ln[e] || [];
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
function wc() {
  Object.keys(Ln).forEach((e) => {
    Ln[e].length = 0;
  });
}
function oa(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ar, $i;
function vs() {
  if ($i) return Ar;
  $i = 1;
  function e(x) {
    return x instanceof Map ? x.clear = x.delete = x.set = function() {
      throw new Error("map is read-only");
    } : x instanceof Set && (x.add = x.clear = x.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(x), Object.getOwnPropertyNames(x).forEach((B) => {
      const ee = x[B], we = typeof ee;
      (we === "object" || we === "function") && !Object.isFrozen(ee) && e(ee);
    }), x;
  }
  class t {
    /**
     * @param {CompiledMode} mode
     */
    constructor(B) {
      B.data === void 0 && (B.data = {}), this.data = B.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  }
  function n(x) {
    return x.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function i(x, ...B) {
    const ee = /* @__PURE__ */ Object.create(null);
    for (const we in x)
      ee[we] = x[we];
    return B.forEach(function(we) {
      for (const Ue in we)
        ee[Ue] = we[Ue];
    }), /** @type {T} */
    ee;
  }
  const r = "</span>", a = (x) => !!x.scope, s = (x, { prefix: B }) => {
    if (x.startsWith("language:"))
      return x.replace("language:", "language-");
    if (x.includes(".")) {
      const ee = x.split(".");
      return [
        `${B}${ee.shift()}`,
        ...ee.map((we, Ue) => `${we}${"_".repeat(Ue + 1)}`)
      ].join(" ");
    }
    return `${B}${x}`;
  };
  class o {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(B, ee) {
      this.buffer = "", this.classPrefix = ee.classPrefix, B.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(B) {
      this.buffer += n(B);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(B) {
      if (!a(B)) return;
      const ee = s(
        B.scope,
        { prefix: this.classPrefix }
      );
      this.span(ee);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(B) {
      a(B) && (this.buffer += r);
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
    span(B) {
      this.buffer += `<span class="${B}">`;
    }
  }
  const l = (x = {}) => {
    const B = { children: [] };
    return Object.assign(B, x), B;
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
    add(B) {
      this.top.children.push(B);
    }
    /** @param {string} scope */
    openNode(B) {
      const ee = l({ scope: B });
      this.add(ee), this.stack.push(ee);
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
    walk(B) {
      return this.constructor._walk(B, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(B, ee) {
      return typeof ee == "string" ? B.addText(ee) : ee.children && (B.openNode(ee), ee.children.forEach((we) => this._walk(B, we)), B.closeNode(ee)), B;
    }
    /**
     * @param {Node} node
     */
    static _collapse(B) {
      typeof B != "string" && B.children && (B.children.every((ee) => typeof ee == "string") ? B.children = [B.children.join("")] : B.children.forEach((ee) => {
        c._collapse(ee);
      }));
    }
  }
  class u extends c {
    /**
     * @param {*} options
     */
    constructor(B) {
      super(), this.options = B;
    }
    /**
     * @param {string} text
     */
    addText(B) {
      B !== "" && this.add(B);
    }
    /** @param {string} scope */
    startScope(B) {
      this.openNode(B);
    }
    endScope() {
      this.closeNode();
    }
    /**
     * @param {Emitter & {root: DataNode}} emitter
     * @param {string} name
     */
    __addSublanguage(B, ee) {
      const we = B.root;
      ee && (we.scope = `language:${ee}`), this.add(we);
    }
    toHTML() {
      return new o(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function g(x) {
    return x ? typeof x == "string" ? x : x.source : null;
  }
  function h(x) {
    return m("(?=", x, ")");
  }
  function d(x) {
    return m("(?:", x, ")*");
  }
  function p(x) {
    return m("(?:", x, ")?");
  }
  function m(...x) {
    return x.map((ee) => g(ee)).join("");
  }
  function f(x) {
    const B = x[x.length - 1];
    return typeof B == "object" && B.constructor === Object ? (x.splice(x.length - 1, 1), B) : {};
  }
  function w(...x) {
    return "(" + (f(x).capture ? "" : "?:") + x.map((we) => g(we)).join("|") + ")";
  }
  function y(x) {
    return new RegExp(x.toString() + "|").exec("").length - 1;
  }
  function _(x, B) {
    const ee = x && x.exec(B);
    return ee && ee.index === 0;
  }
  const b = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function v(x, { joinWith: B }) {
    let ee = 0;
    return x.map((we) => {
      ee += 1;
      const Ue = ee;
      let We = g(we), oe = "";
      for (; We.length > 0; ) {
        const ae = b.exec(We);
        if (!ae) {
          oe += We;
          break;
        }
        oe += We.substring(0, ae.index), We = We.substring(ae.index + ae[0].length), ae[0][0] === "\\" && ae[1] ? oe += "\\" + String(Number(ae[1]) + Ue) : (oe += ae[0], ae[0] === "(" && ee++);
      }
      return oe;
    }).map((we) => `(${we})`).join(B);
  }
  const S = /\b\B/, E = "[a-zA-Z]\\w*", P = "[a-zA-Z_]\\w*", I = "\\b\\d+(\\.\\d+)?", U = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", z = "\\b(0b[01]+)", O = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", W = (x = {}) => {
    const B = /^#![ ]*\//;
    return x.binary && (x.begin = m(
      B,
      /.*\b/,
      x.binary,
      /\b.*/
    )), i({
      scope: "meta",
      begin: B,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (ee, we) => {
        ee.index !== 0 && we.ignoreMatch();
      }
    }, x);
  }, te = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, H = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [te]
  }, M = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [te]
  }, F = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, G = function(x, B, ee = {}) {
    const we = i(
      {
        scope: "comment",
        begin: x,
        end: B,
        contains: []
      },
      ee
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
    const Ue = w(
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
  }, ie = G("//", "$"), ye = G("/\\*", "\\*/"), J = G("#", "$"), Te = {
    scope: "number",
    begin: I,
    relevance: 0
  }, ke = {
    scope: "number",
    begin: U,
    relevance: 0
  }, xe = {
    scope: "number",
    begin: z,
    relevance: 0
  }, Ee = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      te,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [te]
      }
    ]
  }, He = {
    scope: "title",
    begin: E,
    relevance: 0
  }, R = {
    scope: "title",
    begin: P,
    relevance: 0
  }, N = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + P,
    relevance: 0
  };
  var A = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: H,
    BACKSLASH_ESCAPE: te,
    BINARY_NUMBER_MODE: xe,
    BINARY_NUMBER_RE: z,
    COMMENT: G,
    C_BLOCK_COMMENT_MODE: ye,
    C_LINE_COMMENT_MODE: ie,
    C_NUMBER_MODE: ke,
    C_NUMBER_RE: U,
    END_SAME_AS_BEGIN: function(x) {
      return Object.assign(
        x,
        {
          /** @type {ModeCallback} */
          "on:begin": (B, ee) => {
            ee.data._beginMatch = B[1];
          },
          /** @type {ModeCallback} */
          "on:end": (B, ee) => {
            ee.data._beginMatch !== B[1] && ee.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: J,
    IDENT_RE: E,
    MATCH_NOTHING_RE: S,
    METHOD_GUARD: N,
    NUMBER_MODE: Te,
    NUMBER_RE: I,
    PHRASAL_WORDS_MODE: F,
    QUOTE_STRING_MODE: M,
    REGEXP_MODE: Ee,
    RE_STARTERS_RE: O,
    SHEBANG: W,
    TITLE_MODE: He,
    UNDERSCORE_IDENT_RE: P,
    UNDERSCORE_TITLE_MODE: R
  });
  function L(x, B) {
    x.input[x.index - 1] === "." && B.ignoreMatch();
  }
  function D(x, B) {
    x.className !== void 0 && (x.scope = x.className, delete x.className);
  }
  function K(x, B) {
    B && x.beginKeywords && (x.begin = "\\b(" + x.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", x.__beforeBegin = L, x.keywords = x.keywords || x.beginKeywords, delete x.beginKeywords, x.relevance === void 0 && (x.relevance = 0));
  }
  function q(x, B) {
    Array.isArray(x.illegal) && (x.illegal = w(...x.illegal));
  }
  function $(x, B) {
    if (x.match) {
      if (x.begin || x.end) throw new Error("begin & end are not supported with match");
      x.begin = x.match, delete x.match;
    }
  }
  function T(x, B) {
    x.relevance === void 0 && (x.relevance = 1);
  }
  const j = (x, B) => {
    if (!x.beforeMatch) return;
    if (x.starts) throw new Error("beforeMatch cannot be used with starts");
    const ee = Object.assign({}, x);
    Object.keys(x).forEach((we) => {
      delete x[we];
    }), x.keywords = ee.keywords, x.begin = m(ee.beforeMatch, h(ee.begin)), x.starts = {
      relevance: 0,
      contains: [
        Object.assign(ee, { endsParent: !0 })
      ]
    }, x.relevance = 0, delete ee.beforeMatch;
  }, X = [
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
  function pe(x, B, ee = se) {
    const we = /* @__PURE__ */ Object.create(null);
    return typeof x == "string" ? Ue(ee, x.split(" ")) : Array.isArray(x) ? Ue(ee, x) : Object.keys(x).forEach(function(We) {
      Object.assign(
        we,
        pe(x[We], B, We)
      );
    }), we;
    function Ue(We, oe) {
      B && (oe = oe.map((ae) => ae.toLowerCase())), oe.forEach(function(ae) {
        const me = ae.split("|");
        we[me[0]] = [We, be(me[0], me[1])];
      });
    }
  }
  function be(x, B) {
    return B ? Number(B) : ge(x) ? 0 : 1;
  }
  function ge(x) {
    return X.includes(x.toLowerCase());
  }
  const Se = {}, ze = (x) => {
    console.error(x);
  }, Fe = (x, ...B) => {
    console.log(`WARN: ${x}`, ...B);
  }, Ge = (x, B) => {
    Se[`${x}/${B}`] || (console.log(`Deprecated as of ${x}. ${B}`), Se[`${x}/${B}`] = !0);
  }, Et = new Error();
  function un(x, B, { key: ee }) {
    let we = 0;
    const Ue = x[ee], We = {}, oe = {};
    for (let ae = 1; ae <= B.length; ae++)
      oe[ae + we] = Ue[ae], We[ae + we] = !0, we += y(B[ae - 1]);
    x[ee] = oe, x[ee]._emit = We, x[ee]._multi = !0;
  }
  function Ct(x) {
    if (Array.isArray(x.begin)) {
      if (x.skip || x.excludeBegin || x.returnBegin)
        throw ze("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Et;
      if (typeof x.beginScope != "object" || x.beginScope === null)
        throw ze("beginScope must be object"), Et;
      un(x, x.begin, { key: "beginScope" }), x.begin = v(x.begin, { joinWith: "" });
    }
  }
  function Ya(x) {
    if (Array.isArray(x.end)) {
      if (x.skip || x.excludeEnd || x.returnEnd)
        throw ze("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Et;
      if (typeof x.endScope != "object" || x.endScope === null)
        throw ze("endScope must be object"), Et;
      un(x, x.end, { key: "endScope" }), x.end = v(x.end, { joinWith: "" });
    }
  }
  function Ja(x) {
    x.scope && typeof x.scope == "object" && x.scope !== null && (x.beginScope = x.scope, delete x.scope);
  }
  function es(x) {
    Ja(x), typeof x.beginScope == "string" && (x.beginScope = { _wrap: x.beginScope }), typeof x.endScope == "string" && (x.endScope = { _wrap: x.endScope }), Ct(x), Ya(x);
  }
  function ts(x) {
    function B(oe, ae) {
      return new RegExp(
        g(oe),
        "m" + (x.case_insensitive ? "i" : "") + (x.unicodeRegex ? "u" : "") + (ae ? "g" : "")
      );
    }
    class ee {
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
        this.matcherRe = B(v(ae, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(ae) {
        this.matcherRe.lastIndex = this.lastIndex;
        const me = this.matcherRe.exec(ae);
        if (!me)
          return null;
        const Ve = me.findIndex((hn, wr) => wr > 0 && hn !== void 0), Ze = this.matchIndexes[Ve];
        return me.splice(0, Ve), Object.assign(me, Ze);
      }
    }
    class we {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(ae) {
        if (this.multiRegexes[ae]) return this.multiRegexes[ae];
        const me = new ee();
        return this.rules.slice(ae).forEach(([Ve, Ze]) => me.addRule(Ve, Ze)), me.compile(), this.multiRegexes[ae] = me, me;
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
        let Ve = me.exec(ae);
        if (this.resumingScanAtSamePosition() && !(Ve && Ve.index === this.lastIndex)) {
          const Ze = this.getMatcher(0);
          Ze.lastIndex = this.lastIndex + 1, Ve = Ze.exec(ae);
        }
        return Ve && (this.regexIndex += Ve.position + 1, this.regexIndex === this.count && this.considerAll()), Ve;
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
        D,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        $,
        es,
        j
      ].forEach((Ze) => Ze(oe, ae)), x.compilerExtensions.forEach((Ze) => Ze(oe, ae)), oe.__beforeBegin = null, [
        K,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        q,
        // default to 1 relevance if not specified
        T
      ].forEach((Ze) => Ze(oe, ae)), oe.isCompiled = !0;
      let Ve = null;
      return typeof oe.keywords == "object" && oe.keywords.$pattern && (oe.keywords = Object.assign({}, oe.keywords), Ve = oe.keywords.$pattern, delete oe.keywords.$pattern), Ve = Ve || /\w+/, oe.keywords && (oe.keywords = pe(oe.keywords, x.case_insensitive)), me.keywordPatternRe = B(Ve, !0), ae && (oe.begin || (oe.begin = /\B|\b/), me.beginRe = B(me.begin), !oe.end && !oe.endsWithParent && (oe.end = /\B|\b/), oe.end && (me.endRe = B(me.end)), me.terminatorEnd = g(me.end) || "", oe.endsWithParent && ae.terminatorEnd && (me.terminatorEnd += (oe.end ? "|" : "") + ae.terminatorEnd)), oe.illegal && (me.illegalRe = B(
        /** @type {RegExp | string} */
        oe.illegal
      )), oe.contains || (oe.contains = []), oe.contains = [].concat(...oe.contains.map(function(Ze) {
        return ns(Ze === "self" ? oe : Ze);
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
  function bi(x) {
    return x ? x.endsWithParent || bi(x.starts) : !1;
  }
  function ns(x) {
    return x.variants && !x.cachedVariants && (x.cachedVariants = x.variants.map(function(B) {
      return i(x, { variants: null }, B);
    })), x.cachedVariants ? x.cachedVariants : bi(x) ? i(x, { starts: x.starts ? i(x.starts) : null }) : Object.isFrozen(x) ? i(x) : x;
  }
  var rs = "11.11.1";
  class is extends Error {
    constructor(B, ee) {
      super(B), this.name = "HTMLInjectionError", this.html = ee;
    }
  }
  const br = n, wi = i, _i = /* @__PURE__ */ Symbol("nomatch"), as = 7, ki = function(x) {
    const B = /* @__PURE__ */ Object.create(null), ee = /* @__PURE__ */ Object.create(null), we = [];
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
    function me(Q) {
      return ae.noHighlightRe.test(Q);
    }
    function Ve(Q) {
      let ue = Q.className + " ";
      ue += Q.parentNode ? Q.parentNode.className : "";
      const Me = ae.languageDetectRe.exec(ue);
      if (Me) {
        const Be = Tt(Me[1]);
        return Be || (Fe(We.replace("{}", Me[1])), Fe("Falling back to no-highlight mode for this block.", Q)), Be ? Me[1] : "no-highlight";
      }
      return ue.split(/\s+/).find((Be) => me(Be) || Tt(Be));
    }
    function Ze(Q, ue, Me) {
      let Be = "", Xe = "";
      typeof ue == "object" ? (Be = Q, Me = ue.ignoreIllegals, Xe = ue.language) : (Ge("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Ge("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), Xe = Q, Be = ue), Me === void 0 && (Me = !0);
      const yt = {
        code: Be,
        language: Xe
      };
      jn("before:highlight", yt);
      const zt = yt.result ? yt.result : hn(yt.language, yt.code, Me);
      return zt.code = yt.code, jn("after:highlight", zt), zt;
    }
    function hn(Q, ue, Me, Be) {
      const Xe = /* @__PURE__ */ Object.create(null);
      function yt(ne, ce) {
        return ne.keywords[ce];
      }
      function zt() {
        if (!_e.keywords) {
          Ye.addText(je);
          return;
        }
        let ne = 0;
        _e.keywordPatternRe.lastIndex = 0;
        let ce = _e.keywordPatternRe.exec(je), ve = "";
        for (; ce; ) {
          ve += je.substring(ne, ce.index);
          const Ie = kt.case_insensitive ? ce[0].toLowerCase() : ce[0], Je = yt(_e, Ie);
          if (Je) {
            const [Mt, xs] = Je;
            if (Ye.addText(ve), ve = "", Xe[Ie] = (Xe[Ie] || 0) + 1, Xe[Ie] <= as && (Fn += xs), Mt.startsWith("_"))
              ve += ce[0];
            else {
              const Ss = kt.classNameAliases[Mt] || Mt;
              _t(ce[0], Ss);
            }
          } else
            ve += ce[0];
          ne = _e.keywordPatternRe.lastIndex, ce = _e.keywordPatternRe.exec(je);
        }
        ve += je.substring(ne), Ye.addText(ve);
      }
      function qn() {
        if (je === "") return;
        let ne = null;
        if (typeof _e.subLanguage == "string") {
          if (!B[_e.subLanguage]) {
            Ye.addText(je);
            return;
          }
          ne = hn(_e.subLanguage, je, !0, Li[_e.subLanguage]), Li[_e.subLanguage] = /** @type {CompiledMode} */
          ne._top;
        } else
          ne = _r(je, _e.subLanguage.length ? _e.subLanguage : null);
        _e.relevance > 0 && (Fn += ne.relevance), Ye.__addSublanguage(ne._emitter, ne.language);
      }
      function lt() {
        _e.subLanguage != null ? qn() : zt(), je = "";
      }
      function _t(ne, ce) {
        ne !== "" && (Ye.startScope(ce), Ye.addText(ne), Ye.endScope());
      }
      function Ai(ne, ce) {
        let ve = 1;
        const Ie = ce.length - 1;
        for (; ve <= Ie; ) {
          if (!ne._emit[ve]) {
            ve++;
            continue;
          }
          const Je = kt.classNameAliases[ne[ve]] || ne[ve], Mt = ce[ve];
          Je ? _t(Mt, Je) : (je = Mt, zt(), je = ""), ve++;
        }
      }
      function Ei(ne, ce) {
        return ne.scope && typeof ne.scope == "string" && Ye.openNode(kt.classNameAliases[ne.scope] || ne.scope), ne.beginScope && (ne.beginScope._wrap ? (_t(je, kt.classNameAliases[ne.beginScope._wrap] || ne.beginScope._wrap), je = "") : ne.beginScope._multi && (Ai(ne.beginScope, ce), je = "")), _e = Object.create(ne, { parent: { value: _e } }), _e;
      }
      function Ci(ne, ce, ve) {
        let Ie = _(ne.endRe, ve);
        if (Ie) {
          if (ne["on:end"]) {
            const Je = new t(ne);
            ne["on:end"](ce, Je), Je.isMatchIgnored && (Ie = !1);
          }
          if (Ie) {
            for (; ne.endsParent && ne.parent; )
              ne = ne.parent;
            return ne;
          }
        }
        if (ne.endsWithParent)
          return Ci(ne.parent, ce, ve);
      }
      function ys(ne) {
        return _e.matcher.regexIndex === 0 ? (je += ne[0], 1) : (vr = !0, 0);
      }
      function bs(ne) {
        const ce = ne[0], ve = ne.rule, Ie = new t(ve), Je = [ve.__beforeBegin, ve["on:begin"]];
        for (const Mt of Je)
          if (Mt && (Mt(ne, Ie), Ie.isMatchIgnored))
            return ys(ce);
        return ve.skip ? je += ce : (ve.excludeBegin && (je += ce), lt(), !ve.returnBegin && !ve.excludeBegin && (je = ce)), Ei(ve, ne), ve.returnBegin ? 0 : ce.length;
      }
      function ws(ne) {
        const ce = ne[0], ve = ue.substring(ne.index), Ie = Ci(_e, ne, ve);
        if (!Ie)
          return _i;
        const Je = _e;
        _e.endScope && _e.endScope._wrap ? (lt(), _t(ce, _e.endScope._wrap)) : _e.endScope && _e.endScope._multi ? (lt(), Ai(_e.endScope, ne)) : Je.skip ? je += ce : (Je.returnEnd || Je.excludeEnd || (je += ce), lt(), Je.excludeEnd && (je = ce));
        do
          _e.scope && Ye.closeNode(), !_e.skip && !_e.subLanguage && (Fn += _e.relevance), _e = _e.parent;
        while (_e !== Ie.parent);
        return Ie.starts && Ei(Ie.starts, ne), Je.returnEnd ? 0 : ce.length;
      }
      function _s() {
        const ne = [];
        for (let ce = _e; ce !== kt; ce = ce.parent)
          ce.scope && ne.unshift(ce.scope);
        ne.forEach((ce) => Ye.openNode(ce));
      }
      let Hn = {};
      function Mi(ne, ce) {
        const ve = ce && ce[0];
        if (je += ne, ve == null)
          return lt(), 0;
        if (Hn.type === "begin" && ce.type === "end" && Hn.index === ce.index && ve === "") {
          if (je += ue.slice(ce.index, ce.index + 1), !Ue) {
            const Ie = new Error(`0 width match regex (${Q})`);
            throw Ie.languageName = Q, Ie.badRule = Hn.rule, Ie;
          }
          return 1;
        }
        if (Hn = ce, ce.type === "begin")
          return bs(ce);
        if (ce.type === "illegal" && !Me) {
          const Ie = new Error('Illegal lexeme "' + ve + '" for mode "' + (_e.scope || "<unnamed>") + '"');
          throw Ie.mode = _e, Ie;
        } else if (ce.type === "end") {
          const Ie = ws(ce);
          if (Ie !== _i)
            return Ie;
        }
        if (ce.type === "illegal" && ve === "")
          return je += `
`, 1;
        if (Sr > 1e5 && Sr > ce.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return je += ve, ve.length;
      }
      const kt = Tt(Q);
      if (!kt)
        throw ze(We.replace("{}", Q)), new Error('Unknown language: "' + Q + '"');
      const ks = ts(kt);
      let xr = "", _e = Be || ks;
      const Li = {}, Ye = new ae.__emitter(ae);
      _s();
      let je = "", Fn = 0, Ft = 0, Sr = 0, vr = !1;
      try {
        if (kt.__emitTokens)
          kt.__emitTokens(ue, Ye);
        else {
          for (_e.matcher.considerAll(); ; ) {
            Sr++, vr ? vr = !1 : _e.matcher.considerAll(), _e.matcher.lastIndex = Ft;
            const ne = _e.matcher.exec(ue);
            if (!ne) break;
            const ce = ue.substring(Ft, ne.index), ve = Mi(ce, ne);
            Ft = ne.index + ve;
          }
          Mi(ue.substring(Ft));
        }
        return Ye.finalize(), xr = Ye.toHTML(), {
          language: Q,
          value: xr,
          relevance: Fn,
          illegal: !1,
          _emitter: Ye,
          _top: _e
        };
      } catch (ne) {
        if (ne.message && ne.message.includes("Illegal"))
          return {
            language: Q,
            value: br(ue),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: ne.message,
              index: Ft,
              context: ue.slice(Ft - 100, Ft + 100),
              mode: ne.mode,
              resultSoFar: xr
            },
            _emitter: Ye
          };
        if (Ue)
          return {
            language: Q,
            value: br(ue),
            illegal: !1,
            relevance: 0,
            errorRaised: ne,
            _emitter: Ye,
            _top: _e
          };
        throw ne;
      }
    }
    function wr(Q) {
      const ue = {
        value: br(Q),
        illegal: !1,
        relevance: 0,
        _top: oe,
        _emitter: new ae.__emitter(ae)
      };
      return ue._emitter.addText(Q), ue;
    }
    function _r(Q, ue) {
      ue = ue || ae.languages || Object.keys(B);
      const Me = wr(Q), Be = ue.filter(Tt).filter(vi).map(
        (lt) => hn(lt, Q, !1)
      );
      Be.unshift(Me);
      const Xe = Be.sort((lt, _t) => {
        if (lt.relevance !== _t.relevance) return _t.relevance - lt.relevance;
        if (lt.language && _t.language) {
          if (Tt(lt.language).supersetOf === _t.language)
            return 1;
          if (Tt(_t.language).supersetOf === lt.language)
            return -1;
        }
        return 0;
      }), [yt, zt] = Xe, qn = yt;
      return qn.secondBest = zt, qn;
    }
    function ss(Q, ue, Me) {
      const Be = ue && ee[ue] || Me;
      Q.classList.add("hljs"), Q.classList.add(`language-${Be}`);
    }
    function kr(Q) {
      let ue = null;
      const Me = Ve(Q);
      if (me(Me)) return;
      if (jn(
        "before:highlightElement",
        { el: Q, language: Me }
      ), Q.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", Q);
        return;
      }
      if (Q.children.length > 0 && (ae.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(Q)), ae.throwUnescapedHTML))
        throw new is(
          "One of your code blocks includes unescaped HTML.",
          Q.innerHTML
        );
      ue = Q;
      const Be = ue.textContent, Xe = Me ? Ze(Be, { language: Me, ignoreIllegals: !0 }) : _r(Be);
      Q.innerHTML = Xe.value, Q.dataset.highlighted = "yes", ss(Q, Me, Xe.language), Q.result = {
        language: Xe.language,
        // TODO: remove with version 11.0
        re: Xe.relevance,
        relevance: Xe.relevance
      }, Xe.secondBest && (Q.secondBest = {
        language: Xe.secondBest.language,
        relevance: Xe.secondBest.relevance
      }), jn("after:highlightElement", { el: Q, result: Xe, text: Be });
    }
    function os(Q) {
      ae = wi(ae, Q);
    }
    const ls = () => {
      Bn(), Ge("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function cs() {
      Bn(), Ge("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let xi = !1;
    function Bn() {
      function Q() {
        Bn();
      }
      if (document.readyState === "loading") {
        xi || window.addEventListener("DOMContentLoaded", Q, !1), xi = !0;
        return;
      }
      document.querySelectorAll(ae.cssSelector).forEach(kr);
    }
    function us(Q, ue) {
      let Me = null;
      try {
        Me = ue(x);
      } catch (Be) {
        if (ze("Language definition for '{}' could not be registered.".replace("{}", Q)), Ue)
          ze(Be);
        else
          throw Be;
        Me = oe;
      }
      Me.name || (Me.name = Q), B[Q] = Me, Me.rawDefinition = ue.bind(null, x), Me.aliases && Si(Me.aliases, { languageName: Q });
    }
    function hs(Q) {
      delete B[Q];
      for (const ue of Object.keys(ee))
        ee[ue] === Q && delete ee[ue];
    }
    function ds() {
      return Object.keys(B);
    }
    function Tt(Q) {
      return Q = (Q || "").toLowerCase(), B[Q] || B[ee[Q]];
    }
    function Si(Q, { languageName: ue }) {
      typeof Q == "string" && (Q = [Q]), Q.forEach((Me) => {
        ee[Me.toLowerCase()] = ue;
      });
    }
    function vi(Q) {
      const ue = Tt(Q);
      return ue && !ue.disableAutodetect;
    }
    function fs(Q) {
      Q["before:highlightBlock"] && !Q["before:highlightElement"] && (Q["before:highlightElement"] = (ue) => {
        Q["before:highlightBlock"](
          Object.assign({ block: ue.el }, ue)
        );
      }), Q["after:highlightBlock"] && !Q["after:highlightElement"] && (Q["after:highlightElement"] = (ue) => {
        Q["after:highlightBlock"](
          Object.assign({ block: ue.el }, ue)
        );
      });
    }
    function gs(Q) {
      fs(Q), we.push(Q);
    }
    function ps(Q) {
      const ue = we.indexOf(Q);
      ue !== -1 && we.splice(ue, 1);
    }
    function jn(Q, ue) {
      const Me = Q;
      we.forEach(function(Be) {
        Be[Me] && Be[Me](ue);
      });
    }
    function ms(Q) {
      return Ge("10.7.0", "highlightBlock will be removed entirely in v12.0"), Ge("10.7.0", "Please use highlightElement now."), kr(Q);
    }
    Object.assign(x, {
      highlight: Ze,
      highlightAuto: _r,
      highlightAll: Bn,
      highlightElement: kr,
      // TODO: Remove with v12 API
      highlightBlock: ms,
      configure: os,
      initHighlighting: ls,
      initHighlightingOnLoad: cs,
      registerLanguage: us,
      unregisterLanguage: hs,
      listLanguages: ds,
      getLanguage: Tt,
      registerAliases: Si,
      autoDetection: vi,
      inherit: wi,
      addPlugin: gs,
      removePlugin: ps
    }), x.debugMode = function() {
      Ue = !1;
    }, x.safeMode = function() {
      Ue = !0;
    }, x.versionString = rs, x.regex = {
      concat: m,
      lookahead: h,
      either: w,
      optional: p,
      anyNumberOfTimes: d
    };
    for (const Q in A)
      typeof A[Q] == "object" && e(A[Q]);
    return Object.assign(x, A), x;
  }, en = ki({});
  return en.newInstance = () => ki({}), Ar = en, en.HighlightJS = en, en.default = en, Ar;
}
var As = /* @__PURE__ */ vs();
const Re = /* @__PURE__ */ oa(As);
class hr {
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
const Qn = new hr({ maxSize: 500 });
let la = 300 * 1e3;
function Es() {
  Qn.clear();
}
function Cs(e) {
  la = Number(e) || 0;
}
async function Yr(e, t) {
  try {
    if (!e) return null;
    const n = Date.now();
    let i = Qn.get(e);
    if (i && i.ok === !1 && n - (i.ts || 0) >= la && (Qn.delete(e), i = void 0), i) {
      if (i.module) return i.module;
      if (i.promise)
        try {
          return await i.promise;
        } catch {
          return null;
        }
    }
    const r = { promise: null, module: null, ok: null, ts: Date.now() };
    Qn.set(e, r), r.promise = (async () => {
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
async function Ms(e) {
  return await Yr(e, async () => {
    try {
      return await import(e);
    } catch {
      return null;
    }
  });
}
const Ls = "11.11.1", Ce = /* @__PURE__ */ new Map(), Ts = "https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md", ht = {
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
const ca = /* @__PURE__ */ new Set(["magic", "undefined"]);
let Nt = null, zs = null;
async function ua(e = Ts) {
  if (e)
    return Nt || (Nt = (async () => {
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
          const g = u.replace(/^\||\|$/g, "").split("|").map((f) => f.trim());
          if (g.every((f) => /^-+$/.test(f))) continue;
          const h = g;
          if (!h.length) continue;
          const p = (h[o] || h[0] || "").toString().trim().toLowerCase();
          if (!p || /^-+$/.test(p)) continue;
          Ce.set(p, p);
          const m = h[s] || "";
          if (m) {
            const f = String(m).split(",").map((w) => w.replace(/`/g, "").trim()).filter(Boolean);
            if (f.length) {
              const y = f[0].toLowerCase().replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
              y && /[a-z0-9]/i.test(y) && (Ce.set(y, y), l.push(y));
            }
          }
        }
        try {
          const c = [];
          for (const u of l) {
            const g = String(u || "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
            g && /[a-z0-9]/i.test(g) ? c.push(g) : Ce.delete(u);
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
              const g = u.replace(/^[:]+/, "");
              if (g && /[a-z0-9]/i.test(g)) {
                const h = Ce.get(u);
                Ce.delete(u), Ce.set(g, h);
              } else
                Ce.delete(u), c++;
            }
          }
          for (const [u, g] of Array.from(Ce.entries()))
            (!g || /^-+$/.test(g) || !/[a-z0-9]/i.test(g)) && (Ce.delete(u), c++);
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
    })(), Nt);
}
const dn = /* @__PURE__ */ new Set();
async function Tn(e, t) {
  if (Nt || (async () => {
    try {
      await ua();
    } catch (r) {
      k("[codeblocksManager] loadSupportedLanguages (IIFE) failed", r);
    }
  })(), Nt)
    try {
      await Nt;
    } catch {
    }
  if (e = e == null ? "" : String(e), e = e.trim(), !e) return !1;
  const n = e.toLowerCase();
  if (ca.has(n)) return !1;
  if (Ce.size && !Ce.has(n)) {
    const r = ht;
    if (!r[n] && !r[e])
      return !1;
  }
  if (dn.has(e)) return !0;
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
      const g = ht[u];
      return !!(g && Ce.has(g));
    }));
    let l = null, c = null;
    for (const u of o)
      try {
        if (l = await Yr(u, async () => {
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
          const g = l.default || l;
          try {
            const h = Ce.size && Ce.get(e) || u || e;
            return Re.registerLanguage(h, g), dn.add(h), h !== e && (Re.registerLanguage(e, g), dn.add(e)), !0;
          } catch (h) {
            c = h;
          }
        } else
          try {
            if (Ce.has(u) || Ce.has(e)) {
              const g = () => ({});
              try {
                Re.registerLanguage(u, g), dn.add(u);
              } catch {
              }
              try {
                u !== e && (Re.registerLanguage(e, g), dn.add(e));
              } catch {
              }
              return !0;
            }
          } catch {
          }
      } catch (g) {
        c = g;
      }
    if (c)
      throw c;
    return !1;
  } catch {
    return !1;
  }
}
let Dn = null;
function Rs(e) {
  const t = e && e.querySelector ? e : typeof document < "u" ? document : null;
  Nt || (async () => {
    try {
      await ua();
    } catch (s) {
      k("[codeblocksManager] loadSupportedLanguages (observer) failed", s);
    }
  })();
  const n = ht, r = Dn || (typeof IntersectionObserver > "u" ? null : (Dn = new IntersectionObserver((s, o) => {
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
          const u = c.getAttribute && c.getAttribute("class") || c.className || "", g = u.match(/language-([a-zA-Z0-9_+-]+)/) || u.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (g && g[1]) {
            const h = (g[1] || "").toLowerCase(), d = n[h] || h, p = Ce.size && (Ce.get(d) || Ce.get(String(d).toLowerCase())) || d;
            try {
              await Tn(p);
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
                  const d = Re.highlight(h, { language: "plaintext" });
                  if (d && d.value)
                    try {
                      if (typeof document < "u" && document.createRange && typeof document.createRange == "function") {
                        const p = document.createRange().createContextualFragment(d.value);
                        if (typeof c.replaceChildren == "function") c.replaceChildren(...Array.from(p.childNodes));
                        else {
                          for (; c.firstChild; ) c.removeChild(c.firstChild);
                          c.appendChild(p);
                        }
                      } else
                        c.innerHTML = d.value;
                    } catch {
                      try {
                        c.innerHTML = d.value;
                      } catch {
                      }
                    }
                }
              } catch {
                try {
                  Re.highlightElement(c);
                } catch (p) {
                  k("[codeblocksManager] fallback highlightElement failed", p);
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
  }, { root: null, rootMargin: "300px", threshold: 0.1 }), Dn)), a = t && t.querySelectorAll ? t.querySelectorAll("pre code") : [];
  if (!r) {
    a.forEach(async (s) => {
      try {
        const o = s.getAttribute && s.getAttribute("class") || s.className || "", l = o.match(/language-([a-zA-Z0-9_+-]+)/) || o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (l && l[1]) {
          const c = (l[1] || "").toLowerCase(), u = n[c] || c, g = Ce.size && (Ce.get(u) || Ce.get(String(u).toLowerCase())) || u;
          try {
            await Tn(g);
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
function _c(e, { useCdn: t = !0 } = {}) {
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
  const s = a, o = `https://cdn.jsdelivr.net/npm/highlight.js@${Ls}/styles/${s}.css`, l = document.createElement("link");
  l.rel = "stylesheet", l.href = o, l.setAttribute("data-hl-theme", s), l.addEventListener("load", () => {
    try {
      n && n.parentNode && n.parentNode.removeChild(n);
    } catch {
    }
  }), document.head.appendChild(l);
}
let Dt = "light";
function $s(e, t = {}) {
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
function Er() {
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
async function Ps(e = "none", t = "/") {
  try {
    Bt("[bulmaManager] ensureBulma called", { bulmaCustomize: e, pageDir: t });
  } catch {
  }
  if (!e) return;
  if (e === "none") {
    try {
      Er();
    } catch {
    }
    return;
  }
  const n = [t + "bulma.css", "/bulma.css"], i = Array.from(new Set(n));
  if (e === "local") {
    if (Er(), document.querySelector("style[data-bulma-override]")) return;
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
    Er();
    const a = `https://unpkg.com/bulmaswatch/${encodeURIComponent(r)}/bulmaswatch.min.css`;
    $s(a, { "data-bulmaswatch-theme": r });
  } catch (r) {
    k("[bulmaManager] ensureBulma failed", r);
  }
}
function Is(e) {
  Dt = e === "dark" ? "dark" : e === "system" ? "system" : "light";
  try {
    const t = Array.from(document.querySelectorAll(".nimbi-mount"));
    if (t.length > 0)
      for (const n of t)
        Dt === "dark" ? n.setAttribute("data-theme", "dark") : Dt === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    else {
      const n = document.documentElement;
      Dt === "dark" ? n.setAttribute("data-theme", "dark") : Dt === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    }
  } catch {
  }
}
function kc(e) {
  const t = document.documentElement;
  for (const [n, i] of Object.entries(e || {}))
    try {
      t.style.setProperty(`--${n}`, i);
    } catch (r) {
      k("[bulmaManager] setThemeVars failed for", n, r);
    }
}
function ha(e) {
  if (!e || !(e instanceof HTMLElement)) return () => {
  };
  const t = e.closest && e.closest(".nimbi-mount") || null;
  try {
    t && (Dt === "dark" ? t.setAttribute("data-theme", "dark") : Dt === "light" ? t.setAttribute("data-theme", "light") : t.removeAttribute("data-theme"));
  } catch {
  }
  return () => {
  };
}
const da = {
  en: {
    navigation: "Navigation",
    onThisPage: "On this page",
    home: "Home",
    scrollToTop: "Scroll to top",
    readingTime: "{minutes} min read",
    searchPlaceholder: "Search…",
    searchNoResults: "No results",
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
    searchNoResults: "Sin resultados",
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
    searchNoResults: "Keine Ergebnisse",
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
    searchNoResults: "Aucun résultat",
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
    searchNoResults: "Sem resultados",
    imagePreviewTitle: "Visualização da imagem",
    imagePreviewFit: "Ajustar à tela",
    imagePreviewOriginal: "Tamanho original",
    imagePreviewZoomOut: "Diminuir",
    imagePreviewZoomIn: "Aumentar",
    imagePreviewClose: "Fechar"
  }
}, rn = JSON.parse(JSON.stringify(da));
let rr = "en";
if (typeof navigator < "u") {
  const e = navigator.language || navigator.languages && navigator.languages[0] || "en";
  rr = String(e).split("-")[0].toLowerCase();
}
da[rr] || (rr = "en");
let jt = rr;
function yn(e, t = {}) {
  const n = rn[jt] || rn.en;
  let i = n && n[e] ? n[e] : rn.en[e] || "";
  for (const r of Object.keys(t))
    i = i.replace(new RegExp(`{${r}}`, "g"), String(t[r]));
  return i;
}
async function fa(e, t) {
  if (!e) return;
  let n = e;
  try {
    /^https?:\/\//.test(e) || (n = new URL(e, location.origin + t).toString());
    const i = await fetch(n);
    if (!i.ok) return;
    const r = await i.json();
    for (const a of Object.keys(r || {}))
      rn[a] = Object.assign({}, rn[a] || {}, r[a]);
  } catch {
  }
}
function ga(e) {
  const t = String(e).split("-")[0].toLowerCase();
  jt = rn[t] ? t : "en";
}
const Ns = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get currentLang() {
    return jt;
  },
  loadL10nFile: fa,
  setLang: ga,
  t: yn
}, Symbol.toStringTag, { value: "Module" }));
function Os(e) {
  try {
    return String(e || "").split("/").map((t) => encodeURIComponent(t)).join("/");
  } catch {
    return String(e || "");
  }
}
function Pi(e, t = null, n = void 0) {
  let r = "#/" + Os(String(e || ""));
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
let Un = typeof DOMParser < "u" ? new DOMParser() : null;
function qe() {
  return Un || (typeof DOMParser < "u" ? (Un = new DOMParser(), Un) : null);
}
async function zn(e, t, n = 4) {
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
const Bs = `/**
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
function js(e, t = "worker") {
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
    return new Promise((u, g) => {
      const h = r();
      if (!h) return g(new Error("worker unavailable"));
      const d = String(Math.random()), p = Object.assign({}, l, { id: d });
      let m = null;
      const f = () => {
        m && clearTimeout(m), h.removeEventListener("message", w), h.removeEventListener("error", y);
      }, w = (_) => {
        const b = _.data || {};
        b.id === d && (f(), b.error ? g(new Error(b.error)) : u(b.result));
      }, y = (_) => {
        f(), i("[" + t + "] worker error event", _);
        try {
          n === h && (n = null, h.terminate && h.terminate());
        } catch (b) {
          i("[" + t + "] worker termination failed", b);
        }
        g(new Error(_ && _.message || "worker error"));
      };
      m = setTimeout(() => {
        f(), i("[" + t + "] worker timed out");
        try {
          n === h && (n = null, h.terminate && h.terminate());
        } catch (_) {
          i("[" + t + "] worker termination on timeout failed", _);
        }
        g(new Error("worker timeout"));
      }, c), h.addEventListener("message", w), h.addEventListener("error", y);
      try {
        h.postMessage(p);
      } catch (_) {
        f(), g(_);
      }
    });
  }
  return { get: r, send: s, terminate: a };
}
function pa(e, t = "worker-pool", n = 2) {
  const i = new Array(n).fill(null);
  let r = 0;
  function a(...p) {
    try {
      k(...p);
    } catch {
    }
  }
  function s(p) {
    if (!i[p])
      try {
        const m = e();
        i[p] = m || null, m && m.addEventListener("error", () => {
          try {
            i[p] === m && (i[p] = null, m.terminate && m.terminate());
          } catch (f) {
            a("[" + t + "] worker termination failed", f);
          }
        });
      } catch (m) {
        i[p] = null, a("[" + t + "] worker init failed", m);
      }
    return i[p];
  }
  const o = new Array(n).fill(0), l = new Array(n).fill(null), c = 30 * 1e3;
  function u(p) {
    try {
      o[p] = Date.now(), l[p] && (clearTimeout(l[p]), l[p] = null), l[p] = setTimeout(() => {
        try {
          i[p] && (i[p].terminate && i[p].terminate(), i[p] = null);
        } catch (m) {
          a("[" + t + "] idle termination failed", m);
        }
        l[p] = null;
      }, c);
    } catch {
    }
  }
  function g() {
    for (let p = 0; p < i.length; p++) {
      const m = s(p);
      if (m) return m;
    }
    return null;
  }
  function h() {
    for (let p = 0; p < i.length; p++)
      try {
        i[p] && (i[p].terminate && i[p].terminate(), i[p] = null);
      } catch (m) {
        a("[" + t + "] worker termination failed", m);
      }
  }
  function d(p, m = 1e4) {
    return new Promise((f, w) => {
      const y = r++ % i.length, _ = (b) => {
        const v = (y + b) % i.length, S = s(v);
        if (!S)
          return b + 1 < i.length ? _(b + 1) : w(new Error("worker pool unavailable"));
        const E = String(Math.random()), P = Object.assign({}, p, { id: E });
        let I = null;
        const U = () => {
          I && clearTimeout(I), S.removeEventListener("message", z), S.removeEventListener("error", O);
        }, z = (W) => {
          const te = W.data || {};
          te.id === E && (U(), te.error ? w(new Error(te.error)) : f(te.result));
        }, O = (W) => {
          U(), a("[" + t + "] worker error event", W);
          try {
            i[v] === S && (i[v] = null, S.terminate && S.terminate());
          } catch (te) {
            a("[" + t + "] worker termination failed", te);
          }
          w(new Error(W && W.message || "worker error"));
        };
        I = setTimeout(() => {
          U(), a("[" + t + "] worker timed out");
          try {
            i[v] === S && (i[v] = null, S.terminate && S.terminate());
          } catch (W) {
            a("[" + t + "] worker termination on timeout failed", W);
          }
          w(new Error("worker timeout"));
        }, m), S.addEventListener("message", z), S.addEventListener("error", O);
        try {
          u(v), S.postMessage(P);
        } catch (W) {
          U(), w(W);
        }
      };
      _(0);
    });
  }
  return { get: g, send: d, terminate: h };
}
function qs(e, t, n = "worker") {
  return js(() => {
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
        Zt._blobUrlCache || (Zt._blobUrlCache = new hr({ maxSize: 200, onEvict: (i, r) => {
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
function Hs() {
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
    e % t === 0 && await Hs();
  } catch {
  }
}
const rt = /* @__PURE__ */ new Set();
function Gt(e) {
  if (Fs(), rt.clear(), Array.isArray(Ne) && Ne.length)
    for (const t of Ne)
      t && rt.add(t);
  else
    for (const t of $e)
      t && rt.add(t);
  Ii(V), Ii(Z), Gt._refreshed = !0;
}
function Ii(e) {
  if (!(!e || typeof e.values != "function"))
    for (const t of e.values())
      t && rt.add(t);
}
function Ni(e) {
  if (!e || typeof e.set != "function") return;
  const t = e.set;
  e.set = function(n, i) {
    return i && rt.add(i), t.call(this, n, i);
  };
}
let Oi = !1;
function Fs() {
  Oi || (Ni(V), Ni(Z), Oi = !0);
}
const Cr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  indexSet: rt,
  refreshIndexPaths: Gt
}, Symbol.toStringTag, { value: "Module" }));
function cn(e, t = 1e3) {
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
function Pr(e) {
  return !e || typeof e != "string" ? !1 : /^(https?:)?\/\//.test(e) || e.startsWith("mailto:") || e.startsWith("tel:");
}
const Y = cn(function(e) {
  return String(e || "").replace(/^[.\/]+/, "");
}, 2e3), sn = cn(function(e) {
  return String(e || "").replace(/\/+$/, "");
}, 2e3), Kt = cn(function(e) {
  return sn(String(e || "")) + "/";
}, 2e3);
function Ds(e) {
  try {
    if (!e || typeof document > "u" || !document.head || e.startsWith("data:") || document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`)) return;
    const n = document.createElement("link");
    n.rel = "preload", n.as = "image", n.href = e, document.head.appendChild(n);
  } catch (t) {
    k("[helpers] preloadImage failed", t);
  }
}
function Wn(e, t = 0, n = !1) {
  try {
    if (typeof window > "u" || !e || !e.querySelectorAll) return;
    const i = Array.from(e.querySelectorAll("img"));
    if (!i.length) return;
    const r = e, a = r && r.getBoundingClientRect ? r.getBoundingClientRect() : null, s = 0, o = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, l = a ? Math.max(s, a.top) : s, u = (a ? Math.min(o, a.bottom) : o) + Number(t || 0);
    let g = 0;
    r && (g = r.clientHeight || (a ? a.height : 0)), g || (g = o - s);
    let h = 0.6;
    try {
      const f = r && window.getComputedStyle ? window.getComputedStyle(r) : null, w = f && f.getPropertyValue("--nimbi-image-max-height-ratio"), y = w ? parseFloat(w) : NaN;
      !Number.isNaN(y) && y > 0 && y <= 1 && (h = y);
    } catch (f) {
      k("[helpers] read CSS ratio failed", f);
    }
    const d = Math.max(200, Math.floor(g * h));
    let p = !1, m = null;
    if (i.forEach((f) => {
      try {
        const w = f.getAttribute ? f.getAttribute("loading") : void 0;
        w !== "eager" && f.setAttribute && f.setAttribute("loading", "lazy");
        const y = f.getBoundingClientRect ? f.getBoundingClientRect() : null, _ = f.src || f.getAttribute && f.getAttribute("src"), b = y && y.height > 1 ? y.height : d, v = y ? y.top : 0, S = v + b;
        y && b > 0 && v <= u && S >= l && (f.setAttribute ? (f.setAttribute("loading", "eager"), f.setAttribute("fetchpriority", "high"), f.setAttribute("data-eager-by-nimbi", "1")) : (f.loading = "eager", f.fetchPriority = "high"), Ds(_), p = !0), !m && y && y.top <= u && (m = { img: f, src: _, rect: y, beforeLoading: w });
      } catch (w) {
        k("[helpers] setEagerForAboveFoldImages per-image failed", w);
      }
    }), !p && m) {
      const { img: f, src: w, rect: y, beforeLoading: _ } = m;
      try {
        f.setAttribute ? (f.setAttribute("loading", "eager"), f.setAttribute("fetchpriority", "high"), f.setAttribute("data-eager-by-nimbi", "1")) : (f.loading = "eager", f.fetchPriority = "high");
      } catch (b) {
        k("[helpers] setEagerForAboveFoldImages fallback failed", b);
      }
    }
  } catch (i) {
    k("[helpers] setEagerForAboveFoldImages failed", i);
  }
}
function Pe(e, t = null, n) {
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
cn(function(e) {
  try {
    const t = String(e || "");
    return t.includes("%") ? t : encodeURI(t);
  } catch (t) {
    return k("[helpers] encodeURL failed", t), String(e || "");
  }
}, 2e3);
function ir(e) {
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
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = ir);
} catch (e) {
  k("[helpers] global attach failed", e);
}
const Us = cn(function(e) {
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
let st = [], Jr = !1;
function Ws(e) {
  Jr = !!e;
}
function ma(e) {
  st = Array.isArray(e) ? e.slice() : [];
}
function Zs() {
  return st;
}
const dr = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2, ya = pa(() => Zt(Bs), "slugManager", dr);
function Gs() {
  try {
    if (Kr()) return !0;
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
function Xs() {
  return ya.get();
}
function ba(e) {
  return ya.send(e, 5e3);
}
async function Ir(e, t = 1, n = void 0) {
  const i = await Promise.resolve().then(() => at);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return await ba({ type: "buildSearchIndex", contentBase: e, indexDepth: t, noIndexing: n });
}
async function Qs(e, t, n) {
  const i = await Promise.resolve().then(() => at);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return ba({ type: "crawlForSlug", slug: e, base: t, maxQueue: n });
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
        let s = V.get(e);
        if (!s || typeof s == "string")
          s = { default: typeof s == "string" ? Y(s) : void 0, langs: {} };
        else
          try {
            s.default && (s.default = Y(s.default));
          } catch {
          }
        a ? s.langs[r] = n : s.default = n, V.set(e, s);
      } else {
        const i = V.has(e) ? V.get(e) : void 0;
        if (!i)
          V.set(e, n);
        else {
          let r = null;
          try {
            typeof i == "string" ? r = Y(i) : i && typeof i == "object" && (r = i.default ? Y(i.default) : null);
          } catch {
            r = null;
          }
          if (r === n)
            V.set(e, n);
          else {
            let a = null, s = 2;
            for (; a = `${e}-${s}`, !!V.has(a); ) {
              let o = V.get(a), l = null;
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
              if (!V.has(a))
                V.set(a, n), e = a;
              else if (V.get(a) === n) e = a;
              else {
                const o = /* @__PURE__ */ new Set();
                for (const c of V.keys()) o.add(c);
                const l = typeof Xt == "function" ? Xt(e, o) : `${e}-2`;
                V.set(l, n), e = l;
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
          Z.set(n, e);
        } catch {
        }
        try {
          if ($e && typeof $e.has == "function") {
            if (!$e.has(n)) {
              try {
                $e.add(n);
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
const fr = /* @__PURE__ */ new Set();
function Ks(e) {
  typeof e == "function" && fr.add(e);
}
function Vs(e) {
  typeof e == "function" && fr.delete(e);
}
const Z = /* @__PURE__ */ new Map();
let Nr = {}, Ne = [];
const $e = /* @__PURE__ */ new Set();
let le = "_404.md", bt = null;
const ei = "_home";
function wa(e) {
  if (e == null) {
    le = null;
    return;
  }
  le = String(e || "");
}
function _a(e) {
  if (e == null) {
    bt = null;
    return;
  }
  bt = String(e || "");
}
function Ys(e) {
  Nr = e || {};
}
function ka(e) {
  try {
    if (Array.isArray(re) || (re = []), !Array.isArray(e)) return;
    try {
      Array.isArray(re) || (re = []), re.length = 0;
      for (const t of e) re.push(t);
      try {
        if (typeof window < "u")
          try {
            window.__nimbiLiveSearchIndex = re;
          } catch {
          }
      } catch {
      }
    } catch (t) {
      fe("[slugManager] replacing searchIndex by assignment fallback", t);
      try {
        re = Array.from(e);
      } catch {
      }
    }
  } catch {
  }
}
const _n = /* @__PURE__ */ new Map(), ar = /* @__PURE__ */ new Set();
function Js() {
  _n.clear(), ar.clear();
}
function eo(e) {
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
const he = cn(function(e) {
  let n = String(e || "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return n = n.replace(/(?:-?)(?:md|html)$/, ""), n = n.replace(/-+/g, "-"), n = n.replace(/^-|-$/g, ""), n.length > 80 && (n = n.slice(0, 80).replace(/-+$/g, "")), n;
}, 2e3);
function ti(e) {
  V.clear(), Z.clear(), Ne = [];
  try {
    $e.clear();
  } catch {
  }
  st = st || [];
  const t = Object.keys(Nr || {});
  if (!t.length) return;
  let n = "";
  try {
    if (e) {
      try {
        /^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? n = new URL(String(e)).pathname : n = String(e || "");
      } catch (i) {
        n = String(e || ""), fe("[slugManager] parse contentBase failed", i);
      }
      n = Kt(n);
    }
  } catch (i) {
    n = "", fe("[slugManager] setContentBase prefix derivation failed", i);
  }
  n || (n = eo(t));
  for (const i of t) {
    let r = i;
    n && i.startsWith(n) ? r = Y(i.slice(n.length)) : r = Y(i), Ne.push(r);
    try {
      $e.add(r);
    } catch {
    }
    try {
      Gt();
    } catch (s) {
      fe("[slugManager] refreshIndexPaths failed", s);
    }
    const a = Nr[i];
    if (typeof a == "string") {
      const s = (a || "").match(/^#\s+(.+)$/m);
      if (s && s[1]) {
        const o = he(s[1].trim());
        if (o)
          try {
            let l = o;
            if ((!st || !st.length) && (l = Xt(l, new Set(V.keys()))), st && st.length) {
              const u = r.split("/")[0], g = st.includes(u);
              let h = V.get(l);
              (!h || typeof h == "string") && (h = { default: typeof h == "string" ? h : void 0, langs: {} }), g ? h.langs[u] = r : h.default = r, V.set(l, h);
            } else
              V.set(l, r);
            Z.set(r, l);
          } catch (l) {
            fe("[slugManager] set slug mapping failed", l);
          }
      }
    }
  }
}
try {
  ti();
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
function to(e) {
  return In(e, void 0);
}
function In(e, t) {
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
function Kn(e) {
  return e == null ? e : String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g, (t, n) => n);
}
function on(e) {
  if (!e || !V.has(e)) return null;
  const t = V.get(e);
  if (!t) return null;
  if (typeof t == "string") return t;
  if (st && st.length && jt && t.langs && t.langs[jt])
    return t.langs[jt];
  if (t.default) return t.default;
  if (t.langs) {
    const n = Object.keys(t.langs);
    if (n.length) return t.langs[n[0]];
  }
  return null;
}
const ft = new hr({ maxSize: 2e3 });
function no() {
  ft.clear(), qt.clear();
}
const qt = new hr({ maxSize: 2e3 });
let xa = 60 * 1e3;
function ro(e) {
  xa = Number(e) || 0;
}
function io(e) {
  try {
    const t = Math.max(0, Number(e) || 0);
    ft && typeof ft._maxSize < "u" && (ft._maxSize = t);
  } catch {
  }
}
function ao(e) {
  try {
    const t = Math.max(0, Number(e) || 0);
    ft && typeof ft._ttlMs < "u" && (ft._ttlMs = t);
  } catch {
  }
}
function so(e) {
  try {
    const t = Math.max(0, Number(e) || 0);
    qt && typeof qt._maxSize < "u" && (qt._maxSize = t);
  } catch {
  }
}
let Or = Math.max(1, Math.min(dr, 5));
function oo(e) {
  try {
    Or = Math.max(1, Number(e) || 1);
  } catch {
    Or = 1;
  }
}
function kn() {
  return Or;
}
let Oe = async function(e, t, n) {
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
    if (c && (u || !1) && V.has(c)) {
      const h = on(c) || V.get(c);
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
          if (V.has(c)) {
            const u = on(c) || V.get(c);
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
  if (!(n && n.force === !0 || typeof le == "string" && le || V && V.size || $e && $e.size || Kr()))
    throw new Error("failed to fetch md");
  const r = t == null ? "" : sn(String(t));
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
    const c = qt.get(a);
    if (c && c > Date.now())
      return Promise.reject(new Error("failed to fetch md"));
    c && qt.delete(a);
  } catch {
  }
  if (ft.has(a))
    return ft.get(a);
  const l = (async () => {
    const c = await fetch(a, s ? { signal: s } : void 0);
    if (!c || typeof c.ok != "boolean" || !c.ok) {
      if (c && c.status === 404 && typeof le == "string" && le)
        try {
          const m = `${r}/${le}`, f = await globalThis.fetch(m, s ? { signal: s } : void 0);
          if (f && typeof f.ok == "boolean" && f.ok)
            return { raw: await f.text(), status: 404 };
        } catch (m) {
          fe("[slugManager] fetching fallback 404 failed", m);
        }
      let p = "";
      try {
        c && typeof c.clone == "function" ? p = await c.clone().text() : c && typeof c.text == "function" ? p = await c.text() : p = "";
      } catch (m) {
        p = "", fe("[slugManager] reading error body failed", m);
      }
      try {
        const m = c ? c.status : void 0;
        if (m === 404)
          try {
            k("fetchMarkdown failed (404):", () => ({ url: a, status: m, statusText: c ? c.statusText : void 0, body: p.slice(0, 200) }));
          } catch {
          }
        else
          try {
            nr("fetchMarkdown failed:", () => ({ url: a, status: m, statusText: c ? c.statusText : void 0, body: p.slice(0, 200) }));
          } catch {
          }
      } catch {
      }
      throw new Error("failed to fetch md");
    }
    const u = await c.text(), g = u.trim().slice(0, 128).toLowerCase(), h = /^(?:<!doctype|<html|<title|<h1)/.test(g), d = h || String(e || "").toLowerCase().endsWith(".html");
    if (h && String(e || "").toLowerCase().endsWith(".md")) {
      try {
        if (typeof le == "string" && le) {
          const p = `${r}/${le}`, m = await globalThis.fetch(p, s ? { signal: s } : void 0);
          if (m.ok)
            return { raw: await m.text(), status: 404 };
        }
      } catch (p) {
        fe("[slugManager] fetching fallback 404 failed", p);
      }
      throw Gs() && nr("fetchMarkdown: server returned HTML for .md request", a), new Error("failed to fetch md");
    }
    return d ? { raw: u, isHtml: !0 } : { raw: u };
  })().catch((c) => {
    if (c && c.name === "AbortError") {
      try {
        ft.delete(a);
      } catch {
      }
      throw c;
    }
    try {
      qt.set(a, Date.now() + xa);
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
function lo(e) {
  typeof e == "function" && (Oe = e);
}
const Vn = /* @__PURE__ */ new Map();
function co(e) {
  if (!e || typeof e != "string") return "";
  let t = e.replace(/```[\s\S]*?```/g, "");
  return t = t.replace(/<pre[\s\S]*?<\/pre>/gi, ""), t = t.replace(/<code[\s\S]*?<\/code>/gi, ""), t = t.replace(/<!--([\s\S]*?)-->/g, ""), t = t.replace(/^ {4,}.*$/gm, ""), t = t.replace(/`[^`]*`/g, ""), t;
}
let re = [];
function uo() {
  return re;
}
try {
  if (typeof window < "u")
    try {
      Object.defineProperty(window, "__nimbiSearchIndex", {
        get() {
          return re;
        },
        enumerable: !0,
        configurable: !0
      });
    } catch {
      try {
        window.__nimbiSearchIndex = re;
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
          return Br;
        },
        enumerable: !0,
        configurable: !0
      });
    } catch {
      try {
        window.__nimbiIndexReady = Br;
      } catch {
      }
    }
} catch {
}
let It = null;
async function Wt(e, t = 1, n = void 0, i = void 0) {
  const r = Array.isArray(n) ? Array.from(new Set((n || []).map((a) => Y(String(a || ""))))) : [];
  try {
    const a = Y(String(le || ""));
    a && !r.includes(a) && r.push(a);
  } catch {
  }
  if (re && re.length && t === 1 && !re.some((s) => {
    try {
      return r.includes(Y(String(s.path || "")));
    } catch {
      return !1;
    }
  }))
    return re;
  if (It) return It;
  It = (async () => {
    let a = Array.isArray(n) ? Array.from(new Set((n || []).map((f) => Y(String(f || ""))))) : [];
    try {
      const f = Y(String(le || ""));
      f && !a.includes(f) && a.push(f);
    } catch {
    }
    const s = (f) => {
      if (!a || !a.length) return !1;
      for (const w of a)
        if (w && (f === w || f.startsWith(w + "/")))
          return !0;
      return !1;
    };
    let o = [];
    try {
      if (Array.isArray(i) && i.length)
        for (const f of i)
          try {
            const w = Y(String(f || ""));
            w && o.push(w);
          } catch {
          }
    } catch {
    }
    if (Array.isArray(Ne) && Ne.length && (o = Array.from(Ne)), !o.length) {
      if (Z && typeof Z.size == "number" && Z.size)
        try {
          o = Array.from(Z.keys());
        } catch {
          o = [];
        }
      else
        for (const f of V.values())
          if (f) {
            if (typeof f == "string")
              o.push(f);
            else if (f && typeof f == "object") {
              f.default && o.push(f.default);
              const w = f.langs || {};
              for (const y of Object.keys(w || {}))
                try {
                  w[y] && o.push(w[y]);
                } catch {
                }
            }
          }
    }
    try {
      const f = await Ca(e);
      f && f.length && (o = o.concat(f));
    } catch (f) {
      fe("[slugManager] crawlAllMarkdown during buildSearchIndex failed", f);
    }
    try {
      const f = new Set(o), w = [...o], y = Math.max(1, Math.min(kn(), w.length || kn()));
      let _ = 0;
      const b = async () => {
        for (; !(f.size > Nn); ) {
          const S = w.shift();
          if (!S) break;
          try {
            const E = await Oe(S, e);
            if (E && E.raw) {
              if (E.status === 404) continue;
              let P = E.raw;
              const I = [], U = String(S || "").replace(/^.*\//, "");
              if (/^readme(?:\.md)?$/i.test(U) && Jr && (!S || !S.includes("/")))
                continue;
              const z = co(P), O = /\[[^\]]+\]\(([^)]+)\)/g;
              let W;
              for (; W = O.exec(z); )
                I.push(W[1]);
              const te = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
              for (; W = te.exec(z); )
                I.push(W[1]);
              const H = S && S.includes("/") ? S.substring(0, S.lastIndexOf("/") + 1) : "";
              for (let M of I)
                try {
                  if (In(M, e) || M.startsWith("..") || M.indexOf("/../") !== -1 || (H && !M.startsWith("./") && !M.startsWith("/") && !M.startsWith("../") && (M = H + M), M = Y(M), !/\.(md|html?)(?:$|[?#])/i.test(M)) || (M = M.split(/[?#]/)[0], s(M))) continue;
                  f.has(M) || (f.add(M), w.push(M), o.push(M));
                } catch (F) {
                  fe("[slugManager] href processing failed", M, F);
                }
            }
          } catch (E) {
            fe("[slugManager] discovery fetch failed for", S, E);
          }
          try {
            _++, await Pt(_, 32);
          } catch {
          }
        }
      }, v = [];
      for (let S = 0; S < y; S++) v.push(b());
      await Promise.all(v);
    } catch (f) {
      fe("[slugManager] discovery loop failed", f);
    }
    const l = /* @__PURE__ */ new Set();
    o = o.filter((f) => !f || l.has(f) || s(f) ? !1 : (l.add(f), !0));
    const c = [], u = /* @__PURE__ */ new Map(), g = o.filter((f) => /\.(?:md|html?)(?:$|[?#])/i.test(f)), h = Math.max(1, Math.min(kn(), g.length || 1)), d = g.slice(), p = [];
    for (let f = 0; f < h; f++)
      p.push((async () => {
        for (; d.length; ) {
          const w = d.shift();
          if (!w) break;
          try {
            const y = await Oe(w, e);
            u.set(w, y);
          } catch (y) {
            fe("[slugManager] buildSearchIndex: entry fetch failed", w, y), u.set(w, null);
          }
        }
      })());
    await Promise.all(p);
    let m = 0;
    for (const f of o) {
      try {
        m++, await Pt(m, 16);
      } catch {
      }
      if (/\.(?:md|html?)(?:$|[?#])/i.test(f))
        try {
          const w = u.get(f);
          if (!w || !w.raw || w.status === 404) continue;
          let y = "", _ = "", b = null;
          if (w.isHtml)
            try {
              const S = qe(), E = S ? S.parseFromString(w.raw, "text/html") : null, P = E ? E.querySelector("title") || E.querySelector("h1") : null;
              P && P.textContent && (y = P.textContent.trim());
              const I = E ? E.querySelector("p") : null;
              if (I && I.textContent && (_ = I.textContent.trim()), t >= 2)
                try {
                  const U = E ? E.querySelector("h1") : null, z = U && U.textContent ? U.textContent.trim() : y || "";
                  try {
                    const W = Z && typeof Z.has == "function" && Z.has(f) ? Z.get(f) : null;
                    if (W)
                      b = W;
                    else {
                      let te = he(y || f);
                      const H = /* @__PURE__ */ new Set();
                      try {
                        for (const F of V.keys()) H.add(F);
                      } catch {
                      }
                      try {
                        for (const F of c)
                          F && F.slug && H.add(String(F.slug).split("::")[0]);
                      } catch {
                      }
                      let M = !1;
                      try {
                        if (V.has(te)) {
                          const F = V.get(te);
                          if (typeof F == "string")
                            F === f && (M = !0);
                          else if (F && typeof F == "object") {
                            F.default === f && (M = !0);
                            for (const G of Object.keys(F.langs || {}))
                              if (F.langs[G] === f) {
                                M = !0;
                                break;
                              }
                          }
                        }
                      } catch {
                      }
                      !M && H.has(te) && (te = Xt(te, H)), b = te;
                      try {
                        Z.has(f) || nt(b, f);
                      } catch {
                      }
                    }
                  } catch (W) {
                    fe("[slugManager] derive pageSlug failed", W);
                  }
                  const O = Array.from(E.querySelectorAll("h2"));
                  for (const W of O)
                    try {
                      const te = (W.textContent || "").trim();
                      if (!te) continue;
                      const H = W.id ? W.id : he(te), M = b ? `${b}::${H}` : `${he(f)}::${H}`;
                      let F = "", G = W.nextElementSibling;
                      for (; G && G.tagName && G.tagName.toLowerCase() === "script"; ) G = G.nextElementSibling;
                      G && G.textContent && (F = String(G.textContent).trim()), c.push({ slug: M, title: te, excerpt: F, path: f, parentTitle: z });
                    } catch (te) {
                      fe("[slugManager] indexing H2 failed", te);
                    }
                  if (t === 3)
                    try {
                      const W = Array.from(E.querySelectorAll("h3"));
                      for (const te of W)
                        try {
                          const H = (te.textContent || "").trim();
                          if (!H) continue;
                          const M = te.id ? te.id : he(H), F = b ? `${b}::${M}` : `${he(f)}::${M}`;
                          let G = "", ie = te.nextElementSibling;
                          for (; ie && ie.tagName && ie.tagName.toLowerCase() === "script"; ) ie = ie.nextElementSibling;
                          ie && ie.textContent && (G = String(ie.textContent).trim()), c.push({ slug: F, title: H, excerpt: G, path: f, parentTitle: z });
                        } catch (H) {
                          fe("[slugManager] indexing H3 failed", H);
                        }
                    } catch (W) {
                      fe("[slugManager] collect H3s failed", W);
                    }
                } catch (U) {
                  fe("[slugManager] collect H2s failed", U);
                }
            } catch (S) {
              fe("[slugManager] parsing HTML for index failed", S);
            }
          else {
            const S = w.raw, E = S.match(/^#\s+(.+)$/m);
            y = E ? E[1].trim() : "";
            try {
              y = Kn(y);
            } catch {
            }
            const P = S.split(/\r?\n\s*\r?\n/);
            if (P.length > 1)
              for (let I = 1; I < P.length; I++) {
                const U = P[I].trim();
                if (U && !/^#/.test(U)) {
                  _ = U.replace(/\r?\n/g, " ");
                  break;
                }
              }
            if (t >= 2) {
              let I = "";
              try {
                const U = (S.match(/^#\s+(.+)$/m) || [])[1];
                I = U ? U.trim() : "";
                try {
                  const W = Z && typeof Z.has == "function" && Z.has(f) ? Z.get(f) : null;
                  if (W)
                    b = W;
                  else {
                    let te = he(y || f);
                    const H = /* @__PURE__ */ new Set();
                    try {
                      for (const F of V.keys()) H.add(F);
                    } catch {
                    }
                    try {
                      for (const F of c)
                        F && F.slug && H.add(String(F.slug).split("::")[0]);
                    } catch {
                    }
                    let M = !1;
                    try {
                      if (V.has(te)) {
                        const F = V.get(te);
                        if (typeof F == "string")
                          F === f && (M = !0);
                        else if (F && typeof F == "object") {
                          F.default === f && (M = !0);
                          for (const G of Object.keys(F.langs || {}))
                            if (F.langs[G] === f) {
                              M = !0;
                              break;
                            }
                        }
                      }
                    } catch {
                    }
                    !M && H.has(te) && (te = Xt(te, H)), b = te;
                    try {
                      Z.has(f) || nt(b, f);
                    } catch {
                    }
                  }
                } catch (W) {
                  fe("[slugManager] derive pageSlug failed", W);
                }
                const z = /^##\s+(.+)$/gm;
                let O;
                for (; O = z.exec(S); )
                  try {
                    const W = (O[1] || "").trim(), te = Kn(W);
                    if (!W) continue;
                    const H = he(W), M = b ? `${b}::${H}` : `${he(f)}::${H}`, G = S.slice(z.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), ie = G && G[1] ? String(G[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                    c.push({ slug: M, title: te, excerpt: ie, path: f, parentTitle: I });
                  } catch (W) {
                    fe("[slugManager] indexing markdown H2 failed", W);
                  }
              } catch (U) {
                fe("[slugManager] collect markdown H2s failed", U);
              }
              if (t === 3)
                try {
                  const U = /^###\s+(.+)$/gm;
                  let z;
                  for (; z = U.exec(S); )
                    try {
                      const O = (z[1] || "").trim(), W = Kn(O);
                      if (!O) continue;
                      const te = he(O), H = b ? `${b}::${te}` : `${he(f)}::${te}`, F = S.slice(U.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), G = F && F[1] ? String(F[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                      c.push({ slug: H, title: W, excerpt: G, path: f, parentTitle: I });
                    } catch (O) {
                      fe("[slugManager] indexing markdown H3 failed", O);
                    }
                } catch (U) {
                  fe("[slugManager] collect markdown H3s failed", U);
                }
            }
          }
          let v = "";
          try {
            Z.has(f) && (v = Z.get(f));
          } catch (S) {
            fe("[slugManager] mdToSlug access failed", S);
          }
          if (!v) {
            try {
              if (!b) {
                const S = Z && typeof Z.has == "function" && Z.has(f) ? Z.get(f) : null;
                if (S)
                  b = S;
                else {
                  let E = he(y || f);
                  const P = /* @__PURE__ */ new Set();
                  try {
                    for (const U of V.keys()) P.add(U);
                  } catch {
                  }
                  try {
                    for (const U of c)
                      U && U.slug && P.add(String(U.slug).split("::")[0]);
                  } catch {
                  }
                  let I = !1;
                  try {
                    if (V.has(E)) {
                      const U = V.get(E);
                      if (typeof U == "string")
                        U === f && (I = !0);
                      else if (U && typeof U == "object") {
                        U.default === f && (I = !0);
                        for (const z of Object.keys(U.langs || {}))
                          if (U.langs[z] === f) {
                            I = !0;
                            break;
                          }
                      }
                    }
                  } catch {
                  }
                  !I && P.has(E) && (E = Xt(E, P)), b = E;
                  try {
                    Z.has(f) || nt(b, f);
                  } catch {
                  }
                }
              }
            } catch (S) {
              fe("[slugManager] derive pageSlug failed", S);
            }
            v = b || he(y || f);
          }
          c.push({ slug: v, title: y, excerpt: _, path: f });
        } catch (w) {
          fe("[slugManager] buildSearchIndex: entry processing failed", w);
        }
    }
    try {
      const f = c.filter((w) => {
        try {
          return !s(String(w.path || ""));
        } catch {
          return !0;
        }
      });
      try {
        Array.isArray(re) || (re = []), re.length = 0;
        for (const w of f) re.push(w);
      } catch {
        try {
          re = Array.from(f);
        } catch {
          re = f;
        }
      }
      try {
        if (typeof window < "u") {
          try {
            window.__nimbiResolvedIndex = re;
          } catch {
          }
          try {
            const w = [], y = /* @__PURE__ */ new Set();
            for (const _ of re)
              try {
                if (!_ || !_.slug) continue;
                const b = String(_.slug).split("::")[0];
                if (y.has(b)) continue;
                y.add(b);
                const v = { slug: b };
                _.title ? v.title = String(_.title) : _.parentTitle && (v.title = String(_.parentTitle)), _.path && (v.path = String(_.path)), w.push(v);
              } catch {
              }
            try {
              window.__nimbiSitemapJson = { generatedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: w };
            } catch {
            }
            try {
              window.__nimbiSitemapFinal = w;
            } catch {
            }
          } catch {
          }
        }
      } catch {
      }
    } catch (f) {
      fe("[slugManager] filtering index by excludes failed", f);
      try {
        Array.isArray(re) || (re = []), re.length = 0;
        for (const w of c) re.push(w);
      } catch {
        try {
          re = Array.from(c);
        } catch {
          re = c;
        }
      }
      try {
        if (typeof window < "u")
          try {
            window.__nimbiResolvedIndex = re;
          } catch {
          }
      } catch {
      }
    }
    return re;
  })();
  try {
    await It;
  } catch (a) {
    fe("[slugManager] awaiting _indexPromise failed", a);
  }
  return It = null, re;
}
async function Ot(e = {}) {
  try {
    const t = typeof e.timeoutMs == "number" ? e.timeoutMs : 8e3, n = e.contentBase, i = typeof e.indexDepth == "number" ? e.indexDepth : 1, r = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, a = Array.isArray(e.seedPaths) ? e.seedPaths : void 0, s = typeof e.startBuild == "boolean" ? e.startBuild : !0;
    if (Array.isArray(re) && re.length && !It && !s) return re;
    if (It) {
      try {
        await It;
      } catch {
      }
      return re;
    }
    if (s) {
      try {
        if (typeof Ir == "function")
          try {
            const l = await Ir(n, i, r, a);
            if (Array.isArray(l) && l.length) {
              try {
                ka(l);
              } catch {
              }
              return re;
            }
          } catch {
          }
      } catch {
      }
      try {
        return await Wt(n, i, r, a), re;
      } catch {
      }
    }
    const o = Date.now();
    for (; Date.now() - o < t; ) {
      if (Array.isArray(re) && re.length) return re;
      await new Promise((l) => setTimeout(l, 150));
    }
    return re;
  } catch {
    return re;
  }
}
async function Br(e = {}) {
  try {
    const t = Object.assign({}, e);
    typeof t.startBuild != "boolean" && (t.startBuild = !0), typeof t.timeoutMs != "number" && (t.timeoutMs = 1 / 0);
    try {
      return await Ot(t);
    } catch {
      return re;
    }
  } catch {
    return re;
  }
}
const Sa = 1e3;
let Nn = Sa;
function ho(e) {
  typeof e == "number" && e >= 0 && (Nn = e);
}
const va = qe(), Aa = "a[href]";
let Ea = async function(e, t, n = Nn) {
  if (Vn.has(e)) return Vn.get(e);
  let i = null;
  const r = /* @__PURE__ */ new Set(), a = [""], s = typeof location < "u" && location.origin ? location.origin : "http://localhost";
  let o = s + "/";
  try {
    t && (/^[a-z][a-z0-9+.-]*:/i.test(String(t)) ? o = String(t).replace(/\/$/, "") + "/" : String(t).startsWith("/") ? o = s + String(t).replace(/\/$/, "") + "/" : o = s + "/" + String(t).replace(/\/$/, "") + "/");
  } catch {
    o = s + "/";
  }
  const l = Math.max(1, Math.min(dr, 6));
  for (; a.length && !i && !(a.length > n); ) {
    const c = a.splice(0, l);
    await zn(c, async (u) => {
      if (u == null || r.has(u)) return;
      r.add(u);
      let g = "";
      try {
        g = new URL(u || "", o).toString();
      } catch {
        g = (String(t || "") || s) + "/" + String(u || "").replace(/^\//, "");
      }
      try {
        let h;
        try {
          h = await globalThis.fetch(g);
        } catch (w) {
          fe("[slugManager] crawlForSlug: fetch failed", { url: g, error: w });
          return;
        }
        if (!h || !h.ok) {
          h && !h.ok && fe("[slugManager] crawlForSlug: directory fetch non-ok", { url: g, status: h.status });
          return;
        }
        const d = await h.text(), p = va.parseFromString(d, "text/html");
        let m = [];
        try {
          p && typeof p.getElementsByTagName == "function" ? m = p.getElementsByTagName("a") : p && typeof p.querySelectorAll == "function" ? m = p.querySelectorAll(Aa) : m = [];
        } catch {
          try {
            m = p.getElementsByTagName ? p.getElementsByTagName("a") : [];
          } catch {
            m = [];
          }
        }
        const f = g;
        for (const w of m)
          try {
            if (i) break;
            let y = w.getAttribute("href") || "";
            if (!y || In(y, t) || y.startsWith("..") || y.indexOf("/../") !== -1) continue;
            if (y.endsWith("/")) {
              try {
                const _ = new URL(y, f), b = new URL(o).pathname, v = _.pathname.startsWith(b) ? _.pathname.slice(b.length) : _.pathname.replace(/^\//, ""), S = Kt(Y(v));
                r.has(S) || a.push(S);
              } catch {
                const b = Y(u + y);
                r.has(b) || a.push(b);
              }
              continue;
            }
            if (y.toLowerCase().endsWith(".md")) {
              let _ = "";
              try {
                const b = new URL(y, f), v = new URL(o).pathname;
                _ = b.pathname.startsWith(v) ? b.pathname.slice(v.length) : b.pathname.replace(/^\//, "");
              } catch {
                _ = (u + y).replace(/^\//, "");
              }
              _ = Y(_);
              try {
                if (Z.has(_))
                  continue;
                for (const b of V.values())
                  ;
              } catch (b) {
                fe("[slugManager] slug map access failed", b);
              }
              try {
                const b = await Oe(_, t);
                if (b && b.raw) {
                  const v = (b.raw || "").match(/^#\s+(.+)$/m);
                  if (v && v[1] && he(v[1].trim()) === e) {
                    i = _;
                    break;
                  }
                }
              } catch (b) {
                fe("[slugManager] crawlForSlug: fetchMarkdown failed", b);
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
  return Vn.set(e, i), i;
};
async function Ca(e, t = Nn) {
  const n = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), r = [""], a = typeof location < "u" && location.origin ? location.origin : "http://localhost";
  let s = a + "/";
  try {
    e && (/^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? s = String(e).replace(/\/$/, "") + "/" : String(e).startsWith("/") ? s = a + String(e).replace(/\/$/, "") + "/" : s = a + "/" + String(e).replace(/\/$/, "") + "/");
  } catch {
    s = a + "/";
  }
  const o = Math.max(1, Math.min(dr, 6));
  for (; r.length && !(r.length > t); ) {
    const l = r.splice(0, o);
    await zn(l, async (c) => {
      if (c == null || i.has(c)) return;
      i.add(c);
      let u = "";
      try {
        u = new URL(c || "", s).toString();
      } catch {
        u = (String(e || "") || a) + "/" + String(c || "").replace(/^\//, "");
      }
      try {
        let g;
        try {
          g = await globalThis.fetch(u);
        } catch (f) {
          fe("[slugManager] crawlAllMarkdown: fetch failed", { url: u, error: f });
          return;
        }
        if (!g || !g.ok) {
          g && !g.ok && fe("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: u, status: g.status });
          return;
        }
        const h = await g.text(), d = va.parseFromString(h, "text/html");
        let p = [];
        try {
          d && typeof d.getElementsByTagName == "function" ? p = d.getElementsByTagName("a") : d && typeof d.querySelectorAll == "function" ? p = d.querySelectorAll(Aa) : p = [];
        } catch {
          try {
            p = d.getElementsByTagName ? d.getElementsByTagName("a") : [];
          } catch {
            p = [];
          }
        }
        const m = u;
        for (const f of p)
          try {
            let w = f.getAttribute("href") || "";
            if (!w || In(w, e) || w.startsWith("..") || w.indexOf("/../") !== -1) continue;
            if (w.endsWith("/")) {
              try {
                const _ = new URL(w, m), b = new URL(s).pathname, v = _.pathname.startsWith(b) ? _.pathname.slice(b.length) : _.pathname.replace(/^\//, ""), S = Kt(Y(v));
                i.has(S) || r.push(S);
              } catch {
                const b = c + w;
                i.has(b) || r.push(b);
              }
              continue;
            }
            let y = "";
            try {
              const _ = new URL(w, m), b = new URL(s).pathname;
              y = _.pathname.startsWith(b) ? _.pathname.slice(b.length) : _.pathname.replace(/^\//, "");
            } catch {
              y = (c + w).replace(/^\//, "");
            }
            y = Y(y), /\.(md|html?)$/i.test(y) && n.add(y);
          } catch (w) {
            fe("[slugManager] crawlAllMarkdown: link iteration failed", w);
          }
      } catch (g) {
        fe("[slugManager] crawlAllMarkdown: directory fetch failed", g);
      }
    }, o);
  }
  return Array.from(n);
}
async function Ma(e, t, n) {
  if (e && typeof e == "string" && (e = Y(e), e = sn(e)), V.has(e))
    return on(e) || V.get(e);
  try {
    if (!(typeof le == "string" && le || V.has(e) || $e && $e.size || Gt._refreshed || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t))) return null;
  } catch {
  }
  for (const r of fr)
    try {
      const a = await r(e, t);
      if (a)
        return nt(e, a), a;
    } catch (a) {
      fe("[slugManager] slug resolver failed", a);
    }
  if ($e && $e.size) {
    if (_n.has(e)) {
      const r = _n.get(e);
      return nt(e, r), r;
    }
    for (const r of Ne)
      if (!ar.has(r))
        try {
          const a = await Oe(r, t);
          if (a && a.raw) {
            const s = (a.raw || "").match(/^#\s+(.+)$/m);
            if (s && s[1]) {
              const o = he(s[1].trim());
              if (ar.add(r), o && _n.set(o, r), o === e)
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
    const r = await Wt(t);
    if (r && r.length) {
      const a = r.find((s) => s.slug === e);
      if (a)
        return nt(e, a.path), a.path;
    }
  } catch (r) {
    fe("[slugManager] buildSearchIndex lookup failed", r);
  }
  try {
    const r = await Ea(e, t, n);
    if (r)
      return nt(e, r), r;
  } catch (r) {
    fe("[slugManager] crawlForSlug lookup failed", r);
  }
  const i = [`${e}.html`, `${e}.md`];
  for (const r of i)
    try {
      const a = await Oe(r, t);
      if (a && a.raw)
        return nt(e, r), r;
    } catch (a) {
      fe("[slugManager] candidate fetch failed", a);
    }
  if ($e && $e.size)
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
        const r = await Oe(bt, t);
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
  CRAWL_MAX_QUEUE: Sa,
  HOME_SLUG: ei,
  _setAllMd: Ys,
  _setSearchIndex: ka,
  _storeSlugMapping: nt,
  addSlugResolver: Ks,
  get allMarkdownPaths() {
    return Ne;
  },
  allMarkdownPathsSet: $e,
  get availableLanguages() {
    return st;
  },
  awaitSearchIndex: Br,
  buildSearchIndex: Wt,
  buildSearchIndexWorker: Ir,
  clearFetchCache: no,
  clearListCaches: Js,
  crawlAllMarkdown: Ca,
  crawlCache: Vn,
  crawlForSlug: Ea,
  crawlForSlugWorker: Qs,
  get defaultCrawlMaxQueue() {
    return Nn;
  },
  ensureSlug: Ma,
  fetchCache: ft,
  get fetchMarkdown() {
    return Oe;
  },
  getFetchConcurrency: kn,
  getLanguages: Zs,
  getSearchIndex: uo,
  get homePage() {
    return bt;
  },
  initSlugWorker: Xs,
  isExternalLink: to,
  isExternalLinkWithBase: In,
  listPathsFetched: ar,
  listSlugCache: _n,
  mdToSlug: Z,
  negativeFetchCache: qt,
  get notFoundPage() {
    return le;
  },
  removeSlugResolver: Vs,
  resolveSlugPath: on,
  get searchIndex() {
    return re;
  },
  setContentBase: ti,
  setDefaultCrawlMaxQueue: ho,
  setFetchCacheMaxSize: io,
  setFetchCacheTTL: ao,
  setFetchConcurrency: oo,
  setFetchMarkdown: lo,
  setFetchNegativeCacheTTL: ro,
  setHomePage: _a,
  setLanguages: ma,
  setNegativeFetchCacheMaxSize: so,
  setNotFoundPage: wa,
  setSkipRootReadme: Ws,
  get skipRootReadme() {
    return Jr;
  },
  slugResolvers: fr,
  slugToMd: V,
  slugify: he,
  unescapeMarkdown: Kn,
  uniqueSlug: Xt,
  whenSearchIndexReady: Ot
}, Symbol.toStringTag, { value: "Module" }));
var Mr, Bi;
function fo() {
  if (Bi) return Mr;
  Bi = 1;
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
    const u = s.wordsPerMinute || 200, g = s.wordBound || n;
    for (; g(a[l]); ) l++;
    for (; g(a[c]); ) c--;
    const h = `${a}
`;
    for (let f = l; f <= c; f++)
      if ((t(h[f]) || !g(h[f]) && (g(h[f + 1]) || t(h[f + 1]))) && o++, t(h[f]))
        for (; f <= c && (i(h[f + 1]) || g(h[f + 1])); )
          f++;
    const d = o / u, p = Math.round(d * 60 * 1e3);
    return {
      text: Math.ceil(d.toFixed(2)) + " min read",
      minutes: d,
      time: p,
      words: o
    };
  }
  return Mr = r, Mr;
}
var go = fo();
const po = /* @__PURE__ */ oa(go), bn = /* @__PURE__ */ new Map(), mo = 200;
function yo(e) {
  return String(e || "");
}
function bo(e, t) {
  if (bn.set(e, t), bn.size > mo) {
    const n = bn.keys().next().value;
    n && bn.delete(n);
  }
}
function wo(e) {
  return e ? String(e).trim().split(/\s+/).filter(Boolean).length : 0;
}
function _o(e) {
  const t = yo(e), n = bn.get(t);
  if (n) return Object.assign({}, n);
  const i = po(e || ""), r = typeof i.words == "number" ? i.words : wo(e), a = { readingTime: i, wordCount: r };
  return bo(t, a), Object.assign({}, a);
}
function Rn(e, t) {
  let n = document.querySelector(`meta[name="${e}"]`);
  n || (n = document.createElement("meta"), n.setAttribute("name", e), document.head.appendChild(n)), n.setAttribute("content", t);
}
function Rt(e, t, n) {
  let i = `meta[${e}="${t}"]`, r = document.querySelector(i);
  r || (r = document.createElement("meta"), r.setAttribute(e, t), document.head.appendChild(r)), r.setAttribute("content", n);
}
function La(e, t) {
  try {
    let n = document.querySelector(`link[rel="${e}"]`);
    n || (n = document.createElement("link"), n.setAttribute("rel", e), document.head.appendChild(n)), n.setAttribute("href", t);
  } catch (n) {
    k("[seoManager] upsertLinkRel failed", n);
  }
}
function ko(e, t, n, i) {
  const r = t && String(t).trim() ? t : e.title || document.title;
  Rt("property", "og:title", r);
  const a = i && String(i).trim() ? i : e.description || "";
  a && String(a).trim() && Rt("property", "og:description", a), a && String(a).trim() && Rt("name", "twitter:description", a), Rt("name", "twitter:card", e.twitter_card || "summary_large_image");
  const s = n || e.image;
  s && (Rt("property", "og:image", s), Rt("name", "twitter:image", s));
}
function ni(e, t, n, i, r = "") {
  const a = e.meta || {}, s = document && document.querySelector && document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", o = i && String(i).trim() ? i : a.description && String(a.description).trim() ? a.description : s && String(s).trim() ? s : "";
  o && String(o).trim() && Rn("description", o), Rn("robots", a.robots || "index,follow"), ko(a, t, n, o);
}
function xo() {
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
function ri(e, t, n, i, r, a = "") {
  try {
    const s = e.meta || {}, o = n && String(n).trim() ? n : s.title || a || document.title, l = r && String(r).trim() ? r : s.description || document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", c = i || s.image || null;
    let u = "";
    try {
      if (t) {
        const p = Y(t);
        try {
          u = (location.origin + location.pathname).split("?")[0] + "?page=" + encodeURIComponent(p);
        } catch {
          u = location.href.split("#")[0];
        }
      } else
        u = location.href.split("#")[0];
    } catch (p) {
      u = location.href.split("#")[0], k("[seoManager] compute canonical failed", p);
    }
    u && La("canonical", u);
    try {
      Rt("property", "og:url", u);
    } catch (p) {
      k("[seoManager] upsertMeta og:url failed", p);
    }
    const g = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: o || "",
      description: l || "",
      url: u || location.href.split("#")[0]
    };
    c && (g.image = String(c)), s.date && (g.datePublished = s.date), s.dateModified && (g.dateModified = s.dateModified);
    const h = "nimbi-jsonld";
    let d = document.getElementById(h);
    d || (d = document.createElement("script"), d.type = "application/ld+json", d.id = h, document.head.appendChild(d)), d.textContent = JSON.stringify(g, null, 2);
  } catch (s) {
    k("[seoManager] setStructuredData failed", s);
  }
}
let xn = typeof window < "u" && window.__SEO_MAP ? window.__SEO_MAP : {};
function So(e) {
  try {
    if (!e || typeof e != "object") {
      xn = {};
      return;
    }
    xn = Object.assign({}, e);
  } catch (t) {
    k("[seoManager] setSeoMap failed", t);
  }
}
function vo(e, t = "") {
  try {
    if (!e) return;
    const n = xn && xn[e] ? xn[e] : typeof window < "u" && window.__SEO_MAP && window.__SEO_MAP[e] ? window.__SEO_MAP[e] : null;
    try {
      const i = location.origin + location.pathname + "?page=" + encodeURIComponent(String(e || ""));
      La("canonical", i);
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
      n.description && Rn("description", String(n.description));
    } catch {
    }
    try {
      try {
        ni({ meta: n }, n.title || void 0, n.image || void 0, n.description || void 0, t);
      } catch {
      }
    } catch {
    }
    try {
      ri({ meta: n }, e, n.title || void 0, n.image || void 0, n.description || void 0, t);
    } catch (i) {
      k("[seoManager] inject structured data failed", i);
    }
  } catch (n) {
    k("[seoManager] injectSeoForPage failed", n);
  }
}
function Yn(e = {}, t = "", n = void 0, i = void 0) {
  try {
    const r = e || {}, a = typeof n == "string" && n.trim() ? n : r.title || "Not Found", s = typeof i == "string" && i.trim() ? i : r.description || "";
    try {
      Rn("robots", "noindex,follow");
    } catch {
    }
    try {
      s && String(s).trim() && Rn("description", String(s));
    } catch {
    }
    try {
      ni({ meta: Object.assign({}, r, { robots: "noindex,follow" }) }, a, r.image || void 0, s);
    } catch {
    }
    try {
      ri({ meta: Object.assign({}, r, { title: a, description: s }) }, t || "", a, r.image || void 0, s);
    } catch {
    }
  } catch (r) {
    k("[seoManager] markNotFound failed", r);
  }
}
function Ao(e, t, n, i, r, a, s, o, l, c, u) {
  try {
    if (i && i.querySelector) {
      const g = i.querySelector(".menu-label");
      g && (g.textContent = o && o.textContent || e("onThisPage"));
    }
  } catch (g) {
    k("[seoManager] update toc label failed", g);
  }
  try {
    const g = n.meta && n.meta.title ? String(n.meta.title).trim() : "", h = r.querySelector("img"), d = h && (h.getAttribute("src") || h.src) || null;
    let p = "";
    try {
      let w = "";
      try {
        const y = o || (r && r.querySelector ? r.querySelector("h1") : null);
        if (y) {
          let _ = y.nextElementSibling;
          const b = [];
          for (; _ && !(_.tagName && _.tagName.toLowerCase() === "h2"); ) {
            try {
              if (_.classList && _.classList.contains("nimbi-article-subtitle")) {
                _ = _.nextElementSibling;
                continue;
              }
            } catch {
            }
            const v = (_.textContent || "").trim();
            v && b.push(v), _ = _.nextElementSibling;
          }
          b.length && (w = b.join(" ").replace(/\s+/g, " ").trim()), !w && l && (w = String(l).trim());
        }
      } catch (y) {
        k("[seoManager] compute descOverride failed", y);
      }
      w && String(w).length > 160 && (w = String(w).slice(0, 157).trim() + "..."), p = w;
    } catch (w) {
      k("[seoManager] compute descOverride failed", w);
    }
    let m = "";
    try {
      g && (m = g);
    } catch {
    }
    if (!m)
      try {
        o && o.textContent && (m = String(o.textContent).trim());
      } catch {
      }
    if (!m)
      try {
        const w = r.querySelector("h2");
        w && w.textContent && (m = String(w.textContent).trim());
      } catch {
      }
    m || (m = a || "");
    try {
      ni(n, m || void 0, d, p);
    } catch (w) {
      k("[seoManager] setMetaTags failed", w);
    }
    try {
      ri(n, c, m || void 0, d, p, t);
    } catch (w) {
      k("[seoManager] setStructuredData failed", w);
    }
    const f = xo();
    m ? f ? document.title = `${f} - ${m}` : document.title = `${t || "Site"} - ${m}` : g ? document.title = g : document.title = t || document.title;
  } catch (g) {
    k("[seoManager] applyPageMeta failed", g);
  }
  try {
    try {
      const g = r.querySelectorAll(".nimbi-reading-time");
      g && g.forEach((h) => h.remove());
    } catch {
    }
    if (l) {
      const g = _o(u.raw || ""), h = g && g.readingTime ? g.readingTime : null, d = h && typeof h.minutes == "number" ? Math.ceil(h.minutes) : 0, p = d ? e("readingTime", { minutes: d }) : "";
      if (!p) return;
      const m = r.querySelector("h1");
      if (m) {
        const f = r.querySelector(".nimbi-article-subtitle");
        try {
          if (f) {
            const w = document.createElement("span");
            w.className = "nimbi-reading-time", w.textContent = p, f.appendChild(w);
          } else {
            const w = document.createElement("p");
            w.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const y = document.createElement("span");
            y.className = "nimbi-reading-time", y.textContent = p, w.appendChild(y);
            try {
              m.parentElement.insertBefore(w, m.nextSibling);
            } catch {
              try {
                m.insertAdjacentElement("afterend", w);
              } catch {
              }
            }
          }
        } catch {
          try {
            const y = document.createElement("p");
            y.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const _ = document.createElement("span");
            _.className = "nimbi-reading-time", _.textContent = p, y.appendChild(_), m.insertAdjacentElement("afterend", y);
          } catch {
          }
        }
      }
    }
  } catch (g) {
    k("[seoManager] reading time update failed", g);
  }
}
let Ta = 100;
function ji(e) {
  Ta = e;
}
function ct() {
  try {
    if (Jt(2)) return !0;
  } catch {
  }
  try {
    return !1;
  } catch {
    return !1;
  }
}
let Sn = 300 * 1e3, fn = null;
function ut(e, t, n) {
  try {
    if (typeof Oe == "function" && typeof Oe.length == "number" && Oe.length >= 3)
      return Oe(e, t, { signal: n });
  } catch {
  }
  return Oe(e, t);
}
function qi(e) {
  Sn = e;
}
const mt = /* @__PURE__ */ new Map();
function Eo(e) {
  if (!mt.has(e)) return;
  const t = mt.get(e), n = Date.now();
  if (t.ts + Sn < n) {
    mt.delete(e);
    return;
  }
  return mt.delete(e), mt.set(e, t), t.value;
}
function Co(e, t) {
  if (Hi(), Hi(), mt.delete(e), mt.set(e, { value: t, ts: Date.now() }), mt.size > Ta) {
    const n = mt.keys().next().value;
    n !== void 0 && mt.delete(n);
  }
}
function Hi() {
  if (!Sn || Sn <= 0) return;
  const e = Date.now();
  for (const [t, n] of mt.entries())
    n.ts + Sn < e && mt.delete(t);
}
async function Mo(e, t, n) {
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
              const d = Y(h.page);
              if (d) {
                i.add(d);
                continue;
              }
            }
            if (h.type === "cosmetic" && h.page) {
              const d = h.page;
              if (V.has(d)) {
                const p = V.get(d);
                if (p) return p;
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
        const g = o.pathname || "";
        if (g) {
          const h = new URL(t), d = Kt(h.pathname);
          if (g.indexOf(d) !== -1) {
            let p = g.startsWith(d) ? g.slice(d.length) : g;
            p = Y(p), p && i.add(p);
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
function Lo(e) {
  const t = [];
  if (String(e).includes(".md") || String(e).includes(".html"))
    /index\.html$/i.test(e) || t.push(e);
  else
    try {
      const n = decodeURIComponent(String(e || ""));
      if (V.has(n)) {
        const i = on(n) || V.get(n);
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
async function To(e, t) {
  const n = e || "";
  try {
    try {
      aa("fetchPageData");
    } catch {
    }
    try {
      sa("fetchPageData");
    } catch {
    }
  } catch {
  }
  try {
    if (fn && typeof fn.abort == "function")
      try {
        fn.abort();
      } catch {
      }
  } catch {
  }
  fn = typeof AbortController < "u" ? new AbortController() : null;
  const i = fn;
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
  const c = `${e}|||${typeof Ns < "u" && jt ? jt : ""}`, u = Eo(c);
  if (u)
    a = u.resolved, s = u.anchor || s;
  else {
    if (!String(a).includes(".md") && !String(a).includes(".html")) {
      let y = decodeURIComponent(String(a || ""));
      if (y && typeof y == "string" && (y = Y(y), y = sn(y)), V.has(y))
        a = on(y) || V.get(y);
      else {
        let _ = await Mo(y, t, i ? i.signal : void 0);
        if (_)
          a = _;
        else if (Gt._refreshed && rt && rt.size || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t)) {
          const b = await Ma(y, t);
          b && (a = b);
        }
      }
    }
    Co(c, { resolved: a, anchor: s });
  }
  let g = !0;
  try {
    const y = String(a || "").includes(".md") || String(a || "").includes(".html") || a && (a.startsWith("http://") || a.startsWith("https://") || a.startsWith("/"));
    g = typeof le == "string" && le || V.has(a) || rt && rt.size || Gt._refreshed || o || y;
  } catch {
    g = !0;
  }
  !s && r && (s = r);
  try {
    if (g && a && (a.startsWith("http://") || a.startsWith("https://") || a.startsWith("/"))) {
      const y = a.startsWith("/") ? new URL(a, location.origin).toString() : a;
      try {
        const _ = await fetch(y, i ? { signal: i.signal } : void 0);
        if (_ && _.ok) {
          const b = await _.text(), v = _ && _.headers && typeof _.headers.get == "function" && _.headers.get("content-type") || "", S = (b || "").toLowerCase();
          if (v && v.indexOf && v.indexOf("text/html") !== -1 || S.indexOf("<!doctype") !== -1 || S.indexOf("<html") !== -1) {
            if (!o)
              try {
                let I = y;
                try {
                  I = new URL(y).pathname.replace(/^\//, "");
                } catch {
                  I = String(y || "").replace(/^\//, "");
                }
                const U = I.replace(/\.html$/i, ".md");
                try {
                  const z = await ut(U, t, i ? i.signal : void 0);
                  if (z && z.raw)
                    return { data: z, pagePath: U, anchor: s };
                } catch {
                }
                if (typeof le == "string" && le)
                  try {
                    const z = await ut(le, t, i ? i.signal : void 0);
                    if (z && z.raw) {
                      try {
                        Yn(z.meta || {}, le);
                      } catch {
                      }
                      return { data: z, pagePath: le, anchor: s };
                    }
                  } catch {
                  }
                try {
                  w = new Error("site shell detected (absolute fetch)");
                } catch {
                }
              } catch {
              }
            if (S.indexOf('<div id="app"') !== -1 || S.indexOf("nimbi-cms") !== -1 || S.indexOf("nimbi-mount") !== -1 || S.indexOf("nimbi-") !== -1 || S.indexOf("initcms(") !== -1 || S.indexOf("window.nimbi") !== -1 || /\bnimbi\b/.test(S))
              try {
                let I = y;
                try {
                  I = new URL(y).pathname.replace(/^\//, "");
                } catch {
                  I = String(y || "").replace(/^\//, "");
                }
                const U = I.replace(/\.html$/i, ".md");
                try {
                  const z = await ut(U, t, i ? i.signal : void 0);
                  if (z && z.raw)
                    return { data: z, pagePath: U, anchor: s };
                } catch {
                }
                if (typeof le == "string" && le)
                  try {
                    const z = await ut(le, t, i ? i.signal : void 0);
                    if (z && z.raw) {
                      try {
                        Yn(z.meta || {}, le);
                      } catch {
                      }
                      return { data: z, pagePath: le, anchor: s };
                    }
                  } catch {
                  }
                try {
                  w = new Error("site shell detected (absolute fetch)");
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
  const h = Lo(a);
  try {
    if (ct())
      try {
        Bt("[router-debug] fetchPageData candidates", { originalRaw: n, resolved: a, pageCandidates: h });
      } catch {
      }
  } catch {
  }
  const d = String(n || "").includes(".md") || String(n || "").includes(".html");
  let p = null;
  if (!d)
    try {
      let y = decodeURIComponent(String(n || ""));
      y = Y(y), y = sn(y), y && !/\.(md|html?)$/i.test(y) && (p = y);
    } catch {
      p = null;
    }
  if (d && h.length === 0 && (String(a).includes(".md") || String(a).includes(".html")) && h.push(a), h.length === 0 && (String(a).includes(".md") || String(a).includes(".html")) && h.push(a), h.length === 1 && /index\.html$/i.test(h[0]) && !d && !V.has(a) && !V.has(decodeURIComponent(String(a || ""))) && !String(a || "").includes("/"))
    throw new Error("Unknown slug: index.html fallback prevented");
  let m = null, f = null, w = null;
  try {
    const y = String(a || "").includes(".md") || String(a || "").includes(".html") || a && (a.startsWith("http://") || a.startsWith("https://") || a.startsWith("/"));
    g = typeof le == "string" && le || V.has(a) || rt && rt.size || Gt._refreshed || d || y;
  } catch {
    g = !0;
  }
  if (!g)
    w = new Error("no page data");
  else
    for (const y of h)
      if (y)
        try {
          const _ = Y(y);
          if (m = await ut(_, t, i ? i.signal : void 0), f = _, p && !V.has(p))
            try {
              let b = "";
              if (m && m.isHtml)
                try {
                  const v = qe();
                  if (v) {
                    const S = v.parseFromString(m.raw || "", "text/html"), E = S.querySelector("h1") || S.querySelector("title");
                    E && E.textContent && (b = E.textContent.trim());
                  }
                } catch {
                }
              else {
                const v = (m && m.raw || "").match(/^#\s+(.+)$/m);
                v && v[1] && (b = v[1].trim());
              }
              if (b && he(b) !== p)
                try {
                  if (/\.html$/i.test(_)) {
                    const S = _.replace(/\.html$/i, ".md");
                    if (h.includes(S))
                      try {
                        const E = await ut(S, t, i ? i.signal : void 0);
                        if (E && E.raw)
                          m = E, f = S;
                        else if (typeof le == "string" && le)
                          try {
                            const P = await ut(le, t, i ? i.signal : void 0);
                            if (P && P.raw)
                              m = P, f = le;
                            else {
                              m = null, f = null, w = new Error("slug mismatch for candidate");
                              continue;
                            }
                          } catch {
                            m = null, f = null, w = new Error("slug mismatch for candidate");
                            continue;
                          }
                        else {
                          m = null, f = null, w = new Error("slug mismatch for candidate");
                          continue;
                        }
                      } catch {
                        try {
                          const P = await ut(le, t, i ? i.signal : void 0);
                          if (P && P.raw)
                            m = P, f = le;
                          else {
                            m = null, f = null, w = new Error("slug mismatch for candidate");
                            continue;
                          }
                        } catch {
                          m = null, f = null, w = new Error("slug mismatch for candidate");
                          continue;
                        }
                      }
                    else {
                      m = null, f = null, w = new Error("slug mismatch for candidate");
                      continue;
                    }
                  } else {
                    m = null, f = null, w = new Error("slug mismatch for candidate");
                    continue;
                  }
                } catch {
                  m = null, f = null, w = new Error("slug mismatch for candidate");
                  continue;
                }
            } catch {
            }
          try {
            if (!d && /\.html$/i.test(_)) {
              const b = _.replace(/\.html$/i, ".md");
              if (h.includes(b))
                try {
                  const S = String(m && m.raw || "").trim().slice(0, 128).toLowerCase();
                  if (m && m.isHtml || /^(?:<!doctype|<html|<title|<h1)/i.test(S) || S.indexOf('<div id="app"') !== -1 || S.indexOf("nimbi-") !== -1 || S.indexOf("nimbi") !== -1 || S.indexOf("initcms(") !== -1) {
                    let P = !1;
                    try {
                      const I = await ut(b, t, i ? i.signal : void 0);
                      if (I && I.raw)
                        m = I, f = b, P = !0;
                      else if (typeof le == "string" && le)
                        try {
                          const U = await ut(le, t, i ? i.signal : void 0);
                          U && U.raw && (m = U, f = le, P = !0);
                        } catch {
                        }
                    } catch {
                      try {
                        const U = await ut(le, t, i ? i.signal : void 0);
                        U && U.raw && (m = U, f = le, P = !0);
                      } catch {
                      }
                    }
                    if (!P) {
                      m = null, f = null, w = new Error("site shell detected (candidate HTML rejected)");
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
                Bt("[router-debug] fetchPageData accepted candidate", { candidate: _, pagePath: f, isHtml: m && m.isHtml, snippet: m && m.raw ? String(m.raw).slice(0, 160) : null });
              } catch {
              }
          } catch {
          }
          break;
        } catch (_) {
          w = _;
          try {
            ct() && k("[router] candidate fetch failed", { candidate: y, contentBase: t, err: _ && _.message || _ });
          } catch {
          }
        }
  if (!m) {
    const y = w && (w.message || String(w)) || null, _ = y && /failed to fetch md|site shell detected/i.test(y);
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
            nr("[router] fetchPageData: no page data for", { originalRaw: n, resolved: a, pageCandidates: h, contentBase: t, fetchError: y });
          } catch {
          }
      } catch {
      }
    if (typeof le == "string" && le)
      try {
        const b = await ut(le, t, i ? i.signal : void 0);
        if (b && b.raw) {
          try {
            Yn(b.meta || {}, le);
          } catch {
          }
          return { data: b, pagePath: le, anchor: s };
        }
      } catch {
      }
    try {
      if (d && String(n || "").toLowerCase().includes(".html"))
        try {
          const b = new URL(String(n || ""), location.href).toString();
          ct() && k("[router] attempting absolute HTML fetch fallback", b);
          const v = await fetch(b, i ? { signal: i.signal } : void 0);
          if (v && v.ok) {
            const S = await v.text(), E = v && v.headers && typeof v.headers.get == "function" && v.headers.get("content-type") || "", P = (S || "").toLowerCase(), I = E && E.indexOf && E.indexOf("text/html") !== -1 || P.indexOf("<!doctype") !== -1 || P.indexOf("<html") !== -1;
            if (!I && ct())
              try {
                k("[router] absolute fetch returned non-HTML", () => ({ abs: b, contentType: E, snippet: P.slice(0, 200) }));
              } catch {
              }
            if (I) {
              const U = (S || "").toLowerCase();
              if (/<title>\s*index of\b/i.test(S) || /<h1>\s*index of\b/i.test(S) || U.indexOf("parent directory") !== -1 || /<title>\s*directory listing/i.test(S) || /<h1>\s*directory listing/i.test(S))
                try {
                  ct() && k("[router] absolute fetch returned directory listing; treating as not found", { abs: b });
                } catch {
                }
              else
                try {
                  const O = b, W = new URL(".", O).toString();
                  try {
                    const H = qe();
                    if (H) {
                      const M = H.parseFromString(S || "", "text/html"), F = (J, Te) => {
                        try {
                          const ke = Te.getAttribute(J) || "";
                          if (!ke || /^(https?:)?\/\//i.test(ke) || ke.startsWith("/") || ke.startsWith("#")) return;
                          try {
                            const xe = new URL(ke, O).toString();
                            Te.setAttribute(J, xe);
                          } catch (xe) {
                            k("[router] rewrite attribute failed", J, xe);
                          }
                        } catch (ke) {
                          k("[router] rewrite helper failed", ke);
                        }
                      }, G = M.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"), ie = [];
                      for (const J of Array.from(G || []))
                        try {
                          const Te = J.tagName ? J.tagName.toLowerCase() : "";
                          if (Te === "a") continue;
                          if (J.hasAttribute("src")) {
                            const ke = J.getAttribute("src");
                            F("src", J);
                            const xe = J.getAttribute("src");
                            ke !== xe && ie.push({ attr: "src", tag: Te, before: ke, after: xe });
                          }
                          if (J.hasAttribute("href") && Te === "link") {
                            const ke = J.getAttribute("href");
                            F("href", J);
                            const xe = J.getAttribute("href");
                            ke !== xe && ie.push({ attr: "href", tag: Te, before: ke, after: xe });
                          }
                          if (J.hasAttribute("href") && Te !== "link") {
                            const ke = J.getAttribute("href");
                            F("href", J);
                            const xe = J.getAttribute("href");
                            ke !== xe && ie.push({ attr: "href", tag: Te, before: ke, after: xe });
                          }
                          if (J.hasAttribute("xlink:href")) {
                            const ke = J.getAttribute("xlink:href");
                            F("xlink:href", J);
                            const xe = J.getAttribute("xlink:href");
                            ke !== xe && ie.push({ attr: "xlink:href", tag: Te, before: ke, after: xe });
                          }
                          if (J.hasAttribute("poster")) {
                            const ke = J.getAttribute("poster");
                            F("poster", J);
                            const xe = J.getAttribute("poster");
                            ke !== xe && ie.push({ attr: "poster", tag: Te, before: ke, after: xe });
                          }
                          if (J.hasAttribute("srcset")) {
                            const Ee = (J.getAttribute("srcset") || "").split(",").map((He) => He.trim()).filter(Boolean).map((He) => {
                              const [R, N] = He.split(/\s+/, 2);
                              if (!R || /^(https?:)?\/\//i.test(R) || R.startsWith("/")) return He;
                              try {
                                const C = new URL(R, O).toString();
                                return N ? `${C} ${N}` : C;
                              } catch {
                                return He;
                              }
                            }).join(", ");
                            J.setAttribute("srcset", Ee);
                          }
                        } catch {
                        }
                      const ye = M.documentElement && M.documentElement.outerHTML ? M.documentElement.outerHTML : S;
                      try {
                        ct() && ie && ie.length && k("[router] rewritten asset refs", { abs: b, rewritten: ie });
                      } catch {
                      }
                      return { data: { raw: ye, isHtml: !0 }, pagePath: String(n || ""), anchor: s };
                    }
                  } catch {
                  }
                  let te = S;
                  return /<base\s+[^>]*>/i.test(S) || (/<head[^>]*>/i.test(S) ? te = S.replace(/(<head[^>]*>)/i, `$1<base href="${W}">`) : te = `<base href="${W}">` + S), { data: { raw: te, isHtml: !0 }, pagePath: String(n || ""), anchor: s };
                } catch {
                  return { data: { raw: S, isHtml: !0 }, pagePath: String(n || ""), anchor: s };
                }
            }
          }
        } catch (b) {
          ct() && k("[router] absolute HTML fetch fallback failed", b);
        }
    } catch {
    }
    try {
      const b = decodeURIComponent(String(a || ""));
      if (b && !/\.(md|html?)$/i.test(b) && typeof le == "string" && le && ct()) {
        const S = [
          `/assets/${b}.html`,
          `/assets/${b}/index.html`
        ];
        for (const E of S)
          try {
            const P = await fetch(E, Object.assign({ method: "GET" }, i ? { signal: i.signal } : {}));
            if (P && P.ok)
              return { data: { raw: await P.text(), isHtml: !0 }, pagePath: E.replace(/^\//, ""), anchor: s };
          } catch {
          }
      }
    } catch (b) {
      ct() && k("[router] assets fallback failed", b);
    }
    throw new Error("no page data");
  }
  return { data: m, pagePath: f, anchor: s };
}
function gr() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var Ht = gr();
function za(e) {
  Ht = e;
}
var Ut = { exec: () => null };
function Le(e, t = "") {
  let n = typeof e == "string" ? e : e.source, i = { replace: (r, a) => {
    let s = typeof a == "string" ? a : a.source;
    return s = s.replace(ot.caret, "$1"), n = n.replace(r, s), i;
  }, getRegex: () => new RegExp(n, t) };
  return i;
}
var zo = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), ot = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (e) => new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}#`), htmlBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}>`) }, Ro = /^(?:[ \t]*(?:\n|$))+/, $o = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Po = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, On = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Io = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, ii = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Ra = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, $a = Le(Ra).replace(/bull/g, ii).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), No = Le(Ra).replace(/bull/g, ii).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), ai = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Oo = /^[^\n]+/, si = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Bo = Le(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", si).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), jo = Le(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, ii).getRegex(), pr = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", oi = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, qo = Le("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", oi).replace("tag", pr).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Pa = Le(ai).replace("hr", On).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", pr).getRegex(), Ho = Le(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Pa).getRegex(), li = { blockquote: Ho, code: $o, def: Bo, fences: Po, heading: Io, hr: On, html: qo, lheading: $a, list: jo, newline: Ro, paragraph: Pa, table: Ut, text: Oo }, Fi = Le("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", On).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", pr).getRegex(), Fo = { ...li, lheading: No, table: Fi, paragraph: Le(ai).replace("hr", On).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Fi).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", pr).getRegex() }, Do = { ...li, html: Le(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", oi).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Ut, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: Le(ai).replace("hr", On).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", $a).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Uo = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Wo = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Ia = /^( {2,}|\\)\n(?!\s*$)/, Zo = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, mr = /[\p{P}\p{S}]/u, ci = /[\s\p{P}\p{S}]/u, Na = /[^\s\p{P}\p{S}]/u, Go = Le(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, ci).getRegex(), Oa = /(?!~)[\p{P}\p{S}]/u, Xo = /(?!~)[\s\p{P}\p{S}]/u, Qo = /(?:[^\s\p{P}\p{S}]|~)/u, Ba = /(?![*_])[\p{P}\p{S}]/u, Ko = /(?![*_])[\s\p{P}\p{S}]/u, Vo = /(?:[^\s\p{P}\p{S}]|[*_])/u, Yo = Le(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", zo ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), ja = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, Jo = Le(ja, "u").replace(/punct/g, mr).getRegex(), el = Le(ja, "u").replace(/punct/g, Oa).getRegex(), qa = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", tl = Le(qa, "gu").replace(/notPunctSpace/g, Na).replace(/punctSpace/g, ci).replace(/punct/g, mr).getRegex(), nl = Le(qa, "gu").replace(/notPunctSpace/g, Qo).replace(/punctSpace/g, Xo).replace(/punct/g, Oa).getRegex(), rl = Le("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Na).replace(/punctSpace/g, ci).replace(/punct/g, mr).getRegex(), il = Le(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Ba).getRegex(), al = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", sl = Le(al, "gu").replace(/notPunctSpace/g, Vo).replace(/punctSpace/g, Ko).replace(/punct/g, Ba).getRegex(), ol = Le(/\\(punct)/, "gu").replace(/punct/g, mr).getRegex(), ll = Le(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), cl = Le(oi).replace("(?:-->|$)", "-->").getRegex(), ul = Le("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", cl).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), sr = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, hl = Le(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", sr).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Ha = Le(/^!?\[(label)\]\[(ref)\]/).replace("label", sr).replace("ref", si).getRegex(), Fa = Le(/^!?\[(ref)\](?:\[\])?/).replace("ref", si).getRegex(), dl = Le("reflink|nolink(?!\\()", "g").replace("reflink", Ha).replace("nolink", Fa).getRegex(), Di = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, ui = { _backpedal: Ut, anyPunctuation: ol, autolink: ll, blockSkip: Yo, br: Ia, code: Wo, del: Ut, delLDelim: Ut, delRDelim: Ut, emStrongLDelim: Jo, emStrongRDelimAst: tl, emStrongRDelimUnd: rl, escape: Uo, link: hl, nolink: Fa, punctuation: Go, reflink: Ha, reflinkSearch: dl, tag: ul, text: Zo, url: Ut }, fl = { ...ui, link: Le(/^!?\[(label)\]\((.*?)\)/).replace("label", sr).getRegex(), reflink: Le(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", sr).getRegex() }, jr = { ...ui, emStrongRDelimAst: nl, emStrongLDelim: el, delLDelim: il, delRDelim: sl, url: Le(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Di).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: Le(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Di).getRegex() }, gl = { ...jr, br: Le(Ia).replace("{2,}", "*").getRegex(), text: Le(jr.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Zn = { normal: li, gfm: Fo, pedantic: Do }, gn = { normal: ui, gfm: jr, breaks: gl, pedantic: fl }, pl = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Ui = (e) => pl[e];
function xt(e, t) {
  if (t) {
    if (ot.escapeTest.test(e)) return e.replace(ot.escapeReplace, Ui);
  } else if (ot.escapeTestNoEncode.test(e)) return e.replace(ot.escapeReplaceNoEncode, Ui);
  return e;
}
function Wi(e) {
  try {
    e = encodeURI(e).replace(ot.percentDecode, "%");
  } catch {
    return null;
  }
  return e;
}
function Zi(e, t) {
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
function pn(e, t, n) {
  let i = e.length;
  if (i === 0) return "";
  let r = 0;
  for (; r < i && e.charAt(i - r - 1) === t; )
    r++;
  return e.slice(0, i - r);
}
function ml(e, t) {
  if (e.indexOf(t[1]) === -1) return -1;
  let n = 0;
  for (let i = 0; i < e.length; i++) if (e[i] === "\\") i++;
  else if (e[i] === t[0]) n++;
  else if (e[i] === t[1] && (n--, n < 0)) return i;
  return n > 0 ? -2 : -1;
}
function yl(e, t = 0) {
  let n = t, i = "";
  for (let r of e) if (r === "	") {
    let a = 4 - n % 4;
    i += " ".repeat(a), n += a;
  } else i += r, n++;
  return i;
}
function Gi(e, t, n, i, r) {
  let a = t.href, s = t.title || null, o = e[1].replace(r.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  let l = { type: e[0].charAt(0) === "!" ? "image" : "link", raw: n, href: a, title: s, text: o, tokens: i.inlineTokens(o) };
  return i.state.inLink = !1, l;
}
function bl(e, t, n) {
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
var $n = class {
  options;
  rules;
  lexer;
  constructor(e) {
    this.options = e || Ht;
  }
  space(e) {
    let t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0) return { type: "space", raw: t[0] };
  }
  code(e) {
    let t = this.rules.block.code.exec(e);
    if (t) {
      let n = t[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : pn(n, `
`) };
    }
  }
  fences(e) {
    let t = this.rules.block.fences.exec(e);
    if (t) {
      let n = t[0], i = bl(n, t[3] || "", this.rules);
      return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: i };
    }
  }
  heading(e) {
    let t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let i = pn(n, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceChar.test(i)) && (n = i.trim());
      }
      return { type: "heading", raw: t[0], depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t) return { type: "hr", raw: pn(t[0], `
`) };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = pn(t[0], `
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
        let g = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(u, a, !0), this.lexer.state.top = g, n.length === 0) break;
        let h = a.at(-1);
        if (h?.type === "code") break;
        if (h?.type === "blockquote") {
          let d = h, p = d.raw + `
` + n.join(`
`), m = this.blockquote(p);
          a[a.length - 1] = m, i = i.substring(0, i.length - d.raw.length) + m.raw, r = r.substring(0, r.length - d.text.length) + m.text;
          break;
        } else if (h?.type === "list") {
          let d = h, p = d.raw + `
` + n.join(`
`), m = this.list(p);
          a[a.length - 1] = m, i = i.substring(0, i.length - h.raw.length) + m.raw, r = r.substring(0, r.length - d.raw.length) + m.raw, n = p.substring(a.at(-1).raw.length).split(`
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
        let g = yl(t[2].split(`
`, 1)[0], t[1].length), h = e.split(`
`, 1)[0], d = !g.trim(), p = 0;
        if (this.options.pedantic ? (p = 2, u = g.trimStart()) : d ? p = t[1].length + 1 : (p = g.search(this.rules.other.nonSpaceChar), p = p > 4 ? 1 : p, u = g.slice(p), p += t[1].length), d && this.rules.other.blankLine.test(h) && (c += h + `
`, e = e.substring(h.length + 1), l = !0), !l) {
          let m = this.rules.other.nextBulletRegex(p), f = this.rules.other.hrRegex(p), w = this.rules.other.fencesBeginRegex(p), y = this.rules.other.headingBeginRegex(p), _ = this.rules.other.htmlBeginRegex(p), b = this.rules.other.blockquoteBeginRegex(p);
          for (; e; ) {
            let v = e.split(`
`, 1)[0], S;
            if (h = v, this.options.pedantic ? (h = h.replace(this.rules.other.listReplaceNesting, "  "), S = h) : S = h.replace(this.rules.other.tabCharGlobal, "    "), w.test(h) || y.test(h) || _.test(h) || b.test(h) || m.test(h) || f.test(h)) break;
            if (S.search(this.rules.other.nonSpaceChar) >= p || !h.trim()) u += `
` + S.slice(p);
            else {
              if (d || g.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || w.test(g) || y.test(g) || f.test(g)) break;
              u += `
` + h;
            }
            d = !h.trim(), c += v + `
`, e = e.substring(v.length + 1), g = S.slice(p);
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
          let c = l.tokens.filter((g) => g.type === "space"), u = c.length > 0 && c.some((g) => this.rules.other.anyLine.test(g.raw));
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
    let n = Zi(t[1]), i = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: t[0], header: [], align: [], rows: [] };
    if (n.length === i.length) {
      for (let s of i) this.rules.other.tableAlignRight.test(s) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(s) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(s) ? a.align.push("left") : a.align.push(null);
      for (let s = 0; s < n.length; s++) a.header.push({ text: n[s], tokens: this.lexer.inline(n[s]), header: !0, align: a.align[s] });
      for (let s of r) a.rows.push(Zi(s, a.header.length).map((o, l) => ({ text: o, tokens: this.lexer.inline(o), header: !1, align: a.align[l] })));
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
        let a = pn(n.slice(0, -1), "\\");
        if ((n.length - a.length) % 2 === 0) return;
      } else {
        let a = ml(t[2], "()");
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
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? i = i.slice(1) : i = i.slice(1, -1)), Gi(t, { href: i && i.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
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
      return Gi(n, r, n[0], this.lexer, this.rules);
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
        let u = [...i[0]][0].length, g = e.slice(0, r + i.index + u + s);
        if (Math.min(r, s) % 2) {
          let d = g.slice(1, -1);
          return { type: "em", raw: g, text: d, tokens: this.lexer.inlineTokens(d) };
        }
        let h = g.slice(2, -2);
        return { type: "strong", raw: g, text: h, tokens: this.lexer.inlineTokens(h) };
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
        let c = [...i[0]][0].length, u = e.slice(0, r + i.index + c + s), g = u.slice(r, -r);
        return { type: "del", raw: u, text: g, tokens: this.lexer.inlineTokens(g) };
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
}, gt = class qr {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(t) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || Ht, this.options.tokenizer = this.options.tokenizer || new $n(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: ot, block: Zn.normal, inline: gn.normal };
    this.options.pedantic ? (n.block = Zn.pedantic, n.inline = gn.pedantic) : this.options.gfm && (n.block = Zn.gfm, this.options.breaks ? n.inline = gn.breaks : n.inline = gn.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: Zn, inline: gn };
  }
  static lex(t, n) {
    return new qr(n).lex(t);
  }
  static lexInline(t, n) {
    return new qr(n).inlineTokens(t);
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
        let u = 1 / 0, g = t.slice(1), h;
        this.options.extensions.startInline.forEach((d) => {
          h = d.call({ lexer: this }, g), typeof h == "number" && h >= 0 && (u = Math.min(u, h));
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
}, Pn = class {
  options;
  parser;
  constructor(e) {
    this.options = e || Ht;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    let i = (t || "").match(ot.notSpaceStart)?.[0], r = e.replace(ot.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + xt(i) + '">' + (n ? r : xt(r, !0)) + `</code></pre>
` : "<pre><code>" + (n ? r : xt(r, !0)) + `</code></pre>
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
    return `<code>${xt(e, !0)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    let i = this.parser.parseInline(n), r = Wi(e);
    if (r === null) return i;
    e = r;
    let a = '<a href="' + e + '"';
    return t && (a += ' title="' + xt(t) + '"'), a += ">" + i + "</a>", a;
  }
  image({ href: e, title: t, text: n, tokens: i }) {
    i && (n = this.parser.parseInline(i, this.parser.textRenderer));
    let r = Wi(e);
    if (r === null) return xt(n);
    e = r;
    let a = `<img src="${e}" alt="${xt(n)}"`;
    return t && (a += ` title="${xt(t)}"`), a += ">", a;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : xt(e.text);
  }
}, yr = class {
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
}, pt = class Hr {
  options;
  renderer;
  textRenderer;
  constructor(t) {
    this.options = t || Ht, this.options.renderer = this.options.renderer || new Pn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new yr();
  }
  static parse(t, n) {
    return new Hr(n).parse(t);
  }
  static parseInline(t, n) {
    return new Hr(n).parseInline(t);
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
}, nn = class {
  options;
  block;
  constructor(e) {
    this.options = e || Ht;
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
    return this.block ? gt.lex : gt.lexInline;
  }
  provideParser() {
    return this.block ? pt.parse : pt.parseInline;
  }
}, Da = class {
  defaults = gr();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = pt;
  Renderer = Pn;
  TextRenderer = yr;
  Lexer = gt;
  Tokenizer = $n;
  Hooks = nn;
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
        let r = this.defaults.renderer || new Pn(this.defaults);
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
        let r = this.defaults.tokenizer || new $n(this.defaults);
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
        let r = this.defaults.hooks || new nn();
        for (let a in n.hooks) {
          if (!(a in r)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let s = a, o = n.hooks[s], l = r[s];
          nn.passThroughHooks.has(a) ? r[s] = (c) => {
            if (this.defaults.async && nn.passThroughHooksRespectAsync.has(a)) return (async () => {
              let g = await o.call(r, c);
              return l.call(r, g);
            })();
            let u = o.call(r, c);
            return l.call(r, u);
          } : r[s] = (...c) => {
            if (this.defaults.async) return (async () => {
              let g = await o.apply(r, c);
              return g === !1 && (g = await l.apply(r, c)), g;
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
    return gt.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return pt.parse(e, t ?? this.defaults);
  }
  parseMarkdown(e) {
    return (t, n) => {
      let i = { ...n }, r = { ...this.defaults, ...i }, a = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && i.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof t > "u" || t === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof t != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = e), r.async) return (async () => {
        let s = r.hooks ? await r.hooks.preprocess(t) : t, o = await (r.hooks ? await r.hooks.provideLexer() : e ? gt.lex : gt.lexInline)(s, r), l = r.hooks ? await r.hooks.processAllTokens(o) : o;
        r.walkTokens && await Promise.all(this.walkTokens(l, r.walkTokens));
        let c = await (r.hooks ? await r.hooks.provideParser() : e ? pt.parse : pt.parseInline)(l, r);
        return r.hooks ? await r.hooks.postprocess(c) : c;
      })().catch(a);
      try {
        r.hooks && (t = r.hooks.preprocess(t));
        let s = (r.hooks ? r.hooks.provideLexer() : e ? gt.lex : gt.lexInline)(t, r);
        r.hooks && (s = r.hooks.processAllTokens(s)), r.walkTokens && this.walkTokens(s, r.walkTokens);
        let o = (r.hooks ? r.hooks.provideParser() : e ? pt.parse : pt.parseInline)(s, r);
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
        let i = "<p>An error occurred:</p><pre>" + xt(n.message + "", !0) + "</pre>";
        return t ? Promise.resolve(i) : i;
      }
      if (t) return Promise.reject(n);
      throw n;
    };
  }
}, Vt = new Da();
function Ae(e, t) {
  return Vt.parse(e, t);
}
Ae.options = Ae.setOptions = function(e) {
  return Vt.setOptions(e), Ae.defaults = Vt.defaults, za(Ae.defaults), Ae;
};
Ae.getDefaults = gr;
Ae.defaults = Ht;
Ae.use = function(...e) {
  return Vt.use(...e), Ae.defaults = Vt.defaults, za(Ae.defaults), Ae;
};
Ae.walkTokens = function(e, t) {
  return Vt.walkTokens(e, t);
};
Ae.parseInline = Vt.parseInline;
Ae.Parser = pt;
Ae.parser = pt.parse;
Ae.Renderer = Pn;
Ae.TextRenderer = yr;
Ae.Lexer = gt;
Ae.lexer = gt.lex;
Ae.Tokenizer = $n;
Ae.Hooks = nn;
Ae.parse = Ae;
var wl = Ae.options, _l = Ae.setOptions, kl = Ae.use, xl = Ae.walkTokens, Sl = Ae.parseInline, vl = Ae, Al = pt.parse, El = gt.lex;
const Xi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hooks: nn,
  Lexer: gt,
  Marked: Da,
  Parser: pt,
  Renderer: Pn,
  TextRenderer: yr,
  Tokenizer: $n,
  get defaults() {
    return Ht;
  },
  getDefaults: gr,
  lexer: El,
  marked: Ae,
  options: wl,
  parse: vl,
  parseInline: Sl,
  parser: Al,
  setOptions: _l,
  use: kl,
  walkTokens: xl
}, Symbol.toStringTag, { value: "Module" })), Cl = `/**
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

/**
 * Split markdown content into sections, preferring heading boundaries.
 * @param {string} content
 * @param {number} chunkSize
 * @returns {string[]}
 */
function _splitIntoSections(content, chunkSize) {
  const txt = String(content || '')
  if (!txt || txt.length <= chunkSize) return [txt]
  const headingRe = /^#{1,6}\\s.*$/gm
  const positions = []
  let m
  while ((m = headingRe.exec(txt)) !== null) positions.push(m.index)
  if (!positions.length || positions.length < 2) {
    const out = []
    for (let i = 0; i < txt.length; i += chunkSize) out.push(txt.slice(i, i + chunkSize))
    return out
  }
  const sections = []
  if (positions[0] > 0) sections.push(txt.slice(0, positions[0]))
  for (let i = 0; i < positions.length; i++) {
    const start = positions[i]
    const end = (i + 1 < positions.length) ? positions[i + 1] : txt.length
    sections.push(txt.slice(start, end))
  }
  const merged = []
  let cur = ''
  for (const s of sections) {
    if (!cur && s.length >= chunkSize) { merged.push(s); continue }
    if ((cur.length + s.length) <= chunkSize) cur += s
    else { if (cur) merged.push(cur); cur = s }
  }
  if (cur) merged.push(cur)
  return merged
}

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

    if (msg.type === 'stream') {
      const id = msg.id
      try {
        const chunkSize = Number(msg.chunkSize) || (64 * 1024)
        const { content, data } = parseFrontmatter(msg.md || '')
        await ensureHljs().catch(() => {})
        const sections = _splitIntoSections(content, chunkSize)
        const idCounts = new Map()
        const slugify = slugifyHeading
        for (let i = 0; i < sections.length; i++) {
          let section = sections[i]
          let html = marked.parse(section)
          const heads = []
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
          postMessage({ id, type: 'chunk', html, toc: heads, index: i, isLast: i === (sections.length - 1) })
        }
        postMessage({ id, type: 'done', meta: (data || {}) })
      } catch (e) {
        postMessage({ id: msg.id, error: String(e) })
      }
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

/**
 * Inline shim: stream handler that calls \`onChunk\` for each chunk and
 * returns a final response similar to \`handleWorkerMessage\`.
 * @param {Object} msg
 * @param {function(Object):void} onChunk
 */
export async function handleWorkerMessageStream(msg, onChunk) {
  try {
    if (!msg || msg.type !== 'stream') {
      // not a stream request, fall back to normal handler
      const out = await handleWorkerMessage(msg)
      if (typeof onChunk === 'function') onChunk(out)
      return out
    }
    const id = msg.id
    const chunkSize = Number(msg.chunkSize) || (64 * 1024)
    const { content, data } = parseFrontmatter(msg.md || '')
    await ensureHljs().catch(() => {})
    const sections = _splitIntoSections(content, chunkSize)
    const idCounts = new Map()
    const slugify = slugifyHeading
    for (let i = 0; i < sections.length; i++) {
      let section = sections[i]
      let html = marked.parse(section)
      const heads = []
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
      const chunkMsg = { id, type: 'chunk', html, toc: heads, index: i, isLast: i === (sections.length - 1) }
      if (typeof onChunk === 'function') onChunk(chunkMsg)
    }
    const done = { id, type: 'done', meta: (data || {}) }
    if (typeof onChunk === 'function') onChunk(done)
    return done
  } catch (e) {
    const err = { id: msg && msg.id, error: String(e) }
    if (typeof onChunk === 'function') onChunk(err)
    return err
  }
}
`, Ua = `function F() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var L = F();
function ze(r) {
  L = r;
}
var C = { exec: () => null };
function d(r, e = "") {
  let s = typeof r == "string" ? r : r.source, n = { replace: (t, l) => {
    let i = typeof l == "string" ? l : l.source;
    return i = i.replace(w.caret, "$1"), s = s.replace(t, i), n;
  }, getRegex: () => new RegExp(s, e) };
  return n;
}
var Oe = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), w = { codeRemoveIndent: /^(?: {1,4}| {0,3}\\t)/gm, outputLinkReplace: /\\\\([\\[\\]])/g, indentCodeCompensation: /^(\\s+)(?:\`\`\`)/, beginningSpace: /^\\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\\n/g, tabCharGlobal: /\\t/g, multipleSpaceGlobal: /\\s+/g, blankLine: /^[ \\t]*$/, doubleBlankLine: /\\n[ \\t]*\\n[ \\t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\\n {0,3}((?:=+|-+) *)(?=\\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \\t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\\[[ xX]\\] +\\S/, listReplaceTask: /^\\[[ xX]\\] +/, listTaskCheckbox: /\\[[ xX]\\]/, anyLine: /\\n.*\\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\\||\\| *$/g, tableRowBlankLine: /\\n[ \\t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\\s|>)/i, endPreScriptTag: /^<\\/(pre|code|kbd|script)(\\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\\s])\\s+(['"])(.*)\\2/, unicodeAlphaNumeric: /[\\p{L}\\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\\w+);)/g, caret: /(^|[^\\[])\\^/g, percentDecode: /%25/g, findPipe: /\\|/g, splitPipe: / \\|/, slashPipe: /\\\\\\|/g, carriageReturn: /\\r\\n|\\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\\S*/, endingNewline: /\\n$/, listItemRegex: (r) => new RegExp(\`^( {0,3}\${r})((?:[	 ][^\\\\n]*)?(?:\\\\n|$))\`), nextBulletRegex: (r) => new RegExp(\`^ {0,\${Math.min(3, r - 1)}}(?:[*+-]|\\\\d{1,9}[.)])((?:[ 	][^\\\\n]*)?(?:\\\\n|$))\`), hrRegex: (r) => new RegExp(\`^ {0,\${Math.min(3, r - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\\\* *){3,})(?:\\\\n+|$)\`), fencesBeginRegex: (r) => new RegExp(\`^ {0,\${Math.min(3, r - 1)}}(?:\\\`\\\`\\\`|~~~)\`), headingBeginRegex: (r) => new RegExp(\`^ {0,\${Math.min(3, r - 1)}}#\`), htmlBeginRegex: (r) => new RegExp(\`^ {0,\${Math.min(3, r - 1)}}<(?:[a-z].*>|!--)\`, "i"), blockquoteBeginRegex: (r) => new RegExp(\`^ {0,\${Math.min(3, r - 1)}}>\`) }, Qe = /^(?:[ \\t]*(?:\\n|$))+/, Ge = /^((?: {4}| {0,3}\\t)[^\\n]+(?:\\n(?:[ \\t]*(?:\\n|$))*)?)+/, We = /^ {0,3}(\`{3,}(?=[^\`\\n]*(?:\\n|$))|~{3,})([^\\n]*)(?:\\n|$)(?:|([\\s\\S]*?)(?:\\n|$))(?: {0,3}\\1[~\`]* *(?=\\n|$)|$)/, N = /^ {0,3}((?:-[\\t ]*){3,}|(?:_[ \\t]*){3,}|(?:\\*[ \\t]*){3,})(?:\\n+|$)/, Fe = /^ {0,3}(#{1,6})(?=\\s|$)(.*)(?:\\n+|$)/, ne = / {0,3}(?:[*+-]|\\d{1,9}[.)])/, Re = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\\n(?!\\s*?\\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/, _e = d(Re).replace(/bull/g, ne).replace(/blockCode/g, /(?: {4}| {0,3}\\t)/).replace(/fences/g, / {0,3}(?:\`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\\n>]+>\\n/).replace(/\\|table/g, "").getRegex(), Xe = d(Re).replace(/bull/g, ne).replace(/blockCode/g, /(?: {4}| {0,3}\\t)/).replace(/fences/g, / {0,3}(?:\`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\\n>]+>\\n/).replace(/table/g, / {0,3}\\|?(?:[:\\- ]*\\|)+[\\:\\- ]*\\n/).getRegex(), ie = /^([^\\n]+(?:\\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\\n)[^\\n]+)*)/, Ke = /^[^\\n]+/, le = /(?!\\s*\\])(?:\\\\[\\s\\S]|[^\\[\\]\\\\])+/, Ue = d(/^ {0,3}\\[(label)\\]: *(?:\\n[ \\t]*)?([^<\\s][^\\s]*|<.*?>)(?:(?: +(?:\\n[ \\t]*)?| *\\n[ \\t]*)(title))? *(?:\\n+|$)/).replace("label", le).replace("title", /(?:"(?:\\\\"?|[^"\\\\])*"|'[^'\\n]*(?:\\n[^'\\n]+)*\\n?'|\\([^()]*\\))/).getRegex(), Je = d(/^(bull)([ \\t][^\\n]+?)?(?:\\n|$)/).replace(/bull/g, ne).getRegex(), X = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", ae = /<!--(?:-?>|[\\s\\S]*?(?:-->|$))/, Ve = d("^ {0,3}(?:<(script|pre|style|textarea)[\\\\s>][\\\\s\\\\S]*?(?:</\\\\1>[^\\\\n]*\\\\n+|$)|comment[^\\\\n]*(\\\\n+|$)|<\\\\?[\\\\s\\\\S]*?(?:\\\\?>\\\\n*|$)|<![A-Z][\\\\s\\\\S]*?(?:>\\\\n*|$)|<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?(?:\\\\]\\\\]>\\\\n*|$)|</?(tag)(?: +|\\\\n|/?>)[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$)|<(?!script|pre|style|textarea)([a-z][\\\\w-]*)(?:attribute)*? */?>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$)|</(?!script|pre|style|textarea)[a-z][\\\\w-]*\\\\s*>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$))", "i").replace("comment", ae).replace("tag", X).replace("attribute", / +[a-zA-Z:_][\\w.:-]*(?: *= *"[^"\\n]*"| *= *'[^'\\n]*'| *= *[^\\s"'=<>\`]+)?/).getRegex(), Te = d(ie).replace("hr", N).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", X).getRegex(), Ye = d(/^( {0,3}> ?(paragraph|[^\\n]*)(?:\\n|$))+/).replace("paragraph", Te).getRegex(), oe = { blockquote: Ye, code: Ge, def: Ue, fences: We, heading: Fe, hr: N, html: Ve, lheading: _e, list: Je, newline: Qe, paragraph: Te, table: C, text: Ke }, ge = d("^ *([^\\\\n ].*)\\\\n {0,3}((?:\\\\| *)?:?-+:? *(?:\\\\| *:?-+:? *)*(?:\\\\| *)?)(?:\\\\n((?:(?! *\\\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\\\n|$))*)\\\\n*|$)").replace("hr", N).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\\\n]").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", X).getRegex(), et = { ...oe, lheading: Xe, table: ge, paragraph: d(ie).replace("hr", N).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("|lheading", "").replace("table", ge).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", X).getRegex() }, tt = { ...oe, html: d(\`^ *(?:comment *(?:\\\\n|\\\\s*$)|<(tag)[\\\\s\\\\S]+?</\\\\1> *(?:\\\\n{2,}|\\\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\\\s[^'"/>\\\\s]*)*?/?> *(?:\\\\n{2,}|\\\\s*$))\`).replace("comment", ae).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\\\b)\\\\w+(?!:|[^\\\\w\\\\s@]*@)\\\\b").getRegex(), def: /^ *\\[([^\\]]+)\\]: *<?([^\\s>]+)>?(?: +(["(][^\\n]+[")]))? *(?:\\n+|$)/, heading: /^(#{1,6})(.*)(?:\\n+|$)/, fences: C, lheading: /^(.+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/, paragraph: d(ie).replace("hr", N).replace("heading", \` *#{1,6} *[^
]\`).replace("lheading", _e).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, st = /^\\\\([!"#$%&'()*+,\\-./:;<=>?@\\[\\]\\\\^_\`{|}~])/, rt = /^(\`+)([^\`]|[^\`][\\s\\S]*?[^\`])\\1(?!\`)/, Ae = /^( {2,}|\\\\)\\n(?!\\s*$)/, nt = /^(\`+|[^\`])(?:(?= {2,}\\n)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*_]|\\b_|$)|[^ ](?= {2,}\\n)))/, K = /[\\p{P}\\p{S}]/u, ce = /[\\s\\p{P}\\p{S}]/u, ve = /[^\\s\\p{P}\\p{S}]/u, it = d(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, ce).getRegex(), Le = /(?!~)[\\p{P}\\p{S}]/u, lt = /(?!~)[\\s\\p{P}\\p{S}]/u, at = /(?:[^\\s\\p{P}\\p{S}]|~)/u, Pe = /(?![*_])[\\p{P}\\p{S}]/u, ot = /(?![*_])[\\s\\p{P}\\p{S}]/u, ct = /(?:[^\\s\\p{P}\\p{S}]|[*_])/u, ht = d(/link|precode-code|html/, "g").replace("link", /\\[(?:[^\\[\\]\`]|(?<a>\`+)[^\`]+\\k<a>(?!\`))*?\\]\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)]|\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)])*\\))*\\)/).replace("precode-", Oe ? "(?<!\`)()" : "(^^|[^\`])").replace("code", /(?<b>\`+)[^\`]+\\k<b>(?!\`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Ce = /^(?:\\*+(?:((?!\\*)punct)|[^\\s*]))|^_+(?:((?!_)punct)|([^\\s_]))/, pt = d(Ce, "u").replace(/punct/g, K).getRegex(), ut = d(Ce, "u").replace(/punct/g, Le).getRegex(), Ee = "^[^_*]*?__[^_*]*?\\\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\\\*)punct(\\\\*+)(?=[\\\\s]|$)|notPunctSpace(\\\\*+)(?!\\\\*)(?=punctSpace|$)|(?!\\\\*)punctSpace(\\\\*+)(?=notPunctSpace)|[\\\\s](\\\\*+)(?!\\\\*)(?=punct)|(?!\\\\*)punct(\\\\*+)(?!\\\\*)(?=punct)|notPunctSpace(\\\\*+)(?=notPunctSpace)", gt = d(Ee, "gu").replace(/notPunctSpace/g, ve).replace(/punctSpace/g, ce).replace(/punct/g, K).getRegex(), dt = d(Ee, "gu").replace(/notPunctSpace/g, at).replace(/punctSpace/g, lt).replace(/punct/g, Le).getRegex(), ft = d("^[^_*]*?\\\\*\\\\*[^_*]*?_[^_*]*?(?=\\\\*\\\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, ve).replace(/punctSpace/g, ce).replace(/punct/g, K).getRegex(), kt = d(/^~~?(?:((?!~)punct)|[^\\s~])/, "u").replace(/punct/g, Pe).getRegex(), xt = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", bt = d(xt, "gu").replace(/notPunctSpace/g, ct).replace(/punctSpace/g, ot).replace(/punct/g, Pe).getRegex(), mt = d(/\\\\(punct)/, "gu").replace(/punct/g, K).getRegex(), wt = d(/^<(scheme:[^\\s\\x00-\\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), yt = d(ae).replace("(?:-->|$)", "-->").getRegex(), St = d("^comment|^</[a-zA-Z][\\\\w:-]*\\\\s*>|^<[a-zA-Z][\\\\w-]*(?:attribute)*?\\\\s*/?>|^<\\\\?[\\\\s\\\\S]*?\\\\?>|^<![a-zA-Z]+\\\\s[\\\\s\\\\S]*?>|^<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?\\\\]\\\\]>").replace("comment", yt).replace("attribute", /\\s+[a-zA-Z:_][\\w.:-]*(?:\\s*=\\s*"[^"]*"|\\s*=\\s*'[^']*'|\\s*=\\s*[^\\s"'=<>\`]+)?/).getRegex(), W = /(?:\\[(?:\\\\[\\s\\S]|[^\\[\\]\\\\])*\\]|\\\\[\\s\\S]|\`+[^\`]*?\`+(?!\`)|[^\\[\\]\\\\\`])*?/, $t = d(/^!?\\[(label)\\]\\(\\s*(href)(?:(?:[ \\t]+(?:\\n[ \\t]*)?|\\n[ \\t]*)(title))?\\s*\\)/).replace("label", W).replace("href", /<(?:\\\\.|[^\\n<>\\\\])+>|[^ \\t\\n\\x00-\\x1f]*/).replace("title", /"(?:\\\\"?|[^"\\\\])*"|'(?:\\\\'?|[^'\\\\])*'|\\((?:\\\\\\)?|[^)\\\\])*\\)/).getRegex(), Ie = d(/^!?\\[(label)\\]\\[(ref)\\]/).replace("label", W).replace("ref", le).getRegex(), Me = d(/^!?\\[(ref)\\](?:\\[\\])?/).replace("ref", le).getRegex(), zt = d("reflink|nolink(?!\\\\()", "g").replace("reflink", Ie).replace("nolink", Me).getRegex(), de = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, he = { _backpedal: C, anyPunctuation: mt, autolink: wt, blockSkip: ht, br: Ae, code: rt, del: C, delLDelim: C, delRDelim: C, emStrongLDelim: pt, emStrongRDelimAst: gt, emStrongRDelimUnd: ft, escape: st, link: $t, nolink: Me, punctuation: it, reflink: Ie, reflinkSearch: zt, tag: St, text: nt, url: C }, Rt = { ...he, link: d(/^!?\\[(label)\\]\\((.*?)\\)/).replace("label", W).getRegex(), reflink: d(/^!?\\[(label)\\]\\s*\\[([^\\]]*)\\]/).replace("label", W).getRegex() }, te = { ...he, emStrongRDelimAst: dt, emStrongLDelim: ut, delLDelim: kt, delRDelim: bt, url: d(/^((?:protocol):\\/\\/|www\\.)(?:[a-zA-Z0-9\\-]+\\.?)+[^\\s<]*|^email/).replace("protocol", de).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\\([^)]*\\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\\s~])((?:\\\\[\\s\\S]|[^\\\\])*?(?:\\\\[\\s\\S]|[^\\s~\\\\]))\\1(?=[^~]|$)/, text: d(/^([\`~]+|[^\`~])(?:(?= {2,}\\n)|(?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*~_]|\\b_|protocol:\\/\\/|www\\.|$)|[^ ](?= {2,}\\n)|[^a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-](?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@)))/).replace("protocol", de).getRegex() }, _t = { ...te, br: d(Ae).replace("{2,}", "*").getRegex(), text: d(te.text).replace("\\\\b_", "\\\\b_| {2,}\\\\n").replace(/\\{2,\\}/g, "*").getRegex() }, G = { normal: oe, gfm: et, pedantic: tt }, B = { normal: he, gfm: te, breaks: _t, pedantic: Rt }, Tt = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, fe = (r) => Tt[r];
function z(r, e) {
  if (e) {
    if (w.escapeTest.test(r)) return r.replace(w.escapeReplace, fe);
  } else if (w.escapeTestNoEncode.test(r)) return r.replace(w.escapeReplaceNoEncode, fe);
  return r;
}
function ke(r) {
  try {
    r = encodeURI(r).replace(w.percentDecode, "%");
  } catch {
    return null;
  }
  return r;
}
function xe(r, e) {
  let s = r.replace(w.findPipe, (l, i, c) => {
    let a = !1, h = i;
    for (; --h >= 0 && c[h] === "\\\\"; ) a = !a;
    return a ? "|" : " |";
  }), n = s.split(w.splitPipe), t = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e) if (n.length > e) n.splice(e);
  else for (; n.length < e; ) n.push("");
  for (; t < n.length; t++) n[t] = n[t].trim().replace(w.slashPipe, "|");
  return n;
}
function q(r, e, s) {
  let n = r.length;
  if (n === 0) return "";
  let t = 0;
  for (; t < n && r.charAt(n - t - 1) === e; )
    t++;
  return r.slice(0, n - t);
}
function At(r, e) {
  if (r.indexOf(e[1]) === -1) return -1;
  let s = 0;
  for (let n = 0; n < r.length; n++) if (r[n] === "\\\\") n++;
  else if (r[n] === e[0]) s++;
  else if (r[n] === e[1] && (s--, s < 0)) return n;
  return s > 0 ? -2 : -1;
}
function vt(r, e = 0) {
  let s = e, n = "";
  for (let t of r) if (t === "	") {
    let l = 4 - s % 4;
    n += " ".repeat(l), s += l;
  } else n += t, s++;
  return n;
}
function be(r, e, s, n, t) {
  let l = e.href, i = e.title || null, c = r[1].replace(t.other.outputLinkReplace, "$1");
  n.state.inLink = !0;
  let a = { type: r[0].charAt(0) === "!" ? "image" : "link", raw: s, href: l, title: i, text: c, tokens: n.inlineTokens(c) };
  return n.state.inLink = !1, a;
}
function Lt(r, e, s) {
  let n = r.match(s.other.indentCodeCompensation);
  if (n === null) return e;
  let t = n[1];
  return e.split(\`
\`).map((l) => {
    let i = l.match(s.other.beginningSpace);
    if (i === null) return l;
    let [c] = i;
    return c.length >= t.length ? l.slice(t.length) : l;
  }).join(\`
\`);
}
var Z = class {
  options;
  rules;
  lexer;
  constructor(r) {
    this.options = r || L;
  }
  space(r) {
    let e = this.rules.block.newline.exec(r);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(r) {
    let e = this.rules.block.code.exec(r);
    if (e) {
      let s = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? s : q(s, \`
\`) };
    }
  }
  fences(r) {
    let e = this.rules.block.fences.exec(r);
    if (e) {
      let s = e[0], n = Lt(s, e[3] || "", this.rules);
      return { type: "code", raw: s, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: n };
    }
  }
  heading(r) {
    let e = this.rules.block.heading.exec(r);
    if (e) {
      let s = e[2].trim();
      if (this.rules.other.endingHash.test(s)) {
        let n = q(s, "#");
        (this.options.pedantic || !n || this.rules.other.endingSpaceChar.test(n)) && (s = n.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: s, tokens: this.lexer.inline(s) };
    }
  }
  hr(r) {
    let e = this.rules.block.hr.exec(r);
    if (e) return { type: "hr", raw: q(e[0], \`
\`) };
  }
  blockquote(r) {
    let e = this.rules.block.blockquote.exec(r);
    if (e) {
      let s = q(e[0], \`
\`).split(\`
\`), n = "", t = "", l = [];
      for (; s.length > 0; ) {
        let i = !1, c = [], a;
        for (a = 0; a < s.length; a++) if (this.rules.other.blockquoteStart.test(s[a])) c.push(s[a]), i = !0;
        else if (!i) c.push(s[a]);
        else break;
        s = s.slice(a);
        let h = c.join(\`
\`), o = h.replace(this.rules.other.blockquoteSetextReplace, \`
    $1\`).replace(this.rules.other.blockquoteSetextReplace2, "");
        n = n ? \`\${n}
\${h}\` : h, t = t ? \`\${t}
\${o}\` : o;
        let p = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(o, l, !0), this.lexer.state.top = p, s.length === 0) break;
        let u = l.at(-1);
        if (u?.type === "code") break;
        if (u?.type === "blockquote") {
          let k = u, g = k.raw + \`
\` + s.join(\`
\`), x = this.blockquote(g);
          l[l.length - 1] = x, n = n.substring(0, n.length - k.raw.length) + x.raw, t = t.substring(0, t.length - k.text.length) + x.text;
          break;
        } else if (u?.type === "list") {
          let k = u, g = k.raw + \`
\` + s.join(\`
\`), x = this.list(g);
          l[l.length - 1] = x, n = n.substring(0, n.length - u.raw.length) + x.raw, t = t.substring(0, t.length - k.raw.length) + x.raw, s = g.substring(l.at(-1).raw.length).split(\`
\`);
          continue;
        }
      }
      return { type: "blockquote", raw: n, tokens: l, text: t };
    }
  }
  list(r) {
    let e = this.rules.block.list.exec(r);
    if (e) {
      let s = e[1].trim(), n = s.length > 1, t = { type: "list", raw: "", ordered: n, start: n ? +s.slice(0, -1) : "", loose: !1, items: [] };
      s = n ? \`\\\\d{1,9}\\\\\${s.slice(-1)}\` : \`\\\\\${s}\`, this.options.pedantic && (s = n ? s : "[*+-]");
      let l = this.rules.other.listItemRegex(s), i = !1;
      for (; r; ) {
        let a = !1, h = "", o = "";
        if (!(e = l.exec(r)) || this.rules.block.hr.test(r)) break;
        h = e[0], r = r.substring(h.length);
        let p = vt(e[2].split(\`
\`, 1)[0], e[1].length), u = r.split(\`
\`, 1)[0], k = !p.trim(), g = 0;
        if (this.options.pedantic ? (g = 2, o = p.trimStart()) : k ? g = e[1].length + 1 : (g = p.search(this.rules.other.nonSpaceChar), g = g > 4 ? 1 : g, o = p.slice(g), g += e[1].length), k && this.rules.other.blankLine.test(u) && (h += u + \`
\`, r = r.substring(u.length + 1), a = !0), !a) {
          let x = this.rules.other.nextBulletRegex(g), _ = this.rules.other.hrRegex(g), $ = this.rules.other.fencesBeginRegex(g), R = this.rules.other.headingBeginRegex(g), T = this.rules.other.htmlBeginRegex(g), A = this.rules.other.blockquoteBeginRegex(g);
          for (; r; ) {
            let v = r.split(\`
\`, 1)[0], m;
            if (u = v, this.options.pedantic ? (u = u.replace(this.rules.other.listReplaceNesting, "  "), m = u) : m = u.replace(this.rules.other.tabCharGlobal, "    "), $.test(u) || R.test(u) || T.test(u) || A.test(u) || x.test(u) || _.test(u)) break;
            if (m.search(this.rules.other.nonSpaceChar) >= g || !u.trim()) o += \`
\` + m.slice(g);
            else {
              if (k || p.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || $.test(p) || R.test(p) || _.test(p)) break;
              o += \`
\` + u;
            }
            k = !u.trim(), h += v + \`
\`, r = r.substring(v.length + 1), p = m.slice(g);
          }
        }
        t.loose || (i ? t.loose = !0 : this.rules.other.doubleBlankLine.test(h) && (i = !0)), t.items.push({ type: "list_item", raw: h, task: !!this.options.gfm && this.rules.other.listIsTask.test(o), loose: !1, text: o, tokens: [] }), t.raw += h;
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
  html(r) {
    let e = this.rules.block.html.exec(r);
    if (e) return { type: "html", block: !0, raw: e[0], pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: e[0] };
  }
  def(r) {
    let e = this.rules.block.def.exec(r);
    if (e) {
      let s = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), n = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", t = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: s, raw: e[0], href: n, title: t };
    }
  }
  table(r) {
    let e = this.rules.block.table.exec(r);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let s = xe(e[1]), n = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), t = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(\`
\`) : [], l = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (s.length === n.length) {
      for (let i of n) this.rules.other.tableAlignRight.test(i) ? l.align.push("right") : this.rules.other.tableAlignCenter.test(i) ? l.align.push("center") : this.rules.other.tableAlignLeft.test(i) ? l.align.push("left") : l.align.push(null);
      for (let i = 0; i < s.length; i++) l.header.push({ text: s[i], tokens: this.lexer.inline(s[i]), header: !0, align: l.align[i] });
      for (let i of t) l.rows.push(xe(i, l.header.length).map((c, a) => ({ text: c, tokens: this.lexer.inline(c), header: !1, align: l.align[a] })));
      return l;
    }
  }
  lheading(r) {
    let e = this.rules.block.lheading.exec(r);
    if (e) return { type: "heading", raw: e[0], depth: e[2].charAt(0) === "=" ? 1 : 2, text: e[1], tokens: this.lexer.inline(e[1]) };
  }
  paragraph(r) {
    let e = this.rules.block.paragraph.exec(r);
    if (e) {
      let s = e[1].charAt(e[1].length - 1) === \`
\` ? e[1].slice(0, -1) : e[1];
      return { type: "paragraph", raw: e[0], text: s, tokens: this.lexer.inline(s) };
    }
  }
  text(r) {
    let e = this.rules.block.text.exec(r);
    if (e) return { type: "text", raw: e[0], text: e[0], tokens: this.lexer.inline(e[0]) };
  }
  escape(r) {
    let e = this.rules.inline.escape.exec(r);
    if (e) return { type: "escape", raw: e[0], text: e[1] };
  }
  tag(r) {
    let e = this.rules.inline.tag.exec(r);
    if (e) return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), { type: "html", raw: e[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: !1, text: e[0] };
  }
  link(r) {
    let e = this.rules.inline.link.exec(r);
    if (e) {
      let s = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(s)) {
        if (!this.rules.other.endAngleBracket.test(s)) return;
        let l = q(s.slice(0, -1), "\\\\");
        if ((s.length - l.length) % 2 === 0) return;
      } else {
        let l = At(e[2], "()");
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
      return n = n.trim(), this.rules.other.startAngleBracket.test(n) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(s) ? n = n.slice(1) : n = n.slice(1, -1)), be(e, { href: n && n.replace(this.rules.inline.anyPunctuation, "$1"), title: t && t.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(r, e) {
    let s;
    if ((s = this.rules.inline.reflink.exec(r)) || (s = this.rules.inline.nolink.exec(r))) {
      let n = (s[2] || s[1]).replace(this.rules.other.multipleSpaceGlobal, " "), t = e[n.toLowerCase()];
      if (!t) {
        let l = s[0].charAt(0);
        return { type: "text", raw: l, text: l };
      }
      return be(s, t, s[0], this.lexer, this.rules);
    }
  }
  emStrong(r, e, s = "") {
    let n = this.rules.inline.emStrongLDelim.exec(r);
    if (!(!n || n[3] && s.match(this.rules.other.unicodeAlphaNumeric)) && (!(n[1] || n[2]) || !s || this.rules.inline.punctuation.exec(s))) {
      let t = [...n[0]].length - 1, l, i, c = t, a = 0, h = n[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (h.lastIndex = 0, e = e.slice(-1 * r.length + t); (n = h.exec(e)) != null; ) {
        if (l = n[1] || n[2] || n[3] || n[4] || n[5] || n[6], !l) continue;
        if (i = [...l].length, n[3] || n[4]) {
          c += i;
          continue;
        } else if ((n[5] || n[6]) && t % 3 && !((t + i) % 3)) {
          a += i;
          continue;
        }
        if (c -= i, c > 0) continue;
        i = Math.min(i, i + c + a);
        let o = [...n[0]][0].length, p = r.slice(0, t + n.index + o + i);
        if (Math.min(t, i) % 2) {
          let k = p.slice(1, -1);
          return { type: "em", raw: p, text: k, tokens: this.lexer.inlineTokens(k) };
        }
        let u = p.slice(2, -2);
        return { type: "strong", raw: p, text: u, tokens: this.lexer.inlineTokens(u) };
      }
    }
  }
  codespan(r) {
    let e = this.rules.inline.code.exec(r);
    if (e) {
      let s = e[2].replace(this.rules.other.newLineCharGlobal, " "), n = this.rules.other.nonSpaceChar.test(s), t = this.rules.other.startingSpaceChar.test(s) && this.rules.other.endingSpaceChar.test(s);
      return n && t && (s = s.substring(1, s.length - 1)), { type: "codespan", raw: e[0], text: s };
    }
  }
  br(r) {
    let e = this.rules.inline.br.exec(r);
    if (e) return { type: "br", raw: e[0] };
  }
  del(r, e, s = "") {
    let n = this.rules.inline.delLDelim.exec(r);
    if (n && (!n[1] || !s || this.rules.inline.punctuation.exec(s))) {
      let t = [...n[0]].length - 1, l, i, c = t, a = this.rules.inline.delRDelim;
      for (a.lastIndex = 0, e = e.slice(-1 * r.length + t); (n = a.exec(e)) != null; ) {
        if (l = n[1] || n[2] || n[3] || n[4] || n[5] || n[6], !l || (i = [...l].length, i !== t)) continue;
        if (n[3] || n[4]) {
          c += i;
          continue;
        }
        if (c -= i, c > 0) continue;
        i = Math.min(i, i + c);
        let h = [...n[0]][0].length, o = r.slice(0, t + n.index + h + i), p = o.slice(t, -t);
        return { type: "del", raw: o, text: p, tokens: this.lexer.inlineTokens(p) };
      }
    }
  }
  autolink(r) {
    let e = this.rules.inline.autolink.exec(r);
    if (e) {
      let s, n;
      return e[2] === "@" ? (s = e[1], n = "mailto:" + s) : (s = e[1], n = s), { type: "link", raw: e[0], text: s, href: n, tokens: [{ type: "text", raw: s, text: s }] };
    }
  }
  url(r) {
    let e;
    if (e = this.rules.inline.url.exec(r)) {
      let s, n;
      if (e[2] === "@") s = e[0], n = "mailto:" + s;
      else {
        let t;
        do
          t = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
        while (t !== e[0]);
        s = e[0], e[1] === "www." ? n = "http://" + e[0] : n = e[0];
      }
      return { type: "link", raw: e[0], text: s, href: n, tokens: [{ type: "text", raw: s, text: s }] };
    }
  }
  inlineText(r) {
    let e = this.rules.inline.text.exec(r);
    if (e) {
      let s = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: e[0], escaped: s };
    }
  }
}, y = class se {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || L, this.options.tokenizer = this.options.tokenizer || new Z(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let s = { other: w, block: G.normal, inline: B.normal };
    this.options.pedantic ? (s.block = G.pedantic, s.inline = B.pedantic) : this.options.gfm && (s.block = G.gfm, this.options.breaks ? s.inline = B.breaks : s.inline = B.gfm), this.tokenizer.rules = s;
  }
  static get rules() {
    return { block: G, inline: B };
  }
  static lex(e, s) {
    return new se(s).lex(e);
  }
  static lexInline(e, s) {
    return new se(s).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(w.carriageReturn, \`
\`), this.blockTokens(e, this.tokens);
    for (let s = 0; s < this.inlineQueue.length; s++) {
      let n = this.inlineQueue[s];
      this.inlineTokens(n.src, n.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, s = [], n = !1) {
    for (this.options.pedantic && (e = e.replace(w.tabCharGlobal, "    ").replace(w.spaceLine, "")); e; ) {
      let t;
      if (this.options.extensions?.block?.some((i) => (t = i.call({ lexer: this }, e, s)) ? (e = e.substring(t.raw.length), s.push(t), !0) : !1)) continue;
      if (t = this.tokenizer.space(e)) {
        e = e.substring(t.raw.length);
        let i = s.at(-1);
        t.raw.length === 1 && i !== void 0 ? i.raw += \`
\` : s.push(t);
        continue;
      }
      if (t = this.tokenizer.code(e)) {
        e = e.substring(t.raw.length);
        let i = s.at(-1);
        i?.type === "paragraph" || i?.type === "text" ? (i.raw += (i.raw.endsWith(\`
\`) ? "" : \`
\`) + t.raw, i.text += \`
\` + t.text, this.inlineQueue.at(-1).src = i.text) : s.push(t);
        continue;
      }
      if (t = this.tokenizer.fences(e)) {
        e = e.substring(t.raw.length), s.push(t);
        continue;
      }
      if (t = this.tokenizer.heading(e)) {
        e = e.substring(t.raw.length), s.push(t);
        continue;
      }
      if (t = this.tokenizer.hr(e)) {
        e = e.substring(t.raw.length), s.push(t);
        continue;
      }
      if (t = this.tokenizer.blockquote(e)) {
        e = e.substring(t.raw.length), s.push(t);
        continue;
      }
      if (t = this.tokenizer.list(e)) {
        e = e.substring(t.raw.length), s.push(t);
        continue;
      }
      if (t = this.tokenizer.html(e)) {
        e = e.substring(t.raw.length), s.push(t);
        continue;
      }
      if (t = this.tokenizer.def(e)) {
        e = e.substring(t.raw.length);
        let i = s.at(-1);
        i?.type === "paragraph" || i?.type === "text" ? (i.raw += (i.raw.endsWith(\`
\`) ? "" : \`
\`) + t.raw, i.text += \`
\` + t.raw, this.inlineQueue.at(-1).src = i.text) : this.tokens.links[t.tag] || (this.tokens.links[t.tag] = { href: t.href, title: t.title }, s.push(t));
        continue;
      }
      if (t = this.tokenizer.table(e)) {
        e = e.substring(t.raw.length), s.push(t);
        continue;
      }
      if (t = this.tokenizer.lheading(e)) {
        e = e.substring(t.raw.length), s.push(t);
        continue;
      }
      let l = e;
      if (this.options.extensions?.startBlock) {
        let i = 1 / 0, c = e.slice(1), a;
        this.options.extensions.startBlock.forEach((h) => {
          a = h.call({ lexer: this }, c), typeof a == "number" && a >= 0 && (i = Math.min(i, a));
        }), i < 1 / 0 && i >= 0 && (l = e.substring(0, i + 1));
      }
      if (this.state.top && (t = this.tokenizer.paragraph(l))) {
        let i = s.at(-1);
        n && i?.type === "paragraph" ? (i.raw += (i.raw.endsWith(\`
\`) ? "" : \`
\`) + t.raw, i.text += \`
\` + t.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = i.text) : s.push(t), n = l.length !== e.length, e = e.substring(t.raw.length);
        continue;
      }
      if (t = this.tokenizer.text(e)) {
        e = e.substring(t.raw.length);
        let i = s.at(-1);
        i?.type === "text" ? (i.raw += (i.raw.endsWith(\`
\`) ? "" : \`
\`) + t.raw, i.text += \`
\` + t.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = i.text) : s.push(t);
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
    return this.state.top = !0, s;
  }
  inline(e, s = []) {
    return this.inlineQueue.push({ src: e, tokens: s }), s;
  }
  inlineTokens(e, s = []) {
    let n = e, t = null;
    if (this.tokens.links) {
      let a = Object.keys(this.tokens.links);
      if (a.length > 0) for (; (t = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null; ) a.includes(t[0].slice(t[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, t.index) + "[" + "a".repeat(t[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (t = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null; ) n = n.slice(0, t.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let l;
    for (; (t = this.tokenizer.rules.inline.blockSkip.exec(n)) != null; ) l = t[2] ? t[2].length : 0, n = n.slice(0, t.index + l) + "[" + "a".repeat(t[0].length - l - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
    let i = !1, c = "";
    for (; e; ) {
      i || (c = ""), i = !1;
      let a;
      if (this.options.extensions?.inline?.some((o) => (a = o.call({ lexer: this }, e, s)) ? (e = e.substring(a.raw.length), s.push(a), !0) : !1)) continue;
      if (a = this.tokenizer.escape(e)) {
        e = e.substring(a.raw.length), s.push(a);
        continue;
      }
      if (a = this.tokenizer.tag(e)) {
        e = e.substring(a.raw.length), s.push(a);
        continue;
      }
      if (a = this.tokenizer.link(e)) {
        e = e.substring(a.raw.length), s.push(a);
        continue;
      }
      if (a = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(a.raw.length);
        let o = s.at(-1);
        a.type === "text" && o?.type === "text" ? (o.raw += a.raw, o.text += a.text) : s.push(a);
        continue;
      }
      if (a = this.tokenizer.emStrong(e, n, c)) {
        e = e.substring(a.raw.length), s.push(a);
        continue;
      }
      if (a = this.tokenizer.codespan(e)) {
        e = e.substring(a.raw.length), s.push(a);
        continue;
      }
      if (a = this.tokenizer.br(e)) {
        e = e.substring(a.raw.length), s.push(a);
        continue;
      }
      if (a = this.tokenizer.del(e, n, c)) {
        e = e.substring(a.raw.length), s.push(a);
        continue;
      }
      if (a = this.tokenizer.autolink(e)) {
        e = e.substring(a.raw.length), s.push(a);
        continue;
      }
      if (!this.state.inLink && (a = this.tokenizer.url(e))) {
        e = e.substring(a.raw.length), s.push(a);
        continue;
      }
      let h = e;
      if (this.options.extensions?.startInline) {
        let o = 1 / 0, p = e.slice(1), u;
        this.options.extensions.startInline.forEach((k) => {
          u = k.call({ lexer: this }, p), typeof u == "number" && u >= 0 && (o = Math.min(o, u));
        }), o < 1 / 0 && o >= 0 && (h = e.substring(0, o + 1));
      }
      if (a = this.tokenizer.inlineText(h)) {
        e = e.substring(a.raw.length), a.raw.slice(-1) !== "_" && (c = a.raw.slice(-1)), i = !0;
        let o = s.at(-1);
        o?.type === "text" ? (o.raw += a.raw, o.text += a.text) : s.push(a);
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
    return s;
  }
}, j = class {
  options;
  parser;
  constructor(r) {
    this.options = r || L;
  }
  space(r) {
    return "";
  }
  code({ text: r, lang: e, escaped: s }) {
    let n = (e || "").match(w.notSpaceStart)?.[0], t = r.replace(w.endingNewline, "") + \`
\`;
    return n ? '<pre><code class="language-' + z(n) + '">' + (s ? t : z(t, !0)) + \`</code></pre>
\` : "<pre><code>" + (s ? t : z(t, !0)) + \`</code></pre>
\`;
  }
  blockquote({ tokens: r }) {
    return \`<blockquote>
\${this.parser.parse(r)}</blockquote>
\`;
  }
  html({ text: r }) {
    return r;
  }
  def(r) {
    return "";
  }
  heading({ tokens: r, depth: e }) {
    return \`<h\${e}>\${this.parser.parseInline(r)}</h\${e}>
\`;
  }
  hr(r) {
    return \`<hr>
\`;
  }
  list(r) {
    let e = r.ordered, s = r.start, n = "";
    for (let i = 0; i < r.items.length; i++) {
      let c = r.items[i];
      n += this.listitem(c);
    }
    let t = e ? "ol" : "ul", l = e && s !== 1 ? ' start="' + s + '"' : "";
    return "<" + t + l + \`>
\` + n + "</" + t + \`>
\`;
  }
  listitem(r) {
    return \`<li>\${this.parser.parse(r.tokens)}</li>
\`;
  }
  checkbox({ checked: r }) {
    return "<input " + (r ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: r }) {
    return \`<p>\${this.parser.parseInline(r)}</p>
\`;
  }
  table(r) {
    let e = "", s = "";
    for (let t = 0; t < r.header.length; t++) s += this.tablecell(r.header[t]);
    e += this.tablerow({ text: s });
    let n = "";
    for (let t = 0; t < r.rows.length; t++) {
      let l = r.rows[t];
      s = "";
      for (let i = 0; i < l.length; i++) s += this.tablecell(l[i]);
      n += this.tablerow({ text: s });
    }
    return n && (n = \`<tbody>\${n}</tbody>\`), \`<table>
<thead>
\` + e + \`</thead>
\` + n + \`</table>
\`;
  }
  tablerow({ text: r }) {
    return \`<tr>
\${r}</tr>
\`;
  }
  tablecell(r) {
    let e = this.parser.parseInline(r.tokens), s = r.header ? "th" : "td";
    return (r.align ? \`<\${s} align="\${r.align}">\` : \`<\${s}>\`) + e + \`</\${s}>
\`;
  }
  strong({ tokens: r }) {
    return \`<strong>\${this.parser.parseInline(r)}</strong>\`;
  }
  em({ tokens: r }) {
    return \`<em>\${this.parser.parseInline(r)}</em>\`;
  }
  codespan({ text: r }) {
    return \`<code>\${z(r, !0)}</code>\`;
  }
  br(r) {
    return "<br>";
  }
  del({ tokens: r }) {
    return \`<del>\${this.parser.parseInline(r)}</del>\`;
  }
  link({ href: r, title: e, tokens: s }) {
    let n = this.parser.parseInline(s), t = ke(r);
    if (t === null) return n;
    r = t;
    let l = '<a href="' + r + '"';
    return e && (l += ' title="' + z(e) + '"'), l += ">" + n + "</a>", l;
  }
  image({ href: r, title: e, text: s, tokens: n }) {
    n && (s = this.parser.parseInline(n, this.parser.textRenderer));
    let t = ke(r);
    if (t === null) return z(s);
    r = t;
    let l = \`<img src="\${r}" alt="\${z(s)}"\`;
    return e && (l += \` title="\${z(e)}"\`), l += ">", l;
  }
  text(r) {
    return "tokens" in r && r.tokens ? this.parser.parseInline(r.tokens) : "escaped" in r && r.escaped ? r.text : z(r.text);
  }
}, U = class {
  strong({ text: r }) {
    return r;
  }
  em({ text: r }) {
    return r;
  }
  codespan({ text: r }) {
    return r;
  }
  del({ text: r }) {
    return r;
  }
  html({ text: r }) {
    return r;
  }
  text({ text: r }) {
    return r;
  }
  link({ text: r }) {
    return "" + r;
  }
  image({ text: r }) {
    return "" + r;
  }
  br() {
    return "";
  }
  checkbox({ raw: r }) {
    return r;
  }
}, S = class re {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || L, this.options.renderer = this.options.renderer || new j(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new U();
  }
  static parse(e, s) {
    return new re(s).parse(e);
  }
  static parseInline(e, s) {
    return new re(s).parseInline(e);
  }
  parse(e) {
    let s = "";
    for (let n = 0; n < e.length; n++) {
      let t = e[n];
      if (this.options.extensions?.renderers?.[t.type]) {
        let i = t, c = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (c !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(i.type)) {
          s += c || "";
          continue;
        }
      }
      let l = t;
      switch (l.type) {
        case "space": {
          s += this.renderer.space(l);
          break;
        }
        case "hr": {
          s += this.renderer.hr(l);
          break;
        }
        case "heading": {
          s += this.renderer.heading(l);
          break;
        }
        case "code": {
          s += this.renderer.code(l);
          break;
        }
        case "table": {
          s += this.renderer.table(l);
          break;
        }
        case "blockquote": {
          s += this.renderer.blockquote(l);
          break;
        }
        case "list": {
          s += this.renderer.list(l);
          break;
        }
        case "checkbox": {
          s += this.renderer.checkbox(l);
          break;
        }
        case "html": {
          s += this.renderer.html(l);
          break;
        }
        case "def": {
          s += this.renderer.def(l);
          break;
        }
        case "paragraph": {
          s += this.renderer.paragraph(l);
          break;
        }
        case "text": {
          s += this.renderer.text(l);
          break;
        }
        default: {
          let i = 'Token with "' + l.type + '" type was not found.';
          if (this.options.silent) return console.error(i), "";
          throw new Error(i);
        }
      }
    }
    return s;
  }
  parseInline(e, s = this.renderer) {
    let n = "";
    for (let t = 0; t < e.length; t++) {
      let l = e[t];
      if (this.options.extensions?.renderers?.[l.type]) {
        let c = this.options.extensions.renderers[l.type].call({ parser: this }, l);
        if (c !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(l.type)) {
          n += c || "";
          continue;
        }
      }
      let i = l;
      switch (i.type) {
        case "escape": {
          n += s.text(i);
          break;
        }
        case "html": {
          n += s.html(i);
          break;
        }
        case "link": {
          n += s.link(i);
          break;
        }
        case "image": {
          n += s.image(i);
          break;
        }
        case "checkbox": {
          n += s.checkbox(i);
          break;
        }
        case "strong": {
          n += s.strong(i);
          break;
        }
        case "em": {
          n += s.em(i);
          break;
        }
        case "codespan": {
          n += s.codespan(i);
          break;
        }
        case "br": {
          n += s.br(i);
          break;
        }
        case "del": {
          n += s.del(i);
          break;
        }
        case "text": {
          n += s.text(i);
          break;
        }
        default: {
          let c = 'Token with "' + i.type + '" type was not found.';
          if (this.options.silent) return console.error(c), "";
          throw new Error(c);
        }
      }
    }
    return n;
  }
}, M = class {
  options;
  block;
  constructor(r) {
    this.options = r || L;
  }
  static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
  preprocess(r) {
    return r;
  }
  postprocess(r) {
    return r;
  }
  processAllTokens(r) {
    return r;
  }
  emStrongMask(r) {
    return r;
  }
  provideLexer() {
    return this.block ? y.lex : y.lexInline;
  }
  provideParser() {
    return this.block ? S.parse : S.parseInline;
  }
}, Be = class {
  defaults = F();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = S;
  Renderer = j;
  TextRenderer = U;
  Lexer = y;
  Tokenizer = Z;
  Hooks = M;
  constructor(...r) {
    this.use(...r);
  }
  walkTokens(r, e) {
    let s = [];
    for (let n of r) switch (s = s.concat(e.call(this, n)), n.type) {
      case "table": {
        let t = n;
        for (let l of t.header) s = s.concat(this.walkTokens(l.tokens, e));
        for (let l of t.rows) for (let i of l) s = s.concat(this.walkTokens(i.tokens, e));
        break;
      }
      case "list": {
        let t = n;
        s = s.concat(this.walkTokens(t.items, e));
        break;
      }
      default: {
        let t = n;
        this.defaults.extensions?.childTokens?.[t.type] ? this.defaults.extensions.childTokens[t.type].forEach((l) => {
          let i = t[l].flat(1 / 0);
          s = s.concat(this.walkTokens(i, e));
        }) : t.tokens && (s = s.concat(this.walkTokens(t.tokens, e)));
      }
    }
    return s;
  }
  use(...r) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return r.forEach((s) => {
      let n = { ...s };
      if (n.async = this.defaults.async || n.async || !1, s.extensions && (s.extensions.forEach((t) => {
        if (!t.name) throw new Error("extension name required");
        if ("renderer" in t) {
          let l = e.renderers[t.name];
          l ? e.renderers[t.name] = function(...i) {
            let c = t.renderer.apply(this, i);
            return c === !1 && (c = l.apply(this, i)), c;
          } : e.renderers[t.name] = t.renderer;
        }
        if ("tokenizer" in t) {
          if (!t.level || t.level !== "block" && t.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let l = e[t.level];
          l ? l.unshift(t.tokenizer) : e[t.level] = [t.tokenizer], t.start && (t.level === "block" ? e.startBlock ? e.startBlock.push(t.start) : e.startBlock = [t.start] : t.level === "inline" && (e.startInline ? e.startInline.push(t.start) : e.startInline = [t.start]));
        }
        "childTokens" in t && t.childTokens && (e.childTokens[t.name] = t.childTokens);
      }), n.extensions = e), s.renderer) {
        let t = this.defaults.renderer || new j(this.defaults);
        for (let l in s.renderer) {
          if (!(l in t)) throw new Error(\`renderer '\${l}' does not exist\`);
          if (["options", "parser"].includes(l)) continue;
          let i = l, c = s.renderer[i], a = t[i];
          t[i] = (...h) => {
            let o = c.apply(t, h);
            return o === !1 && (o = a.apply(t, h)), o || "";
          };
        }
        n.renderer = t;
      }
      if (s.tokenizer) {
        let t = this.defaults.tokenizer || new Z(this.defaults);
        for (let l in s.tokenizer) {
          if (!(l in t)) throw new Error(\`tokenizer '\${l}' does not exist\`);
          if (["options", "rules", "lexer"].includes(l)) continue;
          let i = l, c = s.tokenizer[i], a = t[i];
          t[i] = (...h) => {
            let o = c.apply(t, h);
            return o === !1 && (o = a.apply(t, h)), o;
          };
        }
        n.tokenizer = t;
      }
      if (s.hooks) {
        let t = this.defaults.hooks || new M();
        for (let l in s.hooks) {
          if (!(l in t)) throw new Error(\`hook '\${l}' does not exist\`);
          if (["options", "block"].includes(l)) continue;
          let i = l, c = s.hooks[i], a = t[i];
          M.passThroughHooks.has(l) ? t[i] = (h) => {
            if (this.defaults.async && M.passThroughHooksRespectAsync.has(l)) return (async () => {
              let p = await c.call(t, h);
              return a.call(t, p);
            })();
            let o = c.call(t, h);
            return a.call(t, o);
          } : t[i] = (...h) => {
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
      if (s.walkTokens) {
        let t = this.defaults.walkTokens, l = s.walkTokens;
        n.walkTokens = function(i) {
          let c = [];
          return c.push(l.call(this, i)), t && (c = c.concat(t.call(this, i))), c;
        };
      }
      this.defaults = { ...this.defaults, ...n };
    }), this;
  }
  setOptions(r) {
    return this.defaults = { ...this.defaults, ...r }, this;
  }
  lexer(r, e) {
    return y.lex(r, e ?? this.defaults);
  }
  parser(r, e) {
    return S.parse(r, e ?? this.defaults);
  }
  parseMarkdown(r) {
    return (e, s) => {
      let n = { ...s }, t = { ...this.defaults, ...n }, l = this.onError(!!t.silent, !!t.async);
      if (this.defaults.async === !0 && n.async === !1) return l(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return l(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return l(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (t.hooks && (t.hooks.options = t, t.hooks.block = r), t.async) return (async () => {
        let i = t.hooks ? await t.hooks.preprocess(e) : e, c = await (t.hooks ? await t.hooks.provideLexer() : r ? y.lex : y.lexInline)(i, t), a = t.hooks ? await t.hooks.processAllTokens(c) : c;
        t.walkTokens && await Promise.all(this.walkTokens(a, t.walkTokens));
        let h = await (t.hooks ? await t.hooks.provideParser() : r ? S.parse : S.parseInline)(a, t);
        return t.hooks ? await t.hooks.postprocess(h) : h;
      })().catch(l);
      try {
        t.hooks && (e = t.hooks.preprocess(e));
        let i = (t.hooks ? t.hooks.provideLexer() : r ? y.lex : y.lexInline)(e, t);
        t.hooks && (i = t.hooks.processAllTokens(i)), t.walkTokens && this.walkTokens(i, t.walkTokens);
        let c = (t.hooks ? t.hooks.provideParser() : r ? S.parse : S.parseInline)(i, t);
        return t.hooks && (c = t.hooks.postprocess(c)), c;
      } catch (i) {
        return l(i);
      }
    };
  }
  onError(r, e) {
    return (s) => {
      if (s.message += \`
Please report this to https://github.com/markedjs/marked.\`, r) {
        let n = "<p>An error occurred:</p><pre>" + z(s.message + "", !0) + "</pre>";
        return e ? Promise.resolve(n) : n;
      }
      if (e) return Promise.reject(s);
      throw s;
    };
  }
}, E = new Be();
function f(r, e) {
  return E.parse(r, e);
}
f.options = f.setOptions = function(r) {
  return E.setOptions(r), f.defaults = E.defaults, ze(f.defaults), f;
};
f.getDefaults = F;
f.defaults = L;
f.use = function(...r) {
  return E.use(...r), f.defaults = E.defaults, ze(f.defaults), f;
};
f.walkTokens = function(r, e) {
  return E.walkTokens(r, e);
};
f.parseInline = E.parseInline;
f.Parser = S;
f.parser = S.parse;
f.Renderer = j;
f.TextRenderer = U;
f.Lexer = y;
f.lexer = y.lex;
f.Tokenizer = Z;
f.Hooks = M;
f.parse = f;
var Pt = f.options, Ct = f.setOptions, Et = f.use, It = f.walkTokens, Mt = f.parseInline, Bt = f, qt = S.parse, Dt = y.lex, me = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  Hooks: M,
  Lexer: y,
  Marked: Be,
  Parser: S,
  Renderer: j,
  TextRenderer: U,
  Tokenizer: Z,
  get defaults() {
    return L;
  },
  getDefaults: F,
  lexer: Dt,
  marked: f,
  options: Pt,
  parse: Bt,
  parseInline: Mt,
  parser: qt,
  setOptions: Ct,
  use: Et,
  walkTokens: It
});
function we(r) {
  if (r.startsWith("---")) {
    const e = r.indexOf(\`
---\`, 3);
    if (e !== -1) {
      const s = r.slice(3, e + 0).trim(), n = r.slice(e + 4).trimStart(), t = {};
      return s.split(/\\r?\\n/).forEach((l) => {
        const i = l.match(/^([^:]+):\\s*(.*)$/);
        i && (t[i[1].trim()] = i[2].trim());
      }), { content: n, data: t };
    }
  }
  return { content: r, data: {} };
}
class Zt {
  /**
   * Create an LRU cache.
   * @param {{maxSize?:number,ttlMs?:number,onEvict?:function}} [opts]
   */
  constructor(e = {}) {
    const { maxSize: s = 0, ttlMs: n = 0, onEvict: t = null } = e || {};
    this._map = /* @__PURE__ */ new Map(), this._maxSize = Math.max(0, Number(s) || 0), this._ttlMs = Math.max(0, Number(n) || 0), this._onEvict = typeof t == "function" ? t : null;
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
    const s = this._map.get(e);
    return s ? this._ttlMs && Date.now() - (s.ts || 0) >= this._ttlMs ? (this._evictKey(e, s), !1) : (this._map.delete(e), this._map.set(e, s), !0) : !1;
  }
  /**
   * Get value for key or undefined if missing/expired.
   * @param {*} key
   */
  get(e) {
    const s = this._map.get(e);
    if (s) {
      if (this._ttlMs && Date.now() - (s.ts || 0) >= this._ttlMs) {
        this._evictKey(e, s);
        return;
      }
      return this._map.delete(e), this._map.set(e, s), s.value;
    }
  }
  /**
   * Set a key/value pair and enforce maxSize eviction.
   * @param {*} key
   * @param {*} value
   */
  set(e, s) {
    if (this._map.has(e) && this._map.delete(e), this._map.set(e, { value: s, ts: Date.now() }), this._maxSize && this._map.size > this._maxSize)
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
      for (const [e, s] of this._map.entries())
        try {
          this._onEvict(e, s && s.value);
        } catch {
        }
    this._map.clear();
  }
  _evictKey(e, s) {
    try {
      this._map.delete(e);
    } catch {
    }
    if (this._onEvict) try {
      this._onEvict(e, s && s.value);
    } catch {
    }
  }
}
const Y = new Zt({ maxSize: 500 });
let jt = 300 * 1e3;
async function qe(r, e) {
  try {
    if (!r) return null;
    const s = Date.now();
    let n = Y.get(r);
    if (n && n.ok === !1 && s - (n.ts || 0) >= jt && (Y.delete(r), n = void 0), n) {
      if (n.module) return n.module;
      if (n.promise)
        try {
          return await n.promise;
        } catch {
          return null;
        }
    }
    const t = { promise: null, module: null, ok: null, ts: Date.now() };
    Y.set(r, t), t.promise = (async () => {
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
async function Nt(r) {
  return await qe(r, async () => {
    try {
      return await import(r);
    } catch {
      return null;
    }
  });
}
function ye(r) {
  try {
    if (!r && r !== 0) return "";
    const e = String(r), s = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
    return e.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (n, t) => {
      if (!t) return n;
      if (t[0] === "#")
        try {
          return t[1] === "x" || t[1] === "X" ? String.fromCharCode(parseInt(t.slice(2), 16)) : String.fromCharCode(parseInt(t.slice(1), 10));
        } catch {
          return n;
        }
      return s[t] !== void 0 ? s[t] : n;
    });
  } catch {
    return String(r || "");
  }
}
const D = me && (f || me) || void 0;
function Ht(r, e) {
  const s = String(r || "");
  if (!s || s.length <= e) return [s];
  const n = /^#{1,6}\\s.*$/gm, t = [];
  let l;
  for (; (l = n.exec(s)) !== null; ) t.push(l.index);
  if (!t.length || t.length < 2) {
    const h = [];
    for (let o = 0; o < s.length; o += e) h.push(s.slice(o, o + e));
    return h;
  }
  const i = [];
  t[0] > 0 && i.push(s.slice(0, t[0]));
  for (let h = 0; h < t.length; h++) {
    const o = t[h], p = h + 1 < t.length ? t[h + 1] : s.length;
    i.push(s.slice(o, p));
  }
  const c = [];
  let a = "";
  for (const h of i) {
    if (!a && h.length >= e) {
      c.push(h);
      continue;
    }
    a.length + h.length <= e ? a += h : (a && c.push(a), a = h);
  }
  return a && c.push(a), c;
}
const Se = /\`\`\`\\s*([a-zA-Z0-9_\\-+]+)?/g, Ot = /* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"]);
function $e(r) {
  try {
    return String(r || "").toLowerCase().trim().replace(/[^a-z0-9\\-\\s]+/g, "").replace(/\\s+/g, "-");
  } catch {
    return "heading";
  }
}
let b = null;
const Qt = "https://cdn.jsdelivr.net/npm/highlight.js";
async function De(r) {
  return await Nt(r);
}
async function ee() {
  if (b) return b;
  try {
    const r = Qt + "/lib/core.js";
    try {
      const e = await import("https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js");
      if (e) {
        b = e.default || e;
        try {
          await qe(r, async () => e);
        } catch {
        }
      } else
        b = null;
    } catch {
      const s = await De(r);
      s ? b = s.default || s : b = null;
    }
  } catch {
    b = null;
  }
  return b;
}
D && typeof D.setOptions == "function" && D.setOptions({
  gfm: !0,
  headerIds: !0,
  mangle: !1,
  highlighted: (r, e) => {
    try {
      return b && e && typeof b.getLanguage == "function" && b.getLanguage(e) ? b.highlight(r, { language: e }).value : b && typeof b.getLanguage == "function" && b.getLanguage("plaintext") ? b.highlight(r, { language: "plaintext" }).value : r;
    } catch {
      return r;
    }
  }
});
onmessage = async (r) => {
  const e = r.data || {};
  try {
    if (e.type === "register") {
      const { name: o, url: p } = e;
      try {
        if (!await ee()) {
          postMessage({ type: "register-error", name: o, error: "hljs unavailable" });
          return;
        }
        const k = await De(p), g = k ? k.default || k : null;
        if (!g) throw new Error("failed to import language module");
        b.registerLanguage(o, g), postMessage({ type: "registered", name: o });
      } catch (u) {
        postMessage({ type: "register-error", name: o, error: String(u) });
      }
      return;
    }
    if (e.type === "detect") {
      const o = e.md || "", p = e.supported || [], u = /* @__PURE__ */ new Set(), k = new RegExp(Se.source, Se.flags);
      let g;
      for (; g = k.exec(o); )
        if (g[1]) {
          const x = String(g[1]).toLowerCase();
          if (!x) continue;
          if (x.length >= 5 && x.length <= 30 && /^[a-z][a-z0-9_\\-+]*$/.test(x) && u.add(x), Ot.has(x) && u.add(x), p && p.length)
            try {
              p.indexOf(x) !== -1 && u.add(x);
            } catch {
            }
        }
      postMessage({ id: e.id, result: Array.from(u) });
      return;
    }
    if (e.type === "stream") {
      const o = e.id;
      try {
        const p = Number(e.chunkSize) || 65536, { content: u, data: k } = we(e.md || "");
        await ee().catch(() => {
        });
        const g = Ht(u, p), x = /* @__PURE__ */ new Map(), _ = $e;
        for (let $ = 0; $ < g.length; $++) {
          let R = g[$], T = D.parse(R);
          const A = [];
          T = T.replace(/<h([1-6])([^>]*)>([\\s\\S]*?)<\\/h\\1>/g, (v, m, H, O) => {
            const P = Number(m);
            let I = O.replace(/<[^>]+>/g, "").trim();
            try {
              I = ye(I);
            } catch {
            }
            let J = null;
            const pe = (H || "").match(/\\sid="([^"]+)"/);
            pe && (J = pe[1]);
            const Q = J || _(I) || "heading", V = (x.get(Q) || 0) + 1;
            x.set(Q, V);
            const ue = V === 1 ? Q : Q + "-" + V;
            A.push({ level: P, text: I, id: ue });
            const Ze = {
              1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
              2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
              3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
              4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
              5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
              6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
            }, je = P <= 2 ? "has-text-weight-bold" : P <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", Ne = (Ze[P] + " " + je).trim(), He = ((H || "").replace(/\\s*(id|class)="[^"]*"/g, "") + \` id="\${ue}" class="\${Ne}"\`).trim();
            return \`<h\${P} \${He}>\${O}</h\${P}>\`;
          }), T = T.replace(/<img([^>]*)>/g, (v, m) => /\\bloading=/.test(m) ? \`<img\${m}>\` : /\\bdata-want-lazy=/.test(m) ? \`<img\${m}>\` : \`<img\${m} loading="lazy">\`), postMessage({ id: o, type: "chunk", html: T, toc: A, index: $, isLast: $ === g.length - 1 });
        }
        postMessage({ id: o, type: "done", meta: k || {} });
      } catch (p) {
        postMessage({ id: e.id, error: String(p) });
      }
      return;
    }
    const { id: s, md: n } = e, { content: t, data: l } = we(n || "");
    await ee().catch(() => {
    });
    let i = D.parse(t);
    const c = [], a = /* @__PURE__ */ new Map(), h = $e;
    i = i.replace(/<h([1-6])([^>]*)>([\\s\\S]*?)<\\/h\\1>/g, (o, p, u, k) => {
      const g = Number(p);
      let x = k.replace(/<[^>]+>/g, "").trim();
      try {
        x = ye(x);
      } catch {
      }
      let _ = null;
      const $ = (u || "").match(/\\sid="([^"]+)"/);
      $ && (_ = $[1]);
      const R = _ || h(x) || "heading", A = (a.get(R) || 0) + 1;
      a.set(R, A);
      const v = A === 1 ? R : R + "-" + A;
      c.push({ level: g, text: x, id: v });
      const m = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, H = g <= 2 ? "has-text-weight-bold" : g <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", O = (m[g] + " " + H).trim(), I = ((u || "").replace(/\\s*(id|class)="[^"]*"/g, "") + \` id="\${v}" class="\${O}"\`).trim();
      return \`<h\${g} \${I}>\${k}</h\${g}>\`;
    }), i = i.replace(/<img([^>]*)>/g, (o, p) => /\\bloading=/.test(p) ? \`<img\${p}>\` : /\\bdata-want-lazy=/.test(p) ? \`<img\${p}>\` : \`<img\${p} loading="lazy">\`), postMessage({ id: s, result: { html: i, meta: l || {}, toc: c } });
  } catch (s) {
    postMessage({ id: e.id, error: String(s) });
  }
};
`, Qi = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", Ua], { type: "text/javascript;charset=utf-8" });
function Ml(e) {
  let t;
  try {
    if (t = Qi && (self.URL || self.webkitURL).createObjectURL(Qi), !t) throw "";
    const n = new Worker(t, {
      type: "module",
      name: e?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(t);
    }), n;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(Ua),
      {
        type: "module",
        name: e?.name
      }
    );
  }
}
function Yt(e) {
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
function or(e) {
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
const Qt = Xi && (Ae || Xi) || void 0;
function Wa(e, t) {
  const n = String(e || "");
  if (!n || n.length <= t) return [n];
  const i = /^#{1,6}\s.*$/gm, r = [];
  let a;
  for (; (a = i.exec(n)) !== null; ) r.push(a.index);
  if (!r.length || r.length < 2) {
    const c = [];
    for (let u = 0; u < n.length; u += t) c.push(n.slice(u, u + t));
    return c;
  }
  const s = [];
  r[0] > 0 && s.push(n.slice(0, r[0]));
  for (let c = 0; c < r.length; c++) {
    const u = r[c], g = c + 1 < r.length ? r[c + 1] : n.length;
    s.push(n.slice(u, g));
  }
  const o = [];
  let l = "";
  for (const c of s) {
    if (!l && c.length >= t) {
      o.push(c);
      continue;
    }
    l.length + c.length <= t ? l += c : (l && o.push(l), l = c);
  }
  return l && o.push(l), o;
}
const lr = /```\s*([a-zA-Z0-9_\-+]+)?/g, Za = /* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"]);
function cr(e) {
  try {
    return String(e || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
  } catch {
    return "heading";
  }
}
let Ke = null;
const Ll = "https://cdn.jsdelivr.net/npm/highlight.js";
function Tl() {
  Es(), Ke = null;
}
function zl(e) {
  Cs(e);
}
async function hi(e) {
  return await Ms(e);
}
async function an() {
  if (Ke) return Ke;
  try {
    const e = Ll + "/lib/core.js";
    try {
      const t = await import("https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js");
      if (t) {
        Ke = t.default || t;
        try {
          await Yr(e, async () => t);
        } catch {
        }
      } else
        Ke = null;
    } catch {
      const n = await hi(e);
      n ? Ke = n.default || n : Ke = null;
    }
  } catch {
    Ke = null;
  }
  return Ke;
}
Qt && typeof Qt.setOptions == "function" && Qt.setOptions({
  gfm: !0,
  headerIds: !0,
  mangle: !1,
  highlighted: (e, t) => {
    try {
      return Ke && t && typeof Ke.getLanguage == "function" && Ke.getLanguage(t) ? Ke.highlight(e, { language: t }).value : Ke && typeof Ke.getLanguage == "function" && Ke.getLanguage("plaintext") ? Ke.highlight(e, { language: "plaintext" }).value : e;
    } catch {
      return e;
    }
  }
});
onmessage = async (e) => {
  const t = e.data || {};
  try {
    if (t.type === "register") {
      const { name: u, url: g } = t;
      try {
        if (!await an()) {
          postMessage({ type: "register-error", name: u, error: "hljs unavailable" });
          return;
        }
        const d = await hi(g), p = d ? d.default || d : null;
        if (!p) throw new Error("failed to import language module");
        Ke.registerLanguage(u, p), postMessage({ type: "registered", name: u });
      } catch (h) {
        postMessage({ type: "register-error", name: u, error: String(h) });
      }
      return;
    }
    if (t.type === "detect") {
      const u = t.md || "", g = t.supported || [], h = /* @__PURE__ */ new Set(), d = new RegExp(lr.source, lr.flags);
      let p;
      for (; p = d.exec(u); )
        if (p[1]) {
          const m = String(p[1]).toLowerCase();
          if (!m) continue;
          if (m.length >= 5 && m.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(m) && h.add(m), Za.has(m) && h.add(m), g && g.length)
            try {
              g.indexOf(m) !== -1 && h.add(m);
            } catch {
            }
        }
      postMessage({ id: t.id, result: Array.from(h) });
      return;
    }
    if (t.type === "stream") {
      const u = t.id;
      try {
        const g = Number(t.chunkSize) || 65536, { content: h, data: d } = Yt(t.md || "");
        await an().catch(() => {
        });
        const p = Wa(h, g), m = /* @__PURE__ */ new Map(), f = cr;
        for (let w = 0; w < p.length; w++) {
          let y = p[w], _ = Qt.parse(y);
          const b = [];
          _ = _.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (v, S, E, P) => {
            const I = Number(S);
            let U = P.replace(/<[^>]+>/g, "").trim();
            try {
              U = or(U);
            } catch {
            }
            let z = null;
            const O = (E || "").match(/\sid="([^"]+)"/);
            O && (z = O[1]);
            const W = z || f(U) || "heading", H = (m.get(W) || 0) + 1;
            m.set(W, H);
            const M = H === 1 ? W : W + "-" + H;
            b.push({ level: I, text: U, id: M });
            const F = {
              1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
              2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
              3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
              4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
              5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
              6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
            }, G = I <= 2 ? "has-text-weight-bold" : I <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", ie = (F[I] + " " + G).trim(), J = ((E || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${M}" class="${ie}"`).trim();
            return `<h${I} ${J}>${P}</h${I}>`;
          }), _ = _.replace(/<img([^>]*)>/g, (v, S) => /\bloading=/.test(S) ? `<img${S}>` : /\bdata-want-lazy=/.test(S) ? `<img${S}>` : `<img${S} loading="lazy">`), postMessage({ id: u, type: "chunk", html: _, toc: b, index: w, isLast: w === p.length - 1 });
        }
        postMessage({ id: u, type: "done", meta: d || {} });
      } catch (g) {
        postMessage({ id: t.id, error: String(g) });
      }
      return;
    }
    const { id: n, md: i } = t, { content: r, data: a } = Yt(i || "");
    await an().catch(() => {
    });
    let s = Qt.parse(r);
    const o = [], l = /* @__PURE__ */ new Map(), c = cr;
    s = s.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (u, g, h, d) => {
      const p = Number(g);
      let m = d.replace(/<[^>]+>/g, "").trim();
      try {
        m = or(m);
      } catch {
      }
      let f = null;
      const w = (h || "").match(/\sid="([^"]+)"/);
      w && (f = w[1]);
      const y = f || c(m) || "heading", b = (l.get(y) || 0) + 1;
      l.set(y, b);
      const v = b === 1 ? y : y + "-" + b;
      o.push({ level: p, text: m, id: v });
      const S = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, E = p <= 2 ? "has-text-weight-bold" : p <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", P = (S[p] + " " + E).trim(), U = ((h || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${v}" class="${P}"`).trim();
      return `<h${p} ${U}>${d}</h${p}>`;
    }), s = s.replace(/<img([^>]*)>/g, (u, g) => /\bloading=/.test(g) ? `<img${g}>` : /\bdata-want-lazy=/.test(g) ? `<img${g}>` : `<img${g} loading="lazy">`), postMessage({ id: n, result: { html: s, meta: a || {}, toc: o } });
  } catch (n) {
    postMessage({ id: t.id, error: String(n) });
  }
};
async function di(e) {
  try {
    if (e && e.type === "register") {
      const { name: l, url: c } = e;
      try {
        if (!await an()) return { type: "register-error", name: l, error: "hljs unavailable" };
        const g = await hi(c), h = g ? g.default || g : null;
        return h ? (Ke.registerLanguage(l, h), { type: "registered", name: l }) : { type: "register-error", name: l, error: "failed to import language module" };
      } catch (u) {
        return { type: "register-error", name: l, error: String(u) };
      }
    }
    if (e && e.type === "detect") {
      const l = e.md || "", c = e.supported || [], u = /* @__PURE__ */ new Set(), g = new RegExp(lr.source, lr.flags);
      let h;
      for (; h = g.exec(l); )
        if (h[1]) {
          const d = String(h[1]).toLowerCase();
          if (!d) continue;
          if (d.length >= 5 && d.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(d) && u.add(d), Za.has(d) && u.add(d), c && c.length)
            try {
              c.indexOf(d) !== -1 && u.add(d);
            } catch {
            }
        }
      return { id: e.id, result: Array.from(u) };
    }
    const t = e && e.id, { content: n, data: i } = Yt(e && e.md || "");
    await an().catch(() => {
    });
    let r = Qt.parse(n);
    const a = [], s = /* @__PURE__ */ new Map(), o = cr;
    return r = r.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (l, c, u, g) => {
      const h = Number(c);
      let d = g.replace(/<[^>]+>/g, "").trim();
      try {
        d = or(d);
      } catch {
      }
      let p = null;
      const m = (u || "").match(/\sid="([^"]+)"/);
      m && (p = m[1]);
      const f = p || o(d) || "heading", y = (s.get(f) || 0) + 1;
      s.set(f, y);
      const _ = y === 1 ? f : f + "-" + y;
      a.push({ level: h, text: d, id: _ });
      const b = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, v = h <= 2 ? "has-text-weight-bold" : h <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", S = (b[h] + " " + v).trim(), P = ((u || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${_}" class="${S}"`).trim();
      return `<h${h} ${P}>${g}</h${h}>`;
    }), r = r.replace(/<img([^>]*)>/g, (l, c) => /\bloading=/.test(c) ? `<img${c}>` : /\bdata-want-lazy=/.test(c) ? `<img${c}>` : `<img${c} loading="lazy">`), { id: t, result: { html: r, meta: i || {}, toc: a } };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
async function Fr(e, t) {
  try {
    if (!e || e.type !== "stream") {
      const u = await di(e);
      return typeof t == "function" && t(u), u;
    }
    const n = e.id, i = Number(e.chunkSize) || 64 * 1024, { content: r, data: a } = Yt(e.md || "");
    await an().catch(() => {
    });
    const s = Wa(r, i), o = /* @__PURE__ */ new Map(), l = cr;
    for (let u = 0; u < s.length; u++) {
      let g = s[u], h = Qt.parse(g);
      const d = [];
      h = h.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (m, f, w, y) => {
        const _ = Number(f);
        let b = y.replace(/<[^>]+>/g, "").trim();
        try {
          b = or(b);
        } catch {
        }
        let v = null;
        const S = (w || "").match(/\sid="([^"]+)"/);
        S && (v = S[1]);
        const E = v || l(b) || "heading", I = (o.get(E) || 0) + 1;
        o.set(E, I);
        const U = I === 1 ? E : E + "-" + I;
        d.push({ level: _, text: b, id: U });
        const z = {
          1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
          2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
          3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
          4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
          5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
          6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
        }, O = _ <= 2 ? "has-text-weight-bold" : _ <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", W = (z[_] + " " + O).trim(), H = ((w || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${U}" class="${W}"`).trim();
        return `<h${_} ${H}>${y}</h${_}>`;
      }), h = h.replace(/<img([^>]*)>/g, (m, f) => /\bloading=/.test(f) ? `<img${f}>` : /\bdata-want-lazy=/.test(f) ? `<img${f}>` : `<img${f} loading="lazy">`);
      const p = { id: n, type: "chunk", html: h, toc: d, index: u, isLast: u === s.length - 1 };
      typeof t == "function" && t(p);
    }
    const c = { id: n, type: "done", meta: a || {} };
    return typeof t == "function" && t(c), c;
  } catch (n) {
    const i = { id: e && e.id, error: String(n) };
    return typeof t == "function" && t(i), i;
  }
}
const Rl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clearRendererImportCache: Tl,
  handleWorkerMessage: di,
  handleWorkerMessageStream: Fr,
  setRendererImportNegativeCacheTTL: zl
}, Symbol.toStringTag, { value: "Module" })), Jn = {
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
}, $l = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2, Ga = pa(() => {
  if (typeof Worker < "u")
    try {
      return new Ml();
    } catch {
    }
  try {
    if (Zt) return Zt(Cl);
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
          if (Rl && typeof Fr == "function" && t && t.type === "stream")
            await Fr(t, (n) => {
              const i = { data: n };
              (e.message || []).forEach((r) => r(i));
            });
          else {
            const i = { data: await di(t) };
            (e.message || []).forEach((r) => r(i));
          }
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
}, "markdown", $l), wt = () => Ga.get(), fi = (e, t = 3e3) => Ga.send(e, t), At = [];
function Dr(e) {
  if (e && (typeof e == "object" || typeof e == "function")) {
    At.push(e);
    try {
      Ae.use(e);
    } catch (t) {
      k("[markdown] failed to apply plugin", t);
    }
  }
}
function Pl(e) {
  At.length = 0, Array.isArray(e) && At.push(...e.filter((t) => t && typeof t == "object"));
  try {
    At.forEach((t) => Ae.use(t));
  } catch (t) {
    k("[markdown] failed to apply markdown extensions", t);
  }
}
function Ki(e) {
  try {
    return String(e || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
  } catch {
    return "heading";
  }
}
function Il(e, t) {
  const n = String(e || "");
  if (!n || n.length <= t) return [n];
  const i = /^#{1,6}\s.*$/gm, r = [];
  let a;
  for (; (a = i.exec(n)) !== null; ) r.push(a.index);
  if (!r.length || r.length < 2) {
    const c = [];
    for (let u = 0; u < n.length; u += t) c.push(n.slice(u, u + t));
    return c;
  }
  const s = [];
  r[0] > 0 && s.push(n.slice(0, r[0]));
  for (let c = 0; c < r.length; c++) {
    const u = r[c], g = c + 1 < r.length ? r[c + 1] : n.length;
    s.push(n.slice(u, g));
  }
  const o = [];
  let l = "";
  for (const c of s) {
    if (!l && c.length >= t) {
      o.push(c);
      continue;
    }
    l.length + c.length <= t ? l += c : (l && o.push(l), l = c);
  }
  return l && o.push(l), o;
}
async function Ur(e, t, n = {}) {
  const i = n && n.chunkSize ? Number(n.chunkSize) : 65536, r = typeof t == "function" ? t : (() => {
  }), { content: a, data: s } = Yt(String(e || ""));
  let o = a;
  try {
    o = String(o || "").replace(/:([^:\s]+):/g, (h, d) => Jn[d] || h);
  } catch {
  }
  let l;
  if (typeof process < "u" && process.env && process.env.VITEST)
    try {
      const h = await Promise.resolve().then(() => gi);
      l = h.initRendererWorker && h.initRendererWorker();
    } catch {
      l = wt && wt();
    }
  else
    l = wt && wt();
  if (!(typeof process < "u" && process.env && process.env.VITEST) && l && typeof l.postMessage == "function")
    return new Promise((h, d) => {
      const p = String(Math.random());
      let m = null;
      const f = () => {
        m && clearTimeout(m);
        try {
          l.removeEventListener && l.removeEventListener("message", w);
        } catch {
        }
        try {
          l.removeEventListener && l.removeEventListener("error", y);
        } catch {
        }
      }, w = (_) => {
        const b = _ && _.data ? _.data : {};
        if (b.id === p) {
          if (b.error)
            return f(), d(new Error(b.error));
          if (b.type === "chunk") {
            try {
              r(String(b.html || ""), { index: b.index, isLast: !!b.isLast, meta: {}, toc: b.toc || [] });
            } catch {
            }
            return;
          }
          if (b.type === "done") {
            f();
            try {
              r("", { index: -1, isLast: !0, meta: b.meta || {} });
            } catch {
            }
            return h();
          }
          if (b.result) {
            f();
            try {
              r(String(b.result && b.result.html || ""), { index: 0, isLast: !0, meta: b.result.meta || {}, toc: b.result.toc || [] });
            } catch {
            }
            return h();
          }
        }
      }, y = (_) => {
        f(), d(new Error(_ && _.message || "worker error"));
      };
      m = setTimeout(() => {
        f(), d(new Error("worker timeout"));
      }, n && n.timeout ? Number(n.timeout) : 1e4);
      try {
        l.addEventListener && l.addEventListener("message", w), l.addEventListener && l.addEventListener("error", y), l.postMessage({ type: "stream", id: p, md: o, chunkSize: i });
      } catch (_) {
        f(), d(_);
      }
    });
  const c = Il(o, i), u = qe(), g = /* @__PURE__ */ new Map();
  for (let h = 0; h < c.length; h++) {
    const d = c[h], p = await ln(d);
    let m = String(p && p.html || ""), f = [];
    if (u)
      try {
        const y = u.parseFromString(m, "text/html");
        y.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((b) => {
          try {
            const v = Number(b.tagName.substring(1)), S = (b.textContent || "").trim(), E = Ki(S), I = (g.get(E) || 0) + 1;
            g.set(E, I);
            const U = I === 1 ? E : E + "-" + I;
            b.id = U, f.push({ level: v, text: S, id: U });
          } catch {
          }
        });
        try {
          typeof XMLSerializer < "u" ? m = new XMLSerializer().serializeToString(y.body).replace(/^<body[^>]*>/i, "").replace(/<\/body>$/i, "") : m = Array.from(y.body.childNodes || []).map((v) => v && typeof v.outerHTML == "string" ? v.outerHTML : v && typeof v.textContent == "string" ? v.textContent : "").join("");
        } catch {
        }
      } catch {
      }
    else
      try {
        const y = [];
        m = m.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (_, b, v, S) => {
          const E = Number(b), P = S.replace(/<[^>]+>/g, "").trim(), I = Ki(P), z = (g.get(I) || 0) + 1;
          g.set(I, z);
          const O = z === 1 ? I : I + "-" + z;
          y.push({ level: E, text: P, id: O });
          const W = (v || "").replace(/\s*(id|class)="[^"]*"/g, "");
          return `<h${E} ${W} id="${O}">${S}</h${E}>`;
        }), f = y;
      } catch {
      }
    const w = { index: h, isLast: h === c.length - 1, meta: h === 0 ? s || {} : {}, toc: f };
    try {
      r(m, w);
    } catch {
    }
  }
}
async function ln(e) {
  if (At && At.length) {
    let { content: i, data: r } = Yt(e || "");
    try {
      i = String(i || "").replace(/:([^:\s]+):/g, (s, o) => Jn[o] || s);
    } catch {
    }
    Ae.setOptions({ gfm: !0, mangle: !1, headerIds: !1, headerPrefix: "" });
    try {
      At.forEach((s) => Ae.use(s));
    } catch (s) {
      k("[markdown] apply plugins failed", s);
    }
    const a = Ae.parse(i);
    try {
      const s = qe();
      if (s) {
        const o = s.parseFromString(a, "text/html"), l = o.querySelectorAll("h1,h2,h3,h4,h5,h6"), c = [], u = /* @__PURE__ */ new Set(), g = (d) => {
          try {
            return String(d || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
          } catch {
            return "heading";
          }
        }, h = (d) => {
          const p = {
            1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
            2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
            3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
            4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
            5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
            6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
          }, m = d <= 2 ? "has-text-weight-bold" : d <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
          return (p[d] + " " + m).trim();
        };
        l.forEach((d) => {
          try {
            const p = Number(d.tagName.substring(1)), m = (d.textContent || "").trim();
            let f = g(m) || "heading", w = f, y = 2;
            for (; u.has(w); )
              w = f + "-" + y, y += 1;
            u.add(w), d.id = w, d.className = h(p), c.push({ level: p, text: m, id: w });
          } catch {
          }
        });
        try {
          (o && typeof o.getElementsByTagName == "function" ? Array.from(o.getElementsByTagName("img")) : o && typeof o.querySelectorAll == "function" ? Array.from(o.querySelectorAll("img")) : []).forEach((p) => {
            try {
              const m = p.getAttribute && p.getAttribute("loading"), f = p.getAttribute && p.getAttribute("data-want-lazy");
              !m && !f && p.setAttribute && p.setAttribute("loading", "lazy");
            } catch {
            }
          });
        } catch {
        }
        try {
          o.querySelectorAll("pre code, code[class]").forEach((d) => {
            try {
              const p = d.getAttribute && d.getAttribute("class") || d.className || "", m = String(p || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
              if (m)
                try {
                  d.setAttribute && d.setAttribute("class", m);
                } catch {
                  d.className = m;
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
        try {
          let d = null;
          try {
            typeof XMLSerializer < "u" ? d = new XMLSerializer().serializeToString(o.body).replace(/^<body[^>]*>/i, "").replace(/<\/body>$/i, "") : d = Array.from(o.body.childNodes || []).map((m) => m && typeof m.outerHTML == "string" ? m.outerHTML : m && typeof m.textContent == "string" ? m.textContent : "").join("");
          } catch {
            try {
              d = o.body.innerHTML;
            } catch {
              d = "";
            }
          }
          return { html: d, meta: r || {}, toc: c };
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
      const i = await Promise.resolve().then(() => gi);
      t = i.initRendererWorker && i.initRendererWorker();
    } catch {
      t = wt && wt();
    }
  else
    t = wt && wt();
  try {
    e = String(e || "").replace(/:([^:\s]+):/g, (i, r) => Jn[r] || i);
  } catch {
  }
  try {
    if (typeof Re < "u" && Re && typeof Re.getLanguage == "function" && Re.getLanguage("plaintext") && /```\s*\n/.test(String(e || ""))) {
      let { content: i, data: r } = Yt(e || "");
      try {
        i = String(i || "").replace(/:([^:\s]+):/g, (c, u) => Jn[u] || c);
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
                const g = Re.highlight(u, { language: "plaintext" });
                return `<pre><code>${g && g.value ? g.value : g}</code></pre>`;
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
      return a = a.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (c, u, g, h) => {
        const d = Number(u), p = h.replace(/<[^>]+>/g, "").trim();
        let m = l(p) || "heading", f = m, w = 2;
        for (; o.has(f); )
          f = m + "-" + w, w += 1;
        o.add(f), s.push({ level: d, text: p, id: f });
        const y = {
          1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
          2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
          3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
          4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
          5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
          6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
        }, _ = d <= 2 ? "has-text-weight-bold" : d <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", b = (y[d] + " " + _).trim(), S = ((g || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${f}" class="${b}"`).trim();
        return `<h${d} ${S}>${h}</h${d}>`;
      }), a = a.replace(/<img([^>]*)>/g, (c, u) => /\bloading=/.test(u) ? `<img${u}>` : /\bdata-want-lazy=/.test(u) ? `<img${u}>` : `<img${u} loading="lazy">`), { html: a, meta: r || {}, toc: s };
    }
  } catch {
  }
  if (!t) throw new Error("renderer worker required but unavailable");
  const n = await fi({ type: "render", md: e });
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
    o = o.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (l, c, u, g) => {
      const h = Number(c), d = g.replace(/<[^>]+>/g, "").trim(), p = (u || "").match(/\sid="([^"]+)"/), m = p ? p[1] : a(d) || "heading", w = (i.get(m) || 0) + 1;
      i.set(m, w);
      const y = w === 1 ? m : m + "-" + w;
      r.push({ level: h, text: d, id: y });
      const _ = s(h), v = ((u || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${y}" class="${_}"`).trim();
      return `<h${h} ${v}>${g}</h${h}>`;
    });
    try {
      const l = typeof document < "u" && document.documentElement && document.documentElement.getAttribute && document.documentElement.getAttribute("data-nimbi-logo-moved") || "";
      if (l) {
        const c = qe();
        if (c) {
          const u = c.parseFromString(o, "text/html");
          (u && typeof u.getElementsByTagName == "function" ? Array.from(u.getElementsByTagName("img")) : u && typeof u.querySelectorAll == "function" ? Array.from(u.querySelectorAll("img")) : []).forEach((h) => {
            try {
              const d = h.getAttribute("src") || "";
              (d ? new URL(d, location.href).toString() : "") === l && h.remove();
            } catch {
            }
          });
          try {
            typeof XMLSerializer < "u" ? o = new XMLSerializer().serializeToString(u.body).replace(/^<body[^>]*>/i, "").replace(/<\/body>$/i, "") : o = Array.from(u.body.childNodes || []).map((d) => d && typeof d.outerHTML == "string" ? d.outerHTML : d && typeof d.textContent == "string" ? d.textContent : "").join("");
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
function vn(e, t) {
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
      if (ca.has(o) || t && t.size && o.length < 3 && !t.has(o) && !(ht && ht[o] && t.has(ht[o]))) continue;
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
async function Wr(e, t) {
  if (At && At.length || typeof process < "u" && process.env && process.env.VITEST) return vn(e || "", t);
  if (wt && wt())
    try {
      const i = t && t.size ? Array.from(t.keys()) : [], r = await fi({ type: "detect", md: String(e || ""), supported: i });
      if (Array.isArray(r)) return new Set(r);
    } catch (i) {
      k("[markdown] detectFenceLanguagesAsync worker failed", i);
    }
  return vn(e || "", t);
}
const gi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _sendToRenderer: fi,
  addMarkdownExtension: Dr,
  detectFenceLanguages: vn,
  detectFenceLanguagesAsync: Wr,
  initRendererWorker: wt,
  markdownPlugins: At,
  parseMarkdownToHtml: ln,
  setMarkdownExtensions: Pl,
  streamParseMarkdown: Ur
}, Symbol.toStringTag, { value: "Module" }));
function Nl(e, t = 150, n = {}) {
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
function Ol(e) {
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
function Bl() {
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
const er = Bl(), jl = `/**
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
        const s = qe();
        if (!s)
          postMessage({ id: n, result: i });
        else {
          const o = s.parseFromString(i || "", "text/html"), l = o.body;
          await pi(l, r, a, { canonical: !0 }), postMessage({ id: n, result: o.body.innerHTML });
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
async function Xa(e) {
  try {
    if (e && e.type === "rewriteAnchors") {
      const { id: t, html: n, contentBase: i, pagePath: r } = e;
      try {
        const a = qe();
        if (!a)
          return { id: t, result: n };
        const s = a.parseFromString(n || "", "text/html"), o = s.body;
        return await pi(o, i, r, { canonical: !0 }), { id: t, result: s.body.innerHTML };
      } catch (a) {
        return { id: t, error: String(a) };
      }
    }
    return { id: e && e.id, error: "unsupported message" };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
const ql = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  handleAnchorWorkerMessage: Xa
}, Symbol.toStringTag, { value: "Module" }));
function dt(e, t = null) {
  try {
    const n = typeof location < "u" && location && typeof location.pathname == "string" && location.pathname || "/";
    return String(n) + Pi(e, t);
  } catch {
    return Pi(e, t);
  }
}
function Hl(...e) {
  try {
    k(...e);
  } catch {
  }
}
function ur(e) {
  try {
    if (Jt(3)) return !0;
  } catch {
  }
  try {
    if (typeof le == "string" && le) return !0;
  } catch {
  }
  try {
    if (V && V.size) return !0;
  } catch {
  }
  try {
    if ($e && $e.size) return !0;
  } catch {
  }
  return !1;
}
function vt(e, t) {
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
    e && t && V && typeof V.set == "function" && !V.has(e) && V.set(e, t);
  } catch {
  }
  try {
    t && Z && typeof Z.set == "function" && Z.set(t, e);
  } catch {
  }
  try {
    if ($e && typeof $e.has == "function") {
      if (!$e.has(t)) {
        try {
          $e.add(t);
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
function Fl(e, t) {
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
function Dl(e, t) {
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
          l.setAttribute("href", Pe(c));
        } catch {
          c && c.indexOf("/") === -1 ? l.setAttribute("href", "#" + encodeURIComponent(c)) : l.setAttribute("href", dt(c));
        }
      } catch {
        l.setAttribute("href", "#" + s.path);
      }
      if (l.textContent = s.name, o.appendChild(l), s.children && s.children.length) {
        const c = document.createElement("ul");
        s.children.forEach((u) => {
          const g = document.createElement("li"), h = document.createElement("a");
          try {
            const d = String(u.path || "");
            try {
              h.setAttribute("href", Pe(d));
            } catch {
              d && d.indexOf("/") === -1 ? h.setAttribute("href", "#" + encodeURIComponent(d)) : h.setAttribute("href", dt(d));
            }
          } catch {
            h.setAttribute("href", "#" + u.path);
          }
          h.textContent = u.name, g.appendChild(h), c.appendChild(g);
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
            l.setAttribute("href", Pe(c));
          } catch {
            c && c.indexOf("/") === -1 ? l.setAttribute("href", "#" + encodeURIComponent(c)) : l.setAttribute("href", dt(c));
          }
        } catch {
          l.setAttribute("href", "#" + s.path);
        }
        if (l.textContent = s.name, o.appendChild(l), s.children && s.children.length) {
          const c = document.createElement("ul");
          s.children.forEach((u) => {
            const g = document.createElement("li"), h = document.createElement("a");
            try {
              const d = String(u.path || "");
              try {
                h.setAttribute("href", Pe(d));
              } catch {
                d && d.indexOf("/") === -1 ? h.setAttribute("href", "#" + encodeURIComponent(d)) : h.setAttribute("href", dt(d));
              }
            } catch {
              h.setAttribute("href", "#" + u.path);
            }
            h.textContent = u.name, g.appendChild(h), c.appendChild(g);
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
function Ul(e, t, n = "") {
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
        const c = Number(l.level) >= 2 ? Number(l.level) : 2, u = document.createElement("li"), g = document.createElement("a"), h = Us(l.text || ""), d = l.id || he(h);
        g.textContent = h;
        try {
          const w = String(n || "").replace(/^[\\.\\/]+/, ""), y = w && Z && Z.has && Z.has(w) ? Z.get(w) : w;
          y ? g.href = Pe(y, d) : g.href = `#${encodeURIComponent(d)}`;
        } catch (w) {
          k("[htmlBuilder] buildTocElement href normalization failed", w), g.href = `#${encodeURIComponent(d)}`;
        }
        if (u.appendChild(g), c === 2) {
          a.appendChild(u), o[2] = u, Object.keys(o).forEach((w) => {
            Number(w) > 2 && delete o[w];
          });
          return;
        }
        let p = c - 1;
        for (; p > 2 && !o[p]; ) p--;
        p < 2 && (p = 2);
        let m = o[p];
        if (!m) {
          a.appendChild(u), o[c] = u;
          return;
        }
        let f = m.querySelector("ul");
        f || (f = document.createElement("ul"), m.appendChild(f)), f.appendChild(u), o[c] = u;
      } catch (c) {
        k("[htmlBuilder] buildTocElement item failed", c, l);
      }
    });
  } catch (o) {
    k("[htmlBuilder] buildTocElement failed", o);
  }
  return i.appendChild(a), a.querySelectorAll("li").length <= 1 ? null : i;
}
function Qa(e) {
  e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((n) => {
    n.id || (n.id = he(n.textContent || ""));
  });
}
function Wl(e, t, n) {
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
function Vi(e, t, n) {
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
            const g = o.getAttribute(u) || "";
            if (!g || /^(https?:)?\/\//i.test(g) || g.startsWith("/") || g.startsWith("#")) return;
            try {
              o.setAttribute(u, new URL(g, r).toString());
            } catch (h) {
              k("[htmlBuilder] rewrite asset attribute failed", u, g, h);
            }
          } catch (g) {
            k("[htmlBuilder] rewriteAttr failed", g);
          }
        };
        if (o.hasAttribute && o.hasAttribute("src") && c("src"), o.hasAttribute && o.hasAttribute("href") && l !== "a" && c("href"), o.hasAttribute && o.hasAttribute("xlink:href") && c("xlink:href"), o.hasAttribute && o.hasAttribute("poster") && c("poster"), o.hasAttribute && o.hasAttribute("srcset")) {
          const h = (o.getAttribute("srcset") || "").split(",").map((d) => d.trim()).filter(Boolean).map((d) => {
            const [p, m] = d.split(/\s+/, 2);
            if (!p || /^(https?:)?\/\//i.test(p) || p.startsWith("/")) return d;
            try {
              const f = new URL(p, r).toString();
              return m ? `${f} ${m}` : f;
            } catch {
              return d;
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
let Yi = "", Lr = null, Ji = "";
async function pi(e, t, n, i = {}) {
  try {
    i = i || {}, typeof i.canonical > "u" && (i.canonical = !0);
    const r = e.querySelectorAll("a");
    if (!r || !r.length) return;
    let a, s;
    if (t === Yi && Lr)
      a = Lr, s = Ji;
    else {
      try {
        a = new URL(t, location.href), s = Kt(a.pathname);
      } catch {
        try {
          a = new URL(t, location.href), s = Kt(a.pathname);
        } catch {
          a = null, s = "/";
        }
      }
      Yi = t, Lr = a, Ji = s;
    }
    const o = /* @__PURE__ */ new Set(), l = [], c = /* @__PURE__ */ new Set(), u = [];
    for (const g of Array.from(r))
      try {
        try {
          if (g.closest && g.closest("h1,h2,h3,h4,h5,h6")) continue;
        } catch {
        }
        const h = g.getAttribute("href") || "";
        if (!h || Pr(h)) continue;
        try {
          if (h.startsWith("?") || h.indexOf("?") !== -1)
            try {
              const p = new URL(h, t || location.href), m = p.searchParams.get("page");
              if (m && m.indexOf("/") === -1 && n) {
                const f = n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "";
                if (f) {
                  const w = Y(f + m), y = i && i.canonical ? Pe(w, p.hash ? p.hash.replace(/^#/, "") : null) : dt(w, p.hash ? p.hash.replace(/^#/, "") : null);
                  g.setAttribute("href", y);
                  continue;
                }
              }
            } catch {
            }
        } catch {
        }
        if (h.startsWith("/") && !h.endsWith(".md")) continue;
        const d = h.match(/^([^#?]+\.md)(?:[#](.+))?$/);
        if (d) {
          let p = d[1];
          const m = d[2];
          !p.startsWith("/") && n && (p = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + p);
          try {
            const f = new URL(p, t).pathname;
            let w = f.startsWith(s) ? f.slice(s.length) : f;
            w = Y(w), l.push({ node: g, mdPathRaw: p, frag: m, rel: w }), Z.has(w) || o.add(w);
          } catch (f) {
            k("[htmlBuilder] resolve mdPath failed", f);
          }
          continue;
        }
        try {
          let p = h;
          !h.startsWith("/") && n && (h.startsWith("#") ? p = n + h : p = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + h);
          const f = new URL(p, t).pathname || "";
          if (f && f.indexOf(s) !== -1) {
            let w = f.startsWith(s) ? f.slice(s.length) : f;
            if (w = Y(w), w = sn(w), w || (w = ei), !w.endsWith(".md")) {
              let y = null;
              try {
                if (Z && Z.has && Z.has(w))
                  y = Z.get(w);
                else
                  try {
                    const _ = String(w || "").replace(/^.*\//, "");
                    _ && Z.has && Z.has(_) && (y = Z.get(_));
                  } catch (_) {
                    k("[htmlBuilder] mdToSlug baseName check failed", _);
                  }
              } catch (_) {
                k("[htmlBuilder] mdToSlug access check failed", _);
              }
              if (!y)
                try {
                  const _ = String(w || "").replace(/^.*\//, "");
                  for (const [b, v] of V || [])
                    if (v === w || v === _) {
                      y = b;
                      break;
                    }
                } catch {
                }
              if (y) {
                const _ = i && i.canonical ? Pe(y, null) : dt(y);
                g.setAttribute("href", _);
              } else {
                let _ = w;
                try {
                  /\.[^\/]+$/.test(String(w || "")) || (_ = String(w || "") + ".html");
                } catch {
                  _ = w;
                }
                c.add(_), u.push({ node: g, rel: _ });
              }
            }
          }
        } catch (p) {
          k("[htmlBuilder] resolving href to URL failed", p);
        }
      } catch (h) {
        k("[htmlBuilder] processing anchor failed", h);
      }
    if (o.size)
      if (ur(t))
        await zn(Array.from(o), async (g) => {
          try {
            try {
              const d = String(g).match(/([^\/]+)\.md$/), p = d && d[1];
              if (p && V.has(p)) {
                try {
                  const m = V.get(p);
                  if (m)
                    try {
                      const f = typeof m == "string" ? m : m && m.default ? m.default : null;
                      f && vt(p, f);
                    } catch (f) {
                      k("[htmlBuilder] _storeSlugMapping failed", f);
                    }
                } catch (m) {
                  k("[htmlBuilder] reading slugToMd failed", m);
                }
                return;
              }
            } catch (d) {
              k("[htmlBuilder] basename slug lookup failed", d);
            }
            const h = await Oe(g, t);
            if (h && h.raw) {
              const d = (h.raw || "").match(/^#\s+(.+)$/m);
              if (d && d[1]) {
                const p = he(d[1].trim());
                if (p)
                  try {
                    vt(p, g);
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
        for (const g of Array.from(o))
          try {
            const h = String(g).match(/([^\/]+)\.md$/), d = h && h[1];
            if (d) {
              const p = he(d);
              if (p)
                try {
                  vt(p, g);
                } catch (m) {
                  k("[htmlBuilder] setting fallback slug mapping failed", m);
                }
            }
          } catch {
          }
      }
    if (c.size)
      if (ur(t))
        await zn(Array.from(c), async (g) => {
          try {
            const h = await Oe(g, t);
            if (h && h.raw)
              try {
                const d = qe(), p = d ? d.parseFromString(h.raw, "text/html") : null, m = p ? p.querySelector("title") : null, f = p ? p.querySelector("h1") : null, w = m && m.textContent && m.textContent.trim() ? m.textContent.trim() : f && f.textContent ? f.textContent.trim() : null;
                if (w) {
                  const y = he(w);
                  if (y)
                    try {
                      vt(y, g);
                    } catch (_) {
                      k("[htmlBuilder] setting html slug mapping failed", _);
                    }
                }
              } catch (d) {
                k("[htmlBuilder] parse fetched HTML failed", d);
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
        for (const g of Array.from(c))
          try {
            const h = String(g).match(/([^\/]+)\.html$/), d = h && h[1];
            if (d) {
              const p = he(d);
              if (p)
                try {
                  vt(p, g);
                } catch (m) {
                  k("[htmlBuilder] setting fallback html slug mapping failed", m);
                }
            }
          } catch {
          }
      }
    for (const g of l) {
      const { node: h, frag: d, rel: p } = g;
      let m = null;
      try {
        Z.has(p) && (m = Z.get(p));
      } catch (f) {
        k("[htmlBuilder] mdToSlug access failed", f);
      }
      if (m) {
        const f = i && i.canonical ? Pe(m, d) : dt(m, d);
        h.setAttribute("href", f);
      } else {
        const f = i && i.canonical ? Pe(p, d) : dt(p, d);
        h.setAttribute("href", f);
      }
    }
    for (const g of u) {
      const { node: h, rel: d } = g;
      let p = null;
      try {
        Z.has(d) && (p = Z.get(d));
      } catch (m) {
        k("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo", m);
      }
      if (!p)
        try {
          const m = String(d || "").replace(/^.*\//, "");
          Z.has(m) && (p = Z.get(m));
        } catch (m) {
          k("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo", m);
        }
      if (p) {
        const m = i && i.canonical ? Pe(p, null) : dt(p);
        h.setAttribute("href", m);
      } else {
        const m = i && i.canonical ? Pe(d, null) : dt(d);
        h.setAttribute("href", m);
      }
    }
  } catch (r) {
    k("[htmlBuilder] rewriteAnchors failed", r);
  }
}
function Zl(e, t, n, i) {
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
    !o && n && (o = String(n)), o && (s = he(o)), s || (s = ei);
    try {
      if (n) {
        try {
          vt(s, n);
        } catch (l) {
          k("[htmlBuilder] computeSlug set slug mapping failed", l);
        }
        try {
          const l = Y(String(n || ""));
          if (Z && typeof Z.has == "function" && Z.has(l))
            s = Z.get(l);
          else
            try {
              for (const [c, u] of V || [])
                try {
                  const g = typeof u == "string" ? u : u && u.default ? u.default : null;
                  if (g && Y(String(g)) === l) {
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
async function Gl(e, t) {
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
      const g = u;
      try {
        if (Z && Z.has && Z.has(g)) continue;
      } catch (h) {
        k("[htmlBuilder] mdToSlug check failed", h);
      }
      try {
        let h = !1;
        for (const d of V.values())
          if (d === g) {
            h = !0;
            break;
          }
        if (h) continue;
      } catch (h) {
        k("[htmlBuilder] slugToMd iteration failed", h);
      }
      n.add(g);
    } catch (o) {
      k("[htmlBuilder] preScanHtmlSlugs anchor iteration failed", o);
    }
  if (!n.size) return;
  if (!ur()) {
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
              vt(c, s);
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
      const o = await Oe(s, t);
      if (o && o.raw)
        try {
          const c = qe().parseFromString(o.raw, "text/html"), u = c.querySelector("title"), g = c.querySelector("h1"), h = u && u.textContent && u.textContent.trim() ? u.textContent.trim() : g && g.textContent ? g.textContent.trim() : null;
          if (h) {
            const d = he(h);
            if (d)
              try {
                vt(d, s);
              } catch (p) {
                k("[htmlBuilder] set slugToMd/mdToSlug failed", p);
              }
          }
        } catch (l) {
          k("[htmlBuilder] parse HTML title failed", l);
        }
    } catch (o) {
      k("[htmlBuilder] fetchAndExtract failed", o);
    }
  }, r = Array.from(n), a = Math.max(1, Math.min(kn(), r.length || 1));
  await zn(r, i, a);
}
async function Xl(e, t) {
  if (!e || !e.length) return;
  const n = [], i = /* @__PURE__ */ new Set();
  let r = "";
  try {
    const a = new URL(t, typeof location < "u" ? location.href : "http://localhost/");
    r = Kt(a.pathname);
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
            c = Fl(l, t);
          } catch (g) {
            c = l, k("[htmlBuilder] resolve mdPath URL failed", g);
          }
          const u = c && r && c.startsWith(r) ? c.slice(r.length) : String(c || "").replace(/^\//, "");
          n.push({ rel: u }), Z.has(u) || i.add(u);
        } catch (c) {
          k("[htmlBuilder] rewriteAnchors failed", c);
        }
        continue;
      }
    } catch (s) {
      k("[htmlBuilder] preMapMdSlugs anchor iteration failed", s);
    }
  if (i.size)
    if (ur())
      await Promise.all(Array.from(i).map(async (a) => {
        try {
          const s = String(a).match(/([^\/]+)\.md$/), o = s && s[1];
          if (o && V.has(o)) {
            try {
              const l = V.get(o);
              if (l)
                try {
                  const c = typeof l == "string" ? l : l && l.default ? l.default : null;
                  c && vt(o, c);
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
          const s = await Oe(a, t);
          if (s && s.raw) {
            const o = (s.raw || "").match(/^#\s+(.+)$/m);
            if (o && o[1]) {
              const l = he(o[1].trim());
              if (l)
                try {
                  vt(l, a);
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
qe();
function Tr(e) {
  try {
    const n = qe().parseFromString(e || "", "text/html");
    Qa(n);
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
          const u = (c[1] || "").toLowerCase(), g = Ce.size && (Ce.get(u) || Ce.get(String(u).toLowerCase())) || u;
          try {
            (async () => {
              try {
                await Tn(g);
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
                    const g = document.createRange().createContextualFragment(u.value);
                    if (typeof o.replaceChildren == "function") o.replaceChildren(...Array.from(g.childNodes));
                    else {
                      for (; o.firstChild; ) o.removeChild(o.firstChild);
                      o.appendChild(g);
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
async function Ka(e) {
  const t = Wr ? await Wr(e || "", Ce) : vn(e || "", Ce), n = new Set(t), i = [];
  for (const r of n)
    try {
      const a = Ce.size && (Ce.get(r) || Ce.get(String(r).toLowerCase())) || r;
      try {
        i.push(Tn(a));
      } catch (s) {
        k("[htmlBuilder] ensureLanguages push canonical failed", s);
      }
      if (String(r) !== String(a))
        try {
          i.push(Tn(r));
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
async function Ql(e) {
  if (await Ka(e), ln) {
    const t = await ln(e || "");
    return !t || typeof t != "object" ? { html: String(e || ""), meta: {}, toc: [] } : (Array.isArray(t.toc) || (t.toc = []), t.meta || (t.meta = {}), t);
  }
  return { html: String(e || ""), meta: {}, toc: [] };
}
async function Kl(e, t, n, i, r) {
  let a = null, s = null;
  if (t.isHtml)
    try {
      const h = qe();
      if (h) {
        const d = h.parseFromString(t.raw || "", "text/html");
        try {
          Vi(d.body, n, r);
        } catch (p) {
          k("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)", p);
        }
        a = Tr(d.documentElement && d.documentElement.outerHTML ? d.documentElement.outerHTML : t.raw || "");
      } else
        a = Tr(t.raw || "");
    } catch {
      a = Tr(t.raw || "");
    }
  else {
    const h = t.raw || "", d = 64 * 1024;
    if (h && h.length > d && Ur) {
      try {
        await Ka(h);
      } catch {
      }
      s = document.createElement("article"), s.className = "nimbi-article content";
      const p = [];
      let m = {};
      try {
        await Ur(h, (f, w) => {
          try {
            w && w.meta && (m = Object.assign(m, w.meta));
          } catch {
          }
          try {
            w && Array.isArray(w.toc) && w.toc.length && p.push(...w.toc);
          } catch {
          }
          try {
            er(() => {
              try {
                const y = qe();
                if (y) {
                  const _ = y.parseFromString(String(f || ""), "text/html"), b = Array.from(_.body.childNodes || []);
                  b.length ? s.append(...b) : s.insertAdjacentHTML("beforeend", f || "");
                } else {
                  const _ = document && typeof document.createRange == "function" ? document.createRange() : null;
                  if (_ && typeof _.createContextualFragment == "function") {
                    const b = _.createContextualFragment(String(f || ""));
                    s.append(...Array.from(b.childNodes));
                  } else
                    s.insertAdjacentHTML("beforeend", f || "");
                }
              } catch {
                try {
                  s.insertAdjacentHTML("beforeend", f || "");
                } catch {
                }
              }
            });
          } catch {
          }
        }, { chunkSize: d });
      } catch (f) {
        k("[htmlBuilder] streamParseMarkdown failed, falling back", f);
      }
      a = { html: s.innerHTML, meta: m || {}, toc: p };
    } else
      a = await Ql(t.raw || "");
  }
  let o;
  if (s)
    o = s;
  else {
    o = document.createElement("article"), o.className = "nimbi-article content";
    try {
      const h = qe && qe();
      if (h) {
        const d = h.parseFromString(String(a.html || ""), "text/html"), p = Array.from(d.body.childNodes || []);
        p.length ? o.replaceChildren(...p) : o.innerHTML = a.html;
      } else
        try {
          const d = document && typeof document.createRange == "function" ? document.createRange() : null;
          if (d && typeof d.createContextualFragment == "function") {
            const p = d.createContextualFragment(String(a.html || ""));
            o.replaceChildren(...Array.from(p.childNodes));
          } else
            o.innerHTML = a.html;
        } catch {
          o.innerHTML = a.html;
        }
    } catch {
      try {
        o.innerHTML = a.html;
      } catch (d) {
        k("[htmlBuilder] set article html failed", d);
      }
    }
  }
  try {
    Vi(o, n, r);
  } catch (h) {
    k("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle", h);
  }
  try {
    Qa(o);
  } catch (h) {
    k("[htmlBuilder] addHeadingIds failed", h);
  }
  try {
    o.querySelectorAll("pre code, code[class]").forEach((d) => {
      try {
        const p = d.getAttribute && d.getAttribute("class") || d.className || "", m = String(p || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
        if (m)
          try {
            d.setAttribute && d.setAttribute("class", m);
          } catch (f) {
            d.className = m, k("[htmlBuilder] set element class failed", f);
          }
        else
          try {
            d.removeAttribute && d.removeAttribute("class");
          } catch (f) {
            d.className = "", k("[htmlBuilder] remove element class failed", f);
          }
      } catch (p) {
        k("[htmlBuilder] code element cleanup failed", p);
      }
    });
  } catch (h) {
    k("[htmlBuilder] processing code elements failed", h);
  }
  try {
    Rs(o);
  } catch (h) {
    k("[htmlBuilder] observeCodeBlocks failed", h);
  }
  Wl(o, n, r);
  try {
    (o.querySelectorAll && o.querySelectorAll("img") || []).forEach((d) => {
      try {
        const p = d.parentElement;
        if (!p || p.tagName.toLowerCase() !== "p" || p.childNodes.length !== 1) return;
        const m = document.createElement("figure");
        m.className = "image", p.replaceWith(m), m.appendChild(d);
      } catch {
      }
    });
  } catch (h) {
    k("[htmlBuilder] wrap images in Bulma image helper failed", h);
  }
  try {
    (o.querySelectorAll && o.querySelectorAll("table") || []).forEach((d) => {
      try {
        if (d.classList)
          d.classList.contains("table") || d.classList.add("table");
        else {
          const p = d.getAttribute && d.getAttribute("class") ? d.getAttribute("class") : "", m = String(p || "").split(/\s+/).filter(Boolean);
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
  } catch (h) {
    k("[htmlBuilder] add Bulma table class failed", h);
  }
  const { topH1: l, h1Text: c, slugKey: u } = Zl(a, o, n, i);
  try {
    if (l && a && a.meta && (a.meta.author || a.meta.date) && !(l.parentElement && l.parentElement.querySelector && l.parentElement.querySelector(".nimbi-article-subtitle"))) {
      const d = a.meta.author ? String(a.meta.author).trim() : "", p = a.meta.date ? String(a.meta.date).trim() : "";
      let m = "";
      try {
        const w = new Date(p);
        p && !isNaN(w.getTime()) ? m = w.toLocaleDateString() : m = p;
      } catch {
        m = p;
      }
      const f = [];
      if (d && f.push(d), m && f.push(m), f.length) {
        const w = document.createElement("p"), y = f[0] ? String(f[0]).replace(/"/g, "").trim() : "", _ = f.slice(1);
        if (w.className = "nimbi-article-subtitle is-6 has-text-grey-light", y) {
          const b = document.createElement("span");
          b.className = "nimbi-article-author", b.textContent = y, w.appendChild(b);
        }
        if (_.length) {
          const b = document.createElement("span");
          b.className = "nimbi-article-meta", b.textContent = _.join(" • "), w.appendChild(b);
        }
        try {
          l.parentElement.insertBefore(w, l.nextSibling);
        } catch {
          try {
            l.insertAdjacentElement("afterend", w);
          } catch {
          }
        }
      }
    }
  } catch {
  }
  try {
    await ec(o, r, n);
  } catch (h) {
    Hl("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", h), await pi(o, r, n);
  }
  const g = Ul(e, a.toc, n);
  return { article: o, parsed: a, toc: g, topH1: l, h1Text: c, slugKey: u };
}
function Vl(e) {
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
                $t("[htmlBuilder] executed inline script via Function");
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
              $t("[htmlBuilder] injected script loaded", { src: r, hasNimbi: !!(window && window.nimbiCMS) });
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
            $t("[htmlBuilder] executed injected script", r);
          } catch {
          }
        } catch (i) {
          k("[htmlBuilder] execute injected script failed", i);
        }
    } catch {
    }
}
function ea(e, t, n) {
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
          l.href = Pe(bt);
        } catch {
          l.href = Pe(bt || "");
        }
        l.textContent = t && t("home") || "Home", s.appendChild(l), e && e.appendChild && e.appendChild(s);
      } catch {
      }
  } catch {
  }
  try {
    try {
      Yn({ title: t && t("notFound") || "Not Found", description: t && t("notFoundDescription") || "" }, le, t && t("notFound") || "Not Found", t && t("notFoundDescription") || "");
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
const Va = qs(jl, ql && Xa, "anchor");
function Yl() {
  return Va.get();
}
function Jl(e) {
  return Va.send(e, 2e3);
}
async function ec(e, t, n) {
  if (!Yl()) throw new Error("anchor worker unavailable");
  if (!e || typeof e.innerHTML != "string") throw new Error("invalid article element");
  const r = String(e.innerHTML), a = await Jl({ type: "rewriteAnchors", html: r, contentBase: t, pagePath: n });
  if (a && typeof a == "string")
    try {
      const s = qe && qe();
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
function tc(e) {
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
            Zr(s);
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
function Zr(e) {
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
function nc(e, t, { mountOverlay: n = null, container: i = null, mountEl: r = null, navWrap: a = null, t: s = null } = {}) {
  try {
    const o = s || ((m) => typeof m == "string" ? m : ""), l = i || document.querySelector(".nimbi-cms"), c = r || document.querySelector(".nimbi-mount"), u = n || document.querySelector(".nimbi-overlay"), g = a || document.querySelector(".nimbi-nav-wrap");
    let d = document.querySelector(".nimbi-scroll-top");
    if (!d) {
      d = document.createElement("button"), d.className = "nimbi-scroll-top button is-primary is-rounded is-small", d.setAttribute("aria-label", o("scrollToTop")), d.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';
      try {
        u && u.appendChild ? u.appendChild(d) : l && l.appendChild ? l.appendChild(d) : c && c.appendChild ? c.appendChild(d) : document.body.appendChild(d);
      } catch {
        try {
          document.body.appendChild(d);
        } catch (f) {
          k("[htmlBuilder] append scroll top button failed", f);
        }
      }
      try {
        try {
          ha(d);
        } catch {
        }
      } catch (m) {
        k("[htmlBuilder] set scroll-top button theme registration failed", m);
      }
      d.addEventListener("click", () => {
        try {
          i && i.scrollTo ? i.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : r && r.scrollTo ? r.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } catch {
          try {
            i && (i.scrollTop = 0);
          } catch (f) {
            k("[htmlBuilder] fallback container scrollTop failed", f);
          }
          try {
            r && (r.scrollTop = 0);
          } catch (f) {
            k("[htmlBuilder] fallback mountEl scrollTop failed", f);
          }
          try {
            document.documentElement.scrollTop = 0;
          } catch (f) {
            k("[htmlBuilder] fallback document scrollTop failed", f);
          }
        }
      });
    }
    const p = g && g.querySelector ? g.querySelector(".menu-label") : null;
    if (t) {
      if (!d._nimbiObserver)
        if (typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u") {
          const m = globalThis.IntersectionObserver, f = new m((w) => {
            for (const y of w)
              y.target instanceof Element && (y.isIntersecting ? (d.classList.remove("show"), p && p.classList.remove("show")) : (d.classList.add("show"), p && p.classList.add("show")));
          }, { root: i instanceof Element ? i : r instanceof Element ? r : null, threshold: 0 });
          d._nimbiObserver = f;
        } else
          d._nimbiObserver = null;
      try {
        d._nimbiObserver && typeof d._nimbiObserver.disconnect == "function" && d._nimbiObserver.disconnect();
      } catch (m) {
        k("[htmlBuilder] observer disconnect failed", m);
      }
      try {
        d._nimbiObserver && typeof d._nimbiObserver.observe == "function" && d._nimbiObserver.observe(t);
      } catch (m) {
        k("[htmlBuilder] observer observe failed", m);
      }
      try {
        const m = () => {
          try {
            const f = l instanceof Element ? l.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }, w = t.getBoundingClientRect();
            !(w.bottom < f.top || w.top > f.bottom) ? (d.classList.remove("show"), p && p.classList.remove("show")) : (d.classList.add("show"), p && p.classList.add("show"));
          } catch (f) {
            k("[htmlBuilder] checkIntersect failed", f);
          }
        };
        m(), typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u" || setTimeout(m, 100);
      } catch (m) {
        k("[htmlBuilder] checkIntersect outer failed", m);
      }
    } else {
      d.classList.remove("show"), p && p.classList.remove("show");
      const m = i instanceof Element ? i : r instanceof Element ? r : window, f = () => {
        try {
          (m === window ? window.scrollY : m.scrollTop || 0) > 10 ? (d.classList.add("show"), p && p.classList.add("show")) : (d.classList.remove("show"), p && p.classList.remove("show"));
        } catch (w) {
          k("[htmlBuilder] onScroll handler failed", w);
        }
      };
      ir(() => m.addEventListener("scroll", Ol(f))), f();
    }
  } catch (o) {
    k("[htmlBuilder] ensureScrollTopButton failed", o);
  }
}
function tn(e, t) {
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
    e && t && V && typeof V.set == "function" && !V.has(e) && V.set(e, t);
  } catch {
  }
  try {
    t && Z && typeof Z.set == "function" && Z.set(t, e);
  } catch {
  }
  try {
    if ($e && typeof $e.has == "function") {
      if (!$e.has(t)) {
        try {
          $e.add(t);
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
function ta(e, t) {
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
function rc(e) {
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
            if (a = findSlugForPath(o) || (Z && Z.has(o) ? Z.get(o) : "") || "", !a)
              if (t.title && String(t.title).trim())
                a = he(String(t.title).trim());
              else {
                const l = o.replace(/^.*\//, "").replace(/\.(?:md|html?)$/i, "");
                a = he(l || o);
              }
          } else if (r) {
            const o = String(n).replace(/\.(?:md|html?)$/i, ""), l = findSlugForPath(o) || (Z && Z.has(o) ? Z.get(o) : "") || "";
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
              tn(o, Y(String(t.path || "")));
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
async function ic(e, t, n, i, r, a, s, o, l = "eager", c = 1, u = void 0, g = "favicon") {
  if (!e || !(e instanceof HTMLElement))
    throw new TypeError("navbarWrap must be an HTMLElement");
  const h = qe(), d = h ? h.parseFromString(n || "", "text/html") : null, p = d ? d.querySelectorAll("a") : [];
  await ir(() => Gl(p, i)), await ir(() => Xl(p, i));
  try {
    ie(p, i);
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
  let m = null, f = null, w = null, y = null, _ = null, b = null, v = !1, S = null;
  const E = /* @__PURE__ */ new Map();
  function P() {
    try {
      const R = typeof O < "u" && O && O.querySelector ? O.querySelector(".navbar-burger") : e && e.querySelector ? e.querySelector(".navbar-burger") : typeof document < "u" ? document.querySelector(".navbar-burger") : null, N = R && R.dataset ? R.dataset.target : null, C = N ? typeof O < "u" && O && O.querySelector ? O.querySelector(`#${N}`) || document.getElementById(N) : e && e.querySelector ? e.querySelector(`#${N}`) : typeof document < "u" ? document.getElementById(N) : null : null;
      if (R && R.classList && R.classList.contains("is-active")) {
        try {
          R.classList.remove("is-active");
        } catch {
        }
        try {
          R.setAttribute("aria-expanded", "false");
        } catch {
        }
        if (C && C.classList)
          try {
            C.classList.remove("is-active");
          } catch {
          }
      }
    } catch (R) {
      k("[nimbi-cms] closeMobileMenu failed", R);
    }
  }
  async function I() {
    const R = t && t instanceof HTMLElement ? t : typeof document < "u" ? document.querySelector(".nimbi-content") : null;
    try {
      R && R.classList.add("is-inactive");
    } catch {
    }
    try {
      const N = s && s();
      N && typeof N.then == "function" && await N;
    } catch (N) {
      try {
        k("[nimbi-cms] renderByQuery failed", N);
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
  function U(R) {
    try {
      let N = R && typeof R.slug == "string" ? String(R.slug) : "", C = null;
      try {
        N && N.indexOf("::") !== -1 && (C = N.split("::").slice(1).join("::") || null);
      } catch {
      }
      try {
        if (R && R.path && typeof R.path == "string") {
          const A = Y(String(R.path || "")), L = A.replace(/^.*\//, "");
          try {
            if (E && E.has(A)) return { page: E.get(A), hash: C };
            if (E && E.has(L)) return { page: E.get(L), hash: C };
          } catch {
          }
          try {
            if (Z && Z.has(A)) return { page: Z.get(A), hash: C };
          } catch {
          }
          try {
            const D = G(A);
            if (D) return { page: D, hash: C };
          } catch {
          }
        }
      } catch {
      }
      if (N && N.indexOf("::") !== -1) {
        const A = N.split("::");
        N = A[0] || "", C = A.slice(1).join("::") || null;
      }
      if (N && (N.includes(".") || N.includes("/"))) {
        const A = Y(R && R.path ? String(R.path) : N), L = A.replace(/^.*\//, "");
        try {
          if (E && E.has(A)) return { page: E.get(A), hash: C };
          if (E && E.has(L)) return { page: E.get(L), hash: C };
        } catch {
        }
        try {
          let D = G(A);
          if (!D)
            try {
              const K = String(A || "").replace(/^\/+/, ""), q = K.replace(/^.*\//, "");
              for (const [$, T] of V.entries())
                try {
                  let j = null;
                  if (typeof T == "string" ? j = Y(String(T || "")) : T && typeof T == "object" && (T.default ? j = Y(String(T.default || "")) : j = null), !j) continue;
                  if (j === K || j.endsWith("/" + K) || K.endsWith("/" + j) || j.endsWith(q) || K.endsWith(q)) {
                    D = $;
                    break;
                  }
                } catch {
                }
            } catch {
            }
          if (D) N = D;
          else
            try {
              const K = String(N).replace(/\.(?:md|html?)$/i, "");
              N = he(K || A);
            } catch {
              N = he(A);
            }
        } catch {
          N = he(A);
        }
      }
      return !N && R && R.path && (N = he(Y(String(R.path || "")))), { page: N, hash: C };
    } catch {
      return { page: R && R.slug || "", hash: null };
    }
  }
  const z = () => m || (m = (async () => {
    try {
      const R = await Promise.resolve().then(() => at), N = typeof globalThis < "u" ? globalThis.buildSearchIndex : void 0, C = typeof globalThis < "u" ? globalThis.buildSearchIndexWorker : void 0, A = ta(R, "buildSearchIndex"), L = ta(R, "buildSearchIndexWorker"), D = typeof N == "function" ? N : A || void 0, K = typeof C == "function" ? C : L || void 0;
      Bt("[nimbi-cms test] ensureSearchIndex: buildFn=" + typeof D + " workerFn=" + typeof K + " (global preferred)");
      const q = [];
      try {
        r && q.push(r);
      } catch {
      }
      try {
        navigationPage && q.push(navigationPage);
      } catch {
      }
      if (l === "lazy" && typeof K == "function")
        try {
          const $ = await K(i, c, u, q.length ? q : void 0);
          if ($ && $.length) {
            try {
              if (R && typeof R._setSearchIndex == "function")
                try {
                  R._setSearchIndex($);
                } catch {
                }
            } catch {
            }
            return $;
          }
        } catch ($) {
          k("[nimbi-cms] worker builder threw", $);
        }
      return typeof D == "function" ? (Bt("[nimbi-cms test] calling buildFn"), await D(i, c, u, q.length ? q : void 0)) : [];
    } catch (R) {
      return k("[nimbi-cms] buildSearchIndex failed", R), [];
    } finally {
      if (f) {
        try {
          f.removeAttribute("disabled");
        } catch {
        }
        try {
          w && w.classList.remove("is-loading");
        } catch {
        }
      }
    }
  })(), m.then((R) => {
    try {
      try {
        S = Array.isArray(R) ? R : null;
      } catch {
        S = null;
      }
      try {
        rc(R);
      } catch {
      }
      try {
        if (typeof window < "u") {
          try {
            (async () => {
              try {
                const L = await Promise.resolve().then(() => at);
                try {
                  try {
                    L && typeof L._setSearchIndex == "function" && L._setSearchIndex(Array.isArray(R) ? R : []);
                  } catch {
                  }
                  Object.defineProperty(window, "__nimbiResolvedIndex", {
                    get() {
                      return L && Array.isArray(L.searchIndex) ? L.searchIndex : Array.isArray(S) ? S : [];
                    },
                    enumerable: !0,
                    configurable: !0
                  });
                } catch {
                  try {
                    window.__nimbiResolvedIndex = L && Array.isArray(L.searchIndex) ? L.searchIndex : Array.isArray(S) ? S : [];
                  } catch {
                  }
                }
              } catch {
                try {
                  window.__nimbiResolvedIndex = Array.isArray(re) ? re : Array.isArray(S) ? S : [];
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
      const N = String(f && f.value || "").trim().toLowerCase();
      if (!N || !Array.isArray(R) || !R.length) return;
      const C = R.filter((L) => L.title && L.title.toLowerCase().includes(N) || L.excerpt && L.excerpt.toLowerCase().includes(N));
      if (!C || !C.length) return;
      const A = typeof _ < "u" && _ ? _ : typeof document < "u" ? document.getElementById("nimbi-search-results") : null;
      if (!A) return;
      try {
        typeof A.replaceChildren == "function" ? A.replaceChildren() : A.innerHTML = "";
      } catch {
        try {
          A.innerHTML = "";
        } catch {
        }
      }
      try {
        const L = document.createElement("div");
        L.className = "panel nimbi-search-panel", C.slice(0, 10).forEach((D) => {
          try {
            if (D.parentTitle) {
              const T = document.createElement("p");
              T.className = "panel-heading nimbi-search-title nimbi-search-parent", T.textContent = D.parentTitle, L.appendChild(T);
            }
            const K = document.createElement("a");
            K.className = "panel-block nimbi-search-result";
            const q = U(D);
            K.href = Pe(q.page, q.hash), K.setAttribute("role", "button");
            try {
              if (D.path && typeof D.path == "string")
                try {
                  tn(q.page, D.path);
                } catch {
                }
            } catch {
            }
            const $ = document.createElement("div");
            $.className = "is-size-6 has-text-weight-semibold", $.textContent = D.title, K.appendChild($), K.addEventListener("click", () => {
              try {
                A.style.display = "none";
              } catch {
              }
            }), L.appendChild(K);
          } catch {
          }
        }), er(() => {
          try {
            A.appendChild(L);
          } catch {
          }
        });
        try {
          A.style.display = "block";
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
        if (v) return;
        v = !0;
        const R = await Promise.resolve().then(() => Mn);
        try {
          await R.handleSitemapRequest({ homePage: r, contentBase: i, indexDepth: c, noIndexing: u, includeAllMarkdown: !0 });
        } catch (N) {
          k("[nimbi-cms] sitemap trigger failed", N);
        }
      } catch (R) {
        try {
          k("[nimbi-cms] sitemap dynamic import failed", R);
        } catch {
        }
      }
    })();
  }), m), O = document.createElement("nav");
  O.className = "navbar", O.setAttribute("role", "navigation"), O.setAttribute("aria-label", "main navigation");
  const W = document.createElement("div");
  W.className = "navbar-brand";
  const te = p[0], H = document.createElement("a");
  if (H.className = "navbar-item", te) {
    const R = te.getAttribute("href") || "#";
    try {
      const C = new URL(R, location.href).searchParams.get("page"), A = C ? decodeURIComponent(C) : r;
      let L = null;
      try {
        typeof A == "string" && (/(?:\.md|\.html?)$/i.test(A) || A.includes("/")) && (L = G(A));
      } catch {
      }
      !L && typeof A == "string" && !String(A).includes(".") && (L = A);
      const D = L || A;
      H.href = Pe(D), (!H.textContent || !String(H.textContent).trim()) && (H.textContent = a("home"));
    } catch {
      try {
        const C = typeof r == "string" && (/(?:\.md|\.html?)$/i.test(r) || r.includes("/")) ? G(r) : typeof r == "string" && !r.includes(".") ? r : null;
        H.href = Pe(C || r);
      } catch {
        H.href = Pe(r);
      }
      H.textContent = a("home");
    }
  } else
    H.href = Pe(r), H.textContent = a("home");
  async function M(R) {
    try {
      if (!R || R === "none") return null;
      if (R === "favicon")
        try {
          const N = document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');
          if (!N) return null;
          const C = N.getAttribute("href") || "";
          return C && /\.png(?:\?|$)/i.test(C) ? new URL(C, location.href).toString() : null;
        } catch {
          return null;
        }
      if (R === "copy-first" || R === "move-first")
        try {
          const N = await Oe(r, i);
          if (!N || !N.raw) return null;
          const C = qe(), A = C ? C.parseFromString(N.raw, "text/html") : null, L = A ? A.querySelector("img") : null;
          if (!L) return null;
          const D = L.getAttribute("src") || "";
          if (!D) return null;
          const K = new URL(D, location.href).toString();
          if (R === "move-first")
            try {
              document.documentElement.setAttribute("data-nimbi-logo-moved", K);
            } catch {
            }
          return K;
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
  let F = null;
  try {
    F = await M(g);
  } catch {
    F = null;
  }
  if (F)
    try {
      const R = document.createElement("img");
      R.className = "nimbi-navbar-logo";
      const N = a && typeof a == "function" && (a("home") || a("siteLogo")) || "";
      R.alt = N, R.title = N, R.src = F;
      try {
        R.style.marginRight = "0.5em";
      } catch {
      }
      try {
        (!H.textContent || !String(H.textContent).trim()) && (H.textContent = N);
      } catch {
      }
      try {
        H.insertBefore(R, H.firstChild);
      } catch {
        try {
          H.appendChild(R);
        } catch {
        }
      }
    } catch {
    }
  W.appendChild(H), H.addEventListener("click", function(R) {
    const N = H.getAttribute("href") || "";
    if (N.startsWith("?page=")) {
      R.preventDefault();
      const C = new URL(N, location.href), A = C.searchParams.get("page"), L = C.hash ? C.hash.replace(/^#/, "") : null;
      history.pushState({ page: A }, "", Pe(A, L)), I();
      try {
        P();
      } catch {
      }
    }
  });
  function G(R) {
    try {
      if (!R) return null;
      const N = Y(String(R || ""));
      try {
        if (Z && Z.has(N)) return Z.get(N);
      } catch {
      }
      const C = N.replace(/^.*\//, "");
      try {
        if (Z && Z.has(C)) return Z.get(C);
      } catch {
      }
      try {
        for (const [A, L] of V.entries())
          if (L) {
            if (typeof L == "string") {
              if (Y(L) === N) return A;
            } else if (L && typeof L == "object") {
              if (L.default && Y(L.default) === N) return A;
              const D = L.langs || {};
              for (const K in D)
                if (D[K] && Y(D[K]) === N) return A;
            }
          }
      } catch {
      }
      return null;
    } catch {
      return null;
    }
  }
  async function ie(R, N) {
    try {
      if (!R || !R.length) return;
      const C = [];
      for (let q = 0; q < R.length; q++)
        try {
          const $ = R[q];
          if (!$ || typeof $.getAttribute != "function") continue;
          const T = $.getAttribute("href") || "";
          if (!T || Pr(T)) continue;
          let j = null;
          try {
            const Se = it(T);
            Se && Se.page && (j = Se.page);
          } catch {
          }
          if (!j) {
            const Se = String(T || "").split(/[?#]/, 1), ze = Se && Se[0] ? Se[0] : T;
            (/\.(?:md|html?)$/i.test(ze) || ze.indexOf("/") !== -1) && (j = Y(String(ze || "")));
          }
          if (!j) continue;
          const X = Y(String(j || "")), se = X.replace(/^.*\//, "");
          let pe = null;
          try {
            E && E.has(X) && (pe = E.get(X));
          } catch {
          }
          try {
            !pe && Z && Z.has(X) && (pe = Z.get(X));
          } catch {
          }
          if (pe) continue;
          let be = null;
          try {
            be = $.textContent && String($.textContent).trim() ? String($.textContent).trim() : null;
          } catch {
            be = null;
          }
          let ge = null;
          if (be) ge = he(be);
          else {
            const Se = se.replace(/\.(?:md|html?)$/i, "");
            ge = he(Se || X);
          }
          if (ge)
            try {
              C.push({ path: X, candidate: ge });
            } catch {
            }
        } catch {
        }
      if (!C.length) return;
      const A = 3;
      let L = 0;
      const D = async () => {
        for (; L < C.length; ) {
          const q = C[L++];
          if (!(!q || !q.path))
            try {
              const $ = await Oe(q.path, N);
              if (!$ || !$.raw) continue;
              let T = null;
              if ($.isHtml)
                try {
                  const j = qe(), X = j ? j.parseFromString($.raw, "text/html") : null, se = X ? X.querySelector("h1") || X.querySelector("title") : null;
                  se && se.textContent && (T = String(se.textContent).trim());
                } catch {
                }
              else
                try {
                  const j = $.raw.match(/^#\s+(.+)$/m);
                  j && j[1] && (T = String(j[1]).trim());
                } catch {
                }
              if (T) {
                const j = he(T);
                if (j && j !== q.candidate) {
                  try {
                    tn(j, q.path);
                  } catch {
                  }
                  try {
                    E.set(q.path, j);
                  } catch {
                  }
                  try {
                    E.set(q.path.replace(/^.*\//, ""), j);
                  } catch {
                  }
                  try {
                    const X = await Promise.resolve().then(() => at);
                    try {
                      if (Array.isArray(X.searchIndex)) {
                        let se = !1;
                        for (const pe of X.searchIndex)
                          try {
                            if (pe && pe.path === q.path && pe.slug) {
                              const ge = String(pe.slug).split("::").slice(1).join("::");
                              pe.slug = ge ? `${j}::${ge}` : j, se = !0;
                            }
                          } catch {
                          }
                        try {
                          se && typeof X._setSearchIndex == "function" && X._setSearchIndex(X.searchIndex);
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
      }, K = [];
      for (let q = 0; q < A; q++) K.push(D());
      try {
        await Promise.all(K);
      } catch {
      }
    } catch {
    }
  }
  const ye = document.createElement("a");
  ye.className = "navbar-burger", ye.setAttribute("role", "button"), ye.setAttribute("aria-label", "menu"), ye.setAttribute("aria-expanded", "false");
  const J = "nimbi-navbar-menu";
  ye.dataset.target = J, ye.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>', W.appendChild(ye);
  try {
    ye.addEventListener("click", (R) => {
      try {
        const N = ye.dataset && ye.dataset.target ? ye.dataset.target : null, C = N ? O && O.querySelector ? O.querySelector(`#${N}`) || (e && e.querySelector ? e.querySelector(`#${N}`) : document.getElementById(N)) : e && e.querySelector ? e.querySelector(`#${N}`) || document.getElementById(N) : typeof document < "u" ? document.getElementById(N) : null : null;
        ye.classList.contains("is-active") ? (ye.classList.remove("is-active"), ye.setAttribute("aria-expanded", "false"), C && C.classList.remove("is-active")) : (ye.classList.add("is-active"), ye.setAttribute("aria-expanded", "true"), C && C.classList.add("is-active"));
      } catch (N) {
        k("[nimbi-cms] navbar burger toggle failed", N);
      }
    });
  } catch (R) {
    k("[nimbi-cms] burger event binding failed", R);
  }
  const Te = document.createElement("div");
  Te.className = "navbar-menu", Te.id = J;
  const ke = document.createElement("div");
  ke.className = "navbar-start";
  let xe = null, Ee = null;
  if (!o)
    xe = null, f = null, y = null, _ = null, b = null;
  else {
    xe = document.createElement("div"), xe.className = "navbar-end", Ee = document.createElement("div"), Ee.className = "navbar-item", f = document.createElement("input"), f.className = "input", f.type = "search", f.placeholder = a("searchPlaceholder") || "", f.id = "nimbi-search";
    try {
      const A = (a && typeof a == "function" ? a("searchAria") : null) || f.placeholder || "Search";
      try {
        f.setAttribute("aria-label", A);
      } catch {
      }
      try {
        f.setAttribute("aria-controls", "nimbi-search-results");
      } catch {
      }
      try {
        f.setAttribute("aria-autocomplete", "list");
      } catch {
      }
      try {
        f.setAttribute("role", "combobox");
      } catch {
      }
    } catch {
    }
    l === "eager" && (f.disabled = !0), w = document.createElement("div"), w.className = "control", l === "eager" && w.classList.add("is-loading"), w.appendChild(f), Ee.appendChild(w), y = document.createElement("div"), y.className = "dropdown is-right", y.id = "nimbi-search-dropdown";
    const R = document.createElement("div");
    R.className = "dropdown-trigger", R.appendChild(Ee);
    const N = document.createElement("div");
    N.className = "dropdown-menu", N.setAttribute("role", "menu"), _ = document.createElement("div"), _.id = "nimbi-search-results", _.className = "dropdown-content nimbi-search-results", b = _, N.appendChild(_), y.appendChild(R), y.appendChild(N), xe.appendChild(y);
    const C = (A) => {
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
      let L = -1;
      function D($) {
        try {
          const T = _.querySelector(".nimbi-search-result.is-selected");
          T && T.classList.remove("is-selected");
          const j = _.querySelectorAll(".nimbi-search-result");
          if (!j || !j.length) return;
          if ($ < 0) {
            L = -1;
            return;
          }
          $ >= j.length && ($ = j.length - 1);
          const X = j[$];
          if (X) {
            X.classList.add("is-selected"), L = $;
            try {
              X.scrollIntoView({ block: "nearest" });
            } catch {
            }
          }
        } catch {
        }
      }
      function K($) {
        try {
          const T = $.key, j = _.querySelectorAll(".nimbi-search-result");
          if (!j || !j.length) return;
          if (T === "ArrowDown") {
            $.preventDefault();
            const X = L < 0 ? 0 : Math.min(j.length - 1, L + 1);
            D(X);
            return;
          }
          if (T === "ArrowUp") {
            $.preventDefault();
            const X = L <= 0 ? 0 : L - 1;
            D(X);
            return;
          }
          if (T === "Enter") {
            $.preventDefault();
            const X = _.querySelector(".nimbi-search-result.is-selected") || _.querySelector(".nimbi-search-result");
            if (X)
              try {
                X.click();
              } catch {
              }
            return;
          }
          if (T === "Escape") {
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
              _.removeEventListener("keydown", K);
            } catch {
            }
            try {
              f && f.focus();
            } catch {
            }
            try {
              f && f.removeEventListener("keydown", q);
            } catch {
            }
            return;
          }
        } catch {
        }
      }
      function q($) {
        try {
          if ($ && $.key === "ArrowDown") {
            $.preventDefault();
            try {
              _.focus();
            } catch {
            }
            D(0);
          }
        } catch {
        }
      }
      try {
        const $ = String(f && f.value || "").trim();
        if (!A || !A.length) {
          if (!$) {
            try {
              y && y.classList.remove("is-active");
            } catch {
            }
            try {
              document.documentElement.classList.remove("nimbi-search-open");
            } catch {
            }
            try {
              _ && (_.style.display = "none", _.classList.remove("is-open"), _.removeAttribute("tabindex"));
            } catch {
            }
            try {
              _ && _.removeEventListener("keydown", K);
            } catch {
            }
            return;
          }
          try {
            const T = document.createElement("div");
            T.className = "panel nimbi-search-panel";
            const j = document.createElement("p");
            j.className = "panel-block nimbi-search-no-results", j.textContent = a && typeof a == "function" ? a("searchNoResults") : "No results", T.appendChild(j), er(() => {
              try {
                _.appendChild(T);
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
          return;
        }
      } catch {
      }
      try {
        const $ = document.createElement("div");
        $.className = "panel nimbi-search-panel";
        const T = document.createDocumentFragment();
        A.forEach((j) => {
          if (j.parentTitle) {
            const be = document.createElement("p");
            be.textContent = j.parentTitle, be.className = "panel-heading nimbi-search-title nimbi-search-parent", T.appendChild(be);
          }
          const X = document.createElement("a");
          X.className = "panel-block nimbi-search-result";
          const se = U(j);
          X.href = Pe(se.page, se.hash), X.setAttribute("role", "button");
          try {
            if (j.path && typeof j.path == "string")
              try {
                tn(se.page, j.path);
              } catch {
              }
          } catch {
          }
          const pe = document.createElement("div");
          pe.className = "is-size-6 has-text-weight-semibold", pe.textContent = j.title, X.appendChild(pe), X.addEventListener("click", (be) => {
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
                _.removeEventListener("keydown", K);
              } catch {
              }
              try {
                f && f.removeEventListener("keydown", q);
              } catch {
              }
              try {
                const ge = X.getAttribute && X.getAttribute("href") || "";
                let Se = null, ze = null;
                try {
                  const Fe = new URL(ge, location.href);
                  Se = Fe.searchParams.get("page"), ze = Fe.hash ? Fe.hash.replace(/^#/, "") : null;
                } catch {
                }
                if (Se)
                  try {
                    history.pushState({ page: Se }, "", Pe(Se, ze));
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
                window.location.href = X.href;
              } catch {
              }
            } catch {
            }
          }), T.appendChild(X);
        }), $.appendChild(T), er(() => {
          try {
            _.appendChild($);
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
        _.addEventListener("keydown", K);
      } catch {
      }
      try {
        f && f.addEventListener("keydown", q);
      } catch {
      }
    };
    if (f) {
      const A = Nl(async () => {
        const L = f || (typeof O < "u" && O && O.querySelector ? O.querySelector("input#nimbi-search") : e && e.querySelector ? e.querySelector("input#nimbi-search") : typeof document < "u" ? document.querySelector("input#nimbi-search") : null), D = String(L && L.value || "").trim().toLowerCase();
        if (!D) {
          try {
            y && y.classList.remove("is-active");
          } catch {
          }
          try {
            document.documentElement.classList.remove("nimbi-search-open");
          } catch {
          }
          try {
            _ && (_.style.display = "none", _.classList.remove("is-open"), _.removeAttribute("tabindex"));
          } catch {
          }
          return;
        }
        try {
          await z();
          const K = await m, q = Array.isArray(K) ? K.filter(($) => $.title && $.title.toLowerCase().includes(D) || $.excerpt && $.excerpt.toLowerCase().includes(D)) : [];
          C(q.slice(0, 10));
        } catch (K) {
          k("[nimbi-cms] search input handler failed", K), C([]);
        }
      }, 50);
      try {
        f.addEventListener("input", A);
      } catch {
      }
      try {
        document.addEventListener("input", (L) => {
          try {
            L && L.target && L.target.id === "nimbi-search" && A(L);
          } catch {
          }
        }, !0);
      } catch {
      }
    }
    if (l === "eager") {
      try {
        m = z();
      } catch (A) {
        k("[nimbi-cms] eager search index init failed", A), m = Promise.resolve([]);
      }
      m.finally(() => {
        const A = f || (typeof O < "u" && O && O.querySelector ? O.querySelector("input#nimbi-search") : e && e.querySelector ? e.querySelector("input#nimbi-search") : typeof document < "u" ? document.querySelector("input#nimbi-search") : null);
        if (A) {
          try {
            A.removeAttribute("disabled");
          } catch {
          }
          try {
            w && w.classList.remove("is-loading");
          } catch {
          }
        }
        (async () => {
          try {
            if (v) return;
            v = !0;
            const L = await m.catch(() => []), D = await Promise.resolve().then(() => Mn);
            try {
              await D.handleSitemapRequest({ index: Array.isArray(L) ? L : void 0, homePage: r, contentBase: i, indexDepth: c, noIndexing: u, includeAllMarkdown: !0 });
            } catch (K) {
              k("[nimbi-cms] sitemap trigger failed", K);
            }
          } catch (L) {
            try {
              k("[nimbi-cms] sitemap dynamic import failed", L);
            } catch {
            }
          }
        })();
      });
    }
    try {
      const A = (L) => {
        try {
          const D = L && L.target;
          if (!b || !b.classList.contains("is-open") && b.style && b.style.display !== "block" || D && (b.contains(D) || f && (D === f || f.contains && f.contains(D)))) return;
          if (y) {
            y.classList.remove("is-active");
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
        } catch {
        }
      };
      document.addEventListener("click", A, !0), document.addEventListener("touchstart", A, !0);
    } catch {
    }
  }
  const He = document.createDocumentFragment();
  for (let R = 0; R < p.length; R++) {
    const N = p[R];
    if (R === 0) continue;
    const C = N.getAttribute("href") || "#";
    let A = C;
    const L = document.createElement("a");
    L.className = "navbar-item";
    try {
      let D = null;
      try {
        D = it(String(C || ""));
      } catch {
        D = null;
      }
      let K = null, q = null;
      if (D && (D.type === "canonical" && D.page || D.type === "cosmetic" && D.page) && (K = D.page, q = D.anchor), K && (/\.(?:md|html?)$/i.test(K) || K.includes("/") ? A = K : L.href = Pe(K, q)), /^[^#]*\.md(?:$|[#?])/.test(A) || A.endsWith(".md")) {
        const T = Y(A).split(/::|#/, 2), j = T[0], X = T[1], se = G(j);
        se ? L.href = Pe(se, X) : L.href = Pe(j, X);
      } else if (/\.html(?:$|[#?])/.test(A) || A.endsWith(".html")) {
        const T = Y(A).split(/::|#/, 2);
        let j = T[0];
        j && !j.toLowerCase().endsWith(".html") && (j = j + ".html");
        const X = T[1], se = G(j);
        if (se)
          L.href = Pe(se, X);
        else
          try {
            const pe = await Oe(j, i);
            if (pe && pe.raw)
              try {
                const be = qe(), ge = be ? be.parseFromString(pe.raw, "text/html") : null, Se = ge ? ge.querySelector("title") : null, ze = ge ? ge.querySelector("h1") : null, Fe = Se && Se.textContent && Se.textContent.trim() ? Se.textContent.trim() : ze && ze.textContent ? ze.textContent.trim() : null;
                if (Fe) {
                  const Ge = he(Fe);
                  if (Ge) {
                    try {
                      tn(Ge, j);
                    } catch (Et) {
                      k("[nimbi-cms] slugToMd/mdToSlug set failed", Et);
                    }
                    L.href = Pe(Ge, X);
                  } else
                    L.href = Pe(j, X);
                } else
                  L.href = Pe(j, X);
              } catch {
                L.href = Pe(j, X);
              }
            else
              L.href = A;
          } catch {
            L.href = A;
          }
      } else
        L.href = A;
    } catch (D) {
      k("[nimbi-cms] nav item href parse failed", D), L.href = A;
    }
    try {
      const D = N.textContent && String(N.textContent).trim() ? String(N.textContent).trim() : null;
      if (D)
        try {
          const K = he(D);
          if (K) {
            const q = L.getAttribute("href") || "";
            let $ = null;
            if (/^[^#?]*\.(?:md|html?)(?:$|[?#])/i.test(q))
              $ = Y(String(q || "").split(/[?#]/)[0]);
            else
              try {
                const T = it(q);
                T && T.type === "canonical" && T.page && ($ = Y(T.page));
              } catch {
              }
            if ($) {
              let T = !1;
              try {
                if (/\.(?:html?)(?:$|[?#])/i.test(String($ || "")))
                  T = !0;
                else if (/\.(?:md)(?:$|[?#])/i.test(String($ || "")))
                  T = !1;
                else {
                  const j = String($ || "").replace(/^\.\//, ""), X = j.replace(/^.*\//, "");
                  $e && $e.size && ($e.has(j) || $e.has(X)) && (T = !0);
                }
              } catch {
                T = !1;
              }
              if (T)
                try {
                  const j = Y(String($ || "").split(/[?#]/)[0]);
                  let X = !1;
                  try {
                    G && typeof G == "function" && G(j) && (X = !0);
                  } catch {
                  }
                  try {
                    tn(K, $);
                  } catch {
                  }
                  try {
                    if (j) {
                      try {
                        E.set(j, K);
                      } catch {
                      }
                      try {
                        const se = j.replace(/^.*\//, "");
                        se && E.set(se, K);
                      } catch {
                      }
                    }
                  } catch {
                  }
                  if (X)
                    try {
                      L.href = Pe(K);
                    } catch {
                    }
                } catch {
                }
            }
          }
        } catch (K) {
          k("[nimbi-cms] nav slug mapping failed", K);
        }
    } catch (D) {
      k("[nimbi-cms] nav slug mapping failed", D);
    }
    L.textContent = N.textContent || A, He.appendChild(L);
  }
  try {
    ke.appendChild(He);
  } catch {
  }
  Te.appendChild(ke), xe && Te.appendChild(xe), O.appendChild(W), O.appendChild(Te), e.appendChild(O);
  try {
    const R = (N) => {
      try {
        const C = typeof O < "u" && O && O.querySelector ? O.querySelector(".navbar-burger") : e && e.querySelector ? e.querySelector(".navbar-burger") : typeof document < "u" ? document.querySelector(".navbar-burger") : null;
        if (!C || !C.classList.contains("is-active")) return;
        const A = C && C.closest ? C.closest(".navbar") : O;
        if (A && A.contains(N.target)) return;
        P();
      } catch {
      }
    };
    document.addEventListener("click", R, !0), document.addEventListener("touchstart", R, !0);
  } catch {
  }
  try {
    Te.addEventListener("click", (R) => {
      const N = R.target && R.target.closest ? R.target.closest("a") : null;
      if (!N) return;
      const C = N.getAttribute("href") || "";
      try {
        const A = new URL(C, location.href), L = A.searchParams.get("page"), D = A.hash ? A.hash.replace(/^#/, "") : null;
        L && (R.preventDefault(), history.pushState({ page: L }, "", Pe(L, D)), I());
      } catch (A) {
        k("[nimbi-cms] navbar click handler failed", A);
      }
      try {
        const A = typeof O < "u" && O && O.querySelector ? O.querySelector(".navbar-burger") : e && e.querySelector ? e.querySelector(".navbar-burger") : null, L = A && A.dataset ? A.dataset.target : null, D = L ? O && O.querySelector ? O.querySelector(`#${L}`) || (e && e.querySelector ? e.querySelector(`#${L}`) : document.getElementById(L)) : e && e.querySelector ? e.querySelector(`#${L}`) || document.getElementById(L) : typeof document < "u" ? document.getElementById(L) : null : null;
        A && A.classList.contains("is-active") && (A.classList.remove("is-active"), A.setAttribute("aria-expanded", "false"), D && D.classList.remove("is-active"));
      } catch (A) {
        k("[nimbi-cms] mobile menu close failed", A);
      }
    });
  } catch (R) {
    k("[nimbi-cms] attach content click handler failed", R);
  }
  try {
    t.addEventListener("click", (R) => {
      const N = R.target && R.target.closest ? R.target.closest("a") : null;
      if (!N) return;
      const C = N.getAttribute("href") || "";
      if (C && !Pr(C))
        try {
          const A = new URL(C, location.href), L = A.searchParams.get("page"), D = A.hash ? A.hash.replace(/^#/, "") : null;
          L && (R.preventDefault(), history.pushState({ page: L }, "", Pe(L, D)), I());
        } catch (A) {
          k("[nimbi-cms] container click URL parse failed", A);
        }
    });
  } catch (R) {
    k("[nimbi-cms] build navbar failed", R);
  }
  return { navbar: O, linkEls: p };
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
let tt = null, de = null, Qe = 1, St = (e, t) => t, An = 0, En = 0, tr = () => {
}, wn = 0.25;
function ac() {
  if (tt && document.contains(tt)) return tt;
  tt = null;
  const e = document.createElement("dialog");
  e.className = "nimbi-image-preview modal", e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), e.setAttribute("aria-label", St("imagePreviewTitle", "Image preview"));
  try {
    const M = document.createElement("div");
    M.className = "modal-background";
    const F = document.createElement("div");
    F.className = "modal-content";
    const G = document.createElement("div");
    G.className = "nimbi-image-preview__content box", G.setAttribute("role", "document");
    const ie = document.createElement("button");
    ie.className = "button is-small nimbi-image-preview__close", ie.type = "button", ie.setAttribute("data-nimbi-preview-close", ""), ie.textContent = "✕";
    const ye = document.createElement("div");
    ye.className = "nimbi-image-preview__image-wrapper";
    const J = document.createElement("img");
    J.setAttribute("data-nimbi-preview-image", ""), J.alt = "", ye.appendChild(J);
    const Te = document.createElement("div");
    Te.className = "nimbi-image-preview__controls";
    const ke = document.createElement("div");
    ke.className = "nimbi-image-preview__group";
    const xe = document.createElement("button");
    xe.className = "button is-small", xe.type = "button", xe.setAttribute("data-nimbi-preview-fit", ""), xe.textContent = "⤢";
    const Ee = document.createElement("button");
    Ee.className = "button is-small", Ee.type = "button", Ee.setAttribute("data-nimbi-preview-original", ""), Ee.textContent = "1:1";
    const He = document.createElement("button");
    He.className = "button is-small", He.type = "button", He.setAttribute("data-nimbi-preview-reset", ""), He.textContent = "⟲", ke.appendChild(xe), ke.appendChild(Ee), ke.appendChild(He);
    const R = document.createElement("div");
    R.className = "nimbi-image-preview__group";
    const N = document.createElement("button");
    N.className = "button is-small", N.type = "button", N.setAttribute("data-nimbi-preview-zoom-out", ""), N.textContent = "−";
    const C = document.createElement("div");
    C.className = "nimbi-image-preview__zoom", C.setAttribute("data-nimbi-preview-zoom-label", ""), C.textContent = "100%";
    const A = document.createElement("button");
    A.className = "button is-small", A.type = "button", A.setAttribute("data-nimbi-preview-zoom-in", ""), A.textContent = "＋", R.appendChild(N), R.appendChild(C), R.appendChild(A), Te.appendChild(ke), Te.appendChild(R), G.appendChild(ie), G.appendChild(ye), G.appendChild(Te), F.appendChild(G), e.appendChild(M), e.appendChild(F);
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
  e.addEventListener("click", (M) => {
    M.target === e && zr();
  }), e.addEventListener("wheel", (M) => {
    if (!U()) return;
    M.preventDefault();
    const F = M.deltaY < 0 ? wn : -wn;
    Lt(Qe + F), c(), u();
  }, { passive: !1 }), e.addEventListener("keydown", (M) => {
    if (M.key === "Escape") {
      zr();
      return;
    }
    if (Qe > 1) {
      const F = e.querySelector(".nimbi-image-preview__image-wrapper");
      if (!F) return;
      const G = 40;
      switch (M.key) {
        case "ArrowUp":
          F.scrollTop -= G, M.preventDefault();
          break;
        case "ArrowDown":
          F.scrollTop += G, M.preventDefault();
          break;
        case "ArrowLeft":
          F.scrollLeft -= G, M.preventDefault();
          break;
        case "ArrowRight":
          F.scrollLeft += G, M.preventDefault();
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
  tr = c, i.addEventListener("click", () => {
    Lt(Qe + wn), c(), u();
  }), r.addEventListener("click", () => {
    Lt(Qe - wn), c(), u();
  }), t.addEventListener("click", () => {
    Cn(), c(), u();
  }), n.addEventListener("click", () => {
    Lt(1), c(), u();
  }), a.addEventListener("click", () => {
    Cn(), c(), u();
  }), s.addEventListener("click", zr), t.title = St("imagePreviewFit", "Fit to screen"), n.title = St("imagePreviewOriginal", "Original size"), r.title = St("imagePreviewZoomOut", "Zoom out"), i.title = St("imagePreviewZoomIn", "Zoom in"), s.title = St("imagePreviewClose", "Close"), s.setAttribute("aria-label", St("imagePreviewClose", "Close"));
  let g = !1, h = 0, d = 0, p = 0, m = 0;
  const f = /* @__PURE__ */ new Map();
  let w = 0, y = 1;
  const _ = (M, F) => {
    const G = M.x - F.x, ie = M.y - F.y;
    return Math.hypot(G, ie);
  }, b = () => {
    g = !1, f.clear(), w = 0, de && (de.classList.add("is-panning"), de.classList.remove("is-grabbing"));
  };
  let v = 0, S = 0, E = 0;
  const P = (M) => {
    const F = Date.now(), G = F - v, ie = M.clientX - S, ye = M.clientY - E;
    v = F, S = M.clientX, E = M.clientY, G < 300 && Math.hypot(ie, ye) < 30 && (Lt(Qe > 1 ? 1 : 2), c(), M.preventDefault());
  }, I = (M) => {
    Lt(Qe > 1 ? 1 : 2), c(), M.preventDefault();
  }, U = () => tt ? typeof tt.open == "boolean" ? tt.open : tt.classList.contains("is-active") : !1, z = (M, F, G = 1) => {
    if (f.has(G) && f.set(G, { x: M, y: F }), f.size === 2) {
      const Te = Array.from(f.values()), ke = _(Te[0], Te[1]);
      if (w > 0) {
        const xe = ke / w;
        Lt(y * xe);
      }
      return;
    }
    if (!g) return;
    const ie = de.closest(".nimbi-image-preview__image-wrapper");
    if (!ie) return;
    const ye = M - h, J = F - d;
    ie.scrollLeft = p - ye, ie.scrollTop = m - J;
  }, O = (M, F, G = 1) => {
    if (!U()) return;
    if (f.set(G, { x: M, y: F }), f.size === 2) {
      const J = Array.from(f.values());
      w = _(J[0], J[1]), y = Qe;
      return;
    }
    const ie = de.closest(".nimbi-image-preview__image-wrapper");
    !ie || !(ie.scrollWidth > ie.clientWidth || ie.scrollHeight > ie.clientHeight) || (g = !0, h = M, d = F, p = ie.scrollLeft, m = ie.scrollTop, de.classList.add("is-panning"), de.classList.remove("is-grabbing"), window.addEventListener("pointermove", W), window.addEventListener("pointerup", te), window.addEventListener("pointercancel", te));
  }, W = (M) => {
    g && (M.preventDefault(), z(M.clientX, M.clientY, M.pointerId));
  }, te = () => {
    b(), window.removeEventListener("pointermove", W), window.removeEventListener("pointerup", te), window.removeEventListener("pointercancel", te);
  };
  de.addEventListener("pointerdown", (M) => {
    M.preventDefault(), O(M.clientX, M.clientY, M.pointerId);
  }), de.addEventListener("pointermove", (M) => {
    (g || f.size === 2) && M.preventDefault(), z(M.clientX, M.clientY, M.pointerId);
  }), de.addEventListener("pointerup", (M) => {
    M.preventDefault(), M.pointerType === "touch" && P(M), b();
  }), de.addEventListener("dblclick", I), de.addEventListener("pointercancel", b), de.addEventListener("mousedown", (M) => {
    M.preventDefault(), O(M.clientX, M.clientY, 1);
  }), de.addEventListener("mousemove", (M) => {
    g && M.preventDefault(), z(M.clientX, M.clientY, 1);
  }), de.addEventListener("mouseup", (M) => {
    M.preventDefault(), b();
  });
  const H = e.querySelector(".nimbi-image-preview__image-wrapper");
  return H && (H.addEventListener("pointerdown", (M) => {
    if (O(M.clientX, M.clientY, M.pointerId), M && M.target && M.target.tagName === "IMG")
      try {
        M.target.classList.add("is-grabbing");
      } catch {
      }
  }), H.addEventListener("pointermove", (M) => {
    z(M.clientX, M.clientY, M.pointerId);
  }), H.addEventListener("pointerup", b), H.addEventListener("pointercancel", b), H.addEventListener("mousedown", (M) => {
    if (O(M.clientX, M.clientY, 1), M && M.target && M.target.tagName === "IMG")
      try {
        M.target.classList.add("is-grabbing");
      } catch {
      }
  }), H.addEventListener("mousemove", (M) => {
    z(M.clientX, M.clientY, 1);
  }), H.addEventListener("mouseup", b)), e;
}
function Lt(e) {
  if (!de) return;
  const t = Number(e);
  Qe = Number.isFinite(t) ? Math.max(0.1, Math.min(4, t)) : 1;
  const i = de.getBoundingClientRect(), r = An || de.naturalWidth || de.width || i.width || 0, a = En || de.naturalHeight || de.height || i.height || 0;
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
function Cn() {
  if (!de) return;
  const e = de.closest(".nimbi-image-preview__image-wrapper");
  if (!e) return;
  const t = e.getBoundingClientRect();
  if (t.width === 0 || t.height === 0) return;
  const n = An || de.naturalWidth || t.width, i = En || de.naturalHeight || t.height;
  if (!n || !i) return;
  const r = t.width / n, a = t.height / i, s = Math.min(r, a, 1);
  Lt(Number.isFinite(s) ? s : 1);
}
function sc(e, t = "", n = 0, i = 0) {
  const r = ac();
  Qe = 1, An = n || 0, En = i || 0, de.src = e;
  try {
    if (!t)
      try {
        const o = new URL(e, typeof location < "u" ? location.href : "").pathname || "", c = (o.substring(o.lastIndexOf("/") + 1) || e).replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
        t = St("imagePreviewDefaultAlt", c || "Image");
      } catch {
        t = St("imagePreviewDefaultAlt", "Image");
      }
  } catch {
  }
  de.alt = t, de.style.transform = "scale(1)";
  const a = () => {
    An = de.naturalWidth || de.width || 0, En = de.naturalHeight || de.height || 0;
  };
  if (a(), Cn(), tr(), requestAnimationFrame(() => {
    Cn(), tr();
  }), !An || !En) {
    const s = () => {
      a(), requestAnimationFrame(() => {
        Cn(), tr();
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
function zr() {
  if (tt) {
    typeof tt.close == "function" && tt.open && tt.close(), tt.classList.remove("is-active");
    try {
      document.documentElement.classList.remove("nimbi-image-preview-open");
    } catch {
    }
  }
}
function oc(e, { t, zoomStep: n = 0.25 } = {}) {
  if (!e || !e.querySelectorAll) return;
  St = (d, p) => (typeof t == "function" ? t(d) : void 0) || p, wn = n, e.addEventListener("click", (d) => {
    const p = (
      /** @type {HTMLElement} */
      d.target
    );
    if (!p || p.tagName !== "IMG") return;
    const m = (
      /** @type {HTMLImageElement} */
      p
    );
    if (!m.src) return;
    const f = m.closest("a");
    f && f.getAttribute("href") || sc(m.src, m.alt || "", m.naturalWidth || 0, m.naturalHeight || 0);
  });
  let i = !1, r = 0, a = 0, s = 0, o = 0;
  const l = /* @__PURE__ */ new Map();
  let c = 0, u = 1;
  const g = (d, p) => {
    const m = d.x - p.x, f = d.y - p.y;
    return Math.hypot(m, f);
  };
  e.addEventListener("pointerdown", (d) => {
    const p = (
      /** @type {HTMLElement} */
      d.target
    );
    if (!p || p.tagName !== "IMG") return;
    const m = p.closest("a");
    if (m && m.getAttribute("href") || !tt || !tt.open) return;
    if (l.set(d.pointerId, { x: d.clientX, y: d.clientY }), l.size === 2) {
      const w = Array.from(l.values());
      c = g(w[0], w[1]), u = Qe;
      return;
    }
    const f = p.closest(".nimbi-image-preview__image-wrapper");
    if (f && !(Qe <= 1)) {
      d.preventDefault(), i = !0, r = d.clientX, a = d.clientY, s = f.scrollLeft, o = f.scrollTop, p.setPointerCapture(d.pointerId);
      try {
        p.classList.add("is-grabbing");
      } catch {
      }
    }
  }), e.addEventListener("pointermove", (d) => {
    if (l.has(d.pointerId) && l.set(d.pointerId, { x: d.clientX, y: d.clientY }), l.size === 2) {
      d.preventDefault();
      const _ = Array.from(l.values()), b = g(_[0], _[1]);
      if (c > 0) {
        const v = b / c;
        Lt(u * v);
      }
      return;
    }
    if (!i) return;
    d.preventDefault();
    const p = (
      /** @type {HTMLElement} */
      d.target
    ), m = p.closest && p.closest("a");
    if (m && m.getAttribute && m.getAttribute("href")) return;
    const f = p.closest(".nimbi-image-preview__image-wrapper");
    if (!f) return;
    const w = d.clientX - r, y = d.clientY - a;
    f.scrollLeft = s - w, f.scrollTop = o - y;
  });
  const h = () => {
    i = !1, l.clear(), c = 0;
    try {
      const d = document.querySelector("[data-nimbi-preview-image]");
      d && (d.classList.add("is-panning"), d.classList.remove("is-grabbing"));
    } catch {
    }
  };
  e.addEventListener("pointerup", h), e.addEventListener("pointercancel", h);
}
function lc(e) {
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
  const g = Dl(a, [{ path: o, name: a("home"), isIndex: !0, children: [] }]);
  let h = !1, d = !1;
  function p(b) {
    try {
      if (!b) return;
      if (typeof b.replaceChildren == "function") return b.replaceChildren();
      for (; b.firstChild; ) b.removeChild(b.firstChild);
    } catch {
      try {
        b && (b.innerHTML = "");
      } catch {
      }
    }
  }
  async function m(b, v) {
    let S, E, P;
    try {
      ({ data: S, pagePath: E, anchor: P } = await To(b, s));
    } catch (H) {
      const M = H && H.message ? String(H.message) : "", F = (!le || typeof le != "string" || !le) && /no page data/i.test(M);
      try {
        if (F)
          try {
            k("[nimbi-cms] fetchPageData (expected missing)", H);
          } catch {
          }
        else
          try {
            nr("[nimbi-cms] fetchPageData failed", H);
          } catch {
          }
      } catch {
      }
      try {
        !le && n && p(n);
      } catch {
      }
      ea(t, a, H);
      return;
    }
    !P && v && (P = v);
    try {
      Zr(null);
    } catch (H) {
      k("[nimbi-cms] scrollToAnchorOrTop failed", H);
    }
    try {
      p(t);
    } catch {
      try {
        t.innerHTML = "";
      } catch {
      }
    }
    const { article: I, parsed: U, toc: z, topH1: O, h1Text: W, slugKey: te } = await Kl(a, S, E, P, s);
    Ao(a, l, U, z, I, E, P, O, W, te, S);
    try {
      p(n);
    } catch {
      try {
        n.innerHTML = "";
      } catch {
      }
    }
    z && (n.appendChild(z), tc(z));
    try {
      await c("transformHtml", { article: I, parsed: U, toc: z, pagePath: E, anchor: P, topH1: O, h1Text: W, slugKey: te, data: S });
    } catch (H) {
      k("[nimbi-cms] transformHtml hooks failed", H);
    }
    t.appendChild(I);
    try {
      Vl(I);
    } catch (H) {
      k("[nimbi-cms] executeEmbeddedScripts failed", H);
    }
    try {
      oc(I, { t: a });
    } catch (H) {
      k("[nimbi-cms] attachImagePreview failed", H);
    }
    try {
      Wn(i, 100, !1), requestAnimationFrame(() => Wn(i, 100, !1)), setTimeout(() => Wn(i, 100, !1), 250);
    } catch (H) {
      k("[nimbi-cms] setEagerForAboveFoldImages failed", H);
    }
    Zr(P), nc(I, O, { mountOverlay: r, container: i, navWrap: n, t: a });
    try {
      await c("onPageLoad", { data: S, pagePath: E, anchor: P, article: I, toc: z, topH1: O, h1Text: W, slugKey: te, contentWrap: t, navWrap: n });
    } catch (H) {
      k("[nimbi-cms] onPageLoad hooks failed", H);
    }
    u = E;
  }
  async function f() {
    if (h) {
      d = !0;
      return;
    }
    h = !0;
    try {
      try {
        aa("renderByQuery");
      } catch {
      }
      try {
        sa("renderByQuery");
      } catch {
      }
      let b = it(location.href);
      if (b && b.type === "path" && b.page)
        try {
          let E = "?page=" + encodeURIComponent(b.page || "");
          b.params && (E += (E.includes("?") ? "&" : "?") + b.params), b.anchor && (E += "#" + encodeURIComponent(b.anchor));
          try {
            history.replaceState(history.state, "", E);
          } catch {
            try {
              history.replaceState({}, "", E);
            } catch {
            }
          }
          b = it(location.href);
        } catch {
        }
      const v = b && b.page ? b.page : o, S = b && b.anchor ? b.anchor : null;
      await m(v, S);
    } catch (b) {
      k("[nimbi-cms] renderByQuery failed", b);
      try {
        !le && n && p(n);
      } catch {
      }
      ea(t, a, b);
    } finally {
      if (h = !1, d) {
        d = !1;
        try {
          await f();
        } catch {
        }
      }
    }
  }
  window.addEventListener("popstate", f);
  const w = () => `nimbi-cms-scroll:${location.pathname}${location.search}`, y = () => {
    try {
      const b = i || document.querySelector(".nimbi-cms");
      if (!b) return;
      const v = {
        top: b.scrollTop || 0,
        left: b.scrollLeft || 0
      };
      sessionStorage.setItem(w(), JSON.stringify(v));
    } catch (b) {
      k("[nimbi-cms] save scroll position failed", b);
    }
  }, _ = () => {
    try {
      const b = i || document.querySelector(".nimbi-cms");
      if (!b) return;
      const v = sessionStorage.getItem(w());
      if (!v) return;
      const S = JSON.parse(v);
      S && typeof S.top == "number" && b.scrollTo({ top: S.top, left: S.left || 0, behavior: "auto" });
    } catch {
    }
  };
  return window.addEventListener("pageshow", (b) => {
    if (b.persisted)
      try {
        _(), Wn(i, 100, !1);
      } catch (v) {
        k("[nimbi-cms] bfcache restore failed", v);
      }
  }), window.addEventListener("pagehide", () => {
    try {
      y();
    } catch (b) {
      k("[nimbi-cms] save scroll position failed", b);
    }
  }), { renderByQuery: f, siteNav: g, getCurrentPagePath: () => u };
}
function cc(e) {
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
function Rr(e) {
  if (typeof e != "string") return !1;
  const t = e.trim();
  if (!t || t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t)) return !1;
  const n = t.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n);
}
function uc(e) {
  if (typeof e != "string") return !1;
  const t = e.trim();
  if (!t) return !1;
  if (t === "." || t === "./") return !0;
  if (t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t)) return !1;
  const n = t.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\/?$/.test(n);
}
let Gn = "";
async function xc(e = {}) {
  if (!e || typeof e != "object")
    throw new TypeError("initCMS(options): options must be an object");
  const t = cc();
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
      zi(n.debugLevel);
    else if (typeof globalThis < "u" && globalThis.__nimbiCMSDebug && typeof globalThis.__nimbiCMSDebug.debugLevel < "u")
      try {
        const z = Number(globalThis.__nimbiCMSDebug.debugLevel);
        Number.isFinite(z) && zi(Math.max(0, Math.min(3, Math.floor(z))));
      } catch {
      }
  } catch {
  }
  try {
    $t("[nimbi-cms] initCMS called", () => ({ options: n }));
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
    bulmaCustomize: g = "none",
    lang: h = void 0,
    l10nFile: d = null,
    cacheTtlMinutes: p = 5,
    cacheMaxEntries: m,
    markdownExtensions: f,
    availableLanguages: w,
    homePage: y = null,
    notFoundPage: _ = null,
    navigationPage: b = "_navigation.md",
    exposeSitemap: v = !0
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
    typeof b == "string" && b.startsWith("./") && (b = b.replace(/^[.]\//, ""));
  } catch {
  }
  const { navbarLogo: S = "favicon" } = n, { skipRootReadme: E = !1 } = n, P = (z) => {
    try {
      const O = document.querySelector(i);
      if (O && O instanceof Element)
        try {
          const W = document.createElement("div");
          W.style.padding = "1rem";
          try {
            W.style.fontFamily = "system-ui, sans-serif";
          } catch {
          }
          W.style.color = "#b00", W.style.background = "#fee", W.style.border = "1px solid #b00";
          const te = document.createElement("strong");
          te.textContent = "NimbiCMS failed to initialize:", W.appendChild(te);
          try {
            W.appendChild(document.createElement("br"));
          } catch {
          }
          const H = document.createElement("pre");
          try {
            H.style.whiteSpace = "pre-wrap";
          } catch {
          }
          H.textContent = String(z), W.appendChild(H);
          try {
            if (typeof O.replaceChildren == "function") O.replaceChildren(W);
            else {
              for (; O.firstChild; ) O.removeChild(O.firstChild);
              O.appendChild(W);
            }
          } catch {
            try {
              O.innerHTML = '<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;"><strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">' + String(z) + "</pre></div>";
            } catch {
            }
          }
        } catch {
        }
    } catch {
    }
  };
  if (n.contentPath != null && !uc(n.contentPath))
    throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');
  if (y != null && !Rr(y))
    throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');
  if (_ != null && !Rr(_))
    throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');
  if (b != null && !Rr(b))
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
  if (o != null && o !== "eager" && o !== "lazy")
    throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');
  if (l != null && l !== 1 && l !== 2 && l !== 3)
    throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');
  if (u !== "light" && u !== "dark" && u !== "system")
    throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');
  if (g != null && typeof g != "string")
    throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');
  if (h != null && typeof h != "string")
    throw new TypeError('initCMS(options): "lang" must be a string when provided');
  if (d != null && typeof d != "string")
    throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');
  if (p != null && (typeof p != "number" || !Number.isFinite(p) || p < 0))
    throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');
  if (m != null && (typeof m != "number" || !Number.isInteger(m) || m < 0))
    throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');
  if (f != null && (!Array.isArray(f) || f.some((z) => !z || typeof z != "object")))
    throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');
  if (w != null && (!Array.isArray(w) || w.some((z) => typeof z != "string" || !z.trim())))
    throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');
  if (c != null && (!Array.isArray(c) || c.some((z) => typeof z != "string" || !z.trim())))
    throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');
  if (E != null && typeof E != "boolean")
    throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');
  if (n.fetchConcurrency != null && (typeof n.fetchConcurrency != "number" || !Number.isInteger(n.fetchConcurrency) || n.fetchConcurrency < 1))
    throw new TypeError('initCMS(options): "fetchConcurrency" must be a positive integer when provided');
  if (n.negativeFetchCacheTTL != null && (typeof n.negativeFetchCacheTTL != "number" || !Number.isFinite(n.negativeFetchCacheTTL) || n.negativeFetchCacheTTL < 0))
    throw new TypeError('initCMS(options): "negativeFetchCacheTTL" must be a non-negative number (ms) when provided');
  if (y != null && (typeof y != "string" || !y.trim() || !/\.(md|html)$/.test(y)))
    throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');
  if (_ != null && (typeof _ != "string" || !_.trim() || !/\.(md|html)$/.test(_)))
    throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');
  const U = !!s;
  try {
    Promise.resolve().then(() => at).then((z) => {
      try {
        z && typeof z.setSkipRootReadme == "function" && z.setSkipRootReadme(!!E);
      } catch (O) {
        k("[nimbi-cms] setSkipRootReadme failed", O);
      }
    }).catch((z) => {
    });
  } catch (z) {
    k("[nimbi-cms] setSkipRootReadme dynamic import failed", z);
  }
  try {
    try {
      n && n.seoMap && typeof n.seoMap == "object" && So(n.seoMap);
    } catch {
    }
    try {
      typeof window < "u" && (window.__nimbiRenderingErrors__ || (window.__nimbiRenderingErrors__ = []), window.addEventListener("error", function(z) {
        try {
          const O = { type: "error", message: z && z.message ? String(z.message) : "", filename: z && z.filename ? String(z.filename) : "", lineno: z && z.lineno ? z.lineno : null, colno: z && z.colno ? z.colno : null, stack: z && z.error && z.error.stack ? z.error.stack : null, time: Date.now() };
          try {
            k("[nimbi-cms] runtime error", O.message);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(O);
        } catch {
        }
      }), window.addEventListener("unhandledrejection", function(z) {
        try {
          const O = { type: "unhandledrejection", reason: z && z.reason ? String(z.reason) : "", time: Date.now() };
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
      const z = it(typeof window < "u" ? window.location.href : ""), O = z && z.page ? z.page : y || void 0;
      try {
        O && vo(O, Gn || "");
      } catch {
      }
    } catch {
    }
    await (async () => {
      try {
        I.classList.add("nimbi-mount");
      } catch (C) {
        k("[nimbi-cms] mount element setup failed", C);
      }
      const z = document.createElement("section");
      z.className = "section";
      const O = document.createElement("div");
      O.className = "container nimbi-cms";
      const W = document.createElement("div");
      W.className = "columns";
      const te = document.createElement("div");
      te.className = "column is-hidden-mobile is-3-tablet nimbi-nav-wrap", te.setAttribute("role", "navigation");
      try {
        const C = typeof yn == "function" ? yn("navigation") : null;
        C && te.setAttribute("aria-label", C);
      } catch (C) {
        k("[nimbi-cms] set nav aria-label failed", C);
      }
      W.appendChild(te);
      const H = document.createElement("main");
      H.className = "column nimbi-content", H.setAttribute("role", "main"), W.appendChild(H), O.appendChild(W), z.appendChild(O);
      const M = te, F = H;
      I.appendChild(z);
      let G = null;
      try {
        G = I.querySelector(".nimbi-overlay"), G || (G = document.createElement("div"), G.className = "nimbi-overlay", I.appendChild(G));
      } catch (C) {
        G = null, k("[nimbi-cms] mount overlay setup failed", C);
      }
      const ie = location.pathname || "/";
      let ye;
      if (ie.endsWith("/"))
        ye = ie;
      else {
        const C = ie.substring(ie.lastIndexOf("/") + 1);
        C && !C.includes(".") ? ye = ie + "/" : ye = ie.substring(0, ie.lastIndexOf("/") + 1);
      }
      try {
        Gn = document.title || "";
      } catch (C) {
        Gn = "", k("[nimbi-cms] read initial document title failed", C);
      }
      let J = r;
      const Te = Object.prototype.hasOwnProperty.call(n, "contentPath"), ke = typeof location < "u" && location.origin ? location.origin : "http://localhost", xe = new URL(ye, ke).toString();
      (J === "." || J === "./") && (J = "");
      try {
        J = String(J || "").replace(/\\/g, "/");
      } catch {
        J = String(J || "");
      }
      J.startsWith("/") && (J = J.replace(/^\/+/, "")), J && !J.endsWith("/") && (J = J + "/");
      try {
        if (J && ye && ye !== "/") {
          const C = ye.replace(/^\/+/, "").replace(/\/+$/, "") + "/";
          C && J.startsWith(C) && (J = J.slice(C.length));
        }
      } catch {
      }
      try {
        if (J)
          var Ee = new URL(J, xe.endsWith("/") ? xe : xe + "/").toString();
        else
          var Ee = xe;
      } catch {
        try {
          if (J) var Ee = new URL("/" + J, ke).toString();
          else var Ee = new URL(ye, ke).toString();
        } catch {
          var Ee = ke;
        }
      }
      if (d && await fa(d, ye), w && Array.isArray(w) && ma(w), h && ga(h), typeof p == "number" && p >= 0 && typeof qi == "function" && qi(p * 60 * 1e3), typeof m == "number" && m >= 0 && typeof ji == "function" && ji(m), f && Array.isArray(f) && f.length)
        try {
          f.forEach((C) => {
            typeof C == "object" && gi && typeof Dr == "function" && Dr(C);
          });
        } catch (C) {
          k("[nimbi-cms] applying markdownExtensions failed", C);
        }
      try {
        typeof a == "number" && Promise.resolve().then(() => at).then(({ setDefaultCrawlMaxQueue: C }) => {
          try {
            C(a);
          } catch (A) {
            k("[nimbi-cms] setDefaultCrawlMaxQueue failed", A);
          }
        }), typeof n.fetchConcurrency == "number" && Promise.resolve().then(() => at).then(({ setFetchConcurrency: C }) => {
          try {
            C(n.fetchConcurrency);
          } catch (A) {
            k("[nimbi-cms] setFetchConcurrency failed", A);
          }
        }).catch(() => {
        }), typeof n.negativeFetchCacheTTL == "number" && Promise.resolve().then(() => at).then(({ setFetchNegativeCacheTTL: C }) => {
          try {
            C(n.negativeFetchCacheTTL);
          } catch (A) {
            k("[nimbi-cms] setFetchNegativeCacheTTL failed", A);
          }
        }).catch(() => {
        });
      } catch (C) {
        k("[nimbi-cms] setDefaultCrawlMaxQueue import failed", C);
      }
      try {
        try {
          const C = n && n.manifest ? n.manifest : typeof globalThis < "u" && globalThis.__NIMBI_CMS_MANIFEST__ ? globalThis.__NIMBI_CMS_MANIFEST__ : typeof window < "u" && window.__NIMBI_CMS_MANIFEST__ ? window.__NIMBI_CMS_MANIFEST__ : null;
          if (C && typeof C == "object")
            try {
              const A = await Promise.resolve().then(() => at);
              if (A && typeof A._setAllMd == "function") {
                A._setAllMd(C);
                try {
                  $t("[nimbi-cms diagnostic] applied content manifest", () => ({ manifestKeys: Object.keys(C).length }));
                } catch {
                }
              }
            } catch (A) {
              k("[nimbi-cms] applying content manifest failed", A);
            }
          try {
            ti(Ee);
          } catch (A) {
            k("[nimbi-cms] setContentBase failed", A);
          }
          try {
            try {
              const A = await Promise.resolve().then(() => at);
              try {
                $t("[nimbi-cms diagnostic] after setContentBase", () => ({
                  manifestKeys: C && typeof C == "object" ? Object.keys(C).length : 0,
                  slugToMdSize: A && A.slugToMd && typeof A.slugToMd.size == "number" ? A.slugToMd.size : void 0,
                  allMarkdownPathsLength: A && Array.isArray(A.allMarkdownPaths) ? A.allMarkdownPaths.length : void 0,
                  allMarkdownPathsSetSize: A && A.allMarkdownPathsSet && typeof A.allMarkdownPathsSet.size == "number" ? A.allMarkdownPathsSet.size : void 0,
                  searchIndexLength: A && Array.isArray(A.searchIndex) ? A.searchIndex.length : void 0
                }));
              } catch {
              }
            } catch {
            }
          } catch {
          }
        } catch {
        }
      } catch (C) {
        k("[nimbi-cms] setContentBase failed", C);
      }
      try {
        wa(_);
      } catch (C) {
        k("[nimbi-cms] setNotFoundPage failed", C);
      }
      try {
        typeof window < "u" && window.__nimbiAutoAttachSitemapUI && Promise.resolve().then(() => Mn).then((C) => {
          try {
            C && typeof C.attachSitemapDownloadUI == "function" && C.attachSitemapDownloadUI(document.body, { filename: "sitemap.json" });
          } catch {
          }
        }).catch(() => {
        });
      } catch {
      }
      let He = null, R = null;
      try {
        if (!Object.prototype.hasOwnProperty.call(n, "homePage") && b)
          try {
            const L = [], D = [];
            try {
              b && D.push(String(b));
            } catch {
            }
            try {
              const q = String(b || "").replace(/^_/, "");
              q && q !== String(b) && D.push(q);
            } catch {
            }
            try {
              D.push("navigation.md");
            } catch {
            }
            try {
              D.push("assets/navigation.md");
            } catch {
            }
            const K = [];
            for (const q of D)
              try {
                if (!q) continue;
                const $ = String(q);
                K.includes($) || K.push($);
              } catch {
              }
            for (const q of K) {
              L.push(q);
              try {
                if (R = await Oe(q, Ee, { force: !0 }), R && R.raw) {
                  try {
                    b = q;
                  } catch {
                  }
                  try {
                    k("[nimbi-cms] fetched navigation candidate", q, "contentBase=", Ee);
                  } catch {
                  }
                  He = await ln(R.raw || "");
                  try {
                    const $ = qe();
                    if ($ && He && He.html) {
                      const j = $.parseFromString(He.html, "text/html").querySelector("a");
                      if (j)
                        try {
                          const X = j.getAttribute("href") || "", se = it(X);
                          try {
                            k("[nimbi-cms] parsed nav first-link href", X, "->", se);
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
          _a(y);
        } catch (L) {
          k("[nimbi-cms] setHomePage failed", L);
        }
        let A = !0;
        try {
          const L = it(typeof location < "u" ? location.href : "");
          L && L.type === "cosmetic" && (typeof _ > "u" || _ == null) && (A = !1);
        } catch {
        }
        if (A && y)
          try {
            await Oe(y, Ee, { force: !0 });
          } catch (L) {
            throw new Error(`Required ${y} not found at ${Ee}${y}: ${L && L.message ? L.message : String(L)}`);
          }
      } catch (C) {
        throw C;
      }
      Is(u), await Ps(g, ye);
      const N = lc({ contentWrap: F, navWrap: M, container: O, mountOverlay: G, t: yn, contentBase: Ee, homePage: y, initialDocumentTitle: Gn, runHooks: Ri });
      try {
        const C = document.createElement("header");
        C.className = "nimbi-site-navbar", I.insertBefore(C, z);
        let A = R, L = He;
        L || (A = await Oe(b, Ee, { force: !0 }), L = await ln(A.raw || ""));
        const { navbar: D, linkEls: K } = await ic(C, O, L.html || "", Ee, y, yn, N.renderByQuery, U, o, l, c, S);
        try {
          await Ri("onNavBuild", { navWrap: M, navbar: D, linkEls: K, contentBase: Ee });
        } catch (q) {
          k("[nimbi-cms] onNavBuild hooks failed", q);
        }
        try {
          try {
            if (K && K.length) {
              const q = await Promise.resolve().then(() => at);
              for (const $ of Array.from(K || []))
                try {
                  const T = $ && $.getAttribute && $.getAttribute("href") || "";
                  if (!T) continue;
                  let j = String(T || "").split(/::|#/, 1)[0];
                  if (j = String(j || "").split("?")[0], !j) continue;
                  /\.(?:md|html?)$/.test(j) || (j = j + ".html");
                  let X = null;
                  try {
                    X = Y(String(j || ""));
                  } catch {
                    X = String(j || "");
                  }
                  const se = String(X || "").replace(/^.*\//, "").replace(/\?.*$/, "");
                  if (!se) continue;
                  try {
                    let pe = null;
                    try {
                      q && typeof q.slugify == "function" && (pe = q.slugify(se.replace(/\.(?:md|html?)$/i, "")));
                    } catch {
                      pe = String(se || "").replace(/\s+/g, "-").toLowerCase();
                    }
                    if (!pe) continue;
                    let be = pe;
                    try {
                      if (q && q.slugToMd && typeof q.slugToMd.has == "function" && q.slugToMd.has(pe)) {
                        const ge = q.slugToMd.get(pe);
                        let Se = !1;
                        try {
                          if (typeof ge == "string")
                            ge === j && (Se = !0);
                          else if (ge && typeof ge == "object") {
                            ge.default === j && (Se = !0);
                            for (const ze of Object.keys(ge.langs || {}))
                              if (ge.langs[ze] === j) {
                                Se = !0;
                                break;
                              }
                          }
                        } catch {
                        }
                        if (!Se && typeof q.uniqueSlug == "function")
                          try {
                            be = q.uniqueSlug(pe, new Set(q.slugToMd.keys()));
                          } catch {
                            be = pe;
                          }
                      }
                    } catch {
                    }
                    try {
                      if (q && typeof q._storeSlugMapping == "function")
                        try {
                          q._storeSlugMapping(be, X);
                        } catch {
                        }
                      else if (q && q.slugToMd && typeof q.slugToMd.set == "function")
                        try {
                          q.slugToMd.set(be, X);
                        } catch {
                        }
                      try {
                        q && q.mdToSlug && typeof q.mdToSlug.set == "function" && q.mdToSlug.set(X, be);
                      } catch {
                      }
                      try {
                        q && Array.isArray(q.allMarkdownPaths) && !q.allMarkdownPaths.includes(X) && q.allMarkdownPaths.push(X);
                      } catch {
                      }
                      try {
                        q && q.allMarkdownPathsSet && typeof q.allMarkdownPathsSet.add == "function" && q.allMarkdownPathsSet.add(X);
                      } catch {
                      }
                    } catch {
                    }
                  } catch {
                  }
                } catch {
                }
              try {
                const $ = await Promise.resolve().then(() => Cr);
                $ && typeof $.refreshIndexPaths == "function" && $.refreshIndexPaths(Ee);
              } catch {
              }
            }
          } catch {
          }
        } catch {
        }
        try {
          let q = !1;
          try {
            const $ = new URLSearchParams(location.search || "");
            ($.has("sitemap") || $.has("rss") || $.has("atom")) && (q = !0);
          } catch {
          }
          try {
            const T = (location.pathname || "/").replace(/\/\/+/g, "/").split("/").filter(Boolean).pop() || "";
            T && /^(sitemap|sitemap\.xml|rss|rss\.xml|atom|atom\.xml)$/i.test(T) && (q = !0);
          } catch {
          }
          if (q || v === !0 || typeof window < "u" && window.__nimbiExposeSitemap)
            try {
              try {
                const T = await Promise.resolve().then(() => at);
                if (T && typeof T.awaitSearchIndex == "function") {
                  const j = [];
                  y && j.push(y), b && j.push(b);
                  try {
                    await T.awaitSearchIndex({ contentBase: Ee, indexDepth: Math.max(l || 1, 3), noIndexing: c, seedPaths: j.length ? j : void 0, startBuild: !0, timeoutMs: 1 / 0 });
                  } catch {
                  }
                }
              } catch {
              }
              const $ = await Promise.resolve().then(() => Mn);
              try {
                if ($ && typeof $.handleSitemapRequest == "function" && await $.handleSitemapRequest({ includeAllMarkdown: !0, homePage: y, navigationPage: b, notFoundPage: _, contentBase: Ee, indexDepth: l, noIndexing: c }))
                  return;
              } catch {
              }
            } catch {
            }
          try {
            Promise.resolve().then(() => Mn).then(($) => {
              try {
                if ($ && typeof $.exposeSitemapGlobals == "function")
                  try {
                    $.exposeSitemapGlobals({ includeAllMarkdown: !0, homePage: y, navigationPage: b, notFoundPage: _, contentBase: Ee, indexDepth: l, noIndexing: c, waitForIndexMs: 1 / 0 }).catch(() => {
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
            const $ = await Promise.resolve().then(() => Cr);
            if ($ && typeof $.refreshIndexPaths == "function")
              try {
                $.refreshIndexPaths(Ee);
                try {
                  try {
                    const T = await Promise.resolve().then(() => at);
                    try {
                      $t("[nimbi-cms diagnostic] after refreshIndexPaths", () => ({ slugToMdSize: T && T.slugToMd && typeof T.slugToMd.size == "number" ? T.slugToMd.size : void 0, allMarkdownPathsLength: T && Array.isArray(T.allMarkdownPaths) ? T.allMarkdownPaths.length : void 0, allMarkdownPathsSetSize: T && T.allMarkdownPathsSet && typeof T.allMarkdownPathsSet.size == "number" ? T.allMarkdownPathsSet.size : void 0 }));
                    } catch {
                    }
                  } catch {
                  }
                } catch {
                }
                try {
                  const T = await Promise.resolve().then(() => at), j = T && T.slugToMd && typeof T.slugToMd.size == "number" ? T.slugToMd.size : 0;
                  let X = !1;
                  try {
                    if (!manifest) {
                      j < 30 && (X = !0);
                      try {
                        const se = it(typeof location < "u" ? location.href : "");
                        if (se) {
                          if (se.type === "cosmetic" && se.page)
                            try {
                              T.slugToMd.has(se.page) || (X = !0);
                            } catch {
                            }
                          else if ((se.type === "path" || se.type === "canonical") && se.page)
                            try {
                              const pe = Y(se.page);
                              !(T.mdToSlug && T.mdToSlug.has(pe)) && !(T.allMarkdownPathsSet && T.allMarkdownPathsSet.has(pe)) && (X = !0);
                            } catch {
                            }
                        }
                      } catch {
                      }
                    }
                  } catch {
                  }
                  if (X) {
                    let se = null;
                    try {
                      se = typeof window < "u" && (window.__nimbiSitemapFinal || window.__nimbiResolvedIndex || window.__nimbiSearchIndex || window.__nimbiLiveSearchIndex || window.__nimbiSearchIndex) || null;
                    } catch {
                      se = null;
                    }
                    if (Array.isArray(se) && se.length) {
                      let pe = 0;
                      for (const be of se)
                        try {
                          if (!be || !be.slug) continue;
                          const ge = String(be.slug).split("::")[0];
                          if (T.slugToMd.has(ge)) continue;
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
                          let ze = null;
                          try {
                            const Fe = Ee && typeof Ee == "string" ? Ee : typeof location < "u" && location.origin ? location.origin + "/" : "";
                            try {
                              const Ge = new URL(Se, Fe), Et = new URL(Fe);
                              if (Ge.origin === Et.origin) {
                                const un = Et.pathname || "/";
                                let Ct = Ge.pathname || "";
                                Ct.startsWith(un) && (Ct = Ct.slice(un.length)), Ct.startsWith("/") && (Ct = Ct.slice(1)), ze = Y(Ct);
                              } else
                                ze = Y(Ge.pathname || "");
                            } catch {
                              ze = Y(Se);
                            }
                          } catch {
                            ze = Y(Se);
                          }
                          if (!ze) continue;
                          ze = String(ze).split(/[?#]/)[0], ze = Y(ze);
                          try {
                            T._storeSlugMapping(ge, ze);
                          } catch {
                          }
                          pe++;
                        } catch {
                        }
                      if (pe) {
                        try {
                          $t("[nimbi-cms diagnostic] populated slugToMd from sitemap/searchIndex", () => ({ added: pe, total: T && T.slugToMd && typeof T.slugToMd.size == "number" ? T.slugToMd.size : void 0 }));
                        } catch {
                        }
                        try {
                          const be = await Promise.resolve().then(() => Cr);
                          be && typeof be.refreshIndexPaths == "function" && be.refreshIndexPaths(Ee);
                        } catch {
                        }
                      }
                    }
                  }
                } catch {
                }
              } catch (T) {
                k("[nimbi-cms] refreshIndexPaths after nav build failed", T);
              }
          } catch {
          }
          const q = () => {
            const $ = C && C.getBoundingClientRect && Math.round(C.getBoundingClientRect().height) || C && C.offsetHeight || 0;
            if ($ > 0) {
              try {
                I.style.setProperty("--nimbi-site-navbar-height", `${$}px`);
              } catch (T) {
                k("[nimbi-cms] set CSS var failed", T);
              }
              try {
                O.style.paddingTop = "";
              } catch (T) {
                k("[nimbi-cms] set container paddingTop failed", T);
              }
              try {
                const T = I && I.getBoundingClientRect && Math.round(I.getBoundingClientRect().height) || I && I.clientHeight || 0;
                if (T > 0) {
                  const j = Math.max(0, T - $);
                  try {
                    O.style.setProperty("--nimbi-cms-height", `${j}px`);
                  } catch (X) {
                    k("[nimbi-cms] set --nimbi-cms-height failed", X);
                  }
                } else
                  try {
                    O.style.setProperty("--nimbi-cms-height", "calc(100vh - var(--nimbi-site-navbar-height))");
                  } catch (j) {
                    k("[nimbi-cms] set --nimbi-cms-height failed", j);
                  }
              } catch (T) {
                k("[nimbi-cms] compute container height failed", T);
              }
              try {
                C.style.setProperty("--nimbi-site-navbar-height", `${$}px`);
              } catch (T) {
                k("[nimbi-cms] set navbar CSS var failed", T);
              }
            }
          };
          q();
          try {
            if (typeof ResizeObserver < "u") {
              const $ = new ResizeObserver(() => q());
              try {
                $.observe(C);
              } catch (T) {
                k("[nimbi-cms] ResizeObserver.observe failed", T);
              }
            }
          } catch ($) {
            k("[nimbi-cms] ResizeObserver setup failed", $);
          }
        } catch (q) {
          k("[nimbi-cms] compute navbar height failed", q);
        }
      } catch (C) {
        k("[nimbi-cms] build navigation failed", C);
      }
      await N.renderByQuery();
      try {
        Promise.resolve().then(() => dc).then(({ getVersion: C }) => {
          typeof C == "function" && C().then((A) => {
            try {
              const L = A || "0.0.0";
              try {
                const D = ($) => {
                  const T = document.createElement("a");
                  T.className = "nimbi-version-label tag is-small", T.textContent = `nimbiCMS v. ${L}`, T.href = $ || "#", T.target = "_blank", T.rel = "noopener noreferrer nofollow", T.setAttribute("aria-label", `nimbiCMS version ${L}`);
                  try {
                    ha(T);
                  } catch {
                  }
                  try {
                    I.appendChild(T);
                  } catch (j) {
                    k("[nimbi-cms] append version label failed", j);
                  }
                }, K = "https://abelvm.github.io/nimbiCMS/", q = (() => {
                  try {
                    if (K && typeof K == "string")
                      return new URL(K).toString();
                  } catch {
                  }
                  return "#";
                })();
                D(q);
              } catch (D) {
                k("[nimbi-cms] building version label failed", D);
              }
            } catch (L) {
              k("[nimbi-cms] building version label failed", L);
            }
          }).catch((A) => {
            k("[nimbi-cms] getVersion() failed", A);
          });
        }).catch((C) => {
          k("[nimbi-cms] import version module failed", C);
        });
      } catch (C) {
        k("[nimbi-cms] version label setup failed", C);
      }
    })();
  } catch (z) {
    throw P(z), z;
  }
}
async function hc() {
  try {
    if ("1.0.5".trim())
      return "1.0.5";
  } catch {
  }
  return "0.0.0";
}
const dc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getVersion: hc
}, Symbol.toStringTag, { value: "Module" })), et = Bt, mn = k;
function mi() {
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
function na(e) {
  try {
    return !e || typeof e != "string" ? "" : (e.split("/").filter(Boolean).pop() || e).replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").split(" ").map((r) => r ? r.charAt(0).toUpperCase() + r.slice(1) : "").join(" ").trim();
  } catch {
    return String(e);
  }
}
function fc(e, t) {
  try {
    const n = t && t.slug ? String(t.slug) : null;
    if (!n) return null;
    const r = { loc: e + "?page=" + encodeURIComponent(n), slug: n };
    return t.title && (r.title = String(t.title)), t.excerpt && (r.excerpt = String(t.excerpt)), t.path && (r.sourcePath = Y(String(t.path))), r;
  } catch {
    return null;
  }
}
async function yi(e = {}) {
  const {
    includeAllMarkdown: t = !0,
    index: n,
    homePage: i,
    navigationPage: r,
    notFoundPage: a
  } = e || {}, o = mi().split("?")[0];
  let l = Array.isArray(re) && re.length ? re : Array.isArray(n) ? n : [];
  if (Array.isArray(n) && n.length && Array.isArray(re) && re.length) {
    const w = /* @__PURE__ */ new Map();
    try {
      for (const y of n)
        try {
          y && y.slug && w.set(String(y.slug), y);
        } catch {
        }
      for (const y of re)
        try {
          y && y.slug && w.set(String(y.slug), y);
        } catch {
        }
    } catch {
    }
    l = Array.from(w.values());
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
      const w = Y(String(a));
      try {
        if (Z && typeof Z.has == "function" && Z.has(w))
          try {
            u.add(Z.get(w));
          } catch {
          }
        else
          try {
            const y = await Oe(w, e && e.contentBase ? e.contentBase : void 0);
            if (y && y.raw)
              try {
                let _ = null;
                if (y.isHtml)
                  try {
                    const b = qe();
                    if (b) {
                      const v = b.parseFromString(y.raw, "text/html"), S = v.querySelector("h1") || v.querySelector("title");
                      S && S.textContent && (_ = S.textContent.trim());
                    } else {
                      const v = (y.raw || "").match(/<h1[^>]*>(.*?)<\/h1>|<title[^>]*>(.*?)<\/title>/i);
                      v && (_ = (v[1] || v[2] || "").trim());
                    }
                  } catch {
                  }
                else {
                  const b = (y.raw || "").match(/^#\s+(.+)$/m);
                  b && b[1] && (_ = b[1].trim());
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
  const g = /* @__PURE__ */ new Set(), h = [], d = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), m = (w) => {
    try {
      if (!w || typeof w != "string") return !1;
      const y = Y(String(w));
      try {
        if ($e && typeof $e.has == "function" && $e.has(y)) return !0;
      } catch {
      }
      try {
        if (Z && typeof Z.has == "function" && Z.has(y)) return !0;
      } catch {
      }
      try {
        if (p && p.has(y)) return !0;
      } catch {
      }
      try {
        if (Z && typeof Z.keys == "function" && Z.size)
          for (const _ of Z.keys())
            try {
              if (Y(String(_)) === y) return !0;
            } catch {
            }
        else
          for (const _ of V.values())
            try {
              if (!_) continue;
              if (typeof _ == "string") {
                if (Y(String(_)) === y) return !0;
              } else if (_ && typeof _ == "object") {
                if (_.default && Y(String(_.default)) === y) return !0;
                const b = _.langs || {};
                for (const v of Object.keys(b || {}))
                  try {
                    if (b[v] && Y(String(b[v])) === y) return !0;
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
    let w = 0;
    for (const y of l) {
      try {
        w++, await Pt(w, 64);
      } catch {
      }
      try {
        if (!y || !y.slug) continue;
        const _ = String(y.slug), b = String(_).split("::")[0];
        if (u.has(b)) continue;
        const v = y.path ? Y(String(y.path)) : null;
        if (v && c.has(v)) continue;
        const S = y.title ? String(y.title) : y.parentTitle ? String(y.parentTitle) : void 0;
        d.set(_, { title: S || void 0, excerpt: y.excerpt ? String(y.excerpt) : void 0, path: v, source: "index" }), v && p.set(v, { title: S || void 0, excerpt: y.excerpt ? String(y.excerpt) : void 0, slug: _ });
        const E = fc(o, y);
        if (!E || !E.slug || g.has(E.slug)) continue;
        if (g.add(E.slug), d.has(E.slug)) {
          const P = d.get(E.slug);
          P && P.title && (E.title = P.title, E._titleSource = "index"), P && P.excerpt && (E.excerpt = P.excerpt);
        }
        h.push(E);
      } catch {
        continue;
      }
    }
  }
  if (t)
    try {
      let w = 0;
      for (const [y, _] of V.entries()) {
        try {
          w++, await Pt(w, 128);
        } catch {
        }
        try {
          if (!y) continue;
          const b = String(y).split("::")[0];
          if (g.has(y) || u.has(b)) continue;
          let v = null;
          if (typeof _ == "string" ? v = Y(String(_)) : _ && typeof _ == "object" && (v = Y(String(_.default || ""))), v && c.has(v)) continue;
          const E = { loc: o + "?page=" + encodeURIComponent(y), slug: y };
          if (d.has(y)) {
            const P = d.get(y);
            P && P.title && (E.title = P.title, E._titleSource = "index"), P && P.excerpt && (E.excerpt = P.excerpt);
          } else if (v) {
            const P = p.get(v);
            P && P.title && (E.title = P.title, E._titleSource = "path", !E.excerpt && P.excerpt && (E.excerpt = P.excerpt));
          }
          if (g.add(y), typeof y == "string") {
            const P = y.indexOf("/") !== -1 || /\.(md|html?)$/i.test(y), I = E.title && typeof E.title == "string" && (E.title.indexOf("/") !== -1 || /\.(md|html?)$/i.test(E.title));
            (!E.title || I || P) && (E.title = na(y), E._titleSource = "humanize");
          }
          h.push(E);
        } catch {
        }
      }
      try {
        if (i && typeof i == "string") {
          const y = Y(String(i));
          let _ = null;
          try {
            Z && Z.has(y) && (_ = Z.get(y));
          } catch {
          }
          _ || (_ = y);
          const b = String(_).split("::")[0];
          if (!g.has(_) && !c.has(y) && !u.has(b)) {
            const v = { loc: o + "?page=" + encodeURIComponent(_), slug: _ };
            if (d.has(_)) {
              const S = d.get(_);
              S && S.title && (v.title = S.title, v._titleSource = "index"), S && S.excerpt && (v.excerpt = S.excerpt);
            }
            g.add(_), h.push(v);
          }
        }
      } catch {
      }
    } catch {
    }
  try {
    const w = /* @__PURE__ */ new Set(), y = new Set(h.map((E) => String(E && E.slug ? E.slug : ""))), _ = /* @__PURE__ */ new Set();
    for (const E of h)
      try {
        E && E.sourcePath && _.add(String(E.sourcePath));
      } catch {
      }
    const b = 30;
    let v = 0, S = 0;
    for (const E of _) {
      try {
        S++, await Pt(S, 8);
      } catch {
      }
      if (v >= b) break;
      try {
        if (!E || typeof E != "string" || !m(E)) continue;
        v += 1;
        const P = await Oe(E, e && e.contentBase ? e.contentBase : void 0);
        if (!P || !P.raw || P && typeof P.status == "number" && P.status === 404) continue;
        const I = P.raw, U = (function(H) {
          try {
            return String(H || "");
          } catch {
            return "";
          }
        })(I), z = [], O = /\[[^\]]+\]\(([^)]+)\)/g;
        let W;
        for (; W = O.exec(U); )
          try {
            W && W[1] && z.push(W[1]);
          } catch {
          }
        const te = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
        for (; W = te.exec(U); )
          try {
            W && W[1] && z.push(W[1]);
          } catch {
          }
        for (const H of z)
          try {
            if (!H) continue;
            if (H.indexOf("?") !== -1 || H.indexOf("=") !== -1)
              try {
                const G = new URL(H, o).searchParams.get("page");
                if (G) {
                  const ie = String(G);
                  !y.has(ie) && !w.has(ie) && (w.add(ie), h.push({ loc: o + "?page=" + encodeURIComponent(ie), slug: ie }));
                  continue;
                }
              } catch {
              }
            let M = String(H).split(/[?#]/)[0];
            if (M = M.replace(/^\.\//, "").replace(/^\//, ""), !M || !/\.(md|html?)$/i.test(M)) continue;
            try {
              const F = Y(M);
              if (Z && Z.has(F)) {
                const G = Z.get(F), ie = String(G).split("::")[0];
                G && !y.has(G) && !w.has(G) && !u.has(ie) && !c.has(F) && (w.add(G), h.push({ loc: o + "?page=" + encodeURIComponent(G), slug: G, sourcePath: F }));
                continue;
              }
              try {
                if (!m(F)) continue;
                const G = await Oe(F, e && e.contentBase ? e.contentBase : void 0);
                if (G && typeof G.status == "number" && G.status === 404) continue;
                if (G && G.raw) {
                  const ie = (G.raw || "").match(/^#\s+(.+)$/m), ye = ie && ie[1] ? ie[1].trim() : "", J = he(ye || F), Te = String(J).split("::")[0];
                  J && !y.has(J) && !w.has(J) && !u.has(Te) && (w.add(J), h.push({ loc: o + "?page=" + encodeURIComponent(J), slug: J, sourcePath: F, title: ye || void 0 }));
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
    const w = /* @__PURE__ */ new Map();
    let y = 0;
    for (const b of h) {
      try {
        y++, await Pt(y, 128);
      } catch {
      }
      try {
        if (!b || !b.slug) continue;
        w.set(String(b.slug), b);
      } catch {
      }
    }
    const _ = /* @__PURE__ */ new Set();
    for (const b of h)
      try {
        if (!b || !b.slug) continue;
        const v = String(b.slug), S = v.split("::")[0];
        if (!S) continue;
        v !== S && !w.has(S) && _.add(S);
      } catch {
      }
    for (const b of _)
      try {
        let v = null;
        if (d.has(b)) {
          const S = d.get(b);
          v = { loc: o + "?page=" + encodeURIComponent(b), slug: b }, S && S.title && (v.title = S.title, v._titleSource = "index"), S && S.excerpt && (v.excerpt = S.excerpt), S && S.path && (v.sourcePath = S.path);
        } else if (p && V && V.has(b)) {
          const S = V.get(b);
          let E = null;
          if (typeof S == "string" ? E = Y(String(S)) : S && typeof S == "object" && (E = Y(String(S.default || ""))), v = { loc: o + "?page=" + encodeURIComponent(b), slug: b }, E && p.has(E)) {
            const P = p.get(E);
            P && P.title && (v.title = P.title, v._titleSource = "path"), P && P.excerpt && (v.excerpt = P.excerpt), v.sourcePath = E;
          }
        }
        v || (v = { loc: o + "?page=" + encodeURIComponent(b), slug: b, title: na(b) }, v._titleSource = "humanize"), w.has(b) || (h.push(v), w.set(b, v));
      } catch {
      }
  } catch {
  }
  const f = [];
  try {
    const w = /* @__PURE__ */ new Set();
    let y = 0;
    for (const _ of h) {
      try {
        y++, await Pt(y, 128);
      } catch {
      }
      try {
        if (!_ || !_.slug) continue;
        const b = String(_.slug), v = String(b).split("::")[0];
        if (u.has(v) || b.indexOf("::") !== -1 || w.has(b)) continue;
        w.add(b), f.push(_);
      } catch {
      }
    }
  } catch {
  }
  try {
    try {
      et(() => "[runtimeSitemap] generateSitemapJson finalEntries.titleSource: " + JSON.stringify(f.map((w) => ({ slug: w.slug, title: w.title, titleSource: w._titleSource || null })), null, 2));
    } catch {
    }
  } catch {
  }
  try {
    let y = 0;
    const _ = f.length, b = Array.from({ length: Math.min(4, _) }).map(async () => {
      for (; ; ) {
        const v = y++;
        if (v >= _) break;
        const S = f[v];
        try {
          if (!S || !S.slug) continue;
          const E = String(S.slug).split("::")[0];
          if (u.has(E) || S._titleSource === "index") continue;
          let P = null;
          try {
            if (V && V.has(S.slug)) {
              const I = V.get(S.slug);
              typeof I == "string" ? P = Y(String(I)) : I && typeof I == "object" && (P = Y(String(I.default || "")));
            }
            !P && S.sourcePath && (P = S.sourcePath);
          } catch {
            continue;
          }
          if (!P || c.has(P) || !m(P)) continue;
          try {
            const I = await Oe(P, e && e.contentBase ? e.contentBase : void 0);
            if (!I || !I.raw || I && typeof I.status == "number" && I.status === 404) continue;
            if (I && I.raw) {
              const U = (I.raw || "").match(/^#\s+(.+)$/m), z = U && U[1] ? U[1].trim() : "";
              z && (S.title = z, S._titleSource = "fetched");
            }
          } catch (I) {
            et("[runtimeSitemap] fetch title failed for", P, I);
          }
        } catch (E) {
          et("[runtimeSitemap] worker loop failure", E);
        }
      }
    });
    await Promise.all(b);
  } catch (w) {
    et("[runtimeSitemap] title enrichment failed", w);
  }
  return { generatedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: f };
}
function Gr(e) {
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
function Xr(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [], n = mi().split("?")[0];
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
function Qr(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [], n = mi().split("?")[0], i = e && e.generatedAt ? new Date(e.generatedAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
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
function ra(e, t = "application/xml") {
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
function ia(e) {
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
function Xn(e, t = "application/xml") {
  try {
    if (typeof window > "u") {
      try {
        let i = null;
        t === "application/rss+xml" ? i = Xr(e) : t === "application/atom+xml" ? i = Qr(e) : t === "text/html" ? i = ia(e) : i = Gr(e), ra(i, t);
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
          r.mimeType === "application/rss+xml" ? a = Xr(r.finalJson) : r.mimeType === "application/atom+xml" ? a = Qr(r.finalJson) : r.mimeType === "text/html" ? a = ia(r.finalJson) : a = Gr(r.finalJson);
          try {
            ra(a, r.mimeType);
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
async function gc(e = {}) {
  try {
    if (typeof document > "u" || typeof location > "u") return !1;
    let t = !1, n = !1, i = !1, r = !1;
    try {
      const u = new URLSearchParams(location.search || "");
      if (u.has("sitemap")) {
        let g = !0;
        for (const h of u.keys()) h !== "sitemap" && (g = !1);
        g && (t = !0);
      }
      if (u.has("rss")) {
        let g = !0;
        for (const h of u.keys()) h !== "rss" && (g = !1);
        g && (n = !0);
      }
      if (u.has("atom")) {
        let g = !0;
        for (const h of u.keys()) h !== "atom" && (g = !1);
        g && (i = !0);
      }
    } catch {
    }
    if (!t && !n && !i) {
      const g = (location.pathname || "/").replace(/\/\/+/g, "/").split("/").filter(Boolean).pop() || "";
      if (!g || (t = /^(sitemap|sitemap\.xml)$/i.test(g), n = /^(rss|rss\.xml)$/i.test(g), i = /^(atom|atom\.xml)$/i.test(g), r = /^(sitemap|sitemap\.html)$/i.test(g), !t && !n && !i && !r)) return !1;
    }
    let a = [];
    const s = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
    try {
      if (typeof Ot == "function")
        try {
          const u = await Ot({ timeoutMs: s, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 });
          if (Array.isArray(u) && u.length)
            if (Array.isArray(e.index) && e.index.length) {
              const g = /* @__PURE__ */ new Map();
              try {
                for (const h of e.index)
                  try {
                    h && h.slug && g.set(String(h.slug), h);
                  } catch {
                  }
                for (const h of u)
                  try {
                    h && h.slug && g.set(String(h.slug), h);
                  } catch {
                  }
              } catch {
              }
              a = Array.from(g.values());
            } else
              a = u;
          else
            a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(re) && re.length ? re : [];
        } catch {
          a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(re) && re.length ? re : [];
        }
      else
        a = Array.isArray(re) && re.length ? re : Array.isArray(e.index) && e.index.length ? e.index : [];
    } catch {
      a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(re) && re.length ? re : [];
    }
    try {
      if (Array.isArray(e.index) && e.index.length)
        try {
          const u = /* @__PURE__ */ new Map();
          for (const g of e.index)
            try {
              if (!g || !g.slug) continue;
              const h = String(g.slug).split("::")[0];
              if (!u.has(h)) u.set(h, g);
              else {
                const d = u.get(h);
                d && String(d.slug || "").indexOf("::") !== -1 && String(g.slug || "").indexOf("::") === -1 && u.set(h, g);
              }
            } catch {
            }
          try {
            et(() => "[runtimeSitemap] providedIndex.dedupedByBase: " + JSON.stringify(Array.from(u.values()), null, 2));
          } catch {
            et(() => "[runtimeSitemap] providedIndex.dedupedByBase (count): " + String(u.size));
          }
        } catch (u) {
          mn("[runtimeSitemap] logging provided index failed", u);
        }
    } catch {
    }
    if ((!Array.isArray(a) || !a.length) && typeof Wt == "function")
      try {
        const u = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
        let g = null;
        try {
          typeof Ot == "function" && (g = await Ot({ timeoutMs: u, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 }));
        } catch {
          g = null;
        }
        if (Array.isArray(g) && g.length)
          a = g;
        else {
          const h = typeof e.indexDepth == "number" ? e.indexDepth : 3, d = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, p = [];
          e && e.homePage && p.push(e.homePage), e && e.navigationPage && p.push(e.navigationPage), a = await Wt(e && e.contentBase ? e.contentBase : void 0, h, d, p.length ? p : void 0);
        }
      } catch (u) {
        mn("[runtimeSitemap] rebuild index failed", u), a = Array.isArray(re) && re.length ? re : [];
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
      const g = typeof e.indexDepth == "number" ? e.indexDepth : 3, h = Array.isArray(e.noIndexing) ? e.noIndexing : void 0;
      let d = null;
      try {
        const p = typeof globalThis < "u" && typeof globalThis.buildSearchIndexWorker == "function" ? globalThis.buildSearchIndexWorker : void 0;
        if (typeof p == "function")
          try {
            d = await p(e && e.contentBase ? e.contentBase : void 0, g, h);
          } catch {
            d = null;
          }
      } catch {
        d = null;
      }
      if ((!d || !d.length) && typeof Wt == "function")
        try {
          d = await Wt(e && e.contentBase ? e.contentBase : void 0, g, h, u.length ? u : void 0);
        } catch {
          d = null;
        }
      if (Array.isArray(d) && d.length) {
        const p = /* @__PURE__ */ new Map();
        try {
          for (const m of a)
            try {
              m && m.slug && p.set(String(m.slug), m);
            } catch {
            }
          for (const m of d)
            try {
              m && m.slug && p.set(String(m.slug), m);
            } catch {
            }
        } catch {
        }
        a = Array.from(p.values());
      }
    } catch (u) {
      try {
        mn("[runtimeSitemap] rebuild index call failed", u);
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
    const o = await yi(Object.assign({}, e, { index: a }));
    let l = [];
    try {
      const u = /* @__PURE__ */ new Set(), g = Array.isArray(o && o.entries) ? o.entries : [];
      for (const h of g)
        try {
          let d = null;
          if (h && h.slug) d = String(h.slug);
          else if (h && h.loc)
            try {
              d = new URL(String(h.loc)).searchParams.get("page");
            } catch {
            }
          if (!d) continue;
          const p = String(d).split("::")[0];
          if (!u.has(p)) {
            u.add(p);
            const m = Object.assign({}, h);
            m.baseSlug = p, l.push(m);
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
      let g = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (g = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (g > u) {
        try {
          et("[runtimeSitemap] skip RSS write: existing rendered sitemap larger", g, u);
        } catch {
        }
        return !0;
      }
      return Xn(c, "application/rss+xml"), !0;
    }
    if (i) {
      const u = Array.isArray(c && c.entries) ? c.entries.length : 0;
      let g = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (g = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (g > u) {
        try {
          et("[runtimeSitemap] skip Atom write: existing rendered sitemap larger", g, u);
        } catch {
        }
        return !0;
      }
      return Xn(c, "application/atom+xml"), !0;
    }
    if (t) {
      const u = Array.isArray(c && c.entries) ? c.entries.length : 0;
      let g = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (g = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (g > u) {
        try {
          et("[runtimeSitemap] skip XML write: existing rendered sitemap larger", g, u);
        } catch {
        }
        return !0;
      }
      return Xn(c, "application/xml"), !0;
    }
    if (r)
      try {
        const g = (Array.isArray(c && c.entries) ? c.entries : []).length;
        let h = -1;
        try {
          typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (h = window.__nimbiSitemapFinal.length);
        } catch {
        }
        if (h > g) {
          try {
            et("[runtimeSitemap] skip HTML write: existing rendered sitemap larger", h, g);
          } catch {
          }
          return !0;
        }
        return Xn(c, "text/html"), !0;
      } catch (u) {
        return mn("[runtimeSitemap] render HTML failed", u), !1;
      }
    return !1;
  } catch (t) {
    return mn("[runtimeSitemap] handleSitemapRequest failed", t), !1;
  }
}
async function pc(e = {}) {
  try {
    const t = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
    let n = [];
    try {
      if (typeof Ot == "function")
        try {
          const s = await Ot({ timeoutMs: t, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 });
          Array.isArray(s) && s.length && (n = s);
        } catch {
        }
    } catch {
    }
    (!Array.isArray(n) || !n.length) && Array.isArray(re) && re.length && (n = re), (!Array.isArray(n) || !n.length) && Array.isArray(e.index) && e.index.length && (n = e.index);
    const i = await yi(Object.assign({}, e, { index: n }));
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
            const g = Object.assign({}, l);
            g.baseSlug = u, r.push(g);
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
const Mn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  exposeSitemapGlobals: pc,
  generateAtomXml: Qr,
  generateRssXml: Xr,
  generateSitemapJson: yi,
  generateSitemapXml: Gr,
  handleSitemapRequest: gc
}, Symbol.toStringTag, { value: "Module" }));
export {
  ca as BAD_LANGUAGES,
  Ce as SUPPORTED_HLJS_MAP,
  wc as _clearHooks,
  Vr as addHook,
  xc as default,
  Ps as ensureBulma,
  hc as getVersion,
  xc as initCMS,
  fa as loadL10nFile,
  ua as loadSupportedLanguages,
  Rs as observeCodeBlocks,
  yc as onNavBuild,
  mc as onPageLoad,
  Tn as registerLanguage,
  Ri as runHooks,
  _c as setHighlightTheme,
  ga as setLang,
  Is as setStyle,
  kc as setThemeVars,
  yn as t,
  bc as transformHtml
};
