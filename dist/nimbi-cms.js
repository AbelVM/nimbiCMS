(function(we,Ke){typeof exports=="object"&&typeof module<"u"?Ke(exports):typeof define=="function"&&define.amd?define(["exports"],Ke):(we=typeof globalThis<"u"?globalThis:we||self,Ke(we.nimbiCMS={}))})(this,(function(we){"use strict";const Ke={onPageLoad:[],onNavBuild:[],transformHtml:[]};function Zt(e,t){if(!Object.prototype.hasOwnProperty.call(Ke,e))throw new Error('Unknown hook "'+e+'"');if(typeof t!="function")throw new TypeError("hook callback must be a function");Ke[e].push(t)}function Ii(e){Zt("onPageLoad",e)}function Bi(e){Zt("onNavBuild",e)}function Ni(e){Zt("transformHtml",e)}async function yn(e,t){const n=Ke[e]||[];for(const i of n)try{await i(t)}catch(r){console.warn("[nimbi-cms] runHooks callback failed",r)}}function Oi(){Object.keys(Ke).forEach(e=>{Ke[e].length=0})}function or(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var kn,lr;function qi(){if(lr)return kn;lr=1;function e(b){return b instanceof Map?b.clear=b.delete=b.set=function(){throw new Error("map is read-only")}:b instanceof Set&&(b.add=b.clear=b.delete=function(){throw new Error("set is read-only")}),Object.freeze(b),Object.getOwnPropertyNames(b).forEach(x=>{const M=b[x],ee=typeof M;(ee==="object"||ee==="function")&&!Object.isFrozen(M)&&e(M)}),b}class t{constructor(x){x.data===void 0&&(x.data={}),this.data=x.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function n(b){return b.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function i(b,...x){const M=Object.create(null);for(const ee in b)M[ee]=b[ee];return x.forEach(function(ee){for(const Se in ee)M[Se]=ee[Se]}),M}const r="</span>",a=b=>!!b.scope,s=(b,{prefix:x})=>{if(b.startsWith("language:"))return b.replace("language:","language-");if(b.includes(".")){const M=b.split(".");return[`${x}${M.shift()}`,...M.map((ee,Se)=>`${ee}${"_".repeat(Se+1)}`)].join(" ")}return`${x}${b}`};class c{constructor(x,M){this.buffer="",this.classPrefix=M.classPrefix,x.walk(this)}addText(x){this.buffer+=n(x)}openNode(x){if(!a(x))return;const M=s(x.scope,{prefix:this.classPrefix});this.span(M)}closeNode(x){a(x)&&(this.buffer+=r)}value(){return this.buffer}span(x){this.buffer+=`<span class="${x}">`}}const o=(b={})=>{const x={children:[]};return Object.assign(x,b),x};class l{constructor(){this.rootNode=o(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(x){this.top.children.push(x)}openNode(x){const M=o({scope:x});this.add(M),this.stack.push(M)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(x){return this.constructor._walk(x,this.rootNode)}static _walk(x,M){return typeof M=="string"?x.addText(M):M.children&&(x.openNode(M),M.children.forEach(ee=>this._walk(x,ee)),x.closeNode(M)),x}static _collapse(x){typeof x!="string"&&x.children&&(x.children.every(M=>typeof M=="string")?x.children=[x.children.join("")]:x.children.forEach(M=>{l._collapse(M)}))}}class u extends l{constructor(x){super(),this.options=x}addText(x){x!==""&&this.add(x)}startScope(x){this.openNode(x)}endScope(){this.closeNode()}__addSublanguage(x,M){const ee=x.root;M&&(ee.scope=`language:${M}`),this.add(ee)}toHTML(){return new c(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function p(b){return b?typeof b=="string"?b:b.source:null}function g(b){return f("(?=",b,")")}function h(b){return f("(?:",b,")*")}function d(b){return f("(?:",b,")?")}function f(...b){return b.map(M=>p(M)).join("")}function m(b){const x=b[b.length-1];return typeof x=="object"&&x.constructor===Object?(b.splice(b.length-1,1),x):{}}function w(...b){return"("+(m(b).capture?"":"?:")+b.map(ee=>p(ee)).join("|")+")"}function y(b){return new RegExp(b.toString()+"|").exec("").length-1}function k(b,x){const M=b&&b.exec(x);return M&&M.index===0}const E=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function C(b,{joinWith:x}){let M=0;return b.map(ee=>{M+=1;const Se=M;let ve=p(ee),O="";for(;ve.length>0;){const N=E.exec(ve);if(!N){O+=ve;break}O+=ve.substring(0,N.index),ve=ve.substring(N.index+N[0].length),N[0][0]==="\\"&&N[1]?O+="\\"+String(Number(N[1])+Se):(O+=N[0],N[0]==="("&&M++)}return O}).map(ee=>`(${ee})`).join(x)}const B=/\b\B/,H="[a-zA-Z]\\w*",R="[a-zA-Z_]\\w*",G="\\b\\d+(\\.\\d+)?",de="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",v="\\b(0b[01]+)",j="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",X=(b={})=>{const x=/^#![ ]*\//;return b.binary&&(b.begin=f(x,/.*\b/,b.binary,/\b.*/)),i({scope:"meta",begin:x,end:/$/,relevance:0,"on:begin":(M,ee)=>{M.index!==0&&ee.ignoreMatch()}},b)},D={begin:"\\\\[\\s\\S]",relevance:0},Q={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[D]},S={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[D]},fe={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},re=function(b,x,M={}){const ee=i({scope:"comment",begin:b,end:x,contains:[]},M);ee.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const Se=w("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return ee.contains.push({begin:f(/[ ]+/,"(",Se,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),ee},pe=re("//","$"),A=re("/\\*","\\*/"),L=re("#","$"),z={scope:"number",begin:G,relevance:0},I={scope:"number",begin:de,relevance:0},_={scope:"number",begin:v,relevance:0},$={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[D,{begin:/\[/,end:/\]/,relevance:0,contains:[D]}]},F={scope:"title",begin:H,relevance:0},he={scope:"title",begin:R,relevance:0},me={begin:"\\.\\s*"+R,relevance:0};var J=Object.freeze({__proto__:null,APOS_STRING_MODE:Q,BACKSLASH_ESCAPE:D,BINARY_NUMBER_MODE:_,BINARY_NUMBER_RE:v,COMMENT:re,C_BLOCK_COMMENT_MODE:A,C_LINE_COMMENT_MODE:pe,C_NUMBER_MODE:I,C_NUMBER_RE:de,END_SAME_AS_BEGIN:function(b){return Object.assign(b,{"on:begin":(x,M)=>{M.data._beginMatch=x[1]},"on:end":(x,M)=>{M.data._beginMatch!==x[1]&&M.ignoreMatch()}})},HASH_COMMENT_MODE:L,IDENT_RE:H,MATCH_NOTHING_RE:B,METHOD_GUARD:me,NUMBER_MODE:z,NUMBER_RE:G,PHRASAL_WORDS_MODE:fe,QUOTE_STRING_MODE:S,REGEXP_MODE:$,RE_STARTERS_RE:j,SHEBANG:X,TITLE_MODE:F,UNDERSCORE_IDENT_RE:R,UNDERSCORE_TITLE_MODE:he});function V(b,x){b.input[b.index-1]==="."&&x.ignoreMatch()}function ce(b,x){b.className!==void 0&&(b.scope=b.className,delete b.className)}function Ae(b,x){x&&b.beginKeywords&&(b.begin="\\b("+b.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",b.__beforeBegin=V,b.keywords=b.keywords||b.beginKeywords,delete b.beginKeywords,b.relevance===void 0&&(b.relevance=0))}function kt(b,x){Array.isArray(b.illegal)&&(b.illegal=w(...b.illegal))}function Yn(b,x){if(b.match){if(b.begin||b.end)throw new Error("begin & end are not supported with match");b.begin=b.match,delete b.match}}function ao(b,x){b.relevance===void 0&&(b.relevance=1)}const so=(b,x)=>{if(!b.beforeMatch)return;if(b.starts)throw new Error("beforeMatch cannot be used with starts");const M=Object.assign({},b);Object.keys(b).forEach(ee=>{delete b[ee]}),b.keywords=M.keywords,b.begin=f(M.beforeMatch,g(M.begin)),b.starts={relevance:0,contains:[Object.assign(M,{endsParent:!0})]},b.relevance=0,delete M.beforeMatch},oo=["of","and","for","in","not","or","if","then","parent","list","value"],lo="keyword";function yi(b,x,M=lo){const ee=Object.create(null);return typeof b=="string"?Se(M,b.split(" ")):Array.isArray(b)?Se(M,b):Object.keys(b).forEach(function(ve){Object.assign(ee,yi(b[ve],x,ve))}),ee;function Se(ve,O){x&&(O=O.map(N=>N.toLowerCase())),O.forEach(function(N){const K=N.split("|");ee[K[0]]=[ve,co(K[0],K[1])]})}}function co(b,x){return x?Number(x):uo(b)?0:1}function uo(b){return oo.includes(b.toLowerCase())}const ki={},ht=b=>{console.error(b)},_i=(b,...x)=>{console.log(`WARN: ${b}`,...x)},_t=(b,x)=>{ki[`${b}/${x}`]||(console.log(`Deprecated as of ${b}. ${x}`),ki[`${b}/${x}`]=!0)},pn=new Error;function xi(b,x,{key:M}){let ee=0;const Se=b[M],ve={},O={};for(let N=1;N<=x.length;N++)O[N+ee]=Se[N],ve[N+ee]=!0,ee+=y(x[N-1]);b[M]=O,b[M]._emit=ve,b[M]._multi=!0}function ho(b){if(Array.isArray(b.begin)){if(b.skip||b.excludeBegin||b.returnBegin)throw ht("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),pn;if(typeof b.beginScope!="object"||b.beginScope===null)throw ht("beginScope must be object"),pn;xi(b,b.begin,{key:"beginScope"}),b.begin=C(b.begin,{joinWith:""})}}function po(b){if(Array.isArray(b.end)){if(b.skip||b.excludeEnd||b.returnEnd)throw ht("skip, excludeEnd, returnEnd not compatible with endScope: {}"),pn;if(typeof b.endScope!="object"||b.endScope===null)throw ht("endScope must be object"),pn;xi(b,b.end,{key:"endScope"}),b.end=C(b.end,{joinWith:""})}}function fo(b){b.scope&&typeof b.scope=="object"&&b.scope!==null&&(b.beginScope=b.scope,delete b.scope)}function go(b){fo(b),typeof b.beginScope=="string"&&(b.beginScope={_wrap:b.beginScope}),typeof b.endScope=="string"&&(b.endScope={_wrap:b.endScope}),ho(b),po(b)}function mo(b){function x(O,N){return new RegExp(p(O),"m"+(b.case_insensitive?"i":"")+(b.unicodeRegex?"u":"")+(N?"g":""))}class M{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(N,K){K.position=this.position++,this.matchIndexes[this.matchAt]=K,this.regexes.push([K,N]),this.matchAt+=y(N)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const N=this.regexes.map(K=>K[1]);this.matcherRe=x(C(N,{joinWith:"|"}),!0),this.lastIndex=0}exec(N){this.matcherRe.lastIndex=this.lastIndex;const K=this.matcherRe.exec(N);if(!K)return null;const Me=K.findIndex((Ft,Jn)=>Jn>0&&Ft!==void 0),Ee=this.matchIndexes[Me];return K.splice(0,Me),Object.assign(K,Ee)}}class ee{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(N){if(this.multiRegexes[N])return this.multiRegexes[N];const K=new M;return this.rules.slice(N).forEach(([Me,Ee])=>K.addRule(Me,Ee)),K.compile(),this.multiRegexes[N]=K,K}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(N,K){this.rules.push([N,K]),K.type==="begin"&&this.count++}exec(N){const K=this.getMatcher(this.regexIndex);K.lastIndex=this.lastIndex;let Me=K.exec(N);if(this.resumingScanAtSamePosition()&&!(Me&&Me.index===this.lastIndex)){const Ee=this.getMatcher(0);Ee.lastIndex=this.lastIndex+1,Me=Ee.exec(N)}return Me&&(this.regexIndex+=Me.position+1,this.regexIndex===this.count&&this.considerAll()),Me}}function Se(O){const N=new ee;return O.contains.forEach(K=>N.addRule(K.begin,{rule:K,type:"begin"})),O.terminatorEnd&&N.addRule(O.terminatorEnd,{type:"end"}),O.illegal&&N.addRule(O.illegal,{type:"illegal"}),N}function ve(O,N){const K=O;if(O.isCompiled)return K;[ce,Yn,go,so].forEach(Ee=>Ee(O,N)),b.compilerExtensions.forEach(Ee=>Ee(O,N)),O.__beforeBegin=null,[Ae,kt,ao].forEach(Ee=>Ee(O,N)),O.isCompiled=!0;let Me=null;return typeof O.keywords=="object"&&O.keywords.$pattern&&(O.keywords=Object.assign({},O.keywords),Me=O.keywords.$pattern,delete O.keywords.$pattern),Me=Me||/\w+/,O.keywords&&(O.keywords=yi(O.keywords,b.case_insensitive)),K.keywordPatternRe=x(Me,!0),N&&(O.begin||(O.begin=/\B|\b/),K.beginRe=x(K.begin),!O.end&&!O.endsWithParent&&(O.end=/\B|\b/),O.end&&(K.endRe=x(K.end)),K.terminatorEnd=p(K.end)||"",O.endsWithParent&&N.terminatorEnd&&(K.terminatorEnd+=(O.end?"|":"")+N.terminatorEnd)),O.illegal&&(K.illegalRe=x(O.illegal)),O.contains||(O.contains=[]),O.contains=[].concat(...O.contains.map(function(Ee){return bo(Ee==="self"?O:Ee)})),O.contains.forEach(function(Ee){ve(Ee,K)}),O.starts&&ve(O.starts,N),K.matcher=Se(K),K}if(b.compilerExtensions||(b.compilerExtensions=[]),b.contains&&b.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return b.classNameAliases=i(b.classNameAliases||{}),ve(b)}function Si(b){return b?b.endsWithParent||Si(b.starts):!1}function bo(b){return b.variants&&!b.cachedVariants&&(b.cachedVariants=b.variants.map(function(x){return i(b,{variants:null},x)})),b.cachedVariants?b.cachedVariants:Si(b)?i(b,{starts:b.starts?i(b.starts):null}):Object.isFrozen(b)?i(b):b}var wo="11.11.1";class yo extends Error{constructor(x,M){super(x),this.name="HTMLInjectionError",this.html=M}}const Vn=n,vi=i,Ai=Symbol("nomatch"),ko=7,Ei=function(b){const x=Object.create(null),M=Object.create(null),ee=[];let Se=!0;const ve="Could not find the language '{}', did you forget to load/include a language module?",O={disableAutodetect:!0,name:"Plain text",contains:[]};let N={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:u};function K(T){return N.noHighlightRe.test(T)}function Me(T){let U=T.className+" ";U+=T.parentNode?T.parentNode.className:"";const oe=N.languageDetectRe.exec(U);if(oe){const ye=it(oe[1]);return ye||(_i(ve.replace("{}",oe[1])),_i("Falling back to no-highlight mode for this block.",T)),ye?oe[1]:"no-highlight"}return U.split(/\s+/).find(ye=>K(ye)||it(ye))}function Ee(T,U,oe){let ye="",Te="";typeof U=="object"?(ye=T,oe=U.ignoreIllegals,Te=U.language):(_t("10.7.0","highlight(lang, code, ...args) has been deprecated."),_t("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),Te=T,ye=U),oe===void 0&&(oe=!0);const Ue={code:ye,language:Te};gn("before:highlight",Ue);const at=Ue.result?Ue.result:Ft(Ue.language,Ue.code,oe);return at.code=Ue.code,gn("after:highlight",at),at}function Ft(T,U,oe,ye){const Te=Object.create(null);function Ue(P,q){return P.keywords[q]}function at(){if(!te.keywords){Re.addText(ke);return}let P=0;te.keywordPatternRe.lastIndex=0;let q=te.keywordPatternRe.exec(ke),ie="";for(;q;){ie+=ke.substring(P,q.index);const be=Xe.case_insensitive?q[0].toLowerCase():q[0],Pe=Ue(te,be);if(Pe){const[Je,No]=Pe;if(Re.addText(ie),ie="",Te[be]=(Te[be]||0)+1,Te[be]<=ko&&(wn+=No),Je.startsWith("_"))ie+=q[0];else{const Oo=Xe.classNameAliases[Je]||Je;Qe(q[0],Oo)}}else ie+=q[0];P=te.keywordPatternRe.lastIndex,q=te.keywordPatternRe.exec(ke)}ie+=ke.substring(P),Re.addText(ie)}function mn(){if(ke==="")return;let P=null;if(typeof te.subLanguage=="string"){if(!x[te.subLanguage]){Re.addText(ke);return}P=Ft(te.subLanguage,ke,!0,Pi[te.subLanguage]),Pi[te.subLanguage]=P._top}else P=er(ke,te.subLanguage.length?te.subLanguage:null);te.relevance>0&&(wn+=P.relevance),Re.__addSublanguage(P._emitter,P.language)}function qe(){te.subLanguage!=null?mn():at(),ke=""}function Qe(P,q){P!==""&&(Re.startScope(q),Re.addText(P),Re.endScope())}function Mi(P,q){let ie=1;const be=q.length-1;for(;ie<=be;){if(!P._emit[ie]){ie++;continue}const Pe=Xe.classNameAliases[P[ie]]||P[ie],Je=q[ie];Pe?Qe(Je,Pe):(ke=Je,at(),ke=""),ie++}}function Ri(P,q){return P.scope&&typeof P.scope=="string"&&Re.openNode(Xe.classNameAliases[P.scope]||P.scope),P.beginScope&&(P.beginScope._wrap?(Qe(ke,Xe.classNameAliases[P.beginScope._wrap]||P.beginScope._wrap),ke=""):P.beginScope._multi&&(Mi(P.beginScope,q),ke="")),te=Object.create(P,{parent:{value:te}}),te}function zi(P,q,ie){let be=k(P.endRe,ie);if(be){if(P["on:end"]){const Pe=new t(P);P["on:end"](q,Pe),Pe.isMatchIgnored&&(be=!1)}if(be){for(;P.endsParent&&P.parent;)P=P.parent;return P}}if(P.endsWithParent)return zi(P.parent,q,ie)}function zo(P){return te.matcher.regexIndex===0?(ke+=P[0],1):(ir=!0,0)}function $o(P){const q=P[0],ie=P.rule,be=new t(ie),Pe=[ie.__beforeBegin,ie["on:begin"]];for(const Je of Pe)if(Je&&(Je(P,be),be.isMatchIgnored))return zo(q);return ie.skip?ke+=q:(ie.excludeBegin&&(ke+=q),qe(),!ie.returnBegin&&!ie.excludeBegin&&(ke=q)),Ri(ie,P),ie.returnBegin?0:q.length}function Po(P){const q=P[0],ie=U.substring(P.index),be=zi(te,P,ie);if(!be)return Ai;const Pe=te;te.endScope&&te.endScope._wrap?(qe(),Qe(q,te.endScope._wrap)):te.endScope&&te.endScope._multi?(qe(),Mi(te.endScope,P)):Pe.skip?ke+=q:(Pe.returnEnd||Pe.excludeEnd||(ke+=q),qe(),Pe.excludeEnd&&(ke=q));do te.scope&&Re.closeNode(),!te.skip&&!te.subLanguage&&(wn+=te.relevance),te=te.parent;while(te!==be.parent);return be.starts&&Ri(be.starts,P),Pe.returnEnd?0:q.length}function Io(){const P=[];for(let q=te;q!==Xe;q=q.parent)q.scope&&P.unshift(q.scope);P.forEach(q=>Re.openNode(q))}let bn={};function $i(P,q){const ie=q&&q[0];if(ke+=P,ie==null)return qe(),0;if(bn.type==="begin"&&q.type==="end"&&bn.index===q.index&&ie===""){if(ke+=U.slice(q.index,q.index+1),!Se){const be=new Error(`0 width match regex (${T})`);throw be.languageName=T,be.badRule=bn.rule,be}return 1}if(bn=q,q.type==="begin")return $o(q);if(q.type==="illegal"&&!oe){const be=new Error('Illegal lexeme "'+ie+'" for mode "'+(te.scope||"<unnamed>")+'"');throw be.mode=te,be}else if(q.type==="end"){const be=Po(q);if(be!==Ai)return be}if(q.type==="illegal"&&ie==="")return ke+=`
`,1;if(rr>1e5&&rr>q.index*3)throw new Error("potential infinite loop, way more iterations than matches");return ke+=ie,ie.length}const Xe=it(T);if(!Xe)throw ht(ve.replace("{}",T)),new Error('Unknown language: "'+T+'"');const Bo=mo(Xe);let nr="",te=ye||Bo;const Pi={},Re=new N.__emitter(N);Io();let ke="",wn=0,dt=0,rr=0,ir=!1;try{if(Xe.__emitTokens)Xe.__emitTokens(U,Re);else{for(te.matcher.considerAll();;){rr++,ir?ir=!1:te.matcher.considerAll(),te.matcher.lastIndex=dt;const P=te.matcher.exec(U);if(!P)break;const q=U.substring(dt,P.index),ie=$i(q,P);dt=P.index+ie}$i(U.substring(dt))}return Re.finalize(),nr=Re.toHTML(),{language:T,value:nr,relevance:wn,illegal:!1,_emitter:Re,_top:te}}catch(P){if(P.message&&P.message.includes("Illegal"))return{language:T,value:Vn(U),illegal:!0,relevance:0,_illegalBy:{message:P.message,index:dt,context:U.slice(dt-100,dt+100),mode:P.mode,resultSoFar:nr},_emitter:Re};if(Se)return{language:T,value:Vn(U),illegal:!1,relevance:0,errorRaised:P,_emitter:Re,_top:te};throw P}}function Jn(T){const U={value:Vn(T),illegal:!1,relevance:0,_top:O,_emitter:new N.__emitter(N)};return U._emitter.addText(T),U}function er(T,U){U=U||N.languages||Object.keys(x);const oe=Jn(T),ye=U.filter(it).filter(Ci).map(qe=>Ft(qe,T,!1));ye.unshift(oe);const Te=ye.sort((qe,Qe)=>{if(qe.relevance!==Qe.relevance)return Qe.relevance-qe.relevance;if(qe.language&&Qe.language){if(it(qe.language).supersetOf===Qe.language)return 1;if(it(Qe.language).supersetOf===qe.language)return-1}return 0}),[Ue,at]=Te,mn=Ue;return mn.secondBest=at,mn}function _o(T,U,oe){const ye=U&&M[U]||oe;T.classList.add("hljs"),T.classList.add(`language-${ye}`)}function tr(T){let U=null;const oe=Me(T);if(K(oe))return;if(gn("before:highlightElement",{el:T,language:oe}),T.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",T);return}if(T.children.length>0&&(N.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(T)),N.throwUnescapedHTML))throw new yo("One of your code blocks includes unescaped HTML.",T.innerHTML);U=T;const ye=U.textContent,Te=oe?Ee(ye,{language:oe,ignoreIllegals:!0}):er(ye);T.innerHTML=Te.value,T.dataset.highlighted="yes",_o(T,oe,Te.language),T.result={language:Te.language,re:Te.relevance,relevance:Te.relevance},Te.secondBest&&(T.secondBest={language:Te.secondBest.language,relevance:Te.secondBest.relevance}),gn("after:highlightElement",{el:T,result:Te,text:ye})}function xo(T){N=vi(N,T)}const So=()=>{fn(),_t("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function vo(){fn(),_t("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let Li=!1;function fn(){function T(){fn()}if(document.readyState==="loading"){Li||window.addEventListener("DOMContentLoaded",T,!1),Li=!0;return}document.querySelectorAll(N.cssSelector).forEach(tr)}function Ao(T,U){let oe=null;try{oe=U(b)}catch(ye){if(ht("Language definition for '{}' could not be registered.".replace("{}",T)),Se)ht(ye);else throw ye;oe=O}oe.name||(oe.name=T),x[T]=oe,oe.rawDefinition=U.bind(null,b),oe.aliases&&Ti(oe.aliases,{languageName:T})}function Eo(T){delete x[T];for(const U of Object.keys(M))M[U]===T&&delete M[U]}function Lo(){return Object.keys(x)}function it(T){return T=(T||"").toLowerCase(),x[T]||x[M[T]]}function Ti(T,{languageName:U}){typeof T=="string"&&(T=[T]),T.forEach(oe=>{M[oe.toLowerCase()]=U})}function Ci(T){const U=it(T);return U&&!U.disableAutodetect}function To(T){T["before:highlightBlock"]&&!T["before:highlightElement"]&&(T["before:highlightElement"]=U=>{T["before:highlightBlock"](Object.assign({block:U.el},U))}),T["after:highlightBlock"]&&!T["after:highlightElement"]&&(T["after:highlightElement"]=U=>{T["after:highlightBlock"](Object.assign({block:U.el},U))})}function Co(T){To(T),ee.push(T)}function Mo(T){const U=ee.indexOf(T);U!==-1&&ee.splice(U,1)}function gn(T,U){const oe=T;ee.forEach(function(ye){ye[oe]&&ye[oe](U)})}function Ro(T){return _t("10.7.0","highlightBlock will be removed entirely in v12.0"),_t("10.7.0","Please use highlightElement now."),tr(T)}Object.assign(b,{highlight:Ee,highlightAuto:er,highlightAll:fn,highlightElement:tr,highlightBlock:Ro,configure:xo,initHighlighting:So,initHighlightingOnLoad:vo,registerLanguage:Ao,unregisterLanguage:Eo,listLanguages:Lo,getLanguage:it,registerAliases:Ti,autoDetection:Ci,inherit:vi,addPlugin:Co,removePlugin:Mo}),b.debugMode=function(){Se=!1},b.safeMode=function(){Se=!0},b.versionString=wo,b.regex={concat:f,lookahead:g,either:w,optional:d,anyNumberOfTimes:h};for(const T in J)typeof J[T]=="object"&&e(J[T]);return Object.assign(b,J),b},xt=Ei({});return xt.newInstance=()=>Ei({}),kn=xt,xt.HighlightJS=xt,xt.default=xt,kn}var Di=qi();const ue=or(Di),Hi="11.11.1",ae=new Map,ji="https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md",Ne={shell:"bash",sh:"bash",zsh:"bash",js:"javascript",ts:"typescript",py:"python",csharp:"cs","c#":"cs"};Ne.html="xml",Ne.xhtml="xml",Ne.markup="xml";const _n=new Set(["magic","undefined"]);let et=null;const xn=new Map,Ui=300*1e3;async function Sn(e=ji){if(e)return et||(et=(async()=>{try{const t=await fetch(e);if(!t.ok)return;const i=(await t.text()).split(/\r?\n/);let r=-1;for(let l=0;l<i.length;l++)if(/\|\s*Language\s*\|/i.test(i[l])){r=l;break}if(r===-1)return;const a=i[r].replace(/^\||\|$/g,"").split("|").map(l=>l.trim().toLowerCase());let s=a.findIndex(l=>/alias|aliases|equivalent|alt|alternates?/i.test(l));s===-1&&(s=1);let c=a.findIndex(l=>/file|filename|module|module name|module-name|short|slug/i.test(l));if(c===-1){const l=a.findIndex(u=>/language/i.test(u));c=l!==-1?l:0}let o=[];for(let l=r+1;l<i.length;l++){const u=i[l].trim();if(!u||!u.startsWith("|"))break;const p=u.replace(/^\||\|$/g,"").split("|").map(m=>m.trim());if(p.every(m=>/^-+$/.test(m)))continue;const g=p;if(!g.length)continue;const d=(g[c]||g[0]||"").toString().trim().toLowerCase();if(!d||/^-+$/.test(d))continue;ae.set(d,d);const f=g[s]||"";if(f){const m=String(f).split(",").map(w=>w.replace(/`/g,"").trim()).filter(Boolean);if(m.length){const y=m[0].toLowerCase().replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");y&&/[a-z0-9]/i.test(y)&&(ae.set(y,y),o.push(y))}}}try{const l=[];for(const u of o){const p=String(u||"").replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");p&&/[a-z0-9]/i.test(p)?l.push(p):ae.delete(u)}o=l}catch(l){console.warn("[codeblocksManager] cleanup aliases failed",l)}try{let l=0;for(const u of Array.from(ae.keys())){if(!u||/^-+$/.test(u)||!/[a-z0-9]/i.test(u)){ae.delete(u),l++;continue}if(/^[:]+/.test(u)){const p=u.replace(/^[:]+/,"");if(p&&/[a-z0-9]/i.test(p)){const g=ae.get(u);ae.delete(u),ae.set(p,g)}else ae.delete(u),l++}}for(const[u,p]of Array.from(ae.entries()))(!p||/^-+$/.test(p)||!/[a-z0-9]/i.test(p))&&(ae.delete(u),l++);try{const u=":---------------------";ae.has(u)&&(ae.delete(u),l++)}catch(u){console.warn("[codeblocksManager] remove sep key failed",u)}try{const u=Array.from(ae.keys()).sort()}catch(u){console.warn("[codeblocksManager] compute supported keys failed",u)}}catch(l){console.warn("[codeblocksManager] ignored error",l)}}catch(t){console.warn("[codeblocksManager] loadSupportedLanguages failed",t)}})(),et)}const St=new Set;async function pt(e,t){if(et||(async()=>{try{await Sn()}catch(r){console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed",r)}})(),et)try{await et}catch{}if(e=e==null?"":String(e),e=e.trim(),!e)return!1;const n=e.toLowerCase();if(_n.has(n))return!1;if(ae.size&&!ae.has(n)){const r=Ne;if(!r[n]&&!r[e])return!1}if(St.has(e))return!0;const i=Ne;try{const r=(t||e||"").toString().replace(/\.js$/i,"").trim(),a=(i[e]||e||"").toString(),s=(i[r]||r||"").toString();let c=Array.from(new Set([a,s,r,e,i[r],i[e]].filter(Boolean))).map(u=>String(u).toLowerCase()).filter(u=>u&&u!=="undefined");ae.size&&(c=c.filter(u=>{if(ae.has(u))return!0;const p=Ne[u];return!!(p&&ae.has(p))}));let o=null,l=null;for(const u of c)try{const p=Date.now();let g=xn.get(u);if(g&&g.ok===!1&&p-(g.ts||0)>=Ui&&(xn.delete(u),g=void 0),g){if(g.module)o=g.module;else if(g.promise)try{o=await g.promise}catch{o=null}}else{const h={promise:null,module:null,ok:null,ts:0};xn.set(u,h),h.promise=(async()=>{try{try{try{return await import(`highlight.js/lib/languages/${u}.js`)}catch{return await import(`highlight.js/lib/languages/${u}`)}}catch{try{const f=`https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${u}.js`;return await new Function("u","return import(u)")(f)}catch{try{const m=`https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${u}.js`;return await new Function("u","return import(u)")(m)}catch{return null}}}}catch{return null}})();try{o=await h.promise,h.module=o,h.ok=!!o,h.ts=Date.now()}catch{h.module=null,h.ok=!1,h.ts=Date.now(),o=null}}if(o){const h=o.default||o;try{const d=ae.size&&ae.get(e)||u||e;return ue.registerLanguage(d,h),St.add(d),d!==e&&(ue.registerLanguage(e,h),St.add(e)),!0}catch(d){l=d}}else try{if(ae.has(u)||ae.has(e)){const h=()=>({});try{ue.registerLanguage(u,h),St.add(u)}catch{}try{u!==e&&(ue.registerLanguage(e,h),St.add(e))}catch{}return!0}}catch{}}catch(p){l=p}if(l)throw l;return!1}catch{return!1}}let Gt=null;function cr(e=document){et||(async()=>{try{await Sn()}catch(a){console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed",a)}})();const t=Ne,i=Gt||(typeof IntersectionObserver>"u"?null:(Gt=new IntersectionObserver((a,s)=>{a.forEach(c=>{if(!c.isIntersecting)return;const o=c.target;try{s.unobserve(o)}catch(l){console.warn("[codeblocksManager] observer unobserve failed",l)}(async()=>{try{const l=o.getAttribute&&o.getAttribute("class")||o.className||"",u=l.match(/language-([a-zA-Z0-9_+-]+)/)||l.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(u&&u[1]){const p=(u[1]||"").toLowerCase(),g=t[p]||p,h=ae.size&&(ae.get(g)||ae.get(String(g).toLowerCase()))||g;try{await pt(h)}catch(d){console.warn("[codeblocksManager] registerLanguage failed",d)}try{try{const d=o.textContent||o.innerText||"";d!=null&&(o.textContent=d)}catch{}try{o&&o.dataset&&o.dataset.highlighted&&delete o.dataset.highlighted}catch{}ue.highlightElement(o)}catch(d){console.warn("[codeblocksManager] hljs.highlightElement failed",d)}}else try{const p=o.textContent||"";try{if(ue&&typeof ue.getLanguage=="function"&&ue.getLanguage("plaintext")){const g=ue.highlight(p,{language:"plaintext"});g&&g.value&&(o.innerHTML=g.value)}}catch{try{ue.highlightElement(o)}catch(h){console.warn("[codeblocksManager] fallback highlightElement failed",h)}}}catch(p){console.warn("[codeblocksManager] auto-detect plaintext failed",p)}}catch(l){console.warn("[codeblocksManager] observer entry processing failed",l)}})()})},{root:null,rootMargin:"300px",threshold:.1}),Gt)),r=e&&e.querySelectorAll?e.querySelectorAll("pre code"):[];if(!i){r.forEach(async a=>{try{const s=a.getAttribute&&a.getAttribute("class")||a.className||"",c=s.match(/language-([a-zA-Z0-9_+-]+)/)||s.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(c&&c[1]){const o=(c[1]||"").toLowerCase(),l=t[o]||o,u=ae.size&&(ae.get(l)||ae.get(String(l).toLowerCase()))||l;try{await pt(u)}catch(p){console.warn("[codeblocksManager] registerLanguage failed (no observer)",p)}}try{try{const o=a.textContent||a.innerText||"";o!=null&&(a.textContent=o)}catch{}try{a&&a.dataset&&a.dataset.highlighted&&delete a.dataset.highlighted}catch{}ue.highlightElement(a)}catch(o){console.warn("[codeblocksManager] hljs.highlightElement failed (no observer)",o)}}catch(s){console.warn("[codeblocksManager] loadSupportedLanguages fallback ignored error",s)}});return}r.forEach(a=>{try{i.observe(a)}catch(s){console.warn("[codeblocksManager] observe failed",s)}})}function Wi(e,{useCdn:t=!0}={}){const n=document.querySelector("link[data-hl-theme]"),i=n&&n.getAttribute?n.getAttribute("data-hl-theme"):null,r=e==null?"default":String(e),a=r&&String(r).toLowerCase()||"";if(a==="default"||a==="monokai"){try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}return}if(i&&i.toLowerCase()===a)return;if(!t){console.warn("Requested highlight theme not bundled; set useCdn=true to load theme from CDN");return}const s=a,c=`https://cdn.jsdelivr.net/npm/highlight.js@${Hi}/styles/${s}.css`,o=document.createElement("link");o.rel="stylesheet",o.href=c,o.setAttribute("data-hl-theme",s),o.addEventListener("load",()=>{try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}}),document.head.appendChild(o)}let st="light";function Fi(e,t={}){if(document.querySelector(`link[href="${e}"]`))return;const n=document.createElement("link");if(n.rel="stylesheet",n.href=e,Object.entries(t).forEach(([i,r])=>n.setAttribute(i,r)),document.head.appendChild(n),t["data-bulmaswatch-theme"])try{if(n.getAttribute("data-bulmaswatch-observer"))return;let i=Number(n.getAttribute("data-bulmaswatch-move-count")||0),r=!1;const a=new MutationObserver(()=>{try{if(r)return;const c=n.parentNode;if(!c||c.lastElementChild===n)return;if(i>=1e3){n.setAttribute("data-bulmaswatch-move-stopped","1");return}r=!0;try{c.appendChild(n)}catch{}i+=1,n.setAttribute("data-bulmaswatch-move-count",String(i)),r=!1}catch{}});try{a.observe(document.head,{childList:!0}),n.setAttribute("data-bulmaswatch-observer","1"),n.setAttribute("data-bulmaswatch-move-count",String(i))}catch{}const s=document.head;s&&s.lastElementChild!==n&&s.appendChild(n)}catch{}}function ur(){try{const e=Array.from(document.querySelectorAll("link[data-bulmaswatch-theme]"));for(const t of e)t&&t.parentNode&&t.parentNode.removeChild(t)}catch{}try{const e=Array.from(document.querySelectorAll("style[data-bulma-override]"));for(const t of e)t&&t.parentNode&&t.parentNode.removeChild(t)}catch{}}async function hr(e="none",t="/"){if(typeof window<"u"&&window.__nimbiCMSDebug)try{console.debug("[bulmaManager] ensureBulma called",{bulmaCustomize:e,pageDir:t})}catch{}if(!e)return;if(e==="none"){try{const a=[location&&location.protocol&&location.protocol==="file:"?"https://unpkg.com/bulma/css/bulma.min.css":"//unpkg.com/bulma/css/bulma.min.css","https://unpkg.com/bulma/css/bulma.min.css"];let s=!1;for(const c of a)try{if(document.querySelector(`link[href="${c}"]`)){s=!0;break}}catch{}if(!s){const c=a[0],o=document.createElement("link");o.rel="stylesheet",o.href=c,o.setAttribute("data-bulma-base","1");const l=document.querySelector('link[href*="/dist/nimbi-cms.css"], link[href*="dist/nimbi-cms.css"]');l&&l.parentNode?l.parentNode.insertBefore(o,l):document.head.appendChild(o)}}catch{}try{const a=Array.from(document.querySelectorAll("link[data-bulmaswatch-theme]"));for(const s of a)s&&s.parentNode&&s.parentNode.removeChild(s)}catch{}try{const a=Array.from(document.querySelectorAll("style[data-bulma-override]"));for(const s of a)s&&s.parentNode&&s.parentNode.removeChild(s)}catch{}return}const i=[t+"bulma.css","/bulma.css"],r=Array.from(new Set(i));if(e==="local"){if(ur(),document.querySelector("style[data-bulma-override]"))return;for(const a of r)try{const s=await fetch(a,{method:"GET"});if(s.ok){const c=await s.text(),o=document.createElement("style");o.setAttribute("data-bulma-override",a),o.appendChild(document.createTextNode(`
/* bulma override: ${a} */
`+c)),document.head.appendChild(o);return}}catch(s){console.warn("[bulmaManager] fetch local bulma candidate failed",s)}return}try{const a=String(e).trim();if(!a)return;ur();const s=`https://unpkg.com/bulmaswatch/${encodeURIComponent(a)}/bulmaswatch.min.css`;Fi(s,{"data-bulmaswatch-theme":a})}catch(a){console.warn("[bulmaManager] ensureBulma failed",a)}}function dr(e){st=e==="dark"?"dark":e==="system"?"system":"light";try{const t=Array.from(document.querySelectorAll(".nimbi-mount"));if(t.length>0)for(const n of t)st==="dark"?n.setAttribute("data-theme","dark"):st==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme");else{const n=document.documentElement;st==="dark"?n.setAttribute("data-theme","dark"):st==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme")}}catch{}}function Zi(e){const t=document.documentElement;for(const[n,i]of Object.entries(e||{}))try{t.style.setProperty(`--${n}`,i)}catch(r){console.warn("[bulmaManager] setThemeVars failed for",n,r)}}function pr(e){if(!e||!(e instanceof HTMLElement))return()=>{};const t=e.closest&&e.closest(".nimbi-mount")||null;try{t&&(st==="dark"?t.setAttribute("data-theme","dark"):st==="light"?t.setAttribute("data-theme","light"):t.removeAttribute("data-theme"))}catch{}return()=>{}}const fr={en:{navigation:"Navigation",onThisPage:"On this page",home:"Home",scrollToTop:"Scroll to top",readingTime:"{minutes} min read",searchPlaceholder:"Search…",imagePreviewTitle:"Image preview",imagePreviewFit:"Fit to screen",imagePreviewOriginal:"Original size",imagePreviewZoomOut:"Zoom out",imagePreviewZoomIn:"Zoom in",imagePreviewClose:"Close"},es:{navigation:"Navegación",onThisPage:"En esta página",home:"Inicio",scrollToTop:"Ir arriba",readingTime:"{minutes} min de lectura",searchPlaceholder:"Buscar…",imagePreviewTitle:"Previsualización de imagen",imagePreviewFit:"Ajustar a la pantalla",imagePreviewOriginal:"Tamaño original",imagePreviewZoomOut:"Alejar",imagePreviewZoomIn:"Acercar",imagePreviewClose:"Cerrar"},de:{navigation:"Navigation",onThisPage:"Auf dieser Seite",home:"Startseite",scrollToTop:"Nach oben",readingTime:"{minutes} min Lesezeit",searchPlaceholder:"Suchen…",imagePreviewTitle:"Bildvorschau",imagePreviewFit:"An Bildschirm anpassen",imagePreviewOriginal:"Originalgröße",imagePreviewZoomOut:"Verkleinern",imagePreviewZoomIn:"Vergrößern",imagePreviewClose:"Schließen"},fr:{navigation:"Navigation",onThisPage:"Sur cette page",home:"Accueil",scrollToTop:"Aller en haut",readingTime:"{minutes} min de lecture",searchPlaceholder:"Rechercher…",imagePreviewTitle:"Aperçu de l’image",imagePreviewFit:"Ajuster à l’écran",imagePreviewOriginal:"Taille originale",imagePreviewZoomOut:"Dézoomer",imagePreviewZoomIn:"Zoomer",imagePreviewClose:"Fermer"},pt:{navigation:"Navegação",onThisPage:"Nesta página",home:"Início",scrollToTop:"Ir para o topo",readingTime:"{minutes} min de leitura",searchPlaceholder:"Procurar…",imagePreviewTitle:"Visualização da imagem",imagePreviewFit:"Ajustar à tela",imagePreviewOriginal:"Tamanho original",imagePreviewZoomOut:"Diminuir",imagePreviewZoomIn:"Aumentar",imagePreviewClose:"Fechar"}},ft=JSON.parse(JSON.stringify(fr));let Qt="en";if(typeof navigator<"u"){const e=navigator.language||navigator.languages&&navigator.languages[0]||"en";Qt=String(e).split("-")[0].toLowerCase()}fr[Qt]||(Qt="en");let tt=Qt;function gt(e,t={}){const n=ft[tt]||ft.en;let i=n&&n[e]?n[e]:ft.en[e]||"";for(const r of Object.keys(t))i=i.replace(new RegExp(`{${r}}`,"g"),String(t[r]));return i}async function vn(e,t){if(!e)return;let n=e;try{/^https?:\/\//.test(e)||(n=new URL(e,location.origin+t).toString());const i=await fetch(n);if(!i.ok)return;const r=await i.json();for(const a of Object.keys(r||{}))ft[a]=Object.assign({},ft[a]||{},r[a])}catch{}}function An(e){const t=String(e).split("-")[0].toLowerCase();tt=ft[t]?t:"en"}const Gi=Object.freeze(Object.defineProperty({__proto__:null,get currentLang(){return tt},loadL10nFile:vn,setLang:An,t:gt},Symbol.toStringTag,{value:"Module"})),Qi=`import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
`;function Xi(e,t="worker"){let n=null;const i=typeof globalThis<"u"&&typeof globalThis.__nimbiCMSDebug<"u"?!!globalThis.__nimbiCMSDebug:!1;function r(...l){try{i&&console&&typeof console.warn=="function"&&console.warn(...l)}catch{}}function a(){if(!n)try{const l=e();n=l||null,l&&l.addEventListener("error",()=>{try{n===l&&(n=null,l.terminate&&l.terminate())}catch(u){r("["+t+"] worker termination failed",u)}})}catch(l){n=null,r("["+t+"] worker init failed",l)}return n}function s(){try{n&&(n.terminate&&n.terminate(),n=null)}catch(l){r("["+t+"] worker termination failed",l)}}function c(l,u=1e4){return new Promise((p,g)=>{const h=a();if(!h)return g(new Error("worker unavailable"));const d=String(Math.random()),f=Object.assign({},l,{id:d});let m=null;const w=()=>{m&&clearTimeout(m),h.removeEventListener("message",y),h.removeEventListener("error",k)},y=E=>{const C=E.data||{};C.id===d&&(w(),C.error?g(new Error(C.error)):p(C.result))},k=E=>{w(),r("["+t+"] worker error event",E);try{n===h&&(n=null,h.terminate&&h.terminate())}catch(C){r("["+t+"] worker termination failed",C)}g(new Error(E&&E.message||"worker error"))};m=setTimeout(()=>{w(),r("["+t+"] worker timed out");try{n===h&&(n=null,h.terminate&&h.terminate())}catch(E){r("["+t+"] worker termination on timeout failed",E)}g(new Error("worker timeout"))},u),h.addEventListener("message",y),h.addEventListener("error",k);try{h.postMessage(f)}catch(E){w(),g(E)}})}return{get:a,send:c,terminate:s}}function gr(e,t="worker-pool",n=2){const i=new Array(n).fill(null);let r=0;const a=typeof globalThis<"u"&&typeof globalThis.__nimbiCMSDebug<"u"?!!globalThis.__nimbiCMSDebug:!1;function s(...f){try{a&&console&&typeof console.warn=="function"&&console.warn(...f)}catch{}}function c(f){if(!i[f])try{const m=e();i[f]=m||null,m&&m.addEventListener("error",()=>{try{i[f]===m&&(i[f]=null,m.terminate&&m.terminate())}catch(w){s("["+t+"] worker termination failed",w)}})}catch(m){i[f]=null,s("["+t+"] worker init failed",m)}return i[f]}const o=new Array(n).fill(0),l=new Array(n).fill(null),u=30*1e3;function p(f){try{o[f]=Date.now(),l[f]&&(clearTimeout(l[f]),l[f]=null),l[f]=setTimeout(()=>{try{i[f]&&(i[f].terminate&&i[f].terminate(),i[f]=null)}catch(m){s("["+t+"] idle termination failed",m)}l[f]=null},u)}catch{}}function g(){for(let f=0;f<i.length;f++){const m=c(f);if(m)return m}return null}function h(){for(let f=0;f<i.length;f++)try{i[f]&&(i[f].terminate&&i[f].terminate(),i[f]=null)}catch(m){s("["+t+"] worker termination failed",m)}}function d(f,m=1e4){return new Promise((w,y)=>{const k=r++%i.length,E=C=>{const B=(k+C)%i.length,H=c(B);if(!H)return C+1<i.length?E(C+1):y(new Error("worker pool unavailable"));const R=String(Math.random()),G=Object.assign({},f,{id:R});let de=null;const v=()=>{de&&clearTimeout(de),H.removeEventListener("message",j),H.removeEventListener("error",X)},j=D=>{const Q=D.data||{};Q.id===R&&(v(),Q.error?y(new Error(Q.error)):w(Q.result))},X=D=>{v(),s("["+t+"] worker error event",D);try{i[B]===H&&(i[B]=null,H.terminate&&H.terminate())}catch(Q){s("["+t+"] worker termination failed",Q)}y(new Error(D&&D.message||"worker error"))};de=setTimeout(()=>{v(),s("["+t+"] worker timed out");try{i[B]===H&&(i[B]=null,H.terminate&&H.terminate())}catch(D){s("["+t+"] worker termination on timeout failed",D)}y(new Error("worker timeout"))},m),H.addEventListener("message",j),H.addEventListener("error",X);try{p(B),H.postMessage(G)}catch(D){v(),y(D)}};E(0)})}return{get:g,send:d,terminate:h}}function vt(e){try{if(typeof Blob<"u"&&typeof URL<"u"&&e)try{vt._blobUrlCache||(vt._blobUrlCache=new Map);const t=vt._blobUrlCache;let n=t.get(e);if(!n){const i=new Blob([e],{type:"application/javascript"});n=URL.createObjectURL(i),t.set(e,n)}return new Worker(n,{type:"module"})}catch(t){try{typeof globalThis<"u"&&globalThis.__nimbiCMSDebug&&console&&typeof console.warn=="function"&&console.warn("[worker-manager] createWorkerFromRaw failed",t)}catch{}}}catch(t){try{typeof globalThis<"u"&&globalThis.__nimbiCMSDebug&&console&&typeof console.warn=="function"&&console.warn("[worker-manager] createWorkerFromRaw failed",t)}catch{}}return null}const We=new Set;function En(e){Ki(),We.clear();for(const t of Oe)t&&We.add(t);mr(ne),mr(W),En._refreshed=!0}function mr(e){if(!(!e||typeof e.values!="function"))for(const t of e.values())t&&We.add(t)}function br(e){if(!e||typeof e.set!="function")return;const t=e.set;e.set=function(n,i){return i&&We.add(i),t.call(this,n,i)}}let wr=!1;function Ki(){wr||(br(ne),br(W),wr=!0)}function yr(e){return!e||typeof e!="string"?!1:/^(https?:)?\/\//.test(e)||e.startsWith("mailto:")||e.startsWith("tel:")}function xe(e){return String(e||"").replace(/^[.\/]+/,"")}function At(e){return String(e||"").replace(/\/+$/,"")}function Et(e){return At(e)+"/"}function Yi(e){try{if(!e||typeof document>"u"||!document.head||e.startsWith("data:")||document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`))return;const n=document.createElement("link");n.rel="preload",n.as="image",n.href=e,document.head.appendChild(n)}catch(t){console.warn("[helpers] preloadImage failed",t)}}function Xt(e,t=0,n=!1){try{if(typeof window>"u"||!e||!e.querySelectorAll)return;const i=Array.from(e.querySelectorAll("img"));if(!i.length)return;const r=e,a=r&&r.getBoundingClientRect?r.getBoundingClientRect():null,s=0,c=typeof window<"u"&&(window.innerHeight||document.documentElement.clientHeight)||0,o=a?Math.max(s,a.top):s,u=(a?Math.min(c,a.bottom):c)+Number(t||0);let p=0;r&&(p=r.clientHeight||(a?a.height:0)),p||(p=c-s);let g=.6;try{const m=r&&window.getComputedStyle?window.getComputedStyle(r):null,w=m&&m.getPropertyValue("--nimbi-image-max-height-ratio"),y=w?parseFloat(w):NaN;!Number.isNaN(y)&&y>0&&y<=1&&(g=y)}catch(m){console.warn("[helpers] read CSS ratio failed",m)}const h=Math.max(200,Math.floor(p*g));let d=!1,f=null;if(i.forEach(m=>{try{const w=m.getAttribute?m.getAttribute("loading"):void 0;w!=="eager"&&m.setAttribute&&m.setAttribute("loading","lazy");const y=m.getBoundingClientRect?m.getBoundingClientRect():null,k=m.src||m.getAttribute&&m.getAttribute("src"),E=y&&y.height>1?y.height:h,C=y?y.top:0,B=C+E;y&&E>0&&C<=u&&B>=o&&(m.setAttribute?(m.setAttribute("loading","eager"),m.setAttribute("fetchpriority","high"),m.setAttribute("data-eager-by-nimbi","1")):(m.loading="eager",m.fetchPriority="high"),Yi(k),d=!0),!f&&y&&y.top<=u&&(f={img:m,src:k,rect:y,beforeLoading:w})}catch(w){console.warn("[helpers] setEagerForAboveFoldImages per-image failed",w)}}),!d&&f){const{img:m,src:w,rect:y,beforeLoading:k}=f;try{m.setAttribute?(m.setAttribute("loading","eager"),m.setAttribute("fetchpriority","high"),m.setAttribute("data-eager-by-nimbi","1")):(m.loading="eager",m.fetchPriority="high")}catch(E){console.warn("[helpers] setEagerForAboveFoldImages fallback failed",E)}}}catch(i){console.warn("[helpers] setEagerForAboveFoldImages failed",i)}}function _e(e,t=null,n){try{const i=typeof n=="string"?n:typeof window<"u"&&window.location?window.location.search:"",r=new URLSearchParams(i.startsWith("?")?i.slice(1):i),a=String(e||"");r.delete("page");const s=new URLSearchParams;s.set("page",a);for(const[l,u]of r.entries())s.append(l,u);const c=s.toString();let o=c?`?${c}`:"";return t&&(o+=`#${encodeURIComponent(t)}`),o||`?page=${encodeURIComponent(a)}`}catch{const r=`?page=${encodeURIComponent(String(e||""))}`;return t?`${r}#${encodeURIComponent(t)}`:r}}function Kt(e){try{const t=e();return t&&typeof t.then=="function"?t.catch(n=>{console.warn("[helpers] safe swallowed error",n)}):t}catch(t){console.warn("[helpers] safe swallowed error",t)}}try{typeof globalThis<"u"&&!globalThis.safe&&(globalThis.safe=Kt)}catch(e){console.warn("[helpers] global attach failed",e)}function Vi(e){try{if(!e&&e!==0)return"";const t=String(e),n={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:" "};return t.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g,(i,r)=>{if(!r)return i;if(r[0]==="#")try{return r[1]==="x"||r[1]==="X"?String.fromCharCode(parseInt(r.slice(2),16)):String.fromCharCode(parseInt(r.slice(1),10))}catch{return i}return n[r]!==void 0?n[r]:i})}catch{return String(e||"")}}const ne=new Map;let Ie=[],Ln=!1;function Ji(e){Ln=!!e}function kr(e){Ie=Array.isArray(e)?e.slice():[]}function ea(){return Ie}const _r=typeof navigator<"u"&&navigator.hardwareConcurrency?Math.max(1,Math.floor(navigator.hardwareConcurrency/2)):2,xr=gr(()=>vt(Qi),"slugManager",_r);function ta(){return xr.get()}function Sr(e){return xr.send(e,5e3)}async function na(e,t=1,n=void 0){const i=await Promise.resolve().then(()=>wt);if(!(i.initSlugWorker&&i.initSlugWorker()))throw new Error("slug worker required but unavailable");return await Sr({type:"buildSearchIndex",contentBase:e,indexDepth:t,noIndexing:n})}async function ra(e,t,n){const i=await Promise.resolve().then(()=>wt);if(!(i.initSlugWorker&&i.initSlugWorker()))throw new Error("slug worker required but unavailable");return Sr({type:"crawlForSlug",slug:e,base:t,maxQueue:n})}function nt(e,t){if(e)if(Ie&&Ie.length){const i=t.split("/")[0],r=Ie.includes(i);let a=ne.get(e);(!a||typeof a=="string")&&(a={default:typeof a=="string"?a:void 0,langs:{}}),r?a.langs[i]=t:a.default=t,ne.set(e,a)}else ne.set(e,t)}const Yt=new Set;function ia(e){typeof e=="function"&&Yt.add(e)}function aa(e){typeof e=="function"&&Yt.delete(e)}const W=new Map;let Tn={},Oe=[],mt="_404.md",bt="_home.md";function Cn(e){e!=null&&(mt=String(e||""))}function sa(e){e!=null&&(bt=String(e||""))}function oa(e){Tn=e||{}}const Lt=new Map,Vt=new Set;function la(){Lt.clear(),Vt.clear()}function ca(e){if(!e||e.length===0)return"";let t=e[0];for(let i=1;i<e.length;i++){const r=e[i];let a=0;const s=Math.min(t.length,r.length);for(;a<s&&t[a]===r[a];)a++;t=t.slice(0,a)}const n=t.lastIndexOf("/");return n===-1?t:t.slice(0,n+1)}function Jt(e){ne.clear(),W.clear(),Oe=[],Ie=Ie||[];const t=Object.keys(Tn||{});if(!t.length)return;let n="";try{if(e){try{/^[a-z][a-z0-9+.-]*:/i.test(String(e))?n=new URL(String(e)).pathname:n=String(e||"")}catch(i){n=String(e||""),console.warn("[slugManager] parse contentBase failed",i)}n=Et(n)}}catch(i){n="",console.warn("[slugManager] setContentBase prefix derivation failed",i)}n||(n=ca(t));for(const i of t){let r=i;n&&i.startsWith(n)?r=xe(i.slice(n.length)):r=xe(i),Oe.push(r);try{En()}catch(s){console.warn("[slugManager] refreshIndexPaths failed",s)}const a=Tn[i];if(typeof a=="string"){const s=(a||"").match(/^#\s+(.+)$/m);if(s&&s[1]){const c=ge(s[1].trim());if(c)try{let o=c;if((!Ie||!Ie.length)&&(o=vr(o,new Set(ne.keys()))),Ie&&Ie.length){const u=r.split("/")[0],p=Ie.includes(u);let g=ne.get(o);(!g||typeof g=="string")&&(g={default:typeof g=="string"?g:void 0,langs:{}}),p?g.langs[u]=r:g.default=r,ne.set(o,g)}else ne.set(o,r);W.set(r,o)}catch(o){console.warn("[slugManager] set slug mapping failed",o)}}}}}try{Jt()}catch(e){console.warn("[slugManager] initial setContentBase failed",e)}function ge(e){let n=String(e||"").toLowerCase().replace(/[^a-z0-9\- ]/g,"").replace(/ /g,"-");return n=n.replace(/(?:-?)(?:md|html)$/,""),n=n.replace(/-+/g,"-"),n=n.replace(/^-|-$/g,""),n.length>80&&(n=n.slice(0,80).replace(/-+$/g,"")),n}function vr(e,t){if(!t.has(e))return e;let n=2,i=`${e}-${n}`;for(;t.has(i);)n+=1,i=`${e}-${n}`;return i}function ua(e){return Tt(e,void 0)}function Tt(e,t){if(!e)return!1;if(e.startsWith("//"))return!0;if(/^[a-z][a-z0-9+.-]*:/i.test(e)){if(t&&typeof t=="string")try{const n=new URL(e),i=new URL(t);return n.origin!==i.origin?!0:!n.pathname.startsWith(i.pathname)}catch{return!0}return!0}if(e.startsWith("/")&&t&&typeof t=="string")try{const n=new URL(e,t),i=new URL(t);return n.origin!==i.origin?!0:!n.pathname.startsWith(i.pathname)}catch{return!0}return!1}function en(e){return e==null?e:String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g,(t,n)=>n)}function Ct(e){if(!e||!ne.has(e))return null;const t=ne.get(e);if(!t)return null;if(typeof t=="string")return t;if(Ie&&Ie.length&&tt&&t.langs&&t.langs[tt])return t.langs[tt];if(t.default)return t.default;if(t.langs){const n=Object.keys(t.langs);if(n.length)return t.langs[n[0]]}return null}const Mt=new Map;function ha(){Mt.clear()}let Ce=async function(e,t){if(!e)throw new Error("path required");try{const a=(String(e||"").match(/([^\/]+)\.md(?:$|[?#])/)||[])[1];if(a&&ne.has(a)){const s=Ct(a)||ne.get(a);s&&s!==e&&(e=s)}}catch(a){console.warn("[slugManager] slug mapping normalization failed",a)}const n=t==null?"":At(String(t));let i="";try{if(n)if(/^[a-z][a-z0-9+.-]*:/i.test(n))i=n.replace(/\/$/,"")+"/"+e.replace(/^\//,"");else if(n.startsWith("/"))i=n.replace(/\/$/,"")+"/"+e.replace(/^\//,"");else{const a=typeof location<"u"&&location.origin?location.origin:"http://localhost",s=n.startsWith("/")?n:"/"+n;i=a+s.replace(/\/$/,"")+"/"+e.replace(/^\//,"")}else i=(typeof location<"u"&&location.origin?location.origin:"http://localhost")+"/"+e.replace(/^\//,"")}catch{i="/"+e.replace(/^\//,"")}if(Mt.has(i))return Mt.get(i);const r=(async()=>{const a=await fetch(i);if(!a||typeof a.ok!="boolean"||!a.ok){if(a&&a.status===404)try{const p=`${n}/${mt}`,g=await globalThis.fetch(p);if(g&&typeof g.ok=="boolean"&&g.ok)return{raw:await g.text(),status:404}}catch(p){console.warn("[slugManager] fetching fallback 404 failed",p)}let u="";try{a&&typeof a.clone=="function"?u=await a.clone().text():a&&typeof a.text=="function"?u=await a.text():u=""}catch(p){u="",console.warn("[slugManager] reading error body failed",p)}throw console.error("fetchMarkdown failed:",{url:i,status:a?a.status:void 0,statusText:a?a.statusText:void 0,body:u.slice(0,200)}),new Error("failed to fetch md")}const s=await a.text(),c=s.trim().slice(0,16).toLowerCase(),o=c.startsWith("<!doctype")||c.startsWith("<html"),l=o||String(e||"").toLowerCase().endsWith(".html");if(o&&String(e||"").toLowerCase().endsWith(".md")){try{const u=`${n}/${mt}`,p=await globalThis.fetch(u);if(p.ok)return{raw:await p.text(),status:404}}catch(u){console.warn("[slugManager] fetching fallback 404 failed",u)}throw console.error("fetchMarkdown: server returned HTML for .md request",i),new Error("failed to fetch md")}return l?{raw:s,isHtml:!0}:{raw:s}})();return Mt.set(i,r),r};function da(e){typeof e=="function"&&(Ce=e)}const tn=new Map;function pa(e){if(!e||typeof e!="string")return"";let t=e.replace(/```[\s\S]*?```/g,"");return t=t.replace(/<pre[\s\S]*?<\/pre>/gi,""),t=t.replace(/<code[\s\S]*?<\/code>/gi,""),t=t.replace(/<!--([\s\S]*?)-->/g,""),t=t.replace(/^ {4,}.*$/gm,""),t=t.replace(/`[^`]*`/g,""),t}let Ye=[],Rt=null;async function Ar(e,t=1,n=void 0){const i=Array.isArray(n)?Array.from(new Set((n||[]).map(r=>xe(String(r||""))))):[];try{const r=xe(String(mt||""));r&&!i.includes(r)&&i.push(r)}catch{}if(Ye&&Ye.length&&t===1&&!Ye.some(a=>{try{return i.includes(xe(String(a.path||"")))}catch{return!1}}))return Ye;if(Rt)return Rt;Rt=(async()=>{let r=Array.isArray(n)?Array.from(new Set((n||[]).map(l=>xe(String(l||""))))):[];try{const l=xe(String(mt||""));l&&!r.includes(l)&&r.push(l)}catch{}const a=l=>{if(!r||!r.length)return!1;for(const u of r)if(u&&(l===u||l.startsWith(u+"/")))return!0;return!1};let s=[];if(Oe&&Oe.length&&(s=Array.from(Oe)),!s.length)for(const l of ne.values())l&&s.push(l);try{const l=await Mr(e);l&&l.length&&(s=s.concat(l))}catch(l){console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed",l)}try{const l=new Set(s),u=[...s],p=Math.max(1,_r),g=async()=>{for(;!(l.size>zt);){const d=u.shift();if(!d)break;try{const f=await Ce(d,e);if(f&&f.raw){if(f.status===404)continue;let m=f.raw;const w=[],y=String(d||"").replace(/^.*\//,"");if(/^readme(?:\.md)?$/i.test(y)&&Ln&&(!d||!d.includes("/")))continue;const k=pa(m),E=/\[[^\]]+\]\(([^)]+)\)/g;let C;for(;C=E.exec(k);)w.push(C[1]);const B=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;C=B.exec(k);)w.push(C[1]);const H=d&&d.includes("/")?d.substring(0,d.lastIndexOf("/")+1):"";for(let R of w)try{if(Tt(R,e)||R.startsWith("..")||R.indexOf("/../")!==-1||(H&&!R.startsWith("./")&&!R.startsWith("/")&&!R.startsWith("../")&&(R=H+R),R=xe(R),!/\.(md|html?)(?:$|[?#])/i.test(R))||(R=R.split(/[?#]/)[0],a(R)))continue;l.has(R)||(l.add(R),u.push(R),s.push(R))}catch(G){console.warn("[slugManager] href processing failed",R,G)}}}catch(f){console.warn("[slugManager] discovery fetch failed for",d,f)}}},h=[];for(let d=0;d<p;d++)h.push(g());await Promise.all(h)}catch(l){console.warn("[slugManager] discovery loop failed",l)}const c=new Set;s=s.filter(l=>!l||c.has(l)||a(l)?!1:(c.add(l),!0));const o=[];for(const l of s)if(/\.(?:md|html?)(?:$|[?#])/i.test(l))try{const u=await Ce(l,e);if(u&&u.raw){if(u.status===404)continue;let p="",g="";if(u.isHtml)try{const f=new DOMParser().parseFromString(u.raw,"text/html"),m=f.querySelector("title")||f.querySelector("h1");m&&m.textContent&&(p=m.textContent.trim());const w=f.querySelector("p");if(w&&w.textContent&&(g=w.textContent.trim()),t>=2)try{const y=f.querySelector("h1"),k=y&&y.textContent?y.textContent.trim():p||"",E=(()=>{try{if(W.has(l))return W.get(l)}catch{}return ge(p||l)})(),C=Array.from(f.querySelectorAll("h2"));for(const B of C)try{const H=(B.textContent||"").trim();if(!H)continue;const R=B.id?B.id:ge(H),G=E?`${E}::${R}`:`${ge(l)}::${R}`;let de="",v=B.nextElementSibling;for(;v&&v.tagName&&v.tagName.toLowerCase()==="script";)v=v.nextElementSibling;v&&v.textContent&&(de=String(v.textContent).trim()),o.push({slug:G,title:H,excerpt:de,path:l,parentTitle:k})}catch(H){console.warn("[slugManager] indexing H2 failed",H)}if(t===3)try{const B=Array.from(f.querySelectorAll("h3"));for(const H of B)try{const R=(H.textContent||"").trim();if(!R)continue;const G=H.id?H.id:ge(R),de=E?`${E}::${G}`:`${ge(l)}::${G}`;let v="",j=H.nextElementSibling;for(;j&&j.tagName&&j.tagName.toLowerCase()==="script";)j=j.nextElementSibling;j&&j.textContent&&(v=String(j.textContent).trim()),o.push({slug:de,title:R,excerpt:v,path:l,parentTitle:k})}catch(R){console.warn("[slugManager] indexing H3 failed",R)}}catch(B){console.warn("[slugManager] collect H3s failed",B)}}catch(y){console.warn("[slugManager] collect H2s failed",y)}}catch(d){console.warn("[slugManager] parsing HTML for index failed",d)}else{const d=u.raw,f=d.match(/^#\s+(.+)$/m);p=f?f[1].trim():"";try{p=en(p)}catch{}const m=d.split(/\r?\n\s*\r?\n/);if(m.length>1)for(let w=1;w<m.length;w++){const y=m[w].trim();if(y&&!/^#/.test(y)){g=y.replace(/\r?\n/g," ");break}}if(t>=2){let w="",y="";try{const k=(d.match(/^#\s+(.+)$/m)||[])[1];w=k?k.trim():"",y=(function(){try{if(W.has(l))return W.get(l)}catch{}return ge(p||l)})();const E=/^##\s+(.+)$/gm;let C;for(;C=E.exec(d);)try{const B=(C[1]||"").trim(),H=en(B);if(!B)continue;const R=ge(B),G=y?`${y}::${R}`:`${ge(l)}::${R}`,v=d.slice(E.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),j=v&&v[1]?String(v[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";o.push({slug:G,title:H,excerpt:j,path:l,parentTitle:w})}catch(B){console.warn("[slugManager] indexing markdown H2 failed",B)}}catch(k){console.warn("[slugManager] collect markdown H2s failed",k)}if(t===3)try{const k=/^###\s+(.+)$/gm;let E;for(;E=k.exec(d);)try{const C=(E[1]||"").trim(),B=en(C);if(!C)continue;const H=ge(C),R=y?`${y}::${H}`:`${ge(l)}::${H}`,de=d.slice(k.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),v=de&&de[1]?String(de[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";o.push({slug:R,title:B,excerpt:v,path:l,parentTitle:w})}catch(C){console.warn("[slugManager] indexing markdown H3 failed",C)}}catch(k){console.warn("[slugManager] collect markdown H3s failed",k)}}}let h="";try{W.has(l)&&(h=W.get(l))}catch(d){console.warn("[slugManager] mdToSlug access failed",d)}h||(h=ge(p||l)),o.push({slug:h,title:p,excerpt:g,path:l})}}catch(u){console.warn("[slugManager] buildSearchIndex: entry fetch failed",u)}try{Ye=o.filter(u=>{try{return!a(String(u.path||""))}catch{return!0}})}catch(l){console.warn("[slugManager] filtering index by excludes failed",l),Ye=o}return Ye})();try{await Rt}catch(r){console.warn("[slugManager] awaiting _indexPromise failed",r)}return Rt=null,Ye}const Er=1e3;let zt=Er;function fa(e){typeof e=="number"&&e>=0&&(zt=e)}const Lr=new DOMParser,Tr="a[href]";let Cr=async function(e,t,n=zt){if(tn.has(e))return tn.get(e);let i=null;const r=new Set,a=[""];for(;a.length&&!i&&!(a.length>n);){const s=a.shift();if(r.has(s))continue;r.add(s);let c=t;c.endsWith("/")||(c+="/"),c+=s;try{let o;try{o=await globalThis.fetch(c)}catch(g){console.warn("[slugManager] crawlAllMarkdown: fetch failed",{url:c,error:g});continue}if(!o||!o.ok){o&&!o.ok&&console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:c,status:o.status});continue}const l=await o.text(),p=Lr.parseFromString(l,"text/html").querySelectorAll(Tr);for(const g of p)try{let h=g.getAttribute("href")||"";if(!h||Tt(h,t)||h.startsWith("..")||h.indexOf("/../")!==-1)continue;if(h.endsWith("/")){const d=s+h;r.has(d)||a.push(d);continue}if(h.toLowerCase().endsWith(".md")){const d=xe(s+h);try{if(W.has(d))continue;for(const f of ne.values());}catch(f){console.warn("[slugManager] slug map access failed",f)}try{const f=await Ce(d,t);if(f&&f.raw){const m=(f.raw||"").match(/^#\s+(.+)$/m);if(m&&m[1]&&ge(m[1].trim())===e){i=d;break}}}catch(f){console.warn("[slugManager] crawlForSlug: fetchMarkdown failed",f)}}}catch(h){console.warn("[slugManager] crawlForSlug: link iteration failed",h)}}catch(o){console.warn("[slugManager] crawlForSlug: directory fetch failed",o)}}return tn.set(e,i),i};async function Mr(e,t=zt){const n=new Set,i=new Set,r=[""];for(;r.length&&!(r.length>t);){const a=r.shift();if(i.has(a))continue;i.add(a);let s=e;s.endsWith("/")||(s+="/"),s+=a;try{let c;try{c=await globalThis.fetch(s)}catch(p){console.warn("[slugManager] crawlAllMarkdown: fetch failed",{url:s,error:p});continue}if(!c||!c.ok){c&&!c.ok&&console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:s,status:c.status});continue}const o=await c.text(),u=Lr.parseFromString(o,"text/html").querySelectorAll(Tr);for(const p of u)try{let g=p.getAttribute("href")||"";if(!g||Tt(g,e)||g.startsWith("..")||g.indexOf("/../")!==-1)continue;if(g.endsWith("/")){const d=a+g;i.has(d)||r.push(d);continue}const h=(a+g).replace(/^\/+/,"");/\.(md|html?)$/i.test(h)&&n.add(h)}catch(g){console.warn("[slugManager] crawlAllMarkdown: link iteration failed",g)}}catch(c){console.warn("[slugManager] crawlAllMarkdown: directory fetch failed",c)}}return Array.from(n)}async function Rr(e,t,n){if(e&&typeof e=="string"&&(e=xe(e),e=At(e)),ne.has(e))return Ct(e)||ne.get(e);for(const r of Yt)try{const a=await r(e,t);if(a)return nt(e,a),W.set(a,e),a}catch(a){console.warn("[slugManager] slug resolver failed",a)}if(Oe&&Oe.length){if(Lt.has(e)){const r=Lt.get(e);return ne.set(e,r),W.set(r,e),r}for(const r of Oe)if(!Vt.has(r))try{const a=await Ce(r,t);if(a&&a.raw){const s=(a.raw||"").match(/^#\s+(.+)$/m);if(s&&s[1]){const c=ge(s[1].trim());if(Vt.add(r),c&&Lt.set(c,r),c===e)return nt(e,r),W.set(r,e),r}}}catch(a){console.warn("[slugManager] manifest title fetch failed",a)}}try{const r=await Ar(t);if(r&&r.length){const a=r.find(s=>s.slug===e);if(a)return nt(e,a.path),W.set(a.path,e),a.path}}catch(r){console.warn("[slugManager] buildSearchIndex lookup failed",r)}try{const r=await Cr(e,t,n);if(r)return nt(e,r),W.set(r,e),r}catch(r){console.warn("[slugManager] crawlForSlug lookup failed",r)}const i=[`${e}.html`,`${e}.md`];for(const r of i)try{const a=await Ce(r,t);if(a&&a.raw)return nt(e,r),W.set(r,e),r}catch(a){console.warn("[slugManager] candidate fetch failed",a)}if(Oe&&Oe.length)for(const r of Oe)try{const a=r.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(ge(a)===e)return nt(e,r),W.set(r,e),r}catch(a){console.warn("[slugManager] build-time filename match failed",a)}try{const r=[];bt&&typeof bt=="string"&&bt.trim()&&r.push(bt),r.includes("_home.md")||r.push("_home.md");for(const a of r)try{const s=await Ce(a,t);if(s&&s.raw){const c=(s.raw||"").match(/^#\s+(.+)$/m);if(c&&c[1]&&ge(c[1].trim())===e)return nt(e,a),W.set(a,e),a}}catch{}}catch(r){console.warn("[slugManager] home page fetch failed",r)}return null}const wt=Object.freeze(Object.defineProperty({__proto__:null,CRAWL_MAX_QUEUE:Er,_setAllMd:oa,_storeSlugMapping:nt,addSlugResolver:ia,get allMarkdownPaths(){return Oe},get availableLanguages(){return Ie},buildSearchIndex:Ar,buildSearchIndexWorker:na,clearFetchCache:ha,clearListCaches:la,crawlAllMarkdown:Mr,crawlCache:tn,crawlForSlug:Cr,crawlForSlugWorker:ra,get defaultCrawlMaxQueue(){return zt},ensureSlug:Rr,fetchCache:Mt,get fetchMarkdown(){return Ce},getLanguages:ea,get homePage(){return bt},initSlugWorker:ta,isExternalLink:ua,isExternalLinkWithBase:Tt,listPathsFetched:Vt,listSlugCache:Lt,mdToSlug:W,get notFoundPage(){return mt},removeSlugResolver:aa,resolveSlugPath:Ct,get searchIndex(){return Ye},setContentBase:Jt,setDefaultCrawlMaxQueue:fa,setFetchMarkdown:da,setHomePage:sa,setLanguages:kr,setNotFoundPage:Cn,setSkipRootReadme:Ji,get skipRootReadme(){return Ln},slugResolvers:Yt,slugToMd:ne,slugify:ge,unescapeMarkdown:en,uniqueSlug:vr},Symbol.toStringTag,{value:"Module"}));let zr=100;function $r(e){zr=e}let $t=300*1e3;function Pr(e){$t=e}const De=new Map;function ga(e){if(!De.has(e))return;const t=De.get(e),n=Date.now();if(t.ts+$t<n){De.delete(e);return}return De.delete(e),De.set(e,t),t.value}function ma(e,t){if(Ir(),Ir(),De.delete(e),De.set(e,{value:t,ts:Date.now()}),De.size>zr){const n=De.keys().next().value;n!==void 0&&De.delete(n)}}function Ir(){if(!$t||$t<=0)return;const e=Date.now();for(const[t,n]of De.entries())n.ts+$t<e&&De.delete(t)}async function ba(e,t){const n=new Set(We),i=document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");for(const r of Array.from(i||[])){const a=r.getAttribute("href")||"";if(a)try{const s=new URL(a,location.href);if(s.origin!==location.origin)continue;const c=(s.hash||s.pathname).match(/([^#?]+\.md)(?:$|[?#])/)||(s.pathname||"").match(/([^#?]+\.md)(?:$|[?#])/);if(c){let p=xe(c[1]);p&&n.add(p);continue}const o=(r.textContent||"").trim(),l=(s.pathname||"").replace(/^.*\//,"");if(o&&ge(o)===e||l&&ge(l.replace(/\.(html?|md)$/i,""))===e)return s.toString();if(/\.(html?)$/i.test(s.pathname)){let p=s.pathname.replace(/^\//,"");n.add(p);continue}const u=s.pathname||"";if(u){const p=new URL(t),g=Et(p.pathname);if(u.indexOf(g)!==-1){let h=u.startsWith(g)?u.slice(g.length):u;h=xe(h),h&&n.add(h)}}}catch(s){console.warn("[router] malformed URL while discovering index candidates",s)}}for(const r of n)try{if(!r||!String(r).includes(".md"))continue;const a=await Ce(r,t);if(!a||!a.raw)continue;const s=(a.raw||"").match(/^#\s+(.+)$/m);if(s){const c=(s[1]||"").trim();if(c&&ge(c)===e)return r}}catch(a){console.warn("[router] fetchMarkdown during index discovery failed",a)}return null}function wa(e){const t=[];if(String(e).includes(".md")||String(e).includes(".html"))/index\.html$/i.test(e)||t.push(e);else try{const n=decodeURIComponent(String(e||""));if(ne.has(n)){const i=Ct(n)||ne.get(n);i&&(/\.(md|html?)$/i.test(i)?/index\.html$/i.test(i)||t.push(i):(t.push(i),t.push(i+".html")))}else{if(We&&We.size)for(const i of We){const r=i.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(ge(r)===n&&!/index\.html$/i.test(i)){t.push(i);break}}!t.length&&n&&!/\.(md|html?)$/i.test(n)&&(t.push(n+".html"),t.push(n+".md"))}}catch(n){console.warn("[router] buildPageCandidates failed during slug handling",n)}return t}async function ya(e,t){const n=e||"",i=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;let r=e||"",a=null;if(r&&String(r).includes("::")){const d=String(r).split("::",2);r=d[0],a=d[1]||null}const c=`${e}|||${typeof Gi<"u"&&tt?tt:""}`,o=ga(c);if(o)r=o.resolved,a=o.anchor||a;else{if(!String(r).includes(".md")&&!String(r).includes(".html")){let d=decodeURIComponent(String(r||""));if(d&&typeof d=="string"&&(d=xe(d),d=At(d)),ne.has(d))r=Ct(d)||ne.get(d);else{let f=await ba(d,t);if(f)r=f;else if(En._refreshed&&We&&We.size||typeof t=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(t)){const m=await Rr(d,t);m&&(r=m)}}}ma(c,{resolved:r,anchor:a})}!a&&i&&(a=i);try{if(r&&(r.startsWith("http://")||r.startsWith("https://")||r.startsWith("/"))){const d=r.startsWith("/")?new URL(r,location.origin).toString():r;try{const f=await fetch(d);if(f&&f.ok){const m=await f.text(),w=f&&f.headers&&typeof f.headers.get=="function"&&f.headers.get("content-type")||"",y=(m||"").toLowerCase();if(w&&w.indexOf&&w.indexOf("text/html")!==-1||y.indexOf("<!doctype")!==-1||y.indexOf("<html")!==-1)return{data:{raw:m,isHtml:!0},pagePath:d.replace(/^\//,""),anchor:a}}}catch{}}}catch{}const l=wa(r),u=String(n||"").includes(".md")||String(n||"").includes(".html");if(u&&l.length===0&&(String(r).includes(".md")||String(r).includes(".html"))&&l.push(r),l.length===0&&(String(r).includes(".md")||String(r).includes(".html"))&&l.push(r),l.length===1&&/index\.html$/i.test(l[0])&&!u&&!ne.has(r)&&!ne.has(decodeURIComponent(String(r||"")))&&!String(r||"").includes("/"))throw new Error("Unknown slug: index.html fallback prevented");let p=null,g=null,h=null;for(const d of l)if(d)try{const f=xe(d);p=await Ce(f,t),g=f;break}catch(f){h=f;try{console.warn("[router] candidate fetch failed",{candidate:d,contentBase:t,err:f&&f.message||f})}catch{}}if(!p){try{console.error("[router] fetchPageData: no page data for",{originalRaw:n,resolved:r,pageCandidates:l,contentBase:t,fetchError:h&&(h.message||String(h))||null})}catch{}try{if(u&&String(n||"").toLowerCase().includes(".html"))try{const d=new URL(String(n||""),location.href).toString();console.warn("[router] attempting absolute HTML fetch fallback",d);const f=await fetch(d);if(f&&f.ok){const m=await f.text(),w=f&&f.headers&&typeof f.headers.get=="function"&&f.headers.get("content-type")||"",y=(m||"").toLowerCase(),k=w&&w.indexOf&&w.indexOf("text/html")!==-1||y.indexOf("<!doctype")!==-1||y.indexOf("<html")!==-1;if(k||console.warn("[router] absolute fetch returned non-HTML",{abs:d,contentType:w,snippet:y.slice(0,200)}),k)try{const E=d,C=new URL(".",E).toString();try{const H=typeof DOMParser<"u"?new DOMParser:null;if(H){const R=H.parseFromString(m||"","text/html"),G=(X,D)=>{try{const Q=D.getAttribute(X)||"";if(!Q||/^(https?:)?\/\//i.test(Q)||Q.startsWith("/")||Q.startsWith("#"))return;try{const S=new URL(Q,E).toString();D.setAttribute(X,S)}catch(S){console.warn("[router] rewrite attribute failed",X,S)}}catch(Q){console.warn("[router] rewrite helper failed",Q)}},de=R.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"),v=[];for(const X of Array.from(de||[]))try{const D=X.tagName?X.tagName.toLowerCase():"";if(D==="a")continue;if(X.hasAttribute("src")){const Q=X.getAttribute("src");G("src",X);const S=X.getAttribute("src");Q!==S&&v.push({attr:"src",tag:D,before:Q,after:S})}if(X.hasAttribute("href")&&D==="link"){const Q=X.getAttribute("href");G("href",X);const S=X.getAttribute("href");Q!==S&&v.push({attr:"href",tag:D,before:Q,after:S})}if(X.hasAttribute("href")&&D!=="link"){const Q=X.getAttribute("href");G("href",X);const S=X.getAttribute("href");Q!==S&&v.push({attr:"href",tag:D,before:Q,after:S})}if(X.hasAttribute("xlink:href")){const Q=X.getAttribute("xlink:href");G("xlink:href",X);const S=X.getAttribute("xlink:href");Q!==S&&v.push({attr:"xlink:href",tag:D,before:Q,after:S})}if(X.hasAttribute("poster")){const Q=X.getAttribute("poster");G("poster",X);const S=X.getAttribute("poster");Q!==S&&v.push({attr:"poster",tag:D,before:Q,after:S})}if(X.hasAttribute("srcset")){const fe=(X.getAttribute("srcset")||"").split(",").map(re=>re.trim()).filter(Boolean).map(re=>{const[pe,A]=re.split(/\s+/,2);if(!pe||/^(https?:)?\/\//i.test(pe)||pe.startsWith("/"))return re;try{const L=new URL(pe,E).toString();return A?`${L} ${A}`:L}catch{return re}}).join(", ");X.setAttribute("srcset",fe)}}catch{}const j=R.documentElement&&R.documentElement.outerHTML?R.documentElement.outerHTML:m;try{v&&v.length&&console.warn("[router] rewritten asset refs",{abs:d,rewritten:v})}catch{}return{data:{raw:j,isHtml:!0},pagePath:String(n||""),anchor:a}}}catch{}let B=m;return/<base\s+[^>]*>/i.test(m)||(/<head[^>]*>/i.test(m)?B=m.replace(/(<head[^>]*>)/i,`$1<base href="${C}">`):B=`<base href="${C}">`+m),{data:{raw:B,isHtml:!0},pagePath:String(n||""),anchor:a}}catch{return{data:{raw:m,isHtml:!0},pagePath:String(n||""),anchor:a}}}}catch(d){console.warn("[router] absolute HTML fetch fallback failed",d)}}catch{}try{const d=decodeURIComponent(String(r||""));if(d&&!/\.(md|html?)$/i.test(d)){const f=[`/assets/${d}.html`,`/assets/${d}/index.html`];for(const m of f)try{const w=await fetch(m,{method:"GET"});if(w&&w.ok)return{data:{raw:await w.text(),isHtml:!0},pagePath:m.replace(/^\//,""),anchor:a}}catch{}}}catch(d){console.warn("[router] assets fallback failed",d)}throw new Error("no page data")}return{data:p,pagePath:g,anchor:a}}function nn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var rt=nn();function Br(e){rt=e}var ot={exec:()=>null};function le(e,t=""){let n=typeof e=="string"?e:e.source,i={replace:(r,a)=>{let s=typeof a=="string"?a:a.source;return s=s.replace(Be.caret,"$1"),n=n.replace(r,s),i},getRegex:()=>new RegExp(n,t)};return i}var ka=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),Be={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}>`)},_a=/^(?:[ \t]*(?:\n|$))+/,xa=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Sa=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Pt=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,va=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Mn=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Nr=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Or=le(Nr).replace(/bull/g,Mn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Aa=le(Nr).replace(/bull/g,Mn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Rn=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Ea=/^[^\n]+/,zn=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,La=le(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",zn).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Ta=le(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,Mn).getRegex(),rn="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",$n=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Ca=le("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",$n).replace("tag",rn).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),qr=le(Rn).replace("hr",Pt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",rn).getRegex(),Ma=le(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",qr).getRegex(),Pn={blockquote:Ma,code:xa,def:La,fences:Sa,heading:va,hr:Pt,html:Ca,lheading:Or,list:Ta,newline:_a,paragraph:qr,table:ot,text:Ea},Dr=le("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Pt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",rn).getRegex(),Ra={...Pn,lheading:Aa,table:Dr,paragraph:le(Rn).replace("hr",Pt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Dr).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",rn).getRegex()},za={...Pn,html:le(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",$n).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:ot,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:le(Rn).replace("hr",Pt).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Or).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},$a=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Pa=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Hr=/^( {2,}|\\)\n(?!\s*$)/,Ia=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,an=/[\p{P}\p{S}]/u,In=/[\s\p{P}\p{S}]/u,jr=/[^\s\p{P}\p{S}]/u,Ba=le(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,In).getRegex(),Ur=/(?!~)[\p{P}\p{S}]/u,Na=/(?!~)[\s\p{P}\p{S}]/u,Oa=/(?:[^\s\p{P}\p{S}]|~)/u,Wr=/(?![*_])[\p{P}\p{S}]/u,qa=/(?![*_])[\s\p{P}\p{S}]/u,Da=/(?:[^\s\p{P}\p{S}]|[*_])/u,Ha=le(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",ka?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Fr=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,ja=le(Fr,"u").replace(/punct/g,an).getRegex(),Ua=le(Fr,"u").replace(/punct/g,Ur).getRegex(),Zr="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Wa=le(Zr,"gu").replace(/notPunctSpace/g,jr).replace(/punctSpace/g,In).replace(/punct/g,an).getRegex(),Fa=le(Zr,"gu").replace(/notPunctSpace/g,Oa).replace(/punctSpace/g,Na).replace(/punct/g,Ur).getRegex(),Za=le("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,jr).replace(/punctSpace/g,In).replace(/punct/g,an).getRegex(),Ga=le(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,Wr).getRegex(),Qa="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Xa=le(Qa,"gu").replace(/notPunctSpace/g,Da).replace(/punctSpace/g,qa).replace(/punct/g,Wr).getRegex(),Ka=le(/\\(punct)/,"gu").replace(/punct/g,an).getRegex(),Ya=le(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Va=le($n).replace("(?:-->|$)","-->").getRegex(),Ja=le("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Va).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),sn=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,es=le(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",sn).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Gr=le(/^!?\[(label)\]\[(ref)\]/).replace("label",sn).replace("ref",zn).getRegex(),Qr=le(/^!?\[(ref)\](?:\[\])?/).replace("ref",zn).getRegex(),ts=le("reflink|nolink(?!\\()","g").replace("reflink",Gr).replace("nolink",Qr).getRegex(),Xr=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Bn={_backpedal:ot,anyPunctuation:Ka,autolink:Ya,blockSkip:Ha,br:Hr,code:Pa,del:ot,delLDelim:ot,delRDelim:ot,emStrongLDelim:ja,emStrongRDelimAst:Wa,emStrongRDelimUnd:Za,escape:$a,link:es,nolink:Qr,punctuation:Ba,reflink:Gr,reflinkSearch:ts,tag:Ja,text:Ia,url:ot},ns={...Bn,link:le(/^!?\[(label)\]\((.*?)\)/).replace("label",sn).getRegex(),reflink:le(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",sn).getRegex()},Nn={...Bn,emStrongRDelimAst:Fa,emStrongLDelim:Ua,delLDelim:Ga,delRDelim:Xa,url:le(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Xr).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:le(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Xr).getRegex()},rs={...Nn,br:le(Hr).replace("{2,}","*").getRegex(),text:le(Nn.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},on={normal:Pn,gfm:Ra,pedantic:za},It={normal:Bn,gfm:Nn,breaks:rs,pedantic:ns},is={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Kr=e=>is[e];function Fe(e,t){if(t){if(Be.escapeTest.test(e))return e.replace(Be.escapeReplace,Kr)}else if(Be.escapeTestNoEncode.test(e))return e.replace(Be.escapeReplaceNoEncode,Kr);return e}function Yr(e){try{e=encodeURI(e).replace(Be.percentDecode,"%")}catch{return null}return e}function Vr(e,t){let n=e.replace(Be.findPipe,(a,s,c)=>{let o=!1,l=s;for(;--l>=0&&c[l]==="\\";)o=!o;return o?"|":" |"}),i=n.split(Be.splitPipe),r=0;if(i[0].trim()||i.shift(),i.length>0&&!i.at(-1)?.trim()&&i.pop(),t)if(i.length>t)i.splice(t);else for(;i.length<t;)i.push("");for(;r<i.length;r++)i[r]=i[r].trim().replace(Be.slashPipe,"|");return i}function Bt(e,t,n){let i=e.length;if(i===0)return"";let r=0;for(;r<i&&e.charAt(i-r-1)===t;)r++;return e.slice(0,i-r)}function as(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let i=0;i<e.length;i++)if(e[i]==="\\")i++;else if(e[i]===t[0])n++;else if(e[i]===t[1]&&(n--,n<0))return i;return n>0?-2:-1}function ss(e,t=0){let n=t,i="";for(let r of e)if(r==="	"){let a=4-n%4;i+=" ".repeat(a),n+=a}else i+=r,n++;return i}function Jr(e,t,n,i,r){let a=t.href,s=t.title||null,c=e[1].replace(r.other.outputLinkReplace,"$1");i.state.inLink=!0;let o={type:e[0].charAt(0)==="!"?"image":"link",raw:n,href:a,title:s,text:c,tokens:i.inlineTokens(c)};return i.state.inLink=!1,o}function os(e,t,n){let i=e.match(n.other.indentCodeCompensation);if(i===null)return t;let r=i[1];return t.split(`
`).map(a=>{let s=a.match(n.other.beginningSpace);if(s===null)return a;let[c]=s;return c.length>=r.length?a.slice(r.length):a}).join(`
`)}var Nt=class{options;rules;lexer;constructor(e){this.options=e||rt}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:Bt(n,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],i=os(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:i}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let i=Bt(n,"#");(this.options.pedantic||!i||this.rules.other.endingSpaceChar.test(i))&&(n=i.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:Bt(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=Bt(t[0],`
`).split(`
`),i="",r="",a=[];for(;n.length>0;){let s=!1,c=[],o;for(o=0;o<n.length;o++)if(this.rules.other.blockquoteStart.test(n[o]))c.push(n[o]),s=!0;else if(!s)c.push(n[o]);else break;n=n.slice(o);let l=c.join(`
`),u=l.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");i=i?`${i}
${l}`:l,r=r?`${r}
${u}`:u;let p=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(u,a,!0),this.lexer.state.top=p,n.length===0)break;let g=a.at(-1);if(g?.type==="code")break;if(g?.type==="blockquote"){let h=g,d=h.raw+`
`+n.join(`
`),f=this.blockquote(d);a[a.length-1]=f,i=i.substring(0,i.length-h.raw.length)+f.raw,r=r.substring(0,r.length-h.text.length)+f.text;break}else if(g?.type==="list"){let h=g,d=h.raw+`
`+n.join(`
`),f=this.list(d);a[a.length-1]=f,i=i.substring(0,i.length-g.raw.length)+f.raw,r=r.substring(0,r.length-h.raw.length)+f.raw,n=d.substring(a.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:i,tokens:a,text:r}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),i=n.length>1,r={type:"list",raw:"",ordered:i,start:i?+n.slice(0,-1):"",loose:!1,items:[]};n=i?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=i?n:"[*+-]");let a=this.rules.other.listItemRegex(n),s=!1;for(;e;){let o=!1,l="",u="";if(!(t=a.exec(e))||this.rules.block.hr.test(e))break;l=t[0],e=e.substring(l.length);let p=ss(t[2].split(`
`,1)[0],t[1].length),g=e.split(`
`,1)[0],h=!p.trim(),d=0;if(this.options.pedantic?(d=2,u=p.trimStart()):h?d=t[1].length+1:(d=p.search(this.rules.other.nonSpaceChar),d=d>4?1:d,u=p.slice(d),d+=t[1].length),h&&this.rules.other.blankLine.test(g)&&(l+=g+`
`,e=e.substring(g.length+1),o=!0),!o){let f=this.rules.other.nextBulletRegex(d),m=this.rules.other.hrRegex(d),w=this.rules.other.fencesBeginRegex(d),y=this.rules.other.headingBeginRegex(d),k=this.rules.other.htmlBeginRegex(d),E=this.rules.other.blockquoteBeginRegex(d);for(;e;){let C=e.split(`
`,1)[0],B;if(g=C,this.options.pedantic?(g=g.replace(this.rules.other.listReplaceNesting,"  "),B=g):B=g.replace(this.rules.other.tabCharGlobal,"    "),w.test(g)||y.test(g)||k.test(g)||E.test(g)||f.test(g)||m.test(g))break;if(B.search(this.rules.other.nonSpaceChar)>=d||!g.trim())u+=`
`+B.slice(d);else{if(h||p.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||w.test(p)||y.test(p)||m.test(p))break;u+=`
`+g}h=!g.trim(),l+=C+`
`,e=e.substring(C.length+1),p=B.slice(d)}}r.loose||(s?r.loose=!0:this.rules.other.doubleBlankLine.test(l)&&(s=!0)),r.items.push({type:"list_item",raw:l,task:!!this.options.gfm&&this.rules.other.listIsTask.test(u),loose:!1,text:u,tokens:[]}),r.raw+=l}let c=r.items.at(-1);if(c)c.raw=c.raw.trimEnd(),c.text=c.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let o of r.items){if(this.lexer.state.top=!1,o.tokens=this.lexer.blockTokens(o.text,[]),o.task){if(o.text=o.text.replace(this.rules.other.listReplaceTask,""),o.tokens[0]?.type==="text"||o.tokens[0]?.type==="paragraph"){o.tokens[0].raw=o.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),o.tokens[0].text=o.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let u=this.lexer.inlineQueue.length-1;u>=0;u--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[u].src)){this.lexer.inlineQueue[u].src=this.lexer.inlineQueue[u].src.replace(this.rules.other.listReplaceTask,"");break}}let l=this.rules.other.listTaskCheckbox.exec(o.raw);if(l){let u={type:"checkbox",raw:l[0]+" ",checked:l[0]!=="[ ]"};o.checked=u.checked,r.loose?o.tokens[0]&&["paragraph","text"].includes(o.tokens[0].type)&&"tokens"in o.tokens[0]&&o.tokens[0].tokens?(o.tokens[0].raw=u.raw+o.tokens[0].raw,o.tokens[0].text=u.raw+o.tokens[0].text,o.tokens[0].tokens.unshift(u)):o.tokens.unshift({type:"paragraph",raw:u.raw,text:u.raw,tokens:[u]}):o.tokens.unshift(u)}}if(!r.loose){let l=o.tokens.filter(p=>p.type==="space"),u=l.length>0&&l.some(p=>this.rules.other.anyLine.test(p.raw));r.loose=u}}if(r.loose)for(let o of r.items){o.loose=!0;for(let l of o.tokens)l.type==="text"&&(l.type="paragraph")}return r}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),i=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:i,title:r}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=Vr(t[1]),i=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],a={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===i.length){for(let s of i)this.rules.other.tableAlignRight.test(s)?a.align.push("right"):this.rules.other.tableAlignCenter.test(s)?a.align.push("center"):this.rules.other.tableAlignLeft.test(s)?a.align.push("left"):a.align.push(null);for(let s=0;s<n.length;s++)a.header.push({text:n[s],tokens:this.lexer.inline(n[s]),header:!0,align:a.align[s]});for(let s of r)a.rows.push(Vr(s,a.header.length).map((c,o)=>({text:c,tokens:this.lexer.inline(c),header:!1,align:a.align[o]})));return a}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let a=Bt(n.slice(0,-1),"\\");if((n.length-a.length)%2===0)return}else{let a=as(t[2],"()");if(a===-2)return;if(a>-1){let s=(t[0].indexOf("!")===0?5:4)+t[1].length+a;t[2]=t[2].substring(0,a),t[0]=t[0].substring(0,s).trim(),t[3]=""}}let i=t[2],r="";if(this.options.pedantic){let a=this.rules.other.pedanticHrefTitle.exec(i);a&&(i=a[1],r=a[3])}else r=t[3]?t[3].slice(1,-1):"";return i=i.trim(),this.rules.other.startAngleBracket.test(i)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?i=i.slice(1):i=i.slice(1,-1)),Jr(t,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let i=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=t[i.toLowerCase()];if(!r){let a=n[0].charAt(0);return{type:"text",raw:a,text:a}}return Jr(n,r,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let i=this.rules.inline.emStrongLDelim.exec(e);if(!(!i||i[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(i[1]||i[2])||!n||this.rules.inline.punctuation.exec(n))){let r=[...i[0]].length-1,a,s,c=r,o=0,l=i[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(l.lastIndex=0,t=t.slice(-1*e.length+r);(i=l.exec(t))!=null;){if(a=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!a)continue;if(s=[...a].length,i[3]||i[4]){c+=s;continue}else if((i[5]||i[6])&&r%3&&!((r+s)%3)){o+=s;continue}if(c-=s,c>0)continue;s=Math.min(s,s+c+o);let u=[...i[0]][0].length,p=e.slice(0,r+i.index+u+s);if(Math.min(r,s)%2){let h=p.slice(1,-1);return{type:"em",raw:p,text:h,tokens:this.lexer.inlineTokens(h)}}let g=p.slice(2,-2);return{type:"strong",raw:p,text:g,tokens:this.lexer.inlineTokens(g)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),i=this.rules.other.nonSpaceChar.test(n),r=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return i&&r&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,n=""){let i=this.rules.inline.delLDelim.exec(e);if(i&&(!i[1]||!n||this.rules.inline.punctuation.exec(n))){let r=[...i[0]].length-1,a,s,c=r,o=this.rules.inline.delRDelim;for(o.lastIndex=0,t=t.slice(-1*e.length+r);(i=o.exec(t))!=null;){if(a=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!a||(s=[...a].length,s!==r))continue;if(i[3]||i[4]){c+=s;continue}if(c-=s,c>0)continue;s=Math.min(s,s+c);let l=[...i[0]][0].length,u=e.slice(0,r+i.index+l+s),p=u.slice(r,-r);return{type:"del",raw:u,text:p,tokens:this.lexer.inlineTokens(p)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,i;return t[2]==="@"?(n=t[1],i="mailto:"+n):(n=t[1],i=n),{type:"link",raw:t[0],text:n,href:i,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,i;if(t[2]==="@")n=t[0],i="mailto:"+n;else{let r;do r=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(r!==t[0]);n=t[0],t[1]==="www."?i="http://"+t[0]:i=t[0]}return{type:"link",raw:t[0],text:n,href:i,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}},He=class ar{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||rt,this.options.tokenizer=this.options.tokenizer||new Nt,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:Be,block:on.normal,inline:It.normal};this.options.pedantic?(n.block=on.pedantic,n.inline=It.pedantic):this.options.gfm&&(n.block=on.gfm,this.options.breaks?n.inline=It.breaks:n.inline=It.gfm),this.tokenizer.rules=n}static get rules(){return{block:on,inline:It}}static lex(t,n){return new ar(n).lex(t)}static lexInline(t,n){return new ar(n).inlineTokens(t)}lex(t){t=t.replace(Be.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let i=this.inlineQueue[n];this.inlineTokens(i.src,i.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],i=!1){for(this.options.pedantic&&(t=t.replace(Be.tabCharGlobal,"    ").replace(Be.spaceLine,""));t;){let r;if(this.options.extensions?.block?.some(s=>(r=s.call({lexer:this},t,n))?(t=t.substring(r.raw.length),n.push(r),!0):!1))continue;if(r=this.tokenizer.space(t)){t=t.substring(r.raw.length);let s=n.at(-1);r.raw.length===1&&s!==void 0?s.raw+=`
`:n.push(r);continue}if(r=this.tokenizer.code(t)){t=t.substring(r.raw.length);let s=n.at(-1);s?.type==="paragraph"||s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+r.raw,s.text+=`
`+r.text,this.inlineQueue.at(-1).src=s.text):n.push(r);continue}if(r=this.tokenizer.fences(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.heading(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.hr(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.blockquote(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.list(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.html(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.def(t)){t=t.substring(r.raw.length);let s=n.at(-1);s?.type==="paragraph"||s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+r.raw,s.text+=`
`+r.raw,this.inlineQueue.at(-1).src=s.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title},n.push(r));continue}if(r=this.tokenizer.table(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.lheading(t)){t=t.substring(r.raw.length),n.push(r);continue}let a=t;if(this.options.extensions?.startBlock){let s=1/0,c=t.slice(1),o;this.options.extensions.startBlock.forEach(l=>{o=l.call({lexer:this},c),typeof o=="number"&&o>=0&&(s=Math.min(s,o))}),s<1/0&&s>=0&&(a=t.substring(0,s+1))}if(this.state.top&&(r=this.tokenizer.paragraph(a))){let s=n.at(-1);i&&s?.type==="paragraph"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+r.raw,s.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):n.push(r),i=a.length!==t.length,t=t.substring(r.raw.length);continue}if(r=this.tokenizer.text(t)){t=t.substring(r.raw.length);let s=n.at(-1);s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+r.raw,s.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):n.push(r);continue}if(t){let s="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(s);break}else throw new Error(s)}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}inlineTokens(t,n=[]){let i=t,r=null;if(this.tokens.links){let o=Object.keys(this.tokens.links);if(o.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(i))!=null;)o.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(i=i.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(i))!=null;)i=i.slice(0,r.index)+"++"+i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let a;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(i))!=null;)a=r[2]?r[2].length:0,i=i.slice(0,r.index+a)+"["+"a".repeat(r[0].length-a-2)+"]"+i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);i=this.options.hooks?.emStrongMask?.call({lexer:this},i)??i;let s=!1,c="";for(;t;){s||(c=""),s=!1;let o;if(this.options.extensions?.inline?.some(u=>(o=u.call({lexer:this},t,n))?(t=t.substring(o.raw.length),n.push(o),!0):!1))continue;if(o=this.tokenizer.escape(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.tag(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.link(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(o.raw.length);let u=n.at(-1);o.type==="text"&&u?.type==="text"?(u.raw+=o.raw,u.text+=o.text):n.push(o);continue}if(o=this.tokenizer.emStrong(t,i,c)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.codespan(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.br(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.del(t,i,c)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.autolink(t)){t=t.substring(o.raw.length),n.push(o);continue}if(!this.state.inLink&&(o=this.tokenizer.url(t))){t=t.substring(o.raw.length),n.push(o);continue}let l=t;if(this.options.extensions?.startInline){let u=1/0,p=t.slice(1),g;this.options.extensions.startInline.forEach(h=>{g=h.call({lexer:this},p),typeof g=="number"&&g>=0&&(u=Math.min(u,g))}),u<1/0&&u>=0&&(l=t.substring(0,u+1))}if(o=this.tokenizer.inlineText(l)){t=t.substring(o.raw.length),o.raw.slice(-1)!=="_"&&(c=o.raw.slice(-1)),s=!0;let u=n.at(-1);u?.type==="text"?(u.raw+=o.raw,u.text+=o.text):n.push(o);continue}if(t){let u="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(u);break}else throw new Error(u)}}return n}},Ot=class{options;parser;constructor(e){this.options=e||rt}space(e){return""}code({text:e,lang:t,escaped:n}){let i=(t||"").match(Be.notSpaceStart)?.[0],r=e.replace(Be.endingNewline,"")+`
`;return i?'<pre><code class="language-'+Fe(i)+'">'+(n?r:Fe(r,!0))+`</code></pre>
`:"<pre><code>"+(n?r:Fe(r,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return""}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,i="";for(let s=0;s<e.items.length;s++){let c=e.items[s];i+=this.listitem(c)}let r=t?"ol":"ul",a=t&&n!==1?' start="'+n+'"':"";return"<"+r+a+`>
`+i+"</"+r+`>
`}listitem(e){return`<li>${this.parser.parse(e.tokens)}</li>
`}checkbox({checked:e}){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",n="";for(let r=0;r<e.header.length;r++)n+=this.tablecell(e.header[r]);t+=this.tablerow({text:n});let i="";for(let r=0;r<e.rows.length;r++){let a=e.rows[r];n="";for(let s=0;s<a.length;s++)n+=this.tablecell(a[s]);i+=this.tablerow({text:n})}return i&&(i=`<tbody>${i}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+i+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),n=e.header?"th":"td";return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${Fe(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let i=this.parser.parseInline(n),r=Yr(e);if(r===null)return i;e=r;let a='<a href="'+e+'"';return t&&(a+=' title="'+Fe(t)+'"'),a+=">"+i+"</a>",a}image({href:e,title:t,text:n,tokens:i}){i&&(n=this.parser.parseInline(i,this.parser.textRenderer));let r=Yr(e);if(r===null)return Fe(n);e=r;let a=`<img src="${e}" alt="${Fe(n)}"`;return t&&(a+=` title="${Fe(t)}"`),a+=">",a}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:Fe(e.text)}},ln=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},je=class sr{options;renderer;textRenderer;constructor(t){this.options=t||rt,this.options.renderer=this.options.renderer||new Ot,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new ln}static parse(t,n){return new sr(n).parse(t)}static parseInline(t,n){return new sr(n).parseInline(t)}parse(t){let n="";for(let i=0;i<t.length;i++){let r=t[i];if(this.options.extensions?.renderers?.[r.type]){let s=r,c=this.options.extensions.renderers[s.type].call({parser:this},s);if(c!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(s.type)){n+=c||"";continue}}let a=r;switch(a.type){case"space":{n+=this.renderer.space(a);break}case"hr":{n+=this.renderer.hr(a);break}case"heading":{n+=this.renderer.heading(a);break}case"code":{n+=this.renderer.code(a);break}case"table":{n+=this.renderer.table(a);break}case"blockquote":{n+=this.renderer.blockquote(a);break}case"list":{n+=this.renderer.list(a);break}case"checkbox":{n+=this.renderer.checkbox(a);break}case"html":{n+=this.renderer.html(a);break}case"def":{n+=this.renderer.def(a);break}case"paragraph":{n+=this.renderer.paragraph(a);break}case"text":{n+=this.renderer.text(a);break}default:{let s='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(s),"";throw new Error(s)}}}return n}parseInline(t,n=this.renderer){let i="";for(let r=0;r<t.length;r++){let a=t[r];if(this.options.extensions?.renderers?.[a.type]){let c=this.options.extensions.renderers[a.type].call({parser:this},a);if(c!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(a.type)){i+=c||"";continue}}let s=a;switch(s.type){case"escape":{i+=n.text(s);break}case"html":{i+=n.html(s);break}case"link":{i+=n.link(s);break}case"image":{i+=n.image(s);break}case"checkbox":{i+=n.checkbox(s);break}case"strong":{i+=n.strong(s);break}case"em":{i+=n.em(s);break}case"codespan":{i+=n.codespan(s);break}case"br":{i+=n.br(s);break}case"del":{i+=n.del(s);break}case"text":{i+=n.text(s);break}default:{let c='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(c),"";throw new Error(c)}}}return i}},yt=class{options;block;constructor(e){this.options=e||rt}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(){return this.block?He.lex:He.lexInline}provideParser(){return this.block?je.parse:je.parseInline}},ei=class{defaults=nn();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=je;Renderer=Ot;TextRenderer=ln;Lexer=He;Tokenizer=Nt;Hooks=yt;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let i of e)switch(n=n.concat(t.call(this,i)),i.type){case"table":{let r=i;for(let a of r.header)n=n.concat(this.walkTokens(a.tokens,t));for(let a of r.rows)for(let s of a)n=n.concat(this.walkTokens(s.tokens,t));break}case"list":{let r=i;n=n.concat(this.walkTokens(r.items,t));break}default:{let r=i;this.defaults.extensions?.childTokens?.[r.type]?this.defaults.extensions.childTokens[r.type].forEach(a=>{let s=r[a].flat(1/0);n=n.concat(this.walkTokens(s,t))}):r.tokens&&(n=n.concat(this.walkTokens(r.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let i={...n};if(i.async=this.defaults.async||i.async||!1,n.extensions&&(n.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){let a=t.renderers[r.name];a?t.renderers[r.name]=function(...s){let c=r.renderer.apply(this,s);return c===!1&&(c=a.apply(this,s)),c}:t.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let a=t[r.level];a?a.unshift(r.tokenizer):t[r.level]=[r.tokenizer],r.start&&(r.level==="block"?t.startBlock?t.startBlock.push(r.start):t.startBlock=[r.start]:r.level==="inline"&&(t.startInline?t.startInline.push(r.start):t.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(t.childTokens[r.name]=r.childTokens)}),i.extensions=t),n.renderer){let r=this.defaults.renderer||new Ot(this.defaults);for(let a in n.renderer){if(!(a in r))throw new Error(`renderer '${a}' does not exist`);if(["options","parser"].includes(a))continue;let s=a,c=n.renderer[s],o=r[s];r[s]=(...l)=>{let u=c.apply(r,l);return u===!1&&(u=o.apply(r,l)),u||""}}i.renderer=r}if(n.tokenizer){let r=this.defaults.tokenizer||new Nt(this.defaults);for(let a in n.tokenizer){if(!(a in r))throw new Error(`tokenizer '${a}' does not exist`);if(["options","rules","lexer"].includes(a))continue;let s=a,c=n.tokenizer[s],o=r[s];r[s]=(...l)=>{let u=c.apply(r,l);return u===!1&&(u=o.apply(r,l)),u}}i.tokenizer=r}if(n.hooks){let r=this.defaults.hooks||new yt;for(let a in n.hooks){if(!(a in r))throw new Error(`hook '${a}' does not exist`);if(["options","block"].includes(a))continue;let s=a,c=n.hooks[s],o=r[s];yt.passThroughHooks.has(a)?r[s]=l=>{if(this.defaults.async&&yt.passThroughHooksRespectAsync.has(a))return(async()=>{let p=await c.call(r,l);return o.call(r,p)})();let u=c.call(r,l);return o.call(r,u)}:r[s]=(...l)=>{if(this.defaults.async)return(async()=>{let p=await c.apply(r,l);return p===!1&&(p=await o.apply(r,l)),p})();let u=c.apply(r,l);return u===!1&&(u=o.apply(r,l)),u}}i.hooks=r}if(n.walkTokens){let r=this.defaults.walkTokens,a=n.walkTokens;i.walkTokens=function(s){let c=[];return c.push(a.call(this,s)),r&&(c=c.concat(r.call(this,s))),c}}this.defaults={...this.defaults,...i}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return He.lex(e,t??this.defaults)}parser(e,t){return je.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let i={...n},r={...this.defaults,...i},a=this.onError(!!r.silent,!!r.async);if(this.defaults.async===!0&&i.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(r.hooks&&(r.hooks.options=r,r.hooks.block=e),r.async)return(async()=>{let s=r.hooks?await r.hooks.preprocess(t):t,c=await(r.hooks?await r.hooks.provideLexer():e?He.lex:He.lexInline)(s,r),o=r.hooks?await r.hooks.processAllTokens(c):c;r.walkTokens&&await Promise.all(this.walkTokens(o,r.walkTokens));let l=await(r.hooks?await r.hooks.provideParser():e?je.parse:je.parseInline)(o,r);return r.hooks?await r.hooks.postprocess(l):l})().catch(a);try{r.hooks&&(t=r.hooks.preprocess(t));let s=(r.hooks?r.hooks.provideLexer():e?He.lex:He.lexInline)(t,r);r.hooks&&(s=r.hooks.processAllTokens(s)),r.walkTokens&&this.walkTokens(s,r.walkTokens);let c=(r.hooks?r.hooks.provideParser():e?je.parse:je.parseInline)(s,r);return r.hooks&&(c=r.hooks.postprocess(c)),c}catch(s){return a(s)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let i="<p>An error occurred:</p><pre>"+Fe(n.message+"",!0)+"</pre>";return t?Promise.resolve(i):i}if(t)return Promise.reject(n);throw n}}},lt=new ei;function se(e,t){return lt.parse(e,t)}se.options=se.setOptions=function(e){return lt.setOptions(e),se.defaults=lt.defaults,Br(se.defaults),se},se.getDefaults=nn,se.defaults=rt,se.use=function(...e){return lt.use(...e),se.defaults=lt.defaults,Br(se.defaults),se},se.walkTokens=function(e,t){return lt.walkTokens(e,t)},se.parseInline=lt.parseInline,se.Parser=je,se.parser=je.parse,se.Renderer=Ot,se.TextRenderer=ln,se.Lexer=He,se.lexer=He.lex,se.Tokenizer=Nt,se.Hooks=yt,se.parse=se;var ls=se.options,cs=se.setOptions,us=se.use,hs=se.walkTokens,ds=se.parseInline,ps=se,fs=je.parse,gs=He.lex;const ti=Object.freeze(Object.defineProperty({__proto__:null,Hooks:yt,Lexer:He,Marked:ei,Parser:je,Renderer:Ot,TextRenderer:ln,Tokenizer:Nt,get defaults(){return rt},getDefaults:nn,lexer:gs,marked:se,options:ls,parse:ps,parseInline:ds,parser:fs,setOptions:cs,use:us,walkTokens:hs},Symbol.toStringTag,{value:"Module"})),ni=`function O() {
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
`,ri=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",ni],{type:"text/javascript;charset=utf-8"});function ms(e){let t;try{if(t=ri&&(self.URL||self.webkitURL).createObjectURL(ri),!t)throw"";const n=new Worker(t,{type:"module",name:e?.name});return n.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(t)}),n}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(ni),{type:"module",name:e?.name})}}function cn(e){if(e.startsWith("---")){const t=e.indexOf(`
---`,3);if(t!==-1){const n=e.slice(3,t+0).trim(),i=e.slice(t+4).trimStart(),r={};return n.split(/\r?\n/).forEach(a=>{const s=a.match(/^([^:]+):\s*(.*)$/);s&&(r[s[1].trim()]=s[2].trim())}),{content:i,data:r}}}return{content:e,data:{}}}function ii(e){try{if(!e&&e!==0)return"";const t=String(e),n={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:" "};return t.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g,(i,r)=>{if(!r)return i;if(r[0]==="#")try{return r[1]==="x"||r[1]==="X"?String.fromCharCode(parseInt(r.slice(2),16)):String.fromCharCode(parseInt(r.slice(1),10))}catch{return i}return n[r]!==void 0?n[r]:i})}catch{return String(e||"")}}const qt=ti&&(se||ti)||void 0;let ze=null;const bs="https://cdn.jsdelivr.net/npm/highlight.js";async function un(){if(ze)return ze;try{try{const e=await import(bs+"/lib/core.js");ze=e.default||e}catch{ze=null}}catch{ze=null}return ze}qt&&typeof qt.setOptions=="function"&&qt.setOptions({gfm:!0,headerIds:!0,mangle:!1,highlighted:(e,t)=>{try{return ze&&t&&typeof ze.getLanguage=="function"&&ze.getLanguage(t)?ze.highlight(e,{language:t}).value:ze&&typeof ze.getLanguage=="function"&&ze.getLanguage("plaintext")?ze.highlight(e,{language:"plaintext"}).value:e}catch{return e}}}),onmessage=async e=>{const t=e.data||{};try{if(t.type==="register"){const{name:u,url:p}=t;try{if(!await un()){postMessage({type:"register-error",name:u,error:"hljs unavailable"});return}const h=await import(p),d=h.default||h;ze.registerLanguage(u,d),postMessage({type:"registered",name:u})}catch(g){postMessage({type:"register-error",name:u,error:String(g)})}return}if(t.type==="detect"){const u=t.md||"",p=t.supported||[],g=new Set,h=/```\s*([a-zA-Z0-9_\-+]+)?/g;let d;for(;d=h.exec(u);)if(d[1]){const f=String(d[1]).toLowerCase();if(!f)continue;if(f.length>=5&&f.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(f)&&g.add(f),new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]).has(f)&&g.add(f),p&&p.length)try{p.indexOf(f)!==-1&&g.add(f)}catch{}}postMessage({id:t.id,result:Array.from(g)});return}const{id:n,md:i}=t,{content:r,data:a}=cn(i||"");await un().catch(()=>{});let s=qt.parse(r);const c=[],o=new Map,l=u=>{try{return String(u||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}};s=s.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(u,p,g,h)=>{const d=Number(p);let f=h.replace(/<[^>]+>/g,"").trim();try{f=ii(f)}catch{}let m=null;const w=(g||"").match(/\sid="([^"]+)"/);w&&(m=w[1]);const y=m||l(f)||"heading",E=(o.get(y)||0)+1;o.set(y,E);const C=E===1?y:y+"-"+E;c.push({level:d,text:f,id:C});const B={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},H=d<=2?"has-text-weight-bold":d<=4?"has-text-weight-semibold":"has-text-weight-normal",R=(B[d]+" "+H).trim(),de=((g||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${C}" class="${R}"`).trim();return`<h${d} ${de}>${h}</h${d}>`}),s=s.replace(/<img([^>]*)>/g,(u,p)=>/\bloading=/.test(p)?`<img${p}>`:/\bdata-want-lazy=/.test(p)?`<img${p}>`:`<img${p} loading="lazy">`),postMessage({id:n,result:{html:s,meta:a||{},toc:c}})}catch(n){postMessage({id:t.id,error:String(n)})}};async function ws(e){try{if(e&&e.type==="register"){const{name:o,url:l}=e;try{if(!await un())return{type:"register-error",name:o,error:"hljs unavailable"};const p=await import(l),g=p.default||p;return ze.registerLanguage(o,g),{type:"registered",name:o}}catch(u){return{type:"register-error",name:o,error:String(u)}}}if(e&&e.type==="detect"){const o=e.md||"",l=e.supported||[],u=new Set,p=/``\`\s*([a-zA-Z0-9_\-+]+)?/g;let g;for(;g=p.exec(o);)if(g[1]){const h=String(g[1]).toLowerCase();if(!h)continue;if(h.length>=5&&h.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(h)&&u.add(h),new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]).has(h)&&u.add(h),l&&l.length)try{l.indexOf(h)!==-1&&u.add(h)}catch{}}return{id:e.id,result:Array.from(u)}}const t=e&&e.id,{content:n,data:i}=cn(e&&e.md||"");await un().catch(()=>{});let r=qt.parse(n);const a=[],s=new Map,c=o=>{try{return String(o||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}};return r=r.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(o,l,u,p)=>{const g=Number(l);let h=p.replace(/<[^>]+>/g,"").trim();try{h=ii(h)}catch{}let d=null;const f=(u||"").match(/\sid="([^"]+)"/);f&&(d=f[1]);const m=d||c(h)||"heading",y=(s.get(m)||0)+1;s.set(m,y);const k=y===1?m:m+"-"+y;a.push({level:g,text:h,id:k});const E={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},C=g<=2?"has-text-weight-bold":g<=4?"has-text-weight-semibold":"has-text-weight-normal",B=(E[g]+" "+C).trim(),R=((u||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${k}" class="${B}"`).trim();return`<h${g} ${R}>${p}</h${g}>`}),r=r.replace(/<img([^>]*)>/g,(o,l)=>/\bloading=/.test(l)?`<img${l}>`:/\bdata-want-lazy=/.test(l)?`<img${l}>`:`<img${l} loading="lazy">`),{id:t,result:{html:r,meta:i||{},toc:a}}}catch(t){return{id:e&&e.id,error:String(t)}}}const On={100:"💯",1234:"🔢",grinning:"😀",grimacing:"😬",grin:"😁",joy:"😂",rofl:"🤣",partying:"🥳",smiley:"😃",smile:"😄",sweat_smile:"😅",laughing:"😆",innocent:"😇",wink:"😉",blush:"😊",slightly_smiling_face:"🙂",upside_down_face:"🙃",relaxed:"☺️",yum:"😋",relieved:"😌",heart_eyes:"😍",smiling_face_with_three_hearts:"🥰",kissing_heart:"😘",kissing:"😗",kissing_smiling_eyes:"😙",kissing_closed_eyes:"😚",stuck_out_tongue_winking_eye:"😜",zany:"🤪",raised_eyebrow:"🤨",monocle:"🧐",stuck_out_tongue_closed_eyes:"😝",stuck_out_tongue:"😛",money_mouth_face:"🤑",nerd_face:"🤓",sunglasses:"😎",star_struck:"🤩",clown_face:"🤡",cowboy_hat_face:"🤠",hugs:"🤗",smirk:"😏",no_mouth:"😶",neutral_face:"😐",expressionless:"😑",unamused:"😒",roll_eyes:"🙄",thinking:"🤔",lying_face:"🤥",hand_over_mouth:"🤭",shushing:"🤫",symbols_over_mouth:"🤬",exploding_head:"🤯",flushed:"😳",disappointed:"😞",worried:"😟",angry:"😠",rage:"😡",pensive:"😔",confused:"😕",slightly_frowning_face:"🙁",frowning_face:"☹",persevere:"😣",confounded:"😖",tired_face:"😫",weary:"😩",pleading:"🥺",triumph:"😤",open_mouth:"😮",scream:"😱",fearful:"😨",cold_sweat:"😰",hushed:"😯",frowning:"😦",anguished:"😧",cry:"😢",disappointed_relieved:"😥",drooling_face:"🤤",sleepy:"😪",sweat:"😓",hot:"🥵",cold:"🥶",sob:"😭",dizzy_face:"😵",astonished:"😲",zipper_mouth_face:"🤐",nauseated_face:"🤢",sneezing_face:"🤧",vomiting:"🤮",mask:"😷",face_with_thermometer:"🤒",face_with_head_bandage:"🤕",woozy:"🥴",sleeping:"😴",zzz:"💤",poop:"💩",smiling_imp:"😈",imp:"👿",japanese_ogre:"👹",japanese_goblin:"👺",skull:"💀",ghost:"👻",alien:"👽",robot:"🤖",smiley_cat:"😺",smile_cat:"😸",joy_cat:"😹",heart_eyes_cat:"😻",smirk_cat:"😼",kissing_cat:"😽",scream_cat:"🙀",crying_cat_face:"😿",pouting_cat:"😾",palms_up:"🤲",raised_hands:"🙌",clap:"👏",wave:"👋",call_me_hand:"🤙","+1":"👍","-1":"👎",facepunch:"👊",fist:"✊",fist_left:"🤛",fist_right:"🤜",v:"✌",ok_hand:"👌",raised_hand:"✋",raised_back_of_hand:"🤚",open_hands:"👐",muscle:"💪",pray:"🙏",foot:"🦶",leg:"🦵",handshake:"🤝",point_up:"☝",point_up_2:"👆",point_down:"👇",point_left:"👈",point_right:"👉",fu:"🖕",raised_hand_with_fingers_splayed:"🖐",love_you:"🤟",metal:"🤘",crossed_fingers:"🤞",vulcan_salute:"🖖",writing_hand:"✍",selfie:"🤳",nail_care:"💅",lips:"👄",tooth:"🦷",tongue:"👅",ear:"👂",nose:"👃",eye:"👁",eyes:"👀",brain:"🧠",bust_in_silhouette:"👤",busts_in_silhouette:"👥",speaking_head:"🗣",baby:"👶",child:"🧒",boy:"👦",girl:"👧",adult:"🧑",man:"👨",woman:"👩",blonde_woman:"👱‍♀️",blonde_man:"👱",bearded_person:"🧔",older_adult:"🧓",older_man:"👴",older_woman:"👵",man_with_gua_pi_mao:"👲",woman_with_headscarf:"🧕",woman_with_turban:"👳‍♀️",man_with_turban:"👳",policewoman:"👮‍♀️",policeman:"👮",construction_worker_woman:"👷‍♀️",construction_worker_man:"👷",guardswoman:"💂‍♀️",guardsman:"💂",female_detective:"🕵️‍♀️",male_detective:"🕵",woman_health_worker:"👩‍⚕️",man_health_worker:"👨‍⚕️",woman_farmer:"👩‍🌾",man_farmer:"👨‍🌾",woman_cook:"👩‍🍳",man_cook:"👨‍🍳",woman_student:"👩‍🎓",man_student:"👨‍🎓",woman_singer:"👩‍🎤",man_singer:"👨‍🎤",woman_teacher:"👩‍🏫",man_teacher:"👨‍🏫",woman_factory_worker:"👩‍🏭",man_factory_worker:"👨‍🏭",woman_technologist:"👩‍💻",man_technologist:"👨‍💻",woman_office_worker:"👩‍💼",man_office_worker:"👨‍💼",woman_mechanic:"👩‍🔧",man_mechanic:"👨‍🔧",woman_scientist:"👩‍🔬",man_scientist:"👨‍🔬",woman_artist:"👩‍🎨",man_artist:"👨‍🎨",woman_firefighter:"👩‍🚒",man_firefighter:"👨‍🚒",woman_pilot:"👩‍✈️",man_pilot:"👨‍✈️",woman_astronaut:"👩‍🚀",man_astronaut:"👨‍🚀",woman_judge:"👩‍⚖️",man_judge:"👨‍⚖️",woman_superhero:"🦸‍♀️",man_superhero:"🦸‍♂️",woman_supervillain:"🦹‍♀️",man_supervillain:"🦹‍♂️",mrs_claus:"🤶",santa:"🎅",sorceress:"🧙‍♀️",wizard:"🧙‍♂️",woman_elf:"🧝‍♀️",man_elf:"🧝‍♂️",woman_vampire:"🧛‍♀️",man_vampire:"🧛‍♂️",woman_zombie:"🧟‍♀️",man_zombie:"🧟‍♂️",woman_genie:"🧞‍♀️",man_genie:"🧞‍♂️",mermaid:"🧜‍♀️",merman:"🧜‍♂️",woman_fairy:"🧚‍♀️",man_fairy:"🧚‍♂️",angel:"👼",pregnant_woman:"🤰",breastfeeding:"🤱",princess:"👸",prince:"🤴",bride_with_veil:"👰",man_in_tuxedo:"🤵",running_woman:"🏃‍♀️",running_man:"🏃",walking_woman:"🚶‍♀️",walking_man:"🚶",dancer:"💃",man_dancing:"🕺",dancing_women:"👯",dancing_men:"👯‍♂️",couple:"👫",two_men_holding_hands:"👬",two_women_holding_hands:"👭",bowing_woman:"🙇‍♀️",bowing_man:"🙇",man_facepalming:"🤦‍♂️",woman_facepalming:"🤦‍♀️",woman_shrugging:"🤷",man_shrugging:"🤷‍♂️",tipping_hand_woman:"💁",tipping_hand_man:"💁‍♂️",no_good_woman:"🙅",no_good_man:"🙅‍♂️",ok_woman:"🙆",ok_man:"🙆‍♂️",raising_hand_woman:"🙋",raising_hand_man:"🙋‍♂️",pouting_woman:"🙎",pouting_man:"🙎‍♂️",frowning_woman:"🙍",frowning_man:"🙍‍♂️",haircut_woman:"💇",haircut_man:"💇‍♂️",massage_woman:"💆",massage_man:"💆‍♂️",woman_in_steamy_room:"🧖‍♀️",man_in_steamy_room:"🧖‍♂️",couple_with_heart_woman_man:"💑",couple_with_heart_woman_woman:"👩‍❤️‍👩",couple_with_heart_man_man:"👨‍❤️‍👨",couplekiss_man_woman:"💏",couplekiss_woman_woman:"👩‍❤️‍💋‍👩",couplekiss_man_man:"👨‍❤️‍💋‍👨",family_man_woman_boy:"👪",family_man_woman_girl:"👨‍👩‍👧",family_man_woman_girl_boy:"👨‍👩‍👧‍👦",family_man_woman_boy_boy:"👨‍👩‍👦‍👦",family_man_woman_girl_girl:"👨‍👩‍👧‍👧",family_woman_woman_boy:"👩‍👩‍👦",family_woman_woman_girl:"👩‍👩‍👧",family_woman_woman_girl_boy:"👩‍👩‍👧‍👦",family_woman_woman_boy_boy:"👩‍👩‍👦‍👦",family_woman_woman_girl_girl:"👩‍👩‍👧‍👧",family_man_man_boy:"👨‍👨‍👦",family_man_man_girl:"👨‍👨‍👧",family_man_man_girl_boy:"👨‍👨‍👧‍👦",family_man_man_boy_boy:"👨‍👨‍👦‍👦",family_man_man_girl_girl:"👨‍👨‍👧‍👧",family_woman_boy:"👩‍👦",family_woman_girl:"👩‍👧",family_woman_girl_boy:"👩‍👧‍👦",family_woman_boy_boy:"👩‍👦‍👦",family_woman_girl_girl:"👩‍👧‍👧",family_man_boy:"👨‍👦",family_man_girl:"👨‍👧",family_man_girl_boy:"👨‍👧‍👦",family_man_boy_boy:"👨‍👦‍👦",family_man_girl_girl:"👨‍👧‍👧",yarn:"🧶",thread:"🧵",coat:"🧥",labcoat:"🥼",womans_clothes:"👚",tshirt:"👕",jeans:"👖",necktie:"👔",dress:"👗",bikini:"👙",kimono:"👘",lipstick:"💄",kiss:"💋",footprints:"👣",flat_shoe:"🥿",high_heel:"👠",sandal:"👡",boot:"👢",mans_shoe:"👞",athletic_shoe:"👟",hiking_boot:"🥾",socks:"🧦",gloves:"🧤",scarf:"🧣",womans_hat:"👒",tophat:"🎩",billed_hat:"🧢",rescue_worker_helmet:"⛑",mortar_board:"🎓",crown:"👑",school_satchel:"🎒",luggage:"🧳",pouch:"👝",purse:"👛",handbag:"👜",briefcase:"💼",eyeglasses:"👓",dark_sunglasses:"🕶",goggles:"🥽",ring:"💍",closed_umbrella:"🌂",dog:"🐶",cat:"🐱",mouse:"🐭",hamster:"🐹",rabbit:"🐰",fox_face:"🦊",bear:"🐻",panda_face:"🐼",koala:"🐨",tiger:"🐯",lion:"🦁",cow:"🐮",pig:"🐷",pig_nose:"🐽",frog:"🐸",squid:"🦑",octopus:"🐙",shrimp:"🦐",monkey_face:"🐵",gorilla:"🦍",see_no_evil:"🙈",hear_no_evil:"🙉",speak_no_evil:"🙊",monkey:"🐒",chicken:"🐔",penguin:"🐧",bird:"🐦",baby_chick:"🐤",hatching_chick:"🐣",hatched_chick:"🐥",duck:"🦆",eagle:"🦅",owl:"🦉",bat:"🦇",wolf:"🐺",boar:"🐗",horse:"🐴",unicorn:"🦄",honeybee:"🐝",bug:"🐛",butterfly:"🦋",snail:"🐌",beetle:"🐞",ant:"🐜",grasshopper:"🦗",spider:"🕷",scorpion:"🦂",crab:"🦀",snake:"🐍",lizard:"🦎","t-rex":"🦖",sauropod:"🦕",turtle:"🐢",tropical_fish:"🐠",fish:"🐟",blowfish:"🐡",dolphin:"🐬",shark:"🦈",whale:"🐳",whale2:"🐋",crocodile:"🐊",leopard:"🐆",zebra:"🦓",tiger2:"🐅",water_buffalo:"🐃",ox:"🐂",cow2:"🐄",deer:"🦌",dromedary_camel:"🐪",camel:"🐫",giraffe:"🦒",elephant:"🐘",rhinoceros:"🦏",goat:"🐐",ram:"🐏",sheep:"🐑",racehorse:"🐎",pig2:"🐖",rat:"🐀",mouse2:"🐁",rooster:"🐓",turkey:"🦃",dove:"🕊",dog2:"🐕",poodle:"🐩",cat2:"🐈",rabbit2:"🐇",chipmunk:"🐿",hedgehog:"🦔",raccoon:"🦝",llama:"🦙",hippopotamus:"🦛",kangaroo:"🦘",badger:"🦡",swan:"🦢",peacock:"🦚",parrot:"🦜",lobster:"🦞",mosquito:"🦟",paw_prints:"🐾",dragon:"🐉",dragon_face:"🐲",cactus:"🌵",christmas_tree:"🎄",evergreen_tree:"🌲",deciduous_tree:"🌳",palm_tree:"🌴",seedling:"🌱",herb:"🌿",shamrock:"☘",four_leaf_clover:"🍀",bamboo:"🎍",tanabata_tree:"🎋",leaves:"🍃",fallen_leaf:"🍂",maple_leaf:"🍁",ear_of_rice:"🌾",hibiscus:"🌺",sunflower:"🌻",rose:"🌹",wilted_flower:"🥀",tulip:"🌷",blossom:"🌼",cherry_blossom:"🌸",bouquet:"💐",mushroom:"🍄",chestnut:"🌰",jack_o_lantern:"🎃",shell:"🐚",spider_web:"🕸",earth_americas:"🌎",earth_africa:"🌍",earth_asia:"🌏",full_moon:"🌕",waning_gibbous_moon:"🌖",last_quarter_moon:"🌗",waning_crescent_moon:"🌘",new_moon:"🌑",waxing_crescent_moon:"🌒",first_quarter_moon:"🌓",waxing_gibbous_moon:"🌔",new_moon_with_face:"🌚",full_moon_with_face:"🌝",first_quarter_moon_with_face:"🌛",last_quarter_moon_with_face:"🌜",sun_with_face:"🌞",crescent_moon:"🌙",star:"⭐",star2:"🌟",dizzy:"💫",sparkles:"✨",comet:"☄",sunny:"☀️",sun_behind_small_cloud:"🌤",partly_sunny:"⛅",sun_behind_large_cloud:"🌥",sun_behind_rain_cloud:"🌦",cloud:"☁️",cloud_with_rain:"🌧",cloud_with_lightning_and_rain:"⛈",cloud_with_lightning:"🌩",zap:"⚡",fire:"🔥",boom:"💥",snowflake:"❄️",cloud_with_snow:"🌨",snowman:"⛄",snowman_with_snow:"☃",wind_face:"🌬",dash:"💨",tornado:"🌪",fog:"🌫",open_umbrella:"☂",umbrella:"☔",droplet:"💧",sweat_drops:"💦",ocean:"🌊",green_apple:"🍏",apple:"🍎",pear:"🍐",tangerine:"🍊",lemon:"🍋",banana:"🍌",watermelon:"🍉",grapes:"🍇",strawberry:"🍓",melon:"🍈",cherries:"🍒",peach:"🍑",pineapple:"🍍",coconut:"🥥",kiwi_fruit:"🥝",mango:"🥭",avocado:"🥑",broccoli:"🥦",tomato:"🍅",eggplant:"🍆",cucumber:"🥒",carrot:"🥕",hot_pepper:"🌶",potato:"🥔",corn:"🌽",leafy_greens:"🥬",sweet_potato:"🍠",peanuts:"🥜",honey_pot:"🍯",croissant:"🥐",bread:"🍞",baguette_bread:"🥖",bagel:"🥯",pretzel:"🥨",cheese:"🧀",egg:"🥚",bacon:"🥓",steak:"🥩",pancakes:"🥞",poultry_leg:"🍗",meat_on_bone:"🍖",bone:"🦴",fried_shrimp:"🍤",fried_egg:"🍳",hamburger:"🍔",fries:"🍟",stuffed_flatbread:"🥙",hotdog:"🌭",pizza:"🍕",sandwich:"🥪",canned_food:"🥫",spaghetti:"🍝",taco:"🌮",burrito:"🌯",green_salad:"🥗",shallow_pan_of_food:"🥘",ramen:"🍜",stew:"🍲",fish_cake:"🍥",fortune_cookie:"🥠",sushi:"🍣",bento:"🍱",curry:"🍛",rice_ball:"🍙",rice:"🍚",rice_cracker:"🍘",oden:"🍢",dango:"🍡",shaved_ice:"🍧",ice_cream:"🍨",icecream:"🍦",pie:"🥧",cake:"🍰",cupcake:"🧁",moon_cake:"🥮",birthday:"🎂",custard:"🍮",candy:"🍬",lollipop:"🍭",chocolate_bar:"🍫",popcorn:"🍿",dumpling:"🥟",doughnut:"🍩",cookie:"🍪",milk_glass:"🥛",beer:"🍺",beers:"🍻",clinking_glasses:"🥂",wine_glass:"🍷",tumbler_glass:"🥃",cocktail:"🍸",tropical_drink:"🍹",champagne:"🍾",sake:"🍶",tea:"🍵",cup_with_straw:"🥤",coffee:"☕",baby_bottle:"🍼",salt:"🧂",spoon:"🥄",fork_and_knife:"🍴",plate_with_cutlery:"🍽",bowl_with_spoon:"🥣",takeout_box:"🥡",chopsticks:"🥢",soccer:"⚽",basketball:"🏀",football:"🏈",baseball:"⚾",softball:"🥎",tennis:"🎾",volleyball:"🏐",rugby_football:"🏉",flying_disc:"🥏","8ball":"🎱",golf:"⛳",golfing_woman:"🏌️‍♀️",golfing_man:"🏌",ping_pong:"🏓",badminton:"🏸",goal_net:"🥅",ice_hockey:"🏒",field_hockey:"🏑",lacrosse:"🥍",cricket:"🏏",ski:"🎿",skier:"⛷",snowboarder:"🏂",person_fencing:"🤺",women_wrestling:"🤼‍♀️",men_wrestling:"🤼‍♂️",woman_cartwheeling:"🤸‍♀️",man_cartwheeling:"🤸‍♂️",woman_playing_handball:"🤾‍♀️",man_playing_handball:"🤾‍♂️",ice_skate:"⛸",curling_stone:"🥌",skateboard:"🛹",sled:"🛷",bow_and_arrow:"🏹",fishing_pole_and_fish:"🎣",boxing_glove:"🥊",martial_arts_uniform:"🥋",rowing_woman:"🚣‍♀️",rowing_man:"🚣",climbing_woman:"🧗‍♀️",climbing_man:"🧗‍♂️",swimming_woman:"🏊‍♀️",swimming_man:"🏊",woman_playing_water_polo:"🤽‍♀️",man_playing_water_polo:"🤽‍♂️",woman_in_lotus_position:"🧘‍♀️",man_in_lotus_position:"🧘‍♂️",surfing_woman:"🏄‍♀️",surfing_man:"🏄",bath:"🛀",basketball_woman:"⛹️‍♀️",basketball_man:"⛹",weight_lifting_woman:"🏋️‍♀️",weight_lifting_man:"🏋",biking_woman:"🚴‍♀️",biking_man:"🚴",mountain_biking_woman:"🚵‍♀️",mountain_biking_man:"🚵",horse_racing:"🏇",business_suit_levitating:"🕴",trophy:"🏆",running_shirt_with_sash:"🎽",medal_sports:"🏅",medal_military:"🎖","1st_place_medal":"🥇","2nd_place_medal":"🥈","3rd_place_medal":"🥉",reminder_ribbon:"🎗",rosette:"🏵",ticket:"🎫",tickets:"🎟",performing_arts:"🎭",art:"🎨",circus_tent:"🎪",woman_juggling:"🤹‍♀️",man_juggling:"🤹‍♂️",microphone:"🎤",headphones:"🎧",musical_score:"🎼",musical_keyboard:"🎹",drum:"🥁",saxophone:"🎷",trumpet:"🎺",guitar:"🎸",violin:"🎻",clapper:"🎬",video_game:"🎮",space_invader:"👾",dart:"🎯",game_die:"🎲",chess_pawn:"♟",slot_machine:"🎰",jigsaw:"🧩",bowling:"🎳",red_car:"🚗",taxi:"🚕",blue_car:"🚙",bus:"🚌",trolleybus:"🚎",racing_car:"🏎",police_car:"🚓",ambulance:"🚑",fire_engine:"🚒",minibus:"🚐",truck:"🚚",articulated_lorry:"🚛",tractor:"🚜",kick_scooter:"🛴",motorcycle:"🏍",bike:"🚲",motor_scooter:"🛵",rotating_light:"🚨",oncoming_police_car:"🚔",oncoming_bus:"🚍",oncoming_automobile:"🚘",oncoming_taxi:"🚖",aerial_tramway:"🚡",mountain_cableway:"🚠",suspension_railway:"🚟",railway_car:"🚃",train:"🚋",monorail:"🚝",bullettrain_side:"🚄",bullettrain_front:"🚅",light_rail:"🚈",mountain_railway:"🚞",steam_locomotive:"🚂",train2:"🚆",metro:"🚇",tram:"🚊",station:"🚉",flying_saucer:"🛸",helicopter:"🚁",small_airplane:"🛩",airplane:"✈️",flight_departure:"🛫",flight_arrival:"🛬",sailboat:"⛵",motor_boat:"🛥",speedboat:"🚤",ferry:"⛴",passenger_ship:"🛳",rocket:"🚀",artificial_satellite:"🛰",seat:"💺",canoe:"🛶",anchor:"⚓",construction:"🚧",fuelpump:"⛽",busstop:"🚏",vertical_traffic_light:"🚦",traffic_light:"🚥",checkered_flag:"🏁",ship:"🚢",ferris_wheel:"🎡",roller_coaster:"🎢",carousel_horse:"🎠",building_construction:"🏗",foggy:"🌁",tokyo_tower:"🗼",factory:"🏭",fountain:"⛲",rice_scene:"🎑",mountain:"⛰",mountain_snow:"🏔",mount_fuji:"🗻",volcano:"🌋",japan:"🗾",camping:"🏕",tent:"⛺",national_park:"🏞",motorway:"🛣",railway_track:"🛤",sunrise:"🌅",sunrise_over_mountains:"🌄",desert:"🏜",beach_umbrella:"🏖",desert_island:"🏝",city_sunrise:"🌇",city_sunset:"🌆",cityscape:"🏙",night_with_stars:"🌃",bridge_at_night:"🌉",milky_way:"🌌",stars:"🌠",sparkler:"🎇",fireworks:"🎆",rainbow:"🌈",houses:"🏘",european_castle:"🏰",japanese_castle:"🏯",stadium:"🏟",statue_of_liberty:"🗽",house:"🏠",house_with_garden:"🏡",derelict_house:"🏚",office:"🏢",department_store:"🏬",post_office:"🏣",european_post_office:"🏤",hospital:"🏥",bank:"🏦",hotel:"🏨",convenience_store:"🏪",school:"🏫",love_hotel:"🏩",wedding:"💒",classical_building:"🏛",church:"⛪",mosque:"🕌",synagogue:"🕍",kaaba:"🕋",shinto_shrine:"⛩",watch:"⌚",iphone:"📱",calling:"📲",computer:"💻",keyboard:"⌨",desktop_computer:"🖥",printer:"🖨",computer_mouse:"🖱",trackball:"🖲",joystick:"🕹",clamp:"🗜",minidisc:"💽",floppy_disk:"💾",cd:"💿",dvd:"📀",vhs:"📼",camera:"📷",camera_flash:"📸",video_camera:"📹",movie_camera:"🎥",film_projector:"📽",film_strip:"🎞",telephone_receiver:"📞",phone:"☎️",pager:"📟",fax:"📠",tv:"📺",radio:"📻",studio_microphone:"🎙",level_slider:"🎚",control_knobs:"🎛",compass:"🧭",stopwatch:"⏱",timer_clock:"⏲",alarm_clock:"⏰",mantelpiece_clock:"🕰",hourglass_flowing_sand:"⏳",hourglass:"⌛",satellite:"📡",battery:"🔋",electric_plug:"🔌",bulb:"💡",flashlight:"🔦",candle:"🕯",fire_extinguisher:"🧯",wastebasket:"🗑",oil_drum:"🛢",money_with_wings:"💸",dollar:"💵",yen:"💴",euro:"💶",pound:"💷",moneybag:"💰",credit_card:"💳",gem:"💎",balance_scale:"⚖",toolbox:"🧰",wrench:"🔧",hammer:"🔨",hammer_and_pick:"⚒",hammer_and_wrench:"🛠",pick:"⛏",nut_and_bolt:"🔩",gear:"⚙",brick:"🧱",chains:"⛓",magnet:"🧲",gun:"🔫",bomb:"💣",firecracker:"🧨",hocho:"🔪",dagger:"🗡",crossed_swords:"⚔",shield:"🛡",smoking:"🚬",skull_and_crossbones:"☠",coffin:"⚰",funeral_urn:"⚱",amphora:"🏺",crystal_ball:"🔮",prayer_beads:"📿",nazar_amulet:"🧿",barber:"💈",alembic:"⚗",telescope:"🔭",microscope:"🔬",hole:"🕳",pill:"💊",syringe:"💉",dna:"🧬",microbe:"🦠",petri_dish:"🧫",test_tube:"🧪",thermometer:"🌡",broom:"🧹",basket:"🧺",toilet_paper:"🧻",label:"🏷",bookmark:"🔖",toilet:"🚽",shower:"🚿",bathtub:"🛁",soap:"🧼",sponge:"🧽",lotion_bottle:"🧴",key:"🔑",old_key:"🗝",couch_and_lamp:"🛋",sleeping_bed:"🛌",bed:"🛏",door:"🚪",bellhop_bell:"🛎",teddy_bear:"🧸",framed_picture:"🖼",world_map:"🗺",parasol_on_ground:"⛱",moyai:"🗿",shopping:"🛍",shopping_cart:"🛒",balloon:"🎈",flags:"🎏",ribbon:"🎀",gift:"🎁",confetti_ball:"🎊",tada:"🎉",dolls:"🎎",wind_chime:"🎐",crossed_flags:"🎌",izakaya_lantern:"🏮",red_envelope:"🧧",email:"✉️",envelope_with_arrow:"📩",incoming_envelope:"📨","e-mail":"📧",love_letter:"💌",postbox:"📮",mailbox_closed:"📪",mailbox:"📫",mailbox_with_mail:"📬",mailbox_with_no_mail:"📭",package:"📦",postal_horn:"📯",inbox_tray:"📥",outbox_tray:"📤",scroll:"📜",page_with_curl:"📃",bookmark_tabs:"📑",receipt:"🧾",bar_chart:"📊",chart_with_upwards_trend:"📈",chart_with_downwards_trend:"📉",page_facing_up:"📄",date:"📅",calendar:"📆",spiral_calendar:"🗓",card_index:"📇",card_file_box:"🗃",ballot_box:"🗳",file_cabinet:"🗄",clipboard:"📋",spiral_notepad:"🗒",file_folder:"📁",open_file_folder:"📂",card_index_dividers:"🗂",newspaper_roll:"🗞",newspaper:"📰",notebook:"📓",closed_book:"📕",green_book:"📗",blue_book:"📘",orange_book:"📙",notebook_with_decorative_cover:"📔",ledger:"📒",books:"📚",open_book:"📖",safety_pin:"🧷",link:"🔗",paperclip:"📎",paperclips:"🖇",scissors:"✂️",triangular_ruler:"📐",straight_ruler:"📏",abacus:"🧮",pushpin:"📌",round_pushpin:"📍",triangular_flag_on_post:"🚩",white_flag:"🏳",black_flag:"🏴",rainbow_flag:"🏳️‍🌈",closed_lock_with_key:"🔐",lock:"🔒",unlock:"🔓",lock_with_ink_pen:"🔏",pen:"🖊",fountain_pen:"🖋",black_nib:"✒️",memo:"📝",pencil2:"✏️",crayon:"🖍",paintbrush:"🖌",mag:"🔍",mag_right:"🔎",heart:"❤️",orange_heart:"🧡",yellow_heart:"💛",green_heart:"💚",blue_heart:"💙",purple_heart:"💜",black_heart:"🖤",broken_heart:"💔",heavy_heart_exclamation:"❣",two_hearts:"💕",revolving_hearts:"💞",heartbeat:"💓",heartpulse:"💗",sparkling_heart:"💖",cupid:"💘",gift_heart:"💝",heart_decoration:"💟",peace_symbol:"☮",latin_cross:"✝",star_and_crescent:"☪",om:"🕉",wheel_of_dharma:"☸",star_of_david:"✡",six_pointed_star:"🔯",menorah:"🕎",yin_yang:"☯",orthodox_cross:"☦",place_of_worship:"🛐",ophiuchus:"⛎",aries:"♈",taurus:"♉",gemini:"♊",cancer:"♋",leo:"♌",virgo:"♍",libra:"♎",scorpius:"♏",sagittarius:"♐",capricorn:"♑",aquarius:"♒",pisces:"♓",id:"🆔",atom_symbol:"⚛",u7a7a:"🈳",u5272:"🈹",radioactive:"☢",biohazard:"☣",mobile_phone_off:"📴",vibration_mode:"📳",u6709:"🈶",u7121:"🈚",u7533:"🈸",u55b6:"🈺",u6708:"🈷️",eight_pointed_black_star:"✴️",vs:"🆚",accept:"🉑",white_flower:"💮",ideograph_advantage:"🉐",secret:"㊙️",congratulations:"㊗️",u5408:"🈴",u6e80:"🈵",u7981:"🈲",a:"🅰️",b:"🅱️",ab:"🆎",cl:"🆑",o2:"🅾️",sos:"🆘",no_entry:"⛔",name_badge:"📛",no_entry_sign:"🚫",x:"❌",o:"⭕",stop_sign:"🛑",anger:"💢",hotsprings:"♨️",no_pedestrians:"🚷",do_not_litter:"🚯",no_bicycles:"🚳","non-potable_water":"🚱",underage:"🔞",no_mobile_phones:"📵",exclamation:"❗",grey_exclamation:"❕",question:"❓",grey_question:"❔",bangbang:"‼️",interrobang:"⁉️",low_brightness:"🔅",high_brightness:"🔆",trident:"🔱",fleur_de_lis:"⚜",part_alternation_mark:"〽️",warning:"⚠️",children_crossing:"🚸",beginner:"🔰",recycle:"♻️",u6307:"🈯",chart:"💹",sparkle:"❇️",eight_spoked_asterisk:"✳️",negative_squared_cross_mark:"❎",white_check_mark:"✅",diamond_shape_with_a_dot_inside:"💠",cyclone:"🌀",loop:"➿",globe_with_meridians:"🌐",m:"Ⓜ️",atm:"🏧",sa:"🈂️",passport_control:"🛂",customs:"🛃",baggage_claim:"🛄",left_luggage:"🛅",wheelchair:"♿",no_smoking:"🚭",wc:"🚾",parking:"🅿️",potable_water:"🚰",mens:"🚹",womens:"🚺",baby_symbol:"🚼",restroom:"🚻",put_litter_in_its_place:"🚮",cinema:"🎦",signal_strength:"📶",koko:"🈁",ng:"🆖",ok:"🆗",up:"🆙",cool:"🆒",new:"🆕",free:"🆓",zero:"0️⃣",one:"1️⃣",two:"2️⃣",three:"3️⃣",four:"4️⃣",five:"5️⃣",six:"6️⃣",seven:"7️⃣",eight:"8️⃣",nine:"9️⃣",keycap_ten:"🔟",asterisk:"*⃣",eject_button:"⏏️",arrow_forward:"▶️",pause_button:"⏸",next_track_button:"⏭",stop_button:"⏹",record_button:"⏺",play_or_pause_button:"⏯",previous_track_button:"⏮",fast_forward:"⏩",rewind:"⏪",twisted_rightwards_arrows:"🔀",repeat:"🔁",repeat_one:"🔂",arrow_backward:"◀️",arrow_up_small:"🔼",arrow_down_small:"🔽",arrow_double_up:"⏫",arrow_double_down:"⏬",arrow_right:"➡️",arrow_left:"⬅️",arrow_up:"⬆️",arrow_down:"⬇️",arrow_upper_right:"↗️",arrow_lower_right:"↘️",arrow_lower_left:"↙️",arrow_upper_left:"↖️",arrow_up_down:"↕️",left_right_arrow:"↔️",arrows_counterclockwise:"🔄",arrow_right_hook:"↪️",leftwards_arrow_with_hook:"↩️",arrow_heading_up:"⤴️",arrow_heading_down:"⤵️",hash:"#️⃣",information_source:"ℹ️",abc:"🔤",abcd:"🔡",capital_abcd:"🔠",symbols:"🔣",musical_note:"🎵",notes:"🎶",wavy_dash:"〰️",curly_loop:"➰",heavy_check_mark:"✔️",arrows_clockwise:"🔃",heavy_plus_sign:"➕",heavy_minus_sign:"➖",heavy_division_sign:"➗",heavy_multiplication_x:"✖️",infinity:"♾",heavy_dollar_sign:"💲",currency_exchange:"💱",copyright:"©️",registered:"®️",tm:"™️",end:"🔚",back:"🔙",on:"🔛",top:"🔝",soon:"🔜",ballot_box_with_check:"☑️",radio_button:"🔘",white_circle:"⚪",black_circle:"⚫",red_circle:"🔴",large_blue_circle:"🔵",small_orange_diamond:"🔸",small_blue_diamond:"🔹",large_orange_diamond:"🔶",large_blue_diamond:"🔷",small_red_triangle:"🔺",black_small_square:"▪️",white_small_square:"▫️",black_large_square:"⬛",white_large_square:"⬜",small_red_triangle_down:"🔻",black_medium_square:"◼️",white_medium_square:"◻️",black_medium_small_square:"◾",white_medium_small_square:"◽",black_square_button:"🔲",white_square_button:"🔳",speaker:"🔈",sound:"🔉",loud_sound:"🔊",mute:"🔇",mega:"📣",loudspeaker:"📢",bell:"🔔",no_bell:"🔕",black_joker:"🃏",mahjong:"🀄",spades:"♠️",clubs:"♣️",hearts:"♥️",diamonds:"♦️",flower_playing_cards:"🎴",thought_balloon:"💭",right_anger_bubble:"🗯",speech_balloon:"💬",left_speech_bubble:"🗨",clock1:"🕐",clock2:"🕑",clock3:"🕒",clock4:"🕓",clock5:"🕔",clock6:"🕕",clock7:"🕖",clock8:"🕗",clock9:"🕘",clock10:"🕙",clock11:"🕚",clock12:"🕛",clock130:"🕜",clock230:"🕝",clock330:"🕞",clock430:"🕟",clock530:"🕠",clock630:"🕡",clock730:"🕢",clock830:"🕣",clock930:"🕤",clock1030:"🕥",clock1130:"🕦",clock1230:"🕧",afghanistan:"🇦🇫",aland_islands:"🇦🇽",albania:"🇦🇱",algeria:"🇩🇿",american_samoa:"🇦🇸",andorra:"🇦🇩",angola:"🇦🇴",anguilla:"🇦🇮",antarctica:"🇦🇶",antigua_barbuda:"🇦🇬",argentina:"🇦🇷",armenia:"🇦🇲",aruba:"🇦🇼",australia:"🇦🇺",austria:"🇦🇹",azerbaijan:"🇦🇿",bahamas:"🇧🇸",bahrain:"🇧🇭",bangladesh:"🇧🇩",barbados:"🇧🇧",belarus:"🇧🇾",belgium:"🇧🇪",belize:"🇧🇿",benin:"🇧🇯",bermuda:"🇧🇲",bhutan:"🇧🇹",bolivia:"🇧🇴",caribbean_netherlands:"🇧🇶",bosnia_herzegovina:"🇧🇦",botswana:"🇧🇼",brazil:"🇧🇷",british_indian_ocean_territory:"🇮🇴",british_virgin_islands:"🇻🇬",brunei:"🇧🇳",bulgaria:"🇧🇬",burkina_faso:"🇧🇫",burundi:"🇧🇮",cape_verde:"🇨🇻",cambodia:"🇰🇭",cameroon:"🇨🇲",canada:"🇨🇦",canary_islands:"🇮🇨",cayman_islands:"🇰🇾",central_african_republic:"🇨🇫",chad:"🇹🇩",chile:"🇨🇱",cn:"🇨🇳",christmas_island:"🇨🇽",cocos_islands:"🇨🇨",colombia:"🇨🇴",comoros:"🇰🇲",congo_brazzaville:"🇨🇬",congo_kinshasa:"🇨🇩",cook_islands:"🇨🇰",costa_rica:"🇨🇷",croatia:"🇭🇷",cuba:"🇨🇺",curacao:"🇨🇼",cyprus:"🇨🇾",czech_republic:"🇨🇿",denmark:"🇩🇰",djibouti:"🇩🇯",dominica:"🇩🇲",dominican_republic:"🇩🇴",ecuador:"🇪🇨",egypt:"🇪🇬",el_salvador:"🇸🇻",equatorial_guinea:"🇬🇶",eritrea:"🇪🇷",estonia:"🇪🇪",ethiopia:"🇪🇹",eu:"🇪🇺",falkland_islands:"🇫🇰",faroe_islands:"🇫🇴",fiji:"🇫🇯",finland:"🇫🇮",fr:"🇫🇷",french_guiana:"🇬🇫",french_polynesia:"🇵🇫",french_southern_territories:"🇹🇫",gabon:"🇬🇦",gambia:"🇬🇲",georgia:"🇬🇪",de:"🇩🇪",ghana:"🇬🇭",gibraltar:"🇬🇮",greece:"🇬🇷",greenland:"🇬🇱",grenada:"🇬🇩",guadeloupe:"🇬🇵",guam:"🇬🇺",guatemala:"🇬🇹",guernsey:"🇬🇬",guinea:"🇬🇳",guinea_bissau:"🇬🇼",guyana:"🇬🇾",haiti:"🇭🇹",honduras:"🇭🇳",hong_kong:"🇭🇰",hungary:"🇭🇺",iceland:"🇮🇸",india:"🇮🇳",indonesia:"🇮🇩",iran:"🇮🇷",iraq:"🇮🇶",ireland:"🇮🇪",isle_of_man:"🇮🇲",israel:"🇮🇱",it:"🇮🇹",cote_divoire:"🇨🇮",jamaica:"🇯🇲",jp:"🇯🇵",jersey:"🇯🇪",jordan:"🇯🇴",kazakhstan:"🇰🇿",kenya:"🇰🇪",kiribati:"🇰🇮",kosovo:"🇽🇰",kuwait:"🇰🇼",kyrgyzstan:"🇰🇬",laos:"🇱🇦",latvia:"🇱🇻",lebanon:"🇱🇧",lesotho:"🇱🇸",liberia:"🇱🇷",libya:"🇱🇾",liechtenstein:"🇱🇮",lithuania:"🇱🇹",luxembourg:"🇱🇺",macau:"🇲🇴",macedonia:"🇲🇰",madagascar:"🇲🇬",malawi:"🇲🇼",malaysia:"🇲🇾",maldives:"🇲🇻",mali:"🇲🇱",malta:"🇲🇹",marshall_islands:"🇲🇭",martinique:"🇲🇶",mauritania:"🇲🇷",mauritius:"🇲🇺",mayotte:"🇾🇹",mexico:"🇲🇽",micronesia:"🇫🇲",moldova:"🇲🇩",monaco:"🇲🇨",mongolia:"🇲🇳",montenegro:"🇲🇪",montserrat:"🇲🇸",morocco:"🇲🇦",mozambique:"🇲🇿",myanmar:"🇲🇲",namibia:"🇳🇦",nauru:"🇳🇷",nepal:"🇳🇵",netherlands:"🇳🇱",new_caledonia:"🇳🇨",new_zealand:"🇳🇿",nicaragua:"🇳🇮",niger:"🇳🇪",nigeria:"🇳🇬",niue:"🇳🇺",norfolk_island:"🇳🇫",northern_mariana_islands:"🇲🇵",north_korea:"🇰🇵",norway:"🇳🇴",oman:"🇴🇲",pakistan:"🇵🇰",palau:"🇵🇼",palestinian_territories:"🇵🇸",panama:"🇵🇦",papua_new_guinea:"🇵🇬",paraguay:"🇵🇾",peru:"🇵🇪",philippines:"🇵🇭",pitcairn_islands:"🇵🇳",poland:"🇵🇱",portugal:"🇵🇹",puerto_rico:"🇵🇷",qatar:"🇶🇦",reunion:"🇷🇪",romania:"🇷🇴",ru:"🇷🇺",rwanda:"🇷🇼",st_barthelemy:"🇧🇱",st_helena:"🇸🇭",st_kitts_nevis:"🇰🇳",st_lucia:"🇱🇨",st_pierre_miquelon:"🇵🇲",st_vincent_grenadines:"🇻🇨",samoa:"🇼🇸",san_marino:"🇸🇲",sao_tome_principe:"🇸🇹",saudi_arabia:"🇸🇦",senegal:"🇸🇳",serbia:"🇷🇸",seychelles:"🇸🇨",sierra_leone:"🇸🇱",singapore:"🇸🇬",sint_maarten:"🇸🇽",slovakia:"🇸🇰",slovenia:"🇸🇮",solomon_islands:"🇸🇧",somalia:"🇸🇴",south_africa:"🇿🇦",south_georgia_south_sandwich_islands:"🇬🇸",kr:"🇰🇷",south_sudan:"🇸🇸",es:"🇪🇸",sri_lanka:"🇱🇰",sudan:"🇸🇩",suriname:"🇸🇷",swaziland:"🇸🇿",sweden:"🇸🇪",switzerland:"🇨🇭",syria:"🇸🇾",taiwan:"🇹🇼",tajikistan:"🇹🇯",tanzania:"🇹🇿",thailand:"🇹🇭",timor_leste:"🇹🇱",togo:"🇹🇬",tokelau:"🇹🇰",tonga:"🇹🇴",trinidad_tobago:"🇹🇹",tunisia:"🇹🇳",tr:"🇹🇷",turkmenistan:"🇹🇲",turks_caicos_islands:"🇹🇨",tuvalu:"🇹🇻",uganda:"🇺🇬",ukraine:"🇺🇦",united_arab_emirates:"🇦🇪",uk:"🇬🇧",england:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",scotland:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",wales:"🏴󠁧󠁢󠁷󠁬󠁳󠁿",us:"🇺🇸",us_virgin_islands:"🇻🇮",uruguay:"🇺🇾",uzbekistan:"🇺🇿",vanuatu:"🇻🇺",vatican_city:"🇻🇦",venezuela:"🇻🇪",vietnam:"🇻🇳",wallis_futuna:"🇼🇫",western_sahara:"🇪🇭",yemen:"🇾🇪",zambia:"🇿🇲",zimbabwe:"🇿🇼",united_nations:"🇺🇳",pirate_flag:"🏴‍☠️"},ys=typeof navigator<"u"&&navigator.hardwareConcurrency?Math.max(1,Math.floor(navigator.hardwareConcurrency/2)):2;function ks(){if(typeof Worker<"u")try{return new ms}catch{}const e={message:[],error:[]};return{addEventListener(n,i){e[n]||(e[n]=[]),e[n].push(i)},removeEventListener(n,i){if(!e[n])return;const r=e[n].indexOf(i);r!==-1&&e[n].splice(r,1)},postMessage(n){setTimeout(async()=>{try{const r={data:await ws(n)}(e.message||[]).forEach(a=>a(r))}catch{const r={data:{id:n&&n.id}}(e.message||[]).forEach(a=>a(r))}},0)},terminate(){Object.keys(e).forEach(n=>e[n].length=0)}}}const ai=gr(()=>ks(),"markdown",ys),si=typeof DOMParser<"u"?new DOMParser:null,ct=()=>ai.get(),qn=e=>ai.send(e,3e3),Ze=[];function Dn(e){if(e&&(typeof e=="object"||typeof e=="function")){Ze.push(e);try{se.use(e)}catch(t){console.warn("[markdown] failed to apply plugin",t)}}}function _s(e){Ze.length=0,Array.isArray(e)&&Ze.push(...e.filter(t=>t&&typeof t=="object"));try{Ze.forEach(t=>se.use(t))}catch(t){console.warn("[markdown] failed to apply markdown extensions",t)}}async function hn(e){if(Ze&&Ze.length){let{content:i,data:r}=cn(e||"");try{i=String(i||"").replace(/:([^:\s]+):/g,(s,c)=>On[c]||s)}catch{}se.setOptions({gfm:!0,mangle:!1,headerIds:!1,headerPrefix:""});try{Ze.forEach(s=>se.use(s))}catch(s){console.warn("[markdown] apply plugins failed",s)}const a=se.parse(i);try{const s=si||(typeof DOMParser<"u"?new DOMParser:null);if(s){const c=s.parseFromString(a,"text/html"),o=c.querySelectorAll("h1,h2,h3,h4,h5,h6"),l=[],u=new Set,p=h=>{try{return String(h||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}},g=h=>{const d={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},f=h<=2?"has-text-weight-bold":h<=4?"has-text-weight-semibold":"has-text-weight-normal";return(d[h]+" "+f).trim()};o.forEach(h=>{try{const d=Number(h.tagName.substring(1)),f=(h.textContent||"").trim();let m=p(f)||"heading",w=m,y=2;for(;u.has(w);)w=m+"-"+y,y+=1;u.add(w),h.id=w,h.className=g(d),l.push({level:d,text:f,id:w})}catch{}});try{c.querySelectorAll("img").forEach(h=>{try{const d=h.getAttribute&&h.getAttribute("loading"),f=h.getAttribute&&h.getAttribute("data-want-lazy");!d&&!f&&h.setAttribute&&h.setAttribute("loading","lazy")}catch{}})}catch{}try{c.querySelectorAll("pre code, code[class]").forEach(h=>{try{const d=h.getAttribute&&h.getAttribute("class")||h.className||"",f=String(d||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(f)try{h.setAttribute&&h.setAttribute("class",f)}catch{h.className=f}else try{h.removeAttribute&&h.removeAttribute("class")}catch{h.className=""}}catch{}})}catch{}return{html:c.body.innerHTML,meta:r||{},toc:l}}}catch{}return{html:a,meta:r||{},toc:[]}}let t;if(typeof process<"u"&&process.env&&process.env.VITEST)try{const i=await Promise.resolve().then(()=>oi);t=i.initRendererWorker&&i.initRendererWorker()}catch{t=ct&&ct()}else t=ct&&ct();try{e=String(e||"").replace(/:([^:\s]+):/g,(i,r)=>On[r]||i)}catch{}try{if(typeof ue<"u"&&ue&&typeof ue.getLanguage=="function"&&ue.getLanguage("plaintext")&&/```\s*\n/.test(String(e||""))){let{content:i,data:r}=cn(e||"");try{i=String(i||"").replace(/:([^:\s]+):/g,(l,u)=>On[u]||l)}catch{}se.setOptions({gfm:!0,headerIds:!0,mangle:!1,highlighted:(l,u)=>{try{return u&&ue.getLanguage&&ue.getLanguage(u)?ue.highlight(l,{language:u}).value:ue&&typeof ue.getLanguage=="function"&&ue.getLanguage("plaintext")?ue.highlight(l,{language:"plaintext"}).value:l}catch{return l}}});let a=se.parse(i);try{a=a.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g,(l,u)=>{try{if(u&&ue&&typeof ue.highlight=="function")try{const p=ue.highlight(u,{language:"plaintext"});return`<pre><code>${p&&p.value?p.value:p}</code></pre>`}catch{try{if(ue&&typeof ue.highlightElement=="function"){const g={innerHTML:u};return ue.highlightElement(g),`<pre><code>${g.innerHTML}</code></pre>`}}catch{}}}catch{}return l})}catch{}const s=[],c=new Set,o=l=>{try{return String(l||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}};return a=a.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(l,u,p,g)=>{const h=Number(u),d=g.replace(/<[^>]+>/g,"").trim();let f=o(d)||"heading",m=f,w=2;for(;c.has(m);)m=f+"-"+w,w+=1;c.add(m),s.push({level:h,text:d,id:m});const y={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},k=h<=2?"has-text-weight-bold":h<=4?"has-text-weight-semibold":"has-text-weight-normal",E=(y[h]+" "+k).trim(),B=((p||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${m}" class="${E}"`).trim();return`<h${h} ${B}>${g}</h${h}>`}),a=a.replace(/<img([^>]*)>/g,(l,u)=>/\bloading=/.test(u)?`<img${u}>`:/\bdata-want-lazy=/.test(u)?`<img${u}>`:`<img${u} loading="lazy">`),{html:a,meta:r||{},toc:s}}}catch{}if(!t)throw new Error("renderer worker required but unavailable");const n=await qn({type:"render",md:e});if(!n||typeof n!="object"||n.html===void 0)throw new Error("renderer worker returned invalid response");try{const i=new Map,r=[],a=o=>{try{return String(o||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}},s=o=>{const l={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},u=o<=2?"has-text-weight-bold":o<=4?"has-text-weight-semibold":"has-text-weight-normal";return(l[o]+" "+u).trim()};let c=n.html;c=c.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(o,l,u,p)=>{const g=Number(l),h=p.replace(/<[^>]+>/g,"").trim(),d=(u||"").match(/\sid="([^"]+)"/),f=d?d[1]:a(h)||"heading",w=(i.get(f)||0)+1;i.set(f,w);const y=w===1?f:f+"-"+w;r.push({level:g,text:h,id:y});const k=s(g),C=((u||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${y}" class="${k}"`).trim();return`<h${g} ${C}>${p}</h${g}>`});try{const o=typeof document<"u"&&document.documentElement&&document.documentElement.getAttribute&&document.documentElement.getAttribute("data-nimbi-logo-moved")||"";if(o){const l=si||(typeof DOMParser<"u"?new DOMParser:null);if(l){const u=l.parseFromString(c,"text/html");u.querySelectorAll("img").forEach(g=>{try{const h=g.getAttribute("src")||"";(h?new URL(h,location.href).toString():"")===o&&g.remove()}catch{}}),c=u.body.innerHTML}else try{const u=o.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");c=c.replace(new RegExp(`<img[^>]*src=\\"${u}\\"[^>]*>`,"g"),"")}catch{}}}catch{}return{html:c,meta:n.meta||{},toc:r}}catch{return{html:n.html,meta:n.meta||{},toc:n.toc||[]}}}function Dt(e,t){const n=new Set,i=/```\s*([a-zA-Z0-9_\-+]+)?/g,r=new Set(["then","now","if","once","so","and","or","but","when","the","a","an","as","let","const","var","export","import","from","true","false","null","npm","run","echo","sudo","this","that","have","using","some","return","returns","function","console","log","error","warn","class","new","undefined","with","select","from","where","join","on","group","order","by","having","as","into","values","like","limit","offset","create","table","index","view","insert","update","delete","returning","and","or","not","all","any","exists","case","when","then","else","end","distance","geometry","you","which","would","why","cool","other","same","everything","check"]),a=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);let s;for(;s=i.exec(e);)if(s[1]){const c=s[1].toLowerCase();if(_n.has(c)||t&&t.size&&c.length<3&&!t.has(c)&&!(Ne&&Ne[c]&&t.has(Ne[c])))continue;if(t&&t.size){if(t.has(c)){const l=t.get(c);l&&n.add(l);continue}if(Ne&&Ne[c]){const l=Ne[c];if(t.has(l)){const u=t.get(l)||l;n.add(u);continue}}}(a.has(c)||c.length>=5&&c.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(c)&&!r.has(c))&&n.add(c)}return n}async function Hn(e,t){if(Ze&&Ze.length||typeof process<"u"&&process.env&&process.env.VITEST)return Dt(e||"",t);if(ct&&ct())try{const i=t&&t.size?Array.from(t.keys()):[],r=await qn({type:"detect",md:String(e||""),supported:i});if(Array.isArray(r))return new Set(r)}catch(i){console.warn("[markdown] detectFenceLanguagesAsync worker failed",i)}return Dt(e||"",t)}const oi=Object.freeze(Object.defineProperty({__proto__:null,_sendToRenderer:qn,addMarkdownExtension:Dn,detectFenceLanguages:Dt,detectFenceLanguagesAsync:Hn,initRendererWorker:ct,markdownPlugins:Ze,parseMarkdownToHtml:hn,setMarkdownExtensions:_s},Symbol.toStringTag,{value:"Module"})),xs=`import { _rewriteAnchors } from '../htmlBuilder.js'

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
        await _rewriteAnchors(article, contentBase, pagePath)
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
        await _rewriteAnchors(article, contentBase, pagePath)
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
`;onmessage=async e=>{const t=e.data||{};try{if(t.type==="rewriteAnchors"){const{id:n,html:i,contentBase:r,pagePath:a}=t;try{const c=new DOMParser().parseFromString(i||"","text/html"),o=c.body;await Un(o,r,a),postMessage({id:n,result:c.body.innerHTML})}catch(s){postMessage({id:n,error:String(s)})}return}}catch(n){postMessage({id:t.id,error:String(n)})}};async function Ss(e){try{if(e&&e.type==="rewriteAnchors"){const{id:t,html:n,contentBase:i,pagePath:r}=e;try{const s=new DOMParser().parseFromString(n||"","text/html"),c=s.body;return await Un(c,i,r),{id:t,result:s.body.innerHTML}}catch(a){return{id:t,error:String(a)}}}return{id:e&&e.id,error:"unsupported message"}}catch(t){return{id:e&&e.id,error:String(t)}}}const vs=typeof globalThis<"u"&&typeof globalThis.__nimbiCMSDebug<"u"?!!globalThis.__nimbiCMSDebug:!1;function As(...e){try{vs&&console&&typeof console.warn=="function"&&console.warn(...e)}catch{}}function Es(e,t){try{return new URL(e,t).pathname}catch{try{return new URL(e,typeof location<"u"?location.href:"http://localhost/").pathname}catch{try{return(String(t||"").replace(/\/$/,"")+"/"+String(e||"").replace(/^\//,"")).replace(/\/\\+/g,"/")}catch{return String(e||"")}}}}function Ls(e,t){const n=document.createElement("aside");n.className="menu box nimbi-nav";const i=document.createElement("p");i.className="menu-label",i.textContent=e("navigation"),n.appendChild(i);const r=document.createElement("ul");return r.className="menu-list",t.forEach(a=>{const s=document.createElement("li"),c=document.createElement("a");if(c.href="#"+a.path,c.textContent=a.name,s.appendChild(c),a.children&&a.children.length){const o=document.createElement("ul");a.children.forEach(l=>{const u=document.createElement("li"),p=document.createElement("a");p.href="#"+l.path,p.textContent=l.name,u.appendChild(p),o.appendChild(u)}),s.appendChild(o)}r.appendChild(s)}),n.appendChild(r),n}function Ts(e,t,n=""){const i=document.createElement("aside");i.className="menu box nimbi-toc-inner is-hidden-mobile";const r=document.createElement("p");r.className="menu-label",r.textContent=e("onThisPage"),i.appendChild(r);const a=document.createElement("ul");a.className="menu-list";try{const c={};(t||[]).forEach(o=>{try{if(!o||o.level===1)return;const l=Number(o.level)>=2?Number(o.level):2,u=document.createElement("li"),p=document.createElement("a"),g=Vi(o.text||""),h=o.id||ge(g);p.textContent=g;try{const w=String(n||"").replace(/^[\\.\\/]+/,""),y=w&&W&&W.has&&W.has(w)?W.get(w):w;y?p.href=_e(y,h):p.href=`#${encodeURIComponent(h)}`}catch(w){console.warn("[htmlBuilder] buildTocElement href normalization failed",w),p.href=`#${encodeURIComponent(h)}`}if(u.appendChild(p),l===2){a.appendChild(u),c[2]=u,Object.keys(c).forEach(w=>{Number(w)>2&&delete c[w]});return}let d=l-1;for(;d>2&&!c[d];)d--;d<2&&(d=2);let f=c[d];if(!f){a.appendChild(u),c[l]=u;return}let m=f.querySelector("ul");m||(m=document.createElement("ul"),f.appendChild(m)),m.appendChild(u),c[l]=u}catch(l){console.warn("[htmlBuilder] buildTocElement item failed",l,o)}})}catch(c){console.warn("[htmlBuilder] buildTocElement failed",c)}return i.appendChild(a),a.querySelectorAll("li").length<=1?null:i}function li(e){e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(n=>{n.id||(n.id=ge(n.textContent||""))})}function Cs(e,t,n){try{const i=e.querySelectorAll("img");if(i&&i.length){const r=t&&t.includes("/")?t.substring(0,t.lastIndexOf("/")+1):"";i.forEach(a=>{const s=a.getAttribute("src")||"";if(s&&!(/^(https?:)?\/\//.test(s)||s.startsWith("/")))try{const c=new URL(r+s,n).toString();a.src=c;try{a.getAttribute("loading")||a.setAttribute("data-want-lazy","1")}catch(o){console.warn("[htmlBuilder] set image loading attribute failed",o)}}catch(c){console.warn("[htmlBuilder] resolve image src failed",c)}})}}catch(i){console.warn("[htmlBuilder] lazyLoadImages failed",i)}}function ci(e,t,n){try{const i=t&&t.includes("/")?t.substring(0,t.lastIndexOf("/")+1):"";let r=null;try{const s=new URL(n,location.href);r=new URL(i||".",s).toString()}catch{try{r=new URL(i||".",location.href).toString()}catch{r=i||"./"}}const a=e.querySelectorAll("*");for(const s of Array.from(a||[]))try{const c=s.tagName?s.tagName.toLowerCase():"",o=l=>{try{const u=s.getAttribute(l)||"";if(!u||/^(https?:)?\/\//i.test(u)||u.startsWith("/")||u.startsWith("#"))return;try{s.setAttribute(l,new URL(u,r).toString())}catch(p){console.warn("[htmlBuilder] rewrite asset attribute failed",l,u,p)}}catch(u){console.warn("[htmlBuilder] rewriteAttr failed",u)}};if(s.hasAttribute&&s.hasAttribute("src")&&o("src"),s.hasAttribute&&s.hasAttribute("href")&&c!=="a"&&o("href"),s.hasAttribute&&s.hasAttribute("xlink:href")&&o("xlink:href"),s.hasAttribute&&s.hasAttribute("poster")&&o("poster"),s.hasAttribute("srcset")){const p=(s.getAttribute("srcset")||"").split(",").map(g=>g.trim()).filter(Boolean).map(g=>{const[h,d]=g.split(/\s+/,2);if(!h||/^(https?:)?\/\//i.test(h)||h.startsWith("/"))return g;try{const f=new URL(h,r).toString();return d?`${f} ${d}`:f}catch{return g}}).join(", ");s.setAttribute("srcset",p)}}catch(c){console.warn("[htmlBuilder] rewriteRelativeAssets node processing failed",c)}}catch(i){console.warn("[htmlBuilder] rewriteRelativeAssets failed",i)}}let ui="",jn=null,hi="";async function Un(e,t,n){try{const i=e.querySelectorAll("a");if(!i||!i.length)return;let r,a;if(t===ui&&jn)r=jn,a=hi;else{try{r=new URL(t,location.href),a=Et(r.pathname)}catch{try{r=new URL(t,location.href),a=Et(r.pathname)}catch{r=null,a="/"}}ui=t,jn=r,hi=a}const s=new Set,c=[],o=new Set,l=[];for(const u of Array.from(i))try{const p=u.getAttribute("href")||"";if(!p||yr(p))continue;try{if(p.startsWith("?")||p.indexOf("?")!==-1)try{const h=new URL(p,t||location.href),d=h.searchParams.get("page");if(d&&d.indexOf("/")===-1&&n){const f=n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"";if(f){const m=xe(f+d);u.setAttribute("href",_e(m,h.hash?h.hash.replace(/^#/,""):null));continue}}}catch{}}catch{}if(p.startsWith("/")&&!p.endsWith(".md"))continue;const g=p.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(g){let h=g[1];const d=g[2];!h.startsWith("/")&&n&&(h=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+h);try{const f=new URL(h,t).pathname;let m=f.startsWith(a)?f.slice(a.length):f;m=xe(m),c.push({node:u,mdPathRaw:h,frag:d,rel:m}),W.has(m)||s.add(m)}catch(f){console.warn("[htmlBuilder] resolve mdPath failed",f)}continue}try{let h=p;!p.startsWith("/")&&n&&(p.startsWith("#")?h=n+p:h=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+p);const f=new URL(h,t).pathname||"";if(f&&f.indexOf(a)!==-1){let m=f.startsWith(a)?f.slice(a.length):f;if(m=xe(m),m=At(m),m||(m="_home"),!m.endsWith(".md")){let w=null;try{if(W&&W.has&&W.has(m))w=W.get(m);else try{const y=String(m||"").replace(/^.*\//,"");y&&W.has&&W.has(y)&&(w=W.get(y))}catch(y){console.warn("[htmlBuilder] mdToSlug baseName check failed",y)}}catch(y){console.warn("[htmlBuilder] mdToSlug access check failed",y)}if(!w)try{const y=String(m||"").replace(/^.*\//,"");for(const[k,E]of ne||[])if(E===m||E===y){w=k;break}}catch{}w?u.setAttribute("href",_e(w)):(o.add(m),l.push({node:u,rel:m}))}}}catch(h){console.warn("[htmlBuilder] resolving href to URL failed",h)}}catch(p){console.warn("[htmlBuilder] processing anchor failed",p)}s.size&&await Promise.all(Array.from(s).map(async u=>{try{try{const g=String(u).match(/([^\/]+)\.md$/),h=g&&g[1];if(h&&ne.has(h)){try{const d=ne.get(h);if(d)try{W.set(d,h)}catch(f){console.warn("[htmlBuilder] mdToSlug.set failed",f)}}catch(d){console.warn("[htmlBuilder] reading slugToMd failed",d)}return}}catch(g){console.warn("[htmlBuilder] basename slug lookup failed",g)}const p=await Ce(u,t);if(p&&p.raw){const g=(p.raw||"").match(/^#\s+(.+)$/m);if(g&&g[1]){const h=ge(g[1].trim());if(h)try{ne.set(h,u),W.set(u,h)}catch(d){console.warn("[htmlBuilder] setting slug mapping failed",d)}}}}catch(p){console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed",p)}})),o.size&&await Promise.all(Array.from(o).map(async u=>{try{const p=await Ce(u,t);if(p&&p.raw)try{const h=(Wn||new DOMParser).parseFromString(p.raw,"text/html"),d=h.querySelector("title"),f=h.querySelector("h1"),m=d&&d.textContent&&d.textContent.trim()?d.textContent.trim():f&&f.textContent?f.textContent.trim():null;if(m){const w=ge(m);if(w)try{ne.set(w,u),W.set(u,w)}catch(y){console.warn("[htmlBuilder] setting html slug mapping failed",y)}}}catch(g){console.warn("[htmlBuilder] parse fetched HTML failed",g)}}catch(p){console.warn("[htmlBuilder] fetchMarkdown for htmlPending failed",p)}}));for(const u of c){const{node:p,frag:g,rel:h}=u;let d=null;try{W.has(h)&&(d=W.get(h))}catch(f){console.warn("[htmlBuilder] mdToSlug access failed",f)}d?p.setAttribute("href",_e(d,g)):p.setAttribute("href",_e(h,g))}for(const u of l){const{node:p,rel:g}=u;let h=null;try{W.has(g)&&(h=W.get(g))}catch(d){console.warn("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo",d)}if(!h)try{const d=String(g||"").replace(/^.*\//,"");W.has(d)&&(h=W.get(d))}catch(d){console.warn("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo",d)}h?p.setAttribute("href",_e(h)):p.setAttribute("href",_e(g))}}catch(i){console.warn("[htmlBuilder] rewriteAnchors failed",i)}}function Ms(e,t,n,i){const r=t.querySelector("h1"),a=r?(r.textContent||"").trim():"";let s="";try{let c="";try{e&&e.meta&&e.meta.title&&(c=String(e.meta.title).trim())}catch{}if(!c&&a&&(c=a),!c)try{const o=t.querySelector("h2");o&&o.textContent&&(c=String(o.textContent).trim())}catch{}!c&&n&&(c=String(n)),c&&(s=ge(c)),s||(s="_home");try{n&&(ne.set(s,n),W.set(n,s))}catch(o){console.warn("[htmlBuilder] computeSlug set slug mapping failed",o)}try{const o=i||(location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):"");try{history.replaceState({page:s},"",_e(s,o))}catch(l){console.warn("[htmlBuilder] computeSlug history replace failed",l)}}catch(o){console.warn("[htmlBuilder] computeSlug inner failed",o)}}catch(c){console.warn("[htmlBuilder] computeSlug failed",c)}try{if(e&&e.meta&&e.meta.title&&r){const c=String(e.meta.title).trim();if(c&&c!==a){try{s&&(r.id=s)}catch{}try{if(Array.isArray(e.toc))for(const o of e.toc)try{if(o&&Number(o.level)===1&&String(o.text).trim()===(a||"").trim()){o.id=s;break}}catch{}}catch{}}}}catch{}return{topH1:r,h1Text:a,slugKey:s}}async function Rs(e,t){if(!e||!e.length)return;const n=new Set;for(const o of Array.from(e||[]))try{const l=o.getAttribute("href")||"";if(!l)continue;let g=xe(l).split(/::|#/,2)[0];try{const d=g.indexOf("?");d!==-1&&(g=g.slice(0,d))}catch{}if(!g||(g.includes(".")||(g=g+".html"),!/\.html(?:$|[?#])/.test(g)&&!g.toLowerCase().endsWith(".html")))continue;const h=g;try{if(W&&W.has&&W.has(h))continue}catch(d){console.warn("[htmlBuilder] mdToSlug check failed",d)}try{let d=!1;for(const f of ne.values())if(f===h){d=!0;break}if(d)continue}catch(d){console.warn("[htmlBuilder] slugToMd iteration failed",d)}n.add(h)}catch(l){console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed",l)}if(!n.size)return;const i=async o=>{try{const l=await Ce(o,t);if(l&&l.raw)try{const p=(Wn||new DOMParser).parseFromString(l.raw,"text/html"),g=p.querySelector("title"),h=p.querySelector("h1"),d=g&&g.textContent&&g.textContent.trim()?g.textContent.trim():h&&h.textContent?h.textContent.trim():null;if(d){const f=ge(d);if(f)try{ne.set(f,o),W.set(o,f)}catch(m){console.warn("[htmlBuilder] set slugToMd/mdToSlug failed",m)}}}catch(u){console.warn("[htmlBuilder] parse HTML title failed",u)}}catch(l){console.warn("[htmlBuilder] fetchAndExtract failed",l)}},r=5,a=Array.from(n);let s=0;const c=[];for(;s<a.length;){const o=a.slice(s,s+r);c.push(Promise.all(o.map(i))),s+=r}await Promise.all(c)}async function zs(e,t){if(!e||!e.length)return;const n=[],i=new Set;let r="";try{const a=new URL(t,typeof location<"u"?location.href:"http://localhost/");r=Et(a.pathname)}catch(a){r="",console.warn("[htmlBuilder] preMapMdSlugs parse base failed",a)}for(const a of Array.from(e||[]))try{const s=a.getAttribute("href")||"";if(!s)continue;const c=s.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(c){let o=xe(c[1]);try{let l;try{l=Es(o,t)}catch(p){l=o,console.warn("[htmlBuilder] resolve mdPath URL failed",p)}const u=l&&r&&l.startsWith(r)?l.slice(r.length):String(l||"").replace(/^\//,"");n.push({rel:u}),W.has(u)||i.add(u)}catch(l){console.warn("[htmlBuilder] rewriteAnchors failed",l)}continue}}catch(s){console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed",s)}i.size&&await Promise.all(Array.from(i).map(async a=>{try{const s=String(a).match(/([^\/]+)\.md$/),c=s&&s[1];if(c&&ne.has(c)){try{const o=ne.get(c);o&&W.set(o,c)}catch(o){console.warn("[htmlBuilder] preMapMdSlugs slug map access failed",o)}return}}catch(s){console.warn("[htmlBuilder] preMapMdSlugs basename check failed",s)}try{const s=await Ce(a,t);if(s&&s.raw){const c=(s.raw||"").match(/^#\s+(.+)$/m);if(c&&c[1]){const o=ge(c[1].trim());if(o)try{ne.set(o,a),W.set(a,o)}catch(l){console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed",l)}}}}catch(s){console.warn("[htmlBuilder] preMapMdSlugs fetch failed",s)}}))}const Wn=typeof DOMParser<"u"?new DOMParser:null;function Fn(e){try{const n=(Wn||new DOMParser).parseFromString(e||"","text/html");li(n);try{n.querySelectorAll("img").forEach(o=>{try{o.getAttribute("loading")||o.setAttribute("data-want-lazy","1")}catch(l){console.warn("[htmlBuilder] parseHtml set image loading attribute failed",l)}})}catch(c){console.warn("[htmlBuilder] parseHtml query images failed",c)}n.querySelectorAll("pre code, code[class]").forEach(c=>{try{const o=c.getAttribute&&c.getAttribute("class")||c.className||"",l=o.match(/language-([a-zA-Z0-9_+-]+)/)||o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(l&&l[1]){const u=(l[1]||"").toLowerCase(),p=ae.size&&(ae.get(u)||ae.get(String(u).toLowerCase()))||u;try{(async()=>{try{await pt(p)}catch(g){console.warn("[htmlBuilder] registerLanguage failed",g)}})()}catch(g){console.warn("[htmlBuilder] schedule registerLanguage failed",g)}}else try{if(ue&&typeof ue.getLanguage=="function"&&ue.getLanguage("plaintext")){const u=ue.highlight?ue.highlight(c.textContent||"",{language:"plaintext"}):null;u&&u.value&&(c.innerHTML=u.value)}}catch(u){console.warn("[htmlBuilder] plaintext highlight fallback failed",u)}}catch(o){console.warn("[htmlBuilder] code element processing failed",o)}});const r=[];n.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(c=>{r.push({level:Number(c.tagName.substring(1)),text:(c.textContent||"").trim(),id:c.id})});const s={};try{const c=n.querySelector("title");c&&c.textContent&&String(c.textContent).trim()&&(s.title=String(c.textContent).trim())}catch{}return{html:n.body.innerHTML,meta:s,toc:r}}catch(t){return console.warn("[htmlBuilder] parseHtml failed",t),{html:e||"",meta:{},toc:[]}}}async function $s(e){const t=Hn?await Hn(e||"",ae):Dt(e||"",ae),n=new Set(t),i=[];for(const r of n)try{const a=ae.size&&(ae.get(r)||ae.get(String(r).toLowerCase()))||r;try{i.push(pt(a))}catch(s){console.warn("[htmlBuilder] ensureLanguages push canonical failed",s)}if(String(r)!==String(a))try{i.push(pt(r))}catch(s){console.warn("[htmlBuilder] ensureLanguages push alias failed",s)}}catch(a){console.warn("[htmlBuilder] ensureLanguages inner failed",a)}try{await Promise.all(i)}catch(r){console.warn("[htmlBuilder] ensureLanguages failed",r)}}async function Ps(e){if(await $s(e),hn){const t=await hn(e||"");return!t||typeof t!="object"?{html:String(e||""),meta:{},toc:[]}:(Array.isArray(t.toc)||(t.toc=[]),t.meta||(t.meta={}),t)}return{html:String(e||""),meta:{},toc:[]}}async function Is(e,t,n,i,r){let a=null;if(t.isHtml)try{const p=typeof DOMParser<"u"?new DOMParser:null;if(p){const g=p.parseFromString(t.raw||"","text/html");try{ci(g.body,n,r)}catch(h){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)",h)}a=Fn(g.documentElement&&g.documentElement.outerHTML?g.documentElement.outerHTML:t.raw||"")}else a=Fn(t.raw||"")}catch{a=Fn(t.raw||"")}else a=await Ps(t.raw||"");const s=document.createElement("article");s.className="nimbi-article content",s.innerHTML=a.html;try{ci(s,n,r)}catch(p){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle",p)}try{li(s)}catch(p){console.warn("[htmlBuilder] addHeadingIds failed",p)}try{s.querySelectorAll("pre code, code[class]").forEach(g=>{try{const h=g.getAttribute&&g.getAttribute("class")||g.className||"",d=String(h||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(d)try{g.setAttribute&&g.setAttribute("class",d)}catch(f){g.className=d,console.warn("[htmlBuilder] set element class failed",f)}else try{g.removeAttribute&&g.removeAttribute("class")}catch(f){g.className="",console.warn("[htmlBuilder] remove element class failed",f)}}catch(h){console.warn("[htmlBuilder] code element cleanup failed",h)}})}catch(p){console.warn("[htmlBuilder] processing code elements failed",p)}try{cr(s)}catch(p){console.warn("[htmlBuilder] observeCodeBlocks failed",p)}Cs(s,n,r);try{(s.querySelectorAll&&s.querySelectorAll("img")||[]).forEach(g=>{try{const h=g.parentElement;if(!h||h.tagName.toLowerCase()!=="p"||h.childNodes.length!==1)return;const d=document.createElement("figure");d.className="image",h.replaceWith(d),d.appendChild(g)}catch{}})}catch(p){console.warn("[htmlBuilder] wrap images in Bulma image helper failed",p)}try{(s.querySelectorAll&&s.querySelectorAll("table")||[]).forEach(g=>{try{if(g.classList)g.classList.contains("table")||g.classList.add("table");else{const h=g.getAttribute&&g.getAttribute("class")?g.getAttribute("class"):"",d=String(h||"").split(/\s+/).filter(Boolean);d.indexOf("table")===-1&&d.push("table");try{g.setAttribute&&g.setAttribute("class",d.join(" "))}catch{g.className=d.join(" ")}}}catch{}})}catch(p){console.warn("[htmlBuilder] add Bulma table class failed",p)}const{topH1:c,h1Text:o,slugKey:l}=Ms(a,s,n,i);try{if(c&&a&&a.meta&&(a.meta.author||a.meta.date)&&!(c.parentElement&&c.parentElement.querySelector&&c.parentElement.querySelector(".nimbi-article-subtitle"))){const g=a.meta.author?String(a.meta.author).trim():"",h=a.meta.date?String(a.meta.date).trim():"";let d="";try{const m=new Date(h);h&&!isNaN(m.getTime())?d=m.toLocaleDateString():d=h}catch{d=h}const f=[];if(g&&f.push(g),d&&f.push(d),f.length){const m=document.createElement("p"),w=f[0]?String(f[0]).replace(/\"/g,"").trim():"",y=f.slice(1),k=[];w&&k.push(w),y.length&&k.push(y.join(" • ")),m.className="nimbi-article-subtitle is-6 has-text-grey-light",m.textContent=k.join(" • ");try{c.parentElement.insertBefore(m,c.nextSibling)}catch{try{c.insertAdjacentElement("afterend",m)}catch{}}}}}catch{}try{await qs(s,r,n)}catch(p){As("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread",p),await Un(s,r,n)}const u=Ts(e,a.toc,n);return{article:s,parsed:a,toc:u,topH1:c,h1Text:o,slugKey:l}}function Bs(e){if(!(!e||!e.querySelectorAll))try{const t=Array.from(e.querySelectorAll("script"));for(const n of t)try{const i=document.createElement("script");for(const a of Array.from(n.attributes||[]))try{i.setAttribute(a.name,a.value)}catch{}if(!n.src){const a=n.textContent||"";let s=!1;try{new Function(a)(),s=!0}catch{s=!1}if(s){n.parentNode&&n.parentNode.removeChild(n);try{console.info("[htmlBuilder] executed inline script via Function")}catch{}continue}try{i.type="module"}catch{}i.textContent=a}if(n.src)try{if(document.querySelector&&document.querySelector(`script[src="${n.src}"]`)){n.parentNode&&n.parentNode.removeChild(n);continue}}catch{}const r=n.src||"<inline>";i.addEventListener("error",a=>{try{console.warn("[htmlBuilder] injected script error",{src:r,ev:a})}catch{}}),i.addEventListener("load",()=>{try{console.info("[htmlBuilder] injected script loaded",{src:r,hasNimbi:!!(window&&window.nimbiCMS)})}catch{}});try{(document.head||document.body||document.documentElement).appendChild(i)}catch{try{try{i.type="text/javascript"}catch{}(document.head||document.body||document.documentElement).appendChild(i)}catch(s){try{console.warn("[htmlBuilder] injected script append failed, skipping",{src:r,err:s})}catch{}}}n.parentNode&&n.parentNode.removeChild(n);try{console.info("[htmlBuilder] executed injected script",r)}catch{}}catch(i){console.warn("[htmlBuilder] execute injected script failed",i)}}catch{}}function di(e,t,n){e&&(e.innerHTML="");const i=document.createElement("article");i.className="nimbi-article content nimbi-not-found";const r=document.createElement("h1");r.textContent=t&&t("notFound")||"Page not found";const a=document.createElement("p");a.textContent=n&&n.message?String(n.message):"Failed to resolve the requested page.",i.appendChild(r),i.appendChild(a),e&&e.appendChild&&e.appendChild(i)}const pi=Xi(()=>{const e=vt(xs);if(e)try{if(!(typeof process<"u"&&process.env&&process.env.VITEST))return e}catch{return e}const t={message:[],error:[]};return{addEventListener(n,i){t[n]||(t[n]=[]),t[n].push(i)},removeEventListener(n,i){if(!t[n])return;const r=t[n].indexOf(i);r!==-1&&t[n].splice(r,1)},postMessage(n){setTimeout(async()=>{try{const r={data:await Ss(n)};(t.message||[]).forEach(a=>a(r))}catch(i){const r={data:{id:n&&n.id,error:String(i)}};(t.message||[]).forEach(a=>a(r))}},0)},terminate(){Object.keys(t).forEach(n=>t[n].length=0)}}},"anchor");function Ns(){return pi.get()}function Os(e){return pi.send(e,2e3)}async function qs(e,t,n){if(!Ns())throw new Error("anchor worker unavailable");if(!e||typeof e.innerHTML!="string")throw new Error("invalid article element");const r=String(e.innerHTML),a=await Os({type:"rewriteAnchors",html:r,contentBase:t,pagePath:n});if(a&&typeof a=="string")try{e.innerHTML=a}catch(s){console.warn("[htmlBuilder] applying rewritten anchors failed",s)}}function Ds(e){try{e.addEventListener("click",t=>{const n=t.target&&t.target.closest?t.target.closest("a"):null;if(!n)return;const i=n.getAttribute("href")||"";try{const r=new URL(i,location.href),a=r.searchParams.get("page"),s=r.hash?r.hash.replace(/^#/,""):null;if(!a&&!s)return;t.preventDefault();let c=null;try{history&&history.state&&history.state.page&&(c=history.state.page)}catch(o){c=null,console.warn("[htmlBuilder] access history.state failed",o)}try{c||(c=new URL(location.href).searchParams.get("page"))}catch(o){console.warn("[htmlBuilder] parse current location failed",o)}if(!a&&s||a&&c&&String(a)===String(c)){try{if(!a&&s)try{history.replaceState(history.state,"",(location.pathname||"")+(location.search||"")+(s?"#"+encodeURIComponent(s):""))}catch(o){console.warn("[htmlBuilder] history.replaceState failed",o)}else try{history.replaceState({page:c||a},"",_e(c||a,s))}catch(o){console.warn("[htmlBuilder] history.replaceState failed",o)}}catch(o){console.warn("[htmlBuilder] update history for anchor failed",o)}try{t.stopImmediatePropagation&&t.stopImmediatePropagation(),t.stopPropagation&&t.stopPropagation()}catch(o){console.warn("[htmlBuilder] stopPropagation failed",o)}try{Zn(s)}catch(o){console.warn("[htmlBuilder] scrollToAnchorOrTop failed",o)}return}history.pushState({page:a},"",_e(a,s));try{if(typeof window<"u"&&typeof window.renderByQuery=="function")try{window.renderByQuery()}catch(o){console.warn("[htmlBuilder] window.renderByQuery failed",o)}else if(typeof window<"u")try{window.dispatchEvent(new PopStateEvent("popstate"))}catch(o){console.warn("[htmlBuilder] dispatch popstate failed",o)}else try{renderByQuery()}catch(o){console.warn("[htmlBuilder] renderByQuery failed",o)}}catch(o){console.warn("[htmlBuilder] SPA navigation invocation failed",o)}}catch(r){console.warn("[htmlBuilder] non-URL href in attachTocClickHandler",r)}})}catch(t){console.warn("[htmlBuilder] attachTocClickHandler failed",t)}}function Zn(e){const t=document.querySelector(".nimbi-cms")||null;if(e){const n=document.getElementById(e);if(n)try{const i=()=>{try{if(t&&t.scrollTo&&t.contains(n)){const r=n.getBoundingClientRect().top-t.getBoundingClientRect().top+t.scrollTop;t.scrollTo({top:r,behavior:"smooth"})}else try{n.scrollIntoView({behavior:"smooth",block:"start"})}catch{try{n.scrollIntoView()}catch(a){console.warn("[htmlBuilder] scrollIntoView failed",a)}}}catch{try{n.scrollIntoView()}catch(a){console.warn("[htmlBuilder] final scroll fallback failed",a)}}};try{requestAnimationFrame(()=>setTimeout(i,50))}catch(r){console.warn("[htmlBuilder] scheduling scroll failed",r),setTimeout(i,50)}}catch(i){try{n.scrollIntoView()}catch(r){console.warn("[htmlBuilder] final scroll fallback failed",r)}console.warn("[htmlBuilder] doScroll failed",i)}}else try{t&&t.scrollTo?t.scrollTo({top:0,behavior:"smooth"}):window.scrollTo(0,0)}catch(n){try{window.scrollTo(0,0)}catch(i){console.warn("[htmlBuilder] window.scrollTo failed",i)}console.warn("[htmlBuilder] scroll to top failed",n)}}function Hs(e,t,{mountOverlay:n=null,container:i=null,mountEl:r=null,navWrap:a=null,t:s=null}={}){try{const c=s||(f=>typeof f=="string"?f:""),o=i||document.querySelector(".nimbi-cms"),l=r||document.querySelector(".nimbi-mount"),u=n||document.querySelector(".nimbi-overlay"),p=a||document.querySelector(".nimbi-nav-wrap");let h=document.querySelector(".nimbi-scroll-top");if(!h){h=document.createElement("button"),h.className="nimbi-scroll-top button is-primary is-rounded is-small",h.setAttribute("aria-label",c("scrollToTop")),h.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';try{u&&u.appendChild?u.appendChild(h):o&&o.appendChild?o.appendChild(h):l&&l.appendChild?l.appendChild(h):document.body.appendChild(h)}catch{try{document.body.appendChild(h)}catch(m){console.warn("[htmlBuilder] append scroll top button failed",m)}}try{try{pr(h)}catch{}}catch(f){console.warn("[htmlBuilder] set scroll-top button theme registration failed",f)}h.addEventListener("click",()=>{try{i&&i.scrollTo?i.scrollTo({top:0,left:0,behavior:"smooth"}):r&&r.scrollTo?r.scrollTo({top:0,left:0,behavior:"smooth"}):window.scrollTo({top:0,left:0,behavior:"smooth"})}catch{try{i&&(i.scrollTop=0)}catch(m){console.warn("[htmlBuilder] fallback container scrollTop failed",m)}try{r&&(r.scrollTop=0)}catch(m){console.warn("[htmlBuilder] fallback mountEl scrollTop failed",m)}try{document.documentElement.scrollTop=0}catch(m){console.warn("[htmlBuilder] fallback document scrollTop failed",m)}}})}const d=p&&p.querySelector?p.querySelector(".menu-label"):null;if(t){if(!h._nimbiObserver){const f=new IntersectionObserver(m=>{for(const w of m)w.target instanceof Element&&(w.isIntersecting?(h.classList.remove("show"),d&&d.classList.remove("show")):(h.classList.add("show"),d&&d.classList.add("show")))},{root:i instanceof Element?i:r instanceof Element?r:null,threshold:0});h._nimbiObserver=f}try{h._nimbiObserver.disconnect()}catch(f){console.warn("[htmlBuilder] observer disconnect failed",f)}try{h._nimbiObserver.observe(t)}catch(f){console.warn("[htmlBuilder] observer observe failed",f)}try{const f=()=>{try{const m=o instanceof Element?o.getBoundingClientRect():{top:0,bottom:window.innerHeight},w=t.getBoundingClientRect();!(w.bottom<m.top||w.top>m.bottom)?(h.classList.remove("show"),d&&d.classList.remove("show")):(h.classList.add("show"),d&&d.classList.add("show"))}catch(m){console.warn("[htmlBuilder] checkIntersect failed",m)}};f(),"IntersectionObserver"in window||setTimeout(f,100)}catch(f){console.warn("[htmlBuilder] checkIntersect outer failed",f)}}else{h.classList.remove("show"),d&&d.classList.remove("show");const f=i instanceof Element?i:r instanceof Element?r:window,m=()=>{try{(f===window?window.scrollY:f.scrollTop||0)>10?(h.classList.add("show"),d&&d.classList.add("show")):(h.classList.remove("show"),d&&d.classList.remove("show"))}catch(w){console.warn("[htmlBuilder] onScroll handler failed",w)}};Kt(()=>f.addEventListener("scroll",m)),m()}}catch(c){console.warn("[htmlBuilder] ensureScrollTopButton failed",c)}}function fi(e,t){try{if(!e)return;try{const n=e[t];if(typeof n<"u")return n}catch{}try{if(e.default)return e.default[t]}catch{}return}catch{return}}async function js(e,t,n,i,r,a,s,c,o="eager",l=1,u=void 0,p="favicon"){if(!e||!(e instanceof HTMLElement))throw new TypeError("navbarWrap must be an HTMLElement");const g=typeof DOMParser<"u"?new DOMParser:null,h=g?g.parseFromString(n||"","text/html"):null,d=h?h.querySelectorAll("a"):[];await Kt(()=>Rs(d,i)),await Kt(()=>zs(d,i));try{if(t&&t instanceof HTMLElement&&(!t.hasAttribute||!t.hasAttribute("role")))try{t.setAttribute("role","main")}catch{}}catch{}let f=null,m=null,w=null,y=null,k=null,E=null;function C(){try{const A=document.querySelector(".navbar-burger"),L=A&&A.dataset?A.dataset.target:null,z=L?document.getElementById(L):null;A&&A.classList.contains("is-active")&&(A.classList.remove("is-active"),A.setAttribute("aria-expanded","false"),z&&z.classList.remove("is-active"))}catch(A){console.warn&&console.warn("[nimbi-cms] closeMobileMenu failed",A)}}async function B(){const A=typeof document<"u"?document.querySelector(".nimbi-content"):null;try{A&&A.classList.add("is-inactive")}catch{}try{const L=s&&s();L&&typeof L.then=="function"&&await L}catch(L){try{console.warn&&console.warn("[nimbi-cms] renderByQuery failed",L)}catch{}}finally{try{if(typeof requestAnimationFrame=="function")requestAnimationFrame(()=>{try{A&&A.classList.remove("is-inactive")}catch{}});else try{A&&A.classList.remove("is-inactive")}catch{}}catch{try{A&&A.classList.remove("is-inactive")}catch{}}}}const H=()=>f||(f=(async()=>{try{const A=await Promise.resolve().then(()=>wt),L=fi(A,"buildSearchIndex")||(typeof globalThis<"u"?globalThis.buildSearchIndex:void 0),z=fi(A,"buildSearchIndexWorker")||(typeof globalThis<"u"?globalThis.buildSearchIndexWorker:void 0);if(o==="lazy"&&typeof z=="function")try{const I=await z(i,l,u);if(I&&I.length)return I}catch(I){console.warn&&console.warn("[nimbi-cms] worker builder threw",I)}return typeof L=="function"?await L(i,l,u):[]}catch(A){return console.warn("[nimbi-cms] buildSearchIndex failed",A),[]}finally{if(m){try{m.removeAttribute("disabled")}catch{}try{w&&w.classList.remove("is-loading")}catch{}}}})(),f.then(A=>{try{const L=String(m&&m.value||"").trim().toLowerCase();if(!L||!Array.isArray(A)||!A.length)return;const z=A.filter(_=>_.title&&_.title.toLowerCase().includes(L)||_.excerpt&&_.excerpt.toLowerCase().includes(L));if(!z||!z.length)return;const I=document.getElementById("nimbi-search-results");if(!I)return;I.innerHTML="";try{const _=document.createElement("div");_.className="panel nimbi-search-panel",z.slice(0,10).forEach($=>{try{if($.parentTitle){const me=document.createElement("p");me.className="panel-heading nimbi-search-title nimbi-search-parent",me.textContent=$.parentTitle,_.appendChild(me)}const F=document.createElement("a");F.className="panel-block nimbi-search-result",F.href=_e($.slug),F.setAttribute("role","button");try{if($.path&&typeof $.slug=="string"){try{ne.set($.slug,$.path)}catch{}try{W.set($.path,$.slug)}catch{}}}catch{}const he=document.createElement("div");he.className="is-size-6 has-text-weight-semibold",he.textContent=$.title,F.appendChild(he),F.addEventListener("click",()=>{try{I.style.display="none"}catch{}}),_.appendChild(F)}catch{}}),I.appendChild(_);try{I.style.display="block"}catch{}}catch{}}catch{}}).catch(()=>{}),f),R=document.createElement("nav");R.className="navbar",R.setAttribute("role","navigation"),R.setAttribute("aria-label","main navigation");const G=document.createElement("div");G.className="navbar-brand";const de=d[0],v=document.createElement("a");if(v.className="navbar-item",de){const A=de.getAttribute("href")||"#";try{const z=new URL(A,location.href).searchParams.get("page");if(z){const I=decodeURIComponent(z);v.href=_e(I)}else v.href=_e(r),v.textContent=a("home")}catch{v.href=_e(r),v.textContent=a("home")}}else v.href=_e(r),v.textContent=a("home");async function j(A){try{if(!A||A==="none")return null;if(A==="favicon")try{const L=document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');if(!L)return null;const z=L.getAttribute("href")||"";return z&&/\.png(?:\?|$)/i.test(z)?new URL(z,location.href).toString():null}catch{return null}if(A==="copy-first"||A==="move-first")try{const L=await Ce(r,i);if(!L||!L.raw)return null;const _=new DOMParser().parseFromString(L.raw,"text/html").querySelector("img");if(!_)return null;const $=_.getAttribute("src")||"";if(!$)return null;const F=new URL($,location.href).toString();if(A==="move-first")try{document.documentElement.setAttribute("data-nimbi-logo-moved",F)}catch{}return F}catch{return null}try{return new URL(A,location.href).toString()}catch{return null}}catch{return null}}let X=null;try{X=await j(p)}catch{X=null}if(X)try{const A=document.createElement("img");A.className="nimbi-navbar-logo";const L=a&&typeof a=="function"&&(a("home")||a("siteLogo"))||"";A.alt=L,A.title=L,A.src=X;try{A.style.marginRight="0.5em"}catch{}try{(!v.textContent||!String(v.textContent).trim())&&(v.textContent=L)}catch{}try{v.insertBefore(A,v.firstChild)}catch{try{v.appendChild(A)}catch{}}}catch{}G.appendChild(v),v.addEventListener("click",function(A){const L=v.getAttribute("href")||"";if(L.startsWith("?page=")){A.preventDefault();const z=new URL(L,location.href),I=z.searchParams.get("page"),_=z.hash?z.hash.replace(/^#/,""):null;history.pushState({page:I},"",_e(I,_)),B();try{C()}catch{}}});const D=document.createElement("a");D.className="navbar-burger",D.setAttribute("role","button"),D.setAttribute("aria-label","menu"),D.setAttribute("aria-expanded","false");const Q="nimbi-navbar-menu";D.dataset.target=Q,D.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>',G.appendChild(D);try{D.addEventListener("click",A=>{try{const L=D.dataset&&D.dataset.target?D.dataset.target:null,z=L?document.getElementById(L):null;D.classList.contains("is-active")?(D.classList.remove("is-active"),D.setAttribute("aria-expanded","false"),z&&z.classList.remove("is-active")):(D.classList.add("is-active"),D.setAttribute("aria-expanded","true"),z&&z.classList.add("is-active"))}catch(L){console.warn("[nimbi-cms] navbar burger toggle failed",L)}})}catch(A){console.warn("[nimbi-cms] burger event binding failed",A)}const S=document.createElement("div");S.className="navbar-menu",S.id=Q;const fe=document.createElement("div");fe.className="navbar-start";let re=null,pe=null;if(!c)re=null,m=null,y=null,k=null,E=null;else{re=document.createElement("div"),re.className="navbar-end",pe=document.createElement("div"),pe.className="navbar-item",m=document.createElement("input"),m.className="input",m.type="search",m.placeholder=a("searchPlaceholder")||"",m.id="nimbi-search";try{const _=(a&&typeof a=="function"?a("searchAria"):null)||m.placeholder||"Search";try{m.setAttribute("aria-label",_)}catch{}try{m.setAttribute("aria-controls","nimbi-search-results")}catch{}try{m.setAttribute("aria-autocomplete","list")}catch{}try{m.setAttribute("role","combobox")}catch{}}catch{}o==="eager"&&(m.disabled=!0),w=document.createElement("div"),w.className="control",o==="eager"&&w.classList.add("is-loading"),w.appendChild(m),pe.appendChild(w),y=document.createElement("div"),y.className="dropdown is-right",y.id="nimbi-search-dropdown";const A=document.createElement("div");A.className="dropdown-trigger",A.appendChild(pe);const L=document.createElement("div");L.className="dropdown-menu",L.setAttribute("role","menu"),k=document.createElement("div"),k.id="nimbi-search-results",k.className="dropdown-content nimbi-search-results",E=k,L.appendChild(k),y.appendChild(A),y.appendChild(L),re.appendChild(y);const z=_=>{if(!k)return;k.innerHTML="";let $=-1;function F(Y){try{const J=k.querySelector(".nimbi-search-result.is-selected");J&&J.classList.remove("is-selected");const V=k.querySelectorAll(".nimbi-search-result");if(!V||!V.length)return;if(Y<0){$=-1;return}Y>=V.length&&(Y=V.length-1);const ce=V[Y];if(ce){ce.classList.add("is-selected"),$=Y;try{ce.scrollIntoView({block:"nearest"})}catch{}}}catch{}}function he(Y){try{const J=Y.key,V=k.querySelectorAll(".nimbi-search-result");if(!V||!V.length)return;if(J==="ArrowDown"){Y.preventDefault();const ce=$<0?0:Math.min(V.length-1,$+1);F(ce);return}if(J==="ArrowUp"){Y.preventDefault();const ce=$<=0?0:$-1;F(ce);return}if(J==="Enter"){Y.preventDefault();const ce=k.querySelector(".nimbi-search-result.is-selected")||k.querySelector(".nimbi-search-result");if(ce)try{ce.click()}catch{}return}if(J==="Escape"){try{y.classList.remove("is-active")}catch{}try{k.style.display="none"}catch{}try{k.classList.remove("is-open")}catch{}try{k.removeAttribute("tabindex")}catch{}try{k.removeEventListener("keydown",he)}catch{}try{m&&m.focus()}catch{}try{m&&m.removeEventListener("keydown",me)}catch{}return}}catch{}}function me(Y){try{if(Y&&Y.key==="ArrowDown"){Y.preventDefault();try{k.focus()}catch{}F(0)}}catch{}}try{const Y=document.createElement("div");Y.className="panel nimbi-search-panel",_.forEach(J=>{if(J.parentTitle){const Ae=document.createElement("p");Ae.textContent=J.parentTitle,Ae.className="panel-heading nimbi-search-title nimbi-search-parent",Y.appendChild(Ae)}const V=document.createElement("a");V.className="panel-block nimbi-search-result",V.href=_e(J.slug),V.setAttribute("role","button");try{if(J.path&&typeof J.slug=="string"){try{ne.set(J.slug,J.path)}catch{}try{W.set(J.path,J.slug)}catch{}}}catch{}const ce=document.createElement("div");ce.className="is-size-6 has-text-weight-semibold",ce.textContent=J.title,V.appendChild(ce),V.addEventListener("click",()=>{y&&y.classList.remove("is-active");try{k.style.display="none"}catch{}try{k.classList.remove("is-open")}catch{}try{k.removeAttribute("tabindex")}catch{}try{k.removeEventListener("keydown",he)}catch{}try{m&&m.removeEventListener("keydown",me)}catch{}}),Y.appendChild(V)}),k.appendChild(Y)}catch{}y&&y.classList.add("is-active");try{k.style.display="block"}catch{}try{k.classList.add("is-open")}catch{}try{k.setAttribute("tabindex","0")}catch{}try{k.addEventListener("keydown",he)}catch{}try{m&&m.addEventListener("keydown",me)}catch{}},I=(_,$)=>{let F=null;return(...he)=>{F&&clearTimeout(F),F=setTimeout(()=>_(...he),$)}};if(m){const _=I(async()=>{const $=document.querySelector("input#nimbi-search"),F=String($&&$.value||"").trim().toLowerCase();if(!F){z([]);return}try{await H();const me=(await f).filter(Y=>Y.title&&Y.title.toLowerCase().includes(F)||Y.excerpt&&Y.excerpt.toLowerCase().includes(F));z(me.slice(0,10))}catch(he){console.warn("[nimbi-cms] search input handler failed",he),z([])}},50);try{m.addEventListener("input",_)}catch{}try{document.addEventListener("input",$=>{try{$&&$.target&&$.target.id==="nimbi-search"&&_($)}catch{}},!0)}catch{}}if(o==="eager"){try{f=H()}catch(_){console.warn("[nimbi-cms] eager search index init failed",_),f=Promise.resolve([])}f.finally(()=>{const _=document.querySelector("input#nimbi-search");if(_){try{_.removeAttribute("disabled")}catch{}try{w&&w.classList.remove("is-loading")}catch{}}})}try{const _=$=>{try{const F=$&&$.target;if(!E||!E.classList.contains("is-open")&&E.style&&E.style.display!=="block"||F&&(E.contains(F)||m&&(F===m||m.contains&&m.contains(F))))return;y&&y.classList.remove("is-active");try{E.style.display="none"}catch{}try{E.classList.remove("is-open")}catch{}}catch{}};document.addEventListener("click",_,!0),document.addEventListener("touchstart",_,!0)}catch{}}for(let A=0;A<d.length;A++){const L=d[A];if(A===0)continue;const z=L.getAttribute("href")||"#",I=document.createElement("a");I.className="navbar-item";try{if(/^[^#]*\.md(?:$|[#?])/.test(z)||z.endsWith(".md")){const $=xe(z).split(/::|#/,2),F=$[0],he=$[1];I.href=_e(F,he)}else if(/\.html(?:$|[#?])/.test(z)||z.endsWith(".html")){const $=xe(z).split(/::|#/,2);let F=$[0];F&&!F.toLowerCase().endsWith(".html")&&(F=F+".html");const he=$[1];try{const me=await Ce(F,i);if(me&&me.raw)try{const J=new DOMParser().parseFromString(me.raw,"text/html"),V=J.querySelector("title"),ce=J.querySelector("h1"),Ae=V&&V.textContent&&V.textContent.trim()?V.textContent.trim():ce&&ce.textContent?ce.textContent.trim():null;if(Ae){const kt=ge(Ae);if(kt){try{ne.set(kt,F),W.set(F,kt)}catch(Yn){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",Yn)}I.href=_e(kt,he)}else I.href=_e(F,he)}else I.href=_e(F,he)}catch{I.href=_e(F,he)}else I.href=z}catch{I.href=z}}else I.href=z}catch(_){console.warn("[nimbi-cms] nav item href parse failed",_),I.href=z}try{const _=L.textContent&&String(L.textContent).trim()?String(L.textContent).trim():null;if(_)try{const $=ge(_);if($){const F=I.getAttribute&&I.getAttribute("href")?I.getAttribute("href"):"";try{const me=new URL(F,location.href).searchParams.get("page");if(me){const Y=decodeURIComponent(me);try{ne.set($,Y),W.set(Y,$)}catch(J){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",J)}}}catch(he){console.warn("[nimbi-cms] nav slug mapping failed",he)}}}catch($){console.warn("[nimbi-cms] nav slug mapping failed",$)}}catch(_){console.warn("[nimbi-cms] nav slug mapping failed",_)}I.textContent=L.textContent||z,fe.appendChild(I)}S.appendChild(fe),re&&S.appendChild(re),R.appendChild(G),R.appendChild(S),e.appendChild(R);try{const A=L=>{try{const z=R&&R.querySelector?R.querySelector(".navbar-burger"):document.querySelector(".navbar-burger");if(!z||!z.classList.contains("is-active"))return;const I=z&&z.closest?z.closest(".navbar"):R;if(I&&I.contains(L.target))return;C()}catch{}};document.addEventListener("click",A,!0),document.addEventListener("touchstart",A,!0)}catch{}try{S.addEventListener("click",A=>{const L=A.target&&A.target.closest?A.target.closest("a"):null;if(!L)return;const z=L.getAttribute("href")||"";try{const I=new URL(z,location.href),_=I.searchParams.get("page"),$=I.hash?I.hash.replace(/^#/,""):null;_&&(A.preventDefault(),history.pushState({page:_},"",_e(_,$)),B())}catch(I){console.warn("[nimbi-cms] navbar click handler failed",I)}try{const I=R&&R.querySelector?R.querySelector(".navbar-burger"):null,_=I&&I.dataset?I.dataset.target:null,$=_?document.getElementById(_):null;I&&I.classList.contains("is-active")&&(I.classList.remove("is-active"),I.setAttribute("aria-expanded","false"),$&&$.classList.remove("is-active"))}catch(I){console.warn("[nimbi-cms] mobile menu close failed",I)}})}catch(A){console.warn("[nimbi-cms] attach content click handler failed",A)}try{t.addEventListener("click",A=>{const L=A.target&&A.target.closest?A.target.closest("a"):null;if(!L)return;const z=L.getAttribute("href")||"";if(z&&!yr(z))try{const I=new URL(z,location.href),_=I.searchParams.get("page"),$=I.hash?I.hash.replace(/^#/,""):null;_&&(A.preventDefault(),history.pushState({page:_},"",_e(_,$)),B())}catch(I){console.warn("[nimbi-cms] container click URL parse failed",I)}})}catch(A){console.warn("[nimbi-cms] build navbar failed",A)}return{navbar:R,linkEls:d}}try{document.addEventListener("input",e=>{try{if(e&&e.target&&e.target.id==="nimbi-search"){const t=document.getElementById("nimbi-search-results");if(t&&e.target&&e.target.value)try{t.style.display="block"}catch{}}}catch{}},!0)}catch{}var Gn,gi;function Us(){if(gi)return Gn;gi=1;function e(a,s){return s.some(([c,o])=>c<=a&&a<=o)}function t(a){if(typeof a!="string")return!1;const s=a.charCodeAt(0);return e(s,[[12352,12447],[19968,40959],[44032,55203],[131072,191456]])}function n(a){return` 
\r	`.includes(a)}function i(a){if(typeof a!="string")return!1;const s=a.charCodeAt(0);return e(s,[[33,47],[58,64],[91,96],[123,126],[12288,12351],[65280,65519]])}function r(a,s={}){let c=0,o=0,l=a.length-1;const u=s.wordsPerMinute||200,p=s.wordBound||n;for(;p(a[o]);)o++;for(;p(a[l]);)l--;const g=`${a}
`;for(let m=o;m<=l;m++)if((t(g[m])||!p(g[m])&&(p(g[m+1])||t(g[m+1])))&&c++,t(g[m]))for(;m<=l&&(i(g[m+1])||p(g[m+1]));)m++;const h=c/u,d=Math.round(h*60*1e3);return{text:Math.ceil(h.toFixed(2))+" min read",minutes:h,time:d,words:c}}return Gn=r,Gn}var Ws=Us();const Fs=or(Ws);function mi(e,t){let n=document.querySelector(`meta[name="${e}"]`);n||(n=document.createElement("meta"),n.setAttribute("name",e),document.head.appendChild(n)),n.setAttribute("content",t)}function ut(e,t,n){let i=`meta[${e}="${t}"]`,r=document.querySelector(i);r||(r=document.createElement("meta"),r.setAttribute(e,t),document.head.appendChild(r)),r.setAttribute("content",n)}function Zs(e,t){try{let n=document.querySelector(`link[rel="${e}"]`);n||(n=document.createElement("link"),n.setAttribute("rel",e),document.head.appendChild(n)),n.setAttribute("href",t)}catch(n){console.warn("[seoManager] upsertLinkRel failed",n)}}function Gs(e,t,n,i){const r=t&&String(t).trim()?t:e.title||document.title;ut("property","og:title",r);const a=i&&String(i).trim()?i:e.description||"";a&&String(a).trim()&&ut("property","og:description",a),a&&String(a).trim()&&ut("name","twitter:description",a),ut("name","twitter:card",e.twitter_card||"summary_large_image");const s=n||e.image;s&&(ut("property","og:image",s),ut("name","twitter:image",s))}function Qs(e,t,n,i,r=""){const a=e.meta||{},s=document&&document.querySelector&&document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",c=i&&String(i).trim()?i:a.description&&String(a.description).trim()?a.description:s&&String(s).trim()?s:"";c&&String(c).trim()&&mi("description",c),mi("robots",a.robots||"index,follow"),Gs(a,t,n,c)}function Xs(){try{const e=['meta[name="site"]','meta[name="site-name"]','meta[name="siteName"]','meta[property="og:site_name"]','meta[name="twitter:site"]'];for(const t of e){const n=document.querySelector(t);if(n){const i=n.getAttribute("content")||"";if(i&&i.trim())return i.trim()}}}catch(e){console.warn("[seoManager] getSiteNameFromMeta failed",e)}return""}function Ks(e,t,n,i,r,a=""){try{const s=e.meta||{},c=n&&String(n).trim()?n:s.title||a||document.title,o=r&&String(r).trim()?r:s.description||document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",l=i||s.image||null;let u="";try{if(t){const d=xe(t);try{u=(location.origin+location.pathname).split("?")[0]+"?page="+encodeURIComponent(d)}catch{u=location.href.split("#")[0]}}else u=location.href.split("#")[0]}catch(d){u=location.href.split("#")[0],console.warn("[seoManager] compute canonical failed",d)}u&&Zs("canonical",u);try{ut("property","og:url",u)}catch(d){console.warn("[seoManager] upsertMeta og:url failed",d)}const p={"@context":"https://schema.org","@type":"Article",headline:c||"",description:o||"",url:u||location.href.split("#")[0]};l&&(p.image=String(l)),s.date&&(p.datePublished=s.date),s.dateModified&&(p.dateModified=s.dateModified);const g="nimbi-jsonld";let h=document.getElementById(g);h||(h=document.createElement("script"),h.type="application/ld+json",h.id=g,document.head.appendChild(h)),h.textContent=JSON.stringify(p,null,2)}catch(s){console.warn("[seoManager] setStructuredData failed",s)}}function Ys(e,t,n,i,r,a,s,c,o,l,u){try{if(i&&i.querySelector){const p=i.querySelector(".menu-label");p&&(p.textContent=c&&c.textContent||e("onThisPage"))}}catch(p){console.warn("[seoManager] update toc label failed",p)}try{const p=n.meta&&n.meta.title?String(n.meta.title).trim():"",g=r.querySelector("img"),h=g&&(g.getAttribute("src")||g.src)||null;let d="";try{let w="";try{const y=c||(r&&r.querySelector?r.querySelector("h1"):null);if(y){let k=y.nextElementSibling;const E=[];for(;k&&!(k.tagName&&k.tagName.toLowerCase()==="h2");){try{if(k.classList&&k.classList.contains("nimbi-article-subtitle")){k=k.nextElementSibling;continue}}catch{}const C=(k.textContent||"").trim();C&&E.push(C),k=k.nextElementSibling}E.length&&(w=E.join(" ").replace(/\s+/g," ").trim()),!w&&o&&(w=String(o).trim())}}catch(y){console.warn("[seoManager] compute descOverride failed",y)}w&&String(w).length>160&&(w=String(w).slice(0,157).trim()+"..."),d=w}catch(w){console.warn("[seoManager] compute descOverride failed",w)}let f="";try{p&&(f=p)}catch{}if(!f)try{c&&c.textContent&&(f=String(c.textContent).trim())}catch{}if(!f)try{const w=r.querySelector("h2");w&&w.textContent&&(f=String(w.textContent).trim())}catch{}f||(f=a||"");try{Qs(n,f||void 0,h,d)}catch(w){console.warn("[seoManager] setMetaTags failed",w)}try{Ks(n,l,f||void 0,h,d,t)}catch(w){console.warn("[seoManager] setStructuredData failed",w)}const m=Xs();f?m?document.title=`${m} - ${f}`:document.title=`${t||"Site"} - ${f}`:p?document.title=p:document.title=t||document.title}catch(p){console.warn("[seoManager] applyPageMeta failed",p)}try{try{const p=r.querySelectorAll(".nimbi-reading-time");p&&p.forEach(g=>g.remove())}catch{}if(o){const p=Fs(u.raw||""),g=p&&typeof p.minutes=="number"?Math.ceil(p.minutes):0,h=g?e("readingTime",{minutes:g}):"";if(!h)return;const d=r.querySelector("h1");if(d){const f=r.querySelector(".nimbi-article-subtitle");try{if(f){const m=document.createElement("span");m.className="nimbi-reading-time",m.textContent=" • "+h,f.appendChild(m)}else{const m=document.createElement("p");m.className="nimbi-article-subtitle is-6 has-text-grey-light";const w=document.createElement("span");w.className="nimbi-reading-time",w.textContent=h,m.appendChild(w);try{d.parentElement.insertBefore(m,d.nextSibling)}catch{try{d.insertAdjacentElement("afterend",m)}catch{}}}}catch{try{const w=document.createElement("p");w.className="nimbi-article-subtitle is-6 has-text-grey-light";const y=document.createElement("span");y.className="nimbi-reading-time",y.textContent=h,w.appendChild(y),d.insertAdjacentElement("afterend",w)}catch{}}}}}catch(p){console.warn("[seoManager] reading time update failed",p)}}let $e=null,Z=null,Le=1,Ge=(e,t)=>t,Ht=0,jt=0,dn=()=>{},Ut=.25;function Vs(){if($e&&document.contains($e))return $e;$e=null;const e=document.createElement("dialog");e.className="nimbi-image-preview modal",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-label",Ge("imagePreviewTitle","Image preview")),e.innerHTML=`
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
  `,e.addEventListener("click",S=>{S.target===e&&Qn()}),e.addEventListener("wheel",S=>{if(!de())return;S.preventDefault();const fe=S.deltaY<0?Ut:-Ut;Ve(Le+fe),l(),u()},{passive:!1}),e.addEventListener("keydown",S=>{if(S.key==="Escape"){Qn();return}if(Le>1){const fe=e.querySelector(".nimbi-image-preview__image-wrapper");if(!fe)return;const re=40;switch(S.key){case"ArrowUp":fe.scrollTop-=re,S.preventDefault();break;case"ArrowDown":fe.scrollTop+=re,S.preventDefault();break;case"ArrowLeft":fe.scrollLeft-=re,S.preventDefault();break;case"ArrowRight":fe.scrollLeft+=re,S.preventDefault();break}}}),document.body.appendChild(e),$e=e,Z=e.querySelector("[data-nimbi-preview-image]");const t=e.querySelector("[data-nimbi-preview-fit]"),n=e.querySelector("[data-nimbi-preview-original]"),i=e.querySelector("[data-nimbi-preview-zoom-in]"),r=e.querySelector("[data-nimbi-preview-zoom-out]"),a=e.querySelector("[data-nimbi-preview-reset]"),s=e.querySelector("[data-nimbi-preview-close]"),c=e.querySelector("[data-nimbi-preview-zoom-label]"),o=e.querySelector("[data-nimbi-preview-zoom-hud]");function l(){c&&(c.textContent=`${Math.round(Le*100)}%`)}const u=()=>{o&&(o.textContent=`${Math.round(Le*100)}%`,o.classList.add("visible"),clearTimeout(o._timeout),o._timeout=setTimeout(()=>o.classList.remove("visible"),800))};dn=l,i.addEventListener("click",()=>{Ve(Le+Ut),l(),u()}),r.addEventListener("click",()=>{Ve(Le-Ut),l(),u()}),t.addEventListener("click",()=>{Wt(),l(),u()}),n.addEventListener("click",()=>{Ve(1),l(),u()}),a.addEventListener("click",()=>{Wt(),l(),u()}),s.addEventListener("click",Qn),t.title=Ge("imagePreviewFit","Fit to screen"),n.title=Ge("imagePreviewOriginal","Original size"),r.title=Ge("imagePreviewZoomOut","Zoom out"),i.title=Ge("imagePreviewZoomIn","Zoom in"),s.title=Ge("imagePreviewClose","Close"),s.setAttribute("aria-label",Ge("imagePreviewClose","Close"));let p=!1,g=0,h=0,d=0,f=0;const m=new Map;let w=0,y=1;const k=(S,fe)=>{const re=S.x-fe.x,pe=S.y-fe.y;return Math.hypot(re,pe)},E=()=>{p=!1,m.clear(),w=0,Z&&(Z.classList.add("is-panning"),Z.classList.remove("is-grabbing"))};let C=0,B=0,H=0;const R=S=>{const fe=Date.now(),re=fe-C,pe=S.clientX-B,A=S.clientY-H;C=fe,B=S.clientX,H=S.clientY,re<300&&Math.hypot(pe,A)<30&&(Ve(Le>1?1:2),l(),S.preventDefault())},G=S=>{Ve(Le>1?1:2),l(),S.preventDefault()},de=()=>$e?typeof $e.open=="boolean"?$e.open:$e.classList.contains("is-active"):!1,v=(S,fe,re=1)=>{if(m.has(re)&&m.set(re,{x:S,y:fe}),m.size===2){const z=Array.from(m.values()),I=k(z[0],z[1]);if(w>0){const _=I/w;Ve(y*_)}return}if(!p)return;const pe=Z.closest(".nimbi-image-preview__image-wrapper");if(!pe)return;const A=S-g,L=fe-h;pe.scrollLeft=d-A,pe.scrollTop=f-L},j=(S,fe,re=1)=>{if(!de())return;if(m.set(re,{x:S,y:fe}),m.size===2){const L=Array.from(m.values());w=k(L[0],L[1]),y=Le;return}const pe=Z.closest(".nimbi-image-preview__image-wrapper");!pe||!(pe.scrollWidth>pe.clientWidth||pe.scrollHeight>pe.clientHeight)||(p=!0,g=S,h=fe,d=pe.scrollLeft,f=pe.scrollTop,Z.classList.add("is-panning"),Z.classList.remove("is-grabbing"),window.addEventListener("pointermove",X),window.addEventListener("pointerup",D),window.addEventListener("pointercancel",D))},X=S=>{p&&(S.preventDefault(),v(S.clientX,S.clientY,S.pointerId))},D=()=>{E(),window.removeEventListener("pointermove",X),window.removeEventListener("pointerup",D),window.removeEventListener("pointercancel",D)};Z.addEventListener("pointerdown",S=>{S.preventDefault(),j(S.clientX,S.clientY,S.pointerId)}),Z.addEventListener("pointermove",S=>{(p||m.size===2)&&S.preventDefault(),v(S.clientX,S.clientY,S.pointerId)}),Z.addEventListener("pointerup",S=>{S.preventDefault(),S.pointerType==="touch"&&R(S),E()}),Z.addEventListener("dblclick",G),Z.addEventListener("pointercancel",E),Z.addEventListener("mousedown",S=>{S.preventDefault(),j(S.clientX,S.clientY,1)}),Z.addEventListener("mousemove",S=>{p&&S.preventDefault(),v(S.clientX,S.clientY,1)}),Z.addEventListener("mouseup",S=>{S.preventDefault(),E()});const Q=e.querySelector(".nimbi-image-preview__image-wrapper");return Q&&(Q.addEventListener("pointerdown",S=>{if(j(S.clientX,S.clientY,S.pointerId),S&&S.target&&S.target.tagName==="IMG")try{S.target.classList.add("is-grabbing")}catch{}}),Q.addEventListener("pointermove",S=>{v(S.clientX,S.clientY,S.pointerId)}),Q.addEventListener("pointerup",E),Q.addEventListener("pointercancel",E),Q.addEventListener("mousedown",S=>{if(j(S.clientX,S.clientY,1),S&&S.target&&S.target.tagName==="IMG")try{S.target.classList.add("is-grabbing")}catch{}}),Q.addEventListener("mousemove",S=>{v(S.clientX,S.clientY,1)}),Q.addEventListener("mouseup",E)),e}function Ve(e){if(!Z)return;const t=Number(e);Le=Number.isFinite(t)?Math.max(.1,Math.min(4,t)):1;const i=Z.getBoundingClientRect(),r=Ht||Z.naturalWidth||Z.width||i.width||0,a=jt||Z.naturalHeight||Z.height||i.height||0;if(r&&a){Z.style.setProperty("--nimbi-preview-img-max-width","none"),Z.style.setProperty("--nimbi-preview-img-max-height","none"),Z.style.setProperty("--nimbi-preview-img-width",`${r*Le}px`),Z.style.setProperty("--nimbi-preview-img-height",`${a*Le}px`),Z.style.setProperty("--nimbi-preview-img-transform","none");try{Z.style.width=`${r*Le}px`,Z.style.height=`${a*Le}px`,Z.style.transform="none"}catch{}}else{Z.style.setProperty("--nimbi-preview-img-max-width",""),Z.style.setProperty("--nimbi-preview-img-max-height",""),Z.style.setProperty("--nimbi-preview-img-width",""),Z.style.setProperty("--nimbi-preview-img-height",""),Z.style.setProperty("--nimbi-preview-img-transform",`scale(${Le})`);try{Z.style.transform=`scale(${Le})`}catch{}}Z&&(Z.classList.add("is-panning"),Z.classList.remove("is-grabbing"))}function Wt(){if(!Z)return;const e=Z.closest(".nimbi-image-preview__image-wrapper");if(!e)return;const t=e.getBoundingClientRect();if(t.width===0||t.height===0)return;const n=Ht||Z.naturalWidth||t.width,i=jt||Z.naturalHeight||t.height;if(!n||!i)return;const r=t.width/n,a=t.height/i,s=Math.min(r,a,1);Ve(Number.isFinite(s)?s:1)}function Js(e,t="",n=0,i=0){const r=Vs();Le=1,Ht=n||0,jt=i||0,Z.src=e;try{if(!t)try{const c=new URL(e,typeof location<"u"?location.href:"").pathname||"",l=(c.substring(c.lastIndexOf("/")+1)||e).replace(/\.[^/.]+$/,"").replace(/[-_]+/g," ");t=Ge("imagePreviewDefaultAlt",l||"Image")}catch{t=Ge("imagePreviewDefaultAlt","Image")}}catch{}Z.alt=t,Z.style.transform="scale(1)";const a=()=>{Ht=Z.naturalWidth||Z.width||0,jt=Z.naturalHeight||Z.height||0};if(a(),Wt(),dn(),requestAnimationFrame(()=>{Wt(),dn()}),!Ht||!jt){const s=()=>{a(),requestAnimationFrame(()=>{Wt(),dn()}),Z.removeEventListener("load",s)};Z.addEventListener("load",s)}typeof r.showModal=="function"&&(r.open||r.showModal()),r.classList.add("is-active");try{document.documentElement.classList.add("nimbi-image-preview-open")}catch{}r.focus()}function Qn(){if($e){typeof $e.close=="function"&&$e.open&&$e.close(),$e.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-image-preview-open")}catch{}}}function eo(e,{t,zoomStep:n=.25}={}){if(!e||!e.querySelectorAll)return;Ge=(h,d)=>(typeof t=="function"?t(h):void 0)||d,Ut=n,e.addEventListener("click",h=>{const d=h.target;if(!d||d.tagName!=="IMG")return;const f=d;if(!f.src)return;const m=f.closest("a");m&&m.getAttribute("href")||Js(f.src,f.alt||"",f.naturalWidth||0,f.naturalHeight||0)});let i=!1,r=0,a=0,s=0,c=0;const o=new Map;let l=0,u=1;const p=(h,d)=>{const f=h.x-d.x,m=h.y-d.y;return Math.hypot(f,m)};e.addEventListener("pointerdown",h=>{const d=h.target;if(!d||d.tagName!=="IMG")return;const f=d.closest("a");if(f&&f.getAttribute("href")||!$e||!$e.open)return;if(o.set(h.pointerId,{x:h.clientX,y:h.clientY}),o.size===2){const w=Array.from(o.values());l=p(w[0],w[1]),u=Le;return}const m=d.closest(".nimbi-image-preview__image-wrapper");if(m&&!(Le<=1)){h.preventDefault(),i=!0,r=h.clientX,a=h.clientY,s=m.scrollLeft,c=m.scrollTop,d.setPointerCapture(h.pointerId);try{d.classList.add("is-grabbing")}catch{}}}),e.addEventListener("pointermove",h=>{if(o.has(h.pointerId)&&o.set(h.pointerId,{x:h.clientX,y:h.clientY}),o.size===2){h.preventDefault();const k=Array.from(o.values()),E=p(k[0],k[1]);if(l>0){const C=E/l;Ve(u*C)}return}if(!i)return;h.preventDefault();const d=h.target,f=d.closest&&d.closest("a");if(f&&f.getAttribute&&f.getAttribute("href"))return;const m=d.closest(".nimbi-image-preview__image-wrapper");if(!m)return;const w=h.clientX-r,y=h.clientY-a;m.scrollLeft=s-w,m.scrollTop=c-y});const g=()=>{i=!1,o.clear(),l=0;try{const h=document.querySelector("[data-nimbi-preview-image]");h&&(h.classList.add("is-panning"),h.classList.remove("is-grabbing"))}catch{}};e.addEventListener("pointerup",g),e.addEventListener("pointercancel",g)}function to(e){const{contentWrap:t,navWrap:n,container:i,mountOverlay:r=null,t:a,contentBase:s,homePage:c,initialDocumentTitle:o,runHooks:l}=e||{};if(!t||!(t instanceof HTMLElement))throw new TypeError("contentWrap must be an HTMLElement");let u=null;const p=Ls(a,[{path:c,name:a("home"),isIndex:!0,children:[]}]);async function g(w,y){let k,E,C;try{({data:k,pagePath:E,anchor:C}=await ya(w,s))}catch(j){console.error("[nimbi-cms] fetchPageData failed",j),di(t,a,j);return}!C&&y&&(C=y);try{Zn(null)}catch(j){console.warn("[nimbi-cms] scrollToAnchorOrTop failed",j)}t.innerHTML="";const{article:B,parsed:H,toc:R,topH1:G,h1Text:de,slugKey:v}=await Is(a,k,E,C,s);Ys(a,o,H,R,B,E,C,G,de,v,k),n.innerHTML="",R&&(n.appendChild(R),Ds(R));try{await l("transformHtml",{article:B,parsed:H,toc:R,pagePath:E,anchor:C,topH1:G,h1Text:de,slugKey:v,data:k})}catch(j){console.warn("[nimbi-cms] transformHtml hooks failed",j)}t.appendChild(B);try{Bs(B)}catch(j){console.warn("[nimbi-cms] executeEmbeddedScripts failed",j)}try{eo(B,{t:a})}catch(j){console.warn("[nimbi-cms] attachImagePreview failed",j)}try{Xt(i,100,!1),requestAnimationFrame(()=>Xt(i,100,!1)),setTimeout(()=>Xt(i,100,!1),250)}catch(j){console.warn("[nimbi-cms] setEagerForAboveFoldImages failed",j)}Zn(C),Hs(B,G,{mountOverlay:r,container:i,navWrap:n,t:a});try{await l("onPageLoad",{data:k,pagePath:E,anchor:C,article:B,toc:R,topH1:G,h1Text:de,slugKey:v,contentWrap:t,navWrap:n})}catch(j){console.warn("[nimbi-cms] onPageLoad hooks failed",j)}u=E}async function h(){let w=new URLSearchParams(location.search).get("page")||c;const y=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;try{await g(w,y)}catch(k){console.warn("[nimbi-cms] renderByQuery failed for",w,k),di(t,a,k)}}window.addEventListener("popstate",h);const d=()=>`nimbi-cms-scroll:${location.pathname}${location.search}`,f=()=>{try{const w=i||document.querySelector(".nimbi-cms");if(!w)return;const y={top:w.scrollTop||0,left:w.scrollLeft||0};sessionStorage.setItem(d(),JSON.stringify(y))}catch{}},m=()=>{try{const w=i||document.querySelector(".nimbi-cms");if(!w)return;const y=sessionStorage.getItem(d());if(!y)return;const k=JSON.parse(y);k&&typeof k.top=="number"&&w.scrollTo({top:k.top,left:k.left||0,behavior:"auto"})}catch{}};return window.addEventListener("pageshow",w=>{if(w.persisted)try{m(),Xt(i,100,!1)}catch(y){console.warn("[nimbi-cms] bfcache restore failed",y)}}),window.addEventListener("pagehide",()=>{try{f()}catch(w){console.warn("[nimbi-cms] save scroll position failed",w)}}),{renderByQuery:h,siteNav:p,getCurrentPagePath:()=>u}}function no(e){try{let t=typeof e=="string"?e:typeof window<"u"&&window.location?window.location.search:"";if(!t&&typeof window<"u"&&window.location&&window.location.hash){const a=window.location.hash,s=a.indexOf("?");s!==-1&&(t=a.slice(s))}if(!t)return{};const n=new URLSearchParams(t.startsWith("?")?t.slice(1):t),i={},r=a=>{if(a==null)return;const s=String(a).toLowerCase();if(s==="1"||s==="true"||s==="yes")return!0;if(s==="0"||s==="false"||s==="no")return!1};if(n.has("contentPath")&&(i.contentPath=n.get("contentPath")),n.has("searchIndex")){const a=r(n.get("searchIndex"));typeof a=="boolean"&&(i.searchIndex=a)}if(n.has("searchIndexMode")){const a=n.get("searchIndexMode");(a==="eager"||a==="lazy")&&(i.searchIndexMode=a)}if(n.has("defaultStyle")){const a=n.get("defaultStyle");(a==="light"||a==="dark"||a==="system")&&(i.defaultStyle=a)}if(n.has("bulmaCustomize")&&(i.bulmaCustomize=n.get("bulmaCustomize")),n.has("lang")&&(i.lang=n.get("lang")),n.has("l10nFile")){const a=n.get("l10nFile");i.l10nFile=a==="null"?null:a}if(n.has("cacheTtlMinutes")){const a=Number(n.get("cacheTtlMinutes"));Number.isFinite(a)&&a>=0&&(i.cacheTtlMinutes=a)}if(n.has("cacheMaxEntries")){const a=Number(n.get("cacheMaxEntries"));Number.isInteger(a)&&a>=0&&(i.cacheMaxEntries=a)}if(n.has("homePage")&&(i.homePage=n.get("homePage")),n.has("navigationPage")&&(i.navigationPage=n.get("navigationPage")),n.has("notFoundPage")&&(i.notFoundPage=n.get("notFoundPage")),n.has("availableLanguages")&&(i.availableLanguages=n.get("availableLanguages").split(",").map(a=>a.trim()).filter(Boolean)),n.has("indexDepth")){const a=Number(n.get("indexDepth"));Number.isInteger(a)&&(a===1||a===2||a===3)&&(i.indexDepth=a)}if(n.has("noIndexing")){const s=(n.get("noIndexing")||"").split(",").map(c=>c.trim()).filter(Boolean);s.length&&(i.noIndexing=s)}return i}catch{return{}}}function ro(e){return!(typeof e!="string"||!e.trim()||e.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(e)||e.startsWith("//")||e.startsWith("/")||/^[A-Za-z]:\\/.test(e))}function Xn(e){if(typeof e!="string")return!1;const t=e.trim();if(!t||t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))return!1;const n=t.replace(/^\.\//,"");return!!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n)}let Kn="";async function bi(e={}){if(typeof window<"u"&&window.__nimbiCMSDebug)try{console.info("[nimbi-cms] initCMS called",{options:e})}catch{}if(!e||typeof e!="object")throw new TypeError("initCMS(options): options must be an object");const n=no();if(n&&(n.contentPath||n.homePage||n.notFoundPage||n.navigationPage))if(e&&e.allowUrlPathOverrides===!0)try{console.warn("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage/navigationPage")}catch(v){console.warn("[nimbi-cms] allowUrlPathOverrides logging failed",v)}else{try{console.warn("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage/navigationPage")}catch(v){console.warn("[nimbi-cms] logging ignore of URL overrides failed",v)}delete n.contentPath,delete n.homePage,delete n.notFoundPage,delete n.navigationPage}const i=Object.assign({},n,e);n&&typeof n.bulmaCustomize=="string"&&n.bulmaCustomize.trim()&&(i.bulmaCustomize=n.bulmaCustomize);let{el:r,contentPath:a="/content",crawlMaxQueue:s=1e3,searchIndex:c=!0,searchIndexMode:o="eager",indexDepth:l=1,noIndexing:u=void 0,defaultStyle:p="light",bulmaCustomize:g="none",lang:h=void 0,l10nFile:d=null,cacheTtlMinutes:f=5,cacheMaxEntries:m,markdownExtensions:w,availableLanguages:y,homePage:k="_home.md",notFoundPage:E="_404.md",navigationPage:C="_navigation.md"}=i;try{typeof k=="string"&&k.startsWith("./")&&(k=k.replace(/^\.\//,""))}catch{}try{typeof E=="string"&&E.startsWith("./")&&(E=E.replace(/^\.\//,""))}catch{}try{typeof C=="string"&&C.startsWith("./")&&(C=C.replace(/^[.]\//,""))}catch{}const{navbarLogo:B="favicon"}=i,{skipRootReadme:H=!1}=i,R=v=>{try{const j=document.querySelector(r);j&&j instanceof Element&&(j.innerHTML=`<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;"><strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">${String(v)}</pre></div>`)}catch{}};if(i.contentPath!=null&&!ro(i.contentPath))throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');if(k!=null&&!Xn(k))throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');if(E!=null&&!Xn(E))throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');if(C!=null&&!Xn(C))throw new TypeError('initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html');if(!r)throw new Error("el is required");let G=r;if(typeof r=="string"){if(G=document.querySelector(r),!G)throw new Error(`el selector "${r}" did not match any element`)}else if(!(r instanceof Element))throw new TypeError("el must be a CSS selector string or a DOM element");if(typeof a!="string"||!a.trim())throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');if(typeof c!="boolean")throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');if(o!=null&&o!=="eager"&&o!=="lazy")throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');if(l!=null&&l!==1&&l!==2&&l!==3)throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');if(p!=="light"&&p!=="dark"&&p!=="system")throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');if(g!=null&&typeof g!="string")throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');if(h!=null&&typeof h!="string")throw new TypeError('initCMS(options): "lang" must be a string when provided');if(d!=null&&typeof d!="string")throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');if(f!=null&&(typeof f!="number"||!Number.isFinite(f)||f<0))throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');if(m!=null&&(typeof m!="number"||!Number.isInteger(m)||m<0))throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');if(w!=null&&(!Array.isArray(w)||w.some(v=>!v||typeof v!="object")))throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');if(y!=null&&(!Array.isArray(y)||y.some(v=>typeof v!="string"||!v.trim())))throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');if(u!=null&&(!Array.isArray(u)||u.some(v=>typeof v!="string"||!v.trim())))throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');if(H!=null&&typeof H!="boolean")throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');if(k!=null&&(typeof k!="string"||!k.trim()||!/\.(md|html)$/.test(k)))throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');if(E!=null&&(typeof E!="string"||!E.trim()||!/\.(md|html)$/.test(E)))throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');const de=!!c;try{Promise.resolve().then(()=>wt).then(v=>{try{v&&typeof v.setSkipRootReadme=="function"&&v.setSkipRootReadme(!!H)}catch(j){console.warn("[nimbi-cms] setSkipRootReadme failed",j)}}).catch(v=>{})}catch(v){console.warn("[nimbi-cms] setSkipRootReadme dynamic import failed",v)}try{await(async()=>{try{G.classList.add("nimbi-mount")}catch(_){console.warn("[nimbi-cms] mount element setup failed",_)}const v=document.createElement("section");v.className="section";const j=document.createElement("div");j.className="container nimbi-cms";const X=document.createElement("div");X.className="columns";const D=document.createElement("div");D.className="column is-hidden-mobile is-3-tablet nimbi-nav-wrap",D.setAttribute("role","navigation");try{const _=typeof gt=="function"?gt("navigation"):null;_&&D.setAttribute("aria-label",_)}catch(_){console.warn("[nimbi-cms] set nav aria-label failed",_)}X.appendChild(D);const Q=document.createElement("main");Q.className="column nimbi-content",Q.setAttribute("role","main"),X.appendChild(Q),j.appendChild(X),v.appendChild(j);const S=D,fe=Q;G.appendChild(v);let re=null;try{re=G.querySelector(".nimbi-overlay"),re||(re=document.createElement("div"),re.className="nimbi-overlay",G.appendChild(re))}catch(_){re=null,console.warn("[nimbi-cms] mount overlay setup failed",_)}const pe=location.pathname||"/",A=pe.endsWith("/")?pe:pe.substring(0,pe.lastIndexOf("/")+1);try{Kn=document.title||""}catch(_){Kn="",console.warn("[nimbi-cms] read initial document title failed",_)}let L=a;(L==="."||L==="./")&&(L=""),L.startsWith("./")&&(L=L.slice(2)),L.startsWith("/")&&(L=L.slice(1)),L!==""&&!L.endsWith("/")&&(L=L+"/");const z=new URL(A+L,location.origin).toString();try{Promise.resolve().then(()=>wt).then(_=>{try{_&&typeof _.setHomePage=="function"&&_.setHomePage(k)}catch($){console.warn("[nimbi-cms] setHomePage failed",$)}}).catch(_=>{})}catch(_){console.warn("[nimbi-cms] setHomePage dynamic import failed",_)}d&&await vn(d,A),y&&Array.isArray(y)&&kr(y),h&&An(h);const I=to({contentWrap:fe,navWrap:S,container:j,mountOverlay:re,t:gt,contentBase:z,homePage:k,initialDocumentTitle:Kn,runHooks:yn});if(typeof f=="number"&&f>=0&&typeof Pr=="function"&&Pr(f*60*1e3),typeof m=="number"&&m>=0&&typeof $r=="function"&&$r(m),w&&Array.isArray(w)&&w.length)try{w.forEach(_=>{typeof _=="object"&&oi&&typeof Dn=="function"&&Dn(_)})}catch(_){console.warn("[nimbi-cms] applying markdownExtensions failed",_)}try{typeof s=="number"&&Promise.resolve().then(()=>wt).then(({setDefaultCrawlMaxQueue:_})=>{try{_(s)}catch($){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed",$)}})}catch(_){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed",_)}try{Jt(z)}catch(_){console.warn("[nimbi-cms] setContentBase failed",_)}try{Cn(E)}catch(_){console.warn("[nimbi-cms] setNotFoundPage failed",_)}try{Jt(z)}catch(_){console.warn("[nimbi-cms] setContentBase failed",_)}try{Cn(E)}catch(_){console.warn("[nimbi-cms] setNotFoundPage failed",_)}try{await Ce(k,z)}catch(_){throw k==="_home.md"?new Error("Required _home.md not found"):new Error(`Required ${k} not found at ${z}${k}: ${_.message}`)}dr(p),await hr(g,A);try{const _=document.createElement("header");_.className="nimbi-site-navbar",G.insertBefore(_,v);const $=await Ce(C,z),F=await hn($.raw||""),{navbar:he,linkEls:me}=await js(_,j,F.html||"",z,k,gt,I.renderByQuery,de,o,l,u,B);try{await yn("onNavBuild",{navWrap:S,navbar:he,linkEls:me,contentBase:z})}catch(Y){console.warn("[nimbi-cms] onNavBuild hooks failed",Y)}try{const Y=()=>{const J=_&&_.getBoundingClientRect&&Math.round(_.getBoundingClientRect().height)||_&&_.offsetHeight||0;if(J>0){try{G.style.setProperty("--nimbi-site-navbar-height",`${J}px`)}catch(V){console.warn("[nimbi-cms] set CSS var failed",V)}try{j.style.paddingTop=""}catch(V){console.warn("[nimbi-cms] set container paddingTop failed",V)}try{const V=G&&G.getBoundingClientRect&&Math.round(G.getBoundingClientRect().height)||G&&G.clientHeight||0;if(V>0){const ce=Math.max(0,V-J);try{j.style.setProperty("--nimbi-cms-height",`${ce}px`)}catch(Ae){console.warn("[nimbi-cms] set --nimbi-cms-height failed",Ae)}}else try{j.style.setProperty("--nimbi-cms-height","calc(100vh - var(--nimbi-site-navbar-height))")}catch(ce){console.warn("[nimbi-cms] set --nimbi-cms-height failed",ce)}}catch(V){console.warn("[nimbi-cms] compute container height failed",V)}try{_.style.setProperty("--nimbi-site-navbar-height",`${J}px`)}catch(V){console.warn("[nimbi-cms] set navbar CSS var failed",V)}}};Y();try{if(typeof ResizeObserver<"u"){const J=new ResizeObserver(()=>Y());try{J.observe(_)}catch(V){console.warn("[nimbi-cms] ResizeObserver.observe failed",V)}}}catch(J){console.warn("[nimbi-cms] ResizeObserver setup failed",J)}}catch(Y){console.warn("[nimbi-cms] compute navbar height failed",Y)}}catch(_){console.warn("[nimbi-cms] build navigation failed",_)}await I.renderByQuery();try{Promise.resolve().then(()=>io).then(({getVersion:_})=>{typeof _=="function"&&_().then($=>{try{const F=$||"0.0.0";try{const he=J=>{const V=document.createElement("a");V.className="nimbi-version-label tag is-small",V.textContent=`Ninbi CMS v. ${F}`,V.href=J||"#",V.target="_blank",V.rel="noopener noreferrer nofollow",V.setAttribute("aria-label",`Ninbi CMS version ${F}`);try{pr(V)}catch{}try{G.appendChild(V)}catch(ce){console.warn("[nimbi-cms] append version label failed",ce)}},me="https://abelvm.github.io/nimbiCMS/",Y=(()=>{try{if(me&&typeof me=="string")return new URL(me).toString()}catch{}return"#"})();he(Y)}catch(he){console.warn("[nimbi-cms] building version label failed",he)}}catch(F){console.warn("[nimbi-cms] building version label failed",F)}}).catch($=>{console.warn("[nimbi-cms] getVersion() failed",$)})}).catch(_=>{console.warn("[nimbi-cms] import version module failed",_)})}catch(_){console.warn("[nimbi-cms] version label setup failed",_)}})()}catch(v){throw R(v),v}}async function wi(){try{if("1.0.3".trim())return"1.0.3"}catch{}return"0.0.0"}const io=Object.freeze(Object.defineProperty({__proto__:null,getVersion:wi},Symbol.toStringTag,{value:"Module"}));we.BAD_LANGUAGES=_n,we.SUPPORTED_HLJS_MAP=ae,we._clearHooks=Oi,we.addHook=Zt,we.default=bi,we.ensureBulma=hr,we.getVersion=wi,we.initCMS=bi,we.loadL10nFile=vn,we.loadSupportedLanguages=Sn,we.observeCodeBlocks=cr,we.onNavBuild=Bi,we.onPageLoad=Ii,we.registerLanguage=pt,we.runHooks=yn,we.setHighlightTheme=Wi,we.setLang=An,we.setStyle=dr,we.setThemeVars=Zi,we.t=gt,we.transformHtml=Ni,Object.defineProperties(we,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})}));
