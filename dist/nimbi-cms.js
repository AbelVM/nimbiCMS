(function(ae,Ne){typeof exports=="object"&&typeof module<"u"?Ne(exports):typeof define=="function"&&define.amd?define(["exports"],Ne):(ae=typeof globalThis<"u"?globalThis:ae||self,Ne(ae.nimbiCMS={}))})(this,(function(ae){"use strict";const Ne={onPageLoad:[],onNavBuild:[],transformHtml:[]};function Et(t,e){if(!Object.prototype.hasOwnProperty.call(Ne,t))throw new Error('Unknown hook "'+t+'"');if(typeof e!="function")throw new TypeError("hook callback must be a function");Ne[t].push(e)}function gi(t){Et("onPageLoad",t)}function mi(t){Et("onNavBuild",t)}function wi(t){Et("transformHtml",t)}async function Vt(t,e){const n=Ne[t]||[];for(const i of n)try{await i(e)}catch(r){console.warn("[nimbi-cms] runHooks callback failed",r)}}function bi(){Object.keys(Ne).forEach(t=>{Ne[t].length=0})}function Dn(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Jt,qn;function ki(){if(qn)return Jt;qn=1;function t(d){return d instanceof Map?d.clear=d.delete=d.set=function(){throw new Error("map is read-only")}:d instanceof Set&&(d.add=d.clear=d.delete=function(){throw new Error("set is read-only")}),Object.freeze(d),Object.getOwnPropertyNames(d).forEach(x=>{const A=d[x],U=typeof A;(U==="object"||U==="function")&&!Object.isFrozen(A)&&t(A)}),d}class e{constructor(x){x.data===void 0&&(x.data={}),this.data=x.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function n(d){return d.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function i(d,...x){const A=Object.create(null);for(const U in d)A[U]=d[U];return x.forEach(function(U){for(const ue in U)A[ue]=U[ue]}),A}const r="</span>",s=d=>!!d.scope,a=(d,{prefix:x})=>{if(d.startsWith("language:"))return d.replace("language:","language-");if(d.includes(".")){const A=d.split(".");return[`${x}${A.shift()}`,...A.map((U,ue)=>`${U}${"_".repeat(ue+1)}`)].join(" ")}return`${x}${d}`};class o{constructor(x,A){this.buffer="",this.classPrefix=A.classPrefix,x.walk(this)}addText(x){this.buffer+=n(x)}openNode(x){if(!s(x))return;const A=a(x.scope,{prefix:this.classPrefix});this.span(A)}closeNode(x){s(x)&&(this.buffer+=r)}value(){return this.buffer}span(x){this.buffer+=`<span class="${x}">`}}const l=(d={})=>{const x={children:[]};return Object.assign(x,d),x};class u{constructor(){this.rootNode=l(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(x){this.top.children.push(x)}openNode(x){const A=l({scope:x});this.add(A),this.stack.push(A)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(x){return this.constructor._walk(x,this.rootNode)}static _walk(x,A){return typeof A=="string"?x.addText(A):A.children&&(x.openNode(A),A.children.forEach(U=>this._walk(x,U)),x.closeNode(A)),x}static _collapse(x){typeof x!="string"&&x.children&&(x.children.every(A=>typeof A=="string")?x.children=[x.children.join("")]:x.children.forEach(A=>{u._collapse(A)}))}}class h extends u{constructor(x){super(),this.options=x}addText(x){x!==""&&this.add(x)}startScope(x){this.openNode(x)}endScope(){this.closeNode()}__addSublanguage(x,A){const U=x.root;A&&(U.scope=`language:${A}`),this.add(U)}toHTML(){return new o(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function c(d){return d?typeof d=="string"?d:d.source:null}function p(d){return m("(?=",d,")")}function f(d){return m("(?:",d,")*")}function g(d){return m("(?:",d,")?")}function m(...d){return d.map(A=>c(A)).join("")}function w(d){const x=d[d.length-1];return typeof x=="object"&&x.constructor===Object?(d.splice(d.length-1,1),x):{}}function y(...d){return"("+(w(d).capture?"":"?:")+d.map(U=>c(U)).join("|")+")"}function S(d){return new RegExp(d.toString()+"|").exec("").length-1}function N(d,x){const A=d&&d.exec(x);return A&&A.index===0}const _=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function z(d,{joinWith:x}){let A=0;return d.map(U=>{A+=1;const ue=A;let he=c(U),P="";for(;he.length>0;){const L=_.exec(he);if(!L){P+=he;break}P+=he.substring(0,L.index),he=he.substring(L.index+L[0].length),L[0][0]==="\\"&&L[1]?P+="\\"+String(Number(L[1])+ue):(P+=L[0],L[0]==="("&&A++)}return P}).map(U=>`(${U})`).join(x)}const I=/\b\B/,te="[a-zA-Z]\\w*",ce="[a-zA-Z_]\\w*",ne="\\b\\d+(\\.\\d+)?",J="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",F="\\b(0b[01]+)",C="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",Q=(d={})=>{const x=/^#![ ]*\//;return d.binary&&(d.begin=m(x,/.*\b/,d.binary,/\b.*/)),i({scope:"meta",begin:x,end:/$/,relevance:0,"on:begin":(A,U)=>{A.index!==0&&U.ignoreMatch()}},d)},M={begin:"\\\\[\\s\\S]",relevance:0},v={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[M]},b={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[M]},R={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},k=function(d,x,A={}){const U=i({scope:"comment",begin:d,end:x,contains:[]},A);U.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const ue=y("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return U.contains.push({begin:m(/[ ]+/,"(",ue,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),U},B=k("//","$"),Y=k("/\\*","\\*/"),le=k("#","$"),Te={scope:"number",begin:ne,relevance:0},Ee={scope:"number",begin:J,relevance:0},xe={scope:"number",begin:F,relevance:0},me={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[M,{begin:/\[/,end:/\]/,relevance:0,contains:[M]}]},Ce={scope:"title",begin:te,relevance:0},He={scope:"title",begin:ce,relevance:0},ba={begin:"\\.\\s*"+ce,relevance:0};var Wt=Object.freeze({__proto__:null,APOS_STRING_MODE:v,BACKSLASH_ESCAPE:M,BINARY_NUMBER_MODE:xe,BINARY_NUMBER_RE:F,COMMENT:k,C_BLOCK_COMMENT_MODE:Y,C_LINE_COMMENT_MODE:B,C_NUMBER_MODE:Ee,C_NUMBER_RE:J,END_SAME_AS_BEGIN:function(d){return Object.assign(d,{"on:begin":(x,A)=>{A.data._beginMatch=x[1]},"on:end":(x,A)=>{A.data._beginMatch!==x[1]&&A.ignoreMatch()}})},HASH_COMMENT_MODE:le,IDENT_RE:te,MATCH_NOTHING_RE:I,METHOD_GUARD:ba,NUMBER_MODE:Te,NUMBER_RE:ne,PHRASAL_WORDS_MODE:R,QUOTE_STRING_MODE:b,REGEXP_MODE:me,RE_STARTERS_RE:C,SHEBANG:Q,TITLE_MODE:Ce,UNDERSCORE_IDENT_RE:ce,UNDERSCORE_TITLE_MODE:He});function ka(d,x){d.input[d.index-1]==="."&&x.ignoreMatch()}function ya(d,x){d.className!==void 0&&(d.scope=d.className,delete d.className)}function xa(d,x){x&&d.beginKeywords&&(d.begin="\\b("+d.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",d.__beforeBegin=ka,d.keywords=d.keywords||d.beginKeywords,delete d.beginKeywords,d.relevance===void 0&&(d.relevance=0))}function Sa(d,x){Array.isArray(d.illegal)&&(d.illegal=y(...d.illegal))}function va(d,x){if(d.match){if(d.begin||d.end)throw new Error("begin & end are not supported with match");d.begin=d.match,delete d.match}}function Ea(d,x){d.relevance===void 0&&(d.relevance=1)}const Ra=(d,x)=>{if(!d.beforeMatch)return;if(d.starts)throw new Error("beforeMatch cannot be used with starts");const A=Object.assign({},d);Object.keys(d).forEach(U=>{delete d[U]}),d.keywords=A.keywords,d.begin=m(A.beforeMatch,p(A.begin)),d.starts={relevance:0,contains:[Object.assign(A,{endsParent:!0})]},d.relevance=0,delete A.beforeMatch},Aa=["of","and","for","in","not","or","if","then","parent","list","value"],Ta="keyword";function Jr(d,x,A=Ta){const U=Object.create(null);return typeof d=="string"?ue(A,d.split(" ")):Array.isArray(d)?ue(A,d):Object.keys(d).forEach(function(he){Object.assign(U,Jr(d[he],x,he))}),U;function ue(he,P){x&&(P=P.map(L=>L.toLowerCase())),P.forEach(function(L){const D=L.split("|");U[D[0]]=[he,Ca(D[0],D[1])]})}}function Ca(d,x){return x?Number(x):_a(d)?0:1}function _a(d){return Aa.includes(d.toLowerCase())}const ei={},Je=d=>{console.error(d)},ti=(d,...x)=>{console.log(`WARN: ${d}`,...x)},at=(d,x)=>{ei[`${d}/${x}`]||(console.log(`Deprecated as of ${d}. ${x}`),ei[`${d}/${x}`]=!0)},Zt=new Error;function ni(d,x,{key:A}){let U=0;const ue=d[A],he={},P={};for(let L=1;L<=x.length;L++)P[L+U]=ue[L],he[L+U]=!0,U+=S(x[L-1]);d[A]=P,d[A]._emit=he,d[A]._multi=!0}function La(d){if(Array.isArray(d.begin)){if(d.skip||d.excludeBegin||d.returnBegin)throw Je("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),Zt;if(typeof d.beginScope!="object"||d.beginScope===null)throw Je("beginScope must be object"),Zt;ni(d,d.begin,{key:"beginScope"}),d.begin=z(d.begin,{joinWith:""})}}function Ma(d){if(Array.isArray(d.end)){if(d.skip||d.excludeEnd||d.returnEnd)throw Je("skip, excludeEnd, returnEnd not compatible with endScope: {}"),Zt;if(typeof d.endScope!="object"||d.endScope===null)throw Je("endScope must be object"),Zt;ni(d,d.end,{key:"endScope"}),d.end=z(d.end,{joinWith:""})}}function Pa(d){d.scope&&typeof d.scope=="object"&&d.scope!==null&&(d.beginScope=d.scope,delete d.scope)}function $a(d){Pa(d),typeof d.beginScope=="string"&&(d.beginScope={_wrap:d.beginScope}),typeof d.endScope=="string"&&(d.endScope={_wrap:d.endScope}),La(d),Ma(d)}function Ia(d){function x(P,L){return new RegExp(c(P),"m"+(d.case_insensitive?"i":"")+(d.unicodeRegex?"u":"")+(L?"g":""))}class A{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(L,D){D.position=this.position++,this.matchIndexes[this.matchAt]=D,this.regexes.push([D,L]),this.matchAt+=S(L)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const L=this.regexes.map(D=>D[1]);this.matcherRe=x(z(L,{joinWith:"|"}),!0),this.lastIndex=0}exec(L){this.matcherRe.lastIndex=this.lastIndex;const D=this.matcherRe.exec(L);if(!D)return null;const fe=D.findIndex((vt,Mn)=>Mn>0&&vt!==void 0),de=this.matchIndexes[fe];return D.splice(0,fe),Object.assign(D,de)}}class U{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(L){if(this.multiRegexes[L])return this.multiRegexes[L];const D=new A;return this.rules.slice(L).forEach(([fe,de])=>D.addRule(fe,de)),D.compile(),this.multiRegexes[L]=D,D}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(L,D){this.rules.push([L,D]),D.type==="begin"&&this.count++}exec(L){const D=this.getMatcher(this.regexIndex);D.lastIndex=this.lastIndex;let fe=D.exec(L);if(this.resumingScanAtSamePosition()&&!(fe&&fe.index===this.lastIndex)){const de=this.getMatcher(0);de.lastIndex=this.lastIndex+1,fe=de.exec(L)}return fe&&(this.regexIndex+=fe.position+1,this.regexIndex===this.count&&this.considerAll()),fe}}function ue(P){const L=new U;return P.contains.forEach(D=>L.addRule(D.begin,{rule:D,type:"begin"})),P.terminatorEnd&&L.addRule(P.terminatorEnd,{type:"end"}),P.illegal&&L.addRule(P.illegal,{type:"illegal"}),L}function he(P,L){const D=P;if(P.isCompiled)return D;[ya,va,$a,Ra].forEach(de=>de(P,L)),d.compilerExtensions.forEach(de=>de(P,L)),P.__beforeBegin=null,[xa,Sa,Ea].forEach(de=>de(P,L)),P.isCompiled=!0;let fe=null;return typeof P.keywords=="object"&&P.keywords.$pattern&&(P.keywords=Object.assign({},P.keywords),fe=P.keywords.$pattern,delete P.keywords.$pattern),fe=fe||/\w+/,P.keywords&&(P.keywords=Jr(P.keywords,d.case_insensitive)),D.keywordPatternRe=x(fe,!0),L&&(P.begin||(P.begin=/\B|\b/),D.beginRe=x(D.begin),!P.end&&!P.endsWithParent&&(P.end=/\B|\b/),P.end&&(D.endRe=x(D.end)),D.terminatorEnd=c(D.end)||"",P.endsWithParent&&L.terminatorEnd&&(D.terminatorEnd+=(P.end?"|":"")+L.terminatorEnd)),P.illegal&&(D.illegalRe=x(P.illegal)),P.contains||(P.contains=[]),P.contains=[].concat(...P.contains.map(function(de){return Ba(de==="self"?P:de)})),P.contains.forEach(function(de){he(de,D)}),P.starts&&he(P.starts,L),D.matcher=ue(D),D}if(d.compilerExtensions||(d.compilerExtensions=[]),d.contains&&d.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return d.classNameAliases=i(d.classNameAliases||{}),he(d)}function ri(d){return d?d.endsWithParent||ri(d.starts):!1}function Ba(d){return d.variants&&!d.cachedVariants&&(d.cachedVariants=d.variants.map(function(x){return i(d,{variants:null},x)})),d.cachedVariants?d.cachedVariants:ri(d)?i(d,{starts:d.starts?i(d.starts):null}):Object.isFrozen(d)?i(d):d}var za="11.11.1";class Oa extends Error{constructor(x,A){super(x),this.name="HTMLInjectionError",this.html=A}}const Ln=n,ii=i,si=Symbol("nomatch"),Na=7,ai=function(d){const x=Object.create(null),A=Object.create(null),U=[];let ue=!0;const he="Could not find the language '{}', did you forget to load/include a language module?",P={disableAutodetect:!0,name:"Plain text",contains:[]};let L={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:h};function D(E){return L.noHighlightRe.test(E)}function fe(E){let O=E.className+" ";O+=E.parentNode?E.parentNode.className:"";const G=L.languageDetectRe.exec(O);if(G){const ie=Qe(G[1]);return ie||(ti(he.replace("{}",G[1])),ti("Falling back to no-highlight mode for this block.",E)),ie?G[1]:"no-highlight"}return O.split(/\s+/).find(ie=>D(ie)||Qe(ie))}function de(E,O,G){let ie="",pe="";typeof O=="object"?(ie=E,G=O.ignoreIllegals,pe=O.language):(at("10.7.0","highlight(lang, code, ...args) has been deprecated."),at("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),pe=E,ie=O),G===void 0&&(G=!0);const $e={code:ie,language:pe};Gt("before:highlight",$e);const Ge=$e.result?$e.result:vt($e.language,$e.code,G);return Ge.code=$e.code,Gt("after:highlight",Ge),Ge}function vt(E,O,G,ie){const pe=Object.create(null);function $e(T,$){return T.keywords[$]}function Ge(){if(!j.keywords){we.addText(se);return}let T=0;j.keywordPatternRe.lastIndex=0;let $=j.keywordPatternRe.exec(se),W="";for(;$;){W+=se.substring(T,$.index);const ee=Oe.case_insensitive?$[0].toLowerCase():$[0],Se=$e(j,ee);if(Se){const[Ue,tl]=Se;if(we.addText(W),W="",pe[ee]=(pe[ee]||0)+1,pe[ee]<=Na&&(Kt+=tl),Ue.startsWith("_"))W+=$[0];else{const nl=Oe.classNameAliases[Ue]||Ue;ze($[0],nl)}}else W+=$[0];T=j.keywordPatternRe.lastIndex,$=j.keywordPatternRe.exec(se)}W+=se.substring(T),we.addText(W)}function Xt(){if(se==="")return;let T=null;if(typeof j.subLanguage=="string"){if(!x[j.subLanguage]){we.addText(se);return}T=vt(j.subLanguage,se,!0,fi[j.subLanguage]),fi[j.subLanguage]=T._top}else T=Pn(se,j.subLanguage.length?j.subLanguage:null);j.relevance>0&&(Kt+=T.relevance),we.__addSublanguage(T._emitter,T.language)}function _e(){j.subLanguage!=null?Xt():Ge(),se=""}function ze(T,$){T!==""&&(we.startScope($),we.addText(T),we.endScope())}function ui(T,$){let W=1;const ee=$.length-1;for(;W<=ee;){if(!T._emit[W]){W++;continue}const Se=Oe.classNameAliases[T[W]]||T[W],Ue=$[W];Se?ze(Ue,Se):(se=Ue,Ge(),se=""),W++}}function hi(T,$){return T.scope&&typeof T.scope=="string"&&we.openNode(Oe.classNameAliases[T.scope]||T.scope),T.beginScope&&(T.beginScope._wrap?(ze(se,Oe.classNameAliases[T.beginScope._wrap]||T.beginScope._wrap),se=""):T.beginScope._multi&&(ui(T.beginScope,$),se="")),j=Object.create(T,{parent:{value:j}}),j}function di(T,$,W){let ee=N(T.endRe,W);if(ee){if(T["on:end"]){const Se=new e(T);T["on:end"]($,Se),Se.isMatchIgnored&&(ee=!1)}if(ee){for(;T.endsParent&&T.parent;)T=T.parent;return T}}if(T.endsWithParent)return di(T.parent,$,W)}function Ya(T){return j.matcher.regexIndex===0?(se+=T[0],1):(zn=!0,0)}function Ka(T){const $=T[0],W=T.rule,ee=new e(W),Se=[W.__beforeBegin,W["on:begin"]];for(const Ue of Se)if(Ue&&(Ue(T,ee),ee.isMatchIgnored))return Ya($);return W.skip?se+=$:(W.excludeBegin&&(se+=$),_e(),!W.returnBegin&&!W.excludeBegin&&(se=$)),hi(W,T),W.returnBegin?0:$.length}function Va(T){const $=T[0],W=O.substring(T.index),ee=di(j,T,W);if(!ee)return si;const Se=j;j.endScope&&j.endScope._wrap?(_e(),ze($,j.endScope._wrap)):j.endScope&&j.endScope._multi?(_e(),ui(j.endScope,T)):Se.skip?se+=$:(Se.returnEnd||Se.excludeEnd||(se+=$),_e(),Se.excludeEnd&&(se=$));do j.scope&&we.closeNode(),!j.skip&&!j.subLanguage&&(Kt+=j.relevance),j=j.parent;while(j!==ee.parent);return ee.starts&&hi(ee.starts,T),Se.returnEnd?0:$.length}function Ja(){const T=[];for(let $=j;$!==Oe;$=$.parent)$.scope&&T.unshift($.scope);T.forEach($=>we.openNode($))}let Yt={};function pi(T,$){const W=$&&$[0];if(se+=T,W==null)return _e(),0;if(Yt.type==="begin"&&$.type==="end"&&Yt.index===$.index&&W===""){if(se+=O.slice($.index,$.index+1),!ue){const ee=new Error(`0 width match regex (${E})`);throw ee.languageName=E,ee.badRule=Yt.rule,ee}return 1}if(Yt=$,$.type==="begin")return Ka($);if($.type==="illegal"&&!G){const ee=new Error('Illegal lexeme "'+W+'" for mode "'+(j.scope||"<unnamed>")+'"');throw ee.mode=j,ee}else if($.type==="end"){const ee=Va($);if(ee!==si)return ee}if($.type==="illegal"&&W==="")return se+=`
`,1;if(Bn>1e5&&Bn>$.index*3)throw new Error("potential infinite loop, way more iterations than matches");return se+=W,W.length}const Oe=Qe(E);if(!Oe)throw Je(he.replace("{}",E)),new Error('Unknown language: "'+E+'"');const el=Ia(Oe);let In="",j=ie||el;const fi={},we=new L.__emitter(L);Ja();let se="",Kt=0,et=0,Bn=0,zn=!1;try{if(Oe.__emitTokens)Oe.__emitTokens(O,we);else{for(j.matcher.considerAll();;){Bn++,zn?zn=!1:j.matcher.considerAll(),j.matcher.lastIndex=et;const T=j.matcher.exec(O);if(!T)break;const $=O.substring(et,T.index),W=pi($,T);et=T.index+W}pi(O.substring(et))}return we.finalize(),In=we.toHTML(),{language:E,value:In,relevance:Kt,illegal:!1,_emitter:we,_top:j}}catch(T){if(T.message&&T.message.includes("Illegal"))return{language:E,value:Ln(O),illegal:!0,relevance:0,_illegalBy:{message:T.message,index:et,context:O.slice(et-100,et+100),mode:T.mode,resultSoFar:In},_emitter:we};if(ue)return{language:E,value:Ln(O),illegal:!1,relevance:0,errorRaised:T,_emitter:we,_top:j};throw T}}function Mn(E){const O={value:Ln(E),illegal:!1,relevance:0,_top:P,_emitter:new L.__emitter(L)};return O._emitter.addText(E),O}function Pn(E,O){O=O||L.languages||Object.keys(x);const G=Mn(E),ie=O.filter(Qe).filter(ci).map(_e=>vt(_e,E,!1));ie.unshift(G);const pe=ie.sort((_e,ze)=>{if(_e.relevance!==ze.relevance)return ze.relevance-_e.relevance;if(_e.language&&ze.language){if(Qe(_e.language).supersetOf===ze.language)return 1;if(Qe(ze.language).supersetOf===_e.language)return-1}return 0}),[$e,Ge]=pe,Xt=$e;return Xt.secondBest=Ge,Xt}function Da(E,O,G){const ie=O&&A[O]||G;E.classList.add("hljs"),E.classList.add(`language-${ie}`)}function $n(E){let O=null;const G=fe(E);if(D(G))return;if(Gt("before:highlightElement",{el:E,language:G}),E.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",E);return}if(E.children.length>0&&(L.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(E)),L.throwUnescapedHTML))throw new Oa("One of your code blocks includes unescaped HTML.",E.innerHTML);O=E;const ie=O.textContent,pe=G?de(ie,{language:G,ignoreIllegals:!0}):Pn(ie);E.innerHTML=pe.value,E.dataset.highlighted="yes",Da(E,G,pe.language),E.result={language:pe.language,re:pe.relevance,relevance:pe.relevance},pe.secondBest&&(E.secondBest={language:pe.secondBest.language,relevance:pe.secondBest.relevance}),Gt("after:highlightElement",{el:E,result:pe,text:ie})}function qa(E){L=ii(L,E)}const Ha=()=>{Qt(),at("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function Ua(){Qt(),at("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let li=!1;function Qt(){function E(){Qt()}if(document.readyState==="loading"){li||window.addEventListener("DOMContentLoaded",E,!1),li=!0;return}document.querySelectorAll(L.cssSelector).forEach($n)}function ja(E,O){let G=null;try{G=O(d)}catch(ie){if(Je("Language definition for '{}' could not be registered.".replace("{}",E)),ue)Je(ie);else throw ie;G=P}G.name||(G.name=E),x[E]=G,G.rawDefinition=O.bind(null,d),G.aliases&&oi(G.aliases,{languageName:E})}function Fa(E){delete x[E];for(const O of Object.keys(A))A[O]===E&&delete A[O]}function Wa(){return Object.keys(x)}function Qe(E){return E=(E||"").toLowerCase(),x[E]||x[A[E]]}function oi(E,{languageName:O}){typeof E=="string"&&(E=[E]),E.forEach(G=>{A[G.toLowerCase()]=O})}function ci(E){const O=Qe(E);return O&&!O.disableAutodetect}function Za(E){E["before:highlightBlock"]&&!E["before:highlightElement"]&&(E["before:highlightElement"]=O=>{E["before:highlightBlock"](Object.assign({block:O.el},O))}),E["after:highlightBlock"]&&!E["after:highlightElement"]&&(E["after:highlightElement"]=O=>{E["after:highlightBlock"](Object.assign({block:O.el},O))})}function Qa(E){Za(E),U.push(E)}function Ga(E){const O=U.indexOf(E);O!==-1&&U.splice(O,1)}function Gt(E,O){const G=E;U.forEach(function(ie){ie[G]&&ie[G](O)})}function Xa(E){return at("10.7.0","highlightBlock will be removed entirely in v12.0"),at("10.7.0","Please use highlightElement now."),$n(E)}Object.assign(d,{highlight:de,highlightAuto:Pn,highlightAll:Qt,highlightElement:$n,highlightBlock:Xa,configure:qa,initHighlighting:Ha,initHighlightingOnLoad:Ua,registerLanguage:ja,unregisterLanguage:Fa,listLanguages:Wa,getLanguage:Qe,registerAliases:oi,autoDetection:ci,inherit:ii,addPlugin:Qa,removePlugin:Ga}),d.debugMode=function(){ue=!1},d.safeMode=function(){ue=!0},d.versionString=za,d.regex={concat:m,lookahead:p,either:y,optional:g,anyNumberOfTimes:f};for(const E in Wt)typeof Wt[E]=="object"&&t(Wt[E]);return Object.assign(d,Wt),d},lt=ai({});return lt.newInstance=()=>ai({}),Jt=lt,lt.HighlightJS=lt,lt.default=lt,Jt}var yi=ki();const oe=Dn(yi),V=new Map,xi="https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md",De={shell:"bash",sh:"bash",zsh:"bash",js:"javascript",ts:"typescript",py:"python",csharp:"cs","c#":"cs"},en=new Set(["magic","undefined"]);let tt=null;const Hn=new Map,Si=300*1e3;async function tn(t=xi){if(t)return tt||(tt=(async()=>{try{const e=await fetch(t);if(!e.ok)return;const i=(await e.text()).split(/\r?\n/);let r=-1;for(let u=0;u<i.length;u++)if(/\|\s*Language\s*\|/i.test(i[u])){r=u;break}if(r===-1)return;const s=i[r].replace(/^\||\|$/g,"").split("|").map(u=>u.trim().toLowerCase());let a=s.findIndex(u=>/alias|aliases|equivalent|alt|alternates?/i.test(u));a===-1&&(a=1);let o=s.findIndex(u=>/file|filename|module|module name|module-name|short|slug/i.test(u));if(o===-1){const u=s.findIndex(h=>/language/i.test(h));o=u!==-1?u:0}let l=[];for(let u=r+1;u<i.length;u++){const h=i[u].trim();if(!h||!h.startsWith("|"))break;const c=h.replace(/^\||\|$/g,"").split("|").map(w=>w.trim());if(c.every(w=>/^-+$/.test(w)))continue;const p=c;if(!p.length)continue;const g=(p[o]||p[0]||"").toString().trim().toLowerCase();if(!g||/^-+$/.test(g))continue;V.set(g,g);const m=p[a]||"";if(m){const w=String(m).split(",").map(y=>y.replace(/`/g,"").trim()).filter(Boolean);if(w.length){const S=w[0].toLowerCase().replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");S&&/[a-z0-9]/i.test(S)&&(V.set(S,S),l.push(S))}}}try{const u=[];for(const h of l){const c=String(h||"").replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");c&&/[a-z0-9]/i.test(c)?u.push(c):V.delete(h)}l=u}catch(u){console.warn("[codeblocksManager] cleanup aliases failed",u)}try{let u=0;for(const h of Array.from(V.keys())){if(!h||/^-+$/.test(h)||!/[a-z0-9]/i.test(h)){V.delete(h),u++;continue}if(/^[:]+/.test(h)){const c=h.replace(/^[:]+/,"");if(c&&/[a-z0-9]/i.test(c)){const p=V.get(h);V.delete(h),V.set(c,p)}else V.delete(h),u++}}for(const[h,c]of Array.from(V.entries()))(!c||/^-+$/.test(c)||!/[a-z0-9]/i.test(c))&&(V.delete(h),u++);try{const h=":---------------------";V.has(h)&&(V.delete(h),u++)}catch(h){console.warn("[codeblocksManager] remove sep key failed",h)}try{const h=Array.from(V.keys()).sort()}catch(h){console.warn("[codeblocksManager] compute supported keys failed",h)}}catch(u){console.warn("[codeblocksManager] ignored error",u)}}catch(e){console.warn("[codeblocksManager] loadSupportedLanguages failed",e)}})(),tt)}const nn=new Set;async function nt(t,e){if(tt||(async()=>{try{await tn()}catch(r){console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed",r)}})(),t=t==null?"":String(t),t=t.trim(),!t)return!1;const n=t.toLowerCase();if(en.has(n))return!1;if(V.size&&!V.has(n)){const r=De;if(!r[n]&&!r[t])return!1}if(nn.has(t))return!0;const i=De;try{const r=(e||t||"").toString().replace(/\.js$/i,"").trim(),s=Array.from(new Set([r,t,i[r],i[t]].filter(Boolean))).map(l=>String(l).toLowerCase()).filter(l=>l&&l!=="undefined");let a=null,o=null;for(const l of s)try{const u=Date.now(),h=Hn.get(l);if(h){if(h.ok===!1&&u-(h.ts||0)<Si)a=null;else if(h.module)a=h.module;else if(h.promise)try{a=await h.promise}catch{a=null}}else{const c={promise:null,module:null,ok:null,ts:0};Hn.set(l,c),c.promise=(async()=>{try{try{return await import(`highlight.js/lib/languages/${l}.js`)}catch{try{const f=`https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${l}.js`;return await new Function("u","return import(u)")(f)}catch{try{const g=`https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${l}.js`;return await new Function("u","return import(u)")(g)}catch{return null}}}}catch{return null}})();try{a=await c.promise,c.module=a,c.ok=!!a,c.ts=Date.now()}catch{c.module=null,c.ok=!1,c.ts=Date.now(),a=null}}if(a){const c=a.default||a;try{const p=V.size&&V.get(t)||l||t;return oe.registerLanguage(p,c),nn.add(p),p!==t&&(oe.registerLanguage(t,c),nn.add(t)),!0}catch(p){o=p}}}catch(u){o=u}if(o)throw o;return!1}catch{return!1}}let Rt=null;function Un(t=document){tt||(async()=>{try{await tn()}catch(s){console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed",s)}})();const e=De,i=Rt||(typeof IntersectionObserver>"u"?null:(Rt=new IntersectionObserver((s,a)=>{s.forEach(o=>{if(!o.isIntersecting)return;const l=o.target;try{a.unobserve(l)}catch(u){console.warn("[codeblocksManager] observer unobserve failed",u)}(async()=>{try{const u=l.getAttribute&&l.getAttribute("class")||l.className||"",h=u.match(/language-([a-zA-Z0-9_+-]+)/)||u.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(h&&h[1]){const c=(h[1]||"").toLowerCase(),p=e[c]||c,f=V.size&&(V.get(p)||V.get(String(p).toLowerCase()))||p;try{await nt(f)}catch(g){console.warn("[codeblocksManager] registerLanguage failed",g)}try{oe.highlightElement(l)}catch(g){console.warn("[codeblocksManager] hljs.highlightElement failed",g)}}else try{const c=l.textContent||"";try{if(oe&&typeof oe.getLanguage=="function"&&oe.getLanguage("plaintext")){const p=oe.highlight(c,{language:"plaintext"});p&&p.value&&(l.innerHTML=p.value)}}catch{try{oe.highlightElement(l)}catch(f){console.warn("[codeblocksManager] fallback highlightElement failed",f)}}}catch(c){console.warn("[codeblocksManager] auto-detect plaintext failed",c)}}catch(u){console.warn("[codeblocksManager] observer entry processing failed",u)}})()})},{root:null,rootMargin:"300px",threshold:.1}),Rt)),r=t&&t.querySelectorAll?t.querySelectorAll("pre code"):[];if(!i){r.forEach(async s=>{try{const a=s.getAttribute&&s.getAttribute("class")||s.className||"",o=a.match(/language-([a-zA-Z0-9_+-]+)/)||a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(o&&o[1]){const l=(o[1]||"").toLowerCase(),u=e[l]||l,h=V.size&&(V.get(u)||V.get(String(u).toLowerCase()))||u;try{await nt(h)}catch(c){console.warn("[codeblocksManager] registerLanguage failed (no observer)",c)}}try{oe.highlightElement(s)}catch(l){console.warn("[codeblocksManager] hljs.highlightElement failed (no observer)",l)}}catch(a){console.warn("[codeblocksManager] loadSupportedLanguages fallback ignored error",a)}});return}r.forEach(s=>{try{i.observe(s)}catch(a){console.warn("[codeblocksManager] observe failed",a)}})}function vi(t,{useCdn:e=!0}={}){const n=document.querySelector("link[data-hl-theme]");n&&n.remove();let i=t||"monokai";if(i==="monokai")return;if(!e){console.warn("Requested highlight theme not bundled; set useCdn=true to load from CDN");return}const r=`https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/styles/${i}.css`,s=document.createElement("link");s.rel="stylesheet",s.href=r,s.setAttribute("data-hl-theme",i),document.head.appendChild(s)}let rn="light";function Ei(t,e={}){if(document.querySelector(`link[href="${t}"]`))return;const n=document.createElement("link");n.rel="stylesheet",n.href=t,Object.entries(e).forEach(([i,r])=>n.setAttribute(i,r)),document.head.appendChild(n)}async function jn(t="none",e="/"){if(!t||t==="none")return;const n=[e+"bulma.css","/bulma.css"],i=Array.from(new Set(n));if(t==="local"){if(document.querySelector("style[data-bulma-override]"))return;for(const r of i)try{const s=await fetch(r,{method:"GET"});if(s.ok){const a=await s.text(),o=document.createElement("style");o.setAttribute("data-bulma-override",r),o.appendChild(document.createTextNode(`
/* bulma override: ${r} */
`+a)),document.head.appendChild(o);return}}catch(s){console.warn("[bulmaManager] fetch local bulma candidate failed",s)}return}try{const r=String(t).trim();if(!r)return;const s=`https://unpkg.com/bulmaswatch/${encodeURIComponent(r)}/bulmaswatch.min.css`;Ei(s,{"data-bulmaswatch-theme":r})}catch(r){console.warn("[bulmaManager] ensureBulma failed",r)}}function Fn(t){rn=t==="dark"?"dark":"light",document.documentElement.setAttribute("data-theme",rn),rn==="dark"?document.body.classList.add("is-dark"):document.body.classList.remove("is-dark")}function Ri(t){const e=document.documentElement;for(const[n,i]of Object.entries(t||{}))try{e.style.setProperty(`--${n}`,i)}catch(r){console.warn("[bulmaManager] setThemeVars failed for",n,r)}}const Wn={en:{navigation:"Navigation",onThisPage:"On this page",home:"Home",scrollToTop:"Scroll to top",readingTime:"{minutes} min read",searchPlaceholder:"Search…",imagePreviewTitle:"Image preview",imagePreviewFit:"Fit to screen",imagePreviewOriginal:"Original size",imagePreviewZoomOut:"Zoom out",imagePreviewZoomIn:"Zoom in",imagePreviewClose:"Close"},es:{navigation:"Navegación",onThisPage:"En esta página",home:"Inicio",scrollToTop:"Ir arriba",readingTime:"{minutes} min de lectura",searchPlaceholder:"Buscar…",imagePreviewTitle:"Previsualización de imagen",imagePreviewFit:"Ajustar a la pantalla",imagePreviewOriginal:"Tamaño original",imagePreviewZoomOut:"Alejar",imagePreviewZoomIn:"Acercar",imagePreviewClose:"Cerrar"},de:{navigation:"Navigation",onThisPage:"Auf dieser Seite",home:"Startseite",scrollToTop:"Nach oben",readingTime:"{minutes} min Lesezeit",searchPlaceholder:"Suchen…",imagePreviewTitle:"Bildvorschau",imagePreviewFit:"An Bildschirm anpassen",imagePreviewOriginal:"Originalgröße",imagePreviewZoomOut:"Verkleinern",imagePreviewZoomIn:"Vergrößern",imagePreviewClose:"Schließen"},fr:{navigation:"Navigation",onThisPage:"Sur cette page",home:"Accueil",scrollToTop:"Aller en haut",readingTime:"{minutes} min de lecture",searchPlaceholder:"Rechercher…",imagePreviewTitle:"Aperçu de l’image",imagePreviewFit:"Ajuster à l’écran",imagePreviewOriginal:"Taille originale",imagePreviewZoomOut:"Dézoomer",imagePreviewZoomIn:"Zoomer",imagePreviewClose:"Fermer"},pt:{navigation:"Navegação",onThisPage:"Nesta página",home:"Início",scrollToTop:"Ir para o topo",readingTime:"{minutes} min de leitura",searchPlaceholder:"Procurar…",imagePreviewTitle:"Visualização da imagem",imagePreviewFit:"Ajustar à tela",imagePreviewOriginal:"Tamanho original",imagePreviewZoomOut:"Diminuir",imagePreviewZoomIn:"Aumentar",imagePreviewClose:"Fechar"}},rt=JSON.parse(JSON.stringify(Wn));let At="en";if(typeof navigator<"u"){const t=navigator.language||navigator.languages&&navigator.languages[0]||"en";At=String(t).split("-")[0].toLowerCase()}Wn[At]||(At="en");let je=At;function it(t,e={}){const n=rt[je]||rt.en;let i=n&&n[t]?n[t]:rt.en[t]||"";for(const r of Object.keys(e))i=i.replace(new RegExp(`{${r}}`,"g"),String(e[r]));return i}async function sn(t,e){if(!t)return;let n=t;try{/^https?:\/\//.test(t)||(n=new URL(t,location.origin+e).toString());const i=await fetch(n);if(!i.ok)return;const r=await i.json();for(const s of Object.keys(r||{}))rt[s]=Object.assign({},rt[s]||{},r[s])}catch{}}function an(t){const e=String(t).split("-")[0].toLowerCase();je=rt[e]?e:"en"}const Ai=Object.freeze(Object.defineProperty({__proto__:null,get currentLang(){return je},loadL10nFile:sn,setLang:an,t:it},Symbol.toStringTag,{value:"Module"})),Ti=`import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
`;function Zn(t,e="worker"){let n=null;function i(){if(!n)try{const o=t();n=o||null,o&&o.addEventListener("error",()=>{try{n===o&&(n=null,o.terminate&&o.terminate())}catch(l){console.warn("["+e+"] worker termination failed",l)}})}catch(o){n=null,console.warn("["+e+"] worker init failed",o)}return n}function r(){try{n&&(n.terminate&&n.terminate(),n=null)}catch(o){console.warn("["+e+"] worker termination failed",o)}}function s(o,l=1e3){return new Promise((u,h)=>{const c=i();if(!c)return h(new Error("worker unavailable"));const p=String(Math.random());o.id=p;let f=null;const g=()=>{f&&clearTimeout(f),c.removeEventListener("message",m),c.removeEventListener("error",w)},m=y=>{const S=y.data||{};S.id===p&&(g(),S.error?h(new Error(S.error)):u(S.result))},w=y=>{g(),console.warn("["+e+"] worker error event",y);try{n===c&&(n=null,c.terminate&&c.terminate())}catch(S){console.warn("["+e+"] worker termination failed",S)}h(new Error(y&&y.message||"worker error"))};f=setTimeout(()=>{g(),console.warn("["+e+"] worker timed out");try{n===c&&(n=null,c.terminate&&c.terminate())}catch(y){console.warn("["+e+"] worker termination on timeout failed",y)}h(new Error("worker timeout"))},l),c.addEventListener("message",m),c.addEventListener("error",w);try{c.postMessage(o)}catch(y){g(),h(y)}})}return{get:i,send:s,terminate:r}}function Ci(t){try{if(typeof Blob<"u"&&typeof URL<"u"&&t){const e=new Blob([t],{type:"application/javascript"}),n=URL.createObjectURL(e);return new Worker(n,{type:"module"})}}catch(e){console.warn("[worker-manager] createWorkerFromRaw failed",e)}return null}const Ie=new Set;function ln(t){_i(),Ie.clear();for(const e of Ae)e&&Ie.add(e);Qn(Z),Qn(H),ln._refreshed=!0}function Qn(t){if(!(!t||typeof t.values!="function"))for(const e of t.values())e&&Ie.add(e)}function Gn(t){if(!t||typeof t.set!="function")return;const e=t.set;t.set=function(n,i){return i&&Ie.add(i),e.call(this,n,i)}}let Xn=!1;function _i(){Xn||(Gn(Z),Gn(H),Xn=!0)}function Yn(t){return!t||typeof t!="string"?!1:/^(https?:)?\/\//.test(t)||t.startsWith("mailto:")||t.startsWith("tel:")}function ge(t){return String(t||"").replace(/^[.\/]+/,"")}function ot(t){return String(t||"").replace(/\/+$/,"")}function Tt(t){return ot(t)+"/"}function Li(t){try{if(!t||typeof document>"u"||!document.head||t.startsWith("data:")||document.head.querySelector(`link[rel="preload"][as="image"][href="${t}"]`))return;const n=document.createElement("link");n.rel="preload",n.as="image",n.href=t,document.head.appendChild(n)}catch(e){console.warn("[helpers] preloadImage failed",e)}}function Ct(t,e=0,n=!1){try{if(typeof window>"u"||!t||!t.querySelectorAll)return;const i=Array.from(t.querySelectorAll("img"));if(!i.length)return;const r=t,s=r&&r.getBoundingClientRect?r.getBoundingClientRect():null,a=0,o=typeof window<"u"&&(window.innerHeight||document.documentElement.clientHeight)||0,l=s?Math.max(a,s.top):a,h=(s?Math.min(o,s.bottom):o)+Number(e||0);let c=0;r&&(c=r.clientHeight||(s?s.height:0)),c||(c=o-a);let p=.6;try{const w=r&&window.getComputedStyle?window.getComputedStyle(r):null,y=w&&w.getPropertyValue("--nimbi-image-max-height-ratio"),S=y?parseFloat(y):NaN;!Number.isNaN(S)&&S>0&&S<=1&&(p=S)}catch(w){console.warn("[helpers] read CSS ratio failed",w)}const f=Math.max(200,Math.floor(c*p));let g=!1,m=null;if(i.forEach(w=>{try{const y=w.getAttribute?w.getAttribute("loading"):void 0;y!=="eager"&&w.setAttribute&&w.setAttribute("loading","lazy");const S=w.getBoundingClientRect?w.getBoundingClientRect():null,N=w.src||w.getAttribute&&w.getAttribute("src"),_=S&&S.height>1?S.height:f,z=S?S.top:0,I=z+_,te=!!(S&&_>0&&z<=h&&I>=l);te&&(w.setAttribute?(w.setAttribute("loading","eager"),w.setAttribute("fetchpriority","high"),w.setAttribute("data-eager-by-nimbi","1")):(w.loading="eager",w.fetchPriority="high"),Li(N),g=!0),!m&&S&&S.top<=h&&(m={img:w,src:N,rect:S,beforeLoading:y}),n&&console.log("[helpers] setEagerForAboveFoldImages:",{src:N,rect:S,marginPx:e,visibleTop:l,visibleBottom:h,beforeLoading:y,isAboveFold:te,effectiveHeight:_,maxImageHeight:f})}catch(y){console.warn("[helpers] setEagerForAboveFoldImages per-image failed",y)}}),!g&&m){const{img:w,src:y,rect:S,beforeLoading:N}=m;try{w.setAttribute?(w.setAttribute("loading","eager"),w.setAttribute("fetchpriority","high"),w.setAttribute("data-eager-by-nimbi","1")):(w.loading="eager",w.fetchPriority="high"),n&&console.log("[helpers] setEagerForAboveFoldImages (fallback first visible):",{src:y,rect:S,marginPx:e,visibleTop:l,visibleBottom:h,beforeLoading:N,fallback:!0})}catch(_){console.warn("[helpers] setEagerForAboveFoldImages fallback failed",_)}}}catch(i){console.warn("[helpers] setEagerForAboveFoldImages failed",i)}}function _t(t){try{const e=t();return e&&typeof e.then=="function"?e.catch(n=>{console.warn("[helpers] safe swallowed error",n)}):e}catch(e){console.warn("[helpers] safe swallowed error",e)}}try{typeof globalThis<"u"&&!globalThis.safe&&(globalThis.safe=_t)}catch(t){console.warn("[helpers] global attach failed",t)}const Z=new Map;let Re=[];function Kn(t){Re=Array.isArray(t)?t.slice():[]}function Mi(){return Re}const Vn=Zn(()=>Ci(Ti),"slugManager");function on(){return Vn.get()}function Jn(t){return Vn.send(t)}async function Pi(t,e=1,n=void 0){if(!on())return Bt(t,e,n);try{return await Jn({type:"buildSearchIndex",contentBase:t,indexDepth:e,noIndexing:n})}catch(r){try{return await Bt(t,e,n)}catch(s){throw console.warn("[slugManager] buildSearchIndex fallback failed",s),r}}}async function $i(t,e,n){return on()?Jn({type:"crawlForSlug",slug:t,base:e,maxQueue:n}):hn(t,e,n)}function Fe(t,e){if(t)if(Re&&Re.length){const i=e.split("/")[0],r=Re.includes(i);let s=Z.get(t);(!s||typeof s=="string")&&(s={default:typeof s=="string"?s:void 0,langs:{}}),r?s.langs[i]=e:s.default=e,Z.set(t,s)}else Z.set(t,e)}const Lt=new Set;function Ii(t){typeof t=="function"&&Lt.add(t)}function Bi(t){typeof t=="function"&&Lt.delete(t)}const H=new Map;let cn={},Ae=[],Mt="_404.md";function un(t){t!=null&&(Mt=String(t||""))}function zi(t){cn=t||{}}const ct=new Map,Pt=new Set;function Oi(){ct.clear(),Pt.clear()}function Ni(t){if(!t||t.length===0)return"";let e=t[0];for(let i=1;i<t.length;i++){const r=t[i];let s=0;const a=Math.min(e.length,r.length);for(;s<a&&e[s]===r[s];)s++;e=e.slice(0,s)}const n=e.lastIndexOf("/");return n===-1?e:e.slice(0,n+1)}function $t(t){Z.clear(),H.clear(),Ae=[],Re=Re||[];const e=Object.keys(cn||{});if(!e.length)return;let n="";try{if(t){try{/^[a-z][a-z0-9+.-]*:/i.test(String(t))?n=new URL(String(t)).pathname:n=String(t||"")}catch(i){n=String(t||""),console.warn("[slugManager] parse contentBase failed",i)}n=Tt(n)}}catch(i){n="",console.warn("[slugManager] setContentBase prefix derivation failed",i)}n||(n=Ni(e));for(const i of e){let r=i;n&&i.startsWith(n)?r=ge(i.slice(n.length)):r=ge(i),Ae.push(r);try{ln()}catch(a){console.warn("[slugManager] refreshIndexPaths failed",a)}const s=cn[i];if(typeof s=="string"){const a=(s||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const o=re(a[1].trim());if(o)try{if(Re&&Re.length){const u=r.split("/")[0],h=Re.includes(u);let c=Z.get(o);(!c||typeof c=="string")&&(c={default:typeof c=="string"?c:void 0,langs:{}}),h?c.langs[u]=r:c.default=r,Z.set(o,c)}else Z.set(o,r);H.set(r,o)}catch(l){console.warn("[slugManager] set slug mapping failed",l)}}}}}try{$t()}catch(t){console.warn("[slugManager] initial setContentBase failed",t)}function re(t){let e=String(t||"").toLowerCase().replace(/[^a-z0-9\- ]/g,"").replace(/ /g,"-");return e=e.replace(/(?:-?)(?:md|html)$/,""),e}function ut(t){if(!t||!Z.has(t))return null;const e=Z.get(t);if(!e)return null;if(typeof e=="string")return e;if(Re&&Re.length&&je&&e.langs&&e.langs[je])return e.langs[je];if(e.default)return e.default;if(e.langs){const n=Object.keys(e.langs);if(n.length)return e.langs[n[0]]}return null}const ht=new Map;function Di(){ht.clear()}let be=async function(t,e){if(!t)throw new Error("path required");try{const s=(String(t||"").match(/([^\/]+)\.md(?:$|[?#])/)||[])[1];if(s&&Z.has(s)){const a=ut(s)||Z.get(s);a&&a!==t&&(t=a)}}catch(s){console.warn("[slugManager] slug mapping normalization failed",s)}const n=e==null?"":ot(String(e));let i="";try{n?/^[a-z][a-z0-9+.-]*:/i.test(n)?i=n.replace(/\/$/,"")+"/"+t.replace(/^\//,""):i=(n.startsWith("/")?"":"/")+n.replace(/\/$/,"")+"/"+t.replace(/^\//,""):i="/"+t.replace(/^\//,"")}catch{i="/"+t.replace(/^\//,"")}if(ht.has(i))return ht.get(i);const r=(async()=>{const s=await fetch(i);if(!s||typeof s.ok!="boolean"||!s.ok){if(s&&s.status===404)try{const c=`${n}/${Mt}`,p=await globalThis.fetch(c);if(p&&typeof p.ok=="boolean"&&p.ok)return{raw:await p.text(),status:404}}catch(c){console.warn("[slugManager] fetching fallback 404 failed",c)}let h="";try{s&&typeof s.clone=="function"?h=await s.clone().text():s&&typeof s.text=="function"?h=await s.text():h=""}catch(c){h="",console.warn("[slugManager] reading error body failed",c)}throw console.error("fetchMarkdown failed:",{url:i,status:s?s.status:void 0,statusText:s?s.statusText:void 0,body:h.slice(0,200)}),new Error("failed to fetch md")}const a=await s.text(),o=a.trim().slice(0,16).toLowerCase(),l=o.startsWith("<!doctype")||o.startsWith("<html"),u=l||String(t||"").toLowerCase().endsWith(".html");if(l&&String(t||"").toLowerCase().endsWith(".md")){try{const h=`${n}/${Mt}`,c=await globalThis.fetch(h);if(c.ok)return{raw:await c.text(),status:404}}catch(h){console.warn("[slugManager] fetching fallback 404 failed",h)}throw console.error("fetchMarkdown: server returned HTML for .md request",i),new Error("failed to fetch md")}return u?{raw:a,isHtml:!0}:{raw:a}})();return ht.set(i,r),r};function qi(t){typeof t=="function"&&(be=t)}const It=new Map;let Xe=[],dt=null;async function Bt(t,e=1,n=void 0){if(Xe&&Xe.length&&e===1)return Xe;if(dt)return dt;dt=(async()=>{const i=Array.isArray(n)?Array.from(new Set((n||[]).map(l=>ge(String(l||""))))):null,r=l=>{if(!i||!i.length)return!1;for(const u of i)if(u&&(l===u||l.startsWith(u+"/")))return!0;return!1};let s=[];if(Ae&&Ae.length&&(s=Array.from(Ae)),!s.length)for(const l of Z.values())l&&s.push(l);try{const l=await rr(t);l&&l.length&&(s=s.concat(l))}catch(l){console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed",l)}try{const l=new Set(s),u=[...s];for(l.size;u.length&&l.size<=pt;){const h=u.shift();try{const c=await be(h,t);if(c&&c.raw){let p=c.raw;const f=[],g=/\[[^\]]+\]\(([^)]+)\)/g;let m;for(;m=g.exec(p);)f.push(m[1]);const w=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;m=w.exec(p);)f.push(m[1]);for(let y of f)/^[a-z][a-z0-9+.-]*:/i.test(y)||(y=ge(y),/\.(md|html?)(?:$|[?#])/i.test(y)&&(y=y.split(/[?#]/)[0],!r(y)&&(l.has(y)||(l.add(y),u.push(y),s.push(y)))))}}catch(c){console.warn("[slugManager] discovery fetch failed for",h,c)}}}catch(l){console.warn("[slugManager] discovery loop failed",l)}const a=new Set;s=s.filter(l=>!l||a.has(l)||r(l)?!1:(a.add(l),!0));const o=[];for(const l of s)if(/\.(?:md|html?)(?:$|[?#])/i.test(l))try{const u=await be(l,t);if(u&&u.raw){let h="",c="";if(u.isHtml)try{const g=new DOMParser().parseFromString(u.raw,"text/html"),m=g.querySelector("title")||g.querySelector("h1");m&&m.textContent&&(h=m.textContent.trim());const w=g.querySelector("p");if(w&&w.textContent&&(c=w.textContent.trim()),e===2)try{const y=g.querySelector("h1"),S=y&&y.textContent?y.textContent.trim():h||"",N=(()=>{try{if(H.has(l))return H.get(l)}catch{}return re(h||l)})(),_=Array.from(g.querySelectorAll("h2"));for(const z of _)try{const I=(z.textContent||"").trim();if(!I)continue;const te=z.id?z.id:re(I),ce=N?`${N}::${te}`:`${re(l)}::${te}`;let ne="",J=z.nextElementSibling;for(;J&&J.tagName&&J.tagName.toLowerCase()==="script";)J=J.nextElementSibling;J&&J.textContent&&(ne=String(J.textContent).trim()),o.push({slug:ce,title:I,excerpt:ne,path:l,parentTitle:S})}catch(I){console.warn("[slugManager] indexing H2 failed",I)}}catch(y){console.warn("[slugManager] collect H2s failed",y)}}catch(f){console.warn("[slugManager] parsing HTML for index failed",f)}else{const f=u.raw,g=f.match(/^#\s+(.+)$/m);h=g?g[1].trim():"";const m=f.split(/\r?\n\s*\r?\n/);if(m.length>1)for(let w=1;w<m.length;w++){const y=m[w].trim();if(y&&!/^#/.test(y)){c=y.replace(/\r?\n/g," ");break}}if(e===2)try{const w=(f.match(/^#\s+(.+)$/m)||[])[1],y=w?w.trim():"",S=(function(){try{if(H.has(l))return H.get(l)}catch{}return re(h||l)})(),N=/^##\s+(.+)$/gm;let _;for(;_=N.exec(f);)try{const z=(_[1]||"").trim();if(!z)continue;const I=re(z),te=S?`${S}::${I}`:`${re(l)}::${I}`,ne=f.slice(N.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),J=ne&&ne[1]?String(ne[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";o.push({slug:te,title:z,excerpt:J,path:l,parentTitle:y})}catch(z){console.warn("[slugManager] indexing markdown H2 failed",z)}}catch(w){console.warn("[slugManager] collect markdown H2s failed",w)}}let p="";try{H.has(l)&&(p=H.get(l))}catch(f){console.warn("[slugManager] mdToSlug access failed",f)}p||(p=re(h||l)),o.push({slug:p,title:h,excerpt:c,path:l})}}catch(u){console.warn("[slugManager] buildSearchIndex: entry fetch failed",u)}return Xe=o,Xe})();try{await dt}catch(i){console.warn("[slugManager] awaiting _indexPromise failed",i)}return dt=null,Xe}const er=1e3;let pt=er;function Hi(t){typeof t=="number"&&t>=0&&(pt=t)}const tr=new DOMParser,nr="a[href]";let hn=async function(t,e,n=pt){if(It.has(t))return It.get(t);let i=null;const r=new Set,s=[""];for(;s.length&&!i&&!(s.length>n);){const a=s.shift();if(r.has(a))continue;r.add(a);let o=e;o.endsWith("/")||(o+="/"),o+=a;try{const l=await globalThis.fetch(o);if(!l.ok)continue;const u=await l.text(),c=tr.parseFromString(u,"text/html").querySelectorAll(nr);for(const p of c)try{let f=p.getAttribute("href")||"";if(!f)continue;if(f.endsWith("/")){const g=a+f;r.has(g)||s.push(g);continue}if(f.toLowerCase().endsWith(".md")){const g=ge(a+f);try{if(H.has(g))continue;for(const m of Z.values());}catch(m){console.warn("[slugManager] slug map access failed",m)}try{const m=await be(g,e);if(m&&m.raw){const w=(m.raw||"").match(/^#\s+(.+)$/m);if(w&&w[1]&&re(w[1].trim())===t){i=g;break}}}catch(m){console.warn("[slugManager] crawlForSlug: fetchMarkdown failed",m)}}}catch(f){console.warn("[slugManager] crawlForSlug: link iteration failed",f)}}catch(l){console.warn("[slugManager] crawlForSlug: directory fetch failed",l)}}return It.set(t,i),i};async function rr(t,e=pt){const n=new Set,i=new Set,r=[""];for(;r.length&&!(r.length>e);){const s=r.shift();if(i.has(s))continue;i.add(s);let a=t;a.endsWith("/")||(a+="/"),a+=s;try{const o=await globalThis.fetch(a);if(!o.ok)continue;const l=await o.text(),h=tr.parseFromString(l,"text/html").querySelectorAll(nr);for(const c of h)try{let p=c.getAttribute("href")||"";if(!p)continue;if(p.endsWith("/")){const g=s+p;i.has(g)||r.push(g);continue}const f=(s+p).replace(/^\/+/,"");/\.(md|html?)$/i.test(f)&&n.add(f)}catch(p){console.warn("[slugManager] crawlAllMarkdown: link iteration failed",p)}}catch(o){console.warn("[slugManager] crawlAllMarkdown: directory fetch failed",o)}}return Array.from(n)}async function ir(t,e,n){if(t&&typeof t=="string"&&(t=ge(t),t=ot(t)),Z.has(t))return ut(t)||Z.get(t);for(const r of Lt)try{const s=await r(t,e);if(s)return Fe(t,s),H.set(s,t),s}catch(s){console.warn("[slugManager] slug resolver failed",s)}if(Ae&&Ae.length){if(ct.has(t)){const r=ct.get(t);return Z.set(t,r),H.set(r,t),r}for(const r of Ae)if(!Pt.has(r))try{const s=await be(r,e);if(s&&s.raw){const a=(s.raw||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const o=re(a[1].trim());if(Pt.add(r),o&&ct.set(o,r),o===t)return Fe(t,r),H.set(r,t),r}}}catch(s){console.warn("[slugManager] manifest title fetch failed",s)}}try{const r=await Bt(e);if(r&&r.length){const s=r.find(a=>a.slug===t);if(s)return Fe(t,s.path),H.set(s.path,t),s.path}}catch(r){console.warn("[slugManager] buildSearchIndex lookup failed",r)}try{const r=await hn(t,e,n);if(r)return Fe(t,r),H.set(r,t),r}catch(r){console.warn("[slugManager] crawlForSlug lookup failed",r)}const i=[`${t}.html`,`${t}.md`];for(const r of i)try{const s=await be(r,e);if(s&&s.raw)return Fe(t,r),H.set(r,t),r}catch(s){console.warn("[slugManager] candidate fetch failed",s)}if(Ae&&Ae.length)for(const r of Ae)try{const s=r.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(re(s)===t)return Fe(t,r),H.set(r,t),r}catch(s){console.warn("[slugManager] build-time filename match failed",s)}try{const r=await be("_home.md",e);if(r&&r.raw){const s=(r.raw||"").match(/^#\s+(.+)$/m);if(s&&s[1]&&re(s[1].trim())===t)return Fe(t,"_home.md"),H.set("_home.md",t),"_home.md"}}catch(r){console.warn("[slugManager] home page fetch failed",r)}return null}const zt=Object.freeze(Object.defineProperty({__proto__:null,CRAWL_MAX_QUEUE:er,_setAllMd:zi,_storeSlugMapping:Fe,addSlugResolver:Ii,get allMarkdownPaths(){return Ae},get availableLanguages(){return Re},buildSearchIndex:Bt,buildSearchIndexWorker:Pi,clearFetchCache:Di,clearListCaches:Oi,crawlAllMarkdown:rr,crawlCache:It,crawlForSlug:hn,crawlForSlugWorker:$i,get defaultCrawlMaxQueue(){return pt},ensureSlug:ir,fetchCache:ht,get fetchMarkdown(){return be},getLanguages:Mi,initSlugWorker:on,listPathsFetched:Pt,listSlugCache:ct,mdToSlug:H,get notFoundPage(){return Mt},removeSlugResolver:Bi,resolveSlugPath:ut,get searchIndex(){return Xe},setContentBase:$t,setDefaultCrawlMaxQueue:Hi,setFetchMarkdown:qi,setLanguages:Kn,setNotFoundPage:un,slugResolvers:Lt,slugToMd:Z,slugify:re},Symbol.toStringTag,{value:"Module"}));let sr=100;function ar(t){sr=t}let ft=300*1e3;function lr(t){ft=t}const Le=new Map;function Ui(t){if(!Le.has(t))return;const e=Le.get(t),n=Date.now();if(e.ts+ft<n){Le.delete(t);return}return Le.delete(t),Le.set(t,e),e.value}function ji(t,e){if(or(),or(),Le.delete(t),Le.set(t,{value:e,ts:Date.now()}),Le.size>sr){const n=Le.keys().next().value;n!==void 0&&Le.delete(n)}}function or(){if(!ft||ft<=0)return;const t=Date.now();for(const[e,n]of Le.entries())n.ts+ft<t&&Le.delete(e)}async function Fi(t,e){const n=new Set(Ie),i=document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");for(const r of Array.from(i||[])){const s=r.getAttribute("href")||"";if(s)try{const a=new URL(s,location.href);if(a.origin!==location.origin)continue;const o=(a.hash||a.pathname).match(/([^#?]+\.md)(?:$|[?#])/)||(a.pathname||"").match(/([^#?]+\.md)(?:$|[?#])/);if(o){let u=ge(o[1]);u&&n.add(u);continue}const l=a.pathname||"";if(l){const u=new URL(e),h=Tt(u.pathname);if(l.indexOf(h)!==-1){let c=l.startsWith(h)?l.slice(h.length):l;c=ge(c),c&&n.add(c)}}}catch(a){console.warn("[router] malformed URL while discovering index candidates",a)}}for(const r of n)try{if(!r||!String(r).includes(".md"))continue;const s=await be(r,e);if(!s||!s.raw)continue;const a=(s.raw||"").match(/^#\s+(.+)$/m);if(a){const o=(a[1]||"").trim();if(o&&re(o)===t)return r}}catch(s){console.warn("[router] fetchMarkdown during index discovery failed",s)}return null}function Wi(t){const e=[];if(String(t).includes(".md")||String(t).includes(".html"))/index\.html$/i.test(t)||e.push(t);else try{const n=decodeURIComponent(String(t||""));if(Z.has(n)){const i=ut(n)||Z.get(n);i&&(/\.(md|html?)$/i.test(i)?/index\.html$/i.test(i)||e.push(i):(e.push(i),e.push(i+".html")))}else{if(Ie&&Ie.size)for(const i of Ie){const r=i.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(re(r)===n&&!/index\.html$/i.test(i)){e.push(i);break}}!e.length&&n&&!/\.(md|html?)$/i.test(n)&&(e.push(n+".html"),e.push(n+".md"))}}catch(n){console.warn("[router] buildPageCandidates failed during slug handling",n)}return e}async function Zi(t,e){const n=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;let i=t||"",r=null;if(i&&String(i).includes("::")){const c=String(i).split("::",2);i=c[0],r=c[1]||null}const a=`${t}|||${typeof Ai<"u"&&je?je:""}`,o=Ui(a);if(o)i=o.resolved,r=o.anchor||r;else{if(!String(i).includes(".md")&&!String(i).includes(".html")){let c=decodeURIComponent(String(i||""));if(c&&typeof c=="string"&&(c=ge(c),c=ot(c)),Z.has(c))i=ut(c)||Z.get(c);else{let p=await Fi(c,e);if(p)i=p;else if(ln._refreshed&&Ie&&Ie.size||typeof e=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(e)){const f=await ir(c,e);f&&(i=f)}}}ji(a,{resolved:i,anchor:r})}!r&&n&&(r=n);const l=Wi(i);if(l.length===1&&/index\.html$/i.test(l[0])&&!Z.has(i)&&!Z.has(decodeURIComponent(String(i||""))))throw new Error("Unknown slug: index.html fallback prevented");let u=null,h=null;for(const c of l)if(c)try{const p=ge(c);u=await be(p,e),h=p;break}catch{}if(!u)throw new Error("no page data");return{data:u,pagePath:h,anchor:r}}function dn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Ye=dn();function cr(t){Ye=t}var Ke={exec:()=>null};function X(t,e=""){let n=typeof t=="string"?t:t.source,i={replace:(r,s)=>{let a=typeof s=="string"?s:s.source;return a=a.replace(ve.caret,"$1"),n=n.replace(r,a),i},getRegex:()=>new RegExp(n,e)};return i}var Qi=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),ve={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}>`)},Gi=/^(?:[ \t]*(?:\n|$))+/,Xi=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Yi=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,gt=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Ki=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,pn=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,ur=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,hr=X(ur).replace(/bull/g,pn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Vi=X(ur).replace(/bull/g,pn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),fn=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Ji=/^[^\n]+/,gn=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,es=X(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",gn).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),ts=X(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,pn).getRegex(),Ot="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",mn=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,ns=X("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",mn).replace("tag",Ot).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),dr=X(fn).replace("hr",gt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ot).getRegex(),rs=X(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",dr).getRegex(),wn={blockquote:rs,code:Xi,def:es,fences:Yi,heading:Ki,hr:gt,html:ns,lheading:hr,list:ts,newline:Gi,paragraph:dr,table:Ke,text:Ji},pr=X("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",gt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ot).getRegex(),is={...wn,lheading:Vi,table:pr,paragraph:X(fn).replace("hr",gt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",pr).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ot).getRegex()},ss={...wn,html:X(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",mn).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Ke,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:X(fn).replace("hr",gt).replace("heading",` *#{1,6} *[^
]`).replace("lheading",hr).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},as=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,ls=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,fr=/^( {2,}|\\)\n(?!\s*$)/,os=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Nt=/[\p{P}\p{S}]/u,bn=/[\s\p{P}\p{S}]/u,gr=/[^\s\p{P}\p{S}]/u,cs=X(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,bn).getRegex(),mr=/(?!~)[\p{P}\p{S}]/u,us=/(?!~)[\s\p{P}\p{S}]/u,hs=/(?:[^\s\p{P}\p{S}]|~)/u,wr=/(?![*_])[\p{P}\p{S}]/u,ds=/(?![*_])[\s\p{P}\p{S}]/u,ps=/(?:[^\s\p{P}\p{S}]|[*_])/u,fs=X(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Qi?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),br=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,gs=X(br,"u").replace(/punct/g,Nt).getRegex(),ms=X(br,"u").replace(/punct/g,mr).getRegex(),kr="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",ws=X(kr,"gu").replace(/notPunctSpace/g,gr).replace(/punctSpace/g,bn).replace(/punct/g,Nt).getRegex(),bs=X(kr,"gu").replace(/notPunctSpace/g,hs).replace(/punctSpace/g,us).replace(/punct/g,mr).getRegex(),ks=X("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,gr).replace(/punctSpace/g,bn).replace(/punct/g,Nt).getRegex(),ys=X(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,wr).getRegex(),xs="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Ss=X(xs,"gu").replace(/notPunctSpace/g,ps).replace(/punctSpace/g,ds).replace(/punct/g,wr).getRegex(),vs=X(/\\(punct)/,"gu").replace(/punct/g,Nt).getRegex(),Es=X(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Rs=X(mn).replace("(?:-->|$)","-->").getRegex(),As=X("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Rs).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Dt=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Ts=X(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",Dt).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),yr=X(/^!?\[(label)\]\[(ref)\]/).replace("label",Dt).replace("ref",gn).getRegex(),xr=X(/^!?\[(ref)\](?:\[\])?/).replace("ref",gn).getRegex(),Cs=X("reflink|nolink(?!\\()","g").replace("reflink",yr).replace("nolink",xr).getRegex(),Sr=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,kn={_backpedal:Ke,anyPunctuation:vs,autolink:Es,blockSkip:fs,br:fr,code:ls,del:Ke,delLDelim:Ke,delRDelim:Ke,emStrongLDelim:gs,emStrongRDelimAst:ws,emStrongRDelimUnd:ks,escape:as,link:Ts,nolink:xr,punctuation:cs,reflink:yr,reflinkSearch:Cs,tag:As,text:os,url:Ke},_s={...kn,link:X(/^!?\[(label)\]\((.*?)\)/).replace("label",Dt).getRegex(),reflink:X(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Dt).getRegex()},yn={...kn,emStrongRDelimAst:bs,emStrongLDelim:ms,delLDelim:ys,delRDelim:Ss,url:X(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Sr).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:X(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Sr).getRegex()},Ls={...yn,br:X(fr).replace("{2,}","*").getRegex(),text:X(yn.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},qt={normal:wn,gfm:is,pedantic:ss},mt={normal:kn,gfm:yn,breaks:Ls,pedantic:_s},Ms={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},vr=t=>Ms[t];function Be(t,e){if(e){if(ve.escapeTest.test(t))return t.replace(ve.escapeReplace,vr)}else if(ve.escapeTestNoEncode.test(t))return t.replace(ve.escapeReplaceNoEncode,vr);return t}function Er(t){try{t=encodeURI(t).replace(ve.percentDecode,"%")}catch{return null}return t}function Rr(t,e){let n=t.replace(ve.findPipe,(s,a,o)=>{let l=!1,u=a;for(;--u>=0&&o[u]==="\\";)l=!l;return l?"|":" |"}),i=n.split(ve.splitPipe),r=0;if(i[0].trim()||i.shift(),i.length>0&&!i.at(-1)?.trim()&&i.pop(),e)if(i.length>e)i.splice(e);else for(;i.length<e;)i.push("");for(;r<i.length;r++)i[r]=i[r].trim().replace(ve.slashPipe,"|");return i}function wt(t,e,n){let i=t.length;if(i===0)return"";let r=0;for(;r<i&&t.charAt(i-r-1)===e;)r++;return t.slice(0,i-r)}function Ps(t,e){if(t.indexOf(e[1])===-1)return-1;let n=0;for(let i=0;i<t.length;i++)if(t[i]==="\\")i++;else if(t[i]===e[0])n++;else if(t[i]===e[1]&&(n--,n<0))return i;return n>0?-2:-1}function $s(t,e=0){let n=e,i="";for(let r of t)if(r==="	"){let s=4-n%4;i+=" ".repeat(s),n+=s}else i+=r,n++;return i}function Ar(t,e,n,i,r){let s=e.href,a=e.title||null,o=t[1].replace(r.other.outputLinkReplace,"$1");i.state.inLink=!0;let l={type:t[0].charAt(0)==="!"?"image":"link",raw:n,href:s,title:a,text:o,tokens:i.inlineTokens(o)};return i.state.inLink=!1,l}function Is(t,e,n){let i=t.match(n.other.indentCodeCompensation);if(i===null)return e;let r=i[1];return e.split(`
`).map(s=>{let a=s.match(n.other.beginningSpace);if(a===null)return s;let[o]=a;return o.length>=r.length?s.slice(r.length):s}).join(`
`)}var Ht=class{options;rules;lexer;constructor(t){this.options=t||Ye}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let n=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?n:wt(n,`
`)}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let n=e[0],i=Is(n,e[3]||"",this.rules);return{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:i}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){let i=wt(n,"#");(this.options.pedantic||!i||this.rules.other.endingSpaceChar.test(i))&&(n=i.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:wt(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let n=wt(e[0],`
`).split(`
`),i="",r="",s=[];for(;n.length>0;){let a=!1,o=[],l;for(l=0;l<n.length;l++)if(this.rules.other.blockquoteStart.test(n[l]))o.push(n[l]),a=!0;else if(!a)o.push(n[l]);else break;n=n.slice(l);let u=o.join(`
`),h=u.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");i=i?`${i}
${u}`:u,r=r?`${r}
${h}`:h;let c=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(h,s,!0),this.lexer.state.top=c,n.length===0)break;let p=s.at(-1);if(p?.type==="code")break;if(p?.type==="blockquote"){let f=p,g=f.raw+`
`+n.join(`
`),m=this.blockquote(g);s[s.length-1]=m,i=i.substring(0,i.length-f.raw.length)+m.raw,r=r.substring(0,r.length-f.text.length)+m.text;break}else if(p?.type==="list"){let f=p,g=f.raw+`
`+n.join(`
`),m=this.list(g);s[s.length-1]=m,i=i.substring(0,i.length-p.raw.length)+m.raw,r=r.substring(0,r.length-f.raw.length)+m.raw,n=g.substring(s.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:i,tokens:s,text:r}}}list(t){let e=this.rules.block.list.exec(t);if(e){let n=e[1].trim(),i=n.length>1,r={type:"list",raw:"",ordered:i,start:i?+n.slice(0,-1):"",loose:!1,items:[]};n=i?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=i?n:"[*+-]");let s=this.rules.other.listItemRegex(n),a=!1;for(;t;){let l=!1,u="",h="";if(!(e=s.exec(t))||this.rules.block.hr.test(t))break;u=e[0],t=t.substring(u.length);let c=$s(e[2].split(`
`,1)[0],e[1].length),p=t.split(`
`,1)[0],f=!c.trim(),g=0;if(this.options.pedantic?(g=2,h=c.trimStart()):f?g=e[1].length+1:(g=c.search(this.rules.other.nonSpaceChar),g=g>4?1:g,h=c.slice(g),g+=e[1].length),f&&this.rules.other.blankLine.test(p)&&(u+=p+`
`,t=t.substring(p.length+1),l=!0),!l){let m=this.rules.other.nextBulletRegex(g),w=this.rules.other.hrRegex(g),y=this.rules.other.fencesBeginRegex(g),S=this.rules.other.headingBeginRegex(g),N=this.rules.other.htmlBeginRegex(g),_=this.rules.other.blockquoteBeginRegex(g);for(;t;){let z=t.split(`
`,1)[0],I;if(p=z,this.options.pedantic?(p=p.replace(this.rules.other.listReplaceNesting,"  "),I=p):I=p.replace(this.rules.other.tabCharGlobal,"    "),y.test(p)||S.test(p)||N.test(p)||_.test(p)||m.test(p)||w.test(p))break;if(I.search(this.rules.other.nonSpaceChar)>=g||!p.trim())h+=`
`+I.slice(g);else{if(f||c.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||y.test(c)||S.test(c)||w.test(c))break;h+=`
`+p}f=!p.trim(),u+=z+`
`,t=t.substring(z.length+1),c=I.slice(g)}}r.loose||(a?r.loose=!0:this.rules.other.doubleBlankLine.test(u)&&(a=!0)),r.items.push({type:"list_item",raw:u,task:!!this.options.gfm&&this.rules.other.listIsTask.test(h),loose:!1,text:h,tokens:[]}),r.raw+=u}let o=r.items.at(-1);if(o)o.raw=o.raw.trimEnd(),o.text=o.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let l of r.items){if(this.lexer.state.top=!1,l.tokens=this.lexer.blockTokens(l.text,[]),l.task){if(l.text=l.text.replace(this.rules.other.listReplaceTask,""),l.tokens[0]?.type==="text"||l.tokens[0]?.type==="paragraph"){l.tokens[0].raw=l.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),l.tokens[0].text=l.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let h=this.lexer.inlineQueue.length-1;h>=0;h--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[h].src)){this.lexer.inlineQueue[h].src=this.lexer.inlineQueue[h].src.replace(this.rules.other.listReplaceTask,"");break}}let u=this.rules.other.listTaskCheckbox.exec(l.raw);if(u){let h={type:"checkbox",raw:u[0]+" ",checked:u[0]!=="[ ]"};l.checked=h.checked,r.loose?l.tokens[0]&&["paragraph","text"].includes(l.tokens[0].type)&&"tokens"in l.tokens[0]&&l.tokens[0].tokens?(l.tokens[0].raw=h.raw+l.tokens[0].raw,l.tokens[0].text=h.raw+l.tokens[0].text,l.tokens[0].tokens.unshift(h)):l.tokens.unshift({type:"paragraph",raw:h.raw,text:h.raw,tokens:[h]}):l.tokens.unshift(h)}}if(!r.loose){let u=l.tokens.filter(c=>c.type==="space"),h=u.length>0&&u.some(c=>this.rules.other.anyLine.test(c.raw));r.loose=h}}if(r.loose)for(let l of r.items){l.loose=!0;for(let u of l.tokens)u.type==="text"&&(u.type="paragraph")}return r}}html(t){let e=this.rules.block.html.exec(t);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(t){let e=this.rules.block.def.exec(t);if(e){let n=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),i=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:e[0],href:i,title:r}}}table(t){let e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let n=Rr(e[1]),i=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],s={type:"table",raw:e[0],header:[],align:[],rows:[]};if(n.length===i.length){for(let a of i)this.rules.other.tableAlignRight.test(a)?s.align.push("right"):this.rules.other.tableAlignCenter.test(a)?s.align.push("center"):this.rules.other.tableAlignLeft.test(a)?s.align.push("left"):s.align.push(null);for(let a=0;a<n.length;a++)s.header.push({text:n[a],tokens:this.lexer.inline(n[a]),header:!0,align:s.align[a]});for(let a of r)s.rows.push(Rr(a,s.header.length).map((o,l)=>({text:o,tokens:this.lexer.inline(o),header:!1,align:s.align[l]})));return s}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(t){let e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){let e=this.rules.inline.link.exec(t);if(e){let n=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let s=wt(n.slice(0,-1),"\\");if((n.length-s.length)%2===0)return}else{let s=Ps(e[2],"()");if(s===-2)return;if(s>-1){let a=(e[0].indexOf("!")===0?5:4)+e[1].length+s;e[2]=e[2].substring(0,s),e[0]=e[0].substring(0,a).trim(),e[3]=""}}let i=e[2],r="";if(this.options.pedantic){let s=this.rules.other.pedanticHrefTitle.exec(i);s&&(i=s[1],r=s[3])}else r=e[3]?e[3].slice(1,-1):"";return i=i.trim(),this.rules.other.startAngleBracket.test(i)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?i=i.slice(1):i=i.slice(1,-1)),Ar(e,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let n;if((n=this.rules.inline.reflink.exec(t))||(n=this.rules.inline.nolink.exec(t))){let i=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=e[i.toLowerCase()];if(!r){let s=n[0].charAt(0);return{type:"text",raw:s,text:s}}return Ar(n,r,n[0],this.lexer,this.rules)}}emStrong(t,e,n=""){let i=this.rules.inline.emStrongLDelim.exec(t);if(!(!i||i[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(i[1]||i[2])||!n||this.rules.inline.punctuation.exec(n))){let r=[...i[0]].length-1,s,a,o=r,l=0,u=i[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(u.lastIndex=0,e=e.slice(-1*t.length+r);(i=u.exec(e))!=null;){if(s=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!s)continue;if(a=[...s].length,i[3]||i[4]){o+=a;continue}else if((i[5]||i[6])&&r%3&&!((r+a)%3)){l+=a;continue}if(o-=a,o>0)continue;a=Math.min(a,a+o+l);let h=[...i[0]][0].length,c=t.slice(0,r+i.index+h+a);if(Math.min(r,a)%2){let f=c.slice(1,-1);return{type:"em",raw:c,text:f,tokens:this.lexer.inlineTokens(f)}}let p=c.slice(2,-2);return{type:"strong",raw:c,text:p,tokens:this.lexer.inlineTokens(p)}}}}codespan(t){let e=this.rules.inline.code.exec(t);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," "),i=this.rules.other.nonSpaceChar.test(n),r=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return i&&r&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(t){let e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t,e,n=""){let i=this.rules.inline.delLDelim.exec(t);if(i&&(!i[1]||!n||this.rules.inline.punctuation.exec(n))){let r=[...i[0]].length-1,s,a,o=r,l=this.rules.inline.delRDelim;for(l.lastIndex=0,e=e.slice(-1*t.length+r);(i=l.exec(e))!=null;){if(s=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!s||(a=[...s].length,a!==r))continue;if(i[3]||i[4]){o+=a;continue}if(o-=a,o>0)continue;a=Math.min(a,a+o);let u=[...i[0]][0].length,h=t.slice(0,r+i.index+u+a),c=h.slice(r,-r);return{type:"del",raw:h,text:c,tokens:this.lexer.inlineTokens(c)}}}}autolink(t){let e=this.rules.inline.autolink.exec(t);if(e){let n,i;return e[2]==="@"?(n=e[1],i="mailto:"+n):(n=e[1],i=n),{type:"link",raw:e[0],text:n,href:i,tokens:[{type:"text",raw:n,text:n}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let n,i;if(e[2]==="@")n=e[0],i="mailto:"+n;else{let r;do r=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(r!==e[0]);n=e[0],e[1]==="www."?i="http://"+e[0]:i=e[0]}return{type:"link",raw:e[0],text:n,href:i,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:n}}}},Me=class On{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||Ye,this.options.tokenizer=this.options.tokenizer||new Ht,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:ve,block:qt.normal,inline:mt.normal};this.options.pedantic?(n.block=qt.pedantic,n.inline=mt.pedantic):this.options.gfm&&(n.block=qt.gfm,this.options.breaks?n.inline=mt.breaks:n.inline=mt.gfm),this.tokenizer.rules=n}static get rules(){return{block:qt,inline:mt}}static lex(e,n){return new On(n).lex(e)}static lexInline(e,n){return new On(n).inlineTokens(e)}lex(e){e=e.replace(ve.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let i=this.inlineQueue[n];this.inlineTokens(i.src,i.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],i=!1){for(this.options.pedantic&&(e=e.replace(ve.tabCharGlobal,"    ").replace(ve.spaceLine,""));e;){let r;if(this.options.extensions?.block?.some(a=>(r=a.call({lexer:this},e,n))?(e=e.substring(r.raw.length),n.push(r),!0):!1))continue;if(r=this.tokenizer.space(e)){e=e.substring(r.raw.length);let a=n.at(-1);r.raw.length===1&&a!==void 0?a.raw+=`
`:n.push(r);continue}if(r=this.tokenizer.code(e)){e=e.substring(r.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.at(-1).src=a.text):n.push(r);continue}if(r=this.tokenizer.fences(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.heading(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.hr(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.blockquote(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.list(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.html(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.def(e)){e=e.substring(r.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title},n.push(r));continue}if(r=this.tokenizer.table(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.lheading(e)){e=e.substring(r.raw.length),n.push(r);continue}let s=e;if(this.options.extensions?.startBlock){let a=1/0,o=e.slice(1),l;this.options.extensions.startBlock.forEach(u=>{l=u.call({lexer:this},o),typeof l=="number"&&l>=0&&(a=Math.min(a,l))}),a<1/0&&a>=0&&(s=e.substring(0,a+1))}if(this.state.top&&(r=this.tokenizer.paragraph(s))){let a=n.at(-1);i&&a?.type==="paragraph"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(r),i=s.length!==e.length,e=e.substring(r.raw.length);continue}if(r=this.tokenizer.text(e)){e=e.substring(r.raw.length);let a=n.at(-1);a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(r);continue}if(e){let a="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}inlineTokens(e,n=[]){let i=e,r=null;if(this.tokens.links){let l=Object.keys(this.tokens.links);if(l.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(i))!=null;)l.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(i=i.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(i))!=null;)i=i.slice(0,r.index)+"++"+i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let s;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(i))!=null;)s=r[2]?r[2].length:0,i=i.slice(0,r.index+s)+"["+"a".repeat(r[0].length-s-2)+"]"+i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);i=this.options.hooks?.emStrongMask?.call({lexer:this},i)??i;let a=!1,o="";for(;e;){a||(o=""),a=!1;let l;if(this.options.extensions?.inline?.some(h=>(l=h.call({lexer:this},e,n))?(e=e.substring(l.raw.length),n.push(l),!0):!1))continue;if(l=this.tokenizer.escape(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.tag(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.link(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(l.raw.length);let h=n.at(-1);l.type==="text"&&h?.type==="text"?(h.raw+=l.raw,h.text+=l.text):n.push(l);continue}if(l=this.tokenizer.emStrong(e,i,o)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.codespan(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.br(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.del(e,i,o)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.autolink(e)){e=e.substring(l.raw.length),n.push(l);continue}if(!this.state.inLink&&(l=this.tokenizer.url(e))){e=e.substring(l.raw.length),n.push(l);continue}let u=e;if(this.options.extensions?.startInline){let h=1/0,c=e.slice(1),p;this.options.extensions.startInline.forEach(f=>{p=f.call({lexer:this},c),typeof p=="number"&&p>=0&&(h=Math.min(h,p))}),h<1/0&&h>=0&&(u=e.substring(0,h+1))}if(l=this.tokenizer.inlineText(u)){e=e.substring(l.raw.length),l.raw.slice(-1)!=="_"&&(o=l.raw.slice(-1)),a=!0;let h=n.at(-1);h?.type==="text"?(h.raw+=l.raw,h.text+=l.text):n.push(l);continue}if(e){let h="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(h);break}else throw new Error(h)}}return n}},Ut=class{options;parser;constructor(t){this.options=t||Ye}space(t){return""}code({text:t,lang:e,escaped:n}){let i=(e||"").match(ve.notSpaceStart)?.[0],r=t.replace(ve.endingNewline,"")+`
`;return i?'<pre><code class="language-'+Be(i)+'">'+(n?r:Be(r,!0))+`</code></pre>
`:"<pre><code>"+(n?r:Be(r,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}def(t){return""}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){let e=t.ordered,n=t.start,i="";for(let a=0;a<t.items.length;a++){let o=t.items[a];i+=this.listitem(o)}let r=e?"ol":"ul",s=e&&n!==1?' start="'+n+'"':"";return"<"+r+s+`>
`+i+"</"+r+`>
`}listitem(t){return`<li>${this.parser.parse(t.tokens)}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let e="",n="";for(let r=0;r<t.header.length;r++)n+=this.tablecell(t.header[r]);e+=this.tablerow({text:n});let i="";for(let r=0;r<t.rows.length;r++){let s=t.rows[r];n="";for(let a=0;a<s.length;a++)n+=this.tablecell(s[a]);i+=this.tablerow({text:n})}return i&&(i=`<tbody>${i}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+i+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){let e=this.parser.parseInline(t.tokens),n=t.header?"th":"td";return(t.align?`<${n} align="${t.align}">`:`<${n}>`)+e+`</${n}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${Be(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:n}){let i=this.parser.parseInline(n),r=Er(t);if(r===null)return i;t=r;let s='<a href="'+t+'"';return e&&(s+=' title="'+Be(e)+'"'),s+=">"+i+"</a>",s}image({href:t,title:e,text:n,tokens:i}){i&&(n=this.parser.parseInline(i,this.parser.textRenderer));let r=Er(t);if(r===null)return Be(n);t=r;let s=`<img src="${t}" alt="${Be(n)}"`;return e&&(s+=` title="${Be(e)}"`),s+=">",s}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:Be(t.text)}},xn=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}checkbox({raw:t}){return t}},Pe=class Nn{options;renderer;textRenderer;constructor(e){this.options=e||Ye,this.options.renderer=this.options.renderer||new Ut,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new xn}static parse(e,n){return new Nn(n).parse(e)}static parseInline(e,n){return new Nn(n).parseInline(e)}parse(e){let n="";for(let i=0;i<e.length;i++){let r=e[i];if(this.options.extensions?.renderers?.[r.type]){let a=r,o=this.options.extensions.renderers[a.type].call({parser:this},a);if(o!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(a.type)){n+=o||"";continue}}let s=r;switch(s.type){case"space":{n+=this.renderer.space(s);break}case"hr":{n+=this.renderer.hr(s);break}case"heading":{n+=this.renderer.heading(s);break}case"code":{n+=this.renderer.code(s);break}case"table":{n+=this.renderer.table(s);break}case"blockquote":{n+=this.renderer.blockquote(s);break}case"list":{n+=this.renderer.list(s);break}case"checkbox":{n+=this.renderer.checkbox(s);break}case"html":{n+=this.renderer.html(s);break}case"def":{n+=this.renderer.def(s);break}case"paragraph":{n+=this.renderer.paragraph(s);break}case"text":{n+=this.renderer.text(s);break}default:{let a='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return n}parseInline(e,n=this.renderer){let i="";for(let r=0;r<e.length;r++){let s=e[r];if(this.options.extensions?.renderers?.[s.type]){let o=this.options.extensions.renderers[s.type].call({parser:this},s);if(o!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(s.type)){i+=o||"";continue}}let a=s;switch(a.type){case"escape":{i+=n.text(a);break}case"html":{i+=n.html(a);break}case"link":{i+=n.link(a);break}case"image":{i+=n.image(a);break}case"checkbox":{i+=n.checkbox(a);break}case"strong":{i+=n.strong(a);break}case"em":{i+=n.em(a);break}case"codespan":{i+=n.codespan(a);break}case"br":{i+=n.br(a);break}case"del":{i+=n.del(a);break}case"text":{i+=n.text(a);break}default:{let o='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return i}},bt=class{options;block;constructor(t){this.options=t||Ye}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(){return this.block?Me.lex:Me.lexInline}provideParser(){return this.block?Pe.parse:Pe.parseInline}},Bs=class{defaults=dn();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Pe;Renderer=Ut;TextRenderer=xn;Lexer=Me;Tokenizer=Ht;Hooks=bt;constructor(...t){this.use(...t)}walkTokens(t,e){let n=[];for(let i of t)switch(n=n.concat(e.call(this,i)),i.type){case"table":{let r=i;for(let s of r.header)n=n.concat(this.walkTokens(s.tokens,e));for(let s of r.rows)for(let a of s)n=n.concat(this.walkTokens(a.tokens,e));break}case"list":{let r=i;n=n.concat(this.walkTokens(r.items,e));break}default:{let r=i;this.defaults.extensions?.childTokens?.[r.type]?this.defaults.extensions.childTokens[r.type].forEach(s=>{let a=r[s].flat(1/0);n=n.concat(this.walkTokens(a,e))}):r.tokens&&(n=n.concat(this.walkTokens(r.tokens,e)))}}return n}use(...t){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(n=>{let i={...n};if(i.async=this.defaults.async||i.async||!1,n.extensions&&(n.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){let s=e.renderers[r.name];s?e.renderers[r.name]=function(...a){let o=r.renderer.apply(this,a);return o===!1&&(o=s.apply(this,a)),o}:e.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let s=e[r.level];s?s.unshift(r.tokenizer):e[r.level]=[r.tokenizer],r.start&&(r.level==="block"?e.startBlock?e.startBlock.push(r.start):e.startBlock=[r.start]:r.level==="inline"&&(e.startInline?e.startInline.push(r.start):e.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(e.childTokens[r.name]=r.childTokens)}),i.extensions=e),n.renderer){let r=this.defaults.renderer||new Ut(this.defaults);for(let s in n.renderer){if(!(s in r))throw new Error(`renderer '${s}' does not exist`);if(["options","parser"].includes(s))continue;let a=s,o=n.renderer[a],l=r[a];r[a]=(...u)=>{let h=o.apply(r,u);return h===!1&&(h=l.apply(r,u)),h||""}}i.renderer=r}if(n.tokenizer){let r=this.defaults.tokenizer||new Ht(this.defaults);for(let s in n.tokenizer){if(!(s in r))throw new Error(`tokenizer '${s}' does not exist`);if(["options","rules","lexer"].includes(s))continue;let a=s,o=n.tokenizer[a],l=r[a];r[a]=(...u)=>{let h=o.apply(r,u);return h===!1&&(h=l.apply(r,u)),h}}i.tokenizer=r}if(n.hooks){let r=this.defaults.hooks||new bt;for(let s in n.hooks){if(!(s in r))throw new Error(`hook '${s}' does not exist`);if(["options","block"].includes(s))continue;let a=s,o=n.hooks[a],l=r[a];bt.passThroughHooks.has(s)?r[a]=u=>{if(this.defaults.async&&bt.passThroughHooksRespectAsync.has(s))return(async()=>{let c=await o.call(r,u);return l.call(r,c)})();let h=o.call(r,u);return l.call(r,h)}:r[a]=(...u)=>{if(this.defaults.async)return(async()=>{let c=await o.apply(r,u);return c===!1&&(c=await l.apply(r,u)),c})();let h=o.apply(r,u);return h===!1&&(h=l.apply(r,u)),h}}i.hooks=r}if(n.walkTokens){let r=this.defaults.walkTokens,s=n.walkTokens;i.walkTokens=function(a){let o=[];return o.push(s.call(this,a)),r&&(o=o.concat(r.call(this,a))),o}}this.defaults={...this.defaults,...i}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return Me.lex(t,e??this.defaults)}parser(t,e){return Pe.parse(t,e??this.defaults)}parseMarkdown(t){return(e,n)=>{let i={...n},r={...this.defaults,...i},s=this.onError(!!r.silent,!!r.async);if(this.defaults.async===!0&&i.async===!1)return s(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return s(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return s(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(r.hooks&&(r.hooks.options=r,r.hooks.block=t),r.async)return(async()=>{let a=r.hooks?await r.hooks.preprocess(e):e,o=await(r.hooks?await r.hooks.provideLexer():t?Me.lex:Me.lexInline)(a,r),l=r.hooks?await r.hooks.processAllTokens(o):o;r.walkTokens&&await Promise.all(this.walkTokens(l,r.walkTokens));let u=await(r.hooks?await r.hooks.provideParser():t?Pe.parse:Pe.parseInline)(l,r);return r.hooks?await r.hooks.postprocess(u):u})().catch(s);try{r.hooks&&(e=r.hooks.preprocess(e));let a=(r.hooks?r.hooks.provideLexer():t?Me.lex:Me.lexInline)(e,r);r.hooks&&(a=r.hooks.processAllTokens(a)),r.walkTokens&&this.walkTokens(a,r.walkTokens);let o=(r.hooks?r.hooks.provideParser():t?Pe.parse:Pe.parseInline)(a,r);return r.hooks&&(o=r.hooks.postprocess(o)),o}catch(a){return s(a)}}}onError(t,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let i="<p>An error occurred:</p><pre>"+Be(n.message+"",!0)+"</pre>";return e?Promise.resolve(i):i}if(e)return Promise.reject(n);throw n}}},Ve=new Bs;function K(t,e){return Ve.parse(t,e)}K.options=K.setOptions=function(t){return Ve.setOptions(t),K.defaults=Ve.defaults,cr(K.defaults),K},K.getDefaults=dn,K.defaults=Ye,K.use=function(...t){return Ve.use(...t),K.defaults=Ve.defaults,cr(K.defaults),K},K.walkTokens=function(t,e){return Ve.walkTokens(t,e)},K.parseInline=Ve.parseInline,K.Parser=Pe,K.parser=Pe.parse,K.Renderer=Ut,K.TextRenderer=xn,K.Lexer=Me,K.lexer=Me.lex,K.Tokenizer=Ht,K.Hooks=bt,K.parse=K,K.options,K.setOptions,K.use,K.walkTokens,K.parseInline,Pe.parse,Me.lex;const Tr=`function j() {
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
`,Cr=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",Tr],{type:"text/javascript;charset=utf-8"});function zs(t){let e;try{if(e=Cr&&(self.URL||self.webkitURL).createObjectURL(Cr),!e)throw"";const n=new Worker(e,{type:"module",name:t?.name});return n.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(e)}),n}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(Tr),{type:"module",name:t?.name})}}function Os(t){if(t.startsWith("---")){const e=t.indexOf(`
---`,3);if(e!==-1){const n=t.slice(3,e+0).trim(),i=t.slice(e+4).trimStart(),r={};return n.split(/\r?\n/).forEach(s=>{const a=s.match(/^([^:]+):\s*(.*)$/);a&&(r[a[1].trim()]=a[2].trim())}),{content:i,data:r}}}return{content:t,data:{}}}const _r=Zn(()=>new zs,"markdown"),Lr=typeof DOMParser<"u"?new DOMParser:null;function Sn(){return _r.get()}function Ns(t){return _r.send(t,1e3)}const We=[];function vn(t){if(t&&typeof t=="object"){We.push(t);try{K.use(t)}catch(e){console.warn("[markdown] failed to apply plugin",e)}}}function Ds(t){We.length=0,Array.isArray(t)&&We.push(...t.filter(e=>e&&typeof e=="object"));try{We.forEach(e=>K.use(e))}catch(e){console.warn("[markdown] failed to apply markdown extensions",e)}}async function jt(t){if(Sn&&Sn())try{const s=await Ns({type:"render",md:t});if(s&&s.html!==void 0)try{const o=(Lr||new DOMParser).parseFromString(s.html,"text/html"),l=o.querySelectorAll("h1,h2,h3,h4,h5,h6");l.forEach(c=>{c.id||(c.id=re(c.textContent||""))});try{o.querySelectorAll("img").forEach(p=>{try{p.getAttribute("loading")||p.setAttribute("data-want-lazy","1")}catch(f){console.warn("[markdown] set image loading attribute failed",f)}})}catch(c){console.warn("[markdown] query images failed",c)}try{o.querySelectorAll("pre code").forEach(p=>{try{const f=p.getAttribute&&p.getAttribute("class")||p.className||"",g=String(f||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(g)try{p.setAttribute&&p.setAttribute("class",g)}catch(y){console.warn("[markdown] set code class failed",y),p.className=g}else try{p.removeAttribute&&p.removeAttribute("class")}catch(y){console.warn("[markdown] remove code class failed",y),p.className=""}const m=g,w=m.match(/language-([a-zA-Z0-9_+-]+)/)||m.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!w||!w[1])try{const y=p.textContent||"";try{if(oe&&typeof oe.getLanguage=="function"&&oe.getLanguage("plaintext")){const S=oe.highlight(y,{language:"plaintext"});S&&S.value&&(p.innerHTML=S.value)}}catch{try{oe.highlightElement(p)}catch(N){console.warn("[markdown] hljs.highlightElement failed",N)}}}catch(y){console.warn("[markdown] code auto-detect failed",y)}}catch(f){console.warn("[markdown] processing code blocks failed",f)}})}catch(c){console.warn("[markdown] query code blocks failed",c)}const u=o.body.innerHTML,h=[];return l.forEach(c=>{h.push({level:Number(c.tagName.substring(1)),text:(c.textContent||"").trim(),id:c.id})}),{html:u,meta:s.meta||{},toc:h}}catch(a){return console.warn("[markdown] post-process worker HTML failed",a),s}}catch(s){console.warn("[markdown] worker render failed",s)}const{content:n,data:i}=Os(t||"");if(K.setOptions({gfm:!0,mangle:!1,headerIds:!1,headerPrefix:""}),We&&We.length)try{We.forEach(s=>K.use(s))}catch(s){console.warn("[markdown] apply plugins failed",s)}let r=K.parse(n);try{const a=(Lr||new DOMParser).parseFromString(r,"text/html"),o=a.querySelectorAll("h1,h2,h3,h4,h5,h6");o.forEach(u=>{u.id||(u.id=re(u.textContent||""))});try{a.querySelectorAll("img").forEach(h=>{try{h.getAttribute("loading")||h.setAttribute("data-want-lazy","1")}catch(c){console.warn("[markdown] set image loading attribute failed",c)}})}catch(u){console.warn("[markdown] query images failed",u)}try{a.querySelectorAll("pre code").forEach(h=>{try{const c=h.getAttribute&&h.getAttribute("class")||h.className||"",p=String(c||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(p)try{h.setAttribute&&h.setAttribute("class",p)}catch(m){console.warn("[markdown] set code class failed",m),h.className=p}else try{h.removeAttribute&&h.removeAttribute("class")}catch(m){console.warn("[markdown] remove code class failed",m),h.className=""}const f=p,g=f.match(/language-([a-zA-Z0-9_+-]+)/)||f.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!g||!g[1])try{const m=h.textContent||"";try{if(oe&&typeof oe.getLanguage=="function"&&oe.getLanguage("plaintext")){const w=oe.highlight(m,{language:"plaintext"});w&&w.value&&(h.innerHTML=w.value)}}catch{try{oe.highlightElement(h)}catch(y){console.warn("[markdown] hljs.highlightElement failed",y)}}}catch(m){console.warn("[markdown] code auto-detect failed",m)}}catch(c){console.warn("[markdown] processing code blocks failed",c)}})}catch(u){console.warn("[markdown] query code blocks failed",u)}r=a.body.innerHTML;const l=[];return o.forEach(u=>{l.push({level:Number(u.tagName.substring(1)),text:(u.textContent||"").trim(),id:u.id})}),{html:a.body.innerHTML,meta:i||{},toc:l}}catch(s){console.warn("post-process markdown failed",s)}return{html:r,meta:i||{},toc:[]}}function En(t,e){const n=new Set,i=/```\s*([a-zA-Z0-9_\-+]+)?/g,r=new Set(["then","now","if","once","so","and","or","but","when","the","a","an","as","let","const","var","export","import","from","true","false","null","npm","run","echo","sudo","this","that","have","using","some","return","returns","function","console","log","error","warn","class","new","undefined","with","select","from","where","join","on","group","order","by","having","as","into","values","like","limit","offset","create","table","index","view","insert","update","delete","returning","and","or","not","all","any","exists","case","when","then","else","end","distance","geometry","you","which","would","why","cool","other","same","everything","check"]),s=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);let a;for(;a=i.exec(t);)if(a[1]){const o=a[1].toLowerCase();if(en.has(o)||e&&e.size&&o.length<3&&!e.has(o)&&!(De&&De[o]&&e.has(De[o])))continue;if(e&&e.size){if(e.has(o)){const u=e.get(o);u&&n.add(u);continue}if(De&&De[o]){const u=De[o];if(e.has(u)){const h=e.get(u)||u;n.add(h);continue}}}(s.has(o)||o.length>=5&&o.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(o)&&!r.has(o))&&n.add(o)}return n}const qs=Object.freeze(Object.defineProperty({__proto__:null,addMarkdownExtension:vn,detectFenceLanguages:En,initRendererWorker:Sn,markdownPlugins:We,parseMarkdownToHtml:jt,setMarkdownExtensions:Ds},Symbol.toStringTag,{value:"Module"}));function Hs(t,e){const n=document.createElement("aside");n.className="menu nimbi-nav";const i=document.createElement("p");i.className="menu-label",i.textContent=t("navigation"),n.appendChild(i);const r=document.createElement("ul");return r.className="menu-list",e.forEach(s=>{const a=document.createElement("li"),o=document.createElement("a");if(o.href="#"+s.path,o.textContent=s.name,a.appendChild(o),s.children&&s.children.length){const l=document.createElement("ul");s.children.forEach(u=>{const h=document.createElement("li"),c=document.createElement("a");c.href="#"+u.path,c.textContent=u.name,h.appendChild(c),l.appendChild(h)}),a.appendChild(l)}r.appendChild(a)}),n.appendChild(r),n}function Us(t,e,n=""){const i=document.createElement("aside");i.className="menu nimbi-toc-inner";const r=document.createElement("p");r.className="menu-label",r.textContent=t("onThisPage"),i.appendChild(r);const s=document.createElement("ul");return s.className="menu-list",e.forEach(a=>{if(a.level===1)return;const o=document.createElement("li"),l=document.createElement("a"),u=a.id||re(a.text);try{const h=String(n||"").replace(/^[\.\/]+/,""),c=h&&H&&H.has&&H.has(h)?H.get(h):h;c?l.href=`?page=${encodeURIComponent(c)}#${encodeURIComponent(u)}`:l.href=`?page=${encodeURIComponent(u)}#${encodeURIComponent(u)}`}catch(h){console.warn("[htmlBuilder] buildTocElement href normalization failed",h);const c=String(n||"").replace(/^[\.\/]+/,""),p=c&&H&&H.has&&H.has(c)?H.get(c):c;p?l.href=`?page=${encodeURIComponent(p)}#${encodeURIComponent(u)}`:l.href=`?page=${encodeURIComponent(u)}#${encodeURIComponent(u)}`}l.textContent=a.text,o.appendChild(l),s.appendChild(o)}),i.appendChild(s),i}function Mr(t){t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(n=>{n.id||(n.id=re(n.textContent||""))})}function js(t,e,n){try{const i=t.querySelectorAll("img");if(i&&i.length){const r=e&&e.includes("/")?e.substring(0,e.lastIndexOf("/")+1):"";i.forEach(s=>{const a=s.getAttribute("src")||"";if(a&&!(/^(https?:)?\/\//.test(a)||a.startsWith("/")))try{const o=new URL(r+a,n).toString();s.src=o;try{s.getAttribute("loading")||s.setAttribute("data-want-lazy","1")}catch(l){console.warn("[htmlBuilder] set image loading attribute failed",l)}}catch(o){console.warn("[htmlBuilder] resolve image src failed",o)}})}}catch(i){console.warn("[htmlBuilder] lazyLoadImages failed",i)}}let Pr="",Rn=null,$r="";async function Ir(t,e,n){try{const i=t.querySelectorAll("a");if(!i||!i.length)return;let r,s;e===Pr&&Rn?(r=Rn,s=$r):(r=new URL(e),s=Tt(r.pathname),Pr=e,Rn=r,$r=s);const a=new Set,o=[];for(const l of Array.from(i))try{const u=l.getAttribute("href")||"";if(!u||Yn(u)||u.startsWith("/")&&!u.endsWith(".md"))continue;const h=u.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(h){let c=h[1];const p=h[2];!c.startsWith("/")&&n&&(c=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+c);try{const f=new URL(c,e).pathname;let g=f.startsWith(s)?f.slice(s.length):f;g=ge(g),o.push({node:l,mdPathRaw:c,frag:p,rel:g}),H.has(g)||a.add(g)}catch(f){console.warn("[htmlBuilder] resolve mdPath failed",f)}continue}try{const p=new URL(u,e).pathname||"";if(p&&p.indexOf(s)!==-1){let f=p.startsWith(s)?p.slice(s.length):p;if(f=ge(f),f=ot(f),f||(f="_home"),!f.endsWith(".md"))if(Z.has(f)){const g=Z.get(f),m=H.get(g)||f;l.setAttribute("href",`?page=${encodeURIComponent(m)}`)}else l.setAttribute("href",`?page=${encodeURIComponent(f)}`)}}catch(c){console.warn("[htmlBuilder] resolving href to URL failed",c)}}catch(u){console.warn("[htmlBuilder] processing anchor failed",u)}a.size&&await Promise.all(Array.from(a).map(async l=>{try{try{const h=String(l).match(/([^\/]+)\.md$/),c=h&&h[1];if(c&&Z.has(c)){try{const p=Z.get(c);if(p)try{H.set(p,c)}catch(f){console.warn("[htmlBuilder] mdToSlug.set failed",f)}}catch(p){console.warn("[htmlBuilder] reading slugToMd failed",p)}return}}catch(h){console.warn("[htmlBuilder] basename slug lookup failed",h)}const u=await be(l,e);if(u&&u.raw){const h=(u.raw||"").match(/^#\s+(.+)$/m);if(h&&h[1]){const c=re(h[1].trim());if(c)try{Z.set(c,l),H.set(l,c)}catch(p){console.warn("[htmlBuilder] setting slug mapping failed",p)}}}}catch(u){console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed",u)}}));for(const l of o){const{node:u,frag:h,rel:c}=l;let p=null;try{H.has(c)&&(p=H.get(c))}catch(f){console.warn("[htmlBuilder] mdToSlug access failed",f)}p?h?u.setAttribute("href",`?page=${encodeURIComponent(p)}#${encodeURIComponent(h)}`):u.setAttribute("href",`?page=${encodeURIComponent(p)}`):h?u.setAttribute("href",`?page=${encodeURIComponent(c)}#${encodeURIComponent(h)}`):u.setAttribute("href",`?page=${encodeURIComponent(c)}`)}}catch(i){console.warn("[htmlBuilder] rewriteAnchors failed",i)}}function Fs(t,e,n,i){const r=e.querySelector("h1"),s=r?(r.textContent||"").trim():"";let a="";try{s&&(a=re(s)),!a&&t&&t.meta&&t.meta.title&&(a=re(t.meta.title)),!a&&n&&(a=re(String(n))),a||(a="_home");try{n&&(Z.set(a,n),H.set(n,a))}catch(o){console.warn("[htmlBuilder] computeSlug set slug mapping failed",o)}try{let o="?page="+encodeURIComponent(a);try{const l=i||(location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):"");l&&(o+="#"+encodeURIComponent(l))}catch(l){console.warn("[htmlBuilder] computeSlug hash decode failed",l)}try{history.replaceState({page:a},"",o)}catch(l){console.warn("[htmlBuilder] computeSlug history replace failed",l)}}catch(o){console.warn("[htmlBuilder] computeSlug inner failed",o)}}catch(o){console.warn("[htmlBuilder] computeSlug failed",o)}return{topH1:r,h1Text:s,slugKey:a}}async function Ws(t,e){if(!t||!t.length)return;const n=new Set;for(const l of Array.from(t||[]))try{const u=l.getAttribute("href")||"";if(!u)continue;let p=ge(u).split(/::|#/,2)[0];if(!p||(p.includes(".")||(p=p+".html"),!/\.html(?:$|[?#])/.test(p)&&!p.toLowerCase().endsWith(".html")))continue;const f=p;try{if(H&&H.has&&H.has(f))continue}catch(g){console.warn("[htmlBuilder] mdToSlug check failed",g)}try{let g=!1;for(const m of Z.values())if(m===f){g=!0;break}if(g)continue}catch(g){console.warn("[htmlBuilder] slugToMd iteration failed",g)}n.add(f)}catch(u){console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed",u)}if(!n.size)return;const i=async l=>{try{const u=await be(l,e);if(u&&u.raw)try{const c=(Br||new DOMParser).parseFromString(u.raw,"text/html"),p=c.querySelector("title"),f=c.querySelector("h1"),g=p&&p.textContent&&p.textContent.trim()?p.textContent.trim():f&&f.textContent?f.textContent.trim():null;if(g){const m=re(g);if(m)try{Z.set(m,l),H.set(l,m)}catch(w){console.warn("[htmlBuilder] set slugToMd/mdToSlug failed",w)}}}catch(h){console.warn("[htmlBuilder] parse HTML title failed",h)}}catch(u){console.warn("[htmlBuilder] fetchAndExtract failed",u)}},r=5,s=Array.from(n);let a=0;const o=[];for(;a<s.length;){const l=s.slice(a,a+r);o.push(Promise.all(l.map(i))),a+=r}await Promise.all(o)}async function Zs(t,e){if(!t||!t.length)return;const n=[],i=new Set;let r="";try{const s=new URL(e);r=Tt(s.pathname)}catch(s){r="",console.warn("[htmlBuilder] preMapMdSlugs parse base failed",s)}for(const s of Array.from(t||[]))try{const a=s.getAttribute("href")||"";if(!a)continue;const o=a.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(o){let l=ge(o[1]);try{let u;try{u=new URL(l,e).pathname}catch(c){u=l,console.warn("[htmlBuilder] resolve mdPath URL failed",c)}const h=u.startsWith(r)?u.slice(r.length):u.replace(/^\//,"");n.push({rel:h}),H.has(h)||i.add(h)}catch(u){console.warn("[htmlBuilder] rewriteAnchors failed",u)}continue}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed",a)}i.size&&await Promise.all(Array.from(i).map(async s=>{try{const a=String(s).match(/([^\/]+)\.md$/),o=a&&a[1];if(o&&Z.has(o)){try{const l=Z.get(o);l&&H.set(l,o)}catch(l){console.warn("[htmlBuilder] preMapMdSlugs slug map access failed",l)}return}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs basename check failed",a)}try{const a=await be(s,e);if(a&&a.raw){const o=(a.raw||"").match(/^#\s+(.+)$/m);if(o&&o[1]){const l=re(o[1].trim());if(l)try{Z.set(l,s),H.set(s,l)}catch(u){console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed",u)}}}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs fetch failed",a)}}))}const Br=typeof DOMParser<"u"?new DOMParser:null;function Qs(t){try{const n=(Br||new DOMParser).parseFromString(t||"","text/html");Mr(n);try{n.querySelectorAll("img").forEach(o=>{try{o.getAttribute("loading")||o.setAttribute("data-want-lazy","1")}catch(l){console.warn("[htmlBuilder] parseHtml set image loading attribute failed",l)}})}catch(a){console.warn("[htmlBuilder] parseHtml query images failed",a)}n.querySelectorAll("pre code, code[class]").forEach(a=>{try{const o=a.getAttribute&&a.getAttribute("class")||a.className||"",l=o.match(/language-([a-zA-Z0-9_+-]+)/)||o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(l&&l[1]){const u=(l[1]||"").toLowerCase(),h=V.size&&(V.get(u)||V.get(String(u).toLowerCase()))||u;try{(async()=>{try{await nt(h)}catch(c){console.warn("[htmlBuilder] registerLanguage failed",c)}})()}catch(c){console.warn("[htmlBuilder] schedule registerLanguage failed",c)}}else try{if(oe&&typeof oe.getLanguage=="function"&&oe.getLanguage("plaintext")){const u=oe.highlight?oe.highlight(a.textContent||"",{language:"plaintext"}):null;u&&u.value&&(a.innerHTML=u.value)}}catch(u){console.warn("[htmlBuilder] plaintext highlight fallback failed",u)}}catch(o){console.warn("[htmlBuilder] code element processing failed",o)}});const r=[];return n.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(a=>{r.push({level:Number(a.tagName.substring(1)),text:(a.textContent||"").trim(),id:a.id})}),{html:n.body.innerHTML,meta:{},toc:r}}catch(e){return console.warn("[htmlBuilder] parseHtml failed",e),{html:t||"",meta:{},toc:[]}}}async function Gs(t){const e=En?En(t||"",V):new Set,n=new Set(e),i=[];for(const r of n)try{const s=V.size&&(V.get(r)||V.get(String(r).toLowerCase()))||r;try{i.push(nt(s))}catch(a){console.warn("[htmlBuilder] ensureLanguages push canonical failed",a)}if(String(r)!==String(s))try{i.push(nt(r))}catch(a){console.warn("[htmlBuilder] ensureLanguages push alias failed",a)}}catch(s){console.warn("[htmlBuilder] ensureLanguages inner failed",s)}try{await Promise.all(i)}catch(r){console.warn("[htmlBuilder] ensureLanguages failed",r)}}async function Xs(t){if(await Gs(t),jt){const e=await jt(t||"");return!e||typeof e!="object"?{html:String(t||""),meta:{},toc:[]}:(Array.isArray(e.toc)||(e.toc=[]),e.meta||(e.meta={}),e)}return{html:String(t||""),meta:{},toc:[]}}async function Ys(t,e,n,i,r){let s=null;e.isHtml?s=Qs(e.raw||""):s=await Xs(e.raw||"");const a=document.createElement("article");a.className="nimbi-article content",a.innerHTML=s.html;try{Mr(a)}catch(c){console.warn("[htmlBuilder] addHeadingIds failed",c)}try{a.querySelectorAll("pre code, code[class]").forEach(p=>{try{const f=p.getAttribute&&p.getAttribute("class")||p.className||"",g=String(f||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(g)try{p.setAttribute&&p.setAttribute("class",g)}catch(m){p.className=g,console.warn("[htmlBuilder] set element class failed",m)}else try{p.removeAttribute&&p.removeAttribute("class")}catch(m){p.className="",console.warn("[htmlBuilder] remove element class failed",m)}}catch(f){console.warn("[htmlBuilder] code element cleanup failed",f)}})}catch(c){console.warn("[htmlBuilder] processing code elements failed",c)}try{Un(a)}catch(c){console.warn("[htmlBuilder] observeCodeBlocks failed",c)}js(a,n,r);try{await Ks(a,r,n)}catch(c){console.warn("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread",c),await Ir(a,r,n)}const{topH1:o,h1Text:l,slugKey:u}=Fs(s,a,n,i),h=Us(t,s.toc,n);return{article:a,parsed:s,toc:h,topH1:o,h1Text:l,slugKey:u}}function zr(t,e,n){t&&(t.innerHTML="");const i=document.createElement("article");i.className="nimbi-article content nimbi-not-found";const r=document.createElement("h1");r.textContent=e&&e("notFound")||"Page not found";const s=document.createElement("p");s.textContent=n&&n.message?String(n.message):"Failed to resolve the requested page.",i.appendChild(r),i.appendChild(s),t&&t.appendChild&&t.appendChild(i)}async function Ks(t,e,n){return Ir(t,e,n)}function Vs(t){try{t.addEventListener("click",e=>{const n=e.target&&e.target.closest?e.target.closest("a"):null;if(!n)return;const i=n.getAttribute("href")||"";try{const r=new URL(i,location.href),s=r.searchParams.get("page"),a=r.hash?r.hash.replace(/^#/,""):null;if(!s&&!a)return;e.preventDefault();let o=null;try{history&&history.state&&history.state.page&&(o=history.state.page)}catch(l){o=null,console.warn("[htmlBuilder] access history.state failed",l)}try{o||(o=new URL(location.href).searchParams.get("page"))}catch(l){console.warn("[htmlBuilder] parse current location failed",l)}if(!s&&a||s&&o&&String(s)===String(o)){try{if(!s&&a)try{history.replaceState(history.state,"",(location.pathname||"")+(location.search||"")+(a?"#"+encodeURIComponent(a):""))}catch(l){console.warn("[htmlBuilder] history.replaceState failed",l)}else try{history.replaceState({page:o||s},"","?page="+encodeURIComponent(o||s)+(a?"#"+encodeURIComponent(a):""))}catch(l){console.warn("[htmlBuilder] history.replaceState failed",l)}}catch(l){console.warn("[htmlBuilder] update history for anchor failed",l)}try{e.stopImmediatePropagation&&e.stopImmediatePropagation(),e.stopPropagation&&e.stopPropagation()}catch(l){console.warn("[htmlBuilder] stopPropagation failed",l)}try{An(a)}catch(l){console.warn("[htmlBuilder] scrollToAnchorOrTop failed",l)}return}history.pushState({page:s},"","?page="+encodeURIComponent(s)+(a?"#"+encodeURIComponent(a):""));try{if(typeof window<"u"&&typeof window.renderByQuery=="function")try{window.renderByQuery()}catch(l){console.warn("[htmlBuilder] window.renderByQuery failed",l)}else if(typeof window<"u")try{window.dispatchEvent(new PopStateEvent("popstate"))}catch(l){console.warn("[htmlBuilder] dispatch popstate failed",l)}else try{renderByQuery()}catch(l){console.warn("[htmlBuilder] renderByQuery failed",l)}}catch(l){console.warn("[htmlBuilder] SPA navigation invocation failed",l)}}catch(r){console.warn("[htmlBuilder] non-URL href in attachTocClickHandler",r)}})}catch(e){console.warn("[htmlBuilder] attachTocClickHandler failed",e)}}function An(t){const e=document.querySelector(".nimbi-cms")||null;if(t){const n=document.getElementById(t);if(n)try{const i=()=>{try{if(e&&e.scrollTo&&e.contains(n)){const r=n.getBoundingClientRect().top-e.getBoundingClientRect().top+e.scrollTop;e.scrollTo({top:r,behavior:"smooth"})}else try{n.scrollIntoView({behavior:"smooth",block:"start"})}catch{try{n.scrollIntoView()}catch(s){console.warn("[htmlBuilder] scrollIntoView failed",s)}}}catch{try{n.scrollIntoView()}catch(s){console.warn("[htmlBuilder] final scroll fallback failed",s)}}};try{requestAnimationFrame(()=>setTimeout(i,50))}catch(r){console.warn("[htmlBuilder] scheduling scroll failed",r),setTimeout(i,50)}}catch(i){try{n.scrollIntoView()}catch(r){console.warn("[htmlBuilder] final scroll fallback failed",r)}console.warn("[htmlBuilder] doScroll failed",i)}}else try{e&&e.scrollTo?e.scrollTo({top:0,behavior:"smooth"}):window.scrollTo(0,0)}catch(n){try{window.scrollTo(0,0)}catch(i){console.warn("[htmlBuilder] window.scrollTo failed",i)}console.warn("[htmlBuilder] scroll to top failed",n)}}function Js(t,e,{mountOverlay:n=null,container:i=null,mountEl:r=null,navWrap:s=null,t:a=null}={}){try{const o=a||(m=>typeof m=="string"?m:""),l=i||document.querySelector(".nimbi-cms"),u=r||document.querySelector(".nimbi-mount"),h=n||document.querySelector(".nimbi-overlay"),c=s||document.querySelector(".nimbi-nav-wrap");let f=document.querySelector(".nimbi-scroll-top");if(!f){f=document.createElement("button"),f.className="nimbi-scroll-top",f.setAttribute("aria-label",o("scrollToTop")),f.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';try{h&&h.appendChild?h.appendChild(f):l&&l.appendChild?l.appendChild(f):u&&u.appendChild?u.appendChild(f):document.body.appendChild(f)}catch{try{document.body.appendChild(f)}catch(w){console.warn("[htmlBuilder] append scroll top button failed",w)}}try{f.style.position="absolute",f.style.right="1rem",f.style.bottom="1.25rem",f.style.zIndex="60"}catch(m){console.warn("[htmlBuilder] set scroll-top button styles failed",m)}f.addEventListener("click",()=>{try{i&&i.scrollTo?i.scrollTo({top:0,left:0,behavior:"smooth"}):r&&r.scrollTo?r.scrollTo({top:0,left:0,behavior:"smooth"}):window.scrollTo({top:0,left:0,behavior:"smooth"})}catch{try{i&&(i.scrollTop=0)}catch(w){console.warn("[htmlBuilder] fallback container scrollTop failed",w)}try{r&&(r.scrollTop=0)}catch(w){console.warn("[htmlBuilder] fallback mountEl scrollTop failed",w)}try{document.documentElement.scrollTop=0}catch(w){console.warn("[htmlBuilder] fallback document scrollTop failed",w)}}})}const g=c&&c.querySelector?c.querySelector(".menu-label"):null;if(e){if(!f._nimbiObserver){const m=new IntersectionObserver(w=>{for(const y of w)y.target instanceof Element&&(y.isIntersecting?(f.classList.remove("show"),g&&g.classList.remove("show")):(f.classList.add("show"),g&&g.classList.add("show")))},{root:i instanceof Element?i:r instanceof Element?r:null,threshold:0});f._nimbiObserver=m}try{f._nimbiObserver.disconnect()}catch(m){console.warn("[htmlBuilder] observer disconnect failed",m)}try{f._nimbiObserver.observe(e)}catch(m){console.warn("[htmlBuilder] observer observe failed",m)}try{const m=()=>{try{const w=l instanceof Element?l.getBoundingClientRect():{top:0,bottom:window.innerHeight},y=e.getBoundingClientRect();!(y.bottom<w.top||y.top>w.bottom)?(f.classList.remove("show"),g&&g.classList.remove("show")):(f.classList.add("show"),g&&g.classList.add("show"))}catch(w){console.warn("[htmlBuilder] checkIntersect failed",w)}};m(),"IntersectionObserver"in window||setTimeout(m,100)}catch(m){console.warn("[htmlBuilder] checkIntersect outer failed",m)}}else{f.classList.remove("show"),g&&g.classList.remove("show");const m=i instanceof Element?i:r instanceof Element?r:window,w=()=>{try{(m===window?window.scrollY:m.scrollTop||0)>10?(f.classList.add("show"),g&&g.classList.add("show")):(f.classList.remove("show"),g&&g.classList.remove("show"))}catch(y){console.warn("[htmlBuilder] onScroll handler failed",y)}};_t(()=>m.addEventListener("scroll",w)),w()}}catch(o){console.warn("[htmlBuilder] ensureScrollTopButton failed",o)}}async function ea(t,e,n,i,r,s,a,o,l="eager",u=1,h=void 0){if(!t||!(t instanceof HTMLElement))throw new TypeError("navbarWrap must be an HTMLElement");const c=typeof DOMParser<"u"?new DOMParser:null,p=c?c.parseFromString(n||"","text/html"):null,f=p?p.querySelectorAll("a"):[];await _t(()=>Ws(f,i)),await _t(()=>Zs(f,i));let g=null,m=null,w=!1;const y=document.createElement("nav");y.className="navbar",y.setAttribute("role","navigation"),y.setAttribute("aria-label","main navigation");const S=document.createElement("div");S.className="navbar-brand";const N=f[0],_=document.createElement("a");if(_.className="navbar-item",N){const C=N.getAttribute("href")||"#";try{const M=new URL(C,location.href).searchParams.get("page");M?_.href="?page="+encodeURIComponent(decodeURIComponent(M)):(_.href="?page="+encodeURIComponent(r),_.textContent=s("home"))}catch{_.href="?page="+encodeURIComponent(r),_.textContent=s("home")}}else _.href="?page="+encodeURIComponent(r),_.textContent=s("home");S.appendChild(_),_.addEventListener("click",function(C){const Q=_.getAttribute("href")||"";if(Q.startsWith("?page=")){C.preventDefault();const M=new URL(Q,location.href),v=M.searchParams.get("page"),b=M.hash?M.hash.replace(/^#/,""):null;history.pushState({page:v},"","?page="+encodeURIComponent(v)+(b?"#"+encodeURIComponent(b):""));try{a()}catch(R){console.warn("[nimbi-cms] renderByQuery failed",R)}}});const z=document.createElement("a");z.className="navbar-burger",z.setAttribute("role","button"),z.setAttribute("aria-label","menu"),z.setAttribute("aria-expanded","false");const I="nimbi-navbar-menu";z.dataset.target=I,z.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>',S.appendChild(z);try{z.addEventListener("click",C=>{try{const Q=z.dataset&&z.dataset.target?z.dataset.target:null,M=Q?document.getElementById(Q):null;z.classList.contains("is-active")?(z.classList.remove("is-active"),z.setAttribute("aria-expanded","false"),M&&M.classList.remove("is-active")):(z.classList.add("is-active"),z.setAttribute("aria-expanded","true"),M&&M.classList.add("is-active"))}catch(Q){console.warn("[nimbi-cms] navbar burger toggle failed",Q)}})}catch(C){console.warn("[nimbi-cms] burger event binding failed",C)}const te=document.createElement("div");te.className="navbar-menu",te.id=I;const ce=document.createElement("div");ce.className="navbar-start";let ne,J,F;if(!o)ne=null,m=null,F=null;else{ne=document.createElement("div"),ne.className="navbar-end",J=document.createElement("div"),J.className="navbar-item",J.style.position="relative",m=document.createElement("input"),m.className="input",m.type="search",m.placeholder=s("searchPlaceholder")||"",m.id="nimbi-search",l==="eager"&&(m.disabled=!0,m.classList.add("is-loading")),J.appendChild(m),F=document.createElement("div"),F.id="nimbi-search-results",F.className="box",F.style.position="absolute",F.style.top="100%",F.style.right="0",F.style.left="auto",F.style.zIndex="10000",F.style.minWidth="240px",F.style.maxWidth="420px",F.style.maxHeight="50vh",F.style.overflowY="auto",F.style.display="none",F.style.padding="8px",F.style.boxShadow="0 6px 18px rgba(10,10,10,0.1)",J.appendChild(F),ne.appendChild(J);const C=M=>{if(F.innerHTML="",!M.length){F.style.display="none";return}M.forEach(v=>{const b=document.createElement("div");if(b.style.marginBottom="6px",b.style.padding="6px",b.style.borderBottom="1px solid rgba(0,0,0,0.06)",v.parentTitle){const k=document.createElement("div");k.textContent=v.parentTitle,k.style.fontSize="11px",k.style.opacity="0.7",k.style.marginBottom="4px",k.className="nimbi-search-parent",k.style.whiteSpace="nowrap",k.style.overflow="hidden",k.style.textOverflow="ellipsis",k.style.display="block",k.style.maxWidth="100%",b.appendChild(k)}const R=document.createElement("a");R.className="block",R.href="?page="+encodeURIComponent(v.slug),R.textContent=v.title,R.style.whiteSpace="nowrap",R.style.overflow="hidden",R.style.textOverflow="ellipsis",R.addEventListener("click",()=>{F.style.display="none"}),b.appendChild(R),F.appendChild(b)}),F.style.display="block",F.style.right="0",F.style.left="auto"},Q=(M,v)=>{let b=null;return(...R)=>{b&&clearTimeout(b),b=setTimeout(()=>M(...R),v)}};if(m){const M=Q(async()=>{const v=document.querySelector("input#nimbi-search"),b=String(v&&v.value||"").trim().toLowerCase();if(!b){C([]);return}try{const R=await Promise.resolve().then(()=>zt);g||(g=(async()=>{try{return l==="lazy"&&R.buildSearchIndexWorker?R.buildSearchIndexWorker(i,u,h):R.buildSearchIndex(i,u,h)}catch(Y){return console.warn("[nimbi-cms] buildSearchIndex failed",Y),[]}finally{v&&(v.removeAttribute("disabled"),v.classList.remove("is-loading"))}})());const B=(await g).filter(Y=>Y.title&&Y.title.toLowerCase().includes(b)||Y.excerpt&&Y.excerpt.toLowerCase().includes(b));C(B.slice(0,10))}catch(R){console.warn("[nimbi-cms] search input handler failed",R),C([])}},50);m&&m.addEventListener("input",M),document.addEventListener("click",v=>{const b=document.querySelector("input#nimbi-search");b&&!b.contains(v.target)&&F&&!F.contains(v.target)&&(F.style.display="none")})}if(l==="eager"){try{g=(async()=>{try{const v=await(await Promise.resolve().then(()=>zt)).buildSearchIndex(i,u,h);return w||(w=!0),v}catch(M){return console.warn("[nimbi-cms] buildSearchIndex failed",M),[]}})()}catch(M){console.warn("[nimbi-cms] eager search index init failed",M),g=Promise.resolve([])}g.finally(()=>{const M=document.querySelector("input#nimbi-search");M&&(M.removeAttribute("disabled"),M.classList.remove("is-loading"))})}}for(let C=0;C<f.length;C++){const Q=f[C];if(C===0)continue;const M=Q.getAttribute("href")||"#",v=document.createElement("a");v.className="navbar-item";try{if(/^[^#]*\.md(?:$|[#?])/.test(M)||M.endsWith(".md")){const R=ge(M).split(/::|#/,2),k=R[0],B=R[1];v.href="?page="+encodeURIComponent(k)+(B?"#"+encodeURIComponent(B):"")}else if(/\.html(?:$|[#?])/.test(M)||M.endsWith(".html")){const R=ge(M).split(/::|#/,2);let k=R[0];k&&!k.toLowerCase().endsWith(".html")&&(k=k+".html");const B=R[1];try{const Y=await be(k,i);if(Y&&Y.raw)try{const Te=new DOMParser().parseFromString(Y.raw,"text/html"),Ee=Te.querySelector("title"),xe=Te.querySelector("h1"),me=Ee&&Ee.textContent&&Ee.textContent.trim()?Ee.textContent.trim():xe&&xe.textContent?xe.textContent.trim():null;if(me){const Ce=re(me);if(Ce){try{Z.set(Ce,k),H.set(k,Ce)}catch(He){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",He)}v.href="?page="+encodeURIComponent(Ce)+(B?"#"+encodeURIComponent(B):"")}else v.href="?page="+encodeURIComponent(k)+(B?"#"+encodeURIComponent(B):"")}else v.href="?page="+encodeURIComponent(k)+(B?"#"+encodeURIComponent(B):"")}catch{v.href="?page="+encodeURIComponent(k)+(B?"#"+encodeURIComponent(B):"")}else v.href=M}catch{v.href=M}}else v.href=M}catch(b){console.warn("[nimbi-cms] nav item href parse failed",b),v.href=M}try{const b=Q.textContent&&String(Q.textContent).trim()?String(Q.textContent).trim():null;if(b)try{const R=re(b);if(R){const k=v.getAttribute&&v.getAttribute("href")?v.getAttribute("href"):"";try{const Y=new URL(k,location.href).searchParams.get("page");if(Y){const le=decodeURIComponent(Y);try{Z.set(R,le),H.set(le,R)}catch(Te){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",Te)}}}catch(B){console.warn("[nimbi-cms] nav slug mapping failed",B)}}}catch(R){console.warn("[nimbi-cms] nav slug mapping failed",R)}}catch(b){console.warn("[nimbi-cms] nav slug mapping failed",b)}v.textContent=Q.textContent||M,ce.appendChild(v)}try{m=document.getElementById("nimbi-search");const C=document.getElementById("nimbi-search-results"),Q=v=>{if(C.innerHTML="",!v.length){C.style.display="none";return}v.forEach(b=>{const R=document.createElement("div");if(R.style.marginBottom="6px",R.style.padding="6px",R.style.borderBottom="1px solid rgba(0,0,0,0.06)",b.parentTitle){const B=document.createElement("div");B.textContent=b.parentTitle,B.style.fontSize="11px",B.style.opacity="0.7",B.style.marginBottom="4px",B.className="nimbi-search-parent",B.style.whiteSpace="nowrap",B.style.overflow="hidden",B.style.textOverflow="ellipsis",B.style.display="block",B.style.maxWidth="100%",R.appendChild(B)}const k=document.createElement("a");k.className="block",k.href="?page="+encodeURIComponent(b.slug),k.textContent=b.title,k.style.whiteSpace="nowrap",k.style.overflow="hidden",k.style.textOverflow="ellipsis",k.addEventListener("click",()=>{C.style.display="none"}),R.appendChild(k),C.appendChild(R)}),C.style.display="block",C.style.right="0",C.style.left="auto"},M=(v,b)=>{let R=null;return(...k)=>{R&&clearTimeout(R),R=setTimeout(()=>v(...k),b)}};if(m){const v=M(async()=>{const b=String(m.value||"").trim().toLowerCase();if(!b){Q([]);return}try{const R=await Promise.resolve().then(()=>zt);g||(g=(async()=>{try{return l==="lazy"&&R.buildSearchIndexWorker?R.buildSearchIndexWorker(i,u,h):R.buildSearchIndex(i,u,h)}catch(Y){return console.warn("[nimbi-cms] buildSearchIndex failed",Y),[]}finally{m&&(m.disabled=!1,m.classList.remove("is-loading"))}})());const B=(await g).filter(Y=>Y.title&&Y.title.toLowerCase().includes(b)||Y.excerpt&&Y.excerpt.toLowerCase().includes(b));Q(B.slice(0,10))}catch(R){console.warn("[nimbi-cms] search input handler failed",R),Q([])}},50);m.addEventListener("input",v),document.addEventListener("click",b=>{m&&!m.contains(b.target)&&C&&!C.contains(b.target)&&(C.style.display="none")})}}catch(C){console.warn("[nimbi-cms] navbar/search setup inner failed",C)}te.appendChild(ce),ne&&te.appendChild(ne),y.appendChild(S),y.appendChild(te),t.appendChild(y);try{te.addEventListener("click",C=>{const Q=C.target&&C.target.closest?C.target.closest("a"):null;if(!Q)return;const M=Q.getAttribute("href")||"";try{const v=new URL(M,location.href),b=v.searchParams.get("page"),R=v.hash?v.hash.replace(/^#/,""):null;if(b){C.preventDefault(),history.pushState({page:b},"","?page="+encodeURIComponent(b)+(R?"#"+encodeURIComponent(R):""));try{a()}catch(k){console.warn("[nimbi-cms] renderByQuery failed",k)}}}catch(v){console.warn("[nimbi-cms] navbar click handler failed",v)}try{const v=y&&y.querySelector?y.querySelector(".navbar-burger"):null,b=v&&v.dataset?v.dataset.target:null,R=b?document.getElementById(b):null;v&&v.classList.contains("is-active")&&(v.classList.remove("is-active"),v.setAttribute("aria-expanded","false"),R&&R.classList.remove("is-active"))}catch(v){console.warn("[nimbi-cms] mobile menu close failed",v)}})}catch(C){console.warn("[nimbi-cms] attach content click handler failed",C)}try{e.addEventListener("click",C=>{const Q=C.target&&C.target.closest?C.target.closest("a"):null;if(!Q)return;const M=Q.getAttribute("href")||"";if(M&&!Yn(M))try{const v=new URL(M,location.href),b=v.searchParams.get("page"),R=v.hash?v.hash.replace(/^#/,""):null;if(b){C.preventDefault(),history.pushState({page:b},"","?page="+encodeURIComponent(b)+(R?"#"+encodeURIComponent(R):""));try{a()}catch(k){console.warn("[nimbi-cms] renderByQuery failed",k)}}}catch(v){console.warn("[nimbi-cms] container click URL parse failed",v)}})}catch(C){console.warn("[nimbi-cms] build navbar failed",C)}return{navbar:y,linkEls:f}}var Tn,Or;function ta(){if(Or)return Tn;Or=1;function t(s,a){return a.some(([o,l])=>o<=s&&s<=l)}function e(s){if(typeof s!="string")return!1;const a=s.charCodeAt(0);return t(a,[[12352,12447],[19968,40959],[44032,55203],[131072,191456]])}function n(s){return` 
\r	`.includes(s)}function i(s){if(typeof s!="string")return!1;const a=s.charCodeAt(0);return t(a,[[33,47],[58,64],[91,96],[123,126],[12288,12351],[65280,65519]])}function r(s,a={}){let o=0,l=0,u=s.length-1;const h=a.wordsPerMinute||200,c=a.wordBound||n;for(;c(s[l]);)l++;for(;c(s[u]);)u--;const p=`${s}
`;for(let w=l;w<=u;w++)if((e(p[w])||!c(p[w])&&(c(p[w+1])||e(p[w+1])))&&o++,e(p[w]))for(;w<=u&&(i(p[w+1])||c(p[w+1]));)w++;const f=o/h,g=Math.round(f*60*1e3);return{text:Math.ceil(f.toFixed(2))+" min read",minutes:f,time:g,words:o}}return Tn=r,Tn}var na=ta();const ra=Dn(na);function Nr(t,e){let n=document.querySelector(`meta[name="${t}"]`);n||(n=document.createElement("meta"),n.setAttribute("name",t),document.head.appendChild(n)),n.setAttribute("content",e)}function st(t,e,n){let i=`meta[${t}="${e}"]`,r=document.querySelector(i);r||(r=document.createElement("meta"),r.setAttribute(t,e),document.head.appendChild(r)),r.setAttribute("content",n)}function ia(t,e){try{let n=document.querySelector(`link[rel="${t}"]`);n||(n=document.createElement("link"),n.setAttribute("rel",t),document.head.appendChild(n)),n.setAttribute("href",e)}catch(n){console.warn("[seoManager] upsertLinkRel failed",n)}}function sa(t,e,n,i){const r=e&&String(e).trim()?e:t.title||document.title;st("property","og:title",r);const s=i&&String(i).trim()?i:t.description||"";s&&String(s).trim()&&st("property","og:description",s),st("name","twitter:card",t.twitter_card||"summary_large_image");const a=n||t.image;a&&(st("property","og:image",a),st("name","twitter:image",a))}function aa(t,e,n,i,r=""){const s=t.meta||{},a=document&&document.querySelector&&document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",o=i&&String(i).trim()?i:s.description&&String(s.description).trim()?s.description:a&&String(a).trim()?a:"";o&&String(o).trim()&&Nr("description",o),Nr("robots",s.robots||"index,follow"),sa(s,e,n,o)}function la(){try{const t=['meta[name="site"]','meta[name="site-name"]','meta[name="siteName"]','meta[property="og:site_name"]','meta[name="twitter:site"]'];for(const e of t){const n=document.querySelector(e);if(n){const i=n.getAttribute("content")||"";if(i&&i.trim())return i.trim()}}}catch(t){console.warn("[seoManager] getSiteNameFromMeta failed",t)}return""}function oa(t,e,n,i,r,s=""){try{const a=t.meta||{},o=n&&String(n).trim()?n:a.title||s||document.title,l=r&&String(r).trim()?r:a.description||document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",u=i||a.image||null;let h="";try{if(e){const g=ge(e);try{h=(location.origin+location.pathname).split("?")[0]+"?page="+encodeURIComponent(g)}catch{h=location.href.split("#")[0]}}else h=location.href.split("#")[0]}catch(g){h=location.href.split("#")[0],console.warn("[seoManager] compute canonical failed",g)}h&&ia("canonical",h);try{st("property","og:url",h)}catch(g){console.warn("[seoManager] upsertMeta og:url failed",g)}const c={"@context":"https://schema.org","@type":"Article",headline:o||"",description:l||"",url:h||location.href.split("#")[0]};u&&(c.image=String(u)),a.date&&(c.datePublished=a.date),a.dateModified&&(c.dateModified=a.dateModified);const p="nimbi-jsonld";let f=document.getElementById(p);f||(f=document.createElement("script"),f.type="application/ld+json",f.id=p,document.head.appendChild(f)),f.textContent=JSON.stringify(c,null,2)}catch(a){console.warn("[seoManager] setStructuredData failed",a)}}function ca(t,e,n,i,r,s,a,o,l,u,h){try{const c=i.querySelector(".menu-label");c&&(c.textContent=o&&o.textContent||t("onThisPage"))}catch(c){console.warn("[seoManager] update toc label failed",c)}try{const c=n.meta&&n.meta.title?String(n.meta.title).trim():"",p=r.querySelector("img"),f=p&&(p.getAttribute("src")||p.src)||null;let g="";try{let w="";try{const y=o||(r&&r.querySelector?r.querySelector("h1"):null);if(y){let S=y.nextElementSibling;const N=[];for(;S&&!(S.tagName&&S.tagName.toLowerCase()==="h2");){const _=(S.textContent||"").trim();_&&N.push(_),S=S.nextElementSibling}N.length&&(w=N.join(" ").replace(/\s+/g," ").trim()),!w&&l&&(w=String(l).trim())}}catch(y){console.warn("[seoManager] compute descOverride failed",y)}w&&String(w).length>160&&(w=String(w).slice(0,157).trim()+"..."),g=w}catch(w){console.warn("[seoManager] compute descOverride failed",w)}try{aa(n,l,f,g)}catch(w){console.warn("[seoManager] setMetaTags failed",w)}try{oa(n,u,l,f,g,e)}catch(w){console.warn("[seoManager] setStructuredData failed",w)}const m=la();l?m?document.title=`${m} - ${l}`:document.title=`${e||"Site"} - ${l}`:c?document.title=c:document.title=e||document.title}catch(c){console.warn("[seoManager] applyPageMeta failed",c)}try{const c=r.querySelector(".nimbi-reading-time");if(c&&c.remove(),l){const p=ra(h.raw||""),f=p&&typeof p.minutes=="number"?Math.ceil(p.minutes):0,g=document.createElement("p");g.className="nimbi-reading-time",g.textContent=f?t("readingTime",{minutes:f}):"";const m=r.querySelector("h1");m&&m.insertAdjacentElement("afterend",g)}}catch(c){console.warn("[seoManager] reading time update failed",c)}}let ke=null,q=null,ye=1,Ze=(t,e)=>e,kt=0,yt=0,Ft=()=>{},xt=.25;function ua(){if(ke&&document.contains(ke))return ke;ke=null;const t=document.createElement("dialog");t.className="nimbi-image-preview",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label",Ze("imagePreviewTitle","Image preview")),t.innerHTML=`
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
  `,t.addEventListener("click",b=>{b.target===t&&Cn()}),t.addEventListener("wheel",b=>{if(!J())return;b.preventDefault();const R=b.deltaY<0?xt:-xt;qe(ye+R),u(),h()},{passive:!1}),t.addEventListener("keydown",b=>{if(b.key==="Escape"){Cn();return}if(ye>1){const R=t.querySelector(".nimbi-image-preview__image-wrapper");if(!R)return;const k=40;switch(b.key){case"ArrowUp":R.scrollTop-=k,b.preventDefault();break;case"ArrowDown":R.scrollTop+=k,b.preventDefault();break;case"ArrowLeft":R.scrollLeft-=k,b.preventDefault();break;case"ArrowRight":R.scrollLeft+=k,b.preventDefault();break}}}),document.body.appendChild(t),ke=t,q=t.querySelector("[data-nimbi-preview-image]");const e=t.querySelector("[data-nimbi-preview-fit]"),n=t.querySelector("[data-nimbi-preview-original]"),i=t.querySelector("[data-nimbi-preview-zoom-in]"),r=t.querySelector("[data-nimbi-preview-zoom-out]"),s=t.querySelector("[data-nimbi-preview-reset]"),a=t.querySelector("[data-nimbi-preview-close]"),o=t.querySelector("[data-nimbi-preview-zoom-label]"),l=t.querySelector("[data-nimbi-preview-zoom-hud]");function u(){o&&(o.textContent=`${Math.round(ye*100)}%`)}const h=()=>{l&&(l.textContent=`${Math.round(ye*100)}%`,l.classList.add("visible"),clearTimeout(l._timeout),l._timeout=setTimeout(()=>l.classList.remove("visible"),800))};Ft=u,i.addEventListener("click",()=>{qe(ye+xt),u(),h()}),r.addEventListener("click",()=>{qe(ye-xt),u(),h()}),e.addEventListener("click",()=>{St(),u(),h()}),n.addEventListener("click",()=>{qe(1),u(),h()}),s.addEventListener("click",()=>{St(),u(),h()}),a.addEventListener("click",Cn),e.title=Ze("imagePreviewFit","Fit to screen"),n.title=Ze("imagePreviewOriginal","Original size"),r.title=Ze("imagePreviewZoomOut","Zoom out"),i.title=Ze("imagePreviewZoomIn","Zoom in"),a.title=Ze("imagePreviewClose","Close"),a.setAttribute("aria-label",Ze("imagePreviewClose","Close"));let c=!1,p=0,f=0,g=0,m=0;const w=new Map;let y=0,S=1;const N=(b,R)=>{const k=b.x-R.x,B=b.y-R.y;return Math.hypot(k,B)},_=()=>{c=!1,w.clear(),y=0,q&&(q.style.cursor="all-scroll")};let z=0,I=0,te=0;const ce=b=>{const R=Date.now(),k=R-z,B=b.clientX-I,Y=b.clientY-te;z=R,I=b.clientX,te=b.clientY,k<300&&Math.hypot(B,Y)<30&&(qe(ye>1?1:2),u(),b.preventDefault())},ne=b=>{qe(ye>1?1:2),u(),b.preventDefault()},J=()=>ke?typeof ke.open=="boolean"?ke.open:ke.classList.contains("is-active"):!1,F=(b,R,k=1)=>{if(w.has(k)&&w.set(k,{x:b,y:R}),w.size===2){const Te=Array.from(w.values()),Ee=N(Te[0],Te[1]);if(y>0){const xe=Ee/y;qe(S*xe)}return}if(!c)return;const B=q.closest(".nimbi-image-preview__image-wrapper");if(!B)return;const Y=b-p,le=R-f;B.scrollLeft=g-Y,B.scrollTop=m-le},C=(b,R,k=1)=>{if(!J())return;if(w.set(k,{x:b,y:R}),w.size===2){const le=Array.from(w.values());y=N(le[0],le[1]),S=ye;return}const B=q.closest(".nimbi-image-preview__image-wrapper");!B||!(B.scrollWidth>B.clientWidth||B.scrollHeight>B.clientHeight)||(c=!0,p=b,f=R,g=B.scrollLeft,m=B.scrollTop,q.style.cursor="all-scroll",window.addEventListener("pointermove",Q),window.addEventListener("pointerup",M),window.addEventListener("pointercancel",M))},Q=b=>{c&&(b.preventDefault(),F(b.clientX,b.clientY,b.pointerId))},M=()=>{_(),window.removeEventListener("pointermove",Q),window.removeEventListener("pointerup",M),window.removeEventListener("pointercancel",M)};q.addEventListener("pointerdown",b=>{b.preventDefault(),C(b.clientX,b.clientY,b.pointerId)}),q.addEventListener("pointermove",b=>{(c||w.size===2)&&b.preventDefault(),F(b.clientX,b.clientY,b.pointerId)}),q.addEventListener("pointerup",b=>{b.preventDefault(),b.pointerType==="touch"&&ce(b),_()}),q.addEventListener("dblclick",ne),q.addEventListener("pointercancel",_),q.addEventListener("mousedown",b=>{b.preventDefault(),C(b.clientX,b.clientY,1)}),q.addEventListener("mousemove",b=>{c&&b.preventDefault(),F(b.clientX,b.clientY,1)}),q.addEventListener("mouseup",b=>{b.preventDefault(),_()});const v=t.querySelector(".nimbi-image-preview__image-wrapper");return v&&(v.addEventListener("pointerdown",b=>{C(b.clientX,b.clientY,b.pointerId)}),v.addEventListener("pointermove",b=>{F(b.clientX,b.clientY,b.pointerId)}),v.addEventListener("pointerup",_),v.addEventListener("pointercancel",_),v.addEventListener("mousedown",b=>{C(b.clientX,b.clientY,1)}),v.addEventListener("mousemove",b=>{F(b.clientX,b.clientY,1)}),v.addEventListener("mouseup",_)),t}function qe(t){if(!q)return;const e=Number(t);ye=Number.isFinite(e)?Math.max(.1,Math.min(4,e)):1;const i=q.getBoundingClientRect(),r=kt||q.naturalWidth||q.width||i.width||0,s=yt||q.naturalHeight||q.height||i.height||0;r&&s?(q.style.maxWidth="none",q.style.maxHeight="none",q.style.width=`${r*ye}px`,q.style.height=`${s*ye}px`,q.style.transform=""):(q.style.maxWidth="",q.style.maxHeight="",q.style.width="",q.style.height="",q.style.transform=`scale(${ye})`),q&&(q.style.cursor="all-scroll")}function St(){if(!q)return;const t=q.closest(".nimbi-image-preview__image-wrapper");if(!t)return;const e=t.getBoundingClientRect();if(e.width===0||e.height===0)return;const n=kt||q.naturalWidth||e.width,i=yt||q.naturalHeight||e.height;if(!n||!i)return;const r=e.width/n,s=e.height/i,a=Math.min(r,s,1);qe(Number.isFinite(a)?a:1)}function ha(t,e="",n=0,i=0){const r=ua();ye=1,kt=n||0,yt=i||0,q.src=t,q.alt=e,q.style.transform="scale(1)";const s=()=>{kt=q.naturalWidth||q.width||0,yt=q.naturalHeight||q.height||0};if(s(),St(),Ft(),requestAnimationFrame(()=>{St(),Ft()}),!kt||!yt){const a=()=>{s(),requestAnimationFrame(()=>{St(),Ft()}),q.removeEventListener("load",a)};q.addEventListener("load",a)}typeof r.showModal=="function"&&(r.open||r.showModal()),r.classList.add("is-active"),r.focus()}function Cn(){ke&&(typeof ke.close=="function"&&ke.open&&ke.close(),ke.classList.remove("is-active"))}function da(t,{t:e,zoomStep:n=.25}={}){if(!t||!t.querySelectorAll)return;Ze=(f,g)=>(typeof e=="function"?e(f):void 0)||g,xt=n,t.addEventListener("click",f=>{const g=f.target;if(!g||g.tagName!=="IMG")return;const m=g;if(m.src){if(f.defaultPrevented!==!0){const w=m.closest("a");w&&w.getAttribute("href")&&f.preventDefault()}ha(m.src,m.alt||"",m.naturalWidth||0,m.naturalHeight||0)}});let i=!1,r=0,s=0,a=0,o=0;const l=new Map;let u=0,h=1;const c=(f,g)=>{const m=f.x-g.x,w=f.y-g.y;return Math.hypot(m,w)};t.addEventListener("pointerdown",f=>{const g=f.target;if(!g||g.tagName!=="IMG"||!ke||!ke.open)return;if(l.set(f.pointerId,{x:f.clientX,y:f.clientY}),l.size===2){const w=Array.from(l.values());u=c(w[0],w[1]),h=ye;return}const m=g.closest(".nimbi-image-preview__image-wrapper");m&&(ye<=1||(f.preventDefault(),i=!0,r=f.clientX,s=f.clientY,a=m.scrollLeft,o=m.scrollTop,g.setPointerCapture(f.pointerId),g.style.cursor="grabbing"))}),t.addEventListener("pointermove",f=>{if(l.has(f.pointerId)&&l.set(f.pointerId,{x:f.clientX,y:f.clientY}),l.size===2){f.preventDefault();const S=Array.from(l.values()),N=c(S[0],S[1]);if(u>0){const _=N/u;qe(h*_)}return}if(!i)return;f.preventDefault();const m=f.target.closest(".nimbi-image-preview__image-wrapper");if(!m)return;const w=f.clientX-r,y=f.clientY-s;m.scrollLeft=a-w,m.scrollTop=o-y});const p=()=>{i=!1,l.clear(),u=0};t.addEventListener("pointerup",p),t.addEventListener("pointercancel",p)}function pa(t){const{contentWrap:e,navWrap:n,container:i,mountOverlay:r=null,t:s,contentBase:a,homePage:o,initialDocumentTitle:l,runHooks:u}=t||{};if(!e||!(e instanceof HTMLElement))throw new TypeError("contentWrap must be an HTMLElement");let h=null;const c=Hs(s,[{path:o,name:s("home"),isIndex:!0,children:[]}]);async function p(y,S){let N,_,z;try{({data:N,pagePath:_,anchor:z}=await Zi(y,a))}catch(C){console.error("[nimbi-cms] fetchPageData failed",C),zr(e,s,C);return}!z&&S&&(z=S);try{An(null)}catch(C){console.warn("[nimbi-cms] scrollToAnchorOrTop failed",C)}e.innerHTML="";const{article:I,parsed:te,toc:ce,topH1:ne,h1Text:J,slugKey:F}=await Ys(s,N,_,z,a);ca(s,l,te,ce,I,_,z,ne,J,F,N),n.innerHTML="",n.appendChild(ce),Vs(ce);try{await u("transformHtml",{article:I,parsed:te,toc:ce,pagePath:_,anchor:z,topH1:ne,h1Text:J,slugKey:F,data:N})}catch(C){console.warn("[nimbi-cms] transformHtml hooks failed",C)}e.appendChild(I);try{da(I,{t:s})}catch(C){console.warn("[nimbi-cms] attachImagePreview failed",C)}try{Ct(i,100,!1),requestAnimationFrame(()=>Ct(i,100,!1)),setTimeout(()=>Ct(i,100,!1),250)}catch(C){console.warn("[nimbi-cms] setEagerForAboveFoldImages failed",C)}An(z),Js(I,ne,{mountOverlay:r,container:i,navWrap:n,t:s});try{await u("onPageLoad",{data:N,pagePath:_,anchor:z,article:I,toc:ce,topH1:ne,h1Text:J,slugKey:F,contentWrap:e,navWrap:n})}catch(C){console.warn("[nimbi-cms] onPageLoad hooks failed",C)}h=_}async function f(){let y=new URLSearchParams(location.search).get("page")||o;const S=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;try{await p(y,S)}catch(N){console.warn("[nimbi-cms] renderByQuery failed for",y,N),zr(e,s,N)}}window.addEventListener("popstate",f);const g=()=>`nimbi-cms-scroll:${location.pathname}${location.search}`,m=()=>{try{const y=i||document.querySelector(".nimbi-cms");if(!y)return;const S={top:y.scrollTop||0,left:y.scrollLeft||0};sessionStorage.setItem(g(),JSON.stringify(S))}catch{}},w=()=>{try{const y=i||document.querySelector(".nimbi-cms");if(!y)return;const S=sessionStorage.getItem(g());if(!S)return;const N=JSON.parse(S);N&&typeof N.top=="number"&&y.scrollTo({top:N.top,left:N.left||0,behavior:"auto"})}catch{}};return window.addEventListener("pageshow",y=>{if(y.persisted)try{w(),Ct(i,100,!1)}catch(S){console.warn("[nimbi-cms] bfcache restore failed",S)}}),window.addEventListener("pagehide",()=>{try{m()}catch(y){console.warn("[nimbi-cms] save scroll position failed",y)}}),{renderByQuery:f,siteNav:c,getCurrentPagePath:()=>h}}function fa(t){try{const e=typeof t=="string"?t:typeof window<"u"&&window.location?window.location.search:"";if(!e)return{};const n=new URLSearchParams(e.startsWith("?")?e.slice(1):e),i={},r=s=>{if(s==null)return;const a=String(s).toLowerCase();if(a==="1"||a==="true"||a==="yes")return!0;if(a==="0"||a==="false"||a==="no")return!1};if(n.has("contentPath")&&(i.contentPath=n.get("contentPath")),n.has("searchIndex")){const s=r(n.get("searchIndex"));typeof s=="boolean"&&(i.searchIndex=s)}if(n.has("searchIndexMode")){const s=n.get("searchIndexMode");(s==="eager"||s==="lazy")&&(i.searchIndexMode=s)}if(n.has("defaultStyle")){const s=n.get("defaultStyle");(s==="light"||s==="dark")&&(i.defaultStyle=s)}if(n.has("bulmaCustomize")&&(i.bulmaCustomize=n.get("bulmaCustomize")),n.has("lang")&&(i.lang=n.get("lang")),n.has("l10nFile")){const s=n.get("l10nFile");i.l10nFile=s==="null"?null:s}if(n.has("cacheTtlMinutes")){const s=Number(n.get("cacheTtlMinutes"));Number.isFinite(s)&&s>=0&&(i.cacheTtlMinutes=s)}if(n.has("cacheMaxEntries")){const s=Number(n.get("cacheMaxEntries"));Number.isInteger(s)&&s>=0&&(i.cacheMaxEntries=s)}if(n.has("homePage")&&(i.homePage=n.get("homePage")),n.has("notFoundPage")&&(i.notFoundPage=n.get("notFoundPage")),n.has("availableLanguages")&&(i.availableLanguages=n.get("availableLanguages").split(",").map(s=>s.trim()).filter(Boolean)),n.has("indexDepth")){const s=Number(n.get("indexDepth"));Number.isInteger(s)&&(s===1||s===2)&&(i.indexDepth=s)}if(n.has("noIndexing")){const a=(n.get("noIndexing")||"").split(",").map(o=>o.trim()).filter(Boolean);a.length&&(i.noIndexing=a)}return i}catch{return{}}}function ga(t){return!(typeof t!="string"||!t.trim()||t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))}function Dr(t){if(typeof t!="string")return!1;const e=t.trim();return!(!e||e.includes("/")||e.includes("\\")||e.includes("..")||!/^[A-Za-z0-9._-]+\.(md|html)$/.test(e))}let _n="";async function ma(t={}){if(!t||typeof t!="object")throw new TypeError("initCMS(options): options must be an object");const e=fa();if(e&&(e.contentPath||e.homePage||e.notFoundPage))if(t&&t.allowUrlPathOverrides===!0)try{console.warn("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage")}catch(k){console.warn("[nimbi-cms] allowUrlPathOverrides logging failed",k)}else{try{console.warn("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage")}catch(k){console.warn("[nimbi-cms] logging ignore of URL overrides failed",k)}delete e.contentPath,delete e.homePage,delete e.notFoundPage}const n=Object.assign({},e,t),{el:i,contentPath:r="/content",crawlMaxQueue:s=1e3,searchIndex:a=!0,searchIndexMode:o="eager",indexDepth:l=1,noIndexing:u=void 0,defaultStyle:h="light",bulmaCustomize:c="none",lang:p=void 0,l10nFile:f=null,cacheTtlMinutes:g=5,cacheMaxEntries:m,markdownExtensions:w,availableLanguages:y,homePage:S="_home.md",notFoundPage:N="_404.md"}=n;if(n.contentPath!=null&&!ga(n.contentPath))throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');if(n.homePage!=null&&!Dr(n.homePage))throw new TypeError('initCMS(options): "homePage" must be a simple basename ending with .md or .html');if(n.notFoundPage!=null&&!Dr(n.notFoundPage))throw new TypeError('initCMS(options): "notFoundPage" must be a simple basename ending with .md or .html');if(!i)throw new Error("el is required");let _=i;if(typeof i=="string"){if(_=document.querySelector(i),!_)throw new Error(`el selector "${i}" did not match any element`)}else if(!(i instanceof Element))throw new TypeError("el must be a CSS selector string or a DOM element");if(typeof r!="string"||!r.trim())throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');if(typeof a!="boolean")throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');if(o!=null&&o!=="eager"&&o!=="lazy")throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');if(l!=null&&l!==1&&l!==2)throw new TypeError('initCMS(options): "indexDepth" must be 1 or 2 when provided');if(h!=="light"&&h!=="dark")throw new TypeError('initCMS(options): "defaultStyle" must be "light" or "dark"');if(c!=null&&typeof c!="string")throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');if(p!=null&&typeof p!="string")throw new TypeError('initCMS(options): "lang" must be a string when provided');if(f!=null&&typeof f!="string")throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');if(g!=null&&(typeof g!="number"||!Number.isFinite(g)||g<0))throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');if(m!=null&&(typeof m!="number"||!Number.isInteger(m)||m<0))throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');if(w!=null&&(!Array.isArray(w)||w.some(k=>!k||typeof k!="object")))throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');if(y!=null&&(!Array.isArray(y)||y.some(k=>typeof k!="string"||!k.trim())))throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');if(u!=null&&(!Array.isArray(u)||u.some(k=>typeof k!="string"||!k.trim())))throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');if(S!=null&&(typeof S!="string"||!S.trim()||!/\.(md|html)$/.test(S)))throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');if(N!=null&&(typeof N!="string"||!N.trim()||!/\.(md|html)$/.test(N)))throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');const z=!!a;try{_.classList.add("nimbi-mount"),_.style.position=_.style.position||"relative",_.style.overflow=_.style.overflow||"hidden"}catch(k){console.warn("[nimbi-cms] mount element setup failed",k)}const I=document.createElement("div");I.className="nimbi-cms";try{I.style.position=I.style.position||"relative",I.style.overflow=I.style.overflow||"auto";try{I.style.webkitOverflowScrolling||(I.style.webkitOverflowScrolling="touch")}catch(k){console.warn("[nimbi-cms] set container webkitOverflowScrolling failed",k)}I.style.width=I.style.width||"100%",I.style.height=I.style.height||"100%",I.style.boxSizing=I.style.boxSizing||"border-box"}catch(k){console.warn("[nimbi-cms] container style setup failed",k)}const te=document.createElement("div");te.className="columns";const ce=document.createElement("div");ce.className="column is-full-mobile is-3-tablet nimbi-nav-wrap",ce.setAttribute("role","navigation");try{const k=typeof it=="function"?it("navigation"):null;k&&ce.setAttribute("aria-label",k)}catch(k){console.warn("[nimbi-cms] set nav aria-label failed",k)}te.appendChild(ce);const ne=document.createElement("div");ne.className="column nimbi-content",ne.setAttribute("role","main"),te.appendChild(ne),I.appendChild(te);const J=ce,F=ne;_.appendChild(I);let C=null;try{C=_.querySelector(".nimbi-overlay"),C||(C=document.createElement("div"),C.className="nimbi-overlay",_.appendChild(C))}catch(k){C=null,console.warn("[nimbi-cms] mount overlay setup failed",k)}const Q=location.pathname||"/",M=Q.endsWith("/")?Q:Q.substring(0,Q.lastIndexOf("/")+1);try{_n=document.title||""}catch(k){_n="",console.warn("[nimbi-cms] read initial document title failed",k)}let v=r;v.startsWith("./")&&(v=v.slice(2)),v.startsWith("/")&&(v=v.slice(1)),v.endsWith("/")||(v=v+"/");const b=new URL(M+v,location.origin).toString();f&&await sn(f,M),y&&Array.isArray(y)&&Kn(y),p&&an(p);const R=pa({contentWrap:F,navWrap:J,container:I,mountOverlay:C,t:it,contentBase:b,homePage:S,initialDocumentTitle:_n,runHooks:Vt});if(typeof g=="number"&&g>=0&&typeof lr=="function"&&lr(g*60*1e3),typeof m=="number"&&m>=0&&typeof ar=="function"&&ar(m),w&&Array.isArray(w)&&w.length)try{w.forEach(k=>{typeof k=="object"&&qs&&typeof vn=="function"&&vn(k)})}catch(k){console.warn("[nimbi-cms] applying markdownExtensions failed",k)}try{typeof s=="number"&&Promise.resolve().then(()=>zt).then(({setDefaultCrawlMaxQueue:k})=>{try{k(s)}catch(B){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed",B)}})}catch(k){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed",k)}try{$t(b)}catch(k){console.warn("[nimbi-cms] setContentBase failed",k)}try{un(N)}catch(k){console.warn("[nimbi-cms] setNotFoundPage failed",k)}try{$t(b)}catch(k){console.warn("[nimbi-cms] setContentBase failed",k)}try{un(N)}catch(k){console.warn("[nimbi-cms] setNotFoundPage failed",k)}try{await be(S,b)}catch(k){throw S==="_home.md"?new Error("Required _home.md not found"):new Error(`Required ${S} not found at ${b}${S}: ${k.message}`)}Fn(h),await jn(c,M);try{const k=document.createElement("header");k.className="nimbi-site-navbar",_.insertBefore(k,I);const B=await be("_navigation.md",b),Y=await jt(B.raw||""),{navbar:le,linkEls:Te}=await ea(k,I,Y.html||"",b,S,it,R.renderByQuery,z,o,l,u);try{await Vt("onNavBuild",{navWrap:J,navbar:le,linkEls:Te,contentBase:b})}catch(Ee){console.warn("[nimbi-cms] onNavBuild hooks failed",Ee)}try{const Ee=()=>{const xe=k&&k.getBoundingClientRect&&Math.round(k.getBoundingClientRect().height)||k&&k.offsetHeight||0;if(xe>0){try{_.style.setProperty("--nimbi-site-navbar-height",`${xe}px`)}catch(me){console.warn("[nimbi-cms] set CSS var failed",me)}try{I.style.paddingTop=""}catch(me){console.warn("[nimbi-cms] set container paddingTop failed",me)}try{const me=_&&_.getBoundingClientRect&&Math.round(_.getBoundingClientRect().height)||_&&_.clientHeight||0;if(me>0){const Ce=Math.max(0,me-xe);try{I.style.boxSizing="border-box"}catch(He){console.warn("[nimbi-cms] set container boxSizing failed",He)}try{I.style.height=`${Ce}px`}catch(He){console.warn("[nimbi-cms] set container height failed",He)}try{I.style.setProperty("--nimbi-cms-height",`${Ce}px`)}catch(He){console.warn("[nimbi-cms] set --nimbi-cms-height failed",He)}}else{try{I.style.height="calc(100% - var(--nimbi-site-navbar-height))"}catch(Ce){console.warn("[nimbi-cms] set container height failed",Ce)}try{I.style.setProperty("--nimbi-cms-height","calc(100% - var(--nimbi-site-navbar-height))")}catch(Ce){console.warn("[nimbi-cms] set --nimbi-cms-height failed",Ce)}}}catch(me){console.warn("[nimbi-cms] compute container height failed",me)}try{k.style.setProperty("--nimbi-site-navbar-height",`${xe}px`)}catch(me){console.warn("[nimbi-cms] set navbar CSS var failed",me)}}};Ee();try{if(typeof ResizeObserver<"u"){const xe=new ResizeObserver(()=>Ee());try{xe.observe(k)}catch(me){console.warn("[nimbi-cms] ResizeObserver.observe failed",me)}}}catch(xe){console.warn("[nimbi-cms] ResizeObserver setup failed",xe)}}catch(Ee){console.warn("[nimbi-cms] compute navbar height failed",Ee)}}catch(k){console.warn("[nimbi-cms] build navigation failed",k)}await R.renderByQuery();try{Promise.resolve().then(()=>wa).then(({getVersion:k})=>{typeof k=="function"&&k().then(B=>{try{const Y=B||"0.0.0",le=document.createElement("div");le.className="nimbi-version-label",le.textContent=`Ninbi CMS v. ${Y}`,le.style.position="absolute",le.style.left="8px",le.style.bottom="6px",le.style.fontSize="11px",le.style.opacity="0.6",le.style.pointerEvents="none",le.style.zIndex="9999",le.style.userSelect="none";try{_.appendChild(le)}catch(Te){console.warn("[nimbi-cms] append version label failed",Te)}}catch(Y){console.warn("[nimbi-cms] building version label failed",Y)}}).catch(B=>{console.warn("[nimbi-cms] getVersion() failed",B)})}).catch(k=>{console.warn("[nimbi-cms] import version module failed",k)})}catch(k){console.warn("[nimbi-cms] version label setup failed",k)}}async function qr(){try{let t=null;try{t=await Promise.resolve().then(()=>Vr)}catch{try{t=await Promise.resolve().then(()=>Vr)}catch{t=null}}const e=t?.default?.version||t?.version;return typeof e=="string"&&e.trim()?e:"0.0.0"}catch{return"0.0.0"}}const wa=Object.freeze(Object.defineProperty({__proto__:null,getVersion:qr},Symbol.toStringTag,{value:"Module"})),Hr="nimbi-cms",Ur="0.1.0",jr="module",Fr={dev:"vite","dev:example":'sh -c "npm run build -- --outDir example/dist --config vite.config.js && vite example --port 5173 &"',build:"vite build --config vite.config.js","build:lib":"vite build --config vite.config.js","build:analyze":"ANALYZE=1 vite build --config vite.config.js",preview:"vite preview",test:"npx vitest run","gen-dts":"node scripts/gen-dts.js","check-dts":"npx tsc --noEmit src/index.d.ts --lib es2015,dom --skipLibCheck","type-test":"npx tsd",docs:"typedoc --options typedoc.json"},Wr={bulma:"^1.0.4","highlight.js":"^11.11.1",marked:"^17.0.4"},Zr={"@vitest/coverage-v8":"^4.0.18","comment-parser":"^0.7.6",eslint:"^10.0.3","eslint-plugin-unused-imports":"^4.4.1",glob:"^10.4.1",jsdom:"^28.1.0","reading-time":"^1.5.0",terser:"^5.17.0",typedoc:"^0.28.17",typescript:"^5.9.3",tsd:"^0.33.0",vite:"^7.3.1","rollup-plugin-visualizer":"^5.8.0","vite-plugin-restart":"^2.0.0",vitest:"^4.0.18"},Qr="dist/nimbi-cms.cjs.js",Gr="dist/nimbi-cms.es.js",Xr="src/index.d.ts",Yr="dist/nimbi-cms.js",Kr=["dist","src/index.d.ts"],Vr=Object.freeze(Object.defineProperty({__proto__:null,default:{name:Hr,version:Ur,private:!0,type:jr,scripts:Fr,dependencies:Wr,devDependencies:Zr,main:Qr,module:Gr,types:Xr,unpkg:Yr,files:Kr},dependencies:Wr,devDependencies:Zr,files:Kr,main:Qr,module:Gr,name:Hr,scripts:Fr,type:jr,types:Xr,unpkg:Yr,version:Ur},Symbol.toStringTag,{value:"Module"}));ae.BAD_LANGUAGES=en,ae.SUPPORTED_HLJS_MAP=V,ae._clearHooks=bi,ae.addHook=Et,ae.default=ma,ae.ensureBulma=jn,ae.getVersion=qr,ae.loadL10nFile=sn,ae.loadSupportedLanguages=tn,ae.observeCodeBlocks=Un,ae.onNavBuild=mi,ae.onPageLoad=gi,ae.registerLanguage=nt,ae.runHooks=Vt,ae.setHighlightTheme=vi,ae.setLang=an,ae.setStyle=Fn,ae.setThemeVars=Ri,ae.t=it,ae.transformHtml=wi,Object.defineProperties(ae,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})}));
