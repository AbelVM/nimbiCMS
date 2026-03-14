const bt = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: []
};
function vn(t, e) {
  if (!Object.prototype.hasOwnProperty.call(bt, t))
    throw new Error('Unknown hook "' + t + '"');
  if (typeof e != "function")
    throw new TypeError("hook callback must be a function");
  bt[t].push(e);
}
function el(t) {
  vn("onPageLoad", t);
}
function tl(t) {
  vn("onNavBuild", t);
}
function nl(t) {
  vn("transformHtml", t);
}
async function Vn(t, e) {
  const r = bt[t] || [];
  for (const i of r)
    try {
      await i(e);
    } catch (n) {
      console.warn("[nimbi-cms] runHooks callback failed", n);
    }
}
function rl() {
  Object.keys(bt).forEach((t) => {
    bt[t].length = 0;
  });
}
function vr(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var sn, Jn;
function Js() {
  if (Jn) return sn;
  Jn = 1;
  function t(d) {
    return d instanceof Map ? d.clear = d.delete = d.set = function() {
      throw new Error("map is read-only");
    } : d instanceof Set && (d.add = d.clear = d.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(d), Object.getOwnPropertyNames(d).forEach((S) => {
      const R = d[S], j = typeof R;
      (j === "object" || j === "function") && !Object.isFrozen(R) && t(R);
    }), d;
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
  function r(d) {
    return d.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function i(d, ...S) {
    const R = /* @__PURE__ */ Object.create(null);
    for (const j in d)
      R[j] = d[j];
    return S.forEach(function(j) {
      for (const ce in j)
        R[ce] = j[ce];
    }), /** @type {T} */
    R;
  }
  const n = "</span>", s = (d) => !!d.scope, a = (d, { prefix: S }) => {
    if (d.startsWith("language:"))
      return d.replace("language:", "language-");
    if (d.includes(".")) {
      const R = d.split(".");
      return [
        `${S}${R.shift()}`,
        ...R.map((j, ce) => `${j}${"_".repeat(ce + 1)}`)
      ].join(" ");
    }
    return `${S}${d}`;
  };
  class o {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(S, R) {
      this.buffer = "", this.classPrefix = R.classPrefix, S.walk(this);
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
      const R = a(
        S.scope,
        { prefix: this.classPrefix }
      );
      this.span(R);
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
  const l = (d = {}) => {
    const S = { children: [] };
    return Object.assign(S, d), S;
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
    add(S) {
      this.top.children.push(S);
    }
    /** @param {string} scope */
    openNode(S) {
      const R = l({ scope: S });
      this.add(R), this.stack.push(R);
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
    static _walk(S, R) {
      return typeof R == "string" ? S.addText(R) : R.children && (S.openNode(R), R.children.forEach((j) => this._walk(S, j)), S.closeNode(R)), S;
    }
    /**
     * @param {Node} node
     */
    static _collapse(S) {
      typeof S != "string" && S.children && (S.children.every((R) => typeof R == "string") ? S.children = [S.children.join("")] : S.children.forEach((R) => {
        c._collapse(R);
      }));
    }
  }
  class u extends c {
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
    __addSublanguage(S, R) {
      const j = S.root;
      R && (j.scope = `language:${R}`), this.add(j);
    }
    toHTML() {
      return new o(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function h(d) {
    return d ? typeof d == "string" ? d : d.source : null;
  }
  function f(d) {
    return m("(?=", d, ")");
  }
  function p(d) {
    return m("(?:", d, ")*");
  }
  function g(d) {
    return m("(?:", d, ")?");
  }
  function m(...d) {
    return d.map((R) => h(R)).join("");
  }
  function w(d) {
    const S = d[d.length - 1];
    return typeof S == "object" && S.constructor === Object ? (d.splice(d.length - 1, 1), S) : {};
  }
  function k(...d) {
    return "(" + (w(d).capture ? "" : "?:") + d.map((j) => h(j)).join("|") + ")";
  }
  function v(d) {
    return new RegExp(d.toString() + "|").exec("").length - 1;
  }
  function D(d, S) {
    const R = d && d.exec(S);
    return R && R.index === 0;
  }
  const L = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function B(d, { joinWith: S }) {
    let R = 0;
    return d.map((j) => {
      R += 1;
      const ce = R;
      let ue = h(j), z = "";
      for (; ue.length > 0; ) {
        const $ = L.exec(ue);
        if (!$) {
          z += ue;
          break;
        }
        z += ue.substring(0, $.index), ue = ue.substring($.index + $[0].length), $[0][0] === "\\" && $[1] ? z += "\\" + String(Number($[1]) + ce) : (z += $[0], $[0] === "(" && R++);
      }
      return z;
    }).map((j) => `(${j})`).join(S);
  }
  const I = /\b\B/, ee = "[a-zA-Z]\\w*", ne = "[a-zA-Z_]\\w*", Y = "\\b\\d+(\\.\\d+)?", te = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", q = "\\b(0b[01]+)", _ = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", M = (d = {}) => {
    const S = /^#![ ]*\//;
    return d.binary && (d.begin = m(
      S,
      /.*\b/,
      d.binary,
      /\b.*/
    )), i({
      scope: "meta",
      begin: S,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (R, j) => {
        R.index !== 0 && j.ignoreMatch();
      }
    }, d);
  }, T = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, x = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [T]
  }, b = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [T]
  }, A = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, y = function(d, S, R = {}) {
    const j = i(
      {
        scope: "comment",
        begin: d,
        end: S,
        contains: []
      },
      R
    );
    j.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const ce = k(
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
    return j.contains.push(
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
          ce,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), j;
  }, P = y("//", "$"), G = y("/\\*", "\\*/"), re = y("#", "$"), Ee = {
    scope: "number",
    begin: Y,
    relevance: 0
  }, Se = {
    scope: "number",
    begin: te,
    relevance: 0
  }, we = {
    scope: "number",
    begin: q,
    relevance: 0
  }, fe = {
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
  }, Ae = {
    scope: "title",
    begin: ee,
    relevance: 0
  }, Ne = {
    scope: "title",
    begin: ne,
    relevance: 0
  }, fs = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + ne,
    relevance: 0
  };
  var Et = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: x,
    BACKSLASH_ESCAPE: T,
    BINARY_NUMBER_MODE: we,
    BINARY_NUMBER_RE: q,
    COMMENT: y,
    C_BLOCK_COMMENT_MODE: G,
    C_LINE_COMMENT_MODE: P,
    C_NUMBER_MODE: Se,
    C_NUMBER_RE: te,
    END_SAME_AS_BEGIN: function(d) {
      return Object.assign(
        d,
        {
          /** @type {ModeCallback} */
          "on:begin": (S, R) => {
            R.data._beginMatch = S[1];
          },
          /** @type {ModeCallback} */
          "on:end": (S, R) => {
            R.data._beginMatch !== S[1] && R.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: re,
    IDENT_RE: ee,
    MATCH_NOTHING_RE: I,
    METHOD_GUARD: fs,
    NUMBER_MODE: Ee,
    NUMBER_RE: Y,
    PHRASAL_WORDS_MODE: A,
    QUOTE_STRING_MODE: b,
    REGEXP_MODE: fe,
    RE_STARTERS_RE: _,
    SHEBANG: M,
    TITLE_MODE: Ae,
    UNDERSCORE_IDENT_RE: ne,
    UNDERSCORE_TITLE_MODE: Ne
  });
  function gs(d, S) {
    d.input[d.index - 1] === "." && S.ignoreMatch();
  }
  function ms(d, S) {
    d.className !== void 0 && (d.scope = d.className, delete d.className);
  }
  function ws(d, S) {
    S && d.beginKeywords && (d.begin = "\\b(" + d.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", d.__beforeBegin = gs, d.keywords = d.keywords || d.beginKeywords, delete d.beginKeywords, d.relevance === void 0 && (d.relevance = 0));
  }
  function bs(d, S) {
    Array.isArray(d.illegal) && (d.illegal = k(...d.illegal));
  }
  function ys(d, S) {
    if (d.match) {
      if (d.begin || d.end) throw new Error("begin & end are not supported with match");
      d.begin = d.match, delete d.match;
    }
  }
  function ks(d, S) {
    d.relevance === void 0 && (d.relevance = 1);
  }
  const xs = (d, S) => {
    if (!d.beforeMatch) return;
    if (d.starts) throw new Error("beforeMatch cannot be used with starts");
    const R = Object.assign({}, d);
    Object.keys(d).forEach((j) => {
      delete d[j];
    }), d.keywords = R.keywords, d.begin = m(R.beforeMatch, f(R.begin)), d.starts = {
      relevance: 0,
      contains: [
        Object.assign(R, { endsParent: !0 })
      ]
    }, d.relevance = 0, delete R.beforeMatch;
  }, Ss = [
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
  ], vs = "keyword";
  function Bn(d, S, R = vs) {
    const j = /* @__PURE__ */ Object.create(null);
    return typeof d == "string" ? ce(R, d.split(" ")) : Array.isArray(d) ? ce(R, d) : Object.keys(d).forEach(function(ue) {
      Object.assign(
        j,
        Bn(d[ue], S, ue)
      );
    }), j;
    function ce(ue, z) {
      S && (z = z.map(($) => $.toLowerCase())), z.forEach(function($) {
        const H = $.split("|");
        j[H[0]] = [ue, Es(H[0], H[1])];
      });
    }
  }
  function Es(d, S) {
    return S ? Number(S) : As(d) ? 0 : 1;
  }
  function As(d) {
    return Ss.includes(d.toLowerCase());
  }
  const On = {}, Ge = (d) => {
    console.error(d);
  }, Nn = (d, ...S) => {
    console.log(`WARN: ${d}`, ...S);
  }, et = (d, S) => {
    On[`${d}/${S}`] || (console.log(`Deprecated as of ${d}. ${S}`), On[`${d}/${S}`] = !0);
  }, At = new Error();
  function Dn(d, S, { key: R }) {
    let j = 0;
    const ce = d[R], ue = {}, z = {};
    for (let $ = 1; $ <= S.length; $++)
      z[$ + j] = ce[$], ue[$ + j] = !0, j += v(S[$ - 1]);
    d[R] = z, d[R]._emit = ue, d[R]._multi = !0;
  }
  function Rs(d) {
    if (Array.isArray(d.begin)) {
      if (d.skip || d.excludeBegin || d.returnBegin)
        throw Ge("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), At;
      if (typeof d.beginScope != "object" || d.beginScope === null)
        throw Ge("beginScope must be object"), At;
      Dn(d, d.begin, { key: "beginScope" }), d.begin = B(d.begin, { joinWith: "" });
    }
  }
  function Ts(d) {
    if (Array.isArray(d.end)) {
      if (d.skip || d.excludeEnd || d.returnEnd)
        throw Ge("skip, excludeEnd, returnEnd not compatible with endScope: {}"), At;
      if (typeof d.endScope != "object" || d.endScope === null)
        throw Ge("endScope must be object"), At;
      Dn(d, d.end, { key: "endScope" }), d.end = B(d.end, { joinWith: "" });
    }
  }
  function Cs(d) {
    d.scope && typeof d.scope == "object" && d.scope !== null && (d.beginScope = d.scope, delete d.scope);
  }
  function _s(d) {
    Cs(d), typeof d.beginScope == "string" && (d.beginScope = { _wrap: d.beginScope }), typeof d.endScope == "string" && (d.endScope = { _wrap: d.endScope }), Rs(d), Ts(d);
  }
  function Ls(d) {
    function S(z, $) {
      return new RegExp(
        h(z),
        "m" + (d.case_insensitive ? "i" : "") + (d.unicodeRegex ? "u" : "") + ($ ? "g" : "")
      );
    }
    class R {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule($, H) {
        H.position = this.position++, this.matchIndexes[this.matchAt] = H, this.regexes.push([H, $]), this.matchAt += v($) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const $ = this.regexes.map((H) => H[1]);
        this.matcherRe = S(B($, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec($) {
        this.matcherRe.lastIndex = this.lastIndex;
        const H = this.matcherRe.exec($);
        if (!H)
          return null;
        const de = H.findIndex((it, Vt) => Vt > 0 && it !== void 0), he = this.matchIndexes[de];
        return H.splice(0, de), Object.assign(H, he);
      }
    }
    class j {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher($) {
        if (this.multiRegexes[$]) return this.multiRegexes[$];
        const H = new R();
        return this.rules.slice($).forEach(([de, he]) => H.addRule(de, he)), H.compile(), this.multiRegexes[$] = H, H;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule($, H) {
        this.rules.push([$, H]), H.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec($) {
        const H = this.getMatcher(this.regexIndex);
        H.lastIndex = this.lastIndex;
        let de = H.exec($);
        if (this.resumingScanAtSamePosition() && !(de && de.index === this.lastIndex)) {
          const he = this.getMatcher(0);
          he.lastIndex = this.lastIndex + 1, de = he.exec($);
        }
        return de && (this.regexIndex += de.position + 1, this.regexIndex === this.count && this.considerAll()), de;
      }
    }
    function ce(z) {
      const $ = new j();
      return z.contains.forEach((H) => $.addRule(H.begin, { rule: H, type: "begin" })), z.terminatorEnd && $.addRule(z.terminatorEnd, { type: "end" }), z.illegal && $.addRule(z.illegal, { type: "illegal" }), $;
    }
    function ue(z, $) {
      const H = (
        /** @type CompiledMode */
        z
      );
      if (z.isCompiled) return H;
      [
        ms,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        ys,
        _s,
        xs
      ].forEach((he) => he(z, $)), d.compilerExtensions.forEach((he) => he(z, $)), z.__beforeBegin = null, [
        ws,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        bs,
        // default to 1 relevance if not specified
        ks
      ].forEach((he) => he(z, $)), z.isCompiled = !0;
      let de = null;
      return typeof z.keywords == "object" && z.keywords.$pattern && (z.keywords = Object.assign({}, z.keywords), de = z.keywords.$pattern, delete z.keywords.$pattern), de = de || /\w+/, z.keywords && (z.keywords = Bn(z.keywords, d.case_insensitive)), H.keywordPatternRe = S(de, !0), $ && (z.begin || (z.begin = /\B|\b/), H.beginRe = S(H.begin), !z.end && !z.endsWithParent && (z.end = /\B|\b/), z.end && (H.endRe = S(H.end)), H.terminatorEnd = h(H.end) || "", z.endsWithParent && $.terminatorEnd && (H.terminatorEnd += (z.end ? "|" : "") + $.terminatorEnd)), z.illegal && (H.illegalRe = S(
        /** @type {RegExp | string} */
        z.illegal
      )), z.contains || (z.contains = []), z.contains = [].concat(...z.contains.map(function(he) {
        return Ms(he === "self" ? z : he);
      })), z.contains.forEach(function(he) {
        ue(
          /** @type Mode */
          he,
          H
        );
      }), z.starts && ue(z.starts, $), H.matcher = ce(H), H;
    }
    if (d.compilerExtensions || (d.compilerExtensions = []), d.contains && d.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return d.classNameAliases = i(d.classNameAliases || {}), ue(
      /** @type Mode */
      d
    );
  }
  function qn(d) {
    return d ? d.endsWithParent || qn(d.starts) : !1;
  }
  function Ms(d) {
    return d.variants && !d.cachedVariants && (d.cachedVariants = d.variants.map(function(S) {
      return i(d, { variants: null }, S);
    })), d.cachedVariants ? d.cachedVariants : qn(d) ? i(d, { starts: d.starts ? i(d.starts) : null }) : Object.isFrozen(d) ? i(d) : d;
  }
  var $s = "11.11.1";
  class Ps extends Error {
    constructor(S, R) {
      super(S), this.name = "HTMLInjectionError", this.html = R;
    }
  }
  const Kt = r, Hn = i, Un = /* @__PURE__ */ Symbol("nomatch"), Is = 7, jn = function(d) {
    const S = /* @__PURE__ */ Object.create(null), R = /* @__PURE__ */ Object.create(null), j = [];
    let ce = !0;
    const ue = "Could not find the language '{}', did you forget to load/include a language module?", z = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let $ = {
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
    function H(E) {
      return $.noHighlightRe.test(E);
    }
    function de(E) {
      let N = E.className + " ";
      N += E.parentNode ? E.parentNode.className : "";
      const X = $.languageDetectRe.exec(N);
      if (X) {
        const ae = He(X[1]);
        return ae || (Nn(ue.replace("{}", X[1])), Nn("Falling back to no-highlight mode for this block.", E)), ae ? X[1] : "no-highlight";
      }
      return N.split(/\s+/).find((ae) => H(ae) || He(ae));
    }
    function he(E, N, X) {
      let ae = "", pe = "";
      typeof N == "object" ? (ae = E, X = N.ignoreIllegals, pe = N.language) : (et("10.7.0", "highlight(lang, code, ...args) has been deprecated."), et("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), pe = E, ae = N), X === void 0 && (X = !0);
      const Me = {
        code: ae,
        language: pe
      };
      Tt("before:highlight", Me);
      const Ue = Me.result ? Me.result : it(Me.language, Me.code, X);
      return Ue.code = Me.code, Tt("after:highlight", Ue), Ue;
    }
    function it(E, N, X, ae) {
      const pe = /* @__PURE__ */ Object.create(null);
      function Me(C, O) {
        return C.keywords[O];
      }
      function Ue() {
        if (!W.keywords) {
          ge.addText(le);
          return;
        }
        let C = 0;
        W.keywordPatternRe.lastIndex = 0;
        let O = W.keywordPatternRe.exec(le), Z = "";
        for (; O; ) {
          Z += le.substring(C, O.index);
          const se = ze.case_insensitive ? O[0].toLowerCase() : O[0], be = Me(W, se);
          if (be) {
            const [De, Ks] = be;
            if (ge.addText(Z), Z = "", pe[se] = (pe[se] || 0) + 1, pe[se] <= Is && (Lt += Ks), De.startsWith("_"))
              Z += O[0];
            else {
              const Vs = ze.classNameAliases[De] || De;
              Ie(O[0], Vs);
            }
          } else
            Z += O[0];
          C = W.keywordPatternRe.lastIndex, O = W.keywordPatternRe.exec(le);
        }
        Z += le.substring(C), ge.addText(Z);
      }
      function Ct() {
        if (le === "") return;
        let C = null;
        if (typeof W.subLanguage == "string") {
          if (!S[W.subLanguage]) {
            ge.addText(le);
            return;
          }
          C = it(W.subLanguage, le, !0, Kn[W.subLanguage]), Kn[W.subLanguage] = /** @type {CompiledMode} */
          C._top;
        } else
          C = Jt(le, W.subLanguage.length ? W.subLanguage : null);
        W.relevance > 0 && (Lt += C.relevance), ge.__addSublanguage(C._emitter, C.language);
      }
      function Re() {
        W.subLanguage != null ? Ct() : Ue(), le = "";
      }
      function Ie(C, O) {
        C !== "" && (ge.startScope(O), ge.addText(C), ge.endScope());
      }
      function Qn(C, O) {
        let Z = 1;
        const se = O.length - 1;
        for (; Z <= se; ) {
          if (!C._emit[Z]) {
            Z++;
            continue;
          }
          const be = ze.classNameAliases[C[Z]] || C[Z], De = O[Z];
          be ? Ie(De, be) : (le = De, Ue(), le = ""), Z++;
        }
      }
      function Gn(C, O) {
        return C.scope && typeof C.scope == "string" && ge.openNode(ze.classNameAliases[C.scope] || C.scope), C.beginScope && (C.beginScope._wrap ? (Ie(le, ze.classNameAliases[C.beginScope._wrap] || C.beginScope._wrap), le = "") : C.beginScope._multi && (Qn(C.beginScope, O), le = "")), W = Object.create(C, { parent: { value: W } }), W;
      }
      function Xn(C, O, Z) {
        let se = D(C.endRe, Z);
        if (se) {
          if (C["on:end"]) {
            const be = new e(C);
            C["on:end"](O, be), be.isMatchIgnored && (se = !1);
          }
          if (se) {
            for (; C.endsParent && C.parent; )
              C = C.parent;
            return C;
          }
        }
        if (C.endsWithParent)
          return Xn(C.parent, O, Z);
      }
      function Zs(C) {
        return W.matcher.regexIndex === 0 ? (le += C[0], 1) : (rn = !0, 0);
      }
      function Qs(C) {
        const O = C[0], Z = C.rule, se = new e(Z), be = [Z.__beforeBegin, Z["on:begin"]];
        for (const De of be)
          if (De && (De(C, se), se.isMatchIgnored))
            return Zs(O);
        return Z.skip ? le += O : (Z.excludeBegin && (le += O), Re(), !Z.returnBegin && !Z.excludeBegin && (le = O)), Gn(Z, C), Z.returnBegin ? 0 : O.length;
      }
      function Gs(C) {
        const O = C[0], Z = N.substring(C.index), se = Xn(W, C, Z);
        if (!se)
          return Un;
        const be = W;
        W.endScope && W.endScope._wrap ? (Re(), Ie(O, W.endScope._wrap)) : W.endScope && W.endScope._multi ? (Re(), Qn(W.endScope, C)) : be.skip ? le += O : (be.returnEnd || be.excludeEnd || (le += O), Re(), be.excludeEnd && (le = O));
        do
          W.scope && ge.closeNode(), !W.skip && !W.subLanguage && (Lt += W.relevance), W = W.parent;
        while (W !== se.parent);
        return se.starts && Gn(se.starts, C), be.returnEnd ? 0 : O.length;
      }
      function Xs() {
        const C = [];
        for (let O = W; O !== ze; O = O.parent)
          O.scope && C.unshift(O.scope);
        C.forEach((O) => ge.openNode(O));
      }
      let _t = {};
      function Yn(C, O) {
        const Z = O && O[0];
        if (le += C, Z == null)
          return Re(), 0;
        if (_t.type === "begin" && O.type === "end" && _t.index === O.index && Z === "") {
          if (le += N.slice(O.index, O.index + 1), !ce) {
            const se = new Error(`0 width match regex (${E})`);
            throw se.languageName = E, se.badRule = _t.rule, se;
          }
          return 1;
        }
        if (_t = O, O.type === "begin")
          return Qs(O);
        if (O.type === "illegal" && !X) {
          const se = new Error('Illegal lexeme "' + Z + '" for mode "' + (W.scope || "<unnamed>") + '"');
          throw se.mode = W, se;
        } else if (O.type === "end") {
          const se = Gs(O);
          if (se !== Un)
            return se;
        }
        if (O.type === "illegal" && Z === "")
          return le += `
`, 1;
        if (nn > 1e5 && nn > O.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return le += Z, Z.length;
      }
      const ze = He(E);
      if (!ze)
        throw Ge(ue.replace("{}", E)), new Error('Unknown language: "' + E + '"');
      const Ys = Ls(ze);
      let tn = "", W = ae || Ys;
      const Kn = {}, ge = new $.__emitter($);
      Xs();
      let le = "", Lt = 0, Xe = 0, nn = 0, rn = !1;
      try {
        if (ze.__emitTokens)
          ze.__emitTokens(N, ge);
        else {
          for (W.matcher.considerAll(); ; ) {
            nn++, rn ? rn = !1 : W.matcher.considerAll(), W.matcher.lastIndex = Xe;
            const C = W.matcher.exec(N);
            if (!C) break;
            const O = N.substring(Xe, C.index), Z = Yn(O, C);
            Xe = C.index + Z;
          }
          Yn(N.substring(Xe));
        }
        return ge.finalize(), tn = ge.toHTML(), {
          language: E,
          value: tn,
          relevance: Lt,
          illegal: !1,
          _emitter: ge,
          _top: W
        };
      } catch (C) {
        if (C.message && C.message.includes("Illegal"))
          return {
            language: E,
            value: Kt(N),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: C.message,
              index: Xe,
              context: N.slice(Xe - 100, Xe + 100),
              mode: C.mode,
              resultSoFar: tn
            },
            _emitter: ge
          };
        if (ce)
          return {
            language: E,
            value: Kt(N),
            illegal: !1,
            relevance: 0,
            errorRaised: C,
            _emitter: ge,
            _top: W
          };
        throw C;
      }
    }
    function Vt(E) {
      const N = {
        value: Kt(E),
        illegal: !1,
        relevance: 0,
        _top: z,
        _emitter: new $.__emitter($)
      };
      return N._emitter.addText(E), N;
    }
    function Jt(E, N) {
      N = N || $.languages || Object.keys(S);
      const X = Vt(E), ae = N.filter(He).filter(Zn).map(
        (Re) => it(Re, E, !1)
      );
      ae.unshift(X);
      const pe = ae.sort((Re, Ie) => {
        if (Re.relevance !== Ie.relevance) return Ie.relevance - Re.relevance;
        if (Re.language && Ie.language) {
          if (He(Re.language).supersetOf === Ie.language)
            return 1;
          if (He(Ie.language).supersetOf === Re.language)
            return -1;
        }
        return 0;
      }), [Me, Ue] = pe, Ct = Me;
      return Ct.secondBest = Ue, Ct;
    }
    function zs(E, N, X) {
      const ae = N && R[N] || X;
      E.classList.add("hljs"), E.classList.add(`language-${ae}`);
    }
    function en(E) {
      let N = null;
      const X = de(E);
      if (H(X)) return;
      if (Tt(
        "before:highlightElement",
        { el: E, language: X }
      ), E.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", E);
        return;
      }
      if (E.children.length > 0 && ($.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(E)), $.throwUnescapedHTML))
        throw new Ps(
          "One of your code blocks includes unescaped HTML.",
          E.innerHTML
        );
      N = E;
      const ae = N.textContent, pe = X ? he(ae, { language: X, ignoreIllegals: !0 }) : Jt(ae);
      E.innerHTML = pe.value, E.dataset.highlighted = "yes", zs(E, X, pe.language), E.result = {
        language: pe.language,
        // TODO: remove with version 11.0
        re: pe.relevance,
        relevance: pe.relevance
      }, pe.secondBest && (E.secondBest = {
        language: pe.secondBest.language,
        relevance: pe.secondBest.relevance
      }), Tt("after:highlightElement", { el: E, result: pe, text: ae });
    }
    function Bs(E) {
      $ = Hn($, E);
    }
    const Os = () => {
      Rt(), et("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Ns() {
      Rt(), et("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let Fn = !1;
    function Rt() {
      function E() {
        Rt();
      }
      if (document.readyState === "loading") {
        Fn || window.addEventListener("DOMContentLoaded", E, !1), Fn = !0;
        return;
      }
      document.querySelectorAll($.cssSelector).forEach(en);
    }
    function Ds(E, N) {
      let X = null;
      try {
        X = N(d);
      } catch (ae) {
        if (Ge("Language definition for '{}' could not be registered.".replace("{}", E)), ce)
          Ge(ae);
        else
          throw ae;
        X = z;
      }
      X.name || (X.name = E), S[E] = X, X.rawDefinition = N.bind(null, d), X.aliases && Wn(X.aliases, { languageName: E });
    }
    function qs(E) {
      delete S[E];
      for (const N of Object.keys(R))
        R[N] === E && delete R[N];
    }
    function Hs() {
      return Object.keys(S);
    }
    function He(E) {
      return E = (E || "").toLowerCase(), S[E] || S[R[E]];
    }
    function Wn(E, { languageName: N }) {
      typeof E == "string" && (E = [E]), E.forEach((X) => {
        R[X.toLowerCase()] = N;
      });
    }
    function Zn(E) {
      const N = He(E);
      return N && !N.disableAutodetect;
    }
    function Us(E) {
      E["before:highlightBlock"] && !E["before:highlightElement"] && (E["before:highlightElement"] = (N) => {
        E["before:highlightBlock"](
          Object.assign({ block: N.el }, N)
        );
      }), E["after:highlightBlock"] && !E["after:highlightElement"] && (E["after:highlightElement"] = (N) => {
        E["after:highlightBlock"](
          Object.assign({ block: N.el }, N)
        );
      });
    }
    function js(E) {
      Us(E), j.push(E);
    }
    function Fs(E) {
      const N = j.indexOf(E);
      N !== -1 && j.splice(N, 1);
    }
    function Tt(E, N) {
      const X = E;
      j.forEach(function(ae) {
        ae[X] && ae[X](N);
      });
    }
    function Ws(E) {
      return et("10.7.0", "highlightBlock will be removed entirely in v12.0"), et("10.7.0", "Please use highlightElement now."), en(E);
    }
    Object.assign(d, {
      highlight: he,
      highlightAuto: Jt,
      highlightAll: Rt,
      highlightElement: en,
      // TODO: Remove with v12 API
      highlightBlock: Ws,
      configure: Bs,
      initHighlighting: Os,
      initHighlightingOnLoad: Ns,
      registerLanguage: Ds,
      unregisterLanguage: qs,
      listLanguages: Hs,
      getLanguage: He,
      registerAliases: Wn,
      autoDetection: Zn,
      inherit: Hn,
      addPlugin: js,
      removePlugin: Fs
    }), d.debugMode = function() {
      ce = !1;
    }, d.safeMode = function() {
      ce = !0;
    }, d.versionString = $s, d.regex = {
      concat: m,
      lookahead: f,
      either: k,
      optional: g,
      anyNumberOfTimes: p
    };
    for (const E in Et)
      typeof Et[E] == "object" && t(Et[E]);
    return Object.assign(d, Et), d;
  }, tt = jn({});
  return tt.newInstance = () => jn({}), sn = tt, tt.HighlightJS = tt, tt.default = tt, sn;
}
var ei = /* @__PURE__ */ Js();
const oe = /* @__PURE__ */ vr(ei), K = /* @__PURE__ */ new Map(), ti = "https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md", Te = {
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
const Er = /* @__PURE__ */ new Set(["magic", "undefined"]);
let We = null;
const er = /* @__PURE__ */ new Map(), ni = 300 * 1e3;
async function Ar(t = ti) {
  if (t)
    return We || (We = (async () => {
      try {
        const e = await fetch(t);
        if (!e.ok) return;
        const i = (await e.text()).split(/\r?\n/);
        let n = -1;
        for (let c = 0; c < i.length; c++)
          if (/\|\s*Language\s*\|/i.test(i[c])) {
            n = c;
            break;
          }
        if (n === -1) return;
        const s = i[n].replace(/^\||\|$/g, "").split("|").map((c) => c.trim().toLowerCase());
        let a = s.findIndex((c) => /alias|aliases|equivalent|alt|alternates?/i.test(c));
        a === -1 && (a = 1);
        let o = s.findIndex((c) => /file|filename|module|module name|module-name|short|slug/i.test(c));
        if (o === -1) {
          const c = s.findIndex((u) => /language/i.test(u));
          o = c !== -1 ? c : 0;
        }
        let l = [];
        for (let c = n + 1; c < i.length; c++) {
          const u = i[c].trim();
          if (!u || !u.startsWith("|")) break;
          const h = u.replace(/^\||\|$/g, "").split("|").map((w) => w.trim());
          if (h.every((w) => /^-+$/.test(w))) continue;
          const f = h;
          if (!f.length) continue;
          const g = (f[o] || f[0] || "").toString().trim().toLowerCase();
          if (!g || /^-+$/.test(g)) continue;
          K.set(g, g);
          const m = f[a] || "";
          if (m) {
            const w = String(m).split(",").map((k) => k.replace(/`/g, "").trim()).filter(Boolean);
            if (w.length) {
              const v = w[0].toLowerCase().replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
              v && /[a-z0-9]/i.test(v) && (K.set(v, v), l.push(v));
            }
          }
        }
        try {
          const c = [];
          for (const u of l) {
            const h = String(u || "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
            h && /[a-z0-9]/i.test(h) ? c.push(h) : K.delete(u);
          }
          l = c;
        } catch (c) {
          console.warn("[codeblocksManager] cleanup aliases failed", c);
        }
        try {
          let c = 0;
          for (const u of Array.from(K.keys())) {
            if (!u || /^-+$/.test(u) || !/[a-z0-9]/i.test(u)) {
              K.delete(u), c++;
              continue;
            }
            if (/^[:]+/.test(u)) {
              const h = u.replace(/^[:]+/, "");
              if (h && /[a-z0-9]/i.test(h)) {
                const f = K.get(u);
                K.delete(u), K.set(h, f);
              } else
                K.delete(u), c++;
            }
          }
          for (const [u, h] of Array.from(K.entries()))
            (!h || /^-+$/.test(h) || !/[a-z0-9]/i.test(h)) && (K.delete(u), c++);
          try {
            const u = ":---------------------";
            K.has(u) && (K.delete(u), c++);
          } catch (u) {
            console.warn("[codeblocksManager] remove sep key failed", u);
          }
          try {
            const u = Array.from(K.keys()).sort();
          } catch (u) {
            console.warn("[codeblocksManager] compute supported keys failed", u);
          }
        } catch (c) {
          console.warn("[codeblocksManager] ignored error", c);
        }
      } catch (e) {
        console.warn("[codeblocksManager] loadSupportedLanguages failed", e);
      }
    })(), We);
}
const an = /* @__PURE__ */ new Set();
async function yt(t, e) {
  if (We || (async () => {
    try {
      await Ar();
    } catch (n) {
      console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed", n);
    }
  })(), We)
    try {
      await We;
    } catch {
    }
  if (t = t == null ? "" : String(t), t = t.trim(), !t) return !1;
  const r = t.toLowerCase();
  if (Er.has(r)) return !1;
  if (K.size && !K.has(r)) {
    const n = Te;
    if (!n[r] && !n[t])
      return !1;
  }
  if (an.has(t)) return !0;
  const i = Te;
  try {
    const n = (e || t || "").toString().replace(/\.js$/i, "").trim(), s = (i[t] || t || "").toString(), a = (i[n] || n || "").toString();
    let o = Array.from(new Set([
      s,
      a,
      n,
      t,
      i[n],
      i[t]
    ].filter(Boolean))).map((u) => String(u).toLowerCase()).filter((u) => u && u !== "undefined");
    K.size && (o = o.filter((u) => {
      if (K.has(u)) return !0;
      const h = Te[u];
      return !!(h && K.has(h));
    }));
    let l = null, c = null;
    for (const u of o)
      try {
        const h = Date.now(), f = er.get(u);
        if (f) {
          if (f.ok === !1 && h - (f.ts || 0) < ni)
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
          er.set(u, p), p.promise = (async () => {
            try {
              try {
                return await import(
                  /* @vite-ignore */
                  `highlight.js/lib/languages/${u}.js`
                );
              } catch {
                try {
                  const m = `https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${u}.js`;
                  return await new Function("u", "return import(u)")(m);
                } catch {
                  try {
                    const w = `https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${u}.js`;
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
            const g = K.size && K.get(t) || u || t;
            return oe.registerLanguage(g, p), an.add(g), g !== t && (oe.registerLanguage(t, p), an.add(t)), !0;
          } catch (g) {
            c = g;
          }
        }
      } catch (h) {
        c = h;
      }
    if (c)
      throw c;
    return !1;
  } catch {
    return !1;
  }
}
let Mt = null;
function ri(t = document) {
  We || (async () => {
    try {
      await Ar();
    } catch (s) {
      console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed", s);
    }
  })();
  const e = Te, i = Mt || (typeof IntersectionObserver > "u" ? null : (Mt = new IntersectionObserver((s, a) => {
    s.forEach((o) => {
      if (!o.isIntersecting) return;
      const l = o.target;
      try {
        a.unobserve(l);
      } catch (c) {
        console.warn("[codeblocksManager] observer unobserve failed", c);
      }
      (async () => {
        try {
          const c = l.getAttribute && l.getAttribute("class") || l.className || "", u = c.match(/language-([a-zA-Z0-9_+-]+)/) || c.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (u && u[1]) {
            const h = (u[1] || "").toLowerCase(), f = e[h] || h, p = K.size && (K.get(f) || K.get(String(f).toLowerCase())) || f;
            try {
              await yt(p);
            } catch (g) {
              console.warn("[codeblocksManager] registerLanguage failed", g);
            }
            try {
              oe.highlightElement(l);
            } catch (g) {
              console.warn("[codeblocksManager] hljs.highlightElement failed", g);
            }
          } else
            try {
              const h = l.textContent || "";
              try {
                if (oe && typeof oe.getLanguage == "function" && oe.getLanguage("plaintext")) {
                  const f = oe.highlight(h, { language: "plaintext" });
                  f && f.value && (l.innerHTML = f.value);
                }
              } catch {
                try {
                  oe.highlightElement(l);
                } catch (p) {
                  console.warn("[codeblocksManager] fallback highlightElement failed", p);
                }
              }
            } catch (h) {
              console.warn("[codeblocksManager] auto-detect plaintext failed", h);
            }
        } catch (c) {
          console.warn("[codeblocksManager] observer entry processing failed", c);
        }
      })();
    });
  }, { root: null, rootMargin: "300px", threshold: 0.1 }), Mt)), n = t && t.querySelectorAll ? t.querySelectorAll("pre code") : [];
  if (!i) {
    n.forEach(async (s) => {
      try {
        const a = s.getAttribute && s.getAttribute("class") || s.className || "", o = a.match(/language-([a-zA-Z0-9_+-]+)/) || a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (o && o[1]) {
          const l = (o[1] || "").toLowerCase(), c = e[l] || l, u = K.size && (K.get(c) || K.get(String(c).toLowerCase())) || c;
          try {
            await yt(u);
          } catch (h) {
            console.warn("[codeblocksManager] registerLanguage failed (no observer)", h);
          }
        }
        try {
          oe.highlightElement(s);
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
function sl(t, { useCdn: e = !0 } = {}) {
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
let ln = "light";
function si(t, e = {}) {
  if (document.querySelector(`link[href="${t}"]`)) return;
  const r = document.createElement("link");
  r.rel = "stylesheet", r.href = t, Object.entries(e).forEach(([i, n]) => r.setAttribute(i, n)), document.head.appendChild(r);
}
async function ii(t = "none", e = "/") {
  if (!t || t === "none") return;
  const r = [e + "bulma.css", "/bulma.css"], i = Array.from(new Set(r));
  if (t === "local") {
    if (document.querySelector("style[data-bulma-override]")) return;
    for (const n of i)
      try {
        const s = await fetch(n, { method: "GET" });
        if (s.ok) {
          const a = await s.text(), o = document.createElement("style");
          o.setAttribute("data-bulma-override", n), o.appendChild(document.createTextNode(`
/* bulma override: ${n} */
` + a)), document.head.appendChild(o);
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
    si(s, { "data-bulmaswatch-theme": n });
  } catch (n) {
    console.warn("[bulmaManager] ensureBulma failed", n);
  }
}
function ai(t) {
  ln = t === "dark" ? "dark" : "light", document.documentElement.setAttribute("data-theme", ln), ln === "dark" ? document.body.classList.add("is-dark") : document.body.classList.remove("is-dark");
}
function il(t) {
  const e = document.documentElement;
  for (const [r, i] of Object.entries(t || {}))
    try {
      e.style.setProperty(`--${r}`, i);
    } catch (n) {
      console.warn("[bulmaManager] setThemeVars failed for", r, n);
    }
}
const Rr = {
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
}, st = JSON.parse(JSON.stringify(Rr));
let Ot = "en";
if (typeof navigator < "u") {
  const t = navigator.language || navigator.languages && navigator.languages[0] || "en";
  Ot = String(t).split("-")[0].toLowerCase();
}
Rr[Ot] || (Ot = "en");
let Ze = Ot;
function ct(t, e = {}) {
  const r = st[Ze] || st.en;
  let i = r && r[t] ? r[t] : st.en[t] || "";
  for (const n of Object.keys(e))
    i = i.replace(new RegExp(`{${n}}`, "g"), String(e[n]));
  return i;
}
async function Tr(t, e) {
  if (!t) return;
  let r = t;
  try {
    /^https?:\/\//.test(t) || (r = new URL(t, location.origin + e).toString());
    const i = await fetch(r);
    if (!i.ok) return;
    const n = await i.json();
    for (const s of Object.keys(n || {}))
      st[s] = Object.assign({}, st[s] || {}, n[s]);
  } catch {
  }
}
function Cr(t) {
  const e = String(t).split("-")[0].toLowerCase();
  Ze = st[e] ? e : "en";
}
const li = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get currentLang() {
    return Ze;
  },
  loadL10nFile: Tr,
  setLang: Cr,
  t: ct
}, Symbol.toStringTag, { value: "Module" })), oi = `import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
function _r(t, e = "worker") {
  let r = null;
  function i() {
    if (!r)
      try {
        const o = t();
        r = o || null, o && o.addEventListener("error", () => {
          try {
            r === o && (r = null, o.terminate && o.terminate());
          } catch (l) {
            console.warn("[" + e + "] worker termination failed", l);
          }
        });
      } catch (o) {
        r = null, console.warn("[" + e + "] worker init failed", o);
      }
    return r;
  }
  function n() {
    try {
      r && (r.terminate && r.terminate(), r = null);
    } catch (o) {
      console.warn("[" + e + "] worker termination failed", o);
    }
  }
  function s(o, l = 1e3) {
    return new Promise((c, u) => {
      const h = i();
      if (!h) return u(new Error("worker unavailable"));
      const f = String(Math.random());
      o.id = f;
      let p = null;
      const g = () => {
        p && clearTimeout(p), h.removeEventListener("message", m), h.removeEventListener("error", w);
      }, m = (k) => {
        const v = k.data || {};
        v.id === f && (g(), v.error ? u(new Error(v.error)) : c(v.result));
      }, w = (k) => {
        g(), console.warn("[" + e + "] worker error event", k);
        try {
          r === h && (r = null, h.terminate && h.terminate());
        } catch (v) {
          console.warn("[" + e + "] worker termination failed", v);
        }
        u(new Error(k && k.message || "worker error"));
      };
      p = setTimeout(() => {
        g(), console.warn("[" + e + "] worker timed out");
        try {
          r === h && (r = null, h.terminate && h.terminate());
        } catch (k) {
          console.warn("[" + e + "] worker termination on timeout failed", k);
        }
        u(new Error("worker timeout"));
      }, l), h.addEventListener("message", m), h.addEventListener("error", w);
      try {
        h.postMessage(o);
      } catch (k) {
        g(), u(k);
      }
    });
  }
  return { get: i, send: s, terminate: n };
}
function ci(t) {
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
const Oe = /* @__PURE__ */ new Set();
function En(t) {
  ui(), Oe.clear();
  for (const e of Ce)
    e && Oe.add(e);
  tr(Q), tr(F), En._refreshed = !0;
}
function tr(t) {
  if (!(!t || typeof t.values != "function"))
    for (const e of t.values())
      e && Oe.add(e);
}
function nr(t) {
  if (!t || typeof t.set != "function") return;
  const e = t.set;
  t.set = function(r, i) {
    return i && Oe.add(i), e.call(this, r, i);
  };
}
let rr = !1;
function ui() {
  rr || (nr(Q), nr(F), rr = !0);
}
function Lr(t) {
  return !t || typeof t != "string" ? !1 : /^(https?:)?\/\//.test(t) || t.startsWith("mailto:") || t.startsWith("tel:");
}
function me(t) {
  return String(t || "").replace(/^[.\/]+/, "");
}
function kt(t) {
  return String(t || "").replace(/\/+$/, "");
}
function Qt(t) {
  return kt(t) + "/";
}
function hi(t) {
  try {
    if (!t || typeof document > "u" || !document.head || t.startsWith("data:") || document.head.querySelector(`link[rel="preload"][as="image"][href="${t}"]`)) return;
    const r = document.createElement("link");
    r.rel = "preload", r.as = "image", r.href = t, document.head.appendChild(r);
  } catch (e) {
    console.warn("[helpers] preloadImage failed", e);
  }
}
function $t(t, e = 0, r = !1) {
  try {
    if (typeof window > "u" || !t || !t.querySelectorAll) return;
    const i = Array.from(t.querySelectorAll("img"));
    if (!i.length) return;
    const n = t, s = n && n.getBoundingClientRect ? n.getBoundingClientRect() : null, a = 0, o = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, l = s ? Math.max(a, s.top) : a, u = (s ? Math.min(o, s.bottom) : o) + Number(e || 0);
    let h = 0;
    n && (h = n.clientHeight || (s ? s.height : 0)), h || (h = o - a);
    let f = 0.6;
    try {
      const w = n && window.getComputedStyle ? window.getComputedStyle(n) : null, k = w && w.getPropertyValue("--nimbi-image-max-height-ratio"), v = k ? parseFloat(k) : NaN;
      !Number.isNaN(v) && v > 0 && v <= 1 && (f = v);
    } catch (w) {
      console.warn("[helpers] read CSS ratio failed", w);
    }
    const p = Math.max(200, Math.floor(h * f));
    let g = !1, m = null;
    if (i.forEach((w) => {
      try {
        const k = w.getAttribute ? w.getAttribute("loading") : void 0;
        k !== "eager" && w.setAttribute && w.setAttribute("loading", "lazy");
        const v = w.getBoundingClientRect ? w.getBoundingClientRect() : null, D = w.src || w.getAttribute && w.getAttribute("src"), L = v && v.height > 1 ? v.height : p, B = v ? v.top : 0, I = B + L, ee = !!(v && L > 0 && B <= u && I >= l);
        ee && (w.setAttribute ? (w.setAttribute("loading", "eager"), w.setAttribute("fetchpriority", "high"), w.setAttribute("data-eager-by-nimbi", "1")) : (w.loading = "eager", w.fetchPriority = "high"), hi(D), g = !0), !m && v && v.top <= u && (m = { img: w, src: D, rect: v, beforeLoading: k }), r && console.log("[helpers] setEagerForAboveFoldImages:", {
          src: D,
          rect: v,
          marginPx: e,
          visibleTop: l,
          visibleBottom: u,
          beforeLoading: k,
          isAboveFold: ee,
          effectiveHeight: L,
          maxImageHeight: p
        });
      } catch (k) {
        console.warn("[helpers] setEagerForAboveFoldImages per-image failed", k);
      }
    }), !g && m) {
      const { img: w, src: k, rect: v, beforeLoading: D } = m;
      try {
        w.setAttribute ? (w.setAttribute("loading", "eager"), w.setAttribute("fetchpriority", "high"), w.setAttribute("data-eager-by-nimbi", "1")) : (w.loading = "eager", w.fetchPriority = "high"), r && console.log("[helpers] setEagerForAboveFoldImages (fallback first visible):", {
          src: k,
          rect: v,
          marginPx: e,
          visibleTop: l,
          visibleBottom: u,
          beforeLoading: D,
          fallback: !0
        });
      } catch (L) {
        console.warn("[helpers] setEagerForAboveFoldImages fallback failed", L);
      }
    }
  } catch (i) {
    console.warn("[helpers] setEagerForAboveFoldImages failed", i);
  }
}
function Nt(t) {
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
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = Nt);
} catch (t) {
  console.warn("[helpers] global attach failed", t);
}
const Q = /* @__PURE__ */ new Map();
let _e = [];
function Mr(t) {
  _e = Array.isArray(t) ? t.slice() : [];
}
function pi() {
  return _e;
}
const $r = _r(() => ci(oi), "slugManager");
function An() {
  return $r.get();
}
function Pr(t) {
  return $r.send(t);
}
async function di(t, e = 1, r = void 0) {
  if (!An()) return Ut(t, e, r);
  try {
    return await Pr({ type: "buildSearchIndex", contentBase: t, indexDepth: e, noIndexing: r });
  } catch (n) {
    try {
      return await Ut(t, e, r);
    } catch (s) {
      throw console.warn("[slugManager] buildSearchIndex fallback failed", s), n;
    }
  }
}
async function fi(t, e, r) {
  return An() ? Pr({ type: "crawlForSlug", slug: t, base: e, maxQueue: r }) : Rn(t, e, r);
}
function je(t, e) {
  if (t)
    if (_e && _e.length) {
      const i = e.split("/")[0], n = _e.includes(i);
      let s = Q.get(t);
      (!s || typeof s == "string") && (s = { default: typeof s == "string" ? s : void 0, langs: {} }), n ? s.langs[i] = e : s.default = e, Q.set(t, s);
    } else
      Q.set(t, e);
}
const Gt = /* @__PURE__ */ new Set();
function gi(t) {
  typeof t == "function" && Gt.add(t);
}
function mi(t) {
  typeof t == "function" && Gt.delete(t);
}
const F = /* @__PURE__ */ new Map();
let dn = {}, Ce = [], Dt = "_404.md", rt = "_home.md";
function fn(t) {
  t != null && (Dt = String(t || ""));
}
function gn(t) {
  t != null && (rt = String(t || ""));
}
function wi(t) {
  dn = t || {};
}
const pt = /* @__PURE__ */ new Map(), qt = /* @__PURE__ */ new Set();
function bi() {
  pt.clear(), qt.clear();
}
function yi(t) {
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
function Ht(t) {
  Q.clear(), F.clear(), Ce = [], _e = _e || [];
  const e = Object.keys(dn || {});
  if (!e.length) return;
  let r = "";
  try {
    if (t) {
      try {
        /^[a-z][a-z0-9+.-]*:/i.test(String(t)) ? r = new URL(String(t)).pathname : r = String(t || "");
      } catch (i) {
        r = String(t || ""), console.warn("[slugManager] parse contentBase failed", i);
      }
      r = Qt(r);
    }
  } catch (i) {
    r = "", console.warn("[slugManager] setContentBase prefix derivation failed", i);
  }
  r || (r = yi(e));
  for (const i of e) {
    let n = i;
    r && i.startsWith(r) ? n = me(i.slice(r.length)) : n = me(i), Ce.push(n);
    try {
      En();
    } catch (a) {
      console.warn("[slugManager] refreshIndexPaths failed", a);
    }
    const s = dn[i];
    if (typeof s == "string") {
      const a = (s || "").match(/^#\s+(.+)$/m);
      if (a && a[1]) {
        const o = ie(a[1].trim());
        if (o)
          try {
            if (_e && _e.length) {
              const c = n.split("/")[0], u = _e.includes(c);
              let h = Q.get(o);
              (!h || typeof h == "string") && (h = { default: typeof h == "string" ? h : void 0, langs: {} }), u ? h.langs[c] = n : h.default = n, Q.set(o, h);
            } else
              Q.set(o, n);
            F.set(n, o);
          } catch (l) {
            console.warn("[slugManager] set slug mapping failed", l);
          }
      }
    }
  }
}
try {
  Ht();
} catch (t) {
  console.warn("[slugManager] initial setContentBase failed", t);
}
function ie(t) {
  let e = String(t || "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return e = e.replace(/(?:-?)(?:md|html)$/, ""), e;
}
function xt(t) {
  if (!t || !Q.has(t)) return null;
  const e = Q.get(t);
  if (!e) return null;
  if (typeof e == "string") return e;
  if (_e && _e.length && Ze && e.langs && e.langs[Ze])
    return e.langs[Ze];
  if (e.default) return e.default;
  if (e.langs) {
    const r = Object.keys(e.langs);
    if (r.length) return e.langs[r[0]];
  }
  return null;
}
const dt = /* @__PURE__ */ new Map();
function ki() {
  dt.clear();
}
let xe = async function(t, e) {
  if (!t) throw new Error("path required");
  try {
    const s = (String(t || "").match(/([^\/]+)\.md(?:$|[?#])/) || [])[1];
    if (s && Q.has(s)) {
      const a = xt(s) || Q.get(s);
      a && a !== t && (t = a);
    }
  } catch (s) {
    console.warn("[slugManager] slug mapping normalization failed", s);
  }
  const r = e == null ? "" : kt(String(e));
  let i = "";
  try {
    r ? /^[a-z][a-z0-9+.-]*:/i.test(r) ? i = r.replace(/\/$/, "") + "/" + t.replace(/^\//, "") : i = (r.startsWith("/") ? "" : "/") + r.replace(/\/$/, "") + "/" + t.replace(/^\//, "") : i = "/" + t.replace(/^\//, "");
  } catch {
    i = "/" + t.replace(/^\//, "");
  }
  if (dt.has(i))
    return dt.get(i);
  const n = (async () => {
    const s = await fetch(i);
    if (!s || typeof s.ok != "boolean" || !s.ok) {
      if (s && s.status === 404)
        try {
          const h = `${r}/${Dt}`, f = await globalThis.fetch(h);
          if (f && typeof f.ok == "boolean" && f.ok)
            return { raw: await f.text(), status: 404 };
        } catch (h) {
          console.warn("[slugManager] fetching fallback 404 failed", h);
        }
      let u = "";
      try {
        s && typeof s.clone == "function" ? u = await s.clone().text() : s && typeof s.text == "function" ? u = await s.text() : u = "";
      } catch (h) {
        u = "", console.warn("[slugManager] reading error body failed", h);
      }
      throw console.error("fetchMarkdown failed:", { url: i, status: s ? s.status : void 0, statusText: s ? s.statusText : void 0, body: u.slice(0, 200) }), new Error("failed to fetch md");
    }
    const a = await s.text(), o = a.trim().slice(0, 16).toLowerCase(), l = o.startsWith("<!doctype") || o.startsWith("<html"), c = l || String(t || "").toLowerCase().endsWith(".html");
    if (l && String(t || "").toLowerCase().endsWith(".md")) {
      try {
        const u = `${r}/${Dt}`, h = await globalThis.fetch(u);
        if (h.ok)
          return { raw: await h.text(), status: 404 };
      } catch (u) {
        console.warn("[slugManager] fetching fallback 404 failed", u);
      }
      throw console.error("fetchMarkdown: server returned HTML for .md request", i), new Error("failed to fetch md");
    }
    return c ? { raw: a, isHtml: !0 } : { raw: a };
  })();
  return dt.set(i, n), n;
};
function xi(t) {
  typeof t == "function" && (xe = t);
}
const It = /* @__PURE__ */ new Map();
let Ye = [], at = null;
async function Ut(t, e = 1, r = void 0) {
  if (Ye && Ye.length && e === 1) return Ye;
  if (at) return at;
  at = (async () => {
    const i = Array.isArray(r) ? Array.from(new Set((r || []).map((l) => me(String(l || ""))))) : null, n = (l) => {
      if (!i || !i.length) return !1;
      for (const c of i)
        if (c && (l === c || l.startsWith(c + "/")))
          return !0;
      return !1;
    };
    let s = [];
    if (Ce && Ce.length && (s = Array.from(Ce)), !s.length)
      for (const l of Q.values())
        l && s.push(l);
    try {
      const l = await Or(t);
      l && l.length && (s = s.concat(l));
    } catch (l) {
      console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed", l);
    }
    try {
      const l = new Set(s), c = [...s];
      for (l.size; c.length && l.size <= St; ) {
        const u = c.shift();
        try {
          const h = await xe(u, t);
          if (h && h.raw) {
            let f = h.raw;
            const p = [], g = /\[[^\]]+\]\(([^)]+)\)/g;
            let m;
            for (; m = g.exec(f); )
              p.push(m[1]);
            const w = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
            for (; m = w.exec(f); )
              p.push(m[1]);
            for (let k of p)
              /^[a-z][a-z0-9+.-]*:/i.test(k) || (k = me(k), /\.(md|html?)(?:$|[?#])/i.test(k) && (k = k.split(/[?#]/)[0], !n(k) && (l.has(k) || (l.add(k), c.push(k), s.push(k)))));
          }
        } catch (h) {
          console.warn("[slugManager] discovery fetch failed for", u, h);
        }
      }
    } catch (l) {
      console.warn("[slugManager] discovery loop failed", l);
    }
    const a = /* @__PURE__ */ new Set();
    s = s.filter((l) => !l || a.has(l) || n(l) ? !1 : (a.add(l), !0));
    const o = [];
    for (const l of s)
      if (/\.(?:md|html?)(?:$|[?#])/i.test(l))
        try {
          const c = await xe(l, t);
          if (c && c.raw) {
            let u = "", h = "";
            if (c.isHtml)
              try {
                const g = new DOMParser().parseFromString(c.raw, "text/html"), m = g.querySelector("title") || g.querySelector("h1");
                m && m.textContent && (u = m.textContent.trim());
                const w = g.querySelector("p");
                if (w && w.textContent && (h = w.textContent.trim()), e === 2)
                  try {
                    const k = g.querySelector("h1"), v = k && k.textContent ? k.textContent.trim() : u || "", D = (() => {
                      try {
                        if (F.has(l)) return F.get(l);
                      } catch {
                      }
                      return ie(u || l);
                    })(), L = Array.from(g.querySelectorAll("h2"));
                    for (const B of L)
                      try {
                        const I = (B.textContent || "").trim();
                        if (!I) continue;
                        const ee = B.id ? B.id : ie(I), ne = D ? `${D}::${ee}` : `${ie(l)}::${ee}`;
                        let Y = "", te = B.nextElementSibling;
                        for (; te && te.tagName && te.tagName.toLowerCase() === "script"; ) te = te.nextElementSibling;
                        te && te.textContent && (Y = String(te.textContent).trim()), o.push({ slug: ne, title: I, excerpt: Y, path: l, parentTitle: v });
                      } catch (I) {
                        console.warn("[slugManager] indexing H2 failed", I);
                      }
                  } catch (k) {
                    console.warn("[slugManager] collect H2s failed", k);
                  }
              } catch (p) {
                console.warn("[slugManager] parsing HTML for index failed", p);
              }
            else {
              const p = c.raw, g = p.match(/^#\s+(.+)$/m);
              u = g ? g[1].trim() : "";
              const m = p.split(/\r?\n\s*\r?\n/);
              if (m.length > 1)
                for (let w = 1; w < m.length; w++) {
                  const k = m[w].trim();
                  if (k && !/^#/.test(k)) {
                    h = k.replace(/\r?\n/g, " ");
                    break;
                  }
                }
              if (e === 2)
                try {
                  const w = (p.match(/^#\s+(.+)$/m) || [])[1], k = w ? w.trim() : "", v = (function() {
                    try {
                      if (F.has(l)) return F.get(l);
                    } catch {
                    }
                    return ie(u || l);
                  })(), D = /^##\s+(.+)$/gm;
                  let L;
                  for (; L = D.exec(p); )
                    try {
                      const B = (L[1] || "").trim();
                      if (!B) continue;
                      const I = ie(B), ee = v ? `${v}::${I}` : `${ie(l)}::${I}`, Y = p.slice(D.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), te = Y && Y[1] ? String(Y[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                      o.push({ slug: ee, title: B, excerpt: te, path: l, parentTitle: k });
                    } catch (B) {
                      console.warn("[slugManager] indexing markdown H2 failed", B);
                    }
                } catch (w) {
                  console.warn("[slugManager] collect markdown H2s failed", w);
                }
            }
            let f = "";
            try {
              F.has(l) && (f = F.get(l));
            } catch (p) {
              console.warn("[slugManager] mdToSlug access failed", p);
            }
            f || (f = ie(u || l)), o.push({ slug: f, title: u, excerpt: h, path: l });
          }
        } catch (c) {
          console.warn("[slugManager] buildSearchIndex: entry fetch failed", c);
        }
    return Ye = o, Ye;
  })();
  try {
    await at;
  } catch (i) {
    console.warn("[slugManager] awaiting _indexPromise failed", i);
  }
  return at = null, Ye;
}
const Ir = 1e3;
let St = Ir;
function Si(t) {
  typeof t == "number" && t >= 0 && (St = t);
}
const zr = new DOMParser(), Br = "a[href]";
let Rn = async function(t, e, r = St) {
  if (It.has(t)) return It.get(t);
  let i = null;
  const n = /* @__PURE__ */ new Set(), s = [""];
  for (; s.length && !i && !(s.length > r); ) {
    const a = s.shift();
    if (n.has(a)) continue;
    n.add(a);
    let o = e;
    o.endsWith("/") || (o += "/"), o += a;
    try {
      const l = await globalThis.fetch(o);
      if (!l.ok) continue;
      const c = await l.text(), h = zr.parseFromString(c, "text/html").querySelectorAll(Br);
      for (const f of h)
        try {
          let p = f.getAttribute("href") || "";
          if (!p) continue;
          if (p.endsWith("/")) {
            const g = a + p;
            n.has(g) || s.push(g);
            continue;
          }
          if (p.toLowerCase().endsWith(".md")) {
            const g = me(a + p);
            try {
              if (F.has(g))
                continue;
              for (const m of Q.values())
                ;
            } catch (m) {
              console.warn("[slugManager] slug map access failed", m);
            }
            try {
              const m = await xe(g, e);
              if (m && m.raw) {
                const w = (m.raw || "").match(/^#\s+(.+)$/m);
                if (w && w[1] && ie(w[1].trim()) === t) {
                  i = g;
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
  return It.set(t, i), i;
};
async function Or(t, e = St) {
  const r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), n = [""];
  for (; n.length && !(n.length > e); ) {
    const s = n.shift();
    if (i.has(s)) continue;
    i.add(s);
    let a = t;
    a.endsWith("/") || (a += "/"), a += s;
    try {
      const o = await globalThis.fetch(a);
      if (!o.ok) continue;
      const l = await o.text(), u = zr.parseFromString(l, "text/html").querySelectorAll(Br);
      for (const h of u)
        try {
          let f = h.getAttribute("href") || "";
          if (!f) continue;
          if (f.endsWith("/")) {
            const g = s + f;
            i.has(g) || n.push(g);
            continue;
          }
          const p = (s + f).replace(/^\/+/, "");
          /\.(md|html?)$/i.test(p) && r.add(p);
        } catch (f) {
          console.warn("[slugManager] crawlAllMarkdown: link iteration failed", f);
        }
    } catch (o) {
      console.warn("[slugManager] crawlAllMarkdown: directory fetch failed", o);
    }
  }
  return Array.from(r);
}
async function Nr(t, e, r) {
  if (t && typeof t == "string" && (t = me(t), t = kt(t)), Q.has(t))
    return xt(t) || Q.get(t);
  for (const n of Gt)
    try {
      const s = await n(t, e);
      if (s)
        return je(t, s), F.set(s, t), s;
    } catch (s) {
      console.warn("[slugManager] slug resolver failed", s);
    }
  if (Ce && Ce.length) {
    if (pt.has(t)) {
      const n = pt.get(t);
      return Q.set(t, n), F.set(n, t), n;
    }
    for (const n of Ce)
      if (!qt.has(n))
        try {
          const s = await xe(n, e);
          if (s && s.raw) {
            const a = (s.raw || "").match(/^#\s+(.+)$/m);
            if (a && a[1]) {
              const o = ie(a[1].trim());
              if (qt.add(n), o && pt.set(o, n), o === t)
                return je(t, n), F.set(n, t), n;
            }
          }
        } catch (s) {
          console.warn("[slugManager] manifest title fetch failed", s);
        }
  }
  try {
    const n = await Ut(e);
    if (n && n.length) {
      const s = n.find((a) => a.slug === t);
      if (s)
        return je(t, s.path), F.set(s.path, t), s.path;
    }
  } catch (n) {
    console.warn("[slugManager] buildSearchIndex lookup failed", n);
  }
  try {
    const n = await Rn(t, e, r);
    if (n)
      return je(t, n), F.set(n, t), n;
  } catch (n) {
    console.warn("[slugManager] crawlForSlug lookup failed", n);
  }
  const i = [`${t}.html`, `${t}.md`];
  for (const n of i)
    try {
      const s = await xe(n, e);
      if (s && s.raw)
        return je(t, n), F.set(n, t), n;
    } catch (s) {
      console.warn("[slugManager] candidate fetch failed", s);
    }
  if (Ce && Ce.length)
    for (const n of Ce)
      try {
        const s = n.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
        if (ie(s) === t)
          return je(t, n), F.set(n, t), n;
      } catch (s) {
        console.warn("[slugManager] build-time filename match failed", s);
      }
  try {
    const n = [];
    rt && typeof rt == "string" && rt.trim() && n.push(rt), n.includes("_home.md") || n.push("_home.md");
    for (const s of n)
      try {
        const a = await xe(s, e);
        if (a && a.raw) {
          const o = (a.raw || "").match(/^#\s+(.+)$/m);
          if (o && o[1] && ie(o[1].trim()) === t)
            return je(t, s), F.set(s, t), s;
        }
      } catch {
      }
  } catch (n) {
    console.warn("[slugManager] home page fetch failed", n);
  }
  return null;
}
const zt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CRAWL_MAX_QUEUE: Ir,
  _setAllMd: wi,
  _storeSlugMapping: je,
  addSlugResolver: gi,
  get allMarkdownPaths() {
    return Ce;
  },
  get availableLanguages() {
    return _e;
  },
  buildSearchIndex: Ut,
  buildSearchIndexWorker: di,
  clearFetchCache: ki,
  clearListCaches: bi,
  crawlAllMarkdown: Or,
  crawlCache: It,
  crawlForSlug: Rn,
  crawlForSlugWorker: fi,
  get defaultCrawlMaxQueue() {
    return St;
  },
  ensureSlug: Nr,
  fetchCache: dt,
  get fetchMarkdown() {
    return xe;
  },
  getLanguages: pi,
  get homePage() {
    return rt;
  },
  initSlugWorker: An,
  listPathsFetched: qt,
  listSlugCache: pt,
  mdToSlug: F,
  get notFoundPage() {
    return Dt;
  },
  removeSlugResolver: mi,
  resolveSlugPath: xt,
  get searchIndex() {
    return Ye;
  },
  setContentBase: Ht,
  setDefaultCrawlMaxQueue: Si,
  setFetchMarkdown: xi,
  setHomePage: gn,
  setLanguages: Mr,
  setNotFoundPage: fn,
  slugResolvers: Gt,
  slugToMd: Q,
  slugify: ie
}, Symbol.toStringTag, { value: "Module" }));
let Dr = 100;
function sr(t) {
  Dr = t;
}
let ft = 300 * 1e3;
function ir(t) {
  ft = t;
}
const Le = /* @__PURE__ */ new Map();
function vi(t) {
  if (!Le.has(t)) return;
  const e = Le.get(t), r = Date.now();
  if (e.ts + ft < r) {
    Le.delete(t);
    return;
  }
  return Le.delete(t), Le.set(t, e), e.value;
}
function Ei(t, e) {
  if (ar(), ar(), Le.delete(t), Le.set(t, { value: e, ts: Date.now() }), Le.size > Dr) {
    const r = Le.keys().next().value;
    r !== void 0 && Le.delete(r);
  }
}
function ar() {
  if (!ft || ft <= 0) return;
  const t = Date.now();
  for (const [e, r] of Le.entries())
    r.ts + ft < t && Le.delete(e);
}
async function Ai(t, e) {
  const r = new Set(Oe), i = document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");
  for (const n of Array.from(i || [])) {
    const s = n.getAttribute("href") || "";
    if (s)
      try {
        const a = new URL(s, location.href);
        if (a.origin !== location.origin) continue;
        const o = (a.hash || a.pathname).match(/([^#?]+\.md)(?:$|[?#])/) || (a.pathname || "").match(/([^#?]+\.md)(?:$|[?#])/);
        if (o) {
          let c = me(o[1]);
          c && r.add(c);
          continue;
        }
        const l = a.pathname || "";
        if (l) {
          const c = new URL(e), u = Qt(c.pathname);
          if (l.indexOf(u) !== -1) {
            let h = l.startsWith(u) ? l.slice(u.length) : l;
            h = me(h), h && r.add(h);
          }
        }
      } catch (a) {
        console.warn("[router] malformed URL while discovering index candidates", a);
      }
  }
  for (const n of r)
    try {
      if (!n || !String(n).includes(".md")) continue;
      const s = await xe(n, e);
      if (!s || !s.raw) continue;
      const a = (s.raw || "").match(/^#\s+(.+)$/m);
      if (a) {
        const o = (a[1] || "").trim();
        if (o && ie(o) === t)
          return n;
      }
    } catch (s) {
      console.warn("[router] fetchMarkdown during index discovery failed", s);
    }
  return null;
}
function Ri(t) {
  const e = [];
  if (String(t).includes(".md") || String(t).includes(".html"))
    /index\.html$/i.test(t) || e.push(t);
  else
    try {
      const r = decodeURIComponent(String(t || ""));
      if (Q.has(r)) {
        const i = xt(r) || Q.get(r);
        i && (/\.(md|html?)$/i.test(i) ? /index\.html$/i.test(i) || e.push(i) : (e.push(i), e.push(i + ".html")));
      } else {
        if (Oe && Oe.size)
          for (const i of Oe) {
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
async function Ti(t, e) {
  const r = t || "", i = location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : null;
  let n = t || "", s = null;
  if (n && String(n).includes("::")) {
    const g = String(n).split("::", 2);
    n = g[0], s = g[1] || null;
  }
  const o = `${t}|||${typeof li < "u" && Ze ? Ze : ""}`, l = vi(o);
  if (l)
    n = l.resolved, s = l.anchor || s;
  else {
    if (!String(n).includes(".md") && !String(n).includes(".html")) {
      let g = decodeURIComponent(String(n || ""));
      if (g && typeof g == "string" && (g = me(g), g = kt(g)), Q.has(g))
        n = xt(g) || Q.get(g);
      else {
        let m = await Ai(g, e);
        if (m)
          n = m;
        else if (En._refreshed && Oe && Oe.size || typeof e == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(e)) {
          const w = await Nr(g, e);
          w && (n = w);
        }
      }
    }
    Ei(o, { resolved: n, anchor: s });
  }
  !s && i && (s = i);
  const c = Ri(n), u = String(r || "").includes(".md") || String(r || "").includes(".html");
  if (u && c.length === 0 && (String(n).includes(".md") || String(n).includes(".html")) && c.push(n), c.length === 0 && (String(n).includes(".md") || String(n).includes(".html")) && c.push(n), c.length === 1 && /index\.html$/i.test(c[0]) && !u && !Q.has(n) && !Q.has(decodeURIComponent(String(n || ""))) && !String(n || "").includes("/"))
    throw new Error("Unknown slug: index.html fallback prevented");
  let h = null, f = null, p = null;
  for (const g of c)
    if (g)
      try {
        const m = me(g);
        h = await xe(m, e), f = m;
        break;
      } catch (m) {
        p = m;
        try {
          console.warn("[router] candidate fetch failed", { candidate: g, contentBase: e, err: m && m.message || m });
        } catch {
        }
      }
  if (!h) {
    try {
      console.error("[router] fetchPageData: no page data for", { originalRaw: r, resolved: n, pageCandidates: c, contentBase: e, fetchError: p && (p.message || String(p)) || null });
    } catch {
    }
    try {
      if (u && String(r || "").toLowerCase().includes(".html"))
        try {
          const g = new URL(String(r || ""), location.href).toString();
          console.warn("[router] attempting absolute HTML fetch fallback", g);
          const m = await fetch(g);
          if (m && m.ok) {
            const w = await m.text(), k = m && m.headers && typeof m.headers.get == "function" && m.headers.get("content-type") || "", v = (w || "").toLowerCase(), D = k && k.indexOf && k.indexOf("text/html") !== -1 || v.indexOf("<!doctype") !== -1 || v.indexOf("<html") !== -1;
            if (D || console.warn("[router] absolute fetch returned non-HTML", { abs: g, contentType: k, snippet: v.slice(0, 200) }), D)
              try {
                const L = g, B = new URL(".", L).toString();
                try {
                  const ee = typeof DOMParser < "u" ? new DOMParser() : null;
                  if (ee) {
                    const ne = ee.parseFromString(w || "", "text/html"), Y = (M, T) => {
                      try {
                        const x = T.getAttribute(M) || "";
                        if (!x || /^(https?:)?\/\//i.test(x) || x.startsWith("/") || x.startsWith("#")) return;
                        try {
                          const b = new URL(x, L).toString();
                          T.setAttribute(M, b);
                        } catch {
                        }
                      } catch {
                      }
                    }, te = ne.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"), q = [];
                    for (const M of Array.from(te || []))
                      try {
                        const T = M.tagName ? M.tagName.toLowerCase() : "";
                        if (T === "a") continue;
                        if (M.hasAttribute("src")) {
                          const x = M.getAttribute("src");
                          Y("src", M);
                          const b = M.getAttribute("src");
                          x !== b && q.push({ attr: "src", tag: T, before: x, after: b });
                        }
                        if (M.hasAttribute("href") && T === "link") {
                          const x = M.getAttribute("href");
                          Y("href", M);
                          const b = M.getAttribute("href");
                          x !== b && q.push({ attr: "href", tag: T, before: x, after: b });
                        }
                        if (M.hasAttribute("href") && T !== "link") {
                          const x = M.getAttribute("href");
                          Y("href", M);
                          const b = M.getAttribute("href");
                          x !== b && q.push({ attr: "href", tag: T, before: x, after: b });
                        }
                        if (M.hasAttribute("xlink:href")) {
                          const x = M.getAttribute("xlink:href");
                          Y("xlink:href", M);
                          const b = M.getAttribute("xlink:href");
                          x !== b && q.push({ attr: "xlink:href", tag: T, before: x, after: b });
                        }
                        if (M.hasAttribute("poster")) {
                          const x = M.getAttribute("poster");
                          Y("poster", M);
                          const b = M.getAttribute("poster");
                          x !== b && q.push({ attr: "poster", tag: T, before: x, after: b });
                        }
                        if (M.hasAttribute("srcset")) {
                          const A = (M.getAttribute("srcset") || "").split(",").map((y) => y.trim()).filter(Boolean).map((y) => {
                            const [P, G] = y.split(/\s+/, 2);
                            if (!P || /^(https?:)?\/\//i.test(P) || P.startsWith("/")) return y;
                            try {
                              const re = new URL(P, L).toString();
                              return G ? `${re} ${G}` : re;
                            } catch {
                              return y;
                            }
                          }).join(", ");
                          M.setAttribute("srcset", A);
                        }
                      } catch {
                      }
                    const _ = ne.documentElement && ne.documentElement.outerHTML ? ne.documentElement.outerHTML : w;
                    try {
                      q && q.length && console.warn("[router] rewritten asset refs", { abs: g, rewritten: q });
                    } catch {
                    }
                    return { data: { raw: _, isHtml: !0 }, pagePath: String(r || ""), anchor: s };
                  }
                } catch {
                }
                let I = w;
                return /<base\s+[^>]*>/i.test(w) || (/<head[^>]*>/i.test(w) ? I = w.replace(/(<head[^>]*>)/i, `$1<base href="${B}">`) : I = `<base href="${B}">` + w), { data: { raw: I, isHtml: !0 }, pagePath: String(r || ""), anchor: s };
              } catch {
                return { data: { raw: w, isHtml: !0 }, pagePath: String(r || ""), anchor: s };
              }
          }
        } catch (g) {
          console.warn("[router] absolute HTML fetch fallback failed", g);
        }
    } catch {
    }
    throw new Error("no page data");
  }
  return { data: h, pagePath: f, anchor: s };
}
function Tn() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var Je = Tn();
function qr(t) {
  Je = t;
}
var Ke = { exec: () => null };
function V(t, e = "") {
  let r = typeof t == "string" ? t : t.source, i = { replace: (n, s) => {
    let a = typeof s == "string" ? s : s.source;
    return a = a.replace(ve.caret, "$1"), r = r.replace(n, a), i;
  }, getRegex: () => new RegExp(r, e) };
  return i;
}
var Ci = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), ve = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (t) => new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}#`), htmlBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}>`) }, _i = /^(?:[ \t]*(?:\n|$))+/, Li = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Mi = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, vt = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, $i = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Cn = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Hr = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Ur = V(Hr).replace(/bull/g, Cn).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Pi = V(Hr).replace(/bull/g, Cn).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), _n = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Ii = /^[^\n]+/, Ln = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, zi = V(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Ln).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Bi = V(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Cn).getRegex(), Xt = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Mn = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Oi = V("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Mn).replace("tag", Xt).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), jr = V(_n).replace("hr", vt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Xt).getRegex(), Ni = V(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", jr).getRegex(), $n = { blockquote: Ni, code: Li, def: zi, fences: Mi, heading: $i, hr: vt, html: Oi, lheading: Ur, list: Bi, newline: _i, paragraph: jr, table: Ke, text: Ii }, lr = V("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", vt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Xt).getRegex(), Di = { ...$n, lheading: Pi, table: lr, paragraph: V(_n).replace("hr", vt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", lr).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Xt).getRegex() }, qi = { ...$n, html: V(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Mn).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Ke, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: V(_n).replace("hr", vt).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Ur).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Hi = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Ui = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Fr = /^( {2,}|\\)\n(?!\s*$)/, ji = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Yt = /[\p{P}\p{S}]/u, Pn = /[\s\p{P}\p{S}]/u, Wr = /[^\s\p{P}\p{S}]/u, Fi = V(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Pn).getRegex(), Zr = /(?!~)[\p{P}\p{S}]/u, Wi = /(?!~)[\s\p{P}\p{S}]/u, Zi = /(?:[^\s\p{P}\p{S}]|~)/u, Qr = /(?![*_])[\p{P}\p{S}]/u, Qi = /(?![*_])[\s\p{P}\p{S}]/u, Gi = /(?:[^\s\p{P}\p{S}]|[*_])/u, Xi = V(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Ci ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Gr = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, Yi = V(Gr, "u").replace(/punct/g, Yt).getRegex(), Ki = V(Gr, "u").replace(/punct/g, Zr).getRegex(), Xr = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Vi = V(Xr, "gu").replace(/notPunctSpace/g, Wr).replace(/punctSpace/g, Pn).replace(/punct/g, Yt).getRegex(), Ji = V(Xr, "gu").replace(/notPunctSpace/g, Zi).replace(/punctSpace/g, Wi).replace(/punct/g, Zr).getRegex(), ea = V("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Wr).replace(/punctSpace/g, Pn).replace(/punct/g, Yt).getRegex(), ta = V(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Qr).getRegex(), na = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", ra = V(na, "gu").replace(/notPunctSpace/g, Gi).replace(/punctSpace/g, Qi).replace(/punct/g, Qr).getRegex(), sa = V(/\\(punct)/, "gu").replace(/punct/g, Yt).getRegex(), ia = V(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), aa = V(Mn).replace("(?:-->|$)", "-->").getRegex(), la = V("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", aa).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), jt = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, oa = V(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", jt).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Yr = V(/^!?\[(label)\]\[(ref)\]/).replace("label", jt).replace("ref", Ln).getRegex(), Kr = V(/^!?\[(ref)\](?:\[\])?/).replace("ref", Ln).getRegex(), ca = V("reflink|nolink(?!\\()", "g").replace("reflink", Yr).replace("nolink", Kr).getRegex(), or = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, In = { _backpedal: Ke, anyPunctuation: sa, autolink: ia, blockSkip: Xi, br: Fr, code: Ui, del: Ke, delLDelim: Ke, delRDelim: Ke, emStrongLDelim: Yi, emStrongRDelimAst: Vi, emStrongRDelimUnd: ea, escape: Hi, link: oa, nolink: Kr, punctuation: Fi, reflink: Yr, reflinkSearch: ca, tag: la, text: ji, url: Ke }, ua = { ...In, link: V(/^!?\[(label)\]\((.*?)\)/).replace("label", jt).getRegex(), reflink: V(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", jt).getRegex() }, mn = { ...In, emStrongRDelimAst: Ji, emStrongLDelim: Ki, delLDelim: ta, delRDelim: ra, url: V(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", or).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: V(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", or).getRegex() }, ha = { ...mn, br: V(Fr).replace("{2,}", "*").getRegex(), text: V(mn.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Pt = { normal: $n, gfm: Di, pedantic: qi }, lt = { normal: In, gfm: mn, breaks: ha, pedantic: ua }, pa = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, cr = (t) => pa[t];
function Be(t, e) {
  if (e) {
    if (ve.escapeTest.test(t)) return t.replace(ve.escapeReplace, cr);
  } else if (ve.escapeTestNoEncode.test(t)) return t.replace(ve.escapeReplaceNoEncode, cr);
  return t;
}
function ur(t) {
  try {
    t = encodeURI(t).replace(ve.percentDecode, "%");
  } catch {
    return null;
  }
  return t;
}
function hr(t, e) {
  let r = t.replace(ve.findPipe, (s, a, o) => {
    let l = !1, c = a;
    for (; --c >= 0 && o[c] === "\\"; ) l = !l;
    return l ? "|" : " |";
  }), i = r.split(ve.splitPipe), n = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !i.at(-1)?.trim() && i.pop(), e) if (i.length > e) i.splice(e);
  else for (; i.length < e; ) i.push("");
  for (; n < i.length; n++) i[n] = i[n].trim().replace(ve.slashPipe, "|");
  return i;
}
function ot(t, e, r) {
  let i = t.length;
  if (i === 0) return "";
  let n = 0;
  for (; n < i && t.charAt(i - n - 1) === e; )
    n++;
  return t.slice(0, i - n);
}
function da(t, e) {
  if (t.indexOf(e[1]) === -1) return -1;
  let r = 0;
  for (let i = 0; i < t.length; i++) if (t[i] === "\\") i++;
  else if (t[i] === e[0]) r++;
  else if (t[i] === e[1] && (r--, r < 0)) return i;
  return r > 0 ? -2 : -1;
}
function fa(t, e = 0) {
  let r = e, i = "";
  for (let n of t) if (n === "	") {
    let s = 4 - r % 4;
    i += " ".repeat(s), r += s;
  } else i += n, r++;
  return i;
}
function pr(t, e, r, i, n) {
  let s = e.href, a = e.title || null, o = t[1].replace(n.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  let l = { type: t[0].charAt(0) === "!" ? "image" : "link", raw: r, href: s, title: a, text: o, tokens: i.inlineTokens(o) };
  return i.state.inLink = !1, l;
}
function ga(t, e, r) {
  let i = t.match(r.other.indentCodeCompensation);
  if (i === null) return e;
  let n = i[1];
  return e.split(`
`).map((s) => {
    let a = s.match(r.other.beginningSpace);
    if (a === null) return s;
    let [o] = a;
    return o.length >= n.length ? s.slice(n.length) : s;
  }).join(`
`);
}
var Ft = class {
  options;
  rules;
  lexer;
  constructor(t) {
    this.options = t || Je;
  }
  space(t) {
    let e = this.rules.block.newline.exec(t);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(t) {
    let e = this.rules.block.code.exec(t);
    if (e) {
      let r = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? r : ot(r, `
`) };
    }
  }
  fences(t) {
    let e = this.rules.block.fences.exec(t);
    if (e) {
      let r = e[0], i = ga(r, e[3] || "", this.rules);
      return { type: "code", raw: r, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: i };
    }
  }
  heading(t) {
    let e = this.rules.block.heading.exec(t);
    if (e) {
      let r = e[2].trim();
      if (this.rules.other.endingHash.test(r)) {
        let i = ot(r, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceChar.test(i)) && (r = i.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: r, tokens: this.lexer.inline(r) };
    }
  }
  hr(t) {
    let e = this.rules.block.hr.exec(t);
    if (e) return { type: "hr", raw: ot(e[0], `
`) };
  }
  blockquote(t) {
    let e = this.rules.block.blockquote.exec(t);
    if (e) {
      let r = ot(e[0], `
`).split(`
`), i = "", n = "", s = [];
      for (; r.length > 0; ) {
        let a = !1, o = [], l;
        for (l = 0; l < r.length; l++) if (this.rules.other.blockquoteStart.test(r[l])) o.push(r[l]), a = !0;
        else if (!a) o.push(r[l]);
        else break;
        r = r.slice(l);
        let c = o.join(`
`), u = c.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${c}` : c, n = n ? `${n}
${u}` : u;
        let h = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(u, s, !0), this.lexer.state.top = h, r.length === 0) break;
        let f = s.at(-1);
        if (f?.type === "code") break;
        if (f?.type === "blockquote") {
          let p = f, g = p.raw + `
` + r.join(`
`), m = this.blockquote(g);
          s[s.length - 1] = m, i = i.substring(0, i.length - p.raw.length) + m.raw, n = n.substring(0, n.length - p.text.length) + m.text;
          break;
        } else if (f?.type === "list") {
          let p = f, g = p.raw + `
` + r.join(`
`), m = this.list(g);
          s[s.length - 1] = m, i = i.substring(0, i.length - f.raw.length) + m.raw, n = n.substring(0, n.length - p.raw.length) + m.raw, r = g.substring(s.at(-1).raw.length).split(`
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
        let l = !1, c = "", u = "";
        if (!(e = s.exec(t)) || this.rules.block.hr.test(t)) break;
        c = e[0], t = t.substring(c.length);
        let h = fa(e[2].split(`
`, 1)[0], e[1].length), f = t.split(`
`, 1)[0], p = !h.trim(), g = 0;
        if (this.options.pedantic ? (g = 2, u = h.trimStart()) : p ? g = e[1].length + 1 : (g = h.search(this.rules.other.nonSpaceChar), g = g > 4 ? 1 : g, u = h.slice(g), g += e[1].length), p && this.rules.other.blankLine.test(f) && (c += f + `
`, t = t.substring(f.length + 1), l = !0), !l) {
          let m = this.rules.other.nextBulletRegex(g), w = this.rules.other.hrRegex(g), k = this.rules.other.fencesBeginRegex(g), v = this.rules.other.headingBeginRegex(g), D = this.rules.other.htmlBeginRegex(g), L = this.rules.other.blockquoteBeginRegex(g);
          for (; t; ) {
            let B = t.split(`
`, 1)[0], I;
            if (f = B, this.options.pedantic ? (f = f.replace(this.rules.other.listReplaceNesting, "  "), I = f) : I = f.replace(this.rules.other.tabCharGlobal, "    "), k.test(f) || v.test(f) || D.test(f) || L.test(f) || m.test(f) || w.test(f)) break;
            if (I.search(this.rules.other.nonSpaceChar) >= g || !f.trim()) u += `
` + I.slice(g);
            else {
              if (p || h.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || k.test(h) || v.test(h) || w.test(h)) break;
              u += `
` + f;
            }
            p = !f.trim(), c += B + `
`, t = t.substring(B.length + 1), h = I.slice(g);
          }
        }
        n.loose || (a ? n.loose = !0 : this.rules.other.doubleBlankLine.test(c) && (a = !0)), n.items.push({ type: "list_item", raw: c, task: !!this.options.gfm && this.rules.other.listIsTask.test(u), loose: !1, text: u, tokens: [] }), n.raw += c;
      }
      let o = n.items.at(-1);
      if (o) o.raw = o.raw.trimEnd(), o.text = o.text.trimEnd();
      else return;
      n.raw = n.raw.trimEnd();
      for (let l of n.items) {
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
            l.checked = u.checked, n.loose ? l.tokens[0] && ["paragraph", "text"].includes(l.tokens[0].type) && "tokens" in l.tokens[0] && l.tokens[0].tokens ? (l.tokens[0].raw = u.raw + l.tokens[0].raw, l.tokens[0].text = u.raw + l.tokens[0].text, l.tokens[0].tokens.unshift(u)) : l.tokens.unshift({ type: "paragraph", raw: u.raw, text: u.raw, tokens: [u] }) : l.tokens.unshift(u);
          }
        }
        if (!n.loose) {
          let c = l.tokens.filter((h) => h.type === "space"), u = c.length > 0 && c.some((h) => this.rules.other.anyLine.test(h.raw));
          n.loose = u;
        }
      }
      if (n.loose) for (let l of n.items) {
        l.loose = !0;
        for (let c of l.tokens) c.type === "text" && (c.type = "paragraph");
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
    let r = hr(e[1]), i = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), n = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], s = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (r.length === i.length) {
      for (let a of i) this.rules.other.tableAlignRight.test(a) ? s.align.push("right") : this.rules.other.tableAlignCenter.test(a) ? s.align.push("center") : this.rules.other.tableAlignLeft.test(a) ? s.align.push("left") : s.align.push(null);
      for (let a = 0; a < r.length; a++) s.header.push({ text: r[a], tokens: this.lexer.inline(r[a]), header: !0, align: s.align[a] });
      for (let a of n) s.rows.push(hr(a, s.header.length).map((o, l) => ({ text: o, tokens: this.lexer.inline(o), header: !1, align: s.align[l] })));
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
        let s = ot(r.slice(0, -1), "\\");
        if ((r.length - s.length) % 2 === 0) return;
      } else {
        let s = da(e[2], "()");
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
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? i = i.slice(1) : i = i.slice(1, -1)), pr(e, { href: i && i.replace(this.rules.inline.anyPunctuation, "$1"), title: n && n.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
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
      return pr(r, n, r[0], this.lexer, this.rules);
    }
  }
  emStrong(t, e, r = "") {
    let i = this.rules.inline.emStrongLDelim.exec(t);
    if (!(!i || i[3] && r.match(this.rules.other.unicodeAlphaNumeric)) && (!(i[1] || i[2]) || !r || this.rules.inline.punctuation.exec(r))) {
      let n = [...i[0]].length - 1, s, a, o = n, l = 0, c = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (c.lastIndex = 0, e = e.slice(-1 * t.length + n); (i = c.exec(e)) != null; ) {
        if (s = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !s) continue;
        if (a = [...s].length, i[3] || i[4]) {
          o += a;
          continue;
        } else if ((i[5] || i[6]) && n % 3 && !((n + a) % 3)) {
          l += a;
          continue;
        }
        if (o -= a, o > 0) continue;
        a = Math.min(a, a + o + l);
        let u = [...i[0]][0].length, h = t.slice(0, n + i.index + u + a);
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
      let n = [...i[0]].length - 1, s, a, o = n, l = this.rules.inline.delRDelim;
      for (l.lastIndex = 0, e = e.slice(-1 * t.length + n); (i = l.exec(e)) != null; ) {
        if (s = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !s || (a = [...s].length, a !== n)) continue;
        if (i[3] || i[4]) {
          o += a;
          continue;
        }
        if (o -= a, o > 0) continue;
        a = Math.min(a, a + o);
        let c = [...i[0]][0].length, u = t.slice(0, n + i.index + c + a), h = u.slice(n, -n);
        return { type: "del", raw: u, text: h, tokens: this.lexer.inlineTokens(h) };
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
}, $e = class wn {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Je, this.options.tokenizer = this.options.tokenizer || new Ft(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let r = { other: ve, block: Pt.normal, inline: lt.normal };
    this.options.pedantic ? (r.block = Pt.pedantic, r.inline = lt.pedantic) : this.options.gfm && (r.block = Pt.gfm, this.options.breaks ? r.inline = lt.breaks : r.inline = lt.gfm), this.tokenizer.rules = r;
  }
  static get rules() {
    return { block: Pt, inline: lt };
  }
  static lex(e, r) {
    return new wn(r).lex(e);
  }
  static lexInline(e, r) {
    return new wn(r).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(ve.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let r = 0; r < this.inlineQueue.length; r++) {
      let i = this.inlineQueue[r];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, r = [], i = !1) {
    for (this.options.pedantic && (e = e.replace(ve.tabCharGlobal, "    ").replace(ve.spaceLine, "")); e; ) {
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
        let a = 1 / 0, o = e.slice(1), l;
        this.options.extensions.startBlock.forEach((c) => {
          l = c.call({ lexer: this }, o), typeof l == "number" && l >= 0 && (a = Math.min(a, l));
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
    let a = !1, o = "";
    for (; e; ) {
      a || (o = ""), a = !1;
      let l;
      if (this.options.extensions?.inline?.some((u) => (l = u.call({ lexer: this }, e, r)) ? (e = e.substring(l.raw.length), r.push(l), !0) : !1)) continue;
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
        let u = r.at(-1);
        l.type === "text" && u?.type === "text" ? (u.raw += l.raw, u.text += l.text) : r.push(l);
        continue;
      }
      if (l = this.tokenizer.emStrong(e, i, o)) {
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
      if (l = this.tokenizer.del(e, i, o)) {
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
      let c = e;
      if (this.options.extensions?.startInline) {
        let u = 1 / 0, h = e.slice(1), f;
        this.options.extensions.startInline.forEach((p) => {
          f = p.call({ lexer: this }, h), typeof f == "number" && f >= 0 && (u = Math.min(u, f));
        }), u < 1 / 0 && u >= 0 && (c = e.substring(0, u + 1));
      }
      if (l = this.tokenizer.inlineText(c)) {
        e = e.substring(l.raw.length), l.raw.slice(-1) !== "_" && (o = l.raw.slice(-1)), a = !0;
        let u = r.at(-1);
        u?.type === "text" ? (u.raw += l.raw, u.text += l.text) : r.push(l);
        continue;
      }
      if (e) {
        let u = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(u);
          break;
        } else throw new Error(u);
      }
    }
    return r;
  }
}, Wt = class {
  options;
  parser;
  constructor(t) {
    this.options = t || Je;
  }
  space(t) {
    return "";
  }
  code({ text: t, lang: e, escaped: r }) {
    let i = (e || "").match(ve.notSpaceStart)?.[0], n = t.replace(ve.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + Be(i) + '">' + (r ? n : Be(n, !0)) + `</code></pre>
` : "<pre><code>" + (r ? n : Be(n, !0)) + `</code></pre>
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
      let o = t.items[a];
      i += this.listitem(o);
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
    return `<code>${Be(t, !0)}</code>`;
  }
  br(t) {
    return "<br>";
  }
  del({ tokens: t }) {
    return `<del>${this.parser.parseInline(t)}</del>`;
  }
  link({ href: t, title: e, tokens: r }) {
    let i = this.parser.parseInline(r), n = ur(t);
    if (n === null) return i;
    t = n;
    let s = '<a href="' + t + '"';
    return e && (s += ' title="' + Be(e) + '"'), s += ">" + i + "</a>", s;
  }
  image({ href: t, title: e, text: r, tokens: i }) {
    i && (r = this.parser.parseInline(i, this.parser.textRenderer));
    let n = ur(t);
    if (n === null) return Be(r);
    t = n;
    let s = `<img src="${t}" alt="${Be(r)}"`;
    return e && (s += ` title="${Be(e)}"`), s += ">", s;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : Be(t.text);
  }
}, zn = class {
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
}, Pe = class bn {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || Je, this.options.renderer = this.options.renderer || new Wt(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new zn();
  }
  static parse(e, r) {
    return new bn(r).parse(e);
  }
  static parseInline(e, r) {
    return new bn(r).parseInline(e);
  }
  parse(e) {
    let r = "";
    for (let i = 0; i < e.length; i++) {
      let n = e[i];
      if (this.options.extensions?.renderers?.[n.type]) {
        let a = n, o = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (o !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(a.type)) {
          r += o || "";
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
        let o = this.options.extensions.renderers[s.type].call({ parser: this }, s);
        if (o !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(s.type)) {
          i += o || "";
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
          let o = 'Token with "' + a.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return i;
  }
}, ut = class {
  options;
  block;
  constructor(t) {
    this.options = t || Je;
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
}, ma = class {
  defaults = Tn();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = Pe;
  Renderer = Wt;
  TextRenderer = zn;
  Lexer = $e;
  Tokenizer = Ft;
  Hooks = ut;
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
            let o = n.renderer.apply(this, a);
            return o === !1 && (o = s.apply(this, a)), o;
          } : e.renderers[n.name] = n.renderer;
        }
        if ("tokenizer" in n) {
          if (!n.level || n.level !== "block" && n.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let s = e[n.level];
          s ? s.unshift(n.tokenizer) : e[n.level] = [n.tokenizer], n.start && (n.level === "block" ? e.startBlock ? e.startBlock.push(n.start) : e.startBlock = [n.start] : n.level === "inline" && (e.startInline ? e.startInline.push(n.start) : e.startInline = [n.start]));
        }
        "childTokens" in n && n.childTokens && (e.childTokens[n.name] = n.childTokens);
      }), i.extensions = e), r.renderer) {
        let n = this.defaults.renderer || new Wt(this.defaults);
        for (let s in r.renderer) {
          if (!(s in n)) throw new Error(`renderer '${s}' does not exist`);
          if (["options", "parser"].includes(s)) continue;
          let a = s, o = r.renderer[a], l = n[a];
          n[a] = (...c) => {
            let u = o.apply(n, c);
            return u === !1 && (u = l.apply(n, c)), u || "";
          };
        }
        i.renderer = n;
      }
      if (r.tokenizer) {
        let n = this.defaults.tokenizer || new Ft(this.defaults);
        for (let s in r.tokenizer) {
          if (!(s in n)) throw new Error(`tokenizer '${s}' does not exist`);
          if (["options", "rules", "lexer"].includes(s)) continue;
          let a = s, o = r.tokenizer[a], l = n[a];
          n[a] = (...c) => {
            let u = o.apply(n, c);
            return u === !1 && (u = l.apply(n, c)), u;
          };
        }
        i.tokenizer = n;
      }
      if (r.hooks) {
        let n = this.defaults.hooks || new ut();
        for (let s in r.hooks) {
          if (!(s in n)) throw new Error(`hook '${s}' does not exist`);
          if (["options", "block"].includes(s)) continue;
          let a = s, o = r.hooks[a], l = n[a];
          ut.passThroughHooks.has(s) ? n[a] = (c) => {
            if (this.defaults.async && ut.passThroughHooksRespectAsync.has(s)) return (async () => {
              let h = await o.call(n, c);
              return l.call(n, h);
            })();
            let u = o.call(n, c);
            return l.call(n, u);
          } : n[a] = (...c) => {
            if (this.defaults.async) return (async () => {
              let h = await o.apply(n, c);
              return h === !1 && (h = await l.apply(n, c)), h;
            })();
            let u = o.apply(n, c);
            return u === !1 && (u = l.apply(n, c)), u;
          };
        }
        i.hooks = n;
      }
      if (r.walkTokens) {
        let n = this.defaults.walkTokens, s = r.walkTokens;
        i.walkTokens = function(a) {
          let o = [];
          return o.push(s.call(this, a)), n && (o = o.concat(n.call(this, a))), o;
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
        let a = n.hooks ? await n.hooks.preprocess(e) : e, o = await (n.hooks ? await n.hooks.provideLexer() : t ? $e.lex : $e.lexInline)(a, n), l = n.hooks ? await n.hooks.processAllTokens(o) : o;
        n.walkTokens && await Promise.all(this.walkTokens(l, n.walkTokens));
        let c = await (n.hooks ? await n.hooks.provideParser() : t ? Pe.parse : Pe.parseInline)(l, n);
        return n.hooks ? await n.hooks.postprocess(c) : c;
      })().catch(s);
      try {
        n.hooks && (e = n.hooks.preprocess(e));
        let a = (n.hooks ? n.hooks.provideLexer() : t ? $e.lex : $e.lexInline)(e, n);
        n.hooks && (a = n.hooks.processAllTokens(a)), n.walkTokens && this.walkTokens(a, n.walkTokens);
        let o = (n.hooks ? n.hooks.provideParser() : t ? Pe.parse : Pe.parseInline)(a, n);
        return n.hooks && (o = n.hooks.postprocess(o)), o;
      } catch (a) {
        return s(a);
      }
    };
  }
  onError(t, e) {
    return (r) => {
      if (r.message += `
Please report this to https://github.com/markedjs/marked.`, t) {
        let i = "<p>An error occurred:</p><pre>" + Be(r.message + "", !0) + "</pre>";
        return e ? Promise.resolve(i) : i;
      }
      if (e) return Promise.reject(r);
      throw r;
    };
  }
}, Ve = new ma();
function J(t, e) {
  return Ve.parse(t, e);
}
J.options = J.setOptions = function(t) {
  return Ve.setOptions(t), J.defaults = Ve.defaults, qr(J.defaults), J;
};
J.getDefaults = Tn;
J.defaults = Je;
J.use = function(...t) {
  return Ve.use(...t), J.defaults = Ve.defaults, qr(J.defaults), J;
};
J.walkTokens = function(t, e) {
  return Ve.walkTokens(t, e);
};
J.parseInline = Ve.parseInline;
J.Parser = Pe;
J.parser = Pe.parse;
J.Renderer = Wt;
J.TextRenderer = zn;
J.Lexer = $e;
J.lexer = $e.lex;
J.Tokenizer = Ft;
J.Hooks = ut;
J.parse = J;
J.options;
J.setOptions;
J.use;
J.walkTokens;
J.parseInline;
Pe.parse;
$e.lex;
const Vr = `function j() {
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
`, dr = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", Vr], { type: "text/javascript;charset=utf-8" });
function wa(t) {
  let e;
  try {
    if (e = dr && (self.URL || self.webkitURL).createObjectURL(dr), !e) throw "";
    const r = new Worker(e, {
      type: "module",
      name: t?.name
    });
    return r.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(e);
    }), r;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(Vr),
      {
        type: "module",
        name: t?.name
      }
    );
  }
}
function ba(t) {
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
const Jr = _r(() => new wa(), "markdown"), fr = typeof DOMParser < "u" ? new DOMParser() : null;
function yn() {
  return Jr.get();
}
function ya(t) {
  return Jr.send(t, 1e3);
}
const Qe = [];
function kn(t) {
  if (t && typeof t == "object") {
    Qe.push(t);
    try {
      J.use(t);
    } catch (e) {
      console.warn("[markdown] failed to apply plugin", e);
    }
  }
}
function ka(t) {
  Qe.length = 0, Array.isArray(t) && Qe.push(...t.filter((e) => e && typeof e == "object"));
  try {
    Qe.forEach((e) => J.use(e));
  } catch (e) {
    console.warn("[markdown] failed to apply markdown extensions", e);
  }
}
async function Zt(t) {
  if (yn && yn())
    try {
      const s = await ya({ type: "render", md: t });
      if (s && s.html !== void 0)
        try {
          const o = (fr || new DOMParser()).parseFromString(s.html, "text/html"), l = o.querySelectorAll("h1,h2,h3,h4,h5,h6");
          l.forEach((h) => {
            h.id || (h.id = ie(h.textContent || ""));
          });
          try {
            o.querySelectorAll("img").forEach((f) => {
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
            o.querySelectorAll("pre code").forEach((f) => {
              try {
                const p = f.getAttribute && f.getAttribute("class") || f.className || "", g = String(p || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
                if (g)
                  try {
                    f.setAttribute && f.setAttribute("class", g);
                  } catch (k) {
                    console.warn("[markdown] set code class failed", k), f.className = g;
                  }
                else
                  try {
                    f.removeAttribute && f.removeAttribute("class");
                  } catch (k) {
                    console.warn("[markdown] remove code class failed", k), f.className = "";
                  }
                const m = g, w = m.match(/language-([a-zA-Z0-9_+-]+)/) || m.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
                if (!w || !w[1])
                  try {
                    const k = f.textContent || "";
                    try {
                      if (oe && typeof oe.getLanguage == "function" && oe.getLanguage("plaintext")) {
                        const v = oe.highlight(k, { language: "plaintext" });
                        v && v.value && (f.innerHTML = v.value);
                      }
                    } catch {
                      try {
                        oe.highlightElement(f);
                      } catch (D) {
                        console.warn("[markdown] hljs.highlightElement failed", D);
                      }
                    }
                  } catch (k) {
                    console.warn("[markdown] code auto-detect failed", k);
                  }
              } catch (p) {
                console.warn("[markdown] processing code blocks failed", p);
              }
            });
          } catch (h) {
            console.warn("[markdown] query code blocks failed", h);
          }
          const c = o.body.innerHTML, u = [];
          return l.forEach((h) => {
            u.push({ level: Number(h.tagName.substring(1)), text: (h.textContent || "").trim(), id: h.id });
          }), { html: c, meta: s.meta || {}, toc: u };
        } catch (a) {
          return console.warn("[markdown] post-process worker HTML failed", a), s;
        }
    } catch (s) {
      console.warn("[markdown] worker render failed", s);
    }
  const { content: r, data: i } = ba(t || "");
  if (J.setOptions({
    gfm: !0,
    mangle: !1,
    headerIds: !1,
    headerPrefix: ""
  }), Qe && Qe.length)
    try {
      Qe.forEach((s) => J.use(s));
    } catch (s) {
      console.warn("[markdown] apply plugins failed", s);
    }
  let n = J.parse(r);
  try {
    const a = (fr || new DOMParser()).parseFromString(n, "text/html"), o = a.querySelectorAll("h1,h2,h3,h4,h5,h6");
    o.forEach((c) => {
      c.id || (c.id = ie(c.textContent || ""));
    });
    try {
      a.querySelectorAll("img").forEach((u) => {
        try {
          u.getAttribute("loading") || u.setAttribute("data-want-lazy", "1");
        } catch (h) {
          console.warn("[markdown] set image loading attribute failed", h);
        }
      });
    } catch (c) {
      console.warn("[markdown] query images failed", c);
    }
    try {
      a.querySelectorAll("pre code").forEach((u) => {
        try {
          const h = u.getAttribute && u.getAttribute("class") || u.className || "", f = String(h || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
          if (f)
            try {
              u.setAttribute && u.setAttribute("class", f);
            } catch (m) {
              console.warn("[markdown] set code class failed", m), u.className = f;
            }
          else
            try {
              u.removeAttribute && u.removeAttribute("class");
            } catch (m) {
              console.warn("[markdown] remove code class failed", m), u.className = "";
            }
          const p = f, g = p.match(/language-([a-zA-Z0-9_+-]+)/) || p.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (!g || !g[1])
            try {
              const m = u.textContent || "";
              try {
                if (oe && typeof oe.getLanguage == "function" && oe.getLanguage("plaintext")) {
                  const w = oe.highlight(m, { language: "plaintext" });
                  w && w.value && (u.innerHTML = w.value);
                }
              } catch {
                try {
                  oe.highlightElement(u);
                } catch (k) {
                  console.warn("[markdown] hljs.highlightElement failed", k);
                }
              }
            } catch (m) {
              console.warn("[markdown] code auto-detect failed", m);
            }
        } catch (h) {
          console.warn("[markdown] processing code blocks failed", h);
        }
      });
    } catch (c) {
      console.warn("[markdown] query code blocks failed", c);
    }
    n = a.body.innerHTML;
    const l = [];
    return o.forEach((c) => {
      l.push({ level: Number(c.tagName.substring(1)), text: (c.textContent || "").trim(), id: c.id });
    }), { html: a.body.innerHTML, meta: i || {}, toc: l };
  } catch (s) {
    console.warn("post-process markdown failed", s);
  }
  return { html: n, meta: i || {}, toc: [] };
}
function xn(t, e) {
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
      const o = a[1].toLowerCase();
      if (Er.has(o) || e && e.size && o.length < 3 && !e.has(o) && !(Te && Te[o] && e.has(Te[o]))) continue;
      if (e && e.size) {
        if (e.has(o)) {
          const c = e.get(o);
          c && r.add(c);
          continue;
        }
        if (Te && Te[o]) {
          const c = Te[o];
          if (e.has(c)) {
            const u = e.get(c) || c;
            r.add(u);
            continue;
          }
        }
      }
      (s.has(o) || o.length >= 5 && o.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(o) && !n.has(o)) && r.add(o);
    }
  return r;
}
const xa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addMarkdownExtension: kn,
  detectFenceLanguages: xn,
  initRendererWorker: yn,
  markdownPlugins: Qe,
  parseMarkdownToHtml: Zt,
  setMarkdownExtensions: ka
}, Symbol.toStringTag, { value: "Module" }));
function Sa(t, e) {
  const r = document.createElement("aside");
  r.className = "menu nimbi-nav";
  const i = document.createElement("p");
  i.className = "menu-label", i.textContent = t("navigation"), r.appendChild(i);
  const n = document.createElement("ul");
  return n.className = "menu-list", e.forEach((s) => {
    const a = document.createElement("li"), o = document.createElement("a");
    if (o.href = "#" + s.path, o.textContent = s.name, a.appendChild(o), s.children && s.children.length) {
      const l = document.createElement("ul");
      s.children.forEach((c) => {
        const u = document.createElement("li"), h = document.createElement("a");
        h.href = "#" + c.path, h.textContent = c.name, u.appendChild(h), l.appendChild(u);
      }), a.appendChild(l);
    }
    n.appendChild(a);
  }), r.appendChild(n), r;
}
function va(t, e, r = "") {
  const i = document.createElement("aside");
  i.className = "menu nimbi-toc-inner";
  const n = document.createElement("p");
  n.className = "menu-label", n.textContent = t("onThisPage"), i.appendChild(n);
  const s = document.createElement("ul");
  return s.className = "menu-list", e.forEach((a) => {
    if (a.level === 1) return;
    const o = document.createElement("li"), l = document.createElement("a"), c = a.id || ie(a.text);
    try {
      const u = String(r || "").replace(/^[\.\/]+/, ""), h = u && F && F.has && F.has(u) ? F.get(u) : u;
      h ? l.href = `?page=${encodeURIComponent(h)}#${encodeURIComponent(c)}` : l.href = `?page=${encodeURIComponent(c)}#${encodeURIComponent(c)}`;
    } catch (u) {
      console.warn("[htmlBuilder] buildTocElement href normalization failed", u);
      const h = String(r || "").replace(/^[\.\/]+/, ""), f = h && F && F.has && F.has(h) ? F.get(h) : h;
      f ? l.href = `?page=${encodeURIComponent(f)}#${encodeURIComponent(c)}` : l.href = `?page=${encodeURIComponent(c)}#${encodeURIComponent(c)}`;
    }
    l.textContent = a.text, o.appendChild(l), s.appendChild(o);
  }), i.appendChild(s), i;
}
function es(t) {
  t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((r) => {
    r.id || (r.id = ie(r.textContent || ""));
  });
}
function Ea(t, e, r) {
  try {
    const i = t.querySelectorAll("img");
    if (i && i.length) {
      const n = e && e.includes("/") ? e.substring(0, e.lastIndexOf("/") + 1) : "";
      i.forEach((s) => {
        const a = s.getAttribute("src") || "";
        if (a && !(/^(https?:)?\/\//.test(a) || a.startsWith("/")))
          try {
            const o = new URL(n + a, r).toString();
            s.src = o;
            try {
              s.getAttribute("loading") || s.setAttribute("data-want-lazy", "1");
            } catch (l) {
              console.warn("[htmlBuilder] set image loading attribute failed", l);
            }
          } catch (o) {
            console.warn("[htmlBuilder] resolve image src failed", o);
          }
      });
    }
  } catch (i) {
    console.warn("[htmlBuilder] lazyLoadImages failed", i);
  }
}
function gr(t, e, r) {
  try {
    const i = e && e.includes("/") ? e.substring(0, e.lastIndexOf("/") + 1) : "", n = new URL(i || ".", r).toString(), s = t.querySelectorAll("*");
    for (const a of Array.from(s || []))
      try {
        const o = a.tagName ? a.tagName.toLowerCase() : "", l = (c) => {
          try {
            const u = a.getAttribute(c) || "";
            if (!u || /^(https?:)?\/\//i.test(u) || u.startsWith("/") || u.startsWith("#")) return;
            try {
              a.setAttribute(c, new URL(u, n).toString());
            } catch {
            }
          } catch {
          }
        };
        if (a.hasAttribute && a.hasAttribute("src") && l("src"), a.hasAttribute && a.hasAttribute("href") && o !== "a" && l("href"), a.hasAttribute && a.hasAttribute("xlink:href") && l("xlink:href"), a.hasAttribute && a.hasAttribute("poster") && l("poster"), a.hasAttribute("srcset")) {
          const h = (a.getAttribute("srcset") || "").split(",").map((f) => f.trim()).filter(Boolean).map((f) => {
            const [p, g] = f.split(/\s+/, 2);
            if (!p || /^(https?:)?\/\//i.test(p) || p.startsWith("/")) return f;
            try {
              const m = new URL(p, n).toString();
              return g ? `${m} ${g}` : m;
            } catch {
              return f;
            }
          }).join(", ");
          a.setAttribute("srcset", h);
        }
      } catch {
      }
  } catch (i) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed", i);
  }
}
let mr = "", on = null, wr = "";
async function ts(t, e, r) {
  try {
    const i = t.querySelectorAll("a");
    if (!i || !i.length) return;
    let n, s;
    e === mr && on ? (n = on, s = wr) : (n = new URL(e), s = Qt(n.pathname), mr = e, on = n, wr = s);
    const a = /* @__PURE__ */ new Set(), o = [];
    for (const l of Array.from(i))
      try {
        const c = l.getAttribute("href") || "";
        if (!c || Lr(c) || c.startsWith("/") && !c.endsWith(".md")) continue;
        const u = c.match(/^([^#?]+\.md)(?:[#](.+))?$/);
        if (u) {
          let h = u[1];
          const f = u[2];
          !h.startsWith("/") && r && (h = (r.includes("/") ? r.substring(0, r.lastIndexOf("/") + 1) : "") + h);
          try {
            const p = new URL(h, e).pathname;
            let g = p.startsWith(s) ? p.slice(s.length) : p;
            g = me(g), o.push({ node: l, mdPathRaw: h, frag: f, rel: g }), F.has(g) || a.add(g);
          } catch (p) {
            console.warn("[htmlBuilder] resolve mdPath failed", p);
          }
          continue;
        }
        try {
          const f = new URL(c, e).pathname || "";
          if (f && f.indexOf(s) !== -1) {
            let p = f.startsWith(s) ? f.slice(s.length) : f;
            if (p = me(p), p = kt(p), p || (p = "_home"), !p.endsWith(".md"))
              if (Q.has(p)) {
                const g = Q.get(p), m = F.get(g) || p;
                l.setAttribute("href", `?page=${encodeURIComponent(m)}`);
              } else
                l.setAttribute("href", `?page=${encodeURIComponent(p)}`);
          }
        } catch (h) {
          console.warn("[htmlBuilder] resolving href to URL failed", h);
        }
      } catch (c) {
        console.warn("[htmlBuilder] processing anchor failed", c);
      }
    a.size && await Promise.all(Array.from(a).map(async (l) => {
      try {
        try {
          const u = String(l).match(/([^\/]+)\.md$/), h = u && u[1];
          if (h && Q.has(h)) {
            try {
              const f = Q.get(h);
              if (f)
                try {
                  F.set(f, h);
                } catch (p) {
                  console.warn("[htmlBuilder] mdToSlug.set failed", p);
                }
            } catch (f) {
              console.warn("[htmlBuilder] reading slugToMd failed", f);
            }
            return;
          }
        } catch (u) {
          console.warn("[htmlBuilder] basename slug lookup failed", u);
        }
        const c = await xe(l, e);
        if (c && c.raw) {
          const u = (c.raw || "").match(/^#\s+(.+)$/m);
          if (u && u[1]) {
            const h = ie(u[1].trim());
            if (h)
              try {
                Q.set(h, l), F.set(l, h);
              } catch (f) {
                console.warn("[htmlBuilder] setting slug mapping failed", f);
              }
          }
        }
      } catch (c) {
        console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed", c);
      }
    }));
    for (const l of o) {
      const { node: c, frag: u, rel: h } = l;
      let f = null;
      try {
        F.has(h) && (f = F.get(h));
      } catch (p) {
        console.warn("[htmlBuilder] mdToSlug access failed", p);
      }
      f ? u ? c.setAttribute("href", `?page=${encodeURIComponent(f)}#${encodeURIComponent(u)}`) : c.setAttribute("href", `?page=${encodeURIComponent(f)}`) : u ? c.setAttribute("href", `?page=${encodeURIComponent(h)}#${encodeURIComponent(u)}`) : c.setAttribute("href", `?page=${encodeURIComponent(h)}`);
    }
  } catch (i) {
    console.warn("[htmlBuilder] rewriteAnchors failed", i);
  }
}
function Aa(t, e, r, i) {
  const n = e.querySelector("h1"), s = n ? (n.textContent || "").trim() : "";
  let a = "";
  try {
    s && (a = ie(s)), !a && t && t.meta && t.meta.title && (a = ie(t.meta.title)), !a && r && (a = ie(String(r))), a || (a = "_home");
    try {
      r && (Q.set(a, r), F.set(r, a));
    } catch (o) {
      console.warn("[htmlBuilder] computeSlug set slug mapping failed", o);
    }
    try {
      let o = "?page=" + encodeURIComponent(a);
      try {
        const l = i || (location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : "");
        l && (o += "#" + encodeURIComponent(l));
      } catch (l) {
        console.warn("[htmlBuilder] computeSlug hash decode failed", l);
      }
      try {
        history.replaceState({ page: a }, "", o);
      } catch (l) {
        console.warn("[htmlBuilder] computeSlug history replace failed", l);
      }
    } catch (o) {
      console.warn("[htmlBuilder] computeSlug inner failed", o);
    }
  } catch (o) {
    console.warn("[htmlBuilder] computeSlug failed", o);
  }
  return { topH1: n, h1Text: s, slugKey: a };
}
async function Ra(t, e) {
  if (!t || !t.length) return;
  const r = /* @__PURE__ */ new Set();
  for (const l of Array.from(t || []))
    try {
      const c = l.getAttribute("href") || "";
      if (!c) continue;
      let f = me(c).split(/::|#/, 2)[0];
      if (!f || (f.includes(".") || (f = f + ".html"), !/\.html(?:$|[?#])/.test(f) && !f.toLowerCase().endsWith(".html"))) continue;
      const p = f;
      try {
        if (F && F.has && F.has(p)) continue;
      } catch (g) {
        console.warn("[htmlBuilder] mdToSlug check failed", g);
      }
      try {
        let g = !1;
        for (const m of Q.values())
          if (m === p) {
            g = !0;
            break;
          }
        if (g) continue;
      } catch (g) {
        console.warn("[htmlBuilder] slugToMd iteration failed", g);
      }
      r.add(p);
    } catch (c) {
      console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed", c);
    }
  if (!r.size) return;
  const i = async (l) => {
    try {
      const c = await xe(l, e);
      if (c && c.raw)
        try {
          const h = (ns || new DOMParser()).parseFromString(c.raw, "text/html"), f = h.querySelector("title"), p = h.querySelector("h1"), g = f && f.textContent && f.textContent.trim() ? f.textContent.trim() : p && p.textContent ? p.textContent.trim() : null;
          if (g) {
            const m = ie(g);
            if (m)
              try {
                Q.set(m, l), F.set(l, m);
              } catch (w) {
                console.warn("[htmlBuilder] set slugToMd/mdToSlug failed", w);
              }
          }
        } catch (u) {
          console.warn("[htmlBuilder] parse HTML title failed", u);
        }
    } catch (c) {
      console.warn("[htmlBuilder] fetchAndExtract failed", c);
    }
  }, n = 5, s = Array.from(r);
  let a = 0;
  const o = [];
  for (; a < s.length; ) {
    const l = s.slice(a, a + n);
    o.push(Promise.all(l.map(i))), a += n;
  }
  await Promise.all(o);
}
async function Ta(t, e) {
  if (!t || !t.length) return;
  const r = [], i = /* @__PURE__ */ new Set();
  let n = "";
  try {
    const s = new URL(e);
    n = Qt(s.pathname);
  } catch (s) {
    n = "", console.warn("[htmlBuilder] preMapMdSlugs parse base failed", s);
  }
  for (const s of Array.from(t || []))
    try {
      const a = s.getAttribute("href") || "";
      if (!a) continue;
      const o = a.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (o) {
        let l = me(o[1]);
        try {
          let c;
          try {
            c = new URL(l, e).pathname;
          } catch (h) {
            c = l, console.warn("[htmlBuilder] resolve mdPath URL failed", h);
          }
          const u = c.startsWith(n) ? c.slice(n.length) : c.replace(/^\//, "");
          r.push({ rel: u }), F.has(u) || i.add(u);
        } catch (c) {
          console.warn("[htmlBuilder] rewriteAnchors failed", c);
        }
        continue;
      }
    } catch (a) {
      console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed", a);
    }
  i.size && await Promise.all(Array.from(i).map(async (s) => {
    try {
      const a = String(s).match(/([^\/]+)\.md$/), o = a && a[1];
      if (o && Q.has(o)) {
        try {
          const l = Q.get(o);
          l && F.set(l, o);
        } catch (l) {
          console.warn("[htmlBuilder] preMapMdSlugs slug map access failed", l);
        }
        return;
      }
    } catch (a) {
      console.warn("[htmlBuilder] preMapMdSlugs basename check failed", a);
    }
    try {
      const a = await xe(s, e);
      if (a && a.raw) {
        const o = (a.raw || "").match(/^#\s+(.+)$/m);
        if (o && o[1]) {
          const l = ie(o[1].trim());
          if (l)
            try {
              Q.set(l, s), F.set(s, l);
            } catch (c) {
              console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed", c);
            }
        }
      }
    } catch (a) {
      console.warn("[htmlBuilder] preMapMdSlugs fetch failed", a);
    }
  }));
}
const ns = typeof DOMParser < "u" ? new DOMParser() : null;
function cn(t) {
  try {
    const r = (ns || new DOMParser()).parseFromString(t || "", "text/html");
    es(r);
    try {
      r.querySelectorAll("img").forEach((o) => {
        try {
          o.getAttribute("loading") || o.setAttribute("data-want-lazy", "1");
        } catch (l) {
          console.warn("[htmlBuilder] parseHtml set image loading attribute failed", l);
        }
      });
    } catch (a) {
      console.warn("[htmlBuilder] parseHtml query images failed", a);
    }
    r.querySelectorAll("pre code, code[class]").forEach((a) => {
      try {
        const o = a.getAttribute && a.getAttribute("class") || a.className || "", l = o.match(/language-([a-zA-Z0-9_+-]+)/) || o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (l && l[1]) {
          const c = (l[1] || "").toLowerCase(), u = K.size && (K.get(c) || K.get(String(c).toLowerCase())) || c;
          try {
            (async () => {
              try {
                await yt(u);
              } catch (h) {
                console.warn("[htmlBuilder] registerLanguage failed", h);
              }
            })();
          } catch (h) {
            console.warn("[htmlBuilder] schedule registerLanguage failed", h);
          }
        } else
          try {
            if (oe && typeof oe.getLanguage == "function" && oe.getLanguage("plaintext")) {
              const c = oe.highlight ? oe.highlight(a.textContent || "", { language: "plaintext" }) : null;
              c && c.value && (a.innerHTML = c.value);
            }
          } catch (c) {
            console.warn("[htmlBuilder] plaintext highlight fallback failed", c);
          }
      } catch (o) {
        console.warn("[htmlBuilder] code element processing failed", o);
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
async function Ca(t) {
  const e = xn ? xn(t || "", K) : /* @__PURE__ */ new Set(), r = new Set(e), i = [];
  for (const n of r)
    try {
      const s = K.size && (K.get(n) || K.get(String(n).toLowerCase())) || n;
      try {
        i.push(yt(s));
      } catch (a) {
        console.warn("[htmlBuilder] ensureLanguages push canonical failed", a);
      }
      if (String(n) !== String(s))
        try {
          i.push(yt(n));
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
async function _a(t) {
  if (await Ca(t), Zt) {
    const e = await Zt(t || "");
    return !e || typeof e != "object" ? { html: String(t || ""), meta: {}, toc: [] } : (Array.isArray(e.toc) || (e.toc = []), e.meta || (e.meta = {}), e);
  }
  return { html: String(t || ""), meta: {}, toc: [] };
}
async function La(t, e, r, i, n) {
  let s = null;
  if (e.isHtml)
    try {
      const h = typeof DOMParser < "u" ? new DOMParser() : null;
      if (h) {
        const f = h.parseFromString(e.raw || "", "text/html");
        try {
          gr(f.body, r, n);
        } catch {
        }
        s = cn(f.documentElement && f.documentElement.outerHTML ? f.documentElement.outerHTML : e.raw || "");
      } else
        s = cn(e.raw || "");
    } catch {
      s = cn(e.raw || "");
    }
  else
    s = await _a(e.raw || "");
  const a = document.createElement("article");
  a.className = "nimbi-article content", a.innerHTML = s.html;
  try {
    gr(a, r, n);
  } catch (h) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle", h);
  }
  try {
    es(a);
  } catch (h) {
    console.warn("[htmlBuilder] addHeadingIds failed", h);
  }
  try {
    a.querySelectorAll("pre code, code[class]").forEach((f) => {
      try {
        const p = f.getAttribute && f.getAttribute("class") || f.className || "", g = String(p || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
        if (g)
          try {
            f.setAttribute && f.setAttribute("class", g);
          } catch (m) {
            f.className = g, console.warn("[htmlBuilder] set element class failed", m);
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
    ri(a);
  } catch (h) {
    console.warn("[htmlBuilder] observeCodeBlocks failed", h);
  }
  Ea(a, r, n);
  try {
    await Ma(a, n, r);
  } catch (h) {
    console.warn("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", h), await ts(a, n, r);
  }
  const { topH1: o, h1Text: l, slugKey: c } = Aa(s, a, r, i), u = va(t, s.toc, r);
  return { article: a, parsed: s, toc: u, topH1: o, h1Text: l, slugKey: c };
}
function br(t, e, r) {
  t && (t.innerHTML = "");
  const i = document.createElement("article");
  i.className = "nimbi-article content nimbi-not-found";
  const n = document.createElement("h1");
  n.textContent = e && e("notFound") || "Page not found";
  const s = document.createElement("p");
  s.textContent = r && r.message ? String(r.message) : "Failed to resolve the requested page.", i.appendChild(n), i.appendChild(s), t && t.appendChild && t.appendChild(i);
}
async function Ma(t, e, r) {
  return ts(t, e, r);
}
function $a(t) {
  try {
    t.addEventListener("click", (e) => {
      const r = e.target && e.target.closest ? e.target.closest("a") : null;
      if (!r) return;
      const i = r.getAttribute("href") || "";
      try {
        const n = new URL(i, location.href), s = n.searchParams.get("page"), a = n.hash ? n.hash.replace(/^#/, "") : null;
        if (!s && !a) return;
        e.preventDefault();
        let o = null;
        try {
          history && history.state && history.state.page && (o = history.state.page);
        } catch (l) {
          o = null, console.warn("[htmlBuilder] access history.state failed", l);
        }
        try {
          o || (o = new URL(location.href).searchParams.get("page"));
        } catch (l) {
          console.warn("[htmlBuilder] parse current location failed", l);
        }
        if (!s && a || s && o && String(s) === String(o)) {
          try {
            if (!s && a)
              try {
                history.replaceState(history.state, "", (location.pathname || "") + (location.search || "") + (a ? "#" + encodeURIComponent(a) : ""));
              } catch (l) {
                console.warn("[htmlBuilder] history.replaceState failed", l);
              }
            else
              try {
                history.replaceState({ page: o || s }, "", "?page=" + encodeURIComponent(o || s) + (a ? "#" + encodeURIComponent(a) : ""));
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
            Sn(a);
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
function Sn(t) {
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
function Pa(t, e, { mountOverlay: r = null, container: i = null, mountEl: n = null, navWrap: s = null, t: a = null } = {}) {
  try {
    const o = a || ((m) => typeof m == "string" ? m : ""), l = i || document.querySelector(".nimbi-cms"), c = n || document.querySelector(".nimbi-mount"), u = r || document.querySelector(".nimbi-overlay"), h = s || document.querySelector(".nimbi-nav-wrap");
    let p = document.querySelector(".nimbi-scroll-top");
    if (!p) {
      p = document.createElement("button"), p.className = "nimbi-scroll-top", p.setAttribute("aria-label", o("scrollToTop")), p.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';
      try {
        u && u.appendChild ? u.appendChild(p) : l && l.appendChild ? l.appendChild(p) : c && c.appendChild ? c.appendChild(p) : document.body.appendChild(p);
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
    const g = h && h.querySelector ? h.querySelector(".menu-label") : null;
    if (e) {
      if (!p._nimbiObserver) {
        const m = new IntersectionObserver((w) => {
          for (const k of w)
            k.target instanceof Element && (k.isIntersecting ? (p.classList.remove("show"), g && g.classList.remove("show")) : (p.classList.add("show"), g && g.classList.add("show")));
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
            const w = l instanceof Element ? l.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }, k = e.getBoundingClientRect();
            !(k.bottom < w.top || k.top > w.bottom) ? (p.classList.remove("show"), g && g.classList.remove("show")) : (p.classList.add("show"), g && g.classList.add("show"));
          } catch (w) {
            console.warn("[htmlBuilder] checkIntersect failed", w);
          }
        };
        m(), "IntersectionObserver" in window || setTimeout(m, 100);
      } catch (m) {
        console.warn("[htmlBuilder] checkIntersect outer failed", m);
      }
    } else {
      p.classList.remove("show"), g && g.classList.remove("show");
      const m = i instanceof Element ? i : n instanceof Element ? n : window, w = () => {
        try {
          (m === window ? window.scrollY : m.scrollTop || 0) > 10 ? (p.classList.add("show"), g && g.classList.add("show")) : (p.classList.remove("show"), g && g.classList.remove("show"));
        } catch (k) {
          console.warn("[htmlBuilder] onScroll handler failed", k);
        }
      };
      Nt(() => m.addEventListener("scroll", w)), w();
    }
  } catch (o) {
    console.warn("[htmlBuilder] ensureScrollTopButton failed", o);
  }
}
async function Ia(t, e, r, i, n, s, a, o, l = "eager", c = 1, u = void 0) {
  if (!t || !(t instanceof HTMLElement))
    throw new TypeError("navbarWrap must be an HTMLElement");
  const h = typeof DOMParser < "u" ? new DOMParser() : null, f = h ? h.parseFromString(r || "", "text/html") : null, p = f ? f.querySelectorAll("a") : [];
  await Nt(() => Ra(p, i)), await Nt(() => Ta(p, i));
  let g = null, m = null, w = !1;
  const k = document.createElement("nav");
  k.className = "navbar", k.setAttribute("role", "navigation"), k.setAttribute("aria-label", "main navigation");
  const v = document.createElement("div");
  v.className = "navbar-brand";
  const D = p[0], L = document.createElement("a");
  if (L.className = "navbar-item", D) {
    const _ = D.getAttribute("href") || "#";
    try {
      const T = new URL(_, location.href).searchParams.get("page");
      T ? L.href = "?page=" + encodeURIComponent(decodeURIComponent(T)) : (L.href = "?page=" + encodeURIComponent(n), L.textContent = s("home"));
    } catch {
      L.href = "?page=" + encodeURIComponent(n), L.textContent = s("home");
    }
  } else
    L.href = "?page=" + encodeURIComponent(n), L.textContent = s("home");
  v.appendChild(L), L.addEventListener("click", function(_) {
    const M = L.getAttribute("href") || "";
    if (M.startsWith("?page=")) {
      _.preventDefault();
      const T = new URL(M, location.href), x = T.searchParams.get("page"), b = T.hash ? T.hash.replace(/^#/, "") : null;
      history.pushState({ page: x }, "", "?page=" + encodeURIComponent(x) + (b ? "#" + encodeURIComponent(b) : ""));
      try {
        a();
      } catch (A) {
        console.warn("[nimbi-cms] renderByQuery failed", A);
      }
    }
  });
  const B = document.createElement("a");
  B.className = "navbar-burger", B.setAttribute("role", "button"), B.setAttribute("aria-label", "menu"), B.setAttribute("aria-expanded", "false");
  const I = "nimbi-navbar-menu";
  B.dataset.target = I, B.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>', v.appendChild(B);
  try {
    B.addEventListener("click", (_) => {
      try {
        const M = B.dataset && B.dataset.target ? B.dataset.target : null, T = M ? document.getElementById(M) : null;
        B.classList.contains("is-active") ? (B.classList.remove("is-active"), B.setAttribute("aria-expanded", "false"), T && T.classList.remove("is-active")) : (B.classList.add("is-active"), B.setAttribute("aria-expanded", "true"), T && T.classList.add("is-active"));
      } catch (M) {
        console.warn("[nimbi-cms] navbar burger toggle failed", M);
      }
    });
  } catch (_) {
    console.warn("[nimbi-cms] burger event binding failed", _);
  }
  const ee = document.createElement("div");
  ee.className = "navbar-menu", ee.id = I;
  const ne = document.createElement("div");
  ne.className = "navbar-start";
  let Y, te, q;
  if (!o)
    Y = null, m = null, q = null;
  else {
    Y = document.createElement("div"), Y.className = "navbar-end", te = document.createElement("div"), te.className = "navbar-item", te.style.position = "relative", m = document.createElement("input"), m.className = "input", m.type = "search", m.placeholder = s("searchPlaceholder") || "", m.id = "nimbi-search", l === "eager" && (m.disabled = !0, m.classList.add("is-loading")), te.appendChild(m), q = document.createElement("div"), q.id = "nimbi-search-results", q.className = "box", q.style.position = "absolute", q.style.top = "100%", q.style.right = "0", q.style.left = "auto", q.style.zIndex = "10000", q.style.minWidth = "240px", q.style.maxWidth = "420px", q.style.maxHeight = "50vh", q.style.overflowY = "auto", q.style.display = "none", q.style.padding = "8px", q.style.boxShadow = "0 6px 18px rgba(10,10,10,0.1)", te.appendChild(q), Y.appendChild(te);
    const _ = (T) => {
      if (q.innerHTML = "", !T.length) {
        q.style.display = "none";
        return;
      }
      T.forEach((x) => {
        const b = document.createElement("div");
        if (b.style.marginBottom = "6px", b.style.padding = "6px", b.style.borderBottom = "1px solid rgba(0,0,0,0.06)", x.parentTitle) {
          const y = document.createElement("div");
          y.textContent = x.parentTitle, y.style.fontSize = "11px", y.style.opacity = "0.7", y.style.marginBottom = "4px", y.className = "nimbi-search-parent", y.style.whiteSpace = "nowrap", y.style.overflow = "hidden", y.style.textOverflow = "ellipsis", y.style.display = "block", y.style.maxWidth = "100%", b.appendChild(y);
        }
        const A = document.createElement("a");
        A.className = "block", A.href = "?page=" + encodeURIComponent(x.slug), A.textContent = x.title, A.style.whiteSpace = "nowrap", A.style.overflow = "hidden", A.style.textOverflow = "ellipsis", A.addEventListener("click", () => {
          q.style.display = "none";
        }), b.appendChild(A), q.appendChild(b);
      }), q.style.display = "block", q.style.right = "0", q.style.left = "auto";
    }, M = (T, x) => {
      let b = null;
      return (...A) => {
        b && clearTimeout(b), b = setTimeout(() => T(...A), x);
      };
    };
    if (m) {
      const T = M(async () => {
        const x = document.querySelector("input#nimbi-search"), b = String(x && x.value || "").trim().toLowerCase();
        if (!b) {
          _([]);
          return;
        }
        try {
          const A = await Promise.resolve().then(() => zt);
          g || (g = (async () => {
            try {
              return l === "lazy" && A.buildSearchIndexWorker ? A.buildSearchIndexWorker(i, c, u) : A.buildSearchIndex(i, c, u);
            } catch (G) {
              return console.warn("[nimbi-cms] buildSearchIndex failed", G), [];
            } finally {
              x && (x.removeAttribute("disabled"), x.classList.remove("is-loading"));
            }
          })());
          const P = (await g).filter((G) => G.title && G.title.toLowerCase().includes(b) || G.excerpt && G.excerpt.toLowerCase().includes(b));
          _(P.slice(0, 10));
        } catch (A) {
          console.warn("[nimbi-cms] search input handler failed", A), _([]);
        }
      }, 50);
      m && m.addEventListener("input", T), document.addEventListener("click", (x) => {
        const b = document.querySelector("input#nimbi-search");
        b && !b.contains(x.target) && q && !q.contains(x.target) && (q.style.display = "none");
      });
    }
    if (l === "eager") {
      try {
        g = (async () => {
          try {
            const x = await (await Promise.resolve().then(() => zt)).buildSearchIndex(i, c, u);
            return w || (w = !0), x;
          } catch (T) {
            return console.warn("[nimbi-cms] buildSearchIndex failed", T), [];
          }
        })();
      } catch (T) {
        console.warn("[nimbi-cms] eager search index init failed", T), g = Promise.resolve([]);
      }
      g.finally(() => {
        const T = document.querySelector("input#nimbi-search");
        T && (T.removeAttribute("disabled"), T.classList.remove("is-loading"));
      });
    }
  }
  for (let _ = 0; _ < p.length; _++) {
    const M = p[_];
    if (_ === 0) continue;
    const T = M.getAttribute("href") || "#", x = document.createElement("a");
    x.className = "navbar-item";
    try {
      if (/^[^#]*\.md(?:$|[#?])/.test(T) || T.endsWith(".md")) {
        const A = me(T).split(/::|#/, 2), y = A[0], P = A[1];
        x.href = "?page=" + encodeURIComponent(y) + (P ? "#" + encodeURIComponent(P) : "");
      } else if (/\.html(?:$|[#?])/.test(T) || T.endsWith(".html")) {
        const A = me(T).split(/::|#/, 2);
        let y = A[0];
        y && !y.toLowerCase().endsWith(".html") && (y = y + ".html");
        const P = A[1];
        try {
          const G = await xe(y, i);
          if (G && G.raw)
            try {
              const Ee = new DOMParser().parseFromString(G.raw, "text/html"), Se = Ee.querySelector("title"), we = Ee.querySelector("h1"), fe = Se && Se.textContent && Se.textContent.trim() ? Se.textContent.trim() : we && we.textContent ? we.textContent.trim() : null;
              if (fe) {
                const Ae = ie(fe);
                if (Ae) {
                  try {
                    Q.set(Ae, y), F.set(y, Ae);
                  } catch (Ne) {
                    console.warn("[nimbi-cms] slugToMd/mdToSlug set failed", Ne);
                  }
                  x.href = "?page=" + encodeURIComponent(Ae) + (P ? "#" + encodeURIComponent(P) : "");
                } else
                  x.href = "?page=" + encodeURIComponent(y) + (P ? "#" + encodeURIComponent(P) : "");
              } else
                x.href = "?page=" + encodeURIComponent(y) + (P ? "#" + encodeURIComponent(P) : "");
            } catch {
              x.href = "?page=" + encodeURIComponent(y) + (P ? "#" + encodeURIComponent(P) : "");
            }
          else
            x.href = T;
        } catch {
          x.href = T;
        }
      } else
        x.href = T;
    } catch (b) {
      console.warn("[nimbi-cms] nav item href parse failed", b), x.href = T;
    }
    try {
      const b = M.textContent && String(M.textContent).trim() ? String(M.textContent).trim() : null;
      if (b)
        try {
          const A = ie(b);
          if (A) {
            const y = x.getAttribute && x.getAttribute("href") ? x.getAttribute("href") : "";
            try {
              const G = new URL(y, location.href).searchParams.get("page");
              if (G) {
                const re = decodeURIComponent(G);
                try {
                  Q.set(A, re), F.set(re, A);
                } catch (Ee) {
                  console.warn("[nimbi-cms] slugToMd/mdToSlug set failed", Ee);
                }
              }
            } catch (P) {
              console.warn("[nimbi-cms] nav slug mapping failed", P);
            }
          }
        } catch (A) {
          console.warn("[nimbi-cms] nav slug mapping failed", A);
        }
    } catch (b) {
      console.warn("[nimbi-cms] nav slug mapping failed", b);
    }
    x.textContent = M.textContent || T, ne.appendChild(x);
  }
  try {
    m = document.getElementById("nimbi-search");
    const _ = document.getElementById("nimbi-search-results"), M = (x) => {
      if (_.innerHTML = "", !x.length) {
        _.style.display = "none";
        return;
      }
      x.forEach((b) => {
        const A = document.createElement("div");
        if (A.style.marginBottom = "6px", A.style.padding = "6px", A.style.borderBottom = "1px solid rgba(0,0,0,0.06)", b.parentTitle) {
          const P = document.createElement("div");
          P.textContent = b.parentTitle, P.style.fontSize = "11px", P.style.opacity = "0.7", P.style.marginBottom = "4px", P.className = "nimbi-search-parent", P.style.whiteSpace = "nowrap", P.style.overflow = "hidden", P.style.textOverflow = "ellipsis", P.style.display = "block", P.style.maxWidth = "100%", A.appendChild(P);
        }
        const y = document.createElement("a");
        y.className = "block", y.href = "?page=" + encodeURIComponent(b.slug), y.textContent = b.title, y.style.whiteSpace = "nowrap", y.style.overflow = "hidden", y.style.textOverflow = "ellipsis", y.addEventListener("click", () => {
          _.style.display = "none";
        }), A.appendChild(y), _.appendChild(A);
      }), _.style.display = "block", _.style.right = "0", _.style.left = "auto";
    }, T = (x, b) => {
      let A = null;
      return (...y) => {
        A && clearTimeout(A), A = setTimeout(() => x(...y), b);
      };
    };
    if (m) {
      const x = T(async () => {
        const b = String(m.value || "").trim().toLowerCase();
        if (!b) {
          M([]);
          return;
        }
        try {
          const A = await Promise.resolve().then(() => zt);
          g || (g = (async () => {
            try {
              return l === "lazy" && A.buildSearchIndexWorker ? A.buildSearchIndexWorker(i, c, u) : A.buildSearchIndex(i, c, u);
            } catch (G) {
              return console.warn("[nimbi-cms] buildSearchIndex failed", G), [];
            } finally {
              m && (m.disabled = !1, m.classList.remove("is-loading"));
            }
          })());
          const P = (await g).filter((G) => G.title && G.title.toLowerCase().includes(b) || G.excerpt && G.excerpt.toLowerCase().includes(b));
          M(P.slice(0, 10));
        } catch (A) {
          console.warn("[nimbi-cms] search input handler failed", A), M([]);
        }
      }, 50);
      m.addEventListener("input", x), document.addEventListener("click", (b) => {
        m && !m.contains(b.target) && _ && !_.contains(b.target) && (_.style.display = "none");
      });
    }
  } catch (_) {
    console.warn("[nimbi-cms] navbar/search setup inner failed", _);
  }
  ee.appendChild(ne), Y && ee.appendChild(Y), k.appendChild(v), k.appendChild(ee), t.appendChild(k);
  try {
    ee.addEventListener("click", (_) => {
      const M = _.target && _.target.closest ? _.target.closest("a") : null;
      if (!M) return;
      const T = M.getAttribute("href") || "";
      try {
        const x = new URL(T, location.href), b = x.searchParams.get("page"), A = x.hash ? x.hash.replace(/^#/, "") : null;
        if (b) {
          _.preventDefault(), history.pushState({ page: b }, "", "?page=" + encodeURIComponent(b) + (A ? "#" + encodeURIComponent(A) : ""));
          try {
            a();
          } catch (y) {
            console.warn("[nimbi-cms] renderByQuery failed", y);
          }
        }
      } catch (x) {
        console.warn("[nimbi-cms] navbar click handler failed", x);
      }
      try {
        const x = k && k.querySelector ? k.querySelector(".navbar-burger") : null, b = x && x.dataset ? x.dataset.target : null, A = b ? document.getElementById(b) : null;
        x && x.classList.contains("is-active") && (x.classList.remove("is-active"), x.setAttribute("aria-expanded", "false"), A && A.classList.remove("is-active"));
      } catch (x) {
        console.warn("[nimbi-cms] mobile menu close failed", x);
      }
    });
  } catch (_) {
    console.warn("[nimbi-cms] attach content click handler failed", _);
  }
  try {
    e.addEventListener("click", (_) => {
      const M = _.target && _.target.closest ? _.target.closest("a") : null;
      if (!M) return;
      const T = M.getAttribute("href") || "";
      if (T && !Lr(T))
        try {
          const x = new URL(T, location.href), b = x.searchParams.get("page"), A = x.hash ? x.hash.replace(/^#/, "") : null;
          if (b) {
            _.preventDefault(), history.pushState({ page: b }, "", "?page=" + encodeURIComponent(b) + (A ? "#" + encodeURIComponent(A) : ""));
            try {
              a();
            } catch (y) {
              console.warn("[nimbi-cms] renderByQuery failed", y);
            }
          }
        } catch (x) {
          console.warn("[nimbi-cms] container click URL parse failed", x);
        }
    });
  } catch (_) {
    console.warn("[nimbi-cms] build navbar failed", _);
  }
  return { navbar: k, linkEls: p };
}
var un, yr;
function za() {
  if (yr) return un;
  yr = 1;
  function t(s, a) {
    return a.some(
      ([o, l]) => o <= s && s <= l
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
    let o = 0, l = 0, c = s.length - 1;
    const u = a.wordsPerMinute || 200, h = a.wordBound || r;
    for (; h(s[l]); ) l++;
    for (; h(s[c]); ) c--;
    const f = `${s}
`;
    for (let w = l; w <= c; w++)
      if ((e(f[w]) || !h(f[w]) && (h(f[w + 1]) || e(f[w + 1]))) && o++, e(f[w]))
        for (; w <= c && (i(f[w + 1]) || h(f[w + 1])); )
          w++;
    const p = o / u, g = Math.round(p * 60 * 1e3);
    return {
      text: Math.ceil(p.toFixed(2)) + " min read",
      minutes: p,
      time: g,
      words: o
    };
  }
  return un = n, un;
}
var Ba = za();
const Oa = /* @__PURE__ */ vr(Ba);
function kr(t, e) {
  let r = document.querySelector(`meta[name="${t}"]`);
  r || (r = document.createElement("meta"), r.setAttribute("name", t), document.head.appendChild(r)), r.setAttribute("content", e);
}
function nt(t, e, r) {
  let i = `meta[${t}="${e}"]`, n = document.querySelector(i);
  n || (n = document.createElement("meta"), n.setAttribute(t, e), document.head.appendChild(n)), n.setAttribute("content", r);
}
function Na(t, e) {
  try {
    let r = document.querySelector(`link[rel="${t}"]`);
    r || (r = document.createElement("link"), r.setAttribute("rel", t), document.head.appendChild(r)), r.setAttribute("href", e);
  } catch (r) {
    console.warn("[seoManager] upsertLinkRel failed", r);
  }
}
function Da(t, e, r, i) {
  const n = e && String(e).trim() ? e : t.title || document.title;
  nt("property", "og:title", n);
  const s = i && String(i).trim() ? i : t.description || "";
  s && String(s).trim() && nt("property", "og:description", s), nt("name", "twitter:card", t.twitter_card || "summary_large_image");
  const a = r || t.image;
  a && (nt("property", "og:image", a), nt("name", "twitter:image", a));
}
function qa(t, e, r, i, n = "") {
  const s = t.meta || {}, a = document && document.querySelector && document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", o = i && String(i).trim() ? i : s.description && String(s.description).trim() ? s.description : a && String(a).trim() ? a : "";
  o && String(o).trim() && kr("description", o), kr("robots", s.robots || "index,follow"), Da(s, e, r, o);
}
function Ha() {
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
function Ua(t, e, r, i, n, s = "") {
  try {
    const a = t.meta || {}, o = r && String(r).trim() ? r : a.title || s || document.title, l = n && String(n).trim() ? n : a.description || document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", c = i || a.image || null;
    let u = "";
    try {
      if (e) {
        const g = me(e);
        try {
          u = (location.origin + location.pathname).split("?")[0] + "?page=" + encodeURIComponent(g);
        } catch {
          u = location.href.split("#")[0];
        }
      } else
        u = location.href.split("#")[0];
    } catch (g) {
      u = location.href.split("#")[0], console.warn("[seoManager] compute canonical failed", g);
    }
    u && Na("canonical", u);
    try {
      nt("property", "og:url", u);
    } catch (g) {
      console.warn("[seoManager] upsertMeta og:url failed", g);
    }
    const h = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: o || "",
      description: l || "",
      url: u || location.href.split("#")[0]
    };
    c && (h.image = String(c)), a.date && (h.datePublished = a.date), a.dateModified && (h.dateModified = a.dateModified);
    const f = "nimbi-jsonld";
    let p = document.getElementById(f);
    p || (p = document.createElement("script"), p.type = "application/ld+json", p.id = f, document.head.appendChild(p)), p.textContent = JSON.stringify(h, null, 2);
  } catch (a) {
    console.warn("[seoManager] setStructuredData failed", a);
  }
}
function ja(t, e, r, i, n, s, a, o, l, c, u) {
  try {
    const h = i.querySelector(".menu-label");
    h && (h.textContent = o && o.textContent || t("onThisPage"));
  } catch (h) {
    console.warn("[seoManager] update toc label failed", h);
  }
  try {
    const h = r.meta && r.meta.title ? String(r.meta.title).trim() : "", f = n.querySelector("img"), p = f && (f.getAttribute("src") || f.src) || null;
    let g = "";
    try {
      let w = "";
      try {
        const k = o || (n && n.querySelector ? n.querySelector("h1") : null);
        if (k) {
          let v = k.nextElementSibling;
          const D = [];
          for (; v && !(v.tagName && v.tagName.toLowerCase() === "h2"); ) {
            const L = (v.textContent || "").trim();
            L && D.push(L), v = v.nextElementSibling;
          }
          D.length && (w = D.join(" ").replace(/\s+/g, " ").trim()), !w && l && (w = String(l).trim());
        }
      } catch (k) {
        console.warn("[seoManager] compute descOverride failed", k);
      }
      w && String(w).length > 160 && (w = String(w).slice(0, 157).trim() + "..."), g = w;
    } catch (w) {
      console.warn("[seoManager] compute descOverride failed", w);
    }
    try {
      qa(r, l, p, g);
    } catch (w) {
      console.warn("[seoManager] setMetaTags failed", w);
    }
    try {
      Ua(r, c, l, p, g, e);
    } catch (w) {
      console.warn("[seoManager] setStructuredData failed", w);
    }
    const m = Ha();
    l ? m ? document.title = `${m} - ${l}` : document.title = `${e || "Site"} - ${l}` : h ? document.title = h : document.title = e || document.title;
  } catch (h) {
    console.warn("[seoManager] applyPageMeta failed", h);
  }
  try {
    const h = n.querySelector(".nimbi-reading-time");
    if (h && h.remove(), l) {
      const f = Oa(u.raw || ""), p = f && typeof f.minutes == "number" ? Math.ceil(f.minutes) : 0, g = document.createElement("p");
      g.className = "nimbi-reading-time", g.textContent = p ? t("readingTime", { minutes: p }) : "";
      const m = n.querySelector("h1");
      m && m.insertAdjacentElement("afterend", g);
    }
  } catch (h) {
    console.warn("[seoManager] reading time update failed", h);
  }
}
let ye = null, U = null, ke = 1, Fe = (t, e) => e, gt = 0, mt = 0, Bt = () => {
}, ht = 0.25;
function Fa() {
  if (ye && document.contains(ye)) return ye;
  ye = null;
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
    b.target === t && hn();
  }), t.addEventListener("wheel", (b) => {
    if (!te()) return;
    b.preventDefault();
    const A = b.deltaY < 0 ? ht : -ht;
    qe(ke + A), c(), u();
  }, { passive: !1 }), t.addEventListener("keydown", (b) => {
    if (b.key === "Escape") {
      hn();
      return;
    }
    if (ke > 1) {
      const A = t.querySelector(".nimbi-image-preview__image-wrapper");
      if (!A) return;
      const y = 40;
      switch (b.key) {
        case "ArrowUp":
          A.scrollTop -= y, b.preventDefault();
          break;
        case "ArrowDown":
          A.scrollTop += y, b.preventDefault();
          break;
        case "ArrowLeft":
          A.scrollLeft -= y, b.preventDefault();
          break;
        case "ArrowRight":
          A.scrollLeft += y, b.preventDefault();
          break;
      }
    }
  }), document.body.appendChild(t), ye = t, U = t.querySelector("[data-nimbi-preview-image]");
  const e = t.querySelector("[data-nimbi-preview-fit]"), r = t.querySelector("[data-nimbi-preview-original]"), i = t.querySelector("[data-nimbi-preview-zoom-in]"), n = t.querySelector("[data-nimbi-preview-zoom-out]"), s = t.querySelector("[data-nimbi-preview-reset]"), a = t.querySelector("[data-nimbi-preview-close]"), o = t.querySelector("[data-nimbi-preview-zoom-label]"), l = t.querySelector("[data-nimbi-preview-zoom-hud]");
  function c() {
    o && (o.textContent = `${Math.round(ke * 100)}%`);
  }
  const u = () => {
    l && (l.textContent = `${Math.round(ke * 100)}%`, l.classList.add("visible"), clearTimeout(l._timeout), l._timeout = setTimeout(() => l.classList.remove("visible"), 800));
  };
  Bt = c, i.addEventListener("click", () => {
    qe(ke + ht), c(), u();
  }), n.addEventListener("click", () => {
    qe(ke - ht), c(), u();
  }), e.addEventListener("click", () => {
    wt(), c(), u();
  }), r.addEventListener("click", () => {
    qe(1), c(), u();
  }), s.addEventListener("click", () => {
    wt(), c(), u();
  }), a.addEventListener("click", hn), e.title = Fe("imagePreviewFit", "Fit to screen"), r.title = Fe("imagePreviewOriginal", "Original size"), n.title = Fe("imagePreviewZoomOut", "Zoom out"), i.title = Fe("imagePreviewZoomIn", "Zoom in"), a.title = Fe("imagePreviewClose", "Close"), a.setAttribute("aria-label", Fe("imagePreviewClose", "Close"));
  let h = !1, f = 0, p = 0, g = 0, m = 0;
  const w = /* @__PURE__ */ new Map();
  let k = 0, v = 1;
  const D = (b, A) => {
    const y = b.x - A.x, P = b.y - A.y;
    return Math.hypot(y, P);
  }, L = () => {
    h = !1, w.clear(), k = 0, U && (U.style.cursor = "all-scroll");
  };
  let B = 0, I = 0, ee = 0;
  const ne = (b) => {
    const A = Date.now(), y = A - B, P = b.clientX - I, G = b.clientY - ee;
    B = A, I = b.clientX, ee = b.clientY, y < 300 && Math.hypot(P, G) < 30 && (qe(ke > 1 ? 1 : 2), c(), b.preventDefault());
  }, Y = (b) => {
    qe(ke > 1 ? 1 : 2), c(), b.preventDefault();
  }, te = () => ye ? typeof ye.open == "boolean" ? ye.open : ye.classList.contains("is-active") : !1, q = (b, A, y = 1) => {
    if (w.has(y) && w.set(y, { x: b, y: A }), w.size === 2) {
      const Ee = Array.from(w.values()), Se = D(Ee[0], Ee[1]);
      if (k > 0) {
        const we = Se / k;
        qe(v * we);
      }
      return;
    }
    if (!h) return;
    const P = U.closest(".nimbi-image-preview__image-wrapper");
    if (!P) return;
    const G = b - f, re = A - p;
    P.scrollLeft = g - G, P.scrollTop = m - re;
  }, _ = (b, A, y = 1) => {
    if (!te()) return;
    if (w.set(y, { x: b, y: A }), w.size === 2) {
      const re = Array.from(w.values());
      k = D(re[0], re[1]), v = ke;
      return;
    }
    const P = U.closest(".nimbi-image-preview__image-wrapper");
    !P || !(P.scrollWidth > P.clientWidth || P.scrollHeight > P.clientHeight) || (h = !0, f = b, p = A, g = P.scrollLeft, m = P.scrollTop, U.style.cursor = "all-scroll", window.addEventListener("pointermove", M), window.addEventListener("pointerup", T), window.addEventListener("pointercancel", T));
  }, M = (b) => {
    h && (b.preventDefault(), q(b.clientX, b.clientY, b.pointerId));
  }, T = () => {
    L(), window.removeEventListener("pointermove", M), window.removeEventListener("pointerup", T), window.removeEventListener("pointercancel", T);
  };
  U.addEventListener("pointerdown", (b) => {
    b.preventDefault(), _(b.clientX, b.clientY, b.pointerId);
  }), U.addEventListener("pointermove", (b) => {
    (h || w.size === 2) && b.preventDefault(), q(b.clientX, b.clientY, b.pointerId);
  }), U.addEventListener("pointerup", (b) => {
    b.preventDefault(), b.pointerType === "touch" && ne(b), L();
  }), U.addEventListener("dblclick", Y), U.addEventListener("pointercancel", L), U.addEventListener("mousedown", (b) => {
    b.preventDefault(), _(b.clientX, b.clientY, 1);
  }), U.addEventListener("mousemove", (b) => {
    h && b.preventDefault(), q(b.clientX, b.clientY, 1);
  }), U.addEventListener("mouseup", (b) => {
    b.preventDefault(), L();
  });
  const x = t.querySelector(".nimbi-image-preview__image-wrapper");
  return x && (x.addEventListener("pointerdown", (b) => {
    _(b.clientX, b.clientY, b.pointerId);
  }), x.addEventListener("pointermove", (b) => {
    q(b.clientX, b.clientY, b.pointerId);
  }), x.addEventListener("pointerup", L), x.addEventListener("pointercancel", L), x.addEventListener("mousedown", (b) => {
    _(b.clientX, b.clientY, 1);
  }), x.addEventListener("mousemove", (b) => {
    q(b.clientX, b.clientY, 1);
  }), x.addEventListener("mouseup", L)), t;
}
function qe(t) {
  if (!U) return;
  const e = Number(t);
  ke = Number.isFinite(e) ? Math.max(0.1, Math.min(4, e)) : 1;
  const i = U.getBoundingClientRect(), n = gt || U.naturalWidth || U.width || i.width || 0, s = mt || U.naturalHeight || U.height || i.height || 0;
  n && s ? (U.style.maxWidth = "none", U.style.maxHeight = "none", U.style.width = `${n * ke}px`, U.style.height = `${s * ke}px`, U.style.transform = "") : (U.style.maxWidth = "", U.style.maxHeight = "", U.style.width = "", U.style.height = "", U.style.transform = `scale(${ke})`), U && (U.style.cursor = "all-scroll");
}
function wt() {
  if (!U) return;
  const t = U.closest(".nimbi-image-preview__image-wrapper");
  if (!t) return;
  const e = t.getBoundingClientRect();
  if (e.width === 0 || e.height === 0) return;
  const r = gt || U.naturalWidth || e.width, i = mt || U.naturalHeight || e.height;
  if (!r || !i) return;
  const n = e.width / r, s = e.height / i, a = Math.min(n, s, 1);
  qe(Number.isFinite(a) ? a : 1);
}
function Wa(t, e = "", r = 0, i = 0) {
  const n = Fa();
  ke = 1, gt = r || 0, mt = i || 0, U.src = t, U.alt = e, U.style.transform = "scale(1)";
  const s = () => {
    gt = U.naturalWidth || U.width || 0, mt = U.naturalHeight || U.height || 0;
  };
  if (s(), wt(), Bt(), requestAnimationFrame(() => {
    wt(), Bt();
  }), !gt || !mt) {
    const a = () => {
      s(), requestAnimationFrame(() => {
        wt(), Bt();
      }), U.removeEventListener("load", a);
    };
    U.addEventListener("load", a);
  }
  typeof n.showModal == "function" && (n.open || n.showModal()), n.classList.add("is-active"), n.focus();
}
function hn() {
  ye && (typeof ye.close == "function" && ye.open && ye.close(), ye.classList.remove("is-active"));
}
function Za(t, { t: e, zoomStep: r = 0.25 } = {}) {
  if (!t || !t.querySelectorAll) return;
  Fe = (p, g) => (typeof e == "function" ? e(p) : void 0) || g, ht = r, t.addEventListener("click", (p) => {
    const g = (
      /** @type {HTMLElement} */
      p.target
    );
    if (!g || g.tagName !== "IMG") return;
    const m = (
      /** @type {HTMLImageElement} */
      g
    );
    if (m.src) {
      if (p.defaultPrevented !== !0) {
        const w = m.closest("a");
        w && w.getAttribute("href") && p.preventDefault();
      }
      Wa(m.src, m.alt || "", m.naturalWidth || 0, m.naturalHeight || 0);
    }
  });
  let i = !1, n = 0, s = 0, a = 0, o = 0;
  const l = /* @__PURE__ */ new Map();
  let c = 0, u = 1;
  const h = (p, g) => {
    const m = p.x - g.x, w = p.y - g.y;
    return Math.hypot(m, w);
  };
  t.addEventListener("pointerdown", (p) => {
    const g = (
      /** @type {HTMLElement} */
      p.target
    );
    if (!g || g.tagName !== "IMG" || !ye || !ye.open) return;
    if (l.set(p.pointerId, { x: p.clientX, y: p.clientY }), l.size === 2) {
      const w = Array.from(l.values());
      c = h(w[0], w[1]), u = ke;
      return;
    }
    const m = g.closest(".nimbi-image-preview__image-wrapper");
    m && (ke <= 1 || (p.preventDefault(), i = !0, n = p.clientX, s = p.clientY, a = m.scrollLeft, o = m.scrollTop, g.setPointerCapture(p.pointerId), g.style.cursor = "grabbing"));
  }), t.addEventListener("pointermove", (p) => {
    if (l.has(p.pointerId) && l.set(p.pointerId, { x: p.clientX, y: p.clientY }), l.size === 2) {
      p.preventDefault();
      const v = Array.from(l.values()), D = h(v[0], v[1]);
      if (c > 0) {
        const L = D / c;
        qe(u * L);
      }
      return;
    }
    if (!i) return;
    p.preventDefault();
    const m = /** @type {HTMLElement} */ p.target.closest(".nimbi-image-preview__image-wrapper");
    if (!m) return;
    const w = p.clientX - n, k = p.clientY - s;
    m.scrollLeft = a - w, m.scrollTop = o - k;
  });
  const f = () => {
    i = !1, l.clear(), c = 0;
  };
  t.addEventListener("pointerup", f), t.addEventListener("pointercancel", f);
}
function Qa(t) {
  const {
    contentWrap: e,
    navWrap: r,
    container: i,
    mountOverlay: n = null,
    t: s,
    contentBase: a,
    homePage: o,
    initialDocumentTitle: l,
    runHooks: c
  } = t || {};
  if (!e || !(e instanceof HTMLElement))
    throw new TypeError("contentWrap must be an HTMLElement");
  let u = null;
  const h = Sa(s, [{ path: o, name: s("home"), isIndex: !0, children: [] }]);
  async function f(k, v) {
    let D, L, B;
    try {
      ({ data: D, pagePath: L, anchor: B } = await Ti(k, a));
    } catch (_) {
      console.error("[nimbi-cms] fetchPageData failed", _), br(e, s, _);
      return;
    }
    !B && v && (B = v);
    try {
      Sn(null);
    } catch (_) {
      console.warn("[nimbi-cms] scrollToAnchorOrTop failed", _);
    }
    e.innerHTML = "";
    const { article: I, parsed: ee, toc: ne, topH1: Y, h1Text: te, slugKey: q } = await La(s, D, L, B, a);
    ja(s, l, ee, ne, I, L, B, Y, te, q, D), r.innerHTML = "", r.appendChild(ne), $a(ne);
    try {
      await c("transformHtml", { article: I, parsed: ee, toc: ne, pagePath: L, anchor: B, topH1: Y, h1Text: te, slugKey: q, data: D });
    } catch (_) {
      console.warn("[nimbi-cms] transformHtml hooks failed", _);
    }
    e.appendChild(I);
    try {
      Za(I, { t: s });
    } catch (_) {
      console.warn("[nimbi-cms] attachImagePreview failed", _);
    }
    try {
      $t(i, 100, !1), requestAnimationFrame(() => $t(i, 100, !1)), setTimeout(() => $t(i, 100, !1), 250);
    } catch (_) {
      console.warn("[nimbi-cms] setEagerForAboveFoldImages failed", _);
    }
    Sn(B), Pa(I, Y, { mountOverlay: n, container: i, navWrap: r, t: s });
    try {
      await c("onPageLoad", { data: D, pagePath: L, anchor: B, article: I, toc: ne, topH1: Y, h1Text: te, slugKey: q, contentWrap: e, navWrap: r });
    } catch (_) {
      console.warn("[nimbi-cms] onPageLoad hooks failed", _);
    }
    u = L;
  }
  async function p() {
    let k = new URLSearchParams(location.search).get("page") || o;
    const v = location.hash ? decodeURIComponent(location.hash.replace(/^#/, "")) : null;
    try {
      await f(k, v);
    } catch (D) {
      console.warn("[nimbi-cms] renderByQuery failed for", k, D), br(e, s, D);
    }
  }
  window.addEventListener("popstate", p);
  const g = () => `nimbi-cms-scroll:${location.pathname}${location.search}`, m = () => {
    try {
      const k = i || document.querySelector(".nimbi-cms");
      if (!k) return;
      const v = {
        top: k.scrollTop || 0,
        left: k.scrollLeft || 0
      };
      sessionStorage.setItem(g(), JSON.stringify(v));
    } catch {
    }
  }, w = () => {
    try {
      const k = i || document.querySelector(".nimbi-cms");
      if (!k) return;
      const v = sessionStorage.getItem(g());
      if (!v) return;
      const D = JSON.parse(v);
      D && typeof D.top == "number" && k.scrollTo({ top: D.top, left: D.left || 0, behavior: "auto" });
    } catch {
    }
  };
  return window.addEventListener("pageshow", (k) => {
    if (k.persisted)
      try {
        w(), $t(i, 100, !1);
      } catch (v) {
        console.warn("[nimbi-cms] bfcache restore failed", v);
      }
  }), window.addEventListener("pagehide", () => {
    try {
      m();
    } catch (k) {
      console.warn("[nimbi-cms] save scroll position failed", k);
    }
  }), { renderByQuery: p, siteNav: h, getCurrentPagePath: () => u };
}
function Ga(t) {
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
      Number.isInteger(s) && (s === 1 || s === 2) && (i.indexDepth = s);
    }
    if (r.has("noIndexing")) {
      const a = (r.get("noIndexing") || "").split(",").map((o) => o.trim()).filter(Boolean);
      a.length && (i.noIndexing = a);
    }
    return i;
  } catch {
    return {};
  }
}
function Xa(t) {
  return !(typeof t != "string" || !t.trim() || t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t));
}
function xr(t) {
  if (typeof t != "string") return !1;
  const e = t.trim();
  return !(!e || e.includes("/") || e.includes("\\") || e.includes("..") || !/^[A-Za-z0-9._-]+\.(md|html)$/.test(e));
}
let pn = "";
async function al(t = {}) {
  if (!t || typeof t != "object")
    throw new TypeError("initCMS(options): options must be an object");
  const e = Ga();
  if (e && (e.contentPath || e.homePage || e.notFoundPage))
    if (t && t.allowUrlPathOverrides === !0)
      try {
        console.warn("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage");
      } catch (y) {
        console.warn("[nimbi-cms] allowUrlPathOverrides logging failed", y);
      }
    else {
      try {
        console.warn("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage");
      } catch (y) {
        console.warn("[nimbi-cms] logging ignore of URL overrides failed", y);
      }
      delete e.contentPath, delete e.homePage, delete e.notFoundPage;
    }
  const r = Object.assign({}, e, t), {
    el: i,
    contentPath: n = "/content",
    crawlMaxQueue: s = 1e3,
    searchIndex: a = !0,
    searchIndexMode: o = "eager",
    indexDepth: l = 1,
    noIndexing: c = void 0,
    defaultStyle: u = "light",
    bulmaCustomize: h = "none",
    lang: f = void 0,
    l10nFile: p = null,
    cacheTtlMinutes: g = 5,
    cacheMaxEntries: m,
    markdownExtensions: w,
    availableLanguages: k,
    homePage: v = "_home.md",
    notFoundPage: D = "_404.md"
  } = r;
  if (r.contentPath != null && !Xa(r.contentPath))
    throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');
  if (r.homePage != null && !xr(r.homePage))
    throw new TypeError('initCMS(options): "homePage" must be a simple basename ending with .md or .html');
  if (r.notFoundPage != null && !xr(r.notFoundPage))
    throw new TypeError('initCMS(options): "notFoundPage" must be a simple basename ending with .md or .html');
  if (!i)
    throw new Error("el is required");
  let L = i;
  if (typeof i == "string") {
    if (L = document.querySelector(i), !L) throw new Error(`el selector "${i}" did not match any element`);
  } else if (!(i instanceof Element))
    throw new TypeError("el must be a CSS selector string or a DOM element");
  if (typeof n != "string" || !n.trim())
    throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');
  if (typeof a != "boolean")
    throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');
  if (o != null && o !== "eager" && o !== "lazy")
    throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');
  if (l != null && l !== 1 && l !== 2)
    throw new TypeError('initCMS(options): "indexDepth" must be 1 or 2 when provided');
  if (u !== "light" && u !== "dark")
    throw new TypeError('initCMS(options): "defaultStyle" must be "light" or "dark"');
  if (h != null && typeof h != "string")
    throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');
  if (f != null && typeof f != "string")
    throw new TypeError('initCMS(options): "lang" must be a string when provided');
  if (p != null && typeof p != "string")
    throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');
  if (g != null && (typeof g != "number" || !Number.isFinite(g) || g < 0))
    throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');
  if (m != null && (typeof m != "number" || !Number.isInteger(m) || m < 0))
    throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');
  if (w != null && (!Array.isArray(w) || w.some((y) => !y || typeof y != "object")))
    throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');
  if (k != null && (!Array.isArray(k) || k.some((y) => typeof y != "string" || !y.trim())))
    throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');
  if (c != null && (!Array.isArray(c) || c.some((y) => typeof y != "string" || !y.trim())))
    throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');
  if (v != null && (typeof v != "string" || !v.trim() || !/\.(md|html)$/.test(v)))
    throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');
  if (D != null && (typeof D != "string" || !D.trim() || !/\.(md|html)$/.test(D)))
    throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');
  const B = !!a;
  try {
    L.classList.add("nimbi-mount"), L.style.position = L.style.position || "relative", L.style.overflow = L.style.overflow || "hidden";
  } catch (y) {
    console.warn("[nimbi-cms] mount element setup failed", y);
  }
  const I = document.createElement("div");
  I.className = "nimbi-cms";
  try {
    I.style.position = I.style.position || "relative", I.style.overflow = I.style.overflow || "auto";
    try {
      I.style.webkitOverflowScrolling || (I.style.webkitOverflowScrolling = "touch");
    } catch (y) {
      console.warn("[nimbi-cms] set container webkitOverflowScrolling failed", y);
    }
    I.style.width = I.style.width || "100%", I.style.height = I.style.height || "100%", I.style.boxSizing = I.style.boxSizing || "border-box";
  } catch (y) {
    console.warn("[nimbi-cms] container style setup failed", y);
  }
  const ee = document.createElement("div");
  ee.className = "columns";
  const ne = document.createElement("div");
  ne.className = "column is-full-mobile is-3-tablet nimbi-nav-wrap", ne.setAttribute("role", "navigation");
  try {
    const y = typeof ct == "function" ? ct("navigation") : null;
    y && ne.setAttribute("aria-label", y);
  } catch (y) {
    console.warn("[nimbi-cms] set nav aria-label failed", y);
  }
  ee.appendChild(ne);
  const Y = document.createElement("div");
  Y.className = "column nimbi-content", Y.setAttribute("role", "main"), ee.appendChild(Y), I.appendChild(ee);
  const te = ne, q = Y;
  L.appendChild(I);
  let _ = null;
  try {
    _ = L.querySelector(".nimbi-overlay"), _ || (_ = document.createElement("div"), _.className = "nimbi-overlay", L.appendChild(_));
  } catch (y) {
    _ = null, console.warn("[nimbi-cms] mount overlay setup failed", y);
  }
  const M = location.pathname || "/", T = M.endsWith("/") ? M : M.substring(0, M.lastIndexOf("/") + 1);
  try {
    pn = document.title || "";
  } catch (y) {
    pn = "", console.warn("[nimbi-cms] read initial document title failed", y);
  }
  let x = n;
  (x === "." || x === "./") && (x = ""), x.startsWith("./") && (x = x.slice(2)), x.startsWith("/") && (x = x.slice(1)), x !== "" && !x.endsWith("/") && (x = x + "/");
  const b = new URL(T + x, location.origin).toString();
  try {
    gn && gn(v);
  } catch {
  }
  p && await Tr(p, T), k && Array.isArray(k) && Mr(k), f && Cr(f);
  const A = Qa({ contentWrap: q, navWrap: te, container: I, mountOverlay: _, t: ct, contentBase: b, homePage: v, initialDocumentTitle: pn, runHooks: Vn });
  if (typeof g == "number" && g >= 0 && typeof ir == "function" && ir(g * 60 * 1e3), typeof m == "number" && m >= 0 && typeof sr == "function" && sr(m), w && Array.isArray(w) && w.length)
    try {
      w.forEach((y) => {
        typeof y == "object" && xa && typeof kn == "function" && kn(y);
      });
    } catch (y) {
      console.warn("[nimbi-cms] applying markdownExtensions failed", y);
    }
  try {
    typeof s == "number" && Promise.resolve().then(() => zt).then(({ setDefaultCrawlMaxQueue: y }) => {
      try {
        y(s);
      } catch (P) {
        console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed", P);
      }
    });
  } catch (y) {
    console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed", y);
  }
  try {
    Ht(b);
  } catch (y) {
    console.warn("[nimbi-cms] setContentBase failed", y);
  }
  try {
    fn(D);
  } catch (y) {
    console.warn("[nimbi-cms] setNotFoundPage failed", y);
  }
  try {
    Ht(b);
  } catch (y) {
    console.warn("[nimbi-cms] setContentBase failed", y);
  }
  try {
    fn(D);
  } catch (y) {
    console.warn("[nimbi-cms] setNotFoundPage failed", y);
  }
  try {
    await xe(v, b);
  } catch (y) {
    throw v === "_home.md" ? new Error("Required _home.md not found") : new Error(`Required ${v} not found at ${b}${v}: ${y.message}`);
  }
  ai(u), await ii(h, T);
  try {
    const y = document.createElement("header");
    y.className = "nimbi-site-navbar", L.insertBefore(y, I);
    const P = await xe("_navigation.md", b), G = await Zt(P.raw || ""), { navbar: re, linkEls: Ee } = await Ia(y, I, G.html || "", b, v, ct, A.renderByQuery, B, o, l, c);
    try {
      await Vn("onNavBuild", { navWrap: te, navbar: re, linkEls: Ee, contentBase: b });
    } catch (Se) {
      console.warn("[nimbi-cms] onNavBuild hooks failed", Se);
    }
    try {
      const Se = () => {
        const we = y && y.getBoundingClientRect && Math.round(y.getBoundingClientRect().height) || y && y.offsetHeight || 0;
        if (we > 0) {
          try {
            L.style.setProperty("--nimbi-site-navbar-height", `${we}px`);
          } catch (fe) {
            console.warn("[nimbi-cms] set CSS var failed", fe);
          }
          try {
            I.style.paddingTop = "";
          } catch (fe) {
            console.warn("[nimbi-cms] set container paddingTop failed", fe);
          }
          try {
            const fe = L && L.getBoundingClientRect && Math.round(L.getBoundingClientRect().height) || L && L.clientHeight || 0;
            if (fe > 0) {
              const Ae = Math.max(0, fe - we);
              try {
                I.style.boxSizing = "border-box";
              } catch (Ne) {
                console.warn("[nimbi-cms] set container boxSizing failed", Ne);
              }
              try {
                I.style.height = `${Ae}px`;
              } catch (Ne) {
                console.warn("[nimbi-cms] set container height failed", Ne);
              }
              try {
                I.style.setProperty("--nimbi-cms-height", `${Ae}px`);
              } catch (Ne) {
                console.warn("[nimbi-cms] set --nimbi-cms-height failed", Ne);
              }
            } else {
              try {
                I.style.height = "calc(100% - var(--nimbi-site-navbar-height))";
              } catch (Ae) {
                console.warn("[nimbi-cms] set container height failed", Ae);
              }
              try {
                I.style.setProperty("--nimbi-cms-height", "calc(100% - var(--nimbi-site-navbar-height))");
              } catch (Ae) {
                console.warn("[nimbi-cms] set --nimbi-cms-height failed", Ae);
              }
            }
          } catch (fe) {
            console.warn("[nimbi-cms] compute container height failed", fe);
          }
          try {
            y.style.setProperty("--nimbi-site-navbar-height", `${we}px`);
          } catch (fe) {
            console.warn("[nimbi-cms] set navbar CSS var failed", fe);
          }
        }
      };
      Se();
      try {
        if (typeof ResizeObserver < "u") {
          const we = new ResizeObserver(() => Se());
          try {
            we.observe(y);
          } catch (fe) {
            console.warn("[nimbi-cms] ResizeObserver.observe failed", fe);
          }
        }
      } catch (we) {
        console.warn("[nimbi-cms] ResizeObserver setup failed", we);
      }
    } catch (Se) {
      console.warn("[nimbi-cms] compute navbar height failed", Se);
    }
  } catch (y) {
    console.warn("[nimbi-cms] build navigation failed", y);
  }
  await A.renderByQuery();
  try {
    Promise.resolve().then(() => Ka).then(({ getVersion: y }) => {
      typeof y == "function" && y().then((P) => {
        try {
          const G = P || "0.0.0", re = document.createElement("div");
          re.className = "nimbi-version-label", re.textContent = `Ninbi CMS v. ${G}`, re.style.position = "absolute", re.style.left = "8px", re.style.bottom = "6px", re.style.fontSize = "11px", re.style.opacity = "0.6", re.style.pointerEvents = "none", re.style.zIndex = "9999", re.style.userSelect = "none";
          try {
            L.appendChild(re);
          } catch (Ee) {
            console.warn("[nimbi-cms] append version label failed", Ee);
          }
        } catch (G) {
          console.warn("[nimbi-cms] building version label failed", G);
        }
      }).catch((P) => {
        console.warn("[nimbi-cms] getVersion() failed", P);
      });
    }).catch((y) => {
      console.warn("[nimbi-cms] import version module failed", y);
    });
  } catch (y) {
    console.warn("[nimbi-cms] version label setup failed", y);
  }
}
async function Ya() {
  try {
    let t = null;
    try {
      t = await Promise.resolve().then(() => Sr);
    } catch {
      try {
        t = await Promise.resolve().then(() => Sr);
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
const Ka = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getVersion: Ya
}, Symbol.toStringTag, { value: "Module" })), rs = "nimbi-cms", ss = "0.1.0", is = "module", as = { dev: "vite", "dev:example": 'sh -c "npm run build -- --outDir example/dist --config vite.config.js && vite example --port 5173 &"', build: "vite build --config vite.config.js", "build:lib": "vite build --config vite.config.js", "build:analyze": "ANALYZE=1 vite build --config vite.config.js", preview: "vite preview", test: "npx vitest run", "gen-dts": "node scripts/gen-dts.js", "check-dts": "npx tsc --noEmit src/index.d.ts --lib es2015,dom --skipLibCheck", "type-test": "npx tsd", docs: "typedoc --options typedoc.json" }, ls = { bulma: "^1.0.4", "highlight.js": "^11.11.1", marked: "^17.0.4" }, os = { "@vitest/coverage-v8": "^4.0.18", "comment-parser": "^0.7.6", eslint: "^10.0.3", "eslint-plugin-unused-imports": "^4.4.1", glob: "^10.4.1", jsdom: "^28.1.0", "reading-time": "^1.5.0", terser: "^5.17.0", typedoc: "^0.28.17", typescript: "^5.9.3", tsd: "^0.33.0", vite: "^7.3.1", "rollup-plugin-visualizer": "^5.8.0", "vite-plugin-restart": "^2.0.0", vitest: "^4.0.18" }, cs = "dist/nimbi-cms.cjs.js", us = "dist/nimbi-cms.es.js", hs = "src/index.d.ts", ps = "dist/nimbi-cms.js", ds = ["dist", "src/index.d.ts"], Va = {
  name: rs,
  version: ss,
  private: !0,
  type: is,
  scripts: as,
  dependencies: ls,
  devDependencies: os,
  main: cs,
  module: us,
  types: hs,
  unpkg: ps,
  files: ds
}, Sr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Va,
  dependencies: ls,
  devDependencies: os,
  files: ds,
  main: cs,
  module: us,
  name: rs,
  scripts: as,
  type: is,
  types: hs,
  unpkg: ps,
  version: ss
}, Symbol.toStringTag, { value: "Module" }));
export {
  Er as BAD_LANGUAGES,
  K as SUPPORTED_HLJS_MAP,
  rl as _clearHooks,
  vn as addHook,
  al as default,
  ii as ensureBulma,
  Ya as getVersion,
  Tr as loadL10nFile,
  Ar as loadSupportedLanguages,
  ri as observeCodeBlocks,
  tl as onNavBuild,
  el as onPageLoad,
  yt as registerLanguage,
  Vn as runHooks,
  sl as setHighlightTheme,
  Cr as setLang,
  ai as setStyle,
  il as setThemeVars,
  ct as t,
  nl as transformHtml
};
