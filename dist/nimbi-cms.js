(function(ue,Ue){typeof exports=="object"&&typeof module<"u"?Ue(exports):typeof define=="function"&&define.amd?define(["exports"],Ue):(ue=typeof globalThis<"u"?globalThis:ue||self,Ue(ue.nimbiCMS={}))})(this,(function(ue){"use strict";const Ue={onPageLoad:[],onNavBuild:[],transformHtml:[]};function It(t,e){if(!Object.prototype.hasOwnProperty.call(Ue,t))throw new Error('Unknown hook "'+t+'"');if(typeof e!="function")throw new TypeError("hook callback must be a function");Ue[t].push(e)}function Ni(t){It("onPageLoad",t)}function Oi(t){It("onNavBuild",t)}function qi(t){It("transformHtml",t)}async function on(t,e){const n=Ue[t]||[];for(const s of n)try{await s(e)}catch(r){console.warn("[nimbi-cms] runHooks callback failed",r)}}function Di(){Object.keys(Ue).forEach(t=>{Ue[t].length=0})}function Kn(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var ln,Yn;function Ui(){if(Yn)return ln;Yn=1;function t(m){return m instanceof Map?m.clear=m.delete=m.set=function(){throw new Error("map is read-only")}:m instanceof Set&&(m.add=m.clear=m.delete=function(){throw new Error("set is read-only")}),Object.freeze(m),Object.getOwnPropertyNames(m).forEach(S=>{const T=m[S],Z=typeof T;(Z==="object"||Z==="function")&&!Object.isFrozen(T)&&t(T)}),m}class e{constructor(S){S.data===void 0&&(S.data={}),this.data=S.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function n(m){return m.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function s(m,...S){const T=Object.create(null);for(const Z in m)T[Z]=m[Z];return S.forEach(function(Z){for(const me in Z)T[me]=Z[me]}),T}const r="</span>",i=m=>!!m.scope,a=(m,{prefix:S})=>{if(m.startsWith("language:"))return m.replace("language:","language-");if(m.includes(".")){const T=m.split(".");return[`${S}${T.shift()}`,...T.map((Z,me)=>`${Z}${"_".repeat(me+1)}`)].join(" ")}return`${S}${m}`};class l{constructor(S,T){this.buffer="",this.classPrefix=T.classPrefix,S.walk(this)}addText(S){this.buffer+=n(S)}openNode(S){if(!i(S))return;const T=a(S.scope,{prefix:this.classPrefix});this.span(T)}closeNode(S){i(S)&&(this.buffer+=r)}value(){return this.buffer}span(S){this.buffer+=`<span class="${S}">`}}const o=(m={})=>{const S={children:[]};return Object.assign(S,m),S};class u{constructor(){this.rootNode=o(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(S){this.top.children.push(S)}openNode(S){const T=o({scope:S});this.add(T),this.stack.push(T)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(S){return this.constructor._walk(S,this.rootNode)}static _walk(S,T){return typeof T=="string"?S.addText(T):T.children&&(S.openNode(T),T.children.forEach(Z=>this._walk(S,Z)),S.closeNode(T)),S}static _collapse(S){typeof S!="string"&&S.children&&(S.children.every(T=>typeof T=="string")?S.children=[S.children.join("")]:S.children.forEach(T=>{u._collapse(T)}))}}class c extends u{constructor(S){super(),this.options=S}addText(S){S!==""&&this.add(S)}startScope(S){this.openNode(S)}endScope(){this.closeNode()}__addSublanguage(S,T){const Z=S.root;T&&(Z.scope=`language:${T}`),this.add(Z)}toHTML(){return new l(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function h(m){return m?typeof m=="string"?m:m.source:null}function f(m){return g("(?=",m,")")}function p(m){return g("(?:",m,")*")}function d(m){return g("(?:",m,")?")}function g(...m){return m.map(T=>h(T)).join("")}function w(m){const S=m[m.length-1];return typeof S=="object"&&S.constructor===Object?(m.splice(m.length-1,1),S):{}}function b(...m){return"("+(w(m).capture?"":"?:")+m.map(Z=>h(Z)).join("|")+")"}function x(m){return new RegExp(m.toString()+"|").exec("").length-1}function $(m,S){const T=m&&m.exec(S);return T&&T.index===0}const M=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function _(m,{joinWith:S}){let T=0;return m.map(Z=>{T+=1;const me=T;let we=h(Z),z="";for(;we.length>0;){const P=M.exec(we);if(!P){z+=we;break}z+=we.substring(0,P.index),we=we.substring(P.index+P[0].length),P[0][0]==="\\"&&P[1]?z+="\\"+String(Number(P[1])+me):(z+=P[0],P[0]==="("&&T++)}return z}).map(Z=>`(${Z})`).join(S)}const I=/\b\B/,j="[a-zA-Z]\\w*",ee="[a-zA-Z_]\\w*",te="\\b\\d+(\\.\\d+)?",G="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",U="\\b(0b[01]+)",F="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",X=(m={})=>{const S=/^#![ ]*\//;return m.binary&&(m.begin=g(S,/.*\b/,m.binary,/\b.*/)),s({scope:"meta",begin:S,end:/$/,relevance:0,"on:begin":(T,Z)=>{T.index!==0&&Z.ignoreMatch()}},m)},le={begin:"\\\\[\\s\\S]",relevance:0},H={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[le]},k={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[le]},A={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},R=function(m,S,T={}){const Z=s({scope:"comment",begin:m,end:S,contains:[]},T);Z.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const me=b("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return Z.contains.push({begin:g(/[ ]+/,"(",me,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),Z},v=R("//","$"),E=R("/\\*","\\*/"),y=R("#","$"),B={scope:"number",begin:te,relevance:0},K={scope:"number",begin:G,relevance:0},ne={scope:"number",begin:U,relevance:0},ve={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[le,{begin:/\[/,end:/\]/,relevance:0,contains:[le]}]},ae={scope:"title",begin:j,relevance:0},de={scope:"title",begin:ee,relevance:0},be={begin:"\\.\\s*"+ee,relevance:0};var Fe=Object.freeze({__proto__:null,APOS_STRING_MODE:H,BACKSLASH_ESCAPE:le,BINARY_NUMBER_MODE:ne,BINARY_NUMBER_RE:U,COMMENT:R,C_BLOCK_COMMENT_MODE:E,C_LINE_COMMENT_MODE:v,C_NUMBER_MODE:K,C_NUMBER_RE:G,END_SAME_AS_BEGIN:function(m){return Object.assign(m,{"on:begin":(S,T)=>{T.data._beginMatch=S[1]},"on:end":(S,T)=>{T.data._beginMatch!==S[1]&&T.ignoreMatch()}})},HASH_COMMENT_MODE:y,IDENT_RE:j,MATCH_NOTHING_RE:I,METHOD_GUARD:be,NUMBER_MODE:B,NUMBER_RE:te,PHRASAL_WORDS_MODE:A,QUOTE_STRING_MODE:k,REGEXP_MODE:ve,RE_STARTERS_RE:F,SHEBANG:X,TITLE_MODE:ae,UNDERSCORE_IDENT_RE:ee,UNDERSCORE_TITLE_MODE:de});function dt(m,S){m.input[m.index-1]==="."&&S.ignoreMatch()}function Dn(m,S){m.className!==void 0&&(m.scope=m.className,delete m.className)}function Fa(m,S){S&&m.beginKeywords&&(m.begin="\\b("+m.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",m.__beforeBegin=dt,m.keywords=m.keywords||m.beginKeywords,delete m.beginKeywords,m.relevance===void 0&&(m.relevance=0))}function Wa(m,S){Array.isArray(m.illegal)&&(m.illegal=b(...m.illegal))}function Za(m,S){if(m.match){if(m.begin||m.end)throw new Error("begin & end are not supported with match");m.begin=m.match,delete m.match}}function Ga(m,S){m.relevance===void 0&&(m.relevance=1)}const Qa=(m,S)=>{if(!m.beforeMatch)return;if(m.starts)throw new Error("beforeMatch cannot be used with starts");const T=Object.assign({},m);Object.keys(m).forEach(Z=>{delete m[Z]}),m.keywords=T.keywords,m.begin=g(T.beforeMatch,f(T.begin)),m.starts={relevance:0,contains:[Object.assign(T,{endsParent:!0})]},m.relevance=0,delete T.beforeMatch},Xa=["of","and","for","in","not","or","if","then","parent","list","value"],Ka="keyword";function xi(m,S,T=Ka){const Z=Object.create(null);return typeof m=="string"?me(T,m.split(" ")):Array.isArray(m)?me(T,m):Object.keys(m).forEach(function(we){Object.assign(Z,xi(m[we],S,we))}),Z;function me(we,z){S&&(z=z.map(P=>P.toLowerCase())),z.forEach(function(P){const W=P.split("|");Z[W[0]]=[we,Ya(W[0],W[1])]})}}function Ya(m,S){return S?Number(S):Va(m)?0:1}function Va(m){return Xa.includes(m.toLowerCase())}const Si={},it=m=>{console.error(m)},vi=(m,...S)=>{console.log(`WARN: ${m}`,...S)},ft=(m,S)=>{Si[`${m}/${S}`]||(console.log(`Deprecated as of ${m}. ${S}`),Si[`${m}/${S}`]=!0)},en=new Error;function Ai(m,S,{key:T}){let Z=0;const me=m[T],we={},z={};for(let P=1;P<=S.length;P++)z[P+Z]=me[P],we[P+Z]=!0,Z+=x(S[P-1]);m[T]=z,m[T]._emit=we,m[T]._multi=!0}function Ja(m){if(Array.isArray(m.begin)){if(m.skip||m.excludeBegin||m.returnBegin)throw it("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),en;if(typeof m.beginScope!="object"||m.beginScope===null)throw it("beginScope must be object"),en;Ai(m,m.begin,{key:"beginScope"}),m.begin=_(m.begin,{joinWith:""})}}function eo(m){if(Array.isArray(m.end)){if(m.skip||m.excludeEnd||m.returnEnd)throw it("skip, excludeEnd, returnEnd not compatible with endScope: {}"),en;if(typeof m.endScope!="object"||m.endScope===null)throw it("endScope must be object"),en;Ai(m,m.end,{key:"endScope"}),m.end=_(m.end,{joinWith:""})}}function to(m){m.scope&&typeof m.scope=="object"&&m.scope!==null&&(m.beginScope=m.scope,delete m.scope)}function no(m){to(m),typeof m.beginScope=="string"&&(m.beginScope={_wrap:m.beginScope}),typeof m.endScope=="string"&&(m.endScope={_wrap:m.endScope}),Ja(m),eo(m)}function ro(m){function S(z,P){return new RegExp(h(z),"m"+(m.case_insensitive?"i":"")+(m.unicodeRegex?"u":"")+(P?"g":""))}class T{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(P,W){W.position=this.position++,this.matchIndexes[this.matchAt]=W,this.regexes.push([W,P]),this.matchAt+=x(P)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const P=this.regexes.map(W=>W[1]);this.matcherRe=S(_(P,{joinWith:"|"}),!0),this.lastIndex=0}exec(P){this.matcherRe.lastIndex=this.lastIndex;const W=this.matcherRe.exec(P);if(!W)return null;const Ae=W.findIndex((Pt,Hn)=>Hn>0&&Pt!==void 0),ye=this.matchIndexes[Ae];return W.splice(0,Ae),Object.assign(W,ye)}}class Z{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(P){if(this.multiRegexes[P])return this.multiRegexes[P];const W=new T;return this.rules.slice(P).forEach(([Ae,ye])=>W.addRule(Ae,ye)),W.compile(),this.multiRegexes[P]=W,W}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(P,W){this.rules.push([P,W]),W.type==="begin"&&this.count++}exec(P){const W=this.getMatcher(this.regexIndex);W.lastIndex=this.lastIndex;let Ae=W.exec(P);if(this.resumingScanAtSamePosition()&&!(Ae&&Ae.index===this.lastIndex)){const ye=this.getMatcher(0);ye.lastIndex=this.lastIndex+1,Ae=ye.exec(P)}return Ae&&(this.regexIndex+=Ae.position+1,this.regexIndex===this.count&&this.considerAll()),Ae}}function me(z){const P=new Z;return z.contains.forEach(W=>P.addRule(W.begin,{rule:W,type:"begin"})),z.terminatorEnd&&P.addRule(z.terminatorEnd,{type:"end"}),z.illegal&&P.addRule(z.illegal,{type:"illegal"}),P}function we(z,P){const W=z;if(z.isCompiled)return W;[Dn,Za,no,Qa].forEach(ye=>ye(z,P)),m.compilerExtensions.forEach(ye=>ye(z,P)),z.__beforeBegin=null,[Fa,Wa,Ga].forEach(ye=>ye(z,P)),z.isCompiled=!0;let Ae=null;return typeof z.keywords=="object"&&z.keywords.$pattern&&(z.keywords=Object.assign({},z.keywords),Ae=z.keywords.$pattern,delete z.keywords.$pattern),Ae=Ae||/\w+/,z.keywords&&(z.keywords=xi(z.keywords,m.case_insensitive)),W.keywordPatternRe=S(Ae,!0),P&&(z.begin||(z.begin=/\B|\b/),W.beginRe=S(W.begin),!z.end&&!z.endsWithParent&&(z.end=/\B|\b/),z.end&&(W.endRe=S(W.end)),W.terminatorEnd=h(W.end)||"",z.endsWithParent&&P.terminatorEnd&&(W.terminatorEnd+=(z.end?"|":"")+P.terminatorEnd)),z.illegal&&(W.illegalRe=S(z.illegal)),z.contains||(z.contains=[]),z.contains=[].concat(...z.contains.map(function(ye){return io(ye==="self"?z:ye)})),z.contains.forEach(function(ye){we(ye,W)}),z.starts&&we(z.starts,P),W.matcher=me(W),W}if(m.compilerExtensions||(m.compilerExtensions=[]),m.contains&&m.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return m.classNameAliases=s(m.classNameAliases||{}),we(m)}function Ei(m){return m?m.endsWithParent||Ei(m.starts):!1}function io(m){return m.variants&&!m.cachedVariants&&(m.cachedVariants=m.variants.map(function(S){return s(m,{variants:null},S)})),m.cachedVariants?m.cachedVariants:Ei(m)?s(m,{starts:m.starts?s(m.starts):null}):Object.isFrozen(m)?s(m):m}var so="11.11.1";class ao extends Error{constructor(S,T){super(S),this.name="HTMLInjectionError",this.html=T}}const Un=n,Ri=s,Li=Symbol("nomatch"),oo=7,Ti=function(m){const S=Object.create(null),T=Object.create(null),Z=[];let me=!0;const we="Could not find the language '{}', did you forget to load/include a language module?",z={disableAutodetect:!0,name:"Plain text",contains:[]};let P={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:c};function W(L){return P.noHighlightRe.test(L)}function Ae(L){let O=L.className+" ";O+=L.parentNode?L.parentNode.className:"";const re=P.languageDetectRe.exec(O);if(re){const fe=Ve(re[1]);return fe||(vi(we.replace("{}",re[1])),vi("Falling back to no-highlight mode for this block.",L)),fe?re[1]:"no-highlight"}return O.split(/\s+/).find(fe=>W(fe)||Ve(fe))}function ye(L,O,re){let fe="",xe="";typeof O=="object"?(fe=L,re=O.ignoreIllegals,xe=O.language):(ft("10.7.0","highlight(lang, code, ...args) has been deprecated."),ft("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),xe=L,fe=O),re===void 0&&(re=!0);const Be={code:fe,language:xe};nn("before:highlight",Be);const Je=Be.result?Be.result:Pt(Be.language,Be.code,re);return Je.code=Be.code,nn("after:highlight",Je),Je}function Pt(L,O,re,fe){const xe=Object.create(null);function Be(C,N){return C.keywords[N]}function Je(){if(!Q.keywords){Ee.addText(pe);return}let C=0;Q.keywordPatternRe.lastIndex=0;let N=Q.keywordPatternRe.exec(pe),Y="";for(;N;){Y+=pe.substring(C,N.index);const ce=De.case_insensitive?N[0].toLowerCase():N[0],Le=Be(Q,ce);if(Le){const[We,Eo]=Le;if(Ee.addText(Y),Y="",xe[ce]=(xe[ce]||0)+1,xe[ce]<=oo&&(an+=Eo),We.startsWith("_"))Y+=N[0];else{const Ro=De.classNameAliases[We]||We;qe(N[0],Ro)}}else Y+=N[0];C=Q.keywordPatternRe.lastIndex,N=Q.keywordPatternRe.exec(pe)}Y+=pe.substring(C),Ee.addText(Y)}function rn(){if(pe==="")return;let C=null;if(typeof Q.subLanguage=="string"){if(!S[Q.subLanguage]){Ee.addText(pe);return}C=Pt(Q.subLanguage,pe,!0,Bi[Q.subLanguage]),Bi[Q.subLanguage]=C._top}else C=jn(pe,Q.subLanguage.length?Q.subLanguage:null);Q.relevance>0&&(an+=C.relevance),Ee.__addSublanguage(C._emitter,C.language)}function $e(){Q.subLanguage!=null?rn():Je(),pe=""}function qe(C,N){C!==""&&(Ee.startScope(N),Ee.addText(C),Ee.endScope())}function $i(C,N){let Y=1;const ce=N.length-1;for(;Y<=ce;){if(!C._emit[Y]){Y++;continue}const Le=De.classNameAliases[C[Y]]||C[Y],We=N[Y];Le?qe(We,Le):(pe=We,Je(),pe=""),Y++}}function Pi(C,N){return C.scope&&typeof C.scope=="string"&&Ee.openNode(De.classNameAliases[C.scope]||C.scope),C.beginScope&&(C.beginScope._wrap?(qe(pe,De.classNameAliases[C.beginScope._wrap]||C.beginScope._wrap),pe=""):C.beginScope._multi&&($i(C.beginScope,N),pe="")),Q=Object.create(C,{parent:{value:Q}}),Q}function Ii(C,N,Y){let ce=$(C.endRe,Y);if(ce){if(C["on:end"]){const Le=new e(C);C["on:end"](N,Le),Le.isMatchIgnored&&(ce=!1)}if(ce){for(;C.endsParent&&C.parent;)C=C.parent;return C}}if(C.endsWithParent)return Ii(C.parent,N,Y)}function ko(C){return Q.matcher.regexIndex===0?(pe+=C[0],1):(Gn=!0,0)}function xo(C){const N=C[0],Y=C.rule,ce=new e(Y),Le=[Y.__beforeBegin,Y["on:begin"]];for(const We of Le)if(We&&(We(C,ce),ce.isMatchIgnored))return ko(N);return Y.skip?pe+=N:(Y.excludeBegin&&(pe+=N),$e(),!Y.returnBegin&&!Y.excludeBegin&&(pe=N)),Pi(Y,C),Y.returnBegin?0:N.length}function So(C){const N=C[0],Y=O.substring(C.index),ce=Ii(Q,C,Y);if(!ce)return Li;const Le=Q;Q.endScope&&Q.endScope._wrap?($e(),qe(N,Q.endScope._wrap)):Q.endScope&&Q.endScope._multi?($e(),$i(Q.endScope,C)):Le.skip?pe+=N:(Le.returnEnd||Le.excludeEnd||(pe+=N),$e(),Le.excludeEnd&&(pe=N));do Q.scope&&Ee.closeNode(),!Q.skip&&!Q.subLanguage&&(an+=Q.relevance),Q=Q.parent;while(Q!==ce.parent);return ce.starts&&Pi(ce.starts,C),Le.returnEnd?0:N.length}function vo(){const C=[];for(let N=Q;N!==De;N=N.parent)N.scope&&C.unshift(N.scope);C.forEach(N=>Ee.openNode(N))}let sn={};function zi(C,N){const Y=N&&N[0];if(pe+=C,Y==null)return $e(),0;if(sn.type==="begin"&&N.type==="end"&&sn.index===N.index&&Y===""){if(pe+=O.slice(N.index,N.index+1),!me){const ce=new Error(`0 width match regex (${L})`);throw ce.languageName=L,ce.badRule=sn.rule,ce}return 1}if(sn=N,N.type==="begin")return xo(N);if(N.type==="illegal"&&!re){const ce=new Error('Illegal lexeme "'+Y+'" for mode "'+(Q.scope||"<unnamed>")+'"');throw ce.mode=Q,ce}else if(N.type==="end"){const ce=So(N);if(ce!==Li)return ce}if(N.type==="illegal"&&Y==="")return pe+=`
`,1;if(Zn>1e5&&Zn>N.index*3)throw new Error("potential infinite loop, way more iterations than matches");return pe+=Y,Y.length}const De=Ve(L);if(!De)throw it(we.replace("{}",L)),new Error('Unknown language: "'+L+'"');const Ao=ro(De);let Wn="",Q=fe||Ao;const Bi={},Ee=new P.__emitter(P);vo();let pe="",an=0,st=0,Zn=0,Gn=!1;try{if(De.__emitTokens)De.__emitTokens(O,Ee);else{for(Q.matcher.considerAll();;){Zn++,Gn?Gn=!1:Q.matcher.considerAll(),Q.matcher.lastIndex=st;const C=Q.matcher.exec(O);if(!C)break;const N=O.substring(st,C.index),Y=zi(N,C);st=C.index+Y}zi(O.substring(st))}return Ee.finalize(),Wn=Ee.toHTML(),{language:L,value:Wn,relevance:an,illegal:!1,_emitter:Ee,_top:Q}}catch(C){if(C.message&&C.message.includes("Illegal"))return{language:L,value:Un(O),illegal:!0,relevance:0,_illegalBy:{message:C.message,index:st,context:O.slice(st-100,st+100),mode:C.mode,resultSoFar:Wn},_emitter:Ee};if(me)return{language:L,value:Un(O),illegal:!1,relevance:0,errorRaised:C,_emitter:Ee,_top:Q};throw C}}function Hn(L){const O={value:Un(L),illegal:!1,relevance:0,_top:z,_emitter:new P.__emitter(P)};return O._emitter.addText(L),O}function jn(L,O){O=O||P.languages||Object.keys(S);const re=Hn(L),fe=O.filter(Ve).filter(_i).map($e=>Pt($e,L,!1));fe.unshift(re);const xe=fe.sort(($e,qe)=>{if($e.relevance!==qe.relevance)return qe.relevance-$e.relevance;if($e.language&&qe.language){if(Ve($e.language).supersetOf===qe.language)return 1;if(Ve(qe.language).supersetOf===$e.language)return-1}return 0}),[Be,Je]=xe,rn=Be;return rn.secondBest=Je,rn}function lo(L,O,re){const fe=O&&T[O]||re;L.classList.add("hljs"),L.classList.add(`language-${fe}`)}function Fn(L){let O=null;const re=Ae(L);if(W(re))return;if(nn("before:highlightElement",{el:L,language:re}),L.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",L);return}if(L.children.length>0&&(P.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(L)),P.throwUnescapedHTML))throw new ao("One of your code blocks includes unescaped HTML.",L.innerHTML);O=L;const fe=O.textContent,xe=re?ye(fe,{language:re,ignoreIllegals:!0}):jn(fe);L.innerHTML=xe.value,L.dataset.highlighted="yes",lo(L,re,xe.language),L.result={language:xe.language,re:xe.relevance,relevance:xe.relevance},xe.secondBest&&(L.secondBest={language:xe.secondBest.language,relevance:xe.secondBest.relevance}),nn("after:highlightElement",{el:L,result:xe,text:fe})}function co(L){P=Ri(P,L)}const uo=()=>{tn(),ft("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function ho(){tn(),ft("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let Ci=!1;function tn(){function L(){tn()}if(document.readyState==="loading"){Ci||window.addEventListener("DOMContentLoaded",L,!1),Ci=!0;return}document.querySelectorAll(P.cssSelector).forEach(Fn)}function fo(L,O){let re=null;try{re=O(m)}catch(fe){if(it("Language definition for '{}' could not be registered.".replace("{}",L)),me)it(fe);else throw fe;re=z}re.name||(re.name=L),S[L]=re,re.rawDefinition=O.bind(null,m),re.aliases&&Mi(re.aliases,{languageName:L})}function po(L){delete S[L];for(const O of Object.keys(T))T[O]===L&&delete T[O]}function go(){return Object.keys(S)}function Ve(L){return L=(L||"").toLowerCase(),S[L]||S[T[L]]}function Mi(L,{languageName:O}){typeof L=="string"&&(L=[L]),L.forEach(re=>{T[re.toLowerCase()]=O})}function _i(L){const O=Ve(L);return O&&!O.disableAutodetect}function mo(L){L["before:highlightBlock"]&&!L["before:highlightElement"]&&(L["before:highlightElement"]=O=>{L["before:highlightBlock"](Object.assign({block:O.el},O))}),L["after:highlightBlock"]&&!L["after:highlightElement"]&&(L["after:highlightElement"]=O=>{L["after:highlightBlock"](Object.assign({block:O.el},O))})}function wo(L){mo(L),Z.push(L)}function bo(L){const O=Z.indexOf(L);O!==-1&&Z.splice(O,1)}function nn(L,O){const re=L;Z.forEach(function(fe){fe[re]&&fe[re](O)})}function yo(L){return ft("10.7.0","highlightBlock will be removed entirely in v12.0"),ft("10.7.0","Please use highlightElement now."),Fn(L)}Object.assign(m,{highlight:ye,highlightAuto:jn,highlightAll:tn,highlightElement:Fn,highlightBlock:yo,configure:co,initHighlighting:uo,initHighlightingOnLoad:ho,registerLanguage:fo,unregisterLanguage:po,listLanguages:go,getLanguage:Ve,registerAliases:Mi,autoDetection:_i,inherit:Ri,addPlugin:wo,removePlugin:bo}),m.debugMode=function(){me=!1},m.safeMode=function(){me=!0},m.versionString=so,m.regex={concat:g,lookahead:f,either:b,optional:d,anyNumberOfTimes:p};for(const L in Fe)typeof Fe[L]=="object"&&t(Fe[L]);return Object.assign(m,Fe),m},pt=Ti({});return pt.newInstance=()=>Ti({}),ln=pt,pt.HighlightJS=pt,pt.default=pt,ln}var Hi=Ui();const he=Kn(Hi),J=new Map,ji="https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md",Ce={shell:"bash",sh:"bash",zsh:"bash",js:"javascript",ts:"typescript",py:"python",csharp:"cs","c#":"cs"};Ce.html="xml",Ce.xhtml="xml",Ce.markup="xml";const cn=new Set(["magic","undefined"]);let Ze=null;const un=new Map,Fi=300*1e3;async function hn(t=ji){if(t)return Ze||(Ze=(async()=>{try{const e=await fetch(t);if(!e.ok)return;const s=(await e.text()).split(/\r?\n/);let r=-1;for(let u=0;u<s.length;u++)if(/\|\s*Language\s*\|/i.test(s[u])){r=u;break}if(r===-1)return;const i=s[r].replace(/^\||\|$/g,"").split("|").map(u=>u.trim().toLowerCase());let a=i.findIndex(u=>/alias|aliases|equivalent|alt|alternates?/i.test(u));a===-1&&(a=1);let l=i.findIndex(u=>/file|filename|module|module name|module-name|short|slug/i.test(u));if(l===-1){const u=i.findIndex(c=>/language/i.test(c));l=u!==-1?u:0}let o=[];for(let u=r+1;u<s.length;u++){const c=s[u].trim();if(!c||!c.startsWith("|"))break;const h=c.replace(/^\||\|$/g,"").split("|").map(w=>w.trim());if(h.every(w=>/^-+$/.test(w)))continue;const f=h;if(!f.length)continue;const d=(f[l]||f[0]||"").toString().trim().toLowerCase();if(!d||/^-+$/.test(d))continue;J.set(d,d);const g=f[a]||"";if(g){const w=String(g).split(",").map(b=>b.replace(/`/g,"").trim()).filter(Boolean);if(w.length){const x=w[0].toLowerCase().replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");x&&/[a-z0-9]/i.test(x)&&(J.set(x,x),o.push(x))}}}try{const u=[];for(const c of o){const h=String(c||"").replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");h&&/[a-z0-9]/i.test(h)?u.push(h):J.delete(c)}o=u}catch(u){console.warn("[codeblocksManager] cleanup aliases failed",u)}try{let u=0;for(const c of Array.from(J.keys())){if(!c||/^-+$/.test(c)||!/[a-z0-9]/i.test(c)){J.delete(c),u++;continue}if(/^[:]+/.test(c)){const h=c.replace(/^[:]+/,"");if(h&&/[a-z0-9]/i.test(h)){const f=J.get(c);J.delete(c),J.set(h,f)}else J.delete(c),u++}}for(const[c,h]of Array.from(J.entries()))(!h||/^-+$/.test(h)||!/[a-z0-9]/i.test(h))&&(J.delete(c),u++);try{const c=":---------------------";J.has(c)&&(J.delete(c),u++)}catch(c){console.warn("[codeblocksManager] remove sep key failed",c)}try{const c=Array.from(J.keys()).sort()}catch(c){console.warn("[codeblocksManager] compute supported keys failed",c)}}catch(u){console.warn("[codeblocksManager] ignored error",u)}}catch(e){console.warn("[codeblocksManager] loadSupportedLanguages failed",e)}})(),Ze)}const gt=new Set;async function at(t,e){if(Ze||(async()=>{try{await hn()}catch(r){console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed",r)}})(),Ze)try{await Ze}catch{}if(t=t==null?"":String(t),t=t.trim(),!t)return!1;const n=t.toLowerCase();if(cn.has(n))return!1;if(J.size&&!J.has(n)){const r=Ce;if(!r[n]&&!r[t])return!1}if(gt.has(t))return!0;const s=Ce;try{const r=(e||t||"").toString().replace(/\.js$/i,"").trim(),i=(s[t]||t||"").toString(),a=(s[r]||r||"").toString();let l=Array.from(new Set([i,a,r,t,s[r],s[t]].filter(Boolean))).map(c=>String(c).toLowerCase()).filter(c=>c&&c!=="undefined");J.size&&(l=l.filter(c=>{if(J.has(c))return!0;const h=Ce[c];return!!(h&&J.has(h))}));let o=null,u=null;for(const c of l)try{const h=Date.now();let f=un.get(c);if(f&&f.ok===!1&&h-(f.ts||0)>=Fi&&(un.delete(c),f=void 0),f){if(f.module)o=f.module;else if(f.promise)try{o=await f.promise}catch{o=null}}else{const p={promise:null,module:null,ok:null,ts:0};un.set(c,p),p.promise=(async()=>{try{try{try{return await import(`highlight.js/lib/languages/${c}.js`)}catch{return await import(`highlight.js/lib/languages/${c}`)}}catch{try{const g=`https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${c}.js`;return await new Function("u","return import(u)")(g)}catch{try{const w=`https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${c}.js`;return await new Function("u","return import(u)")(w)}catch{return null}}}}catch{return null}})();try{o=await p.promise,p.module=o,p.ok=!!o,p.ts=Date.now()}catch{p.module=null,p.ok=!1,p.ts=Date.now(),o=null}}if(o){const p=o.default||o;try{const d=J.size&&J.get(t)||c||t;return he.registerLanguage(d,p),gt.add(d),d!==t&&(he.registerLanguage(t,p),gt.add(t)),!0}catch(d){u=d}}else try{if(J.has(c)||J.has(t)){const p=()=>({});try{he.registerLanguage(c,p),gt.add(c)}catch{}try{c!==t&&(he.registerLanguage(t,p),gt.add(t))}catch{}return!0}}catch{}}catch(h){u=h}if(u)throw u;return!1}catch{return!1}}let zt=null;function Vn(t=document){Ze||(async()=>{try{await hn()}catch(i){console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed",i)}})();const e=Ce,s=zt||(typeof IntersectionObserver>"u"?null:(zt=new IntersectionObserver((i,a)=>{i.forEach(l=>{if(!l.isIntersecting)return;const o=l.target;try{a.unobserve(o)}catch(u){console.warn("[codeblocksManager] observer unobserve failed",u)}(async()=>{try{const u=o.getAttribute&&o.getAttribute("class")||o.className||"",c=u.match(/language-([a-zA-Z0-9_+-]+)/)||u.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(c&&c[1]){const h=(c[1]||"").toLowerCase(),f=e[h]||h,p=J.size&&(J.get(f)||J.get(String(f).toLowerCase()))||f;try{await at(p)}catch(d){console.warn("[codeblocksManager] registerLanguage failed",d)}try{try{const d=o.textContent||o.innerText||"";d!=null&&(o.textContent=d)}catch{}try{o&&o.dataset&&o.dataset.highlighted&&delete o.dataset.highlighted}catch{}he.highlightElement(o)}catch(d){console.warn("[codeblocksManager] hljs.highlightElement failed",d)}}else try{const h=o.textContent||"";try{if(he&&typeof he.getLanguage=="function"&&he.getLanguage("plaintext")){const f=he.highlight(h,{language:"plaintext"});f&&f.value&&(o.innerHTML=f.value)}}catch{try{he.highlightElement(o)}catch(p){console.warn("[codeblocksManager] fallback highlightElement failed",p)}}}catch(h){console.warn("[codeblocksManager] auto-detect plaintext failed",h)}}catch(u){console.warn("[codeblocksManager] observer entry processing failed",u)}})()})},{root:null,rootMargin:"300px",threshold:.1}),zt)),r=t&&t.querySelectorAll?t.querySelectorAll("pre code"):[];if(!s){r.forEach(async i=>{try{const a=i.getAttribute&&i.getAttribute("class")||i.className||"",l=a.match(/language-([a-zA-Z0-9_+-]+)/)||a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(l&&l[1]){const o=(l[1]||"").toLowerCase(),u=e[o]||o,c=J.size&&(J.get(u)||J.get(String(u).toLowerCase()))||u;try{await at(c)}catch(h){console.warn("[codeblocksManager] registerLanguage failed (no observer)",h)}}try{try{const o=i.textContent||i.innerText||"";o!=null&&(i.textContent=o)}catch{}try{i&&i.dataset&&i.dataset.highlighted&&delete i.dataset.highlighted}catch{}he.highlightElement(i)}catch(o){console.warn("[codeblocksManager] hljs.highlightElement failed (no observer)",o)}}catch(a){console.warn("[codeblocksManager] loadSupportedLanguages fallback ignored error",a)}});return}r.forEach(i=>{try{s.observe(i)}catch(a){console.warn("[codeblocksManager] observe failed",a)}})}function Wi(t,{useCdn:e=!0}={}){const n=document.querySelector("link[data-hl-theme]"),s=n&&n.getAttribute?n.getAttribute("data-hl-theme"):null,r=t==null?"default":String(t),i=r&&String(r).toLowerCase()||"";if(i==="default"||i==="monokai"){try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}return}if(s&&s.toLowerCase()===i)return;if(!e){console.warn("Requested highlight theme not bundled; set useCdn=true to load theme from CDN");return}const a=i,l=`https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/styles/${a}.css`,o=document.createElement("link");o.rel="stylesheet",o.href=l,o.setAttribute("data-hl-theme",a),o.addEventListener("load",()=>{try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}}),document.head.appendChild(o)}let et="light";function Zi(t,e={}){if(document.querySelector(`link[href="${t}"]`))return;const n=document.createElement("link");n.rel="stylesheet",n.href=t,Object.entries(e).forEach(([s,r])=>n.setAttribute(s,r)),document.head.appendChild(n)}async function Jn(t="none",e="/"){if(!t||t==="none")return;const n=[e+"bulma.css","/bulma.css"],s=Array.from(new Set(n));if(t==="local"){if(document.querySelector("style[data-bulma-override]"))return;for(const r of s)try{const i=await fetch(r,{method:"GET"});if(i.ok){const a=await i.text(),l=document.createElement("style");l.setAttribute("data-bulma-override",r),l.appendChild(document.createTextNode(`
/* bulma override: ${r} */
`+a)),document.head.appendChild(l);return}}catch(i){console.warn("[bulmaManager] fetch local bulma candidate failed",i)}return}try{const r=String(t).trim();if(!r)return;const i=`https://unpkg.com/bulmaswatch/${encodeURIComponent(r)}/bulmaswatch.min.css`;Zi(i,{"data-bulmaswatch-theme":r})}catch(r){console.warn("[bulmaManager] ensureBulma failed",r)}}function er(t){et=t==="dark"?"dark":t==="system"?"system":"light";try{const e=Array.from(document.querySelectorAll(".nimbi-mount"));if(e.length>0)for(const n of e)et==="dark"?n.setAttribute("data-theme","dark"):et==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme");else{const n=document.documentElement;et==="dark"?n.setAttribute("data-theme","dark"):et==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme")}}catch{}}function Gi(t){const e=document.documentElement;for(const[n,s]of Object.entries(t||{}))try{e.style.setProperty(`--${n}`,s)}catch(r){console.warn("[bulmaManager] setThemeVars failed for",n,r)}}function tr(t){if(!t||!(t instanceof HTMLElement))return()=>{};const e=t.closest&&t.closest(".nimbi-mount")||null;try{e&&(et==="dark"?e.setAttribute("data-theme","dark"):et==="light"?e.setAttribute("data-theme","light"):e.removeAttribute("data-theme"))}catch{}return()=>{}}const nr={en:{navigation:"Navigation",onThisPage:"On this page",home:"Home",scrollToTop:"Scroll to top",readingTime:"{minutes} min read",searchPlaceholder:"Search…",imagePreviewTitle:"Image preview",imagePreviewFit:"Fit to screen",imagePreviewOriginal:"Original size",imagePreviewZoomOut:"Zoom out",imagePreviewZoomIn:"Zoom in",imagePreviewClose:"Close"},es:{navigation:"Navegación",onThisPage:"En esta página",home:"Inicio",scrollToTop:"Ir arriba",readingTime:"{minutes} min de lectura",searchPlaceholder:"Buscar…",imagePreviewTitle:"Previsualización de imagen",imagePreviewFit:"Ajustar a la pantalla",imagePreviewOriginal:"Tamaño original",imagePreviewZoomOut:"Alejar",imagePreviewZoomIn:"Acercar",imagePreviewClose:"Cerrar"},de:{navigation:"Navigation",onThisPage:"Auf dieser Seite",home:"Startseite",scrollToTop:"Nach oben",readingTime:"{minutes} min Lesezeit",searchPlaceholder:"Suchen…",imagePreviewTitle:"Bildvorschau",imagePreviewFit:"An Bildschirm anpassen",imagePreviewOriginal:"Originalgröße",imagePreviewZoomOut:"Verkleinern",imagePreviewZoomIn:"Vergrößern",imagePreviewClose:"Schließen"},fr:{navigation:"Navigation",onThisPage:"Sur cette page",home:"Accueil",scrollToTop:"Aller en haut",readingTime:"{minutes} min de lecture",searchPlaceholder:"Rechercher…",imagePreviewTitle:"Aperçu de l’image",imagePreviewFit:"Ajuster à l’écran",imagePreviewOriginal:"Taille originale",imagePreviewZoomOut:"Dézoomer",imagePreviewZoomIn:"Zoomer",imagePreviewClose:"Fermer"},pt:{navigation:"Navegação",onThisPage:"Nesta página",home:"Início",scrollToTop:"Ir para o topo",readingTime:"{minutes} min de leitura",searchPlaceholder:"Procurar…",imagePreviewTitle:"Visualização da imagem",imagePreviewFit:"Ajustar à tela",imagePreviewOriginal:"Tamanho original",imagePreviewZoomOut:"Diminuir",imagePreviewZoomIn:"Aumentar",imagePreviewClose:"Fechar"}},ot=JSON.parse(JSON.stringify(nr));let Bt="en";if(typeof navigator<"u"){const t=navigator.language||navigator.languages&&navigator.languages[0]||"en";Bt=String(t).split("-")[0].toLowerCase()}nr[Bt]||(Bt="en");let Ge=Bt;function lt(t,e={}){const n=ot[Ge]||ot.en;let s=n&&n[t]?n[t]:ot.en[t]||"";for(const r of Object.keys(e))s=s.replace(new RegExp(`{${r}}`,"g"),String(e[r]));return s}async function dn(t,e){if(!t)return;let n=t;try{/^https?:\/\//.test(t)||(n=new URL(t,location.origin+e).toString());const s=await fetch(n);if(!s.ok)return;const r=await s.json();for(const i of Object.keys(r||{}))ot[i]=Object.assign({},ot[i]||{},r[i])}catch{}}function fn(t){const e=String(t).split("-")[0].toLowerCase();Ge=ot[e]?e:"en"}const Qi=Object.freeze(Object.defineProperty({__proto__:null,get currentLang(){return Ge},loadL10nFile:dn,setLang:fn,t:lt},Symbol.toStringTag,{value:"Module"})),Xi=`import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
`;function rr(t,e="worker"){let n=null;function s(){if(!n)try{const l=t();n=l||null,l&&l.addEventListener("error",()=>{try{n===l&&(n=null,l.terminate&&l.terminate())}catch(o){console.warn("["+e+"] worker termination failed",o)}})}catch(l){n=null,console.warn("["+e+"] worker init failed",l)}return n}function r(){try{n&&(n.terminate&&n.terminate(),n=null)}catch(l){console.warn("["+e+"] worker termination failed",l)}}function i(l,o=1e3){return new Promise((u,c)=>{const h=s();if(!h)return c(new Error("worker unavailable"));const f=String(Math.random());l.id=f;let p=null;const d=()=>{p&&clearTimeout(p),h.removeEventListener("message",g),h.removeEventListener("error",w)},g=b=>{const x=b.data||{};x.id===f&&(d(),x.error?c(new Error(x.error)):u(x.result))},w=b=>{d(),console.warn("["+e+"] worker error event",b);try{n===h&&(n=null,h.terminate&&h.terminate())}catch(x){console.warn("["+e+"] worker termination failed",x)}c(new Error(b&&b.message||"worker error"))};p=setTimeout(()=>{d(),console.warn("["+e+"] worker timed out");try{n===h&&(n=null,h.terminate&&h.terminate())}catch(b){console.warn("["+e+"] worker termination on timeout failed",b)}c(new Error("worker timeout"))},o),h.addEventListener("message",g),h.addEventListener("error",w);try{h.postMessage(l)}catch(b){d(),c(b)}})}return{get:s,send:i,terminate:r}}function Ki(t){try{if(typeof Blob<"u"&&typeof URL<"u"&&t){const e=new Blob([t],{type:"application/javascript"}),n=URL.createObjectURL(e);return new Worker(n,{type:"module"})}}catch(e){console.warn("[worker-manager] createWorkerFromRaw failed",e)}return null}const Ne=new Set;function pn(t){Yi(),Ne.clear();for(const e of _e)e&&Ne.add(e);ir(V),ir(D),pn._refreshed=!0}function ir(t){if(!(!t||typeof t.values!="function"))for(const e of t.values())e&&Ne.add(e)}function sr(t){if(!t||typeof t.set!="function")return;const e=t.set;t.set=function(n,s){return s&&Ne.add(s),e.call(this,n,s)}}let ar=!1;function Yi(){ar||(sr(V),sr(D),ar=!0)}function or(t){return!t||typeof t!="string"?!1:/^(https?:)?\/\//.test(t)||t.startsWith("mailto:")||t.startsWith("tel:")}function ge(t){return String(t||"").replace(/^[.\/]+/,"")}function mt(t){return String(t||"").replace(/\/+$/,"")}function wt(t){return mt(t)+"/"}function Vi(t){try{if(!t||typeof document>"u"||!document.head||t.startsWith("data:")||document.head.querySelector(`link[rel="preload"][as="image"][href="${t}"]`))return;const n=document.createElement("link");n.rel="preload",n.as="image",n.href=t,document.head.appendChild(n)}catch(e){console.warn("[helpers] preloadImage failed",e)}}function Nt(t,e=0,n=!1){try{if(typeof window>"u"||!t||!t.querySelectorAll)return;const s=Array.from(t.querySelectorAll("img"));if(!s.length)return;const r=t,i=r&&r.getBoundingClientRect?r.getBoundingClientRect():null,a=0,l=typeof window<"u"&&(window.innerHeight||document.documentElement.clientHeight)||0,o=i?Math.max(a,i.top):a,c=(i?Math.min(l,i.bottom):l)+Number(e||0);let h=0;r&&(h=r.clientHeight||(i?i.height:0)),h||(h=l-a);let f=.6;try{const w=r&&window.getComputedStyle?window.getComputedStyle(r):null,b=w&&w.getPropertyValue("--nimbi-image-max-height-ratio"),x=b?parseFloat(b):NaN;!Number.isNaN(x)&&x>0&&x<=1&&(f=x)}catch(w){console.warn("[helpers] read CSS ratio failed",w)}const p=Math.max(200,Math.floor(h*f));let d=!1,g=null;if(s.forEach(w=>{try{const b=w.getAttribute?w.getAttribute("loading"):void 0;b!=="eager"&&w.setAttribute&&w.setAttribute("loading","lazy");const x=w.getBoundingClientRect?w.getBoundingClientRect():null,$=w.src||w.getAttribute&&w.getAttribute("src"),M=x&&x.height>1?x.height:p,_=x?x.top:0,I=_+M;x&&M>0&&_<=c&&I>=o&&(w.setAttribute?(w.setAttribute("loading","eager"),w.setAttribute("fetchpriority","high"),w.setAttribute("data-eager-by-nimbi","1")):(w.loading="eager",w.fetchPriority="high"),Vi($),d=!0),!g&&x&&x.top<=c&&(g={img:w,src:$,rect:x,beforeLoading:b})}catch(b){console.warn("[helpers] setEagerForAboveFoldImages per-image failed",b)}}),!d&&g){const{img:w,src:b,rect:x,beforeLoading:$}=g;try{w.setAttribute?(w.setAttribute("loading","eager"),w.setAttribute("fetchpriority","high"),w.setAttribute("data-eager-by-nimbi","1")):(w.loading="eager",w.fetchPriority="high")}catch(M){console.warn("[helpers] setEagerForAboveFoldImages fallback failed",M)}}}catch(s){console.warn("[helpers] setEagerForAboveFoldImages failed",s)}}function Ot(t){try{const e=t();return e&&typeof e.then=="function"?e.catch(n=>{console.warn("[helpers] safe swallowed error",n)}):e}catch(e){console.warn("[helpers] safe swallowed error",e)}}try{typeof globalThis<"u"&&!globalThis.safe&&(globalThis.safe=Ot)}catch(t){console.warn("[helpers] global attach failed",t)}const V=new Map;let Me=[],gn=!1;function Ji(t){gn=!!t}function lr(t){Me=Array.isArray(t)?t.slice():[]}function es(){return Me}const cr=rr(()=>Ki(Xi),"slugManager");function mn(){return cr.get()}function ur(t){return cr.send(t)}async function ts(t,e=1,n=void 0){if(!mn())return Ft(t,e,n);try{return await ur({type:"buildSearchIndex",contentBase:t,indexDepth:e,noIndexing:n})}catch(r){try{return await Ft(t,e,n)}catch(i){throw console.warn("[slugManager] buildSearchIndex fallback failed",i),r}}}async function ns(t,e,n){return mn()?ur({type:"crawlForSlug",slug:t,base:e,maxQueue:n}):yn(t,e,n)}function Qe(t,e){if(t)if(Me&&Me.length){const s=e.split("/")[0],r=Me.includes(s);let i=V.get(t);(!i||typeof i=="string")&&(i={default:typeof i=="string"?i:void 0,langs:{}}),r?i.langs[s]=e:i.default=e,V.set(t,i)}else V.set(t,e)}const qt=new Set;function rs(t){typeof t=="function"&&qt.add(t)}function is(t){typeof t=="function"&&qt.delete(t)}const D=new Map;let wn={},_e=[],ct="_404.md",ut="_home.md";function bn(t){t!=null&&(ct=String(t||""))}function ss(t){t!=null&&(ut=String(t||""))}function as(t){wn=t||{}}const bt=new Map,Dt=new Set;function os(){bt.clear(),Dt.clear()}function ls(t){if(!t||t.length===0)return"";let e=t[0];for(let s=1;s<t.length;s++){const r=t[s];let i=0;const a=Math.min(e.length,r.length);for(;i<a&&e[i]===r[i];)i++;e=e.slice(0,i)}const n=e.lastIndexOf("/");return n===-1?e:e.slice(0,n+1)}function Ut(t){V.clear(),D.clear(),_e=[],Me=Me||[];const e=Object.keys(wn||{});if(!e.length)return;let n="";try{if(t){try{/^[a-z][a-z0-9+.-]*:/i.test(String(t))?n=new URL(String(t)).pathname:n=String(t||"")}catch(s){n=String(t||""),console.warn("[slugManager] parse contentBase failed",s)}n=wt(n)}}catch(s){n="",console.warn("[slugManager] setContentBase prefix derivation failed",s)}n||(n=ls(e));for(const s of e){let r=s;n&&s.startsWith(n)?r=ge(s.slice(n.length)):r=ge(s),_e.push(r);try{pn()}catch(a){console.warn("[slugManager] refreshIndexPaths failed",a)}const i=wn[s];if(typeof i=="string"){const a=(i||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const l=oe(a[1].trim());if(l)try{if(Me&&Me.length){const u=r.split("/")[0],c=Me.includes(u);let h=V.get(l);(!h||typeof h=="string")&&(h={default:typeof h=="string"?h:void 0,langs:{}}),c?h.langs[u]=r:h.default=r,V.set(l,h)}else V.set(l,r);D.set(r,l)}catch(o){console.warn("[slugManager] set slug mapping failed",o)}}}}}try{Ut()}catch(t){console.warn("[slugManager] initial setContentBase failed",t)}function oe(t){let n=String(t||"").toLowerCase().replace(/[^a-z0-9\- ]/g,"").replace(/ /g,"-");return n=n.replace(/(?:-?)(?:md|html)$/,""),n.length>80&&(n=n.slice(0,80).replace(/-+$/g,"")),n}function cs(t){return yt(t,void 0)}function yt(t,e){if(!t)return!1;if(t.startsWith("//"))return!0;if(/^[a-z][a-z0-9+.-]*:/i.test(t)){if(e&&typeof e=="string")try{const n=new URL(t),s=new URL(e);return n.origin!==s.origin?!0:!n.pathname.startsWith(s.pathname)}catch{return!0}return!0}if(t.startsWith("/")&&e&&typeof e=="string")try{const n=new URL(t,e),s=new URL(e);return n.origin!==s.origin?!0:!n.pathname.startsWith(s.pathname)}catch{return!0}return!1}function Ht(t){return t==null?t:String(t).replace(/\\([\\`*_{}\[\]()#+\-.!])/g,(e,n)=>n)}function kt(t){if(!t||!V.has(t))return null;const e=V.get(t);if(!e)return null;if(typeof e=="string")return e;if(Me&&Me.length&&Ge&&e.langs&&e.langs[Ge])return e.langs[Ge];if(e.default)return e.default;if(e.langs){const n=Object.keys(e.langs);if(n.length)return e.langs[n[0]]}return null}const xt=new Map;function us(){xt.clear()}let Se=async function(t,e){if(!t)throw new Error("path required");try{const i=(String(t||"").match(/([^\/]+)\.md(?:$|[?#])/)||[])[1];if(i&&V.has(i)){const a=kt(i)||V.get(i);a&&a!==t&&(t=a)}}catch(i){console.warn("[slugManager] slug mapping normalization failed",i)}const n=e==null?"":mt(String(e));let s="";try{if(n)if(/^[a-z][a-z0-9+.-]*:/i.test(n))s=n.replace(/\/$/,"")+"/"+t.replace(/^\//,"");else if(n.startsWith("/"))s=n.replace(/\/$/,"")+"/"+t.replace(/^\//,"");else{const i=typeof location<"u"&&location.origin?location.origin:"http://localhost",a=n.startsWith("/")?n:"/"+n;s=i+a.replace(/\/$/,"")+"/"+t.replace(/^\//,"")}else s=(typeof location<"u"&&location.origin?location.origin:"http://localhost")+"/"+t.replace(/^\//,"")}catch{s="/"+t.replace(/^\//,"")}if(xt.has(s))return xt.get(s);const r=(async()=>{const i=await fetch(s);if(!i||typeof i.ok!="boolean"||!i.ok){if(i&&i.status===404)try{const h=`${n}/${ct}`,f=await globalThis.fetch(h);if(f&&typeof f.ok=="boolean"&&f.ok)return{raw:await f.text(),status:404}}catch(h){console.warn("[slugManager] fetching fallback 404 failed",h)}let c="";try{i&&typeof i.clone=="function"?c=await i.clone().text():i&&typeof i.text=="function"?c=await i.text():c=""}catch(h){c="",console.warn("[slugManager] reading error body failed",h)}throw console.error("fetchMarkdown failed:",{url:s,status:i?i.status:void 0,statusText:i?i.statusText:void 0,body:c.slice(0,200)}),new Error("failed to fetch md")}const a=await i.text(),l=a.trim().slice(0,16).toLowerCase(),o=l.startsWith("<!doctype")||l.startsWith("<html"),u=o||String(t||"").toLowerCase().endsWith(".html");if(o&&String(t||"").toLowerCase().endsWith(".md")){try{const c=`${n}/${ct}`,h=await globalThis.fetch(c);if(h.ok)return{raw:await h.text(),status:404}}catch(c){console.warn("[slugManager] fetching fallback 404 failed",c)}throw console.error("fetchMarkdown: server returned HTML for .md request",s),new Error("failed to fetch md")}return u?{raw:a,isHtml:!0}:{raw:a}})();return xt.set(s,r),r};function hs(t){typeof t=="function"&&(Se=t)}const jt=new Map;function ds(t){if(!t||typeof t!="string")return"";let e=t.replace(/```[\s\S]*?```/g,"");return e=e.replace(/<pre[\s\S]*?<\/pre>/gi,""),e=e.replace(/<code[\s\S]*?<\/code>/gi,""),e=e.replace(/<!--([\s\S]*?)-->/g,""),e=e.replace(/^ {4,}.*$/gm,""),e=e.replace(/`[^`]*`/g,""),e}let He=[],St=null;async function Ft(t,e=1,n=void 0){const s=Array.isArray(n)?Array.from(new Set((n||[]).map(r=>ge(String(r||""))))):[];try{const r=ge(String(ct||""));r&&!s.includes(r)&&s.push(r)}catch{}if(He&&He.length&&e===1&&!He.some(i=>{try{return s.includes(ge(String(i.path||"")))}catch{return!1}}))return He;if(St)return St;St=(async()=>{let r=Array.isArray(n)?Array.from(new Set((n||[]).map(u=>ge(String(u||""))))):[];try{const u=ge(String(ct||""));u&&!r.includes(u)&&r.push(u)}catch{}const i=u=>{if(!r||!r.length)return!1;for(const c of r)if(c&&(u===c||u.startsWith(c+"/")))return!0;return!1};let a=[];if(_e&&_e.length&&(a=Array.from(_e)),!a.length)for(const u of V.values())u&&a.push(u);try{const u=await pr(t);u&&u.length&&(a=a.concat(u))}catch(u){console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed",u)}try{const u=new Set(a),c=[...a];for(u.size;c.length&&u.size<=vt;){const h=c.shift();try{const f=await Se(h,t);if(f&&f.raw){if(f.status===404)continue;let p=f.raw;const d=[],g=String(h||"").replace(/^.*\//,"");if(/^readme(?:\.md)?$/i.test(g)&&gn&&(!h||!h.includes("/")))continue;const w=ds(p),b=/\[[^\]]+\]\(([^)]+)\)/g;let x;for(;x=b.exec(w);)d.push(x[1]);const $=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;x=$.exec(w);)d.push(x[1]);const M=h&&h.includes("/")?h.substring(0,h.lastIndexOf("/")+1):"";for(let _ of d)try{if(yt(_,t)||_.startsWith("..")||_.indexOf("/../")!==-1||(M&&!_.startsWith("./")&&!_.startsWith("/")&&!_.startsWith("../")&&(_=M+_),_=ge(_),!/\.(md|html?)(?:$|[?#])/i.test(_))||(_=_.split(/[?#]/)[0],i(_)))continue;u.has(_)||(u.add(_),c.push(_),a.push(_))}catch(I){console.warn("[slugManager] href processing failed",_,I)}}}catch(f){console.warn("[slugManager] discovery fetch failed for",h,f)}}}catch(u){console.warn("[slugManager] discovery loop failed",u)}const l=new Set;a=a.filter(u=>!u||l.has(u)||i(u)?!1:(l.add(u),!0));const o=[];for(const u of a)if(/\.(?:md|html?)(?:$|[?#])/i.test(u))try{const c=await Se(u,t);if(c&&c.raw){if(c.status===404)continue;let h="",f="";if(c.isHtml)try{const g=new DOMParser().parseFromString(c.raw,"text/html"),w=g.querySelector("title")||g.querySelector("h1");w&&w.textContent&&(h=w.textContent.trim());const b=g.querySelector("p");if(b&&b.textContent&&(f=b.textContent.trim()),e>=2)try{const x=g.querySelector("h1"),$=x&&x.textContent?x.textContent.trim():h||"",M=(()=>{try{if(D.has(u))return D.get(u)}catch{}return oe(h||u)})(),_=Array.from(g.querySelectorAll("h2"));for(const I of _)try{const j=(I.textContent||"").trim();if(!j)continue;const ee=I.id?I.id:oe(j),te=M?`${M}::${ee}`:`${oe(u)}::${ee}`;let G="",U=I.nextElementSibling;for(;U&&U.tagName&&U.tagName.toLowerCase()==="script";)U=U.nextElementSibling;U&&U.textContent&&(G=String(U.textContent).trim()),o.push({slug:te,title:j,excerpt:G,path:u,parentTitle:$})}catch(j){console.warn("[slugManager] indexing H2 failed",j)}if(e===3)try{const I=Array.from(g.querySelectorAll("h3"));for(const j of I)try{const ee=(j.textContent||"").trim();if(!ee)continue;const te=j.id?j.id:oe(ee),G=M?`${M}::${te}`:`${oe(u)}::${te}`;let U="",F=j.nextElementSibling;for(;F&&F.tagName&&F.tagName.toLowerCase()==="script";)F=F.nextElementSibling;F&&F.textContent&&(U=String(F.textContent).trim()),o.push({slug:G,title:ee,excerpt:U,path:u,parentTitle:$})}catch(ee){console.warn("[slugManager] indexing H3 failed",ee)}}catch(I){console.warn("[slugManager] collect H3s failed",I)}}catch(x){console.warn("[slugManager] collect H2s failed",x)}}catch(d){console.warn("[slugManager] parsing HTML for index failed",d)}else{const d=c.raw,g=d.match(/^#\s+(.+)$/m);h=g?g[1].trim():"";try{h=Ht(h)}catch{}const w=d.split(/\r?\n\s*\r?\n/);if(w.length>1)for(let b=1;b<w.length;b++){const x=w[b].trim();if(x&&!/^#/.test(x)){f=x.replace(/\r?\n/g," ");break}}if(e>=2){let b="",x="";try{const $=(d.match(/^#\s+(.+)$/m)||[])[1];b=$?$.trim():"",x=(function(){try{if(D.has(u))return D.get(u)}catch{}return oe(h||u)})();const M=/^##\s+(.+)$/gm;let _;for(;_=M.exec(d);)try{const I=(_[1]||"").trim(),j=Ht(I);if(!I)continue;const ee=oe(I),te=x?`${x}::${ee}`:`${oe(u)}::${ee}`,U=d.slice(M.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),F=U&&U[1]?String(U[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";o.push({slug:te,title:j,excerpt:F,path:u,parentTitle:b})}catch(I){console.warn("[slugManager] indexing markdown H2 failed",I)}}catch($){console.warn("[slugManager] collect markdown H2s failed",$)}if(e===3)try{const $=/^###\s+(.+)$/gm;let M;for(;M=$.exec(d);)try{const _=(M[1]||"").trim(),I=Ht(_);if(!_)continue;const j=oe(_),ee=x?`${x}::${j}`:`${oe(u)}::${j}`,G=d.slice($.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),U=G&&G[1]?String(G[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";o.push({slug:ee,title:I,excerpt:U,path:u,parentTitle:b})}catch(_){console.warn("[slugManager] indexing markdown H3 failed",_)}}catch($){console.warn("[slugManager] collect markdown H3s failed",$)}}}let p="";try{D.has(u)&&(p=D.get(u))}catch(d){console.warn("[slugManager] mdToSlug access failed",d)}p||(p=oe(h||u)),o.push({slug:p,title:h,excerpt:f,path:u})}}catch(c){console.warn("[slugManager] buildSearchIndex: entry fetch failed",c)}try{He=o.filter(c=>{try{return!i(String(c.path||""))}catch{return!0}})}catch(u){console.warn("[slugManager] filtering index by excludes failed",u),He=o}return He})();try{await St}catch(r){console.warn("[slugManager] awaiting _indexPromise failed",r)}return St=null,He}const hr=1e3;let vt=hr;function fs(t){typeof t=="number"&&t>=0&&(vt=t)}const dr=new DOMParser,fr="a[href]";let yn=async function(t,e,n=vt){if(jt.has(t))return jt.get(t);let s=null;const r=new Set,i=[""];for(;i.length&&!s&&!(i.length>n);){const a=i.shift();if(r.has(a))continue;r.add(a);let l=e;l.endsWith("/")||(l+="/"),l+=a;try{let o;try{o=await globalThis.fetch(l)}catch(f){console.warn("[slugManager] crawlAllMarkdown: fetch failed",{url:l,error:f});continue}if(!o||!o.ok){o&&!o.ok&&console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:l,status:o.status});continue}const u=await o.text(),h=dr.parseFromString(u,"text/html").querySelectorAll(fr);for(const f of h)try{let p=f.getAttribute("href")||"";if(!p||yt(p,e)||p.startsWith("..")||p.indexOf("/../")!==-1)continue;if(p.endsWith("/")){const d=a+p;r.has(d)||i.push(d);continue}if(p.toLowerCase().endsWith(".md")){const d=ge(a+p);try{if(D.has(d))continue;for(const g of V.values());}catch(g){console.warn("[slugManager] slug map access failed",g)}try{const g=await Se(d,e);if(g&&g.raw){const w=(g.raw||"").match(/^#\s+(.+)$/m);if(w&&w[1]&&oe(w[1].trim())===t){s=d;break}}}catch(g){console.warn("[slugManager] crawlForSlug: fetchMarkdown failed",g)}}}catch(p){console.warn("[slugManager] crawlForSlug: link iteration failed",p)}}catch(o){console.warn("[slugManager] crawlForSlug: directory fetch failed",o)}}return jt.set(t,s),s};async function pr(t,e=vt){const n=new Set,s=new Set,r=[""];for(;r.length&&!(r.length>e);){const i=r.shift();if(s.has(i))continue;s.add(i);let a=t;a.endsWith("/")||(a+="/"),a+=i;try{let l;try{l=await globalThis.fetch(a)}catch(h){console.warn("[slugManager] crawlAllMarkdown: fetch failed",{url:a,error:h});continue}if(!l||!l.ok){l&&!l.ok&&console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:a,status:l.status});continue}const o=await l.text(),c=dr.parseFromString(o,"text/html").querySelectorAll(fr);for(const h of c)try{let f=h.getAttribute("href")||"";if(!f||yt(f,t)||f.startsWith("..")||f.indexOf("/../")!==-1)continue;if(f.endsWith("/")){const d=i+f;s.has(d)||r.push(d);continue}const p=(i+f).replace(/^\/+/,"");/\.(md|html?)$/i.test(p)&&n.add(p)}catch(f){console.warn("[slugManager] crawlAllMarkdown: link iteration failed",f)}}catch(l){console.warn("[slugManager] crawlAllMarkdown: directory fetch failed",l)}}return Array.from(n)}async function gr(t,e,n){if(t&&typeof t=="string"&&(t=ge(t),t=mt(t)),V.has(t))return kt(t)||V.get(t);for(const r of qt)try{const i=await r(t,e);if(i)return Qe(t,i),D.set(i,t),i}catch(i){console.warn("[slugManager] slug resolver failed",i)}if(_e&&_e.length){if(bt.has(t)){const r=bt.get(t);return V.set(t,r),D.set(r,t),r}for(const r of _e)if(!Dt.has(r))try{const i=await Se(r,e);if(i&&i.raw){const a=(i.raw||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const l=oe(a[1].trim());if(Dt.add(r),l&&bt.set(l,r),l===t)return Qe(t,r),D.set(r,t),r}}}catch(i){console.warn("[slugManager] manifest title fetch failed",i)}}try{const r=await Ft(e);if(r&&r.length){const i=r.find(a=>a.slug===t);if(i)return Qe(t,i.path),D.set(i.path,t),i.path}}catch(r){console.warn("[slugManager] buildSearchIndex lookup failed",r)}try{const r=await yn(t,e,n);if(r)return Qe(t,r),D.set(r,t),r}catch(r){console.warn("[slugManager] crawlForSlug lookup failed",r)}const s=[`${t}.html`,`${t}.md`];for(const r of s)try{const i=await Se(r,e);if(i&&i.raw)return Qe(t,r),D.set(r,t),r}catch(i){console.warn("[slugManager] candidate fetch failed",i)}if(_e&&_e.length)for(const r of _e)try{const i=r.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(oe(i)===t)return Qe(t,r),D.set(r,t),r}catch(i){console.warn("[slugManager] build-time filename match failed",i)}try{const r=[];ut&&typeof ut=="string"&&ut.trim()&&r.push(ut),r.includes("_home.md")||r.push("_home.md");for(const i of r)try{const a=await Se(i,e);if(a&&a.raw){const l=(a.raw||"").match(/^#\s+(.+)$/m);if(l&&l[1]&&oe(l[1].trim())===t)return Qe(t,i),D.set(i,t),i}}catch{}}catch(r){console.warn("[slugManager] home page fetch failed",r)}return null}const Wt=Object.freeze(Object.defineProperty({__proto__:null,CRAWL_MAX_QUEUE:hr,_setAllMd:as,_storeSlugMapping:Qe,addSlugResolver:rs,get allMarkdownPaths(){return _e},get availableLanguages(){return Me},buildSearchIndex:Ft,buildSearchIndexWorker:ts,clearFetchCache:us,clearListCaches:os,crawlAllMarkdown:pr,crawlCache:jt,crawlForSlug:yn,crawlForSlugWorker:ns,get defaultCrawlMaxQueue(){return vt},ensureSlug:gr,fetchCache:xt,get fetchMarkdown(){return Se},getLanguages:es,get homePage(){return ut},initSlugWorker:mn,isExternalLink:cs,isExternalLinkWithBase:yt,listPathsFetched:Dt,listSlugCache:bt,mdToSlug:D,get notFoundPage(){return ct},removeSlugResolver:is,resolveSlugPath:kt,get searchIndex(){return He},setContentBase:Ut,setDefaultCrawlMaxQueue:fs,setFetchMarkdown:hs,setHomePage:ss,setLanguages:lr,setNotFoundPage:bn,setSkipRootReadme:Ji,get skipRootReadme(){return gn},slugResolvers:qt,slugToMd:V,slugify:oe,unescapeMarkdown:Ht},Symbol.toStringTag,{value:"Module"}));let mr=100;function wr(t){mr=t}let At=300*1e3;function br(t){At=t}const Pe=new Map;function ps(t){if(!Pe.has(t))return;const e=Pe.get(t),n=Date.now();if(e.ts+At<n){Pe.delete(t);return}return Pe.delete(t),Pe.set(t,e),e.value}function gs(t,e){if(yr(),yr(),Pe.delete(t),Pe.set(t,{value:e,ts:Date.now()}),Pe.size>mr){const n=Pe.keys().next().value;n!==void 0&&Pe.delete(n)}}function yr(){if(!At||At<=0)return;const t=Date.now();for(const[e,n]of Pe.entries())n.ts+At<t&&Pe.delete(e)}async function ms(t,e){const n=new Set(Ne),s=document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");for(const r of Array.from(s||[])){const i=r.getAttribute("href")||"";if(i)try{const a=new URL(i,location.href);if(a.origin!==location.origin)continue;const l=(a.hash||a.pathname).match(/([^#?]+\.md)(?:$|[?#])/)||(a.pathname||"").match(/([^#?]+\.md)(?:$|[?#])/);if(l){let h=ge(l[1]);h&&n.add(h);continue}const o=(r.textContent||"").trim(),u=(a.pathname||"").replace(/^.*\//,"");if(o&&oe(o)===t||u&&oe(u.replace(/\.(html?|md)$/i,""))===t)return a.toString();if(/\.(html?)$/i.test(a.pathname)){let h=a.pathname.replace(/^\//,"");n.add(h);continue}const c=a.pathname||"";if(c){const h=new URL(e),f=wt(h.pathname);if(c.indexOf(f)!==-1){let p=c.startsWith(f)?c.slice(f.length):c;p=ge(p),p&&n.add(p)}}}catch(a){console.warn("[router] malformed URL while discovering index candidates",a)}}for(const r of n)try{if(!r||!String(r).includes(".md"))continue;const i=await Se(r,e);if(!i||!i.raw)continue;const a=(i.raw||"").match(/^#\s+(.+)$/m);if(a){const l=(a[1]||"").trim();if(l&&oe(l)===t)return r}}catch(i){console.warn("[router] fetchMarkdown during index discovery failed",i)}return null}function ws(t){const e=[];if(String(t).includes(".md")||String(t).includes(".html"))/index\.html$/i.test(t)||e.push(t);else try{const n=decodeURIComponent(String(t||""));if(V.has(n)){const s=kt(n)||V.get(n);s&&(/\.(md|html?)$/i.test(s)?/index\.html$/i.test(s)||e.push(s):(e.push(s),e.push(s+".html")))}else{if(Ne&&Ne.size)for(const s of Ne){const r=s.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(oe(r)===n&&!/index\.html$/i.test(s)){e.push(s);break}}!e.length&&n&&!/\.(md|html?)$/i.test(n)&&(e.push(n+".html"),e.push(n+".md"))}}catch(n){console.warn("[router] buildPageCandidates failed during slug handling",n)}return e}async function bs(t,e){const n=t||"",s=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;let r=t||"",i=null;if(r&&String(r).includes("::")){const d=String(r).split("::",2);r=d[0],i=d[1]||null}const l=`${t}|||${typeof Qi<"u"&&Ge?Ge:""}`,o=ps(l);if(o)r=o.resolved,i=o.anchor||i;else{if(!String(r).includes(".md")&&!String(r).includes(".html")){let d=decodeURIComponent(String(r||""));if(d&&typeof d=="string"&&(d=ge(d),d=mt(d)),V.has(d))r=kt(d)||V.get(d);else{let g=await ms(d,e);if(g)r=g;else if(pn._refreshed&&Ne&&Ne.size||typeof e=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(e)){const w=await gr(d,e);w&&(r=w)}}}gs(l,{resolved:r,anchor:i})}!i&&s&&(i=s);try{if(r&&(r.startsWith("http://")||r.startsWith("https://")||r.startsWith("/"))){const d=r.startsWith("/")?new URL(r,location.origin).toString():r;try{const g=await fetch(d);if(g&&g.ok){const w=await g.text(),b=g&&g.headers&&typeof g.headers.get=="function"&&g.headers.get("content-type")||"",x=(w||"").toLowerCase();if(b&&b.indexOf&&b.indexOf("text/html")!==-1||x.indexOf("<!doctype")!==-1||x.indexOf("<html")!==-1)return{data:{raw:w,isHtml:!0},pagePath:d.replace(/^\//,""),anchor:i}}}catch{}}}catch{}const u=ws(r),c=String(n||"").includes(".md")||String(n||"").includes(".html");if(c&&u.length===0&&(String(r).includes(".md")||String(r).includes(".html"))&&u.push(r),u.length===0&&(String(r).includes(".md")||String(r).includes(".html"))&&u.push(r),u.length===1&&/index\.html$/i.test(u[0])&&!c&&!V.has(r)&&!V.has(decodeURIComponent(String(r||"")))&&!String(r||"").includes("/"))throw new Error("Unknown slug: index.html fallback prevented");let h=null,f=null,p=null;for(const d of u)if(d)try{const g=ge(d);h=await Se(g,e),f=g;break}catch(g){p=g;try{console.warn("[router] candidate fetch failed",{candidate:d,contentBase:e,err:g&&g.message||g})}catch{}}if(!h){try{console.error("[router] fetchPageData: no page data for",{originalRaw:n,resolved:r,pageCandidates:u,contentBase:e,fetchError:p&&(p.message||String(p))||null})}catch{}try{if(c&&String(n||"").toLowerCase().includes(".html"))try{const d=new URL(String(n||""),location.href).toString();console.warn("[router] attempting absolute HTML fetch fallback",d);const g=await fetch(d);if(g&&g.ok){const w=await g.text(),b=g&&g.headers&&typeof g.headers.get=="function"&&g.headers.get("content-type")||"",x=(w||"").toLowerCase(),$=b&&b.indexOf&&b.indexOf("text/html")!==-1||x.indexOf("<!doctype")!==-1||x.indexOf("<html")!==-1;if($||console.warn("[router] absolute fetch returned non-HTML",{abs:d,contentType:b,snippet:x.slice(0,200)}),$)try{const M=d,_=new URL(".",M).toString();try{const j=typeof DOMParser<"u"?new DOMParser:null;if(j){const ee=j.parseFromString(w||"","text/html"),te=(X,le)=>{try{const H=le.getAttribute(X)||"";if(!H||/^(https?:)?\/\//i.test(H)||H.startsWith("/")||H.startsWith("#"))return;try{const k=new URL(H,M).toString();le.setAttribute(X,k)}catch(k){console.warn("[router] rewrite attribute failed",X,k)}}catch(H){console.warn("[router] rewrite helper failed",H)}},G=ee.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"),U=[];for(const X of Array.from(G||[]))try{const le=X.tagName?X.tagName.toLowerCase():"";if(le==="a")continue;if(X.hasAttribute("src")){const H=X.getAttribute("src");te("src",X);const k=X.getAttribute("src");H!==k&&U.push({attr:"src",tag:le,before:H,after:k})}if(X.hasAttribute("href")&&le==="link"){const H=X.getAttribute("href");te("href",X);const k=X.getAttribute("href");H!==k&&U.push({attr:"href",tag:le,before:H,after:k})}if(X.hasAttribute("href")&&le!=="link"){const H=X.getAttribute("href");te("href",X);const k=X.getAttribute("href");H!==k&&U.push({attr:"href",tag:le,before:H,after:k})}if(X.hasAttribute("xlink:href")){const H=X.getAttribute("xlink:href");te("xlink:href",X);const k=X.getAttribute("xlink:href");H!==k&&U.push({attr:"xlink:href",tag:le,before:H,after:k})}if(X.hasAttribute("poster")){const H=X.getAttribute("poster");te("poster",X);const k=X.getAttribute("poster");H!==k&&U.push({attr:"poster",tag:le,before:H,after:k})}if(X.hasAttribute("srcset")){const A=(X.getAttribute("srcset")||"").split(",").map(R=>R.trim()).filter(Boolean).map(R=>{const[v,E]=R.split(/\s+/,2);if(!v||/^(https?:)?\/\//i.test(v)||v.startsWith("/"))return R;try{const y=new URL(v,M).toString();return E?`${y} ${E}`:y}catch{return R}}).join(", ");X.setAttribute("srcset",A)}}catch{}const F=ee.documentElement&&ee.documentElement.outerHTML?ee.documentElement.outerHTML:w;try{U&&U.length&&console.warn("[router] rewritten asset refs",{abs:d,rewritten:U})}catch{}return{data:{raw:F,isHtml:!0},pagePath:String(n||""),anchor:i}}}catch{}let I=w;return/<base\s+[^>]*>/i.test(w)||(/<head[^>]*>/i.test(w)?I=w.replace(/(<head[^>]*>)/i,`$1<base href="${_}">`):I=`<base href="${_}">`+w),{data:{raw:I,isHtml:!0},pagePath:String(n||""),anchor:i}}catch{return{data:{raw:w,isHtml:!0},pagePath:String(n||""),anchor:i}}}}catch(d){console.warn("[router] absolute HTML fetch fallback failed",d)}}catch{}try{const d=decodeURIComponent(String(r||""));if(d&&!/\.(md|html?)$/i.test(d)){const g=[`/assets/${d}.html`,`/assets/${d}/index.html`];for(const w of g)try{const b=await fetch(w,{method:"GET"});if(b&&b.ok)return{data:{raw:await b.text(),isHtml:!0},pagePath:w.replace(/^\//,""),anchor:i}}catch{}}}catch(d){console.warn("[router] assets fallback failed",d)}throw new Error("no page data")}return{data:h,pagePath:f,anchor:i}}function kn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var tt=kn();function kr(t){tt=t}var nt={exec:()=>null};function ie(t,e=""){let n=typeof t=="string"?t:t.source,s={replace:(r,i)=>{let a=typeof i=="string"?i:i.source;return a=a.replace(Te.caret,"$1"),n=n.replace(r,a),s},getRegex:()=>new RegExp(n,e)};return s}var ys=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),Te={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}>`)},ks=/^(?:[ \t]*(?:\n|$))+/,xs=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Ss=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Et=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,vs=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,xn=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,xr=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Sr=ie(xr).replace(/bull/g,xn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),As=ie(xr).replace(/bull/g,xn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Sn=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Es=/^[^\n]+/,vn=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Rs=ie(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",vn).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Ls=ie(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,xn).getRegex(),Zt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",An=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Ts=ie("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",An).replace("tag",Zt).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),vr=ie(Sn).replace("hr",Et).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Zt).getRegex(),Cs=ie(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",vr).getRegex(),En={blockquote:Cs,code:xs,def:Rs,fences:Ss,heading:vs,hr:Et,html:Ts,lheading:Sr,list:Ls,newline:ks,paragraph:vr,table:nt,text:Es},Ar=ie("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Et).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Zt).getRegex(),Ms={...En,lheading:As,table:Ar,paragraph:ie(Sn).replace("hr",Et).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Ar).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Zt).getRegex()},_s={...En,html:ie(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",An).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:nt,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:ie(Sn).replace("hr",Et).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Sr).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},$s=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Ps=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Er=/^( {2,}|\\)\n(?!\s*$)/,Is=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Gt=/[\p{P}\p{S}]/u,Rn=/[\s\p{P}\p{S}]/u,Rr=/[^\s\p{P}\p{S}]/u,zs=ie(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Rn).getRegex(),Lr=/(?!~)[\p{P}\p{S}]/u,Bs=/(?!~)[\s\p{P}\p{S}]/u,Ns=/(?:[^\s\p{P}\p{S}]|~)/u,Tr=/(?![*_])[\p{P}\p{S}]/u,Os=/(?![*_])[\s\p{P}\p{S}]/u,qs=/(?:[^\s\p{P}\p{S}]|[*_])/u,Ds=ie(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",ys?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Cr=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Us=ie(Cr,"u").replace(/punct/g,Gt).getRegex(),Hs=ie(Cr,"u").replace(/punct/g,Lr).getRegex(),Mr="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",js=ie(Mr,"gu").replace(/notPunctSpace/g,Rr).replace(/punctSpace/g,Rn).replace(/punct/g,Gt).getRegex(),Fs=ie(Mr,"gu").replace(/notPunctSpace/g,Ns).replace(/punctSpace/g,Bs).replace(/punct/g,Lr).getRegex(),Ws=ie("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Rr).replace(/punctSpace/g,Rn).replace(/punct/g,Gt).getRegex(),Zs=ie(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,Tr).getRegex(),Gs="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Qs=ie(Gs,"gu").replace(/notPunctSpace/g,qs).replace(/punctSpace/g,Os).replace(/punct/g,Tr).getRegex(),Xs=ie(/\\(punct)/,"gu").replace(/punct/g,Gt).getRegex(),Ks=ie(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Ys=ie(An).replace("(?:-->|$)","-->").getRegex(),Vs=ie("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Ys).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Qt=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Js=ie(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",Qt).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),_r=ie(/^!?\[(label)\]\[(ref)\]/).replace("label",Qt).replace("ref",vn).getRegex(),$r=ie(/^!?\[(ref)\](?:\[\])?/).replace("ref",vn).getRegex(),ea=ie("reflink|nolink(?!\\()","g").replace("reflink",_r).replace("nolink",$r).getRegex(),Pr=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Ln={_backpedal:nt,anyPunctuation:Xs,autolink:Ks,blockSkip:Ds,br:Er,code:Ps,del:nt,delLDelim:nt,delRDelim:nt,emStrongLDelim:Us,emStrongRDelimAst:js,emStrongRDelimUnd:Ws,escape:$s,link:Js,nolink:$r,punctuation:zs,reflink:_r,reflinkSearch:ea,tag:Vs,text:Is,url:nt},ta={...Ln,link:ie(/^!?\[(label)\]\((.*?)\)/).replace("label",Qt).getRegex(),reflink:ie(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Qt).getRegex()},Tn={...Ln,emStrongRDelimAst:Fs,emStrongLDelim:Hs,delLDelim:Zs,delRDelim:Qs,url:ie(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Pr).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:ie(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Pr).getRegex()},na={...Tn,br:ie(Er).replace("{2,}","*").getRegex(),text:ie(Tn.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Xt={normal:En,gfm:Ms,pedantic:_s},Rt={normal:Ln,gfm:Tn,breaks:na,pedantic:ta},ra={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Ir=t=>ra[t];function Oe(t,e){if(e){if(Te.escapeTest.test(t))return t.replace(Te.escapeReplace,Ir)}else if(Te.escapeTestNoEncode.test(t))return t.replace(Te.escapeReplaceNoEncode,Ir);return t}function zr(t){try{t=encodeURI(t).replace(Te.percentDecode,"%")}catch{return null}return t}function Br(t,e){let n=t.replace(Te.findPipe,(i,a,l)=>{let o=!1,u=a;for(;--u>=0&&l[u]==="\\";)o=!o;return o?"|":" |"}),s=n.split(Te.splitPipe),r=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),e)if(s.length>e)s.splice(e);else for(;s.length<e;)s.push("");for(;r<s.length;r++)s[r]=s[r].trim().replace(Te.slashPipe,"|");return s}function Lt(t,e,n){let s=t.length;if(s===0)return"";let r=0;for(;r<s&&t.charAt(s-r-1)===e;)r++;return t.slice(0,s-r)}function ia(t,e){if(t.indexOf(e[1])===-1)return-1;let n=0;for(let s=0;s<t.length;s++)if(t[s]==="\\")s++;else if(t[s]===e[0])n++;else if(t[s]===e[1]&&(n--,n<0))return s;return n>0?-2:-1}function sa(t,e=0){let n=e,s="";for(let r of t)if(r==="	"){let i=4-n%4;s+=" ".repeat(i),n+=i}else s+=r,n++;return s}function Nr(t,e,n,s,r){let i=e.href,a=e.title||null,l=t[1].replace(r.other.outputLinkReplace,"$1");s.state.inLink=!0;let o={type:t[0].charAt(0)==="!"?"image":"link",raw:n,href:i,title:a,text:l,tokens:s.inlineTokens(l)};return s.state.inLink=!1,o}function aa(t,e,n){let s=t.match(n.other.indentCodeCompensation);if(s===null)return e;let r=s[1];return e.split(`
`).map(i=>{let a=i.match(n.other.beginningSpace);if(a===null)return i;let[l]=a;return l.length>=r.length?i.slice(r.length):i}).join(`
`)}var Kt=class{options;rules;lexer;constructor(t){this.options=t||tt}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let n=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?n:Lt(n,`
`)}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let n=e[0],s=aa(n,e[3]||"",this.rules);return{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:s}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){let s=Lt(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:Lt(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let n=Lt(e[0],`
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
`);continue}}return{type:"blockquote",raw:s,tokens:i,text:r}}}list(t){let e=this.rules.block.list.exec(t);if(e){let n=e[1].trim(),s=n.length>1,r={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let i=this.rules.other.listItemRegex(n),a=!1;for(;t;){let o=!1,u="",c="";if(!(e=i.exec(t))||this.rules.block.hr.test(t))break;u=e[0],t=t.substring(u.length);let h=sa(e[2].split(`
`,1)[0],e[1].length),f=t.split(`
`,1)[0],p=!h.trim(),d=0;if(this.options.pedantic?(d=2,c=h.trimStart()):p?d=e[1].length+1:(d=h.search(this.rules.other.nonSpaceChar),d=d>4?1:d,c=h.slice(d),d+=e[1].length),p&&this.rules.other.blankLine.test(f)&&(u+=f+`
`,t=t.substring(f.length+1),o=!0),!o){let g=this.rules.other.nextBulletRegex(d),w=this.rules.other.hrRegex(d),b=this.rules.other.fencesBeginRegex(d),x=this.rules.other.headingBeginRegex(d),$=this.rules.other.htmlBeginRegex(d),M=this.rules.other.blockquoteBeginRegex(d);for(;t;){let _=t.split(`
`,1)[0],I;if(f=_,this.options.pedantic?(f=f.replace(this.rules.other.listReplaceNesting,"  "),I=f):I=f.replace(this.rules.other.tabCharGlobal,"    "),b.test(f)||x.test(f)||$.test(f)||M.test(f)||g.test(f)||w.test(f))break;if(I.search(this.rules.other.nonSpaceChar)>=d||!f.trim())c+=`
`+I.slice(d);else{if(p||h.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||b.test(h)||x.test(h)||w.test(h))break;c+=`
`+f}p=!f.trim(),u+=_+`
`,t=t.substring(_.length+1),h=I.slice(d)}}r.loose||(a?r.loose=!0:this.rules.other.doubleBlankLine.test(u)&&(a=!0)),r.items.push({type:"list_item",raw:u,task:!!this.options.gfm&&this.rules.other.listIsTask.test(c),loose:!1,text:c,tokens:[]}),r.raw+=u}let l=r.items.at(-1);if(l)l.raw=l.raw.trimEnd(),l.text=l.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let o of r.items){if(this.lexer.state.top=!1,o.tokens=this.lexer.blockTokens(o.text,[]),o.task){if(o.text=o.text.replace(this.rules.other.listReplaceTask,""),o.tokens[0]?.type==="text"||o.tokens[0]?.type==="paragraph"){o.tokens[0].raw=o.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),o.tokens[0].text=o.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let c=this.lexer.inlineQueue.length-1;c>=0;c--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[c].src)){this.lexer.inlineQueue[c].src=this.lexer.inlineQueue[c].src.replace(this.rules.other.listReplaceTask,"");break}}let u=this.rules.other.listTaskCheckbox.exec(o.raw);if(u){let c={type:"checkbox",raw:u[0]+" ",checked:u[0]!=="[ ]"};o.checked=c.checked,r.loose?o.tokens[0]&&["paragraph","text"].includes(o.tokens[0].type)&&"tokens"in o.tokens[0]&&o.tokens[0].tokens?(o.tokens[0].raw=c.raw+o.tokens[0].raw,o.tokens[0].text=c.raw+o.tokens[0].text,o.tokens[0].tokens.unshift(c)):o.tokens.unshift({type:"paragraph",raw:c.raw,text:c.raw,tokens:[c]}):o.tokens.unshift(c)}}if(!r.loose){let u=o.tokens.filter(h=>h.type==="space"),c=u.length>0&&u.some(h=>this.rules.other.anyLine.test(h.raw));r.loose=c}}if(r.loose)for(let o of r.items){o.loose=!0;for(let u of o.tokens)u.type==="text"&&(u.type="paragraph")}return r}}html(t){let e=this.rules.block.html.exec(t);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(t){let e=this.rules.block.def.exec(t);if(e){let n=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:e[0],href:s,title:r}}}table(t){let e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let n=Br(e[1]),s=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:e[0],header:[],align:[],rows:[]};if(n.length===s.length){for(let a of s)this.rules.other.tableAlignRight.test(a)?i.align.push("right"):this.rules.other.tableAlignCenter.test(a)?i.align.push("center"):this.rules.other.tableAlignLeft.test(a)?i.align.push("left"):i.align.push(null);for(let a=0;a<n.length;a++)i.header.push({text:n[a],tokens:this.lexer.inline(n[a]),header:!0,align:i.align[a]});for(let a of r)i.rows.push(Br(a,i.header.length).map((l,o)=>({text:l,tokens:this.lexer.inline(l),header:!1,align:i.align[o]})));return i}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(t){let e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){let e=this.rules.inline.link.exec(t);if(e){let n=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let i=Lt(n.slice(0,-1),"\\");if((n.length-i.length)%2===0)return}else{let i=ia(e[2],"()");if(i===-2)return;if(i>-1){let a=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,a).trim(),e[3]=""}}let s=e[2],r="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(s);i&&(s=i[1],r=i[3])}else r=e[3]?e[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),Nr(e,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let n;if((n=this.rules.inline.reflink.exec(t))||(n=this.rules.inline.nolink.exec(t))){let s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=e[s.toLowerCase()];if(!r){let i=n[0].charAt(0);return{type:"text",raw:i,text:i}}return Nr(n,r,n[0],this.lexer,this.rules)}}emStrong(t,e,n=""){let s=this.rules.inline.emStrongLDelim.exec(t);if(!(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!n||this.rules.inline.punctuation.exec(n))){let r=[...s[0]].length-1,i,a,l=r,o=0,u=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(u.lastIndex=0,e=e.slice(-1*t.length+r);(s=u.exec(e))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i)continue;if(a=[...i].length,s[3]||s[4]){l+=a;continue}else if((s[5]||s[6])&&r%3&&!((r+a)%3)){o+=a;continue}if(l-=a,l>0)continue;a=Math.min(a,a+l+o);let c=[...s[0]][0].length,h=t.slice(0,r+s.index+c+a);if(Math.min(r,a)%2){let p=h.slice(1,-1);return{type:"em",raw:h,text:p,tokens:this.lexer.inlineTokens(p)}}let f=h.slice(2,-2);return{type:"strong",raw:h,text:f,tokens:this.lexer.inlineTokens(f)}}}}codespan(t){let e=this.rules.inline.code.exec(t);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(n),r=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&r&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(t){let e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t,e,n=""){let s=this.rules.inline.delLDelim.exec(t);if(s&&(!s[1]||!n||this.rules.inline.punctuation.exec(n))){let r=[...s[0]].length-1,i,a,l=r,o=this.rules.inline.delRDelim;for(o.lastIndex=0,e=e.slice(-1*t.length+r);(s=o.exec(e))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i||(a=[...i].length,a!==r))continue;if(s[3]||s[4]){l+=a;continue}if(l-=a,l>0)continue;a=Math.min(a,a+l);let u=[...s[0]][0].length,c=t.slice(0,r+s.index+u+a),h=c.slice(r,-r);return{type:"del",raw:c,text:h,tokens:this.lexer.inlineTokens(h)}}}}autolink(t){let e=this.rules.inline.autolink.exec(t);if(e){let n,s;return e[2]==="@"?(n=e[1],s="mailto:"+n):(n=e[1],s=n),{type:"link",raw:e[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let n,s;if(e[2]==="@")n=e[0],s="mailto:"+n;else{let r;do r=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(r!==e[0]);n=e[0],e[1]==="www."?s="http://"+e[0]:s=e[0]}return{type:"link",raw:e[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:n}}}},Ie=class Qn{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||tt,this.options.tokenizer=this.options.tokenizer||new Kt,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:Te,block:Xt.normal,inline:Rt.normal};this.options.pedantic?(n.block=Xt.pedantic,n.inline=Rt.pedantic):this.options.gfm&&(n.block=Xt.gfm,this.options.breaks?n.inline=Rt.breaks:n.inline=Rt.gfm),this.tokenizer.rules=n}static get rules(){return{block:Xt,inline:Rt}}static lex(e,n){return new Qn(n).lex(e)}static lexInline(e,n){return new Qn(n).inlineTokens(e)}lex(e){e=e.replace(Te.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],s=!1){for(this.options.pedantic&&(e=e.replace(Te.tabCharGlobal,"    ").replace(Te.spaceLine,""));e;){let r;if(this.options.extensions?.block?.some(a=>(r=a.call({lexer:this},e,n))?(e=e.substring(r.raw.length),n.push(r),!0):!1))continue;if(r=this.tokenizer.space(e)){e=e.substring(r.raw.length);let a=n.at(-1);r.raw.length===1&&a!==void 0?a.raw+=`
`:n.push(r);continue}if(r=this.tokenizer.code(e)){e=e.substring(r.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.at(-1).src=a.text):n.push(r);continue}if(r=this.tokenizer.fences(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.heading(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.hr(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.blockquote(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.list(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.html(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.def(e)){e=e.substring(r.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title},n.push(r));continue}if(r=this.tokenizer.table(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.lheading(e)){e=e.substring(r.raw.length),n.push(r);continue}let i=e;if(this.options.extensions?.startBlock){let a=1/0,l=e.slice(1),o;this.options.extensions.startBlock.forEach(u=>{o=u.call({lexer:this},l),typeof o=="number"&&o>=0&&(a=Math.min(a,o))}),a<1/0&&a>=0&&(i=e.substring(0,a+1))}if(this.state.top&&(r=this.tokenizer.paragraph(i))){let a=n.at(-1);s&&a?.type==="paragraph"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(r),s=i.length!==e.length,e=e.substring(r.raw.length);continue}if(r=this.tokenizer.text(e)){e=e.substring(r.raw.length);let a=n.at(-1);a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(r);continue}if(e){let a="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}inlineTokens(e,n=[]){let s=e,r=null;if(this.tokens.links){let o=Object.keys(this.tokens.links);if(o.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)o.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,r.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)i=r[2]?r[2].length:0,s=s.slice(0,r.index+i)+"["+"a".repeat(r[0].length-i-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let a=!1,l="";for(;e;){a||(l=""),a=!1;let o;if(this.options.extensions?.inline?.some(c=>(o=c.call({lexer:this},e,n))?(e=e.substring(o.raw.length),n.push(o),!0):!1))continue;if(o=this.tokenizer.escape(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.tag(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.link(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(o.raw.length);let c=n.at(-1);o.type==="text"&&c?.type==="text"?(c.raw+=o.raw,c.text+=o.text):n.push(o);continue}if(o=this.tokenizer.emStrong(e,s,l)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.codespan(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.br(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.del(e,s,l)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.autolink(e)){e=e.substring(o.raw.length),n.push(o);continue}if(!this.state.inLink&&(o=this.tokenizer.url(e))){e=e.substring(o.raw.length),n.push(o);continue}let u=e;if(this.options.extensions?.startInline){let c=1/0,h=e.slice(1),f;this.options.extensions.startInline.forEach(p=>{f=p.call({lexer:this},h),typeof f=="number"&&f>=0&&(c=Math.min(c,f))}),c<1/0&&c>=0&&(u=e.substring(0,c+1))}if(o=this.tokenizer.inlineText(u)){e=e.substring(o.raw.length),o.raw.slice(-1)!=="_"&&(l=o.raw.slice(-1)),a=!0;let c=n.at(-1);c?.type==="text"?(c.raw+=o.raw,c.text+=o.text):n.push(o);continue}if(e){let c="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return n}},Yt=class{options;parser;constructor(t){this.options=t||tt}space(t){return""}code({text:t,lang:e,escaped:n}){let s=(e||"").match(Te.notSpaceStart)?.[0],r=t.replace(Te.endingNewline,"")+`
`;return s?'<pre><code class="language-'+Oe(s)+'">'+(n?r:Oe(r,!0))+`</code></pre>
`:"<pre><code>"+(n?r:Oe(r,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}def(t){return""}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){let e=t.ordered,n=t.start,s="";for(let a=0;a<t.items.length;a++){let l=t.items[a];s+=this.listitem(l)}let r=e?"ol":"ul",i=e&&n!==1?' start="'+n+'"':"";return"<"+r+i+`>
`+s+"</"+r+`>
`}listitem(t){return`<li>${this.parser.parse(t.tokens)}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let e="",n="";for(let r=0;r<t.header.length;r++)n+=this.tablecell(t.header[r]);e+=this.tablerow({text:n});let s="";for(let r=0;r<t.rows.length;r++){let i=t.rows[r];n="";for(let a=0;a<i.length;a++)n+=this.tablecell(i[a]);s+=this.tablerow({text:n})}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+s+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){let e=this.parser.parseInline(t.tokens),n=t.header?"th":"td";return(t.align?`<${n} align="${t.align}">`:`<${n}>`)+e+`</${n}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${Oe(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:n}){let s=this.parser.parseInline(n),r=zr(t);if(r===null)return s;t=r;let i='<a href="'+t+'"';return e&&(i+=' title="'+Oe(e)+'"'),i+=">"+s+"</a>",i}image({href:t,title:e,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));let r=zr(t);if(r===null)return Oe(n);t=r;let i=`<img src="${t}" alt="${Oe(n)}"`;return e&&(i+=` title="${Oe(e)}"`),i+=">",i}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:Oe(t.text)}},Cn=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}checkbox({raw:t}){return t}},ze=class Xn{options;renderer;textRenderer;constructor(e){this.options=e||tt,this.options.renderer=this.options.renderer||new Yt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Cn}static parse(e,n){return new Xn(n).parse(e)}static parseInline(e,n){return new Xn(n).parseInline(e)}parse(e){let n="";for(let s=0;s<e.length;s++){let r=e[s];if(this.options.extensions?.renderers?.[r.type]){let a=r,l=this.options.extensions.renderers[a.type].call({parser:this},a);if(l!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(a.type)){n+=l||"";continue}}let i=r;switch(i.type){case"space":{n+=this.renderer.space(i);break}case"hr":{n+=this.renderer.hr(i);break}case"heading":{n+=this.renderer.heading(i);break}case"code":{n+=this.renderer.code(i);break}case"table":{n+=this.renderer.table(i);break}case"blockquote":{n+=this.renderer.blockquote(i);break}case"list":{n+=this.renderer.list(i);break}case"checkbox":{n+=this.renderer.checkbox(i);break}case"html":{n+=this.renderer.html(i);break}case"def":{n+=this.renderer.def(i);break}case"paragraph":{n+=this.renderer.paragraph(i);break}case"text":{n+=this.renderer.text(i);break}default:{let a='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return n}parseInline(e,n=this.renderer){let s="";for(let r=0;r<e.length;r++){let i=e[r];if(this.options.extensions?.renderers?.[i.type]){let l=this.options.extensions.renderers[i.type].call({parser:this},i);if(l!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){s+=l||"";continue}}let a=i;switch(a.type){case"escape":{s+=n.text(a);break}case"html":{s+=n.html(a);break}case"link":{s+=n.link(a);break}case"image":{s+=n.image(a);break}case"checkbox":{s+=n.checkbox(a);break}case"strong":{s+=n.strong(a);break}case"em":{s+=n.em(a);break}case"codespan":{s+=n.codespan(a);break}case"br":{s+=n.br(a);break}case"del":{s+=n.del(a);break}case"text":{s+=n.text(a);break}default:{let l='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return s}},Tt=class{options;block;constructor(t){this.options=t||tt}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(){return this.block?Ie.lex:Ie.lexInline}provideParser(){return this.block?ze.parse:ze.parseInline}},oa=class{defaults=kn();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=ze;Renderer=Yt;TextRenderer=Cn;Lexer=Ie;Tokenizer=Kt;Hooks=Tt;constructor(...t){this.use(...t)}walkTokens(t,e){let n=[];for(let s of t)switch(n=n.concat(e.call(this,s)),s.type){case"table":{let r=s;for(let i of r.header)n=n.concat(this.walkTokens(i.tokens,e));for(let i of r.rows)for(let a of i)n=n.concat(this.walkTokens(a.tokens,e));break}case"list":{let r=s;n=n.concat(this.walkTokens(r.items,e));break}default:{let r=s;this.defaults.extensions?.childTokens?.[r.type]?this.defaults.extensions.childTokens[r.type].forEach(i=>{let a=r[i].flat(1/0);n=n.concat(this.walkTokens(a,e))}):r.tokens&&(n=n.concat(this.walkTokens(r.tokens,e)))}}return n}use(...t){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(n=>{let s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){let i=e.renderers[r.name];i?e.renderers[r.name]=function(...a){let l=r.renderer.apply(this,a);return l===!1&&(l=i.apply(this,a)),l}:e.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=e[r.level];i?i.unshift(r.tokenizer):e[r.level]=[r.tokenizer],r.start&&(r.level==="block"?e.startBlock?e.startBlock.push(r.start):e.startBlock=[r.start]:r.level==="inline"&&(e.startInline?e.startInline.push(r.start):e.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(e.childTokens[r.name]=r.childTokens)}),s.extensions=e),n.renderer){let r=this.defaults.renderer||new Yt(this.defaults);for(let i in n.renderer){if(!(i in r))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let a=i,l=n.renderer[a],o=r[a];r[a]=(...u)=>{let c=l.apply(r,u);return c===!1&&(c=o.apply(r,u)),c||""}}s.renderer=r}if(n.tokenizer){let r=this.defaults.tokenizer||new Kt(this.defaults);for(let i in n.tokenizer){if(!(i in r))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let a=i,l=n.tokenizer[a],o=r[a];r[a]=(...u)=>{let c=l.apply(r,u);return c===!1&&(c=o.apply(r,u)),c}}s.tokenizer=r}if(n.hooks){let r=this.defaults.hooks||new Tt;for(let i in n.hooks){if(!(i in r))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let a=i,l=n.hooks[a],o=r[a];Tt.passThroughHooks.has(i)?r[a]=u=>{if(this.defaults.async&&Tt.passThroughHooksRespectAsync.has(i))return(async()=>{let h=await l.call(r,u);return o.call(r,h)})();let c=l.call(r,u);return o.call(r,c)}:r[a]=(...u)=>{if(this.defaults.async)return(async()=>{let h=await l.apply(r,u);return h===!1&&(h=await o.apply(r,u)),h})();let c=l.apply(r,u);return c===!1&&(c=o.apply(r,u)),c}}s.hooks=r}if(n.walkTokens){let r=this.defaults.walkTokens,i=n.walkTokens;s.walkTokens=function(a){let l=[];return l.push(i.call(this,a)),r&&(l=l.concat(r.call(this,a))),l}}this.defaults={...this.defaults,...s}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return Ie.lex(t,e??this.defaults)}parser(t,e){return ze.parse(t,e??this.defaults)}parseMarkdown(t){return(e,n)=>{let s={...n},r={...this.defaults,...s},i=this.onError(!!r.silent,!!r.async);if(this.defaults.async===!0&&s.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(r.hooks&&(r.hooks.options=r,r.hooks.block=t),r.async)return(async()=>{let a=r.hooks?await r.hooks.preprocess(e):e,l=await(r.hooks?await r.hooks.provideLexer():t?Ie.lex:Ie.lexInline)(a,r),o=r.hooks?await r.hooks.processAllTokens(l):l;r.walkTokens&&await Promise.all(this.walkTokens(o,r.walkTokens));let u=await(r.hooks?await r.hooks.provideParser():t?ze.parse:ze.parseInline)(o,r);return r.hooks?await r.hooks.postprocess(u):u})().catch(i);try{r.hooks&&(e=r.hooks.preprocess(e));let a=(r.hooks?r.hooks.provideLexer():t?Ie.lex:Ie.lexInline)(e,r);r.hooks&&(a=r.hooks.processAllTokens(a)),r.walkTokens&&this.walkTokens(a,r.walkTokens);let l=(r.hooks?r.hooks.provideParser():t?ze.parse:ze.parseInline)(a,r);return r.hooks&&(l=r.hooks.postprocess(l)),l}catch(a){return i(a)}}}onError(t,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let s="<p>An error occurred:</p><pre>"+Oe(n.message+"",!0)+"</pre>";return e?Promise.resolve(s):s}if(e)return Promise.reject(n);throw n}}},rt=new oa;function se(t,e){return rt.parse(t,e)}se.options=se.setOptions=function(t){return rt.setOptions(t),se.defaults=rt.defaults,kr(se.defaults),se},se.getDefaults=kn,se.defaults=tt,se.use=function(...t){return rt.use(...t),se.defaults=rt.defaults,kr(se.defaults),se},se.walkTokens=function(t,e){return rt.walkTokens(t,e)},se.parseInline=rt.parseInline,se.Parser=ze,se.parser=ze.parse,se.Renderer=Yt,se.TextRenderer=Cn,se.Lexer=Ie,se.lexer=Ie.lex,se.Tokenizer=Kt,se.Hooks=Tt,se.parse=se,se.options,se.setOptions,se.use,se.walkTokens,se.parseInline,ze.parse,Ie.lex;const Or=`function j() {
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
`,qr=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",Or],{type:"text/javascript;charset=utf-8"});function la(t){let e;try{if(e=qr&&(self.URL||self.webkitURL).createObjectURL(qr),!e)throw"";const n=new Worker(e,{type:"module",name:t?.name});return n.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(e)}),n}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(Or),{type:"module",name:t?.name})}}function ca(t){if(t.startsWith("---")){const e=t.indexOf(`
---`,3);if(e!==-1){const n=t.slice(3,e+0).trim(),s=t.slice(e+4).trimStart(),r={};return n.split(/\r?\n/).forEach(i=>{const a=i.match(/^([^:]+):\s*(.*)$/);a&&(r[a[1].trim()]=a[2].trim())}),{content:s,data:r}}}return{content:t,data:{}}}const Dr=rr(()=>new la,"markdown"),Ur=typeof DOMParser<"u"?new DOMParser:null;function Mn(){return Dr.get()}function ua(t){return Dr.send(t,1e3)}const Xe=[];function _n(t){if(t&&typeof t=="object"){Xe.push(t);try{se.use(t)}catch(e){console.warn("[markdown] failed to apply plugin",e)}}}function ha(t){Xe.length=0,Array.isArray(t)&&Xe.push(...t.filter(e=>e&&typeof e=="object"));try{Xe.forEach(e=>se.use(e))}catch(e){console.warn("[markdown] failed to apply markdown extensions",e)}}async function Vt(t){if(Mn&&Mn())try{const i=await ua({type:"render",md:t});if(i&&i.html!==void 0)try{const l=(Ur||new DOMParser).parseFromString(i.html,"text/html"),o=l.querySelectorAll("h1,h2,h3,h4,h5,h6");o.forEach(h=>{h.id||(h.id=oe(h.textContent||""));try{const f=Number(h.tagName.substring(1));if(f>=1&&f<=6){const p={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},d=f<=2?"has-text-weight-bold":f<=4?"has-text-weight-semibold":"has-text-weight-normal";`${p[f]} ${d}`.split(/\s+/).filter(Boolean).forEach(w=>{try{h.classList.add(w)}catch{}})}}catch{}});try{try{const f=typeof document<"u"&&document.documentElement&&document.documentElement.getAttribute?document.documentElement.getAttribute("data-nimbi-logo-moved"):null;if(f){const p=Array.from(l.querySelectorAll("img"));for(const d of p)try{const g=d.getAttribute("src")||"";if(new URL(g,location.href).toString()===f){const b=d.parentElement;d.remove(),b&&b.tagName&&b.tagName.toLowerCase()==="p"&&b.childNodes.length===0&&b.remove();break}}catch{}}}catch{}l.querySelectorAll("img").forEach(f=>{try{f.getAttribute("loading")||f.setAttribute("data-want-lazy","1")}catch(p){console.warn("[markdown] set image loading attribute failed",p)}})}catch(h){console.warn("[markdown] query images failed",h)}try{l.querySelectorAll("pre code").forEach(f=>{try{const p=f.getAttribute&&f.getAttribute("class")||f.className||"",d=String(p||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(d)try{f.setAttribute&&f.setAttribute("class",d)}catch(b){console.warn("[markdown] set code class failed",b),f.className=d}else try{f.removeAttribute&&f.removeAttribute("class")}catch(b){console.warn("[markdown] remove code class failed",b),f.className=""}const g=d,w=g.match(/language-([a-zA-Z0-9_+-]+)/)||g.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!w||!w[1])try{const b=f.textContent||"";try{if(he&&typeof he.getLanguage=="function"&&he.getLanguage("plaintext")){const x=he.highlight(b,{language:"plaintext"});x&&x.value&&(f.innerHTML=x.value)}}catch{try{he.highlightElement(f)}catch($){console.warn("[markdown] hljs.highlightElement failed",$)}}}catch(b){console.warn("[markdown] code auto-detect failed",b)}}catch(p){console.warn("[markdown] processing code blocks failed",p)}})}catch(h){console.warn("[markdown] query code blocks failed",h)}const u=l.body.innerHTML,c=[];return o.forEach(h=>{c.push({level:Number(h.tagName.substring(1)),text:(h.textContent||"").trim(),id:h.id})}),{html:u,meta:i.meta||{},toc:c}}catch(a){return console.warn("[markdown] post-process worker HTML failed",a),i}}catch(i){console.warn("[markdown] worker render failed",i)}const{content:n,data:s}=ca(t||"");if(se.setOptions({gfm:!0,mangle:!1,headerIds:!1,headerPrefix:""}),Xe&&Xe.length)try{Xe.forEach(i=>se.use(i))}catch(i){console.warn("[markdown] apply plugins failed",i)}let r=se.parse(n);try{const a=(Ur||new DOMParser).parseFromString(r,"text/html"),l=a.querySelectorAll("h1,h2,h3,h4,h5,h6");l.forEach(u=>{u.id||(u.id=oe(u.textContent||""));try{const c=Number(u.tagName.substring(1));if(c>=1&&c<=6){const h={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},f=c<=2?"has-text-weight-bold":c<=4?"has-text-weight-semibold":"has-text-weight-normal";`${h[c]} ${f}`.split(/\s+/).filter(Boolean).forEach(d=>{try{u.classList.add(d)}catch{}})}}catch{}});try{try{const c=typeof document<"u"&&document.documentElement&&document.documentElement.getAttribute?document.documentElement.getAttribute("data-nimbi-logo-moved"):null;if(c){const h=Array.from(a.querySelectorAll("img"));for(const f of h)try{const p=f.getAttribute("src")||"";if(new URL(p,location.href).toString()===c){const g=f.parentElement;f.remove(),g&&g.tagName&&g.tagName.toLowerCase()==="p"&&g.childNodes.length===0&&g.remove();break}}catch{}}}catch{}a.querySelectorAll("img").forEach(c=>{try{c.getAttribute("loading")||c.setAttribute("data-want-lazy","1")}catch(h){console.warn("[markdown] set image loading attribute failed",h)}})}catch(u){console.warn("[markdown] query images failed",u)}try{a.querySelectorAll("pre code").forEach(c=>{try{const h=c.getAttribute&&c.getAttribute("class")||c.className||"",f=String(h||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(f)try{c.setAttribute&&c.setAttribute("class",f)}catch(g){console.warn("[markdown] set code class failed",g),c.className=f}else try{c.removeAttribute&&c.removeAttribute("class")}catch(g){console.warn("[markdown] remove code class failed",g),c.className=""}const p=f,d=p.match(/language-([a-zA-Z0-9_+-]+)/)||p.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!d||!d[1])try{const g=c.textContent||"";try{if(he&&typeof he.getLanguage=="function"&&he.getLanguage("plaintext")){const w=he.highlight(g,{language:"plaintext"});w&&w.value&&(c.innerHTML=w.value)}}catch{try{he.highlightElement(c)}catch(b){console.warn("[markdown] hljs.highlightElement failed",b)}}}catch(g){console.warn("[markdown] code auto-detect failed",g)}}catch(h){console.warn("[markdown] processing code blocks failed",h)}})}catch(u){console.warn("[markdown] query code blocks failed",u)}r=a.body.innerHTML;const o=[];return l.forEach(u=>{o.push({level:Number(u.tagName.substring(1)),text:(u.textContent||"").trim(),id:u.id})}),{html:a.body.innerHTML,meta:s||{},toc:o}}catch(i){console.warn("post-process markdown failed",i)}return{html:r,meta:s||{},toc:[]}}function $n(t,e){const n=new Set,s=/```\s*([a-zA-Z0-9_\-+]+)?/g,r=new Set(["then","now","if","once","so","and","or","but","when","the","a","an","as","let","const","var","export","import","from","true","false","null","npm","run","echo","sudo","this","that","have","using","some","return","returns","function","console","log","error","warn","class","new","undefined","with","select","from","where","join","on","group","order","by","having","as","into","values","like","limit","offset","create","table","index","view","insert","update","delete","returning","and","or","not","all","any","exists","case","when","then","else","end","distance","geometry","you","which","would","why","cool","other","same","everything","check"]),i=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);let a;for(;a=s.exec(t);)if(a[1]){const l=a[1].toLowerCase();if(cn.has(l)||e&&e.size&&l.length<3&&!e.has(l)&&!(Ce&&Ce[l]&&e.has(Ce[l])))continue;if(e&&e.size){if(e.has(l)){const u=e.get(l);u&&n.add(u);continue}if(Ce&&Ce[l]){const u=Ce[l];if(e.has(u)){const c=e.get(u)||u;n.add(c);continue}}}(i.has(l)||l.length>=5&&l.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(l)&&!r.has(l))&&n.add(l)}return n}const da=Object.freeze(Object.defineProperty({__proto__:null,addMarkdownExtension:_n,detectFenceLanguages:$n,initRendererWorker:Mn,markdownPlugins:Xe,parseMarkdownToHtml:Vt,setMarkdownExtensions:ha},Symbol.toStringTag,{value:"Module"}));function fa(t,e){try{return new URL(t,e).pathname}catch{try{return new URL(t,typeof location<"u"?location.href:"http://localhost/").pathname}catch{try{return(String(e||"").replace(/\/$/,"")+"/"+String(t||"").replace(/^\//,"")).replace(/\/\\+/g,"/")}catch{return String(t||"")}}}}function pa(t,e){const n=document.createElement("aside");n.className="menu box nimbi-nav";const s=document.createElement("p");s.className="menu-label",s.textContent=t("navigation"),n.appendChild(s);const r=document.createElement("ul");return r.className="menu-list",e.forEach(i=>{const a=document.createElement("li"),l=document.createElement("a");if(l.href="#"+i.path,l.textContent=i.name,a.appendChild(l),i.children&&i.children.length){const o=document.createElement("ul");i.children.forEach(u=>{const c=document.createElement("li"),h=document.createElement("a");h.href="#"+u.path,h.textContent=u.name,c.appendChild(h),o.appendChild(c)}),a.appendChild(o)}r.appendChild(a)}),n.appendChild(r),n}function ga(t,e,n=""){const s=document.createElement("aside");s.className="menu box nimbi-toc-inner";const r=document.createElement("p");r.className="menu-label",r.textContent=t("onThisPage"),s.appendChild(r);const i=document.createElement("ul");i.className="menu-list";try{const a={};(e||[]).forEach(l=>{try{if(!l||l.level===1)return;const o=Number(l.level)>=2?Number(l.level):2,u=document.createElement("li"),c=document.createElement("a"),h=l.id||oe(l.text||"");c.textContent=l.text||"";try{const g=String(n||"").replace(/^[\\.\\/]+/,""),w=g&&D&&D.has&&D.has(g)?D.get(g):g;w?c.href=`?page=${encodeURIComponent(w)}#${encodeURIComponent(h)}`:c.href=`#${encodeURIComponent(h)}`}catch(g){console.warn("[htmlBuilder] buildTocElement href normalization failed",g),c.href=`#${encodeURIComponent(h)}`}if(u.appendChild(c),o===2){i.appendChild(u),a[2]=u,Object.keys(a).forEach(g=>{Number(g)>2&&delete a[g]});return}let f=o-1;for(;f>2&&!a[f];)f--;f<2&&(f=2);let p=a[f];if(!p){i.appendChild(u),a[o]=u;return}let d=p.querySelector("ul");d||(d=document.createElement("ul"),p.appendChild(d)),d.appendChild(u),a[o]=u}catch(o){console.warn("[htmlBuilder] buildTocElement item failed",o,l)}})}catch(a){console.warn("[htmlBuilder] buildTocElement failed",a)}return s.appendChild(i),s}function Hr(t){t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(n=>{n.id||(n.id=oe(n.textContent||""))})}function ma(t,e,n){try{const s=t.querySelectorAll("img");if(s&&s.length){const r=e&&e.includes("/")?e.substring(0,e.lastIndexOf("/")+1):"";s.forEach(i=>{const a=i.getAttribute("src")||"";if(a&&!(/^(https?:)?\/\//.test(a)||a.startsWith("/")))try{const l=new URL(r+a,n).toString();i.src=l;try{i.getAttribute("loading")||i.setAttribute("data-want-lazy","1")}catch(o){console.warn("[htmlBuilder] set image loading attribute failed",o)}}catch(l){console.warn("[htmlBuilder] resolve image src failed",l)}})}}catch(s){console.warn("[htmlBuilder] lazyLoadImages failed",s)}}function jr(t,e,n){try{const s=e&&e.includes("/")?e.substring(0,e.lastIndexOf("/")+1):"";let r=null;try{const a=new URL(n,location.href);r=new URL(s||".",a).toString()}catch{try{r=new URL(s||".",location.href).toString()}catch{r=s||"./"}}const i=t.querySelectorAll("*");for(const a of Array.from(i||[]))try{const l=a.tagName?a.tagName.toLowerCase():"",o=u=>{try{const c=a.getAttribute(u)||"";if(!c||/^(https?:)?\/\//i.test(c)||c.startsWith("/")||c.startsWith("#"))return;try{a.setAttribute(u,new URL(c,r).toString())}catch(h){console.warn("[htmlBuilder] rewrite asset attribute failed",u,c,h)}}catch(c){console.warn("[htmlBuilder] rewriteAttr failed",c)}};if(a.hasAttribute&&a.hasAttribute("src")&&o("src"),a.hasAttribute&&a.hasAttribute("href")&&l!=="a"&&o("href"),a.hasAttribute&&a.hasAttribute("xlink:href")&&o("xlink:href"),a.hasAttribute&&a.hasAttribute("poster")&&o("poster"),a.hasAttribute("srcset")){const h=(a.getAttribute("srcset")||"").split(",").map(f=>f.trim()).filter(Boolean).map(f=>{const[p,d]=f.split(/\s+/,2);if(!p||/^(https?:)?\/\//i.test(p)||p.startsWith("/"))return f;try{const g=new URL(p,r).toString();return d?`${g} ${d}`:g}catch{return f}}).join(", ");a.setAttribute("srcset",h)}}catch(l){console.warn("[htmlBuilder] rewriteRelativeAssets node processing failed",l)}}catch(s){console.warn("[htmlBuilder] rewriteRelativeAssets failed",s)}}let Fr="",Pn=null,Wr="";async function Zr(t,e,n){try{const s=t.querySelectorAll("a");if(!s||!s.length)return;let r,i;if(e===Fr&&Pn)r=Pn,i=Wr;else{try{r=new URL(e,location.href),i=wt(r.pathname)}catch{try{r=new URL(e,location.href),i=wt(r.pathname)}catch{r=null,i="/"}}Fr=e,Pn=r,Wr=i}const a=new Set,l=[],o=new Set,u=[];for(const c of Array.from(s))try{const h=c.getAttribute("href")||"";if(!h||or(h))continue;try{if(h.startsWith("?")||h.indexOf("?")!==-1)try{const p=new URL(h,e||location.href),d=p.searchParams.get("page");if(d&&d.indexOf("/")===-1&&n){const g=n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"";if(g){const w=ge(g+d);c.setAttribute("href","?page="+encodeURIComponent(w)+(p.hash||""));continue}}}catch{}}catch{}if(h.startsWith("/")&&!h.endsWith(".md"))continue;const f=h.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(f){let p=f[1];const d=f[2];!p.startsWith("/")&&n&&(p=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+p);try{const g=new URL(p,e).pathname;let w=g.startsWith(i)?g.slice(i.length):g;w=ge(w),l.push({node:c,mdPathRaw:p,frag:d,rel:w}),D.has(w)||a.add(w)}catch(g){console.warn("[htmlBuilder] resolve mdPath failed",g)}continue}try{let p=h;!h.startsWith("/")&&n&&(h.startsWith("#")?p=n+h:p=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+h);const g=new URL(p,e).pathname||"";if(g&&g.indexOf(i)!==-1){let w=g.startsWith(i)?g.slice(i.length):g;if(w=ge(w),w=mt(w),w||(w="_home"),!w.endsWith(".md")){let b=null;try{if(D&&D.has&&D.has(w))b=D.get(w);else try{const x=String(w||"").replace(/^.*\//,"");x&&D.has&&D.has(x)&&(b=D.get(x))}catch(x){console.warn("[htmlBuilder] mdToSlug baseName check failed",x)}}catch(x){console.warn("[htmlBuilder] mdToSlug access check failed",x)}if(!b)try{const x=String(w||"").replace(/^.*\//,"");for(const[$,M]of V||[])if(M===w||M===x){b=$;break}}catch{}b?c.setAttribute("href",`?page=${encodeURIComponent(b)}`):(o.add(w),u.push({node:c,rel:w}))}}}catch(p){console.warn("[htmlBuilder] resolving href to URL failed",p)}}catch(h){console.warn("[htmlBuilder] processing anchor failed",h)}a.size&&await Promise.all(Array.from(a).map(async c=>{try{try{const f=String(c).match(/([^\/]+)\.md$/),p=f&&f[1];if(p&&V.has(p)){try{const d=V.get(p);if(d)try{D.set(d,p)}catch(g){console.warn("[htmlBuilder] mdToSlug.set failed",g)}}catch(d){console.warn("[htmlBuilder] reading slugToMd failed",d)}return}}catch(f){console.warn("[htmlBuilder] basename slug lookup failed",f)}const h=await Se(c,e);if(h&&h.raw){const f=(h.raw||"").match(/^#\s+(.+)$/m);if(f&&f[1]){const p=oe(f[1].trim());if(p)try{V.set(p,c),D.set(c,p)}catch(d){console.warn("[htmlBuilder] setting slug mapping failed",d)}}}}catch(h){console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed",h)}})),o.size&&await Promise.all(Array.from(o).map(async c=>{try{const h=await Se(c,e);if(h&&h.raw)try{const p=(In||new DOMParser).parseFromString(h.raw,"text/html"),d=p.querySelector("title"),g=p.querySelector("h1"),w=d&&d.textContent&&d.textContent.trim()?d.textContent.trim():g&&g.textContent?g.textContent.trim():null;if(w){const b=oe(w);if(b)try{V.set(b,c),D.set(c,b)}catch(x){console.warn("[htmlBuilder] setting html slug mapping failed",x)}}}catch(f){console.warn("[htmlBuilder] parse fetched HTML failed",f)}}catch(h){console.warn("[htmlBuilder] fetchMarkdown for htmlPending failed",h)}}));for(const c of l){const{node:h,frag:f,rel:p}=c;let d=null;try{D.has(p)&&(d=D.get(p))}catch(g){console.warn("[htmlBuilder] mdToSlug access failed",g)}d?f?h.setAttribute("href",`?page=${encodeURIComponent(d)}#${encodeURIComponent(f)}`):h.setAttribute("href",`?page=${encodeURIComponent(d)}`):f?h.setAttribute("href",`?page=${encodeURIComponent(p)}#${encodeURIComponent(f)}`):h.setAttribute("href",`?page=${encodeURIComponent(p)}`)}for(const c of u){const{node:h,rel:f}=c;let p=null;try{D.has(f)&&(p=D.get(f))}catch(d){console.warn("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo",d)}if(!p)try{const d=String(f||"").replace(/^.*\//,"");D.has(d)&&(p=D.get(d))}catch(d){console.warn("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo",d)}p?h.setAttribute("href",`?page=${encodeURIComponent(p)}`):h.setAttribute("href",`?page=${encodeURIComponent(f)}`)}}catch(s){console.warn("[htmlBuilder] rewriteAnchors failed",s)}}function wa(t,e,n,s){const r=e.querySelector("h1"),i=r?(r.textContent||"").trim():"";let a="";try{let l="";try{t&&t.meta&&t.meta.title&&(l=String(t.meta.title).trim())}catch{}if(!l&&i&&(l=i),!l)try{const o=e.querySelector("h2");o&&o.textContent&&(l=String(o.textContent).trim())}catch{}!l&&n&&(l=String(n)),l&&(a=oe(l)),a||(a="_home");try{n&&(V.set(a,n),D.set(n,a))}catch(o){console.warn("[htmlBuilder] computeSlug set slug mapping failed",o)}try{let o="?page="+encodeURIComponent(a);try{const u=s||(location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):"");u&&(o+="#"+encodeURIComponent(u))}catch(u){console.warn("[htmlBuilder] computeSlug hash decode failed",u)}try{history.replaceState({page:a},"",o)}catch(u){console.warn("[htmlBuilder] computeSlug history replace failed",u)}}catch(o){console.warn("[htmlBuilder] computeSlug inner failed",o)}}catch(l){console.warn("[htmlBuilder] computeSlug failed",l)}return{topH1:r,h1Text:i,slugKey:a}}async function ba(t,e){if(!t||!t.length)return;const n=new Set;for(const o of Array.from(t||[]))try{const u=o.getAttribute("href")||"";if(!u)continue;let f=ge(u).split(/::|#/,2)[0];try{const d=f.indexOf("?");d!==-1&&(f=f.slice(0,d))}catch{}if(!f||(f.includes(".")||(f=f+".html"),!/\.html(?:$|[?#])/.test(f)&&!f.toLowerCase().endsWith(".html")))continue;const p=f;try{if(D&&D.has&&D.has(p))continue}catch(d){console.warn("[htmlBuilder] mdToSlug check failed",d)}try{let d=!1;for(const g of V.values())if(g===p){d=!0;break}if(d)continue}catch(d){console.warn("[htmlBuilder] slugToMd iteration failed",d)}n.add(p)}catch(u){console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed",u)}if(!n.size)return;const s=async o=>{try{const u=await Se(o,e);if(u&&u.raw)try{const h=(In||new DOMParser).parseFromString(u.raw,"text/html"),f=h.querySelector("title"),p=h.querySelector("h1"),d=f&&f.textContent&&f.textContent.trim()?f.textContent.trim():p&&p.textContent?p.textContent.trim():null;if(d){const g=oe(d);if(g)try{V.set(g,o),D.set(o,g)}catch(w){console.warn("[htmlBuilder] set slugToMd/mdToSlug failed",w)}}}catch(c){console.warn("[htmlBuilder] parse HTML title failed",c)}}catch(u){console.warn("[htmlBuilder] fetchAndExtract failed",u)}},r=5,i=Array.from(n);let a=0;const l=[];for(;a<i.length;){const o=i.slice(a,a+r);l.push(Promise.all(o.map(s))),a+=r}await Promise.all(l)}async function ya(t,e){if(!t||!t.length)return;const n=[],s=new Set;let r="";try{const i=new URL(e,typeof location<"u"?location.href:"http://localhost/");r=wt(i.pathname)}catch(i){r="",console.warn("[htmlBuilder] preMapMdSlugs parse base failed",i)}for(const i of Array.from(t||[]))try{const a=i.getAttribute("href")||"";if(!a)continue;const l=a.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(l){let o=ge(l[1]);try{let u;try{u=fa(o,e)}catch(h){u=o,console.warn("[htmlBuilder] resolve mdPath URL failed",h)}const c=u&&r&&u.startsWith(r)?u.slice(r.length):String(u||"").replace(/^\//,"");n.push({rel:c}),D.has(c)||s.add(c)}catch(u){console.warn("[htmlBuilder] rewriteAnchors failed",u)}continue}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed",a)}s.size&&await Promise.all(Array.from(s).map(async i=>{try{const a=String(i).match(/([^\/]+)\.md$/),l=a&&a[1];if(l&&V.has(l)){try{const o=V.get(l);o&&D.set(o,l)}catch(o){console.warn("[htmlBuilder] preMapMdSlugs slug map access failed",o)}return}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs basename check failed",a)}try{const a=await Se(i,e);if(a&&a.raw){const l=(a.raw||"").match(/^#\s+(.+)$/m);if(l&&l[1]){const o=oe(l[1].trim());if(o)try{V.set(o,i),D.set(i,o)}catch(u){console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed",u)}}}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs fetch failed",a)}}))}const In=typeof DOMParser<"u"?new DOMParser:null;function zn(t){try{const n=(In||new DOMParser).parseFromString(t||"","text/html");Hr(n);try{n.querySelectorAll("img").forEach(o=>{try{o.getAttribute("loading")||o.setAttribute("data-want-lazy","1")}catch(u){console.warn("[htmlBuilder] parseHtml set image loading attribute failed",u)}})}catch(l){console.warn("[htmlBuilder] parseHtml query images failed",l)}n.querySelectorAll("pre code, code[class]").forEach(l=>{try{const o=l.getAttribute&&l.getAttribute("class")||l.className||"",u=o.match(/language-([a-zA-Z0-9_+-]+)/)||o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(u&&u[1]){const c=(u[1]||"").toLowerCase(),h=J.size&&(J.get(c)||J.get(String(c).toLowerCase()))||c;try{(async()=>{try{await at(h)}catch(f){console.warn("[htmlBuilder] registerLanguage failed",f)}})()}catch(f){console.warn("[htmlBuilder] schedule registerLanguage failed",f)}}else try{if(he&&typeof he.getLanguage=="function"&&he.getLanguage("plaintext")){const c=he.highlight?he.highlight(l.textContent||"",{language:"plaintext"}):null;c&&c.value&&(l.innerHTML=c.value)}}catch(c){console.warn("[htmlBuilder] plaintext highlight fallback failed",c)}}catch(o){console.warn("[htmlBuilder] code element processing failed",o)}});const r=[];n.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(l=>{r.push({level:Number(l.tagName.substring(1)),text:(l.textContent||"").trim(),id:l.id})});const a={};try{const l=n.querySelector("title");l&&l.textContent&&String(l.textContent).trim()&&(a.title=String(l.textContent).trim())}catch{}return{html:n.body.innerHTML,meta:a,toc:r}}catch(e){return console.warn("[htmlBuilder] parseHtml failed",e),{html:t||"",meta:{},toc:[]}}}async function ka(t){const e=$n?$n(t||"",J):new Set,n=new Set(e),s=[];for(const r of n)try{const i=J.size&&(J.get(r)||J.get(String(r).toLowerCase()))||r;try{s.push(at(i))}catch(a){console.warn("[htmlBuilder] ensureLanguages push canonical failed",a)}if(String(r)!==String(i))try{s.push(at(r))}catch(a){console.warn("[htmlBuilder] ensureLanguages push alias failed",a)}}catch(i){console.warn("[htmlBuilder] ensureLanguages inner failed",i)}try{await Promise.all(s)}catch(r){console.warn("[htmlBuilder] ensureLanguages failed",r)}}async function xa(t){if(await ka(t),Vt){const e=await Vt(t||"");return!e||typeof e!="object"?{html:String(t||""),meta:{},toc:[]}:(Array.isArray(e.toc)||(e.toc=[]),e.meta||(e.meta={}),e)}return{html:String(t||""),meta:{},toc:[]}}async function Sa(t,e,n,s,r){let i=null;if(e.isHtml)try{const h=typeof DOMParser<"u"?new DOMParser:null;if(h){const f=h.parseFromString(e.raw||"","text/html");try{jr(f.body,n,r)}catch(p){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)",p)}i=zn(f.documentElement&&f.documentElement.outerHTML?f.documentElement.outerHTML:e.raw||"")}else i=zn(e.raw||"")}catch{i=zn(e.raw||"")}else i=await xa(e.raw||"");const a=document.createElement("article");a.className="nimbi-article content",a.innerHTML=i.html;try{jr(a,n,r)}catch(h){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle",h)}try{Hr(a)}catch(h){console.warn("[htmlBuilder] addHeadingIds failed",h)}try{a.querySelectorAll("pre code, code[class]").forEach(f=>{try{const p=f.getAttribute&&f.getAttribute("class")||f.className||"",d=String(p||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(d)try{f.setAttribute&&f.setAttribute("class",d)}catch(g){f.className=d,console.warn("[htmlBuilder] set element class failed",g)}else try{f.removeAttribute&&f.removeAttribute("class")}catch(g){f.className="",console.warn("[htmlBuilder] remove element class failed",g)}}catch(p){console.warn("[htmlBuilder] code element cleanup failed",p)}})}catch(h){console.warn("[htmlBuilder] processing code elements failed",h)}try{Vn(a)}catch(h){console.warn("[htmlBuilder] observeCodeBlocks failed",h)}ma(a,n,r);try{(a.querySelectorAll&&a.querySelectorAll("img")||[]).forEach(f=>{try{const p=f.parentElement;if(!p||p.tagName.toLowerCase()!=="p"||p.childNodes.length!==1)return;const d=document.createElement("figure");d.className="image",p.replaceWith(d),d.appendChild(f)}catch{}})}catch(h){console.warn("[htmlBuilder] wrap images in Bulma image helper failed",h)}try{(a.querySelectorAll&&a.querySelectorAll("table")||[]).forEach(f=>{try{if(f.classList)f.classList.contains("table")||f.classList.add("table");else{const p=f.getAttribute&&f.getAttribute("class")?f.getAttribute("class"):"",d=String(p||"").split(/\s+/).filter(Boolean);d.indexOf("table")===-1&&d.push("table");try{f.setAttribute&&f.setAttribute("class",d.join(" "))}catch{f.className=d.join(" ")}}}catch{}})}catch(h){console.warn("[htmlBuilder] add Bulma table class failed",h)}const{topH1:l,h1Text:o,slugKey:u}=wa(i,a,n,s);try{await Aa(a,r,n)}catch(h){console.warn("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread",h),await Zr(a,r,n)}const c=ga(t,i.toc,n);return{article:a,parsed:i,toc:c,topH1:l,h1Text:o,slugKey:u}}function va(t){if(!(!t||!t.querySelectorAll))try{const e=Array.from(t.querySelectorAll("script"));for(const n of e)try{const s=document.createElement("script");for(const i of Array.from(n.attributes||[]))try{s.setAttribute(i.name,i.value)}catch{}if(!n.src){try{s.type="module"}catch{}s.textContent=n.textContent||""}if(n.src)try{if(document.querySelector&&document.querySelector(`script[src="${n.src}"]`)){n.parentNode&&n.parentNode.removeChild(n);continue}}catch{}const r=n.src||"<inline>";s.addEventListener("error",i=>{try{console.warn("[htmlBuilder] injected script error",{src:r,ev:i})}catch{}}),s.addEventListener("load",()=>{try{console.info("[htmlBuilder] injected script loaded",{src:r,hasNimbi:!!(window&&window.nimbiCMS)})}catch{}}),(document.head||document.body||document.documentElement).appendChild(s),n.parentNode&&n.parentNode.removeChild(n);try{console.info("[htmlBuilder] executed injected script",r)}catch{}}catch(s){console.warn("[htmlBuilder] execute injected script failed",s)}}catch{}}function Gr(t,e,n){t&&(t.innerHTML="");const s=document.createElement("article");s.className="nimbi-article content nimbi-not-found";const r=document.createElement("h1");r.textContent=e&&e("notFound")||"Page not found";const i=document.createElement("p");i.textContent=n&&n.message?String(n.message):"Failed to resolve the requested page.",s.appendChild(r),s.appendChild(i),t&&t.appendChild&&t.appendChild(s)}async function Aa(t,e,n){return Zr(t,e,n)}function Ea(t){try{t.addEventListener("click",e=>{const n=e.target&&e.target.closest?e.target.closest("a"):null;if(!n)return;const s=n.getAttribute("href")||"";try{const r=new URL(s,location.href),i=r.searchParams.get("page"),a=r.hash?r.hash.replace(/^#/,""):null;if(!i&&!a)return;e.preventDefault();let l=null;try{history&&history.state&&history.state.page&&(l=history.state.page)}catch(o){l=null,console.warn("[htmlBuilder] access history.state failed",o)}try{l||(l=new URL(location.href).searchParams.get("page"))}catch(o){console.warn("[htmlBuilder] parse current location failed",o)}if(!i&&a||i&&l&&String(i)===String(l)){try{if(!i&&a)try{history.replaceState(history.state,"",(location.pathname||"")+(location.search||"")+(a?"#"+encodeURIComponent(a):""))}catch(o){console.warn("[htmlBuilder] history.replaceState failed",o)}else try{history.replaceState({page:l||i},"","?page="+encodeURIComponent(l||i)+(a?"#"+encodeURIComponent(a):""))}catch(o){console.warn("[htmlBuilder] history.replaceState failed",o)}}catch(o){console.warn("[htmlBuilder] update history for anchor failed",o)}try{e.stopImmediatePropagation&&e.stopImmediatePropagation(),e.stopPropagation&&e.stopPropagation()}catch(o){console.warn("[htmlBuilder] stopPropagation failed",o)}try{Bn(a)}catch(o){console.warn("[htmlBuilder] scrollToAnchorOrTop failed",o)}return}history.pushState({page:i},"","?page="+encodeURIComponent(i)+(a?"#"+encodeURIComponent(a):""));try{if(typeof window<"u"&&typeof window.renderByQuery=="function")try{window.renderByQuery()}catch(o){console.warn("[htmlBuilder] window.renderByQuery failed",o)}else if(typeof window<"u")try{window.dispatchEvent(new PopStateEvent("popstate"))}catch(o){console.warn("[htmlBuilder] dispatch popstate failed",o)}else try{renderByQuery()}catch(o){console.warn("[htmlBuilder] renderByQuery failed",o)}}catch(o){console.warn("[htmlBuilder] SPA navigation invocation failed",o)}}catch(r){console.warn("[htmlBuilder] non-URL href in attachTocClickHandler",r)}})}catch(e){console.warn("[htmlBuilder] attachTocClickHandler failed",e)}}function Bn(t){const e=document.querySelector(".nimbi-cms")||null;if(t){const n=document.getElementById(t);if(n)try{const s=()=>{try{if(e&&e.scrollTo&&e.contains(n)){const r=n.getBoundingClientRect().top-e.getBoundingClientRect().top+e.scrollTop;e.scrollTo({top:r,behavior:"smooth"})}else try{n.scrollIntoView({behavior:"smooth",block:"start"})}catch{try{n.scrollIntoView()}catch(i){console.warn("[htmlBuilder] scrollIntoView failed",i)}}}catch{try{n.scrollIntoView()}catch(i){console.warn("[htmlBuilder] final scroll fallback failed",i)}}};try{requestAnimationFrame(()=>setTimeout(s,50))}catch(r){console.warn("[htmlBuilder] scheduling scroll failed",r),setTimeout(s,50)}}catch(s){try{n.scrollIntoView()}catch(r){console.warn("[htmlBuilder] final scroll fallback failed",r)}console.warn("[htmlBuilder] doScroll failed",s)}}else try{e&&e.scrollTo?e.scrollTo({top:0,behavior:"smooth"}):window.scrollTo(0,0)}catch(n){try{window.scrollTo(0,0)}catch(s){console.warn("[htmlBuilder] window.scrollTo failed",s)}console.warn("[htmlBuilder] scroll to top failed",n)}}function Ra(t,e,{mountOverlay:n=null,container:s=null,mountEl:r=null,navWrap:i=null,t:a=null}={}){try{const l=a||(g=>typeof g=="string"?g:""),o=s||document.querySelector(".nimbi-cms"),u=r||document.querySelector(".nimbi-mount"),c=n||document.querySelector(".nimbi-overlay"),h=i||document.querySelector(".nimbi-nav-wrap");let p=document.querySelector(".nimbi-scroll-top");if(!p){p=document.createElement("button"),p.className="nimbi-scroll-top button is-primary is-rounded is-small",p.setAttribute("aria-label",l("scrollToTop")),p.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';try{c&&c.appendChild?c.appendChild(p):o&&o.appendChild?o.appendChild(p):u&&u.appendChild?u.appendChild(p):document.body.appendChild(p)}catch{try{document.body.appendChild(p)}catch(w){console.warn("[htmlBuilder] append scroll top button failed",w)}}try{try{tr(p)}catch{}}catch(g){console.warn("[htmlBuilder] set scroll-top button theme registration failed",g)}p.addEventListener("click",()=>{try{s&&s.scrollTo?s.scrollTo({top:0,left:0,behavior:"smooth"}):r&&r.scrollTo?r.scrollTo({top:0,left:0,behavior:"smooth"}):window.scrollTo({top:0,left:0,behavior:"smooth"})}catch{try{s&&(s.scrollTop=0)}catch(w){console.warn("[htmlBuilder] fallback container scrollTop failed",w)}try{r&&(r.scrollTop=0)}catch(w){console.warn("[htmlBuilder] fallback mountEl scrollTop failed",w)}try{document.documentElement.scrollTop=0}catch(w){console.warn("[htmlBuilder] fallback document scrollTop failed",w)}}})}const d=h&&h.querySelector?h.querySelector(".menu-label"):null;if(e){if(!p._nimbiObserver){const g=new IntersectionObserver(w=>{for(const b of w)b.target instanceof Element&&(b.isIntersecting?(p.classList.remove("show"),d&&d.classList.remove("show")):(p.classList.add("show"),d&&d.classList.add("show")))},{root:s instanceof Element?s:r instanceof Element?r:null,threshold:0});p._nimbiObserver=g}try{p._nimbiObserver.disconnect()}catch(g){console.warn("[htmlBuilder] observer disconnect failed",g)}try{p._nimbiObserver.observe(e)}catch(g){console.warn("[htmlBuilder] observer observe failed",g)}try{const g=()=>{try{const w=o instanceof Element?o.getBoundingClientRect():{top:0,bottom:window.innerHeight},b=e.getBoundingClientRect();!(b.bottom<w.top||b.top>w.bottom)?(p.classList.remove("show"),d&&d.classList.remove("show")):(p.classList.add("show"),d&&d.classList.add("show"))}catch(w){console.warn("[htmlBuilder] checkIntersect failed",w)}};g(),"IntersectionObserver"in window||setTimeout(g,100)}catch(g){console.warn("[htmlBuilder] checkIntersect outer failed",g)}}else{p.classList.remove("show"),d&&d.classList.remove("show");const g=s instanceof Element?s:r instanceof Element?r:window,w=()=>{try{(g===window?window.scrollY:g.scrollTop||0)>10?(p.classList.add("show"),d&&d.classList.add("show")):(p.classList.remove("show"),d&&d.classList.remove("show"))}catch(b){console.warn("[htmlBuilder] onScroll handler failed",b)}};Ot(()=>g.addEventListener("scroll",w)),w()}}catch(l){console.warn("[htmlBuilder] ensureScrollTopButton failed",l)}}function Qr(t,e){try{if(!t)return;try{const n=t[e];if(typeof n<"u")return n}catch{}try{if(t.default)return t.default[e]}catch{}return}catch{return}}async function La(t,e,n,s,r,i,a,l,o="eager",u=1,c=void 0,h="favicon"){if(!t||!(t instanceof HTMLElement))throw new TypeError("navbarWrap must be an HTMLElement");const f=typeof DOMParser<"u"?new DOMParser:null,p=f?f.parseFromString(n||"","text/html"):null,d=p?p.querySelectorAll("a"):[];await Ot(()=>ba(d,s)),await Ot(()=>ya(d,s));let g=null,w=null,b=null;function x(){try{const A=document.querySelector(".navbar-burger"),R=A&&A.dataset?A.dataset.target:null,v=R?document.getElementById(R):null;A&&A.classList.contains("is-active")&&(A.classList.remove("is-active"),A.setAttribute("aria-expanded","false"),v&&v.classList.remove("is-active"))}catch(A){console.warn&&console.warn("[nimbi-cms] closeMobileMenu failed",A)}}const $=()=>g||(g=(async()=>{try{const A=await Promise.resolve().then(()=>Wt),R=Qr(A,"buildSearchIndexWorker"),v=Qr(A,"buildSearchIndex");if(o==="lazy"&&typeof R=="function")try{const E=await R(s,u,c);if(E&&E.length)return E}catch(E){console.warn&&console.warn("[nimbi-cms] worker builder threw",E)}return typeof v=="function"?await v(s,u,c):[]}catch(A){return console.warn("[nimbi-cms] buildSearchIndex failed",A),[]}finally{if(w){try{w.removeAttribute("disabled")}catch{}try{b&&b.classList.remove("is-loading")}catch{}}}})(),g.then(A=>{try{const R=String(w&&w.value||"").trim().toLowerCase();if(!R||!Array.isArray(A)||!A.length)return;const v=A.filter(y=>y.title&&y.title.toLowerCase().includes(R)||y.excerpt&&y.excerpt.toLowerCase().includes(R));if(!v||!v.length)return;const E=document.getElementById("nimbi-search-results");if(!E)return;E.innerHTML="",v.slice(0,10).forEach(y=>{const B=document.createElement("div");if(B.className="nimbi-search-result",y.parentTitle){const ne=document.createElement("div");ne.textContent=y.parentTitle,ne.className="nimbi-search-title nimbi-search-parent",B.appendChild(ne)}const K=document.createElement("a");K.className="block",K.href="?page="+encodeURIComponent(y.slug),K.textContent=y.title,K.addEventListener("click",()=>{try{E.style.display="none"}catch{}}),B.appendChild(K),E.appendChild(B)});try{E.style.display="block"}catch{}}catch{}}).catch(()=>{}),g),M=document.createElement("nav");M.className="navbar",M.setAttribute("role","navigation"),M.setAttribute("aria-label","main navigation");const _=document.createElement("div");_.className="navbar-brand";const I=d[0],j=document.createElement("a");if(j.className="navbar-item",I){const A=I.getAttribute("href")||"#";try{const v=new URL(A,location.href).searchParams.get("page");v?j.href="?page="+encodeURIComponent(decodeURIComponent(v)):(j.href="?page="+encodeURIComponent(r),j.textContent=i("home"))}catch{j.href="?page="+encodeURIComponent(r),j.textContent=i("home")}}else j.href="?page="+encodeURIComponent(r),j.textContent=i("home");async function ee(A){try{if(!A||A==="none")return null;if(A==="favicon")try{const R=document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');if(!R)return null;const v=R.getAttribute("href")||"";return v&&/\.png(?:\?|$)/i.test(v)?new URL(v,location.href).toString():null}catch{return null}if(A==="copy-first"||A==="move-first")try{const R=await Se(r,s);if(!R||!R.raw)return null;const y=new DOMParser().parseFromString(R.raw,"text/html").querySelector("img");if(!y)return null;const B=y.getAttribute("src")||"";if(!B)return null;const K=new URL(B,location.href).toString();if(A==="move-first")try{document.documentElement.setAttribute("data-nimbi-logo-moved",K)}catch{}return K}catch{return null}try{return new URL(A,location.href).toString()}catch{return null}}catch{return null}}let te=null;try{te=await ee(h)}catch{te=null}if(te)try{const A=document.createElement("img");A.className="nimbi-navbar-logo";const R=i&&typeof i=="function"&&(i("home")||i("siteLogo"))||"";A.alt=R,A.title=R,A.src=te;try{j.innerHTML=""}catch{j.textContent=""}j.appendChild(A)}catch{}_.appendChild(j),j.addEventListener("click",function(A){const R=j.getAttribute("href")||"";if(R.startsWith("?page=")){A.preventDefault();const v=new URL(R,location.href),E=v.searchParams.get("page"),y=v.hash?v.hash.replace(/^#/,""):null;history.pushState({page:E},"","?page="+encodeURIComponent(E)+(y?"#"+encodeURIComponent(y):""));try{a()}catch(B){console.warn("[nimbi-cms] renderByQuery failed",B)}try{x()}catch{}}});const G=document.createElement("a");G.className="navbar-burger",G.setAttribute("role","button"),G.setAttribute("aria-label","menu"),G.setAttribute("aria-expanded","false");const U="nimbi-navbar-menu";G.dataset.target=U,G.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>',_.appendChild(G);try{G.addEventListener("click",A=>{try{const R=G.dataset&&G.dataset.target?G.dataset.target:null,v=R?document.getElementById(R):null;G.classList.contains("is-active")?(G.classList.remove("is-active"),G.setAttribute("aria-expanded","false"),v&&v.classList.remove("is-active")):(G.classList.add("is-active"),G.setAttribute("aria-expanded","true"),v&&v.classList.add("is-active"))}catch(R){console.warn("[nimbi-cms] navbar burger toggle failed",R)}})}catch(A){console.warn("[nimbi-cms] burger event binding failed",A)}const F=document.createElement("div");F.className="navbar-menu",F.id=U;const X=document.createElement("div");X.className="navbar-start";let le,H,k;if(!l)le=null,w=null,k=null;else{le=document.createElement("div"),le.className="navbar-end",H=document.createElement("div"),H.className="navbar-item",w=document.createElement("input"),w.className="input",w.type="search",w.placeholder=i("searchPlaceholder")||"",w.id="nimbi-search",o==="eager"&&(w.disabled=!0),b=document.createElement("div"),b.className="control",o==="eager"&&b.classList.add("is-loading"),b.appendChild(w),H.appendChild(b),k=document.createElement("nav"),k.id="nimbi-search-results",k.className="panel nimbi-search-results",H.appendChild(k),le.appendChild(H);const A=v=>{if(k.innerHTML="",!v.length){k.classList.remove("is-open");try{k.style.display="none"}catch{}return}v.forEach(E=>{if(E.parentTitle){const B=document.createElement("p");B.textContent=E.parentTitle,B.className="panel-heading nimbi-search-title nimbi-search-parent",k.appendChild(B)}const y=document.createElement("a");y.className="panel-block nimbi-search-result",y.href="?page="+encodeURIComponent(E.slug),y.textContent=E.title,y.addEventListener("click",()=>{k.style.display="none"}),k.appendChild(y)});try{k.style.display="block"}catch{}k.classList.add("is-open")},R=(v,E)=>{let y=null;return(...B)=>{y&&clearTimeout(y),y=setTimeout(()=>v(...B),E)}};if(w){const v=R(async()=>{const E=document.querySelector("input#nimbi-search"),y=String(E&&E.value||"").trim().toLowerCase();if(!y){A([]);return}try{await $();const K=(await g).filter(ne=>ne.title&&ne.title.toLowerCase().includes(y)||ne.excerpt&&ne.excerpt.toLowerCase().includes(y));A(K.slice(0,10))}catch(B){console.warn("[nimbi-cms] search input handler failed",B),A([])}},50);try{w.addEventListener("input",v)}catch{}try{document.addEventListener("input",E=>{try{E&&E.target&&E.target.id==="nimbi-search"&&v(E)}catch{}},!0)}catch{}}if(o==="eager"){try{g=$()}catch(v){console.warn("[nimbi-cms] eager search index init failed",v),g=Promise.resolve([])}g.finally(()=>{const v=document.querySelector("input#nimbi-search");if(v){try{v.removeAttribute("disabled")}catch{}try{b&&b.classList.remove("is-loading")}catch{}}})}try{const v=E=>{try{const y=E&&E.target;if(!k||!k.classList.contains("is-open")&&k.style&&k.style.display!=="block"||y&&(k.contains(y)||w&&(y===w||w.contains&&w.contains(y))))return;try{k.style.display="none"}catch{}try{k.classList.remove("is-open")}catch{}}catch{}};document.addEventListener("click",v,!0),document.addEventListener("touchstart",v,!0)}catch{}}for(let A=0;A<d.length;A++){const R=d[A];if(A===0)continue;const v=R.getAttribute("href")||"#",E=document.createElement("a");E.className="navbar-item";try{if(/^[^#]*\.md(?:$|[#?])/.test(v)||v.endsWith(".md")){const B=ge(v).split(/::|#/,2),K=B[0],ne=B[1];E.href="?page="+encodeURIComponent(K)+(ne?"#"+encodeURIComponent(ne):"")}else if(/\.html(?:$|[#?])/.test(v)||v.endsWith(".html")){const B=ge(v).split(/::|#/,2);let K=B[0];K&&!K.toLowerCase().endsWith(".html")&&(K=K+".html");const ne=B[1];try{const ve=await Se(K,s);if(ve&&ve.raw)try{const de=new DOMParser().parseFromString(ve.raw,"text/html"),be=de.querySelector("title"),Ye=de.querySelector("h1"),Fe=be&&be.textContent&&be.textContent.trim()?be.textContent.trim():Ye&&Ye.textContent?Ye.textContent.trim():null;if(Fe){const dt=oe(Fe);if(dt){try{V.set(dt,K),D.set(K,dt)}catch(Dn){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",Dn)}E.href="?page="+encodeURIComponent(dt)+(ne?"#"+encodeURIComponent(ne):"")}else E.href="?page="+encodeURIComponent(K)+(ne?"#"+encodeURIComponent(ne):"")}else E.href="?page="+encodeURIComponent(K)+(ne?"#"+encodeURIComponent(ne):"")}catch{E.href="?page="+encodeURIComponent(K)+(ne?"#"+encodeURIComponent(ne):"")}else E.href=v}catch{E.href=v}}else E.href=v}catch(y){console.warn("[nimbi-cms] nav item href parse failed",y),E.href=v}try{const y=R.textContent&&String(R.textContent).trim()?String(R.textContent).trim():null;if(y)try{const B=oe(y);if(B){const K=E.getAttribute&&E.getAttribute("href")?E.getAttribute("href"):"";try{const ve=new URL(K,location.href).searchParams.get("page");if(ve){const ae=decodeURIComponent(ve);try{V.set(B,ae),D.set(ae,B)}catch(de){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",de)}}}catch(ne){console.warn("[nimbi-cms] nav slug mapping failed",ne)}}}catch(B){console.warn("[nimbi-cms] nav slug mapping failed",B)}}catch(y){console.warn("[nimbi-cms] nav slug mapping failed",y)}E.textContent=R.textContent||v,X.appendChild(E)}F.appendChild(X),le&&F.appendChild(le),M.appendChild(_),M.appendChild(F),t.appendChild(M);try{const A=R=>{try{const v=M&&M.querySelector?M.querySelector(".navbar-burger"):document.querySelector(".navbar-burger");if(!v||!v.classList.contains("is-active"))return;const E=v&&v.closest?v.closest(".navbar"):M;if(E&&E.contains(R.target))return;x()}catch{}};document.addEventListener("click",A,!0),document.addEventListener("touchstart",A,!0)}catch{}try{F.addEventListener("click",A=>{const R=A.target&&A.target.closest?A.target.closest("a"):null;if(!R)return;const v=R.getAttribute("href")||"";try{const E=new URL(v,location.href),y=E.searchParams.get("page"),B=E.hash?E.hash.replace(/^#/,""):null;if(y){A.preventDefault(),history.pushState({page:y},"","?page="+encodeURIComponent(y)+(B?"#"+encodeURIComponent(B):""));try{a()}catch(K){console.warn("[nimbi-cms] renderByQuery failed",K)}}}catch(E){console.warn("[nimbi-cms] navbar click handler failed",E)}try{const E=M&&M.querySelector?M.querySelector(".navbar-burger"):null,y=E&&E.dataset?E.dataset.target:null,B=y?document.getElementById(y):null;E&&E.classList.contains("is-active")&&(E.classList.remove("is-active"),E.setAttribute("aria-expanded","false"),B&&B.classList.remove("is-active"))}catch(E){console.warn("[nimbi-cms] mobile menu close failed",E)}})}catch(A){console.warn("[nimbi-cms] attach content click handler failed",A)}try{e.addEventListener("click",A=>{const R=A.target&&A.target.closest?A.target.closest("a"):null;if(!R)return;const v=R.getAttribute("href")||"";if(v&&!or(v))try{const E=new URL(v,location.href),y=E.searchParams.get("page"),B=E.hash?E.hash.replace(/^#/,""):null;if(y){A.preventDefault(),history.pushState({page:y},"","?page="+encodeURIComponent(y)+(B?"#"+encodeURIComponent(B):""));try{a()}catch(K){console.warn("[nimbi-cms] renderByQuery failed",K)}}}catch(E){console.warn("[nimbi-cms] container click URL parse failed",E)}})}catch(A){console.warn("[nimbi-cms] build navbar failed",A)}return{navbar:M,linkEls:d}}try{document.addEventListener("input",t=>{try{if(t&&t.target&&t.target.id==="nimbi-search"){const e=document.getElementById("nimbi-search-results");if(e&&t.target&&t.target.value)try{e.style.display="block"}catch{}}}catch{}},!0)}catch{}var Nn,Xr;function Ta(){if(Xr)return Nn;Xr=1;function t(i,a){return a.some(([l,o])=>l<=i&&i<=o)}function e(i){if(typeof i!="string")return!1;const a=i.charCodeAt(0);return t(a,[[12352,12447],[19968,40959],[44032,55203],[131072,191456]])}function n(i){return` 
\r	`.includes(i)}function s(i){if(typeof i!="string")return!1;const a=i.charCodeAt(0);return t(a,[[33,47],[58,64],[91,96],[123,126],[12288,12351],[65280,65519]])}function r(i,a={}){let l=0,o=0,u=i.length-1;const c=a.wordsPerMinute||200,h=a.wordBound||n;for(;h(i[o]);)o++;for(;h(i[u]);)u--;const f=`${i}
`;for(let w=o;w<=u;w++)if((e(f[w])||!h(f[w])&&(h(f[w+1])||e(f[w+1])))&&l++,e(f[w]))for(;w<=u&&(s(f[w+1])||h(f[w+1]));)w++;const p=l/c,d=Math.round(p*60*1e3);return{text:Math.ceil(p.toFixed(2))+" min read",minutes:p,time:d,words:l}}return Nn=r,Nn}var Ca=Ta();const Ma=Kn(Ca);function Kr(t,e){let n=document.querySelector(`meta[name="${t}"]`);n||(n=document.createElement("meta"),n.setAttribute("name",t),document.head.appendChild(n)),n.setAttribute("content",e)}function ht(t,e,n){let s=`meta[${t}="${e}"]`,r=document.querySelector(s);r||(r=document.createElement("meta"),r.setAttribute(t,e),document.head.appendChild(r)),r.setAttribute("content",n)}function _a(t,e){try{let n=document.querySelector(`link[rel="${t}"]`);n||(n=document.createElement("link"),n.setAttribute("rel",t),document.head.appendChild(n)),n.setAttribute("href",e)}catch(n){console.warn("[seoManager] upsertLinkRel failed",n)}}function $a(t,e,n,s){const r=e&&String(e).trim()?e:t.title||document.title;ht("property","og:title",r);const i=s&&String(s).trim()?s:t.description||"";i&&String(i).trim()&&ht("property","og:description",i),ht("name","twitter:card",t.twitter_card||"summary_large_image");const a=n||t.image;a&&(ht("property","og:image",a),ht("name","twitter:image",a))}function Pa(t,e,n,s,r=""){const i=t.meta||{},a=document&&document.querySelector&&document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",l=s&&String(s).trim()?s:i.description&&String(i.description).trim()?i.description:a&&String(a).trim()?a:"";l&&String(l).trim()&&Kr("description",l),Kr("robots",i.robots||"index,follow"),$a(i,e,n,l)}function Ia(){try{const t=['meta[name="site"]','meta[name="site-name"]','meta[name="siteName"]','meta[property="og:site_name"]','meta[name="twitter:site"]'];for(const e of t){const n=document.querySelector(e);if(n){const s=n.getAttribute("content")||"";if(s&&s.trim())return s.trim()}}}catch(t){console.warn("[seoManager] getSiteNameFromMeta failed",t)}return""}function za(t,e,n,s,r,i=""){try{const a=t.meta||{},l=n&&String(n).trim()?n:a.title||i||document.title,o=r&&String(r).trim()?r:a.description||document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",u=s||a.image||null;let c="";try{if(e){const d=ge(e);try{c=(location.origin+location.pathname).split("?")[0]+"?page="+encodeURIComponent(d)}catch{c=location.href.split("#")[0]}}else c=location.href.split("#")[0]}catch(d){c=location.href.split("#")[0],console.warn("[seoManager] compute canonical failed",d)}c&&_a("canonical",c);try{ht("property","og:url",c)}catch(d){console.warn("[seoManager] upsertMeta og:url failed",d)}const h={"@context":"https://schema.org","@type":"Article",headline:l||"",description:o||"",url:c||location.href.split("#")[0]};u&&(h.image=String(u)),a.date&&(h.datePublished=a.date),a.dateModified&&(h.dateModified=a.dateModified);const f="nimbi-jsonld";let p=document.getElementById(f);p||(p=document.createElement("script"),p.type="application/ld+json",p.id=f,document.head.appendChild(p)),p.textContent=JSON.stringify(h,null,2)}catch(a){console.warn("[seoManager] setStructuredData failed",a)}}function Ba(t,e,n,s,r,i,a,l,o,u,c){try{const h=s.querySelector(".menu-label");h&&(h.textContent=l&&l.textContent||t("onThisPage"))}catch(h){console.warn("[seoManager] update toc label failed",h)}try{const h=n.meta&&n.meta.title?String(n.meta.title).trim():"",f=r.querySelector("img"),p=f&&(f.getAttribute("src")||f.src)||null;let d="";try{let b="";try{const x=l||(r&&r.querySelector?r.querySelector("h1"):null);if(x){let $=x.nextElementSibling;const M=[];for(;$&&!($.tagName&&$.tagName.toLowerCase()==="h2");){const _=($.textContent||"").trim();_&&M.push(_),$=$.nextElementSibling}M.length&&(b=M.join(" ").replace(/\s+/g," ").trim()),!b&&o&&(b=String(o).trim())}}catch(x){console.warn("[seoManager] compute descOverride failed",x)}b&&String(b).length>160&&(b=String(b).slice(0,157).trim()+"..."),d=b}catch(b){console.warn("[seoManager] compute descOverride failed",b)}let g="";try{h&&(g=h)}catch{}if(!g)try{l&&l.textContent&&(g=String(l.textContent).trim())}catch{}if(!g)try{const b=r.querySelector("h2");b&&b.textContent&&(g=String(b.textContent).trim())}catch{}g||(g=i||"");try{Pa(n,g||void 0,p,d)}catch(b){console.warn("[seoManager] setMetaTags failed",b)}try{za(n,u,g||void 0,p,d,e)}catch(b){console.warn("[seoManager] setStructuredData failed",b)}const w=Ia();g?w?document.title=`${w} - ${g}`:document.title=`${e||"Site"} - ${g}`:h?document.title=h:document.title=e||document.title}catch(h){console.warn("[seoManager] applyPageMeta failed",h)}try{const h=r.querySelector(".nimbi-reading-time");if(h&&h.remove(),o){const f=Ma(c.raw||""),p=f&&typeof f.minutes=="number"?Math.ceil(f.minutes):0,d=document.createElement("p");d.className="nimbi-reading-time",d.textContent=p?t("readingTime",{minutes:p}):"";const g=r.querySelector("h1");g&&g.insertAdjacentElement("afterend",d)}}catch(h){console.warn("[seoManager] reading time update failed",h)}}let Re=null,q=null,ke=1,Ke=(t,e)=>e,Ct=0,Mt=0,Jt=()=>{},_t=.25;function Na(){if(Re&&document.contains(Re))return Re;Re=null;const t=document.createElement("dialog");t.className="nimbi-image-preview modal",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label",Ke("imagePreviewTitle","Image preview")),t.innerHTML=`
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
  `,t.addEventListener("click",k=>{k.target===t&&On()}),t.addEventListener("wheel",k=>{if(!G())return;k.preventDefault();const A=k.deltaY<0?_t:-_t;je(ke+A),u(),c()},{passive:!1}),t.addEventListener("keydown",k=>{if(k.key==="Escape"){On();return}if(ke>1){const A=t.querySelector(".nimbi-image-preview__image-wrapper");if(!A)return;const R=40;switch(k.key){case"ArrowUp":A.scrollTop-=R,k.preventDefault();break;case"ArrowDown":A.scrollTop+=R,k.preventDefault();break;case"ArrowLeft":A.scrollLeft-=R,k.preventDefault();break;case"ArrowRight":A.scrollLeft+=R,k.preventDefault();break}}}),document.body.appendChild(t),Re=t,q=t.querySelector("[data-nimbi-preview-image]");const e=t.querySelector("[data-nimbi-preview-fit]"),n=t.querySelector("[data-nimbi-preview-original]"),s=t.querySelector("[data-nimbi-preview-zoom-in]"),r=t.querySelector("[data-nimbi-preview-zoom-out]"),i=t.querySelector("[data-nimbi-preview-reset]"),a=t.querySelector("[data-nimbi-preview-close]"),l=t.querySelector("[data-nimbi-preview-zoom-label]"),o=t.querySelector("[data-nimbi-preview-zoom-hud]");function u(){l&&(l.textContent=`${Math.round(ke*100)}%`)}const c=()=>{o&&(o.textContent=`${Math.round(ke*100)}%`,o.classList.add("visible"),clearTimeout(o._timeout),o._timeout=setTimeout(()=>o.classList.remove("visible"),800))};Jt=u,s.addEventListener("click",()=>{je(ke+_t),u(),c()}),r.addEventListener("click",()=>{je(ke-_t),u(),c()}),e.addEventListener("click",()=>{$t(),u(),c()}),n.addEventListener("click",()=>{je(1),u(),c()}),i.addEventListener("click",()=>{$t(),u(),c()}),a.addEventListener("click",On),e.title=Ke("imagePreviewFit","Fit to screen"),n.title=Ke("imagePreviewOriginal","Original size"),r.title=Ke("imagePreviewZoomOut","Zoom out"),s.title=Ke("imagePreviewZoomIn","Zoom in"),a.title=Ke("imagePreviewClose","Close"),a.setAttribute("aria-label",Ke("imagePreviewClose","Close"));let h=!1,f=0,p=0,d=0,g=0;const w=new Map;let b=0,x=1;const $=(k,A)=>{const R=k.x-A.x,v=k.y-A.y;return Math.hypot(R,v)},M=()=>{h=!1,w.clear(),b=0,q&&(q.classList.add("is-panning"),q.classList.remove("is-grabbing"))};let _=0,I=0,j=0;const ee=k=>{const A=Date.now(),R=A-_,v=k.clientX-I,E=k.clientY-j;_=A,I=k.clientX,j=k.clientY,R<300&&Math.hypot(v,E)<30&&(je(ke>1?1:2),u(),k.preventDefault())},te=k=>{je(ke>1?1:2),u(),k.preventDefault()},G=()=>Re?typeof Re.open=="boolean"?Re.open:Re.classList.contains("is-active"):!1,U=(k,A,R=1)=>{if(w.has(R)&&w.set(R,{x:k,y:A}),w.size===2){const B=Array.from(w.values()),K=$(B[0],B[1]);if(b>0){const ne=K/b;je(x*ne)}return}if(!h)return;const v=q.closest(".nimbi-image-preview__image-wrapper");if(!v)return;const E=k-f,y=A-p;v.scrollLeft=d-E,v.scrollTop=g-y},F=(k,A,R=1)=>{if(!G())return;if(w.set(R,{x:k,y:A}),w.size===2){const y=Array.from(w.values());b=$(y[0],y[1]),x=ke;return}const v=q.closest(".nimbi-image-preview__image-wrapper");!v||!(v.scrollWidth>v.clientWidth||v.scrollHeight>v.clientHeight)||(h=!0,f=k,p=A,d=v.scrollLeft,g=v.scrollTop,q.classList.add("is-panning"),q.classList.remove("is-grabbing"),window.addEventListener("pointermove",X),window.addEventListener("pointerup",le),window.addEventListener("pointercancel",le))},X=k=>{h&&(k.preventDefault(),U(k.clientX,k.clientY,k.pointerId))},le=()=>{M(),window.removeEventListener("pointermove",X),window.removeEventListener("pointerup",le),window.removeEventListener("pointercancel",le)};q.addEventListener("pointerdown",k=>{k.preventDefault(),F(k.clientX,k.clientY,k.pointerId)}),q.addEventListener("pointermove",k=>{(h||w.size===2)&&k.preventDefault(),U(k.clientX,k.clientY,k.pointerId)}),q.addEventListener("pointerup",k=>{k.preventDefault(),k.pointerType==="touch"&&ee(k),M()}),q.addEventListener("dblclick",te),q.addEventListener("pointercancel",M),q.addEventListener("mousedown",k=>{k.preventDefault(),F(k.clientX,k.clientY,1)}),q.addEventListener("mousemove",k=>{h&&k.preventDefault(),U(k.clientX,k.clientY,1)}),q.addEventListener("mouseup",k=>{k.preventDefault(),M()});const H=t.querySelector(".nimbi-image-preview__image-wrapper");return H&&(H.addEventListener("pointerdown",k=>{if(F(k.clientX,k.clientY,k.pointerId),k&&k.target&&k.target.tagName==="IMG")try{k.target.classList.add("is-grabbing")}catch{}}),H.addEventListener("pointermove",k=>{U(k.clientX,k.clientY,k.pointerId)}),H.addEventListener("pointerup",M),H.addEventListener("pointercancel",M),H.addEventListener("mousedown",k=>{if(F(k.clientX,k.clientY,1),k&&k.target&&k.target.tagName==="IMG")try{k.target.classList.add("is-grabbing")}catch{}}),H.addEventListener("mousemove",k=>{U(k.clientX,k.clientY,1)}),H.addEventListener("mouseup",M)),t}function je(t){if(!q)return;const e=Number(t);ke=Number.isFinite(e)?Math.max(.1,Math.min(4,e)):1;const s=q.getBoundingClientRect(),r=Ct||q.naturalWidth||q.width||s.width||0,i=Mt||q.naturalHeight||q.height||s.height||0;if(r&&i){q.style.setProperty("--nimbi-preview-img-max-width","none"),q.style.setProperty("--nimbi-preview-img-max-height","none"),q.style.setProperty("--nimbi-preview-img-width",`${r*ke}px`),q.style.setProperty("--nimbi-preview-img-height",`${i*ke}px`),q.style.setProperty("--nimbi-preview-img-transform","none");try{q.style.width=`${r*ke}px`,q.style.height=`${i*ke}px`,q.style.transform="none"}catch{}}else{q.style.setProperty("--nimbi-preview-img-max-width",""),q.style.setProperty("--nimbi-preview-img-max-height",""),q.style.setProperty("--nimbi-preview-img-width",""),q.style.setProperty("--nimbi-preview-img-height",""),q.style.setProperty("--nimbi-preview-img-transform",`scale(${ke})`);try{q.style.transform=`scale(${ke})`}catch{}}q&&(q.classList.add("is-panning"),q.classList.remove("is-grabbing"))}function $t(){if(!q)return;const t=q.closest(".nimbi-image-preview__image-wrapper");if(!t)return;const e=t.getBoundingClientRect();if(e.width===0||e.height===0)return;const n=Ct||q.naturalWidth||e.width,s=Mt||q.naturalHeight||e.height;if(!n||!s)return;const r=e.width/n,i=e.height/s,a=Math.min(r,i,1);je(Number.isFinite(a)?a:1)}function Oa(t,e="",n=0,s=0){const r=Na();ke=1,Ct=n||0,Mt=s||0,q.src=t,q.alt=e,q.style.transform="scale(1)";const i=()=>{Ct=q.naturalWidth||q.width||0,Mt=q.naturalHeight||q.height||0};if(i(),$t(),Jt(),requestAnimationFrame(()=>{$t(),Jt()}),!Ct||!Mt){const a=()=>{i(),requestAnimationFrame(()=>{$t(),Jt()}),q.removeEventListener("load",a)};q.addEventListener("load",a)}typeof r.showModal=="function"&&(r.open||r.showModal()),r.classList.add("is-active");try{document.documentElement.classList.add("nimbi-image-preview-open")}catch{}r.focus()}function On(){if(Re){typeof Re.close=="function"&&Re.open&&Re.close(),Re.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-image-preview-open")}catch{}}}function qa(t,{t:e,zoomStep:n=.25}={}){if(!t||!t.querySelectorAll)return;Ke=(p,d)=>(typeof e=="function"?e(p):void 0)||d,_t=n,t.addEventListener("click",p=>{const d=p.target;if(!d||d.tagName!=="IMG")return;const g=d;if(g.src){if(p.defaultPrevented!==!0){const w=g.closest("a");w&&w.getAttribute("href")&&p.preventDefault()}Oa(g.src,g.alt||"",g.naturalWidth||0,g.naturalHeight||0)}});let s=!1,r=0,i=0,a=0,l=0;const o=new Map;let u=0,c=1;const h=(p,d)=>{const g=p.x-d.x,w=p.y-d.y;return Math.hypot(g,w)};t.addEventListener("pointerdown",p=>{const d=p.target;if(!d||d.tagName!=="IMG"||!Re||!Re.open)return;if(o.set(p.pointerId,{x:p.clientX,y:p.clientY}),o.size===2){const w=Array.from(o.values());u=h(w[0],w[1]),c=ke;return}const g=d.closest(".nimbi-image-preview__image-wrapper");if(g&&!(ke<=1)){p.preventDefault(),s=!0,r=p.clientX,i=p.clientY,a=g.scrollLeft,l=g.scrollTop,d.setPointerCapture(p.pointerId);try{d.classList.add("is-grabbing")}catch{}}}),t.addEventListener("pointermove",p=>{if(o.has(p.pointerId)&&o.set(p.pointerId,{x:p.clientX,y:p.clientY}),o.size===2){p.preventDefault();const x=Array.from(o.values()),$=h(x[0],x[1]);if(u>0){const M=$/u;je(c*M)}return}if(!s)return;p.preventDefault();const g=p.target.closest(".nimbi-image-preview__image-wrapper");if(!g)return;const w=p.clientX-r,b=p.clientY-i;g.scrollLeft=a-w,g.scrollTop=l-b});const f=()=>{s=!1,o.clear(),u=0;try{const p=document.querySelector("[data-nimbi-preview-image]");p&&(p.classList.add("is-panning"),p.classList.remove("is-grabbing"))}catch{}};t.addEventListener("pointerup",f),t.addEventListener("pointercancel",f)}function Da(t){const{contentWrap:e,navWrap:n,container:s,mountOverlay:r=null,t:i,contentBase:a,homePage:l,initialDocumentTitle:o,runHooks:u}=t||{};if(!e||!(e instanceof HTMLElement))throw new TypeError("contentWrap must be an HTMLElement");let c=null;const h=pa(i,[{path:l,name:i("home"),isIndex:!0,children:[]}]);async function f(b,x){let $,M,_;try{({data:$,pagePath:M,anchor:_}=await bs(b,a))}catch(F){console.error("[nimbi-cms] fetchPageData failed",F),Gr(e,i,F);return}!_&&x&&(_=x);try{Bn(null)}catch(F){console.warn("[nimbi-cms] scrollToAnchorOrTop failed",F)}e.innerHTML="";const{article:I,parsed:j,toc:ee,topH1:te,h1Text:G,slugKey:U}=await Sa(i,$,M,_,a);Ba(i,o,j,ee,I,M,_,te,G,U,$),n.innerHTML="",n.appendChild(ee),Ea(ee);try{await u("transformHtml",{article:I,parsed:j,toc:ee,pagePath:M,anchor:_,topH1:te,h1Text:G,slugKey:U,data:$})}catch(F){console.warn("[nimbi-cms] transformHtml hooks failed",F)}e.appendChild(I);try{va(I)}catch(F){console.warn("[nimbi-cms] executeEmbeddedScripts failed",F)}try{qa(I,{t:i})}catch(F){console.warn("[nimbi-cms] attachImagePreview failed",F)}try{Nt(s,100,!1),requestAnimationFrame(()=>Nt(s,100,!1)),setTimeout(()=>Nt(s,100,!1),250)}catch(F){console.warn("[nimbi-cms] setEagerForAboveFoldImages failed",F)}Bn(_),Ra(I,te,{mountOverlay:r,container:s,navWrap:n,t:i});try{await u("onPageLoad",{data:$,pagePath:M,anchor:_,article:I,toc:ee,topH1:te,h1Text:G,slugKey:U,contentWrap:e,navWrap:n})}catch(F){console.warn("[nimbi-cms] onPageLoad hooks failed",F)}c=M}async function p(){let b=new URLSearchParams(location.search).get("page")||l;const x=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;try{await f(b,x)}catch($){console.warn("[nimbi-cms] renderByQuery failed for",b,$),Gr(e,i,$)}}window.addEventListener("popstate",p);const d=()=>`nimbi-cms-scroll:${location.pathname}${location.search}`,g=()=>{try{const b=s||document.querySelector(".nimbi-cms");if(!b)return;const x={top:b.scrollTop||0,left:b.scrollLeft||0};sessionStorage.setItem(d(),JSON.stringify(x))}catch{}},w=()=>{try{const b=s||document.querySelector(".nimbi-cms");if(!b)return;const x=sessionStorage.getItem(d());if(!x)return;const $=JSON.parse(x);$&&typeof $.top=="number"&&b.scrollTo({top:$.top,left:$.left||0,behavior:"auto"})}catch{}};return window.addEventListener("pageshow",b=>{if(b.persisted)try{w(),Nt(s,100,!1)}catch(x){console.warn("[nimbi-cms] bfcache restore failed",x)}}),window.addEventListener("pagehide",()=>{try{g()}catch(b){console.warn("[nimbi-cms] save scroll position failed",b)}}),{renderByQuery:p,siteNav:h,getCurrentPagePath:()=>c}}function Ua(t){try{const e=typeof t=="string"?t:typeof window<"u"&&window.location?window.location.search:"";if(!e)return{};const n=new URLSearchParams(e.startsWith("?")?e.slice(1):e),s={},r=i=>{if(i==null)return;const a=String(i).toLowerCase();if(a==="1"||a==="true"||a==="yes")return!0;if(a==="0"||a==="false"||a==="no")return!1};if(n.has("contentPath")&&(s.contentPath=n.get("contentPath")),n.has("searchIndex")){const i=r(n.get("searchIndex"));typeof i=="boolean"&&(s.searchIndex=i)}if(n.has("searchIndexMode")){const i=n.get("searchIndexMode");(i==="eager"||i==="lazy")&&(s.searchIndexMode=i)}if(n.has("defaultStyle")){const i=n.get("defaultStyle");(i==="light"||i==="dark")&&(s.defaultStyle=i)}if(n.has("bulmaCustomize")&&(s.bulmaCustomize=n.get("bulmaCustomize")),n.has("lang")&&(s.lang=n.get("lang")),n.has("l10nFile")){const i=n.get("l10nFile");s.l10nFile=i==="null"?null:i}if(n.has("cacheTtlMinutes")){const i=Number(n.get("cacheTtlMinutes"));Number.isFinite(i)&&i>=0&&(s.cacheTtlMinutes=i)}if(n.has("cacheMaxEntries")){const i=Number(n.get("cacheMaxEntries"));Number.isInteger(i)&&i>=0&&(s.cacheMaxEntries=i)}if(n.has("homePage")&&(s.homePage=n.get("homePage")),n.has("notFoundPage")&&(s.notFoundPage=n.get("notFoundPage")),n.has("availableLanguages")&&(s.availableLanguages=n.get("availableLanguages").split(",").map(i=>i.trim()).filter(Boolean)),n.has("indexDepth")){const i=Number(n.get("indexDepth"));Number.isInteger(i)&&(i===1||i===2||i===3)&&(s.indexDepth=i)}if(n.has("noIndexing")){const a=(n.get("noIndexing")||"").split(",").map(l=>l.trim()).filter(Boolean);a.length&&(s.noIndexing=a)}return s}catch{return{}}}function Ha(t){return!(typeof t!="string"||!t.trim()||t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))}function Yr(t){if(typeof t!="string")return!1;const e=t.trim();return!(!e||e.includes("/")||e.includes("\\")||e.includes("..")||!/^[A-Za-z0-9._-]+\.(md|html)$/.test(e))}let qn="";async function Vr(t={}){if(!t||typeof t!="object")throw new TypeError("initCMS(options): options must be an object");const e=Ua();if(e&&(e.contentPath||e.homePage||e.notFoundPage))if(t&&t.allowUrlPathOverrides===!0)try{console.warn("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage")}catch(y){console.warn("[nimbi-cms] allowUrlPathOverrides logging failed",y)}else{try{console.warn("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage")}catch(y){console.warn("[nimbi-cms] logging ignore of URL overrides failed",y)}delete e.contentPath,delete e.homePage,delete e.notFoundPage}const n=Object.assign({},e,t),{el:s,contentPath:r="/content",crawlMaxQueue:i=1e3,searchIndex:a=!0,searchIndexMode:l="eager",indexDepth:o=1,noIndexing:u=void 0,defaultStyle:c="light",bulmaCustomize:h="none",lang:f=void 0,l10nFile:p=null,cacheTtlMinutes:d=5,cacheMaxEntries:g,markdownExtensions:w,availableLanguages:b,homePage:x="_home.md",notFoundPage:$="_404.md"}=n,{navbarLogo:M="favicon"}=n,{skipRootReadme:_=!1}=n;if(n.contentPath!=null&&!Ha(n.contentPath))throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');if(n.homePage!=null&&!Yr(n.homePage))throw new TypeError('initCMS(options): "homePage" must be a simple basename ending with .md or .html');if(n.notFoundPage!=null&&!Yr(n.notFoundPage))throw new TypeError('initCMS(options): "notFoundPage" must be a simple basename ending with .md or .html');if(!s)throw new Error("el is required");let I=s;if(typeof s=="string"){if(I=document.querySelector(s),!I)throw new Error(`el selector "${s}" did not match any element`)}else if(!(s instanceof Element))throw new TypeError("el must be a CSS selector string or a DOM element");if(typeof r!="string"||!r.trim())throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');if(typeof a!="boolean")throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');if(l!=null&&l!=="eager"&&l!=="lazy")throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');if(o!=null&&o!==1&&o!==2&&o!==3)throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');if(c!=="light"&&c!=="dark")throw new TypeError('initCMS(options): "defaultStyle" must be "light" or "dark"');if(h!=null&&typeof h!="string")throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');if(f!=null&&typeof f!="string")throw new TypeError('initCMS(options): "lang" must be a string when provided');if(p!=null&&typeof p!="string")throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');if(d!=null&&(typeof d!="number"||!Number.isFinite(d)||d<0))throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');if(g!=null&&(typeof g!="number"||!Number.isInteger(g)||g<0))throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');if(w!=null&&(!Array.isArray(w)||w.some(y=>!y||typeof y!="object")))throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');if(b!=null&&(!Array.isArray(b)||b.some(y=>typeof y!="string"||!y.trim())))throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');if(u!=null&&(!Array.isArray(u)||u.some(y=>typeof y!="string"||!y.trim())))throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');if(_!=null&&typeof _!="boolean")throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');if(x!=null&&(typeof x!="string"||!x.trim()||!/\.(md|html)$/.test(x)))throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');if($!=null&&(typeof $!="string"||!$.trim()||!/\.(md|html)$/.test($)))throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');const j=!!a;try{Promise.resolve().then(()=>Wt).then(y=>{try{y&&typeof y.setSkipRootReadme=="function"&&y.setSkipRootReadme(!!_)}catch(B){console.warn("[nimbi-cms] setSkipRootReadme failed",B)}}).catch(y=>{})}catch(y){console.warn("[nimbi-cms] setSkipRootReadme dynamic import failed",y)}try{I.classList.add("nimbi-mount")}catch(y){console.warn("[nimbi-cms] mount element setup failed",y)}const ee=document.createElement("section");ee.className="section";const te=document.createElement("div");te.className="container nimbi-cms";const G=document.createElement("div");G.className="columns";const U=document.createElement("div");U.className="column is-full-mobile is-3-tablet nimbi-nav-wrap",U.setAttribute("role","navigation");try{const y=typeof lt=="function"?lt("navigation"):null;y&&U.setAttribute("aria-label",y)}catch(y){console.warn("[nimbi-cms] set nav aria-label failed",y)}G.appendChild(U);const F=document.createElement("main");F.className="column nimbi-content",F.setAttribute("role","main"),G.appendChild(F),te.appendChild(G),ee.appendChild(te);const X=U,le=F;I.appendChild(ee);let H=null;try{H=I.querySelector(".nimbi-overlay"),H||(H=document.createElement("div"),H.className="nimbi-overlay",I.appendChild(H))}catch(y){H=null,console.warn("[nimbi-cms] mount overlay setup failed",y)}const k=location.pathname||"/",A=k.endsWith("/")?k:k.substring(0,k.lastIndexOf("/")+1);try{qn=document.title||""}catch(y){qn="",console.warn("[nimbi-cms] read initial document title failed",y)}let R=r;(R==="."||R==="./")&&(R=""),R.startsWith("./")&&(R=R.slice(2)),R.startsWith("/")&&(R=R.slice(1)),R!==""&&!R.endsWith("/")&&(R=R+"/");const v=new URL(A+R,location.origin).toString();try{Promise.resolve().then(()=>Wt).then(y=>{try{y&&typeof y.setHomePage=="function"&&y.setHomePage(x)}catch(B){console.warn("[nimbi-cms] setHomePage failed",B)}}).catch(y=>{})}catch(y){console.warn("[nimbi-cms] setHomePage dynamic import failed",y)}p&&await dn(p,A),b&&Array.isArray(b)&&lr(b),f&&fn(f);const E=Da({contentWrap:le,navWrap:X,container:te,mountOverlay:H,t:lt,contentBase:v,homePage:x,initialDocumentTitle:qn,runHooks:on});if(typeof d=="number"&&d>=0&&typeof br=="function"&&br(d*60*1e3),typeof g=="number"&&g>=0&&typeof wr=="function"&&wr(g),w&&Array.isArray(w)&&w.length)try{w.forEach(y=>{typeof y=="object"&&da&&typeof _n=="function"&&_n(y)})}catch(y){console.warn("[nimbi-cms] applying markdownExtensions failed",y)}try{typeof i=="number"&&Promise.resolve().then(()=>Wt).then(({setDefaultCrawlMaxQueue:y})=>{try{y(i)}catch(B){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed",B)}})}catch(y){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed",y)}try{Ut(v)}catch(y){console.warn("[nimbi-cms] setContentBase failed",y)}try{bn($)}catch(y){console.warn("[nimbi-cms] setNotFoundPage failed",y)}try{Ut(v)}catch(y){console.warn("[nimbi-cms] setContentBase failed",y)}try{bn($)}catch(y){console.warn("[nimbi-cms] setNotFoundPage failed",y)}try{await Se(x,v)}catch(y){throw x==="_home.md"?new Error("Required _home.md not found"):new Error(`Required ${x} not found at ${v}${x}: ${y.message}`)}er(c),await Jn(h,A);try{const y=document.createElement("header");y.className="nimbi-site-navbar",I.insertBefore(y,ee);const B=await Se("_navigation.md",v),K=await Vt(B.raw||""),{navbar:ne,linkEls:ve}=await La(y,te,K.html||"",v,x,lt,E.renderByQuery,j,l,o,u,M);try{await on("onNavBuild",{navWrap:X,navbar:ne,linkEls:ve,contentBase:v})}catch(ae){console.warn("[nimbi-cms] onNavBuild hooks failed",ae)}try{const ae=()=>{const de=y&&y.getBoundingClientRect&&Math.round(y.getBoundingClientRect().height)||y&&y.offsetHeight||0;if(de>0){try{I.style.setProperty("--nimbi-site-navbar-height",`${de}px`)}catch(be){console.warn("[nimbi-cms] set CSS var failed",be)}try{te.style.paddingTop=""}catch(be){console.warn("[nimbi-cms] set container paddingTop failed",be)}try{const be=I&&I.getBoundingClientRect&&Math.round(I.getBoundingClientRect().height)||I&&I.clientHeight||0;if(be>0){const Ye=Math.max(0,be-de);try{te.style.setProperty("--nimbi-cms-height",`${Ye}px`)}catch(Fe){console.warn("[nimbi-cms] set --nimbi-cms-height failed",Fe)}}else try{te.style.setProperty("--nimbi-cms-height","calc(100vh - var(--nimbi-site-navbar-height))")}catch(Ye){console.warn("[nimbi-cms] set --nimbi-cms-height failed",Ye)}}catch(be){console.warn("[nimbi-cms] compute container height failed",be)}try{y.style.setProperty("--nimbi-site-navbar-height",`${de}px`)}catch(be){console.warn("[nimbi-cms] set navbar CSS var failed",be)}}};ae();try{if(typeof ResizeObserver<"u"){const de=new ResizeObserver(()=>ae());try{de.observe(y)}catch(be){console.warn("[nimbi-cms] ResizeObserver.observe failed",be)}}}catch(de){console.warn("[nimbi-cms] ResizeObserver setup failed",de)}}catch(ae){console.warn("[nimbi-cms] compute navbar height failed",ae)}}catch(y){console.warn("[nimbi-cms] build navigation failed",y)}await E.renderByQuery();try{Promise.resolve().then(()=>ja).then(({getVersion:y})=>{typeof y=="function"&&y().then(B=>{try{const K=B||"0.0.0";try{const ne=ve=>{const ae=document.createElement("a");ae.className="nimbi-version-label tag is-small",ae.textContent=`Ninbi CMS v. ${K}`,ae.href=ve||"#",ae.target="_blank",ae.rel="noopener noreferrer nofollow",ae.setAttribute("aria-label",`Ninbi CMS version ${K}`);try{tr(ae)}catch{}try{I.appendChild(ae)}catch(de){console.warn("[nimbi-cms] append version label failed",de)}};(async()=>{try{const ve=await Promise.resolve().then(()=>ki).catch(()=>null),ae=ve&&(ve.default||ve);let de=null;ae&&(ae.homepage&&typeof ae.homepage=="string"?de=ae.homepage:ae.repository&&(typeof ae.repository=="string"?de=ae.repository:ae.repository.url&&typeof ae.repository.url=="string"&&(de=ae.repository.url)));try{de&&new URL(de)}catch{de=null}ne(de||"#")}catch{ne("#")}})()}catch(ne){console.warn("[nimbi-cms] building version label failed",ne)}}catch(K){console.warn("[nimbi-cms] building version label failed",K)}}).catch(B=>{console.warn("[nimbi-cms] getVersion() failed",B)})}).catch(y=>{console.warn("[nimbi-cms] import version module failed",y)})}catch(y){console.warn("[nimbi-cms] version label setup failed",y)}}async function Jr(){try{let t=null;try{t=await Promise.resolve().then(()=>ki)}catch{try{if(typeof fetch=="function"&&typeof location<"u"){const s=new URL("../package.json",location.href).toString(),r=await fetch(s);r&&r.ok?t={default:await r.json()}:t=null}else t=null}catch{t=null}}const e=t?.default?.version||t?.version;return typeof e=="string"&&e.trim()?e:"0.0.0"}catch{return"0.0.0"}}const ja=Object.freeze(Object.defineProperty({__proto__:null,getVersion:Jr},Symbol.toStringTag,{value:"Module"})),ei="nimbi-cms",ti="0.1.0",ni={type:"git",url:"git+https://github.com/AbelVM/nimbiCMS.git"},ri="https://abelvm.github.io/nimbiCMS/",ii="Lightweight CMS client for static sites with Bulma UI and search/indexing features",si=["cms","static","bulma","search","markdown","nimbi"],ai="Abel Vázquez Montoro",oi="MIT",li={url:"https://github.com/AbelVM/nimbiCMS/issues"},ci={node:">=16"},ui="module",hi={dev:"vite","dev:example":'sh -c "npm run build -- --outDir example/dist --config vite.config.js && vite example --port 5173 &"',build:"vite build --config vite.config.js","build:lib":"vite build --config vite.config.js","build:analyze":"ANALYZE=1 vite build --config vite.config.js",preview:"vite preview",test:"npx vitest run","gen-dts":"node scripts/gen-dts.js",prepare:"npm run build:lib && npm run gen-dts","check-dts":"npx tsc --noEmit src/index.d.ts --lib es2015,dom --skipLibCheck","type-test":"npx tsd",docs:"typedoc --options typedoc.json"},di={bulma:"^1.0.4","highlight.js":"^11.11.1",marked:"^17.0.4"},fi={"@vitest/coverage-v8":"^4.0.18","comment-parser":"^0.7.6",eslint:"^10.0.3","eslint-plugin-unused-imports":"^4.4.1",glob:"^10.4.1",jsdom:"^28.1.0","reading-time":"^1.5.0",terser:"^5.17.0",typedoc:"^0.28.17","typedoc-plugin-markdown":"^4.10.0",typescript:"^5.9.3",tsd:"^0.33.0",vite:"^7.3.1","rollup-plugin-visualizer":"^5.8.0","vite-plugin-restart":"^2.0.0",vitest:"^4.0.18"},pi="dist/nimbi-cms.cjs.js",gi="dist/nimbi-cms.es.js",mi="src/index.d.ts",wi="dist/nimbi-cms.js",bi=["dist","src/index.d.ts"],yi={access:"public"},ki=Object.freeze(Object.defineProperty({__proto__:null,author:ai,bugs:li,default:{name:ei,version:ti,repository:ni,homepage:ri,private:!0,description:ii,keywords:si,author:ai,license:oi,bugs:li,engines:ci,type:ui,scripts:hi,dependencies:di,devDependencies:fi,main:pi,module:gi,types:mi,unpkg:wi,files:bi,publishConfig:yi},dependencies:di,description:ii,devDependencies:fi,engines:ci,files:bi,homepage:ri,keywords:si,license:oi,main:pi,module:gi,name:ei,publishConfig:yi,repository:ni,scripts:hi,type:ui,types:mi,unpkg:wi,version:ti},Symbol.toStringTag,{value:"Module"}));ue.BAD_LANGUAGES=cn,ue.SUPPORTED_HLJS_MAP=J,ue._clearHooks=Di,ue.addHook=It,ue.default=Vr,ue.ensureBulma=Jn,ue.getVersion=Jr,ue.initCMS=Vr,ue.loadL10nFile=dn,ue.loadSupportedLanguages=hn,ue.observeCodeBlocks=Vn,ue.onNavBuild=Oi,ue.onPageLoad=Ni,ue.registerLanguage=at,ue.runHooks=on,ue.setHighlightTheme=Wi,ue.setLang=fn,ue.setStyle=er,ue.setThemeVars=Gi,ue.t=lt,ue.transformHtml=qi,Object.defineProperties(ue,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})}));
