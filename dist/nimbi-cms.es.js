const Qt = {
  onPageLoad: [],
  onNavBuild: [],
  transformHtml: []
};
function or(e, t) {
  if (!Object.prototype.hasOwnProperty.call(Qt, e))
    throw new Error('Unknown hook "' + e + '"');
  if (typeof t != "function")
    throw new TypeError("hook callback must be a function");
  Qt[e].push(t);
}
function nl(e) {
  or("onPageLoad", e);
}
function rl(e) {
  or("onNavBuild", e);
}
function il(e) {
  or("transformHtml", e);
}
async function qr(e, t) {
  const n = Qt[e] || [];
  for (const i of n)
    try {
      await i(t);
    } catch (r) {
      console.warn("[nimbi-cms] runHooks callback failed", r);
    }
}
function al() {
  Object.keys(Qt).forEach((e) => {
    Qt[e].length = 0;
  });
}
function fi(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var qn, jr;
function Ta() {
  if (jr) return qn;
  jr = 1;
  function e(_) {
    return _ instanceof Map ? _.clear = _.delete = _.set = function() {
      throw new Error("map is read-only");
    } : _ instanceof Set && (_.add = _.clear = _.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(_), Object.getOwnPropertyNames(_).forEach((E) => {
      const O = _[E], le = typeof O;
      (le === "object" || le === "function") && !Object.isFrozen(O) && e(O);
    }), _;
  }
  class t {
    /**
     * @param {CompiledMode} mode
     */
    constructor(E) {
      E.data === void 0 && (E.data = {}), this.data = E.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  }
  function n(_) {
    return _.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function i(_, ...E) {
    const O = /* @__PURE__ */ Object.create(null);
    for (const le in _)
      O[le] = _[le];
    return E.forEach(function(le) {
      for (const Te in le)
        O[Te] = le[Te];
    }), /** @type {T} */
    O;
  }
  const r = "</span>", a = (_) => !!_.scope, s = (_, { prefix: E }) => {
    if (_.startsWith("language:"))
      return _.replace("language:", "language-");
    if (_.includes(".")) {
      const O = _.split(".");
      return [
        `${E}${O.shift()}`,
        ...O.map((le, Te) => `${le}${"_".repeat(Te + 1)}`)
      ].join(" ");
    }
    return `${E}${_}`;
  };
  class c {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(E, O) {
      this.buffer = "", this.classPrefix = O.classPrefix, E.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(E) {
      this.buffer += n(E);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(E) {
      if (!a(E)) return;
      const O = s(
        E.scope,
        { prefix: this.classPrefix }
      );
      this.span(O);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(E) {
      a(E) && (this.buffer += r);
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
    span(E) {
      this.buffer += `<span class="${E}">`;
    }
  }
  const l = (_ = {}) => {
    const E = { children: [] };
    return Object.assign(E, _), E;
  };
  class d {
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
    add(E) {
      this.top.children.push(E);
    }
    /** @param {string} scope */
    openNode(E) {
      const O = l({ scope: E });
      this.add(O), this.stack.push(O);
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
    walk(E) {
      return this.constructor._walk(E, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(E, O) {
      return typeof O == "string" ? E.addText(O) : O.children && (E.openNode(O), O.children.forEach((le) => this._walk(E, le)), E.closeNode(O)), E;
    }
    /**
     * @param {Node} node
     */
    static _collapse(E) {
      typeof E != "string" && E.children && (E.children.every((O) => typeof O == "string") ? E.children = [E.children.join("")] : E.children.forEach((O) => {
        d._collapse(O);
      }));
    }
  }
  class o extends d {
    /**
     * @param {*} options
     */
    constructor(E) {
      super(), this.options = E;
    }
    /**
     * @param {string} text
     */
    addText(E) {
      E !== "" && this.add(E);
    }
    /** @param {string} scope */
    startScope(E) {
      this.openNode(E);
    }
    endScope() {
      this.closeNode();
    }
    /**
     * @param {Emitter & {root: DataNode}} emitter
     * @param {string} name
     */
    __addSublanguage(E, O) {
      const le = E.root;
      O && (le.scope = `language:${O}`), this.add(le);
    }
    toHTML() {
      return new c(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function u(_) {
    return _ ? typeof _ == "string" ? _ : _.source : null;
  }
  function f(_) {
    return m("(?=", _, ")");
  }
  function h(_) {
    return m("(?:", _, ")*");
  }
  function w(_) {
    return m("(?:", _, ")?");
  }
  function m(..._) {
    return _.map((O) => u(O)).join("");
  }
  function p(_) {
    const E = _[_.length - 1];
    return typeof E == "object" && E.constructor === Object ? (_.splice(_.length - 1, 1), E) : {};
  }
  function g(..._) {
    return "(" + (p(_).capture ? "" : "?:") + _.map((le) => u(le)).join("|") + ")";
  }
  function y(_) {
    return new RegExp(_.toString() + "|").exec("").length - 1;
  }
  function b(_, E) {
    const O = _ && _.exec(E);
    return O && O.index === 0;
  }
  const k = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function S(_, { joinWith: E }) {
    let O = 0;
    return _.map((le) => {
      O += 1;
      const Te = O;
      let Ce = u(le), Q = "";
      for (; Ce.length > 0; ) {
        const W = k.exec(Ce);
        if (!W) {
          Q += Ce;
          break;
        }
        Q += Ce.substring(0, W.index), Ce = Ce.substring(W.index + W[0].length), W[0][0] === "\\" && W[1] ? Q += "\\" + String(Number(W[1]) + Te) : (Q += W[0], W[0] === "(" && O++);
      }
      return Q;
    }).map((le) => `(${le})`).join(E);
  }
  const v = /\b\B/, M = "[a-zA-Z]\\w*", q = "[a-zA-Z_]\\w*", $ = "\\b\\d+(\\.\\d+)?", F = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", he = "\\b(0b[01]+)", A = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", U = (_ = {}) => {
    const E = /^#![ ]*\//;
    return _.binary && (_.begin = m(
      E,
      /.*\b/,
      _.binary,
      /\b.*/
    )), i({
      scope: "meta",
      begin: E,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (O, le) => {
        O.index !== 0 && le.ignoreMatch();
      }
    }, _);
  }, de = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, oe = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [de]
  }, R = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [de]
  }, T = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, ie = function(_, E, O = {}) {
    const le = i(
      {
        scope: "comment",
        begin: _,
        end: E,
        contains: []
      },
      O
    );
    le.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const Te = g(
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
    return le.contains.push(
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
          Te,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), le;
  }, G = ie("//", "$"), ae = ie("/\\*", "\\*/"), ve = ie("#", "$"), fe = {
    scope: "number",
    begin: $,
    relevance: 0
  }, L = {
    scope: "number",
    begin: F,
    relevance: 0
  }, C = {
    scope: "number",
    begin: he,
    relevance: 0
  }, B = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      de,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [de]
      }
    ]
  }, I = {
    scope: "title",
    begin: M,
    relevance: 0
  }, z = {
    scope: "title",
    begin: q,
    relevance: 0
  }, x = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + q,
    relevance: 0
  };
  var X = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: oe,
    BACKSLASH_ESCAPE: de,
    BINARY_NUMBER_MODE: C,
    BINARY_NUMBER_RE: he,
    COMMENT: ie,
    C_BLOCK_COMMENT_MODE: ae,
    C_LINE_COMMENT_MODE: G,
    C_NUMBER_MODE: L,
    C_NUMBER_RE: F,
    END_SAME_AS_BEGIN: function(_) {
      return Object.assign(
        _,
        {
          /** @type {ModeCallback} */
          "on:begin": (E, O) => {
            O.data._beginMatch = E[1];
          },
          /** @type {ModeCallback} */
          "on:end": (E, O) => {
            O.data._beginMatch !== E[1] && O.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: ve,
    IDENT_RE: M,
    MATCH_NOTHING_RE: v,
    METHOD_GUARD: x,
    NUMBER_MODE: fe,
    NUMBER_RE: $,
    PHRASAL_WORDS_MODE: T,
    QUOTE_STRING_MODE: R,
    REGEXP_MODE: B,
    RE_STARTERS_RE: A,
    SHEBANG: U,
    TITLE_MODE: I,
    UNDERSCORE_IDENT_RE: q,
    UNDERSCORE_TITLE_MODE: z
  });
  function ne(_, E) {
    _.input[_.index - 1] === "." && E.ignoreMatch();
  }
  function V(_, E) {
    _.className !== void 0 && (_.scope = _.className, delete _.className);
  }
  function ue(_, E) {
    E && _.beginKeywords && (_.begin = "\\b(" + _.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", _.__beforeBegin = ne, _.keywords = _.keywords || _.beginKeywords, delete _.beginKeywords, _.relevance === void 0 && (_.relevance = 0));
  }
  function re(_, E) {
    Array.isArray(_.illegal) && (_.illegal = g(..._.illegal));
  }
  function Z(_, E) {
    if (_.match) {
      if (_.begin || _.end) throw new Error("begin & end are not supported with match");
      _.begin = _.match, delete _.match;
    }
  }
  function xe(_, E) {
    _.relevance === void 0 && (_.relevance = 1);
  }
  const gt = (_, E) => {
    if (!_.beforeMatch) return;
    if (_.starts) throw new Error("beforeMatch cannot be used with starts");
    const O = Object.assign({}, _);
    Object.keys(_).forEach((le) => {
      delete _[le];
    }), _.keywords = O.keywords, _.begin = m(O.beforeMatch, f(O.begin)), _.starts = {
      relevance: 0,
      contains: [
        Object.assign(O, { endsParent: !0 })
      ]
    }, _.relevance = 0, delete O.beforeMatch;
  }, vt = [
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
  ], Pn = "keyword";
  function vr(_, E, O = Pn) {
    const le = /* @__PURE__ */ Object.create(null);
    return typeof _ == "string" ? Te(O, _.split(" ")) : Array.isArray(_) ? Te(O, _) : Object.keys(_).forEach(function(Ce) {
      Object.assign(
        le,
        vr(_[Ce], E, Ce)
      );
    }), le;
    function Te(Ce, Q) {
      E && (Q = Q.map((W) => W.toLowerCase())), Q.forEach(function(W) {
        const se = W.split("|");
        le[se[0]] = [Ce, ta(se[0], se[1])];
      });
    }
  }
  function ta(_, E) {
    return E ? Number(E) : na(_) ? 0 : 1;
  }
  function na(_) {
    return vt.includes(_.toLowerCase());
  }
  const Ar = {}, mt = (_) => {
    console.error(_);
  }, Er = (_, ...E) => {
    console.log(`WARN: ${_}`, ...E);
  }, At = (_, E) => {
    Ar[`${_}/${E}`] || (console.log(`Deprecated as of ${_}. ${E}`), Ar[`${_}/${E}`] = !0);
  }, rn = new Error();
  function Lr(_, E, { key: O }) {
    let le = 0;
    const Te = _[O], Ce = {}, Q = {};
    for (let W = 1; W <= E.length; W++)
      Q[W + le] = Te[W], Ce[W + le] = !0, le += y(E[W - 1]);
    _[O] = Q, _[O]._emit = Ce, _[O]._multi = !0;
  }
  function ra(_) {
    if (Array.isArray(_.begin)) {
      if (_.skip || _.excludeBegin || _.returnBegin)
        throw mt("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), rn;
      if (typeof _.beginScope != "object" || _.beginScope === null)
        throw mt("beginScope must be object"), rn;
      Lr(_, _.begin, { key: "beginScope" }), _.begin = S(_.begin, { joinWith: "" });
    }
  }
  function ia(_) {
    if (Array.isArray(_.end)) {
      if (_.skip || _.excludeEnd || _.returnEnd)
        throw mt("skip, excludeEnd, returnEnd not compatible with endScope: {}"), rn;
      if (typeof _.endScope != "object" || _.endScope === null)
        throw mt("endScope must be object"), rn;
      Lr(_, _.end, { key: "endScope" }), _.end = S(_.end, { joinWith: "" });
    }
  }
  function aa(_) {
    _.scope && typeof _.scope == "object" && _.scope !== null && (_.beginScope = _.scope, delete _.scope);
  }
  function sa(_) {
    aa(_), typeof _.beginScope == "string" && (_.beginScope = { _wrap: _.beginScope }), typeof _.endScope == "string" && (_.endScope = { _wrap: _.endScope }), ra(_), ia(_);
  }
  function oa(_) {
    function E(Q, W) {
      return new RegExp(
        u(Q),
        "m" + (_.case_insensitive ? "i" : "") + (_.unicodeRegex ? "u" : "") + (W ? "g" : "")
      );
    }
    class O {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(W, se) {
        se.position = this.position++, this.matchIndexes[this.matchAt] = se, this.regexes.push([se, W]), this.matchAt += y(W) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const W = this.regexes.map((se) => se[1]);
        this.matcherRe = E(S(W, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(W) {
        this.matcherRe.lastIndex = this.lastIndex;
        const se = this.matcherRe.exec(W);
        if (!se)
          return null;
        const Oe = se.findIndex((Ct, zn) => zn > 0 && Ct !== void 0), Pe = this.matchIndexes[Oe];
        return se.splice(0, Oe), Object.assign(se, Pe);
      }
    }
    class le {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(W) {
        if (this.multiRegexes[W]) return this.multiRegexes[W];
        const se = new O();
        return this.rules.slice(W).forEach(([Oe, Pe]) => se.addRule(Oe, Pe)), se.compile(), this.multiRegexes[W] = se, se;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(W, se) {
        this.rules.push([W, se]), se.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(W) {
        const se = this.getMatcher(this.regexIndex);
        se.lastIndex = this.lastIndex;
        let Oe = se.exec(W);
        if (this.resumingScanAtSamePosition() && !(Oe && Oe.index === this.lastIndex)) {
          const Pe = this.getMatcher(0);
          Pe.lastIndex = this.lastIndex + 1, Oe = Pe.exec(W);
        }
        return Oe && (this.regexIndex += Oe.position + 1, this.regexIndex === this.count && this.considerAll()), Oe;
      }
    }
    function Te(Q) {
      const W = new le();
      return Q.contains.forEach((se) => W.addRule(se.begin, { rule: se, type: "begin" })), Q.terminatorEnd && W.addRule(Q.terminatorEnd, { type: "end" }), Q.illegal && W.addRule(Q.illegal, { type: "illegal" }), W;
    }
    function Ce(Q, W) {
      const se = (
        /** @type CompiledMode */
        Q
      );
      if (Q.isCompiled) return se;
      [
        V,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        Z,
        sa,
        gt
      ].forEach((Pe) => Pe(Q, W)), _.compilerExtensions.forEach((Pe) => Pe(Q, W)), Q.__beforeBegin = null, [
        ue,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        re,
        // default to 1 relevance if not specified
        xe
      ].forEach((Pe) => Pe(Q, W)), Q.isCompiled = !0;
      let Oe = null;
      return typeof Q.keywords == "object" && Q.keywords.$pattern && (Q.keywords = Object.assign({}, Q.keywords), Oe = Q.keywords.$pattern, delete Q.keywords.$pattern), Oe = Oe || /\w+/, Q.keywords && (Q.keywords = vr(Q.keywords, _.case_insensitive)), se.keywordPatternRe = E(Oe, !0), W && (Q.begin || (Q.begin = /\B|\b/), se.beginRe = E(se.begin), !Q.end && !Q.endsWithParent && (Q.end = /\B|\b/), Q.end && (se.endRe = E(se.end)), se.terminatorEnd = u(se.end) || "", Q.endsWithParent && W.terminatorEnd && (se.terminatorEnd += (Q.end ? "|" : "") + W.terminatorEnd)), Q.illegal && (se.illegalRe = E(
        /** @type {RegExp | string} */
        Q.illegal
      )), Q.contains || (Q.contains = []), Q.contains = [].concat(...Q.contains.map(function(Pe) {
        return la(Pe === "self" ? Q : Pe);
      })), Q.contains.forEach(function(Pe) {
        Ce(
          /** @type Mode */
          Pe,
          se
        );
      }), Q.starts && Ce(Q.starts, W), se.matcher = Te(se), se;
    }
    if (_.compilerExtensions || (_.compilerExtensions = []), _.contains && _.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return _.classNameAliases = i(_.classNameAliases || {}), Ce(
      /** @type Mode */
      _
    );
  }
  function Mr(_) {
    return _ ? _.endsWithParent || Mr(_.starts) : !1;
  }
  function la(_) {
    return _.variants && !_.cachedVariants && (_.cachedVariants = _.variants.map(function(E) {
      return i(_, { variants: null }, E);
    })), _.cachedVariants ? _.cachedVariants : Mr(_) ? i(_, { starts: _.starts ? i(_.starts) : null }) : Object.isFrozen(_) ? i(_) : _;
  }
  var ca = "11.11.1";
  class ua extends Error {
    constructor(E, O) {
      super(E), this.name = "HTMLInjectionError", this.html = O;
    }
  }
  const $n = n, Rr = i, Tr = /* @__PURE__ */ Symbol("nomatch"), ha = 7, Cr = function(_) {
    const E = /* @__PURE__ */ Object.create(null), O = /* @__PURE__ */ Object.create(null), le = [];
    let Te = !0;
    const Ce = "Could not find the language '{}', did you forget to load/include a language module?", Q = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let W = {
      ignoreUnescapedHTML: !1,
      throwUnescapedHTML: !1,
      noHighlightRe: /^(no-?highlight)$/i,
      languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
      classPrefix: "hljs-",
      cssSelector: "pre code",
      languages: null,
      // beta configuration options, subject to change, welcome to discuss
      // https://github.com/highlightjs/highlight.js/issues/1086
      __emitter: o
    };
    function se(P) {
      return W.noHighlightRe.test(P);
    }
    function Oe(P) {
      let Y = P.className + " ";
      Y += P.parentNode ? P.parentNode.className : "";
      const we = W.languageDetectRe.exec(Y);
      if (we) {
        const Ae = at(we[1]);
        return Ae || (Er(Ce.replace("{}", we[1])), Er("Falling back to no-highlight mode for this block.", P)), Ae ? we[1] : "no-highlight";
      }
      return Y.split(/\s+/).find((Ae) => se(Ae) || at(Ae));
    }
    function Pe(P, Y, we) {
      let Ae = "", ze = "";
      typeof Y == "object" ? (Ae = P, we = Y.ignoreIllegals, ze = Y.language) : (At("10.7.0", "highlight(lang, code, ...args) has been deprecated."), At("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), ze = P, Ae = Y), we === void 0 && (we = !0);
      const Qe = {
        code: Ae,
        language: ze
      };
      sn("before:highlight", Qe);
      const st = Qe.result ? Qe.result : Ct(Qe.language, Qe.code, we);
      return st.code = Qe.code, sn("after:highlight", st), st;
    }
    function Ct(P, Y, we, Ae) {
      const ze = /* @__PURE__ */ Object.create(null);
      function Qe(D, K) {
        return D.keywords[K];
      }
      function st() {
        if (!ce.keywords) {
          Be.addText(Ee);
          return;
        }
        let D = 0;
        ce.keywordPatternRe.lastIndex = 0;
        let K = ce.keywordPatternRe.exec(Ee), pe = "";
        for (; K; ) {
          pe += Ee.substring(D, K.index);
          const Se = Ye.case_insensitive ? K[0].toLowerCase() : K[0], Ne = Qe(ce, Se);
          if (Ne) {
            const [rt, Ma] = Ne;
            if (Be.addText(pe), pe = "", ze[Se] = (ze[Se] || 0) + 1, ze[Se] <= ha && (cn += Ma), rt.startsWith("_"))
              pe += K[0];
            else {
              const Ra = Ye.classNameAliases[rt] || rt;
              Ve(K[0], Ra);
            }
          } else
            pe += K[0];
          D = ce.keywordPatternRe.lastIndex, K = ce.keywordPatternRe.exec(Ee);
        }
        pe += Ee.substring(D), Be.addText(pe);
      }
      function on() {
        if (Ee === "") return;
        let D = null;
        if (typeof ce.subLanguage == "string") {
          if (!E[ce.subLanguage]) {
            Be.addText(Ee);
            return;
          }
          D = Ct(ce.subLanguage, Ee, !0, Dr[ce.subLanguage]), Dr[ce.subLanguage] = /** @type {CompiledMode} */
          D._top;
        } else
          D = In(Ee, ce.subLanguage.length ? ce.subLanguage : null);
        ce.relevance > 0 && (cn += D.relevance), Be.__addSublanguage(D._emitter, D.language);
      }
      function Ue() {
        ce.subLanguage != null ? on() : st(), Ee = "";
      }
      function Ve(D, K) {
        D !== "" && (Be.startScope(K), Be.addText(D), Be.endScope());
      }
      function Ir(D, K) {
        let pe = 1;
        const Se = K.length - 1;
        for (; pe <= Se; ) {
          if (!D._emit[pe]) {
            pe++;
            continue;
          }
          const Ne = Ye.classNameAliases[D[pe]] || D[pe], rt = K[pe];
          Ne ? Ve(rt, Ne) : (Ee = rt, st(), Ee = ""), pe++;
        }
      }
      function Or(D, K) {
        return D.scope && typeof D.scope == "string" && Be.openNode(Ye.classNameAliases[D.scope] || D.scope), D.beginScope && (D.beginScope._wrap ? (Ve(Ee, Ye.classNameAliases[D.beginScope._wrap] || D.beginScope._wrap), Ee = "") : D.beginScope._multi && (Ir(D.beginScope, K), Ee = "")), ce = Object.create(D, { parent: { value: ce } }), ce;
      }
      function Br(D, K, pe) {
        let Se = b(D.endRe, pe);
        if (Se) {
          if (D["on:end"]) {
            const Ne = new t(D);
            D["on:end"](K, Ne), Ne.isMatchIgnored && (Se = !1);
          }
          if (Se) {
            for (; D.endsParent && D.parent; )
              D = D.parent;
            return D;
          }
        }
        if (D.endsWithParent)
          return Br(D.parent, K, pe);
      }
      function Sa(D) {
        return ce.matcher.regexIndex === 0 ? (Ee += D[0], 1) : (Dn = !0, 0);
      }
      function va(D) {
        const K = D[0], pe = D.rule, Se = new t(pe), Ne = [pe.__beforeBegin, pe["on:begin"]];
        for (const rt of Ne)
          if (rt && (rt(D, Se), Se.isMatchIgnored))
            return Sa(K);
        return pe.skip ? Ee += K : (pe.excludeBegin && (Ee += K), Ue(), !pe.returnBegin && !pe.excludeBegin && (Ee = K)), Or(pe, D), pe.returnBegin ? 0 : K.length;
      }
      function Aa(D) {
        const K = D[0], pe = Y.substring(D.index), Se = Br(ce, D, pe);
        if (!Se)
          return Tr;
        const Ne = ce;
        ce.endScope && ce.endScope._wrap ? (Ue(), Ve(K, ce.endScope._wrap)) : ce.endScope && ce.endScope._multi ? (Ue(), Ir(ce.endScope, D)) : Ne.skip ? Ee += K : (Ne.returnEnd || Ne.excludeEnd || (Ee += K), Ue(), Ne.excludeEnd && (Ee = K));
        do
          ce.scope && Be.closeNode(), !ce.skip && !ce.subLanguage && (cn += ce.relevance), ce = ce.parent;
        while (ce !== Se.parent);
        return Se.starts && Or(Se.starts, D), Ne.returnEnd ? 0 : K.length;
      }
      function Ea() {
        const D = [];
        for (let K = ce; K !== Ye; K = K.parent)
          K.scope && D.unshift(K.scope);
        D.forEach((K) => Be.openNode(K));
      }
      let ln = {};
      function Nr(D, K) {
        const pe = K && K[0];
        if (Ee += D, pe == null)
          return Ue(), 0;
        if (ln.type === "begin" && K.type === "end" && ln.index === K.index && pe === "") {
          if (Ee += Y.slice(K.index, K.index + 1), !Te) {
            const Se = new Error(`0 width match regex (${P})`);
            throw Se.languageName = P, Se.badRule = ln.rule, Se;
          }
          return 1;
        }
        if (ln = K, K.type === "begin")
          return va(K);
        if (K.type === "illegal" && !we) {
          const Se = new Error('Illegal lexeme "' + pe + '" for mode "' + (ce.scope || "<unnamed>") + '"');
          throw Se.mode = ce, Se;
        } else if (K.type === "end") {
          const Se = Aa(K);
          if (Se !== Tr)
            return Se;
        }
        if (K.type === "illegal" && pe === "")
          return Ee += `
`, 1;
        if (Nn > 1e5 && Nn > K.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return Ee += pe, pe.length;
      }
      const Ye = at(P);
      if (!Ye)
        throw mt(Ce.replace("{}", P)), new Error('Unknown language: "' + P + '"');
      const La = oa(Ye);
      let Bn = "", ce = Ae || La;
      const Dr = {}, Be = new W.__emitter(W);
      Ea();
      let Ee = "", cn = 0, wt = 0, Nn = 0, Dn = !1;
      try {
        if (Ye.__emitTokens)
          Ye.__emitTokens(Y, Be);
        else {
          for (ce.matcher.considerAll(); ; ) {
            Nn++, Dn ? Dn = !1 : ce.matcher.considerAll(), ce.matcher.lastIndex = wt;
            const D = ce.matcher.exec(Y);
            if (!D) break;
            const K = Y.substring(wt, D.index), pe = Nr(K, D);
            wt = D.index + pe;
          }
          Nr(Y.substring(wt));
        }
        return Be.finalize(), Bn = Be.toHTML(), {
          language: P,
          value: Bn,
          relevance: cn,
          illegal: !1,
          _emitter: Be,
          _top: ce
        };
      } catch (D) {
        if (D.message && D.message.includes("Illegal"))
          return {
            language: P,
            value: $n(Y),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: D.message,
              index: wt,
              context: Y.slice(wt - 100, wt + 100),
              mode: D.mode,
              resultSoFar: Bn
            },
            _emitter: Be
          };
        if (Te)
          return {
            language: P,
            value: $n(Y),
            illegal: !1,
            relevance: 0,
            errorRaised: D,
            _emitter: Be,
            _top: ce
          };
        throw D;
      }
    }
    function zn(P) {
      const Y = {
        value: $n(P),
        illegal: !1,
        relevance: 0,
        _top: Q,
        _emitter: new W.__emitter(W)
      };
      return Y._emitter.addText(P), Y;
    }
    function In(P, Y) {
      Y = Y || W.languages || Object.keys(E);
      const we = zn(P), Ae = Y.filter(at).filter(zr).map(
        (Ue) => Ct(Ue, P, !1)
      );
      Ae.unshift(we);
      const ze = Ae.sort((Ue, Ve) => {
        if (Ue.relevance !== Ve.relevance) return Ve.relevance - Ue.relevance;
        if (Ue.language && Ve.language) {
          if (at(Ue.language).supersetOf === Ve.language)
            return 1;
          if (at(Ve.language).supersetOf === Ue.language)
            return -1;
        }
        return 0;
      }), [Qe, st] = ze, on = Qe;
      return on.secondBest = st, on;
    }
    function da(P, Y, we) {
      const Ae = Y && O[Y] || we;
      P.classList.add("hljs"), P.classList.add(`language-${Ae}`);
    }
    function On(P) {
      let Y = null;
      const we = Oe(P);
      if (se(we)) return;
      if (sn(
        "before:highlightElement",
        { el: P, language: we }
      ), P.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", P);
        return;
      }
      if (P.children.length > 0 && (W.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(P)), W.throwUnescapedHTML))
        throw new ua(
          "One of your code blocks includes unescaped HTML.",
          P.innerHTML
        );
      Y = P;
      const Ae = Y.textContent, ze = we ? Pe(Ae, { language: we, ignoreIllegals: !0 }) : In(Ae);
      P.innerHTML = ze.value, P.dataset.highlighted = "yes", da(P, we, ze.language), P.result = {
        language: ze.language,
        // TODO: remove with version 11.0
        re: ze.relevance,
        relevance: ze.relevance
      }, ze.secondBest && (P.secondBest = {
        language: ze.secondBest.language,
        relevance: ze.secondBest.relevance
      }), sn("after:highlightElement", { el: P, result: ze, text: Ae });
    }
    function fa(P) {
      W = Rr(W, P);
    }
    const pa = () => {
      an(), At("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function ga() {
      an(), At("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let Pr = !1;
    function an() {
      function P() {
        an();
      }
      if (document.readyState === "loading") {
        Pr || window.addEventListener("DOMContentLoaded", P, !1), Pr = !0;
        return;
      }
      document.querySelectorAll(W.cssSelector).forEach(On);
    }
    function ma(P, Y) {
      let we = null;
      try {
        we = Y(_);
      } catch (Ae) {
        if (mt("Language definition for '{}' could not be registered.".replace("{}", P)), Te)
          mt(Ae);
        else
          throw Ae;
        we = Q;
      }
      we.name || (we.name = P), E[P] = we, we.rawDefinition = Y.bind(null, _), we.aliases && $r(we.aliases, { languageName: P });
    }
    function wa(P) {
      delete E[P];
      for (const Y of Object.keys(O))
        O[Y] === P && delete O[Y];
    }
    function ya() {
      return Object.keys(E);
    }
    function at(P) {
      return P = (P || "").toLowerCase(), E[P] || E[O[P]];
    }
    function $r(P, { languageName: Y }) {
      typeof P == "string" && (P = [P]), P.forEach((we) => {
        O[we.toLowerCase()] = Y;
      });
    }
    function zr(P) {
      const Y = at(P);
      return Y && !Y.disableAutodetect;
    }
    function ba(P) {
      P["before:highlightBlock"] && !P["before:highlightElement"] && (P["before:highlightElement"] = (Y) => {
        P["before:highlightBlock"](
          Object.assign({ block: Y.el }, Y)
        );
      }), P["after:highlightBlock"] && !P["after:highlightElement"] && (P["after:highlightElement"] = (Y) => {
        P["after:highlightBlock"](
          Object.assign({ block: Y.el }, Y)
        );
      });
    }
    function _a(P) {
      ba(P), le.push(P);
    }
    function ka(P) {
      const Y = le.indexOf(P);
      Y !== -1 && le.splice(Y, 1);
    }
    function sn(P, Y) {
      const we = P;
      le.forEach(function(Ae) {
        Ae[we] && Ae[we](Y);
      });
    }
    function xa(P) {
      return At("10.7.0", "highlightBlock will be removed entirely in v12.0"), At("10.7.0", "Please use highlightElement now."), On(P);
    }
    Object.assign(_, {
      highlight: Pe,
      highlightAuto: In,
      highlightAll: an,
      highlightElement: On,
      // TODO: Remove with v12 API
      highlightBlock: xa,
      configure: fa,
      initHighlighting: pa,
      initHighlightingOnLoad: ga,
      registerLanguage: ma,
      unregisterLanguage: wa,
      listLanguages: ya,
      getLanguage: at,
      registerAliases: $r,
      autoDetection: zr,
      inherit: Rr,
      addPlugin: _a,
      removePlugin: ka
    }), _.debugMode = function() {
      Te = !1;
    }, _.safeMode = function() {
      Te = !0;
    }, _.versionString = ca, _.regex = {
      concat: m,
      lookahead: f,
      either: g,
      optional: w,
      anyNumberOfTimes: h
    };
    for (const P in X)
      typeof X[P] == "object" && e(X[P]);
    return Object.assign(_, X), _;
  }, Et = Cr({});
  return Et.newInstance = () => Cr({}), qn = Et, Et.HighlightJS = Et, Et.default = Et, qn;
}
var Ca = /* @__PURE__ */ Ta();
const _e = /* @__PURE__ */ fi(Ca), Pa = "11.11.1", me = /* @__PURE__ */ new Map(), $a = "https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md", Fe = {
  shell: "bash",
  sh: "bash",
  zsh: "bash",
  js: "javascript",
  ts: "typescript",
  py: "python",
  csharp: "cs",
  "c#": "cs"
};
Fe.html = "xml";
Fe.xhtml = "xml";
Fe.markup = "xml";
const pi = /* @__PURE__ */ new Set(["magic", "undefined"]);
let ut = null;
const jn = /* @__PURE__ */ new Map(), za = 300 * 1e3;
async function gi(e = $a) {
  if (e)
    return ut || (ut = (async () => {
      try {
        const t = await fetch(e);
        if (!t.ok) return;
        const i = (await t.text()).split(/\r?\n/);
        let r = -1;
        for (let d = 0; d < i.length; d++)
          if (/\|\s*Language\s*\|/i.test(i[d])) {
            r = d;
            break;
          }
        if (r === -1) return;
        const a = i[r].replace(/^\||\|$/g, "").split("|").map((d) => d.trim().toLowerCase());
        let s = a.findIndex((d) => /alias|aliases|equivalent|alt|alternates?/i.test(d));
        s === -1 && (s = 1);
        let c = a.findIndex((d) => /file|filename|module|module name|module-name|short|slug/i.test(d));
        if (c === -1) {
          const d = a.findIndex((o) => /language/i.test(o));
          c = d !== -1 ? d : 0;
        }
        let l = [];
        for (let d = r + 1; d < i.length; d++) {
          const o = i[d].trim();
          if (!o || !o.startsWith("|")) break;
          const u = o.replace(/^\||\|$/g, "").split("|").map((p) => p.trim());
          if (u.every((p) => /^-+$/.test(p))) continue;
          const f = u;
          if (!f.length) continue;
          const w = (f[c] || f[0] || "").toString().trim().toLowerCase();
          if (!w || /^-+$/.test(w)) continue;
          me.set(w, w);
          const m = f[s] || "";
          if (m) {
            const p = String(m).split(",").map((g) => g.replace(/`/g, "").trim()).filter(Boolean);
            if (p.length) {
              const y = p[0].toLowerCase().replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
              y && /[a-z0-9]/i.test(y) && (me.set(y, y), l.push(y));
            }
          }
        }
        try {
          const d = [];
          for (const o of l) {
            const u = String(o || "").replace(/^[:]+/, "").replace(/[^a-z0-9_-]+/ig, "");
            u && /[a-z0-9]/i.test(u) ? d.push(u) : me.delete(o);
          }
          l = d;
        } catch (d) {
          console.warn("[codeblocksManager] cleanup aliases failed", d);
        }
        try {
          let d = 0;
          for (const o of Array.from(me.keys())) {
            if (!o || /^-+$/.test(o) || !/[a-z0-9]/i.test(o)) {
              me.delete(o), d++;
              continue;
            }
            if (/^[:]+/.test(o)) {
              const u = o.replace(/^[:]+/, "");
              if (u && /[a-z0-9]/i.test(u)) {
                const f = me.get(o);
                me.delete(o), me.set(u, f);
              } else
                me.delete(o), d++;
            }
          }
          for (const [o, u] of Array.from(me.entries()))
            (!u || /^-+$/.test(u) || !/[a-z0-9]/i.test(u)) && (me.delete(o), d++);
          try {
            const o = ":---------------------";
            me.has(o) && (me.delete(o), d++);
          } catch (o) {
            console.warn("[codeblocksManager] remove sep key failed", o);
          }
          try {
            const o = Array.from(me.keys()).sort();
          } catch (o) {
            console.warn("[codeblocksManager] compute supported keys failed", o);
          }
        } catch (d) {
          console.warn("[codeblocksManager] ignored error", d);
        }
      } catch (t) {
        console.warn("[codeblocksManager] loadSupportedLanguages failed", t);
      }
    })(), ut);
}
const Pt = /* @__PURE__ */ new Set();
async function Xt(e, t) {
  if (ut || (async () => {
    try {
      await gi();
    } catch (r) {
      console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed", r);
    }
  })(), ut)
    try {
      await ut;
    } catch {
    }
  if (e = e == null ? "" : String(e), e = e.trim(), !e) return !1;
  const n = e.toLowerCase();
  if (pi.has(n)) return !1;
  if (me.size && !me.has(n)) {
    const r = Fe;
    if (!r[n] && !r[e])
      return !1;
  }
  if (Pt.has(e)) return !0;
  const i = Fe;
  try {
    const r = (t || e || "").toString().replace(/\.js$/i, "").trim(), a = (i[e] || e || "").toString(), s = (i[r] || r || "").toString();
    let c = Array.from(new Set([
      a,
      s,
      r,
      e,
      i[r],
      i[e]
    ].filter(Boolean))).map((o) => String(o).toLowerCase()).filter((o) => o && o !== "undefined");
    me.size && (c = c.filter((o) => {
      if (me.has(o)) return !0;
      const u = Fe[o];
      return !!(u && me.has(u));
    }));
    let l = null, d = null;
    for (const o of c)
      try {
        const u = Date.now();
        let f = jn.get(o);
        if (f && f.ok === !1 && u - (f.ts || 0) >= za && (jn.delete(o), f = void 0), f) {
          if (f.module)
            l = f.module;
          else if (f.promise)
            try {
              l = await f.promise;
            } catch {
              l = null;
            }
        } else {
          const h = { promise: null, module: null, ok: null, ts: 0 };
          jn.set(o, h), h.promise = (async () => {
            try {
              try {
                try {
                  return await import(
                    /* @vite-ignore */
                    `highlight.js/lib/languages/${o}.js`
                  );
                } catch {
                  return await import(
                    /* @vite-ignore */
                    `highlight.js/lib/languages/${o}`
                  );
                }
              } catch {
                try {
                  const m = `https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${o}.js`;
                  return await new Function("u", "return import(u)")(m);
                } catch {
                  try {
                    const p = `https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${o}.js`;
                    return await new Function("u", "return import(u)")(p);
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
            l = await h.promise, h.module = l, h.ok = !!l, h.ts = Date.now();
          } catch {
            h.module = null, h.ok = !1, h.ts = Date.now(), l = null;
          }
        }
        if (l) {
          const h = l.default || l;
          try {
            const w = me.size && me.get(e) || o || e;
            return _e.registerLanguage(w, h), Pt.add(w), w !== e && (_e.registerLanguage(e, h), Pt.add(e)), !0;
          } catch (w) {
            d = w;
          }
        } else
          try {
            if (me.has(o) || me.has(e)) {
              const h = () => ({});
              try {
                _e.registerLanguage(o, h), Pt.add(o);
              } catch {
              }
              try {
                o !== e && (_e.registerLanguage(e, h), Pt.add(e));
              } catch {
              }
              return !0;
            }
          } catch {
          }
      } catch (u) {
        d = u;
      }
    if (d)
      throw d;
    return !1;
  } catch {
    return !1;
  }
}
let un = null;
function Ia(e = document) {
  ut || (async () => {
    try {
      await gi();
    } catch (a) {
      console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed", a);
    }
  })();
  const t = Fe, i = un || (typeof IntersectionObserver > "u" ? null : (un = new IntersectionObserver((a, s) => {
    a.forEach((c) => {
      if (!c.isIntersecting) return;
      const l = c.target;
      try {
        s.unobserve(l);
      } catch (d) {
        console.warn("[codeblocksManager] observer unobserve failed", d);
      }
      (async () => {
        try {
          const d = l.getAttribute && l.getAttribute("class") || l.className || "", o = d.match(/language-([a-zA-Z0-9_+-]+)/) || d.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
          if (o && o[1]) {
            const u = (o[1] || "").toLowerCase(), f = t[u] || u, h = me.size && (me.get(f) || me.get(String(f).toLowerCase())) || f;
            try {
              await Xt(h);
            } catch (w) {
              console.warn("[codeblocksManager] registerLanguage failed", w);
            }
            try {
              try {
                const w = l.textContent || l.innerText || "";
                w != null && (l.textContent = w);
              } catch {
              }
              try {
                l && l.dataset && l.dataset.highlighted && delete l.dataset.highlighted;
              } catch {
              }
              _e.highlightElement(l);
            } catch (w) {
              console.warn("[codeblocksManager] hljs.highlightElement failed", w);
            }
          } else
            try {
              const u = l.textContent || "";
              try {
                if (_e && typeof _e.getLanguage == "function" && _e.getLanguage("plaintext")) {
                  const f = _e.highlight(u, { language: "plaintext" });
                  f && f.value && (l.innerHTML = f.value);
                }
              } catch {
                try {
                  _e.highlightElement(l);
                } catch (h) {
                  console.warn("[codeblocksManager] fallback highlightElement failed", h);
                }
              }
            } catch (u) {
              console.warn("[codeblocksManager] auto-detect plaintext failed", u);
            }
        } catch (d) {
          console.warn("[codeblocksManager] observer entry processing failed", d);
        }
      })();
    });
  }, { root: null, rootMargin: "300px", threshold: 0.1 }), un)), r = e && e.querySelectorAll ? e.querySelectorAll("pre code") : [];
  if (!i) {
    r.forEach(async (a) => {
      try {
        const s = a.getAttribute && a.getAttribute("class") || a.className || "", c = s.match(/language-([a-zA-Z0-9_+-]+)/) || s.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (c && c[1]) {
          const l = (c[1] || "").toLowerCase(), d = t[l] || l, o = me.size && (me.get(d) || me.get(String(d).toLowerCase())) || d;
          try {
            await Xt(o);
          } catch (u) {
            console.warn("[codeblocksManager] registerLanguage failed (no observer)", u);
          }
        }
        try {
          try {
            const l = a.textContent || a.innerText || "";
            l != null && (a.textContent = l);
          } catch {
          }
          try {
            a && a.dataset && a.dataset.highlighted && delete a.dataset.highlighted;
          } catch {
          }
          _e.highlightElement(a);
        } catch (l) {
          console.warn("[codeblocksManager] hljs.highlightElement failed (no observer)", l);
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
function sl(e, { useCdn: t = !0 } = {}) {
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
  const s = a, c = `https://cdn.jsdelivr.net/npm/highlight.js@${Pa}/styles/${s}.css`, l = document.createElement("link");
  l.rel = "stylesheet", l.href = c, l.setAttribute("data-hl-theme", s), l.addEventListener("load", () => {
    try {
      n && n.parentNode && n.parentNode.removeChild(n);
    } catch {
    }
  }), document.head.appendChild(l);
}
let yt = "light";
function Oa(e, t = {}) {
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
function Hr() {
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
async function Ba(e = "none", t = "/") {
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
        const c = a[0], l = document.createElement("link");
        l.rel = "stylesheet", l.href = c, l.setAttribute("data-bulma-base", "1");
        const d = document.querySelector('link[href*="/dist/nimbi-cms.css"], link[href*="dist/nimbi-cms.css"]');
        d && d.parentNode ? d.parentNode.insertBefore(l, d) : document.head.appendChild(l);
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
    if (Hr(), document.querySelector("style[data-bulma-override]")) return;
    for (const a of r)
      try {
        const s = await fetch(a, { method: "GET" });
        if (s.ok) {
          const c = await s.text(), l = document.createElement("style");
          l.setAttribute("data-bulma-override", a), l.appendChild(document.createTextNode(`
/* bulma override: ${a} */
` + c)), document.head.appendChild(l);
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
    Hr();
    const s = `https://unpkg.com/bulmaswatch/${encodeURIComponent(a)}/bulmaswatch.min.css`;
    Oa(s, { "data-bulmaswatch-theme": a });
  } catch (a) {
    console.warn("[bulmaManager] ensureBulma failed", a);
  }
}
function Na(e) {
  yt = e === "dark" ? "dark" : e === "system" ? "system" : "light";
  try {
    const t = Array.from(document.querySelectorAll(".nimbi-mount"));
    if (t.length > 0)
      for (const n of t)
        yt === "dark" ? n.setAttribute("data-theme", "dark") : yt === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    else {
      const n = document.documentElement;
      yt === "dark" ? n.setAttribute("data-theme", "dark") : yt === "light" ? n.setAttribute("data-theme", "light") : n.removeAttribute("data-theme");
    }
  } catch {
  }
}
function ol(e) {
  const t = document.documentElement;
  for (const [n, i] of Object.entries(e || {}))
    try {
      t.style.setProperty(`--${n}`, i);
    } catch (r) {
      console.warn("[bulmaManager] setThemeVars failed for", n, r);
    }
}
function mi(e) {
  if (!e || !(e instanceof HTMLElement)) return () => {
  };
  const t = e.closest && e.closest(".nimbi-mount") || null;
  try {
    t && (yt === "dark" ? t.setAttribute("data-theme", "dark") : yt === "light" ? t.setAttribute("data-theme", "light") : t.removeAttribute("data-theme"));
  } catch {
  }
  return () => {
  };
}
const wi = {
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
}, Rt = JSON.parse(JSON.stringify(wi));
let bn = "en";
if (typeof navigator < "u") {
  const e = navigator.language || navigator.languages && navigator.languages[0] || "en";
  bn = String(e).split("-")[0].toLowerCase();
}
wi[bn] || (bn = "en");
let ft = bn;
function It(e, t = {}) {
  const n = Rt[ft] || Rt.en;
  let i = n && n[e] ? n[e] : Rt.en[e] || "";
  for (const r of Object.keys(t))
    i = i.replace(new RegExp(`{${r}}`, "g"), String(t[r]));
  return i;
}
async function yi(e, t) {
  if (!e) return;
  let n = e;
  try {
    /^https?:\/\//.test(e) || (n = new URL(e, location.origin + t).toString());
    const i = await fetch(n);
    if (!i.ok) return;
    const r = await i.json();
    for (const a of Object.keys(r || {}))
      Rt[a] = Object.assign({}, Rt[a] || {}, r[a]);
  } catch {
  }
}
function bi(e) {
  const t = String(e).split("-")[0].toLowerCase();
  ft = Rt[t] ? t : "en";
}
const Da = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get currentLang() {
    return ft;
  },
  loadL10nFile: yi,
  setLang: bi,
  t: It
}, Symbol.toStringTag, { value: "Module" }));
function _i(e) {
  return !e || typeof e != "string" ? !1 : /^(https?:)?\/\//.test(e) || e.startsWith("mailto:") || e.startsWith("tel:");
}
function te(e) {
  return String(e || "").replace(/^[.\/]+/, "");
}
function Tt(e) {
  return String(e || "").replace(/\/+$/, "");
}
function xt(e) {
  return Tt(e) + "/";
}
function qa(e) {
  try {
    if (!e || typeof document > "u" || !document.head || e.startsWith("data:") || document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`)) return;
    const n = document.createElement("link");
    n.rel = "preload", n.as = "image", n.href = e, document.head.appendChild(n);
  } catch (t) {
    console.warn("[helpers] preloadImage failed", t);
  }
}
function hn(e, t = 0, n = !1) {
  try {
    if (typeof window > "u" || !e || !e.querySelectorAll) return;
    const i = Array.from(e.querySelectorAll("img"));
    if (!i.length) return;
    const r = e, a = r && r.getBoundingClientRect ? r.getBoundingClientRect() : null, s = 0, c = typeof window < "u" && (window.innerHeight || document.documentElement.clientHeight) || 0, l = a ? Math.max(s, a.top) : s, o = (a ? Math.min(c, a.bottom) : c) + Number(t || 0);
    let u = 0;
    r && (u = r.clientHeight || (a ? a.height : 0)), u || (u = c - s);
    let f = 0.6;
    try {
      const p = r && window.getComputedStyle ? window.getComputedStyle(r) : null, g = p && p.getPropertyValue("--nimbi-image-max-height-ratio"), y = g ? parseFloat(g) : NaN;
      !Number.isNaN(y) && y > 0 && y <= 1 && (f = y);
    } catch (p) {
      console.warn("[helpers] read CSS ratio failed", p);
    }
    const h = Math.max(200, Math.floor(u * f));
    let w = !1, m = null;
    if (i.forEach((p) => {
      try {
        const g = p.getAttribute ? p.getAttribute("loading") : void 0;
        g !== "eager" && p.setAttribute && p.setAttribute("loading", "lazy");
        const y = p.getBoundingClientRect ? p.getBoundingClientRect() : null, b = p.src || p.getAttribute && p.getAttribute("src"), k = y && y.height > 1 ? y.height : h, S = y ? y.top : 0, v = S + k;
        y && k > 0 && S <= o && v >= l && (p.setAttribute ? (p.setAttribute("loading", "eager"), p.setAttribute("fetchpriority", "high"), p.setAttribute("data-eager-by-nimbi", "1")) : (p.loading = "eager", p.fetchPriority = "high"), qa(b), w = !0), !m && y && y.top <= o && (m = { img: p, src: b, rect: y, beforeLoading: g });
      } catch (g) {
        console.warn("[helpers] setEagerForAboveFoldImages per-image failed", g);
      }
    }), !w && m) {
      const { img: p, src: g, rect: y, beforeLoading: b } = m;
      try {
        p.setAttribute ? (p.setAttribute("loading", "eager"), p.setAttribute("fetchpriority", "high"), p.setAttribute("data-eager-by-nimbi", "1")) : (p.loading = "eager", p.fetchPriority = "high");
      } catch (k) {
        console.warn("[helpers] setEagerForAboveFoldImages fallback failed", k);
      }
    }
  } catch (i) {
    console.warn("[helpers] setEagerForAboveFoldImages failed", i);
  }
}
function Le(e, t = null, n) {
  try {
    const i = typeof n == "string" ? n : typeof window < "u" && window.location ? window.location.search : "", r = new URLSearchParams(i.startsWith("?") ? i.slice(1) : i), a = String(e || "");
    r.delete("page");
    const s = new URLSearchParams();
    s.set("page", a);
    for (const [d, o] of r.entries())
      s.append(d, o);
    const c = s.toString();
    let l = c ? `?${c}` : "";
    return t && (l += `#${encodeURIComponent(t)}`), l || `?page=${encodeURIComponent(a)}`;
  } catch {
    const r = `?page=${encodeURIComponent(String(e || ""))}`;
    return t ? `${r}#${encodeURIComponent(t)}` : r;
  }
}
function _n(e) {
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
  typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = _n);
} catch (e) {
  console.warn("[helpers] global attach failed", e);
}
function ja(e) {
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
function Ha(e) {
  try {
    return String(e || "").split("/").map((t) => encodeURIComponent(t)).join("/");
  } catch {
    return String(e || "");
  }
}
function Ur(e, t = null, n = void 0) {
  let r = "#/" + Ha(String(e || ""));
  t && (r += "#" + encodeURIComponent(String(t)));
  try {
    let a = "";
    if (typeof n == "string")
      a = n;
    else if (typeof location < "u" && location && location.search)
      a = location.search;
    else if (typeof location < "u" && location && location.hash)
      try {
        const s = Ke(location.href);
        s && s.params && (a = s.params);
      } catch {
      }
    if (a) {
      const s = typeof a == "string" && a.startsWith("?") ? a.slice(1) : a;
      try {
        const c = new URLSearchParams(s);
        c.delete("page");
        const l = c.toString();
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
function Ke(e) {
  try {
    const t = new URL(e, typeof location < "u" ? location.href : "http://localhost/"), n = t.searchParams.get("page");
    if (n) {
      let r = null, a = "";
      if (t.hash) {
        const d = t.hash.replace(/^#/, "");
        if (d.includes("&")) {
          const o = d.split("&");
          r = o.shift() || null, a = o.join("&");
        } else
          r = d || null;
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
        const d = r.split("?");
        r = d.shift() || "", a = d.join("?") || "";
      }
      let s = r, c = null;
      if (s.indexOf("#") !== -1) {
        const d = s.split("#");
        s = d.shift() || "", c = d.join("#") || null;
      }
      return { type: "cosmetic", page: s.replace(/^\/+/, "") || null, anchor: c, params: a };
    }
    return { type: "path", page: (t.pathname || "").replace(/^\//, "") || null, anchor: t.hash ? t.hash.replace(/^#/, "") : null, params: t.search ? t.search.replace(/^\?/, "") : "" };
  } catch {
    return { type: "unknown", page: e, anchor: null, params: "" };
  }
}
const Ua = `import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
function Fa(e, t = "worker") {
  let n = null;
  const i = typeof globalThis < "u" && typeof globalThis.__nimbiCMSDebug < "u" ? !!globalThis.__nimbiCMSDebug : !1;
  function r(...d) {
    try {
      i && console && typeof console.warn == "function" && console.warn(...d);
    } catch {
    }
  }
  function a() {
    if (!n)
      try {
        const d = e();
        n = d || null, d && d.addEventListener("error", () => {
          try {
            n === d && (n = null, d.terminate && d.terminate());
          } catch (o) {
            r("[" + t + "] worker termination failed", o);
          }
        });
      } catch (d) {
        n = null, r("[" + t + "] worker init failed", d);
      }
    return n;
  }
  function s() {
    try {
      n && (n.terminate && n.terminate(), n = null);
    } catch (d) {
      r("[" + t + "] worker termination failed", d);
    }
  }
  function c(d, o = 1e4) {
    return new Promise((u, f) => {
      const h = a();
      if (!h) return f(new Error("worker unavailable"));
      const w = String(Math.random()), m = Object.assign({}, d, { id: w });
      let p = null;
      const g = () => {
        p && clearTimeout(p), h.removeEventListener("message", y), h.removeEventListener("error", b);
      }, y = (k) => {
        const S = k.data || {};
        S.id === w && (g(), S.error ? f(new Error(S.error)) : u(S.result));
      }, b = (k) => {
        g(), r("[" + t + "] worker error event", k);
        try {
          n === h && (n = null, h.terminate && h.terminate());
        } catch (S) {
          r("[" + t + "] worker termination failed", S);
        }
        f(new Error(k && k.message || "worker error"));
      };
      p = setTimeout(() => {
        g(), r("[" + t + "] worker timed out");
        try {
          n === h && (n = null, h.terminate && h.terminate());
        } catch (k) {
          r("[" + t + "] worker termination on timeout failed", k);
        }
        f(new Error("worker timeout"));
      }, o), h.addEventListener("message", y), h.addEventListener("error", b);
      try {
        h.postMessage(m);
      } catch (k) {
        g(), f(k);
      }
    });
  }
  return { get: a, send: c, terminate: s };
}
function ki(e, t = "worker-pool", n = 2) {
  const i = new Array(n).fill(null);
  let r = 0;
  const a = typeof globalThis < "u" && typeof globalThis.__nimbiCMSDebug < "u" ? !!globalThis.__nimbiCMSDebug : !1;
  function s(...m) {
    try {
      a && console && typeof console.warn == "function" && console.warn(...m);
    } catch {
    }
  }
  function c(m) {
    if (!i[m])
      try {
        const p = e();
        i[m] = p || null, p && p.addEventListener("error", () => {
          try {
            i[m] === p && (i[m] = null, p.terminate && p.terminate());
          } catch (g) {
            s("[" + t + "] worker termination failed", g);
          }
        });
      } catch (p) {
        i[m] = null, s("[" + t + "] worker init failed", p);
      }
    return i[m];
  }
  const l = new Array(n).fill(0), d = new Array(n).fill(null), o = 30 * 1e3;
  function u(m) {
    try {
      l[m] = Date.now(), d[m] && (clearTimeout(d[m]), d[m] = null), d[m] = setTimeout(() => {
        try {
          i[m] && (i[m].terminate && i[m].terminate(), i[m] = null);
        } catch (p) {
          s("[" + t + "] idle termination failed", p);
        }
        d[m] = null;
      }, o);
    } catch {
    }
  }
  function f() {
    for (let m = 0; m < i.length; m++) {
      const p = c(m);
      if (p) return p;
    }
    return null;
  }
  function h() {
    for (let m = 0; m < i.length; m++)
      try {
        i[m] && (i[m].terminate && i[m].terminate(), i[m] = null);
      } catch (p) {
        s("[" + t + "] worker termination failed", p);
      }
  }
  function w(m, p = 1e4) {
    return new Promise((g, y) => {
      const b = r++ % i.length, k = (S) => {
        const v = (b + S) % i.length, M = c(v);
        if (!M)
          return S + 1 < i.length ? k(S + 1) : y(new Error("worker pool unavailable"));
        const q = String(Math.random()), $ = Object.assign({}, m, { id: q });
        let F = null;
        const he = () => {
          F && clearTimeout(F), M.removeEventListener("message", A), M.removeEventListener("error", U);
        }, A = (de) => {
          const oe = de.data || {};
          oe.id === q && (he(), oe.error ? y(new Error(oe.error)) : g(oe.result));
        }, U = (de) => {
          he(), s("[" + t + "] worker error event", de);
          try {
            i[v] === M && (i[v] = null, M.terminate && M.terminate());
          } catch (oe) {
            s("[" + t + "] worker termination failed", oe);
          }
          y(new Error(de && de.message || "worker error"));
        };
        F = setTimeout(() => {
          he(), s("[" + t + "] worker timed out");
          try {
            i[v] === M && (i[v] = null, M.terminate && M.terminate());
          } catch (de) {
            s("[" + t + "] worker termination on timeout failed", de);
          }
          y(new Error("worker timeout"));
        }, p), M.addEventListener("message", A), M.addEventListener("error", U);
        try {
          u(v), M.postMessage($);
        } catch (de) {
          he(), y(de);
        }
      };
      k(0);
    });
  }
  return { get: f, send: w, terminate: h };
}
function Bt(e) {
  try {
    if (typeof Blob < "u" && typeof URL < "u" && e)
      try {
        Bt._blobUrlCache || (Bt._blobUrlCache = /* @__PURE__ */ new Map());
        const t = Bt._blobUrlCache;
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
const tt = /* @__PURE__ */ new Set();
function lr(e) {
  Wa(), tt.clear();
  for (const t of $e)
    t && tt.add(t);
  Fr(J), Fr(H), lr._refreshed = !0;
}
function Fr(e) {
  if (!(!e || typeof e.values != "function"))
    for (const t of e.values())
      t && tt.add(t);
}
function Wr(e) {
  if (!e || typeof e.set != "function") return;
  const t = e.set;
  e.set = function(n, i) {
    return i && tt.add(i), t.call(this, n, i);
  };
}
let Zr = !1;
function Wa() {
  Zr || (Wr(J), Wr(H), Zr = !0);
}
const J = /* @__PURE__ */ new Map();
let je = [], cr = !1;
function Za(e) {
  cr = !!e;
}
function xi(e) {
  je = Array.isArray(e) ? e.slice() : [];
}
function Ga() {
  return je;
}
const Si = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2, vi = ki(() => Bt(Ua), "slugManager", Si);
function Qa() {
  return vi.get();
}
function Ai(e) {
  return vi.send(e, 5e3);
}
async function Qn(e, t = 1, n = void 0) {
  const i = await Promise.resolve().then(() => dt);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return await Ai({ type: "buildSearchIndex", contentBase: e, indexDepth: t, noIndexing: n });
}
async function Xa(e, t, n) {
  const i = await Promise.resolve().then(() => dt);
  if (!(i.initSlugWorker && i.initSlugWorker())) throw new Error("slug worker required but unavailable");
  return Ai({ type: "crawlForSlug", slug: e, base: t, maxQueue: n });
}
function ot(e, t) {
  if (e)
    if (je && je.length) {
      const i = t.split("/")[0], r = je.includes(i);
      let a = J.get(e);
      (!a || typeof a == "string") && (a = { default: typeof a == "string" ? a : void 0, langs: {} }), r ? a.langs[i] = t : a.default = t, J.set(e, a);
    } else
      J.set(e, t);
}
const Ln = /* @__PURE__ */ new Set();
function Ka(e) {
  typeof e == "function" && Ln.add(e);
}
function Va(e) {
  typeof e == "function" && Ln.delete(e);
}
const H = /* @__PURE__ */ new Map();
let Xn = {}, $e = [], Me = "_404.md", Lt = "_home.md";
function Kn(e) {
  e != null && (Me = String(e || ""));
}
function Ya(e) {
  e != null && (Lt = String(e || ""));
}
function Ja(e) {
  Xn = e || {};
}
function Ei(e) {
  try {
    if (Array.isArray(j) || (j = []), !Array.isArray(e)) return;
    try {
      Array.isArray(j) || (j = []), j.length = 0;
      for (const t of e) j.push(t);
      try {
        if (typeof window < "u")
          try {
            window.__nimbiLiveSearchIndex = j;
          } catch {
          }
      } catch {
      }
    } catch (t) {
      console.warn("[slugManager] replacing searchIndex by assignment fallback", t);
      try {
        j = Array.from(e);
      } catch {
      }
    }
  } catch {
  }
}
const Nt = /* @__PURE__ */ new Map(), kn = /* @__PURE__ */ new Set();
function es() {
  Nt.clear(), kn.clear();
}
function ts(e) {
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
function xn(e) {
  J.clear(), H.clear(), $e = [], je = je || [];
  const t = Object.keys(Xn || {});
  if (!t.length) return;
  let n = "";
  try {
    if (e) {
      try {
        /^[a-z][a-z0-9+.-]*:/i.test(String(e)) ? n = new URL(String(e)).pathname : n = String(e || "");
      } catch (i) {
        n = String(e || ""), console.warn("[slugManager] parse contentBase failed", i);
      }
      n = xt(n);
    }
  } catch (i) {
    n = "", console.warn("[slugManager] setContentBase prefix derivation failed", i);
  }
  n || (n = ts(t));
  for (const i of t) {
    let r = i;
    n && i.startsWith(n) ? r = te(i.slice(n.length)) : r = te(i), $e.push(r);
    try {
      lr();
    } catch (s) {
      console.warn("[slugManager] refreshIndexPaths failed", s);
    }
    const a = Xn[i];
    if (typeof a == "string") {
      const s = (a || "").match(/^#\s+(.+)$/m);
      if (s && s[1]) {
        const c = ye(s[1].trim());
        if (c)
          try {
            let l = c;
            if ((!je || !je.length) && (l = Li(l, new Set(J.keys()))), je && je.length) {
              const o = r.split("/")[0], u = je.includes(o);
              let f = J.get(l);
              (!f || typeof f == "string") && (f = { default: typeof f == "string" ? f : void 0, langs: {} }), u ? f.langs[o] = r : f.default = r, J.set(l, f);
            } else
              J.set(l, r);
            H.set(r, l);
          } catch (l) {
            console.warn("[slugManager] set slug mapping failed", l);
          }
      }
    }
  }
}
try {
  xn();
} catch (e) {
  console.warn("[slugManager] initial setContentBase failed", e);
}
function ye(e) {
  let n = String(e || "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/ /g, "-");
  return n = n.replace(/(?:-?)(?:md|html)$/, ""), n = n.replace(/-+/g, "-"), n = n.replace(/^-|-$/g, ""), n.length > 80 && (n = n.slice(0, 80).replace(/-+$/g, "")), n;
}
function Li(e, t) {
  if (!t.has(e)) return e;
  let n = 2, i = `${e}-${n}`;
  for (; t.has(i); )
    n += 1, i = `${e}-${n}`;
  return i;
}
function ns(e) {
  return Jt(e, void 0);
}
function Jt(e, t) {
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
function gn(e) {
  return e == null ? e : String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g, (t, n) => n);
}
function en(e) {
  if (!e || !J.has(e)) return null;
  const t = J.get(e);
  if (!t) return null;
  if (typeof t == "string") return t;
  if (je && je.length && ft && t.langs && t.langs[ft])
    return t.langs[ft];
  if (t.default) return t.default;
  if (t.langs) {
    const n = Object.keys(t.langs);
    if (n.length) return t.langs[n[0]];
  }
  return null;
}
const Dt = /* @__PURE__ */ new Map();
function rs() {
  Dt.clear();
}
let ke = async function(e, t) {
  if (!e) throw new Error("path required");
  try {
    if (typeof e == "string" && (e.indexOf("?page=") !== -1 || e.startsWith("?") || e.startsWith("#/") || e.indexOf("#/") !== -1))
      try {
        const a = Ke(e);
        a && a.page && (e = a.page);
      } catch {
      }
  } catch {
  }
  try {
    const a = (String(e || "").match(/([^\/]+)\.md(?:$|[?#])/) || [])[1];
    if (a && J.has(a)) {
      const s = en(a) || J.get(a);
      s && s !== e && (e = s);
    }
  } catch (a) {
    console.warn("[slugManager] slug mapping normalization failed", a);
  }
  const n = t == null ? "" : Tt(String(t));
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
  if (Dt.has(i))
    return Dt.get(i);
  const r = (async () => {
    const a = await fetch(i);
    if (!a || typeof a.ok != "boolean" || !a.ok) {
      if (a && a.status === 404)
        try {
          const u = `${n}/${Me}`, f = await globalThis.fetch(u);
          if (f && typeof f.ok == "boolean" && f.ok)
            return { raw: await f.text(), status: 404 };
        } catch (u) {
          console.warn("[slugManager] fetching fallback 404 failed", u);
        }
      let o = "";
      try {
        a && typeof a.clone == "function" ? o = await a.clone().text() : a && typeof a.text == "function" ? o = await a.text() : o = "";
      } catch (u) {
        o = "", console.warn("[slugManager] reading error body failed", u);
      }
      throw console.error("fetchMarkdown failed:", { url: i, status: a ? a.status : void 0, statusText: a ? a.statusText : void 0, body: o.slice(0, 200) }), new Error("failed to fetch md");
    }
    const s = await a.text(), c = s.trim().slice(0, 128).toLowerCase(), l = /^(?:<!doctype|<html|<title|<h1)/.test(c), d = l || String(e || "").toLowerCase().endsWith(".html");
    if (l && String(e || "").toLowerCase().endsWith(".md")) {
      try {
        const o = `${n}/${Me}`, u = await globalThis.fetch(o);
        if (u.ok)
          return { raw: await u.text(), status: 404 };
      } catch (o) {
        console.warn("[slugManager] fetching fallback 404 failed", o);
      }
      throw console.error("fetchMarkdown: server returned HTML for .md request", i), new Error("failed to fetch md");
    }
    return d ? { raw: s, isHtml: !0 } : { raw: s };
  })();
  return Dt.set(i, r), r;
};
function is(e) {
  typeof e == "function" && (ke = e);
}
const mn = /* @__PURE__ */ new Map();
function as(e) {
  if (!e || typeof e != "string") return "";
  let t = e.replace(/```[\s\S]*?```/g, "");
  return t = t.replace(/<pre[\s\S]*?<\/pre>/gi, ""), t = t.replace(/<code[\s\S]*?<\/code>/gi, ""), t = t.replace(/<!--([\s\S]*?)-->/g, ""), t = t.replace(/^ {4,}.*$/gm, ""), t = t.replace(/`[^`]*`/g, ""), t;
}
let j = [];
function ss() {
  return j;
}
try {
  if (typeof window < "u")
    try {
      Object.defineProperty(window, "__nimbiSearchIndex", {
        get() {
          return j;
        },
        enumerable: !0,
        configurable: !0
      });
    } catch {
      try {
        window.__nimbiSearchIndex = j;
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
          return Vn;
        },
        enumerable: !0,
        configurable: !0
      });
    } catch {
      try {
        window.__nimbiIndexReady = Vn;
      } catch {
      }
    }
} catch {
}
let ct = null;
async function _t(e, t = 1, n = void 0, i = void 0) {
  const r = Array.isArray(n) ? Array.from(new Set((n || []).map((a) => te(String(a || ""))))) : [];
  try {
    const a = te(String(Me || ""));
    a && !r.includes(a) && r.push(a);
  } catch {
  }
  if (j && j.length && t === 1 && !j.some((s) => {
    try {
      return r.includes(te(String(s.path || "")));
    } catch {
      return !1;
    }
  }))
    return j;
  if (ct) return ct;
  ct = (async () => {
    let a = Array.isArray(n) ? Array.from(new Set((n || []).map((o) => te(String(o || ""))))) : [];
    try {
      const o = te(String(Me || ""));
      o && !a.includes(o) && a.push(o);
    } catch {
    }
    const s = (o) => {
      if (!a || !a.length) return !1;
      for (const u of a)
        if (u && (o === u || o.startsWith(u + "/")))
          return !0;
      return !1;
    };
    let c = [];
    try {
      if (Array.isArray(i) && i.length)
        for (const o of i)
          try {
            const u = te(String(o || ""));
            u && c.push(u);
          } catch {
          }
    } catch {
    }
    if ($e && $e.length && (c = Array.from($e)), !c.length)
      for (const o of J.values())
        o && c.push(o);
    try {
      const o = await Pi(e);
      o && o.length && (c = c.concat(o));
    } catch (o) {
      console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed", o);
    }
    try {
      const o = new Set(c), u = [...c], f = Math.max(1, Si), h = async () => {
        for (; !(o.size > tn); ) {
          const m = u.shift();
          if (!m) break;
          try {
            const p = await ke(m, e);
            if (p && p.raw) {
              if (p.status === 404) continue;
              let g = p.raw;
              const y = [], b = String(m || "").replace(/^.*\//, "");
              if (/^readme(?:\.md)?$/i.test(b) && cr && (!m || !m.includes("/")))
                continue;
              const k = as(g), S = /\[[^\]]+\]\(([^)]+)\)/g;
              let v;
              for (; v = S.exec(k); )
                y.push(v[1]);
              const M = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
              for (; v = M.exec(k); )
                y.push(v[1]);
              const q = m && m.includes("/") ? m.substring(0, m.lastIndexOf("/") + 1) : "";
              for (let $ of y)
                try {
                  if (Jt($, e) || $.startsWith("..") || $.indexOf("/../") !== -1 || (q && !$.startsWith("./") && !$.startsWith("/") && !$.startsWith("../") && ($ = q + $), $ = te($), !/\.(md|html?)(?:$|[?#])/i.test($)) || ($ = $.split(/[?#]/)[0], s($))) continue;
                  o.has($) || (o.add($), u.push($), c.push($));
                } catch (F) {
                  console.warn("[slugManager] href processing failed", $, F);
                }
            }
          } catch (p) {
            console.warn("[slugManager] discovery fetch failed for", m, p);
          }
        }
      }, w = [];
      for (let m = 0; m < f; m++) w.push(h());
      await Promise.all(w);
    } catch (o) {
      console.warn("[slugManager] discovery loop failed", o);
    }
    const l = /* @__PURE__ */ new Set();
    c = c.filter((o) => !o || l.has(o) || s(o) ? !1 : (l.add(o), !0));
    const d = [];
    for (const o of c)
      if (/\.(?:md|html?)(?:$|[?#])/i.test(o))
        try {
          const u = await ke(o, e);
          if (u && u.raw) {
            if (u.status === 404) continue;
            let f = "", h = "";
            if (u.isHtml)
              try {
                const p = new DOMParser().parseFromString(u.raw, "text/html"), g = p.querySelector("title") || p.querySelector("h1");
                g && g.textContent && (f = g.textContent.trim());
                const y = p.querySelector("p");
                if (y && y.textContent && (h = y.textContent.trim()), t >= 2)
                  try {
                    const b = p.querySelector("h1"), k = b && b.textContent ? b.textContent.trim() : f || "", S = (() => {
                      try {
                        if (H.has(o)) return H.get(o);
                      } catch {
                      }
                      return ye(f || o);
                    })(), v = Array.from(p.querySelectorAll("h2"));
                    for (const M of v)
                      try {
                        const q = (M.textContent || "").trim();
                        if (!q) continue;
                        const $ = M.id ? M.id : ye(q), F = S ? `${S}::${$}` : `${ye(o)}::${$}`;
                        let he = "", A = M.nextElementSibling;
                        for (; A && A.tagName && A.tagName.toLowerCase() === "script"; ) A = A.nextElementSibling;
                        A && A.textContent && (he = String(A.textContent).trim()), d.push({ slug: F, title: q, excerpt: he, path: o, parentTitle: k });
                      } catch (q) {
                        console.warn("[slugManager] indexing H2 failed", q);
                      }
                    if (t === 3)
                      try {
                        const M = Array.from(p.querySelectorAll("h3"));
                        for (const q of M)
                          try {
                            const $ = (q.textContent || "").trim();
                            if (!$) continue;
                            const F = q.id ? q.id : ye($), he = S ? `${S}::${F}` : `${ye(o)}::${F}`;
                            let A = "", U = q.nextElementSibling;
                            for (; U && U.tagName && U.tagName.toLowerCase() === "script"; ) U = U.nextElementSibling;
                            U && U.textContent && (A = String(U.textContent).trim()), d.push({ slug: he, title: $, excerpt: A, path: o, parentTitle: k });
                          } catch ($) {
                            console.warn("[slugManager] indexing H3 failed", $);
                          }
                      } catch (M) {
                        console.warn("[slugManager] collect H3s failed", M);
                      }
                  } catch (b) {
                    console.warn("[slugManager] collect H2s failed", b);
                  }
              } catch (m) {
                console.warn("[slugManager] parsing HTML for index failed", m);
              }
            else {
              const m = u.raw, p = m.match(/^#\s+(.+)$/m);
              f = p ? p[1].trim() : "";
              try {
                f = gn(f);
              } catch {
              }
              const g = m.split(/\r?\n\s*\r?\n/);
              if (g.length > 1)
                for (let y = 1; y < g.length; y++) {
                  const b = g[y].trim();
                  if (b && !/^#/.test(b)) {
                    h = b.replace(/\r?\n/g, " ");
                    break;
                  }
                }
              if (t >= 2) {
                let y = "", b = "";
                try {
                  const k = (m.match(/^#\s+(.+)$/m) || [])[1];
                  y = k ? k.trim() : "", b = (function() {
                    try {
                      if (H.has(o)) return H.get(o);
                    } catch {
                    }
                    return ye(f || o);
                  })();
                  const S = /^##\s+(.+)$/gm;
                  let v;
                  for (; v = S.exec(m); )
                    try {
                      const M = (v[1] || "").trim(), q = gn(M);
                      if (!M) continue;
                      const $ = ye(M), F = b ? `${b}::${$}` : `${ye(o)}::${$}`, A = m.slice(S.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), U = A && A[1] ? String(A[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                      d.push({ slug: F, title: q, excerpt: U, path: o, parentTitle: y });
                    } catch (M) {
                      console.warn("[slugManager] indexing markdown H2 failed", M);
                    }
                } catch (k) {
                  console.warn("[slugManager] collect markdown H2s failed", k);
                }
                if (t === 3)
                  try {
                    const k = /^###\s+(.+)$/gm;
                    let S;
                    for (; S = k.exec(m); )
                      try {
                        const v = (S[1] || "").trim(), M = gn(v);
                        if (!v) continue;
                        const q = ye(v), $ = b ? `${b}::${q}` : `${ye(o)}::${q}`, he = m.slice(k.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/), A = he && he[1] ? String(he[1]).trim().split(/\r?\n/).join(" ").slice(0, 300) : "";
                        d.push({ slug: $, title: M, excerpt: A, path: o, parentTitle: y });
                      } catch (v) {
                        console.warn("[slugManager] indexing markdown H3 failed", v);
                      }
                  } catch (k) {
                    console.warn("[slugManager] collect markdown H3s failed", k);
                  }
              }
            }
            let w = "";
            try {
              H.has(o) && (w = H.get(o));
            } catch (m) {
              console.warn("[slugManager] mdToSlug access failed", m);
            }
            w || (w = ye(f || o)), d.push({ slug: w, title: f, excerpt: h, path: o });
          }
        } catch (u) {
          console.warn("[slugManager] buildSearchIndex: entry fetch failed", u);
        }
    try {
      const o = d.filter((u) => {
        try {
          return !s(String(u.path || ""));
        } catch {
          return !0;
        }
      });
      try {
        Array.isArray(j) || (j = []), j.length = 0;
        for (const u of o) j.push(u);
      } catch {
        try {
          j = Array.from(o);
        } catch {
          j = o;
        }
      }
      try {
        if (typeof window < "u") {
          try {
            window.__nimbiResolvedIndex = j;
          } catch {
          }
          try {
            const u = [], f = /* @__PURE__ */ new Set();
            for (const h of j)
              try {
                if (!h || !h.slug) continue;
                const w = String(h.slug).split("::")[0];
                if (f.has(w)) continue;
                f.add(w);
                const m = { slug: w };
                h.title ? m.title = String(h.title) : h.parentTitle && (m.title = String(h.parentTitle)), h.path && (m.path = String(h.path)), u.push(m);
              } catch {
              }
            try {
              window.__nimbiSitemapJson = { generatedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: u };
            } catch {
            }
            try {
              window.__nimbiSitemapFinal = u;
            } catch {
            }
          } catch {
          }
        }
      } catch {
      }
    } catch (o) {
      console.warn("[slugManager] filtering index by excludes failed", o);
      try {
        Array.isArray(j) || (j = []), j.length = 0;
        for (const u of d) j.push(u);
      } catch {
        try {
          j = Array.from(d);
        } catch {
          j = d;
        }
      }
      try {
        if (typeof window < "u")
          try {
            window.__nimbiResolvedIndex = j;
          } catch {
          }
      } catch {
      }
    }
    return j;
  })();
  try {
    await ct;
  } catch (a) {
    console.warn("[slugManager] awaiting _indexPromise failed", a);
  }
  return ct = null, j;
}
async function ht(e = {}) {
  try {
    const t = typeof e.timeoutMs == "number" ? e.timeoutMs : 8e3, n = e.contentBase, i = typeof e.indexDepth == "number" ? e.indexDepth : 1, r = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, a = Array.isArray(e.seedPaths) ? e.seedPaths : void 0, s = typeof e.startBuild == "boolean" ? e.startBuild : !0;
    if (Array.isArray(j) && j.length && !ct && !s) return j;
    if (ct) {
      try {
        await ct;
      } catch {
      }
      return j;
    }
    if (s) {
      try {
        if (typeof Qn == "function")
          try {
            const l = await Qn(n, i, r, a);
            if (Array.isArray(l) && l.length) {
              try {
                Ei(l);
              } catch {
              }
              return j;
            }
          } catch {
          }
      } catch {
      }
      try {
        return await _t(n, i, r, a), j;
      } catch {
      }
    }
    const c = Date.now();
    for (; Date.now() - c < t; ) {
      if (Array.isArray(j) && j.length) return j;
      await new Promise((l) => setTimeout(l, 150));
    }
    return j;
  } catch {
    return j;
  }
}
async function Vn(e = {}) {
  try {
    const t = Object.assign({}, e);
    typeof t.startBuild != "boolean" && (t.startBuild = !0), typeof t.timeoutMs != "number" && (t.timeoutMs = 1 / 0);
    try {
      return await ht(t);
    } catch {
      return j;
    }
  } catch {
    return j;
  }
}
const Mi = 1e3;
let tn = Mi;
function os(e) {
  typeof e == "number" && e >= 0 && (tn = e);
}
const Ri = new DOMParser(), Ti = "a[href]";
let Ci = async function(e, t, n = tn) {
  if (mn.has(e)) return mn.get(e);
  let i = null;
  const r = /* @__PURE__ */ new Set(), a = [""], s = typeof location < "u" && location.origin ? location.origin : "http://localhost";
  let c = s + "/";
  try {
    t && (/^[a-z][a-z0-9+.-]*:/i.test(String(t)) ? c = String(t).replace(/\/$/, "") + "/" : String(t).startsWith("/") ? c = s + String(t).replace(/\/$/, "") + "/" : c = s + "/" + String(t).replace(/\/$/, "") + "/");
  } catch {
    c = s + "/";
  }
  for (; a.length && !i && !(a.length > n); ) {
    const l = a.shift();
    if (r.has(l)) continue;
    r.add(l);
    let d = "";
    try {
      d = new URL(l || "", c).toString();
    } catch {
      d = (String(t || "") || s) + "/" + String(l || "").replace(/^\//, "");
    }
    try {
      let o;
      try {
        o = await globalThis.fetch(d);
      } catch (m) {
        console.warn("[slugManager] crawlAllMarkdown: fetch failed", { url: d, error: m });
        continue;
      }
      if (!o || !o.ok) {
        o && !o.ok && console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: d, status: o.status });
        continue;
      }
      const u = await o.text(), h = Ri.parseFromString(u, "text/html").querySelectorAll(Ti), w = d;
      for (const m of h)
        try {
          let p = m.getAttribute("href") || "";
          if (!p || Jt(p, t) || p.startsWith("..") || p.indexOf("/../") !== -1) continue;
          if (p.endsWith("/")) {
            try {
              const g = new URL(p, w), y = new URL(c).pathname, b = g.pathname.startsWith(y) ? g.pathname.slice(y.length) : g.pathname.replace(/^\//, ""), k = xt(te(b));
              r.has(k) || a.push(k);
            } catch {
              const y = te(l + p);
              r.has(y) || a.push(y);
            }
            continue;
          }
          if (p.toLowerCase().endsWith(".md")) {
            let g = "";
            try {
              const y = new URL(p, w), b = new URL(c).pathname;
              g = y.pathname.startsWith(b) ? y.pathname.slice(b.length) : y.pathname.replace(/^\//, "");
            } catch {
              g = (l + p).replace(/^\//, "");
            }
            g = te(g);
            try {
              if (H.has(g))
                continue;
              for (const y of J.values())
                ;
            } catch (y) {
              console.warn("[slugManager] slug map access failed", y);
            }
            try {
              const y = await ke(g, t);
              if (y && y.raw) {
                const b = (y.raw || "").match(/^#\s+(.+)$/m);
                if (b && b[1] && ye(b[1].trim()) === e) {
                  i = g;
                  break;
                }
              }
            } catch (y) {
              console.warn("[slugManager] crawlForSlug: fetchMarkdown failed", y);
            }
          }
        } catch (p) {
          console.warn("[slugManager] crawlForSlug: link iteration failed", p);
        }
    } catch (o) {
      console.warn("[slugManager] crawlForSlug: directory fetch failed", o);
    }
  }
  return mn.set(e, i), i;
};
async function Pi(e, t = tn) {
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
    let l = "";
    try {
      l = new URL(c || "", s).toString();
    } catch {
      l = (String(e || "") || a) + "/" + String(c || "").replace(/^\//, "");
    }
    try {
      let d;
      try {
        d = await globalThis.fetch(l);
      } catch (w) {
        console.warn("[slugManager] crawlAllMarkdown: fetch failed", { url: l, error: w });
        continue;
      }
      if (!d || !d.ok) {
        d && !d.ok && console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok", { url: l, status: d.status });
        continue;
      }
      const o = await d.text(), f = Ri.parseFromString(o, "text/html").querySelectorAll(Ti), h = l;
      for (const w of f)
        try {
          let m = w.getAttribute("href") || "";
          if (!m || Jt(m, e) || m.startsWith("..") || m.indexOf("/../") !== -1) continue;
          if (m.endsWith("/")) {
            try {
              const g = new URL(m, h), y = new URL(s).pathname, b = g.pathname.startsWith(y) ? g.pathname.slice(y.length) : g.pathname.replace(/^\//, ""), k = xt(te(b));
              i.has(k) || r.push(k);
            } catch {
              const y = c + m;
              i.has(y) || r.push(y);
            }
            continue;
          }
          let p = "";
          try {
            const g = new URL(m, h), y = new URL(s).pathname;
            p = g.pathname.startsWith(y) ? g.pathname.slice(y.length) : g.pathname.replace(/^\//, "");
          } catch {
            p = (c + m).replace(/^\//, "");
          }
          p = te(p), /\.(md|html?)$/i.test(p) && n.add(p);
        } catch (m) {
          console.warn("[slugManager] crawlAllMarkdown: link iteration failed", m);
        }
    } catch (d) {
      console.warn("[slugManager] crawlAllMarkdown: directory fetch failed", d);
    }
  }
  return Array.from(n);
}
async function $i(e, t, n) {
  if (e && typeof e == "string" && (e = te(e), e = Tt(e)), J.has(e))
    return en(e) || J.get(e);
  for (const r of Ln)
    try {
      const a = await r(e, t);
      if (a)
        return ot(e, a), H.set(a, e), a;
    } catch (a) {
      console.warn("[slugManager] slug resolver failed", a);
    }
  if ($e && $e.length) {
    if (Nt.has(e)) {
      const r = Nt.get(e);
      return J.set(e, r), H.set(r, e), r;
    }
    for (const r of $e)
      if (!kn.has(r))
        try {
          const a = await ke(r, t);
          if (a && a.raw) {
            const s = (a.raw || "").match(/^#\s+(.+)$/m);
            if (s && s[1]) {
              const c = ye(s[1].trim());
              if (kn.add(r), c && Nt.set(c, r), c === e)
                return ot(e, r), H.set(r, e), r;
            }
          }
        } catch (a) {
          console.warn("[slugManager] manifest title fetch failed", a);
        }
  }
  try {
    const r = await _t(t);
    if (r && r.length) {
      const a = r.find((s) => s.slug === e);
      if (a)
        return ot(e, a.path), H.set(a.path, e), a.path;
    }
  } catch (r) {
    console.warn("[slugManager] buildSearchIndex lookup failed", r);
  }
  try {
    const r = await Ci(e, t, n);
    if (r)
      return ot(e, r), H.set(r, e), r;
  } catch (r) {
    console.warn("[slugManager] crawlForSlug lookup failed", r);
  }
  const i = [`${e}.html`, `${e}.md`];
  for (const r of i)
    try {
      const a = await ke(r, t);
      if (a && a.raw)
        return ot(e, r), H.set(r, e), r;
    } catch (a) {
      console.warn("[slugManager] candidate fetch failed", a);
    }
  if ($e && $e.length)
    for (const r of $e)
      try {
        const a = r.replace(/^.*\//, "").replace(/\.(md|html?)$/i, "");
        if (ye(a) === e)
          return ot(e, r), H.set(r, e), r;
      } catch (a) {
        console.warn("[slugManager] build-time filename match failed", a);
      }
  try {
    const r = [];
    Lt && typeof Lt == "string" && Lt.trim() && r.push(Lt), r.includes("_home.md") || r.push("_home.md");
    for (const a of r)
      try {
        const s = await ke(a, t);
        if (s && s.raw) {
          const c = (s.raw || "").match(/^#\s+(.+)$/m);
          if (c && c[1] && ye(c[1].trim()) === e)
            return ot(e, a), H.set(a, e), a;
        }
      } catch {
      }
  } catch (r) {
    console.warn("[slugManager] home page fetch failed", r);
  }
  return null;
}
const dt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CRAWL_MAX_QUEUE: Mi,
  _setAllMd: Ja,
  _setSearchIndex: Ei,
  _storeSlugMapping: ot,
  addSlugResolver: Ka,
  get allMarkdownPaths() {
    return $e;
  },
  get availableLanguages() {
    return je;
  },
  awaitSearchIndex: Vn,
  buildSearchIndex: _t,
  buildSearchIndexWorker: Qn,
  clearFetchCache: rs,
  clearListCaches: es,
  crawlAllMarkdown: Pi,
  crawlCache: mn,
  crawlForSlug: Ci,
  crawlForSlugWorker: Xa,
  get defaultCrawlMaxQueue() {
    return tn;
  },
  ensureSlug: $i,
  fetchCache: Dt,
  get fetchMarkdown() {
    return ke;
  },
  getLanguages: Ga,
  getSearchIndex: ss,
  get homePage() {
    return Lt;
  },
  initSlugWorker: Qa,
  isExternalLink: ns,
  isExternalLinkWithBase: Jt,
  listPathsFetched: kn,
  listSlugCache: Nt,
  mdToSlug: H,
  get notFoundPage() {
    return Me;
  },
  removeSlugResolver: Va,
  resolveSlugPath: en,
  get searchIndex() {
    return j;
  },
  setContentBase: xn,
  setDefaultCrawlMaxQueue: os,
  setFetchMarkdown: is,
  setHomePage: Ya,
  setLanguages: xi,
  setNotFoundPage: Kn,
  setSkipRootReadme: Za,
  get skipRootReadme() {
    return cr;
  },
  slugResolvers: Ln,
  slugToMd: J,
  slugify: ye,
  unescapeMarkdown: gn,
  uniqueSlug: Li,
  whenSearchIndexReady: ht
}, Symbol.toStringTag, { value: "Module" }));
var Hn, Gr;
function ls() {
  if (Gr) return Hn;
  Gr = 1;
  function e(a, s) {
    return s.some(
      ([c, l]) => c <= a && a <= l
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
    let c = 0, l = 0, d = a.length - 1;
    const o = s.wordsPerMinute || 200, u = s.wordBound || n;
    for (; u(a[l]); ) l++;
    for (; u(a[d]); ) d--;
    const f = `${a}
`;
    for (let p = l; p <= d; p++)
      if ((t(f[p]) || !u(f[p]) && (u(f[p + 1]) || t(f[p + 1]))) && c++, t(f[p]))
        for (; p <= d && (i(f[p + 1]) || u(f[p + 1])); )
          p++;
    const h = c / o, w = Math.round(h * 60 * 1e3);
    return {
      text: Math.ceil(h.toFixed(2)) + " min read",
      minutes: h,
      time: w,
      words: c
    };
  }
  return Hn = r, Hn;
}
var cs = ls();
const us = /* @__PURE__ */ fi(cs);
function Kt(e, t) {
  let n = document.querySelector(`meta[name="${e}"]`);
  n || (n = document.createElement("meta"), n.setAttribute("name", e), document.head.appendChild(n)), n.setAttribute("content", t);
}
function lt(e, t, n) {
  let i = `meta[${e}="${t}"]`, r = document.querySelector(i);
  r || (r = document.createElement("meta"), r.setAttribute(e, t), document.head.appendChild(r)), r.setAttribute("content", n);
}
function zi(e, t) {
  try {
    let n = document.querySelector(`link[rel="${e}"]`);
    n || (n = document.createElement("link"), n.setAttribute("rel", e), document.head.appendChild(n)), n.setAttribute("href", t);
  } catch (n) {
    console.warn("[seoManager] upsertLinkRel failed", n);
  }
}
function hs(e, t, n, i) {
  const r = t && String(t).trim() ? t : e.title || document.title;
  lt("property", "og:title", r);
  const a = i && String(i).trim() ? i : e.description || "";
  a && String(a).trim() && lt("property", "og:description", a), a && String(a).trim() && lt("name", "twitter:description", a), lt("name", "twitter:card", e.twitter_card || "summary_large_image");
  const s = n || e.image;
  s && (lt("property", "og:image", s), lt("name", "twitter:image", s));
}
function ur(e, t, n, i, r = "") {
  const a = e.meta || {}, s = document && document.querySelector && document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", c = i && String(i).trim() ? i : a.description && String(a.description).trim() ? a.description : s && String(s).trim() ? s : "";
  c && String(c).trim() && Kt("description", c), Kt("robots", a.robots || "index,follow"), hs(a, t, n, c);
}
function ds() {
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
function hr(e, t, n, i, r, a = "") {
  try {
    const s = e.meta || {}, c = n && String(n).trim() ? n : s.title || a || document.title, l = r && String(r).trim() ? r : s.description || document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute("content") || "", d = i || s.image || null;
    let o = "";
    try {
      if (t) {
        const w = te(t);
        try {
          o = (location.origin + location.pathname).split("?")[0] + "?page=" + encodeURIComponent(w);
        } catch {
          o = location.href.split("#")[0];
        }
      } else
        o = location.href.split("#")[0];
    } catch (w) {
      o = location.href.split("#")[0], console.warn("[seoManager] compute canonical failed", w);
    }
    o && zi("canonical", o);
    try {
      lt("property", "og:url", o);
    } catch (w) {
      console.warn("[seoManager] upsertMeta og:url failed", w);
    }
    const u = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: c || "",
      description: l || "",
      url: o || location.href.split("#")[0]
    };
    d && (u.image = String(d)), s.date && (u.datePublished = s.date), s.dateModified && (u.dateModified = s.dateModified);
    const f = "nimbi-jsonld";
    let h = document.getElementById(f);
    h || (h = document.createElement("script"), h.type = "application/ld+json", h.id = f, document.head.appendChild(h)), h.textContent = JSON.stringify(u, null, 2);
  } catch (s) {
    console.warn("[seoManager] setStructuredData failed", s);
  }
}
let qt = typeof window < "u" && window.__SEO_MAP ? window.__SEO_MAP : {};
function fs(e) {
  try {
    if (!e || typeof e != "object") {
      qt = {};
      return;
    }
    qt = Object.assign({}, e);
  } catch (t) {
    console.warn("[seoManager] setSeoMap failed", t);
  }
}
function ps(e, t = "") {
  try {
    if (!e) return;
    const n = qt && qt[e] ? qt[e] : typeof window < "u" && window.__SEO_MAP && window.__SEO_MAP[e] ? window.__SEO_MAP[e] : null;
    try {
      const i = location.origin + location.pathname + "?page=" + encodeURIComponent(String(e || ""));
      zi("canonical", i);
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
      n.description && Kt("description", String(n.description));
    } catch {
    }
    try {
      try {
        ur({ meta: n }, n.title || void 0, n.image || void 0, n.description || void 0, t);
      } catch {
      }
    } catch {
    }
    try {
      hr({ meta: n }, e, n.title || void 0, n.image || void 0, n.description || void 0, t);
    } catch (i) {
      console.warn("[seoManager] inject structured data failed", i);
    }
  } catch (n) {
    console.warn("[seoManager] injectSeoForPage failed", n);
  }
}
function wn(e = {}, t = "", n = void 0, i = void 0) {
  try {
    const r = e || {}, a = typeof n == "string" && n.trim() ? n : r.title || "Not Found", s = typeof i == "string" && i.trim() ? i : r.description || "";
    try {
      Kt("robots", "noindex,follow");
    } catch {
    }
    try {
      s && String(s).trim() && Kt("description", String(s));
    } catch {
    }
    try {
      ur({ meta: Object.assign({}, r, { robots: "noindex,follow" }) }, a, r.image || void 0, s);
    } catch {
    }
    try {
      hr({ meta: Object.assign({}, r, { title: a, description: s }) }, t || "", a, r.image || void 0, s);
    } catch {
    }
  } catch (r) {
    console.warn("[seoManager] markNotFound failed", r);
  }
}
function gs(e, t, n, i, r, a, s, c, l, d, o) {
  try {
    if (i && i.querySelector) {
      const u = i.querySelector(".menu-label");
      u && (u.textContent = c && c.textContent || e("onThisPage"));
    }
  } catch (u) {
    console.warn("[seoManager] update toc label failed", u);
  }
  try {
    const u = n.meta && n.meta.title ? String(n.meta.title).trim() : "", f = r.querySelector("img"), h = f && (f.getAttribute("src") || f.src) || null;
    let w = "";
    try {
      let g = "";
      try {
        const y = c || (r && r.querySelector ? r.querySelector("h1") : null);
        if (y) {
          let b = y.nextElementSibling;
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
          k.length && (g = k.join(" ").replace(/\s+/g, " ").trim()), !g && l && (g = String(l).trim());
        }
      } catch (y) {
        console.warn("[seoManager] compute descOverride failed", y);
      }
      g && String(g).length > 160 && (g = String(g).slice(0, 157).trim() + "..."), w = g;
    } catch (g) {
      console.warn("[seoManager] compute descOverride failed", g);
    }
    let m = "";
    try {
      u && (m = u);
    } catch {
    }
    if (!m)
      try {
        c && c.textContent && (m = String(c.textContent).trim());
      } catch {
      }
    if (!m)
      try {
        const g = r.querySelector("h2");
        g && g.textContent && (m = String(g.textContent).trim());
      } catch {
      }
    m || (m = a || "");
    try {
      ur(n, m || void 0, h, w);
    } catch (g) {
      console.warn("[seoManager] setMetaTags failed", g);
    }
    try {
      hr(n, d, m || void 0, h, w, t);
    } catch (g) {
      console.warn("[seoManager] setStructuredData failed", g);
    }
    const p = ds();
    m ? p ? document.title = `${p} - ${m}` : document.title = `${t || "Site"} - ${m}` : u ? document.title = u : document.title = t || document.title;
  } catch (u) {
    console.warn("[seoManager] applyPageMeta failed", u);
  }
  try {
    try {
      const u = r.querySelectorAll(".nimbi-reading-time");
      u && u.forEach((f) => f.remove());
    } catch {
    }
    if (l) {
      const u = us(o.raw || ""), f = u && typeof u.minutes == "number" ? Math.ceil(u.minutes) : 0, h = f ? e("readingTime", { minutes: f }) : "";
      if (!h) return;
      const w = r.querySelector("h1");
      if (w) {
        const m = r.querySelector(".nimbi-article-subtitle");
        try {
          if (m) {
            const p = document.createElement("span");
            p.className = "nimbi-reading-time", p.textContent = h, m.appendChild(p);
          } else {
            const p = document.createElement("p");
            p.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const g = document.createElement("span");
            g.className = "nimbi-reading-time", g.textContent = h, p.appendChild(g);
            try {
              w.parentElement.insertBefore(p, w.nextSibling);
            } catch {
              try {
                w.insertAdjacentElement("afterend", p);
              } catch {
              }
            }
          }
        } catch {
          try {
            const g = document.createElement("p");
            g.className = "nimbi-article-subtitle is-6 has-text-grey-light";
            const y = document.createElement("span");
            y.className = "nimbi-reading-time", y.textContent = h, g.appendChild(y), w.insertAdjacentElement("afterend", g);
          } catch {
          }
        }
      }
    }
  } catch (u) {
    console.warn("[seoManager] reading time update failed", u);
  }
}
let Ii = 100;
function Qr(e) {
  Ii = e;
}
let jt = 300 * 1e3;
function Xr(e) {
  jt = e;
}
const Ge = /* @__PURE__ */ new Map();
function ms(e) {
  if (!Ge.has(e)) return;
  const t = Ge.get(e), n = Date.now();
  if (t.ts + jt < n) {
    Ge.delete(e);
    return;
  }
  return Ge.delete(e), Ge.set(e, t), t.value;
}
function ws(e, t) {
  if (Kr(), Kr(), Ge.delete(e), Ge.set(e, { value: t, ts: Date.now() }), Ge.size > Ii) {
    const n = Ge.keys().next().value;
    n !== void 0 && Ge.delete(n);
  }
}
function Kr() {
  if (!jt || jt <= 0) return;
  const e = Date.now();
  for (const [t, n] of Ge.entries())
    n.ts + jt < e && Ge.delete(t);
}
async function ys(e, t) {
  const n = new Set(tt), i = document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");
  for (const r of Array.from(i || [])) {
    const a = r.getAttribute("href") || "";
    if (a)
      try {
        try {
          const u = Ke(a);
          if (u) {
            if (u.type === "canonical" && u.page) {
              const f = te(u.page);
              if (f) {
                n.add(f);
                continue;
              }
            }
            if (u.type === "cosmetic" && u.page) {
              const f = u.page;
              if (J.has(f)) {
                const h = J.get(f);
                if (h) return h;
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
          let u = te(c[1]);
          u && n.add(u);
          continue;
        }
        const l = (r.textContent || "").trim(), d = (s.pathname || "").replace(/^.*\//, "");
        if (l && ye(l) === e || d && ye(d.replace(/\.(html?|md)$/i, "")) === e) return s.toString();
        if (/\.(html?)$/i.test(s.pathname)) {
          let u = s.pathname.replace(/^\//, "");
          n.add(u);
          continue;
        }
        const o = s.pathname || "";
        if (o) {
          const u = new URL(t), f = xt(u.pathname);
          if (o.indexOf(f) !== -1) {
            let h = o.startsWith(f) ? o.slice(f.length) : o;
            h = te(h), h && n.add(h);
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
        if (c && ye(c) === e)
          return r;
      }
    } catch (a) {
      console.warn("[router] fetchMarkdown during index discovery failed", a);
    }
  return null;
}
function bs(e) {
  const t = [];
  if (String(e).includes(".md") || String(e).includes(".html"))
    /index\.html$/i.test(e) || t.push(e);
  else
    try {
      const n = decodeURIComponent(String(e || ""));
      if (J.has(n)) {
        const i = en(n) || J.get(n);
        i && (/\.(md|html?)$/i.test(i) ? /index\.html$/i.test(i) || t.push(i) : (t.push(i), t.push(i + ".html")));
      } else {
        if (tt && tt.size)
          for (const i of tt) {
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
async function _s(e, t) {
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
    const p = Ke(typeof location < "u" ? location.href : "");
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
  const l = `${e}|||${typeof Da < "u" && ft ? ft : ""}`, d = ms(l);
  if (d)
    r = d.resolved, a = d.anchor || a;
  else {
    if (!String(r).includes(".md") && !String(r).includes(".html")) {
      let p = decodeURIComponent(String(r || ""));
      if (p && typeof p == "string" && (p = te(p), p = Tt(p)), J.has(p))
        r = en(p) || J.get(p);
      else {
        let g = await ys(p, t);
        if (g)
          r = g;
        else if (lr._refreshed && tt && tt.size || typeof t == "string" && /^[a-z][a-z0-9+.-]*:\/\//i.test(t)) {
          const y = await $i(p, t);
          y && (r = y);
        }
      }
    }
    ws(l, { resolved: r, anchor: a });
  }
  !a && i && (a = i);
  try {
    if (r && (r.startsWith("http://") || r.startsWith("https://") || r.startsWith("/"))) {
      const p = r.startsWith("/") ? new URL(r, location.origin).toString() : r;
      try {
        const g = await fetch(p);
        if (g && g.ok) {
          const y = await g.text(), b = g && g.headers && typeof g.headers.get == "function" && g.headers.get("content-type") || "", k = (y || "").toLowerCase();
          if (b && b.indexOf && b.indexOf("text/html") !== -1 || k.indexOf("<!doctype") !== -1 || k.indexOf("<html") !== -1) {
            if (!s)
              try {
                let M = p;
                try {
                  M = new URL(p).pathname.replace(/^\//, "");
                } catch {
                  M = String(p || "").replace(/^\//, "");
                }
                const q = M.replace(/\.html$/i, ".md");
                try {
                  const $ = await ke(q, t);
                  if ($ && $.raw)
                    return { data: $, pagePath: q, anchor: a };
                } catch {
                }
                try {
                  const $ = await ke(Me, t);
                  if ($ && $.raw) {
                    try {
                      wn($.meta || {}, Me);
                    } catch {
                    }
                    return { data: $, pagePath: Me, anchor: a };
                  }
                } catch {
                }
                try {
                  m = new Error("site shell detected (absolute fetch)");
                } catch {
                }
              } catch {
              }
            if (k.indexOf('<div id="app"') !== -1 || k.indexOf("nimbi-cms") !== -1 || k.indexOf("nimbi-mount") !== -1 || k.indexOf("nimbi-") !== -1 || k.indexOf("initcms(") !== -1 || k.indexOf("window.nimbi") !== -1 || /\bnimbi\b/.test(k))
              try {
                let M = p;
                try {
                  M = new URL(p).pathname.replace(/^\//, "");
                } catch {
                  M = String(p || "").replace(/^\//, "");
                }
                const q = M.replace(/\.html$/i, ".md");
                try {
                  const $ = await ke(q, t);
                  if ($ && $.raw)
                    return { data: $, pagePath: q, anchor: a };
                } catch {
                }
                try {
                  const $ = await ke(Me, t);
                  if ($ && $.raw) {
                    try {
                      wn($.meta || {}, Me);
                    } catch {
                    }
                    return { data: $, pagePath: Me, anchor: a };
                  }
                } catch {
                }
                try {
                  m = new Error("site shell detected (absolute fetch)");
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
  const o = bs(r);
  try {
    try {
      console.warn("[router-debug] fetchPageData candidates", { originalRaw: n, resolved: r, pageCandidates: o });
    } catch {
    }
  } catch {
  }
  const u = String(n || "").includes(".md") || String(n || "").includes(".html");
  let f = null;
  if (!u)
    try {
      let p = decodeURIComponent(String(n || ""));
      p = te(p), p = Tt(p), p && !/\.(md|html?)$/i.test(p) && (f = p);
    } catch {
      f = null;
    }
  if (u && o.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && o.push(r), o.length === 0 && (String(r).includes(".md") || String(r).includes(".html")) && o.push(r), o.length === 1 && /index\.html$/i.test(o[0]) && !u && !J.has(r) && !J.has(decodeURIComponent(String(r || ""))) && !String(r || "").includes("/"))
    throw new Error("Unknown slug: index.html fallback prevented");
  let h = null, w = null, m = null;
  for (const p of o)
    if (p)
      try {
        const g = te(p);
        if (h = await ke(g, t), w = g, f && !J.has(f))
          try {
            let y = "";
            if (h && h.isHtml)
              try {
                const b = typeof DOMParser < "u" ? new DOMParser() : null;
                if (b) {
                  const k = b.parseFromString(h.raw || "", "text/html"), S = k.querySelector("h1") || k.querySelector("title");
                  S && S.textContent && (y = S.textContent.trim());
                }
              } catch {
              }
            else {
              const b = (h && h.raw || "").match(/^#\s+(.+)$/m);
              b && b[1] && (y = b[1].trim());
            }
            if (y && ye(y) !== f)
              try {
                if (/\.html$/i.test(g)) {
                  const k = g.replace(/\.html$/i, ".md");
                  if (o.includes(k))
                    try {
                      const S = await ke(k, t);
                      if (S && S.raw)
                        h = S, w = k;
                      else
                        try {
                          const v = await ke(Me, t);
                          if (v && v.raw)
                            h = v, w = Me;
                          else {
                            h = null, w = null, m = new Error("slug mismatch for candidate");
                            continue;
                          }
                        } catch {
                          h = null, w = null, m = new Error("slug mismatch for candidate");
                          continue;
                        }
                    } catch {
                      try {
                        const v = await ke(Me, t);
                        if (v && v.raw)
                          h = v, w = Me;
                        else {
                          h = null, w = null, m = new Error("slug mismatch for candidate");
                          continue;
                        }
                      } catch {
                        h = null, w = null, m = new Error("slug mismatch for candidate");
                        continue;
                      }
                    }
                  else {
                    h = null, w = null, m = new Error("slug mismatch for candidate");
                    continue;
                  }
                } else {
                  h = null, w = null, m = new Error("slug mismatch for candidate");
                  continue;
                }
              } catch {
                h = null, w = null, m = new Error("slug mismatch for candidate");
                continue;
              }
          } catch {
          }
        try {
          if (!u && /\.html$/i.test(g)) {
            const y = g.replace(/\.html$/i, ".md");
            if (o.includes(y))
              try {
                const k = String(h && h.raw || "").trim().slice(0, 128).toLowerCase();
                if (h && h.isHtml || /^(?:<!doctype|<html|<title|<h1)/i.test(k) || k.indexOf('<div id="app"') !== -1 || k.indexOf("nimbi-") !== -1 || k.indexOf("nimbi") !== -1 || k.indexOf("initcms(") !== -1) {
                  let v = !1;
                  try {
                    const M = await ke(y, t);
                    if (M && M.raw)
                      h = M, w = y, v = !0;
                    else
                      try {
                        const q = await ke(Me, t);
                        q && q.raw && (h = q, w = Me, v = !0);
                      } catch {
                      }
                  } catch {
                    try {
                      const q = await ke(Me, t);
                      q && q.raw && (h = q, w = Me, v = !0);
                    } catch {
                    }
                  }
                  if (!v) {
                    h = null, w = null, m = new Error("site shell detected (candidate HTML rejected)");
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
            console.warn("[router-debug] fetchPageData accepted candidate", { candidate: g, pagePath: w, isHtml: h && h.isHtml, snippet: h && h.raw ? String(h.raw).slice(0, 160) : null });
          } catch {
          }
        } catch {
        }
        break;
      } catch (g) {
        m = g;
        try {
          console.warn("[router] candidate fetch failed", { candidate: p, contentBase: t, err: g && g.message || g });
        } catch {
        }
      }
  if (!h) {
    try {
      console.warn("[router-debug] fetchPageData no data", { originalRaw: n, resolved: r, pageCandidates: o, fetchError: m && (m.message || String(m)) || null });
    } catch {
    }
    try {
      console.error("[router] fetchPageData: no page data for", { originalRaw: n, resolved: r, pageCandidates: o, contentBase: t, fetchError: m && (m.message || String(m)) || null });
    } catch {
    }
    try {
      const p = await ke(Me, t);
      if (p && p.raw) {
        try {
          wn(p.meta || {}, Me);
        } catch {
        }
        return { data: p, pagePath: Me, anchor: a };
      }
    } catch {
    }
    try {
      if (u && String(n || "").toLowerCase().includes(".html"))
        try {
          const p = new URL(String(n || ""), location.href).toString();
          console.warn("[router] attempting absolute HTML fetch fallback", p);
          const g = await fetch(p);
          if (g && g.ok) {
            const y = await g.text(), b = g && g.headers && typeof g.headers.get == "function" && g.headers.get("content-type") || "", k = (y || "").toLowerCase(), S = b && b.indexOf && b.indexOf("text/html") !== -1 || k.indexOf("<!doctype") !== -1 || k.indexOf("<html") !== -1;
            if (S || console.warn("[router] absolute fetch returned non-HTML", { abs: p, contentType: b, snippet: k.slice(0, 200) }), S) {
              const v = (y || "").toLowerCase();
              if (/<title>\s*index of\b/i.test(y) || /<h1>\s*index of\b/i.test(y) || v.indexOf("parent directory") !== -1 || /<title>\s*directory listing/i.test(y) || /<h1>\s*directory listing/i.test(y))
                try {
                  console.warn("[router] absolute fetch returned directory listing; treating as not found", { abs: p });
                } catch {
                }
              else
                try {
                  const q = p, $ = new URL(".", q).toString();
                  try {
                    const he = typeof DOMParser < "u" ? new DOMParser() : null;
                    if (he) {
                      const A = he.parseFromString(y || "", "text/html"), U = (T, ie) => {
                        try {
                          const G = ie.getAttribute(T) || "";
                          if (!G || /^(https?:)?\/\//i.test(G) || G.startsWith("/") || G.startsWith("#")) return;
                          try {
                            const ae = new URL(G, q).toString();
                            ie.setAttribute(T, ae);
                          } catch (ae) {
                            console.warn("[router] rewrite attribute failed", T, ae);
                          }
                        } catch (G) {
                          console.warn("[router] rewrite helper failed", G);
                        }
                      }, de = A.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"), oe = [];
                      for (const T of Array.from(de || []))
                        try {
                          const ie = T.tagName ? T.tagName.toLowerCase() : "";
                          if (ie === "a") continue;
                          if (T.hasAttribute("src")) {
                            const G = T.getAttribute("src");
                            U("src", T);
                            const ae = T.getAttribute("src");
                            G !== ae && oe.push({ attr: "src", tag: ie, before: G, after: ae });
                          }
                          if (T.hasAttribute("href") && ie === "link") {
                            const G = T.getAttribute("href");
                            U("href", T);
                            const ae = T.getAttribute("href");
                            G !== ae && oe.push({ attr: "href", tag: ie, before: G, after: ae });
                          }
                          if (T.hasAttribute("href") && ie !== "link") {
                            const G = T.getAttribute("href");
                            U("href", T);
                            const ae = T.getAttribute("href");
                            G !== ae && oe.push({ attr: "href", tag: ie, before: G, after: ae });
                          }
                          if (T.hasAttribute("xlink:href")) {
                            const G = T.getAttribute("xlink:href");
                            U("xlink:href", T);
                            const ae = T.getAttribute("xlink:href");
                            G !== ae && oe.push({ attr: "xlink:href", tag: ie, before: G, after: ae });
                          }
                          if (T.hasAttribute("poster")) {
                            const G = T.getAttribute("poster");
                            U("poster", T);
                            const ae = T.getAttribute("poster");
                            G !== ae && oe.push({ attr: "poster", tag: ie, before: G, after: ae });
                          }
                          if (T.hasAttribute("srcset")) {
                            const ve = (T.getAttribute("srcset") || "").split(",").map((fe) => fe.trim()).filter(Boolean).map((fe) => {
                              const [L, C] = fe.split(/\s+/, 2);
                              if (!L || /^(https?:)?\/\//i.test(L) || L.startsWith("/")) return fe;
                              try {
                                const B = new URL(L, q).toString();
                                return C ? `${B} ${C}` : B;
                              } catch {
                                return fe;
                              }
                            }).join(", ");
                            T.setAttribute("srcset", ve);
                          }
                        } catch {
                        }
                      const R = A.documentElement && A.documentElement.outerHTML ? A.documentElement.outerHTML : y;
                      try {
                        oe && oe.length && console.warn("[router] rewritten asset refs", { abs: p, rewritten: oe });
                      } catch {
                      }
                      return { data: { raw: R, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                    }
                  } catch {
                  }
                  let F = y;
                  return /<base\s+[^>]*>/i.test(y) || (/<head[^>]*>/i.test(y) ? F = y.replace(/(<head[^>]*>)/i, `$1<base href="${$}">`) : F = `<base href="${$}">` + y), { data: { raw: F, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                } catch {
                  return { data: { raw: y, isHtml: !0 }, pagePath: String(n || ""), anchor: a };
                }
            }
          }
        } catch (p) {
          console.warn("[router] absolute HTML fetch fallback failed", p);
        }
    } catch {
    }
    try {
      const p = decodeURIComponent(String(r || ""));
      if (p && !/\.(md|html?)$/i.test(p)) {
        const g = [
          `/assets/${p}.html`,
          `/assets/${p}/index.html`
        ];
        for (const y of g)
          try {
            const b = await fetch(y, { method: "GET" });
            if (b && b.ok)
              return { data: { raw: await b.text(), isHtml: !0 }, pagePath: y.replace(/^\//, ""), anchor: a };
          } catch {
          }
      }
    } catch (p) {
      console.warn("[router] assets fallback failed", p);
    }
    throw new Error("no page data");
  }
  return { data: h, pagePath: w, anchor: a };
}
function Mn() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var pt = Mn();
function Oi(e) {
  pt = e;
}
var bt = { exec: () => null };
function be(e, t = "") {
  let n = typeof e == "string" ? e : e.source, i = { replace: (r, a) => {
    let s = typeof a == "string" ? a : a.source;
    return s = s.replace(He.caret, "$1"), n = n.replace(r, s), i;
  }, getRegex: () => new RegExp(n, t) };
  return i;
}
var ks = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), He = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (e) => new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}#`), htmlBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}>`) }, xs = /^(?:[ \t]*(?:\n|$))+/, Ss = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, vs = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, nn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, As = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, dr = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Bi = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Ni = be(Bi).replace(/bull/g, dr).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Es = be(Bi).replace(/bull/g, dr).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), fr = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Ls = /^[^\n]+/, pr = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Ms = be(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", pr).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Rs = be(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, dr).getRegex(), Rn = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", gr = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Ts = be("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", gr).replace("tag", Rn).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Di = be(fr).replace("hr", nn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Rn).getRegex(), Cs = be(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Di).getRegex(), mr = { blockquote: Cs, code: Ss, def: Ms, fences: vs, heading: As, hr: nn, html: Ts, lheading: Ni, list: Rs, newline: xs, paragraph: Di, table: bt, text: Ls }, Vr = be("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", nn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Rn).getRegex(), Ps = { ...mr, lheading: Es, table: Vr, paragraph: be(fr).replace("hr", nn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Vr).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Rn).getRegex() }, $s = { ...mr, html: be(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", gr).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: bt, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: be(fr).replace("hr", nn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Ni).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, zs = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Is = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, qi = /^( {2,}|\\)\n(?!\s*$)/, Os = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Tn = /[\p{P}\p{S}]/u, wr = /[\s\p{P}\p{S}]/u, ji = /[^\s\p{P}\p{S}]/u, Bs = be(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, wr).getRegex(), Hi = /(?!~)[\p{P}\p{S}]/u, Ns = /(?!~)[\s\p{P}\p{S}]/u, Ds = /(?:[^\s\p{P}\p{S}]|~)/u, Ui = /(?![*_])[\p{P}\p{S}]/u, qs = /(?![*_])[\s\p{P}\p{S}]/u, js = /(?:[^\s\p{P}\p{S}]|[*_])/u, Hs = be(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", ks ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Fi = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, Us = be(Fi, "u").replace(/punct/g, Tn).getRegex(), Fs = be(Fi, "u").replace(/punct/g, Hi).getRegex(), Wi = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Ws = be(Wi, "gu").replace(/notPunctSpace/g, ji).replace(/punctSpace/g, wr).replace(/punct/g, Tn).getRegex(), Zs = be(Wi, "gu").replace(/notPunctSpace/g, Ds).replace(/punctSpace/g, Ns).replace(/punct/g, Hi).getRegex(), Gs = be("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, ji).replace(/punctSpace/g, wr).replace(/punct/g, Tn).getRegex(), Qs = be(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Ui).getRegex(), Xs = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", Ks = be(Xs, "gu").replace(/notPunctSpace/g, js).replace(/punctSpace/g, qs).replace(/punct/g, Ui).getRegex(), Vs = be(/\\(punct)/, "gu").replace(/punct/g, Tn).getRegex(), Ys = be(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Js = be(gr).replace("(?:-->|$)", "-->").getRegex(), eo = be("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Js).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Sn = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, to = be(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Sn).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Zi = be(/^!?\[(label)\]\[(ref)\]/).replace("label", Sn).replace("ref", pr).getRegex(), Gi = be(/^!?\[(ref)\](?:\[\])?/).replace("ref", pr).getRegex(), no = be("reflink|nolink(?!\\()", "g").replace("reflink", Zi).replace("nolink", Gi).getRegex(), Yr = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, yr = { _backpedal: bt, anyPunctuation: Vs, autolink: Ys, blockSkip: Hs, br: qi, code: Is, del: bt, delLDelim: bt, delRDelim: bt, emStrongLDelim: Us, emStrongRDelimAst: Ws, emStrongRDelimUnd: Gs, escape: zs, link: to, nolink: Gi, punctuation: Bs, reflink: Zi, reflinkSearch: no, tag: eo, text: Os, url: bt }, ro = { ...yr, link: be(/^!?\[(label)\]\((.*?)\)/).replace("label", Sn).getRegex(), reflink: be(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Sn).getRegex() }, Yn = { ...yr, emStrongRDelimAst: Zs, emStrongLDelim: Fs, delLDelim: Qs, delRDelim: Ks, url: be(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Yr).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: be(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Yr).getRegex() }, io = { ...Yn, br: be(qi).replace("{2,}", "*").getRegex(), text: be(Yn.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, dn = { normal: mr, gfm: Ps, pedantic: $s }, $t = { normal: yr, gfm: Yn, breaks: io, pedantic: ro }, ao = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Jr = (e) => ao[e];
function Je(e, t) {
  if (t) {
    if (He.escapeTest.test(e)) return e.replace(He.escapeReplace, Jr);
  } else if (He.escapeTestNoEncode.test(e)) return e.replace(He.escapeReplaceNoEncode, Jr);
  return e;
}
function ei(e) {
  try {
    e = encodeURI(e).replace(He.percentDecode, "%");
  } catch {
    return null;
  }
  return e;
}
function ti(e, t) {
  let n = e.replace(He.findPipe, (a, s, c) => {
    let l = !1, d = s;
    for (; --d >= 0 && c[d] === "\\"; ) l = !l;
    return l ? "|" : " |";
  }), i = n.split(He.splitPipe), r = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !i.at(-1)?.trim() && i.pop(), t) if (i.length > t) i.splice(t);
  else for (; i.length < t; ) i.push("");
  for (; r < i.length; r++) i[r] = i[r].trim().replace(He.slashPipe, "|");
  return i;
}
function zt(e, t, n) {
  let i = e.length;
  if (i === 0) return "";
  let r = 0;
  for (; r < i && e.charAt(i - r - 1) === t; )
    r++;
  return e.slice(0, i - r);
}
function so(e, t) {
  if (e.indexOf(t[1]) === -1) return -1;
  let n = 0;
  for (let i = 0; i < e.length; i++) if (e[i] === "\\") i++;
  else if (e[i] === t[0]) n++;
  else if (e[i] === t[1] && (n--, n < 0)) return i;
  return n > 0 ? -2 : -1;
}
function oo(e, t = 0) {
  let n = t, i = "";
  for (let r of e) if (r === "	") {
    let a = 4 - n % 4;
    i += " ".repeat(a), n += a;
  } else i += r, n++;
  return i;
}
function ni(e, t, n, i, r) {
  let a = t.href, s = t.title || null, c = e[1].replace(r.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  let l = { type: e[0].charAt(0) === "!" ? "image" : "link", raw: n, href: a, title: s, text: c, tokens: i.inlineTokens(c) };
  return i.state.inLink = !1, l;
}
function lo(e, t, n) {
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
var Vt = class {
  options;
  rules;
  lexer;
  constructor(e) {
    this.options = e || pt;
  }
  space(e) {
    let t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0) return { type: "space", raw: t[0] };
  }
  code(e) {
    let t = this.rules.block.code.exec(e);
    if (t) {
      let n = t[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : zt(n, `
`) };
    }
  }
  fences(e) {
    let t = this.rules.block.fences.exec(e);
    if (t) {
      let n = t[0], i = lo(n, t[3] || "", this.rules);
      return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: i };
    }
  }
  heading(e) {
    let t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let i = zt(n, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceChar.test(i)) && (n = i.trim());
      }
      return { type: "heading", raw: t[0], depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t) return { type: "hr", raw: zt(t[0], `
`) };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = zt(t[0], `
`).split(`
`), i = "", r = "", a = [];
      for (; n.length > 0; ) {
        let s = !1, c = [], l;
        for (l = 0; l < n.length; l++) if (this.rules.other.blockquoteStart.test(n[l])) c.push(n[l]), s = !0;
        else if (!s) c.push(n[l]);
        else break;
        n = n.slice(l);
        let d = c.join(`
`), o = d.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${d}` : d, r = r ? `${r}
${o}` : o;
        let u = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(o, a, !0), this.lexer.state.top = u, n.length === 0) break;
        let f = a.at(-1);
        if (f?.type === "code") break;
        if (f?.type === "blockquote") {
          let h = f, w = h.raw + `
` + n.join(`
`), m = this.blockquote(w);
          a[a.length - 1] = m, i = i.substring(0, i.length - h.raw.length) + m.raw, r = r.substring(0, r.length - h.text.length) + m.text;
          break;
        } else if (f?.type === "list") {
          let h = f, w = h.raw + `
` + n.join(`
`), m = this.list(w);
          a[a.length - 1] = m, i = i.substring(0, i.length - f.raw.length) + m.raw, r = r.substring(0, r.length - h.raw.length) + m.raw, n = w.substring(a.at(-1).raw.length).split(`
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
        let l = !1, d = "", o = "";
        if (!(t = a.exec(e)) || this.rules.block.hr.test(e)) break;
        d = t[0], e = e.substring(d.length);
        let u = oo(t[2].split(`
`, 1)[0], t[1].length), f = e.split(`
`, 1)[0], h = !u.trim(), w = 0;
        if (this.options.pedantic ? (w = 2, o = u.trimStart()) : h ? w = t[1].length + 1 : (w = u.search(this.rules.other.nonSpaceChar), w = w > 4 ? 1 : w, o = u.slice(w), w += t[1].length), h && this.rules.other.blankLine.test(f) && (d += f + `
`, e = e.substring(f.length + 1), l = !0), !l) {
          let m = this.rules.other.nextBulletRegex(w), p = this.rules.other.hrRegex(w), g = this.rules.other.fencesBeginRegex(w), y = this.rules.other.headingBeginRegex(w), b = this.rules.other.htmlBeginRegex(w), k = this.rules.other.blockquoteBeginRegex(w);
          for (; e; ) {
            let S = e.split(`
`, 1)[0], v;
            if (f = S, this.options.pedantic ? (f = f.replace(this.rules.other.listReplaceNesting, "  "), v = f) : v = f.replace(this.rules.other.tabCharGlobal, "    "), g.test(f) || y.test(f) || b.test(f) || k.test(f) || m.test(f) || p.test(f)) break;
            if (v.search(this.rules.other.nonSpaceChar) >= w || !f.trim()) o += `
` + v.slice(w);
            else {
              if (h || u.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || g.test(u) || y.test(u) || p.test(u)) break;
              o += `
` + f;
            }
            h = !f.trim(), d += S + `
`, e = e.substring(S.length + 1), u = v.slice(w);
          }
        }
        r.loose || (s ? r.loose = !0 : this.rules.other.doubleBlankLine.test(d) && (s = !0)), r.items.push({ type: "list_item", raw: d, task: !!this.options.gfm && this.rules.other.listIsTask.test(o), loose: !1, text: o, tokens: [] }), r.raw += d;
      }
      let c = r.items.at(-1);
      if (c) c.raw = c.raw.trimEnd(), c.text = c.text.trimEnd();
      else return;
      r.raw = r.raw.trimEnd();
      for (let l of r.items) {
        if (this.lexer.state.top = !1, l.tokens = this.lexer.blockTokens(l.text, []), l.task) {
          if (l.text = l.text.replace(this.rules.other.listReplaceTask, ""), l.tokens[0]?.type === "text" || l.tokens[0]?.type === "paragraph") {
            l.tokens[0].raw = l.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), l.tokens[0].text = l.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let o = this.lexer.inlineQueue.length - 1; o >= 0; o--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[o].src)) {
              this.lexer.inlineQueue[o].src = this.lexer.inlineQueue[o].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let d = this.rules.other.listTaskCheckbox.exec(l.raw);
          if (d) {
            let o = { type: "checkbox", raw: d[0] + " ", checked: d[0] !== "[ ]" };
            l.checked = o.checked, r.loose ? l.tokens[0] && ["paragraph", "text"].includes(l.tokens[0].type) && "tokens" in l.tokens[0] && l.tokens[0].tokens ? (l.tokens[0].raw = o.raw + l.tokens[0].raw, l.tokens[0].text = o.raw + l.tokens[0].text, l.tokens[0].tokens.unshift(o)) : l.tokens.unshift({ type: "paragraph", raw: o.raw, text: o.raw, tokens: [o] }) : l.tokens.unshift(o);
          }
        }
        if (!r.loose) {
          let d = l.tokens.filter((u) => u.type === "space"), o = d.length > 0 && d.some((u) => this.rules.other.anyLine.test(u.raw));
          r.loose = o;
        }
      }
      if (r.loose) for (let l of r.items) {
        l.loose = !0;
        for (let d of l.tokens) d.type === "text" && (d.type = "paragraph");
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
    let n = ti(t[1]), i = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: t[0], header: [], align: [], rows: [] };
    if (n.length === i.length) {
      for (let s of i) this.rules.other.tableAlignRight.test(s) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(s) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(s) ? a.align.push("left") : a.align.push(null);
      for (let s = 0; s < n.length; s++) a.header.push({ text: n[s], tokens: this.lexer.inline(n[s]), header: !0, align: a.align[s] });
      for (let s of r) a.rows.push(ti(s, a.header.length).map((c, l) => ({ text: c, tokens: this.lexer.inline(c), header: !1, align: a.align[l] })));
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
        let a = zt(n.slice(0, -1), "\\");
        if ((n.length - a.length) % 2 === 0) return;
      } else {
        let a = so(t[2], "()");
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
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? i = i.slice(1) : i = i.slice(1, -1)), ni(t, { href: i && i.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
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
      return ni(n, r, n[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, n = "") {
    let i = this.rules.inline.emStrongLDelim.exec(e);
    if (!(!i || i[3] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(i[1] || i[2]) || !n || this.rules.inline.punctuation.exec(n))) {
      let r = [...i[0]].length - 1, a, s, c = r, l = 0, d = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (d.lastIndex = 0, t = t.slice(-1 * e.length + r); (i = d.exec(t)) != null; ) {
        if (a = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !a) continue;
        if (s = [...a].length, i[3] || i[4]) {
          c += s;
          continue;
        } else if ((i[5] || i[6]) && r % 3 && !((r + s) % 3)) {
          l += s;
          continue;
        }
        if (c -= s, c > 0) continue;
        s = Math.min(s, s + c + l);
        let o = [...i[0]][0].length, u = e.slice(0, r + i.index + o + s);
        if (Math.min(r, s) % 2) {
          let h = u.slice(1, -1);
          return { type: "em", raw: u, text: h, tokens: this.lexer.inlineTokens(h) };
        }
        let f = u.slice(2, -2);
        return { type: "strong", raw: u, text: f, tokens: this.lexer.inlineTokens(f) };
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
      let r = [...i[0]].length - 1, a, s, c = r, l = this.rules.inline.delRDelim;
      for (l.lastIndex = 0, t = t.slice(-1 * e.length + r); (i = l.exec(t)) != null; ) {
        if (a = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !a || (s = [...a].length, s !== r)) continue;
        if (i[3] || i[4]) {
          c += s;
          continue;
        }
        if (c -= s, c > 0) continue;
        s = Math.min(s, s + c);
        let d = [...i[0]][0].length, o = e.slice(0, r + i.index + d + s), u = o.slice(r, -r);
        return { type: "del", raw: o, text: u, tokens: this.lexer.inlineTokens(u) };
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
}, We = class Jn {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(t) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || pt, this.options.tokenizer = this.options.tokenizer || new Vt(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: He, block: dn.normal, inline: $t.normal };
    this.options.pedantic ? (n.block = dn.pedantic, n.inline = $t.pedantic) : this.options.gfm && (n.block = dn.gfm, this.options.breaks ? n.inline = $t.breaks : n.inline = $t.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: dn, inline: $t };
  }
  static lex(t, n) {
    return new Jn(n).lex(t);
  }
  static lexInline(t, n) {
    return new Jn(n).inlineTokens(t);
  }
  lex(t) {
    t = t.replace(He.carriageReturn, `
`), this.blockTokens(t, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let i = this.inlineQueue[n];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(t, n = [], i = !1) {
    for (this.options.pedantic && (t = t.replace(He.tabCharGlobal, "    ").replace(He.spaceLine, "")); t; ) {
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
        let s = 1 / 0, c = t.slice(1), l;
        this.options.extensions.startBlock.forEach((d) => {
          l = d.call({ lexer: this }, c), typeof l == "number" && l >= 0 && (s = Math.min(s, l));
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
    let s = !1, c = "";
    for (; t; ) {
      s || (c = ""), s = !1;
      let l;
      if (this.options.extensions?.inline?.some((o) => (l = o.call({ lexer: this }, t, n)) ? (t = t.substring(l.raw.length), n.push(l), !0) : !1)) continue;
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
        let o = n.at(-1);
        l.type === "text" && o?.type === "text" ? (o.raw += l.raw, o.text += l.text) : n.push(l);
        continue;
      }
      if (l = this.tokenizer.emStrong(t, i, c)) {
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
      if (l = this.tokenizer.del(t, i, c)) {
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
      let d = t;
      if (this.options.extensions?.startInline) {
        let o = 1 / 0, u = t.slice(1), f;
        this.options.extensions.startInline.forEach((h) => {
          f = h.call({ lexer: this }, u), typeof f == "number" && f >= 0 && (o = Math.min(o, f));
        }), o < 1 / 0 && o >= 0 && (d = t.substring(0, o + 1));
      }
      if (l = this.tokenizer.inlineText(d)) {
        t = t.substring(l.raw.length), l.raw.slice(-1) !== "_" && (c = l.raw.slice(-1)), s = !0;
        let o = n.at(-1);
        o?.type === "text" ? (o.raw += l.raw, o.text += l.text) : n.push(l);
        continue;
      }
      if (t) {
        let o = "Infinite loop on byte: " + t.charCodeAt(0);
        if (this.options.silent) {
          console.error(o);
          break;
        } else throw new Error(o);
      }
    }
    return n;
  }
}, Yt = class {
  options;
  parser;
  constructor(e) {
    this.options = e || pt;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    let i = (t || "").match(He.notSpaceStart)?.[0], r = e.replace(He.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + Je(i) + '">' + (n ? r : Je(r, !0)) + `</code></pre>
` : "<pre><code>" + (n ? r : Je(r, !0)) + `</code></pre>
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
    return `<code>${Je(e, !0)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    let i = this.parser.parseInline(n), r = ei(e);
    if (r === null) return i;
    e = r;
    let a = '<a href="' + e + '"';
    return t && (a += ' title="' + Je(t) + '"'), a += ">" + i + "</a>", a;
  }
  image({ href: e, title: t, text: n, tokens: i }) {
    i && (n = this.parser.parseInline(i, this.parser.textRenderer));
    let r = ei(e);
    if (r === null) return Je(n);
    e = r;
    let a = `<img src="${e}" alt="${Je(n)}"`;
    return t && (a += ` title="${Je(t)}"`), a += ">", a;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : Je(e.text);
  }
}, Cn = class {
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
}, Ze = class er {
  options;
  renderer;
  textRenderer;
  constructor(t) {
    this.options = t || pt, this.options.renderer = this.options.renderer || new Yt(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Cn();
  }
  static parse(t, n) {
    return new er(n).parse(t);
  }
  static parseInline(t, n) {
    return new er(n).parseInline(t);
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
}, Mt = class {
  options;
  block;
  constructor(e) {
    this.options = e || pt;
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
    return this.block ? We.lex : We.lexInline;
  }
  provideParser() {
    return this.block ? Ze.parse : Ze.parseInline;
  }
}, Qi = class {
  defaults = Mn();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = Ze;
  Renderer = Yt;
  TextRenderer = Cn;
  Lexer = We;
  Tokenizer = Vt;
  Hooks = Mt;
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
        let r = this.defaults.renderer || new Yt(this.defaults);
        for (let a in n.renderer) {
          if (!(a in r)) throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a)) continue;
          let s = a, c = n.renderer[s], l = r[s];
          r[s] = (...d) => {
            let o = c.apply(r, d);
            return o === !1 && (o = l.apply(r, d)), o || "";
          };
        }
        i.renderer = r;
      }
      if (n.tokenizer) {
        let r = this.defaults.tokenizer || new Vt(this.defaults);
        for (let a in n.tokenizer) {
          if (!(a in r)) throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a)) continue;
          let s = a, c = n.tokenizer[s], l = r[s];
          r[s] = (...d) => {
            let o = c.apply(r, d);
            return o === !1 && (o = l.apply(r, d)), o;
          };
        }
        i.tokenizer = r;
      }
      if (n.hooks) {
        let r = this.defaults.hooks || new Mt();
        for (let a in n.hooks) {
          if (!(a in r)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let s = a, c = n.hooks[s], l = r[s];
          Mt.passThroughHooks.has(a) ? r[s] = (d) => {
            if (this.defaults.async && Mt.passThroughHooksRespectAsync.has(a)) return (async () => {
              let u = await c.call(r, d);
              return l.call(r, u);
            })();
            let o = c.call(r, d);
            return l.call(r, o);
          } : r[s] = (...d) => {
            if (this.defaults.async) return (async () => {
              let u = await c.apply(r, d);
              return u === !1 && (u = await l.apply(r, d)), u;
            })();
            let o = c.apply(r, d);
            return o === !1 && (o = l.apply(r, d)), o;
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
    return We.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return Ze.parse(e, t ?? this.defaults);
  }
  parseMarkdown(e) {
    return (t, n) => {
      let i = { ...n }, r = { ...this.defaults, ...i }, a = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && i.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof t > "u" || t === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof t != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = e), r.async) return (async () => {
        let s = r.hooks ? await r.hooks.preprocess(t) : t, c = await (r.hooks ? await r.hooks.provideLexer() : e ? We.lex : We.lexInline)(s, r), l = r.hooks ? await r.hooks.processAllTokens(c) : c;
        r.walkTokens && await Promise.all(this.walkTokens(l, r.walkTokens));
        let d = await (r.hooks ? await r.hooks.provideParser() : e ? Ze.parse : Ze.parseInline)(l, r);
        return r.hooks ? await r.hooks.postprocess(d) : d;
      })().catch(a);
      try {
        r.hooks && (t = r.hooks.preprocess(t));
        let s = (r.hooks ? r.hooks.provideLexer() : e ? We.lex : We.lexInline)(t, r);
        r.hooks && (s = r.hooks.processAllTokens(s)), r.walkTokens && this.walkTokens(s, r.walkTokens);
        let c = (r.hooks ? r.hooks.provideParser() : e ? Ze.parse : Ze.parseInline)(s, r);
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
        let i = "<p>An error occurred:</p><pre>" + Je(n.message + "", !0) + "</pre>";
        return t ? Promise.resolve(i) : i;
      }
      if (t) return Promise.reject(n);
      throw n;
    };
  }
}, St = new Qi();
function ge(e, t) {
  return St.parse(e, t);
}
ge.options = ge.setOptions = function(e) {
  return St.setOptions(e), ge.defaults = St.defaults, Oi(ge.defaults), ge;
};
ge.getDefaults = Mn;
ge.defaults = pt;
ge.use = function(...e) {
  return St.use(...e), ge.defaults = St.defaults, Oi(ge.defaults), ge;
};
ge.walkTokens = function(e, t) {
  return St.walkTokens(e, t);
};
ge.parseInline = St.parseInline;
ge.Parser = Ze;
ge.parser = Ze.parse;
ge.Renderer = Yt;
ge.TextRenderer = Cn;
ge.Lexer = We;
ge.lexer = We.lex;
ge.Tokenizer = Vt;
ge.Hooks = Mt;
ge.parse = ge;
var co = ge.options, uo = ge.setOptions, ho = ge.use, fo = ge.walkTokens, po = ge.parseInline, go = ge, mo = Ze.parse, wo = We.lex;
const ri = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hooks: Mt,
  Lexer: We,
  Marked: Qi,
  Parser: Ze,
  Renderer: Yt,
  TextRenderer: Cn,
  Tokenizer: Vt,
  get defaults() {
    return pt;
  },
  getDefaults: Mn,
  lexer: wo,
  marked: ge,
  options: co,
  parse: go,
  parseInline: po,
  parser: mo,
  setOptions: uo,
  use: ho,
  walkTokens: fo
}, Symbol.toStringTag, { value: "Module" })), Xi = `function O() {
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
`, ii = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", Xi], { type: "text/javascript;charset=utf-8" });
function yo(e) {
  let t;
  try {
    if (t = ii && (self.URL || self.webkitURL).createObjectURL(ii), !t) throw "";
    const n = new Worker(t, {
      type: "module",
      name: e?.name
    });
    return n.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(t);
    }), n;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(Xi),
      {
        type: "module",
        name: e?.name
      }
    );
  }
}
function vn(e) {
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
function Ki(e) {
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
const Ht = ri && (ge || ri) || void 0;
let qe = null;
const bo = "https://cdn.jsdelivr.net/npm/highlight.js";
async function An() {
  if (qe) return qe;
  try {
    try {
      const e = await import(bo + "/lib/core.js");
      qe = e.default || e;
    } catch {
      qe = null;
    }
  } catch {
    qe = null;
  }
  return qe;
}
Ht && typeof Ht.setOptions == "function" && Ht.setOptions({
  gfm: !0,
  headerIds: !0,
  mangle: !1,
  highlighted: (e, t) => {
    try {
      return qe && t && typeof qe.getLanguage == "function" && qe.getLanguage(t) ? qe.highlight(e, { language: t }).value : qe && typeof qe.getLanguage == "function" && qe.getLanguage("plaintext") ? qe.highlight(e, { language: "plaintext" }).value : e;
    } catch {
      return e;
    }
  }
});
onmessage = async (e) => {
  const t = e.data || {};
  try {
    if (t.type === "register") {
      const { name: o, url: u } = t;
      try {
        if (!await An()) {
          postMessage({ type: "register-error", name: o, error: "hljs unavailable" });
          return;
        }
        const h = await import(u), w = h.default || h;
        qe.registerLanguage(o, w), postMessage({ type: "registered", name: o });
      } catch (f) {
        postMessage({ type: "register-error", name: o, error: String(f) });
      }
      return;
    }
    if (t.type === "detect") {
      const o = t.md || "", u = t.supported || [], f = /* @__PURE__ */ new Set(), h = /```\s*([a-zA-Z0-9_\-+]+)?/g;
      let w;
      for (; w = h.exec(o); )
        if (w[1]) {
          const m = String(w[1]).toLowerCase();
          if (!m) continue;
          if (m.length >= 5 && m.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(m) && f.add(m), (/* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"])).has(m) && f.add(m), u && u.length)
            try {
              u.indexOf(m) !== -1 && f.add(m);
            } catch {
            }
        }
      postMessage({ id: t.id, result: Array.from(f) });
      return;
    }
    const { id: n, md: i } = t, { content: r, data: a } = vn(i || "");
    await An().catch(() => {
    });
    let s = Ht.parse(r);
    const c = [], l = /* @__PURE__ */ new Map(), d = (o) => {
      try {
        return String(o || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    };
    s = s.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (o, u, f, h) => {
      const w = Number(u);
      let m = h.replace(/<[^>]+>/g, "").trim();
      try {
        m = Ki(m);
      } catch {
      }
      let p = null;
      const g = (f || "").match(/\sid="([^"]+)"/);
      g && (p = g[1]);
      const y = p || d(m) || "heading", k = (l.get(y) || 0) + 1;
      l.set(y, k);
      const S = k === 1 ? y : y + "-" + k;
      c.push({ level: w, text: m, id: S });
      const v = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, M = w <= 2 ? "has-text-weight-bold" : w <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", q = (v[w] + " " + M).trim(), F = ((f || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${S}" class="${q}"`).trim();
      return `<h${w} ${F}>${h}</h${w}>`;
    }), s = s.replace(/<img([^>]*)>/g, (o, u) => /\bloading=/.test(u) ? `<img${u}>` : /\bdata-want-lazy=/.test(u) ? `<img${u}>` : `<img${u} loading="lazy">`), postMessage({ id: n, result: { html: s, meta: a || {}, toc: c } });
  } catch (n) {
    postMessage({ id: t.id, error: String(n) });
  }
};
async function _o(e) {
  try {
    if (e && e.type === "register") {
      const { name: l, url: d } = e;
      try {
        if (!await An()) return { type: "register-error", name: l, error: "hljs unavailable" };
        const u = await import(d), f = u.default || u;
        return qe.registerLanguage(l, f), { type: "registered", name: l };
      } catch (o) {
        return { type: "register-error", name: l, error: String(o) };
      }
    }
    if (e && e.type === "detect") {
      const l = e.md || "", d = e.supported || [], o = /* @__PURE__ */ new Set(), u = /``\`\s*([a-zA-Z0-9_\-+]+)?/g;
      let f;
      for (; f = u.exec(l); )
        if (f[1]) {
          const h = String(f[1]).toLowerCase();
          if (!h) continue;
          if (h.length >= 5 && h.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(h) && o.add(h), (/* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"])).has(h) && o.add(h), d && d.length)
            try {
              d.indexOf(h) !== -1 && o.add(h);
            } catch {
            }
        }
      return { id: e.id, result: Array.from(o) };
    }
    const t = e && e.id, { content: n, data: i } = vn(e && e.md || "");
    await An().catch(() => {
    });
    let r = Ht.parse(n);
    const a = [], s = /* @__PURE__ */ new Map(), c = (l) => {
      try {
        return String(l || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    };
    return r = r.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (l, d, o, u) => {
      const f = Number(d);
      let h = u.replace(/<[^>]+>/g, "").trim();
      try {
        h = Ki(h);
      } catch {
      }
      let w = null;
      const m = (o || "").match(/\sid="([^"]+)"/);
      m && (w = m[1]);
      const p = w || c(h) || "heading", y = (s.get(p) || 0) + 1;
      s.set(p, y);
      const b = y === 1 ? p : p + "-" + y;
      a.push({ level: f, text: h, id: b });
      const k = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, S = f <= 2 ? "has-text-weight-bold" : f <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", v = (k[f] + " " + S).trim(), q = ((o || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${b}" class="${v}"`).trim();
      return `<h${f} ${q}>${u}</h${f}>`;
    }), r = r.replace(/<img([^>]*)>/g, (l, d) => /\bloading=/.test(d) ? `<img${d}>` : /\bdata-want-lazy=/.test(d) ? `<img${d}>` : `<img${d} loading="lazy">`), { id: t, result: { html: r, meta: i || {}, toc: a } };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
const Un = { 100: "💯", 1234: "🔢", grinning: "😀", grimacing: "😬", grin: "😁", joy: "😂", rofl: "🤣", partying: "🥳", smiley: "😃", smile: "😄", sweat_smile: "😅", laughing: "😆", innocent: "😇", wink: "😉", blush: "😊", slightly_smiling_face: "🙂", upside_down_face: "🙃", relaxed: "☺️", yum: "😋", relieved: "😌", heart_eyes: "😍", smiling_face_with_three_hearts: "🥰", kissing_heart: "😘", kissing: "😗", kissing_smiling_eyes: "😙", kissing_closed_eyes: "😚", stuck_out_tongue_winking_eye: "😜", zany: "🤪", raised_eyebrow: "🤨", monocle: "🧐", stuck_out_tongue_closed_eyes: "😝", stuck_out_tongue: "😛", money_mouth_face: "🤑", nerd_face: "🤓", sunglasses: "😎", star_struck: "🤩", clown_face: "🤡", cowboy_hat_face: "🤠", hugs: "🤗", smirk: "😏", no_mouth: "😶", neutral_face: "😐", expressionless: "😑", unamused: "😒", roll_eyes: "🙄", thinking: "🤔", lying_face: "🤥", hand_over_mouth: "🤭", shushing: "🤫", symbols_over_mouth: "🤬", exploding_head: "🤯", flushed: "😳", disappointed: "😞", worried: "😟", angry: "😠", rage: "😡", pensive: "😔", confused: "😕", slightly_frowning_face: "🙁", frowning_face: "☹", persevere: "😣", confounded: "😖", tired_face: "😫", weary: "😩", pleading: "🥺", triumph: "😤", open_mouth: "😮", scream: "😱", fearful: "😨", cold_sweat: "😰", hushed: "😯", frowning: "😦", anguished: "😧", cry: "😢", disappointed_relieved: "😥", drooling_face: "🤤", sleepy: "😪", sweat: "😓", hot: "🥵", cold: "🥶", sob: "😭", dizzy_face: "😵", astonished: "😲", zipper_mouth_face: "🤐", nauseated_face: "🤢", sneezing_face: "🤧", vomiting: "🤮", mask: "😷", face_with_thermometer: "🤒", face_with_head_bandage: "🤕", woozy: "🥴", sleeping: "😴", zzz: "💤", poop: "💩", smiling_imp: "😈", imp: "👿", japanese_ogre: "👹", japanese_goblin: "👺", skull: "💀", ghost: "👻", alien: "👽", robot: "🤖", smiley_cat: "😺", smile_cat: "😸", joy_cat: "😹", heart_eyes_cat: "😻", smirk_cat: "😼", kissing_cat: "😽", scream_cat: "🙀", crying_cat_face: "😿", pouting_cat: "😾", palms_up: "🤲", raised_hands: "🙌", clap: "👏", wave: "👋", call_me_hand: "🤙", "+1": "👍", "-1": "👎", facepunch: "👊", fist: "✊", fist_left: "🤛", fist_right: "🤜", v: "✌", ok_hand: "👌", raised_hand: "✋", raised_back_of_hand: "🤚", open_hands: "👐", muscle: "💪", pray: "🙏", foot: "🦶", leg: "🦵", handshake: "🤝", point_up: "☝", point_up_2: "👆", point_down: "👇", point_left: "👈", point_right: "👉", fu: "🖕", raised_hand_with_fingers_splayed: "🖐", love_you: "🤟", metal: "🤘", crossed_fingers: "🤞", vulcan_salute: "🖖", writing_hand: "✍", selfie: "🤳", nail_care: "💅", lips: "👄", tooth: "🦷", tongue: "👅", ear: "👂", nose: "👃", eye: "👁", eyes: "👀", brain: "🧠", bust_in_silhouette: "👤", busts_in_silhouette: "👥", speaking_head: "🗣", baby: "👶", child: "🧒", boy: "👦", girl: "👧", adult: "🧑", man: "👨", woman: "👩", blonde_woman: "👱‍♀️", blonde_man: "👱", bearded_person: "🧔", older_adult: "🧓", older_man: "👴", older_woman: "👵", man_with_gua_pi_mao: "👲", woman_with_headscarf: "🧕", woman_with_turban: "👳‍♀️", man_with_turban: "👳", policewoman: "👮‍♀️", policeman: "👮", construction_worker_woman: "👷‍♀️", construction_worker_man: "👷", guardswoman: "💂‍♀️", guardsman: "💂", female_detective: "🕵️‍♀️", male_detective: "🕵", woman_health_worker: "👩‍⚕️", man_health_worker: "👨‍⚕️", woman_farmer: "👩‍🌾", man_farmer: "👨‍🌾", woman_cook: "👩‍🍳", man_cook: "👨‍🍳", woman_student: "👩‍🎓", man_student: "👨‍🎓", woman_singer: "👩‍🎤", man_singer: "👨‍🎤", woman_teacher: "👩‍🏫", man_teacher: "👨‍🏫", woman_factory_worker: "👩‍🏭", man_factory_worker: "👨‍🏭", woman_technologist: "👩‍💻", man_technologist: "👨‍💻", woman_office_worker: "👩‍💼", man_office_worker: "👨‍💼", woman_mechanic: "👩‍🔧", man_mechanic: "👨‍🔧", woman_scientist: "👩‍🔬", man_scientist: "👨‍🔬", woman_artist: "👩‍🎨", man_artist: "👨‍🎨", woman_firefighter: "👩‍🚒", man_firefighter: "👨‍🚒", woman_pilot: "👩‍✈️", man_pilot: "👨‍✈️", woman_astronaut: "👩‍🚀", man_astronaut: "👨‍🚀", woman_judge: "👩‍⚖️", man_judge: "👨‍⚖️", woman_superhero: "🦸‍♀️", man_superhero: "🦸‍♂️", woman_supervillain: "🦹‍♀️", man_supervillain: "🦹‍♂️", mrs_claus: "🤶", santa: "🎅", sorceress: "🧙‍♀️", wizard: "🧙‍♂️", woman_elf: "🧝‍♀️", man_elf: "🧝‍♂️", woman_vampire: "🧛‍♀️", man_vampire: "🧛‍♂️", woman_zombie: "🧟‍♀️", man_zombie: "🧟‍♂️", woman_genie: "🧞‍♀️", man_genie: "🧞‍♂️", mermaid: "🧜‍♀️", merman: "🧜‍♂️", woman_fairy: "🧚‍♀️", man_fairy: "🧚‍♂️", angel: "👼", pregnant_woman: "🤰", breastfeeding: "🤱", princess: "👸", prince: "🤴", bride_with_veil: "👰", man_in_tuxedo: "🤵", running_woman: "🏃‍♀️", running_man: "🏃", walking_woman: "🚶‍♀️", walking_man: "🚶", dancer: "💃", man_dancing: "🕺", dancing_women: "👯", dancing_men: "👯‍♂️", couple: "👫", two_men_holding_hands: "👬", two_women_holding_hands: "👭", bowing_woman: "🙇‍♀️", bowing_man: "🙇", man_facepalming: "🤦‍♂️", woman_facepalming: "🤦‍♀️", woman_shrugging: "🤷", man_shrugging: "🤷‍♂️", tipping_hand_woman: "💁", tipping_hand_man: "💁‍♂️", no_good_woman: "🙅", no_good_man: "🙅‍♂️", ok_woman: "🙆", ok_man: "🙆‍♂️", raising_hand_woman: "🙋", raising_hand_man: "🙋‍♂️", pouting_woman: "🙎", pouting_man: "🙎‍♂️", frowning_woman: "🙍", frowning_man: "🙍‍♂️", haircut_woman: "💇", haircut_man: "💇‍♂️", massage_woman: "💆", massage_man: "💆‍♂️", woman_in_steamy_room: "🧖‍♀️", man_in_steamy_room: "🧖‍♂️", couple_with_heart_woman_man: "💑", couple_with_heart_woman_woman: "👩‍❤️‍👩", couple_with_heart_man_man: "👨‍❤️‍👨", couplekiss_man_woman: "💏", couplekiss_woman_woman: "👩‍❤️‍💋‍👩", couplekiss_man_man: "👨‍❤️‍💋‍👨", family_man_woman_boy: "👪", family_man_woman_girl: "👨‍👩‍👧", family_man_woman_girl_boy: "👨‍👩‍👧‍👦", family_man_woman_boy_boy: "👨‍👩‍👦‍👦", family_man_woman_girl_girl: "👨‍👩‍👧‍👧", family_woman_woman_boy: "👩‍👩‍👦", family_woman_woman_girl: "👩‍👩‍👧", family_woman_woman_girl_boy: "👩‍👩‍👧‍👦", family_woman_woman_boy_boy: "👩‍👩‍👦‍👦", family_woman_woman_girl_girl: "👩‍👩‍👧‍👧", family_man_man_boy: "👨‍👨‍👦", family_man_man_girl: "👨‍👨‍👧", family_man_man_girl_boy: "👨‍👨‍👧‍👦", family_man_man_boy_boy: "👨‍👨‍👦‍👦", family_man_man_girl_girl: "👨‍👨‍👧‍👧", family_woman_boy: "👩‍👦", family_woman_girl: "👩‍👧", family_woman_girl_boy: "👩‍👧‍👦", family_woman_boy_boy: "👩‍👦‍👦", family_woman_girl_girl: "👩‍👧‍👧", family_man_boy: "👨‍👦", family_man_girl: "👨‍👧", family_man_girl_boy: "👨‍👧‍👦", family_man_boy_boy: "👨‍👦‍👦", family_man_girl_girl: "👨‍👧‍👧", yarn: "🧶", thread: "🧵", coat: "🧥", labcoat: "🥼", womans_clothes: "👚", tshirt: "👕", jeans: "👖", necktie: "👔", dress: "👗", bikini: "👙", kimono: "👘", lipstick: "💄", kiss: "💋", footprints: "👣", flat_shoe: "🥿", high_heel: "👠", sandal: "👡", boot: "👢", mans_shoe: "👞", athletic_shoe: "👟", hiking_boot: "🥾", socks: "🧦", gloves: "🧤", scarf: "🧣", womans_hat: "👒", tophat: "🎩", billed_hat: "🧢", rescue_worker_helmet: "⛑", mortar_board: "🎓", crown: "👑", school_satchel: "🎒", luggage: "🧳", pouch: "👝", purse: "👛", handbag: "👜", briefcase: "💼", eyeglasses: "👓", dark_sunglasses: "🕶", goggles: "🥽", ring: "💍", closed_umbrella: "🌂", dog: "🐶", cat: "🐱", mouse: "🐭", hamster: "🐹", rabbit: "🐰", fox_face: "🦊", bear: "🐻", panda_face: "🐼", koala: "🐨", tiger: "🐯", lion: "🦁", cow: "🐮", pig: "🐷", pig_nose: "🐽", frog: "🐸", squid: "🦑", octopus: "🐙", shrimp: "🦐", monkey_face: "🐵", gorilla: "🦍", see_no_evil: "🙈", hear_no_evil: "🙉", speak_no_evil: "🙊", monkey: "🐒", chicken: "🐔", penguin: "🐧", bird: "🐦", baby_chick: "🐤", hatching_chick: "🐣", hatched_chick: "🐥", duck: "🦆", eagle: "🦅", owl: "🦉", bat: "🦇", wolf: "🐺", boar: "🐗", horse: "🐴", unicorn: "🦄", honeybee: "🐝", bug: "🐛", butterfly: "🦋", snail: "🐌", beetle: "🐞", ant: "🐜", grasshopper: "🦗", spider: "🕷", scorpion: "🦂", crab: "🦀", snake: "🐍", lizard: "🦎", "t-rex": "🦖", sauropod: "🦕", turtle: "🐢", tropical_fish: "🐠", fish: "🐟", blowfish: "🐡", dolphin: "🐬", shark: "🦈", whale: "🐳", whale2: "🐋", crocodile: "🐊", leopard: "🐆", zebra: "🦓", tiger2: "🐅", water_buffalo: "🐃", ox: "🐂", cow2: "🐄", deer: "🦌", dromedary_camel: "🐪", camel: "🐫", giraffe: "🦒", elephant: "🐘", rhinoceros: "🦏", goat: "🐐", ram: "🐏", sheep: "🐑", racehorse: "🐎", pig2: "🐖", rat: "🐀", mouse2: "🐁", rooster: "🐓", turkey: "🦃", dove: "🕊", dog2: "🐕", poodle: "🐩", cat2: "🐈", rabbit2: "🐇", chipmunk: "🐿", hedgehog: "🦔", raccoon: "🦝", llama: "🦙", hippopotamus: "🦛", kangaroo: "🦘", badger: "🦡", swan: "🦢", peacock: "🦚", parrot: "🦜", lobster: "🦞", mosquito: "🦟", paw_prints: "🐾", dragon: "🐉", dragon_face: "🐲", cactus: "🌵", christmas_tree: "🎄", evergreen_tree: "🌲", deciduous_tree: "🌳", palm_tree: "🌴", seedling: "🌱", herb: "🌿", shamrock: "☘", four_leaf_clover: "🍀", bamboo: "🎍", tanabata_tree: "🎋", leaves: "🍃", fallen_leaf: "🍂", maple_leaf: "🍁", ear_of_rice: "🌾", hibiscus: "🌺", sunflower: "🌻", rose: "🌹", wilted_flower: "🥀", tulip: "🌷", blossom: "🌼", cherry_blossom: "🌸", bouquet: "💐", mushroom: "🍄", chestnut: "🌰", jack_o_lantern: "🎃", shell: "🐚", spider_web: "🕸", earth_americas: "🌎", earth_africa: "🌍", earth_asia: "🌏", full_moon: "🌕", waning_gibbous_moon: "🌖", last_quarter_moon: "🌗", waning_crescent_moon: "🌘", new_moon: "🌑", waxing_crescent_moon: "🌒", first_quarter_moon: "🌓", waxing_gibbous_moon: "🌔", new_moon_with_face: "🌚", full_moon_with_face: "🌝", first_quarter_moon_with_face: "🌛", last_quarter_moon_with_face: "🌜", sun_with_face: "🌞", crescent_moon: "🌙", star: "⭐", star2: "🌟", dizzy: "💫", sparkles: "✨", comet: "☄", sunny: "☀️", sun_behind_small_cloud: "🌤", partly_sunny: "⛅", sun_behind_large_cloud: "🌥", sun_behind_rain_cloud: "🌦", cloud: "☁️", cloud_with_rain: "🌧", cloud_with_lightning_and_rain: "⛈", cloud_with_lightning: "🌩", zap: "⚡", fire: "🔥", boom: "💥", snowflake: "❄️", cloud_with_snow: "🌨", snowman: "⛄", snowman_with_snow: "☃", wind_face: "🌬", dash: "💨", tornado: "🌪", fog: "🌫", open_umbrella: "☂", umbrella: "☔", droplet: "💧", sweat_drops: "💦", ocean: "🌊", green_apple: "🍏", apple: "🍎", pear: "🍐", tangerine: "🍊", lemon: "🍋", banana: "🍌", watermelon: "🍉", grapes: "🍇", strawberry: "🍓", melon: "🍈", cherries: "🍒", peach: "🍑", pineapple: "🍍", coconut: "🥥", kiwi_fruit: "🥝", mango: "🥭", avocado: "🥑", broccoli: "🥦", tomato: "🍅", eggplant: "🍆", cucumber: "🥒", carrot: "🥕", hot_pepper: "🌶", potato: "🥔", corn: "🌽", leafy_greens: "🥬", sweet_potato: "🍠", peanuts: "🥜", honey_pot: "🍯", croissant: "🥐", bread: "🍞", baguette_bread: "🥖", bagel: "🥯", pretzel: "🥨", cheese: "🧀", egg: "🥚", bacon: "🥓", steak: "🥩", pancakes: "🥞", poultry_leg: "🍗", meat_on_bone: "🍖", bone: "🦴", fried_shrimp: "🍤", fried_egg: "🍳", hamburger: "🍔", fries: "🍟", stuffed_flatbread: "🥙", hotdog: "🌭", pizza: "🍕", sandwich: "🥪", canned_food: "🥫", spaghetti: "🍝", taco: "🌮", burrito: "🌯", green_salad: "🥗", shallow_pan_of_food: "🥘", ramen: "🍜", stew: "🍲", fish_cake: "🍥", fortune_cookie: "🥠", sushi: "🍣", bento: "🍱", curry: "🍛", rice_ball: "🍙", rice: "🍚", rice_cracker: "🍘", oden: "🍢", dango: "🍡", shaved_ice: "🍧", ice_cream: "🍨", icecream: "🍦", pie: "🥧", cake: "🍰", cupcake: "🧁", moon_cake: "🥮", birthday: "🎂", custard: "🍮", candy: "🍬", lollipop: "🍭", chocolate_bar: "🍫", popcorn: "🍿", dumpling: "🥟", doughnut: "🍩", cookie: "🍪", milk_glass: "🥛", beer: "🍺", beers: "🍻", clinking_glasses: "🥂", wine_glass: "🍷", tumbler_glass: "🥃", cocktail: "🍸", tropical_drink: "🍹", champagne: "🍾", sake: "🍶", tea: "🍵", cup_with_straw: "🥤", coffee: "☕", baby_bottle: "🍼", salt: "🧂", spoon: "🥄", fork_and_knife: "🍴", plate_with_cutlery: "🍽", bowl_with_spoon: "🥣", takeout_box: "🥡", chopsticks: "🥢", soccer: "⚽", basketball: "🏀", football: "🏈", baseball: "⚾", softball: "🥎", tennis: "🎾", volleyball: "🏐", rugby_football: "🏉", flying_disc: "🥏", "8ball": "🎱", golf: "⛳", golfing_woman: "🏌️‍♀️", golfing_man: "🏌", ping_pong: "🏓", badminton: "🏸", goal_net: "🥅", ice_hockey: "🏒", field_hockey: "🏑", lacrosse: "🥍", cricket: "🏏", ski: "🎿", skier: "⛷", snowboarder: "🏂", person_fencing: "🤺", women_wrestling: "🤼‍♀️", men_wrestling: "🤼‍♂️", woman_cartwheeling: "🤸‍♀️", man_cartwheeling: "🤸‍♂️", woman_playing_handball: "🤾‍♀️", man_playing_handball: "🤾‍♂️", ice_skate: "⛸", curling_stone: "🥌", skateboard: "🛹", sled: "🛷", bow_and_arrow: "🏹", fishing_pole_and_fish: "🎣", boxing_glove: "🥊", martial_arts_uniform: "🥋", rowing_woman: "🚣‍♀️", rowing_man: "🚣", climbing_woman: "🧗‍♀️", climbing_man: "🧗‍♂️", swimming_woman: "🏊‍♀️", swimming_man: "🏊", woman_playing_water_polo: "🤽‍♀️", man_playing_water_polo: "🤽‍♂️", woman_in_lotus_position: "🧘‍♀️", man_in_lotus_position: "🧘‍♂️", surfing_woman: "🏄‍♀️", surfing_man: "🏄", bath: "🛀", basketball_woman: "⛹️‍♀️", basketball_man: "⛹", weight_lifting_woman: "🏋️‍♀️", weight_lifting_man: "🏋", biking_woman: "🚴‍♀️", biking_man: "🚴", mountain_biking_woman: "🚵‍♀️", mountain_biking_man: "🚵", horse_racing: "🏇", business_suit_levitating: "🕴", trophy: "🏆", running_shirt_with_sash: "🎽", medal_sports: "🏅", medal_military: "🎖", "1st_place_medal": "🥇", "2nd_place_medal": "🥈", "3rd_place_medal": "🥉", reminder_ribbon: "🎗", rosette: "🏵", ticket: "🎫", tickets: "🎟", performing_arts: "🎭", art: "🎨", circus_tent: "🎪", woman_juggling: "🤹‍♀️", man_juggling: "🤹‍♂️", microphone: "🎤", headphones: "🎧", musical_score: "🎼", musical_keyboard: "🎹", drum: "🥁", saxophone: "🎷", trumpet: "🎺", guitar: "🎸", violin: "🎻", clapper: "🎬", video_game: "🎮", space_invader: "👾", dart: "🎯", game_die: "🎲", chess_pawn: "♟", slot_machine: "🎰", jigsaw: "🧩", bowling: "🎳", red_car: "🚗", taxi: "🚕", blue_car: "🚙", bus: "🚌", trolleybus: "🚎", racing_car: "🏎", police_car: "🚓", ambulance: "🚑", fire_engine: "🚒", minibus: "🚐", truck: "🚚", articulated_lorry: "🚛", tractor: "🚜", kick_scooter: "🛴", motorcycle: "🏍", bike: "🚲", motor_scooter: "🛵", rotating_light: "🚨", oncoming_police_car: "🚔", oncoming_bus: "🚍", oncoming_automobile: "🚘", oncoming_taxi: "🚖", aerial_tramway: "🚡", mountain_cableway: "🚠", suspension_railway: "🚟", railway_car: "🚃", train: "🚋", monorail: "🚝", bullettrain_side: "🚄", bullettrain_front: "🚅", light_rail: "🚈", mountain_railway: "🚞", steam_locomotive: "🚂", train2: "🚆", metro: "🚇", tram: "🚊", station: "🚉", flying_saucer: "🛸", helicopter: "🚁", small_airplane: "🛩", airplane: "✈️", flight_departure: "🛫", flight_arrival: "🛬", sailboat: "⛵", motor_boat: "🛥", speedboat: "🚤", ferry: "⛴", passenger_ship: "🛳", rocket: "🚀", artificial_satellite: "🛰", seat: "💺", canoe: "🛶", anchor: "⚓", construction: "🚧", fuelpump: "⛽", busstop: "🚏", vertical_traffic_light: "🚦", traffic_light: "🚥", checkered_flag: "🏁", ship: "🚢", ferris_wheel: "🎡", roller_coaster: "🎢", carousel_horse: "🎠", building_construction: "🏗", foggy: "🌁", tokyo_tower: "🗼", factory: "🏭", fountain: "⛲", rice_scene: "🎑", mountain: "⛰", mountain_snow: "🏔", mount_fuji: "🗻", volcano: "🌋", japan: "🗾", camping: "🏕", tent: "⛺", national_park: "🏞", motorway: "🛣", railway_track: "🛤", sunrise: "🌅", sunrise_over_mountains: "🌄", desert: "🏜", beach_umbrella: "🏖", desert_island: "🏝", city_sunrise: "🌇", city_sunset: "🌆", cityscape: "🏙", night_with_stars: "🌃", bridge_at_night: "🌉", milky_way: "🌌", stars: "🌠", sparkler: "🎇", fireworks: "🎆", rainbow: "🌈", houses: "🏘", european_castle: "🏰", japanese_castle: "🏯", stadium: "🏟", statue_of_liberty: "🗽", house: "🏠", house_with_garden: "🏡", derelict_house: "🏚", office: "🏢", department_store: "🏬", post_office: "🏣", european_post_office: "🏤", hospital: "🏥", bank: "🏦", hotel: "🏨", convenience_store: "🏪", school: "🏫", love_hotel: "🏩", wedding: "💒", classical_building: "🏛", church: "⛪", mosque: "🕌", synagogue: "🕍", kaaba: "🕋", shinto_shrine: "⛩", watch: "⌚", iphone: "📱", calling: "📲", computer: "💻", keyboard: "⌨", desktop_computer: "🖥", printer: "🖨", computer_mouse: "🖱", trackball: "🖲", joystick: "🕹", clamp: "🗜", minidisc: "💽", floppy_disk: "💾", cd: "💿", dvd: "📀", vhs: "📼", camera: "📷", camera_flash: "📸", video_camera: "📹", movie_camera: "🎥", film_projector: "📽", film_strip: "🎞", telephone_receiver: "📞", phone: "☎️", pager: "📟", fax: "📠", tv: "📺", radio: "📻", studio_microphone: "🎙", level_slider: "🎚", control_knobs: "🎛", compass: "🧭", stopwatch: "⏱", timer_clock: "⏲", alarm_clock: "⏰", mantelpiece_clock: "🕰", hourglass_flowing_sand: "⏳", hourglass: "⌛", satellite: "📡", battery: "🔋", electric_plug: "🔌", bulb: "💡", flashlight: "🔦", candle: "🕯", fire_extinguisher: "🧯", wastebasket: "🗑", oil_drum: "🛢", money_with_wings: "💸", dollar: "💵", yen: "💴", euro: "💶", pound: "💷", moneybag: "💰", credit_card: "💳", gem: "💎", balance_scale: "⚖", toolbox: "🧰", wrench: "🔧", hammer: "🔨", hammer_and_pick: "⚒", hammer_and_wrench: "🛠", pick: "⛏", nut_and_bolt: "🔩", gear: "⚙", brick: "🧱", chains: "⛓", magnet: "🧲", gun: "🔫", bomb: "💣", firecracker: "🧨", hocho: "🔪", dagger: "🗡", crossed_swords: "⚔", shield: "🛡", smoking: "🚬", skull_and_crossbones: "☠", coffin: "⚰", funeral_urn: "⚱", amphora: "🏺", crystal_ball: "🔮", prayer_beads: "📿", nazar_amulet: "🧿", barber: "💈", alembic: "⚗", telescope: "🔭", microscope: "🔬", hole: "🕳", pill: "💊", syringe: "💉", dna: "🧬", microbe: "🦠", petri_dish: "🧫", test_tube: "🧪", thermometer: "🌡", broom: "🧹", basket: "🧺", toilet_paper: "🧻", label: "🏷", bookmark: "🔖", toilet: "🚽", shower: "🚿", bathtub: "🛁", soap: "🧼", sponge: "🧽", lotion_bottle: "🧴", key: "🔑", old_key: "🗝", couch_and_lamp: "🛋", sleeping_bed: "🛌", bed: "🛏", door: "🚪", bellhop_bell: "🛎", teddy_bear: "🧸", framed_picture: "🖼", world_map: "🗺", parasol_on_ground: "⛱", moyai: "🗿", shopping: "🛍", shopping_cart: "🛒", balloon: "🎈", flags: "🎏", ribbon: "🎀", gift: "🎁", confetti_ball: "🎊", tada: "🎉", dolls: "🎎", wind_chime: "🎐", crossed_flags: "🎌", izakaya_lantern: "🏮", red_envelope: "🧧", email: "✉️", envelope_with_arrow: "📩", incoming_envelope: "📨", "e-mail": "📧", love_letter: "💌", postbox: "📮", mailbox_closed: "📪", mailbox: "📫", mailbox_with_mail: "📬", mailbox_with_no_mail: "📭", package: "📦", postal_horn: "📯", inbox_tray: "📥", outbox_tray: "📤", scroll: "📜", page_with_curl: "📃", bookmark_tabs: "📑", receipt: "🧾", bar_chart: "📊", chart_with_upwards_trend: "📈", chart_with_downwards_trend: "📉", page_facing_up: "📄", date: "📅", calendar: "📆", spiral_calendar: "🗓", card_index: "📇", card_file_box: "🗃", ballot_box: "🗳", file_cabinet: "🗄", clipboard: "📋", spiral_notepad: "🗒", file_folder: "📁", open_file_folder: "📂", card_index_dividers: "🗂", newspaper_roll: "🗞", newspaper: "📰", notebook: "📓", closed_book: "📕", green_book: "📗", blue_book: "📘", orange_book: "📙", notebook_with_decorative_cover: "📔", ledger: "📒", books: "📚", open_book: "📖", safety_pin: "🧷", link: "🔗", paperclip: "📎", paperclips: "🖇", scissors: "✂️", triangular_ruler: "📐", straight_ruler: "📏", abacus: "🧮", pushpin: "📌", round_pushpin: "📍", triangular_flag_on_post: "🚩", white_flag: "🏳", black_flag: "🏴", rainbow_flag: "🏳️‍🌈", closed_lock_with_key: "🔐", lock: "🔒", unlock: "🔓", lock_with_ink_pen: "🔏", pen: "🖊", fountain_pen: "🖋", black_nib: "✒️", memo: "📝", pencil2: "✏️", crayon: "🖍", paintbrush: "🖌", mag: "🔍", mag_right: "🔎", heart: "❤️", orange_heart: "🧡", yellow_heart: "💛", green_heart: "💚", blue_heart: "💙", purple_heart: "💜", black_heart: "🖤", broken_heart: "💔", heavy_heart_exclamation: "❣", two_hearts: "💕", revolving_hearts: "💞", heartbeat: "💓", heartpulse: "💗", sparkling_heart: "💖", cupid: "💘", gift_heart: "💝", heart_decoration: "💟", peace_symbol: "☮", latin_cross: "✝", star_and_crescent: "☪", om: "🕉", wheel_of_dharma: "☸", star_of_david: "✡", six_pointed_star: "🔯", menorah: "🕎", yin_yang: "☯", orthodox_cross: "☦", place_of_worship: "🛐", ophiuchus: "⛎", aries: "♈", taurus: "♉", gemini: "♊", cancer: "♋", leo: "♌", virgo: "♍", libra: "♎", scorpius: "♏", sagittarius: "♐", capricorn: "♑", aquarius: "♒", pisces: "♓", id: "🆔", atom_symbol: "⚛", u7a7a: "🈳", u5272: "🈹", radioactive: "☢", biohazard: "☣", mobile_phone_off: "📴", vibration_mode: "📳", u6709: "🈶", u7121: "🈚", u7533: "🈸", u55b6: "🈺", u6708: "🈷️", eight_pointed_black_star: "✴️", vs: "🆚", accept: "🉑", white_flower: "💮", ideograph_advantage: "🉐", secret: "㊙️", congratulations: "㊗️", u5408: "🈴", u6e80: "🈵", u7981: "🈲", a: "🅰️", b: "🅱️", ab: "🆎", cl: "🆑", o2: "🅾️", sos: "🆘", no_entry: "⛔", name_badge: "📛", no_entry_sign: "🚫", x: "❌", o: "⭕", stop_sign: "🛑", anger: "💢", hotsprings: "♨️", no_pedestrians: "🚷", do_not_litter: "🚯", no_bicycles: "🚳", "non-potable_water": "🚱", underage: "🔞", no_mobile_phones: "📵", exclamation: "❗", grey_exclamation: "❕", question: "❓", grey_question: "❔", bangbang: "‼️", interrobang: "⁉️", low_brightness: "🔅", high_brightness: "🔆", trident: "🔱", fleur_de_lis: "⚜", part_alternation_mark: "〽️", warning: "⚠️", children_crossing: "🚸", beginner: "🔰", recycle: "♻️", u6307: "🈯", chart: "💹", sparkle: "❇️", eight_spoked_asterisk: "✳️", negative_squared_cross_mark: "❎", white_check_mark: "✅", diamond_shape_with_a_dot_inside: "💠", cyclone: "🌀", loop: "➿", globe_with_meridians: "🌐", m: "Ⓜ️", atm: "🏧", sa: "🈂️", passport_control: "🛂", customs: "🛃", baggage_claim: "🛄", left_luggage: "🛅", wheelchair: "♿", no_smoking: "🚭", wc: "🚾", parking: "🅿️", potable_water: "🚰", mens: "🚹", womens: "🚺", baby_symbol: "🚼", restroom: "🚻", put_litter_in_its_place: "🚮", cinema: "🎦", signal_strength: "📶", koko: "🈁", ng: "🆖", ok: "🆗", up: "🆙", cool: "🆒", new: "🆕", free: "🆓", zero: "0️⃣", one: "1️⃣", two: "2️⃣", three: "3️⃣", four: "4️⃣", five: "5️⃣", six: "6️⃣", seven: "7️⃣", eight: "8️⃣", nine: "9️⃣", keycap_ten: "🔟", asterisk: "*⃣", eject_button: "⏏️", arrow_forward: "▶️", pause_button: "⏸", next_track_button: "⏭", stop_button: "⏹", record_button: "⏺", play_or_pause_button: "⏯", previous_track_button: "⏮", fast_forward: "⏩", rewind: "⏪", twisted_rightwards_arrows: "🔀", repeat: "🔁", repeat_one: "🔂", arrow_backward: "◀️", arrow_up_small: "🔼", arrow_down_small: "🔽", arrow_double_up: "⏫", arrow_double_down: "⏬", arrow_right: "➡️", arrow_left: "⬅️", arrow_up: "⬆️", arrow_down: "⬇️", arrow_upper_right: "↗️", arrow_lower_right: "↘️", arrow_lower_left: "↙️", arrow_upper_left: "↖️", arrow_up_down: "↕️", left_right_arrow: "↔️", arrows_counterclockwise: "🔄", arrow_right_hook: "↪️", leftwards_arrow_with_hook: "↩️", arrow_heading_up: "⤴️", arrow_heading_down: "⤵️", hash: "#️⃣", information_source: "ℹ️", abc: "🔤", abcd: "🔡", capital_abcd: "🔠", symbols: "🔣", musical_note: "🎵", notes: "🎶", wavy_dash: "〰️", curly_loop: "➰", heavy_check_mark: "✔️", arrows_clockwise: "🔃", heavy_plus_sign: "➕", heavy_minus_sign: "➖", heavy_division_sign: "➗", heavy_multiplication_x: "✖️", infinity: "♾", heavy_dollar_sign: "💲", currency_exchange: "💱", copyright: "©️", registered: "®️", tm: "™️", end: "🔚", back: "🔙", on: "🔛", top: "🔝", soon: "🔜", ballot_box_with_check: "☑️", radio_button: "🔘", white_circle: "⚪", black_circle: "⚫", red_circle: "🔴", large_blue_circle: "🔵", small_orange_diamond: "🔸", small_blue_diamond: "🔹", large_orange_diamond: "🔶", large_blue_diamond: "🔷", small_red_triangle: "🔺", black_small_square: "▪️", white_small_square: "▫️", black_large_square: "⬛", white_large_square: "⬜", small_red_triangle_down: "🔻", black_medium_square: "◼️", white_medium_square: "◻️", black_medium_small_square: "◾", white_medium_small_square: "◽", black_square_button: "🔲", white_square_button: "🔳", speaker: "🔈", sound: "🔉", loud_sound: "🔊", mute: "🔇", mega: "📣", loudspeaker: "📢", bell: "🔔", no_bell: "🔕", black_joker: "🃏", mahjong: "🀄", spades: "♠️", clubs: "♣️", hearts: "♥️", diamonds: "♦️", flower_playing_cards: "🎴", thought_balloon: "💭", right_anger_bubble: "🗯", speech_balloon: "💬", left_speech_bubble: "🗨", clock1: "🕐", clock2: "🕑", clock3: "🕒", clock4: "🕓", clock5: "🕔", clock6: "🕕", clock7: "🕖", clock8: "🕗", clock9: "🕘", clock10: "🕙", clock11: "🕚", clock12: "🕛", clock130: "🕜", clock230: "🕝", clock330: "🕞", clock430: "🕟", clock530: "🕠", clock630: "🕡", clock730: "🕢", clock830: "🕣", clock930: "🕤", clock1030: "🕥", clock1130: "🕦", clock1230: "🕧", afghanistan: "🇦🇫", aland_islands: "🇦🇽", albania: "🇦🇱", algeria: "🇩🇿", american_samoa: "🇦🇸", andorra: "🇦🇩", angola: "🇦🇴", anguilla: "🇦🇮", antarctica: "🇦🇶", antigua_barbuda: "🇦🇬", argentina: "🇦🇷", armenia: "🇦🇲", aruba: "🇦🇼", australia: "🇦🇺", austria: "🇦🇹", azerbaijan: "🇦🇿", bahamas: "🇧🇸", bahrain: "🇧🇭", bangladesh: "🇧🇩", barbados: "🇧🇧", belarus: "🇧🇾", belgium: "🇧🇪", belize: "🇧🇿", benin: "🇧🇯", bermuda: "🇧🇲", bhutan: "🇧🇹", bolivia: "🇧🇴", caribbean_netherlands: "🇧🇶", bosnia_herzegovina: "🇧🇦", botswana: "🇧🇼", brazil: "🇧🇷", british_indian_ocean_territory: "🇮🇴", british_virgin_islands: "🇻🇬", brunei: "🇧🇳", bulgaria: "🇧🇬", burkina_faso: "🇧🇫", burundi: "🇧🇮", cape_verde: "🇨🇻", cambodia: "🇰🇭", cameroon: "🇨🇲", canada: "🇨🇦", canary_islands: "🇮🇨", cayman_islands: "🇰🇾", central_african_republic: "🇨🇫", chad: "🇹🇩", chile: "🇨🇱", cn: "🇨🇳", christmas_island: "🇨🇽", cocos_islands: "🇨🇨", colombia: "🇨🇴", comoros: "🇰🇲", congo_brazzaville: "🇨🇬", congo_kinshasa: "🇨🇩", cook_islands: "🇨🇰", costa_rica: "🇨🇷", croatia: "🇭🇷", cuba: "🇨🇺", curacao: "🇨🇼", cyprus: "🇨🇾", czech_republic: "🇨🇿", denmark: "🇩🇰", djibouti: "🇩🇯", dominica: "🇩🇲", dominican_republic: "🇩🇴", ecuador: "🇪🇨", egypt: "🇪🇬", el_salvador: "🇸🇻", equatorial_guinea: "🇬🇶", eritrea: "🇪🇷", estonia: "🇪🇪", ethiopia: "🇪🇹", eu: "🇪🇺", falkland_islands: "🇫🇰", faroe_islands: "🇫🇴", fiji: "🇫🇯", finland: "🇫🇮", fr: "🇫🇷", french_guiana: "🇬🇫", french_polynesia: "🇵🇫", french_southern_territories: "🇹🇫", gabon: "🇬🇦", gambia: "🇬🇲", georgia: "🇬🇪", de: "🇩🇪", ghana: "🇬🇭", gibraltar: "🇬🇮", greece: "🇬🇷", greenland: "🇬🇱", grenada: "🇬🇩", guadeloupe: "🇬🇵", guam: "🇬🇺", guatemala: "🇬🇹", guernsey: "🇬🇬", guinea: "🇬🇳", guinea_bissau: "🇬🇼", guyana: "🇬🇾", haiti: "🇭🇹", honduras: "🇭🇳", hong_kong: "🇭🇰", hungary: "🇭🇺", iceland: "🇮🇸", india: "🇮🇳", indonesia: "🇮🇩", iran: "🇮🇷", iraq: "🇮🇶", ireland: "🇮🇪", isle_of_man: "🇮🇲", israel: "🇮🇱", it: "🇮🇹", cote_divoire: "🇨🇮", jamaica: "🇯🇲", jp: "🇯🇵", jersey: "🇯🇪", jordan: "🇯🇴", kazakhstan: "🇰🇿", kenya: "🇰🇪", kiribati: "🇰🇮", kosovo: "🇽🇰", kuwait: "🇰🇼", kyrgyzstan: "🇰🇬", laos: "🇱🇦", latvia: "🇱🇻", lebanon: "🇱🇧", lesotho: "🇱🇸", liberia: "🇱🇷", libya: "🇱🇾", liechtenstein: "🇱🇮", lithuania: "🇱🇹", luxembourg: "🇱🇺", macau: "🇲🇴", macedonia: "🇲🇰", madagascar: "🇲🇬", malawi: "🇲🇼", malaysia: "🇲🇾", maldives: "🇲🇻", mali: "🇲🇱", malta: "🇲🇹", marshall_islands: "🇲🇭", martinique: "🇲🇶", mauritania: "🇲🇷", mauritius: "🇲🇺", mayotte: "🇾🇹", mexico: "🇲🇽", micronesia: "🇫🇲", moldova: "🇲🇩", monaco: "🇲🇨", mongolia: "🇲🇳", montenegro: "🇲🇪", montserrat: "🇲🇸", morocco: "🇲🇦", mozambique: "🇲🇿", myanmar: "🇲🇲", namibia: "🇳🇦", nauru: "🇳🇷", nepal: "🇳🇵", netherlands: "🇳🇱", new_caledonia: "🇳🇨", new_zealand: "🇳🇿", nicaragua: "🇳🇮", niger: "🇳🇪", nigeria: "🇳🇬", niue: "🇳🇺", norfolk_island: "🇳🇫", northern_mariana_islands: "🇲🇵", north_korea: "🇰🇵", norway: "🇳🇴", oman: "🇴🇲", pakistan: "🇵🇰", palau: "🇵🇼", palestinian_territories: "🇵🇸", panama: "🇵🇦", papua_new_guinea: "🇵🇬", paraguay: "🇵🇾", peru: "🇵🇪", philippines: "🇵🇭", pitcairn_islands: "🇵🇳", poland: "🇵🇱", portugal: "🇵🇹", puerto_rico: "🇵🇷", qatar: "🇶🇦", reunion: "🇷🇪", romania: "🇷🇴", ru: "🇷🇺", rwanda: "🇷🇼", st_barthelemy: "🇧🇱", st_helena: "🇸🇭", st_kitts_nevis: "🇰🇳", st_lucia: "🇱🇨", st_pierre_miquelon: "🇵🇲", st_vincent_grenadines: "🇻🇨", samoa: "🇼🇸", san_marino: "🇸🇲", sao_tome_principe: "🇸🇹", saudi_arabia: "🇸🇦", senegal: "🇸🇳", serbia: "🇷🇸", seychelles: "🇸🇨", sierra_leone: "🇸🇱", singapore: "🇸🇬", sint_maarten: "🇸🇽", slovakia: "🇸🇰", slovenia: "🇸🇮", solomon_islands: "🇸🇧", somalia: "🇸🇴", south_africa: "🇿🇦", south_georgia_south_sandwich_islands: "🇬🇸", kr: "🇰🇷", south_sudan: "🇸🇸", es: "🇪🇸", sri_lanka: "🇱🇰", sudan: "🇸🇩", suriname: "🇸🇷", swaziland: "🇸🇿", sweden: "🇸🇪", switzerland: "🇨🇭", syria: "🇸🇾", taiwan: "🇹🇼", tajikistan: "🇹🇯", tanzania: "🇹🇿", thailand: "🇹🇭", timor_leste: "🇹🇱", togo: "🇹🇬", tokelau: "🇹🇰", tonga: "🇹🇴", trinidad_tobago: "🇹🇹", tunisia: "🇹🇳", tr: "🇹🇷", turkmenistan: "🇹🇲", turks_caicos_islands: "🇹🇨", tuvalu: "🇹🇻", uganda: "🇺🇬", ukraine: "🇺🇦", united_arab_emirates: "🇦🇪", uk: "🇬🇧", england: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", wales: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", us: "🇺🇸", us_virgin_islands: "🇻🇮", uruguay: "🇺🇾", uzbekistan: "🇺🇿", vanuatu: "🇻🇺", vatican_city: "🇻🇦", venezuela: "🇻🇪", vietnam: "🇻🇳", wallis_futuna: "🇼🇫", western_sahara: "🇪🇭", yemen: "🇾🇪", zambia: "🇿🇲", zimbabwe: "🇿🇼", united_nations: "🇺🇳", pirate_flag: "🏴‍☠️" }, ko = typeof navigator < "u" && navigator.hardwareConcurrency ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2)) : 2;
function xo() {
  if (typeof Worker < "u")
    try {
      return new yo();
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
          const r = { data: await _o(n) }(e.message || []).forEach((a) => a(r));
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
const Vi = ki(() => xo(), "markdown", ko), ai = typeof DOMParser < "u" ? new DOMParser() : null, kt = () => Vi.get(), br = (e) => Vi.send(e, 3e3), nt = [];
function tr(e) {
  if (e && (typeof e == "object" || typeof e == "function")) {
    nt.push(e);
    try {
      ge.use(e);
    } catch (t) {
      console.warn("[markdown] failed to apply plugin", t);
    }
  }
}
function So(e) {
  nt.length = 0, Array.isArray(e) && nt.push(...e.filter((t) => t && typeof t == "object"));
  try {
    nt.forEach((t) => ge.use(t));
  } catch (t) {
    console.warn("[markdown] failed to apply markdown extensions", t);
  }
}
async function En(e) {
  if (nt && nt.length) {
    let { content: i, data: r } = vn(e || "");
    try {
      i = String(i || "").replace(/:([^:\s]+):/g, (s, c) => Un[c] || s);
    } catch {
    }
    ge.setOptions({ gfm: !0, mangle: !1, headerIds: !1, headerPrefix: "" });
    try {
      nt.forEach((s) => ge.use(s));
    } catch (s) {
      console.warn("[markdown] apply plugins failed", s);
    }
    const a = ge.parse(i);
    try {
      const s = ai || (typeof DOMParser < "u" ? new DOMParser() : null);
      if (s) {
        const c = s.parseFromString(a, "text/html"), l = c.querySelectorAll("h1,h2,h3,h4,h5,h6"), d = [], o = /* @__PURE__ */ new Set(), u = (h) => {
          try {
            return String(h || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
          } catch {
            return "heading";
          }
        }, f = (h) => {
          const w = {
            1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
            2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
            3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
            4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
            5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
            6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
          }, m = h <= 2 ? "has-text-weight-bold" : h <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
          return (w[h] + " " + m).trim();
        };
        l.forEach((h) => {
          try {
            const w = Number(h.tagName.substring(1)), m = (h.textContent || "").trim();
            let p = u(m) || "heading", g = p, y = 2;
            for (; o.has(g); )
              g = p + "-" + y, y += 1;
            o.add(g), h.id = g, h.className = f(w), d.push({ level: w, text: m, id: g });
          } catch {
          }
        });
        try {
          c.querySelectorAll("img").forEach((h) => {
            try {
              const w = h.getAttribute && h.getAttribute("loading"), m = h.getAttribute && h.getAttribute("data-want-lazy");
              !w && !m && h.setAttribute && h.setAttribute("loading", "lazy");
            } catch {
            }
          });
        } catch {
        }
        try {
          c.querySelectorAll("pre code, code[class]").forEach((h) => {
            try {
              const w = h.getAttribute && h.getAttribute("class") || h.className || "", m = String(w || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
              if (m)
                try {
                  h.setAttribute && h.setAttribute("class", m);
                } catch {
                  h.className = m;
                }
              else
                try {
                  h.removeAttribute && h.removeAttribute("class");
                } catch {
                  h.className = "";
                }
            } catch {
            }
          });
        } catch {
        }
        return { html: c.body.innerHTML, meta: r || {}, toc: d };
      }
    } catch {
    }
    return { html: a, meta: r || {}, toc: [] };
  }
  let t;
  if (typeof process < "u" && process.env && process.env.VITEST)
    try {
      const i = await Promise.resolve().then(() => Yi);
      t = i.initRendererWorker && i.initRendererWorker();
    } catch {
      t = kt && kt();
    }
  else
    t = kt && kt();
  try {
    e = String(e || "").replace(/:([^:\s]+):/g, (i, r) => Un[r] || i);
  } catch {
  }
  try {
    if (typeof _e < "u" && _e && typeof _e.getLanguage == "function" && _e.getLanguage("plaintext") && /```\s*\n/.test(String(e || ""))) {
      let { content: i, data: r } = vn(e || "");
      try {
        i = String(i || "").replace(/:([^:\s]+):/g, (d, o) => Un[o] || d);
      } catch {
      }
      ge.setOptions({ gfm: !0, headerIds: !0, mangle: !1, highlighted: (d, o) => {
        try {
          return o && _e.getLanguage && _e.getLanguage(o) ? _e.highlight(d, { language: o }).value : _e && typeof _e.getLanguage == "function" && _e.getLanguage("plaintext") ? _e.highlight(d, { language: "plaintext" }).value : d;
        } catch {
          return d;
        }
      } });
      let a = ge.parse(i);
      try {
        a = a.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (d, o) => {
          try {
            if (o && _e && typeof _e.highlight == "function")
              try {
                const u = _e.highlight(o, { language: "plaintext" });
                return `<pre><code>${u && u.value ? u.value : u}</code></pre>`;
              } catch {
                try {
                  if (_e && typeof _e.highlightElement == "function") {
                    const f = { innerHTML: o };
                    return _e.highlightElement(f), `<pre><code>${f.innerHTML}</code></pre>`;
                  }
                } catch {
                }
              }
          } catch {
          }
          return d;
        });
      } catch {
      }
      const s = [], c = /* @__PURE__ */ new Set(), l = (d) => {
        try {
          return String(d || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
        } catch {
          return "heading";
        }
      };
      return a = a.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (d, o, u, f) => {
        const h = Number(o), w = f.replace(/<[^>]+>/g, "").trim();
        let m = l(w) || "heading", p = m, g = 2;
        for (; c.has(p); )
          p = m + "-" + g, g += 1;
        c.add(p), s.push({ level: h, text: w, id: p });
        const y = {
          1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
          2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
          3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
          4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
          5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
          6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
        }, b = h <= 2 ? "has-text-weight-bold" : h <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", k = (y[h] + " " + b).trim(), v = ((u || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${p}" class="${k}"`).trim();
        return `<h${h} ${v}>${f}</h${h}>`;
      }), a = a.replace(/<img([^>]*)>/g, (d, o) => /\bloading=/.test(o) ? `<img${o}>` : /\bdata-want-lazy=/.test(o) ? `<img${o}>` : `<img${o} loading="lazy">`), { html: a, meta: r || {}, toc: s };
    }
  } catch {
  }
  if (!t) throw new Error("renderer worker required but unavailable");
  const n = await br({ type: "render", md: e });
  if (!n || typeof n != "object" || n.html === void 0) throw new Error("renderer worker returned invalid response");
  try {
    const i = /* @__PURE__ */ new Map(), r = [], a = (l) => {
      try {
        return String(l || "").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g, "").replace(/\s+/g, "-");
      } catch {
        return "heading";
      }
    }, s = (l) => {
      const d = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, o = l <= 2 ? "has-text-weight-bold" : l <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
      return (d[l] + " " + o).trim();
    };
    let c = n.html;
    c = c.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g, (l, d, o, u) => {
      const f = Number(d), h = u.replace(/<[^>]+>/g, "").trim(), w = (o || "").match(/\sid="([^"]+)"/), m = w ? w[1] : a(h) || "heading", g = (i.get(m) || 0) + 1;
      i.set(m, g);
      const y = g === 1 ? m : m + "-" + g;
      r.push({ level: f, text: h, id: y });
      const b = s(f), S = ((o || "").replace(/\s*(id|class)="[^"]*"/g, "") + ` id="${y}" class="${b}"`).trim();
      return `<h${f} ${S}>${u}</h${f}>`;
    });
    try {
      const l = typeof document < "u" && document.documentElement && document.documentElement.getAttribute && document.documentElement.getAttribute("data-nimbi-logo-moved") || "";
      if (l) {
        const d = ai || (typeof DOMParser < "u" ? new DOMParser() : null);
        if (d) {
          const o = d.parseFromString(c, "text/html");
          o.querySelectorAll("img").forEach((f) => {
            try {
              const h = f.getAttribute("src") || "";
              (h ? new URL(h, location.href).toString() : "") === l && f.remove();
            } catch {
            }
          }), c = o.body.innerHTML;
        } else
          try {
            const o = l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            c = c.replace(new RegExp(`<img[^>]*src=\\"${o}\\"[^>]*>`, "g"), "");
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
function Ut(e, t) {
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
      if (pi.has(c) || t && t.size && c.length < 3 && !t.has(c) && !(Fe && Fe[c] && t.has(Fe[c]))) continue;
      if (t && t.size) {
        if (t.has(c)) {
          const d = t.get(c);
          d && n.add(d);
          continue;
        }
        if (Fe && Fe[c]) {
          const d = Fe[c];
          if (t.has(d)) {
            const o = t.get(d) || d;
            n.add(o);
            continue;
          }
        }
      }
      (a.has(c) || c.length >= 5 && c.length <= 30 && /^[a-z][a-z0-9_\-+]*$/.test(c) && !r.has(c)) && n.add(c);
    }
  return n;
}
async function nr(e, t) {
  if (nt && nt.length || typeof process < "u" && process.env && process.env.VITEST) return Ut(e || "", t);
  if (kt && kt())
    try {
      const i = t && t.size ? Array.from(t.keys()) : [], r = await br({ type: "detect", md: String(e || ""), supported: i });
      if (Array.isArray(r)) return new Set(r);
    } catch (i) {
      console.warn("[markdown] detectFenceLanguagesAsync worker failed", i);
    }
  return Ut(e || "", t);
}
const Yi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _sendToRenderer: br,
  addMarkdownExtension: tr,
  detectFenceLanguages: Ut,
  detectFenceLanguagesAsync: nr,
  initRendererWorker: kt,
  markdownPlugins: nt,
  parseMarkdownToHtml: En,
  setMarkdownExtensions: So
}, Symbol.toStringTag, { value: "Module" })), vo = `import { _rewriteAnchors } from '../htmlBuilder.js'

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
        const c = new DOMParser().parseFromString(i || "", "text/html"), l = c.body;
        await _r(l, r, a, { canonical: !0 }), postMessage({ id: n, result: c.body.innerHTML });
      } catch (s) {
        postMessage({ id: n, error: String(s) });
      }
      return;
    }
  } catch (n) {
    postMessage({ id: t.id, error: String(n) });
  }
};
async function Ao(e) {
  try {
    if (e && e.type === "rewriteAnchors") {
      const { id: t, html: n, contentBase: i, pagePath: r } = e;
      try {
        const s = new DOMParser().parseFromString(n || "", "text/html"), c = s.body;
        return await _r(c, i, r, { canonical: !0 }), { id: t, result: s.body.innerHTML };
      } catch (a) {
        return { id: t, error: String(a) };
      }
    }
    return { id: e && e.id, error: "unsupported message" };
  } catch (t) {
    return { id: e && e.id, error: String(t) };
  }
}
function Xe(e, t = null) {
  try {
    const n = typeof location < "u" && location && typeof location.pathname == "string" && location.pathname || "/";
    return String(n) + Ur(e, t);
  } catch {
    return Ur(e, t);
  }
}
const Eo = typeof globalThis < "u" && typeof globalThis.__nimbiCMSDebug < "u" ? !!globalThis.__nimbiCMSDebug : !1;
function Lo(...e) {
  try {
    Eo && console && typeof console.warn == "function" && console.warn(...e);
  } catch {
  }
}
function Mo(e, t) {
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
function Ro(e, t) {
  const n = document.createElement("aside");
  n.className = "menu box nimbi-nav";
  const i = document.createElement("p");
  i.className = "menu-label", i.textContent = e("navigation"), n.appendChild(i);
  const r = document.createElement("ul");
  return r.className = "menu-list", t.forEach((a) => {
    const s = document.createElement("li"), c = document.createElement("a");
    try {
      const l = String(a.path || "");
      try {
        c.setAttribute("href", Le(l));
      } catch {
        l && l.indexOf("/") === -1 ? c.setAttribute("href", "#" + encodeURIComponent(l)) : c.setAttribute("href", Xe(l));
      }
    } catch {
      c.setAttribute("href", "#" + a.path);
    }
    if (c.textContent = a.name, s.appendChild(c), a.children && a.children.length) {
      const l = document.createElement("ul");
      a.children.forEach((d) => {
        const o = document.createElement("li"), u = document.createElement("a");
        try {
          const f = String(d.path || "");
          try {
            u.setAttribute("href", Le(f));
          } catch {
            f && f.indexOf("/") === -1 ? u.setAttribute("href", "#" + encodeURIComponent(f)) : u.setAttribute("href", Xe(f));
          }
        } catch {
          u.setAttribute("href", "#" + d.path);
        }
        u.textContent = d.name, o.appendChild(u), l.appendChild(o);
      }), s.appendChild(l);
    }
    r.appendChild(s);
  }), n.appendChild(r), n;
}
function To(e, t, n = "") {
  const i = document.createElement("aside");
  i.className = "menu box nimbi-toc-inner is-hidden-mobile";
  const r = document.createElement("p");
  r.className = "menu-label", r.textContent = e("onThisPage"), i.appendChild(r);
  const a = document.createElement("ul");
  a.className = "menu-list";
  try {
    const c = {};
    (t || []).forEach((l) => {
      try {
        if (!l || l.level === 1) return;
        const d = Number(l.level) >= 2 ? Number(l.level) : 2, o = document.createElement("li"), u = document.createElement("a"), f = ja(l.text || ""), h = l.id || ye(f);
        u.textContent = f;
        try {
          const g = String(n || "").replace(/^[\\.\\/]+/, ""), y = g && H && H.has && H.has(g) ? H.get(g) : g;
          y ? u.href = Le(y, h) : u.href = `#${encodeURIComponent(h)}`;
        } catch (g) {
          console.warn("[htmlBuilder] buildTocElement href normalization failed", g), u.href = `#${encodeURIComponent(h)}`;
        }
        if (o.appendChild(u), d === 2) {
          a.appendChild(o), c[2] = o, Object.keys(c).forEach((g) => {
            Number(g) > 2 && delete c[g];
          });
          return;
        }
        let w = d - 1;
        for (; w > 2 && !c[w]; ) w--;
        w < 2 && (w = 2);
        let m = c[w];
        if (!m) {
          a.appendChild(o), c[d] = o;
          return;
        }
        let p = m.querySelector("ul");
        p || (p = document.createElement("ul"), m.appendChild(p)), p.appendChild(o), c[d] = o;
      } catch (d) {
        console.warn("[htmlBuilder] buildTocElement item failed", d, l);
      }
    });
  } catch (c) {
    console.warn("[htmlBuilder] buildTocElement failed", c);
  }
  return i.appendChild(a), a.querySelectorAll("li").length <= 1 ? null : i;
}
function Ji(e) {
  e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((n) => {
    n.id || (n.id = ye(n.textContent || ""));
  });
}
function Co(e, t, n) {
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
            } catch (l) {
              console.warn("[htmlBuilder] set image loading attribute failed", l);
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
function si(e, t, n) {
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
        const c = s.tagName ? s.tagName.toLowerCase() : "", l = (d) => {
          try {
            const o = s.getAttribute(d) || "";
            if (!o || /^(https?:)?\/\//i.test(o) || o.startsWith("/") || o.startsWith("#")) return;
            try {
              s.setAttribute(d, new URL(o, r).toString());
            } catch (u) {
              console.warn("[htmlBuilder] rewrite asset attribute failed", d, o, u);
            }
          } catch (o) {
            console.warn("[htmlBuilder] rewriteAttr failed", o);
          }
        };
        if (s.hasAttribute && s.hasAttribute("src") && l("src"), s.hasAttribute && s.hasAttribute("href") && c !== "a" && l("href"), s.hasAttribute && s.hasAttribute("xlink:href") && l("xlink:href"), s.hasAttribute && s.hasAttribute("poster") && l("poster"), s.hasAttribute("srcset")) {
          const u = (s.getAttribute("srcset") || "").split(",").map((f) => f.trim()).filter(Boolean).map((f) => {
            const [h, w] = f.split(/\s+/, 2);
            if (!h || /^(https?:)?\/\//i.test(h) || h.startsWith("/")) return f;
            try {
              const m = new URL(h, r).toString();
              return w ? `${m} ${w}` : m;
            } catch {
              return f;
            }
          }).join(", ");
          s.setAttribute("srcset", u);
        }
      } catch (c) {
        console.warn("[htmlBuilder] rewriteRelativeAssets node processing failed", c);
      }
  } catch (i) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed", i);
  }
}
let oi = "", Fn = null, li = "";
async function _r(e, t, n, i = {}) {
  try {
    i = i || {}, typeof i.canonical > "u" && (i.canonical = !0);
    const r = e.querySelectorAll("a");
    if (!r || !r.length) return;
    let a, s;
    if (t === oi && Fn)
      a = Fn, s = li;
    else {
      try {
        a = new URL(t, location.href), s = xt(a.pathname);
      } catch {
        try {
          a = new URL(t, location.href), s = xt(a.pathname);
        } catch {
          a = null, s = "/";
        }
      }
      oi = t, Fn = a, li = s;
    }
    const c = /* @__PURE__ */ new Set(), l = [], d = /* @__PURE__ */ new Set(), o = [];
    for (const u of Array.from(r))
      try {
        try {
          if (u.closest && u.closest("h1,h2,h3,h4,h5,h6")) continue;
        } catch {
        }
        const f = u.getAttribute("href") || "";
        if (!f || _i(f)) continue;
        try {
          if (f.startsWith("?") || f.indexOf("?") !== -1)
            try {
              const w = new URL(f, t || location.href), m = w.searchParams.get("page");
              if (m && m.indexOf("/") === -1 && n) {
                const p = n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "";
                if (p) {
                  const g = te(p + m), y = i && i.canonical ? Le(g, w.hash ? w.hash.replace(/^#/, "") : null) : Xe(g, w.hash ? w.hash.replace(/^#/, "") : null);
                  u.setAttribute("href", y);
                  continue;
                }
              }
            } catch {
            }
        } catch {
        }
        if (f.startsWith("/") && !f.endsWith(".md")) continue;
        const h = f.match(/^([^#?]+\.md)(?:[#](.+))?$/);
        if (h) {
          let w = h[1];
          const m = h[2];
          !w.startsWith("/") && n && (w = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + w);
          try {
            const p = new URL(w, t).pathname;
            let g = p.startsWith(s) ? p.slice(s.length) : p;
            g = te(g), l.push({ node: u, mdPathRaw: w, frag: m, rel: g }), H.has(g) || c.add(g);
          } catch (p) {
            console.warn("[htmlBuilder] resolve mdPath failed", p);
          }
          continue;
        }
        try {
          let w = f;
          !f.startsWith("/") && n && (f.startsWith("#") ? w = n + f : w = (n.includes("/") ? n.substring(0, n.lastIndexOf("/") + 1) : "") + f);
          const p = new URL(w, t).pathname || "";
          if (p && p.indexOf(s) !== -1) {
            let g = p.startsWith(s) ? p.slice(s.length) : p;
            if (g = te(g), g = Tt(g), g || (g = "_home"), !g.endsWith(".md")) {
              let y = null;
              try {
                if (H && H.has && H.has(g))
                  y = H.get(g);
                else
                  try {
                    const b = String(g || "").replace(/^.*\//, "");
                    b && H.has && H.has(b) && (y = H.get(b));
                  } catch (b) {
                    console.warn("[htmlBuilder] mdToSlug baseName check failed", b);
                  }
              } catch (b) {
                console.warn("[htmlBuilder] mdToSlug access check failed", b);
              }
              if (!y)
                try {
                  const b = String(g || "").replace(/^.*\//, "");
                  for (const [k, S] of J || [])
                    if (S === g || S === b) {
                      y = k;
                      break;
                    }
                } catch {
                }
              if (y) {
                const b = i && i.canonical ? Le(y, null) : Xe(y);
                u.setAttribute("href", b);
              } else {
                let b = g;
                try {
                  /\.[^\/]+$/.test(String(g || "")) || (b = String(g || "") + ".html");
                } catch {
                  b = g;
                }
                d.add(b), o.push({ node: u, rel: b });
              }
            }
          }
        } catch (w) {
          console.warn("[htmlBuilder] resolving href to URL failed", w);
        }
      } catch (f) {
        console.warn("[htmlBuilder] processing anchor failed", f);
      }
    c.size && await Promise.all(Array.from(c).map(async (u) => {
      try {
        try {
          const h = String(u).match(/([^\/]+)\.md$/), w = h && h[1];
          if (w && J.has(w)) {
            try {
              const m = J.get(w);
              if (m)
                try {
                  H.set(m, w);
                } catch (p) {
                  console.warn("[htmlBuilder] mdToSlug.set failed", p);
                }
            } catch (m) {
              console.warn("[htmlBuilder] reading slugToMd failed", m);
            }
            return;
          }
        } catch (h) {
          console.warn("[htmlBuilder] basename slug lookup failed", h);
        }
        const f = await ke(u, t);
        if (f && f.raw) {
          const h = (f.raw || "").match(/^#\s+(.+)$/m);
          if (h && h[1]) {
            const w = ye(h[1].trim());
            if (w)
              try {
                J.set(w, u), H.set(u, w);
              } catch (m) {
                console.warn("[htmlBuilder] setting slug mapping failed", m);
              }
          }
        }
      } catch (f) {
        console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed", f);
      }
    })), d.size && await Promise.all(Array.from(d).map(async (u) => {
      try {
        const f = await ke(u, t);
        if (f && f.raw)
          try {
            const w = (kr || new DOMParser()).parseFromString(f.raw, "text/html"), m = w.querySelector("title"), p = w.querySelector("h1"), g = m && m.textContent && m.textContent.trim() ? m.textContent.trim() : p && p.textContent ? p.textContent.trim() : null;
            if (g) {
              const y = ye(g);
              if (y)
                try {
                  J.set(y, u), H.set(u, y);
                } catch (b) {
                  console.warn("[htmlBuilder] setting html slug mapping failed", b);
                }
            }
          } catch (h) {
            console.warn("[htmlBuilder] parse fetched HTML failed", h);
          }
      } catch (f) {
        console.warn("[htmlBuilder] fetchMarkdown for htmlPending failed", f);
      }
    }));
    for (const u of l) {
      const { node: f, frag: h, rel: w } = u;
      let m = null;
      try {
        H.has(w) && (m = H.get(w));
      } catch (p) {
        console.warn("[htmlBuilder] mdToSlug access failed", p);
      }
      if (m) {
        const p = i && i.canonical ? Le(m, h) : Xe(m, h);
        f.setAttribute("href", p);
      } else {
        const p = i && i.canonical ? Le(w, h) : Xe(w, h);
        f.setAttribute("href", p);
      }
    }
    for (const u of o) {
      const { node: f, rel: h } = u;
      let w = null;
      try {
        H.has(h) && (w = H.get(h));
      } catch (m) {
        console.warn("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo", m);
      }
      if (!w)
        try {
          const m = String(h || "").replace(/^.*\//, "");
          H.has(m) && (w = H.get(m));
        } catch (m) {
          console.warn("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo", m);
        }
      if (w) {
        const m = i && i.canonical ? Le(w, null) : Xe(w);
        f.setAttribute("href", m);
      } else {
        const m = i && i.canonical ? Le(h, null) : Xe(h);
        f.setAttribute("href", m);
      }
    }
  } catch (r) {
    console.warn("[htmlBuilder] rewriteAnchors failed", r);
  }
}
function Po(e, t, n, i) {
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
        const l = t.querySelector("h2");
        l && l.textContent && (c = String(l.textContent).trim());
      } catch {
      }
    !c && n && (c = String(n)), c && (s = ye(c)), s || (s = "_home");
    try {
      n && (J.set(s, n), H.set(n, s));
    } catch (l) {
      console.warn("[htmlBuilder] computeSlug set slug mapping failed", l);
    }
    try {
      let l = i || "";
      if (!l)
        try {
          const d = Ke(typeof location < "u" ? location.href : "");
          d && d.anchor && d.page && String(d.page) === String(s) ? l = d.anchor : l = "";
        } catch {
          l = "";
        }
      try {
        history.replaceState({ page: s }, "", Xe(s, l));
      } catch (d) {
        console.warn("[htmlBuilder] computeSlug history replace failed", d);
      }
    } catch (l) {
      console.warn("[htmlBuilder] computeSlug inner failed", l);
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
async function $o(e, t) {
  if (!e || !e.length) return;
  const n = /* @__PURE__ */ new Set();
  for (const l of Array.from(e || []))
    try {
      const d = l.getAttribute("href") || "";
      if (!d) continue;
      let f = te(d).split(/::|#/, 2)[0];
      try {
        const w = f.indexOf("?");
        w !== -1 && (f = f.slice(0, w));
      } catch {
      }
      if (!f || (f.includes(".") || (f = f + ".html"), !/\.html(?:$|[?#])/.test(f) && !f.toLowerCase().endsWith(".html"))) continue;
      const h = f;
      try {
        if (H && H.has && H.has(h)) continue;
      } catch (w) {
        console.warn("[htmlBuilder] mdToSlug check failed", w);
      }
      try {
        let w = !1;
        for (const m of J.values())
          if (m === h) {
            w = !0;
            break;
          }
        if (w) continue;
      } catch (w) {
        console.warn("[htmlBuilder] slugToMd iteration failed", w);
      }
      n.add(h);
    } catch (d) {
      console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed", d);
    }
  if (!n.size) return;
  const i = async (l) => {
    try {
      const d = await ke(l, t);
      if (d && d.raw)
        try {
          const u = (kr || new DOMParser()).parseFromString(d.raw, "text/html"), f = u.querySelector("title"), h = u.querySelector("h1"), w = f && f.textContent && f.textContent.trim() ? f.textContent.trim() : h && h.textContent ? h.textContent.trim() : null;
          if (w) {
            const m = ye(w);
            if (m)
              try {
                J.set(m, l), H.set(l, m);
              } catch (p) {
                console.warn("[htmlBuilder] set slugToMd/mdToSlug failed", p);
              }
          }
        } catch (o) {
          console.warn("[htmlBuilder] parse HTML title failed", o);
        }
    } catch (d) {
      console.warn("[htmlBuilder] fetchAndExtract failed", d);
    }
  }, r = 5, a = Array.from(n);
  let s = 0;
  const c = [];
  for (; s < a.length; ) {
    const l = a.slice(s, s + r);
    c.push(Promise.all(l.map(i))), s += r;
  }
  await Promise.all(c);
}
async function zo(e, t) {
  if (!e || !e.length) return;
  const n = [], i = /* @__PURE__ */ new Set();
  let r = "";
  try {
    const a = new URL(t, typeof location < "u" ? location.href : "http://localhost/");
    r = xt(a.pathname);
  } catch (a) {
    r = "", console.warn("[htmlBuilder] preMapMdSlugs parse base failed", a);
  }
  for (const a of Array.from(e || []))
    try {
      const s = a.getAttribute("href") || "";
      if (!s) continue;
      const c = s.match(/^([^#?]+\.md)(?:[#](.+))?$/);
      if (c) {
        let l = te(c[1]);
        try {
          let d;
          try {
            d = Mo(l, t);
          } catch (u) {
            d = l, console.warn("[htmlBuilder] resolve mdPath URL failed", u);
          }
          const o = d && r && d.startsWith(r) ? d.slice(r.length) : String(d || "").replace(/^\//, "");
          n.push({ rel: o }), H.has(o) || i.add(o);
        } catch (d) {
          console.warn("[htmlBuilder] rewriteAnchors failed", d);
        }
        continue;
      }
    } catch (s) {
      console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed", s);
    }
  i.size && await Promise.all(Array.from(i).map(async (a) => {
    try {
      const s = String(a).match(/([^\/]+)\.md$/), c = s && s[1];
      if (c && J.has(c)) {
        try {
          const l = J.get(c);
          l && H.set(l, c);
        } catch (l) {
          console.warn("[htmlBuilder] preMapMdSlugs slug map access failed", l);
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
          const l = ye(c[1].trim());
          if (l)
            try {
              J.set(l, a), H.set(a, l);
            } catch (d) {
              console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed", d);
            }
        }
      }
    } catch (s) {
      console.warn("[htmlBuilder] preMapMdSlugs fetch failed", s);
    }
  }));
}
const kr = typeof DOMParser < "u" ? new DOMParser() : null;
function Wn(e) {
  try {
    const n = (kr || new DOMParser()).parseFromString(e || "", "text/html");
    Ji(n);
    try {
      n.querySelectorAll("img").forEach((l) => {
        try {
          l.getAttribute("loading") || l.setAttribute("data-want-lazy", "1");
        } catch (d) {
          console.warn("[htmlBuilder] parseHtml set image loading attribute failed", d);
        }
      });
    } catch (c) {
      console.warn("[htmlBuilder] parseHtml query images failed", c);
    }
    n.querySelectorAll("pre code, code[class]").forEach((c) => {
      try {
        const l = c.getAttribute && c.getAttribute("class") || c.className || "", d = l.match(/language-([a-zA-Z0-9_+-]+)/) || l.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);
        if (d && d[1]) {
          const o = (d[1] || "").toLowerCase(), u = me.size && (me.get(o) || me.get(String(o).toLowerCase())) || o;
          try {
            (async () => {
              try {
                await Xt(u);
              } catch (f) {
                console.warn("[htmlBuilder] registerLanguage failed", f);
              }
            })();
          } catch (f) {
            console.warn("[htmlBuilder] schedule registerLanguage failed", f);
          }
        } else
          try {
            if (_e && typeof _e.getLanguage == "function" && _e.getLanguage("plaintext")) {
              const o = _e.highlight ? _e.highlight(c.textContent || "", { language: "plaintext" }) : null;
              o && o.value && (c.innerHTML = o.value);
            }
          } catch (o) {
            console.warn("[htmlBuilder] plaintext highlight fallback failed", o);
          }
      } catch (l) {
        console.warn("[htmlBuilder] code element processing failed", l);
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
async function Io(e) {
  const t = nr ? await nr(e || "", me) : Ut(e || "", me), n = new Set(t), i = [];
  for (const r of n)
    try {
      const a = me.size && (me.get(r) || me.get(String(r).toLowerCase())) || r;
      try {
        i.push(Xt(a));
      } catch (s) {
        console.warn("[htmlBuilder] ensureLanguages push canonical failed", s);
      }
      if (String(r) !== String(a))
        try {
          i.push(Xt(r));
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
async function Oo(e) {
  if (await Io(e), En) {
    const t = await En(e || "");
    return !t || typeof t != "object" ? { html: String(e || ""), meta: {}, toc: [] } : (Array.isArray(t.toc) || (t.toc = []), t.meta || (t.meta = {}), t);
  }
  return { html: String(e || ""), meta: {}, toc: [] };
}
async function Bo(e, t, n, i, r) {
  let a = null;
  if (t.isHtml)
    try {
      const u = typeof DOMParser < "u" ? new DOMParser() : null;
      if (u) {
        const f = u.parseFromString(t.raw || "", "text/html");
        try {
          si(f.body, n, r);
        } catch (h) {
          console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)", h);
        }
        a = Wn(f.documentElement && f.documentElement.outerHTML ? f.documentElement.outerHTML : t.raw || "");
      } else
        a = Wn(t.raw || "");
    } catch {
      a = Wn(t.raw || "");
    }
  else
    a = await Oo(t.raw || "");
  const s = document.createElement("article");
  s.className = "nimbi-article content", s.innerHTML = a.html;
  try {
    si(s, n, r);
  } catch (u) {
    console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle", u);
  }
  try {
    Ji(s);
  } catch (u) {
    console.warn("[htmlBuilder] addHeadingIds failed", u);
  }
  try {
    s.querySelectorAll("pre code, code[class]").forEach((f) => {
      try {
        const h = f.getAttribute && f.getAttribute("class") || f.className || "", w = String(h || "").replace(/\blanguage-undefined\b|\blang-undefined\b/g, "").trim();
        if (w)
          try {
            f.setAttribute && f.setAttribute("class", w);
          } catch (m) {
            f.className = w, console.warn("[htmlBuilder] set element class failed", m);
          }
        else
          try {
            f.removeAttribute && f.removeAttribute("class");
          } catch (m) {
            f.className = "", console.warn("[htmlBuilder] remove element class failed", m);
          }
      } catch (h) {
        console.warn("[htmlBuilder] code element cleanup failed", h);
      }
    });
  } catch (u) {
    console.warn("[htmlBuilder] processing code elements failed", u);
  }
  try {
    Ia(s);
  } catch (u) {
    console.warn("[htmlBuilder] observeCodeBlocks failed", u);
  }
  Co(s, n, r);
  try {
    (s.querySelectorAll && s.querySelectorAll("img") || []).forEach((f) => {
      try {
        const h = f.parentElement;
        if (!h || h.tagName.toLowerCase() !== "p" || h.childNodes.length !== 1) return;
        const w = document.createElement("figure");
        w.className = "image", h.replaceWith(w), w.appendChild(f);
      } catch {
      }
    });
  } catch (u) {
    console.warn("[htmlBuilder] wrap images in Bulma image helper failed", u);
  }
  try {
    (s.querySelectorAll && s.querySelectorAll("table") || []).forEach((f) => {
      try {
        if (f.classList)
          f.classList.contains("table") || f.classList.add("table");
        else {
          const h = f.getAttribute && f.getAttribute("class") ? f.getAttribute("class") : "", w = String(h || "").split(/\s+/).filter(Boolean);
          w.indexOf("table") === -1 && w.push("table");
          try {
            f.setAttribute && f.setAttribute("class", w.join(" "));
          } catch {
            f.className = w.join(" ");
          }
        }
      } catch {
      }
    });
  } catch (u) {
    console.warn("[htmlBuilder] add Bulma table class failed", u);
  }
  const { topH1: c, h1Text: l, slugKey: d } = Po(a, s, n, i);
  try {
    if (c && a && a.meta && (a.meta.author || a.meta.date) && !(c.parentElement && c.parentElement.querySelector && c.parentElement.querySelector(".nimbi-article-subtitle"))) {
      const f = a.meta.author ? String(a.meta.author).trim() : "", h = a.meta.date ? String(a.meta.date).trim() : "";
      let w = "";
      try {
        const p = new Date(h);
        h && !isNaN(p.getTime()) ? w = p.toLocaleDateString() : w = h;
      } catch {
        w = h;
      }
      const m = [];
      if (f && m.push(f), w && m.push(w), m.length) {
        const p = document.createElement("p"), g = m[0] ? String(m[0]).replace(/"/g, "").trim() : "", y = m.slice(1);
        if (p.className = "nimbi-article-subtitle is-6 has-text-grey-light", g) {
          const b = document.createElement("span");
          b.className = "nimbi-article-author", b.textContent = g, p.appendChild(b);
        }
        if (y.length) {
          const b = document.createElement("span");
          b.className = "nimbi-article-meta", b.textContent = y.join(" • "), p.appendChild(b);
        }
        try {
          c.parentElement.insertBefore(p, c.nextSibling);
        } catch {
          try {
            c.insertAdjacentElement("afterend", p);
          } catch {
          }
        }
      }
    }
  } catch {
  }
  try {
    await jo(s, r, n);
  } catch (u) {
    Lo("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread", u), await _r(s, r, n);
  }
  const o = To(e, a.toc, n);
  return { article: s, parsed: a, toc: o, topH1: c, h1Text: l, slugKey: d };
}
function No(e) {
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
function ci(e, t, n) {
  e && (e.innerHTML = "");
  const i = document.createElement("article");
  i.className = "nimbi-article content nimbi-not-found";
  const r = document.createElement("h1");
  r.textContent = t && t("notFound") || "Page not found";
  const a = document.createElement("p");
  a.textContent = n && n.message ? String(n.message) : "Failed to resolve the requested page.", i.appendChild(r), i.appendChild(a), e && e.appendChild && e.appendChild(i);
  try {
    try {
      wn({ title: t && t("notFound") || "Not Found", description: t && t("notFoundDescription") || "" }, Me, t && t("notFound") || "Not Found", t && t("notFoundDescription") || "");
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
const ea = Fa(() => {
  const e = Bt(vo);
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
          const r = { data: await Ao(n) };
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
function Do() {
  return ea.get();
}
function qo(e) {
  return ea.send(e, 2e3);
}
async function jo(e, t, n) {
  if (!Do()) throw new Error("anchor worker unavailable");
  if (!e || typeof e.innerHTML != "string") throw new Error("invalid article element");
  const r = String(e.innerHTML), a = await qo({ type: "rewriteAnchors", html: r, contentBase: t, pagePath: n });
  if (a && typeof a == "string")
    try {
      e.innerHTML = a;
    } catch (s) {
      console.warn("[htmlBuilder] applying rewritten anchors failed", s);
    }
}
function Ho(e) {
  try {
    e.addEventListener("click", (t) => {
      const n = t.target && t.target.closest ? t.target.closest("a") : null;
      if (!n) return;
      const i = n.getAttribute("href") || "";
      try {
        const r = Ke(i), a = r && r.page ? r.page : null, s = r && r.anchor ? r.anchor : null;
        if (!a && !s) return;
        t.preventDefault();
        let c = null;
        try {
          history && history.state && history.state.page && (c = history.state.page);
        } catch (l) {
          c = null, console.warn("[htmlBuilder] access history.state failed", l);
        }
        try {
          c || (c = new URL(location.href).searchParams.get("page"));
        } catch (l) {
          console.warn("[htmlBuilder] parse current location failed", l);
        }
        if (!a && s || a && c && String(a) === String(c)) {
          try {
            if (!a && s)
              try {
                history.replaceState(history.state, "", (location.pathname || "") + (location.search || "") + (s ? "#" + encodeURIComponent(s) : ""));
              } catch (l) {
                console.warn("[htmlBuilder] history.replaceState failed", l);
              }
            else
              try {
                history.replaceState({ page: c || a }, "", Xe(c || a, s));
              } catch (l) {
                console.warn("[htmlBuilder] history.replaceState failed", l);
              }
          } catch (l) {
            console.warn("[htmlBuilder] update history for anchor failed", l);
          }
          try {
            t.stopImmediatePropagation && t.stopImmediatePropagation(), t.stopPropagation && t.stopPropagation();
          } catch (l) {
            console.warn("[htmlBuilder] stopPropagation failed", l);
          }
          try {
            rr(s);
          } catch (l) {
            console.warn("[htmlBuilder] scrollToAnchorOrTop failed", l);
          }
          return;
        }
        history.pushState({ page: a }, "", Xe(a, s));
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
      } catch (r) {
        console.warn("[htmlBuilder] non-URL href in attachTocClickHandler", r);
      }
    });
  } catch (t) {
    console.warn("[htmlBuilder] attachTocClickHandler failed", t);
  }
}
function rr(e) {
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
function Uo(e, t, { mountOverlay: n = null, container: i = null, mountEl: r = null, navWrap: a = null, t: s = null } = {}) {
  try {
    const c = s || ((m) => typeof m == "string" ? m : ""), l = i || document.querySelector(".nimbi-cms"), d = r || document.querySelector(".nimbi-mount"), o = n || document.querySelector(".nimbi-overlay"), u = a || document.querySelector(".nimbi-nav-wrap");
    let h = document.querySelector(".nimbi-scroll-top");
    if (!h) {
      h = document.createElement("button"), h.className = "nimbi-scroll-top button is-primary is-rounded is-small", h.setAttribute("aria-label", c("scrollToTop")), h.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';
      try {
        o && o.appendChild ? o.appendChild(h) : l && l.appendChild ? l.appendChild(h) : d && d.appendChild ? d.appendChild(h) : document.body.appendChild(h);
      } catch {
        try {
          document.body.appendChild(h);
        } catch (p) {
          console.warn("[htmlBuilder] append scroll top button failed", p);
        }
      }
      try {
        try {
          mi(h);
        } catch {
        }
      } catch (m) {
        console.warn("[htmlBuilder] set scroll-top button theme registration failed", m);
      }
      h.addEventListener("click", () => {
        try {
          i && i.scrollTo ? i.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : r && r.scrollTo ? r.scrollTo({ top: 0, left: 0, behavior: "smooth" }) : window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } catch {
          try {
            i && (i.scrollTop = 0);
          } catch (p) {
            console.warn("[htmlBuilder] fallback container scrollTop failed", p);
          }
          try {
            r && (r.scrollTop = 0);
          } catch (p) {
            console.warn("[htmlBuilder] fallback mountEl scrollTop failed", p);
          }
          try {
            document.documentElement.scrollTop = 0;
          } catch (p) {
            console.warn("[htmlBuilder] fallback document scrollTop failed", p);
          }
        }
      });
    }
    const w = u && u.querySelector ? u.querySelector(".menu-label") : null;
    if (t) {
      if (!h._nimbiObserver)
        if (typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u") {
          const m = globalThis.IntersectionObserver, p = new m((g) => {
            for (const y of g)
              y.target instanceof Element && (y.isIntersecting ? (h.classList.remove("show"), w && w.classList.remove("show")) : (h.classList.add("show"), w && w.classList.add("show")));
          }, { root: i instanceof Element ? i : r instanceof Element ? r : null, threshold: 0 });
          h._nimbiObserver = p;
        } else
          h._nimbiObserver = null;
      try {
        h._nimbiObserver && typeof h._nimbiObserver.disconnect == "function" && h._nimbiObserver.disconnect();
      } catch (m) {
        console.warn("[htmlBuilder] observer disconnect failed", m);
      }
      try {
        h._nimbiObserver && typeof h._nimbiObserver.observe == "function" && h._nimbiObserver.observe(t);
      } catch (m) {
        console.warn("[htmlBuilder] observer observe failed", m);
      }
      try {
        const m = () => {
          try {
            const p = l instanceof Element ? l.getBoundingClientRect() : { top: 0, bottom: window.innerHeight }, g = t.getBoundingClientRect();
            !(g.bottom < p.top || g.top > p.bottom) ? (h.classList.remove("show"), w && w.classList.remove("show")) : (h.classList.add("show"), w && w.classList.add("show"));
          } catch (p) {
            console.warn("[htmlBuilder] checkIntersect failed", p);
          }
        };
        m(), typeof globalThis < "u" && typeof globalThis.IntersectionObserver < "u" || setTimeout(m, 100);
      } catch (m) {
        console.warn("[htmlBuilder] checkIntersect outer failed", m);
      }
    } else {
      h.classList.remove("show"), w && w.classList.remove("show");
      const m = i instanceof Element ? i : r instanceof Element ? r : window, p = () => {
        try {
          (m === window ? window.scrollY : m.scrollTop || 0) > 10 ? (h.classList.add("show"), w && w.classList.add("show")) : (h.classList.remove("show"), w && w.classList.remove("show"));
        } catch (g) {
          console.warn("[htmlBuilder] onScroll handler failed", g);
        }
      };
      _n(() => m.addEventListener("scroll", p)), p();
    }
  } catch (c) {
    console.warn("[htmlBuilder] ensureScrollTopButton failed", c);
  }
}
function ui(e, t) {
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
async function Fo(e, t, n, i, r, a, s, c, l = "eager", d = 1, o = void 0, u = "favicon") {
  if (!e || !(e instanceof HTMLElement))
    throw new TypeError("navbarWrap must be an HTMLElement");
  const f = typeof DOMParser < "u" ? new DOMParser() : null, h = f ? f.parseFromString(n || "", "text/html") : null, w = h ? h.querySelectorAll("a") : [];
  await _n(() => $o(w, i)), await _n(() => zo(w, i));
  try {
    if (t && t instanceof HTMLElement && (!t.hasAttribute || !t.hasAttribute("role")))
      try {
        t.setAttribute("role", "main");
      } catch {
      }
  } catch {
  }
  let m = null, p = null, g = null, y = null, b = null, k = null, S = !1, v = null;
  function M() {
    try {
      const L = document.querySelector(".navbar-burger"), C = L && L.dataset ? L.dataset.target : null, B = C ? document.getElementById(C) : null;
      L && L.classList.contains("is-active") && (L.classList.remove("is-active"), L.setAttribute("aria-expanded", "false"), B && B.classList.remove("is-active"));
    } catch (L) {
      console.warn && console.warn("[nimbi-cms] closeMobileMenu failed", L);
    }
  }
  async function q() {
    const L = typeof document < "u" ? document.querySelector(".nimbi-content") : null;
    try {
      L && L.classList.add("is-inactive");
    } catch {
    }
    try {
      const C = s && s();
      C && typeof C.then == "function" && await C;
    } catch (C) {
      try {
        console.warn && console.warn("[nimbi-cms] renderByQuery failed", C);
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
  const $ = () => m || (m = (async () => {
    try {
      const L = await Promise.resolve().then(() => dt), C = typeof globalThis < "u" ? globalThis.buildSearchIndex : void 0, B = typeof globalThis < "u" ? globalThis.buildSearchIndexWorker : void 0, I = ui(L, "buildSearchIndex"), z = ui(L, "buildSearchIndexWorker"), x = typeof C == "function" ? C : I || void 0, N = typeof B == "function" ? B : z || void 0;
      try {
        console.log("[nimbi-cms test] ensureSearchIndex: buildFn=" + typeof x + " workerFn=" + typeof N + " (global preferred)");
      } catch {
      }
      const X = [];
      try {
        r && X.push(r);
      } catch {
      }
      try {
        navigationPage && X.push(navigationPage);
      } catch {
      }
      if (l === "lazy" && typeof N == "function")
        try {
          const ne = await N(i, d, o, X.length ? X : void 0);
          if (ne && ne.length) {
            try {
              if (L && typeof L._setSearchIndex == "function")
                try {
                  L._setSearchIndex(ne);
                } catch {
                }
            } catch {
            }
            return ne;
          }
        } catch (ne) {
          console.warn && console.warn("[nimbi-cms] worker builder threw", ne);
        }
      if (typeof x == "function") {
        try {
          console.log("[nimbi-cms test] calling buildFn");
        } catch {
        }
        return await x(i, d, o, X.length ? X : void 0);
      }
      return [];
    } catch (L) {
      return console.warn("[nimbi-cms] buildSearchIndex failed", L), [];
    } finally {
      if (p) {
        try {
          p.removeAttribute("disabled");
        } catch {
        }
        try {
          g && g.classList.remove("is-loading");
        } catch {
        }
      }
    }
  })(), m.then((L) => {
    try {
      try {
        v = Array.isArray(L) ? L : null;
      } catch {
        v = null;
      }
      try {
        if (typeof window < "u") {
          try {
            (async () => {
              try {
                const z = await Promise.resolve().then(() => dt);
                try {
                  Object.defineProperty(window, "__nimbiResolvedIndex", {
                    get() {
                      return z && Array.isArray(z.searchIndex) ? z.searchIndex : Array.isArray(v) ? v : [];
                    },
                    enumerable: !0,
                    configurable: !0
                  });
                } catch {
                  try {
                    window.__nimbiResolvedIndex = z && Array.isArray(z.searchIndex) ? z.searchIndex : Array.isArray(v) ? v : [];
                  } catch {
                  }
                }
              } catch {
                try {
                  window.__nimbiResolvedIndex = Array.isArray(j) ? j : Array.isArray(v) ? v : [];
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
            window.__nimbi_indexDepth = d;
          } catch {
          }
          try {
            window.__nimbi_noIndexing = o;
          } catch {
          }
        }
      } catch {
      }
      const C = String(p && p.value || "").trim().toLowerCase();
      if (!C || !Array.isArray(L) || !L.length) return;
      const B = L.filter((z) => z.title && z.title.toLowerCase().includes(C) || z.excerpt && z.excerpt.toLowerCase().includes(C));
      if (!B || !B.length) return;
      const I = document.getElementById("nimbi-search-results");
      if (!I) return;
      I.innerHTML = "";
      try {
        const z = document.createElement("div");
        z.className = "panel nimbi-search-panel", B.slice(0, 10).forEach((x) => {
          try {
            if (x.parentTitle) {
              const ne = document.createElement("p");
              ne.className = "panel-heading nimbi-search-title nimbi-search-parent", ne.textContent = x.parentTitle, z.appendChild(ne);
            }
            const N = document.createElement("a");
            N.className = "panel-block nimbi-search-result", N.href = Le(x.slug), N.setAttribute("role", "button");
            try {
              if (x.path && typeof x.slug == "string") {
                try {
                  J.set(x.slug, x.path);
                } catch {
                }
                try {
                  H.set(x.path, x.slug);
                } catch {
                }
              }
            } catch {
            }
            const X = document.createElement("div");
            X.className = "is-size-6 has-text-weight-semibold", X.textContent = x.title, N.appendChild(X), N.addEventListener("click", () => {
              try {
                I.style.display = "none";
              } catch {
              }
            }), z.appendChild(N);
          } catch {
          }
        }), I.appendChild(z);
        try {
          I.style.display = "block";
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
        const L = await Promise.resolve().then(() => Gt);
        try {
          await L.handleSitemapRequest({ homePage: r, contentBase: i, indexDepth: d, noIndexing: o, includeAllMarkdown: !0 });
        } catch (C) {
          console.warn && console.warn("[nimbi-cms] sitemap trigger failed", C);
        }
      } catch (L) {
        try {
          console.warn && console.warn("[nimbi-cms] sitemap dynamic import failed", L);
        } catch {
        }
      }
    })();
  }), m), F = document.createElement("nav");
  F.className = "navbar", F.setAttribute("role", "navigation"), F.setAttribute("aria-label", "main navigation");
  const he = document.createElement("div");
  he.className = "navbar-brand";
  const A = w[0], U = document.createElement("a");
  if (U.className = "navbar-item", A) {
    const L = A.getAttribute("href") || "#";
    try {
      const B = new URL(L, location.href).searchParams.get("page");
      if (B) {
        const I = decodeURIComponent(B);
        U.href = Le(I);
      } else
        U.href = Le(r), U.textContent = a("home");
    } catch {
      U.href = Le(r), U.textContent = a("home");
    }
  } else
    U.href = Le(r), U.textContent = a("home");
  async function de(L) {
    try {
      if (!L || L === "none") return null;
      if (L === "favicon")
        try {
          const C = document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');
          if (!C) return null;
          const B = C.getAttribute("href") || "";
          return B && /\.png(?:\?|$)/i.test(B) ? new URL(B, location.href).toString() : null;
        } catch {
          return null;
        }
      if (L === "copy-first" || L === "move-first")
        try {
          const C = await ke(r, i);
          if (!C || !C.raw) return null;
          const z = new DOMParser().parseFromString(C.raw, "text/html").querySelector("img");
          if (!z) return null;
          const x = z.getAttribute("src") || "";
          if (!x) return null;
          const N = new URL(x, location.href).toString();
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
  let oe = null;
  try {
    oe = await de(u);
  } catch {
    oe = null;
  }
  if (oe)
    try {
      const L = document.createElement("img");
      L.className = "nimbi-navbar-logo";
      const C = a && typeof a == "function" && (a("home") || a("siteLogo")) || "";
      L.alt = C, L.title = C, L.src = oe;
      try {
        L.style.marginRight = "0.5em";
      } catch {
      }
      try {
        (!U.textContent || !String(U.textContent).trim()) && (U.textContent = C);
      } catch {
      }
      try {
        U.insertBefore(L, U.firstChild);
      } catch {
        try {
          U.appendChild(L);
        } catch {
        }
      }
    } catch {
    }
  he.appendChild(U), U.addEventListener("click", function(L) {
    const C = U.getAttribute("href") || "";
    if (C.startsWith("?page=")) {
      L.preventDefault();
      const B = new URL(C, location.href), I = B.searchParams.get("page"), z = B.hash ? B.hash.replace(/^#/, "") : null;
      history.pushState({ page: I }, "", Le(I, z)), q();
      try {
        M();
      } catch {
      }
    }
  });
  function R(L) {
    try {
      if (!L) return null;
      const C = te(String(L || ""));
      try {
        if (H && H.has(C)) return H.get(C);
      } catch {
      }
      const B = C.replace(/^.*\//, "");
      try {
        if (H && H.has(B)) return H.get(B);
      } catch {
      }
      try {
        for (const [I, z] of J.entries())
          if (z) {
            if (typeof z == "string") {
              if (te(z) === C) return I;
            } else if (z && typeof z == "object") {
              if (z.default && te(z.default) === C) return I;
              const x = z.langs || {};
              for (const N in x)
                if (x[N] && te(x[N]) === C) return I;
            }
          }
      } catch {
      }
      return null;
    } catch {
      return null;
    }
  }
  const T = document.createElement("a");
  T.className = "navbar-burger", T.setAttribute("role", "button"), T.setAttribute("aria-label", "menu"), T.setAttribute("aria-expanded", "false");
  const ie = "nimbi-navbar-menu";
  T.dataset.target = ie, T.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>', he.appendChild(T);
  try {
    T.addEventListener("click", (L) => {
      try {
        const C = T.dataset && T.dataset.target ? T.dataset.target : null, B = C ? document.getElementById(C) : null;
        T.classList.contains("is-active") ? (T.classList.remove("is-active"), T.setAttribute("aria-expanded", "false"), B && B.classList.remove("is-active")) : (T.classList.add("is-active"), T.setAttribute("aria-expanded", "true"), B && B.classList.add("is-active"));
      } catch (C) {
        console.warn("[nimbi-cms] navbar burger toggle failed", C);
      }
    });
  } catch (L) {
    console.warn("[nimbi-cms] burger event binding failed", L);
  }
  const G = document.createElement("div");
  G.className = "navbar-menu", G.id = ie;
  const ae = document.createElement("div");
  ae.className = "navbar-start";
  let ve = null, fe = null;
  if (!c)
    ve = null, p = null, y = null, b = null, k = null;
  else {
    ve = document.createElement("div"), ve.className = "navbar-end", fe = document.createElement("div"), fe.className = "navbar-item", p = document.createElement("input"), p.className = "input", p.type = "search", p.placeholder = a("searchPlaceholder") || "", p.id = "nimbi-search";
    try {
      const z = (a && typeof a == "function" ? a("searchAria") : null) || p.placeholder || "Search";
      try {
        p.setAttribute("aria-label", z);
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
    l === "eager" && (p.disabled = !0), g = document.createElement("div"), g.className = "control", l === "eager" && g.classList.add("is-loading"), g.appendChild(p), fe.appendChild(g), y = document.createElement("div"), y.className = "dropdown is-right", y.id = "nimbi-search-dropdown";
    const L = document.createElement("div");
    L.className = "dropdown-trigger", L.appendChild(fe);
    const C = document.createElement("div");
    C.className = "dropdown-menu", C.setAttribute("role", "menu"), b = document.createElement("div"), b.id = "nimbi-search-results", b.className = "dropdown-content nimbi-search-results", k = b, C.appendChild(b), y.appendChild(L), y.appendChild(C), ve.appendChild(y);
    const B = (z) => {
      if (!b) return;
      b.innerHTML = "";
      let x = -1;
      function N(V) {
        try {
          const ue = b.querySelector(".nimbi-search-result.is-selected");
          ue && ue.classList.remove("is-selected");
          const re = b.querySelectorAll(".nimbi-search-result");
          if (!re || !re.length) return;
          if (V < 0) {
            x = -1;
            return;
          }
          V >= re.length && (V = re.length - 1);
          const Z = re[V];
          if (Z) {
            Z.classList.add("is-selected"), x = V;
            try {
              Z.scrollIntoView({ block: "nearest" });
            } catch {
            }
          }
        } catch {
        }
      }
      function X(V) {
        try {
          const ue = V.key, re = b.querySelectorAll(".nimbi-search-result");
          if (!re || !re.length) return;
          if (ue === "ArrowDown") {
            V.preventDefault();
            const Z = x < 0 ? 0 : Math.min(re.length - 1, x + 1);
            N(Z);
            return;
          }
          if (ue === "ArrowUp") {
            V.preventDefault();
            const Z = x <= 0 ? 0 : x - 1;
            N(Z);
            return;
          }
          if (ue === "Enter") {
            V.preventDefault();
            const Z = b.querySelector(".nimbi-search-result.is-selected") || b.querySelector(".nimbi-search-result");
            if (Z)
              try {
                Z.click();
              } catch {
              }
            return;
          }
          if (ue === "Escape") {
            try {
              y.classList.remove("is-active");
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
              b.removeEventListener("keydown", X);
            } catch {
            }
            try {
              p && p.focus();
            } catch {
            }
            try {
              p && p.removeEventListener("keydown", ne);
            } catch {
            }
            return;
          }
        } catch {
        }
      }
      function ne(V) {
        try {
          if (V && V.key === "ArrowDown") {
            V.preventDefault();
            try {
              b.focus();
            } catch {
            }
            N(0);
          }
        } catch {
        }
      }
      try {
        const V = document.createElement("div");
        V.className = "panel nimbi-search-panel", z.forEach((ue) => {
          if (ue.parentTitle) {
            const xe = document.createElement("p");
            xe.textContent = ue.parentTitle, xe.className = "panel-heading nimbi-search-title nimbi-search-parent", V.appendChild(xe);
          }
          const re = document.createElement("a");
          re.className = "panel-block nimbi-search-result", re.href = Le(ue.slug), re.setAttribute("role", "button");
          try {
            if (ue.path && typeof ue.slug == "string") {
              try {
                J.set(ue.slug, ue.path);
              } catch {
              }
              try {
                H.set(ue.path, ue.slug);
              } catch {
              }
            }
          } catch {
          }
          const Z = document.createElement("div");
          Z.className = "is-size-6 has-text-weight-semibold", Z.textContent = ue.title, re.appendChild(Z), re.addEventListener("click", () => {
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
            try {
              b.removeAttribute("tabindex");
            } catch {
            }
            try {
              b.removeEventListener("keydown", X);
            } catch {
            }
            try {
              p && p.removeEventListener("keydown", ne);
            } catch {
            }
          }), V.appendChild(re);
        }), b.appendChild(V);
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
        b.addEventListener("keydown", X);
      } catch {
      }
      try {
        p && p.addEventListener("keydown", ne);
      } catch {
      }
    }, I = (z, x) => {
      let N = null;
      return (...X) => {
        N && clearTimeout(N), N = setTimeout(() => z(...X), x);
      };
    };
    if (p) {
      const z = I(async () => {
        const x = document.querySelector("input#nimbi-search"), N = String(x && x.value || "").trim().toLowerCase();
        if (!N) {
          B([]);
          return;
        }
        try {
          await $();
          const X = await m;
          try {
            console.log('[nimbi-cms test] search handleInput q="' + N + '" idxlen=' + (Array.isArray(X) ? X.length : "nil"));
          } catch {
          }
          const ne = X.filter((V) => V.title && V.title.toLowerCase().includes(N) || V.excerpt && V.excerpt.toLowerCase().includes(N));
          try {
            console.log("[nimbi-cms test] filtered len=" + (Array.isArray(ne) ? ne.length : "nil"));
          } catch {
          }
          B(ne.slice(0, 10));
        } catch (X) {
          console.warn("[nimbi-cms] search input handler failed", X), B([]);
        }
      }, 50);
      try {
        p.addEventListener("input", z);
      } catch {
      }
      try {
        document.addEventListener("input", (x) => {
          try {
            x && x.target && x.target.id === "nimbi-search" && z(x);
          } catch {
          }
        }, !0);
      } catch {
      }
    }
    if (l === "eager") {
      try {
        m = $();
      } catch (z) {
        console.warn("[nimbi-cms] eager search index init failed", z), m = Promise.resolve([]);
      }
      m.finally(() => {
        const z = document.querySelector("input#nimbi-search");
        if (z) {
          try {
            z.removeAttribute("disabled");
          } catch {
          }
          try {
            g && g.classList.remove("is-loading");
          } catch {
          }
        }
        (async () => {
          try {
            if (S) return;
            S = !0;
            const x = await m.catch(() => []), N = await Promise.resolve().then(() => Gt);
            try {
              await N.handleSitemapRequest({ index: Array.isArray(x) ? x : void 0, homePage: r, contentBase: i, indexDepth: d, noIndexing: o, includeAllMarkdown: !0 });
            } catch (X) {
              console.warn && console.warn("[nimbi-cms] sitemap trigger failed", X);
            }
          } catch (x) {
            try {
              console.warn && console.warn("[nimbi-cms] sitemap dynamic import failed", x);
            } catch {
            }
          }
        })();
      });
    }
    try {
      const z = (x) => {
        try {
          const N = x && x.target;
          if (!k || !k.classList.contains("is-open") && k.style && k.style.display !== "block" || N && (k.contains(N) || p && (N === p || p.contains && p.contains(N)))) return;
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
        } catch {
        }
      };
      document.addEventListener("click", z, !0), document.addEventListener("touchstart", z, !0);
    } catch {
    }
  }
  for (let L = 0; L < w.length; L++) {
    const C = w[L];
    if (L === 0) continue;
    const B = C.getAttribute("href") || "#", I = document.createElement("a");
    I.className = "navbar-item";
    try {
      if (/^[^#]*\.md(?:$|[#?])/.test(B) || B.endsWith(".md")) {
        const x = te(B).split(/::|#/, 2), N = x[0], X = x[1], ne = R(N);
        ne ? I.href = Le(ne, X) : I.href = Le(N, X);
      } else if (/\.html(?:$|[#?])/.test(B) || B.endsWith(".html")) {
        const x = te(B).split(/::|#/, 2);
        let N = x[0];
        N && !N.toLowerCase().endsWith(".html") && (N = N + ".html");
        const X = x[1], ne = R(N);
        if (ne)
          I.href = Le(ne, X);
        else
          try {
            const V = await ke(N, i);
            if (V && V.raw)
              try {
                const re = new DOMParser().parseFromString(V.raw, "text/html"), Z = re.querySelector("title"), xe = re.querySelector("h1"), gt = Z && Z.textContent && Z.textContent.trim() ? Z.textContent.trim() : xe && xe.textContent ? xe.textContent.trim() : null;
                if (gt) {
                  const vt = ye(gt);
                  if (vt) {
                    try {
                      J.set(vt, N), H.set(N, vt);
                    } catch (Pn) {
                      console.warn("[nimbi-cms] slugToMd/mdToSlug set failed", Pn);
                    }
                    I.href = Le(vt, X);
                  } else
                    I.href = Le(N, X);
                } else
                  I.href = Le(N, X);
              } catch {
                I.href = Le(N, X);
              }
            else
              I.href = B;
          } catch {
            I.href = B;
          }
      } else
        I.href = B;
    } catch (z) {
      console.warn("[nimbi-cms] nav item href parse failed", z), I.href = B;
    }
    try {
      const z = C.textContent && String(C.textContent).trim() ? String(C.textContent).trim() : null;
      if (z)
        try {
          const x = ye(z);
          if (x) {
            const N = I.getAttribute("href") || "";
            let X = null;
            if (/^[^#?]*\.(?:md|html?)(?:$|[?#])/i.test(N))
              X = te(String(N || "").split(/[?#]/)[0]);
            else
              try {
                const ne = Ke(N);
                ne && ne.type === "canonical" && ne.page && (X = te(ne.page));
              } catch {
              }
            if (X) {
              let ne = !1;
              try {
                if (/\.(?:md|html?)(?:$|[?#])/i.test(String(X || "")))
                  ne = !0;
                else {
                  const V = String(X || "").replace(/^\.\//, ""), ue = V.replace(/^.*\//, "");
                  Array.isArray($e) && $e.length && ($e.includes(V) || $e.includes(ue)) && (ne = !0);
                }
              } catch {
                ne = !1;
              }
              if (ne) {
                try {
                  J.set(x, X);
                } catch {
                }
                try {
                  H.set(X, x);
                } catch {
                }
              }
            }
          }
        } catch (x) {
          console.warn("[nimbi-cms] nav slug mapping failed", x);
        }
    } catch (z) {
      console.warn("[nimbi-cms] nav slug mapping failed", z);
    }
    I.textContent = C.textContent || B, ae.appendChild(I);
  }
  G.appendChild(ae), ve && G.appendChild(ve), F.appendChild(he), F.appendChild(G), e.appendChild(F);
  try {
    const L = (C) => {
      try {
        const B = F && F.querySelector ? F.querySelector(".navbar-burger") : document.querySelector(".navbar-burger");
        if (!B || !B.classList.contains("is-active")) return;
        const I = B && B.closest ? B.closest(".navbar") : F;
        if (I && I.contains(C.target)) return;
        M();
      } catch {
      }
    };
    document.addEventListener("click", L, !0), document.addEventListener("touchstart", L, !0);
  } catch {
  }
  try {
    G.addEventListener("click", (L) => {
      const C = L.target && L.target.closest ? L.target.closest("a") : null;
      if (!C) return;
      const B = C.getAttribute("href") || "";
      try {
        const I = new URL(B, location.href), z = I.searchParams.get("page"), x = I.hash ? I.hash.replace(/^#/, "") : null;
        z && (L.preventDefault(), history.pushState({ page: z }, "", Le(z, x)), q());
      } catch (I) {
        console.warn("[nimbi-cms] navbar click handler failed", I);
      }
      try {
        const I = F && F.querySelector ? F.querySelector(".navbar-burger") : null, z = I && I.dataset ? I.dataset.target : null, x = z ? document.getElementById(z) : null;
        I && I.classList.contains("is-active") && (I.classList.remove("is-active"), I.setAttribute("aria-expanded", "false"), x && x.classList.remove("is-active"));
      } catch (I) {
        console.warn("[nimbi-cms] mobile menu close failed", I);
      }
    });
  } catch (L) {
    console.warn("[nimbi-cms] attach content click handler failed", L);
  }
  try {
    t.addEventListener("click", (L) => {
      const C = L.target && L.target.closest ? L.target.closest("a") : null;
      if (!C) return;
      const B = C.getAttribute("href") || "";
      if (B && !_i(B))
        try {
          const I = new URL(B, location.href), z = I.searchParams.get("page"), x = I.hash ? I.hash.replace(/^#/, "") : null;
          z && (L.preventDefault(), history.pushState({ page: z }, "", Le(z, x)), q());
        } catch (I) {
          console.warn("[nimbi-cms] container click URL parse failed", I);
        }
    });
  } catch (L) {
    console.warn("[nimbi-cms] build navbar failed", L);
  }
  return { navbar: F, linkEls: w };
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
let De = null, ee = null, Ie = 1, et = (e, t) => t, Ft = 0, Wt = 0, yn = () => {
}, Ot = 0.25;
function Wo() {
  if (De && document.contains(De)) return De;
  De = null;
  const e = document.createElement("dialog");
  e.className = "nimbi-image-preview modal", e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), e.setAttribute("aria-label", et("imagePreviewTitle", "Image preview")), e.innerHTML = `
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
  `, e.addEventListener("click", (R) => {
    R.target === e && Zn();
  }), e.addEventListener("wheel", (R) => {
    if (!F()) return;
    R.preventDefault();
    const T = R.deltaY < 0 ? Ot : -Ot;
    it(Ie + T), d(), o();
  }, { passive: !1 }), e.addEventListener("keydown", (R) => {
    if (R.key === "Escape") {
      Zn();
      return;
    }
    if (Ie > 1) {
      const T = e.querySelector(".nimbi-image-preview__image-wrapper");
      if (!T) return;
      const ie = 40;
      switch (R.key) {
        case "ArrowUp":
          T.scrollTop -= ie, R.preventDefault();
          break;
        case "ArrowDown":
          T.scrollTop += ie, R.preventDefault();
          break;
        case "ArrowLeft":
          T.scrollLeft -= ie, R.preventDefault();
          break;
        case "ArrowRight":
          T.scrollLeft += ie, R.preventDefault();
          break;
      }
    }
  }), document.body.appendChild(e), De = e, ee = e.querySelector("[data-nimbi-preview-image]");
  const t = e.querySelector("[data-nimbi-preview-fit]"), n = e.querySelector("[data-nimbi-preview-original]"), i = e.querySelector("[data-nimbi-preview-zoom-in]"), r = e.querySelector("[data-nimbi-preview-zoom-out]"), a = e.querySelector("[data-nimbi-preview-reset]"), s = e.querySelector("[data-nimbi-preview-close]"), c = e.querySelector("[data-nimbi-preview-zoom-label]"), l = e.querySelector("[data-nimbi-preview-zoom-hud]");
  function d() {
    c && (c.textContent = `${Math.round(Ie * 100)}%`);
  }
  const o = () => {
    l && (l.textContent = `${Math.round(Ie * 100)}%`, l.classList.add("visible"), clearTimeout(l._timeout), l._timeout = setTimeout(() => l.classList.remove("visible"), 800));
  };
  yn = d, i.addEventListener("click", () => {
    it(Ie + Ot), d(), o();
  }), r.addEventListener("click", () => {
    it(Ie - Ot), d(), o();
  }), t.addEventListener("click", () => {
    Zt(), d(), o();
  }), n.addEventListener("click", () => {
    it(1), d(), o();
  }), a.addEventListener("click", () => {
    Zt(), d(), o();
  }), s.addEventListener("click", Zn), t.title = et("imagePreviewFit", "Fit to screen"), n.title = et("imagePreviewOriginal", "Original size"), r.title = et("imagePreviewZoomOut", "Zoom out"), i.title = et("imagePreviewZoomIn", "Zoom in"), s.title = et("imagePreviewClose", "Close"), s.setAttribute("aria-label", et("imagePreviewClose", "Close"));
  let u = !1, f = 0, h = 0, w = 0, m = 0;
  const p = /* @__PURE__ */ new Map();
  let g = 0, y = 1;
  const b = (R, T) => {
    const ie = R.x - T.x, G = R.y - T.y;
    return Math.hypot(ie, G);
  }, k = () => {
    u = !1, p.clear(), g = 0, ee && (ee.classList.add("is-panning"), ee.classList.remove("is-grabbing"));
  };
  let S = 0, v = 0, M = 0;
  const q = (R) => {
    const T = Date.now(), ie = T - S, G = R.clientX - v, ae = R.clientY - M;
    S = T, v = R.clientX, M = R.clientY, ie < 300 && Math.hypot(G, ae) < 30 && (it(Ie > 1 ? 1 : 2), d(), R.preventDefault());
  }, $ = (R) => {
    it(Ie > 1 ? 1 : 2), d(), R.preventDefault();
  }, F = () => De ? typeof De.open == "boolean" ? De.open : De.classList.contains("is-active") : !1, he = (R, T, ie = 1) => {
    if (p.has(ie) && p.set(ie, { x: R, y: T }), p.size === 2) {
      const fe = Array.from(p.values()), L = b(fe[0], fe[1]);
      if (g > 0) {
        const C = L / g;
        it(y * C);
      }
      return;
    }
    if (!u) return;
    const G = ee.closest(".nimbi-image-preview__image-wrapper");
    if (!G) return;
    const ae = R - f, ve = T - h;
    G.scrollLeft = w - ae, G.scrollTop = m - ve;
  }, A = (R, T, ie = 1) => {
    if (!F()) return;
    if (p.set(ie, { x: R, y: T }), p.size === 2) {
      const ve = Array.from(p.values());
      g = b(ve[0], ve[1]), y = Ie;
      return;
    }
    const G = ee.closest(".nimbi-image-preview__image-wrapper");
    !G || !(G.scrollWidth > G.clientWidth || G.scrollHeight > G.clientHeight) || (u = !0, f = R, h = T, w = G.scrollLeft, m = G.scrollTop, ee.classList.add("is-panning"), ee.classList.remove("is-grabbing"), window.addEventListener("pointermove", U), window.addEventListener("pointerup", de), window.addEventListener("pointercancel", de));
  }, U = (R) => {
    u && (R.preventDefault(), he(R.clientX, R.clientY, R.pointerId));
  }, de = () => {
    k(), window.removeEventListener("pointermove", U), window.removeEventListener("pointerup", de), window.removeEventListener("pointercancel", de);
  };
  ee.addEventListener("pointerdown", (R) => {
    R.preventDefault(), A(R.clientX, R.clientY, R.pointerId);
  }), ee.addEventListener("pointermove", (R) => {
    (u || p.size === 2) && R.preventDefault(), he(R.clientX, R.clientY, R.pointerId);
  }), ee.addEventListener("pointerup", (R) => {
    R.preventDefault(), R.pointerType === "touch" && q(R), k();
  }), ee.addEventListener("dblclick", $), ee.addEventListener("pointercancel", k), ee.addEventListener("mousedown", (R) => {
    R.preventDefault(), A(R.clientX, R.clientY, 1);
  }), ee.addEventListener("mousemove", (R) => {
    u && R.preventDefault(), he(R.clientX, R.clientY, 1);
  }), ee.addEventListener("mouseup", (R) => {
    R.preventDefault(), k();
  });
  const oe = e.querySelector(".nimbi-image-preview__image-wrapper");
  return oe && (oe.addEventListener("pointerdown", (R) => {
    if (A(R.clientX, R.clientY, R.pointerId), R && R.target && R.target.tagName === "IMG")
      try {
        R.target.classList.add("is-grabbing");
      } catch {
      }
  }), oe.addEventListener("pointermove", (R) => {
    he(R.clientX, R.clientY, R.pointerId);
  }), oe.addEventListener("pointerup", k), oe.addEventListener("pointercancel", k), oe.addEventListener("mousedown", (R) => {
    if (A(R.clientX, R.clientY, 1), R && R.target && R.target.tagName === "IMG")
      try {
        R.target.classList.add("is-grabbing");
      } catch {
      }
  }), oe.addEventListener("mousemove", (R) => {
    he(R.clientX, R.clientY, 1);
  }), oe.addEventListener("mouseup", k)), e;
}
function it(e) {
  if (!ee) return;
  const t = Number(e);
  Ie = Number.isFinite(t) ? Math.max(0.1, Math.min(4, t)) : 1;
  const i = ee.getBoundingClientRect(), r = Ft || ee.naturalWidth || ee.width || i.width || 0, a = Wt || ee.naturalHeight || ee.height || i.height || 0;
  if (r && a) {
    ee.style.setProperty("--nimbi-preview-img-max-width", "none"), ee.style.setProperty("--nimbi-preview-img-max-height", "none"), ee.style.setProperty("--nimbi-preview-img-width", `${r * Ie}px`), ee.style.setProperty("--nimbi-preview-img-height", `${a * Ie}px`), ee.style.setProperty("--nimbi-preview-img-transform", "none");
    try {
      ee.style.width = `${r * Ie}px`, ee.style.height = `${a * Ie}px`, ee.style.transform = "none";
    } catch {
    }
  } else {
    ee.style.setProperty("--nimbi-preview-img-max-width", ""), ee.style.setProperty("--nimbi-preview-img-max-height", ""), ee.style.setProperty("--nimbi-preview-img-width", ""), ee.style.setProperty("--nimbi-preview-img-height", ""), ee.style.setProperty("--nimbi-preview-img-transform", `scale(${Ie})`);
    try {
      ee.style.transform = `scale(${Ie})`;
    } catch {
    }
  }
  ee && (ee.classList.add("is-panning"), ee.classList.remove("is-grabbing"));
}
function Zt() {
  if (!ee) return;
  const e = ee.closest(".nimbi-image-preview__image-wrapper");
  if (!e) return;
  const t = e.getBoundingClientRect();
  if (t.width === 0 || t.height === 0) return;
  const n = Ft || ee.naturalWidth || t.width, i = Wt || ee.naturalHeight || t.height;
  if (!n || !i) return;
  const r = t.width / n, a = t.height / i, s = Math.min(r, a, 1);
  it(Number.isFinite(s) ? s : 1);
}
function Zo(e, t = "", n = 0, i = 0) {
  const r = Wo();
  Ie = 1, Ft = n || 0, Wt = i || 0, ee.src = e;
  try {
    if (!t)
      try {
        const c = new URL(e, typeof location < "u" ? location.href : "").pathname || "", d = (c.substring(c.lastIndexOf("/") + 1) || e).replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
        t = et("imagePreviewDefaultAlt", d || "Image");
      } catch {
        t = et("imagePreviewDefaultAlt", "Image");
      }
  } catch {
  }
  ee.alt = t, ee.style.transform = "scale(1)";
  const a = () => {
    Ft = ee.naturalWidth || ee.width || 0, Wt = ee.naturalHeight || ee.height || 0;
  };
  if (a(), Zt(), yn(), requestAnimationFrame(() => {
    Zt(), yn();
  }), !Ft || !Wt) {
    const s = () => {
      a(), requestAnimationFrame(() => {
        Zt(), yn();
      }), ee.removeEventListener("load", s);
    };
    ee.addEventListener("load", s);
  }
  typeof r.showModal == "function" && (r.open || r.showModal()), r.classList.add("is-active");
  try {
    document.documentElement.classList.add("nimbi-image-preview-open");
  } catch {
  }
  r.focus();
}
function Zn() {
  if (De) {
    typeof De.close == "function" && De.open && De.close(), De.classList.remove("is-active");
    try {
      document.documentElement.classList.remove("nimbi-image-preview-open");
    } catch {
    }
  }
}
function Go(e, { t, zoomStep: n = 0.25 } = {}) {
  if (!e || !e.querySelectorAll) return;
  et = (h, w) => (typeof t == "function" ? t(h) : void 0) || w, Ot = n, e.addEventListener("click", (h) => {
    const w = (
      /** @type {HTMLElement} */
      h.target
    );
    if (!w || w.tagName !== "IMG") return;
    const m = (
      /** @type {HTMLImageElement} */
      w
    );
    if (!m.src) return;
    const p = m.closest("a");
    p && p.getAttribute("href") || Zo(m.src, m.alt || "", m.naturalWidth || 0, m.naturalHeight || 0);
  });
  let i = !1, r = 0, a = 0, s = 0, c = 0;
  const l = /* @__PURE__ */ new Map();
  let d = 0, o = 1;
  const u = (h, w) => {
    const m = h.x - w.x, p = h.y - w.y;
    return Math.hypot(m, p);
  };
  e.addEventListener("pointerdown", (h) => {
    const w = (
      /** @type {HTMLElement} */
      h.target
    );
    if (!w || w.tagName !== "IMG") return;
    const m = w.closest("a");
    if (m && m.getAttribute("href") || !De || !De.open) return;
    if (l.set(h.pointerId, { x: h.clientX, y: h.clientY }), l.size === 2) {
      const g = Array.from(l.values());
      d = u(g[0], g[1]), o = Ie;
      return;
    }
    const p = w.closest(".nimbi-image-preview__image-wrapper");
    if (p && !(Ie <= 1)) {
      h.preventDefault(), i = !0, r = h.clientX, a = h.clientY, s = p.scrollLeft, c = p.scrollTop, w.setPointerCapture(h.pointerId);
      try {
        w.classList.add("is-grabbing");
      } catch {
      }
    }
  }), e.addEventListener("pointermove", (h) => {
    if (l.has(h.pointerId) && l.set(h.pointerId, { x: h.clientX, y: h.clientY }), l.size === 2) {
      h.preventDefault();
      const b = Array.from(l.values()), k = u(b[0], b[1]);
      if (d > 0) {
        const S = k / d;
        it(o * S);
      }
      return;
    }
    if (!i) return;
    h.preventDefault();
    const w = (
      /** @type {HTMLElement} */
      h.target
    ), m = w.closest && w.closest("a");
    if (m && m.getAttribute && m.getAttribute("href")) return;
    const p = w.closest(".nimbi-image-preview__image-wrapper");
    if (!p) return;
    const g = h.clientX - r, y = h.clientY - a;
    p.scrollLeft = s - g, p.scrollTop = c - y;
  });
  const f = () => {
    i = !1, l.clear(), d = 0;
    try {
      const h = document.querySelector("[data-nimbi-preview-image]");
      h && (h.classList.add("is-panning"), h.classList.remove("is-grabbing"));
    } catch {
    }
  };
  e.addEventListener("pointerup", f), e.addEventListener("pointercancel", f);
}
function Qo(e) {
  const {
    contentWrap: t,
    navWrap: n,
    container: i,
    mountOverlay: r = null,
    t: a,
    contentBase: s,
    homePage: c,
    initialDocumentTitle: l,
    runHooks: d
  } = e || {};
  if (!t || !(t instanceof HTMLElement))
    throw new TypeError("contentWrap must be an HTMLElement");
  let o = null;
  const u = Ro(a, [{ path: c, name: a("home"), isIndex: !0, children: [] }]);
  async function f(g, y) {
    let b, k, S;
    try {
      ({ data: b, pagePath: k, anchor: S } = await _s(g, s));
    } catch (A) {
      console.error("[nimbi-cms] fetchPageData failed", A), ci(t, a, A);
      return;
    }
    !S && y && (S = y);
    try {
      rr(null);
    } catch (A) {
      console.warn("[nimbi-cms] scrollToAnchorOrTop failed", A);
    }
    t.innerHTML = "";
    const { article: v, parsed: M, toc: q, topH1: $, h1Text: F, slugKey: he } = await Bo(a, b, k, S, s);
    gs(a, l, M, q, v, k, S, $, F, he, b), n.innerHTML = "", q && (n.appendChild(q), Ho(q));
    try {
      await d("transformHtml", { article: v, parsed: M, toc: q, pagePath: k, anchor: S, topH1: $, h1Text: F, slugKey: he, data: b });
    } catch (A) {
      console.warn("[nimbi-cms] transformHtml hooks failed", A);
    }
    t.appendChild(v);
    try {
      No(v);
    } catch (A) {
      console.warn("[nimbi-cms] executeEmbeddedScripts failed", A);
    }
    try {
      Go(v, { t: a });
    } catch (A) {
      console.warn("[nimbi-cms] attachImagePreview failed", A);
    }
    try {
      hn(i, 100, !1), requestAnimationFrame(() => hn(i, 100, !1)), setTimeout(() => hn(i, 100, !1), 250);
    } catch (A) {
      console.warn("[nimbi-cms] setEagerForAboveFoldImages failed", A);
    }
    rr(S), Uo(v, $, { mountOverlay: r, container: i, navWrap: n, t: a });
    try {
      await d("onPageLoad", { data: b, pagePath: k, anchor: S, article: v, toc: q, topH1: $, h1Text: F, slugKey: he, contentWrap: t, navWrap: n });
    } catch (A) {
      console.warn("[nimbi-cms] onPageLoad hooks failed", A);
    }
    o = k;
  }
  async function h() {
    try {
      if (typeof window < "u" && window.__nimbiCMSDebug)
        try {
          window.__nimbiCMSDebug = window.__nimbiCMSDebug || {}, window.__nimbiCMSDebug.renderByQuery = (window.__nimbiCMSDebug.renderByQuery || 0) + 1;
        } catch {
        }
      let g = Ke(location.href);
      if (g && g.type === "path" && g.page)
        try {
          let k = "?page=" + encodeURIComponent(g.page || "");
          g.params && (k += (k.includes("?") ? "&" : "?") + g.params), g.anchor && (k += "#" + encodeURIComponent(g.anchor));
          try {
            history.replaceState(history.state, "", k);
          } catch {
            try {
              history.replaceState({}, "", k);
            } catch {
            }
          }
          g = Ke(location.href);
        } catch {
        }
      const y = g && g.page ? g.page : c, b = g && g.anchor ? g.anchor : null;
      await f(y, b);
    } catch (g) {
      console.warn("[nimbi-cms] renderByQuery failed", g), ci(t, a, g);
    }
  }
  window.addEventListener("popstate", h);
  const w = () => `nimbi-cms-scroll:${location.pathname}${location.search}`, m = () => {
    try {
      const g = i || document.querySelector(".nimbi-cms");
      if (!g) return;
      const y = {
        top: g.scrollTop || 0,
        left: g.scrollLeft || 0
      };
      sessionStorage.setItem(w(), JSON.stringify(y));
    } catch {
    }
  }, p = () => {
    try {
      const g = i || document.querySelector(".nimbi-cms");
      if (!g) return;
      const y = sessionStorage.getItem(w());
      if (!y) return;
      const b = JSON.parse(y);
      b && typeof b.top == "number" && g.scrollTo({ top: b.top, left: b.left || 0, behavior: "auto" });
    } catch {
    }
  };
  return window.addEventListener("pageshow", (g) => {
    if (g.persisted)
      try {
        p(), hn(i, 100, !1);
      } catch (y) {
        console.warn("[nimbi-cms] bfcache restore failed", y);
      }
  }), window.addEventListener("pagehide", () => {
    try {
      m();
    } catch (g) {
      console.warn("[nimbi-cms] save scroll position failed", g);
    }
  }), { renderByQuery: h, siteNav: u, getCurrentPagePath: () => o };
}
function Xo(e) {
  try {
    let t = typeof e == "string" ? e : typeof window < "u" && window.location ? window.location.search : "";
    if (!t && typeof window < "u" && window.location && window.location.hash)
      try {
        const a = Ke(window.location.href);
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
function Ko(e) {
  return !(typeof e != "string" || !e.trim() || e.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(e) || e.startsWith("//") || e.startsWith("/") || /^[A-Za-z]:\\/.test(e));
}
function Gn(e) {
  if (typeof e != "string") return !1;
  const t = e.trim();
  if (!t || t.includes("..") || /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t) || t.startsWith("//") || t.startsWith("/") || /^[A-Za-z]:\\/.test(t)) return !1;
  const n = t.replace(/^\.\//, "");
  return !!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n);
}
let fn = "";
async function ll(e = {}) {
  if (typeof window < "u" && window.__nimbiCMSDebug)
    try {
      console.info("[nimbi-cms] initCMS called", { options: e });
    } catch {
    }
  if (!e || typeof e != "object")
    throw new TypeError("initCMS(options): options must be an object");
  const n = Xo();
  if (n && (n.contentPath || n.homePage || n.notFoundPage || n.navigationPage))
    if (e && e.allowUrlPathOverrides === !0)
      try {
        console.warn("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage/navigationPage");
      } catch (A) {
        console.warn("[nimbi-cms] allowUrlPathOverrides logging failed", A);
      }
    else {
      try {
        console.warn("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage/navigationPage");
      } catch (A) {
        console.warn("[nimbi-cms] logging ignore of URL overrides failed", A);
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
    searchIndexMode: l = "eager",
    indexDepth: d = 1,
    noIndexing: o = void 0,
    defaultStyle: u = "light",
    bulmaCustomize: f = "none",
    lang: h = void 0,
    l10nFile: w = null,
    cacheTtlMinutes: m = 5,
    cacheMaxEntries: p,
    markdownExtensions: g,
    availableLanguages: y,
    homePage: b = "_home.md",
    notFoundPage: k = "_404.md",
    navigationPage: S = "_navigation.md",
    exposeSitemap: v = !0
  } = i;
  try {
    typeof b == "string" && b.startsWith("./") && (b = b.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof k == "string" && k.startsWith("./") && (k = k.replace(/^\.\//, ""));
  } catch {
  }
  try {
    typeof S == "string" && S.startsWith("./") && (S = S.replace(/^[.]\//, ""));
  } catch {
  }
  const { navbarLogo: M = "favicon" } = i, { skipRootReadme: q = !1 } = i, $ = (A) => {
    try {
      const U = document.querySelector(r);
      U && U instanceof Element && (U.innerHTML = `<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;"><strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">${String(A)}</pre></div>`);
    } catch {
    }
  };
  if (i.contentPath != null && !Ko(i.contentPath))
    throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');
  if (b != null && !Gn(b))
    throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');
  if (k != null && !Gn(k))
    throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');
  if (S != null && !Gn(S))
    throw new TypeError('initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html');
  if (!r)
    throw new Error("el is required");
  let F = r;
  if (typeof r == "string") {
    if (F = document.querySelector(r), !F) throw new Error(`el selector "${r}" did not match any element`);
  } else if (!(r instanceof Element))
    throw new TypeError("el must be a CSS selector string or a DOM element");
  if (typeof a != "string" || !a.trim())
    throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');
  if (typeof c != "boolean")
    throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');
  if (l != null && l !== "eager" && l !== "lazy")
    throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');
  if (d != null && d !== 1 && d !== 2 && d !== 3)
    throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');
  if (u !== "light" && u !== "dark" && u !== "system")
    throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');
  if (f != null && typeof f != "string")
    throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');
  if (h != null && typeof h != "string")
    throw new TypeError('initCMS(options): "lang" must be a string when provided');
  if (w != null && typeof w != "string")
    throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');
  if (m != null && (typeof m != "number" || !Number.isFinite(m) || m < 0))
    throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');
  if (p != null && (typeof p != "number" || !Number.isInteger(p) || p < 0))
    throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');
  if (g != null && (!Array.isArray(g) || g.some((A) => !A || typeof A != "object")))
    throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');
  if (y != null && (!Array.isArray(y) || y.some((A) => typeof A != "string" || !A.trim())))
    throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');
  if (o != null && (!Array.isArray(o) || o.some((A) => typeof A != "string" || !A.trim())))
    throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');
  if (q != null && typeof q != "boolean")
    throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');
  if (b != null && (typeof b != "string" || !b.trim() || !/\.(md|html)$/.test(b)))
    throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');
  if (k != null && (typeof k != "string" || !k.trim() || !/\.(md|html)$/.test(k)))
    throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');
  const he = !!c;
  try {
    Promise.resolve().then(() => dt).then((A) => {
      try {
        A && typeof A.setSkipRootReadme == "function" && A.setSkipRootReadme(!!q);
      } catch (U) {
        console.warn("[nimbi-cms] setSkipRootReadme failed", U);
      }
    }).catch((A) => {
    });
  } catch (A) {
    console.warn("[nimbi-cms] setSkipRootReadme dynamic import failed", A);
  }
  try {
    try {
      i && i.seoMap && typeof i.seoMap == "object" && fs(i.seoMap);
    } catch {
    }
    try {
      typeof window < "u" && (window.__nimbiRenderingErrors__ || (window.__nimbiRenderingErrors__ = []), window.addEventListener("error", function(A) {
        try {
          const U = { type: "error", message: A && A.message ? String(A.message) : "", filename: A && A.filename ? String(A.filename) : "", lineno: A && A.lineno ? A.lineno : null, colno: A && A.colno ? A.colno : null, stack: A && A.error && A.error.stack ? A.error.stack : null, time: Date.now() };
          try {
            console.warn("[nimbi-cms] runtime error", U.message);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(U);
        } catch {
        }
      }), window.addEventListener("unhandledrejection", function(A) {
        try {
          const U = { type: "unhandledrejection", reason: A && A.reason ? String(A.reason) : "", time: Date.now() };
          try {
            console.warn("[nimbi-cms] unhandledrejection", U.reason);
          } catch {
          }
          window.__nimbiRenderingErrors__.push(U);
        } catch {
        }
      }));
    } catch {
    }
    try {
      const A = Ke(typeof window < "u" ? window.location.href : ""), U = A && A.page ? A.page : b || "_home.md";
      try {
        ps(U, fn || "");
      } catch {
      }
    } catch {
    }
    await (async () => {
      try {
        F.classList.add("nimbi-mount");
      } catch (x) {
        console.warn("[nimbi-cms] mount element setup failed", x);
      }
      const A = document.createElement("section");
      A.className = "section";
      const U = document.createElement("div");
      U.className = "container nimbi-cms";
      const de = document.createElement("div");
      de.className = "columns";
      const oe = document.createElement("div");
      oe.className = "column is-hidden-mobile is-3-tablet nimbi-nav-wrap", oe.setAttribute("role", "navigation");
      try {
        const x = typeof It == "function" ? It("navigation") : null;
        x && oe.setAttribute("aria-label", x);
      } catch (x) {
        console.warn("[nimbi-cms] set nav aria-label failed", x);
      }
      de.appendChild(oe);
      const R = document.createElement("main");
      R.className = "column nimbi-content", R.setAttribute("role", "main"), de.appendChild(R), U.appendChild(de), A.appendChild(U);
      const T = oe, ie = R;
      F.appendChild(A);
      let G = null;
      try {
        G = F.querySelector(".nimbi-overlay"), G || (G = document.createElement("div"), G.className = "nimbi-overlay", F.appendChild(G));
      } catch (x) {
        G = null, console.warn("[nimbi-cms] mount overlay setup failed", x);
      }
      const ae = location.pathname || "/";
      let ve;
      if (ae.endsWith("/"))
        ve = ae;
      else {
        const x = ae.substring(ae.lastIndexOf("/") + 1);
        x && !x.includes(".") ? ve = ae + "/" : ve = ae.substring(0, ae.lastIndexOf("/") + 1);
      }
      try {
        fn = document.title || "";
      } catch (x) {
        fn = "", console.warn("[nimbi-cms] read initial document title failed", x);
      }
      let fe = a;
      const L = Object.prototype.hasOwnProperty.call(i, "contentPath"), C = typeof location < "u" && location.origin ? location.origin : "http://localhost", B = new URL(ve, C).toString();
      (fe === "." || fe === "./") && (fe = "");
      try {
        fe = String(fe || "").replace(/\\/g, "/");
      } catch {
        fe = String(fe || "");
      }
      fe.startsWith("/") && (fe = fe.replace(/^\/+/, "")), fe && !fe.endsWith("/") && (fe = fe + "/");
      try {
        if (fe && ve && ve !== "/") {
          const x = ve.replace(/^\/+/, "").replace(/\/+$/, "") + "/";
          x && fe.startsWith(x) && (fe = fe.slice(x.length));
        }
      } catch {
      }
      try {
        if (fe)
          var I = new URL(fe, B.endsWith("/") ? B : B + "/").toString();
        else
          var I = B;
      } catch {
        try {
          if (fe) var I = new URL("/" + fe, C).toString();
          else var I = new URL(ve, C).toString();
        } catch {
          var I = C;
        }
      }
      try {
        Promise.resolve().then(() => dt).then((x) => {
          try {
            x && typeof x.setHomePage == "function" && x.setHomePage(b);
          } catch (N) {
            console.warn("[nimbi-cms] setHomePage failed", N);
          }
        }).catch((x) => {
        });
      } catch (x) {
        console.warn("[nimbi-cms] setHomePage dynamic import failed", x);
      }
      w && await yi(w, ve), y && Array.isArray(y) && xi(y), h && bi(h);
      const z = Qo({ contentWrap: ie, navWrap: T, container: U, mountOverlay: G, t: It, contentBase: I, homePage: b, initialDocumentTitle: fn, runHooks: qr });
      if (typeof m == "number" && m >= 0 && typeof Xr == "function" && Xr(m * 60 * 1e3), typeof p == "number" && p >= 0 && typeof Qr == "function" && Qr(p), g && Array.isArray(g) && g.length)
        try {
          g.forEach((x) => {
            typeof x == "object" && Yi && typeof tr == "function" && tr(x);
          });
        } catch (x) {
          console.warn("[nimbi-cms] applying markdownExtensions failed", x);
        }
      try {
        typeof s == "number" && Promise.resolve().then(() => dt).then(({ setDefaultCrawlMaxQueue: x }) => {
          try {
            x(s);
          } catch (N) {
            console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed", N);
          }
        });
      } catch (x) {
        console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed", x);
      }
      try {
        xn(I);
      } catch (x) {
        console.warn("[nimbi-cms] setContentBase failed", x);
      }
      try {
        Kn(k);
      } catch (x) {
        console.warn("[nimbi-cms] setNotFoundPage failed", x);
      }
      try {
        xn(I);
      } catch (x) {
        console.warn("[nimbi-cms] setContentBase failed", x);
      }
      try {
        Kn(k);
      } catch (x) {
        console.warn("[nimbi-cms] setNotFoundPage failed", x);
      }
      try {
        typeof window < "u" && window.__nimbiAutoAttachSitemapUI && Promise.resolve().then(() => Gt).then((x) => {
          try {
            x && typeof x.attachSitemapDownloadUI == "function" && x.attachSitemapDownloadUI(document.body, { filename: "sitemap.json" });
          } catch {
          }
        }).catch(() => {
        });
      } catch {
      }
      try {
        await ke(b, I);
      } catch (x) {
        throw b === "_home.md" ? new Error("Required _home.md not found") : new Error(`Required ${b} not found at ${I}${b}: ${x.message}`);
      }
      Na(u), await Ba(f, ve);
      try {
        const x = document.createElement("header");
        x.className = "nimbi-site-navbar", F.insertBefore(x, A);
        const N = await ke(S, I), X = await En(N.raw || ""), { navbar: ne, linkEls: V } = await Fo(x, U, X.html || "", I, b, It, z.renderByQuery, he, l, d, o, M);
        try {
          await qr("onNavBuild", { navWrap: T, navbar: ne, linkEls: V, contentBase: I });
        } catch (ue) {
          console.warn("[nimbi-cms] onNavBuild hooks failed", ue);
        }
        try {
          let ue = !1;
          try {
            const re = new URLSearchParams(location.search || "");
            (re.has("sitemap") || re.has("rss") || re.has("atom")) && (ue = !0);
          } catch {
          }
          try {
            const Z = (location.pathname || "/").replace(/\/\/+/g, "/").split("/").filter(Boolean).pop() || "";
            Z && /^(sitemap|sitemap\.xml|rss|rss\.xml|atom|atom\.xml)$/i.test(Z) && (ue = !0);
          } catch {
          }
          if (ue || v === !0 || typeof window < "u" && window.__nimbiExposeSitemap)
            try {
              try {
                const Z = await Promise.resolve().then(() => dt);
                if (Z && typeof Z.awaitSearchIndex == "function") {
                  const xe = [];
                  b && xe.push(b), S && xe.push(S);
                  try {
                    await Z.awaitSearchIndex({ contentBase: I, indexDepth: Math.max(d || 1, 3), noIndexing: o, seedPaths: xe.length ? xe : void 0, startBuild: !0, timeoutMs: 1 / 0 });
                  } catch {
                  }
                }
              } catch {
              }
              const re = await Promise.resolve().then(() => Gt);
              try {
                if (re && typeof re.handleSitemapRequest == "function" && await re.handleSitemapRequest({ includeAllMarkdown: !0, homePage: b, navigationPage: S, notFoundPage: k, contentBase: I, indexDepth: d, noIndexing: o }))
                  return;
              } catch {
              }
            } catch {
            }
          try {
            Promise.resolve().then(() => Gt).then((re) => {
              try {
                if (re && typeof re.exposeSitemapGlobals == "function")
                  try {
                    re.exposeSitemapGlobals({ includeAllMarkdown: !0, homePage: b, navigationPage: S, notFoundPage: k, contentBase: I, indexDepth: d, noIndexing: o, waitForIndexMs: 1 / 0 }).catch(() => {
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
            const re = x && x.getBoundingClientRect && Math.round(x.getBoundingClientRect().height) || x && x.offsetHeight || 0;
            if (re > 0) {
              try {
                F.style.setProperty("--nimbi-site-navbar-height", `${re}px`);
              } catch (Z) {
                console.warn("[nimbi-cms] set CSS var failed", Z);
              }
              try {
                U.style.paddingTop = "";
              } catch (Z) {
                console.warn("[nimbi-cms] set container paddingTop failed", Z);
              }
              try {
                const Z = F && F.getBoundingClientRect && Math.round(F.getBoundingClientRect().height) || F && F.clientHeight || 0;
                if (Z > 0) {
                  const xe = Math.max(0, Z - re);
                  try {
                    U.style.setProperty("--nimbi-cms-height", `${xe}px`);
                  } catch (gt) {
                    console.warn("[nimbi-cms] set --nimbi-cms-height failed", gt);
                  }
                } else
                  try {
                    U.style.setProperty("--nimbi-cms-height", "calc(100vh - var(--nimbi-site-navbar-height))");
                  } catch (xe) {
                    console.warn("[nimbi-cms] set --nimbi-cms-height failed", xe);
                  }
              } catch (Z) {
                console.warn("[nimbi-cms] compute container height failed", Z);
              }
              try {
                x.style.setProperty("--nimbi-site-navbar-height", `${re}px`);
              } catch (Z) {
                console.warn("[nimbi-cms] set navbar CSS var failed", Z);
              }
            }
          };
          ue();
          try {
            if (typeof ResizeObserver < "u") {
              const re = new ResizeObserver(() => ue());
              try {
                re.observe(x);
              } catch (Z) {
                console.warn("[nimbi-cms] ResizeObserver.observe failed", Z);
              }
            }
          } catch (re) {
            console.warn("[nimbi-cms] ResizeObserver setup failed", re);
          }
        } catch (ue) {
          console.warn("[nimbi-cms] compute navbar height failed", ue);
        }
      } catch (x) {
        console.warn("[nimbi-cms] build navigation failed", x);
      }
      await z.renderByQuery();
      try {
        Promise.resolve().then(() => Yo).then(({ getVersion: x }) => {
          typeof x == "function" && x().then((N) => {
            try {
              const X = N || "0.0.0";
              try {
                const ne = (re) => {
                  const Z = document.createElement("a");
                  Z.className = "nimbi-version-label tag is-small", Z.textContent = `nimbiCMS v. ${X}`, Z.href = re || "#", Z.target = "_blank", Z.rel = "noopener noreferrer nofollow", Z.setAttribute("aria-label", `nimbiCMS version ${X}`);
                  try {
                    mi(Z);
                  } catch {
                  }
                  try {
                    F.appendChild(Z);
                  } catch (xe) {
                    console.warn("[nimbi-cms] append version label failed", xe);
                  }
                }, V = "https://abelvm.github.io/nimbiCMS/", ue = (() => {
                  try {
                    if (V && typeof V == "string")
                      return new URL(V).toString();
                  } catch {
                  }
                  return "#";
                })();
                ne(ue);
              } catch (ne) {
                console.warn("[nimbi-cms] building version label failed", ne);
              }
            } catch (X) {
              console.warn("[nimbi-cms] building version label failed", X);
            }
          }).catch((N) => {
            console.warn("[nimbi-cms] getVersion() failed", N);
          });
        }).catch((x) => {
          console.warn("[nimbi-cms] import version module failed", x);
        });
      } catch (x) {
        console.warn("[nimbi-cms] version label setup failed", x);
      }
    })();
  } catch (A) {
    throw $(A), A;
  }
}
async function Vo() {
  try {
    if ("1.0.5".trim())
      return "1.0.5";
  } catch {
  }
  return "0.0.0";
}
const Yo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getVersion: Vo
}, Symbol.toStringTag, { value: "Module" }));
function xr() {
  try {
    if (typeof location < "u" && location && typeof location.pathname == "string")
      return String(location.origin + location.pathname.split("?")[0]);
  } catch {
  }
  return "http://localhost/";
}
function Re(e) {
  return String(e || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function hi(e) {
  try {
    return !e || typeof e != "string" ? "" : (e.split("/").filter(Boolean).pop() || e).replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").split(" ").map((r) => r ? r.charAt(0).toUpperCase() + r.slice(1) : "").join(" ").trim();
  } catch {
    return String(e);
  }
}
function Jo(e, t) {
  try {
    const n = t && t.slug ? String(t.slug) : null;
    if (!n) return null;
    const r = { loc: e + "?page=" + encodeURIComponent(n), slug: n };
    return t.title && (r.title = String(t.title)), t.excerpt && (r.excerpt = String(t.excerpt)), t.path && (r.sourcePath = te(String(t.path))), r;
  } catch {
    return null;
  }
}
async function Sr(e = {}) {
  const {
    includeAllMarkdown: t = !0,
    index: n,
    homePage: i,
    navigationPage: r,
    notFoundPage: a
  } = e || {}, c = xr().split("?")[0];
  let l = Array.isArray(j) && j.length ? j : Array.isArray(n) ? n : [];
  if (Array.isArray(n) && n.length && Array.isArray(j) && j.length) {
    const g = /* @__PURE__ */ new Map();
    try {
      for (const y of n)
        try {
          y && y.slug && g.set(String(y.slug), y);
        } catch {
        }
      for (const y of j)
        try {
          y && y.slug && g.set(String(y.slug), y);
        } catch {
        }
    } catch {
    }
    l = Array.from(g.values());
  }
  const d = /* @__PURE__ */ new Set();
  try {
    typeof a == "string" && a.trim() && d.add(te(String(a)));
  } catch {
  }
  try {
    typeof r == "string" && r.trim() && d.add(te(String(r)));
  } catch {
  }
  const o = /* @__PURE__ */ new Set();
  try {
    if (typeof a == "string" && a.trim()) {
      const g = te(String(a));
      try {
        if (H && typeof H.has == "function" && H.has(g))
          try {
            o.add(H.get(g));
          } catch {
          }
        else
          try {
            const y = await ke(g, e && e.contentBase ? e.contentBase : void 0);
            if (y && y.raw)
              try {
                let b = null;
                if (y.isHtml)
                  try {
                    const S = new DOMParser().parseFromString(y.raw, "text/html"), v = S.querySelector("h1") || S.querySelector("title");
                    v && v.textContent && (b = v.textContent.trim());
                  } catch {
                  }
                else {
                  const k = (y.raw || "").match(/^#\s+(.+)$/m);
                  k && k[1] && (b = k[1].trim());
                }
                b && o.add(ye(b));
              } catch {
              }
          } catch {
          }
      } catch {
      }
    }
  } catch {
  }
  const u = /* @__PURE__ */ new Set(), f = [], h = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), m = (g) => {
    try {
      if (!g || typeof g != "string") return !1;
      const y = te(String(g));
      try {
        if (Array.isArray($e) && $e.length && $e.includes(y)) return !0;
      } catch {
      }
      try {
        if (H && typeof H.has == "function" && H.has(y)) return !0;
      } catch {
      }
      try {
        if (w && w.has(y)) return !0;
      } catch {
      }
      try {
        for (const b of J.values())
          try {
            if (!b) continue;
            if (typeof b == "string") {
              if (te(String(b)) === y) return !0;
            } else if (b && typeof b == "object") {
              if (b.default && te(String(b.default)) === y) return !0;
              const k = b.langs || {};
              for (const S of Object.keys(k || {}))
                try {
                  if (k[S] && te(String(k[S])) === y) return !0;
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
  if (Array.isArray(l) && l.length)
    for (const g of l)
      try {
        if (!g || !g.slug) continue;
        const y = String(g.slug), b = String(y).split("::")[0];
        if (o.has(b)) continue;
        const k = g.path ? te(String(g.path)) : null;
        if (k && d.has(k)) continue;
        const S = g.title ? String(g.title) : g.parentTitle ? String(g.parentTitle) : void 0;
        h.set(y, { title: S || void 0, excerpt: g.excerpt ? String(g.excerpt) : void 0, path: k, source: "index" }), k && w.set(k, { title: S || void 0, excerpt: g.excerpt ? String(g.excerpt) : void 0, slug: y });
        const v = Jo(c, g);
        if (!v || !v.slug || u.has(v.slug)) continue;
        if (u.add(v.slug), h.has(v.slug)) {
          const M = h.get(v.slug);
          M && M.title && (v.title = M.title, v._titleSource = "index"), M && M.excerpt && (v.excerpt = M.excerpt);
        }
        f.push(v);
      } catch {
        continue;
      }
  if (t)
    try {
      for (const [g, y] of J.entries())
        try {
          if (!g) continue;
          const b = String(g).split("::")[0];
          if (u.has(g) || o.has(b)) continue;
          let k = null;
          if (typeof y == "string" ? k = te(String(y)) : y && typeof y == "object" && (k = te(String(y.default || ""))), k && d.has(k)) continue;
          const v = { loc: c + "?page=" + encodeURIComponent(g), slug: g };
          if (h.has(g)) {
            const M = h.get(g);
            M && M.title && (v.title = M.title, v._titleSource = "index"), M && M.excerpt && (v.excerpt = M.excerpt);
          } else if (k) {
            const M = w.get(k);
            M && M.title && (v.title = M.title, v._titleSource = "path", !v.excerpt && M.excerpt && (v.excerpt = M.excerpt));
          }
          if (u.add(g), typeof g == "string") {
            const M = g.indexOf("/") !== -1 || /\.(md|html?)$/i.test(g), q = v.title && typeof v.title == "string" && (v.title.indexOf("/") !== -1 || /\.(md|html?)$/i.test(v.title));
            (!v.title || q || M) && (v.title = hi(g), v._titleSource = "humanize");
          }
          f.push(v);
        } catch {
        }
      try {
        if (i && typeof i == "string") {
          const g = te(String(i));
          let y = null;
          try {
            H && H.has(g) && (y = H.get(g));
          } catch {
          }
          y || (y = g);
          const b = String(y).split("::")[0];
          if (!u.has(y) && !d.has(g) && !o.has(b)) {
            const k = { loc: c + "?page=" + encodeURIComponent(y), slug: y };
            if (h.has(y)) {
              const S = h.get(y);
              S && S.title && (k.title = S.title, k._titleSource = "index"), S && S.excerpt && (k.excerpt = S.excerpt);
            }
            u.add(y), f.push(k);
          }
        }
      } catch {
      }
    } catch {
    }
  try {
    const g = /* @__PURE__ */ new Set(), y = new Set(f.map((v) => String(v && v.slug ? v.slug : ""))), b = /* @__PURE__ */ new Set();
    for (const v of f)
      try {
        v && v.sourcePath && b.add(String(v.sourcePath));
      } catch {
      }
    const k = 30;
    let S = 0;
    for (const v of b) {
      if (S >= k) break;
      try {
        if (!v || typeof v != "string" || !m(v)) continue;
        S += 1;
        const M = await ke(v, e && e.contentBase ? e.contentBase : void 0);
        if (!M || !M.raw || M && typeof M.status == "number" && M.status === 404) continue;
        const q = M.raw, $ = (function(de) {
          try {
            return String(de || "");
          } catch {
            return "";
          }
        })(q), F = [], he = /\[[^\]]+\]\(([^)]+)\)/g;
        let A;
        for (; A = he.exec($); )
          try {
            A && A[1] && F.push(A[1]);
          } catch {
          }
        const U = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
        for (; A = U.exec($); )
          try {
            A && A[1] && F.push(A[1]);
          } catch {
          }
        for (const de of F)
          try {
            if (!de) continue;
            if (de.indexOf("?") !== -1 || de.indexOf("=") !== -1)
              try {
                const T = new URL(de, c).searchParams.get("page");
                if (T) {
                  const ie = String(T);
                  !y.has(ie) && !g.has(ie) && (g.add(ie), f.push({ loc: c + "?page=" + encodeURIComponent(ie), slug: ie }));
                  continue;
                }
              } catch {
              }
            let oe = String(de).split(/[?#]/)[0];
            if (oe = oe.replace(/^\.\//, "").replace(/^\//, ""), !oe || !/\.(md|html?)$/i.test(oe)) continue;
            try {
              const R = te(oe);
              if (H && H.has(R)) {
                const T = H.get(R), ie = String(T).split("::")[0];
                T && !y.has(T) && !g.has(T) && !o.has(ie) && !d.has(R) && (g.add(T), f.push({ loc: c + "?page=" + encodeURIComponent(T), slug: T, sourcePath: R }));
                continue;
              }
              try {
                if (!m(R)) continue;
                const T = await ke(R, e && e.contentBase ? e.contentBase : void 0);
                if (T && typeof T.status == "number" && T.status === 404) continue;
                if (T && T.raw) {
                  const ie = (T.raw || "").match(/^#\s+(.+)$/m), G = ie && ie[1] ? ie[1].trim() : "", ae = ye(G || R), ve = String(ae).split("::")[0];
                  ae && !y.has(ae) && !g.has(ae) && !o.has(ve) && (g.add(ae), f.push({ loc: c + "?page=" + encodeURIComponent(ae), slug: ae, sourcePath: R, title: G || void 0 }));
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
    const g = /* @__PURE__ */ new Map();
    for (const b of f)
      try {
        if (!b || !b.slug) continue;
        g.set(String(b.slug), b);
      } catch {
      }
    const y = /* @__PURE__ */ new Set();
    for (const b of f)
      try {
        if (!b || !b.slug) continue;
        const k = String(b.slug), S = k.split("::")[0];
        if (!S) continue;
        k !== S && !g.has(S) && y.add(S);
      } catch {
      }
    for (const b of y)
      try {
        let k = null;
        if (h.has(b)) {
          const S = h.get(b);
          k = { loc: c + "?page=" + encodeURIComponent(b), slug: b }, S && S.title && (k.title = S.title, k._titleSource = "index"), S && S.excerpt && (k.excerpt = S.excerpt), S && S.path && (k.sourcePath = S.path);
        } else if (w && J && J.has(b)) {
          const S = J.get(b);
          let v = null;
          if (typeof S == "string" ? v = te(String(S)) : S && typeof S == "object" && (v = te(String(S.default || ""))), k = { loc: c + "?page=" + encodeURIComponent(b), slug: b }, v && w.has(v)) {
            const M = w.get(v);
            M && M.title && (k.title = M.title, k._titleSource = "path"), M && M.excerpt && (k.excerpt = M.excerpt), k.sourcePath = v;
          }
        }
        k || (k = { loc: c + "?page=" + encodeURIComponent(b), slug: b, title: hi(b) }, k._titleSource = "humanize"), g.has(b) || (f.push(k), g.set(b, k));
      } catch {
      }
  } catch {
  }
  const p = [];
  try {
    const g = /* @__PURE__ */ new Set();
    for (const y of f)
      try {
        if (!y || !y.slug) continue;
        const b = String(y.slug), k = String(b).split("::")[0];
        if (o.has(k) || b.indexOf("::") !== -1 || g.has(b)) continue;
        g.add(b), p.push(y);
      } catch {
      }
  } catch {
  }
  try {
    try {
      console.log("[runtimeSitemap] generateSitemapJson finalEntries.titleSource:", JSON.stringify(p.map((g) => ({ slug: g.slug, title: g.title, titleSource: g._titleSource || null })), null, 2));
    } catch {
    }
  } catch {
  }
  try {
    for (const g of p)
      try {
        if (!g || !g.slug) continue;
        const y = String(g.slug).split("::")[0];
        if (o.has(y) || g._titleSource === "index") continue;
        let b = null;
        try {
          if (J && J.has(g.slug)) {
            const k = J.get(g.slug);
            typeof k == "string" ? b = te(String(k)) : k && typeof k == "object" && (b = te(String(k.default || "")));
          }
          !b && g.sourcePath && (b = g.sourcePath);
        } catch {
        }
        if (!b || d.has(b) || !m(b)) continue;
        try {
          const k = await ke(b, e && e.contentBase ? e.contentBase : void 0);
          if (!k || !k.raw || k && typeof k.status == "number" && k.status === 404) continue;
          if (k && k.raw) {
            const S = (k.raw || "").match(/^#\s+(.+)$/m), v = S && S[1] ? S[1].trim() : "";
            v && (g.title = v, g._titleSource = "fetched");
          }
        } catch {
        }
      } catch {
      }
  } catch {
  }
  return { generatedAt: (/* @__PURE__ */ new Date()).toISOString(), entries: p };
}
function ir(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [];
  let n = `<?xml version="1.0" encoding="UTF-8"?>
`;
  n += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  for (const i of t)
    try {
      n += `  <url>
`, n += `    <loc>${Re(String(i.loc || ""))}</loc>
`, n += `  </url>
`;
    } catch {
    }
  return n += `</urlset>
`, n;
}
function ar(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [], n = xr().split("?")[0];
  let i = `<?xml version="1.0" encoding="UTF-8"?>
`;
  i += `<rss version="2.0">
`, i += `<channel>
`, i += `<title>${Re("Sitemap RSS")}</title>
`, i += `<link>${Re(n)}</link>
`, i += `<description>${Re("RSS feed generated from site index")}</description>
`, i += `<lastBuildDate>${Re(e && e.generatedAt ? new Date(e.generatedAt).toUTCString() : (/* @__PURE__ */ new Date()).toUTCString())}</lastBuildDate>
`;
  for (const r of t)
    try {
      const a = String(r.loc || "");
      i += `<item>
`, i += `<title>${Re(String(r.title || r.slug || r.loc || ""))}</title>
`, r.excerpt && (i += `<description>${Re(String(r.excerpt))}</description>
`), i += `<link>${Re(a)}</link>
`, i += `<guid>${Re(a)}</guid>
`, i += `</item>
`;
    } catch {
    }
  return i += `</channel>
`, i += `</rss>
`, i;
}
function sr(e) {
  const t = e && Array.isArray(e.entries) ? e.entries : Array.isArray(e) ? e : [], n = xr().split("?")[0], i = e && e.generatedAt ? new Date(e.generatedAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
  let r = `<?xml version="1.0" encoding="utf-8"?>
`;
  r += `<feed xmlns="http://www.w3.org/2005/Atom">
`, r += `<title>${Re("Sitemap Atom")}</title>
`, r += `<link href="${Re(n)}" />
`, r += `<updated>${Re(i)}</updated>
`, r += `<id>${Re(n)}</id>
`;
  for (const a of t)
    try {
      const s = String(a.loc || ""), c = a && a.lastmod ? new Date(a.lastmod).toISOString() : i;
      r += `<entry>
`, r += `<title>${Re(String(a.title || a.slug || a.loc || ""))}</title>
`, a.excerpt && (r += `<summary>${Re(String(a.excerpt))}</summary>
`), r += `<link href="${Re(s)}" />
`, r += `<id>${Re(s)}</id>
`, r += `<updated>${Re(c)}</updated>
`, r += `</entry>
`;
    } catch {
    }
  return r += `</feed>
`, r;
}
function di(e, t = "application/xml") {
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
      document.body.innerHTML = "<pre>" + Re(e) + "</pre>";
    } catch {
    }
  }
}
function pn(e, t = "application/xml") {
  try {
    if (typeof window > "u") {
      try {
        let i = null;
        if (t === "application/rss+xml") i = ar(e);
        else if (t === "application/atom+xml") i = sr(e);
        else if (t === "text/html") {
          let r = '<!doctype html><html><head><meta charset="utf-8"><title>Sitemap</title></head><body>';
          r += "<h1>Sitemap</h1><ul>";
          for (const a of e && e.entries || []) r += `<li><a href="${Re(String(a.loc || ""))}">${Re(String(a.title || a.slug || a.loc || ""))}</a></li>`;
          r += "</ul></body></html>", i = r;
        } else i = ir(e);
        di(i, t);
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
          if (r.mimeType === "application/rss+xml") a = ar(r.finalJson);
          else if (r.mimeType === "application/atom+xml") a = sr(r.finalJson);
          else if (r.mimeType === "text/html") {
            let s = '<!doctype html><html><head><meta charset="utf-8"><title>Sitemap</title></head><body>';
            s += "<h1>Sitemap</h1><ul>";
            for (const c of r.finalJson && r.finalJson.entries || []) s += `<li><a href="${Re(String(c.loc || ""))}">${Re(String(c.title || c.slug || c.loc || ""))}</a></li>`;
            s += "</ul></body></html>", a = s;
          } else a = ir(r.finalJson);
          try {
            di(a, r.mimeType);
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
async function el(e = {}) {
  try {
    if (typeof document > "u" || typeof location > "u") return !1;
    let t = !1, n = !1, i = !1, r = !1;
    try {
      const o = new URLSearchParams(location.search || "");
      if (o.has("sitemap")) {
        let u = !0;
        for (const f of o.keys()) f !== "sitemap" && (u = !1);
        u && (t = !0);
      }
      if (o.has("rss")) {
        let u = !0;
        for (const f of o.keys()) f !== "rss" && (u = !1);
        u && (n = !0);
      }
      if (o.has("atom")) {
        let u = !0;
        for (const f of o.keys()) f !== "atom" && (u = !1);
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
      if (typeof ht == "function")
        try {
          const o = await ht({ timeoutMs: s, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 });
          if (Array.isArray(o) && o.length)
            if (Array.isArray(e.index) && e.index.length) {
              const u = /* @__PURE__ */ new Map();
              try {
                for (const f of e.index)
                  try {
                    f && f.slug && u.set(String(f.slug), f);
                  } catch {
                  }
                for (const f of o)
                  try {
                    f && f.slug && u.set(String(f.slug), f);
                  } catch {
                  }
              } catch {
              }
              a = Array.from(u.values());
            } else
              a = o;
          else
            a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(j) && j.length ? j : [];
        } catch {
          a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(j) && j.length ? j : [];
        }
      else
        a = Array.isArray(j) && j.length ? j : Array.isArray(e.index) && e.index.length ? e.index : [];
    } catch {
      a = Array.isArray(e.index) && e.index.length ? e.index : Array.isArray(j) && j.length ? j : [];
    }
    try {
      if (Array.isArray(e.index) && e.index.length)
        try {
          const o = /* @__PURE__ */ new Map();
          for (const u of e.index)
            try {
              if (!u || !u.slug) continue;
              const f = String(u.slug).split("::")[0];
              if (!o.has(f)) o.set(f, u);
              else {
                const h = o.get(f);
                h && String(h.slug || "").indexOf("::") !== -1 && String(u.slug || "").indexOf("::") === -1 && o.set(f, u);
              }
            } catch {
            }
          try {
            console.log("[runtimeSitemap] providedIndex.dedupedByBase:", JSON.stringify(Array.from(o.values()), null, 2));
          } catch {
            console.log("[runtimeSitemap] providedIndex.dedupedByBase (count):", o.size);
          }
        } catch (o) {
          console.warn("[runtimeSitemap] logging provided index failed", o);
        }
    } catch {
    }
    if ((!Array.isArray(a) || !a.length) && typeof _t == "function")
      try {
        const o = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
        let u = null;
        try {
          typeof ht == "function" && (u = await ht({ timeoutMs: o, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 }));
        } catch {
          u = null;
        }
        if (Array.isArray(u) && u.length)
          a = u;
        else {
          const f = typeof e.indexDepth == "number" ? e.indexDepth : 3, h = Array.isArray(e.noIndexing) ? e.noIndexing : void 0, w = [];
          e && e.homePage && w.push(e.homePage), e && e.navigationPage && w.push(e.navigationPage), a = await _t(e && e.contentBase ? e.contentBase : void 0, f, h, w.length ? w : void 0);
        }
      } catch (o) {
        console.warn("[runtimeSitemap] rebuild index failed", o), a = Array.isArray(j) && j.length ? j : [];
      }
    try {
      const o = Array.isArray(a) ? a.length : 0;
      try {
        console.log("[runtimeSitemap] usedIndex.full.length (before rebuild):", o);
      } catch {
      }
      try {
        console.log("[runtimeSitemap] usedIndex.full (before rebuild):", JSON.stringify(a, null, 2));
      } catch {
      }
    } catch {
    }
    try {
      const o = [];
      e && e.homePage && o.push(e.homePage), e && e.navigationPage && o.push(e.navigationPage);
      const u = typeof e.indexDepth == "number" ? e.indexDepth : 3, f = Array.isArray(e.noIndexing) ? e.noIndexing : void 0;
      let h = null;
      try {
        const w = typeof globalThis < "u" && typeof globalThis.buildSearchIndexWorker == "function" ? globalThis.buildSearchIndexWorker : void 0;
        if (typeof w == "function")
          try {
            h = await w(e && e.contentBase ? e.contentBase : void 0, u, f);
          } catch {
            h = null;
          }
      } catch {
        h = null;
      }
      if ((!h || !h.length) && typeof _t == "function")
        try {
          h = await _t(e && e.contentBase ? e.contentBase : void 0, u, f, o.length ? o : void 0);
        } catch {
          h = null;
        }
      if (Array.isArray(h) && h.length) {
        const w = /* @__PURE__ */ new Map();
        try {
          for (const m of a)
            try {
              m && m.slug && w.set(String(m.slug), m);
            } catch {
            }
          for (const m of h)
            try {
              m && m.slug && w.set(String(m.slug), m);
            } catch {
            }
        } catch {
        }
        a = Array.from(w.values());
      }
    } catch (o) {
      try {
        console.warn("[runtimeSitemap] rebuild index call failed", o);
      } catch {
      }
    }
    try {
      const o = Array.isArray(a) ? a.length : 0;
      try {
        console.log("[runtimeSitemap] usedIndex.full.length (after rebuild):", o);
      } catch {
      }
      try {
        console.log("[runtimeSitemap] usedIndex.full (after rebuild):", JSON.stringify(a, null, 2));
      } catch {
      }
    } catch {
    }
    const c = await Sr(Object.assign({}, e, { index: a }));
    let l = [];
    try {
      const o = /* @__PURE__ */ new Set(), u = Array.isArray(c && c.entries) ? c.entries : [];
      for (const f of u)
        try {
          let h = null;
          if (f && f.slug) h = String(f.slug);
          else if (f && f.loc)
            try {
              h = new URL(String(f.loc)).searchParams.get("page");
            } catch {
            }
          if (!h) continue;
          const w = String(h).split("::")[0];
          if (!o.has(w)) {
            o.add(w);
            const m = Object.assign({}, f);
            m.baseSlug = w, l.push(m);
          }
        } catch {
        }
      try {
        console.log("[runtimeSitemap] finalEntries.dedupedByBase:", JSON.stringify(l, null, 2));
      } catch {
        console.log("[runtimeSitemap] finalEntries.dedupedByBase (count):", l.length);
      }
    } catch {
      try {
        l = Array.isArray(c && c.entries) ? c.entries.slice(0) : [];
      } catch {
        l = [];
      }
    }
    const d = Object.assign({}, c || {}, { entries: Array.isArray(l) ? l : Array.isArray(c && c.entries) ? c.entries : [] });
    try {
      if (typeof window < "u")
        try {
          window.__nimbiSitemapJson = d, window.__nimbiSitemapFinal = l;
        } catch {
        }
    } catch {
    }
    if (n) {
      const o = Array.isArray(d && d.entries) ? d.entries.length : 0;
      let u = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (u = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (u > o) {
        try {
          console.log("[runtimeSitemap] skip RSS write: existing rendered sitemap larger", u, o);
        } catch {
        }
        return !0;
      }
      return pn(d, "application/rss+xml"), !0;
    }
    if (i) {
      const o = Array.isArray(d && d.entries) ? d.entries.length : 0;
      let u = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (u = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (u > o) {
        try {
          console.log("[runtimeSitemap] skip Atom write: existing rendered sitemap larger", u, o);
        } catch {
        }
        return !0;
      }
      return pn(d, "application/atom+xml"), !0;
    }
    if (t) {
      const o = Array.isArray(d && d.entries) ? d.entries.length : 0;
      let u = -1;
      try {
        typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (u = window.__nimbiSitemapFinal.length);
      } catch {
      }
      if (u > o) {
        try {
          console.log("[runtimeSitemap] skip XML write: existing rendered sitemap larger", u, o);
        } catch {
        }
        return !0;
      }
      return pn(d, "application/xml"), !0;
    }
    if (r)
      try {
        const u = (Array.isArray(d && d.entries) ? d.entries : []).length;
        let f = -1;
        try {
          typeof window < "u" && Array.isArray(window.__nimbiSitemapFinal) && typeof window.__nimbiSitemapRenderedAt == "number" && (f = window.__nimbiSitemapFinal.length);
        } catch {
        }
        if (f > u) {
          try {
            console.log("[runtimeSitemap] skip HTML write: existing rendered sitemap larger", f, u);
          } catch {
          }
          return !0;
        }
        return pn(d, "text/html"), !0;
      } catch (o) {
        return console.warn("[runtimeSitemap] render HTML failed", o), !1;
      }
    return !1;
  } catch (t) {
    return console.warn("[runtimeSitemap] handleSitemapRequest failed", t), !1;
  }
}
async function tl(e = {}) {
  try {
    const t = typeof e.waitForIndexMs == "number" ? e.waitForIndexMs : 1 / 0;
    let n = [];
    try {
      if (typeof ht == "function")
        try {
          const s = await ht({ timeoutMs: t, contentBase: e && e.contentBase, indexDepth: e && e.indexDepth, noIndexing: e && e.noIndexing, startBuild: !0 });
          Array.isArray(s) && s.length && (n = s);
        } catch {
        }
    } catch {
    }
    (!Array.isArray(n) || !n.length) && Array.isArray(j) && j.length && (n = j), (!Array.isArray(n) || !n.length) && Array.isArray(e.index) && e.index.length && (n = e.index);
    const i = await Sr(Object.assign({}, e, { index: n }));
    let r = [];
    try {
      const s = /* @__PURE__ */ new Set(), c = Array.isArray(i && i.entries) ? i.entries : [];
      for (const l of c)
        try {
          let d = null;
          if (l && l.slug) d = String(l.slug);
          else if (l && l.loc)
            try {
              d = new URL(String(l.loc)).searchParams.get("page");
            } catch {
              d = null;
            }
          if (!d) continue;
          const o = String(d).split("::")[0];
          if (!s.has(o)) {
            s.add(o);
            const u = Object.assign({}, l);
            u.baseSlug = o, r.push(u);
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
const Gt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  exposeSitemapGlobals: tl,
  generateAtomXml: sr,
  generateRssXml: ar,
  generateSitemapJson: Sr,
  generateSitemapXml: ir,
  handleSitemapRequest: el
}, Symbol.toStringTag, { value: "Module" }));
export {
  pi as BAD_LANGUAGES,
  me as SUPPORTED_HLJS_MAP,
  al as _clearHooks,
  or as addHook,
  ll as default,
  Ba as ensureBulma,
  Vo as getVersion,
  ll as initCMS,
  yi as loadL10nFile,
  gi as loadSupportedLanguages,
  Ia as observeCodeBlocks,
  rl as onNavBuild,
  nl as onPageLoad,
  Xt as registerLanguage,
  qr as runHooks,
  sl as setHighlightTheme,
  bi as setLang,
  Na as setStyle,
  ol as setThemeVars,
  It as t,
  il as transformHtml
};
