(function(oe,De){typeof exports=="object"&&typeof module<"u"?De(exports):typeof define=="function"&&define.amd?define(["exports"],De):(oe=typeof globalThis<"u"?globalThis:oe||self,De(oe.nimbiCMS={}))})(this,(function(oe){"use strict";const De={onPageLoad:[],onNavBuild:[],transformHtml:[]};function Tt(t,e){if(!Object.prototype.hasOwnProperty.call(De,t))throw new Error('Unknown hook "'+t+'"');if(typeof e!="function")throw new TypeError("hook callback must be a function");De[t].push(e)}function ys(t){Tt("onPageLoad",t)}function ks(t){Tt("onNavBuild",t)}function xs(t){Tt("transformHtml",t)}async function Jt(t,e){const r=De[t]||[];for(const i of r)try{await i(e)}catch(n){console.warn("[nimbi-cms] runHooks callback failed",n)}}function Ss(){Object.keys(De).forEach(t=>{De[t].length=0})}function qn(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var en,jn;function vs(){if(jn)return en;jn=1;function t(p){return p instanceof Map?p.clear=p.delete=p.set=function(){throw new Error("map is read-only")}:p instanceof Set&&(p.add=p.clear=p.delete=function(){throw new Error("set is read-only")}),Object.freeze(p),Object.getOwnPropertyNames(p).forEach(S=>{const T=p[S],F=typeof T;(F==="object"||F==="function")&&!Object.isFrozen(T)&&t(T)}),p}class e{constructor(S){S.data===void 0&&(S.data={}),this.data=S.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function r(p){return p.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function i(p,...S){const T=Object.create(null);for(const F in p)T[F]=p[F];return S.forEach(function(F){for(const he in F)T[he]=F[he]}),T}const n="</span>",s=p=>!!p.scope,a=(p,{prefix:S})=>{if(p.startsWith("language:"))return p.replace("language:","language-");if(p.includes(".")){const T=p.split(".");return[`${S}${T.shift()}`,...T.map((F,he)=>`${F}${"_".repeat(he+1)}`)].join(" ")}return`${S}${p}`};class u{constructor(S,T){this.buffer="",this.classPrefix=T.classPrefix,S.walk(this)}addText(S){this.buffer+=r(S)}openNode(S){if(!s(S))return;const T=a(S.scope,{prefix:this.classPrefix});this.span(T)}closeNode(S){s(S)&&(this.buffer+=n)}value(){return this.buffer}span(S){this.buffer+=`<span class="${S}">`}}const l=(p={})=>{const S={children:[]};return Object.assign(S,p),S};class o{constructor(){this.rootNode=l(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(S){this.top.children.push(S)}openNode(S){const T=l({scope:S});this.add(T),this.stack.push(T)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(S){return this.constructor._walk(S,this.rootNode)}static _walk(S,T){return typeof T=="string"?S.addText(T):T.children&&(S.openNode(T),T.children.forEach(F=>this._walk(S,F)),S.closeNode(T)),S}static _collapse(S){typeof S!="string"&&S.children&&(S.children.every(T=>typeof T=="string")?S.children=[S.children.join("")]:S.children.forEach(T=>{o._collapse(T)}))}}class c extends o{constructor(S){super(),this.options=S}addText(S){S!==""&&this.add(S)}startScope(S){this.openNode(S)}endScope(){this.closeNode()}__addSublanguage(S,T){const F=S.root;T&&(F.scope=`language:${T}`),this.add(F)}toHTML(){return new u(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function h(p){return p?typeof p=="string"?p:p.source:null}function f(p){return m("(?=",p,")")}function g(p){return m("(?:",p,")*")}function d(p){return m("(?:",p,")?")}function m(...p){return p.map(T=>h(T)).join("")}function w(p){const S=p[p.length-1];return typeof S=="object"&&S.constructor===Object?(p.splice(p.length-1,1),S):{}}function k(...p){return"("+(w(p).capture?"":"?:")+p.map(F=>h(F)).join("|")+")"}function v(p){return new RegExp(p.toString()+"|").exec("").length-1}function N(p,S){const T=p&&p.exec(S);return T&&T.index===0}const E=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function U(p,{joinWith:S}){let T=0;return p.map(F=>{T+=1;const he=T;let de=h(F),B="";for(;de.length>0;){const $=E.exec(de);if(!$){B+=de;break}B+=de.substring(0,$.index),de=de.substring($.index+$[0].length),$[0][0]==="\\"&&$[1]?B+="\\"+String(Number($[1])+he):(B+=$[0],$[0]==="("&&T++)}return B}).map(F=>`(${F})`).join(S)}const P=/\b\B/,X="[a-zA-Z]\\w*",ee="[a-zA-Z_]\\w*",te="\\b\\d+(\\.\\d+)?",se="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",I="\\b(0b[01]+)",_="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",M=(p={})=>{const S=/^#![ ]*\//;return p.binary&&(p.begin=m(S,/.*\b/,p.binary,/\b.*/)),i({scope:"meta",begin:S,end:/$/,relevance:0,"on:begin":(T,F)=>{T.index!==0&&F.ignoreMatch()}},p)},C={begin:"\\\\[\\s\\S]",relevance:0},x={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[C]},b={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[C]},R={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},y=function(p,S,T={}){const F=i({scope:"comment",begin:p,end:S,contains:[]},T);F.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const he=k("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return F.contains.push({begin:m(/[ ]+/,"(",he,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),F},z=y("//","$"),G=y("/\\*","\\*/"),ne=y("#","$"),Ce={scope:"number",begin:te,relevance:0},Ee={scope:"number",begin:se,relevance:0},xe={scope:"number",begin:I,relevance:0},me={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[C,{begin:/\[/,end:/\]/,relevance:0,contains:[C]}]},Le={scope:"title",begin:X,relevance:0},He={scope:"title",begin:ee,relevance:0},xa={begin:"\\.\\s*"+ee,relevance:0};var Zt=Object.freeze({__proto__:null,APOS_STRING_MODE:x,BACKSLASH_ESCAPE:C,BINARY_NUMBER_MODE:xe,BINARY_NUMBER_RE:I,COMMENT:y,C_BLOCK_COMMENT_MODE:G,C_LINE_COMMENT_MODE:z,C_NUMBER_MODE:Ee,C_NUMBER_RE:se,END_SAME_AS_BEGIN:function(p){return Object.assign(p,{"on:begin":(S,T)=>{T.data._beginMatch=S[1]},"on:end":(S,T)=>{T.data._beginMatch!==S[1]&&T.ignoreMatch()}})},HASH_COMMENT_MODE:ne,IDENT_RE:X,MATCH_NOTHING_RE:P,METHOD_GUARD:xa,NUMBER_MODE:Ce,NUMBER_RE:te,PHRASAL_WORDS_MODE:R,QUOTE_STRING_MODE:b,REGEXP_MODE:me,RE_STARTERS_RE:_,SHEBANG:M,TITLE_MODE:Le,UNDERSCORE_IDENT_RE:ee,UNDERSCORE_TITLE_MODE:He});function Sa(p,S){p.input[p.index-1]==="."&&S.ignoreMatch()}function va(p,S){p.className!==void 0&&(p.scope=p.className,delete p.className)}function Ea(p,S){S&&p.beginKeywords&&(p.begin="\\b("+p.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",p.__beforeBegin=Sa,p.keywords=p.keywords||p.beginKeywords,delete p.beginKeywords,p.relevance===void 0&&(p.relevance=0))}function Aa(p,S){Array.isArray(p.illegal)&&(p.illegal=k(...p.illegal))}function Ra(p,S){if(p.match){if(p.begin||p.end)throw new Error("begin & end are not supported with match");p.begin=p.match,delete p.match}}function Ta(p,S){p.relevance===void 0&&(p.relevance=1)}const Ca=(p,S)=>{if(!p.beforeMatch)return;if(p.starts)throw new Error("beforeMatch cannot be used with starts");const T=Object.assign({},p);Object.keys(p).forEach(F=>{delete p[F]}),p.keywords=T.keywords,p.begin=m(T.beforeMatch,f(T.begin)),p.starts={relevance:0,contains:[Object.assign(T,{endsParent:!0})]},p.relevance=0,delete T.beforeMatch},La=["of","and","for","in","not","or","if","then","parent","list","value"],_a="keyword";function rs(p,S,T=_a){const F=Object.create(null);return typeof p=="string"?he(T,p.split(" ")):Array.isArray(p)?he(T,p):Object.keys(p).forEach(function(de){Object.assign(F,rs(p[de],S,de))}),F;function he(de,B){S&&(B=B.map($=>$.toLowerCase())),B.forEach(function($){const H=$.split("|");F[H[0]]=[de,Ma(H[0],H[1])]})}}function Ma(p,S){return S?Number(S):$a(p)?0:1}function $a(p){return La.includes(p.toLowerCase())}const ss={},et=p=>{console.error(p)},is=(p,...S)=>{console.log(`WARN: ${p}`,...S)},ot=(p,S)=>{ss[`${p}/${S}`]||(console.log(`Deprecated as of ${p}. ${S}`),ss[`${p}/${S}`]=!0)},Qt=new Error;function as(p,S,{key:T}){let F=0;const he=p[T],de={},B={};for(let $=1;$<=S.length;$++)B[$+F]=he[$],de[$+F]=!0,F+=v(S[$-1]);p[T]=B,p[T]._emit=de,p[T]._multi=!0}function Pa(p){if(Array.isArray(p.begin)){if(p.skip||p.excludeBegin||p.returnBegin)throw et("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),Qt;if(typeof p.beginScope!="object"||p.beginScope===null)throw et("beginScope must be object"),Qt;as(p,p.begin,{key:"beginScope"}),p.begin=U(p.begin,{joinWith:""})}}function Ia(p){if(Array.isArray(p.end)){if(p.skip||p.excludeEnd||p.returnEnd)throw et("skip, excludeEnd, returnEnd not compatible with endScope: {}"),Qt;if(typeof p.endScope!="object"||p.endScope===null)throw et("endScope must be object"),Qt;as(p,p.end,{key:"endScope"}),p.end=U(p.end,{joinWith:""})}}function za(p){p.scope&&typeof p.scope=="object"&&p.scope!==null&&(p.beginScope=p.scope,delete p.scope)}function Ba(p){za(p),typeof p.beginScope=="string"&&(p.beginScope={_wrap:p.beginScope}),typeof p.endScope=="string"&&(p.endScope={_wrap:p.endScope}),Pa(p),Ia(p)}function Oa(p){function S(B,$){return new RegExp(h(B),"m"+(p.case_insensitive?"i":"")+(p.unicodeRegex?"u":"")+($?"g":""))}class T{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule($,H){H.position=this.position++,this.matchIndexes[this.matchAt]=H,this.regexes.push([H,$]),this.matchAt+=v($)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const $=this.regexes.map(H=>H[1]);this.matcherRe=S(U($,{joinWith:"|"}),!0),this.lastIndex=0}exec($){this.matcherRe.lastIndex=this.lastIndex;const H=this.matcherRe.exec($);if(!H)return null;const ge=H.findIndex((Rt,In)=>In>0&&Rt!==void 0),pe=this.matchIndexes[ge];return H.splice(0,ge),Object.assign(H,pe)}}class F{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher($){if(this.multiRegexes[$])return this.multiRegexes[$];const H=new T;return this.rules.slice($).forEach(([ge,pe])=>H.addRule(ge,pe)),H.compile(),this.multiRegexes[$]=H,H}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule($,H){this.rules.push([$,H]),H.type==="begin"&&this.count++}exec($){const H=this.getMatcher(this.regexIndex);H.lastIndex=this.lastIndex;let ge=H.exec($);if(this.resumingScanAtSamePosition()&&!(ge&&ge.index===this.lastIndex)){const pe=this.getMatcher(0);pe.lastIndex=this.lastIndex+1,ge=pe.exec($)}return ge&&(this.regexIndex+=ge.position+1,this.regexIndex===this.count&&this.considerAll()),ge}}function he(B){const $=new F;return B.contains.forEach(H=>$.addRule(H.begin,{rule:H,type:"begin"})),B.terminatorEnd&&$.addRule(B.terminatorEnd,{type:"end"}),B.illegal&&$.addRule(B.illegal,{type:"illegal"}),$}function de(B,$){const H=B;if(B.isCompiled)return H;[va,Ra,Ba,Ca].forEach(pe=>pe(B,$)),p.compilerExtensions.forEach(pe=>pe(B,$)),B.__beforeBegin=null,[Ea,Aa,Ta].forEach(pe=>pe(B,$)),B.isCompiled=!0;let ge=null;return typeof B.keywords=="object"&&B.keywords.$pattern&&(B.keywords=Object.assign({},B.keywords),ge=B.keywords.$pattern,delete B.keywords.$pattern),ge=ge||/\w+/,B.keywords&&(B.keywords=rs(B.keywords,p.case_insensitive)),H.keywordPatternRe=S(ge,!0),$&&(B.begin||(B.begin=/\B|\b/),H.beginRe=S(H.begin),!B.end&&!B.endsWithParent&&(B.end=/\B|\b/),B.end&&(H.endRe=S(H.end)),H.terminatorEnd=h(H.end)||"",B.endsWithParent&&$.terminatorEnd&&(H.terminatorEnd+=(B.end?"|":"")+$.terminatorEnd)),B.illegal&&(H.illegalRe=S(B.illegal)),B.contains||(B.contains=[]),B.contains=[].concat(...B.contains.map(function(pe){return Na(pe==="self"?B:pe)})),B.contains.forEach(function(pe){de(pe,H)}),B.starts&&de(B.starts,$),H.matcher=he(H),H}if(p.compilerExtensions||(p.compilerExtensions=[]),p.contains&&p.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return p.classNameAliases=i(p.classNameAliases||{}),de(p)}function ls(p){return p?p.endsWithParent||ls(p.starts):!1}function Na(p){return p.variants&&!p.cachedVariants&&(p.cachedVariants=p.variants.map(function(S){return i(p,{variants:null},S)})),p.cachedVariants?p.cachedVariants:ls(p)?i(p,{starts:p.starts?i(p.starts):null}):Object.isFrozen(p)?i(p):p}var Da="11.11.1";class Ua extends Error{constructor(S,T){super(S),this.name="HTMLInjectionError",this.html=T}}const Pn=r,os=i,cs=Symbol("nomatch"),Ha=7,us=function(p){const S=Object.create(null),T=Object.create(null),F=[];let he=!0;const de="Could not find the language '{}', did you forget to load/include a language module?",B={disableAutodetect:!0,name:"Plain text",contains:[]};let $={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:c};function H(A){return $.noHighlightRe.test(A)}function ge(A){let D=A.className+" ";D+=A.parentNode?A.parentNode.className:"";const K=$.languageDetectRe.exec(D);if(K){const ae=Xe(K[1]);return ae||(is(de.replace("{}",K[1])),is("Falling back to no-highlight mode for this block.",A)),ae?K[1]:"no-highlight"}return D.split(/\s+/).find(ae=>H(ae)||Xe(ae))}function pe(A,D,K){let ae="",fe="";typeof D=="object"?(ae=A,K=D.ignoreIllegals,fe=D.language):(ot("10.7.0","highlight(lang, code, ...args) has been deprecated."),ot("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),fe=A,ae=D),K===void 0&&(K=!0);const Ie={code:ae,language:fe};Xt("before:highlight",Ie);const Ye=Ie.result?Ie.result:Rt(Ie.language,Ie.code,K);return Ye.code=Ie.code,Xt("after:highlight",Ye),Ye}function Rt(A,D,K,ae){const fe=Object.create(null);function Ie(L,O){return L.keywords[O]}function Ye(){if(!W.keywords){we.addText(le);return}let L=0;W.keywordPatternRe.lastIndex=0;let O=W.keywordPatternRe.exec(le),Z="";for(;O;){Z+=le.substring(L,O.index);const re=Ne.case_insensitive?O[0].toLowerCase():O[0],Se=Ie(W,re);if(Se){const[qe,sl]=Se;if(we.addText(Z),Z="",fe[re]=(fe[re]||0)+1,fe[re]<=Ha&&(Vt+=sl),qe.startsWith("_"))Z+=O[0];else{const il=Ne.classNameAliases[qe]||qe;Oe(O[0],il)}}else Z+=O[0];L=W.keywordPatternRe.lastIndex,O=W.keywordPatternRe.exec(le)}Z+=le.substring(L),we.addText(Z)}function Yt(){if(le==="")return;let L=null;if(typeof W.subLanguage=="string"){if(!S[W.subLanguage]){we.addText(le);return}L=Rt(W.subLanguage,le,!0,bs[W.subLanguage]),bs[W.subLanguage]=L._top}else L=zn(le,W.subLanguage.length?W.subLanguage:null);W.relevance>0&&(Vt+=L.relevance),we.__addSublanguage(L._emitter,L.language)}function _e(){W.subLanguage!=null?Yt():Ye(),le=""}function Oe(L,O){L!==""&&(we.startScope(O),we.addText(L),we.endScope())}function fs(L,O){let Z=1;const re=O.length-1;for(;Z<=re;){if(!L._emit[Z]){Z++;continue}const Se=Ne.classNameAliases[L[Z]]||L[Z],qe=O[Z];Se?Oe(qe,Se):(le=qe,Ye(),le=""),Z++}}function gs(L,O){return L.scope&&typeof L.scope=="string"&&we.openNode(Ne.classNameAliases[L.scope]||L.scope),L.beginScope&&(L.beginScope._wrap?(Oe(le,Ne.classNameAliases[L.beginScope._wrap]||L.beginScope._wrap),le=""):L.beginScope._multi&&(fs(L.beginScope,O),le="")),W=Object.create(L,{parent:{value:W}}),W}function ms(L,O,Z){let re=N(L.endRe,Z);if(re){if(L["on:end"]){const Se=new e(L);L["on:end"](O,Se),Se.isMatchIgnored&&(re=!1)}if(re){for(;L.endsParent&&L.parent;)L=L.parent;return L}}if(L.endsWithParent)return ms(L.parent,O,Z)}function Ja(L){return W.matcher.regexIndex===0?(le+=L[0],1):(Dn=!0,0)}function el(L){const O=L[0],Z=L.rule,re=new e(Z),Se=[Z.__beforeBegin,Z["on:begin"]];for(const qe of Se)if(qe&&(qe(L,re),re.isMatchIgnored))return Ja(O);return Z.skip?le+=O:(Z.excludeBegin&&(le+=O),_e(),!Z.returnBegin&&!Z.excludeBegin&&(le=O)),gs(Z,L),Z.returnBegin?0:O.length}function tl(L){const O=L[0],Z=D.substring(L.index),re=ms(W,L,Z);if(!re)return cs;const Se=W;W.endScope&&W.endScope._wrap?(_e(),Oe(O,W.endScope._wrap)):W.endScope&&W.endScope._multi?(_e(),fs(W.endScope,L)):Se.skip?le+=O:(Se.returnEnd||Se.excludeEnd||(le+=O),_e(),Se.excludeEnd&&(le=O));do W.scope&&we.closeNode(),!W.skip&&!W.subLanguage&&(Vt+=W.relevance),W=W.parent;while(W!==re.parent);return re.starts&&gs(re.starts,L),Se.returnEnd?0:O.length}function nl(){const L=[];for(let O=W;O!==Ne;O=O.parent)O.scope&&L.unshift(O.scope);L.forEach(O=>we.openNode(O))}let Kt={};function ws(L,O){const Z=O&&O[0];if(le+=L,Z==null)return _e(),0;if(Kt.type==="begin"&&O.type==="end"&&Kt.index===O.index&&Z===""){if(le+=D.slice(O.index,O.index+1),!he){const re=new Error(`0 width match regex (${A})`);throw re.languageName=A,re.badRule=Kt.rule,re}return 1}if(Kt=O,O.type==="begin")return el(O);if(O.type==="illegal"&&!K){const re=new Error('Illegal lexeme "'+Z+'" for mode "'+(W.scope||"<unnamed>")+'"');throw re.mode=W,re}else if(O.type==="end"){const re=tl(O);if(re!==cs)return re}if(O.type==="illegal"&&Z==="")return le+=`
`,1;if(Nn>1e5&&Nn>O.index*3)throw new Error("potential infinite loop, way more iterations than matches");return le+=Z,Z.length}const Ne=Xe(A);if(!Ne)throw et(de.replace("{}",A)),new Error('Unknown language: "'+A+'"');const rl=Oa(Ne);let On="",W=ae||rl;const bs={},we=new $.__emitter($);nl();let le="",Vt=0,tt=0,Nn=0,Dn=!1;try{if(Ne.__emitTokens)Ne.__emitTokens(D,we);else{for(W.matcher.considerAll();;){Nn++,Dn?Dn=!1:W.matcher.considerAll(),W.matcher.lastIndex=tt;const L=W.matcher.exec(D);if(!L)break;const O=D.substring(tt,L.index),Z=ws(O,L);tt=L.index+Z}ws(D.substring(tt))}return we.finalize(),On=we.toHTML(),{language:A,value:On,relevance:Vt,illegal:!1,_emitter:we,_top:W}}catch(L){if(L.message&&L.message.includes("Illegal"))return{language:A,value:Pn(D),illegal:!0,relevance:0,_illegalBy:{message:L.message,index:tt,context:D.slice(tt-100,tt+100),mode:L.mode,resultSoFar:On},_emitter:we};if(he)return{language:A,value:Pn(D),illegal:!1,relevance:0,errorRaised:L,_emitter:we,_top:W};throw L}}function In(A){const D={value:Pn(A),illegal:!1,relevance:0,_top:B,_emitter:new $.__emitter($)};return D._emitter.addText(A),D}function zn(A,D){D=D||$.languages||Object.keys(S);const K=In(A),ae=D.filter(Xe).filter(ps).map(_e=>Rt(_e,A,!1));ae.unshift(K);const fe=ae.sort((_e,Oe)=>{if(_e.relevance!==Oe.relevance)return Oe.relevance-_e.relevance;if(_e.language&&Oe.language){if(Xe(_e.language).supersetOf===Oe.language)return 1;if(Xe(Oe.language).supersetOf===_e.language)return-1}return 0}),[Ie,Ye]=fe,Yt=Ie;return Yt.secondBest=Ye,Yt}function qa(A,D,K){const ae=D&&T[D]||K;A.classList.add("hljs"),A.classList.add(`language-${ae}`)}function Bn(A){let D=null;const K=ge(A);if(H(K))return;if(Xt("before:highlightElement",{el:A,language:K}),A.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",A);return}if(A.children.length>0&&($.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(A)),$.throwUnescapedHTML))throw new Ua("One of your code blocks includes unescaped HTML.",A.innerHTML);D=A;const ae=D.textContent,fe=K?pe(ae,{language:K,ignoreIllegals:!0}):zn(ae);A.innerHTML=fe.value,A.dataset.highlighted="yes",qa(A,K,fe.language),A.result={language:fe.language,re:fe.relevance,relevance:fe.relevance},fe.secondBest&&(A.secondBest={language:fe.secondBest.language,relevance:fe.secondBest.relevance}),Xt("after:highlightElement",{el:A,result:fe,text:ae})}function ja(A){$=os($,A)}const Fa=()=>{Gt(),ot("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function Wa(){Gt(),ot("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let hs=!1;function Gt(){function A(){Gt()}if(document.readyState==="loading"){hs||window.addEventListener("DOMContentLoaded",A,!1),hs=!0;return}document.querySelectorAll($.cssSelector).forEach(Bn)}function Za(A,D){let K=null;try{K=D(p)}catch(ae){if(et("Language definition for '{}' could not be registered.".replace("{}",A)),he)et(ae);else throw ae;K=B}K.name||(K.name=A),S[A]=K,K.rawDefinition=D.bind(null,p),K.aliases&&ds(K.aliases,{languageName:A})}function Qa(A){delete S[A];for(const D of Object.keys(T))T[D]===A&&delete T[D]}function Ga(){return Object.keys(S)}function Xe(A){return A=(A||"").toLowerCase(),S[A]||S[T[A]]}function ds(A,{languageName:D}){typeof A=="string"&&(A=[A]),A.forEach(K=>{T[K.toLowerCase()]=D})}function ps(A){const D=Xe(A);return D&&!D.disableAutodetect}function Xa(A){A["before:highlightBlock"]&&!A["before:highlightElement"]&&(A["before:highlightElement"]=D=>{A["before:highlightBlock"](Object.assign({block:D.el},D))}),A["after:highlightBlock"]&&!A["after:highlightElement"]&&(A["after:highlightElement"]=D=>{A["after:highlightBlock"](Object.assign({block:D.el},D))})}function Ya(A){Xa(A),F.push(A)}function Ka(A){const D=F.indexOf(A);D!==-1&&F.splice(D,1)}function Xt(A,D){const K=A;F.forEach(function(ae){ae[K]&&ae[K](D)})}function Va(A){return ot("10.7.0","highlightBlock will be removed entirely in v12.0"),ot("10.7.0","Please use highlightElement now."),Bn(A)}Object.assign(p,{highlight:pe,highlightAuto:zn,highlightAll:Gt,highlightElement:Bn,highlightBlock:Va,configure:ja,initHighlighting:Fa,initHighlightingOnLoad:Wa,registerLanguage:Za,unregisterLanguage:Qa,listLanguages:Ga,getLanguage:Xe,registerAliases:ds,autoDetection:ps,inherit:os,addPlugin:Ya,removePlugin:Ka}),p.debugMode=function(){he=!1},p.safeMode=function(){he=!0},p.versionString=Da,p.regex={concat:m,lookahead:f,either:k,optional:d,anyNumberOfTimes:g};for(const A in Zt)typeof Zt[A]=="object"&&t(Zt[A]);return Object.assign(p,Zt),p},ct=us({});return ct.newInstance=()=>us({}),en=ct,ct.HighlightJS=ct,ct.default=ct,en}var Es=vs();const ce=qn(Es),Y=new Map,As="https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md",Ae={shell:"bash",sh:"bash",zsh:"bash",js:"javascript",ts:"typescript",py:"python",csharp:"cs","c#":"cs"};Ae.html="xml",Ae.xhtml="xml",Ae.markup="xml";const tn=new Set(["magic","undefined"]);let je=null;const Fn=new Map,Rs=300*1e3;async function nn(t=As){if(t)return je||(je=(async()=>{try{const e=await fetch(t);if(!e.ok)return;const i=(await e.text()).split(/\r?\n/);let n=-1;for(let o=0;o<i.length;o++)if(/\|\s*Language\s*\|/i.test(i[o])){n=o;break}if(n===-1)return;const s=i[n].replace(/^\||\|$/g,"").split("|").map(o=>o.trim().toLowerCase());let a=s.findIndex(o=>/alias|aliases|equivalent|alt|alternates?/i.test(o));a===-1&&(a=1);let u=s.findIndex(o=>/file|filename|module|module name|module-name|short|slug/i.test(o));if(u===-1){const o=s.findIndex(c=>/language/i.test(c));u=o!==-1?o:0}let l=[];for(let o=n+1;o<i.length;o++){const c=i[o].trim();if(!c||!c.startsWith("|"))break;const h=c.replace(/^\||\|$/g,"").split("|").map(w=>w.trim());if(h.every(w=>/^-+$/.test(w)))continue;const f=h;if(!f.length)continue;const d=(f[u]||f[0]||"").toString().trim().toLowerCase();if(!d||/^-+$/.test(d))continue;Y.set(d,d);const m=f[a]||"";if(m){const w=String(m).split(",").map(k=>k.replace(/`/g,"").trim()).filter(Boolean);if(w.length){const v=w[0].toLowerCase().replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");v&&/[a-z0-9]/i.test(v)&&(Y.set(v,v),l.push(v))}}}try{const o=[];for(const c of l){const h=String(c||"").replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");h&&/[a-z0-9]/i.test(h)?o.push(h):Y.delete(c)}l=o}catch(o){console.warn("[codeblocksManager] cleanup aliases failed",o)}try{let o=0;for(const c of Array.from(Y.keys())){if(!c||/^-+$/.test(c)||!/[a-z0-9]/i.test(c)){Y.delete(c),o++;continue}if(/^[:]+/.test(c)){const h=c.replace(/^[:]+/,"");if(h&&/[a-z0-9]/i.test(h)){const f=Y.get(c);Y.delete(c),Y.set(h,f)}else Y.delete(c),o++}}for(const[c,h]of Array.from(Y.entries()))(!h||/^-+$/.test(h)||!/[a-z0-9]/i.test(h))&&(Y.delete(c),o++);try{const c=":---------------------";Y.has(c)&&(Y.delete(c),o++)}catch(c){console.warn("[codeblocksManager] remove sep key failed",c)}try{const c=Array.from(Y.keys()).sort()}catch(c){console.warn("[codeblocksManager] compute supported keys failed",c)}}catch(o){console.warn("[codeblocksManager] ignored error",o)}}catch(e){console.warn("[codeblocksManager] loadSupportedLanguages failed",e)}})(),je)}const rn=new Set;async function nt(t,e){if(je||(async()=>{try{await nn()}catch(n){console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed",n)}})(),je)try{await je}catch{}if(t=t==null?"":String(t),t=t.trim(),!t)return!1;const r=t.toLowerCase();if(tn.has(r))return!1;if(Y.size&&!Y.has(r)){const n=Ae;if(!n[r]&&!n[t])return!1}if(rn.has(t))return!0;const i=Ae;try{const n=(e||t||"").toString().replace(/\.js$/i,"").trim(),s=(i[t]||t||"").toString(),a=(i[n]||n||"").toString();let u=Array.from(new Set([s,a,n,t,i[n],i[t]].filter(Boolean))).map(c=>String(c).toLowerCase()).filter(c=>c&&c!=="undefined");Y.size&&(u=u.filter(c=>{if(Y.has(c))return!0;const h=Ae[c];return!!(h&&Y.has(h))}));let l=null,o=null;for(const c of u)try{const h=Date.now(),f=Fn.get(c);if(f){if(f.ok===!1&&h-(f.ts||0)<Rs)l=null;else if(f.module)l=f.module;else if(f.promise)try{l=await f.promise}catch{l=null}}else{const g={promise:null,module:null,ok:null,ts:0};Fn.set(c,g),g.promise=(async()=>{try{try{return await import(`highlight.js/lib/languages/${c}.js`)}catch{try{const m=`https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${c}.js`;return await new Function("u","return import(u)")(m)}catch{try{const w=`https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${c}.js`;return await new Function("u","return import(u)")(w)}catch{return null}}}}catch{return null}})();try{l=await g.promise,g.module=l,g.ok=!!l,g.ts=Date.now()}catch{g.module=null,g.ok=!1,g.ts=Date.now(),l=null}}if(l){const g=l.default||l;try{const d=Y.size&&Y.get(t)||c||t;return ce.registerLanguage(d,g),rn.add(d),d!==t&&(ce.registerLanguage(t,g),rn.add(t)),!0}catch(d){o=d}}}catch(h){o=h}if(o)throw o;return!1}catch{return!1}}let Ct=null;function Wn(t=document){je||(async()=>{try{await nn()}catch(s){console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed",s)}})();const e=Ae,i=Ct||(typeof IntersectionObserver>"u"?null:(Ct=new IntersectionObserver((s,a)=>{s.forEach(u=>{if(!u.isIntersecting)return;const l=u.target;try{a.unobserve(l)}catch(o){console.warn("[codeblocksManager] observer unobserve failed",o)}(async()=>{try{const o=l.getAttribute&&l.getAttribute("class")||l.className||"",c=o.match(/language-([a-zA-Z0-9_+-]+)/)||o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(c&&c[1]){const h=(c[1]||"").toLowerCase(),f=e[h]||h,g=Y.size&&(Y.get(f)||Y.get(String(f).toLowerCase()))||f;try{await nt(g)}catch(d){console.warn("[codeblocksManager] registerLanguage failed",d)}try{ce.highlightElement(l)}catch(d){console.warn("[codeblocksManager] hljs.highlightElement failed",d)}}else try{const h=l.textContent||"";try{if(ce&&typeof ce.getLanguage=="function"&&ce.getLanguage("plaintext")){const f=ce.highlight(h,{language:"plaintext"});f&&f.value&&(l.innerHTML=f.value)}}catch{try{ce.highlightElement(l)}catch(g){console.warn("[codeblocksManager] fallback highlightElement failed",g)}}}catch(h){console.warn("[codeblocksManager] auto-detect plaintext failed",h)}}catch(o){console.warn("[codeblocksManager] observer entry processing failed",o)}})()})},{root:null,rootMargin:"300px",threshold:.1}),Ct)),n=t&&t.querySelectorAll?t.querySelectorAll("pre code"):[];if(!i){n.forEach(async s=>{try{const a=s.getAttribute&&s.getAttribute("class")||s.className||"",u=a.match(/language-([a-zA-Z0-9_+-]+)/)||a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(u&&u[1]){const l=(u[1]||"").toLowerCase(),o=e[l]||l,c=Y.size&&(Y.get(o)||Y.get(String(o).toLowerCase()))||o;try{await nt(c)}catch(h){console.warn("[codeblocksManager] registerLanguage failed (no observer)",h)}}try{ce.highlightElement(s)}catch(l){console.warn("[codeblocksManager] hljs.highlightElement failed (no observer)",l)}}catch(a){console.warn("[codeblocksManager] loadSupportedLanguages fallback ignored error",a)}});return}n.forEach(s=>{try{i.observe(s)}catch(a){console.warn("[codeblocksManager] observe failed",a)}})}function Ts(t,{useCdn:e=!0}={}){const r=document.querySelector("link[data-hl-theme]");r&&r.remove();let i=t||"monokai";if(i==="monokai")return;if(!e){console.warn("Requested highlight theme not bundled; set useCdn=true to load from CDN");return}const n=`https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/styles/${i}.css`,s=document.createElement("link");s.rel="stylesheet",s.href=n,s.setAttribute("data-hl-theme",i),document.head.appendChild(s)}let sn="light";function Cs(t,e={}){if(document.querySelector(`link[href="${t}"]`))return;const r=document.createElement("link");r.rel="stylesheet",r.href=t,Object.entries(e).forEach(([i,n])=>r.setAttribute(i,n)),document.head.appendChild(r)}async function Zn(t="none",e="/"){if(!t||t==="none")return;const r=[e+"bulma.css","/bulma.css"],i=Array.from(new Set(r));if(t==="local"){if(document.querySelector("style[data-bulma-override]"))return;for(const n of i)try{const s=await fetch(n,{method:"GET"});if(s.ok){const a=await s.text(),u=document.createElement("style");u.setAttribute("data-bulma-override",n),u.appendChild(document.createTextNode(`
/* bulma override: ${n} */
`+a)),document.head.appendChild(u);return}}catch(s){console.warn("[bulmaManager] fetch local bulma candidate failed",s)}return}try{const n=String(t).trim();if(!n)return;const s=`https://unpkg.com/bulmaswatch/${encodeURIComponent(n)}/bulmaswatch.min.css`;Cs(s,{"data-bulmaswatch-theme":n})}catch(n){console.warn("[bulmaManager] ensureBulma failed",n)}}function Qn(t){sn=t==="dark"?"dark":"light",document.documentElement.setAttribute("data-theme",sn),sn==="dark"?document.body.classList.add("is-dark"):document.body.classList.remove("is-dark")}function Ls(t){const e=document.documentElement;for(const[r,i]of Object.entries(t||{}))try{e.style.setProperty(`--${r}`,i)}catch(n){console.warn("[bulmaManager] setThemeVars failed for",r,n)}}const Gn={en:{navigation:"Navigation",onThisPage:"On this page",home:"Home",scrollToTop:"Scroll to top",readingTime:"{minutes} min read",searchPlaceholder:"Search…",imagePreviewTitle:"Image preview",imagePreviewFit:"Fit to screen",imagePreviewOriginal:"Original size",imagePreviewZoomOut:"Zoom out",imagePreviewZoomIn:"Zoom in",imagePreviewClose:"Close"},es:{navigation:"Navegación",onThisPage:"En esta página",home:"Inicio",scrollToTop:"Ir arriba",readingTime:"{minutes} min de lectura",searchPlaceholder:"Buscar…",imagePreviewTitle:"Previsualización de imagen",imagePreviewFit:"Ajustar a la pantalla",imagePreviewOriginal:"Tamaño original",imagePreviewZoomOut:"Alejar",imagePreviewZoomIn:"Acercar",imagePreviewClose:"Cerrar"},de:{navigation:"Navigation",onThisPage:"Auf dieser Seite",home:"Startseite",scrollToTop:"Nach oben",readingTime:"{minutes} min Lesezeit",searchPlaceholder:"Suchen…",imagePreviewTitle:"Bildvorschau",imagePreviewFit:"An Bildschirm anpassen",imagePreviewOriginal:"Originalgröße",imagePreviewZoomOut:"Verkleinern",imagePreviewZoomIn:"Vergrößern",imagePreviewClose:"Schließen"},fr:{navigation:"Navigation",onThisPage:"Sur cette page",home:"Accueil",scrollToTop:"Aller en haut",readingTime:"{minutes} min de lecture",searchPlaceholder:"Rechercher…",imagePreviewTitle:"Aperçu de l’image",imagePreviewFit:"Ajuster à l’écran",imagePreviewOriginal:"Taille originale",imagePreviewZoomOut:"Dézoomer",imagePreviewZoomIn:"Zoomer",imagePreviewClose:"Fermer"},pt:{navigation:"Navegação",onThisPage:"Nesta página",home:"Início",scrollToTop:"Ir para o topo",readingTime:"{minutes} min de leitura",searchPlaceholder:"Procurar…",imagePreviewTitle:"Visualização da imagem",imagePreviewFit:"Ajustar à tela",imagePreviewOriginal:"Tamanho original",imagePreviewZoomOut:"Diminuir",imagePreviewZoomIn:"Aumentar",imagePreviewClose:"Fechar"}},rt=JSON.parse(JSON.stringify(Gn));let Lt="en";if(typeof navigator<"u"){const t=navigator.language||navigator.languages&&navigator.languages[0]||"en";Lt=String(t).split("-")[0].toLowerCase()}Gn[Lt]||(Lt="en");let Fe=Lt;function st(t,e={}){const r=rt[Fe]||rt.en;let i=r&&r[t]?r[t]:rt.en[t]||"";for(const n of Object.keys(e))i=i.replace(new RegExp(`{${n}}`,"g"),String(e[n]));return i}async function an(t,e){if(!t)return;let r=t;try{/^https?:\/\//.test(t)||(r=new URL(t,location.origin+e).toString());const i=await fetch(r);if(!i.ok)return;const n=await i.json();for(const s of Object.keys(n||{}))rt[s]=Object.assign({},rt[s]||{},n[s])}catch{}}function ln(t){const e=String(t).split("-")[0].toLowerCase();Fe=rt[e]?e:"en"}const _s=Object.freeze(Object.defineProperty({__proto__:null,get currentLang(){return Fe},loadL10nFile:an,setLang:ln,t:st},Symbol.toStringTag,{value:"Module"})),Ms=`import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
`;function Xn(t,e="worker"){let r=null;function i(){if(!r)try{const u=t();r=u||null,u&&u.addEventListener("error",()=>{try{r===u&&(r=null,u.terminate&&u.terminate())}catch(l){console.warn("["+e+"] worker termination failed",l)}})}catch(u){r=null,console.warn("["+e+"] worker init failed",u)}return r}function n(){try{r&&(r.terminate&&r.terminate(),r=null)}catch(u){console.warn("["+e+"] worker termination failed",u)}}function s(u,l=1e3){return new Promise((o,c)=>{const h=i();if(!h)return c(new Error("worker unavailable"));const f=String(Math.random());u.id=f;let g=null;const d=()=>{g&&clearTimeout(g),h.removeEventListener("message",m),h.removeEventListener("error",w)},m=k=>{const v=k.data||{};v.id===f&&(d(),v.error?c(new Error(v.error)):o(v.result))},w=k=>{d(),console.warn("["+e+"] worker error event",k);try{r===h&&(r=null,h.terminate&&h.terminate())}catch(v){console.warn("["+e+"] worker termination failed",v)}c(new Error(k&&k.message||"worker error"))};g=setTimeout(()=>{d(),console.warn("["+e+"] worker timed out");try{r===h&&(r=null,h.terminate&&h.terminate())}catch(k){console.warn("["+e+"] worker termination on timeout failed",k)}c(new Error("worker timeout"))},l),h.addEventListener("message",m),h.addEventListener("error",w);try{h.postMessage(u)}catch(k){d(),c(k)}})}return{get:i,send:s,terminate:n}}function $s(t){try{if(typeof Blob<"u"&&typeof URL<"u"&&t){const e=new Blob([t],{type:"application/javascript"}),r=URL.createObjectURL(e);return new Worker(r,{type:"module"})}}catch(e){console.warn("[worker-manager] createWorkerFromRaw failed",e)}return null}const ze=new Set;function on(t){Ps(),ze.clear();for(const e of Te)e&&ze.add(e);Yn(Q),Yn(j),on._refreshed=!0}function Yn(t){if(!(!t||typeof t.values!="function"))for(const e of t.values())e&&ze.add(e)}function Kn(t){if(!t||typeof t.set!="function")return;const e=t.set;t.set=function(r,i){return i&&ze.add(i),e.call(this,r,i)}}let Vn=!1;function Ps(){Vn||(Kn(Q),Kn(j),Vn=!0)}function Jn(t){return!t||typeof t!="string"?!1:/^(https?:)?\/\//.test(t)||t.startsWith("mailto:")||t.startsWith("tel:")}function ue(t){return String(t||"").replace(/^[.\/]+/,"")}function ut(t){return String(t||"").replace(/\/+$/,"")}function ht(t){return ut(t)+"/"}function Is(t){try{if(!t||typeof document>"u"||!document.head||t.startsWith("data:")||document.head.querySelector(`link[rel="preload"][as="image"][href="${t}"]`))return;const r=document.createElement("link");r.rel="preload",r.as="image",r.href=t,document.head.appendChild(r)}catch(e){console.warn("[helpers] preloadImage failed",e)}}function _t(t,e=0,r=!1){try{if(typeof window>"u"||!t||!t.querySelectorAll)return;const i=Array.from(t.querySelectorAll("img"));if(!i.length)return;const n=t,s=n&&n.getBoundingClientRect?n.getBoundingClientRect():null,a=0,u=typeof window<"u"&&(window.innerHeight||document.documentElement.clientHeight)||0,l=s?Math.max(a,s.top):a,c=(s?Math.min(u,s.bottom):u)+Number(e||0);let h=0;n&&(h=n.clientHeight||(s?s.height:0)),h||(h=u-a);let f=.6;try{const w=n&&window.getComputedStyle?window.getComputedStyle(n):null,k=w&&w.getPropertyValue("--nimbi-image-max-height-ratio"),v=k?parseFloat(k):NaN;!Number.isNaN(v)&&v>0&&v<=1&&(f=v)}catch(w){console.warn("[helpers] read CSS ratio failed",w)}const g=Math.max(200,Math.floor(h*f));let d=!1,m=null;if(i.forEach(w=>{try{const k=w.getAttribute?w.getAttribute("loading"):void 0;k!=="eager"&&w.setAttribute&&w.setAttribute("loading","lazy");const v=w.getBoundingClientRect?w.getBoundingClientRect():null,N=w.src||w.getAttribute&&w.getAttribute("src"),E=v&&v.height>1?v.height:g,U=v?v.top:0,P=U+E,X=!!(v&&E>0&&U<=c&&P>=l);X&&(w.setAttribute?(w.setAttribute("loading","eager"),w.setAttribute("fetchpriority","high"),w.setAttribute("data-eager-by-nimbi","1")):(w.loading="eager",w.fetchPriority="high"),Is(N),d=!0),!m&&v&&v.top<=c&&(m={img:w,src:N,rect:v,beforeLoading:k}),r&&console.log("[helpers] setEagerForAboveFoldImages:",{src:N,rect:v,marginPx:e,visibleTop:l,visibleBottom:c,beforeLoading:k,isAboveFold:X,effectiveHeight:E,maxImageHeight:g})}catch(k){console.warn("[helpers] setEagerForAboveFoldImages per-image failed",k)}}),!d&&m){const{img:w,src:k,rect:v,beforeLoading:N}=m;try{w.setAttribute?(w.setAttribute("loading","eager"),w.setAttribute("fetchpriority","high"),w.setAttribute("data-eager-by-nimbi","1")):(w.loading="eager",w.fetchPriority="high"),r&&console.log("[helpers] setEagerForAboveFoldImages (fallback first visible):",{src:k,rect:v,marginPx:e,visibleTop:l,visibleBottom:c,beforeLoading:N,fallback:!0})}catch(E){console.warn("[helpers] setEagerForAboveFoldImages fallback failed",E)}}}catch(i){console.warn("[helpers] setEagerForAboveFoldImages failed",i)}}function Mt(t){try{const e=t();return e&&typeof e.then=="function"?e.catch(r=>{console.warn("[helpers] safe swallowed error",r)}):e}catch(e){console.warn("[helpers] safe swallowed error",e)}}try{typeof globalThis<"u"&&!globalThis.safe&&(globalThis.safe=Mt)}catch(t){console.warn("[helpers] global attach failed",t)}const Q=new Map;let Re=[];function er(t){Re=Array.isArray(t)?t.slice():[]}function zs(){return Re}const tr=Xn(()=>$s(Ms),"slugManager");function cn(){return tr.get()}function nr(t){return tr.send(t)}async function Bs(t,e=1,r=void 0){if(!cn())return Bt(t,e,r);try{return await nr({type:"buildSearchIndex",contentBase:t,indexDepth:e,noIndexing:r})}catch(n){try{return await Bt(t,e,r)}catch(s){throw console.warn("[slugManager] buildSearchIndex fallback failed",s),n}}}async function Os(t,e,r){return cn()?nr({type:"crawlForSlug",slug:t,base:e,maxQueue:r}):pn(t,e,r)}function We(t,e){if(t)if(Re&&Re.length){const i=e.split("/")[0],n=Re.includes(i);let s=Q.get(t);(!s||typeof s=="string")&&(s={default:typeof s=="string"?s:void 0,langs:{}}),n?s.langs[i]=e:s.default=e,Q.set(t,s)}else Q.set(t,e)}const $t=new Set;function Ns(t){typeof t=="function"&&$t.add(t)}function Ds(t){typeof t=="function"&&$t.delete(t)}const j=new Map;let un={},Te=[],it="_404.md",at="_home.md";function hn(t){t!=null&&(it=String(t||""))}function dn(t){t!=null&&(at=String(t||""))}function Us(t){un=t||{}}const dt=new Map,Pt=new Set;function Hs(){dt.clear(),Pt.clear()}function qs(t){if(!t||t.length===0)return"";let e=t[0];for(let i=1;i<t.length;i++){const n=t[i];let s=0;const a=Math.min(e.length,n.length);for(;s<a&&e[s]===n[s];)s++;e=e.slice(0,s)}const r=e.lastIndexOf("/");return r===-1?e:e.slice(0,r+1)}function It(t){Q.clear(),j.clear(),Te=[],Re=Re||[];const e=Object.keys(un||{});if(!e.length)return;let r="";try{if(t){try{/^[a-z][a-z0-9+.-]*:/i.test(String(t))?r=new URL(String(t)).pathname:r=String(t||"")}catch(i){r=String(t||""),console.warn("[slugManager] parse contentBase failed",i)}r=ht(r)}}catch(i){r="",console.warn("[slugManager] setContentBase prefix derivation failed",i)}r||(r=qs(e));for(const i of e){let n=i;r&&i.startsWith(r)?n=ue(i.slice(r.length)):n=ue(i),Te.push(n);try{on()}catch(a){console.warn("[slugManager] refreshIndexPaths failed",a)}const s=un[i];if(typeof s=="string"){const a=(s||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const u=ie(a[1].trim());if(u)try{if(Re&&Re.length){const o=n.split("/")[0],c=Re.includes(o);let h=Q.get(u);(!h||typeof h=="string")&&(h={default:typeof h=="string"?h:void 0,langs:{}}),c?h.langs[o]=n:h.default=n,Q.set(u,h)}else Q.set(u,n);j.set(n,u)}catch(l){console.warn("[slugManager] set slug mapping failed",l)}}}}}try{It()}catch(t){console.warn("[slugManager] initial setContentBase failed",t)}function ie(t){let e=String(t||"").toLowerCase().replace(/[^a-z0-9\- ]/g,"").replace(/ /g,"-");return e=e.replace(/(?:-?)(?:md|html)$/,""),e}function pt(t){if(!t||!Q.has(t))return null;const e=Q.get(t);if(!e)return null;if(typeof e=="string")return e;if(Re&&Re.length&&Fe&&e.langs&&e.langs[Fe])return e.langs[Fe];if(e.default)return e.default;if(e.langs){const r=Object.keys(e.langs);if(r.length)return e.langs[r[0]]}return null}const ft=new Map;function js(){ft.clear()}let be=async function(t,e){if(!t)throw new Error("path required");try{const s=(String(t||"").match(/([^\/]+)\.md(?:$|[?#])/)||[])[1];if(s&&Q.has(s)){const a=pt(s)||Q.get(s);a&&a!==t&&(t=a)}}catch(s){console.warn("[slugManager] slug mapping normalization failed",s)}const r=e==null?"":ut(String(e));let i="";try{r?/^[a-z][a-z0-9+.-]*:/i.test(r)?i=r.replace(/\/$/,"")+"/"+t.replace(/^\//,""):i=(r.startsWith("/")?"":"/")+r.replace(/\/$/,"")+"/"+t.replace(/^\//,""):i="/"+t.replace(/^\//,"")}catch{i="/"+t.replace(/^\//,"")}if(ft.has(i))return ft.get(i);const n=(async()=>{const s=await fetch(i);if(!s||typeof s.ok!="boolean"||!s.ok){if(s&&s.status===404)try{const h=`${r}/${it}`,f=await globalThis.fetch(h);if(f&&typeof f.ok=="boolean"&&f.ok)return{raw:await f.text(),status:404}}catch(h){console.warn("[slugManager] fetching fallback 404 failed",h)}let c="";try{s&&typeof s.clone=="function"?c=await s.clone().text():s&&typeof s.text=="function"?c=await s.text():c=""}catch(h){c="",console.warn("[slugManager] reading error body failed",h)}throw console.error("fetchMarkdown failed:",{url:i,status:s?s.status:void 0,statusText:s?s.statusText:void 0,body:c.slice(0,200)}),new Error("failed to fetch md")}const a=await s.text(),u=a.trim().slice(0,16).toLowerCase(),l=u.startsWith("<!doctype")||u.startsWith("<html"),o=l||String(t||"").toLowerCase().endsWith(".html");if(l&&String(t||"").toLowerCase().endsWith(".md")){try{const c=`${r}/${it}`,h=await globalThis.fetch(c);if(h.ok)return{raw:await h.text(),status:404}}catch(c){console.warn("[slugManager] fetching fallback 404 failed",c)}throw console.error("fetchMarkdown: server returned HTML for .md request",i),new Error("failed to fetch md")}return o?{raw:a,isHtml:!0}:{raw:a}})();return ft.set(i,n),n};function Fs(t){typeof t=="function"&&(be=t)}const zt=new Map;let Ze=[],gt=null;async function Bt(t,e=1,r=void 0){const i=Array.isArray(r)?Array.from(new Set((r||[]).map(n=>ue(String(n||""))))):[];try{const n=ue(String(it||""));n&&!i.includes(n)&&i.push(n)}catch{}if(Ze&&Ze.length&&e===1&&!Ze.some(s=>{try{return i.includes(ue(String(s.path||"")))}catch{return!1}}))return Ze;if(gt)return gt;gt=(async()=>{let n=Array.isArray(r)?Array.from(new Set((r||[]).map(o=>ue(String(o||""))))):[];try{const o=ue(String(it||""));o&&!n.includes(o)&&n.push(o)}catch{}const s=o=>{if(!n||!n.length)return!1;for(const c of n)if(c&&(o===c||o.startsWith(c+"/")))return!0;return!1};let a=[];if(Te&&Te.length&&(a=Array.from(Te)),!a.length)for(const o of Q.values())o&&a.push(o);try{const o=await ar(t);o&&o.length&&(a=a.concat(o))}catch(o){console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed",o)}try{const o=new Set(a),c=[...a];for(o.size;c.length&&o.size<=mt;){const h=c.shift();try{const f=await be(h,t);if(f&&f.raw){if(f.status===404)continue;let g=f.raw;const d=[],m=String(h||"").replace(/^.*\//,"");if(/^readme(?:\.md)?$/i.test(m))continue;const w=/\[[^\]]+\]\(([^)]+)\)/g;let k;for(;k=w.exec(g);)d.push(k[1]);const v=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;k=v.exec(g);)d.push(k[1]);const N=h&&h.includes("/")?h.substring(0,h.lastIndexOf("/")+1):"";for(let E of d)try{if(/^[a-z][a-z0-9+.-]*:/i.test(E)||E.startsWith("/")||E.startsWith("..")||E.indexOf("/../")!==-1||(N&&!E.startsWith("./")&&!E.startsWith("/")&&!E.startsWith("../")&&(E=N+E),E=ue(E),!/\.(md|html?)(?:$|[?#])/i.test(E))||(E=E.split(/[?#]/)[0],s(E)))continue;o.has(E)||(o.add(E),c.push(E),a.push(E))}catch(U){console.warn("[slugManager] href processing failed",E,U)}}}catch(f){console.warn("[slugManager] discovery fetch failed for",h,f)}}}catch(o){console.warn("[slugManager] discovery loop failed",o)}const u=new Set;a=a.filter(o=>!o||u.has(o)||s(o)?!1:(u.add(o),!0));const l=[];for(const o of a)if(/\.(?:md|html?)(?:$|[?#])/i.test(o))try{const c=await be(o,t);if(c&&c.raw){if(c.status===404)continue;let h="",f="";if(c.isHtml)try{const m=new DOMParser().parseFromString(c.raw,"text/html"),w=m.querySelector("title")||m.querySelector("h1");w&&w.textContent&&(h=w.textContent.trim());const k=m.querySelector("p");if(k&&k.textContent&&(f=k.textContent.trim()),e===2)try{const v=m.querySelector("h1"),N=v&&v.textContent?v.textContent.trim():h||"",E=(()=>{try{if(j.has(o))return j.get(o)}catch{}return ie(h||o)})(),U=Array.from(m.querySelectorAll("h2"));for(const P of U)try{const X=(P.textContent||"").trim();if(!X)continue;const ee=P.id?P.id:ie(X),te=E?`${E}::${ee}`:`${ie(o)}::${ee}`;let se="",I=P.nextElementSibling;for(;I&&I.tagName&&I.tagName.toLowerCase()==="script";)I=I.nextElementSibling;I&&I.textContent&&(se=String(I.textContent).trim()),l.push({slug:te,title:X,excerpt:se,path:o,parentTitle:N})}catch(X){console.warn("[slugManager] indexing H2 failed",X)}}catch(v){console.warn("[slugManager] collect H2s failed",v)}}catch(d){console.warn("[slugManager] parsing HTML for index failed",d)}else{const d=c.raw,m=d.match(/^#\s+(.+)$/m);h=m?m[1].trim():"";const w=d.split(/\r?\n\s*\r?\n/);if(w.length>1)for(let k=1;k<w.length;k++){const v=w[k].trim();if(v&&!/^#/.test(v)){f=v.replace(/\r?\n/g," ");break}}if(e===2)try{const k=(d.match(/^#\s+(.+)$/m)||[])[1],v=k?k.trim():"",N=(function(){try{if(j.has(o))return j.get(o)}catch{}return ie(h||o)})(),E=/^##\s+(.+)$/gm;let U;for(;U=E.exec(d);)try{const P=(U[1]||"").trim();if(!P)continue;const X=ie(P),ee=N?`${N}::${X}`:`${ie(o)}::${X}`,se=d.slice(E.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),I=se&&se[1]?String(se[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";l.push({slug:ee,title:P,excerpt:I,path:o,parentTitle:v})}catch(P){console.warn("[slugManager] indexing markdown H2 failed",P)}}catch(k){console.warn("[slugManager] collect markdown H2s failed",k)}}let g="";try{j.has(o)&&(g=j.get(o))}catch(d){console.warn("[slugManager] mdToSlug access failed",d)}g||(g=ie(h||o)),l.push({slug:g,title:h,excerpt:f,path:o})}}catch(c){console.warn("[slugManager] buildSearchIndex: entry fetch failed",c)}return Ze=l,Ze})();try{await gt}catch(n){console.warn("[slugManager] awaiting _indexPromise failed",n)}return gt=null,Ze}const rr=1e3;let mt=rr;function Ws(t){typeof t=="number"&&t>=0&&(mt=t)}const sr=new DOMParser,ir="a[href]";let pn=async function(t,e,r=mt){if(zt.has(t))return zt.get(t);let i=null;const n=new Set,s=[""];for(;s.length&&!i&&!(s.length>r);){const a=s.shift();if(n.has(a))continue;n.add(a);let u=e;u.endsWith("/")||(u+="/"),u+=a;try{const l=await globalThis.fetch(u);if(!l.ok)continue;const o=await l.text(),h=sr.parseFromString(o,"text/html").querySelectorAll(ir);for(const f of h)try{let g=f.getAttribute("href")||"";if(!g||/^[a-z][a-z0-9+.-]*:/i.test(g)||g.startsWith("/")||g.startsWith("..")||g.indexOf("/../")!==-1)continue;if(g.endsWith("/")){const d=a+g;n.has(d)||s.push(d);continue}if(g.toLowerCase().endsWith(".md")){const d=ue(a+g);try{if(j.has(d))continue;for(const m of Q.values());}catch(m){console.warn("[slugManager] slug map access failed",m)}try{const m=await be(d,e);if(m&&m.raw){const w=(m.raw||"").match(/^#\s+(.+)$/m);if(w&&w[1]&&ie(w[1].trim())===t){i=d;break}}}catch(m){console.warn("[slugManager] crawlForSlug: fetchMarkdown failed",m)}}}catch(g){console.warn("[slugManager] crawlForSlug: link iteration failed",g)}}catch(l){console.warn("[slugManager] crawlForSlug: directory fetch failed",l)}}return zt.set(t,i),i};async function ar(t,e=mt){const r=new Set,i=new Set,n=[""];for(;n.length&&!(n.length>e);){const s=n.shift();if(i.has(s))continue;i.add(s);let a=t;a.endsWith("/")||(a+="/"),a+=s;try{const u=await globalThis.fetch(a);if(!u.ok)continue;const l=await u.text(),c=sr.parseFromString(l,"text/html").querySelectorAll(ir);for(const h of c)try{let f=h.getAttribute("href")||"";if(!f||/^[a-z][a-z0-9+.-]*:/i.test(f)||f.startsWith("/")||f.startsWith("..")||f.indexOf("/../")!==-1)continue;if(f.endsWith("/")){const d=s+f;i.has(d)||n.push(d);continue}const g=(s+f).replace(/^\/+/,"");/\.(md|html?)$/i.test(g)&&r.add(g)}catch(f){console.warn("[slugManager] crawlAllMarkdown: link iteration failed",f)}}catch(u){console.warn("[slugManager] crawlAllMarkdown: directory fetch failed",u)}}return Array.from(r)}async function lr(t,e,r){if(t&&typeof t=="string"&&(t=ue(t),t=ut(t)),Q.has(t))return pt(t)||Q.get(t);for(const n of $t)try{const s=await n(t,e);if(s)return We(t,s),j.set(s,t),s}catch(s){console.warn("[slugManager] slug resolver failed",s)}if(Te&&Te.length){if(dt.has(t)){const n=dt.get(t);return Q.set(t,n),j.set(n,t),n}for(const n of Te)if(!Pt.has(n))try{const s=await be(n,e);if(s&&s.raw){const a=(s.raw||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const u=ie(a[1].trim());if(Pt.add(n),u&&dt.set(u,n),u===t)return We(t,n),j.set(n,t),n}}}catch(s){console.warn("[slugManager] manifest title fetch failed",s)}}try{const n=await Bt(e);if(n&&n.length){const s=n.find(a=>a.slug===t);if(s)return We(t,s.path),j.set(s.path,t),s.path}}catch(n){console.warn("[slugManager] buildSearchIndex lookup failed",n)}try{const n=await pn(t,e,r);if(n)return We(t,n),j.set(n,t),n}catch(n){console.warn("[slugManager] crawlForSlug lookup failed",n)}const i=[`${t}.html`,`${t}.md`];for(const n of i)try{const s=await be(n,e);if(s&&s.raw)return We(t,n),j.set(n,t),n}catch(s){console.warn("[slugManager] candidate fetch failed",s)}if(Te&&Te.length)for(const n of Te)try{const s=n.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(ie(s)===t)return We(t,n),j.set(n,t),n}catch(s){console.warn("[slugManager] build-time filename match failed",s)}try{const n=[];at&&typeof at=="string"&&at.trim()&&n.push(at),n.includes("_home.md")||n.push("_home.md");for(const s of n)try{const a=await be(s,e);if(a&&a.raw){const u=(a.raw||"").match(/^#\s+(.+)$/m);if(u&&u[1]&&ie(u[1].trim())===t)return We(t,s),j.set(s,t),s}}catch{}}catch(n){console.warn("[slugManager] home page fetch failed",n)}return null}const Ot=Object.freeze(Object.defineProperty({__proto__:null,CRAWL_MAX_QUEUE:rr,_setAllMd:Us,_storeSlugMapping:We,addSlugResolver:Ns,get allMarkdownPaths(){return Te},get availableLanguages(){return Re},buildSearchIndex:Bt,buildSearchIndexWorker:Bs,clearFetchCache:js,clearListCaches:Hs,crawlAllMarkdown:ar,crawlCache:zt,crawlForSlug:pn,crawlForSlugWorker:Os,get defaultCrawlMaxQueue(){return mt},ensureSlug:lr,fetchCache:ft,get fetchMarkdown(){return be},getLanguages:zs,get homePage(){return at},initSlugWorker:cn,listPathsFetched:Pt,listSlugCache:dt,mdToSlug:j,get notFoundPage(){return it},removeSlugResolver:Ds,resolveSlugPath:pt,get searchIndex(){return Ze},setContentBase:It,setDefaultCrawlMaxQueue:Ws,setFetchMarkdown:Fs,setHomePage:dn,setLanguages:er,setNotFoundPage:hn,slugResolvers:$t,slugToMd:Q,slugify:ie},Symbol.toStringTag,{value:"Module"}));let or=100;function cr(t){or=t}let wt=300*1e3;function ur(t){wt=t}const Me=new Map;function Zs(t){if(!Me.has(t))return;const e=Me.get(t),r=Date.now();if(e.ts+wt<r){Me.delete(t);return}return Me.delete(t),Me.set(t,e),e.value}function Qs(t,e){if(hr(),hr(),Me.delete(t),Me.set(t,{value:e,ts:Date.now()}),Me.size>or){const r=Me.keys().next().value;r!==void 0&&Me.delete(r)}}function hr(){if(!wt||wt<=0)return;const t=Date.now();for(const[e,r]of Me.entries())r.ts+wt<t&&Me.delete(e)}async function Gs(t,e){const r=new Set(ze),i=document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");for(const n of Array.from(i||[])){const s=n.getAttribute("href")||"";if(s)try{const a=new URL(s,location.href);if(a.origin!==location.origin)continue;const u=(a.hash||a.pathname).match(/([^#?]+\.md)(?:$|[?#])/)||(a.pathname||"").match(/([^#?]+\.md)(?:$|[?#])/);if(u){let o=ue(u[1]);o&&r.add(o);continue}const l=a.pathname||"";if(l){const o=new URL(e),c=ht(o.pathname);if(l.indexOf(c)!==-1){let h=l.startsWith(c)?l.slice(c.length):l;h=ue(h),h&&r.add(h)}}}catch(a){console.warn("[router] malformed URL while discovering index candidates",a)}}for(const n of r)try{if(!n||!String(n).includes(".md"))continue;const s=await be(n,e);if(!s||!s.raw)continue;const a=(s.raw||"").match(/^#\s+(.+)$/m);if(a){const u=(a[1]||"").trim();if(u&&ie(u)===t)return n}}catch(s){console.warn("[router] fetchMarkdown during index discovery failed",s)}return null}function Xs(t){const e=[];if(String(t).includes(".md")||String(t).includes(".html"))/index\.html$/i.test(t)||e.push(t);else try{const r=decodeURIComponent(String(t||""));if(Q.has(r)){const i=pt(r)||Q.get(r);i&&(/\.(md|html?)$/i.test(i)?/index\.html$/i.test(i)||e.push(i):(e.push(i),e.push(i+".html")))}else{if(ze&&ze.size)for(const i of ze){const n=i.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(ie(n)===r&&!/index\.html$/i.test(i)){e.push(i);break}}!e.length&&r&&!/\.(md|html?)$/i.test(r)&&(e.push(r+".html"),e.push(r+".md"))}}catch(r){console.warn("[router] buildPageCandidates failed during slug handling",r)}return e}async function Ys(t,e){const r=t||"",i=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;let n=t||"",s=null;if(n&&String(n).includes("::")){const d=String(n).split("::",2);n=d[0],s=d[1]||null}const u=`${t}|||${typeof _s<"u"&&Fe?Fe:""}`,l=Zs(u);if(l)n=l.resolved,s=l.anchor||s;else{if(!String(n).includes(".md")&&!String(n).includes(".html")){let d=decodeURIComponent(String(n||""));if(d&&typeof d=="string"&&(d=ue(d),d=ut(d)),Q.has(d))n=pt(d)||Q.get(d);else{let m=await Gs(d,e);if(m)n=m;else if(on._refreshed&&ze&&ze.size||typeof e=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(e)){const w=await lr(d,e);w&&(n=w)}}}Qs(u,{resolved:n,anchor:s})}!s&&i&&(s=i);const o=Xs(n),c=String(r||"").includes(".md")||String(r||"").includes(".html");if(c&&o.length===0&&(String(n).includes(".md")||String(n).includes(".html"))&&o.push(n),o.length===0&&(String(n).includes(".md")||String(n).includes(".html"))&&o.push(n),o.length===1&&/index\.html$/i.test(o[0])&&!c&&!Q.has(n)&&!Q.has(decodeURIComponent(String(n||"")))&&!String(n||"").includes("/"))throw new Error("Unknown slug: index.html fallback prevented");let h=null,f=null,g=null;for(const d of o)if(d)try{const m=ue(d);h=await be(m,e),f=m;break}catch(m){g=m;try{console.warn("[router] candidate fetch failed",{candidate:d,contentBase:e,err:m&&m.message||m})}catch{}}if(!h){try{console.error("[router] fetchPageData: no page data for",{originalRaw:r,resolved:n,pageCandidates:o,contentBase:e,fetchError:g&&(g.message||String(g))||null})}catch{}try{if(c&&String(r||"").toLowerCase().includes(".html"))try{const d=new URL(String(r||""),location.href).toString();console.warn("[router] attempting absolute HTML fetch fallback",d);const m=await fetch(d);if(m&&m.ok){const w=await m.text(),k=m&&m.headers&&typeof m.headers.get=="function"&&m.headers.get("content-type")||"",v=(w||"").toLowerCase(),N=k&&k.indexOf&&k.indexOf("text/html")!==-1||v.indexOf("<!doctype")!==-1||v.indexOf("<html")!==-1;if(N||console.warn("[router] absolute fetch returned non-HTML",{abs:d,contentType:k,snippet:v.slice(0,200)}),N)try{const E=d,U=new URL(".",E).toString();try{const X=typeof DOMParser<"u"?new DOMParser:null;if(X){const ee=X.parseFromString(w||"","text/html"),te=(M,C)=>{try{const x=C.getAttribute(M)||"";if(!x||/^(https?:)?\/\//i.test(x)||x.startsWith("/")||x.startsWith("#"))return;try{const b=new URL(x,E).toString();C.setAttribute(M,b)}catch{}}catch{}},se=ee.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"),I=[];for(const M of Array.from(se||[]))try{const C=M.tagName?M.tagName.toLowerCase():"";if(C==="a")continue;if(M.hasAttribute("src")){const x=M.getAttribute("src");te("src",M);const b=M.getAttribute("src");x!==b&&I.push({attr:"src",tag:C,before:x,after:b})}if(M.hasAttribute("href")&&C==="link"){const x=M.getAttribute("href");te("href",M);const b=M.getAttribute("href");x!==b&&I.push({attr:"href",tag:C,before:x,after:b})}if(M.hasAttribute("href")&&C!=="link"){const x=M.getAttribute("href");te("href",M);const b=M.getAttribute("href");x!==b&&I.push({attr:"href",tag:C,before:x,after:b})}if(M.hasAttribute("xlink:href")){const x=M.getAttribute("xlink:href");te("xlink:href",M);const b=M.getAttribute("xlink:href");x!==b&&I.push({attr:"xlink:href",tag:C,before:x,after:b})}if(M.hasAttribute("poster")){const x=M.getAttribute("poster");te("poster",M);const b=M.getAttribute("poster");x!==b&&I.push({attr:"poster",tag:C,before:x,after:b})}if(M.hasAttribute("srcset")){const R=(M.getAttribute("srcset")||"").split(",").map(y=>y.trim()).filter(Boolean).map(y=>{const[z,G]=y.split(/\s+/,2);if(!z||/^(https?:)?\/\//i.test(z)||z.startsWith("/"))return y;try{const ne=new URL(z,E).toString();return G?`${ne} ${G}`:ne}catch{return y}}).join(", ");M.setAttribute("srcset",R)}}catch{}const _=ee.documentElement&&ee.documentElement.outerHTML?ee.documentElement.outerHTML:w;try{I&&I.length&&console.warn("[router] rewritten asset refs",{abs:d,rewritten:I})}catch{}return{data:{raw:_,isHtml:!0},pagePath:String(r||""),anchor:s}}}catch{}let P=w;return/<base\s+[^>]*>/i.test(w)||(/<head[^>]*>/i.test(w)?P=w.replace(/(<head[^>]*>)/i,`$1<base href="${U}">`):P=`<base href="${U}">`+w),{data:{raw:P,isHtml:!0},pagePath:String(r||""),anchor:s}}catch{return{data:{raw:w,isHtml:!0},pagePath:String(r||""),anchor:s}}}}catch(d){console.warn("[router] absolute HTML fetch fallback failed",d)}}catch{}throw new Error("no page data")}return{data:h,pagePath:f,anchor:s}}function fn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Ke=fn();function dr(t){Ke=t}var Ve={exec:()=>null};function V(t,e=""){let r=typeof t=="string"?t:t.source,i={replace:(n,s)=>{let a=typeof s=="string"?s:s.source;return a=a.replace(ve.caret,"$1"),r=r.replace(n,a),i},getRegex:()=>new RegExp(r,e)};return i}var Ks=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),ve={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}>`)},Vs=/^(?:[ \t]*(?:\n|$))+/,Js=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,ei=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,bt=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,ti=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,gn=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,pr=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,fr=V(pr).replace(/bull/g,gn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),ni=V(pr).replace(/bull/g,gn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),mn=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,ri=/^[^\n]+/,wn=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,si=V(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",wn).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),ii=V(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,gn).getRegex(),Nt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",bn=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,ai=V("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",bn).replace("tag",Nt).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),gr=V(mn).replace("hr",bt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Nt).getRegex(),li=V(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",gr).getRegex(),yn={blockquote:li,code:Js,def:si,fences:ei,heading:ti,hr:bt,html:ai,lheading:fr,list:ii,newline:Vs,paragraph:gr,table:Ve,text:ri},mr=V("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",bt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Nt).getRegex(),oi={...yn,lheading:ni,table:mr,paragraph:V(mn).replace("hr",bt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",mr).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Nt).getRegex()},ci={...yn,html:V(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",bn).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Ve,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:V(mn).replace("hr",bt).replace("heading",` *#{1,6} *[^
]`).replace("lheading",fr).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},ui=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,hi=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,wr=/^( {2,}|\\)\n(?!\s*$)/,di=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Dt=/[\p{P}\p{S}]/u,kn=/[\s\p{P}\p{S}]/u,br=/[^\s\p{P}\p{S}]/u,pi=V(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,kn).getRegex(),yr=/(?!~)[\p{P}\p{S}]/u,fi=/(?!~)[\s\p{P}\p{S}]/u,gi=/(?:[^\s\p{P}\p{S}]|~)/u,kr=/(?![*_])[\p{P}\p{S}]/u,mi=/(?![*_])[\s\p{P}\p{S}]/u,wi=/(?:[^\s\p{P}\p{S}]|[*_])/u,bi=V(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Ks?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),xr=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,yi=V(xr,"u").replace(/punct/g,Dt).getRegex(),ki=V(xr,"u").replace(/punct/g,yr).getRegex(),Sr="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",xi=V(Sr,"gu").replace(/notPunctSpace/g,br).replace(/punctSpace/g,kn).replace(/punct/g,Dt).getRegex(),Si=V(Sr,"gu").replace(/notPunctSpace/g,gi).replace(/punctSpace/g,fi).replace(/punct/g,yr).getRegex(),vi=V("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,br).replace(/punctSpace/g,kn).replace(/punct/g,Dt).getRegex(),Ei=V(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,kr).getRegex(),Ai="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Ri=V(Ai,"gu").replace(/notPunctSpace/g,wi).replace(/punctSpace/g,mi).replace(/punct/g,kr).getRegex(),Ti=V(/\\(punct)/,"gu").replace(/punct/g,Dt).getRegex(),Ci=V(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Li=V(bn).replace("(?:-->|$)","-->").getRegex(),_i=V("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Li).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Ut=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Mi=V(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",Ut).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),vr=V(/^!?\[(label)\]\[(ref)\]/).replace("label",Ut).replace("ref",wn).getRegex(),Er=V(/^!?\[(ref)\](?:\[\])?/).replace("ref",wn).getRegex(),$i=V("reflink|nolink(?!\\()","g").replace("reflink",vr).replace("nolink",Er).getRegex(),Ar=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,xn={_backpedal:Ve,anyPunctuation:Ti,autolink:Ci,blockSkip:bi,br:wr,code:hi,del:Ve,delLDelim:Ve,delRDelim:Ve,emStrongLDelim:yi,emStrongRDelimAst:xi,emStrongRDelimUnd:vi,escape:ui,link:Mi,nolink:Er,punctuation:pi,reflink:vr,reflinkSearch:$i,tag:_i,text:di,url:Ve},Pi={...xn,link:V(/^!?\[(label)\]\((.*?)\)/).replace("label",Ut).getRegex(),reflink:V(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Ut).getRegex()},Sn={...xn,emStrongRDelimAst:Si,emStrongLDelim:ki,delLDelim:Ei,delRDelim:Ri,url:V(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Ar).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:V(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Ar).getRegex()},Ii={...Sn,br:V(wr).replace("{2,}","*").getRegex(),text:V(Sn.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Ht={normal:yn,gfm:oi,pedantic:ci},yt={normal:xn,gfm:Sn,breaks:Ii,pedantic:Pi},zi={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Rr=t=>zi[t];function Be(t,e){if(e){if(ve.escapeTest.test(t))return t.replace(ve.escapeReplace,Rr)}else if(ve.escapeTestNoEncode.test(t))return t.replace(ve.escapeReplaceNoEncode,Rr);return t}function Tr(t){try{t=encodeURI(t).replace(ve.percentDecode,"%")}catch{return null}return t}function Cr(t,e){let r=t.replace(ve.findPipe,(s,a,u)=>{let l=!1,o=a;for(;--o>=0&&u[o]==="\\";)l=!l;return l?"|":" |"}),i=r.split(ve.splitPipe),n=0;if(i[0].trim()||i.shift(),i.length>0&&!i.at(-1)?.trim()&&i.pop(),e)if(i.length>e)i.splice(e);else for(;i.length<e;)i.push("");for(;n<i.length;n++)i[n]=i[n].trim().replace(ve.slashPipe,"|");return i}function kt(t,e,r){let i=t.length;if(i===0)return"";let n=0;for(;n<i&&t.charAt(i-n-1)===e;)n++;return t.slice(0,i-n)}function Bi(t,e){if(t.indexOf(e[1])===-1)return-1;let r=0;for(let i=0;i<t.length;i++)if(t[i]==="\\")i++;else if(t[i]===e[0])r++;else if(t[i]===e[1]&&(r--,r<0))return i;return r>0?-2:-1}function Oi(t,e=0){let r=e,i="";for(let n of t)if(n==="	"){let s=4-r%4;i+=" ".repeat(s),r+=s}else i+=n,r++;return i}function Lr(t,e,r,i,n){let s=e.href,a=e.title||null,u=t[1].replace(n.other.outputLinkReplace,"$1");i.state.inLink=!0;let l={type:t[0].charAt(0)==="!"?"image":"link",raw:r,href:s,title:a,text:u,tokens:i.inlineTokens(u)};return i.state.inLink=!1,l}function Ni(t,e,r){let i=t.match(r.other.indentCodeCompensation);if(i===null)return e;let n=i[1];return e.split(`
`).map(s=>{let a=s.match(r.other.beginningSpace);if(a===null)return s;let[u]=a;return u.length>=n.length?s.slice(n.length):s}).join(`
`)}var qt=class{options;rules;lexer;constructor(t){this.options=t||Ke}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let r=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?r:kt(r,`
`)}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let r=e[0],i=Ni(r,e[3]||"",this.rules);return{type:"code",raw:r,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:i}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let r=e[2].trim();if(this.rules.other.endingHash.test(r)){let i=kt(r,"#");(this.options.pedantic||!i||this.rules.other.endingSpaceChar.test(i))&&(r=i.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:r,tokens:this.lexer.inline(r)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:kt(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let r=kt(e[0],`
`).split(`
`),i="",n="",s=[];for(;r.length>0;){let a=!1,u=[],l;for(l=0;l<r.length;l++)if(this.rules.other.blockquoteStart.test(r[l]))u.push(r[l]),a=!0;else if(!a)u.push(r[l]);else break;r=r.slice(l);let o=u.join(`
`),c=o.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");i=i?`${i}
${o}`:o,n=n?`${n}
${c}`:c;let h=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(c,s,!0),this.lexer.state.top=h,r.length===0)break;let f=s.at(-1);if(f?.type==="code")break;if(f?.type==="blockquote"){let g=f,d=g.raw+`
`+r.join(`
`),m=this.blockquote(d);s[s.length-1]=m,i=i.substring(0,i.length-g.raw.length)+m.raw,n=n.substring(0,n.length-g.text.length)+m.text;break}else if(f?.type==="list"){let g=f,d=g.raw+`
`+r.join(`
`),m=this.list(d);s[s.length-1]=m,i=i.substring(0,i.length-f.raw.length)+m.raw,n=n.substring(0,n.length-g.raw.length)+m.raw,r=d.substring(s.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:i,tokens:s,text:n}}}list(t){let e=this.rules.block.list.exec(t);if(e){let r=e[1].trim(),i=r.length>1,n={type:"list",raw:"",ordered:i,start:i?+r.slice(0,-1):"",loose:!1,items:[]};r=i?`\\d{1,9}\\${r.slice(-1)}`:`\\${r}`,this.options.pedantic&&(r=i?r:"[*+-]");let s=this.rules.other.listItemRegex(r),a=!1;for(;t;){let l=!1,o="",c="";if(!(e=s.exec(t))||this.rules.block.hr.test(t))break;o=e[0],t=t.substring(o.length);let h=Oi(e[2].split(`
`,1)[0],e[1].length),f=t.split(`
`,1)[0],g=!h.trim(),d=0;if(this.options.pedantic?(d=2,c=h.trimStart()):g?d=e[1].length+1:(d=h.search(this.rules.other.nonSpaceChar),d=d>4?1:d,c=h.slice(d),d+=e[1].length),g&&this.rules.other.blankLine.test(f)&&(o+=f+`
`,t=t.substring(f.length+1),l=!0),!l){let m=this.rules.other.nextBulletRegex(d),w=this.rules.other.hrRegex(d),k=this.rules.other.fencesBeginRegex(d),v=this.rules.other.headingBeginRegex(d),N=this.rules.other.htmlBeginRegex(d),E=this.rules.other.blockquoteBeginRegex(d);for(;t;){let U=t.split(`
`,1)[0],P;if(f=U,this.options.pedantic?(f=f.replace(this.rules.other.listReplaceNesting,"  "),P=f):P=f.replace(this.rules.other.tabCharGlobal,"    "),k.test(f)||v.test(f)||N.test(f)||E.test(f)||m.test(f)||w.test(f))break;if(P.search(this.rules.other.nonSpaceChar)>=d||!f.trim())c+=`
`+P.slice(d);else{if(g||h.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||k.test(h)||v.test(h)||w.test(h))break;c+=`
`+f}g=!f.trim(),o+=U+`
`,t=t.substring(U.length+1),h=P.slice(d)}}n.loose||(a?n.loose=!0:this.rules.other.doubleBlankLine.test(o)&&(a=!0)),n.items.push({type:"list_item",raw:o,task:!!this.options.gfm&&this.rules.other.listIsTask.test(c),loose:!1,text:c,tokens:[]}),n.raw+=o}let u=n.items.at(-1);if(u)u.raw=u.raw.trimEnd(),u.text=u.text.trimEnd();else return;n.raw=n.raw.trimEnd();for(let l of n.items){if(this.lexer.state.top=!1,l.tokens=this.lexer.blockTokens(l.text,[]),l.task){if(l.text=l.text.replace(this.rules.other.listReplaceTask,""),l.tokens[0]?.type==="text"||l.tokens[0]?.type==="paragraph"){l.tokens[0].raw=l.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),l.tokens[0].text=l.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let c=this.lexer.inlineQueue.length-1;c>=0;c--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[c].src)){this.lexer.inlineQueue[c].src=this.lexer.inlineQueue[c].src.replace(this.rules.other.listReplaceTask,"");break}}let o=this.rules.other.listTaskCheckbox.exec(l.raw);if(o){let c={type:"checkbox",raw:o[0]+" ",checked:o[0]!=="[ ]"};l.checked=c.checked,n.loose?l.tokens[0]&&["paragraph","text"].includes(l.tokens[0].type)&&"tokens"in l.tokens[0]&&l.tokens[0].tokens?(l.tokens[0].raw=c.raw+l.tokens[0].raw,l.tokens[0].text=c.raw+l.tokens[0].text,l.tokens[0].tokens.unshift(c)):l.tokens.unshift({type:"paragraph",raw:c.raw,text:c.raw,tokens:[c]}):l.tokens.unshift(c)}}if(!n.loose){let o=l.tokens.filter(h=>h.type==="space"),c=o.length>0&&o.some(h=>this.rules.other.anyLine.test(h.raw));n.loose=c}}if(n.loose)for(let l of n.items){l.loose=!0;for(let o of l.tokens)o.type==="text"&&(o.type="paragraph")}return n}}html(t){let e=this.rules.block.html.exec(t);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(t){let e=this.rules.block.def.exec(t);if(e){let r=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),i=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",n=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:r,raw:e[0],href:i,title:n}}}table(t){let e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let r=Cr(e[1]),i=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),n=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],s={type:"table",raw:e[0],header:[],align:[],rows:[]};if(r.length===i.length){for(let a of i)this.rules.other.tableAlignRight.test(a)?s.align.push("right"):this.rules.other.tableAlignCenter.test(a)?s.align.push("center"):this.rules.other.tableAlignLeft.test(a)?s.align.push("left"):s.align.push(null);for(let a=0;a<r.length;a++)s.header.push({text:r[a],tokens:this.lexer.inline(r[a]),header:!0,align:s.align[a]});for(let a of n)s.rows.push(Cr(a,s.header.length).map((u,l)=>({text:u,tokens:this.lexer.inline(u),header:!1,align:s.align[l]})));return s}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let r=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:r,tokens:this.lexer.inline(r)}}}text(t){let e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){let e=this.rules.inline.link.exec(t);if(e){let r=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(r)){if(!this.rules.other.endAngleBracket.test(r))return;let s=kt(r.slice(0,-1),"\\");if((r.length-s.length)%2===0)return}else{let s=Bi(e[2],"()");if(s===-2)return;if(s>-1){let a=(e[0].indexOf("!")===0?5:4)+e[1].length+s;e[2]=e[2].substring(0,s),e[0]=e[0].substring(0,a).trim(),e[3]=""}}let i=e[2],n="";if(this.options.pedantic){let s=this.rules.other.pedanticHrefTitle.exec(i);s&&(i=s[1],n=s[3])}else n=e[3]?e[3].slice(1,-1):"";return i=i.trim(),this.rules.other.startAngleBracket.test(i)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(r)?i=i.slice(1):i=i.slice(1,-1)),Lr(e,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:n&&n.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let r;if((r=this.rules.inline.reflink.exec(t))||(r=this.rules.inline.nolink.exec(t))){let i=(r[2]||r[1]).replace(this.rules.other.multipleSpaceGlobal," "),n=e[i.toLowerCase()];if(!n){let s=r[0].charAt(0);return{type:"text",raw:s,text:s}}return Lr(r,n,r[0],this.lexer,this.rules)}}emStrong(t,e,r=""){let i=this.rules.inline.emStrongLDelim.exec(t);if(!(!i||i[3]&&r.match(this.rules.other.unicodeAlphaNumeric))&&(!(i[1]||i[2])||!r||this.rules.inline.punctuation.exec(r))){let n=[...i[0]].length-1,s,a,u=n,l=0,o=i[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(o.lastIndex=0,e=e.slice(-1*t.length+n);(i=o.exec(e))!=null;){if(s=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!s)continue;if(a=[...s].length,i[3]||i[4]){u+=a;continue}else if((i[5]||i[6])&&n%3&&!((n+a)%3)){l+=a;continue}if(u-=a,u>0)continue;a=Math.min(a,a+u+l);let c=[...i[0]][0].length,h=t.slice(0,n+i.index+c+a);if(Math.min(n,a)%2){let g=h.slice(1,-1);return{type:"em",raw:h,text:g,tokens:this.lexer.inlineTokens(g)}}let f=h.slice(2,-2);return{type:"strong",raw:h,text:f,tokens:this.lexer.inlineTokens(f)}}}}codespan(t){let e=this.rules.inline.code.exec(t);if(e){let r=e[2].replace(this.rules.other.newLineCharGlobal," "),i=this.rules.other.nonSpaceChar.test(r),n=this.rules.other.startingSpaceChar.test(r)&&this.rules.other.endingSpaceChar.test(r);return i&&n&&(r=r.substring(1,r.length-1)),{type:"codespan",raw:e[0],text:r}}}br(t){let e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t,e,r=""){let i=this.rules.inline.delLDelim.exec(t);if(i&&(!i[1]||!r||this.rules.inline.punctuation.exec(r))){let n=[...i[0]].length-1,s,a,u=n,l=this.rules.inline.delRDelim;for(l.lastIndex=0,e=e.slice(-1*t.length+n);(i=l.exec(e))!=null;){if(s=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!s||(a=[...s].length,a!==n))continue;if(i[3]||i[4]){u+=a;continue}if(u-=a,u>0)continue;a=Math.min(a,a+u);let o=[...i[0]][0].length,c=t.slice(0,n+i.index+o+a),h=c.slice(n,-n);return{type:"del",raw:c,text:h,tokens:this.lexer.inlineTokens(h)}}}}autolink(t){let e=this.rules.inline.autolink.exec(t);if(e){let r,i;return e[2]==="@"?(r=e[1],i="mailto:"+r):(r=e[1],i=r),{type:"link",raw:e[0],text:r,href:i,tokens:[{type:"text",raw:r,text:r}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let r,i;if(e[2]==="@")r=e[0],i="mailto:"+r;else{let n;do n=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(n!==e[0]);r=e[0],e[1]==="www."?i="http://"+e[0]:i=e[0]}return{type:"link",raw:e[0],text:r,href:i,tokens:[{type:"text",raw:r,text:r}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let r=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:r}}}},$e=class Un{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||Ke,this.options.tokenizer=this.options.tokenizer||new qt,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let r={other:ve,block:Ht.normal,inline:yt.normal};this.options.pedantic?(r.block=Ht.pedantic,r.inline=yt.pedantic):this.options.gfm&&(r.block=Ht.gfm,this.options.breaks?r.inline=yt.breaks:r.inline=yt.gfm),this.tokenizer.rules=r}static get rules(){return{block:Ht,inline:yt}}static lex(e,r){return new Un(r).lex(e)}static lexInline(e,r){return new Un(r).inlineTokens(e)}lex(e){e=e.replace(ve.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let r=0;r<this.inlineQueue.length;r++){let i=this.inlineQueue[r];this.inlineTokens(i.src,i.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,r=[],i=!1){for(this.options.pedantic&&(e=e.replace(ve.tabCharGlobal,"    ").replace(ve.spaceLine,""));e;){let n;if(this.options.extensions?.block?.some(a=>(n=a.call({lexer:this},e,r))?(e=e.substring(n.raw.length),r.push(n),!0):!1))continue;if(n=this.tokenizer.space(e)){e=e.substring(n.raw.length);let a=r.at(-1);n.raw.length===1&&a!==void 0?a.raw+=`
`:r.push(n);continue}if(n=this.tokenizer.code(e)){e=e.substring(n.raw.length);let a=r.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+n.raw,a.text+=`
`+n.text,this.inlineQueue.at(-1).src=a.text):r.push(n);continue}if(n=this.tokenizer.fences(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.heading(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.hr(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.blockquote(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.list(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.html(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.def(e)){e=e.substring(n.raw.length);let a=r.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+n.raw,a.text+=`
`+n.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[n.tag]||(this.tokens.links[n.tag]={href:n.href,title:n.title},r.push(n));continue}if(n=this.tokenizer.table(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.lheading(e)){e=e.substring(n.raw.length),r.push(n);continue}let s=e;if(this.options.extensions?.startBlock){let a=1/0,u=e.slice(1),l;this.options.extensions.startBlock.forEach(o=>{l=o.call({lexer:this},u),typeof l=="number"&&l>=0&&(a=Math.min(a,l))}),a<1/0&&a>=0&&(s=e.substring(0,a+1))}if(this.state.top&&(n=this.tokenizer.paragraph(s))){let a=r.at(-1);i&&a?.type==="paragraph"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+n.raw,a.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):r.push(n),i=s.length!==e.length,e=e.substring(n.raw.length);continue}if(n=this.tokenizer.text(e)){e=e.substring(n.raw.length);let a=r.at(-1);a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+n.raw,a.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):r.push(n);continue}if(e){let a="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,r}inline(e,r=[]){return this.inlineQueue.push({src:e,tokens:r}),r}inlineTokens(e,r=[]){let i=e,n=null;if(this.tokens.links){let l=Object.keys(this.tokens.links);if(l.length>0)for(;(n=this.tokenizer.rules.inline.reflinkSearch.exec(i))!=null;)l.includes(n[0].slice(n[0].lastIndexOf("[")+1,-1))&&(i=i.slice(0,n.index)+"["+"a".repeat(n[0].length-2)+"]"+i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(n=this.tokenizer.rules.inline.anyPunctuation.exec(i))!=null;)i=i.slice(0,n.index)+"++"+i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let s;for(;(n=this.tokenizer.rules.inline.blockSkip.exec(i))!=null;)s=n[2]?n[2].length:0,i=i.slice(0,n.index+s)+"["+"a".repeat(n[0].length-s-2)+"]"+i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);i=this.options.hooks?.emStrongMask?.call({lexer:this},i)??i;let a=!1,u="";for(;e;){a||(u=""),a=!1;let l;if(this.options.extensions?.inline?.some(c=>(l=c.call({lexer:this},e,r))?(e=e.substring(l.raw.length),r.push(l),!0):!1))continue;if(l=this.tokenizer.escape(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.tag(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.link(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(l.raw.length);let c=r.at(-1);l.type==="text"&&c?.type==="text"?(c.raw+=l.raw,c.text+=l.text):r.push(l);continue}if(l=this.tokenizer.emStrong(e,i,u)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.codespan(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.br(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.del(e,i,u)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.autolink(e)){e=e.substring(l.raw.length),r.push(l);continue}if(!this.state.inLink&&(l=this.tokenizer.url(e))){e=e.substring(l.raw.length),r.push(l);continue}let o=e;if(this.options.extensions?.startInline){let c=1/0,h=e.slice(1),f;this.options.extensions.startInline.forEach(g=>{f=g.call({lexer:this},h),typeof f=="number"&&f>=0&&(c=Math.min(c,f))}),c<1/0&&c>=0&&(o=e.substring(0,c+1))}if(l=this.tokenizer.inlineText(o)){e=e.substring(l.raw.length),l.raw.slice(-1)!=="_"&&(u=l.raw.slice(-1)),a=!0;let c=r.at(-1);c?.type==="text"?(c.raw+=l.raw,c.text+=l.text):r.push(l);continue}if(e){let c="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return r}},jt=class{options;parser;constructor(t){this.options=t||Ke}space(t){return""}code({text:t,lang:e,escaped:r}){let i=(e||"").match(ve.notSpaceStart)?.[0],n=t.replace(ve.endingNewline,"")+`
`;return i?'<pre><code class="language-'+Be(i)+'">'+(r?n:Be(n,!0))+`</code></pre>
`:"<pre><code>"+(r?n:Be(n,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}def(t){return""}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){let e=t.ordered,r=t.start,i="";for(let a=0;a<t.items.length;a++){let u=t.items[a];i+=this.listitem(u)}let n=e?"ol":"ul",s=e&&r!==1?' start="'+r+'"':"";return"<"+n+s+`>
`+i+"</"+n+`>
`}listitem(t){return`<li>${this.parser.parse(t.tokens)}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let e="",r="";for(let n=0;n<t.header.length;n++)r+=this.tablecell(t.header[n]);e+=this.tablerow({text:r});let i="";for(let n=0;n<t.rows.length;n++){let s=t.rows[n];r="";for(let a=0;a<s.length;a++)r+=this.tablecell(s[a]);i+=this.tablerow({text:r})}return i&&(i=`<tbody>${i}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+i+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){let e=this.parser.parseInline(t.tokens),r=t.header?"th":"td";return(t.align?`<${r} align="${t.align}">`:`<${r}>`)+e+`</${r}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${Be(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:r}){let i=this.parser.parseInline(r),n=Tr(t);if(n===null)return i;t=n;let s='<a href="'+t+'"';return e&&(s+=' title="'+Be(e)+'"'),s+=">"+i+"</a>",s}image({href:t,title:e,text:r,tokens:i}){i&&(r=this.parser.parseInline(i,this.parser.textRenderer));let n=Tr(t);if(n===null)return Be(r);t=n;let s=`<img src="${t}" alt="${Be(r)}"`;return e&&(s+=` title="${Be(e)}"`),s+=">",s}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:Be(t.text)}},vn=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}checkbox({raw:t}){return t}},Pe=class Hn{options;renderer;textRenderer;constructor(e){this.options=e||Ke,this.options.renderer=this.options.renderer||new jt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new vn}static parse(e,r){return new Hn(r).parse(e)}static parseInline(e,r){return new Hn(r).parseInline(e)}parse(e){let r="";for(let i=0;i<e.length;i++){let n=e[i];if(this.options.extensions?.renderers?.[n.type]){let a=n,u=this.options.extensions.renderers[a.type].call({parser:this},a);if(u!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(a.type)){r+=u||"";continue}}let s=n;switch(s.type){case"space":{r+=this.renderer.space(s);break}case"hr":{r+=this.renderer.hr(s);break}case"heading":{r+=this.renderer.heading(s);break}case"code":{r+=this.renderer.code(s);break}case"table":{r+=this.renderer.table(s);break}case"blockquote":{r+=this.renderer.blockquote(s);break}case"list":{r+=this.renderer.list(s);break}case"checkbox":{r+=this.renderer.checkbox(s);break}case"html":{r+=this.renderer.html(s);break}case"def":{r+=this.renderer.def(s);break}case"paragraph":{r+=this.renderer.paragraph(s);break}case"text":{r+=this.renderer.text(s);break}default:{let a='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return r}parseInline(e,r=this.renderer){let i="";for(let n=0;n<e.length;n++){let s=e[n];if(this.options.extensions?.renderers?.[s.type]){let u=this.options.extensions.renderers[s.type].call({parser:this},s);if(u!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(s.type)){i+=u||"";continue}}let a=s;switch(a.type){case"escape":{i+=r.text(a);break}case"html":{i+=r.html(a);break}case"link":{i+=r.link(a);break}case"image":{i+=r.image(a);break}case"checkbox":{i+=r.checkbox(a);break}case"strong":{i+=r.strong(a);break}case"em":{i+=r.em(a);break}case"codespan":{i+=r.codespan(a);break}case"br":{i+=r.br(a);break}case"del":{i+=r.del(a);break}case"text":{i+=r.text(a);break}default:{let u='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(u),"";throw new Error(u)}}}return i}},xt=class{options;block;constructor(t){this.options=t||Ke}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(){return this.block?$e.lex:$e.lexInline}provideParser(){return this.block?Pe.parse:Pe.parseInline}},Di=class{defaults=fn();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Pe;Renderer=jt;TextRenderer=vn;Lexer=$e;Tokenizer=qt;Hooks=xt;constructor(...t){this.use(...t)}walkTokens(t,e){let r=[];for(let i of t)switch(r=r.concat(e.call(this,i)),i.type){case"table":{let n=i;for(let s of n.header)r=r.concat(this.walkTokens(s.tokens,e));for(let s of n.rows)for(let a of s)r=r.concat(this.walkTokens(a.tokens,e));break}case"list":{let n=i;r=r.concat(this.walkTokens(n.items,e));break}default:{let n=i;this.defaults.extensions?.childTokens?.[n.type]?this.defaults.extensions.childTokens[n.type].forEach(s=>{let a=n[s].flat(1/0);r=r.concat(this.walkTokens(a,e))}):n.tokens&&(r=r.concat(this.walkTokens(n.tokens,e)))}}return r}use(...t){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(r=>{let i={...r};if(i.async=this.defaults.async||i.async||!1,r.extensions&&(r.extensions.forEach(n=>{if(!n.name)throw new Error("extension name required");if("renderer"in n){let s=e.renderers[n.name];s?e.renderers[n.name]=function(...a){let u=n.renderer.apply(this,a);return u===!1&&(u=s.apply(this,a)),u}:e.renderers[n.name]=n.renderer}if("tokenizer"in n){if(!n.level||n.level!=="block"&&n.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let s=e[n.level];s?s.unshift(n.tokenizer):e[n.level]=[n.tokenizer],n.start&&(n.level==="block"?e.startBlock?e.startBlock.push(n.start):e.startBlock=[n.start]:n.level==="inline"&&(e.startInline?e.startInline.push(n.start):e.startInline=[n.start]))}"childTokens"in n&&n.childTokens&&(e.childTokens[n.name]=n.childTokens)}),i.extensions=e),r.renderer){let n=this.defaults.renderer||new jt(this.defaults);for(let s in r.renderer){if(!(s in n))throw new Error(`renderer '${s}' does not exist`);if(["options","parser"].includes(s))continue;let a=s,u=r.renderer[a],l=n[a];n[a]=(...o)=>{let c=u.apply(n,o);return c===!1&&(c=l.apply(n,o)),c||""}}i.renderer=n}if(r.tokenizer){let n=this.defaults.tokenizer||new qt(this.defaults);for(let s in r.tokenizer){if(!(s in n))throw new Error(`tokenizer '${s}' does not exist`);if(["options","rules","lexer"].includes(s))continue;let a=s,u=r.tokenizer[a],l=n[a];n[a]=(...o)=>{let c=u.apply(n,o);return c===!1&&(c=l.apply(n,o)),c}}i.tokenizer=n}if(r.hooks){let n=this.defaults.hooks||new xt;for(let s in r.hooks){if(!(s in n))throw new Error(`hook '${s}' does not exist`);if(["options","block"].includes(s))continue;let a=s,u=r.hooks[a],l=n[a];xt.passThroughHooks.has(s)?n[a]=o=>{if(this.defaults.async&&xt.passThroughHooksRespectAsync.has(s))return(async()=>{let h=await u.call(n,o);return l.call(n,h)})();let c=u.call(n,o);return l.call(n,c)}:n[a]=(...o)=>{if(this.defaults.async)return(async()=>{let h=await u.apply(n,o);return h===!1&&(h=await l.apply(n,o)),h})();let c=u.apply(n,o);return c===!1&&(c=l.apply(n,o)),c}}i.hooks=n}if(r.walkTokens){let n=this.defaults.walkTokens,s=r.walkTokens;i.walkTokens=function(a){let u=[];return u.push(s.call(this,a)),n&&(u=u.concat(n.call(this,a))),u}}this.defaults={...this.defaults,...i}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return $e.lex(t,e??this.defaults)}parser(t,e){return Pe.parse(t,e??this.defaults)}parseMarkdown(t){return(e,r)=>{let i={...r},n={...this.defaults,...i},s=this.onError(!!n.silent,!!n.async);if(this.defaults.async===!0&&i.async===!1)return s(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return s(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return s(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(n.hooks&&(n.hooks.options=n,n.hooks.block=t),n.async)return(async()=>{let a=n.hooks?await n.hooks.preprocess(e):e,u=await(n.hooks?await n.hooks.provideLexer():t?$e.lex:$e.lexInline)(a,n),l=n.hooks?await n.hooks.processAllTokens(u):u;n.walkTokens&&await Promise.all(this.walkTokens(l,n.walkTokens));let o=await(n.hooks?await n.hooks.provideParser():t?Pe.parse:Pe.parseInline)(l,n);return n.hooks?await n.hooks.postprocess(o):o})().catch(s);try{n.hooks&&(e=n.hooks.preprocess(e));let a=(n.hooks?n.hooks.provideLexer():t?$e.lex:$e.lexInline)(e,n);n.hooks&&(a=n.hooks.processAllTokens(a)),n.walkTokens&&this.walkTokens(a,n.walkTokens);let u=(n.hooks?n.hooks.provideParser():t?Pe.parse:Pe.parseInline)(a,n);return n.hooks&&(u=n.hooks.postprocess(u)),u}catch(a){return s(a)}}}onError(t,e){return r=>{if(r.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let i="<p>An error occurred:</p><pre>"+Be(r.message+"",!0)+"</pre>";return e?Promise.resolve(i):i}if(e)return Promise.reject(r);throw r}}},Je=new Di;function J(t,e){return Je.parse(t,e)}J.options=J.setOptions=function(t){return Je.setOptions(t),J.defaults=Je.defaults,dr(J.defaults),J},J.getDefaults=fn,J.defaults=Ke,J.use=function(...t){return Je.use(...t),J.defaults=Je.defaults,dr(J.defaults),J},J.walkTokens=function(t,e){return Je.walkTokens(t,e)},J.parseInline=Je.parseInline,J.Parser=Pe,J.parser=Pe.parse,J.Renderer=jt,J.TextRenderer=vn,J.Lexer=$e,J.lexer=$e.lex,J.Tokenizer=qt,J.Hooks=xt,J.parse=J,J.options,J.setOptions,J.use,J.walkTokens,J.parseInline,Pe.parse,$e.lex;const _r=`function j() {
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
`,Mr=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",_r],{type:"text/javascript;charset=utf-8"});function Ui(t){let e;try{if(e=Mr&&(self.URL||self.webkitURL).createObjectURL(Mr),!e)throw"";const r=new Worker(e,{type:"module",name:t?.name});return r.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(e)}),r}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(_r),{type:"module",name:t?.name})}}function Hi(t){if(t.startsWith("---")){const e=t.indexOf(`
---`,3);if(e!==-1){const r=t.slice(3,e+0).trim(),i=t.slice(e+4).trimStart(),n={};return r.split(/\r?\n/).forEach(s=>{const a=s.match(/^([^:]+):\s*(.*)$/);a&&(n[a[1].trim()]=a[2].trim())}),{content:i,data:n}}}return{content:t,data:{}}}const $r=Xn(()=>new Ui,"markdown"),Pr=typeof DOMParser<"u"?new DOMParser:null;function En(){return $r.get()}function qi(t){return $r.send(t,1e3)}const Qe=[];function An(t){if(t&&typeof t=="object"){Qe.push(t);try{J.use(t)}catch(e){console.warn("[markdown] failed to apply plugin",e)}}}function ji(t){Qe.length=0,Array.isArray(t)&&Qe.push(...t.filter(e=>e&&typeof e=="object"));try{Qe.forEach(e=>J.use(e))}catch(e){console.warn("[markdown] failed to apply markdown extensions",e)}}async function Ft(t){if(En&&En())try{const s=await qi({type:"render",md:t});if(s&&s.html!==void 0)try{const u=(Pr||new DOMParser).parseFromString(s.html,"text/html"),l=u.querySelectorAll("h1,h2,h3,h4,h5,h6");l.forEach(h=>{h.id||(h.id=ie(h.textContent||""))});try{u.querySelectorAll("img").forEach(f=>{try{f.getAttribute("loading")||f.setAttribute("data-want-lazy","1")}catch(g){console.warn("[markdown] set image loading attribute failed",g)}})}catch(h){console.warn("[markdown] query images failed",h)}try{u.querySelectorAll("pre code").forEach(f=>{try{const g=f.getAttribute&&f.getAttribute("class")||f.className||"",d=String(g||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(d)try{f.setAttribute&&f.setAttribute("class",d)}catch(k){console.warn("[markdown] set code class failed",k),f.className=d}else try{f.removeAttribute&&f.removeAttribute("class")}catch(k){console.warn("[markdown] remove code class failed",k),f.className=""}const m=d,w=m.match(/language-([a-zA-Z0-9_+-]+)/)||m.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!w||!w[1])try{const k=f.textContent||"";try{if(ce&&typeof ce.getLanguage=="function"&&ce.getLanguage("plaintext")){const v=ce.highlight(k,{language:"plaintext"});v&&v.value&&(f.innerHTML=v.value)}}catch{try{ce.highlightElement(f)}catch(N){console.warn("[markdown] hljs.highlightElement failed",N)}}}catch(k){console.warn("[markdown] code auto-detect failed",k)}}catch(g){console.warn("[markdown] processing code blocks failed",g)}})}catch(h){console.warn("[markdown] query code blocks failed",h)}const o=u.body.innerHTML,c=[];return l.forEach(h=>{c.push({level:Number(h.tagName.substring(1)),text:(h.textContent||"").trim(),id:h.id})}),{html:o,meta:s.meta||{},toc:c}}catch(a){return console.warn("[markdown] post-process worker HTML failed",a),s}}catch(s){console.warn("[markdown] worker render failed",s)}const{content:r,data:i}=Hi(t||"");if(J.setOptions({gfm:!0,mangle:!1,headerIds:!1,headerPrefix:""}),Qe&&Qe.length)try{Qe.forEach(s=>J.use(s))}catch(s){console.warn("[markdown] apply plugins failed",s)}let n=J.parse(r);try{const a=(Pr||new DOMParser).parseFromString(n,"text/html"),u=a.querySelectorAll("h1,h2,h3,h4,h5,h6");u.forEach(o=>{o.id||(o.id=ie(o.textContent||""))});try{a.querySelectorAll("img").forEach(c=>{try{c.getAttribute("loading")||c.setAttribute("data-want-lazy","1")}catch(h){console.warn("[markdown] set image loading attribute failed",h)}})}catch(o){console.warn("[markdown] query images failed",o)}try{a.querySelectorAll("pre code").forEach(c=>{try{const h=c.getAttribute&&c.getAttribute("class")||c.className||"",f=String(h||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(f)try{c.setAttribute&&c.setAttribute("class",f)}catch(m){console.warn("[markdown] set code class failed",m),c.className=f}else try{c.removeAttribute&&c.removeAttribute("class")}catch(m){console.warn("[markdown] remove code class failed",m),c.className=""}const g=f,d=g.match(/language-([a-zA-Z0-9_+-]+)/)||g.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!d||!d[1])try{const m=c.textContent||"";try{if(ce&&typeof ce.getLanguage=="function"&&ce.getLanguage("plaintext")){const w=ce.highlight(m,{language:"plaintext"});w&&w.value&&(c.innerHTML=w.value)}}catch{try{ce.highlightElement(c)}catch(k){console.warn("[markdown] hljs.highlightElement failed",k)}}}catch(m){console.warn("[markdown] code auto-detect failed",m)}}catch(h){console.warn("[markdown] processing code blocks failed",h)}})}catch(o){console.warn("[markdown] query code blocks failed",o)}n=a.body.innerHTML;const l=[];return u.forEach(o=>{l.push({level:Number(o.tagName.substring(1)),text:(o.textContent||"").trim(),id:o.id})}),{html:a.body.innerHTML,meta:i||{},toc:l}}catch(s){console.warn("post-process markdown failed",s)}return{html:n,meta:i||{},toc:[]}}function Rn(t,e){const r=new Set,i=/```\s*([a-zA-Z0-9_\-+]+)?/g,n=new Set(["then","now","if","once","so","and","or","but","when","the","a","an","as","let","const","var","export","import","from","true","false","null","npm","run","echo","sudo","this","that","have","using","some","return","returns","function","console","log","error","warn","class","new","undefined","with","select","from","where","join","on","group","order","by","having","as","into","values","like","limit","offset","create","table","index","view","insert","update","delete","returning","and","or","not","all","any","exists","case","when","then","else","end","distance","geometry","you","which","would","why","cool","other","same","everything","check"]),s=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);let a;for(;a=i.exec(t);)if(a[1]){const u=a[1].toLowerCase();if(tn.has(u)||e&&e.size&&u.length<3&&!e.has(u)&&!(Ae&&Ae[u]&&e.has(Ae[u])))continue;if(e&&e.size){if(e.has(u)){const o=e.get(u);o&&r.add(o);continue}if(Ae&&Ae[u]){const o=Ae[u];if(e.has(o)){const c=e.get(o)||o;r.add(c);continue}}}(s.has(u)||u.length>=5&&u.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(u)&&!n.has(u))&&r.add(u)}return r}const Fi=Object.freeze(Object.defineProperty({__proto__:null,addMarkdownExtension:An,detectFenceLanguages:Rn,initRendererWorker:En,markdownPlugins:Qe,parseMarkdownToHtml:Ft,setMarkdownExtensions:ji},Symbol.toStringTag,{value:"Module"}));function Wi(t,e){const r=document.createElement("aside");r.className="menu nimbi-nav";const i=document.createElement("p");i.className="menu-label",i.textContent=t("navigation"),r.appendChild(i);const n=document.createElement("ul");return n.className="menu-list",e.forEach(s=>{const a=document.createElement("li"),u=document.createElement("a");if(u.href="#"+s.path,u.textContent=s.name,a.appendChild(u),s.children&&s.children.length){const l=document.createElement("ul");s.children.forEach(o=>{const c=document.createElement("li"),h=document.createElement("a");h.href="#"+o.path,h.textContent=o.name,c.appendChild(h),l.appendChild(c)}),a.appendChild(l)}n.appendChild(a)}),r.appendChild(n),r}function Zi(t,e,r=""){const i=document.createElement("aside");i.className="menu nimbi-toc-inner";const n=document.createElement("p");n.className="menu-label",n.textContent=t("onThisPage"),i.appendChild(n);const s=document.createElement("ul");return s.className="menu-list",e.forEach(a=>{if(a.level===1)return;const u=document.createElement("li"),l=document.createElement("a"),o=a.id||ie(a.text);try{const c=String(r||"").replace(/^[\.\/]+/,""),h=c&&j&&j.has&&j.has(c)?j.get(c):c;h?l.href=`?page=${encodeURIComponent(h)}#${encodeURIComponent(o)}`:l.href=`?page=${encodeURIComponent(o)}#${encodeURIComponent(o)}`}catch(c){console.warn("[htmlBuilder] buildTocElement href normalization failed",c);const h=String(r||"").replace(/^[\.\/]+/,""),f=h&&j&&j.has&&j.has(h)?j.get(h):h;f?l.href=`?page=${encodeURIComponent(f)}#${encodeURIComponent(o)}`:l.href=`?page=${encodeURIComponent(o)}#${encodeURIComponent(o)}`}l.textContent=a.text,u.appendChild(l),s.appendChild(u)}),i.appendChild(s),i}function Ir(t){t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(r=>{r.id||(r.id=ie(r.textContent||""))})}function Qi(t,e,r){try{const i=t.querySelectorAll("img");if(i&&i.length){const n=e&&e.includes("/")?e.substring(0,e.lastIndexOf("/")+1):"";i.forEach(s=>{const a=s.getAttribute("src")||"";if(a&&!(/^(https?:)?\/\//.test(a)||a.startsWith("/")))try{const u=new URL(n+a,r).toString();s.src=u;try{s.getAttribute("loading")||s.setAttribute("data-want-lazy","1")}catch(l){console.warn("[htmlBuilder] set image loading attribute failed",l)}}catch(u){console.warn("[htmlBuilder] resolve image src failed",u)}})}}catch(i){console.warn("[htmlBuilder] lazyLoadImages failed",i)}}function zr(t,e,r){try{const i=e&&e.includes("/")?e.substring(0,e.lastIndexOf("/")+1):"";let n=null;try{const a=new URL(r,location.href);n=new URL(i||".",a).toString()}catch{try{n=new URL(i||".",location.href).toString()}catch{n=i||"./"}}const s=t.querySelectorAll("*");for(const a of Array.from(s||[]))try{const u=a.tagName?a.tagName.toLowerCase():"",l=o=>{try{const c=a.getAttribute(o)||"";if(!c||/^(https?:)?\/\//i.test(c)||c.startsWith("/")||c.startsWith("#"))return;try{a.setAttribute(o,new URL(c,n).toString())}catch{}}catch{}};if(a.hasAttribute&&a.hasAttribute("src")&&l("src"),a.hasAttribute&&a.hasAttribute("href")&&u!=="a"&&l("href"),a.hasAttribute&&a.hasAttribute("xlink:href")&&l("xlink:href"),a.hasAttribute&&a.hasAttribute("poster")&&l("poster"),a.hasAttribute("srcset")){const h=(a.getAttribute("srcset")||"").split(",").map(f=>f.trim()).filter(Boolean).map(f=>{const[g,d]=f.split(/\s+/,2);if(!g||/^(https?:)?\/\//i.test(g)||g.startsWith("/"))return f;try{const m=new URL(g,n).toString();return d?`${m} ${d}`:m}catch{return f}}).join(", ");a.setAttribute("srcset",h)}}catch{}}catch(i){console.warn("[htmlBuilder] rewriteRelativeAssets failed",i)}}let Br="",Tn=null,Or="";async function Nr(t,e,r){try{const i=t.querySelectorAll("a");if(!i||!i.length)return;let n,s;if(e===Br&&Tn)n=Tn,s=Or;else{try{n=new URL(e,location.href),s=ht(n.pathname)}catch{try{n=new URL(e,location.href),s=ht(n.pathname)}catch{n=null,s="/"}}Br=e,Tn=n,Or=s}const a=new Set,u=[];for(const l of Array.from(i))try{const o=l.getAttribute("href")||"";if(!o||Jn(o))continue;try{if(o.startsWith("?")||o.indexOf("?")!==-1)try{const h=new URL(o,e||location.href),f=h.searchParams.get("page");if(f&&f.indexOf("/")===-1&&r){const g=r.includes("/")?r.substring(0,r.lastIndexOf("/")+1):"";if(g){const d=ue(g+f);l.setAttribute("href","?page="+encodeURIComponent(d)+(h.hash||""));continue}}}catch{}}catch{}if(o.startsWith("/")&&!o.endsWith(".md"))continue;const c=o.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(c){let h=c[1];const f=c[2];!h.startsWith("/")&&r&&(h=(r.includes("/")?r.substring(0,r.lastIndexOf("/")+1):"")+h);try{const g=new URL(h,e).pathname;let d=g.startsWith(s)?g.slice(s.length):g;d=ue(d),u.push({node:l,mdPathRaw:h,frag:f,rel:d}),j.has(d)||a.add(d)}catch(g){console.warn("[htmlBuilder] resolve mdPath failed",g)}continue}try{let h=o;!o.startsWith("/")&&r&&(h=(r.includes("/")?r.substring(0,r.lastIndexOf("/")+1):"")+o);const g=new URL(h,e).pathname||"";if(g&&g.indexOf(s)!==-1){let d=g.startsWith(s)?g.slice(s.length):g;if(d=ue(d),d=ut(d),d||(d="_home"),!d.endsWith(".md"))if(Q.has(d)){const m=Q.get(d),w=j.get(m)||d;l.setAttribute("href",`?page=${encodeURIComponent(w)}`)}else l.setAttribute("href",`?page=${encodeURIComponent(d)}`)}}catch(h){console.warn("[htmlBuilder] resolving href to URL failed",h)}}catch(o){console.warn("[htmlBuilder] processing anchor failed",o)}a.size&&await Promise.all(Array.from(a).map(async l=>{try{try{const c=String(l).match(/([^\/]+)\.md$/),h=c&&c[1];if(h&&Q.has(h)){try{const f=Q.get(h);if(f)try{j.set(f,h)}catch(g){console.warn("[htmlBuilder] mdToSlug.set failed",g)}}catch(f){console.warn("[htmlBuilder] reading slugToMd failed",f)}return}}catch(c){console.warn("[htmlBuilder] basename slug lookup failed",c)}const o=await be(l,e);if(o&&o.raw){const c=(o.raw||"").match(/^#\s+(.+)$/m);if(c&&c[1]){const h=ie(c[1].trim());if(h)try{Q.set(h,l),j.set(l,h)}catch(f){console.warn("[htmlBuilder] setting slug mapping failed",f)}}}}catch(o){console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed",o)}}));for(const l of u){const{node:o,frag:c,rel:h}=l;let f=null;try{j.has(h)&&(f=j.get(h))}catch(g){console.warn("[htmlBuilder] mdToSlug access failed",g)}f?c?o.setAttribute("href",`?page=${encodeURIComponent(f)}#${encodeURIComponent(c)}`):o.setAttribute("href",`?page=${encodeURIComponent(f)}`):c?o.setAttribute("href",`?page=${encodeURIComponent(h)}#${encodeURIComponent(c)}`):o.setAttribute("href",`?page=${encodeURIComponent(h)}`)}}catch(i){console.warn("[htmlBuilder] rewriteAnchors failed",i)}}function Gi(t,e,r,i){const n=e.querySelector("h1"),s=n?(n.textContent||"").trim():"";let a="";try{s&&(a=ie(s)),!a&&t&&t.meta&&t.meta.title&&(a=ie(t.meta.title)),!a&&r&&(a=ie(String(r))),a||(a="_home");try{r&&(Q.set(a,r),j.set(r,a))}catch(u){console.warn("[htmlBuilder] computeSlug set slug mapping failed",u)}try{let u="?page="+encodeURIComponent(a);try{const l=i||(location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):"");l&&(u+="#"+encodeURIComponent(l))}catch(l){console.warn("[htmlBuilder] computeSlug hash decode failed",l)}try{history.replaceState({page:a},"",u)}catch(l){console.warn("[htmlBuilder] computeSlug history replace failed",l)}}catch(u){console.warn("[htmlBuilder] computeSlug inner failed",u)}}catch(u){console.warn("[htmlBuilder] computeSlug failed",u)}return{topH1:n,h1Text:s,slugKey:a}}async function Xi(t,e){if(!t||!t.length)return;const r=new Set;for(const l of Array.from(t||[]))try{const o=l.getAttribute("href")||"";if(!o)continue;let f=ue(o).split(/::|#/,2)[0];if(!f||(f.includes(".")||(f=f+".html"),!/\.html(?:$|[?#])/.test(f)&&!f.toLowerCase().endsWith(".html")))continue;const g=f;try{if(j&&j.has&&j.has(g))continue}catch(d){console.warn("[htmlBuilder] mdToSlug check failed",d)}try{let d=!1;for(const m of Q.values())if(m===g){d=!0;break}if(d)continue}catch(d){console.warn("[htmlBuilder] slugToMd iteration failed",d)}r.add(g)}catch(o){console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed",o)}if(!r.size)return;const i=async l=>{try{const o=await be(l,e);if(o&&o.raw)try{const h=(Dr||new DOMParser).parseFromString(o.raw,"text/html"),f=h.querySelector("title"),g=h.querySelector("h1"),d=f&&f.textContent&&f.textContent.trim()?f.textContent.trim():g&&g.textContent?g.textContent.trim():null;if(d){const m=ie(d);if(m)try{Q.set(m,l),j.set(l,m)}catch(w){console.warn("[htmlBuilder] set slugToMd/mdToSlug failed",w)}}}catch(c){console.warn("[htmlBuilder] parse HTML title failed",c)}}catch(o){console.warn("[htmlBuilder] fetchAndExtract failed",o)}},n=5,s=Array.from(r);let a=0;const u=[];for(;a<s.length;){const l=s.slice(a,a+n);u.push(Promise.all(l.map(i))),a+=n}await Promise.all(u)}async function Yi(t,e){if(!t||!t.length)return;const r=[],i=new Set;let n="";try{const s=new URL(e);n=ht(s.pathname)}catch(s){n="",console.warn("[htmlBuilder] preMapMdSlugs parse base failed",s)}for(const s of Array.from(t||[]))try{const a=s.getAttribute("href")||"";if(!a)continue;const u=a.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(u){let l=ue(u[1]);try{let o;try{o=new URL(l,e).pathname}catch(h){o=l,console.warn("[htmlBuilder] resolve mdPath URL failed",h)}const c=o.startsWith(n)?o.slice(n.length):o.replace(/^\//,"");r.push({rel:c}),j.has(c)||i.add(c)}catch(o){console.warn("[htmlBuilder] rewriteAnchors failed",o)}continue}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed",a)}i.size&&await Promise.all(Array.from(i).map(async s=>{try{const a=String(s).match(/([^\/]+)\.md$/),u=a&&a[1];if(u&&Q.has(u)){try{const l=Q.get(u);l&&j.set(l,u)}catch(l){console.warn("[htmlBuilder] preMapMdSlugs slug map access failed",l)}return}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs basename check failed",a)}try{const a=await be(s,e);if(a&&a.raw){const u=(a.raw||"").match(/^#\s+(.+)$/m);if(u&&u[1]){const l=ie(u[1].trim());if(l)try{Q.set(l,s),j.set(s,l)}catch(o){console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed",o)}}}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs fetch failed",a)}}))}const Dr=typeof DOMParser<"u"?new DOMParser:null;function Cn(t){try{const r=(Dr||new DOMParser).parseFromString(t||"","text/html");Ir(r);try{r.querySelectorAll("img").forEach(u=>{try{u.getAttribute("loading")||u.setAttribute("data-want-lazy","1")}catch(l){console.warn("[htmlBuilder] parseHtml set image loading attribute failed",l)}})}catch(a){console.warn("[htmlBuilder] parseHtml query images failed",a)}r.querySelectorAll("pre code, code[class]").forEach(a=>{try{const u=a.getAttribute&&a.getAttribute("class")||a.className||"",l=u.match(/language-([a-zA-Z0-9_+-]+)/)||u.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(l&&l[1]){const o=(l[1]||"").toLowerCase(),c=Y.size&&(Y.get(o)||Y.get(String(o).toLowerCase()))||o;try{(async()=>{try{await nt(c)}catch(h){console.warn("[htmlBuilder] registerLanguage failed",h)}})()}catch(h){console.warn("[htmlBuilder] schedule registerLanguage failed",h)}}else try{if(ce&&typeof ce.getLanguage=="function"&&ce.getLanguage("plaintext")){const o=ce.highlight?ce.highlight(a.textContent||"",{language:"plaintext"}):null;o&&o.value&&(a.innerHTML=o.value)}}catch(o){console.warn("[htmlBuilder] plaintext highlight fallback failed",o)}}catch(u){console.warn("[htmlBuilder] code element processing failed",u)}});const n=[];return r.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(a=>{n.push({level:Number(a.tagName.substring(1)),text:(a.textContent||"").trim(),id:a.id})}),{html:r.body.innerHTML,meta:{},toc:n}}catch(e){return console.warn("[htmlBuilder] parseHtml failed",e),{html:t||"",meta:{},toc:[]}}}async function Ki(t){const e=Rn?Rn(t||"",Y):new Set,r=new Set(e),i=[];for(const n of r)try{const s=Y.size&&(Y.get(n)||Y.get(String(n).toLowerCase()))||n;try{i.push(nt(s))}catch(a){console.warn("[htmlBuilder] ensureLanguages push canonical failed",a)}if(String(n)!==String(s))try{i.push(nt(n))}catch(a){console.warn("[htmlBuilder] ensureLanguages push alias failed",a)}}catch(s){console.warn("[htmlBuilder] ensureLanguages inner failed",s)}try{await Promise.all(i)}catch(n){console.warn("[htmlBuilder] ensureLanguages failed",n)}}async function Vi(t){if(await Ki(t),Ft){const e=await Ft(t||"");return!e||typeof e!="object"?{html:String(t||""),meta:{},toc:[]}:(Array.isArray(e.toc)||(e.toc=[]),e.meta||(e.meta={}),e)}return{html:String(t||""),meta:{},toc:[]}}async function Ji(t,e,r,i,n){let s=null;if(e.isHtml)try{const h=typeof DOMParser<"u"?new DOMParser:null;if(h){const f=h.parseFromString(e.raw||"","text/html");try{zr(f.body,r,n)}catch{}s=Cn(f.documentElement&&f.documentElement.outerHTML?f.documentElement.outerHTML:e.raw||"")}else s=Cn(e.raw||"")}catch{s=Cn(e.raw||"")}else s=await Vi(e.raw||"");const a=document.createElement("article");a.className="nimbi-article content",a.innerHTML=s.html;try{zr(a,r,n)}catch(h){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle",h)}try{Ir(a)}catch(h){console.warn("[htmlBuilder] addHeadingIds failed",h)}try{a.querySelectorAll("pre code, code[class]").forEach(f=>{try{const g=f.getAttribute&&f.getAttribute("class")||f.className||"",d=String(g||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(d)try{f.setAttribute&&f.setAttribute("class",d)}catch(m){f.className=d,console.warn("[htmlBuilder] set element class failed",m)}else try{f.removeAttribute&&f.removeAttribute("class")}catch(m){f.className="",console.warn("[htmlBuilder] remove element class failed",m)}}catch(g){console.warn("[htmlBuilder] code element cleanup failed",g)}})}catch(h){console.warn("[htmlBuilder] processing code elements failed",h)}try{Wn(a)}catch(h){console.warn("[htmlBuilder] observeCodeBlocks failed",h)}Qi(a,r,n);try{await ea(a,n,r)}catch(h){console.warn("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread",h),await Nr(a,n,r)}const{topH1:u,h1Text:l,slugKey:o}=Gi(s,a,r,i),c=Zi(t,s.toc,r);return{article:a,parsed:s,toc:c,topH1:u,h1Text:l,slugKey:o}}function Ur(t,e,r){t&&(t.innerHTML="");const i=document.createElement("article");i.className="nimbi-article content nimbi-not-found";const n=document.createElement("h1");n.textContent=e&&e("notFound")||"Page not found";const s=document.createElement("p");s.textContent=r&&r.message?String(r.message):"Failed to resolve the requested page.",i.appendChild(n),i.appendChild(s),t&&t.appendChild&&t.appendChild(i)}async function ea(t,e,r){return Nr(t,e,r)}function ta(t){try{t.addEventListener("click",e=>{const r=e.target&&e.target.closest?e.target.closest("a"):null;if(!r)return;const i=r.getAttribute("href")||"";try{const n=new URL(i,location.href),s=n.searchParams.get("page"),a=n.hash?n.hash.replace(/^#/,""):null;if(!s&&!a)return;e.preventDefault();let u=null;try{history&&history.state&&history.state.page&&(u=history.state.page)}catch(l){u=null,console.warn("[htmlBuilder] access history.state failed",l)}try{u||(u=new URL(location.href).searchParams.get("page"))}catch(l){console.warn("[htmlBuilder] parse current location failed",l)}if(!s&&a||s&&u&&String(s)===String(u)){try{if(!s&&a)try{history.replaceState(history.state,"",(location.pathname||"")+(location.search||"")+(a?"#"+encodeURIComponent(a):""))}catch(l){console.warn("[htmlBuilder] history.replaceState failed",l)}else try{history.replaceState({page:u||s},"","?page="+encodeURIComponent(u||s)+(a?"#"+encodeURIComponent(a):""))}catch(l){console.warn("[htmlBuilder] history.replaceState failed",l)}}catch(l){console.warn("[htmlBuilder] update history for anchor failed",l)}try{e.stopImmediatePropagation&&e.stopImmediatePropagation(),e.stopPropagation&&e.stopPropagation()}catch(l){console.warn("[htmlBuilder] stopPropagation failed",l)}try{Ln(a)}catch(l){console.warn("[htmlBuilder] scrollToAnchorOrTop failed",l)}return}history.pushState({page:s},"","?page="+encodeURIComponent(s)+(a?"#"+encodeURIComponent(a):""));try{if(typeof window<"u"&&typeof window.renderByQuery=="function")try{window.renderByQuery()}catch(l){console.warn("[htmlBuilder] window.renderByQuery failed",l)}else if(typeof window<"u")try{window.dispatchEvent(new PopStateEvent("popstate"))}catch(l){console.warn("[htmlBuilder] dispatch popstate failed",l)}else try{renderByQuery()}catch(l){console.warn("[htmlBuilder] renderByQuery failed",l)}}catch(l){console.warn("[htmlBuilder] SPA navigation invocation failed",l)}}catch(n){console.warn("[htmlBuilder] non-URL href in attachTocClickHandler",n)}})}catch(e){console.warn("[htmlBuilder] attachTocClickHandler failed",e)}}function Ln(t){const e=document.querySelector(".nimbi-cms")||null;if(t){const r=document.getElementById(t);if(r)try{const i=()=>{try{if(e&&e.scrollTo&&e.contains(r)){const n=r.getBoundingClientRect().top-e.getBoundingClientRect().top+e.scrollTop;e.scrollTo({top:n,behavior:"smooth"})}else try{r.scrollIntoView({behavior:"smooth",block:"start"})}catch{try{r.scrollIntoView()}catch(s){console.warn("[htmlBuilder] scrollIntoView failed",s)}}}catch{try{r.scrollIntoView()}catch(s){console.warn("[htmlBuilder] final scroll fallback failed",s)}}};try{requestAnimationFrame(()=>setTimeout(i,50))}catch(n){console.warn("[htmlBuilder] scheduling scroll failed",n),setTimeout(i,50)}}catch(i){try{r.scrollIntoView()}catch(n){console.warn("[htmlBuilder] final scroll fallback failed",n)}console.warn("[htmlBuilder] doScroll failed",i)}}else try{e&&e.scrollTo?e.scrollTo({top:0,behavior:"smooth"}):window.scrollTo(0,0)}catch(r){try{window.scrollTo(0,0)}catch(i){console.warn("[htmlBuilder] window.scrollTo failed",i)}console.warn("[htmlBuilder] scroll to top failed",r)}}function na(t,e,{mountOverlay:r=null,container:i=null,mountEl:n=null,navWrap:s=null,t:a=null}={}){try{const u=a||(m=>typeof m=="string"?m:""),l=i||document.querySelector(".nimbi-cms"),o=n||document.querySelector(".nimbi-mount"),c=r||document.querySelector(".nimbi-overlay"),h=s||document.querySelector(".nimbi-nav-wrap");let g=document.querySelector(".nimbi-scroll-top");if(!g){g=document.createElement("button"),g.className="nimbi-scroll-top",g.setAttribute("aria-label",u("scrollToTop")),g.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';try{c&&c.appendChild?c.appendChild(g):l&&l.appendChild?l.appendChild(g):o&&o.appendChild?o.appendChild(g):document.body.appendChild(g)}catch{try{document.body.appendChild(g)}catch(w){console.warn("[htmlBuilder] append scroll top button failed",w)}}try{g.style.position="absolute",g.style.right="1rem",g.style.bottom="1.25rem",g.style.zIndex="60"}catch(m){console.warn("[htmlBuilder] set scroll-top button styles failed",m)}g.addEventListener("click",()=>{try{i&&i.scrollTo?i.scrollTo({top:0,left:0,behavior:"smooth"}):n&&n.scrollTo?n.scrollTo({top:0,left:0,behavior:"smooth"}):window.scrollTo({top:0,left:0,behavior:"smooth"})}catch{try{i&&(i.scrollTop=0)}catch(w){console.warn("[htmlBuilder] fallback container scrollTop failed",w)}try{n&&(n.scrollTop=0)}catch(w){console.warn("[htmlBuilder] fallback mountEl scrollTop failed",w)}try{document.documentElement.scrollTop=0}catch(w){console.warn("[htmlBuilder] fallback document scrollTop failed",w)}}})}const d=h&&h.querySelector?h.querySelector(".menu-label"):null;if(e){if(!g._nimbiObserver){const m=new IntersectionObserver(w=>{for(const k of w)k.target instanceof Element&&(k.isIntersecting?(g.classList.remove("show"),d&&d.classList.remove("show")):(g.classList.add("show"),d&&d.classList.add("show")))},{root:i instanceof Element?i:n instanceof Element?n:null,threshold:0});g._nimbiObserver=m}try{g._nimbiObserver.disconnect()}catch(m){console.warn("[htmlBuilder] observer disconnect failed",m)}try{g._nimbiObserver.observe(e)}catch(m){console.warn("[htmlBuilder] observer observe failed",m)}try{const m=()=>{try{const w=l instanceof Element?l.getBoundingClientRect():{top:0,bottom:window.innerHeight},k=e.getBoundingClientRect();!(k.bottom<w.top||k.top>w.bottom)?(g.classList.remove("show"),d&&d.classList.remove("show")):(g.classList.add("show"),d&&d.classList.add("show"))}catch(w){console.warn("[htmlBuilder] checkIntersect failed",w)}};m(),"IntersectionObserver"in window||setTimeout(m,100)}catch(m){console.warn("[htmlBuilder] checkIntersect outer failed",m)}}else{g.classList.remove("show"),d&&d.classList.remove("show");const m=i instanceof Element?i:n instanceof Element?n:window,w=()=>{try{(m===window?window.scrollY:m.scrollTop||0)>10?(g.classList.add("show"),d&&d.classList.add("show")):(g.classList.remove("show"),d&&d.classList.remove("show"))}catch(k){console.warn("[htmlBuilder] onScroll handler failed",k)}};Mt(()=>m.addEventListener("scroll",w)),w()}}catch(u){console.warn("[htmlBuilder] ensureScrollTopButton failed",u)}}async function ra(t,e,r,i,n,s,a,u,l="eager",o=1,c=void 0){if(!t||!(t instanceof HTMLElement))throw new TypeError("navbarWrap must be an HTMLElement");const h=typeof DOMParser<"u"?new DOMParser:null,f=h?h.parseFromString(r||"","text/html"):null,g=f?f.querySelectorAll("a"):[];await Mt(()=>Xi(g,i)),await Mt(()=>Yi(g,i));let d=null,m=null,w=!1;const k=document.createElement("nav");k.className="navbar",k.setAttribute("role","navigation"),k.setAttribute("aria-label","main navigation");const v=document.createElement("div");v.className="navbar-brand";const N=g[0],E=document.createElement("a");if(E.className="navbar-item",N){const _=N.getAttribute("href")||"#";try{const C=new URL(_,location.href).searchParams.get("page");C?E.href="?page="+encodeURIComponent(decodeURIComponent(C)):(E.href="?page="+encodeURIComponent(n),E.textContent=s("home"))}catch{E.href="?page="+encodeURIComponent(n),E.textContent=s("home")}}else E.href="?page="+encodeURIComponent(n),E.textContent=s("home");v.appendChild(E),E.addEventListener("click",function(_){const M=E.getAttribute("href")||"";if(M.startsWith("?page=")){_.preventDefault();const C=new URL(M,location.href),x=C.searchParams.get("page"),b=C.hash?C.hash.replace(/^#/,""):null;history.pushState({page:x},"","?page="+encodeURIComponent(x)+(b?"#"+encodeURIComponent(b):""));try{a()}catch(R){console.warn("[nimbi-cms] renderByQuery failed",R)}}});const U=document.createElement("a");U.className="navbar-burger",U.setAttribute("role","button"),U.setAttribute("aria-label","menu"),U.setAttribute("aria-expanded","false");const P="nimbi-navbar-menu";U.dataset.target=P,U.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>',v.appendChild(U);try{U.addEventListener("click",_=>{try{const M=U.dataset&&U.dataset.target?U.dataset.target:null,C=M?document.getElementById(M):null;U.classList.contains("is-active")?(U.classList.remove("is-active"),U.setAttribute("aria-expanded","false"),C&&C.classList.remove("is-active")):(U.classList.add("is-active"),U.setAttribute("aria-expanded","true"),C&&C.classList.add("is-active"))}catch(M){console.warn("[nimbi-cms] navbar burger toggle failed",M)}})}catch(_){console.warn("[nimbi-cms] burger event binding failed",_)}const X=document.createElement("div");X.className="navbar-menu",X.id=P;const ee=document.createElement("div");ee.className="navbar-start";let te,se,I;if(!u)te=null,m=null,I=null;else{te=document.createElement("div"),te.className="navbar-end",se=document.createElement("div"),se.className="navbar-item",se.style.position="relative",m=document.createElement("input"),m.className="input",m.type="search",m.placeholder=s("searchPlaceholder")||"",m.id="nimbi-search",l==="eager"&&(m.disabled=!0,m.classList.add("is-loading")),se.appendChild(m),I=document.createElement("div"),I.id="nimbi-search-results",I.className="box",I.style.position="absolute",I.style.top="100%",I.style.right="0",I.style.left="auto",I.style.zIndex="10000",I.style.minWidth="240px",I.style.maxWidth="420px",I.style.maxHeight="50vh",I.style.overflowY="auto",I.style.display="none",I.style.padding="8px",I.style.boxShadow="0 6px 18px rgba(10,10,10,0.1)",se.appendChild(I),te.appendChild(se);const _=C=>{if(I.innerHTML="",!C.length){I.style.display="none";return}C.forEach(x=>{const b=document.createElement("div");if(b.style.marginBottom="6px",b.style.padding="6px",b.style.borderBottom="1px solid rgba(0,0,0,0.06)",x.parentTitle){const y=document.createElement("div");y.textContent=x.parentTitle,y.style.fontSize="11px",y.style.opacity="0.7",y.style.marginBottom="4px",y.className="nimbi-search-parent",y.style.whiteSpace="nowrap",y.style.overflow="hidden",y.style.textOverflow="ellipsis",y.style.display="block",y.style.maxWidth="100%",b.appendChild(y)}const R=document.createElement("a");R.className="block",R.href="?page="+encodeURIComponent(x.slug),R.textContent=x.title,R.style.whiteSpace="nowrap",R.style.overflow="hidden",R.style.textOverflow="ellipsis",R.addEventListener("click",()=>{I.style.display="none"}),b.appendChild(R),I.appendChild(b)}),I.style.display="block",I.style.right="0",I.style.left="auto"},M=(C,x)=>{let b=null;return(...R)=>{b&&clearTimeout(b),b=setTimeout(()=>C(...R),x)}};if(m){const C=M(async()=>{const x=document.querySelector("input#nimbi-search"),b=String(x&&x.value||"").trim().toLowerCase();if(!b){_([]);return}try{const R=await Promise.resolve().then(()=>Ot);d||(d=(async()=>{try{return l==="lazy"&&R.buildSearchIndexWorker?R.buildSearchIndexWorker(i,o,c):R.buildSearchIndex(i,o,c)}catch(G){return console.warn("[nimbi-cms] buildSearchIndex failed",G),[]}finally{x&&(x.removeAttribute("disabled"),x.classList.remove("is-loading"))}})());const z=(await d).filter(G=>G.title&&G.title.toLowerCase().includes(b)||G.excerpt&&G.excerpt.toLowerCase().includes(b));_(z.slice(0,10))}catch(R){console.warn("[nimbi-cms] search input handler failed",R),_([])}},50);m&&m.addEventListener("input",C),document.addEventListener("click",x=>{const b=document.querySelector("input#nimbi-search");b&&!b.contains(x.target)&&I&&!I.contains(x.target)&&(I.style.display="none")})}if(l==="eager"){try{d=(async()=>{try{const x=await(await Promise.resolve().then(()=>Ot)).buildSearchIndex(i,o,c);return w||(w=!0),x}catch(C){return console.warn("[nimbi-cms] buildSearchIndex failed",C),[]}})()}catch(C){console.warn("[nimbi-cms] eager search index init failed",C),d=Promise.resolve([])}d.finally(()=>{const C=document.querySelector("input#nimbi-search");C&&(C.removeAttribute("disabled"),C.classList.remove("is-loading"))})}}for(let _=0;_<g.length;_++){const M=g[_];if(_===0)continue;const C=M.getAttribute("href")||"#",x=document.createElement("a");x.className="navbar-item";try{if(/^[^#]*\.md(?:$|[#?])/.test(C)||C.endsWith(".md")){const R=ue(C).split(/::|#/,2),y=R[0],z=R[1];x.href="?page="+encodeURIComponent(y)+(z?"#"+encodeURIComponent(z):"")}else if(/\.html(?:$|[#?])/.test(C)||C.endsWith(".html")){const R=ue(C).split(/::|#/,2);let y=R[0];y&&!y.toLowerCase().endsWith(".html")&&(y=y+".html");const z=R[1];try{const G=await be(y,i);if(G&&G.raw)try{const Ce=new DOMParser().parseFromString(G.raw,"text/html"),Ee=Ce.querySelector("title"),xe=Ce.querySelector("h1"),me=Ee&&Ee.textContent&&Ee.textContent.trim()?Ee.textContent.trim():xe&&xe.textContent?xe.textContent.trim():null;if(me){const Le=ie(me);if(Le){try{Q.set(Le,y),j.set(y,Le)}catch(He){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",He)}x.href="?page="+encodeURIComponent(Le)+(z?"#"+encodeURIComponent(z):"")}else x.href="?page="+encodeURIComponent(y)+(z?"#"+encodeURIComponent(z):"")}else x.href="?page="+encodeURIComponent(y)+(z?"#"+encodeURIComponent(z):"")}catch{x.href="?page="+encodeURIComponent(y)+(z?"#"+encodeURIComponent(z):"")}else x.href=C}catch{x.href=C}}else x.href=C}catch(b){console.warn("[nimbi-cms] nav item href parse failed",b),x.href=C}try{const b=M.textContent&&String(M.textContent).trim()?String(M.textContent).trim():null;if(b)try{const R=ie(b);if(R){const y=x.getAttribute&&x.getAttribute("href")?x.getAttribute("href"):"";try{const G=new URL(y,location.href).searchParams.get("page");if(G){const ne=decodeURIComponent(G);try{Q.set(R,ne),j.set(ne,R)}catch(Ce){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",Ce)}}}catch(z){console.warn("[nimbi-cms] nav slug mapping failed",z)}}}catch(R){console.warn("[nimbi-cms] nav slug mapping failed",R)}}catch(b){console.warn("[nimbi-cms] nav slug mapping failed",b)}x.textContent=M.textContent||C,ee.appendChild(x)}try{m=document.getElementById("nimbi-search");const _=document.getElementById("nimbi-search-results"),M=x=>{if(_.innerHTML="",!x.length){_.style.display="none";return}x.forEach(b=>{const R=document.createElement("div");if(R.style.marginBottom="6px",R.style.padding="6px",R.style.borderBottom="1px solid rgba(0,0,0,0.06)",b.parentTitle){const z=document.createElement("div");z.textContent=b.parentTitle,z.style.fontSize="11px",z.style.opacity="0.7",z.style.marginBottom="4px",z.className="nimbi-search-parent",z.style.whiteSpace="nowrap",z.style.overflow="hidden",z.style.textOverflow="ellipsis",z.style.display="block",z.style.maxWidth="100%",R.appendChild(z)}const y=document.createElement("a");y.className="block",y.href="?page="+encodeURIComponent(b.slug),y.textContent=b.title,y.style.whiteSpace="nowrap",y.style.overflow="hidden",y.style.textOverflow="ellipsis",y.addEventListener("click",()=>{_.style.display="none"}),R.appendChild(y),_.appendChild(R)}),_.style.display="block",_.style.right="0",_.style.left="auto"},C=(x,b)=>{let R=null;return(...y)=>{R&&clearTimeout(R),R=setTimeout(()=>x(...y),b)}};if(m){const x=C(async()=>{const b=String(m.value||"").trim().toLowerCase();if(!b){M([]);return}try{const R=await Promise.resolve().then(()=>Ot);d||(d=(async()=>{try{return l==="lazy"&&R.buildSearchIndexWorker?R.buildSearchIndexWorker(i,o,c):R.buildSearchIndex(i,o,c)}catch(G){return console.warn("[nimbi-cms] buildSearchIndex failed",G),[]}finally{m&&(m.disabled=!1,m.classList.remove("is-loading"))}})());const z=(await d).filter(G=>G.title&&G.title.toLowerCase().includes(b)||G.excerpt&&G.excerpt.toLowerCase().includes(b));M(z.slice(0,10))}catch(R){console.warn("[nimbi-cms] search input handler failed",R),M([])}},50);m.addEventListener("input",x),document.addEventListener("click",b=>{m&&!m.contains(b.target)&&_&&!_.contains(b.target)&&(_.style.display="none")})}}catch(_){console.warn("[nimbi-cms] navbar/search setup inner failed",_)}X.appendChild(ee),te&&X.appendChild(te),k.appendChild(v),k.appendChild(X),t.appendChild(k);try{X.addEventListener("click",_=>{const M=_.target&&_.target.closest?_.target.closest("a"):null;if(!M)return;const C=M.getAttribute("href")||"";try{const x=new URL(C,location.href),b=x.searchParams.get("page"),R=x.hash?x.hash.replace(/^#/,""):null;if(b){_.preventDefault(),history.pushState({page:b},"","?page="+encodeURIComponent(b)+(R?"#"+encodeURIComponent(R):""));try{a()}catch(y){console.warn("[nimbi-cms] renderByQuery failed",y)}}}catch(x){console.warn("[nimbi-cms] navbar click handler failed",x)}try{const x=k&&k.querySelector?k.querySelector(".navbar-burger"):null,b=x&&x.dataset?x.dataset.target:null,R=b?document.getElementById(b):null;x&&x.classList.contains("is-active")&&(x.classList.remove("is-active"),x.setAttribute("aria-expanded","false"),R&&R.classList.remove("is-active"))}catch(x){console.warn("[nimbi-cms] mobile menu close failed",x)}})}catch(_){console.warn("[nimbi-cms] attach content click handler failed",_)}try{e.addEventListener("click",_=>{const M=_.target&&_.target.closest?_.target.closest("a"):null;if(!M)return;const C=M.getAttribute("href")||"";if(C&&!Jn(C))try{const x=new URL(C,location.href),b=x.searchParams.get("page"),R=x.hash?x.hash.replace(/^#/,""):null;if(b){_.preventDefault(),history.pushState({page:b},"","?page="+encodeURIComponent(b)+(R?"#"+encodeURIComponent(R):""));try{a()}catch(y){console.warn("[nimbi-cms] renderByQuery failed",y)}}}catch(x){console.warn("[nimbi-cms] container click URL parse failed",x)}})}catch(_){console.warn("[nimbi-cms] build navbar failed",_)}return{navbar:k,linkEls:g}}var _n,Hr;function sa(){if(Hr)return _n;Hr=1;function t(s,a){return a.some(([u,l])=>u<=s&&s<=l)}function e(s){if(typeof s!="string")return!1;const a=s.charCodeAt(0);return t(a,[[12352,12447],[19968,40959],[44032,55203],[131072,191456]])}function r(s){return` 
\r	`.includes(s)}function i(s){if(typeof s!="string")return!1;const a=s.charCodeAt(0);return t(a,[[33,47],[58,64],[91,96],[123,126],[12288,12351],[65280,65519]])}function n(s,a={}){let u=0,l=0,o=s.length-1;const c=a.wordsPerMinute||200,h=a.wordBound||r;for(;h(s[l]);)l++;for(;h(s[o]);)o--;const f=`${s}
`;for(let w=l;w<=o;w++)if((e(f[w])||!h(f[w])&&(h(f[w+1])||e(f[w+1])))&&u++,e(f[w]))for(;w<=o&&(i(f[w+1])||h(f[w+1]));)w++;const g=u/c,d=Math.round(g*60*1e3);return{text:Math.ceil(g.toFixed(2))+" min read",minutes:g,time:d,words:u}}return _n=n,_n}var ia=sa();const aa=qn(ia);function qr(t,e){let r=document.querySelector(`meta[name="${t}"]`);r||(r=document.createElement("meta"),r.setAttribute("name",t),document.head.appendChild(r)),r.setAttribute("content",e)}function lt(t,e,r){let i=`meta[${t}="${e}"]`,n=document.querySelector(i);n||(n=document.createElement("meta"),n.setAttribute(t,e),document.head.appendChild(n)),n.setAttribute("content",r)}function la(t,e){try{let r=document.querySelector(`link[rel="${t}"]`);r||(r=document.createElement("link"),r.setAttribute("rel",t),document.head.appendChild(r)),r.setAttribute("href",e)}catch(r){console.warn("[seoManager] upsertLinkRel failed",r)}}function oa(t,e,r,i){const n=e&&String(e).trim()?e:t.title||document.title;lt("property","og:title",n);const s=i&&String(i).trim()?i:t.description||"";s&&String(s).trim()&&lt("property","og:description",s),lt("name","twitter:card",t.twitter_card||"summary_large_image");const a=r||t.image;a&&(lt("property","og:image",a),lt("name","twitter:image",a))}function ca(t,e,r,i,n=""){const s=t.meta||{},a=document&&document.querySelector&&document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",u=i&&String(i).trim()?i:s.description&&String(s.description).trim()?s.description:a&&String(a).trim()?a:"";u&&String(u).trim()&&qr("description",u),qr("robots",s.robots||"index,follow"),oa(s,e,r,u)}function ua(){try{const t=['meta[name="site"]','meta[name="site-name"]','meta[name="siteName"]','meta[property="og:site_name"]','meta[name="twitter:site"]'];for(const e of t){const r=document.querySelector(e);if(r){const i=r.getAttribute("content")||"";if(i&&i.trim())return i.trim()}}}catch(t){console.warn("[seoManager] getSiteNameFromMeta failed",t)}return""}function ha(t,e,r,i,n,s=""){try{const a=t.meta||{},u=r&&String(r).trim()?r:a.title||s||document.title,l=n&&String(n).trim()?n:a.description||document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",o=i||a.image||null;let c="";try{if(e){const d=ue(e);try{c=(location.origin+location.pathname).split("?")[0]+"?page="+encodeURIComponent(d)}catch{c=location.href.split("#")[0]}}else c=location.href.split("#")[0]}catch(d){c=location.href.split("#")[0],console.warn("[seoManager] compute canonical failed",d)}c&&la("canonical",c);try{lt("property","og:url",c)}catch(d){console.warn("[seoManager] upsertMeta og:url failed",d)}const h={"@context":"https://schema.org","@type":"Article",headline:u||"",description:l||"",url:c||location.href.split("#")[0]};o&&(h.image=String(o)),a.date&&(h.datePublished=a.date),a.dateModified&&(h.dateModified=a.dateModified);const f="nimbi-jsonld";let g=document.getElementById(f);g||(g=document.createElement("script"),g.type="application/ld+json",g.id=f,document.head.appendChild(g)),g.textContent=JSON.stringify(h,null,2)}catch(a){console.warn("[seoManager] setStructuredData failed",a)}}function da(t,e,r,i,n,s,a,u,l,o,c){try{const h=i.querySelector(".menu-label");h&&(h.textContent=u&&u.textContent||t("onThisPage"))}catch(h){console.warn("[seoManager] update toc label failed",h)}try{const h=r.meta&&r.meta.title?String(r.meta.title).trim():"",f=n.querySelector("img"),g=f&&(f.getAttribute("src")||f.src)||null;let d="";try{let w="";try{const k=u||(n&&n.querySelector?n.querySelector("h1"):null);if(k){let v=k.nextElementSibling;const N=[];for(;v&&!(v.tagName&&v.tagName.toLowerCase()==="h2");){const E=(v.textContent||"").trim();E&&N.push(E),v=v.nextElementSibling}N.length&&(w=N.join(" ").replace(/\s+/g," ").trim()),!w&&l&&(w=String(l).trim())}}catch(k){console.warn("[seoManager] compute descOverride failed",k)}w&&String(w).length>160&&(w=String(w).slice(0,157).trim()+"..."),d=w}catch(w){console.warn("[seoManager] compute descOverride failed",w)}try{ca(r,l,g,d)}catch(w){console.warn("[seoManager] setMetaTags failed",w)}try{ha(r,o,l,g,d,e)}catch(w){console.warn("[seoManager] setStructuredData failed",w)}const m=ua();l?m?document.title=`${m} - ${l}`:document.title=`${e||"Site"} - ${l}`:h?document.title=h:document.title=e||document.title}catch(h){console.warn("[seoManager] applyPageMeta failed",h)}try{const h=n.querySelector(".nimbi-reading-time");if(h&&h.remove(),l){const f=aa(c.raw||""),g=f&&typeof f.minutes=="number"?Math.ceil(f.minutes):0,d=document.createElement("p");d.className="nimbi-reading-time",d.textContent=g?t("readingTime",{minutes:g}):"";const m=n.querySelector("h1");m&&m.insertAdjacentElement("afterend",d)}}catch(h){console.warn("[seoManager] reading time update failed",h)}}let ye=null,q=null,ke=1,Ge=(t,e)=>e,St=0,vt=0,Wt=()=>{},Et=.25;function pa(){if(ye&&document.contains(ye))return ye;ye=null;const t=document.createElement("dialog");t.className="nimbi-image-preview",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label",Ge("imagePreviewTitle","Image preview")),t.innerHTML=`
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
  `,t.addEventListener("click",b=>{b.target===t&&Mn()}),t.addEventListener("wheel",b=>{if(!se())return;b.preventDefault();const R=b.deltaY<0?Et:-Et;Ue(ke+R),o(),c()},{passive:!1}),t.addEventListener("keydown",b=>{if(b.key==="Escape"){Mn();return}if(ke>1){const R=t.querySelector(".nimbi-image-preview__image-wrapper");if(!R)return;const y=40;switch(b.key){case"ArrowUp":R.scrollTop-=y,b.preventDefault();break;case"ArrowDown":R.scrollTop+=y,b.preventDefault();break;case"ArrowLeft":R.scrollLeft-=y,b.preventDefault();break;case"ArrowRight":R.scrollLeft+=y,b.preventDefault();break}}}),document.body.appendChild(t),ye=t,q=t.querySelector("[data-nimbi-preview-image]");const e=t.querySelector("[data-nimbi-preview-fit]"),r=t.querySelector("[data-nimbi-preview-original]"),i=t.querySelector("[data-nimbi-preview-zoom-in]"),n=t.querySelector("[data-nimbi-preview-zoom-out]"),s=t.querySelector("[data-nimbi-preview-reset]"),a=t.querySelector("[data-nimbi-preview-close]"),u=t.querySelector("[data-nimbi-preview-zoom-label]"),l=t.querySelector("[data-nimbi-preview-zoom-hud]");function o(){u&&(u.textContent=`${Math.round(ke*100)}%`)}const c=()=>{l&&(l.textContent=`${Math.round(ke*100)}%`,l.classList.add("visible"),clearTimeout(l._timeout),l._timeout=setTimeout(()=>l.classList.remove("visible"),800))};Wt=o,i.addEventListener("click",()=>{Ue(ke+Et),o(),c()}),n.addEventListener("click",()=>{Ue(ke-Et),o(),c()}),e.addEventListener("click",()=>{At(),o(),c()}),r.addEventListener("click",()=>{Ue(1),o(),c()}),s.addEventListener("click",()=>{At(),o(),c()}),a.addEventListener("click",Mn),e.title=Ge("imagePreviewFit","Fit to screen"),r.title=Ge("imagePreviewOriginal","Original size"),n.title=Ge("imagePreviewZoomOut","Zoom out"),i.title=Ge("imagePreviewZoomIn","Zoom in"),a.title=Ge("imagePreviewClose","Close"),a.setAttribute("aria-label",Ge("imagePreviewClose","Close"));let h=!1,f=0,g=0,d=0,m=0;const w=new Map;let k=0,v=1;const N=(b,R)=>{const y=b.x-R.x,z=b.y-R.y;return Math.hypot(y,z)},E=()=>{h=!1,w.clear(),k=0,q&&(q.style.cursor="all-scroll")};let U=0,P=0,X=0;const ee=b=>{const R=Date.now(),y=R-U,z=b.clientX-P,G=b.clientY-X;U=R,P=b.clientX,X=b.clientY,y<300&&Math.hypot(z,G)<30&&(Ue(ke>1?1:2),o(),b.preventDefault())},te=b=>{Ue(ke>1?1:2),o(),b.preventDefault()},se=()=>ye?typeof ye.open=="boolean"?ye.open:ye.classList.contains("is-active"):!1,I=(b,R,y=1)=>{if(w.has(y)&&w.set(y,{x:b,y:R}),w.size===2){const Ce=Array.from(w.values()),Ee=N(Ce[0],Ce[1]);if(k>0){const xe=Ee/k;Ue(v*xe)}return}if(!h)return;const z=q.closest(".nimbi-image-preview__image-wrapper");if(!z)return;const G=b-f,ne=R-g;z.scrollLeft=d-G,z.scrollTop=m-ne},_=(b,R,y=1)=>{if(!se())return;if(w.set(y,{x:b,y:R}),w.size===2){const ne=Array.from(w.values());k=N(ne[0],ne[1]),v=ke;return}const z=q.closest(".nimbi-image-preview__image-wrapper");!z||!(z.scrollWidth>z.clientWidth||z.scrollHeight>z.clientHeight)||(h=!0,f=b,g=R,d=z.scrollLeft,m=z.scrollTop,q.style.cursor="all-scroll",window.addEventListener("pointermove",M),window.addEventListener("pointerup",C),window.addEventListener("pointercancel",C))},M=b=>{h&&(b.preventDefault(),I(b.clientX,b.clientY,b.pointerId))},C=()=>{E(),window.removeEventListener("pointermove",M),window.removeEventListener("pointerup",C),window.removeEventListener("pointercancel",C)};q.addEventListener("pointerdown",b=>{b.preventDefault(),_(b.clientX,b.clientY,b.pointerId)}),q.addEventListener("pointermove",b=>{(h||w.size===2)&&b.preventDefault(),I(b.clientX,b.clientY,b.pointerId)}),q.addEventListener("pointerup",b=>{b.preventDefault(),b.pointerType==="touch"&&ee(b),E()}),q.addEventListener("dblclick",te),q.addEventListener("pointercancel",E),q.addEventListener("mousedown",b=>{b.preventDefault(),_(b.clientX,b.clientY,1)}),q.addEventListener("mousemove",b=>{h&&b.preventDefault(),I(b.clientX,b.clientY,1)}),q.addEventListener("mouseup",b=>{b.preventDefault(),E()});const x=t.querySelector(".nimbi-image-preview__image-wrapper");return x&&(x.addEventListener("pointerdown",b=>{_(b.clientX,b.clientY,b.pointerId)}),x.addEventListener("pointermove",b=>{I(b.clientX,b.clientY,b.pointerId)}),x.addEventListener("pointerup",E),x.addEventListener("pointercancel",E),x.addEventListener("mousedown",b=>{_(b.clientX,b.clientY,1)}),x.addEventListener("mousemove",b=>{I(b.clientX,b.clientY,1)}),x.addEventListener("mouseup",E)),t}function Ue(t){if(!q)return;const e=Number(t);ke=Number.isFinite(e)?Math.max(.1,Math.min(4,e)):1;const i=q.getBoundingClientRect(),n=St||q.naturalWidth||q.width||i.width||0,s=vt||q.naturalHeight||q.height||i.height||0;n&&s?(q.style.maxWidth="none",q.style.maxHeight="none",q.style.width=`${n*ke}px`,q.style.height=`${s*ke}px`,q.style.transform=""):(q.style.maxWidth="",q.style.maxHeight="",q.style.width="",q.style.height="",q.style.transform=`scale(${ke})`),q&&(q.style.cursor="all-scroll")}function At(){if(!q)return;const t=q.closest(".nimbi-image-preview__image-wrapper");if(!t)return;const e=t.getBoundingClientRect();if(e.width===0||e.height===0)return;const r=St||q.naturalWidth||e.width,i=vt||q.naturalHeight||e.height;if(!r||!i)return;const n=e.width/r,s=e.height/i,a=Math.min(n,s,1);Ue(Number.isFinite(a)?a:1)}function fa(t,e="",r=0,i=0){const n=pa();ke=1,St=r||0,vt=i||0,q.src=t,q.alt=e,q.style.transform="scale(1)";const s=()=>{St=q.naturalWidth||q.width||0,vt=q.naturalHeight||q.height||0};if(s(),At(),Wt(),requestAnimationFrame(()=>{At(),Wt()}),!St||!vt){const a=()=>{s(),requestAnimationFrame(()=>{At(),Wt()}),q.removeEventListener("load",a)};q.addEventListener("load",a)}typeof n.showModal=="function"&&(n.open||n.showModal()),n.classList.add("is-active"),n.focus()}function Mn(){ye&&(typeof ye.close=="function"&&ye.open&&ye.close(),ye.classList.remove("is-active"))}function ga(t,{t:e,zoomStep:r=.25}={}){if(!t||!t.querySelectorAll)return;Ge=(g,d)=>(typeof e=="function"?e(g):void 0)||d,Et=r,t.addEventListener("click",g=>{const d=g.target;if(!d||d.tagName!=="IMG")return;const m=d;if(m.src){if(g.defaultPrevented!==!0){const w=m.closest("a");w&&w.getAttribute("href")&&g.preventDefault()}fa(m.src,m.alt||"",m.naturalWidth||0,m.naturalHeight||0)}});let i=!1,n=0,s=0,a=0,u=0;const l=new Map;let o=0,c=1;const h=(g,d)=>{const m=g.x-d.x,w=g.y-d.y;return Math.hypot(m,w)};t.addEventListener("pointerdown",g=>{const d=g.target;if(!d||d.tagName!=="IMG"||!ye||!ye.open)return;if(l.set(g.pointerId,{x:g.clientX,y:g.clientY}),l.size===2){const w=Array.from(l.values());o=h(w[0],w[1]),c=ke;return}const m=d.closest(".nimbi-image-preview__image-wrapper");m&&(ke<=1||(g.preventDefault(),i=!0,n=g.clientX,s=g.clientY,a=m.scrollLeft,u=m.scrollTop,d.setPointerCapture(g.pointerId),d.style.cursor="grabbing"))}),t.addEventListener("pointermove",g=>{if(l.has(g.pointerId)&&l.set(g.pointerId,{x:g.clientX,y:g.clientY}),l.size===2){g.preventDefault();const v=Array.from(l.values()),N=h(v[0],v[1]);if(o>0){const E=N/o;Ue(c*E)}return}if(!i)return;g.preventDefault();const m=g.target.closest(".nimbi-image-preview__image-wrapper");if(!m)return;const w=g.clientX-n,k=g.clientY-s;m.scrollLeft=a-w,m.scrollTop=u-k});const f=()=>{i=!1,l.clear(),o=0};t.addEventListener("pointerup",f),t.addEventListener("pointercancel",f)}function ma(t){const{contentWrap:e,navWrap:r,container:i,mountOverlay:n=null,t:s,contentBase:a,homePage:u,initialDocumentTitle:l,runHooks:o}=t||{};if(!e||!(e instanceof HTMLElement))throw new TypeError("contentWrap must be an HTMLElement");let c=null;const h=Wi(s,[{path:u,name:s("home"),isIndex:!0,children:[]}]);async function f(k,v){let N,E,U;try{({data:N,pagePath:E,anchor:U}=await Ys(k,a))}catch(_){console.error("[nimbi-cms] fetchPageData failed",_),Ur(e,s,_);return}!U&&v&&(U=v);try{Ln(null)}catch(_){console.warn("[nimbi-cms] scrollToAnchorOrTop failed",_)}e.innerHTML="";const{article:P,parsed:X,toc:ee,topH1:te,h1Text:se,slugKey:I}=await Ji(s,N,E,U,a);da(s,l,X,ee,P,E,U,te,se,I,N),r.innerHTML="",r.appendChild(ee),ta(ee);try{await o("transformHtml",{article:P,parsed:X,toc:ee,pagePath:E,anchor:U,topH1:te,h1Text:se,slugKey:I,data:N})}catch(_){console.warn("[nimbi-cms] transformHtml hooks failed",_)}e.appendChild(P);try{ga(P,{t:s})}catch(_){console.warn("[nimbi-cms] attachImagePreview failed",_)}try{_t(i,100,!1),requestAnimationFrame(()=>_t(i,100,!1)),setTimeout(()=>_t(i,100,!1),250)}catch(_){console.warn("[nimbi-cms] setEagerForAboveFoldImages failed",_)}Ln(U),na(P,te,{mountOverlay:n,container:i,navWrap:r,t:s});try{await o("onPageLoad",{data:N,pagePath:E,anchor:U,article:P,toc:ee,topH1:te,h1Text:se,slugKey:I,contentWrap:e,navWrap:r})}catch(_){console.warn("[nimbi-cms] onPageLoad hooks failed",_)}c=E}async function g(){let k=new URLSearchParams(location.search).get("page")||u;const v=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;try{await f(k,v)}catch(N){console.warn("[nimbi-cms] renderByQuery failed for",k,N),Ur(e,s,N)}}window.addEventListener("popstate",g);const d=()=>`nimbi-cms-scroll:${location.pathname}${location.search}`,m=()=>{try{const k=i||document.querySelector(".nimbi-cms");if(!k)return;const v={top:k.scrollTop||0,left:k.scrollLeft||0};sessionStorage.setItem(d(),JSON.stringify(v))}catch{}},w=()=>{try{const k=i||document.querySelector(".nimbi-cms");if(!k)return;const v=sessionStorage.getItem(d());if(!v)return;const N=JSON.parse(v);N&&typeof N.top=="number"&&k.scrollTo({top:N.top,left:N.left||0,behavior:"auto"})}catch{}};return window.addEventListener("pageshow",k=>{if(k.persisted)try{w(),_t(i,100,!1)}catch(v){console.warn("[nimbi-cms] bfcache restore failed",v)}}),window.addEventListener("pagehide",()=>{try{m()}catch(k){console.warn("[nimbi-cms] save scroll position failed",k)}}),{renderByQuery:g,siteNav:h,getCurrentPagePath:()=>c}}function wa(t){try{const e=typeof t=="string"?t:typeof window<"u"&&window.location?window.location.search:"";if(!e)return{};const r=new URLSearchParams(e.startsWith("?")?e.slice(1):e),i={},n=s=>{if(s==null)return;const a=String(s).toLowerCase();if(a==="1"||a==="true"||a==="yes")return!0;if(a==="0"||a==="false"||a==="no")return!1};if(r.has("contentPath")&&(i.contentPath=r.get("contentPath")),r.has("searchIndex")){const s=n(r.get("searchIndex"));typeof s=="boolean"&&(i.searchIndex=s)}if(r.has("searchIndexMode")){const s=r.get("searchIndexMode");(s==="eager"||s==="lazy")&&(i.searchIndexMode=s)}if(r.has("defaultStyle")){const s=r.get("defaultStyle");(s==="light"||s==="dark")&&(i.defaultStyle=s)}if(r.has("bulmaCustomize")&&(i.bulmaCustomize=r.get("bulmaCustomize")),r.has("lang")&&(i.lang=r.get("lang")),r.has("l10nFile")){const s=r.get("l10nFile");i.l10nFile=s==="null"?null:s}if(r.has("cacheTtlMinutes")){const s=Number(r.get("cacheTtlMinutes"));Number.isFinite(s)&&s>=0&&(i.cacheTtlMinutes=s)}if(r.has("cacheMaxEntries")){const s=Number(r.get("cacheMaxEntries"));Number.isInteger(s)&&s>=0&&(i.cacheMaxEntries=s)}if(r.has("homePage")&&(i.homePage=r.get("homePage")),r.has("notFoundPage")&&(i.notFoundPage=r.get("notFoundPage")),r.has("availableLanguages")&&(i.availableLanguages=r.get("availableLanguages").split(",").map(s=>s.trim()).filter(Boolean)),r.has("indexDepth")){const s=Number(r.get("indexDepth"));Number.isInteger(s)&&(s===1||s===2)&&(i.indexDepth=s)}if(r.has("noIndexing")){const a=(r.get("noIndexing")||"").split(",").map(u=>u.trim()).filter(Boolean);a.length&&(i.noIndexing=a)}return i}catch{return{}}}function ba(t){return!(typeof t!="string"||!t.trim()||t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))}function jr(t){if(typeof t!="string")return!1;const e=t.trim();return!(!e||e.includes("/")||e.includes("\\")||e.includes("..")||!/^[A-Za-z0-9._-]+\.(md|html)$/.test(e))}let $n="";async function ya(t={}){if(!t||typeof t!="object")throw new TypeError("initCMS(options): options must be an object");const e=wa();if(e&&(e.contentPath||e.homePage||e.notFoundPage))if(t&&t.allowUrlPathOverrides===!0)try{console.warn("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage")}catch(y){console.warn("[nimbi-cms] allowUrlPathOverrides logging failed",y)}else{try{console.warn("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage")}catch(y){console.warn("[nimbi-cms] logging ignore of URL overrides failed",y)}delete e.contentPath,delete e.homePage,delete e.notFoundPage}const r=Object.assign({},e,t),{el:i,contentPath:n="/content",crawlMaxQueue:s=1e3,searchIndex:a=!0,searchIndexMode:u="eager",indexDepth:l=1,noIndexing:o=void 0,defaultStyle:c="light",bulmaCustomize:h="none",lang:f=void 0,l10nFile:g=null,cacheTtlMinutes:d=5,cacheMaxEntries:m,markdownExtensions:w,availableLanguages:k,homePage:v="_home.md",notFoundPage:N="_404.md"}=r;if(r.contentPath!=null&&!ba(r.contentPath))throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');if(r.homePage!=null&&!jr(r.homePage))throw new TypeError('initCMS(options): "homePage" must be a simple basename ending with .md or .html');if(r.notFoundPage!=null&&!jr(r.notFoundPage))throw new TypeError('initCMS(options): "notFoundPage" must be a simple basename ending with .md or .html');if(!i)throw new Error("el is required");let E=i;if(typeof i=="string"){if(E=document.querySelector(i),!E)throw new Error(`el selector "${i}" did not match any element`)}else if(!(i instanceof Element))throw new TypeError("el must be a CSS selector string or a DOM element");if(typeof n!="string"||!n.trim())throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');if(typeof a!="boolean")throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');if(u!=null&&u!=="eager"&&u!=="lazy")throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');if(l!=null&&l!==1&&l!==2)throw new TypeError('initCMS(options): "indexDepth" must be 1 or 2 when provided');if(c!=="light"&&c!=="dark")throw new TypeError('initCMS(options): "defaultStyle" must be "light" or "dark"');if(h!=null&&typeof h!="string")throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');if(f!=null&&typeof f!="string")throw new TypeError('initCMS(options): "lang" must be a string when provided');if(g!=null&&typeof g!="string")throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');if(d!=null&&(typeof d!="number"||!Number.isFinite(d)||d<0))throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');if(m!=null&&(typeof m!="number"||!Number.isInteger(m)||m<0))throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');if(w!=null&&(!Array.isArray(w)||w.some(y=>!y||typeof y!="object")))throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');if(k!=null&&(!Array.isArray(k)||k.some(y=>typeof y!="string"||!y.trim())))throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');if(o!=null&&(!Array.isArray(o)||o.some(y=>typeof y!="string"||!y.trim())))throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');if(v!=null&&(typeof v!="string"||!v.trim()||!/\.(md|html)$/.test(v)))throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');if(N!=null&&(typeof N!="string"||!N.trim()||!/\.(md|html)$/.test(N)))throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');const U=!!a;try{E.classList.add("nimbi-mount"),E.style.position=E.style.position||"relative",E.style.overflow=E.style.overflow||"hidden"}catch(y){console.warn("[nimbi-cms] mount element setup failed",y)}const P=document.createElement("div");P.className="nimbi-cms";try{P.style.position=P.style.position||"relative",P.style.overflow=P.style.overflow||"auto";try{P.style.webkitOverflowScrolling||(P.style.webkitOverflowScrolling="touch")}catch(y){console.warn("[nimbi-cms] set container webkitOverflowScrolling failed",y)}P.style.width=P.style.width||"100%",P.style.height=P.style.height||"100%",P.style.boxSizing=P.style.boxSizing||"border-box"}catch(y){console.warn("[nimbi-cms] container style setup failed",y)}const X=document.createElement("div");X.className="columns";const ee=document.createElement("div");ee.className="column is-full-mobile is-3-tablet nimbi-nav-wrap",ee.setAttribute("role","navigation");try{const y=typeof st=="function"?st("navigation"):null;y&&ee.setAttribute("aria-label",y)}catch(y){console.warn("[nimbi-cms] set nav aria-label failed",y)}X.appendChild(ee);const te=document.createElement("div");te.className="column nimbi-content",te.setAttribute("role","main"),X.appendChild(te),P.appendChild(X);const se=ee,I=te;E.appendChild(P);let _=null;try{_=E.querySelector(".nimbi-overlay"),_||(_=document.createElement("div"),_.className="nimbi-overlay",E.appendChild(_))}catch(y){_=null,console.warn("[nimbi-cms] mount overlay setup failed",y)}const M=location.pathname||"/",C=M.endsWith("/")?M:M.substring(0,M.lastIndexOf("/")+1);try{$n=document.title||""}catch(y){$n="",console.warn("[nimbi-cms] read initial document title failed",y)}let x=n;(x==="."||x==="./")&&(x=""),x.startsWith("./")&&(x=x.slice(2)),x.startsWith("/")&&(x=x.slice(1)),x!==""&&!x.endsWith("/")&&(x=x+"/");const b=new URL(C+x,location.origin).toString();try{dn&&dn(v)}catch{}g&&await an(g,C),k&&Array.isArray(k)&&er(k),f&&ln(f);const R=ma({contentWrap:I,navWrap:se,container:P,mountOverlay:_,t:st,contentBase:b,homePage:v,initialDocumentTitle:$n,runHooks:Jt});if(typeof d=="number"&&d>=0&&typeof ur=="function"&&ur(d*60*1e3),typeof m=="number"&&m>=0&&typeof cr=="function"&&cr(m),w&&Array.isArray(w)&&w.length)try{w.forEach(y=>{typeof y=="object"&&Fi&&typeof An=="function"&&An(y)})}catch(y){console.warn("[nimbi-cms] applying markdownExtensions failed",y)}try{typeof s=="number"&&Promise.resolve().then(()=>Ot).then(({setDefaultCrawlMaxQueue:y})=>{try{y(s)}catch(z){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed",z)}})}catch(y){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed",y)}try{It(b)}catch(y){console.warn("[nimbi-cms] setContentBase failed",y)}try{hn(N)}catch(y){console.warn("[nimbi-cms] setNotFoundPage failed",y)}try{It(b)}catch(y){console.warn("[nimbi-cms] setContentBase failed",y)}try{hn(N)}catch(y){console.warn("[nimbi-cms] setNotFoundPage failed",y)}try{await be(v,b)}catch(y){throw v==="_home.md"?new Error("Required _home.md not found"):new Error(`Required ${v} not found at ${b}${v}: ${y.message}`)}Qn(c),await Zn(h,C);try{const y=document.createElement("header");y.className="nimbi-site-navbar",E.insertBefore(y,P);const z=await be("_navigation.md",b),G=await Ft(z.raw||""),{navbar:ne,linkEls:Ce}=await ra(y,P,G.html||"",b,v,st,R.renderByQuery,U,u,l,o);try{await Jt("onNavBuild",{navWrap:se,navbar:ne,linkEls:Ce,contentBase:b})}catch(Ee){console.warn("[nimbi-cms] onNavBuild hooks failed",Ee)}try{const Ee=()=>{const xe=y&&y.getBoundingClientRect&&Math.round(y.getBoundingClientRect().height)||y&&y.offsetHeight||0;if(xe>0){try{E.style.setProperty("--nimbi-site-navbar-height",`${xe}px`)}catch(me){console.warn("[nimbi-cms] set CSS var failed",me)}try{P.style.paddingTop=""}catch(me){console.warn("[nimbi-cms] set container paddingTop failed",me)}try{const me=E&&E.getBoundingClientRect&&Math.round(E.getBoundingClientRect().height)||E&&E.clientHeight||0;if(me>0){const Le=Math.max(0,me-xe);try{P.style.boxSizing="border-box"}catch(He){console.warn("[nimbi-cms] set container boxSizing failed",He)}try{P.style.height=`${Le}px`}catch(He){console.warn("[nimbi-cms] set container height failed",He)}try{P.style.setProperty("--nimbi-cms-height",`${Le}px`)}catch(He){console.warn("[nimbi-cms] set --nimbi-cms-height failed",He)}}else{try{P.style.height="calc(100% - var(--nimbi-site-navbar-height))"}catch(Le){console.warn("[nimbi-cms] set container height failed",Le)}try{P.style.setProperty("--nimbi-cms-height","calc(100% - var(--nimbi-site-navbar-height))")}catch(Le){console.warn("[nimbi-cms] set --nimbi-cms-height failed",Le)}}}catch(me){console.warn("[nimbi-cms] compute container height failed",me)}try{y.style.setProperty("--nimbi-site-navbar-height",`${xe}px`)}catch(me){console.warn("[nimbi-cms] set navbar CSS var failed",me)}}};Ee();try{if(typeof ResizeObserver<"u"){const xe=new ResizeObserver(()=>Ee());try{xe.observe(y)}catch(me){console.warn("[nimbi-cms] ResizeObserver.observe failed",me)}}}catch(xe){console.warn("[nimbi-cms] ResizeObserver setup failed",xe)}}catch(Ee){console.warn("[nimbi-cms] compute navbar height failed",Ee)}}catch(y){console.warn("[nimbi-cms] build navigation failed",y)}await R.renderByQuery();try{Promise.resolve().then(()=>ka).then(({getVersion:y})=>{typeof y=="function"&&y().then(z=>{try{const G=z||"0.0.0",ne=document.createElement("div");ne.className="nimbi-version-label",ne.textContent=`Ninbi CMS v. ${G}`,ne.style.position="absolute",ne.style.left="8px",ne.style.bottom="6px",ne.style.fontSize="11px",ne.style.opacity="0.6",ne.style.pointerEvents="none",ne.style.zIndex="9999",ne.style.userSelect="none";try{E.appendChild(ne)}catch(Ce){console.warn("[nimbi-cms] append version label failed",Ce)}}catch(G){console.warn("[nimbi-cms] building version label failed",G)}}).catch(z=>{console.warn("[nimbi-cms] getVersion() failed",z)})}).catch(y=>{console.warn("[nimbi-cms] import version module failed",y)})}catch(y){console.warn("[nimbi-cms] version label setup failed",y)}}async function Fr(){try{let t=null;try{t=await Promise.resolve().then(()=>ns)}catch{try{t=await Promise.resolve().then(()=>ns)}catch{t=null}}const e=t?.default?.version||t?.version;return typeof e=="string"&&e.trim()?e:"0.0.0"}catch{return"0.0.0"}}const ka=Object.freeze(Object.defineProperty({__proto__:null,getVersion:Fr},Symbol.toStringTag,{value:"Module"})),Wr="nimbi-cms",Zr="0.1.0",Qr="module",Gr={dev:"vite","dev:example":'sh -c "npm run build -- --outDir example/dist --config vite.config.js && vite example --port 5173 &"',build:"vite build --config vite.config.js","build:lib":"vite build --config vite.config.js","build:analyze":"ANALYZE=1 vite build --config vite.config.js",preview:"vite preview",test:"npx vitest run","gen-dts":"node scripts/gen-dts.js","check-dts":"npx tsc --noEmit src/index.d.ts --lib es2015,dom --skipLibCheck","type-test":"npx tsd",docs:"typedoc --options typedoc.json"},Xr={bulma:"^1.0.4","highlight.js":"^11.11.1",marked:"^17.0.4"},Yr={"@vitest/coverage-v8":"^4.0.18","comment-parser":"^0.7.6",eslint:"^10.0.3","eslint-plugin-unused-imports":"^4.4.1",glob:"^10.4.1",jsdom:"^28.1.0","reading-time":"^1.5.0",terser:"^5.17.0",typedoc:"^0.28.17",typescript:"^5.9.3",tsd:"^0.33.0",vite:"^7.3.1","rollup-plugin-visualizer":"^5.8.0","vite-plugin-restart":"^2.0.0",vitest:"^4.0.18"},Kr="dist/nimbi-cms.cjs.js",Vr="dist/nimbi-cms.es.js",Jr="src/index.d.ts",es="dist/nimbi-cms.js",ts=["dist","src/index.d.ts"],ns=Object.freeze(Object.defineProperty({__proto__:null,default:{name:Wr,version:Zr,private:!0,type:Qr,scripts:Gr,dependencies:Xr,devDependencies:Yr,main:Kr,module:Vr,types:Jr,unpkg:es,files:ts},dependencies:Xr,devDependencies:Yr,files:ts,main:Kr,module:Vr,name:Wr,scripts:Gr,type:Qr,types:Jr,unpkg:es,version:Zr},Symbol.toStringTag,{value:"Module"}));oe.BAD_LANGUAGES=tn,oe.SUPPORTED_HLJS_MAP=Y,oe._clearHooks=Ss,oe.addHook=Tt,oe.default=ya,oe.ensureBulma=Zn,oe.getVersion=Fr,oe.loadL10nFile=an,oe.loadSupportedLanguages=nn,oe.observeCodeBlocks=Wn,oe.onNavBuild=ks,oe.onPageLoad=ys,oe.registerLanguage=nt,oe.runHooks=Jt,oe.setHighlightTheme=Ts,oe.setLang=ln,oe.setStyle=Qn,oe.setThemeVars=Ls,oe.t=st,oe.transformHtml=xs,Object.defineProperties(oe,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})}));
