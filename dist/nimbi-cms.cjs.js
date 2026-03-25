"use strict";var Is=Object.create;var qi=Object.defineProperty;var Ns=Object.getOwnPropertyDescriptor;var Os=Object.getOwnPropertyNames;var Bs=Object.getPrototypeOf,js=Object.prototype.hasOwnProperty;var qs=(e,t,n,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of Os(t))!js.call(e,r)&&r!==n&&qi(e,r,{get:()=>t[r],enumerable:!(i=Ns(t,r))||i.enumerable});return e};var Hs=(e,t,n)=>(n=e!=null?Is(Bs(e)):{},qs(t||!e||!e.__esModule?qi(n,"default",{value:e,enumerable:!0}):n,e));Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});let Br=0;const Hi=Object.create(null);function Fi(e){try{const t=Number(e);Br=Number.isFinite(t)&&t>=0?Math.max(0,Math.min(3,Math.floor(t))):0}catch{Br=0}}function tn(e=1){try{return Number(Br)>=Number(e||1)}catch{return!1}}function ii(){return tn(1)}function sr(...e){try{if(!tn(1)||!console||typeof console.error!="function")return;const t=e.map(n=>typeof n=="function"?n():n);console.error(...t)}catch{}}function k(...e){try{if(!tn(2)||!console||typeof console.warn!="function")return;const t=e.map(n=>typeof n=="function"?n():n);console.warn(...t)}catch{}}function $t(...e){try{if(!tn(3)||!console||typeof console.info!="function")return;const t=e.map(n=>typeof n=="function"?n():n);console.info(...t)}catch{}}function jt(...e){try{if(!tn(3)||!console||typeof console.log!="function")return;const t=e.map(n=>typeof n=="function"?n():n);console.log(...t)}catch{}}function ga(e){try{if(!ii())return;const t=String(e||"");if(!t)return;Hi[t]=(Hi[t]||0)+1}catch{}}function pa(e){try{if(typeof globalThis>"u"||!globalThis.__nimbiCMSDebug)return;const t=String(e||"");if(!t)return;try{globalThis.__nimbiCMSDebug[t]=(globalThis.__nimbiCMSDebug[t]||0)+1}catch{}}catch{}}const zn={onPageLoad:[],onNavBuild:[],transformHtml:[]};function gr(e,t){if(!Object.prototype.hasOwnProperty.call(zn,e))throw new Error('Unknown hook "'+e+'"');if(typeof t!="function")throw new TypeError("hook callback must be a function");zn[e].push(t)}function Fs(e){gr("onPageLoad",e)}function Ds(e){gr("onNavBuild",e)}function Us(e){gr("transformHtml",e)}async function jr(e,t){const n=zn[e]||[];for(const i of n)try{await i(t)}catch(r){try{k("[nimbi-cms] runHooks callback failed",r)}catch{}}}function Ws(){Object.keys(zn).forEach(e=>{zn[e].length=0})}function ma(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Tr,Di;function Zs(){if(Di)return Tr;Di=1;function e(x){return x instanceof Map?x.clear=x.delete=x.set=function(){throw new Error("map is read-only")}:x instanceof Set&&(x.add=x.clear=x.delete=function(){throw new Error("set is read-only")}),Object.freeze(x),Object.getOwnPropertyNames(x).forEach(F=>{const te=x[F],ke=typeof te;(ke==="object"||ke==="function")&&!Object.isFrozen(te)&&e(te)}),x}class t{constructor(F){F.data===void 0&&(F.data={}),this.data=F.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function n(x){return x.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function i(x,...F){const te=Object.create(null);for(const ke in x)te[ke]=x[ke];return F.forEach(function(ke){for(const Ue in ke)te[Ue]=ke[Ue]}),te}const r="</span>",a=x=>!!x.scope,s=(x,{prefix:F})=>{if(x.startsWith("language:"))return x.replace("language:","language-");if(x.includes(".")){const te=x.split(".");return[`${F}${te.shift()}`,...te.map((ke,Ue)=>`${ke}${"_".repeat(Ue+1)}`)].join(" ")}return`${F}${x}`};class o{constructor(F,te){this.buffer="",this.classPrefix=te.classPrefix,F.walk(this)}addText(F){this.buffer+=n(F)}openNode(F){if(!a(F))return;const te=s(F.scope,{prefix:this.classPrefix});this.span(te)}closeNode(F){a(F)&&(this.buffer+=r)}value(){return this.buffer}span(F){this.buffer+=`<span class="${F}">`}}const l=(x={})=>{const F={children:[]};return Object.assign(F,x),F};class c{constructor(){this.rootNode=l(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(F){this.top.children.push(F)}openNode(F){const te=l({scope:F});this.add(te),this.stack.push(te)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(F){return this.constructor._walk(F,this.rootNode)}static _walk(F,te){return typeof te=="string"?F.addText(te):te.children&&(F.openNode(te),te.children.forEach(ke=>this._walk(F,ke)),F.closeNode(te)),F}static _collapse(F){typeof F!="string"&&F.children&&(F.children.every(te=>typeof te=="string")?F.children=[F.children.join("")]:F.children.forEach(te=>{c._collapse(te)}))}}class u extends c{constructor(F){super(),this.options=F}addText(F){F!==""&&this.add(F)}startScope(F){this.openNode(F)}endScope(){this.closeNode()}__addSublanguage(F,te){const ke=F.root;te&&(ke.scope=`language:${te}`),this.add(ke)}toHTML(){return new o(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function g(x){return x?typeof x=="string"?x:x.source:null}function h(x){return m("(?=",x,")")}function d(x){return m("(?:",x,")*")}function p(x){return m("(?:",x,")?")}function m(...x){return x.map(te=>g(te)).join("")}function f(x){const F=x[x.length-1];return typeof F=="object"&&F.constructor===Object?(x.splice(x.length-1,1),F):{}}function w(...x){return"("+(f(x).capture?"":"?:")+x.map(ke=>g(ke)).join("|")+")"}function y(x){return new RegExp(x.toString()+"|").exec("").length-1}function _(x,F){const te=x&&x.exec(F);return te&&te.index===0}const b=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function A(x,{joinWith:F}){let te=0;return x.map(ke=>{te+=1;const Ue=te;let We=g(ke),oe="";for(;We.length>0;){const ae=b.exec(We);if(!ae){oe+=We;break}oe+=We.substring(0,ae.index),We=We.substring(ae.index+ae[0].length),ae[0][0]==="\\"&&ae[1]?oe+="\\"+String(Number(ae[1])+Ue):(oe+=ae[0],ae[0]==="("&&te++)}return oe}).map(ke=>`(${ke})`).join(F)}const S=/\b\B/,E="[a-zA-Z]\\w*",I="[a-zA-Z_]\\w*",O="\\b\\d+(\\.\\d+)?",W="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",z="\\b(0b[01]+)",B="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",Z=(x={})=>{const F=/^#![ ]*\//;return x.binary&&(x.begin=m(F,/.*\b/,x.binary,/\b.*/)),i({scope:"meta",begin:F,end:/$/,relevance:0,"on:begin":(te,ke)=>{te.index!==0&&ke.ignoreMatch()}},x)},ee={begin:"\\\\[\\s\\S]",relevance:0},j={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[ee]},C={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[ee]},N={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},D=function(x,F,te={}){const ke=i({scope:"comment",begin:x,end:F,contains:[]},te);ke.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const Ue=w("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return ke.contains.push({begin:m(/[ ]+/,"(",Ue,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),ke},ie=D("//","$"),he=D("/\\*","\\*/"),K=D("#","$"),Le={scope:"number",begin:O,relevance:0},me={scope:"number",begin:W,relevance:0},Se={scope:"number",begin:z,relevance:0},Ee={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[ee,{begin:/\[/,end:/\]/,relevance:0,contains:[ee]}]},Fe={scope:"title",begin:E,relevance:0},R={scope:"title",begin:I,relevance:0},P={begin:"\\.\\s*"+I,relevance:0};var v=Object.freeze({__proto__:null,APOS_STRING_MODE:j,BACKSLASH_ESCAPE:ee,BINARY_NUMBER_MODE:Se,BINARY_NUMBER_RE:z,COMMENT:D,C_BLOCK_COMMENT_MODE:he,C_LINE_COMMENT_MODE:ie,C_NUMBER_MODE:me,C_NUMBER_RE:W,END_SAME_AS_BEGIN:function(x){return Object.assign(x,{"on:begin":(F,te)=>{te.data._beginMatch=F[1]},"on:end":(F,te)=>{te.data._beginMatch!==F[1]&&te.ignoreMatch()}})},HASH_COMMENT_MODE:K,IDENT_RE:E,MATCH_NOTHING_RE:S,METHOD_GUARD:P,NUMBER_MODE:Le,NUMBER_RE:O,PHRASAL_WORDS_MODE:N,QUOTE_STRING_MODE:C,REGEXP_MODE:Ee,RE_STARTERS_RE:B,SHEBANG:Z,TITLE_MODE:Fe,UNDERSCORE_IDENT_RE:I,UNDERSCORE_TITLE_MODE:R});function L(x,F){x.input[x.index-1]==="."&&F.ignoreMatch()}function U(x,F){x.className!==void 0&&(x.scope=x.className,delete x.className)}function V(x,F){F&&x.beginKeywords&&(x.begin="\\b("+x.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",x.__beforeBegin=L,x.keywords=x.keywords||x.beginKeywords,delete x.beginKeywords,x.relevance===void 0&&(x.relevance=0))}function H(x,F){Array.isArray(x.illegal)&&(x.illegal=w(...x.illegal))}function $(x,F){if(x.match){if(x.begin||x.end)throw new Error("begin & end are not supported with match");x.begin=x.match,delete x.match}}function T(x,F){x.relevance===void 0&&(x.relevance=1)}const q=(x,F)=>{if(!x.beforeMatch)return;if(x.starts)throw new Error("beforeMatch cannot be used with starts");const te=Object.assign({},x);Object.keys(x).forEach(ke=>{delete x[ke]}),x.keywords=te.keywords,x.begin=m(te.beforeMatch,h(te.begin)),x.starts={relevance:0,contains:[Object.assign(te,{endsParent:!0})]},x.relevance=0,delete te.beforeMatch},Q=["of","and","for","in","not","or","if","then","parent","list","value"],se="keyword";function ye(x,F,te=se){const ke=Object.create(null);return typeof x=="string"?Ue(te,x.split(" ")):Array.isArray(x)?Ue(te,x):Object.keys(x).forEach(function(We){Object.assign(ke,ye(x[We],F,We))}),ke;function Ue(We,oe){F&&(oe=oe.map(ae=>ae.toLowerCase())),oe.forEach(function(ae){const be=ae.split("|");ke[be[0]]=[We,we(be[0],be[1])]})}}function we(x,F){return F?Number(F):pe(x)?0:1}function pe(x){return Q.includes(x.toLowerCase())}const _e={},ve=x=>{console.error(x)},Ie=(x,...F)=>{console.log(`WARN: ${x}`,...F)},Ge=(x,F)=>{_e[`${x}/${F}`]||(console.log(`Deprecated as of ${x}. ${F}`),_e[`${x}/${F}`]=!0)},Et=new Error;function fn(x,F,{key:te}){let ke=0;const Ue=x[te],We={},oe={};for(let ae=1;ae<=F.length;ae++)oe[ae+ke]=Ue[ae],We[ae+ke]=!0,ke+=y(F[ae-1]);x[te]=oe,x[te]._emit=We,x[te]._multi=!0}function Ct(x){if(Array.isArray(x.begin)){if(x.skip||x.excludeBegin||x.returnBegin)throw ve("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),Et;if(typeof x.beginScope!="object"||x.beginScope===null)throw ve("beginScope must be object"),Et;fn(x,x.begin,{key:"beginScope"}),x.begin=A(x.begin,{joinWith:""})}}function cs(x){if(Array.isArray(x.end)){if(x.skip||x.excludeEnd||x.returnEnd)throw ve("skip, excludeEnd, returnEnd not compatible with endScope: {}"),Et;if(typeof x.endScope!="object"||x.endScope===null)throw ve("endScope must be object"),Et;fn(x,x.end,{key:"endScope"}),x.end=A(x.end,{joinWith:""})}}function us(x){x.scope&&typeof x.scope=="object"&&x.scope!==null&&(x.beginScope=x.scope,delete x.scope)}function hs(x){us(x),typeof x.beginScope=="string"&&(x.beginScope={_wrap:x.beginScope}),typeof x.endScope=="string"&&(x.endScope={_wrap:x.endScope}),Ct(x),cs(x)}function ds(x){function F(oe,ae){return new RegExp(g(oe),"m"+(x.case_insensitive?"i":"")+(x.unicodeRegex?"u":"")+(ae?"g":""))}class te{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(ae,be){be.position=this.position++,this.matchIndexes[this.matchAt]=be,this.regexes.push([be,ae]),this.matchAt+=y(ae)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const ae=this.regexes.map(be=>be[1]);this.matcherRe=F(A(ae,{joinWith:"|"}),!0),this.lastIndex=0}exec(ae){this.matcherRe.lastIndex=this.lastIndex;const be=this.matcherRe.exec(ae);if(!be)return null;const Ve=be.findIndex((gn,vr)=>vr>0&&gn!==void 0),Ze=this.matchIndexes[Ve];return be.splice(0,Ve),Object.assign(be,Ze)}}class ke{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(ae){if(this.multiRegexes[ae])return this.multiRegexes[ae];const be=new te;return this.rules.slice(ae).forEach(([Ve,Ze])=>be.addRule(Ve,Ze)),be.compile(),this.multiRegexes[ae]=be,be}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(ae,be){this.rules.push([ae,be]),be.type==="begin"&&this.count++}exec(ae){const be=this.getMatcher(this.regexIndex);be.lastIndex=this.lastIndex;let Ve=be.exec(ae);if(this.resumingScanAtSamePosition()&&!(Ve&&Ve.index===this.lastIndex)){const Ze=this.getMatcher(0);Ze.lastIndex=this.lastIndex+1,Ve=Ze.exec(ae)}return Ve&&(this.regexIndex+=Ve.position+1,this.regexIndex===this.count&&this.considerAll()),Ve}}function Ue(oe){const ae=new ke;return oe.contains.forEach(be=>ae.addRule(be.begin,{rule:be,type:"begin"})),oe.terminatorEnd&&ae.addRule(oe.terminatorEnd,{type:"end"}),oe.illegal&&ae.addRule(oe.illegal,{type:"illegal"}),ae}function We(oe,ae){const be=oe;if(oe.isCompiled)return be;[U,$,hs,q].forEach(Ze=>Ze(oe,ae)),x.compilerExtensions.forEach(Ze=>Ze(oe,ae)),oe.__beforeBegin=null,[V,H,T].forEach(Ze=>Ze(oe,ae)),oe.isCompiled=!0;let Ve=null;return typeof oe.keywords=="object"&&oe.keywords.$pattern&&(oe.keywords=Object.assign({},oe.keywords),Ve=oe.keywords.$pattern,delete oe.keywords.$pattern),Ve=Ve||/\w+/,oe.keywords&&(oe.keywords=ye(oe.keywords,x.case_insensitive)),be.keywordPatternRe=F(Ve,!0),ae&&(oe.begin||(oe.begin=/\B|\b/),be.beginRe=F(be.begin),!oe.end&&!oe.endsWithParent&&(oe.end=/\B|\b/),oe.end&&(be.endRe=F(be.end)),be.terminatorEnd=g(be.end)||"",oe.endsWithParent&&ae.terminatorEnd&&(be.terminatorEnd+=(oe.end?"|":"")+ae.terminatorEnd)),oe.illegal&&(be.illegalRe=F(oe.illegal)),oe.contains||(oe.contains=[]),oe.contains=[].concat(...oe.contains.map(function(Ze){return fs(Ze==="self"?oe:Ze)})),oe.contains.forEach(function(Ze){We(Ze,be)}),oe.starts&&We(oe.starts,ae),be.matcher=Ue(be),be}if(x.compilerExtensions||(x.compilerExtensions=[]),x.contains&&x.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return x.classNameAliases=i(x.classNameAliases||{}),We(x)}function Mi(x){return x?x.endsWithParent||Mi(x.starts):!1}function fs(x){return x.variants&&!x.cachedVariants&&(x.cachedVariants=x.variants.map(function(F){return i(x,{variants:null},F)})),x.cachedVariants?x.cachedVariants:Mi(x)?i(x,{starts:x.starts?i(x.starts):null}):Object.isFrozen(x)?i(x):x}var gs="11.11.1";class ps extends Error{constructor(F,te){super(F),this.name="HTMLInjectionError",this.html=te}}const Sr=n,Li=i,Ti=Symbol("nomatch"),ms=7,zi=function(x){const F=Object.create(null),te=Object.create(null),ke=[];let Ue=!0;const We="Could not find the language '{}', did you forget to load/include a language module?",oe={disableAutodetect:!0,name:"Plain text",contains:[]};let ae={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:u};function be(X){return ae.noHighlightRe.test(X)}function Ve(X){let ue=X.className+" ";ue+=X.parentNode?X.parentNode.className:"";const Te=ae.languageDetectRe.exec(ue);if(Te){const je=Tt(Te[1]);return je||(Ie(We.replace("{}",Te[1])),Ie("Falling back to no-highlight mode for this block.",X)),je?Te[1]:"no-highlight"}return ue.split(/\s+/).find(je=>be(je)||Tt(je))}function Ze(X,ue,Te){let je="",Qe="";typeof ue=="object"?(je=X,Te=ue.ignoreIllegals,Qe=ue.language):(Ge("10.7.0","highlight(lang, code, ...args) has been deprecated."),Ge("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),Qe=X,je=ue),Te===void 0&&(Te=!0);const bt={code:je,language:Qe};Fn("before:highlight",bt);const zt=bt.result?bt.result:gn(bt.language,bt.code,Te);return zt.code=bt.code,Fn("after:highlight",zt),zt}function gn(X,ue,Te,je){const Qe=Object.create(null);function bt(ne,ce){return ne.keywords[ce]}function zt(){if(!xe.keywords){Ye.addText(qe);return}let ne=0;xe.keywordPatternRe.lastIndex=0;let ce=xe.keywordPatternRe.exec(qe),Ae="";for(;ce;){Ae+=qe.substring(ne,ce.index);const Ne=kt.case_insensitive?ce[0].toLowerCase():ce[0],et=bt(xe,Ne);if(et){const[Mt,$s]=et;if(Ye.addText(Ae),Ae="",Qe[Ne]=(Qe[Ne]||0)+1,Qe[Ne]<=ms&&(Wn+=$s),Mt.startsWith("_"))Ae+=ce[0];else{const Ps=kt.classNameAliases[Mt]||Mt;_t(ce[0],Ps)}}else Ae+=ce[0];ne=xe.keywordPatternRe.lastIndex,ce=xe.keywordPatternRe.exec(qe)}Ae+=qe.substring(ne),Ye.addText(Ae)}function Dn(){if(qe==="")return;let ne=null;if(typeof xe.subLanguage=="string"){if(!F[xe.subLanguage]){Ye.addText(qe);return}ne=gn(xe.subLanguage,qe,!0,ji[xe.subLanguage]),ji[xe.subLanguage]=ne._top}else ne=Ar(qe,xe.subLanguage.length?xe.subLanguage:null);xe.relevance>0&&(Wn+=ne.relevance),Ye.__addSublanguage(ne._emitter,ne.language)}function ct(){xe.subLanguage!=null?Dn():zt(),qe=""}function _t(ne,ce){ne!==""&&(Ye.startScope(ce),Ye.addText(ne),Ye.endScope())}function Ii(ne,ce){let Ae=1;const Ne=ce.length-1;for(;Ae<=Ne;){if(!ne._emit[Ae]){Ae++;continue}const et=kt.classNameAliases[ne[Ae]]||ne[Ae],Mt=ce[Ae];et?_t(Mt,et):(qe=Mt,zt(),qe=""),Ae++}}function Ni(ne,ce){return ne.scope&&typeof ne.scope=="string"&&Ye.openNode(kt.classNameAliases[ne.scope]||ne.scope),ne.beginScope&&(ne.beginScope._wrap?(_t(qe,kt.classNameAliases[ne.beginScope._wrap]||ne.beginScope._wrap),qe=""):ne.beginScope._multi&&(Ii(ne.beginScope,ce),qe="")),xe=Object.create(ne,{parent:{value:xe}}),xe}function Oi(ne,ce,Ae){let Ne=_(ne.endRe,Ae);if(Ne){if(ne["on:end"]){const et=new t(ne);ne["on:end"](ce,et),et.isMatchIgnored&&(Ne=!1)}if(Ne){for(;ne.endsParent&&ne.parent;)ne=ne.parent;return ne}}if(ne.endsWithParent)return Oi(ne.parent,ce,Ae)}function Ms(ne){return xe.matcher.regexIndex===0?(qe+=ne[0],1):(Lr=!0,0)}function Ls(ne){const ce=ne[0],Ae=ne.rule,Ne=new t(Ae),et=[Ae.__beforeBegin,Ae["on:begin"]];for(const Mt of et)if(Mt&&(Mt(ne,Ne),Ne.isMatchIgnored))return Ms(ce);return Ae.skip?qe+=ce:(Ae.excludeBegin&&(qe+=ce),ct(),!Ae.returnBegin&&!Ae.excludeBegin&&(qe=ce)),Ni(Ae,ne),Ae.returnBegin?0:ce.length}function Ts(ne){const ce=ne[0],Ae=ue.substring(ne.index),Ne=Oi(xe,ne,Ae);if(!Ne)return Ti;const et=xe;xe.endScope&&xe.endScope._wrap?(ct(),_t(ce,xe.endScope._wrap)):xe.endScope&&xe.endScope._multi?(ct(),Ii(xe.endScope,ne)):et.skip?qe+=ce:(et.returnEnd||et.excludeEnd||(qe+=ce),ct(),et.excludeEnd&&(qe=ce));do xe.scope&&Ye.closeNode(),!xe.skip&&!xe.subLanguage&&(Wn+=xe.relevance),xe=xe.parent;while(xe!==Ne.parent);return Ne.starts&&Ni(Ne.starts,ne),et.returnEnd?0:ce.length}function zs(){const ne=[];for(let ce=xe;ce!==kt;ce=ce.parent)ce.scope&&ne.unshift(ce.scope);ne.forEach(ce=>Ye.openNode(ce))}let Un={};function Bi(ne,ce){const Ae=ce&&ce[0];if(qe+=ne,Ae==null)return ct(),0;if(Un.type==="begin"&&ce.type==="end"&&Un.index===ce.index&&Ae===""){if(qe+=ue.slice(ce.index,ce.index+1),!Ue){const Ne=new Error(`0 width match regex (${X})`);throw Ne.languageName=X,Ne.badRule=Un.rule,Ne}return 1}if(Un=ce,ce.type==="begin")return Ls(ce);if(ce.type==="illegal"&&!Te){const Ne=new Error('Illegal lexeme "'+Ae+'" for mode "'+(xe.scope||"<unnamed>")+'"');throw Ne.mode=xe,Ne}else if(ce.type==="end"){const Ne=Ts(ce);if(Ne!==Ti)return Ne}if(ce.type==="illegal"&&Ae==="")return qe+=`
`,1;if(Mr>1e5&&Mr>ce.index*3)throw new Error("potential infinite loop, way more iterations than matches");return qe+=Ae,Ae.length}const kt=Tt(X);if(!kt)throw ve(We.replace("{}",X)),new Error('Unknown language: "'+X+'"');const Rs=ds(kt);let Cr="",xe=je||Rs;const ji={},Ye=new ae.__emitter(ae);zs();let qe="",Wn=0,Dt=0,Mr=0,Lr=!1;try{if(kt.__emitTokens)kt.__emitTokens(ue,Ye);else{for(xe.matcher.considerAll();;){Mr++,Lr?Lr=!1:xe.matcher.considerAll(),xe.matcher.lastIndex=Dt;const ne=xe.matcher.exec(ue);if(!ne)break;const ce=ue.substring(Dt,ne.index),Ae=Bi(ce,ne);Dt=ne.index+Ae}Bi(ue.substring(Dt))}return Ye.finalize(),Cr=Ye.toHTML(),{language:X,value:Cr,relevance:Wn,illegal:!1,_emitter:Ye,_top:xe}}catch(ne){if(ne.message&&ne.message.includes("Illegal"))return{language:X,value:Sr(ue),illegal:!0,relevance:0,_illegalBy:{message:ne.message,index:Dt,context:ue.slice(Dt-100,Dt+100),mode:ne.mode,resultSoFar:Cr},_emitter:Ye};if(Ue)return{language:X,value:Sr(ue),illegal:!1,relevance:0,errorRaised:ne,_emitter:Ye,_top:xe};throw ne}}function vr(X){const ue={value:Sr(X),illegal:!1,relevance:0,_top:oe,_emitter:new ae.__emitter(ae)};return ue._emitter.addText(X),ue}function Ar(X,ue){ue=ue||ae.languages||Object.keys(F);const Te=vr(X),je=ue.filter(Tt).filter(Pi).map(ct=>gn(ct,X,!1));je.unshift(Te);const Qe=je.sort((ct,_t)=>{if(ct.relevance!==_t.relevance)return _t.relevance-ct.relevance;if(ct.language&&_t.language){if(Tt(ct.language).supersetOf===_t.language)return 1;if(Tt(_t.language).supersetOf===ct.language)return-1}return 0}),[bt,zt]=Qe,Dn=bt;return Dn.secondBest=zt,Dn}function ys(X,ue,Te){const je=ue&&te[ue]||Te;X.classList.add("hljs"),X.classList.add(`language-${je}`)}function Er(X){let ue=null;const Te=Ve(X);if(be(Te))return;if(Fn("before:highlightElement",{el:X,language:Te}),X.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",X);return}if(X.children.length>0&&(ae.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(X)),ae.throwUnescapedHTML))throw new ps("One of your code blocks includes unescaped HTML.",X.innerHTML);ue=X;const je=ue.textContent,Qe=Te?Ze(je,{language:Te,ignoreIllegals:!0}):Ar(je);X.innerHTML=Qe.value,X.dataset.highlighted="yes",ys(X,Te,Qe.language),X.result={language:Qe.language,re:Qe.relevance,relevance:Qe.relevance},Qe.secondBest&&(X.secondBest={language:Qe.secondBest.language,relevance:Qe.secondBest.relevance}),Fn("after:highlightElement",{el:X,result:Qe,text:je})}function bs(X){ae=Li(ae,X)}const ws=()=>{Hn(),Ge("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function _s(){Hn(),Ge("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let Ri=!1;function Hn(){function X(){Hn()}if(document.readyState==="loading"){Ri||window.addEventListener("DOMContentLoaded",X,!1),Ri=!0;return}document.querySelectorAll(ae.cssSelector).forEach(Er)}function ks(X,ue){let Te=null;try{Te=ue(x)}catch(je){if(ve("Language definition for '{}' could not be registered.".replace("{}",X)),Ue)ve(je);else throw je;Te=oe}Te.name||(Te.name=X),F[X]=Te,Te.rawDefinition=ue.bind(null,x),Te.aliases&&$i(Te.aliases,{languageName:X})}function xs(X){delete F[X];for(const ue of Object.keys(te))te[ue]===X&&delete te[ue]}function Ss(){return Object.keys(F)}function Tt(X){return X=(X||"").toLowerCase(),F[X]||F[te[X]]}function $i(X,{languageName:ue}){typeof X=="string"&&(X=[X]),X.forEach(Te=>{te[Te.toLowerCase()]=ue})}function Pi(X){const ue=Tt(X);return ue&&!ue.disableAutodetect}function vs(X){X["before:highlightBlock"]&&!X["before:highlightElement"]&&(X["before:highlightElement"]=ue=>{X["before:highlightBlock"](Object.assign({block:ue.el},ue))}),X["after:highlightBlock"]&&!X["after:highlightElement"]&&(X["after:highlightElement"]=ue=>{X["after:highlightBlock"](Object.assign({block:ue.el},ue))})}function As(X){vs(X),ke.push(X)}function Es(X){const ue=ke.indexOf(X);ue!==-1&&ke.splice(ue,1)}function Fn(X,ue){const Te=X;ke.forEach(function(je){je[Te]&&je[Te](ue)})}function Cs(X){return Ge("10.7.0","highlightBlock will be removed entirely in v12.0"),Ge("10.7.0","Please use highlightElement now."),Er(X)}Object.assign(x,{highlight:Ze,highlightAuto:Ar,highlightAll:Hn,highlightElement:Er,highlightBlock:Cs,configure:bs,initHighlighting:ws,initHighlightingOnLoad:_s,registerLanguage:ks,unregisterLanguage:xs,listLanguages:Ss,getLanguage:Tt,registerAliases:$i,autoDetection:Pi,inherit:Li,addPlugin:As,removePlugin:Es}),x.debugMode=function(){Ue=!1},x.safeMode=function(){Ue=!0},x.versionString=gs,x.regex={concat:m,lookahead:h,either:w,optional:p,anyNumberOfTimes:d};for(const X in v)typeof v[X]=="object"&&e(v[X]);return Object.assign(x,v),x},nn=zi({});return nn.newInstance=()=>zi({}),Tr=nn,nn.HighlightJS=nn,nn.default=nn,Tr}var Gs=Zs();const Re=ma(Gs);class pr{constructor(t={}){const{maxSize:n=0,ttlMs:i=0,onEvict:r=null}=t||{};this._map=new Map,this._maxSize=Math.max(0,Number(n)||0),this._ttlMs=Math.max(0,Number(i)||0),this._onEvict=typeof r=="function"?r:null}get size(){return this._map.size}has(t){const n=this._map.get(t);return n?this._ttlMs&&Date.now()-(n.ts||0)>=this._ttlMs?(this._evictKey(t,n),!1):(this._map.delete(t),this._map.set(t,n),!0):!1}get(t){const n=this._map.get(t);if(n){if(this._ttlMs&&Date.now()-(n.ts||0)>=this._ttlMs){this._evictKey(t,n);return}return this._map.delete(t),this._map.set(t,n),n.value}}set(t,n){if(this._map.has(t)&&this._map.delete(t),this._map.set(t,{value:n,ts:Date.now()}),this._maxSize&&this._map.size>this._maxSize)for(;this._map.size>this._maxSize;){const i=this._map.keys().next().value,r=this._map.get(i);if(this._map.delete(i),this._onEvict)try{this._onEvict(i,r&&r.value)}catch{}}return this}delete(t){return this._map.delete(t)}clear(){if(this._onEvict)for(const[t,n]of this._map.entries())try{this._onEvict(t,n&&n.value)}catch{}this._map.clear()}_evictKey(t,n){try{this._map.delete(t)}catch{}if(this._onEvict)try{this._onEvict(t,n&&n.value)}catch{}}}const Yn=new pr({maxSize:500});let ya=300*1e3;function Qs(){Yn.clear()}function Xs(e){ya=Number(e)||0}async function ai(e,t){try{if(!e)return null;const n=Date.now();let i=Yn.get(e);if(i&&i.ok===!1&&n-(i.ts||0)>=ya&&(Yn.delete(e),i=void 0),i){if(i.module)return i.module;if(i.promise)try{return await i.promise}catch{return null}}const r={promise:null,module:null,ok:null,ts:Date.now()};Yn.set(e,r),r.promise=(async()=>{try{return await t()}catch{return null}})();try{const a=await r.promise;return r.module=a,r.ok=!!a,r.ts=Date.now(),a}catch{return r.module=null,r.ok=!1,r.ts=Date.now(),null}}catch{return null}}async function Ks(e){return await ai(e,async()=>{try{return await import(e)}catch{return null}})}const Vs="11.11.1",Ce=new Map,Ys="https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md",dt={shell:"bash",sh:"bash",zsh:"bash",js:"javascript",ts:"typescript",py:"python",csharp:"cs","c#":"cs"};dt.html="xml";dt.xhtml="xml";dt.markup="xml";const si=new Set(["magic","undefined"]);let Nt=null,Js=null;async function oi(e=Ys){if(e)return Nt||(Nt=(async()=>{try{const t=await fetch(e);if(!t.ok)return;const i=(await t.text()).split(/\r?\n/);let r=-1;for(let c=0;c<i.length;c++)if(/\|\s*Language\s*\|/i.test(i[c])){r=c;break}if(r===-1)return;const a=i[r].replace(/^\||\|$/g,"").split("|").map(c=>c.trim().toLowerCase());let s=a.findIndex(c=>/alias|aliases|equivalent|alt|alternates?/i.test(c));s===-1&&(s=1);let o=a.findIndex(c=>/file|filename|module|module name|module-name|short|slug/i.test(c));if(o===-1){const c=a.findIndex(u=>/language/i.test(u));o=c!==-1?c:0}let l=[];for(let c=r+1;c<i.length;c++){const u=i[c].trim();if(!u||!u.startsWith("|"))break;const g=u.replace(/^\||\|$/g,"").split("|").map(f=>f.trim());if(g.every(f=>/^-+$/.test(f)))continue;const h=g;if(!h.length)continue;const p=(h[o]||h[0]||"").toString().trim().toLowerCase();if(!p||/^-+$/.test(p))continue;Ce.set(p,p);const m=h[s]||"";if(m){const f=String(m).split(",").map(w=>w.replace(/`/g,"").trim()).filter(Boolean);if(f.length){const y=f[0].toLowerCase().replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");y&&/[a-z0-9]/i.test(y)&&(Ce.set(y,y),l.push(y))}}}try{const c=[];for(const u of l){const g=String(u||"").replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");g&&/[a-z0-9]/i.test(g)?c.push(g):Ce.delete(u)}l=c}catch(c){k("[codeblocksManager] cleanup aliases failed",c)}try{let c=0;for(const u of Array.from(Ce.keys())){if(!u||/^-+$/.test(u)||!/[a-z0-9]/i.test(u)){Ce.delete(u),c++;continue}if(/^[:]+/.test(u)){const g=u.replace(/^[:]+/,"");if(g&&/[a-z0-9]/i.test(g)){const h=Ce.get(u);Ce.delete(u),Ce.set(g,h)}else Ce.delete(u),c++}}for(const[u,g]of Array.from(Ce.entries()))(!g||/^-+$/.test(g)||!/[a-z0-9]/i.test(g))&&(Ce.delete(u),c++);try{const u=":---------------------";Ce.has(u)&&(Ce.delete(u),c++)}catch(u){k("[codeblocksManager] remove sep key failed",u)}try{const u=Array.from(Ce.keys()).sort()}catch(u){k("[codeblocksManager] compute supported keys failed",u)}}catch(c){k("[codeblocksManager] ignored error",c)}}catch(t){k("[codeblocksManager] loadSupportedLanguages failed",t)}})(),Nt)}const pn=new Set;async function ln(e,t){if(Nt||(async()=>{try{await oi()}catch(r){k("[codeblocksManager] loadSupportedLanguages (IIFE) failed",r)}})(),Nt)try{await Nt}catch{}if(e=e==null?"":String(e),e=e.trim(),!e)return!1;const n=e.toLowerCase();if(si.has(n))return!1;if(Ce.size&&!Ce.has(n)){const r=dt;if(!r[n]&&!r[e])return!1}if(pn.has(e))return!0;const i=dt;try{const r=(t||e||"").toString().replace(/\.js$/i,"").trim(),a=(i[e]||e||"").toString(),s=(i[r]||r||"").toString();let o=Array.from(new Set([a,s,r,e,i[r],i[e]].filter(Boolean))).map(u=>String(u).toLowerCase()).filter(u=>u&&u!=="undefined");Ce.size&&(o=o.filter(u=>{if(Ce.has(u))return!0;const g=dt[u];return!!(g&&Ce.has(g))}));let l=null,c=null;for(const u of o)try{if(l=await ai(u,async()=>{try{try{try{return await import(`highlight.js/lib/languages/${u}.js`)}catch{return await import(`highlight.js/lib/languages/${u}`)}}catch{try{return await import(`https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${u}.js`)}catch{try{return await import(`https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${u}.js`)}catch{return null}}}}catch{return null}}),l){const g=l.default||l;try{const h=Ce.size&&Ce.get(e)||u||e;return Re.registerLanguage(h,g),pn.add(h),h!==e&&(Re.registerLanguage(e,g),pn.add(e)),!0}catch(h){c=h}}else try{if(Ce.has(u)||Ce.has(e)){const g=()=>({});try{Re.registerLanguage(u,g),pn.add(u)}catch{}try{u!==e&&(Re.registerLanguage(e,g),pn.add(e))}catch{}return!0}}catch{}}catch(g){c=g}if(c)throw c;return!1}catch{return!1}}let Zn=null;function ba(e){const t=e&&e.querySelector?e:typeof document<"u"?document:null;Nt||(async()=>{try{await oi()}catch(s){k("[codeblocksManager] loadSupportedLanguages (observer) failed",s)}})();const n=dt,r=Zn||(typeof IntersectionObserver>"u"?null:(Zn=new IntersectionObserver((s,o)=>{s.forEach(l=>{if(!l.isIntersecting)return;const c=l.target;try{o.unobserve(c)}catch(u){k("[codeblocksManager] observer unobserve failed",u)}(async()=>{try{const u=c.getAttribute&&c.getAttribute("class")||c.className||"",g=u.match(/language-([a-zA-Z0-9_+-]+)/)||u.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(g&&g[1]){const h=(g[1]||"").toLowerCase(),d=n[h]||h,p=Ce.size&&(Ce.get(d)||Ce.get(String(d).toLowerCase()))||d;try{await ln(p)}catch(m){k("[codeblocksManager] registerLanguage failed",m)}try{try{const m=c.textContent||c.innerText||"";m!=null&&(c.textContent=m)}catch{}try{c&&c.dataset&&c.dataset.highlighted&&delete c.dataset.highlighted}catch{}Re.highlightElement(c)}catch(m){k("[codeblocksManager] hljs.highlightElement failed",m)}}else try{const h=c.textContent||"";try{if(Re&&typeof Re.getLanguage=="function"&&Re.getLanguage("plaintext")){const d=Re.highlight(h,{language:"plaintext"});if(d&&d.value)try{if(typeof document<"u"&&document.createRange&&typeof document.createRange=="function"){const p=document.createRange().createContextualFragment(d.value);if(typeof c.replaceChildren=="function")c.replaceChildren(...Array.from(p.childNodes));else{for(;c.firstChild;)c.removeChild(c.firstChild);c.appendChild(p)}}else c.innerHTML=d.value}catch{try{c.innerHTML=d.value}catch{}}}}catch{try{Re.highlightElement(c)}catch(p){k("[codeblocksManager] fallback highlightElement failed",p)}}}catch(h){k("[codeblocksManager] auto-detect plaintext failed",h)}}catch(u){k("[codeblocksManager] observer entry processing failed",u)}})()})},{root:null,rootMargin:"300px",threshold:.1}),Zn)),a=t&&t.querySelectorAll?t.querySelectorAll("pre code"):[];if(!r){a.forEach(async s=>{try{const o=s.getAttribute&&s.getAttribute("class")||s.className||"",l=o.match(/language-([a-zA-Z0-9_+-]+)/)||o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(l&&l[1]){const c=(l[1]||"").toLowerCase(),u=n[c]||c,g=Ce.size&&(Ce.get(u)||Ce.get(String(u).toLowerCase()))||u;try{await ln(g)}catch(h){k("[codeblocksManager] registerLanguage failed (no observer)",h)}}try{try{const c=s.textContent||s.innerText||"";c!=null&&(s.textContent=c)}catch{}try{s&&s.dataset&&s.dataset.highlighted&&delete s.dataset.highlighted}catch{}Re.highlightElement(s)}catch(c){k("[codeblocksManager] hljs.highlightElement failed (no observer)",c)}}catch(o){k("[codeblocksManager] loadSupportedLanguages fallback ignored error",o)}});return}a.forEach(s=>{try{r.observe(s)}catch(o){k("[codeblocksManager] observe failed",o)}})}function eo(e,{useCdn:t=!0}={}){const n=typeof document<"u"&&document.head&&document.head.querySelector?document.head.querySelector("link[data-hl-theme]"):typeof document<"u"?document.querySelector("link[data-hl-theme]"):null,i=n&&n.getAttribute?n.getAttribute("data-hl-theme"):null,r=e==null?"default":String(e),a=r&&String(r).toLowerCase()||"";if(a==="default"||a==="monokai"){try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}return}if(i&&i.toLowerCase()===a)return;if(!t){try{k("Requested highlight theme not bundled; set useCdn=true to load theme from CDN")}catch{}return}const s=a,o=`https://cdn.jsdelivr.net/npm/highlight.js@${Vs}/styles/${s}.css`,l=document.createElement("link");l.rel="stylesheet",l.href=o,l.setAttribute("data-hl-theme",s),l.addEventListener("load",()=>{try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}}),document.head.appendChild(l)}let Ut="light";function to(e,t={}){if(document.querySelector(`link[href="${e}"]`))return;const n=document.createElement("link");if(n.rel="stylesheet",n.href=e,Object.entries(t).forEach(([i,r])=>n.setAttribute(i,r)),document.head.appendChild(n),t["data-bulmaswatch-theme"])try{if(n.getAttribute("data-bulmaswatch-observer"))return;let i=Number(n.getAttribute("data-bulmaswatch-move-count")||0),r=!1;const a=new MutationObserver(()=>{try{if(r)return;const o=n.parentNode;if(!o||o.lastElementChild===n)return;if(i>=1e3){n.setAttribute("data-bulmaswatch-move-stopped","1");return}r=!0;try{o.appendChild(n)}catch{}i+=1,n.setAttribute("data-bulmaswatch-move-count",String(i)),r=!1}catch{}});try{a.observe(document.head,{childList:!0}),n.setAttribute("data-bulmaswatch-observer","1"),n.setAttribute("data-bulmaswatch-move-count",String(i))}catch{}const s=document.head;s&&s.lastElementChild!==n&&s.appendChild(n)}catch{}}function zr(){try{const e=typeof document<"u"&&document.head?document.head:document,t=Array.from(e.querySelectorAll("link[data-bulmaswatch-theme]"));for(const n of t)n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}try{const e=typeof document<"u"&&document.head?document.head:document,t=Array.from(e.querySelectorAll("style[data-bulma-override]"));for(const n of t)n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}}async function wa(e="none",t="/"){try{jt("[bulmaManager] ensureBulma called",{bulmaCustomize:e,pageDir:t})}catch{}if(!e)return;if(e==="none"){try{zr()}catch{}return}const n=[t+"bulma.css","/bulma.css"],i=Array.from(new Set(n));if(e==="local"){if(zr(),document.querySelector("style[data-bulma-override]"))return;for(const r of i)try{const a=await fetch(r,{method:"GET"});if(a.ok){const s=await a.text(),o=document.createElement("style");o.setAttribute("data-bulma-override",r),o.appendChild(document.createTextNode(`
/* bulma override: ${r} */
`+s)),document.head.appendChild(o);return}}catch(a){k("[bulmaManager] fetch local bulma candidate failed",a)}return}try{const r=String(e).trim();if(!r)return;zr();const a=`https://unpkg.com/bulmaswatch/${encodeURIComponent(r)}/bulmaswatch.min.css`;to(a,{"data-bulmaswatch-theme":r})}catch(r){k("[bulmaManager] ensureBulma failed",r)}}function _a(e){Ut=e==="dark"?"dark":e==="system"?"system":"light";try{const t=Array.from(document.querySelectorAll(".nimbi-mount"));if(t.length>0)for(const n of t)Ut==="dark"?n.setAttribute("data-theme","dark"):Ut==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme");else{const n=document.documentElement;Ut==="dark"?n.setAttribute("data-theme","dark"):Ut==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme")}}catch{}}function no(e){const t=document.documentElement;for(const[n,i]of Object.entries(e||{}))try{t.style.setProperty(`--${n}`,i)}catch(r){k("[bulmaManager] setThemeVars failed for",n,r)}}function ka(e){if(!e||!(e instanceof HTMLElement))return()=>{};const t=e.closest&&e.closest(".nimbi-mount")||null;try{t&&(Ut==="dark"?t.setAttribute("data-theme","dark"):Ut==="light"?t.setAttribute("data-theme","light"):t.removeAttribute("data-theme"))}catch{}return()=>{}}const xa={en:{navigation:"Navigation",onThisPage:"On this page",home:"Home",scrollToTop:"Scroll to top",readingTime:"{minutes} min read",searchPlaceholder:"Search…",searchNoResults:"No results",imagePreviewTitle:"Image preview",imagePreviewFit:"Fit to screen",imagePreviewOriginal:"Original size",imagePreviewZoomOut:"Zoom out",imagePreviewZoomIn:"Zoom in",imagePreviewClose:"Close"},es:{navigation:"Navegación",onThisPage:"En esta página",home:"Inicio",scrollToTop:"Ir arriba",readingTime:"{minutes} min de lectura",searchPlaceholder:"Buscar…",searchNoResults:"Sin resultados",imagePreviewTitle:"Previsualización de imagen",imagePreviewFit:"Ajustar a la pantalla",imagePreviewOriginal:"Tamaño original",imagePreviewZoomOut:"Alejar",imagePreviewZoomIn:"Acercar",imagePreviewClose:"Cerrar"},de:{navigation:"Navigation",onThisPage:"Auf dieser Seite",home:"Startseite",scrollToTop:"Nach oben",readingTime:"{minutes} min Lesezeit",searchPlaceholder:"Suchen…",searchNoResults:"Keine Ergebnisse",imagePreviewTitle:"Bildvorschau",imagePreviewFit:"An Bildschirm anpassen",imagePreviewOriginal:"Originalgröße",imagePreviewZoomOut:"Verkleinern",imagePreviewZoomIn:"Vergrößern",imagePreviewClose:"Schließen"},fr:{navigation:"Navigation",onThisPage:"Sur cette page",home:"Accueil",scrollToTop:"Aller en haut",readingTime:"{minutes} min de lecture",searchPlaceholder:"Rechercher…",searchNoResults:"Aucun résultat",imagePreviewTitle:"Aperçu de l’image",imagePreviewFit:"Ajuster à l’écran",imagePreviewOriginal:"Taille originale",imagePreviewZoomOut:"Dézoomer",imagePreviewZoomIn:"Zoomer",imagePreviewClose:"Fermer"},pt:{navigation:"Navegação",onThisPage:"Nesta página",home:"Início",scrollToTop:"Ir para o topo",readingTime:"{minutes} min de leitura",searchPlaceholder:"Procurar…",searchNoResults:"Sem resultados",imagePreviewTitle:"Visualização da imagem",imagePreviewFit:"Ajustar à tela",imagePreviewOriginal:"Tamanho original",imagePreviewZoomOut:"Diminuir",imagePreviewZoomIn:"Aumentar",imagePreviewClose:"Fechar"}},on=JSON.parse(JSON.stringify(xa));let or="en";if(typeof navigator<"u"){const e=navigator.language||navigator.languages&&navigator.languages[0]||"en";or=String(e).split("-")[0].toLowerCase()}xa[or]||(or="en");let qt=or;function an(e,t={}){const n=on[qt]||on.en;let i=n&&n[e]?n[e]:on.en[e]||"";for(const r of Object.keys(t))i=i.replace(new RegExp(`{${r}}`,"g"),String(t[r]));return i}async function li(e,t){if(!e)return;let n=e;try{/^https?:\/\//.test(e)||(n=new URL(e,location.origin+t).toString());const i=await fetch(n);if(!i.ok)return;const r=await i.json();for(const a of Object.keys(r||{}))on[a]=Object.assign({},on[a]||{},r[a])}catch{}}function ci(e){const t=String(e).split("-")[0].toLowerCase();qt=on[t]?t:"en"}const ro=Object.freeze(Object.defineProperty({__proto__:null,get currentLang(){return qt},loadL10nFile:li,setLang:ci,t:an},Symbol.toStringTag,{value:"Module"}));function io(e){try{return String(e||"").split("/").map(t=>encodeURIComponent(t)).join("/")}catch{return String(e||"")}}function Ui(e,t=null,n=void 0){let r="#/"+io(String(e||""));t&&(r+="#"+encodeURIComponent(String(t)));try{let a="";if(typeof n=="string")a=n;else if(typeof location<"u"&&location&&location.search)a=location.search;else if(typeof location<"u"&&location&&location.hash)try{const s=Je(location.href);s&&s.params&&(a=s.params)}catch{}if(a){const s=typeof a=="string"&&a.startsWith("?")?a.slice(1):a;try{const o=new URLSearchParams(s);o.delete("page");const l=o.toString();l&&(r+="?"+l)}catch{const l=String(s||"").replace(/^page=[^&]*&?/,"");l&&(r+="?"+l)}}}catch{}return r}function Je(e){try{const t=new URL(e,typeof location<"u"?location.href:"http://localhost/"),n=t.searchParams.get("page");if(n){let r=null,a="";if(t.hash){const c=t.hash.replace(/^#/,"");if(c.includes("&")){const u=c.split("&");r=u.shift()||null,a=u.join("&")}else r=c||null}const s=new URLSearchParams(t.search);s.delete("page");const l=[s.toString(),a].filter(Boolean).join("&");return{type:"canonical",page:decodeURIComponent(n),anchor:r,params:l}}const i=t.hash?decodeURIComponent(t.hash.replace(/^#/,"")):"";if(i&&i.startsWith("/")){let r=i,a="";if(r.indexOf("?")!==-1){const c=r.split("?");r=c.shift()||"",a=c.join("?")||""}let s=r,o=null;if(s.indexOf("#")!==-1){const c=s.split("#");s=c.shift()||"",o=c.join("#")||null}return{type:"cosmetic",page:s.replace(/^\/+/,"")||null,anchor:o,params:a}}return{type:"path",page:(t.pathname||"").replace(/^\//,"")||null,anchor:t.hash?t.hash.replace(/^#/,""):null,params:t.search?t.search.replace(/^\?/,""):""}}catch{return{type:"unknown",page:e,anchor:null,params:""}}}let Gn=typeof DOMParser<"u"?new DOMParser:null;function He(){return Gn||(typeof DOMParser<"u"?(Gn=new DOMParser,Gn):null)}async function Rn(e,t,n=4){if(!Array.isArray(e)||e.length===0)return[];const i=new Array(e.length);let r=0;const a=[],s=Math.max(1,Number(n)||1);async function o(){for(;;){const l=r++;if(l>=e.length)return;try{i[l]=await t(e[l],l)}catch{i[l]=void 0}}}for(let l=0;l<Math.min(s,e.length);l++)a.push(o());return await Promise.all(a),i}const ao=`/**
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
`;function so(e,t="worker"){let n=null;function i(...l){try{k(...l)}catch{}}function r(){if(!n)try{const l=e();n=l||null,l&&l.addEventListener("error",()=>{try{n===l&&(n=null,l.terminate&&l.terminate())}catch(c){i("["+t+"] worker termination failed",c)}})}catch(l){n=null,i("["+t+"] worker init failed",l)}return n}function a(){try{n&&(n.terminate&&n.terminate(),n=null)}catch(l){i("["+t+"] worker termination failed",l)}}function s(l,c=1e4){return new Promise((u,g)=>{const h=r();if(!h)return g(new Error("worker unavailable"));const d=String(Math.random()),p=Object.assign({},l,{id:d});let m=null;const f=()=>{m&&clearTimeout(m),h.removeEventListener("message",w),h.removeEventListener("error",y)},w=_=>{const b=_.data||{};b.id===d&&(f(),b.error?g(new Error(b.error)):u(b.result))},y=_=>{f(),i("["+t+"] worker error event",_);try{n===h&&(n=null,h.terminate&&h.terminate())}catch(b){i("["+t+"] worker termination failed",b)}g(new Error(_&&_.message||"worker error"))};m=setTimeout(()=>{f(),i("["+t+"] worker timed out");try{n===h&&(n=null,h.terminate&&h.terminate())}catch(_){i("["+t+"] worker termination on timeout failed",_)}g(new Error("worker timeout"))},c),h.addEventListener("message",w),h.addEventListener("error",y);try{h.postMessage(p)}catch(_){f(),g(_)}})}return{get:r,send:s,terminate:a}}function Sa(e,t="worker-pool",n=2){const i=new Array(n).fill(null);let r=0;function a(...p){try{k(...p)}catch{}}function s(p){if(!i[p])try{const m=e();i[p]=m||null,m&&m.addEventListener("error",()=>{try{i[p]===m&&(i[p]=null,m.terminate&&m.terminate())}catch(f){a("["+t+"] worker termination failed",f)}})}catch(m){i[p]=null,a("["+t+"] worker init failed",m)}return i[p]}const o=new Array(n).fill(0),l=new Array(n).fill(null),c=30*1e3;function u(p){try{o[p]=Date.now(),l[p]&&(clearTimeout(l[p]),l[p]=null),l[p]=setTimeout(()=>{try{i[p]&&(i[p].terminate&&i[p].terminate(),i[p]=null)}catch(m){a("["+t+"] idle termination failed",m)}l[p]=null},c)}catch{}}function g(){for(let p=0;p<i.length;p++){const m=s(p);if(m)return m}return null}function h(){for(let p=0;p<i.length;p++)try{i[p]&&(i[p].terminate&&i[p].terminate(),i[p]=null)}catch(m){a("["+t+"] worker termination failed",m)}}function d(p,m=1e4){return new Promise((f,w)=>{const y=r++%i.length,_=b=>{const A=(y+b)%i.length,S=s(A);if(!S)return b+1<i.length?_(b+1):w(new Error("worker pool unavailable"));const E=String(Math.random()),I=Object.assign({},p,{id:E});let O=null;const W=()=>{O&&clearTimeout(O),S.removeEventListener("message",z),S.removeEventListener("error",B)},z=Z=>{const ee=Z.data||{};ee.id===E&&(W(),ee.error?w(new Error(ee.error)):f(ee.result))},B=Z=>{W(),a("["+t+"] worker error event",Z);try{i[A]===S&&(i[A]=null,S.terminate&&S.terminate())}catch(ee){a("["+t+"] worker termination failed",ee)}w(new Error(Z&&Z.message||"worker error"))};O=setTimeout(()=>{W(),a("["+t+"] worker timed out");try{i[A]===S&&(i[A]=null,S.terminate&&S.terminate())}catch(Z){a("["+t+"] worker termination on timeout failed",Z)}w(new Error("worker timeout"))},m),S.addEventListener("message",z),S.addEventListener("error",B);try{u(A),S.postMessage(I)}catch(Z){W(),w(Z)}};_(0)})}return{get:g,send:d,terminate:h}}function oo(e,t,n="worker"){return so(()=>{try{const a=Gt(e);if(a)try{if(!(typeof process<"u"&&process.env&&process.env.VITEST))return a}catch{return a}}catch{}if(typeof t!="function")return null;const r={message:[],error:[]};return{addEventListener(a,s){r[a]||(r[a]=[]),r[a].push(s)},removeEventListener(a,s){if(!r[a])return;const o=r[a].indexOf(s);o!==-1&&r[a].splice(o,1)},postMessage(a){setTimeout(async()=>{try{const o={data:await t(a)};(r.message||[]).forEach(l=>l(o))}catch(s){const o={data:{id:a&&a.id,error:String(s)}};(r.message||[]).forEach(l=>l(o))}},0)},terminate(){Object.keys(r).forEach(a=>r[a].length=0)}}},n)}function Gt(e){try{if(typeof Blob<"u"&&typeof URL<"u"&&e)try{Gt._blobUrlCache||(Gt._blobUrlCache=new pr({maxSize:200,onEvict:(i,r)=>{try{typeof URL<"u"&&r&&URL.revokeObjectURL(r)}catch{}}}));const t=Gt._blobUrlCache;let n=t.get(e);if(!n){const i=new Blob([e],{type:"application/javascript"});n=URL.createObjectURL(i),t.set(e,n)}return new Worker(n,{type:"module"})}catch(t){try{k("[worker-manager] createWorkerFromRaw failed",t)}catch{}}}catch(t){try{k("[worker-manager] createWorkerFromRaw failed",t)}catch{}}return null}function lo(){return typeof requestIdleCallback=="function"?new Promise(e=>{try{requestIdleCallback(e,{timeout:50})}catch{setTimeout(e,0)}}):new Promise(e=>setTimeout(e,0))}async function Pt(e,t=50){try{if(!e||!t)return;e%t===0&&await lo()}catch{}}const it=new Set;function Qt(e){if(co(),it.clear(),Array.isArray(Oe)&&Oe.length)for(const t of Oe)t&&it.add(t);else for(const t of $e)t&&it.add(t);Wi(Y),Wi(G),Qt._refreshed=!0}function Wi(e){if(!(!e||typeof e.values!="function"))for(const t of e.values())t&&it.add(t)}function Zi(e){if(!e||typeof e.set!="function")return;const t=e.set;e.set=function(n,i){return i&&it.add(i),t.call(this,n,i)}}let Gi=!1;function co(){Gi||(Zi(Y),Zi(G),Gi=!0)}const Rr=Object.freeze(Object.defineProperty({__proto__:null,indexSet:it,refreshIndexPaths:Qt},Symbol.toStringTag,{value:"Module"}));function dn(e,t=1e3){const n=new Map;function i(r){const a=r===void 0?"__undefined":String(r);if(n.has(a)){const o=n.get(a);return n.delete(a),n.set(a,o),o}const s=e(r);try{if(n.set(a,s),n.size>t){const o=n.keys().next().value;n.delete(o)}}catch{}return s}return i._cache=n,i._reset=()=>n.clear(),i}function qr(e){return!e||typeof e!="string"?!1:/^(https?:)?\/\//.test(e)||e.startsWith("mailto:")||e.startsWith("tel:")}const J=dn(function(e){return String(e||"").replace(/^[.\/]+/,"")},2e3),cn=dn(function(e){return String(e||"").replace(/\/+$/,"")},2e3),Yt=dn(function(e){return cn(String(e||""))+"/"},2e3);function uo(e){try{if(!e||typeof document>"u"||!document.head||e.startsWith("data:")||document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`))return;const n=document.createElement("link");n.rel="preload",n.as="image",n.href=e,document.head.appendChild(n)}catch(t){k("[helpers] preloadImage failed",t)}}function Qn(e,t=0,n=!1){try{if(typeof window>"u"||!e||!e.querySelectorAll)return;const i=Array.from(e.querySelectorAll("img"));if(!i.length)return;const r=e,a=r&&r.getBoundingClientRect?r.getBoundingClientRect():null,s=0,o=typeof window<"u"&&(window.innerHeight||document.documentElement.clientHeight)||0,l=a?Math.max(s,a.top):s,u=(a?Math.min(o,a.bottom):o)+Number(t||0);let g=0;r&&(g=r.clientHeight||(a?a.height:0)),g||(g=o-s);let h=.6;try{const f=r&&window.getComputedStyle?window.getComputedStyle(r):null,w=f&&f.getPropertyValue("--nimbi-image-max-height-ratio"),y=w?parseFloat(w):NaN;!Number.isNaN(y)&&y>0&&y<=1&&(h=y)}catch(f){k("[helpers] read CSS ratio failed",f)}const d=Math.max(200,Math.floor(g*h));let p=!1,m=null;if(i.forEach(f=>{try{const w=f.getAttribute?f.getAttribute("loading"):void 0;w!=="eager"&&f.setAttribute&&f.setAttribute("loading","lazy");const y=f.getBoundingClientRect?f.getBoundingClientRect():null,_=f.src||f.getAttribute&&f.getAttribute("src"),b=y&&y.height>1?y.height:d,A=y?y.top:0,S=A+b;y&&b>0&&A<=u&&S>=l&&(f.setAttribute?(f.setAttribute("loading","eager"),f.setAttribute("fetchpriority","high"),f.setAttribute("data-eager-by-nimbi","1")):(f.loading="eager",f.fetchPriority="high"),uo(_),p=!0),!m&&y&&y.top<=u&&(m={img:f,src:_,rect:y,beforeLoading:w})}catch(w){k("[helpers] setEagerForAboveFoldImages per-image failed",w)}}),!p&&m){const{img:f,src:w,rect:y,beforeLoading:_}=m;try{f.setAttribute?(f.setAttribute("loading","eager"),f.setAttribute("fetchpriority","high"),f.setAttribute("data-eager-by-nimbi","1")):(f.loading="eager",f.fetchPriority="high")}catch(b){k("[helpers] setEagerForAboveFoldImages fallback failed",b)}}}catch(i){k("[helpers] setEagerForAboveFoldImages failed",i)}}function Pe(e,t=null,n){try{const i=typeof n=="string"?n:typeof window<"u"&&window.location?window.location.search:"",r=new URLSearchParams(i.startsWith("?")?i.slice(1):i),a=String(e||"");r.delete("page");const s=new URLSearchParams;s.set("page",a);for(const[c,u]of r.entries())s.append(c,u);const o=s.toString();let l=o?`?${o}`:"";return t&&(l+=`#${encodeURIComponent(t)}`),l||`?page=${encodeURIComponent(a)}`}catch{const r=`?page=${encodeURIComponent(String(e||""))}`;return t?`${r}#${encodeURIComponent(t)}`:r}}dn(function(e){try{const t=String(e||"");return t.includes("%")?t:encodeURI(t)}catch(t){return k("[helpers] encodeURL failed",t),String(e||"")}},2e3);function lr(e){try{const t=e();return t&&typeof t.then=="function"?t.catch(n=>{k("[helpers] safe swallowed error",n)}):t}catch(t){k("[helpers] safe swallowed error",t)}}try{typeof globalThis<"u"&&!globalThis.safe&&(globalThis.safe=lr)}catch(e){k("[helpers] global attach failed",e)}const ho=dn(function(e){try{if(!e&&e!==0)return"";const t=String(e),n={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:" "};return t.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g,(i,r)=>{if(!r)return i;if(r[0]==="#")try{return r[1]==="x"||r[1]==="X"?String.fromCharCode(parseInt(r.slice(2),16)):String.fromCharCode(parseInt(r.slice(1),10))}catch{return i}return n[r]!==void 0?n[r]:i})}catch{return String(e||"")}},2e3),Y=new Map,cr=new Map;function Jn(e){try{if(!e)return;let t=Ot,n="";if(e.type==="cosmetic"){const r=e.page!=null&&String(e.page).trim()!=="";t=r?String(e.page):Ot,n="#/"+(r?String(e.page):""),e.anchor&&(n+="#"+String(e.anchor)),e.params&&(n+="?"+String(e.params))}else if(e.type==="path"){const r=e.page!=null&&String(e.page).trim()!=="";t=r?String(e.page):Ot,n="/"+(r?String(e.page):""),e.anchor&&(n+="#"+String(e.anchor)),e.params&&(n+="?"+String(e.params))}else if(e.type==="canonical")if(e.page)t=e.page,n="?page="+encodeURIComponent(e.page),e.anchor&&(n+="#"+String(e.anchor)),e.params&&(n+="?"+String(e.params));else{t=Ot;try{n=typeof location<"u"&&location&&location.pathname?String(location.pathname):"/",typeof location<"u"&&location.search&&(n+=String(location.search)),typeof location<"u"&&location.hash&&(n+=String(location.hash))}catch{n="/"}}else return;const i=cr.get(t)||[];i.push(n),cr.set(t,i)}catch{}}function va(e,t){try{const n=String(e||""),i=cr.get(n);if(!i||!i.length)return;try{const r=typeof globalThis<"u"?globalThis:null;if(r){try{r.__nimbiColdRouteResolved||(r.__nimbiColdRouteResolved=[])}catch{}for(const a of i)try{const s={slug:n,token:a,rel:String(t||"")};try{r.__nimbiColdRouteResolved.push(s)}catch{}try{r&&typeof r.dispatchEvent=="function"&&r.dispatchEvent(new CustomEvent("nimbi.coldRouteResolved",{detail:s}))}catch{}try{r&&r.__nimbiUI&&typeof r.__nimbiUI.renderByQuery=="function"&&r.__nimbiUI.renderByQuery().catch(()=>{})}catch{}}catch{}}}catch{}cr.delete(n)}catch{}}try{const e=Y.set;Y.set=function(t,n){const i=Map.prototype.has.call(this,t),r=Map.prototype.set.call(this,t,n);try{i||va(t,n)}catch{}return r}}catch{}let st=[],ui=!1;function fo(e){ui=!!e}function Aa(e){st=Array.isArray(e)?e.slice():[]}function go(){return st}const mr=typeof navigator<"u"&&navigator.hardwareConcurrency?Math.max(1,Math.floor(navigator.hardwareConcurrency/2)):2,Ea=Sa(()=>Gt(ao),"slugManager",mr);function po(){try{if(ii())return!0}catch{}try{return!!(typeof le=="string"&&le)}catch{return!1}}function ge(...e){try{jt(...e)}catch{}}function mo(){return Ea.get()}function Ca(e){return Ea.send(e,5e3)}async function Hr(e,t=1,n=void 0){const i=await Promise.resolve().then(()=>at);if(!(i.initSlugWorker&&i.initSlugWorker()))throw new Error("slug worker required but unavailable");return await Ca({type:"buildSearchIndex",contentBase:e,indexDepth:t,noIndexing:n})}async function yo(e,t,n){const i=await Promise.resolve().then(()=>at);if(!(i.initSlugWorker&&i.initSlugWorker()))throw new Error("slug worker required but unavailable");return Ca({type:"crawlForSlug",slug:e,base:t,maxQueue:n})}function rt(e,t){if(!e)return;let n=null;try{n=J(typeof t=="string"?t:String(t||""))}catch{n=String(t||"")}if(n){try{if(st&&st.length){const r=String(n).split("/")[0],a=st.includes(r);let s=Y.get(e);if(!s||typeof s=="string")s={default:typeof s=="string"?J(s):void 0,langs:{}};else try{s.default&&(s.default=J(s.default))}catch{}a?s.langs[r]=n:s.default=n,Y.set(e,s)}else{const i=Y.has(e)?Y.get(e):void 0;if(!i)Y.set(e,n);else{let r=null;try{typeof i=="string"?r=J(i):i&&typeof i=="object"&&(r=i.default?J(i.default):null)}catch{r=null}if(r===n)Y.set(e,n);else{let a=null,s=2;for(;a=`${e}-${s}`,!!Y.has(a);){let o=Y.get(a),l=null;try{typeof o=="string"?l=J(o):o&&typeof o=="object"&&(l=o.default?J(o.default):null)}catch{l=null}if(l===n){e=a;break}if(s+=1,s>1e4)break}try{if(!Y.has(a))Y.set(a,n),e=a;else if(Y.get(a)===n)e=a;else{const o=new Set;for(const c of Y.keys())o.add(c);const l=typeof Xt=="function"?Xt(e,o):`${e}-2`;Y.set(l,n),e=l}}catch{}}}}}catch{}try{if(n){try{G.set(n,e)}catch{}try{if($e&&typeof $e.has=="function"){if(!$e.has(n)){try{$e.add(n)}catch{}try{Array.isArray(Oe)&&!Oe.includes(n)&&Oe.push(n)}catch{}}}else try{Array.isArray(Oe)&&!Oe.includes(n)&&Oe.push(n)}catch{}}catch{}}}catch{}}}const yr=new Set;function bo(e){typeof e=="function"&&yr.add(e)}function wo(e){typeof e=="function"&&yr.delete(e)}const G=new Map;let Fr={},Oe=[];const $e=new Set;let le="_404.md",ot=null;const Ot="_home";function Ma(e){if(e==null){le=null;return}le=String(e||"")}function La(e){if(e==null){ot=null;return}ot=String(e||"");try{try{va(Ot,ot)}catch{}}catch{}}function _o(e){Fr=e||{}}function Ta(e){try{if(Array.isArray(re)||(re=[]),!Array.isArray(e))return;try{Array.isArray(re)||(re=[]),re.length=0;for(const t of e)re.push(t);try{if(typeof window<"u")try{window.__nimbiLiveSearchIndex=re}catch{}}catch{}}catch(t){ge("[slugManager] replacing searchIndex by assignment fallback",t);try{re=Array.from(e)}catch{}}}catch{}}const xn=new Map,ur=new Set;function ko(){xn.clear(),ur.clear()}function xo(e){if(!e||e.length===0)return"";let t=e[0];for(let i=1;i<e.length;i++){const r=e[i];let a=0;const s=Math.min(t.length,r.length);for(;a<s&&t[a]===r[a];)a++;t=t.slice(0,a)}const n=t.lastIndexOf("/");return n===-1?t:t.slice(0,n+1)}const de=dn(function(e){let n=String(e||"").toLowerCase().replace(/[^a-z0-9\- ]/g,"").replace(/ /g,"-");return n=n.replace(/(?:-?)(?:md|html)$/,""),n=n.replace(/-+/g,"-"),n=n.replace(/^-|-$/g,""),n.length>80&&(n=n.slice(0,80).replace(/-+$/g,"")),n},2e3);function hi(e){Y.clear(),G.clear(),Oe=[];try{$e.clear()}catch{}st=st||[];const t=Object.keys(Fr||{});if(!t.length)return;let n="";try{if(e){try{/^[a-z][a-z0-9+.-]*:/i.test(String(e))?n=new URL(String(e)).pathname:n=String(e||"")}catch(i){n=String(e||""),ge("[slugManager] parse contentBase failed",i)}n=Yt(n)}}catch(i){n="",ge("[slugManager] setContentBase prefix derivation failed",i)}n||(n=xo(t));for(const i of t){let r=i;n&&i.startsWith(n)?r=J(i.slice(n.length)):r=J(i),Oe.push(r);try{$e.add(r)}catch{}try{Qt()}catch(s){ge("[slugManager] refreshIndexPaths failed",s)}const a=Fr[i];if(typeof a=="string"){const s=(a||"").match(/^#\s+(.+)$/m);if(s&&s[1]){const o=de(s[1].trim());if(o)try{let l=o;if((!st||!st.length)&&(l=Xt(l,new Set(Y.keys()))),st&&st.length){const u=r.split("/")[0],g=st.includes(u);let h=Y.get(l);(!h||typeof h=="string")&&(h={default:typeof h=="string"?h:void 0,langs:{}}),g?h.langs[u]=r:h.default=r,Y.set(l,h)}else Y.set(l,r);G.set(r,l)}catch(l){ge("[slugManager] set slug mapping failed",l)}}}}}try{hi()}catch(e){ge("[slugManager] initial setContentBase failed",e)}function Xt(e,t){if(!t.has(e))return e;let n=2,i=`${e}-${n}`;for(;t.has(i);)n+=1,i=`${e}-${n}`;return i}function So(e){return Bn(e,void 0)}function Bn(e,t){if(!e)return!1;if(e.startsWith("//"))return!0;if(/^[a-z][a-z0-9+.-]*:/i.test(e)){if(t&&typeof t=="string")try{const n=new URL(e),i=new URL(t);return n.origin!==i.origin?!0:!n.pathname.startsWith(i.pathname)}catch{return!0}return!0}if(e.startsWith("/")&&t&&typeof t=="string")try{const n=new URL(e,t),i=new URL(t);return n.origin!==i.origin?!0:!n.pathname.startsWith(i.pathname)}catch{return!0}return!1}function er(e){return e==null?e:String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g,(t,n)=>n)}function un(e){if(!e||!Y.has(e))return null;const t=Y.get(e);if(!t)return null;if(typeof t=="string")return t;if(st&&st.length&&qt&&t.langs&&t.langs[qt])return t.langs[qt];if(t.default)return t.default;if(t.langs){const n=Object.keys(t.langs);if(n.length)return t.langs[n[0]]}return null}const gt=new pr({maxSize:2e3});function vo(){gt.clear(),Ht.clear()}const Ht=new pr({maxSize:2e3});let za=60*1e3;function Ao(e){za=Number(e)||0}function Eo(e){try{const t=Math.max(0,Number(e)||0);gt&&typeof gt._maxSize<"u"&&(gt._maxSize=t)}catch{}}function Co(e){try{const t=Math.max(0,Number(e)||0);gt&&typeof gt._ttlMs<"u"&&(gt._ttlMs=t)}catch{}}function Mo(e){try{const t=Math.max(0,Number(e)||0);Ht&&typeof Ht._maxSize<"u"&&(Ht._maxSize=t)}catch{}}let Dr=Math.max(1,Math.min(mr,5));function Lo(e){try{Dr=Math.max(1,Number(e)||1)}catch{Dr=1}}function Sn(){return Dr}let Be=async function(e,t,n){if(!e)throw new Error("path required");try{if(typeof e=="string"&&(e.indexOf("?page=")!==-1||e.startsWith("?")||e.startsWith("#/")||e.indexOf("#/")!==-1))try{const c=Je(e);c&&c.page&&(e=c.page)}catch{}}catch{}try{const c=(String(e||"").match(/([^\/]+)\.md(?:$|[?#])/)||[])[1],u=typeof e=="string"&&String(e).indexOf("/")===-1;if(c&&(u||!1)&&Y.has(c)){const h=un(c)||Y.get(c);h&&h!==e&&(e=h)}}catch(c){ge("[slugManager] slug mapping normalization failed",c)}try{if(typeof e=="string"&&e.indexOf("::")!==-1){const c=String(e).split("::",1)[0];if(c)try{if(Y.has(c)){const u=un(c)||Y.get(c);u?e=u:e=c}else e=c}catch{e=c}}}catch(c){ge("[slugManager] path sanitize failed",c)}try{if(t)try{let u=(/^[a-z][a-z0-9+.-]*:/i.test(String(t))?new URL(String(t)):new URL(String(t),typeof location<"u"?location.origin:"http://localhost")).pathname||"";if(u=u.replace(/^\/+|\/+$/g,""),u)try{const g=String(e||"");if(!/^[a-z][a-z0-9+.-]*:/i.test(g)){let h=g.replace(/^\/+/,"");h===u?e="":h.startsWith(u+"/")?e=h.slice(u.length+1):e=h}}catch{}}catch{}}catch{}if(!(n&&n.force===!0||typeof le=="string"&&le||Y&&Y.size||$e&&$e.size||ii()))throw new Error("failed to fetch md");const r=t==null?"":cn(String(t));let a="";try{const c=typeof location<"u"&&location.origin?location.origin:"http://localhost";let u=c.replace(/\/$/,"")+"/";r&&(/^[a-z][a-z0-9+.-]*:/i.test(r)?u=r.replace(/\/$/,"")+"/":r.startsWith("/")?u=c.replace(/\/$/,"")+r.replace(/\/$/,"")+"/":u=c.replace(/\/$/,"")+"/"+r.replace(/\/$/,"")+"/");try{a=new URL(e.replace(/^\//,""),u).toString()}catch{a=c.replace(/\/$/,"")+"/"+e.replace(/^\//,"")}}catch{a=(typeof location<"u"&&location.origin?location.origin:"http://localhost")+"/"+e.replace(/^\//,"")}const s=n&&n.signal;try{const c=Ht.get(a);if(c&&c>Date.now())return Promise.reject(new Error("failed to fetch md"));c&&Ht.delete(a)}catch{}if(gt.has(a))return gt.get(a);const l=(async()=>{const c=await fetch(a,s?{signal:s}:void 0);if(!c||typeof c.ok!="boolean"||!c.ok){if(c&&c.status===404&&typeof le=="string"&&le)try{const m=`${r}/${le}`,f=await globalThis.fetch(m,s?{signal:s}:void 0);if(f&&typeof f.ok=="boolean"&&f.ok)return{raw:await f.text(),status:404}}catch(m){ge("[slugManager] fetching fallback 404 failed",m)}let p="";try{c&&typeof c.clone=="function"?p=await c.clone().text():c&&typeof c.text=="function"?p=await c.text():p=""}catch(m){p="",ge("[slugManager] reading error body failed",m)}try{const m=c?c.status:void 0;if(m===404)try{k("fetchMarkdown failed (404):",()=>({url:a,status:m,statusText:c?c.statusText:void 0,body:p.slice(0,200)}))}catch{}else try{sr("fetchMarkdown failed:",()=>({url:a,status:m,statusText:c?c.statusText:void 0,body:p.slice(0,200)}))}catch{}}catch{}throw new Error("failed to fetch md")}const u=await c.text(),g=u.trim().slice(0,128).toLowerCase(),h=/^(?:<!doctype|<html|<title|<h1)/.test(g),d=h||String(e||"").toLowerCase().endsWith(".html");if(h&&String(e||"").toLowerCase().endsWith(".md")){try{if(typeof le=="string"&&le){const p=`${r}/${le}`,m=await globalThis.fetch(p,s?{signal:s}:void 0);if(m.ok)return{raw:await m.text(),status:404}}}catch(p){ge("[slugManager] fetching fallback 404 failed",p)}throw po()&&sr("fetchMarkdown: server returned HTML for .md request",a),new Error("failed to fetch md")}return d?{raw:u,isHtml:!0}:{raw:u}})().catch(c=>{if(c&&c.name==="AbortError"){try{gt.delete(a)}catch{}throw c}try{Ht.set(a,Date.now()+za)}catch{}try{gt.delete(a)}catch{}throw c});return gt.set(a,l),l};function To(e){typeof e=="function"&&(Be=e)}const tr=new Map;function zo(e){if(!e||typeof e!="string")return"";let t=e.replace(/```[\s\S]*?```/g,"");return t=t.replace(/<pre[\s\S]*?<\/pre>/gi,""),t=t.replace(/<code[\s\S]*?<\/code>/gi,""),t=t.replace(/<!--([\s\S]*?)-->/g,""),t=t.replace(/^ {4,}.*$/gm,""),t=t.replace(/`[^`]*`/g,""),t}let re=[];function Ro(){return re}try{if(typeof window<"u")try{Object.defineProperty(window,"__nimbiSearchIndex",{get(){return re},enumerable:!0,configurable:!0})}catch{try{window.__nimbiSearchIndex=re}catch{}}}catch{}try{if(typeof window<"u")try{Object.defineProperty(window,"__nimbiIndexReady",{get(){return Ur},enumerable:!0,configurable:!0})}catch{try{window.__nimbiIndexReady=Ur}catch{}}}catch{}let It=null;async function Zt(e,t=1,n=void 0,i=void 0){const r=Array.isArray(n)?Array.from(new Set((n||[]).map(a=>J(String(a||""))))):[];try{const a=J(String(le||""));a&&!r.includes(a)&&r.push(a)}catch{}if(re&&re.length&&t===1&&!re.some(s=>{try{return r.includes(J(String(s.path||"")))}catch{return!1}}))return re;if(It)return It;It=(async()=>{let a=Array.isArray(n)?Array.from(new Set((n||[]).map(f=>J(String(f||""))))):[];try{const f=J(String(le||""));f&&!a.includes(f)&&a.push(f)}catch{}const s=f=>{if(!a||!a.length)return!1;for(const w of a)if(w&&(f===w||f.startsWith(w+"/")))return!0;return!1};let o=[];try{if(Array.isArray(i)&&i.length)for(const f of i)try{const w=J(String(f||""));w&&o.push(w)}catch{}}catch{}if(Array.isArray(Oe)&&Oe.length&&(o=Array.from(Oe)),!o.length){if(G&&typeof G.size=="number"&&G.size)try{o=Array.from(G.keys())}catch{o=[]}else for(const f of Y.values())if(f){if(typeof f=="string")o.push(f);else if(f&&typeof f=="object"){f.default&&o.push(f.default);const w=f.langs||{};for(const y of Object.keys(w||{}))try{w[y]&&o.push(w[y])}catch{}}}}try{const f=await Na(e);f&&f.length&&(o=o.concat(f))}catch(f){ge("[slugManager] crawlAllMarkdown during buildSearchIndex failed",f)}try{const f=new Set(o),w=[...o],y=Math.max(1,Math.min(Sn(),w.length||Sn()));let _=0;const b=async()=>{for(;!(f.size>jn);){const S=w.shift();if(!S)break;try{const E=await Be(S,e);if(E&&E.raw){if(E.status===404)continue;let I=E.raw;const O=[],W=String(S||"").replace(/^.*\//,"");if(/^readme(?:\.md)?$/i.test(W)&&ui&&(!S||!S.includes("/")))continue;const z=zo(I),B=/\[[^\]]+\]\(([^)]+)\)/g;let Z;for(;Z=B.exec(z);)O.push(Z[1]);const ee=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;Z=ee.exec(z);)O.push(Z[1]);const j=S&&S.includes("/")?S.substring(0,S.lastIndexOf("/")+1):"";for(let C of O)try{if(Bn(C,e)||C.startsWith("..")||C.indexOf("/../")!==-1||(j&&!C.startsWith("./")&&!C.startsWith("/")&&!C.startsWith("../")&&(C=j+C),C=J(C),!/\.(md|html?)(?:$|[?#])/i.test(C))||(C=C.split(/[?#]/)[0],s(C)))continue;f.has(C)||(f.add(C),w.push(C),o.push(C))}catch(N){ge("[slugManager] href processing failed",C,N)}}}catch(E){ge("[slugManager] discovery fetch failed for",S,E)}try{_++,await Pt(_,32)}catch{}}},A=[];for(let S=0;S<y;S++)A.push(b());await Promise.all(A)}catch(f){ge("[slugManager] discovery loop failed",f)}const l=new Set;o=o.filter(f=>!f||l.has(f)||s(f)?!1:(l.add(f),!0));const c=[],u=new Map,g=o.filter(f=>/\.(?:md|html?)(?:$|[?#])/i.test(f)),h=Math.max(1,Math.min(Sn(),g.length||1)),d=g.slice(),p=[];for(let f=0;f<h;f++)p.push((async()=>{for(;d.length;){const w=d.shift();if(!w)break;try{const y=await Be(w,e);u.set(w,y)}catch(y){ge("[slugManager] buildSearchIndex: entry fetch failed",w,y),u.set(w,null)}}})());await Promise.all(p);let m=0;for(const f of o){try{m++,await Pt(m,16)}catch{}if(/\.(?:md|html?)(?:$|[?#])/i.test(f))try{const w=u.get(f);if(!w||!w.raw||w.status===404)continue;let y="",_="",b=null;if(w.isHtml)try{const S=He(),E=S?S.parseFromString(w.raw,"text/html"):null,I=E?E.querySelector("title")||E.querySelector("h1"):null;I&&I.textContent&&(y=I.textContent.trim());const O=E?E.querySelector("p"):null;if(O&&O.textContent&&(_=O.textContent.trim()),t>=2)try{const W=E?E.querySelector("h1"):null,z=W&&W.textContent?W.textContent.trim():y||"";try{const Z=G&&typeof G.has=="function"&&G.has(f)?G.get(f):null;if(Z)b=Z;else{let ee=de(y||f);const j=new Set;try{for(const N of Y.keys())j.add(N)}catch{}try{for(const N of c)N&&N.slug&&j.add(String(N.slug).split("::")[0])}catch{}let C=!1;try{if(Y.has(ee)){const N=Y.get(ee);if(typeof N=="string")N===f&&(C=!0);else if(N&&typeof N=="object"){N.default===f&&(C=!0);for(const D of Object.keys(N.langs||{}))if(N.langs[D]===f){C=!0;break}}}}catch{}!C&&j.has(ee)&&(ee=Xt(ee,j)),b=ee;try{G.has(f)||rt(b,f)}catch{}}}catch(Z){ge("[slugManager] derive pageSlug failed",Z)}const B=Array.from(E.querySelectorAll("h2"));for(const Z of B)try{const ee=(Z.textContent||"").trim();if(!ee)continue;const j=Z.id?Z.id:de(ee),C=b?`${b}::${j}`:`${de(f)}::${j}`;let N="",D=Z.nextElementSibling;for(;D&&D.tagName&&D.tagName.toLowerCase()==="script";)D=D.nextElementSibling;D&&D.textContent&&(N=String(D.textContent).trim()),c.push({slug:C,title:ee,excerpt:N,path:f,parentTitle:z})}catch(ee){ge("[slugManager] indexing H2 failed",ee)}if(t===3)try{const Z=Array.from(E.querySelectorAll("h3"));for(const ee of Z)try{const j=(ee.textContent||"").trim();if(!j)continue;const C=ee.id?ee.id:de(j),N=b?`${b}::${C}`:`${de(f)}::${C}`;let D="",ie=ee.nextElementSibling;for(;ie&&ie.tagName&&ie.tagName.toLowerCase()==="script";)ie=ie.nextElementSibling;ie&&ie.textContent&&(D=String(ie.textContent).trim()),c.push({slug:N,title:j,excerpt:D,path:f,parentTitle:z})}catch(j){ge("[slugManager] indexing H3 failed",j)}}catch(Z){ge("[slugManager] collect H3s failed",Z)}}catch(W){ge("[slugManager] collect H2s failed",W)}}catch(S){ge("[slugManager] parsing HTML for index failed",S)}else{const S=w.raw,E=S.match(/^#\s+(.+)$/m);y=E?E[1].trim():"";try{y=er(y)}catch{}const I=S.split(/\r?\n\s*\r?\n/);if(I.length>1)for(let O=1;O<I.length;O++){const W=I[O].trim();if(W&&!/^#/.test(W)){_=W.replace(/\r?\n/g," ");break}}if(t>=2){let O="";try{const W=(S.match(/^#\s+(.+)$/m)||[])[1];O=W?W.trim():"";try{const Z=G&&typeof G.has=="function"&&G.has(f)?G.get(f):null;if(Z)b=Z;else{let ee=de(y||f);const j=new Set;try{for(const N of Y.keys())j.add(N)}catch{}try{for(const N of c)N&&N.slug&&j.add(String(N.slug).split("::")[0])}catch{}let C=!1;try{if(Y.has(ee)){const N=Y.get(ee);if(typeof N=="string")N===f&&(C=!0);else if(N&&typeof N=="object"){N.default===f&&(C=!0);for(const D of Object.keys(N.langs||{}))if(N.langs[D]===f){C=!0;break}}}}catch{}!C&&j.has(ee)&&(ee=Xt(ee,j)),b=ee;try{G.has(f)||rt(b,f)}catch{}}}catch(Z){ge("[slugManager] derive pageSlug failed",Z)}const z=/^##\s+(.+)$/gm;let B;for(;B=z.exec(S);)try{const Z=(B[1]||"").trim(),ee=er(Z);if(!Z)continue;const j=de(Z),C=b?`${b}::${j}`:`${de(f)}::${j}`,D=S.slice(z.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),ie=D&&D[1]?String(D[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";c.push({slug:C,title:ee,excerpt:ie,path:f,parentTitle:O})}catch(Z){ge("[slugManager] indexing markdown H2 failed",Z)}}catch(W){ge("[slugManager] collect markdown H2s failed",W)}if(t===3)try{const W=/^###\s+(.+)$/gm;let z;for(;z=W.exec(S);)try{const B=(z[1]||"").trim(),Z=er(B);if(!B)continue;const ee=de(B),j=b?`${b}::${ee}`:`${de(f)}::${ee}`,N=S.slice(W.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),D=N&&N[1]?String(N[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";c.push({slug:j,title:Z,excerpt:D,path:f,parentTitle:O})}catch(B){ge("[slugManager] indexing markdown H3 failed",B)}}catch(W){ge("[slugManager] collect markdown H3s failed",W)}}}let A="";try{G.has(f)&&(A=G.get(f))}catch(S){ge("[slugManager] mdToSlug access failed",S)}if(!A){try{if(!b){const S=G&&typeof G.has=="function"&&G.has(f)?G.get(f):null;if(S)b=S;else{let E=de(y||f);const I=new Set;try{for(const W of Y.keys())I.add(W)}catch{}try{for(const W of c)W&&W.slug&&I.add(String(W.slug).split("::")[0])}catch{}let O=!1;try{if(Y.has(E)){const W=Y.get(E);if(typeof W=="string")W===f&&(O=!0);else if(W&&typeof W=="object"){W.default===f&&(O=!0);for(const z of Object.keys(W.langs||{}))if(W.langs[z]===f){O=!0;break}}}}catch{}!O&&I.has(E)&&(E=Xt(E,I)),b=E;try{G.has(f)||rt(b,f)}catch{}}}}catch(S){ge("[slugManager] derive pageSlug failed",S)}A=b||de(y||f)}c.push({slug:A,title:y,excerpt:_,path:f})}catch(w){ge("[slugManager] buildSearchIndex: entry processing failed",w)}}try{const f=c.filter(w=>{try{return!s(String(w.path||""))}catch{return!0}});try{Array.isArray(re)||(re=[]),re.length=0;for(const w of f)re.push(w)}catch{try{re=Array.from(f)}catch{re=f}}try{if(typeof window<"u"){try{window.__nimbiResolvedIndex=re}catch{}try{const w=[],y=new Set;for(const _ of re)try{if(!_||!_.slug)continue;const b=String(_.slug).split("::")[0];if(y.has(b))continue;y.add(b);const A={slug:b};_.title?A.title=String(_.title):_.parentTitle&&(A.title=String(_.parentTitle)),_.path&&(A.path=String(_.path)),w.push(A)}catch{}try{window.__nimbiSitemapJson={generatedAt:new Date().toISOString(),entries:w}}catch{}try{window.__nimbiSitemapFinal=w}catch{}}catch{}}}catch{}}catch(f){ge("[slugManager] filtering index by excludes failed",f);try{Array.isArray(re)||(re=[]),re.length=0;for(const w of c)re.push(w)}catch{try{re=Array.from(c)}catch{re=c}}try{if(typeof window<"u")try{window.__nimbiResolvedIndex=re}catch{}}catch{}}return re})();try{await It}catch(a){ge("[slugManager] awaiting _indexPromise failed",a)}return It=null,re}async function Bt(e={}){try{const t=typeof e.timeoutMs=="number"?e.timeoutMs:8e3,n=e.contentBase,i=typeof e.indexDepth=="number"?e.indexDepth:1,r=Array.isArray(e.noIndexing)?e.noIndexing:void 0,a=Array.isArray(e.seedPaths)?e.seedPaths:void 0,s=typeof e.startBuild=="boolean"?e.startBuild:!0;if(Array.isArray(re)&&re.length&&!It&&!s)return re;if(It){try{await It}catch{}return re}if(s){try{if(typeof Hr=="function")try{const l=await Hr(n,i,r,a);if(Array.isArray(l)&&l.length){try{Ta(l)}catch{}return re}}catch{}}catch{}try{return await Zt(n,i,r,a),re}catch{}}const o=Date.now();for(;Date.now()-o<t;){if(Array.isArray(re)&&re.length)return re;await new Promise(l=>setTimeout(l,150))}return re}catch{return re}}async function Ur(e={}){try{const t=Object.assign({},e);typeof t.startBuild!="boolean"&&(t.startBuild=!0),typeof t.timeoutMs!="number"&&(t.timeoutMs=1/0);try{return await Bt(t)}catch{return re}}catch{return re}}const Ra=1e3;let jn=Ra;function $o(e){typeof e=="number"&&e>=0&&(jn=e)}const $a=He(),Pa="a[href]";let Ia=async function(e,t,n=jn){if(tr.has(e))return tr.get(e);let i=null;const r=new Set,a=[""],s=typeof location<"u"&&location.origin?location.origin:"http://localhost";let o=s+"/";try{t&&(/^[a-z][a-z0-9+.-]*:/i.test(String(t))?o=String(t).replace(/\/$/,"")+"/":String(t).startsWith("/")?o=s+String(t).replace(/\/$/,"")+"/":o=s+"/"+String(t).replace(/\/$/,"")+"/")}catch{o=s+"/"}const l=Math.max(1,Math.min(mr,6));for(;a.length&&!i&&!(a.length>n);){const c=a.splice(0,l);await Rn(c,async u=>{if(u==null||r.has(u))return;r.add(u);let g="";try{g=new URL(u||"",o).toString()}catch{g=(String(t||"")||s)+"/"+String(u||"").replace(/^\//,"")}try{let h;try{h=await globalThis.fetch(g)}catch(w){ge("[slugManager] crawlForSlug: fetch failed",{url:g,error:w});return}if(!h||!h.ok){h&&!h.ok&&ge("[slugManager] crawlForSlug: directory fetch non-ok",{url:g,status:h.status});return}const d=await h.text(),p=$a.parseFromString(d,"text/html");let m=[];try{p&&typeof p.getElementsByTagName=="function"?m=p.getElementsByTagName("a"):p&&typeof p.querySelectorAll=="function"?m=p.querySelectorAll(Pa):m=[]}catch{try{m=p.getElementsByTagName?p.getElementsByTagName("a"):[]}catch{m=[]}}const f=g;for(const w of m)try{if(i)break;let y=w.getAttribute("href")||"";if(!y||Bn(y,t)||y.startsWith("..")||y.indexOf("/../")!==-1)continue;if(y.endsWith("/")){try{const _=new URL(y,f),b=new URL(o).pathname,A=_.pathname.startsWith(b)?_.pathname.slice(b.length):_.pathname.replace(/^\//,""),S=Yt(J(A));r.has(S)||a.push(S)}catch{const b=J(u+y);r.has(b)||a.push(b)}continue}if(y.toLowerCase().endsWith(".md")){let _="";try{const b=new URL(y,f),A=new URL(o).pathname;_=b.pathname.startsWith(A)?b.pathname.slice(A.length):b.pathname.replace(/^\//,"")}catch{_=(u+y).replace(/^\//,"")}_=J(_);try{if(G.has(_))continue;for(const b of Y.values());}catch(b){ge("[slugManager] slug map access failed",b)}try{const b=await Be(_,t);if(b&&b.raw){const A=(b.raw||"").match(/^#\s+(.+)$/m);if(A&&A[1]&&de(A[1].trim())===e){i=_;break}}}catch(b){ge("[slugManager] crawlForSlug: fetchMarkdown failed",b)}}}catch(y){ge("[slugManager] crawlForSlug: link iteration failed",y)}}catch(h){ge("[slugManager] crawlForSlug: directory fetch failed",h)}},l)}return tr.set(e,i),i};async function Na(e,t=jn){const n=new Set,i=new Set,r=[""],a=typeof location<"u"&&location.origin?location.origin:"http://localhost";let s=a+"/";try{e&&(/^[a-z][a-z0-9+.-]*:/i.test(String(e))?s=String(e).replace(/\/$/,"")+"/":String(e).startsWith("/")?s=a+String(e).replace(/\/$/,"")+"/":s=a+"/"+String(e).replace(/\/$/,"")+"/")}catch{s=a+"/"}const o=Math.max(1,Math.min(mr,6));for(;r.length&&!(r.length>t);){const l=r.splice(0,o);await Rn(l,async c=>{if(c==null||i.has(c))return;i.add(c);let u="";try{u=new URL(c||"",s).toString()}catch{u=(String(e||"")||a)+"/"+String(c||"").replace(/^\//,"")}try{let g;try{g=await globalThis.fetch(u)}catch(f){ge("[slugManager] crawlAllMarkdown: fetch failed",{url:u,error:f});return}if(!g||!g.ok){g&&!g.ok&&ge("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:u,status:g.status});return}const h=await g.text(),d=$a.parseFromString(h,"text/html");let p=[];try{d&&typeof d.getElementsByTagName=="function"?p=d.getElementsByTagName("a"):d&&typeof d.querySelectorAll=="function"?p=d.querySelectorAll(Pa):p=[]}catch{try{p=d.getElementsByTagName?d.getElementsByTagName("a"):[]}catch{p=[]}}const m=u;for(const f of p)try{let w=f.getAttribute("href")||"";if(!w||Bn(w,e)||w.startsWith("..")||w.indexOf("/../")!==-1)continue;if(w.endsWith("/")){try{const _=new URL(w,m),b=new URL(s).pathname,A=_.pathname.startsWith(b)?_.pathname.slice(b.length):_.pathname.replace(/^\//,""),S=Yt(J(A));i.has(S)||r.push(S)}catch{const b=c+w;i.has(b)||r.push(b)}continue}let y="";try{const _=new URL(w,m),b=new URL(s).pathname;y=_.pathname.startsWith(b)?_.pathname.slice(b.length):_.pathname.replace(/^\//,"")}catch{y=(c+w).replace(/^\//,"")}y=J(y),/\.(md|html?)$/i.test(y)&&n.add(y)}catch(w){ge("[slugManager] crawlAllMarkdown: link iteration failed",w)}}catch(g){ge("[slugManager] crawlAllMarkdown: directory fetch failed",g)}},o)}return Array.from(n)}async function Oa(e,t,n){if(e&&typeof e=="string"&&(e=J(e),e=cn(e)),Y.has(e))return un(e)||Y.get(e);try{if(!(typeof le=="string"&&le||Y.has(e)||$e&&$e.size||Qt._refreshed||typeof t=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(t)))return null}catch{}for(const r of yr)try{const a=await r(e,t);if(a)return rt(e,a),a}catch(a){ge("[slugManager] slug resolver failed",a)}if($e&&$e.size){if(xn.has(e)){const r=xn.get(e);return rt(e,r),r}for(const r of Oe)if(!ur.has(r))try{const a=await Be(r,t);if(a&&a.raw){const s=(a.raw||"").match(/^#\s+(.+)$/m);if(s&&s[1]){const o=de(s[1].trim());if(ur.add(r),o&&xn.set(o,r),o===e)return rt(e,r),r}}}catch(a){ge("[slugManager] manifest title fetch failed",a)}try{crawlBatchYieldCount++,await Pt(crawlBatchYieldCount,8)}catch{}}try{const r=await Zt(t);if(r&&r.length){const a=r.find(s=>s.slug===e);if(a)return rt(e,a.path),a.path}}catch(r){ge("[slugManager] buildSearchIndex lookup failed",r)}try{const r=await Ia(e,t,n);if(r)return rt(e,r),r}catch(r){ge("[slugManager] crawlForSlug lookup failed",r)}const i=[`${e}.html`,`${e}.md`];for(const r of i)try{const a=await Be(r,t);if(a&&a.raw)return rt(e,r),r}catch(a){ge("[slugManager] candidate fetch failed",a)}if($e&&$e.size)for(const r of Oe)try{const a=r.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(de(a)===e)return rt(e,r),r}catch(a){ge("[slugManager] build-time filename match failed",a)}try{if(ot&&typeof ot=="string"&&ot.trim())try{const r=await Be(ot,t);if(r&&r.raw){const a=(r.raw||"").match(/^#\s+(.+)$/m);if(a&&a[1]&&de(a[1].trim())===e)return rt(e,ot),ot}}catch(r){ge("[slugManager] home page fetch failed",r)}}catch(r){ge("[slugManager] home page fetch failed",r)}return null}const at=Object.freeze(Object.defineProperty({__proto__:null,CRAWL_MAX_QUEUE:Ra,HOME_SLUG:Ot,_setAllMd:_o,_setSearchIndex:Ta,_storeSlugMapping:rt,addSlugResolver:bo,get allMarkdownPaths(){return Oe},allMarkdownPathsSet:$e,get availableLanguages(){return st},awaitSearchIndex:Ur,buildSearchIndex:Zt,buildSearchIndexWorker:Hr,clearFetchCache:vo,clearListCaches:ko,crawlAllMarkdown:Na,crawlCache:tr,crawlForSlug:Ia,crawlForSlugWorker:yo,get defaultCrawlMaxQueue(){return jn},ensureSlug:Oa,fetchCache:gt,get fetchMarkdown(){return Be},getFetchConcurrency:Sn,getLanguages:go,getSearchIndex:Ro,get homePage(){return ot},initSlugWorker:mo,isExternalLink:So,isExternalLinkWithBase:Bn,listPathsFetched:ur,listSlugCache:xn,mdToSlug:G,negativeFetchCache:Ht,get notFoundPage(){return le},removeSlugResolver:wo,resolveSlugPath:un,get searchIndex(){return re},setContentBase:hi,setDefaultCrawlMaxQueue:$o,setFetchCacheMaxSize:Eo,setFetchCacheTTL:Co,setFetchConcurrency:Lo,setFetchMarkdown:To,setFetchNegativeCacheTTL:Ao,setHomePage:La,setLanguages:Aa,setNegativeFetchCacheMaxSize:Mo,setNotFoundPage:Ma,setSkipRootReadme:fo,get skipRootReadme(){return ui},slugResolvers:yr,slugToMd:Y,slugify:de,unescapeMarkdown:er,uniqueSlug:Xt,watchForColdHashRoute:Jn,whenSearchIndexReady:Bt},Symbol.toStringTag,{value:"Module"}));var $r,Qi;function Po(){if(Qi)return $r;Qi=1;function e(a,s){return s.some(([o,l])=>o<=a&&a<=l)}function t(a){if(typeof a!="string")return!1;const s=a.charCodeAt(0);return e(s,[[12352,12447],[19968,40959],[44032,55203],[131072,191456]])}function n(a){return` 
\r	`.includes(a)}function i(a){if(typeof a!="string")return!1;const s=a.charCodeAt(0);return e(s,[[33,47],[58,64],[91,96],[123,126],[12288,12351],[65280,65519]])}function r(a,s={}){let o=0,l=0,c=a.length-1;const u=s.wordsPerMinute||200,g=s.wordBound||n;for(;g(a[l]);)l++;for(;g(a[c]);)c--;const h=`${a}
`;for(let f=l;f<=c;f++)if((t(h[f])||!g(h[f])&&(g(h[f+1])||t(h[f+1])))&&o++,t(h[f]))for(;f<=c&&(i(h[f+1])||g(h[f+1]));)f++;const d=o/u,p=Math.round(d*60*1e3);return{text:Math.ceil(d.toFixed(2))+" min read",minutes:d,time:p,words:o}}return $r=r,$r}var Io=Po();const No=ma(Io),_n=new Map,Oo=200;function Bo(e){return String(e||"")}function jo(e,t){if(_n.set(e,t),_n.size>Oo){const n=_n.keys().next().value;n&&_n.delete(n)}}function qo(e){return e?String(e).trim().split(/\s+/).filter(Boolean).length:0}function Ho(e){const t=Bo(e),n=_n.get(t);if(n)return Object.assign({},n);const i=No(e||""),r=typeof i.words=="number"?i.words:qo(e),a={readingTime:i,wordCount:r};return jo(t,a),Object.assign({},a)}function $n(e,t){let n=document.querySelector(`meta[name="${e}"]`);n||(n=document.createElement("meta"),n.setAttribute("name",e),document.head.appendChild(n)),n.setAttribute("content",t)}function Rt(e,t,n){let i=`meta[${e}="${t}"]`,r=document.querySelector(i);r||(r=document.createElement("meta"),r.setAttribute(e,t),document.head.appendChild(r)),r.setAttribute("content",n)}function Ba(e,t){try{let n=document.querySelector(`link[rel="${e}"]`);n||(n=document.createElement("link"),n.setAttribute("rel",e),document.head.appendChild(n)),n.setAttribute("href",t)}catch(n){k("[seoManager] upsertLinkRel failed",n)}}function Fo(e,t,n,i){const r=t&&String(t).trim()?t:e.title||document.title;Rt("property","og:title",r);const a=i&&String(i).trim()?i:e.description||"";a&&String(a).trim()&&Rt("property","og:description",a),a&&String(a).trim()&&Rt("name","twitter:description",a),Rt("name","twitter:card",e.twitter_card||"summary_large_image");const s=n||e.image;s&&(Rt("property","og:image",s),Rt("name","twitter:image",s))}function di(e,t,n,i,r=""){const a=e.meta||{},s=document&&document.querySelector&&document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",o=i&&String(i).trim()?i:a.description&&String(a.description).trim()?a.description:s&&String(s).trim()?s:"";o&&String(o).trim()&&$n("description",o),$n("robots",a.robots||"index,follow"),Fo(a,t,n,o)}function Do(){try{const e=['meta[name="site"]','meta[name="site-name"]','meta[name="siteName"]','meta[property="og:site_name"]','meta[name="twitter:site"]'];for(const t of e){const n=document.querySelector(t);if(n){const i=n.getAttribute("content")||"";if(i&&i.trim())return i.trim()}}}catch(e){k("[seoManager] getSiteNameFromMeta failed",e)}return""}function fi(e,t,n,i,r,a=""){try{const s=e.meta||{},o=n&&String(n).trim()?n:s.title||a||document.title,l=r&&String(r).trim()?r:s.description||document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",c=i||s.image||null;let u="";try{if(t){const p=J(t);try{u=(location.origin+location.pathname).split("?")[0]+"?page="+encodeURIComponent(p)}catch{u=location.href.split("#")[0]}}else u=location.href.split("#")[0]}catch(p){u=location.href.split("#")[0],k("[seoManager] compute canonical failed",p)}u&&Ba("canonical",u);try{Rt("property","og:url",u)}catch(p){k("[seoManager] upsertMeta og:url failed",p)}const g={"@context":"https://schema.org","@type":"Article",headline:o||"",description:l||"",url:u||location.href.split("#")[0]};c&&(g.image=String(c)),s.date&&(g.datePublished=s.date),s.dateModified&&(g.dateModified=s.dateModified);const h="nimbi-jsonld";let d=document.getElementById(h);d||(d=document.createElement("script"),d.type="application/ld+json",d.id=h,document.head.appendChild(d)),d.textContent=JSON.stringify(g,null,2)}catch(s){k("[seoManager] setStructuredData failed",s)}}let vn=typeof window<"u"&&window.__SEO_MAP?window.__SEO_MAP:{};function Uo(e){try{if(!e||typeof e!="object"){vn={};return}vn=Object.assign({},e)}catch(t){k("[seoManager] setSeoMap failed",t)}}function Wo(e,t=""){try{if(!e)return;const n=vn&&vn[e]?vn[e]:typeof window<"u"&&window.__SEO_MAP&&window.__SEO_MAP[e]?window.__SEO_MAP[e]:null;try{const i=location.origin+location.pathname+"?page="+encodeURIComponent(String(e||""));Ba("canonical",i);try{Rt("property","og:url",i)}catch{}}catch{}if(!n)return;try{n.title&&(document.title=String(n.title))}catch{}try{n.description&&$n("description",String(n.description))}catch{}try{try{di({meta:n},n.title||void 0,n.image||void 0,n.description||void 0,t)}catch{}}catch{}try{fi({meta:n},e,n.title||void 0,n.image||void 0,n.description||void 0,t)}catch(i){k("[seoManager] inject structured data failed",i)}}catch(n){k("[seoManager] injectSeoForPage failed",n)}}function nr(e={},t="",n=void 0,i=void 0){try{const r=e||{},a=typeof n=="string"&&n.trim()?n:r.title||"Not Found",s=typeof i=="string"&&i.trim()?i:r.description||"";try{$n("robots","noindex,follow")}catch{}try{s&&String(s).trim()&&$n("description",String(s))}catch{}try{di({meta:Object.assign({},r,{robots:"noindex,follow"})},a,r.image||void 0,s)}catch{}try{fi({meta:Object.assign({},r,{title:a,description:s})},t||"",a,r.image||void 0,s)}catch{}}catch(r){k("[seoManager] markNotFound failed",r)}}function Zo(e,t,n,i,r,a,s,o,l,c,u){try{if(i&&i.querySelector){const g=i.querySelector(".menu-label");g&&(g.textContent=o&&o.textContent||e("onThisPage"))}}catch(g){k("[seoManager] update toc label failed",g)}try{const g=n.meta&&n.meta.title?String(n.meta.title).trim():"",h=r.querySelector("img"),d=h&&(h.getAttribute("src")||h.src)||null;let p="";try{let w="";try{const y=o||(r&&r.querySelector?r.querySelector("h1"):null);if(y){let _=y.nextElementSibling;const b=[];for(;_&&!(_.tagName&&_.tagName.toLowerCase()==="h2");){try{if(_.classList&&_.classList.contains("nimbi-article-subtitle")){_=_.nextElementSibling;continue}}catch{}const A=(_.textContent||"").trim();A&&b.push(A),_=_.nextElementSibling}b.length&&(w=b.join(" ").replace(/\s+/g," ").trim()),!w&&l&&(w=String(l).trim())}}catch(y){k("[seoManager] compute descOverride failed",y)}w&&String(w).length>160&&(w=String(w).slice(0,157).trim()+"..."),p=w}catch(w){k("[seoManager] compute descOverride failed",w)}let m="";try{g&&(m=g)}catch{}if(!m)try{o&&o.textContent&&(m=String(o.textContent).trim())}catch{}if(!m)try{const w=r.querySelector("h2");w&&w.textContent&&(m=String(w.textContent).trim())}catch{}m||(m=a||"");try{di(n,m||void 0,d,p)}catch(w){k("[seoManager] setMetaTags failed",w)}try{fi(n,c,m||void 0,d,p,t)}catch(w){k("[seoManager] setStructuredData failed",w)}const f=Do();m?f?document.title=`${f} - ${m}`:document.title=`${t||"Site"} - ${m}`:g?document.title=g:document.title=t||document.title}catch(g){k("[seoManager] applyPageMeta failed",g)}try{try{const g=r.querySelectorAll(".nimbi-reading-time");g&&g.forEach(h=>h.remove())}catch{}if(l){const g=Ho(u.raw||""),h=g&&g.readingTime?g.readingTime:null,d=h&&typeof h.minutes=="number"?Math.ceil(h.minutes):0,p=d?e("readingTime",{minutes:d}):"";if(!p)return;const m=r.querySelector("h1");if(m){const f=r.querySelector(".nimbi-article-subtitle");try{if(f){const w=document.createElement("span");w.className="nimbi-reading-time",w.textContent=p,f.appendChild(w)}else{const w=document.createElement("p");w.className="nimbi-article-subtitle is-6 has-text-grey-light";const y=document.createElement("span");y.className="nimbi-reading-time",y.textContent=p,w.appendChild(y);try{m.parentElement.insertBefore(w,m.nextSibling)}catch{try{m.insertAdjacentElement("afterend",w)}catch{}}}}catch{try{const y=document.createElement("p");y.className="nimbi-article-subtitle is-6 has-text-grey-light";const _=document.createElement("span");_.className="nimbi-reading-time",_.textContent=p,y.appendChild(_),m.insertAdjacentElement("afterend",y)}catch{}}}}}catch(g){k("[seoManager] reading time update failed",g)}}let ja=100;function Xi(e){ja=e}function ut(){try{if(tn(2))return!0}catch{}try{return!1}catch{return!1}}let An=300*1e3,mn=null;function ht(e,t,n){try{if(typeof Be=="function"&&typeof Be.length=="number"&&Be.length>=3)return Be(e,t,{signal:n})}catch{}return Be(e,t)}function Ki(e){An=e}const yt=new Map;function Go(e){if(!yt.has(e))return;const t=yt.get(e),n=Date.now();if(t.ts+An<n){yt.delete(e);return}return yt.delete(e),yt.set(e,t),t.value}function Qo(e,t){if(Vi(),Vi(),yt.delete(e),yt.set(e,{value:t,ts:Date.now()}),yt.size>ja){const n=yt.keys().next().value;n!==void 0&&yt.delete(n)}}function Vi(){if(!An||An<=0)return;const e=Date.now();for(const[t,n]of yt.entries())n.ts+An<e&&yt.delete(t)}async function Xo(e,t,n){const i=new Set(it);let r=[];try{if(typeof document<"u"&&document.getElementsByClassName){const a=s=>{const o=document.getElementsByClassName(s);for(let l=0;l<o.length;l++){const c=o[l].getElementsByTagName("a");for(let u=0;u<c.length;u++)r.push(c[u])}};a("nimbi-site-navbar"),a("navbar"),a("nimbi-nav")}else r=Array.from(document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a"))}catch{try{r=Array.from(document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a"))}catch{r=[]}}for(const a of Array.from(r||[])){const s=a.getAttribute("href")||"";if(s)try{try{const h=Je(s);if(h){if(h.type==="canonical"&&h.page){const d=J(h.page);if(d){i.add(d);continue}}if(h.type==="cosmetic"&&h.page){const d=h.page;if(Y.has(d)){const p=Y.get(d);if(p)return p}continue}}}catch{}const o=new URL(s,location.href);if(o.origin!==location.origin)continue;const l=(o.hash||o.pathname).match(/([^#?]+\.md)(?:$|[?#])/)||(o.pathname||"").match(/([^#?]+\.md)(?:$|[?#])/);if(l){let h=J(l[1]);h&&i.add(h);continue}const c=(a.textContent||"").trim(),u=(o.pathname||"").replace(/^.*\//,"");if(c&&de(c)===e||u&&de(u.replace(/\.(html?|md)$/i,""))===e)return o.toString();if(/\.(html?)$/i.test(o.pathname)){let h=o.pathname.replace(/^\//,"");i.add(h);continue}const g=o.pathname||"";if(g){const h=new URL(t),d=Yt(h.pathname);if(g.indexOf(d)!==-1){let p=g.startsWith(d)?g.slice(d.length):g;p=J(p),p&&i.add(p)}}}catch(o){k("[router] malformed URL while discovering index candidates",o)}}for(const a of i)try{if(!a||!String(a).includes(".md"))continue;const s=await ht(a,t,n);if(!s||!s.raw)continue;const o=(s.raw||"").match(/^#\s+(.+)$/m);if(o){const l=(o[1]||"").trim();if(l&&de(l)===e)return a}}catch(s){k("[router] fetchMarkdown during index discovery failed",s)}return null}function Ko(e){const t=[];if(String(e).includes(".md")||String(e).includes(".html"))/index\.html$/i.test(e)||t.push(e);else try{const n=decodeURIComponent(String(e||""));if(Y.has(n)){const i=un(n)||Y.get(n);i&&(/\.(md|html?)$/i.test(i)?/index\.html$/i.test(i)||t.push(i):(t.push(i),t.push(i+".html")))}else{if(it&&it.size)for(const i of it){const r=i.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(de(r)===n&&!/index\.html$/i.test(i)){t.push(i);break}}!t.length&&n&&!/\.(md|html?)$/i.test(n)&&(t.push(n+".html"),t.push(n+".md"))}}catch(n){k("[router] buildPageCandidates failed during slug handling",n)}return t}async function Vo(e,t){const n=e||"";try{try{ga("fetchPageData")}catch{}try{pa("fetchPageData")}catch{}}catch{}try{if(mn&&typeof mn.abort=="function")try{mn.abort()}catch{}}catch{}mn=typeof AbortController<"u"?new AbortController:null;const i=mn;let r=null;try{const y=Je(typeof location<"u"?location.href:"");y&&y.anchor&&(r=y.anchor)}catch{try{r=location&&location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null}catch{r=null}}let a=e||"";try{(!a||String(a).trim()==="")&&typeof ot=="string"&&ot&&(a=String(ot))}catch{}let s=null;const o=String(n||"").includes(".md")||String(n||"").includes(".html");if(a&&String(a).includes("::")){const y=String(a).split("::",2);a=y[0],s=y[1]||null}const c=`${e}|||${typeof ro<"u"&&qt?qt:""}`,u=Go(c);if(u)a=u.resolved,s=u.anchor||s;else{if(!String(a).includes(".md")&&!String(a).includes(".html")){let y=decodeURIComponent(String(a||""));if(y&&typeof y=="string"&&(y=J(y),y=cn(y)),Y.has(y))a=un(y)||Y.get(y);else{let _=await Xo(y,t,i?i.signal:void 0);if(_)a=_;else if(Qt._refreshed&&it&&it.size||typeof t=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(t)){const b=await Oa(y,t);b&&(a=b)}}}Qo(c,{resolved:a,anchor:s})}let g=!0;try{const y=String(a||"").includes(".md")||String(a||"").includes(".html")||a&&(a.startsWith("http://")||a.startsWith("https://")||a.startsWith("/"));g=typeof le=="string"&&le||Y.has(a)||it&&it.size||Qt._refreshed||o||y}catch{g=!0}!s&&r&&(s=r);try{if(g&&a&&(a.startsWith("http://")||a.startsWith("https://")||a.startsWith("/"))){const y=a.startsWith("/")?new URL(a,location.origin).toString():a;try{const _=await fetch(y,i?{signal:i.signal}:void 0);if(_&&_.ok){const b=await _.text(),A=_&&_.headers&&typeof _.headers.get=="function"&&_.headers.get("content-type")||"",S=(b||"").toLowerCase();if(A&&A.indexOf&&A.indexOf("text/html")!==-1||S.indexOf("<!doctype")!==-1||S.indexOf("<html")!==-1){if(!o)try{let O=y;try{O=new URL(y).pathname.replace(/^\//,"")}catch{O=String(y||"").replace(/^\//,"")}const W=O.replace(/\.html$/i,".md");try{const z=await ht(W,t,i?i.signal:void 0);if(z&&z.raw)return{data:z,pagePath:W,anchor:s}}catch{}if(typeof le=="string"&&le)try{const z=await ht(le,t,i?i.signal:void 0);if(z&&z.raw){try{nr(z.meta||{},le)}catch{}return{data:z,pagePath:le,anchor:s}}}catch{}try{w=new Error("site shell detected (absolute fetch)")}catch{}}catch{}if(S.indexOf('<div id="app"')!==-1||S.indexOf("nimbi-cms")!==-1||S.indexOf("nimbi-mount")!==-1||S.indexOf("nimbi-")!==-1||S.indexOf("initcms(")!==-1||S.indexOf("window.nimbi")!==-1||/\bnimbi\b/.test(S))try{let O=y;try{O=new URL(y).pathname.replace(/^\//,"")}catch{O=String(y||"").replace(/^\//,"")}const W=O.replace(/\.html$/i,".md");try{const z=await ht(W,t,i?i.signal:void 0);if(z&&z.raw)return{data:z,pagePath:W,anchor:s}}catch{}if(typeof le=="string"&&le)try{const z=await ht(le,t,i?i.signal:void 0);if(z&&z.raw){try{nr(z.meta||{},le)}catch{}return{data:z,pagePath:le,anchor:s}}}catch{}try{w=new Error("site shell detected (absolute fetch)")}catch{}}catch{}}}}catch{}}}catch{}const h=Ko(a);try{if(ut())try{jt("[router-debug] fetchPageData candidates",{originalRaw:n,resolved:a,pageCandidates:h})}catch{}}catch{}const d=String(n||"").includes(".md")||String(n||"").includes(".html");let p=null;if(!d)try{let y=decodeURIComponent(String(n||""));y=J(y),y=cn(y),y&&!/\.(md|html?)$/i.test(y)&&(p=y)}catch{p=null}if(d&&h.length===0&&(String(a).includes(".md")||String(a).includes(".html"))&&h.push(a),h.length===0&&(String(a).includes(".md")||String(a).includes(".html"))&&h.push(a),h.length===1&&/index\.html$/i.test(h[0])&&!d&&!Y.has(a)&&!Y.has(decodeURIComponent(String(a||"")))&&!String(a||"").includes("/"))throw new Error("Unknown slug: index.html fallback prevented");let m=null,f=null,w=null;try{const y=String(a||"").includes(".md")||String(a||"").includes(".html")||a&&(a.startsWith("http://")||a.startsWith("https://")||a.startsWith("/"));g=typeof le=="string"&&le||Y.has(a)||it&&it.size||Qt._refreshed||d||y}catch{g=!0}if(!g)w=new Error("no page data");else for(const y of h)if(y)try{const _=J(y);if(m=await ht(_,t,i?i.signal:void 0),f=_,p&&!Y.has(p))try{let b="";if(m&&m.isHtml)try{const A=He();if(A){const S=A.parseFromString(m.raw||"","text/html"),E=S.querySelector("h1")||S.querySelector("title");E&&E.textContent&&(b=E.textContent.trim())}}catch{}else{const A=(m&&m.raw||"").match(/^#\s+(.+)$/m);A&&A[1]&&(b=A[1].trim())}if(b&&de(b)!==p)try{if(/\.html$/i.test(_)){const S=_.replace(/\.html$/i,".md");if(h.includes(S))try{const E=await ht(S,t,i?i.signal:void 0);if(E&&E.raw)m=E,f=S;else if(typeof le=="string"&&le)try{const I=await ht(le,t,i?i.signal:void 0);if(I&&I.raw)m=I,f=le;else{m=null,f=null,w=new Error("slug mismatch for candidate");continue}}catch{m=null,f=null,w=new Error("slug mismatch for candidate");continue}else{m=null,f=null,w=new Error("slug mismatch for candidate");continue}}catch{try{const I=await ht(le,t,i?i.signal:void 0);if(I&&I.raw)m=I,f=le;else{m=null,f=null,w=new Error("slug mismatch for candidate");continue}}catch{m=null,f=null,w=new Error("slug mismatch for candidate");continue}}else{m=null,f=null,w=new Error("slug mismatch for candidate");continue}}else{m=null,f=null,w=new Error("slug mismatch for candidate");continue}}catch{m=null,f=null,w=new Error("slug mismatch for candidate");continue}}catch{}try{if(!d&&/\.html$/i.test(_)){const b=_.replace(/\.html$/i,".md");if(h.includes(b))try{const S=String(m&&m.raw||"").trim().slice(0,128).toLowerCase();if(m&&m.isHtml||/^(?:<!doctype|<html|<title|<h1)/i.test(S)||S.indexOf('<div id="app"')!==-1||S.indexOf("nimbi-")!==-1||S.indexOf("nimbi")!==-1||S.indexOf("initcms(")!==-1){let I=!1;try{const O=await ht(b,t,i?i.signal:void 0);if(O&&O.raw)m=O,f=b,I=!0;else if(typeof le=="string"&&le)try{const W=await ht(le,t,i?i.signal:void 0);W&&W.raw&&(m=W,f=le,I=!0)}catch{}}catch{try{const W=await ht(le,t,i?i.signal:void 0);W&&W.raw&&(m=W,f=le,I=!0)}catch{}}if(!I){m=null,f=null,w=new Error("site shell detected (candidate HTML rejected)");continue}}}catch{}}}catch{}try{if(ut())try{jt("[router-debug] fetchPageData accepted candidate",{candidate:_,pagePath:f,isHtml:m&&m.isHtml,snippet:m&&m.raw?String(m.raw).slice(0,160):null})}catch{}}catch{}break}catch(_){w=_;try{ut()&&k("[router] candidate fetch failed",{candidate:y,contentBase:t,err:_&&_.message||_})}catch{}}if(!m){const y=w&&(w.message||String(w))||null,_=y&&/failed to fetch md|site shell detected/i.test(y);try{if(ut())try{jt("[router-debug] fetchPageData no data",{originalRaw:n,resolved:a,pageCandidates:h,fetchError:y})}catch{}}catch{}if(_)try{if(ut())try{k("[router] fetchPageData: no page data (expected)",{originalRaw:n,resolved:a,pageCandidates:h,contentBase:t,fetchError:y})}catch{}}catch{}else try{if(ut())try{sr("[router] fetchPageData: no page data for",{originalRaw:n,resolved:a,pageCandidates:h,contentBase:t,fetchError:y})}catch{}}catch{}if(typeof le=="string"&&le)try{const b=await ht(le,t,i?i.signal:void 0);if(b&&b.raw){try{nr(b.meta||{},le)}catch{}return{data:b,pagePath:le,anchor:s}}}catch{}try{if(d&&String(n||"").toLowerCase().includes(".html"))try{const b=new URL(String(n||""),location.href).toString();ut()&&k("[router] attempting absolute HTML fetch fallback",b);const A=await fetch(b,i?{signal:i.signal}:void 0);if(A&&A.ok){const S=await A.text(),E=A&&A.headers&&typeof A.headers.get=="function"&&A.headers.get("content-type")||"",I=(S||"").toLowerCase(),O=E&&E.indexOf&&E.indexOf("text/html")!==-1||I.indexOf("<!doctype")!==-1||I.indexOf("<html")!==-1;if(!O&&ut())try{k("[router] absolute fetch returned non-HTML",()=>({abs:b,contentType:E,snippet:I.slice(0,200)}))}catch{}if(O){const W=(S||"").toLowerCase();if(/<title>\s*index of\b/i.test(S)||/<h1>\s*index of\b/i.test(S)||W.indexOf("parent directory")!==-1||/<title>\s*directory listing/i.test(S)||/<h1>\s*directory listing/i.test(S))try{ut()&&k("[router] absolute fetch returned directory listing; treating as not found",{abs:b})}catch{}else try{const B=b,Z=new URL(".",B).toString();try{const j=He();if(j){const C=j.parseFromString(S||"","text/html"),N=(K,Le)=>{try{const me=Le.getAttribute(K)||"";if(!me||/^(https?:)?\/\//i.test(me)||me.startsWith("/")||me.startsWith("#"))return;try{const Se=new URL(me,B).toString();Le.setAttribute(K,Se)}catch(Se){k("[router] rewrite attribute failed",K,Se)}}catch(me){k("[router] rewrite helper failed",me)}},D=C.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"),ie=[];for(const K of Array.from(D||[]))try{const Le=K.tagName?K.tagName.toLowerCase():"";if(Le==="a")continue;if(K.hasAttribute("src")){const me=K.getAttribute("src");N("src",K);const Se=K.getAttribute("src");me!==Se&&ie.push({attr:"src",tag:Le,before:me,after:Se})}if(K.hasAttribute("href")&&Le==="link"){const me=K.getAttribute("href");N("href",K);const Se=K.getAttribute("href");me!==Se&&ie.push({attr:"href",tag:Le,before:me,after:Se})}if(K.hasAttribute("href")&&Le!=="link"){const me=K.getAttribute("href");N("href",K);const Se=K.getAttribute("href");me!==Se&&ie.push({attr:"href",tag:Le,before:me,after:Se})}if(K.hasAttribute("xlink:href")){const me=K.getAttribute("xlink:href");N("xlink:href",K);const Se=K.getAttribute("xlink:href");me!==Se&&ie.push({attr:"xlink:href",tag:Le,before:me,after:Se})}if(K.hasAttribute("poster")){const me=K.getAttribute("poster");N("poster",K);const Se=K.getAttribute("poster");me!==Se&&ie.push({attr:"poster",tag:Le,before:me,after:Se})}if(K.hasAttribute("srcset")){const Ee=(K.getAttribute("srcset")||"").split(",").map(Fe=>Fe.trim()).filter(Boolean).map(Fe=>{const[R,P]=Fe.split(/\s+/,2);if(!R||/^(https?:)?\/\//i.test(R)||R.startsWith("/"))return Fe;try{const M=new URL(R,B).toString();return P?`${M} ${P}`:M}catch{return Fe}}).join(", ");K.setAttribute("srcset",Ee)}}catch{}const he=C.documentElement&&C.documentElement.outerHTML?C.documentElement.outerHTML:S;try{ut()&&ie&&ie.length&&k("[router] rewritten asset refs",{abs:b,rewritten:ie})}catch{}return{data:{raw:he,isHtml:!0},pagePath:String(n||""),anchor:s}}}catch{}let ee=S;try{let j=String(S||"");j=j.replace(/srcset\s*=\s*"([^"]*)"/gi,(C,N)=>`srcset="${String(N||"").split(",").map(he=>he.trim()).filter(Boolean).map(he=>{const[K,Le]=he.split(/\s+/,2);if(!K||/^(https?:)?\/\//i.test(K)||K.startsWith("/")||K.startsWith("#"))return he;try{const me=new URL(K,B).toString();return Le?`${me} ${Le}`:me}catch{return he}}).join(", ")}"`),j=j.replace(/<(?!a\b)([^>]*?)\bhref\s*=\s*"([^"]*)"/gi,(C,N,D)=>{if(!D||/^(https?:)?\/\//i.test(D)||D.startsWith("/")||D.startsWith("#"))return C;try{const ie=new URL(D,B).toString();return C.replace(`href="${D}"`,`href="${ie}"`)}catch{return C}}),j=j.replace(/\bsrc\s*=\s*"([^"]*)"/gi,(C,N)=>{if(!N||/^(https?:)?\/\//i.test(N)||N.startsWith("/")||N.startsWith("#"))return C;try{return`src="${new URL(N,B).toString()}"`}catch{return C}}),j=j.replace(/\bxlink:href\s*=\s*"([^"]*)"/gi,(C,N)=>{if(!N||/^(https?:)?\/\//i.test(N)||N.startsWith("/")||N.startsWith("#"))return C;try{return`xlink:href="${new URL(N,B).toString()}"`}catch{return C}}),j=j.replace(/\bposter\s*=\s*"([^"]*)"/gi,(C,N)=>{if(!N||/^(https?:)?\/\//i.test(N)||N.startsWith("/")||N.startsWith("#"))return C;try{return`poster="${new URL(N,B).toString()}"`}catch{return C}}),ee=j}catch{ee=S}return/<base\s+[^>]*>/i.test(ee)||(/<head[^>]*>/i.test(ee)?ee=ee.replace(/(<head[^>]*>)/i,`$1<base href="${Z}">`):ee=`<base href="${Z}">`+ee),{data:{raw:ee,isHtml:!0},pagePath:String(n||""),anchor:s}}catch{return{data:{raw:S,isHtml:!0},pagePath:String(n||""),anchor:s}}}}}catch(b){ut()&&k("[router] absolute HTML fetch fallback failed",b)}}catch{}try{const b=decodeURIComponent(String(a||""));if(b&&!/\.(md|html?)$/i.test(b)&&typeof le=="string"&&le&&ut()){const S=[`/assets/${b}.html`,`/assets/${b}/index.html`];for(const E of S)try{const I=await fetch(E,Object.assign({method:"GET"},i?{signal:i.signal}:{}));if(I&&I.ok)return{data:{raw:await I.text(),isHtml:!0},pagePath:E.replace(/^\//,""),anchor:s}}catch{}}}catch(b){ut()&&k("[router] assets fallback failed",b)}throw new Error("no page data")}return{data:m,pagePath:f,anchor:s}}function br(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Ft=br();function qa(e){Ft=e}var Wt={exec:()=>null};function ze(e,t=""){let n=typeof e=="string"?e:e.source,i={replace:(r,a)=>{let s=typeof a=="string"?a:a.source;return s=s.replace(lt.caret,"$1"),n=n.replace(r,s),i},getRegex:()=>new RegExp(n,t)};return i}var Yo=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),lt={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}>`)},Jo=/^(?:[ \t]*(?:\n|$))+/,el=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,tl=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,qn=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,nl=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,gi=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Ha=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Fa=ze(Ha).replace(/bull/g,gi).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),rl=ze(Ha).replace(/bull/g,gi).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),pi=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,il=/^[^\n]+/,mi=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,al=ze(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",mi).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),sl=ze(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,gi).getRegex(),wr="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",yi=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,ol=ze("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",yi).replace("tag",wr).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Da=ze(pi).replace("hr",qn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",wr).getRegex(),ll=ze(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Da).getRegex(),bi={blockquote:ll,code:el,def:al,fences:tl,heading:nl,hr:qn,html:ol,lheading:Fa,list:sl,newline:Jo,paragraph:Da,table:Wt,text:il},Yi=ze("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",qn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",wr).getRegex(),cl={...bi,lheading:rl,table:Yi,paragraph:ze(pi).replace("hr",qn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Yi).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",wr).getRegex()},ul={...bi,html:ze(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",yi).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Wt,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:ze(pi).replace("hr",qn).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Fa).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},hl=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,dl=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Ua=/^( {2,}|\\)\n(?!\s*$)/,fl=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,_r=/[\p{P}\p{S}]/u,wi=/[\s\p{P}\p{S}]/u,Wa=/[^\s\p{P}\p{S}]/u,gl=ze(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,wi).getRegex(),Za=/(?!~)[\p{P}\p{S}]/u,pl=/(?!~)[\s\p{P}\p{S}]/u,ml=/(?:[^\s\p{P}\p{S}]|~)/u,Ga=/(?![*_])[\p{P}\p{S}]/u,yl=/(?![*_])[\s\p{P}\p{S}]/u,bl=/(?:[^\s\p{P}\p{S}]|[*_])/u,wl=ze(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Yo?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Qa=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,_l=ze(Qa,"u").replace(/punct/g,_r).getRegex(),kl=ze(Qa,"u").replace(/punct/g,Za).getRegex(),Xa="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",xl=ze(Xa,"gu").replace(/notPunctSpace/g,Wa).replace(/punctSpace/g,wi).replace(/punct/g,_r).getRegex(),Sl=ze(Xa,"gu").replace(/notPunctSpace/g,ml).replace(/punctSpace/g,pl).replace(/punct/g,Za).getRegex(),vl=ze("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Wa).replace(/punctSpace/g,wi).replace(/punct/g,_r).getRegex(),Al=ze(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,Ga).getRegex(),El="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Cl=ze(El,"gu").replace(/notPunctSpace/g,bl).replace(/punctSpace/g,yl).replace(/punct/g,Ga).getRegex(),Ml=ze(/\\(punct)/,"gu").replace(/punct/g,_r).getRegex(),Ll=ze(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Tl=ze(yi).replace("(?:-->|$)","-->").getRegex(),zl=ze("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Tl).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),hr=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Rl=ze(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",hr).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Ka=ze(/^!?\[(label)\]\[(ref)\]/).replace("label",hr).replace("ref",mi).getRegex(),Va=ze(/^!?\[(ref)\](?:\[\])?/).replace("ref",mi).getRegex(),$l=ze("reflink|nolink(?!\\()","g").replace("reflink",Ka).replace("nolink",Va).getRegex(),Ji=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,_i={_backpedal:Wt,anyPunctuation:Ml,autolink:Ll,blockSkip:wl,br:Ua,code:dl,del:Wt,delLDelim:Wt,delRDelim:Wt,emStrongLDelim:_l,emStrongRDelimAst:xl,emStrongRDelimUnd:vl,escape:hl,link:Rl,nolink:Va,punctuation:gl,reflink:Ka,reflinkSearch:$l,tag:zl,text:fl,url:Wt},Pl={..._i,link:ze(/^!?\[(label)\]\((.*?)\)/).replace("label",hr).getRegex(),reflink:ze(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",hr).getRegex()},Wr={..._i,emStrongRDelimAst:Sl,emStrongLDelim:kl,delLDelim:Al,delRDelim:Cl,url:ze(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Ji).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:ze(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Ji).getRegex()},Il={...Wr,br:ze(Ua).replace("{2,}","*").getRegex(),text:ze(Wr.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Xn={normal:bi,gfm:cl,pedantic:ul},yn={normal:_i,gfm:Wr,breaks:Il,pedantic:Pl},Nl={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},ea=e=>Nl[e];function xt(e,t){if(t){if(lt.escapeTest.test(e))return e.replace(lt.escapeReplace,ea)}else if(lt.escapeTestNoEncode.test(e))return e.replace(lt.escapeReplaceNoEncode,ea);return e}function ta(e){try{e=encodeURI(e).replace(lt.percentDecode,"%")}catch{return null}return e}function na(e,t){let n=e.replace(lt.findPipe,(a,s,o)=>{let l=!1,c=s;for(;--c>=0&&o[c]==="\\";)l=!l;return l?"|":" |"}),i=n.split(lt.splitPipe),r=0;if(i[0].trim()||i.shift(),i.length>0&&!i.at(-1)?.trim()&&i.pop(),t)if(i.length>t)i.splice(t);else for(;i.length<t;)i.push("");for(;r<i.length;r++)i[r]=i[r].trim().replace(lt.slashPipe,"|");return i}function bn(e,t,n){let i=e.length;if(i===0)return"";let r=0;for(;r<i&&e.charAt(i-r-1)===t;)r++;return e.slice(0,i-r)}function Ol(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let i=0;i<e.length;i++)if(e[i]==="\\")i++;else if(e[i]===t[0])n++;else if(e[i]===t[1]&&(n--,n<0))return i;return n>0?-2:-1}function Bl(e,t=0){let n=t,i="";for(let r of e)if(r==="	"){let a=4-n%4;i+=" ".repeat(a),n+=a}else i+=r,n++;return i}function ra(e,t,n,i,r){let a=t.href,s=t.title||null,o=e[1].replace(r.other.outputLinkReplace,"$1");i.state.inLink=!0;let l={type:e[0].charAt(0)==="!"?"image":"link",raw:n,href:a,title:s,text:o,tokens:i.inlineTokens(o)};return i.state.inLink=!1,l}function jl(e,t,n){let i=e.match(n.other.indentCodeCompensation);if(i===null)return t;let r=i[1];return t.split(`
`).map(a=>{let s=a.match(n.other.beginningSpace);if(s===null)return a;let[o]=s;return o.length>=r.length?a.slice(r.length):a}).join(`
`)}var Pn=class{options;rules;lexer;constructor(e){this.options=e||Ft}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:bn(n,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],i=jl(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:i}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let i=bn(n,"#");(this.options.pedantic||!i||this.rules.other.endingSpaceChar.test(i))&&(n=i.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:bn(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=bn(t[0],`
`).split(`
`),i="",r="",a=[];for(;n.length>0;){let s=!1,o=[],l;for(l=0;l<n.length;l++)if(this.rules.other.blockquoteStart.test(n[l]))o.push(n[l]),s=!0;else if(!s)o.push(n[l]);else break;n=n.slice(l);let c=o.join(`
`),u=c.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");i=i?`${i}
${c}`:c,r=r?`${r}
${u}`:u;let g=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(u,a,!0),this.lexer.state.top=g,n.length===0)break;let h=a.at(-1);if(h?.type==="code")break;if(h?.type==="blockquote"){let d=h,p=d.raw+`
`+n.join(`
`),m=this.blockquote(p);a[a.length-1]=m,i=i.substring(0,i.length-d.raw.length)+m.raw,r=r.substring(0,r.length-d.text.length)+m.text;break}else if(h?.type==="list"){let d=h,p=d.raw+`
`+n.join(`
`),m=this.list(p);a[a.length-1]=m,i=i.substring(0,i.length-h.raw.length)+m.raw,r=r.substring(0,r.length-d.raw.length)+m.raw,n=p.substring(a.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:i,tokens:a,text:r}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),i=n.length>1,r={type:"list",raw:"",ordered:i,start:i?+n.slice(0,-1):"",loose:!1,items:[]};n=i?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=i?n:"[*+-]");let a=this.rules.other.listItemRegex(n),s=!1;for(;e;){let l=!1,c="",u="";if(!(t=a.exec(e))||this.rules.block.hr.test(e))break;c=t[0],e=e.substring(c.length);let g=Bl(t[2].split(`
`,1)[0],t[1].length),h=e.split(`
`,1)[0],d=!g.trim(),p=0;if(this.options.pedantic?(p=2,u=g.trimStart()):d?p=t[1].length+1:(p=g.search(this.rules.other.nonSpaceChar),p=p>4?1:p,u=g.slice(p),p+=t[1].length),d&&this.rules.other.blankLine.test(h)&&(c+=h+`
`,e=e.substring(h.length+1),l=!0),!l){let m=this.rules.other.nextBulletRegex(p),f=this.rules.other.hrRegex(p),w=this.rules.other.fencesBeginRegex(p),y=this.rules.other.headingBeginRegex(p),_=this.rules.other.htmlBeginRegex(p),b=this.rules.other.blockquoteBeginRegex(p);for(;e;){let A=e.split(`
`,1)[0],S;if(h=A,this.options.pedantic?(h=h.replace(this.rules.other.listReplaceNesting,"  "),S=h):S=h.replace(this.rules.other.tabCharGlobal,"    "),w.test(h)||y.test(h)||_.test(h)||b.test(h)||m.test(h)||f.test(h))break;if(S.search(this.rules.other.nonSpaceChar)>=p||!h.trim())u+=`
`+S.slice(p);else{if(d||g.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||w.test(g)||y.test(g)||f.test(g))break;u+=`
`+h}d=!h.trim(),c+=A+`
`,e=e.substring(A.length+1),g=S.slice(p)}}r.loose||(s?r.loose=!0:this.rules.other.doubleBlankLine.test(c)&&(s=!0)),r.items.push({type:"list_item",raw:c,task:!!this.options.gfm&&this.rules.other.listIsTask.test(u),loose:!1,text:u,tokens:[]}),r.raw+=c}let o=r.items.at(-1);if(o)o.raw=o.raw.trimEnd(),o.text=o.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let l of r.items){if(this.lexer.state.top=!1,l.tokens=this.lexer.blockTokens(l.text,[]),l.task){if(l.text=l.text.replace(this.rules.other.listReplaceTask,""),l.tokens[0]?.type==="text"||l.tokens[0]?.type==="paragraph"){l.tokens[0].raw=l.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),l.tokens[0].text=l.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let u=this.lexer.inlineQueue.length-1;u>=0;u--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[u].src)){this.lexer.inlineQueue[u].src=this.lexer.inlineQueue[u].src.replace(this.rules.other.listReplaceTask,"");break}}let c=this.rules.other.listTaskCheckbox.exec(l.raw);if(c){let u={type:"checkbox",raw:c[0]+" ",checked:c[0]!=="[ ]"};l.checked=u.checked,r.loose?l.tokens[0]&&["paragraph","text"].includes(l.tokens[0].type)&&"tokens"in l.tokens[0]&&l.tokens[0].tokens?(l.tokens[0].raw=u.raw+l.tokens[0].raw,l.tokens[0].text=u.raw+l.tokens[0].text,l.tokens[0].tokens.unshift(u)):l.tokens.unshift({type:"paragraph",raw:u.raw,text:u.raw,tokens:[u]}):l.tokens.unshift(u)}}if(!r.loose){let c=l.tokens.filter(g=>g.type==="space"),u=c.length>0&&c.some(g=>this.rules.other.anyLine.test(g.raw));r.loose=u}}if(r.loose)for(let l of r.items){l.loose=!0;for(let c of l.tokens)c.type==="text"&&(c.type="paragraph")}return r}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),i=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:i,title:r}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=na(t[1]),i=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],a={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===i.length){for(let s of i)this.rules.other.tableAlignRight.test(s)?a.align.push("right"):this.rules.other.tableAlignCenter.test(s)?a.align.push("center"):this.rules.other.tableAlignLeft.test(s)?a.align.push("left"):a.align.push(null);for(let s=0;s<n.length;s++)a.header.push({text:n[s],tokens:this.lexer.inline(n[s]),header:!0,align:a.align[s]});for(let s of r)a.rows.push(na(s,a.header.length).map((o,l)=>({text:o,tokens:this.lexer.inline(o),header:!1,align:a.align[l]})));return a}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let a=bn(n.slice(0,-1),"\\");if((n.length-a.length)%2===0)return}else{let a=Ol(t[2],"()");if(a===-2)return;if(a>-1){let s=(t[0].indexOf("!")===0?5:4)+t[1].length+a;t[2]=t[2].substring(0,a),t[0]=t[0].substring(0,s).trim(),t[3]=""}}let i=t[2],r="";if(this.options.pedantic){let a=this.rules.other.pedanticHrefTitle.exec(i);a&&(i=a[1],r=a[3])}else r=t[3]?t[3].slice(1,-1):"";return i=i.trim(),this.rules.other.startAngleBracket.test(i)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?i=i.slice(1):i=i.slice(1,-1)),ra(t,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let i=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=t[i.toLowerCase()];if(!r){let a=n[0].charAt(0);return{type:"text",raw:a,text:a}}return ra(n,r,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let i=this.rules.inline.emStrongLDelim.exec(e);if(!(!i||i[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(i[1]||i[2])||!n||this.rules.inline.punctuation.exec(n))){let r=[...i[0]].length-1,a,s,o=r,l=0,c=i[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(c.lastIndex=0,t=t.slice(-1*e.length+r);(i=c.exec(t))!=null;){if(a=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!a)continue;if(s=[...a].length,i[3]||i[4]){o+=s;continue}else if((i[5]||i[6])&&r%3&&!((r+s)%3)){l+=s;continue}if(o-=s,o>0)continue;s=Math.min(s,s+o+l);let u=[...i[0]][0].length,g=e.slice(0,r+i.index+u+s);if(Math.min(r,s)%2){let d=g.slice(1,-1);return{type:"em",raw:g,text:d,tokens:this.lexer.inlineTokens(d)}}let h=g.slice(2,-2);return{type:"strong",raw:g,text:h,tokens:this.lexer.inlineTokens(h)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),i=this.rules.other.nonSpaceChar.test(n),r=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return i&&r&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,n=""){let i=this.rules.inline.delLDelim.exec(e);if(i&&(!i[1]||!n||this.rules.inline.punctuation.exec(n))){let r=[...i[0]].length-1,a,s,o=r,l=this.rules.inline.delRDelim;for(l.lastIndex=0,t=t.slice(-1*e.length+r);(i=l.exec(t))!=null;){if(a=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!a||(s=[...a].length,s!==r))continue;if(i[3]||i[4]){o+=s;continue}if(o-=s,o>0)continue;s=Math.min(s,s+o);let c=[...i[0]][0].length,u=e.slice(0,r+i.index+c+s),g=u.slice(r,-r);return{type:"del",raw:u,text:g,tokens:this.lexer.inlineTokens(g)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,i;return t[2]==="@"?(n=t[1],i="mailto:"+n):(n=t[1],i=n),{type:"link",raw:t[0],text:n,href:i,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,i;if(t[2]==="@")n=t[0],i="mailto:"+n;else{let r;do r=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(r!==t[0]);n=t[0],t[1]==="www."?i="http://"+t[0]:i=t[0]}return{type:"link",raw:t[0],text:n,href:i,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}},pt=class Zr{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||Ft,this.options.tokenizer=this.options.tokenizer||new Pn,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:lt,block:Xn.normal,inline:yn.normal};this.options.pedantic?(n.block=Xn.pedantic,n.inline=yn.pedantic):this.options.gfm&&(n.block=Xn.gfm,this.options.breaks?n.inline=yn.breaks:n.inline=yn.gfm),this.tokenizer.rules=n}static get rules(){return{block:Xn,inline:yn}}static lex(t,n){return new Zr(n).lex(t)}static lexInline(t,n){return new Zr(n).inlineTokens(t)}lex(t){t=t.replace(lt.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let i=this.inlineQueue[n];this.inlineTokens(i.src,i.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],i=!1){for(this.options.pedantic&&(t=t.replace(lt.tabCharGlobal,"    ").replace(lt.spaceLine,""));t;){let r;if(this.options.extensions?.block?.some(s=>(r=s.call({lexer:this},t,n))?(t=t.substring(r.raw.length),n.push(r),!0):!1))continue;if(r=this.tokenizer.space(t)){t=t.substring(r.raw.length);let s=n.at(-1);r.raw.length===1&&s!==void 0?s.raw+=`
`:n.push(r);continue}if(r=this.tokenizer.code(t)){t=t.substring(r.raw.length);let s=n.at(-1);s?.type==="paragraph"||s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+r.raw,s.text+=`
`+r.text,this.inlineQueue.at(-1).src=s.text):n.push(r);continue}if(r=this.tokenizer.fences(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.heading(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.hr(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.blockquote(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.list(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.html(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.def(t)){t=t.substring(r.raw.length);let s=n.at(-1);s?.type==="paragraph"||s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+r.raw,s.text+=`
`+r.raw,this.inlineQueue.at(-1).src=s.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title},n.push(r));continue}if(r=this.tokenizer.table(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.lheading(t)){t=t.substring(r.raw.length),n.push(r);continue}let a=t;if(this.options.extensions?.startBlock){let s=1/0,o=t.slice(1),l;this.options.extensions.startBlock.forEach(c=>{l=c.call({lexer:this},o),typeof l=="number"&&l>=0&&(s=Math.min(s,l))}),s<1/0&&s>=0&&(a=t.substring(0,s+1))}if(this.state.top&&(r=this.tokenizer.paragraph(a))){let s=n.at(-1);i&&s?.type==="paragraph"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+r.raw,s.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):n.push(r),i=a.length!==t.length,t=t.substring(r.raw.length);continue}if(r=this.tokenizer.text(t)){t=t.substring(r.raw.length);let s=n.at(-1);s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+r.raw,s.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):n.push(r);continue}if(t){let s="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(s);break}else throw new Error(s)}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}inlineTokens(t,n=[]){let i=t,r=null;if(this.tokens.links){let l=Object.keys(this.tokens.links);if(l.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(i))!=null;)l.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(i=i.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(i))!=null;)i=i.slice(0,r.index)+"++"+i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let a;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(i))!=null;)a=r[2]?r[2].length:0,i=i.slice(0,r.index+a)+"["+"a".repeat(r[0].length-a-2)+"]"+i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);i=this.options.hooks?.emStrongMask?.call({lexer:this},i)??i;let s=!1,o="";for(;t;){s||(o=""),s=!1;let l;if(this.options.extensions?.inline?.some(u=>(l=u.call({lexer:this},t,n))?(t=t.substring(l.raw.length),n.push(l),!0):!1))continue;if(l=this.tokenizer.escape(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.tag(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.link(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(l.raw.length);let u=n.at(-1);l.type==="text"&&u?.type==="text"?(u.raw+=l.raw,u.text+=l.text):n.push(l);continue}if(l=this.tokenizer.emStrong(t,i,o)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.codespan(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.br(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.del(t,i,o)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.autolink(t)){t=t.substring(l.raw.length),n.push(l);continue}if(!this.state.inLink&&(l=this.tokenizer.url(t))){t=t.substring(l.raw.length),n.push(l);continue}let c=t;if(this.options.extensions?.startInline){let u=1/0,g=t.slice(1),h;this.options.extensions.startInline.forEach(d=>{h=d.call({lexer:this},g),typeof h=="number"&&h>=0&&(u=Math.min(u,h))}),u<1/0&&u>=0&&(c=t.substring(0,u+1))}if(l=this.tokenizer.inlineText(c)){t=t.substring(l.raw.length),l.raw.slice(-1)!=="_"&&(o=l.raw.slice(-1)),s=!0;let u=n.at(-1);u?.type==="text"?(u.raw+=l.raw,u.text+=l.text):n.push(l);continue}if(t){let u="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(u);break}else throw new Error(u)}}return n}},In=class{options;parser;constructor(e){this.options=e||Ft}space(e){return""}code({text:e,lang:t,escaped:n}){let i=(t||"").match(lt.notSpaceStart)?.[0],r=e.replace(lt.endingNewline,"")+`
`;return i?'<pre><code class="language-'+xt(i)+'">'+(n?r:xt(r,!0))+`</code></pre>
`:"<pre><code>"+(n?r:xt(r,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return""}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,i="";for(let s=0;s<e.items.length;s++){let o=e.items[s];i+=this.listitem(o)}let r=t?"ol":"ul",a=t&&n!==1?' start="'+n+'"':"";return"<"+r+a+`>
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
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${xt(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let i=this.parser.parseInline(n),r=ta(e);if(r===null)return i;e=r;let a='<a href="'+e+'"';return t&&(a+=' title="'+xt(t)+'"'),a+=">"+i+"</a>",a}image({href:e,title:t,text:n,tokens:i}){i&&(n=this.parser.parseInline(i,this.parser.textRenderer));let r=ta(e);if(r===null)return xt(n);e=r;let a=`<img src="${e}" alt="${xt(n)}"`;return t&&(a+=` title="${xt(t)}"`),a+=">",a}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:xt(e.text)}},kr=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},mt=class Gr{options;renderer;textRenderer;constructor(t){this.options=t||Ft,this.options.renderer=this.options.renderer||new In,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new kr}static parse(t,n){return new Gr(n).parse(t)}static parseInline(t,n){return new Gr(n).parseInline(t)}parse(t){let n="";for(let i=0;i<t.length;i++){let r=t[i];if(this.options.extensions?.renderers?.[r.type]){let s=r,o=this.options.extensions.renderers[s.type].call({parser:this},s);if(o!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(s.type)){n+=o||"";continue}}let a=r;switch(a.type){case"space":{n+=this.renderer.space(a);break}case"hr":{n+=this.renderer.hr(a);break}case"heading":{n+=this.renderer.heading(a);break}case"code":{n+=this.renderer.code(a);break}case"table":{n+=this.renderer.table(a);break}case"blockquote":{n+=this.renderer.blockquote(a);break}case"list":{n+=this.renderer.list(a);break}case"checkbox":{n+=this.renderer.checkbox(a);break}case"html":{n+=this.renderer.html(a);break}case"def":{n+=this.renderer.def(a);break}case"paragraph":{n+=this.renderer.paragraph(a);break}case"text":{n+=this.renderer.text(a);break}default:{let s='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(s),"";throw new Error(s)}}}return n}parseInline(t,n=this.renderer){let i="";for(let r=0;r<t.length;r++){let a=t[r];if(this.options.extensions?.renderers?.[a.type]){let o=this.options.extensions.renderers[a.type].call({parser:this},a);if(o!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(a.type)){i+=o||"";continue}}let s=a;switch(s.type){case"escape":{i+=n.text(s);break}case"html":{i+=n.html(s);break}case"link":{i+=n.link(s);break}case"image":{i+=n.image(s);break}case"checkbox":{i+=n.checkbox(s);break}case"strong":{i+=n.strong(s);break}case"em":{i+=n.em(s);break}case"codespan":{i+=n.codespan(s);break}case"br":{i+=n.br(s);break}case"del":{i+=n.del(s);break}case"text":{i+=n.text(s);break}default:{let o='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return i}},sn=class{options;block;constructor(e){this.options=e||Ft}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(){return this.block?pt.lex:pt.lexInline}provideParser(){return this.block?mt.parse:mt.parseInline}},Ya=class{defaults=br();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=mt;Renderer=In;TextRenderer=kr;Lexer=pt;Tokenizer=Pn;Hooks=sn;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let i of e)switch(n=n.concat(t.call(this,i)),i.type){case"table":{let r=i;for(let a of r.header)n=n.concat(this.walkTokens(a.tokens,t));for(let a of r.rows)for(let s of a)n=n.concat(this.walkTokens(s.tokens,t));break}case"list":{let r=i;n=n.concat(this.walkTokens(r.items,t));break}default:{let r=i;this.defaults.extensions?.childTokens?.[r.type]?this.defaults.extensions.childTokens[r.type].forEach(a=>{let s=r[a].flat(1/0);n=n.concat(this.walkTokens(s,t))}):r.tokens&&(n=n.concat(this.walkTokens(r.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let i={...n};if(i.async=this.defaults.async||i.async||!1,n.extensions&&(n.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){let a=t.renderers[r.name];a?t.renderers[r.name]=function(...s){let o=r.renderer.apply(this,s);return o===!1&&(o=a.apply(this,s)),o}:t.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let a=t[r.level];a?a.unshift(r.tokenizer):t[r.level]=[r.tokenizer],r.start&&(r.level==="block"?t.startBlock?t.startBlock.push(r.start):t.startBlock=[r.start]:r.level==="inline"&&(t.startInline?t.startInline.push(r.start):t.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(t.childTokens[r.name]=r.childTokens)}),i.extensions=t),n.renderer){let r=this.defaults.renderer||new In(this.defaults);for(let a in n.renderer){if(!(a in r))throw new Error(`renderer '${a}' does not exist`);if(["options","parser"].includes(a))continue;let s=a,o=n.renderer[s],l=r[s];r[s]=(...c)=>{let u=o.apply(r,c);return u===!1&&(u=l.apply(r,c)),u||""}}i.renderer=r}if(n.tokenizer){let r=this.defaults.tokenizer||new Pn(this.defaults);for(let a in n.tokenizer){if(!(a in r))throw new Error(`tokenizer '${a}' does not exist`);if(["options","rules","lexer"].includes(a))continue;let s=a,o=n.tokenizer[s],l=r[s];r[s]=(...c)=>{let u=o.apply(r,c);return u===!1&&(u=l.apply(r,c)),u}}i.tokenizer=r}if(n.hooks){let r=this.defaults.hooks||new sn;for(let a in n.hooks){if(!(a in r))throw new Error(`hook '${a}' does not exist`);if(["options","block"].includes(a))continue;let s=a,o=n.hooks[s],l=r[s];sn.passThroughHooks.has(a)?r[s]=c=>{if(this.defaults.async&&sn.passThroughHooksRespectAsync.has(a))return(async()=>{let g=await o.call(r,c);return l.call(r,g)})();let u=o.call(r,c);return l.call(r,u)}:r[s]=(...c)=>{if(this.defaults.async)return(async()=>{let g=await o.apply(r,c);return g===!1&&(g=await l.apply(r,c)),g})();let u=o.apply(r,c);return u===!1&&(u=l.apply(r,c)),u}}i.hooks=r}if(n.walkTokens){let r=this.defaults.walkTokens,a=n.walkTokens;i.walkTokens=function(s){let o=[];return o.push(a.call(this,s)),r&&(o=o.concat(r.call(this,s))),o}}this.defaults={...this.defaults,...i}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return pt.lex(e,t??this.defaults)}parser(e,t){return mt.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let i={...n},r={...this.defaults,...i},a=this.onError(!!r.silent,!!r.async);if(this.defaults.async===!0&&i.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(r.hooks&&(r.hooks.options=r,r.hooks.block=e),r.async)return(async()=>{let s=r.hooks?await r.hooks.preprocess(t):t,o=await(r.hooks?await r.hooks.provideLexer():e?pt.lex:pt.lexInline)(s,r),l=r.hooks?await r.hooks.processAllTokens(o):o;r.walkTokens&&await Promise.all(this.walkTokens(l,r.walkTokens));let c=await(r.hooks?await r.hooks.provideParser():e?mt.parse:mt.parseInline)(l,r);return r.hooks?await r.hooks.postprocess(c):c})().catch(a);try{r.hooks&&(t=r.hooks.preprocess(t));let s=(r.hooks?r.hooks.provideLexer():e?pt.lex:pt.lexInline)(t,r);r.hooks&&(s=r.hooks.processAllTokens(s)),r.walkTokens&&this.walkTokens(s,r.walkTokens);let o=(r.hooks?r.hooks.provideParser():e?mt.parse:mt.parseInline)(s,r);return r.hooks&&(o=r.hooks.postprocess(o)),o}catch(s){return a(s)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let i="<p>An error occurred:</p><pre>"+xt(n.message+"",!0)+"</pre>";return t?Promise.resolve(i):i}if(t)return Promise.reject(n);throw n}}},Jt=new Ya;function Me(e,t){return Jt.parse(e,t)}Me.options=Me.setOptions=function(e){return Jt.setOptions(e),Me.defaults=Jt.defaults,qa(Me.defaults),Me};Me.getDefaults=br;Me.defaults=Ft;Me.use=function(...e){return Jt.use(...e),Me.defaults=Jt.defaults,qa(Me.defaults),Me};Me.walkTokens=function(e,t){return Jt.walkTokens(e,t)};Me.parseInline=Jt.parseInline;Me.Parser=mt;Me.parser=mt.parse;Me.Renderer=In;Me.TextRenderer=kr;Me.Lexer=pt;Me.lexer=pt.lex;Me.Tokenizer=Pn;Me.Hooks=sn;Me.parse=Me;var ql=Me.options,Hl=Me.setOptions,Fl=Me.use,Dl=Me.walkTokens,Ul=Me.parseInline,Wl=Me,Zl=mt.parse,Gl=pt.lex;const ia=Object.freeze(Object.defineProperty({__proto__:null,Hooks:sn,Lexer:pt,Marked:Ya,Parser:mt,Renderer:In,TextRenderer:kr,Tokenizer:Pn,get defaults(){return Ft},getDefaults:br,lexer:Gl,marked:Me,options:ql,parse:Wl,parseInline:Ul,parser:Zl,setOptions:Hl,use:Fl,walkTokens:Dl},Symbol.toStringTag,{value:"Module"})),Ql=`/**
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

// Export internal helpers for unit testing of edge branches
export { _splitIntoSections, decodeHtmlEntitiesLocal, slugifyHeading, importModuleWithCache, ensureHljs }
`,Ja=`function F() {
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
`,aa=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",Ja],{type:"text/javascript;charset=utf-8"});function Xl(e){let t;try{if(t=aa&&(self.URL||self.webkitURL).createObjectURL(aa),!t)throw"";const n=new Worker(t,{type:"module",name:e?.name});return n.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(t)}),n}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(Ja),{type:"module",name:e?.name})}}function en(e){if(e.startsWith("---")){const t=e.indexOf(`
---`,3);if(t!==-1){const n=e.slice(3,t+0).trim(),i=e.slice(t+4).trimStart(),r={};return n.split(/\r?\n/).forEach(a=>{const s=a.match(/^([^:]+):\s*(.*)$/);s&&(r[s[1].trim()]=s[2].trim())}),{content:i,data:r}}}return{content:e,data:{}}}function Nn(e){try{if(!e&&e!==0)return"";const t=String(e),n={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:" "};return t.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g,(i,r)=>{if(!r)return i;if(r[0]==="#")try{return r[1]==="x"||r[1]==="X"?String.fromCharCode(parseInt(r.slice(2),16)):String.fromCharCode(parseInt(r.slice(1),10))}catch{return i}return n[r]!==void 0?n[r]:i})}catch{return String(e||"")}}const Kt=ia&&(Me||ia)||void 0;function ki(e,t){const n=String(e||"");if(!n||n.length<=t)return[n];const i=/^#{1,6}\s.*$/gm,r=[];let a;for(;(a=i.exec(n))!==null;)r.push(a.index);if(!r.length||r.length<2){const c=[];for(let u=0;u<n.length;u+=t)c.push(n.slice(u,u+t));return c}const s=[];r[0]>0&&s.push(n.slice(0,r[0]));for(let c=0;c<r.length;c++){const u=r[c],g=c+1<r.length?r[c+1]:n.length;s.push(n.slice(u,g))}const o=[];let l="";for(const c of s){if(!l&&c.length>=t){o.push(c);continue}l.length+c.length<=t?l+=c:(l&&o.push(l),l=c)}return l&&o.push(l),o}const dr=/```\s*([a-zA-Z0-9_\-+]+)?/g,es=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);function On(e){try{return String(e||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}}let Ke=null;const Kl="https://cdn.jsdelivr.net/npm/highlight.js";function Vl(){Qs(),Ke=null}function Yl(e){Xs(e)}async function xr(e){return await Ks(e)}async function Vt(){if(Ke)return Ke;try{const e=Kl+"/lib/core.js";try{const t=await import("https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js");if(t){Ke=t.default||t;try{await ai(e,async()=>t)}catch{}}else Ke=null}catch{const n=await xr(e);n?Ke=n.default||n:Ke=null}}catch{Ke=null}return Ke}Kt&&typeof Kt.setOptions=="function"&&Kt.setOptions({gfm:!0,headerIds:!0,mangle:!1,highlighted:(e,t)=>{try{return Ke&&t&&typeof Ke.getLanguage=="function"&&Ke.getLanguage(t)?Ke.highlight(e,{language:t}).value:Ke&&typeof Ke.getLanguage=="function"&&Ke.getLanguage("plaintext")?Ke.highlight(e,{language:"plaintext"}).value:e}catch{return e}}});onmessage=async e=>{const t=e.data||{};try{if(t.type==="register"){const{name:u,url:g}=t;try{if(!await Vt()){postMessage({type:"register-error",name:u,error:"hljs unavailable"});return}const d=await xr(g),p=d?d.default||d:null;if(!p)throw new Error("failed to import language module");Ke.registerLanguage(u,p),postMessage({type:"registered",name:u})}catch(h){postMessage({type:"register-error",name:u,error:String(h)})}return}if(t.type==="detect"){const u=t.md||"",g=t.supported||[],h=new Set,d=new RegExp(dr.source,dr.flags);let p;for(;p=d.exec(u);)if(p[1]){const m=String(p[1]).toLowerCase();if(!m)continue;if(m.length>=5&&m.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(m)&&h.add(m),es.has(m)&&h.add(m),g&&g.length)try{g.indexOf(m)!==-1&&h.add(m)}catch{}}postMessage({id:t.id,result:Array.from(h)});return}if(t.type==="stream"){const u=t.id;try{const g=Number(t.chunkSize)||65536,{content:h,data:d}=en(t.md||"");await Vt().catch(()=>{});const p=ki(h,g),m=new Map,f=On;for(let w=0;w<p.length;w++){let y=p[w],_=Kt.parse(y);const b=[];_=_.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(A,S,E,I)=>{const O=Number(S);let W=I.replace(/<[^>]+>/g,"").trim();try{W=Nn(W)}catch{}let z=null;const B=(E||"").match(/\sid="([^"]+)"/);B&&(z=B[1]);const Z=z||f(W)||"heading",j=(m.get(Z)||0)+1;m.set(Z,j);const C=j===1?Z:Z+"-"+j;b.push({level:O,text:W,id:C});const N={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},D=O<=2?"has-text-weight-bold":O<=4?"has-text-weight-semibold":"has-text-weight-normal",ie=(N[O]+" "+D).trim(),K=((E||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${C}" class="${ie}"`).trim();return`<h${O} ${K}>${I}</h${O}>`}),_=_.replace(/<img([^>]*)>/g,(A,S)=>/\bloading=/.test(S)?`<img${S}>`:/\bdata-want-lazy=/.test(S)?`<img${S}>`:`<img${S} loading="lazy">`),postMessage({id:u,type:"chunk",html:_,toc:b,index:w,isLast:w===p.length-1})}postMessage({id:u,type:"done",meta:d||{}})}catch(g){postMessage({id:t.id,error:String(g)})}return}const{id:n,md:i}=t,{content:r,data:a}=en(i||"");await Vt().catch(()=>{});let s=Kt.parse(r);const o=[],l=new Map,c=On;s=s.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(u,g,h,d)=>{const p=Number(g);let m=d.replace(/<[^>]+>/g,"").trim();try{m=Nn(m)}catch{}let f=null;const w=(h||"").match(/\sid="([^"]+)"/);w&&(f=w[1]);const y=f||c(m)||"heading",b=(l.get(y)||0)+1;l.set(y,b);const A=b===1?y:y+"-"+b;o.push({level:p,text:m,id:A});const S={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},E=p<=2?"has-text-weight-bold":p<=4?"has-text-weight-semibold":"has-text-weight-normal",I=(S[p]+" "+E).trim(),W=((h||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${A}" class="${I}"`).trim();return`<h${p} ${W}>${d}</h${p}>`}),s=s.replace(/<img([^>]*)>/g,(u,g)=>/\bloading=/.test(g)?`<img${g}>`:/\bdata-want-lazy=/.test(g)?`<img${g}>`:`<img${g} loading="lazy">`),postMessage({id:n,result:{html:s,meta:a||{},toc:o}})}catch(n){postMessage({id:t.id,error:String(n)})}};async function xi(e){try{if(e&&e.type==="register"){const{name:l,url:c}=e;try{if(!await Vt())return{type:"register-error",name:l,error:"hljs unavailable"};const g=await xr(c),h=g?g.default||g:null;return h?(Ke.registerLanguage(l,h),{type:"registered",name:l}):{type:"register-error",name:l,error:"failed to import language module"}}catch(u){return{type:"register-error",name:l,error:String(u)}}}if(e&&e.type==="detect"){const l=e.md||"",c=e.supported||[],u=new Set,g=new RegExp(dr.source,dr.flags);let h;for(;h=g.exec(l);)if(h[1]){const d=String(h[1]).toLowerCase();if(!d)continue;if(d.length>=5&&d.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(d)&&u.add(d),es.has(d)&&u.add(d),c&&c.length)try{c.indexOf(d)!==-1&&u.add(d)}catch{}}return{id:e.id,result:Array.from(u)}}const t=e&&e.id,{content:n,data:i}=en(e&&e.md||"");await Vt().catch(()=>{});let r=Kt.parse(n);const a=[],s=new Map,o=On;return r=r.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(l,c,u,g)=>{const h=Number(c);let d=g.replace(/<[^>]+>/g,"").trim();try{d=Nn(d)}catch{}let p=null;const m=(u||"").match(/\sid="([^"]+)"/);m&&(p=m[1]);const f=p||o(d)||"heading",y=(s.get(f)||0)+1;s.set(f,y);const _=y===1?f:f+"-"+y;a.push({level:h,text:d,id:_});const b={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},A=h<=2?"has-text-weight-bold":h<=4?"has-text-weight-semibold":"has-text-weight-normal",S=(b[h]+" "+A).trim(),I=((u||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${_}" class="${S}"`).trim();return`<h${h} ${I}>${g}</h${h}>`}),r=r.replace(/<img([^>]*)>/g,(l,c)=>/\bloading=/.test(c)?`<img${c}>`:/\bdata-want-lazy=/.test(c)?`<img${c}>`:`<img${c} loading="lazy">`),{id:t,result:{html:r,meta:i||{},toc:a}}}catch(t){return{id:e&&e.id,error:String(t)}}}async function Qr(e,t){try{if(!e||e.type!=="stream"){const u=await xi(e);return typeof t=="function"&&t(u),u}const n=e.id,i=Number(e.chunkSize)||64*1024,{content:r,data:a}=en(e.md||"");await Vt().catch(()=>{});const s=ki(r,i),o=new Map,l=On;for(let u=0;u<s.length;u++){let g=s[u],h=Kt.parse(g);const d=[];h=h.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(m,f,w,y)=>{const _=Number(f);let b=y.replace(/<[^>]+>/g,"").trim();try{b=Nn(b)}catch{}let A=null;const S=(w||"").match(/\sid="([^"]+)"/);S&&(A=S[1]);const E=A||l(b)||"heading",O=(o.get(E)||0)+1;o.set(E,O);const W=O===1?E:E+"-"+O;d.push({level:_,text:b,id:W});const z={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},B=_<=2?"has-text-weight-bold":_<=4?"has-text-weight-semibold":"has-text-weight-normal",Z=(z[_]+" "+B).trim(),j=((w||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${W}" class="${Z}"`).trim();return`<h${_} ${j}>${y}</h${_}>`}),h=h.replace(/<img([^>]*)>/g,(m,f)=>/\bloading=/.test(f)?`<img${f}>`:/\bdata-want-lazy=/.test(f)?`<img${f}>`:`<img${f} loading="lazy">`);const p={id:n,type:"chunk",html:h,toc:d,index:u,isLast:u===s.length-1};typeof t=="function"&&t(p)}const c={id:n,type:"done",meta:a||{}};return typeof t=="function"&&t(c),c}catch(n){const i={id:e&&e.id,error:String(n)};return typeof t=="function"&&t(i),i}}const Jl=Object.freeze(Object.defineProperty({__proto__:null,_splitIntoSections:ki,clearRendererImportCache:Vl,decodeHtmlEntitiesLocal:Nn,ensureHljs:Vt,handleWorkerMessage:xi,handleWorkerMessageStream:Qr,importModuleWithCache:xr,setRendererImportNegativeCacheTTL:Yl,slugifyHeading:On},Symbol.toStringTag,{value:"Module"})),rr={100:"💯",1234:"🔢",grinning:"😀",grimacing:"😬",grin:"😁",joy:"😂",rofl:"🤣",partying:"🥳",smiley:"😃",smile:"😄",sweat_smile:"😅",laughing:"😆",innocent:"😇",wink:"😉",blush:"😊",slightly_smiling_face:"🙂",upside_down_face:"🙃",relaxed:"☺️",yum:"😋",relieved:"😌",heart_eyes:"😍",smiling_face_with_three_hearts:"🥰",kissing_heart:"😘",kissing:"😗",kissing_smiling_eyes:"😙",kissing_closed_eyes:"😚",stuck_out_tongue_winking_eye:"😜",zany:"🤪",raised_eyebrow:"🤨",monocle:"🧐",stuck_out_tongue_closed_eyes:"😝",stuck_out_tongue:"😛",money_mouth_face:"🤑",nerd_face:"🤓",sunglasses:"😎",star_struck:"🤩",clown_face:"🤡",cowboy_hat_face:"🤠",hugs:"🤗",smirk:"😏",no_mouth:"😶",neutral_face:"😐",expressionless:"😑",unamused:"😒",roll_eyes:"🙄",thinking:"🤔",lying_face:"🤥",hand_over_mouth:"🤭",shushing:"🤫",symbols_over_mouth:"🤬",exploding_head:"🤯",flushed:"😳",disappointed:"😞",worried:"😟",angry:"😠",rage:"😡",pensive:"😔",confused:"😕",slightly_frowning_face:"🙁",frowning_face:"☹",persevere:"😣",confounded:"😖",tired_face:"😫",weary:"😩",pleading:"🥺",triumph:"😤",open_mouth:"😮",scream:"😱",fearful:"😨",cold_sweat:"😰",hushed:"😯",frowning:"😦",anguished:"😧",cry:"😢",disappointed_relieved:"😥",drooling_face:"🤤",sleepy:"😪",sweat:"😓",hot:"🥵",cold:"🥶",sob:"😭",dizzy_face:"😵",astonished:"😲",zipper_mouth_face:"🤐",nauseated_face:"🤢",sneezing_face:"🤧",vomiting:"🤮",mask:"😷",face_with_thermometer:"🤒",face_with_head_bandage:"🤕",woozy:"🥴",sleeping:"😴",zzz:"💤",poop:"💩",smiling_imp:"😈",imp:"👿",japanese_ogre:"👹",japanese_goblin:"👺",skull:"💀",ghost:"👻",alien:"👽",robot:"🤖",smiley_cat:"😺",smile_cat:"😸",joy_cat:"😹",heart_eyes_cat:"😻",smirk_cat:"😼",kissing_cat:"😽",scream_cat:"🙀",crying_cat_face:"😿",pouting_cat:"😾",palms_up:"🤲",raised_hands:"🙌",clap:"👏",wave:"👋",call_me_hand:"🤙","+1":"👍","-1":"👎",facepunch:"👊",fist:"✊",fist_left:"🤛",fist_right:"🤜",v:"✌",ok_hand:"👌",raised_hand:"✋",raised_back_of_hand:"🤚",open_hands:"👐",muscle:"💪",pray:"🙏",foot:"🦶",leg:"🦵",handshake:"🤝",point_up:"☝",point_up_2:"👆",point_down:"👇",point_left:"👈",point_right:"👉",fu:"🖕",raised_hand_with_fingers_splayed:"🖐",love_you:"🤟",metal:"🤘",crossed_fingers:"🤞",vulcan_salute:"🖖",writing_hand:"✍",selfie:"🤳",nail_care:"💅",lips:"👄",tooth:"🦷",tongue:"👅",ear:"👂",nose:"👃",eye:"👁",eyes:"👀",brain:"🧠",bust_in_silhouette:"👤",busts_in_silhouette:"👥",speaking_head:"🗣",baby:"👶",child:"🧒",boy:"👦",girl:"👧",adult:"🧑",man:"👨",woman:"👩",blonde_woman:"👱‍♀️",blonde_man:"👱",bearded_person:"🧔",older_adult:"🧓",older_man:"👴",older_woman:"👵",man_with_gua_pi_mao:"👲",woman_with_headscarf:"🧕",woman_with_turban:"👳‍♀️",man_with_turban:"👳",policewoman:"👮‍♀️",policeman:"👮",construction_worker_woman:"👷‍♀️",construction_worker_man:"👷",guardswoman:"💂‍♀️",guardsman:"💂",female_detective:"🕵️‍♀️",male_detective:"🕵",woman_health_worker:"👩‍⚕️",man_health_worker:"👨‍⚕️",woman_farmer:"👩‍🌾",man_farmer:"👨‍🌾",woman_cook:"👩‍🍳",man_cook:"👨‍🍳",woman_student:"👩‍🎓",man_student:"👨‍🎓",woman_singer:"👩‍🎤",man_singer:"👨‍🎤",woman_teacher:"👩‍🏫",man_teacher:"👨‍🏫",woman_factory_worker:"👩‍🏭",man_factory_worker:"👨‍🏭",woman_technologist:"👩‍💻",man_technologist:"👨‍💻",woman_office_worker:"👩‍💼",man_office_worker:"👨‍💼",woman_mechanic:"👩‍🔧",man_mechanic:"👨‍🔧",woman_scientist:"👩‍🔬",man_scientist:"👨‍🔬",woman_artist:"👩‍🎨",man_artist:"👨‍🎨",woman_firefighter:"👩‍🚒",man_firefighter:"👨‍🚒",woman_pilot:"👩‍✈️",man_pilot:"👨‍✈️",woman_astronaut:"👩‍🚀",man_astronaut:"👨‍🚀",woman_judge:"👩‍⚖️",man_judge:"👨‍⚖️",woman_superhero:"🦸‍♀️",man_superhero:"🦸‍♂️",woman_supervillain:"🦹‍♀️",man_supervillain:"🦹‍♂️",mrs_claus:"🤶",santa:"🎅",sorceress:"🧙‍♀️",wizard:"🧙‍♂️",woman_elf:"🧝‍♀️",man_elf:"🧝‍♂️",woman_vampire:"🧛‍♀️",man_vampire:"🧛‍♂️",woman_zombie:"🧟‍♀️",man_zombie:"🧟‍♂️",woman_genie:"🧞‍♀️",man_genie:"🧞‍♂️",mermaid:"🧜‍♀️",merman:"🧜‍♂️",woman_fairy:"🧚‍♀️",man_fairy:"🧚‍♂️",angel:"👼",pregnant_woman:"🤰",breastfeeding:"🤱",princess:"👸",prince:"🤴",bride_with_veil:"👰",man_in_tuxedo:"🤵",running_woman:"🏃‍♀️",running_man:"🏃",walking_woman:"🚶‍♀️",walking_man:"🚶",dancer:"💃",man_dancing:"🕺",dancing_women:"👯",dancing_men:"👯‍♂️",couple:"👫",two_men_holding_hands:"👬",two_women_holding_hands:"👭",bowing_woman:"🙇‍♀️",bowing_man:"🙇",man_facepalming:"🤦‍♂️",woman_facepalming:"🤦‍♀️",woman_shrugging:"🤷",man_shrugging:"🤷‍♂️",tipping_hand_woman:"💁",tipping_hand_man:"💁‍♂️",no_good_woman:"🙅",no_good_man:"🙅‍♂️",ok_woman:"🙆",ok_man:"🙆‍♂️",raising_hand_woman:"🙋",raising_hand_man:"🙋‍♂️",pouting_woman:"🙎",pouting_man:"🙎‍♂️",frowning_woman:"🙍",frowning_man:"🙍‍♂️",haircut_woman:"💇",haircut_man:"💇‍♂️",massage_woman:"💆",massage_man:"💆‍♂️",woman_in_steamy_room:"🧖‍♀️",man_in_steamy_room:"🧖‍♂️",couple_with_heart_woman_man:"💑",couple_with_heart_woman_woman:"👩‍❤️‍👩",couple_with_heart_man_man:"👨‍❤️‍👨",couplekiss_man_woman:"💏",couplekiss_woman_woman:"👩‍❤️‍💋‍👩",couplekiss_man_man:"👨‍❤️‍💋‍👨",family_man_woman_boy:"👪",family_man_woman_girl:"👨‍👩‍👧",family_man_woman_girl_boy:"👨‍👩‍👧‍👦",family_man_woman_boy_boy:"👨‍👩‍👦‍👦",family_man_woman_girl_girl:"👨‍👩‍👧‍👧",family_woman_woman_boy:"👩‍👩‍👦",family_woman_woman_girl:"👩‍👩‍👧",family_woman_woman_girl_boy:"👩‍👩‍👧‍👦",family_woman_woman_boy_boy:"👩‍👩‍👦‍👦",family_woman_woman_girl_girl:"👩‍👩‍👧‍👧",family_man_man_boy:"👨‍👨‍👦",family_man_man_girl:"👨‍👨‍👧",family_man_man_girl_boy:"👨‍👨‍👧‍👦",family_man_man_boy_boy:"👨‍👨‍👦‍👦",family_man_man_girl_girl:"👨‍👨‍👧‍👧",family_woman_boy:"👩‍👦",family_woman_girl:"👩‍👧",family_woman_girl_boy:"👩‍👧‍👦",family_woman_boy_boy:"👩‍👦‍👦",family_woman_girl_girl:"👩‍👧‍👧",family_man_boy:"👨‍👦",family_man_girl:"👨‍👧",family_man_girl_boy:"👨‍👧‍👦",family_man_boy_boy:"👨‍👦‍👦",family_man_girl_girl:"👨‍👧‍👧",yarn:"🧶",thread:"🧵",coat:"🧥",labcoat:"🥼",womans_clothes:"👚",tshirt:"👕",jeans:"👖",necktie:"👔",dress:"👗",bikini:"👙",kimono:"👘",lipstick:"💄",kiss:"💋",footprints:"👣",flat_shoe:"🥿",high_heel:"👠",sandal:"👡",boot:"👢",mans_shoe:"👞",athletic_shoe:"👟",hiking_boot:"🥾",socks:"🧦",gloves:"🧤",scarf:"🧣",womans_hat:"👒",tophat:"🎩",billed_hat:"🧢",rescue_worker_helmet:"⛑",mortar_board:"🎓",crown:"👑",school_satchel:"🎒",luggage:"🧳",pouch:"👝",purse:"👛",handbag:"👜",briefcase:"💼",eyeglasses:"👓",dark_sunglasses:"🕶",goggles:"🥽",ring:"💍",closed_umbrella:"🌂",dog:"🐶",cat:"🐱",mouse:"🐭",hamster:"🐹",rabbit:"🐰",fox_face:"🦊",bear:"🐻",panda_face:"🐼",koala:"🐨",tiger:"🐯",lion:"🦁",cow:"🐮",pig:"🐷",pig_nose:"🐽",frog:"🐸",squid:"🦑",octopus:"🐙",shrimp:"🦐",monkey_face:"🐵",gorilla:"🦍",see_no_evil:"🙈",hear_no_evil:"🙉",speak_no_evil:"🙊",monkey:"🐒",chicken:"🐔",penguin:"🐧",bird:"🐦",baby_chick:"🐤",hatching_chick:"🐣",hatched_chick:"🐥",duck:"🦆",eagle:"🦅",owl:"🦉",bat:"🦇",wolf:"🐺",boar:"🐗",horse:"🐴",unicorn:"🦄",honeybee:"🐝",bug:"🐛",butterfly:"🦋",snail:"🐌",beetle:"🐞",ant:"🐜",grasshopper:"🦗",spider:"🕷",scorpion:"🦂",crab:"🦀",snake:"🐍",lizard:"🦎","t-rex":"🦖",sauropod:"🦕",turtle:"🐢",tropical_fish:"🐠",fish:"🐟",blowfish:"🐡",dolphin:"🐬",shark:"🦈",whale:"🐳",whale2:"🐋",crocodile:"🐊",leopard:"🐆",zebra:"🦓",tiger2:"🐅",water_buffalo:"🐃",ox:"🐂",cow2:"🐄",deer:"🦌",dromedary_camel:"🐪",camel:"🐫",giraffe:"🦒",elephant:"🐘",rhinoceros:"🦏",goat:"🐐",ram:"🐏",sheep:"🐑",racehorse:"🐎",pig2:"🐖",rat:"🐀",mouse2:"🐁",rooster:"🐓",turkey:"🦃",dove:"🕊",dog2:"🐕",poodle:"🐩",cat2:"🐈",rabbit2:"🐇",chipmunk:"🐿",hedgehog:"🦔",raccoon:"🦝",llama:"🦙",hippopotamus:"🦛",kangaroo:"🦘",badger:"🦡",swan:"🦢",peacock:"🦚",parrot:"🦜",lobster:"🦞",mosquito:"🦟",paw_prints:"🐾",dragon:"🐉",dragon_face:"🐲",cactus:"🌵",christmas_tree:"🎄",evergreen_tree:"🌲",deciduous_tree:"🌳",palm_tree:"🌴",seedling:"🌱",herb:"🌿",shamrock:"☘",four_leaf_clover:"🍀",bamboo:"🎍",tanabata_tree:"🎋",leaves:"🍃",fallen_leaf:"🍂",maple_leaf:"🍁",ear_of_rice:"🌾",hibiscus:"🌺",sunflower:"🌻",rose:"🌹",wilted_flower:"🥀",tulip:"🌷",blossom:"🌼",cherry_blossom:"🌸",bouquet:"💐",mushroom:"🍄",chestnut:"🌰",jack_o_lantern:"🎃",shell:"🐚",spider_web:"🕸",earth_americas:"🌎",earth_africa:"🌍",earth_asia:"🌏",full_moon:"🌕",waning_gibbous_moon:"🌖",last_quarter_moon:"🌗",waning_crescent_moon:"🌘",new_moon:"🌑",waxing_crescent_moon:"🌒",first_quarter_moon:"🌓",waxing_gibbous_moon:"🌔",new_moon_with_face:"🌚",full_moon_with_face:"🌝",first_quarter_moon_with_face:"🌛",last_quarter_moon_with_face:"🌜",sun_with_face:"🌞",crescent_moon:"🌙",star:"⭐",star2:"🌟",dizzy:"💫",sparkles:"✨",comet:"☄",sunny:"☀️",sun_behind_small_cloud:"🌤",partly_sunny:"⛅",sun_behind_large_cloud:"🌥",sun_behind_rain_cloud:"🌦",cloud:"☁️",cloud_with_rain:"🌧",cloud_with_lightning_and_rain:"⛈",cloud_with_lightning:"🌩",zap:"⚡",fire:"🔥",boom:"💥",snowflake:"❄️",cloud_with_snow:"🌨",snowman:"⛄",snowman_with_snow:"☃",wind_face:"🌬",dash:"💨",tornado:"🌪",fog:"🌫",open_umbrella:"☂",umbrella:"☔",droplet:"💧",sweat_drops:"💦",ocean:"🌊",green_apple:"🍏",apple:"🍎",pear:"🍐",tangerine:"🍊",lemon:"🍋",banana:"🍌",watermelon:"🍉",grapes:"🍇",strawberry:"🍓",melon:"🍈",cherries:"🍒",peach:"🍑",pineapple:"🍍",coconut:"🥥",kiwi_fruit:"🥝",mango:"🥭",avocado:"🥑",broccoli:"🥦",tomato:"🍅",eggplant:"🍆",cucumber:"🥒",carrot:"🥕",hot_pepper:"🌶",potato:"🥔",corn:"🌽",leafy_greens:"🥬",sweet_potato:"🍠",peanuts:"🥜",honey_pot:"🍯",croissant:"🥐",bread:"🍞",baguette_bread:"🥖",bagel:"🥯",pretzel:"🥨",cheese:"🧀",egg:"🥚",bacon:"🥓",steak:"🥩",pancakes:"🥞",poultry_leg:"🍗",meat_on_bone:"🍖",bone:"🦴",fried_shrimp:"🍤",fried_egg:"🍳",hamburger:"🍔",fries:"🍟",stuffed_flatbread:"🥙",hotdog:"🌭",pizza:"🍕",sandwich:"🥪",canned_food:"🥫",spaghetti:"🍝",taco:"🌮",burrito:"🌯",green_salad:"🥗",shallow_pan_of_food:"🥘",ramen:"🍜",stew:"🍲",fish_cake:"🍥",fortune_cookie:"🥠",sushi:"🍣",bento:"🍱",curry:"🍛",rice_ball:"🍙",rice:"🍚",rice_cracker:"🍘",oden:"🍢",dango:"🍡",shaved_ice:"🍧",ice_cream:"🍨",icecream:"🍦",pie:"🥧",cake:"🍰",cupcake:"🧁",moon_cake:"🥮",birthday:"🎂",custard:"🍮",candy:"🍬",lollipop:"🍭",chocolate_bar:"🍫",popcorn:"🍿",dumpling:"🥟",doughnut:"🍩",cookie:"🍪",milk_glass:"🥛",beer:"🍺",beers:"🍻",clinking_glasses:"🥂",wine_glass:"🍷",tumbler_glass:"🥃",cocktail:"🍸",tropical_drink:"🍹",champagne:"🍾",sake:"🍶",tea:"🍵",cup_with_straw:"🥤",coffee:"☕",baby_bottle:"🍼",salt:"🧂",spoon:"🥄",fork_and_knife:"🍴",plate_with_cutlery:"🍽",bowl_with_spoon:"🥣",takeout_box:"🥡",chopsticks:"🥢",soccer:"⚽",basketball:"🏀",football:"🏈",baseball:"⚾",softball:"🥎",tennis:"🎾",volleyball:"🏐",rugby_football:"🏉",flying_disc:"🥏","8ball":"🎱",golf:"⛳",golfing_woman:"🏌️‍♀️",golfing_man:"🏌",ping_pong:"🏓",badminton:"🏸",goal_net:"🥅",ice_hockey:"🏒",field_hockey:"🏑",lacrosse:"🥍",cricket:"🏏",ski:"🎿",skier:"⛷",snowboarder:"🏂",person_fencing:"🤺",women_wrestling:"🤼‍♀️",men_wrestling:"🤼‍♂️",woman_cartwheeling:"🤸‍♀️",man_cartwheeling:"🤸‍♂️",woman_playing_handball:"🤾‍♀️",man_playing_handball:"🤾‍♂️",ice_skate:"⛸",curling_stone:"🥌",skateboard:"🛹",sled:"🛷",bow_and_arrow:"🏹",fishing_pole_and_fish:"🎣",boxing_glove:"🥊",martial_arts_uniform:"🥋",rowing_woman:"🚣‍♀️",rowing_man:"🚣",climbing_woman:"🧗‍♀️",climbing_man:"🧗‍♂️",swimming_woman:"🏊‍♀️",swimming_man:"🏊",woman_playing_water_polo:"🤽‍♀️",man_playing_water_polo:"🤽‍♂️",woman_in_lotus_position:"🧘‍♀️",man_in_lotus_position:"🧘‍♂️",surfing_woman:"🏄‍♀️",surfing_man:"🏄",bath:"🛀",basketball_woman:"⛹️‍♀️",basketball_man:"⛹",weight_lifting_woman:"🏋️‍♀️",weight_lifting_man:"🏋",biking_woman:"🚴‍♀️",biking_man:"🚴",mountain_biking_woman:"🚵‍♀️",mountain_biking_man:"🚵",horse_racing:"🏇",business_suit_levitating:"🕴",trophy:"🏆",running_shirt_with_sash:"🎽",medal_sports:"🏅",medal_military:"🎖","1st_place_medal":"🥇","2nd_place_medal":"🥈","3rd_place_medal":"🥉",reminder_ribbon:"🎗",rosette:"🏵",ticket:"🎫",tickets:"🎟",performing_arts:"🎭",art:"🎨",circus_tent:"🎪",woman_juggling:"🤹‍♀️",man_juggling:"🤹‍♂️",microphone:"🎤",headphones:"🎧",musical_score:"🎼",musical_keyboard:"🎹",drum:"🥁",saxophone:"🎷",trumpet:"🎺",guitar:"🎸",violin:"🎻",clapper:"🎬",video_game:"🎮",space_invader:"👾",dart:"🎯",game_die:"🎲",chess_pawn:"♟",slot_machine:"🎰",jigsaw:"🧩",bowling:"🎳",red_car:"🚗",taxi:"🚕",blue_car:"🚙",bus:"🚌",trolleybus:"🚎",racing_car:"🏎",police_car:"🚓",ambulance:"🚑",fire_engine:"🚒",minibus:"🚐",truck:"🚚",articulated_lorry:"🚛",tractor:"🚜",kick_scooter:"🛴",motorcycle:"🏍",bike:"🚲",motor_scooter:"🛵",rotating_light:"🚨",oncoming_police_car:"🚔",oncoming_bus:"🚍",oncoming_automobile:"🚘",oncoming_taxi:"🚖",aerial_tramway:"🚡",mountain_cableway:"🚠",suspension_railway:"🚟",railway_car:"🚃",train:"🚋",monorail:"🚝",bullettrain_side:"🚄",bullettrain_front:"🚅",light_rail:"🚈",mountain_railway:"🚞",steam_locomotive:"🚂",train2:"🚆",metro:"🚇",tram:"🚊",station:"🚉",flying_saucer:"🛸",helicopter:"🚁",small_airplane:"🛩",airplane:"✈️",flight_departure:"🛫",flight_arrival:"🛬",sailboat:"⛵",motor_boat:"🛥",speedboat:"🚤",ferry:"⛴",passenger_ship:"🛳",rocket:"🚀",artificial_satellite:"🛰",seat:"💺",canoe:"🛶",anchor:"⚓",construction:"🚧",fuelpump:"⛽",busstop:"🚏",vertical_traffic_light:"🚦",traffic_light:"🚥",checkered_flag:"🏁",ship:"🚢",ferris_wheel:"🎡",roller_coaster:"🎢",carousel_horse:"🎠",building_construction:"🏗",foggy:"🌁",tokyo_tower:"🗼",factory:"🏭",fountain:"⛲",rice_scene:"🎑",mountain:"⛰",mountain_snow:"🏔",mount_fuji:"🗻",volcano:"🌋",japan:"🗾",camping:"🏕",tent:"⛺",national_park:"🏞",motorway:"🛣",railway_track:"🛤",sunrise:"🌅",sunrise_over_mountains:"🌄",desert:"🏜",beach_umbrella:"🏖",desert_island:"🏝",city_sunrise:"🌇",city_sunset:"🌆",cityscape:"🏙",night_with_stars:"🌃",bridge_at_night:"🌉",milky_way:"🌌",stars:"🌠",sparkler:"🎇",fireworks:"🎆",rainbow:"🌈",houses:"🏘",european_castle:"🏰",japanese_castle:"🏯",stadium:"🏟",statue_of_liberty:"🗽",house:"🏠",house_with_garden:"🏡",derelict_house:"🏚",office:"🏢",department_store:"🏬",post_office:"🏣",european_post_office:"🏤",hospital:"🏥",bank:"🏦",hotel:"🏨",convenience_store:"🏪",school:"🏫",love_hotel:"🏩",wedding:"💒",classical_building:"🏛",church:"⛪",mosque:"🕌",synagogue:"🕍",kaaba:"🕋",shinto_shrine:"⛩",watch:"⌚",iphone:"📱",calling:"📲",computer:"💻",keyboard:"⌨",desktop_computer:"🖥",printer:"🖨",computer_mouse:"🖱",trackball:"🖲",joystick:"🕹",clamp:"🗜",minidisc:"💽",floppy_disk:"💾",cd:"💿",dvd:"📀",vhs:"📼",camera:"📷",camera_flash:"📸",video_camera:"📹",movie_camera:"🎥",film_projector:"📽",film_strip:"🎞",telephone_receiver:"📞",phone:"☎️",pager:"📟",fax:"📠",tv:"📺",radio:"📻",studio_microphone:"🎙",level_slider:"🎚",control_knobs:"🎛",compass:"🧭",stopwatch:"⏱",timer_clock:"⏲",alarm_clock:"⏰",mantelpiece_clock:"🕰",hourglass_flowing_sand:"⏳",hourglass:"⌛",satellite:"📡",battery:"🔋",electric_plug:"🔌",bulb:"💡",flashlight:"🔦",candle:"🕯",fire_extinguisher:"🧯",wastebasket:"🗑",oil_drum:"🛢",money_with_wings:"💸",dollar:"💵",yen:"💴",euro:"💶",pound:"💷",moneybag:"💰",credit_card:"💳",gem:"💎",balance_scale:"⚖",toolbox:"🧰",wrench:"🔧",hammer:"🔨",hammer_and_pick:"⚒",hammer_and_wrench:"🛠",pick:"⛏",nut_and_bolt:"🔩",gear:"⚙",brick:"🧱",chains:"⛓",magnet:"🧲",gun:"🔫",bomb:"💣",firecracker:"🧨",hocho:"🔪",dagger:"🗡",crossed_swords:"⚔",shield:"🛡",smoking:"🚬",skull_and_crossbones:"☠",coffin:"⚰",funeral_urn:"⚱",amphora:"🏺",crystal_ball:"🔮",prayer_beads:"📿",nazar_amulet:"🧿",barber:"💈",alembic:"⚗",telescope:"🔭",microscope:"🔬",hole:"🕳",pill:"💊",syringe:"💉",dna:"🧬",microbe:"🦠",petri_dish:"🧫",test_tube:"🧪",thermometer:"🌡",broom:"🧹",basket:"🧺",toilet_paper:"🧻",label:"🏷",bookmark:"🔖",toilet:"🚽",shower:"🚿",bathtub:"🛁",soap:"🧼",sponge:"🧽",lotion_bottle:"🧴",key:"🔑",old_key:"🗝",couch_and_lamp:"🛋",sleeping_bed:"🛌",bed:"🛏",door:"🚪",bellhop_bell:"🛎",teddy_bear:"🧸",framed_picture:"🖼",world_map:"🗺",parasol_on_ground:"⛱",moyai:"🗿",shopping:"🛍",shopping_cart:"🛒",balloon:"🎈",flags:"🎏",ribbon:"🎀",gift:"🎁",confetti_ball:"🎊",tada:"🎉",dolls:"🎎",wind_chime:"🎐",crossed_flags:"🎌",izakaya_lantern:"🏮",red_envelope:"🧧",email:"✉️",envelope_with_arrow:"📩",incoming_envelope:"📨","e-mail":"📧",love_letter:"💌",postbox:"📮",mailbox_closed:"📪",mailbox:"📫",mailbox_with_mail:"📬",mailbox_with_no_mail:"📭",package:"📦",postal_horn:"📯",inbox_tray:"📥",outbox_tray:"📤",scroll:"📜",page_with_curl:"📃",bookmark_tabs:"📑",receipt:"🧾",bar_chart:"📊",chart_with_upwards_trend:"📈",chart_with_downwards_trend:"📉",page_facing_up:"📄",date:"📅",calendar:"📆",spiral_calendar:"🗓",card_index:"📇",card_file_box:"🗃",ballot_box:"🗳",file_cabinet:"🗄",clipboard:"📋",spiral_notepad:"🗒",file_folder:"📁",open_file_folder:"📂",card_index_dividers:"🗂",newspaper_roll:"🗞",newspaper:"📰",notebook:"📓",closed_book:"📕",green_book:"📗",blue_book:"📘",orange_book:"📙",notebook_with_decorative_cover:"📔",ledger:"📒",books:"📚",open_book:"📖",safety_pin:"🧷",link:"🔗",paperclip:"📎",paperclips:"🖇",scissors:"✂️",triangular_ruler:"📐",straight_ruler:"📏",abacus:"🧮",pushpin:"📌",round_pushpin:"📍",triangular_flag_on_post:"🚩",white_flag:"🏳",black_flag:"🏴",rainbow_flag:"🏳️‍🌈",closed_lock_with_key:"🔐",lock:"🔒",unlock:"🔓",lock_with_ink_pen:"🔏",pen:"🖊",fountain_pen:"🖋",black_nib:"✒️",memo:"📝",pencil2:"✏️",crayon:"🖍",paintbrush:"🖌",mag:"🔍",mag_right:"🔎",heart:"❤️",orange_heart:"🧡",yellow_heart:"💛",green_heart:"💚",blue_heart:"💙",purple_heart:"💜",black_heart:"🖤",broken_heart:"💔",heavy_heart_exclamation:"❣",two_hearts:"💕",revolving_hearts:"💞",heartbeat:"💓",heartpulse:"💗",sparkling_heart:"💖",cupid:"💘",gift_heart:"💝",heart_decoration:"💟",peace_symbol:"☮",latin_cross:"✝",star_and_crescent:"☪",om:"🕉",wheel_of_dharma:"☸",star_of_david:"✡",six_pointed_star:"🔯",menorah:"🕎",yin_yang:"☯",orthodox_cross:"☦",place_of_worship:"🛐",ophiuchus:"⛎",aries:"♈",taurus:"♉",gemini:"♊",cancer:"♋",leo:"♌",virgo:"♍",libra:"♎",scorpius:"♏",sagittarius:"♐",capricorn:"♑",aquarius:"♒",pisces:"♓",id:"🆔",atom_symbol:"⚛",u7a7a:"🈳",u5272:"🈹",radioactive:"☢",biohazard:"☣",mobile_phone_off:"📴",vibration_mode:"📳",u6709:"🈶",u7121:"🈚",u7533:"🈸",u55b6:"🈺",u6708:"🈷️",eight_pointed_black_star:"✴️",vs:"🆚",accept:"🉑",white_flower:"💮",ideograph_advantage:"🉐",secret:"㊙️",congratulations:"㊗️",u5408:"🈴",u6e80:"🈵",u7981:"🈲",a:"🅰️",b:"🅱️",ab:"🆎",cl:"🆑",o2:"🅾️",sos:"🆘",no_entry:"⛔",name_badge:"📛",no_entry_sign:"🚫",x:"❌",o:"⭕",stop_sign:"🛑",anger:"💢",hotsprings:"♨️",no_pedestrians:"🚷",do_not_litter:"🚯",no_bicycles:"🚳","non-potable_water":"🚱",underage:"🔞",no_mobile_phones:"📵",exclamation:"❗",grey_exclamation:"❕",question:"❓",grey_question:"❔",bangbang:"‼️",interrobang:"⁉️",low_brightness:"🔅",high_brightness:"🔆",trident:"🔱",fleur_de_lis:"⚜",part_alternation_mark:"〽️",warning:"⚠️",children_crossing:"🚸",beginner:"🔰",recycle:"♻️",u6307:"🈯",chart:"💹",sparkle:"❇️",eight_spoked_asterisk:"✳️",negative_squared_cross_mark:"❎",white_check_mark:"✅",diamond_shape_with_a_dot_inside:"💠",cyclone:"🌀",loop:"➿",globe_with_meridians:"🌐",m:"Ⓜ️",atm:"🏧",sa:"🈂️",passport_control:"🛂",customs:"🛃",baggage_claim:"🛄",left_luggage:"🛅",wheelchair:"♿",no_smoking:"🚭",wc:"🚾",parking:"🅿️",potable_water:"🚰",mens:"🚹",womens:"🚺",baby_symbol:"🚼",restroom:"🚻",put_litter_in_its_place:"🚮",cinema:"🎦",signal_strength:"📶",koko:"🈁",ng:"🆖",ok:"🆗",up:"🆙",cool:"🆒",new:"🆕",free:"🆓",zero:"0️⃣",one:"1️⃣",two:"2️⃣",three:"3️⃣",four:"4️⃣",five:"5️⃣",six:"6️⃣",seven:"7️⃣",eight:"8️⃣",nine:"9️⃣",keycap_ten:"🔟",asterisk:"*⃣",eject_button:"⏏️",arrow_forward:"▶️",pause_button:"⏸",next_track_button:"⏭",stop_button:"⏹",record_button:"⏺",play_or_pause_button:"⏯",previous_track_button:"⏮",fast_forward:"⏩",rewind:"⏪",twisted_rightwards_arrows:"🔀",repeat:"🔁",repeat_one:"🔂",arrow_backward:"◀️",arrow_up_small:"🔼",arrow_down_small:"🔽",arrow_double_up:"⏫",arrow_double_down:"⏬",arrow_right:"➡️",arrow_left:"⬅️",arrow_up:"⬆️",arrow_down:"⬇️",arrow_upper_right:"↗️",arrow_lower_right:"↘️",arrow_lower_left:"↙️",arrow_upper_left:"↖️",arrow_up_down:"↕️",left_right_arrow:"↔️",arrows_counterclockwise:"🔄",arrow_right_hook:"↪️",leftwards_arrow_with_hook:"↩️",arrow_heading_up:"⤴️",arrow_heading_down:"⤵️",hash:"#️⃣",information_source:"ℹ️",abc:"🔤",abcd:"🔡",capital_abcd:"🔠",symbols:"🔣",musical_note:"🎵",notes:"🎶",wavy_dash:"〰️",curly_loop:"➰",heavy_check_mark:"✔️",arrows_clockwise:"🔃",heavy_plus_sign:"➕",heavy_minus_sign:"➖",heavy_division_sign:"➗",heavy_multiplication_x:"✖️",infinity:"♾",heavy_dollar_sign:"💲",currency_exchange:"💱",copyright:"©️",registered:"®️",tm:"™️",end:"🔚",back:"🔙",on:"🔛",top:"🔝",soon:"🔜",ballot_box_with_check:"☑️",radio_button:"🔘",white_circle:"⚪",black_circle:"⚫",red_circle:"🔴",large_blue_circle:"🔵",small_orange_diamond:"🔸",small_blue_diamond:"🔹",large_orange_diamond:"🔶",large_blue_diamond:"🔷",small_red_triangle:"🔺",black_small_square:"▪️",white_small_square:"▫️",black_large_square:"⬛",white_large_square:"⬜",small_red_triangle_down:"🔻",black_medium_square:"◼️",white_medium_square:"◻️",black_medium_small_square:"◾",white_medium_small_square:"◽",black_square_button:"🔲",white_square_button:"🔳",speaker:"🔈",sound:"🔉",loud_sound:"🔊",mute:"🔇",mega:"📣",loudspeaker:"📢",bell:"🔔",no_bell:"🔕",black_joker:"🃏",mahjong:"🀄",spades:"♠️",clubs:"♣️",hearts:"♥️",diamonds:"♦️",flower_playing_cards:"🎴",thought_balloon:"💭",right_anger_bubble:"🗯",speech_balloon:"💬",left_speech_bubble:"🗨",clock1:"🕐",clock2:"🕑",clock3:"🕒",clock4:"🕓",clock5:"🕔",clock6:"🕕",clock7:"🕖",clock8:"🕗",clock9:"🕘",clock10:"🕙",clock11:"🕚",clock12:"🕛",clock130:"🕜",clock230:"🕝",clock330:"🕞",clock430:"🕟",clock530:"🕠",clock630:"🕡",clock730:"🕢",clock830:"🕣",clock930:"🕤",clock1030:"🕥",clock1130:"🕦",clock1230:"🕧",afghanistan:"🇦🇫",aland_islands:"🇦🇽",albania:"🇦🇱",algeria:"🇩🇿",american_samoa:"🇦🇸",andorra:"🇦🇩",angola:"🇦🇴",anguilla:"🇦🇮",antarctica:"🇦🇶",antigua_barbuda:"🇦🇬",argentina:"🇦🇷",armenia:"🇦🇲",aruba:"🇦🇼",australia:"🇦🇺",austria:"🇦🇹",azerbaijan:"🇦🇿",bahamas:"🇧🇸",bahrain:"🇧🇭",bangladesh:"🇧🇩",barbados:"🇧🇧",belarus:"🇧🇾",belgium:"🇧🇪",belize:"🇧🇿",benin:"🇧🇯",bermuda:"🇧🇲",bhutan:"🇧🇹",bolivia:"🇧🇴",caribbean_netherlands:"🇧🇶",bosnia_herzegovina:"🇧🇦",botswana:"🇧🇼",brazil:"🇧🇷",british_indian_ocean_territory:"🇮🇴",british_virgin_islands:"🇻🇬",brunei:"🇧🇳",bulgaria:"🇧🇬",burkina_faso:"🇧🇫",burundi:"🇧🇮",cape_verde:"🇨🇻",cambodia:"🇰🇭",cameroon:"🇨🇲",canada:"🇨🇦",canary_islands:"🇮🇨",cayman_islands:"🇰🇾",central_african_republic:"🇨🇫",chad:"🇹🇩",chile:"🇨🇱",cn:"🇨🇳",christmas_island:"🇨🇽",cocos_islands:"🇨🇨",colombia:"🇨🇴",comoros:"🇰🇲",congo_brazzaville:"🇨🇬",congo_kinshasa:"🇨🇩",cook_islands:"🇨🇰",costa_rica:"🇨🇷",croatia:"🇭🇷",cuba:"🇨🇺",curacao:"🇨🇼",cyprus:"🇨🇾",czech_republic:"🇨🇿",denmark:"🇩🇰",djibouti:"🇩🇯",dominica:"🇩🇲",dominican_republic:"🇩🇴",ecuador:"🇪🇨",egypt:"🇪🇬",el_salvador:"🇸🇻",equatorial_guinea:"🇬🇶",eritrea:"🇪🇷",estonia:"🇪🇪",ethiopia:"🇪🇹",eu:"🇪🇺",falkland_islands:"🇫🇰",faroe_islands:"🇫🇴",fiji:"🇫🇯",finland:"🇫🇮",fr:"🇫🇷",french_guiana:"🇬🇫",french_polynesia:"🇵🇫",french_southern_territories:"🇹🇫",gabon:"🇬🇦",gambia:"🇬🇲",georgia:"🇬🇪",de:"🇩🇪",ghana:"🇬🇭",gibraltar:"🇬🇮",greece:"🇬🇷",greenland:"🇬🇱",grenada:"🇬🇩",guadeloupe:"🇬🇵",guam:"🇬🇺",guatemala:"🇬🇹",guernsey:"🇬🇬",guinea:"🇬🇳",guinea_bissau:"🇬🇼",guyana:"🇬🇾",haiti:"🇭🇹",honduras:"🇭🇳",hong_kong:"🇭🇰",hungary:"🇭🇺",iceland:"🇮🇸",india:"🇮🇳",indonesia:"🇮🇩",iran:"🇮🇷",iraq:"🇮🇶",ireland:"🇮🇪",isle_of_man:"🇮🇲",israel:"🇮🇱",it:"🇮🇹",cote_divoire:"🇨🇮",jamaica:"🇯🇲",jp:"🇯🇵",jersey:"🇯🇪",jordan:"🇯🇴",kazakhstan:"🇰🇿",kenya:"🇰🇪",kiribati:"🇰🇮",kosovo:"🇽🇰",kuwait:"🇰🇼",kyrgyzstan:"🇰🇬",laos:"🇱🇦",latvia:"🇱🇻",lebanon:"🇱🇧",lesotho:"🇱🇸",liberia:"🇱🇷",libya:"🇱🇾",liechtenstein:"🇱🇮",lithuania:"🇱🇹",luxembourg:"🇱🇺",macau:"🇲🇴",macedonia:"🇲🇰",madagascar:"🇲🇬",malawi:"🇲🇼",malaysia:"🇲🇾",maldives:"🇲🇻",mali:"🇲🇱",malta:"🇲🇹",marshall_islands:"🇲🇭",martinique:"🇲🇶",mauritania:"🇲🇷",mauritius:"🇲🇺",mayotte:"🇾🇹",mexico:"🇲🇽",micronesia:"🇫🇲",moldova:"🇲🇩",monaco:"🇲🇨",mongolia:"🇲🇳",montenegro:"🇲🇪",montserrat:"🇲🇸",morocco:"🇲🇦",mozambique:"🇲🇿",myanmar:"🇲🇲",namibia:"🇳🇦",nauru:"🇳🇷",nepal:"🇳🇵",netherlands:"🇳🇱",new_caledonia:"🇳🇨",new_zealand:"🇳🇿",nicaragua:"🇳🇮",niger:"🇳🇪",nigeria:"🇳🇬",niue:"🇳🇺",norfolk_island:"🇳🇫",northern_mariana_islands:"🇲🇵",north_korea:"🇰🇵",norway:"🇳🇴",oman:"🇴🇲",pakistan:"🇵🇰",palau:"🇵🇼",palestinian_territories:"🇵🇸",panama:"🇵🇦",papua_new_guinea:"🇵🇬",paraguay:"🇵🇾",peru:"🇵🇪",philippines:"🇵🇭",pitcairn_islands:"🇵🇳",poland:"🇵🇱",portugal:"🇵🇹",puerto_rico:"🇵🇷",qatar:"🇶🇦",reunion:"🇷🇪",romania:"🇷🇴",ru:"🇷🇺",rwanda:"🇷🇼",st_barthelemy:"🇧🇱",st_helena:"🇸🇭",st_kitts_nevis:"🇰🇳",st_lucia:"🇱🇨",st_pierre_miquelon:"🇵🇲",st_vincent_grenadines:"🇻🇨",samoa:"🇼🇸",san_marino:"🇸🇲",sao_tome_principe:"🇸🇹",saudi_arabia:"🇸🇦",senegal:"🇸🇳",serbia:"🇷🇸",seychelles:"🇸🇨",sierra_leone:"🇸🇱",singapore:"🇸🇬",sint_maarten:"🇸🇽",slovakia:"🇸🇰",slovenia:"🇸🇮",solomon_islands:"🇸🇧",somalia:"🇸🇴",south_africa:"🇿🇦",south_georgia_south_sandwich_islands:"🇬🇸",kr:"🇰🇷",south_sudan:"🇸🇸",es:"🇪🇸",sri_lanka:"🇱🇰",sudan:"🇸🇩",suriname:"🇸🇷",swaziland:"🇸🇿",sweden:"🇸🇪",switzerland:"🇨🇭",syria:"🇸🇾",taiwan:"🇹🇼",tajikistan:"🇹🇯",tanzania:"🇹🇿",thailand:"🇹🇭",timor_leste:"🇹🇱",togo:"🇹🇬",tokelau:"🇹🇰",tonga:"🇹🇴",trinidad_tobago:"🇹🇹",tunisia:"🇹🇳",tr:"🇹🇷",turkmenistan:"🇹🇲",turks_caicos_islands:"🇹🇨",tuvalu:"🇹🇻",uganda:"🇺🇬",ukraine:"🇺🇦",united_arab_emirates:"🇦🇪",uk:"🇬🇧",england:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",scotland:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",wales:"🏴󠁧󠁢󠁷󠁬󠁳󠁿",us:"🇺🇸",us_virgin_islands:"🇻🇮",uruguay:"🇺🇾",uzbekistan:"🇺🇿",vanuatu:"🇻🇺",vatican_city:"🇻🇦",venezuela:"🇻🇪",vietnam:"🇻🇳",wallis_futuna:"🇼🇫",western_sahara:"🇪🇭",yemen:"🇾🇪",zambia:"🇿🇲",zimbabwe:"🇿🇼",united_nations:"🇺🇳",pirate_flag:"🏴‍☠️"},ec=typeof navigator<"u"&&navigator.hardwareConcurrency?Math.max(1,Math.floor(navigator.hardwareConcurrency/2)):2,ts=Sa(()=>{if(typeof Worker<"u")try{return new Xl}catch{}try{if(Gt)return Gt(Ql)}catch{}const e={message:[],error:[]};return{addEventListener(t,n){e[t]||(e[t]=[]),e[t].push(n)},removeEventListener(t,n){if(!e[t])return;const i=e[t].indexOf(n);i!==-1&&e[t].splice(i,1)},postMessage(t){setTimeout(async()=>{try{if(Jl&&typeof Qr=="function"&&t&&t.type==="stream")await Qr(t,n=>{const i={data:n};(e.message||[]).forEach(r=>r(i))});else{const i={data:await xi(t)};(e.message||[]).forEach(r=>r(i))}}catch(n){const i={data:{id:t&&t.id,error:String(n)}};(e.message||[]).forEach(r=>r(i))}},0)},terminate(){Object.keys(e).forEach(t=>e[t].length=0)}}},"markdown",ec),wt=()=>ts.get(),Si=(e,t=3e3)=>ts.send(e,t),At=[];function Xr(e){if(e&&(typeof e=="object"||typeof e=="function")){At.push(e);try{Me.use(e)}catch(t){k("[markdown] failed to apply plugin",t)}}}function tc(e){At.length=0,Array.isArray(e)&&At.push(...e.filter(t=>t&&typeof t=="object"));try{At.forEach(t=>Me.use(t))}catch(t){k("[markdown] failed to apply markdown extensions",t)}}function Kr(e){try{return String(e||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}}function ns(e,t){const n=String(e||"");if(!n||n.length<=t)return[n];const i=/^#{1,6}\s.*$/gm,r=[];let a;for(;(a=i.exec(n))!==null;)r.push(a.index);if(!r.length||r.length<2){const c=[];for(let u=0;u<n.length;u+=t)c.push(n.slice(u,u+t));return c}const s=[];r[0]>0&&s.push(n.slice(0,r[0]));for(let c=0;c<r.length;c++){const u=r[c],g=c+1<r.length?r[c+1]:n.length;s.push(n.slice(u,g))}const o=[];let l="";for(const c of s){if(!l&&c.length>=t){o.push(c);continue}l.length+c.length<=t?l+=c:(l&&o.push(l),l=c)}return l&&o.push(l),o}async function Vr(e,t,n={}){const i=n&&n.chunkSize?Number(n.chunkSize):65536,r=typeof t=="function"?t:(()=>{}),{content:a,data:s}=en(String(e||""));let o=a;try{o=String(o||"").replace(/:([^:\s]+):/g,(h,d)=>rr[d]||h)}catch{}let l;if(typeof process<"u"&&process.env&&process.env.VITEST)try{const h=await Promise.resolve().then(()=>vi);l=h.initRendererWorker&&h.initRendererWorker()}catch{l=wt&&wt()}else l=wt&&wt();if(!(typeof process<"u"&&process.env&&process.env.VITEST)&&l&&typeof l.postMessage=="function")return new Promise((h,d)=>{const p=String(Math.random());let m=null;const f=()=>{m&&clearTimeout(m);try{l.removeEventListener&&l.removeEventListener("message",w)}catch{}try{l.removeEventListener&&l.removeEventListener("error",y)}catch{}},w=_=>{const b=_&&_.data?_.data:{};if(b.id===p){if(b.error)return f(),d(new Error(b.error));if(b.type==="chunk"){try{r(String(b.html||""),{index:b.index,isLast:!!b.isLast,meta:{},toc:b.toc||[]})}catch{}return}if(b.type==="done"){f();try{r("",{index:-1,isLast:!0,meta:b.meta||{}})}catch{}return h()}if(b.result){f();try{r(String(b.result&&b.result.html||""),{index:0,isLast:!0,meta:b.result.meta||{},toc:b.result.toc||[]})}catch{}return h()}}},y=_=>{f(),d(new Error(_&&_.message||"worker error"))};m=setTimeout(()=>{f(),d(new Error("worker timeout"))},n&&n.timeout?Number(n.timeout):1e4);try{l.addEventListener&&l.addEventListener("message",w),l.addEventListener&&l.addEventListener("error",y),l.postMessage({type:"stream",id:p,md:o,chunkSize:i})}catch(_){f(),d(_)}});const c=ns(o,i),u=He(),g=new Map;for(let h=0;h<c.length;h++){const d=c[h],p=await hn(d);let m=String(p&&p.html||""),f=[];if(u)try{const y=u.parseFromString(m,"text/html");y.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(b=>{try{const A=Number(b.tagName.substring(1)),S=(b.textContent||"").trim(),E=Kr(S),O=(g.get(E)||0)+1;g.set(E,O);const W=O===1?E:E+"-"+O;b.id=W,f.push({level:A,text:S,id:W})}catch{}});try{typeof XMLSerializer<"u"?m=new XMLSerializer().serializeToString(y.body).replace(/^<body[^>]*>/i,"").replace(/<\/body>$/i,""):m=Array.from(y.body.childNodes||[]).map(A=>A&&typeof A.outerHTML=="string"?A.outerHTML:A&&typeof A.textContent=="string"?A.textContent:"").join("")}catch{}}catch{}else try{const y=[];m=m.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(_,b,A,S)=>{const E=Number(b),I=S.replace(/<[^>]+>/g,"").trim(),O=Kr(I),z=(g.get(O)||0)+1;g.set(O,z);const B=z===1?O:O+"-"+z;y.push({level:E,text:I,id:B});const Z=(A||"").replace(/\s*(id|class)="[^"]*"/g,"");return`<h${E} ${Z} id="${B}">${S}</h${E}>`}),f=y}catch{}const w={index:h,isLast:h===c.length-1,meta:h===0?s||{}:{},toc:f};try{r(m,w)}catch{}}}async function hn(e){if(At&&At.length){let{content:i,data:r}=en(e||"");try{i=String(i||"").replace(/:([^:\s]+):/g,(s,o)=>rr[o]||s)}catch{}Me.setOptions({gfm:!0,mangle:!1,headerIds:!1,headerPrefix:""});try{At.forEach(s=>Me.use(s))}catch(s){k("[markdown] apply plugins failed",s)}const a=Me.parse(i);try{const s=He();if(s){const o=s.parseFromString(a,"text/html"),l=o.querySelectorAll("h1,h2,h3,h4,h5,h6"),c=[],u=new Set,g=d=>{try{return String(d||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}},h=d=>{const p={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},m=d<=2?"has-text-weight-bold":d<=4?"has-text-weight-semibold":"has-text-weight-normal";return(p[d]+" "+m).trim()};l.forEach(d=>{try{const p=Number(d.tagName.substring(1)),m=(d.textContent||"").trim();let f=g(m)||"heading",w=f,y=2;for(;u.has(w);)w=f+"-"+y,y+=1;u.add(w),d.id=w,d.className=h(p),c.push({level:p,text:m,id:w})}catch{}});try{(o&&typeof o.getElementsByTagName=="function"?Array.from(o.getElementsByTagName("img")):o&&typeof o.querySelectorAll=="function"?Array.from(o.querySelectorAll("img")):[]).forEach(p=>{try{const m=p.getAttribute&&p.getAttribute("loading"),f=p.getAttribute&&p.getAttribute("data-want-lazy");!m&&!f&&p.setAttribute&&p.setAttribute("loading","lazy")}catch{}})}catch{}try{o.querySelectorAll("pre code, code[class]").forEach(d=>{try{const p=d.getAttribute&&d.getAttribute("class")||d.className||"",m=String(p||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(m)try{d.setAttribute&&d.setAttribute("class",m)}catch{d.className=m}else try{d.removeAttribute&&d.removeAttribute("class")}catch{d.className=""}}catch{}})}catch{}try{let d=null;try{typeof XMLSerializer<"u"?d=new XMLSerializer().serializeToString(o.body).replace(/^<body[^>]*>/i,"").replace(/<\/body>$/i,""):d=Array.from(o.body.childNodes||[]).map(m=>m&&typeof m.outerHTML=="string"?m.outerHTML:m&&typeof m.textContent=="string"?m.textContent:"").join("")}catch{try{d=o.body.innerHTML}catch{d=""}}return{html:d,meta:r||{},toc:c}}catch{return{html:"",meta:r||{},toc:c}}}}catch{}return{html:a,meta:r||{},toc:[]}}let t;if(typeof process<"u"&&process.env&&process.env.VITEST)try{const i=await Promise.resolve().then(()=>vi);t=i.initRendererWorker&&i.initRendererWorker()}catch{t=wt&&wt()}else t=wt&&wt();try{e=String(e||"").replace(/:([^:\s]+):/g,(i,r)=>rr[r]||i)}catch{}try{if(typeof Re<"u"&&Re&&typeof Re.getLanguage=="function"&&Re.getLanguage("plaintext")&&/```\s*\n/.test(String(e||""))){let{content:i,data:r}=en(e||"");try{i=String(i||"").replace(/:([^:\s]+):/g,(c,u)=>rr[u]||c)}catch{}Me.setOptions({gfm:!0,headerIds:!0,mangle:!1,highlighted:(c,u)=>{try{return u&&Re.getLanguage&&Re.getLanguage(u)?Re.highlight(c,{language:u}).value:Re&&typeof Re.getLanguage=="function"&&Re.getLanguage("plaintext")?Re.highlight(c,{language:"plaintext"}).value:c}catch{return c}}});let a=Me.parse(i);try{a=a.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g,(c,u)=>{try{if(u&&Re&&typeof Re.highlight=="function")try{const g=Re.highlight(u,{language:"plaintext"});return`<pre><code>${g&&g.value?g.value:g}</code></pre>`}catch{try{if(Re&&typeof Re.highlightElement=="function"){const h={innerHTML:u};return Re.highlightElement(h),`<pre><code>${h.innerHTML}</code></pre>`}}catch{}}}catch{}return c})}catch{}const s=[],o=new Set,l=c=>{try{return String(c||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}};return a=a.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(c,u,g,h)=>{const d=Number(u),p=h.replace(/<[^>]+>/g,"").trim();let m=l(p)||"heading",f=m,w=2;for(;o.has(f);)f=m+"-"+w,w+=1;o.add(f),s.push({level:d,text:p,id:f});const y={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},_=d<=2?"has-text-weight-bold":d<=4?"has-text-weight-semibold":"has-text-weight-normal",b=(y[d]+" "+_).trim(),S=((g||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${f}" class="${b}"`).trim();return`<h${d} ${S}>${h}</h${d}>`}),a=a.replace(/<img([^>]*)>/g,(c,u)=>/\bloading=/.test(u)?`<img${u}>`:/\bdata-want-lazy=/.test(u)?`<img${u}>`:`<img${u} loading="lazy">`),{html:a,meta:r||{},toc:s}}}catch{}if(!t)throw new Error("renderer worker required but unavailable");const n=await Si({type:"render",md:e});if(!n||typeof n!="object"||n.html===void 0)throw new Error("renderer worker returned invalid response");try{const i=new Map,r=[],a=l=>{try{return String(l||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}},s=l=>{const c={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},u=l<=2?"has-text-weight-bold":l<=4?"has-text-weight-semibold":"has-text-weight-normal";return(c[l]+" "+u).trim()};let o=n.html;o=o.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(l,c,u,g)=>{const h=Number(c),d=g.replace(/<[^>]+>/g,"").trim(),p=(u||"").match(/\sid="([^"]+)"/),m=p?p[1]:a(d)||"heading",w=(i.get(m)||0)+1;i.set(m,w);const y=w===1?m:m+"-"+w;r.push({level:h,text:d,id:y});const _=s(h),A=((u||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${y}" class="${_}"`).trim();return`<h${h} ${A}>${g}</h${h}>`});try{const l=typeof document<"u"&&document.documentElement&&document.documentElement.getAttribute&&document.documentElement.getAttribute("data-nimbi-logo-moved")||"";if(l){const c=He();if(c){const u=c.parseFromString(o,"text/html");(u&&typeof u.getElementsByTagName=="function"?Array.from(u.getElementsByTagName("img")):u&&typeof u.querySelectorAll=="function"?Array.from(u.querySelectorAll("img")):[]).forEach(h=>{try{const d=h.getAttribute("src")||"";(d?new URL(d,location.href).toString():"")===l&&h.remove()}catch{}});try{typeof XMLSerializer<"u"?o=new XMLSerializer().serializeToString(u.body).replace(/^<body[^>]*>/i,"").replace(/<\/body>$/i,""):o=Array.from(u.body.childNodes||[]).map(d=>d&&typeof d.outerHTML=="string"?d.outerHTML:d&&typeof d.textContent=="string"?d.textContent:"").join("")}catch{try{o=u.body.innerHTML}catch{}}}else try{const u=l.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");o=o.replace(new RegExp(`<img[^>]*src=\\"${u}\\"[^>]*>`,"g"),"")}catch{}}}catch{}return{html:o,meta:n.meta||{},toc:r}}catch{return{html:n.html,meta:n.meta||{},toc:n.toc||[]}}}function En(e,t){const n=new Set,i=/```\s*([a-zA-Z0-9_\-+]+)?/g,r=new Set(["then","now","if","once","so","and","or","but","when","the","a","an","as","let","const","var","export","import","from","true","false","null","npm","run","echo","sudo","this","that","have","using","some","return","returns","function","console","log","error","warn","class","new","undefined","with","select","from","where","join","on","group","order","by","having","as","into","values","like","limit","offset","create","table","index","view","insert","update","delete","returning","and","or","not","all","any","exists","case","when","then","else","end","distance","geometry","you","which","would","why","cool","other","same","everything","check"]),a=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);let s;for(;s=i.exec(e);)if(s[1]){const o=s[1].toLowerCase();if(si.has(o)||t&&t.size&&o.length<3&&!t.has(o)&&!(dt&&dt[o]&&t.has(dt[o])))continue;if(t&&t.size){if(t.has(o)){const c=t.get(o);c&&n.add(c);continue}if(dt&&dt[o]){const c=dt[o];if(t.has(c)){const u=t.get(c)||c;n.add(u);continue}}}(a.has(o)||o.length>=5&&o.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(o)&&!r.has(o))&&n.add(o)}return n}async function Yr(e,t){if(At&&At.length||typeof process<"u"&&process.env&&process.env.VITEST)return En(e||"",t);if(wt&&wt())try{const i=t&&t.size?Array.from(t.keys()):[],r=await Si({type:"detect",md:String(e||""),supported:i});if(Array.isArray(r))return new Set(r)}catch(i){k("[markdown] detectFenceLanguagesAsync worker failed",i)}return En(e||"",t)}const vi=Object.freeze(Object.defineProperty({__proto__:null,_sendToRenderer:Si,_slugifyLocal:Kr,_splitIntoSections:ns,addMarkdownExtension:Xr,detectFenceLanguages:En,detectFenceLanguagesAsync:Yr,initRendererWorker:wt,markdownPlugins:At,parseMarkdownToHtml:hn,setMarkdownExtensions:tc,streamParseMarkdown:Vr},Symbol.toStringTag,{value:"Module"}));function nc(e,t=150,n={}){let i=null;const r=!!n.leading;return function(...s){const o=this;if(i&&clearTimeout(i),r&&!i)try{e.apply(o,s)}catch{}i=setTimeout(()=>{if(i=null,!r)try{e.apply(o,s)}catch{}},t)}}function rc(e){let t=!1;return function(...i){const r=this;if(!t){try{e.apply(r,i)}catch{}t=!0;const a=()=>{t=!1};typeof requestAnimationFrame=="function"?requestAnimationFrame(a):setTimeout(a,16);return}}}function ic(){let e=[],t=!1;return function(i){typeof i=="function"&&(e.push(i),!t&&(t=!0,typeof requestAnimationFrame=="function"?requestAnimationFrame(()=>{t=!1;const r=e.slice(0);e.length=0;for(const a of r)try{a()}catch{}}):setTimeout(()=>{t=!1;const r=e.slice(0);e.length=0;for(const a of r)try{a()}catch{}},0)))}}const ir=ic(),ac=`/**
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
`;onmessage=async e=>{const t=e.data||{};try{if(t.type==="rewriteAnchors"){const{id:n,html:i,contentBase:r,pagePath:a}=t;try{const s=He();if(!s)postMessage({id:n,result:i});else{const o=s.parseFromString(i||"","text/html"),l=o.body;await Ai(l,r,a,{canonical:!0}),postMessage({id:n,result:o.body.innerHTML})}}catch(s){postMessage({id:n,error:String(s)})}return}}catch(n){postMessage({id:t.id,error:String(n)})}};async function rs(e){try{if(e&&e.type==="rewriteAnchors"){const{id:t,html:n,contentBase:i,pagePath:r}=e;try{const a=He();if(!a)return{id:t,result:n};const s=a.parseFromString(n||"","text/html"),o=s.body;return await Ai(o,i,r,{canonical:!0}),{id:t,result:s.body.innerHTML}}catch(a){return{id:t,error:String(a)}}}return{id:e&&e.id,error:"unsupported message"}}catch(t){return{id:e&&e.id,error:String(t)}}}const sc=Object.freeze(Object.defineProperty({__proto__:null,handleAnchorWorkerMessage:rs},Symbol.toStringTag,{value:"Module"}));function ft(e,t=null){try{const n=typeof location<"u"&&location&&typeof location.pathname=="string"&&location.pathname||"/";return String(n)+Ui(e,t)}catch{return Ui(e,t)}}function oc(...e){try{k(...e)}catch{}}function fr(e){try{if(tn(3))return!0}catch{}try{if(typeof le=="string"&&le)return!0}catch{}try{if(Y&&Y.size)return!0}catch{}try{if($e&&$e.size)return!0}catch{}return!1}function vt(e,t){try{if(typeof rt=="function")try{rt(e,t);return}catch{}}catch{}try{e&&t&&Y&&typeof Y.set=="function"&&!Y.has(e)&&Y.set(e,t)}catch{}try{t&&G&&typeof G.set=="function"&&G.set(t,e)}catch{}try{if($e&&typeof $e.has=="function"){if(!$e.has(t)){try{$e.add(t)}catch{}try{Array.isArray(Oe)&&!Oe.includes(t)&&Oe.push(t)}catch{}}}else try{Array.isArray(Oe)&&!Oe.includes(t)&&Oe.push(t)}catch{}}catch{}}function lc(e,t){try{return new URL(e,t).pathname}catch{try{return new URL(e,typeof location<"u"?location.href:"http://localhost/").pathname}catch{try{return(String(t||"").replace(/\/$/,"")+"/"+String(e||"").replace(/^\//,"")).replace(/\/\\+/g,"/")}catch{return String(e||"")}}}}function Jr(e,t){try{if(!e)return e;if(!t)return String(e||"");const n=String(t||"").replace(/^\/+|\/+$/g,"");if(!n)return String(e||"");let i=String(e||"");i=i.replace(/^\/+/,"");const r=n+"/";for(;i.startsWith(r);)i=i.slice(r.length);return i===n?"":i}catch{return String(e||"")}}function cc(e,t){const n=document.createElement("aside");n.className="menu box nimbi-nav";const i=document.createElement("p");i.className="menu-label",i.textContent=e("navigation"),n.appendChild(i);const r=document.createElement("ul");r.className="menu-list";try{const a=document.createDocumentFragment();t.forEach(s=>{const o=document.createElement("li"),l=document.createElement("a");try{const c=String(s.path||"");try{l.setAttribute("href",Pe(c))}catch{c&&c.indexOf("/")===-1?l.setAttribute("href","#"+encodeURIComponent(c)):l.setAttribute("href",ft(c))}}catch{l.setAttribute("href","#"+s.path)}if(l.textContent=s.name,o.appendChild(l),s.children&&s.children.length){const c=document.createElement("ul");s.children.forEach(u=>{const g=document.createElement("li"),h=document.createElement("a");try{const d=String(u.path||"");try{h.setAttribute("href",Pe(d))}catch{d&&d.indexOf("/")===-1?h.setAttribute("href","#"+encodeURIComponent(d)):h.setAttribute("href",ft(d))}}catch{h.setAttribute("href","#"+u.path)}h.textContent=u.name,g.appendChild(h),c.appendChild(g)}),o.appendChild(c)}a.appendChild(o)}),r.appendChild(a)}catch{t.forEach(s=>{try{const o=document.createElement("li"),l=document.createElement("a");try{const c=String(s.path||"");try{l.setAttribute("href",Pe(c))}catch{c&&c.indexOf("/")===-1?l.setAttribute("href","#"+encodeURIComponent(c)):l.setAttribute("href",ft(c))}}catch{l.setAttribute("href","#"+s.path)}if(l.textContent=s.name,o.appendChild(l),s.children&&s.children.length){const c=document.createElement("ul");s.children.forEach(u=>{const g=document.createElement("li"),h=document.createElement("a");try{const d=String(u.path||"");try{h.setAttribute("href",Pe(d))}catch{d&&d.indexOf("/")===-1?h.setAttribute("href","#"+encodeURIComponent(d)):h.setAttribute("href",ft(d))}}catch{h.setAttribute("href","#"+u.path)}h.textContent=u.name,g.appendChild(h),c.appendChild(g)}),o.appendChild(c)}r.appendChild(o)}catch(o){k("[htmlBuilder] createNavTree item failed",o)}})}return n.appendChild(r),n}function uc(e,t,n=""){const i=document.createElement("aside");i.className="menu box nimbi-toc-inner is-hidden-mobile";const r=document.createElement("p");r.className="menu-label",r.textContent=e("onThisPage"),i.appendChild(r);const a=document.createElement("ul");a.className="menu-list";try{const o={};(t||[]).forEach(l=>{try{if(!l||l.level===1)return;const c=Number(l.level)>=2?Number(l.level):2,u=document.createElement("li"),g=document.createElement("a"),h=ho(l.text||""),d=l.id||de(h);g.textContent=h;try{const w=String(n||"").replace(/^[\\.\\/]+/,""),y=w&&G&&G.has&&G.has(w)?G.get(w):w;y?g.href=Pe(y,d):g.href=`#${encodeURIComponent(d)}`}catch(w){k("[htmlBuilder] buildTocElement href normalization failed",w),g.href=`#${encodeURIComponent(d)}`}if(u.appendChild(g),c===2){a.appendChild(u),o[2]=u,Object.keys(o).forEach(w=>{Number(w)>2&&delete o[w]});return}let p=c-1;for(;p>2&&!o[p];)p--;p<2&&(p=2);let m=o[p];if(!m){a.appendChild(u),o[c]=u;return}let f=m.querySelector("ul");f||(f=document.createElement("ul"),m.appendChild(f)),f.appendChild(u),o[c]=u}catch(c){k("[htmlBuilder] buildTocElement item failed",c,l)}})}catch(o){k("[htmlBuilder] buildTocElement failed",o)}return i.appendChild(a),a.querySelectorAll("li").length<=1?null:i}function is(e){e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(n=>{n.id||(n.id=de(n.textContent||""))})}function hc(e,t,n){try{const i=e.querySelectorAll("img");if(i&&i.length){const r=t&&t.includes("/")?t.substring(0,t.lastIndexOf("/")+1):"";i.forEach(a=>{const s=a.getAttribute("src")||"";if(s&&!(/^(https?:)?\/\//.test(s)||s.startsWith("/")))try{const o=new URL(r+s,n).toString();a.src=o;try{a.getAttribute("loading")||a.setAttribute("data-want-lazy","1")}catch(l){k("[htmlBuilder] set image loading attribute failed",l)}}catch(o){k("[htmlBuilder] resolve image src failed",o)}})}}catch(i){k("[htmlBuilder] lazyLoadImages failed",i)}}function sa(e,t,n){try{const i=t&&t.includes("/")?t.substring(0,t.lastIndexOf("/")+1):"";let r=null;try{const o=new URL(n,location.href);r=new URL(i||".",o).toString()}catch{try{r=new URL(i||".",location.href).toString()}catch{r=i||"./"}}let a=null;try{a=e.querySelectorAll("[src],[href],[srcset],[poster]")}catch{const l=[];try{l.push(...Array.from(e.getElementsByTagName("img")||[]))}catch{}try{l.push(...Array.from(e.getElementsByTagName("link")||[]))}catch{}try{l.push(...Array.from(e.getElementsByTagName("video")||[]))}catch{}try{l.push(...Array.from(e.getElementsByTagName("use")||[]))}catch{}try{l.push(...Array.from(e.querySelectorAll("[srcset]")||[]))}catch{}a=l}let s=Array.from(a||[]);try{const o=Array.from(e.getElementsByTagName("use")||[]);for(const l of o)s.indexOf(l)===-1&&s.push(l)}catch{}for(const o of Array.from(s||[]))try{const l=o.tagName?o.tagName.toLowerCase():"",c=u=>{try{const g=o.getAttribute(u)||"";if(!g||/^(https?:)?\/\//i.test(g)||g.startsWith("/")||g.startsWith("#"))return;try{o.setAttribute(u,new URL(g,r).toString())}catch(h){k("[htmlBuilder] rewrite asset attribute failed",u,g,h)}}catch(g){k("[htmlBuilder] rewriteAttr failed",g)}};if(o.hasAttribute&&o.hasAttribute("src")&&c("src"),o.hasAttribute&&o.hasAttribute("href")&&l!=="a"&&c("href"),o.hasAttribute&&o.hasAttribute("xlink:href")&&c("xlink:href"),o.hasAttribute&&o.hasAttribute("poster")&&c("poster"),o.hasAttribute&&o.hasAttribute("srcset")){const h=(o.getAttribute("srcset")||"").split(",").map(d=>d.trim()).filter(Boolean).map(d=>{const[p,m]=d.split(/\s+/,2);if(!p||/^(https?:)?\/\//i.test(p)||p.startsWith("/"))return d;try{const f=new URL(p,r).toString();return m?`${f} ${m}`:f}catch{return d}}).join(", ");o.setAttribute("srcset",h)}}catch(l){k("[htmlBuilder] rewriteRelativeAssets node processing failed",l)}}catch(i){k("[htmlBuilder] rewriteRelativeAssets failed",i)}}let oa="",Pr=null,la="";async function Ai(e,t,n,i={}){try{i=i||{},typeof i.canonical>"u"&&(i.canonical=!0);const r=e.querySelectorAll("a");if(!r||!r.length)return;let a,s;if(t===oa&&Pr)a=Pr,s=la;else{try{a=new URL(t,location.href),s=Yt(a.pathname)}catch{try{a=new URL(t,location.href),s=Yt(a.pathname)}catch{a=null,s="/"}}oa=t,Pr=a,la=s}const o=new Set,l=[],c=new Set,u=[];for(const g of Array.from(r))try{try{if(g.closest&&g.closest("h1,h2,h3,h4,h5,h6"))continue}catch{}const h=g.getAttribute("href")||"";if(!h||qr(h))continue;try{if(h.startsWith("?")||h.indexOf("?")!==-1)try{const p=new URL(h,t||location.href),m=p.searchParams.get("page");if(m&&m.indexOf("/")===-1&&n){const f=n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"";if(f){const w=J(f+m),y=i&&i.canonical?Pe(w,p.hash?p.hash.replace(/^#/,""):null):ft(w,p.hash?p.hash.replace(/^#/,""):null);g.setAttribute("href",y);continue}}}catch{}}catch{}if(h.startsWith("/")&&!h.endsWith(".md"))continue;const d=h.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(d){let p=d[1];const m=d[2];!p.startsWith("/")&&n&&(p=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+p);try{const f=new URL(p,t).pathname;let w=f.startsWith(s)?f.slice(s.length):f;w=Jr(w,s),w=J(w),l.push({node:g,mdPathRaw:p,frag:m,rel:w}),G.has(w)||o.add(w)}catch(f){k("[htmlBuilder] resolve mdPath failed",f)}continue}try{let p=h;!h.startsWith("/")&&n&&(h.startsWith("#")?p=n+h:p=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+h);const f=new URL(p,t).pathname||"";if(f&&f.indexOf(s)!==-1){let w=f.startsWith(s)?f.slice(s.length):f;if(w=Jr(w,s),w=J(w),w=cn(w),w||(w=Ot),!w.endsWith(".md")){let y=null;try{if(G&&G.has&&G.has(w))y=G.get(w);else try{const _=String(w||"").replace(/^.*\//,"");_&&G.has&&G.has(_)&&(y=G.get(_))}catch(_){k("[htmlBuilder] mdToSlug baseName check failed",_)}}catch(_){k("[htmlBuilder] mdToSlug access check failed",_)}if(!y)try{const _=String(w||"").replace(/^.*\//,"");for(const[b,A]of Y||[])if(A===w||A===_){y=b;break}}catch{}if(y){const _=i&&i.canonical?Pe(y,null):ft(y);g.setAttribute("href",_)}else{let _=w;try{/\.[^\/]+$/.test(String(w||""))||(_=String(w||"")+".html")}catch{_=w}c.add(_),u.push({node:g,rel:_})}}}}catch(p){k("[htmlBuilder] resolving href to URL failed",p)}}catch(h){k("[htmlBuilder] processing anchor failed",h)}if(o.size)if(fr(t))await Rn(Array.from(o),async g=>{try{try{const d=String(g).match(/([^\/]+)\.md$/),p=d&&d[1];if(p&&Y.has(p)){try{const m=Y.get(p);if(m)try{const f=typeof m=="string"?m:m&&m.default?m.default:null;f&&vt(p,f)}catch(f){k("[htmlBuilder] _storeSlugMapping failed",f)}}catch(m){k("[htmlBuilder] reading slugToMd failed",m)}return}}catch(d){k("[htmlBuilder] basename slug lookup failed",d)}const h=await Be(g,t);if(h&&h.raw){const d=(h.raw||"").match(/^#\s+(.+)$/m);if(d&&d[1]){const p=de(d[1].trim());if(p)try{vt(p,g)}catch(m){k("[htmlBuilder] setting slug mapping failed",m)}}}}catch(h){k("[htmlBuilder] fetchMarkdown during rewriteAnchors failed",h)}},6);else{try{k("[htmlBuilder] skipping md title probes (probing disabled)")}catch{}for(const g of Array.from(o))try{const h=String(g).match(/([^\/]+)\.md$/),d=h&&h[1];if(d){const p=de(d);if(p)try{vt(p,g)}catch(m){k("[htmlBuilder] setting fallback slug mapping failed",m)}}}catch{}}if(c.size)if(fr(t))await Rn(Array.from(c),async g=>{try{const h=await Be(g,t);if(h&&h.raw)try{const d=He(),p=d?d.parseFromString(h.raw,"text/html"):null,m=p?p.querySelector("title"):null,f=p?p.querySelector("h1"):null,w=m&&m.textContent&&m.textContent.trim()?m.textContent.trim():f&&f.textContent?f.textContent.trim():null;if(w){const y=de(w);if(y)try{vt(y,g)}catch(_){k("[htmlBuilder] setting html slug mapping failed",_)}}}catch(d){k("[htmlBuilder] parse fetched HTML failed",d)}}catch(h){k("[htmlBuilder] fetchMarkdown for htmlPending failed",h)}},5);else{try{k("[htmlBuilder] skipping html title probes (probing disabled)")}catch{}for(const g of Array.from(c))try{const h=String(g).match(/([^\/]+)\.html$/),d=h&&h[1];if(d){const p=de(d);if(p)try{vt(p,g)}catch(m){k("[htmlBuilder] setting fallback html slug mapping failed",m)}}}catch{}}for(const g of l){const{node:h,frag:d,rel:p}=g;let m=null;try{G.has(p)&&(m=G.get(p))}catch(f){k("[htmlBuilder] mdToSlug access failed",f)}if(m){const f=i&&i.canonical?Pe(m,d):ft(m,d);h.setAttribute("href",f)}else{const f=i&&i.canonical?Pe(p,d):ft(p,d);h.setAttribute("href",f)}}for(const g of u){const{node:h,rel:d}=g;let p=null;try{G.has(d)&&(p=G.get(d))}catch(m){k("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo",m)}if(!p)try{const m=String(d||"").replace(/^.*\//,"");G.has(m)&&(p=G.get(m))}catch(m){k("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo",m)}if(p){const m=i&&i.canonical?Pe(p,null):ft(p);h.setAttribute("href",m)}else{const m=i&&i.canonical?Pe(d,null):ft(d);h.setAttribute("href",m)}}}catch(r){k("[htmlBuilder] rewriteAnchors failed",r)}}function dc(e,t,n,i){const r=t.querySelector("h1"),a=r?(r.textContent||"").trim():"";let s="";try{let o="";try{e&&e.meta&&e.meta.title&&(o=String(e.meta.title).trim())}catch{}if(!o&&a&&(o=a),!o)try{const l=t.querySelector("h2");l&&l.textContent&&(o=String(l.textContent).trim())}catch{}!o&&n&&(o=String(n)),o&&(s=de(o)),s||(s=Ot);try{if(n){try{vt(s,n)}catch(l){k("[htmlBuilder] computeSlug set slug mapping failed",l)}try{const l=J(String(n||""));if(G&&typeof G.has=="function"&&G.has(l))s=G.get(l);else try{for(const[c,u]of Y||[])try{const g=typeof u=="string"?u:u&&u.default?u.default:null;if(g&&J(String(g))===l){s=c;break}}catch{}}catch{}}catch{}}}catch(l){k("[htmlBuilder] computeSlug set slug mapping failed",l)}try{let l=i||"";if(!l)try{const c=Je(typeof location<"u"?location.href:"");c&&c.anchor&&c.page&&String(c.page)===String(s)?l=c.anchor:l=""}catch{l=""}try{history.replaceState({page:s},"",ft(s,l))}catch(c){k("[htmlBuilder] computeSlug history replace failed",c)}}catch(l){k("[htmlBuilder] computeSlug inner failed",l)}}catch(o){k("[htmlBuilder] computeSlug failed",o)}try{if(e&&e.meta&&e.meta.title&&r){const o=String(e.meta.title).trim();if(o&&o!==a){try{s&&(r.id=s)}catch{}try{if(Array.isArray(e.toc))for(const l of e.toc)try{if(l&&Number(l.level)===1&&String(l.text).trim()===(a||"").trim()){l.id=s;break}}catch{}}catch{}}}}catch{}return{topH1:r,h1Text:a,slugKey:s}}async function fc(e,t){if(!e||!e.length)return;const n=new Set;for(const s of Array.from(e||[]))try{const o=s.getAttribute("href")||"";if(!o)continue;let u=J(o).split(/::|#/,2)[0];try{const h=u.indexOf("?");h!==-1&&(u=u.slice(0,h))}catch{}if(!u||(u.includes(".")||(u=u+".html"),!/\.html(?:$|[?#])/.test(u)&&!u.toLowerCase().endsWith(".html")))continue;const g=u;try{if(G&&G.has&&G.has(g))continue}catch(h){k("[htmlBuilder] mdToSlug check failed",h)}try{let h=!1;for(const d of Y.values())if(d===g){h=!0;break}if(h)continue}catch(h){k("[htmlBuilder] slugToMd iteration failed",h)}n.add(g)}catch(o){k("[htmlBuilder] preScanHtmlSlugs anchor iteration failed",o)}if(!n.size)return;if(!fr()){try{k("[htmlBuilder] skipping preScanHtmlSlugs (probing disabled)")}catch{}for(const s of Array.from(n))try{const o=String(s).match(/([^\/]+)\.html$/),l=o&&o[1];if(l){const c=de(l);if(c)try{vt(c,s)}catch(u){k("[htmlBuilder] setting fallback preScanHtmlSlugs mapping failed",u)}}}catch{}return}const i=async s=>{try{const o=await Be(s,t);if(o&&o.raw)try{const c=He().parseFromString(o.raw,"text/html"),u=c.querySelector("title"),g=c.querySelector("h1"),h=u&&u.textContent&&u.textContent.trim()?u.textContent.trim():g&&g.textContent?g.textContent.trim():null;if(h){const d=de(h);if(d)try{vt(d,s)}catch(p){k("[htmlBuilder] set slugToMd/mdToSlug failed",p)}}}catch(l){k("[htmlBuilder] parse HTML title failed",l)}}catch(o){k("[htmlBuilder] fetchAndExtract failed",o)}},r=Array.from(n),a=Math.max(1,Math.min(Sn(),r.length||1));await Rn(r,i,a)}async function gc(e,t){if(!e||!e.length)return;const n=[],i=new Set;let r="";try{const a=new URL(t,typeof location<"u"?location.href:"http://localhost/");r=Yt(a.pathname)}catch(a){r="",k("[htmlBuilder] preMapMdSlugs parse base failed",a)}for(const a of Array.from(e||[]))try{const s=a.getAttribute("href")||"";if(!s)continue;const o=s.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(o){let l=J(o[1]);try{let c;try{c=lc(l,t)}catch(g){c=l,k("[htmlBuilder] resolve mdPath URL failed",g)}let u=c&&r&&c.startsWith(r)?c.slice(r.length):String(c||"").replace(/^\//,"");u=Jr(u,r),n.push({rel:u}),G.has(u)||i.add(u)}catch(c){k("[htmlBuilder] rewriteAnchors failed",c)}continue}}catch(s){k("[htmlBuilder] preMapMdSlugs anchor iteration failed",s)}if(i.size)if(fr())await Promise.all(Array.from(i).map(async a=>{try{const s=String(a).match(/([^\/]+)\.md$/),o=s&&s[1];if(o&&Y.has(o)){try{const l=Y.get(o);if(l)try{const c=typeof l=="string"?l:l&&l.default?l.default:null;c&&vt(o,c)}catch(c){k("[htmlBuilder] _storeSlugMapping failed",c)}}catch(l){k("[htmlBuilder] preMapMdSlugs slug map access failed",l)}return}}catch(s){k("[htmlBuilder] preMapMdSlugs basename check failed",s)}try{const s=await Be(a,t);if(s&&s.raw){const o=(s.raw||"").match(/^#\s+(.+)$/m);if(o&&o[1]){const l=de(o[1].trim());if(l)try{vt(l,a)}catch(c){k("[htmlBuilder] preMapMdSlugs setting slug mapping failed",c)}}}}catch(s){k("[htmlBuilder] preMapMdSlugs fetch failed",s)}}));else try{k("[htmlBuilder] skipping preMapMdSlugs probes (probing disabled)")}catch{}}He();function Ir(e){try{const n=He().parseFromString(e||"","text/html");is(n);try{n.querySelectorAll("img").forEach(l=>{try{l.getAttribute("loading")||l.setAttribute("data-want-lazy","1")}catch(c){k("[htmlBuilder] parseHtml set image loading attribute failed",c)}})}catch(o){k("[htmlBuilder] parseHtml query images failed",o)}n.querySelectorAll("pre code, code[class]").forEach(o=>{try{const l=o.getAttribute&&o.getAttribute("class")||o.className||"",c=l.match(/language-([a-zA-Z0-9_+-]+)/)||l.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(c&&c[1]){const u=(c[1]||"").toLowerCase(),g=Ce.size&&(Ce.get(u)||Ce.get(String(u).toLowerCase()))||u;try{(async()=>{try{await ln(g)}catch(h){k("[htmlBuilder] registerLanguage failed",h)}})()}catch(h){k("[htmlBuilder] schedule registerLanguage failed",h)}}else try{if(Re&&typeof Re.getLanguage=="function"&&Re.getLanguage("plaintext")){const u=Re.highlight?Re.highlight(o.textContent||"",{language:"plaintext"}):null;if(u&&u.value)try{if(typeof document<"u"&&document.createRange&&typeof document.createRange=="function"){const g=document.createRange().createContextualFragment(u.value);if(typeof o.replaceChildren=="function")o.replaceChildren(...Array.from(g.childNodes));else{for(;o.firstChild;)o.removeChild(o.firstChild);o.appendChild(g)}}else o.innerHTML=u.value}catch{try{o.innerHTML=u.value}catch{}}}}catch(u){k("[htmlBuilder] plaintext highlight fallback failed",u)}}catch(l){k("[htmlBuilder] code element processing failed",l)}});const r=[];n.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(o=>{r.push({level:Number(o.tagName.substring(1)),text:(o.textContent||"").trim(),id:o.id})});const s={};try{const o=n.querySelector("title");o&&o.textContent&&String(o.textContent).trim()&&(s.title=String(o.textContent).trim())}catch{}return{html:n.body.innerHTML,meta:s,toc:r}}catch(t){return k("[htmlBuilder] parseHtml failed",t),{html:e||"",meta:{},toc:[]}}}async function as(e){const t=Yr?await Yr(e||"",Ce):En(e||"",Ce),n=new Set(t),i=[];for(const r of n)try{const a=Ce.size&&(Ce.get(r)||Ce.get(String(r).toLowerCase()))||r;try{i.push(ln(a))}catch(s){k("[htmlBuilder] ensureLanguages push canonical failed",s)}if(String(r)!==String(a))try{i.push(ln(r))}catch(s){k("[htmlBuilder] ensureLanguages push alias failed",s)}}catch(a){k("[htmlBuilder] ensureLanguages inner failed",a)}try{await Promise.all(i)}catch(r){k("[htmlBuilder] ensureLanguages failed",r)}}async function pc(e){if(await as(e),hn){const t=await hn(e||"");return!t||typeof t!="object"?{html:String(e||""),meta:{},toc:[]}:(Array.isArray(t.toc)||(t.toc=[]),t.meta||(t.meta={}),t)}return{html:String(e||""),meta:{},toc:[]}}async function mc(e,t,n,i,r){let a=null,s=null;if(t.isHtml)try{const h=He();if(h){const d=h.parseFromString(t.raw||"","text/html");try{sa(d.body,n,r)}catch(p){k("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)",p)}a=Ir(d.documentElement&&d.documentElement.outerHTML?d.documentElement.outerHTML:t.raw||"")}else a=Ir(t.raw||"")}catch{a=Ir(t.raw||"")}else{const h=t.raw||"",d=64*1024;if(h&&h.length>d&&Vr){try{await as(h)}catch{}s=document.createElement("article"),s.className="nimbi-article content";const p=[];let m={};try{await Vr(h,(f,w)=>{try{w&&w.meta&&(m=Object.assign(m,w.meta))}catch{}try{w&&Array.isArray(w.toc)&&w.toc.length&&p.push(...w.toc)}catch{}try{ir(()=>{try{const y=He();if(y){const _=y.parseFromString(String(f||""),"text/html"),b=Array.from(_.body.childNodes||[]);b.length?s.append(...b):s.insertAdjacentHTML("beforeend",f||"")}else{const _=document&&typeof document.createRange=="function"?document.createRange():null;if(_&&typeof _.createContextualFragment=="function"){const b=_.createContextualFragment(String(f||""));s.append(...Array.from(b.childNodes))}else s.insertAdjacentHTML("beforeend",f||"")}}catch{try{s.insertAdjacentHTML("beforeend",f||"")}catch{}}})}catch{}},{chunkSize:d})}catch(f){k("[htmlBuilder] streamParseMarkdown failed, falling back",f)}a={html:s.innerHTML,meta:m||{},toc:p}}else a=await pc(t.raw||"")}let o;if(s)o=s;else{o=document.createElement("article"),o.className="nimbi-article content";try{const h=He&&He();if(h){const d=h.parseFromString(String(a.html||""),"text/html"),p=Array.from(d.body.childNodes||[]);p.length?o.replaceChildren(...p):o.innerHTML=a.html}else try{const d=document&&typeof document.createRange=="function"?document.createRange():null;if(d&&typeof d.createContextualFragment=="function"){const p=d.createContextualFragment(String(a.html||""));o.replaceChildren(...Array.from(p.childNodes))}else o.innerHTML=a.html}catch{o.innerHTML=a.html}}catch{try{o.innerHTML=a.html}catch(d){k("[htmlBuilder] set article html failed",d)}}}try{sa(o,n,r)}catch(h){k("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle",h)}try{is(o)}catch(h){k("[htmlBuilder] addHeadingIds failed",h)}try{o.querySelectorAll("pre code, code[class]").forEach(d=>{try{const p=d.getAttribute&&d.getAttribute("class")||d.className||"",m=String(p||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(m)try{d.setAttribute&&d.setAttribute("class",m)}catch(f){d.className=m,k("[htmlBuilder] set element class failed",f)}else try{d.removeAttribute&&d.removeAttribute("class")}catch(f){d.className="",k("[htmlBuilder] remove element class failed",f)}}catch(p){k("[htmlBuilder] code element cleanup failed",p)}})}catch(h){k("[htmlBuilder] processing code elements failed",h)}try{ba(o)}catch(h){k("[htmlBuilder] observeCodeBlocks failed",h)}hc(o,n,r);try{(o.querySelectorAll&&o.querySelectorAll("img")||[]).forEach(d=>{try{const p=d.parentElement;if(!p||p.tagName.toLowerCase()!=="p"||p.childNodes.length!==1)return;const m=document.createElement("figure");m.className="image",p.replaceWith(m),m.appendChild(d)}catch{}})}catch(h){k("[htmlBuilder] wrap images in Bulma image helper failed",h)}try{(o.querySelectorAll&&o.querySelectorAll("table")||[]).forEach(d=>{try{if(d.classList)d.classList.contains("table")||d.classList.add("table");else{const p=d.getAttribute&&d.getAttribute("class")?d.getAttribute("class"):"",m=String(p||"").split(/\s+/).filter(Boolean);m.indexOf("table")===-1&&m.push("table");try{d.setAttribute&&d.setAttribute("class",m.join(" "))}catch{d.className=m.join(" ")}}}catch{}})}catch(h){k("[htmlBuilder] add Bulma table class failed",h)}const{topH1:l,h1Text:c,slugKey:u}=dc(a,o,n,i);try{if(l&&a&&a.meta&&(a.meta.author||a.meta.date)&&!(l.parentElement&&l.parentElement.querySelector&&l.parentElement.querySelector(".nimbi-article-subtitle"))){const d=a.meta.author?String(a.meta.author).trim():"",p=a.meta.date?String(a.meta.date).trim():"";let m="";try{const w=new Date(p);p&&!isNaN(w.getTime())?m=w.toLocaleDateString():m=p}catch{m=p}const f=[];if(d&&f.push(d),m&&f.push(m),f.length){const w=document.createElement("p"),y=f[0]?String(f[0]).replace(/"/g,"").trim():"",_=f.slice(1);if(w.className="nimbi-article-subtitle is-6 has-text-grey-light",y){const b=document.createElement("span");b.className="nimbi-article-author",b.textContent=y,w.appendChild(b)}if(_.length){const b=document.createElement("span");b.className="nimbi-article-meta",b.textContent=_.join(" • "),w.appendChild(b)}try{l.parentElement.insertBefore(w,l.nextSibling)}catch{try{l.insertAdjacentElement("afterend",w)}catch{}}}}}catch{}try{await _c(o,r,n)}catch(h){oc("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread",h),await Ai(o,r,n)}const g=uc(e,a.toc,n);return{article:o,parsed:a,toc:g,topH1:l,h1Text:c,slugKey:u}}function yc(e){if(!(!e||!e.querySelectorAll))try{const t=Array.from(e.querySelectorAll("script"));for(const n of t)try{const i=document.createElement("script");for(const a of Array.from(n.attributes||[]))try{i.setAttribute(a.name,a.value)}catch{}if(!n.src){const a=n.textContent||"";let s=!1;try{new Function(a)(),s=!0}catch{s=!1}if(s){n.parentNode&&n.parentNode.removeChild(n);try{$t("[htmlBuilder] executed inline script via Function")}catch{}continue}try{i.type="module"}catch{}i.textContent=a}if(n.src)try{if(document.querySelector&&document.querySelector(`script[src="${n.src}"]`)){n.parentNode&&n.parentNode.removeChild(n);continue}}catch{}const r=n.src||"<inline>";i.addEventListener("error",a=>{try{k("[htmlBuilder] injected script error",{src:r,ev:a})}catch{}}),i.addEventListener("load",()=>{try{$t("[htmlBuilder] injected script loaded",{src:r,hasNimbi:!!(window&&window.nimbiCMS)})}catch{}});try{(document.head||document.body||document.documentElement).appendChild(i)}catch{try{try{i.type="text/javascript"}catch{}(document.head||document.body||document.documentElement).appendChild(i)}catch(s){try{k("[htmlBuilder] injected script append failed, skipping",{src:r,err:s})}catch{}}}n.parentNode&&n.parentNode.removeChild(n);try{$t("[htmlBuilder] executed injected script",r)}catch{}}catch(i){k("[htmlBuilder] execute injected script failed",i)}}catch{}}function ca(e,t,n){if(e)try{typeof e.replaceChildren=="function"?e.replaceChildren():e.innerHTML=""}catch{try{e.innerHTML=""}catch{}}const i=document.createElement("article");i.className="nimbi-article content nimbi-not-found";const r=document.createElement("h1");r.textContent=t&&t("notFound")||"Page not found";const a=document.createElement("p");a.textContent=n&&n.message?String(n.message):"Failed to resolve the requested page.",i.appendChild(r),i.appendChild(a),e&&e.appendChild&&e.appendChild(i);try{if(!le)try{const s=document.createElement("p"),o=t&&t("goHome")||"Go back to";s.textContent=o+" ";const l=document.createElement("a");try{l.href=Pe(ot)}catch{l.href=Pe(ot||"")}l.textContent=t&&t("home")||"Home",s.appendChild(l),e&&e.appendChild&&e.appendChild(s)}catch{}}catch{}try{try{nr({title:t&&t("notFound")||"Not Found",description:t&&t("notFoundDescription")||""},le,t&&t("notFound")||"Not Found",t&&t("notFoundDescription")||"")}catch{}}catch{}try{try{const s=typeof window<"u"&&window.__nimbiNotFoundRedirect?String(window.__nimbiNotFoundRedirect).trim():null;if(s)try{const o=new URL(s,location.origin).toString();if((location.href||"").split("#")[0]!==o)try{location.replace(o)}catch{location.href=o}}catch{}}catch{}}catch{}}const ss=oo(ac,sc&&rs,"anchor");function bc(){return ss.get()}function wc(e){return ss.send(e,2e3)}async function _c(e,t,n){if(!bc())throw new Error("anchor worker unavailable");if(!e||typeof e.innerHTML!="string")throw new Error("invalid article element");const r=String(e.innerHTML),a=await wc({type:"rewriteAnchors",html:r,contentBase:t,pagePath:n});if(a&&typeof a=="string")try{const s=He&&He();if(s){const o=s.parseFromString(String(a||""),"text/html"),l=Array.from(o.body.childNodes||[]);l.length?e.replaceChildren(...l):e.innerHTML=a}else try{const o=document&&typeof document.createRange=="function"?document.createRange():null;if(o&&typeof o.createContextualFragment=="function"){const l=o.createContextualFragment(String(a||""));e.replaceChildren(...Array.from(l.childNodes))}else e.innerHTML=a}catch{e.innerHTML=a}}catch(s){k("[htmlBuilder] applying rewritten anchors failed",s)}}function kc(e){try{e.addEventListener("click",t=>{const n=t.target&&t.target.closest?t.target.closest("a"):null;if(!n)return;const i=n.getAttribute("href")||"";try{const r=Je(i),a=r&&r.page?r.page:null,s=r&&r.anchor?r.anchor:null;if(!a&&!s)return;t.preventDefault();let o=null;try{history&&history.state&&history.state.page&&(o=history.state.page)}catch(l){o=null,k("[htmlBuilder] access history.state failed",l)}try{o||(o=new URL(location.href).searchParams.get("page"))}catch(l){k("[htmlBuilder] parse current location failed",l)}if(!a&&s||a&&o&&String(a)===String(o)){try{if(!a&&s)try{history.replaceState(history.state,"",(location.pathname||"")+(location.search||"")+(s?"#"+encodeURIComponent(s):""))}catch(l){k("[htmlBuilder] history.replaceState failed",l)}else try{history.replaceState({page:o||a},"",ft(o||a,s))}catch(l){k("[htmlBuilder] history.replaceState failed",l)}}catch(l){k("[htmlBuilder] update history for anchor failed",l)}try{t.stopImmediatePropagation&&t.stopImmediatePropagation(),t.stopPropagation&&t.stopPropagation()}catch(l){k("[htmlBuilder] stopPropagation failed",l)}try{ei(s)}catch(l){k("[htmlBuilder] scrollToAnchorOrTop failed",l)}return}history.pushState({page:a},"",ft(a,s));try{if(typeof window<"u"&&typeof window.renderByQuery=="function")try{window.renderByQuery()}catch(l){k("[htmlBuilder] window.renderByQuery failed",l)}else if(typeof window<"u")try{window.dispatchEvent(new PopStateEvent("popstate"))}catch(l){k("[htmlBuilder] dispatch popstate failed",l)}else try{renderByQuery()}catch(l){k("[htmlBuilder] renderByQuery failed",l)}}catch(l){k("[htmlBuilder] SPA navigation invocation failed",l)}}catch(r){k("[htmlBuilder] non-URL href in attachTocClickHandler",r)}})}catch(t){k("[htmlBuilder] attachTocClickHandler failed",t)}}function ei(e){const t=document.querySelector(".nimbi-cms")||null;if(e){const n=document.getElementById(e);if(n)try{const i=()=>{try{if(t&&t.scrollTo&&t.contains(n)){const r=n.getBoundingClientRect().top-t.getBoundingClientRect().top+t.scrollTop;t.scrollTo({top:r,behavior:"smooth"})}else try{n.scrollIntoView({behavior:"smooth",block:"start"})}catch{try{n.scrollIntoView()}catch(a){k("[htmlBuilder] scrollIntoView failed",a)}}}catch{try{n.scrollIntoView()}catch(a){k("[htmlBuilder] final scroll fallback failed",a)}}};try{requestAnimationFrame(()=>setTimeout(i,50))}catch(r){k("[htmlBuilder] scheduling scroll failed",r),setTimeout(i,50)}}catch(i){try{n.scrollIntoView()}catch(r){k("[htmlBuilder] final scroll fallback failed",r)}k("[htmlBuilder] doScroll failed",i)}}else try{t&&t.scrollTo?t.scrollTo({top:0,behavior:"smooth"}):window.scrollTo(0,0)}catch(n){try{window.scrollTo(0,0)}catch(i){k("[htmlBuilder] window.scrollTo failed",i)}k("[htmlBuilder] scroll to top failed",n)}}function xc(e,t,{mountOverlay:n=null,container:i=null,mountEl:r=null,navWrap:a=null,t:s=null}={}){try{const o=s||(m=>typeof m=="string"?m:""),l=i||document.querySelector(".nimbi-cms"),c=r||document.querySelector(".nimbi-mount"),u=n||document.querySelector(".nimbi-overlay"),g=a||document.querySelector(".nimbi-nav-wrap");let d=document.querySelector(".nimbi-scroll-top");if(!d){d=document.createElement("button"),d.className="nimbi-scroll-top button is-primary is-rounded is-small",d.setAttribute("aria-label",o("scrollToTop")),d.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';try{u&&u.appendChild?u.appendChild(d):l&&l.appendChild?l.appendChild(d):c&&c.appendChild?c.appendChild(d):document.body.appendChild(d)}catch{try{document.body.appendChild(d)}catch(f){k("[htmlBuilder] append scroll top button failed",f)}}try{try{ka(d)}catch{}}catch(m){k("[htmlBuilder] set scroll-top button theme registration failed",m)}d.addEventListener("click",()=>{try{i&&i.scrollTo?i.scrollTo({top:0,left:0,behavior:"smooth"}):r&&r.scrollTo?r.scrollTo({top:0,left:0,behavior:"smooth"}):window.scrollTo({top:0,left:0,behavior:"smooth"})}catch{try{i&&(i.scrollTop=0)}catch(f){k("[htmlBuilder] fallback container scrollTop failed",f)}try{r&&(r.scrollTop=0)}catch(f){k("[htmlBuilder] fallback mountEl scrollTop failed",f)}try{document.documentElement.scrollTop=0}catch(f){k("[htmlBuilder] fallback document scrollTop failed",f)}}})}const p=g&&g.querySelector?g.querySelector(".menu-label"):null;if(t){if(!d._nimbiObserver)if(typeof globalThis<"u"&&typeof globalThis.IntersectionObserver<"u"){const m=globalThis.IntersectionObserver,f=new m(w=>{for(const y of w)y.target instanceof Element&&(y.isIntersecting?(d.classList.remove("show"),p&&p.classList.remove("show")):(d.classList.add("show"),p&&p.classList.add("show")))},{root:i instanceof Element?i:r instanceof Element?r:null,threshold:0});d._nimbiObserver=f}else d._nimbiObserver=null;try{d._nimbiObserver&&typeof d._nimbiObserver.disconnect=="function"&&d._nimbiObserver.disconnect()}catch(m){k("[htmlBuilder] observer disconnect failed",m)}try{d._nimbiObserver&&typeof d._nimbiObserver.observe=="function"&&d._nimbiObserver.observe(t)}catch(m){k("[htmlBuilder] observer observe failed",m)}try{const m=()=>{try{const f=l instanceof Element?l.getBoundingClientRect():{top:0,bottom:window.innerHeight},w=t.getBoundingClientRect();!(w.bottom<f.top||w.top>f.bottom)?(d.classList.remove("show"),p&&p.classList.remove("show")):(d.classList.add("show"),p&&p.classList.add("show"))}catch(f){k("[htmlBuilder] checkIntersect failed",f)}};m(),typeof globalThis<"u"&&typeof globalThis.IntersectionObserver<"u"||setTimeout(m,100)}catch(m){k("[htmlBuilder] checkIntersect outer failed",m)}}else{d.classList.remove("show"),p&&p.classList.remove("show");const m=i instanceof Element?i:r instanceof Element?r:window,f=()=>{try{(m===window?window.scrollY:m.scrollTop||0)>10?(d.classList.add("show"),p&&p.classList.add("show")):(d.classList.remove("show"),p&&p.classList.remove("show"))}catch(w){k("[htmlBuilder] onScroll handler failed",w)}};lr(()=>m.addEventListener("scroll",rc(f))),f()}}catch(o){k("[htmlBuilder] ensureScrollTopButton failed",o)}}function rn(e,t){try{if(typeof rt=="function")try{rt(e,t);return}catch{}}catch{}try{e&&t&&Y&&typeof Y.set=="function"&&!Y.has(e)&&Y.set(e,t)}catch{}try{t&&G&&typeof G.set=="function"&&G.set(t,e)}catch{}try{if($e&&typeof $e.has=="function"){if(!$e.has(t)){try{$e.add(t)}catch{}try{Array.isArray(Oe)&&!Oe.includes(t)&&Oe.push(t)}catch{}}}else try{Array.isArray(Oe)&&!Oe.includes(t)&&Oe.push(t)}catch{}}catch{}}function ua(e,t){try{if(!e)return;try{const n=e[t];if(typeof n<"u")return n}catch{}try{if(e.default)return e.default[t]}catch{}return}catch{return}}function Sc(e){try{if(!Array.isArray(e))return e;e.forEach(t=>{try{if(!t||typeof t!="object")return;let n=typeof t.slug=="string"?String(t.slug):"",i=null;if(n&&n.indexOf("::")!==-1){const o=n.split("::");n=o[0]||"",i=o.slice(1).join("::")||null}const r=!!(n&&(n.indexOf(".")!==-1||n.indexOf("/")!==-1));let a="";try{if(t.path&&typeof t.path=="string"){const o=J(String(t.path||""));if(a=findSlugForPath(o)||(G&&G.has(o)?G.get(o):"")||"",!a)if(t.title&&String(t.title).trim())a=de(String(t.title).trim());else{const l=o.replace(/^.*\//,"").replace(/\.(?:md|html?)$/i,"");a=de(l||o)}}else if(r){const o=String(n).replace(/\.(?:md|html?)$/i,""),l=findSlugForPath(o)||(G&&G.has(o)?G.get(o):"")||"";l?a=l:t.title&&String(t.title).trim()?a=de(String(t.title).trim()):a=de(o)}else!n&&t.title&&String(t.title).trim()?a=de(String(t.title).trim()):a=n||""}catch{try{a=t.title&&String(t.title).trim()?de(String(t.title).trim()):n?de(n):""}catch{a=n}}let s=a||"";i&&(s=s?`${s}::${i}`:`${de(i)}`),s&&(t.slug=s);try{if(t.path&&s){const o=String(s).split("::")[0];try{rn(o,J(String(t.path||"")))}catch{}}}catch{}}catch{}})}catch{}return e}async function vc(e,t,n,i,r,a,s,o,l="eager",c=1,u=void 0,g="favicon"){if(!e||!(e instanceof HTMLElement))throw new TypeError("navbarWrap must be an HTMLElement");const h=He(),d=h?h.parseFromString(n||"","text/html"):null,p=d?d.querySelectorAll("a"):[];await lr(()=>fc(p,i)),await lr(()=>gc(p,i));try{ie(p,i)}catch{}try{if(t&&t instanceof HTMLElement&&(!t.hasAttribute||!t.hasAttribute("role")))try{t.setAttribute("role","main")}catch{}}catch{}let m=null,f=null,w=null,y=null,_=null,b=null,A=!1,S=null;const E=new Map;function I(){try{const R=typeof B<"u"&&B&&B.querySelector?B.querySelector(".navbar-burger"):e&&e.querySelector?e.querySelector(".navbar-burger"):typeof document<"u"?document.querySelector(".navbar-burger"):null,P=R&&R.dataset?R.dataset.target:null,M=P?typeof B<"u"&&B&&B.querySelector?B.querySelector(`#${P}`)||document.getElementById(P):e&&e.querySelector?e.querySelector(`#${P}`):typeof document<"u"?document.getElementById(P):null:null;if(R&&R.classList&&R.classList.contains("is-active")){try{R.classList.remove("is-active")}catch{}try{R.setAttribute("aria-expanded","false")}catch{}if(M&&M.classList)try{M.classList.remove("is-active")}catch{}}}catch(R){k("[nimbi-cms] closeMobileMenu failed",R)}}async function O(){const R=t&&t instanceof HTMLElement?t:typeof document<"u"?document.querySelector(".nimbi-content"):null;try{R&&R.classList.add("is-inactive")}catch{}try{const P=s&&s();P&&typeof P.then=="function"&&await P}catch(P){try{k("[nimbi-cms] renderByQuery failed",P)}catch{}}finally{try{if(typeof requestAnimationFrame=="function")requestAnimationFrame(()=>{try{R&&R.classList.remove("is-inactive")}catch{}});else try{R&&R.classList.remove("is-inactive")}catch{}}catch{try{R&&R.classList.remove("is-inactive")}catch{}}}}function W(R){try{let P=R&&typeof R.slug=="string"?String(R.slug):"",M=null;try{P&&P.indexOf("::")!==-1&&(M=P.split("::").slice(1).join("::")||null)}catch{}try{if(R&&R.path&&typeof R.path=="string"){const v=J(String(R.path||"")),L=v.replace(/^.*\//,"");try{if(E&&E.has(v))return{page:E.get(v),hash:M};if(E&&E.has(L))return{page:E.get(L),hash:M}}catch{}try{if(G&&G.has(v))return{page:G.get(v),hash:M}}catch{}try{const U=D(v);if(U)return{page:U,hash:M}}catch{}}}catch{}if(P&&P.indexOf("::")!==-1){const v=P.split("::");P=v[0]||"",M=v.slice(1).join("::")||null}if(P&&(P.includes(".")||P.includes("/"))){const v=J(R&&R.path?String(R.path):P),L=v.replace(/^.*\//,"");try{if(E&&E.has(v))return{page:E.get(v),hash:M};if(E&&E.has(L))return{page:E.get(L),hash:M}}catch{}try{let U=D(v);if(!U)try{const V=String(v||"").replace(/^\/+/,""),H=V.replace(/^.*\//,"");for(const[$,T]of Y.entries())try{let q=null;if(typeof T=="string"?q=J(String(T||"")):T&&typeof T=="object"&&(T.default?q=J(String(T.default||"")):q=null),!q)continue;if(q===V||q.endsWith("/"+V)||V.endsWith("/"+q)||q.endsWith(H)||V.endsWith(H)){U=$;break}}catch{}}catch{}if(U)P=U;else try{const V=String(P).replace(/\.(?:md|html?)$/i,"");P=de(V||v)}catch{P=de(v)}}catch{P=de(v)}}return!P&&R&&R.path&&(P=de(J(String(R.path||"")))),{page:P,hash:M}}catch{return{page:R&&R.slug||"",hash:null}}}const z=()=>m||(m=(async()=>{try{const R=await Promise.resolve().then(()=>at),P=typeof globalThis<"u"?globalThis.buildSearchIndex:void 0,M=typeof globalThis<"u"?globalThis.buildSearchIndexWorker:void 0,v=ua(R,"buildSearchIndex"),L=ua(R,"buildSearchIndexWorker"),U=typeof P=="function"?P:v||void 0,V=typeof M=="function"?M:L||void 0;jt("[nimbi-cms test] ensureSearchIndex: buildFn="+typeof U+" workerFn="+typeof V+" (global preferred)");const H=[];try{r&&H.push(r)}catch{}try{navigationPage&&H.push(navigationPage)}catch{}if(l==="lazy"&&typeof V=="function")try{const $=await V(i,c,u,H.length?H:void 0);if($&&$.length){try{if(R&&typeof R._setSearchIndex=="function")try{R._setSearchIndex($)}catch{}}catch{}return $}}catch($){k("[nimbi-cms] worker builder threw",$)}return typeof U=="function"?(jt("[nimbi-cms test] calling buildFn"),await U(i,c,u,H.length?H:void 0)):[]}catch(R){return k("[nimbi-cms] buildSearchIndex failed",R),[]}finally{if(f){try{f.removeAttribute("disabled")}catch{}try{w&&w.classList.remove("is-loading")}catch{}}}})(),m.then(R=>{try{try{S=Array.isArray(R)?R:null}catch{S=null}try{Sc(R)}catch{}try{if(typeof window<"u"){try{(async()=>{try{const L=await Promise.resolve().then(()=>at);try{try{L&&typeof L._setSearchIndex=="function"&&L._setSearchIndex(Array.isArray(R)?R:[])}catch{}Object.defineProperty(window,"__nimbiResolvedIndex",{get(){return L&&Array.isArray(L.searchIndex)?L.searchIndex:Array.isArray(S)?S:[]},enumerable:!0,configurable:!0})}catch{try{window.__nimbiResolvedIndex=L&&Array.isArray(L.searchIndex)?L.searchIndex:Array.isArray(S)?S:[]}catch{}}}catch{try{window.__nimbiResolvedIndex=Array.isArray(re)?re:Array.isArray(S)?S:[]}catch{}}})()}catch{}try{window.__nimbi_contentBase=i}catch{}try{window.__nimbi_indexDepth=c}catch{}try{window.__nimbi_noIndexing=u}catch{}}}catch{}const P=String(f&&f.value||"").trim().toLowerCase();if(!P||!Array.isArray(R)||!R.length)return;const M=R.filter(L=>L.title&&L.title.toLowerCase().includes(P)||L.excerpt&&L.excerpt.toLowerCase().includes(P));if(!M||!M.length)return;const v=typeof _<"u"&&_?_:typeof document<"u"?document.getElementById("nimbi-search-results"):null;if(!v)return;try{typeof v.replaceChildren=="function"?v.replaceChildren():v.innerHTML=""}catch{try{v.innerHTML=""}catch{}}try{const L=document.createElement("div");L.className="panel nimbi-search-panel",M.slice(0,10).forEach(U=>{try{if(U.parentTitle){const T=document.createElement("p");T.className="panel-heading nimbi-search-title nimbi-search-parent",T.textContent=U.parentTitle,L.appendChild(T)}const V=document.createElement("a");V.className="panel-block nimbi-search-result";const H=W(U);V.href=Pe(H.page,H.hash),V.setAttribute("role","button");try{if(U.path&&typeof U.path=="string")try{rn(H.page,U.path)}catch{}}catch{}const $=document.createElement("div");$.className="is-size-6 has-text-weight-semibold",$.textContent=U.title,V.appendChild($),V.addEventListener("click",()=>{try{v.style.display="none"}catch{}}),L.appendChild(V)}catch{}}),ir(()=>{try{v.appendChild(L)}catch{}});try{v.style.display="block"}catch{}}catch{}}catch{}}).catch(()=>{}).finally(()=>{(async()=>{try{if(A)return;A=!0;const R=await Promise.resolve().then(()=>Tn);try{await R.handleSitemapRequest({homePage:r,contentBase:i,indexDepth:c,noIndexing:u,includeAllMarkdown:!0})}catch(P){k("[nimbi-cms] sitemap trigger failed",P)}}catch(R){try{k("[nimbi-cms] sitemap dynamic import failed",R)}catch{}}})()}),m),B=document.createElement("nav");B.className="navbar",B.setAttribute("role","navigation"),B.setAttribute("aria-label","main navigation");const Z=document.createElement("div");Z.className="navbar-brand";const ee=p[0],j=document.createElement("a");if(j.className="navbar-item",ee){const R=ee.getAttribute("href")||"#";try{const M=new URL(R,location.href).searchParams.get("page"),v=M?decodeURIComponent(M):r;let L=null;try{typeof v=="string"&&(/(?:\.md|\.html?)$/i.test(v)||v.includes("/"))&&(L=D(v))}catch{}!L&&typeof v=="string"&&!String(v).includes(".")&&(L=v);const U=L||v;j.href=Pe(U),(!j.textContent||!String(j.textContent).trim())&&(j.textContent=a("home"))}catch{try{const M=typeof r=="string"&&(/(?:\.md|\.html?)$/i.test(r)||r.includes("/"))?D(r):typeof r=="string"&&!r.includes(".")?r:null;j.href=Pe(M||r)}catch{j.href=Pe(r)}j.textContent=a("home")}}else j.href=Pe(r),j.textContent=a("home");async function C(R){try{if(!R||R==="none")return null;if(R==="favicon")try{const P=document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');if(!P)return null;const M=P.getAttribute("href")||"";return M&&/\.png(?:\?|$)/i.test(M)?new URL(M,location.href).toString():null}catch{return null}if(R==="copy-first"||R==="move-first")try{const P=await Be(r,i);if(!P||!P.raw)return null;const M=He(),v=M?M.parseFromString(P.raw,"text/html"):null,L=v?v.querySelector("img"):null;if(!L)return null;const U=L.getAttribute("src")||"";if(!U)return null;const V=new URL(U,location.href).toString();if(R==="move-first")try{document.documentElement.setAttribute("data-nimbi-logo-moved",V)}catch{}return V}catch{return null}try{return new URL(R,location.href).toString()}catch{return null}}catch{return null}}let N=null;try{N=await C(g)}catch{N=null}if(N)try{const R=document.createElement("img");R.className="nimbi-navbar-logo";const P=a&&typeof a=="function"&&(a("home")||a("siteLogo"))||"";R.alt=P,R.title=P,R.src=N;try{R.style.marginRight="0.5em"}catch{}try{(!j.textContent||!String(j.textContent).trim())&&(j.textContent=P)}catch{}try{j.insertBefore(R,j.firstChild)}catch{try{j.appendChild(R)}catch{}}}catch{}Z.appendChild(j),j.addEventListener("click",function(R){const P=j.getAttribute("href")||"";if(P.startsWith("?page=")){R.preventDefault();const M=new URL(P,location.href),v=M.searchParams.get("page"),L=M.hash?M.hash.replace(/^#/,""):null;history.pushState({page:v},"",Pe(v,L)),O();try{I()}catch{}}});function D(R){try{if(!R)return null;const P=J(String(R||""));try{if(G&&G.has(P))return G.get(P)}catch{}const M=P.replace(/^.*\//,"");try{if(G&&G.has(M))return G.get(M)}catch{}try{for(const[v,L]of Y.entries())if(L){if(typeof L=="string"){if(J(L)===P)return v}else if(L&&typeof L=="object"){if(L.default&&J(L.default)===P)return v;const U=L.langs||{};for(const V in U)if(U[V]&&J(U[V])===P)return v}}}catch{}return null}catch{return null}}async function ie(R,P){try{if(!R||!R.length)return;const M=[];for(let H=0;H<R.length;H++)try{const $=R[H];if(!$||typeof $.getAttribute!="function")continue;const T=$.getAttribute("href")||"";if(!T||qr(T))continue;let q=null;try{const _e=Je(T);_e&&_e.page&&(q=_e.page)}catch{}if(!q){const _e=String(T||"").split(/[?#]/,1),ve=_e&&_e[0]?_e[0]:T;(/\.(?:md|html?)$/i.test(ve)||ve.indexOf("/")!==-1)&&(q=J(String(ve||"")))}if(!q)continue;try{if(P&&typeof P=="string")try{let ve=new URL(P,typeof location<"u"?location.origin:"http://localhost").pathname||"";if(ve=ve.replace(/^\/+|\/+$/g,""),ve){let Ie=String(q||"");Ie=Ie.replace(/^\/+/,""),Ie===ve?q="":Ie.startsWith(ve+"/")?q=Ie.slice(ve.length+1):q=Ie}}catch{}}catch{}const Q=J(String(q||"")),se=Q.replace(/^.*\//,"");let ye=null;try{E&&E.has(Q)&&(ye=E.get(Q))}catch{}try{!ye&&G&&G.has(Q)&&(ye=G.get(Q))}catch{}if(ye)continue;let we=null;try{we=$.textContent&&String($.textContent).trim()?String($.textContent).trim():null}catch{we=null}let pe=null;if(we)pe=de(we);else{const _e=se.replace(/\.(?:md|html?)$/i,"");pe=de(_e||Q)}if(pe)try{M.push({path:Q,candidate:pe})}catch{}}catch{}if(!M.length)return;const v=3;let L=0;const U=async()=>{for(;L<M.length;){const H=M[L++];if(!(!H||!H.path))try{const $=await Be(H.path,P);if(!$||!$.raw)continue;let T=null;if($.isHtml)try{const q=He(),Q=q?q.parseFromString($.raw,"text/html"):null,se=Q?Q.querySelector("h1")||Q.querySelector("title"):null;se&&se.textContent&&(T=String(se.textContent).trim())}catch{}else try{const q=$.raw.match(/^#\s+(.+)$/m);q&&q[1]&&(T=String(q[1]).trim())}catch{}if(T){const q=de(T);if(q&&q!==H.candidate){try{rn(q,H.path)}catch{}try{E.set(H.path,q)}catch{}try{E.set(H.path.replace(/^.*\//,""),q)}catch{}try{const Q=await Promise.resolve().then(()=>at);try{if(Array.isArray(Q.searchIndex)){let se=!1;for(const ye of Q.searchIndex)try{if(ye&&ye.path===H.path&&ye.slug){const pe=String(ye.slug).split("::").slice(1).join("::");ye.slug=pe?`${q}::${pe}`:q,se=!0}}catch{}try{se&&typeof Q._setSearchIndex=="function"&&Q._setSearchIndex(Q.searchIndex)}catch{}}}catch{}}catch{}}}}catch{}}},V=[];for(let H=0;H<v;H++)V.push(U());try{await Promise.all(V)}catch{}}catch{}}const he=document.createElement("a");he.className="navbar-burger",he.setAttribute("role","button"),he.setAttribute("aria-label","menu"),he.setAttribute("aria-expanded","false");const K="nimbi-navbar-menu";he.dataset.target=K,he.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>',Z.appendChild(he);try{he.addEventListener("click",R=>{try{const P=he.dataset&&he.dataset.target?he.dataset.target:null,M=P?B&&B.querySelector?B.querySelector(`#${P}`)||(e&&e.querySelector?e.querySelector(`#${P}`):document.getElementById(P)):e&&e.querySelector?e.querySelector(`#${P}`)||document.getElementById(P):typeof document<"u"?document.getElementById(P):null:null;he.classList.contains("is-active")?(he.classList.remove("is-active"),he.setAttribute("aria-expanded","false"),M&&M.classList.remove("is-active")):(he.classList.add("is-active"),he.setAttribute("aria-expanded","true"),M&&M.classList.add("is-active"))}catch(P){k("[nimbi-cms] navbar burger toggle failed",P)}})}catch(R){k("[nimbi-cms] burger event binding failed",R)}const Le=document.createElement("div");Le.className="navbar-menu",Le.id=K;const me=document.createElement("div");me.className="navbar-start";let Se=null,Ee=null;if(!o)Se=null,f=null,y=null,_=null,b=null;else{Se=document.createElement("div"),Se.className="navbar-end",Ee=document.createElement("div"),Ee.className="navbar-item",f=document.createElement("input"),f.className="input",f.type="search",f.placeholder=a("searchPlaceholder")||"",f.id="nimbi-search";try{const v=(a&&typeof a=="function"?a("searchAria"):null)||f.placeholder||"Search";try{f.setAttribute("aria-label",v)}catch{}try{f.setAttribute("aria-controls","nimbi-search-results")}catch{}try{f.setAttribute("aria-autocomplete","list")}catch{}try{f.setAttribute("role","combobox")}catch{}}catch{}l==="eager"&&(f.disabled=!0),w=document.createElement("div"),w.className="control",l==="eager"&&w.classList.add("is-loading"),w.appendChild(f),Ee.appendChild(w),y=document.createElement("div"),y.className="dropdown is-right",y.id="nimbi-search-dropdown";const R=document.createElement("div");R.className="dropdown-trigger",R.appendChild(Ee);const P=document.createElement("div");P.className="dropdown-menu",P.setAttribute("role","menu"),_=document.createElement("div"),_.id="nimbi-search-results",_.className="dropdown-content nimbi-search-results",b=_,P.appendChild(_),y.appendChild(R),y.appendChild(P),Se.appendChild(y);const M=v=>{if(!_)return;try{if(typeof _.replaceChildren=="function")_.replaceChildren();else for(;_.firstChild;)_.removeChild(_.firstChild)}catch{try{_.innerHTML=""}catch{}}let L=-1;function U($){try{const T=_.querySelector(".nimbi-search-result.is-selected");T&&T.classList.remove("is-selected");const q=_.querySelectorAll(".nimbi-search-result");if(!q||!q.length)return;if($<0){L=-1;return}$>=q.length&&($=q.length-1);const Q=q[$];if(Q){Q.classList.add("is-selected"),L=$;try{Q.scrollIntoView({block:"nearest"})}catch{}}}catch{}}function V($){try{const T=$.key,q=_.querySelectorAll(".nimbi-search-result");if(!q||!q.length)return;if(T==="ArrowDown"){$.preventDefault();const Q=L<0?0:Math.min(q.length-1,L+1);U(Q);return}if(T==="ArrowUp"){$.preventDefault();const Q=L<=0?0:L-1;U(Q);return}if(T==="Enter"){$.preventDefault();const Q=_.querySelector(".nimbi-search-result.is-selected")||_.querySelector(".nimbi-search-result");if(Q)try{Q.click()}catch{}return}if(T==="Escape"){try{y.classList.remove("is-active")}catch{}try{document.documentElement.classList.remove("nimbi-search-open")}catch{}try{_.style.display="none"}catch{}try{_.classList.remove("is-open")}catch{}try{_.removeAttribute("tabindex")}catch{}try{_.removeEventListener("keydown",V)}catch{}try{f&&f.focus()}catch{}try{f&&f.removeEventListener("keydown",H)}catch{}return}}catch{}}function H($){try{if($&&$.key==="ArrowDown"){$.preventDefault();try{_.focus()}catch{}U(0)}}catch{}}try{const $=String(f&&f.value||"").trim();if(!v||!v.length){if(!$){try{y&&y.classList.remove("is-active")}catch{}try{document.documentElement.classList.remove("nimbi-search-open")}catch{}try{_&&(_.style.display="none",_.classList.remove("is-open"),_.removeAttribute("tabindex"))}catch{}try{_&&_.removeEventListener("keydown",V)}catch{}return}try{const T=document.createElement("div");T.className="panel nimbi-search-panel";const q=document.createElement("p");q.className="panel-block nimbi-search-no-results",q.textContent=a&&typeof a=="function"?a("searchNoResults"):"No results",T.appendChild(q),ir(()=>{try{_.appendChild(T)}catch{}})}catch{}if(y){y.classList.add("is-active");try{document.documentElement.classList.add("nimbi-search-open")}catch{}}try{_.style.display="block"}catch{}try{_.classList.add("is-open")}catch{}try{_.setAttribute("tabindex","0")}catch{}return}}catch{}try{const $=document.createElement("div");$.className="panel nimbi-search-panel";const T=document.createDocumentFragment();v.forEach(q=>{if(q.parentTitle){const we=document.createElement("p");we.textContent=q.parentTitle,we.className="panel-heading nimbi-search-title nimbi-search-parent",T.appendChild(we)}const Q=document.createElement("a");Q.className="panel-block nimbi-search-result";const se=W(q);Q.href=Pe(se.page,se.hash),Q.setAttribute("role","button");try{if(q.path&&typeof q.path=="string")try{rn(se.page,q.path)}catch{}}catch{}const ye=document.createElement("div");ye.className="is-size-6 has-text-weight-semibold",ye.textContent=q.title,Q.appendChild(ye),Q.addEventListener("click",we=>{try{try{we&&we.preventDefault&&we.preventDefault()}catch{}try{we&&we.stopPropagation&&we.stopPropagation()}catch{}if(y){y.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-search-open")}catch{}}try{_.style.display="none"}catch{}try{_.classList.remove("is-open")}catch{}try{_.removeAttribute("tabindex")}catch{}try{_.removeEventListener("keydown",V)}catch{}try{f&&f.removeEventListener("keydown",H)}catch{}try{const pe=Q.getAttribute&&Q.getAttribute("href")||"";let _e=null,ve=null;try{const Ie=new URL(pe,location.href);_e=Ie.searchParams.get("page"),ve=Ie.hash?Ie.hash.replace(/^#/,""):null}catch{}if(_e)try{history.pushState({page:_e},"",Pe(_e,ve));try{O()}catch{try{typeof window<"u"&&typeof window.renderByQuery=="function"&&window.renderByQuery()}catch{}}return}catch{}}catch{}try{window.location.href=Q.href}catch{}}catch{}}),T.appendChild(Q)}),$.appendChild(T),ir(()=>{try{_.appendChild($)}catch{}})}catch{}if(y){y.classList.add("is-active");try{document.documentElement.classList.add("nimbi-search-open")}catch{}}try{_.style.display="block"}catch{}try{_.classList.add("is-open")}catch{}try{_.setAttribute("tabindex","0")}catch{}try{_.addEventListener("keydown",V)}catch{}try{f&&f.addEventListener("keydown",H)}catch{}};if(f){const v=nc(async()=>{const L=f||(typeof B<"u"&&B&&B.querySelector?B.querySelector("input#nimbi-search"):e&&e.querySelector?e.querySelector("input#nimbi-search"):typeof document<"u"?document.querySelector("input#nimbi-search"):null),U=String(L&&L.value||"").trim().toLowerCase();if(!U){try{y&&y.classList.remove("is-active")}catch{}try{document.documentElement.classList.remove("nimbi-search-open")}catch{}try{_&&(_.style.display="none",_.classList.remove("is-open"),_.removeAttribute("tabindex"))}catch{}return}try{await z();const V=await m,H=Array.isArray(V)?V.filter($=>$.title&&$.title.toLowerCase().includes(U)||$.excerpt&&$.excerpt.toLowerCase().includes(U)):[];M(H.slice(0,10))}catch(V){k("[nimbi-cms] search input handler failed",V),M([])}},50);try{f.addEventListener("input",v)}catch{}try{document.addEventListener("input",L=>{try{L&&L.target&&L.target.id==="nimbi-search"&&v(L)}catch{}},!0)}catch{}}if(l==="eager"){try{m=z()}catch(v){k("[nimbi-cms] eager search index init failed",v),m=Promise.resolve([])}m.finally(()=>{const v=f||(typeof B<"u"&&B&&B.querySelector?B.querySelector("input#nimbi-search"):e&&e.querySelector?e.querySelector("input#nimbi-search"):typeof document<"u"?document.querySelector("input#nimbi-search"):null);if(v){try{v.removeAttribute("disabled")}catch{}try{w&&w.classList.remove("is-loading")}catch{}}(async()=>{try{if(A)return;A=!0;const L=await m.catch(()=>[]),U=await Promise.resolve().then(()=>Tn);try{await U.handleSitemapRequest({index:Array.isArray(L)?L:void 0,homePage:r,contentBase:i,indexDepth:c,noIndexing:u,includeAllMarkdown:!0})}catch(V){k("[nimbi-cms] sitemap trigger failed",V)}}catch(L){try{k("[nimbi-cms] sitemap dynamic import failed",L)}catch{}}})()})}try{const v=L=>{try{const U=L&&L.target;if(!b||!b.classList.contains("is-open")&&b.style&&b.style.display!=="block"||U&&(b.contains(U)||f&&(U===f||f.contains&&f.contains(U))))return;if(y){y.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-search-open")}catch{}}try{b.style.display="none"}catch{}try{b.classList.remove("is-open")}catch{}}catch{}};document.addEventListener("click",v,!0),document.addEventListener("touchstart",v,!0)}catch{}}const Fe=document.createDocumentFragment();for(let R=0;R<p.length;R++){const P=p[R];if(R===0)continue;const M=P.getAttribute("href")||"#";let v=M;const L=document.createElement("a");L.className="navbar-item";try{let U=null;try{U=Je(String(M||""))}catch{U=null}let V=null,H=null;if(U&&(U.type==="canonical"&&U.page||U.type==="cosmetic"&&U.page)&&(V=U.page,H=U.anchor),V&&(/\.(?:md|html?)$/i.test(V)||V.includes("/")?v=V:L.href=Pe(V,H)),/^[^#]*\.md(?:$|[#?])/.test(v)||v.endsWith(".md")){const T=J(v).split(/::|#/,2),q=T[0],Q=T[1],se=D(q);se?L.href=Pe(se,Q):L.href=Pe(q,Q)}else if(/\.html(?:$|[#?])/.test(v)||v.endsWith(".html")){const T=J(v).split(/::|#/,2);let q=T[0];q&&!q.toLowerCase().endsWith(".html")&&(q=q+".html");const Q=T[1],se=D(q);if(se)L.href=Pe(se,Q);else try{const ye=await Be(q,i);if(ye&&ye.raw)try{const we=He(),pe=we?we.parseFromString(ye.raw,"text/html"):null,_e=pe?pe.querySelector("title"):null,ve=pe?pe.querySelector("h1"):null,Ie=_e&&_e.textContent&&_e.textContent.trim()?_e.textContent.trim():ve&&ve.textContent?ve.textContent.trim():null;if(Ie){const Ge=de(Ie);if(Ge){try{rn(Ge,q)}catch(Et){k("[nimbi-cms] slugToMd/mdToSlug set failed",Et)}L.href=Pe(Ge,Q)}else L.href=Pe(q,Q)}else L.href=Pe(q,Q)}catch{L.href=Pe(q,Q)}else L.href=v}catch{L.href=v}}else L.href=v}catch(U){k("[nimbi-cms] nav item href parse failed",U),L.href=v}try{const U=P.textContent&&String(P.textContent).trim()?String(P.textContent).trim():null;if(U)try{const V=de(U);if(V){const H=L.getAttribute("href")||"";let $=null;if(/^[^#?]*\.(?:md|html?)(?:$|[?#])/i.test(H))$=J(String(H||"").split(/[?#]/)[0]);else try{const T=Je(H);T&&T.type==="canonical"&&T.page&&($=J(T.page))}catch{}if($){let T=!1;try{if(/\.(?:html?)(?:$|[?#])/i.test(String($||"")))T=!0;else if(/\.(?:md)(?:$|[?#])/i.test(String($||"")))T=!1;else{const q=String($||"").replace(/^\.\//,""),Q=q.replace(/^.*\//,"");$e&&$e.size&&($e.has(q)||$e.has(Q))&&(T=!0)}}catch{T=!1}if(T)try{const q=J(String($||"").split(/[?#]/)[0]);let Q=!1;try{D&&typeof D=="function"&&D(q)&&(Q=!0)}catch{}try{rn(V,$)}catch{}try{if(q){try{E.set(q,V)}catch{}try{const se=q.replace(/^.*\//,"");se&&E.set(se,V)}catch{}}}catch{}if(Q)try{L.href=Pe(V)}catch{}}catch{}}}}catch(V){k("[nimbi-cms] nav slug mapping failed",V)}}catch(U){k("[nimbi-cms] nav slug mapping failed",U)}L.textContent=P.textContent||v,Fe.appendChild(L)}try{me.appendChild(Fe)}catch{}Le.appendChild(me),Se&&Le.appendChild(Se),B.appendChild(Z),B.appendChild(Le),e.appendChild(B);try{const R=P=>{try{const M=typeof B<"u"&&B&&B.querySelector?B.querySelector(".navbar-burger"):e&&e.querySelector?e.querySelector(".navbar-burger"):typeof document<"u"?document.querySelector(".navbar-burger"):null;if(!M||!M.classList.contains("is-active"))return;const v=M&&M.closest?M.closest(".navbar"):B;if(v&&v.contains(P.target))return;I()}catch{}};document.addEventListener("click",R,!0),document.addEventListener("touchstart",R,!0)}catch{}try{Le.addEventListener("click",R=>{const P=R.target&&R.target.closest?R.target.closest("a"):null;if(!P)return;const M=P.getAttribute("href")||"";try{const v=new URL(M,location.href),L=v.searchParams.get("page"),U=v.hash?v.hash.replace(/^#/,""):null;L&&(R.preventDefault(),history.pushState({page:L},"",Pe(L,U)),O())}catch(v){k("[nimbi-cms] navbar click handler failed",v)}try{const v=typeof B<"u"&&B&&B.querySelector?B.querySelector(".navbar-burger"):e&&e.querySelector?e.querySelector(".navbar-burger"):null,L=v&&v.dataset?v.dataset.target:null,U=L?B&&B.querySelector?B.querySelector(`#${L}`)||(e&&e.querySelector?e.querySelector(`#${L}`):document.getElementById(L)):e&&e.querySelector?e.querySelector(`#${L}`)||document.getElementById(L):typeof document<"u"?document.getElementById(L):null:null;v&&v.classList.contains("is-active")&&(v.classList.remove("is-active"),v.setAttribute("aria-expanded","false"),U&&U.classList.remove("is-active"))}catch(v){k("[nimbi-cms] mobile menu close failed",v)}})}catch(R){k("[nimbi-cms] attach content click handler failed",R)}try{t.addEventListener("click",R=>{const P=R.target&&R.target.closest?R.target.closest("a"):null;if(!P)return;const M=P.getAttribute("href")||"";if(M&&!qr(M))try{const v=new URL(M,location.href),L=v.searchParams.get("page"),U=v.hash?v.hash.replace(/^#/,""):null;L&&(R.preventDefault(),history.pushState({page:L},"",Pe(L,U)),O())}catch(v){k("[nimbi-cms] container click URL parse failed",v)}})}catch(R){k("[nimbi-cms] build navbar failed",R)}return{navbar:B,linkEls:p}}try{document.addEventListener("input",e=>{try{if(e&&e.target&&e.target.id==="nimbi-search"){const t=document.getElementById("nimbi-search-results");if(t&&e.target&&e.target.value)try{t.style.display="block"}catch{}}}catch{}},!0)}catch{}let nt=null,fe=null,Xe=1,St=(e,t)=>t,Cn=0,Mn=0,ar=()=>{},kn=.25;function Ac(){if(nt&&document.contains(nt))return nt;nt=null;const e=document.createElement("dialog");e.className="nimbi-image-preview modal",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-label",St("imagePreviewTitle","Image preview"));try{const C=document.createElement("div");C.className="modal-background";const N=document.createElement("div");N.className="modal-content";const D=document.createElement("div");D.className="nimbi-image-preview__content box",D.setAttribute("role","document");const ie=document.createElement("button");ie.className="button is-small nimbi-image-preview__close",ie.type="button",ie.setAttribute("data-nimbi-preview-close",""),ie.textContent="✕";const he=document.createElement("div");he.className="nimbi-image-preview__image-wrapper";const K=document.createElement("img");K.setAttribute("data-nimbi-preview-image",""),K.alt="",he.appendChild(K);const Le=document.createElement("div");Le.className="nimbi-image-preview__controls";const me=document.createElement("div");me.className="nimbi-image-preview__group";const Se=document.createElement("button");Se.className="button is-small",Se.type="button",Se.setAttribute("data-nimbi-preview-fit",""),Se.textContent="⤢";const Ee=document.createElement("button");Ee.className="button is-small",Ee.type="button",Ee.setAttribute("data-nimbi-preview-original",""),Ee.textContent="1:1";const Fe=document.createElement("button");Fe.className="button is-small",Fe.type="button",Fe.setAttribute("data-nimbi-preview-reset",""),Fe.textContent="⟲",me.appendChild(Se),me.appendChild(Ee),me.appendChild(Fe);const R=document.createElement("div");R.className="nimbi-image-preview__group";const P=document.createElement("button");P.className="button is-small",P.type="button",P.setAttribute("data-nimbi-preview-zoom-out",""),P.textContent="−";const M=document.createElement("div");M.className="nimbi-image-preview__zoom",M.setAttribute("data-nimbi-preview-zoom-label",""),M.textContent="100%";const v=document.createElement("button");v.className="button is-small",v.type="button",v.setAttribute("data-nimbi-preview-zoom-in",""),v.textContent="＋",R.appendChild(P),R.appendChild(M),R.appendChild(v),Le.appendChild(me),Le.appendChild(R),D.appendChild(ie),D.appendChild(he),D.appendChild(Le),N.appendChild(D),e.appendChild(C),e.appendChild(N)}catch{e.innerHTML=`
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
    `}e.addEventListener("click",C=>{C.target===e&&Nr()}),e.addEventListener("wheel",C=>{if(!W())return;C.preventDefault();const N=C.deltaY<0?kn:-kn;Lt(Xe+N),c(),u()},{passive:!1}),e.addEventListener("keydown",C=>{if(C.key==="Escape"){Nr();return}if(Xe>1){const N=e.querySelector(".nimbi-image-preview__image-wrapper");if(!N)return;const D=40;switch(C.key){case"ArrowUp":N.scrollTop-=D,C.preventDefault();break;case"ArrowDown":N.scrollTop+=D,C.preventDefault();break;case"ArrowLeft":N.scrollLeft-=D,C.preventDefault();break;case"ArrowRight":N.scrollLeft+=D,C.preventDefault();break}}}),document.body.appendChild(e),nt=e,fe=e.querySelector("[data-nimbi-preview-image]");const t=e.querySelector("[data-nimbi-preview-fit]"),n=e.querySelector("[data-nimbi-preview-original]"),i=e.querySelector("[data-nimbi-preview-zoom-in]"),r=e.querySelector("[data-nimbi-preview-zoom-out]"),a=e.querySelector("[data-nimbi-preview-reset]"),s=e.querySelector("[data-nimbi-preview-close]"),o=e.querySelector("[data-nimbi-preview-zoom-label]"),l=e.querySelector("[data-nimbi-preview-zoom-hud]");function c(){o&&(o.textContent=`${Math.round(Xe*100)}%`)}const u=()=>{l&&(l.textContent=`${Math.round(Xe*100)}%`,l.classList.add("visible"),clearTimeout(l._timeout),l._timeout=setTimeout(()=>l.classList.remove("visible"),800))};ar=c,i.addEventListener("click",()=>{Lt(Xe+kn),c(),u()}),r.addEventListener("click",()=>{Lt(Xe-kn),c(),u()}),t.addEventListener("click",()=>{Ln(),c(),u()}),n.addEventListener("click",()=>{Lt(1),c(),u()}),a.addEventListener("click",()=>{Ln(),c(),u()}),s.addEventListener("click",Nr),t.title=St("imagePreviewFit","Fit to screen"),n.title=St("imagePreviewOriginal","Original size"),r.title=St("imagePreviewZoomOut","Zoom out"),i.title=St("imagePreviewZoomIn","Zoom in"),s.title=St("imagePreviewClose","Close"),s.setAttribute("aria-label",St("imagePreviewClose","Close"));let g=!1,h=0,d=0,p=0,m=0;const f=new Map;let w=0,y=1;const _=(C,N)=>{const D=C.x-N.x,ie=C.y-N.y;return Math.hypot(D,ie)},b=()=>{g=!1,f.clear(),w=0,fe&&(fe.classList.add("is-panning"),fe.classList.remove("is-grabbing"))};let A=0,S=0,E=0;const I=C=>{const N=Date.now(),D=N-A,ie=C.clientX-S,he=C.clientY-E;A=N,S=C.clientX,E=C.clientY,D<300&&Math.hypot(ie,he)<30&&(Lt(Xe>1?1:2),c(),C.preventDefault())},O=C=>{Lt(Xe>1?1:2),c(),C.preventDefault()},W=()=>nt?typeof nt.open=="boolean"?nt.open:nt.classList.contains("is-active"):!1,z=(C,N,D=1)=>{if(f.has(D)&&f.set(D,{x:C,y:N}),f.size===2){const Le=Array.from(f.values()),me=_(Le[0],Le[1]);if(w>0){const Se=me/w;Lt(y*Se)}return}if(!g)return;const ie=fe.closest(".nimbi-image-preview__image-wrapper");if(!ie)return;const he=C-h,K=N-d;ie.scrollLeft=p-he,ie.scrollTop=m-K},B=(C,N,D=1)=>{if(!W())return;if(f.set(D,{x:C,y:N}),f.size===2){const K=Array.from(f.values());w=_(K[0],K[1]),y=Xe;return}const ie=fe.closest(".nimbi-image-preview__image-wrapper");!ie||!(ie.scrollWidth>ie.clientWidth||ie.scrollHeight>ie.clientHeight)||(g=!0,h=C,d=N,p=ie.scrollLeft,m=ie.scrollTop,fe.classList.add("is-panning"),fe.classList.remove("is-grabbing"),window.addEventListener("pointermove",Z),window.addEventListener("pointerup",ee),window.addEventListener("pointercancel",ee))},Z=C=>{g&&(C.preventDefault(),z(C.clientX,C.clientY,C.pointerId))},ee=()=>{b(),window.removeEventListener("pointermove",Z),window.removeEventListener("pointerup",ee),window.removeEventListener("pointercancel",ee)};fe.addEventListener("pointerdown",C=>{C.preventDefault(),B(C.clientX,C.clientY,C.pointerId)}),fe.addEventListener("pointermove",C=>{(g||f.size===2)&&C.preventDefault(),z(C.clientX,C.clientY,C.pointerId)}),fe.addEventListener("pointerup",C=>{C.preventDefault(),C.pointerType==="touch"&&I(C),b()}),fe.addEventListener("dblclick",O),fe.addEventListener("pointercancel",b),fe.addEventListener("mousedown",C=>{C.preventDefault(),B(C.clientX,C.clientY,1)}),fe.addEventListener("mousemove",C=>{g&&C.preventDefault(),z(C.clientX,C.clientY,1)}),fe.addEventListener("mouseup",C=>{C.preventDefault(),b()});const j=e.querySelector(".nimbi-image-preview__image-wrapper");return j&&(j.addEventListener("pointerdown",C=>{if(B(C.clientX,C.clientY,C.pointerId),C&&C.target&&C.target.tagName==="IMG")try{C.target.classList.add("is-grabbing")}catch{}}),j.addEventListener("pointermove",C=>{z(C.clientX,C.clientY,C.pointerId)}),j.addEventListener("pointerup",b),j.addEventListener("pointercancel",b),j.addEventListener("mousedown",C=>{if(B(C.clientX,C.clientY,1),C&&C.target&&C.target.tagName==="IMG")try{C.target.classList.add("is-grabbing")}catch{}}),j.addEventListener("mousemove",C=>{z(C.clientX,C.clientY,1)}),j.addEventListener("mouseup",b)),e}function Lt(e){if(!fe)return;const t=Number(e);Xe=Number.isFinite(t)?Math.max(.1,Math.min(4,t)):1;const i=fe.getBoundingClientRect(),r=Cn||fe.naturalWidth||fe.width||i.width||0,a=Mn||fe.naturalHeight||fe.height||i.height||0;if(r&&a){fe.style.setProperty("--nimbi-preview-img-max-width","none"),fe.style.setProperty("--nimbi-preview-img-max-height","none"),fe.style.setProperty("--nimbi-preview-img-width",`${r*Xe}px`),fe.style.setProperty("--nimbi-preview-img-height",`${a*Xe}px`),fe.style.setProperty("--nimbi-preview-img-transform","none");try{fe.style.width=`${r*Xe}px`,fe.style.height=`${a*Xe}px`,fe.style.transform="none"}catch{}}else{fe.style.setProperty("--nimbi-preview-img-max-width",""),fe.style.setProperty("--nimbi-preview-img-max-height",""),fe.style.setProperty("--nimbi-preview-img-width",""),fe.style.setProperty("--nimbi-preview-img-height",""),fe.style.setProperty("--nimbi-preview-img-transform",`scale(${Xe})`);try{fe.style.transform=`scale(${Xe})`}catch{}}fe&&(fe.classList.add("is-panning"),fe.classList.remove("is-grabbing"))}function Ln(){if(!fe)return;const e=fe.closest(".nimbi-image-preview__image-wrapper");if(!e)return;const t=e.getBoundingClientRect();if(t.width===0||t.height===0)return;const n=Cn||fe.naturalWidth||t.width,i=Mn||fe.naturalHeight||t.height;if(!n||!i)return;const r=t.width/n,a=t.height/i,s=Math.min(r,a,1);Lt(Number.isFinite(s)?s:1)}function Ec(e,t="",n=0,i=0){const r=Ac();Xe=1,Cn=n||0,Mn=i||0,fe.src=e;try{if(!t)try{const o=new URL(e,typeof location<"u"?location.href:"").pathname||"",c=(o.substring(o.lastIndexOf("/")+1)||e).replace(/\.[^/.]+$/,"").replace(/[-_]+/g," ");t=St("imagePreviewDefaultAlt",c||"Image")}catch{t=St("imagePreviewDefaultAlt","Image")}}catch{}fe.alt=t,fe.style.transform="scale(1)";const a=()=>{Cn=fe.naturalWidth||fe.width||0,Mn=fe.naturalHeight||fe.height||0};if(a(),Ln(),ar(),requestAnimationFrame(()=>{Ln(),ar()}),!Cn||!Mn){const s=()=>{a(),requestAnimationFrame(()=>{Ln(),ar()}),fe.removeEventListener("load",s)};fe.addEventListener("load",s)}typeof r.showModal=="function"&&(r.open||r.showModal()),r.classList.add("is-active");try{document.documentElement.classList.add("nimbi-image-preview-open")}catch{}r.focus()}function Nr(){if(nt){typeof nt.close=="function"&&nt.open&&nt.close(),nt.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-image-preview-open")}catch{}}}function Cc(e,{t,zoomStep:n=.25}={}){if(!e||!e.querySelectorAll)return;St=(d,p)=>(typeof t=="function"?t(d):void 0)||p,kn=n,e.addEventListener("click",d=>{const p=d.target;if(!p||p.tagName!=="IMG")return;const m=p;if(!m.src)return;const f=m.closest("a");f&&f.getAttribute("href")||Ec(m.src,m.alt||"",m.naturalWidth||0,m.naturalHeight||0)});let i=!1,r=0,a=0,s=0,o=0;const l=new Map;let c=0,u=1;const g=(d,p)=>{const m=d.x-p.x,f=d.y-p.y;return Math.hypot(m,f)};e.addEventListener("pointerdown",d=>{const p=d.target;if(!p||p.tagName!=="IMG")return;const m=p.closest("a");if(m&&m.getAttribute("href")||!nt||!nt.open)return;if(l.set(d.pointerId,{x:d.clientX,y:d.clientY}),l.size===2){const w=Array.from(l.values());c=g(w[0],w[1]),u=Xe;return}const f=p.closest(".nimbi-image-preview__image-wrapper");if(f&&!(Xe<=1)){d.preventDefault(),i=!0,r=d.clientX,a=d.clientY,s=f.scrollLeft,o=f.scrollTop,p.setPointerCapture(d.pointerId);try{p.classList.add("is-grabbing")}catch{}}}),e.addEventListener("pointermove",d=>{if(l.has(d.pointerId)&&l.set(d.pointerId,{x:d.clientX,y:d.clientY}),l.size===2){d.preventDefault();const _=Array.from(l.values()),b=g(_[0],_[1]);if(c>0){const A=b/c;Lt(u*A)}return}if(!i)return;d.preventDefault();const p=d.target,m=p.closest&&p.closest("a");if(m&&m.getAttribute&&m.getAttribute("href"))return;const f=p.closest(".nimbi-image-preview__image-wrapper");if(!f)return;const w=d.clientX-r,y=d.clientY-a;f.scrollLeft=s-w,f.scrollTop=o-y});const h=()=>{i=!1,l.clear(),c=0;try{const d=document.querySelector("[data-nimbi-preview-image]");d&&(d.classList.add("is-panning"),d.classList.remove("is-grabbing"))}catch{}};e.addEventListener("pointerup",h),e.addEventListener("pointercancel",h)}function Mc(e){const{contentWrap:t,navWrap:n,container:i,mountOverlay:r=null,t:a,contentBase:s,homePage:o,initialDocumentTitle:l,runHooks:c}=e||{};if(!t||!(t instanceof HTMLElement))throw new TypeError("contentWrap must be an HTMLElement");let u=null;const g=cc(a,[{path:o,name:a("home"),isIndex:!0,children:[]}]);let h=!1,d=!1;function p(b){try{if(!b)return;if(typeof b.replaceChildren=="function")return b.replaceChildren();for(;b.firstChild;)b.removeChild(b.firstChild)}catch{try{b&&(b.innerHTML="")}catch{}}}async function m(b,A){let S,E,I;try{({data:S,pagePath:E,anchor:I}=await Vo(b,s))}catch(j){const C=j&&j.message?String(j.message):"",N=(!le||typeof le!="string"||!le)&&/no page data/i.test(C);try{if(N)try{k("[nimbi-cms] fetchPageData (expected missing)",j)}catch{}else try{sr("[nimbi-cms] fetchPageData failed",j)}catch{}}catch{}try{!le&&n&&p(n)}catch{}ca(t,a,j);return}!I&&A&&(I=A);try{ei(null)}catch(j){k("[nimbi-cms] scrollToAnchorOrTop failed",j)}try{p(t)}catch{try{t.innerHTML=""}catch{}}const{article:O,parsed:W,toc:z,topH1:B,h1Text:Z,slugKey:ee}=await mc(a,S,E,I,s);Zo(a,l,W,z,O,E,I,B,Z,ee,S);try{p(n)}catch{try{n.innerHTML=""}catch{}}z&&(n.appendChild(z),kc(z));try{await c("transformHtml",{article:O,parsed:W,toc:z,pagePath:E,anchor:I,topH1:B,h1Text:Z,slugKey:ee,data:S})}catch(j){k("[nimbi-cms] transformHtml hooks failed",j)}t.appendChild(O);try{yc(O)}catch(j){k("[nimbi-cms] executeEmbeddedScripts failed",j)}try{Cc(O,{t:a})}catch(j){k("[nimbi-cms] attachImagePreview failed",j)}try{Qn(i,100,!1),requestAnimationFrame(()=>Qn(i,100,!1)),setTimeout(()=>Qn(i,100,!1),250)}catch(j){k("[nimbi-cms] setEagerForAboveFoldImages failed",j)}ei(I),xc(O,B,{mountOverlay:r,container:i,navWrap:n,t:a});try{await c("onPageLoad",{data:S,pagePath:E,anchor:I,article:O,toc:z,topH1:B,h1Text:Z,slugKey:ee,contentWrap:t,navWrap:n})}catch(j){k("[nimbi-cms] onPageLoad hooks failed",j)}u=E}async function f(){if(h){d=!0;return}h=!0;try{try{ga("renderByQuery")}catch{}try{pa("renderByQuery")}catch{}let b=Je(location.href);try{if(b&&b.type==="path"&&b.page&&s)try{const E=typeof s=="string"?new URL(s,location.href).pathname:"",I=String(E||"").replace(/^\/+|\/+$/g,""),O=String(b.page||"").replace(/^\/+|\/+$/g,"");I&&O===I&&(b.page=null)}catch{}}catch{}if(b&&b.type==="path"&&b.page)try{let E="?page="+encodeURIComponent(b.page||"");b.params&&(E+=(E.includes("?")?"&":"?")+b.params),b.anchor&&(E+="#"+encodeURIComponent(b.anchor));try{history.replaceState(history.state,"",E)}catch{try{history.replaceState({},"",E)}catch{}}b=Je(location.href)}catch{}const A=b&&b.page?b.page:o,S=b&&b.anchor?b.anchor:null;await m(A,S)}catch(b){k("[nimbi-cms] renderByQuery failed",b);try{!le&&n&&p(n)}catch{}ca(t,a,b)}finally{if(h=!1,d){d=!1;try{await f()}catch{}}}}window.addEventListener("popstate",f);const w=()=>`nimbi-cms-scroll:${location.pathname}${location.search}`,y=()=>{try{const b=i||document.querySelector(".nimbi-cms");if(!b)return;const A={top:b.scrollTop||0,left:b.scrollLeft||0};sessionStorage.setItem(w(),JSON.stringify(A))}catch(b){k("[nimbi-cms] save scroll position failed",b)}},_=()=>{try{const b=i||document.querySelector(".nimbi-cms");if(!b)return;const A=sessionStorage.getItem(w());if(!A)return;const S=JSON.parse(A);S&&typeof S.top=="number"&&b.scrollTo({top:S.top,left:S.left||0,behavior:"auto"})}catch{}};return window.addEventListener("pageshow",b=>{if(b.persisted)try{_(),Qn(i,100,!1)}catch(A){k("[nimbi-cms] bfcache restore failed",A)}}),window.addEventListener("pagehide",()=>{try{y()}catch(b){k("[nimbi-cms] save scroll position failed",b)}}),{renderByQuery:f,siteNav:g,getCurrentPagePath:()=>u}}function Lc(e){try{let t=typeof e=="string"?e:typeof window<"u"&&window.location?window.location.search:"";if(!t&&typeof window<"u"&&window.location&&window.location.hash)try{const a=Je(window.location.href);a&&a.params&&(t=a.params.startsWith("?")?a.params:"?"+a.params)}catch{t=""}if(!t)return{};const n=new URLSearchParams(t.startsWith("?")?t.slice(1):t),i={},r=a=>{if(a==null)return;const s=String(a).toLowerCase();if(s==="1"||s==="true"||s==="yes")return!0;if(s==="0"||s==="false"||s==="no")return!1};if(n.has("contentPath")&&(i.contentPath=n.get("contentPath")),n.has("searchIndex")){const a=r(n.get("searchIndex"));typeof a=="boolean"&&(i.searchIndex=a)}if(n.has("searchIndexMode")){const a=n.get("searchIndexMode");(a==="eager"||a==="lazy")&&(i.searchIndexMode=a)}if(n.has("defaultStyle")){const a=n.get("defaultStyle");(a==="light"||a==="dark"||a==="system")&&(i.defaultStyle=a)}if(n.has("bulmaCustomize")&&(i.bulmaCustomize=n.get("bulmaCustomize")),n.has("lang")&&(i.lang=n.get("lang")),n.has("l10nFile")){const a=n.get("l10nFile");i.l10nFile=a==="null"?null:a}if(n.has("cacheTtlMinutes")){const a=Number(n.get("cacheTtlMinutes"));Number.isFinite(a)&&a>=0&&(i.cacheTtlMinutes=a)}if(n.has("cacheMaxEntries")){const a=Number(n.get("cacheMaxEntries"));Number.isInteger(a)&&a>=0&&(i.cacheMaxEntries=a)}if(n.has("homePage")&&(i.homePage=n.get("homePage")),n.has("navigationPage")&&(i.navigationPage=n.get("navigationPage")),n.has("notFoundPage")){const a=n.get("notFoundPage");i.notFoundPage=a==="null"?null:a}if(n.has("availableLanguages")&&(i.availableLanguages=n.get("availableLanguages").split(",").map(a=>a.trim()).filter(Boolean)),n.has("fetchConcurrency")){const a=Number(n.get("fetchConcurrency"));Number.isInteger(a)&&a>=1&&(i.fetchConcurrency=a)}if(n.has("negativeFetchCacheTTL")){const a=Number(n.get("negativeFetchCacheTTL"));Number.isFinite(a)&&a>=0&&(i.negativeFetchCacheTTL=a)}if(n.has("indexDepth")){const a=Number(n.get("indexDepth"));Number.isInteger(a)&&(a===1||a===2||a===3)&&(i.indexDepth=a)}if(n.has("noIndexing")){const s=(n.get("noIndexing")||"").split(",").map(o=>o.trim()).filter(Boolean);s.length&&(i.noIndexing=s)}return i}catch{return{}}}function Or(e){if(typeof e!="string")return!1;const t=e.trim();if(!t||t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))return!1;const n=t.replace(/^\.\//,"");return!!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n)}function Tc(e){if(typeof e!="string")return!1;const t=e.trim();if(!t)return!1;if(t==="."||t==="./")return!0;if(t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))return!1;const n=t.replace(/^\.\//,"");return!!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\/?$/.test(n)}let Kn="";async function os(e={}){if(!e||typeof e!="object")throw new TypeError("initCMS(options): options must be an object");const t=Lc();if(t&&(t.contentPath||t.homePage||t.notFoundPage||t.navigationPage))if(e&&e.allowUrlPathOverrides===!0)try{k("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage/navigationPage")}catch{}else{try{k("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage/navigationPage")}catch{}delete t.contentPath,delete t.homePage,delete t.notFoundPage,delete t.navigationPage}const n=Object.assign({},t,e);try{if(Object.prototype.hasOwnProperty.call(n,"debugLevel"))Fi(n.debugLevel);else if(typeof globalThis<"u"&&globalThis.__nimbiCMSDebug&&typeof globalThis.__nimbiCMSDebug.debugLevel<"u")try{const z=Number(globalThis.__nimbiCMSDebug.debugLevel);Number.isFinite(z)&&Fi(Math.max(0,Math.min(3,Math.floor(z))))}catch{}}catch{}try{$t("[nimbi-cms] initCMS called",()=>({options:n}))}catch{}t&&typeof t.bulmaCustomize=="string"&&t.bulmaCustomize.trim()&&(n.bulmaCustomize=t.bulmaCustomize);let{el:i,contentPath:r="/content",crawlMaxQueue:a=1e3,searchIndex:s=!0,searchIndexMode:o="eager",indexDepth:l=1,noIndexing:c=void 0,defaultStyle:u="light",bulmaCustomize:g="none",lang:h=void 0,l10nFile:d=null,cacheTtlMinutes:p=5,cacheMaxEntries:m,markdownExtensions:f,availableLanguages:w,homePage:y=null,notFoundPage:_=null,navigationPage:b="_navigation.md",exposeSitemap:A=!0}=n;try{typeof y=="string"&&y.startsWith("./")&&(y=y.replace(/^\.\//,""))}catch{}try{typeof _=="string"&&_.startsWith("./")&&(_=_.replace(/^\.\//,""))}catch{}try{typeof b=="string"&&b.startsWith("./")&&(b=b.replace(/^[.]\//,""))}catch{}const{navbarLogo:S="favicon"}=n,{skipRootReadme:E=!1}=n,I=z=>{try{const B=document.querySelector(i);if(B&&B instanceof Element)try{const Z=document.createElement("div");Z.style.padding="1rem";try{Z.style.fontFamily="system-ui, sans-serif"}catch{}Z.style.color="#b00",Z.style.background="#fee",Z.style.border="1px solid #b00";const ee=document.createElement("strong");ee.textContent="NimbiCMS failed to initialize:",Z.appendChild(ee);try{Z.appendChild(document.createElement("br"))}catch{}const j=document.createElement("pre");try{j.style.whiteSpace="pre-wrap"}catch{}j.textContent=String(z),Z.appendChild(j);try{if(typeof B.replaceChildren=="function")B.replaceChildren(Z);else{for(;B.firstChild;)B.removeChild(B.firstChild);B.appendChild(Z)}}catch{try{B.innerHTML='<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;"><strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">'+String(z)+"</pre></div>"}catch{}}}catch{}}catch{}};if(n.contentPath!=null&&!Tc(n.contentPath))throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');if(y!=null&&!Or(y))throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');if(_!=null&&!Or(_))throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');if(b!=null&&!Or(b))throw new TypeError('initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html');if(!i)throw new Error("el is required");let O=i;if(typeof i=="string"){if(O=document.querySelector(i),!O)throw new Error(`el selector "${i}" did not match any element`)}else if(!(i instanceof Element))throw new TypeError("el must be a CSS selector string or a DOM element");if(typeof r!="string"||!r.trim())throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');if(typeof s!="boolean")throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');if(o!=null&&o!=="eager"&&o!=="lazy")throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');if(l!=null&&l!==1&&l!==2&&l!==3)throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');if(u!=="light"&&u!=="dark"&&u!=="system")throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');if(g!=null&&typeof g!="string")throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');if(h!=null&&typeof h!="string")throw new TypeError('initCMS(options): "lang" must be a string when provided');if(d!=null&&typeof d!="string")throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');if(p!=null&&(typeof p!="number"||!Number.isFinite(p)||p<0))throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');if(m!=null&&(typeof m!="number"||!Number.isInteger(m)||m<0))throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');if(f!=null&&(!Array.isArray(f)||f.some(z=>!z||typeof z!="object")))throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');if(w!=null&&(!Array.isArray(w)||w.some(z=>typeof z!="string"||!z.trim())))throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');if(c!=null&&(!Array.isArray(c)||c.some(z=>typeof z!="string"||!z.trim())))throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');if(E!=null&&typeof E!="boolean")throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');if(n.fetchConcurrency!=null&&(typeof n.fetchConcurrency!="number"||!Number.isInteger(n.fetchConcurrency)||n.fetchConcurrency<1))throw new TypeError('initCMS(options): "fetchConcurrency" must be a positive integer when provided');if(n.negativeFetchCacheTTL!=null&&(typeof n.negativeFetchCacheTTL!="number"||!Number.isFinite(n.negativeFetchCacheTTL)||n.negativeFetchCacheTTL<0))throw new TypeError('initCMS(options): "negativeFetchCacheTTL" must be a non-negative number (ms) when provided');if(y!=null&&(typeof y!="string"||!y.trim()||!/\.(md|html)$/.test(y)))throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');if(_!=null&&(typeof _!="string"||!_.trim()||!/\.(md|html)$/.test(_)))throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');const W=!!s;try{Promise.resolve().then(()=>at).then(z=>{try{z&&typeof z.setSkipRootReadme=="function"&&z.setSkipRootReadme(!!E)}catch(B){k("[nimbi-cms] setSkipRootReadme failed",B)}}).catch(z=>{})}catch(z){k("[nimbi-cms] setSkipRootReadme dynamic import failed",z)}try{try{n&&n.seoMap&&typeof n.seoMap=="object"&&Uo(n.seoMap)}catch{}try{typeof window<"u"&&(window.__nimbiRenderingErrors__||(window.__nimbiRenderingErrors__=[]),window.addEventListener("error",function(z){try{const B={type:"error",message:z&&z.message?String(z.message):"",filename:z&&z.filename?String(z.filename):"",lineno:z&&z.lineno?z.lineno:null,colno:z&&z.colno?z.colno:null,stack:z&&z.error&&z.error.stack?z.error.stack:null,time:Date.now()};try{k("[nimbi-cms] runtime error",B.message)}catch{}window.__nimbiRenderingErrors__.push(B)}catch{}}),window.addEventListener("unhandledrejection",function(z){try{const B={type:"unhandledrejection",reason:z&&z.reason?String(z.reason):"",time:Date.now()};try{k("[nimbi-cms] unhandledrejection",B.reason)}catch{}window.__nimbiRenderingErrors__.push(B)}catch{}}))}catch{}try{const z=Je(typeof window<"u"?window.location.href:""),B=z&&z.page?z.page:y||void 0;try{B&&Wo(B,Kn||"")}catch{}}catch{}await(async()=>{try{O.classList.add("nimbi-mount")}catch(M){k("[nimbi-cms] mount element setup failed",M)}const z=document.createElement("section");z.className="section";const B=document.createElement("div");B.className="container nimbi-cms";const Z=document.createElement("div");Z.className="columns";const ee=document.createElement("div");ee.className="column is-hidden-mobile is-3-tablet nimbi-nav-wrap",ee.setAttribute("role","navigation");try{const M=typeof an=="function"?an("navigation"):null;M&&ee.setAttribute("aria-label",M)}catch(M){k("[nimbi-cms] set nav aria-label failed",M)}Z.appendChild(ee);const j=document.createElement("main");j.className="column nimbi-content",j.setAttribute("role","main"),Z.appendChild(j),B.appendChild(Z),z.appendChild(B);const C=ee,N=j;O.appendChild(z);let D=null;try{D=O.querySelector(".nimbi-overlay"),D||(D=document.createElement("div"),D.className="nimbi-overlay",O.appendChild(D))}catch(M){D=null,k("[nimbi-cms] mount overlay setup failed",M)}const ie=location.pathname||"/";let he;if(ie.endsWith("/"))he=ie;else{const M=ie.substring(ie.lastIndexOf("/")+1);M&&!M.includes(".")?he=ie+"/":he=ie.substring(0,ie.lastIndexOf("/")+1)}try{Kn=document.title||""}catch(M){Kn="",k("[nimbi-cms] read initial document title failed",M)}let K=r;const Le=Object.prototype.hasOwnProperty.call(n,"contentPath"),me=typeof location<"u"&&location.origin?location.origin:"http://localhost",Se=new URL(he,me).toString();(K==="."||K==="./")&&(K="");try{K=String(K||"").replace(/\\/g,"/")}catch{K=String(K||"")}K.startsWith("/")&&(K=K.replace(/^\/+/,"")),K&&!K.endsWith("/")&&(K=K+"/");try{if(K&&he&&he!=="/"){const M=he.replace(/^\/+/,"").replace(/\/+$/,"")+"/";M&&K.startsWith(M)&&(K=K.slice(M.length))}}catch{}try{if(K)var Ee=new URL(K,Se.endsWith("/")?Se:Se+"/").toString();else var Ee=Se}catch{try{if(K)var Ee=new URL("/"+K,me).toString();else var Ee=new URL(he,me).toString()}catch{var Ee=me}}if(d&&await li(d,he),w&&Array.isArray(w)&&Aa(w),h&&ci(h),typeof p=="number"&&p>=0&&typeof Ki=="function"&&Ki(p*60*1e3),typeof m=="number"&&m>=0&&typeof Xi=="function"&&Xi(m),f&&Array.isArray(f)&&f.length)try{f.forEach(M=>{typeof M=="object"&&vi&&typeof Xr=="function"&&Xr(M)})}catch(M){k("[nimbi-cms] applying markdownExtensions failed",M)}try{typeof a=="number"&&Promise.resolve().then(()=>at).then(({setDefaultCrawlMaxQueue:M})=>{try{M(a)}catch(v){k("[nimbi-cms] setDefaultCrawlMaxQueue failed",v)}}),typeof n.fetchConcurrency=="number"&&Promise.resolve().then(()=>at).then(({setFetchConcurrency:M})=>{try{M(n.fetchConcurrency)}catch(v){k("[nimbi-cms] setFetchConcurrency failed",v)}}).catch(()=>{}),typeof n.negativeFetchCacheTTL=="number"&&Promise.resolve().then(()=>at).then(({setFetchNegativeCacheTTL:M})=>{try{M(n.negativeFetchCacheTTL)}catch(v){k("[nimbi-cms] setFetchNegativeCacheTTL failed",v)}}).catch(()=>{})}catch(M){k("[nimbi-cms] setDefaultCrawlMaxQueue import failed",M)}try{try{const M=n&&n.manifest?n.manifest:typeof globalThis<"u"&&globalThis.__NIMBI_CMS_MANIFEST__?globalThis.__NIMBI_CMS_MANIFEST__:typeof window<"u"&&window.__NIMBI_CMS_MANIFEST__?window.__NIMBI_CMS_MANIFEST__:null;if(M&&typeof M=="object")try{const v=await Promise.resolve().then(()=>at);if(v&&typeof v._setAllMd=="function"){v._setAllMd(M);try{$t("[nimbi-cms diagnostic] applied content manifest",()=>({manifestKeys:Object.keys(M).length}))}catch{}}}catch(v){k("[nimbi-cms] applying content manifest failed",v)}try{try{const v=Je(typeof window<"u"?window.location.href:"");if(v)try{if(v.type==="cosmetic")try{Jn(v)}catch{}else if(v.type==="canonical")try{Jn(v)}catch{}else if(v.type==="path")try{const U=(typeof location<"u"&&location&&location.pathname?String(location.pathname):"/").replace(/\/\/+$/,""),V=(he||"").replace(/\/\/+$/,"");let H="";try{H=new URL(Ee).pathname.replace(/\/\/+$/,"")}catch{H=""}if(U===V||U===H||U==="")try{Jn({type:"path",page:null,anchor:v.anchor||null,params:v.params||""})}catch{}}catch{}}catch{}}catch{}hi(Ee)}catch(v){k("[nimbi-cms] setContentBase failed",v)}try{try{const v=await Promise.resolve().then(()=>at);try{$t("[nimbi-cms diagnostic] after setContentBase",()=>({manifestKeys:M&&typeof M=="object"?Object.keys(M).length:0,slugToMdSize:v&&v.slugToMd&&typeof v.slugToMd.size=="number"?v.slugToMd.size:void 0,allMarkdownPathsLength:v&&Array.isArray(v.allMarkdownPaths)?v.allMarkdownPaths.length:void 0,allMarkdownPathsSetSize:v&&v.allMarkdownPathsSet&&typeof v.allMarkdownPathsSet.size=="number"?v.allMarkdownPathsSet.size:void 0,searchIndexLength:v&&Array.isArray(v.searchIndex)?v.searchIndex.length:void 0}))}catch{}}catch{}}catch{}}catch{}}catch(M){k("[nimbi-cms] setContentBase failed",M)}try{Ma(_)}catch(M){k("[nimbi-cms] setNotFoundPage failed",M)}try{typeof window<"u"&&window.__nimbiAutoAttachSitemapUI&&Promise.resolve().then(()=>Tn).then(M=>{try{M&&typeof M.attachSitemapDownloadUI=="function"&&M.attachSitemapDownloadUI(document.body,{filename:"sitemap.json"})}catch{}}).catch(()=>{})}catch{}let Fe=null,R=null;try{if(!Object.prototype.hasOwnProperty.call(n,"homePage")&&b)try{const L=[],U=[];try{b&&U.push(String(b))}catch{}try{const H=String(b||"").replace(/^_/,"");H&&H!==String(b)&&U.push(H)}catch{}try{U.push("navigation.md")}catch{}try{U.push("assets/navigation.md")}catch{}const V=[];for(const H of U)try{if(!H)continue;const $=String(H);V.includes($)||V.push($)}catch{}for(const H of V){L.push(H);try{if(R=await Be(H,Ee,{force:!0}),R&&R.raw){try{b=H}catch{}try{k("[nimbi-cms] fetched navigation candidate",H,"contentBase=",Ee)}catch{}Fe=await hn(R.raw||"");try{const $=He();if($&&Fe&&Fe.html){const q=$.parseFromString(Fe.html,"text/html").querySelector("a");if(q)try{const Q=q.getAttribute("href")||"",se=Je(Q);try{k("[nimbi-cms] parsed nav first-link href",Q,"->",se)}catch{}if(se&&se.page&&(se.type==="path"||se.type==="canonical")&&(se.page.includes(".")||se.page.includes("/"))){y=se.page;try{k("[nimbi-cms] derived homePage from navigation",y)}catch{}break}}catch{}}}catch{}}}catch{}}}catch{}try{k("[nimbi-cms] final homePage before slugManager setHomePage",y)}catch{}try{La(y)}catch(L){k("[nimbi-cms] setHomePage failed",L)}let v=!0;try{const L=Je(typeof location<"u"?location.href:"");L&&L.type==="cosmetic"&&(typeof _>"u"||_==null)&&(v=!1)}catch{}if(v&&y)try{await Be(y,Ee,{force:!0})}catch(L){throw new Error(`Required ${y} not found at ${Ee}${y}: ${L&&L.message?L.message:String(L)}`)}}catch(M){throw M}_a(u),await wa(g,he);const P=Mc({contentWrap:N,navWrap:C,container:B,mountOverlay:D,t:an,contentBase:Ee,homePage:y,initialDocumentTitle:Kn,runHooks:jr});try{if(typeof window<"u"){try{window.__nimbiUI=P}catch{}try{window.addEventListener("nimbi.coldRouteResolved",function(M){try{P&&typeof P.renderByQuery=="function"&&P.renderByQuery().catch(v=>{try{k("[nimbi-cms] renderByQuery failed for cold-route event",v)}catch{}})}catch{}})}catch{}try{const M=Array.isArray(window.__nimbiColdRouteResolved)?window.__nimbiColdRouteResolved.slice():null;if(M&&M.length){try{P.renderByQuery().catch(()=>{})}catch{}try{window.__nimbiColdRouteResolved=[]}catch{}}}catch{}}}catch{}try{const M=document.createElement("header");M.className="nimbi-site-navbar",O.insertBefore(M,z);let v=R,L=Fe;L||(v=await Be(b,Ee,{force:!0}),L=await hn(v.raw||""));const{navbar:U,linkEls:V}=await vc(M,B,L.html||"",Ee,y,an,P.renderByQuery,W,o,l,c,S);try{await jr("onNavBuild",{navWrap:C,navbar:U,linkEls:V,contentBase:Ee})}catch(H){k("[nimbi-cms] onNavBuild hooks failed",H)}try{try{if(V&&V.length){const H=await Promise.resolve().then(()=>at);for(const $ of Array.from(V||[]))try{const T=$&&$.getAttribute&&$.getAttribute("href")||"";if(!T)continue;let q=String(T||"").split(/::|#/,1)[0];if(q=String(q||"").split("?")[0],!q)continue;/\.(?:md|html?)$/.test(q)||(q=q+".html");let Q=null;try{Q=J(String(q||""))}catch{Q=String(q||"")}const se=String(Q||"").replace(/^.*\//,"").replace(/\?.*$/,"");if(!se)continue;try{let ye=null;try{H&&typeof H.slugify=="function"&&(ye=H.slugify(se.replace(/\.(?:md|html?)$/i,"")))}catch{ye=String(se||"").replace(/\s+/g,"-").toLowerCase()}if(!ye)continue;let we=ye;try{if(H&&H.slugToMd&&typeof H.slugToMd.has=="function"&&H.slugToMd.has(ye)){const pe=H.slugToMd.get(ye);let _e=!1;try{if(typeof pe=="string")pe===q&&(_e=!0);else if(pe&&typeof pe=="object"){pe.default===q&&(_e=!0);for(const ve of Object.keys(pe.langs||{}))if(pe.langs[ve]===q){_e=!0;break}}}catch{}if(!_e&&typeof H.uniqueSlug=="function")try{we=H.uniqueSlug(ye,new Set(H.slugToMd.keys()))}catch{we=ye}}}catch{}try{if(H&&typeof H._storeSlugMapping=="function")try{H._storeSlugMapping(we,Q)}catch{}else if(H&&H.slugToMd&&typeof H.slugToMd.set=="function")try{H.slugToMd.set(we,Q)}catch{}try{H&&H.mdToSlug&&typeof H.mdToSlug.set=="function"&&H.mdToSlug.set(Q,we)}catch{}try{H&&Array.isArray(H.allMarkdownPaths)&&!H.allMarkdownPaths.includes(Q)&&H.allMarkdownPaths.push(Q)}catch{}try{H&&H.allMarkdownPathsSet&&typeof H.allMarkdownPathsSet.add=="function"&&H.allMarkdownPathsSet.add(Q)}catch{}}catch{}}catch{}}catch{}try{const $=await Promise.resolve().then(()=>Rr);$&&typeof $.refreshIndexPaths=="function"&&$.refreshIndexPaths(Ee)}catch{}}}catch{}}catch{}try{let H=!1;try{const $=new URLSearchParams(location.search||"");($.has("sitemap")||$.has("rss")||$.has("atom"))&&(H=!0)}catch{}try{const T=(location.pathname||"/").replace(/\/\/+/g,"/").split("/").filter(Boolean).pop()||"";T&&/^(sitemap|sitemap\.xml|rss|rss\.xml|atom|atom\.xml)$/i.test(T)&&(H=!0)}catch{}if(H||A===!0||typeof window<"u"&&window.__nimbiExposeSitemap)try{try{const T=await Promise.resolve().then(()=>at);if(T&&typeof T.awaitSearchIndex=="function"){const q=[];y&&q.push(y),b&&q.push(b);try{await T.awaitSearchIndex({contentBase:Ee,indexDepth:Math.max(l||1,3),noIndexing:c,seedPaths:q.length?q:void 0,startBuild:!0,timeoutMs:1/0})}catch{}}}catch{}const $=await Promise.resolve().then(()=>Tn);try{if($&&typeof $.handleSitemapRequest=="function"&&await $.handleSitemapRequest({includeAllMarkdown:!0,homePage:y,navigationPage:b,notFoundPage:_,contentBase:Ee,indexDepth:l,noIndexing:c}))return}catch{}}catch{}try{Promise.resolve().then(()=>Tn).then($=>{try{if($&&typeof $.exposeSitemapGlobals=="function")try{$.exposeSitemapGlobals({includeAllMarkdown:!0,homePage:y,navigationPage:b,notFoundPage:_,contentBase:Ee,indexDepth:l,noIndexing:c,waitForIndexMs:1/0}).catch(()=>{})}catch{}}catch{}}).catch(()=>{})}catch{}}catch{}try{try{const $=await Promise.resolve().then(()=>Rr);if($&&typeof $.refreshIndexPaths=="function")try{$.refreshIndexPaths(Ee);try{try{const T=await Promise.resolve().then(()=>at);try{$t("[nimbi-cms diagnostic] after refreshIndexPaths",()=>({slugToMdSize:T&&T.slugToMd&&typeof T.slugToMd.size=="number"?T.slugToMd.size:void 0,allMarkdownPathsLength:T&&Array.isArray(T.allMarkdownPaths)?T.allMarkdownPaths.length:void 0,allMarkdownPathsSetSize:T&&T.allMarkdownPathsSet&&typeof T.allMarkdownPathsSet.size=="number"?T.allMarkdownPathsSet.size:void 0}))}catch{}}catch{}}catch{}try{const T=await Promise.resolve().then(()=>at),q=T&&T.slugToMd&&typeof T.slugToMd.size=="number"?T.slugToMd.size:0;let Q=!1;try{if(!manifest){q<30&&(Q=!0);try{const se=Je(typeof location<"u"?location.href:"");if(se){if(se.type==="cosmetic"&&se.page)try{T.slugToMd.has(se.page)||(Q=!0)}catch{}else if((se.type==="path"||se.type==="canonical")&&se.page)try{const ye=J(se.page);!(T.mdToSlug&&T.mdToSlug.has(ye))&&!(T.allMarkdownPathsSet&&T.allMarkdownPathsSet.has(ye))&&(Q=!0)}catch{}}}catch{}}}catch{}if(Q){let se=null;try{se=typeof window<"u"&&(window.__nimbiSitemapFinal||window.__nimbiResolvedIndex||window.__nimbiSearchIndex||window.__nimbiLiveSearchIndex||window.__nimbiSearchIndex)||null}catch{se=null}if(Array.isArray(se)&&se.length){let ye=0;for(const we of se)try{if(!we||!we.slug)continue;const pe=String(we.slug).split("::")[0];if(T.slugToMd.has(pe))continue;let _e=we.sourcePath||we.path||null;if(!_e&&Array.isArray(se)){const Ie=(se||[]).find(Ge=>Ge&&Ge.slug===we.slug);Ie&&Ie.path&&(_e=Ie.path)}if(!_e)continue;try{_e=String(_e)}catch{continue}let ve=null;try{const Ie=Ee&&typeof Ee=="string"?Ee:typeof location<"u"&&location.origin?location.origin+"/":"";try{const Ge=new URL(_e,Ie),Et=new URL(Ie);if(Ge.origin===Et.origin){const fn=Et.pathname||"/";let Ct=Ge.pathname||"";Ct.startsWith(fn)&&(Ct=Ct.slice(fn.length)),Ct.startsWith("/")&&(Ct=Ct.slice(1)),ve=J(Ct)}else ve=J(Ge.pathname||"")}catch{ve=J(_e)}}catch{ve=J(_e)}if(!ve)continue;ve=String(ve).split(/[?#]/)[0],ve=J(ve);try{T._storeSlugMapping(pe,ve)}catch{}ye++}catch{}if(ye){try{$t("[nimbi-cms diagnostic] populated slugToMd from sitemap/searchIndex",()=>({added:ye,total:T&&T.slugToMd&&typeof T.slugToMd.size=="number"?T.slugToMd.size:void 0}))}catch{}try{const we=await Promise.resolve().then(()=>Rr);we&&typeof we.refreshIndexPaths=="function"&&we.refreshIndexPaths(Ee)}catch{}}}}}catch{}}catch(T){k("[nimbi-cms] refreshIndexPaths after nav build failed",T)}}catch{}const H=()=>{const $=M&&M.getBoundingClientRect&&Math.round(M.getBoundingClientRect().height)||M&&M.offsetHeight||0;if($>0){try{O.style.setProperty("--nimbi-site-navbar-height",`${$}px`)}catch(T){k("[nimbi-cms] set CSS var failed",T)}try{B.style.paddingTop=""}catch(T){k("[nimbi-cms] set container paddingTop failed",T)}try{const T=O&&O.getBoundingClientRect&&Math.round(O.getBoundingClientRect().height)||O&&O.clientHeight||0;if(T>0){const q=Math.max(0,T-$);try{B.style.setProperty("--nimbi-cms-height",`${q}px`)}catch(Q){k("[nimbi-cms] set --nimbi-cms-height failed",Q)}}else try{B.style.setProperty("--nimbi-cms-height","calc(100vh - var(--nimbi-site-navbar-height))")}catch(q){k("[nimbi-cms] set --nimbi-cms-height failed",q)}}catch(T){k("[nimbi-cms] compute container height failed",T)}try{M.style.setProperty("--nimbi-site-navbar-height",`${$}px`)}catch(T){k("[nimbi-cms] set navbar CSS var failed",T)}}};H();try{if(typeof ResizeObserver<"u"){const $=new ResizeObserver(()=>H());try{$.observe(M)}catch(T){k("[nimbi-cms] ResizeObserver.observe failed",T)}}}catch($){k("[nimbi-cms] ResizeObserver setup failed",$)}}catch(H){k("[nimbi-cms] compute navbar height failed",H)}}catch(M){k("[nimbi-cms] build navigation failed",M)}try{Promise.resolve().then(()=>zc).then(({getVersion:M})=>{typeof M=="function"&&M().then(v=>{try{const L=v||"0.0.0";try{const U=$=>{const T=document.createElement("a");T.className="nimbi-version-label tag is-small",T.textContent=`nimbiCMS v. ${L}`,T.href=$||"#",T.target="_blank",T.rel="noopener noreferrer nofollow",T.setAttribute("aria-label",`nimbiCMS version ${L}`);try{ka(T)}catch{}try{O.appendChild(T)}catch(q){k("[nimbi-cms] append version label failed",q)}},V="https://abelvm.github.io/nimbiCMS/",H=(()=>{try{if(V&&typeof V=="string")return new URL(V).toString()}catch{}return"#"})();U(H)}catch(U){k("[nimbi-cms] building version label failed",U)}}catch(L){k("[nimbi-cms] building version label failed",L)}}).catch(v=>{k("[nimbi-cms] getVersion() failed",v)})}).catch(M=>{k("[nimbi-cms] import version module failed",M)})}catch(M){k("[nimbi-cms] version label setup failed",M)}})()}catch(z){throw I(z),z}}async function ls(){try{if("1.0.8".trim())return"1.0.8"}catch{}return"0.0.0"}const zc=Object.freeze(Object.defineProperty({__proto__:null,getVersion:ls},Symbol.toStringTag,{value:"Module"})),tt=jt,wn=k;function Ei(){try{if(typeof location<"u"&&location&&typeof location.pathname=="string")return String(location.origin+location.pathname.split("?")[0])}catch{}return"http://localhost/"}function De(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}function ha(e){try{return!e||typeof e!="string"?"":(e.split("/").filter(Boolean).pop()||e).replace(/\.[a-z0-9]+$/i,"").replace(/[-_]+/g," ").split(" ").map(r=>r?r.charAt(0).toUpperCase()+r.slice(1):"").join(" ").trim()}catch{return String(e)}}function Rc(e,t){try{const n=t&&t.slug?String(t.slug):null;if(!n)return null;const r={loc:e+"?page="+encodeURIComponent(n),slug:n};return t.title&&(r.title=String(t.title)),t.excerpt&&(r.excerpt=String(t.excerpt)),t.path&&(r.sourcePath=J(String(t.path))),r}catch{return null}}async function Ci(e={}){const{includeAllMarkdown:t=!0,index:n,homePage:i,navigationPage:r,notFoundPage:a}=e||{},o=Ei().split("?")[0];let l=Array.isArray(re)&&re.length?re:Array.isArray(n)?n:[];if(Array.isArray(n)&&n.length&&Array.isArray(re)&&re.length){const w=new Map;try{for(const y of n)try{y&&y.slug&&w.set(String(y.slug),y)}catch{}for(const y of re)try{y&&y.slug&&w.set(String(y.slug),y)}catch{}}catch{}l=Array.from(w.values())}const c=new Set;try{typeof a=="string"&&a.trim()&&c.add(J(String(a)))}catch{}try{typeof r=="string"&&r.trim()&&c.add(J(String(r)))}catch{}const u=new Set;try{if(typeof a=="string"&&a.trim()){const w=J(String(a));try{if(G&&typeof G.has=="function"&&G.has(w))try{u.add(G.get(w))}catch{}else try{const y=await Be(w,e&&e.contentBase?e.contentBase:void 0);if(y&&y.raw)try{let _=null;if(y.isHtml)try{const b=He();if(b){const A=b.parseFromString(y.raw,"text/html"),S=A.querySelector("h1")||A.querySelector("title");S&&S.textContent&&(_=S.textContent.trim())}else{const A=(y.raw||"").match(/<h1[^>]*>(.*?)<\/h1>|<title[^>]*>(.*?)<\/title>/i);A&&(_=(A[1]||A[2]||"").trim())}}catch{}else{const b=(y.raw||"").match(/^#\s+(.+)$/m);b&&b[1]&&(_=b[1].trim())}_&&u.add(de(_))}catch{}}catch{}}catch{}}}catch{}const g=new Set,h=[],d=new Map,p=new Map,m=w=>{try{if(!w||typeof w!="string")return!1;const y=J(String(w));try{if($e&&typeof $e.has=="function"&&$e.has(y))return!0}catch{}try{if(G&&typeof G.has=="function"&&G.has(y))return!0}catch{}try{if(p&&p.has(y))return!0}catch{}try{if(G&&typeof G.keys=="function"&&G.size)for(const _ of G.keys())try{if(J(String(_))===y)return!0}catch{}else for(const _ of Y.values())try{if(!_)continue;if(typeof _=="string"){if(J(String(_))===y)return!0}else if(_&&typeof _=="object"){if(_.default&&J(String(_.default))===y)return!0;const b=_.langs||{};for(const A of Object.keys(b||{}))try{if(b[A]&&J(String(b[A]))===y)return!0}catch{}}}catch{}}catch{}}catch{}return!1};if(Array.isArray(l)&&l.length){let w=0;for(const y of l){try{w++,await Pt(w,64)}catch{}try{if(!y||!y.slug)continue;const _=String(y.slug),b=String(_).split("::")[0];if(u.has(b))continue;const A=y.path?J(String(y.path)):null;if(A&&c.has(A))continue;const S=y.title?String(y.title):y.parentTitle?String(y.parentTitle):void 0;d.set(_,{title:S||void 0,excerpt:y.excerpt?String(y.excerpt):void 0,path:A,source:"index"}),A&&p.set(A,{title:S||void 0,excerpt:y.excerpt?String(y.excerpt):void 0,slug:_});const E=Rc(o,y);if(!E||!E.slug||g.has(E.slug))continue;if(g.add(E.slug),d.has(E.slug)){const I=d.get(E.slug);I&&I.title&&(E.title=I.title,E._titleSource="index"),I&&I.excerpt&&(E.excerpt=I.excerpt)}h.push(E)}catch{continue}}}if(t)try{let w=0;for(const[y,_]of Y.entries()){try{w++,await Pt(w,128)}catch{}try{if(!y)continue;const b=String(y).split("::")[0];if(g.has(y)||u.has(b))continue;let A=null;if(typeof _=="string"?A=J(String(_)):_&&typeof _=="object"&&(A=J(String(_.default||""))),A&&c.has(A))continue;const E={loc:o+"?page="+encodeURIComponent(y),slug:y};if(d.has(y)){const I=d.get(y);I&&I.title&&(E.title=I.title,E._titleSource="index"),I&&I.excerpt&&(E.excerpt=I.excerpt)}else if(A){const I=p.get(A);I&&I.title&&(E.title=I.title,E._titleSource="path",!E.excerpt&&I.excerpt&&(E.excerpt=I.excerpt))}if(g.add(y),typeof y=="string"){const I=y.indexOf("/")!==-1||/\.(md|html?)$/i.test(y),O=E.title&&typeof E.title=="string"&&(E.title.indexOf("/")!==-1||/\.(md|html?)$/i.test(E.title));(!E.title||O||I)&&(E.title=ha(y),E._titleSource="humanize")}h.push(E)}catch{}}try{if(i&&typeof i=="string"){const y=J(String(i));let _=null;try{G&&G.has(y)&&(_=G.get(y))}catch{}_||(_=y);const b=String(_).split("::")[0];if(!g.has(_)&&!c.has(y)&&!u.has(b)){const A={loc:o+"?page="+encodeURIComponent(_),slug:_};if(d.has(_)){const S=d.get(_);S&&S.title&&(A.title=S.title,A._titleSource="index"),S&&S.excerpt&&(A.excerpt=S.excerpt)}g.add(_),h.push(A)}}}catch{}}catch{}try{const w=new Set,y=new Set(h.map(E=>String(E&&E.slug?E.slug:""))),_=new Set;for(const E of h)try{E&&E.sourcePath&&_.add(String(E.sourcePath))}catch{}const b=30;let A=0,S=0;for(const E of _){try{S++,await Pt(S,8)}catch{}if(A>=b)break;try{if(!E||typeof E!="string"||!m(E))continue;A+=1;const I=await Be(E,e&&e.contentBase?e.contentBase:void 0);if(!I||!I.raw||I&&typeof I.status=="number"&&I.status===404)continue;const O=I.raw,W=(function(j){try{return String(j||"")}catch{return""}})(O),z=[],B=/\[[^\]]+\]\(([^)]+)\)/g;let Z;for(;Z=B.exec(W);)try{Z&&Z[1]&&z.push(Z[1])}catch{}const ee=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;Z=ee.exec(W);)try{Z&&Z[1]&&z.push(Z[1])}catch{}for(const j of z)try{if(!j)continue;if(j.indexOf("?")!==-1||j.indexOf("=")!==-1)try{const D=new URL(j,o).searchParams.get("page");if(D){const ie=String(D);!y.has(ie)&&!w.has(ie)&&(w.add(ie),h.push({loc:o+"?page="+encodeURIComponent(ie),slug:ie}));continue}}catch{}let C=String(j).split(/[?#]/)[0];if(C=C.replace(/^\.\//,"").replace(/^\//,""),!C||!/\.(md|html?)$/i.test(C))continue;try{const N=J(C);if(G&&G.has(N)){const D=G.get(N),ie=String(D).split("::")[0];D&&!y.has(D)&&!w.has(D)&&!u.has(ie)&&!c.has(N)&&(w.add(D),h.push({loc:o+"?page="+encodeURIComponent(D),slug:D,sourcePath:N}));continue}try{if(!m(N))continue;const D=await Be(N,e&&e.contentBase?e.contentBase:void 0);if(D&&typeof D.status=="number"&&D.status===404)continue;if(D&&D.raw){const ie=(D.raw||"").match(/^#\s+(.+)$/m),he=ie&&ie[1]?ie[1].trim():"",K=de(he||N),Le=String(K).split("::")[0];K&&!y.has(K)&&!w.has(K)&&!u.has(Le)&&(w.add(K),h.push({loc:o+"?page="+encodeURIComponent(K),slug:K,sourcePath:N,title:he||void 0}))}}catch{}}catch{}}catch{}}catch{}}}catch{}try{const w=new Map;let y=0;for(const b of h){try{y++,await Pt(y,128)}catch{}try{if(!b||!b.slug)continue;w.set(String(b.slug),b)}catch{}}const _=new Set;for(const b of h)try{if(!b||!b.slug)continue;const A=String(b.slug),S=A.split("::")[0];if(!S)continue;A!==S&&!w.has(S)&&_.add(S)}catch{}for(const b of _)try{let A=null;if(d.has(b)){const S=d.get(b);A={loc:o+"?page="+encodeURIComponent(b),slug:b},S&&S.title&&(A.title=S.title,A._titleSource="index"),S&&S.excerpt&&(A.excerpt=S.excerpt),S&&S.path&&(A.sourcePath=S.path)}else if(p&&Y&&Y.has(b)){const S=Y.get(b);let E=null;if(typeof S=="string"?E=J(String(S)):S&&typeof S=="object"&&(E=J(String(S.default||""))),A={loc:o+"?page="+encodeURIComponent(b),slug:b},E&&p.has(E)){const I=p.get(E);I&&I.title&&(A.title=I.title,A._titleSource="path"),I&&I.excerpt&&(A.excerpt=I.excerpt),A.sourcePath=E}}A||(A={loc:o+"?page="+encodeURIComponent(b),slug:b,title:ha(b)},A._titleSource="humanize"),w.has(b)||(h.push(A),w.set(b,A))}catch{}}catch{}const f=[];try{const w=new Set;let y=0;for(const _ of h){try{y++,await Pt(y,128)}catch{}try{if(!_||!_.slug)continue;const b=String(_.slug),A=String(b).split("::")[0];if(u.has(A)||b.indexOf("::")!==-1||w.has(b))continue;w.add(b),f.push(_)}catch{}}}catch{}try{try{tt(()=>"[runtimeSitemap] generateSitemapJson finalEntries.titleSource: "+JSON.stringify(f.map(w=>({slug:w.slug,title:w.title,titleSource:w._titleSource||null})),null,2))}catch{}}catch{}try{let y=0;const _=f.length,b=Array.from({length:Math.min(4,_)}).map(async()=>{for(;;){const A=y++;if(A>=_)break;const S=f[A];try{if(!S||!S.slug)continue;const E=String(S.slug).split("::")[0];if(u.has(E)||S._titleSource==="index")continue;let I=null;try{if(Y&&Y.has(S.slug)){const O=Y.get(S.slug);typeof O=="string"?I=J(String(O)):O&&typeof O=="object"&&(I=J(String(O.default||"")))}!I&&S.sourcePath&&(I=S.sourcePath)}catch{continue}if(!I||c.has(I)||!m(I))continue;try{const O=await Be(I,e&&e.contentBase?e.contentBase:void 0);if(!O||!O.raw||O&&typeof O.status=="number"&&O.status===404)continue;if(O&&O.raw){const W=(O.raw||"").match(/^#\s+(.+)$/m),z=W&&W[1]?W[1].trim():"";z&&(S.title=z,S._titleSource="fetched")}}catch(O){tt("[runtimeSitemap] fetch title failed for",I,O)}}catch(E){tt("[runtimeSitemap] worker loop failure",E)}}});await Promise.all(b)}catch(w){tt("[runtimeSitemap] title enrichment failed",w)}return{generatedAt:new Date().toISOString(),entries:f}}function ti(e){const t=e&&Array.isArray(e.entries)?e.entries:Array.isArray(e)?e:[];let n=`<?xml version="1.0" encoding="UTF-8"?>
`;n+=`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;for(const i of t)try{n+=`  <url>
`,n+=`    <loc>${De(String(i.loc||""))}</loc>
`,n+=`  </url>
`}catch{}return n+=`</urlset>
`,n}function ni(e){const t=e&&Array.isArray(e.entries)?e.entries:Array.isArray(e)?e:[],n=Ei().split("?")[0];let i=`<?xml version="1.0" encoding="UTF-8"?>
`;i+=`<rss version="2.0">
`,i+=`<channel>
`,i+=`<title>${De("Sitemap RSS")}</title>
`,i+=`<link>${De(n)}</link>
`,i+=`<description>${De("RSS feed generated from site index")}</description>
`,i+=`<lastBuildDate>${De(e&&e.generatedAt?new Date(e.generatedAt).toUTCString():new Date().toUTCString())}</lastBuildDate>
`;for(const r of t)try{const a=String(r.loc||"");i+=`<item>
`,i+=`<title>${De(String(r.title||r.slug||r.loc||""))}</title>
`,r.excerpt&&(i+=`<description>${De(String(r.excerpt))}</description>
`),i+=`<link>${De(a)}</link>
`,i+=`<guid>${De(a)}</guid>
`,i+=`</item>
`}catch{}return i+=`</channel>
`,i+=`</rss>
`,i}function ri(e){const t=e&&Array.isArray(e.entries)?e.entries:Array.isArray(e)?e:[],n=Ei().split("?")[0],i=e&&e.generatedAt?new Date(e.generatedAt).toISOString():new Date().toISOString();let r=`<?xml version="1.0" encoding="utf-8"?>
`;r+=`<feed xmlns="http://www.w3.org/2005/Atom">
`,r+=`<title>${De("Sitemap Atom")}</title>
`,r+=`<link href="${De(n)}" />
`,r+=`<updated>${De(i)}</updated>
`,r+=`<id>${De(n)}</id>
`;for(const a of t)try{const s=String(a.loc||""),o=a&&a.lastmod?new Date(a.lastmod).toISOString():i;r+=`<entry>
`,r+=`<title>${De(String(a.title||a.slug||a.loc||""))}</title>
`,a.excerpt&&(r+=`<summary>${De(String(a.excerpt))}</summary>
`),r+=`<link href="${De(s)}" />
`,r+=`<id>${De(s)}</id>
`,r+=`<updated>${De(o)}</updated>
`,r+=`</entry>
`}catch{}return r+=`</feed>
`,r}function da(e,t="application/xml"){try{try{document.open(t,"replace")}catch{try{document.open()}catch{}}document.write(e),document.close();try{if(typeof Blob<"u"&&typeof URL<"u"&&URL.createObjectURL){const n=new Blob([e],{type:t}),i=URL.createObjectURL(n);try{location.href=i}catch{try{window.open(i,"_self")}catch{}}setTimeout(()=>{try{URL.revokeObjectURL(i)}catch{}},5e3)}}catch{}}catch{try{try{const i=document.createElement("pre");try{i.textContent=De(e)}catch{try{i.textContent=String(e)}catch{}}if(document&&document.body)try{if(typeof document.body.replaceChildren=="function")document.body.replaceChildren(i);else{for(;document.body.firstChild;)document.body.removeChild(document.body.firstChild);document.body.appendChild(i)}}catch{try{document.body.innerHTML="<pre>"+De(e)+"</pre>"}catch{}}}catch{}}catch{}}}function fa(e){try{const t=e&&Array.isArray(e.entries)?e.entries:Array.isArray(e)?e:[];let n='<!doctype html><html><head><meta charset="utf-8"><title>Sitemap</title></head><body>';n+="<h1>Sitemap</h1><ul>";for(const i of t)try{n+=`<li><a href="${De(String(i&&i.loc?i.loc:""))}">${De(String(i&&(i.title||i.slug)||i&&i.loc||""))}</a></li>`}catch{}return n+="</ul></body></html>",n}catch{return"<!doctype html><html><body><pre>failed to render sitemap</pre></body></html>"}}function Vn(e,t="application/xml"){try{if(typeof window>"u"){try{let i=null;t==="application/rss+xml"?i=ni(e):t==="application/atom+xml"?i=ri(e):t==="text/html"?i=fa(e):i=ti(e),da(i,t);try{typeof window<"u"&&(window.__nimbiSitemapRenderedAt=Date.now(),window.__nimbiSitemapJson=e,window.__nimbiSitemapFinal=e.entries||[])}catch{}}catch{}return}const n=Array.isArray(e&&e.entries)?e.entries.length:0;try{const i=window.__nimbiSitemapPendingWrite||null;if((!i||typeof i.len=="number"&&i.len<n)&&(window.__nimbiSitemapPendingWrite={finalJson:e,mimeType:t,len:n}),window.__nimbiSitemapWriteTimer)return;window.__nimbiSitemapWriteTimer=setTimeout(()=>{try{const r=window.__nimbiSitemapPendingWrite;if(!r)return;let a=null;r.mimeType==="application/rss+xml"?a=ni(r.finalJson):r.mimeType==="application/atom+xml"?a=ri(r.finalJson):r.mimeType==="text/html"?a=fa(r.finalJson):a=ti(r.finalJson);try{da(a,r.mimeType)}catch{}try{window.__nimbiSitemapRenderedAt=Date.now(),window.__nimbiSitemapJson=r.finalJson,window.__nimbiSitemapFinal=r.finalJson.entries||[]}catch{}}catch{}try{clearTimeout(window.__nimbiSitemapWriteTimer)}catch{}window.__nimbiSitemapWriteTimer=null,window.__nimbiSitemapPendingWrite=null},40)}catch{}}catch{}}async function $c(e={}){try{if(typeof document>"u"||typeof location>"u")return!1;let t=!1,n=!1,i=!1,r=!1;try{const u=new URLSearchParams(location.search||"");if(u.has("sitemap")){let g=!0;for(const h of u.keys())h!=="sitemap"&&(g=!1);g&&(t=!0)}if(u.has("rss")){let g=!0;for(const h of u.keys())h!=="rss"&&(g=!1);g&&(n=!0)}if(u.has("atom")){let g=!0;for(const h of u.keys())h!=="atom"&&(g=!1);g&&(i=!0)}}catch{}if(!t&&!n&&!i){const g=(location.pathname||"/").replace(/\/\/+/g,"/").split("/").filter(Boolean).pop()||"";if(!g||(t=/^(sitemap|sitemap\.xml)$/i.test(g),n=/^(rss|rss\.xml)$/i.test(g),i=/^(atom|atom\.xml)$/i.test(g),r=/^(sitemap|sitemap\.html)$/i.test(g),!t&&!n&&!i&&!r))return!1}let a=[];const s=typeof e.waitForIndexMs=="number"?e.waitForIndexMs:1/0;try{if(typeof Bt=="function")try{const u=await Bt({timeoutMs:s,contentBase:e&&e.contentBase,indexDepth:e&&e.indexDepth,noIndexing:e&&e.noIndexing,startBuild:!0});if(Array.isArray(u)&&u.length)if(Array.isArray(e.index)&&e.index.length){const g=new Map;try{for(const h of e.index)try{h&&h.slug&&g.set(String(h.slug),h)}catch{}for(const h of u)try{h&&h.slug&&g.set(String(h.slug),h)}catch{}}catch{}a=Array.from(g.values())}else a=u;else a=Array.isArray(e.index)&&e.index.length?e.index:Array.isArray(re)&&re.length?re:[]}catch{a=Array.isArray(e.index)&&e.index.length?e.index:Array.isArray(re)&&re.length?re:[]}else a=Array.isArray(re)&&re.length?re:Array.isArray(e.index)&&e.index.length?e.index:[]}catch{a=Array.isArray(e.index)&&e.index.length?e.index:Array.isArray(re)&&re.length?re:[]}try{if(Array.isArray(e.index)&&e.index.length)try{const u=new Map;for(const g of e.index)try{if(!g||!g.slug)continue;const h=String(g.slug).split("::")[0];if(!u.has(h))u.set(h,g);else{const d=u.get(h);d&&String(d.slug||"").indexOf("::")!==-1&&String(g.slug||"").indexOf("::")===-1&&u.set(h,g)}}catch{}try{tt(()=>"[runtimeSitemap] providedIndex.dedupedByBase: "+JSON.stringify(Array.from(u.values()),null,2))}catch{tt(()=>"[runtimeSitemap] providedIndex.dedupedByBase (count): "+String(u.size))}}catch(u){wn("[runtimeSitemap] logging provided index failed",u)}}catch{}if((!Array.isArray(a)||!a.length)&&typeof Zt=="function")try{const u=typeof e.waitForIndexMs=="number"?e.waitForIndexMs:1/0;let g=null;try{typeof Bt=="function"&&(g=await Bt({timeoutMs:u,contentBase:e&&e.contentBase,indexDepth:e&&e.indexDepth,noIndexing:e&&e.noIndexing,startBuild:!0}))}catch{g=null}if(Array.isArray(g)&&g.length)a=g;else{const h=typeof e.indexDepth=="number"?e.indexDepth:3,d=Array.isArray(e.noIndexing)?e.noIndexing:void 0,p=[];e&&e.homePage&&p.push(e.homePage),e&&e.navigationPage&&p.push(e.navigationPage),a=await Zt(e&&e.contentBase?e.contentBase:void 0,h,d,p.length?p:void 0)}}catch(u){wn("[runtimeSitemap] rebuild index failed",u),a=Array.isArray(re)&&re.length?re:[]}try{const u=Array.isArray(a)?a.length:0;try{tt(()=>"[runtimeSitemap] usedIndex.full.length (before rebuild): "+String(u))}catch{}try{tt(()=>"[runtimeSitemap] usedIndex.full (before rebuild): "+JSON.stringify(a,null,2))}catch{}}catch{}try{const u=[];e&&e.homePage&&u.push(e.homePage),e&&e.navigationPage&&u.push(e.navigationPage);const g=typeof e.indexDepth=="number"?e.indexDepth:3,h=Array.isArray(e.noIndexing)?e.noIndexing:void 0;let d=null;try{const p=typeof globalThis<"u"&&typeof globalThis.buildSearchIndexWorker=="function"?globalThis.buildSearchIndexWorker:void 0;if(typeof p=="function")try{d=await p(e&&e.contentBase?e.contentBase:void 0,g,h)}catch{d=null}}catch{d=null}if((!d||!d.length)&&typeof Zt=="function")try{d=await Zt(e&&e.contentBase?e.contentBase:void 0,g,h,u.length?u:void 0)}catch{d=null}if(Array.isArray(d)&&d.length){const p=new Map;try{for(const m of a)try{m&&m.slug&&p.set(String(m.slug),m)}catch{}for(const m of d)try{m&&m.slug&&p.set(String(m.slug),m)}catch{}}catch{}a=Array.from(p.values())}}catch(u){try{wn("[runtimeSitemap] rebuild index call failed",u)}catch{}}try{const u=Array.isArray(a)?a.length:0;try{tt(()=>"[runtimeSitemap] usedIndex.full.length (after rebuild): "+String(u))}catch{}try{tt(()=>"[runtimeSitemap] usedIndex.full (after rebuild): "+JSON.stringify(a,null,2))}catch{}}catch{}const o=await Ci(Object.assign({},e,{index:a}));let l=[];try{const u=new Set,g=Array.isArray(o&&o.entries)?o.entries:[];for(const h of g)try{let d=null;if(h&&h.slug)d=String(h.slug);else if(h&&h.loc)try{d=new URL(String(h.loc)).searchParams.get("page")}catch{}if(!d)continue;const p=String(d).split("::")[0];if(!u.has(p)){u.add(p);const m=Object.assign({},h);m.baseSlug=p,l.push(m)}}catch{}try{tt(()=>"[runtimeSitemap] finalEntries.dedupedByBase: "+JSON.stringify(l,null,2))}catch{tt(()=>"[runtimeSitemap] finalEntries.dedupedByBase (count): "+String(l.length))}}catch{try{l=Array.isArray(o&&o.entries)?o.entries.slice(0):[]}catch{l=[]}}const c=Object.assign({},o||{},{entries:Array.isArray(l)?l:Array.isArray(o&&o.entries)?o.entries:[]});try{if(typeof window<"u")try{window.__nimbiSitemapJson=c,window.__nimbiSitemapFinal=l}catch{}}catch{}if(n){const u=Array.isArray(c&&c.entries)?c.entries.length:0;let g=-1;try{typeof window<"u"&&Array.isArray(window.__nimbiSitemapFinal)&&typeof window.__nimbiSitemapRenderedAt=="number"&&(g=window.__nimbiSitemapFinal.length)}catch{}if(g>u){try{tt("[runtimeSitemap] skip RSS write: existing rendered sitemap larger",g,u)}catch{}return!0}return Vn(c,"application/rss+xml"),!0}if(i){const u=Array.isArray(c&&c.entries)?c.entries.length:0;let g=-1;try{typeof window<"u"&&Array.isArray(window.__nimbiSitemapFinal)&&typeof window.__nimbiSitemapRenderedAt=="number"&&(g=window.__nimbiSitemapFinal.length)}catch{}if(g>u){try{tt("[runtimeSitemap] skip Atom write: existing rendered sitemap larger",g,u)}catch{}return!0}return Vn(c,"application/atom+xml"),!0}if(t){const u=Array.isArray(c&&c.entries)?c.entries.length:0;let g=-1;try{typeof window<"u"&&Array.isArray(window.__nimbiSitemapFinal)&&typeof window.__nimbiSitemapRenderedAt=="number"&&(g=window.__nimbiSitemapFinal.length)}catch{}if(g>u){try{tt("[runtimeSitemap] skip XML write: existing rendered sitemap larger",g,u)}catch{}return!0}return Vn(c,"application/xml"),!0}if(r)try{const g=(Array.isArray(c&&c.entries)?c.entries:[]).length;let h=-1;try{typeof window<"u"&&Array.isArray(window.__nimbiSitemapFinal)&&typeof window.__nimbiSitemapRenderedAt=="number"&&(h=window.__nimbiSitemapFinal.length)}catch{}if(h>g){try{tt("[runtimeSitemap] skip HTML write: existing rendered sitemap larger",h,g)}catch{}return!0}return Vn(c,"text/html"),!0}catch(u){return wn("[runtimeSitemap] render HTML failed",u),!1}return!1}catch(t){return wn("[runtimeSitemap] handleSitemapRequest failed",t),!1}}async function Pc(e={}){try{const t=typeof e.waitForIndexMs=="number"?e.waitForIndexMs:1/0;let n=[];try{if(typeof Bt=="function")try{const s=await Bt({timeoutMs:t,contentBase:e&&e.contentBase,indexDepth:e&&e.indexDepth,noIndexing:e&&e.noIndexing,startBuild:!0});Array.isArray(s)&&s.length&&(n=s)}catch{}}catch{}(!Array.isArray(n)||!n.length)&&Array.isArray(re)&&re.length&&(n=re),(!Array.isArray(n)||!n.length)&&Array.isArray(e.index)&&e.index.length&&(n=e.index);const i=await Ci(Object.assign({},e,{index:n}));let r=[];try{const s=new Set,o=Array.isArray(i&&i.entries)?i.entries:[];for(const l of o)try{let c=null;if(l&&l.slug)c=String(l.slug);else if(l&&l.loc)try{c=new URL(String(l.loc)).searchParams.get("page")}catch{c=null}if(!c)continue;const u=String(c).split("::")[0];if(!s.has(u)){s.add(u);const g=Object.assign({},l);g.baseSlug=u,r.push(g)}}catch{}}catch{try{r=Array.isArray(i&&i.entries)?i.entries.slice(0):[]}catch{r=[]}}const a=Object.assign({},i||{},{entries:Array.isArray(r)?r:Array.isArray(i&&i.entries)?i.entries:[]});try{if(typeof window<"u")try{window.__nimbiSitemapJson=a,window.__nimbiSitemapFinal=r}catch{}}catch{}return{json:a,deduped:r}}catch{return null}}const Tn=Object.freeze(Object.defineProperty({__proto__:null,exposeSitemapGlobals:Pc,generateAtomXml:ri,generateRssXml:ni,generateSitemapJson:Ci,generateSitemapXml:ti,handleSitemapRequest:$c},Symbol.toStringTag,{value:"Module"}));exports.BAD_LANGUAGES=si;exports.SUPPORTED_HLJS_MAP=Ce;exports._clearHooks=Ws;exports.addHook=gr;exports.default=os;exports.ensureBulma=wa;exports.getVersion=ls;exports.initCMS=os;exports.loadL10nFile=li;exports.loadSupportedLanguages=oi;exports.observeCodeBlocks=ba;exports.onNavBuild=Ds;exports.onPageLoad=Fs;exports.registerLanguage=ln;exports.runHooks=jr;exports.setHighlightTheme=eo;exports.setLang=ci;exports.setStyle=_a;exports.setThemeVars=no;exports.t=an;exports.transformHtml=Us;
