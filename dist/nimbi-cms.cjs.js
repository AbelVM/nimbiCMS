"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const Rt={onPageLoad:[],onNavBuild:[],transformHtml:[]};function tn(e,t){if(!Object.prototype.hasOwnProperty.call(Rt,e))throw new Error('Unknown hook "'+e+'"');if(typeof t!="function")throw new TypeError("hook callback must be a function");Rt[e].push(t)}function bs(e){tn("onPageLoad",e)}function ys(e){tn("onNavBuild",e)}function ks(e){tn("transformHtml",e)}async function xn(e,t){const n=Rt[e]||[];for(const s of n)try{await s(t)}catch(r){console.warn("[nimbi-cms] runHooks callback failed",r)}}function xs(){Object.keys(Rt).forEach(e=>{Rt[e].length=0})}function Ir(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var pn,hr;function Ss(){if(hr)return pn;hr=1;function e(m){return m instanceof Map?m.clear=m.delete=m.set=function(){throw new Error("map is read-only")}:m instanceof Set&&(m.add=m.clear=m.delete=function(){throw new Error("set is read-only")}),Object.freeze(m),Object.getOwnPropertyNames(m).forEach(S=>{const T=m[S],Q=typeof T;(Q==="object"||Q==="function")&&!Object.isFrozen(T)&&e(T)}),m}class t{constructor(S){S.data===void 0&&(S.data={}),this.data=S.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function n(m){return m.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function s(m,...S){const T=Object.create(null);for(const Q in m)T[Q]=m[Q];return S.forEach(function(Q){for(const ge in Q)T[ge]=Q[ge]}),T}const r="</span>",i=m=>!!m.scope,a=(m,{prefix:S})=>{if(m.startsWith("language:"))return m.replace("language:","language-");if(m.includes(".")){const T=m.split(".");return[`${S}${T.shift()}`,...T.map((Q,ge)=>`${Q}${"_".repeat(ge+1)}`)].join(" ")}return`${S}${m}`};class l{constructor(S,T){this.buffer="",this.classPrefix=T.classPrefix,S.walk(this)}addText(S){this.buffer+=n(S)}openNode(S){if(!i(S))return;const T=a(S.scope,{prefix:this.classPrefix});this.span(T)}closeNode(S){i(S)&&(this.buffer+=r)}value(){return this.buffer}span(S){this.buffer+=`<span class="${S}">`}}const o=(m={})=>{const S={children:[]};return Object.assign(S,m),S};class u{constructor(){this.rootNode=o(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(S){this.top.children.push(S)}openNode(S){const T=o({scope:S});this.add(T),this.stack.push(T)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(S){return this.constructor._walk(S,this.rootNode)}static _walk(S,T){return typeof T=="string"?S.addText(T):T.children&&(S.openNode(T),T.children.forEach(Q=>this._walk(S,Q)),S.closeNode(T)),S}static _collapse(S){typeof S!="string"&&S.children&&(S.children.every(T=>typeof T=="string")?S.children=[S.children.join("")]:S.children.forEach(T=>{u._collapse(T)}))}}class c extends u{constructor(S){super(),this.options=S}addText(S){S!==""&&this.add(S)}startScope(S){this.openNode(S)}endScope(){this.closeNode()}__addSublanguage(S,T){const Q=S.root;T&&(Q.scope=`language:${T}`),this.add(Q)}toHTML(){return new l(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function h(m){return m?typeof m=="string"?m:m.source:null}function f(m){return g("(?=",m,")")}function p(m){return g("(?:",m,")*")}function d(m){return g("(?:",m,")?")}function g(...m){return m.map(T=>h(T)).join("")}function w(m){const S=m[m.length-1];return typeof S=="object"&&S.constructor===Object?(m.splice(m.length-1,1),S):{}}function y(...m){return"("+(w(m).capture?"":"?:")+m.map(Q=>h(Q)).join("|")+")"}function x(m){return new RegExp(m.toString()+"|").exec("").length-1}function $(m,S){const T=m&&m.exec(S);return T&&T.index===0}const M=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function _(m,{joinWith:S}){let T=0;return m.map(Q=>{T+=1;const ge=T;let me=h(Q),z="";for(;me.length>0;){const P=M.exec(me);if(!P){z+=me;break}z+=me.substring(0,P.index),me=me.substring(P.index+P[0].length),P[0][0]==="\\"&&P[1]?z+="\\"+String(Number(P[1])+ge):(z+=P[0],P[0]==="("&&T++)}return z}).map(Q=>`(${Q})`).join(S)}const I=/\b\B/,H="[a-zA-Z]\\w*",K="[a-zA-Z_]\\w*",ae="\\b\\d+(\\.\\d+)?",W="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",U="\\b(0b[01]+)",Z="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",Y=(m={})=>{const S=/^#![ ]*\//;return m.binary&&(m.begin=g(S,/.*\b/,m.binary,/\b.*/)),s({scope:"meta",begin:S,end:/$/,relevance:0,"on:begin":(T,Q)=>{T.index!==0&&Q.ignoreMatch()}},m)},J={begin:"\\\\[\\s\\S]",relevance:0},F={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[J]},k={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[J]},v={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},R=function(m,S,T={}){const Q=s({scope:"comment",begin:m,end:S,contains:[]},T);Q.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const ge=y("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return Q.contains.push({begin:g(/[ ]+/,"(",ge,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),Q},E=R("//","$"),b=R("/\\*","\\*/"),L=R("#","$"),N={scope:"number",begin:ae,relevance:0},G={scope:"number",begin:W,relevance:0},ee={scope:"number",begin:U,relevance:0},re={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[J,{begin:/\[/,end:/\]/,relevance:0,contains:[J]}]},ue={scope:"title",begin:H,relevance:0},we={scope:"title",begin:K,relevance:0},ze={begin:"\\.\\s*"+K,relevance:0};var Ke=Object.freeze({__proto__:null,APOS_STRING_MODE:F,BACKSLASH_ESCAPE:J,BINARY_NUMBER_MODE:ee,BINARY_NUMBER_RE:U,COMMENT:R,C_BLOCK_COMMENT_MODE:b,C_LINE_COMMENT_MODE:E,C_NUMBER_MODE:G,C_NUMBER_RE:W,END_SAME_AS_BEGIN:function(m){return Object.assign(m,{"on:begin":(S,T)=>{T.data._beginMatch=S[1]},"on:end":(S,T)=>{T.data._beginMatch!==S[1]&&T.ignoreMatch()}})},HASH_COMMENT_MODE:L,IDENT_RE:H,MATCH_NOTHING_RE:I,METHOD_GUARD:ze,NUMBER_MODE:N,NUMBER_RE:ae,PHRASAL_WORDS_MODE:v,QUOTE_STRING_MODE:k,REGEXP_MODE:re,RE_STARTERS_RE:Z,SHEBANG:Y,TITLE_MODE:ue,UNDERSCORE_IDENT_RE:K,UNDERSCORE_TITLE_MODE:we});function rt(m,S){m.input[m.index-1]==="."&&S.ignoreMatch()}function an(m,S){m.className!==void 0&&(m.scope=m.className,delete m.className)}function Bi(m,S){S&&m.beginKeywords&&(m.begin="\\b("+m.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",m.__beforeBegin=rt,m.keywords=m.keywords||m.beginKeywords,delete m.beginKeywords,m.relevance===void 0&&(m.relevance=0))}function Ni(m,S){Array.isArray(m.illegal)&&(m.illegal=y(...m.illegal))}function Oi(m,S){if(m.match){if(m.begin||m.end)throw new Error("begin & end are not supported with match");m.begin=m.match,delete m.match}}function Di(m,S){m.relevance===void 0&&(m.relevance=1)}const qi=(m,S)=>{if(!m.beforeMatch)return;if(m.starts)throw new Error("beforeMatch cannot be used with starts");const T=Object.assign({},m);Object.keys(m).forEach(Q=>{delete m[Q]}),m.keywords=T.keywords,m.begin=g(T.beforeMatch,f(T.begin)),m.starts={relevance:0,contains:[Object.assign(T,{endsParent:!0})]},m.relevance=0,delete T.beforeMatch},Ui=["of","and","for","in","not","or","if","then","parent","list","value"],Hi="keyword";function Xn(m,S,T=Hi){const Q=Object.create(null);return typeof m=="string"?ge(T,m.split(" ")):Array.isArray(m)?ge(T,m):Object.keys(m).forEach(function(me){Object.assign(Q,Xn(m[me],S,me))}),Q;function ge(me,z){S&&(z=z.map(P=>P.toLowerCase())),z.forEach(function(P){const j=P.split("|");Q[j[0]]=[me,ji(j[0],j[1])]})}}function ji(m,S){return S?Number(S):Fi(m)?0:1}function Fi(m){return Ui.includes(m.toLowerCase())}const Kn={},Ye=m=>{console.error(m)},Yn=(m,...S)=>{console.log(`WARN: ${m}`,...S)},it=(m,S)=>{Kn[`${m}/${S}`]||(console.log(`Deprecated as of ${m}. ${S}`),Kn[`${m}/${S}`]=!0)},Pt=new Error;function Vn(m,S,{key:T}){let Q=0;const ge=m[T],me={},z={};for(let P=1;P<=S.length;P++)z[P+Q]=ge[P],me[P+Q]=!0,Q+=x(S[P-1]);m[T]=z,m[T]._emit=me,m[T]._multi=!0}function Wi(m){if(Array.isArray(m.begin)){if(m.skip||m.excludeBegin||m.returnBegin)throw Ye("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),Pt;if(typeof m.beginScope!="object"||m.beginScope===null)throw Ye("beginScope must be object"),Pt;Vn(m,m.begin,{key:"beginScope"}),m.begin=_(m.begin,{joinWith:""})}}function Zi(m){if(Array.isArray(m.end)){if(m.skip||m.excludeEnd||m.returnEnd)throw Ye("skip, excludeEnd, returnEnd not compatible with endScope: {}"),Pt;if(typeof m.endScope!="object"||m.endScope===null)throw Ye("endScope must be object"),Pt;Vn(m,m.end,{key:"endScope"}),m.end=_(m.end,{joinWith:""})}}function Gi(m){m.scope&&typeof m.scope=="object"&&m.scope!==null&&(m.beginScope=m.scope,delete m.scope)}function Qi(m){Gi(m),typeof m.beginScope=="string"&&(m.beginScope={_wrap:m.beginScope}),typeof m.endScope=="string"&&(m.endScope={_wrap:m.endScope}),Wi(m),Zi(m)}function Xi(m){function S(z,P){return new RegExp(h(z),"m"+(m.case_insensitive?"i":"")+(m.unicodeRegex?"u":"")+(P?"g":""))}class T{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(P,j){j.position=this.position++,this.matchIndexes[this.matchAt]=j,this.regexes.push([j,P]),this.matchAt+=x(P)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const P=this.regexes.map(j=>j[1]);this.matcherRe=S(_(P,{joinWith:"|"}),!0),this.lastIndex=0}exec(P){this.matcherRe.lastIndex=this.lastIndex;const j=this.matcherRe.exec(P);if(!j)return null;const xe=j.findIndex((dt,ln)=>ln>0&&dt!==void 0),be=this.matchIndexes[xe];return j.splice(0,xe),Object.assign(j,be)}}class Q{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(P){if(this.multiRegexes[P])return this.multiRegexes[P];const j=new T;return this.rules.slice(P).forEach(([xe,be])=>j.addRule(xe,be)),j.compile(),this.multiRegexes[P]=j,j}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(P,j){this.rules.push([P,j]),j.type==="begin"&&this.count++}exec(P){const j=this.getMatcher(this.regexIndex);j.lastIndex=this.lastIndex;let xe=j.exec(P);if(this.resumingScanAtSamePosition()&&!(xe&&xe.index===this.lastIndex)){const be=this.getMatcher(0);be.lastIndex=this.lastIndex+1,xe=be.exec(P)}return xe&&(this.regexIndex+=xe.position+1,this.regexIndex===this.count&&this.considerAll()),xe}}function ge(z){const P=new Q;return z.contains.forEach(j=>P.addRule(j.begin,{rule:j,type:"begin"})),z.terminatorEnd&&P.addRule(z.terminatorEnd,{type:"end"}),z.illegal&&P.addRule(z.illegal,{type:"illegal"}),P}function me(z,P){const j=z;if(z.isCompiled)return j;[an,Oi,Qi,qi].forEach(be=>be(z,P)),m.compilerExtensions.forEach(be=>be(z,P)),z.__beforeBegin=null,[Bi,Ni,Di].forEach(be=>be(z,P)),z.isCompiled=!0;let xe=null;return typeof z.keywords=="object"&&z.keywords.$pattern&&(z.keywords=Object.assign({},z.keywords),xe=z.keywords.$pattern,delete z.keywords.$pattern),xe=xe||/\w+/,z.keywords&&(z.keywords=Xn(z.keywords,m.case_insensitive)),j.keywordPatternRe=S(xe,!0),P&&(z.begin||(z.begin=/\B|\b/),j.beginRe=S(j.begin),!z.end&&!z.endsWithParent&&(z.end=/\B|\b/),z.end&&(j.endRe=S(j.end)),j.terminatorEnd=h(j.end)||"",z.endsWithParent&&P.terminatorEnd&&(j.terminatorEnd+=(z.end?"|":"")+P.terminatorEnd)),z.illegal&&(j.illegalRe=S(z.illegal)),z.contains||(z.contains=[]),z.contains=[].concat(...z.contains.map(function(be){return Ki(be==="self"?z:be)})),z.contains.forEach(function(be){me(be,j)}),z.starts&&me(z.starts,P),j.matcher=ge(j),j}if(m.compilerExtensions||(m.compilerExtensions=[]),m.contains&&m.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return m.classNameAliases=s(m.classNameAliases||{}),me(m)}function Jn(m){return m?m.endsWithParent||Jn(m.starts):!1}function Ki(m){return m.variants&&!m.cachedVariants&&(m.cachedVariants=m.variants.map(function(S){return s(m,{variants:null},S)})),m.cachedVariants?m.cachedVariants:Jn(m)?s(m,{starts:m.starts?s(m.starts):null}):Object.isFrozen(m)?s(m):m}var Yi="11.11.1";class Vi extends Error{constructor(S,T){super(S),this.name="HTMLInjectionError",this.html=T}}const on=n,er=s,tr=Symbol("nomatch"),Ji=7,nr=function(m){const S=Object.create(null),T=Object.create(null),Q=[];let ge=!0;const me="Could not find the language '{}', did you forget to load/include a language module?",z={disableAutodetect:!0,name:"Plain text",contains:[]};let P={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:c};function j(A){return P.noHighlightRe.test(A)}function xe(A){let O=A.className+" ";O+=A.parentNode?A.parentNode.className:"";const ie=P.languageDetectRe.exec(O);if(ie){const he=je(ie[1]);return he||(Yn(me.replace("{}",ie[1])),Yn("Falling back to no-highlight mode for this block.",A)),he?ie[1]:"no-highlight"}return O.split(/\s+/).find(he=>j(he)||je(he))}function be(A,O,ie){let he="",ye="";typeof O=="object"?(he=A,ie=O.ignoreIllegals,ye=O.language):(it("10.7.0","highlight(lang, code, ...args) has been deprecated."),it("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),ye=A,he=O),ie===void 0&&(ie=!0);const $e={code:he,language:ye};zt("before:highlight",$e);const Fe=$e.result?$e.result:dt($e.language,$e.code,ie);return Fe.code=$e.code,zt("after:highlight",Fe),Fe}function dt(A,O,ie,he){const ye=Object.create(null);function $e(C,B){return C.keywords[B]}function Fe(){if(!X.keywords){ve.addText(de);return}let C=0;X.keywordPatternRe.lastIndex=0;let B=X.keywordPatternRe.exec(de),V="";for(;B;){V+=de.substring(C,B.index);const ce=Ne.case_insensitive?B[0].toLowerCase():B[0],Ee=$e(X,ce);if(Ee){const[qe,ms]=Ee;if(ve.addText(V),V="",ye[ce]=(ye[ce]||0)+1,ye[ce]<=Ji&&(Ot+=ms),qe.startsWith("_"))V+=B[0];else{const ws=Ne.classNameAliases[qe]||qe;Be(B[0],ws)}}else V+=B[0];C=X.keywordPatternRe.lastIndex,B=X.keywordPatternRe.exec(de)}V+=de.substring(C),ve.addText(V)}function Bt(){if(de==="")return;let C=null;if(typeof X.subLanguage=="string"){if(!S[X.subLanguage]){ve.addText(de);return}C=dt(X.subLanguage,de,!0,ur[X.subLanguage]),ur[X.subLanguage]=C._top}else C=cn(de,X.subLanguage.length?X.subLanguage:null);X.relevance>0&&(Ot+=C.relevance),ve.__addSublanguage(C._emitter,C.language)}function Le(){X.subLanguage!=null?Bt():Fe(),de=""}function Be(C,B){C!==""&&(ve.startScope(B),ve.addText(C),ve.endScope())}function ar(C,B){let V=1;const ce=B.length-1;for(;V<=ce;){if(!C._emit[V]){V++;continue}const Ee=Ne.classNameAliases[C[V]]||C[V],qe=B[V];Ee?Be(qe,Ee):(de=qe,Fe(),de=""),V++}}function or(C,B){return C.scope&&typeof C.scope=="string"&&ve.openNode(Ne.classNameAliases[C.scope]||C.scope),C.beginScope&&(C.beginScope._wrap?(Be(de,Ne.classNameAliases[C.beginScope._wrap]||C.beginScope._wrap),de=""):C.beginScope._multi&&(ar(C.beginScope,B),de="")),X=Object.create(C,{parent:{value:X}}),X}function lr(C,B,V){let ce=$(C.endRe,V);if(ce){if(C["on:end"]){const Ee=new t(C);C["on:end"](B,Ee),Ee.isMatchIgnored&&(ce=!1)}if(ce){for(;C.endsParent&&C.parent;)C=C.parent;return C}}if(C.endsWithParent)return lr(C.parent,B,V)}function hs(C){return X.matcher.regexIndex===0?(de+=C[0],1):(fn=!0,0)}function ds(C){const B=C[0],V=C.rule,ce=new t(V),Ee=[V.__beforeBegin,V["on:begin"]];for(const qe of Ee)if(qe&&(qe(C,ce),ce.isMatchIgnored))return hs(B);return V.skip?de+=B:(V.excludeBegin&&(de+=B),Le(),!V.returnBegin&&!V.excludeBegin&&(de=B)),or(V,C),V.returnBegin?0:B.length}function fs(C){const B=C[0],V=O.substring(C.index),ce=lr(X,C,V);if(!ce)return tr;const Ee=X;X.endScope&&X.endScope._wrap?(Le(),Be(B,X.endScope._wrap)):X.endScope&&X.endScope._multi?(Le(),ar(X.endScope,C)):Ee.skip?de+=B:(Ee.returnEnd||Ee.excludeEnd||(de+=B),Le(),Ee.excludeEnd&&(de=B));do X.scope&&ve.closeNode(),!X.skip&&!X.subLanguage&&(Ot+=X.relevance),X=X.parent;while(X!==ce.parent);return ce.starts&&or(ce.starts,C),Ee.returnEnd?0:B.length}function ps(){const C=[];for(let B=X;B!==Ne;B=B.parent)B.scope&&C.unshift(B.scope);C.forEach(B=>ve.openNode(B))}let Nt={};function cr(C,B){const V=B&&B[0];if(de+=C,V==null)return Le(),0;if(Nt.type==="begin"&&B.type==="end"&&Nt.index===B.index&&V===""){if(de+=O.slice(B.index,B.index+1),!ge){const ce=new Error(`0 width match regex (${A})`);throw ce.languageName=A,ce.badRule=Nt.rule,ce}return 1}if(Nt=B,B.type==="begin")return ds(B);if(B.type==="illegal"&&!ie){const ce=new Error('Illegal lexeme "'+V+'" for mode "'+(X.scope||"<unnamed>")+'"');throw ce.mode=X,ce}else if(B.type==="end"){const ce=fs(B);if(ce!==tr)return ce}if(B.type==="illegal"&&V==="")return de+=`
`,1;if(dn>1e5&&dn>B.index*3)throw new Error("potential infinite loop, way more iterations than matches");return de+=V,V.length}const Ne=je(A);if(!Ne)throw Ye(me.replace("{}",A)),new Error('Unknown language: "'+A+'"');const gs=Xi(Ne);let hn="",X=he||gs;const ur={},ve=new P.__emitter(P);ps();let de="",Ot=0,Ve=0,dn=0,fn=!1;try{if(Ne.__emitTokens)Ne.__emitTokens(O,ve);else{for(X.matcher.considerAll();;){dn++,fn?fn=!1:X.matcher.considerAll(),X.matcher.lastIndex=Ve;const C=X.matcher.exec(O);if(!C)break;const B=O.substring(Ve,C.index),V=cr(B,C);Ve=C.index+V}cr(O.substring(Ve))}return ve.finalize(),hn=ve.toHTML(),{language:A,value:hn,relevance:Ot,illegal:!1,_emitter:ve,_top:X}}catch(C){if(C.message&&C.message.includes("Illegal"))return{language:A,value:on(O),illegal:!0,relevance:0,_illegalBy:{message:C.message,index:Ve,context:O.slice(Ve-100,Ve+100),mode:C.mode,resultSoFar:hn},_emitter:ve};if(ge)return{language:A,value:on(O),illegal:!1,relevance:0,errorRaised:C,_emitter:ve,_top:X};throw C}}function ln(A){const O={value:on(A),illegal:!1,relevance:0,_top:z,_emitter:new P.__emitter(P)};return O._emitter.addText(A),O}function cn(A,O){O=O||P.languages||Object.keys(S);const ie=ln(A),he=O.filter(je).filter(sr).map(Le=>dt(Le,A,!1));he.unshift(ie);const ye=he.sort((Le,Be)=>{if(Le.relevance!==Be.relevance)return Be.relevance-Le.relevance;if(Le.language&&Be.language){if(je(Le.language).supersetOf===Be.language)return 1;if(je(Be.language).supersetOf===Le.language)return-1}return 0}),[$e,Fe]=ye,Bt=$e;return Bt.secondBest=Fe,Bt}function es(A,O,ie){const he=O&&T[O]||ie;A.classList.add("hljs"),A.classList.add(`language-${he}`)}function un(A){let O=null;const ie=xe(A);if(j(ie))return;if(zt("before:highlightElement",{el:A,language:ie}),A.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",A);return}if(A.children.length>0&&(P.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(A)),P.throwUnescapedHTML))throw new Vi("One of your code blocks includes unescaped HTML.",A.innerHTML);O=A;const he=O.textContent,ye=ie?be(he,{language:ie,ignoreIllegals:!0}):cn(he);A.innerHTML=ye.value,A.dataset.highlighted="yes",es(A,ie,ye.language),A.result={language:ye.language,re:ye.relevance,relevance:ye.relevance},ye.secondBest&&(A.secondBest={language:ye.secondBest.language,relevance:ye.secondBest.relevance}),zt("after:highlightElement",{el:A,result:ye,text:he})}function ts(A){P=er(P,A)}const ns=()=>{It(),it("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function rs(){It(),it("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let rr=!1;function It(){function A(){It()}if(document.readyState==="loading"){rr||window.addEventListener("DOMContentLoaded",A,!1),rr=!0;return}document.querySelectorAll(P.cssSelector).forEach(un)}function is(A,O){let ie=null;try{ie=O(m)}catch(he){if(Ye("Language definition for '{}' could not be registered.".replace("{}",A)),ge)Ye(he);else throw he;ie=z}ie.name||(ie.name=A),S[A]=ie,ie.rawDefinition=O.bind(null,m),ie.aliases&&ir(ie.aliases,{languageName:A})}function ss(A){delete S[A];for(const O of Object.keys(T))T[O]===A&&delete T[O]}function as(){return Object.keys(S)}function je(A){return A=(A||"").toLowerCase(),S[A]||S[T[A]]}function ir(A,{languageName:O}){typeof A=="string"&&(A=[A]),A.forEach(ie=>{T[ie.toLowerCase()]=O})}function sr(A){const O=je(A);return O&&!O.disableAutodetect}function os(A){A["before:highlightBlock"]&&!A["before:highlightElement"]&&(A["before:highlightElement"]=O=>{A["before:highlightBlock"](Object.assign({block:O.el},O))}),A["after:highlightBlock"]&&!A["after:highlightElement"]&&(A["after:highlightElement"]=O=>{A["after:highlightBlock"](Object.assign({block:O.el},O))})}function ls(A){os(A),Q.push(A)}function cs(A){const O=Q.indexOf(A);O!==-1&&Q.splice(O,1)}function zt(A,O){const ie=A;Q.forEach(function(he){he[ie]&&he[ie](O)})}function us(A){return it("10.7.0","highlightBlock will be removed entirely in v12.0"),it("10.7.0","Please use highlightElement now."),un(A)}Object.assign(m,{highlight:be,highlightAuto:cn,highlightAll:It,highlightElement:un,highlightBlock:us,configure:ts,initHighlighting:ns,initHighlightingOnLoad:rs,registerLanguage:is,unregisterLanguage:ss,listLanguages:as,getLanguage:je,registerAliases:ir,autoDetection:sr,inherit:er,addPlugin:ls,removePlugin:cs}),m.debugMode=function(){ge=!1},m.safeMode=function(){ge=!0},m.versionString=Yi,m.regex={concat:g,lookahead:f,either:y,optional:d,anyNumberOfTimes:p};for(const A in Ke)typeof Ke[A]=="object"&&e(Ke[A]);return Object.assign(m,Ke),m},st=nr({});return st.newInstance=()=>nr({}),pn=st,st.HighlightJS=st,st.default=st,pn}var vs=Ss();const fe=Ir(vs),ne=new Map,Es="https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md",Te={shell:"bash",sh:"bash",zsh:"bash",js:"javascript",ts:"typescript",py:"python",csharp:"cs","c#":"cs"};Te.html="xml";Te.xhtml="xml";Te.markup="xml";const _n=new Set(["magic","undefined"]);let Ge=null;const gn=new Map,As=300*1e3;async function $n(e=Es){if(e)return Ge||(Ge=(async()=>{try{const t=await fetch(e);if(!t.ok)return;const s=(await t.text()).split(/\r?\n/);let r=-1;for(let u=0;u<s.length;u++)if(/\|\s*Language\s*\|/i.test(s[u])){r=u;break}if(r===-1)return;const i=s[r].replace(/^\||\|$/g,"").split("|").map(u=>u.trim().toLowerCase());let a=i.findIndex(u=>/alias|aliases|equivalent|alt|alternates?/i.test(u));a===-1&&(a=1);let l=i.findIndex(u=>/file|filename|module|module name|module-name|short|slug/i.test(u));if(l===-1){const u=i.findIndex(c=>/language/i.test(c));l=u!==-1?u:0}let o=[];for(let u=r+1;u<s.length;u++){const c=s[u].trim();if(!c||!c.startsWith("|"))break;const h=c.replace(/^\||\|$/g,"").split("|").map(w=>w.trim());if(h.every(w=>/^-+$/.test(w)))continue;const f=h;if(!f.length)continue;const d=(f[l]||f[0]||"").toString().trim().toLowerCase();if(!d||/^-+$/.test(d))continue;ne.set(d,d);const g=f[a]||"";if(g){const w=String(g).split(",").map(y=>y.replace(/`/g,"").trim()).filter(Boolean);if(w.length){const x=w[0].toLowerCase().replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");x&&/[a-z0-9]/i.test(x)&&(ne.set(x,x),o.push(x))}}}try{const u=[];for(const c of o){const h=String(c||"").replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");h&&/[a-z0-9]/i.test(h)?u.push(h):ne.delete(c)}o=u}catch(u){console.warn("[codeblocksManager] cleanup aliases failed",u)}try{let u=0;for(const c of Array.from(ne.keys())){if(!c||/^-+$/.test(c)||!/[a-z0-9]/i.test(c)){ne.delete(c),u++;continue}if(/^[:]+/.test(c)){const h=c.replace(/^[:]+/,"");if(h&&/[a-z0-9]/i.test(h)){const f=ne.get(c);ne.delete(c),ne.set(h,f)}else ne.delete(c),u++}}for(const[c,h]of Array.from(ne.entries()))(!h||/^-+$/.test(h)||!/[a-z0-9]/i.test(h))&&(ne.delete(c),u++);try{const c=":---------------------";ne.has(c)&&(ne.delete(c),u++)}catch(c){console.warn("[codeblocksManager] remove sep key failed",c)}try{const c=Array.from(ne.keys()).sort()}catch(c){console.warn("[codeblocksManager] compute supported keys failed",c)}}catch(u){console.warn("[codeblocksManager] ignored error",u)}}catch(t){console.warn("[codeblocksManager] loadSupportedLanguages failed",t)}})(),Ge)}const ft=new Set;async function ut(e,t){if(Ge||(async()=>{try{await $n()}catch(r){console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed",r)}})(),Ge)try{await Ge}catch{}if(e=e==null?"":String(e),e=e.trim(),!e)return!1;const n=e.toLowerCase();if(_n.has(n))return!1;if(ne.size&&!ne.has(n)){const r=Te;if(!r[n]&&!r[e])return!1}if(ft.has(e))return!0;const s=Te;try{const r=(t||e||"").toString().replace(/\.js$/i,"").trim(),i=(s[e]||e||"").toString(),a=(s[r]||r||"").toString();let l=Array.from(new Set([i,a,r,e,s[r],s[e]].filter(Boolean))).map(c=>String(c).toLowerCase()).filter(c=>c&&c!=="undefined");ne.size&&(l=l.filter(c=>{if(ne.has(c))return!0;const h=Te[c];return!!(h&&ne.has(h))}));let o=null,u=null;for(const c of l)try{const h=Date.now();let f=gn.get(c);if(f&&f.ok===!1&&h-(f.ts||0)>=As&&(gn.delete(c),f=void 0),f){if(f.module)o=f.module;else if(f.promise)try{o=await f.promise}catch{o=null}}else{const p={promise:null,module:null,ok:null,ts:0};gn.set(c,p),p.promise=(async()=>{try{try{try{return await import(`highlight.js/lib/languages/${c}.js`)}catch{return await import(`highlight.js/lib/languages/${c}`)}}catch{try{const g=`https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${c}.js`;return await new Function("u","return import(u)")(g)}catch{try{const w=`https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${c}.js`;return await new Function("u","return import(u)")(w)}catch{return null}}}}catch{return null}})();try{o=await p.promise,p.module=o,p.ok=!!o,p.ts=Date.now()}catch{p.module=null,p.ok=!1,p.ts=Date.now(),o=null}}if(o){const p=o.default||o;try{const d=ne.size&&ne.get(e)||c||e;return fe.registerLanguage(d,p),ft.add(d),d!==e&&(fe.registerLanguage(e,p),ft.add(e)),!0}catch(d){u=d}}else try{if(ne.has(c)||ne.has(e)){const p=()=>({});try{fe.registerLanguage(c,p),ft.add(c)}catch{}try{c!==e&&(fe.registerLanguage(e,p),ft.add(e))}catch{}return!0}}catch{}}catch(h){u=h}if(u)throw u;return!1}catch{return!1}}let Dt=null;function zr(e=document){Ge||(async()=>{try{await $n()}catch(i){console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed",i)}})();const t=Te,s=Dt||(typeof IntersectionObserver>"u"?null:(Dt=new IntersectionObserver((i,a)=>{i.forEach(l=>{if(!l.isIntersecting)return;const o=l.target;try{a.unobserve(o)}catch(u){console.warn("[codeblocksManager] observer unobserve failed",u)}(async()=>{try{const u=o.getAttribute&&o.getAttribute("class")||o.className||"",c=u.match(/language-([a-zA-Z0-9_+-]+)/)||u.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(c&&c[1]){const h=(c[1]||"").toLowerCase(),f=t[h]||h,p=ne.size&&(ne.get(f)||ne.get(String(f).toLowerCase()))||f;try{await ut(p)}catch(d){console.warn("[codeblocksManager] registerLanguage failed",d)}try{try{const d=o.textContent||o.innerText||"";d!=null&&(o.textContent=d)}catch{}try{o&&o.dataset&&o.dataset.highlighted&&delete o.dataset.highlighted}catch{}fe.highlightElement(o)}catch(d){console.warn("[codeblocksManager] hljs.highlightElement failed",d)}}else try{const h=o.textContent||"";try{if(fe&&typeof fe.getLanguage=="function"&&fe.getLanguage("plaintext")){const f=fe.highlight(h,{language:"plaintext"});f&&f.value&&(o.innerHTML=f.value)}}catch{try{fe.highlightElement(o)}catch(p){console.warn("[codeblocksManager] fallback highlightElement failed",p)}}}catch(h){console.warn("[codeblocksManager] auto-detect plaintext failed",h)}}catch(u){console.warn("[codeblocksManager] observer entry processing failed",u)}})()})},{root:null,rootMargin:"300px",threshold:.1}),Dt)),r=e&&e.querySelectorAll?e.querySelectorAll("pre code"):[];if(!s){r.forEach(async i=>{try{const a=i.getAttribute&&i.getAttribute("class")||i.className||"",l=a.match(/language-([a-zA-Z0-9_+-]+)/)||a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(l&&l[1]){const o=(l[1]||"").toLowerCase(),u=t[o]||o,c=ne.size&&(ne.get(u)||ne.get(String(u).toLowerCase()))||u;try{await ut(c)}catch(h){console.warn("[codeblocksManager] registerLanguage failed (no observer)",h)}}try{try{const o=i.textContent||i.innerText||"";o!=null&&(i.textContent=o)}catch{}try{i&&i.dataset&&i.dataset.highlighted&&delete i.dataset.highlighted}catch{}fe.highlightElement(i)}catch(o){console.warn("[codeblocksManager] hljs.highlightElement failed (no observer)",o)}}catch(a){console.warn("[codeblocksManager] loadSupportedLanguages fallback ignored error",a)}});return}r.forEach(i=>{try{s.observe(i)}catch(a){console.warn("[codeblocksManager] observe failed",a)}})}function Rs(e,{useCdn:t=!0}={}){const n=document.querySelector("link[data-hl-theme]"),s=n&&n.getAttribute?n.getAttribute("data-hl-theme"):null,r=e==null?"default":String(e);if(r==="default"){try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}return}if(s===r)return;if(!t){console.warn("Requested highlight theme not bundled; set useCdn=true to load theme from CDN");return}const i=r,a=`https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/styles/${i}.css`,l=document.createElement("link");l.rel="stylesheet",l.href=a,l.setAttribute("data-hl-theme",i),l.addEventListener("load",()=>{try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}}),document.head.appendChild(l)}let yt="light";function Ls(e,t={}){if(document.querySelector(`link[href="${e}"]`))return;const n=document.createElement("link");n.rel="stylesheet",n.href=e,Object.entries(t).forEach(([s,r])=>n.setAttribute(s,r)),document.head.appendChild(n)}async function Br(e="none",t="/"){if(!e||e==="none")return;const n=[t+"bulma.css","/bulma.css"],s=Array.from(new Set(n));if(e==="local"){if(document.querySelector("style[data-bulma-override]"))return;for(const r of s)try{const i=await fetch(r,{method:"GET"});if(i.ok){const a=await i.text(),l=document.createElement("style");l.setAttribute("data-bulma-override",r),l.appendChild(document.createTextNode(`
/* bulma override: ${r} */
`+a)),document.head.appendChild(l);return}}catch(i){console.warn("[bulmaManager] fetch local bulma candidate failed",i)}return}try{const r=String(e).trim();if(!r)return;const i=`https://unpkg.com/bulmaswatch/${encodeURIComponent(r)}/bulmaswatch.min.css`;Ls(i,{"data-bulmaswatch-theme":r})}catch(r){console.warn("[bulmaManager] ensureBulma failed",r)}}function Nr(e){yt=e==="dark"?"dark":"light",document.documentElement.setAttribute("data-theme",yt),yt==="dark"?document.body.classList.add("is-dark"):document.body.classList.remove("is-dark")}function Ts(e){const t=document.documentElement;for(const[n,s]of Object.entries(e||{}))try{t.style.setProperty(`--${n}`,s)}catch(r){console.warn("[bulmaManager] setThemeVars failed for",n,r)}}function Or(e){if(!e||!(e instanceof HTMLElement))return()=>{};const t=()=>{yt==="dark"?(e.classList.add("is-dark"),e.classList.remove("is-light")):(e.classList.add("is-light"),e.classList.remove("is-dark"))};t();const n=new MutationObserver(()=>{yt=document.documentElement.getAttribute("data-theme")==="dark"?"dark":"light",t()});try{n.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]})}catch{}return()=>{try{n.disconnect()}catch{}}}const Dr={en:{navigation:"Navigation",onThisPage:"On this page",home:"Home",scrollToTop:"Scroll to top",readingTime:"{minutes} min read",searchPlaceholder:"Search…",imagePreviewTitle:"Image preview",imagePreviewFit:"Fit to screen",imagePreviewOriginal:"Original size",imagePreviewZoomOut:"Zoom out",imagePreviewZoomIn:"Zoom in",imagePreviewClose:"Close"},es:{navigation:"Navegación",onThisPage:"En esta página",home:"Inicio",scrollToTop:"Ir arriba",readingTime:"{minutes} min de lectura",searchPlaceholder:"Buscar…",imagePreviewTitle:"Previsualización de imagen",imagePreviewFit:"Ajustar a la pantalla",imagePreviewOriginal:"Tamaño original",imagePreviewZoomOut:"Alejar",imagePreviewZoomIn:"Acercar",imagePreviewClose:"Cerrar"},de:{navigation:"Navigation",onThisPage:"Auf dieser Seite",home:"Startseite",scrollToTop:"Nach oben",readingTime:"{minutes} min Lesezeit",searchPlaceholder:"Suchen…",imagePreviewTitle:"Bildvorschau",imagePreviewFit:"An Bildschirm anpassen",imagePreviewOriginal:"Originalgröße",imagePreviewZoomOut:"Verkleinern",imagePreviewZoomIn:"Vergrößern",imagePreviewClose:"Schließen"},fr:{navigation:"Navigation",onThisPage:"Sur cette page",home:"Accueil",scrollToTop:"Aller en haut",readingTime:"{minutes} min de lecture",searchPlaceholder:"Rechercher…",imagePreviewTitle:"Aperçu de l’image",imagePreviewFit:"Ajuster à l’écran",imagePreviewOriginal:"Taille originale",imagePreviewZoomOut:"Dézoomer",imagePreviewZoomIn:"Zoomer",imagePreviewClose:"Fermer"},pt:{navigation:"Navegação",onThisPage:"Nesta página",home:"Início",scrollToTop:"Ir para o topo",readingTime:"{minutes} min de leitura",searchPlaceholder:"Procurar…",imagePreviewTitle:"Visualização da imagem",imagePreviewFit:"Ajustar à tela",imagePreviewOriginal:"Tamanho original",imagePreviewZoomOut:"Diminuir",imagePreviewZoomIn:"Aumentar",imagePreviewClose:"Fechar"}},ct=JSON.parse(JSON.stringify(Dr));let Zt="en";if(typeof navigator<"u"){const e=navigator.language||navigator.languages&&navigator.languages[0]||"en";Zt=String(e).split("-")[0].toLowerCase()}Dr[Zt]||(Zt="en");let Qe=Zt;function ot(e,t={}){const n=ct[Qe]||ct.en;let s=n&&n[e]?n[e]:ct.en[e]||"";for(const r of Object.keys(t))s=s.replace(new RegExp(`{${r}}`,"g"),String(t[r]));return s}async function Pn(e,t){if(!e)return;let n=e;try{/^https?:\/\//.test(e)||(n=new URL(e,location.origin+t).toString());const s=await fetch(n);if(!s.ok)return;const r=await s.json();for(const i of Object.keys(r||{}))ct[i]=Object.assign({},ct[i]||{},r[i])}catch{}}function In(e){const t=String(e).split("-")[0].toLowerCase();Qe=ct[t]?t:"en"}const Cs=Object.freeze(Object.defineProperty({__proto__:null,get currentLang(){return Qe},loadL10nFile:Pn,setLang:In,t:ot},Symbol.toStringTag,{value:"Module"})),Ms=`import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
`;function qr(e,t="worker"){let n=null;function s(){if(!n)try{const l=e();n=l||null,l&&l.addEventListener("error",()=>{try{n===l&&(n=null,l.terminate&&l.terminate())}catch(o){console.warn("["+t+"] worker termination failed",o)}})}catch(l){n=null,console.warn("["+t+"] worker init failed",l)}return n}function r(){try{n&&(n.terminate&&n.terminate(),n=null)}catch(l){console.warn("["+t+"] worker termination failed",l)}}function i(l,o=1e3){return new Promise((u,c)=>{const h=s();if(!h)return c(new Error("worker unavailable"));const f=String(Math.random());l.id=f;let p=null;const d=()=>{p&&clearTimeout(p),h.removeEventListener("message",g),h.removeEventListener("error",w)},g=y=>{const x=y.data||{};x.id===f&&(d(),x.error?c(new Error(x.error)):u(x.result))},w=y=>{d(),console.warn("["+t+"] worker error event",y);try{n===h&&(n=null,h.terminate&&h.terminate())}catch(x){console.warn("["+t+"] worker termination failed",x)}c(new Error(y&&y.message||"worker error"))};p=setTimeout(()=>{d(),console.warn("["+t+"] worker timed out");try{n===h&&(n=null,h.terminate&&h.terminate())}catch(y){console.warn("["+t+"] worker termination on timeout failed",y)}c(new Error("worker timeout"))},o),h.addEventListener("message",g),h.addEventListener("error",w);try{h.postMessage(l)}catch(y){d(),c(y)}})}return{get:s,send:i,terminate:r}}function _s(e){try{if(typeof Blob<"u"&&typeof URL<"u"&&e){const t=new Blob([e],{type:"application/javascript"}),n=URL.createObjectURL(t);return new Worker(n,{type:"module"})}}catch(t){console.warn("[worker-manager] createWorkerFromRaw failed",t)}return null}const De=new Set;function zn(e){$s(),De.clear();for(const t of Ce)t&&De.add(t);dr(te),dr(q),zn._refreshed=!0}function dr(e){if(!(!e||typeof e.values!="function"))for(const t of e.values())t&&De.add(t)}function fr(e){if(!e||typeof e.set!="function")return;const t=e.set;e.set=function(n,s){return s&&De.add(s),t.call(this,n,s)}}let pr=!1;function $s(){pr||(fr(te),fr(q),pr=!0)}function Ur(e){return!e||typeof e!="string"?!1:/^(https?:)?\/\//.test(e)||e.startsWith("mailto:")||e.startsWith("tel:")}function pe(e){return String(e||"").replace(/^[.\/]+/,"")}function Tt(e){return String(e||"").replace(/\/+$/,"")}function Lt(e){return Tt(e)+"/"}function Ps(e){try{if(!e||typeof document>"u"||!document.head||e.startsWith("data:")||document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`))return;const n=document.createElement("link");n.rel="preload",n.as="image",n.href=e,document.head.appendChild(n)}catch(t){console.warn("[helpers] preloadImage failed",t)}}function qt(e,t=0,n=!1){try{if(typeof window>"u"||!e||!e.querySelectorAll)return;const s=Array.from(e.querySelectorAll("img"));if(!s.length)return;const r=e,i=r&&r.getBoundingClientRect?r.getBoundingClientRect():null,a=0,l=typeof window<"u"&&(window.innerHeight||document.documentElement.clientHeight)||0,o=i?Math.max(a,i.top):a,c=(i?Math.min(l,i.bottom):l)+Number(t||0);let h=0;r&&(h=r.clientHeight||(i?i.height:0)),h||(h=l-a);let f=.6;try{const w=r&&window.getComputedStyle?window.getComputedStyle(r):null,y=w&&w.getPropertyValue("--nimbi-image-max-height-ratio"),x=y?parseFloat(y):NaN;!Number.isNaN(x)&&x>0&&x<=1&&(f=x)}catch(w){console.warn("[helpers] read CSS ratio failed",w)}const p=Math.max(200,Math.floor(h*f));let d=!1,g=null;if(s.forEach(w=>{try{const y=w.getAttribute?w.getAttribute("loading"):void 0;y!=="eager"&&w.setAttribute&&w.setAttribute("loading","lazy");const x=w.getBoundingClientRect?w.getBoundingClientRect():null,$=w.src||w.getAttribute&&w.getAttribute("src"),M=x&&x.height>1?x.height:p,_=x?x.top:0,I=_+M;x&&M>0&&_<=c&&I>=o&&(w.setAttribute?(w.setAttribute("loading","eager"),w.setAttribute("fetchpriority","high"),w.setAttribute("data-eager-by-nimbi","1")):(w.loading="eager",w.fetchPriority="high"),Ps($),d=!0),!g&&x&&x.top<=c&&(g={img:w,src:$,rect:x,beforeLoading:y})}catch(y){console.warn("[helpers] setEagerForAboveFoldImages per-image failed",y)}}),!d&&g){const{img:w,src:y,rect:x,beforeLoading:$}=g;try{w.setAttribute?(w.setAttribute("loading","eager"),w.setAttribute("fetchpriority","high"),w.setAttribute("data-eager-by-nimbi","1")):(w.loading="eager",w.fetchPriority="high")}catch(M){console.warn("[helpers] setEagerForAboveFoldImages fallback failed",M)}}}catch(s){console.warn("[helpers] setEagerForAboveFoldImages failed",s)}}function Gt(e){try{const t=e();return t&&typeof t.then=="function"?t.catch(n=>{console.warn("[helpers] safe swallowed error",n)}):t}catch(t){console.warn("[helpers] safe swallowed error",t)}}try{typeof globalThis<"u"&&!globalThis.safe&&(globalThis.safe=Gt)}catch(e){console.warn("[helpers] global attach failed",e)}const te=new Map;let Me=[],Bn=!1;function Is(e){Bn=!!e}function Hr(e){Me=Array.isArray(e)?e.slice():[]}function zs(){return Me}const jr=qr(()=>_s(Ms),"slugManager");function Nn(){return jr.get()}function Fr(e){return jr.send(e)}async function Bs(e,t=1,n=void 0){if(!Nn())return Kt(e,t,n);try{return await Fr({type:"buildSearchIndex",contentBase:e,indexDepth:t,noIndexing:n})}catch(r){try{return await Kt(e,t,n)}catch(i){throw console.warn("[slugManager] buildSearchIndex fallback failed",i),r}}}async function Ns(e,t,n){return Nn()?Fr({type:"crawlForSlug",slug:e,base:t,maxQueue:n}):On(e,t,n)}function We(e,t){if(e)if(Me&&Me.length){const s=t.split("/")[0],r=Me.includes(s);let i=te.get(e);(!i||typeof i=="string")&&(i={default:typeof i=="string"?i:void 0,langs:{}}),r?i.langs[s]=t:i.default=t,te.set(e,i)}else te.set(e,t)}const nn=new Set;function Os(e){typeof e=="function"&&nn.add(e)}function Ds(e){typeof e=="function"&&nn.delete(e)}const q=new Map;let Sn={},Ce=[],ht="_404.md",lt="_home.md";function vn(e){e!=null&&(ht=String(e||""))}function qs(e){e!=null&&(lt=String(e||""))}function Us(e){Sn=e||{}}const kt=new Map,Qt=new Set;function Hs(){kt.clear(),Qt.clear()}function js(e){if(!e||e.length===0)return"";let t=e[0];for(let s=1;s<e.length;s++){const r=e[s];let i=0;const a=Math.min(t.length,r.length);for(;i<a&&t[i]===r[i];)i++;t=t.slice(0,i)}const n=t.lastIndexOf("/");return n===-1?t:t.slice(0,n+1)}function Xt(e){te.clear(),q.clear(),Ce=[],Me=Me||[];const t=Object.keys(Sn||{});if(!t.length)return;let n="";try{if(e){try{/^[a-z][a-z0-9+.-]*:/i.test(String(e))?n=new URL(String(e)).pathname:n=String(e||"")}catch(s){n=String(e||""),console.warn("[slugManager] parse contentBase failed",s)}n=Lt(n)}}catch(s){n="",console.warn("[slugManager] setContentBase prefix derivation failed",s)}n||(n=js(t));for(const s of t){let r=s;n&&s.startsWith(n)?r=pe(s.slice(n.length)):r=pe(s),Ce.push(r);try{zn()}catch(a){console.warn("[slugManager] refreshIndexPaths failed",a)}const i=Sn[s];if(typeof i=="string"){const a=(i||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const l=le(a[1].trim());if(l)try{if(Me&&Me.length){const u=r.split("/")[0],c=Me.includes(u);let h=te.get(l);(!h||typeof h=="string")&&(h={default:typeof h=="string"?h:void 0,langs:{}}),c?h.langs[u]=r:h.default=r,te.set(l,h)}else te.set(l,r);q.set(r,l)}catch(o){console.warn("[slugManager] set slug mapping failed",o)}}}}}try{Xt()}catch(e){console.warn("[slugManager] initial setContentBase failed",e)}function le(e){let n=String(e||"").toLowerCase().replace(/[^a-z0-9\- ]/g,"").replace(/ /g,"-");return n=n.replace(/(?:-?)(?:md|html)$/,""),n.length>80&&(n=n.slice(0,80).replace(/-+$/g,"")),n}function Fs(e){return Ct(e,void 0)}function Ct(e,t){if(!e)return!1;if(e.startsWith("//"))return!0;if(/^[a-z][a-z0-9+.-]*:/i.test(e)){if(t&&typeof t=="string")try{const n=new URL(e),s=new URL(t);return n.origin!==s.origin?!0:!n.pathname.startsWith(s.pathname)}catch{return!0}return!0}if(e.startsWith("/")&&t&&typeof t=="string")try{const n=new URL(e,t),s=new URL(t);return n.origin!==s.origin?!0:!n.pathname.startsWith(s.pathname)}catch{return!0}return!1}function Ht(e){return e==null?e:String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g,(t,n)=>n)}function Mt(e){if(!e||!te.has(e))return null;const t=te.get(e);if(!t)return null;if(typeof t=="string")return t;if(Me&&Me.length&&Qe&&t.langs&&t.langs[Qe])return t.langs[Qe];if(t.default)return t.default;if(t.langs){const n=Object.keys(t.langs);if(n.length)return t.langs[n[0]]}return null}const xt=new Map;function Ws(){xt.clear()}let Se=async function(e,t){if(!e)throw new Error("path required");try{const i=(String(e||"").match(/([^\/]+)\.md(?:$|[?#])/)||[])[1];if(i&&te.has(i)){const a=Mt(i)||te.get(i);a&&a!==e&&(e=a)}}catch(i){console.warn("[slugManager] slug mapping normalization failed",i)}const n=t==null?"":Tt(String(t));let s="";try{if(n)if(/^[a-z][a-z0-9+.-]*:/i.test(n))s=n.replace(/\/$/,"")+"/"+e.replace(/^\//,"");else if(n.startsWith("/"))s=n.replace(/\/$/,"")+"/"+e.replace(/^\//,"");else{const i=typeof location<"u"&&location.origin?location.origin:"http://localhost",a=n.startsWith("/")?n:"/"+n;s=i+a.replace(/\/$/,"")+"/"+e.replace(/^\//,"")}else s=(typeof location<"u"&&location.origin?location.origin:"http://localhost")+"/"+e.replace(/^\//,"")}catch{s="/"+e.replace(/^\//,"")}if(xt.has(s))return xt.get(s);const r=(async()=>{const i=await fetch(s);if(!i||typeof i.ok!="boolean"||!i.ok){if(i&&i.status===404)try{const h=`${n}/${ht}`,f=await globalThis.fetch(h);if(f&&typeof f.ok=="boolean"&&f.ok)return{raw:await f.text(),status:404}}catch(h){console.warn("[slugManager] fetching fallback 404 failed",h)}let c="";try{i&&typeof i.clone=="function"?c=await i.clone().text():i&&typeof i.text=="function"?c=await i.text():c=""}catch(h){c="",console.warn("[slugManager] reading error body failed",h)}throw console.error("fetchMarkdown failed:",{url:s,status:i?i.status:void 0,statusText:i?i.statusText:void 0,body:c.slice(0,200)}),new Error("failed to fetch md")}const a=await i.text(),l=a.trim().slice(0,16).toLowerCase(),o=l.startsWith("<!doctype")||l.startsWith("<html"),u=o||String(e||"").toLowerCase().endsWith(".html");if(o&&String(e||"").toLowerCase().endsWith(".md")){try{const c=`${n}/${ht}`,h=await globalThis.fetch(c);if(h.ok)return{raw:await h.text(),status:404}}catch(c){console.warn("[slugManager] fetching fallback 404 failed",c)}throw console.error("fetchMarkdown: server returned HTML for .md request",s),new Error("failed to fetch md")}return u?{raw:a,isHtml:!0}:{raw:a}})();return xt.set(s,r),r};function Zs(e){typeof e=="function"&&(Se=e)}const jt=new Map;function Gs(e){if(!e||typeof e!="string")return"";let t=e.replace(/```[\s\S]*?```/g,"");return t=t.replace(/<pre[\s\S]*?<\/pre>/gi,""),t=t.replace(/<code[\s\S]*?<\/code>/gi,""),t=t.replace(/<!--([\s\S]*?)-->/g,""),t=t.replace(/^ {4,}.*$/gm,""),t=t.replace(/`[^`]*`/g,""),t}let Ue=[],pt=null;async function Kt(e,t=1,n=void 0){const s=Array.isArray(n)?Array.from(new Set((n||[]).map(r=>pe(String(r||""))))):[];try{const r=pe(String(ht||""));r&&!s.includes(r)&&s.push(r)}catch{}if(Ue&&Ue.length&&t===1&&!Ue.some(i=>{try{return s.includes(pe(String(i.path||"")))}catch{return!1}}))return Ue;if(pt)return pt;pt=(async()=>{let r=Array.isArray(n)?Array.from(new Set((n||[]).map(u=>pe(String(u||""))))):[];try{const u=pe(String(ht||""));u&&!r.includes(u)&&r.push(u)}catch{}const i=u=>{if(!r||!r.length)return!1;for(const c of r)if(c&&(u===c||u.startsWith(c+"/")))return!0;return!1};let a=[];if(Ce&&Ce.length&&(a=Array.from(Ce)),!a.length)for(const u of te.values())u&&a.push(u);try{const u=await Qr(e);u&&u.length&&(a=a.concat(u))}catch(u){console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed",u)}try{const u=new Set(a),c=[...a];for(u.size;c.length&&u.size<=_t;){const h=c.shift();try{const f=await Se(h,e);if(f&&f.raw){if(f.status===404)continue;let p=f.raw;const d=[],g=String(h||"").replace(/^.*\//,"");if(/^readme(?:\.md)?$/i.test(g)&&Bn&&(!h||!h.includes("/")))continue;const w=Gs(p),y=/\[[^\]]+\]\(([^)]+)\)/g;let x;for(;x=y.exec(w);)d.push(x[1]);const $=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;x=$.exec(w);)d.push(x[1]);const M=h&&h.includes("/")?h.substring(0,h.lastIndexOf("/")+1):"";for(let _ of d)try{if(Ct(_,e)||_.startsWith("..")||_.indexOf("/../")!==-1||(M&&!_.startsWith("./")&&!_.startsWith("/")&&!_.startsWith("../")&&(_=M+_),_=pe(_),!/\.(md|html?)(?:$|[?#])/i.test(_))||(_=_.split(/[?#]/)[0],i(_)))continue;u.has(_)||(u.add(_),c.push(_),a.push(_))}catch(I){console.warn("[slugManager] href processing failed",_,I)}}}catch(f){console.warn("[slugManager] discovery fetch failed for",h,f)}}}catch(u){console.warn("[slugManager] discovery loop failed",u)}const l=new Set;a=a.filter(u=>!u||l.has(u)||i(u)?!1:(l.add(u),!0));const o=[];for(const u of a)if(/\.(?:md|html?)(?:$|[?#])/i.test(u))try{const c=await Se(u,e);if(c&&c.raw){if(c.status===404)continue;let h="",f="";if(c.isHtml)try{const g=new DOMParser().parseFromString(c.raw,"text/html"),w=g.querySelector("title")||g.querySelector("h1");w&&w.textContent&&(h=w.textContent.trim());const y=g.querySelector("p");if(y&&y.textContent&&(f=y.textContent.trim()),t>=2)try{const x=g.querySelector("h1"),$=x&&x.textContent?x.textContent.trim():h||"",M=(()=>{try{if(q.has(u))return q.get(u)}catch{}return le(h||u)})(),_=Array.from(g.querySelectorAll("h2"));for(const I of _)try{const H=(I.textContent||"").trim();if(!H)continue;const K=I.id?I.id:le(H),ae=M?`${M}::${K}`:`${le(u)}::${K}`;let W="",U=I.nextElementSibling;for(;U&&U.tagName&&U.tagName.toLowerCase()==="script";)U=U.nextElementSibling;U&&U.textContent&&(W=String(U.textContent).trim()),o.push({slug:ae,title:H,excerpt:W,path:u,parentTitle:$})}catch(H){console.warn("[slugManager] indexing H2 failed",H)}if(t===3)try{const I=Array.from(g.querySelectorAll("h3"));for(const H of I)try{const K=(H.textContent||"").trim();if(!K)continue;const ae=H.id?H.id:le(K),W=M?`${M}::${ae}`:`${le(u)}::${ae}`;let U="",Z=H.nextElementSibling;for(;Z&&Z.tagName&&Z.tagName.toLowerCase()==="script";)Z=Z.nextElementSibling;Z&&Z.textContent&&(U=String(Z.textContent).trim()),o.push({slug:W,title:K,excerpt:U,path:u,parentTitle:$})}catch(K){console.warn("[slugManager] indexing H3 failed",K)}}catch(I){console.warn("[slugManager] collect H3s failed",I)}}catch(x){console.warn("[slugManager] collect H2s failed",x)}}catch(d){console.warn("[slugManager] parsing HTML for index failed",d)}else{const d=c.raw,g=d.match(/^#\s+(.+)$/m);h=g?g[1].trim():"";try{h=Ht(h)}catch{}const w=d.split(/\r?\n\s*\r?\n/);if(w.length>1)for(let y=1;y<w.length;y++){const x=w[y].trim();if(x&&!/^#/.test(x)){f=x.replace(/\r?\n/g," ");break}}if(t>=2){let y="",x="";try{const $=(d.match(/^#\s+(.+)$/m)||[])[1];y=$?$.trim():"",x=(function(){try{if(q.has(u))return q.get(u)}catch{}return le(h||u)})();const M=/^##\s+(.+)$/gm;let _;for(;_=M.exec(d);)try{const I=(_[1]||"").trim(),H=Ht(I);if(!I)continue;const K=le(I),ae=x?`${x}::${K}`:`${le(u)}::${K}`,U=d.slice(M.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),Z=U&&U[1]?String(U[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";o.push({slug:ae,title:H,excerpt:Z,path:u,parentTitle:y})}catch(I){console.warn("[slugManager] indexing markdown H2 failed",I)}}catch($){console.warn("[slugManager] collect markdown H2s failed",$)}if(t===3)try{const $=/^###\s+(.+)$/gm;let M;for(;M=$.exec(d);)try{const _=(M[1]||"").trim(),I=Ht(_);if(!_)continue;const H=le(_),K=x?`${x}::${H}`:`${le(u)}::${H}`,W=d.slice($.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),U=W&&W[1]?String(W[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";o.push({slug:K,title:I,excerpt:U,path:u,parentTitle:y})}catch(_){console.warn("[slugManager] indexing markdown H3 failed",_)}}catch($){console.warn("[slugManager] collect markdown H3s failed",$)}}}let p="";try{q.has(u)&&(p=q.get(u))}catch(d){console.warn("[slugManager] mdToSlug access failed",d)}p||(p=le(h||u)),o.push({slug:p,title:h,excerpt:f,path:u})}}catch(c){console.warn("[slugManager] buildSearchIndex: entry fetch failed",c)}try{Ue=o.filter(c=>{try{return!i(String(c.path||""))}catch{return!0}})}catch(u){console.warn("[slugManager] filtering index by excludes failed",u),Ue=o}return Ue})();try{await pt}catch(r){console.warn("[slugManager] awaiting _indexPromise failed",r)}return pt=null,Ue}const Wr=1e3;let _t=Wr;function Qs(e){typeof e=="number"&&e>=0&&(_t=e)}const Zr=new DOMParser,Gr="a[href]";let On=async function(e,t,n=_t){if(jt.has(e))return jt.get(e);let s=null;const r=new Set,i=[""];for(;i.length&&!s&&!(i.length>n);){const a=i.shift();if(r.has(a))continue;r.add(a);let l=t;l.endsWith("/")||(l+="/"),l+=a;try{let o;try{o=await globalThis.fetch(l)}catch(f){console.warn("[slugManager] crawlAllMarkdown: fetch failed",{url:l,error:f});continue}if(!o||!o.ok){o&&!o.ok&&console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:l,status:o.status});continue}const u=await o.text(),h=Zr.parseFromString(u,"text/html").querySelectorAll(Gr);for(const f of h)try{let p=f.getAttribute("href")||"";if(!p||Ct(p,t)||p.startsWith("..")||p.indexOf("/../")!==-1)continue;if(p.endsWith("/")){const d=a+p;r.has(d)||i.push(d);continue}if(p.toLowerCase().endsWith(".md")){const d=pe(a+p);try{if(q.has(d))continue;for(const g of te.values());}catch(g){console.warn("[slugManager] slug map access failed",g)}try{const g=await Se(d,t);if(g&&g.raw){const w=(g.raw||"").match(/^#\s+(.+)$/m);if(w&&w[1]&&le(w[1].trim())===e){s=d;break}}}catch(g){console.warn("[slugManager] crawlForSlug: fetchMarkdown failed",g)}}}catch(p){console.warn("[slugManager] crawlForSlug: link iteration failed",p)}}catch(o){console.warn("[slugManager] crawlForSlug: directory fetch failed",o)}}return jt.set(e,s),s};async function Qr(e,t=_t){const n=new Set,s=new Set,r=[""];for(;r.length&&!(r.length>t);){const i=r.shift();if(s.has(i))continue;s.add(i);let a=e;a.endsWith("/")||(a+="/"),a+=i;try{let l;try{l=await globalThis.fetch(a)}catch(h){console.warn("[slugManager] crawlAllMarkdown: fetch failed",{url:a,error:h});continue}if(!l||!l.ok){l&&!l.ok&&console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:a,status:l.status});continue}const o=await l.text(),c=Zr.parseFromString(o,"text/html").querySelectorAll(Gr);for(const h of c)try{let f=h.getAttribute("href")||"";if(!f||Ct(f,e)||f.startsWith("..")||f.indexOf("/../")!==-1)continue;if(f.endsWith("/")){const d=i+f;s.has(d)||r.push(d);continue}const p=(i+f).replace(/^\/+/,"");/\.(md|html?)$/i.test(p)&&n.add(p)}catch(f){console.warn("[slugManager] crawlAllMarkdown: link iteration failed",f)}}catch(l){console.warn("[slugManager] crawlAllMarkdown: directory fetch failed",l)}}return Array.from(n)}async function Xr(e,t,n){if(e&&typeof e=="string"&&(e=pe(e),e=Tt(e)),te.has(e))return Mt(e)||te.get(e);for(const r of nn)try{const i=await r(e,t);if(i)return We(e,i),q.set(i,e),i}catch(i){console.warn("[slugManager] slug resolver failed",i)}if(Ce&&Ce.length){if(kt.has(e)){const r=kt.get(e);return te.set(e,r),q.set(r,e),r}for(const r of Ce)if(!Qt.has(r))try{const i=await Se(r,t);if(i&&i.raw){const a=(i.raw||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const l=le(a[1].trim());if(Qt.add(r),l&&kt.set(l,r),l===e)return We(e,r),q.set(r,e),r}}}catch(i){console.warn("[slugManager] manifest title fetch failed",i)}}try{const r=await Kt(t);if(r&&r.length){const i=r.find(a=>a.slug===e);if(i)return We(e,i.path),q.set(i.path,e),i.path}}catch(r){console.warn("[slugManager] buildSearchIndex lookup failed",r)}try{const r=await On(e,t,n);if(r)return We(e,r),q.set(r,e),r}catch(r){console.warn("[slugManager] crawlForSlug lookup failed",r)}const s=[`${e}.html`,`${e}.md`];for(const r of s)try{const i=await Se(r,t);if(i&&i.raw)return We(e,r),q.set(r,e),r}catch(i){console.warn("[slugManager] candidate fetch failed",i)}if(Ce&&Ce.length)for(const r of Ce)try{const i=r.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(le(i)===e)return We(e,r),q.set(r,e),r}catch(i){console.warn("[slugManager] build-time filename match failed",i)}try{const r=[];lt&&typeof lt=="string"&&lt.trim()&&r.push(lt),r.includes("_home.md")||r.push("_home.md");for(const i of r)try{const a=await Se(i,t);if(a&&a.raw){const l=(a.raw||"").match(/^#\s+(.+)$/m);if(l&&l[1]&&le(l[1].trim())===e)return We(e,i),q.set(i,e),i}}catch{}}catch(r){console.warn("[slugManager] home page fetch failed",r)}return null}const Ft=Object.freeze(Object.defineProperty({__proto__:null,CRAWL_MAX_QUEUE:Wr,_setAllMd:Us,_storeSlugMapping:We,addSlugResolver:Os,get allMarkdownPaths(){return Ce},get availableLanguages(){return Me},buildSearchIndex:Kt,buildSearchIndexWorker:Bs,clearFetchCache:Ws,clearListCaches:Hs,crawlAllMarkdown:Qr,crawlCache:jt,crawlForSlug:On,crawlForSlugWorker:Ns,get defaultCrawlMaxQueue(){return _t},ensureSlug:Xr,fetchCache:xt,get fetchMarkdown(){return Se},getLanguages:zs,get homePage(){return lt},initSlugWorker:Nn,isExternalLink:Fs,isExternalLinkWithBase:Ct,listPathsFetched:Qt,listSlugCache:kt,mdToSlug:q,get notFoundPage(){return ht},removeSlugResolver:Ds,resolveSlugPath:Mt,get searchIndex(){return Ue},setContentBase:Xt,setDefaultCrawlMaxQueue:Qs,setFetchMarkdown:Zs,setHomePage:qs,setLanguages:Hr,setNotFoundPage:vn,setSkipRootReadme:Is,get skipRootReadme(){return Bn},slugResolvers:nn,slugToMd:te,slugify:le,unescapeMarkdown:Ht},Symbol.toStringTag,{value:"Module"}));let Kr=100;function gr(e){Kr=e}let St=300*1e3;function mr(e){St=e}const _e=new Map;function Xs(e){if(!_e.has(e))return;const t=_e.get(e),n=Date.now();if(t.ts+St<n){_e.delete(e);return}return _e.delete(e),_e.set(e,t),t.value}function Ks(e,t){if(wr(),wr(),_e.delete(e),_e.set(e,{value:t,ts:Date.now()}),_e.size>Kr){const n=_e.keys().next().value;n!==void 0&&_e.delete(n)}}function wr(){if(!St||St<=0)return;const e=Date.now();for(const[t,n]of _e.entries())n.ts+St<e&&_e.delete(t)}async function Ys(e,t){const n=new Set(De),s=document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");for(const r of Array.from(s||[])){const i=r.getAttribute("href")||"";if(i)try{const a=new URL(i,location.href);if(a.origin!==location.origin)continue;const l=(a.hash||a.pathname).match(/([^#?]+\.md)(?:$|[?#])/)||(a.pathname||"").match(/([^#?]+\.md)(?:$|[?#])/);if(l){let h=pe(l[1]);h&&n.add(h);continue}const o=(r.textContent||"").trim(),u=(a.pathname||"").replace(/^.*\//,"");if(o&&le(o)===e||u&&le(u.replace(/\.(html?|md)$/i,""))===e)return a.toString();if(/\.(html?)$/i.test(a.pathname)){let h=a.pathname.replace(/^\//,"");n.add(h);continue}const c=a.pathname||"";if(c){const h=new URL(t),f=Lt(h.pathname);if(c.indexOf(f)!==-1){let p=c.startsWith(f)?c.slice(f.length):c;p=pe(p),p&&n.add(p)}}}catch(a){console.warn("[router] malformed URL while discovering index candidates",a)}}for(const r of n)try{if(!r||!String(r).includes(".md"))continue;const i=await Se(r,t);if(!i||!i.raw)continue;const a=(i.raw||"").match(/^#\s+(.+)$/m);if(a){const l=(a[1]||"").trim();if(l&&le(l)===e)return r}}catch(i){console.warn("[router] fetchMarkdown during index discovery failed",i)}return null}function Vs(e){const t=[];if(String(e).includes(".md")||String(e).includes(".html"))/index\.html$/i.test(e)||t.push(e);else try{const n=decodeURIComponent(String(e||""));if(te.has(n)){const s=Mt(n)||te.get(n);s&&(/\.(md|html?)$/i.test(s)?/index\.html$/i.test(s)||t.push(s):(t.push(s),t.push(s+".html")))}else{if(De&&De.size)for(const s of De){const r=s.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(le(r)===n&&!/index\.html$/i.test(s)){t.push(s);break}}!t.length&&n&&!/\.(md|html?)$/i.test(n)&&(t.push(n+".html"),t.push(n+".md"))}}catch(n){console.warn("[router] buildPageCandidates failed during slug handling",n)}return t}async function Js(e,t){const n=e||"",s=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;let r=e||"",i=null;if(r&&String(r).includes("::")){const d=String(r).split("::",2);r=d[0],i=d[1]||null}const l=`${e}|||${typeof Cs<"u"&&Qe?Qe:""}`,o=Xs(l);if(o)r=o.resolved,i=o.anchor||i;else{if(!String(r).includes(".md")&&!String(r).includes(".html")){let d=decodeURIComponent(String(r||""));if(d&&typeof d=="string"&&(d=pe(d),d=Tt(d)),te.has(d))r=Mt(d)||te.get(d);else{let g=await Ys(d,t);if(g)r=g;else if(zn._refreshed&&De&&De.size||typeof t=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(t)){const w=await Xr(d,t);w&&(r=w)}}}Ks(l,{resolved:r,anchor:i})}!i&&s&&(i=s);try{if(r&&(r.startsWith("http://")||r.startsWith("https://")||r.startsWith("/"))){const d=r.startsWith("/")?new URL(r,location.origin).toString():r;try{const g=await fetch(d);if(g&&g.ok){const w=await g.text(),y=g&&g.headers&&typeof g.headers.get=="function"&&g.headers.get("content-type")||"",x=(w||"").toLowerCase();if(y&&y.indexOf&&y.indexOf("text/html")!==-1||x.indexOf("<!doctype")!==-1||x.indexOf("<html")!==-1)return{data:{raw:w,isHtml:!0},pagePath:d.replace(/^\//,""),anchor:i}}}catch{}}}catch{}const u=Vs(r),c=String(n||"").includes(".md")||String(n||"").includes(".html");if(c&&u.length===0&&(String(r).includes(".md")||String(r).includes(".html"))&&u.push(r),u.length===0&&(String(r).includes(".md")||String(r).includes(".html"))&&u.push(r),u.length===1&&/index\.html$/i.test(u[0])&&!c&&!te.has(r)&&!te.has(decodeURIComponent(String(r||"")))&&!String(r||"").includes("/"))throw new Error("Unknown slug: index.html fallback prevented");let h=null,f=null,p=null;for(const d of u)if(d)try{const g=pe(d);h=await Se(g,t),f=g;break}catch(g){p=g;try{console.warn("[router] candidate fetch failed",{candidate:d,contentBase:t,err:g&&g.message||g})}catch{}}if(!h){try{console.error("[router] fetchPageData: no page data for",{originalRaw:n,resolved:r,pageCandidates:u,contentBase:t,fetchError:p&&(p.message||String(p))||null})}catch{}try{if(c&&String(n||"").toLowerCase().includes(".html"))try{const d=new URL(String(n||""),location.href).toString();console.warn("[router] attempting absolute HTML fetch fallback",d);const g=await fetch(d);if(g&&g.ok){const w=await g.text(),y=g&&g.headers&&typeof g.headers.get=="function"&&g.headers.get("content-type")||"",x=(w||"").toLowerCase(),$=y&&y.indexOf&&y.indexOf("text/html")!==-1||x.indexOf("<!doctype")!==-1||x.indexOf("<html")!==-1;if($||console.warn("[router] absolute fetch returned non-HTML",{abs:d,contentType:y,snippet:x.slice(0,200)}),$)try{const M=d,_=new URL(".",M).toString();try{const H=typeof DOMParser<"u"?new DOMParser:null;if(H){const K=H.parseFromString(w||"","text/html"),ae=(Y,J)=>{try{const F=J.getAttribute(Y)||"";if(!F||/^(https?:)?\/\//i.test(F)||F.startsWith("/")||F.startsWith("#"))return;try{const k=new URL(F,M).toString();J.setAttribute(Y,k)}catch(k){console.warn("[router] rewrite attribute failed",Y,k)}}catch(F){console.warn("[router] rewrite helper failed",F)}},W=K.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"),U=[];for(const Y of Array.from(W||[]))try{const J=Y.tagName?Y.tagName.toLowerCase():"";if(J==="a")continue;if(Y.hasAttribute("src")){const F=Y.getAttribute("src");ae("src",Y);const k=Y.getAttribute("src");F!==k&&U.push({attr:"src",tag:J,before:F,after:k})}if(Y.hasAttribute("href")&&J==="link"){const F=Y.getAttribute("href");ae("href",Y);const k=Y.getAttribute("href");F!==k&&U.push({attr:"href",tag:J,before:F,after:k})}if(Y.hasAttribute("href")&&J!=="link"){const F=Y.getAttribute("href");ae("href",Y);const k=Y.getAttribute("href");F!==k&&U.push({attr:"href",tag:J,before:F,after:k})}if(Y.hasAttribute("xlink:href")){const F=Y.getAttribute("xlink:href");ae("xlink:href",Y);const k=Y.getAttribute("xlink:href");F!==k&&U.push({attr:"xlink:href",tag:J,before:F,after:k})}if(Y.hasAttribute("poster")){const F=Y.getAttribute("poster");ae("poster",Y);const k=Y.getAttribute("poster");F!==k&&U.push({attr:"poster",tag:J,before:F,after:k})}if(Y.hasAttribute("srcset")){const v=(Y.getAttribute("srcset")||"").split(",").map(R=>R.trim()).filter(Boolean).map(R=>{const[E,b]=R.split(/\s+/,2);if(!E||/^(https?:)?\/\//i.test(E)||E.startsWith("/"))return R;try{const L=new URL(E,M).toString();return b?`${L} ${b}`:L}catch{return R}}).join(", ");Y.setAttribute("srcset",v)}}catch{}const Z=K.documentElement&&K.documentElement.outerHTML?K.documentElement.outerHTML:w;try{U&&U.length&&console.warn("[router] rewritten asset refs",{abs:d,rewritten:U})}catch{}return{data:{raw:Z,isHtml:!0},pagePath:String(n||""),anchor:i}}}catch{}let I=w;return/<base\s+[^>]*>/i.test(w)||(/<head[^>]*>/i.test(w)?I=w.replace(/(<head[^>]*>)/i,`$1<base href="${_}">`):I=`<base href="${_}">`+w),{data:{raw:I,isHtml:!0},pagePath:String(n||""),anchor:i}}catch{return{data:{raw:w,isHtml:!0},pagePath:String(n||""),anchor:i}}}}catch(d){console.warn("[router] absolute HTML fetch fallback failed",d)}}catch{}try{const d=decodeURIComponent(String(r||""));if(d&&!/\.(md|html?)$/i.test(d)){const g=[`/assets/${d}.html`,`/assets/${d}/index.html`];for(const w of g)try{const y=await fetch(w,{method:"GET"});if(y&&y.ok)return{data:{raw:await y.text(),isHtml:!0},pagePath:w.replace(/^\//,""),anchor:i}}catch{}}}catch(d){console.warn("[router] assets fallback failed",d)}throw new Error("no page data")}return{data:h,pagePath:f,anchor:i}}function Dn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var tt=Dn();function Yr(e){tt=e}var Je={exec:()=>null};function se(e,t=""){let n=typeof e=="string"?e:e.source,s={replace:(r,i)=>{let a=typeof i=="string"?i:i.source;return a=a.replace(Re.caret,"$1"),n=n.replace(r,a),s},getRegex:()=>new RegExp(n,t)};return s}var ea=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),Re={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}>`)},ta=/^(?:[ \t]*(?:\n|$))+/,na=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,ra=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,$t=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,ia=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,qn=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Vr=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Jr=se(Vr).replace(/bull/g,qn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),sa=se(Vr).replace(/bull/g,qn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Un=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,aa=/^[^\n]+/,Hn=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,oa=se(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Hn).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),la=se(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,qn).getRegex(),rn="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",jn=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,ca=se("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",jn).replace("tag",rn).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),ei=se(Un).replace("hr",$t).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",rn).getRegex(),ua=se(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",ei).getRegex(),Fn={blockquote:ua,code:na,def:oa,fences:ra,heading:ia,hr:$t,html:ca,lheading:Jr,list:la,newline:ta,paragraph:ei,table:Je,text:aa},br=se("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",$t).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",rn).getRegex(),ha={...Fn,lheading:sa,table:br,paragraph:se(Un).replace("hr",$t).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",br).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",rn).getRegex()},da={...Fn,html:se(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",jn).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Je,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:se(Un).replace("hr",$t).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Jr).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},fa=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,pa=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,ti=/^( {2,}|\\)\n(?!\s*$)/,ga=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,sn=/[\p{P}\p{S}]/u,Wn=/[\s\p{P}\p{S}]/u,ni=/[^\s\p{P}\p{S}]/u,ma=se(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Wn).getRegex(),ri=/(?!~)[\p{P}\p{S}]/u,wa=/(?!~)[\s\p{P}\p{S}]/u,ba=/(?:[^\s\p{P}\p{S}]|~)/u,ii=/(?![*_])[\p{P}\p{S}]/u,ya=/(?![*_])[\s\p{P}\p{S}]/u,ka=/(?:[^\s\p{P}\p{S}]|[*_])/u,xa=se(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",ea?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),si=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Sa=se(si,"u").replace(/punct/g,sn).getRegex(),va=se(si,"u").replace(/punct/g,ri).getRegex(),ai="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Ea=se(ai,"gu").replace(/notPunctSpace/g,ni).replace(/punctSpace/g,Wn).replace(/punct/g,sn).getRegex(),Aa=se(ai,"gu").replace(/notPunctSpace/g,ba).replace(/punctSpace/g,wa).replace(/punct/g,ri).getRegex(),Ra=se("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,ni).replace(/punctSpace/g,Wn).replace(/punct/g,sn).getRegex(),La=se(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,ii).getRegex(),Ta="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Ca=se(Ta,"gu").replace(/notPunctSpace/g,ka).replace(/punctSpace/g,ya).replace(/punct/g,ii).getRegex(),Ma=se(/\\(punct)/,"gu").replace(/punct/g,sn).getRegex(),_a=se(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),$a=se(jn).replace("(?:-->|$)","-->").getRegex(),Pa=se("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",$a).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Yt=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Ia=se(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",Yt).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),oi=se(/^!?\[(label)\]\[(ref)\]/).replace("label",Yt).replace("ref",Hn).getRegex(),li=se(/^!?\[(ref)\](?:\[\])?/).replace("ref",Hn).getRegex(),za=se("reflink|nolink(?!\\()","g").replace("reflink",oi).replace("nolink",li).getRegex(),yr=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Zn={_backpedal:Je,anyPunctuation:Ma,autolink:_a,blockSkip:xa,br:ti,code:pa,del:Je,delLDelim:Je,delRDelim:Je,emStrongLDelim:Sa,emStrongRDelimAst:Ea,emStrongRDelimUnd:Ra,escape:fa,link:Ia,nolink:li,punctuation:ma,reflink:oi,reflinkSearch:za,tag:Pa,text:ga,url:Je},Ba={...Zn,link:se(/^!?\[(label)\]\((.*?)\)/).replace("label",Yt).getRegex(),reflink:se(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Yt).getRegex()},En={...Zn,emStrongRDelimAst:Aa,emStrongLDelim:va,delLDelim:La,delRDelim:Ca,url:se(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",yr).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:se(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",yr).getRegex()},Na={...En,br:se(ti).replace("{2,}","*").getRegex(),text:se(En.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Ut={normal:Fn,gfm:ha,pedantic:da},gt={normal:Zn,gfm:En,breaks:Na,pedantic:Ba},Oa={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},kr=e=>Oa[e];function Oe(e,t){if(t){if(Re.escapeTest.test(e))return e.replace(Re.escapeReplace,kr)}else if(Re.escapeTestNoEncode.test(e))return e.replace(Re.escapeReplaceNoEncode,kr);return e}function xr(e){try{e=encodeURI(e).replace(Re.percentDecode,"%")}catch{return null}return e}function Sr(e,t){let n=e.replace(Re.findPipe,(i,a,l)=>{let o=!1,u=a;for(;--u>=0&&l[u]==="\\";)o=!o;return o?"|":" |"}),s=n.split(Re.splitPipe),r=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),t)if(s.length>t)s.splice(t);else for(;s.length<t;)s.push("");for(;r<s.length;r++)s[r]=s[r].trim().replace(Re.slashPipe,"|");return s}function mt(e,t,n){let s=e.length;if(s===0)return"";let r=0;for(;r<s&&e.charAt(s-r-1)===t;)r++;return e.slice(0,s-r)}function Da(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let s=0;s<e.length;s++)if(e[s]==="\\")s++;else if(e[s]===t[0])n++;else if(e[s]===t[1]&&(n--,n<0))return s;return n>0?-2:-1}function qa(e,t=0){let n=t,s="";for(let r of e)if(r==="	"){let i=4-n%4;s+=" ".repeat(i),n+=i}else s+=r,n++;return s}function vr(e,t,n,s,r){let i=t.href,a=t.title||null,l=e[1].replace(r.other.outputLinkReplace,"$1");s.state.inLink=!0;let o={type:e[0].charAt(0)==="!"?"image":"link",raw:n,href:i,title:a,text:l,tokens:s.inlineTokens(l)};return s.state.inLink=!1,o}function Ua(e,t,n){let s=e.match(n.other.indentCodeCompensation);if(s===null)return t;let r=s[1];return t.split(`
`).map(i=>{let a=i.match(n.other.beginningSpace);if(a===null)return i;let[l]=a;return l.length>=r.length?i.slice(r.length):i}).join(`
`)}var Vt=class{options;rules;lexer;constructor(e){this.options=e||tt}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:mt(n,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],s=Ua(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:s}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let s=mt(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:mt(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=mt(t[0],`
`).split(`
`),s="",r="",i=[];for(;n.length>0;){let a=!1,l=[],o;for(o=0;o<n.length;o++)if(this.rules.other.blockquoteStart.test(n[o]))l.push(n[o]),a=!0;else if(!a)l.push(n[o]);else break;n=n.slice(o);let u=l.join(`
`),c=u.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${u}`:u,r=r?`${r}
${c}`:c;let h=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(c,i,!0),this.lexer.state.top=h,n.length===0)break;let f=i.at(-1);if(f?.type==="code")break;if(f?.type==="blockquote"){let p=f,d=p.raw+`
`+n.join(`
`),g=this.blockquote(d);i[i.length-1]=g,s=s.substring(0,s.length-p.raw.length)+g.raw,r=r.substring(0,r.length-p.text.length)+g.text;break}else if(f?.type==="list"){let p=f,d=p.raw+`
`+n.join(`
`),g=this.list(d);i[i.length-1]=g,s=s.substring(0,s.length-f.raw.length)+g.raw,r=r.substring(0,r.length-p.raw.length)+g.raw,n=d.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:i,text:r}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),s=n.length>1,r={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let i=this.rules.other.listItemRegex(n),a=!1;for(;e;){let o=!1,u="",c="";if(!(t=i.exec(e))||this.rules.block.hr.test(e))break;u=t[0],e=e.substring(u.length);let h=qa(t[2].split(`
`,1)[0],t[1].length),f=e.split(`
`,1)[0],p=!h.trim(),d=0;if(this.options.pedantic?(d=2,c=h.trimStart()):p?d=t[1].length+1:(d=h.search(this.rules.other.nonSpaceChar),d=d>4?1:d,c=h.slice(d),d+=t[1].length),p&&this.rules.other.blankLine.test(f)&&(u+=f+`
`,e=e.substring(f.length+1),o=!0),!o){let g=this.rules.other.nextBulletRegex(d),w=this.rules.other.hrRegex(d),y=this.rules.other.fencesBeginRegex(d),x=this.rules.other.headingBeginRegex(d),$=this.rules.other.htmlBeginRegex(d),M=this.rules.other.blockquoteBeginRegex(d);for(;e;){let _=e.split(`
`,1)[0],I;if(f=_,this.options.pedantic?(f=f.replace(this.rules.other.listReplaceNesting,"  "),I=f):I=f.replace(this.rules.other.tabCharGlobal,"    "),y.test(f)||x.test(f)||$.test(f)||M.test(f)||g.test(f)||w.test(f))break;if(I.search(this.rules.other.nonSpaceChar)>=d||!f.trim())c+=`
`+I.slice(d);else{if(p||h.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||y.test(h)||x.test(h)||w.test(h))break;c+=`
`+f}p=!f.trim(),u+=_+`
`,e=e.substring(_.length+1),h=I.slice(d)}}r.loose||(a?r.loose=!0:this.rules.other.doubleBlankLine.test(u)&&(a=!0)),r.items.push({type:"list_item",raw:u,task:!!this.options.gfm&&this.rules.other.listIsTask.test(c),loose:!1,text:c,tokens:[]}),r.raw+=u}let l=r.items.at(-1);if(l)l.raw=l.raw.trimEnd(),l.text=l.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let o of r.items){if(this.lexer.state.top=!1,o.tokens=this.lexer.blockTokens(o.text,[]),o.task){if(o.text=o.text.replace(this.rules.other.listReplaceTask,""),o.tokens[0]?.type==="text"||o.tokens[0]?.type==="paragraph"){o.tokens[0].raw=o.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),o.tokens[0].text=o.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let c=this.lexer.inlineQueue.length-1;c>=0;c--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[c].src)){this.lexer.inlineQueue[c].src=this.lexer.inlineQueue[c].src.replace(this.rules.other.listReplaceTask,"");break}}let u=this.rules.other.listTaskCheckbox.exec(o.raw);if(u){let c={type:"checkbox",raw:u[0]+" ",checked:u[0]!=="[ ]"};o.checked=c.checked,r.loose?o.tokens[0]&&["paragraph","text"].includes(o.tokens[0].type)&&"tokens"in o.tokens[0]&&o.tokens[0].tokens?(o.tokens[0].raw=c.raw+o.tokens[0].raw,o.tokens[0].text=c.raw+o.tokens[0].text,o.tokens[0].tokens.unshift(c)):o.tokens.unshift({type:"paragraph",raw:c.raw,text:c.raw,tokens:[c]}):o.tokens.unshift(c)}}if(!r.loose){let u=o.tokens.filter(h=>h.type==="space"),c=u.length>0&&u.some(h=>this.rules.other.anyLine.test(h.raw));r.loose=c}}if(r.loose)for(let o of r.items){o.loose=!0;for(let u of o.tokens)u.type==="text"&&(u.type="paragraph")}return r}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:s,title:r}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=Sr(t[1]),s=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===s.length){for(let a of s)this.rules.other.tableAlignRight.test(a)?i.align.push("right"):this.rules.other.tableAlignCenter.test(a)?i.align.push("center"):this.rules.other.tableAlignLeft.test(a)?i.align.push("left"):i.align.push(null);for(let a=0;a<n.length;a++)i.header.push({text:n[a],tokens:this.lexer.inline(n[a]),header:!0,align:i.align[a]});for(let a of r)i.rows.push(Sr(a,i.header.length).map((l,o)=>({text:l,tokens:this.lexer.inline(l),header:!1,align:i.align[o]})));return i}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let i=mt(n.slice(0,-1),"\\");if((n.length-i.length)%2===0)return}else{let i=Da(t[2],"()");if(i===-2)return;if(i>-1){let a=(t[0].indexOf("!")===0?5:4)+t[1].length+i;t[2]=t[2].substring(0,i),t[0]=t[0].substring(0,a).trim(),t[3]=""}}let s=t[2],r="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(s);i&&(s=i[1],r=i[3])}else r=t[3]?t[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),vr(t,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=t[s.toLowerCase()];if(!r){let i=n[0].charAt(0);return{type:"text",raw:i,text:i}}return vr(n,r,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let s=this.rules.inline.emStrongLDelim.exec(e);if(!(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!n||this.rules.inline.punctuation.exec(n))){let r=[...s[0]].length-1,i,a,l=r,o=0,u=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(u.lastIndex=0,t=t.slice(-1*e.length+r);(s=u.exec(t))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i)continue;if(a=[...i].length,s[3]||s[4]){l+=a;continue}else if((s[5]||s[6])&&r%3&&!((r+a)%3)){o+=a;continue}if(l-=a,l>0)continue;a=Math.min(a,a+l+o);let c=[...s[0]][0].length,h=e.slice(0,r+s.index+c+a);if(Math.min(r,a)%2){let p=h.slice(1,-1);return{type:"em",raw:h,text:p,tokens:this.lexer.inlineTokens(p)}}let f=h.slice(2,-2);return{type:"strong",raw:h,text:f,tokens:this.lexer.inlineTokens(f)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(n),r=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&r&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,n=""){let s=this.rules.inline.delLDelim.exec(e);if(s&&(!s[1]||!n||this.rules.inline.punctuation.exec(n))){let r=[...s[0]].length-1,i,a,l=r,o=this.rules.inline.delRDelim;for(o.lastIndex=0,t=t.slice(-1*e.length+r);(s=o.exec(t))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i||(a=[...i].length,a!==r))continue;if(s[3]||s[4]){l+=a;continue}if(l-=a,l>0)continue;a=Math.min(a,a+l);let u=[...s[0]][0].length,c=e.slice(0,r+s.index+u+a),h=c.slice(r,-r);return{type:"del",raw:c,text:h,tokens:this.lexer.inlineTokens(h)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,s;return t[2]==="@"?(n=t[1],s="mailto:"+n):(n=t[1],s=n),{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,s;if(t[2]==="@")n=t[0],s="mailto:"+n;else{let r;do r=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(r!==t[0]);n=t[0],t[1]==="www."?s="http://"+t[0]:s=t[0]}return{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}},Pe=class An{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||tt,this.options.tokenizer=this.options.tokenizer||new Vt,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:Re,block:Ut.normal,inline:gt.normal};this.options.pedantic?(n.block=Ut.pedantic,n.inline=gt.pedantic):this.options.gfm&&(n.block=Ut.gfm,this.options.breaks?n.inline=gt.breaks:n.inline=gt.gfm),this.tokenizer.rules=n}static get rules(){return{block:Ut,inline:gt}}static lex(t,n){return new An(n).lex(t)}static lexInline(t,n){return new An(n).inlineTokens(t)}lex(t){t=t.replace(Re.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],s=!1){for(this.options.pedantic&&(t=t.replace(Re.tabCharGlobal,"    ").replace(Re.spaceLine,""));t;){let r;if(this.options.extensions?.block?.some(a=>(r=a.call({lexer:this},t,n))?(t=t.substring(r.raw.length),n.push(r),!0):!1))continue;if(r=this.tokenizer.space(t)){t=t.substring(r.raw.length);let a=n.at(-1);r.raw.length===1&&a!==void 0?a.raw+=`
`:n.push(r);continue}if(r=this.tokenizer.code(t)){t=t.substring(r.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.at(-1).src=a.text):n.push(r);continue}if(r=this.tokenizer.fences(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.heading(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.hr(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.blockquote(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.list(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.html(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.def(t)){t=t.substring(r.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title},n.push(r));continue}if(r=this.tokenizer.table(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.lheading(t)){t=t.substring(r.raw.length),n.push(r);continue}let i=t;if(this.options.extensions?.startBlock){let a=1/0,l=t.slice(1),o;this.options.extensions.startBlock.forEach(u=>{o=u.call({lexer:this},l),typeof o=="number"&&o>=0&&(a=Math.min(a,o))}),a<1/0&&a>=0&&(i=t.substring(0,a+1))}if(this.state.top&&(r=this.tokenizer.paragraph(i))){let a=n.at(-1);s&&a?.type==="paragraph"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(r),s=i.length!==t.length,t=t.substring(r.raw.length);continue}if(r=this.tokenizer.text(t)){t=t.substring(r.raw.length);let a=n.at(-1);a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(r);continue}if(t){let a="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}inlineTokens(t,n=[]){let s=t,r=null;if(this.tokens.links){let o=Object.keys(this.tokens.links);if(o.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)o.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,r.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)i=r[2]?r[2].length:0,s=s.slice(0,r.index+i)+"["+"a".repeat(r[0].length-i-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let a=!1,l="";for(;t;){a||(l=""),a=!1;let o;if(this.options.extensions?.inline?.some(c=>(o=c.call({lexer:this},t,n))?(t=t.substring(o.raw.length),n.push(o),!0):!1))continue;if(o=this.tokenizer.escape(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.tag(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.link(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(o.raw.length);let c=n.at(-1);o.type==="text"&&c?.type==="text"?(c.raw+=o.raw,c.text+=o.text):n.push(o);continue}if(o=this.tokenizer.emStrong(t,s,l)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.codespan(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.br(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.del(t,s,l)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.autolink(t)){t=t.substring(o.raw.length),n.push(o);continue}if(!this.state.inLink&&(o=this.tokenizer.url(t))){t=t.substring(o.raw.length),n.push(o);continue}let u=t;if(this.options.extensions?.startInline){let c=1/0,h=t.slice(1),f;this.options.extensions.startInline.forEach(p=>{f=p.call({lexer:this},h),typeof f=="number"&&f>=0&&(c=Math.min(c,f))}),c<1/0&&c>=0&&(u=t.substring(0,c+1))}if(o=this.tokenizer.inlineText(u)){t=t.substring(o.raw.length),o.raw.slice(-1)!=="_"&&(l=o.raw.slice(-1)),a=!0;let c=n.at(-1);c?.type==="text"?(c.raw+=o.raw,c.text+=o.text):n.push(o);continue}if(t){let c="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return n}},Jt=class{options;parser;constructor(e){this.options=e||tt}space(e){return""}code({text:e,lang:t,escaped:n}){let s=(t||"").match(Re.notSpaceStart)?.[0],r=e.replace(Re.endingNewline,"")+`
`;return s?'<pre><code class="language-'+Oe(s)+'">'+(n?r:Oe(r,!0))+`</code></pre>
`:"<pre><code>"+(n?r:Oe(r,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return""}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,s="";for(let a=0;a<e.items.length;a++){let l=e.items[a];s+=this.listitem(l)}let r=t?"ol":"ul",i=t&&n!==1?' start="'+n+'"':"";return"<"+r+i+`>
`+s+"</"+r+`>
`}listitem(e){return`<li>${this.parser.parse(e.tokens)}</li>
`}checkbox({checked:e}){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",n="";for(let r=0;r<e.header.length;r++)n+=this.tablecell(e.header[r]);t+=this.tablerow({text:n});let s="";for(let r=0;r<e.rows.length;r++){let i=e.rows[r];n="";for(let a=0;a<i.length;a++)n+=this.tablecell(i[a]);s+=this.tablerow({text:n})}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+s+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),n=e.header?"th":"td";return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${Oe(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let s=this.parser.parseInline(n),r=xr(e);if(r===null)return s;e=r;let i='<a href="'+e+'"';return t&&(i+=' title="'+Oe(t)+'"'),i+=">"+s+"</a>",i}image({href:e,title:t,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));let r=xr(e);if(r===null)return Oe(n);e=r;let i=`<img src="${e}" alt="${Oe(n)}"`;return t&&(i+=` title="${Oe(t)}"`),i+=">",i}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:Oe(e.text)}},Gn=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},Ie=class Rn{options;renderer;textRenderer;constructor(t){this.options=t||tt,this.options.renderer=this.options.renderer||new Jt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Gn}static parse(t,n){return new Rn(n).parse(t)}static parseInline(t,n){return new Rn(n).parseInline(t)}parse(t){let n="";for(let s=0;s<t.length;s++){let r=t[s];if(this.options.extensions?.renderers?.[r.type]){let a=r,l=this.options.extensions.renderers[a.type].call({parser:this},a);if(l!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(a.type)){n+=l||"";continue}}let i=r;switch(i.type){case"space":{n+=this.renderer.space(i);break}case"hr":{n+=this.renderer.hr(i);break}case"heading":{n+=this.renderer.heading(i);break}case"code":{n+=this.renderer.code(i);break}case"table":{n+=this.renderer.table(i);break}case"blockquote":{n+=this.renderer.blockquote(i);break}case"list":{n+=this.renderer.list(i);break}case"checkbox":{n+=this.renderer.checkbox(i);break}case"html":{n+=this.renderer.html(i);break}case"def":{n+=this.renderer.def(i);break}case"paragraph":{n+=this.renderer.paragraph(i);break}case"text":{n+=this.renderer.text(i);break}default:{let a='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return n}parseInline(t,n=this.renderer){let s="";for(let r=0;r<t.length;r++){let i=t[r];if(this.options.extensions?.renderers?.[i.type]){let l=this.options.extensions.renderers[i.type].call({parser:this},i);if(l!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){s+=l||"";continue}}let a=i;switch(a.type){case"escape":{s+=n.text(a);break}case"html":{s+=n.html(a);break}case"link":{s+=n.link(a);break}case"image":{s+=n.image(a);break}case"checkbox":{s+=n.checkbox(a);break}case"strong":{s+=n.strong(a);break}case"em":{s+=n.em(a);break}case"codespan":{s+=n.codespan(a);break}case"br":{s+=n.br(a);break}case"del":{s+=n.del(a);break}case"text":{s+=n.text(a);break}default:{let l='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return s}},wt=class{options;block;constructor(e){this.options=e||tt}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(){return this.block?Pe.lex:Pe.lexInline}provideParser(){return this.block?Ie.parse:Ie.parseInline}},Ha=class{defaults=Dn();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Ie;Renderer=Jt;TextRenderer=Gn;Lexer=Pe;Tokenizer=Vt;Hooks=wt;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let s of e)switch(n=n.concat(t.call(this,s)),s.type){case"table":{let r=s;for(let i of r.header)n=n.concat(this.walkTokens(i.tokens,t));for(let i of r.rows)for(let a of i)n=n.concat(this.walkTokens(a.tokens,t));break}case"list":{let r=s;n=n.concat(this.walkTokens(r.items,t));break}default:{let r=s;this.defaults.extensions?.childTokens?.[r.type]?this.defaults.extensions.childTokens[r.type].forEach(i=>{let a=r[i].flat(1/0);n=n.concat(this.walkTokens(a,t))}):r.tokens&&(n=n.concat(this.walkTokens(r.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){let i=t.renderers[r.name];i?t.renderers[r.name]=function(...a){let l=r.renderer.apply(this,a);return l===!1&&(l=i.apply(this,a)),l}:t.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=t[r.level];i?i.unshift(r.tokenizer):t[r.level]=[r.tokenizer],r.start&&(r.level==="block"?t.startBlock?t.startBlock.push(r.start):t.startBlock=[r.start]:r.level==="inline"&&(t.startInline?t.startInline.push(r.start):t.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(t.childTokens[r.name]=r.childTokens)}),s.extensions=t),n.renderer){let r=this.defaults.renderer||new Jt(this.defaults);for(let i in n.renderer){if(!(i in r))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let a=i,l=n.renderer[a],o=r[a];r[a]=(...u)=>{let c=l.apply(r,u);return c===!1&&(c=o.apply(r,u)),c||""}}s.renderer=r}if(n.tokenizer){let r=this.defaults.tokenizer||new Vt(this.defaults);for(let i in n.tokenizer){if(!(i in r))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let a=i,l=n.tokenizer[a],o=r[a];r[a]=(...u)=>{let c=l.apply(r,u);return c===!1&&(c=o.apply(r,u)),c}}s.tokenizer=r}if(n.hooks){let r=this.defaults.hooks||new wt;for(let i in n.hooks){if(!(i in r))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let a=i,l=n.hooks[a],o=r[a];wt.passThroughHooks.has(i)?r[a]=u=>{if(this.defaults.async&&wt.passThroughHooksRespectAsync.has(i))return(async()=>{let h=await l.call(r,u);return o.call(r,h)})();let c=l.call(r,u);return o.call(r,c)}:r[a]=(...u)=>{if(this.defaults.async)return(async()=>{let h=await l.apply(r,u);return h===!1&&(h=await o.apply(r,u)),h})();let c=l.apply(r,u);return c===!1&&(c=o.apply(r,u)),c}}s.hooks=r}if(n.walkTokens){let r=this.defaults.walkTokens,i=n.walkTokens;s.walkTokens=function(a){let l=[];return l.push(i.call(this,a)),r&&(l=l.concat(r.call(this,a))),l}}this.defaults={...this.defaults,...s}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return Pe.lex(e,t??this.defaults)}parser(e,t){return Ie.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let s={...n},r={...this.defaults,...s},i=this.onError(!!r.silent,!!r.async);if(this.defaults.async===!0&&s.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(r.hooks&&(r.hooks.options=r,r.hooks.block=e),r.async)return(async()=>{let a=r.hooks?await r.hooks.preprocess(t):t,l=await(r.hooks?await r.hooks.provideLexer():e?Pe.lex:Pe.lexInline)(a,r),o=r.hooks?await r.hooks.processAllTokens(l):l;r.walkTokens&&await Promise.all(this.walkTokens(o,r.walkTokens));let u=await(r.hooks?await r.hooks.provideParser():e?Ie.parse:Ie.parseInline)(o,r);return r.hooks?await r.hooks.postprocess(u):u})().catch(i);try{r.hooks&&(t=r.hooks.preprocess(t));let a=(r.hooks?r.hooks.provideLexer():e?Pe.lex:Pe.lexInline)(t,r);r.hooks&&(a=r.hooks.processAllTokens(a)),r.walkTokens&&this.walkTokens(a,r.walkTokens);let l=(r.hooks?r.hooks.provideParser():e?Ie.parse:Ie.parseInline)(a,r);return r.hooks&&(l=r.hooks.postprocess(l)),l}catch(a){return i(a)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let s="<p>An error occurred:</p><pre>"+Oe(n.message+"",!0)+"</pre>";return t?Promise.resolve(s):s}if(t)return Promise.reject(n);throw n}}},et=new Ha;function oe(e,t){return et.parse(e,t)}oe.options=oe.setOptions=function(e){return et.setOptions(e),oe.defaults=et.defaults,Yr(oe.defaults),oe};oe.getDefaults=Dn;oe.defaults=tt;oe.use=function(...e){return et.use(...e),oe.defaults=et.defaults,Yr(oe.defaults),oe};oe.walkTokens=function(e,t){return et.walkTokens(e,t)};oe.parseInline=et.parseInline;oe.Parser=Ie;oe.parser=Ie.parse;oe.Renderer=Jt;oe.TextRenderer=Gn;oe.Lexer=Pe;oe.lexer=Pe.lex;oe.Tokenizer=Vt;oe.Hooks=wt;oe.parse=oe;oe.options;oe.setOptions;oe.use;oe.walkTokens;oe.parseInline;Ie.parse;Pe.lex;const ci=`function j() {
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
`,Er=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",ci],{type:"text/javascript;charset=utf-8"});function ja(e){let t;try{if(t=Er&&(self.URL||self.webkitURL).createObjectURL(Er),!t)throw"";const n=new Worker(t,{type:"module",name:e?.name});return n.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(t)}),n}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(ci),{type:"module",name:e?.name})}}function Fa(e){if(e.startsWith("---")){const t=e.indexOf(`
---`,3);if(t!==-1){const n=e.slice(3,t+0).trim(),s=e.slice(t+4).trimStart(),r={};return n.split(/\r?\n/).forEach(i=>{const a=i.match(/^([^:]+):\s*(.*)$/);a&&(r[a[1].trim()]=a[2].trim())}),{content:s,data:r}}}return{content:e,data:{}}}const ui=qr(()=>new ja,"markdown"),Ar=typeof DOMParser<"u"?new DOMParser:null;function Ln(){return ui.get()}function Wa(e){return ui.send(e,1e3)}const Xe=[];function Tn(e){if(e&&typeof e=="object"){Xe.push(e);try{oe.use(e)}catch(t){console.warn("[markdown] failed to apply plugin",t)}}}function Za(e){Xe.length=0,Array.isArray(e)&&Xe.push(...e.filter(t=>t&&typeof t=="object"));try{Xe.forEach(t=>oe.use(t))}catch(t){console.warn("[markdown] failed to apply markdown extensions",t)}}async function en(e){if(Ln&&Ln())try{const i=await Wa({type:"render",md:e});if(i&&i.html!==void 0)try{const l=(Ar||new DOMParser).parseFromString(i.html,"text/html"),o=l.querySelectorAll("h1,h2,h3,h4,h5,h6");o.forEach(h=>{h.id||(h.id=le(h.textContent||""));try{const f=Number(h.tagName.substring(1));if(f>=1&&f<=6){const p={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},d=f<=2?"has-text-weight-bold":f<=4?"has-text-weight-semibold":"has-text-weight-normal";`${p[f]} ${d}`.split(/\s+/).filter(Boolean).forEach(w=>{try{h.classList.add(w)}catch{}})}}catch{}});try{try{const f=typeof document<"u"&&document.documentElement&&document.documentElement.getAttribute?document.documentElement.getAttribute("data-nimbi-logo-moved"):null;if(f){const p=Array.from(l.querySelectorAll("img"));for(const d of p)try{const g=d.getAttribute("src")||"";if(new URL(g,location.href).toString()===f){const y=d.parentElement;d.remove(),y&&y.tagName&&y.tagName.toLowerCase()==="p"&&y.childNodes.length===0&&y.remove();break}}catch{}}}catch{}l.querySelectorAll("img").forEach(f=>{try{f.getAttribute("loading")||f.setAttribute("data-want-lazy","1")}catch(p){console.warn("[markdown] set image loading attribute failed",p)}})}catch(h){console.warn("[markdown] query images failed",h)}try{l.querySelectorAll("pre code").forEach(f=>{try{const p=f.getAttribute&&f.getAttribute("class")||f.className||"",d=String(p||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(d)try{f.setAttribute&&f.setAttribute("class",d)}catch(y){console.warn("[markdown] set code class failed",y),f.className=d}else try{f.removeAttribute&&f.removeAttribute("class")}catch(y){console.warn("[markdown] remove code class failed",y),f.className=""}const g=d,w=g.match(/language-([a-zA-Z0-9_+-]+)/)||g.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!w||!w[1])try{const y=f.textContent||"";try{if(fe&&typeof fe.getLanguage=="function"&&fe.getLanguage("plaintext")){const x=fe.highlight(y,{language:"plaintext"});x&&x.value&&(f.innerHTML=x.value)}}catch{try{fe.highlightElement(f)}catch($){console.warn("[markdown] hljs.highlightElement failed",$)}}}catch(y){console.warn("[markdown] code auto-detect failed",y)}}catch(p){console.warn("[markdown] processing code blocks failed",p)}})}catch(h){console.warn("[markdown] query code blocks failed",h)}const u=l.body.innerHTML,c=[];return o.forEach(h=>{c.push({level:Number(h.tagName.substring(1)),text:(h.textContent||"").trim(),id:h.id})}),{html:u,meta:i.meta||{},toc:c}}catch(a){return console.warn("[markdown] post-process worker HTML failed",a),i}}catch(i){console.warn("[markdown] worker render failed",i)}const{content:n,data:s}=Fa(e||"");if(oe.setOptions({gfm:!0,mangle:!1,headerIds:!1,headerPrefix:""}),Xe&&Xe.length)try{Xe.forEach(i=>oe.use(i))}catch(i){console.warn("[markdown] apply plugins failed",i)}let r=oe.parse(n);try{const a=(Ar||new DOMParser).parseFromString(r,"text/html"),l=a.querySelectorAll("h1,h2,h3,h4,h5,h6");l.forEach(u=>{u.id||(u.id=le(u.textContent||""));try{const c=Number(u.tagName.substring(1));if(c>=1&&c<=6){const h={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},f=c<=2?"has-text-weight-bold":c<=4?"has-text-weight-semibold":"has-text-weight-normal";`${h[c]} ${f}`.split(/\s+/).filter(Boolean).forEach(d=>{try{u.classList.add(d)}catch{}})}}catch{}});try{try{const c=typeof document<"u"&&document.documentElement&&document.documentElement.getAttribute?document.documentElement.getAttribute("data-nimbi-logo-moved"):null;if(c){const h=Array.from(a.querySelectorAll("img"));for(const f of h)try{const p=f.getAttribute("src")||"";if(new URL(p,location.href).toString()===c){const g=f.parentElement;f.remove(),g&&g.tagName&&g.tagName.toLowerCase()==="p"&&g.childNodes.length===0&&g.remove();break}}catch{}}}catch{}a.querySelectorAll("img").forEach(c=>{try{c.getAttribute("loading")||c.setAttribute("data-want-lazy","1")}catch(h){console.warn("[markdown] set image loading attribute failed",h)}})}catch(u){console.warn("[markdown] query images failed",u)}try{a.querySelectorAll("pre code").forEach(c=>{try{const h=c.getAttribute&&c.getAttribute("class")||c.className||"",f=String(h||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(f)try{c.setAttribute&&c.setAttribute("class",f)}catch(g){console.warn("[markdown] set code class failed",g),c.className=f}else try{c.removeAttribute&&c.removeAttribute("class")}catch(g){console.warn("[markdown] remove code class failed",g),c.className=""}const p=f,d=p.match(/language-([a-zA-Z0-9_+-]+)/)||p.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!d||!d[1])try{const g=c.textContent||"";try{if(fe&&typeof fe.getLanguage=="function"&&fe.getLanguage("plaintext")){const w=fe.highlight(g,{language:"plaintext"});w&&w.value&&(c.innerHTML=w.value)}}catch{try{fe.highlightElement(c)}catch(y){console.warn("[markdown] hljs.highlightElement failed",y)}}}catch(g){console.warn("[markdown] code auto-detect failed",g)}}catch(h){console.warn("[markdown] processing code blocks failed",h)}})}catch(u){console.warn("[markdown] query code blocks failed",u)}r=a.body.innerHTML;const o=[];return l.forEach(u=>{o.push({level:Number(u.tagName.substring(1)),text:(u.textContent||"").trim(),id:u.id})}),{html:a.body.innerHTML,meta:s||{},toc:o}}catch(i){console.warn("post-process markdown failed",i)}return{html:r,meta:s||{},toc:[]}}function Cn(e,t){const n=new Set,s=/```\s*([a-zA-Z0-9_\-+]+)?/g,r=new Set(["then","now","if","once","so","and","or","but","when","the","a","an","as","let","const","var","export","import","from","true","false","null","npm","run","echo","sudo","this","that","have","using","some","return","returns","function","console","log","error","warn","class","new","undefined","with","select","from","where","join","on","group","order","by","having","as","into","values","like","limit","offset","create","table","index","view","insert","update","delete","returning","and","or","not","all","any","exists","case","when","then","else","end","distance","geometry","you","which","would","why","cool","other","same","everything","check"]),i=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);let a;for(;a=s.exec(e);)if(a[1]){const l=a[1].toLowerCase();if(_n.has(l)||t&&t.size&&l.length<3&&!t.has(l)&&!(Te&&Te[l]&&t.has(Te[l])))continue;if(t&&t.size){if(t.has(l)){const u=t.get(l);u&&n.add(u);continue}if(Te&&Te[l]){const u=Te[l];if(t.has(u)){const c=t.get(u)||u;n.add(c);continue}}}(i.has(l)||l.length>=5&&l.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(l)&&!r.has(l))&&n.add(l)}return n}const Ga=Object.freeze(Object.defineProperty({__proto__:null,addMarkdownExtension:Tn,detectFenceLanguages:Cn,initRendererWorker:Ln,markdownPlugins:Xe,parseMarkdownToHtml:en,setMarkdownExtensions:Za},Symbol.toStringTag,{value:"Module"}));function Qa(e,t){try{return new URL(e,t).pathname}catch{try{return new URL(e,typeof location<"u"?location.href:"http://localhost/").pathname}catch{try{return(String(t||"").replace(/\/$/,"")+"/"+String(e||"").replace(/^\//,"")).replace(/\/\\+/g,"/")}catch{return String(e||"")}}}}function Xa(e,t){const n=document.createElement("aside");n.className="menu nimbi-nav";const s=document.createElement("p");s.className="menu-label",s.textContent=e("navigation"),n.appendChild(s);const r=document.createElement("ul");return r.className="menu-list",t.forEach(i=>{const a=document.createElement("li"),l=document.createElement("a");if(l.href="#"+i.path,l.textContent=i.name,a.appendChild(l),i.children&&i.children.length){const o=document.createElement("ul");i.children.forEach(u=>{const c=document.createElement("li"),h=document.createElement("a");h.href="#"+u.path,h.textContent=u.name,c.appendChild(h),o.appendChild(c)}),a.appendChild(o)}r.appendChild(a)}),n.appendChild(r),n}function Ka(e,t,n=""){const s=document.createElement("aside");s.className="menu nimbi-toc-inner";const r=document.createElement("p");r.className="menu-label",r.textContent=e("onThisPage"),s.appendChild(r);const i=document.createElement("ul");i.className="menu-list";try{const a={};(t||[]).forEach(l=>{try{if(!l||l.level===1)return;const o=Number(l.level)>=2?Number(l.level):2,u=document.createElement("li"),c=document.createElement("a"),h=l.id||le(l.text||"");c.textContent=l.text||"";try{const g=String(n||"").replace(/^[\\.\\/]+/,""),w=g&&q&&q.has&&q.has(g)?q.get(g):g;w?c.href=`?page=${encodeURIComponent(w)}#${encodeURIComponent(h)}`:c.href=`#${encodeURIComponent(h)}`}catch(g){console.warn("[htmlBuilder] buildTocElement href normalization failed",g),c.href=`#${encodeURIComponent(h)}`}if(u.appendChild(c),o===2){i.appendChild(u),a[2]=u,Object.keys(a).forEach(g=>{Number(g)>2&&delete a[g]});return}let f=o-1;for(;f>2&&!a[f];)f--;f<2&&(f=2);let p=a[f];if(!p){i.appendChild(u),a[o]=u;return}let d=p.querySelector("ul");d||(d=document.createElement("ul"),p.appendChild(d)),d.appendChild(u),a[o]=u}catch(o){console.warn("[htmlBuilder] buildTocElement item failed",o,l)}})}catch(a){console.warn("[htmlBuilder] buildTocElement failed",a)}return s.appendChild(i),s}function hi(e){e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(n=>{n.id||(n.id=le(n.textContent||""))})}function Ya(e,t,n){try{const s=e.querySelectorAll("img");if(s&&s.length){const r=t&&t.includes("/")?t.substring(0,t.lastIndexOf("/")+1):"";s.forEach(i=>{const a=i.getAttribute("src")||"";if(a&&!(/^(https?:)?\/\//.test(a)||a.startsWith("/")))try{const l=new URL(r+a,n).toString();i.src=l;try{i.getAttribute("loading")||i.setAttribute("data-want-lazy","1")}catch(o){console.warn("[htmlBuilder] set image loading attribute failed",o)}}catch(l){console.warn("[htmlBuilder] resolve image src failed",l)}})}}catch(s){console.warn("[htmlBuilder] lazyLoadImages failed",s)}}function Rr(e,t,n){try{const s=t&&t.includes("/")?t.substring(0,t.lastIndexOf("/")+1):"";let r=null;try{const a=new URL(n,location.href);r=new URL(s||".",a).toString()}catch{try{r=new URL(s||".",location.href).toString()}catch{r=s||"./"}}const i=e.querySelectorAll("*");for(const a of Array.from(i||[]))try{const l=a.tagName?a.tagName.toLowerCase():"",o=u=>{try{const c=a.getAttribute(u)||"";if(!c||/^(https?:)?\/\//i.test(c)||c.startsWith("/")||c.startsWith("#"))return;try{a.setAttribute(u,new URL(c,r).toString())}catch(h){console.warn("[htmlBuilder] rewrite asset attribute failed",u,c,h)}}catch(c){console.warn("[htmlBuilder] rewriteAttr failed",c)}};if(a.hasAttribute&&a.hasAttribute("src")&&o("src"),a.hasAttribute&&a.hasAttribute("href")&&l!=="a"&&o("href"),a.hasAttribute&&a.hasAttribute("xlink:href")&&o("xlink:href"),a.hasAttribute&&a.hasAttribute("poster")&&o("poster"),a.hasAttribute("srcset")){const h=(a.getAttribute("srcset")||"").split(",").map(f=>f.trim()).filter(Boolean).map(f=>{const[p,d]=f.split(/\s+/,2);if(!p||/^(https?:)?\/\//i.test(p)||p.startsWith("/"))return f;try{const g=new URL(p,r).toString();return d?`${g} ${d}`:g}catch{return f}}).join(", ");a.setAttribute("srcset",h)}}catch(l){console.warn("[htmlBuilder] rewriteRelativeAssets node processing failed",l)}}catch(s){console.warn("[htmlBuilder] rewriteRelativeAssets failed",s)}}let Lr="",mn=null,Tr="";async function di(e,t,n){try{const s=e.querySelectorAll("a");if(!s||!s.length)return;let r,i;if(t===Lr&&mn)r=mn,i=Tr;else{try{r=new URL(t,location.href),i=Lt(r.pathname)}catch{try{r=new URL(t,location.href),i=Lt(r.pathname)}catch{r=null,i="/"}}Lr=t,mn=r,Tr=i}const a=new Set,l=[],o=new Set,u=[];for(const c of Array.from(s))try{const h=c.getAttribute("href")||"";if(!h||Ur(h))continue;try{if(h.startsWith("?")||h.indexOf("?")!==-1)try{const p=new URL(h,t||location.href),d=p.searchParams.get("page");if(d&&d.indexOf("/")===-1&&n){const g=n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"";if(g){const w=pe(g+d);c.setAttribute("href","?page="+encodeURIComponent(w)+(p.hash||""));continue}}}catch{}}catch{}if(h.startsWith("/")&&!h.endsWith(".md"))continue;const f=h.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(f){let p=f[1];const d=f[2];!p.startsWith("/")&&n&&(p=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+p);try{const g=new URL(p,t).pathname;let w=g.startsWith(i)?g.slice(i.length):g;w=pe(w),l.push({node:c,mdPathRaw:p,frag:d,rel:w}),q.has(w)||a.add(w)}catch(g){console.warn("[htmlBuilder] resolve mdPath failed",g)}continue}try{let p=h;!h.startsWith("/")&&n&&(h.startsWith("#")?p=n+h:p=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+h);const g=new URL(p,t).pathname||"";if(g&&g.indexOf(i)!==-1){let w=g.startsWith(i)?g.slice(i.length):g;if(w=pe(w),w=Tt(w),w||(w="_home"),!w.endsWith(".md")){let y=null;try{if(q&&q.has&&q.has(w))y=q.get(w);else try{const x=String(w||"").replace(/^.*\//,"");x&&q.has&&q.has(x)&&(y=q.get(x))}catch(x){console.warn("[htmlBuilder] mdToSlug baseName check failed",x)}}catch(x){console.warn("[htmlBuilder] mdToSlug access check failed",x)}if(!y)try{const x=String(w||"").replace(/^.*\//,"");for(const[$,M]of te||[])if(M===w||M===x){y=$;break}}catch{}y?c.setAttribute("href",`?page=${encodeURIComponent(y)}`):(o.add(w),u.push({node:c,rel:w}))}}}catch(p){console.warn("[htmlBuilder] resolving href to URL failed",p)}}catch(h){console.warn("[htmlBuilder] processing anchor failed",h)}a.size&&await Promise.all(Array.from(a).map(async c=>{try{try{const f=String(c).match(/([^\/]+)\.md$/),p=f&&f[1];if(p&&te.has(p)){try{const d=te.get(p);if(d)try{q.set(d,p)}catch(g){console.warn("[htmlBuilder] mdToSlug.set failed",g)}}catch(d){console.warn("[htmlBuilder] reading slugToMd failed",d)}return}}catch(f){console.warn("[htmlBuilder] basename slug lookup failed",f)}const h=await Se(c,t);if(h&&h.raw){const f=(h.raw||"").match(/^#\s+(.+)$/m);if(f&&f[1]){const p=le(f[1].trim());if(p)try{te.set(p,c),q.set(c,p)}catch(d){console.warn("[htmlBuilder] setting slug mapping failed",d)}}}}catch(h){console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed",h)}})),o.size&&await Promise.all(Array.from(o).map(async c=>{try{const h=await Se(c,t);if(h&&h.raw)try{const p=(Qn||new DOMParser).parseFromString(h.raw,"text/html"),d=p.querySelector("title"),g=p.querySelector("h1"),w=d&&d.textContent&&d.textContent.trim()?d.textContent.trim():g&&g.textContent?g.textContent.trim():null;if(w){const y=le(w);if(y)try{te.set(y,c),q.set(c,y)}catch(x){console.warn("[htmlBuilder] setting html slug mapping failed",x)}}}catch(f){console.warn("[htmlBuilder] parse fetched HTML failed",f)}}catch(h){console.warn("[htmlBuilder] fetchMarkdown for htmlPending failed",h)}}));for(const c of l){const{node:h,frag:f,rel:p}=c;let d=null;try{q.has(p)&&(d=q.get(p))}catch(g){console.warn("[htmlBuilder] mdToSlug access failed",g)}d?f?h.setAttribute("href",`?page=${encodeURIComponent(d)}#${encodeURIComponent(f)}`):h.setAttribute("href",`?page=${encodeURIComponent(d)}`):f?h.setAttribute("href",`?page=${encodeURIComponent(p)}#${encodeURIComponent(f)}`):h.setAttribute("href",`?page=${encodeURIComponent(p)}`)}for(const c of u){const{node:h,rel:f}=c;let p=null;try{q.has(f)&&(p=q.get(f))}catch(d){console.warn("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo",d)}if(!p)try{const d=String(f||"").replace(/^.*\//,"");q.has(d)&&(p=q.get(d))}catch(d){console.warn("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo",d)}p?h.setAttribute("href",`?page=${encodeURIComponent(p)}`):h.setAttribute("href",`?page=${encodeURIComponent(f)}`)}}catch(s){console.warn("[htmlBuilder] rewriteAnchors failed",s)}}function Va(e,t,n,s){const r=t.querySelector("h1"),i=r?(r.textContent||"").trim():"";let a="";try{let l="";try{e&&e.meta&&e.meta.title&&(l=String(e.meta.title).trim())}catch{}if(!l&&i&&(l=i),!l)try{const o=t.querySelector("h2");o&&o.textContent&&(l=String(o.textContent).trim())}catch{}!l&&n&&(l=String(n)),l&&(a=le(l)),a||(a="_home");try{n&&(te.set(a,n),q.set(n,a))}catch(o){console.warn("[htmlBuilder] computeSlug set slug mapping failed",o)}try{let o="?page="+encodeURIComponent(a);try{const u=s||(location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):"");u&&(o+="#"+encodeURIComponent(u))}catch(u){console.warn("[htmlBuilder] computeSlug hash decode failed",u)}try{history.replaceState({page:a},"",o)}catch(u){console.warn("[htmlBuilder] computeSlug history replace failed",u)}}catch(o){console.warn("[htmlBuilder] computeSlug inner failed",o)}}catch(l){console.warn("[htmlBuilder] computeSlug failed",l)}return{topH1:r,h1Text:i,slugKey:a}}async function Ja(e,t){if(!e||!e.length)return;const n=new Set;for(const o of Array.from(e||[]))try{const u=o.getAttribute("href")||"";if(!u)continue;let f=pe(u).split(/::|#/,2)[0];try{const d=f.indexOf("?");d!==-1&&(f=f.slice(0,d))}catch{}if(!f||(f.includes(".")||(f=f+".html"),!/\.html(?:$|[?#])/.test(f)&&!f.toLowerCase().endsWith(".html")))continue;const p=f;try{if(q&&q.has&&q.has(p))continue}catch(d){console.warn("[htmlBuilder] mdToSlug check failed",d)}try{let d=!1;for(const g of te.values())if(g===p){d=!0;break}if(d)continue}catch(d){console.warn("[htmlBuilder] slugToMd iteration failed",d)}n.add(p)}catch(u){console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed",u)}if(!n.size)return;const s=async o=>{try{const u=await Se(o,t);if(u&&u.raw)try{const h=(Qn||new DOMParser).parseFromString(u.raw,"text/html"),f=h.querySelector("title"),p=h.querySelector("h1"),d=f&&f.textContent&&f.textContent.trim()?f.textContent.trim():p&&p.textContent?p.textContent.trim():null;if(d){const g=le(d);if(g)try{te.set(g,o),q.set(o,g)}catch(w){console.warn("[htmlBuilder] set slugToMd/mdToSlug failed",w)}}}catch(c){console.warn("[htmlBuilder] parse HTML title failed",c)}}catch(u){console.warn("[htmlBuilder] fetchAndExtract failed",u)}},r=5,i=Array.from(n);let a=0;const l=[];for(;a<i.length;){const o=i.slice(a,a+r);l.push(Promise.all(o.map(s))),a+=r}await Promise.all(l)}async function eo(e,t){if(!e||!e.length)return;const n=[],s=new Set;let r="";try{const i=new URL(t,typeof location<"u"?location.href:"http://localhost/");r=Lt(i.pathname)}catch(i){r="",console.warn("[htmlBuilder] preMapMdSlugs parse base failed",i)}for(const i of Array.from(e||[]))try{const a=i.getAttribute("href")||"";if(!a)continue;const l=a.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(l){let o=pe(l[1]);try{let u;try{u=Qa(o,t)}catch(h){u=o,console.warn("[htmlBuilder] resolve mdPath URL failed",h)}const c=u&&r&&u.startsWith(r)?u.slice(r.length):String(u||"").replace(/^\//,"");n.push({rel:c}),q.has(c)||s.add(c)}catch(u){console.warn("[htmlBuilder] rewriteAnchors failed",u)}continue}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed",a)}s.size&&await Promise.all(Array.from(s).map(async i=>{try{const a=String(i).match(/([^\/]+)\.md$/),l=a&&a[1];if(l&&te.has(l)){try{const o=te.get(l);o&&q.set(o,l)}catch(o){console.warn("[htmlBuilder] preMapMdSlugs slug map access failed",o)}return}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs basename check failed",a)}try{const a=await Se(i,t);if(a&&a.raw){const l=(a.raw||"").match(/^#\s+(.+)$/m);if(l&&l[1]){const o=le(l[1].trim());if(o)try{te.set(o,i),q.set(i,o)}catch(u){console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed",u)}}}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs fetch failed",a)}}))}const Qn=typeof DOMParser<"u"?new DOMParser:null;function wn(e){try{const n=(Qn||new DOMParser).parseFromString(e||"","text/html");hi(n);try{n.querySelectorAll("img").forEach(o=>{try{o.getAttribute("loading")||o.setAttribute("data-want-lazy","1")}catch(u){console.warn("[htmlBuilder] parseHtml set image loading attribute failed",u)}})}catch(l){console.warn("[htmlBuilder] parseHtml query images failed",l)}n.querySelectorAll("pre code, code[class]").forEach(l=>{try{const o=l.getAttribute&&l.getAttribute("class")||l.className||"",u=o.match(/language-([a-zA-Z0-9_+-]+)/)||o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(u&&u[1]){const c=(u[1]||"").toLowerCase(),h=ne.size&&(ne.get(c)||ne.get(String(c).toLowerCase()))||c;try{(async()=>{try{await ut(h)}catch(f){console.warn("[htmlBuilder] registerLanguage failed",f)}})()}catch(f){console.warn("[htmlBuilder] schedule registerLanguage failed",f)}}else try{if(fe&&typeof fe.getLanguage=="function"&&fe.getLanguage("plaintext")){const c=fe.highlight?fe.highlight(l.textContent||"",{language:"plaintext"}):null;c&&c.value&&(l.innerHTML=c.value)}}catch(c){console.warn("[htmlBuilder] plaintext highlight fallback failed",c)}}catch(o){console.warn("[htmlBuilder] code element processing failed",o)}});const r=[];n.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(l=>{r.push({level:Number(l.tagName.substring(1)),text:(l.textContent||"").trim(),id:l.id})});const a={};try{const l=n.querySelector("title");l&&l.textContent&&String(l.textContent).trim()&&(a.title=String(l.textContent).trim())}catch{}return{html:n.body.innerHTML,meta:a,toc:r}}catch(t){return console.warn("[htmlBuilder] parseHtml failed",t),{html:e||"",meta:{},toc:[]}}}async function to(e){const t=Cn?Cn(e||"",ne):new Set,n=new Set(t),s=[];for(const r of n)try{const i=ne.size&&(ne.get(r)||ne.get(String(r).toLowerCase()))||r;try{s.push(ut(i))}catch(a){console.warn("[htmlBuilder] ensureLanguages push canonical failed",a)}if(String(r)!==String(i))try{s.push(ut(r))}catch(a){console.warn("[htmlBuilder] ensureLanguages push alias failed",a)}}catch(i){console.warn("[htmlBuilder] ensureLanguages inner failed",i)}try{await Promise.all(s)}catch(r){console.warn("[htmlBuilder] ensureLanguages failed",r)}}async function no(e){if(await to(e),en){const t=await en(e||"");return!t||typeof t!="object"?{html:String(e||""),meta:{},toc:[]}:(Array.isArray(t.toc)||(t.toc=[]),t.meta||(t.meta={}),t)}return{html:String(e||""),meta:{},toc:[]}}async function ro(e,t,n,s,r){let i=null;if(t.isHtml)try{const h=typeof DOMParser<"u"?new DOMParser:null;if(h){const f=h.parseFromString(t.raw||"","text/html");try{Rr(f.body,n,r)}catch(p){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)",p)}i=wn(f.documentElement&&f.documentElement.outerHTML?f.documentElement.outerHTML:t.raw||"")}else i=wn(t.raw||"")}catch{i=wn(t.raw||"")}else i=await no(t.raw||"");const a=document.createElement("article");a.className="nimbi-article content",a.innerHTML=i.html;try{Rr(a,n,r)}catch(h){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle",h)}try{hi(a)}catch(h){console.warn("[htmlBuilder] addHeadingIds failed",h)}try{a.querySelectorAll("pre code, code[class]").forEach(f=>{try{const p=f.getAttribute&&f.getAttribute("class")||f.className||"",d=String(p||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(d)try{f.setAttribute&&f.setAttribute("class",d)}catch(g){f.className=d,console.warn("[htmlBuilder] set element class failed",g)}else try{f.removeAttribute&&f.removeAttribute("class")}catch(g){f.className="",console.warn("[htmlBuilder] remove element class failed",g)}}catch(p){console.warn("[htmlBuilder] code element cleanup failed",p)}})}catch(h){console.warn("[htmlBuilder] processing code elements failed",h)}try{zr(a)}catch(h){console.warn("[htmlBuilder] observeCodeBlocks failed",h)}Ya(a,n,r);const{topH1:l,h1Text:o,slugKey:u}=Va(i,a,n,s);try{await so(a,r,n)}catch(h){console.warn("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread",h),await di(a,r,n)}const c=Ka(e,i.toc,n);return{article:a,parsed:i,toc:c,topH1:l,h1Text:o,slugKey:u}}function io(e){if(!(!e||!e.querySelectorAll))try{const t=Array.from(e.querySelectorAll("script"));for(const n of t)try{const s=document.createElement("script");for(const i of Array.from(n.attributes||[]))try{s.setAttribute(i.name,i.value)}catch{}if(!n.src){try{s.type="module"}catch{}s.textContent=n.textContent||""}if(n.src)try{if(document.querySelector&&document.querySelector(`script[src="${n.src}"]`)){n.parentNode&&n.parentNode.removeChild(n);continue}}catch{}const r=n.src||"<inline>";s.addEventListener("error",i=>{try{console.warn("[htmlBuilder] injected script error",{src:r,ev:i})}catch{}}),s.addEventListener("load",()=>{try{console.info("[htmlBuilder] injected script loaded",{src:r,hasNimbi:!!(window&&window.nimbiCMS)})}catch{}}),(document.head||document.body||document.documentElement).appendChild(s),n.parentNode&&n.parentNode.removeChild(n);try{console.info("[htmlBuilder] executed injected script",r)}catch{}}catch(s){console.warn("[htmlBuilder] execute injected script failed",s)}}catch{}}function Cr(e,t,n){e&&(e.innerHTML="");const s=document.createElement("article");s.className="nimbi-article content nimbi-not-found";const r=document.createElement("h1");r.textContent=t&&t("notFound")||"Page not found";const i=document.createElement("p");i.textContent=n&&n.message?String(n.message):"Failed to resolve the requested page.",s.appendChild(r),s.appendChild(i),e&&e.appendChild&&e.appendChild(s)}async function so(e,t,n){return di(e,t,n)}function ao(e){try{e.addEventListener("click",t=>{const n=t.target&&t.target.closest?t.target.closest("a"):null;if(!n)return;const s=n.getAttribute("href")||"";try{const r=new URL(s,location.href),i=r.searchParams.get("page"),a=r.hash?r.hash.replace(/^#/,""):null;if(!i&&!a)return;t.preventDefault();let l=null;try{history&&history.state&&history.state.page&&(l=history.state.page)}catch(o){l=null,console.warn("[htmlBuilder] access history.state failed",o)}try{l||(l=new URL(location.href).searchParams.get("page"))}catch(o){console.warn("[htmlBuilder] parse current location failed",o)}if(!i&&a||i&&l&&String(i)===String(l)){try{if(!i&&a)try{history.replaceState(history.state,"",(location.pathname||"")+(location.search||"")+(a?"#"+encodeURIComponent(a):""))}catch(o){console.warn("[htmlBuilder] history.replaceState failed",o)}else try{history.replaceState({page:l||i},"","?page="+encodeURIComponent(l||i)+(a?"#"+encodeURIComponent(a):""))}catch(o){console.warn("[htmlBuilder] history.replaceState failed",o)}}catch(o){console.warn("[htmlBuilder] update history for anchor failed",o)}try{t.stopImmediatePropagation&&t.stopImmediatePropagation(),t.stopPropagation&&t.stopPropagation()}catch(o){console.warn("[htmlBuilder] stopPropagation failed",o)}try{Mn(a)}catch(o){console.warn("[htmlBuilder] scrollToAnchorOrTop failed",o)}return}history.pushState({page:i},"","?page="+encodeURIComponent(i)+(a?"#"+encodeURIComponent(a):""));try{if(typeof window<"u"&&typeof window.renderByQuery=="function")try{window.renderByQuery()}catch(o){console.warn("[htmlBuilder] window.renderByQuery failed",o)}else if(typeof window<"u")try{window.dispatchEvent(new PopStateEvent("popstate"))}catch(o){console.warn("[htmlBuilder] dispatch popstate failed",o)}else try{renderByQuery()}catch(o){console.warn("[htmlBuilder] renderByQuery failed",o)}}catch(o){console.warn("[htmlBuilder] SPA navigation invocation failed",o)}}catch(r){console.warn("[htmlBuilder] non-URL href in attachTocClickHandler",r)}})}catch(t){console.warn("[htmlBuilder] attachTocClickHandler failed",t)}}function Mn(e){const t=document.querySelector(".nimbi-cms")||null;if(e){const n=document.getElementById(e);if(n)try{const s=()=>{try{if(t&&t.scrollTo&&t.contains(n)){const r=n.getBoundingClientRect().top-t.getBoundingClientRect().top+t.scrollTop;t.scrollTo({top:r,behavior:"smooth"})}else try{n.scrollIntoView({behavior:"smooth",block:"start"})}catch{try{n.scrollIntoView()}catch(i){console.warn("[htmlBuilder] scrollIntoView failed",i)}}}catch{try{n.scrollIntoView()}catch(i){console.warn("[htmlBuilder] final scroll fallback failed",i)}}};try{requestAnimationFrame(()=>setTimeout(s,50))}catch(r){console.warn("[htmlBuilder] scheduling scroll failed",r),setTimeout(s,50)}}catch(s){try{n.scrollIntoView()}catch(r){console.warn("[htmlBuilder] final scroll fallback failed",r)}console.warn("[htmlBuilder] doScroll failed",s)}}else try{t&&t.scrollTo?t.scrollTo({top:0,behavior:"smooth"}):window.scrollTo(0,0)}catch(n){try{window.scrollTo(0,0)}catch(s){console.warn("[htmlBuilder] window.scrollTo failed",s)}console.warn("[htmlBuilder] scroll to top failed",n)}}function oo(e,t,{mountOverlay:n=null,container:s=null,mountEl:r=null,navWrap:i=null,t:a=null}={}){try{const l=a||(g=>typeof g=="string"?g:""),o=s||document.querySelector(".nimbi-cms"),u=r||document.querySelector(".nimbi-mount"),c=n||document.querySelector(".nimbi-overlay"),h=i||document.querySelector(".nimbi-nav-wrap");let p=document.querySelector(".nimbi-scroll-top");if(!p){p=document.createElement("button"),p.className="nimbi-scroll-top button is-primary is-rounded is-small",p.setAttribute("aria-label",l("scrollToTop")),p.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';try{c&&c.appendChild?c.appendChild(p):o&&o.appendChild?o.appendChild(p):u&&u.appendChild?u.appendChild(p):document.body.appendChild(p)}catch{try{document.body.appendChild(p)}catch(w){console.warn("[htmlBuilder] append scroll top button failed",w)}}try{try{Or(p)}catch{}}catch(g){console.warn("[htmlBuilder] set scroll-top button theme registration failed",g)}p.addEventListener("click",()=>{try{s&&s.scrollTo?s.scrollTo({top:0,left:0,behavior:"smooth"}):r&&r.scrollTo?r.scrollTo({top:0,left:0,behavior:"smooth"}):window.scrollTo({top:0,left:0,behavior:"smooth"})}catch{try{s&&(s.scrollTop=0)}catch(w){console.warn("[htmlBuilder] fallback container scrollTop failed",w)}try{r&&(r.scrollTop=0)}catch(w){console.warn("[htmlBuilder] fallback mountEl scrollTop failed",w)}try{document.documentElement.scrollTop=0}catch(w){console.warn("[htmlBuilder] fallback document scrollTop failed",w)}}})}const d=h&&h.querySelector?h.querySelector(".menu-label"):null;if(t){if(!p._nimbiObserver){const g=new IntersectionObserver(w=>{for(const y of w)y.target instanceof Element&&(y.isIntersecting?(p.classList.remove("show"),d&&d.classList.remove("show")):(p.classList.add("show"),d&&d.classList.add("show")))},{root:s instanceof Element?s:r instanceof Element?r:null,threshold:0});p._nimbiObserver=g}try{p._nimbiObserver.disconnect()}catch(g){console.warn("[htmlBuilder] observer disconnect failed",g)}try{p._nimbiObserver.observe(t)}catch(g){console.warn("[htmlBuilder] observer observe failed",g)}try{const g=()=>{try{const w=o instanceof Element?o.getBoundingClientRect():{top:0,bottom:window.innerHeight},y=t.getBoundingClientRect();!(y.bottom<w.top||y.top>w.bottom)?(p.classList.remove("show"),d&&d.classList.remove("show")):(p.classList.add("show"),d&&d.classList.add("show"))}catch(w){console.warn("[htmlBuilder] checkIntersect failed",w)}};g(),"IntersectionObserver"in window||setTimeout(g,100)}catch(g){console.warn("[htmlBuilder] checkIntersect outer failed",g)}}else{p.classList.remove("show"),d&&d.classList.remove("show");const g=s instanceof Element?s:r instanceof Element?r:window,w=()=>{try{(g===window?window.scrollY:g.scrollTop||0)>10?(p.classList.add("show"),d&&d.classList.add("show")):(p.classList.remove("show"),d&&d.classList.remove("show"))}catch(y){console.warn("[htmlBuilder] onScroll handler failed",y)}};Gt(()=>g.addEventListener("scroll",w)),w()}}catch(l){console.warn("[htmlBuilder] ensureScrollTopButton failed",l)}}function Mr(e,t){try{if(!e)return;try{const n=e[t];if(typeof n<"u")return n}catch{}try{if(e.default)return e.default[t]}catch{}return}catch{return}}async function lo(e,t,n,s,r,i,a,l,o="eager",u=1,c=void 0,h="favicon"){if(!e||!(e instanceof HTMLElement))throw new TypeError("navbarWrap must be an HTMLElement");const f=typeof DOMParser<"u"?new DOMParser:null,p=f?f.parseFromString(n||"","text/html"):null,d=p?p.querySelectorAll("a"):[];await Gt(()=>Ja(d,s)),await Gt(()=>eo(d,s));let g=null,w=null,y=null;function x(){try{const v=document.querySelector(".navbar-burger"),R=v&&v.dataset?v.dataset.target:null,E=R?document.getElementById(R):null;v&&v.classList.contains("is-active")&&(v.classList.remove("is-active"),v.setAttribute("aria-expanded","false"),E&&E.classList.remove("is-active"))}catch(v){console.warn&&console.warn("[nimbi-cms] closeMobileMenu failed",v)}}const $=()=>g||(g=(async()=>{try{const v=await Promise.resolve().then(()=>Ft),R=Mr(v,"buildSearchIndexWorker"),E=Mr(v,"buildSearchIndex");if(o==="lazy"&&typeof R=="function")try{const b=await R(s,u,c);if(b&&b.length)return b}catch(b){console.warn&&console.warn("[nimbi-cms] worker builder threw",b)}return typeof E=="function"?await E(s,u,c):[]}catch(v){return console.warn("[nimbi-cms] buildSearchIndex failed",v),[]}finally{if(w){try{w.removeAttribute("disabled")}catch{}try{y&&y.classList.remove("is-loading")}catch{}}}})(),g.then(v=>{try{const R=String(w&&w.value||"").trim().toLowerCase();if(!R||!Array.isArray(v)||!v.length)return;const E=v.filter(L=>L.title&&L.title.toLowerCase().includes(R)||L.excerpt&&L.excerpt.toLowerCase().includes(R));if(!E||!E.length)return;const b=document.getElementById("nimbi-search-results");if(!b)return;b.innerHTML="",E.slice(0,10).forEach(L=>{const N=document.createElement("div");if(N.className="nimbi-search-result",L.parentTitle){const ee=document.createElement("div");ee.textContent=L.parentTitle,ee.className="nimbi-search-title nimbi-search-parent",N.appendChild(ee)}const G=document.createElement("a");G.className="block",G.href="?page="+encodeURIComponent(L.slug),G.textContent=L.title,G.addEventListener("click",()=>{try{b.style.display="none"}catch{}}),N.appendChild(G),b.appendChild(N)});try{b.style.display="block"}catch{}}catch{}}).catch(()=>{}),g),M=document.createElement("nav");M.className="navbar",M.setAttribute("role","navigation"),M.setAttribute("aria-label","main navigation");const _=document.createElement("div");_.className="navbar-brand";const I=d[0],H=document.createElement("a");if(H.className="navbar-item",I){const v=I.getAttribute("href")||"#";try{const E=new URL(v,location.href).searchParams.get("page");E?H.href="?page="+encodeURIComponent(decodeURIComponent(E)):(H.href="?page="+encodeURIComponent(r),H.textContent=i("home"))}catch{H.href="?page="+encodeURIComponent(r),H.textContent=i("home")}}else H.href="?page="+encodeURIComponent(r),H.textContent=i("home");async function K(v){try{if(!v||v==="none")return null;if(v==="favicon")try{const R=document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');if(!R)return null;const E=R.getAttribute("href")||"";return E&&/\.png(?:\?|$)/i.test(E)?new URL(E,location.href).toString():null}catch{return null}if(v==="copy-first"||v==="move-first")try{const R=await Se(r,s);if(!R||!R.raw)return null;const L=new DOMParser().parseFromString(R.raw,"text/html").querySelector("img");if(!L)return null;const N=L.getAttribute("src")||"";if(!N)return null;const G=new URL(N,location.href).toString();if(v==="move-first")try{document.documentElement.setAttribute("data-nimbi-logo-moved",G)}catch{}return G}catch{return null}try{return new URL(v,location.href).toString()}catch{return null}}catch{return null}}let ae=null;try{ae=await K(h)}catch{ae=null}if(ae)try{const v=document.createElement("img");v.className="nimbi-navbar-logo";const R=i&&typeof i=="function"&&(i("home")||i("siteLogo"))||"";v.alt=R,v.title=R,v.src=ae;try{H.innerHTML=""}catch{H.textContent=""}H.appendChild(v)}catch{}_.appendChild(H),H.addEventListener("click",function(v){const R=H.getAttribute("href")||"";if(R.startsWith("?page=")){v.preventDefault();const E=new URL(R,location.href),b=E.searchParams.get("page"),L=E.hash?E.hash.replace(/^#/,""):null;history.pushState({page:b},"","?page="+encodeURIComponent(b)+(L?"#"+encodeURIComponent(L):""));try{a()}catch(N){console.warn("[nimbi-cms] renderByQuery failed",N)}try{x()}catch{}}});const W=document.createElement("a");W.className="navbar-burger",W.setAttribute("role","button"),W.setAttribute("aria-label","menu"),W.setAttribute("aria-expanded","false");const U="nimbi-navbar-menu";W.dataset.target=U,W.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>',_.appendChild(W);try{W.addEventListener("click",v=>{try{const R=W.dataset&&W.dataset.target?W.dataset.target:null,E=R?document.getElementById(R):null;W.classList.contains("is-active")?(W.classList.remove("is-active"),W.setAttribute("aria-expanded","false"),E&&E.classList.remove("is-active")):(W.classList.add("is-active"),W.setAttribute("aria-expanded","true"),E&&E.classList.add("is-active"))}catch(R){console.warn("[nimbi-cms] navbar burger toggle failed",R)}})}catch(v){console.warn("[nimbi-cms] burger event binding failed",v)}const Z=document.createElement("div");Z.className="navbar-menu",Z.id=U;const Y=document.createElement("div");Y.className="navbar-start";let J,F,k;if(!l)J=null,w=null,k=null;else{J=document.createElement("div"),J.className="navbar-end",F=document.createElement("div"),F.className="navbar-item",w=document.createElement("input"),w.className="input",w.type="search",w.placeholder=i("searchPlaceholder")||"",w.id="nimbi-search",o==="eager"&&(w.disabled=!0),y=document.createElement("div"),y.className="control",o==="eager"&&y.classList.add("is-loading"),y.appendChild(w),F.appendChild(y),k=document.createElement("div"),k.id="nimbi-search-results",k.className="box",F.appendChild(k),J.appendChild(F);const v=E=>{if(k.innerHTML="",!E.length){k.classList.remove("is-open");try{k.style.display="none"}catch{}return}E.forEach(b=>{const L=document.createElement("div");if(L.className="nimbi-search-result",b.parentTitle){const G=document.createElement("div");G.textContent=b.parentTitle,G.className="nimbi-search-title nimbi-search-parent",L.appendChild(G)}const N=document.createElement("a");N.className="block",N.href="?page="+encodeURIComponent(b.slug),N.textContent=b.title,N.addEventListener("click",()=>{k.style.display="none"}),L.appendChild(N),k.appendChild(L)});try{k.style.display="block"}catch{}k.classList.add("is-open")},R=(E,b)=>{let L=null;return(...N)=>{L&&clearTimeout(L),L=setTimeout(()=>E(...N),b)}};if(w){const E=R(async()=>{const b=document.querySelector("input#nimbi-search"),L=String(b&&b.value||"").trim().toLowerCase();if(!L){v([]);return}try{await $();const G=(await g).filter(ee=>ee.title&&ee.title.toLowerCase().includes(L)||ee.excerpt&&ee.excerpt.toLowerCase().includes(L));v(G.slice(0,10))}catch(N){console.warn("[nimbi-cms] search input handler failed",N),v([])}},50);try{w.addEventListener("input",E)}catch{}try{document.addEventListener("input",b=>{try{b&&b.target&&b.target.id==="nimbi-search"&&E(b)}catch{}},!0)}catch{}}if(o==="eager"){try{g=$()}catch(E){console.warn("[nimbi-cms] eager search index init failed",E),g=Promise.resolve([])}g.finally(()=>{const E=document.querySelector("input#nimbi-search");if(E){try{E.removeAttribute("disabled")}catch{}try{y&&y.classList.remove("is-loading")}catch{}}})}try{const E=b=>{try{const L=b&&b.target;if(!k||!k.classList.contains("is-open")&&k.style&&k.style.display!=="block"||L&&(k.contains(L)||w&&(L===w||w.contains&&w.contains(L))))return;try{k.style.display="none"}catch{}try{k.classList.remove("is-open")}catch{}}catch{}};document.addEventListener("click",E,!0),document.addEventListener("touchstart",E,!0)}catch{}}for(let v=0;v<d.length;v++){const R=d[v];if(v===0)continue;const E=R.getAttribute("href")||"#",b=document.createElement("a");b.className="navbar-item";try{if(/^[^#]*\.md(?:$|[#?])/.test(E)||E.endsWith(".md")){const N=pe(E).split(/::|#/,2),G=N[0],ee=N[1];b.href="?page="+encodeURIComponent(G)+(ee?"#"+encodeURIComponent(ee):"")}else if(/\.html(?:$|[#?])/.test(E)||E.endsWith(".html")){const N=pe(E).split(/::|#/,2);let G=N[0];G&&!G.toLowerCase().endsWith(".html")&&(G=G+".html");const ee=N[1];try{const re=await Se(G,s);if(re&&re.raw)try{const we=new DOMParser().parseFromString(re.raw,"text/html"),ze=we.querySelector("title"),nt=we.querySelector("h1"),Ke=ze&&ze.textContent&&ze.textContent.trim()?ze.textContent.trim():nt&&nt.textContent?nt.textContent.trim():null;if(Ke){const rt=le(Ke);if(rt){try{te.set(rt,G),q.set(G,rt)}catch(an){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",an)}b.href="?page="+encodeURIComponent(rt)+(ee?"#"+encodeURIComponent(ee):"")}else b.href="?page="+encodeURIComponent(G)+(ee?"#"+encodeURIComponent(ee):"")}else b.href="?page="+encodeURIComponent(G)+(ee?"#"+encodeURIComponent(ee):"")}catch{b.href="?page="+encodeURIComponent(G)+(ee?"#"+encodeURIComponent(ee):"")}else b.href=E}catch{b.href=E}}else b.href=E}catch(L){console.warn("[nimbi-cms] nav item href parse failed",L),b.href=E}try{const L=R.textContent&&String(R.textContent).trim()?String(R.textContent).trim():null;if(L)try{const N=le(L);if(N){const G=b.getAttribute&&b.getAttribute("href")?b.getAttribute("href"):"";try{const re=new URL(G,location.href).searchParams.get("page");if(re){const ue=decodeURIComponent(re);try{te.set(N,ue),q.set(ue,N)}catch(we){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",we)}}}catch(ee){console.warn("[nimbi-cms] nav slug mapping failed",ee)}}}catch(N){console.warn("[nimbi-cms] nav slug mapping failed",N)}}catch(L){console.warn("[nimbi-cms] nav slug mapping failed",L)}b.textContent=R.textContent||E,Y.appendChild(b)}Z.appendChild(Y),J&&Z.appendChild(J),M.appendChild(_),M.appendChild(Z),e.appendChild(M);try{const v=R=>{try{const E=M&&M.querySelector?M.querySelector(".navbar-burger"):document.querySelector(".navbar-burger");if(!E||!E.classList.contains("is-active"))return;const b=E&&E.closest?E.closest(".navbar"):M;if(b&&b.contains(R.target))return;x()}catch{}};document.addEventListener("click",v,!0),document.addEventListener("touchstart",v,!0)}catch{}try{Z.addEventListener("click",v=>{const R=v.target&&v.target.closest?v.target.closest("a"):null;if(!R)return;const E=R.getAttribute("href")||"";try{const b=new URL(E,location.href),L=b.searchParams.get("page"),N=b.hash?b.hash.replace(/^#/,""):null;if(L){v.preventDefault(),history.pushState({page:L},"","?page="+encodeURIComponent(L)+(N?"#"+encodeURIComponent(N):""));try{a()}catch(G){console.warn("[nimbi-cms] renderByQuery failed",G)}}}catch(b){console.warn("[nimbi-cms] navbar click handler failed",b)}try{const b=M&&M.querySelector?M.querySelector(".navbar-burger"):null,L=b&&b.dataset?b.dataset.target:null,N=L?document.getElementById(L):null;b&&b.classList.contains("is-active")&&(b.classList.remove("is-active"),b.setAttribute("aria-expanded","false"),N&&N.classList.remove("is-active"))}catch(b){console.warn("[nimbi-cms] mobile menu close failed",b)}})}catch(v){console.warn("[nimbi-cms] attach content click handler failed",v)}try{t.addEventListener("click",v=>{const R=v.target&&v.target.closest?v.target.closest("a"):null;if(!R)return;const E=R.getAttribute("href")||"";if(E&&!Ur(E))try{const b=new URL(E,location.href),L=b.searchParams.get("page"),N=b.hash?b.hash.replace(/^#/,""):null;if(L){v.preventDefault(),history.pushState({page:L},"","?page="+encodeURIComponent(L)+(N?"#"+encodeURIComponent(N):""));try{a()}catch(G){console.warn("[nimbi-cms] renderByQuery failed",G)}}}catch(b){console.warn("[nimbi-cms] container click URL parse failed",b)}})}catch(v){console.warn("[nimbi-cms] build navbar failed",v)}return{navbar:M,linkEls:d}}try{document.addEventListener("input",e=>{try{if(e&&e.target&&e.target.id==="nimbi-search"){const t=document.getElementById("nimbi-search-results");if(t&&e.target&&e.target.value)try{t.style.display="block"}catch{}}}catch{}},!0)}catch{}var bn,_r;function co(){if(_r)return bn;_r=1;function e(i,a){return a.some(([l,o])=>l<=i&&i<=o)}function t(i){if(typeof i!="string")return!1;const a=i.charCodeAt(0);return e(a,[[12352,12447],[19968,40959],[44032,55203],[131072,191456]])}function n(i){return` 
\r	`.includes(i)}function s(i){if(typeof i!="string")return!1;const a=i.charCodeAt(0);return e(a,[[33,47],[58,64],[91,96],[123,126],[12288,12351],[65280,65519]])}function r(i,a={}){let l=0,o=0,u=i.length-1;const c=a.wordsPerMinute||200,h=a.wordBound||n;for(;h(i[o]);)o++;for(;h(i[u]);)u--;const f=`${i}
`;for(let w=o;w<=u;w++)if((t(f[w])||!h(f[w])&&(h(f[w+1])||t(f[w+1])))&&l++,t(f[w]))for(;w<=u&&(s(f[w+1])||h(f[w+1]));)w++;const p=l/c,d=Math.round(p*60*1e3);return{text:Math.ceil(p.toFixed(2))+" min read",minutes:p,time:d,words:l}}return bn=r,bn}var uo=co();const ho=Ir(uo);function $r(e,t){let n=document.querySelector(`meta[name="${e}"]`);n||(n=document.createElement("meta"),n.setAttribute("name",e),document.head.appendChild(n)),n.setAttribute("content",t)}function at(e,t,n){let s=`meta[${e}="${t}"]`,r=document.querySelector(s);r||(r=document.createElement("meta"),r.setAttribute(e,t),document.head.appendChild(r)),r.setAttribute("content",n)}function fo(e,t){try{let n=document.querySelector(`link[rel="${e}"]`);n||(n=document.createElement("link"),n.setAttribute("rel",e),document.head.appendChild(n)),n.setAttribute("href",t)}catch(n){console.warn("[seoManager] upsertLinkRel failed",n)}}function po(e,t,n,s){const r=t&&String(t).trim()?t:e.title||document.title;at("property","og:title",r);const i=s&&String(s).trim()?s:e.description||"";i&&String(i).trim()&&at("property","og:description",i),at("name","twitter:card",e.twitter_card||"summary_large_image");const a=n||e.image;a&&(at("property","og:image",a),at("name","twitter:image",a))}function go(e,t,n,s,r=""){const i=e.meta||{},a=document&&document.querySelector&&document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",l=s&&String(s).trim()?s:i.description&&String(i.description).trim()?i.description:a&&String(a).trim()?a:"";l&&String(l).trim()&&$r("description",l),$r("robots",i.robots||"index,follow"),po(i,t,n,l)}function mo(){try{const e=['meta[name="site"]','meta[name="site-name"]','meta[name="siteName"]','meta[property="og:site_name"]','meta[name="twitter:site"]'];for(const t of e){const n=document.querySelector(t);if(n){const s=n.getAttribute("content")||"";if(s&&s.trim())return s.trim()}}}catch(e){console.warn("[seoManager] getSiteNameFromMeta failed",e)}return""}function wo(e,t,n,s,r,i=""){try{const a=e.meta||{},l=n&&String(n).trim()?n:a.title||i||document.title,o=r&&String(r).trim()?r:a.description||document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",u=s||a.image||null;let c="";try{if(t){const d=pe(t);try{c=(location.origin+location.pathname).split("?")[0]+"?page="+encodeURIComponent(d)}catch{c=location.href.split("#")[0]}}else c=location.href.split("#")[0]}catch(d){c=location.href.split("#")[0],console.warn("[seoManager] compute canonical failed",d)}c&&fo("canonical",c);try{at("property","og:url",c)}catch(d){console.warn("[seoManager] upsertMeta og:url failed",d)}const h={"@context":"https://schema.org","@type":"Article",headline:l||"",description:o||"",url:c||location.href.split("#")[0]};u&&(h.image=String(u)),a.date&&(h.datePublished=a.date),a.dateModified&&(h.dateModified=a.dateModified);const f="nimbi-jsonld";let p=document.getElementById(f);p||(p=document.createElement("script"),p.type="application/ld+json",p.id=f,document.head.appendChild(p)),p.textContent=JSON.stringify(h,null,2)}catch(a){console.warn("[seoManager] setStructuredData failed",a)}}function bo(e,t,n,s,r,i,a,l,o,u,c){try{const h=s.querySelector(".menu-label");h&&(h.textContent=l&&l.textContent||e("onThisPage"))}catch(h){console.warn("[seoManager] update toc label failed",h)}try{const h=n.meta&&n.meta.title?String(n.meta.title).trim():"",f=r.querySelector("img"),p=f&&(f.getAttribute("src")||f.src)||null;let d="";try{let y="";try{const x=l||(r&&r.querySelector?r.querySelector("h1"):null);if(x){let $=x.nextElementSibling;const M=[];for(;$&&!($.tagName&&$.tagName.toLowerCase()==="h2");){const _=($.textContent||"").trim();_&&M.push(_),$=$.nextElementSibling}M.length&&(y=M.join(" ").replace(/\s+/g," ").trim()),!y&&o&&(y=String(o).trim())}}catch(x){console.warn("[seoManager] compute descOverride failed",x)}y&&String(y).length>160&&(y=String(y).slice(0,157).trim()+"..."),d=y}catch(y){console.warn("[seoManager] compute descOverride failed",y)}let g="";try{h&&(g=h)}catch{}if(!g)try{l&&l.textContent&&(g=String(l.textContent).trim())}catch{}if(!g)try{const y=r.querySelector("h2");y&&y.textContent&&(g=String(y.textContent).trim())}catch{}g||(g=i||"");try{go(n,g||void 0,p,d)}catch(y){console.warn("[seoManager] setMetaTags failed",y)}try{wo(n,u,g||void 0,p,d,t)}catch(y){console.warn("[seoManager] setStructuredData failed",y)}const w=mo();g?w?document.title=`${w} - ${g}`:document.title=`${t||"Site"} - ${g}`:h?document.title=h:document.title=t||document.title}catch(h){console.warn("[seoManager] applyPageMeta failed",h)}try{const h=r.querySelector(".nimbi-reading-time");if(h&&h.remove(),o){const f=ho(c.raw||""),p=f&&typeof f.minutes=="number"?Math.ceil(f.minutes):0,d=document.createElement("p");d.className="nimbi-reading-time",d.textContent=p?e("readingTime",{minutes:p}):"";const g=r.querySelector("h1");g&&g.insertAdjacentElement("afterend",d)}}catch(h){console.warn("[seoManager] reading time update failed",h)}}let Ae=null,D=null,ke=1,Ze=(e,t)=>t,vt=0,Et=0,Wt=()=>{},bt=.25;function yo(){if(Ae&&document.contains(Ae))return Ae;Ae=null;const e=document.createElement("dialog");e.className="nimbi-image-preview",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-label",Ze("imagePreviewTitle","Image preview")),e.innerHTML=`
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
  `,e.addEventListener("click",k=>{k.target===e&&yn()}),e.addEventListener("wheel",k=>{if(!W())return;k.preventDefault();const v=k.deltaY<0?bt:-bt;He(ke+v),u(),c()},{passive:!1}),e.addEventListener("keydown",k=>{if(k.key==="Escape"){yn();return}if(ke>1){const v=e.querySelector(".nimbi-image-preview__image-wrapper");if(!v)return;const R=40;switch(k.key){case"ArrowUp":v.scrollTop-=R,k.preventDefault();break;case"ArrowDown":v.scrollTop+=R,k.preventDefault();break;case"ArrowLeft":v.scrollLeft-=R,k.preventDefault();break;case"ArrowRight":v.scrollLeft+=R,k.preventDefault();break}}}),document.body.appendChild(e),Ae=e,D=e.querySelector("[data-nimbi-preview-image]");const t=e.querySelector("[data-nimbi-preview-fit]"),n=e.querySelector("[data-nimbi-preview-original]"),s=e.querySelector("[data-nimbi-preview-zoom-in]"),r=e.querySelector("[data-nimbi-preview-zoom-out]"),i=e.querySelector("[data-nimbi-preview-reset]"),a=e.querySelector("[data-nimbi-preview-close]"),l=e.querySelector("[data-nimbi-preview-zoom-label]"),o=e.querySelector("[data-nimbi-preview-zoom-hud]");function u(){l&&(l.textContent=`${Math.round(ke*100)}%`)}const c=()=>{o&&(o.textContent=`${Math.round(ke*100)}%`,o.classList.add("visible"),clearTimeout(o._timeout),o._timeout=setTimeout(()=>o.classList.remove("visible"),800))};Wt=u,s.addEventListener("click",()=>{He(ke+bt),u(),c()}),r.addEventListener("click",()=>{He(ke-bt),u(),c()}),t.addEventListener("click",()=>{At(),u(),c()}),n.addEventListener("click",()=>{He(1),u(),c()}),i.addEventListener("click",()=>{At(),u(),c()}),a.addEventListener("click",yn),t.title=Ze("imagePreviewFit","Fit to screen"),n.title=Ze("imagePreviewOriginal","Original size"),r.title=Ze("imagePreviewZoomOut","Zoom out"),s.title=Ze("imagePreviewZoomIn","Zoom in"),a.title=Ze("imagePreviewClose","Close"),a.setAttribute("aria-label",Ze("imagePreviewClose","Close"));let h=!1,f=0,p=0,d=0,g=0;const w=new Map;let y=0,x=1;const $=(k,v)=>{const R=k.x-v.x,E=k.y-v.y;return Math.hypot(R,E)},M=()=>{h=!1,w.clear(),y=0,D&&(D.classList.add("is-panning"),D.classList.remove("is-grabbing"))};let _=0,I=0,H=0;const K=k=>{const v=Date.now(),R=v-_,E=k.clientX-I,b=k.clientY-H;_=v,I=k.clientX,H=k.clientY,R<300&&Math.hypot(E,b)<30&&(He(ke>1?1:2),u(),k.preventDefault())},ae=k=>{He(ke>1?1:2),u(),k.preventDefault()},W=()=>Ae?typeof Ae.open=="boolean"?Ae.open:Ae.classList.contains("is-active"):!1,U=(k,v,R=1)=>{if(w.has(R)&&w.set(R,{x:k,y:v}),w.size===2){const N=Array.from(w.values()),G=$(N[0],N[1]);if(y>0){const ee=G/y;He(x*ee)}return}if(!h)return;const E=D.closest(".nimbi-image-preview__image-wrapper");if(!E)return;const b=k-f,L=v-p;E.scrollLeft=d-b,E.scrollTop=g-L},Z=(k,v,R=1)=>{if(!W())return;if(w.set(R,{x:k,y:v}),w.size===2){const L=Array.from(w.values());y=$(L[0],L[1]),x=ke;return}const E=D.closest(".nimbi-image-preview__image-wrapper");!E||!(E.scrollWidth>E.clientWidth||E.scrollHeight>E.clientHeight)||(h=!0,f=k,p=v,d=E.scrollLeft,g=E.scrollTop,D.classList.add("is-panning"),D.classList.remove("is-grabbing"),window.addEventListener("pointermove",Y),window.addEventListener("pointerup",J),window.addEventListener("pointercancel",J))},Y=k=>{h&&(k.preventDefault(),U(k.clientX,k.clientY,k.pointerId))},J=()=>{M(),window.removeEventListener("pointermove",Y),window.removeEventListener("pointerup",J),window.removeEventListener("pointercancel",J)};D.addEventListener("pointerdown",k=>{k.preventDefault(),Z(k.clientX,k.clientY,k.pointerId)}),D.addEventListener("pointermove",k=>{(h||w.size===2)&&k.preventDefault(),U(k.clientX,k.clientY,k.pointerId)}),D.addEventListener("pointerup",k=>{k.preventDefault(),k.pointerType==="touch"&&K(k),M()}),D.addEventListener("dblclick",ae),D.addEventListener("pointercancel",M),D.addEventListener("mousedown",k=>{k.preventDefault(),Z(k.clientX,k.clientY,1)}),D.addEventListener("mousemove",k=>{h&&k.preventDefault(),U(k.clientX,k.clientY,1)}),D.addEventListener("mouseup",k=>{k.preventDefault(),M()});const F=e.querySelector(".nimbi-image-preview__image-wrapper");return F&&(F.addEventListener("pointerdown",k=>{if(Z(k.clientX,k.clientY,k.pointerId),k&&k.target&&k.target.tagName==="IMG")try{k.target.classList.add("is-grabbing")}catch{}}),F.addEventListener("pointermove",k=>{U(k.clientX,k.clientY,k.pointerId)}),F.addEventListener("pointerup",M),F.addEventListener("pointercancel",M),F.addEventListener("mousedown",k=>{if(Z(k.clientX,k.clientY,1),k&&k.target&&k.target.tagName==="IMG")try{k.target.classList.add("is-grabbing")}catch{}}),F.addEventListener("mousemove",k=>{U(k.clientX,k.clientY,1)}),F.addEventListener("mouseup",M)),e}function He(e){if(!D)return;const t=Number(e);ke=Number.isFinite(t)?Math.max(.1,Math.min(4,t)):1;const s=D.getBoundingClientRect(),r=vt||D.naturalWidth||D.width||s.width||0,i=Et||D.naturalHeight||D.height||s.height||0;if(r&&i){D.style.setProperty("--nimbi-preview-img-max-width","none"),D.style.setProperty("--nimbi-preview-img-max-height","none"),D.style.setProperty("--nimbi-preview-img-width",`${r*ke}px`),D.style.setProperty("--nimbi-preview-img-height",`${i*ke}px`),D.style.setProperty("--nimbi-preview-img-transform","none");try{D.style.width=`${r*ke}px`,D.style.height=`${i*ke}px`,D.style.transform="none"}catch{}}else{D.style.setProperty("--nimbi-preview-img-max-width",""),D.style.setProperty("--nimbi-preview-img-max-height",""),D.style.setProperty("--nimbi-preview-img-width",""),D.style.setProperty("--nimbi-preview-img-height",""),D.style.setProperty("--nimbi-preview-img-transform",`scale(${ke})`);try{D.style.transform=`scale(${ke})`}catch{}}D&&(D.classList.add("is-panning"),D.classList.remove("is-grabbing"))}function At(){if(!D)return;const e=D.closest(".nimbi-image-preview__image-wrapper");if(!e)return;const t=e.getBoundingClientRect();if(t.width===0||t.height===0)return;const n=vt||D.naturalWidth||t.width,s=Et||D.naturalHeight||t.height;if(!n||!s)return;const r=t.width/n,i=t.height/s,a=Math.min(r,i,1);He(Number.isFinite(a)?a:1)}function ko(e,t="",n=0,s=0){const r=yo();ke=1,vt=n||0,Et=s||0,D.src=e,D.alt=t,D.style.transform="scale(1)";const i=()=>{vt=D.naturalWidth||D.width||0,Et=D.naturalHeight||D.height||0};if(i(),At(),Wt(),requestAnimationFrame(()=>{At(),Wt()}),!vt||!Et){const a=()=>{i(),requestAnimationFrame(()=>{At(),Wt()}),D.removeEventListener("load",a)};D.addEventListener("load",a)}typeof r.showModal=="function"&&(r.open||r.showModal()),r.classList.add("is-active");try{document.documentElement.classList.add("nimbi-image-preview-open")}catch{}r.focus()}function yn(){if(Ae){typeof Ae.close=="function"&&Ae.open&&Ae.close(),Ae.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-image-preview-open")}catch{}}}function xo(e,{t,zoomStep:n=.25}={}){if(!e||!e.querySelectorAll)return;Ze=(p,d)=>(typeof t=="function"?t(p):void 0)||d,bt=n,e.addEventListener("click",p=>{const d=p.target;if(!d||d.tagName!=="IMG")return;const g=d;if(g.src){if(p.defaultPrevented!==!0){const w=g.closest("a");w&&w.getAttribute("href")&&p.preventDefault()}ko(g.src,g.alt||"",g.naturalWidth||0,g.naturalHeight||0)}});let s=!1,r=0,i=0,a=0,l=0;const o=new Map;let u=0,c=1;const h=(p,d)=>{const g=p.x-d.x,w=p.y-d.y;return Math.hypot(g,w)};e.addEventListener("pointerdown",p=>{const d=p.target;if(!d||d.tagName!=="IMG"||!Ae||!Ae.open)return;if(o.set(p.pointerId,{x:p.clientX,y:p.clientY}),o.size===2){const w=Array.from(o.values());u=h(w[0],w[1]),c=ke;return}const g=d.closest(".nimbi-image-preview__image-wrapper");if(g&&!(ke<=1)){p.preventDefault(),s=!0,r=p.clientX,i=p.clientY,a=g.scrollLeft,l=g.scrollTop,d.setPointerCapture(p.pointerId);try{d.classList.add("is-grabbing")}catch{}}}),e.addEventListener("pointermove",p=>{if(o.has(p.pointerId)&&o.set(p.pointerId,{x:p.clientX,y:p.clientY}),o.size===2){p.preventDefault();const x=Array.from(o.values()),$=h(x[0],x[1]);if(u>0){const M=$/u;He(c*M)}return}if(!s)return;p.preventDefault();const g=p.target.closest(".nimbi-image-preview__image-wrapper");if(!g)return;const w=p.clientX-r,y=p.clientY-i;g.scrollLeft=a-w,g.scrollTop=l-y});const f=()=>{s=!1,o.clear(),u=0;try{const p=document.querySelector("[data-nimbi-preview-image]");p&&(p.classList.add("is-panning"),p.classList.remove("is-grabbing"))}catch{}};e.addEventListener("pointerup",f),e.addEventListener("pointercancel",f)}function So(e){const{contentWrap:t,navWrap:n,container:s,mountOverlay:r=null,t:i,contentBase:a,homePage:l,initialDocumentTitle:o,runHooks:u}=e||{};if(!t||!(t instanceof HTMLElement))throw new TypeError("contentWrap must be an HTMLElement");let c=null;const h=Xa(i,[{path:l,name:i("home"),isIndex:!0,children:[]}]);async function f(y,x){let $,M,_;try{({data:$,pagePath:M,anchor:_}=await Js(y,a))}catch(Z){console.error("[nimbi-cms] fetchPageData failed",Z),Cr(t,i,Z);return}!_&&x&&(_=x);try{Mn(null)}catch(Z){console.warn("[nimbi-cms] scrollToAnchorOrTop failed",Z)}t.innerHTML="";const{article:I,parsed:H,toc:K,topH1:ae,h1Text:W,slugKey:U}=await ro(i,$,M,_,a);bo(i,o,H,K,I,M,_,ae,W,U,$),n.innerHTML="",n.appendChild(K),ao(K);try{await u("transformHtml",{article:I,parsed:H,toc:K,pagePath:M,anchor:_,topH1:ae,h1Text:W,slugKey:U,data:$})}catch(Z){console.warn("[nimbi-cms] transformHtml hooks failed",Z)}t.appendChild(I);try{io(I)}catch(Z){console.warn("[nimbi-cms] executeEmbeddedScripts failed",Z)}try{xo(I,{t:i})}catch(Z){console.warn("[nimbi-cms] attachImagePreview failed",Z)}try{qt(s,100,!1),requestAnimationFrame(()=>qt(s,100,!1)),setTimeout(()=>qt(s,100,!1),250)}catch(Z){console.warn("[nimbi-cms] setEagerForAboveFoldImages failed",Z)}Mn(_),oo(I,ae,{mountOverlay:r,container:s,navWrap:n,t:i});try{await u("onPageLoad",{data:$,pagePath:M,anchor:_,article:I,toc:K,topH1:ae,h1Text:W,slugKey:U,contentWrap:t,navWrap:n})}catch(Z){console.warn("[nimbi-cms] onPageLoad hooks failed",Z)}c=M}async function p(){let y=new URLSearchParams(location.search).get("page")||l;const x=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;try{await f(y,x)}catch($){console.warn("[nimbi-cms] renderByQuery failed for",y,$),Cr(t,i,$)}}window.addEventListener("popstate",p);const d=()=>`nimbi-cms-scroll:${location.pathname}${location.search}`,g=()=>{try{const y=s||document.querySelector(".nimbi-cms");if(!y)return;const x={top:y.scrollTop||0,left:y.scrollLeft||0};sessionStorage.setItem(d(),JSON.stringify(x))}catch{}},w=()=>{try{const y=s||document.querySelector(".nimbi-cms");if(!y)return;const x=sessionStorage.getItem(d());if(!x)return;const $=JSON.parse(x);$&&typeof $.top=="number"&&y.scrollTo({top:$.top,left:$.left||0,behavior:"auto"})}catch{}};return window.addEventListener("pageshow",y=>{if(y.persisted)try{w(),qt(s,100,!1)}catch(x){console.warn("[nimbi-cms] bfcache restore failed",x)}}),window.addEventListener("pagehide",()=>{try{g()}catch(y){console.warn("[nimbi-cms] save scroll position failed",y)}}),{renderByQuery:p,siteNav:h,getCurrentPagePath:()=>c}}function vo(e){try{const t=typeof e=="string"?e:typeof window<"u"&&window.location?window.location.search:"";if(!t)return{};const n=new URLSearchParams(t.startsWith("?")?t.slice(1):t),s={},r=i=>{if(i==null)return;const a=String(i).toLowerCase();if(a==="1"||a==="true"||a==="yes")return!0;if(a==="0"||a==="false"||a==="no")return!1};if(n.has("contentPath")&&(s.contentPath=n.get("contentPath")),n.has("searchIndex")){const i=r(n.get("searchIndex"));typeof i=="boolean"&&(s.searchIndex=i)}if(n.has("searchIndexMode")){const i=n.get("searchIndexMode");(i==="eager"||i==="lazy")&&(s.searchIndexMode=i)}if(n.has("defaultStyle")){const i=n.get("defaultStyle");(i==="light"||i==="dark")&&(s.defaultStyle=i)}if(n.has("bulmaCustomize")&&(s.bulmaCustomize=n.get("bulmaCustomize")),n.has("lang")&&(s.lang=n.get("lang")),n.has("l10nFile")){const i=n.get("l10nFile");s.l10nFile=i==="null"?null:i}if(n.has("cacheTtlMinutes")){const i=Number(n.get("cacheTtlMinutes"));Number.isFinite(i)&&i>=0&&(s.cacheTtlMinutes=i)}if(n.has("cacheMaxEntries")){const i=Number(n.get("cacheMaxEntries"));Number.isInteger(i)&&i>=0&&(s.cacheMaxEntries=i)}if(n.has("homePage")&&(s.homePage=n.get("homePage")),n.has("notFoundPage")&&(s.notFoundPage=n.get("notFoundPage")),n.has("availableLanguages")&&(s.availableLanguages=n.get("availableLanguages").split(",").map(i=>i.trim()).filter(Boolean)),n.has("indexDepth")){const i=Number(n.get("indexDepth"));Number.isInteger(i)&&(i===1||i===2||i===3)&&(s.indexDepth=i)}if(n.has("noIndexing")){const a=(n.get("noIndexing")||"").split(",").map(l=>l.trim()).filter(Boolean);a.length&&(s.noIndexing=a)}return s}catch{return{}}}function Eo(e){return!(typeof e!="string"||!e.trim()||e.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(e)||e.startsWith("//")||e.startsWith("/")||/^[A-Za-z]:\\/.test(e))}function Pr(e){if(typeof e!="string")return!1;const t=e.trim();return!(!t||t.includes("/")||t.includes("\\")||t.includes("..")||!/^[A-Za-z0-9._-]+\.(md|html)$/.test(t))}let kn="";async function fi(e={}){if(!e||typeof e!="object")throw new TypeError("initCMS(options): options must be an object");const t=vo();if(t&&(t.contentPath||t.homePage||t.notFoundPage))if(e&&e.allowUrlPathOverrides===!0)try{console.warn("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage")}catch(b){console.warn("[nimbi-cms] allowUrlPathOverrides logging failed",b)}else{try{console.warn("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage")}catch(b){console.warn("[nimbi-cms] logging ignore of URL overrides failed",b)}delete t.contentPath,delete t.homePage,delete t.notFoundPage}const n=Object.assign({},t,e),{el:s,contentPath:r="/content",crawlMaxQueue:i=1e3,searchIndex:a=!0,searchIndexMode:l="eager",indexDepth:o=1,noIndexing:u=void 0,defaultStyle:c="light",bulmaCustomize:h="none",lang:f=void 0,l10nFile:p=null,cacheTtlMinutes:d=5,cacheMaxEntries:g,markdownExtensions:w,availableLanguages:y,homePage:x="_home.md",notFoundPage:$="_404.md"}=n,{navbarLogo:M="favicon"}=n,{skipRootReadme:_=!1}=n;if(n.contentPath!=null&&!Eo(n.contentPath))throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');if(n.homePage!=null&&!Pr(n.homePage))throw new TypeError('initCMS(options): "homePage" must be a simple basename ending with .md or .html');if(n.notFoundPage!=null&&!Pr(n.notFoundPage))throw new TypeError('initCMS(options): "notFoundPage" must be a simple basename ending with .md or .html');if(!s)throw new Error("el is required");let I=s;if(typeof s=="string"){if(I=document.querySelector(s),!I)throw new Error(`el selector "${s}" did not match any element`)}else if(!(s instanceof Element))throw new TypeError("el must be a CSS selector string or a DOM element");if(typeof r!="string"||!r.trim())throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');if(typeof a!="boolean")throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');if(l!=null&&l!=="eager"&&l!=="lazy")throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');if(o!=null&&o!==1&&o!==2&&o!==3)throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');if(c!=="light"&&c!=="dark")throw new TypeError('initCMS(options): "defaultStyle" must be "light" or "dark"');if(h!=null&&typeof h!="string")throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');if(f!=null&&typeof f!="string")throw new TypeError('initCMS(options): "lang" must be a string when provided');if(p!=null&&typeof p!="string")throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');if(d!=null&&(typeof d!="number"||!Number.isFinite(d)||d<0))throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');if(g!=null&&(typeof g!="number"||!Number.isInteger(g)||g<0))throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');if(w!=null&&(!Array.isArray(w)||w.some(b=>!b||typeof b!="object")))throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');if(y!=null&&(!Array.isArray(y)||y.some(b=>typeof b!="string"||!b.trim())))throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');if(u!=null&&(!Array.isArray(u)||u.some(b=>typeof b!="string"||!b.trim())))throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');if(_!=null&&typeof _!="boolean")throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');if(x!=null&&(typeof x!="string"||!x.trim()||!/\.(md|html)$/.test(x)))throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');if($!=null&&(typeof $!="string"||!$.trim()||!/\.(md|html)$/.test($)))throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');const H=!!a;try{Promise.resolve().then(()=>Ft).then(b=>{try{b&&typeof b.setSkipRootReadme=="function"&&b.setSkipRootReadme(!!_)}catch(L){console.warn("[nimbi-cms] setSkipRootReadme failed",L)}}).catch(b=>{})}catch(b){console.warn("[nimbi-cms] setSkipRootReadme dynamic import failed",b)}try{I.classList.add("nimbi-mount")}catch(b){console.warn("[nimbi-cms] mount element setup failed",b)}const K=document.createElement("div");K.className="nimbi-cms";const ae=document.createElement("div");ae.className="columns";const W=document.createElement("div");W.className="column is-full-mobile is-3-tablet nimbi-nav-wrap",W.setAttribute("role","navigation");try{const b=typeof ot=="function"?ot("navigation"):null;b&&W.setAttribute("aria-label",b)}catch(b){console.warn("[nimbi-cms] set nav aria-label failed",b)}ae.appendChild(W);const U=document.createElement("div");U.className="column nimbi-content",U.setAttribute("role","main"),ae.appendChild(U),K.appendChild(ae);const Z=W,Y=U;I.appendChild(K);let J=null;try{J=I.querySelector(".nimbi-overlay"),J||(J=document.createElement("div"),J.className="nimbi-overlay",I.appendChild(J))}catch(b){J=null,console.warn("[nimbi-cms] mount overlay setup failed",b)}const F=location.pathname||"/",k=F.endsWith("/")?F:F.substring(0,F.lastIndexOf("/")+1);try{kn=document.title||""}catch(b){kn="",console.warn("[nimbi-cms] read initial document title failed",b)}let v=r;(v==="."||v==="./")&&(v=""),v.startsWith("./")&&(v=v.slice(2)),v.startsWith("/")&&(v=v.slice(1)),v!==""&&!v.endsWith("/")&&(v=v+"/");const R=new URL(k+v,location.origin).toString();try{Promise.resolve().then(()=>Ft).then(b=>{try{b&&typeof b.setHomePage=="function"&&b.setHomePage(x)}catch(L){console.warn("[nimbi-cms] setHomePage failed",L)}}).catch(b=>{})}catch(b){console.warn("[nimbi-cms] setHomePage dynamic import failed",b)}p&&await Pn(p,k),y&&Array.isArray(y)&&Hr(y),f&&In(f);const E=So({contentWrap:Y,navWrap:Z,container:K,mountOverlay:J,t:ot,contentBase:R,homePage:x,initialDocumentTitle:kn,runHooks:xn});if(typeof d=="number"&&d>=0&&typeof mr=="function"&&mr(d*60*1e3),typeof g=="number"&&g>=0&&typeof gr=="function"&&gr(g),w&&Array.isArray(w)&&w.length)try{w.forEach(b=>{typeof b=="object"&&Ga&&typeof Tn=="function"&&Tn(b)})}catch(b){console.warn("[nimbi-cms] applying markdownExtensions failed",b)}try{typeof i=="number"&&Promise.resolve().then(()=>Ft).then(({setDefaultCrawlMaxQueue:b})=>{try{b(i)}catch(L){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed",L)}})}catch(b){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed",b)}try{Xt(R)}catch(b){console.warn("[nimbi-cms] setContentBase failed",b)}try{vn($)}catch(b){console.warn("[nimbi-cms] setNotFoundPage failed",b)}try{Xt(R)}catch(b){console.warn("[nimbi-cms] setContentBase failed",b)}try{vn($)}catch(b){console.warn("[nimbi-cms] setNotFoundPage failed",b)}try{await Se(x,R)}catch(b){throw x==="_home.md"?new Error("Required _home.md not found"):new Error(`Required ${x} not found at ${R}${x}: ${b.message}`)}Nr(c),await Br(h,k);try{const b=document.createElement("header");b.className="nimbi-site-navbar",I.insertBefore(b,K);const L=await Se("_navigation.md",R),N=await en(L.raw||""),{navbar:G,linkEls:ee}=await lo(b,K,N.html||"",R,x,ot,E.renderByQuery,H,l,o,u,M);try{await xn("onNavBuild",{navWrap:Z,navbar:G,linkEls:ee,contentBase:R})}catch(re){console.warn("[nimbi-cms] onNavBuild hooks failed",re)}try{const re=()=>{const ue=b&&b.getBoundingClientRect&&Math.round(b.getBoundingClientRect().height)||b&&b.offsetHeight||0;if(ue>0){try{I.style.setProperty("--nimbi-site-navbar-height",`${ue}px`)}catch(we){console.warn("[nimbi-cms] set CSS var failed",we)}try{K.style.paddingTop=""}catch(we){console.warn("[nimbi-cms] set container paddingTop failed",we)}try{const we=I&&I.getBoundingClientRect&&Math.round(I.getBoundingClientRect().height)||I&&I.clientHeight||0;if(we>0){const ze=Math.max(0,we-ue);try{K.style.setProperty("--nimbi-cms-height",`${ze}px`)}catch(nt){console.warn("[nimbi-cms] set --nimbi-cms-height failed",nt)}}else try{K.style.setProperty("--nimbi-cms-height","calc(100vh - var(--nimbi-site-navbar-height))")}catch(ze){console.warn("[nimbi-cms] set --nimbi-cms-height failed",ze)}}catch(we){console.warn("[nimbi-cms] compute container height failed",we)}try{b.style.setProperty("--nimbi-site-navbar-height",`${ue}px`)}catch(we){console.warn("[nimbi-cms] set navbar CSS var failed",we)}}};re();try{if(typeof ResizeObserver<"u"){const ue=new ResizeObserver(()=>re());try{ue.observe(b)}catch(we){console.warn("[nimbi-cms] ResizeObserver.observe failed",we)}}}catch(ue){console.warn("[nimbi-cms] ResizeObserver setup failed",ue)}}catch(re){console.warn("[nimbi-cms] compute navbar height failed",re)}}catch(b){console.warn("[nimbi-cms] build navigation failed",b)}await E.renderByQuery();try{Promise.resolve().then(()=>Ao).then(({getVersion:b})=>{typeof b=="function"&&b().then(L=>{try{const N=L||"0.0.0";try{const G=ee=>{const re=document.createElement("a");re.className="nimbi-version-label tag is-small",re.textContent=`Ninbi CMS v. ${N}`,re.href=ee||"#",re.target="_blank",re.rel="noopener noreferrer nofollow",re.setAttribute("aria-label",`Ninbi CMS version ${N}`);try{Or(re)}catch{}try{I.appendChild(re)}catch(ue){console.warn("[nimbi-cms] append version label failed",ue)}};(async()=>{try{const ee=await Promise.resolve().then(()=>zi).catch(()=>null),re=ee&&(ee.default||ee);let ue=null;re&&(re.homepage&&typeof re.homepage=="string"?ue=re.homepage:re.repository&&(typeof re.repository=="string"?ue=re.repository:re.repository.url&&typeof re.repository.url=="string"&&(ue=re.repository.url)));try{ue&&new URL(ue)}catch{ue=null}G(ue||"#")}catch{G("#")}})()}catch(G){console.warn("[nimbi-cms] building version label failed",G)}}catch(N){console.warn("[nimbi-cms] building version label failed",N)}}).catch(L=>{console.warn("[nimbi-cms] getVersion() failed",L)})}).catch(b=>{console.warn("[nimbi-cms] import version module failed",b)})}catch(b){console.warn("[nimbi-cms] version label setup failed",b)}}async function pi(){try{let e=null;try{e=await Promise.resolve().then(()=>zi)}catch{try{if(typeof fetch=="function"&&typeof location<"u"){const s=new URL("../package.json",location.href).toString(),r=await fetch(s);r&&r.ok?e={default:await r.json()}:e=null}else e=null}catch{e=null}}const t=e?.default?.version||e?.version;return typeof t=="string"&&t.trim()?t:"0.0.0"}catch{return"0.0.0"}}const Ao=Object.freeze(Object.defineProperty({__proto__:null,getVersion:pi},Symbol.toStringTag,{value:"Module"})),gi="nimbi-cms",mi="0.1.0",wi={type:"git",url:"git+https://github.com/AbelVM/nimbiCMS.git"},bi="https://abelvm.github.io/nimbiCMS/",yi="Lightweight CMS client for static sites with Bulma UI and search/indexing features",ki=["cms","static","bulma","search","markdown","nimbi"],xi="Abel Vázquez Montoro",Si="MIT",vi={url:"https://github.com/AbelVM/nimbiCMS/issues"},Ei={node:">=16"},Ai="module",Ri={dev:"vite","dev:example":'sh -c "npm run build -- --outDir example/dist --config vite.config.js && vite example --port 5173 &"',build:"vite build --config vite.config.js","build:lib":"vite build --config vite.config.js","build:analyze":"ANALYZE=1 vite build --config vite.config.js",preview:"vite preview",test:"npx vitest run","gen-dts":"node scripts/gen-dts.js",prepare:"npm run build:lib && npm run gen-dts","check-dts":"npx tsc --noEmit src/index.d.ts --lib es2015,dom --skipLibCheck","type-test":"npx tsd",docs:"typedoc --options typedoc.json"},Li={bulma:"^1.0.4","highlight.js":"^11.11.1",marked:"^17.0.4"},Ti={"@vitest/coverage-v8":"^4.0.18","comment-parser":"^0.7.6",eslint:"^10.0.3","eslint-plugin-unused-imports":"^4.4.1",glob:"^10.4.1",jsdom:"^28.1.0","reading-time":"^1.5.0",terser:"^5.17.0",typedoc:"^0.28.17","typedoc-plugin-markdown":"^4.10.0",typescript:"^5.9.3",tsd:"^0.33.0",vite:"^7.3.1","rollup-plugin-visualizer":"^5.8.0","vite-plugin-restart":"^2.0.0",vitest:"^4.0.18"},Ci="dist/nimbi-cms.cjs.js",Mi="dist/nimbi-cms.es.js",_i="src/index.d.ts",$i="dist/nimbi-cms.js",Pi=["dist","src/index.d.ts"],Ii={access:"public"},Ro={name:gi,version:mi,repository:wi,homepage:bi,private:!0,description:yi,keywords:ki,author:xi,license:Si,bugs:vi,engines:Ei,type:Ai,scripts:Ri,dependencies:Li,devDependencies:Ti,main:Ci,module:Mi,types:_i,unpkg:$i,files:Pi,publishConfig:Ii},zi=Object.freeze(Object.defineProperty({__proto__:null,author:xi,bugs:vi,default:Ro,dependencies:Li,description:yi,devDependencies:Ti,engines:Ei,files:Pi,homepage:bi,keywords:ki,license:Si,main:Ci,module:Mi,name:gi,publishConfig:Ii,repository:wi,scripts:Ri,type:Ai,types:_i,unpkg:$i,version:mi},Symbol.toStringTag,{value:"Module"}));exports.BAD_LANGUAGES=_n;exports.SUPPORTED_HLJS_MAP=ne;exports._clearHooks=xs;exports.addHook=tn;exports.default=fi;exports.ensureBulma=Br;exports.getVersion=pi;exports.initCMS=fi;exports.loadL10nFile=Pn;exports.loadSupportedLanguages=$n;exports.observeCodeBlocks=zr;exports.onNavBuild=ys;exports.onPageLoad=bs;exports.registerLanguage=ut;exports.runHooks=xn;exports.setHighlightTheme=Rs;exports.setLang=In;exports.setStyle=Nr;exports.setThemeVars=Ts;exports.t=ot;exports.transformHtml=ks;
