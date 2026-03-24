(function(Oe,Ft){typeof exports=="object"&&typeof module<"u"?Ft(exports):typeof define=="function"&&define.amd?define(["exports"],Ft):(Oe=typeof globalThis<"u"?globalThis:Oe||self,Ft(Oe.nimbiCMS={}))})(this,(function(Oe){"use strict";let Ft=0;const yi=Object.create(null);function bi(e){try{const t=Number(e);Ft=Number.isFinite(t)&&t>=0?Math.max(0,Math.min(3,Math.floor(t))):0}catch{Ft=0}}function Dt(e=1){try{return Number(Ft)>=Number(e||1)}catch{return!1}}function mr(){return Dt(1)}function On(...e){try{if(!Dt(1)||!console||typeof console.error!="function")return;const t=e.map(n=>typeof n=="function"?n():n);console.error(...t)}catch{}}function k(...e){try{if(!Dt(2)||!console||typeof console.warn!="function")return;const t=e.map(n=>typeof n=="function"?n():n);console.warn(...t)}catch{}}function Tt(...e){try{if(!Dt(3)||!console||typeof console.info!="function")return;const t=e.map(n=>typeof n=="function"?n():n);console.info(...t)}catch{}}function Rt(...e){try{if(!Dt(3)||!console||typeof console.log!="function")return;const t=e.map(n=>typeof n=="function"?n():n);console.log(...t)}catch{}}function wi(e){try{if(!mr())return;const t=String(e||"");if(!t)return;yi[t]=(yi[t]||0)+1}catch{}}function _i(e){try{if(typeof globalThis>"u"||!globalThis.__nimbiCMSDebug)return;const t=String(e||"");if(!t)return;try{globalThis.__nimbiCMSDebug[t]=(globalThis.__nimbiCMSDebug[t]||0)+1}catch{}}catch{}}const un={onPageLoad:[],onNavBuild:[],transformHtml:[]};function jn(e,t){if(!Object.prototype.hasOwnProperty.call(un,e))throw new Error('Unknown hook "'+e+'"');if(typeof t!="function")throw new TypeError("hook callback must be a function");un[e].push(t)}function Va(e){jn("onPageLoad",e)}function Ya(e){jn("onNavBuild",e)}function Ja(e){jn("transformHtml",e)}async function yr(e,t){const n=un[e]||[];for(const i of n)try{await i(t)}catch(r){try{k("[nimbi-cms] runHooks callback failed",r)}catch{}}}function es(){Object.keys(un).forEach(e=>{un[e].length=0})}function ki(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var br,xi;function ts(){if(xi)return br;xi=1;function e(x){return x instanceof Map?x.clear=x.delete=x.set=function(){throw new Error("map is read-only")}:x instanceof Set&&(x.add=x.clear=x.delete=function(){throw new Error("set is read-only")}),Object.freeze(x),Object.getOwnPropertyNames(x).forEach(N=>{const J=x[N],we=typeof J;(we==="object"||we==="function")&&!Object.isFrozen(J)&&e(J)}),x}class t{constructor(N){N.data===void 0&&(N.data={}),this.data=N.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function n(x){return x.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function i(x,...N){const J=Object.create(null);for(const we in x)J[we]=x[we];return N.forEach(function(we){for(const We in we)J[We]=we[We]}),J}const r="</span>",a=x=>!!x.scope,s=(x,{prefix:N})=>{if(x.startsWith("language:"))return x.replace("language:","language-");if(x.includes(".")){const J=x.split(".");return[`${N}${J.shift()}`,...J.map((we,We)=>`${we}${"_".repeat(We+1)}`)].join(" ")}return`${N}${x}`};class o{constructor(N,J){this.buffer="",this.classPrefix=J.classPrefix,N.walk(this)}addText(N){this.buffer+=n(N)}openNode(N){if(!a(N))return;const J=s(N.scope,{prefix:this.classPrefix});this.span(J)}closeNode(N){a(N)&&(this.buffer+=r)}value(){return this.buffer}span(N){this.buffer+=`<span class="${N}">`}}const l=(x={})=>{const N={children:[]};return Object.assign(N,x),N};class c{constructor(){this.rootNode=l(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(N){this.top.children.push(N)}openNode(N){const J=l({scope:N});this.add(J),this.stack.push(J)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(N){return this.constructor._walk(N,this.rootNode)}static _walk(N,J){return typeof J=="string"?N.addText(J):J.children&&(N.openNode(J),J.children.forEach(we=>this._walk(N,we)),N.closeNode(J)),N}static _collapse(N){typeof N!="string"&&N.children&&(N.children.every(J=>typeof J=="string")?N.children=[N.children.join("")]:N.children.forEach(J=>{c._collapse(J)}))}}class u extends c{constructor(N){super(),this.options=N}addText(N){N!==""&&this.add(N)}startScope(N){this.openNode(N)}endScope(){this.closeNode()}__addSublanguage(N,J){const we=N.root;J&&(we.scope=`language:${J}`),this.add(we)}toHTML(){return new o(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function d(x){return x?typeof x=="string"?x:x.source:null}function h(x){return m("(?=",x,")")}function f(x){return m("(?:",x,")*")}function p(x){return m("(?:",x,")?")}function m(...x){return x.map(J=>d(J)).join("")}function g(x){const N=x[x.length-1];return typeof N=="object"&&N.constructor===Object?(x.splice(x.length-1,1),N):{}}function b(...x){return"("+(g(x).capture?"":"?:")+x.map(we=>d(we)).join("|")+")"}function y(x){return new RegExp(x.toString()+"|").exec("").length-1}function _(x,N){const J=x&&x.exec(N);return J&&J.index===0}const w=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function A(x,{joinWith:N}){let J=0;return x.map(we=>{J+=1;const We=J;let Ze=d(we),oe="";for(;Ze.length>0;){const ae=w.exec(Ze);if(!ae){oe+=Ze;break}oe+=Ze.substring(0,ae.index),Ze=Ze.substring(ae.index+ae[0].length),ae[0][0]==="\\"&&ae[1]?oe+="\\"+String(Number(ae[1])+We):(oe+=ae[0],ae[0]==="("&&J++)}return oe}).map(we=>`(${we})`).join(N)}const S=/\b\B/,M="[a-zA-Z]\\w*",I="[a-zA-Z_]\\w*",q="\\b\\d+(\\.\\d+)?",Q="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",R="\\b(0b[01]+)",O="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",G=(x={})=>{const N=/^#![ ]*\//;return x.binary&&(x.begin=m(N,/.*\b/,x.binary,/\b.*/)),i({scope:"meta",begin:N,end:/$/,relevance:0,"on:begin":(J,we)=>{J.index!==0&&we.ignoreMatch()}},x)},re={begin:"\\\\[\\s\\S]",relevance:0},D={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[re]},L={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[re]},H={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},W=function(x,N,J={}){const we=i({scope:"comment",begin:x,end:N,contains:[]},J);we.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const We=b("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return we.contains.push({begin:m(/[ ]+/,"(",We,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),we},ie=W("//","$"),ye=W("/\\*","\\*/"),ee=W("#","$"),$e={scope:"number",begin:q,relevance:0},ke={scope:"number",begin:Q,relevance:0},xe={scope:"number",begin:R,relevance:0},Ce={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[re,{begin:/\[/,end:/\]/,relevance:0,contains:[re]}]},Fe={scope:"title",begin:M,relevance:0},T={scope:"title",begin:I,relevance:0},$={begin:"\\.\\s*"+I,relevance:0};var v=Object.freeze({__proto__:null,APOS_STRING_MODE:D,BACKSLASH_ESCAPE:re,BINARY_NUMBER_MODE:xe,BINARY_NUMBER_RE:R,COMMENT:W,C_BLOCK_COMMENT_MODE:ye,C_LINE_COMMENT_MODE:ie,C_NUMBER_MODE:ke,C_NUMBER_RE:Q,END_SAME_AS_BEGIN:function(x){return Object.assign(x,{"on:begin":(N,J)=>{J.data._beginMatch=N[1]},"on:end":(N,J)=>{J.data._beginMatch!==N[1]&&J.ignoreMatch()}})},HASH_COMMENT_MODE:ee,IDENT_RE:M,MATCH_NOTHING_RE:S,METHOD_GUARD:$,NUMBER_MODE:$e,NUMBER_RE:q,PHRASAL_WORDS_MODE:H,QUOTE_STRING_MODE:L,REGEXP_MODE:Ce,RE_STARTERS_RE:O,SHEBANG:G,TITLE_MODE:Fe,UNDERSCORE_IDENT_RE:I,UNDERSCORE_TITLE_MODE:T});function C(x,N){x.input[x.index-1]==="."&&N.ignoreMatch()}function F(x,N){x.className!==void 0&&(x.scope=x.className,delete x.className)}function Y(x,N){N&&x.beginKeywords&&(x.begin="\\b("+x.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",x.__beforeBegin=C,x.keywords=x.keywords||x.beginKeywords,delete x.beginKeywords,x.relevance===void 0&&(x.relevance=0))}function B(x,N){Array.isArray(x.illegal)&&(x.illegal=b(...x.illegal))}function P(x,N){if(x.match){if(x.begin||x.end)throw new Error("begin & end are not supported with match");x.begin=x.match,delete x.match}}function z(x,N){x.relevance===void 0&&(x.relevance=1)}const j=(x,N)=>{if(!x.beforeMatch)return;if(x.starts)throw new Error("beforeMatch cannot be used with starts");const J=Object.assign({},x);Object.keys(x).forEach(we=>{delete x[we]}),x.keywords=J.keywords,x.begin=m(J.beforeMatch,h(J.begin)),x.starts={relevance:0,contains:[Object.assign(J,{endsParent:!0})]},x.relevance=0,delete J.beforeMatch},Z=["of","and","for","in","not","or","if","then","parent","list","value"],se="keyword";function pe(x,N,J=se){const we=Object.create(null);return typeof x=="string"?We(J,x.split(" ")):Array.isArray(x)?We(J,x):Object.keys(x).forEach(function(Ze){Object.assign(we,pe(x[Ze],N,Ze))}),we;function We(Ze,oe){N&&(oe=oe.map(ae=>ae.toLowerCase())),oe.forEach(function(ae){const me=ae.split("|");we[me[0]]=[Ze,be(me[0],me[1])]})}}function be(x,N){return N?Number(N):ge(x)?0:1}function ge(x){return Z.includes(x.toLowerCase())}const Se={},ze=x=>{console.error(x)},Ue=(x,...N)=>{console.log(`WARN: ${x}`,...N)},Qe=(x,N)=>{Se[`${x}/${N}`]||(console.log(`Deprecated as of ${x}. ${N}`),Se[`${x}/${N}`]=!0)},Ct=new Error;function Nn(x,N,{key:J}){let we=0;const We=x[J],Ze={},oe={};for(let ae=1;ae<=N.length;ae++)oe[ae+we]=We[ae],Ze[ae+we]=!0,we+=y(N[ae-1]);x[J]=oe,x[J]._emit=Ze,x[J]._multi=!0}function Mt(x){if(Array.isArray(x.begin)){if(x.skip||x.excludeBegin||x.returnBegin)throw ze("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),Ct;if(typeof x.beginScope!="object"||x.beginScope===null)throw ze("beginScope must be object"),Ct;Nn(x,x.begin,{key:"beginScope"}),x.begin=A(x.begin,{joinWith:""})}}function Fl(x){if(Array.isArray(x.end)){if(x.skip||x.excludeEnd||x.returnEnd)throw ze("skip, excludeEnd, returnEnd not compatible with endScope: {}"),Ct;if(typeof x.endScope!="object"||x.endScope===null)throw ze("endScope must be object"),Ct;Nn(x,x.end,{key:"endScope"}),x.end=A(x.end,{joinWith:""})}}function Dl(x){x.scope&&typeof x.scope=="object"&&x.scope!==null&&(x.beginScope=x.scope,delete x.scope)}function Ul(x){Dl(x),typeof x.beginScope=="string"&&(x.beginScope={_wrap:x.beginScope}),typeof x.endScope=="string"&&(x.endScope={_wrap:x.endScope}),Mt(x),Fl(x)}function Wl(x){function N(oe,ae){return new RegExp(d(oe),"m"+(x.case_insensitive?"i":"")+(x.unicodeRegex?"u":"")+(ae?"g":""))}class J{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(ae,me){me.position=this.position++,this.matchIndexes[this.matchAt]=me,this.regexes.push([me,ae]),this.matchAt+=y(ae)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const ae=this.regexes.map(me=>me[1]);this.matcherRe=N(A(ae,{joinWith:"|"}),!0),this.lastIndex=0}exec(ae){this.matcherRe.lastIndex=this.lastIndex;const me=this.matcherRe.exec(ae);if(!me)return null;const Ye=me.findIndex((Bn,ci)=>ci>0&&Bn!==void 0),Ge=this.matchIndexes[Ye];return me.splice(0,Ye),Object.assign(me,Ge)}}class we{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(ae){if(this.multiRegexes[ae])return this.multiRegexes[ae];const me=new J;return this.rules.slice(ae).forEach(([Ye,Ge])=>me.addRule(Ye,Ge)),me.compile(),this.multiRegexes[ae]=me,me}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(ae,me){this.rules.push([ae,me]),me.type==="begin"&&this.count++}exec(ae){const me=this.getMatcher(this.regexIndex);me.lastIndex=this.lastIndex;let Ye=me.exec(ae);if(this.resumingScanAtSamePosition()&&!(Ye&&Ye.index===this.lastIndex)){const Ge=this.getMatcher(0);Ge.lastIndex=this.lastIndex+1,Ye=Ge.exec(ae)}return Ye&&(this.regexIndex+=Ye.position+1,this.regexIndex===this.count&&this.considerAll()),Ye}}function We(oe){const ae=new we;return oe.contains.forEach(me=>ae.addRule(me.begin,{rule:me,type:"begin"})),oe.terminatorEnd&&ae.addRule(oe.terminatorEnd,{type:"end"}),oe.illegal&&ae.addRule(oe.illegal,{type:"illegal"}),ae}function Ze(oe,ae){const me=oe;if(oe.isCompiled)return me;[F,P,Ul,j].forEach(Ge=>Ge(oe,ae)),x.compilerExtensions.forEach(Ge=>Ge(oe,ae)),oe.__beforeBegin=null,[Y,B,z].forEach(Ge=>Ge(oe,ae)),oe.isCompiled=!0;let Ye=null;return typeof oe.keywords=="object"&&oe.keywords.$pattern&&(oe.keywords=Object.assign({},oe.keywords),Ye=oe.keywords.$pattern,delete oe.keywords.$pattern),Ye=Ye||/\w+/,oe.keywords&&(oe.keywords=pe(oe.keywords,x.case_insensitive)),me.keywordPatternRe=N(Ye,!0),ae&&(oe.begin||(oe.begin=/\B|\b/),me.beginRe=N(me.begin),!oe.end&&!oe.endsWithParent&&(oe.end=/\B|\b/),oe.end&&(me.endRe=N(me.end)),me.terminatorEnd=d(me.end)||"",oe.endsWithParent&&ae.terminatorEnd&&(me.terminatorEnd+=(oe.end?"|":"")+ae.terminatorEnd)),oe.illegal&&(me.illegalRe=N(oe.illegal)),oe.contains||(oe.contains=[]),oe.contains=[].concat(...oe.contains.map(function(Ge){return Zl(Ge==="self"?oe:Ge)})),oe.contains.forEach(function(Ge){Ze(Ge,me)}),oe.starts&&Ze(oe.starts,ae),me.matcher=We(me),me}if(x.compilerExtensions||(x.compilerExtensions=[]),x.contains&&x.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return x.classNameAliases=i(x.classNameAliases||{}),Ze(x)}function ja(x){return x?x.endsWithParent||ja(x.starts):!1}function Zl(x){return x.variants&&!x.cachedVariants&&(x.cachedVariants=x.variants.map(function(N){return i(x,{variants:null},N)})),x.cachedVariants?x.cachedVariants:ja(x)?i(x,{starts:x.starts?i(x.starts):null}):Object.isFrozen(x)?i(x):x}var Gl="11.11.1";class Xl extends Error{constructor(N,J){super(N),this.name="HTMLInjectionError",this.html=J}}const li=n,qa=i,Ha=Symbol("nomatch"),Ql=7,Fa=function(x){const N=Object.create(null),J=Object.create(null),we=[];let We=!0;const Ze="Could not find the language '{}', did you forget to load/include a language module?",oe={disableAutodetect:!0,name:"Plain text",contains:[]};let ae={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:u};function me(X){return ae.noHighlightRe.test(X)}function Ye(X){let ue=X.className+" ";ue+=X.parentNode?X.parentNode.className:"";const Me=ae.languageDetectRe.exec(ue);if(Me){const je=qt(Me[1]);return je||(Ue(Ze.replace("{}",Me[1])),Ue("Falling back to no-highlight mode for this block.",X)),je?Me[1]:"no-highlight"}return ue.split(/\s+/).find(je=>me(je)||qt(je))}function Ge(X,ue,Me){let je="",Ke="";typeof ue=="object"?(je=X,Me=ue.ignoreIllegals,Ke=ue.language):(Qe("10.7.0","highlight(lang, code, ...args) has been deprecated."),Qe("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),Ke=X,je=ue),Me===void 0&&(Me=!0);const wt={code:je,language:Ke};dr("before:highlight",wt);const Ht=wt.result?wt.result:Bn(wt.language,wt.code,Me);return Ht.code=wt.code,dr("after:highlight",Ht),Ht}function Bn(X,ue,Me,je){const Ke=Object.create(null);function wt(te,ce){return te.keywords[ce]}function Ht(){if(!_e.keywords){Je.addText(qe);return}let te=0;_e.keywordPatternRe.lastIndex=0;let ce=_e.keywordPatternRe.exec(qe),ve="";for(;ce;){ve+=qe.substring(te,ce.index);const Ne=At.case_insensitive?ce[0].toLowerCase():ce[0],at=wt(_e,Ne);if(at){const[Lt,dc]=at;if(Je.addText(ve),ve="",Ke[Ne]=(Ke[Ne]||0)+1,Ke[Ne]<=Ql&&(pr+=dc),Lt.startsWith("_"))ve+=ce[0];else{const fc=At.classNameAliases[Lt]||Lt;vt(ce[0],fc)}}else ve+=ce[0];te=_e.keywordPatternRe.lastIndex,ce=_e.keywordPatternRe.exec(qe)}ve+=qe.substring(te),Je.addText(ve)}function fr(){if(qe==="")return;let te=null;if(typeof _e.subLanguage=="string"){if(!N[_e.subLanguage]){Je.addText(qe);return}te=Bn(_e.subLanguage,qe,!0,Ka[_e.subLanguage]),Ka[_e.subLanguage]=te._top}else te=ui(qe,_e.subLanguage.length?_e.subLanguage:null);_e.relevance>0&&(pr+=te.relevance),Je.__addSublanguage(te._emitter,te.language)}function gt(){_e.subLanguage!=null?fr():Ht(),qe=""}function vt(te,ce){te!==""&&(Je.startScope(ce),Je.addText(te),Je.endScope())}function Za(te,ce){let ve=1;const Ne=ce.length-1;for(;ve<=Ne;){if(!te._emit[ve]){ve++;continue}const at=At.classNameAliases[te[ve]]||te[ve],Lt=ce[ve];at?vt(Lt,at):(qe=Lt,Ht(),qe=""),ve++}}function Ga(te,ce){return te.scope&&typeof te.scope=="string"&&Je.openNode(At.classNameAliases[te.scope]||te.scope),te.beginScope&&(te.beginScope._wrap?(vt(qe,At.classNameAliases[te.beginScope._wrap]||te.beginScope._wrap),qe=""):te.beginScope._multi&&(Za(te.beginScope,ce),qe="")),_e=Object.create(te,{parent:{value:_e}}),_e}function Xa(te,ce,ve){let Ne=_(te.endRe,ve);if(Ne){if(te["on:end"]){const at=new t(te);te["on:end"](ce,at),at.isMatchIgnored&&(Ne=!1)}if(Ne){for(;te.endsParent&&te.parent;)te=te.parent;return te}}if(te.endsWithParent)return Xa(te.parent,ce,ve)}function oc(te){return _e.matcher.regexIndex===0?(qe+=te[0],1):(gi=!0,0)}function lc(te){const ce=te[0],ve=te.rule,Ne=new t(ve),at=[ve.__beforeBegin,ve["on:begin"]];for(const Lt of at)if(Lt&&(Lt(te,Ne),Ne.isMatchIgnored))return oc(ce);return ve.skip?qe+=ce:(ve.excludeBegin&&(qe+=ce),gt(),!ve.returnBegin&&!ve.excludeBegin&&(qe=ce)),Ga(ve,te),ve.returnBegin?0:ce.length}function cc(te){const ce=te[0],ve=ue.substring(te.index),Ne=Xa(_e,te,ve);if(!Ne)return Ha;const at=_e;_e.endScope&&_e.endScope._wrap?(gt(),vt(ce,_e.endScope._wrap)):_e.endScope&&_e.endScope._multi?(gt(),Za(_e.endScope,te)):at.skip?qe+=ce:(at.returnEnd||at.excludeEnd||(qe+=ce),gt(),at.excludeEnd&&(qe=ce));do _e.scope&&Je.closeNode(),!_e.skip&&!_e.subLanguage&&(pr+=_e.relevance),_e=_e.parent;while(_e!==Ne.parent);return Ne.starts&&Ga(Ne.starts,te),at.returnEnd?0:ce.length}function uc(){const te=[];for(let ce=_e;ce!==At;ce=ce.parent)ce.scope&&te.unshift(ce.scope);te.forEach(ce=>Je.openNode(ce))}let gr={};function Qa(te,ce){const ve=ce&&ce[0];if(qe+=te,ve==null)return gt(),0;if(gr.type==="begin"&&ce.type==="end"&&gr.index===ce.index&&ve===""){if(qe+=ue.slice(ce.index,ce.index+1),!We){const Ne=new Error(`0 width match regex (${X})`);throw Ne.languageName=X,Ne.badRule=gr.rule,Ne}return 1}if(gr=ce,ce.type==="begin")return lc(ce);if(ce.type==="illegal"&&!Me){const Ne=new Error('Illegal lexeme "'+ve+'" for mode "'+(_e.scope||"<unnamed>")+'"');throw Ne.mode=_e,Ne}else if(ce.type==="end"){const Ne=cc(ce);if(Ne!==Ha)return Ne}if(ce.type==="illegal"&&ve==="")return qe+=`
`,1;if(fi>1e5&&fi>ce.index*3)throw new Error("potential infinite loop, way more iterations than matches");return qe+=ve,ve.length}const At=qt(X);if(!At)throw ze(Ze.replace("{}",X)),new Error('Unknown language: "'+X+'"');const hc=Wl(At);let di="",_e=je||hc;const Ka={},Je=new ae.__emitter(ae);uc();let qe="",pr=0,Jt=0,fi=0,gi=!1;try{if(At.__emitTokens)At.__emitTokens(ue,Je);else{for(_e.matcher.considerAll();;){fi++,gi?gi=!1:_e.matcher.considerAll(),_e.matcher.lastIndex=Jt;const te=_e.matcher.exec(ue);if(!te)break;const ce=ue.substring(Jt,te.index),ve=Qa(ce,te);Jt=te.index+ve}Qa(ue.substring(Jt))}return Je.finalize(),di=Je.toHTML(),{language:X,value:di,relevance:pr,illegal:!1,_emitter:Je,_top:_e}}catch(te){if(te.message&&te.message.includes("Illegal"))return{language:X,value:li(ue),illegal:!0,relevance:0,_illegalBy:{message:te.message,index:Jt,context:ue.slice(Jt-100,Jt+100),mode:te.mode,resultSoFar:di},_emitter:Je};if(We)return{language:X,value:li(ue),illegal:!1,relevance:0,errorRaised:te,_emitter:Je,_top:_e};throw te}}function ci(X){const ue={value:li(X),illegal:!1,relevance:0,_top:oe,_emitter:new ae.__emitter(ae)};return ue._emitter.addText(X),ue}function ui(X,ue){ue=ue||ae.languages||Object.keys(N);const Me=ci(X),je=ue.filter(qt).filter(Wa).map(gt=>Bn(gt,X,!1));je.unshift(Me);const Ke=je.sort((gt,vt)=>{if(gt.relevance!==vt.relevance)return vt.relevance-gt.relevance;if(gt.language&&vt.language){if(qt(gt.language).supersetOf===vt.language)return 1;if(qt(vt.language).supersetOf===gt.language)return-1}return 0}),[wt,Ht]=Ke,fr=wt;return fr.secondBest=Ht,fr}function Kl(X,ue,Me){const je=ue&&J[ue]||Me;X.classList.add("hljs"),X.classList.add(`language-${je}`)}function hi(X){let ue=null;const Me=Ye(X);if(me(Me))return;if(dr("before:highlightElement",{el:X,language:Me}),X.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",X);return}if(X.children.length>0&&(ae.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(X)),ae.throwUnescapedHTML))throw new Xl("One of your code blocks includes unescaped HTML.",X.innerHTML);ue=X;const je=ue.textContent,Ke=Me?Ge(je,{language:Me,ignoreIllegals:!0}):ui(je);X.innerHTML=Ke.value,X.dataset.highlighted="yes",Kl(X,Me,Ke.language),X.result={language:Ke.language,re:Ke.relevance,relevance:Ke.relevance},Ke.secondBest&&(X.secondBest={language:Ke.secondBest.language,relevance:Ke.secondBest.relevance}),dr("after:highlightElement",{el:X,result:Ke,text:je})}function Vl(X){ae=qa(ae,X)}const Yl=()=>{hr(),Qe("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function Jl(){hr(),Qe("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let Da=!1;function hr(){function X(){hr()}if(document.readyState==="loading"){Da||window.addEventListener("DOMContentLoaded",X,!1),Da=!0;return}document.querySelectorAll(ae.cssSelector).forEach(hi)}function ec(X,ue){let Me=null;try{Me=ue(x)}catch(je){if(ze("Language definition for '{}' could not be registered.".replace("{}",X)),We)ze(je);else throw je;Me=oe}Me.name||(Me.name=X),N[X]=Me,Me.rawDefinition=ue.bind(null,x),Me.aliases&&Ua(Me.aliases,{languageName:X})}function tc(X){delete N[X];for(const ue of Object.keys(J))J[ue]===X&&delete J[ue]}function nc(){return Object.keys(N)}function qt(X){return X=(X||"").toLowerCase(),N[X]||N[J[X]]}function Ua(X,{languageName:ue}){typeof X=="string"&&(X=[X]),X.forEach(Me=>{J[Me.toLowerCase()]=ue})}function Wa(X){const ue=qt(X);return ue&&!ue.disableAutodetect}function rc(X){X["before:highlightBlock"]&&!X["before:highlightElement"]&&(X["before:highlightElement"]=ue=>{X["before:highlightBlock"](Object.assign({block:ue.el},ue))}),X["after:highlightBlock"]&&!X["after:highlightElement"]&&(X["after:highlightElement"]=ue=>{X["after:highlightBlock"](Object.assign({block:ue.el},ue))})}function ic(X){rc(X),we.push(X)}function ac(X){const ue=we.indexOf(X);ue!==-1&&we.splice(ue,1)}function dr(X,ue){const Me=X;we.forEach(function(je){je[Me]&&je[Me](ue)})}function sc(X){return Qe("10.7.0","highlightBlock will be removed entirely in v12.0"),Qe("10.7.0","Please use highlightElement now."),hi(X)}Object.assign(x,{highlight:Ge,highlightAuto:ui,highlightAll:hr,highlightElement:hi,highlightBlock:sc,configure:Vl,initHighlighting:Yl,initHighlightingOnLoad:Jl,registerLanguage:ec,unregisterLanguage:tc,listLanguages:nc,getLanguage:qt,registerAliases:Ua,autoDetection:Wa,inherit:qa,addPlugin:ic,removePlugin:ac}),x.debugMode=function(){We=!1},x.safeMode=function(){We=!0},x.versionString=Gl,x.regex={concat:m,lookahead:h,either:b,optional:p,anyNumberOfTimes:f};for(const X in v)typeof v[X]=="object"&&e(v[X]);return Object.assign(x,v),x},cn=Fa({});return cn.newInstance=()=>Fa({}),br=cn,cn.HighlightJS=cn,cn.default=cn,br}var ns=ts();const Te=ki(ns);class qn{constructor(t={}){const{maxSize:n=0,ttlMs:i=0,onEvict:r=null}=t||{};this._map=new Map,this._maxSize=Math.max(0,Number(n)||0),this._ttlMs=Math.max(0,Number(i)||0),this._onEvict=typeof r=="function"?r:null}get size(){return this._map.size}has(t){const n=this._map.get(t);return n?this._ttlMs&&Date.now()-(n.ts||0)>=this._ttlMs?(this._evictKey(t,n),!1):(this._map.delete(t),this._map.set(t,n),!0):!1}get(t){const n=this._map.get(t);if(n){if(this._ttlMs&&Date.now()-(n.ts||0)>=this._ttlMs){this._evictKey(t,n);return}return this._map.delete(t),this._map.set(t,n),n.value}}set(t,n){if(this._map.has(t)&&this._map.delete(t),this._map.set(t,{value:n,ts:Date.now()}),this._maxSize&&this._map.size>this._maxSize)for(;this._map.size>this._maxSize;){const i=this._map.keys().next().value,r=this._map.get(i);if(this._map.delete(i),this._onEvict)try{this._onEvict(i,r&&r.value)}catch{}}return this}delete(t){return this._map.delete(t)}clear(){if(this._onEvict)for(const[t,n]of this._map.entries())try{this._onEvict(t,n&&n.value)}catch{}this._map.clear()}_evictKey(t,n){try{this._map.delete(t)}catch{}if(this._onEvict)try{this._onEvict(t,n&&n.value)}catch{}}}const wr=new qn({maxSize:500});let rs=300*1e3;async function _r(e,t){try{if(!e)return null;const n=Date.now();let i=wr.get(e);if(i&&i.ok===!1&&n-(i.ts||0)>=rs&&(wr.delete(e),i=void 0),i){if(i.module)return i.module;if(i.promise)try{return await i.promise}catch{return null}}const r={promise:null,module:null,ok:null,ts:Date.now()};wr.set(e,r),r.promise=(async()=>{try{return await t()}catch{return null}})();try{const a=await r.promise;return r.module=a,r.ok=!!a,r.ts=Date.now(),a}catch{return r.module=null,r.ok=!1,r.ts=Date.now(),null}}catch{return null}}async function is(e){return await _r(e,async()=>{try{return await import(e)}catch{return null}})}const as="11.11.1",Ae=new Map,ss="https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md",ct={shell:"bash",sh:"bash",zsh:"bash",js:"javascript",ts:"typescript",py:"python",csharp:"cs","c#":"cs"};ct.html="xml",ct.xhtml="xml",ct.markup="xml";const kr=new Set(["magic","undefined"]);let zt=null,os=null;async function xr(e=ss){if(e)return zt||(zt=(async()=>{try{const t=await fetch(e);if(!t.ok)return;const i=(await t.text()).split(/\r?\n/);let r=-1;for(let c=0;c<i.length;c++)if(/\|\s*Language\s*\|/i.test(i[c])){r=c;break}if(r===-1)return;const a=i[r].replace(/^\||\|$/g,"").split("|").map(c=>c.trim().toLowerCase());let s=a.findIndex(c=>/alias|aliases|equivalent|alt|alternates?/i.test(c));s===-1&&(s=1);let o=a.findIndex(c=>/file|filename|module|module name|module-name|short|slug/i.test(c));if(o===-1){const c=a.findIndex(u=>/language/i.test(u));o=c!==-1?c:0}let l=[];for(let c=r+1;c<i.length;c++){const u=i[c].trim();if(!u||!u.startsWith("|"))break;const d=u.replace(/^\||\|$/g,"").split("|").map(g=>g.trim());if(d.every(g=>/^-+$/.test(g)))continue;const h=d;if(!h.length)continue;const p=(h[o]||h[0]||"").toString().trim().toLowerCase();if(!p||/^-+$/.test(p))continue;Ae.set(p,p);const m=h[s]||"";if(m){const g=String(m).split(",").map(b=>b.replace(/`/g,"").trim()).filter(Boolean);if(g.length){const y=g[0].toLowerCase().replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");y&&/[a-z0-9]/i.test(y)&&(Ae.set(y,y),l.push(y))}}}try{const c=[];for(const u of l){const d=String(u||"").replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");d&&/[a-z0-9]/i.test(d)?c.push(d):Ae.delete(u)}l=c}catch(c){k("[codeblocksManager] cleanup aliases failed",c)}try{let c=0;for(const u of Array.from(Ae.keys())){if(!u||/^-+$/.test(u)||!/[a-z0-9]/i.test(u)){Ae.delete(u),c++;continue}if(/^[:]+/.test(u)){const d=u.replace(/^[:]+/,"");if(d&&/[a-z0-9]/i.test(d)){const h=Ae.get(u);Ae.delete(u),Ae.set(d,h)}else Ae.delete(u),c++}}for(const[u,d]of Array.from(Ae.entries()))(!d||/^-+$/.test(d)||!/[a-z0-9]/i.test(d))&&(Ae.delete(u),c++);try{const u=":---------------------";Ae.has(u)&&(Ae.delete(u),c++)}catch(u){k("[codeblocksManager] remove sep key failed",u)}try{const u=Array.from(Ae.keys()).sort()}catch(u){k("[codeblocksManager] compute supported keys failed",u)}}catch(c){k("[codeblocksManager] ignored error",c)}}catch(t){k("[codeblocksManager] loadSupportedLanguages failed",t)}})(),zt)}const hn=new Set;async function en(e,t){if(zt||(async()=>{try{await xr()}catch(r){k("[codeblocksManager] loadSupportedLanguages (IIFE) failed",r)}})(),zt)try{await zt}catch{}if(e=e==null?"":String(e),e=e.trim(),!e)return!1;const n=e.toLowerCase();if(kr.has(n))return!1;if(Ae.size&&!Ae.has(n)){const r=ct;if(!r[n]&&!r[e])return!1}if(hn.has(e))return!0;const i=ct;try{const r=(t||e||"").toString().replace(/\.js$/i,"").trim(),a=(i[e]||e||"").toString(),s=(i[r]||r||"").toString();let o=Array.from(new Set([a,s,r,e,i[r],i[e]].filter(Boolean))).map(u=>String(u).toLowerCase()).filter(u=>u&&u!=="undefined");Ae.size&&(o=o.filter(u=>{if(Ae.has(u))return!0;const d=ct[u];return!!(d&&Ae.has(d))}));let l=null,c=null;for(const u of o)try{if(l=await _r(u,async()=>{try{try{try{return await import(`highlight.js/lib/languages/${u}.js`)}catch{return await import(`highlight.js/lib/languages/${u}`)}}catch{try{return await import(`https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${u}.js`)}catch{try{return await import(`https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${u}.js`)}catch{return null}}}}catch{return null}}),l){const d=l.default||l;try{const h=Ae.size&&Ae.get(e)||u||e;return Te.registerLanguage(h,d),hn.add(h),h!==e&&(Te.registerLanguage(e,d),hn.add(e)),!0}catch(h){c=h}}else try{if(Ae.has(u)||Ae.has(e)){const d=()=>({});try{Te.registerLanguage(u,d),hn.add(u)}catch{}try{u!==e&&(Te.registerLanguage(e,d),hn.add(e))}catch{}return!0}}catch{}}catch(d){c=d}if(c)throw c;return!1}catch{return!1}}let Hn=null;function Si(e){const t=e&&e.querySelector?e:typeof document<"u"?document:null;zt||(async()=>{try{await xr()}catch(s){k("[codeblocksManager] loadSupportedLanguages (observer) failed",s)}})();const n=ct,r=Hn||(typeof IntersectionObserver>"u"?null:(Hn=new IntersectionObserver((s,o)=>{s.forEach(l=>{if(!l.isIntersecting)return;const c=l.target;try{o.unobserve(c)}catch(u){k("[codeblocksManager] observer unobserve failed",u)}(async()=>{try{const u=c.getAttribute&&c.getAttribute("class")||c.className||"",d=u.match(/language-([a-zA-Z0-9_+-]+)/)||u.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(d&&d[1]){const h=(d[1]||"").toLowerCase(),f=n[h]||h,p=Ae.size&&(Ae.get(f)||Ae.get(String(f).toLowerCase()))||f;try{await en(p)}catch(m){k("[codeblocksManager] registerLanguage failed",m)}try{try{const m=c.textContent||c.innerText||"";m!=null&&(c.textContent=m)}catch{}try{c&&c.dataset&&c.dataset.highlighted&&delete c.dataset.highlighted}catch{}Te.highlightElement(c)}catch(m){k("[codeblocksManager] hljs.highlightElement failed",m)}}else try{const h=c.textContent||"";try{if(Te&&typeof Te.getLanguage=="function"&&Te.getLanguage("plaintext")){const f=Te.highlight(h,{language:"plaintext"});if(f&&f.value)try{if(typeof document<"u"&&document.createRange&&typeof document.createRange=="function"){const p=document.createRange().createContextualFragment(f.value);if(typeof c.replaceChildren=="function")c.replaceChildren(...Array.from(p.childNodes));else{for(;c.firstChild;)c.removeChild(c.firstChild);c.appendChild(p)}}else c.innerHTML=f.value}catch{try{c.innerHTML=f.value}catch{}}}}catch{try{Te.highlightElement(c)}catch(p){k("[codeblocksManager] fallback highlightElement failed",p)}}}catch(h){k("[codeblocksManager] auto-detect plaintext failed",h)}}catch(u){k("[codeblocksManager] observer entry processing failed",u)}})()})},{root:null,rootMargin:"300px",threshold:.1}),Hn)),a=t&&t.querySelectorAll?t.querySelectorAll("pre code"):[];if(!r){a.forEach(async s=>{try{const o=s.getAttribute&&s.getAttribute("class")||s.className||"",l=o.match(/language-([a-zA-Z0-9_+-]+)/)||o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(l&&l[1]){const c=(l[1]||"").toLowerCase(),u=n[c]||c,d=Ae.size&&(Ae.get(u)||Ae.get(String(u).toLowerCase()))||u;try{await en(d)}catch(h){k("[codeblocksManager] registerLanguage failed (no observer)",h)}}try{try{const c=s.textContent||s.innerText||"";c!=null&&(s.textContent=c)}catch{}try{s&&s.dataset&&s.dataset.highlighted&&delete s.dataset.highlighted}catch{}Te.highlightElement(s)}catch(c){k("[codeblocksManager] hljs.highlightElement failed (no observer)",c)}}catch(o){k("[codeblocksManager] loadSupportedLanguages fallback ignored error",o)}});return}a.forEach(s=>{try{r.observe(s)}catch(o){k("[codeblocksManager] observe failed",o)}})}function ls(e,{useCdn:t=!0}={}){const n=typeof document<"u"&&document.head&&document.head.querySelector?document.head.querySelector("link[data-hl-theme]"):typeof document<"u"?document.querySelector("link[data-hl-theme]"):null,i=n&&n.getAttribute?n.getAttribute("data-hl-theme"):null,r=e==null?"default":String(e),a=r&&String(r).toLowerCase()||"";if(a==="default"||a==="monokai"){try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}return}if(i&&i.toLowerCase()===a)return;if(!t){try{k("Requested highlight theme not bundled; set useCdn=true to load theme from CDN")}catch{}return}const s=a,o=`https://cdn.jsdelivr.net/npm/highlight.js@${as}/styles/${s}.css`,l=document.createElement("link");l.rel="stylesheet",l.href=o,l.setAttribute("data-hl-theme",s),l.addEventListener("load",()=>{try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}}),document.head.appendChild(l)}let Ut="light";function cs(e,t={}){if(document.querySelector(`link[href="${e}"]`))return;const n=document.createElement("link");if(n.rel="stylesheet",n.href=e,Object.entries(t).forEach(([i,r])=>n.setAttribute(i,r)),document.head.appendChild(n),t["data-bulmaswatch-theme"])try{if(n.getAttribute("data-bulmaswatch-observer"))return;let i=Number(n.getAttribute("data-bulmaswatch-move-count")||0),r=!1;const a=new MutationObserver(()=>{try{if(r)return;const o=n.parentNode;if(!o||o.lastElementChild===n)return;if(i>=1e3){n.setAttribute("data-bulmaswatch-move-stopped","1");return}r=!0;try{o.appendChild(n)}catch{}i+=1,n.setAttribute("data-bulmaswatch-move-count",String(i)),r=!1}catch{}});try{a.observe(document.head,{childList:!0}),n.setAttribute("data-bulmaswatch-observer","1"),n.setAttribute("data-bulmaswatch-move-count",String(i))}catch{}const s=document.head;s&&s.lastElementChild!==n&&s.appendChild(n)}catch{}}function Sr(){try{const e=typeof document<"u"&&document.head?document.head:document,t=Array.from(e.querySelectorAll("link[data-bulmaswatch-theme]"));for(const n of t)n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}try{const e=typeof document<"u"&&document.head?document.head:document,t=Array.from(e.querySelectorAll("style[data-bulma-override]"));for(const n of t)n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}}async function vi(e="none",t="/"){try{Rt("[bulmaManager] ensureBulma called",{bulmaCustomize:e,pageDir:t})}catch{}if(!e)return;if(e==="none"){try{Sr()}catch{}return}const n=[t+"bulma.css","/bulma.css"],i=Array.from(new Set(n));if(e==="local"){if(Sr(),document.querySelector("style[data-bulma-override]"))return;for(const r of i)try{const a=await fetch(r,{method:"GET"});if(a.ok){const s=await a.text(),o=document.createElement("style");o.setAttribute("data-bulma-override",r),o.appendChild(document.createTextNode(`
/* bulma override: ${r} */
`+s)),document.head.appendChild(o);return}}catch(a){k("[bulmaManager] fetch local bulma candidate failed",a)}return}try{const r=String(e).trim();if(!r)return;Sr();const a=`https://unpkg.com/bulmaswatch/${encodeURIComponent(r)}/bulmaswatch.min.css`;cs(a,{"data-bulmaswatch-theme":r})}catch(r){k("[bulmaManager] ensureBulma failed",r)}}function Ai(e){Ut=e==="dark"?"dark":e==="system"?"system":"light";try{const t=Array.from(document.querySelectorAll(".nimbi-mount"));if(t.length>0)for(const n of t)Ut==="dark"?n.setAttribute("data-theme","dark"):Ut==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme");else{const n=document.documentElement;Ut==="dark"?n.setAttribute("data-theme","dark"):Ut==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme")}}catch{}}function us(e){const t=document.documentElement;for(const[n,i]of Object.entries(e||{}))try{t.style.setProperty(`--${n}`,i)}catch(r){k("[bulmaManager] setThemeVars failed for",n,r)}}function Ei(e){if(!e||!(e instanceof HTMLElement))return()=>{};const t=e.closest&&e.closest(".nimbi-mount")||null;try{t&&(Ut==="dark"?t.setAttribute("data-theme","dark"):Ut==="light"?t.setAttribute("data-theme","light"):t.removeAttribute("data-theme"))}catch{}return()=>{}}const Ci={en:{navigation:"Navigation",onThisPage:"On this page",home:"Home",scrollToTop:"Scroll to top",readingTime:"{minutes} min read",searchPlaceholder:"Search…",imagePreviewTitle:"Image preview",imagePreviewFit:"Fit to screen",imagePreviewOriginal:"Original size",imagePreviewZoomOut:"Zoom out",imagePreviewZoomIn:"Zoom in",imagePreviewClose:"Close"},es:{navigation:"Navegación",onThisPage:"En esta página",home:"Inicio",scrollToTop:"Ir arriba",readingTime:"{minutes} min de lectura",searchPlaceholder:"Buscar…",imagePreviewTitle:"Previsualización de imagen",imagePreviewFit:"Ajustar a la pantalla",imagePreviewOriginal:"Tamaño original",imagePreviewZoomOut:"Alejar",imagePreviewZoomIn:"Acercar",imagePreviewClose:"Cerrar"},de:{navigation:"Navigation",onThisPage:"Auf dieser Seite",home:"Startseite",scrollToTop:"Nach oben",readingTime:"{minutes} min Lesezeit",searchPlaceholder:"Suchen…",imagePreviewTitle:"Bildvorschau",imagePreviewFit:"An Bildschirm anpassen",imagePreviewOriginal:"Originalgröße",imagePreviewZoomOut:"Verkleinern",imagePreviewZoomIn:"Vergrößern",imagePreviewClose:"Schließen"},fr:{navigation:"Navigation",onThisPage:"Sur cette page",home:"Accueil",scrollToTop:"Aller en haut",readingTime:"{minutes} min de lecture",searchPlaceholder:"Rechercher…",imagePreviewTitle:"Aperçu de l’image",imagePreviewFit:"Ajuster à l’écran",imagePreviewOriginal:"Taille originale",imagePreviewZoomOut:"Dézoomer",imagePreviewZoomIn:"Zoomer",imagePreviewClose:"Fermer"},pt:{navigation:"Navegação",onThisPage:"Nesta página",home:"Início",scrollToTop:"Ir para o topo",readingTime:"{minutes} min de leitura",searchPlaceholder:"Procurar…",imagePreviewTitle:"Visualização da imagem",imagePreviewFit:"Ajustar à tela",imagePreviewOriginal:"Tamanho original",imagePreviewZoomOut:"Diminuir",imagePreviewZoomIn:"Aumentar",imagePreviewClose:"Fechar"}},tn=JSON.parse(JSON.stringify(Ci));let Fn="en";if(typeof navigator<"u"){const e=navigator.language||navigator.languages&&navigator.languages[0]||"en";Fn=String(e).split("-")[0].toLowerCase()}Ci[Fn]||(Fn="en");let Pt=Fn;function nn(e,t={}){const n=tn[Pt]||tn.en;let i=n&&n[e]?n[e]:tn.en[e]||"";for(const r of Object.keys(t))i=i.replace(new RegExp(`{${r}}`,"g"),String(t[r]));return i}async function vr(e,t){if(!e)return;let n=e;try{/^https?:\/\//.test(e)||(n=new URL(e,location.origin+t).toString());const i=await fetch(n);if(!i.ok)return;const r=await i.json();for(const a of Object.keys(r||{}))tn[a]=Object.assign({},tn[a]||{},r[a])}catch{}}function Ar(e){const t=String(e).split("-")[0].toLowerCase();Pt=tn[t]?t:"en"}const hs=Object.freeze(Object.defineProperty({__proto__:null,get currentLang(){return Pt},loadL10nFile:vr,setLang:Ar,t:nn},Symbol.toStringTag,{value:"Module"}));function ds(e){try{return String(e||"").split("/").map(t=>encodeURIComponent(t)).join("/")}catch{return String(e||"")}}function Mi(e,t=null,n=void 0){let r="#/"+ds(String(e||""));t&&(r+="#"+encodeURIComponent(String(t)));try{let a="";if(typeof n=="string")a=n;else if(typeof location<"u"&&location&&location.search)a=location.search;else if(typeof location<"u"&&location&&location.hash)try{const s=et(location.href);s&&s.params&&(a=s.params)}catch{}if(a){const s=typeof a=="string"&&a.startsWith("?")?a.slice(1):a;try{const o=new URLSearchParams(s);o.delete("page");const l=o.toString();l&&(r+="?"+l)}catch{const l=String(s||"").replace(/^page=[^&]*&?/,"");l&&(r+="?"+l)}}}catch{}return r}function et(e){try{const t=new URL(e,typeof location<"u"?location.href:"http://localhost/"),n=t.searchParams.get("page");if(n){let r=null,a="";if(t.hash){const c=t.hash.replace(/^#/,"");if(c.includes("&")){const u=c.split("&");r=u.shift()||null,a=u.join("&")}else r=c||null}const s=new URLSearchParams(t.search);s.delete("page");const l=[s.toString(),a].filter(Boolean).join("&");return{type:"canonical",page:decodeURIComponent(n),anchor:r,params:l}}const i=t.hash?decodeURIComponent(t.hash.replace(/^#/,"")):"";if(i&&i.startsWith("/")){let r=i,a="";if(r.indexOf("?")!==-1){const c=r.split("?");r=c.shift()||"",a=c.join("?")||""}let s=r,o=null;if(s.indexOf("#")!==-1){const c=s.split("#");s=c.shift()||"",o=c.join("#")||null}return{type:"cosmetic",page:s.replace(/^\/+/,"")||null,anchor:o,params:a}}return{type:"path",page:(t.pathname||"").replace(/^\//,"")||null,anchor:t.hash?t.hash.replace(/^#/,""):null,params:t.search?t.search.replace(/^\?/,""):""}}catch{return{type:"unknown",page:e,anchor:null,params:""}}}let Dn=typeof DOMParser<"u"?new DOMParser:null;function He(){return Dn||(typeof DOMParser<"u"?(Dn=new DOMParser,Dn):null)}async function dn(e,t,n=4){if(!Array.isArray(e)||e.length===0)return[];const i=new Array(e.length);let r=0;const a=[],s=Math.max(1,Number(n)||1);async function o(){for(;;){const l=r++;if(l>=e.length)return;try{i[l]=await t(e[l],l)}catch{i[l]=void 0}}}for(let l=0;l<Math.min(s,e.length);l++)a.push(o());return await Promise.all(a),i}const fs=`/**
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
`;function gs(e,t="worker"){let n=null;function i(...l){try{k(...l)}catch{}}function r(){if(!n)try{const l=e();n=l||null,l&&l.addEventListener("error",()=>{try{n===l&&(n=null,l.terminate&&l.terminate())}catch(c){i("["+t+"] worker termination failed",c)}})}catch(l){n=null,i("["+t+"] worker init failed",l)}return n}function a(){try{n&&(n.terminate&&n.terminate(),n=null)}catch(l){i("["+t+"] worker termination failed",l)}}function s(l,c=1e4){return new Promise((u,d)=>{const h=r();if(!h)return d(new Error("worker unavailable"));const f=String(Math.random()),p=Object.assign({},l,{id:f});let m=null;const g=()=>{m&&clearTimeout(m),h.removeEventListener("message",b),h.removeEventListener("error",y)},b=_=>{const w=_.data||{};w.id===f&&(g(),w.error?d(new Error(w.error)):u(w.result))},y=_=>{g(),i("["+t+"] worker error event",_);try{n===h&&(n=null,h.terminate&&h.terminate())}catch(w){i("["+t+"] worker termination failed",w)}d(new Error(_&&_.message||"worker error"))};m=setTimeout(()=>{g(),i("["+t+"] worker timed out");try{n===h&&(n=null,h.terminate&&h.terminate())}catch(_){i("["+t+"] worker termination on timeout failed",_)}d(new Error("worker timeout"))},c),h.addEventListener("message",b),h.addEventListener("error",y);try{h.postMessage(p)}catch(_){g(),d(_)}})}return{get:r,send:s,terminate:a}}function Li(e,t="worker-pool",n=2){const i=new Array(n).fill(null);let r=0;function a(...p){try{k(...p)}catch{}}function s(p){if(!i[p])try{const m=e();i[p]=m||null,m&&m.addEventListener("error",()=>{try{i[p]===m&&(i[p]=null,m.terminate&&m.terminate())}catch(g){a("["+t+"] worker termination failed",g)}})}catch(m){i[p]=null,a("["+t+"] worker init failed",m)}return i[p]}const o=new Array(n).fill(0),l=new Array(n).fill(null),c=30*1e3;function u(p){try{o[p]=Date.now(),l[p]&&(clearTimeout(l[p]),l[p]=null),l[p]=setTimeout(()=>{try{i[p]&&(i[p].terminate&&i[p].terminate(),i[p]=null)}catch(m){a("["+t+"] idle termination failed",m)}l[p]=null},c)}catch{}}function d(){for(let p=0;p<i.length;p++){const m=s(p);if(m)return m}return null}function h(){for(let p=0;p<i.length;p++)try{i[p]&&(i[p].terminate&&i[p].terminate(),i[p]=null)}catch(m){a("["+t+"] worker termination failed",m)}}function f(p,m=1e4){return new Promise((g,b)=>{const y=r++%i.length,_=w=>{const A=(y+w)%i.length,S=s(A);if(!S)return w+1<i.length?_(w+1):b(new Error("worker pool unavailable"));const M=String(Math.random()),I=Object.assign({},p,{id:M});let q=null;const Q=()=>{q&&clearTimeout(q),S.removeEventListener("message",R),S.removeEventListener("error",O)},R=G=>{const re=G.data||{};re.id===M&&(Q(),re.error?b(new Error(re.error)):g(re.result))},O=G=>{Q(),a("["+t+"] worker error event",G);try{i[A]===S&&(i[A]=null,S.terminate&&S.terminate())}catch(re){a("["+t+"] worker termination failed",re)}b(new Error(G&&G.message||"worker error"))};q=setTimeout(()=>{Q(),a("["+t+"] worker timed out");try{i[A]===S&&(i[A]=null,S.terminate&&S.terminate())}catch(G){a("["+t+"] worker termination on timeout failed",G)}b(new Error("worker timeout"))},m),S.addEventListener("message",R),S.addEventListener("error",O);try{u(A),S.postMessage(I)}catch(G){Q(),b(G)}};_(0)})}return{get:d,send:f,terminate:h}}function ps(e,t,n="worker"){return gs(()=>{try{const a=Wt(e);if(a)try{if(!(typeof process<"u"&&process.env&&process.env.VITEST))return a}catch{return a}}catch{}if(typeof t!="function")return null;const r={message:[],error:[]};return{addEventListener(a,s){r[a]||(r[a]=[]),r[a].push(s)},removeEventListener(a,s){if(!r[a])return;const o=r[a].indexOf(s);o!==-1&&r[a].splice(o,1)},postMessage(a){setTimeout(async()=>{try{const o={data:await t(a)};(r.message||[]).forEach(l=>l(o))}catch(s){const o={data:{id:a&&a.id,error:String(s)}};(r.message||[]).forEach(l=>l(o))}},0)},terminate(){Object.keys(r).forEach(a=>r[a].length=0)}}},n)}function Wt(e){try{if(typeof Blob<"u"&&typeof URL<"u"&&e)try{Wt._blobUrlCache||(Wt._blobUrlCache=new qn({maxSize:200,onEvict:(i,r)=>{try{typeof URL<"u"&&r&&URL.revokeObjectURL(r)}catch{}}}));const t=Wt._blobUrlCache;let n=t.get(e);if(!n){const i=new Blob([e],{type:"application/javascript"});n=URL.createObjectURL(i),t.set(e,n)}return new Worker(n,{type:"module"})}catch(t){try{k("[worker-manager] createWorkerFromRaw failed",t)}catch{}}}catch(t){try{k("[worker-manager] createWorkerFromRaw failed",t)}catch{}}return null}function ms(){return typeof requestIdleCallback=="function"?new Promise(e=>{try{requestIdleCallback(e,{timeout:50})}catch{setTimeout(e,0)}}):new Promise(e=>setTimeout(e,0))}async function $t(e,t=50){try{if(!e||!t)return;e%t===0&&await ms()}catch{}}const tt=new Set;function Zt(e){if(ys(),tt.clear(),Array.isArray(Ie)&&Ie.length)for(const t of Ie)t&&tt.add(t);else for(const t of Re)t&&tt.add(t);Ti(K),Ti(U),Zt._refreshed=!0}function Ti(e){if(!(!e||typeof e.values!="function"))for(const t of e.values())t&&tt.add(t)}function Ri(e){if(!e||typeof e.set!="function")return;const t=e.set;e.set=function(n,i){return i&&tt.add(i),t.call(this,n,i)}}let zi=!1;function ys(){zi||(Ri(K),Ri(U),zi=!0)}const Er=Object.freeze(Object.defineProperty({__proto__:null,indexSet:tt,refreshIndexPaths:Zt},Symbol.toStringTag,{value:"Module"}));function rn(e,t=1e3){const n=new Map;function i(r){const a=r===void 0?"__undefined":String(r);if(n.has(a)){const o=n.get(a);return n.delete(a),n.set(a,o),o}const s=e(r);try{if(n.set(a,s),n.size>t){const o=n.keys().next().value;n.delete(o)}}catch{}return s}return i._cache=n,i._reset=()=>n.clear(),i}function Cr(e){return!e||typeof e!="string"?!1:/^(https?:)?\/\//.test(e)||e.startsWith("mailto:")||e.startsWith("tel:")}const V=rn(function(e){return String(e||"").replace(/^[.\/]+/,"")},2e3),an=rn(function(e){return String(e||"").replace(/\/+$/,"")},2e3),Gt=rn(function(e){return an(String(e||""))+"/"},2e3);function bs(e){try{if(!e||typeof document>"u"||!document.head||e.startsWith("data:")||document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`))return;const n=document.createElement("link");n.rel="preload",n.as="image",n.href=e,document.head.appendChild(n)}catch(t){k("[helpers] preloadImage failed",t)}}function Un(e,t=0,n=!1){try{if(typeof window>"u"||!e||!e.querySelectorAll)return;const i=Array.from(e.querySelectorAll("img"));if(!i.length)return;const r=e,a=r&&r.getBoundingClientRect?r.getBoundingClientRect():null,s=0,o=typeof window<"u"&&(window.innerHeight||document.documentElement.clientHeight)||0,l=a?Math.max(s,a.top):s,u=(a?Math.min(o,a.bottom):o)+Number(t||0);let d=0;r&&(d=r.clientHeight||(a?a.height:0)),d||(d=o-s);let h=.6;try{const g=r&&window.getComputedStyle?window.getComputedStyle(r):null,b=g&&g.getPropertyValue("--nimbi-image-max-height-ratio"),y=b?parseFloat(b):NaN;!Number.isNaN(y)&&y>0&&y<=1&&(h=y)}catch(g){k("[helpers] read CSS ratio failed",g)}const f=Math.max(200,Math.floor(d*h));let p=!1,m=null;if(i.forEach(g=>{try{const b=g.getAttribute?g.getAttribute("loading"):void 0;b!=="eager"&&g.setAttribute&&g.setAttribute("loading","lazy");const y=g.getBoundingClientRect?g.getBoundingClientRect():null,_=g.src||g.getAttribute&&g.getAttribute("src"),w=y&&y.height>1?y.height:f,A=y?y.top:0,S=A+w;y&&w>0&&A<=u&&S>=l&&(g.setAttribute?(g.setAttribute("loading","eager"),g.setAttribute("fetchpriority","high"),g.setAttribute("data-eager-by-nimbi","1")):(g.loading="eager",g.fetchPriority="high"),bs(_),p=!0),!m&&y&&y.top<=u&&(m={img:g,src:_,rect:y,beforeLoading:b})}catch(b){k("[helpers] setEagerForAboveFoldImages per-image failed",b)}}),!p&&m){const{img:g,src:b,rect:y,beforeLoading:_}=m;try{g.setAttribute?(g.setAttribute("loading","eager"),g.setAttribute("fetchpriority","high"),g.setAttribute("data-eager-by-nimbi","1")):(g.loading="eager",g.fetchPriority="high")}catch(w){k("[helpers] setEagerForAboveFoldImages fallback failed",w)}}}catch(i){k("[helpers] setEagerForAboveFoldImages failed",i)}}function Pe(e,t=null,n){try{const i=typeof n=="string"?n:typeof window<"u"&&window.location?window.location.search:"",r=new URLSearchParams(i.startsWith("?")?i.slice(1):i),a=String(e||"");r.delete("page");const s=new URLSearchParams;s.set("page",a);for(const[c,u]of r.entries())s.append(c,u);const o=s.toString();let l=o?`?${o}`:"";return t&&(l+=`#${encodeURIComponent(t)}`),l||`?page=${encodeURIComponent(a)}`}catch{const r=`?page=${encodeURIComponent(String(e||""))}`;return t?`${r}#${encodeURIComponent(t)}`:r}}rn(function(e){try{const t=String(e||"");return t.includes("%")?t:encodeURI(t)}catch(t){return k("[helpers] encodeURL failed",t),String(e||"")}},2e3);function Wn(e){try{const t=e();return t&&typeof t.then=="function"?t.catch(n=>{k("[helpers] safe swallowed error",n)}):t}catch(t){k("[helpers] safe swallowed error",t)}}try{typeof globalThis<"u"&&!globalThis.safe&&(globalThis.safe=Wn)}catch(e){k("[helpers] global attach failed",e)}const ws=rn(function(e){try{if(!e&&e!==0)return"";const t=String(e),n={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:" "};return t.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g,(i,r)=>{if(!r)return i;if(r[0]==="#")try{return r[1]==="x"||r[1]==="X"?String.fromCharCode(parseInt(r.slice(2),16)):String.fromCharCode(parseInt(r.slice(1),10))}catch{return i}return n[r]!==void 0?n[r]:i})}catch{return String(e||"")}},2e3),K=new Map;let st=[],Mr=!1;function _s(e){Mr=!!e}function Pi(e){st=Array.isArray(e)?e.slice():[]}function ks(){return st}const Zn=typeof navigator<"u"&&navigator.hardwareConcurrency?Math.max(1,Math.floor(navigator.hardwareConcurrency/2)):2,$i=Li(()=>Wt(fs),"slugManager",Zn);function xs(){try{if(mr())return!0}catch{}try{return!!(typeof le=="string"&&le)}catch{return!1}}function fe(...e){try{Rt(...e)}catch{}}function Ss(){return $i.get()}function Ii(e){return $i.send(e,5e3)}async function Lr(e,t=1,n=void 0){const i=await Promise.resolve().then(()=>ot);if(!(i.initSlugWorker&&i.initSlugWorker()))throw new Error("slug worker required but unavailable");return await Ii({type:"buildSearchIndex",contentBase:e,indexDepth:t,noIndexing:n})}async function vs(e,t,n){const i=await Promise.resolve().then(()=>ot);if(!(i.initSlugWorker&&i.initSlugWorker()))throw new Error("slug worker required but unavailable");return Ii({type:"crawlForSlug",slug:e,base:t,maxQueue:n})}function nt(e,t){if(!e)return;let n=null;try{n=V(typeof t=="string"?t:String(t||""))}catch{n=String(t||"")}if(n){try{if(st&&st.length){const r=String(n).split("/")[0],a=st.includes(r);let s=K.get(e);if(!s||typeof s=="string")s={default:typeof s=="string"?V(s):void 0,langs:{}};else try{s.default&&(s.default=V(s.default))}catch{}a?s.langs[r]=n:s.default=n,K.set(e,s)}else{const i=K.has(e)?K.get(e):void 0;if(!i)K.set(e,n);else{let r=null;try{typeof i=="string"?r=V(i):i&&typeof i=="object"&&(r=i.default?V(i.default):null)}catch{r=null}if(r===n)K.set(e,n);else{let a=null,s=2;for(;a=`${e}-${s}`,!!K.has(a);){let o=K.get(a),l=null;try{typeof o=="string"?l=V(o):o&&typeof o=="object"&&(l=o.default?V(o.default):null)}catch{l=null}if(l===n){e=a;break}if(s+=1,s>1e4)break}try{if(!K.has(a))K.set(a,n),e=a;else if(K.get(a)===n)e=a;else{const o=new Set;for(const c of K.keys())o.add(c);const l=typeof Xt=="function"?Xt(e,o):`${e}-2`;K.set(l,n),e=l}}catch{}}}}}catch{}try{if(n){try{U.set(n,e)}catch{}try{if(Re&&typeof Re.has=="function"){if(!Re.has(n)){try{Re.add(n)}catch{}try{Array.isArray(Ie)&&!Ie.includes(n)&&Ie.push(n)}catch{}}}else try{Array.isArray(Ie)&&!Ie.includes(n)&&Ie.push(n)}catch{}}catch{}}}catch{}}}const Gn=new Set;function As(e){typeof e=="function"&&Gn.add(e)}function Es(e){typeof e=="function"&&Gn.delete(e)}const U=new Map;let Tr={},Ie=[];const Re=new Set;let le="_404.md",bt=null;const Rr="_home";function Ni(e){if(e==null){le=null;return}le=String(e||"")}function Bi(e){if(e==null){bt=null;return}bt=String(e||"")}function Cs(e){Tr=e||{}}function Oi(e){try{if(Array.isArray(ne)||(ne=[]),!Array.isArray(e))return;try{Array.isArray(ne)||(ne=[]),ne.length=0;for(const t of e)ne.push(t);try{if(typeof window<"u")try{window.__nimbiLiveSearchIndex=ne}catch{}}catch{}}catch(t){fe("[slugManager] replacing searchIndex by assignment fallback",t);try{ne=Array.from(e)}catch{}}}catch{}}const fn=new Map,Xn=new Set;function Ms(){fn.clear(),Xn.clear()}function Ls(e){if(!e||e.length===0)return"";let t=e[0];for(let i=1;i<e.length;i++){const r=e[i];let a=0;const s=Math.min(t.length,r.length);for(;a<s&&t[a]===r[a];)a++;t=t.slice(0,a)}const n=t.lastIndexOf("/");return n===-1?t:t.slice(0,n+1)}const he=rn(function(e){let n=String(e||"").toLowerCase().replace(/[^a-z0-9\- ]/g,"").replace(/ /g,"-");return n=n.replace(/(?:-?)(?:md|html)$/,""),n=n.replace(/-+/g,"-"),n=n.replace(/^-|-$/g,""),n.length>80&&(n=n.slice(0,80).replace(/-+$/g,"")),n},2e3);function zr(e){K.clear(),U.clear(),Ie=[];try{Re.clear()}catch{}st=st||[];const t=Object.keys(Tr||{});if(!t.length)return;let n="";try{if(e){try{/^[a-z][a-z0-9+.-]*:/i.test(String(e))?n=new URL(String(e)).pathname:n=String(e||"")}catch(i){n=String(e||""),fe("[slugManager] parse contentBase failed",i)}n=Gt(n)}}catch(i){n="",fe("[slugManager] setContentBase prefix derivation failed",i)}n||(n=Ls(t));for(const i of t){let r=i;n&&i.startsWith(n)?r=V(i.slice(n.length)):r=V(i),Ie.push(r);try{Re.add(r)}catch{}try{Zt()}catch(s){fe("[slugManager] refreshIndexPaths failed",s)}const a=Tr[i];if(typeof a=="string"){const s=(a||"").match(/^#\s+(.+)$/m);if(s&&s[1]){const o=he(s[1].trim());if(o)try{let l=o;if((!st||!st.length)&&(l=Xt(l,new Set(K.keys()))),st&&st.length){const u=r.split("/")[0],d=st.includes(u);let h=K.get(l);(!h||typeof h=="string")&&(h={default:typeof h=="string"?h:void 0,langs:{}}),d?h.langs[u]=r:h.default=r,K.set(l,h)}else K.set(l,r);U.set(r,l)}catch(l){fe("[slugManager] set slug mapping failed",l)}}}}}try{zr()}catch(e){fe("[slugManager] initial setContentBase failed",e)}function Xt(e,t){if(!t.has(e))return e;let n=2,i=`${e}-${n}`;for(;t.has(i);)n+=1,i=`${e}-${n}`;return i}function Ts(e){return gn(e,void 0)}function gn(e,t){if(!e)return!1;if(e.startsWith("//"))return!0;if(/^[a-z][a-z0-9+.-]*:/i.test(e)){if(t&&typeof t=="string")try{const n=new URL(e),i=new URL(t);return n.origin!==i.origin?!0:!n.pathname.startsWith(i.pathname)}catch{return!0}return!0}if(e.startsWith("/")&&t&&typeof t=="string")try{const n=new URL(e,t),i=new URL(t);return n.origin!==i.origin?!0:!n.pathname.startsWith(i.pathname)}catch{return!0}return!1}function Qn(e){return e==null?e:String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g,(t,n)=>n)}function sn(e){if(!e||!K.has(e))return null;const t=K.get(e);if(!t)return null;if(typeof t=="string")return t;if(st&&st.length&&Pt&&t.langs&&t.langs[Pt])return t.langs[Pt];if(t.default)return t.default;if(t.langs){const n=Object.keys(t.langs);if(n.length)return t.langs[n[0]]}return null}const ut=new qn({maxSize:2e3});function Rs(){ut.clear(),It.clear()}const It=new qn({maxSize:2e3});let ji=60*1e3;function zs(e){ji=Number(e)||0}function Ps(e){try{const t=Math.max(0,Number(e)||0);ut&&typeof ut._maxSize<"u"&&(ut._maxSize=t)}catch{}}function $s(e){try{const t=Math.max(0,Number(e)||0);ut&&typeof ut._ttlMs<"u"&&(ut._ttlMs=t)}catch{}}function Is(e){try{const t=Math.max(0,Number(e)||0);It&&typeof It._maxSize<"u"&&(It._maxSize=t)}catch{}}let Pr=Math.max(1,Math.min(Zn,5));function Ns(e){try{Pr=Math.max(1,Number(e)||1)}catch{Pr=1}}function pn(){return Pr}let Be=async function(e,t,n){if(!e)throw new Error("path required");try{if(typeof e=="string"&&(e.indexOf("?page=")!==-1||e.startsWith("?")||e.startsWith("#/")||e.indexOf("#/")!==-1))try{const c=et(e);c&&c.page&&(e=c.page)}catch{}}catch{}try{const c=(String(e||"").match(/([^\/]+)\.md(?:$|[?#])/)||[])[1],u=typeof e=="string"&&String(e).indexOf("/")===-1;if(c&&(u||!1)&&K.has(c)){const h=sn(c)||K.get(c);h&&h!==e&&(e=h)}}catch(c){fe("[slugManager] slug mapping normalization failed",c)}try{if(typeof e=="string"&&e.indexOf("::")!==-1){const c=String(e).split("::",1)[0];if(c)try{if(K.has(c)){const u=sn(c)||K.get(c);u?e=u:e=c}else e=c}catch{e=c}}}catch(c){fe("[slugManager] path sanitize failed",c)}if(!(n&&n.force===!0||typeof le=="string"&&le||K&&K.size||Re&&Re.size||mr()))throw new Error("failed to fetch md");const r=t==null?"":an(String(t));let a="";try{const c=typeof location<"u"&&location.origin?location.origin:"http://localhost";if(r&&r.startsWith("/")&&!/^[a-z][a-z0-9+.-]*:/i.test(r)){const u=r.replace(/\/$/,"")+"/"+e.replace(/^\//,"");a=(typeof location<"u"&&location&&location.origin?location.origin:"http://localhost").replace(/\/$/,"")+u}else{let u=c+"/";r&&(/^[a-z][a-z0-9+.-]*:/i.test(r)?u=r.replace(/\/$/,"")+"/":r.startsWith("/")?u=c+r.replace(/\/$/,"")+"/":u=c+"/"+r.replace(/\/$/,"")+"/"),a=new URL(e.replace(/^\//,""),u).toString()}}catch{a=(typeof location<"u"&&location.origin?location.origin:"http://localhost")+"/"+e.replace(/^\//,"")}const s=n&&n.signal;try{const c=It.get(a);if(c&&c>Date.now())return Promise.reject(new Error("failed to fetch md"));c&&It.delete(a)}catch{}if(ut.has(a))return ut.get(a);const l=(async()=>{const c=await fetch(a,s?{signal:s}:void 0);if(!c||typeof c.ok!="boolean"||!c.ok){if(c&&c.status===404&&typeof le=="string"&&le)try{const m=`${r}/${le}`,g=await globalThis.fetch(m,s?{signal:s}:void 0);if(g&&typeof g.ok=="boolean"&&g.ok)return{raw:await g.text(),status:404}}catch(m){fe("[slugManager] fetching fallback 404 failed",m)}let p="";try{c&&typeof c.clone=="function"?p=await c.clone().text():c&&typeof c.text=="function"?p=await c.text():p=""}catch(m){p="",fe("[slugManager] reading error body failed",m)}try{const m=c?c.status:void 0;if(m===404)try{k("fetchMarkdown failed (404):",()=>({url:a,status:m,statusText:c?c.statusText:void 0,body:p.slice(0,200)}))}catch{}else try{On("fetchMarkdown failed:",()=>({url:a,status:m,statusText:c?c.statusText:void 0,body:p.slice(0,200)}))}catch{}}catch{}throw new Error("failed to fetch md")}const u=await c.text(),d=u.trim().slice(0,128).toLowerCase(),h=/^(?:<!doctype|<html|<title|<h1)/.test(d),f=h||String(e||"").toLowerCase().endsWith(".html");if(h&&String(e||"").toLowerCase().endsWith(".md")){try{if(typeof le=="string"&&le){const p=`${r}/${le}`,m=await globalThis.fetch(p,s?{signal:s}:void 0);if(m.ok)return{raw:await m.text(),status:404}}}catch(p){fe("[slugManager] fetching fallback 404 failed",p)}throw xs()&&On("fetchMarkdown: server returned HTML for .md request",a),new Error("failed to fetch md")}return f?{raw:u,isHtml:!0}:{raw:u}})().catch(c=>{if(c&&c.name==="AbortError"){try{ut.delete(a)}catch{}throw c}try{It.set(a,Date.now()+ji)}catch{}try{ut.delete(a)}catch{}throw c});return ut.set(a,l),l};function Bs(e){typeof e=="function"&&(Be=e)}const Kn=new Map;function Os(e){if(!e||typeof e!="string")return"";let t=e.replace(/```[\s\S]*?```/g,"");return t=t.replace(/<pre[\s\S]*?<\/pre>/gi,""),t=t.replace(/<code[\s\S]*?<\/code>/gi,""),t=t.replace(/<!--([\s\S]*?)-->/g,""),t=t.replace(/^ {4,}.*$/gm,""),t=t.replace(/`[^`]*`/g,""),t}let ne=[];function js(){return ne}try{if(typeof window<"u")try{Object.defineProperty(window,"__nimbiSearchIndex",{get(){return ne},enumerable:!0,configurable:!0})}catch{try{window.__nimbiSearchIndex=ne}catch{}}}catch{}try{if(typeof window<"u")try{Object.defineProperty(window,"__nimbiIndexReady",{get(){return $r},enumerable:!0,configurable:!0})}catch{try{window.__nimbiIndexReady=$r}catch{}}}catch{}let Nt=null;async function Qt(e,t=1,n=void 0,i=void 0){const r=Array.isArray(n)?Array.from(new Set((n||[]).map(a=>V(String(a||""))))):[];try{const a=V(String(le||""));a&&!r.includes(a)&&r.push(a)}catch{}if(ne&&ne.length&&t===1&&!ne.some(s=>{try{return r.includes(V(String(s.path||"")))}catch{return!1}}))return ne;if(Nt)return Nt;Nt=(async()=>{let a=Array.isArray(n)?Array.from(new Set((n||[]).map(g=>V(String(g||""))))):[];try{const g=V(String(le||""));g&&!a.includes(g)&&a.push(g)}catch{}const s=g=>{if(!a||!a.length)return!1;for(const b of a)if(b&&(g===b||g.startsWith(b+"/")))return!0;return!1};let o=[];try{if(Array.isArray(i)&&i.length)for(const g of i)try{const b=V(String(g||""));b&&o.push(b)}catch{}}catch{}if(Array.isArray(Ie)&&Ie.length&&(o=Array.from(Ie)),!o.length){if(U&&typeof U.size=="number"&&U.size)try{o=Array.from(U.keys())}catch{o=[]}else for(const g of K.values())if(g){if(typeof g=="string")o.push(g);else if(g&&typeof g=="object"){g.default&&o.push(g.default);const b=g.langs||{};for(const y of Object.keys(b||{}))try{b[y]&&o.push(b[y])}catch{}}}}try{const g=await Ui(e);g&&g.length&&(o=o.concat(g))}catch(g){fe("[slugManager] crawlAllMarkdown during buildSearchIndex failed",g)}try{const g=new Set(o),b=[...o],y=Math.max(1,Math.min(pn(),b.length||pn()));let _=0;const w=async()=>{for(;!(g.size>mn);){const S=b.shift();if(!S)break;try{const M=await Be(S,e);if(M&&M.raw){if(M.status===404)continue;let I=M.raw;const q=[],Q=String(S||"").replace(/^.*\//,"");if(/^readme(?:\.md)?$/i.test(Q)&&Mr&&(!S||!S.includes("/")))continue;const R=Os(I),O=/\[[^\]]+\]\(([^)]+)\)/g;let G;for(;G=O.exec(R);)q.push(G[1]);const re=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;G=re.exec(R);)q.push(G[1]);const D=S&&S.includes("/")?S.substring(0,S.lastIndexOf("/")+1):"";for(let L of q)try{if(gn(L,e)||L.startsWith("..")||L.indexOf("/../")!==-1||(D&&!L.startsWith("./")&&!L.startsWith("/")&&!L.startsWith("../")&&(L=D+L),L=V(L),!/\.(md|html?)(?:$|[?#])/i.test(L))||(L=L.split(/[?#]/)[0],s(L)))continue;g.has(L)||(g.add(L),b.push(L),o.push(L))}catch(H){fe("[slugManager] href processing failed",L,H)}}}catch(M){fe("[slugManager] discovery fetch failed for",S,M)}try{_++,await $t(_,32)}catch{}}},A=[];for(let S=0;S<y;S++)A.push(w());await Promise.all(A)}catch(g){fe("[slugManager] discovery loop failed",g)}const l=new Set;o=o.filter(g=>!g||l.has(g)||s(g)?!1:(l.add(g),!0));const c=[],u=new Map,d=o.filter(g=>/\.(?:md|html?)(?:$|[?#])/i.test(g)),h=Math.max(1,Math.min(pn(),d.length||1)),f=d.slice(),p=[];for(let g=0;g<h;g++)p.push((async()=>{for(;f.length;){const b=f.shift();if(!b)break;try{const y=await Be(b,e);u.set(b,y)}catch(y){fe("[slugManager] buildSearchIndex: entry fetch failed",b,y),u.set(b,null)}}})());await Promise.all(p);let m=0;for(const g of o){try{m++,await $t(m,16)}catch{}if(/\.(?:md|html?)(?:$|[?#])/i.test(g))try{const b=u.get(g);if(!b||!b.raw||b.status===404)continue;let y="",_="",w=null;if(b.isHtml)try{const S=He(),M=S?S.parseFromString(b.raw,"text/html"):null,I=M?M.querySelector("title")||M.querySelector("h1"):null;I&&I.textContent&&(y=I.textContent.trim());const q=M?M.querySelector("p"):null;if(q&&q.textContent&&(_=q.textContent.trim()),t>=2)try{const Q=M?M.querySelector("h1"):null,R=Q&&Q.textContent?Q.textContent.trim():y||"";try{const G=U&&typeof U.has=="function"&&U.has(g)?U.get(g):null;if(G)w=G;else{let re=he(y||g);const D=new Set;try{for(const H of K.keys())D.add(H)}catch{}try{for(const H of c)H&&H.slug&&D.add(String(H.slug).split("::")[0])}catch{}let L=!1;try{if(K.has(re)){const H=K.get(re);if(typeof H=="string")H===g&&(L=!0);else if(H&&typeof H=="object"){H.default===g&&(L=!0);for(const W of Object.keys(H.langs||{}))if(H.langs[W]===g){L=!0;break}}}}catch{}!L&&D.has(re)&&(re=Xt(re,D)),w=re;try{U.has(g)||nt(w,g)}catch{}}}catch(G){fe("[slugManager] derive pageSlug failed",G)}const O=Array.from(M.querySelectorAll("h2"));for(const G of O)try{const re=(G.textContent||"").trim();if(!re)continue;const D=G.id?G.id:he(re),L=w?`${w}::${D}`:`${he(g)}::${D}`;let H="",W=G.nextElementSibling;for(;W&&W.tagName&&W.tagName.toLowerCase()==="script";)W=W.nextElementSibling;W&&W.textContent&&(H=String(W.textContent).trim()),c.push({slug:L,title:re,excerpt:H,path:g,parentTitle:R})}catch(re){fe("[slugManager] indexing H2 failed",re)}if(t===3)try{const G=Array.from(M.querySelectorAll("h3"));for(const re of G)try{const D=(re.textContent||"").trim();if(!D)continue;const L=re.id?re.id:he(D),H=w?`${w}::${L}`:`${he(g)}::${L}`;let W="",ie=re.nextElementSibling;for(;ie&&ie.tagName&&ie.tagName.toLowerCase()==="script";)ie=ie.nextElementSibling;ie&&ie.textContent&&(W=String(ie.textContent).trim()),c.push({slug:H,title:D,excerpt:W,path:g,parentTitle:R})}catch(D){fe("[slugManager] indexing H3 failed",D)}}catch(G){fe("[slugManager] collect H3s failed",G)}}catch(Q){fe("[slugManager] collect H2s failed",Q)}}catch(S){fe("[slugManager] parsing HTML for index failed",S)}else{const S=b.raw,M=S.match(/^#\s+(.+)$/m);y=M?M[1].trim():"";try{y=Qn(y)}catch{}const I=S.split(/\r?\n\s*\r?\n/);if(I.length>1)for(let q=1;q<I.length;q++){const Q=I[q].trim();if(Q&&!/^#/.test(Q)){_=Q.replace(/\r?\n/g," ");break}}if(t>=2){let q="";try{const Q=(S.match(/^#\s+(.+)$/m)||[])[1];q=Q?Q.trim():"";try{const G=U&&typeof U.has=="function"&&U.has(g)?U.get(g):null;if(G)w=G;else{let re=he(y||g);const D=new Set;try{for(const H of K.keys())D.add(H)}catch{}try{for(const H of c)H&&H.slug&&D.add(String(H.slug).split("::")[0])}catch{}let L=!1;try{if(K.has(re)){const H=K.get(re);if(typeof H=="string")H===g&&(L=!0);else if(H&&typeof H=="object"){H.default===g&&(L=!0);for(const W of Object.keys(H.langs||{}))if(H.langs[W]===g){L=!0;break}}}}catch{}!L&&D.has(re)&&(re=Xt(re,D)),w=re;try{U.has(g)||nt(w,g)}catch{}}}catch(G){fe("[slugManager] derive pageSlug failed",G)}const R=/^##\s+(.+)$/gm;let O;for(;O=R.exec(S);)try{const G=(O[1]||"").trim(),re=Qn(G);if(!G)continue;const D=he(G),L=w?`${w}::${D}`:`${he(g)}::${D}`,W=S.slice(R.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),ie=W&&W[1]?String(W[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";c.push({slug:L,title:re,excerpt:ie,path:g,parentTitle:q})}catch(G){fe("[slugManager] indexing markdown H2 failed",G)}}catch(Q){fe("[slugManager] collect markdown H2s failed",Q)}if(t===3)try{const Q=/^###\s+(.+)$/gm;let R;for(;R=Q.exec(S);)try{const O=(R[1]||"").trim(),G=Qn(O);if(!O)continue;const re=he(O),D=w?`${w}::${re}`:`${he(g)}::${re}`,H=S.slice(Q.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),W=H&&H[1]?String(H[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";c.push({slug:D,title:G,excerpt:W,path:g,parentTitle:q})}catch(O){fe("[slugManager] indexing markdown H3 failed",O)}}catch(Q){fe("[slugManager] collect markdown H3s failed",Q)}}}let A="";try{U.has(g)&&(A=U.get(g))}catch(S){fe("[slugManager] mdToSlug access failed",S)}if(!A){try{if(!w){const S=U&&typeof U.has=="function"&&U.has(g)?U.get(g):null;if(S)w=S;else{let M=he(y||g);const I=new Set;try{for(const Q of K.keys())I.add(Q)}catch{}try{for(const Q of c)Q&&Q.slug&&I.add(String(Q.slug).split("::")[0])}catch{}let q=!1;try{if(K.has(M)){const Q=K.get(M);if(typeof Q=="string")Q===g&&(q=!0);else if(Q&&typeof Q=="object"){Q.default===g&&(q=!0);for(const R of Object.keys(Q.langs||{}))if(Q.langs[R]===g){q=!0;break}}}}catch{}!q&&I.has(M)&&(M=Xt(M,I)),w=M;try{U.has(g)||nt(w,g)}catch{}}}}catch(S){fe("[slugManager] derive pageSlug failed",S)}A=w||he(y||g)}c.push({slug:A,title:y,excerpt:_,path:g})}catch(b){fe("[slugManager] buildSearchIndex: entry processing failed",b)}}try{const g=c.filter(b=>{try{return!s(String(b.path||""))}catch{return!0}});try{Array.isArray(ne)||(ne=[]),ne.length=0;for(const b of g)ne.push(b)}catch{try{ne=Array.from(g)}catch{ne=g}}try{if(typeof window<"u"){try{window.__nimbiResolvedIndex=ne}catch{}try{const b=[],y=new Set;for(const _ of ne)try{if(!_||!_.slug)continue;const w=String(_.slug).split("::")[0];if(y.has(w))continue;y.add(w);const A={slug:w};_.title?A.title=String(_.title):_.parentTitle&&(A.title=String(_.parentTitle)),_.path&&(A.path=String(_.path)),b.push(A)}catch{}try{window.__nimbiSitemapJson={generatedAt:new Date().toISOString(),entries:b}}catch{}try{window.__nimbiSitemapFinal=b}catch{}}catch{}}}catch{}}catch(g){fe("[slugManager] filtering index by excludes failed",g);try{Array.isArray(ne)||(ne=[]),ne.length=0;for(const b of c)ne.push(b)}catch{try{ne=Array.from(c)}catch{ne=c}}try{if(typeof window<"u")try{window.__nimbiResolvedIndex=ne}catch{}}catch{}}return ne})();try{await Nt}catch(a){fe("[slugManager] awaiting _indexPromise failed",a)}return Nt=null,ne}async function Bt(e={}){try{const t=typeof e.timeoutMs=="number"?e.timeoutMs:8e3,n=e.contentBase,i=typeof e.indexDepth=="number"?e.indexDepth:1,r=Array.isArray(e.noIndexing)?e.noIndexing:void 0,a=Array.isArray(e.seedPaths)?e.seedPaths:void 0,s=typeof e.startBuild=="boolean"?e.startBuild:!0;if(Array.isArray(ne)&&ne.length&&!Nt&&!s)return ne;if(Nt){try{await Nt}catch{}return ne}if(s){try{if(typeof Lr=="function")try{const l=await Lr(n,i,r,a);if(Array.isArray(l)&&l.length){try{Oi(l)}catch{}return ne}}catch{}}catch{}try{return await Qt(n,i,r,a),ne}catch{}}const o=Date.now();for(;Date.now()-o<t;){if(Array.isArray(ne)&&ne.length)return ne;await new Promise(l=>setTimeout(l,150))}return ne}catch{return ne}}async function $r(e={}){try{const t=Object.assign({},e);typeof t.startBuild!="boolean"&&(t.startBuild=!0),typeof t.timeoutMs!="number"&&(t.timeoutMs=1/0);try{return await Bt(t)}catch{return ne}}catch{return ne}}const qi=1e3;let mn=qi;function qs(e){typeof e=="number"&&e>=0&&(mn=e)}const Hi=He(),Fi="a[href]";let Di=async function(e,t,n=mn){if(Kn.has(e))return Kn.get(e);let i=null;const r=new Set,a=[""],s=typeof location<"u"&&location.origin?location.origin:"http://localhost";let o=s+"/";try{t&&(/^[a-z][a-z0-9+.-]*:/i.test(String(t))?o=String(t).replace(/\/$/,"")+"/":String(t).startsWith("/")?o=s+String(t).replace(/\/$/,"")+"/":o=s+"/"+String(t).replace(/\/$/,"")+"/")}catch{o=s+"/"}const l=Math.max(1,Math.min(Zn,6));for(;a.length&&!i&&!(a.length>n);){const c=a.splice(0,l);await dn(c,async u=>{if(u==null||r.has(u))return;r.add(u);let d="";try{d=new URL(u||"",o).toString()}catch{d=(String(t||"")||s)+"/"+String(u||"").replace(/^\//,"")}try{let h;try{h=await globalThis.fetch(d)}catch(b){fe("[slugManager] crawlForSlug: fetch failed",{url:d,error:b});return}if(!h||!h.ok){h&&!h.ok&&fe("[slugManager] crawlForSlug: directory fetch non-ok",{url:d,status:h.status});return}const f=await h.text(),p=Hi.parseFromString(f,"text/html");let m=[];try{p&&typeof p.getElementsByTagName=="function"?m=p.getElementsByTagName("a"):p&&typeof p.querySelectorAll=="function"?m=p.querySelectorAll(Fi):m=[]}catch{try{m=p.getElementsByTagName?p.getElementsByTagName("a"):[]}catch{m=[]}}const g=d;for(const b of m)try{if(i)break;let y=b.getAttribute("href")||"";if(!y||gn(y,t)||y.startsWith("..")||y.indexOf("/../")!==-1)continue;if(y.endsWith("/")){try{const _=new URL(y,g),w=new URL(o).pathname,A=_.pathname.startsWith(w)?_.pathname.slice(w.length):_.pathname.replace(/^\//,""),S=Gt(V(A));r.has(S)||a.push(S)}catch{const w=V(u+y);r.has(w)||a.push(w)}continue}if(y.toLowerCase().endsWith(".md")){let _="";try{const w=new URL(y,g),A=new URL(o).pathname;_=w.pathname.startsWith(A)?w.pathname.slice(A.length):w.pathname.replace(/^\//,"")}catch{_=(u+y).replace(/^\//,"")}_=V(_);try{if(U.has(_))continue;for(const w of K.values());}catch(w){fe("[slugManager] slug map access failed",w)}try{const w=await Be(_,t);if(w&&w.raw){const A=(w.raw||"").match(/^#\s+(.+)$/m);if(A&&A[1]&&he(A[1].trim())===e){i=_;break}}}catch(w){fe("[slugManager] crawlForSlug: fetchMarkdown failed",w)}}}catch(y){fe("[slugManager] crawlForSlug: link iteration failed",y)}}catch(h){fe("[slugManager] crawlForSlug: directory fetch failed",h)}},l)}return Kn.set(e,i),i};async function Ui(e,t=mn){const n=new Set,i=new Set,r=[""],a=typeof location<"u"&&location.origin?location.origin:"http://localhost";let s=a+"/";try{e&&(/^[a-z][a-z0-9+.-]*:/i.test(String(e))?s=String(e).replace(/\/$/,"")+"/":String(e).startsWith("/")?s=a+String(e).replace(/\/$/,"")+"/":s=a+"/"+String(e).replace(/\/$/,"")+"/")}catch{s=a+"/"}const o=Math.max(1,Math.min(Zn,6));for(;r.length&&!(r.length>t);){const l=r.splice(0,o);await dn(l,async c=>{if(c==null||i.has(c))return;i.add(c);let u="";try{u=new URL(c||"",s).toString()}catch{u=(String(e||"")||a)+"/"+String(c||"").replace(/^\//,"")}try{let d;try{d=await globalThis.fetch(u)}catch(g){fe("[slugManager] crawlAllMarkdown: fetch failed",{url:u,error:g});return}if(!d||!d.ok){d&&!d.ok&&fe("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:u,status:d.status});return}const h=await d.text(),f=Hi.parseFromString(h,"text/html");let p=[];try{f&&typeof f.getElementsByTagName=="function"?p=f.getElementsByTagName("a"):f&&typeof f.querySelectorAll=="function"?p=f.querySelectorAll(Fi):p=[]}catch{try{p=f.getElementsByTagName?f.getElementsByTagName("a"):[]}catch{p=[]}}const m=u;for(const g of p)try{let b=g.getAttribute("href")||"";if(!b||gn(b,e)||b.startsWith("..")||b.indexOf("/../")!==-1)continue;if(b.endsWith("/")){try{const _=new URL(b,m),w=new URL(s).pathname,A=_.pathname.startsWith(w)?_.pathname.slice(w.length):_.pathname.replace(/^\//,""),S=Gt(V(A));i.has(S)||r.push(S)}catch{const w=c+b;i.has(w)||r.push(w)}continue}let y="";try{const _=new URL(b,m),w=new URL(s).pathname;y=_.pathname.startsWith(w)?_.pathname.slice(w.length):_.pathname.replace(/^\//,"")}catch{y=(c+b).replace(/^\//,"")}y=V(y),/\.(md|html?)$/i.test(y)&&n.add(y)}catch(b){fe("[slugManager] crawlAllMarkdown: link iteration failed",b)}}catch(d){fe("[slugManager] crawlAllMarkdown: directory fetch failed",d)}},o)}return Array.from(n)}async function Wi(e,t,n){if(e&&typeof e=="string"&&(e=V(e),e=an(e)),K.has(e))return sn(e)||K.get(e);try{if(!(typeof le=="string"&&le||K.has(e)||Re&&Re.size||Zt._refreshed||typeof t=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(t)))return null}catch{}for(const r of Gn)try{const a=await r(e,t);if(a)return nt(e,a),a}catch(a){fe("[slugManager] slug resolver failed",a)}if(Re&&Re.size){if(fn.has(e)){const r=fn.get(e);return nt(e,r),r}for(const r of Ie)if(!Xn.has(r))try{const a=await Be(r,t);if(a&&a.raw){const s=(a.raw||"").match(/^#\s+(.+)$/m);if(s&&s[1]){const o=he(s[1].trim());if(Xn.add(r),o&&fn.set(o,r),o===e)return nt(e,r),r}}}catch(a){fe("[slugManager] manifest title fetch failed",a)}try{crawlBatchYieldCount++,await $t(crawlBatchYieldCount,8)}catch{}}try{const r=await Qt(t);if(r&&r.length){const a=r.find(s=>s.slug===e);if(a)return nt(e,a.path),a.path}}catch(r){fe("[slugManager] buildSearchIndex lookup failed",r)}try{const r=await Di(e,t,n);if(r)return nt(e,r),r}catch(r){fe("[slugManager] crawlForSlug lookup failed",r)}const i=[`${e}.html`,`${e}.md`];for(const r of i)try{const a=await Be(r,t);if(a&&a.raw)return nt(e,r),r}catch(a){fe("[slugManager] candidate fetch failed",a)}if(Re&&Re.size)for(const r of Ie)try{const a=r.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(he(a)===e)return nt(e,r),r}catch(a){fe("[slugManager] build-time filename match failed",a)}try{if(bt&&typeof bt=="string"&&bt.trim())try{const r=await Be(bt,t);if(r&&r.raw){const a=(r.raw||"").match(/^#\s+(.+)$/m);if(a&&a[1]&&he(a[1].trim())===e)return nt(e,bt),bt}}catch(r){fe("[slugManager] home page fetch failed",r)}}catch(r){fe("[slugManager] home page fetch failed",r)}return null}const ot=Object.freeze(Object.defineProperty({__proto__:null,CRAWL_MAX_QUEUE:qi,HOME_SLUG:Rr,_setAllMd:Cs,_setSearchIndex:Oi,_storeSlugMapping:nt,addSlugResolver:As,get allMarkdownPaths(){return Ie},allMarkdownPathsSet:Re,get availableLanguages(){return st},awaitSearchIndex:$r,buildSearchIndex:Qt,buildSearchIndexWorker:Lr,clearFetchCache:Rs,clearListCaches:Ms,crawlAllMarkdown:Ui,crawlCache:Kn,crawlForSlug:Di,crawlForSlugWorker:vs,get defaultCrawlMaxQueue(){return mn},ensureSlug:Wi,fetchCache:ut,get fetchMarkdown(){return Be},getFetchConcurrency:pn,getLanguages:ks,getSearchIndex:js,get homePage(){return bt},initSlugWorker:Ss,isExternalLink:Ts,isExternalLinkWithBase:gn,listPathsFetched:Xn,listSlugCache:fn,mdToSlug:U,negativeFetchCache:It,get notFoundPage(){return le},removeSlugResolver:Es,resolveSlugPath:sn,get searchIndex(){return ne},setContentBase:zr,setDefaultCrawlMaxQueue:qs,setFetchCacheMaxSize:Ps,setFetchCacheTTL:$s,setFetchConcurrency:Ns,setFetchMarkdown:Bs,setFetchNegativeCacheTTL:zs,setHomePage:Bi,setLanguages:Pi,setNegativeFetchCacheMaxSize:Is,setNotFoundPage:Ni,setSkipRootReadme:_s,get skipRootReadme(){return Mr},slugResolvers:Gn,slugToMd:K,slugify:he,unescapeMarkdown:Qn,uniqueSlug:Xt,whenSearchIndexReady:Bt},Symbol.toStringTag,{value:"Module"}));var Ir,Zi;function Hs(){if(Zi)return Ir;Zi=1;function e(a,s){return s.some(([o,l])=>o<=a&&a<=l)}function t(a){if(typeof a!="string")return!1;const s=a.charCodeAt(0);return e(s,[[12352,12447],[19968,40959],[44032,55203],[131072,191456]])}function n(a){return` 
\r	`.includes(a)}function i(a){if(typeof a!="string")return!1;const s=a.charCodeAt(0);return e(s,[[33,47],[58,64],[91,96],[123,126],[12288,12351],[65280,65519]])}function r(a,s={}){let o=0,l=0,c=a.length-1;const u=s.wordsPerMinute||200,d=s.wordBound||n;for(;d(a[l]);)l++;for(;d(a[c]);)c--;const h=`${a}
`;for(let g=l;g<=c;g++)if((t(h[g])||!d(h[g])&&(d(h[g+1])||t(h[g+1])))&&o++,t(h[g]))for(;g<=c&&(i(h[g+1])||d(h[g+1]));)g++;const f=o/u,p=Math.round(f*60*1e3);return{text:Math.ceil(f.toFixed(2))+" min read",minutes:f,time:p,words:o}}return Ir=r,Ir}var Fs=Hs();const Ds=ki(Fs),yn=new Map,Us=200;function Ws(e){return String(e||"")}function Zs(e,t){if(yn.set(e,t),yn.size>Us){const n=yn.keys().next().value;n&&yn.delete(n)}}function Gs(e){return e?String(e).trim().split(/\s+/).filter(Boolean).length:0}function Xs(e){const t=Ws(e),n=yn.get(t);if(n)return Object.assign({},n);const i=Ds(e||""),r=typeof i.words=="number"?i.words:Gs(e),a={readingTime:i,wordCount:r};return Zs(t,a),Object.assign({},a)}function bn(e,t){let n=document.querySelector(`meta[name="${e}"]`);n||(n=document.createElement("meta"),n.setAttribute("name",e),document.head.appendChild(n)),n.setAttribute("content",t)}function Ot(e,t,n){let i=`meta[${e}="${t}"]`,r=document.querySelector(i);r||(r=document.createElement("meta"),r.setAttribute(e,t),document.head.appendChild(r)),r.setAttribute("content",n)}function Gi(e,t){try{let n=document.querySelector(`link[rel="${e}"]`);n||(n=document.createElement("link"),n.setAttribute("rel",e),document.head.appendChild(n)),n.setAttribute("href",t)}catch(n){k("[seoManager] upsertLinkRel failed",n)}}function Qs(e,t,n,i){const r=t&&String(t).trim()?t:e.title||document.title;Ot("property","og:title",r);const a=i&&String(i).trim()?i:e.description||"";a&&String(a).trim()&&Ot("property","og:description",a),a&&String(a).trim()&&Ot("name","twitter:description",a),Ot("name","twitter:card",e.twitter_card||"summary_large_image");const s=n||e.image;s&&(Ot("property","og:image",s),Ot("name","twitter:image",s))}function Nr(e,t,n,i,r=""){const a=e.meta||{},s=document&&document.querySelector&&document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",o=i&&String(i).trim()?i:a.description&&String(a.description).trim()?a.description:s&&String(s).trim()?s:"";o&&String(o).trim()&&bn("description",o),bn("robots",a.robots||"index,follow"),Qs(a,t,n,o)}function Ks(){try{const e=['meta[name="site"]','meta[name="site-name"]','meta[name="siteName"]','meta[property="og:site_name"]','meta[name="twitter:site"]'];for(const t of e){const n=document.querySelector(t);if(n){const i=n.getAttribute("content")||"";if(i&&i.trim())return i.trim()}}}catch(e){k("[seoManager] getSiteNameFromMeta failed",e)}return""}function Br(e,t,n,i,r,a=""){try{const s=e.meta||{},o=n&&String(n).trim()?n:s.title||a||document.title,l=r&&String(r).trim()?r:s.description||document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",c=i||s.image||null;let u="";try{if(t){const p=V(t);try{u=(location.origin+location.pathname).split("?")[0]+"?page="+encodeURIComponent(p)}catch{u=location.href.split("#")[0]}}else u=location.href.split("#")[0]}catch(p){u=location.href.split("#")[0],k("[seoManager] compute canonical failed",p)}u&&Gi("canonical",u);try{Ot("property","og:url",u)}catch(p){k("[seoManager] upsertMeta og:url failed",p)}const d={"@context":"https://schema.org","@type":"Article",headline:o||"",description:l||"",url:u||location.href.split("#")[0]};c&&(d.image=String(c)),s.date&&(d.datePublished=s.date),s.dateModified&&(d.dateModified=s.dateModified);const h="nimbi-jsonld";let f=document.getElementById(h);f||(f=document.createElement("script"),f.type="application/ld+json",f.id=h,document.head.appendChild(f)),f.textContent=JSON.stringify(d,null,2)}catch(s){k("[seoManager] setStructuredData failed",s)}}let wn=typeof window<"u"&&window.__SEO_MAP?window.__SEO_MAP:{};function Vs(e){try{if(!e||typeof e!="object"){wn={};return}wn=Object.assign({},e)}catch(t){k("[seoManager] setSeoMap failed",t)}}function Ys(e,t=""){try{if(!e)return;const n=wn&&wn[e]?wn[e]:typeof window<"u"&&window.__SEO_MAP&&window.__SEO_MAP[e]?window.__SEO_MAP[e]:null;try{const i=location.origin+location.pathname+"?page="+encodeURIComponent(String(e||""));Gi("canonical",i);try{Ot("property","og:url",i)}catch{}}catch{}if(!n)return;try{n.title&&(document.title=String(n.title))}catch{}try{n.description&&bn("description",String(n.description))}catch{}try{try{Nr({meta:n},n.title||void 0,n.image||void 0,n.description||void 0,t)}catch{}}catch{}try{Br({meta:n},e,n.title||void 0,n.image||void 0,n.description||void 0,t)}catch(i){k("[seoManager] inject structured data failed",i)}}catch(n){k("[seoManager] injectSeoForPage failed",n)}}function Vn(e={},t="",n=void 0,i=void 0){try{const r=e||{},a=typeof n=="string"&&n.trim()?n:r.title||"Not Found",s=typeof i=="string"&&i.trim()?i:r.description||"";try{bn("robots","noindex,follow")}catch{}try{s&&String(s).trim()&&bn("description",String(s))}catch{}try{Nr({meta:Object.assign({},r,{robots:"noindex,follow"})},a,r.image||void 0,s)}catch{}try{Br({meta:Object.assign({},r,{title:a,description:s})},t||"",a,r.image||void 0,s)}catch{}}catch(r){k("[seoManager] markNotFound failed",r)}}function Js(e,t,n,i,r,a,s,o,l,c,u){try{if(i&&i.querySelector){const d=i.querySelector(".menu-label");d&&(d.textContent=o&&o.textContent||e("onThisPage"))}}catch(d){k("[seoManager] update toc label failed",d)}try{const d=n.meta&&n.meta.title?String(n.meta.title).trim():"",h=r.querySelector("img"),f=h&&(h.getAttribute("src")||h.src)||null;let p="";try{let b="";try{const y=o||(r&&r.querySelector?r.querySelector("h1"):null);if(y){let _=y.nextElementSibling;const w=[];for(;_&&!(_.tagName&&_.tagName.toLowerCase()==="h2");){try{if(_.classList&&_.classList.contains("nimbi-article-subtitle")){_=_.nextElementSibling;continue}}catch{}const A=(_.textContent||"").trim();A&&w.push(A),_=_.nextElementSibling}w.length&&(b=w.join(" ").replace(/\s+/g," ").trim()),!b&&l&&(b=String(l).trim())}}catch(y){k("[seoManager] compute descOverride failed",y)}b&&String(b).length>160&&(b=String(b).slice(0,157).trim()+"..."),p=b}catch(b){k("[seoManager] compute descOverride failed",b)}let m="";try{d&&(m=d)}catch{}if(!m)try{o&&o.textContent&&(m=String(o.textContent).trim())}catch{}if(!m)try{const b=r.querySelector("h2");b&&b.textContent&&(m=String(b.textContent).trim())}catch{}m||(m=a||"");try{Nr(n,m||void 0,f,p)}catch(b){k("[seoManager] setMetaTags failed",b)}try{Br(n,c,m||void 0,f,p,t)}catch(b){k("[seoManager] setStructuredData failed",b)}const g=Ks();m?g?document.title=`${g} - ${m}`:document.title=`${t||"Site"} - ${m}`:d?document.title=d:document.title=t||document.title}catch(d){k("[seoManager] applyPageMeta failed",d)}try{try{const d=r.querySelectorAll(".nimbi-reading-time");d&&d.forEach(h=>h.remove())}catch{}if(l){const d=Xs(u.raw||""),h=d&&d.readingTime?d.readingTime:null,f=h&&typeof h.minutes=="number"?Math.ceil(h.minutes):0,p=f?e("readingTime",{minutes:f}):"";if(!p)return;const m=r.querySelector("h1");if(m){const g=r.querySelector(".nimbi-article-subtitle");try{if(g){const b=document.createElement("span");b.className="nimbi-reading-time",b.textContent=p,g.appendChild(b)}else{const b=document.createElement("p");b.className="nimbi-article-subtitle is-6 has-text-grey-light";const y=document.createElement("span");y.className="nimbi-reading-time",y.textContent=p,b.appendChild(y);try{m.parentElement.insertBefore(b,m.nextSibling)}catch{try{m.insertAdjacentElement("afterend",b)}catch{}}}}catch{try{const y=document.createElement("p");y.className="nimbi-article-subtitle is-6 has-text-grey-light";const _=document.createElement("span");_.className="nimbi-reading-time",_.textContent=p,y.appendChild(_),m.insertAdjacentElement("afterend",y)}catch{}}}}}catch(d){k("[seoManager] reading time update failed",d)}}let Xi=100;function Qi(e){Xi=e}function ht(){try{if(Dt(2))return!0}catch{}try{return!1}catch{return!1}}let _n=300*1e3,kn=null;function dt(e,t,n){try{if(typeof Be=="function"&&typeof Be.length=="number"&&Be.length>=3)return Be(e,t,{signal:n})}catch{}return Be(e,t)}function Ki(e){_n=e}const pt=new Map;function eo(e){if(!pt.has(e))return;const t=pt.get(e),n=Date.now();if(t.ts+_n<n){pt.delete(e);return}return pt.delete(e),pt.set(e,t),t.value}function to(e,t){if(Vi(),Vi(),pt.delete(e),pt.set(e,{value:t,ts:Date.now()}),pt.size>Xi){const n=pt.keys().next().value;n!==void 0&&pt.delete(n)}}function Vi(){if(!_n||_n<=0)return;const e=Date.now();for(const[t,n]of pt.entries())n.ts+_n<e&&pt.delete(t)}async function no(e,t,n){const i=new Set(tt);let r=[];try{if(typeof document<"u"&&document.getElementsByClassName){const a=s=>{const o=document.getElementsByClassName(s);for(let l=0;l<o.length;l++){const c=o[l].getElementsByTagName("a");for(let u=0;u<c.length;u++)r.push(c[u])}};a("nimbi-site-navbar"),a("navbar"),a("nimbi-nav")}else r=Array.from(document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a"))}catch{try{r=Array.from(document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a"))}catch{r=[]}}for(const a of Array.from(r||[])){const s=a.getAttribute("href")||"";if(s)try{try{const h=et(s);if(h){if(h.type==="canonical"&&h.page){const f=V(h.page);if(f){i.add(f);continue}}if(h.type==="cosmetic"&&h.page){const f=h.page;if(K.has(f)){const p=K.get(f);if(p)return p}continue}}}catch{}const o=new URL(s,location.href);if(o.origin!==location.origin)continue;const l=(o.hash||o.pathname).match(/([^#?]+\.md)(?:$|[?#])/)||(o.pathname||"").match(/([^#?]+\.md)(?:$|[?#])/);if(l){let h=V(l[1]);h&&i.add(h);continue}const c=(a.textContent||"").trim(),u=(o.pathname||"").replace(/^.*\//,"");if(c&&he(c)===e||u&&he(u.replace(/\.(html?|md)$/i,""))===e)return o.toString();if(/\.(html?)$/i.test(o.pathname)){let h=o.pathname.replace(/^\//,"");i.add(h);continue}const d=o.pathname||"";if(d){const h=new URL(t),f=Gt(h.pathname);if(d.indexOf(f)!==-1){let p=d.startsWith(f)?d.slice(f.length):d;p=V(p),p&&i.add(p)}}}catch(o){k("[router] malformed URL while discovering index candidates",o)}}for(const a of i)try{if(!a||!String(a).includes(".md"))continue;const s=await dt(a,t,n);if(!s||!s.raw)continue;const o=(s.raw||"").match(/^#\s+(.+)$/m);if(o){const l=(o[1]||"").trim();if(l&&he(l)===e)return a}}catch(s){k("[router] fetchMarkdown during index discovery failed",s)}return null}function ro(e){const t=[];if(String(e).includes(".md")||String(e).includes(".html"))/index\.html$/i.test(e)||t.push(e);else try{const n=decodeURIComponent(String(e||""));if(K.has(n)){const i=sn(n)||K.get(n);i&&(/\.(md|html?)$/i.test(i)?/index\.html$/i.test(i)||t.push(i):(t.push(i),t.push(i+".html")))}else{if(tt&&tt.size)for(const i of tt){const r=i.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(he(r)===n&&!/index\.html$/i.test(i)){t.push(i);break}}!t.length&&n&&!/\.(md|html?)$/i.test(n)&&(t.push(n+".html"),t.push(n+".md"))}}catch(n){k("[router] buildPageCandidates failed during slug handling",n)}return t}async function io(e,t){const n=e||"";try{try{wi("fetchPageData")}catch{}try{_i("fetchPageData")}catch{}}catch{}try{if(kn&&typeof kn.abort=="function")try{kn.abort()}catch{}}catch{}kn=typeof AbortController<"u"?new AbortController:null;const i=kn;let r=null;try{const y=et(typeof location<"u"?location.href:"");y&&y.anchor&&(r=y.anchor)}catch{try{r=location&&location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null}catch{r=null}}let a=e||"",s=null;const o=String(n||"").includes(".md")||String(n||"").includes(".html");if(a&&String(a).includes("::")){const y=String(a).split("::",2);a=y[0],s=y[1]||null}const c=`${e}|||${typeof hs<"u"&&Pt?Pt:""}`,u=eo(c);if(u)a=u.resolved,s=u.anchor||s;else{if(!String(a).includes(".md")&&!String(a).includes(".html")){let y=decodeURIComponent(String(a||""));if(y&&typeof y=="string"&&(y=V(y),y=an(y)),K.has(y))a=sn(y)||K.get(y);else{let _=await no(y,t,i?i.signal:void 0);if(_)a=_;else if(Zt._refreshed&&tt&&tt.size||typeof t=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(t)){const w=await Wi(y,t);w&&(a=w)}}}to(c,{resolved:a,anchor:s})}let d=!0;try{const y=String(a||"").includes(".md")||String(a||"").includes(".html")||a&&(a.startsWith("http://")||a.startsWith("https://")||a.startsWith("/"));d=typeof le=="string"&&le||K.has(a)||tt&&tt.size||Zt._refreshed||o||y}catch{d=!0}!s&&r&&(s=r);try{if(d&&a&&(a.startsWith("http://")||a.startsWith("https://")||a.startsWith("/"))){const y=a.startsWith("/")?new URL(a,location.origin).toString():a;try{const _=await fetch(y,i?{signal:i.signal}:void 0);if(_&&_.ok){const w=await _.text(),A=_&&_.headers&&typeof _.headers.get=="function"&&_.headers.get("content-type")||"",S=(w||"").toLowerCase();if(A&&A.indexOf&&A.indexOf("text/html")!==-1||S.indexOf("<!doctype")!==-1||S.indexOf("<html")!==-1){if(!o)try{let q=y;try{q=new URL(y).pathname.replace(/^\//,"")}catch{q=String(y||"").replace(/^\//,"")}const Q=q.replace(/\.html$/i,".md");try{const R=await dt(Q,t,i?i.signal:void 0);if(R&&R.raw)return{data:R,pagePath:Q,anchor:s}}catch{}if(typeof le=="string"&&le)try{const R=await dt(le,t,i?i.signal:void 0);if(R&&R.raw){try{Vn(R.meta||{},le)}catch{}return{data:R,pagePath:le,anchor:s}}}catch{}try{b=new Error("site shell detected (absolute fetch)")}catch{}}catch{}if(S.indexOf('<div id="app"')!==-1||S.indexOf("nimbi-cms")!==-1||S.indexOf("nimbi-mount")!==-1||S.indexOf("nimbi-")!==-1||S.indexOf("initcms(")!==-1||S.indexOf("window.nimbi")!==-1||/\bnimbi\b/.test(S))try{let q=y;try{q=new URL(y).pathname.replace(/^\//,"")}catch{q=String(y||"").replace(/^\//,"")}const Q=q.replace(/\.html$/i,".md");try{const R=await dt(Q,t,i?i.signal:void 0);if(R&&R.raw)return{data:R,pagePath:Q,anchor:s}}catch{}if(typeof le=="string"&&le)try{const R=await dt(le,t,i?i.signal:void 0);if(R&&R.raw){try{Vn(R.meta||{},le)}catch{}return{data:R,pagePath:le,anchor:s}}}catch{}try{b=new Error("site shell detected (absolute fetch)")}catch{}}catch{}}}}catch{}}}catch{}const h=ro(a);try{if(ht())try{Rt("[router-debug] fetchPageData candidates",{originalRaw:n,resolved:a,pageCandidates:h})}catch{}}catch{}const f=String(n||"").includes(".md")||String(n||"").includes(".html");let p=null;if(!f)try{let y=decodeURIComponent(String(n||""));y=V(y),y=an(y),y&&!/\.(md|html?)$/i.test(y)&&(p=y)}catch{p=null}if(f&&h.length===0&&(String(a).includes(".md")||String(a).includes(".html"))&&h.push(a),h.length===0&&(String(a).includes(".md")||String(a).includes(".html"))&&h.push(a),h.length===1&&/index\.html$/i.test(h[0])&&!f&&!K.has(a)&&!K.has(decodeURIComponent(String(a||"")))&&!String(a||"").includes("/"))throw new Error("Unknown slug: index.html fallback prevented");let m=null,g=null,b=null;try{const y=String(a||"").includes(".md")||String(a||"").includes(".html")||a&&(a.startsWith("http://")||a.startsWith("https://")||a.startsWith("/"));d=typeof le=="string"&&le||K.has(a)||tt&&tt.size||Zt._refreshed||f||y}catch{d=!0}if(!d)b=new Error("no page data");else for(const y of h)if(y)try{const _=V(y);if(m=await dt(_,t,i?i.signal:void 0),g=_,p&&!K.has(p))try{let w="";if(m&&m.isHtml)try{const A=He();if(A){const S=A.parseFromString(m.raw||"","text/html"),M=S.querySelector("h1")||S.querySelector("title");M&&M.textContent&&(w=M.textContent.trim())}}catch{}else{const A=(m&&m.raw||"").match(/^#\s+(.+)$/m);A&&A[1]&&(w=A[1].trim())}if(w&&he(w)!==p)try{if(/\.html$/i.test(_)){const S=_.replace(/\.html$/i,".md");if(h.includes(S))try{const M=await dt(S,t,i?i.signal:void 0);if(M&&M.raw)m=M,g=S;else if(typeof le=="string"&&le)try{const I=await dt(le,t,i?i.signal:void 0);if(I&&I.raw)m=I,g=le;else{m=null,g=null,b=new Error("slug mismatch for candidate");continue}}catch{m=null,g=null,b=new Error("slug mismatch for candidate");continue}else{m=null,g=null,b=new Error("slug mismatch for candidate");continue}}catch{try{const I=await dt(le,t,i?i.signal:void 0);if(I&&I.raw)m=I,g=le;else{m=null,g=null,b=new Error("slug mismatch for candidate");continue}}catch{m=null,g=null,b=new Error("slug mismatch for candidate");continue}}else{m=null,g=null,b=new Error("slug mismatch for candidate");continue}}else{m=null,g=null,b=new Error("slug mismatch for candidate");continue}}catch{m=null,g=null,b=new Error("slug mismatch for candidate");continue}}catch{}try{if(!f&&/\.html$/i.test(_)){const w=_.replace(/\.html$/i,".md");if(h.includes(w))try{const S=String(m&&m.raw||"").trim().slice(0,128).toLowerCase();if(m&&m.isHtml||/^(?:<!doctype|<html|<title|<h1)/i.test(S)||S.indexOf('<div id="app"')!==-1||S.indexOf("nimbi-")!==-1||S.indexOf("nimbi")!==-1||S.indexOf("initcms(")!==-1){let I=!1;try{const q=await dt(w,t,i?i.signal:void 0);if(q&&q.raw)m=q,g=w,I=!0;else if(typeof le=="string"&&le)try{const Q=await dt(le,t,i?i.signal:void 0);Q&&Q.raw&&(m=Q,g=le,I=!0)}catch{}}catch{try{const Q=await dt(le,t,i?i.signal:void 0);Q&&Q.raw&&(m=Q,g=le,I=!0)}catch{}}if(!I){m=null,g=null,b=new Error("site shell detected (candidate HTML rejected)");continue}}}catch{}}}catch{}try{if(ht())try{Rt("[router-debug] fetchPageData accepted candidate",{candidate:_,pagePath:g,isHtml:m&&m.isHtml,snippet:m&&m.raw?String(m.raw).slice(0,160):null})}catch{}}catch{}break}catch(_){b=_;try{ht()&&k("[router] candidate fetch failed",{candidate:y,contentBase:t,err:_&&_.message||_})}catch{}}if(!m){const y=b&&(b.message||String(b))||null,_=y&&/failed to fetch md|site shell detected/i.test(y);try{if(ht())try{Rt("[router-debug] fetchPageData no data",{originalRaw:n,resolved:a,pageCandidates:h,fetchError:y})}catch{}}catch{}if(_)try{if(ht())try{k("[router] fetchPageData: no page data (expected)",{originalRaw:n,resolved:a,pageCandidates:h,contentBase:t,fetchError:y})}catch{}}catch{}else try{if(ht())try{On("[router] fetchPageData: no page data for",{originalRaw:n,resolved:a,pageCandidates:h,contentBase:t,fetchError:y})}catch{}}catch{}if(typeof le=="string"&&le)try{const w=await dt(le,t,i?i.signal:void 0);if(w&&w.raw){try{Vn(w.meta||{},le)}catch{}return{data:w,pagePath:le,anchor:s}}}catch{}try{if(f&&String(n||"").toLowerCase().includes(".html"))try{const w=new URL(String(n||""),location.href).toString();ht()&&k("[router] attempting absolute HTML fetch fallback",w);const A=await fetch(w,i?{signal:i.signal}:void 0);if(A&&A.ok){const S=await A.text(),M=A&&A.headers&&typeof A.headers.get=="function"&&A.headers.get("content-type")||"",I=(S||"").toLowerCase(),q=M&&M.indexOf&&M.indexOf("text/html")!==-1||I.indexOf("<!doctype")!==-1||I.indexOf("<html")!==-1;if(!q&&ht())try{k("[router] absolute fetch returned non-HTML",()=>({abs:w,contentType:M,snippet:I.slice(0,200)}))}catch{}if(q){const Q=(S||"").toLowerCase();if(/<title>\s*index of\b/i.test(S)||/<h1>\s*index of\b/i.test(S)||Q.indexOf("parent directory")!==-1||/<title>\s*directory listing/i.test(S)||/<h1>\s*directory listing/i.test(S))try{ht()&&k("[router] absolute fetch returned directory listing; treating as not found",{abs:w})}catch{}else try{const O=w,G=new URL(".",O).toString();try{const D=He();if(D){const L=D.parseFromString(S||"","text/html"),H=(ee,$e)=>{try{const ke=$e.getAttribute(ee)||"";if(!ke||/^(https?:)?\/\//i.test(ke)||ke.startsWith("/")||ke.startsWith("#"))return;try{const xe=new URL(ke,O).toString();$e.setAttribute(ee,xe)}catch(xe){k("[router] rewrite attribute failed",ee,xe)}}catch(ke){k("[router] rewrite helper failed",ke)}},W=L.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"),ie=[];for(const ee of Array.from(W||[]))try{const $e=ee.tagName?ee.tagName.toLowerCase():"";if($e==="a")continue;if(ee.hasAttribute("src")){const ke=ee.getAttribute("src");H("src",ee);const xe=ee.getAttribute("src");ke!==xe&&ie.push({attr:"src",tag:$e,before:ke,after:xe})}if(ee.hasAttribute("href")&&$e==="link"){const ke=ee.getAttribute("href");H("href",ee);const xe=ee.getAttribute("href");ke!==xe&&ie.push({attr:"href",tag:$e,before:ke,after:xe})}if(ee.hasAttribute("href")&&$e!=="link"){const ke=ee.getAttribute("href");H("href",ee);const xe=ee.getAttribute("href");ke!==xe&&ie.push({attr:"href",tag:$e,before:ke,after:xe})}if(ee.hasAttribute("xlink:href")){const ke=ee.getAttribute("xlink:href");H("xlink:href",ee);const xe=ee.getAttribute("xlink:href");ke!==xe&&ie.push({attr:"xlink:href",tag:$e,before:ke,after:xe})}if(ee.hasAttribute("poster")){const ke=ee.getAttribute("poster");H("poster",ee);const xe=ee.getAttribute("poster");ke!==xe&&ie.push({attr:"poster",tag:$e,before:ke,after:xe})}if(ee.hasAttribute("srcset")){const Ce=(ee.getAttribute("srcset")||"").split(",").map(Fe=>Fe.trim()).filter(Boolean).map(Fe=>{const[T,$]=Fe.split(/\s+/,2);if(!T||/^(https?:)?\/\//i.test(T)||T.startsWith("/"))return Fe;try{const E=new URL(T,O).toString();return $?`${E} ${$}`:E}catch{return Fe}}).join(", ");ee.setAttribute("srcset",Ce)}}catch{}const ye=L.documentElement&&L.documentElement.outerHTML?L.documentElement.outerHTML:S;try{ht()&&ie&&ie.length&&k("[router] rewritten asset refs",{abs:w,rewritten:ie})}catch{}return{data:{raw:ye,isHtml:!0},pagePath:String(n||""),anchor:s}}}catch{}let re=S;return/<base\s+[^>]*>/i.test(S)||(/<head[^>]*>/i.test(S)?re=S.replace(/(<head[^>]*>)/i,`$1<base href="${G}">`):re=`<base href="${G}">`+S),{data:{raw:re,isHtml:!0},pagePath:String(n||""),anchor:s}}catch{return{data:{raw:S,isHtml:!0},pagePath:String(n||""),anchor:s}}}}}catch(w){ht()&&k("[router] absolute HTML fetch fallback failed",w)}}catch{}try{const w=decodeURIComponent(String(a||""));if(w&&!/\.(md|html?)$/i.test(w)&&typeof le=="string"&&le&&ht()){const S=[`/assets/${w}.html`,`/assets/${w}/index.html`];for(const M of S)try{const I=await fetch(M,Object.assign({method:"GET"},i?{signal:i.signal}:{}));if(I&&I.ok)return{data:{raw:await I.text(),isHtml:!0},pagePath:M.replace(/^\//,""),anchor:s}}catch{}}}catch(w){ht()&&k("[router] assets fallback failed",w)}throw new Error("no page data")}return{data:m,pagePath:g,anchor:s}}function Yn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var jt=Yn();function Yi(e){jt=e}var Kt={exec:()=>null};function Le(e,t=""){let n=typeof e=="string"?e:e.source,i={replace:(r,a)=>{let s=typeof a=="string"?a:a.source;return s=s.replace(lt.caret,"$1"),n=n.replace(r,s),i},getRegex:()=>new RegExp(n,t)};return i}var ao=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),lt={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}>`)},so=/^(?:[ \t]*(?:\n|$))+/,oo=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,lo=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,xn=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,co=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Or=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Ji=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,ea=Le(Ji).replace(/bull/g,Or).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),uo=Le(Ji).replace(/bull/g,Or).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),jr=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,ho=/^[^\n]+/,qr=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,fo=Le(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",qr).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),go=Le(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,Or).getRegex(),Jn="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Hr=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,po=Le("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Hr).replace("tag",Jn).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),ta=Le(jr).replace("hr",xn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Jn).getRegex(),mo=Le(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",ta).getRegex(),Fr={blockquote:mo,code:oo,def:fo,fences:lo,heading:co,hr:xn,html:po,lheading:ea,list:go,newline:so,paragraph:ta,table:Kt,text:ho},na=Le("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",xn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Jn).getRegex(),yo={...Fr,lheading:uo,table:na,paragraph:Le(jr).replace("hr",xn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",na).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Jn).getRegex()},bo={...Fr,html:Le(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Hr).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Kt,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:Le(jr).replace("hr",xn).replace("heading",` *#{1,6} *[^
]`).replace("lheading",ea).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},wo=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,_o=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,ra=/^( {2,}|\\)\n(?!\s*$)/,ko=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,er=/[\p{P}\p{S}]/u,Dr=/[\s\p{P}\p{S}]/u,ia=/[^\s\p{P}\p{S}]/u,xo=Le(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Dr).getRegex(),aa=/(?!~)[\p{P}\p{S}]/u,So=/(?!~)[\s\p{P}\p{S}]/u,vo=/(?:[^\s\p{P}\p{S}]|~)/u,sa=/(?![*_])[\p{P}\p{S}]/u,Ao=/(?![*_])[\s\p{P}\p{S}]/u,Eo=/(?:[^\s\p{P}\p{S}]|[*_])/u,Co=Le(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",ao?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),oa=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Mo=Le(oa,"u").replace(/punct/g,er).getRegex(),Lo=Le(oa,"u").replace(/punct/g,aa).getRegex(),la="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",To=Le(la,"gu").replace(/notPunctSpace/g,ia).replace(/punctSpace/g,Dr).replace(/punct/g,er).getRegex(),Ro=Le(la,"gu").replace(/notPunctSpace/g,vo).replace(/punctSpace/g,So).replace(/punct/g,aa).getRegex(),zo=Le("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,ia).replace(/punctSpace/g,Dr).replace(/punct/g,er).getRegex(),Po=Le(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,sa).getRegex(),$o="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Io=Le($o,"gu").replace(/notPunctSpace/g,Eo).replace(/punctSpace/g,Ao).replace(/punct/g,sa).getRegex(),No=Le(/\\(punct)/,"gu").replace(/punct/g,er).getRegex(),Bo=Le(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Oo=Le(Hr).replace("(?:-->|$)","-->").getRegex(),jo=Le("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Oo).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),tr=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,qo=Le(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",tr).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),ca=Le(/^!?\[(label)\]\[(ref)\]/).replace("label",tr).replace("ref",qr).getRegex(),ua=Le(/^!?\[(ref)\](?:\[\])?/).replace("ref",qr).getRegex(),Ho=Le("reflink|nolink(?!\\()","g").replace("reflink",ca).replace("nolink",ua).getRegex(),ha=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Ur={_backpedal:Kt,anyPunctuation:No,autolink:Bo,blockSkip:Co,br:ra,code:_o,del:Kt,delLDelim:Kt,delRDelim:Kt,emStrongLDelim:Mo,emStrongRDelimAst:To,emStrongRDelimUnd:zo,escape:wo,link:qo,nolink:ua,punctuation:xo,reflink:ca,reflinkSearch:Ho,tag:jo,text:ko,url:Kt},Fo={...Ur,link:Le(/^!?\[(label)\]\((.*?)\)/).replace("label",tr).getRegex(),reflink:Le(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",tr).getRegex()},Wr={...Ur,emStrongRDelimAst:Ro,emStrongLDelim:Lo,delLDelim:Po,delRDelim:Io,url:Le(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",ha).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:Le(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",ha).getRegex()},Do={...Wr,br:Le(ra).replace("{2,}","*").getRegex(),text:Le(Wr.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},nr={normal:Fr,gfm:yo,pedantic:bo},Sn={normal:Ur,gfm:Wr,breaks:Do,pedantic:Fo},Uo={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},da=e=>Uo[e];function _t(e,t){if(t){if(lt.escapeTest.test(e))return e.replace(lt.escapeReplace,da)}else if(lt.escapeTestNoEncode.test(e))return e.replace(lt.escapeReplaceNoEncode,da);return e}function fa(e){try{e=encodeURI(e).replace(lt.percentDecode,"%")}catch{return null}return e}function ga(e,t){let n=e.replace(lt.findPipe,(a,s,o)=>{let l=!1,c=s;for(;--c>=0&&o[c]==="\\";)l=!l;return l?"|":" |"}),i=n.split(lt.splitPipe),r=0;if(i[0].trim()||i.shift(),i.length>0&&!i.at(-1)?.trim()&&i.pop(),t)if(i.length>t)i.splice(t);else for(;i.length<t;)i.push("");for(;r<i.length;r++)i[r]=i[r].trim().replace(lt.slashPipe,"|");return i}function vn(e,t,n){let i=e.length;if(i===0)return"";let r=0;for(;r<i&&e.charAt(i-r-1)===t;)r++;return e.slice(0,i-r)}function Wo(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let i=0;i<e.length;i++)if(e[i]==="\\")i++;else if(e[i]===t[0])n++;else if(e[i]===t[1]&&(n--,n<0))return i;return n>0?-2:-1}function Zo(e,t=0){let n=t,i="";for(let r of e)if(r==="	"){let a=4-n%4;i+=" ".repeat(a),n+=a}else i+=r,n++;return i}function pa(e,t,n,i,r){let a=t.href,s=t.title||null,o=e[1].replace(r.other.outputLinkReplace,"$1");i.state.inLink=!0;let l={type:e[0].charAt(0)==="!"?"image":"link",raw:n,href:a,title:s,text:o,tokens:i.inlineTokens(o)};return i.state.inLink=!1,l}function Go(e,t,n){let i=e.match(n.other.indentCodeCompensation);if(i===null)return t;let r=i[1];return t.split(`
`).map(a=>{let s=a.match(n.other.beginningSpace);if(s===null)return a;let[o]=s;return o.length>=r.length?a.slice(r.length):a}).join(`
`)}var An=class{options;rules;lexer;constructor(e){this.options=e||jt}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:vn(n,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],i=Go(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:i}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let i=vn(n,"#");(this.options.pedantic||!i||this.rules.other.endingSpaceChar.test(i))&&(n=i.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:vn(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=vn(t[0],`
`).split(`
`),i="",r="",a=[];for(;n.length>0;){let s=!1,o=[],l;for(l=0;l<n.length;l++)if(this.rules.other.blockquoteStart.test(n[l]))o.push(n[l]),s=!0;else if(!s)o.push(n[l]);else break;n=n.slice(l);let c=o.join(`
`),u=c.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");i=i?`${i}
${c}`:c,r=r?`${r}
${u}`:u;let d=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(u,a,!0),this.lexer.state.top=d,n.length===0)break;let h=a.at(-1);if(h?.type==="code")break;if(h?.type==="blockquote"){let f=h,p=f.raw+`
`+n.join(`
`),m=this.blockquote(p);a[a.length-1]=m,i=i.substring(0,i.length-f.raw.length)+m.raw,r=r.substring(0,r.length-f.text.length)+m.text;break}else if(h?.type==="list"){let f=h,p=f.raw+`
`+n.join(`
`),m=this.list(p);a[a.length-1]=m,i=i.substring(0,i.length-h.raw.length)+m.raw,r=r.substring(0,r.length-f.raw.length)+m.raw,n=p.substring(a.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:i,tokens:a,text:r}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),i=n.length>1,r={type:"list",raw:"",ordered:i,start:i?+n.slice(0,-1):"",loose:!1,items:[]};n=i?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=i?n:"[*+-]");let a=this.rules.other.listItemRegex(n),s=!1;for(;e;){let l=!1,c="",u="";if(!(t=a.exec(e))||this.rules.block.hr.test(e))break;c=t[0],e=e.substring(c.length);let d=Zo(t[2].split(`
`,1)[0],t[1].length),h=e.split(`
`,1)[0],f=!d.trim(),p=0;if(this.options.pedantic?(p=2,u=d.trimStart()):f?p=t[1].length+1:(p=d.search(this.rules.other.nonSpaceChar),p=p>4?1:p,u=d.slice(p),p+=t[1].length),f&&this.rules.other.blankLine.test(h)&&(c+=h+`
`,e=e.substring(h.length+1),l=!0),!l){let m=this.rules.other.nextBulletRegex(p),g=this.rules.other.hrRegex(p),b=this.rules.other.fencesBeginRegex(p),y=this.rules.other.headingBeginRegex(p),_=this.rules.other.htmlBeginRegex(p),w=this.rules.other.blockquoteBeginRegex(p);for(;e;){let A=e.split(`
`,1)[0],S;if(h=A,this.options.pedantic?(h=h.replace(this.rules.other.listReplaceNesting,"  "),S=h):S=h.replace(this.rules.other.tabCharGlobal,"    "),b.test(h)||y.test(h)||_.test(h)||w.test(h)||m.test(h)||g.test(h))break;if(S.search(this.rules.other.nonSpaceChar)>=p||!h.trim())u+=`
`+S.slice(p);else{if(f||d.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||b.test(d)||y.test(d)||g.test(d))break;u+=`
`+h}f=!h.trim(),c+=A+`
`,e=e.substring(A.length+1),d=S.slice(p)}}r.loose||(s?r.loose=!0:this.rules.other.doubleBlankLine.test(c)&&(s=!0)),r.items.push({type:"list_item",raw:c,task:!!this.options.gfm&&this.rules.other.listIsTask.test(u),loose:!1,text:u,tokens:[]}),r.raw+=c}let o=r.items.at(-1);if(o)o.raw=o.raw.trimEnd(),o.text=o.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let l of r.items){if(this.lexer.state.top=!1,l.tokens=this.lexer.blockTokens(l.text,[]),l.task){if(l.text=l.text.replace(this.rules.other.listReplaceTask,""),l.tokens[0]?.type==="text"||l.tokens[0]?.type==="paragraph"){l.tokens[0].raw=l.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),l.tokens[0].text=l.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let u=this.lexer.inlineQueue.length-1;u>=0;u--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[u].src)){this.lexer.inlineQueue[u].src=this.lexer.inlineQueue[u].src.replace(this.rules.other.listReplaceTask,"");break}}let c=this.rules.other.listTaskCheckbox.exec(l.raw);if(c){let u={type:"checkbox",raw:c[0]+" ",checked:c[0]!=="[ ]"};l.checked=u.checked,r.loose?l.tokens[0]&&["paragraph","text"].includes(l.tokens[0].type)&&"tokens"in l.tokens[0]&&l.tokens[0].tokens?(l.tokens[0].raw=u.raw+l.tokens[0].raw,l.tokens[0].text=u.raw+l.tokens[0].text,l.tokens[0].tokens.unshift(u)):l.tokens.unshift({type:"paragraph",raw:u.raw,text:u.raw,tokens:[u]}):l.tokens.unshift(u)}}if(!r.loose){let c=l.tokens.filter(d=>d.type==="space"),u=c.length>0&&c.some(d=>this.rules.other.anyLine.test(d.raw));r.loose=u}}if(r.loose)for(let l of r.items){l.loose=!0;for(let c of l.tokens)c.type==="text"&&(c.type="paragraph")}return r}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),i=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:i,title:r}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=ga(t[1]),i=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],a={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===i.length){for(let s of i)this.rules.other.tableAlignRight.test(s)?a.align.push("right"):this.rules.other.tableAlignCenter.test(s)?a.align.push("center"):this.rules.other.tableAlignLeft.test(s)?a.align.push("left"):a.align.push(null);for(let s=0;s<n.length;s++)a.header.push({text:n[s],tokens:this.lexer.inline(n[s]),header:!0,align:a.align[s]});for(let s of r)a.rows.push(ga(s,a.header.length).map((o,l)=>({text:o,tokens:this.lexer.inline(o),header:!1,align:a.align[l]})));return a}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let a=vn(n.slice(0,-1),"\\");if((n.length-a.length)%2===0)return}else{let a=Wo(t[2],"()");if(a===-2)return;if(a>-1){let s=(t[0].indexOf("!")===0?5:4)+t[1].length+a;t[2]=t[2].substring(0,a),t[0]=t[0].substring(0,s).trim(),t[3]=""}}let i=t[2],r="";if(this.options.pedantic){let a=this.rules.other.pedanticHrefTitle.exec(i);a&&(i=a[1],r=a[3])}else r=t[3]?t[3].slice(1,-1):"";return i=i.trim(),this.rules.other.startAngleBracket.test(i)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?i=i.slice(1):i=i.slice(1,-1)),pa(t,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let i=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=t[i.toLowerCase()];if(!r){let a=n[0].charAt(0);return{type:"text",raw:a,text:a}}return pa(n,r,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let i=this.rules.inline.emStrongLDelim.exec(e);if(!(!i||i[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(i[1]||i[2])||!n||this.rules.inline.punctuation.exec(n))){let r=[...i[0]].length-1,a,s,o=r,l=0,c=i[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(c.lastIndex=0,t=t.slice(-1*e.length+r);(i=c.exec(t))!=null;){if(a=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!a)continue;if(s=[...a].length,i[3]||i[4]){o+=s;continue}else if((i[5]||i[6])&&r%3&&!((r+s)%3)){l+=s;continue}if(o-=s,o>0)continue;s=Math.min(s,s+o+l);let u=[...i[0]][0].length,d=e.slice(0,r+i.index+u+s);if(Math.min(r,s)%2){let f=d.slice(1,-1);return{type:"em",raw:d,text:f,tokens:this.lexer.inlineTokens(f)}}let h=d.slice(2,-2);return{type:"strong",raw:d,text:h,tokens:this.lexer.inlineTokens(h)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),i=this.rules.other.nonSpaceChar.test(n),r=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return i&&r&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,n=""){let i=this.rules.inline.delLDelim.exec(e);if(i&&(!i[1]||!n||this.rules.inline.punctuation.exec(n))){let r=[...i[0]].length-1,a,s,o=r,l=this.rules.inline.delRDelim;for(l.lastIndex=0,t=t.slice(-1*e.length+r);(i=l.exec(t))!=null;){if(a=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!a||(s=[...a].length,s!==r))continue;if(i[3]||i[4]){o+=s;continue}if(o-=s,o>0)continue;s=Math.min(s,s+o);let c=[...i[0]][0].length,u=e.slice(0,r+i.index+c+s),d=u.slice(r,-r);return{type:"del",raw:u,text:d,tokens:this.lexer.inlineTokens(d)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,i;return t[2]==="@"?(n=t[1],i="mailto:"+n):(n=t[1],i=n),{type:"link",raw:t[0],text:n,href:i,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,i;if(t[2]==="@")n=t[0],i="mailto:"+n;else{let r;do r=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(r!==t[0]);n=t[0],t[1]==="www."?i="http://"+t[0]:i=t[0]}return{type:"link",raw:t[0],text:n,href:i,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}},mt=class pi{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||jt,this.options.tokenizer=this.options.tokenizer||new An,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:lt,block:nr.normal,inline:Sn.normal};this.options.pedantic?(n.block=nr.pedantic,n.inline=Sn.pedantic):this.options.gfm&&(n.block=nr.gfm,this.options.breaks?n.inline=Sn.breaks:n.inline=Sn.gfm),this.tokenizer.rules=n}static get rules(){return{block:nr,inline:Sn}}static lex(t,n){return new pi(n).lex(t)}static lexInline(t,n){return new pi(n).inlineTokens(t)}lex(t){t=t.replace(lt.carriageReturn,`
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
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):n.push(r);continue}if(t){let s="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(s);break}else throw new Error(s)}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}inlineTokens(t,n=[]){let i=t,r=null;if(this.tokens.links){let l=Object.keys(this.tokens.links);if(l.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(i))!=null;)l.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(i=i.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(i))!=null;)i=i.slice(0,r.index)+"++"+i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let a;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(i))!=null;)a=r[2]?r[2].length:0,i=i.slice(0,r.index+a)+"["+"a".repeat(r[0].length-a-2)+"]"+i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);i=this.options.hooks?.emStrongMask?.call({lexer:this},i)??i;let s=!1,o="";for(;t;){s||(o=""),s=!1;let l;if(this.options.extensions?.inline?.some(u=>(l=u.call({lexer:this},t,n))?(t=t.substring(l.raw.length),n.push(l),!0):!1))continue;if(l=this.tokenizer.escape(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.tag(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.link(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(l.raw.length);let u=n.at(-1);l.type==="text"&&u?.type==="text"?(u.raw+=l.raw,u.text+=l.text):n.push(l);continue}if(l=this.tokenizer.emStrong(t,i,o)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.codespan(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.br(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.del(t,i,o)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.autolink(t)){t=t.substring(l.raw.length),n.push(l);continue}if(!this.state.inLink&&(l=this.tokenizer.url(t))){t=t.substring(l.raw.length),n.push(l);continue}let c=t;if(this.options.extensions?.startInline){let u=1/0,d=t.slice(1),h;this.options.extensions.startInline.forEach(f=>{h=f.call({lexer:this},d),typeof h=="number"&&h>=0&&(u=Math.min(u,h))}),u<1/0&&u>=0&&(c=t.substring(0,u+1))}if(l=this.tokenizer.inlineText(c)){t=t.substring(l.raw.length),l.raw.slice(-1)!=="_"&&(o=l.raw.slice(-1)),s=!0;let u=n.at(-1);u?.type==="text"?(u.raw+=l.raw,u.text+=l.text):n.push(l);continue}if(t){let u="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(u);break}else throw new Error(u)}}return n}},En=class{options;parser;constructor(e){this.options=e||jt}space(e){return""}code({text:e,lang:t,escaped:n}){let i=(t||"").match(lt.notSpaceStart)?.[0],r=e.replace(lt.endingNewline,"")+`
`;return i?'<pre><code class="language-'+_t(i)+'">'+(n?r:_t(r,!0))+`</code></pre>
`:"<pre><code>"+(n?r:_t(r,!0))+`</code></pre>
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
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${_t(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let i=this.parser.parseInline(n),r=fa(e);if(r===null)return i;e=r;let a='<a href="'+e+'"';return t&&(a+=' title="'+_t(t)+'"'),a+=">"+i+"</a>",a}image({href:e,title:t,text:n,tokens:i}){i&&(n=this.parser.parseInline(i,this.parser.textRenderer));let r=fa(e);if(r===null)return _t(n);e=r;let a=`<img src="${e}" alt="${_t(n)}"`;return t&&(a+=` title="${_t(t)}"`),a+=">",a}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:_t(e.text)}},rr=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},yt=class mi{options;renderer;textRenderer;constructor(t){this.options=t||jt,this.options.renderer=this.options.renderer||new En,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new rr}static parse(t,n){return new mi(n).parse(t)}static parseInline(t,n){return new mi(n).parseInline(t)}parse(t){let n="";for(let i=0;i<t.length;i++){let r=t[i];if(this.options.extensions?.renderers?.[r.type]){let s=r,o=this.options.extensions.renderers[s.type].call({parser:this},s);if(o!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(s.type)){n+=o||"";continue}}let a=r;switch(a.type){case"space":{n+=this.renderer.space(a);break}case"hr":{n+=this.renderer.hr(a);break}case"heading":{n+=this.renderer.heading(a);break}case"code":{n+=this.renderer.code(a);break}case"table":{n+=this.renderer.table(a);break}case"blockquote":{n+=this.renderer.blockquote(a);break}case"list":{n+=this.renderer.list(a);break}case"checkbox":{n+=this.renderer.checkbox(a);break}case"html":{n+=this.renderer.html(a);break}case"def":{n+=this.renderer.def(a);break}case"paragraph":{n+=this.renderer.paragraph(a);break}case"text":{n+=this.renderer.text(a);break}default:{let s='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(s),"";throw new Error(s)}}}return n}parseInline(t,n=this.renderer){let i="";for(let r=0;r<t.length;r++){let a=t[r];if(this.options.extensions?.renderers?.[a.type]){let o=this.options.extensions.renderers[a.type].call({parser:this},a);if(o!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(a.type)){i+=o||"";continue}}let s=a;switch(s.type){case"escape":{i+=n.text(s);break}case"html":{i+=n.html(s);break}case"link":{i+=n.link(s);break}case"image":{i+=n.image(s);break}case"checkbox":{i+=n.checkbox(s);break}case"strong":{i+=n.strong(s);break}case"em":{i+=n.em(s);break}case"codespan":{i+=n.codespan(s);break}case"br":{i+=n.br(s);break}case"del":{i+=n.del(s);break}case"text":{i+=n.text(s);break}default:{let o='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return i}},on=class{options;block;constructor(e){this.options=e||jt}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(){return this.block?mt.lex:mt.lexInline}provideParser(){return this.block?yt.parse:yt.parseInline}},ma=class{defaults=Yn();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=yt;Renderer=En;TextRenderer=rr;Lexer=mt;Tokenizer=An;Hooks=on;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let i of e)switch(n=n.concat(t.call(this,i)),i.type){case"table":{let r=i;for(let a of r.header)n=n.concat(this.walkTokens(a.tokens,t));for(let a of r.rows)for(let s of a)n=n.concat(this.walkTokens(s.tokens,t));break}case"list":{let r=i;n=n.concat(this.walkTokens(r.items,t));break}default:{let r=i;this.defaults.extensions?.childTokens?.[r.type]?this.defaults.extensions.childTokens[r.type].forEach(a=>{let s=r[a].flat(1/0);n=n.concat(this.walkTokens(s,t))}):r.tokens&&(n=n.concat(this.walkTokens(r.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let i={...n};if(i.async=this.defaults.async||i.async||!1,n.extensions&&(n.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){let a=t.renderers[r.name];a?t.renderers[r.name]=function(...s){let o=r.renderer.apply(this,s);return o===!1&&(o=a.apply(this,s)),o}:t.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let a=t[r.level];a?a.unshift(r.tokenizer):t[r.level]=[r.tokenizer],r.start&&(r.level==="block"?t.startBlock?t.startBlock.push(r.start):t.startBlock=[r.start]:r.level==="inline"&&(t.startInline?t.startInline.push(r.start):t.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(t.childTokens[r.name]=r.childTokens)}),i.extensions=t),n.renderer){let r=this.defaults.renderer||new En(this.defaults);for(let a in n.renderer){if(!(a in r))throw new Error(`renderer '${a}' does not exist`);if(["options","parser"].includes(a))continue;let s=a,o=n.renderer[s],l=r[s];r[s]=(...c)=>{let u=o.apply(r,c);return u===!1&&(u=l.apply(r,c)),u||""}}i.renderer=r}if(n.tokenizer){let r=this.defaults.tokenizer||new An(this.defaults);for(let a in n.tokenizer){if(!(a in r))throw new Error(`tokenizer '${a}' does not exist`);if(["options","rules","lexer"].includes(a))continue;let s=a,o=n.tokenizer[s],l=r[s];r[s]=(...c)=>{let u=o.apply(r,c);return u===!1&&(u=l.apply(r,c)),u}}i.tokenizer=r}if(n.hooks){let r=this.defaults.hooks||new on;for(let a in n.hooks){if(!(a in r))throw new Error(`hook '${a}' does not exist`);if(["options","block"].includes(a))continue;let s=a,o=n.hooks[s],l=r[s];on.passThroughHooks.has(a)?r[s]=c=>{if(this.defaults.async&&on.passThroughHooksRespectAsync.has(a))return(async()=>{let d=await o.call(r,c);return l.call(r,d)})();let u=o.call(r,c);return l.call(r,u)}:r[s]=(...c)=>{if(this.defaults.async)return(async()=>{let d=await o.apply(r,c);return d===!1&&(d=await l.apply(r,c)),d})();let u=o.apply(r,c);return u===!1&&(u=l.apply(r,c)),u}}i.hooks=r}if(n.walkTokens){let r=this.defaults.walkTokens,a=n.walkTokens;i.walkTokens=function(s){let o=[];return o.push(a.call(this,s)),r&&(o=o.concat(r.call(this,s))),o}}this.defaults={...this.defaults,...i}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return mt.lex(e,t??this.defaults)}parser(e,t){return yt.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let i={...n},r={...this.defaults,...i},a=this.onError(!!r.silent,!!r.async);if(this.defaults.async===!0&&i.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(r.hooks&&(r.hooks.options=r,r.hooks.block=e),r.async)return(async()=>{let s=r.hooks?await r.hooks.preprocess(t):t,o=await(r.hooks?await r.hooks.provideLexer():e?mt.lex:mt.lexInline)(s,r),l=r.hooks?await r.hooks.processAllTokens(o):o;r.walkTokens&&await Promise.all(this.walkTokens(l,r.walkTokens));let c=await(r.hooks?await r.hooks.provideParser():e?yt.parse:yt.parseInline)(l,r);return r.hooks?await r.hooks.postprocess(c):c})().catch(a);try{r.hooks&&(t=r.hooks.preprocess(t));let s=(r.hooks?r.hooks.provideLexer():e?mt.lex:mt.lexInline)(t,r);r.hooks&&(s=r.hooks.processAllTokens(s)),r.walkTokens&&this.walkTokens(s,r.walkTokens);let o=(r.hooks?r.hooks.provideParser():e?yt.parse:yt.parseInline)(s,r);return r.hooks&&(o=r.hooks.postprocess(o)),o}catch(s){return a(s)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let i="<p>An error occurred:</p><pre>"+_t(n.message+"",!0)+"</pre>";return t?Promise.resolve(i):i}if(t)return Promise.reject(n);throw n}}},Vt=new ma;function Ee(e,t){return Vt.parse(e,t)}Ee.options=Ee.setOptions=function(e){return Vt.setOptions(e),Ee.defaults=Vt.defaults,Yi(Ee.defaults),Ee},Ee.getDefaults=Yn,Ee.defaults=jt,Ee.use=function(...e){return Vt.use(...e),Ee.defaults=Vt.defaults,Yi(Ee.defaults),Ee},Ee.walkTokens=function(e,t){return Vt.walkTokens(e,t)},Ee.parseInline=Vt.parseInline,Ee.Parser=yt,Ee.parser=yt.parse,Ee.Renderer=En,Ee.TextRenderer=rr,Ee.Lexer=mt,Ee.lexer=mt.lex,Ee.Tokenizer=An,Ee.Hooks=on,Ee.parse=Ee;var Xo=Ee.options,Qo=Ee.setOptions,Ko=Ee.use,Vo=Ee.walkTokens,Yo=Ee.parseInline,Jo=Ee,el=yt.parse,tl=mt.lex;const ya=Object.freeze(Object.defineProperty({__proto__:null,Hooks:on,Lexer:mt,Marked:ma,Parser:yt,Renderer:En,TextRenderer:rr,Tokenizer:An,get defaults(){return jt},getDefaults:Yn,lexer:tl,marked:Ee,options:Xo,parse:Jo,parseInline:Yo,parser:el,setOptions:Qo,use:Ko,walkTokens:Vo},Symbol.toStringTag,{value:"Module"})),nl=`/**
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
`,ba=`function H() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var $ = H();
function ue(s) {
  $ = s;
}
var z = { exec: () => null };
function f(s, e = "") {
  let r = typeof s == "string" ? s : s.source, n = { replace: (t, l) => {
    let i = typeof l == "string" ? l : l.source;
    return i = i.replace(m.caret, "$1"), r = r.replace(t, i), n;
  }, getRegex: () => new RegExp(r, e) };
  return n;
}
var Pe = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), m = { codeRemoveIndent: /^(?: {1,4}| {0,3}\\t)/gm, outputLinkReplace: /\\\\([\\[\\]])/g, indentCodeCompensation: /^(\\s+)(?:\`\`\`)/, beginningSpace: /^\\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\\n/g, tabCharGlobal: /\\t/g, multipleSpaceGlobal: /\\s+/g, blankLine: /^[ \\t]*$/, doubleBlankLine: /\\n[ \\t]*\\n[ \\t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\\n {0,3}((?:=+|-+) *)(?=\\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \\t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\\[[ xX]\\] +\\S/, listReplaceTask: /^\\[[ xX]\\] +/, listTaskCheckbox: /\\[[ xX]\\]/, anyLine: /\\n.*\\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\\||\\| *$/g, tableRowBlankLine: /\\n[ \\t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\\s|>)/i, endPreScriptTag: /^<\\/(pre|code|kbd|script)(\\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\\s])\\s+(['"])(.*)\\2/, unicodeAlphaNumeric: /[\\p{L}\\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\\w+);)/g, caret: /(^|[^\\[])\\^/g, percentDecode: /%25/g, findPipe: /\\|/g, splitPipe: / \\|/, slashPipe: /\\\\\\|/g, carriageReturn: /\\r\\n|\\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\\S*/, endingNewline: /\\n$/, listItemRegex: (s) => new RegExp(\`^( {0,3}\${s})((?:[	 ][^\\\\n]*)?(?:\\\\n|$))\`), nextBulletRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}(?:[*+-]|\\\\d{1,9}[.)])((?:[ 	][^\\\\n]*)?(?:\\\\n|$))\`), hrRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\\\* *){3,})(?:\\\\n+|$)\`), fencesBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}(?:\\\`\\\`\\\`|~~~)\`), headingBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}#\`), htmlBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}<(?:[a-z].*>|!--)\`, "i"), blockquoteBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}>\`) }, Ee = /^(?:[ \\t]*(?:\\n|$))+/, Le = /^((?: {4}| {0,3}\\t)[^\\n]+(?:\\n(?:[ \\t]*(?:\\n|$))*)?)+/, Ce = /^ {0,3}(\`{3,}(?=[^\`\\n]*(?:\\n|$))|~{3,})([^\\n]*)(?:\\n|$)(?:|([\\s\\S]*?)(?:\\n|$))(?: {0,3}\\1[~\`]* *(?=\\n|$)|$)/, q = /^ {0,3}((?:-[\\t ]*){3,}|(?:_[ \\t]*){3,}|(?:\\*[ \\t]*){3,})(?:\\n+|$)/, Ie = /^ {0,3}(#{1,6})(?=\\s|$)(.*)(?:\\n+|$)/, K = / {0,3}(?:[*+-]|\\d{1,9}[.)])/, ge = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\\n(?!\\s*?\\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/, fe = f(ge).replace(/bull/g, K).replace(/blockCode/g, /(?: {4}| {0,3}\\t)/).replace(/fences/g, / {0,3}(?:\`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\\n>]+>\\n/).replace(/\\|table/g, "").getRegex(), Me = f(ge).replace(/bull/g, K).replace(/blockCode/g, /(?: {4}| {0,3}\\t)/).replace(/fences/g, / {0,3}(?:\`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\\n>]+>\\n/).replace(/table/g, / {0,3}\\|?(?:[:\\- ]*\\|)+[\\:\\- ]*\\n/).getRegex(), U = /^([^\\n]+(?:\\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\\n)[^\\n]+)*)/, Be = /^[^\\n]+/, J = /(?!\\s*\\])(?:\\\\[\\s\\S]|[^\\[\\]\\\\])+/, qe = f(/^ {0,3}\\[(label)\\]: *(?:\\n[ \\t]*)?([^<\\s][^\\s]*|<.*?>)(?:(?: +(?:\\n[ \\t]*)?| *\\n[ \\t]*)(title))? *(?:\\n+|$)/).replace("label", J).replace("title", /(?:"(?:\\\\"?|[^"\\\\])*"|'[^'\\n]*(?:\\n[^'\\n]+)*\\n?'|\\([^()]*\\))/).getRegex(), De = f(/^(bull)([ \\t][^\\n]+?)?(?:\\n|$)/).replace(/bull/g, K).getRegex(), N = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", V = /<!--(?:-?>|[\\s\\S]*?(?:-->|$))/, Ze = f("^ {0,3}(?:<(script|pre|style|textarea)[\\\\s>][\\\\s\\\\S]*?(?:</\\\\1>[^\\\\n]*\\\\n+|$)|comment[^\\\\n]*(\\\\n+|$)|<\\\\?[\\\\s\\\\S]*?(?:\\\\?>\\\\n*|$)|<![A-Z][\\\\s\\\\S]*?(?:>\\\\n*|$)|<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?(?:\\\\]\\\\]>\\\\n*|$)|</?(tag)(?: +|\\\\n|/?>)[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$)|<(?!script|pre|style|textarea)([a-z][\\\\w-]*)(?:attribute)*? */?>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$)|</(?!script|pre|style|textarea)[a-z][\\\\w-]*\\\\s*>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$))", "i").replace("comment", V).replace("tag", N).replace("attribute", / +[a-zA-Z:_][\\w.:-]*(?: *= *"[^"\\n]*"| *= *'[^'\\n]*'| *= *[^\\s"'=<>\`]+)?/).getRegex(), ke = f(U).replace("hr", q).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", N).getRegex(), je = f(/^( {0,3}> ?(paragraph|[^\\n]*)(?:\\n|$))+/).replace("paragraph", ke).getRegex(), Y = { blockquote: je, code: Le, def: qe, fences: Ce, heading: Ie, hr: q, html: Ze, lheading: fe, list: De, newline: Ee, paragraph: ke, table: z, text: Be }, se = f("^ *([^\\\\n ].*)\\\\n {0,3}((?:\\\\| *)?:?-+:? *(?:\\\\| *:?-+:? *)*(?:\\\\| *)?)(?:\\\\n((?:(?! *\\\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\\\n|$))*)\\\\n*|$)").replace("hr", q).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\\\n]").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", N).getRegex(), He = { ...Y, lheading: Me, table: se, paragraph: f(U).replace("hr", q).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("|lheading", "").replace("table", se).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", N).getRegex() }, Ne = { ...Y, html: f(\`^ *(?:comment *(?:\\\\n|\\\\s*$)|<(tag)[\\\\s\\\\S]+?</\\\\1> *(?:\\\\n{2,}|\\\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\\\s[^'"/>\\\\s]*)*?/?> *(?:\\\\n{2,}|\\\\s*$))\`).replace("comment", V).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\\\b)\\\\w+(?!:|[^\\\\w\\\\s@]*@)\\\\b").getRegex(), def: /^ *\\[([^\\]]+)\\]: *<?([^\\s>]+)>?(?: +(["(][^\\n]+[")]))? *(?:\\n+|$)/, heading: /^(#{1,6})(.*)(?:\\n+|$)/, fences: z, lheading: /^(.+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/, paragraph: f(U).replace("hr", q).replace("heading", \` *#{1,6} *[^
]\`).replace("lheading", fe).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Oe = /^\\\\([!"#$%&'()*+,\\-./:;<=>?@\\[\\]\\\\^_\`{|}~])/, Qe = /^(\`+)([^\`]|[^\`][\\s\\S]*?[^\`])\\1(?!\`)/, de = /^( {2,}|\\\\)\\n(?!\\s*$)/, Ge = /^(\`+|[^\`])(?:(?= {2,}\\n)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*_]|\\b_|$)|[^ ](?= {2,}\\n)))/, O = /[\\p{P}\\p{S}]/u, ee = /[\\s\\p{P}\\p{S}]/u, xe = /[^\\s\\p{P}\\p{S}]/u, We = f(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, ee).getRegex(), be = /(?!~)[\\p{P}\\p{S}]/u, Fe = /(?!~)[\\s\\p{P}\\p{S}]/u, Xe = /(?:[^\\s\\p{P}\\p{S}]|~)/u, me = /(?![*_])[\\p{P}\\p{S}]/u, Ke = /(?![*_])[\\s\\p{P}\\p{S}]/u, Ue = /(?:[^\\s\\p{P}\\p{S}]|[*_])/u, Je = f(/link|precode-code|html/, "g").replace("link", /\\[(?:[^\\[\\]\`]|(?<a>\`+)[^\`]+\\k<a>(?!\`))*?\\]\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)]|\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)])*\\))*\\)/).replace("precode-", Pe ? "(?<!\`)()" : "(^^|[^\`])").replace("code", /(?<b>\`+)[^\`]+\\k<b>(?!\`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), we = /^(?:\\*+(?:((?!\\*)punct)|[^\\s*]))|^_+(?:((?!_)punct)|([^\\s_]))/, Ve = f(we, "u").replace(/punct/g, O).getRegex(), Ye = f(we, "u").replace(/punct/g, be).getRegex(), ye = "^[^_*]*?__[^_*]*?\\\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\\\*)punct(\\\\*+)(?=[\\\\s]|$)|notPunctSpace(\\\\*+)(?!\\\\*)(?=punctSpace|$)|(?!\\\\*)punctSpace(\\\\*+)(?=notPunctSpace)|[\\\\s](\\\\*+)(?!\\\\*)(?=punct)|(?!\\\\*)punct(\\\\*+)(?!\\\\*)(?=punct)|notPunctSpace(\\\\*+)(?=notPunctSpace)", et = f(ye, "gu").replace(/notPunctSpace/g, xe).replace(/punctSpace/g, ee).replace(/punct/g, O).getRegex(), tt = f(ye, "gu").replace(/notPunctSpace/g, Xe).replace(/punctSpace/g, Fe).replace(/punct/g, be).getRegex(), rt = f("^[^_*]*?\\\\*\\\\*[^_*]*?_[^_*]*?(?=\\\\*\\\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, xe).replace(/punctSpace/g, ee).replace(/punct/g, O).getRegex(), st = f(/^~~?(?:((?!~)punct)|[^\\s~])/, "u").replace(/punct/g, me).getRegex(), nt = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", it = f(nt, "gu").replace(/notPunctSpace/g, Ue).replace(/punctSpace/g, Ke).replace(/punct/g, me).getRegex(), lt = f(/\\\\(punct)/, "gu").replace(/punct/g, O).getRegex(), at = f(/^<(scheme:[^\\s\\x00-\\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), ot = f(V).replace("(?:-->|$)", "-->").getRegex(), ct = f("^comment|^</[a-zA-Z][\\\\w:-]*\\\\s*>|^<[a-zA-Z][\\\\w-]*(?:attribute)*?\\\\s*/?>|^<\\\\?[\\\\s\\\\S]*?\\\\?>|^<![a-zA-Z]+\\\\s[\\\\s\\\\S]*?>|^<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?\\\\]\\\\]>").replace("comment", ot).replace("attribute", /\\s+[a-zA-Z:_][\\w.:-]*(?:\\s*=\\s*"[^"]*"|\\s*=\\s*'[^']*'|\\s*=\\s*[^\\s"'=<>\`]+)?/).getRegex(), j = /(?:\\[(?:\\\\[\\s\\S]|[^\\[\\]\\\\])*\\]|\\\\[\\s\\S]|\`+[^\`]*?\`+(?!\`)|[^\\[\\]\\\\\`])*?/, ht = f(/^!?\\[(label)\\]\\(\\s*(href)(?:(?:[ \\t]+(?:\\n[ \\t]*)?|\\n[ \\t]*)(title))?\\s*\\)/).replace("label", j).replace("href", /<(?:\\\\.|[^\\n<>\\\\])+>|[^ \\t\\n\\x00-\\x1f]*/).replace("title", /"(?:\\\\"?|[^"\\\\])*"|'(?:\\\\'?|[^'\\\\])*'|\\((?:\\\\\\)?|[^)\\\\])*\\)/).getRegex(), Se = f(/^!?\\[(label)\\]\\[(ref)\\]/).replace("label", j).replace("ref", J).getRegex(), $e = f(/^!?\\[(ref)\\](?:\\[\\])?/).replace("ref", J).getRegex(), pt = f("reflink|nolink(?!\\\\()", "g").replace("reflink", Se).replace("nolink", $e).getRegex(), ne = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, te = { _backpedal: z, anyPunctuation: lt, autolink: at, blockSkip: Je, br: de, code: Qe, del: z, delLDelim: z, delRDelim: z, emStrongLDelim: Ve, emStrongRDelimAst: et, emStrongRDelimUnd: rt, escape: Oe, link: ht, nolink: $e, punctuation: We, reflink: Se, reflinkSearch: pt, tag: ct, text: Ge, url: z }, ut = { ...te, link: f(/^!?\\[(label)\\]\\((.*?)\\)/).replace("label", j).getRegex(), reflink: f(/^!?\\[(label)\\]\\s*\\[([^\\]]*)\\]/).replace("label", j).getRegex() }, W = { ...te, emStrongRDelimAst: tt, emStrongLDelim: Ye, delLDelim: st, delRDelim: it, url: f(/^((?:protocol):\\/\\/|www\\.)(?:[a-zA-Z0-9\\-]+\\.?)+[^\\s<]*|^email/).replace("protocol", ne).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\\([^)]*\\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\\s~])((?:\\\\[\\s\\S]|[^\\\\])*?(?:\\\\[\\s\\S]|[^\\s~\\\\]))\\1(?=[^~]|$)/, text: f(/^([\`~]+|[^\`~])(?:(?= {2,}\\n)|(?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*~_]|\\b_|protocol:\\/\\/|www\\.|$)|[^ ](?= {2,}\\n)|[^a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-](?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@)))/).replace("protocol", ne).getRegex() }, gt = { ...W, br: f(de).replace("{2,}", "*").getRegex(), text: f(W.text).replace("\\\\b_", "\\\\b_| {2,}\\\\n").replace(/\\{2,\\}/g, "*").getRegex() }, D = { normal: Y, gfm: He, pedantic: Ne }, C = { normal: te, gfm: W, breaks: gt, pedantic: ut }, ft = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, ie = (s) => ft[s];
function S(s, e) {
  if (e) {
    if (m.escapeTest.test(s)) return s.replace(m.escapeReplace, ie);
  } else if (m.escapeTestNoEncode.test(s)) return s.replace(m.escapeReplaceNoEncode, ie);
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
function ae(s, e) {
  let r = s.replace(m.findPipe, (l, i, o) => {
    let a = !1, h = i;
    for (; --h >= 0 && o[h] === "\\\\"; ) a = !a;
    return a ? "|" : " |";
  }), n = r.split(m.splitPipe), t = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e) if (n.length > e) n.splice(e);
  else for (; n.length < e; ) n.push("");
  for (; t < n.length; t++) n[t] = n[t].trim().replace(m.slashPipe, "|");
  return n;
}
function I(s, e, r) {
  let n = s.length;
  if (n === 0) return "";
  let t = 0;
  for (; t < n && s.charAt(n - t - 1) === e; )
    t++;
  return s.slice(0, n - t);
}
function kt(s, e) {
  if (s.indexOf(e[1]) === -1) return -1;
  let r = 0;
  for (let n = 0; n < s.length; n++) if (s[n] === "\\\\") n++;
  else if (s[n] === e[0]) r++;
  else if (s[n] === e[1] && (r--, r < 0)) return n;
  return r > 0 ? -2 : -1;
}
function dt(s, e = 0) {
  let r = e, n = "";
  for (let t of s) if (t === "	") {
    let l = 4 - r % 4;
    n += " ".repeat(l), r += l;
  } else n += t, r++;
  return n;
}
function oe(s, e, r, n, t) {
  let l = e.href, i = e.title || null, o = s[1].replace(t.other.outputLinkReplace, "$1");
  n.state.inLink = !0;
  let a = { type: s[0].charAt(0) === "!" ? "image" : "link", raw: r, href: l, title: i, text: o, tokens: n.inlineTokens(o) };
  return n.state.inLink = !1, a;
}
function xt(s, e, r) {
  let n = s.match(r.other.indentCodeCompensation);
  if (n === null) return e;
  let t = n[1];
  return e.split(\`
\`).map((l) => {
    let i = l.match(r.other.beginningSpace);
    if (i === null) return l;
    let [o] = i;
    return o.length >= t.length ? l.slice(t.length) : l;
  }).join(\`
\`);
}
var M = class {
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
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? r : I(r, \`
\`) };
    }
  }
  fences(s) {
    let e = this.rules.block.fences.exec(s);
    if (e) {
      let r = e[0], n = xt(r, e[3] || "", this.rules);
      return { type: "code", raw: r, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: n };
    }
  }
  heading(s) {
    let e = this.rules.block.heading.exec(s);
    if (e) {
      let r = e[2].trim();
      if (this.rules.other.endingHash.test(r)) {
        let n = I(r, "#");
        (this.options.pedantic || !n || this.rules.other.endingSpaceChar.test(n)) && (r = n.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: r, tokens: this.lexer.inline(r) };
    }
  }
  hr(s) {
    let e = this.rules.block.hr.exec(s);
    if (e) return { type: "hr", raw: I(e[0], \`
\`) };
  }
  blockquote(s) {
    let e = this.rules.block.blockquote.exec(s);
    if (e) {
      let r = I(e[0], \`
\`).split(\`
\`), n = "", t = "", l = [];
      for (; r.length > 0; ) {
        let i = !1, o = [], a;
        for (a = 0; a < r.length; a++) if (this.rules.other.blockquoteStart.test(r[a])) o.push(r[a]), i = !0;
        else if (!i) o.push(r[a]);
        else break;
        r = r.slice(a);
        let h = o.join(\`
\`), c = h.replace(this.rules.other.blockquoteSetextReplace, \`
    $1\`).replace(this.rules.other.blockquoteSetextReplace2, "");
        n = n ? \`\${n}
\${h}\` : h, t = t ? \`\${t}
\${c}\` : c;
        let p = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(c, l, !0), this.lexer.state.top = p, r.length === 0) break;
        let u = l.at(-1);
        if (u?.type === "code") break;
        if (u?.type === "blockquote") {
          let d = u, g = d.raw + \`
\` + r.join(\`
\`), x = this.blockquote(g);
          l[l.length - 1] = x, n = n.substring(0, n.length - d.raw.length) + x.raw, t = t.substring(0, t.length - d.text.length) + x.text;
          break;
        } else if (u?.type === "list") {
          let d = u, g = d.raw + \`
\` + r.join(\`
\`), x = this.list(g);
          l[l.length - 1] = x, n = n.substring(0, n.length - u.raw.length) + x.raw, t = t.substring(0, t.length - d.raw.length) + x.raw, r = g.substring(l.at(-1).raw.length).split(\`
\`);
          continue;
        }
      }
      return { type: "blockquote", raw: n, tokens: l, text: t };
    }
  }
  list(s) {
    let e = this.rules.block.list.exec(s);
    if (e) {
      let r = e[1].trim(), n = r.length > 1, t = { type: "list", raw: "", ordered: n, start: n ? +r.slice(0, -1) : "", loose: !1, items: [] };
      r = n ? \`\\\\d{1,9}\\\\\${r.slice(-1)}\` : \`\\\\\${r}\`, this.options.pedantic && (r = n ? r : "[*+-]");
      let l = this.rules.other.listItemRegex(r), i = !1;
      for (; s; ) {
        let a = !1, h = "", c = "";
        if (!(e = l.exec(s)) || this.rules.block.hr.test(s)) break;
        h = e[0], s = s.substring(h.length);
        let p = dt(e[2].split(\`
\`, 1)[0], e[1].length), u = s.split(\`
\`, 1)[0], d = !p.trim(), g = 0;
        if (this.options.pedantic ? (g = 2, c = p.trimStart()) : d ? g = e[1].length + 1 : (g = p.search(this.rules.other.nonSpaceChar), g = g > 4 ? 1 : g, c = p.slice(g), g += e[1].length), d && this.rules.other.blankLine.test(u) && (h += u + \`
\`, s = s.substring(u.length + 1), a = !0), !a) {
          let x = this.rules.other.nextBulletRegex(g), A = this.rules.other.hrRegex(g), E = this.rules.other.fencesBeginRegex(g), R = this.rules.other.headingBeginRegex(g), re = this.rules.other.htmlBeginRegex(g), L = this.rules.other.blockquoteBeginRegex(g);
          for (; s; ) {
            let v = s.split(\`
\`, 1)[0], _;
            if (u = v, this.options.pedantic ? (u = u.replace(this.rules.other.listReplaceNesting, "  "), _ = u) : _ = u.replace(this.rules.other.tabCharGlobal, "    "), E.test(u) || R.test(u) || re.test(u) || L.test(u) || x.test(u) || A.test(u)) break;
            if (_.search(this.rules.other.nonSpaceChar) >= g || !u.trim()) c += \`
\` + _.slice(g);
            else {
              if (d || p.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || E.test(p) || R.test(p) || A.test(p)) break;
              c += \`
\` + u;
            }
            d = !u.trim(), h += v + \`
\`, s = s.substring(v.length + 1), p = _.slice(g);
          }
        }
        t.loose || (i ? t.loose = !0 : this.rules.other.doubleBlankLine.test(h) && (i = !0)), t.items.push({ type: "list_item", raw: h, task: !!this.options.gfm && this.rules.other.listIsTask.test(c), loose: !1, text: c, tokens: [] }), t.raw += h;
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
          let h = a.tokens.filter((p) => p.type === "space"), c = h.length > 0 && h.some((p) => this.rules.other.anyLine.test(p.raw));
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
    let r = ae(e[1]), n = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), t = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(\`
\`) : [], l = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (r.length === n.length) {
      for (let i of n) this.rules.other.tableAlignRight.test(i) ? l.align.push("right") : this.rules.other.tableAlignCenter.test(i) ? l.align.push("center") : this.rules.other.tableAlignLeft.test(i) ? l.align.push("left") : l.align.push(null);
      for (let i = 0; i < r.length; i++) l.header.push({ text: r[i], tokens: this.lexer.inline(r[i]), header: !0, align: l.align[i] });
      for (let i of t) l.rows.push(ae(i, l.header.length).map((o, a) => ({ text: o, tokens: this.lexer.inline(o), header: !1, align: l.align[a] })));
      return l;
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
        let l = I(r.slice(0, -1), "\\\\");
        if ((r.length - l.length) % 2 === 0) return;
      } else {
        let l = kt(e[2], "()");
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
      return n = n.trim(), this.rules.other.startAngleBracket.test(n) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? n = n.slice(1) : n = n.slice(1, -1)), oe(e, { href: n && n.replace(this.rules.inline.anyPunctuation, "$1"), title: t && t.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(s, e) {
    let r;
    if ((r = this.rules.inline.reflink.exec(s)) || (r = this.rules.inline.nolink.exec(s))) {
      let n = (r[2] || r[1]).replace(this.rules.other.multipleSpaceGlobal, " "), t = e[n.toLowerCase()];
      if (!t) {
        let l = r[0].charAt(0);
        return { type: "text", raw: l, text: l };
      }
      return oe(r, t, r[0], this.lexer, this.rules);
    }
  }
  emStrong(s, e, r = "") {
    let n = this.rules.inline.emStrongLDelim.exec(s);
    if (!(!n || n[3] && r.match(this.rules.other.unicodeAlphaNumeric)) && (!(n[1] || n[2]) || !r || this.rules.inline.punctuation.exec(r))) {
      let t = [...n[0]].length - 1, l, i, o = t, a = 0, h = n[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (h.lastIndex = 0, e = e.slice(-1 * s.length + t); (n = h.exec(e)) != null; ) {
        if (l = n[1] || n[2] || n[3] || n[4] || n[5] || n[6], !l) continue;
        if (i = [...l].length, n[3] || n[4]) {
          o += i;
          continue;
        } else if ((n[5] || n[6]) && t % 3 && !((t + i) % 3)) {
          a += i;
          continue;
        }
        if (o -= i, o > 0) continue;
        i = Math.min(i, i + o + a);
        let c = [...n[0]][0].length, p = s.slice(0, t + n.index + c + i);
        if (Math.min(t, i) % 2) {
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
      let t = [...n[0]].length - 1, l, i, o = t, a = this.rules.inline.delRDelim;
      for (a.lastIndex = 0, e = e.slice(-1 * s.length + t); (n = a.exec(e)) != null; ) {
        if (l = n[1] || n[2] || n[3] || n[4] || n[5] || n[6], !l || (i = [...l].length, i !== t)) continue;
        if (n[3] || n[4]) {
          o += i;
          continue;
        }
        if (o -= i, o > 0) continue;
        i = Math.min(i, i + o);
        let h = [...n[0]][0].length, c = s.slice(0, t + n.index + h + i), p = c.slice(t, -t);
        return { type: "del", raw: c, text: p, tokens: this.lexer.inlineTokens(p) };
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
}, w = class F {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || $, this.options.tokenizer = this.options.tokenizer || new M(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let r = { other: m, block: D.normal, inline: C.normal };
    this.options.pedantic ? (r.block = D.pedantic, r.inline = C.pedantic) : this.options.gfm && (r.block = D.gfm, this.options.breaks ? r.inline = C.breaks : r.inline = C.gfm), this.tokenizer.rules = r;
  }
  static get rules() {
    return { block: D, inline: C };
  }
  static lex(e, r) {
    return new F(r).lex(e);
  }
  static lexInline(e, r) {
    return new F(r).inlineTokens(e);
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
      if (this.options.extensions?.block?.some((i) => (t = i.call({ lexer: this }, e, r)) ? (e = e.substring(t.raw.length), r.push(t), !0) : !1)) continue;
      if (t = this.tokenizer.space(e)) {
        e = e.substring(t.raw.length);
        let i = r.at(-1);
        t.raw.length === 1 && i !== void 0 ? i.raw += \`
\` : r.push(t);
        continue;
      }
      if (t = this.tokenizer.code(e)) {
        e = e.substring(t.raw.length);
        let i = r.at(-1);
        i?.type === "paragraph" || i?.type === "text" ? (i.raw += (i.raw.endsWith(\`
\`) ? "" : \`
\`) + t.raw, i.text += \`
\` + t.text, this.inlineQueue.at(-1).src = i.text) : r.push(t);
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
        let i = r.at(-1);
        i?.type === "paragraph" || i?.type === "text" ? (i.raw += (i.raw.endsWith(\`
\`) ? "" : \`
\`) + t.raw, i.text += \`
\` + t.raw, this.inlineQueue.at(-1).src = i.text) : this.tokens.links[t.tag] || (this.tokens.links[t.tag] = { href: t.href, title: t.title }, r.push(t));
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
      let l = e;
      if (this.options.extensions?.startBlock) {
        let i = 1 / 0, o = e.slice(1), a;
        this.options.extensions.startBlock.forEach((h) => {
          a = h.call({ lexer: this }, o), typeof a == "number" && a >= 0 && (i = Math.min(i, a));
        }), i < 1 / 0 && i >= 0 && (l = e.substring(0, i + 1));
      }
      if (this.state.top && (t = this.tokenizer.paragraph(l))) {
        let i = r.at(-1);
        n && i?.type === "paragraph" ? (i.raw += (i.raw.endsWith(\`
\`) ? "" : \`
\`) + t.raw, i.text += \`
\` + t.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = i.text) : r.push(t), n = l.length !== e.length, e = e.substring(t.raw.length);
        continue;
      }
      if (t = this.tokenizer.text(e)) {
        e = e.substring(t.raw.length);
        let i = r.at(-1);
        i?.type === "text" ? (i.raw += (i.raw.endsWith(\`
\`) ? "" : \`
\`) + t.raw, i.text += \`
\` + t.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = i.text) : r.push(t);
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
    let l;
    for (; (t = this.tokenizer.rules.inline.blockSkip.exec(n)) != null; ) l = t[2] ? t[2].length : 0, n = n.slice(0, t.index + l) + "[" + "a".repeat(t[0].length - l - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
    let i = !1, o = "";
    for (; e; ) {
      i || (o = ""), i = !1;
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
      if (a = this.tokenizer.emStrong(e, n, o)) {
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
      if (a = this.tokenizer.del(e, n, o)) {
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
        let c = 1 / 0, p = e.slice(1), u;
        this.options.extensions.startInline.forEach((d) => {
          u = d.call({ lexer: this }, p), typeof u == "number" && u >= 0 && (c = Math.min(c, u));
        }), c < 1 / 0 && c >= 0 && (h = e.substring(0, c + 1));
      }
      if (a = this.tokenizer.inlineText(h)) {
        e = e.substring(a.raw.length), a.raw.slice(-1) !== "_" && (o = a.raw.slice(-1)), i = !0;
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
}, B = class {
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
    for (let i = 0; i < s.items.length; i++) {
      let o = s.items[i];
      n += this.listitem(o);
    }
    let t = e ? "ol" : "ul", l = e && r !== 1 ? ' start="' + r + '"' : "";
    return "<" + t + l + \`>
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
      let l = s.rows[t];
      r = "";
      for (let i = 0; i < l.length; i++) r += this.tablecell(l[i]);
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
    let l = '<a href="' + s + '"';
    return e && (l += ' title="' + S(e) + '"'), l += ">" + n + "</a>", l;
  }
  image({ href: s, title: e, text: r, tokens: n }) {
    n && (r = this.parser.parseInline(n, this.parser.textRenderer));
    let t = le(s);
    if (t === null) return S(r);
    s = t;
    let l = \`<img src="\${s}" alt="\${S(r)}"\`;
    return e && (l += \` title="\${S(e)}"\`), l += ">", l;
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
}, y = class X {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || $, this.options.renderer = this.options.renderer || new B(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Q();
  }
  static parse(e, r) {
    return new X(r).parse(e);
  }
  static parseInline(e, r) {
    return new X(r).parseInline(e);
  }
  parse(e) {
    let r = "";
    for (let n = 0; n < e.length; n++) {
      let t = e[n];
      if (this.options.extensions?.renderers?.[t.type]) {
        let i = t, o = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (o !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(i.type)) {
          r += o || "";
          continue;
        }
      }
      let l = t;
      switch (l.type) {
        case "space": {
          r += this.renderer.space(l);
          break;
        }
        case "hr": {
          r += this.renderer.hr(l);
          break;
        }
        case "heading": {
          r += this.renderer.heading(l);
          break;
        }
        case "code": {
          r += this.renderer.code(l);
          break;
        }
        case "table": {
          r += this.renderer.table(l);
          break;
        }
        case "blockquote": {
          r += this.renderer.blockquote(l);
          break;
        }
        case "list": {
          r += this.renderer.list(l);
          break;
        }
        case "checkbox": {
          r += this.renderer.checkbox(l);
          break;
        }
        case "html": {
          r += this.renderer.html(l);
          break;
        }
        case "def": {
          r += this.renderer.def(l);
          break;
        }
        case "paragraph": {
          r += this.renderer.paragraph(l);
          break;
        }
        case "text": {
          r += this.renderer.text(l);
          break;
        }
        default: {
          let i = 'Token with "' + l.type + '" type was not found.';
          if (this.options.silent) return console.error(i), "";
          throw new Error(i);
        }
      }
    }
    return r;
  }
  parseInline(e, r = this.renderer) {
    let n = "";
    for (let t = 0; t < e.length; t++) {
      let l = e[t];
      if (this.options.extensions?.renderers?.[l.type]) {
        let o = this.options.extensions.renderers[l.type].call({ parser: this }, l);
        if (o !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(l.type)) {
          n += o || "";
          continue;
        }
      }
      let i = l;
      switch (i.type) {
        case "escape": {
          n += r.text(i);
          break;
        }
        case "html": {
          n += r.html(i);
          break;
        }
        case "link": {
          n += r.link(i);
          break;
        }
        case "image": {
          n += r.image(i);
          break;
        }
        case "checkbox": {
          n += r.checkbox(i);
          break;
        }
        case "strong": {
          n += r.strong(i);
          break;
        }
        case "em": {
          n += r.em(i);
          break;
        }
        case "codespan": {
          n += r.codespan(i);
          break;
        }
        case "br": {
          n += r.br(i);
          break;
        }
        case "del": {
          n += r.del(i);
          break;
        }
        case "text": {
          n += r.text(i);
          break;
        }
        default: {
          let o = 'Token with "' + i.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return n;
  }
}, P = class {
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
}, Re = class {
  defaults = H();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = y;
  Renderer = B;
  TextRenderer = Q;
  Lexer = w;
  Tokenizer = M;
  Hooks = P;
  constructor(...s) {
    this.use(...s);
  }
  walkTokens(s, e) {
    let r = [];
    for (let n of s) switch (r = r.concat(e.call(this, n)), n.type) {
      case "table": {
        let t = n;
        for (let l of t.header) r = r.concat(this.walkTokens(l.tokens, e));
        for (let l of t.rows) for (let i of l) r = r.concat(this.walkTokens(i.tokens, e));
        break;
      }
      case "list": {
        let t = n;
        r = r.concat(this.walkTokens(t.items, e));
        break;
      }
      default: {
        let t = n;
        this.defaults.extensions?.childTokens?.[t.type] ? this.defaults.extensions.childTokens[t.type].forEach((l) => {
          let i = t[l].flat(1 / 0);
          r = r.concat(this.walkTokens(i, e));
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
          let l = e.renderers[t.name];
          l ? e.renderers[t.name] = function(...i) {
            let o = t.renderer.apply(this, i);
            return o === !1 && (o = l.apply(this, i)), o;
          } : e.renderers[t.name] = t.renderer;
        }
        if ("tokenizer" in t) {
          if (!t.level || t.level !== "block" && t.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let l = e[t.level];
          l ? l.unshift(t.tokenizer) : e[t.level] = [t.tokenizer], t.start && (t.level === "block" ? e.startBlock ? e.startBlock.push(t.start) : e.startBlock = [t.start] : t.level === "inline" && (e.startInline ? e.startInline.push(t.start) : e.startInline = [t.start]));
        }
        "childTokens" in t && t.childTokens && (e.childTokens[t.name] = t.childTokens);
      }), n.extensions = e), r.renderer) {
        let t = this.defaults.renderer || new B(this.defaults);
        for (let l in r.renderer) {
          if (!(l in t)) throw new Error(\`renderer '\${l}' does not exist\`);
          if (["options", "parser"].includes(l)) continue;
          let i = l, o = r.renderer[i], a = t[i];
          t[i] = (...h) => {
            let c = o.apply(t, h);
            return c === !1 && (c = a.apply(t, h)), c || "";
          };
        }
        n.renderer = t;
      }
      if (r.tokenizer) {
        let t = this.defaults.tokenizer || new M(this.defaults);
        for (let l in r.tokenizer) {
          if (!(l in t)) throw new Error(\`tokenizer '\${l}' does not exist\`);
          if (["options", "rules", "lexer"].includes(l)) continue;
          let i = l, o = r.tokenizer[i], a = t[i];
          t[i] = (...h) => {
            let c = o.apply(t, h);
            return c === !1 && (c = a.apply(t, h)), c;
          };
        }
        n.tokenizer = t;
      }
      if (r.hooks) {
        let t = this.defaults.hooks || new P();
        for (let l in r.hooks) {
          if (!(l in t)) throw new Error(\`hook '\${l}' does not exist\`);
          if (["options", "block"].includes(l)) continue;
          let i = l, o = r.hooks[i], a = t[i];
          P.passThroughHooks.has(l) ? t[i] = (h) => {
            if (this.defaults.async && P.passThroughHooksRespectAsync.has(l)) return (async () => {
              let p = await o.call(t, h);
              return a.call(t, p);
            })();
            let c = o.call(t, h);
            return a.call(t, c);
          } : t[i] = (...h) => {
            if (this.defaults.async) return (async () => {
              let p = await o.apply(t, h);
              return p === !1 && (p = await a.apply(t, h)), p;
            })();
            let c = o.apply(t, h);
            return c === !1 && (c = a.apply(t, h)), c;
          };
        }
        n.hooks = t;
      }
      if (r.walkTokens) {
        let t = this.defaults.walkTokens, l = r.walkTokens;
        n.walkTokens = function(i) {
          let o = [];
          return o.push(l.call(this, i)), t && (o = o.concat(t.call(this, i))), o;
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
      let n = { ...r }, t = { ...this.defaults, ...n }, l = this.onError(!!t.silent, !!t.async);
      if (this.defaults.async === !0 && n.async === !1) return l(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return l(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return l(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (t.hooks && (t.hooks.options = t, t.hooks.block = s), t.async) return (async () => {
        let i = t.hooks ? await t.hooks.preprocess(e) : e, o = await (t.hooks ? await t.hooks.provideLexer() : s ? w.lex : w.lexInline)(i, t), a = t.hooks ? await t.hooks.processAllTokens(o) : o;
        t.walkTokens && await Promise.all(this.walkTokens(a, t.walkTokens));
        let h = await (t.hooks ? await t.hooks.provideParser() : s ? y.parse : y.parseInline)(a, t);
        return t.hooks ? await t.hooks.postprocess(h) : h;
      })().catch(l);
      try {
        t.hooks && (e = t.hooks.preprocess(e));
        let i = (t.hooks ? t.hooks.provideLexer() : s ? w.lex : w.lexInline)(e, t);
        t.hooks && (i = t.hooks.processAllTokens(i)), t.walkTokens && this.walkTokens(i, t.walkTokens);
        let o = (t.hooks ? t.hooks.provideParser() : s ? y.parse : y.parseInline)(i, t);
        return t.hooks && (o = t.hooks.postprocess(o)), o;
      } catch (i) {
        return l(i);
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
}, T = new Re();
function k(s, e) {
  return T.parse(s, e);
}
k.options = k.setOptions = function(s) {
  return T.setOptions(s), k.defaults = T.defaults, ue(k.defaults), k;
};
k.getDefaults = H;
k.defaults = $;
k.use = function(...s) {
  return T.use(...s), k.defaults = T.defaults, ue(k.defaults), k;
};
k.walkTokens = function(s, e) {
  return T.walkTokens(s, e);
};
k.parseInline = T.parseInline;
k.Parser = y;
k.parser = y.parse;
k.Renderer = B;
k.TextRenderer = Q;
k.Lexer = w;
k.lexer = w.lex;
k.Tokenizer = M;
k.Hooks = P;
k.parse = k;
var bt = k.options, mt = k.setOptions, wt = k.use, yt = k.walkTokens, St = k.parseInline, $t = k, Rt = y.parse, _t = w.lex, ce = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  Hooks: P,
  Lexer: w,
  Marked: Re,
  Parser: y,
  Renderer: B,
  TextRenderer: Q,
  Tokenizer: M,
  get defaults() {
    return $;
  },
  getDefaults: H,
  lexer: _t,
  marked: k,
  options: bt,
  parse: $t,
  parseInline: St,
  parser: Rt,
  setOptions: mt,
  use: wt,
  walkTokens: yt
});
function zt(s) {
  if (s.startsWith("---")) {
    const e = s.indexOf(\`
---\`, 3);
    if (e !== -1) {
      const r = s.slice(3, e + 0).trim(), n = s.slice(e + 4).trimStart(), t = {};
      return r.split(/\\r?\\n/).forEach((l) => {
        const i = l.match(/^([^:]+):\\s*(.*)$/);
        i && (t[i[1].trim()] = i[2].trim());
      }), { content: n, data: t };
    }
  }
  return { content: s, data: {} };
}
class Tt {
  /**
   * Create an LRU cache.
   * @param {{maxSize?:number,ttlMs?:number,onEvict?:function}} [opts]
   */
  constructor(e = {}) {
    const { maxSize: r = 0, ttlMs: n = 0, onEvict: t = null } = e || {};
    this._map = /* @__PURE__ */ new Map(), this._maxSize = Math.max(0, Number(r) || 0), this._ttlMs = Math.max(0, Number(n) || 0), this._onEvict = typeof t == "function" ? t : null;
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
    const r = this._map.get(e);
    return r ? this._ttlMs && Date.now() - (r.ts || 0) >= this._ttlMs ? (this._evictKey(e, r), !1) : (this._map.delete(e), this._map.set(e, r), !0) : !1;
  }
  /**
   * Get value for key or undefined if missing/expired.
   * @param {*} key
   */
  get(e) {
    const r = this._map.get(e);
    if (r) {
      if (this._ttlMs && Date.now() - (r.ts || 0) >= this._ttlMs) {
        this._evictKey(e, r);
        return;
      }
      return this._map.delete(e), this._map.set(e, r), r.value;
    }
  }
  /**
   * Set a key/value pair and enforce maxSize eviction.
   * @param {*} key
   * @param {*} value
   */
  set(e, r) {
    if (this._map.has(e) && this._map.delete(e), this._map.set(e, { value: r, ts: Date.now() }), this._maxSize && this._map.size > this._maxSize)
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
      for (const [e, r] of this._map.entries())
        try {
          this._onEvict(e, r && r.value);
        } catch {
        }
    this._map.clear();
  }
  _evictKey(e, r) {
    try {
      this._map.delete(e);
    } catch {
    }
    if (this._onEvict) try {
      this._onEvict(e, r && r.value);
    } catch {
    }
  }
}
const G = new Tt({ maxSize: 500 });
let At = 300 * 1e3;
async function _e(s, e) {
  try {
    if (!s) return null;
    const r = Date.now();
    let n = G.get(s);
    if (n && n.ok === !1 && r - (n.ts || 0) >= At && (G.delete(s), n = void 0), n) {
      if (n.module) return n.module;
      if (n.promise)
        try {
          return await n.promise;
        } catch {
          return null;
        }
    }
    const t = { promise: null, module: null, ok: null, ts: Date.now() };
    G.set(s, t), t.promise = (async () => {
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
async function vt(s) {
  return await _e(s, async () => {
    try {
      return await import(s);
    } catch {
      return null;
    }
  });
}
function Pt(s) {
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
const Z = ce && (k || ce) || void 0, he = /\`\`\`\\s*([a-zA-Z0-9_\\-+]+)?/g, Et = /* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"]);
function Lt(s) {
  try {
    return String(s || "").toLowerCase().trim().replace(/[^a-z0-9\\-\\s]+/g, "").replace(/\\s+/g, "-");
  } catch {
    return "heading";
  }
}
let b = null;
const Ct = "https://cdn.jsdelivr.net/npm/highlight.js";
async function ze(s) {
  return await vt(s);
}
async function pe() {
  if (b) return b;
  try {
    const s = Ct + "/lib/core.js";
    try {
      const e = await import("https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js");
      if (e) {
        b = e.default || e;
        try {
          await _e(s, async () => e);
        } catch {
        }
      } else
        b = null;
    } catch {
      const r = await ze(s);
      r ? b = r.default || r : b = null;
    }
  } catch {
    b = null;
  }
  return b;
}
Z && typeof Z.setOptions == "function" && Z.setOptions({
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
      const { name: c, url: p } = e;
      try {
        if (!await pe()) {
          postMessage({ type: "register-error", name: c, error: "hljs unavailable" });
          return;
        }
        const d = await ze(p), g = d ? d.default || d : null;
        if (!g) throw new Error("failed to import language module");
        b.registerLanguage(c, g), postMessage({ type: "registered", name: c });
      } catch (u) {
        postMessage({ type: "register-error", name: c, error: String(u) });
      }
      return;
    }
    if (e.type === "detect") {
      const c = e.md || "", p = e.supported || [], u = /* @__PURE__ */ new Set(), d = new RegExp(he.source, he.flags);
      let g;
      for (; g = d.exec(c); )
        if (g[1]) {
          const x = String(g[1]).toLowerCase();
          if (!x) continue;
          if (x.length >= 5 && x.length <= 30 && /^[a-z][a-z0-9_\\-+]*$/.test(x) && u.add(x), Et.has(x) && u.add(x), p && p.length)
            try {
              p.indexOf(x) !== -1 && u.add(x);
            } catch {
            }
        }
      postMessage({ id: e.id, result: Array.from(u) });
      return;
    }
    const { id: r, md: n } = e, { content: t, data: l } = zt(n || "");
    await pe().catch(() => {
    });
    let i = Z.parse(t);
    const o = [], a = /* @__PURE__ */ new Map(), h = Lt;
    i = i.replace(/<h([1-6])([^>]*)>([\\s\\S]*?)<\\/h\\1>/g, (c, p, u, d) => {
      const g = Number(p);
      let x = d.replace(/<[^>]+>/g, "").trim();
      try {
        x = Pt(x);
      } catch {
      }
      let A = null;
      const E = (u || "").match(/\\sid="([^"]+)"/);
      E && (A = E[1]);
      const R = A || h(x) || "heading", L = (a.get(R) || 0) + 1;
      a.set(R, L);
      const v = L === 1 ? R : R + "-" + L;
      o.push({ level: g, text: x, id: v });
      const _ = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, Te = g <= 2 ? "has-text-weight-bold" : g <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", Ae = (_[g] + " " + Te).trim(), ve = ((u || "").replace(/\\s*(id|class)="[^"]*"/g, "") + \` id="\${v}" class="\${Ae}"\`).trim();
      return \`<h\${g} \${ve}>\${d}</h\${g}>\`;
    }), i = i.replace(/<img([^>]*)>/g, (c, p) => /\\bloading=/.test(p) ? \`<img\${p}>\` : /\\bdata-want-lazy=/.test(p) ? \`<img\${p}>\` : \`<img\${p} loading="lazy">\`), postMessage({ id: r, result: { html: i, meta: l || {}, toc: o } });
  } catch (r) {
    postMessage({ id: e.id, error: String(r) });
  }
};
`,wa=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",ba],{type:"text/javascript;charset=utf-8"});function rl(e){let t;try{if(t=wa&&(self.URL||self.webkitURL).createObjectURL(wa),!t)throw"";const n=new Worker(t,{type:"module",name:e?.name});return n.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(t)}),n}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(ba),{type:"module",name:e?.name})}}function ir(e){if(e.startsWith("---")){const t=e.indexOf(`
---`,3);if(t!==-1){const n=e.slice(3,t+0).trim(),i=e.slice(t+4).trimStart(),r={};return n.split(/\r?\n/).forEach(a=>{const s=a.match(/^([^:]+):\s*(.*)$/);s&&(r[s[1].trim()]=s[2].trim())}),{content:i,data:r}}}return{content:e,data:{}}}function _a(e){try{if(!e&&e!==0)return"";const t=String(e),n={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:" "};return t.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g,(i,r)=>{if(!r)return i;if(r[0]==="#")try{return r[1]==="x"||r[1]==="X"?String.fromCharCode(parseInt(r.slice(2),16)):String.fromCharCode(parseInt(r.slice(1),10))}catch{return i}return n[r]!==void 0?n[r]:i})}catch{return String(e||"")}}const Cn=ya&&(Ee||ya)||void 0,ar=/```\s*([a-zA-Z0-9_\-+]+)?/g,ka=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);function xa(e){try{return String(e||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}}let Ve=null;const il="https://cdn.jsdelivr.net/npm/highlight.js";async function Zr(e){return await is(e)}async function sr(){if(Ve)return Ve;try{const e=il+"/lib/core.js";try{const t=await import("https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js");if(t){Ve=t.default||t;try{await _r(e,async()=>t)}catch{}}else Ve=null}catch{const n=await Zr(e);n?Ve=n.default||n:Ve=null}}catch{Ve=null}return Ve}Cn&&typeof Cn.setOptions=="function"&&Cn.setOptions({gfm:!0,headerIds:!0,mangle:!1,highlighted:(e,t)=>{try{return Ve&&t&&typeof Ve.getLanguage=="function"&&Ve.getLanguage(t)?Ve.highlight(e,{language:t}).value:Ve&&typeof Ve.getLanguage=="function"&&Ve.getLanguage("plaintext")?Ve.highlight(e,{language:"plaintext"}).value:e}catch{return e}}}),onmessage=async e=>{const t=e.data||{};try{if(t.type==="register"){const{name:u,url:d}=t;try{if(!await sr()){postMessage({type:"register-error",name:u,error:"hljs unavailable"});return}const f=await Zr(d),p=f?f.default||f:null;if(!p)throw new Error("failed to import language module");Ve.registerLanguage(u,p),postMessage({type:"registered",name:u})}catch(h){postMessage({type:"register-error",name:u,error:String(h)})}return}if(t.type==="detect"){const u=t.md||"",d=t.supported||[],h=new Set,f=new RegExp(ar.source,ar.flags);let p;for(;p=f.exec(u);)if(p[1]){const m=String(p[1]).toLowerCase();if(!m)continue;if(m.length>=5&&m.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(m)&&h.add(m),ka.has(m)&&h.add(m),d&&d.length)try{d.indexOf(m)!==-1&&h.add(m)}catch{}}postMessage({id:t.id,result:Array.from(h)});return}const{id:n,md:i}=t,{content:r,data:a}=ir(i||"");await sr().catch(()=>{});let s=Cn.parse(r);const o=[],l=new Map,c=xa;s=s.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(u,d,h,f)=>{const p=Number(d);let m=f.replace(/<[^>]+>/g,"").trim();try{m=_a(m)}catch{}let g=null;const b=(h||"").match(/\sid="([^"]+)"/);b&&(g=b[1]);const y=g||c(m)||"heading",w=(l.get(y)||0)+1;l.set(y,w);const A=w===1?y:y+"-"+w;o.push({level:p,text:m,id:A});const S={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},M=p<=2?"has-text-weight-bold":p<=4?"has-text-weight-semibold":"has-text-weight-normal",I=(S[p]+" "+M).trim(),Q=((h||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${A}" class="${I}"`).trim();return`<h${p} ${Q}>${f}</h${p}>`}),s=s.replace(/<img([^>]*)>/g,(u,d)=>/\bloading=/.test(d)?`<img${d}>`:/\bdata-want-lazy=/.test(d)?`<img${d}>`:`<img${d} loading="lazy">`),postMessage({id:n,result:{html:s,meta:a||{},toc:o}})}catch(n){postMessage({id:t.id,error:String(n)})}};async function al(e){try{if(e&&e.type==="register"){const{name:l,url:c}=e;try{if(!await sr())return{type:"register-error",name:l,error:"hljs unavailable"};const d=await Zr(c),h=d?d.default||d:null;return h?(Ve.registerLanguage(l,h),{type:"registered",name:l}):{type:"register-error",name:l,error:"failed to import language module"}}catch(u){return{type:"register-error",name:l,error:String(u)}}}if(e&&e.type==="detect"){const l=e.md||"",c=e.supported||[],u=new Set,d=new RegExp(ar.source,ar.flags);let h;for(;h=d.exec(l);)if(h[1]){const f=String(h[1]).toLowerCase();if(!f)continue;if(f.length>=5&&f.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(f)&&u.add(f),ka.has(f)&&u.add(f),c&&c.length)try{c.indexOf(f)!==-1&&u.add(f)}catch{}}return{id:e.id,result:Array.from(u)}}const t=e&&e.id,{content:n,data:i}=ir(e&&e.md||"");await sr().catch(()=>{});let r=Cn.parse(n);const a=[],s=new Map,o=xa;return r=r.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(l,c,u,d)=>{const h=Number(c);let f=d.replace(/<[^>]+>/g,"").trim();try{f=_a(f)}catch{}let p=null;const m=(u||"").match(/\sid="([^"]+)"/);m&&(p=m[1]);const g=p||o(f)||"heading",y=(s.get(g)||0)+1;s.set(g,y);const _=y===1?g:g+"-"+y;a.push({level:h,text:f,id:_});const w={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},A=h<=2?"has-text-weight-bold":h<=4?"has-text-weight-semibold":"has-text-weight-normal",S=(w[h]+" "+A).trim(),I=((u||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${_}" class="${S}"`).trim();return`<h${h} ${I}>${d}</h${h}>`}),r=r.replace(/<img([^>]*)>/g,(l,c)=>/\bloading=/.test(c)?`<img${c}>`:/\bdata-want-lazy=/.test(c)?`<img${c}>`:`<img${c} loading="lazy">`),{id:t,result:{html:r,meta:i||{},toc:a}}}catch(t){return{id:e&&e.id,error:String(t)}}}const Gr={100:"💯",1234:"🔢",grinning:"😀",grimacing:"😬",grin:"😁",joy:"😂",rofl:"🤣",partying:"🥳",smiley:"😃",smile:"😄",sweat_smile:"😅",laughing:"😆",innocent:"😇",wink:"😉",blush:"😊",slightly_smiling_face:"🙂",upside_down_face:"🙃",relaxed:"☺️",yum:"😋",relieved:"😌",heart_eyes:"😍",smiling_face_with_three_hearts:"🥰",kissing_heart:"😘",kissing:"😗",kissing_smiling_eyes:"😙",kissing_closed_eyes:"😚",stuck_out_tongue_winking_eye:"😜",zany:"🤪",raised_eyebrow:"🤨",monocle:"🧐",stuck_out_tongue_closed_eyes:"😝",stuck_out_tongue:"😛",money_mouth_face:"🤑",nerd_face:"🤓",sunglasses:"😎",star_struck:"🤩",clown_face:"🤡",cowboy_hat_face:"🤠",hugs:"🤗",smirk:"😏",no_mouth:"😶",neutral_face:"😐",expressionless:"😑",unamused:"😒",roll_eyes:"🙄",thinking:"🤔",lying_face:"🤥",hand_over_mouth:"🤭",shushing:"🤫",symbols_over_mouth:"🤬",exploding_head:"🤯",flushed:"😳",disappointed:"😞",worried:"😟",angry:"😠",rage:"😡",pensive:"😔",confused:"😕",slightly_frowning_face:"🙁",frowning_face:"☹",persevere:"😣",confounded:"😖",tired_face:"😫",weary:"😩",pleading:"🥺",triumph:"😤",open_mouth:"😮",scream:"😱",fearful:"😨",cold_sweat:"😰",hushed:"😯",frowning:"😦",anguished:"😧",cry:"😢",disappointed_relieved:"😥",drooling_face:"🤤",sleepy:"😪",sweat:"😓",hot:"🥵",cold:"🥶",sob:"😭",dizzy_face:"😵",astonished:"😲",zipper_mouth_face:"🤐",nauseated_face:"🤢",sneezing_face:"🤧",vomiting:"🤮",mask:"😷",face_with_thermometer:"🤒",face_with_head_bandage:"🤕",woozy:"🥴",sleeping:"😴",zzz:"💤",poop:"💩",smiling_imp:"😈",imp:"👿",japanese_ogre:"👹",japanese_goblin:"👺",skull:"💀",ghost:"👻",alien:"👽",robot:"🤖",smiley_cat:"😺",smile_cat:"😸",joy_cat:"😹",heart_eyes_cat:"😻",smirk_cat:"😼",kissing_cat:"😽",scream_cat:"🙀",crying_cat_face:"😿",pouting_cat:"😾",palms_up:"🤲",raised_hands:"🙌",clap:"👏",wave:"👋",call_me_hand:"🤙","+1":"👍","-1":"👎",facepunch:"👊",fist:"✊",fist_left:"🤛",fist_right:"🤜",v:"✌",ok_hand:"👌",raised_hand:"✋",raised_back_of_hand:"🤚",open_hands:"👐",muscle:"💪",pray:"🙏",foot:"🦶",leg:"🦵",handshake:"🤝",point_up:"☝",point_up_2:"👆",point_down:"👇",point_left:"👈",point_right:"👉",fu:"🖕",raised_hand_with_fingers_splayed:"🖐",love_you:"🤟",metal:"🤘",crossed_fingers:"🤞",vulcan_salute:"🖖",writing_hand:"✍",selfie:"🤳",nail_care:"💅",lips:"👄",tooth:"🦷",tongue:"👅",ear:"👂",nose:"👃",eye:"👁",eyes:"👀",brain:"🧠",bust_in_silhouette:"👤",busts_in_silhouette:"👥",speaking_head:"🗣",baby:"👶",child:"🧒",boy:"👦",girl:"👧",adult:"🧑",man:"👨",woman:"👩",blonde_woman:"👱‍♀️",blonde_man:"👱",bearded_person:"🧔",older_adult:"🧓",older_man:"👴",older_woman:"👵",man_with_gua_pi_mao:"👲",woman_with_headscarf:"🧕",woman_with_turban:"👳‍♀️",man_with_turban:"👳",policewoman:"👮‍♀️",policeman:"👮",construction_worker_woman:"👷‍♀️",construction_worker_man:"👷",guardswoman:"💂‍♀️",guardsman:"💂",female_detective:"🕵️‍♀️",male_detective:"🕵",woman_health_worker:"👩‍⚕️",man_health_worker:"👨‍⚕️",woman_farmer:"👩‍🌾",man_farmer:"👨‍🌾",woman_cook:"👩‍🍳",man_cook:"👨‍🍳",woman_student:"👩‍🎓",man_student:"👨‍🎓",woman_singer:"👩‍🎤",man_singer:"👨‍🎤",woman_teacher:"👩‍🏫",man_teacher:"👨‍🏫",woman_factory_worker:"👩‍🏭",man_factory_worker:"👨‍🏭",woman_technologist:"👩‍💻",man_technologist:"👨‍💻",woman_office_worker:"👩‍💼",man_office_worker:"👨‍💼",woman_mechanic:"👩‍🔧",man_mechanic:"👨‍🔧",woman_scientist:"👩‍🔬",man_scientist:"👨‍🔬",woman_artist:"👩‍🎨",man_artist:"👨‍🎨",woman_firefighter:"👩‍🚒",man_firefighter:"👨‍🚒",woman_pilot:"👩‍✈️",man_pilot:"👨‍✈️",woman_astronaut:"👩‍🚀",man_astronaut:"👨‍🚀",woman_judge:"👩‍⚖️",man_judge:"👨‍⚖️",woman_superhero:"🦸‍♀️",man_superhero:"🦸‍♂️",woman_supervillain:"🦹‍♀️",man_supervillain:"🦹‍♂️",mrs_claus:"🤶",santa:"🎅",sorceress:"🧙‍♀️",wizard:"🧙‍♂️",woman_elf:"🧝‍♀️",man_elf:"🧝‍♂️",woman_vampire:"🧛‍♀️",man_vampire:"🧛‍♂️",woman_zombie:"🧟‍♀️",man_zombie:"🧟‍♂️",woman_genie:"🧞‍♀️",man_genie:"🧞‍♂️",mermaid:"🧜‍♀️",merman:"🧜‍♂️",woman_fairy:"🧚‍♀️",man_fairy:"🧚‍♂️",angel:"👼",pregnant_woman:"🤰",breastfeeding:"🤱",princess:"👸",prince:"🤴",bride_with_veil:"👰",man_in_tuxedo:"🤵",running_woman:"🏃‍♀️",running_man:"🏃",walking_woman:"🚶‍♀️",walking_man:"🚶",dancer:"💃",man_dancing:"🕺",dancing_women:"👯",dancing_men:"👯‍♂️",couple:"👫",two_men_holding_hands:"👬",two_women_holding_hands:"👭",bowing_woman:"🙇‍♀️",bowing_man:"🙇",man_facepalming:"🤦‍♂️",woman_facepalming:"🤦‍♀️",woman_shrugging:"🤷",man_shrugging:"🤷‍♂️",tipping_hand_woman:"💁",tipping_hand_man:"💁‍♂️",no_good_woman:"🙅",no_good_man:"🙅‍♂️",ok_woman:"🙆",ok_man:"🙆‍♂️",raising_hand_woman:"🙋",raising_hand_man:"🙋‍♂️",pouting_woman:"🙎",pouting_man:"🙎‍♂️",frowning_woman:"🙍",frowning_man:"🙍‍♂️",haircut_woman:"💇",haircut_man:"💇‍♂️",massage_woman:"💆",massage_man:"💆‍♂️",woman_in_steamy_room:"🧖‍♀️",man_in_steamy_room:"🧖‍♂️",couple_with_heart_woman_man:"💑",couple_with_heart_woman_woman:"👩‍❤️‍👩",couple_with_heart_man_man:"👨‍❤️‍👨",couplekiss_man_woman:"💏",couplekiss_woman_woman:"👩‍❤️‍💋‍👩",couplekiss_man_man:"👨‍❤️‍💋‍👨",family_man_woman_boy:"👪",family_man_woman_girl:"👨‍👩‍👧",family_man_woman_girl_boy:"👨‍👩‍👧‍👦",family_man_woman_boy_boy:"👨‍👩‍👦‍👦",family_man_woman_girl_girl:"👨‍👩‍👧‍👧",family_woman_woman_boy:"👩‍👩‍👦",family_woman_woman_girl:"👩‍👩‍👧",family_woman_woman_girl_boy:"👩‍👩‍👧‍👦",family_woman_woman_boy_boy:"👩‍👩‍👦‍👦",family_woman_woman_girl_girl:"👩‍👩‍👧‍👧",family_man_man_boy:"👨‍👨‍👦",family_man_man_girl:"👨‍👨‍👧",family_man_man_girl_boy:"👨‍👨‍👧‍👦",family_man_man_boy_boy:"👨‍👨‍👦‍👦",family_man_man_girl_girl:"👨‍👨‍👧‍👧",family_woman_boy:"👩‍👦",family_woman_girl:"👩‍👧",family_woman_girl_boy:"👩‍👧‍👦",family_woman_boy_boy:"👩‍👦‍👦",family_woman_girl_girl:"👩‍👧‍👧",family_man_boy:"👨‍👦",family_man_girl:"👨‍👧",family_man_girl_boy:"👨‍👧‍👦",family_man_boy_boy:"👨‍👦‍👦",family_man_girl_girl:"👨‍👧‍👧",yarn:"🧶",thread:"🧵",coat:"🧥",labcoat:"🥼",womans_clothes:"👚",tshirt:"👕",jeans:"👖",necktie:"👔",dress:"👗",bikini:"👙",kimono:"👘",lipstick:"💄",kiss:"💋",footprints:"👣",flat_shoe:"🥿",high_heel:"👠",sandal:"👡",boot:"👢",mans_shoe:"👞",athletic_shoe:"👟",hiking_boot:"🥾",socks:"🧦",gloves:"🧤",scarf:"🧣",womans_hat:"👒",tophat:"🎩",billed_hat:"🧢",rescue_worker_helmet:"⛑",mortar_board:"🎓",crown:"👑",school_satchel:"🎒",luggage:"🧳",pouch:"👝",purse:"👛",handbag:"👜",briefcase:"💼",eyeglasses:"👓",dark_sunglasses:"🕶",goggles:"🥽",ring:"💍",closed_umbrella:"🌂",dog:"🐶",cat:"🐱",mouse:"🐭",hamster:"🐹",rabbit:"🐰",fox_face:"🦊",bear:"🐻",panda_face:"🐼",koala:"🐨",tiger:"🐯",lion:"🦁",cow:"🐮",pig:"🐷",pig_nose:"🐽",frog:"🐸",squid:"🦑",octopus:"🐙",shrimp:"🦐",monkey_face:"🐵",gorilla:"🦍",see_no_evil:"🙈",hear_no_evil:"🙉",speak_no_evil:"🙊",monkey:"🐒",chicken:"🐔",penguin:"🐧",bird:"🐦",baby_chick:"🐤",hatching_chick:"🐣",hatched_chick:"🐥",duck:"🦆",eagle:"🦅",owl:"🦉",bat:"🦇",wolf:"🐺",boar:"🐗",horse:"🐴",unicorn:"🦄",honeybee:"🐝",bug:"🐛",butterfly:"🦋",snail:"🐌",beetle:"🐞",ant:"🐜",grasshopper:"🦗",spider:"🕷",scorpion:"🦂",crab:"🦀",snake:"🐍",lizard:"🦎","t-rex":"🦖",sauropod:"🦕",turtle:"🐢",tropical_fish:"🐠",fish:"🐟",blowfish:"🐡",dolphin:"🐬",shark:"🦈",whale:"🐳",whale2:"🐋",crocodile:"🐊",leopard:"🐆",zebra:"🦓",tiger2:"🐅",water_buffalo:"🐃",ox:"🐂",cow2:"🐄",deer:"🦌",dromedary_camel:"🐪",camel:"🐫",giraffe:"🦒",elephant:"🐘",rhinoceros:"🦏",goat:"🐐",ram:"🐏",sheep:"🐑",racehorse:"🐎",pig2:"🐖",rat:"🐀",mouse2:"🐁",rooster:"🐓",turkey:"🦃",dove:"🕊",dog2:"🐕",poodle:"🐩",cat2:"🐈",rabbit2:"🐇",chipmunk:"🐿",hedgehog:"🦔",raccoon:"🦝",llama:"🦙",hippopotamus:"🦛",kangaroo:"🦘",badger:"🦡",swan:"🦢",peacock:"🦚",parrot:"🦜",lobster:"🦞",mosquito:"🦟",paw_prints:"🐾",dragon:"🐉",dragon_face:"🐲",cactus:"🌵",christmas_tree:"🎄",evergreen_tree:"🌲",deciduous_tree:"🌳",palm_tree:"🌴",seedling:"🌱",herb:"🌿",shamrock:"☘",four_leaf_clover:"🍀",bamboo:"🎍",tanabata_tree:"🎋",leaves:"🍃",fallen_leaf:"🍂",maple_leaf:"🍁",ear_of_rice:"🌾",hibiscus:"🌺",sunflower:"🌻",rose:"🌹",wilted_flower:"🥀",tulip:"🌷",blossom:"🌼",cherry_blossom:"🌸",bouquet:"💐",mushroom:"🍄",chestnut:"🌰",jack_o_lantern:"🎃",shell:"🐚",spider_web:"🕸",earth_americas:"🌎",earth_africa:"🌍",earth_asia:"🌏",full_moon:"🌕",waning_gibbous_moon:"🌖",last_quarter_moon:"🌗",waning_crescent_moon:"🌘",new_moon:"🌑",waxing_crescent_moon:"🌒",first_quarter_moon:"🌓",waxing_gibbous_moon:"🌔",new_moon_with_face:"🌚",full_moon_with_face:"🌝",first_quarter_moon_with_face:"🌛",last_quarter_moon_with_face:"🌜",sun_with_face:"🌞",crescent_moon:"🌙",star:"⭐",star2:"🌟",dizzy:"💫",sparkles:"✨",comet:"☄",sunny:"☀️",sun_behind_small_cloud:"🌤",partly_sunny:"⛅",sun_behind_large_cloud:"🌥",sun_behind_rain_cloud:"🌦",cloud:"☁️",cloud_with_rain:"🌧",cloud_with_lightning_and_rain:"⛈",cloud_with_lightning:"🌩",zap:"⚡",fire:"🔥",boom:"💥",snowflake:"❄️",cloud_with_snow:"🌨",snowman:"⛄",snowman_with_snow:"☃",wind_face:"🌬",dash:"💨",tornado:"🌪",fog:"🌫",open_umbrella:"☂",umbrella:"☔",droplet:"💧",sweat_drops:"💦",ocean:"🌊",green_apple:"🍏",apple:"🍎",pear:"🍐",tangerine:"🍊",lemon:"🍋",banana:"🍌",watermelon:"🍉",grapes:"🍇",strawberry:"🍓",melon:"🍈",cherries:"🍒",peach:"🍑",pineapple:"🍍",coconut:"🥥",kiwi_fruit:"🥝",mango:"🥭",avocado:"🥑",broccoli:"🥦",tomato:"🍅",eggplant:"🍆",cucumber:"🥒",carrot:"🥕",hot_pepper:"🌶",potato:"🥔",corn:"🌽",leafy_greens:"🥬",sweet_potato:"🍠",peanuts:"🥜",honey_pot:"🍯",croissant:"🥐",bread:"🍞",baguette_bread:"🥖",bagel:"🥯",pretzel:"🥨",cheese:"🧀",egg:"🥚",bacon:"🥓",steak:"🥩",pancakes:"🥞",poultry_leg:"🍗",meat_on_bone:"🍖",bone:"🦴",fried_shrimp:"🍤",fried_egg:"🍳",hamburger:"🍔",fries:"🍟",stuffed_flatbread:"🥙",hotdog:"🌭",pizza:"🍕",sandwich:"🥪",canned_food:"🥫",spaghetti:"🍝",taco:"🌮",burrito:"🌯",green_salad:"🥗",shallow_pan_of_food:"🥘",ramen:"🍜",stew:"🍲",fish_cake:"🍥",fortune_cookie:"🥠",sushi:"🍣",bento:"🍱",curry:"🍛",rice_ball:"🍙",rice:"🍚",rice_cracker:"🍘",oden:"🍢",dango:"🍡",shaved_ice:"🍧",ice_cream:"🍨",icecream:"🍦",pie:"🥧",cake:"🍰",cupcake:"🧁",moon_cake:"🥮",birthday:"🎂",custard:"🍮",candy:"🍬",lollipop:"🍭",chocolate_bar:"🍫",popcorn:"🍿",dumpling:"🥟",doughnut:"🍩",cookie:"🍪",milk_glass:"🥛",beer:"🍺",beers:"🍻",clinking_glasses:"🥂",wine_glass:"🍷",tumbler_glass:"🥃",cocktail:"🍸",tropical_drink:"🍹",champagne:"🍾",sake:"🍶",tea:"🍵",cup_with_straw:"🥤",coffee:"☕",baby_bottle:"🍼",salt:"🧂",spoon:"🥄",fork_and_knife:"🍴",plate_with_cutlery:"🍽",bowl_with_spoon:"🥣",takeout_box:"🥡",chopsticks:"🥢",soccer:"⚽",basketball:"🏀",football:"🏈",baseball:"⚾",softball:"🥎",tennis:"🎾",volleyball:"🏐",rugby_football:"🏉",flying_disc:"🥏","8ball":"🎱",golf:"⛳",golfing_woman:"🏌️‍♀️",golfing_man:"🏌",ping_pong:"🏓",badminton:"🏸",goal_net:"🥅",ice_hockey:"🏒",field_hockey:"🏑",lacrosse:"🥍",cricket:"🏏",ski:"🎿",skier:"⛷",snowboarder:"🏂",person_fencing:"🤺",women_wrestling:"🤼‍♀️",men_wrestling:"🤼‍♂️",woman_cartwheeling:"🤸‍♀️",man_cartwheeling:"🤸‍♂️",woman_playing_handball:"🤾‍♀️",man_playing_handball:"🤾‍♂️",ice_skate:"⛸",curling_stone:"🥌",skateboard:"🛹",sled:"🛷",bow_and_arrow:"🏹",fishing_pole_and_fish:"🎣",boxing_glove:"🥊",martial_arts_uniform:"🥋",rowing_woman:"🚣‍♀️",rowing_man:"🚣",climbing_woman:"🧗‍♀️",climbing_man:"🧗‍♂️",swimming_woman:"🏊‍♀️",swimming_man:"🏊",woman_playing_water_polo:"🤽‍♀️",man_playing_water_polo:"🤽‍♂️",woman_in_lotus_position:"🧘‍♀️",man_in_lotus_position:"🧘‍♂️",surfing_woman:"🏄‍♀️",surfing_man:"🏄",bath:"🛀",basketball_woman:"⛹️‍♀️",basketball_man:"⛹",weight_lifting_woman:"🏋️‍♀️",weight_lifting_man:"🏋",biking_woman:"🚴‍♀️",biking_man:"🚴",mountain_biking_woman:"🚵‍♀️",mountain_biking_man:"🚵",horse_racing:"🏇",business_suit_levitating:"🕴",trophy:"🏆",running_shirt_with_sash:"🎽",medal_sports:"🏅",medal_military:"🎖","1st_place_medal":"🥇","2nd_place_medal":"🥈","3rd_place_medal":"🥉",reminder_ribbon:"🎗",rosette:"🏵",ticket:"🎫",tickets:"🎟",performing_arts:"🎭",art:"🎨",circus_tent:"🎪",woman_juggling:"🤹‍♀️",man_juggling:"🤹‍♂️",microphone:"🎤",headphones:"🎧",musical_score:"🎼",musical_keyboard:"🎹",drum:"🥁",saxophone:"🎷",trumpet:"🎺",guitar:"🎸",violin:"🎻",clapper:"🎬",video_game:"🎮",space_invader:"👾",dart:"🎯",game_die:"🎲",chess_pawn:"♟",slot_machine:"🎰",jigsaw:"🧩",bowling:"🎳",red_car:"🚗",taxi:"🚕",blue_car:"🚙",bus:"🚌",trolleybus:"🚎",racing_car:"🏎",police_car:"🚓",ambulance:"🚑",fire_engine:"🚒",minibus:"🚐",truck:"🚚",articulated_lorry:"🚛",tractor:"🚜",kick_scooter:"🛴",motorcycle:"🏍",bike:"🚲",motor_scooter:"🛵",rotating_light:"🚨",oncoming_police_car:"🚔",oncoming_bus:"🚍",oncoming_automobile:"🚘",oncoming_taxi:"🚖",aerial_tramway:"🚡",mountain_cableway:"🚠",suspension_railway:"🚟",railway_car:"🚃",train:"🚋",monorail:"🚝",bullettrain_side:"🚄",bullettrain_front:"🚅",light_rail:"🚈",mountain_railway:"🚞",steam_locomotive:"🚂",train2:"🚆",metro:"🚇",tram:"🚊",station:"🚉",flying_saucer:"🛸",helicopter:"🚁",small_airplane:"🛩",airplane:"✈️",flight_departure:"🛫",flight_arrival:"🛬",sailboat:"⛵",motor_boat:"🛥",speedboat:"🚤",ferry:"⛴",passenger_ship:"🛳",rocket:"🚀",artificial_satellite:"🛰",seat:"💺",canoe:"🛶",anchor:"⚓",construction:"🚧",fuelpump:"⛽",busstop:"🚏",vertical_traffic_light:"🚦",traffic_light:"🚥",checkered_flag:"🏁",ship:"🚢",ferris_wheel:"🎡",roller_coaster:"🎢",carousel_horse:"🎠",building_construction:"🏗",foggy:"🌁",tokyo_tower:"🗼",factory:"🏭",fountain:"⛲",rice_scene:"🎑",mountain:"⛰",mountain_snow:"🏔",mount_fuji:"🗻",volcano:"🌋",japan:"🗾",camping:"🏕",tent:"⛺",national_park:"🏞",motorway:"🛣",railway_track:"🛤",sunrise:"🌅",sunrise_over_mountains:"🌄",desert:"🏜",beach_umbrella:"🏖",desert_island:"🏝",city_sunrise:"🌇",city_sunset:"🌆",cityscape:"🏙",night_with_stars:"🌃",bridge_at_night:"🌉",milky_way:"🌌",stars:"🌠",sparkler:"🎇",fireworks:"🎆",rainbow:"🌈",houses:"🏘",european_castle:"🏰",japanese_castle:"🏯",stadium:"🏟",statue_of_liberty:"🗽",house:"🏠",house_with_garden:"🏡",derelict_house:"🏚",office:"🏢",department_store:"🏬",post_office:"🏣",european_post_office:"🏤",hospital:"🏥",bank:"🏦",hotel:"🏨",convenience_store:"🏪",school:"🏫",love_hotel:"🏩",wedding:"💒",classical_building:"🏛",church:"⛪",mosque:"🕌",synagogue:"🕍",kaaba:"🕋",shinto_shrine:"⛩",watch:"⌚",iphone:"📱",calling:"📲",computer:"💻",keyboard:"⌨",desktop_computer:"🖥",printer:"🖨",computer_mouse:"🖱",trackball:"🖲",joystick:"🕹",clamp:"🗜",minidisc:"💽",floppy_disk:"💾",cd:"💿",dvd:"📀",vhs:"📼",camera:"📷",camera_flash:"📸",video_camera:"📹",movie_camera:"🎥",film_projector:"📽",film_strip:"🎞",telephone_receiver:"📞",phone:"☎️",pager:"📟",fax:"📠",tv:"📺",radio:"📻",studio_microphone:"🎙",level_slider:"🎚",control_knobs:"🎛",compass:"🧭",stopwatch:"⏱",timer_clock:"⏲",alarm_clock:"⏰",mantelpiece_clock:"🕰",hourglass_flowing_sand:"⏳",hourglass:"⌛",satellite:"📡",battery:"🔋",electric_plug:"🔌",bulb:"💡",flashlight:"🔦",candle:"🕯",fire_extinguisher:"🧯",wastebasket:"🗑",oil_drum:"🛢",money_with_wings:"💸",dollar:"💵",yen:"💴",euro:"💶",pound:"💷",moneybag:"💰",credit_card:"💳",gem:"💎",balance_scale:"⚖",toolbox:"🧰",wrench:"🔧",hammer:"🔨",hammer_and_pick:"⚒",hammer_and_wrench:"🛠",pick:"⛏",nut_and_bolt:"🔩",gear:"⚙",brick:"🧱",chains:"⛓",magnet:"🧲",gun:"🔫",bomb:"💣",firecracker:"🧨",hocho:"🔪",dagger:"🗡",crossed_swords:"⚔",shield:"🛡",smoking:"🚬",skull_and_crossbones:"☠",coffin:"⚰",funeral_urn:"⚱",amphora:"🏺",crystal_ball:"🔮",prayer_beads:"📿",nazar_amulet:"🧿",barber:"💈",alembic:"⚗",telescope:"🔭",microscope:"🔬",hole:"🕳",pill:"💊",syringe:"💉",dna:"🧬",microbe:"🦠",petri_dish:"🧫",test_tube:"🧪",thermometer:"🌡",broom:"🧹",basket:"🧺",toilet_paper:"🧻",label:"🏷",bookmark:"🔖",toilet:"🚽",shower:"🚿",bathtub:"🛁",soap:"🧼",sponge:"🧽",lotion_bottle:"🧴",key:"🔑",old_key:"🗝",couch_and_lamp:"🛋",sleeping_bed:"🛌",bed:"🛏",door:"🚪",bellhop_bell:"🛎",teddy_bear:"🧸",framed_picture:"🖼",world_map:"🗺",parasol_on_ground:"⛱",moyai:"🗿",shopping:"🛍",shopping_cart:"🛒",balloon:"🎈",flags:"🎏",ribbon:"🎀",gift:"🎁",confetti_ball:"🎊",tada:"🎉",dolls:"🎎",wind_chime:"🎐",crossed_flags:"🎌",izakaya_lantern:"🏮",red_envelope:"🧧",email:"✉️",envelope_with_arrow:"📩",incoming_envelope:"📨","e-mail":"📧",love_letter:"💌",postbox:"📮",mailbox_closed:"📪",mailbox:"📫",mailbox_with_mail:"📬",mailbox_with_no_mail:"📭",package:"📦",postal_horn:"📯",inbox_tray:"📥",outbox_tray:"📤",scroll:"📜",page_with_curl:"📃",bookmark_tabs:"📑",receipt:"🧾",bar_chart:"📊",chart_with_upwards_trend:"📈",chart_with_downwards_trend:"📉",page_facing_up:"📄",date:"📅",calendar:"📆",spiral_calendar:"🗓",card_index:"📇",card_file_box:"🗃",ballot_box:"🗳",file_cabinet:"🗄",clipboard:"📋",spiral_notepad:"🗒",file_folder:"📁",open_file_folder:"📂",card_index_dividers:"🗂",newspaper_roll:"🗞",newspaper:"📰",notebook:"📓",closed_book:"📕",green_book:"📗",blue_book:"📘",orange_book:"📙",notebook_with_decorative_cover:"📔",ledger:"📒",books:"📚",open_book:"📖",safety_pin:"🧷",link:"🔗",paperclip:"📎",paperclips:"🖇",scissors:"✂️",triangular_ruler:"📐",straight_ruler:"📏",abacus:"🧮",pushpin:"📌",round_pushpin:"📍",triangular_flag_on_post:"🚩",white_flag:"🏳",black_flag:"🏴",rainbow_flag:"🏳️‍🌈",closed_lock_with_key:"🔐",lock:"🔒",unlock:"🔓",lock_with_ink_pen:"🔏",pen:"🖊",fountain_pen:"🖋",black_nib:"✒️",memo:"📝",pencil2:"✏️",crayon:"🖍",paintbrush:"🖌",mag:"🔍",mag_right:"🔎",heart:"❤️",orange_heart:"🧡",yellow_heart:"💛",green_heart:"💚",blue_heart:"💙",purple_heart:"💜",black_heart:"🖤",broken_heart:"💔",heavy_heart_exclamation:"❣",two_hearts:"💕",revolving_hearts:"💞",heartbeat:"💓",heartpulse:"💗",sparkling_heart:"💖",cupid:"💘",gift_heart:"💝",heart_decoration:"💟",peace_symbol:"☮",latin_cross:"✝",star_and_crescent:"☪",om:"🕉",wheel_of_dharma:"☸",star_of_david:"✡",six_pointed_star:"🔯",menorah:"🕎",yin_yang:"☯",orthodox_cross:"☦",place_of_worship:"🛐",ophiuchus:"⛎",aries:"♈",taurus:"♉",gemini:"♊",cancer:"♋",leo:"♌",virgo:"♍",libra:"♎",scorpius:"♏",sagittarius:"♐",capricorn:"♑",aquarius:"♒",pisces:"♓",id:"🆔",atom_symbol:"⚛",u7a7a:"🈳",u5272:"🈹",radioactive:"☢",biohazard:"☣",mobile_phone_off:"📴",vibration_mode:"📳",u6709:"🈶",u7121:"🈚",u7533:"🈸",u55b6:"🈺",u6708:"🈷️",eight_pointed_black_star:"✴️",vs:"🆚",accept:"🉑",white_flower:"💮",ideograph_advantage:"🉐",secret:"㊙️",congratulations:"㊗️",u5408:"🈴",u6e80:"🈵",u7981:"🈲",a:"🅰️",b:"🅱️",ab:"🆎",cl:"🆑",o2:"🅾️",sos:"🆘",no_entry:"⛔",name_badge:"📛",no_entry_sign:"🚫",x:"❌",o:"⭕",stop_sign:"🛑",anger:"💢",hotsprings:"♨️",no_pedestrians:"🚷",do_not_litter:"🚯",no_bicycles:"🚳","non-potable_water":"🚱",underage:"🔞",no_mobile_phones:"📵",exclamation:"❗",grey_exclamation:"❕",question:"❓",grey_question:"❔",bangbang:"‼️",interrobang:"⁉️",low_brightness:"🔅",high_brightness:"🔆",trident:"🔱",fleur_de_lis:"⚜",part_alternation_mark:"〽️",warning:"⚠️",children_crossing:"🚸",beginner:"🔰",recycle:"♻️",u6307:"🈯",chart:"💹",sparkle:"❇️",eight_spoked_asterisk:"✳️",negative_squared_cross_mark:"❎",white_check_mark:"✅",diamond_shape_with_a_dot_inside:"💠",cyclone:"🌀",loop:"➿",globe_with_meridians:"🌐",m:"Ⓜ️",atm:"🏧",sa:"🈂️",passport_control:"🛂",customs:"🛃",baggage_claim:"🛄",left_luggage:"🛅",wheelchair:"♿",no_smoking:"🚭",wc:"🚾",parking:"🅿️",potable_water:"🚰",mens:"🚹",womens:"🚺",baby_symbol:"🚼",restroom:"🚻",put_litter_in_its_place:"🚮",cinema:"🎦",signal_strength:"📶",koko:"🈁",ng:"🆖",ok:"🆗",up:"🆙",cool:"🆒",new:"🆕",free:"🆓",zero:"0️⃣",one:"1️⃣",two:"2️⃣",three:"3️⃣",four:"4️⃣",five:"5️⃣",six:"6️⃣",seven:"7️⃣",eight:"8️⃣",nine:"9️⃣",keycap_ten:"🔟",asterisk:"*⃣",eject_button:"⏏️",arrow_forward:"▶️",pause_button:"⏸",next_track_button:"⏭",stop_button:"⏹",record_button:"⏺",play_or_pause_button:"⏯",previous_track_button:"⏮",fast_forward:"⏩",rewind:"⏪",twisted_rightwards_arrows:"🔀",repeat:"🔁",repeat_one:"🔂",arrow_backward:"◀️",arrow_up_small:"🔼",arrow_down_small:"🔽",arrow_double_up:"⏫",arrow_double_down:"⏬",arrow_right:"➡️",arrow_left:"⬅️",arrow_up:"⬆️",arrow_down:"⬇️",arrow_upper_right:"↗️",arrow_lower_right:"↘️",arrow_lower_left:"↙️",arrow_upper_left:"↖️",arrow_up_down:"↕️",left_right_arrow:"↔️",arrows_counterclockwise:"🔄",arrow_right_hook:"↪️",leftwards_arrow_with_hook:"↩️",arrow_heading_up:"⤴️",arrow_heading_down:"⤵️",hash:"#️⃣",information_source:"ℹ️",abc:"🔤",abcd:"🔡",capital_abcd:"🔠",symbols:"🔣",musical_note:"🎵",notes:"🎶",wavy_dash:"〰️",curly_loop:"➰",heavy_check_mark:"✔️",arrows_clockwise:"🔃",heavy_plus_sign:"➕",heavy_minus_sign:"➖",heavy_division_sign:"➗",heavy_multiplication_x:"✖️",infinity:"♾",heavy_dollar_sign:"💲",currency_exchange:"💱",copyright:"©️",registered:"®️",tm:"™️",end:"🔚",back:"🔙",on:"🔛",top:"🔝",soon:"🔜",ballot_box_with_check:"☑️",radio_button:"🔘",white_circle:"⚪",black_circle:"⚫",red_circle:"🔴",large_blue_circle:"🔵",small_orange_diamond:"🔸",small_blue_diamond:"🔹",large_orange_diamond:"🔶",large_blue_diamond:"🔷",small_red_triangle:"🔺",black_small_square:"▪️",white_small_square:"▫️",black_large_square:"⬛",white_large_square:"⬜",small_red_triangle_down:"🔻",black_medium_square:"◼️",white_medium_square:"◻️",black_medium_small_square:"◾",white_medium_small_square:"◽",black_square_button:"🔲",white_square_button:"🔳",speaker:"🔈",sound:"🔉",loud_sound:"🔊",mute:"🔇",mega:"📣",loudspeaker:"📢",bell:"🔔",no_bell:"🔕",black_joker:"🃏",mahjong:"🀄",spades:"♠️",clubs:"♣️",hearts:"♥️",diamonds:"♦️",flower_playing_cards:"🎴",thought_balloon:"💭",right_anger_bubble:"🗯",speech_balloon:"💬",left_speech_bubble:"🗨",clock1:"🕐",clock2:"🕑",clock3:"🕒",clock4:"🕓",clock5:"🕔",clock6:"🕕",clock7:"🕖",clock8:"🕗",clock9:"🕘",clock10:"🕙",clock11:"🕚",clock12:"🕛",clock130:"🕜",clock230:"🕝",clock330:"🕞",clock430:"🕟",clock530:"🕠",clock630:"🕡",clock730:"🕢",clock830:"🕣",clock930:"🕤",clock1030:"🕥",clock1130:"🕦",clock1230:"🕧",afghanistan:"🇦🇫",aland_islands:"🇦🇽",albania:"🇦🇱",algeria:"🇩🇿",american_samoa:"🇦🇸",andorra:"🇦🇩",angola:"🇦🇴",anguilla:"🇦🇮",antarctica:"🇦🇶",antigua_barbuda:"🇦🇬",argentina:"🇦🇷",armenia:"🇦🇲",aruba:"🇦🇼",australia:"🇦🇺",austria:"🇦🇹",azerbaijan:"🇦🇿",bahamas:"🇧🇸",bahrain:"🇧🇭",bangladesh:"🇧🇩",barbados:"🇧🇧",belarus:"🇧🇾",belgium:"🇧🇪",belize:"🇧🇿",benin:"🇧🇯",bermuda:"🇧🇲",bhutan:"🇧🇹",bolivia:"🇧🇴",caribbean_netherlands:"🇧🇶",bosnia_herzegovina:"🇧🇦",botswana:"🇧🇼",brazil:"🇧🇷",british_indian_ocean_territory:"🇮🇴",british_virgin_islands:"🇻🇬",brunei:"🇧🇳",bulgaria:"🇧🇬",burkina_faso:"🇧🇫",burundi:"🇧🇮",cape_verde:"🇨🇻",cambodia:"🇰🇭",cameroon:"🇨🇲",canada:"🇨🇦",canary_islands:"🇮🇨",cayman_islands:"🇰🇾",central_african_republic:"🇨🇫",chad:"🇹🇩",chile:"🇨🇱",cn:"🇨🇳",christmas_island:"🇨🇽",cocos_islands:"🇨🇨",colombia:"🇨🇴",comoros:"🇰🇲",congo_brazzaville:"🇨🇬",congo_kinshasa:"🇨🇩",cook_islands:"🇨🇰",costa_rica:"🇨🇷",croatia:"🇭🇷",cuba:"🇨🇺",curacao:"🇨🇼",cyprus:"🇨🇾",czech_republic:"🇨🇿",denmark:"🇩🇰",djibouti:"🇩🇯",dominica:"🇩🇲",dominican_republic:"🇩🇴",ecuador:"🇪🇨",egypt:"🇪🇬",el_salvador:"🇸🇻",equatorial_guinea:"🇬🇶",eritrea:"🇪🇷",estonia:"🇪🇪",ethiopia:"🇪🇹",eu:"🇪🇺",falkland_islands:"🇫🇰",faroe_islands:"🇫🇴",fiji:"🇫🇯",finland:"🇫🇮",fr:"🇫🇷",french_guiana:"🇬🇫",french_polynesia:"🇵🇫",french_southern_territories:"🇹🇫",gabon:"🇬🇦",gambia:"🇬🇲",georgia:"🇬🇪",de:"🇩🇪",ghana:"🇬🇭",gibraltar:"🇬🇮",greece:"🇬🇷",greenland:"🇬🇱",grenada:"🇬🇩",guadeloupe:"🇬🇵",guam:"🇬🇺",guatemala:"🇬🇹",guernsey:"🇬🇬",guinea:"🇬🇳",guinea_bissau:"🇬🇼",guyana:"🇬🇾",haiti:"🇭🇹",honduras:"🇭🇳",hong_kong:"🇭🇰",hungary:"🇭🇺",iceland:"🇮🇸",india:"🇮🇳",indonesia:"🇮🇩",iran:"🇮🇷",iraq:"🇮🇶",ireland:"🇮🇪",isle_of_man:"🇮🇲",israel:"🇮🇱",it:"🇮🇹",cote_divoire:"🇨🇮",jamaica:"🇯🇲",jp:"🇯🇵",jersey:"🇯🇪",jordan:"🇯🇴",kazakhstan:"🇰🇿",kenya:"🇰🇪",kiribati:"🇰🇮",kosovo:"🇽🇰",kuwait:"🇰🇼",kyrgyzstan:"🇰🇬",laos:"🇱🇦",latvia:"🇱🇻",lebanon:"🇱🇧",lesotho:"🇱🇸",liberia:"🇱🇷",libya:"🇱🇾",liechtenstein:"🇱🇮",lithuania:"🇱🇹",luxembourg:"🇱🇺",macau:"🇲🇴",macedonia:"🇲🇰",madagascar:"🇲🇬",malawi:"🇲🇼",malaysia:"🇲🇾",maldives:"🇲🇻",mali:"🇲🇱",malta:"🇲🇹",marshall_islands:"🇲🇭",martinique:"🇲🇶",mauritania:"🇲🇷",mauritius:"🇲🇺",mayotte:"🇾🇹",mexico:"🇲🇽",micronesia:"🇫🇲",moldova:"🇲🇩",monaco:"🇲🇨",mongolia:"🇲🇳",montenegro:"🇲🇪",montserrat:"🇲🇸",morocco:"🇲🇦",mozambique:"🇲🇿",myanmar:"🇲🇲",namibia:"🇳🇦",nauru:"🇳🇷",nepal:"🇳🇵",netherlands:"🇳🇱",new_caledonia:"🇳🇨",new_zealand:"🇳🇿",nicaragua:"🇳🇮",niger:"🇳🇪",nigeria:"🇳🇬",niue:"🇳🇺",norfolk_island:"🇳🇫",northern_mariana_islands:"🇲🇵",north_korea:"🇰🇵",norway:"🇳🇴",oman:"🇴🇲",pakistan:"🇵🇰",palau:"🇵🇼",palestinian_territories:"🇵🇸",panama:"🇵🇦",papua_new_guinea:"🇵🇬",paraguay:"🇵🇾",peru:"🇵🇪",philippines:"🇵🇭",pitcairn_islands:"🇵🇳",poland:"🇵🇱",portugal:"🇵🇹",puerto_rico:"🇵🇷",qatar:"🇶🇦",reunion:"🇷🇪",romania:"🇷🇴",ru:"🇷🇺",rwanda:"🇷🇼",st_barthelemy:"🇧🇱",st_helena:"🇸🇭",st_kitts_nevis:"🇰🇳",st_lucia:"🇱🇨",st_pierre_miquelon:"🇵🇲",st_vincent_grenadines:"🇻🇨",samoa:"🇼🇸",san_marino:"🇸🇲",sao_tome_principe:"🇸🇹",saudi_arabia:"🇸🇦",senegal:"🇸🇳",serbia:"🇷🇸",seychelles:"🇸🇨",sierra_leone:"🇸🇱",singapore:"🇸🇬",sint_maarten:"🇸🇽",slovakia:"🇸🇰",slovenia:"🇸🇮",solomon_islands:"🇸🇧",somalia:"🇸🇴",south_africa:"🇿🇦",south_georgia_south_sandwich_islands:"🇬🇸",kr:"🇰🇷",south_sudan:"🇸🇸",es:"🇪🇸",sri_lanka:"🇱🇰",sudan:"🇸🇩",suriname:"🇸🇷",swaziland:"🇸🇿",sweden:"🇸🇪",switzerland:"🇨🇭",syria:"🇸🇾",taiwan:"🇹🇼",tajikistan:"🇹🇯",tanzania:"🇹🇿",thailand:"🇹🇭",timor_leste:"🇹🇱",togo:"🇹🇬",tokelau:"🇹🇰",tonga:"🇹🇴",trinidad_tobago:"🇹🇹",tunisia:"🇹🇳",tr:"🇹🇷",turkmenistan:"🇹🇲",turks_caicos_islands:"🇹🇨",tuvalu:"🇹🇻",uganda:"🇺🇬",ukraine:"🇺🇦",united_arab_emirates:"🇦🇪",uk:"🇬🇧",england:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",scotland:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",wales:"🏴󠁧󠁢󠁷󠁬󠁳󠁿",us:"🇺🇸",us_virgin_islands:"🇻🇮",uruguay:"🇺🇾",uzbekistan:"🇺🇿",vanuatu:"🇻🇺",vatican_city:"🇻🇦",venezuela:"🇻🇪",vietnam:"🇻🇳",wallis_futuna:"🇼🇫",western_sahara:"🇪🇭",yemen:"🇾🇪",zambia:"🇿🇲",zimbabwe:"🇿🇼",united_nations:"🇺🇳",pirate_flag:"🏴‍☠️"},sl=typeof navigator<"u"&&navigator.hardwareConcurrency?Math.max(1,Math.floor(navigator.hardwareConcurrency/2)):2,Sa=Li(()=>{if(typeof Worker<"u")try{return new rl}catch{}try{if(Wt)return Wt(nl)}catch{}const e={message:[],error:[]};return{addEventListener(t,n){e[t]||(e[t]=[]),e[t].push(n)},removeEventListener(t,n){if(!e[t])return;const i=e[t].indexOf(n);i!==-1&&e[t].splice(i,1)},postMessage(t){setTimeout(async()=>{try{const i={data:await al(t)};(e.message||[]).forEach(r=>r(i))}catch(n){const i={data:{id:t&&t.id,error:String(n)}};(e.message||[]).forEach(r=>r(i))}},0)},terminate(){Object.keys(e).forEach(t=>e[t].length=0)}}},"markdown",sl),Yt=()=>Sa.get(),Xr=(e,t=3e3)=>Sa.send(e,t),kt=[];function Qr(e){if(e&&(typeof e=="object"||typeof e=="function")){kt.push(e);try{Ee.use(e)}catch(t){k("[markdown] failed to apply plugin",t)}}}function ol(e){kt.length=0,Array.isArray(e)&&kt.push(...e.filter(t=>t&&typeof t=="object"));try{kt.forEach(t=>Ee.use(t))}catch(t){k("[markdown] failed to apply markdown extensions",t)}}async function Mn(e){if(kt&&kt.length){let{content:i,data:r}=ir(e||"");try{i=String(i||"").replace(/:([^:\s]+):/g,(s,o)=>Gr[o]||s)}catch{}Ee.setOptions({gfm:!0,mangle:!1,headerIds:!1,headerPrefix:""});try{kt.forEach(s=>Ee.use(s))}catch(s){k("[markdown] apply plugins failed",s)}const a=Ee.parse(i);try{const s=He();if(s){const o=s.parseFromString(a,"text/html"),l=o.querySelectorAll("h1,h2,h3,h4,h5,h6"),c=[],u=new Set,d=f=>{try{return String(f||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}},h=f=>{const p={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},m=f<=2?"has-text-weight-bold":f<=4?"has-text-weight-semibold":"has-text-weight-normal";return(p[f]+" "+m).trim()};l.forEach(f=>{try{const p=Number(f.tagName.substring(1)),m=(f.textContent||"").trim();let g=d(m)||"heading",b=g,y=2;for(;u.has(b);)b=g+"-"+y,y+=1;u.add(b),f.id=b,f.className=h(p),c.push({level:p,text:m,id:b})}catch{}});try{(o&&typeof o.getElementsByTagName=="function"?Array.from(o.getElementsByTagName("img")):o&&typeof o.querySelectorAll=="function"?Array.from(o.querySelectorAll("img")):[]).forEach(p=>{try{const m=p.getAttribute&&p.getAttribute("loading"),g=p.getAttribute&&p.getAttribute("data-want-lazy");!m&&!g&&p.setAttribute&&p.setAttribute("loading","lazy")}catch{}})}catch{}try{o.querySelectorAll("pre code, code[class]").forEach(f=>{try{const p=f.getAttribute&&f.getAttribute("class")||f.className||"",m=String(p||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(m)try{f.setAttribute&&f.setAttribute("class",m)}catch{f.className=m}else try{f.removeAttribute&&f.removeAttribute("class")}catch{f.className=""}}catch{}})}catch{}try{let f=null;try{typeof XMLSerializer<"u"?f=new XMLSerializer().serializeToString(o.body).replace(/^<body[^>]*>/i,"").replace(/<\/body>$/i,""):f=Array.from(o.body.childNodes||[]).map(m=>m&&typeof m.outerHTML=="string"?m.outerHTML:m&&typeof m.textContent=="string"?m.textContent:"").join("")}catch{try{f=o.body.innerHTML}catch{f=""}}return{html:f,meta:r||{},toc:c}}catch{return{html:"",meta:r||{},toc:c}}}}catch{}return{html:a,meta:r||{},toc:[]}}let t;if(typeof process<"u"&&process.env&&process.env.VITEST)try{const i=await Promise.resolve().then(()=>va);t=i.initRendererWorker&&i.initRendererWorker()}catch{t=Yt&&Yt()}else t=Yt&&Yt();try{e=String(e||"").replace(/:([^:\s]+):/g,(i,r)=>Gr[r]||i)}catch{}try{if(typeof Te<"u"&&Te&&typeof Te.getLanguage=="function"&&Te.getLanguage("plaintext")&&/```\s*\n/.test(String(e||""))){let{content:i,data:r}=ir(e||"");try{i=String(i||"").replace(/:([^:\s]+):/g,(c,u)=>Gr[u]||c)}catch{}Ee.setOptions({gfm:!0,headerIds:!0,mangle:!1,highlighted:(c,u)=>{try{return u&&Te.getLanguage&&Te.getLanguage(u)?Te.highlight(c,{language:u}).value:Te&&typeof Te.getLanguage=="function"&&Te.getLanguage("plaintext")?Te.highlight(c,{language:"plaintext"}).value:c}catch{return c}}});let a=Ee.parse(i);try{a=a.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g,(c,u)=>{try{if(u&&Te&&typeof Te.highlight=="function")try{const d=Te.highlight(u,{language:"plaintext"});return`<pre><code>${d&&d.value?d.value:d}</code></pre>`}catch{try{if(Te&&typeof Te.highlightElement=="function"){const h={innerHTML:u};return Te.highlightElement(h),`<pre><code>${h.innerHTML}</code></pre>`}}catch{}}}catch{}return c})}catch{}const s=[],o=new Set,l=c=>{try{return String(c||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}};return a=a.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(c,u,d,h)=>{const f=Number(u),p=h.replace(/<[^>]+>/g,"").trim();let m=l(p)||"heading",g=m,b=2;for(;o.has(g);)g=m+"-"+b,b+=1;o.add(g),s.push({level:f,text:p,id:g});const y={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},_=f<=2?"has-text-weight-bold":f<=4?"has-text-weight-semibold":"has-text-weight-normal",w=(y[f]+" "+_).trim(),S=((d||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${g}" class="${w}"`).trim();return`<h${f} ${S}>${h}</h${f}>`}),a=a.replace(/<img([^>]*)>/g,(c,u)=>/\bloading=/.test(u)?`<img${u}>`:/\bdata-want-lazy=/.test(u)?`<img${u}>`:`<img${u} loading="lazy">`),{html:a,meta:r||{},toc:s}}}catch{}if(!t)throw new Error("renderer worker required but unavailable");const n=await Xr({type:"render",md:e});if(!n||typeof n!="object"||n.html===void 0)throw new Error("renderer worker returned invalid response");try{const i=new Map,r=[],a=l=>{try{return String(l||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}},s=l=>{const c={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},u=l<=2?"has-text-weight-bold":l<=4?"has-text-weight-semibold":"has-text-weight-normal";return(c[l]+" "+u).trim()};let o=n.html;o=o.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(l,c,u,d)=>{const h=Number(c),f=d.replace(/<[^>]+>/g,"").trim(),p=(u||"").match(/\sid="([^"]+)"/),m=p?p[1]:a(f)||"heading",b=(i.get(m)||0)+1;i.set(m,b);const y=b===1?m:m+"-"+b;r.push({level:h,text:f,id:y});const _=s(h),A=((u||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${y}" class="${_}"`).trim();return`<h${h} ${A}>${d}</h${h}>`});try{const l=typeof document<"u"&&document.documentElement&&document.documentElement.getAttribute&&document.documentElement.getAttribute("data-nimbi-logo-moved")||"";if(l){const c=He();if(c){const u=c.parseFromString(o,"text/html");(u&&typeof u.getElementsByTagName=="function"?Array.from(u.getElementsByTagName("img")):u&&typeof u.querySelectorAll=="function"?Array.from(u.querySelectorAll("img")):[]).forEach(h=>{try{const f=h.getAttribute("src")||"";(f?new URL(f,location.href).toString():"")===l&&h.remove()}catch{}});try{typeof XMLSerializer<"u"?o=new XMLSerializer().serializeToString(u.body).replace(/^<body[^>]*>/i,"").replace(/<\/body>$/i,""):o=Array.from(u.body.childNodes||[]).map(f=>f&&typeof f.outerHTML=="string"?f.outerHTML:f&&typeof f.textContent=="string"?f.textContent:"").join("")}catch{try{o=u.body.innerHTML}catch{}}}else try{const u=l.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");o=o.replace(new RegExp(`<img[^>]*src=\\"${u}\\"[^>]*>`,"g"),"")}catch{}}}catch{}return{html:o,meta:n.meta||{},toc:r}}catch{return{html:n.html,meta:n.meta||{},toc:n.toc||[]}}}function Ln(e,t){const n=new Set,i=/```\s*([a-zA-Z0-9_\-+]+)?/g,r=new Set(["then","now","if","once","so","and","or","but","when","the","a","an","as","let","const","var","export","import","from","true","false","null","npm","run","echo","sudo","this","that","have","using","some","return","returns","function","console","log","error","warn","class","new","undefined","with","select","from","where","join","on","group","order","by","having","as","into","values","like","limit","offset","create","table","index","view","insert","update","delete","returning","and","or","not","all","any","exists","case","when","then","else","end","distance","geometry","you","which","would","why","cool","other","same","everything","check"]),a=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);let s;for(;s=i.exec(e);)if(s[1]){const o=s[1].toLowerCase();if(kr.has(o)||t&&t.size&&o.length<3&&!t.has(o)&&!(ct&&ct[o]&&t.has(ct[o])))continue;if(t&&t.size){if(t.has(o)){const c=t.get(o);c&&n.add(c);continue}if(ct&&ct[o]){const c=ct[o];if(t.has(c)){const u=t.get(c)||c;n.add(u);continue}}}(a.has(o)||o.length>=5&&o.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(o)&&!r.has(o))&&n.add(o)}return n}async function Kr(e,t){if(kt&&kt.length||typeof process<"u"&&process.env&&process.env.VITEST)return Ln(e||"",t);if(Yt&&Yt())try{const i=t&&t.size?Array.from(t.keys()):[],r=await Xr({type:"detect",md:String(e||""),supported:i});if(Array.isArray(r))return new Set(r)}catch(i){k("[markdown] detectFenceLanguagesAsync worker failed",i)}return Ln(e||"",t)}const va=Object.freeze(Object.defineProperty({__proto__:null,_sendToRenderer:Xr,addMarkdownExtension:Qr,detectFenceLanguages:Ln,detectFenceLanguagesAsync:Kr,initRendererWorker:Yt,markdownPlugins:kt,parseMarkdownToHtml:Mn,setMarkdownExtensions:ol},Symbol.toStringTag,{value:"Module"}));function ll(e,t=150,n={}){let i=null;const r=!!n.leading;return function(...s){const o=this;if(i&&clearTimeout(i),r&&!i)try{e.apply(o,s)}catch{}i=setTimeout(()=>{if(i=null,!r)try{e.apply(o,s)}catch{}},t)}}function cl(e){let t=!1;return function(...i){const r=this;if(!t){try{e.apply(r,i)}catch{}t=!0;const a=()=>{t=!1};typeof requestAnimationFrame=="function"?requestAnimationFrame(a):setTimeout(a,16);return}}}function ul(){let e=[],t=!1;return function(i){typeof i=="function"&&(e.push(i),!t&&(t=!0,typeof requestAnimationFrame=="function"?requestAnimationFrame(()=>{t=!1;const r=e.slice(0);e.length=0;for(const a of r)try{a()}catch{}}):setTimeout(()=>{t=!1;const r=e.slice(0);e.length=0;for(const a of r)try{a()}catch{}},0)))}}const Aa=ul(),hl=`/**
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
`;onmessage=async e=>{const t=e.data||{};try{if(t.type==="rewriteAnchors"){const{id:n,html:i,contentBase:r,pagePath:a}=t;try{const s=He();if(!s)postMessage({id:n,result:i});else{const o=s.parseFromString(i||"","text/html"),l=o.body;await Yr(l,r,a,{canonical:!0}),postMessage({id:n,result:o.body.innerHTML})}}catch(s){postMessage({id:n,error:String(s)})}return}}catch(n){postMessage({id:t.id,error:String(n)})}};async function Ea(e){try{if(e&&e.type==="rewriteAnchors"){const{id:t,html:n,contentBase:i,pagePath:r}=e;try{const a=He();if(!a)return{id:t,result:n};const s=a.parseFromString(n||"","text/html"),o=s.body;return await Yr(o,i,r,{canonical:!0}),{id:t,result:s.body.innerHTML}}catch(a){return{id:t,error:String(a)}}}return{id:e&&e.id,error:"unsupported message"}}catch(t){return{id:e&&e.id,error:String(t)}}}const dl=Object.freeze(Object.defineProperty({__proto__:null,handleAnchorWorkerMessage:Ea},Symbol.toStringTag,{value:"Module"}));function ft(e,t=null){try{const n=typeof location<"u"&&location&&typeof location.pathname=="string"&&location.pathname||"/";return String(n)+Mi(e,t)}catch{return Mi(e,t)}}function fl(...e){try{k(...e)}catch{}}function or(e){try{if(Dt(3))return!0}catch{}try{if(typeof le=="string"&&le)return!0}catch{}try{if(K&&K.size)return!0}catch{}try{if(Re&&Re.size)return!0}catch{}return!1}function xt(e,t){try{if(typeof nt=="function")try{nt(e,t);return}catch{}}catch{}try{e&&t&&K&&typeof K.set=="function"&&!K.has(e)&&K.set(e,t)}catch{}try{t&&U&&typeof U.set=="function"&&U.set(t,e)}catch{}try{if(Re&&typeof Re.has=="function"){if(!Re.has(t)){try{Re.add(t)}catch{}try{Array.isArray(Ie)&&!Ie.includes(t)&&Ie.push(t)}catch{}}}else try{Array.isArray(Ie)&&!Ie.includes(t)&&Ie.push(t)}catch{}}catch{}}function gl(e,t){try{return new URL(e,t).pathname}catch{try{return new URL(e,typeof location<"u"?location.href:"http://localhost/").pathname}catch{try{return(String(t||"").replace(/\/$/,"")+"/"+String(e||"").replace(/^\//,"")).replace(/\/\\+/g,"/")}catch{return String(e||"")}}}}function pl(e,t){const n=document.createElement("aside");n.className="menu box nimbi-nav";const i=document.createElement("p");i.className="menu-label",i.textContent=e("navigation"),n.appendChild(i);const r=document.createElement("ul");r.className="menu-list";try{const a=document.createDocumentFragment();t.forEach(s=>{const o=document.createElement("li"),l=document.createElement("a");try{const c=String(s.path||"");try{l.setAttribute("href",Pe(c))}catch{c&&c.indexOf("/")===-1?l.setAttribute("href","#"+encodeURIComponent(c)):l.setAttribute("href",ft(c))}}catch{l.setAttribute("href","#"+s.path)}if(l.textContent=s.name,o.appendChild(l),s.children&&s.children.length){const c=document.createElement("ul");s.children.forEach(u=>{const d=document.createElement("li"),h=document.createElement("a");try{const f=String(u.path||"");try{h.setAttribute("href",Pe(f))}catch{f&&f.indexOf("/")===-1?h.setAttribute("href","#"+encodeURIComponent(f)):h.setAttribute("href",ft(f))}}catch{h.setAttribute("href","#"+u.path)}h.textContent=u.name,d.appendChild(h),c.appendChild(d)}),o.appendChild(c)}a.appendChild(o)}),r.appendChild(a)}catch{t.forEach(s=>{try{const o=document.createElement("li"),l=document.createElement("a");try{const c=String(s.path||"");try{l.setAttribute("href",Pe(c))}catch{c&&c.indexOf("/")===-1?l.setAttribute("href","#"+encodeURIComponent(c)):l.setAttribute("href",ft(c))}}catch{l.setAttribute("href","#"+s.path)}if(l.textContent=s.name,o.appendChild(l),s.children&&s.children.length){const c=document.createElement("ul");s.children.forEach(u=>{const d=document.createElement("li"),h=document.createElement("a");try{const f=String(u.path||"");try{h.setAttribute("href",Pe(f))}catch{f&&f.indexOf("/")===-1?h.setAttribute("href","#"+encodeURIComponent(f)):h.setAttribute("href",ft(f))}}catch{h.setAttribute("href","#"+u.path)}h.textContent=u.name,d.appendChild(h),c.appendChild(d)}),o.appendChild(c)}r.appendChild(o)}catch(o){k("[htmlBuilder] createNavTree item failed",o)}})}return n.appendChild(r),n}function ml(e,t,n=""){const i=document.createElement("aside");i.className="menu box nimbi-toc-inner is-hidden-mobile";const r=document.createElement("p");r.className="menu-label",r.textContent=e("onThisPage"),i.appendChild(r);const a=document.createElement("ul");a.className="menu-list";try{const o={};(t||[]).forEach(l=>{try{if(!l||l.level===1)return;const c=Number(l.level)>=2?Number(l.level):2,u=document.createElement("li"),d=document.createElement("a"),h=ws(l.text||""),f=l.id||he(h);d.textContent=h;try{const b=String(n||"").replace(/^[\\.\\/]+/,""),y=b&&U&&U.has&&U.has(b)?U.get(b):b;y?d.href=Pe(y,f):d.href=`#${encodeURIComponent(f)}`}catch(b){k("[htmlBuilder] buildTocElement href normalization failed",b),d.href=`#${encodeURIComponent(f)}`}if(u.appendChild(d),c===2){a.appendChild(u),o[2]=u,Object.keys(o).forEach(b=>{Number(b)>2&&delete o[b]});return}let p=c-1;for(;p>2&&!o[p];)p--;p<2&&(p=2);let m=o[p];if(!m){a.appendChild(u),o[c]=u;return}let g=m.querySelector("ul");g||(g=document.createElement("ul"),m.appendChild(g)),g.appendChild(u),o[c]=u}catch(c){k("[htmlBuilder] buildTocElement item failed",c,l)}})}catch(o){k("[htmlBuilder] buildTocElement failed",o)}return i.appendChild(a),a.querySelectorAll("li").length<=1?null:i}function Ca(e){e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(n=>{n.id||(n.id=he(n.textContent||""))})}function yl(e,t,n){try{const i=e.querySelectorAll("img");if(i&&i.length){const r=t&&t.includes("/")?t.substring(0,t.lastIndexOf("/")+1):"";i.forEach(a=>{const s=a.getAttribute("src")||"";if(s&&!(/^(https?:)?\/\//.test(s)||s.startsWith("/")))try{const o=new URL(r+s,n).toString();a.src=o;try{a.getAttribute("loading")||a.setAttribute("data-want-lazy","1")}catch(l){k("[htmlBuilder] set image loading attribute failed",l)}}catch(o){k("[htmlBuilder] resolve image src failed",o)}})}}catch(i){k("[htmlBuilder] lazyLoadImages failed",i)}}function Ma(e,t,n){try{const i=t&&t.includes("/")?t.substring(0,t.lastIndexOf("/")+1):"";let r=null;try{const o=new URL(n,location.href);r=new URL(i||".",o).toString()}catch{try{r=new URL(i||".",location.href).toString()}catch{r=i||"./"}}let a=null;try{a=e.querySelectorAll("[src],[href],[srcset],[poster]")}catch{const l=[];try{l.push(...Array.from(e.getElementsByTagName("img")||[]))}catch{}try{l.push(...Array.from(e.getElementsByTagName("link")||[]))}catch{}try{l.push(...Array.from(e.getElementsByTagName("video")||[]))}catch{}try{l.push(...Array.from(e.getElementsByTagName("use")||[]))}catch{}try{l.push(...Array.from(e.querySelectorAll("[srcset]")||[]))}catch{}a=l}let s=Array.from(a||[]);try{const o=Array.from(e.getElementsByTagName("use")||[]);for(const l of o)s.indexOf(l)===-1&&s.push(l)}catch{}for(const o of Array.from(s||[]))try{const l=o.tagName?o.tagName.toLowerCase():"",c=u=>{try{const d=o.getAttribute(u)||"";if(!d||/^(https?:)?\/\//i.test(d)||d.startsWith("/")||d.startsWith("#"))return;try{o.setAttribute(u,new URL(d,r).toString())}catch(h){k("[htmlBuilder] rewrite asset attribute failed",u,d,h)}}catch(d){k("[htmlBuilder] rewriteAttr failed",d)}};if(o.hasAttribute&&o.hasAttribute("src")&&c("src"),o.hasAttribute&&o.hasAttribute("href")&&l!=="a"&&c("href"),o.hasAttribute&&o.hasAttribute("xlink:href")&&c("xlink:href"),o.hasAttribute&&o.hasAttribute("poster")&&c("poster"),o.hasAttribute&&o.hasAttribute("srcset")){const h=(o.getAttribute("srcset")||"").split(",").map(f=>f.trim()).filter(Boolean).map(f=>{const[p,m]=f.split(/\s+/,2);if(!p||/^(https?:)?\/\//i.test(p)||p.startsWith("/"))return f;try{const g=new URL(p,r).toString();return m?`${g} ${m}`:g}catch{return f}}).join(", ");o.setAttribute("srcset",h)}}catch(l){k("[htmlBuilder] rewriteRelativeAssets node processing failed",l)}}catch(i){k("[htmlBuilder] rewriteRelativeAssets failed",i)}}let La="",Vr=null,Ta="";async function Yr(e,t,n,i={}){try{i=i||{},typeof i.canonical>"u"&&(i.canonical=!0);const r=e.querySelectorAll("a");if(!r||!r.length)return;let a,s;if(t===La&&Vr)a=Vr,s=Ta;else{try{a=new URL(t,location.href),s=Gt(a.pathname)}catch{try{a=new URL(t,location.href),s=Gt(a.pathname)}catch{a=null,s="/"}}La=t,Vr=a,Ta=s}const o=new Set,l=[],c=new Set,u=[];for(const d of Array.from(r))try{try{if(d.closest&&d.closest("h1,h2,h3,h4,h5,h6"))continue}catch{}const h=d.getAttribute("href")||"";if(!h||Cr(h))continue;try{if(h.startsWith("?")||h.indexOf("?")!==-1)try{const p=new URL(h,t||location.href),m=p.searchParams.get("page");if(m&&m.indexOf("/")===-1&&n){const g=n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"";if(g){const b=V(g+m),y=i&&i.canonical?Pe(b,p.hash?p.hash.replace(/^#/,""):null):ft(b,p.hash?p.hash.replace(/^#/,""):null);d.setAttribute("href",y);continue}}}catch{}}catch{}if(h.startsWith("/")&&!h.endsWith(".md"))continue;const f=h.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(f){let p=f[1];const m=f[2];!p.startsWith("/")&&n&&(p=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+p);try{const g=new URL(p,t).pathname;let b=g.startsWith(s)?g.slice(s.length):g;b=V(b),l.push({node:d,mdPathRaw:p,frag:m,rel:b}),U.has(b)||o.add(b)}catch(g){k("[htmlBuilder] resolve mdPath failed",g)}continue}try{let p=h;!h.startsWith("/")&&n&&(h.startsWith("#")?p=n+h:p=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+h);const g=new URL(p,t).pathname||"";if(g&&g.indexOf(s)!==-1){let b=g.startsWith(s)?g.slice(s.length):g;if(b=V(b),b=an(b),b||(b=Rr),!b.endsWith(".md")){let y=null;try{if(U&&U.has&&U.has(b))y=U.get(b);else try{const _=String(b||"").replace(/^.*\//,"");_&&U.has&&U.has(_)&&(y=U.get(_))}catch(_){k("[htmlBuilder] mdToSlug baseName check failed",_)}}catch(_){k("[htmlBuilder] mdToSlug access check failed",_)}if(!y)try{const _=String(b||"").replace(/^.*\//,"");for(const[w,A]of K||[])if(A===b||A===_){y=w;break}}catch{}if(y){const _=i&&i.canonical?Pe(y,null):ft(y);d.setAttribute("href",_)}else{let _=b;try{/\.[^\/]+$/.test(String(b||""))||(_=String(b||"")+".html")}catch{_=b}c.add(_),u.push({node:d,rel:_})}}}}catch(p){k("[htmlBuilder] resolving href to URL failed",p)}}catch(h){k("[htmlBuilder] processing anchor failed",h)}if(o.size)if(or(t))await dn(Array.from(o),async d=>{try{try{const f=String(d).match(/([^\/]+)\.md$/),p=f&&f[1];if(p&&K.has(p)){try{const m=K.get(p);if(m)try{const g=typeof m=="string"?m:m&&m.default?m.default:null;g&&xt(p,g)}catch(g){k("[htmlBuilder] _storeSlugMapping failed",g)}}catch(m){k("[htmlBuilder] reading slugToMd failed",m)}return}}catch(f){k("[htmlBuilder] basename slug lookup failed",f)}const h=await Be(d,t);if(h&&h.raw){const f=(h.raw||"").match(/^#\s+(.+)$/m);if(f&&f[1]){const p=he(f[1].trim());if(p)try{xt(p,d)}catch(m){k("[htmlBuilder] setting slug mapping failed",m)}}}}catch(h){k("[htmlBuilder] fetchMarkdown during rewriteAnchors failed",h)}},6);else{try{k("[htmlBuilder] skipping md title probes (probing disabled)")}catch{}for(const d of Array.from(o))try{const h=String(d).match(/([^\/]+)\.md$/),f=h&&h[1];if(f){const p=he(f);if(p)try{xt(p,d)}catch(m){k("[htmlBuilder] setting fallback slug mapping failed",m)}}}catch{}}if(c.size)if(or(t))await dn(Array.from(c),async d=>{try{const h=await Be(d,t);if(h&&h.raw)try{const f=He(),p=f?f.parseFromString(h.raw,"text/html"):null,m=p?p.querySelector("title"):null,g=p?p.querySelector("h1"):null,b=m&&m.textContent&&m.textContent.trim()?m.textContent.trim():g&&g.textContent?g.textContent.trim():null;if(b){const y=he(b);if(y)try{xt(y,d)}catch(_){k("[htmlBuilder] setting html slug mapping failed",_)}}}catch(f){k("[htmlBuilder] parse fetched HTML failed",f)}}catch(h){k("[htmlBuilder] fetchMarkdown for htmlPending failed",h)}},5);else{try{k("[htmlBuilder] skipping html title probes (probing disabled)")}catch{}for(const d of Array.from(c))try{const h=String(d).match(/([^\/]+)\.html$/),f=h&&h[1];if(f){const p=he(f);if(p)try{xt(p,d)}catch(m){k("[htmlBuilder] setting fallback html slug mapping failed",m)}}}catch{}}for(const d of l){const{node:h,frag:f,rel:p}=d;let m=null;try{U.has(p)&&(m=U.get(p))}catch(g){k("[htmlBuilder] mdToSlug access failed",g)}if(m){const g=i&&i.canonical?Pe(m,f):ft(m,f);h.setAttribute("href",g)}else{const g=i&&i.canonical?Pe(p,f):ft(p,f);h.setAttribute("href",g)}}for(const d of u){const{node:h,rel:f}=d;let p=null;try{U.has(f)&&(p=U.get(f))}catch(m){k("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo",m)}if(!p)try{const m=String(f||"").replace(/^.*\//,"");U.has(m)&&(p=U.get(m))}catch(m){k("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo",m)}if(p){const m=i&&i.canonical?Pe(p,null):ft(p);h.setAttribute("href",m)}else{const m=i&&i.canonical?Pe(f,null):ft(f);h.setAttribute("href",m)}}}catch(r){k("[htmlBuilder] rewriteAnchors failed",r)}}function bl(e,t,n,i){const r=t.querySelector("h1"),a=r?(r.textContent||"").trim():"";let s="";try{let o="";try{e&&e.meta&&e.meta.title&&(o=String(e.meta.title).trim())}catch{}if(!o&&a&&(o=a),!o)try{const l=t.querySelector("h2");l&&l.textContent&&(o=String(l.textContent).trim())}catch{}!o&&n&&(o=String(n)),o&&(s=he(o)),s||(s=Rr);try{if(n){try{xt(s,n)}catch(l){k("[htmlBuilder] computeSlug set slug mapping failed",l)}try{const l=V(String(n||""));if(U&&typeof U.has=="function"&&U.has(l))s=U.get(l);else try{for(const[c,u]of K||[])try{const d=typeof u=="string"?u:u&&u.default?u.default:null;if(d&&V(String(d))===l){s=c;break}}catch{}}catch{}}catch{}}}catch(l){k("[htmlBuilder] computeSlug set slug mapping failed",l)}try{let l=i||"";if(!l)try{const c=et(typeof location<"u"?location.href:"");c&&c.anchor&&c.page&&String(c.page)===String(s)?l=c.anchor:l=""}catch{l=""}try{history.replaceState({page:s},"",ft(s,l))}catch(c){k("[htmlBuilder] computeSlug history replace failed",c)}}catch(l){k("[htmlBuilder] computeSlug inner failed",l)}}catch(o){k("[htmlBuilder] computeSlug failed",o)}try{if(e&&e.meta&&e.meta.title&&r){const o=String(e.meta.title).trim();if(o&&o!==a){try{s&&(r.id=s)}catch{}try{if(Array.isArray(e.toc))for(const l of e.toc)try{if(l&&Number(l.level)===1&&String(l.text).trim()===(a||"").trim()){l.id=s;break}}catch{}}catch{}}}}catch{}return{topH1:r,h1Text:a,slugKey:s}}async function wl(e,t){if(!e||!e.length)return;const n=new Set;for(const s of Array.from(e||[]))try{const o=s.getAttribute("href")||"";if(!o)continue;let u=V(o).split(/::|#/,2)[0];try{const h=u.indexOf("?");h!==-1&&(u=u.slice(0,h))}catch{}if(!u||(u.includes(".")||(u=u+".html"),!/\.html(?:$|[?#])/.test(u)&&!u.toLowerCase().endsWith(".html")))continue;const d=u;try{if(U&&U.has&&U.has(d))continue}catch(h){k("[htmlBuilder] mdToSlug check failed",h)}try{let h=!1;for(const f of K.values())if(f===d){h=!0;break}if(h)continue}catch(h){k("[htmlBuilder] slugToMd iteration failed",h)}n.add(d)}catch(o){k("[htmlBuilder] preScanHtmlSlugs anchor iteration failed",o)}if(!n.size)return;if(!or()){try{k("[htmlBuilder] skipping preScanHtmlSlugs (probing disabled)")}catch{}for(const s of Array.from(n))try{const o=String(s).match(/([^\/]+)\.html$/),l=o&&o[1];if(l){const c=he(l);if(c)try{xt(c,s)}catch(u){k("[htmlBuilder] setting fallback preScanHtmlSlugs mapping failed",u)}}}catch{}return}const i=async s=>{try{const o=await Be(s,t);if(o&&o.raw)try{const c=He().parseFromString(o.raw,"text/html"),u=c.querySelector("title"),d=c.querySelector("h1"),h=u&&u.textContent&&u.textContent.trim()?u.textContent.trim():d&&d.textContent?d.textContent.trim():null;if(h){const f=he(h);if(f)try{xt(f,s)}catch(p){k("[htmlBuilder] set slugToMd/mdToSlug failed",p)}}}catch(l){k("[htmlBuilder] parse HTML title failed",l)}}catch(o){k("[htmlBuilder] fetchAndExtract failed",o)}},r=Array.from(n),a=Math.max(1,Math.min(pn(),r.length||1));await dn(r,i,a)}async function _l(e,t){if(!e||!e.length)return;const n=[],i=new Set;let r="";try{const a=new URL(t,typeof location<"u"?location.href:"http://localhost/");r=Gt(a.pathname)}catch(a){r="",k("[htmlBuilder] preMapMdSlugs parse base failed",a)}for(const a of Array.from(e||[]))try{const s=a.getAttribute("href")||"";if(!s)continue;const o=s.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(o){let l=V(o[1]);try{let c;try{c=gl(l,t)}catch(d){c=l,k("[htmlBuilder] resolve mdPath URL failed",d)}const u=c&&r&&c.startsWith(r)?c.slice(r.length):String(c||"").replace(/^\//,"");n.push({rel:u}),U.has(u)||i.add(u)}catch(c){k("[htmlBuilder] rewriteAnchors failed",c)}continue}}catch(s){k("[htmlBuilder] preMapMdSlugs anchor iteration failed",s)}if(i.size)if(or())await Promise.all(Array.from(i).map(async a=>{try{const s=String(a).match(/([^\/]+)\.md$/),o=s&&s[1];if(o&&K.has(o)){try{const l=K.get(o);if(l)try{const c=typeof l=="string"?l:l&&l.default?l.default:null;c&&xt(o,c)}catch(c){k("[htmlBuilder] _storeSlugMapping failed",c)}}catch(l){k("[htmlBuilder] preMapMdSlugs slug map access failed",l)}return}}catch(s){k("[htmlBuilder] preMapMdSlugs basename check failed",s)}try{const s=await Be(a,t);if(s&&s.raw){const o=(s.raw||"").match(/^#\s+(.+)$/m);if(o&&o[1]){const l=he(o[1].trim());if(l)try{xt(l,a)}catch(c){k("[htmlBuilder] preMapMdSlugs setting slug mapping failed",c)}}}}catch(s){k("[htmlBuilder] preMapMdSlugs fetch failed",s)}}));else try{k("[htmlBuilder] skipping preMapMdSlugs probes (probing disabled)")}catch{}}He();function Jr(e){try{const n=He().parseFromString(e||"","text/html");Ca(n);try{n.querySelectorAll("img").forEach(l=>{try{l.getAttribute("loading")||l.setAttribute("data-want-lazy","1")}catch(c){k("[htmlBuilder] parseHtml set image loading attribute failed",c)}})}catch(o){k("[htmlBuilder] parseHtml query images failed",o)}n.querySelectorAll("pre code, code[class]").forEach(o=>{try{const l=o.getAttribute&&o.getAttribute("class")||o.className||"",c=l.match(/language-([a-zA-Z0-9_+-]+)/)||l.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(c&&c[1]){const u=(c[1]||"").toLowerCase(),d=Ae.size&&(Ae.get(u)||Ae.get(String(u).toLowerCase()))||u;try{(async()=>{try{await en(d)}catch(h){k("[htmlBuilder] registerLanguage failed",h)}})()}catch(h){k("[htmlBuilder] schedule registerLanguage failed",h)}}else try{if(Te&&typeof Te.getLanguage=="function"&&Te.getLanguage("plaintext")){const u=Te.highlight?Te.highlight(o.textContent||"",{language:"plaintext"}):null;if(u&&u.value)try{if(typeof document<"u"&&document.createRange&&typeof document.createRange=="function"){const d=document.createRange().createContextualFragment(u.value);if(typeof o.replaceChildren=="function")o.replaceChildren(...Array.from(d.childNodes));else{for(;o.firstChild;)o.removeChild(o.firstChild);o.appendChild(d)}}else o.innerHTML=u.value}catch{try{o.innerHTML=u.value}catch{}}}}catch(u){k("[htmlBuilder] plaintext highlight fallback failed",u)}}catch(l){k("[htmlBuilder] code element processing failed",l)}});const r=[];n.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(o=>{r.push({level:Number(o.tagName.substring(1)),text:(o.textContent||"").trim(),id:o.id})});const s={};try{const o=n.querySelector("title");o&&o.textContent&&String(o.textContent).trim()&&(s.title=String(o.textContent).trim())}catch{}return{html:n.body.innerHTML,meta:s,toc:r}}catch(t){return k("[htmlBuilder] parseHtml failed",t),{html:e||"",meta:{},toc:[]}}}async function kl(e){const t=Kr?await Kr(e||"",Ae):Ln(e||"",Ae),n=new Set(t),i=[];for(const r of n)try{const a=Ae.size&&(Ae.get(r)||Ae.get(String(r).toLowerCase()))||r;try{i.push(en(a))}catch(s){k("[htmlBuilder] ensureLanguages push canonical failed",s)}if(String(r)!==String(a))try{i.push(en(r))}catch(s){k("[htmlBuilder] ensureLanguages push alias failed",s)}}catch(a){k("[htmlBuilder] ensureLanguages inner failed",a)}try{await Promise.all(i)}catch(r){k("[htmlBuilder] ensureLanguages failed",r)}}async function xl(e){if(await kl(e),Mn){const t=await Mn(e||"");return!t||typeof t!="object"?{html:String(e||""),meta:{},toc:[]}:(Array.isArray(t.toc)||(t.toc=[]),t.meta||(t.meta={}),t)}return{html:String(e||""),meta:{},toc:[]}}async function Sl(e,t,n,i,r){let a=null;if(t.isHtml)try{const d=He();if(d){const h=d.parseFromString(t.raw||"","text/html");try{Ma(h.body,n,r)}catch(f){k("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)",f)}a=Jr(h.documentElement&&h.documentElement.outerHTML?h.documentElement.outerHTML:t.raw||"")}else a=Jr(t.raw||"")}catch{a=Jr(t.raw||"")}else a=await xl(t.raw||"");const s=document.createElement("article");s.className="nimbi-article content";try{const d=He&&He();if(d){const h=d.parseFromString(String(a.html||""),"text/html"),f=Array.from(h.body.childNodes||[]);f.length?s.replaceChildren(...f):s.innerHTML=a.html}else try{const h=document&&typeof document.createRange=="function"?document.createRange():null;if(h&&typeof h.createContextualFragment=="function"){const f=h.createContextualFragment(String(a.html||""));s.replaceChildren(...Array.from(f.childNodes))}else s.innerHTML=a.html}catch{s.innerHTML=a.html}}catch{try{s.innerHTML=a.html}catch(h){k("[htmlBuilder] set article html failed",h)}}try{Ma(s,n,r)}catch(d){k("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle",d)}try{Ca(s)}catch(d){k("[htmlBuilder] addHeadingIds failed",d)}try{s.querySelectorAll("pre code, code[class]").forEach(h=>{try{const f=h.getAttribute&&h.getAttribute("class")||h.className||"",p=String(f||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(p)try{h.setAttribute&&h.setAttribute("class",p)}catch(m){h.className=p,k("[htmlBuilder] set element class failed",m)}else try{h.removeAttribute&&h.removeAttribute("class")}catch(m){h.className="",k("[htmlBuilder] remove element class failed",m)}}catch(f){k("[htmlBuilder] code element cleanup failed",f)}})}catch(d){k("[htmlBuilder] processing code elements failed",d)}try{Si(s)}catch(d){k("[htmlBuilder] observeCodeBlocks failed",d)}yl(s,n,r);try{(s.querySelectorAll&&s.querySelectorAll("img")||[]).forEach(h=>{try{const f=h.parentElement;if(!f||f.tagName.toLowerCase()!=="p"||f.childNodes.length!==1)return;const p=document.createElement("figure");p.className="image",f.replaceWith(p),p.appendChild(h)}catch{}})}catch(d){k("[htmlBuilder] wrap images in Bulma image helper failed",d)}try{(s.querySelectorAll&&s.querySelectorAll("table")||[]).forEach(h=>{try{if(h.classList)h.classList.contains("table")||h.classList.add("table");else{const f=h.getAttribute&&h.getAttribute("class")?h.getAttribute("class"):"",p=String(f||"").split(/\s+/).filter(Boolean);p.indexOf("table")===-1&&p.push("table");try{h.setAttribute&&h.setAttribute("class",p.join(" "))}catch{h.className=p.join(" ")}}}catch{}})}catch(d){k("[htmlBuilder] add Bulma table class failed",d)}const{topH1:o,h1Text:l,slugKey:c}=bl(a,s,n,i);try{if(o&&a&&a.meta&&(a.meta.author||a.meta.date)&&!(o.parentElement&&o.parentElement.querySelector&&o.parentElement.querySelector(".nimbi-article-subtitle"))){const h=a.meta.author?String(a.meta.author).trim():"",f=a.meta.date?String(a.meta.date).trim():"";let p="";try{const g=new Date(f);f&&!isNaN(g.getTime())?p=g.toLocaleDateString():p=f}catch{p=f}const m=[];if(h&&m.push(h),p&&m.push(p),m.length){const g=document.createElement("p"),b=m[0]?String(m[0]).replace(/"/g,"").trim():"",y=m.slice(1);if(g.className="nimbi-article-subtitle is-6 has-text-grey-light",b){const _=document.createElement("span");_.className="nimbi-article-author",_.textContent=b,g.appendChild(_)}if(y.length){const _=document.createElement("span");_.className="nimbi-article-meta",_.textContent=y.join(" • "),g.appendChild(_)}try{o.parentElement.insertBefore(g,o.nextSibling)}catch{try{o.insertAdjacentElement("afterend",g)}catch{}}}}}catch{}try{await Cl(s,r,n)}catch(d){fl("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread",d),await Yr(s,r,n)}const u=ml(e,a.toc,n);return{article:s,parsed:a,toc:u,topH1:o,h1Text:l,slugKey:c}}function vl(e){if(!(!e||!e.querySelectorAll))try{const t=Array.from(e.querySelectorAll("script"));for(const n of t)try{const i=document.createElement("script");for(const a of Array.from(n.attributes||[]))try{i.setAttribute(a.name,a.value)}catch{}if(!n.src){const a=n.textContent||"";let s=!1;try{new Function(a)(),s=!0}catch{s=!1}if(s){n.parentNode&&n.parentNode.removeChild(n);try{Tt("[htmlBuilder] executed inline script via Function")}catch{}continue}try{i.type="module"}catch{}i.textContent=a}if(n.src)try{if(document.querySelector&&document.querySelector(`script[src="${n.src}"]`)){n.parentNode&&n.parentNode.removeChild(n);continue}}catch{}const r=n.src||"<inline>";i.addEventListener("error",a=>{try{k("[htmlBuilder] injected script error",{src:r,ev:a})}catch{}}),i.addEventListener("load",()=>{try{Tt("[htmlBuilder] injected script loaded",{src:r,hasNimbi:!!(window&&window.nimbiCMS)})}catch{}});try{(document.head||document.body||document.documentElement).appendChild(i)}catch{try{try{i.type="text/javascript"}catch{}(document.head||document.body||document.documentElement).appendChild(i)}catch(s){try{k("[htmlBuilder] injected script append failed, skipping",{src:r,err:s})}catch{}}}n.parentNode&&n.parentNode.removeChild(n);try{Tt("[htmlBuilder] executed injected script",r)}catch{}}catch(i){k("[htmlBuilder] execute injected script failed",i)}}catch{}}function Ra(e,t,n){if(e)try{typeof e.replaceChildren=="function"?e.replaceChildren():e.innerHTML=""}catch{try{e.innerHTML=""}catch{}}const i=document.createElement("article");i.className="nimbi-article content nimbi-not-found";const r=document.createElement("h1");r.textContent=t&&t("notFound")||"Page not found";const a=document.createElement("p");a.textContent=n&&n.message?String(n.message):"Failed to resolve the requested page.",i.appendChild(r),i.appendChild(a),e&&e.appendChild&&e.appendChild(i);try{if(!le)try{const s=document.createElement("p"),o=t&&t("goHome")||"Go back to";s.textContent=o+" ";const l=document.createElement("a");try{l.href=Pe(bt)}catch{l.href=Pe(bt||"")}l.textContent=t&&t("home")||"Home",s.appendChild(l),e&&e.appendChild&&e.appendChild(s)}catch{}}catch{}try{try{Vn({title:t&&t("notFound")||"Not Found",description:t&&t("notFoundDescription")||""},le,t&&t("notFound")||"Not Found",t&&t("notFoundDescription")||"")}catch{}}catch{}try{try{const s=typeof window<"u"&&window.__nimbiNotFoundRedirect?String(window.__nimbiNotFoundRedirect).trim():null;if(s)try{const o=new URL(s,location.origin).toString();if((location.href||"").split("#")[0]!==o)try{location.replace(o)}catch{location.href=o}}catch{}}catch{}}catch{}}const za=ps(hl,dl&&Ea,"anchor");function Al(){return za.get()}function El(e){return za.send(e,2e3)}async function Cl(e,t,n){if(!Al())throw new Error("anchor worker unavailable");if(!e||typeof e.innerHTML!="string")throw new Error("invalid article element");const r=String(e.innerHTML),a=await El({type:"rewriteAnchors",html:r,contentBase:t,pagePath:n});if(a&&typeof a=="string")try{const s=He&&He();if(s){const o=s.parseFromString(String(a||""),"text/html"),l=Array.from(o.body.childNodes||[]);l.length?e.replaceChildren(...l):e.innerHTML=a}else try{const o=document&&typeof document.createRange=="function"?document.createRange():null;if(o&&typeof o.createContextualFragment=="function"){const l=o.createContextualFragment(String(a||""));e.replaceChildren(...Array.from(l.childNodes))}else e.innerHTML=a}catch{e.innerHTML=a}}catch(s){k("[htmlBuilder] applying rewritten anchors failed",s)}}function Ml(e){try{e.addEventListener("click",t=>{const n=t.target&&t.target.closest?t.target.closest("a"):null;if(!n)return;const i=n.getAttribute("href")||"";try{const r=et(i),a=r&&r.page?r.page:null,s=r&&r.anchor?r.anchor:null;if(!a&&!s)return;t.preventDefault();let o=null;try{history&&history.state&&history.state.page&&(o=history.state.page)}catch(l){o=null,k("[htmlBuilder] access history.state failed",l)}try{o||(o=new URL(location.href).searchParams.get("page"))}catch(l){k("[htmlBuilder] parse current location failed",l)}if(!a&&s||a&&o&&String(a)===String(o)){try{if(!a&&s)try{history.replaceState(history.state,"",(location.pathname||"")+(location.search||"")+(s?"#"+encodeURIComponent(s):""))}catch(l){k("[htmlBuilder] history.replaceState failed",l)}else try{history.replaceState({page:o||a},"",ft(o||a,s))}catch(l){k("[htmlBuilder] history.replaceState failed",l)}}catch(l){k("[htmlBuilder] update history for anchor failed",l)}try{t.stopImmediatePropagation&&t.stopImmediatePropagation(),t.stopPropagation&&t.stopPropagation()}catch(l){k("[htmlBuilder] stopPropagation failed",l)}try{ei(s)}catch(l){k("[htmlBuilder] scrollToAnchorOrTop failed",l)}return}history.pushState({page:a},"",ft(a,s));try{if(typeof window<"u"&&typeof window.renderByQuery=="function")try{window.renderByQuery()}catch(l){k("[htmlBuilder] window.renderByQuery failed",l)}else if(typeof window<"u")try{window.dispatchEvent(new PopStateEvent("popstate"))}catch(l){k("[htmlBuilder] dispatch popstate failed",l)}else try{renderByQuery()}catch(l){k("[htmlBuilder] renderByQuery failed",l)}}catch(l){k("[htmlBuilder] SPA navigation invocation failed",l)}}catch(r){k("[htmlBuilder] non-URL href in attachTocClickHandler",r)}})}catch(t){k("[htmlBuilder] attachTocClickHandler failed",t)}}function ei(e){const t=document.querySelector(".nimbi-cms")||null;if(e){const n=document.getElementById(e);if(n)try{const i=()=>{try{if(t&&t.scrollTo&&t.contains(n)){const r=n.getBoundingClientRect().top-t.getBoundingClientRect().top+t.scrollTop;t.scrollTo({top:r,behavior:"smooth"})}else try{n.scrollIntoView({behavior:"smooth",block:"start"})}catch{try{n.scrollIntoView()}catch(a){k("[htmlBuilder] scrollIntoView failed",a)}}}catch{try{n.scrollIntoView()}catch(a){k("[htmlBuilder] final scroll fallback failed",a)}}};try{requestAnimationFrame(()=>setTimeout(i,50))}catch(r){k("[htmlBuilder] scheduling scroll failed",r),setTimeout(i,50)}}catch(i){try{n.scrollIntoView()}catch(r){k("[htmlBuilder] final scroll fallback failed",r)}k("[htmlBuilder] doScroll failed",i)}}else try{t&&t.scrollTo?t.scrollTo({top:0,behavior:"smooth"}):window.scrollTo(0,0)}catch(n){try{window.scrollTo(0,0)}catch(i){k("[htmlBuilder] window.scrollTo failed",i)}k("[htmlBuilder] scroll to top failed",n)}}function Ll(e,t,{mountOverlay:n=null,container:i=null,mountEl:r=null,navWrap:a=null,t:s=null}={}){try{const o=s||(m=>typeof m=="string"?m:""),l=i||document.querySelector(".nimbi-cms"),c=r||document.querySelector(".nimbi-mount"),u=n||document.querySelector(".nimbi-overlay"),d=a||document.querySelector(".nimbi-nav-wrap");let f=document.querySelector(".nimbi-scroll-top");if(!f){f=document.createElement("button"),f.className="nimbi-scroll-top button is-primary is-rounded is-small",f.setAttribute("aria-label",o("scrollToTop")),f.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';try{u&&u.appendChild?u.appendChild(f):l&&l.appendChild?l.appendChild(f):c&&c.appendChild?c.appendChild(f):document.body.appendChild(f)}catch{try{document.body.appendChild(f)}catch(g){k("[htmlBuilder] append scroll top button failed",g)}}try{try{Ei(f)}catch{}}catch(m){k("[htmlBuilder] set scroll-top button theme registration failed",m)}f.addEventListener("click",()=>{try{i&&i.scrollTo?i.scrollTo({top:0,left:0,behavior:"smooth"}):r&&r.scrollTo?r.scrollTo({top:0,left:0,behavior:"smooth"}):window.scrollTo({top:0,left:0,behavior:"smooth"})}catch{try{i&&(i.scrollTop=0)}catch(g){k("[htmlBuilder] fallback container scrollTop failed",g)}try{r&&(r.scrollTop=0)}catch(g){k("[htmlBuilder] fallback mountEl scrollTop failed",g)}try{document.documentElement.scrollTop=0}catch(g){k("[htmlBuilder] fallback document scrollTop failed",g)}}})}const p=d&&d.querySelector?d.querySelector(".menu-label"):null;if(t){if(!f._nimbiObserver)if(typeof globalThis<"u"&&typeof globalThis.IntersectionObserver<"u"){const m=globalThis.IntersectionObserver,g=new m(b=>{for(const y of b)y.target instanceof Element&&(y.isIntersecting?(f.classList.remove("show"),p&&p.classList.remove("show")):(f.classList.add("show"),p&&p.classList.add("show")))},{root:i instanceof Element?i:r instanceof Element?r:null,threshold:0});f._nimbiObserver=g}else f._nimbiObserver=null;try{f._nimbiObserver&&typeof f._nimbiObserver.disconnect=="function"&&f._nimbiObserver.disconnect()}catch(m){k("[htmlBuilder] observer disconnect failed",m)}try{f._nimbiObserver&&typeof f._nimbiObserver.observe=="function"&&f._nimbiObserver.observe(t)}catch(m){k("[htmlBuilder] observer observe failed",m)}try{const m=()=>{try{const g=l instanceof Element?l.getBoundingClientRect():{top:0,bottom:window.innerHeight},b=t.getBoundingClientRect();!(b.bottom<g.top||b.top>g.bottom)?(f.classList.remove("show"),p&&p.classList.remove("show")):(f.classList.add("show"),p&&p.classList.add("show"))}catch(g){k("[htmlBuilder] checkIntersect failed",g)}};m(),typeof globalThis<"u"&&typeof globalThis.IntersectionObserver<"u"||setTimeout(m,100)}catch(m){k("[htmlBuilder] checkIntersect outer failed",m)}}else{f.classList.remove("show"),p&&p.classList.remove("show");const m=i instanceof Element?i:r instanceof Element?r:window,g=()=>{try{(m===window?window.scrollY:m.scrollTop||0)>10?(f.classList.add("show"),p&&p.classList.add("show")):(f.classList.remove("show"),p&&p.classList.remove("show"))}catch(b){k("[htmlBuilder] onScroll handler failed",b)}};Wn(()=>m.addEventListener("scroll",cl(g))),g()}}catch(o){k("[htmlBuilder] ensureScrollTopButton failed",o)}}function ln(e,t){try{if(typeof nt=="function")try{nt(e,t);return}catch{}}catch{}try{e&&t&&K&&typeof K.set=="function"&&!K.has(e)&&K.set(e,t)}catch{}try{t&&U&&typeof U.set=="function"&&U.set(t,e)}catch{}try{if(Re&&typeof Re.has=="function"){if(!Re.has(t)){try{Re.add(t)}catch{}try{Array.isArray(Ie)&&!Ie.includes(t)&&Ie.push(t)}catch{}}}else try{Array.isArray(Ie)&&!Ie.includes(t)&&Ie.push(t)}catch{}}catch{}}function Pa(e,t){try{if(!e)return;try{const n=e[t];if(typeof n<"u")return n}catch{}try{if(e.default)return e.default[t]}catch{}return}catch{return}}function Tl(e){try{if(!Array.isArray(e))return e;e.forEach(t=>{try{if(!t||typeof t!="object")return;let n=typeof t.slug=="string"?String(t.slug):"",i=null;if(n&&n.indexOf("::")!==-1){const o=n.split("::");n=o[0]||"",i=o.slice(1).join("::")||null}const r=!!(n&&(n.indexOf(".")!==-1||n.indexOf("/")!==-1));let a="";try{if(t.path&&typeof t.path=="string"){const o=V(String(t.path||""));if(a=findSlugForPath(o)||(U&&U.has(o)?U.get(o):"")||"",!a)if(t.title&&String(t.title).trim())a=he(String(t.title).trim());else{const l=o.replace(/^.*\//,"").replace(/\.(?:md|html?)$/i,"");a=he(l||o)}}else if(r){const o=String(n).replace(/\.(?:md|html?)$/i,""),l=findSlugForPath(o)||(U&&U.has(o)?U.get(o):"")||"";l?a=l:t.title&&String(t.title).trim()?a=he(String(t.title).trim()):a=he(o)}else!n&&t.title&&String(t.title).trim()?a=he(String(t.title).trim()):a=n||""}catch{try{a=t.title&&String(t.title).trim()?he(String(t.title).trim()):n?he(n):""}catch{a=n}}let s=a||"";i&&(s=s?`${s}::${i}`:`${he(i)}`),s&&(t.slug=s);try{if(t.path&&s){const o=String(s).split("::")[0];try{ln(o,V(String(t.path||"")))}catch{}}}catch{}}catch{}})}catch{}return e}async function Rl(e,t,n,i,r,a,s,o,l="eager",c=1,u=void 0,d="favicon"){if(!e||!(e instanceof HTMLElement))throw new TypeError("navbarWrap must be an HTMLElement");const h=He(),f=h?h.parseFromString(n||"","text/html"):null,p=f?f.querySelectorAll("a"):[];await Wn(()=>wl(p,i)),await Wn(()=>_l(p,i));try{ie(p,i)}catch{}try{if(t&&t instanceof HTMLElement&&(!t.hasAttribute||!t.hasAttribute("role")))try{t.setAttribute("role","main")}catch{}}catch{}let m=null,g=null,b=null,y=null,_=null,w=null,A=!1,S=null;const M=new Map;function I(){try{const T=typeof O<"u"&&O&&O.querySelector?O.querySelector(".navbar-burger"):e&&e.querySelector?e.querySelector(".navbar-burger"):typeof document<"u"?document.querySelector(".navbar-burger"):null,$=T&&T.dataset?T.dataset.target:null,E=$?typeof O<"u"&&O&&O.querySelector?O.querySelector(`#${$}`)||document.getElementById($):e&&e.querySelector?e.querySelector(`#${$}`):typeof document<"u"?document.getElementById($):null:null;if(T&&T.classList&&T.classList.contains("is-active")){try{T.classList.remove("is-active")}catch{}try{T.setAttribute("aria-expanded","false")}catch{}if(E&&E.classList)try{E.classList.remove("is-active")}catch{}}}catch(T){k("[nimbi-cms] closeMobileMenu failed",T)}}async function q(){const T=t&&t instanceof HTMLElement?t:typeof document<"u"?document.querySelector(".nimbi-content"):null;try{T&&T.classList.add("is-inactive")}catch{}try{const $=s&&s();$&&typeof $.then=="function"&&await $}catch($){try{k("[nimbi-cms] renderByQuery failed",$)}catch{}}finally{try{if(typeof requestAnimationFrame=="function")requestAnimationFrame(()=>{try{T&&T.classList.remove("is-inactive")}catch{}});else try{T&&T.classList.remove("is-inactive")}catch{}}catch{try{T&&T.classList.remove("is-inactive")}catch{}}}}function Q(T){try{let $=T&&typeof T.slug=="string"?String(T.slug):"",E=null;try{$&&$.indexOf("::")!==-1&&(E=$.split("::").slice(1).join("::")||null)}catch{}try{if(T&&T.path&&typeof T.path=="string"){const v=V(String(T.path||"")),C=v.replace(/^.*\//,"");try{if(M&&M.has(v))return{page:M.get(v),hash:E};if(M&&M.has(C))return{page:M.get(C),hash:E}}catch{}try{if(U&&U.has(v))return{page:U.get(v),hash:E}}catch{}try{const F=W(v);if(F)return{page:F,hash:E}}catch{}}}catch{}if($&&$.indexOf("::")!==-1){const v=$.split("::");$=v[0]||"",E=v.slice(1).join("::")||null}if($&&($.includes(".")||$.includes("/"))){const v=V(T&&T.path?String(T.path):$),C=v.replace(/^.*\//,"");try{if(M&&M.has(v))return{page:M.get(v),hash:E};if(M&&M.has(C))return{page:M.get(C),hash:E}}catch{}try{let F=W(v);if(!F)try{const Y=String(v||"").replace(/^\/+/,""),B=Y.replace(/^.*\//,"");for(const[P,z]of K.entries())try{let j=null;if(typeof z=="string"?j=V(String(z||"")):z&&typeof z=="object"&&(z.default?j=V(String(z.default||"")):j=null),!j)continue;if(j===Y||j.endsWith("/"+Y)||Y.endsWith("/"+j)||j.endsWith(B)||Y.endsWith(B)){F=P;break}}catch{}}catch{}if(F)$=F;else try{const Y=String($).replace(/\.(?:md|html?)$/i,"");$=he(Y||v)}catch{$=he(v)}}catch{$=he(v)}}return!$&&T&&T.path&&($=he(V(String(T.path||"")))),{page:$,hash:E}}catch{return{page:T&&T.slug||"",hash:null}}}const R=()=>m||(m=(async()=>{try{const T=await Promise.resolve().then(()=>ot),$=typeof globalThis<"u"?globalThis.buildSearchIndex:void 0,E=typeof globalThis<"u"?globalThis.buildSearchIndexWorker:void 0,v=Pa(T,"buildSearchIndex"),C=Pa(T,"buildSearchIndexWorker"),F=typeof $=="function"?$:v||void 0,Y=typeof E=="function"?E:C||void 0;Rt("[nimbi-cms test] ensureSearchIndex: buildFn="+typeof F+" workerFn="+typeof Y+" (global preferred)");const B=[];try{r&&B.push(r)}catch{}try{navigationPage&&B.push(navigationPage)}catch{}if(l==="lazy"&&typeof Y=="function")try{const P=await Y(i,c,u,B.length?B:void 0);if(P&&P.length){try{if(T&&typeof T._setSearchIndex=="function")try{T._setSearchIndex(P)}catch{}}catch{}return P}}catch(P){k("[nimbi-cms] worker builder threw",P)}return typeof F=="function"?(Rt("[nimbi-cms test] calling buildFn"),await F(i,c,u,B.length?B:void 0)):[]}catch(T){return k("[nimbi-cms] buildSearchIndex failed",T),[]}finally{if(g){try{g.removeAttribute("disabled")}catch{}try{b&&b.classList.remove("is-loading")}catch{}}}})(),m.then(T=>{try{try{S=Array.isArray(T)?T:null}catch{S=null}try{Tl(T)}catch{}try{if(typeof window<"u"){try{(async()=>{try{const C=await Promise.resolve().then(()=>ot);try{try{C&&typeof C._setSearchIndex=="function"&&C._setSearchIndex(Array.isArray(T)?T:[])}catch{}Object.defineProperty(window,"__nimbiResolvedIndex",{get(){return C&&Array.isArray(C.searchIndex)?C.searchIndex:Array.isArray(S)?S:[]},enumerable:!0,configurable:!0})}catch{try{window.__nimbiResolvedIndex=C&&Array.isArray(C.searchIndex)?C.searchIndex:Array.isArray(S)?S:[]}catch{}}}catch{try{window.__nimbiResolvedIndex=Array.isArray(ne)?ne:Array.isArray(S)?S:[]}catch{}}})()}catch{}try{window.__nimbi_contentBase=i}catch{}try{window.__nimbi_indexDepth=c}catch{}try{window.__nimbi_noIndexing=u}catch{}}}catch{}const $=String(g&&g.value||"").trim().toLowerCase();if(!$||!Array.isArray(T)||!T.length)return;const E=T.filter(C=>C.title&&C.title.toLowerCase().includes($)||C.excerpt&&C.excerpt.toLowerCase().includes($));if(!E||!E.length)return;const v=typeof _<"u"&&_?_:typeof document<"u"?document.getElementById("nimbi-search-results"):null;if(!v)return;try{typeof v.replaceChildren=="function"?v.replaceChildren():v.innerHTML=""}catch{try{v.innerHTML=""}catch{}}try{const C=document.createElement("div");C.className="panel nimbi-search-panel",E.slice(0,10).forEach(F=>{try{if(F.parentTitle){const z=document.createElement("p");z.className="panel-heading nimbi-search-title nimbi-search-parent",z.textContent=F.parentTitle,C.appendChild(z)}const Y=document.createElement("a");Y.className="panel-block nimbi-search-result";const B=Q(F);Y.href=Pe(B.page,B.hash),Y.setAttribute("role","button");try{if(F.path&&typeof F.path=="string")try{ln(B.page,F.path)}catch{}}catch{}const P=document.createElement("div");P.className="is-size-6 has-text-weight-semibold",P.textContent=F.title,Y.appendChild(P),Y.addEventListener("click",()=>{try{v.style.display="none"}catch{}}),C.appendChild(Y)}catch{}}),Aa(()=>{try{v.appendChild(C)}catch{}});try{v.style.display="block"}catch{}}catch{}}catch{}}).catch(()=>{}).finally(()=>{(async()=>{try{if(A)return;A=!0;const T=await Promise.resolve().then(()=>In);try{await T.handleSitemapRequest({homePage:r,contentBase:i,indexDepth:c,noIndexing:u,includeAllMarkdown:!0})}catch($){k("[nimbi-cms] sitemap trigger failed",$)}}catch(T){try{k("[nimbi-cms] sitemap dynamic import failed",T)}catch{}}})()}),m),O=document.createElement("nav");O.className="navbar",O.setAttribute("role","navigation"),O.setAttribute("aria-label","main navigation");const G=document.createElement("div");G.className="navbar-brand";const re=p[0],D=document.createElement("a");if(D.className="navbar-item",re){const T=re.getAttribute("href")||"#";try{const E=new URL(T,location.href).searchParams.get("page"),v=E?decodeURIComponent(E):r;let C=null;try{typeof v=="string"&&(/(?:\.md|\.html?)$/i.test(v)||v.includes("/"))&&(C=W(v))}catch{}!C&&typeof v=="string"&&!String(v).includes(".")&&(C=v);const F=C||v;D.href=Pe(F),(!D.textContent||!String(D.textContent).trim())&&(D.textContent=a("home"))}catch{try{const E=typeof r=="string"&&(/(?:\.md|\.html?)$/i.test(r)||r.includes("/"))?W(r):typeof r=="string"&&!r.includes(".")?r:null;D.href=Pe(E||r)}catch{D.href=Pe(r)}D.textContent=a("home")}}else D.href=Pe(r),D.textContent=a("home");async function L(T){try{if(!T||T==="none")return null;if(T==="favicon")try{const $=document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');if(!$)return null;const E=$.getAttribute("href")||"";return E&&/\.png(?:\?|$)/i.test(E)?new URL(E,location.href).toString():null}catch{return null}if(T==="copy-first"||T==="move-first")try{const $=await Be(r,i);if(!$||!$.raw)return null;const E=He(),v=E?E.parseFromString($.raw,"text/html"):null,C=v?v.querySelector("img"):null;if(!C)return null;const F=C.getAttribute("src")||"";if(!F)return null;const Y=new URL(F,location.href).toString();if(T==="move-first")try{document.documentElement.setAttribute("data-nimbi-logo-moved",Y)}catch{}return Y}catch{return null}try{return new URL(T,location.href).toString()}catch{return null}}catch{return null}}let H=null;try{H=await L(d)}catch{H=null}if(H)try{const T=document.createElement("img");T.className="nimbi-navbar-logo";const $=a&&typeof a=="function"&&(a("home")||a("siteLogo"))||"";T.alt=$,T.title=$,T.src=H;try{T.style.marginRight="0.5em"}catch{}try{(!D.textContent||!String(D.textContent).trim())&&(D.textContent=$)}catch{}try{D.insertBefore(T,D.firstChild)}catch{try{D.appendChild(T)}catch{}}}catch{}G.appendChild(D),D.addEventListener("click",function(T){const $=D.getAttribute("href")||"";if($.startsWith("?page=")){T.preventDefault();const E=new URL($,location.href),v=E.searchParams.get("page"),C=E.hash?E.hash.replace(/^#/,""):null;history.pushState({page:v},"",Pe(v,C)),q();try{I()}catch{}}});function W(T){try{if(!T)return null;const $=V(String(T||""));try{if(U&&U.has($))return U.get($)}catch{}const E=$.replace(/^.*\//,"");try{if(U&&U.has(E))return U.get(E)}catch{}try{for(const[v,C]of K.entries())if(C){if(typeof C=="string"){if(V(C)===$)return v}else if(C&&typeof C=="object"){if(C.default&&V(C.default)===$)return v;const F=C.langs||{};for(const Y in F)if(F[Y]&&V(F[Y])===$)return v}}}catch{}return null}catch{return null}}async function ie(T,$){try{if(!T||!T.length)return;const E=[];for(let B=0;B<T.length;B++)try{const P=T[B];if(!P||typeof P.getAttribute!="function")continue;const z=P.getAttribute("href")||"";if(!z||Cr(z))continue;let j=null;try{const Se=et(z);Se&&Se.page&&(j=Se.page)}catch{}if(!j){const Se=String(z||"").split(/[?#]/,1),ze=Se&&Se[0]?Se[0]:z;(/\.(?:md|html?)$/i.test(ze)||ze.indexOf("/")!==-1)&&(j=V(String(ze||"")))}if(!j)continue;const Z=V(String(j||"")),se=Z.replace(/^.*\//,"");let pe=null;try{M&&M.has(Z)&&(pe=M.get(Z))}catch{}try{!pe&&U&&U.has(Z)&&(pe=U.get(Z))}catch{}if(pe)continue;let be=null;try{be=P.textContent&&String(P.textContent).trim()?String(P.textContent).trim():null}catch{be=null}let ge=null;if(be)ge=he(be);else{const Se=se.replace(/\.(?:md|html?)$/i,"");ge=he(Se||Z)}if(ge)try{E.push({path:Z,candidate:ge})}catch{}}catch{}if(!E.length)return;const v=3;let C=0;const F=async()=>{for(;C<E.length;){const B=E[C++];if(!(!B||!B.path))try{const P=await Be(B.path,$);if(!P||!P.raw)continue;let z=null;if(P.isHtml)try{const j=He(),Z=j?j.parseFromString(P.raw,"text/html"):null,se=Z?Z.querySelector("h1")||Z.querySelector("title"):null;se&&se.textContent&&(z=String(se.textContent).trim())}catch{}else try{const j=P.raw.match(/^#\s+(.+)$/m);j&&j[1]&&(z=String(j[1]).trim())}catch{}if(z){const j=he(z);if(j&&j!==B.candidate){try{ln(j,B.path)}catch{}try{M.set(B.path,j)}catch{}try{M.set(B.path.replace(/^.*\//,""),j)}catch{}try{const Z=await Promise.resolve().then(()=>ot);try{if(Array.isArray(Z.searchIndex)){let se=!1;for(const pe of Z.searchIndex)try{if(pe&&pe.path===B.path&&pe.slug){const ge=String(pe.slug).split("::").slice(1).join("::");pe.slug=ge?`${j}::${ge}`:j,se=!0}}catch{}try{se&&typeof Z._setSearchIndex=="function"&&Z._setSearchIndex(Z.searchIndex)}catch{}}}catch{}}catch{}}}}catch{}}},Y=[];for(let B=0;B<v;B++)Y.push(F());try{await Promise.all(Y)}catch{}}catch{}}const ye=document.createElement("a");ye.className="navbar-burger",ye.setAttribute("role","button"),ye.setAttribute("aria-label","menu"),ye.setAttribute("aria-expanded","false");const ee="nimbi-navbar-menu";ye.dataset.target=ee,ye.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>',G.appendChild(ye);try{ye.addEventListener("click",T=>{try{const $=ye.dataset&&ye.dataset.target?ye.dataset.target:null,E=$?O&&O.querySelector?O.querySelector(`#${$}`)||(e&&e.querySelector?e.querySelector(`#${$}`):document.getElementById($)):e&&e.querySelector?e.querySelector(`#${$}`)||document.getElementById($):typeof document<"u"?document.getElementById($):null:null;ye.classList.contains("is-active")?(ye.classList.remove("is-active"),ye.setAttribute("aria-expanded","false"),E&&E.classList.remove("is-active")):(ye.classList.add("is-active"),ye.setAttribute("aria-expanded","true"),E&&E.classList.add("is-active"))}catch($){k("[nimbi-cms] navbar burger toggle failed",$)}})}catch(T){k("[nimbi-cms] burger event binding failed",T)}const $e=document.createElement("div");$e.className="navbar-menu",$e.id=ee;const ke=document.createElement("div");ke.className="navbar-start";let xe=null,Ce=null;if(!o)xe=null,g=null,y=null,_=null,w=null;else{xe=document.createElement("div"),xe.className="navbar-end",Ce=document.createElement("div"),Ce.className="navbar-item",g=document.createElement("input"),g.className="input",g.type="search",g.placeholder=a("searchPlaceholder")||"",g.id="nimbi-search";try{const v=(a&&typeof a=="function"?a("searchAria"):null)||g.placeholder||"Search";try{g.setAttribute("aria-label",v)}catch{}try{g.setAttribute("aria-controls","nimbi-search-results")}catch{}try{g.setAttribute("aria-autocomplete","list")}catch{}try{g.setAttribute("role","combobox")}catch{}}catch{}l==="eager"&&(g.disabled=!0),b=document.createElement("div"),b.className="control",l==="eager"&&b.classList.add("is-loading"),b.appendChild(g),Ce.appendChild(b),y=document.createElement("div"),y.className="dropdown is-right",y.id="nimbi-search-dropdown";const T=document.createElement("div");T.className="dropdown-trigger",T.appendChild(Ce);const $=document.createElement("div");$.className="dropdown-menu",$.setAttribute("role","menu"),_=document.createElement("div"),_.id="nimbi-search-results",_.className="dropdown-content nimbi-search-results",w=_,$.appendChild(_),y.appendChild(T),y.appendChild($),xe.appendChild(y);const E=v=>{if(!_)return;try{if(typeof _.replaceChildren=="function")_.replaceChildren();else for(;_.firstChild;)_.removeChild(_.firstChild)}catch{try{_.innerHTML=""}catch{}}let C=-1;function F(P){try{const z=_.querySelector(".nimbi-search-result.is-selected");z&&z.classList.remove("is-selected");const j=_.querySelectorAll(".nimbi-search-result");if(!j||!j.length)return;if(P<0){C=-1;return}P>=j.length&&(P=j.length-1);const Z=j[P];if(Z){Z.classList.add("is-selected"),C=P;try{Z.scrollIntoView({block:"nearest"})}catch{}}}catch{}}function Y(P){try{const z=P.key,j=_.querySelectorAll(".nimbi-search-result");if(!j||!j.length)return;if(z==="ArrowDown"){P.preventDefault();const Z=C<0?0:Math.min(j.length-1,C+1);F(Z);return}if(z==="ArrowUp"){P.preventDefault();const Z=C<=0?0:C-1;F(Z);return}if(z==="Enter"){P.preventDefault();const Z=_.querySelector(".nimbi-search-result.is-selected")||_.querySelector(".nimbi-search-result");if(Z)try{Z.click()}catch{}return}if(z==="Escape"){try{y.classList.remove("is-active")}catch{}try{document.documentElement.classList.remove("nimbi-search-open")}catch{}try{_.style.display="none"}catch{}try{_.classList.remove("is-open")}catch{}try{_.removeAttribute("tabindex")}catch{}try{_.removeEventListener("keydown",Y)}catch{}try{g&&g.focus()}catch{}try{g&&g.removeEventListener("keydown",B)}catch{}return}}catch{}}function B(P){try{if(P&&P.key==="ArrowDown"){P.preventDefault();try{_.focus()}catch{}F(0)}}catch{}}try{const P=document.createElement("div");P.className="panel nimbi-search-panel";const z=document.createDocumentFragment();v.forEach(j=>{if(j.parentTitle){const be=document.createElement("p");be.textContent=j.parentTitle,be.className="panel-heading nimbi-search-title nimbi-search-parent",z.appendChild(be)}const Z=document.createElement("a");Z.className="panel-block nimbi-search-result";const se=Q(j);Z.href=Pe(se.page,se.hash),Z.setAttribute("role","button");try{if(j.path&&typeof j.path=="string")try{ln(se.page,j.path)}catch{}}catch{}const pe=document.createElement("div");pe.className="is-size-6 has-text-weight-semibold",pe.textContent=j.title,Z.appendChild(pe),Z.addEventListener("click",be=>{try{try{be&&be.preventDefault&&be.preventDefault()}catch{}try{be&&be.stopPropagation&&be.stopPropagation()}catch{}if(y){y.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-search-open")}catch{}}try{_.style.display="none"}catch{}try{_.classList.remove("is-open")}catch{}try{_.removeAttribute("tabindex")}catch{}try{_.removeEventListener("keydown",Y)}catch{}try{g&&g.removeEventListener("keydown",B)}catch{}try{const ge=Z.getAttribute&&Z.getAttribute("href")||"";let Se=null,ze=null;try{const Ue=new URL(ge,location.href);Se=Ue.searchParams.get("page"),ze=Ue.hash?Ue.hash.replace(/^#/,""):null}catch{}if(Se)try{history.pushState({page:Se},"",Pe(Se,ze));try{q()}catch{try{typeof window<"u"&&typeof window.renderByQuery=="function"&&window.renderByQuery()}catch{}}return}catch{}}catch{}try{window.location.href=Z.href}catch{}}catch{}}),z.appendChild(Z)}),P.appendChild(z),Aa(()=>{try{_.appendChild(P)}catch{}})}catch{}if(y){y.classList.add("is-active");try{document.documentElement.classList.add("nimbi-search-open")}catch{}}try{_.style.display="block"}catch{}try{_.classList.add("is-open")}catch{}try{_.setAttribute("tabindex","0")}catch{}try{_.addEventListener("keydown",Y)}catch{}try{g&&g.addEventListener("keydown",B)}catch{}};if(g){const v=ll(async()=>{const C=g||(typeof O<"u"&&O&&O.querySelector?O.querySelector("input#nimbi-search"):e&&e.querySelector?e.querySelector("input#nimbi-search"):typeof document<"u"?document.querySelector("input#nimbi-search"):null),F=String(C&&C.value||"").trim().toLowerCase();if(!F){E([]);return}try{await R();const Y=await m,B=Array.isArray(Y)?Y.filter(P=>P.title&&P.title.toLowerCase().includes(F)||P.excerpt&&P.excerpt.toLowerCase().includes(F)):[];E(B.slice(0,10))}catch(Y){k("[nimbi-cms] search input handler failed",Y),E([])}},50);try{g.addEventListener("input",v)}catch{}try{document.addEventListener("input",C=>{try{C&&C.target&&C.target.id==="nimbi-search"&&v(C)}catch{}},!0)}catch{}}if(l==="eager"){try{m=R()}catch(v){k("[nimbi-cms] eager search index init failed",v),m=Promise.resolve([])}m.finally(()=>{const v=g||(typeof O<"u"&&O&&O.querySelector?O.querySelector("input#nimbi-search"):e&&e.querySelector?e.querySelector("input#nimbi-search"):typeof document<"u"?document.querySelector("input#nimbi-search"):null);if(v){try{v.removeAttribute("disabled")}catch{}try{b&&b.classList.remove("is-loading")}catch{}}(async()=>{try{if(A)return;A=!0;const C=await m.catch(()=>[]),F=await Promise.resolve().then(()=>In);try{await F.handleSitemapRequest({index:Array.isArray(C)?C:void 0,homePage:r,contentBase:i,indexDepth:c,noIndexing:u,includeAllMarkdown:!0})}catch(Y){k("[nimbi-cms] sitemap trigger failed",Y)}}catch(C){try{k("[nimbi-cms] sitemap dynamic import failed",C)}catch{}}})()})}try{const v=C=>{try{const F=C&&C.target;if(!w||!w.classList.contains("is-open")&&w.style&&w.style.display!=="block"||F&&(w.contains(F)||g&&(F===g||g.contains&&g.contains(F))))return;if(y){y.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-search-open")}catch{}}try{w.style.display="none"}catch{}try{w.classList.remove("is-open")}catch{}}catch{}};document.addEventListener("click",v,!0),document.addEventListener("touchstart",v,!0)}catch{}}const Fe=document.createDocumentFragment();for(let T=0;T<p.length;T++){const $=p[T];if(T===0)continue;const E=$.getAttribute("href")||"#";let v=E;const C=document.createElement("a");C.className="navbar-item";try{let F=null;try{F=et(String(E||""))}catch{F=null}let Y=null,B=null;if(F&&(F.type==="canonical"&&F.page||F.type==="cosmetic"&&F.page)&&(Y=F.page,B=F.anchor),Y&&(/\.(?:md|html?)$/i.test(Y)||Y.includes("/")?v=Y:C.href=Pe(Y,B)),/^[^#]*\.md(?:$|[#?])/.test(v)||v.endsWith(".md")){const z=V(v).split(/::|#/,2),j=z[0],Z=z[1],se=W(j);se?C.href=Pe(se,Z):C.href=Pe(j,Z)}else if(/\.html(?:$|[#?])/.test(v)||v.endsWith(".html")){const z=V(v).split(/::|#/,2);let j=z[0];j&&!j.toLowerCase().endsWith(".html")&&(j=j+".html");const Z=z[1],se=W(j);if(se)C.href=Pe(se,Z);else try{const pe=await Be(j,i);if(pe&&pe.raw)try{const be=He(),ge=be?be.parseFromString(pe.raw,"text/html"):null,Se=ge?ge.querySelector("title"):null,ze=ge?ge.querySelector("h1"):null,Ue=Se&&Se.textContent&&Se.textContent.trim()?Se.textContent.trim():ze&&ze.textContent?ze.textContent.trim():null;if(Ue){const Qe=he(Ue);if(Qe){try{ln(Qe,j)}catch(Ct){k("[nimbi-cms] slugToMd/mdToSlug set failed",Ct)}C.href=Pe(Qe,Z)}else C.href=Pe(j,Z)}else C.href=Pe(j,Z)}catch{C.href=Pe(j,Z)}else C.href=v}catch{C.href=v}}else C.href=v}catch(F){k("[nimbi-cms] nav item href parse failed",F),C.href=v}try{const F=$.textContent&&String($.textContent).trim()?String($.textContent).trim():null;if(F)try{const Y=he(F);if(Y){const B=C.getAttribute("href")||"";let P=null;if(/^[^#?]*\.(?:md|html?)(?:$|[?#])/i.test(B))P=V(String(B||"").split(/[?#]/)[0]);else try{const z=et(B);z&&z.type==="canonical"&&z.page&&(P=V(z.page))}catch{}if(P){let z=!1;try{if(/\.(?:html?)(?:$|[?#])/i.test(String(P||"")))z=!0;else if(/\.(?:md)(?:$|[?#])/i.test(String(P||"")))z=!1;else{const j=String(P||"").replace(/^\.\//,""),Z=j.replace(/^.*\//,"");Re&&Re.size&&(Re.has(j)||Re.has(Z))&&(z=!0)}}catch{z=!1}if(z)try{const j=V(String(P||"").split(/[?#]/)[0]);let Z=!1;try{W&&typeof W=="function"&&W(j)&&(Z=!0)}catch{}try{ln(Y,P)}catch{}try{if(j){try{M.set(j,Y)}catch{}try{const se=j.replace(/^.*\//,"");se&&M.set(se,Y)}catch{}}}catch{}if(Z)try{C.href=Pe(Y)}catch{}}catch{}}}}catch(Y){k("[nimbi-cms] nav slug mapping failed",Y)}}catch(F){k("[nimbi-cms] nav slug mapping failed",F)}C.textContent=$.textContent||v,Fe.appendChild(C)}try{ke.appendChild(Fe)}catch{}$e.appendChild(ke),xe&&$e.appendChild(xe),O.appendChild(G),O.appendChild($e),e.appendChild(O);try{const T=$=>{try{const E=typeof O<"u"&&O&&O.querySelector?O.querySelector(".navbar-burger"):e&&e.querySelector?e.querySelector(".navbar-burger"):typeof document<"u"?document.querySelector(".navbar-burger"):null;if(!E||!E.classList.contains("is-active"))return;const v=E&&E.closest?E.closest(".navbar"):O;if(v&&v.contains($.target))return;I()}catch{}};document.addEventListener("click",T,!0),document.addEventListener("touchstart",T,!0)}catch{}try{$e.addEventListener("click",T=>{const $=T.target&&T.target.closest?T.target.closest("a"):null;if(!$)return;const E=$.getAttribute("href")||"";try{const v=new URL(E,location.href),C=v.searchParams.get("page"),F=v.hash?v.hash.replace(/^#/,""):null;C&&(T.preventDefault(),history.pushState({page:C},"",Pe(C,F)),q())}catch(v){k("[nimbi-cms] navbar click handler failed",v)}try{const v=typeof O<"u"&&O&&O.querySelector?O.querySelector(".navbar-burger"):e&&e.querySelector?e.querySelector(".navbar-burger"):null,C=v&&v.dataset?v.dataset.target:null,F=C?O&&O.querySelector?O.querySelector(`#${C}`)||(e&&e.querySelector?e.querySelector(`#${C}`):document.getElementById(C)):e&&e.querySelector?e.querySelector(`#${C}`)||document.getElementById(C):typeof document<"u"?document.getElementById(C):null:null;v&&v.classList.contains("is-active")&&(v.classList.remove("is-active"),v.setAttribute("aria-expanded","false"),F&&F.classList.remove("is-active"))}catch(v){k("[nimbi-cms] mobile menu close failed",v)}})}catch(T){k("[nimbi-cms] attach content click handler failed",T)}try{t.addEventListener("click",T=>{const $=T.target&&T.target.closest?T.target.closest("a"):null;if(!$)return;const E=$.getAttribute("href")||"";if(E&&!Cr(E))try{const v=new URL(E,location.href),C=v.searchParams.get("page"),F=v.hash?v.hash.replace(/^#/,""):null;C&&(T.preventDefault(),history.pushState({page:C},"",Pe(C,F)),q())}catch(v){k("[nimbi-cms] container click URL parse failed",v)}})}catch(T){k("[nimbi-cms] build navbar failed",T)}return{navbar:O,linkEls:p}}try{document.addEventListener("input",e=>{try{if(e&&e.target&&e.target.id==="nimbi-search"){const t=document.getElementById("nimbi-search-results");if(t&&e.target&&e.target.value)try{t.style.display="block"}catch{}}}catch{}},!0)}catch{}let rt=null,de=null,Xe=1,St=(e,t)=>t,Tn=0,Rn=0,lr=()=>{},zn=.25;function zl(){if(rt&&document.contains(rt))return rt;rt=null;const e=document.createElement("dialog");e.className="nimbi-image-preview modal",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-label",St("imagePreviewTitle","Image preview"));try{const L=document.createElement("div");L.className="modal-background";const H=document.createElement("div");H.className="modal-content";const W=document.createElement("div");W.className="nimbi-image-preview__content box",W.setAttribute("role","document");const ie=document.createElement("button");ie.className="button is-small nimbi-image-preview__close",ie.type="button",ie.setAttribute("data-nimbi-preview-close",""),ie.textContent="✕";const ye=document.createElement("div");ye.className="nimbi-image-preview__image-wrapper";const ee=document.createElement("img");ee.setAttribute("data-nimbi-preview-image",""),ee.alt="",ye.appendChild(ee);const $e=document.createElement("div");$e.className="nimbi-image-preview__controls";const ke=document.createElement("div");ke.className="nimbi-image-preview__group";const xe=document.createElement("button");xe.className="button is-small",xe.type="button",xe.setAttribute("data-nimbi-preview-fit",""),xe.textContent="⤢";const Ce=document.createElement("button");Ce.className="button is-small",Ce.type="button",Ce.setAttribute("data-nimbi-preview-original",""),Ce.textContent="1:1";const Fe=document.createElement("button");Fe.className="button is-small",Fe.type="button",Fe.setAttribute("data-nimbi-preview-reset",""),Fe.textContent="⟲",ke.appendChild(xe),ke.appendChild(Ce),ke.appendChild(Fe);const T=document.createElement("div");T.className="nimbi-image-preview__group";const $=document.createElement("button");$.className="button is-small",$.type="button",$.setAttribute("data-nimbi-preview-zoom-out",""),$.textContent="−";const E=document.createElement("div");E.className="nimbi-image-preview__zoom",E.setAttribute("data-nimbi-preview-zoom-label",""),E.textContent="100%";const v=document.createElement("button");v.className="button is-small",v.type="button",v.setAttribute("data-nimbi-preview-zoom-in",""),v.textContent="＋",T.appendChild($),T.appendChild(E),T.appendChild(v),$e.appendChild(ke),$e.appendChild(T),W.appendChild(ie),W.appendChild(ye),W.appendChild($e),H.appendChild(W),e.appendChild(L),e.appendChild(H)}catch{e.innerHTML=`
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
    `}e.addEventListener("click",L=>{L.target===e&&ti()}),e.addEventListener("wheel",L=>{if(!Q())return;L.preventDefault();const H=L.deltaY<0?zn:-zn;Et(Xe+H),c(),u()},{passive:!1}),e.addEventListener("keydown",L=>{if(L.key==="Escape"){ti();return}if(Xe>1){const H=e.querySelector(".nimbi-image-preview__image-wrapper");if(!H)return;const W=40;switch(L.key){case"ArrowUp":H.scrollTop-=W,L.preventDefault();break;case"ArrowDown":H.scrollTop+=W,L.preventDefault();break;case"ArrowLeft":H.scrollLeft-=W,L.preventDefault();break;case"ArrowRight":H.scrollLeft+=W,L.preventDefault();break}}}),document.body.appendChild(e),rt=e,de=e.querySelector("[data-nimbi-preview-image]");const t=e.querySelector("[data-nimbi-preview-fit]"),n=e.querySelector("[data-nimbi-preview-original]"),i=e.querySelector("[data-nimbi-preview-zoom-in]"),r=e.querySelector("[data-nimbi-preview-zoom-out]"),a=e.querySelector("[data-nimbi-preview-reset]"),s=e.querySelector("[data-nimbi-preview-close]"),o=e.querySelector("[data-nimbi-preview-zoom-label]"),l=e.querySelector("[data-nimbi-preview-zoom-hud]");function c(){o&&(o.textContent=`${Math.round(Xe*100)}%`)}const u=()=>{l&&(l.textContent=`${Math.round(Xe*100)}%`,l.classList.add("visible"),clearTimeout(l._timeout),l._timeout=setTimeout(()=>l.classList.remove("visible"),800))};lr=c,i.addEventListener("click",()=>{Et(Xe+zn),c(),u()}),r.addEventListener("click",()=>{Et(Xe-zn),c(),u()}),t.addEventListener("click",()=>{Pn(),c(),u()}),n.addEventListener("click",()=>{Et(1),c(),u()}),a.addEventListener("click",()=>{Pn(),c(),u()}),s.addEventListener("click",ti),t.title=St("imagePreviewFit","Fit to screen"),n.title=St("imagePreviewOriginal","Original size"),r.title=St("imagePreviewZoomOut","Zoom out"),i.title=St("imagePreviewZoomIn","Zoom in"),s.title=St("imagePreviewClose","Close"),s.setAttribute("aria-label",St("imagePreviewClose","Close"));let d=!1,h=0,f=0,p=0,m=0;const g=new Map;let b=0,y=1;const _=(L,H)=>{const W=L.x-H.x,ie=L.y-H.y;return Math.hypot(W,ie)},w=()=>{d=!1,g.clear(),b=0,de&&(de.classList.add("is-panning"),de.classList.remove("is-grabbing"))};let A=0,S=0,M=0;const I=L=>{const H=Date.now(),W=H-A,ie=L.clientX-S,ye=L.clientY-M;A=H,S=L.clientX,M=L.clientY,W<300&&Math.hypot(ie,ye)<30&&(Et(Xe>1?1:2),c(),L.preventDefault())},q=L=>{Et(Xe>1?1:2),c(),L.preventDefault()},Q=()=>rt?typeof rt.open=="boolean"?rt.open:rt.classList.contains("is-active"):!1,R=(L,H,W=1)=>{if(g.has(W)&&g.set(W,{x:L,y:H}),g.size===2){const $e=Array.from(g.values()),ke=_($e[0],$e[1]);if(b>0){const xe=ke/b;Et(y*xe)}return}if(!d)return;const ie=de.closest(".nimbi-image-preview__image-wrapper");if(!ie)return;const ye=L-h,ee=H-f;ie.scrollLeft=p-ye,ie.scrollTop=m-ee},O=(L,H,W=1)=>{if(!Q())return;if(g.set(W,{x:L,y:H}),g.size===2){const ee=Array.from(g.values());b=_(ee[0],ee[1]),y=Xe;return}const ie=de.closest(".nimbi-image-preview__image-wrapper");!ie||!(ie.scrollWidth>ie.clientWidth||ie.scrollHeight>ie.clientHeight)||(d=!0,h=L,f=H,p=ie.scrollLeft,m=ie.scrollTop,de.classList.add("is-panning"),de.classList.remove("is-grabbing"),window.addEventListener("pointermove",G),window.addEventListener("pointerup",re),window.addEventListener("pointercancel",re))},G=L=>{d&&(L.preventDefault(),R(L.clientX,L.clientY,L.pointerId))},re=()=>{w(),window.removeEventListener("pointermove",G),window.removeEventListener("pointerup",re),window.removeEventListener("pointercancel",re)};de.addEventListener("pointerdown",L=>{L.preventDefault(),O(L.clientX,L.clientY,L.pointerId)}),de.addEventListener("pointermove",L=>{(d||g.size===2)&&L.preventDefault(),R(L.clientX,L.clientY,L.pointerId)}),de.addEventListener("pointerup",L=>{L.preventDefault(),L.pointerType==="touch"&&I(L),w()}),de.addEventListener("dblclick",q),de.addEventListener("pointercancel",w),de.addEventListener("mousedown",L=>{L.preventDefault(),O(L.clientX,L.clientY,1)}),de.addEventListener("mousemove",L=>{d&&L.preventDefault(),R(L.clientX,L.clientY,1)}),de.addEventListener("mouseup",L=>{L.preventDefault(),w()});const D=e.querySelector(".nimbi-image-preview__image-wrapper");return D&&(D.addEventListener("pointerdown",L=>{if(O(L.clientX,L.clientY,L.pointerId),L&&L.target&&L.target.tagName==="IMG")try{L.target.classList.add("is-grabbing")}catch{}}),D.addEventListener("pointermove",L=>{R(L.clientX,L.clientY,L.pointerId)}),D.addEventListener("pointerup",w),D.addEventListener("pointercancel",w),D.addEventListener("mousedown",L=>{if(O(L.clientX,L.clientY,1),L&&L.target&&L.target.tagName==="IMG")try{L.target.classList.add("is-grabbing")}catch{}}),D.addEventListener("mousemove",L=>{R(L.clientX,L.clientY,1)}),D.addEventListener("mouseup",w)),e}function Et(e){if(!de)return;const t=Number(e);Xe=Number.isFinite(t)?Math.max(.1,Math.min(4,t)):1;const i=de.getBoundingClientRect(),r=Tn||de.naturalWidth||de.width||i.width||0,a=Rn||de.naturalHeight||de.height||i.height||0;if(r&&a){de.style.setProperty("--nimbi-preview-img-max-width","none"),de.style.setProperty("--nimbi-preview-img-max-height","none"),de.style.setProperty("--nimbi-preview-img-width",`${r*Xe}px`),de.style.setProperty("--nimbi-preview-img-height",`${a*Xe}px`),de.style.setProperty("--nimbi-preview-img-transform","none");try{de.style.width=`${r*Xe}px`,de.style.height=`${a*Xe}px`,de.style.transform="none"}catch{}}else{de.style.setProperty("--nimbi-preview-img-max-width",""),de.style.setProperty("--nimbi-preview-img-max-height",""),de.style.setProperty("--nimbi-preview-img-width",""),de.style.setProperty("--nimbi-preview-img-height",""),de.style.setProperty("--nimbi-preview-img-transform",`scale(${Xe})`);try{de.style.transform=`scale(${Xe})`}catch{}}de&&(de.classList.add("is-panning"),de.classList.remove("is-grabbing"))}function Pn(){if(!de)return;const e=de.closest(".nimbi-image-preview__image-wrapper");if(!e)return;const t=e.getBoundingClientRect();if(t.width===0||t.height===0)return;const n=Tn||de.naturalWidth||t.width,i=Rn||de.naturalHeight||t.height;if(!n||!i)return;const r=t.width/n,a=t.height/i,s=Math.min(r,a,1);Et(Number.isFinite(s)?s:1)}function Pl(e,t="",n=0,i=0){const r=zl();Xe=1,Tn=n||0,Rn=i||0,de.src=e;try{if(!t)try{const o=new URL(e,typeof location<"u"?location.href:"").pathname||"",c=(o.substring(o.lastIndexOf("/")+1)||e).replace(/\.[^/.]+$/,"").replace(/[-_]+/g," ");t=St("imagePreviewDefaultAlt",c||"Image")}catch{t=St("imagePreviewDefaultAlt","Image")}}catch{}de.alt=t,de.style.transform="scale(1)";const a=()=>{Tn=de.naturalWidth||de.width||0,Rn=de.naturalHeight||de.height||0};if(a(),Pn(),lr(),requestAnimationFrame(()=>{Pn(),lr()}),!Tn||!Rn){const s=()=>{a(),requestAnimationFrame(()=>{Pn(),lr()}),de.removeEventListener("load",s)};de.addEventListener("load",s)}typeof r.showModal=="function"&&(r.open||r.showModal()),r.classList.add("is-active");try{document.documentElement.classList.add("nimbi-image-preview-open")}catch{}r.focus()}function ti(){if(rt){typeof rt.close=="function"&&rt.open&&rt.close(),rt.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-image-preview-open")}catch{}}}function $l(e,{t,zoomStep:n=.25}={}){if(!e||!e.querySelectorAll)return;St=(f,p)=>(typeof t=="function"?t(f):void 0)||p,zn=n,e.addEventListener("click",f=>{const p=f.target;if(!p||p.tagName!=="IMG")return;const m=p;if(!m.src)return;const g=m.closest("a");g&&g.getAttribute("href")||Pl(m.src,m.alt||"",m.naturalWidth||0,m.naturalHeight||0)});let i=!1,r=0,a=0,s=0,o=0;const l=new Map;let c=0,u=1;const d=(f,p)=>{const m=f.x-p.x,g=f.y-p.y;return Math.hypot(m,g)};e.addEventListener("pointerdown",f=>{const p=f.target;if(!p||p.tagName!=="IMG")return;const m=p.closest("a");if(m&&m.getAttribute("href")||!rt||!rt.open)return;if(l.set(f.pointerId,{x:f.clientX,y:f.clientY}),l.size===2){const b=Array.from(l.values());c=d(b[0],b[1]),u=Xe;return}const g=p.closest(".nimbi-image-preview__image-wrapper");if(g&&!(Xe<=1)){f.preventDefault(),i=!0,r=f.clientX,a=f.clientY,s=g.scrollLeft,o=g.scrollTop,p.setPointerCapture(f.pointerId);try{p.classList.add("is-grabbing")}catch{}}}),e.addEventListener("pointermove",f=>{if(l.has(f.pointerId)&&l.set(f.pointerId,{x:f.clientX,y:f.clientY}),l.size===2){f.preventDefault();const _=Array.from(l.values()),w=d(_[0],_[1]);if(c>0){const A=w/c;Et(u*A)}return}if(!i)return;f.preventDefault();const p=f.target,m=p.closest&&p.closest("a");if(m&&m.getAttribute&&m.getAttribute("href"))return;const g=p.closest(".nimbi-image-preview__image-wrapper");if(!g)return;const b=f.clientX-r,y=f.clientY-a;g.scrollLeft=s-b,g.scrollTop=o-y});const h=()=>{i=!1,l.clear(),c=0;try{const f=document.querySelector("[data-nimbi-preview-image]");f&&(f.classList.add("is-panning"),f.classList.remove("is-grabbing"))}catch{}};e.addEventListener("pointerup",h),e.addEventListener("pointercancel",h)}function Il(e){const{contentWrap:t,navWrap:n,container:i,mountOverlay:r=null,t:a,contentBase:s,homePage:o,initialDocumentTitle:l,runHooks:c}=e||{};if(!t||!(t instanceof HTMLElement))throw new TypeError("contentWrap must be an HTMLElement");let u=null;const d=pl(a,[{path:o,name:a("home"),isIndex:!0,children:[]}]);let h=!1,f=!1;function p(w){try{if(!w)return;if(typeof w.replaceChildren=="function")return w.replaceChildren();for(;w.firstChild;)w.removeChild(w.firstChild)}catch{try{w&&(w.innerHTML="")}catch{}}}async function m(w,A){let S,M,I;try{({data:S,pagePath:M,anchor:I}=await io(w,s))}catch(D){const L=D&&D.message?String(D.message):"",H=(!le||typeof le!="string"||!le)&&/no page data/i.test(L);try{if(H)try{k("[nimbi-cms] fetchPageData (expected missing)",D)}catch{}else try{On("[nimbi-cms] fetchPageData failed",D)}catch{}}catch{}try{!le&&n&&p(n)}catch{}Ra(t,a,D);return}!I&&A&&(I=A);try{ei(null)}catch(D){k("[nimbi-cms] scrollToAnchorOrTop failed",D)}try{p(t)}catch{try{t.innerHTML=""}catch{}}const{article:q,parsed:Q,toc:R,topH1:O,h1Text:G,slugKey:re}=await Sl(a,S,M,I,s);Js(a,l,Q,R,q,M,I,O,G,re,S);try{p(n)}catch{try{n.innerHTML=""}catch{}}R&&(n.appendChild(R),Ml(R));try{await c("transformHtml",{article:q,parsed:Q,toc:R,pagePath:M,anchor:I,topH1:O,h1Text:G,slugKey:re,data:S})}catch(D){k("[nimbi-cms] transformHtml hooks failed",D)}t.appendChild(q);try{vl(q)}catch(D){k("[nimbi-cms] executeEmbeddedScripts failed",D)}try{$l(q,{t:a})}catch(D){k("[nimbi-cms] attachImagePreview failed",D)}try{Un(i,100,!1),requestAnimationFrame(()=>Un(i,100,!1)),setTimeout(()=>Un(i,100,!1),250)}catch(D){k("[nimbi-cms] setEagerForAboveFoldImages failed",D)}ei(I),Ll(q,O,{mountOverlay:r,container:i,navWrap:n,t:a});try{await c("onPageLoad",{data:S,pagePath:M,anchor:I,article:q,toc:R,topH1:O,h1Text:G,slugKey:re,contentWrap:t,navWrap:n})}catch(D){k("[nimbi-cms] onPageLoad hooks failed",D)}u=M}async function g(){if(h){f=!0;return}h=!0;try{try{wi("renderByQuery")}catch{}try{_i("renderByQuery")}catch{}let w=et(location.href);if(w&&w.type==="path"&&w.page)try{let M="?page="+encodeURIComponent(w.page||"");w.params&&(M+=(M.includes("?")?"&":"?")+w.params),w.anchor&&(M+="#"+encodeURIComponent(w.anchor));try{history.replaceState(history.state,"",M)}catch{try{history.replaceState({},"",M)}catch{}}w=et(location.href)}catch{}const A=w&&w.page?w.page:o,S=w&&w.anchor?w.anchor:null;await m(A,S)}catch(w){k("[nimbi-cms] renderByQuery failed",w);try{!le&&n&&p(n)}catch{}Ra(t,a,w)}finally{if(h=!1,f){f=!1;try{await g()}catch{}}}}window.addEventListener("popstate",g);const b=()=>`nimbi-cms-scroll:${location.pathname}${location.search}`,y=()=>{try{const w=i||document.querySelector(".nimbi-cms");if(!w)return;const A={top:w.scrollTop||0,left:w.scrollLeft||0};sessionStorage.setItem(b(),JSON.stringify(A))}catch(w){k("[nimbi-cms] save scroll position failed",w)}},_=()=>{try{const w=i||document.querySelector(".nimbi-cms");if(!w)return;const A=sessionStorage.getItem(b());if(!A)return;const S=JSON.parse(A);S&&typeof S.top=="number"&&w.scrollTo({top:S.top,left:S.left||0,behavior:"auto"})}catch{}};return window.addEventListener("pageshow",w=>{if(w.persisted)try{_(),Un(i,100,!1)}catch(A){k("[nimbi-cms] bfcache restore failed",A)}}),window.addEventListener("pagehide",()=>{try{y()}catch(w){k("[nimbi-cms] save scroll position failed",w)}}),{renderByQuery:g,siteNav:d,getCurrentPagePath:()=>u}}function Nl(e){try{let t=typeof e=="string"?e:typeof window<"u"&&window.location?window.location.search:"";if(!t&&typeof window<"u"&&window.location&&window.location.hash)try{const a=et(window.location.href);a&&a.params&&(t=a.params.startsWith("?")?a.params:"?"+a.params)}catch{t=""}if(!t)return{};const n=new URLSearchParams(t.startsWith("?")?t.slice(1):t),i={},r=a=>{if(a==null)return;const s=String(a).toLowerCase();if(s==="1"||s==="true"||s==="yes")return!0;if(s==="0"||s==="false"||s==="no")return!1};if(n.has("contentPath")&&(i.contentPath=n.get("contentPath")),n.has("searchIndex")){const a=r(n.get("searchIndex"));typeof a=="boolean"&&(i.searchIndex=a)}if(n.has("searchIndexMode")){const a=n.get("searchIndexMode");(a==="eager"||a==="lazy")&&(i.searchIndexMode=a)}if(n.has("defaultStyle")){const a=n.get("defaultStyle");(a==="light"||a==="dark"||a==="system")&&(i.defaultStyle=a)}if(n.has("bulmaCustomize")&&(i.bulmaCustomize=n.get("bulmaCustomize")),n.has("lang")&&(i.lang=n.get("lang")),n.has("l10nFile")){const a=n.get("l10nFile");i.l10nFile=a==="null"?null:a}if(n.has("cacheTtlMinutes")){const a=Number(n.get("cacheTtlMinutes"));Number.isFinite(a)&&a>=0&&(i.cacheTtlMinutes=a)}if(n.has("cacheMaxEntries")){const a=Number(n.get("cacheMaxEntries"));Number.isInteger(a)&&a>=0&&(i.cacheMaxEntries=a)}if(n.has("homePage")&&(i.homePage=n.get("homePage")),n.has("navigationPage")&&(i.navigationPage=n.get("navigationPage")),n.has("notFoundPage")){const a=n.get("notFoundPage");i.notFoundPage=a==="null"?null:a}if(n.has("availableLanguages")&&(i.availableLanguages=n.get("availableLanguages").split(",").map(a=>a.trim()).filter(Boolean)),n.has("fetchConcurrency")){const a=Number(n.get("fetchConcurrency"));Number.isInteger(a)&&a>=1&&(i.fetchConcurrency=a)}if(n.has("negativeFetchCacheTTL")){const a=Number(n.get("negativeFetchCacheTTL"));Number.isFinite(a)&&a>=0&&(i.negativeFetchCacheTTL=a)}if(n.has("indexDepth")){const a=Number(n.get("indexDepth"));Number.isInteger(a)&&(a===1||a===2||a===3)&&(i.indexDepth=a)}if(n.has("noIndexing")){const s=(n.get("noIndexing")||"").split(",").map(o=>o.trim()).filter(Boolean);s.length&&(i.noIndexing=s)}return i}catch{return{}}}function ni(e){if(typeof e!="string")return!1;const t=e.trim();if(!t||t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))return!1;const n=t.replace(/^\.\//,"");return!!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n)}function Bl(e){if(typeof e!="string")return!1;const t=e.trim();if(!t)return!1;if(t==="."||t==="./")return!0;if(t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))return!1;const n=t.replace(/^\.\//,"");return!!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\/?$/.test(n)}let cr="";async function $a(e={}){if(!e||typeof e!="object")throw new TypeError("initCMS(options): options must be an object");const t=Nl();if(t&&(t.contentPath||t.homePage||t.notFoundPage||t.navigationPage))if(e&&e.allowUrlPathOverrides===!0)try{k("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage/navigationPage")}catch{}else{try{k("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage/navigationPage")}catch{}delete t.contentPath,delete t.homePage,delete t.notFoundPage,delete t.navigationPage}const n=Object.assign({},t,e);try{if(Object.prototype.hasOwnProperty.call(n,"debugLevel"))bi(n.debugLevel);else if(typeof globalThis<"u"&&globalThis.__nimbiCMSDebug&&typeof globalThis.__nimbiCMSDebug.debugLevel<"u")try{const R=Number(globalThis.__nimbiCMSDebug.debugLevel);Number.isFinite(R)&&bi(Math.max(0,Math.min(3,Math.floor(R))))}catch{}}catch{}try{Tt("[nimbi-cms] initCMS called",()=>({options:n}))}catch{}t&&typeof t.bulmaCustomize=="string"&&t.bulmaCustomize.trim()&&(n.bulmaCustomize=t.bulmaCustomize);let{el:i,contentPath:r="/content",crawlMaxQueue:a=1e3,searchIndex:s=!0,searchIndexMode:o="eager",indexDepth:l=1,noIndexing:c=void 0,defaultStyle:u="light",bulmaCustomize:d="none",lang:h=void 0,l10nFile:f=null,cacheTtlMinutes:p=5,cacheMaxEntries:m,markdownExtensions:g,availableLanguages:b,homePage:y=null,notFoundPage:_=null,navigationPage:w="_navigation.md",exposeSitemap:A=!0}=n;try{typeof y=="string"&&y.startsWith("./")&&(y=y.replace(/^\.\//,""))}catch{}try{typeof _=="string"&&_.startsWith("./")&&(_=_.replace(/^\.\//,""))}catch{}try{typeof w=="string"&&w.startsWith("./")&&(w=w.replace(/^[.]\//,""))}catch{}const{navbarLogo:S="favicon"}=n,{skipRootReadme:M=!1}=n,I=R=>{try{const O=document.querySelector(i);if(O&&O instanceof Element)try{const G=document.createElement("div");G.style.padding="1rem";try{G.style.fontFamily="system-ui, sans-serif"}catch{}G.style.color="#b00",G.style.background="#fee",G.style.border="1px solid #b00";const re=document.createElement("strong");re.textContent="NimbiCMS failed to initialize:",G.appendChild(re);try{G.appendChild(document.createElement("br"))}catch{}const D=document.createElement("pre");try{D.style.whiteSpace="pre-wrap"}catch{}D.textContent=String(R),G.appendChild(D);try{if(typeof O.replaceChildren=="function")O.replaceChildren(G);else{for(;O.firstChild;)O.removeChild(O.firstChild);O.appendChild(G)}}catch{try{O.innerHTML='<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;"><strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">'+String(R)+"</pre></div>"}catch{}}}catch{}}catch{}};if(n.contentPath!=null&&!Bl(n.contentPath))throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');if(y!=null&&!ni(y))throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');if(_!=null&&!ni(_))throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');if(w!=null&&!ni(w))throw new TypeError('initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html');if(!i)throw new Error("el is required");let q=i;if(typeof i=="string"){if(q=document.querySelector(i),!q)throw new Error(`el selector "${i}" did not match any element`)}else if(!(i instanceof Element))throw new TypeError("el must be a CSS selector string or a DOM element");if(typeof r!="string"||!r.trim())throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');if(typeof s!="boolean")throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');if(o!=null&&o!=="eager"&&o!=="lazy")throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');if(l!=null&&l!==1&&l!==2&&l!==3)throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');if(u!=="light"&&u!=="dark"&&u!=="system")throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');if(d!=null&&typeof d!="string")throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');if(h!=null&&typeof h!="string")throw new TypeError('initCMS(options): "lang" must be a string when provided');if(f!=null&&typeof f!="string")throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');if(p!=null&&(typeof p!="number"||!Number.isFinite(p)||p<0))throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');if(m!=null&&(typeof m!="number"||!Number.isInteger(m)||m<0))throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');if(g!=null&&(!Array.isArray(g)||g.some(R=>!R||typeof R!="object")))throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');if(b!=null&&(!Array.isArray(b)||b.some(R=>typeof R!="string"||!R.trim())))throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');if(c!=null&&(!Array.isArray(c)||c.some(R=>typeof R!="string"||!R.trim())))throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');if(M!=null&&typeof M!="boolean")throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');if(n.fetchConcurrency!=null&&(typeof n.fetchConcurrency!="number"||!Number.isInteger(n.fetchConcurrency)||n.fetchConcurrency<1))throw new TypeError('initCMS(options): "fetchConcurrency" must be a positive integer when provided');if(n.negativeFetchCacheTTL!=null&&(typeof n.negativeFetchCacheTTL!="number"||!Number.isFinite(n.negativeFetchCacheTTL)||n.negativeFetchCacheTTL<0))throw new TypeError('initCMS(options): "negativeFetchCacheTTL" must be a non-negative number (ms) when provided');if(y!=null&&(typeof y!="string"||!y.trim()||!/\.(md|html)$/.test(y)))throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');if(_!=null&&(typeof _!="string"||!_.trim()||!/\.(md|html)$/.test(_)))throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');const Q=!!s;try{Promise.resolve().then(()=>ot).then(R=>{try{R&&typeof R.setSkipRootReadme=="function"&&R.setSkipRootReadme(!!M)}catch(O){k("[nimbi-cms] setSkipRootReadme failed",O)}}).catch(R=>{})}catch(R){k("[nimbi-cms] setSkipRootReadme dynamic import failed",R)}try{try{n&&n.seoMap&&typeof n.seoMap=="object"&&Vs(n.seoMap)}catch{}try{typeof window<"u"&&(window.__nimbiRenderingErrors__||(window.__nimbiRenderingErrors__=[]),window.addEventListener("error",function(R){try{const O={type:"error",message:R&&R.message?String(R.message):"",filename:R&&R.filename?String(R.filename):"",lineno:R&&R.lineno?R.lineno:null,colno:R&&R.colno?R.colno:null,stack:R&&R.error&&R.error.stack?R.error.stack:null,time:Date.now()};try{k("[nimbi-cms] runtime error",O.message)}catch{}window.__nimbiRenderingErrors__.push(O)}catch{}}),window.addEventListener("unhandledrejection",function(R){try{const O={type:"unhandledrejection",reason:R&&R.reason?String(R.reason):"",time:Date.now()};try{k("[nimbi-cms] unhandledrejection",O.reason)}catch{}window.__nimbiRenderingErrors__.push(O)}catch{}}))}catch{}try{const R=et(typeof window<"u"?window.location.href:""),O=R&&R.page?R.page:y||void 0;try{O&&Ys(O,cr||"")}catch{}}catch{}await(async()=>{try{q.classList.add("nimbi-mount")}catch(E){k("[nimbi-cms] mount element setup failed",E)}const R=document.createElement("section");R.className="section";const O=document.createElement("div");O.className="container nimbi-cms";const G=document.createElement("div");G.className="columns";const re=document.createElement("div");re.className="column is-hidden-mobile is-3-tablet nimbi-nav-wrap",re.setAttribute("role","navigation");try{const E=typeof nn=="function"?nn("navigation"):null;E&&re.setAttribute("aria-label",E)}catch(E){k("[nimbi-cms] set nav aria-label failed",E)}G.appendChild(re);const D=document.createElement("main");D.className="column nimbi-content",D.setAttribute("role","main"),G.appendChild(D),O.appendChild(G),R.appendChild(O);const L=re,H=D;q.appendChild(R);let W=null;try{W=q.querySelector(".nimbi-overlay"),W||(W=document.createElement("div"),W.className="nimbi-overlay",q.appendChild(W))}catch(E){W=null,k("[nimbi-cms] mount overlay setup failed",E)}const ie=location.pathname||"/";let ye;if(ie.endsWith("/"))ye=ie;else{const E=ie.substring(ie.lastIndexOf("/")+1);E&&!E.includes(".")?ye=ie+"/":ye=ie.substring(0,ie.lastIndexOf("/")+1)}try{cr=document.title||""}catch(E){cr="",k("[nimbi-cms] read initial document title failed",E)}let ee=r;const $e=Object.prototype.hasOwnProperty.call(n,"contentPath"),ke=typeof location<"u"&&location.origin?location.origin:"http://localhost",xe=new URL(ye,ke).toString();(ee==="."||ee==="./")&&(ee="");try{ee=String(ee||"").replace(/\\/g,"/")}catch{ee=String(ee||"")}ee.startsWith("/")&&(ee=ee.replace(/^\/+/,"")),ee&&!ee.endsWith("/")&&(ee=ee+"/");try{if(ee&&ye&&ye!=="/"){const E=ye.replace(/^\/+/,"").replace(/\/+$/,"")+"/";E&&ee.startsWith(E)&&(ee=ee.slice(E.length))}}catch{}try{if(ee)var Ce=new URL(ee,xe.endsWith("/")?xe:xe+"/").toString();else var Ce=xe}catch{try{if(ee)var Ce=new URL("/"+ee,ke).toString();else var Ce=new URL(ye,ke).toString()}catch{var Ce=ke}}if(f&&await vr(f,ye),b&&Array.isArray(b)&&Pi(b),h&&Ar(h),typeof p=="number"&&p>=0&&typeof Ki=="function"&&Ki(p*60*1e3),typeof m=="number"&&m>=0&&typeof Qi=="function"&&Qi(m),g&&Array.isArray(g)&&g.length)try{g.forEach(E=>{typeof E=="object"&&va&&typeof Qr=="function"&&Qr(E)})}catch(E){k("[nimbi-cms] applying markdownExtensions failed",E)}try{typeof a=="number"&&Promise.resolve().then(()=>ot).then(({setDefaultCrawlMaxQueue:E})=>{try{E(a)}catch(v){k("[nimbi-cms] setDefaultCrawlMaxQueue failed",v)}}),typeof n.fetchConcurrency=="number"&&Promise.resolve().then(()=>ot).then(({setFetchConcurrency:E})=>{try{E(n.fetchConcurrency)}catch(v){k("[nimbi-cms] setFetchConcurrency failed",v)}}).catch(()=>{}),typeof n.negativeFetchCacheTTL=="number"&&Promise.resolve().then(()=>ot).then(({setFetchNegativeCacheTTL:E})=>{try{E(n.negativeFetchCacheTTL)}catch(v){k("[nimbi-cms] setFetchNegativeCacheTTL failed",v)}}).catch(()=>{})}catch(E){k("[nimbi-cms] setDefaultCrawlMaxQueue import failed",E)}try{try{const E=n&&n.manifest?n.manifest:typeof globalThis<"u"&&globalThis.__NIMBI_CMS_MANIFEST__?globalThis.__NIMBI_CMS_MANIFEST__:typeof window<"u"&&window.__NIMBI_CMS_MANIFEST__?window.__NIMBI_CMS_MANIFEST__:null;if(E&&typeof E=="object")try{const v=await Promise.resolve().then(()=>ot);if(v&&typeof v._setAllMd=="function"){v._setAllMd(E);try{Tt("[nimbi-cms diagnostic] applied content manifest",()=>({manifestKeys:Object.keys(E).length}))}catch{}}}catch(v){k("[nimbi-cms] applying content manifest failed",v)}try{zr(Ce)}catch(v){k("[nimbi-cms] setContentBase failed",v)}try{try{const v=await Promise.resolve().then(()=>ot);try{Tt("[nimbi-cms diagnostic] after setContentBase",()=>({manifestKeys:E&&typeof E=="object"?Object.keys(E).length:0,slugToMdSize:v&&v.slugToMd&&typeof v.slugToMd.size=="number"?v.slugToMd.size:void 0,allMarkdownPathsLength:v&&Array.isArray(v.allMarkdownPaths)?v.allMarkdownPaths.length:void 0,allMarkdownPathsSetSize:v&&v.allMarkdownPathsSet&&typeof v.allMarkdownPathsSet.size=="number"?v.allMarkdownPathsSet.size:void 0,searchIndexLength:v&&Array.isArray(v.searchIndex)?v.searchIndex.length:void 0}))}catch{}}catch{}}catch{}}catch{}}catch(E){k("[nimbi-cms] setContentBase failed",E)}try{Ni(_)}catch(E){k("[nimbi-cms] setNotFoundPage failed",E)}try{typeof window<"u"&&window.__nimbiAutoAttachSitemapUI&&Promise.resolve().then(()=>In).then(E=>{try{E&&typeof E.attachSitemapDownloadUI=="function"&&E.attachSitemapDownloadUI(document.body,{filename:"sitemap.json"})}catch{}}).catch(()=>{})}catch{}let Fe=null,T=null;try{if(!Object.prototype.hasOwnProperty.call(n,"homePage")&&w)try{const C=[],F=[];try{w&&F.push(String(w))}catch{}try{const B=String(w||"").replace(/^_/,"");B&&B!==String(w)&&F.push(B)}catch{}try{F.push("navigation.md")}catch{}try{F.push("assets/navigation.md")}catch{}const Y=[];for(const B of F)try{if(!B)continue;const P=String(B);Y.includes(P)||Y.push(P)}catch{}for(const B of Y){C.push(B);try{if(T=await Be(B,Ce,{force:!0}),T&&T.raw){try{w=B}catch{}try{k("[nimbi-cms] fetched navigation candidate",B,"contentBase=",Ce)}catch{}Fe=await Mn(T.raw||"");try{const P=He();if(P&&Fe&&Fe.html){const j=P.parseFromString(Fe.html,"text/html").querySelector("a");if(j)try{const Z=j.getAttribute("href")||"",se=et(Z);try{k("[nimbi-cms] parsed nav first-link href",Z,"->",se)}catch{}if(se&&se.page&&(se.type==="path"||se.type==="canonical"&&(se.page.includes(".")||se.page.includes("/")))){y=se.page;try{k("[nimbi-cms] derived homePage from navigation",y)}catch{}break}}catch{}}}catch{}}}catch{}}}catch{}try{k("[nimbi-cms] final homePage before slugManager setHomePage",y)}catch{}try{Bi(y)}catch(C){k("[nimbi-cms] setHomePage failed",C)}let v=!0;try{const C=et(typeof location<"u"?location.href:"");C&&C.type==="cosmetic"&&(typeof _>"u"||_==null)&&(v=!1)}catch{}if(v&&y)try{await Be(y,Ce,{force:!0})}catch(C){throw new Error(`Required ${y} not found at ${Ce}${y}: ${C&&C.message?C.message:String(C)}`)}}catch(E){throw E}Ai(u),await vi(d,ye);const $=Il({contentWrap:H,navWrap:L,container:O,mountOverlay:W,t:nn,contentBase:Ce,homePage:y,initialDocumentTitle:cr,runHooks:yr});try{const E=document.createElement("header");E.className="nimbi-site-navbar",q.insertBefore(E,R);let v=T,C=Fe;C||(v=await Be(w,Ce,{force:!0}),C=await Mn(v.raw||""));const{navbar:F,linkEls:Y}=await Rl(E,O,C.html||"",Ce,y,nn,$.renderByQuery,Q,o,l,c,S);try{await yr("onNavBuild",{navWrap:L,navbar:F,linkEls:Y,contentBase:Ce})}catch(B){k("[nimbi-cms] onNavBuild hooks failed",B)}try{try{if(Y&&Y.length){const B=await Promise.resolve().then(()=>ot);for(const P of Array.from(Y||[]))try{const z=P&&P.getAttribute&&P.getAttribute("href")||"";if(!z)continue;let j=String(z||"").split(/::|#/,1)[0];if(j=String(j||"").split("?")[0],!j)continue;/\.(?:md|html?)$/.test(j)||(j=j+".html");let Z=null;try{Z=V(String(j||""))}catch{Z=String(j||"")}const se=String(Z||"").replace(/^.*\//,"").replace(/\?.*$/,"");if(!se)continue;try{let pe=null;try{B&&typeof B.slugify=="function"&&(pe=B.slugify(se.replace(/\.(?:md|html?)$/i,"")))}catch{pe=String(se||"").replace(/\s+/g,"-").toLowerCase()}if(!pe)continue;let be=pe;try{if(B&&B.slugToMd&&typeof B.slugToMd.has=="function"&&B.slugToMd.has(pe)){const ge=B.slugToMd.get(pe);let Se=!1;try{if(typeof ge=="string")ge===j&&(Se=!0);else if(ge&&typeof ge=="object"){ge.default===j&&(Se=!0);for(const ze of Object.keys(ge.langs||{}))if(ge.langs[ze]===j){Se=!0;break}}}catch{}if(!Se&&typeof B.uniqueSlug=="function")try{be=B.uniqueSlug(pe,new Set(B.slugToMd.keys()))}catch{be=pe}}}catch{}try{if(B&&typeof B._storeSlugMapping=="function")try{B._storeSlugMapping(be,Z)}catch{}else if(B&&B.slugToMd&&typeof B.slugToMd.set=="function")try{B.slugToMd.set(be,Z)}catch{}try{B&&B.mdToSlug&&typeof B.mdToSlug.set=="function"&&B.mdToSlug.set(Z,be)}catch{}try{B&&Array.isArray(B.allMarkdownPaths)&&!B.allMarkdownPaths.includes(Z)&&B.allMarkdownPaths.push(Z)}catch{}try{B&&B.allMarkdownPathsSet&&typeof B.allMarkdownPathsSet.add=="function"&&B.allMarkdownPathsSet.add(Z)}catch{}}catch{}}catch{}}catch{}try{const P=await Promise.resolve().then(()=>Er);P&&typeof P.refreshIndexPaths=="function"&&P.refreshIndexPaths(Ce)}catch{}}}catch{}}catch{}try{let B=!1;try{const P=new URLSearchParams(location.search||"");(P.has("sitemap")||P.has("rss")||P.has("atom"))&&(B=!0)}catch{}try{const z=(location.pathname||"/").replace(/\/\/+/g,"/").split("/").filter(Boolean).pop()||"";z&&/^(sitemap|sitemap\.xml|rss|rss\.xml|atom|atom\.xml)$/i.test(z)&&(B=!0)}catch{}if(B||A===!0||typeof window<"u"&&window.__nimbiExposeSitemap)try{try{const z=await Promise.resolve().then(()=>ot);if(z&&typeof z.awaitSearchIndex=="function"){const j=[];y&&j.push(y),w&&j.push(w);try{await z.awaitSearchIndex({contentBase:Ce,indexDepth:Math.max(l||1,3),noIndexing:c,seedPaths:j.length?j:void 0,startBuild:!0,timeoutMs:1/0})}catch{}}}catch{}const P=await Promise.resolve().then(()=>In);try{if(P&&typeof P.handleSitemapRequest=="function"&&await P.handleSitemapRequest({includeAllMarkdown:!0,homePage:y,navigationPage:w,notFoundPage:_,contentBase:Ce,indexDepth:l,noIndexing:c}))return}catch{}}catch{}try{Promise.resolve().then(()=>In).then(P=>{try{if(P&&typeof P.exposeSitemapGlobals=="function")try{P.exposeSitemapGlobals({includeAllMarkdown:!0,homePage:y,navigationPage:w,notFoundPage:_,contentBase:Ce,indexDepth:l,noIndexing:c,waitForIndexMs:1/0}).catch(()=>{})}catch{}}catch{}}).catch(()=>{})}catch{}}catch{}try{try{const P=await Promise.resolve().then(()=>Er);if(P&&typeof P.refreshIndexPaths=="function")try{P.refreshIndexPaths(Ce);try{try{const z=await Promise.resolve().then(()=>ot);try{Tt("[nimbi-cms diagnostic] after refreshIndexPaths",()=>({slugToMdSize:z&&z.slugToMd&&typeof z.slugToMd.size=="number"?z.slugToMd.size:void 0,allMarkdownPathsLength:z&&Array.isArray(z.allMarkdownPaths)?z.allMarkdownPaths.length:void 0,allMarkdownPathsSetSize:z&&z.allMarkdownPathsSet&&typeof z.allMarkdownPathsSet.size=="number"?z.allMarkdownPathsSet.size:void 0}))}catch{}}catch{}}catch{}try{const z=await Promise.resolve().then(()=>ot),j=z&&z.slugToMd&&typeof z.slugToMd.size=="number"?z.slugToMd.size:0;let Z=!1;try{if(!manifest){j<30&&(Z=!0);try{const se=et(typeof location<"u"?location.href:"");if(se){if(se.type==="cosmetic"&&se.page)try{z.slugToMd.has(se.page)||(Z=!0)}catch{}else if((se.type==="path"||se.type==="canonical")&&se.page)try{const pe=V(se.page);!(z.mdToSlug&&z.mdToSlug.has(pe))&&!(z.allMarkdownPathsSet&&z.allMarkdownPathsSet.has(pe))&&(Z=!0)}catch{}}}catch{}}}catch{}if(Z){let se=null;try{se=typeof window<"u"&&(window.__nimbiSitemapFinal||window.__nimbiResolvedIndex||window.__nimbiSearchIndex||window.__nimbiLiveSearchIndex||window.__nimbiSearchIndex)||null}catch{se=null}if(Array.isArray(se)&&se.length){let pe=0;for(const be of se)try{if(!be||!be.slug)continue;const ge=String(be.slug).split("::")[0];if(z.slugToMd.has(ge))continue;let Se=be.sourcePath||be.path||null;if(!Se&&Array.isArray(se)){const Ue=(se||[]).find(Qe=>Qe&&Qe.slug===be.slug);Ue&&Ue.path&&(Se=Ue.path)}if(!Se)continue;try{Se=String(Se)}catch{continue}let ze=null;try{const Ue=Ce&&typeof Ce=="string"?Ce:typeof location<"u"&&location.origin?location.origin+"/":"";try{const Qe=new URL(Se,Ue),Ct=new URL(Ue);if(Qe.origin===Ct.origin){const Nn=Ct.pathname||"/";let Mt=Qe.pathname||"";Mt.startsWith(Nn)&&(Mt=Mt.slice(Nn.length)),Mt.startsWith("/")&&(Mt=Mt.slice(1)),ze=V(Mt)}else ze=V(Qe.pathname||"")}catch{ze=V(Se)}}catch{ze=V(Se)}if(!ze)continue;ze=String(ze).split(/[?#]/)[0],ze=V(ze);try{z._storeSlugMapping(ge,ze)}catch{}pe++}catch{}if(pe){try{Tt("[nimbi-cms diagnostic] populated slugToMd from sitemap/searchIndex",()=>({added:pe,total:z&&z.slugToMd&&typeof z.slugToMd.size=="number"?z.slugToMd.size:void 0}))}catch{}try{const be=await Promise.resolve().then(()=>Er);be&&typeof be.refreshIndexPaths=="function"&&be.refreshIndexPaths(Ce)}catch{}}}}}catch{}}catch(z){k("[nimbi-cms] refreshIndexPaths after nav build failed",z)}}catch{}const B=()=>{const P=E&&E.getBoundingClientRect&&Math.round(E.getBoundingClientRect().height)||E&&E.offsetHeight||0;if(P>0){try{q.style.setProperty("--nimbi-site-navbar-height",`${P}px`)}catch(z){k("[nimbi-cms] set CSS var failed",z)}try{O.style.paddingTop=""}catch(z){k("[nimbi-cms] set container paddingTop failed",z)}try{const z=q&&q.getBoundingClientRect&&Math.round(q.getBoundingClientRect().height)||q&&q.clientHeight||0;if(z>0){const j=Math.max(0,z-P);try{O.style.setProperty("--nimbi-cms-height",`${j}px`)}catch(Z){k("[nimbi-cms] set --nimbi-cms-height failed",Z)}}else try{O.style.setProperty("--nimbi-cms-height","calc(100vh - var(--nimbi-site-navbar-height))")}catch(j){k("[nimbi-cms] set --nimbi-cms-height failed",j)}}catch(z){k("[nimbi-cms] compute container height failed",z)}try{E.style.setProperty("--nimbi-site-navbar-height",`${P}px`)}catch(z){k("[nimbi-cms] set navbar CSS var failed",z)}}};B();try{if(typeof ResizeObserver<"u"){const P=new ResizeObserver(()=>B());try{P.observe(E)}catch(z){k("[nimbi-cms] ResizeObserver.observe failed",z)}}}catch(P){k("[nimbi-cms] ResizeObserver setup failed",P)}}catch(B){k("[nimbi-cms] compute navbar height failed",B)}}catch(E){k("[nimbi-cms] build navigation failed",E)}await $.renderByQuery();try{Promise.resolve().then(()=>Ol).then(({getVersion:E})=>{typeof E=="function"&&E().then(v=>{try{const C=v||"0.0.0";try{const F=P=>{const z=document.createElement("a");z.className="nimbi-version-label tag is-small",z.textContent=`nimbiCMS v. ${C}`,z.href=P||"#",z.target="_blank",z.rel="noopener noreferrer nofollow",z.setAttribute("aria-label",`nimbiCMS version ${C}`);try{Ei(z)}catch{}try{q.appendChild(z)}catch(j){k("[nimbi-cms] append version label failed",j)}},Y="https://abelvm.github.io/nimbiCMS/",B=(()=>{try{if(Y&&typeof Y=="string")return new URL(Y).toString()}catch{}return"#"})();F(B)}catch(F){k("[nimbi-cms] building version label failed",F)}}catch(C){k("[nimbi-cms] building version label failed",C)}}).catch(v=>{k("[nimbi-cms] getVersion() failed",v)})}).catch(E=>{k("[nimbi-cms] import version module failed",E)})}catch(E){k("[nimbi-cms] version label setup failed",E)}})()}catch(R){throw I(R),R}}async function Ia(){try{if("1.0.5".trim())return"1.0.5"}catch{}return"0.0.0"}const Ol=Object.freeze(Object.defineProperty({__proto__:null,getVersion:Ia},Symbol.toStringTag,{value:"Module"})),it=Rt,$n=k;function ri(){try{if(typeof location<"u"&&location&&typeof location.pathname=="string")return String(location.origin+location.pathname.split("?")[0])}catch{}return"http://localhost/"}function De(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}function Na(e){try{return!e||typeof e!="string"?"":(e.split("/").filter(Boolean).pop()||e).replace(/\.[a-z0-9]+$/i,"").replace(/[-_]+/g," ").split(" ").map(r=>r?r.charAt(0).toUpperCase()+r.slice(1):"").join(" ").trim()}catch{return String(e)}}function jl(e,t){try{const n=t&&t.slug?String(t.slug):null;if(!n)return null;const r={loc:e+"?page="+encodeURIComponent(n),slug:n};return t.title&&(r.title=String(t.title)),t.excerpt&&(r.excerpt=String(t.excerpt)),t.path&&(r.sourcePath=V(String(t.path))),r}catch{return null}}async function ii(e={}){const{includeAllMarkdown:t=!0,index:n,homePage:i,navigationPage:r,notFoundPage:a}=e||{},o=ri().split("?")[0];let l=Array.isArray(ne)&&ne.length?ne:Array.isArray(n)?n:[];if(Array.isArray(n)&&n.length&&Array.isArray(ne)&&ne.length){const b=new Map;try{for(const y of n)try{y&&y.slug&&b.set(String(y.slug),y)}catch{}for(const y of ne)try{y&&y.slug&&b.set(String(y.slug),y)}catch{}}catch{}l=Array.from(b.values())}const c=new Set;try{typeof a=="string"&&a.trim()&&c.add(V(String(a)))}catch{}try{typeof r=="string"&&r.trim()&&c.add(V(String(r)))}catch{}const u=new Set;try{if(typeof a=="string"&&a.trim()){const b=V(String(a));try{if(U&&typeof U.has=="function"&&U.has(b))try{u.add(U.get(b))}catch{}else try{const y=await Be(b,e&&e.contentBase?e.contentBase:void 0);if(y&&y.raw)try{let _=null;if(y.isHtml)try{const w=He();if(w){const A=w.parseFromString(y.raw,"text/html"),S=A.querySelector("h1")||A.querySelector("title");S&&S.textContent&&(_=S.textContent.trim())}else{const A=(y.raw||"").match(/<h1[^>]*>(.*?)<\/h1>|<title[^>]*>(.*?)<\/title>/i);A&&(_=(A[1]||A[2]||"").trim())}}catch{}else{const w=(y.raw||"").match(/^#\s+(.+)$/m);w&&w[1]&&(_=w[1].trim())}_&&u.add(he(_))}catch{}}catch{}}catch{}}}catch{}const d=new Set,h=[],f=new Map,p=new Map,m=b=>{try{if(!b||typeof b!="string")return!1;const y=V(String(b));try{if(Re&&typeof Re.has=="function"&&Re.has(y))return!0}catch{}try{if(U&&typeof U.has=="function"&&U.has(y))return!0}catch{}try{if(p&&p.has(y))return!0}catch{}try{if(U&&typeof U.keys=="function"&&U.size)for(const _ of U.keys())try{if(V(String(_))===y)return!0}catch{}else for(const _ of K.values())try{if(!_)continue;if(typeof _=="string"){if(V(String(_))===y)return!0}else if(_&&typeof _=="object"){if(_.default&&V(String(_.default))===y)return!0;const w=_.langs||{};for(const A of Object.keys(w||{}))try{if(w[A]&&V(String(w[A]))===y)return!0}catch{}}}catch{}}catch{}}catch{}return!1};if(Array.isArray(l)&&l.length){let b=0;for(const y of l){try{b++,await $t(b,64)}catch{}try{if(!y||!y.slug)continue;const _=String(y.slug),w=String(_).split("::")[0];if(u.has(w))continue;const A=y.path?V(String(y.path)):null;if(A&&c.has(A))continue;const S=y.title?String(y.title):y.parentTitle?String(y.parentTitle):void 0;f.set(_,{title:S||void 0,excerpt:y.excerpt?String(y.excerpt):void 0,path:A,source:"index"}),A&&p.set(A,{title:S||void 0,excerpt:y.excerpt?String(y.excerpt):void 0,slug:_});const M=jl(o,y);if(!M||!M.slug||d.has(M.slug))continue;if(d.add(M.slug),f.has(M.slug)){const I=f.get(M.slug);I&&I.title&&(M.title=I.title,M._titleSource="index"),I&&I.excerpt&&(M.excerpt=I.excerpt)}h.push(M)}catch{continue}}}if(t)try{let b=0;for(const[y,_]of K.entries()){try{b++,await $t(b,128)}catch{}try{if(!y)continue;const w=String(y).split("::")[0];if(d.has(y)||u.has(w))continue;let A=null;if(typeof _=="string"?A=V(String(_)):_&&typeof _=="object"&&(A=V(String(_.default||""))),A&&c.has(A))continue;const M={loc:o+"?page="+encodeURIComponent(y),slug:y};if(f.has(y)){const I=f.get(y);I&&I.title&&(M.title=I.title,M._titleSource="index"),I&&I.excerpt&&(M.excerpt=I.excerpt)}else if(A){const I=p.get(A);I&&I.title&&(M.title=I.title,M._titleSource="path",!M.excerpt&&I.excerpt&&(M.excerpt=I.excerpt))}if(d.add(y),typeof y=="string"){const I=y.indexOf("/")!==-1||/\.(md|html?)$/i.test(y),q=M.title&&typeof M.title=="string"&&(M.title.indexOf("/")!==-1||/\.(md|html?)$/i.test(M.title));(!M.title||q||I)&&(M.title=Na(y),M._titleSource="humanize")}h.push(M)}catch{}}try{if(i&&typeof i=="string"){const y=V(String(i));let _=null;try{U&&U.has(y)&&(_=U.get(y))}catch{}_||(_=y);const w=String(_).split("::")[0];if(!d.has(_)&&!c.has(y)&&!u.has(w)){const A={loc:o+"?page="+encodeURIComponent(_),slug:_};if(f.has(_)){const S=f.get(_);S&&S.title&&(A.title=S.title,A._titleSource="index"),S&&S.excerpt&&(A.excerpt=S.excerpt)}d.add(_),h.push(A)}}}catch{}}catch{}try{const b=new Set,y=new Set(h.map(M=>String(M&&M.slug?M.slug:""))),_=new Set;for(const M of h)try{M&&M.sourcePath&&_.add(String(M.sourcePath))}catch{}const w=30;let A=0,S=0;for(const M of _){try{S++,await $t(S,8)}catch{}if(A>=w)break;try{if(!M||typeof M!="string"||!m(M))continue;A+=1;const I=await Be(M,e&&e.contentBase?e.contentBase:void 0);if(!I||!I.raw||I&&typeof I.status=="number"&&I.status===404)continue;const q=I.raw,Q=(function(D){try{return String(D||"")}catch{return""}})(q),R=[],O=/\[[^\]]+\]\(([^)]+)\)/g;let G;for(;G=O.exec(Q);)try{G&&G[1]&&R.push(G[1])}catch{}const re=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;G=re.exec(Q);)try{G&&G[1]&&R.push(G[1])}catch{}for(const D of R)try{if(!D)continue;if(D.indexOf("?")!==-1||D.indexOf("=")!==-1)try{const W=new URL(D,o).searchParams.get("page");if(W){const ie=String(W);!y.has(ie)&&!b.has(ie)&&(b.add(ie),h.push({loc:o+"?page="+encodeURIComponent(ie),slug:ie}));continue}}catch{}let L=String(D).split(/[?#]/)[0];if(L=L.replace(/^\.\//,"").replace(/^\//,""),!L||!/\.(md|html?)$/i.test(L))continue;try{const H=V(L);if(U&&U.has(H)){const W=U.get(H),ie=String(W).split("::")[0];W&&!y.has(W)&&!b.has(W)&&!u.has(ie)&&!c.has(H)&&(b.add(W),h.push({loc:o+"?page="+encodeURIComponent(W),slug:W,sourcePath:H}));continue}try{if(!m(H))continue;const W=await Be(H,e&&e.contentBase?e.contentBase:void 0);if(W&&typeof W.status=="number"&&W.status===404)continue;if(W&&W.raw){const ie=(W.raw||"").match(/^#\s+(.+)$/m),ye=ie&&ie[1]?ie[1].trim():"",ee=he(ye||H),$e=String(ee).split("::")[0];ee&&!y.has(ee)&&!b.has(ee)&&!u.has($e)&&(b.add(ee),h.push({loc:o+"?page="+encodeURIComponent(ee),slug:ee,sourcePath:H,title:ye||void 0}))}}catch{}}catch{}}catch{}}catch{}}}catch{}try{const b=new Map;let y=0;for(const w of h){try{y++,await $t(y,128)}catch{}try{if(!w||!w.slug)continue;b.set(String(w.slug),w)}catch{}}const _=new Set;for(const w of h)try{if(!w||!w.slug)continue;const A=String(w.slug),S=A.split("::")[0];if(!S)continue;A!==S&&!b.has(S)&&_.add(S)}catch{}for(const w of _)try{let A=null;if(f.has(w)){const S=f.get(w);A={loc:o+"?page="+encodeURIComponent(w),slug:w},S&&S.title&&(A.title=S.title,A._titleSource="index"),S&&S.excerpt&&(A.excerpt=S.excerpt),S&&S.path&&(A.sourcePath=S.path)}else if(p&&K&&K.has(w)){const S=K.get(w);let M=null;if(typeof S=="string"?M=V(String(S)):S&&typeof S=="object"&&(M=V(String(S.default||""))),A={loc:o+"?page="+encodeURIComponent(w),slug:w},M&&p.has(M)){const I=p.get(M);I&&I.title&&(A.title=I.title,A._titleSource="path"),I&&I.excerpt&&(A.excerpt=I.excerpt),A.sourcePath=M}}A||(A={loc:o+"?page="+encodeURIComponent(w),slug:w,title:Na(w)},A._titleSource="humanize"),b.has(w)||(h.push(A),b.set(w,A))}catch{}}catch{}const g=[];try{const b=new Set;let y=0;for(const _ of h){try{y++,await $t(y,128)}catch{}try{if(!_||!_.slug)continue;const w=String(_.slug),A=String(w).split("::")[0];if(u.has(A)||w.indexOf("::")!==-1||b.has(w))continue;b.add(w),g.push(_)}catch{}}}catch{}try{try{it(()=>"[runtimeSitemap] generateSitemapJson finalEntries.titleSource: "+JSON.stringify(g.map(b=>({slug:b.slug,title:b.title,titleSource:b._titleSource||null})),null,2))}catch{}}catch{}try{let y=0;const _=g.length,w=Array.from({length:Math.min(4,_)}).map(async()=>{for(;;){const A=y++;if(A>=_)break;const S=g[A];try{if(!S||!S.slug)continue;const M=String(S.slug).split("::")[0];if(u.has(M)||S._titleSource==="index")continue;let I=null;try{if(K&&K.has(S.slug)){const q=K.get(S.slug);typeof q=="string"?I=V(String(q)):q&&typeof q=="object"&&(I=V(String(q.default||"")))}!I&&S.sourcePath&&(I=S.sourcePath)}catch{continue}if(!I||c.has(I)||!m(I))continue;try{const q=await Be(I,e&&e.contentBase?e.contentBase:void 0);if(!q||!q.raw||q&&typeof q.status=="number"&&q.status===404)continue;if(q&&q.raw){const Q=(q.raw||"").match(/^#\s+(.+)$/m),R=Q&&Q[1]?Q[1].trim():"";R&&(S.title=R,S._titleSource="fetched")}}catch(q){it("[runtimeSitemap] fetch title failed for",I,q)}}catch(M){it("[runtimeSitemap] worker loop failure",M)}}});await Promise.all(w)}catch(b){it("[runtimeSitemap] title enrichment failed",b)}return{generatedAt:new Date().toISOString(),entries:g}}function ai(e){const t=e&&Array.isArray(e.entries)?e.entries:Array.isArray(e)?e:[];let n=`<?xml version="1.0" encoding="UTF-8"?>
`;n+=`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;for(const i of t)try{n+=`  <url>
`,n+=`    <loc>${De(String(i.loc||""))}</loc>
`,n+=`  </url>
`}catch{}return n+=`</urlset>
`,n}function si(e){const t=e&&Array.isArray(e.entries)?e.entries:Array.isArray(e)?e:[],n=ri().split("?")[0];let i=`<?xml version="1.0" encoding="UTF-8"?>
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
`,i}function oi(e){const t=e&&Array.isArray(e.entries)?e.entries:Array.isArray(e)?e:[],n=ri().split("?")[0],i=e&&e.generatedAt?new Date(e.generatedAt).toISOString():new Date().toISOString();let r=`<?xml version="1.0" encoding="utf-8"?>
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
`,r}function Ba(e,t="application/xml"){try{try{document.open(t,"replace")}catch{try{document.open()}catch{}}document.write(e),document.close();try{if(typeof Blob<"u"&&typeof URL<"u"&&URL.createObjectURL){const n=new Blob([e],{type:t}),i=URL.createObjectURL(n);try{location.href=i}catch{try{window.open(i,"_self")}catch{}}setTimeout(()=>{try{URL.revokeObjectURL(i)}catch{}},5e3)}}catch{}}catch{try{try{const i=document.createElement("pre");try{i.textContent=De(e)}catch{try{i.textContent=String(e)}catch{}}if(document&&document.body)try{if(typeof document.body.replaceChildren=="function")document.body.replaceChildren(i);else{for(;document.body.firstChild;)document.body.removeChild(document.body.firstChild);document.body.appendChild(i)}}catch{try{document.body.innerHTML="<pre>"+De(e)+"</pre>"}catch{}}}catch{}}catch{}}}function Oa(e){try{const t=e&&Array.isArray(e.entries)?e.entries:Array.isArray(e)?e:[];let n='<!doctype html><html><head><meta charset="utf-8"><title>Sitemap</title></head><body>';n+="<h1>Sitemap</h1><ul>";for(const i of t)try{n+=`<li><a href="${De(String(i&&i.loc?i.loc:""))}">${De(String(i&&(i.title||i.slug)||i&&i.loc||""))}</a></li>`}catch{}return n+="</ul></body></html>",n}catch{return"<!doctype html><html><body><pre>failed to render sitemap</pre></body></html>"}}function ur(e,t="application/xml"){try{if(typeof window>"u"){try{let i=null;t==="application/rss+xml"?i=si(e):t==="application/atom+xml"?i=oi(e):t==="text/html"?i=Oa(e):i=ai(e),Ba(i,t);try{typeof window<"u"&&(window.__nimbiSitemapRenderedAt=Date.now(),window.__nimbiSitemapJson=e,window.__nimbiSitemapFinal=e.entries||[])}catch{}}catch{}return}const n=Array.isArray(e&&e.entries)?e.entries.length:0;try{const i=window.__nimbiSitemapPendingWrite||null;if((!i||typeof i.len=="number"&&i.len<n)&&(window.__nimbiSitemapPendingWrite={finalJson:e,mimeType:t,len:n}),window.__nimbiSitemapWriteTimer)return;window.__nimbiSitemapWriteTimer=setTimeout(()=>{try{const r=window.__nimbiSitemapPendingWrite;if(!r)return;let a=null;r.mimeType==="application/rss+xml"?a=si(r.finalJson):r.mimeType==="application/atom+xml"?a=oi(r.finalJson):r.mimeType==="text/html"?a=Oa(r.finalJson):a=ai(r.finalJson);try{Ba(a,r.mimeType)}catch{}try{window.__nimbiSitemapRenderedAt=Date.now(),window.__nimbiSitemapJson=r.finalJson,window.__nimbiSitemapFinal=r.finalJson.entries||[]}catch{}}catch{}try{clearTimeout(window.__nimbiSitemapWriteTimer)}catch{}window.__nimbiSitemapWriteTimer=null,window.__nimbiSitemapPendingWrite=null},40)}catch{}}catch{}}async function ql(e={}){try{if(typeof document>"u"||typeof location>"u")return!1;let t=!1,n=!1,i=!1,r=!1;try{const u=new URLSearchParams(location.search||"");if(u.has("sitemap")){let d=!0;for(const h of u.keys())h!=="sitemap"&&(d=!1);d&&(t=!0)}if(u.has("rss")){let d=!0;for(const h of u.keys())h!=="rss"&&(d=!1);d&&(n=!0)}if(u.has("atom")){let d=!0;for(const h of u.keys())h!=="atom"&&(d=!1);d&&(i=!0)}}catch{}if(!t&&!n&&!i){const d=(location.pathname||"/").replace(/\/\/+/g,"/").split("/").filter(Boolean).pop()||"";if(!d||(t=/^(sitemap|sitemap\.xml)$/i.test(d),n=/^(rss|rss\.xml)$/i.test(d),i=/^(atom|atom\.xml)$/i.test(d),r=/^(sitemap|sitemap\.html)$/i.test(d),!t&&!n&&!i&&!r))return!1}let a=[];const s=typeof e.waitForIndexMs=="number"?e.waitForIndexMs:1/0;try{if(typeof Bt=="function")try{const u=await Bt({timeoutMs:s,contentBase:e&&e.contentBase,indexDepth:e&&e.indexDepth,noIndexing:e&&e.noIndexing,startBuild:!0});if(Array.isArray(u)&&u.length)if(Array.isArray(e.index)&&e.index.length){const d=new Map;try{for(const h of e.index)try{h&&h.slug&&d.set(String(h.slug),h)}catch{}for(const h of u)try{h&&h.slug&&d.set(String(h.slug),h)}catch{}}catch{}a=Array.from(d.values())}else a=u;else a=Array.isArray(e.index)&&e.index.length?e.index:Array.isArray(ne)&&ne.length?ne:[]}catch{a=Array.isArray(e.index)&&e.index.length?e.index:Array.isArray(ne)&&ne.length?ne:[]}else a=Array.isArray(ne)&&ne.length?ne:Array.isArray(e.index)&&e.index.length?e.index:[]}catch{a=Array.isArray(e.index)&&e.index.length?e.index:Array.isArray(ne)&&ne.length?ne:[]}try{if(Array.isArray(e.index)&&e.index.length)try{const u=new Map;for(const d of e.index)try{if(!d||!d.slug)continue;const h=String(d.slug).split("::")[0];if(!u.has(h))u.set(h,d);else{const f=u.get(h);f&&String(f.slug||"").indexOf("::")!==-1&&String(d.slug||"").indexOf("::")===-1&&u.set(h,d)}}catch{}try{it(()=>"[runtimeSitemap] providedIndex.dedupedByBase: "+JSON.stringify(Array.from(u.values()),null,2))}catch{it(()=>"[runtimeSitemap] providedIndex.dedupedByBase (count): "+String(u.size))}}catch(u){$n("[runtimeSitemap] logging provided index failed",u)}}catch{}if((!Array.isArray(a)||!a.length)&&typeof Qt=="function")try{const u=typeof e.waitForIndexMs=="number"?e.waitForIndexMs:1/0;let d=null;try{typeof Bt=="function"&&(d=await Bt({timeoutMs:u,contentBase:e&&e.contentBase,indexDepth:e&&e.indexDepth,noIndexing:e&&e.noIndexing,startBuild:!0}))}catch{d=null}if(Array.isArray(d)&&d.length)a=d;else{const h=typeof e.indexDepth=="number"?e.indexDepth:3,f=Array.isArray(e.noIndexing)?e.noIndexing:void 0,p=[];e&&e.homePage&&p.push(e.homePage),e&&e.navigationPage&&p.push(e.navigationPage),a=await Qt(e&&e.contentBase?e.contentBase:void 0,h,f,p.length?p:void 0)}}catch(u){$n("[runtimeSitemap] rebuild index failed",u),a=Array.isArray(ne)&&ne.length?ne:[]}try{const u=Array.isArray(a)?a.length:0;try{it(()=>"[runtimeSitemap] usedIndex.full.length (before rebuild): "+String(u))}catch{}try{it(()=>"[runtimeSitemap] usedIndex.full (before rebuild): "+JSON.stringify(a,null,2))}catch{}}catch{}try{const u=[];e&&e.homePage&&u.push(e.homePage),e&&e.navigationPage&&u.push(e.navigationPage);const d=typeof e.indexDepth=="number"?e.indexDepth:3,h=Array.isArray(e.noIndexing)?e.noIndexing:void 0;let f=null;try{const p=typeof globalThis<"u"&&typeof globalThis.buildSearchIndexWorker=="function"?globalThis.buildSearchIndexWorker:void 0;if(typeof p=="function")try{f=await p(e&&e.contentBase?e.contentBase:void 0,d,h)}catch{f=null}}catch{f=null}if((!f||!f.length)&&typeof Qt=="function")try{f=await Qt(e&&e.contentBase?e.contentBase:void 0,d,h,u.length?u:void 0)}catch{f=null}if(Array.isArray(f)&&f.length){const p=new Map;try{for(const m of a)try{m&&m.slug&&p.set(String(m.slug),m)}catch{}for(const m of f)try{m&&m.slug&&p.set(String(m.slug),m)}catch{}}catch{}a=Array.from(p.values())}}catch(u){try{$n("[runtimeSitemap] rebuild index call failed",u)}catch{}}try{const u=Array.isArray(a)?a.length:0;try{it(()=>"[runtimeSitemap] usedIndex.full.length (after rebuild): "+String(u))}catch{}try{it(()=>"[runtimeSitemap] usedIndex.full (after rebuild): "+JSON.stringify(a,null,2))}catch{}}catch{}const o=await ii(Object.assign({},e,{index:a}));let l=[];try{const u=new Set,d=Array.isArray(o&&o.entries)?o.entries:[];for(const h of d)try{let f=null;if(h&&h.slug)f=String(h.slug);else if(h&&h.loc)try{f=new URL(String(h.loc)).searchParams.get("page")}catch{}if(!f)continue;const p=String(f).split("::")[0];if(!u.has(p)){u.add(p);const m=Object.assign({},h);m.baseSlug=p,l.push(m)}}catch{}try{it(()=>"[runtimeSitemap] finalEntries.dedupedByBase: "+JSON.stringify(l,null,2))}catch{it(()=>"[runtimeSitemap] finalEntries.dedupedByBase (count): "+String(l.length))}}catch{try{l=Array.isArray(o&&o.entries)?o.entries.slice(0):[]}catch{l=[]}}const c=Object.assign({},o||{},{entries:Array.isArray(l)?l:Array.isArray(o&&o.entries)?o.entries:[]});try{if(typeof window<"u")try{window.__nimbiSitemapJson=c,window.__nimbiSitemapFinal=l}catch{}}catch{}if(n){const u=Array.isArray(c&&c.entries)?c.entries.length:0;let d=-1;try{typeof window<"u"&&Array.isArray(window.__nimbiSitemapFinal)&&typeof window.__nimbiSitemapRenderedAt=="number"&&(d=window.__nimbiSitemapFinal.length)}catch{}if(d>u){try{it("[runtimeSitemap] skip RSS write: existing rendered sitemap larger",d,u)}catch{}return!0}return ur(c,"application/rss+xml"),!0}if(i){const u=Array.isArray(c&&c.entries)?c.entries.length:0;let d=-1;try{typeof window<"u"&&Array.isArray(window.__nimbiSitemapFinal)&&typeof window.__nimbiSitemapRenderedAt=="number"&&(d=window.__nimbiSitemapFinal.length)}catch{}if(d>u){try{it("[runtimeSitemap] skip Atom write: existing rendered sitemap larger",d,u)}catch{}return!0}return ur(c,"application/atom+xml"),!0}if(t){const u=Array.isArray(c&&c.entries)?c.entries.length:0;let d=-1;try{typeof window<"u"&&Array.isArray(window.__nimbiSitemapFinal)&&typeof window.__nimbiSitemapRenderedAt=="number"&&(d=window.__nimbiSitemapFinal.length)}catch{}if(d>u){try{it("[runtimeSitemap] skip XML write: existing rendered sitemap larger",d,u)}catch{}return!0}return ur(c,"application/xml"),!0}if(r)try{const d=(Array.isArray(c&&c.entries)?c.entries:[]).length;let h=-1;try{typeof window<"u"&&Array.isArray(window.__nimbiSitemapFinal)&&typeof window.__nimbiSitemapRenderedAt=="number"&&(h=window.__nimbiSitemapFinal.length)}catch{}if(h>d){try{it("[runtimeSitemap] skip HTML write: existing rendered sitemap larger",h,d)}catch{}return!0}return ur(c,"text/html"),!0}catch(u){return $n("[runtimeSitemap] render HTML failed",u),!1}return!1}catch(t){return $n("[runtimeSitemap] handleSitemapRequest failed",t),!1}}async function Hl(e={}){try{const t=typeof e.waitForIndexMs=="number"?e.waitForIndexMs:1/0;let n=[];try{if(typeof Bt=="function")try{const s=await Bt({timeoutMs:t,contentBase:e&&e.contentBase,indexDepth:e&&e.indexDepth,noIndexing:e&&e.noIndexing,startBuild:!0});Array.isArray(s)&&s.length&&(n=s)}catch{}}catch{}(!Array.isArray(n)||!n.length)&&Array.isArray(ne)&&ne.length&&(n=ne),(!Array.isArray(n)||!n.length)&&Array.isArray(e.index)&&e.index.length&&(n=e.index);const i=await ii(Object.assign({},e,{index:n}));let r=[];try{const s=new Set,o=Array.isArray(i&&i.entries)?i.entries:[];for(const l of o)try{let c=null;if(l&&l.slug)c=String(l.slug);else if(l&&l.loc)try{c=new URL(String(l.loc)).searchParams.get("page")}catch{c=null}if(!c)continue;const u=String(c).split("::")[0];if(!s.has(u)){s.add(u);const d=Object.assign({},l);d.baseSlug=u,r.push(d)}}catch{}}catch{try{r=Array.isArray(i&&i.entries)?i.entries.slice(0):[]}catch{r=[]}}const a=Object.assign({},i||{},{entries:Array.isArray(r)?r:Array.isArray(i&&i.entries)?i.entries:[]});try{if(typeof window<"u")try{window.__nimbiSitemapJson=a,window.__nimbiSitemapFinal=r}catch{}}catch{}return{json:a,deduped:r}}catch{return null}}const In=Object.freeze(Object.defineProperty({__proto__:null,exposeSitemapGlobals:Hl,generateAtomXml:oi,generateRssXml:si,generateSitemapJson:ii,generateSitemapXml:ai,handleSitemapRequest:ql},Symbol.toStringTag,{value:"Module"}));Oe.BAD_LANGUAGES=kr,Oe.SUPPORTED_HLJS_MAP=Ae,Oe._clearHooks=es,Oe.addHook=jn,Oe.default=$a,Oe.ensureBulma=vi,Oe.getVersion=Ia,Oe.initCMS=$a,Oe.loadL10nFile=vr,Oe.loadSupportedLanguages=xr,Oe.observeCodeBlocks=Si,Oe.onNavBuild=Ya,Oe.onPageLoad=Va,Oe.registerLanguage=en,Oe.runHooks=yr,Oe.setHighlightTheme=ls,Oe.setLang=Ar,Oe.setStyle=Ai,Oe.setThemeVars=us,Oe.t=nn,Oe.transformHtml=Ja,Object.defineProperties(Oe,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})}));
