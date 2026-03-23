let cr = 0;
const ti = /* @__PURE__ */ Object.create(null);
function ni(e) {
  try {
    const t = Number(e);
    cr = Number.isFinite(t) && t >= 0 ? Math.max(0, Math.min(3, Math.floor(t))) : 0;
  } catch {
    cr = 0;
  }
}
function $t(e = 1) {
  try {
    return Number(cr) >= Number(e || 1);
  } catch {
    return !1;
  }
}
function xr() {
  return $t(1);
}
function In(...e) {
  try {
    $t(1) && console && typeof console.error == "function" && console.error(...e);
  } catch {
  }
}
function _(...e) {
  try {
    $t(2) && console && typeof console.warn == "function" && console.warn(...e);
  } catch {
  }
}
function Cn(...e) {
  try {
    $t(3) && console && typeof console.info == "function" && console.info(...e);
  } catch {
  }
}
function ut(...e) {
  try {
    $t(3) && console && typeof console.log == "function" && console.log(...e);
  } catch {
  }
}
function Ci(e) {
  try {
    if (!xr()) return;
    const t = String(e || "");
    if (!t) return;
    ti[t] = (ti[t] || 0) + 1;
  } catch {
  }
}
function Ti(e) {
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
const sn = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: []
};
function Sr(e, t) {
  if (!Object.prototype.hasOwnProperty.call(sn, e))
    throw new Error('Unknown hook "' + e + '"');
  if (typeof t != "function")
    throw new TypeError("hook callback must be a function");
  sn[e].push(t);
}
function kl(e) {
  Sr("onPageLoad", e);
}
function xl(e) {
  Sr("onNavBuild", e);
}
function Sl(e) {
  Sr("transformHtml", e);
}
async function ri(e, t) {
  const n = sn[e] || [];
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
function vl() {
  Object.keys(sn).forEach((e) => {
    sn[e].length = 0;
  });
}
function Pi(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var tr, ii;
function Ka() {
  if (ii) return tr;
  ii = 1;
  function e(x) {
    return x instanceof Map ? x.clear = x.delete = x.set = function() {
      throw new Error("map is read-only");
    } : x instanceof Set && (x.add = x.clear = x.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(x), Object.getOwnPropertyNames(x).forEach((R) => {
      const H = x[R], pe = typeof H;
      (pe === "object" || pe === "function") && !Object.isFrozen(H) && e(H);
    }), x;
  }
  class t {
    /**
     * @param {CompiledMode} mode
     */
    constructor(R) {
      R.data === void 0 && (R.data = {}), this.data = R.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  }
  function n(x) {
    return x.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function i(x, ...R) {
    const H = /* @__PURE__ */ Object.create(null);
    for (const pe in x)
      H[pe] = x[pe];
    return R.forEach(function(pe) {
      for (const Pe in pe)
        H[Pe] = pe[Pe];
    }), /** @type {T} */
    H;
  }
  const r = "</span>", a = (x) => !!x.scope, s = (x, { prefix: R }) => {
    if (x.startsWith("language:"))
      return x.replace("language:", "language-");
    if (x.includes(".")) {
      const H = x.split(".");
      return [
        `${R}${H.shift()}`,
        ...H.map((pe, Pe) => `${pe}${"_".repeat(Pe + 1)}`)
      ].join(" ");
    }
    return `${R}${x}`;
  };
  class l {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(R, H) {
      this.buffer = "", this.classPrefix = H.classPrefix, R.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(R) {
      this.buffer += n(R);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(R) {
      if (!a(R)) return;
      const H = s(
        R.scope,
        { prefix: this.classPrefix }
      );
      this.span(H);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(R) {
      a(R) && (this.buffer += r);
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
    span(R) {
      this.buffer += `<span class="${R}">`;
    }
  }
  const o = (x = {}) => {
    const R = { children: [] };
    return Object.assign(R, x), R;
  };
  class p {
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
    add(R) {
      this.top.children.push(R);
    }
    /** @param {string} scope */
    openNode(R) {
      const H = o({ scope: R });
      this.add(H), this.stack.push(H);
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
    walk(R) {
      return this.constructor._walk(R, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(R, H) {
      return typeof H == "string" ? R.addText(H) : H.children && (R.openNode(H), H.children.forEach((pe) => this._walk(R, pe)), R.closeNode(H)), R;
    }
    /**
     * @param {Node} node
     */
    static _collapse(R) {
      typeof R != "string" && R.children && (R.children.every((H) => typeof H == "string") ? R.children = [R.children.join("")] : R.children.forEach((H) => {
        p._collapse(H);
      }));
    }
  }
  class c extends p {
    /**
     * @param {*} options
     */
    constructor(R) {
      super(), this.options = R;
    }
    /**
     * @param {string} text
     */
    addText(R) {
      R !== "" && this.add(R);
    }
    /** @param {string} scope */
    startScope(R) {
      this.openNode(R);
    }
    endScope() {
      this.closeNode();
    }
    /**
     * @param {Emitter & {root: DataNode}} emitter
     * @param {string} name
     */
    __addSublanguage(R, H) {
      const pe = R.root;
      H && (pe.scope = `language:${H}`), this.add(pe);
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
    return x.map((H) => u(H)).join("");
  }
  function y(x) {
    const R = x[x.length - 1];
    return typeof R == "object" && R.constructor === Object ? (x.splice(x.length - 1, 1), R) : {};
  }
  function f(...x) {
    return "(" + (y(x).capture ? "" : "?:") + x.map((pe) => u(pe)).join("|") + ")";
  }
  function w(x) {
    return new RegExp(x.toString() + "|").exec("").length - 1;
  }
  function b(x, R) {
    const H = x && x.exec(R);
    return H && H.index === 0;
  }
  const k = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function S(x, { joinWith: R }) {
    let H = 0;
    return x.map((pe) => {
      H += 1;
      const Pe = H;
      let $e = u(pe), te = "";
      for (; $e.length > 0; ) {
        const V = k.exec($e);
        if (!V) {
          te += $e;
          break;
        }
        te += $e.substring(0, V.index), $e = $e.substring(V.index + V[0].length), V[0][0] === "\\" && V[1] ? te += "\\" + String(Number(V[1]) + Pe) : (te += V[0], V[0] === "(" && H++);
      }
      return te;
    }).map((pe) => `(${pe})`).join(R);
  }
  const v = /\b\B/, C = "[a-zA-Z]\\w*", U = "[a-zA-Z_]\\w*", z = "\\b\\d+(\\.\\d+)?", q = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", M = "\\b(0b[01]+)", $ = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", G = (x = {}) => {
    const R = /^#![ ]*\//;
    return x.binary && (x.begin = g(
      R,
      /.*\b/,
      x.binary,
      /\b.*/
    )), i({
      scope: "meta",
      begin: R,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (H, pe) => {
        H.index !== 0 && pe.ignoreMatch();
      }
    }, x);
  }, F = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, he = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [F]
  }, L = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [F]
  }, D = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, J = function(x, R, H = {}) {
    const pe = i(
      {
        scope: "comment",
        begin: x,
        end: R,
        contains: []
      },
      H
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
    const Pe = f(
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
          Pe,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), pe;
  }, ye = J("//", "$"), ee = J("/\\*", "\\*/"), ce = J("#", "$"), Se = {
    scope: "number",
    begin: z,
    relevance: 0
  }, E = {
    scope: "number",
    begin: q,
    relevance: 0
  }, N = {
    scope: "number",
    begin: M,
    relevance: 0
  }, P = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      F,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [F]
      }
    ]
  }, B = {
    scope: "title",
    begin: C,
    relevance: 0
  }, T = {
    scope: "title",
    begin: U,
    relevance: 0
  }, I = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + U,
    relevance: 0
  };
  var Y = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: he,
    BACKSLASH_ESCAPE: F,
    BINARY_NUMBER_MODE: N,
    BINARY_NUMBER_RE: M,
    COMMENT: J,
    C_BLOCK_COMMENT_MODE: ee,
    C_LINE_COMMENT_MODE: ye,
    C_NUMBER_MODE: E,
    C_NUMBER_RE: q,
    END_SAME_AS_BEGIN: function(x) {
      return Object.assign(
        x,
        {
          /** @type {ModeCallback} */
          "on:begin": (R, H) => {
            H.data._beginMatch = R[1];
          },
          /** @type {ModeCallback} */
          "on:end": (R, H) => {
            H.data._beginMatch !== R[1] && H.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: ce,
    IDENT_RE: C,
    MATCH_NOTHING_RE: v,
    METHOD_GUARD: I,
    NUMBER_MODE: Se,
    NUMBER_RE: z,
    PHRASAL_WORDS_MODE: D,
    QUOTE_STRING_MODE: L,
    REGEXP_MODE: P,
    RE_STARTERS_RE: $,
    SHEBANG: G,
    TITLE_MODE: B,
    UNDERSCORE_IDENT_RE: U,
    UNDERSCORE_TITLE_MODE: T
  });
  function X(x, R) {
    x.input[x.index - 1] === "." && R.ignoreMatch();
  }
  function re(x, R) {
    x.className !== void 0 && (x.scope = x.className, delete x.className);
  }
  function be(x, R) {
    R && x.beginKeywords && (x.begin = "\\b(" + x.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", x.__beforeBegin = X, x.keywords = x.keywords || x.beginKeywords, delete x.beginKeywords, x.relevance === void 0 && (x.relevance = 0));
  }
  function ue(x, R) {
    Array.isArray(x.illegal) && (x.illegal = f(...x.illegal));
  }
  function Q(x, R) {
    if (x.match) {
      if (x.begin || x.end) throw new Error("begin & end are not supported with match");
      x.begin = x.match, delete x.match;
    }
  }
  function ae(x, R) {
    x.relevance === void 0 && (x.relevance = 1);
  }
  const Oe = (x, R) => {
    if (!x.beforeMatch) return;
    if (x.starts) throw new Error("beforeMatch cannot be used with starts");
    const H = Object.assign({}, x);
    Object.keys(x).forEach((pe) => {
      delete x[pe];
    }), x.keywords = H.keywords, x.begin = g(H.beforeMatch, h(H.begin)), x.starts = {
      relevance: 0,
      contains: [
        Object.assign(H, { endsParent: !0 })
      ]
    }, x.relevance = 0, delete H.beforeMatch;
  }, Qe = [
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
  ], Je = "keyword";
  function yn(x, R, H = Je) {
    const pe = /* @__PURE__ */ Object.create(null);
    return typeof x == "string" ? Pe(H, x.split(" ")) : Array.isArray(x) ? Pe(H, x) : Object.keys(x).forEach(function($e) {
      Object.assign(
        pe,
        yn(x[$e], R, $e)
      );
    }), pe;
    function Pe($e, te) {
      R && (te = te.map((V) => V.toLowerCase())), te.forEach(function(V) {
        const de = V.split("|");
        pe[de[0]] = [$e, ka(de[0], de[1])];
      });
    }
  }
  function ka(x, R) {
    return R ? Number(R) : xa(x) ? 0 : 1;
  }
  function xa(x) {
    return Qe.includes(x.toLowerCase());
  }
  const Dr = {}, St = (x) => {
    console.error(x);
  }, jr = (x, ...R) => {
    console.log(`WARN: ${x}`, ...R);
  }, zt = (x, R) => {
    Dr[`${x}/${R}`] || (console.log(`Deprecated as of ${x}. ${R}`), Dr[`${x}/${R}`] = !0);
  }, bn = new Error();
  function Hr(x, R, { key: H }) {
    let pe = 0;
    const Pe = x[H], $e = {}, te = {};
    for (let V = 1; V <= R.length; V++)
      te[V + pe] = Pe[V], $e[V + pe] = !0, pe += w(R[V - 1]);
    x[H] = te, x[H]._emit = $e, x[H]._multi = !0;
  }
  function Sa(x) {
    if (Array.isArray(x.begin)) {
      if (x.skip || x.excludeBegin || x.returnBegin)
        throw St("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), bn;
      if (typeof x.beginScope != "object" || x.beginScope === null)
        throw St("beginScope must be object"), bn;
      Hr(x, x.begin, { key: "beginScope" }), x.begin = S(x.begin, { joinWith: "" });
    }
  }
  function va(x) {
    if (Array.isArray(x.end)) {
      if (x.skip || x.excludeEnd || x.returnEnd)
        throw St("skip, excludeEnd, returnEnd not compatible with endScope: {}"), bn;
      if (typeof x.endScope != "object" || x.endScope === null)
        throw St("endScope must be object"), bn;
      Hr(x, x.end, { key: "endScope" }), x.end = S(x.end, { joinWith: "" });
    }
  }
  function Aa(x) {
    x.scope && typeof x.scope == "object" && x.scope !== null && (x.beginScope = x.scope, delete x.scope);
  }
  function Ea(x) {
    Aa(x), typeof x.beginScope == "string" && (x.beginScope = { _wrap: x.beginScope }), typeof x.endScope == "string" && (x.endScope = { _wrap: x.endScope }), Sa(x), va(x);
  }
  function La(x) {
    function R(te, V) {
      return new RegExp(
        u(te),
        "m" + (x.case_insensitive ? "i" : "") + (x.unicodeRegex ? "u" : "") + (V ? "g" : "")
      );
    }
    class H {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(V, de) {
        de.position = this.position++, this.matchIndexes[this.matchAt] = de, this.regexes.push([de, V]), this.matchAt += w(V) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const V = this.regexes.map((de) => de[1]);
        this.matcherRe = R(S(V, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(V) {
        this.matcherRe.lastIndex = this.lastIndex;
        const de = this.matcherRe.exec(V);
        if (!de)
          return null;
        const qe = de.findIndex((jt, Xn) => Xn > 0 && jt !== void 0), Ie = this.matchIndexes[qe];
        return de.splice(0, qe), Object.assign(de, Ie);
      }
    }
    class pe {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(V) {
        if (this.multiRegexes[V]) return this.multiRegexes[V];
        const de = new H();
        return this.rules.slice(V).forEach(([qe, Ie]) => de.addRule(qe, Ie)), de.compile(), this.multiRegexes[V] = de, de;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(V, de) {
        this.rules.push([V, de]), de.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(V) {
        const de = this.getMatcher(this.regexIndex);
        de.lastIndex = this.lastIndex;
        let qe = de.exec(V);
        if (this.resumingScanAtSamePosition() && !(qe && qe.index === this.lastIndex)) {
          const Ie = this.getMatcher(0);
          Ie.lastIndex = this.lastIndex + 1, qe = Ie.exec(V);
        }
        return qe && (this.regexIndex += qe.position + 1, this.regexIndex === this.count && this.considerAll()), qe;
      }
    }
    function Pe(te) {
      const V = new pe();
      return te.contains.forEach((de) => V.addRule(de.begin, { rule: de, type: "begin" })), te.terminatorEnd && V.addRule(te.terminatorEnd, { type: "end" }), te.illegal && V.addRule(te.illegal, { type: "illegal" }), V;
    }
    function $e(te, V) {
      const de = (
        /** @type CompiledMode */
        te
      );
      if (te.isCompiled) return de;
      [
        re,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        Q,
        Ea,
        Oe
      ].forEach((Ie) => Ie(te, V)), x.compilerExtensions.forEach((Ie) => Ie(te, V)), te.__beforeBegin = null, [
        be,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        ue,
        // default to 1 relevance if not specified
        ae
      ].forEach((Ie) => Ie(te, V)), te.isCompiled = !0;
      let qe = null;
      return typeof te.keywords == "object" && te.keywords.$pattern && (te.keywords = Object.assign({}, te.keywords), qe = te.keywords.$pattern, delete te.keywords.$pattern), qe = qe || /\w+/, te.keywords && (te.keywords = yn(te.keywords, x.case_insensitive)), de.keywordPatternRe = R(qe, !0), V && (te.begin || (te.begin = /\B|\b/), de.beginRe = R(de.begin), !te.end && !te.endsWithParent && (te.end = /\B|\b/), te.end && (de.endRe = R(de.end)), de.terminatorEnd = u(de.end) || "", te.endsWithParent && V.terminatorEnd && (de.terminatorEnd += (te.end ? "|" : "") + V.terminatorEnd)), te.illegal && (de.illegalRe = R(
        /** @type {RegExp | string} */
        te.illegal
      )), te.contains || (te.contains = []), te.contains = [].concat(...te.contains.map(function(Ie) {
        return Ma(Ie === "self" ? te : Ie);
      })), te.contains.forEach(function(Ie) {
        $e(
          /** @type Mode */
          Ie,
          de
        );
      }), te.starts && $e(te.starts, V), de.matcher = Pe(de), de;
    }
    if (x.compilerExtensions || (x.compilerExtensions = []), x.contains && x.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return x.classNameAliases = i(x.classNameAliases || {}), $e(
      /** @type Mode */
      x
    );
  }
  function Ur(x) {
    return x ? x.endsWithParent || Ur(x.starts) : !1;
  }
  function Ma(x) {
    return x.variants && !x.cachedVariants && (x.cachedVariants = x.variants.map(function(R) {
      return i(x, { variants: null }, R);
    })), x.cachedVariants ? x.cachedVariants : Ur(x) ? i(x, { starts: x.starts ? i(x.starts) : null }) : Object.isFrozen(x) ? i(x) : x;
  }
  var Ra = "11.11.1";
  class Ca extends Error {
    constructor(R, H) {
      super(R), this.name = "HTMLInjectionError", this.html = H;
    }
  }
  const Qn = n, Fr = i, Wr = /* @__PURE__ */ Symbol("nomatch"), Ta = 7, Zr = function(x) {
    const R = /* @__PURE__ */ Object.create(null), H = /* @__PURE__ */ Object.create(null), pe = [];
    let Pe = !0;
    const $e = "Could not find the language '{}', did you forget to load/include a language module?", te = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let V = {
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
    function de(O) {
      return V.noHighlightRe.test(O);
    }
    function qe(O) {
      let se = O.className + " ";
      se += O.parentNode ? O.parentNode.className : "";
      const xe = V.languageDetectRe.exec(se);
      if (xe) {
        const Re = pt(xe[1]);
        return Re || (jr($e.replace("{}", xe[1])), jr("Falling back to no-highlight mode for this block.", O)), Re ? xe[1] : "no-highlight";
      }
      return se.split(/\s+/).find((Re) => de(Re) || pt(Re));
    }
    function Ie(O, se, xe) {
      let Re = "", Ne = "";
      typeof se == "object" ? (Re = O, xe = se.ignoreIllegals, Ne = se.language) : (zt("10.7.0", "highlight(lang, code, ...args) has been deprecated."), zt("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), Ne = O, Re = se), xe === void 0 && (xe = !0);
      const it = {
        code: Re,
        language: Ne
      };
      _n("before:highlight", it);
      const gt = it.result ? it.result : jt(it.language, it.code, xe);
      return gt.code = it.code, _n("after:highlight", gt), gt;
    }
    function jt(O, se, xe, Re) {
      const Ne = /* @__PURE__ */ Object.create(null);
      function it(W, ie) {
        return W.keywords[ie];
      }
      function gt() {
        if (!ge.keywords) {
          De.addText(Ce);
          return;
        }
        let W = 0;
        ge.keywordPatternRe.lastIndex = 0;
        let ie = ge.keywordPatternRe.exec(Ce), me = "";
        for (; ie; ) {
          me += Ce.substring(W, ie.index);
          const Le = ot.case_insensitive ? ie[0].toLowerCase() : ie[0], je = it(ge, Le);
          if (je) {
            const [dt, Qa] = je;
            if (De.addText(me), me = "", Ne[Le] = (Ne[Le] || 0) + 1, Ne[Le] <= Ta && (Sn += Qa), dt.startsWith("_"))
              me += ie[0];
            else {
              const Xa = ot.classNameAliases[dt] || dt;
              st(ie[0], Xa);
            }
          } else
            me += ie[0];
          W = ge.keywordPatternRe.lastIndex, ie = ge.keywordPatternRe.exec(Ce);
        }
        me += Ce.substring(W), De.addText(me);
      }
      function kn() {
        if (Ce === "") return;
        let W = null;
        if (typeof ge.subLanguage == "string") {
          if (!R[ge.subLanguage]) {
            De.addText(Ce);
            return;
          }
          W = jt(ge.subLanguage, Ce, !0, ei[ge.subLanguage]), ei[ge.subLanguage] = /** @type {CompiledMode} */
          W._top;
        } else
          W = Kn(Ce, ge.subLanguage.length ? ge.subLanguage : null);
        ge.relevance > 0 && (Sn += W.relevance), De.__addSublanguage(W._emitter, W.language);
      }
      function Xe() {
        ge.subLanguage != null ? kn() : gt(), Ce = "";
      }
      function st(W, ie) {
        W !== "" && (De.startScope(ie), De.addText(W), De.endScope());
      }
      function Kr(W, ie) {
        let me = 1;
        const Le = ie.length - 1;
        for (; me <= Le; ) {
          if (!W._emit[me]) {
            me++;
            continue;
          }
          const je = ot.classNameAliases[W[me]] || W[me], dt = ie[me];
          je ? st(dt, je) : (Ce = dt, gt(), Ce = ""), me++;
        }
      }
      function Vr(W, ie) {
        return W.scope && typeof W.scope == "string" && De.openNode(ot.classNameAliases[W.scope] || W.scope), W.beginScope && (W.beginScope._wrap ? (st(Ce, ot.classNameAliases[W.beginScope._wrap] || W.beginScope._wrap), Ce = "") : W.beginScope._multi && (Kr(W.beginScope, ie), Ce = "")), ge = Object.create(W, { parent: { value: ge } }), ge;
      }
      function Yr(W, ie, me) {
        let Le = b(W.endRe, me);
        if (Le) {
          if (W["on:end"]) {
            const je = new t(W);
            W["on:end"](ie, je), je.isMatchIgnored && (Le = !1);
          }
          if (Le) {
            for (; W.endsParent && W.parent; )
              W = W.parent;
            return W;
          }
        }
        if (W.endsWithParent)
          return Yr(W.parent, ie, me);
      }
      function Ua(W) {
        return ge.matcher.regexIndex === 0 ? (Ce += W[0], 1) : (er = !0, 0);
      }
      function Fa(W) {
        const ie = W[0], me = W.rule, Le = new t(me), je = [me.__beforeBegin, me["on:begin"]];
        for (const dt of je)
          if (dt && (dt(W, Le), Le.isMatchIgnored))
            return Ua(ie);
        return me.skip ? Ce += ie : (me.excludeBegin && (Ce += ie), Xe(), !me.returnBegin && !me.excludeBegin && (Ce = ie)), Vr(me, W), me.returnBegin ? 0 : ie.length;
      }
      function Wa(W) {
        const ie = W[0], me = se.substring(W.index), Le = Yr(ge, W, me);
        if (!Le)
          return Wr;
        const je = ge;
        ge.endScope && ge.endScope._wrap ? (Xe(), st(ie, ge.endScope._wrap)) : ge.endScope && ge.endScope._multi ? (Xe(), Kr(ge.endScope, W)) : je.skip ? Ce += ie : (je.returnEnd || je.excludeEnd || (Ce += ie), Xe(), je.excludeEnd && (Ce = ie));
        do
          ge.scope && De.closeNode(), !ge.skip && !ge.subLanguage && (Sn += ge.relevance), ge = ge.parent;
        while (ge !== Le.parent);
        return Le.starts && Vr(Le.starts, W), je.returnEnd ? 0 : ie.length;
      }
      function Za() {
        const W = [];
        for (let ie = ge; ie !== ot; ie = ie.parent)
          ie.scope && W.unshift(ie.scope);
        W.forEach((ie) => De.openNode(ie));
      }
      let xn = {};
      function Jr(W, ie) {
        const me = ie && ie[0];
        if (Ce += W, me == null)
          return Xe(), 0;
        if (xn.type === "begin" && ie.type === "end" && xn.index === ie.index && me === "") {
          if (Ce += se.slice(ie.index, ie.index + 1), !Pe) {
            const Le = new Error(`0 width match regex (${O})`);
            throw Le.languageName = O, Le.badRule = xn.rule, Le;
          }
          return 1;
        }
        if (xn = ie, ie.type === "begin")
          return Fa(ie);
        if (ie.type === "illegal" && !xe) {
          const Le = new Error('Illegal lexeme "' + me + '" for mode "' + (ge.scope || "<unnamed>") + '"');
          throw Le.mode = ge, Le;
        } else if (ie.type === "end") {
          const Le = Wa(ie);
          if (Le !== Wr)
            return Le;
        }
        if (ie.type === "illegal" && me === "")
          return Ce += `
`, 1;
        if (Jn > 1e5 && Jn > ie.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return Ce += me, me.length;
      }
      const ot = pt(O);
      if (!ot)
        throw St($e.replace("{}", O)), new Error('Unknown language: "' + O + '"');
      const Ga = La(ot);
      let Yn = "", ge = Re || Ga;
      const ei = {}, De = new V.__emitter(V);
      Za();
      let Ce = "", Sn = 0, vt = 0, Jn = 0, er = !1;
      try {
        if (ot.__emitTokens)
          ot.__emitTokens(se, De);
        else {
          for (ge.matcher.considerAll(); ; ) {
            Jn++, er ? er = !1 : ge.matcher.considerAll(), ge.matcher.lastIndex = vt;
            const W = ge.matcher.exec(se);
            if (!W) break;
            const ie = se.substring(vt, W.index), me = Jr(ie, W);
            vt = W.index + me;
          }
          Jr(se.substring(vt));
        }
        return De.finalize(), Yn = De.toHTML(), {
          language: O,
          value: Yn,
          relevance: Sn,
          illegal: !1,
          _emitter: De,
          _top: ge
        };
      } catch (W) {
        if (W.message && W.message.includes("Illegal"))
          return {
            language: O,
            value: Qn(se),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: W.message,
              index: vt,
              context: se.slice(vt - 100, vt + 100),
              mode: W.mode,
              resultSoFar: Yn
            },
            _emitter: De
          };
        if (Pe)
          return {
            language: O,
            value: Qn(se),
            illegal: !1,
            relevance: 0,
            errorRaised: W,
            _emitter: De,
            _top: ge
          };
        throw W;
      }
    }
    function Xn(O) {
      const se = {
        value: Qn(O),
        illegal: !1,
        relevance: 0,
        _top: te,
        _emitter: new V.__emitter(V)
      };
      return se._emitter.addText(O), se;
    }
    function Kn(O, se) {
      se = se || V.languages || Object.keys(R);
      const xe = Xn(O), Re = se.filter(pt).filter(Xr).map(
        (Xe) => jt(Xe, O, !1)
      );
      Re.unshift(xe);
      const Ne = Re.sort((Xe, st) => {
        if (Xe.relevance !== st.relevance) return st.relevance - Xe.relevance;
        if (Xe.language && st.language) {
          if (pt(Xe.language).supersetOf === st.language)
            return 1;
          if (pt(st.language).supersetOf === Xe.language)
            return -1;
        }
        return 0;
      }), [it, gt] = Ne, kn = it;
      return kn.secondBest = gt, kn;
    }
    function Pa(O, se, xe) {
      const Re = se && H[se] || xe;
      O.classList.add("hljs"), O.classList.add(`language-${Re}`);
    }
    function Vn(O) {
      let se = null;
      const xe = qe(O);
      if (de(xe)) return;
      if (_n(
        "before:highlightElement",
        { el: O, language: xe }
      ), O.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", O);
        return;
      }
      if (O.children.length > 0 && (V.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(O)), V.throwUnescapedHTML))
        throw new Ca(
          "One of your code blocks includes unescaped HTML.",
          O.innerHTML
        );
      se = O;
      const Re = se.textContent, Ne = xe ? Ie(Re, { language: xe, ignoreIllegals: !0 }) : Kn(Re);
      O.innerHTML = Ne.value, O.dataset.highlighted = "yes", Pa(O, xe, Ne.language), O.result = {
        language: Ne.language,
        // TODO: remove with version 11.0
        re: Ne.relevance,
        relevance: Ne.relevance
      }, Ne.secondBest && (O.secondBest = {
        language: Ne.secondBest.language,
        relevance: Ne.secondBest.relevance
      }), _n("after:highlightElement", { el: O, result: Ne, text: Re });
    }
    function $a(O) {
      V = Fr(V, O);
    }
    const za = () => {
      wn(), zt("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Ia() {
      wn(), zt("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let Gr = !1;
    function wn() {
      function O() {
        wn();
      }
      if (document.readyState === "loading") {
        Gr || window.addEventListener("DOMContentLoaded", O, !1), Gr = !0;
        return;
      }
      document.querySelectorAll(V.cssSelector).forEach(Vn);
    }
    function Oa(O, se) {
      let xe = null;
      try {
        xe = se(x);
      } catch (Re) {
        if (St("Language definition for '{}' could not be registered.".replace("{}", O)), Pe)
          St(Re);
        else
          throw Re;
        xe = te;
      }
      xe.name || (xe.name = O), R[O] = xe, xe.rawDefinition = se.bind(null, x), xe.aliases && Qr(xe.aliases, { languageName: O });
    }
    function Na(O) {
      delete R[O];
      for (const se of Object.keys(H))
        H[se] === O && delete H[se];
    }
    function Ba() {
      return Object.keys(R);
    }
    function pt(O) {
      return O = (O || "").toLowerCase(), R[O] || R[H[O]];
    }
    function Qr(O, { languageName: se }) {
      typeof O == "string" && (O = [O]), O.forEach((xe) => {
        H[xe.toLowerCase()] = se;
      });
    }
    function Xr(O) {
      const se = pt(O);
      return se && !se.disableAutodetect;
    }
    function qa(O) {
      O["before:highlightBlock"] && !O["before:highlightElement"] && (O["before:highlightElement"] = (se) => {
        O["before:highlightBlock"](
          Object.assign({ block: se.el }, se)
        );
      }), O["after:highlightBlock"] && !O["after:highlightElement"] && (O["after:highlightElement"] = (se) => {
        O["after:highlightBlock"](
          Object.assign({ block: se.el }, se)
        );
      });
    }
    function Da(O) {
      qa(O), pe.push(O);
    }
    function ja(O) {
      const se = pe.indexOf(O);
      se !== -1 && pe.splice(se, 1);
    }
    function _n(O, se) {
      const xe = O;
      pe.forEach(function(Re) {
        Re[xe] && Re[xe](se);
      });
    }
    function Ha(O) {
      return zt("10.7.0", "highlightBlock will be removed entirely in v12.0"), zt("10.7.0", "Please use highlightElement now."), Vn(O);
    }
    Object.assign(x, {
      highlight: Ie,
      highlightAuto: Kn,
      highlightAll: wn,
      highlightElement: Vn,
      // TODO: Remove with v12 API
      highlightBlock: Ha,
      configure: $a,
      initHighlighting: za,
      initHighlightingOnLoad: Ia,
      registerLanguage: Oa,
      unregisterLanguage: Na,
      listLanguages: Ba,
      getLanguage: pt,
      registerAliases: Qr,
      autoDetection: Xr,
      inherit: Fr,
      addPlugin: Da,
      removePlugin: ja
    }), x.debugMode = function() {
      Pe = !1;
    }, x.safeMode = function() {
      Pe = !0;
    }, x.versionString = Ra, x.regex = {
      concat: g,
      lookahead: h,
      either: f,
      optional: d,
      anyNumberOfTimes: m
    };
    for (const O in Y)
      typeof Y[O] == "object" && e(Y[O]);
    return Object.assign(x, Y), x;
  }, It = Zr({});
  return It.newInstance = () => Zr({}), tr = It, It.HighlightJS = It, It.default = It, tr;
}
var Va = /* @__PURE__ */ Ka();
const Ee = /* @__PURE__ */ Pi(Va), Ya = "11.11.1", _e = /* @__PURE__ */ new Map(), Ja = "https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md", Ve = {
  shell: "bash",
  sh: "bash",
  zsh: "bash",
  js: "javascript",
  ts: "typescript",
  py: "python",
  csharp: "cs",
  "c#": "cs"
};
Ve.html = "xml";
Ve.xhtml = "xml";
Ve.markup = "xml";
const $i = /* @__PURE__ */ new Set(["magic", "undefined"]);
let wt = null;
const nr = /* @__PURE__ */ new Map(), es = 300 * 1e3;
async function zi(e = Ja) {
  if (e)
    return wt || (wt = (async () => {
      try {
        const t = await fetch(e);
        if (!t.ok) return;
        const i = (await t.text()).split(/\r?\n/);
        let r = -1;
        for (let p = 0; p < i.length; p++)
          if (/\|\s*Language\s*\|/i.test(i[p])) {
            r = p;
            break;
          }
        if (r === -1) return;
        const a = i[r].replace(/^\||\|$/g, "").split("|").map((p) => p.trim().toLowerCase());
        let s = a.findIndex((p) => /alias|aliases|equivalent|alt|alternates?/i.test(p));
        s === -1 && (s = 1);
        let l = a.findIndex((p) => /file|filename|module|module name|module-name|short|slug/i.test(p));
        if (l === -1) {
          const p = a.findIndex((c) => /language/i.test(c));
          l = p !== -1 ? p : 0;
        }
        let o = [];
        for (let p = r + 1; p < i.length; p++) {
          const c = i[p].trim();
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
            const y = String(g).split(",").map((f) => f.replace(/`/g, "").trim()).filter(Boolean);
            if (y.length) {
              const w = y[0].toLowerCase().replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
              w && /[a-z0-9]/i.test(w) && (_e.set(w, w), o.push(w));
            }
          }
        }
        try {
          const p = [];
          for (const c of o) {
            const u = String(c || "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
            u && /[a-z0-9]/i.test(u) ? p.push(u) : _e.delete(c);
          }
          o = p;
        } catch (p) {
          _("[codeblocksManager] cleanup aliases failed", p);
        }
        try {
          let p = 0;
          for (const c of Array.from(_e.keys())) {
            if (!c || /^-+$/.test(c) || !/[a-z0-9]/i.test(c)) {
              _e.delete(c), p++;
              continue;
            }
            if (/^[:]+/.test(c)) {
              const u = c.replace(/^[:]+/, "");
              if (u && /[a-z0-9]/i.test(u)) {
                const h = _e.get(c);
                _e.delete(c), _e.set(u, h);
              } else
                _e.delete(c), p++;
            }
          }
          for (const [c, u] of Array.from(_e.entries()))
            (!u || /^-+$/.test(u) || !/[a-z0-9]/i.test(u)) && (_e.delete(c), p++);
          try {
            const c = ":---------------------";
            _e.has(c) && (_e.delete(c), p++);
          } catch (c) {
            _("[codeblocksManager] remove sep key failed", c);
          }
          try {
            const c = Array.from(_e.keys()).sort();
          } catch (c) {
            _("[codeblocksManager] compute supported keys failed", c);
          }
        } catch (p) {
          _("[codeblocksManager] ignored error", p);
        }
      } catch (t) {
        _("[codeblocksManager] loadSupportedLanguages failed", t);
      }
    })(), wt);
}
const Ht = /* @__PURE__ */ new Set();
async function on(e, t) {
  if (wt || (async () => {
    try {
      await zi();
    } catch (r) {
      _("[codeblocksManager] loadSupportedLanguages (IIFE) failed", r);
    }
  })(), wt)
    try {
      await wt;
    } catch {
    }
  if (e = e == null ? "" : String(e), e = e.trim(), !e) return !1;
  const n = e.toLowerCase();
  if ($i.has(n)) return !1;
  if (_e.size && !_e.has(n)) {
    const r = Ve;
    if (!r[n] && !r[e])
      return !1;
  }
  if (Ht.has(e)) return !0;
  const i = Ve;
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
      const u = Ve[c];
      return !!(u && _e.has(u));
    }));
    let o = null, p = null;
    for (const c of l)
      try {
        const u = Date.now();
        let h = nr.get(c);
        if (h && h.ok === !1 && u - (h.ts || 0) >= es && (nr.delete(c), h = void 0), h) {
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
          nr.set(c, m), m.promise = (async () => {
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
            return Ee.registerLanguage(d, m), Ht.add(d), d !== e && (Ee.registerLanguage(e, m), Ht.add(e)), !0;
          } catch (d) {
            p = d;
          }
        } else
          try {
            if (_e.has(c) || _e.has(e)) {
              const m = () => ({});
              try {
                Ee.registerLanguage(c, m), Ht.add(c);
              } catch {
              }
              try {
                c !== e && (Ee.registerLanguage(e, m), Ht.add(e));
              } catch {
              }
              return !0;
            }
          } catch {
          }
      } catch (u) {
        p = u;
      }
    if (p)
      throw p;
    return !1;
  } catch {
    return !1;
  }
}
let vn = null;
function ts(e = document) {
  wt || (async () => {
    try {
      await zi();
    } catch (a) {
      _("[codeblocksManager] loadSupportedLanguages (observer) failed", a);
    }
  })();
  const t = Ve, i = vn || (typeof IntersectionObserver > "u" ? null : (vn = new IntersectionObserver((a, s) => {
    a.forEach((l) => {
      if (!l.isIntersecting) return;
      const o = l.target;
      try {
        s.unobserve(o);
      } catch (p) {
        _("[codeblocksManager] observer unobserve failed", p);
      }
      (async () => {
        try {
          const p = o.getAttribute && o.getAttribute("class") || o.className || "", c = p.match(/language-([a-zA-Z0-9_+-]+)/) || p.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (c && c[1]) {
            const u = (c[1] || "").toLowerCase(), h = t[u] || u, m = _e.size && (_e.get(h) || _e.get(String(h).toLowerCase())) || h;
            try {
              await on(m);
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
              Ee.highlightElement(o);
            } catch (d) {
              _("[codeblocksManager] hljs.highlightElement failed", d);
            }
          } else
            try {
              const u = o.textContent || "";
              try {
                if (Ee && typeof Ee.getLanguage == "function" && Ee.getLanguage("plaintext")) {
                  const h = Ee.highlight(u, { language: "plaintext" });
                  h && h.value && (o.innerHTML = h.value);
                }
              } catch {
                try {
                  Ee.highlightElement(o);
                } catch (m) {
                  _("[codeblocksManager] fallback highlightElement failed", m);
                }
              }
            } catch (u) {
              _("[codeblocksManager] auto-detect plaintext failed", u);
            }
        } catch (p) {
          _("[codeblocksManager] observer entry processing failed", p);
        }
      })();
    });
  }, { root: null, rootMargin: "300px", threshold: 0.1 }), vn)), r = e && e.querySelectorAll ? e.querySelectorAll("pre code") : [];
  if (!i) {
    r.forEach(async (a) => {
      try {
        const s = a.getAttribute && a.getAttribute("class") || a.className || "", l = s.match(/language-([a-zA-Z0-9_+-]+)/) || s.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (l && l[1]) {
          const o = (l[1] || "").toLowerCase(), p = t[o] || o, c = _e.size && (_e.get(p) || _e.get(String(p).toLowerCase())) || p;
          try {
            await on(c);
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
          Ee.highlightElement(a);
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
function Al(e, { useCdn: t = !0 } = {}) {
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
  const s = a, l = `https://cdn.jsdelivr.net/npm/highlight.js@${Ya}/styles/${s}.css`, o = document.createElement("link");
  o.rel = "stylesheet", o.href = l, o.setAttribute("data-hl-theme", s), o.addEventListener("load", () => {
    try {
      n && n.parentNode && n.parentNode.removeChild(n);
    } catch {
    }
  }), document.head.appendChild(o);
}
let At = "light";
function ns(e, t = {}) {
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
function ai() {
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
async function rs(e = "none", t = "/") {
  try {
    ut("[bulmaManager] ensureBulma called", { bulmaCustomize: e, pageDir: t });
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
    if (ai(), document.querySelector("style[data-bulma-override]")) return;
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
    ai();
    const a = `https://unpkg.com/bulmaswatch/${encodeURIComponent(r)}/bulmaswatch.min.css`;
    ns(a, { "data-bulmaswatch-theme": r });
  } catch (r) {
    _("[bulmaManager] ensureBulma failed", r);
  }
}
function is(e) {
  At = e === "dark" ? "dark" : e === "system" ? "system" : "light";
  try {
    const t = Array.from(document.querySelectorAll(".nimbi-mount"));
    if (t.length > 0)
      for (const n of t)
        At === "dark" ? n.setAttribute("data-theme", "dark") : At === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    else {
      const n = document.documentElement;
      At === "dark" ? n.setAttribute("data-theme", "dark") : At === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    }
  } catch {
  }
}
function El(e) {
  const t = document.documentElement;
  for (const [n, i] of Object.entries(e || {}))
    try {
      t.style.setProperty(`--${n}`, i);
    } catch (r) {
      _("[bulmaManager] setThemeVars failed for", n, r);
    }
}
function Ii(e) {
  if (!e || !(e instanceof HTMLElement)) return () => {
  };
  const t = e.closest && e.closest(".nimbi-mount") || null;
  try {
    t && (At === "dark" ? t.setAttribute("data-theme", "dark") : At === "light" ? t.setAttribute("data-theme", "light") : t.removeAttribute("data-theme"));
  } catch {
  }
  return () => {
  };
}
const Oi = {
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
}, Nt = JSON.parse(JSON.stringify(Oi));
let On = "en";
if (typeof navigator < "u") {
  const e = navigator.language || navigator.languages && navigator.languages[0] || "en";
  On = String(e).split("-")[0].toLowerCase();
}
Oi[On] || (On = "en");
let kt = On;
function Zt(e, t = {}) {
  const n = Nt[kt] || Nt.en;
  let i = n && n[e] ? n[e] : Nt.en[e] || "";
  for (const r of Object.keys(t))
    i = i.replace(new RegExp(`{${r}}`, "g"), String(t[r]));
  return i;
}
async function Ni(e, t) {
  if (!e) return;
  let n = e;
  try {
    /^https?:\/\//.test(e) || (n = new URL(e, location.origin + t).toString());
    const i = await fetch(n);
    if (!i.ok) return;
    const r = await i.json();
    for (const a of Object.keys(r || {}))
      Nt[a] = Object.assign({}, Nt[a] || {}, r[a]);
  } catch {
  }
}
function Bi(e) {
  const t = String(e).split("-")[0].toLowerCase();
  kt = Nt[t] ? t : "en";
}
const as = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get currentLang() {
    return kt;
  },
  loadL10nFile: Ni,
  setLang: Bi,
  t: Zt
}, Symbol.toStringTag, { value: "Module" }));
function ss(e) {
  try {
    return String(e || "").split("/").map((t) => encodeURIComponent(t)).join("/");
  } catch {
    return String(e || "");
  }
}
function si(e, t = null, n = void 0) {
  let r = "#/" + ss(String(e || ""));
  t && (r += "#" + encodeURIComponent(String(t)));
  try {
    let a = "";
    if (typeof n == "string")
      a = n;
    else if (typeof location < "u" && location && location.search)
      a = location.search;
    else if (typeof location < "u" && location && location.hash)
      try {
        const s = Ye(location.href);
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
function Ye(e) {
  try {
    const t = new URL(e, typeof location < "u" ? location.href : "http://localhost/"), n = t.searchParams.get("page");
    if (n) {
      let r = null, a = "";
      if (t.hash) {
        const p = t.hash.replace(/^#/, "");
        if (p.includes("&")) {
          const c = p.split("&");
          r = c.shift() || null, a = c.join("&");
        } else
          r = p || null;
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
        const p = r.split("?");
        r = p.shift() || "", a = p.join("?") || "";
      }
      let s = r, l = null;
      if (s.indexOf("#") !== -1) {
        const p = s.split("#");
        s = p.shift() || "", l = p.join("#") || null;
      }
      return { type: "cosmetic", page: s.replace(/^\/+/, "") || null, anchor: l, params: a };
    }
    return { type: "path", page: (t.pathname || "").replace(/^\//, "") || null, anchor: t.hash ? t.hash.replace(/^#/, "") : null, params: t.search ? t.search.replace(/^\?/, "") : "" };
  } catch {
    return { type: "unknown", page: e, anchor: null, params: "" };
  }
}
const os = `/**
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
function ls(e, t = "worker") {
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
          } catch (p) {
            i("[" + t + "] worker termination failed", p);
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
  function s(o, p = 1e4) {
    return new Promise((c, u) => {
      const h = r();
      if (!h) return u(new Error("worker unavailable"));
      const m = String(Math.random()), d = Object.assign({}, o, { id: m });
      let g = null;
      const y = () => {
        g && clearTimeout(g), h.removeEventListener("message", f), h.removeEventListener("error", w);
      }, f = (b) => {
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
      }, p), h.addEventListener("message", f), h.addEventListener("error", w);
      try {
        h.postMessage(d);
      } catch (b) {
        y(), u(b);
      }
    });
  }
  return { get: r, send: s, terminate: a };
}
function qi(e, t = "worker-pool", n = 2) {
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
  const l = new Array(n).fill(0), o = new Array(n).fill(null), p = 30 * 1e3;
  function c(d) {
    try {
      l[d] = Date.now(), o[d] && (clearTimeout(o[d]), o[d] = null), o[d] = setTimeout(() => {
        try {
          i[d] && (i[d].terminate && i[d].terminate(), i[d] = null);
        } catch (g) {
          a("[" + t + "] idle termination failed", g);
        }
        o[d] = null;
      }, p);
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
    return new Promise((y, f) => {
      const w = r++ % i.length, b = (k) => {
        const S = (w + k) % i.length, v = s(S);
        if (!v)
          return k + 1 < i.length ? b(k + 1) : f(new Error("worker pool unavailable"));
        const C = String(Math.random()), U = Object.assign({}, d, { id: C });
        let z = null;
        const q = () => {
          z && clearTimeout(z), v.removeEventListener("message", M), v.removeEventListener("error", $);
        }, M = (G) => {
          const F = G.data || {};
          F.id === C && (q(), F.error ? f(new Error(F.error)) : y(F.result));
        }, $ = (G) => {
          q(), a("[" + t + "] worker error event", G);
          try {
            i[S] === v && (i[S] = null, v.terminate && v.terminate());
          } catch (F) {
            a("[" + t + "] worker termination failed", F);
          }
          f(new Error(G && G.message || "worker error"));
        };
        z = setTimeout(() => {
          q(), a("[" + t + "] worker timed out");
          try {
            i[S] === v && (i[S] = null, v.terminate && v.terminate());
          } catch (G) {
            a("[" + t + "] worker termination on timeout failed", G);
          }
          f(new Error("worker timeout"));
        }, g), v.addEventListener("message", M), v.addEventListener("error", $);
        try {
          c(S), v.postMessage(U);
        } catch (G) {
          q(), f(G);
        }
      };
      b(0);
    });
  }
  return { get: u, send: m, terminate: h };
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
const Ge = /* @__PURE__ */ new Set();
function Bt(e) {
  cs(), Ge.clear();
  for (const t of Te)
    t && Ge.add(t);
  oi(K), oi(j), Bt._refreshed = !0;
}
function oi(e) {
  if (!(!e || typeof e.values != "function"))
    for (const t of e.values())
      t && Ge.add(t);
}
function li(e) {
  if (!e || typeof e.set != "function") return;
  const t = e.set;
  e.set = function(n, i) {
    return i && Ge.add(i), t.call(this, n, i);
  };
}
let ci = !1;
function cs() {
  ci || (li(K), li(j), ci = !0);
}
function Dt(e, t = 1e3) {
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
function Di(e) {
  return !e || typeof e != "string" ? !1 : /^(https?:)?\/\//.test(e) || e.startsWith("mailto:") || e.startsWith("tel:");
}
const le = Dt(function(e) {
  return String(e || "").replace(/^[.\/]+/, "");
}, 2e3), qt = Dt(function(e) {
  return String(e || "").replace(/\/+$/, "");
}, 2e3), Ct = Dt(function(e) {
  return qt(String(e || "")) + "/";
}, 2e3);
function us(e) {
  try {
    if (!e || typeof document > "u" || !document.head || e.startsWith("data:") || document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`)) return;
    const n = document.createElement("link");
    n.rel = "preload", n.as = "image", n.href = e, document.head.appendChild(n);
  } catch (t) {
    _("[helpers] preloadImage failed", t);
  }
}
function An(e, t = 0, n = !1) {
  try {
    if (typeof window > "u" || !e || !e.querySelectorAll) return;
    const i = Array.from(e.querySelectorAll("img"));
    if (!i.length) return;
    const r = e, a = r && r.getBoundingClientRect ? r.getBoundingClientRect() : null, s = 0, l = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, o = a ? Math.max(s, a.top) : s, c = (a ? Math.min(l, a.bottom) : l) + Number(t || 0);
    let u = 0;
    r && (u = r.clientHeight || (a ? a.height : 0)), u || (u = l - s);
    let h = 0.6;
    try {
      const y = r && window.getComputedStyle ? window.getComputedStyle(r) : null, f = y && y.getPropertyValue("--nimbi-image-max-height-ratio"), w = f ? parseFloat(f) : NaN;
      !Number.isNaN(w) && w > 0 && w <= 1 && (h = w);
    } catch (y) {
      _("[helpers] read CSS ratio failed", y);
    }
    const m = Math.max(200, Math.floor(u * h));
    let d = !1, g = null;
    if (i.forEach((y) => {
      try {
        const f = y.getAttribute ? y.getAttribute("loading") : void 0;
        f !== "eager" && y.setAttribute && y.setAttribute("loading", "lazy");
        const w = y.getBoundingClientRect ? y.getBoundingClientRect() : null, b = y.src || y.getAttribute && y.getAttribute("src"), k = w && w.height > 1 ? w.height : m, S = w ? w.top : 0, v = S + k;
        w && k > 0 && S <= c && v >= o && (y.setAttribute ? (y.setAttribute("loading", "eager"), y.setAttribute("fetchpriority", "high"), y.setAttribute("data-eager-by-nimbi", "1")) : (y.loading = "eager", y.fetchPriority = "high"), us(b), d = !0), !g && w && w.top <= c && (g = { img: y, src: b, rect: w, beforeLoading: f });
      } catch (f) {
        _("[helpers] setEagerForAboveFoldImages per-image failed", f);
      }
    }), !d && g) {
      const { img: y, src: f, rect: w, beforeLoading: b } = g;
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
function Me(e, t = null, n) {
  try {
    const i = typeof n == "string" ? n : typeof window < "u" && window.location ? window.location.search : "", r = new URLSearchParams(i.startsWith("?") ? i.slice(1) : i), a = String(e || "");
    r.delete("page");
    const s = new URLSearchParams();
    s.set("page", a);
    for (const [p, c] of r.entries())
      s.append(p, c);
    const l = s.toString();
    let o = l ? `?${l}` : "";
    return t && (o += `#${encodeURIComponent(t)}`), o || `?page=${encodeURIComponent(a)}`;
  } catch {
    const r = `?page=${encodeURIComponent(String(e || ""))}`;
    return t ? `${r}#${encodeURIComponent(t)}` : r;
  }
}
Dt(function(e) {
  try {
    const t = String(e || "");
    return t.includes("%") ? t : encodeURI(t);
  } catch (t) {
    return _("[helpers] encodeURL failed", t), String(e || "");
  }
}, 2e3);
function Nn(e) {
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
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = Nn);
} catch (e) {
  _("[helpers] global attach failed", e);
}
const hs = Dt(function(e) {
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
let We = [], vr = !1;
function ds(e) {
  vr = !!e;
}
function ji(e) {
  We = Array.isArray(e) ? e.slice() : [];
}
function fs() {
  return We;
}
const ln = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2, Hi = qi(() => Qt(os), "slugManager", ln);
function ps() {
  try {
    if (xr()) return !0;
  } catch {
  }
  try {
    return !!(typeof ne == "string" && ne);
  } catch {
    return !1;
  }
}
function fe(...e) {
  try {
    ut(...e);
  } catch {
  }
}
function gs() {
  return Hi.get();
}
function Ui(e) {
  return Hi.send(e, 5e3);
}
async function ur(e, t = 1, n = void 0) {
  const i = await Promise.resolve().then(() => Rt);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return await Ui({ type: "buildSearchIndex", contentBase: e, indexDepth: t, noIndexing: n });
}
async function ms(e, t, n) {
  const i = await Promise.resolve().then(() => Rt);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return Ui({ type: "crawlForSlug", slug: e, base: t, maxQueue: n });
}
function mt(e, t) {
  if (e)
    if (We && We.length) {
      const i = t.split("/")[0], r = We.includes(i);
      let a = K.get(e);
      (!a || typeof a == "string") && (a = { default: typeof a == "string" ? a : void 0, langs: {} }), r ? a.langs[i] = t : a.default = t, K.set(e, a);
    } else
      K.set(e, t);
}
const Un = /* @__PURE__ */ new Set();
function ys(e) {
  typeof e == "function" && Un.add(e);
}
function bs(e) {
  typeof e == "function" && Un.delete(e);
}
const j = /* @__PURE__ */ new Map();
let hr = {}, Te = [], ne = "_404.md", et = null;
const Ar = "_home";
function Fi(e) {
  if (e == null) {
    ne = null;
    return;
  }
  ne = String(e || "");
}
function Wi(e) {
  if (e == null) {
    et = null;
    return;
  }
  et = String(e || "");
}
function ws(e) {
  hr = e || {};
}
function Zi(e) {
  try {
    if (Array.isArray(Z) || (Z = []), !Array.isArray(e)) return;
    try {
      Array.isArray(Z) || (Z = []), Z.length = 0;
      for (const t of e) Z.push(t);
      try {
        if (typeof window < "u")
          try {
            window.__nimbiLiveSearchIndex = Z;
          } catch {
          }
      } catch {
      }
    } catch (t) {
      fe("[slugManager] replacing searchIndex by assignment fallback", t);
      try {
        Z = Array.from(e);
      } catch {
      }
    }
  } catch {
  }
}
const Xt = /* @__PURE__ */ new Map(), Bn = /* @__PURE__ */ new Set();
function _s() {
  Xt.clear(), Bn.clear();
}
function ks(e) {
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
const ke = Dt(function(e) {
  let n = String(e || "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return n = n.replace(/(?:-?)(?:md|html)$/, ""), n = n.replace(/-+/g, "-"), n = n.replace(/^-|-$/g, ""), n.length > 80 && (n = n.slice(0, 80).replace(/-+$/g, "")), n;
}, 2e3);
function Er(e) {
  K.clear(), j.clear(), Te = [], We = We || [];
  const t = Object.keys(hr || {});
  if (!t.length) return;
  let n = "";
  try {
    if (e) {
      try {
        /^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? n = new URL(String(e)).pathname : n = String(e || "");
      } catch (i) {
        n = String(e || ""), fe("[slugManager] parse contentBase failed", i);
      }
      n = Ct(n);
    }
  } catch (i) {
    n = "", fe("[slugManager] setContentBase prefix derivation failed", i);
  }
  n || (n = ks(t));
  for (const i of t) {
    let r = i;
    n && i.startsWith(n) ? r = le(i.slice(n.length)) : r = le(i), Te.push(r);
    try {
      Bt();
    } catch (s) {
      fe("[slugManager] refreshIndexPaths failed", s);
    }
    const a = hr[i];
    if (typeof a == "string") {
      const s = (a || "").match(/^#\s+(.+)$/m);
      if (s && s[1]) {
        const l = ke(s[1].trim());
        if (l)
          try {
            let o = l;
            if ((!We || !We.length) && (o = Gi(o, new Set(K.keys()))), We && We.length) {
              const c = r.split("/")[0], u = We.includes(c);
              let h = K.get(o);
              (!h || typeof h == "string") && (h = { default: typeof h == "string" ? h : void 0, langs: {} }), u ? h.langs[c] = r : h.default = r, K.set(o, h);
            } else
              K.set(o, r);
            j.set(r, o);
          } catch (o) {
            fe("[slugManager] set slug mapping failed", o);
          }
      }
    }
  }
}
try {
  Er();
} catch (e) {
  fe("[slugManager] initial setContentBase failed", e);
}
function Gi(e, t) {
  if (!t.has(e)) return e;
  let n = 2, i = `${e}-${n}`;
  for (; t.has(i); )
    n += 1, i = `${e}-${n}`;
  return i;
}
function xs(e) {
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
function Tn(e) {
  return e == null ? e : String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g, (t, n) => n);
}
function pn(e) {
  if (!e || !K.has(e)) return null;
  const t = K.get(e);
  if (!t) return null;
  if (typeof t == "string") return t;
  if (We && We.length && kt && t.langs && t.langs[kt])
    return t.langs[kt];
  if (t.default) return t.default;
  if (t.langs) {
    const n = Object.keys(t.langs);
    if (n.length) return t.langs[n[0]];
  }
  return null;
}
const Kt = /* @__PURE__ */ new Map();
function Ss() {
  Kt.clear();
}
let ve = async function(e, t, n) {
  if (!e) throw new Error("path required");
  try {
    if (typeof e == "string" && (e.indexOf("?page=") !== -1 || e.startsWith("?") || e.startsWith("#/") || e.indexOf("#/") !== -1))
      try {
        const l = Ye(e);
        l && l.page && (e = l.page);
      } catch {
      }
  } catch {
  }
  try {
    const l = (String(e || "").match(/([^\/]+)\.md(?:$|[?#])/) || [])[1];
    if (l && K.has(l)) {
      const o = pn(l) || K.get(l);
      o && o !== e && (e = o);
    }
  } catch (l) {
    fe("[slugManager] slug mapping normalization failed", l);
  }
  if (!(n && n.force === !0 || typeof ne == "string" && ne || K && K.size || Te && Te.length || xr()))
    throw new Error("failed to fetch md");
  const r = t == null ? "" : qt(String(t));
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
      if (l && l.status === 404 && typeof ne == "string" && ne)
        try {
          const m = `${r}/${ne}`, d = await globalThis.fetch(m);
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
            In("fetchMarkdown failed:", { url: a, status: m, statusText: l ? l.statusText : void 0, body: h.slice(0, 200) });
          } catch {
          }
      } catch {
      }
      throw new Error("failed to fetch md");
    }
    const o = await l.text(), p = o.trim().slice(0, 128).toLowerCase(), c = /^(?:<!doctype|<html|<title|<h1)/.test(p), u = c || String(e || "").toLowerCase().endsWith(".html");
    if (c && String(e || "").toLowerCase().endsWith(".md")) {
      try {
        if (typeof ne == "string" && ne) {
          const h = `${r}/${ne}`, m = await globalThis.fetch(h);
          if (m.ok)
            return { raw: await m.text(), status: 404 };
        }
      } catch (h) {
        fe("[slugManager] fetching fallback 404 failed", h);
      }
      throw ps() && In("fetchMarkdown: server returned HTML for .md request", a), new Error("failed to fetch md");
    }
    return u ? { raw: o, isHtml: !0 } : { raw: o };
  })();
  return Kt.set(a, s), s;
};
function vs(e) {
  typeof e == "function" && (ve = e);
}
const Pn = /* @__PURE__ */ new Map();
function As(e) {
  if (!e || typeof e != "string") return "";
  let t = e.replace(/```[\s\S]*?```/g, "");
  return t = t.replace(/<pre[\s\S]*?<\/pre>/gi, ""), t = t.replace(/<code[\s\S]*?<\/code>/gi, ""), t = t.replace(/<!--([\s\S]*?)-->/g, ""), t = t.replace(/^ {4,}.*$/gm, ""), t = t.replace(/`[^`]*`/g, ""), t;
}
let Z = [];
function Es() {
  return Z;
}
try {
  if (typeof window < "u")
    try {
      Object.defineProperty(window, "__nimbiSearchIndex", {
        get() {
          return Z;
        },
        enumerable: !0,
        configurable: !0
      });
    } catch {
      try {
        window.__nimbiSearchIndex = Z;
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
          return dr;
        },
        enumerable: !0,
        configurable: !0
      });
    } catch {
      try {
        window.__nimbiIndexReady = dr;
      } catch {
      }
    }
} catch {
}
let bt = null;
async function Lt(e, t = 1, n = void 0, i = void 0) {
  const r = Array.isArray(n) ? Array.from(new Set((n || []).map((a) => le(String(a || ""))))) : [];
  try {
    const a = le(String(ne || ""));
    a && !r.includes(a) && r.push(a);
  } catch {
  }
  if (Z && Z.length && t === 1 && !Z.some((s) => {
    try {
      return r.includes(le(String(s.path || "")));
    } catch {
      return !1;
    }
  }))
    return Z;
  if (bt) return bt;
  bt = (async () => {
    let a = Array.isArray(n) ? Array.from(new Set((n || []).map((g) => le(String(g || ""))))) : [];
    try {
      const g = le(String(ne || ""));
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
            const y = le(String(g || ""));
            y && l.push(y);
          } catch {
          }
    } catch {
    }
    if (Te && Te.length && (l = Array.from(Te)), !l.length)
      for (const g of K.values())
        g && l.push(g);
    try {
      const g = await Yi(e);
      g && g.length && (l = l.concat(g));
    } catch (g) {
      fe("[slugManager] crawlAllMarkdown during buildSearchIndex failed", g);
    }
    try {
      const g = new Set(l), y = [...l], f = Math.max(1, ln), w = async () => {
        for (; !(g.size > gn); ) {
          const k = y.shift();
          if (!k) break;
          try {
            const S = await ve(k, e);
            if (S && S.raw) {
              if (S.status === 404) continue;
              let v = S.raw;
              const C = [], U = String(k || "").replace(/^.*\//, "");
              if (/^readme(?:\.md)?$/i.test(U) && vr && (!k || !k.includes("/")))
                continue;
              const z = As(v), q = /\[[^\]]+\]\(([^)]+)\)/g;
              let M;
              for (; M = q.exec(z); )
                C.push(M[1]);
              const $ = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
              for (; M = $.exec(z); )
                C.push(M[1]);
              const G = k && k.includes("/") ? k.substring(0, k.lastIndexOf("/") + 1) : "";
              for (let F of C)
                try {
                  if (fn(F, e) || F.startsWith("..") || F.indexOf("/../") !== -1 || (G && !F.startsWith("./") && !F.startsWith("/") && !F.startsWith("../") && (F = G + F), F = le(F), !/\.(md|html?)(?:$|[?#])/i.test(F)) || (F = F.split(/[?#]/)[0], s(F))) continue;
                  g.has(F) || (g.add(F), y.push(F), l.push(F));
                } catch (he) {
                  fe("[slugManager] href processing failed", F, he);
                }
            }
          } catch (S) {
            fe("[slugManager] discovery fetch failed for", k, S);
          }
        }
      }, b = [];
      for (let k = 0; k < f; k++) b.push(w());
      await Promise.all(b);
    } catch (g) {
      fe("[slugManager] discovery loop failed", g);
    }
    const o = /* @__PURE__ */ new Set();
    l = l.filter((g) => !g || o.has(g) || s(g) ? !1 : (o.add(g), !0));
    const p = [], c = /* @__PURE__ */ new Map(), u = l.filter((g) => /\.(?:md|html?)(?:$|[?#])/i.test(g)), h = Math.max(1, Math.min(ln, u.length || 1)), m = u.slice(), d = [];
    for (let g = 0; g < h; g++)
      d.push((async () => {
        for (; m.length; ) {
          const y = m.shift();
          if (!y) break;
          try {
            const f = await ve(y, e);
            c.set(y, f);
          } catch (f) {
            fe("[slugManager] buildSearchIndex: entry fetch failed", y, f), c.set(y, null);
          }
        }
      })());
    await Promise.all(d);
    for (const g of l)
      if (/\.(?:md|html?)(?:$|[?#])/i.test(g))
        try {
          const y = c.get(g);
          if (!y || !y.raw || y.status === 404) continue;
          let f = "", w = "";
          if (y.isHtml)
            try {
              const S = new DOMParser().parseFromString(y.raw, "text/html"), v = S.querySelector("title") || S.querySelector("h1");
              v && v.textContent && (f = v.textContent.trim());
              const C = S.querySelector("p");
              if (C && C.textContent && (w = C.textContent.trim()), t >= 2)
                try {
                  const U = S.querySelector("h1"), z = U && U.textContent ? U.textContent.trim() : f || "", q = (() => {
                    try {
                      if (j.has(g)) return j.get(g);
                    } catch {
                    }
                    return ke(f || g);
                  })(), M = Array.from(S.querySelectorAll("h2"));
                  for (const $ of M)
                    try {
                      const G = ($.textContent || "").trim();
                      if (!G) continue;
                      const F = $.id ? $.id : ke(G), he = q ? `${q}::${F}` : `${ke(g)}::${F}`;
                      let L = "", D = $.nextElementSibling;
                      for (; D && D.tagName && D.tagName.toLowerCase() === "script"; ) D = D.nextElementSibling;
                      D && D.textContent && (L = String(D.textContent).trim()), p.push({ slug: he, title: G, excerpt: L, path: g, parentTitle: z });
                    } catch (G) {
                      fe("[slugManager] indexing H2 failed", G);
                    }
                  if (t === 3)
                    try {
                      const $ = Array.from(S.querySelectorAll("h3"));
                      for (const G of $)
                        try {
                          const F = (G.textContent || "").trim();
                          if (!F) continue;
                          const he = G.id ? G.id : ke(F), L = q ? `${q}::${he}` : `${ke(g)}::${he}`;
                          let D = "", J = G.nextElementSibling;
                          for (; J && J.tagName && J.tagName.toLowerCase() === "script"; ) J = J.nextElementSibling;
                          J && J.textContent && (D = String(J.textContent).trim()), p.push({ slug: L, title: F, excerpt: D, path: g, parentTitle: z });
                        } catch (F) {
                          fe("[slugManager] indexing H3 failed", F);
                        }
                    } catch ($) {
                      fe("[slugManager] collect H3s failed", $);
                    }
                } catch (U) {
                  fe("[slugManager] collect H2s failed", U);
                }
            } catch (k) {
              fe("[slugManager] parsing HTML for index failed", k);
            }
          else {
            const k = y.raw, S = k.match(/^#\s+(.+)$/m);
            f = S ? S[1].trim() : "";
            try {
              f = Tn(f);
            } catch {
            }
            const v = k.split(/\r?\n\s*\r?\n/);
            if (v.length > 1)
              for (let C = 1; C < v.length; C++) {
                const U = v[C].trim();
                if (U && !/^#/.test(U)) {
                  w = U.replace(/\r?\n/g, " ");
                  break;
                }
              }
            if (t >= 2) {
              let C = "", U = "";
              try {
                const z = (k.match(/^#\s+(.+)$/m) || [])[1];
                C = z ? z.trim() : "", U = (function() {
                  try {
                    if (j.has(g)) return j.get(g);
                  } catch {
                  }
                  return ke(f || g);
                })();
                const q = /^##\s+(.+)$/gm;
                let M;
                for (; M = q.exec(k); )
                  try {
                    const $ = (M[1] || "").trim(), G = Tn($);
                    if (!$) continue;
                    const F = ke($), he = U ? `${U}::${F}` : `${ke(g)}::${F}`, D = k.slice(q.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), J = D && D[1] ? String(D[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                    p.push({ slug: he, title: G, excerpt: J, path: g, parentTitle: C });
                  } catch ($) {
                    fe("[slugManager] indexing markdown H2 failed", $);
                  }
              } catch (z) {
                fe("[slugManager] collect markdown H2s failed", z);
              }
              if (t === 3)
                try {
                  const z = /^###\s+(.+)$/gm;
                  let q;
                  for (; q = z.exec(k); )
                    try {
                      const M = (q[1] || "").trim(), $ = Tn(M);
                      if (!M) continue;
                      const G = ke(M), F = U ? `${U}::${G}` : `${ke(g)}::${G}`, L = k.slice(z.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), D = L && L[1] ? String(L[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                      p.push({ slug: F, title: $, excerpt: D, path: g, parentTitle: C });
                    } catch (M) {
                      fe("[slugManager] indexing markdown H3 failed", M);
                    }
                } catch (z) {
                  fe("[slugManager] collect markdown H3s failed", z);
                }
            }
          }
          let b = "";
          try {
            j.has(g) && (b = j.get(g));
          } catch (k) {
            fe("[slugManager] mdToSlug access failed", k);
          }
          b || (b = ke(f || g)), p.push({ slug: b, title: f, excerpt: w, path: g });
        } catch (y) {
          fe("[slugManager] buildSearchIndex: entry processing failed", y);
        }
    try {
      const g = p.filter((y) => {
        try {
          return !s(String(y.path || ""));
        } catch {
          return !0;
        }
      });
      try {
        Array.isArray(Z) || (Z = []), Z.length = 0;
        for (const y of g) Z.push(y);
      } catch {
        try {
          Z = Array.from(g);
        } catch {
          Z = g;
        }
      }
      try {
        if (typeof window < "u") {
          try {
            window.__nimbiResolvedIndex = Z;
          } catch {
          }
          try {
            const y = [], f = /* @__PURE__ */ new Set();
            for (const w of Z)
              try {
                if (!w || !w.slug) continue;
                const b = String(w.slug).split("::")[0];
                if (f.has(b)) continue;
                f.add(b);
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
        Array.isArray(Z) || (Z = []), Z.length = 0;
        for (const y of p) Z.push(y);
      } catch {
        try {
          Z = Array.from(p);
        } catch {
          Z = p;
        }
      }
      try {
        if (typeof window < "u")
          try {
            window.__nimbiResolvedIndex = Z;
          } catch {
          }
      } catch {
      }
    }
    return Z;
  })();
  try {
    await bt;
  } catch (a) {
    fe("[slugManager] awaiting _indexPromise failed", a);
  }
  return bt = null, Z;
}
async function _t(e = {}) {
  try {
    const t = typeof e.timeoutMs == "number" ? e.timeoutMs : 8e3, n = e.contentBase, i = typeof e.indexDepth == "number" ? e.indexDepth : 1, r = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, a = Array.isArray(e.seedPaths) ? e.seedPaths : void 0, s = typeof e.startBuild == "boolean" ? e.startBuild : !0;
    if (Array.isArray(Z) && Z.length && !bt && !s) return Z;
    if (bt) {
      try {
        await bt;
      } catch {
      }
      return Z;
    }
    if (s) {
      try {
        if (typeof ur == "function")
          try {
            const o = await ur(n, i, r, a);
            if (Array.isArray(o) && o.length) {
              try {
                Zi(o);
              } catch {
              }
              return Z;
            }
          } catch {
          }
      } catch {
      }
      try {
        return await Lt(n, i, r, a), Z;
      } catch {
      }
    }
    const l = Date.now();
    for (; Date.now() - l < t; ) {
      if (Array.isArray(Z) && Z.length) return Z;
      await new Promise((o) => setTimeout(o, 150));
    }
    return Z;
  } catch {
    return Z;
  }
}
async function dr(e = {}) {
  try {
    const t = Object.assign({}, e);
    typeof t.startBuild != "boolean" && (t.startBuild = !0), typeof t.timeoutMs != "number" && (t.timeoutMs = 1 / 0);
    try {
      return await _t(t);
    } catch {
      return Z;
    }
  } catch {
    return Z;
  }
}
const Qi = 1e3;
let gn = Qi;
function Ls(e) {
  typeof e == "number" && e >= 0 && (gn = e);
}
const Xi = new DOMParser(), Ki = "a[href]";
let Vi = async function(e, t, n = gn) {
  if (Pn.has(e)) return Pn.get(e);
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
    const p = a.splice(0, o);
    await Promise.all(p.map(async (c) => {
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
        } catch (f) {
          fe("[slugManager] crawlForSlug: fetch failed", { url: u, error: f });
          return;
        }
        if (!h || !h.ok) {
          h && !h.ok && fe("[slugManager] crawlForSlug: directory fetch non-ok", { url: u, status: h.status });
          return;
        }
        const m = await h.text(), g = Xi.parseFromString(m, "text/html").querySelectorAll(Ki), y = u;
        for (const f of g)
          try {
            if (i) break;
            let w = f.getAttribute("href") || "";
            if (!w || fn(w, t) || w.startsWith("..") || w.indexOf("/../") !== -1) continue;
            if (w.endsWith("/")) {
              try {
                const b = new URL(w, y), k = new URL(l).pathname, S = b.pathname.startsWith(k) ? b.pathname.slice(k.length) : b.pathname.replace(/^\//, ""), v = Ct(le(S));
                r.has(v) || a.push(v);
              } catch {
                const k = le(c + w);
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
              b = le(b);
              try {
                if (j.has(b))
                  continue;
                for (const k of K.values())
                  ;
              } catch (k) {
                fe("[slugManager] slug map access failed", k);
              }
              try {
                const k = await ve(b, t);
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
  return Pn.set(e, i), i;
};
async function Yi(e, t = gn) {
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
    await Promise.all(o.map(async (p) => {
      if (p == null || i.has(p)) return;
      i.add(p);
      let c = "";
      try {
        c = new URL(p || "", s).toString();
      } catch {
        c = (String(e || "") || a) + "/" + String(p || "").replace(/^\//, "");
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
        const h = await u.text(), d = Xi.parseFromString(h, "text/html").querySelectorAll(Ki), g = c;
        for (const y of d)
          try {
            let f = y.getAttribute("href") || "";
            if (!f || fn(f, e) || f.startsWith("..") || f.indexOf("/../") !== -1) continue;
            if (f.endsWith("/")) {
              try {
                const b = new URL(f, g), k = new URL(s).pathname, S = b.pathname.startsWith(k) ? b.pathname.slice(k.length) : b.pathname.replace(/^\//, ""), v = Ct(le(S));
                i.has(v) || r.push(v);
              } catch {
                const k = p + f;
                i.has(k) || r.push(k);
              }
              continue;
            }
            let w = "";
            try {
              const b = new URL(f, g), k = new URL(s).pathname;
              w = b.pathname.startsWith(k) ? b.pathname.slice(k.length) : b.pathname.replace(/^\//, "");
            } catch {
              w = (p + f).replace(/^\//, "");
            }
            w = le(w), /\.(md|html?)$/i.test(w) && n.add(w);
          } catch (f) {
            fe("[slugManager] crawlAllMarkdown: link iteration failed", f);
          }
      } catch (u) {
        fe("[slugManager] crawlAllMarkdown: directory fetch failed", u);
      }
    }));
  }
  return Array.from(n);
}
async function Ji(e, t, n) {
  if (e && typeof e == "string" && (e = le(e), e = qt(e)), K.has(e))
    return pn(e) || K.get(e);
  try {
    if (!(typeof ne == "string" && ne || K.has(e) || Te && Te.length || Bt._refreshed || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t))) return null;
  } catch {
  }
  for (const r of Un)
    try {
      const a = await r(e, t);
      if (a)
        return mt(e, a), j.set(a, e), a;
    } catch (a) {
      fe("[slugManager] slug resolver failed", a);
    }
  if (Te && Te.length) {
    if (Xt.has(e)) {
      const r = Xt.get(e);
      return K.set(e, r), j.set(r, e), r;
    }
    for (const r of Te)
      if (!Bn.has(r))
        try {
          const a = await ve(r, t);
          if (a && a.raw) {
            const s = (a.raw || "").match(/^#\s+(.+)$/m);
            if (s && s[1]) {
              const l = ke(s[1].trim());
              if (Bn.add(r), l && Xt.set(l, r), l === e)
                return mt(e, r), j.set(r, e), r;
            }
          }
        } catch (a) {
          fe("[slugManager] manifest title fetch failed", a);
        }
  }
  try {
    const r = await Lt(t);
    if (r && r.length) {
      const a = r.find((s) => s.slug === e);
      if (a)
        return mt(e, a.path), j.set(a.path, e), a.path;
    }
  } catch (r) {
    fe("[slugManager] buildSearchIndex lookup failed", r);
  }
  try {
    const r = await Vi(e, t, n);
    if (r)
      return mt(e, r), j.set(r, e), r;
  } catch (r) {
    fe("[slugManager] crawlForSlug lookup failed", r);
  }
  const i = [`${e}.html`, `${e}.md`];
  for (const r of i)
    try {
      const a = await ve(r, t);
      if (a && a.raw)
        return mt(e, r), j.set(r, e), r;
    } catch (a) {
      fe("[slugManager] candidate fetch failed", a);
    }
  if (Te && Te.length)
    for (const r of Te)
      try {
        const a = r.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
        if (ke(a) === e)
          return mt(e, r), j.set(r, e), r;
      } catch (a) {
        fe("[slugManager] build-time filename match failed", a);
      }
  try {
    if (et && typeof et == "string" && et.trim())
      try {
        const r = await ve(et, t);
        if (r && r.raw) {
          const a = (r.raw || "").match(/^#\s+(.+)$/m);
          if (a && a[1] && ke(a[1].trim()) === e)
            return mt(e, et), j.set(et, e), et;
        }
      } catch (r) {
        fe("[slugManager] home page fetch failed", r);
      }
  } catch (r) {
    fe("[slugManager] home page fetch failed", r);
  }
  return null;
}
const Rt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CRAWL_MAX_QUEUE: Qi,
  HOME_SLUG: Ar,
  _setAllMd: ws,
  _setSearchIndex: Zi,
  _storeSlugMapping: mt,
  addSlugResolver: ys,
  get allMarkdownPaths() {
    return Te;
  },
  get availableLanguages() {
    return We;
  },
  awaitSearchIndex: dr,
  buildSearchIndex: Lt,
  buildSearchIndexWorker: ur,
  clearFetchCache: Ss,
  clearListCaches: _s,
  crawlAllMarkdown: Yi,
  crawlCache: Pn,
  crawlForSlug: Vi,
  crawlForSlugWorker: ms,
  get defaultCrawlMaxQueue() {
    return gn;
  },
  ensureSlug: Ji,
  fetchCache: Kt,
  get fetchMarkdown() {
    return ve;
  },
  getLanguages: fs,
  getSearchIndex: Es,
  get homePage() {
    return et;
  },
  initSlugWorker: gs,
  isExternalLink: xs,
  isExternalLinkWithBase: fn,
  listPathsFetched: Bn,
  listSlugCache: Xt,
  mdToSlug: j,
  get notFoundPage() {
    return ne;
  },
  removeSlugResolver: bs,
  resolveSlugPath: pn,
  get searchIndex() {
    return Z;
  },
  setContentBase: Er,
  setDefaultCrawlMaxQueue: Ls,
  setFetchMarkdown: vs,
  setHomePage: Wi,
  setLanguages: ji,
  setNotFoundPage: Fi,
  setSkipRootReadme: ds,
  get skipRootReadme() {
    return vr;
  },
  slugResolvers: Un,
  slugToMd: K,
  slugify: ke,
  unescapeMarkdown: Tn,
  uniqueSlug: Gi,
  whenSearchIndexReady: _t
}, Symbol.toStringTag, { value: "Module" }));
var rr, ui;
function Ms() {
  if (ui) return rr;
  ui = 1;
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
    let l = 0, o = 0, p = a.length - 1;
    const c = s.wordsPerMinute || 200, u = s.wordBound || n;
    for (; u(a[o]); ) o++;
    for (; u(a[p]); ) p--;
    const h = `${a}
`;
    for (let y = o; y <= p; y++)
      if ((t(h[y]) || !u(h[y]) && (u(h[y + 1]) || t(h[y + 1]))) && l++, t(h[y]))
        for (; y <= p && (i(h[y + 1]) || u(h[y + 1])); )
          y++;
    const m = l / c, d = Math.round(m * 60 * 1e3);
    return {
      text: Math.ceil(m.toFixed(2)) + " min read",
      minutes: m,
      time: d,
      words: l
    };
  }
  return rr = r, rr;
}
var Rs = Ms();
const Cs = /* @__PURE__ */ Pi(Rs);
function cn(e, t) {
  let n = document.querySelector(`meta[name="${e}"]`);
  n || (n = document.createElement("meta"), n.setAttribute("name", e), document.head.appendChild(n)), n.setAttribute("content", t);
}
function yt(e, t, n) {
  let i = `meta[${e}="${t}"]`, r = document.querySelector(i);
  r || (r = document.createElement("meta"), r.setAttribute(e, t), document.head.appendChild(r)), r.setAttribute("content", n);
}
function ea(e, t) {
  try {
    let n = document.querySelector(`link[rel="${e}"]`);
    n || (n = document.createElement("link"), n.setAttribute("rel", e), document.head.appendChild(n)), n.setAttribute("href", t);
  } catch (n) {
    _("[seoManager] upsertLinkRel failed", n);
  }
}
function Ts(e, t, n, i) {
  const r = t && String(t).trim() ? t : e.title || document.title;
  yt("property", "og:title", r);
  const a = i && String(i).trim() ? i : e.description || "";
  a && String(a).trim() && yt("property", "og:description", a), a && String(a).trim() && yt("name", "twitter:description", a), yt("name", "twitter:card", e.twitter_card || "summary_large_image");
  const s = n || e.image;
  s && (yt("property", "og:image", s), yt("name", "twitter:image", s));
}
function Lr(e, t, n, i, r = "") {
  const a = e.meta || {}, s = document && document.querySelector && document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", l = i && String(i).trim() ? i : a.description && String(a.description).trim() ? a.description : s && String(s).trim() ? s : "";
  l && String(l).trim() && cn("description", l), cn("robots", a.robots || "index,follow"), Ts(a, t, n, l);
}
function Ps() {
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
function Mr(e, t, n, i, r, a = "") {
  try {
    const s = e.meta || {}, l = n && String(n).trim() ? n : s.title || a || document.title, o = r && String(r).trim() ? r : s.description || document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", p = i || s.image || null;
    let c = "";
    try {
      if (t) {
        const d = le(t);
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
    c && ea("canonical", c);
    try {
      yt("property", "og:url", c);
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
    p && (u.image = String(p)), s.date && (u.datePublished = s.date), s.dateModified && (u.dateModified = s.dateModified);
    const h = "nimbi-jsonld";
    let m = document.getElementById(h);
    m || (m = document.createElement("script"), m.type = "application/ld+json", m.id = h, document.head.appendChild(m)), m.textContent = JSON.stringify(u, null, 2);
  } catch (s) {
    _("[seoManager] setStructuredData failed", s);
  }
}
let Vt = typeof window < "u" && window.__SEO_MAP ? window.__SEO_MAP : {};
function $s(e) {
  try {
    if (!e || typeof e != "object") {
      Vt = {};
      return;
    }
    Vt = Object.assign({}, e);
  } catch (t) {
    _("[seoManager] setSeoMap failed", t);
  }
}
function zs(e, t = "") {
  try {
    if (!e) return;
    const n = Vt && Vt[e] ? Vt[e] : typeof window < "u" && window.__SEO_MAP && window.__SEO_MAP[e] ? window.__SEO_MAP[e] : null;
    try {
      const i = location.origin + location.pathname + "?page=" + encodeURIComponent(String(e || ""));
      ea("canonical", i);
      try {
        yt("property", "og:url", i);
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
        Lr({ meta: n }, n.title || void 0, n.image || void 0, n.description || void 0, t);
      } catch {
      }
    } catch {
    }
    try {
      Mr({ meta: n }, e, n.title || void 0, n.image || void 0, n.description || void 0, t);
    } catch (i) {
      _("[seoManager] inject structured data failed", i);
    }
  } catch (n) {
    _("[seoManager] injectSeoForPage failed", n);
  }
}
function $n(e = {}, t = "", n = void 0, i = void 0) {
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
      Lr({ meta: Object.assign({}, r, { robots: "noindex,follow" }) }, a, r.image || void 0, s);
    } catch {
    }
    try {
      Mr({ meta: Object.assign({}, r, { title: a, description: s }) }, t || "", a, r.image || void 0, s);
    } catch {
    }
  } catch (r) {
    _("[seoManager] markNotFound failed", r);
  }
}
function Is(e, t, n, i, r, a, s, l, o, p, c) {
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
      let f = "";
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
          k.length && (f = k.join(" ").replace(/\s+/g, " ").trim()), !f && o && (f = String(o).trim());
        }
      } catch (w) {
        _("[seoManager] compute descOverride failed", w);
      }
      f && String(f).length > 160 && (f = String(f).slice(0, 157).trim() + "..."), d = f;
    } catch (f) {
      _("[seoManager] compute descOverride failed", f);
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
        const f = r.querySelector("h2");
        f && f.textContent && (g = String(f.textContent).trim());
      } catch {
      }
    g || (g = a || "");
    try {
      Lr(n, g || void 0, m, d);
    } catch (f) {
      _("[seoManager] setMetaTags failed", f);
    }
    try {
      Mr(n, p, g || void 0, m, d, t);
    } catch (f) {
      _("[seoManager] setStructuredData failed", f);
    }
    const y = Ps();
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
      const u = Cs(c.raw || ""), h = u && typeof u.minutes == "number" ? Math.ceil(u.minutes) : 0, m = h ? e("readingTime", { minutes: h }) : "";
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
            const f = document.createElement("span");
            f.className = "nimbi-reading-time", f.textContent = m, y.appendChild(f);
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
            const f = document.createElement("p");
            f.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const w = document.createElement("span");
            w.className = "nimbi-reading-time", w.textContent = m, f.appendChild(w), d.insertAdjacentElement("afterend", f);
          } catch {
          }
        }
      }
    }
  } catch (u) {
    _("[seoManager] reading time update failed", u);
  }
}
let ta = 100;
function hi(e) {
  ta = e;
}
function Ke() {
  try {
    if ($t(2)) return !0;
  } catch {
  }
  try {
    return !1;
  } catch {
    return !1;
  }
}
let Yt = 300 * 1e3;
function di(e) {
  Yt = e;
}
const rt = /* @__PURE__ */ new Map();
function Os(e) {
  if (!rt.has(e)) return;
  const t = rt.get(e), n = Date.now();
  if (t.ts + Yt < n) {
    rt.delete(e);
    return;
  }
  return rt.delete(e), rt.set(e, t), t.value;
}
function Ns(e, t) {
  if (fi(), fi(), rt.delete(e), rt.set(e, { value: t, ts: Date.now() }), rt.size > ta) {
    const n = rt.keys().next().value;
    n !== void 0 && rt.delete(n);
  }
}
function fi() {
  if (!Yt || Yt <= 0) return;
  const e = Date.now();
  for (const [t, n] of rt.entries())
    n.ts + Yt < e && rt.delete(t);
}
async function Bs(e, t) {
  const n = new Set(Ge), i = document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");
  for (const r of Array.from(i || [])) {
    const a = r.getAttribute("href") || "";
    if (a)
      try {
        try {
          const u = Ye(a);
          if (u) {
            if (u.type === "canonical" && u.page) {
              const h = le(u.page);
              if (h) {
                n.add(h);
                continue;
              }
            }
            if (u.type === "cosmetic" && u.page) {
              const h = u.page;
              if (K.has(h)) {
                const m = K.get(h);
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
          let u = le(l[1]);
          u && n.add(u);
          continue;
        }
        const o = (r.textContent || "").trim(), p = (s.pathname || "").replace(/^.*\//, "");
        if (o && ke(o) === e || p && ke(p.replace(/\.(html?|md)$/i, "")) === e) return s.toString();
        if (/\.(html?)$/i.test(s.pathname)) {
          let u = s.pathname.replace(/^\//, "");
          n.add(u);
          continue;
        }
        const c = s.pathname || "";
        if (c) {
          const u = new URL(t), h = Ct(u.pathname);
          if (c.indexOf(h) !== -1) {
            let m = c.startsWith(h) ? c.slice(h.length) : c;
            m = le(m), m && n.add(m);
          }
        }
      } catch (s) {
        _("[router] malformed URL while discovering index candidates", s);
      }
  }
  for (const r of n)
    try {
      if (!r || !String(r).includes(".md")) continue;
      const a = await ve(r, t);
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
function qs(e) {
  const t = [];
  if (String(e).includes(".md") || String(e).includes(".html"))
    /index\.html$/i.test(e) || t.push(e);
  else
    try {
      const n = decodeURIComponent(String(e || ""));
      if (K.has(n)) {
        const i = pn(n) || K.get(n);
        i && (/\.(md|html?)$/i.test(i) ? /index\.html$/i.test(i) || t.push(i) : (t.push(i), t.push(i + ".html")));
      } else {
        if (Ge && Ge.size)
          for (const i of Ge) {
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
async function Ds(e, t) {
  const n = e || "";
  try {
    try {
      Ci("fetchPageData");
    } catch {
    }
    try {
      Ti("fetchPageData");
    } catch {
    }
  } catch {
  }
  let i = null;
  try {
    const f = Ye(typeof location < "u" ? location.href : "");
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
  const o = `${e}|||${typeof as < "u" && kt ? kt : ""}`, p = Os(o);
  if (p)
    r = p.resolved, a = p.anchor || a;
  else {
    if (!String(r).includes(".md") && !String(r).includes(".html")) {
      let f = decodeURIComponent(String(r || ""));
      if (f && typeof f == "string" && (f = le(f), f = qt(f)), K.has(f))
        r = pn(f) || K.get(f);
      else {
        let w = await Bs(f, t);
        if (w)
          r = w;
        else if (Bt._refreshed && Ge && Ge.size || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t)) {
          const b = await Ji(f, t);
          b && (r = b);
        }
      }
    }
    Ns(o, { resolved: r, anchor: a });
  }
  let c = !0;
  try {
    const f = String(r || "").includes(".md") || String(r || "").includes(".html") || r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"));
    c = typeof ne == "string" && ne || K.has(r) || Ge && Ge.size || Bt._refreshed || s || f;
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
          const b = await w.text(), k = w && w.headers && typeof w.headers.get == "function" && w.headers.get("content-type") || "", S = (b || "").toLowerCase();
          if (k && k.indexOf && k.indexOf("text/html") !== -1 || S.indexOf("<!doctype") !== -1 || S.indexOf("<html") !== -1) {
            if (!s)
              try {
                let U = f;
                try {
                  U = new URL(f).pathname.replace(/^\//, "");
                } catch {
                  U = String(f || "").replace(/^\//, "");
                }
                const z = U.replace(/\.html$/i, ".md");
                try {
                  const q = await ve(z, t);
                  if (q && q.raw)
                    return { data: q, pagePath: z, anchor: a };
                } catch {
                }
                if (typeof ne == "string" && ne)
                  try {
                    const q = await ve(ne, t);
                    if (q && q.raw) {
                      try {
                        $n(q.meta || {}, ne);
                      } catch {
                      }
                      return { data: q, pagePath: ne, anchor: a };
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
                let U = f;
                try {
                  U = new URL(f).pathname.replace(/^\//, "");
                } catch {
                  U = String(f || "").replace(/^\//, "");
                }
                const z = U.replace(/\.html$/i, ".md");
                try {
                  const q = await ve(z, t);
                  if (q && q.raw)
                    return { data: q, pagePath: z, anchor: a };
                } catch {
                }
                if (typeof ne == "string" && ne)
                  try {
                    const q = await ve(ne, t);
                    if (q && q.raw) {
                      try {
                        $n(q.meta || {}, ne);
                      } catch {
                      }
                      return { data: q, pagePath: ne, anchor: a };
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
  const u = qs(r);
  try {
    if (Ke())
      try {
        ut("[router-debug] fetchPageData candidates", { originalRaw: n, resolved: r, pageCandidates: u });
      } catch {
      }
  } catch {
  }
  const h = String(n || "").includes(".md") || String(n || "").includes(".html");
  let m = null;
  if (!h)
    try {
      let f = decodeURIComponent(String(n || ""));
      f = le(f), f = qt(f), f && !/\.(md|html?)$/i.test(f) && (m = f);
    } catch {
      m = null;
    }
  if (h && u.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && u.push(r), u.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && u.push(r), u.length === 1 && /index\.html$/i.test(u[0]) && !h && !K.has(r) && !K.has(decodeURIComponent(String(r || ""))) && !String(r || "").includes("/"))
    throw new Error("Unknown slug: index.html fallback prevented");
  let d = null, g = null, y = null;
  try {
    const f = String(r || "").includes(".md") || String(r || "").includes(".html") || r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"));
    c = typeof ne == "string" && ne || K.has(r) || Ge && Ge.size || Bt._refreshed || h || f;
  } catch {
    c = !0;
  }
  if (!c)
    y = new Error("no page data");
  else
    for (const f of u)
      if (f)
        try {
          const w = le(f);
          if (d = await ve(w, t), g = w, m && !K.has(m))
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
                        const v = await ve(S, t);
                        if (v && v.raw)
                          d = v, g = S;
                        else if (typeof ne == "string" && ne)
                          try {
                            const C = await ve(ne, t);
                            if (C && C.raw)
                              d = C, g = ne;
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
                          const C = await ve(ne, t);
                          if (C && C.raw)
                            d = C, g = ne;
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
                    let C = !1;
                    try {
                      const U = await ve(b, t);
                      if (U && U.raw)
                        d = U, g = b, C = !0;
                      else if (typeof ne == "string" && ne)
                        try {
                          const z = await ve(ne, t);
                          z && z.raw && (d = z, g = ne, C = !0);
                        } catch {
                        }
                    } catch {
                      try {
                        const z = await ve(ne, t);
                        z && z.raw && (d = z, g = ne, C = !0);
                      } catch {
                      }
                    }
                    if (!C) {
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
            if (Ke())
              try {
                ut("[router-debug] fetchPageData accepted candidate", { candidate: w, pagePath: g, isHtml: d && d.isHtml, snippet: d && d.raw ? String(d.raw).slice(0, 160) : null });
              } catch {
              }
          } catch {
          }
          break;
        } catch (w) {
          y = w;
          try {
            Ke() && _("[router] candidate fetch failed", { candidate: f, contentBase: t, err: w && w.message || w });
          } catch {
          }
        }
  if (!d) {
    const f = y && (y.message || String(y)) || null, w = f && /failed to fetch md|site shell detected/i.test(f);
    try {
      if (Ke())
        try {
          ut("[router-debug] fetchPageData no data", { originalRaw: n, resolved: r, pageCandidates: u, fetchError: f });
        } catch {
        }
    } catch {
    }
    if (w)
      try {
        if (Ke())
          try {
            _("[router] fetchPageData: no page data (expected)", { originalRaw: n, resolved: r, pageCandidates: u, contentBase: t, fetchError: f });
          } catch {
          }
      } catch {
      }
    else
      try {
        if (Ke())
          try {
            In("[router] fetchPageData: no page data for", { originalRaw: n, resolved: r, pageCandidates: u, contentBase: t, fetchError: f });
          } catch {
          }
      } catch {
      }
    if (typeof ne == "string" && ne)
      try {
        const b = await ve(ne, t);
        if (b && b.raw) {
          try {
            $n(b.meta || {}, ne);
          } catch {
          }
          return { data: b, pagePath: ne, anchor: a };
        }
      } catch {
      }
    try {
      if (h && String(n || "").toLowerCase().includes(".html"))
        try {
          const b = new URL(String(n || ""), location.href).toString();
          Ke() && _("[router] attempting absolute HTML fetch fallback", b);
          const k = await fetch(b);
          if (k && k.ok) {
            const S = await k.text(), v = k && k.headers && typeof k.headers.get == "function" && k.headers.get("content-type") || "", C = (S || "").toLowerCase(), U = v && v.indexOf && v.indexOf("text/html") !== -1 || C.indexOf("<!doctype") !== -1 || C.indexOf("<html") !== -1;
            if (!U && Ke() && _("[router] absolute fetch returned non-HTML", { abs: b, contentType: v, snippet: C.slice(0, 200) }), U) {
              const z = (S || "").toLowerCase();
              if (/<title>\s*index of\b/i.test(S) || /<h1>\s*index of\b/i.test(S) || z.indexOf("parent directory") !== -1 || /<title>\s*directory listing/i.test(S) || /<h1>\s*directory listing/i.test(S))
                try {
                  Ke() && _("[router] absolute fetch returned directory listing; treating as not found", { abs: b });
                } catch {
                }
              else
                try {
                  const M = b, $ = new URL(".", M).toString();
                  try {
                    const F = typeof DOMParser < "u" ? new DOMParser() : null;
                    if (F) {
                      const he = F.parseFromString(S || "", "text/html"), L = (ee, ce) => {
                        try {
                          const Se = ce.getAttribute(ee) || "";
                          if (!Se || /^(https?:)?\/\//i.test(Se) || Se.startsWith("/") || Se.startsWith("#")) return;
                          try {
                            const E = new URL(Se, M).toString();
                            ce.setAttribute(ee, E);
                          } catch (E) {
                            _("[router] rewrite attribute failed", ee, E);
                          }
                        } catch (Se) {
                          _("[router] rewrite helper failed", Se);
                        }
                      }, D = he.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"), J = [];
                      for (const ee of Array.from(D || []))
                        try {
                          const ce = ee.tagName ? ee.tagName.toLowerCase() : "";
                          if (ce === "a") continue;
                          if (ee.hasAttribute("src")) {
                            const Se = ee.getAttribute("src");
                            L("src", ee);
                            const E = ee.getAttribute("src");
                            Se !== E && J.push({ attr: "src", tag: ce, before: Se, after: E });
                          }
                          if (ee.hasAttribute("href") && ce === "link") {
                            const Se = ee.getAttribute("href");
                            L("href", ee);
                            const E = ee.getAttribute("href");
                            Se !== E && J.push({ attr: "href", tag: ce, before: Se, after: E });
                          }
                          if (ee.hasAttribute("href") && ce !== "link") {
                            const Se = ee.getAttribute("href");
                            L("href", ee);
                            const E = ee.getAttribute("href");
                            Se !== E && J.push({ attr: "href", tag: ce, before: Se, after: E });
                          }
                          if (ee.hasAttribute("xlink:href")) {
                            const Se = ee.getAttribute("xlink:href");
                            L("xlink:href", ee);
                            const E = ee.getAttribute("xlink:href");
                            Se !== E && J.push({ attr: "xlink:href", tag: ce, before: Se, after: E });
                          }
                          if (ee.hasAttribute("poster")) {
                            const Se = ee.getAttribute("poster");
                            L("poster", ee);
                            const E = ee.getAttribute("poster");
                            Se !== E && J.push({ attr: "poster", tag: ce, before: Se, after: E });
                          }
                          if (ee.hasAttribute("srcset")) {
                            const N = (ee.getAttribute("srcset") || "").split(",").map((P) => P.trim()).filter(Boolean).map((P) => {
                              const [B, T] = P.split(/\s+/, 2);
                              if (!B || /^(https?:)?\/\//i.test(B) || B.startsWith("/")) return P;
                              try {
                                const I = new URL(B, M).toString();
                                return T ? `${I} ${T}` : I;
                              } catch {
                                return P;
                              }
                            }).join(", ");
                            ee.setAttribute("srcset", N);
                          }
                        } catch {
                        }
                      const ye = he.documentElement && he.documentElement.outerHTML ? he.documentElement.outerHTML : S;
                      try {
                        Ke() && J && J.length && _("[router] rewritten asset refs", { abs: b, rewritten: J });
                      } catch {
                      }
                      return { data: { raw: ye, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                    }
                  } catch {
                  }
                  let G = S;
                  return /<base\s+[^>]*>/i.test(S) || (/<head[^>]*>/i.test(S) ? G = S.replace(/(<head[^>]*>)/i, `$1<base href="${$}">`) : G = `<base href="${$}">` + S), { data: { raw: G, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                } catch {
                  return { data: { raw: S, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                }
            }
          }
        } catch (b) {
          Ke() && _("[router] absolute HTML fetch fallback failed", b);
        }
    } catch {
    }
    try {
      const b = decodeURIComponent(String(r || ""));
      if (b && !/\.(md|html?)$/i.test(b) && typeof ne == "string" && ne && Ke()) {
        const S = [
          `/assets/${b}.html`,
          `/assets/${b}/index.html`
        ];
        for (const v of S)
          try {
            const C = await fetch(v, { method: "GET" });
            if (C && C.ok)
              return { data: { raw: await C.text(), isHtml: !0 }, pagePath: v.replace(/^\//, ""), anchor: a };
          } catch {
          }
      }
    } catch (b) {
      Ke() && _("[router] assets fallback failed", b);
    }
    throw new Error("no page data");
  }
  return { data: d, pagePath: g, anchor: a };
}
function Fn() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var xt = Fn();
function na(e) {
  xt = e;
}
var Et = { exec: () => null };
function Ae(e, t = "") {
  let n = typeof e == "string" ? e : e.source, i = { replace: (r, a) => {
    let s = typeof a == "string" ? a : a.source;
    return s = s.replace(Ze.caret, "$1"), n = n.replace(r, s), i;
  }, getRegex: () => new RegExp(n, t) };
  return i;
}
var js = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), Ze = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (e) => new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}#`), htmlBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}>`) }, Hs = /^(?:[ \t]*(?:\n|$))+/, Us = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Fs = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, mn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Ws = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Rr = / {0,3}(?:[*+-]|\d{1,9}[.)])/, ra = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, ia = Ae(ra).replace(/bull/g, Rr).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Zs = Ae(ra).replace(/bull/g, Rr).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Cr = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Gs = /^[^\n]+/, Tr = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Qs = Ae(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Tr).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Xs = Ae(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Rr).getRegex(), Wn = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Pr = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Ks = Ae("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Pr).replace("tag", Wn).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), aa = Ae(Cr).replace("hr", mn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Wn).getRegex(), Vs = Ae(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", aa).getRegex(), $r = { blockquote: Vs, code: Us, def: Qs, fences: Fs, heading: Ws, hr: mn, html: Ks, lheading: ia, list: Xs, newline: Hs, paragraph: aa, table: Et, text: Gs }, pi = Ae("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", mn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Wn).getRegex(), Ys = { ...$r, lheading: Zs, table: pi, paragraph: Ae(Cr).replace("hr", mn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", pi).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Wn).getRegex() }, Js = { ...$r, html: Ae(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Pr).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Et, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: Ae(Cr).replace("hr", mn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ia).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, eo = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, to = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, sa = /^( {2,}|\\)\n(?!\s*$)/, no = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Zn = /[\p{P}\p{S}]/u, zr = /[\s\p{P}\p{S}]/u, oa = /[^\s\p{P}\p{S}]/u, ro = Ae(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, zr).getRegex(), la = /(?!~)[\p{P}\p{S}]/u, io = /(?!~)[\s\p{P}\p{S}]/u, ao = /(?:[^\s\p{P}\p{S}]|~)/u, ca = /(?![*_])[\p{P}\p{S}]/u, so = /(?![*_])[\s\p{P}\p{S}]/u, oo = /(?:[^\s\p{P}\p{S}]|[*_])/u, lo = Ae(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", js ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), ua = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, co = Ae(ua, "u").replace(/punct/g, Zn).getRegex(), uo = Ae(ua, "u").replace(/punct/g, la).getRegex(), ha = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", ho = Ae(ha, "gu").replace(/notPunctSpace/g, oa).replace(/punctSpace/g, zr).replace(/punct/g, Zn).getRegex(), fo = Ae(ha, "gu").replace(/notPunctSpace/g, ao).replace(/punctSpace/g, io).replace(/punct/g, la).getRegex(), po = Ae("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, oa).replace(/punctSpace/g, zr).replace(/punct/g, Zn).getRegex(), go = Ae(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, ca).getRegex(), mo = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", yo = Ae(mo, "gu").replace(/notPunctSpace/g, oo).replace(/punctSpace/g, so).replace(/punct/g, ca).getRegex(), bo = Ae(/\\(punct)/, "gu").replace(/punct/g, Zn).getRegex(), wo = Ae(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), _o = Ae(Pr).replace("(?:-->|$)", "-->").getRegex(), ko = Ae("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", _o).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), qn = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, xo = Ae(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", qn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), da = Ae(/^!?\[(label)\]\[(ref)\]/).replace("label", qn).replace("ref", Tr).getRegex(), fa = Ae(/^!?\[(ref)\](?:\[\])?/).replace("ref", Tr).getRegex(), So = Ae("reflink|nolink(?!\\()", "g").replace("reflink", da).replace("nolink", fa).getRegex(), gi = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Ir = { _backpedal: Et, anyPunctuation: bo, autolink: wo, blockSkip: lo, br: sa, code: to, del: Et, delLDelim: Et, delRDelim: Et, emStrongLDelim: co, emStrongRDelimAst: ho, emStrongRDelimUnd: po, escape: eo, link: xo, nolink: fa, punctuation: ro, reflink: da, reflinkSearch: So, tag: ko, text: no, url: Et }, vo = { ...Ir, link: Ae(/^!?\[(label)\]\((.*?)\)/).replace("label", qn).getRegex(), reflink: Ae(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", qn).getRegex() }, fr = { ...Ir, emStrongRDelimAst: fo, emStrongLDelim: uo, delLDelim: go, delRDelim: yo, url: Ae(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", gi).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: Ae(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", gi).getRegex() }, Ao = { ...fr, br: Ae(sa).replace("{2,}", "*").getRegex(), text: Ae(fr.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, En = { normal: $r, gfm: Ys, pedantic: Js }, Ut = { normal: Ir, gfm: fr, breaks: Ao, pedantic: vo }, Eo = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, mi = (e) => Eo[e];
function lt(e, t) {
  if (t) {
    if (Ze.escapeTest.test(e)) return e.replace(Ze.escapeReplace, mi);
  } else if (Ze.escapeTestNoEncode.test(e)) return e.replace(Ze.escapeReplaceNoEncode, mi);
  return e;
}
function yi(e) {
  try {
    e = encodeURI(e).replace(Ze.percentDecode, "%");
  } catch {
    return null;
  }
  return e;
}
function bi(e, t) {
  let n = e.replace(Ze.findPipe, (a, s, l) => {
    let o = !1, p = s;
    for (; --p >= 0 && l[p] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), i = n.split(Ze.splitPipe), r = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !i.at(-1)?.trim() && i.pop(), t) if (i.length > t) i.splice(t);
  else for (; i.length < t; ) i.push("");
  for (; r < i.length; r++) i[r] = i[r].trim().replace(Ze.slashPipe, "|");
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
function Lo(e, t) {
  if (e.indexOf(t[1]) === -1) return -1;
  let n = 0;
  for (let i = 0; i < e.length; i++) if (e[i] === "\\") i++;
  else if (e[i] === t[0]) n++;
  else if (e[i] === t[1] && (n--, n < 0)) return i;
  return n > 0 ? -2 : -1;
}
function Mo(e, t = 0) {
  let n = t, i = "";
  for (let r of e) if (r === "	") {
    let a = 4 - n % 4;
    i += " ".repeat(a), n += a;
  } else i += r, n++;
  return i;
}
function wi(e, t, n, i, r) {
  let a = t.href, s = t.title || null, l = e[1].replace(r.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  let o = { type: e[0].charAt(0) === "!" ? "image" : "link", raw: n, href: a, title: s, text: l, tokens: i.inlineTokens(l) };
  return i.state.inLink = !1, o;
}
function Ro(e, t, n) {
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
    this.options = e || xt;
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
      let n = t[0], i = Ro(n, t[3] || "", this.rules);
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
        let p = l.join(`
`), c = p.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${p}` : p, r = r ? `${r}
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
        let o = !1, p = "", c = "";
        if (!(t = a.exec(e)) || this.rules.block.hr.test(e)) break;
        p = t[0], e = e.substring(p.length);
        let u = Mo(t[2].split(`
`, 1)[0], t[1].length), h = e.split(`
`, 1)[0], m = !u.trim(), d = 0;
        if (this.options.pedantic ? (d = 2, c = u.trimStart()) : m ? d = t[1].length + 1 : (d = u.search(this.rules.other.nonSpaceChar), d = d > 4 ? 1 : d, c = u.slice(d), d += t[1].length), m && this.rules.other.blankLine.test(h) && (p += h + `
`, e = e.substring(h.length + 1), o = !0), !o) {
          let g = this.rules.other.nextBulletRegex(d), y = this.rules.other.hrRegex(d), f = this.rules.other.fencesBeginRegex(d), w = this.rules.other.headingBeginRegex(d), b = this.rules.other.htmlBeginRegex(d), k = this.rules.other.blockquoteBeginRegex(d);
          for (; e; ) {
            let S = e.split(`
`, 1)[0], v;
            if (h = S, this.options.pedantic ? (h = h.replace(this.rules.other.listReplaceNesting, "  "), v = h) : v = h.replace(this.rules.other.tabCharGlobal, "    "), f.test(h) || w.test(h) || b.test(h) || k.test(h) || g.test(h) || y.test(h)) break;
            if (v.search(this.rules.other.nonSpaceChar) >= d || !h.trim()) c += `
` + v.slice(d);
            else {
              if (m || u.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || f.test(u) || w.test(u) || y.test(u)) break;
              c += `
` + h;
            }
            m = !h.trim(), p += S + `
`, e = e.substring(S.length + 1), u = v.slice(d);
          }
        }
        r.loose || (s ? r.loose = !0 : this.rules.other.doubleBlankLine.test(p) && (s = !0)), r.items.push({ type: "list_item", raw: p, task: !!this.options.gfm && this.rules.other.listIsTask.test(c), loose: !1, text: c, tokens: [] }), r.raw += p;
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
          let p = this.rules.other.listTaskCheckbox.exec(o.raw);
          if (p) {
            let c = { type: "checkbox", raw: p[0] + " ", checked: p[0] !== "[ ]" };
            o.checked = c.checked, r.loose ? o.tokens[0] && ["paragraph", "text"].includes(o.tokens[0].type) && "tokens" in o.tokens[0] && o.tokens[0].tokens ? (o.tokens[0].raw = c.raw + o.tokens[0].raw, o.tokens[0].text = c.raw + o.tokens[0].text, o.tokens[0].tokens.unshift(c)) : o.tokens.unshift({ type: "paragraph", raw: c.raw, text: c.raw, tokens: [c] }) : o.tokens.unshift(c);
          }
        }
        if (!r.loose) {
          let p = o.tokens.filter((u) => u.type === "space"), c = p.length > 0 && p.some((u) => this.rules.other.anyLine.test(u.raw));
          r.loose = c;
        }
      }
      if (r.loose) for (let o of r.items) {
        o.loose = !0;
        for (let p of o.tokens) p.type === "text" && (p.type = "paragraph");
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
    let n = bi(t[1]), i = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: t[0], header: [], align: [], rows: [] };
    if (n.length === i.length) {
      for (let s of i) this.rules.other.tableAlignRight.test(s) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(s) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(s) ? a.align.push("left") : a.align.push(null);
      for (let s = 0; s < n.length; s++) a.header.push({ text: n[s], tokens: this.lexer.inline(n[s]), header: !0, align: a.align[s] });
      for (let s of r) a.rows.push(bi(s, a.header.length).map((l, o) => ({ text: l, tokens: this.lexer.inline(l), header: !1, align: a.align[o] })));
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
        let a = Lo(t[2], "()");
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
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? i = i.slice(1) : i = i.slice(1, -1)), wi(t, { href: i && i.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
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
      return wi(n, r, n[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, n = "") {
    let i = this.rules.inline.emStrongLDelim.exec(e);
    if (!(!i || i[3] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(i[1] || i[2]) || !n || this.rules.inline.punctuation.exec(n))) {
      let r = [...i[0]].length - 1, a, s, l = r, o = 0, p = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (p.lastIndex = 0, t = t.slice(-1 * e.length + r); (i = p.exec(t)) != null; ) {
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
        let p = [...i[0]][0].length, c = e.slice(0, r + i.index + p + s), u = c.slice(r, -r);
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
}, tt = class pr {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(t) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || xt, this.options.tokenizer = this.options.tokenizer || new un(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: Ze, block: En.normal, inline: Ut.normal };
    this.options.pedantic ? (n.block = En.pedantic, n.inline = Ut.pedantic) : this.options.gfm && (n.block = En.gfm, this.options.breaks ? n.inline = Ut.breaks : n.inline = Ut.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: En, inline: Ut };
  }
  static lex(t, n) {
    return new pr(n).lex(t);
  }
  static lexInline(t, n) {
    return new pr(n).inlineTokens(t);
  }
  lex(t) {
    t = t.replace(Ze.carriageReturn, `
`), this.blockTokens(t, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let i = this.inlineQueue[n];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(t, n = [], i = !1) {
    for (this.options.pedantic && (t = t.replace(Ze.tabCharGlobal, "    ").replace(Ze.spaceLine, "")); t; ) {
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
        this.options.extensions.startBlock.forEach((p) => {
          o = p.call({ lexer: this }, l), typeof o == "number" && o >= 0 && (s = Math.min(s, o));
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
      let p = t;
      if (this.options.extensions?.startInline) {
        let c = 1 / 0, u = t.slice(1), h;
        this.options.extensions.startInline.forEach((m) => {
          h = m.call({ lexer: this }, u), typeof h == "number" && h >= 0 && (c = Math.min(c, h));
        }), c < 1 / 0 && c >= 0 && (p = t.substring(0, c + 1));
      }
      if (o = this.tokenizer.inlineText(p)) {
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
    this.options = e || xt;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    let i = (t || "").match(Ze.notSpaceStart)?.[0], r = e.replace(Ze.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + lt(i) + '">' + (n ? r : lt(r, !0)) + `</code></pre>
` : "<pre><code>" + (n ? r : lt(r, !0)) + `</code></pre>
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
    return `<code>${lt(e, !0)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    let i = this.parser.parseInline(n), r = yi(e);
    if (r === null) return i;
    e = r;
    let a = '<a href="' + e + '"';
    return t && (a += ' title="' + lt(t) + '"'), a += ">" + i + "</a>", a;
  }
  image({ href: e, title: t, text: n, tokens: i }) {
    i && (n = this.parser.parseInline(i, this.parser.textRenderer));
    let r = yi(e);
    if (r === null) return lt(n);
    e = r;
    let a = `<img src="${e}" alt="${lt(n)}"`;
    return t && (a += ` title="${lt(t)}"`), a += ">", a;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : lt(e.text);
  }
}, Gn = class {
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
}, nt = class gr {
  options;
  renderer;
  textRenderer;
  constructor(t) {
    this.options = t || xt, this.options.renderer = this.options.renderer || new hn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Gn();
  }
  static parse(t, n) {
    return new gr(n).parse(t);
  }
  static parseInline(t, n) {
    return new gr(n).parseInline(t);
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
    this.options = e || xt;
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
}, pa = class {
  defaults = Fn();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = nt;
  Renderer = hn;
  TextRenderer = Gn;
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
          r[s] = (...p) => {
            let c = l.apply(r, p);
            return c === !1 && (c = o.apply(r, p)), c || "";
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
          r[s] = (...p) => {
            let c = l.apply(r, p);
            return c === !1 && (c = o.apply(r, p)), c;
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
          Ot.passThroughHooks.has(a) ? r[s] = (p) => {
            if (this.defaults.async && Ot.passThroughHooksRespectAsync.has(a)) return (async () => {
              let u = await l.call(r, p);
              return o.call(r, u);
            })();
            let c = l.call(r, p);
            return o.call(r, c);
          } : r[s] = (...p) => {
            if (this.defaults.async) return (async () => {
              let u = await l.apply(r, p);
              return u === !1 && (u = await o.apply(r, p)), u;
            })();
            let c = l.apply(r, p);
            return c === !1 && (c = o.apply(r, p)), c;
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
        let p = await (r.hooks ? await r.hooks.provideParser() : e ? nt.parse : nt.parseInline)(o, r);
        return r.hooks ? await r.hooks.postprocess(p) : p;
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
        let i = "<p>An error occurred:</p><pre>" + lt(n.message + "", !0) + "</pre>";
        return t ? Promise.resolve(i) : i;
      }
      if (t) return Promise.reject(n);
      throw n;
    };
  }
}, Tt = new pa();
function we(e, t) {
  return Tt.parse(e, t);
}
we.options = we.setOptions = function(e) {
  return Tt.setOptions(e), we.defaults = Tt.defaults, na(we.defaults), we;
};
we.getDefaults = Fn;
we.defaults = xt;
we.use = function(...e) {
  return Tt.use(...e), we.defaults = Tt.defaults, na(we.defaults), we;
};
we.walkTokens = function(e, t) {
  return Tt.walkTokens(e, t);
};
we.parseInline = Tt.parseInline;
we.Parser = nt;
we.parser = nt.parse;
we.Renderer = hn;
we.TextRenderer = Gn;
we.Lexer = tt;
we.lexer = tt.lex;
we.Tokenizer = un;
we.Hooks = Ot;
we.parse = we;
var Co = we.options, To = we.setOptions, Po = we.use, $o = we.walkTokens, zo = we.parseInline, Io = we, Oo = nt.parse, No = tt.lex;
const _i = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hooks: Ot,
  Lexer: tt,
  Marked: pa,
  Parser: nt,
  Renderer: hn,
  TextRenderer: Gn,
  Tokenizer: un,
  get defaults() {
    return xt;
  },
  getDefaults: Fn,
  lexer: No,
  marked: we,
  options: Co,
  parse: Io,
  parseInline: zo,
  parser: Oo,
  setOptions: To,
  use: Po,
  walkTokens: $o
}, Symbol.toStringTag, { value: "Module" })), ga = `function O() {
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
`, ki = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", ga], { type: "text/javascript;charset=utf-8" });
function Bo(e) {
  let t;
  try {
    if (t = ki && (self.URL || self.webkitURL).createObjectURL(ki), !t) throw "";
    const n = new Worker(t, {
      type: "module",
      name: e?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(t);
    }), n;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(ga),
      {
        type: "module",
        name: e?.name
      }
    );
  }
}
function Dn(e) {
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
function ma(e) {
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
const Jt = _i && (we || _i) || void 0;
let Fe = null;
const qo = "https://cdn.jsdelivr.net/npm/highlight.js";
async function jn() {
  if (Fe) return Fe;
  try {
    try {
      const e = await import(qo + "/lib/core.js");
      Fe = e.default || e;
    } catch {
      Fe = null;
    }
  } catch {
    Fe = null;
  }
  return Fe;
}
Jt && typeof Jt.setOptions == "function" && Jt.setOptions({
  gfm: !0,
  headerIds: !0,
  mangle: !1,
  highlighted: (e, t) => {
    try {
      return Fe && t && typeof Fe.getLanguage == "function" && Fe.getLanguage(t) ? Fe.highlight(e, { language: t }).value : Fe && typeof Fe.getLanguage == "function" && Fe.getLanguage("plaintext") ? Fe.highlight(e, { language: "plaintext" }).value : e;
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
        if (!await jn()) {
          postMessage({ type: "register-error", name: c, error: "hljs unavailable" });
          return;
        }
        const m = await import(u), d = m.default || m;
        Fe.registerLanguage(c, d), postMessage({ type: "registered", name: c });
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
    const { id: n, md: i } = t, { content: r, data: a } = Dn(i || "");
    await jn().catch(() => {
    });
    let s = Jt.parse(r);
    const l = [], o = /* @__PURE__ */ new Map(), p = (c) => {
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
        g = ma(g);
      } catch {
      }
      let y = null;
      const f = (h || "").match(/\sid="([^"]+)"/);
      f && (y = f[1]);
      const w = y || p(g) || "heading", k = (o.get(w) || 0) + 1;
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
      }, C = d <= 2 ? "has-text-weight-bold" : d <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", U = (v[d] + " " + C).trim(), q = ((h || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${S}" class="${U}"`).trim();
      return `<h${d} ${q}>${m}</h${d}>`;
    }), s = s.replace(/<img([^>]*)>/g, (c, u) => /\bloading=/.test(u) ? `<img${u}>` : /\bdata-want-lazy=/.test(u) ? `<img${u}>` : `<img${u} loading="lazy">`), postMessage({ id: n, result: { html: s, meta: a || {}, toc: l } });
  } catch (n) {
    postMessage({ id: t.id, error: String(n) });
  }
};
async function Do(e) {
  try {
    if (e && e.type === "register") {
      const { name: o, url: p } = e;
      try {
        if (!await jn()) return { type: "register-error", name: o, error: "hljs unavailable" };
        const u = await import(p), h = u.default || u;
        return Fe.registerLanguage(o, h), { type: "registered", name: o };
      } catch (c) {
        return { type: "register-error", name: o, error: String(c) };
      }
    }
    if (e && e.type === "detect") {
      const o = e.md || "", p = e.supported || [], c = /* @__PURE__ */ new Set(), u = /``\`\s*([a-zA-Z0-9_\-+]+)?/g;
      let h;
      for (; h = u.exec(o); )
        if (h[1]) {
          const m = String(h[1]).toLowerCase();
          if (!m) continue;
          if (m.length >= 5 && m.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(m) && c.add(m), (/* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"])).has(m) && c.add(m), p && p.length)
            try {
              p.indexOf(m) !== -1 && c.add(m);
            } catch {
            }
        }
      return { id: e.id, result: Array.from(c) };
    }
    const t = e && e.id, { content: n, data: i } = Dn(e && e.md || "");
    await jn().catch(() => {
    });
    let r = Jt.parse(n);
    const a = [], s = /* @__PURE__ */ new Map(), l = (o) => {
      try {
        return String(o || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    };
    return r = r.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (o, p, c, u) => {
      const h = Number(p);
      let m = u.replace(/<[^>]+>/g, "").trim();
      try {
        m = ma(m);
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
      }, S = h <= 2 ? "has-text-weight-bold" : h <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", v = (k[h] + " " + S).trim(), U = ((c || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${b}" class="${v}"`).trim();
      return `<h${h} ${U}>${u}</h${h}>`;
    }), r = r.replace(/<img([^>]*)>/g, (o, p) => /\bloading=/.test(p) ? `<img${p}>` : /\bdata-want-lazy=/.test(p) ? `<img${p}>` : `<img${p} loading="lazy">`), { id: t, result: { html: r, meta: i || {}, toc: a } };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
const ir = {
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
let Ln = typeof DOMParser < "u" ? new DOMParser() : null;
function Pt() {
  return Ln || (typeof DOMParser < "u" ? (Ln = new DOMParser(), Ln) : null);
}
const jo = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2;
function Ho() {
  if (typeof Worker < "u")
    try {
      return new Bo();
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
          const r = { data: await Do(n) }(e.message || []).forEach((a) => a(r));
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
const ya = qi(() => Ho(), "markdown", jo), Mt = () => ya.get(), Or = (e, t = 3e3) => ya.send(e, t), ht = [];
function mr(e) {
  if (e && (typeof e == "object" || typeof e == "function")) {
    ht.push(e);
    try {
      we.use(e);
    } catch (t) {
      _("[markdown] failed to apply plugin", t);
    }
  }
}
function Uo(e) {
  ht.length = 0, Array.isArray(e) && ht.push(...e.filter((t) => t && typeof t == "object"));
  try {
    ht.forEach((t) => we.use(t));
  } catch (t) {
    _("[markdown] failed to apply markdown extensions", t);
  }
}
async function dn(e) {
  if (ht && ht.length) {
    let { content: i, data: r } = Dn(e || "");
    try {
      i = String(i || "").replace(/:([^:\s]+):/g, (s, l) => ir[l] || s);
    } catch {
    }
    we.setOptions({ gfm: !0, mangle: !1, headerIds: !1, headerPrefix: "" });
    try {
      ht.forEach((s) => we.use(s));
    } catch (s) {
      _("[markdown] apply plugins failed", s);
    }
    const a = we.parse(i);
    try {
      const s = Pt();
      if (s) {
        const l = s.parseFromString(a, "text/html"), o = l.querySelectorAll("h1,h2,h3,h4,h5,h6"), p = [], c = /* @__PURE__ */ new Set(), u = (m) => {
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
            let y = u(g) || "heading", f = y, w = 2;
            for (; c.has(f); )
              f = y + "-" + w, w += 1;
            c.add(f), m.id = f, m.className = h(d), p.push({ level: d, text: g, id: f });
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
        return { html: l.body.innerHTML, meta: r || {}, toc: p };
      }
    } catch {
    }
    return { html: a, meta: r || {}, toc: [] };
  }
  let t;
  if (typeof process < "u" && process.env && process.env.VITEST)
    try {
      const i = await Promise.resolve().then(() => ba);
      t = i.initRendererWorker && i.initRendererWorker();
    } catch {
      t = Mt && Mt();
    }
  else
    t = Mt && Mt();
  try {
    e = String(e || "").replace(/:([^:\s]+):/g, (i, r) => ir[r] || i);
  } catch {
  }
  try {
    if (typeof Ee < "u" && Ee && typeof Ee.getLanguage == "function" && Ee.getLanguage("plaintext") && /```\s*\n/.test(String(e || ""))) {
      let { content: i, data: r } = Dn(e || "");
      try {
        i = String(i || "").replace(/:([^:\s]+):/g, (p, c) => ir[c] || p);
      } catch {
      }
      we.setOptions({ gfm: !0, headerIds: !0, mangle: !1, highlighted: (p, c) => {
        try {
          return c && Ee.getLanguage && Ee.getLanguage(c) ? Ee.highlight(p, { language: c }).value : Ee && typeof Ee.getLanguage == "function" && Ee.getLanguage("plaintext") ? Ee.highlight(p, { language: "plaintext" }).value : p;
        } catch {
          return p;
        }
      } });
      let a = we.parse(i);
      try {
        a = a.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (p, c) => {
          try {
            if (c && Ee && typeof Ee.highlight == "function")
              try {
                const u = Ee.highlight(c, { language: "plaintext" });
                return `<pre><code>${u && u.value ? u.value : u}</code></pre>`;
              } catch {
                try {
                  if (Ee && typeof Ee.highlightElement == "function") {
                    const h = { innerHTML: c };
                    return Ee.highlightElement(h), `<pre><code>${h.innerHTML}</code></pre>`;
                  }
                } catch {
                }
              }
          } catch {
          }
          return p;
        });
      } catch {
      }
      const s = [], l = /* @__PURE__ */ new Set(), o = (p) => {
        try {
          return String(p || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
        } catch {
          return "heading";
        }
      };
      return a = a.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (p, c, u, h) => {
        const m = Number(c), d = h.replace(/<[^>]+>/g, "").trim();
        let g = o(d) || "heading", y = g, f = 2;
        for (; l.has(y); )
          y = g + "-" + f, f += 1;
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
      }), a = a.replace(/<img([^>]*)>/g, (p, c) => /\bloading=/.test(c) ? `<img${c}>` : /\bdata-want-lazy=/.test(c) ? `<img${c}>` : `<img${c} loading="lazy">`), { html: a, meta: r || {}, toc: s };
    }
  } catch {
  }
  if (!t) throw new Error("renderer worker required but unavailable");
  const n = await Or({ type: "render", md: e });
  if (!n || typeof n != "object" || n.html === void 0) throw new Error("renderer worker returned invalid response");
  try {
    const i = /* @__PURE__ */ new Map(), r = [], a = (o) => {
      try {
        return String(o || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    }, s = (o) => {
      const p = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, c = o <= 2 ? "has-text-weight-bold" : o <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
      return (p[o] + " " + c).trim();
    };
    let l = n.html;
    l = l.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (o, p, c, u) => {
      const h = Number(p), m = u.replace(/<[^>]+>/g, "").trim(), d = (c || "").match(/\sid="([^"]+)"/), g = d ? d[1] : a(m) || "heading", f = (i.get(g) || 0) + 1;
      i.set(g, f);
      const w = f === 1 ? g : g + "-" + f;
      r.push({ level: h, text: m, id: w });
      const b = s(h), S = ((c || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${w}" class="${b}"`).trim();
      return `<h${h} ${S}>${u}</h${h}>`;
    });
    try {
      const o = typeof document < "u" && document.documentElement && document.documentElement.getAttribute && document.documentElement.getAttribute("data-nimbi-logo-moved") || "";
      if (o) {
        const p = Pt();
        if (p) {
          const c = p.parseFromString(l, "text/html");
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
      if ($i.has(l) || t && t.size && l.length < 3 && !t.has(l) && !(Ve && Ve[l] && t.has(Ve[l]))) continue;
      if (t && t.size) {
        if (t.has(l)) {
          const p = t.get(l);
          p && n.add(p);
          continue;
        }
        if (Ve && Ve[l]) {
          const p = Ve[l];
          if (t.has(p)) {
            const c = t.get(p) || p;
            n.add(c);
            continue;
          }
        }
      }
      (a.has(l) || l.length >= 5 && l.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(l) && !r.has(l)) && n.add(l);
    }
  return n;
}
async function yr(e, t) {
  if (ht && ht.length || typeof process < "u" && process.env && process.env.VITEST) return en(e || "", t);
  if (Mt && Mt())
    try {
      const i = t && t.size ? Array.from(t.keys()) : [], r = await Or({ type: "detect", md: String(e || ""), supported: i });
      if (Array.isArray(r)) return new Set(r);
    } catch (i) {
      _("[markdown] detectFenceLanguagesAsync worker failed", i);
    }
  return en(e || "", t);
}
const ba = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _sendToRenderer: Or,
  addMarkdownExtension: mr,
  detectFenceLanguages: en,
  detectFenceLanguagesAsync: yr,
  initRendererWorker: Mt,
  markdownPlugins: ht,
  parseMarkdownToHtml: dn,
  setMarkdownExtensions: Uo
}, Symbol.toStringTag, { value: "Module" })), Fo = `/**
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
        await Nr(o, r, a, { canonical: !0 }), postMessage({ id: n, result: l.body.innerHTML });
      } catch (s) {
        postMessage({ id: n, error: String(s) });
      }
      return;
    }
  } catch (n) {
    postMessage({ id: t.id, error: String(n) });
  }
};
async function Wo(e) {
  try {
    if (e && e.type === "rewriteAnchors") {
      const { id: t, html: n, contentBase: i, pagePath: r } = e;
      try {
        const s = new DOMParser().parseFromString(n || "", "text/html"), l = s.body;
        return await Nr(l, i, r, { canonical: !0 }), { id: t, result: s.body.innerHTML };
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
    return String(n) + si(e, t);
  } catch {
    return si(e, t);
  }
}
function Zo(...e) {
  try {
    _(...e);
  } catch {
  }
}
function Hn(e) {
  try {
    if ($t(3)) return !0;
  } catch {
  }
  try {
    if (typeof ne == "string" && ne) return !0;
  } catch {
  }
  try {
    if (K && K.size) return !0;
  } catch {
  }
  try {
    if (Te && Te.length) return !0;
  } catch {
  }
  return !1;
}
function Go(e, t) {
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
function Qo(e, t) {
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
        l.setAttribute("href", Me(o));
      } catch {
        o && o.indexOf("/") === -1 ? l.setAttribute("href", "#" + encodeURIComponent(o)) : l.setAttribute("href", at(o));
      }
    } catch {
      l.setAttribute("href", "#" + a.path);
    }
    if (l.textContent = a.name, s.appendChild(l), a.children && a.children.length) {
      const o = document.createElement("ul");
      a.children.forEach((p) => {
        const c = document.createElement("li"), u = document.createElement("a");
        try {
          const h = String(p.path || "");
          try {
            u.setAttribute("href", Me(h));
          } catch {
            h && h.indexOf("/") === -1 ? u.setAttribute("href", "#" + encodeURIComponent(h)) : u.setAttribute("href", at(h));
          }
        } catch {
          u.setAttribute("href", "#" + p.path);
        }
        u.textContent = p.name, c.appendChild(u), o.appendChild(c);
      }), s.appendChild(o);
    }
    r.appendChild(s);
  }), n.appendChild(r), n;
}
function Xo(e, t, n = "") {
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
        const p = Number(o.level) >= 2 ? Number(o.level) : 2, c = document.createElement("li"), u = document.createElement("a"), h = hs(o.text || ""), m = o.id || ke(h);
        u.textContent = h;
        try {
          const f = String(n || "").replace(/^[\\.\\/]+/, ""), w = f && j && j.has && j.has(f) ? j.get(f) : f;
          w ? u.href = Me(w, m) : u.href = `#${encodeURIComponent(m)}`;
        } catch (f) {
          _("[htmlBuilder] buildTocElement href normalization failed", f), u.href = `#${encodeURIComponent(m)}`;
        }
        if (c.appendChild(u), p === 2) {
          a.appendChild(c), l[2] = c, Object.keys(l).forEach((f) => {
            Number(f) > 2 && delete l[f];
          });
          return;
        }
        let d = p - 1;
        for (; d > 2 && !l[d]; ) d--;
        d < 2 && (d = 2);
        let g = l[d];
        if (!g) {
          a.appendChild(c), l[p] = c;
          return;
        }
        let y = g.querySelector("ul");
        y || (y = document.createElement("ul"), g.appendChild(y)), y.appendChild(c), l[p] = c;
      } catch (p) {
        _("[htmlBuilder] buildTocElement item failed", p, o);
      }
    });
  } catch (l) {
    _("[htmlBuilder] buildTocElement failed", l);
  }
  return i.appendChild(a), a.querySelectorAll("li").length <= 1 ? null : i;
}
function wa(e) {
  e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((n) => {
    n.id || (n.id = ke(n.textContent || ""));
  });
}
function Ko(e, t, n) {
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
function xi(e, t, n) {
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
        const l = s.tagName ? s.tagName.toLowerCase() : "", o = (p) => {
          try {
            const c = s.getAttribute(p) || "";
            if (!c || /^(https?:)?\/\//i.test(c) || c.startsWith("/") || c.startsWith("#")) return;
            try {
              s.setAttribute(p, new URL(c, r).toString());
            } catch (u) {
              _("[htmlBuilder] rewrite asset attribute failed", p, c, u);
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
let Si = "", ar = null, vi = "";
async function Nr(e, t, n, i = {}) {
  try {
    i = i || {}, typeof i.canonical > "u" && (i.canonical = !0);
    const r = e.querySelectorAll("a");
    if (!r || !r.length) return;
    let a, s;
    if (t === Si && ar)
      a = ar, s = vi;
    else {
      try {
        a = new URL(t, location.href), s = Ct(a.pathname);
      } catch {
        try {
          a = new URL(t, location.href), s = Ct(a.pathname);
        } catch {
          a = null, s = "/";
        }
      }
      Si = t, ar = a, vi = s;
    }
    const l = /* @__PURE__ */ new Set(), o = [], p = /* @__PURE__ */ new Set(), c = [];
    for (const u of Array.from(r))
      try {
        try {
          if (u.closest && u.closest("h1,h2,h3,h4,h5,h6")) continue;
        } catch {
        }
        const h = u.getAttribute("href") || "";
        if (!h || Di(h)) continue;
        try {
          if (h.startsWith("?") || h.indexOf("?") !== -1)
            try {
              const d = new URL(h, t || location.href), g = d.searchParams.get("page");
              if (g && g.indexOf("/") === -1 && n) {
                const y = n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "";
                if (y) {
                  const f = le(y + g), w = i && i.canonical ? Me(f, d.hash ? d.hash.replace(/^#/, "") : null) : at(f, d.hash ? d.hash.replace(/^#/, "") : null);
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
            let f = y.startsWith(s) ? y.slice(s.length) : y;
            f = le(f), o.push({ node: u, mdPathRaw: d, frag: g, rel: f }), j.has(f) || l.add(f);
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
            let f = y.startsWith(s) ? y.slice(s.length) : y;
            if (f = le(f), f = qt(f), f || (f = Ar), !f.endsWith(".md")) {
              let w = null;
              try {
                if (j && j.has && j.has(f))
                  w = j.get(f);
                else
                  try {
                    const b = String(f || "").replace(/^.*\//, "");
                    b && j.has && j.has(b) && (w = j.get(b));
                  } catch (b) {
                    _("[htmlBuilder] mdToSlug baseName check failed", b);
                  }
              } catch (b) {
                _("[htmlBuilder] mdToSlug access check failed", b);
              }
              if (!w)
                try {
                  const b = String(f || "").replace(/^.*\//, "");
                  for (const [k, S] of K || [])
                    if (S === f || S === b) {
                      w = k;
                      break;
                    }
                } catch {
                }
              if (w) {
                const b = i && i.canonical ? Me(w, null) : at(w);
                u.setAttribute("href", b);
              } else {
                let b = f;
                try {
                  /\.[^\/]+$/.test(String(f || "")) || (b = String(f || "") + ".html");
                } catch {
                  b = f;
                }
                p.add(b), c.push({ node: u, rel: b });
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
      if (Hn(t))
        await Promise.all(Array.from(l).map(async (u) => {
          try {
            try {
              const m = String(u).match(/([^\/]+)\.md$/), d = m && m[1];
              if (d && K.has(d)) {
                try {
                  const g = K.get(d);
                  if (g)
                    try {
                      j.set(g, d);
                    } catch (y) {
                      _("[htmlBuilder] mdToSlug.set failed", y);
                    }
                } catch (g) {
                  _("[htmlBuilder] reading slugToMd failed", g);
                }
                return;
              }
            } catch (m) {
              _("[htmlBuilder] basename slug lookup failed", m);
            }
            const h = await ve(u, t);
            if (h && h.raw) {
              const m = (h.raw || "").match(/^#\s+(.+)$/m);
              if (m && m[1]) {
                const d = ke(m[1].trim());
                if (d)
                  try {
                    K.set(d, u), j.set(u, d);
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
                  K.has(d) || K.set(d, u), j.has(u) || j.set(u, d);
                } catch (g) {
                  _("[htmlBuilder] setting fallback slug mapping failed", g);
                }
            }
          } catch {
          }
      }
    if (p.size)
      if (Hn(t))
        await Promise.all(Array.from(p).map(async (u) => {
          try {
            const h = await ve(u, t);
            if (h && h.raw)
              try {
                const d = Pt().parseFromString(h.raw, "text/html"), g = d.querySelector("title"), y = d.querySelector("h1"), f = g && g.textContent && g.textContent.trim() ? g.textContent.trim() : y && y.textContent ? y.textContent.trim() : null;
                if (f) {
                  const w = ke(f);
                  if (w)
                    try {
                      K.set(w, u), j.set(u, w);
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
        for (const u of Array.from(p))
          try {
            const h = String(u).match(/([^\/]+)\.html$/), m = h && h[1];
            if (m) {
              const d = ke(m);
              if (d)
                try {
                  K.has(d) || K.set(d, u), j.has(u) || j.set(u, d);
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
        j.has(d) && (g = j.get(d));
      } catch (y) {
        _("[htmlBuilder] mdToSlug access failed", y);
      }
      if (g) {
        const y = i && i.canonical ? Me(g, m) : at(g, m);
        h.setAttribute("href", y);
      } else {
        const y = i && i.canonical ? Me(d, m) : at(d, m);
        h.setAttribute("href", y);
      }
    }
    for (const u of c) {
      const { node: h, rel: m } = u;
      let d = null;
      try {
        j.has(m) && (d = j.get(m));
      } catch (g) {
        _("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo", g);
      }
      if (!d)
        try {
          const g = String(m || "").replace(/^.*\//, "");
          j.has(g) && (d = j.get(g));
        } catch (g) {
          _("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo", g);
        }
      if (d) {
        const g = i && i.canonical ? Me(d, null) : at(d);
        h.setAttribute("href", g);
      } else {
        const g = i && i.canonical ? Me(m, null) : at(m);
        h.setAttribute("href", g);
      }
    }
  } catch (r) {
    _("[htmlBuilder] rewriteAnchors failed", r);
  }
}
function Vo(e, t, n, i) {
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
    !l && n && (l = String(n)), l && (s = ke(l)), s || (s = Ar);
    try {
      n && (K.set(s, n), j.set(n, s));
    } catch (o) {
      _("[htmlBuilder] computeSlug set slug mapping failed", o);
    }
    try {
      let o = i || "";
      if (!o)
        try {
          const p = Ye(typeof location < "u" ? location.href : "");
          p && p.anchor && p.page && String(p.page) === String(s) ? o = p.anchor : o = "";
        } catch {
          o = "";
        }
      try {
        history.replaceState({ page: s }, "", at(s, o));
      } catch (p) {
        _("[htmlBuilder] computeSlug history replace failed", p);
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
async function Yo(e, t) {
  if (!e || !e.length) return;
  const n = /* @__PURE__ */ new Set();
  for (const o of Array.from(e || []))
    try {
      const p = o.getAttribute("href") || "";
      if (!p) continue;
      let h = le(p).split(/::|#/, 2)[0];
      try {
        const d = h.indexOf("?");
        d !== -1 && (h = h.slice(0, d));
      } catch {
      }
      if (!h || (h.includes(".") || (h = h + ".html"), !/\.html(?:$|[?#])/.test(h) && !h.toLowerCase().endsWith(".html"))) continue;
      const m = h;
      try {
        if (j && j.has && j.has(m)) continue;
      } catch (d) {
        _("[htmlBuilder] mdToSlug check failed", d);
      }
      try {
        let d = !1;
        for (const g of K.values())
          if (g === m) {
            d = !0;
            break;
          }
        if (d) continue;
      } catch (d) {
        _("[htmlBuilder] slugToMd iteration failed", d);
      }
      n.add(m);
    } catch (p) {
      _("[htmlBuilder] preScanHtmlSlugs anchor iteration failed", p);
    }
  if (!n.size) return;
  if (!Hn()) {
    try {
      _("[htmlBuilder] skipping preScanHtmlSlugs (probing disabled)");
    } catch {
    }
    for (const o of Array.from(n))
      try {
        const p = String(o).match(/([^\/]+)\.html$/), c = p && p[1];
        if (c) {
          const u = ke(c);
          if (u)
            try {
              K.has(u) || K.set(u, o), j.has(o) || j.set(o, u);
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
      const p = await ve(o, t);
      if (p && p.raw)
        try {
          const u = Pt().parseFromString(p.raw, "text/html"), h = u.querySelector("title"), m = u.querySelector("h1"), d = h && h.textContent && h.textContent.trim() ? h.textContent.trim() : m && m.textContent ? m.textContent.trim() : null;
          if (d) {
            const g = ke(d);
            if (g)
              try {
                K.set(g, o), j.set(o, g);
              } catch (y) {
                _("[htmlBuilder] set slugToMd/mdToSlug failed", y);
              }
          }
        } catch (c) {
          _("[htmlBuilder] parse HTML title failed", c);
        }
    } catch (p) {
      _("[htmlBuilder] fetchAndExtract failed", p);
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
async function Jo(e, t) {
  if (!e || !e.length) return;
  const n = [], i = /* @__PURE__ */ new Set();
  let r = "";
  try {
    const a = new URL(t, typeof location < "u" ? location.href : "http://localhost/");
    r = Ct(a.pathname);
  } catch (a) {
    r = "", _("[htmlBuilder] preMapMdSlugs parse base failed", a);
  }
  for (const a of Array.from(e || []))
    try {
      const s = a.getAttribute("href") || "";
      if (!s) continue;
      const l = s.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (l) {
        let o = le(l[1]);
        try {
          let p;
          try {
            p = Go(o, t);
          } catch (u) {
            p = o, _("[htmlBuilder] resolve mdPath URL failed", u);
          }
          const c = p && r && p.startsWith(r) ? p.slice(r.length) : String(p || "").replace(/^\//, "");
          n.push({ rel: c }), j.has(c) || i.add(c);
        } catch (p) {
          _("[htmlBuilder] rewriteAnchors failed", p);
        }
        continue;
      }
    } catch (s) {
      _("[htmlBuilder] preMapMdSlugs anchor iteration failed", s);
    }
  if (i.size)
    if (Hn())
      await Promise.all(Array.from(i).map(async (a) => {
        try {
          const s = String(a).match(/([^\/]+)\.md$/), l = s && s[1];
          if (l && K.has(l)) {
            try {
              const o = K.get(l);
              o && j.set(o, l);
            } catch (o) {
              _("[htmlBuilder] preMapMdSlugs slug map access failed", o);
            }
            return;
          }
        } catch (s) {
          _("[htmlBuilder] preMapMdSlugs basename check failed", s);
        }
        try {
          const s = await ve(a, t);
          if (s && s.raw) {
            const l = (s.raw || "").match(/^#\s+(.+)$/m);
            if (l && l[1]) {
              const o = ke(l[1].trim());
              if (o)
                try {
                  K.set(o, a), j.set(a, o);
                } catch (p) {
                  _("[htmlBuilder] preMapMdSlugs setting slug mapping failed", p);
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
Pt();
function sr(e) {
  try {
    const n = Pt().parseFromString(e || "", "text/html");
    wa(n);
    try {
      n.querySelectorAll("img").forEach((o) => {
        try {
          o.getAttribute("loading") || o.setAttribute("data-want-lazy", "1");
        } catch (p) {
          _("[htmlBuilder] parseHtml set image loading attribute failed", p);
        }
      });
    } catch (l) {
      _("[htmlBuilder] parseHtml query images failed", l);
    }
    n.querySelectorAll("pre code, code[class]").forEach((l) => {
      try {
        const o = l.getAttribute && l.getAttribute("class") || l.className || "", p = o.match(/language-([a-zA-Z0-9_+-]+)/) || o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (p && p[1]) {
          const c = (p[1] || "").toLowerCase(), u = _e.size && (_e.get(c) || _e.get(String(c).toLowerCase())) || c;
          try {
            (async () => {
              try {
                await on(u);
              } catch (h) {
                _("[htmlBuilder] registerLanguage failed", h);
              }
            })();
          } catch (h) {
            _("[htmlBuilder] schedule registerLanguage failed", h);
          }
        } else
          try {
            if (Ee && typeof Ee.getLanguage == "function" && Ee.getLanguage("plaintext")) {
              const c = Ee.highlight ? Ee.highlight(l.textContent || "", { language: "plaintext" }) : null;
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
async function el(e) {
  const t = yr ? await yr(e || "", _e) : en(e || "", _e), n = new Set(t), i = [];
  for (const r of n)
    try {
      const a = _e.size && (_e.get(r) || _e.get(String(r).toLowerCase())) || r;
      try {
        i.push(on(a));
      } catch (s) {
        _("[htmlBuilder] ensureLanguages push canonical failed", s);
      }
      if (String(r) !== String(a))
        try {
          i.push(on(r));
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
async function tl(e) {
  if (await el(e), dn) {
    const t = await dn(e || "");
    return !t || typeof t != "object" ? { html: String(e || ""), meta: {}, toc: [] } : (Array.isArray(t.toc) || (t.toc = []), t.meta || (t.meta = {}), t);
  }
  return { html: String(e || ""), meta: {}, toc: [] };
}
async function nl(e, t, n, i, r) {
  let a = null;
  if (t.isHtml)
    try {
      const u = Pt();
      if (u) {
        const h = u.parseFromString(t.raw || "", "text/html");
        try {
          xi(h.body, n, r);
        } catch (m) {
          _("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)", m);
        }
        a = sr(h.documentElement && h.documentElement.outerHTML ? h.documentElement.outerHTML : t.raw || "");
      } else
        a = sr(t.raw || "");
    } catch {
      a = sr(t.raw || "");
    }
  else
    a = await tl(t.raw || "");
  const s = document.createElement("article");
  s.className = "nimbi-article content", s.innerHTML = a.html;
  try {
    xi(s, n, r);
  } catch (u) {
    _("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle", u);
  }
  try {
    wa(s);
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
    ts(s);
  } catch (u) {
    _("[htmlBuilder] observeCodeBlocks failed", u);
  }
  Ko(s, n, r);
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
  const { topH1: l, h1Text: o, slugKey: p } = Vo(a, s, n, i);
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
        const y = document.createElement("p"), f = g[0] ? String(g[0]).replace(/"/g, "").trim() : "", w = g.slice(1);
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
    await sl(s, r, n);
  } catch (u) {
    Zo("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", u), await Nr(s, r, n);
  }
  const c = Xo(e, a.toc, n);
  return { article: s, parsed: a, toc: c, topH1: l, h1Text: o, slugKey: p };
}
function rl(e) {
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
                Cn("[htmlBuilder] executed inline script via Function");
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
              Cn("[htmlBuilder] injected script loaded", { src: r, hasNimbi: !!(window && window.nimbiCMS) });
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
            Cn("[htmlBuilder] executed injected script", r);
          } catch {
          }
        } catch (i) {
          _("[htmlBuilder] execute injected script failed", i);
        }
    } catch {
    }
}
function Ai(e, t, n) {
  e && (e.innerHTML = "");
  const i = document.createElement("article");
  i.className = "nimbi-article content nimbi-not-found";
  const r = document.createElement("h1");
  r.textContent = t && t("notFound") || "Page not found";
  const a = document.createElement("p");
  a.textContent = n && n.message ? String(n.message) : "Failed to resolve the requested page.", i.appendChild(r), i.appendChild(a), e && e.appendChild && e.appendChild(i);
  try {
    if (!ne)
      try {
        const s = document.createElement("p"), l = t && t("goHome") || "Go back to";
        s.textContent = l + " ";
        const o = document.createElement("a");
        try {
          o.href = Me(et);
        } catch {
          o.href = Me(et || "");
        }
        o.textContent = t && t("home") || "Home", s.appendChild(o), e && e.appendChild && e.appendChild(s);
      } catch {
      }
  } catch {
  }
  try {
    try {
      $n({ title: t && t("notFound") || "Not Found", description: t && t("notFoundDescription") || "" }, ne, t && t("notFound") || "Not Found", t && t("notFoundDescription") || "");
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
const _a = ls(() => {
  const e = Qt(Fo);
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
          const r = { data: await Wo(n) };
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
function il() {
  return _a.get();
}
function al(e) {
  return _a.send(e, 2e3);
}
async function sl(e, t, n) {
  if (!il()) throw new Error("anchor worker unavailable");
  if (!e || typeof e.innerHTML != "string") throw new Error("invalid article element");
  const r = String(e.innerHTML), a = await al({ type: "rewriteAnchors", html: r, contentBase: t, pagePath: n });
  if (a && typeof a == "string")
    try {
      e.innerHTML = a;
    } catch (s) {
      _("[htmlBuilder] applying rewritten anchors failed", s);
    }
}
function ol(e) {
  try {
    e.addEventListener("click", (t) => {
      const n = t.target && t.target.closest ? t.target.closest("a") : null;
      if (!n) return;
      const i = n.getAttribute("href") || "";
      try {
        const r = Ye(i), a = r && r.page ? r.page : null, s = r && r.anchor ? r.anchor : null;
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
                history.replaceState({ page: l || a }, "", at(l || a, s));
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
            br(s);
          } catch (o) {
            _("[htmlBuilder] scrollToAnchorOrTop failed", o);
          }
          return;
        }
        history.pushState({ page: a }, "", at(a, s));
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
function br(e) {
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
function ll(e, t, { mountOverlay: n = null, container: i = null, mountEl: r = null, navWrap: a = null, t: s = null } = {}) {
  try {
    const l = s || ((g) => typeof g == "string" ? g : ""), o = i || document.querySelector(".nimbi-cms"), p = r || document.querySelector(".nimbi-mount"), c = n || document.querySelector(".nimbi-overlay"), u = a || document.querySelector(".nimbi-nav-wrap");
    let m = document.querySelector(".nimbi-scroll-top");
    if (!m) {
      m = document.createElement("button"), m.className = "nimbi-scroll-top button is-primary is-rounded is-small", m.setAttribute("aria-label", l("scrollToTop")), m.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';
      try {
        c && c.appendChild ? c.appendChild(m) : o && o.appendChild ? o.appendChild(m) : p && p.appendChild ? p.appendChild(m) : document.body.appendChild(m);
      } catch {
        try {
          document.body.appendChild(m);
        } catch (y) {
          _("[htmlBuilder] append scroll top button failed", y);
        }
      }
      try {
        try {
          Ii(m);
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
          const g = globalThis.IntersectionObserver, y = new g((f) => {
            for (const w of f)
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
            const y = o instanceof Element ? o.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }, f = t.getBoundingClientRect();
            !(f.bottom < y.top || f.top > y.bottom) ? (m.classList.remove("show"), d && d.classList.remove("show")) : (m.classList.add("show"), d && d.classList.add("show"));
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
        } catch (f) {
          _("[htmlBuilder] onScroll handler failed", f);
        }
      };
      Nn(() => g.addEventListener("scroll", y)), y();
    }
  } catch (l) {
    _("[htmlBuilder] ensureScrollTopButton failed", l);
  }
}
function Ei(e, t) {
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
async function cl(e, t, n, i, r, a, s, l, o = "eager", p = 1, c = void 0, u = "favicon") {
  if (!e || !(e instanceof HTMLElement))
    throw new TypeError("navbarWrap must be an HTMLElement");
  const h = typeof DOMParser < "u" ? new DOMParser() : null, m = h ? h.parseFromString(n || "", "text/html") : null, d = m ? m.querySelectorAll("a") : [];
  await Nn(() => Yo(d, i)), await Nn(() => Jo(d, i));
  try {
    if (t && t instanceof HTMLElement && (!t.hasAttribute || !t.hasAttribute("role")))
      try {
        t.setAttribute("role", "main");
      } catch {
      }
  } catch {
  }
  let g = null, y = null, f = null, w = null, b = null, k = null, S = !1, v = null;
  function C() {
    try {
      const E = document.querySelector(".navbar-burger"), N = E && E.dataset ? E.dataset.target : null, P = N ? document.getElementById(N) : null;
      E && E.classList.contains("is-active") && (E.classList.remove("is-active"), E.setAttribute("aria-expanded", "false"), P && P.classList.remove("is-active"));
    } catch (E) {
      _("[nimbi-cms] closeMobileMenu failed", E);
    }
  }
  async function U() {
    const E = typeof document < "u" ? document.querySelector(".nimbi-content") : null;
    try {
      E && E.classList.add("is-inactive");
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
  const z = () => g || (g = (async () => {
    try {
      const E = await Promise.resolve().then(() => Rt), N = typeof globalThis < "u" ? globalThis.buildSearchIndex : void 0, P = typeof globalThis < "u" ? globalThis.buildSearchIndexWorker : void 0, B = Ei(E, "buildSearchIndex"), T = Ei(E, "buildSearchIndexWorker"), I = typeof N == "function" ? N : B || void 0, A = typeof P == "function" ? P : T || void 0;
      ut("[nimbi-cms test] ensureSearchIndex: buildFn=" + typeof I + " workerFn=" + typeof A + " (global preferred)");
      const Y = [];
      try {
        r && Y.push(r);
      } catch {
      }
      try {
        navigationPage && Y.push(navigationPage);
      } catch {
      }
      if (o === "lazy" && typeof A == "function")
        try {
          const X = await A(i, p, c, Y.length ? Y : void 0);
          if (X && X.length) {
            try {
              if (E && typeof E._setSearchIndex == "function")
                try {
                  E._setSearchIndex(X);
                } catch {
                }
            } catch {
            }
            return X;
          }
        } catch (X) {
          _("[nimbi-cms] worker builder threw", X);
        }
      return typeof I == "function" ? (ut("[nimbi-cms test] calling buildFn"), await I(i, p, c, Y.length ? Y : void 0)) : [];
    } catch (E) {
      return _("[nimbi-cms] buildSearchIndex failed", E), [];
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
                const T = await Promise.resolve().then(() => Rt);
                try {
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
                  window.__nimbiResolvedIndex = Array.isArray(Z) ? Z : Array.isArray(v) ? v : [];
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
            window.__nimbi_indexDepth = p;
          } catch {
          }
          try {
            window.__nimbi_noIndexing = c;
          } catch {
          }
        }
      } catch {
      }
      const N = String(y && y.value || "").trim().toLowerCase();
      if (!N || !Array.isArray(E) || !E.length) return;
      const P = E.filter((T) => T.title && T.title.toLowerCase().includes(N) || T.excerpt && T.excerpt.toLowerCase().includes(N));
      if (!P || !P.length) return;
      const B = document.getElementById("nimbi-search-results");
      if (!B) return;
      B.innerHTML = "";
      try {
        const T = document.createElement("div");
        T.className = "panel nimbi-search-panel", P.slice(0, 10).forEach((I) => {
          try {
            if (I.parentTitle) {
              const X = document.createElement("p");
              X.className = "panel-heading nimbi-search-title nimbi-search-parent", X.textContent = I.parentTitle, T.appendChild(X);
            }
            const A = document.createElement("a");
            A.className = "panel-block nimbi-search-result", A.href = Me(I.slug), A.setAttribute("role", "button");
            try {
              if (I.path && typeof I.slug == "string") {
                try {
                  K.set(I.slug, I.path);
                } catch {
                }
                try {
                  j.set(I.path, I.slug);
                } catch {
                }
              }
            } catch {
            }
            const Y = document.createElement("div");
            Y.className = "is-size-6 has-text-weight-semibold", Y.textContent = I.title, A.appendChild(Y), A.addEventListener("click", () => {
              try {
                B.style.display = "none";
              } catch {
              }
            }), T.appendChild(A);
          } catch {
          }
        }), B.appendChild(T);
        try {
          B.style.display = "block";
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
        const E = await Promise.resolve().then(() => an);
        try {
          await E.handleSitemapRequest({ homePage: r, contentBase: i, indexDepth: p, noIndexing: c, includeAllMarkdown: !0 });
        } catch (N) {
          _("[nimbi-cms] sitemap trigger failed", N);
        }
      } catch (E) {
        try {
          _("[nimbi-cms] sitemap dynamic import failed", E);
        } catch {
        }
      }
    })();
  }), g), q = document.createElement("nav");
  q.className = "navbar", q.setAttribute("role", "navigation"), q.setAttribute("aria-label", "main navigation");
  const M = document.createElement("div");
  M.className = "navbar-brand";
  const $ = d[0], G = document.createElement("a");
  if (G.className = "navbar-item", $) {
    const E = $.getAttribute("href") || "#";
    try {
      const P = new URL(E, location.href).searchParams.get("page"), B = P ? decodeURIComponent(P) : r;
      let T = null;
      try {
        typeof B == "string" && (/(?:\.md|\.html?)$/i.test(B) || B.includes("/")) && (T = L(B));
      } catch {
      }
      !T && typeof B == "string" && !String(B).includes(".") && (T = B);
      const I = T || B;
      G.href = Me(I), (!G.textContent || !String(G.textContent).trim()) && (G.textContent = a("home"));
    } catch {
      try {
        const P = typeof r == "string" && (/(?:\.md|\.html?)$/i.test(r) || r.includes("/")) ? L(r) : typeof r == "string" && !r.includes(".") ? r : null;
        G.href = Me(P || r);
      } catch {
        G.href = Me(r);
      }
      G.textContent = a("home");
    }
  } else
    G.href = Me(r), G.textContent = a("home");
  async function F(E) {
    try {
      if (!E || E === "none") return null;
      if (E === "favicon")
        try {
          const N = document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');
          if (!N) return null;
          const P = N.getAttribute("href") || "";
          return P && /\.png(?:\?|$)/i.test(P) ? new URL(P, location.href).toString() : null;
        } catch {
          return null;
        }
      if (E === "copy-first" || E === "move-first")
        try {
          const N = await ve(r, i);
          if (!N || !N.raw) return null;
          const T = new DOMParser().parseFromString(N.raw, "text/html").querySelector("img");
          if (!T) return null;
          const I = T.getAttribute("src") || "";
          if (!I) return null;
          const A = new URL(I, location.href).toString();
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
    he = await F(u);
  } catch {
    he = null;
  }
  if (he)
    try {
      const E = document.createElement("img");
      E.className = "nimbi-navbar-logo";
      const N = a && typeof a == "function" && (a("home") || a("siteLogo")) || "";
      E.alt = N, E.title = N, E.src = he;
      try {
        E.style.marginRight = "0.5em";
      } catch {
      }
      try {
        (!G.textContent || !String(G.textContent).trim()) && (G.textContent = N);
      } catch {
      }
      try {
        G.insertBefore(E, G.firstChild);
      } catch {
        try {
          G.appendChild(E);
        } catch {
        }
      }
    } catch {
    }
  M.appendChild(G), G.addEventListener("click", function(E) {
    const N = G.getAttribute("href") || "";
    if (N.startsWith("?page=")) {
      E.preventDefault();
      const P = new URL(N, location.href), B = P.searchParams.get("page"), T = P.hash ? P.hash.replace(/^#/, "") : null;
      history.pushState({ page: B }, "", Me(B, T)), U();
      try {
        C();
      } catch {
      }
    }
  });
  function L(E) {
    try {
      if (!E) return null;
      const N = le(String(E || ""));
      try {
        if (j && j.has(N)) return j.get(N);
      } catch {
      }
      const P = N.replace(/^.*\//, "");
      try {
        if (j && j.has(P)) return j.get(P);
      } catch {
      }
      try {
        for (const [B, T] of K.entries())
          if (T) {
            if (typeof T == "string") {
              if (le(T) === N) return B;
            } else if (T && typeof T == "object") {
              if (T.default && le(T.default) === N) return B;
              const I = T.langs || {};
              for (const A in I)
                if (I[A] && le(I[A]) === N) return B;
            }
          }
      } catch {
      }
      return null;
    } catch {
      return null;
    }
  }
  const D = document.createElement("a");
  D.className = "navbar-burger", D.setAttribute("role", "button"), D.setAttribute("aria-label", "menu"), D.setAttribute("aria-expanded", "false");
  const J = "nimbi-navbar-menu";
  D.dataset.target = J, D.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>', M.appendChild(D);
  try {
    D.addEventListener("click", (E) => {
      try {
        const N = D.dataset && D.dataset.target ? D.dataset.target : null, P = N ? document.getElementById(N) : null;
        D.classList.contains("is-active") ? (D.classList.remove("is-active"), D.setAttribute("aria-expanded", "false"), P && P.classList.remove("is-active")) : (D.classList.add("is-active"), D.setAttribute("aria-expanded", "true"), P && P.classList.add("is-active"));
      } catch (N) {
        _("[nimbi-cms] navbar burger toggle failed", N);
      }
    });
  } catch (E) {
    _("[nimbi-cms] burger event binding failed", E);
  }
  const ye = document.createElement("div");
  ye.className = "navbar-menu", ye.id = J;
  const ee = document.createElement("div");
  ee.className = "navbar-start";
  let ce = null, Se = null;
  if (!l)
    ce = null, y = null, w = null, b = null, k = null;
  else {
    ce = document.createElement("div"), ce.className = "navbar-end", Se = document.createElement("div"), Se.className = "navbar-item", y = document.createElement("input"), y.className = "input", y.type = "search", y.placeholder = a("searchPlaceholder") || "", y.id = "nimbi-search";
    try {
      const T = (a && typeof a == "function" ? a("searchAria") : null) || y.placeholder || "Search";
      try {
        y.setAttribute("aria-label", T);
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
    o === "eager" && (y.disabled = !0), f = document.createElement("div"), f.className = "control", o === "eager" && f.classList.add("is-loading"), f.appendChild(y), Se.appendChild(f), w = document.createElement("div"), w.className = "dropdown is-right", w.id = "nimbi-search-dropdown";
    const E = document.createElement("div");
    E.className = "dropdown-trigger", E.appendChild(Se);
    const N = document.createElement("div");
    N.className = "dropdown-menu", N.setAttribute("role", "menu"), b = document.createElement("div"), b.id = "nimbi-search-results", b.className = "dropdown-content nimbi-search-results", k = b, N.appendChild(b), w.appendChild(E), w.appendChild(N), ce.appendChild(w);
    const P = (T) => {
      if (!b) return;
      b.innerHTML = "";
      let I = -1;
      function A(re) {
        try {
          const be = b.querySelector(".nimbi-search-result.is-selected");
          be && be.classList.remove("is-selected");
          const ue = b.querySelectorAll(".nimbi-search-result");
          if (!ue || !ue.length) return;
          if (re < 0) {
            I = -1;
            return;
          }
          re >= ue.length && (re = ue.length - 1);
          const Q = ue[re];
          if (Q) {
            Q.classList.add("is-selected"), I = re;
            try {
              Q.scrollIntoView({ block: "nearest" });
            } catch {
            }
          }
        } catch {
        }
      }
      function Y(re) {
        try {
          const be = re.key, ue = b.querySelectorAll(".nimbi-search-result");
          if (!ue || !ue.length) return;
          if (be === "ArrowDown") {
            re.preventDefault();
            const Q = I < 0 ? 0 : Math.min(ue.length - 1, I + 1);
            A(Q);
            return;
          }
          if (be === "ArrowUp") {
            re.preventDefault();
            const Q = I <= 0 ? 0 : I - 1;
            A(Q);
            return;
          }
          if (be === "Enter") {
            re.preventDefault();
            const Q = b.querySelector(".nimbi-search-result.is-selected") || b.querySelector(".nimbi-search-result");
            if (Q)
              try {
                Q.click();
              } catch {
              }
            return;
          }
          if (be === "Escape") {
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
              b.removeEventListener("keydown", Y);
            } catch {
            }
            try {
              y && y.focus();
            } catch {
            }
            try {
              y && y.removeEventListener("keydown", X);
            } catch {
            }
            return;
          }
        } catch {
        }
      }
      function X(re) {
        try {
          if (re && re.key === "ArrowDown") {
            re.preventDefault();
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
        const re = document.createElement("div");
        re.className = "panel nimbi-search-panel", T.forEach((be) => {
          if (be.parentTitle) {
            const ae = document.createElement("p");
            ae.textContent = be.parentTitle, ae.className = "panel-heading nimbi-search-title nimbi-search-parent", re.appendChild(ae);
          }
          const ue = document.createElement("a");
          ue.className = "panel-block nimbi-search-result", ue.href = Me(be.slug), ue.setAttribute("role", "button");
          try {
            if (be.path && typeof be.slug == "string") {
              try {
                K.set(be.slug, be.path);
              } catch {
              }
              try {
                j.set(be.path, be.slug);
              } catch {
              }
            }
          } catch {
          }
          const Q = document.createElement("div");
          Q.className = "is-size-6 has-text-weight-semibold", Q.textContent = be.title, ue.appendChild(Q), ue.addEventListener("click", () => {
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
              b.removeEventListener("keydown", Y);
            } catch {
            }
            try {
              y && y.removeEventListener("keydown", X);
            } catch {
            }
          }), re.appendChild(ue);
        }), b.appendChild(re);
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
        b.addEventListener("keydown", Y);
      } catch {
      }
      try {
        y && y.addEventListener("keydown", X);
      } catch {
      }
    }, B = (T, I) => {
      let A = null;
      return (...Y) => {
        A && clearTimeout(A), A = setTimeout(() => T(...Y), I);
      };
    };
    if (y) {
      const T = B(async () => {
        const I = document.querySelector("input#nimbi-search"), A = String(I && I.value || "").trim().toLowerCase();
        if (!A) {
          P([]);
          return;
        }
        try {
          await z();
          const Y = await g;
          ut('[nimbi-cms test] search handleInput q="' + A + '" idxlen=' + (Array.isArray(Y) ? Y.length : "nil"));
          const X = Y.filter((re) => re.title && re.title.toLowerCase().includes(A) || re.excerpt && re.excerpt.toLowerCase().includes(A));
          ut("[nimbi-cms test] filtered len=" + (Array.isArray(X) ? X.length : "nil")), P(X.slice(0, 10));
        } catch (Y) {
          _("[nimbi-cms] search input handler failed", Y), P([]);
        }
      }, 50);
      try {
        y.addEventListener("input", T);
      } catch {
      }
      try {
        document.addEventListener("input", (I) => {
          try {
            I && I.target && I.target.id === "nimbi-search" && T(I);
          } catch {
          }
        }, !0);
      } catch {
      }
    }
    if (o === "eager") {
      try {
        g = z();
      } catch (T) {
        _("[nimbi-cms] eager search index init failed", T), g = Promise.resolve([]);
      }
      g.finally(() => {
        const T = document.querySelector("input#nimbi-search");
        if (T) {
          try {
            T.removeAttribute("disabled");
          } catch {
          }
          try {
            f && f.classList.remove("is-loading");
          } catch {
          }
        }
        (async () => {
          try {
            if (S) return;
            S = !0;
            const I = await g.catch(() => []), A = await Promise.resolve().then(() => an);
            try {
              await A.handleSitemapRequest({ index: Array.isArray(I) ? I : void 0, homePage: r, contentBase: i, indexDepth: p, noIndexing: c, includeAllMarkdown: !0 });
            } catch (Y) {
              _("[nimbi-cms] sitemap trigger failed", Y);
            }
          } catch (I) {
            try {
              _("[nimbi-cms] sitemap dynamic import failed", I);
            } catch {
            }
          }
        })();
      });
    }
    try {
      const T = (I) => {
        try {
          const A = I && I.target;
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
      document.addEventListener("click", T, !0), document.addEventListener("touchstart", T, !0);
    } catch {
    }
  }
  for (let E = 0; E < d.length; E++) {
    const N = d[E];
    if (E === 0) continue;
    const P = N.getAttribute("href") || "#", B = document.createElement("a");
    B.className = "navbar-item";
    try {
      if (/^[^#]*\.md(?:$|[#?])/.test(P) || P.endsWith(".md")) {
        const I = le(P).split(/::|#/, 2), A = I[0], Y = I[1], X = L(A);
        X ? B.href = Me(X, Y) : B.href = Me(A, Y);
      } else if (/\.html(?:$|[#?])/.test(P) || P.endsWith(".html")) {
        const I = le(P).split(/::|#/, 2);
        let A = I[0];
        A && !A.toLowerCase().endsWith(".html") && (A = A + ".html");
        const Y = I[1], X = L(A);
        if (X)
          B.href = Me(X, Y);
        else
          try {
            const re = await ve(A, i);
            if (re && re.raw)
              try {
                const ue = new DOMParser().parseFromString(re.raw, "text/html"), Q = ue.querySelector("title"), ae = ue.querySelector("h1"), Oe = Q && Q.textContent && Q.textContent.trim() ? Q.textContent.trim() : ae && ae.textContent ? ae.textContent.trim() : null;
                if (Oe) {
                  const Qe = ke(Oe);
                  if (Qe) {
                    try {
                      K.set(Qe, A), j.set(A, Qe);
                    } catch (Je) {
                      _("[nimbi-cms] slugToMd/mdToSlug set failed", Je);
                    }
                    B.href = Me(Qe, Y);
                  } else
                    B.href = Me(A, Y);
                } else
                  B.href = Me(A, Y);
              } catch {
                B.href = Me(A, Y);
              }
            else
              B.href = P;
          } catch {
            B.href = P;
          }
      } else
        B.href = P;
    } catch (T) {
      _("[nimbi-cms] nav item href parse failed", T), B.href = P;
    }
    try {
      const T = N.textContent && String(N.textContent).trim() ? String(N.textContent).trim() : null;
      if (T)
        try {
          const I = ke(T);
          if (I) {
            const A = B.getAttribute("href") || "";
            let Y = null;
            if (/^[^#?]*\.(?:md|html?)(?:$|[?#])/i.test(A))
              Y = le(String(A || "").split(/[?#]/)[0]);
            else
              try {
                const X = Ye(A);
                X && X.type === "canonical" && X.page && (Y = le(X.page));
              } catch {
              }
            if (Y) {
              let X = !1;
              try {
                if (/\.(?:md|html?)(?:$|[?#])/i.test(String(Y || "")))
                  X = !0;
                else {
                  const re = String(Y || "").replace(/^\.\//, ""), be = re.replace(/^.*\//, "");
                  Array.isArray(Te) && Te.length && (Te.includes(re) || Te.includes(be)) && (X = !0);
                }
              } catch {
                X = !1;
              }
              if (X) {
                try {
                  K.set(I, Y);
                } catch {
                }
                try {
                  j.set(Y, I);
                } catch {
                }
              }
            }
          }
        } catch (I) {
          _("[nimbi-cms] nav slug mapping failed", I);
        }
    } catch (T) {
      _("[nimbi-cms] nav slug mapping failed", T);
    }
    B.textContent = N.textContent || P, ee.appendChild(B);
  }
  ye.appendChild(ee), ce && ye.appendChild(ce), q.appendChild(M), q.appendChild(ye), e.appendChild(q);
  try {
    const E = (N) => {
      try {
        const P = q && q.querySelector ? q.querySelector(".navbar-burger") : document.querySelector(".navbar-burger");
        if (!P || !P.classList.contains("is-active")) return;
        const B = P && P.closest ? P.closest(".navbar") : q;
        if (B && B.contains(N.target)) return;
        C();
      } catch {
      }
    };
    document.addEventListener("click", E, !0), document.addEventListener("touchstart", E, !0);
  } catch {
  }
  try {
    ye.addEventListener("click", (E) => {
      const N = E.target && E.target.closest ? E.target.closest("a") : null;
      if (!N) return;
      const P = N.getAttribute("href") || "";
      try {
        const B = new URL(P, location.href), T = B.searchParams.get("page"), I = B.hash ? B.hash.replace(/^#/, "") : null;
        T && (E.preventDefault(), history.pushState({ page: T }, "", Me(T, I)), U());
      } catch (B) {
        _("[nimbi-cms] navbar click handler failed", B);
      }
      try {
        const B = q && q.querySelector ? q.querySelector(".navbar-burger") : null, T = B && B.dataset ? B.dataset.target : null, I = T ? document.getElementById(T) : null;
        B && B.classList.contains("is-active") && (B.classList.remove("is-active"), B.setAttribute("aria-expanded", "false"), I && I.classList.remove("is-active"));
      } catch (B) {
        _("[nimbi-cms] mobile menu close failed", B);
      }
    });
  } catch (E) {
    _("[nimbi-cms] attach content click handler failed", E);
  }
  try {
    t.addEventListener("click", (E) => {
      const N = E.target && E.target.closest ? E.target.closest("a") : null;
      if (!N) return;
      const P = N.getAttribute("href") || "";
      if (P && !Di(P))
        try {
          const B = new URL(P, location.href), T = B.searchParams.get("page"), I = B.hash ? B.hash.replace(/^#/, "") : null;
          T && (E.preventDefault(), history.pushState({ page: T }, "", Me(T, I)), U());
        } catch (B) {
          _("[nimbi-cms] container click URL parse failed", B);
        }
    });
  } catch (E) {
    _("[nimbi-cms] build navbar failed", E);
  }
  return { navbar: q, linkEls: d };
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
let Ue = null, oe = null, Be = 1, ct = (e, t) => t, tn = 0, nn = 0, zn = () => {
}, Gt = 0.25;
function ul() {
  if (Ue && document.contains(Ue)) return Ue;
  Ue = null;
  const e = document.createElement("dialog");
  e.className = "nimbi-image-preview modal", e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), e.setAttribute("aria-label", ct("imagePreviewTitle", "Image preview")), e.innerHTML = `
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
    L.target === e && or();
  }), e.addEventListener("wheel", (L) => {
    if (!q()) return;
    L.preventDefault();
    const D = L.deltaY < 0 ? Gt : -Gt;
    ft(Be + D), p(), c();
  }, { passive: !1 }), e.addEventListener("keydown", (L) => {
    if (L.key === "Escape") {
      or();
      return;
    }
    if (Be > 1) {
      const D = e.querySelector(".nimbi-image-preview__image-wrapper");
      if (!D) return;
      const J = 40;
      switch (L.key) {
        case "ArrowUp":
          D.scrollTop -= J, L.preventDefault();
          break;
        case "ArrowDown":
          D.scrollTop += J, L.preventDefault();
          break;
        case "ArrowLeft":
          D.scrollLeft -= J, L.preventDefault();
          break;
        case "ArrowRight":
          D.scrollLeft += J, L.preventDefault();
          break;
      }
    }
  }), document.body.appendChild(e), Ue = e, oe = e.querySelector("[data-nimbi-preview-image]");
  const t = e.querySelector("[data-nimbi-preview-fit]"), n = e.querySelector("[data-nimbi-preview-original]"), i = e.querySelector("[data-nimbi-preview-zoom-in]"), r = e.querySelector("[data-nimbi-preview-zoom-out]"), a = e.querySelector("[data-nimbi-preview-reset]"), s = e.querySelector("[data-nimbi-preview-close]"), l = e.querySelector("[data-nimbi-preview-zoom-label]"), o = e.querySelector("[data-nimbi-preview-zoom-hud]");
  function p() {
    l && (l.textContent = `${Math.round(Be * 100)}%`);
  }
  const c = () => {
    o && (o.textContent = `${Math.round(Be * 100)}%`, o.classList.add("visible"), clearTimeout(o._timeout), o._timeout = setTimeout(() => o.classList.remove("visible"), 800));
  };
  zn = p, i.addEventListener("click", () => {
    ft(Be + Gt), p(), c();
  }), r.addEventListener("click", () => {
    ft(Be - Gt), p(), c();
  }), t.addEventListener("click", () => {
    rn(), p(), c();
  }), n.addEventListener("click", () => {
    ft(1), p(), c();
  }), a.addEventListener("click", () => {
    rn(), p(), c();
  }), s.addEventListener("click", or), t.title = ct("imagePreviewFit", "Fit to screen"), n.title = ct("imagePreviewOriginal", "Original size"), r.title = ct("imagePreviewZoomOut", "Zoom out"), i.title = ct("imagePreviewZoomIn", "Zoom in"), s.title = ct("imagePreviewClose", "Close"), s.setAttribute("aria-label", ct("imagePreviewClose", "Close"));
  let u = !1, h = 0, m = 0, d = 0, g = 0;
  const y = /* @__PURE__ */ new Map();
  let f = 0, w = 1;
  const b = (L, D) => {
    const J = L.x - D.x, ye = L.y - D.y;
    return Math.hypot(J, ye);
  }, k = () => {
    u = !1, y.clear(), f = 0, oe && (oe.classList.add("is-panning"), oe.classList.remove("is-grabbing"));
  };
  let S = 0, v = 0, C = 0;
  const U = (L) => {
    const D = Date.now(), J = D - S, ye = L.clientX - v, ee = L.clientY - C;
    S = D, v = L.clientX, C = L.clientY, J < 300 && Math.hypot(ye, ee) < 30 && (ft(Be > 1 ? 1 : 2), p(), L.preventDefault());
  }, z = (L) => {
    ft(Be > 1 ? 1 : 2), p(), L.preventDefault();
  }, q = () => Ue ? typeof Ue.open == "boolean" ? Ue.open : Ue.classList.contains("is-active") : !1, M = (L, D, J = 1) => {
    if (y.has(J) && y.set(J, { x: L, y: D }), y.size === 2) {
      const Se = Array.from(y.values()), E = b(Se[0], Se[1]);
      if (f > 0) {
        const N = E / f;
        ft(w * N);
      }
      return;
    }
    if (!u) return;
    const ye = oe.closest(".nimbi-image-preview__image-wrapper");
    if (!ye) return;
    const ee = L - h, ce = D - m;
    ye.scrollLeft = d - ee, ye.scrollTop = g - ce;
  }, $ = (L, D, J = 1) => {
    if (!q()) return;
    if (y.set(J, { x: L, y: D }), y.size === 2) {
      const ce = Array.from(y.values());
      f = b(ce[0], ce[1]), w = Be;
      return;
    }
    const ye = oe.closest(".nimbi-image-preview__image-wrapper");
    !ye || !(ye.scrollWidth > ye.clientWidth || ye.scrollHeight > ye.clientHeight) || (u = !0, h = L, m = D, d = ye.scrollLeft, g = ye.scrollTop, oe.classList.add("is-panning"), oe.classList.remove("is-grabbing"), window.addEventListener("pointermove", G), window.addEventListener("pointerup", F), window.addEventListener("pointercancel", F));
  }, G = (L) => {
    u && (L.preventDefault(), M(L.clientX, L.clientY, L.pointerId));
  }, F = () => {
    k(), window.removeEventListener("pointermove", G), window.removeEventListener("pointerup", F), window.removeEventListener("pointercancel", F);
  };
  oe.addEventListener("pointerdown", (L) => {
    L.preventDefault(), $(L.clientX, L.clientY, L.pointerId);
  }), oe.addEventListener("pointermove", (L) => {
    (u || y.size === 2) && L.preventDefault(), M(L.clientX, L.clientY, L.pointerId);
  }), oe.addEventListener("pointerup", (L) => {
    L.preventDefault(), L.pointerType === "touch" && U(L), k();
  }), oe.addEventListener("dblclick", z), oe.addEventListener("pointercancel", k), oe.addEventListener("mousedown", (L) => {
    L.preventDefault(), $(L.clientX, L.clientY, 1);
  }), oe.addEventListener("mousemove", (L) => {
    u && L.preventDefault(), M(L.clientX, L.clientY, 1);
  }), oe.addEventListener("mouseup", (L) => {
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
function ft(e) {
  if (!oe) return;
  const t = Number(e);
  Be = Number.isFinite(t) ? Math.max(0.1, Math.min(4, t)) : 1;
  const i = oe.getBoundingClientRect(), r = tn || oe.naturalWidth || oe.width || i.width || 0, a = nn || oe.naturalHeight || oe.height || i.height || 0;
  if (r && a) {
    oe.style.setProperty("--nimbi-preview-img-max-width", "none"), oe.style.setProperty("--nimbi-preview-img-max-height", "none"), oe.style.setProperty("--nimbi-preview-img-width", `${r * Be}px`), oe.style.setProperty("--nimbi-preview-img-height", `${a * Be}px`), oe.style.setProperty("--nimbi-preview-img-transform", "none");
    try {
      oe.style.width = `${r * Be}px`, oe.style.height = `${a * Be}px`, oe.style.transform = "none";
    } catch {
    }
  } else {
    oe.style.setProperty("--nimbi-preview-img-max-width", ""), oe.style.setProperty("--nimbi-preview-img-max-height", ""), oe.style.setProperty("--nimbi-preview-img-width", ""), oe.style.setProperty("--nimbi-preview-img-height", ""), oe.style.setProperty("--nimbi-preview-img-transform", `scale(${Be})`);
    try {
      oe.style.transform = `scale(${Be})`;
    } catch {
    }
  }
  oe && (oe.classList.add("is-panning"), oe.classList.remove("is-grabbing"));
}
function rn() {
  if (!oe) return;
  const e = oe.closest(".nimbi-image-preview__image-wrapper");
  if (!e) return;
  const t = e.getBoundingClientRect();
  if (t.width === 0 || t.height === 0) return;
  const n = tn || oe.naturalWidth || t.width, i = nn || oe.naturalHeight || t.height;
  if (!n || !i) return;
  const r = t.width / n, a = t.height / i, s = Math.min(r, a, 1);
  ft(Number.isFinite(s) ? s : 1);
}
function hl(e, t = "", n = 0, i = 0) {
  const r = ul();
  Be = 1, tn = n || 0, nn = i || 0, oe.src = e;
  try {
    if (!t)
      try {
        const l = new URL(e, typeof location < "u" ? location.href : "").pathname || "", p = (l.substring(l.lastIndexOf("/") + 1) || e).replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
        t = ct("imagePreviewDefaultAlt", p || "Image");
      } catch {
        t = ct("imagePreviewDefaultAlt", "Image");
      }
  } catch {
  }
  oe.alt = t, oe.style.transform = "scale(1)";
  const a = () => {
    tn = oe.naturalWidth || oe.width || 0, nn = oe.naturalHeight || oe.height || 0;
  };
  if (a(), rn(), zn(), requestAnimationFrame(() => {
    rn(), zn();
  }), !tn || !nn) {
    const s = () => {
      a(), requestAnimationFrame(() => {
        rn(), zn();
      }), oe.removeEventListener("load", s);
    };
    oe.addEventListener("load", s);
  }
  typeof r.showModal == "function" && (r.open || r.showModal()), r.classList.add("is-active");
  try {
    document.documentElement.classList.add("nimbi-image-preview-open");
  } catch {
  }
  r.focus();
}
function or() {
  if (Ue) {
    typeof Ue.close == "function" && Ue.open && Ue.close(), Ue.classList.remove("is-active");
    try {
      document.documentElement.classList.remove("nimbi-image-preview-open");
    } catch {
    }
  }
}
function dl(e, { t, zoomStep: n = 0.25 } = {}) {
  if (!e || !e.querySelectorAll) return;
  ct = (m, d) => (typeof t == "function" ? t(m) : void 0) || d, Gt = n, e.addEventListener("click", (m) => {
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
    y && y.getAttribute("href") || hl(g.src, g.alt || "", g.naturalWidth || 0, g.naturalHeight || 0);
  });
  let i = !1, r = 0, a = 0, s = 0, l = 0;
  const o = /* @__PURE__ */ new Map();
  let p = 0, c = 1;
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
    if (g && g.getAttribute("href") || !Ue || !Ue.open) return;
    if (o.set(m.pointerId, { x: m.clientX, y: m.clientY }), o.size === 2) {
      const f = Array.from(o.values());
      p = u(f[0], f[1]), c = Be;
      return;
    }
    const y = d.closest(".nimbi-image-preview__image-wrapper");
    if (y && !(Be <= 1)) {
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
      if (p > 0) {
        const S = k / p;
        ft(c * S);
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
    const f = m.clientX - r, w = m.clientY - a;
    y.scrollLeft = s - f, y.scrollTop = l - w;
  });
  const h = () => {
    i = !1, o.clear(), p = 0;
    try {
      const m = document.querySelector("[data-nimbi-preview-image]");
      m && (m.classList.add("is-panning"), m.classList.remove("is-grabbing"));
    } catch {
    }
  };
  e.addEventListener("pointerup", h), e.addEventListener("pointercancel", h);
}
function fl(e) {
  const {
    contentWrap: t,
    navWrap: n,
    container: i,
    mountOverlay: r = null,
    t: a,
    contentBase: s,
    homePage: l,
    initialDocumentTitle: o,
    runHooks: p
  } = e || {};
  if (!t || !(t instanceof HTMLElement))
    throw new TypeError("contentWrap must be an HTMLElement");
  let c = null;
  const u = Qo(a, [{ path: l, name: a("home"), isIndex: !0, children: [] }]);
  async function h(f, w) {
    let b, k, S;
    try {
      ({ data: b, pagePath: k, anchor: S } = await Ds(f, s));
    } catch ($) {
      const G = $ && $.message ? String($.message) : "", F = (!ne || typeof ne != "string" || !ne) && /no page data/i.test(G);
      try {
        if (F)
          try {
            _("[nimbi-cms] fetchPageData (expected missing)", $);
          } catch {
          }
        else
          try {
            In("[nimbi-cms] fetchPageData failed", $);
          } catch {
          }
      } catch {
      }
      try {
        !ne && n && n.innerHTML !== void 0 && (n.innerHTML = "");
      } catch {
      }
      Ai(t, a, $);
      return;
    }
    !S && w && (S = w);
    try {
      br(null);
    } catch ($) {
      _("[nimbi-cms] scrollToAnchorOrTop failed", $);
    }
    t.innerHTML = "";
    const { article: v, parsed: C, toc: U, topH1: z, h1Text: q, slugKey: M } = await nl(a, b, k, S, s);
    Is(a, o, C, U, v, k, S, z, q, M, b), n.innerHTML = "", U && (n.appendChild(U), ol(U));
    try {
      await p("transformHtml", { article: v, parsed: C, toc: U, pagePath: k, anchor: S, topH1: z, h1Text: q, slugKey: M, data: b });
    } catch ($) {
      _("[nimbi-cms] transformHtml hooks failed", $);
    }
    t.appendChild(v);
    try {
      rl(v);
    } catch ($) {
      _("[nimbi-cms] executeEmbeddedScripts failed", $);
    }
    try {
      dl(v, { t: a });
    } catch ($) {
      _("[nimbi-cms] attachImagePreview failed", $);
    }
    try {
      An(i, 100, !1), requestAnimationFrame(() => An(i, 100, !1)), setTimeout(() => An(i, 100, !1), 250);
    } catch ($) {
      _("[nimbi-cms] setEagerForAboveFoldImages failed", $);
    }
    br(S), ll(v, z, { mountOverlay: r, container: i, navWrap: n, t: a });
    try {
      await p("onPageLoad", { data: b, pagePath: k, anchor: S, article: v, toc: U, topH1: z, h1Text: q, slugKey: M, contentWrap: t, navWrap: n });
    } catch ($) {
      _("[nimbi-cms] onPageLoad hooks failed", $);
    }
    c = k;
  }
  async function m() {
    try {
      try {
        Ci("renderByQuery");
      } catch {
      }
      try {
        Ti("renderByQuery");
      } catch {
      }
      let f = Ye(location.href);
      if (f && f.type === "path" && f.page)
        try {
          let k = "?page=" + encodeURIComponent(f.page || "");
          f.params && (k += (k.includes("?") ? "&" : "?") + f.params), f.anchor && (k += "#" + encodeURIComponent(f.anchor));
          try {
            history.replaceState(history.state, "", k);
          } catch {
            try {
              history.replaceState({}, "", k);
            } catch {
            }
          }
          f = Ye(location.href);
        } catch {
        }
      const w = f && f.page ? f.page : l, b = f && f.anchor ? f.anchor : null;
      await h(w, b);
    } catch (f) {
      _("[nimbi-cms] renderByQuery failed", f);
      try {
        !ne && n && n.innerHTML !== void 0 && (n.innerHTML = "");
      } catch {
      }
      Ai(t, a, f);
    }
  }
  window.addEventListener("popstate", m);
  const d = () => `nimbi-cms-scroll:${location.pathname}${location.search}`, g = () => {
    try {
      const f = i || document.querySelector(".nimbi-cms");
      if (!f) return;
      const w = {
        top: f.scrollTop || 0,
        left: f.scrollLeft || 0
      };
      sessionStorage.setItem(d(), JSON.stringify(w));
    } catch (f) {
      _("[nimbi-cms] save scroll position failed", f);
    }
  }, y = () => {
    try {
      const f = i || document.querySelector(".nimbi-cms");
      if (!f) return;
      const w = sessionStorage.getItem(d());
      if (!w) return;
      const b = JSON.parse(w);
      b && typeof b.top == "number" && f.scrollTo({ top: b.top, left: b.left || 0, behavior: "auto" });
    } catch {
    }
  };
  return window.addEventListener("pageshow", (f) => {
    if (f.persisted)
      try {
        y(), An(i, 100, !1);
      } catch (w) {
        _("[nimbi-cms] bfcache restore failed", w);
      }
  }), window.addEventListener("pagehide", () => {
    try {
      g();
    } catch (f) {
      _("[nimbi-cms] save scroll position failed", f);
    }
  }), { renderByQuery: m, siteNav: u, getCurrentPagePath: () => c };
}
function pl(e) {
  try {
    let t = typeof e == "string" ? e : typeof window < "u" && window.location ? window.location.search : "";
    if (!t && typeof window < "u" && window.location && window.location.hash)
      try {
        const a = Ye(window.location.href);
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
function gl(e) {
  return !(typeof e != "string" || !e.trim() || e.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(e) || e.startsWith("//") || e.startsWith("/") || /^[A-Za-z]:\\/.test(e));
}
function lr(e) {
  if (typeof e != "string") return !1;
  const t = e.trim();
  if (!t || t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t)) return !1;
  const n = t.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n);
}
let Mn = "";
async function Ll(e = {}) {
  if (!e || typeof e != "object")
    throw new TypeError("initCMS(options): options must be an object");
  const t = pl();
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
      ni(n.debugLevel);
    else if (typeof globalThis < "u" && globalThis.__nimbiCMSDebug && typeof globalThis.__nimbiCMSDebug.debugLevel < "u")
      try {
        const M = Number(globalThis.__nimbiCMSDebug.debugLevel);
        Number.isFinite(M) && ni(Math.max(0, Math.min(3, Math.floor(M))));
      } catch {
      }
  } catch {
  }
  try {
    Cn("[nimbi-cms] initCMS called", { options: n });
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
    noIndexing: p = void 0,
    defaultStyle: c = "light",
    bulmaCustomize: u = "none",
    lang: h = void 0,
    l10nFile: m = null,
    cacheTtlMinutes: d = 5,
    cacheMaxEntries: g,
    markdownExtensions: y,
    availableLanguages: f,
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
  const { navbarLogo: v = "favicon" } = n, { skipRootReadme: C = !1 } = n, U = (M) => {
    try {
      const $ = document.querySelector(i);
      $ && $ instanceof Element && ($.innerHTML = `<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;"><strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">${String(M)}</pre></div>`);
    } catch {
    }
  };
  if (n.contentPath != null && !gl(n.contentPath))
    throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');
  if (w != null && !lr(w))
    throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');
  if (b != null && !lr(b))
    throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');
  if (k != null && !lr(k))
    throw new TypeError('initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html');
  if (!i)
    throw new Error("el is required");
  let z = i;
  if (typeof i == "string") {
    if (z = document.querySelector(i), !z) throw new Error(`el selector "${i}" did not match any element`);
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
  if (f != null && (!Array.isArray(f) || f.some((M) => typeof M != "string" || !M.trim())))
    throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');
  if (p != null && (!Array.isArray(p) || p.some((M) => typeof M != "string" || !M.trim())))
    throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');
  if (C != null && typeof C != "boolean")
    throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');
  if (w != null && (typeof w != "string" || !w.trim() || !/\.(md|html)$/.test(w)))
    throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');
  if (b != null && (typeof b != "string" || !b.trim() || !/\.(md|html)$/.test(b)))
    throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');
  const q = !!s;
  try {
    Promise.resolve().then(() => Rt).then((M) => {
      try {
        M && typeof M.setSkipRootReadme == "function" && M.setSkipRootReadme(!!C);
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
      n && n.seoMap && typeof n.seoMap == "object" && $s(n.seoMap);
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
      const M = Ye(typeof window < "u" ? window.location.href : ""), $ = M && M.page ? M.page : w || void 0;
      try {
        $ && zs($, Mn || "");
      } catch {
      }
    } catch {
    }
    await (async () => {
      try {
        z.classList.add("nimbi-mount");
      } catch (A) {
        _("[nimbi-cms] mount element setup failed", A);
      }
      const M = document.createElement("section");
      M.className = "section";
      const $ = document.createElement("div");
      $.className = "container nimbi-cms";
      const G = document.createElement("div");
      G.className = "columns";
      const F = document.createElement("div");
      F.className = "column is-hidden-mobile is-3-tablet nimbi-nav-wrap", F.setAttribute("role", "navigation");
      try {
        const A = typeof Zt == "function" ? Zt("navigation") : null;
        A && F.setAttribute("aria-label", A);
      } catch (A) {
        _("[nimbi-cms] set nav aria-label failed", A);
      }
      G.appendChild(F);
      const he = document.createElement("main");
      he.className = "column nimbi-content", he.setAttribute("role", "main"), G.appendChild(he), $.appendChild(G), M.appendChild($);
      const L = F, D = he;
      z.appendChild(M);
      let J = null;
      try {
        J = z.querySelector(".nimbi-overlay"), J || (J = document.createElement("div"), J.className = "nimbi-overlay", z.appendChild(J));
      } catch (A) {
        J = null, _("[nimbi-cms] mount overlay setup failed", A);
      }
      const ye = location.pathname || "/";
      let ee;
      if (ye.endsWith("/"))
        ee = ye;
      else {
        const A = ye.substring(ye.lastIndexOf("/") + 1);
        A && !A.includes(".") ? ee = ye + "/" : ee = ye.substring(0, ye.lastIndexOf("/") + 1);
      }
      try {
        Mn = document.title || "";
      } catch (A) {
        Mn = "", _("[nimbi-cms] read initial document title failed", A);
      }
      let ce = r;
      const Se = Object.prototype.hasOwnProperty.call(n, "contentPath"), E = typeof location < "u" && location.origin ? location.origin : "http://localhost", N = new URL(ee, E).toString();
      (ce === "." || ce === "./") && (ce = "");
      try {
        ce = String(ce || "").replace(/\\/g, "/");
      } catch {
        ce = String(ce || "");
      }
      ce.startsWith("/") && (ce = ce.replace(/^\/+/, "")), ce && !ce.endsWith("/") && (ce = ce + "/");
      try {
        if (ce && ee && ee !== "/") {
          const A = ee.replace(/^\/+/, "").replace(/\/+$/, "") + "/";
          A && ce.startsWith(A) && (ce = ce.slice(A.length));
        }
      } catch {
      }
      try {
        if (ce)
          var P = new URL(ce, N.endsWith("/") ? N : N + "/").toString();
        else
          var P = N;
      } catch {
        try {
          if (ce) var P = new URL("/" + ce, E).toString();
          else var P = new URL(ee, E).toString();
        } catch {
          var P = E;
        }
      }
      if (m && await Ni(m, ee), f && Array.isArray(f) && ji(f), h && Bi(h), typeof d == "number" && d >= 0 && typeof di == "function" && di(d * 60 * 1e3), typeof g == "number" && g >= 0 && typeof hi == "function" && hi(g), y && Array.isArray(y) && y.length)
        try {
          y.forEach((A) => {
            typeof A == "object" && ba && typeof mr == "function" && mr(A);
          });
        } catch (A) {
          _("[nimbi-cms] applying markdownExtensions failed", A);
        }
      try {
        typeof a == "number" && Promise.resolve().then(() => Rt).then(({ setDefaultCrawlMaxQueue: A }) => {
          try {
            A(a);
          } catch (Y) {
            _("[nimbi-cms] setDefaultCrawlMaxQueue failed", Y);
          }
        });
      } catch (A) {
        _("[nimbi-cms] setDefaultCrawlMaxQueue import failed", A);
      }
      try {
        Er(P);
      } catch (A) {
        _("[nimbi-cms] setContentBase failed", A);
      }
      try {
        Fi(b);
      } catch (A) {
        _("[nimbi-cms] setNotFoundPage failed", A);
      }
      try {
        typeof window < "u" && window.__nimbiAutoAttachSitemapUI && Promise.resolve().then(() => an).then((A) => {
          try {
            A && typeof A.attachSitemapDownloadUI == "function" && A.attachSitemapDownloadUI(document.body, { filename: "sitemap.json" });
          } catch {
          }
        }).catch(() => {
        });
      } catch {
      }
      let B = null, T = null;
      try {
        if (!Object.prototype.hasOwnProperty.call(n, "homePage") && k)
          try {
            const X = [], re = [];
            try {
              k && re.push(String(k));
            } catch {
            }
            try {
              const ue = String(k || "").replace(/^_/, "");
              ue && ue !== String(k) && re.push(ue);
            } catch {
            }
            try {
              re.push("navigation.md");
            } catch {
            }
            try {
              re.push("assets/navigation.md");
            } catch {
            }
            const be = [];
            for (const ue of re)
              try {
                if (!ue) continue;
                const Q = String(ue);
                be.includes(Q) || be.push(Q);
              } catch {
              }
            for (const ue of be) {
              X.push(ue);
              try {
                if (T = await ve(ue, P, { force: !0 }), T && T.raw) {
                  try {
                    k = ue;
                  } catch {
                  }
                  try {
                    _("[nimbi-cms] fetched navigation candidate", ue, "contentBase=", P);
                  } catch {
                  }
                  B = await dn(T.raw || "");
                  try {
                    const Q = typeof DOMParser < "u" ? new DOMParser() : null;
                    if (Q && B && B.html) {
                      const Oe = Q.parseFromString(B.html, "text/html").querySelector("a");
                      if (Oe)
                        try {
                          const Qe = Oe.getAttribute("href") || "", Je = Ye(Qe);
                          try {
                            _("[nimbi-cms] parsed nav first-link href", Qe, "->", Je);
                          } catch {
                          }
                          if (Je && Je.page && (Je.type === "path" || Je.type === "canonical" && (Je.page.includes(".") || Je.page.includes("/")))) {
                            w = Je.page;
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
          Wi(w);
        } catch (X) {
          _("[nimbi-cms] setHomePage failed", X);
        }
        let Y = !0;
        try {
          const X = Ye(typeof location < "u" ? location.href : "");
          X && X.type === "cosmetic" && (typeof b > "u" || b == null) && (Y = !1);
        } catch {
        }
        if (Y && w)
          try {
            await ve(w, P, { force: !0 });
          } catch (X) {
            throw new Error(`Required ${w} not found at ${P}${w}: ${X && X.message ? X.message : String(X)}`);
          }
      } catch (A) {
        throw A;
      }
      is(c), await rs(u, ee);
      const I = fl({ contentWrap: D, navWrap: L, container: $, mountOverlay: J, t: Zt, contentBase: P, homePage: w, initialDocumentTitle: Mn, runHooks: ri });
      try {
        const A = document.createElement("header");
        A.className = "nimbi-site-navbar", z.insertBefore(A, M);
        let Y = T, X = B;
        X || (Y = await ve(k, P, { force: !0 }), X = await dn(Y.raw || ""));
        const { navbar: re, linkEls: be } = await cl(A, $, X.html || "", P, w, Zt, I.renderByQuery, q, l, o, p, v);
        try {
          await ri("onNavBuild", { navWrap: L, navbar: re, linkEls: be, contentBase: P });
        } catch (ue) {
          _("[nimbi-cms] onNavBuild hooks failed", ue);
        }
        try {
          let ue = !1;
          try {
            const Q = new URLSearchParams(location.search || "");
            (Q.has("sitemap") || Q.has("rss") || Q.has("atom")) && (ue = !0);
          } catch {
          }
          try {
            const ae = (location.pathname || "/").replace(/\/\/+/g, "/").split("/").filter(Boolean).pop() || "";
            ae && /^(sitemap|sitemap\.xml|rss|rss\.xml|atom|atom\.xml)$/i.test(ae) && (ue = !0);
          } catch {
          }
          if (ue || S === !0 || typeof window < "u" && window.__nimbiExposeSitemap)
            try {
              try {
                const ae = await Promise.resolve().then(() => Rt);
                if (ae && typeof ae.awaitSearchIndex == "function") {
                  const Oe = [];
                  w && Oe.push(w), k && Oe.push(k);
                  try {
                    await ae.awaitSearchIndex({ contentBase: P, indexDepth: Math.max(o || 1, 3), noIndexing: p, seedPaths: Oe.length ? Oe : void 0, startBuild: !0, timeoutMs: 1 / 0 });
                  } catch {
                  }
                }
              } catch {
              }
              const Q = await Promise.resolve().then(() => an);
              try {
                if (Q && typeof Q.handleSitemapRequest == "function" && await Q.handleSitemapRequest({ includeAllMarkdown: !0, homePage: w, navigationPage: k, notFoundPage: b, contentBase: P, indexDepth: o, noIndexing: p }))
                  return;
              } catch {
              }
            } catch {
            }
          try {
            Promise.resolve().then(() => an).then((Q) => {
              try {
                if (Q && typeof Q.exposeSitemapGlobals == "function")
                  try {
                    Q.exposeSitemapGlobals({ includeAllMarkdown: !0, homePage: w, navigationPage: k, notFoundPage: b, contentBase: P, indexDepth: o, noIndexing: p, waitForIndexMs: 1 / 0 }).catch(() => {
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
          const ue = () => {
            const Q = A && A.getBoundingClientRect && Math.round(A.getBoundingClientRect().height) || A && A.offsetHeight || 0;
            if (Q > 0) {
              try {
                z.style.setProperty("--nimbi-site-navbar-height", `${Q}px`);
              } catch (ae) {
                _("[nimbi-cms] set CSS var failed", ae);
              }
              try {
                $.style.paddingTop = "";
              } catch (ae) {
                _("[nimbi-cms] set container paddingTop failed", ae);
              }
              try {
                const ae = z && z.getBoundingClientRect && Math.round(z.getBoundingClientRect().height) || z && z.clientHeight || 0;
                if (ae > 0) {
                  const Oe = Math.max(0, ae - Q);
                  try {
                    $.style.setProperty("--nimbi-cms-height", `${Oe}px`);
                  } catch (Qe) {
                    _("[nimbi-cms] set --nimbi-cms-height failed", Qe);
                  }
                } else
                  try {
                    $.style.setProperty("--nimbi-cms-height", "calc(100vh - var(--nimbi-site-navbar-height))");
                  } catch (Oe) {
                    _("[nimbi-cms] set --nimbi-cms-height failed", Oe);
                  }
              } catch (ae) {
                _("[nimbi-cms] compute container height failed", ae);
              }
              try {
                A.style.setProperty("--nimbi-site-navbar-height", `${Q}px`);
              } catch (ae) {
                _("[nimbi-cms] set navbar CSS var failed", ae);
              }
            }
          };
          ue();
          try {
            if (typeof ResizeObserver < "u") {
              const Q = new ResizeObserver(() => ue());
              try {
                Q.observe(A);
              } catch (ae) {
                _("[nimbi-cms] ResizeObserver.observe failed", ae);
              }
            }
          } catch (Q) {
            _("[nimbi-cms] ResizeObserver setup failed", Q);
          }
        } catch (ue) {
          _("[nimbi-cms] compute navbar height failed", ue);
        }
      } catch (A) {
        _("[nimbi-cms] build navigation failed", A);
      }
      await I.renderByQuery();
      try {
        Promise.resolve().then(() => yl).then(({ getVersion: A }) => {
          typeof A == "function" && A().then((Y) => {
            try {
              const X = Y || "0.0.0";
              try {
                const re = (Q) => {
                  const ae = document.createElement("a");
                  ae.className = "nimbi-version-label tag is-small", ae.textContent = `nimbiCMS v. ${X}`, ae.href = Q || "#", ae.target = "_blank", ae.rel = "noopener noreferrer nofollow", ae.setAttribute("aria-label", `nimbiCMS version ${X}`);
                  try {
                    Ii(ae);
                  } catch {
                  }
                  try {
                    z.appendChild(ae);
                  } catch (Oe) {
                    _("[nimbi-cms] append version label failed", Oe);
                  }
                }, be = "https://abelvm.github.io/nimbiCMS/", ue = (() => {
                  try {
                    if (be && typeof be == "string")
                      return new URL(be).toString();
                  } catch {
                  }
                  return "#";
                })();
                re(ue);
              } catch (re) {
                _("[nimbi-cms] building version label failed", re);
              }
            } catch (X) {
              _("[nimbi-cms] building version label failed", X);
            }
          }).catch((Y) => {
            _("[nimbi-cms] getVersion() failed", Y);
          });
        }).catch((A) => {
          _("[nimbi-cms] import version module failed", A);
        });
      } catch (A) {
        _("[nimbi-cms] version label setup failed", A);
      }
    })();
  } catch (M) {
    throw U(M), M;
  }
}
async function ml() {
  try {
    if ("1.0.5".trim())
      return "1.0.5";
  } catch {
  }
  return "0.0.0";
}
const yl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getVersion: ml
}, Symbol.toStringTag, { value: "Module" })), He = ut, Wt = _;
function Br() {
  try {
    if (typeof location < "u" && location && typeof location.pathname == "string")
      return String(location.origin + location.pathname.split("?")[0]);
  } catch {
  }
  return "http://localhost/";
}
function ze(e) {
  return String(e || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function Li(e) {
  try {
    return !e || typeof e != "string" ? "" : (e.split("/").filter(Boolean).pop() || e).replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").split(" ").map((r) => r ? r.charAt(0).toUpperCase() + r.slice(1) : "").join(" ").trim();
  } catch {
    return String(e);
  }
}
function bl(e, t) {
  try {
    const n = t && t.slug ? String(t.slug) : null;
    if (!n) return null;
    const r = { loc: e + "?page=" + encodeURIComponent(n), slug: n };
    return t.title && (r.title = String(t.title)), t.excerpt && (r.excerpt = String(t.excerpt)), t.path && (r.sourcePath = le(String(t.path))), r;
  } catch {
    return null;
  }
}
async function qr(e = {}) {
  const {
    includeAllMarkdown: t = !0,
    index: n,
    homePage: i,
    navigationPage: r,
    notFoundPage: a
  } = e || {}, l = Br().split("?")[0];
  let o = Array.isArray(Z) && Z.length ? Z : Array.isArray(n) ? n : [];
  if (Array.isArray(n) && n.length && Array.isArray(Z) && Z.length) {
    const f = /* @__PURE__ */ new Map();
    try {
      for (const w of n)
        try {
          w && w.slug && f.set(String(w.slug), w);
        } catch {
        }
      for (const w of Z)
        try {
          w && w.slug && f.set(String(w.slug), w);
        } catch {
        }
    } catch {
    }
    o = Array.from(f.values());
  }
  const p = /* @__PURE__ */ new Set();
  try {
    typeof a == "string" && a.trim() && p.add(le(String(a)));
  } catch {
  }
  try {
    typeof r == "string" && r.trim() && p.add(le(String(r)));
  } catch {
  }
  const c = /* @__PURE__ */ new Set();
  try {
    if (typeof a == "string" && a.trim()) {
      const f = le(String(a));
      try {
        if (j && typeof j.has == "function" && j.has(f))
          try {
            c.add(j.get(f));
          } catch {
          }
        else
          try {
            const w = await ve(f, e && e.contentBase ? e.contentBase : void 0);
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
  const u = /* @__PURE__ */ new Set(), h = [], m = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), g = (f) => {
    try {
      if (!f || typeof f != "string") return !1;
      const w = le(String(f));
      try {
        if (Array.isArray(Te) && Te.length && Te.includes(w)) return !0;
      } catch {
      }
      try {
        if (j && typeof j.has == "function" && j.has(w)) return !0;
      } catch {
      }
      try {
        if (d && d.has(w)) return !0;
      } catch {
      }
      try {
        for (const b of K.values())
          try {
            if (!b) continue;
            if (typeof b == "string") {
              if (le(String(b)) === w) return !0;
            } else if (b && typeof b == "object") {
              if (b.default && le(String(b.default)) === w) return !0;
              const k = b.langs || {};
              for (const S of Object.keys(k || {}))
                try {
                  if (k[S] && le(String(k[S])) === w) return !0;
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
        const k = f.path ? le(String(f.path)) : null;
        if (k && p.has(k)) continue;
        const S = f.title ? String(f.title) : f.parentTitle ? String(f.parentTitle) : void 0;
        m.set(w, { title: S || void 0, excerpt: f.excerpt ? String(f.excerpt) : void 0, path: k, source: "index" }), k && d.set(k, { title: S || void 0, excerpt: f.excerpt ? String(f.excerpt) : void 0, slug: w });
        const v = bl(l, f);
        if (!v || !v.slug || u.has(v.slug)) continue;
        if (u.add(v.slug), m.has(v.slug)) {
          const C = m.get(v.slug);
          C && C.title && (v.title = C.title, v._titleSource = "index"), C && C.excerpt && (v.excerpt = C.excerpt);
        }
        h.push(v);
      } catch {
        continue;
      }
  if (t)
    try {
      for (const [f, w] of K.entries())
        try {
          if (!f) continue;
          const b = String(f).split("::")[0];
          if (u.has(f) || c.has(b)) continue;
          let k = null;
          if (typeof w == "string" ? k = le(String(w)) : w && typeof w == "object" && (k = le(String(w.default || ""))), k && p.has(k)) continue;
          const v = { loc: l + "?page=" + encodeURIComponent(f), slug: f };
          if (m.has(f)) {
            const C = m.get(f);
            C && C.title && (v.title = C.title, v._titleSource = "index"), C && C.excerpt && (v.excerpt = C.excerpt);
          } else if (k) {
            const C = d.get(k);
            C && C.title && (v.title = C.title, v._titleSource = "path", !v.excerpt && C.excerpt && (v.excerpt = C.excerpt));
          }
          if (u.add(f), typeof f == "string") {
            const C = f.indexOf("/") !== -1 || /\.(md|html?)$/i.test(f), U = v.title && typeof v.title == "string" && (v.title.indexOf("/") !== -1 || /\.(md|html?)$/i.test(v.title));
            (!v.title || U || C) && (v.title = Li(f), v._titleSource = "humanize");
          }
          h.push(v);
        } catch {
        }
      try {
        if (i && typeof i == "string") {
          const f = le(String(i));
          let w = null;
          try {
            j && j.has(f) && (w = j.get(f));
          } catch {
          }
          w || (w = f);
          const b = String(w).split("::")[0];
          if (!u.has(w) && !p.has(f) && !c.has(b)) {
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
    const f = /* @__PURE__ */ new Set(), w = new Set(h.map((v) => String(v && v.slug ? v.slug : ""))), b = /* @__PURE__ */ new Set();
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
        const C = await ve(v, e && e.contentBase ? e.contentBase : void 0);
        if (!C || !C.raw || C && typeof C.status == "number" && C.status === 404) continue;
        const U = C.raw, z = (function(F) {
          try {
            return String(F || "");
          } catch {
            return "";
          }
        })(U), q = [], M = /\[[^\]]+\]\(([^)]+)\)/g;
        let $;
        for (; $ = M.exec(z); )
          try {
            $ && $[1] && q.push($[1]);
          } catch {
          }
        const G = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
        for (; $ = G.exec(z); )
          try {
            $ && $[1] && q.push($[1]);
          } catch {
          }
        for (const F of q)
          try {
            if (!F) continue;
            if (F.indexOf("?") !== -1 || F.indexOf("=") !== -1)
              try {
                const D = new URL(F, l).searchParams.get("page");
                if (D) {
                  const J = String(D);
                  !w.has(J) && !f.has(J) && (f.add(J), h.push({ loc: l + "?page=" + encodeURIComponent(J), slug: J }));
                  continue;
                }
              } catch {
              }
            let he = String(F).split(/[?#]/)[0];
            if (he = he.replace(/^\.\//, "").replace(/^\//, ""), !he || !/\.(md|html?)$/i.test(he)) continue;
            try {
              const L = le(he);
              if (j && j.has(L)) {
                const D = j.get(L), J = String(D).split("::")[0];
                D && !w.has(D) && !f.has(D) && !c.has(J) && !p.has(L) && (f.add(D), h.push({ loc: l + "?page=" + encodeURIComponent(D), slug: D, sourcePath: L }));
                continue;
              }
              try {
                if (!g(L)) continue;
                const D = await ve(L, e && e.contentBase ? e.contentBase : void 0);
                if (D && typeof D.status == "number" && D.status === 404) continue;
                if (D && D.raw) {
                  const J = (D.raw || "").match(/^#\s+(.+)$/m), ye = J && J[1] ? J[1].trim() : "", ee = ke(ye || L), ce = String(ee).split("::")[0];
                  ee && !w.has(ee) && !f.has(ee) && !c.has(ce) && (f.add(ee), h.push({ loc: l + "?page=" + encodeURIComponent(ee), slug: ee, sourcePath: L, title: ye || void 0 }));
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
    for (const b of h)
      try {
        if (!b || !b.slug) continue;
        f.set(String(b.slug), b);
      } catch {
      }
    const w = /* @__PURE__ */ new Set();
    for (const b of h)
      try {
        if (!b || !b.slug) continue;
        const k = String(b.slug), S = k.split("::")[0];
        if (!S) continue;
        k !== S && !f.has(S) && w.add(S);
      } catch {
      }
    for (const b of w)
      try {
        let k = null;
        if (m.has(b)) {
          const S = m.get(b);
          k = { loc: l + "?page=" + encodeURIComponent(b), slug: b }, S && S.title && (k.title = S.title, k._titleSource = "index"), S && S.excerpt && (k.excerpt = S.excerpt), S && S.path && (k.sourcePath = S.path);
        } else if (d && K && K.has(b)) {
          const S = K.get(b);
          let v = null;
          if (typeof S == "string" ? v = le(String(S)) : S && typeof S == "object" && (v = le(String(S.default || ""))), k = { loc: l + "?page=" + encodeURIComponent(b), slug: b }, v && d.has(v)) {
            const C = d.get(v);
            C && C.title && (k.title = C.title, k._titleSource = "path"), C && C.excerpt && (k.excerpt = C.excerpt), k.sourcePath = v;
          }
        }
        k || (k = { loc: l + "?page=" + encodeURIComponent(b), slug: b, title: Li(b) }, k._titleSource = "humanize"), f.has(b) || (h.push(k), f.set(b, k));
      } catch {
      }
  } catch {
  }
  const y = [];
  try {
    const f = /* @__PURE__ */ new Set();
    for (const w of h)
      try {
        if (!w || !w.slug) continue;
        const b = String(w.slug), k = String(b).split("::")[0];
        if (c.has(k) || b.indexOf("::") !== -1 || f.has(b)) continue;
        f.add(b), y.push(w);
      } catch {
      }
  } catch {
  }
  try {
    try {
      He("[runtimeSitemap] generateSitemapJson finalEntries.titleSource:", JSON.stringify(y.map((f) => ({ slug: f.slug, title: f.title, titleSource: f._titleSource || null })), null, 2));
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
          const C = String(v.slug).split("::")[0];
          if (c.has(C) || v._titleSource === "index") continue;
          let U = null;
          try {
            if (K && K.has(v.slug)) {
              const z = K.get(v.slug);
              typeof z == "string" ? U = le(String(z)) : z && typeof z == "object" && (U = le(String(z.default || "")));
            }
            !U && v.sourcePath && (U = v.sourcePath);
          } catch {
            continue;
          }
          if (!U || p.has(U) || !g(U)) continue;
          try {
            const z = await ve(U, e && e.contentBase ? e.contentBase : void 0);
            if (!z || !z.raw || z && typeof z.status == "number" && z.status === 404) continue;
            if (z && z.raw) {
              const q = (z.raw || "").match(/^#\s+(.+)$/m), M = q && q[1] ? q[1].trim() : "";
              M && (v.title = M, v._titleSource = "fetched");
            }
          } catch (z) {
            He("[runtimeSitemap] fetch title failed for", U, z);
          }
        } catch (C) {
          He("[runtimeSitemap] worker loop failure", C);
        }
      }
    });
    await Promise.all(k);
  } catch (f) {
    He("[runtimeSitemap] title enrichment failed", f);
  }
  return { generatedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: y };
}
function wr(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [];
  let n = `<?xml version="1.0" encoding="UTF-8"?>
`;
  n += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  for (const i of t)
    try {
      n += `  <url>
`, n += `    <loc>${ze(String(i.loc || ""))}</loc>
`, n += `  </url>
`;
    } catch {
    }
  return n += `</urlset>
`, n;
}
function _r(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [], n = Br().split("?")[0];
  let i = `<?xml version="1.0" encoding="UTF-8"?>
`;
  i += `<rss version="2.0">
`, i += `<channel>
`, i += `<title>${ze("Sitemap RSS")}</title>
`, i += `<link>${ze(n)}</link>
`, i += `<description>${ze("RSS feed generated from site index")}</description>
`, i += `<lastBuildDate>${ze(e && e.generatedAt ? new Date(e.generatedAt).toUTCString() : (/* @__PURE__ */ new Date()).toUTCString())}</lastBuildDate>
`;
  for (const r of t)
    try {
      const a = String(r.loc || "");
      i += `<item>
`, i += `<title>${ze(String(r.title || r.slug || r.loc || ""))}</title>
`, r.excerpt && (i += `<description>${ze(String(r.excerpt))}</description>
`), i += `<link>${ze(a)}</link>
`, i += `<guid>${ze(a)}</guid>
`, i += `</item>
`;
    } catch {
    }
  return i += `</channel>
`, i += `</rss>
`, i;
}
function kr(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [], n = Br().split("?")[0], i = e && e.generatedAt ? new Date(e.generatedAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
  let r = `<?xml version="1.0" encoding="utf-8"?>
`;
  r += `<feed xmlns="http://www.w3.org/2005/Atom">
`, r += `<title>${ze("Sitemap Atom")}</title>
`, r += `<link href="${ze(n)}" />
`, r += `<updated>${ze(i)}</updated>
`, r += `<id>${ze(n)}</id>
`;
  for (const a of t)
    try {
      const s = String(a.loc || ""), l = a && a.lastmod ? new Date(a.lastmod).toISOString() : i;
      r += `<entry>
`, r += `<title>${ze(String(a.title || a.slug || a.loc || ""))}</title>
`, a.excerpt && (r += `<summary>${ze(String(a.excerpt))}</summary>
`), r += `<link href="${ze(s)}" />
`, r += `<id>${ze(s)}</id>
`, r += `<updated>${ze(l)}</updated>
`, r += `</entry>
`;
    } catch {
    }
  return r += `</feed>
`, r;
}
function Mi(e, t = "application/xml") {
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
      document.body.innerHTML = "<pre>" + ze(e) + "</pre>";
    } catch {
    }
  }
}
function Ri(e) {
  try {
    const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [];
    let n = '<!doctype html><html><head><meta charset="utf-8"><title>Sitemap</title></head><body>';
    n += "<h1>Sitemap</h1><ul>";
    for (const i of t)
      try {
        n += `<li><a href="${ze(String(i && i.loc ? i.loc : ""))}">${ze(String(i && (i.title || i.slug) || i && i.loc || ""))}</a></li>`;
      } catch {
      }
    return n += "</ul></body></html>", n;
  } catch {
    return "<!doctype html><html><body><pre>failed to render sitemap</pre></body></html>";
  }
}
function Rn(e, t = "application/xml") {
  try {
    if (typeof window > "u") {
      try {
        let i = null;
        t === "application/rss+xml" ? i = _r(e) : t === "application/atom+xml" ? i = kr(e) : t === "text/html" ? i = Ri(e) : i = wr(e), Mi(i, t);
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
          r.mimeType === "application/rss+xml" ? a = _r(r.finalJson) : r.mimeType === "application/atom+xml" ? a = kr(r.finalJson) : r.mimeType === "text/html" ? a = Ri(r.finalJson) : a = wr(r.finalJson);
          try {
            Mi(a, r.mimeType);
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
async function wl(e = {}) {
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
      if (typeof _t == "function")
        try {
          const c = await _t({ timeoutMs: s, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 });
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
            a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(Z) && Z.length ? Z : [];
        } catch {
          a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(Z) && Z.length ? Z : [];
        }
      else
        a = Array.isArray(Z) && Z.length ? Z : Array.isArray(e.index) && e.index.length ? e.index : [];
    } catch {
      a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(Z) && Z.length ? Z : [];
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
            He("[runtimeSitemap] providedIndex.dedupedByBase:", JSON.stringify(Array.from(c.values()), null, 2));
          } catch {
            He("[runtimeSitemap] providedIndex.dedupedByBase (count):", c.size);
          }
        } catch (c) {
          Wt("[runtimeSitemap] logging provided index failed", c);
        }
    } catch {
    }
    if ((!Array.isArray(a) || !a.length) && typeof Lt == "function")
      try {
        const c = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
        let u = null;
        try {
          typeof _t == "function" && (u = await _t({ timeoutMs: c, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 }));
        } catch {
          u = null;
        }
        if (Array.isArray(u) && u.length)
          a = u;
        else {
          const h = typeof e.indexDepth == "number" ? e.indexDepth : 3, m = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, d = [];
          e && e.homePage && d.push(e.homePage), e && e.navigationPage && d.push(e.navigationPage), a = await Lt(e && e.contentBase ? e.contentBase : void 0, h, m, d.length ? d : void 0);
        }
      } catch (c) {
        Wt("[runtimeSitemap] rebuild index failed", c), a = Array.isArray(Z) && Z.length ? Z : [];
      }
    try {
      const c = Array.isArray(a) ? a.length : 0;
      try {
        He("[runtimeSitemap] usedIndex.full.length (before rebuild):", c);
      } catch {
      }
      try {
        He("[runtimeSitemap] usedIndex.full (before rebuild):", JSON.stringify(a, null, 2));
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
      if ((!m || !m.length) && typeof Lt == "function")
        try {
          m = await Lt(e && e.contentBase ? e.contentBase : void 0, u, h, c.length ? c : void 0);
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
        Wt("[runtimeSitemap] rebuild index call failed", c);
      } catch {
      }
    }
    try {
      const c = Array.isArray(a) ? a.length : 0;
      try {
        He("[runtimeSitemap] usedIndex.full.length (after rebuild):", c);
      } catch {
      }
      try {
        He("[runtimeSitemap] usedIndex.full (after rebuild):", JSON.stringify(a, null, 2));
      } catch {
      }
    } catch {
    }
    const l = await qr(Object.assign({}, e, { index: a }));
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
        He("[runtimeSitemap] finalEntries.dedupedByBase:", JSON.stringify(o, null, 2));
      } catch {
        He("[runtimeSitemap] finalEntries.dedupedByBase (count):", o.length);
      }
    } catch {
      try {
        o = Array.isArray(l && l.entries) ? l.entries.slice(0) : [];
      } catch {
        o = [];
      }
    }
    const p = Object.assign({}, l || {}, { entries: Array.isArray(o) ? o : Array.isArray(l && l.entries) ? l.entries : [] });
    try {
      if (typeof window < "u")
        try {
          window.__nimbiSitemapJson = p, window.__nimbiSitemapFinal = o;
        } catch {
        }
    } catch {
    }
    if (n) {
      const c = Array.isArray(p && p.entries) ? p.entries.length : 0;
      let u = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (u = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (u > c) {
        try {
          He("[runtimeSitemap] skip RSS write: existing rendered sitemap larger", u, c);
        } catch {
        }
        return !0;
      }
      return Rn(p, "application/rss+xml"), !0;
    }
    if (i) {
      const c = Array.isArray(p && p.entries) ? p.entries.length : 0;
      let u = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (u = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (u > c) {
        try {
          He("[runtimeSitemap] skip Atom write: existing rendered sitemap larger", u, c);
        } catch {
        }
        return !0;
      }
      return Rn(p, "application/atom+xml"), !0;
    }
    if (t) {
      const c = Array.isArray(p && p.entries) ? p.entries.length : 0;
      let u = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (u = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (u > c) {
        try {
          He("[runtimeSitemap] skip XML write: existing rendered sitemap larger", u, c);
        } catch {
        }
        return !0;
      }
      return Rn(p, "application/xml"), !0;
    }
    if (r)
      try {
        const u = (Array.isArray(p && p.entries) ? p.entries : []).length;
        let h = -1;
        try {
          typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (h = window.__nimbiSitemapFinal.length);
        } catch {
        }
        if (h > u) {
          try {
            He("[runtimeSitemap] skip HTML write: existing rendered sitemap larger", h, u);
          } catch {
          }
          return !0;
        }
        return Rn(p, "text/html"), !0;
      } catch (c) {
        return Wt("[runtimeSitemap] render HTML failed", c), !1;
      }
    return !1;
  } catch (t) {
    return Wt("[runtimeSitemap] handleSitemapRequest failed", t), !1;
  }
}
async function _l(e = {}) {
  try {
    const t = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
    let n = [];
    try {
      if (typeof _t == "function")
        try {
          const s = await _t({ timeoutMs: t, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 });
          Array.isArray(s) && s.length && (n = s);
        } catch {
        }
    } catch {
    }
    (!Array.isArray(n) || !n.length) && Array.isArray(Z) && Z.length && (n = Z), (!Array.isArray(n) || !n.length) && Array.isArray(e.index) && e.index.length && (n = e.index);
    const i = await qr(Object.assign({}, e, { index: n }));
    let r = [];
    try {
      const s = /* @__PURE__ */ new Set(), l = Array.isArray(i && i.entries) ? i.entries : [];
      for (const o of l)
        try {
          let p = null;
          if (o && o.slug) p = String(o.slug);
          else if (o && o.loc)
            try {
              p = new URL(String(o.loc)).searchParams.get("page");
            } catch {
              p = null;
            }
          if (!p) continue;
          const c = String(p).split("::")[0];
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
  exposeSitemapGlobals: _l,
  generateAtomXml: kr,
  generateRssXml: _r,
  generateSitemapJson: qr,
  generateSitemapXml: wr,
  handleSitemapRequest: wl
}, Symbol.toStringTag, { value: "Module" }));
export {
  $i as BAD_LANGUAGES,
  _e as SUPPORTED_HLJS_MAP,
  vl as _clearHooks,
  Sr as addHook,
  Ll as default,
  rs as ensureBulma,
  ml as getVersion,
  Ll as initCMS,
  Ni as loadL10nFile,
  zi as loadSupportedLanguages,
  ts as observeCodeBlocks,
  xl as onNavBuild,
  kl as onPageLoad,
  on as registerLanguage,
  ri as runHooks,
  Al as setHighlightTheme,
  Bi as setLang,
  is as setStyle,
  El as setThemeVars,
  Zt as t,
  Sl as transformHtml
};
