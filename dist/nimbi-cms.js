(function(Be,Ht){typeof exports=="object"&&typeof module<"u"?Ht(exports):typeof define=="function"&&define.amd?define(["exports"],Ht):(Be=typeof globalThis<"u"?globalThis:Be||self,Ht(Be.nimbiCMS={}))})(this,(function(Be){"use strict";let Ht=0;const gi=Object.create(null);function mi(e){try{const t=Number(e);Ht=Number.isFinite(t)&&t>=0?Math.max(0,Math.min(3,Math.floor(t))):0}catch{Ht=0}}function Ft(e=1){try{return Number(Ht)>=Number(e||1)}catch{return!1}}function pr(){return Ft(1)}function Nn(...e){try{if(!Ft(1)||!console||typeof console.error!="function")return;const t=e.map(n=>typeof n=="function"?n():n);console.error(...t)}catch{}}function _(...e){try{if(!Ft(2)||!console||typeof console.warn!="function")return;const t=e.map(n=>typeof n=="function"?n():n);console.warn(...t)}catch{}}function Lt(...e){try{if(!Ft(3)||!console||typeof console.info!="function")return;const t=e.map(n=>typeof n=="function"?n():n);console.info(...t)}catch{}}function Tt(...e){try{if(!Ft(3)||!console||typeof console.log!="function")return;const t=e.map(n=>typeof n=="function"?n():n);console.log(...t)}catch{}}function yi(e){try{if(!pr())return;const t=String(e||"");if(!t)return;gi[t]=(gi[t]||0)+1}catch{}}function bi(e){try{if(typeof globalThis>"u"||!globalThis.__nimbiCMSDebug)return;const t=String(e||"");if(!t)return;try{globalThis.__nimbiCMSDebug[t]=(globalThis.__nimbiCMSDebug[t]||0)+1}catch{}}catch{}}const cn={onPageLoad:[],onNavBuild:[],transformHtml:[]};function Bn(e,t){if(!Object.prototype.hasOwnProperty.call(cn,e))throw new Error('Unknown hook "'+e+'"');if(typeof t!="function")throw new TypeError("hook callback must be a function");cn[e].push(t)}function Xa(e){Bn("onPageLoad",e)}function Qa(e){Bn("onNavBuild",e)}function Ka(e){Bn("transformHtml",e)}async function gr(e,t){const n=cn[e]||[];for(const i of n)try{await i(t)}catch(r){try{_("[nimbi-cms] runHooks callback failed",r)}catch{}}}function Ya(){Object.keys(cn).forEach(e=>{cn[e].length=0})}function wi(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var mr,_i;function Va(){if(_i)return mr;_i=1;function e(x){return x instanceof Map?x.clear=x.delete=x.set=function(){throw new Error("map is read-only")}:x instanceof Set&&(x.add=x.clear=x.delete=function(){throw new Error("set is read-only")}),Object.freeze(x),Object.getOwnPropertyNames(x).forEach(N=>{const J=x[N],we=typeof J;(we==="object"||we==="function")&&!Object.isFrozen(J)&&e(J)}),x}class t{constructor(N){N.data===void 0&&(N.data={}),this.data=N.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function n(x){return x.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function i(x,...N){const J=Object.create(null);for(const we in x)J[we]=x[we];return N.forEach(function(we){for(const We in we)J[We]=we[We]}),J}const r="</span>",a=x=>!!x.scope,s=(x,{prefix:N})=>{if(x.startsWith("language:"))return x.replace("language:","language-");if(x.includes(".")){const J=x.split(".");return[`${N}${J.shift()}`,...J.map((we,We)=>`${we}${"_".repeat(We+1)}`)].join(" ")}return`${N}${x}`};class l{constructor(N,J){this.buffer="",this.classPrefix=J.classPrefix,N.walk(this)}addText(N){this.buffer+=n(N)}openNode(N){if(!a(N))return;const J=s(N.scope,{prefix:this.classPrefix});this.span(J)}closeNode(N){a(N)&&(this.buffer+=r)}value(){return this.buffer}span(N){this.buffer+=`<span class="${N}">`}}const o=(x={})=>{const N={children:[]};return Object.assign(N,x),N};class c{constructor(){this.rootNode=o(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(N){this.top.children.push(N)}openNode(N){const J=o({scope:N});this.add(J),this.stack.push(J)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(N){return this.constructor._walk(N,this.rootNode)}static _walk(N,J){return typeof J=="string"?N.addText(J):J.children&&(N.openNode(J),J.children.forEach(we=>this._walk(N,we)),N.closeNode(J)),N}static _collapse(N){typeof N!="string"&&N.children&&(N.children.every(J=>typeof J=="string")?N.children=[N.children.join("")]:N.children.forEach(J=>{c._collapse(J)}))}}class u extends c{constructor(N){super(),this.options=N}addText(N){N!==""&&this.add(N)}startScope(N){this.openNode(N)}endScope(){this.closeNode()}__addSublanguage(N,J){const we=N.root;J&&(we.scope=`language:${J}`),this.add(we)}toHTML(){return new l(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function h(x){return x?typeof x=="string"?x:x.source:null}function d(x){return y("(?=",x,")")}function p(x){return y("(?:",x,")*")}function f(x){return y("(?:",x,")?")}function y(...x){return x.map(J=>h(J)).join("")}function g(x){const N=x[x.length-1];return typeof N=="object"&&N.constructor===Object?(x.splice(x.length-1,1),N):{}}function m(...x){return"("+(g(x).capture?"":"?:")+x.map(we=>h(we)).join("|")+")"}function b(x){return new RegExp(x.toString()+"|").exec("").length-1}function w(x,N){const J=x&&x.exec(N);return J&&J.index===0}const k=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function S(x,{joinWith:N}){let J=0;return x.map(we=>{J+=1;const We=J;let Ze=h(we),se="";for(;Ze.length>0;){const ae=k.exec(Ze);if(!ae){se+=Ze;break}se+=Ze.substring(0,ae.index),Ze=Ze.substring(ae.index+ae[0].length),ae[0][0]==="\\"&&ae[1]?se+="\\"+String(Number(ae[1])+We):(se+=ae[0],ae[0]==="("&&J++)}return se}).map(we=>`(${we})`).join(N)}const v=/\b\B/,E="[a-zA-Z]\\w*",B="[a-zA-Z_]\\w*",H="\\b\\d+(\\.\\d+)?",W="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",$="\\b(0b[01]+)",j="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",G=(x={})=>{const N=/^#![ ]*\//;return x.binary&&(x.begin=y(N,/.*\b/,x.binary,/\b.*/)),i({scope:"meta",begin:N,end:/$/,relevance:0,"on:begin":(J,we)=>{J.index!==0&&we.ignoreMatch()}},x)},ie={begin:"\\\\[\\s\\S]",relevance:0},F={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[ie]},L={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[ie]},D={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},U=function(x,N,J={}){const we=i({scope:"comment",begin:x,end:N,contains:[]},J);we.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const We=m("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return we.contains.push({begin:y(/[ ]+/,"(",We,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),we},le=U("//","$"),te=U("/\\*","\\*/"),ce=U("#","$"),_e={scope:"number",begin:H,relevance:0},Ee={scope:"number",begin:W,relevance:0},Fe={scope:"number",begin:$,relevance:0},xe={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[ie,{begin:/\[/,end:/\]/,relevance:0,contains:[ie]}]},Ue={scope:"title",begin:E,relevance:0},R={scope:"title",begin:B,relevance:0},z={begin:"\\.\\s*"+B,relevance:0};var C=Object.freeze({__proto__:null,APOS_STRING_MODE:F,BACKSLASH_ESCAPE:ie,BINARY_NUMBER_MODE:Fe,BINARY_NUMBER_RE:$,COMMENT:U,C_BLOCK_COMMENT_MODE:te,C_LINE_COMMENT_MODE:le,C_NUMBER_MODE:Ee,C_NUMBER_RE:W,END_SAME_AS_BEGIN:function(x){return Object.assign(x,{"on:begin":(N,J)=>{J.data._beginMatch=N[1]},"on:end":(N,J)=>{J.data._beginMatch!==N[1]&&J.ignoreMatch()}})},HASH_COMMENT_MODE:ce,IDENT_RE:E,MATCH_NOTHING_RE:v,METHOD_GUARD:z,NUMBER_MODE:_e,NUMBER_RE:H,PHRASAL_WORDS_MODE:D,QUOTE_STRING_MODE:L,REGEXP_MODE:xe,RE_STARTERS_RE:j,SHEBANG:G,TITLE_MODE:Ue,UNDERSCORE_IDENT_RE:B,UNDERSCORE_TITLE_MODE:R});function T(x,N){x.input[x.index-1]==="."&&N.ignoreMatch()}function I(x,N){x.className!==void 0&&(x.scope=x.className,delete x.className)}function K(x,N){N&&x.beginKeywords&&(x.begin="\\b("+x.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",x.__beforeBegin=T,x.keywords=x.keywords||x.beginKeywords,delete x.beginKeywords,x.relevance===void 0&&(x.relevance=0))}function P(x,N){Array.isArray(x.illegal)&&(x.illegal=m(...x.illegal))}function q(x,N){if(x.match){if(x.begin||x.end)throw new Error("begin & end are not supported with match");x.begin=x.match,delete x.match}}function M(x,N){x.relevance===void 0&&(x.relevance=1)}const O=(x,N)=>{if(!x.beforeMatch)return;if(x.starts)throw new Error("beforeMatch cannot be used with starts");const J=Object.assign({},x);Object.keys(x).forEach(we=>{delete x[we]}),x.keywords=J.keywords,x.begin=y(J.beforeMatch,d(J.begin)),x.starts={relevance:0,contains:[Object.assign(J,{endsParent:!0})]},x.relevance=0,delete J.beforeMatch},Y=["of","and","for","in","not","or","if","then","parent","list","value"],X="keyword";function me(x,N,J=X){const we=Object.create(null);return typeof x=="string"?We(J,x.split(" ")):Array.isArray(x)?We(J,x):Object.keys(x).forEach(function(Ze){Object.assign(we,me(x[Ze],N,Ze))}),we;function We(Ze,se){N&&(se=se.map(ae=>ae.toLowerCase())),se.forEach(function(ae){const be=ae.split("|");we[be[0]]=[Ze,Me(be[0],be[1])]})}}function Me(x,N){return N?Number(N):ye(x)?0:1}function ye(x){return Y.includes(x.toLowerCase())}const ge={},Le=x=>{console.error(x)},Ye=(x,...N)=>{console.log(`WARN: ${x}`,...N)},qe=(x,N)=>{ge[`${x}/${N}`]||(console.log(`Deprecated as of ${x}. ${N}`),ge[`${x}/${N}`]=!0)},St=new Error;function $n(x,N,{key:J}){let we=0;const We=x[J],Ze={},se={};for(let ae=1;ae<=N.length;ae++)se[ae+we]=We[ae],Ze[ae+we]=!0,we+=b(N[ae-1]);x[J]=se,x[J]._emit=Ze,x[J]._multi=!0}function Ct(x){if(Array.isArray(x.begin)){if(x.skip||x.excludeBegin||x.returnBegin)throw Le("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),St;if(typeof x.beginScope!="object"||x.beginScope===null)throw Le("beginScope must be object"),St;$n(x,x.begin,{key:"beginScope"}),x.begin=S(x.begin,{joinWith:""})}}function Nl(x){if(Array.isArray(x.end)){if(x.skip||x.excludeEnd||x.returnEnd)throw Le("skip, excludeEnd, returnEnd not compatible with endScope: {}"),St;if(typeof x.endScope!="object"||x.endScope===null)throw Le("endScope must be object"),St;$n(x,x.end,{key:"endScope"}),x.end=S(x.end,{joinWith:""})}}function Bl(x){x.scope&&typeof x.scope=="object"&&x.scope!==null&&(x.beginScope=x.scope,delete x.scope)}function Ol(x){Bl(x),typeof x.beginScope=="string"&&(x.beginScope={_wrap:x.beginScope}),typeof x.endScope=="string"&&(x.endScope={_wrap:x.endScope}),Ct(x),Nl(x)}function jl(x){function N(se,ae){return new RegExp(h(se),"m"+(x.case_insensitive?"i":"")+(x.unicodeRegex?"u":"")+(ae?"g":""))}class J{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(ae,be){be.position=this.position++,this.matchIndexes[this.matchAt]=be,this.regexes.push([be,ae]),this.matchAt+=b(ae)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const ae=this.regexes.map(be=>be[1]);this.matcherRe=N(S(ae,{joinWith:"|"}),!0),this.lastIndex=0}exec(ae){this.matcherRe.lastIndex=this.lastIndex;const be=this.matcherRe.exec(ae);if(!be)return null;const Ve=be.findIndex((In,oi)=>oi>0&&In!==void 0),Ge=this.matchIndexes[Ve];return be.splice(0,Ve),Object.assign(be,Ge)}}class we{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(ae){if(this.multiRegexes[ae])return this.multiRegexes[ae];const be=new J;return this.rules.slice(ae).forEach(([Ve,Ge])=>be.addRule(Ve,Ge)),be.compile(),this.multiRegexes[ae]=be,be}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(ae,be){this.rules.push([ae,be]),be.type==="begin"&&this.count++}exec(ae){const be=this.getMatcher(this.regexIndex);be.lastIndex=this.lastIndex;let Ve=be.exec(ae);if(this.resumingScanAtSamePosition()&&!(Ve&&Ve.index===this.lastIndex)){const Ge=this.getMatcher(0);Ge.lastIndex=this.lastIndex+1,Ve=Ge.exec(ae)}return Ve&&(this.regexIndex+=Ve.position+1,this.regexIndex===this.count&&this.considerAll()),Ve}}function We(se){const ae=new we;return se.contains.forEach(be=>ae.addRule(be.begin,{rule:be,type:"begin"})),se.terminatorEnd&&ae.addRule(se.terminatorEnd,{type:"end"}),se.illegal&&ae.addRule(se.illegal,{type:"illegal"}),ae}function Ze(se,ae){const be=se;if(se.isCompiled)return be;[I,q,Ol,O].forEach(Ge=>Ge(se,ae)),x.compilerExtensions.forEach(Ge=>Ge(se,ae)),se.__beforeBegin=null,[K,P,M].forEach(Ge=>Ge(se,ae)),se.isCompiled=!0;let Ve=null;return typeof se.keywords=="object"&&se.keywords.$pattern&&(se.keywords=Object.assign({},se.keywords),Ve=se.keywords.$pattern,delete se.keywords.$pattern),Ve=Ve||/\w+/,se.keywords&&(se.keywords=me(se.keywords,x.case_insensitive)),be.keywordPatternRe=N(Ve,!0),ae&&(se.begin||(se.begin=/\B|\b/),be.beginRe=N(be.begin),!se.end&&!se.endsWithParent&&(se.end=/\B|\b/),se.end&&(be.endRe=N(be.end)),be.terminatorEnd=h(be.end)||"",se.endsWithParent&&ae.terminatorEnd&&(be.terminatorEnd+=(se.end?"|":"")+ae.terminatorEnd)),se.illegal&&(be.illegalRe=N(se.illegal)),se.contains||(se.contains=[]),se.contains=[].concat(...se.contains.map(function(Ge){return ql(Ge==="self"?se:Ge)})),se.contains.forEach(function(Ge){Ze(Ge,be)}),se.starts&&Ze(se.starts,ae),be.matcher=We(be),be}if(x.compilerExtensions||(x.compilerExtensions=[]),x.contains&&x.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return x.classNameAliases=i(x.classNameAliases||{}),Ze(x)}function Na(x){return x?x.endsWithParent||Na(x.starts):!1}function ql(x){return x.variants&&!x.cachedVariants&&(x.cachedVariants=x.variants.map(function(N){return i(x,{variants:null},N)})),x.cachedVariants?x.cachedVariants:Na(x)?i(x,{starts:x.starts?i(x.starts):null}):Object.isFrozen(x)?i(x):x}var Hl="11.11.1";class Fl extends Error{constructor(N,J){super(N),this.name="HTMLInjectionError",this.html=J}}const si=n,Ba=i,Oa=Symbol("nomatch"),Dl=7,ja=function(x){const N=Object.create(null),J=Object.create(null),we=[];let We=!0;const Ze="Could not find the language '{}', did you forget to load/include a language module?",se={disableAutodetect:!0,name:"Plain text",contains:[]};let ae={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:u};function be(Q){return ae.noHighlightRe.test(Q)}function Ve(Q){let he=Q.className+" ";he+=Q.parentNode?Q.parentNode.className:"";const Te=ae.languageDetectRe.exec(he);if(Te){const Oe=jt(Te[1]);return Oe||(Ye(Ze.replace("{}",Te[1])),Ye("Falling back to no-highlight mode for this block.",Q)),Oe?Te[1]:"no-highlight"}return he.split(/\s+/).find(Oe=>be(Oe)||jt(Oe))}function Ge(Q,he,Te){let Oe="",Qe="";typeof he=="object"?(Oe=Q,Te=he.ignoreIllegals,Qe=he.language):(qe("10.7.0","highlight(lang, code, ...args) has been deprecated."),qe("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),Qe=Q,Oe=he),Te===void 0&&(Te=!0);const bt={code:Oe,language:Qe};ur("before:highlight",bt);const qt=bt.result?bt.result:In(bt.language,bt.code,Te);return qt.code=bt.code,ur("after:highlight",qt),qt}function In(Q,he,Te,Oe){const Qe=Object.create(null);function bt(ne,ue){return ne.keywords[ue]}function qt(){if(!ke.keywords){Je.addText(je);return}let ne=0;ke.keywordPatternRe.lastIndex=0;let ue=ke.keywordPatternRe.exec(je),Se="";for(;ue;){Se+=je.substring(ne,ue.index);const Ne=At.case_insensitive?ue[0].toLowerCase():ue[0],at=bt(ke,Ne);if(at){const[Mt,sc]=at;if(Je.addText(Se),Se="",Qe[Ne]=(Qe[Ne]||0)+1,Qe[Ne]<=Dl&&(fr+=sc),Mt.startsWith("_"))Se+=ue[0];else{const oc=At.classNameAliases[Mt]||Mt;vt(ue[0],oc)}}else Se+=ue[0];ne=ke.keywordPatternRe.lastIndex,ue=ke.keywordPatternRe.exec(je)}Se+=je.substring(ne),Je.addText(Se)}function hr(){if(je==="")return;let ne=null;if(typeof ke.subLanguage=="string"){if(!N[ke.subLanguage]){Je.addText(je);return}ne=In(ke.subLanguage,je,!0,Ga[ke.subLanguage]),Ga[ke.subLanguage]=ne._top}else ne=li(je,ke.subLanguage.length?ke.subLanguage:null);ke.relevance>0&&(fr+=ne.relevance),Je.__addSublanguage(ne._emitter,ne.language)}function dt(){ke.subLanguage!=null?hr():qt(),je=""}function vt(ne,ue){ne!==""&&(Je.startScope(ue),Je.addText(ne),Je.endScope())}function Da(ne,ue){let Se=1;const Ne=ue.length-1;for(;Se<=Ne;){if(!ne._emit[Se]){Se++;continue}const at=At.classNameAliases[ne[Se]]||ne[Se],Mt=ue[Se];at?vt(Mt,at):(je=Mt,qt(),je=""),Se++}}function Ua(ne,ue){return ne.scope&&typeof ne.scope=="string"&&Je.openNode(At.classNameAliases[ne.scope]||ne.scope),ne.beginScope&&(ne.beginScope._wrap?(vt(je,At.classNameAliases[ne.beginScope._wrap]||ne.beginScope._wrap),je=""):ne.beginScope._multi&&(Da(ne.beginScope,ue),je="")),ke=Object.create(ne,{parent:{value:ke}}),ke}function Wa(ne,ue,Se){let Ne=w(ne.endRe,Se);if(Ne){if(ne["on:end"]){const at=new t(ne);ne["on:end"](ue,at),at.isMatchIgnored&&(Ne=!1)}if(Ne){for(;ne.endsParent&&ne.parent;)ne=ne.parent;return ne}}if(ne.endsWithParent)return Wa(ne.parent,ue,Se)}function tc(ne){return ke.matcher.regexIndex===0?(je+=ne[0],1):(di=!0,0)}function nc(ne){const ue=ne[0],Se=ne.rule,Ne=new t(Se),at=[Se.__beforeBegin,Se["on:begin"]];for(const Mt of at)if(Mt&&(Mt(ne,Ne),Ne.isMatchIgnored))return tc(ue);return Se.skip?je+=ue:(Se.excludeBegin&&(je+=ue),dt(),!Se.returnBegin&&!Se.excludeBegin&&(je=ue)),Ua(Se,ne),Se.returnBegin?0:ue.length}function rc(ne){const ue=ne[0],Se=he.substring(ne.index),Ne=Wa(ke,ne,Se);if(!Ne)return Oa;const at=ke;ke.endScope&&ke.endScope._wrap?(dt(),vt(ue,ke.endScope._wrap)):ke.endScope&&ke.endScope._multi?(dt(),Da(ke.endScope,ne)):at.skip?je+=ue:(at.returnEnd||at.excludeEnd||(je+=ue),dt(),at.excludeEnd&&(je=ue));do ke.scope&&Je.closeNode(),!ke.skip&&!ke.subLanguage&&(fr+=ke.relevance),ke=ke.parent;while(ke!==Ne.parent);return Ne.starts&&Ua(Ne.starts,ne),at.returnEnd?0:ue.length}function ic(){const ne=[];for(let ue=ke;ue!==At;ue=ue.parent)ue.scope&&ne.unshift(ue.scope);ne.forEach(ue=>Je.openNode(ue))}let dr={};function Za(ne,ue){const Se=ue&&ue[0];if(je+=ne,Se==null)return dt(),0;if(dr.type==="begin"&&ue.type==="end"&&dr.index===ue.index&&Se===""){if(je+=he.slice(ue.index,ue.index+1),!We){const Ne=new Error(`0 width match regex (${Q})`);throw Ne.languageName=Q,Ne.badRule=dr.rule,Ne}return 1}if(dr=ue,ue.type==="begin")return nc(ue);if(ue.type==="illegal"&&!Te){const Ne=new Error('Illegal lexeme "'+Se+'" for mode "'+(ke.scope||"<unnamed>")+'"');throw Ne.mode=ke,Ne}else if(ue.type==="end"){const Ne=rc(ue);if(Ne!==Oa)return Ne}if(ue.type==="illegal"&&Se==="")return je+=`
`,1;if(hi>1e5&&hi>ue.index*3)throw new Error("potential infinite loop, way more iterations than matches");return je+=Se,Se.length}const At=jt(Q);if(!At)throw Le(Ze.replace("{}",Q)),new Error('Unknown language: "'+Q+'"');const ac=jl(At);let ui="",ke=Oe||ac;const Ga={},Je=new ae.__emitter(ae);ic();let je="",fr=0,Vt=0,hi=0,di=!1;try{if(At.__emitTokens)At.__emitTokens(he,Je);else{for(ke.matcher.considerAll();;){hi++,di?di=!1:ke.matcher.considerAll(),ke.matcher.lastIndex=Vt;const ne=ke.matcher.exec(he);if(!ne)break;const ue=he.substring(Vt,ne.index),Se=Za(ue,ne);Vt=ne.index+Se}Za(he.substring(Vt))}return Je.finalize(),ui=Je.toHTML(),{language:Q,value:ui,relevance:fr,illegal:!1,_emitter:Je,_top:ke}}catch(ne){if(ne.message&&ne.message.includes("Illegal"))return{language:Q,value:si(he),illegal:!0,relevance:0,_illegalBy:{message:ne.message,index:Vt,context:he.slice(Vt-100,Vt+100),mode:ne.mode,resultSoFar:ui},_emitter:Je};if(We)return{language:Q,value:si(he),illegal:!1,relevance:0,errorRaised:ne,_emitter:Je,_top:ke};throw ne}}function oi(Q){const he={value:si(Q),illegal:!1,relevance:0,_top:se,_emitter:new ae.__emitter(ae)};return he._emitter.addText(Q),he}function li(Q,he){he=he||ae.languages||Object.keys(N);const Te=oi(Q),Oe=he.filter(jt).filter(Fa).map(dt=>In(dt,Q,!1));Oe.unshift(Te);const Qe=Oe.sort((dt,vt)=>{if(dt.relevance!==vt.relevance)return vt.relevance-dt.relevance;if(dt.language&&vt.language){if(jt(dt.language).supersetOf===vt.language)return 1;if(jt(vt.language).supersetOf===dt.language)return-1}return 0}),[bt,qt]=Qe,hr=bt;return hr.secondBest=qt,hr}function Ul(Q,he,Te){const Oe=he&&J[he]||Te;Q.classList.add("hljs"),Q.classList.add(`language-${Oe}`)}function ci(Q){let he=null;const Te=Ve(Q);if(be(Te))return;if(ur("before:highlightElement",{el:Q,language:Te}),Q.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",Q);return}if(Q.children.length>0&&(ae.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(Q)),ae.throwUnescapedHTML))throw new Fl("One of your code blocks includes unescaped HTML.",Q.innerHTML);he=Q;const Oe=he.textContent,Qe=Te?Ge(Oe,{language:Te,ignoreIllegals:!0}):li(Oe);Q.innerHTML=Qe.value,Q.dataset.highlighted="yes",Ul(Q,Te,Qe.language),Q.result={language:Qe.language,re:Qe.relevance,relevance:Qe.relevance},Qe.secondBest&&(Q.secondBest={language:Qe.secondBest.language,relevance:Qe.secondBest.relevance}),ur("after:highlightElement",{el:Q,result:Qe,text:Oe})}function Wl(Q){ae=Ba(ae,Q)}const Zl=()=>{cr(),qe("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function Gl(){cr(),qe("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let qa=!1;function cr(){function Q(){cr()}if(document.readyState==="loading"){qa||window.addEventListener("DOMContentLoaded",Q,!1),qa=!0;return}document.querySelectorAll(ae.cssSelector).forEach(ci)}function Xl(Q,he){let Te=null;try{Te=he(x)}catch(Oe){if(Le("Language definition for '{}' could not be registered.".replace("{}",Q)),We)Le(Oe);else throw Oe;Te=se}Te.name||(Te.name=Q),N[Q]=Te,Te.rawDefinition=he.bind(null,x),Te.aliases&&Ha(Te.aliases,{languageName:Q})}function Ql(Q){delete N[Q];for(const he of Object.keys(J))J[he]===Q&&delete J[he]}function Kl(){return Object.keys(N)}function jt(Q){return Q=(Q||"").toLowerCase(),N[Q]||N[J[Q]]}function Ha(Q,{languageName:he}){typeof Q=="string"&&(Q=[Q]),Q.forEach(Te=>{J[Te.toLowerCase()]=he})}function Fa(Q){const he=jt(Q);return he&&!he.disableAutodetect}function Yl(Q){Q["before:highlightBlock"]&&!Q["before:highlightElement"]&&(Q["before:highlightElement"]=he=>{Q["before:highlightBlock"](Object.assign({block:he.el},he))}),Q["after:highlightBlock"]&&!Q["after:highlightElement"]&&(Q["after:highlightElement"]=he=>{Q["after:highlightBlock"](Object.assign({block:he.el},he))})}function Vl(Q){Yl(Q),we.push(Q)}function Jl(Q){const he=we.indexOf(Q);he!==-1&&we.splice(he,1)}function ur(Q,he){const Te=Q;we.forEach(function(Oe){Oe[Te]&&Oe[Te](he)})}function ec(Q){return qe("10.7.0","highlightBlock will be removed entirely in v12.0"),qe("10.7.0","Please use highlightElement now."),ci(Q)}Object.assign(x,{highlight:Ge,highlightAuto:li,highlightAll:cr,highlightElement:ci,highlightBlock:ec,configure:Wl,initHighlighting:Zl,initHighlightingOnLoad:Gl,registerLanguage:Xl,unregisterLanguage:Ql,listLanguages:Kl,getLanguage:jt,registerAliases:Ha,autoDetection:Fa,inherit:Ba,addPlugin:Vl,removePlugin:Jl}),x.debugMode=function(){We=!1},x.safeMode=function(){We=!0},x.versionString=Hl,x.regex={concat:y,lookahead:d,either:m,optional:f,anyNumberOfTimes:p};for(const Q in C)typeof C[Q]=="object"&&e(C[Q]);return Object.assign(x,C),x},ln=ja({});return ln.newInstance=()=>ja({}),mr=ln,ln.HighlightJS=ln,ln.default=ln,mr}var Ja=Va();const ze=wi(Ja);class On{constructor(t={}){const{maxSize:n=0,ttlMs:i=0,onEvict:r=null}=t||{};this._map=new Map,this._maxSize=Math.max(0,Number(n)||0),this._ttlMs=Math.max(0,Number(i)||0),this._onEvict=typeof r=="function"?r:null}get size(){return this._map.size}has(t){const n=this._map.get(t);return n?this._ttlMs&&Date.now()-(n.ts||0)>=this._ttlMs?(this._evictKey(t,n),!1):(this._map.delete(t),this._map.set(t,n),!0):!1}get(t){const n=this._map.get(t);if(n){if(this._ttlMs&&Date.now()-(n.ts||0)>=this._ttlMs){this._evictKey(t,n);return}return this._map.delete(t),this._map.set(t,n),n.value}}set(t,n){if(this._map.has(t)&&this._map.delete(t),this._map.set(t,{value:n,ts:Date.now()}),this._maxSize&&this._map.size>this._maxSize)for(;this._map.size>this._maxSize;){const i=this._map.keys().next().value,r=this._map.get(i);if(this._map.delete(i),this._onEvict)try{this._onEvict(i,r&&r.value)}catch{}}return this}delete(t){return this._map.delete(t)}clear(){if(this._onEvict)for(const[t,n]of this._map.entries())try{this._onEvict(t,n&&n.value)}catch{}this._map.clear()}_evictKey(t,n){try{this._map.delete(t)}catch{}if(this._onEvict)try{this._onEvict(t,n&&n.value)}catch{}}}const yr=new On({maxSize:500});let es=300*1e3;async function br(e,t){try{if(!e)return null;const n=Date.now();let i=yr.get(e);if(i&&i.ok===!1&&n-(i.ts||0)>=es&&(yr.delete(e),i=void 0),i){if(i.module)return i.module;if(i.promise)try{return await i.promise}catch{return null}}const r={promise:null,module:null,ok:null,ts:Date.now()};yr.set(e,r),r.promise=(async()=>{try{return await t()}catch{return null}})();try{const a=await r.promise;return r.module=a,r.ok=!!a,r.ts=Date.now(),a}catch{return r.module=null,r.ok=!1,r.ts=Date.now(),null}}catch{return null}}async function ts(e){return await br(e,async()=>{try{return await import(e)}catch{return null}})}const ns="11.11.1",ve=new Map,rs="https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md",ct={shell:"bash",sh:"bash",zsh:"bash",js:"javascript",ts:"typescript",py:"python",csharp:"cs","c#":"cs"};ct.html="xml",ct.xhtml="xml",ct.markup="xml";const wr=new Set(["magic","undefined"]);let Rt=null,is=null;async function _r(e=rs){if(e)return Rt||(Rt=(async()=>{try{const t=await fetch(e);if(!t.ok)return;const i=(await t.text()).split(/\r?\n/);let r=-1;for(let c=0;c<i.length;c++)if(/\|\s*Language\s*\|/i.test(i[c])){r=c;break}if(r===-1)return;const a=i[r].replace(/^\||\|$/g,"").split("|").map(c=>c.trim().toLowerCase());let s=a.findIndex(c=>/alias|aliases|equivalent|alt|alternates?/i.test(c));s===-1&&(s=1);let l=a.findIndex(c=>/file|filename|module|module name|module-name|short|slug/i.test(c));if(l===-1){const c=a.findIndex(u=>/language/i.test(u));l=c!==-1?c:0}let o=[];for(let c=r+1;c<i.length;c++){const u=i[c].trim();if(!u||!u.startsWith("|"))break;const h=u.replace(/^\||\|$/g,"").split("|").map(g=>g.trim());if(h.every(g=>/^-+$/.test(g)))continue;const d=h;if(!d.length)continue;const f=(d[l]||d[0]||"").toString().trim().toLowerCase();if(!f||/^-+$/.test(f))continue;ve.set(f,f);const y=d[s]||"";if(y){const g=String(y).split(",").map(m=>m.replace(/`/g,"").trim()).filter(Boolean);if(g.length){const b=g[0].toLowerCase().replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");b&&/[a-z0-9]/i.test(b)&&(ve.set(b,b),o.push(b))}}}try{const c=[];for(const u of o){const h=String(u||"").replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");h&&/[a-z0-9]/i.test(h)?c.push(h):ve.delete(u)}o=c}catch(c){_("[codeblocksManager] cleanup aliases failed",c)}try{let c=0;for(const u of Array.from(ve.keys())){if(!u||/^-+$/.test(u)||!/[a-z0-9]/i.test(u)){ve.delete(u),c++;continue}if(/^[:]+/.test(u)){const h=u.replace(/^[:]+/,"");if(h&&/[a-z0-9]/i.test(h)){const d=ve.get(u);ve.delete(u),ve.set(h,d)}else ve.delete(u),c++}}for(const[u,h]of Array.from(ve.entries()))(!h||/^-+$/.test(h)||!/[a-z0-9]/i.test(h))&&(ve.delete(u),c++);try{const u=":---------------------";ve.has(u)&&(ve.delete(u),c++)}catch(u){_("[codeblocksManager] remove sep key failed",u)}try{const u=Array.from(ve.keys()).sort()}catch(u){_("[codeblocksManager] compute supported keys failed",u)}}catch(c){_("[codeblocksManager] ignored error",c)}}catch(t){_("[codeblocksManager] loadSupportedLanguages failed",t)}})(),Rt)}const un=new Set;async function Jt(e,t){if(Rt||(async()=>{try{await _r()}catch(r){_("[codeblocksManager] loadSupportedLanguages (IIFE) failed",r)}})(),Rt)try{await Rt}catch{}if(e=e==null?"":String(e),e=e.trim(),!e)return!1;const n=e.toLowerCase();if(wr.has(n))return!1;if(ve.size&&!ve.has(n)){const r=ct;if(!r[n]&&!r[e])return!1}if(un.has(e))return!0;const i=ct;try{const r=(t||e||"").toString().replace(/\.js$/i,"").trim(),a=(i[e]||e||"").toString(),s=(i[r]||r||"").toString();let l=Array.from(new Set([a,s,r,e,i[r],i[e]].filter(Boolean))).map(u=>String(u).toLowerCase()).filter(u=>u&&u!=="undefined");ve.size&&(l=l.filter(u=>{if(ve.has(u))return!0;const h=ct[u];return!!(h&&ve.has(h))}));let o=null,c=null;for(const u of l)try{if(o=await br(u,async()=>{try{try{try{return await import(`highlight.js/lib/languages/${u}.js`)}catch{return await import(`highlight.js/lib/languages/${u}`)}}catch{try{return await import(`https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${u}.js`)}catch{try{return await import(`https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${u}.js`)}catch{return null}}}}catch{return null}}),o){const h=o.default||o;try{const d=ve.size&&ve.get(e)||u||e;return ze.registerLanguage(d,h),un.add(d),d!==e&&(ze.registerLanguage(e,h),un.add(e)),!0}catch(d){c=d}}else try{if(ve.has(u)||ve.has(e)){const h=()=>({});try{ze.registerLanguage(u,h),un.add(u)}catch{}try{u!==e&&(ze.registerLanguage(e,h),un.add(e))}catch{}return!0}}catch{}}catch(h){c=h}if(c)throw c;return!1}catch{return!1}}let jn=null;function ki(e){const t=e&&e.querySelector?e:typeof document<"u"?document:null;Rt||(async()=>{try{await _r()}catch(s){_("[codeblocksManager] loadSupportedLanguages (observer) failed",s)}})();const n=ct,r=jn||(typeof IntersectionObserver>"u"?null:(jn=new IntersectionObserver((s,l)=>{s.forEach(o=>{if(!o.isIntersecting)return;const c=o.target;try{l.unobserve(c)}catch(u){_("[codeblocksManager] observer unobserve failed",u)}(async()=>{try{const u=c.getAttribute&&c.getAttribute("class")||c.className||"",h=u.match(/language-([a-zA-Z0-9_+-]+)/)||u.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(h&&h[1]){const d=(h[1]||"").toLowerCase(),p=n[d]||d,f=ve.size&&(ve.get(p)||ve.get(String(p).toLowerCase()))||p;try{await Jt(f)}catch(y){_("[codeblocksManager] registerLanguage failed",y)}try{try{const y=c.textContent||c.innerText||"";y!=null&&(c.textContent=y)}catch{}try{c&&c.dataset&&c.dataset.highlighted&&delete c.dataset.highlighted}catch{}ze.highlightElement(c)}catch(y){_("[codeblocksManager] hljs.highlightElement failed",y)}}else try{const d=c.textContent||"";try{if(ze&&typeof ze.getLanguage=="function"&&ze.getLanguage("plaintext")){const p=ze.highlight(d,{language:"plaintext"});if(p&&p.value)try{if(typeof document<"u"&&document.createRange&&typeof document.createRange=="function"){const f=document.createRange().createContextualFragment(p.value);if(typeof c.replaceChildren=="function")c.replaceChildren(...Array.from(f.childNodes));else{for(;c.firstChild;)c.removeChild(c.firstChild);c.appendChild(f)}}else c.innerHTML=p.value}catch{try{c.innerHTML=p.value}catch{}}}}catch{try{ze.highlightElement(c)}catch(f){_("[codeblocksManager] fallback highlightElement failed",f)}}}catch(d){_("[codeblocksManager] auto-detect plaintext failed",d)}}catch(u){_("[codeblocksManager] observer entry processing failed",u)}})()})},{root:null,rootMargin:"300px",threshold:.1}),jn)),a=t&&t.querySelectorAll?t.querySelectorAll("pre code"):[];if(!r){a.forEach(async s=>{try{const l=s.getAttribute&&s.getAttribute("class")||s.className||"",o=l.match(/language-([a-zA-Z0-9_+-]+)/)||l.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(o&&o[1]){const c=(o[1]||"").toLowerCase(),u=n[c]||c,h=ve.size&&(ve.get(u)||ve.get(String(u).toLowerCase()))||u;try{await Jt(h)}catch(d){_("[codeblocksManager] registerLanguage failed (no observer)",d)}}try{try{const c=s.textContent||s.innerText||"";c!=null&&(s.textContent=c)}catch{}try{s&&s.dataset&&s.dataset.highlighted&&delete s.dataset.highlighted}catch{}ze.highlightElement(s)}catch(c){_("[codeblocksManager] hljs.highlightElement failed (no observer)",c)}}catch(l){_("[codeblocksManager] loadSupportedLanguages fallback ignored error",l)}});return}a.forEach(s=>{try{r.observe(s)}catch(l){_("[codeblocksManager] observe failed",l)}})}function as(e,{useCdn:t=!0}={}){const n=typeof document<"u"&&document.head&&document.head.querySelector?document.head.querySelector("link[data-hl-theme]"):typeof document<"u"?document.querySelector("link[data-hl-theme]"):null,i=n&&n.getAttribute?n.getAttribute("data-hl-theme"):null,r=e==null?"default":String(e),a=r&&String(r).toLowerCase()||"";if(a==="default"||a==="monokai"){try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}return}if(i&&i.toLowerCase()===a)return;if(!t){try{_("Requested highlight theme not bundled; set useCdn=true to load theme from CDN")}catch{}return}const s=a,l=`https://cdn.jsdelivr.net/npm/highlight.js@${ns}/styles/${s}.css`,o=document.createElement("link");o.rel="stylesheet",o.href=l,o.setAttribute("data-hl-theme",s),o.addEventListener("load",()=>{try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}}),document.head.appendChild(o)}let Dt="light";function ss(e,t={}){if(document.querySelector(`link[href="${e}"]`))return;const n=document.createElement("link");if(n.rel="stylesheet",n.href=e,Object.entries(t).forEach(([i,r])=>n.setAttribute(i,r)),document.head.appendChild(n),t["data-bulmaswatch-theme"])try{if(n.getAttribute("data-bulmaswatch-observer"))return;let i=Number(n.getAttribute("data-bulmaswatch-move-count")||0),r=!1;const a=new MutationObserver(()=>{try{if(r)return;const l=n.parentNode;if(!l||l.lastElementChild===n)return;if(i>=1e3){n.setAttribute("data-bulmaswatch-move-stopped","1");return}r=!0;try{l.appendChild(n)}catch{}i+=1,n.setAttribute("data-bulmaswatch-move-count",String(i)),r=!1}catch{}});try{a.observe(document.head,{childList:!0}),n.setAttribute("data-bulmaswatch-observer","1"),n.setAttribute("data-bulmaswatch-move-count",String(i))}catch{}const s=document.head;s&&s.lastElementChild!==n&&s.appendChild(n)}catch{}}function kr(){try{const e=typeof document<"u"&&document.head?document.head:document,t=Array.from(e.querySelectorAll("link[data-bulmaswatch-theme]"));for(const n of t)n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}try{const e=typeof document<"u"&&document.head?document.head:document,t=Array.from(e.querySelectorAll("style[data-bulma-override]"));for(const n of t)n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}}async function xi(e="none",t="/"){try{Tt("[bulmaManager] ensureBulma called",{bulmaCustomize:e,pageDir:t})}catch{}if(!e)return;if(e==="none"){try{const r=[location&&location.protocol&&location.protocol==="file:"?"https://unpkg.com/bulma/css/bulma.min.css":"//unpkg.com/bulma/css/bulma.min.css","https://unpkg.com/bulma/css/bulma.min.css"];let a=!1;for(const s of r)try{if(document.querySelector(`link[href="${s}"]`)){a=!0;break}}catch{}if(!a){const s=r[0],l=document.createElement("link");l.rel="stylesheet",l.href=s,l.setAttribute("data-bulma-base","1");const o=document.querySelector('link[href*="/dist/nimbi-cms.css"], link[href*="dist/nimbi-cms.css"]');o&&o.parentNode?o.parentNode.insertBefore(l,o):document.head.appendChild(l)}}catch{}try{kr()}catch{}return}const n=[t+"bulma.css","/bulma.css"],i=Array.from(new Set(n));if(e==="local"){if(kr(),document.querySelector("style[data-bulma-override]"))return;for(const r of i)try{const a=await fetch(r,{method:"GET"});if(a.ok){const s=await a.text(),l=document.createElement("style");l.setAttribute("data-bulma-override",r),l.appendChild(document.createTextNode(`
/* bulma override: ${r} */
`+s)),document.head.appendChild(l);return}}catch(a){_("[bulmaManager] fetch local bulma candidate failed",a)}return}try{const r=String(e).trim();if(!r)return;kr();const a=`https://unpkg.com/bulmaswatch/${encodeURIComponent(r)}/bulmaswatch.min.css`;ss(a,{"data-bulmaswatch-theme":r})}catch(r){_("[bulmaManager] ensureBulma failed",r)}}function Si(e){Dt=e==="dark"?"dark":e==="system"?"system":"light";try{const t=Array.from(document.querySelectorAll(".nimbi-mount"));if(t.length>0)for(const n of t)Dt==="dark"?n.setAttribute("data-theme","dark"):Dt==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme");else{const n=document.documentElement;Dt==="dark"?n.setAttribute("data-theme","dark"):Dt==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme")}}catch{}}function os(e){const t=document.documentElement;for(const[n,i]of Object.entries(e||{}))try{t.style.setProperty(`--${n}`,i)}catch(r){_("[bulmaManager] setThemeVars failed for",n,r)}}function vi(e){if(!e||!(e instanceof HTMLElement))return()=>{};const t=e.closest&&e.closest(".nimbi-mount")||null;try{t&&(Dt==="dark"?t.setAttribute("data-theme","dark"):Dt==="light"?t.setAttribute("data-theme","light"):t.removeAttribute("data-theme"))}catch{}return()=>{}}const Ai={en:{navigation:"Navigation",onThisPage:"On this page",home:"Home",scrollToTop:"Scroll to top",readingTime:"{minutes} min read",searchPlaceholder:"Search…",imagePreviewTitle:"Image preview",imagePreviewFit:"Fit to screen",imagePreviewOriginal:"Original size",imagePreviewZoomOut:"Zoom out",imagePreviewZoomIn:"Zoom in",imagePreviewClose:"Close"},es:{navigation:"Navegación",onThisPage:"En esta página",home:"Inicio",scrollToTop:"Ir arriba",readingTime:"{minutes} min de lectura",searchPlaceholder:"Buscar…",imagePreviewTitle:"Previsualización de imagen",imagePreviewFit:"Ajustar a la pantalla",imagePreviewOriginal:"Tamaño original",imagePreviewZoomOut:"Alejar",imagePreviewZoomIn:"Acercar",imagePreviewClose:"Cerrar"},de:{navigation:"Navigation",onThisPage:"Auf dieser Seite",home:"Startseite",scrollToTop:"Nach oben",readingTime:"{minutes} min Lesezeit",searchPlaceholder:"Suchen…",imagePreviewTitle:"Bildvorschau",imagePreviewFit:"An Bildschirm anpassen",imagePreviewOriginal:"Originalgröße",imagePreviewZoomOut:"Verkleinern",imagePreviewZoomIn:"Vergrößern",imagePreviewClose:"Schließen"},fr:{navigation:"Navigation",onThisPage:"Sur cette page",home:"Accueil",scrollToTop:"Aller en haut",readingTime:"{minutes} min de lecture",searchPlaceholder:"Rechercher…",imagePreviewTitle:"Aperçu de l’image",imagePreviewFit:"Ajuster à l’écran",imagePreviewOriginal:"Taille originale",imagePreviewZoomOut:"Dézoomer",imagePreviewZoomIn:"Zoomer",imagePreviewClose:"Fermer"},pt:{navigation:"Navegação",onThisPage:"Nesta página",home:"Início",scrollToTop:"Ir para o topo",readingTime:"{minutes} min de leitura",searchPlaceholder:"Procurar…",imagePreviewTitle:"Visualização da imagem",imagePreviewFit:"Ajustar à tela",imagePreviewOriginal:"Tamanho original",imagePreviewZoomOut:"Diminuir",imagePreviewZoomIn:"Aumentar",imagePreviewClose:"Fechar"}},en=JSON.parse(JSON.stringify(Ai));let qn="en";if(typeof navigator<"u"){const e=navigator.language||navigator.languages&&navigator.languages[0]||"en";qn=String(e).split("-")[0].toLowerCase()}Ai[qn]||(qn="en");let zt=qn;function tn(e,t={}){const n=en[zt]||en.en;let i=n&&n[e]?n[e]:en.en[e]||"";for(const r of Object.keys(t))i=i.replace(new RegExp(`{${r}}`,"g"),String(t[r]));return i}async function xr(e,t){if(!e)return;let n=e;try{/^https?:\/\//.test(e)||(n=new URL(e,location.origin+t).toString());const i=await fetch(n);if(!i.ok)return;const r=await i.json();for(const a of Object.keys(r||{}))en[a]=Object.assign({},en[a]||{},r[a])}catch{}}function Sr(e){const t=String(e).split("-")[0].toLowerCase();zt=en[t]?t:"en"}const ls=Object.freeze(Object.defineProperty({__proto__:null,get currentLang(){return zt},loadL10nFile:xr,setLang:Sr,t:tn},Symbol.toStringTag,{value:"Module"}));function cs(e){try{return String(e||"").split("/").map(t=>encodeURIComponent(t)).join("/")}catch{return String(e||"")}}function Ei(e,t=null,n=void 0){let r="#/"+cs(String(e||""));t&&(r+="#"+encodeURIComponent(String(t)));try{let a="";if(typeof n=="string")a=n;else if(typeof location<"u"&&location&&location.search)a=location.search;else if(typeof location<"u"&&location&&location.hash)try{const s=et(location.href);s&&s.params&&(a=s.params)}catch{}if(a){const s=typeof a=="string"&&a.startsWith("?")?a.slice(1):a;try{const l=new URLSearchParams(s);l.delete("page");const o=l.toString();o&&(r+="?"+o)}catch{const o=String(s||"").replace(/^page=[^&]*&?/,"");o&&(r+="?"+o)}}}catch{}return r}function et(e){try{const t=new URL(e,typeof location<"u"?location.href:"http://localhost/"),n=t.searchParams.get("page");if(n){let r=null,a="";if(t.hash){const c=t.hash.replace(/^#/,"");if(c.includes("&")){const u=c.split("&");r=u.shift()||null,a=u.join("&")}else r=c||null}const s=new URLSearchParams(t.search);s.delete("page");const o=[s.toString(),a].filter(Boolean).join("&");return{type:"canonical",page:decodeURIComponent(n),anchor:r,params:o}}const i=t.hash?decodeURIComponent(t.hash.replace(/^#/,"")):"";if(i&&i.startsWith("/")){let r=i,a="";if(r.indexOf("?")!==-1){const c=r.split("?");r=c.shift()||"",a=c.join("?")||""}let s=r,l=null;if(s.indexOf("#")!==-1){const c=s.split("#");s=c.shift()||"",l=c.join("#")||null}return{type:"cosmetic",page:s.replace(/^\/+/,"")||null,anchor:l,params:a}}return{type:"path",page:(t.pathname||"").replace(/^\//,"")||null,anchor:t.hash?t.hash.replace(/^#/,""):null,params:t.search?t.search.replace(/^\?/,""):""}}catch{return{type:"unknown",page:e,anchor:null,params:""}}}let Hn=typeof DOMParser<"u"?new DOMParser:null;function He(){return Hn||(typeof DOMParser<"u"?(Hn=new DOMParser,Hn):null)}async function hn(e,t,n=4){if(!Array.isArray(e)||e.length===0)return[];const i=new Array(e.length);let r=0;const a=[],s=Math.max(1,Number(n)||1);async function l(){for(;;){const o=r++;if(o>=e.length)return;try{i[o]=await t(e[o],o)}catch{i[o]=void 0}}}for(let o=0;o<Math.min(s,e.length);o++)a.push(l());return await Promise.all(a),i}const us=`/**
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
`;function hs(e,t="worker"){let n=null;function i(...o){try{_(...o)}catch{}}function r(){if(!n)try{const o=e();n=o||null,o&&o.addEventListener("error",()=>{try{n===o&&(n=null,o.terminate&&o.terminate())}catch(c){i("["+t+"] worker termination failed",c)}})}catch(o){n=null,i("["+t+"] worker init failed",o)}return n}function a(){try{n&&(n.terminate&&n.terminate(),n=null)}catch(o){i("["+t+"] worker termination failed",o)}}function s(o,c=1e4){return new Promise((u,h)=>{const d=r();if(!d)return h(new Error("worker unavailable"));const p=String(Math.random()),f=Object.assign({},o,{id:p});let y=null;const g=()=>{y&&clearTimeout(y),d.removeEventListener("message",m),d.removeEventListener("error",b)},m=w=>{const k=w.data||{};k.id===p&&(g(),k.error?h(new Error(k.error)):u(k.result))},b=w=>{g(),i("["+t+"] worker error event",w);try{n===d&&(n=null,d.terminate&&d.terminate())}catch(k){i("["+t+"] worker termination failed",k)}h(new Error(w&&w.message||"worker error"))};y=setTimeout(()=>{g(),i("["+t+"] worker timed out");try{n===d&&(n=null,d.terminate&&d.terminate())}catch(w){i("["+t+"] worker termination on timeout failed",w)}h(new Error("worker timeout"))},c),d.addEventListener("message",m),d.addEventListener("error",b);try{d.postMessage(f)}catch(w){g(),h(w)}})}return{get:r,send:s,terminate:a}}function Ci(e,t="worker-pool",n=2){const i=new Array(n).fill(null);let r=0;function a(...f){try{_(...f)}catch{}}function s(f){if(!i[f])try{const y=e();i[f]=y||null,y&&y.addEventListener("error",()=>{try{i[f]===y&&(i[f]=null,y.terminate&&y.terminate())}catch(g){a("["+t+"] worker termination failed",g)}})}catch(y){i[f]=null,a("["+t+"] worker init failed",y)}return i[f]}const l=new Array(n).fill(0),o=new Array(n).fill(null),c=30*1e3;function u(f){try{l[f]=Date.now(),o[f]&&(clearTimeout(o[f]),o[f]=null),o[f]=setTimeout(()=>{try{i[f]&&(i[f].terminate&&i[f].terminate(),i[f]=null)}catch(y){a("["+t+"] idle termination failed",y)}o[f]=null},c)}catch{}}function h(){for(let f=0;f<i.length;f++){const y=s(f);if(y)return y}return null}function d(){for(let f=0;f<i.length;f++)try{i[f]&&(i[f].terminate&&i[f].terminate(),i[f]=null)}catch(y){a("["+t+"] worker termination failed",y)}}function p(f,y=1e4){return new Promise((g,m)=>{const b=r++%i.length,w=k=>{const S=(b+k)%i.length,v=s(S);if(!v)return k+1<i.length?w(k+1):m(new Error("worker pool unavailable"));const E=String(Math.random()),B=Object.assign({},f,{id:E});let H=null;const W=()=>{H&&clearTimeout(H),v.removeEventListener("message",$),v.removeEventListener("error",j)},$=G=>{const ie=G.data||{};ie.id===E&&(W(),ie.error?m(new Error(ie.error)):g(ie.result))},j=G=>{W(),a("["+t+"] worker error event",G);try{i[S]===v&&(i[S]=null,v.terminate&&v.terminate())}catch(ie){a("["+t+"] worker termination failed",ie)}m(new Error(G&&G.message||"worker error"))};H=setTimeout(()=>{W(),a("["+t+"] worker timed out");try{i[S]===v&&(i[S]=null,v.terminate&&v.terminate())}catch(G){a("["+t+"] worker termination on timeout failed",G)}m(new Error("worker timeout"))},y),v.addEventListener("message",$),v.addEventListener("error",j);try{u(S),v.postMessage(B)}catch(G){W(),m(G)}};w(0)})}return{get:h,send:p,terminate:d}}function ds(e,t,n="worker"){return hs(()=>{try{const a=Ut(e);if(a)try{if(!(typeof process<"u"&&process.env&&process.env.VITEST))return a}catch{return a}}catch{}if(typeof t!="function")return null;const r={message:[],error:[]};return{addEventListener(a,s){r[a]||(r[a]=[]),r[a].push(s)},removeEventListener(a,s){if(!r[a])return;const l=r[a].indexOf(s);l!==-1&&r[a].splice(l,1)},postMessage(a){setTimeout(async()=>{try{const l={data:await t(a)};(r.message||[]).forEach(o=>o(l))}catch(s){const l={data:{id:a&&a.id,error:String(s)}};(r.message||[]).forEach(o=>o(l))}},0)},terminate(){Object.keys(r).forEach(a=>r[a].length=0)}}},n)}function Ut(e){try{if(typeof Blob<"u"&&typeof URL<"u"&&e)try{Ut._blobUrlCache||(Ut._blobUrlCache=new On({maxSize:200,onEvict:(i,r)=>{try{typeof URL<"u"&&r&&URL.revokeObjectURL(r)}catch{}}}));const t=Ut._blobUrlCache;let n=t.get(e);if(!n){const i=new Blob([e],{type:"application/javascript"});n=URL.createObjectURL(i),t.set(e,n)}return new Worker(n,{type:"module"})}catch(t){try{_("[worker-manager] createWorkerFromRaw failed",t)}catch{}}}catch(t){try{_("[worker-manager] createWorkerFromRaw failed",t)}catch{}}return null}function fs(){return typeof requestIdleCallback=="function"?new Promise(e=>{try{requestIdleCallback(e,{timeout:50})}catch{setTimeout(e,0)}}):new Promise(e=>setTimeout(e,0))}async function Pt(e,t=50){try{if(!e||!t)return;e%t===0&&await fs()}catch{}}const tt=new Set;function Wt(e){if(ps(),tt.clear(),Array.isArray(Ie)&&Ie.length)for(const t of Ie)t&&tt.add(t);else for(const t of Pe)t&&tt.add(t);Mi(ee),Mi(Z),Wt._refreshed=!0}function Mi(e){if(!(!e||typeof e.values!="function"))for(const t of e.values())t&&tt.add(t)}function Li(e){if(!e||typeof e.set!="function")return;const t=e.set;e.set=function(n,i){return i&&tt.add(i),t.call(this,n,i)}}let Ti=!1;function ps(){Ti||(Li(ee),Li(Z),Ti=!0)}const vr=Object.freeze(Object.defineProperty({__proto__:null,indexSet:tt,refreshIndexPaths:Wt},Symbol.toStringTag,{value:"Module"}));function nn(e,t=1e3){const n=new Map;function i(r){const a=r===void 0?"__undefined":String(r);if(n.has(a)){const l=n.get(a);return n.delete(a),n.set(a,l),l}const s=e(r);try{if(n.set(a,s),n.size>t){const l=n.keys().next().value;n.delete(l)}}catch{}return s}return i._cache=n,i._reset=()=>n.clear(),i}function Ar(e){return!e||typeof e!="string"?!1:/^(https?:)?\/\//.test(e)||e.startsWith("mailto:")||e.startsWith("tel:")}const V=nn(function(e){return String(e||"").replace(/^[.\/]+/,"")},2e3),rn=nn(function(e){return String(e||"").replace(/\/+$/,"")},2e3),Zt=nn(function(e){return rn(String(e||""))+"/"},2e3);function gs(e){try{if(!e||typeof document>"u"||!document.head||e.startsWith("data:")||document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`))return;const n=document.createElement("link");n.rel="preload",n.as="image",n.href=e,document.head.appendChild(n)}catch(t){_("[helpers] preloadImage failed",t)}}function Fn(e,t=0,n=!1){try{if(typeof window>"u"||!e||!e.querySelectorAll)return;const i=Array.from(e.querySelectorAll("img"));if(!i.length)return;const r=e,a=r&&r.getBoundingClientRect?r.getBoundingClientRect():null,s=0,l=typeof window<"u"&&(window.innerHeight||document.documentElement.clientHeight)||0,o=a?Math.max(s,a.top):s,u=(a?Math.min(l,a.bottom):l)+Number(t||0);let h=0;r&&(h=r.clientHeight||(a?a.height:0)),h||(h=l-s);let d=.6;try{const g=r&&window.getComputedStyle?window.getComputedStyle(r):null,m=g&&g.getPropertyValue("--nimbi-image-max-height-ratio"),b=m?parseFloat(m):NaN;!Number.isNaN(b)&&b>0&&b<=1&&(d=b)}catch(g){_("[helpers] read CSS ratio failed",g)}const p=Math.max(200,Math.floor(h*d));let f=!1,y=null;if(i.forEach(g=>{try{const m=g.getAttribute?g.getAttribute("loading"):void 0;m!=="eager"&&g.setAttribute&&g.setAttribute("loading","lazy");const b=g.getBoundingClientRect?g.getBoundingClientRect():null,w=g.src||g.getAttribute&&g.getAttribute("src"),k=b&&b.height>1?b.height:p,S=b?b.top:0,v=S+k;b&&k>0&&S<=u&&v>=o&&(g.setAttribute?(g.setAttribute("loading","eager"),g.setAttribute("fetchpriority","high"),g.setAttribute("data-eager-by-nimbi","1")):(g.loading="eager",g.fetchPriority="high"),gs(w),f=!0),!y&&b&&b.top<=u&&(y={img:g,src:w,rect:b,beforeLoading:m})}catch(m){_("[helpers] setEagerForAboveFoldImages per-image failed",m)}}),!f&&y){const{img:g,src:m,rect:b,beforeLoading:w}=y;try{g.setAttribute?(g.setAttribute("loading","eager"),g.setAttribute("fetchpriority","high"),g.setAttribute("data-eager-by-nimbi","1")):(g.loading="eager",g.fetchPriority="high")}catch(k){_("[helpers] setEagerForAboveFoldImages fallback failed",k)}}}catch(i){_("[helpers] setEagerForAboveFoldImages failed",i)}}function $e(e,t=null,n){try{const i=typeof n=="string"?n:typeof window<"u"&&window.location?window.location.search:"",r=new URLSearchParams(i.startsWith("?")?i.slice(1):i),a=String(e||"");r.delete("page");const s=new URLSearchParams;s.set("page",a);for(const[c,u]of r.entries())s.append(c,u);const l=s.toString();let o=l?`?${l}`:"";return t&&(o+=`#${encodeURIComponent(t)}`),o||`?page=${encodeURIComponent(a)}`}catch{const r=`?page=${encodeURIComponent(String(e||""))}`;return t?`${r}#${encodeURIComponent(t)}`:r}}nn(function(e){try{const t=String(e||"");return t.includes("%")?t:encodeURI(t)}catch(t){return _("[helpers] encodeURL failed",t),String(e||"")}},2e3);function Dn(e){try{const t=e();return t&&typeof t.then=="function"?t.catch(n=>{_("[helpers] safe swallowed error",n)}):t}catch(t){_("[helpers] safe swallowed error",t)}}try{typeof globalThis<"u"&&!globalThis.safe&&(globalThis.safe=Dn)}catch(e){_("[helpers] global attach failed",e)}const ms=nn(function(e){try{if(!e&&e!==0)return"";const t=String(e),n={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:" "};return t.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g,(i,r)=>{if(!r)return i;if(r[0]==="#")try{return r[1]==="x"||r[1]==="X"?String.fromCharCode(parseInt(r.slice(2),16)):String.fromCharCode(parseInt(r.slice(1),10))}catch{return i}return n[r]!==void 0?n[r]:i})}catch{return String(e||"")}},2e3),ee=new Map;let st=[],Er=!1;function ys(e){Er=!!e}function Ri(e){st=Array.isArray(e)?e.slice():[]}function bs(){return st}const Un=typeof navigator<"u"&&navigator.hardwareConcurrency?Math.max(1,Math.floor(navigator.hardwareConcurrency/2)):2,zi=Ci(()=>Ut(us),"slugManager",Un);function ws(){try{if(pr())return!0}catch{}try{return!!(typeof oe=="string"&&oe)}catch{return!1}}function pe(...e){try{Tt(...e)}catch{}}function _s(){return zi.get()}function Pi(e){return zi.send(e,5e3)}async function Cr(e,t=1,n=void 0){const i=await Promise.resolve().then(()=>ot);if(!(i.initSlugWorker&&i.initSlugWorker()))throw new Error("slug worker required but unavailable");return await Pi({type:"buildSearchIndex",contentBase:e,indexDepth:t,noIndexing:n})}async function ks(e,t,n){const i=await Promise.resolve().then(()=>ot);if(!(i.initSlugWorker&&i.initSlugWorker()))throw new Error("slug worker required but unavailable");return Pi({type:"crawlForSlug",slug:e,base:t,maxQueue:n})}function nt(e,t){if(!e)return;let n=null;try{n=V(typeof t=="string"?t:String(t||""))}catch{n=String(t||"")}if(n){try{if(st&&st.length){const r=String(n).split("/")[0],a=st.includes(r);let s=ee.get(e);if(!s||typeof s=="string")s={default:typeof s=="string"?V(s):void 0,langs:{}};else try{s.default&&(s.default=V(s.default))}catch{}a?s.langs[r]=n:s.default=n,ee.set(e,s)}else{const i=ee.has(e)?ee.get(e):void 0;if(i){let r=null;try{typeof i=="string"?r=V(i):i&&typeof i=="object"&&(r=i.default?V(i.default):null)}catch{r=null}if(!r||r===n)ee.set(e,n);else try{const a=new Set;for(const l of ee.keys())a.add(l);const s=typeof Gt=="function"?Gt(e,a):`${e}-2`;ee.set(s,n),e=s}catch{}}else ee.set(e,n)}}catch{}try{if(n){try{Z.set(n,e)}catch{}try{if(Pe&&typeof Pe.has=="function"){if(!Pe.has(n)){try{Pe.add(n)}catch{}try{Array.isArray(Ie)&&!Ie.includes(n)&&Ie.push(n)}catch{}}}else try{Array.isArray(Ie)&&!Ie.includes(n)&&Ie.push(n)}catch{}}catch{}}}catch{}}}const Wn=new Set;function xs(e){typeof e=="function"&&Wn.add(e)}function Ss(e){typeof e=="function"&&Wn.delete(e)}const Z=new Map;let Mr={},Ie=[];const Pe=new Set;let oe="_404.md",yt=null;const Lr="_home";function $i(e){if(e==null){oe=null;return}oe=String(e||"")}function Ii(e){if(e==null){yt=null;return}yt=String(e||"")}function vs(e){Mr=e||{}}function Ni(e){try{if(Array.isArray(re)||(re=[]),!Array.isArray(e))return;try{Array.isArray(re)||(re=[]),re.length=0;for(const t of e)re.push(t);try{if(typeof window<"u")try{window.__nimbiLiveSearchIndex=re}catch{}}catch{}}catch(t){pe("[slugManager] replacing searchIndex by assignment fallback",t);try{re=Array.from(e)}catch{}}}catch{}}const dn=new Map,Zn=new Set;function As(){dn.clear(),Zn.clear()}function Es(e){if(!e||e.length===0)return"";let t=e[0];for(let i=1;i<e.length;i++){const r=e[i];let a=0;const s=Math.min(t.length,r.length);for(;a<s&&t[a]===r[a];)a++;t=t.slice(0,a)}const n=t.lastIndexOf("/");return n===-1?t:t.slice(0,n+1)}const de=nn(function(e){let n=String(e||"").toLowerCase().replace(/[^a-z0-9\- ]/g,"").replace(/ /g,"-");return n=n.replace(/(?:-?)(?:md|html)$/,""),n=n.replace(/-+/g,"-"),n=n.replace(/^-|-$/g,""),n.length>80&&(n=n.slice(0,80).replace(/-+$/g,"")),n},2e3);function Tr(e){ee.clear(),Z.clear(),Ie=[];try{Pe.clear()}catch{}st=st||[];const t=Object.keys(Mr||{});if(!t.length)return;let n="";try{if(e){try{/^[a-z][a-z0-9+.-]*:/i.test(String(e))?n=new URL(String(e)).pathname:n=String(e||"")}catch(i){n=String(e||""),pe("[slugManager] parse contentBase failed",i)}n=Zt(n)}}catch(i){n="",pe("[slugManager] setContentBase prefix derivation failed",i)}n||(n=Es(t));for(const i of t){let r=i;n&&i.startsWith(n)?r=V(i.slice(n.length)):r=V(i),Ie.push(r);try{Pe.add(r)}catch{}try{Wt()}catch(s){pe("[slugManager] refreshIndexPaths failed",s)}const a=Mr[i];if(typeof a=="string"){const s=(a||"").match(/^#\s+(.+)$/m);if(s&&s[1]){const l=de(s[1].trim());if(l)try{let o=l;if((!st||!st.length)&&(o=Gt(o,new Set(ee.keys()))),st&&st.length){const u=r.split("/")[0],h=st.includes(u);let d=ee.get(o);(!d||typeof d=="string")&&(d={default:typeof d=="string"?d:void 0,langs:{}}),h?d.langs[u]=r:d.default=r,ee.set(o,d)}else ee.set(o,r);Z.set(r,o)}catch(o){pe("[slugManager] set slug mapping failed",o)}}}}}try{Tr()}catch(e){pe("[slugManager] initial setContentBase failed",e)}function Gt(e,t){if(!t.has(e))return e;let n=2,i=`${e}-${n}`;for(;t.has(i);)n+=1,i=`${e}-${n}`;return i}function Cs(e){return fn(e,void 0)}function fn(e,t){if(!e)return!1;if(e.startsWith("//"))return!0;if(/^[a-z][a-z0-9+.-]*:/i.test(e)){if(t&&typeof t=="string")try{const n=new URL(e),i=new URL(t);return n.origin!==i.origin?!0:!n.pathname.startsWith(i.pathname)}catch{return!0}return!0}if(e.startsWith("/")&&t&&typeof t=="string")try{const n=new URL(e,t),i=new URL(t);return n.origin!==i.origin?!0:!n.pathname.startsWith(i.pathname)}catch{return!0}return!1}function Gn(e){return e==null?e:String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g,(t,n)=>n)}function an(e){if(!e||!ee.has(e))return null;const t=ee.get(e);if(!t)return null;if(typeof t=="string")return t;if(st&&st.length&&zt&&t.langs&&t.langs[zt])return t.langs[zt];if(t.default)return t.default;if(t.langs){const n=Object.keys(t.langs);if(n.length)return t.langs[n[0]]}return null}const ft=new On({maxSize:2e3});function Ms(){ft.clear(),$t.clear()}const $t=new On({maxSize:2e3});let Bi=60*1e3;function Ls(e){Bi=Number(e)||0}function Ts(e){try{const t=Math.max(0,Number(e)||0);ft&&typeof ft._maxSize<"u"&&(ft._maxSize=t)}catch{}}function Rs(e){try{const t=Math.max(0,Number(e)||0);ft&&typeof ft._ttlMs<"u"&&(ft._ttlMs=t)}catch{}}function zs(e){try{const t=Math.max(0,Number(e)||0);$t&&typeof $t._maxSize<"u"&&($t._maxSize=t)}catch{}}let Rr=Math.max(1,Math.min(Un,5));function Ps(e){try{Rr=Math.max(1,Number(e)||1)}catch{Rr=1}}function pn(){return Rr}let Ce=async function(e,t,n){if(!e)throw new Error("path required");try{if(typeof e=="string"&&(e.indexOf("?page=")!==-1||e.startsWith("?")||e.startsWith("#/")||e.indexOf("#/")!==-1))try{const o=et(e);o&&o.page&&(e=o.page)}catch{}}catch{}try{const o=(String(e||"").match(/([^\/]+)\.md(?:$|[?#])/)||[])[1];if(o&&ee.has(o)){const c=an(o)||ee.get(o);c&&c!==e&&(e=c)}}catch(o){pe("[slugManager] slug mapping normalization failed",o)}try{if(typeof e=="string"&&e.indexOf("::")!==-1){const o=String(e).split("::",1)[0];if(o)try{if(ee.has(o)){const c=an(o)||ee.get(o);c?e=c:e=o}else e=o}catch{e=o}}}catch(o){pe("[slugManager] path sanitize failed",o)}if(!(n&&n.force===!0||typeof oe=="string"&&oe||ee&&ee.size||Pe&&Pe.size||pr()))throw new Error("failed to fetch md");const r=t==null?"":rn(String(t));let a="";try{const o=typeof location<"u"&&location.origin?location.origin:"http://localhost";if(r&&r.startsWith("/")&&!/^[a-z][a-z0-9+.-]*:/i.test(r)){const c=r.replace(/\/$/,"")+"/"+e.replace(/^\//,"");a=(typeof location<"u"&&location&&location.origin?location.origin:"http://localhost").replace(/\/$/,"")+c}else{let c=o+"/";r&&(/^[a-z][a-z0-9+.-]*:/i.test(r)?c=r.replace(/\/$/,"")+"/":r.startsWith("/")?c=o+r.replace(/\/$/,"")+"/":c=o+"/"+r.replace(/\/$/,"")+"/"),a=new URL(e.replace(/^\//,""),c).toString()}}catch{a=(typeof location<"u"&&location.origin?location.origin:"http://localhost")+"/"+e.replace(/^\//,"")}try{const o=$t.get(a);if(o&&o>Date.now())return Promise.reject(new Error("failed to fetch md"));o&&$t.delete(a)}catch{}if(ft.has(a))return ft.get(a);const l=(async()=>{const o=await fetch(a);if(!o||typeof o.ok!="boolean"||!o.ok){if(o&&o.status===404&&typeof oe=="string"&&oe)try{const f=`${r}/${oe}`,y=await globalThis.fetch(f);if(y&&typeof y.ok=="boolean"&&y.ok)return{raw:await y.text(),status:404}}catch(f){pe("[slugManager] fetching fallback 404 failed",f)}let p="";try{o&&typeof o.clone=="function"?p=await o.clone().text():o&&typeof o.text=="function"?p=await o.text():p=""}catch(f){p="",pe("[slugManager] reading error body failed",f)}try{const f=o?o.status:void 0;if(f===404)try{_("fetchMarkdown failed (404):",()=>({url:a,status:f,statusText:o?o.statusText:void 0,body:p.slice(0,200)}))}catch{}else try{Nn("fetchMarkdown failed:",()=>({url:a,status:f,statusText:o?o.statusText:void 0,body:p.slice(0,200)}))}catch{}}catch{}throw new Error("failed to fetch md")}const c=await o.text(),u=c.trim().slice(0,128).toLowerCase(),h=/^(?:<!doctype|<html|<title|<h1)/.test(u),d=h||String(e||"").toLowerCase().endsWith(".html");if(h&&String(e||"").toLowerCase().endsWith(".md")){try{if(typeof oe=="string"&&oe){const p=`${r}/${oe}`,f=await globalThis.fetch(p);if(f.ok)return{raw:await f.text(),status:404}}}catch(p){pe("[slugManager] fetching fallback 404 failed",p)}throw ws()&&Nn("fetchMarkdown: server returned HTML for .md request",a),new Error("failed to fetch md")}return d?{raw:c,isHtml:!0}:{raw:c}})().catch(o=>{try{$t.set(a,Date.now()+Bi)}catch{}try{ft.delete(a)}catch{}throw o});return ft.set(a,l),l};function $s(e){typeof e=="function"&&(Ce=e)}const Xn=new Map;function Is(e){if(!e||typeof e!="string")return"";let t=e.replace(/```[\s\S]*?```/g,"");return t=t.replace(/<pre[\s\S]*?<\/pre>/gi,""),t=t.replace(/<code[\s\S]*?<\/code>/gi,""),t=t.replace(/<!--([\s\S]*?)-->/g,""),t=t.replace(/^ {4,}.*$/gm,""),t=t.replace(/`[^`]*`/g,""),t}let re=[];function Ns(){return re}try{if(typeof window<"u")try{Object.defineProperty(window,"__nimbiSearchIndex",{get(){return re},enumerable:!0,configurable:!0})}catch{try{window.__nimbiSearchIndex=re}catch{}}}catch{}try{if(typeof window<"u")try{Object.defineProperty(window,"__nimbiIndexReady",{get(){return zr},enumerable:!0,configurable:!0})}catch{try{window.__nimbiIndexReady=zr}catch{}}}catch{}let It=null;async function Xt(e,t=1,n=void 0,i=void 0){const r=Array.isArray(n)?Array.from(new Set((n||[]).map(a=>V(String(a||""))))):[];try{const a=V(String(oe||""));a&&!r.includes(a)&&r.push(a)}catch{}if(re&&re.length&&t===1&&!re.some(s=>{try{return r.includes(V(String(s.path||"")))}catch{return!1}}))return re;if(It)return It;It=(async()=>{let a=Array.isArray(n)?Array.from(new Set((n||[]).map(g=>V(String(g||""))))):[];try{const g=V(String(oe||""));g&&!a.includes(g)&&a.push(g)}catch{}const s=g=>{if(!a||!a.length)return!1;for(const m of a)if(m&&(g===m||g.startsWith(m+"/")))return!0;return!1};let l=[];try{if(Array.isArray(i)&&i.length)for(const g of i)try{const m=V(String(g||""));m&&l.push(m)}catch{}}catch{}if(Array.isArray(Ie)&&Ie.length&&(l=Array.from(Ie)),!l.length){if(Z&&typeof Z.size=="number"&&Z.size)try{l=Array.from(Z.keys())}catch{l=[]}else for(const g of ee.values())if(g){if(typeof g=="string")l.push(g);else if(g&&typeof g=="object"){g.default&&l.push(g.default);const m=g.langs||{};for(const b of Object.keys(m||{}))try{m[b]&&l.push(m[b])}catch{}}}}try{const g=await Fi(e);g&&g.length&&(l=l.concat(g))}catch(g){pe("[slugManager] crawlAllMarkdown during buildSearchIndex failed",g)}try{const g=new Set(l),m=[...l],b=Math.max(1,Math.min(pn(),m.length||pn()));let w=0;const k=async()=>{for(;!(g.size>gn);){const v=m.shift();if(!v)break;try{const E=await Ce(v,e);if(E&&E.raw){if(E.status===404)continue;let B=E.raw;const H=[],W=String(v||"").replace(/^.*\//,"");if(/^readme(?:\.md)?$/i.test(W)&&Er&&(!v||!v.includes("/")))continue;const $=Is(B),j=/\[[^\]]+\]\(([^)]+)\)/g;let G;for(;G=j.exec($);)H.push(G[1]);const ie=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;G=ie.exec($);)H.push(G[1]);const F=v&&v.includes("/")?v.substring(0,v.lastIndexOf("/")+1):"";for(let L of H)try{if(fn(L,e)||L.startsWith("..")||L.indexOf("/../")!==-1||(F&&!L.startsWith("./")&&!L.startsWith("/")&&!L.startsWith("../")&&(L=F+L),L=V(L),!/\.(md|html?)(?:$|[?#])/i.test(L))||(L=L.split(/[?#]/)[0],s(L)))continue;g.has(L)||(g.add(L),m.push(L),l.push(L))}catch(D){pe("[slugManager] href processing failed",L,D)}}}catch(E){pe("[slugManager] discovery fetch failed for",v,E)}try{w++,await Pt(w,32)}catch{}}},S=[];for(let v=0;v<b;v++)S.push(k());await Promise.all(S)}catch(g){pe("[slugManager] discovery loop failed",g)}const o=new Set;l=l.filter(g=>!g||o.has(g)||s(g)?!1:(o.add(g),!0));const c=[],u=new Map,h=l.filter(g=>/\.(?:md|html?)(?:$|[?#])/i.test(g)),d=Math.max(1,Math.min(pn(),h.length||1)),p=h.slice(),f=[];for(let g=0;g<d;g++)f.push((async()=>{for(;p.length;){const m=p.shift();if(!m)break;try{const b=await Ce(m,e);u.set(m,b)}catch(b){pe("[slugManager] buildSearchIndex: entry fetch failed",m,b),u.set(m,null)}}})());await Promise.all(f);let y=0;for(const g of l){try{y++,await Pt(y,16)}catch{}if(/\.(?:md|html?)(?:$|[?#])/i.test(g))try{const m=u.get(g);if(!m||!m.raw||m.status===404)continue;let b="",w="",k=null;if(m.isHtml)try{const v=He(),E=v?v.parseFromString(m.raw,"text/html"):null,B=E?E.querySelector("title")||E.querySelector("h1"):null;B&&B.textContent&&(b=B.textContent.trim());const H=E?E.querySelector("p"):null;if(H&&H.textContent&&(w=H.textContent.trim()),t>=2)try{const W=E?E.querySelector("h1"):null,$=W&&W.textContent?W.textContent.trim():b||"";try{const G=Z&&typeof Z.has=="function"&&Z.has(g)?Z.get(g):null;if(G)k=G;else{let ie=de(b||g);const F=new Set;try{for(const D of ee.keys())F.add(D)}catch{}try{for(const D of c)D&&D.slug&&F.add(String(D.slug).split("::")[0])}catch{}let L=!1;try{if(ee.has(ie)){const D=ee.get(ie);if(typeof D=="string")D===g&&(L=!0);else if(D&&typeof D=="object"){D.default===g&&(L=!0);for(const U of Object.keys(D.langs||{}))if(D.langs[U]===g){L=!0;break}}}}catch{}!L&&F.has(ie)&&(ie=Gt(ie,F)),k=ie;try{Z.has(g)||nt(k,g)}catch{}}}catch(G){pe("[slugManager] derive pageSlug failed",G)}const j=Array.from(E.querySelectorAll("h2"));for(const G of j)try{const ie=(G.textContent||"").trim();if(!ie)continue;const F=G.id?G.id:de(ie),L=k?`${k}::${F}`:`${de(g)}::${F}`;let D="",U=G.nextElementSibling;for(;U&&U.tagName&&U.tagName.toLowerCase()==="script";)U=U.nextElementSibling;U&&U.textContent&&(D=String(U.textContent).trim()),c.push({slug:L,title:ie,excerpt:D,path:g,parentTitle:$})}catch(ie){pe("[slugManager] indexing H2 failed",ie)}if(t===3)try{const G=Array.from(E.querySelectorAll("h3"));for(const ie of G)try{const F=(ie.textContent||"").trim();if(!F)continue;const L=ie.id?ie.id:de(F),D=k?`${k}::${L}`:`${de(g)}::${L}`;let U="",le=ie.nextElementSibling;for(;le&&le.tagName&&le.tagName.toLowerCase()==="script";)le=le.nextElementSibling;le&&le.textContent&&(U=String(le.textContent).trim()),c.push({slug:D,title:F,excerpt:U,path:g,parentTitle:$})}catch(F){pe("[slugManager] indexing H3 failed",F)}}catch(G){pe("[slugManager] collect H3s failed",G)}}catch(W){pe("[slugManager] collect H2s failed",W)}}catch(v){pe("[slugManager] parsing HTML for index failed",v)}else{const v=m.raw,E=v.match(/^#\s+(.+)$/m);b=E?E[1].trim():"";try{b=Gn(b)}catch{}const B=v.split(/\r?\n\s*\r?\n/);if(B.length>1)for(let H=1;H<B.length;H++){const W=B[H].trim();if(W&&!/^#/.test(W)){w=W.replace(/\r?\n/g," ");break}}if(t>=2){let H="";try{const W=(v.match(/^#\s+(.+)$/m)||[])[1];H=W?W.trim():"";try{const G=Z&&typeof Z.has=="function"&&Z.has(g)?Z.get(g):null;if(G)k=G;else{let ie=de(b||g);const F=new Set;try{for(const D of ee.keys())F.add(D)}catch{}try{for(const D of c)D&&D.slug&&F.add(String(D.slug).split("::")[0])}catch{}let L=!1;try{if(ee.has(ie)){const D=ee.get(ie);if(typeof D=="string")D===g&&(L=!0);else if(D&&typeof D=="object"){D.default===g&&(L=!0);for(const U of Object.keys(D.langs||{}))if(D.langs[U]===g){L=!0;break}}}}catch{}!L&&F.has(ie)&&(ie=Gt(ie,F)),k=ie;try{Z.has(g)||nt(k,g)}catch{}}}catch(G){pe("[slugManager] derive pageSlug failed",G)}const $=/^##\s+(.+)$/gm;let j;for(;j=$.exec(v);)try{const G=(j[1]||"").trim(),ie=Gn(G);if(!G)continue;const F=de(G),L=k?`${k}::${F}`:`${de(g)}::${F}`,U=v.slice($.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),le=U&&U[1]?String(U[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";c.push({slug:L,title:ie,excerpt:le,path:g,parentTitle:H})}catch(G){pe("[slugManager] indexing markdown H2 failed",G)}}catch(W){pe("[slugManager] collect markdown H2s failed",W)}if(t===3)try{const W=/^###\s+(.+)$/gm;let $;for(;$=W.exec(v);)try{const j=($[1]||"").trim(),G=Gn(j);if(!j)continue;const ie=de(j),F=k?`${k}::${ie}`:`${de(g)}::${ie}`,D=v.slice(W.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),U=D&&D[1]?String(D[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";c.push({slug:F,title:G,excerpt:U,path:g,parentTitle:H})}catch(j){pe("[slugManager] indexing markdown H3 failed",j)}}catch(W){pe("[slugManager] collect markdown H3s failed",W)}}}let S="";try{Z.has(g)&&(S=Z.get(g))}catch(v){pe("[slugManager] mdToSlug access failed",v)}if(!S){try{if(!k){const v=Z&&typeof Z.has=="function"&&Z.has(g)?Z.get(g):null;if(v)k=v;else{let E=de(b||g);const B=new Set;try{for(const W of ee.keys())B.add(W)}catch{}try{for(const W of c)W&&W.slug&&B.add(String(W.slug).split("::")[0])}catch{}let H=!1;try{if(ee.has(E)){const W=ee.get(E);if(typeof W=="string")W===g&&(H=!0);else if(W&&typeof W=="object"){W.default===g&&(H=!0);for(const $ of Object.keys(W.langs||{}))if(W.langs[$]===g){H=!0;break}}}}catch{}!H&&B.has(E)&&(E=Gt(E,B)),k=E;try{Z.has(g)||nt(k,g)}catch{}}}}catch(v){pe("[slugManager] derive pageSlug failed",v)}S=k||de(b||g)}c.push({slug:S,title:b,excerpt:w,path:g})}catch(m){pe("[slugManager] buildSearchIndex: entry processing failed",m)}}try{const g=c.filter(m=>{try{return!s(String(m.path||""))}catch{return!0}});try{Array.isArray(re)||(re=[]),re.length=0;for(const m of g)re.push(m)}catch{try{re=Array.from(g)}catch{re=g}}try{if(typeof window<"u"){try{window.__nimbiResolvedIndex=re}catch{}try{const m=[],b=new Set;for(const w of re)try{if(!w||!w.slug)continue;const k=String(w.slug).split("::")[0];if(b.has(k))continue;b.add(k);const S={slug:k};w.title?S.title=String(w.title):w.parentTitle&&(S.title=String(w.parentTitle)),w.path&&(S.path=String(w.path)),m.push(S)}catch{}try{window.__nimbiSitemapJson={generatedAt:new Date().toISOString(),entries:m}}catch{}try{window.__nimbiSitemapFinal=m}catch{}}catch{}}}catch{}}catch(g){pe("[slugManager] filtering index by excludes failed",g);try{Array.isArray(re)||(re=[]),re.length=0;for(const m of c)re.push(m)}catch{try{re=Array.from(c)}catch{re=c}}try{if(typeof window<"u")try{window.__nimbiResolvedIndex=re}catch{}}catch{}}return re})();try{await It}catch(a){pe("[slugManager] awaiting _indexPromise failed",a)}return It=null,re}async function Nt(e={}){try{const t=typeof e.timeoutMs=="number"?e.timeoutMs:8e3,n=e.contentBase,i=typeof e.indexDepth=="number"?e.indexDepth:1,r=Array.isArray(e.noIndexing)?e.noIndexing:void 0,a=Array.isArray(e.seedPaths)?e.seedPaths:void 0,s=typeof e.startBuild=="boolean"?e.startBuild:!0;if(Array.isArray(re)&&re.length&&!It&&!s)return re;if(It){try{await It}catch{}return re}if(s){try{if(typeof Cr=="function")try{const o=await Cr(n,i,r,a);if(Array.isArray(o)&&o.length){try{Ni(o)}catch{}return re}}catch{}}catch{}try{return await Xt(n,i,r,a),re}catch{}}const l=Date.now();for(;Date.now()-l<t;){if(Array.isArray(re)&&re.length)return re;await new Promise(o=>setTimeout(o,150))}return re}catch{return re}}async function zr(e={}){try{const t=Object.assign({},e);typeof t.startBuild!="boolean"&&(t.startBuild=!0),typeof t.timeoutMs!="number"&&(t.timeoutMs=1/0);try{return await Nt(t)}catch{return re}}catch{return re}}const Oi=1e3;let gn=Oi;function Bs(e){typeof e=="number"&&e>=0&&(gn=e)}const ji=He(),qi="a[href]";let Hi=async function(e,t,n=gn){if(Xn.has(e))return Xn.get(e);let i=null;const r=new Set,a=[""],s=typeof location<"u"&&location.origin?location.origin:"http://localhost";let l=s+"/";try{t&&(/^[a-z][a-z0-9+.-]*:/i.test(String(t))?l=String(t).replace(/\/$/,"")+"/":String(t).startsWith("/")?l=s+String(t).replace(/\/$/,"")+"/":l=s+"/"+String(t).replace(/\/$/,"")+"/")}catch{l=s+"/"}const o=Math.max(1,Math.min(Un,6));for(;a.length&&!i&&!(a.length>n);){const c=a.splice(0,o);await hn(c,async u=>{if(u==null||r.has(u))return;r.add(u);let h="";try{h=new URL(u||"",l).toString()}catch{h=(String(t||"")||s)+"/"+String(u||"").replace(/^\//,"")}try{let d;try{d=await globalThis.fetch(h)}catch(m){pe("[slugManager] crawlForSlug: fetch failed",{url:h,error:m});return}if(!d||!d.ok){d&&!d.ok&&pe("[slugManager] crawlForSlug: directory fetch non-ok",{url:h,status:d.status});return}const p=await d.text(),f=ji.parseFromString(p,"text/html");let y=[];try{f&&typeof f.getElementsByTagName=="function"?y=f.getElementsByTagName("a"):f&&typeof f.querySelectorAll=="function"?y=f.querySelectorAll(qi):y=[]}catch{try{y=f.getElementsByTagName?f.getElementsByTagName("a"):[]}catch{y=[]}}const g=h;for(const m of y)try{if(i)break;let b=m.getAttribute("href")||"";if(!b||fn(b,t)||b.startsWith("..")||b.indexOf("/../")!==-1)continue;if(b.endsWith("/")){try{const w=new URL(b,g),k=new URL(l).pathname,S=w.pathname.startsWith(k)?w.pathname.slice(k.length):w.pathname.replace(/^\//,""),v=Zt(V(S));r.has(v)||a.push(v)}catch{const k=V(u+b);r.has(k)||a.push(k)}continue}if(b.toLowerCase().endsWith(".md")){let w="";try{const k=new URL(b,g),S=new URL(l).pathname;w=k.pathname.startsWith(S)?k.pathname.slice(S.length):k.pathname.replace(/^\//,"")}catch{w=(u+b).replace(/^\//,"")}w=V(w);try{if(Z.has(w))continue;for(const k of ee.values());}catch(k){pe("[slugManager] slug map access failed",k)}try{const k=await Ce(w,t);if(k&&k.raw){const S=(k.raw||"").match(/^#\s+(.+)$/m);if(S&&S[1]&&de(S[1].trim())===e){i=w;break}}}catch(k){pe("[slugManager] crawlForSlug: fetchMarkdown failed",k)}}}catch(b){pe("[slugManager] crawlForSlug: link iteration failed",b)}}catch(d){pe("[slugManager] crawlForSlug: directory fetch failed",d)}},o)}return Xn.set(e,i),i};async function Fi(e,t=gn){const n=new Set,i=new Set,r=[""],a=typeof location<"u"&&location.origin?location.origin:"http://localhost";let s=a+"/";try{e&&(/^[a-z][a-z0-9+.-]*:/i.test(String(e))?s=String(e).replace(/\/$/,"")+"/":String(e).startsWith("/")?s=a+String(e).replace(/\/$/,"")+"/":s=a+"/"+String(e).replace(/\/$/,"")+"/")}catch{s=a+"/"}const l=Math.max(1,Math.min(Un,6));for(;r.length&&!(r.length>t);){const o=r.splice(0,l);await hn(o,async c=>{if(c==null||i.has(c))return;i.add(c);let u="";try{u=new URL(c||"",s).toString()}catch{u=(String(e||"")||a)+"/"+String(c||"").replace(/^\//,"")}try{let h;try{h=await globalThis.fetch(u)}catch(g){pe("[slugManager] crawlAllMarkdown: fetch failed",{url:u,error:g});return}if(!h||!h.ok){h&&!h.ok&&pe("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:u,status:h.status});return}const d=await h.text(),p=ji.parseFromString(d,"text/html");let f=[];try{p&&typeof p.getElementsByTagName=="function"?f=p.getElementsByTagName("a"):p&&typeof p.querySelectorAll=="function"?f=p.querySelectorAll(qi):f=[]}catch{try{f=p.getElementsByTagName?p.getElementsByTagName("a"):[]}catch{f=[]}}const y=u;for(const g of f)try{let m=g.getAttribute("href")||"";if(!m||fn(m,e)||m.startsWith("..")||m.indexOf("/../")!==-1)continue;if(m.endsWith("/")){try{const w=new URL(m,y),k=new URL(s).pathname,S=w.pathname.startsWith(k)?w.pathname.slice(k.length):w.pathname.replace(/^\//,""),v=Zt(V(S));i.has(v)||r.push(v)}catch{const k=c+m;i.has(k)||r.push(k)}continue}let b="";try{const w=new URL(m,y),k=new URL(s).pathname;b=w.pathname.startsWith(k)?w.pathname.slice(k.length):w.pathname.replace(/^\//,"")}catch{b=(c+m).replace(/^\//,"")}b=V(b),/\.(md|html?)$/i.test(b)&&n.add(b)}catch(m){pe("[slugManager] crawlAllMarkdown: link iteration failed",m)}}catch(h){pe("[slugManager] crawlAllMarkdown: directory fetch failed",h)}},l)}return Array.from(n)}async function Di(e,t,n){if(e&&typeof e=="string"&&(e=V(e),e=rn(e)),ee.has(e))return an(e)||ee.get(e);try{if(!(typeof oe=="string"&&oe||ee.has(e)||Pe&&Pe.size||Wt._refreshed||typeof t=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(t)))return null}catch{}for(const r of Wn)try{const a=await r(e,t);if(a)return nt(e,a),a}catch(a){pe("[slugManager] slug resolver failed",a)}if(Pe&&Pe.size){if(dn.has(e)){const r=dn.get(e);return nt(e,r),r}for(const r of Ie)if(!Zn.has(r))try{const a=await Ce(r,t);if(a&&a.raw){const s=(a.raw||"").match(/^#\s+(.+)$/m);if(s&&s[1]){const l=de(s[1].trim());if(Zn.add(r),l&&dn.set(l,r),l===e)return nt(e,r),r}}}catch(a){pe("[slugManager] manifest title fetch failed",a)}try{crawlBatchYieldCount++,await Pt(crawlBatchYieldCount,8)}catch{}}try{const r=await Xt(t);if(r&&r.length){const a=r.find(s=>s.slug===e);if(a)return nt(e,a.path),a.path}}catch(r){pe("[slugManager] buildSearchIndex lookup failed",r)}try{const r=await Hi(e,t,n);if(r)return nt(e,r),r}catch(r){pe("[slugManager] crawlForSlug lookup failed",r)}const i=[`${e}.html`,`${e}.md`];for(const r of i)try{const a=await Ce(r,t);if(a&&a.raw)return nt(e,r),r}catch(a){pe("[slugManager] candidate fetch failed",a)}if(Pe&&Pe.size)for(const r of Ie)try{const a=r.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(de(a)===e)return nt(e,r),r}catch(a){pe("[slugManager] build-time filename match failed",a)}try{if(yt&&typeof yt=="string"&&yt.trim())try{const r=await Ce(yt,t);if(r&&r.raw){const a=(r.raw||"").match(/^#\s+(.+)$/m);if(a&&a[1]&&de(a[1].trim())===e)return nt(e,yt),yt}}catch(r){pe("[slugManager] home page fetch failed",r)}}catch(r){pe("[slugManager] home page fetch failed",r)}return null}const ot=Object.freeze(Object.defineProperty({__proto__:null,CRAWL_MAX_QUEUE:Oi,HOME_SLUG:Lr,_setAllMd:vs,_setSearchIndex:Ni,_storeSlugMapping:nt,addSlugResolver:xs,get allMarkdownPaths(){return Ie},allMarkdownPathsSet:Pe,get availableLanguages(){return st},awaitSearchIndex:zr,buildSearchIndex:Xt,buildSearchIndexWorker:Cr,clearFetchCache:Ms,clearListCaches:As,crawlAllMarkdown:Fi,crawlCache:Xn,crawlForSlug:Hi,crawlForSlugWorker:ks,get defaultCrawlMaxQueue(){return gn},ensureSlug:Di,fetchCache:ft,get fetchMarkdown(){return Ce},getFetchConcurrency:pn,getLanguages:bs,getSearchIndex:Ns,get homePage(){return yt},initSlugWorker:_s,isExternalLink:Cs,isExternalLinkWithBase:fn,listPathsFetched:Zn,listSlugCache:dn,mdToSlug:Z,negativeFetchCache:$t,get notFoundPage(){return oe},removeSlugResolver:Ss,resolveSlugPath:an,get searchIndex(){return re},setContentBase:Tr,setDefaultCrawlMaxQueue:Bs,setFetchCacheMaxSize:Ts,setFetchCacheTTL:Rs,setFetchConcurrency:Ps,setFetchMarkdown:$s,setFetchNegativeCacheTTL:Ls,setHomePage:Ii,setLanguages:Ri,setNegativeFetchCacheMaxSize:zs,setNotFoundPage:$i,setSkipRootReadme:ys,get skipRootReadme(){return Er},slugResolvers:Wn,slugToMd:ee,slugify:de,unescapeMarkdown:Gn,uniqueSlug:Gt,whenSearchIndexReady:Nt},Symbol.toStringTag,{value:"Module"}));var Pr,Ui;function Os(){if(Ui)return Pr;Ui=1;function e(a,s){return s.some(([l,o])=>l<=a&&a<=o)}function t(a){if(typeof a!="string")return!1;const s=a.charCodeAt(0);return e(s,[[12352,12447],[19968,40959],[44032,55203],[131072,191456]])}function n(a){return` 
\r	`.includes(a)}function i(a){if(typeof a!="string")return!1;const s=a.charCodeAt(0);return e(s,[[33,47],[58,64],[91,96],[123,126],[12288,12351],[65280,65519]])}function r(a,s={}){let l=0,o=0,c=a.length-1;const u=s.wordsPerMinute||200,h=s.wordBound||n;for(;h(a[o]);)o++;for(;h(a[c]);)c--;const d=`${a}
`;for(let g=o;g<=c;g++)if((t(d[g])||!h(d[g])&&(h(d[g+1])||t(d[g+1])))&&l++,t(d[g]))for(;g<=c&&(i(d[g+1])||h(d[g+1]));)g++;const p=l/u,f=Math.round(p*60*1e3);return{text:Math.ceil(p.toFixed(2))+" min read",minutes:p,time:f,words:l}}return Pr=r,Pr}var js=Os();const qs=wi(js),mn=new Map,Hs=200;function Fs(e){return String(e||"")}function Ds(e,t){if(mn.set(e,t),mn.size>Hs){const n=mn.keys().next().value;n&&mn.delete(n)}}function Us(e){return e?String(e).trim().split(/\s+/).filter(Boolean).length:0}function Ws(e){const t=Fs(e),n=mn.get(t);if(n)return Object.assign({},n);const i=qs(e||""),r=typeof i.words=="number"?i.words:Us(e),a={readingTime:i,wordCount:r};return Ds(t,a),Object.assign({},a)}function yn(e,t){let n=document.querySelector(`meta[name="${e}"]`);n||(n=document.createElement("meta"),n.setAttribute("name",e),document.head.appendChild(n)),n.setAttribute("content",t)}function Bt(e,t,n){let i=`meta[${e}="${t}"]`,r=document.querySelector(i);r||(r=document.createElement("meta"),r.setAttribute(e,t),document.head.appendChild(r)),r.setAttribute("content",n)}function Wi(e,t){try{let n=document.querySelector(`link[rel="${e}"]`);n||(n=document.createElement("link"),n.setAttribute("rel",e),document.head.appendChild(n)),n.setAttribute("href",t)}catch(n){_("[seoManager] upsertLinkRel failed",n)}}function Zs(e,t,n,i){const r=t&&String(t).trim()?t:e.title||document.title;Bt("property","og:title",r);const a=i&&String(i).trim()?i:e.description||"";a&&String(a).trim()&&Bt("property","og:description",a),a&&String(a).trim()&&Bt("name","twitter:description",a),Bt("name","twitter:card",e.twitter_card||"summary_large_image");const s=n||e.image;s&&(Bt("property","og:image",s),Bt("name","twitter:image",s))}function $r(e,t,n,i,r=""){const a=e.meta||{},s=document&&document.querySelector&&document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",l=i&&String(i).trim()?i:a.description&&String(a.description).trim()?a.description:s&&String(s).trim()?s:"";l&&String(l).trim()&&yn("description",l),yn("robots",a.robots||"index,follow"),Zs(a,t,n,l)}function Gs(){try{const e=['meta[name="site"]','meta[name="site-name"]','meta[name="siteName"]','meta[property="og:site_name"]','meta[name="twitter:site"]'];for(const t of e){const n=document.querySelector(t);if(n){const i=n.getAttribute("content")||"";if(i&&i.trim())return i.trim()}}}catch(e){_("[seoManager] getSiteNameFromMeta failed",e)}return""}function Ir(e,t,n,i,r,a=""){try{const s=e.meta||{},l=n&&String(n).trim()?n:s.title||a||document.title,o=r&&String(r).trim()?r:s.description||document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",c=i||s.image||null;let u="";try{if(t){const f=V(t);try{u=(location.origin+location.pathname).split("?")[0]+"?page="+encodeURIComponent(f)}catch{u=location.href.split("#")[0]}}else u=location.href.split("#")[0]}catch(f){u=location.href.split("#")[0],_("[seoManager] compute canonical failed",f)}u&&Wi("canonical",u);try{Bt("property","og:url",u)}catch(f){_("[seoManager] upsertMeta og:url failed",f)}const h={"@context":"https://schema.org","@type":"Article",headline:l||"",description:o||"",url:u||location.href.split("#")[0]};c&&(h.image=String(c)),s.date&&(h.datePublished=s.date),s.dateModified&&(h.dateModified=s.dateModified);const d="nimbi-jsonld";let p=document.getElementById(d);p||(p=document.createElement("script"),p.type="application/ld+json",p.id=d,document.head.appendChild(p)),p.textContent=JSON.stringify(h,null,2)}catch(s){_("[seoManager] setStructuredData failed",s)}}let bn=typeof window<"u"&&window.__SEO_MAP?window.__SEO_MAP:{};function Xs(e){try{if(!e||typeof e!="object"){bn={};return}bn=Object.assign({},e)}catch(t){_("[seoManager] setSeoMap failed",t)}}function Qs(e,t=""){try{if(!e)return;const n=bn&&bn[e]?bn[e]:typeof window<"u"&&window.__SEO_MAP&&window.__SEO_MAP[e]?window.__SEO_MAP[e]:null;try{const i=location.origin+location.pathname+"?page="+encodeURIComponent(String(e||""));Wi("canonical",i);try{Bt("property","og:url",i)}catch{}}catch{}if(!n)return;try{n.title&&(document.title=String(n.title))}catch{}try{n.description&&yn("description",String(n.description))}catch{}try{try{$r({meta:n},n.title||void 0,n.image||void 0,n.description||void 0,t)}catch{}}catch{}try{Ir({meta:n},e,n.title||void 0,n.image||void 0,n.description||void 0,t)}catch(i){_("[seoManager] inject structured data failed",i)}}catch(n){_("[seoManager] injectSeoForPage failed",n)}}function Qn(e={},t="",n=void 0,i=void 0){try{const r=e||{},a=typeof n=="string"&&n.trim()?n:r.title||"Not Found",s=typeof i=="string"&&i.trim()?i:r.description||"";try{yn("robots","noindex,follow")}catch{}try{s&&String(s).trim()&&yn("description",String(s))}catch{}try{$r({meta:Object.assign({},r,{robots:"noindex,follow"})},a,r.image||void 0,s)}catch{}try{Ir({meta:Object.assign({},r,{title:a,description:s})},t||"",a,r.image||void 0,s)}catch{}}catch(r){_("[seoManager] markNotFound failed",r)}}function Ks(e,t,n,i,r,a,s,l,o,c,u){try{if(i&&i.querySelector){const h=i.querySelector(".menu-label");h&&(h.textContent=l&&l.textContent||e("onThisPage"))}}catch(h){_("[seoManager] update toc label failed",h)}try{const h=n.meta&&n.meta.title?String(n.meta.title).trim():"",d=r.querySelector("img"),p=d&&(d.getAttribute("src")||d.src)||null;let f="";try{let m="";try{const b=l||(r&&r.querySelector?r.querySelector("h1"):null);if(b){let w=b.nextElementSibling;const k=[];for(;w&&!(w.tagName&&w.tagName.toLowerCase()==="h2");){try{if(w.classList&&w.classList.contains("nimbi-article-subtitle")){w=w.nextElementSibling;continue}}catch{}const S=(w.textContent||"").trim();S&&k.push(S),w=w.nextElementSibling}k.length&&(m=k.join(" ").replace(/\s+/g," ").trim()),!m&&o&&(m=String(o).trim())}}catch(b){_("[seoManager] compute descOverride failed",b)}m&&String(m).length>160&&(m=String(m).slice(0,157).trim()+"..."),f=m}catch(m){_("[seoManager] compute descOverride failed",m)}let y="";try{h&&(y=h)}catch{}if(!y)try{l&&l.textContent&&(y=String(l.textContent).trim())}catch{}if(!y)try{const m=r.querySelector("h2");m&&m.textContent&&(y=String(m.textContent).trim())}catch{}y||(y=a||"");try{$r(n,y||void 0,p,f)}catch(m){_("[seoManager] setMetaTags failed",m)}try{Ir(n,c,y||void 0,p,f,t)}catch(m){_("[seoManager] setStructuredData failed",m)}const g=Gs();y?g?document.title=`${g} - ${y}`:document.title=`${t||"Site"} - ${y}`:h?document.title=h:document.title=t||document.title}catch(h){_("[seoManager] applyPageMeta failed",h)}try{try{const h=r.querySelectorAll(".nimbi-reading-time");h&&h.forEach(d=>d.remove())}catch{}if(o){const h=Ws(u.raw||""),d=h&&h.readingTime?h.readingTime:null,p=d&&typeof d.minutes=="number"?Math.ceil(d.minutes):0,f=p?e("readingTime",{minutes:p}):"";if(!f)return;const y=r.querySelector("h1");if(y){const g=r.querySelector(".nimbi-article-subtitle");try{if(g){const m=document.createElement("span");m.className="nimbi-reading-time",m.textContent=f,g.appendChild(m)}else{const m=document.createElement("p");m.className="nimbi-article-subtitle is-6 has-text-grey-light";const b=document.createElement("span");b.className="nimbi-reading-time",b.textContent=f,m.appendChild(b);try{y.parentElement.insertBefore(m,y.nextSibling)}catch{try{y.insertAdjacentElement("afterend",m)}catch{}}}}catch{try{const b=document.createElement("p");b.className="nimbi-article-subtitle is-6 has-text-grey-light";const w=document.createElement("span");w.className="nimbi-reading-time",w.textContent=f,b.appendChild(w),y.insertAdjacentElement("afterend",b)}catch{}}}}}catch(h){_("[seoManager] reading time update failed",h)}}let Zi=100;function Gi(e){Zi=e}function ut(){try{if(Ft(2))return!0}catch{}try{return!1}catch{return!1}}let wn=300*1e3;function Xi(e){wn=e}const pt=new Map;function Ys(e){if(!pt.has(e))return;const t=pt.get(e),n=Date.now();if(t.ts+wn<n){pt.delete(e);return}return pt.delete(e),pt.set(e,t),t.value}function Vs(e,t){if(Qi(),Qi(),pt.delete(e),pt.set(e,{value:t,ts:Date.now()}),pt.size>Zi){const n=pt.keys().next().value;n!==void 0&&pt.delete(n)}}function Qi(){if(!wn||wn<=0)return;const e=Date.now();for(const[t,n]of pt.entries())n.ts+wn<e&&pt.delete(t)}async function Js(e,t){const n=new Set(tt);let i=[];try{if(typeof document<"u"&&document.getElementsByClassName){const r=a=>{const s=document.getElementsByClassName(a);for(let l=0;l<s.length;l++){const o=s[l].getElementsByTagName("a");for(let c=0;c<o.length;c++)i.push(o[c])}};r("nimbi-site-navbar"),r("navbar"),r("nimbi-nav")}else i=Array.from(document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a"))}catch{try{i=Array.from(document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a"))}catch{i=[]}}for(const r of Array.from(i||[])){const a=r.getAttribute("href")||"";if(a)try{try{const h=et(a);if(h){if(h.type==="canonical"&&h.page){const d=V(h.page);if(d){n.add(d);continue}}if(h.type==="cosmetic"&&h.page){const d=h.page;if(ee.has(d)){const p=ee.get(d);if(p)return p}continue}}}catch{}const s=new URL(a,location.href);if(s.origin!==location.origin)continue;const l=(s.hash||s.pathname).match(/([^#?]+\.md)(?:$|[?#])/)||(s.pathname||"").match(/([^#?]+\.md)(?:$|[?#])/);if(l){let h=V(l[1]);h&&n.add(h);continue}const o=(r.textContent||"").trim(),c=(s.pathname||"").replace(/^.*\//,"");if(o&&de(o)===e||c&&de(c.replace(/\.(html?|md)$/i,""))===e)return s.toString();if(/\.(html?)$/i.test(s.pathname)){let h=s.pathname.replace(/^\//,"");n.add(h);continue}const u=s.pathname||"";if(u){const h=new URL(t),d=Zt(h.pathname);if(u.indexOf(d)!==-1){let p=u.startsWith(d)?u.slice(d.length):u;p=V(p),p&&n.add(p)}}}catch(s){_("[router] malformed URL while discovering index candidates",s)}}for(const r of n)try{if(!r||!String(r).includes(".md"))continue;const a=await Ce(r,t);if(!a||!a.raw)continue;const s=(a.raw||"").match(/^#\s+(.+)$/m);if(s){const l=(s[1]||"").trim();if(l&&de(l)===e)return r}}catch(a){_("[router] fetchMarkdown during index discovery failed",a)}return null}function eo(e){const t=[];if(String(e).includes(".md")||String(e).includes(".html"))/index\.html$/i.test(e)||t.push(e);else try{const n=decodeURIComponent(String(e||""));if(ee.has(n)){const i=an(n)||ee.get(n);i&&(/\.(md|html?)$/i.test(i)?/index\.html$/i.test(i)||t.push(i):(t.push(i),t.push(i+".html")))}else{if(tt&&tt.size)for(const i of tt){const r=i.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(de(r)===n&&!/index\.html$/i.test(i)){t.push(i);break}}!t.length&&n&&!/\.(md|html?)$/i.test(n)&&(t.push(n+".html"),t.push(n+".md"))}}catch(n){_("[router] buildPageCandidates failed during slug handling",n)}return t}async function to(e,t){const n=e||"";try{try{yi("fetchPageData")}catch{}try{bi("fetchPageData")}catch{}}catch{}let i=null;try{const m=et(typeof location<"u"?location.href:"");m&&m.anchor&&(i=m.anchor)}catch{try{i=location&&location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null}catch{i=null}}let r=e||"",a=null;const s=String(n||"").includes(".md")||String(n||"").includes(".html");if(r&&String(r).includes("::")){const m=String(r).split("::",2);r=m[0],a=m[1]||null}const o=`${e}|||${typeof ls<"u"&&zt?zt:""}`,c=Ys(o);if(c)r=c.resolved,a=c.anchor||a;else{if(!String(r).includes(".md")&&!String(r).includes(".html")){let m=decodeURIComponent(String(r||""));if(m&&typeof m=="string"&&(m=V(m),m=rn(m)),ee.has(m))r=an(m)||ee.get(m);else{let b=await Js(m,t);if(b)r=b;else if(Wt._refreshed&&tt&&tt.size||typeof t=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(t)){const w=await Di(m,t);w&&(r=w)}}}Vs(o,{resolved:r,anchor:a})}let u=!0;try{const m=String(r||"").includes(".md")||String(r||"").includes(".html")||r&&(r.startsWith("http://")||r.startsWith("https://")||r.startsWith("/"));u=typeof oe=="string"&&oe||ee.has(r)||tt&&tt.size||Wt._refreshed||s||m}catch{u=!0}!a&&i&&(a=i);try{if(u&&r&&(r.startsWith("http://")||r.startsWith("https://")||r.startsWith("/"))){const m=r.startsWith("/")?new URL(r,location.origin).toString():r;try{const b=await fetch(m);if(b&&b.ok){const w=await b.text(),k=b&&b.headers&&typeof b.headers.get=="function"&&b.headers.get("content-type")||"",S=(w||"").toLowerCase();if(k&&k.indexOf&&k.indexOf("text/html")!==-1||S.indexOf("<!doctype")!==-1||S.indexOf("<html")!==-1){if(!s)try{let B=m;try{B=new URL(m).pathname.replace(/^\//,"")}catch{B=String(m||"").replace(/^\//,"")}const H=B.replace(/\.html$/i,".md");try{const W=await Ce(H,t);if(W&&W.raw)return{data:W,pagePath:H,anchor:a}}catch{}if(typeof oe=="string"&&oe)try{const W=await Ce(oe,t);if(W&&W.raw){try{Qn(W.meta||{},oe)}catch{}return{data:W,pagePath:oe,anchor:a}}}catch{}try{g=new Error("site shell detected (absolute fetch)")}catch{}}catch{}if(S.indexOf('<div id="app"')!==-1||S.indexOf("nimbi-cms")!==-1||S.indexOf("nimbi-mount")!==-1||S.indexOf("nimbi-")!==-1||S.indexOf("initcms(")!==-1||S.indexOf("window.nimbi")!==-1||/\bnimbi\b/.test(S))try{let B=m;try{B=new URL(m).pathname.replace(/^\//,"")}catch{B=String(m||"").replace(/^\//,"")}const H=B.replace(/\.html$/i,".md");try{const W=await Ce(H,t);if(W&&W.raw)return{data:W,pagePath:H,anchor:a}}catch{}if(typeof oe=="string"&&oe)try{const W=await Ce(oe,t);if(W&&W.raw){try{Qn(W.meta||{},oe)}catch{}return{data:W,pagePath:oe,anchor:a}}}catch{}try{g=new Error("site shell detected (absolute fetch)")}catch{}}catch{}}}}catch{}}}catch{}const h=eo(r);try{if(ut())try{Tt("[router-debug] fetchPageData candidates",{originalRaw:n,resolved:r,pageCandidates:h})}catch{}}catch{}const d=String(n||"").includes(".md")||String(n||"").includes(".html");let p=null;if(!d)try{let m=decodeURIComponent(String(n||""));m=V(m),m=rn(m),m&&!/\.(md|html?)$/i.test(m)&&(p=m)}catch{p=null}if(d&&h.length===0&&(String(r).includes(".md")||String(r).includes(".html"))&&h.push(r),h.length===0&&(String(r).includes(".md")||String(r).includes(".html"))&&h.push(r),h.length===1&&/index\.html$/i.test(h[0])&&!d&&!ee.has(r)&&!ee.has(decodeURIComponent(String(r||"")))&&!String(r||"").includes("/"))throw new Error("Unknown slug: index.html fallback prevented");let f=null,y=null,g=null;try{const m=String(r||"").includes(".md")||String(r||"").includes(".html")||r&&(r.startsWith("http://")||r.startsWith("https://")||r.startsWith("/"));u=typeof oe=="string"&&oe||ee.has(r)||tt&&tt.size||Wt._refreshed||d||m}catch{u=!0}if(!u)g=new Error("no page data");else for(const m of h)if(m)try{const b=V(m);if(f=await Ce(b,t),y=b,p&&!ee.has(p))try{let w="";if(f&&f.isHtml)try{const k=He();if(k){const S=k.parseFromString(f.raw||"","text/html"),v=S.querySelector("h1")||S.querySelector("title");v&&v.textContent&&(w=v.textContent.trim())}}catch{}else{const k=(f&&f.raw||"").match(/^#\s+(.+)$/m);k&&k[1]&&(w=k[1].trim())}if(w&&de(w)!==p)try{if(/\.html$/i.test(b)){const S=b.replace(/\.html$/i,".md");if(h.includes(S))try{const v=await Ce(S,t);if(v&&v.raw)f=v,y=S;else if(typeof oe=="string"&&oe)try{const E=await Ce(oe,t);if(E&&E.raw)f=E,y=oe;else{f=null,y=null,g=new Error("slug mismatch for candidate");continue}}catch{f=null,y=null,g=new Error("slug mismatch for candidate");continue}else{f=null,y=null,g=new Error("slug mismatch for candidate");continue}}catch{try{const E=await Ce(oe,t);if(E&&E.raw)f=E,y=oe;else{f=null,y=null,g=new Error("slug mismatch for candidate");continue}}catch{f=null,y=null,g=new Error("slug mismatch for candidate");continue}}else{f=null,y=null,g=new Error("slug mismatch for candidate");continue}}else{f=null,y=null,g=new Error("slug mismatch for candidate");continue}}catch{f=null,y=null,g=new Error("slug mismatch for candidate");continue}}catch{}try{if(!d&&/\.html$/i.test(b)){const w=b.replace(/\.html$/i,".md");if(h.includes(w))try{const S=String(f&&f.raw||"").trim().slice(0,128).toLowerCase();if(f&&f.isHtml||/^(?:<!doctype|<html|<title|<h1)/i.test(S)||S.indexOf('<div id="app"')!==-1||S.indexOf("nimbi-")!==-1||S.indexOf("nimbi")!==-1||S.indexOf("initcms(")!==-1){let E=!1;try{const B=await Ce(w,t);if(B&&B.raw)f=B,y=w,E=!0;else if(typeof oe=="string"&&oe)try{const H=await Ce(oe,t);H&&H.raw&&(f=H,y=oe,E=!0)}catch{}}catch{try{const H=await Ce(oe,t);H&&H.raw&&(f=H,y=oe,E=!0)}catch{}}if(!E){f=null,y=null,g=new Error("site shell detected (candidate HTML rejected)");continue}}}catch{}}}catch{}try{if(ut())try{Tt("[router-debug] fetchPageData accepted candidate",{candidate:b,pagePath:y,isHtml:f&&f.isHtml,snippet:f&&f.raw?String(f.raw).slice(0,160):null})}catch{}}catch{}break}catch(b){g=b;try{ut()&&_("[router] candidate fetch failed",{candidate:m,contentBase:t,err:b&&b.message||b})}catch{}}if(!f){const m=g&&(g.message||String(g))||null,b=m&&/failed to fetch md|site shell detected/i.test(m);try{if(ut())try{Tt("[router-debug] fetchPageData no data",{originalRaw:n,resolved:r,pageCandidates:h,fetchError:m})}catch{}}catch{}if(b)try{if(ut())try{_("[router] fetchPageData: no page data (expected)",{originalRaw:n,resolved:r,pageCandidates:h,contentBase:t,fetchError:m})}catch{}}catch{}else try{if(ut())try{Nn("[router] fetchPageData: no page data for",{originalRaw:n,resolved:r,pageCandidates:h,contentBase:t,fetchError:m})}catch{}}catch{}if(typeof oe=="string"&&oe)try{const w=await Ce(oe,t);if(w&&w.raw){try{Qn(w.meta||{},oe)}catch{}return{data:w,pagePath:oe,anchor:a}}}catch{}try{if(d&&String(n||"").toLowerCase().includes(".html"))try{const w=new URL(String(n||""),location.href).toString();ut()&&_("[router] attempting absolute HTML fetch fallback",w);const k=await fetch(w);if(k&&k.ok){const S=await k.text(),v=k&&k.headers&&typeof k.headers.get=="function"&&k.headers.get("content-type")||"",E=(S||"").toLowerCase(),B=v&&v.indexOf&&v.indexOf("text/html")!==-1||E.indexOf("<!doctype")!==-1||E.indexOf("<html")!==-1;if(!B&&ut())try{_("[router] absolute fetch returned non-HTML",()=>({abs:w,contentType:v,snippet:E.slice(0,200)}))}catch{}if(B){const H=(S||"").toLowerCase();if(/<title>\s*index of\b/i.test(S)||/<h1>\s*index of\b/i.test(S)||H.indexOf("parent directory")!==-1||/<title>\s*directory listing/i.test(S)||/<h1>\s*directory listing/i.test(S))try{ut()&&_("[router] absolute fetch returned directory listing; treating as not found",{abs:w})}catch{}else try{const $=w,j=new URL(".",$).toString();try{const ie=He();if(ie){const F=ie.parseFromString(S||"","text/html"),L=(te,ce)=>{try{const _e=ce.getAttribute(te)||"";if(!_e||/^(https?:)?\/\//i.test(_e)||_e.startsWith("/")||_e.startsWith("#"))return;try{const Ee=new URL(_e,$).toString();ce.setAttribute(te,Ee)}catch(Ee){_("[router] rewrite attribute failed",te,Ee)}}catch(_e){_("[router] rewrite helper failed",_e)}},D=F.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"),U=[];for(const te of Array.from(D||[]))try{const ce=te.tagName?te.tagName.toLowerCase():"";if(ce==="a")continue;if(te.hasAttribute("src")){const _e=te.getAttribute("src");L("src",te);const Ee=te.getAttribute("src");_e!==Ee&&U.push({attr:"src",tag:ce,before:_e,after:Ee})}if(te.hasAttribute("href")&&ce==="link"){const _e=te.getAttribute("href");L("href",te);const Ee=te.getAttribute("href");_e!==Ee&&U.push({attr:"href",tag:ce,before:_e,after:Ee})}if(te.hasAttribute("href")&&ce!=="link"){const _e=te.getAttribute("href");L("href",te);const Ee=te.getAttribute("href");_e!==Ee&&U.push({attr:"href",tag:ce,before:_e,after:Ee})}if(te.hasAttribute("xlink:href")){const _e=te.getAttribute("xlink:href");L("xlink:href",te);const Ee=te.getAttribute("xlink:href");_e!==Ee&&U.push({attr:"xlink:href",tag:ce,before:_e,after:Ee})}if(te.hasAttribute("poster")){const _e=te.getAttribute("poster");L("poster",te);const Ee=te.getAttribute("poster");_e!==Ee&&U.push({attr:"poster",tag:ce,before:_e,after:Ee})}if(te.hasAttribute("srcset")){const Fe=(te.getAttribute("srcset")||"").split(",").map(xe=>xe.trim()).filter(Boolean).map(xe=>{const[Ue,R]=xe.split(/\s+/,2);if(!Ue||/^(https?:)?\/\//i.test(Ue)||Ue.startsWith("/"))return xe;try{const z=new URL(Ue,$).toString();return R?`${z} ${R}`:z}catch{return xe}}).join(", ");te.setAttribute("srcset",Fe)}}catch{}const le=F.documentElement&&F.documentElement.outerHTML?F.documentElement.outerHTML:S;try{ut()&&U&&U.length&&_("[router] rewritten asset refs",{abs:w,rewritten:U})}catch{}return{data:{raw:le,isHtml:!0},pagePath:String(n||""),anchor:a}}}catch{}let G=S;return/<base\s+[^>]*>/i.test(S)||(/<head[^>]*>/i.test(S)?G=S.replace(/(<head[^>]*>)/i,`$1<base href="${j}">`):G=`<base href="${j}">`+S),{data:{raw:G,isHtml:!0},pagePath:String(n||""),anchor:a}}catch{return{data:{raw:S,isHtml:!0},pagePath:String(n||""),anchor:a}}}}}catch(w){ut()&&_("[router] absolute HTML fetch fallback failed",w)}}catch{}try{const w=decodeURIComponent(String(r||""));if(w&&!/\.(md|html?)$/i.test(w)&&typeof oe=="string"&&oe&&ut()){const S=[`/assets/${w}.html`,`/assets/${w}/index.html`];for(const v of S)try{const E=await fetch(v,{method:"GET"});if(E&&E.ok)return{data:{raw:await E.text(),isHtml:!0},pagePath:v.replace(/^\//,""),anchor:a}}catch{}}}catch(w){ut()&&_("[router] assets fallback failed",w)}throw new Error("no page data")}return{data:f,pagePath:y,anchor:a}}function Kn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Ot=Kn();function Ki(e){Ot=e}var Qt={exec:()=>null};function Re(e,t=""){let n=typeof e=="string"?e:e.source,i={replace:(r,a)=>{let s=typeof a=="string"?a:a.source;return s=s.replace(lt.caret,"$1"),n=n.replace(r,s),i},getRegex:()=>new RegExp(n,t)};return i}var no=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),lt={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}>`)},ro=/^(?:[ \t]*(?:\n|$))+/,io=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,ao=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,_n=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,so=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Nr=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Yi=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Vi=Re(Yi).replace(/bull/g,Nr).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),oo=Re(Yi).replace(/bull/g,Nr).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Br=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,lo=/^[^\n]+/,Or=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,co=Re(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Or).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),uo=Re(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,Nr).getRegex(),Yn="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",jr=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,ho=Re("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",jr).replace("tag",Yn).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Ji=Re(Br).replace("hr",_n).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Yn).getRegex(),fo=Re(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Ji).getRegex(),qr={blockquote:fo,code:io,def:co,fences:ao,heading:so,hr:_n,html:ho,lheading:Vi,list:uo,newline:ro,paragraph:Ji,table:Qt,text:lo},ea=Re("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",_n).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Yn).getRegex(),po={...qr,lheading:oo,table:ea,paragraph:Re(Br).replace("hr",_n).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",ea).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Yn).getRegex()},go={...qr,html:Re(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",jr).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Qt,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:Re(Br).replace("hr",_n).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Vi).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},mo=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,yo=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,ta=/^( {2,}|\\)\n(?!\s*$)/,bo=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Vn=/[\p{P}\p{S}]/u,Hr=/[\s\p{P}\p{S}]/u,na=/[^\s\p{P}\p{S}]/u,wo=Re(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Hr).getRegex(),ra=/(?!~)[\p{P}\p{S}]/u,_o=/(?!~)[\s\p{P}\p{S}]/u,ko=/(?:[^\s\p{P}\p{S}]|~)/u,ia=/(?![*_])[\p{P}\p{S}]/u,xo=/(?![*_])[\s\p{P}\p{S}]/u,So=/(?:[^\s\p{P}\p{S}]|[*_])/u,vo=Re(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",no?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),aa=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Ao=Re(aa,"u").replace(/punct/g,Vn).getRegex(),Eo=Re(aa,"u").replace(/punct/g,ra).getRegex(),sa="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Co=Re(sa,"gu").replace(/notPunctSpace/g,na).replace(/punctSpace/g,Hr).replace(/punct/g,Vn).getRegex(),Mo=Re(sa,"gu").replace(/notPunctSpace/g,ko).replace(/punctSpace/g,_o).replace(/punct/g,ra).getRegex(),Lo=Re("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,na).replace(/punctSpace/g,Hr).replace(/punct/g,Vn).getRegex(),To=Re(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,ia).getRegex(),Ro="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",zo=Re(Ro,"gu").replace(/notPunctSpace/g,So).replace(/punctSpace/g,xo).replace(/punct/g,ia).getRegex(),Po=Re(/\\(punct)/,"gu").replace(/punct/g,Vn).getRegex(),$o=Re(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Io=Re(jr).replace("(?:-->|$)","-->").getRegex(),No=Re("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Io).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Jn=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Bo=Re(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",Jn).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),oa=Re(/^!?\[(label)\]\[(ref)\]/).replace("label",Jn).replace("ref",Or).getRegex(),la=Re(/^!?\[(ref)\](?:\[\])?/).replace("ref",Or).getRegex(),Oo=Re("reflink|nolink(?!\\()","g").replace("reflink",oa).replace("nolink",la).getRegex(),ca=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Fr={_backpedal:Qt,anyPunctuation:Po,autolink:$o,blockSkip:vo,br:ta,code:yo,del:Qt,delLDelim:Qt,delRDelim:Qt,emStrongLDelim:Ao,emStrongRDelimAst:Co,emStrongRDelimUnd:Lo,escape:mo,link:Bo,nolink:la,punctuation:wo,reflink:oa,reflinkSearch:Oo,tag:No,text:bo,url:Qt},jo={...Fr,link:Re(/^!?\[(label)\]\((.*?)\)/).replace("label",Jn).getRegex(),reflink:Re(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Jn).getRegex()},Dr={...Fr,emStrongRDelimAst:Mo,emStrongLDelim:Eo,delLDelim:To,delRDelim:zo,url:Re(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",ca).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:Re(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",ca).getRegex()},qo={...Dr,br:Re(ta).replace("{2,}","*").getRegex(),text:Re(Dr.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},er={normal:qr,gfm:po,pedantic:go},kn={normal:Fr,gfm:Dr,breaks:qo,pedantic:jo},Ho={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},ua=e=>Ho[e];function wt(e,t){if(t){if(lt.escapeTest.test(e))return e.replace(lt.escapeReplace,ua)}else if(lt.escapeTestNoEncode.test(e))return e.replace(lt.escapeReplaceNoEncode,ua);return e}function ha(e){try{e=encodeURI(e).replace(lt.percentDecode,"%")}catch{return null}return e}function da(e,t){let n=e.replace(lt.findPipe,(a,s,l)=>{let o=!1,c=s;for(;--c>=0&&l[c]==="\\";)o=!o;return o?"|":" |"}),i=n.split(lt.splitPipe),r=0;if(i[0].trim()||i.shift(),i.length>0&&!i.at(-1)?.trim()&&i.pop(),t)if(i.length>t)i.splice(t);else for(;i.length<t;)i.push("");for(;r<i.length;r++)i[r]=i[r].trim().replace(lt.slashPipe,"|");return i}function xn(e,t,n){let i=e.length;if(i===0)return"";let r=0;for(;r<i&&e.charAt(i-r-1)===t;)r++;return e.slice(0,i-r)}function Fo(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let i=0;i<e.length;i++)if(e[i]==="\\")i++;else if(e[i]===t[0])n++;else if(e[i]===t[1]&&(n--,n<0))return i;return n>0?-2:-1}function Do(e,t=0){let n=t,i="";for(let r of e)if(r==="	"){let a=4-n%4;i+=" ".repeat(a),n+=a}else i+=r,n++;return i}function fa(e,t,n,i,r){let a=t.href,s=t.title||null,l=e[1].replace(r.other.outputLinkReplace,"$1");i.state.inLink=!0;let o={type:e[0].charAt(0)==="!"?"image":"link",raw:n,href:a,title:s,text:l,tokens:i.inlineTokens(l)};return i.state.inLink=!1,o}function Uo(e,t,n){let i=e.match(n.other.indentCodeCompensation);if(i===null)return t;let r=i[1];return t.split(`
`).map(a=>{let s=a.match(n.other.beginningSpace);if(s===null)return a;let[l]=s;return l.length>=r.length?a.slice(r.length):a}).join(`
`)}var Sn=class{options;rules;lexer;constructor(e){this.options=e||Ot}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:xn(n,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],i=Uo(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:i}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let i=xn(n,"#");(this.options.pedantic||!i||this.rules.other.endingSpaceChar.test(i))&&(n=i.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:xn(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=xn(t[0],`
`).split(`
`),i="",r="",a=[];for(;n.length>0;){let s=!1,l=[],o;for(o=0;o<n.length;o++)if(this.rules.other.blockquoteStart.test(n[o]))l.push(n[o]),s=!0;else if(!s)l.push(n[o]);else break;n=n.slice(o);let c=l.join(`
`),u=c.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");i=i?`${i}
${c}`:c,r=r?`${r}
${u}`:u;let h=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(u,a,!0),this.lexer.state.top=h,n.length===0)break;let d=a.at(-1);if(d?.type==="code")break;if(d?.type==="blockquote"){let p=d,f=p.raw+`
`+n.join(`
`),y=this.blockquote(f);a[a.length-1]=y,i=i.substring(0,i.length-p.raw.length)+y.raw,r=r.substring(0,r.length-p.text.length)+y.text;break}else if(d?.type==="list"){let p=d,f=p.raw+`
`+n.join(`
`),y=this.list(f);a[a.length-1]=y,i=i.substring(0,i.length-d.raw.length)+y.raw,r=r.substring(0,r.length-p.raw.length)+y.raw,n=f.substring(a.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:i,tokens:a,text:r}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),i=n.length>1,r={type:"list",raw:"",ordered:i,start:i?+n.slice(0,-1):"",loose:!1,items:[]};n=i?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=i?n:"[*+-]");let a=this.rules.other.listItemRegex(n),s=!1;for(;e;){let o=!1,c="",u="";if(!(t=a.exec(e))||this.rules.block.hr.test(e))break;c=t[0],e=e.substring(c.length);let h=Do(t[2].split(`
`,1)[0],t[1].length),d=e.split(`
`,1)[0],p=!h.trim(),f=0;if(this.options.pedantic?(f=2,u=h.trimStart()):p?f=t[1].length+1:(f=h.search(this.rules.other.nonSpaceChar),f=f>4?1:f,u=h.slice(f),f+=t[1].length),p&&this.rules.other.blankLine.test(d)&&(c+=d+`
`,e=e.substring(d.length+1),o=!0),!o){let y=this.rules.other.nextBulletRegex(f),g=this.rules.other.hrRegex(f),m=this.rules.other.fencesBeginRegex(f),b=this.rules.other.headingBeginRegex(f),w=this.rules.other.htmlBeginRegex(f),k=this.rules.other.blockquoteBeginRegex(f);for(;e;){let S=e.split(`
`,1)[0],v;if(d=S,this.options.pedantic?(d=d.replace(this.rules.other.listReplaceNesting,"  "),v=d):v=d.replace(this.rules.other.tabCharGlobal,"    "),m.test(d)||b.test(d)||w.test(d)||k.test(d)||y.test(d)||g.test(d))break;if(v.search(this.rules.other.nonSpaceChar)>=f||!d.trim())u+=`
`+v.slice(f);else{if(p||h.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||m.test(h)||b.test(h)||g.test(h))break;u+=`
`+d}p=!d.trim(),c+=S+`
`,e=e.substring(S.length+1),h=v.slice(f)}}r.loose||(s?r.loose=!0:this.rules.other.doubleBlankLine.test(c)&&(s=!0)),r.items.push({type:"list_item",raw:c,task:!!this.options.gfm&&this.rules.other.listIsTask.test(u),loose:!1,text:u,tokens:[]}),r.raw+=c}let l=r.items.at(-1);if(l)l.raw=l.raw.trimEnd(),l.text=l.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let o of r.items){if(this.lexer.state.top=!1,o.tokens=this.lexer.blockTokens(o.text,[]),o.task){if(o.text=o.text.replace(this.rules.other.listReplaceTask,""),o.tokens[0]?.type==="text"||o.tokens[0]?.type==="paragraph"){o.tokens[0].raw=o.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),o.tokens[0].text=o.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let u=this.lexer.inlineQueue.length-1;u>=0;u--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[u].src)){this.lexer.inlineQueue[u].src=this.lexer.inlineQueue[u].src.replace(this.rules.other.listReplaceTask,"");break}}let c=this.rules.other.listTaskCheckbox.exec(o.raw);if(c){let u={type:"checkbox",raw:c[0]+" ",checked:c[0]!=="[ ]"};o.checked=u.checked,r.loose?o.tokens[0]&&["paragraph","text"].includes(o.tokens[0].type)&&"tokens"in o.tokens[0]&&o.tokens[0].tokens?(o.tokens[0].raw=u.raw+o.tokens[0].raw,o.tokens[0].text=u.raw+o.tokens[0].text,o.tokens[0].tokens.unshift(u)):o.tokens.unshift({type:"paragraph",raw:u.raw,text:u.raw,tokens:[u]}):o.tokens.unshift(u)}}if(!r.loose){let c=o.tokens.filter(h=>h.type==="space"),u=c.length>0&&c.some(h=>this.rules.other.anyLine.test(h.raw));r.loose=u}}if(r.loose)for(let o of r.items){o.loose=!0;for(let c of o.tokens)c.type==="text"&&(c.type="paragraph")}return r}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),i=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:i,title:r}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=da(t[1]),i=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],a={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===i.length){for(let s of i)this.rules.other.tableAlignRight.test(s)?a.align.push("right"):this.rules.other.tableAlignCenter.test(s)?a.align.push("center"):this.rules.other.tableAlignLeft.test(s)?a.align.push("left"):a.align.push(null);for(let s=0;s<n.length;s++)a.header.push({text:n[s],tokens:this.lexer.inline(n[s]),header:!0,align:a.align[s]});for(let s of r)a.rows.push(da(s,a.header.length).map((l,o)=>({text:l,tokens:this.lexer.inline(l),header:!1,align:a.align[o]})));return a}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let a=xn(n.slice(0,-1),"\\");if((n.length-a.length)%2===0)return}else{let a=Fo(t[2],"()");if(a===-2)return;if(a>-1){let s=(t[0].indexOf("!")===0?5:4)+t[1].length+a;t[2]=t[2].substring(0,a),t[0]=t[0].substring(0,s).trim(),t[3]=""}}let i=t[2],r="";if(this.options.pedantic){let a=this.rules.other.pedanticHrefTitle.exec(i);a&&(i=a[1],r=a[3])}else r=t[3]?t[3].slice(1,-1):"";return i=i.trim(),this.rules.other.startAngleBracket.test(i)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?i=i.slice(1):i=i.slice(1,-1)),fa(t,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let i=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=t[i.toLowerCase()];if(!r){let a=n[0].charAt(0);return{type:"text",raw:a,text:a}}return fa(n,r,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let i=this.rules.inline.emStrongLDelim.exec(e);if(!(!i||i[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(i[1]||i[2])||!n||this.rules.inline.punctuation.exec(n))){let r=[...i[0]].length-1,a,s,l=r,o=0,c=i[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(c.lastIndex=0,t=t.slice(-1*e.length+r);(i=c.exec(t))!=null;){if(a=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!a)continue;if(s=[...a].length,i[3]||i[4]){l+=s;continue}else if((i[5]||i[6])&&r%3&&!((r+s)%3)){o+=s;continue}if(l-=s,l>0)continue;s=Math.min(s,s+l+o);let u=[...i[0]][0].length,h=e.slice(0,r+i.index+u+s);if(Math.min(r,s)%2){let p=h.slice(1,-1);return{type:"em",raw:h,text:p,tokens:this.lexer.inlineTokens(p)}}let d=h.slice(2,-2);return{type:"strong",raw:h,text:d,tokens:this.lexer.inlineTokens(d)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),i=this.rules.other.nonSpaceChar.test(n),r=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return i&&r&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,n=""){let i=this.rules.inline.delLDelim.exec(e);if(i&&(!i[1]||!n||this.rules.inline.punctuation.exec(n))){let r=[...i[0]].length-1,a,s,l=r,o=this.rules.inline.delRDelim;for(o.lastIndex=0,t=t.slice(-1*e.length+r);(i=o.exec(t))!=null;){if(a=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!a||(s=[...a].length,s!==r))continue;if(i[3]||i[4]){l+=s;continue}if(l-=s,l>0)continue;s=Math.min(s,s+l);let c=[...i[0]][0].length,u=e.slice(0,r+i.index+c+s),h=u.slice(r,-r);return{type:"del",raw:u,text:h,tokens:this.lexer.inlineTokens(h)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,i;return t[2]==="@"?(n=t[1],i="mailto:"+n):(n=t[1],i=n),{type:"link",raw:t[0],text:n,href:i,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,i;if(t[2]==="@")n=t[0],i="mailto:"+n;else{let r;do r=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(r!==t[0]);n=t[0],t[1]==="www."?i="http://"+t[0]:i=t[0]}return{type:"link",raw:t[0],text:n,href:i,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}},gt=class fi{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||Ot,this.options.tokenizer=this.options.tokenizer||new Sn,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:lt,block:er.normal,inline:kn.normal};this.options.pedantic?(n.block=er.pedantic,n.inline=kn.pedantic):this.options.gfm&&(n.block=er.gfm,this.options.breaks?n.inline=kn.breaks:n.inline=kn.gfm),this.tokenizer.rules=n}static get rules(){return{block:er,inline:kn}}static lex(t,n){return new fi(n).lex(t)}static lexInline(t,n){return new fi(n).inlineTokens(t)}lex(t){t=t.replace(lt.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let i=this.inlineQueue[n];this.inlineTokens(i.src,i.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],i=!1){for(this.options.pedantic&&(t=t.replace(lt.tabCharGlobal,"    ").replace(lt.spaceLine,""));t;){let r;if(this.options.extensions?.block?.some(s=>(r=s.call({lexer:this},t,n))?(t=t.substring(r.raw.length),n.push(r),!0):!1))continue;if(r=this.tokenizer.space(t)){t=t.substring(r.raw.length);let s=n.at(-1);r.raw.length===1&&s!==void 0?s.raw+=`
`:n.push(r);continue}if(r=this.tokenizer.code(t)){t=t.substring(r.raw.length);let s=n.at(-1);s?.type==="paragraph"||s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+r.raw,s.text+=`
`+r.text,this.inlineQueue.at(-1).src=s.text):n.push(r);continue}if(r=this.tokenizer.fences(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.heading(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.hr(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.blockquote(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.list(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.html(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.def(t)){t=t.substring(r.raw.length);let s=n.at(-1);s?.type==="paragraph"||s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+r.raw,s.text+=`
`+r.raw,this.inlineQueue.at(-1).src=s.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title},n.push(r));continue}if(r=this.tokenizer.table(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.lheading(t)){t=t.substring(r.raw.length),n.push(r);continue}let a=t;if(this.options.extensions?.startBlock){let s=1/0,l=t.slice(1),o;this.options.extensions.startBlock.forEach(c=>{o=c.call({lexer:this},l),typeof o=="number"&&o>=0&&(s=Math.min(s,o))}),s<1/0&&s>=0&&(a=t.substring(0,s+1))}if(this.state.top&&(r=this.tokenizer.paragraph(a))){let s=n.at(-1);i&&s?.type==="paragraph"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+r.raw,s.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):n.push(r),i=a.length!==t.length,t=t.substring(r.raw.length);continue}if(r=this.tokenizer.text(t)){t=t.substring(r.raw.length);let s=n.at(-1);s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+r.raw,s.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):n.push(r);continue}if(t){let s="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(s);break}else throw new Error(s)}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}inlineTokens(t,n=[]){let i=t,r=null;if(this.tokens.links){let o=Object.keys(this.tokens.links);if(o.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(i))!=null;)o.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(i=i.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(i))!=null;)i=i.slice(0,r.index)+"++"+i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let a;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(i))!=null;)a=r[2]?r[2].length:0,i=i.slice(0,r.index+a)+"["+"a".repeat(r[0].length-a-2)+"]"+i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);i=this.options.hooks?.emStrongMask?.call({lexer:this},i)??i;let s=!1,l="";for(;t;){s||(l=""),s=!1;let o;if(this.options.extensions?.inline?.some(u=>(o=u.call({lexer:this},t,n))?(t=t.substring(o.raw.length),n.push(o),!0):!1))continue;if(o=this.tokenizer.escape(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.tag(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.link(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(o.raw.length);let u=n.at(-1);o.type==="text"&&u?.type==="text"?(u.raw+=o.raw,u.text+=o.text):n.push(o);continue}if(o=this.tokenizer.emStrong(t,i,l)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.codespan(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.br(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.del(t,i,l)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.autolink(t)){t=t.substring(o.raw.length),n.push(o);continue}if(!this.state.inLink&&(o=this.tokenizer.url(t))){t=t.substring(o.raw.length),n.push(o);continue}let c=t;if(this.options.extensions?.startInline){let u=1/0,h=t.slice(1),d;this.options.extensions.startInline.forEach(p=>{d=p.call({lexer:this},h),typeof d=="number"&&d>=0&&(u=Math.min(u,d))}),u<1/0&&u>=0&&(c=t.substring(0,u+1))}if(o=this.tokenizer.inlineText(c)){t=t.substring(o.raw.length),o.raw.slice(-1)!=="_"&&(l=o.raw.slice(-1)),s=!0;let u=n.at(-1);u?.type==="text"?(u.raw+=o.raw,u.text+=o.text):n.push(o);continue}if(t){let u="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(u);break}else throw new Error(u)}}return n}},vn=class{options;parser;constructor(e){this.options=e||Ot}space(e){return""}code({text:e,lang:t,escaped:n}){let i=(t||"").match(lt.notSpaceStart)?.[0],r=e.replace(lt.endingNewline,"")+`
`;return i?'<pre><code class="language-'+wt(i)+'">'+(n?r:wt(r,!0))+`</code></pre>
`:"<pre><code>"+(n?r:wt(r,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return""}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,i="";for(let s=0;s<e.items.length;s++){let l=e.items[s];i+=this.listitem(l)}let r=t?"ol":"ul",a=t&&n!==1?' start="'+n+'"':"";return"<"+r+a+`>
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
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${wt(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let i=this.parser.parseInline(n),r=ha(e);if(r===null)return i;e=r;let a='<a href="'+e+'"';return t&&(a+=' title="'+wt(t)+'"'),a+=">"+i+"</a>",a}image({href:e,title:t,text:n,tokens:i}){i&&(n=this.parser.parseInline(i,this.parser.textRenderer));let r=ha(e);if(r===null)return wt(n);e=r;let a=`<img src="${e}" alt="${wt(n)}"`;return t&&(a+=` title="${wt(t)}"`),a+=">",a}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:wt(e.text)}},tr=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},mt=class pi{options;renderer;textRenderer;constructor(t){this.options=t||Ot,this.options.renderer=this.options.renderer||new vn,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new tr}static parse(t,n){return new pi(n).parse(t)}static parseInline(t,n){return new pi(n).parseInline(t)}parse(t){let n="";for(let i=0;i<t.length;i++){let r=t[i];if(this.options.extensions?.renderers?.[r.type]){let s=r,l=this.options.extensions.renderers[s.type].call({parser:this},s);if(l!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(s.type)){n+=l||"";continue}}let a=r;switch(a.type){case"space":{n+=this.renderer.space(a);break}case"hr":{n+=this.renderer.hr(a);break}case"heading":{n+=this.renderer.heading(a);break}case"code":{n+=this.renderer.code(a);break}case"table":{n+=this.renderer.table(a);break}case"blockquote":{n+=this.renderer.blockquote(a);break}case"list":{n+=this.renderer.list(a);break}case"checkbox":{n+=this.renderer.checkbox(a);break}case"html":{n+=this.renderer.html(a);break}case"def":{n+=this.renderer.def(a);break}case"paragraph":{n+=this.renderer.paragraph(a);break}case"text":{n+=this.renderer.text(a);break}default:{let s='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(s),"";throw new Error(s)}}}return n}parseInline(t,n=this.renderer){let i="";for(let r=0;r<t.length;r++){let a=t[r];if(this.options.extensions?.renderers?.[a.type]){let l=this.options.extensions.renderers[a.type].call({parser:this},a);if(l!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(a.type)){i+=l||"";continue}}let s=a;switch(s.type){case"escape":{i+=n.text(s);break}case"html":{i+=n.html(s);break}case"link":{i+=n.link(s);break}case"image":{i+=n.image(s);break}case"checkbox":{i+=n.checkbox(s);break}case"strong":{i+=n.strong(s);break}case"em":{i+=n.em(s);break}case"codespan":{i+=n.codespan(s);break}case"br":{i+=n.br(s);break}case"del":{i+=n.del(s);break}case"text":{i+=n.text(s);break}default:{let l='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return i}},sn=class{options;block;constructor(e){this.options=e||Ot}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(){return this.block?gt.lex:gt.lexInline}provideParser(){return this.block?mt.parse:mt.parseInline}},pa=class{defaults=Kn();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=mt;Renderer=vn;TextRenderer=tr;Lexer=gt;Tokenizer=Sn;Hooks=sn;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let i of e)switch(n=n.concat(t.call(this,i)),i.type){case"table":{let r=i;for(let a of r.header)n=n.concat(this.walkTokens(a.tokens,t));for(let a of r.rows)for(let s of a)n=n.concat(this.walkTokens(s.tokens,t));break}case"list":{let r=i;n=n.concat(this.walkTokens(r.items,t));break}default:{let r=i;this.defaults.extensions?.childTokens?.[r.type]?this.defaults.extensions.childTokens[r.type].forEach(a=>{let s=r[a].flat(1/0);n=n.concat(this.walkTokens(s,t))}):r.tokens&&(n=n.concat(this.walkTokens(r.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let i={...n};if(i.async=this.defaults.async||i.async||!1,n.extensions&&(n.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){let a=t.renderers[r.name];a?t.renderers[r.name]=function(...s){let l=r.renderer.apply(this,s);return l===!1&&(l=a.apply(this,s)),l}:t.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let a=t[r.level];a?a.unshift(r.tokenizer):t[r.level]=[r.tokenizer],r.start&&(r.level==="block"?t.startBlock?t.startBlock.push(r.start):t.startBlock=[r.start]:r.level==="inline"&&(t.startInline?t.startInline.push(r.start):t.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(t.childTokens[r.name]=r.childTokens)}),i.extensions=t),n.renderer){let r=this.defaults.renderer||new vn(this.defaults);for(let a in n.renderer){if(!(a in r))throw new Error(`renderer '${a}' does not exist`);if(["options","parser"].includes(a))continue;let s=a,l=n.renderer[s],o=r[s];r[s]=(...c)=>{let u=l.apply(r,c);return u===!1&&(u=o.apply(r,c)),u||""}}i.renderer=r}if(n.tokenizer){let r=this.defaults.tokenizer||new Sn(this.defaults);for(let a in n.tokenizer){if(!(a in r))throw new Error(`tokenizer '${a}' does not exist`);if(["options","rules","lexer"].includes(a))continue;let s=a,l=n.tokenizer[s],o=r[s];r[s]=(...c)=>{let u=l.apply(r,c);return u===!1&&(u=o.apply(r,c)),u}}i.tokenizer=r}if(n.hooks){let r=this.defaults.hooks||new sn;for(let a in n.hooks){if(!(a in r))throw new Error(`hook '${a}' does not exist`);if(["options","block"].includes(a))continue;let s=a,l=n.hooks[s],o=r[s];sn.passThroughHooks.has(a)?r[s]=c=>{if(this.defaults.async&&sn.passThroughHooksRespectAsync.has(a))return(async()=>{let h=await l.call(r,c);return o.call(r,h)})();let u=l.call(r,c);return o.call(r,u)}:r[s]=(...c)=>{if(this.defaults.async)return(async()=>{let h=await l.apply(r,c);return h===!1&&(h=await o.apply(r,c)),h})();let u=l.apply(r,c);return u===!1&&(u=o.apply(r,c)),u}}i.hooks=r}if(n.walkTokens){let r=this.defaults.walkTokens,a=n.walkTokens;i.walkTokens=function(s){let l=[];return l.push(a.call(this,s)),r&&(l=l.concat(r.call(this,s))),l}}this.defaults={...this.defaults,...i}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return gt.lex(e,t??this.defaults)}parser(e,t){return mt.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let i={...n},r={...this.defaults,...i},a=this.onError(!!r.silent,!!r.async);if(this.defaults.async===!0&&i.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(r.hooks&&(r.hooks.options=r,r.hooks.block=e),r.async)return(async()=>{let s=r.hooks?await r.hooks.preprocess(t):t,l=await(r.hooks?await r.hooks.provideLexer():e?gt.lex:gt.lexInline)(s,r),o=r.hooks?await r.hooks.processAllTokens(l):l;r.walkTokens&&await Promise.all(this.walkTokens(o,r.walkTokens));let c=await(r.hooks?await r.hooks.provideParser():e?mt.parse:mt.parseInline)(o,r);return r.hooks?await r.hooks.postprocess(c):c})().catch(a);try{r.hooks&&(t=r.hooks.preprocess(t));let s=(r.hooks?r.hooks.provideLexer():e?gt.lex:gt.lexInline)(t,r);r.hooks&&(s=r.hooks.processAllTokens(s)),r.walkTokens&&this.walkTokens(s,r.walkTokens);let l=(r.hooks?r.hooks.provideParser():e?mt.parse:mt.parseInline)(s,r);return r.hooks&&(l=r.hooks.postprocess(l)),l}catch(s){return a(s)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let i="<p>An error occurred:</p><pre>"+wt(n.message+"",!0)+"</pre>";return t?Promise.resolve(i):i}if(t)return Promise.reject(n);throw n}}},Kt=new pa;function Ae(e,t){return Kt.parse(e,t)}Ae.options=Ae.setOptions=function(e){return Kt.setOptions(e),Ae.defaults=Kt.defaults,Ki(Ae.defaults),Ae},Ae.getDefaults=Kn,Ae.defaults=Ot,Ae.use=function(...e){return Kt.use(...e),Ae.defaults=Kt.defaults,Ki(Ae.defaults),Ae},Ae.walkTokens=function(e,t){return Kt.walkTokens(e,t)},Ae.parseInline=Kt.parseInline,Ae.Parser=mt,Ae.parser=mt.parse,Ae.Renderer=vn,Ae.TextRenderer=tr,Ae.Lexer=gt,Ae.lexer=gt.lex,Ae.Tokenizer=Sn,Ae.Hooks=sn,Ae.parse=Ae;var Wo=Ae.options,Zo=Ae.setOptions,Go=Ae.use,Xo=Ae.walkTokens,Qo=Ae.parseInline,Ko=Ae,Yo=mt.parse,Vo=gt.lex;const ga=Object.freeze(Object.defineProperty({__proto__:null,Hooks:sn,Lexer:gt,Marked:pa,Parser:mt,Renderer:vn,TextRenderer:tr,Tokenizer:Sn,get defaults(){return Ot},getDefaults:Kn,lexer:Vo,marked:Ae,options:Wo,parse:Ko,parseInline:Qo,parser:Yo,setOptions:Zo,use:Go,walkTokens:Xo},Symbol.toStringTag,{value:"Module"})),Jo=`/**
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
`,ma=`function H() {
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
`,ya=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",ma],{type:"text/javascript;charset=utf-8"});function el(e){let t;try{if(t=ya&&(self.URL||self.webkitURL).createObjectURL(ya),!t)throw"";const n=new Worker(t,{type:"module",name:e?.name});return n.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(t)}),n}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(ma),{type:"module",name:e?.name})}}function nr(e){if(e.startsWith("---")){const t=e.indexOf(`
---`,3);if(t!==-1){const n=e.slice(3,t+0).trim(),i=e.slice(t+4).trimStart(),r={};return n.split(/\r?\n/).forEach(a=>{const s=a.match(/^([^:]+):\s*(.*)$/);s&&(r[s[1].trim()]=s[2].trim())}),{content:i,data:r}}}return{content:e,data:{}}}function ba(e){try{if(!e&&e!==0)return"";const t=String(e),n={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:" "};return t.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g,(i,r)=>{if(!r)return i;if(r[0]==="#")try{return r[1]==="x"||r[1]==="X"?String.fromCharCode(parseInt(r.slice(2),16)):String.fromCharCode(parseInt(r.slice(1),10))}catch{return i}return n[r]!==void 0?n[r]:i})}catch{return String(e||"")}}const An=ga&&(Ae||ga)||void 0,rr=/```\s*([a-zA-Z0-9_\-+]+)?/g,wa=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);function _a(e){try{return String(e||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}}let Ke=null;const tl="https://cdn.jsdelivr.net/npm/highlight.js";async function Ur(e){return await ts(e)}async function ir(){if(Ke)return Ke;try{const e=tl+"/lib/core.js";try{const t=await import("https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js");if(t){Ke=t.default||t;try{await br(e,async()=>t)}catch{}}else Ke=null}catch{const n=await Ur(e);n?Ke=n.default||n:Ke=null}}catch{Ke=null}return Ke}An&&typeof An.setOptions=="function"&&An.setOptions({gfm:!0,headerIds:!0,mangle:!1,highlighted:(e,t)=>{try{return Ke&&t&&typeof Ke.getLanguage=="function"&&Ke.getLanguage(t)?Ke.highlight(e,{language:t}).value:Ke&&typeof Ke.getLanguage=="function"&&Ke.getLanguage("plaintext")?Ke.highlight(e,{language:"plaintext"}).value:e}catch{return e}}}),onmessage=async e=>{const t=e.data||{};try{if(t.type==="register"){const{name:u,url:h}=t;try{if(!await ir()){postMessage({type:"register-error",name:u,error:"hljs unavailable"});return}const p=await Ur(h),f=p?p.default||p:null;if(!f)throw new Error("failed to import language module");Ke.registerLanguage(u,f),postMessage({type:"registered",name:u})}catch(d){postMessage({type:"register-error",name:u,error:String(d)})}return}if(t.type==="detect"){const u=t.md||"",h=t.supported||[],d=new Set,p=new RegExp(rr.source,rr.flags);let f;for(;f=p.exec(u);)if(f[1]){const y=String(f[1]).toLowerCase();if(!y)continue;if(y.length>=5&&y.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(y)&&d.add(y),wa.has(y)&&d.add(y),h&&h.length)try{h.indexOf(y)!==-1&&d.add(y)}catch{}}postMessage({id:t.id,result:Array.from(d)});return}const{id:n,md:i}=t,{content:r,data:a}=nr(i||"");await ir().catch(()=>{});let s=An.parse(r);const l=[],o=new Map,c=_a;s=s.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(u,h,d,p)=>{const f=Number(h);let y=p.replace(/<[^>]+>/g,"").trim();try{y=ba(y)}catch{}let g=null;const m=(d||"").match(/\sid="([^"]+)"/);m&&(g=m[1]);const b=g||c(y)||"heading",k=(o.get(b)||0)+1;o.set(b,k);const S=k===1?b:b+"-"+k;l.push({level:f,text:y,id:S});const v={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},E=f<=2?"has-text-weight-bold":f<=4?"has-text-weight-semibold":"has-text-weight-normal",B=(v[f]+" "+E).trim(),W=((d||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${S}" class="${B}"`).trim();return`<h${f} ${W}>${p}</h${f}>`}),s=s.replace(/<img([^>]*)>/g,(u,h)=>/\bloading=/.test(h)?`<img${h}>`:/\bdata-want-lazy=/.test(h)?`<img${h}>`:`<img${h} loading="lazy">`),postMessage({id:n,result:{html:s,meta:a||{},toc:l}})}catch(n){postMessage({id:t.id,error:String(n)})}};async function nl(e){try{if(e&&e.type==="register"){const{name:o,url:c}=e;try{if(!await ir())return{type:"register-error",name:o,error:"hljs unavailable"};const h=await Ur(c),d=h?h.default||h:null;return d?(Ke.registerLanguage(o,d),{type:"registered",name:o}):{type:"register-error",name:o,error:"failed to import language module"}}catch(u){return{type:"register-error",name:o,error:String(u)}}}if(e&&e.type==="detect"){const o=e.md||"",c=e.supported||[],u=new Set,h=new RegExp(rr.source,rr.flags);let d;for(;d=h.exec(o);)if(d[1]){const p=String(d[1]).toLowerCase();if(!p)continue;if(p.length>=5&&p.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(p)&&u.add(p),wa.has(p)&&u.add(p),c&&c.length)try{c.indexOf(p)!==-1&&u.add(p)}catch{}}return{id:e.id,result:Array.from(u)}}const t=e&&e.id,{content:n,data:i}=nr(e&&e.md||"");await ir().catch(()=>{});let r=An.parse(n);const a=[],s=new Map,l=_a;return r=r.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(o,c,u,h)=>{const d=Number(c);let p=h.replace(/<[^>]+>/g,"").trim();try{p=ba(p)}catch{}let f=null;const y=(u||"").match(/\sid="([^"]+)"/);y&&(f=y[1]);const g=f||l(p)||"heading",b=(s.get(g)||0)+1;s.set(g,b);const w=b===1?g:g+"-"+b;a.push({level:d,text:p,id:w});const k={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},S=d<=2?"has-text-weight-bold":d<=4?"has-text-weight-semibold":"has-text-weight-normal",v=(k[d]+" "+S).trim(),B=((u||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${w}" class="${v}"`).trim();return`<h${d} ${B}>${h}</h${d}>`}),r=r.replace(/<img([^>]*)>/g,(o,c)=>/\bloading=/.test(c)?`<img${c}>`:/\bdata-want-lazy=/.test(c)?`<img${c}>`:`<img${c} loading="lazy">`),{id:t,result:{html:r,meta:i||{},toc:a}}}catch(t){return{id:e&&e.id,error:String(t)}}}const Wr={100:"💯",1234:"🔢",grinning:"😀",grimacing:"😬",grin:"😁",joy:"😂",rofl:"🤣",partying:"🥳",smiley:"😃",smile:"😄",sweat_smile:"😅",laughing:"😆",innocent:"😇",wink:"😉",blush:"😊",slightly_smiling_face:"🙂",upside_down_face:"🙃",relaxed:"☺️",yum:"😋",relieved:"😌",heart_eyes:"😍",smiling_face_with_three_hearts:"🥰",kissing_heart:"😘",kissing:"😗",kissing_smiling_eyes:"😙",kissing_closed_eyes:"😚",stuck_out_tongue_winking_eye:"😜",zany:"🤪",raised_eyebrow:"🤨",monocle:"🧐",stuck_out_tongue_closed_eyes:"😝",stuck_out_tongue:"😛",money_mouth_face:"🤑",nerd_face:"🤓",sunglasses:"😎",star_struck:"🤩",clown_face:"🤡",cowboy_hat_face:"🤠",hugs:"🤗",smirk:"😏",no_mouth:"😶",neutral_face:"😐",expressionless:"😑",unamused:"😒",roll_eyes:"🙄",thinking:"🤔",lying_face:"🤥",hand_over_mouth:"🤭",shushing:"🤫",symbols_over_mouth:"🤬",exploding_head:"🤯",flushed:"😳",disappointed:"😞",worried:"😟",angry:"😠",rage:"😡",pensive:"😔",confused:"😕",slightly_frowning_face:"🙁",frowning_face:"☹",persevere:"😣",confounded:"😖",tired_face:"😫",weary:"😩",pleading:"🥺",triumph:"😤",open_mouth:"😮",scream:"😱",fearful:"😨",cold_sweat:"😰",hushed:"😯",frowning:"😦",anguished:"😧",cry:"😢",disappointed_relieved:"😥",drooling_face:"🤤",sleepy:"😪",sweat:"😓",hot:"🥵",cold:"🥶",sob:"😭",dizzy_face:"😵",astonished:"😲",zipper_mouth_face:"🤐",nauseated_face:"🤢",sneezing_face:"🤧",vomiting:"🤮",mask:"😷",face_with_thermometer:"🤒",face_with_head_bandage:"🤕",woozy:"🥴",sleeping:"😴",zzz:"💤",poop:"💩",smiling_imp:"😈",imp:"👿",japanese_ogre:"👹",japanese_goblin:"👺",skull:"💀",ghost:"👻",alien:"👽",robot:"🤖",smiley_cat:"😺",smile_cat:"😸",joy_cat:"😹",heart_eyes_cat:"😻",smirk_cat:"😼",kissing_cat:"😽",scream_cat:"🙀",crying_cat_face:"😿",pouting_cat:"😾",palms_up:"🤲",raised_hands:"🙌",clap:"👏",wave:"👋",call_me_hand:"🤙","+1":"👍","-1":"👎",facepunch:"👊",fist:"✊",fist_left:"🤛",fist_right:"🤜",v:"✌",ok_hand:"👌",raised_hand:"✋",raised_back_of_hand:"🤚",open_hands:"👐",muscle:"💪",pray:"🙏",foot:"🦶",leg:"🦵",handshake:"🤝",point_up:"☝",point_up_2:"👆",point_down:"👇",point_left:"👈",point_right:"👉",fu:"🖕",raised_hand_with_fingers_splayed:"🖐",love_you:"🤟",metal:"🤘",crossed_fingers:"🤞",vulcan_salute:"🖖",writing_hand:"✍",selfie:"🤳",nail_care:"💅",lips:"👄",tooth:"🦷",tongue:"👅",ear:"👂",nose:"👃",eye:"👁",eyes:"👀",brain:"🧠",bust_in_silhouette:"👤",busts_in_silhouette:"👥",speaking_head:"🗣",baby:"👶",child:"🧒",boy:"👦",girl:"👧",adult:"🧑",man:"👨",woman:"👩",blonde_woman:"👱‍♀️",blonde_man:"👱",bearded_person:"🧔",older_adult:"🧓",older_man:"👴",older_woman:"👵",man_with_gua_pi_mao:"👲",woman_with_headscarf:"🧕",woman_with_turban:"👳‍♀️",man_with_turban:"👳",policewoman:"👮‍♀️",policeman:"👮",construction_worker_woman:"👷‍♀️",construction_worker_man:"👷",guardswoman:"💂‍♀️",guardsman:"💂",female_detective:"🕵️‍♀️",male_detective:"🕵",woman_health_worker:"👩‍⚕️",man_health_worker:"👨‍⚕️",woman_farmer:"👩‍🌾",man_farmer:"👨‍🌾",woman_cook:"👩‍🍳",man_cook:"👨‍🍳",woman_student:"👩‍🎓",man_student:"👨‍🎓",woman_singer:"👩‍🎤",man_singer:"👨‍🎤",woman_teacher:"👩‍🏫",man_teacher:"👨‍🏫",woman_factory_worker:"👩‍🏭",man_factory_worker:"👨‍🏭",woman_technologist:"👩‍💻",man_technologist:"👨‍💻",woman_office_worker:"👩‍💼",man_office_worker:"👨‍💼",woman_mechanic:"👩‍🔧",man_mechanic:"👨‍🔧",woman_scientist:"👩‍🔬",man_scientist:"👨‍🔬",woman_artist:"👩‍🎨",man_artist:"👨‍🎨",woman_firefighter:"👩‍🚒",man_firefighter:"👨‍🚒",woman_pilot:"👩‍✈️",man_pilot:"👨‍✈️",woman_astronaut:"👩‍🚀",man_astronaut:"👨‍🚀",woman_judge:"👩‍⚖️",man_judge:"👨‍⚖️",woman_superhero:"🦸‍♀️",man_superhero:"🦸‍♂️",woman_supervillain:"🦹‍♀️",man_supervillain:"🦹‍♂️",mrs_claus:"🤶",santa:"🎅",sorceress:"🧙‍♀️",wizard:"🧙‍♂️",woman_elf:"🧝‍♀️",man_elf:"🧝‍♂️",woman_vampire:"🧛‍♀️",man_vampire:"🧛‍♂️",woman_zombie:"🧟‍♀️",man_zombie:"🧟‍♂️",woman_genie:"🧞‍♀️",man_genie:"🧞‍♂️",mermaid:"🧜‍♀️",merman:"🧜‍♂️",woman_fairy:"🧚‍♀️",man_fairy:"🧚‍♂️",angel:"👼",pregnant_woman:"🤰",breastfeeding:"🤱",princess:"👸",prince:"🤴",bride_with_veil:"👰",man_in_tuxedo:"🤵",running_woman:"🏃‍♀️",running_man:"🏃",walking_woman:"🚶‍♀️",walking_man:"🚶",dancer:"💃",man_dancing:"🕺",dancing_women:"👯",dancing_men:"👯‍♂️",couple:"👫",two_men_holding_hands:"👬",two_women_holding_hands:"👭",bowing_woman:"🙇‍♀️",bowing_man:"🙇",man_facepalming:"🤦‍♂️",woman_facepalming:"🤦‍♀️",woman_shrugging:"🤷",man_shrugging:"🤷‍♂️",tipping_hand_woman:"💁",tipping_hand_man:"💁‍♂️",no_good_woman:"🙅",no_good_man:"🙅‍♂️",ok_woman:"🙆",ok_man:"🙆‍♂️",raising_hand_woman:"🙋",raising_hand_man:"🙋‍♂️",pouting_woman:"🙎",pouting_man:"🙎‍♂️",frowning_woman:"🙍",frowning_man:"🙍‍♂️",haircut_woman:"💇",haircut_man:"💇‍♂️",massage_woman:"💆",massage_man:"💆‍♂️",woman_in_steamy_room:"🧖‍♀️",man_in_steamy_room:"🧖‍♂️",couple_with_heart_woman_man:"💑",couple_with_heart_woman_woman:"👩‍❤️‍👩",couple_with_heart_man_man:"👨‍❤️‍👨",couplekiss_man_woman:"💏",couplekiss_woman_woman:"👩‍❤️‍💋‍👩",couplekiss_man_man:"👨‍❤️‍💋‍👨",family_man_woman_boy:"👪",family_man_woman_girl:"👨‍👩‍👧",family_man_woman_girl_boy:"👨‍👩‍👧‍👦",family_man_woman_boy_boy:"👨‍👩‍👦‍👦",family_man_woman_girl_girl:"👨‍👩‍👧‍👧",family_woman_woman_boy:"👩‍👩‍👦",family_woman_woman_girl:"👩‍👩‍👧",family_woman_woman_girl_boy:"👩‍👩‍👧‍👦",family_woman_woman_boy_boy:"👩‍👩‍👦‍👦",family_woman_woman_girl_girl:"👩‍👩‍👧‍👧",family_man_man_boy:"👨‍👨‍👦",family_man_man_girl:"👨‍👨‍👧",family_man_man_girl_boy:"👨‍👨‍👧‍👦",family_man_man_boy_boy:"👨‍👨‍👦‍👦",family_man_man_girl_girl:"👨‍👨‍👧‍👧",family_woman_boy:"👩‍👦",family_woman_girl:"👩‍👧",family_woman_girl_boy:"👩‍👧‍👦",family_woman_boy_boy:"👩‍👦‍👦",family_woman_girl_girl:"👩‍👧‍👧",family_man_boy:"👨‍👦",family_man_girl:"👨‍👧",family_man_girl_boy:"👨‍👧‍👦",family_man_boy_boy:"👨‍👦‍👦",family_man_girl_girl:"👨‍👧‍👧",yarn:"🧶",thread:"🧵",coat:"🧥",labcoat:"🥼",womans_clothes:"👚",tshirt:"👕",jeans:"👖",necktie:"👔",dress:"👗",bikini:"👙",kimono:"👘",lipstick:"💄",kiss:"💋",footprints:"👣",flat_shoe:"🥿",high_heel:"👠",sandal:"👡",boot:"👢",mans_shoe:"👞",athletic_shoe:"👟",hiking_boot:"🥾",socks:"🧦",gloves:"🧤",scarf:"🧣",womans_hat:"👒",tophat:"🎩",billed_hat:"🧢",rescue_worker_helmet:"⛑",mortar_board:"🎓",crown:"👑",school_satchel:"🎒",luggage:"🧳",pouch:"👝",purse:"👛",handbag:"👜",briefcase:"💼",eyeglasses:"👓",dark_sunglasses:"🕶",goggles:"🥽",ring:"💍",closed_umbrella:"🌂",dog:"🐶",cat:"🐱",mouse:"🐭",hamster:"🐹",rabbit:"🐰",fox_face:"🦊",bear:"🐻",panda_face:"🐼",koala:"🐨",tiger:"🐯",lion:"🦁",cow:"🐮",pig:"🐷",pig_nose:"🐽",frog:"🐸",squid:"🦑",octopus:"🐙",shrimp:"🦐",monkey_face:"🐵",gorilla:"🦍",see_no_evil:"🙈",hear_no_evil:"🙉",speak_no_evil:"🙊",monkey:"🐒",chicken:"🐔",penguin:"🐧",bird:"🐦",baby_chick:"🐤",hatching_chick:"🐣",hatched_chick:"🐥",duck:"🦆",eagle:"🦅",owl:"🦉",bat:"🦇",wolf:"🐺",boar:"🐗",horse:"🐴",unicorn:"🦄",honeybee:"🐝",bug:"🐛",butterfly:"🦋",snail:"🐌",beetle:"🐞",ant:"🐜",grasshopper:"🦗",spider:"🕷",scorpion:"🦂",crab:"🦀",snake:"🐍",lizard:"🦎","t-rex":"🦖",sauropod:"🦕",turtle:"🐢",tropical_fish:"🐠",fish:"🐟",blowfish:"🐡",dolphin:"🐬",shark:"🦈",whale:"🐳",whale2:"🐋",crocodile:"🐊",leopard:"🐆",zebra:"🦓",tiger2:"🐅",water_buffalo:"🐃",ox:"🐂",cow2:"🐄",deer:"🦌",dromedary_camel:"🐪",camel:"🐫",giraffe:"🦒",elephant:"🐘",rhinoceros:"🦏",goat:"🐐",ram:"🐏",sheep:"🐑",racehorse:"🐎",pig2:"🐖",rat:"🐀",mouse2:"🐁",rooster:"🐓",turkey:"🦃",dove:"🕊",dog2:"🐕",poodle:"🐩",cat2:"🐈",rabbit2:"🐇",chipmunk:"🐿",hedgehog:"🦔",raccoon:"🦝",llama:"🦙",hippopotamus:"🦛",kangaroo:"🦘",badger:"🦡",swan:"🦢",peacock:"🦚",parrot:"🦜",lobster:"🦞",mosquito:"🦟",paw_prints:"🐾",dragon:"🐉",dragon_face:"🐲",cactus:"🌵",christmas_tree:"🎄",evergreen_tree:"🌲",deciduous_tree:"🌳",palm_tree:"🌴",seedling:"🌱",herb:"🌿",shamrock:"☘",four_leaf_clover:"🍀",bamboo:"🎍",tanabata_tree:"🎋",leaves:"🍃",fallen_leaf:"🍂",maple_leaf:"🍁",ear_of_rice:"🌾",hibiscus:"🌺",sunflower:"🌻",rose:"🌹",wilted_flower:"🥀",tulip:"🌷",blossom:"🌼",cherry_blossom:"🌸",bouquet:"💐",mushroom:"🍄",chestnut:"🌰",jack_o_lantern:"🎃",shell:"🐚",spider_web:"🕸",earth_americas:"🌎",earth_africa:"🌍",earth_asia:"🌏",full_moon:"🌕",waning_gibbous_moon:"🌖",last_quarter_moon:"🌗",waning_crescent_moon:"🌘",new_moon:"🌑",waxing_crescent_moon:"🌒",first_quarter_moon:"🌓",waxing_gibbous_moon:"🌔",new_moon_with_face:"🌚",full_moon_with_face:"🌝",first_quarter_moon_with_face:"🌛",last_quarter_moon_with_face:"🌜",sun_with_face:"🌞",crescent_moon:"🌙",star:"⭐",star2:"🌟",dizzy:"💫",sparkles:"✨",comet:"☄",sunny:"☀️",sun_behind_small_cloud:"🌤",partly_sunny:"⛅",sun_behind_large_cloud:"🌥",sun_behind_rain_cloud:"🌦",cloud:"☁️",cloud_with_rain:"🌧",cloud_with_lightning_and_rain:"⛈",cloud_with_lightning:"🌩",zap:"⚡",fire:"🔥",boom:"💥",snowflake:"❄️",cloud_with_snow:"🌨",snowman:"⛄",snowman_with_snow:"☃",wind_face:"🌬",dash:"💨",tornado:"🌪",fog:"🌫",open_umbrella:"☂",umbrella:"☔",droplet:"💧",sweat_drops:"💦",ocean:"🌊",green_apple:"🍏",apple:"🍎",pear:"🍐",tangerine:"🍊",lemon:"🍋",banana:"🍌",watermelon:"🍉",grapes:"🍇",strawberry:"🍓",melon:"🍈",cherries:"🍒",peach:"🍑",pineapple:"🍍",coconut:"🥥",kiwi_fruit:"🥝",mango:"🥭",avocado:"🥑",broccoli:"🥦",tomato:"🍅",eggplant:"🍆",cucumber:"🥒",carrot:"🥕",hot_pepper:"🌶",potato:"🥔",corn:"🌽",leafy_greens:"🥬",sweet_potato:"🍠",peanuts:"🥜",honey_pot:"🍯",croissant:"🥐",bread:"🍞",baguette_bread:"🥖",bagel:"🥯",pretzel:"🥨",cheese:"🧀",egg:"🥚",bacon:"🥓",steak:"🥩",pancakes:"🥞",poultry_leg:"🍗",meat_on_bone:"🍖",bone:"🦴",fried_shrimp:"🍤",fried_egg:"🍳",hamburger:"🍔",fries:"🍟",stuffed_flatbread:"🥙",hotdog:"🌭",pizza:"🍕",sandwich:"🥪",canned_food:"🥫",spaghetti:"🍝",taco:"🌮",burrito:"🌯",green_salad:"🥗",shallow_pan_of_food:"🥘",ramen:"🍜",stew:"🍲",fish_cake:"🍥",fortune_cookie:"🥠",sushi:"🍣",bento:"🍱",curry:"🍛",rice_ball:"🍙",rice:"🍚",rice_cracker:"🍘",oden:"🍢",dango:"🍡",shaved_ice:"🍧",ice_cream:"🍨",icecream:"🍦",pie:"🥧",cake:"🍰",cupcake:"🧁",moon_cake:"🥮",birthday:"🎂",custard:"🍮",candy:"🍬",lollipop:"🍭",chocolate_bar:"🍫",popcorn:"🍿",dumpling:"🥟",doughnut:"🍩",cookie:"🍪",milk_glass:"🥛",beer:"🍺",beers:"🍻",clinking_glasses:"🥂",wine_glass:"🍷",tumbler_glass:"🥃",cocktail:"🍸",tropical_drink:"🍹",champagne:"🍾",sake:"🍶",tea:"🍵",cup_with_straw:"🥤",coffee:"☕",baby_bottle:"🍼",salt:"🧂",spoon:"🥄",fork_and_knife:"🍴",plate_with_cutlery:"🍽",bowl_with_spoon:"🥣",takeout_box:"🥡",chopsticks:"🥢",soccer:"⚽",basketball:"🏀",football:"🏈",baseball:"⚾",softball:"🥎",tennis:"🎾",volleyball:"🏐",rugby_football:"🏉",flying_disc:"🥏","8ball":"🎱",golf:"⛳",golfing_woman:"🏌️‍♀️",golfing_man:"🏌",ping_pong:"🏓",badminton:"🏸",goal_net:"🥅",ice_hockey:"🏒",field_hockey:"🏑",lacrosse:"🥍",cricket:"🏏",ski:"🎿",skier:"⛷",snowboarder:"🏂",person_fencing:"🤺",women_wrestling:"🤼‍♀️",men_wrestling:"🤼‍♂️",woman_cartwheeling:"🤸‍♀️",man_cartwheeling:"🤸‍♂️",woman_playing_handball:"🤾‍♀️",man_playing_handball:"🤾‍♂️",ice_skate:"⛸",curling_stone:"🥌",skateboard:"🛹",sled:"🛷",bow_and_arrow:"🏹",fishing_pole_and_fish:"🎣",boxing_glove:"🥊",martial_arts_uniform:"🥋",rowing_woman:"🚣‍♀️",rowing_man:"🚣",climbing_woman:"🧗‍♀️",climbing_man:"🧗‍♂️",swimming_woman:"🏊‍♀️",swimming_man:"🏊",woman_playing_water_polo:"🤽‍♀️",man_playing_water_polo:"🤽‍♂️",woman_in_lotus_position:"🧘‍♀️",man_in_lotus_position:"🧘‍♂️",surfing_woman:"🏄‍♀️",surfing_man:"🏄",bath:"🛀",basketball_woman:"⛹️‍♀️",basketball_man:"⛹",weight_lifting_woman:"🏋️‍♀️",weight_lifting_man:"🏋",biking_woman:"🚴‍♀️",biking_man:"🚴",mountain_biking_woman:"🚵‍♀️",mountain_biking_man:"🚵",horse_racing:"🏇",business_suit_levitating:"🕴",trophy:"🏆",running_shirt_with_sash:"🎽",medal_sports:"🏅",medal_military:"🎖","1st_place_medal":"🥇","2nd_place_medal":"🥈","3rd_place_medal":"🥉",reminder_ribbon:"🎗",rosette:"🏵",ticket:"🎫",tickets:"🎟",performing_arts:"🎭",art:"🎨",circus_tent:"🎪",woman_juggling:"🤹‍♀️",man_juggling:"🤹‍♂️",microphone:"🎤",headphones:"🎧",musical_score:"🎼",musical_keyboard:"🎹",drum:"🥁",saxophone:"🎷",trumpet:"🎺",guitar:"🎸",violin:"🎻",clapper:"🎬",video_game:"🎮",space_invader:"👾",dart:"🎯",game_die:"🎲",chess_pawn:"♟",slot_machine:"🎰",jigsaw:"🧩",bowling:"🎳",red_car:"🚗",taxi:"🚕",blue_car:"🚙",bus:"🚌",trolleybus:"🚎",racing_car:"🏎",police_car:"🚓",ambulance:"🚑",fire_engine:"🚒",minibus:"🚐",truck:"🚚",articulated_lorry:"🚛",tractor:"🚜",kick_scooter:"🛴",motorcycle:"🏍",bike:"🚲",motor_scooter:"🛵",rotating_light:"🚨",oncoming_police_car:"🚔",oncoming_bus:"🚍",oncoming_automobile:"🚘",oncoming_taxi:"🚖",aerial_tramway:"🚡",mountain_cableway:"🚠",suspension_railway:"🚟",railway_car:"🚃",train:"🚋",monorail:"🚝",bullettrain_side:"🚄",bullettrain_front:"🚅",light_rail:"🚈",mountain_railway:"🚞",steam_locomotive:"🚂",train2:"🚆",metro:"🚇",tram:"🚊",station:"🚉",flying_saucer:"🛸",helicopter:"🚁",small_airplane:"🛩",airplane:"✈️",flight_departure:"🛫",flight_arrival:"🛬",sailboat:"⛵",motor_boat:"🛥",speedboat:"🚤",ferry:"⛴",passenger_ship:"🛳",rocket:"🚀",artificial_satellite:"🛰",seat:"💺",canoe:"🛶",anchor:"⚓",construction:"🚧",fuelpump:"⛽",busstop:"🚏",vertical_traffic_light:"🚦",traffic_light:"🚥",checkered_flag:"🏁",ship:"🚢",ferris_wheel:"🎡",roller_coaster:"🎢",carousel_horse:"🎠",building_construction:"🏗",foggy:"🌁",tokyo_tower:"🗼",factory:"🏭",fountain:"⛲",rice_scene:"🎑",mountain:"⛰",mountain_snow:"🏔",mount_fuji:"🗻",volcano:"🌋",japan:"🗾",camping:"🏕",tent:"⛺",national_park:"🏞",motorway:"🛣",railway_track:"🛤",sunrise:"🌅",sunrise_over_mountains:"🌄",desert:"🏜",beach_umbrella:"🏖",desert_island:"🏝",city_sunrise:"🌇",city_sunset:"🌆",cityscape:"🏙",night_with_stars:"🌃",bridge_at_night:"🌉",milky_way:"🌌",stars:"🌠",sparkler:"🎇",fireworks:"🎆",rainbow:"🌈",houses:"🏘",european_castle:"🏰",japanese_castle:"🏯",stadium:"🏟",statue_of_liberty:"🗽",house:"🏠",house_with_garden:"🏡",derelict_house:"🏚",office:"🏢",department_store:"🏬",post_office:"🏣",european_post_office:"🏤",hospital:"🏥",bank:"🏦",hotel:"🏨",convenience_store:"🏪",school:"🏫",love_hotel:"🏩",wedding:"💒",classical_building:"🏛",church:"⛪",mosque:"🕌",synagogue:"🕍",kaaba:"🕋",shinto_shrine:"⛩",watch:"⌚",iphone:"📱",calling:"📲",computer:"💻",keyboard:"⌨",desktop_computer:"🖥",printer:"🖨",computer_mouse:"🖱",trackball:"🖲",joystick:"🕹",clamp:"🗜",minidisc:"💽",floppy_disk:"💾",cd:"💿",dvd:"📀",vhs:"📼",camera:"📷",camera_flash:"📸",video_camera:"📹",movie_camera:"🎥",film_projector:"📽",film_strip:"🎞",telephone_receiver:"📞",phone:"☎️",pager:"📟",fax:"📠",tv:"📺",radio:"📻",studio_microphone:"🎙",level_slider:"🎚",control_knobs:"🎛",compass:"🧭",stopwatch:"⏱",timer_clock:"⏲",alarm_clock:"⏰",mantelpiece_clock:"🕰",hourglass_flowing_sand:"⏳",hourglass:"⌛",satellite:"📡",battery:"🔋",electric_plug:"🔌",bulb:"💡",flashlight:"🔦",candle:"🕯",fire_extinguisher:"🧯",wastebasket:"🗑",oil_drum:"🛢",money_with_wings:"💸",dollar:"💵",yen:"💴",euro:"💶",pound:"💷",moneybag:"💰",credit_card:"💳",gem:"💎",balance_scale:"⚖",toolbox:"🧰",wrench:"🔧",hammer:"🔨",hammer_and_pick:"⚒",hammer_and_wrench:"🛠",pick:"⛏",nut_and_bolt:"🔩",gear:"⚙",brick:"🧱",chains:"⛓",magnet:"🧲",gun:"🔫",bomb:"💣",firecracker:"🧨",hocho:"🔪",dagger:"🗡",crossed_swords:"⚔",shield:"🛡",smoking:"🚬",skull_and_crossbones:"☠",coffin:"⚰",funeral_urn:"⚱",amphora:"🏺",crystal_ball:"🔮",prayer_beads:"📿",nazar_amulet:"🧿",barber:"💈",alembic:"⚗",telescope:"🔭",microscope:"🔬",hole:"🕳",pill:"💊",syringe:"💉",dna:"🧬",microbe:"🦠",petri_dish:"🧫",test_tube:"🧪",thermometer:"🌡",broom:"🧹",basket:"🧺",toilet_paper:"🧻",label:"🏷",bookmark:"🔖",toilet:"🚽",shower:"🚿",bathtub:"🛁",soap:"🧼",sponge:"🧽",lotion_bottle:"🧴",key:"🔑",old_key:"🗝",couch_and_lamp:"🛋",sleeping_bed:"🛌",bed:"🛏",door:"🚪",bellhop_bell:"🛎",teddy_bear:"🧸",framed_picture:"🖼",world_map:"🗺",parasol_on_ground:"⛱",moyai:"🗿",shopping:"🛍",shopping_cart:"🛒",balloon:"🎈",flags:"🎏",ribbon:"🎀",gift:"🎁",confetti_ball:"🎊",tada:"🎉",dolls:"🎎",wind_chime:"🎐",crossed_flags:"🎌",izakaya_lantern:"🏮",red_envelope:"🧧",email:"✉️",envelope_with_arrow:"📩",incoming_envelope:"📨","e-mail":"📧",love_letter:"💌",postbox:"📮",mailbox_closed:"📪",mailbox:"📫",mailbox_with_mail:"📬",mailbox_with_no_mail:"📭",package:"📦",postal_horn:"📯",inbox_tray:"📥",outbox_tray:"📤",scroll:"📜",page_with_curl:"📃",bookmark_tabs:"📑",receipt:"🧾",bar_chart:"📊",chart_with_upwards_trend:"📈",chart_with_downwards_trend:"📉",page_facing_up:"📄",date:"📅",calendar:"📆",spiral_calendar:"🗓",card_index:"📇",card_file_box:"🗃",ballot_box:"🗳",file_cabinet:"🗄",clipboard:"📋",spiral_notepad:"🗒",file_folder:"📁",open_file_folder:"📂",card_index_dividers:"🗂",newspaper_roll:"🗞",newspaper:"📰",notebook:"📓",closed_book:"📕",green_book:"📗",blue_book:"📘",orange_book:"📙",notebook_with_decorative_cover:"📔",ledger:"📒",books:"📚",open_book:"📖",safety_pin:"🧷",link:"🔗",paperclip:"📎",paperclips:"🖇",scissors:"✂️",triangular_ruler:"📐",straight_ruler:"📏",abacus:"🧮",pushpin:"📌",round_pushpin:"📍",triangular_flag_on_post:"🚩",white_flag:"🏳",black_flag:"🏴",rainbow_flag:"🏳️‍🌈",closed_lock_with_key:"🔐",lock:"🔒",unlock:"🔓",lock_with_ink_pen:"🔏",pen:"🖊",fountain_pen:"🖋",black_nib:"✒️",memo:"📝",pencil2:"✏️",crayon:"🖍",paintbrush:"🖌",mag:"🔍",mag_right:"🔎",heart:"❤️",orange_heart:"🧡",yellow_heart:"💛",green_heart:"💚",blue_heart:"💙",purple_heart:"💜",black_heart:"🖤",broken_heart:"💔",heavy_heart_exclamation:"❣",two_hearts:"💕",revolving_hearts:"💞",heartbeat:"💓",heartpulse:"💗",sparkling_heart:"💖",cupid:"💘",gift_heart:"💝",heart_decoration:"💟",peace_symbol:"☮",latin_cross:"✝",star_and_crescent:"☪",om:"🕉",wheel_of_dharma:"☸",star_of_david:"✡",six_pointed_star:"🔯",menorah:"🕎",yin_yang:"☯",orthodox_cross:"☦",place_of_worship:"🛐",ophiuchus:"⛎",aries:"♈",taurus:"♉",gemini:"♊",cancer:"♋",leo:"♌",virgo:"♍",libra:"♎",scorpius:"♏",sagittarius:"♐",capricorn:"♑",aquarius:"♒",pisces:"♓",id:"🆔",atom_symbol:"⚛",u7a7a:"🈳",u5272:"🈹",radioactive:"☢",biohazard:"☣",mobile_phone_off:"📴",vibration_mode:"📳",u6709:"🈶",u7121:"🈚",u7533:"🈸",u55b6:"🈺",u6708:"🈷️",eight_pointed_black_star:"✴️",vs:"🆚",accept:"🉑",white_flower:"💮",ideograph_advantage:"🉐",secret:"㊙️",congratulations:"㊗️",u5408:"🈴",u6e80:"🈵",u7981:"🈲",a:"🅰️",b:"🅱️",ab:"🆎",cl:"🆑",o2:"🅾️",sos:"🆘",no_entry:"⛔",name_badge:"📛",no_entry_sign:"🚫",x:"❌",o:"⭕",stop_sign:"🛑",anger:"💢",hotsprings:"♨️",no_pedestrians:"🚷",do_not_litter:"🚯",no_bicycles:"🚳","non-potable_water":"🚱",underage:"🔞",no_mobile_phones:"📵",exclamation:"❗",grey_exclamation:"❕",question:"❓",grey_question:"❔",bangbang:"‼️",interrobang:"⁉️",low_brightness:"🔅",high_brightness:"🔆",trident:"🔱",fleur_de_lis:"⚜",part_alternation_mark:"〽️",warning:"⚠️",children_crossing:"🚸",beginner:"🔰",recycle:"♻️",u6307:"🈯",chart:"💹",sparkle:"❇️",eight_spoked_asterisk:"✳️",negative_squared_cross_mark:"❎",white_check_mark:"✅",diamond_shape_with_a_dot_inside:"💠",cyclone:"🌀",loop:"➿",globe_with_meridians:"🌐",m:"Ⓜ️",atm:"🏧",sa:"🈂️",passport_control:"🛂",customs:"🛃",baggage_claim:"🛄",left_luggage:"🛅",wheelchair:"♿",no_smoking:"🚭",wc:"🚾",parking:"🅿️",potable_water:"🚰",mens:"🚹",womens:"🚺",baby_symbol:"🚼",restroom:"🚻",put_litter_in_its_place:"🚮",cinema:"🎦",signal_strength:"📶",koko:"🈁",ng:"🆖",ok:"🆗",up:"🆙",cool:"🆒",new:"🆕",free:"🆓",zero:"0️⃣",one:"1️⃣",two:"2️⃣",three:"3️⃣",four:"4️⃣",five:"5️⃣",six:"6️⃣",seven:"7️⃣",eight:"8️⃣",nine:"9️⃣",keycap_ten:"🔟",asterisk:"*⃣",eject_button:"⏏️",arrow_forward:"▶️",pause_button:"⏸",next_track_button:"⏭",stop_button:"⏹",record_button:"⏺",play_or_pause_button:"⏯",previous_track_button:"⏮",fast_forward:"⏩",rewind:"⏪",twisted_rightwards_arrows:"🔀",repeat:"🔁",repeat_one:"🔂",arrow_backward:"◀️",arrow_up_small:"🔼",arrow_down_small:"🔽",arrow_double_up:"⏫",arrow_double_down:"⏬",arrow_right:"➡️",arrow_left:"⬅️",arrow_up:"⬆️",arrow_down:"⬇️",arrow_upper_right:"↗️",arrow_lower_right:"↘️",arrow_lower_left:"↙️",arrow_upper_left:"↖️",arrow_up_down:"↕️",left_right_arrow:"↔️",arrows_counterclockwise:"🔄",arrow_right_hook:"↪️",leftwards_arrow_with_hook:"↩️",arrow_heading_up:"⤴️",arrow_heading_down:"⤵️",hash:"#️⃣",information_source:"ℹ️",abc:"🔤",abcd:"🔡",capital_abcd:"🔠",symbols:"🔣",musical_note:"🎵",notes:"🎶",wavy_dash:"〰️",curly_loop:"➰",heavy_check_mark:"✔️",arrows_clockwise:"🔃",heavy_plus_sign:"➕",heavy_minus_sign:"➖",heavy_division_sign:"➗",heavy_multiplication_x:"✖️",infinity:"♾",heavy_dollar_sign:"💲",currency_exchange:"💱",copyright:"©️",registered:"®️",tm:"™️",end:"🔚",back:"🔙",on:"🔛",top:"🔝",soon:"🔜",ballot_box_with_check:"☑️",radio_button:"🔘",white_circle:"⚪",black_circle:"⚫",red_circle:"🔴",large_blue_circle:"🔵",small_orange_diamond:"🔸",small_blue_diamond:"🔹",large_orange_diamond:"🔶",large_blue_diamond:"🔷",small_red_triangle:"🔺",black_small_square:"▪️",white_small_square:"▫️",black_large_square:"⬛",white_large_square:"⬜",small_red_triangle_down:"🔻",black_medium_square:"◼️",white_medium_square:"◻️",black_medium_small_square:"◾",white_medium_small_square:"◽",black_square_button:"🔲",white_square_button:"🔳",speaker:"🔈",sound:"🔉",loud_sound:"🔊",mute:"🔇",mega:"📣",loudspeaker:"📢",bell:"🔔",no_bell:"🔕",black_joker:"🃏",mahjong:"🀄",spades:"♠️",clubs:"♣️",hearts:"♥️",diamonds:"♦️",flower_playing_cards:"🎴",thought_balloon:"💭",right_anger_bubble:"🗯",speech_balloon:"💬",left_speech_bubble:"🗨",clock1:"🕐",clock2:"🕑",clock3:"🕒",clock4:"🕓",clock5:"🕔",clock6:"🕕",clock7:"🕖",clock8:"🕗",clock9:"🕘",clock10:"🕙",clock11:"🕚",clock12:"🕛",clock130:"🕜",clock230:"🕝",clock330:"🕞",clock430:"🕟",clock530:"🕠",clock630:"🕡",clock730:"🕢",clock830:"🕣",clock930:"🕤",clock1030:"🕥",clock1130:"🕦",clock1230:"🕧",afghanistan:"🇦🇫",aland_islands:"🇦🇽",albania:"🇦🇱",algeria:"🇩🇿",american_samoa:"🇦🇸",andorra:"🇦🇩",angola:"🇦🇴",anguilla:"🇦🇮",antarctica:"🇦🇶",antigua_barbuda:"🇦🇬",argentina:"🇦🇷",armenia:"🇦🇲",aruba:"🇦🇼",australia:"🇦🇺",austria:"🇦🇹",azerbaijan:"🇦🇿",bahamas:"🇧🇸",bahrain:"🇧🇭",bangladesh:"🇧🇩",barbados:"🇧🇧",belarus:"🇧🇾",belgium:"🇧🇪",belize:"🇧🇿",benin:"🇧🇯",bermuda:"🇧🇲",bhutan:"🇧🇹",bolivia:"🇧🇴",caribbean_netherlands:"🇧🇶",bosnia_herzegovina:"🇧🇦",botswana:"🇧🇼",brazil:"🇧🇷",british_indian_ocean_territory:"🇮🇴",british_virgin_islands:"🇻🇬",brunei:"🇧🇳",bulgaria:"🇧🇬",burkina_faso:"🇧🇫",burundi:"🇧🇮",cape_verde:"🇨🇻",cambodia:"🇰🇭",cameroon:"🇨🇲",canada:"🇨🇦",canary_islands:"🇮🇨",cayman_islands:"🇰🇾",central_african_republic:"🇨🇫",chad:"🇹🇩",chile:"🇨🇱",cn:"🇨🇳",christmas_island:"🇨🇽",cocos_islands:"🇨🇨",colombia:"🇨🇴",comoros:"🇰🇲",congo_brazzaville:"🇨🇬",congo_kinshasa:"🇨🇩",cook_islands:"🇨🇰",costa_rica:"🇨🇷",croatia:"🇭🇷",cuba:"🇨🇺",curacao:"🇨🇼",cyprus:"🇨🇾",czech_republic:"🇨🇿",denmark:"🇩🇰",djibouti:"🇩🇯",dominica:"🇩🇲",dominican_republic:"🇩🇴",ecuador:"🇪🇨",egypt:"🇪🇬",el_salvador:"🇸🇻",equatorial_guinea:"🇬🇶",eritrea:"🇪🇷",estonia:"🇪🇪",ethiopia:"🇪🇹",eu:"🇪🇺",falkland_islands:"🇫🇰",faroe_islands:"🇫🇴",fiji:"🇫🇯",finland:"🇫🇮",fr:"🇫🇷",french_guiana:"🇬🇫",french_polynesia:"🇵🇫",french_southern_territories:"🇹🇫",gabon:"🇬🇦",gambia:"🇬🇲",georgia:"🇬🇪",de:"🇩🇪",ghana:"🇬🇭",gibraltar:"🇬🇮",greece:"🇬🇷",greenland:"🇬🇱",grenada:"🇬🇩",guadeloupe:"🇬🇵",guam:"🇬🇺",guatemala:"🇬🇹",guernsey:"🇬🇬",guinea:"🇬🇳",guinea_bissau:"🇬🇼",guyana:"🇬🇾",haiti:"🇭🇹",honduras:"🇭🇳",hong_kong:"🇭🇰",hungary:"🇭🇺",iceland:"🇮🇸",india:"🇮🇳",indonesia:"🇮🇩",iran:"🇮🇷",iraq:"🇮🇶",ireland:"🇮🇪",isle_of_man:"🇮🇲",israel:"🇮🇱",it:"🇮🇹",cote_divoire:"🇨🇮",jamaica:"🇯🇲",jp:"🇯🇵",jersey:"🇯🇪",jordan:"🇯🇴",kazakhstan:"🇰🇿",kenya:"🇰🇪",kiribati:"🇰🇮",kosovo:"🇽🇰",kuwait:"🇰🇼",kyrgyzstan:"🇰🇬",laos:"🇱🇦",latvia:"🇱🇻",lebanon:"🇱🇧",lesotho:"🇱🇸",liberia:"🇱🇷",libya:"🇱🇾",liechtenstein:"🇱🇮",lithuania:"🇱🇹",luxembourg:"🇱🇺",macau:"🇲🇴",macedonia:"🇲🇰",madagascar:"🇲🇬",malawi:"🇲🇼",malaysia:"🇲🇾",maldives:"🇲🇻",mali:"🇲🇱",malta:"🇲🇹",marshall_islands:"🇲🇭",martinique:"🇲🇶",mauritania:"🇲🇷",mauritius:"🇲🇺",mayotte:"🇾🇹",mexico:"🇲🇽",micronesia:"🇫🇲",moldova:"🇲🇩",monaco:"🇲🇨",mongolia:"🇲🇳",montenegro:"🇲🇪",montserrat:"🇲🇸",morocco:"🇲🇦",mozambique:"🇲🇿",myanmar:"🇲🇲",namibia:"🇳🇦",nauru:"🇳🇷",nepal:"🇳🇵",netherlands:"🇳🇱",new_caledonia:"🇳🇨",new_zealand:"🇳🇿",nicaragua:"🇳🇮",niger:"🇳🇪",nigeria:"🇳🇬",niue:"🇳🇺",norfolk_island:"🇳🇫",northern_mariana_islands:"🇲🇵",north_korea:"🇰🇵",norway:"🇳🇴",oman:"🇴🇲",pakistan:"🇵🇰",palau:"🇵🇼",palestinian_territories:"🇵🇸",panama:"🇵🇦",papua_new_guinea:"🇵🇬",paraguay:"🇵🇾",peru:"🇵🇪",philippines:"🇵🇭",pitcairn_islands:"🇵🇳",poland:"🇵🇱",portugal:"🇵🇹",puerto_rico:"🇵🇷",qatar:"🇶🇦",reunion:"🇷🇪",romania:"🇷🇴",ru:"🇷🇺",rwanda:"🇷🇼",st_barthelemy:"🇧🇱",st_helena:"🇸🇭",st_kitts_nevis:"🇰🇳",st_lucia:"🇱🇨",st_pierre_miquelon:"🇵🇲",st_vincent_grenadines:"🇻🇨",samoa:"🇼🇸",san_marino:"🇸🇲",sao_tome_principe:"🇸🇹",saudi_arabia:"🇸🇦",senegal:"🇸🇳",serbia:"🇷🇸",seychelles:"🇸🇨",sierra_leone:"🇸🇱",singapore:"🇸🇬",sint_maarten:"🇸🇽",slovakia:"🇸🇰",slovenia:"🇸🇮",solomon_islands:"🇸🇧",somalia:"🇸🇴",south_africa:"🇿🇦",south_georgia_south_sandwich_islands:"🇬🇸",kr:"🇰🇷",south_sudan:"🇸🇸",es:"🇪🇸",sri_lanka:"🇱🇰",sudan:"🇸🇩",suriname:"🇸🇷",swaziland:"🇸🇿",sweden:"🇸🇪",switzerland:"🇨🇭",syria:"🇸🇾",taiwan:"🇹🇼",tajikistan:"🇹🇯",tanzania:"🇹🇿",thailand:"🇹🇭",timor_leste:"🇹🇱",togo:"🇹🇬",tokelau:"🇹🇰",tonga:"🇹🇴",trinidad_tobago:"🇹🇹",tunisia:"🇹🇳",tr:"🇹🇷",turkmenistan:"🇹🇲",turks_caicos_islands:"🇹🇨",tuvalu:"🇹🇻",uganda:"🇺🇬",ukraine:"🇺🇦",united_arab_emirates:"🇦🇪",uk:"🇬🇧",england:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",scotland:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",wales:"🏴󠁧󠁢󠁷󠁬󠁳󠁿",us:"🇺🇸",us_virgin_islands:"🇻🇮",uruguay:"🇺🇾",uzbekistan:"🇺🇿",vanuatu:"🇻🇺",vatican_city:"🇻🇦",venezuela:"🇻🇪",vietnam:"🇻🇳",wallis_futuna:"🇼🇫",western_sahara:"🇪🇭",yemen:"🇾🇪",zambia:"🇿🇲",zimbabwe:"🇿🇼",united_nations:"🇺🇳",pirate_flag:"🏴‍☠️"},rl=typeof navigator<"u"&&navigator.hardwareConcurrency?Math.max(1,Math.floor(navigator.hardwareConcurrency/2)):2,ka=Ci(()=>{if(typeof Worker<"u")try{return new el}catch{}try{if(Ut)return Ut(Jo)}catch{}const e={message:[],error:[]};return{addEventListener(t,n){e[t]||(e[t]=[]),e[t].push(n)},removeEventListener(t,n){if(!e[t])return;const i=e[t].indexOf(n);i!==-1&&e[t].splice(i,1)},postMessage(t){setTimeout(async()=>{try{const i={data:await nl(t)};(e.message||[]).forEach(r=>r(i))}catch(n){const i={data:{id:t&&t.id,error:String(n)}};(e.message||[]).forEach(r=>r(i))}},0)},terminate(){Object.keys(e).forEach(t=>e[t].length=0)}}},"markdown",rl),Yt=()=>ka.get(),Zr=(e,t=3e3)=>ka.send(e,t),_t=[];function Gr(e){if(e&&(typeof e=="object"||typeof e=="function")){_t.push(e);try{Ae.use(e)}catch(t){_("[markdown] failed to apply plugin",t)}}}function il(e){_t.length=0,Array.isArray(e)&&_t.push(...e.filter(t=>t&&typeof t=="object"));try{_t.forEach(t=>Ae.use(t))}catch(t){_("[markdown] failed to apply markdown extensions",t)}}async function En(e){if(_t&&_t.length){let{content:i,data:r}=nr(e||"");try{i=String(i||"").replace(/:([^:\s]+):/g,(s,l)=>Wr[l]||s)}catch{}Ae.setOptions({gfm:!0,mangle:!1,headerIds:!1,headerPrefix:""});try{_t.forEach(s=>Ae.use(s))}catch(s){_("[markdown] apply plugins failed",s)}const a=Ae.parse(i);try{const s=He();if(s){const l=s.parseFromString(a,"text/html"),o=l.querySelectorAll("h1,h2,h3,h4,h5,h6"),c=[],u=new Set,h=p=>{try{return String(p||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}},d=p=>{const f={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},y=p<=2?"has-text-weight-bold":p<=4?"has-text-weight-semibold":"has-text-weight-normal";return(f[p]+" "+y).trim()};o.forEach(p=>{try{const f=Number(p.tagName.substring(1)),y=(p.textContent||"").trim();let g=h(y)||"heading",m=g,b=2;for(;u.has(m);)m=g+"-"+b,b+=1;u.add(m),p.id=m,p.className=d(f),c.push({level:f,text:y,id:m})}catch{}});try{(l&&typeof l.getElementsByTagName=="function"?Array.from(l.getElementsByTagName("img")):l&&typeof l.querySelectorAll=="function"?Array.from(l.querySelectorAll("img")):[]).forEach(f=>{try{const y=f.getAttribute&&f.getAttribute("loading"),g=f.getAttribute&&f.getAttribute("data-want-lazy");!y&&!g&&f.setAttribute&&f.setAttribute("loading","lazy")}catch{}})}catch{}try{l.querySelectorAll("pre code, code[class]").forEach(p=>{try{const f=p.getAttribute&&p.getAttribute("class")||p.className||"",y=String(f||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(y)try{p.setAttribute&&p.setAttribute("class",y)}catch{p.className=y}else try{p.removeAttribute&&p.removeAttribute("class")}catch{p.className=""}}catch{}})}catch{}try{let p=null;try{typeof XMLSerializer<"u"?p=new XMLSerializer().serializeToString(l.body).replace(/^<body[^>]*>/i,"").replace(/<\/body>$/i,""):p=Array.from(l.body.childNodes||[]).map(y=>y&&typeof y.outerHTML=="string"?y.outerHTML:y&&typeof y.textContent=="string"?y.textContent:"").join("")}catch{try{p=l.body.innerHTML}catch{p=""}}return{html:p,meta:r||{},toc:c}}catch{return{html:"",meta:r||{},toc:c}}}}catch{}return{html:a,meta:r||{},toc:[]}}let t;if(typeof process<"u"&&process.env&&process.env.VITEST)try{const i=await Promise.resolve().then(()=>xa);t=i.initRendererWorker&&i.initRendererWorker()}catch{t=Yt&&Yt()}else t=Yt&&Yt();try{e=String(e||"").replace(/:([^:\s]+):/g,(i,r)=>Wr[r]||i)}catch{}try{if(typeof ze<"u"&&ze&&typeof ze.getLanguage=="function"&&ze.getLanguage("plaintext")&&/```\s*\n/.test(String(e||""))){let{content:i,data:r}=nr(e||"");try{i=String(i||"").replace(/:([^:\s]+):/g,(c,u)=>Wr[u]||c)}catch{}Ae.setOptions({gfm:!0,headerIds:!0,mangle:!1,highlighted:(c,u)=>{try{return u&&ze.getLanguage&&ze.getLanguage(u)?ze.highlight(c,{language:u}).value:ze&&typeof ze.getLanguage=="function"&&ze.getLanguage("plaintext")?ze.highlight(c,{language:"plaintext"}).value:c}catch{return c}}});let a=Ae.parse(i);try{a=a.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g,(c,u)=>{try{if(u&&ze&&typeof ze.highlight=="function")try{const h=ze.highlight(u,{language:"plaintext"});return`<pre><code>${h&&h.value?h.value:h}</code></pre>`}catch{try{if(ze&&typeof ze.highlightElement=="function"){const d={innerHTML:u};return ze.highlightElement(d),`<pre><code>${d.innerHTML}</code></pre>`}}catch{}}}catch{}return c})}catch{}const s=[],l=new Set,o=c=>{try{return String(c||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}};return a=a.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(c,u,h,d)=>{const p=Number(u),f=d.replace(/<[^>]+>/g,"").trim();let y=o(f)||"heading",g=y,m=2;for(;l.has(g);)g=y+"-"+m,m+=1;l.add(g),s.push({level:p,text:f,id:g});const b={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},w=p<=2?"has-text-weight-bold":p<=4?"has-text-weight-semibold":"has-text-weight-normal",k=(b[p]+" "+w).trim(),v=((h||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${g}" class="${k}"`).trim();return`<h${p} ${v}>${d}</h${p}>`}),a=a.replace(/<img([^>]*)>/g,(c,u)=>/\bloading=/.test(u)?`<img${u}>`:/\bdata-want-lazy=/.test(u)?`<img${u}>`:`<img${u} loading="lazy">`),{html:a,meta:r||{},toc:s}}}catch{}if(!t)throw new Error("renderer worker required but unavailable");const n=await Zr({type:"render",md:e});if(!n||typeof n!="object"||n.html===void 0)throw new Error("renderer worker returned invalid response");try{const i=new Map,r=[],a=o=>{try{return String(o||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}},s=o=>{const c={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},u=o<=2?"has-text-weight-bold":o<=4?"has-text-weight-semibold":"has-text-weight-normal";return(c[o]+" "+u).trim()};let l=n.html;l=l.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(o,c,u,h)=>{const d=Number(c),p=h.replace(/<[^>]+>/g,"").trim(),f=(u||"").match(/\sid="([^"]+)"/),y=f?f[1]:a(p)||"heading",m=(i.get(y)||0)+1;i.set(y,m);const b=m===1?y:y+"-"+m;r.push({level:d,text:p,id:b});const w=s(d),S=((u||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${b}" class="${w}"`).trim();return`<h${d} ${S}>${h}</h${d}>`});try{const o=typeof document<"u"&&document.documentElement&&document.documentElement.getAttribute&&document.documentElement.getAttribute("data-nimbi-logo-moved")||"";if(o){const c=He();if(c){const u=c.parseFromString(l,"text/html");(u&&typeof u.getElementsByTagName=="function"?Array.from(u.getElementsByTagName("img")):u&&typeof u.querySelectorAll=="function"?Array.from(u.querySelectorAll("img")):[]).forEach(d=>{try{const p=d.getAttribute("src")||"";(p?new URL(p,location.href).toString():"")===o&&d.remove()}catch{}});try{typeof XMLSerializer<"u"?l=new XMLSerializer().serializeToString(u.body).replace(/^<body[^>]*>/i,"").replace(/<\/body>$/i,""):l=Array.from(u.body.childNodes||[]).map(p=>p&&typeof p.outerHTML=="string"?p.outerHTML:p&&typeof p.textContent=="string"?p.textContent:"").join("")}catch{try{l=u.body.innerHTML}catch{}}}else try{const u=o.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");l=l.replace(new RegExp(`<img[^>]*src=\\"${u}\\"[^>]*>`,"g"),"")}catch{}}}catch{}return{html:l,meta:n.meta||{},toc:r}}catch{return{html:n.html,meta:n.meta||{},toc:n.toc||[]}}}function Cn(e,t){const n=new Set,i=/```\s*([a-zA-Z0-9_\-+]+)?/g,r=new Set(["then","now","if","once","so","and","or","but","when","the","a","an","as","let","const","var","export","import","from","true","false","null","npm","run","echo","sudo","this","that","have","using","some","return","returns","function","console","log","error","warn","class","new","undefined","with","select","from","where","join","on","group","order","by","having","as","into","values","like","limit","offset","create","table","index","view","insert","update","delete","returning","and","or","not","all","any","exists","case","when","then","else","end","distance","geometry","you","which","would","why","cool","other","same","everything","check"]),a=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);let s;for(;s=i.exec(e);)if(s[1]){const l=s[1].toLowerCase();if(wr.has(l)||t&&t.size&&l.length<3&&!t.has(l)&&!(ct&&ct[l]&&t.has(ct[l])))continue;if(t&&t.size){if(t.has(l)){const c=t.get(l);c&&n.add(c);continue}if(ct&&ct[l]){const c=ct[l];if(t.has(c)){const u=t.get(c)||c;n.add(u);continue}}}(a.has(l)||l.length>=5&&l.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(l)&&!r.has(l))&&n.add(l)}return n}async function Xr(e,t){if(_t&&_t.length||typeof process<"u"&&process.env&&process.env.VITEST)return Cn(e||"",t);if(Yt&&Yt())try{const i=t&&t.size?Array.from(t.keys()):[],r=await Zr({type:"detect",md:String(e||""),supported:i});if(Array.isArray(r))return new Set(r)}catch(i){_("[markdown] detectFenceLanguagesAsync worker failed",i)}return Cn(e||"",t)}const xa=Object.freeze(Object.defineProperty({__proto__:null,_sendToRenderer:Zr,addMarkdownExtension:Gr,detectFenceLanguages:Cn,detectFenceLanguagesAsync:Xr,initRendererWorker:Yt,markdownPlugins:_t,parseMarkdownToHtml:En,setMarkdownExtensions:il},Symbol.toStringTag,{value:"Module"})),al=`/**
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
`;onmessage=async e=>{const t=e.data||{};try{if(t.type==="rewriteAnchors"){const{id:n,html:i,contentBase:r,pagePath:a}=t;try{const s=He();if(!s)postMessage({id:n,result:i});else{const l=s.parseFromString(i||"","text/html"),o=l.body;await Kr(o,r,a,{canonical:!0}),postMessage({id:n,result:l.body.innerHTML})}}catch(s){postMessage({id:n,error:String(s)})}return}}catch(n){postMessage({id:t.id,error:String(n)})}};async function Sa(e){try{if(e&&e.type==="rewriteAnchors"){const{id:t,html:n,contentBase:i,pagePath:r}=e;try{const a=He();if(!a)return{id:t,result:n};const s=a.parseFromString(n||"","text/html"),l=s.body;return await Kr(l,i,r,{canonical:!0}),{id:t,result:s.body.innerHTML}}catch(a){return{id:t,error:String(a)}}}return{id:e&&e.id,error:"unsupported message"}}catch(t){return{id:e&&e.id,error:String(t)}}}const sl=Object.freeze(Object.defineProperty({__proto__:null,handleAnchorWorkerMessage:Sa},Symbol.toStringTag,{value:"Module"}));function ht(e,t=null){try{const n=typeof location<"u"&&location&&typeof location.pathname=="string"&&location.pathname||"/";return String(n)+Ei(e,t)}catch{return Ei(e,t)}}function ol(...e){try{_(...e)}catch{}}function ar(e){try{if(Ft(3))return!0}catch{}try{if(typeof oe=="string"&&oe)return!0}catch{}try{if(ee&&ee.size)return!0}catch{}try{if(Pe&&Pe.size)return!0}catch{}return!1}function kt(e,t){try{if(typeof nt=="function")try{nt(e,t);return}catch{}}catch{}try{e&&t&&ee&&typeof ee.set=="function"&&!ee.has(e)&&ee.set(e,t)}catch{}try{t&&Z&&typeof Z.set=="function"&&Z.set(t,e)}catch{}try{if(Pe&&typeof Pe.has=="function"){if(!Pe.has(t)){try{Pe.add(t)}catch{}try{Array.isArray(Ie)&&!Ie.includes(t)&&Ie.push(t)}catch{}}}else try{Array.isArray(Ie)&&!Ie.includes(t)&&Ie.push(t)}catch{}}catch{}}function ll(e,t){try{return new URL(e,t).pathname}catch{try{return new URL(e,typeof location<"u"?location.href:"http://localhost/").pathname}catch{try{return(String(t||"").replace(/\/$/,"")+"/"+String(e||"").replace(/^\//,"")).replace(/\/\\+/g,"/")}catch{return String(e||"")}}}}function cl(e,t){const n=document.createElement("aside");n.className="menu box nimbi-nav";const i=document.createElement("p");i.className="menu-label",i.textContent=e("navigation"),n.appendChild(i);const r=document.createElement("ul");r.className="menu-list";try{const a=document.createDocumentFragment();t.forEach(s=>{const l=document.createElement("li"),o=document.createElement("a");try{const c=String(s.path||"");try{o.setAttribute("href",$e(c))}catch{c&&c.indexOf("/")===-1?o.setAttribute("href","#"+encodeURIComponent(c)):o.setAttribute("href",ht(c))}}catch{o.setAttribute("href","#"+s.path)}if(o.textContent=s.name,l.appendChild(o),s.children&&s.children.length){const c=document.createElement("ul");s.children.forEach(u=>{const h=document.createElement("li"),d=document.createElement("a");try{const p=String(u.path||"");try{d.setAttribute("href",$e(p))}catch{p&&p.indexOf("/")===-1?d.setAttribute("href","#"+encodeURIComponent(p)):d.setAttribute("href",ht(p))}}catch{d.setAttribute("href","#"+u.path)}d.textContent=u.name,h.appendChild(d),c.appendChild(h)}),l.appendChild(c)}a.appendChild(l)}),r.appendChild(a)}catch{t.forEach(s=>{try{const l=document.createElement("li"),o=document.createElement("a");try{const c=String(s.path||"");try{o.setAttribute("href",$e(c))}catch{c&&c.indexOf("/")===-1?o.setAttribute("href","#"+encodeURIComponent(c)):o.setAttribute("href",ht(c))}}catch{o.setAttribute("href","#"+s.path)}if(o.textContent=s.name,l.appendChild(o),s.children&&s.children.length){const c=document.createElement("ul");s.children.forEach(u=>{const h=document.createElement("li"),d=document.createElement("a");try{const p=String(u.path||"");try{d.setAttribute("href",$e(p))}catch{p&&p.indexOf("/")===-1?d.setAttribute("href","#"+encodeURIComponent(p)):d.setAttribute("href",ht(p))}}catch{d.setAttribute("href","#"+u.path)}d.textContent=u.name,h.appendChild(d),c.appendChild(h)}),l.appendChild(c)}r.appendChild(l)}catch(l){_("[htmlBuilder] createNavTree item failed",l)}})}return n.appendChild(r),n}function ul(e,t,n=""){const i=document.createElement("aside");i.className="menu box nimbi-toc-inner is-hidden-mobile";const r=document.createElement("p");r.className="menu-label",r.textContent=e("onThisPage"),i.appendChild(r);const a=document.createElement("ul");a.className="menu-list";try{const l={};(t||[]).forEach(o=>{try{if(!o||o.level===1)return;const c=Number(o.level)>=2?Number(o.level):2,u=document.createElement("li"),h=document.createElement("a"),d=ms(o.text||""),p=o.id||de(d);h.textContent=d;try{const m=String(n||"").replace(/^[\\.\\/]+/,""),b=m&&Z&&Z.has&&Z.has(m)?Z.get(m):m;b?h.href=$e(b,p):h.href=`#${encodeURIComponent(p)}`}catch(m){_("[htmlBuilder] buildTocElement href normalization failed",m),h.href=`#${encodeURIComponent(p)}`}if(u.appendChild(h),c===2){a.appendChild(u),l[2]=u,Object.keys(l).forEach(m=>{Number(m)>2&&delete l[m]});return}let f=c-1;for(;f>2&&!l[f];)f--;f<2&&(f=2);let y=l[f];if(!y){a.appendChild(u),l[c]=u;return}let g=y.querySelector("ul");g||(g=document.createElement("ul"),y.appendChild(g)),g.appendChild(u),l[c]=u}catch(c){_("[htmlBuilder] buildTocElement item failed",c,o)}})}catch(l){_("[htmlBuilder] buildTocElement failed",l)}return i.appendChild(a),a.querySelectorAll("li").length<=1?null:i}function va(e){e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(n=>{n.id||(n.id=de(n.textContent||""))})}function hl(e,t,n){try{const i=e.querySelectorAll("img");if(i&&i.length){const r=t&&t.includes("/")?t.substring(0,t.lastIndexOf("/")+1):"";i.forEach(a=>{const s=a.getAttribute("src")||"";if(s&&!(/^(https?:)?\/\//.test(s)||s.startsWith("/")))try{const l=new URL(r+s,n).toString();a.src=l;try{a.getAttribute("loading")||a.setAttribute("data-want-lazy","1")}catch(o){_("[htmlBuilder] set image loading attribute failed",o)}}catch(l){_("[htmlBuilder] resolve image src failed",l)}})}}catch(i){_("[htmlBuilder] lazyLoadImages failed",i)}}function Aa(e,t,n){try{const i=t&&t.includes("/")?t.substring(0,t.lastIndexOf("/")+1):"";let r=null;try{const l=new URL(n,location.href);r=new URL(i||".",l).toString()}catch{try{r=new URL(i||".",location.href).toString()}catch{r=i||"./"}}let a=null;try{a=e.querySelectorAll("[src],[href],[srcset],[poster]")}catch{const o=[];try{o.push(...Array.from(e.getElementsByTagName("img")||[]))}catch{}try{o.push(...Array.from(e.getElementsByTagName("link")||[]))}catch{}try{o.push(...Array.from(e.getElementsByTagName("video")||[]))}catch{}try{o.push(...Array.from(e.getElementsByTagName("use")||[]))}catch{}try{o.push(...Array.from(e.querySelectorAll("[srcset]")||[]))}catch{}a=o}let s=Array.from(a||[]);try{const l=Array.from(e.getElementsByTagName("use")||[]);for(const o of l)s.indexOf(o)===-1&&s.push(o)}catch{}for(const l of Array.from(s||[]))try{const o=l.tagName?l.tagName.toLowerCase():"",c=u=>{try{const h=l.getAttribute(u)||"";if(!h||/^(https?:)?\/\//i.test(h)||h.startsWith("/")||h.startsWith("#"))return;try{l.setAttribute(u,new URL(h,r).toString())}catch(d){_("[htmlBuilder] rewrite asset attribute failed",u,h,d)}}catch(h){_("[htmlBuilder] rewriteAttr failed",h)}};if(l.hasAttribute&&l.hasAttribute("src")&&c("src"),l.hasAttribute&&l.hasAttribute("href")&&o!=="a"&&c("href"),l.hasAttribute&&l.hasAttribute("xlink:href")&&c("xlink:href"),l.hasAttribute&&l.hasAttribute("poster")&&c("poster"),l.hasAttribute&&l.hasAttribute("srcset")){const d=(l.getAttribute("srcset")||"").split(",").map(p=>p.trim()).filter(Boolean).map(p=>{const[f,y]=p.split(/\s+/,2);if(!f||/^(https?:)?\/\//i.test(f)||f.startsWith("/"))return p;try{const g=new URL(f,r).toString();return y?`${g} ${y}`:g}catch{return p}}).join(", ");l.setAttribute("srcset",d)}}catch(o){_("[htmlBuilder] rewriteRelativeAssets node processing failed",o)}}catch(i){_("[htmlBuilder] rewriteRelativeAssets failed",i)}}let Ea="",Qr=null,Ca="";async function Kr(e,t,n,i={}){try{i=i||{},typeof i.canonical>"u"&&(i.canonical=!0);const r=e.querySelectorAll("a");if(!r||!r.length)return;let a,s;if(t===Ea&&Qr)a=Qr,s=Ca;else{try{a=new URL(t,location.href),s=Zt(a.pathname)}catch{try{a=new URL(t,location.href),s=Zt(a.pathname)}catch{a=null,s="/"}}Ea=t,Qr=a,Ca=s}const l=new Set,o=[],c=new Set,u=[];for(const h of Array.from(r))try{try{if(h.closest&&h.closest("h1,h2,h3,h4,h5,h6"))continue}catch{}const d=h.getAttribute("href")||"";if(!d||Ar(d))continue;try{if(d.startsWith("?")||d.indexOf("?")!==-1)try{const f=new URL(d,t||location.href),y=f.searchParams.get("page");if(y&&y.indexOf("/")===-1&&n){const g=n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"";if(g){const m=V(g+y),b=i&&i.canonical?$e(m,f.hash?f.hash.replace(/^#/,""):null):ht(m,f.hash?f.hash.replace(/^#/,""):null);h.setAttribute("href",b);continue}}}catch{}}catch{}if(d.startsWith("/")&&!d.endsWith(".md"))continue;const p=d.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(p){let f=p[1];const y=p[2];!f.startsWith("/")&&n&&(f=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+f);try{const g=new URL(f,t).pathname;let m=g.startsWith(s)?g.slice(s.length):g;m=V(m),o.push({node:h,mdPathRaw:f,frag:y,rel:m}),Z.has(m)||l.add(m)}catch(g){_("[htmlBuilder] resolve mdPath failed",g)}continue}try{let f=d;!d.startsWith("/")&&n&&(d.startsWith("#")?f=n+d:f=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+d);const g=new URL(f,t).pathname||"";if(g&&g.indexOf(s)!==-1){let m=g.startsWith(s)?g.slice(s.length):g;if(m=V(m),m=rn(m),m||(m=Lr),!m.endsWith(".md")){let b=null;try{if(Z&&Z.has&&Z.has(m))b=Z.get(m);else try{const w=String(m||"").replace(/^.*\//,"");w&&Z.has&&Z.has(w)&&(b=Z.get(w))}catch(w){_("[htmlBuilder] mdToSlug baseName check failed",w)}}catch(w){_("[htmlBuilder] mdToSlug access check failed",w)}if(!b)try{const w=String(m||"").replace(/^.*\//,"");for(const[k,S]of ee||[])if(S===m||S===w){b=k;break}}catch{}if(b){const w=i&&i.canonical?$e(b,null):ht(b);h.setAttribute("href",w)}else{let w=m;try{/\.[^\/]+$/.test(String(m||""))||(w=String(m||"")+".html")}catch{w=m}c.add(w),u.push({node:h,rel:w})}}}}catch(f){_("[htmlBuilder] resolving href to URL failed",f)}}catch(d){_("[htmlBuilder] processing anchor failed",d)}if(l.size)if(ar(t))await hn(Array.from(l),async h=>{try{try{const p=String(h).match(/([^\/]+)\.md$/),f=p&&p[1];if(f&&ee.has(f)){try{const y=ee.get(f);if(y)try{const g=typeof y=="string"?y:y&&y.default?y.default:null;g&&kt(f,g)}catch(g){_("[htmlBuilder] _storeSlugMapping failed",g)}}catch(y){_("[htmlBuilder] reading slugToMd failed",y)}return}}catch(p){_("[htmlBuilder] basename slug lookup failed",p)}const d=await Ce(h,t);if(d&&d.raw){const p=(d.raw||"").match(/^#\s+(.+)$/m);if(p&&p[1]){const f=de(p[1].trim());if(f)try{kt(f,h)}catch(y){_("[htmlBuilder] setting slug mapping failed",y)}}}}catch(d){_("[htmlBuilder] fetchMarkdown during rewriteAnchors failed",d)}},6);else{try{_("[htmlBuilder] skipping md title probes (probing disabled)")}catch{}for(const h of Array.from(l))try{const d=String(h).match(/([^\/]+)\.md$/),p=d&&d[1];if(p){const f=de(p);if(f)try{kt(f,h)}catch(y){_("[htmlBuilder] setting fallback slug mapping failed",y)}}}catch{}}if(c.size)if(ar(t))await hn(Array.from(c),async h=>{try{const d=await Ce(h,t);if(d&&d.raw)try{const p=He(),f=p?p.parseFromString(d.raw,"text/html"):null,y=f?f.querySelector("title"):null,g=f?f.querySelector("h1"):null,m=y&&y.textContent&&y.textContent.trim()?y.textContent.trim():g&&g.textContent?g.textContent.trim():null;if(m){const b=de(m);if(b)try{kt(b,h)}catch(w){_("[htmlBuilder] setting html slug mapping failed",w)}}}catch(p){_("[htmlBuilder] parse fetched HTML failed",p)}}catch(d){_("[htmlBuilder] fetchMarkdown for htmlPending failed",d)}},5);else{try{_("[htmlBuilder] skipping html title probes (probing disabled)")}catch{}for(const h of Array.from(c))try{const d=String(h).match(/([^\/]+)\.html$/),p=d&&d[1];if(p){const f=de(p);if(f)try{kt(f,h)}catch(y){_("[htmlBuilder] setting fallback html slug mapping failed",y)}}}catch{}}for(const h of o){const{node:d,frag:p,rel:f}=h;let y=null;try{Z.has(f)&&(y=Z.get(f))}catch(g){_("[htmlBuilder] mdToSlug access failed",g)}if(y){const g=i&&i.canonical?$e(y,p):ht(y,p);d.setAttribute("href",g)}else{const g=i&&i.canonical?$e(f,p):ht(f,p);d.setAttribute("href",g)}}for(const h of u){const{node:d,rel:p}=h;let f=null;try{Z.has(p)&&(f=Z.get(p))}catch(y){_("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo",y)}if(!f)try{const y=String(p||"").replace(/^.*\//,"");Z.has(y)&&(f=Z.get(y))}catch(y){_("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo",y)}if(f){const y=i&&i.canonical?$e(f,null):ht(f);d.setAttribute("href",y)}else{const y=i&&i.canonical?$e(p,null):ht(p);d.setAttribute("href",y)}}}catch(r){_("[htmlBuilder] rewriteAnchors failed",r)}}function dl(e,t,n,i){const r=t.querySelector("h1"),a=r?(r.textContent||"").trim():"";let s="";try{let l="";try{e&&e.meta&&e.meta.title&&(l=String(e.meta.title).trim())}catch{}if(!l&&a&&(l=a),!l)try{const o=t.querySelector("h2");o&&o.textContent&&(l=String(o.textContent).trim())}catch{}!l&&n&&(l=String(n)),l&&(s=de(l)),s||(s=Lr);try{if(n)try{kt(s,n)}catch(o){_("[htmlBuilder] computeSlug set slug mapping failed",o)}}catch(o){_("[htmlBuilder] computeSlug set slug mapping failed",o)}try{let o=i||"";if(!o)try{const c=et(typeof location<"u"?location.href:"");c&&c.anchor&&c.page&&String(c.page)===String(s)?o=c.anchor:o=""}catch{o=""}try{history.replaceState({page:s},"",ht(s,o))}catch(c){_("[htmlBuilder] computeSlug history replace failed",c)}}catch(o){_("[htmlBuilder] computeSlug inner failed",o)}}catch(l){_("[htmlBuilder] computeSlug failed",l)}try{if(e&&e.meta&&e.meta.title&&r){const l=String(e.meta.title).trim();if(l&&l!==a){try{s&&(r.id=s)}catch{}try{if(Array.isArray(e.toc))for(const o of e.toc)try{if(o&&Number(o.level)===1&&String(o.text).trim()===(a||"").trim()){o.id=s;break}}catch{}}catch{}}}}catch{}return{topH1:r,h1Text:a,slugKey:s}}async function fl(e,t){if(!e||!e.length)return;const n=new Set;for(const s of Array.from(e||[]))try{const l=s.getAttribute("href")||"";if(!l)continue;let u=V(l).split(/::|#/,2)[0];try{const d=u.indexOf("?");d!==-1&&(u=u.slice(0,d))}catch{}if(!u||(u.includes(".")||(u=u+".html"),!/\.html(?:$|[?#])/.test(u)&&!u.toLowerCase().endsWith(".html")))continue;const h=u;try{if(Z&&Z.has&&Z.has(h))continue}catch(d){_("[htmlBuilder] mdToSlug check failed",d)}try{let d=!1;for(const p of ee.values())if(p===h){d=!0;break}if(d)continue}catch(d){_("[htmlBuilder] slugToMd iteration failed",d)}n.add(h)}catch(l){_("[htmlBuilder] preScanHtmlSlugs anchor iteration failed",l)}if(!n.size)return;if(!ar()){try{_("[htmlBuilder] skipping preScanHtmlSlugs (probing disabled)")}catch{}for(const s of Array.from(n))try{const l=String(s).match(/([^\/]+)\.html$/),o=l&&l[1];if(o){const c=de(o);if(c)try{kt(c,s)}catch(u){_("[htmlBuilder] setting fallback preScanHtmlSlugs mapping failed",u)}}}catch{}return}const i=async s=>{try{const l=await Ce(s,t);if(l&&l.raw)try{const c=He().parseFromString(l.raw,"text/html"),u=c.querySelector("title"),h=c.querySelector("h1"),d=u&&u.textContent&&u.textContent.trim()?u.textContent.trim():h&&h.textContent?h.textContent.trim():null;if(d){const p=de(d);if(p)try{kt(p,s)}catch(f){_("[htmlBuilder] set slugToMd/mdToSlug failed",f)}}}catch(o){_("[htmlBuilder] parse HTML title failed",o)}}catch(l){_("[htmlBuilder] fetchAndExtract failed",l)}},r=Array.from(n),a=Math.max(1,Math.min(pn(),r.length||1));await hn(r,i,a)}async function pl(e,t){if(!e||!e.length)return;const n=[],i=new Set;let r="";try{const a=new URL(t,typeof location<"u"?location.href:"http://localhost/");r=Zt(a.pathname)}catch(a){r="",_("[htmlBuilder] preMapMdSlugs parse base failed",a)}for(const a of Array.from(e||[]))try{const s=a.getAttribute("href")||"";if(!s)continue;const l=s.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(l){let o=V(l[1]);try{let c;try{c=ll(o,t)}catch(h){c=o,_("[htmlBuilder] resolve mdPath URL failed",h)}const u=c&&r&&c.startsWith(r)?c.slice(r.length):String(c||"").replace(/^\//,"");n.push({rel:u}),Z.has(u)||i.add(u)}catch(c){_("[htmlBuilder] rewriteAnchors failed",c)}continue}}catch(s){_("[htmlBuilder] preMapMdSlugs anchor iteration failed",s)}if(i.size)if(ar())await Promise.all(Array.from(i).map(async a=>{try{const s=String(a).match(/([^\/]+)\.md$/),l=s&&s[1];if(l&&ee.has(l)){try{const o=ee.get(l);if(o)try{const c=typeof o=="string"?o:o&&o.default?o.default:null;c&&kt(l,c)}catch(c){_("[htmlBuilder] _storeSlugMapping failed",c)}}catch(o){_("[htmlBuilder] preMapMdSlugs slug map access failed",o)}return}}catch(s){_("[htmlBuilder] preMapMdSlugs basename check failed",s)}try{const s=await Ce(a,t);if(s&&s.raw){const l=(s.raw||"").match(/^#\s+(.+)$/m);if(l&&l[1]){const o=de(l[1].trim());if(o)try{kt(o,a)}catch(c){_("[htmlBuilder] preMapMdSlugs setting slug mapping failed",c)}}}}catch(s){_("[htmlBuilder] preMapMdSlugs fetch failed",s)}}));else try{_("[htmlBuilder] skipping preMapMdSlugs probes (probing disabled)")}catch{}}He();function Yr(e){try{const n=He().parseFromString(e||"","text/html");va(n);try{n.querySelectorAll("img").forEach(o=>{try{o.getAttribute("loading")||o.setAttribute("data-want-lazy","1")}catch(c){_("[htmlBuilder] parseHtml set image loading attribute failed",c)}})}catch(l){_("[htmlBuilder] parseHtml query images failed",l)}n.querySelectorAll("pre code, code[class]").forEach(l=>{try{const o=l.getAttribute&&l.getAttribute("class")||l.className||"",c=o.match(/language-([a-zA-Z0-9_+-]+)/)||o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(c&&c[1]){const u=(c[1]||"").toLowerCase(),h=ve.size&&(ve.get(u)||ve.get(String(u).toLowerCase()))||u;try{(async()=>{try{await Jt(h)}catch(d){_("[htmlBuilder] registerLanguage failed",d)}})()}catch(d){_("[htmlBuilder] schedule registerLanguage failed",d)}}else try{if(ze&&typeof ze.getLanguage=="function"&&ze.getLanguage("plaintext")){const u=ze.highlight?ze.highlight(l.textContent||"",{language:"plaintext"}):null;if(u&&u.value)try{if(typeof document<"u"&&document.createRange&&typeof document.createRange=="function"){const h=document.createRange().createContextualFragment(u.value);if(typeof l.replaceChildren=="function")l.replaceChildren(...Array.from(h.childNodes));else{for(;l.firstChild;)l.removeChild(l.firstChild);l.appendChild(h)}}else l.innerHTML=u.value}catch{try{l.innerHTML=u.value}catch{}}}}catch(u){_("[htmlBuilder] plaintext highlight fallback failed",u)}}catch(o){_("[htmlBuilder] code element processing failed",o)}});const r=[];n.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(l=>{r.push({level:Number(l.tagName.substring(1)),text:(l.textContent||"").trim(),id:l.id})});const s={};try{const l=n.querySelector("title");l&&l.textContent&&String(l.textContent).trim()&&(s.title=String(l.textContent).trim())}catch{}return{html:n.body.innerHTML,meta:s,toc:r}}catch(t){return _("[htmlBuilder] parseHtml failed",t),{html:e||"",meta:{},toc:[]}}}async function gl(e){const t=Xr?await Xr(e||"",ve):Cn(e||"",ve),n=new Set(t),i=[];for(const r of n)try{const a=ve.size&&(ve.get(r)||ve.get(String(r).toLowerCase()))||r;try{i.push(Jt(a))}catch(s){_("[htmlBuilder] ensureLanguages push canonical failed",s)}if(String(r)!==String(a))try{i.push(Jt(r))}catch(s){_("[htmlBuilder] ensureLanguages push alias failed",s)}}catch(a){_("[htmlBuilder] ensureLanguages inner failed",a)}try{await Promise.all(i)}catch(r){_("[htmlBuilder] ensureLanguages failed",r)}}async function ml(e){if(await gl(e),En){const t=await En(e||"");return!t||typeof t!="object"?{html:String(e||""),meta:{},toc:[]}:(Array.isArray(t.toc)||(t.toc=[]),t.meta||(t.meta={}),t)}return{html:String(e||""),meta:{},toc:[]}}async function yl(e,t,n,i,r){let a=null;if(t.isHtml)try{const h=He();if(h){const d=h.parseFromString(t.raw||"","text/html");try{Aa(d.body,n,r)}catch(p){_("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)",p)}a=Yr(d.documentElement&&d.documentElement.outerHTML?d.documentElement.outerHTML:t.raw||"")}else a=Yr(t.raw||"")}catch{a=Yr(t.raw||"")}else a=await ml(t.raw||"");const s=document.createElement("article");s.className="nimbi-article content";try{const h=He&&He();if(h){const d=h.parseFromString(String(a.html||""),"text/html"),p=Array.from(d.body.childNodes||[]);p.length?s.replaceChildren(...p):s.innerHTML=a.html}else try{const d=document&&typeof document.createRange=="function"?document.createRange():null;if(d&&typeof d.createContextualFragment=="function"){const p=d.createContextualFragment(String(a.html||""));s.replaceChildren(...Array.from(p.childNodes))}else s.innerHTML=a.html}catch{s.innerHTML=a.html}}catch{try{s.innerHTML=a.html}catch(d){_("[htmlBuilder] set article html failed",d)}}try{Aa(s,n,r)}catch(h){_("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle",h)}try{va(s)}catch(h){_("[htmlBuilder] addHeadingIds failed",h)}try{s.querySelectorAll("pre code, code[class]").forEach(d=>{try{const p=d.getAttribute&&d.getAttribute("class")||d.className||"",f=String(p||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(f)try{d.setAttribute&&d.setAttribute("class",f)}catch(y){d.className=f,_("[htmlBuilder] set element class failed",y)}else try{d.removeAttribute&&d.removeAttribute("class")}catch(y){d.className="",_("[htmlBuilder] remove element class failed",y)}}catch(p){_("[htmlBuilder] code element cleanup failed",p)}})}catch(h){_("[htmlBuilder] processing code elements failed",h)}try{ki(s)}catch(h){_("[htmlBuilder] observeCodeBlocks failed",h)}hl(s,n,r);try{(s.querySelectorAll&&s.querySelectorAll("img")||[]).forEach(d=>{try{const p=d.parentElement;if(!p||p.tagName.toLowerCase()!=="p"||p.childNodes.length!==1)return;const f=document.createElement("figure");f.className="image",p.replaceWith(f),f.appendChild(d)}catch{}})}catch(h){_("[htmlBuilder] wrap images in Bulma image helper failed",h)}try{(s.querySelectorAll&&s.querySelectorAll("table")||[]).forEach(d=>{try{if(d.classList)d.classList.contains("table")||d.classList.add("table");else{const p=d.getAttribute&&d.getAttribute("class")?d.getAttribute("class"):"",f=String(p||"").split(/\s+/).filter(Boolean);f.indexOf("table")===-1&&f.push("table");try{d.setAttribute&&d.setAttribute("class",f.join(" "))}catch{d.className=f.join(" ")}}}catch{}})}catch(h){_("[htmlBuilder] add Bulma table class failed",h)}const{topH1:l,h1Text:o,slugKey:c}=dl(a,s,n,i);try{if(l&&a&&a.meta&&(a.meta.author||a.meta.date)&&!(l.parentElement&&l.parentElement.querySelector&&l.parentElement.querySelector(".nimbi-article-subtitle"))){const d=a.meta.author?String(a.meta.author).trim():"",p=a.meta.date?String(a.meta.date).trim():"";let f="";try{const g=new Date(p);p&&!isNaN(g.getTime())?f=g.toLocaleDateString():f=p}catch{f=p}const y=[];if(d&&y.push(d),f&&y.push(f),y.length){const g=document.createElement("p"),m=y[0]?String(y[0]).replace(/"/g,"").trim():"",b=y.slice(1);if(g.className="nimbi-article-subtitle is-6 has-text-grey-light",m){const w=document.createElement("span");w.className="nimbi-article-author",w.textContent=m,g.appendChild(w)}if(b.length){const w=document.createElement("span");w.className="nimbi-article-meta",w.textContent=b.join(" • "),g.appendChild(w)}try{l.parentElement.insertBefore(g,l.nextSibling)}catch{try{l.insertAdjacentElement("afterend",g)}catch{}}}}}catch{}try{await kl(s,r,n)}catch(h){ol("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread",h),await Kr(s,r,n)}const u=ul(e,a.toc,n);return{article:s,parsed:a,toc:u,topH1:l,h1Text:o,slugKey:c}}function bl(e){if(!(!e||!e.querySelectorAll))try{const t=Array.from(e.querySelectorAll("script"));for(const n of t)try{const i=document.createElement("script");for(const a of Array.from(n.attributes||[]))try{i.setAttribute(a.name,a.value)}catch{}if(!n.src){const a=n.textContent||"";let s=!1;try{new Function(a)(),s=!0}catch{s=!1}if(s){n.parentNode&&n.parentNode.removeChild(n);try{Lt("[htmlBuilder] executed inline script via Function")}catch{}continue}try{i.type="module"}catch{}i.textContent=a}if(n.src)try{if(document.querySelector&&document.querySelector(`script[src="${n.src}"]`)){n.parentNode&&n.parentNode.removeChild(n);continue}}catch{}const r=n.src||"<inline>";i.addEventListener("error",a=>{try{_("[htmlBuilder] injected script error",{src:r,ev:a})}catch{}}),i.addEventListener("load",()=>{try{Lt("[htmlBuilder] injected script loaded",{src:r,hasNimbi:!!(window&&window.nimbiCMS)})}catch{}});try{(document.head||document.body||document.documentElement).appendChild(i)}catch{try{try{i.type="text/javascript"}catch{}(document.head||document.body||document.documentElement).appendChild(i)}catch(s){try{_("[htmlBuilder] injected script append failed, skipping",{src:r,err:s})}catch{}}}n.parentNode&&n.parentNode.removeChild(n);try{Lt("[htmlBuilder] executed injected script",r)}catch{}}catch(i){_("[htmlBuilder] execute injected script failed",i)}}catch{}}function Ma(e,t,n){if(e)try{typeof e.replaceChildren=="function"?e.replaceChildren():e.innerHTML=""}catch{try{e.innerHTML=""}catch{}}const i=document.createElement("article");i.className="nimbi-article content nimbi-not-found";const r=document.createElement("h1");r.textContent=t&&t("notFound")||"Page not found";const a=document.createElement("p");a.textContent=n&&n.message?String(n.message):"Failed to resolve the requested page.",i.appendChild(r),i.appendChild(a),e&&e.appendChild&&e.appendChild(i);try{if(!oe)try{const s=document.createElement("p"),l=t&&t("goHome")||"Go back to";s.textContent=l+" ";const o=document.createElement("a");try{o.href=$e(yt)}catch{o.href=$e(yt||"")}o.textContent=t&&t("home")||"Home",s.appendChild(o),e&&e.appendChild&&e.appendChild(s)}catch{}}catch{}try{try{Qn({title:t&&t("notFound")||"Not Found",description:t&&t("notFoundDescription")||""},oe,t&&t("notFound")||"Not Found",t&&t("notFoundDescription")||"")}catch{}}catch{}try{try{const s=typeof window<"u"&&window.__nimbiNotFoundRedirect?String(window.__nimbiNotFoundRedirect).trim():null;if(s)try{const l=new URL(s,location.origin).toString();if((location.href||"").split("#")[0]!==l)try{location.replace(l)}catch{location.href=l}}catch{}}catch{}}catch{}}const La=ds(al,sl&&Sa,"anchor");function wl(){return La.get()}function _l(e){return La.send(e,2e3)}async function kl(e,t,n){if(!wl())throw new Error("anchor worker unavailable");if(!e||typeof e.innerHTML!="string")throw new Error("invalid article element");const r=String(e.innerHTML),a=await _l({type:"rewriteAnchors",html:r,contentBase:t,pagePath:n});if(a&&typeof a=="string")try{const s=He&&He();if(s){const l=s.parseFromString(String(a||""),"text/html"),o=Array.from(l.body.childNodes||[]);o.length?e.replaceChildren(...o):e.innerHTML=a}else try{const l=document&&typeof document.createRange=="function"?document.createRange():null;if(l&&typeof l.createContextualFragment=="function"){const o=l.createContextualFragment(String(a||""));e.replaceChildren(...Array.from(o.childNodes))}else e.innerHTML=a}catch{e.innerHTML=a}}catch(s){_("[htmlBuilder] applying rewritten anchors failed",s)}}function xl(e){try{e.addEventListener("click",t=>{const n=t.target&&t.target.closest?t.target.closest("a"):null;if(!n)return;const i=n.getAttribute("href")||"";try{const r=et(i),a=r&&r.page?r.page:null,s=r&&r.anchor?r.anchor:null;if(!a&&!s)return;t.preventDefault();let l=null;try{history&&history.state&&history.state.page&&(l=history.state.page)}catch(o){l=null,_("[htmlBuilder] access history.state failed",o)}try{l||(l=new URL(location.href).searchParams.get("page"))}catch(o){_("[htmlBuilder] parse current location failed",o)}if(!a&&s||a&&l&&String(a)===String(l)){try{if(!a&&s)try{history.replaceState(history.state,"",(location.pathname||"")+(location.search||"")+(s?"#"+encodeURIComponent(s):""))}catch(o){_("[htmlBuilder] history.replaceState failed",o)}else try{history.replaceState({page:l||a},"",ht(l||a,s))}catch(o){_("[htmlBuilder] history.replaceState failed",o)}}catch(o){_("[htmlBuilder] update history for anchor failed",o)}try{t.stopImmediatePropagation&&t.stopImmediatePropagation(),t.stopPropagation&&t.stopPropagation()}catch(o){_("[htmlBuilder] stopPropagation failed",o)}try{Vr(s)}catch(o){_("[htmlBuilder] scrollToAnchorOrTop failed",o)}return}history.pushState({page:a},"",ht(a,s));try{if(typeof window<"u"&&typeof window.renderByQuery=="function")try{window.renderByQuery()}catch(o){_("[htmlBuilder] window.renderByQuery failed",o)}else if(typeof window<"u")try{window.dispatchEvent(new PopStateEvent("popstate"))}catch(o){_("[htmlBuilder] dispatch popstate failed",o)}else try{renderByQuery()}catch(o){_("[htmlBuilder] renderByQuery failed",o)}}catch(o){_("[htmlBuilder] SPA navigation invocation failed",o)}}catch(r){_("[htmlBuilder] non-URL href in attachTocClickHandler",r)}})}catch(t){_("[htmlBuilder] attachTocClickHandler failed",t)}}function Vr(e){const t=document.querySelector(".nimbi-cms")||null;if(e){const n=document.getElementById(e);if(n)try{const i=()=>{try{if(t&&t.scrollTo&&t.contains(n)){const r=n.getBoundingClientRect().top-t.getBoundingClientRect().top+t.scrollTop;t.scrollTo({top:r,behavior:"smooth"})}else try{n.scrollIntoView({behavior:"smooth",block:"start"})}catch{try{n.scrollIntoView()}catch(a){_("[htmlBuilder] scrollIntoView failed",a)}}}catch{try{n.scrollIntoView()}catch(a){_("[htmlBuilder] final scroll fallback failed",a)}}};try{requestAnimationFrame(()=>setTimeout(i,50))}catch(r){_("[htmlBuilder] scheduling scroll failed",r),setTimeout(i,50)}}catch(i){try{n.scrollIntoView()}catch(r){_("[htmlBuilder] final scroll fallback failed",r)}_("[htmlBuilder] doScroll failed",i)}}else try{t&&t.scrollTo?t.scrollTo({top:0,behavior:"smooth"}):window.scrollTo(0,0)}catch(n){try{window.scrollTo(0,0)}catch(i){_("[htmlBuilder] window.scrollTo failed",i)}_("[htmlBuilder] scroll to top failed",n)}}function Sl(e,t,{mountOverlay:n=null,container:i=null,mountEl:r=null,navWrap:a=null,t:s=null}={}){try{const l=s||(y=>typeof y=="string"?y:""),o=i||document.querySelector(".nimbi-cms"),c=r||document.querySelector(".nimbi-mount"),u=n||document.querySelector(".nimbi-overlay"),h=a||document.querySelector(".nimbi-nav-wrap");let p=document.querySelector(".nimbi-scroll-top");if(!p){p=document.createElement("button"),p.className="nimbi-scroll-top button is-primary is-rounded is-small",p.setAttribute("aria-label",l("scrollToTop")),p.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';try{u&&u.appendChild?u.appendChild(p):o&&o.appendChild?o.appendChild(p):c&&c.appendChild?c.appendChild(p):document.body.appendChild(p)}catch{try{document.body.appendChild(p)}catch(g){_("[htmlBuilder] append scroll top button failed",g)}}try{try{vi(p)}catch{}}catch(y){_("[htmlBuilder] set scroll-top button theme registration failed",y)}p.addEventListener("click",()=>{try{i&&i.scrollTo?i.scrollTo({top:0,left:0,behavior:"smooth"}):r&&r.scrollTo?r.scrollTo({top:0,left:0,behavior:"smooth"}):window.scrollTo({top:0,left:0,behavior:"smooth"})}catch{try{i&&(i.scrollTop=0)}catch(g){_("[htmlBuilder] fallback container scrollTop failed",g)}try{r&&(r.scrollTop=0)}catch(g){_("[htmlBuilder] fallback mountEl scrollTop failed",g)}try{document.documentElement.scrollTop=0}catch(g){_("[htmlBuilder] fallback document scrollTop failed",g)}}})}const f=h&&h.querySelector?h.querySelector(".menu-label"):null;if(t){if(!p._nimbiObserver)if(typeof globalThis<"u"&&typeof globalThis.IntersectionObserver<"u"){const y=globalThis.IntersectionObserver,g=new y(m=>{for(const b of m)b.target instanceof Element&&(b.isIntersecting?(p.classList.remove("show"),f&&f.classList.remove("show")):(p.classList.add("show"),f&&f.classList.add("show")))},{root:i instanceof Element?i:r instanceof Element?r:null,threshold:0});p._nimbiObserver=g}else p._nimbiObserver=null;try{p._nimbiObserver&&typeof p._nimbiObserver.disconnect=="function"&&p._nimbiObserver.disconnect()}catch(y){_("[htmlBuilder] observer disconnect failed",y)}try{p._nimbiObserver&&typeof p._nimbiObserver.observe=="function"&&p._nimbiObserver.observe(t)}catch(y){_("[htmlBuilder] observer observe failed",y)}try{const y=()=>{try{const g=o instanceof Element?o.getBoundingClientRect():{top:0,bottom:window.innerHeight},m=t.getBoundingClientRect();!(m.bottom<g.top||m.top>g.bottom)?(p.classList.remove("show"),f&&f.classList.remove("show")):(p.classList.add("show"),f&&f.classList.add("show"))}catch(g){_("[htmlBuilder] checkIntersect failed",g)}};y(),typeof globalThis<"u"&&typeof globalThis.IntersectionObserver<"u"||setTimeout(y,100)}catch(y){_("[htmlBuilder] checkIntersect outer failed",y)}}else{p.classList.remove("show"),f&&f.classList.remove("show");const y=i instanceof Element?i:r instanceof Element?r:window,g=()=>{try{(y===window?window.scrollY:y.scrollTop||0)>10?(p.classList.add("show"),f&&f.classList.add("show")):(p.classList.remove("show"),f&&f.classList.remove("show"))}catch(m){_("[htmlBuilder] onScroll handler failed",m)}};Dn(()=>y.addEventListener("scroll",g)),g()}}catch(l){_("[htmlBuilder] ensureScrollTopButton failed",l)}}function on(e,t){try{if(typeof nt=="function")try{nt(e,t);return}catch{}}catch{}try{e&&t&&ee&&typeof ee.set=="function"&&!ee.has(e)&&ee.set(e,t)}catch{}try{t&&Z&&typeof Z.set=="function"&&Z.set(t,e)}catch{}try{if(Pe&&typeof Pe.has=="function"){if(!Pe.has(t)){try{Pe.add(t)}catch{}try{Array.isArray(Ie)&&!Ie.includes(t)&&Ie.push(t)}catch{}}}else try{Array.isArray(Ie)&&!Ie.includes(t)&&Ie.push(t)}catch{}}catch{}}function Ta(e,t){try{if(!e)return;try{const n=e[t];if(typeof n<"u")return n}catch{}try{if(e.default)return e.default[t]}catch{}return}catch{return}}function vl(e){try{if(!Array.isArray(e))return e;e.forEach(t=>{try{if(!t||typeof t!="object")return;let n=typeof t.slug=="string"?String(t.slug):"",i=null;if(n&&n.indexOf("::")!==-1){const l=n.split("::");n=l[0]||"",i=l.slice(1).join("::")||null}const r=!!(n&&(n.indexOf(".")!==-1||n.indexOf("/")!==-1));let a="";try{if(t.path&&typeof t.path=="string"){const l=V(String(t.path||""));if(a=findSlugForPath(l)||(Z&&Z.has(l)?Z.get(l):"")||"",!a)if(t.title&&String(t.title).trim())a=de(String(t.title).trim());else{const o=l.replace(/^.*\//,"").replace(/\.(?:md|html?)$/i,"");a=de(o||l)}}else if(r){const l=String(n).replace(/\.(?:md|html?)$/i,""),o=findSlugForPath(l)||(Z&&Z.has(l)?Z.get(l):"")||"";o?a=o:t.title&&String(t.title).trim()?a=de(String(t.title).trim()):a=de(l)}else!n&&t.title&&String(t.title).trim()?a=de(String(t.title).trim()):a=n||""}catch{try{a=t.title&&String(t.title).trim()?de(String(t.title).trim()):n?de(n):""}catch{a=n}}let s=a||"";i&&(s=s?`${s}::${i}`:`${de(i)}`),s&&(t.slug=s);try{if(t.path&&s){const l=String(s).split("::")[0];try{on(l,V(String(t.path||"")))}catch{}}}catch{}}catch{}})}catch{}return e}async function Al(e,t,n,i,r,a,s,l,o="eager",c=1,u=void 0,h="favicon"){if(!e||!(e instanceof HTMLElement))throw new TypeError("navbarWrap must be an HTMLElement");const d=He(),p=d?d.parseFromString(n||"","text/html"):null,f=p?p.querySelectorAll("a"):[];await Dn(()=>fl(f,i)),await Dn(()=>pl(f,i));try{le(f,i)}catch{}try{if(t&&t instanceof HTMLElement&&(!t.hasAttribute||!t.hasAttribute("role")))try{t.setAttribute("role","main")}catch{}}catch{}let y=null,g=null,m=null,b=null,w=null,k=null,S=!1,v=null;const E=new Map;function B(){try{const R=typeof j<"u"&&j&&j.querySelector?j.querySelector(".navbar-burger"):e&&e.querySelector?e.querySelector(".navbar-burger"):typeof document<"u"?document.querySelector(".navbar-burger"):null,z=R&&R.dataset?R.dataset.target:null,A=z?typeof j<"u"&&j&&j.querySelector?j.querySelector(`#${z}`)||document.getElementById(z):e&&e.querySelector?e.querySelector(`#${z}`):typeof document<"u"?document.getElementById(z):null:null;if(R&&R.classList&&R.classList.contains("is-active")){try{R.classList.remove("is-active")}catch{}try{R.setAttribute("aria-expanded","false")}catch{}if(A&&A.classList)try{A.classList.remove("is-active")}catch{}}}catch(R){_("[nimbi-cms] closeMobileMenu failed",R)}}async function H(){const R=t&&t instanceof HTMLElement?t:typeof document<"u"?document.querySelector(".nimbi-content"):null;try{R&&R.classList.add("is-inactive")}catch{}try{const z=s&&s();z&&typeof z.then=="function"&&await z}catch(z){try{_("[nimbi-cms] renderByQuery failed",z)}catch{}}finally{try{if(typeof requestAnimationFrame=="function")requestAnimationFrame(()=>{try{R&&R.classList.remove("is-inactive")}catch{}});else try{R&&R.classList.remove("is-inactive")}catch{}}catch{try{R&&R.classList.remove("is-inactive")}catch{}}}}function W(R){try{let z=R&&typeof R.slug=="string"?String(R.slug):"",A=null;try{z&&z.indexOf("::")!==-1&&(A=z.split("::").slice(1).join("::")||null)}catch{}try{if(R&&R.path&&typeof R.path=="string"){const C=V(String(R.path||"")),T=C.replace(/^.*\//,"");try{if(E&&E.has(C))return{page:E.get(C),hash:A};if(E&&E.has(T))return{page:E.get(T),hash:A}}catch{}try{if(Z&&Z.has(C))return{page:Z.get(C),hash:A}}catch{}try{const I=U(C);if(I)return{page:I,hash:A}}catch{}}}catch{}if(z&&z.indexOf("::")!==-1){const C=z.split("::");z=C[0]||"",A=C.slice(1).join("::")||null}if(z&&(z.includes(".")||z.includes("/"))){const C=V(R&&R.path?String(R.path):z),T=C.replace(/^.*\//,"");try{if(E&&E.has(C))return{page:E.get(C),hash:A};if(E&&E.has(T))return{page:E.get(T),hash:A}}catch{}try{let I=U(C);if(!I)try{const K=String(C||"").replace(/^\/+/,""),P=K.replace(/^.*\//,"");for(const[q,M]of ee.entries())try{let O=null;if(typeof M=="string"?O=V(String(M||"")):M&&typeof M=="object"&&(M.default?O=V(String(M.default||"")):O=null),!O)continue;if(O===K||O.endsWith("/"+K)||K.endsWith("/"+O)||O.endsWith(P)||K.endsWith(P)){I=q;break}}catch{}}catch{}if(I)z=I;else try{const K=String(z).replace(/\.(?:md|html?)$/i,"");z=de(K||C)}catch{z=de(C)}}catch{z=de(C)}}return!z&&R&&R.path&&(z=de(V(String(R.path||"")))),{page:z,hash:A}}catch{return{page:R&&R.slug||"",hash:null}}}const $=()=>y||(y=(async()=>{try{const R=await Promise.resolve().then(()=>ot),z=typeof globalThis<"u"?globalThis.buildSearchIndex:void 0,A=typeof globalThis<"u"?globalThis.buildSearchIndexWorker:void 0,C=Ta(R,"buildSearchIndex"),T=Ta(R,"buildSearchIndexWorker"),I=typeof z=="function"?z:C||void 0,K=typeof A=="function"?A:T||void 0;Tt("[nimbi-cms test] ensureSearchIndex: buildFn="+typeof I+" workerFn="+typeof K+" (global preferred)");const P=[];try{r&&P.push(r)}catch{}try{navigationPage&&P.push(navigationPage)}catch{}if(o==="lazy"&&typeof K=="function")try{const q=await K(i,c,u,P.length?P:void 0);if(q&&q.length){try{if(R&&typeof R._setSearchIndex=="function")try{R._setSearchIndex(q)}catch{}}catch{}return q}}catch(q){_("[nimbi-cms] worker builder threw",q)}return typeof I=="function"?(Tt("[nimbi-cms test] calling buildFn"),await I(i,c,u,P.length?P:void 0)):[]}catch(R){return _("[nimbi-cms] buildSearchIndex failed",R),[]}finally{if(g){try{g.removeAttribute("disabled")}catch{}try{m&&m.classList.remove("is-loading")}catch{}}}})(),y.then(R=>{try{try{v=Array.isArray(R)?R:null}catch{v=null}try{vl(R)}catch{}try{if(typeof window<"u"){try{(async()=>{try{const T=await Promise.resolve().then(()=>ot);try{try{T&&typeof T._setSearchIndex=="function"&&T._setSearchIndex(Array.isArray(R)?R:[])}catch{}Object.defineProperty(window,"__nimbiResolvedIndex",{get(){return T&&Array.isArray(T.searchIndex)?T.searchIndex:Array.isArray(v)?v:[]},enumerable:!0,configurable:!0})}catch{try{window.__nimbiResolvedIndex=T&&Array.isArray(T.searchIndex)?T.searchIndex:Array.isArray(v)?v:[]}catch{}}}catch{try{window.__nimbiResolvedIndex=Array.isArray(re)?re:Array.isArray(v)?v:[]}catch{}}})()}catch{}try{window.__nimbi_contentBase=i}catch{}try{window.__nimbi_indexDepth=c}catch{}try{window.__nimbi_noIndexing=u}catch{}}}catch{}const z=String(g&&g.value||"").trim().toLowerCase();if(!z||!Array.isArray(R)||!R.length)return;const A=R.filter(T=>T.title&&T.title.toLowerCase().includes(z)||T.excerpt&&T.excerpt.toLowerCase().includes(z));if(!A||!A.length)return;const C=typeof w<"u"&&w?w:typeof document<"u"?document.getElementById("nimbi-search-results"):null;if(!C)return;try{typeof C.replaceChildren=="function"?C.replaceChildren():C.innerHTML=""}catch{try{C.innerHTML=""}catch{}}try{const T=document.createElement("div");T.className="panel nimbi-search-panel",A.slice(0,10).forEach(I=>{try{if(I.parentTitle){const M=document.createElement("p");M.className="panel-heading nimbi-search-title nimbi-search-parent",M.textContent=I.parentTitle,T.appendChild(M)}const K=document.createElement("a");K.className="panel-block nimbi-search-result";const P=W(I);K.href=$e(P.page,P.hash),K.setAttribute("role","button");try{if(I.path&&typeof I.path=="string")try{on(P.page,I.path)}catch{}}catch{}const q=document.createElement("div");q.className="is-size-6 has-text-weight-semibold",q.textContent=I.title,K.appendChild(q),K.addEventListener("click",()=>{try{C.style.display="none"}catch{}}),T.appendChild(K)}catch{}}),C.appendChild(T);try{C.style.display="block"}catch{}}catch{}}catch{}}).catch(()=>{}).finally(()=>{(async()=>{try{if(S)return;S=!0;const R=await Promise.resolve().then(()=>Pn);try{await R.handleSitemapRequest({homePage:r,contentBase:i,indexDepth:c,noIndexing:u,includeAllMarkdown:!0})}catch(z){_("[nimbi-cms] sitemap trigger failed",z)}}catch(R){try{_("[nimbi-cms] sitemap dynamic import failed",R)}catch{}}})()}),y),j=document.createElement("nav");j.className="navbar",j.setAttribute("role","navigation"),j.setAttribute("aria-label","main navigation");const G=document.createElement("div");G.className="navbar-brand";const ie=f[0],F=document.createElement("a");if(F.className="navbar-item",ie){const R=ie.getAttribute("href")||"#";try{const A=new URL(R,location.href).searchParams.get("page"),C=A?decodeURIComponent(A):r;let T=null;try{typeof C=="string"&&(/(?:\.md|\.html?)$/i.test(C)||C.includes("/"))&&(T=U(C))}catch{}!T&&typeof C=="string"&&!String(C).includes(".")&&(T=C);const I=T||C;F.href=$e(I),(!F.textContent||!String(F.textContent).trim())&&(F.textContent=a("home"))}catch{try{const A=typeof r=="string"&&(/(?:\.md|\.html?)$/i.test(r)||r.includes("/"))?U(r):typeof r=="string"&&!r.includes(".")?r:null;F.href=$e(A||r)}catch{F.href=$e(r)}F.textContent=a("home")}}else F.href=$e(r),F.textContent=a("home");async function L(R){try{if(!R||R==="none")return null;if(R==="favicon")try{const z=document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');if(!z)return null;const A=z.getAttribute("href")||"";return A&&/\.png(?:\?|$)/i.test(A)?new URL(A,location.href).toString():null}catch{return null}if(R==="copy-first"||R==="move-first")try{const z=await Ce(r,i);if(!z||!z.raw)return null;const A=He(),C=A?A.parseFromString(z.raw,"text/html"):null,T=C?C.querySelector("img"):null;if(!T)return null;const I=T.getAttribute("src")||"";if(!I)return null;const K=new URL(I,location.href).toString();if(R==="move-first")try{document.documentElement.setAttribute("data-nimbi-logo-moved",K)}catch{}return K}catch{return null}try{return new URL(R,location.href).toString()}catch{return null}}catch{return null}}let D=null;try{D=await L(h)}catch{D=null}if(D)try{const R=document.createElement("img");R.className="nimbi-navbar-logo";const z=a&&typeof a=="function"&&(a("home")||a("siteLogo"))||"";R.alt=z,R.title=z,R.src=D;try{R.style.marginRight="0.5em"}catch{}try{(!F.textContent||!String(F.textContent).trim())&&(F.textContent=z)}catch{}try{F.insertBefore(R,F.firstChild)}catch{try{F.appendChild(R)}catch{}}}catch{}G.appendChild(F),F.addEventListener("click",function(R){const z=F.getAttribute("href")||"";if(z.startsWith("?page=")){R.preventDefault();const A=new URL(z,location.href),C=A.searchParams.get("page"),T=A.hash?A.hash.replace(/^#/,""):null;history.pushState({page:C},"",$e(C,T)),H();try{B()}catch{}}});function U(R){try{if(!R)return null;const z=V(String(R||""));try{if(Z&&Z.has(z))return Z.get(z)}catch{}const A=z.replace(/^.*\//,"");try{if(Z&&Z.has(A))return Z.get(A)}catch{}try{for(const[C,T]of ee.entries())if(T){if(typeof T=="string"){if(V(T)===z)return C}else if(T&&typeof T=="object"){if(T.default&&V(T.default)===z)return C;const I=T.langs||{};for(const K in I)if(I[K]&&V(I[K])===z)return C}}}catch{}return null}catch{return null}}async function le(R,z){try{if(!R||!R.length)return;const A=[];for(let P=0;P<R.length;P++)try{const q=R[P];if(!q||typeof q.getAttribute!="function")continue;const M=q.getAttribute("href")||"";if(!M||Ar(M))continue;let O=null;try{const ge=et(M);ge&&ge.page&&(O=ge.page)}catch{}if(!O){const ge=String(M||"").split(/[?#]/,1),Le=ge&&ge[0]?ge[0]:M;(/\.(?:md|html?)$/i.test(Le)||Le.indexOf("/")!==-1)&&(O=V(String(Le||"")))}if(!O)continue;const Y=V(String(O||"")),X=Y.replace(/^.*\//,"");let me=null;try{E&&E.has(Y)&&(me=E.get(Y))}catch{}try{!me&&Z&&Z.has(Y)&&(me=Z.get(Y))}catch{}if(me)continue;let Me=null;try{Me=q.textContent&&String(q.textContent).trim()?String(q.textContent).trim():null}catch{Me=null}let ye=null;if(Me)ye=de(Me);else{const ge=X.replace(/\.(?:md|html?)$/i,"");ye=de(ge||Y)}if(ye)try{A.push({path:Y,candidate:ye})}catch{}}catch{}if(!A.length)return;const C=3;let T=0;const I=async()=>{for(;T<A.length;){const P=A[T++];if(!(!P||!P.path))try{const q=await Ce(P.path,z);if(!q||!q.raw)continue;let M=null;if(q.isHtml)try{const O=He(),Y=O?O.parseFromString(q.raw,"text/html"):null,X=Y?Y.querySelector("h1")||Y.querySelector("title"):null;X&&X.textContent&&(M=String(X.textContent).trim())}catch{}else try{const O=q.raw.match(/^#\s+(.+)$/m);O&&O[1]&&(M=String(O[1]).trim())}catch{}if(M){const O=de(M);if(O&&O!==P.candidate){try{on(O,P.path)}catch{}try{E.set(P.path,O)}catch{}try{E.set(P.path.replace(/^.*\//,""),O)}catch{}try{const Y=await Promise.resolve().then(()=>ot);try{if(Array.isArray(Y.searchIndex)){let X=!1;for(const me of Y.searchIndex)try{if(me&&me.path===P.path&&me.slug){const ye=String(me.slug).split("::").slice(1).join("::");me.slug=ye?`${O}::${ye}`:O,X=!0}}catch{}try{X&&typeof Y._setSearchIndex=="function"&&Y._setSearchIndex(Y.searchIndex)}catch{}}}catch{}}catch{}}}}catch{}}},K=[];for(let P=0;P<C;P++)K.push(I());try{await Promise.all(K)}catch{}}catch{}}const te=document.createElement("a");te.className="navbar-burger",te.setAttribute("role","button"),te.setAttribute("aria-label","menu"),te.setAttribute("aria-expanded","false");const ce="nimbi-navbar-menu";te.dataset.target=ce,te.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>',G.appendChild(te);try{te.addEventListener("click",R=>{try{const z=te.dataset&&te.dataset.target?te.dataset.target:null,A=z?j&&j.querySelector?j.querySelector(`#${z}`)||(e&&e.querySelector?e.querySelector(`#${z}`):document.getElementById(z)):e&&e.querySelector?e.querySelector(`#${z}`)||document.getElementById(z):typeof document<"u"?document.getElementById(z):null:null;te.classList.contains("is-active")?(te.classList.remove("is-active"),te.setAttribute("aria-expanded","false"),A&&A.classList.remove("is-active")):(te.classList.add("is-active"),te.setAttribute("aria-expanded","true"),A&&A.classList.add("is-active"))}catch(z){_("[nimbi-cms] navbar burger toggle failed",z)}})}catch(R){_("[nimbi-cms] burger event binding failed",R)}const _e=document.createElement("div");_e.className="navbar-menu",_e.id=ce;const Ee=document.createElement("div");Ee.className="navbar-start";let Fe=null,xe=null;if(!l)Fe=null,g=null,b=null,w=null,k=null;else{Fe=document.createElement("div"),Fe.className="navbar-end",xe=document.createElement("div"),xe.className="navbar-item",g=document.createElement("input"),g.className="input",g.type="search",g.placeholder=a("searchPlaceholder")||"",g.id="nimbi-search";try{const T=(a&&typeof a=="function"?a("searchAria"):null)||g.placeholder||"Search";try{g.setAttribute("aria-label",T)}catch{}try{g.setAttribute("aria-controls","nimbi-search-results")}catch{}try{g.setAttribute("aria-autocomplete","list")}catch{}try{g.setAttribute("role","combobox")}catch{}}catch{}o==="eager"&&(g.disabled=!0),m=document.createElement("div"),m.className="control",o==="eager"&&m.classList.add("is-loading"),m.appendChild(g),xe.appendChild(m),b=document.createElement("div"),b.className="dropdown is-right",b.id="nimbi-search-dropdown";const R=document.createElement("div");R.className="dropdown-trigger",R.appendChild(xe);const z=document.createElement("div");z.className="dropdown-menu",z.setAttribute("role","menu"),w=document.createElement("div"),w.id="nimbi-search-results",w.className="dropdown-content nimbi-search-results",k=w,z.appendChild(w),b.appendChild(R),b.appendChild(z),Fe.appendChild(b);const A=T=>{if(!w)return;try{if(typeof w.replaceChildren=="function")w.replaceChildren();else for(;w.firstChild;)w.removeChild(w.firstChild)}catch{try{w.innerHTML=""}catch{}}let I=-1;function K(M){try{const O=w.querySelector(".nimbi-search-result.is-selected");O&&O.classList.remove("is-selected");const Y=w.querySelectorAll(".nimbi-search-result");if(!Y||!Y.length)return;if(M<0){I=-1;return}M>=Y.length&&(M=Y.length-1);const X=Y[M];if(X){X.classList.add("is-selected"),I=M;try{X.scrollIntoView({block:"nearest"})}catch{}}}catch{}}function P(M){try{const O=M.key,Y=w.querySelectorAll(".nimbi-search-result");if(!Y||!Y.length)return;if(O==="ArrowDown"){M.preventDefault();const X=I<0?0:Math.min(Y.length-1,I+1);K(X);return}if(O==="ArrowUp"){M.preventDefault();const X=I<=0?0:I-1;K(X);return}if(O==="Enter"){M.preventDefault();const X=w.querySelector(".nimbi-search-result.is-selected")||w.querySelector(".nimbi-search-result");if(X)try{X.click()}catch{}return}if(O==="Escape"){try{b.classList.remove("is-active")}catch{}try{document.documentElement.classList.remove("nimbi-search-open")}catch{}try{w.style.display="none"}catch{}try{w.classList.remove("is-open")}catch{}try{w.removeAttribute("tabindex")}catch{}try{w.removeEventListener("keydown",P)}catch{}try{g&&g.focus()}catch{}try{g&&g.removeEventListener("keydown",q)}catch{}return}}catch{}}function q(M){try{if(M&&M.key==="ArrowDown"){M.preventDefault();try{w.focus()}catch{}K(0)}}catch{}}try{const M=document.createElement("div");M.className="panel nimbi-search-panel";const O=document.createDocumentFragment();T.forEach(Y=>{if(Y.parentTitle){const ye=document.createElement("p");ye.textContent=Y.parentTitle,ye.className="panel-heading nimbi-search-title nimbi-search-parent",O.appendChild(ye)}const X=document.createElement("a");X.className="panel-block nimbi-search-result";const me=W(Y);X.href=$e(me.page,me.hash),X.setAttribute("role","button");try{if(Y.path&&typeof Y.path=="string")try{on(me.page,Y.path)}catch{}}catch{}const Me=document.createElement("div");Me.className="is-size-6 has-text-weight-semibold",Me.textContent=Y.title,X.appendChild(Me),X.addEventListener("click",ye=>{try{try{ye&&ye.preventDefault&&ye.preventDefault()}catch{}try{ye&&ye.stopPropagation&&ye.stopPropagation()}catch{}if(b){b.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-search-open")}catch{}}try{w.style.display="none"}catch{}try{w.classList.remove("is-open")}catch{}try{w.removeAttribute("tabindex")}catch{}try{w.removeEventListener("keydown",P)}catch{}try{g&&g.removeEventListener("keydown",q)}catch{}try{const ge=X.getAttribute&&X.getAttribute("href")||"";let Le=null,Ye=null;try{const qe=new URL(ge,location.href);Le=qe.searchParams.get("page"),Ye=qe.hash?qe.hash.replace(/^#/,""):null}catch{}if(Le)try{history.pushState({page:Le},"",$e(Le,Ye));try{H()}catch{try{typeof window<"u"&&typeof window.renderByQuery=="function"&&window.renderByQuery()}catch{}}return}catch{}}catch{}try{window.location.href=X.href}catch{}}catch{}}),O.appendChild(X)}),M.appendChild(O),w.appendChild(M)}catch{}if(b){b.classList.add("is-active");try{document.documentElement.classList.add("nimbi-search-open")}catch{}}try{w.style.display="block"}catch{}try{w.classList.add("is-open")}catch{}try{w.setAttribute("tabindex","0")}catch{}try{w.addEventListener("keydown",P)}catch{}try{g&&g.addEventListener("keydown",q)}catch{}},C=(T,I)=>{let K=null;return(...P)=>{K&&clearTimeout(K),K=setTimeout(()=>T(...P),I)}};if(g){const T=C(async()=>{const I=g||(typeof j<"u"&&j&&j.querySelector?j.querySelector("input#nimbi-search"):e&&e.querySelector?e.querySelector("input#nimbi-search"):typeof document<"u"?document.querySelector("input#nimbi-search"):null),K=String(I&&I.value||"").trim().toLowerCase();if(!K){A([]);return}try{await $();const P=await y,q=Array.isArray(P)?P.filter(M=>M.title&&M.title.toLowerCase().includes(K)||M.excerpt&&M.excerpt.toLowerCase().includes(K)):[];A(q.slice(0,10))}catch(P){_("[nimbi-cms] search input handler failed",P),A([])}},50);try{g.addEventListener("input",T)}catch{}try{document.addEventListener("input",I=>{try{I&&I.target&&I.target.id==="nimbi-search"&&T(I)}catch{}},!0)}catch{}}if(o==="eager"){try{y=$()}catch(T){_("[nimbi-cms] eager search index init failed",T),y=Promise.resolve([])}y.finally(()=>{const T=g||(typeof j<"u"&&j&&j.querySelector?j.querySelector("input#nimbi-search"):e&&e.querySelector?e.querySelector("input#nimbi-search"):typeof document<"u"?document.querySelector("input#nimbi-search"):null);if(T){try{T.removeAttribute("disabled")}catch{}try{m&&m.classList.remove("is-loading")}catch{}}(async()=>{try{if(S)return;S=!0;const I=await y.catch(()=>[]),K=await Promise.resolve().then(()=>Pn);try{await K.handleSitemapRequest({index:Array.isArray(I)?I:void 0,homePage:r,contentBase:i,indexDepth:c,noIndexing:u,includeAllMarkdown:!0})}catch(P){_("[nimbi-cms] sitemap trigger failed",P)}}catch(I){try{_("[nimbi-cms] sitemap dynamic import failed",I)}catch{}}})()})}try{const T=I=>{try{const K=I&&I.target;if(!k||!k.classList.contains("is-open")&&k.style&&k.style.display!=="block"||K&&(k.contains(K)||g&&(K===g||g.contains&&g.contains(K))))return;if(b){b.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-search-open")}catch{}}try{k.style.display="none"}catch{}try{k.classList.remove("is-open")}catch{}}catch{}};document.addEventListener("click",T,!0),document.addEventListener("touchstart",T,!0)}catch{}}const Ue=document.createDocumentFragment();for(let R=0;R<f.length;R++){const z=f[R];if(R===0)continue;const A=z.getAttribute("href")||"#";let C=A;const T=document.createElement("a");T.className="navbar-item";try{let I=null;try{I=et(String(A||""))}catch{I=null}let K=null,P=null;if(I&&(I.type==="canonical"&&I.page||I.type==="cosmetic"&&I.page)&&(K=I.page,P=I.anchor),K&&(/\.(?:md|html?)$/i.test(K)||K.includes("/")?C=K:T.href=$e(K,P)),/^[^#]*\.md(?:$|[#?])/.test(C)||C.endsWith(".md")){const M=V(C).split(/::|#/,2),O=M[0],Y=M[1],X=U(O);X?T.href=$e(X,Y):T.href=$e(O,Y)}else if(/\.html(?:$|[#?])/.test(C)||C.endsWith(".html")){const M=V(C).split(/::|#/,2);let O=M[0];O&&!O.toLowerCase().endsWith(".html")&&(O=O+".html");const Y=M[1],X=U(O);if(X)T.href=$e(X,Y);else try{const me=await Ce(O,i);if(me&&me.raw)try{const Me=He(),ye=Me?Me.parseFromString(me.raw,"text/html"):null,ge=ye?ye.querySelector("title"):null,Le=ye?ye.querySelector("h1"):null,Ye=ge&&ge.textContent&&ge.textContent.trim()?ge.textContent.trim():Le&&Le.textContent?Le.textContent.trim():null;if(Ye){const qe=de(Ye);if(qe){try{on(qe,O)}catch(St){_("[nimbi-cms] slugToMd/mdToSlug set failed",St)}T.href=$e(qe,Y)}else T.href=$e(O,Y)}else T.href=$e(O,Y)}catch{T.href=$e(O,Y)}else T.href=C}catch{T.href=C}}else T.href=C}catch(I){_("[nimbi-cms] nav item href parse failed",I),T.href=C}try{const I=z.textContent&&String(z.textContent).trim()?String(z.textContent).trim():null;if(I)try{const K=de(I);if(K){const P=T.getAttribute("href")||"";let q=null;if(/^[^#?]*\.(?:md|html?)(?:$|[?#])/i.test(P))q=V(String(P||"").split(/[?#]/)[0]);else try{const M=et(P);M&&M.type==="canonical"&&M.page&&(q=V(M.page))}catch{}if(q){let M=!1;try{if(/\.(?:html?)(?:$|[?#])/i.test(String(q||"")))M=!0;else if(/\.(?:md)(?:$|[?#])/i.test(String(q||"")))M=!1;else{const O=String(q||"").replace(/^\.\//,""),Y=O.replace(/^.*\//,"");Pe&&Pe.size&&(Pe.has(O)||Pe.has(Y))&&(M=!0)}}catch{M=!1}if(M)try{const O=V(String(q||"").split(/[?#]/)[0]);let Y=!1;try{U&&typeof U=="function"&&U(O)&&(Y=!0)}catch{}try{on(K,q)}catch{}try{if(O){try{E.set(O,K)}catch{}try{const X=O.replace(/^.*\//,"");X&&E.set(X,K)}catch{}}}catch{}if(Y)try{T.href=$e(K)}catch{}}catch{}}}}catch(K){_("[nimbi-cms] nav slug mapping failed",K)}}catch(I){_("[nimbi-cms] nav slug mapping failed",I)}T.textContent=z.textContent||C,Ue.appendChild(T)}try{Ee.appendChild(Ue)}catch{}_e.appendChild(Ee),Fe&&_e.appendChild(Fe),j.appendChild(G),j.appendChild(_e),e.appendChild(j);try{const R=z=>{try{const A=typeof j<"u"&&j&&j.querySelector?j.querySelector(".navbar-burger"):e&&e.querySelector?e.querySelector(".navbar-burger"):typeof document<"u"?document.querySelector(".navbar-burger"):null;if(!A||!A.classList.contains("is-active"))return;const C=A&&A.closest?A.closest(".navbar"):j;if(C&&C.contains(z.target))return;B()}catch{}};document.addEventListener("click",R,!0),document.addEventListener("touchstart",R,!0)}catch{}try{_e.addEventListener("click",R=>{const z=R.target&&R.target.closest?R.target.closest("a"):null;if(!z)return;const A=z.getAttribute("href")||"";try{const C=new URL(A,location.href),T=C.searchParams.get("page"),I=C.hash?C.hash.replace(/^#/,""):null;T&&(R.preventDefault(),history.pushState({page:T},"",$e(T,I)),H())}catch(C){_("[nimbi-cms] navbar click handler failed",C)}try{const C=typeof j<"u"&&j&&j.querySelector?j.querySelector(".navbar-burger"):e&&e.querySelector?e.querySelector(".navbar-burger"):null,T=C&&C.dataset?C.dataset.target:null,I=T?j&&j.querySelector?j.querySelector(`#${T}`)||(e&&e.querySelector?e.querySelector(`#${T}`):document.getElementById(T)):e&&e.querySelector?e.querySelector(`#${T}`)||document.getElementById(T):typeof document<"u"?document.getElementById(T):null:null;C&&C.classList.contains("is-active")&&(C.classList.remove("is-active"),C.setAttribute("aria-expanded","false"),I&&I.classList.remove("is-active"))}catch(C){_("[nimbi-cms] mobile menu close failed",C)}})}catch(R){_("[nimbi-cms] attach content click handler failed",R)}try{t.addEventListener("click",R=>{const z=R.target&&R.target.closest?R.target.closest("a"):null;if(!z)return;const A=z.getAttribute("href")||"";if(A&&!Ar(A))try{const C=new URL(A,location.href),T=C.searchParams.get("page"),I=C.hash?C.hash.replace(/^#/,""):null;T&&(R.preventDefault(),history.pushState({page:T},"",$e(T,I)),H())}catch(C){_("[nimbi-cms] container click URL parse failed",C)}})}catch(R){_("[nimbi-cms] build navbar failed",R)}return{navbar:j,linkEls:f}}try{document.addEventListener("input",e=>{try{if(e&&e.target&&e.target.id==="nimbi-search"){const t=document.getElementById("nimbi-search-results");if(t&&e.target&&e.target.value)try{t.style.display="block"}catch{}}}catch{}},!0)}catch{}let rt=null,fe=null,Xe=1,xt=(e,t)=>t,Mn=0,Ln=0,sr=()=>{},Tn=.25;function El(){if(rt&&document.contains(rt))return rt;rt=null;const e=document.createElement("dialog");e.className="nimbi-image-preview modal",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-label",xt("imagePreviewTitle","Image preview"));try{const L=document.createElement("div");L.className="modal-background";const D=document.createElement("div");D.className="modal-content";const U=document.createElement("div");U.className="nimbi-image-preview__content box",U.setAttribute("role","document");const le=document.createElement("button");le.className="button is-small nimbi-image-preview__close",le.type="button",le.setAttribute("data-nimbi-preview-close",""),le.textContent="✕";const te=document.createElement("div");te.className="nimbi-image-preview__image-wrapper";const ce=document.createElement("img");ce.setAttribute("data-nimbi-preview-image",""),ce.alt="",te.appendChild(ce);const _e=document.createElement("div");_e.className="nimbi-image-preview__controls";const Ee=document.createElement("div");Ee.className="nimbi-image-preview__group";const Fe=document.createElement("button");Fe.className="button is-small",Fe.type="button",Fe.setAttribute("data-nimbi-preview-fit",""),Fe.textContent="⤢";const xe=document.createElement("button");xe.className="button is-small",xe.type="button",xe.setAttribute("data-nimbi-preview-original",""),xe.textContent="1:1";const Ue=document.createElement("button");Ue.className="button is-small",Ue.type="button",Ue.setAttribute("data-nimbi-preview-reset",""),Ue.textContent="⟲",Ee.appendChild(Fe),Ee.appendChild(xe),Ee.appendChild(Ue);const R=document.createElement("div");R.className="nimbi-image-preview__group";const z=document.createElement("button");z.className="button is-small",z.type="button",z.setAttribute("data-nimbi-preview-zoom-out",""),z.textContent="−";const A=document.createElement("div");A.className="nimbi-image-preview__zoom",A.setAttribute("data-nimbi-preview-zoom-label",""),A.textContent="100%";const C=document.createElement("button");C.className="button is-small",C.type="button",C.setAttribute("data-nimbi-preview-zoom-in",""),C.textContent="＋",R.appendChild(z),R.appendChild(A),R.appendChild(C),_e.appendChild(Ee),_e.appendChild(R),U.appendChild(le),U.appendChild(te),U.appendChild(_e),D.appendChild(U),e.appendChild(L),e.appendChild(D)}catch{e.innerHTML=`
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
    `}e.addEventListener("click",L=>{L.target===e&&Jr()}),e.addEventListener("wheel",L=>{if(!W())return;L.preventDefault();const D=L.deltaY<0?Tn:-Tn;Et(Xe+D),c(),u()},{passive:!1}),e.addEventListener("keydown",L=>{if(L.key==="Escape"){Jr();return}if(Xe>1){const D=e.querySelector(".nimbi-image-preview__image-wrapper");if(!D)return;const U=40;switch(L.key){case"ArrowUp":D.scrollTop-=U,L.preventDefault();break;case"ArrowDown":D.scrollTop+=U,L.preventDefault();break;case"ArrowLeft":D.scrollLeft-=U,L.preventDefault();break;case"ArrowRight":D.scrollLeft+=U,L.preventDefault();break}}}),document.body.appendChild(e),rt=e,fe=e.querySelector("[data-nimbi-preview-image]");const t=e.querySelector("[data-nimbi-preview-fit]"),n=e.querySelector("[data-nimbi-preview-original]"),i=e.querySelector("[data-nimbi-preview-zoom-in]"),r=e.querySelector("[data-nimbi-preview-zoom-out]"),a=e.querySelector("[data-nimbi-preview-reset]"),s=e.querySelector("[data-nimbi-preview-close]"),l=e.querySelector("[data-nimbi-preview-zoom-label]"),o=e.querySelector("[data-nimbi-preview-zoom-hud]");function c(){l&&(l.textContent=`${Math.round(Xe*100)}%`)}const u=()=>{o&&(o.textContent=`${Math.round(Xe*100)}%`,o.classList.add("visible"),clearTimeout(o._timeout),o._timeout=setTimeout(()=>o.classList.remove("visible"),800))};sr=c,i.addEventListener("click",()=>{Et(Xe+Tn),c(),u()}),r.addEventListener("click",()=>{Et(Xe-Tn),c(),u()}),t.addEventListener("click",()=>{Rn(),c(),u()}),n.addEventListener("click",()=>{Et(1),c(),u()}),a.addEventListener("click",()=>{Rn(),c(),u()}),s.addEventListener("click",Jr),t.title=xt("imagePreviewFit","Fit to screen"),n.title=xt("imagePreviewOriginal","Original size"),r.title=xt("imagePreviewZoomOut","Zoom out"),i.title=xt("imagePreviewZoomIn","Zoom in"),s.title=xt("imagePreviewClose","Close"),s.setAttribute("aria-label",xt("imagePreviewClose","Close"));let h=!1,d=0,p=0,f=0,y=0;const g=new Map;let m=0,b=1;const w=(L,D)=>{const U=L.x-D.x,le=L.y-D.y;return Math.hypot(U,le)},k=()=>{h=!1,g.clear(),m=0,fe&&(fe.classList.add("is-panning"),fe.classList.remove("is-grabbing"))};let S=0,v=0,E=0;const B=L=>{const D=Date.now(),U=D-S,le=L.clientX-v,te=L.clientY-E;S=D,v=L.clientX,E=L.clientY,U<300&&Math.hypot(le,te)<30&&(Et(Xe>1?1:2),c(),L.preventDefault())},H=L=>{Et(Xe>1?1:2),c(),L.preventDefault()},W=()=>rt?typeof rt.open=="boolean"?rt.open:rt.classList.contains("is-active"):!1,$=(L,D,U=1)=>{if(g.has(U)&&g.set(U,{x:L,y:D}),g.size===2){const _e=Array.from(g.values()),Ee=w(_e[0],_e[1]);if(m>0){const Fe=Ee/m;Et(b*Fe)}return}if(!h)return;const le=fe.closest(".nimbi-image-preview__image-wrapper");if(!le)return;const te=L-d,ce=D-p;le.scrollLeft=f-te,le.scrollTop=y-ce},j=(L,D,U=1)=>{if(!W())return;if(g.set(U,{x:L,y:D}),g.size===2){const ce=Array.from(g.values());m=w(ce[0],ce[1]),b=Xe;return}const le=fe.closest(".nimbi-image-preview__image-wrapper");!le||!(le.scrollWidth>le.clientWidth||le.scrollHeight>le.clientHeight)||(h=!0,d=L,p=D,f=le.scrollLeft,y=le.scrollTop,fe.classList.add("is-panning"),fe.classList.remove("is-grabbing"),window.addEventListener("pointermove",G),window.addEventListener("pointerup",ie),window.addEventListener("pointercancel",ie))},G=L=>{h&&(L.preventDefault(),$(L.clientX,L.clientY,L.pointerId))},ie=()=>{k(),window.removeEventListener("pointermove",G),window.removeEventListener("pointerup",ie),window.removeEventListener("pointercancel",ie)};fe.addEventListener("pointerdown",L=>{L.preventDefault(),j(L.clientX,L.clientY,L.pointerId)}),fe.addEventListener("pointermove",L=>{(h||g.size===2)&&L.preventDefault(),$(L.clientX,L.clientY,L.pointerId)}),fe.addEventListener("pointerup",L=>{L.preventDefault(),L.pointerType==="touch"&&B(L),k()}),fe.addEventListener("dblclick",H),fe.addEventListener("pointercancel",k),fe.addEventListener("mousedown",L=>{L.preventDefault(),j(L.clientX,L.clientY,1)}),fe.addEventListener("mousemove",L=>{h&&L.preventDefault(),$(L.clientX,L.clientY,1)}),fe.addEventListener("mouseup",L=>{L.preventDefault(),k()});const F=e.querySelector(".nimbi-image-preview__image-wrapper");return F&&(F.addEventListener("pointerdown",L=>{if(j(L.clientX,L.clientY,L.pointerId),L&&L.target&&L.target.tagName==="IMG")try{L.target.classList.add("is-grabbing")}catch{}}),F.addEventListener("pointermove",L=>{$(L.clientX,L.clientY,L.pointerId)}),F.addEventListener("pointerup",k),F.addEventListener("pointercancel",k),F.addEventListener("mousedown",L=>{if(j(L.clientX,L.clientY,1),L&&L.target&&L.target.tagName==="IMG")try{L.target.classList.add("is-grabbing")}catch{}}),F.addEventListener("mousemove",L=>{$(L.clientX,L.clientY,1)}),F.addEventListener("mouseup",k)),e}function Et(e){if(!fe)return;const t=Number(e);Xe=Number.isFinite(t)?Math.max(.1,Math.min(4,t)):1;const i=fe.getBoundingClientRect(),r=Mn||fe.naturalWidth||fe.width||i.width||0,a=Ln||fe.naturalHeight||fe.height||i.height||0;if(r&&a){fe.style.setProperty("--nimbi-preview-img-max-width","none"),fe.style.setProperty("--nimbi-preview-img-max-height","none"),fe.style.setProperty("--nimbi-preview-img-width",`${r*Xe}px`),fe.style.setProperty("--nimbi-preview-img-height",`${a*Xe}px`),fe.style.setProperty("--nimbi-preview-img-transform","none");try{fe.style.width=`${r*Xe}px`,fe.style.height=`${a*Xe}px`,fe.style.transform="none"}catch{}}else{fe.style.setProperty("--nimbi-preview-img-max-width",""),fe.style.setProperty("--nimbi-preview-img-max-height",""),fe.style.setProperty("--nimbi-preview-img-width",""),fe.style.setProperty("--nimbi-preview-img-height",""),fe.style.setProperty("--nimbi-preview-img-transform",`scale(${Xe})`);try{fe.style.transform=`scale(${Xe})`}catch{}}fe&&(fe.classList.add("is-panning"),fe.classList.remove("is-grabbing"))}function Rn(){if(!fe)return;const e=fe.closest(".nimbi-image-preview__image-wrapper");if(!e)return;const t=e.getBoundingClientRect();if(t.width===0||t.height===0)return;const n=Mn||fe.naturalWidth||t.width,i=Ln||fe.naturalHeight||t.height;if(!n||!i)return;const r=t.width/n,a=t.height/i,s=Math.min(r,a,1);Et(Number.isFinite(s)?s:1)}function Cl(e,t="",n=0,i=0){const r=El();Xe=1,Mn=n||0,Ln=i||0,fe.src=e;try{if(!t)try{const l=new URL(e,typeof location<"u"?location.href:"").pathname||"",c=(l.substring(l.lastIndexOf("/")+1)||e).replace(/\.[^/.]+$/,"").replace(/[-_]+/g," ");t=xt("imagePreviewDefaultAlt",c||"Image")}catch{t=xt("imagePreviewDefaultAlt","Image")}}catch{}fe.alt=t,fe.style.transform="scale(1)";const a=()=>{Mn=fe.naturalWidth||fe.width||0,Ln=fe.naturalHeight||fe.height||0};if(a(),Rn(),sr(),requestAnimationFrame(()=>{Rn(),sr()}),!Mn||!Ln){const s=()=>{a(),requestAnimationFrame(()=>{Rn(),sr()}),fe.removeEventListener("load",s)};fe.addEventListener("load",s)}typeof r.showModal=="function"&&(r.open||r.showModal()),r.classList.add("is-active");try{document.documentElement.classList.add("nimbi-image-preview-open")}catch{}r.focus()}function Jr(){if(rt){typeof rt.close=="function"&&rt.open&&rt.close(),rt.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-image-preview-open")}catch{}}}function Ml(e,{t,zoomStep:n=.25}={}){if(!e||!e.querySelectorAll)return;xt=(p,f)=>(typeof t=="function"?t(p):void 0)||f,Tn=n,e.addEventListener("click",p=>{const f=p.target;if(!f||f.tagName!=="IMG")return;const y=f;if(!y.src)return;const g=y.closest("a");g&&g.getAttribute("href")||Cl(y.src,y.alt||"",y.naturalWidth||0,y.naturalHeight||0)});let i=!1,r=0,a=0,s=0,l=0;const o=new Map;let c=0,u=1;const h=(p,f)=>{const y=p.x-f.x,g=p.y-f.y;return Math.hypot(y,g)};e.addEventListener("pointerdown",p=>{const f=p.target;if(!f||f.tagName!=="IMG")return;const y=f.closest("a");if(y&&y.getAttribute("href")||!rt||!rt.open)return;if(o.set(p.pointerId,{x:p.clientX,y:p.clientY}),o.size===2){const m=Array.from(o.values());c=h(m[0],m[1]),u=Xe;return}const g=f.closest(".nimbi-image-preview__image-wrapper");if(g&&!(Xe<=1)){p.preventDefault(),i=!0,r=p.clientX,a=p.clientY,s=g.scrollLeft,l=g.scrollTop,f.setPointerCapture(p.pointerId);try{f.classList.add("is-grabbing")}catch{}}}),e.addEventListener("pointermove",p=>{if(o.has(p.pointerId)&&o.set(p.pointerId,{x:p.clientX,y:p.clientY}),o.size===2){p.preventDefault();const w=Array.from(o.values()),k=h(w[0],w[1]);if(c>0){const S=k/c;Et(u*S)}return}if(!i)return;p.preventDefault();const f=p.target,y=f.closest&&f.closest("a");if(y&&y.getAttribute&&y.getAttribute("href"))return;const g=f.closest(".nimbi-image-preview__image-wrapper");if(!g)return;const m=p.clientX-r,b=p.clientY-a;g.scrollLeft=s-m,g.scrollTop=l-b});const d=()=>{i=!1,o.clear(),c=0;try{const p=document.querySelector("[data-nimbi-preview-image]");p&&(p.classList.add("is-panning"),p.classList.remove("is-grabbing"))}catch{}};e.addEventListener("pointerup",d),e.addEventListener("pointercancel",d)}function Ll(e){const{contentWrap:t,navWrap:n,container:i,mountOverlay:r=null,t:a,contentBase:s,homePage:l,initialDocumentTitle:o,runHooks:c}=e||{};if(!t||!(t instanceof HTMLElement))throw new TypeError("contentWrap must be an HTMLElement");let u=null;const h=cl(a,[{path:l,name:a("home"),isIndex:!0,children:[]}]);let d=!1,p=!1;function f(k){try{if(!k)return;if(typeof k.replaceChildren=="function")return k.replaceChildren();for(;k.firstChild;)k.removeChild(k.firstChild)}catch{try{k&&(k.innerHTML="")}catch{}}}async function y(k,S){let v,E,B;try{({data:v,pagePath:E,anchor:B}=await to(k,s))}catch(F){const L=F&&F.message?String(F.message):"",D=(!oe||typeof oe!="string"||!oe)&&/no page data/i.test(L);try{if(D)try{_("[nimbi-cms] fetchPageData (expected missing)",F)}catch{}else try{Nn("[nimbi-cms] fetchPageData failed",F)}catch{}}catch{}try{!oe&&n&&f(n)}catch{}Ma(t,a,F);return}!B&&S&&(B=S);try{Vr(null)}catch(F){_("[nimbi-cms] scrollToAnchorOrTop failed",F)}try{f(t)}catch{try{t.innerHTML=""}catch{}}const{article:H,parsed:W,toc:$,topH1:j,h1Text:G,slugKey:ie}=await yl(a,v,E,B,s);Ks(a,o,W,$,H,E,B,j,G,ie,v);try{f(n)}catch{try{n.innerHTML=""}catch{}}$&&(n.appendChild($),xl($));try{await c("transformHtml",{article:H,parsed:W,toc:$,pagePath:E,anchor:B,topH1:j,h1Text:G,slugKey:ie,data:v})}catch(F){_("[nimbi-cms] transformHtml hooks failed",F)}t.appendChild(H);try{bl(H)}catch(F){_("[nimbi-cms] executeEmbeddedScripts failed",F)}try{Ml(H,{t:a})}catch(F){_("[nimbi-cms] attachImagePreview failed",F)}try{Fn(i,100,!1),requestAnimationFrame(()=>Fn(i,100,!1)),setTimeout(()=>Fn(i,100,!1),250)}catch(F){_("[nimbi-cms] setEagerForAboveFoldImages failed",F)}Vr(B),Sl(H,j,{mountOverlay:r,container:i,navWrap:n,t:a});try{await c("onPageLoad",{data:v,pagePath:E,anchor:B,article:H,toc:$,topH1:j,h1Text:G,slugKey:ie,contentWrap:t,navWrap:n})}catch(F){_("[nimbi-cms] onPageLoad hooks failed",F)}u=E}async function g(){if(d){p=!0;return}d=!0;try{try{yi("renderByQuery")}catch{}try{bi("renderByQuery")}catch{}let k=et(location.href);if(k&&k.type==="path"&&k.page)try{let E="?page="+encodeURIComponent(k.page||"");k.params&&(E+=(E.includes("?")?"&":"?")+k.params),k.anchor&&(E+="#"+encodeURIComponent(k.anchor));try{history.replaceState(history.state,"",E)}catch{try{history.replaceState({},"",E)}catch{}}k=et(location.href)}catch{}const S=k&&k.page?k.page:l,v=k&&k.anchor?k.anchor:null;await y(S,v)}catch(k){_("[nimbi-cms] renderByQuery failed",k);try{!oe&&n&&f(n)}catch{}Ma(t,a,k)}finally{if(d=!1,p){p=!1;try{await g()}catch{}}}}window.addEventListener("popstate",g);const m=()=>`nimbi-cms-scroll:${location.pathname}${location.search}`,b=()=>{try{const k=i||document.querySelector(".nimbi-cms");if(!k)return;const S={top:k.scrollTop||0,left:k.scrollLeft||0};sessionStorage.setItem(m(),JSON.stringify(S))}catch(k){_("[nimbi-cms] save scroll position failed",k)}},w=()=>{try{const k=i||document.querySelector(".nimbi-cms");if(!k)return;const S=sessionStorage.getItem(m());if(!S)return;const v=JSON.parse(S);v&&typeof v.top=="number"&&k.scrollTo({top:v.top,left:v.left||0,behavior:"auto"})}catch{}};return window.addEventListener("pageshow",k=>{if(k.persisted)try{w(),Fn(i,100,!1)}catch(S){_("[nimbi-cms] bfcache restore failed",S)}}),window.addEventListener("pagehide",()=>{try{b()}catch(k){_("[nimbi-cms] save scroll position failed",k)}}),{renderByQuery:g,siteNav:h,getCurrentPagePath:()=>u}}function Tl(e){try{let t=typeof e=="string"?e:typeof window<"u"&&window.location?window.location.search:"";if(!t&&typeof window<"u"&&window.location&&window.location.hash)try{const a=et(window.location.href);a&&a.params&&(t=a.params.startsWith("?")?a.params:"?"+a.params)}catch{t=""}if(!t)return{};const n=new URLSearchParams(t.startsWith("?")?t.slice(1):t),i={},r=a=>{if(a==null)return;const s=String(a).toLowerCase();if(s==="1"||s==="true"||s==="yes")return!0;if(s==="0"||s==="false"||s==="no")return!1};if(n.has("contentPath")&&(i.contentPath=n.get("contentPath")),n.has("searchIndex")){const a=r(n.get("searchIndex"));typeof a=="boolean"&&(i.searchIndex=a)}if(n.has("searchIndexMode")){const a=n.get("searchIndexMode");(a==="eager"||a==="lazy")&&(i.searchIndexMode=a)}if(n.has("defaultStyle")){const a=n.get("defaultStyle");(a==="light"||a==="dark"||a==="system")&&(i.defaultStyle=a)}if(n.has("bulmaCustomize")&&(i.bulmaCustomize=n.get("bulmaCustomize")),n.has("lang")&&(i.lang=n.get("lang")),n.has("l10nFile")){const a=n.get("l10nFile");i.l10nFile=a==="null"?null:a}if(n.has("cacheTtlMinutes")){const a=Number(n.get("cacheTtlMinutes"));Number.isFinite(a)&&a>=0&&(i.cacheTtlMinutes=a)}if(n.has("cacheMaxEntries")){const a=Number(n.get("cacheMaxEntries"));Number.isInteger(a)&&a>=0&&(i.cacheMaxEntries=a)}if(n.has("homePage")&&(i.homePage=n.get("homePage")),n.has("navigationPage")&&(i.navigationPage=n.get("navigationPage")),n.has("notFoundPage")){const a=n.get("notFoundPage");i.notFoundPage=a==="null"?null:a}if(n.has("availableLanguages")&&(i.availableLanguages=n.get("availableLanguages").split(",").map(a=>a.trim()).filter(Boolean)),n.has("fetchConcurrency")){const a=Number(n.get("fetchConcurrency"));Number.isInteger(a)&&a>=1&&(i.fetchConcurrency=a)}if(n.has("negativeFetchCacheTTL")){const a=Number(n.get("negativeFetchCacheTTL"));Number.isFinite(a)&&a>=0&&(i.negativeFetchCacheTTL=a)}if(n.has("indexDepth")){const a=Number(n.get("indexDepth"));Number.isInteger(a)&&(a===1||a===2||a===3)&&(i.indexDepth=a)}if(n.has("noIndexing")){const s=(n.get("noIndexing")||"").split(",").map(l=>l.trim()).filter(Boolean);s.length&&(i.noIndexing=s)}return i}catch{return{}}}function ei(e){if(typeof e!="string")return!1;const t=e.trim();if(!t||t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))return!1;const n=t.replace(/^\.\//,"");return!!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n)}function Rl(e){if(typeof e!="string")return!1;const t=e.trim();if(!t)return!1;if(t==="."||t==="./")return!0;if(t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))return!1;const n=t.replace(/^\.\//,"");return!!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\/?$/.test(n)}let or="";async function Ra(e={}){if(!e||typeof e!="object")throw new TypeError("initCMS(options): options must be an object");const t=Tl();if(t&&(t.contentPath||t.homePage||t.notFoundPage||t.navigationPage))if(e&&e.allowUrlPathOverrides===!0)try{_("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage/navigationPage")}catch{}else{try{_("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage/navigationPage")}catch{}delete t.contentPath,delete t.homePage,delete t.notFoundPage,delete t.navigationPage}const n=Object.assign({},t,e);try{if(Object.prototype.hasOwnProperty.call(n,"debugLevel"))mi(n.debugLevel);else if(typeof globalThis<"u"&&globalThis.__nimbiCMSDebug&&typeof globalThis.__nimbiCMSDebug.debugLevel<"u")try{const $=Number(globalThis.__nimbiCMSDebug.debugLevel);Number.isFinite($)&&mi(Math.max(0,Math.min(3,Math.floor($))))}catch{}}catch{}try{Lt("[nimbi-cms] initCMS called",()=>({options:n}))}catch{}t&&typeof t.bulmaCustomize=="string"&&t.bulmaCustomize.trim()&&(n.bulmaCustomize=t.bulmaCustomize);let{el:i,contentPath:r="/content",crawlMaxQueue:a=1e3,searchIndex:s=!0,searchIndexMode:l="eager",indexDepth:o=1,noIndexing:c=void 0,defaultStyle:u="light",bulmaCustomize:h="none",lang:d=void 0,l10nFile:p=null,cacheTtlMinutes:f=5,cacheMaxEntries:y,markdownExtensions:g,availableLanguages:m,homePage:b=null,notFoundPage:w=null,navigationPage:k="_navigation.md",exposeSitemap:S=!0}=n;try{typeof b=="string"&&b.startsWith("./")&&(b=b.replace(/^\.\//,""))}catch{}try{typeof w=="string"&&w.startsWith("./")&&(w=w.replace(/^\.\//,""))}catch{}try{typeof k=="string"&&k.startsWith("./")&&(k=k.replace(/^[.]\//,""))}catch{}const{navbarLogo:v="favicon"}=n,{skipRootReadme:E=!1}=n,B=$=>{try{const j=document.querySelector(i);if(j&&j instanceof Element)try{const G=document.createElement("div");G.style.padding="1rem";try{G.style.fontFamily="system-ui, sans-serif"}catch{}G.style.color="#b00",G.style.background="#fee",G.style.border="1px solid #b00";const ie=document.createElement("strong");ie.textContent="NimbiCMS failed to initialize:",G.appendChild(ie);try{G.appendChild(document.createElement("br"))}catch{}const F=document.createElement("pre");try{F.style.whiteSpace="pre-wrap"}catch{}F.textContent=String($),G.appendChild(F);try{if(typeof j.replaceChildren=="function")j.replaceChildren(G);else{for(;j.firstChild;)j.removeChild(j.firstChild);j.appendChild(G)}}catch{try{j.innerHTML='<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;"><strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">'+String($)+"</pre></div>"}catch{}}}catch{}}catch{}};if(n.contentPath!=null&&!Rl(n.contentPath))throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');if(b!=null&&!ei(b))throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');if(w!=null&&!ei(w))throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');if(k!=null&&!ei(k))throw new TypeError('initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html');if(!i)throw new Error("el is required");let H=i;if(typeof i=="string"){if(H=document.querySelector(i),!H)throw new Error(`el selector "${i}" did not match any element`)}else if(!(i instanceof Element))throw new TypeError("el must be a CSS selector string or a DOM element");if(typeof r!="string"||!r.trim())throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');if(typeof s!="boolean")throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');if(l!=null&&l!=="eager"&&l!=="lazy")throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');if(o!=null&&o!==1&&o!==2&&o!==3)throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');if(u!=="light"&&u!=="dark"&&u!=="system")throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');if(h!=null&&typeof h!="string")throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');if(d!=null&&typeof d!="string")throw new TypeError('initCMS(options): "lang" must be a string when provided');if(p!=null&&typeof p!="string")throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');if(f!=null&&(typeof f!="number"||!Number.isFinite(f)||f<0))throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');if(y!=null&&(typeof y!="number"||!Number.isInteger(y)||y<0))throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');if(g!=null&&(!Array.isArray(g)||g.some($=>!$||typeof $!="object")))throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');if(m!=null&&(!Array.isArray(m)||m.some($=>typeof $!="string"||!$.trim())))throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');if(c!=null&&(!Array.isArray(c)||c.some($=>typeof $!="string"||!$.trim())))throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');if(E!=null&&typeof E!="boolean")throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');if(n.fetchConcurrency!=null&&(typeof n.fetchConcurrency!="number"||!Number.isInteger(n.fetchConcurrency)||n.fetchConcurrency<1))throw new TypeError('initCMS(options): "fetchConcurrency" must be a positive integer when provided');if(n.negativeFetchCacheTTL!=null&&(typeof n.negativeFetchCacheTTL!="number"||!Number.isFinite(n.negativeFetchCacheTTL)||n.negativeFetchCacheTTL<0))throw new TypeError('initCMS(options): "negativeFetchCacheTTL" must be a non-negative number (ms) when provided');if(b!=null&&(typeof b!="string"||!b.trim()||!/\.(md|html)$/.test(b)))throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');if(w!=null&&(typeof w!="string"||!w.trim()||!/\.(md|html)$/.test(w)))throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');const W=!!s;try{Promise.resolve().then(()=>ot).then($=>{try{$&&typeof $.setSkipRootReadme=="function"&&$.setSkipRootReadme(!!E)}catch(j){_("[nimbi-cms] setSkipRootReadme failed",j)}}).catch($=>{})}catch($){_("[nimbi-cms] setSkipRootReadme dynamic import failed",$)}try{try{n&&n.seoMap&&typeof n.seoMap=="object"&&Xs(n.seoMap)}catch{}try{typeof window<"u"&&(window.__nimbiRenderingErrors__||(window.__nimbiRenderingErrors__=[]),window.addEventListener("error",function($){try{const j={type:"error",message:$&&$.message?String($.message):"",filename:$&&$.filename?String($.filename):"",lineno:$&&$.lineno?$.lineno:null,colno:$&&$.colno?$.colno:null,stack:$&&$.error&&$.error.stack?$.error.stack:null,time:Date.now()};try{_("[nimbi-cms] runtime error",j.message)}catch{}window.__nimbiRenderingErrors__.push(j)}catch{}}),window.addEventListener("unhandledrejection",function($){try{const j={type:"unhandledrejection",reason:$&&$.reason?String($.reason):"",time:Date.now()};try{_("[nimbi-cms] unhandledrejection",j.reason)}catch{}window.__nimbiRenderingErrors__.push(j)}catch{}}))}catch{}try{const $=et(typeof window<"u"?window.location.href:""),j=$&&$.page?$.page:b||void 0;try{j&&Qs(j,or||"")}catch{}}catch{}await(async()=>{try{H.classList.add("nimbi-mount")}catch(A){_("[nimbi-cms] mount element setup failed",A)}const $=document.createElement("section");$.className="section";const j=document.createElement("div");j.className="container nimbi-cms";const G=document.createElement("div");G.className="columns";const ie=document.createElement("div");ie.className="column is-hidden-mobile is-3-tablet nimbi-nav-wrap",ie.setAttribute("role","navigation");try{const A=typeof tn=="function"?tn("navigation"):null;A&&ie.setAttribute("aria-label",A)}catch(A){_("[nimbi-cms] set nav aria-label failed",A)}G.appendChild(ie);const F=document.createElement("main");F.className="column nimbi-content",F.setAttribute("role","main"),G.appendChild(F),j.appendChild(G),$.appendChild(j);const L=ie,D=F;H.appendChild($);let U=null;try{U=H.querySelector(".nimbi-overlay"),U||(U=document.createElement("div"),U.className="nimbi-overlay",H.appendChild(U))}catch(A){U=null,_("[nimbi-cms] mount overlay setup failed",A)}const le=location.pathname||"/";let te;if(le.endsWith("/"))te=le;else{const A=le.substring(le.lastIndexOf("/")+1);A&&!A.includes(".")?te=le+"/":te=le.substring(0,le.lastIndexOf("/")+1)}try{or=document.title||""}catch(A){or="",_("[nimbi-cms] read initial document title failed",A)}let ce=r;const _e=Object.prototype.hasOwnProperty.call(n,"contentPath"),Ee=typeof location<"u"&&location.origin?location.origin:"http://localhost",Fe=new URL(te,Ee).toString();(ce==="."||ce==="./")&&(ce="");try{ce=String(ce||"").replace(/\\/g,"/")}catch{ce=String(ce||"")}ce.startsWith("/")&&(ce=ce.replace(/^\/+/,"")),ce&&!ce.endsWith("/")&&(ce=ce+"/");try{if(ce&&te&&te!=="/"){const A=te.replace(/^\/+/,"").replace(/\/+$/,"")+"/";A&&ce.startsWith(A)&&(ce=ce.slice(A.length))}}catch{}try{if(ce)var xe=new URL(ce,Fe.endsWith("/")?Fe:Fe+"/").toString();else var xe=Fe}catch{try{if(ce)var xe=new URL("/"+ce,Ee).toString();else var xe=new URL(te,Ee).toString()}catch{var xe=Ee}}if(p&&await xr(p,te),m&&Array.isArray(m)&&Ri(m),d&&Sr(d),typeof f=="number"&&f>=0&&typeof Xi=="function"&&Xi(f*60*1e3),typeof y=="number"&&y>=0&&typeof Gi=="function"&&Gi(y),g&&Array.isArray(g)&&g.length)try{g.forEach(A=>{typeof A=="object"&&xa&&typeof Gr=="function"&&Gr(A)})}catch(A){_("[nimbi-cms] applying markdownExtensions failed",A)}try{typeof a=="number"&&Promise.resolve().then(()=>ot).then(({setDefaultCrawlMaxQueue:A})=>{try{A(a)}catch(C){_("[nimbi-cms] setDefaultCrawlMaxQueue failed",C)}}),typeof n.fetchConcurrency=="number"&&Promise.resolve().then(()=>ot).then(({setFetchConcurrency:A})=>{try{A(n.fetchConcurrency)}catch(C){_("[nimbi-cms] setFetchConcurrency failed",C)}}).catch(()=>{}),typeof n.negativeFetchCacheTTL=="number"&&Promise.resolve().then(()=>ot).then(({setFetchNegativeCacheTTL:A})=>{try{A(n.negativeFetchCacheTTL)}catch(C){_("[nimbi-cms] setFetchNegativeCacheTTL failed",C)}}).catch(()=>{})}catch(A){_("[nimbi-cms] setDefaultCrawlMaxQueue import failed",A)}try{try{const A=n&&n.manifest?n.manifest:typeof globalThis<"u"&&globalThis.__NIMBI_CMS_MANIFEST__?globalThis.__NIMBI_CMS_MANIFEST__:typeof window<"u"&&window.__NIMBI_CMS_MANIFEST__?window.__NIMBI_CMS_MANIFEST__:null;if(A&&typeof A=="object")try{const C=await Promise.resolve().then(()=>ot);if(C&&typeof C._setAllMd=="function"){C._setAllMd(A);try{Lt("[nimbi-cms diagnostic] applied content manifest",()=>({manifestKeys:Object.keys(A).length}))}catch{}}}catch(C){_("[nimbi-cms] applying content manifest failed",C)}try{Tr(xe)}catch(C){_("[nimbi-cms] setContentBase failed",C)}try{try{const C=await Promise.resolve().then(()=>ot);try{Lt("[nimbi-cms diagnostic] after setContentBase",()=>({manifestKeys:A&&typeof A=="object"?Object.keys(A).length:0,slugToMdSize:C&&C.slugToMd&&typeof C.slugToMd.size=="number"?C.slugToMd.size:void 0,allMarkdownPathsLength:C&&Array.isArray(C.allMarkdownPaths)?C.allMarkdownPaths.length:void 0,allMarkdownPathsSetSize:C&&C.allMarkdownPathsSet&&typeof C.allMarkdownPathsSet.size=="number"?C.allMarkdownPathsSet.size:void 0,searchIndexLength:C&&Array.isArray(C.searchIndex)?C.searchIndex.length:void 0}))}catch{}}catch{}}catch{}}catch{}}catch(A){_("[nimbi-cms] setContentBase failed",A)}try{$i(w)}catch(A){_("[nimbi-cms] setNotFoundPage failed",A)}try{typeof window<"u"&&window.__nimbiAutoAttachSitemapUI&&Promise.resolve().then(()=>Pn).then(A=>{try{A&&typeof A.attachSitemapDownloadUI=="function"&&A.attachSitemapDownloadUI(document.body,{filename:"sitemap.json"})}catch{}}).catch(()=>{})}catch{}let Ue=null,R=null;try{if(!Object.prototype.hasOwnProperty.call(n,"homePage")&&k)try{const T=[],I=[];try{k&&I.push(String(k))}catch{}try{const P=String(k||"").replace(/^_/,"");P&&P!==String(k)&&I.push(P)}catch{}try{I.push("navigation.md")}catch{}try{I.push("assets/navigation.md")}catch{}const K=[];for(const P of I)try{if(!P)continue;const q=String(P);K.includes(q)||K.push(q)}catch{}for(const P of K){T.push(P);try{if(R=await Ce(P,xe,{force:!0}),R&&R.raw){try{k=P}catch{}try{_("[nimbi-cms] fetched navigation candidate",P,"contentBase=",xe)}catch{}Ue=await En(R.raw||"");try{const q=He();if(q&&Ue&&Ue.html){const O=q.parseFromString(Ue.html,"text/html").querySelector("a");if(O)try{const Y=O.getAttribute("href")||"",X=et(Y);try{_("[nimbi-cms] parsed nav first-link href",Y,"->",X)}catch{}if(X&&X.page&&(X.type==="path"||X.type==="canonical"&&(X.page.includes(".")||X.page.includes("/")))){b=X.page;try{_("[nimbi-cms] derived homePage from navigation",b)}catch{}break}}catch{}}}catch{}}}catch{}}}catch{}try{_("[nimbi-cms] final homePage before slugManager setHomePage",b)}catch{}try{Ii(b)}catch(T){_("[nimbi-cms] setHomePage failed",T)}let C=!0;try{const T=et(typeof location<"u"?location.href:"");T&&T.type==="cosmetic"&&(typeof w>"u"||w==null)&&(C=!1)}catch{}if(C&&b)try{await Ce(b,xe,{force:!0})}catch(T){throw new Error(`Required ${b} not found at ${xe}${b}: ${T&&T.message?T.message:String(T)}`)}}catch(A){throw A}Si(u),await xi(h,te);const z=Ll({contentWrap:D,navWrap:L,container:j,mountOverlay:U,t:tn,contentBase:xe,homePage:b,initialDocumentTitle:or,runHooks:gr});try{const A=document.createElement("header");A.className="nimbi-site-navbar",H.insertBefore(A,$);let C=R,T=Ue;T||(C=await Ce(k,xe,{force:!0}),T=await En(C.raw||""));const{navbar:I,linkEls:K}=await Al(A,j,T.html||"",xe,b,tn,z.renderByQuery,W,l,o,c,v);try{await gr("onNavBuild",{navWrap:L,navbar:I,linkEls:K,contentBase:xe})}catch(P){_("[nimbi-cms] onNavBuild hooks failed",P)}try{try{if(K&&K.length){const P=await Promise.resolve().then(()=>ot);for(const q of Array.from(K||[]))try{const M=q&&q.getAttribute&&q.getAttribute("href")||"";if(!M)continue;let O=String(M||"").split(/::|#/,1)[0];if(O=String(O||"").split("?")[0],!O)continue;/\.(?:md|html?)$/.test(O)||(O=O+".html");let Y=null;try{Y=V(String(O||""))}catch{Y=String(O||"")}const X=String(Y||"").replace(/^.*\//,"").replace(/\?.*$/,"");if(!X)continue;try{let me=null;try{P&&typeof P.slugify=="function"&&(me=P.slugify(X.replace(/\.(?:md|html?)$/i,"")))}catch{me=String(X||"").replace(/\s+/g,"-").toLowerCase()}if(!me)continue;let Me=me;try{if(P&&P.slugToMd&&typeof P.slugToMd.has=="function"&&P.slugToMd.has(me)){const ye=P.slugToMd.get(me);let ge=!1;try{if(typeof ye=="string")ye===O&&(ge=!0);else if(ye&&typeof ye=="object"){ye.default===O&&(ge=!0);for(const Le of Object.keys(ye.langs||{}))if(ye.langs[Le]===O){ge=!0;break}}}catch{}if(!ge&&typeof P.uniqueSlug=="function")try{Me=P.uniqueSlug(me,new Set(P.slugToMd.keys()))}catch{Me=me}}}catch{}try{if(P&&typeof P._storeSlugMapping=="function")try{P._storeSlugMapping(Me,Y)}catch{}else if(P&&P.slugToMd&&typeof P.slugToMd.set=="function")try{P.slugToMd.set(Me,Y)}catch{}try{P&&P.mdToSlug&&typeof P.mdToSlug.set=="function"&&P.mdToSlug.set(Y,Me)}catch{}try{P&&Array.isArray(P.allMarkdownPaths)&&!P.allMarkdownPaths.includes(Y)&&P.allMarkdownPaths.push(Y)}catch{}try{P&&P.allMarkdownPathsSet&&typeof P.allMarkdownPathsSet.add=="function"&&P.allMarkdownPathsSet.add(Y)}catch{}}catch{}}catch{}}catch{}try{const q=await Promise.resolve().then(()=>vr);q&&typeof q.refreshIndexPaths=="function"&&q.refreshIndexPaths(xe)}catch{}}}catch{}}catch{}try{let P=!1;try{const q=new URLSearchParams(location.search||"");(q.has("sitemap")||q.has("rss")||q.has("atom"))&&(P=!0)}catch{}try{const M=(location.pathname||"/").replace(/\/\/+/g,"/").split("/").filter(Boolean).pop()||"";M&&/^(sitemap|sitemap\.xml|rss|rss\.xml|atom|atom\.xml)$/i.test(M)&&(P=!0)}catch{}if(P||S===!0||typeof window<"u"&&window.__nimbiExposeSitemap)try{try{const M=await Promise.resolve().then(()=>ot);if(M&&typeof M.awaitSearchIndex=="function"){const O=[];b&&O.push(b),k&&O.push(k);try{await M.awaitSearchIndex({contentBase:xe,indexDepth:Math.max(o||1,3),noIndexing:c,seedPaths:O.length?O:void 0,startBuild:!0,timeoutMs:1/0})}catch{}}}catch{}const q=await Promise.resolve().then(()=>Pn);try{if(q&&typeof q.handleSitemapRequest=="function"&&await q.handleSitemapRequest({includeAllMarkdown:!0,homePage:b,navigationPage:k,notFoundPage:w,contentBase:xe,indexDepth:o,noIndexing:c}))return}catch{}}catch{}try{Promise.resolve().then(()=>Pn).then(q=>{try{if(q&&typeof q.exposeSitemapGlobals=="function")try{q.exposeSitemapGlobals({includeAllMarkdown:!0,homePage:b,navigationPage:k,notFoundPage:w,contentBase:xe,indexDepth:o,noIndexing:c,waitForIndexMs:1/0}).catch(()=>{})}catch{}}catch{}}).catch(()=>{})}catch{}}catch{}try{try{const q=await Promise.resolve().then(()=>vr);if(q&&typeof q.refreshIndexPaths=="function")try{q.refreshIndexPaths(xe);try{try{const M=await Promise.resolve().then(()=>ot);try{Lt("[nimbi-cms diagnostic] after refreshIndexPaths",()=>({slugToMdSize:M&&M.slugToMd&&typeof M.slugToMd.size=="number"?M.slugToMd.size:void 0,allMarkdownPathsLength:M&&Array.isArray(M.allMarkdownPaths)?M.allMarkdownPaths.length:void 0,allMarkdownPathsSetSize:M&&M.allMarkdownPathsSet&&typeof M.allMarkdownPathsSet.size=="number"?M.allMarkdownPathsSet.size:void 0}))}catch{}}catch{}}catch{}try{const M=await Promise.resolve().then(()=>ot),O=M&&M.slugToMd&&typeof M.slugToMd.size=="number"?M.slugToMd.size:0;let Y=!1;try{if(!manifest){O<30&&(Y=!0);try{const X=et(typeof location<"u"?location.href:"");if(X){if(X.type==="cosmetic"&&X.page)try{M.slugToMd.has(X.page)||(Y=!0)}catch{}else if((X.type==="path"||X.type==="canonical")&&X.page)try{const me=V(X.page);!(M.mdToSlug&&M.mdToSlug.has(me))&&!(M.allMarkdownPathsSet&&M.allMarkdownPathsSet.has(me))&&(Y=!0)}catch{}}}catch{}}}catch{}if(Y){let X=null;try{X=typeof window<"u"&&(window.__nimbiSitemapFinal||window.__nimbiResolvedIndex||window.__nimbiSearchIndex||window.__nimbiLiveSearchIndex||window.__nimbiSearchIndex)||null}catch{X=null}if(Array.isArray(X)&&X.length){let me=0;for(const Me of X)try{if(!Me||!Me.slug)continue;const ye=String(Me.slug).split("::")[0];if(M.slugToMd.has(ye))continue;let ge=Me.sourcePath||Me.path||null;if(!ge&&Array.isArray(X)){const Ye=(X||[]).find(qe=>qe&&qe.slug===Me.slug);Ye&&Ye.path&&(ge=Ye.path)}if(!ge)continue;try{ge=String(ge)}catch{continue}let Le=null;try{const Ye=xe&&typeof xe=="string"?xe:typeof location<"u"&&location.origin?location.origin+"/":"";try{const qe=new URL(ge,Ye),St=new URL(Ye);if(qe.origin===St.origin){const $n=St.pathname||"/";let Ct=qe.pathname||"";Ct.startsWith($n)&&(Ct=Ct.slice($n.length)),Ct.startsWith("/")&&(Ct=Ct.slice(1)),Le=V(Ct)}else Le=V(qe.pathname||"")}catch{Le=V(ge)}}catch{Le=V(ge)}if(!Le)continue;Le=String(Le).split(/[?#]/)[0],Le=V(Le);try{M._storeSlugMapping(ye,Le)}catch{}me++}catch{}if(me){try{Lt("[nimbi-cms diagnostic] populated slugToMd from sitemap/searchIndex",()=>({added:me,total:M&&M.slugToMd&&typeof M.slugToMd.size=="number"?M.slugToMd.size:void 0}))}catch{}try{const Me=await Promise.resolve().then(()=>vr);Me&&typeof Me.refreshIndexPaths=="function"&&Me.refreshIndexPaths(xe)}catch{}}}}}catch{}}catch(M){_("[nimbi-cms] refreshIndexPaths after nav build failed",M)}}catch{}const P=()=>{const q=A&&A.getBoundingClientRect&&Math.round(A.getBoundingClientRect().height)||A&&A.offsetHeight||0;if(q>0){try{H.style.setProperty("--nimbi-site-navbar-height",`${q}px`)}catch(M){_("[nimbi-cms] set CSS var failed",M)}try{j.style.paddingTop=""}catch(M){_("[nimbi-cms] set container paddingTop failed",M)}try{const M=H&&H.getBoundingClientRect&&Math.round(H.getBoundingClientRect().height)||H&&H.clientHeight||0;if(M>0){const O=Math.max(0,M-q);try{j.style.setProperty("--nimbi-cms-height",`${O}px`)}catch(Y){_("[nimbi-cms] set --nimbi-cms-height failed",Y)}}else try{j.style.setProperty("--nimbi-cms-height","calc(100vh - var(--nimbi-site-navbar-height))")}catch(O){_("[nimbi-cms] set --nimbi-cms-height failed",O)}}catch(M){_("[nimbi-cms] compute container height failed",M)}try{A.style.setProperty("--nimbi-site-navbar-height",`${q}px`)}catch(M){_("[nimbi-cms] set navbar CSS var failed",M)}}};P();try{if(typeof ResizeObserver<"u"){const q=new ResizeObserver(()=>P());try{q.observe(A)}catch(M){_("[nimbi-cms] ResizeObserver.observe failed",M)}}}catch(q){_("[nimbi-cms] ResizeObserver setup failed",q)}}catch(P){_("[nimbi-cms] compute navbar height failed",P)}}catch(A){_("[nimbi-cms] build navigation failed",A)}await z.renderByQuery();try{Promise.resolve().then(()=>zl).then(({getVersion:A})=>{typeof A=="function"&&A().then(C=>{try{const T=C||"0.0.0";try{const I=q=>{const M=document.createElement("a");M.className="nimbi-version-label tag is-small",M.textContent=`nimbiCMS v. ${T}`,M.href=q||"#",M.target="_blank",M.rel="noopener noreferrer nofollow",M.setAttribute("aria-label",`nimbiCMS version ${T}`);try{vi(M)}catch{}try{H.appendChild(M)}catch(O){_("[nimbi-cms] append version label failed",O)}},K="https://abelvm.github.io/nimbiCMS/",P=(()=>{try{if(K&&typeof K=="string")return new URL(K).toString()}catch{}return"#"})();I(P)}catch(I){_("[nimbi-cms] building version label failed",I)}}catch(T){_("[nimbi-cms] building version label failed",T)}}).catch(C=>{_("[nimbi-cms] getVersion() failed",C)})}).catch(A=>{_("[nimbi-cms] import version module failed",A)})}catch(A){_("[nimbi-cms] version label setup failed",A)}})()}catch($){throw B($),$}}async function za(){try{if("1.0.5".trim())return"1.0.5"}catch{}return"0.0.0"}const zl=Object.freeze(Object.defineProperty({__proto__:null,getVersion:za},Symbol.toStringTag,{value:"Module"})),it=Tt,zn=_;function ti(){try{if(typeof location<"u"&&location&&typeof location.pathname=="string")return String(location.origin+location.pathname.split("?")[0])}catch{}return"http://localhost/"}function De(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}function Pa(e){try{return!e||typeof e!="string"?"":(e.split("/").filter(Boolean).pop()||e).replace(/\.[a-z0-9]+$/i,"").replace(/[-_]+/g," ").split(" ").map(r=>r?r.charAt(0).toUpperCase()+r.slice(1):"").join(" ").trim()}catch{return String(e)}}function Pl(e,t){try{const n=t&&t.slug?String(t.slug):null;if(!n)return null;const r={loc:e+"?page="+encodeURIComponent(n),slug:n};return t.title&&(r.title=String(t.title)),t.excerpt&&(r.excerpt=String(t.excerpt)),t.path&&(r.sourcePath=V(String(t.path))),r}catch{return null}}async function ni(e={}){const{includeAllMarkdown:t=!0,index:n,homePage:i,navigationPage:r,notFoundPage:a}=e||{},l=ti().split("?")[0];let o=Array.isArray(re)&&re.length?re:Array.isArray(n)?n:[];if(Array.isArray(n)&&n.length&&Array.isArray(re)&&re.length){const m=new Map;try{for(const b of n)try{b&&b.slug&&m.set(String(b.slug),b)}catch{}for(const b of re)try{b&&b.slug&&m.set(String(b.slug),b)}catch{}}catch{}o=Array.from(m.values())}const c=new Set;try{typeof a=="string"&&a.trim()&&c.add(V(String(a)))}catch{}try{typeof r=="string"&&r.trim()&&c.add(V(String(r)))}catch{}const u=new Set;try{if(typeof a=="string"&&a.trim()){const m=V(String(a));try{if(Z&&typeof Z.has=="function"&&Z.has(m))try{u.add(Z.get(m))}catch{}else try{const b=await Ce(m,e&&e.contentBase?e.contentBase:void 0);if(b&&b.raw)try{let w=null;if(b.isHtml)try{const k=He();if(k){const S=k.parseFromString(b.raw,"text/html"),v=S.querySelector("h1")||S.querySelector("title");v&&v.textContent&&(w=v.textContent.trim())}else{const S=(b.raw||"").match(/<h1[^>]*>(.*?)<\/h1>|<title[^>]*>(.*?)<\/title>/i);S&&(w=(S[1]||S[2]||"").trim())}}catch{}else{const k=(b.raw||"").match(/^#\s+(.+)$/m);k&&k[1]&&(w=k[1].trim())}w&&u.add(de(w))}catch{}}catch{}}catch{}}}catch{}const h=new Set,d=[],p=new Map,f=new Map,y=m=>{try{if(!m||typeof m!="string")return!1;const b=V(String(m));try{if(Pe&&typeof Pe.has=="function"&&Pe.has(b))return!0}catch{}try{if(Z&&typeof Z.has=="function"&&Z.has(b))return!0}catch{}try{if(f&&f.has(b))return!0}catch{}try{if(Z&&typeof Z.keys=="function"&&Z.size)for(const w of Z.keys())try{if(V(String(w))===b)return!0}catch{}else for(const w of ee.values())try{if(!w)continue;if(typeof w=="string"){if(V(String(w))===b)return!0}else if(w&&typeof w=="object"){if(w.default&&V(String(w.default))===b)return!0;const k=w.langs||{};for(const S of Object.keys(k||{}))try{if(k[S]&&V(String(k[S]))===b)return!0}catch{}}}catch{}}catch{}}catch{}return!1};if(Array.isArray(o)&&o.length){let m=0;for(const b of o){try{m++,await Pt(m,64)}catch{}try{if(!b||!b.slug)continue;const w=String(b.slug),k=String(w).split("::")[0];if(u.has(k))continue;const S=b.path?V(String(b.path)):null;if(S&&c.has(S))continue;const v=b.title?String(b.title):b.parentTitle?String(b.parentTitle):void 0;p.set(w,{title:v||void 0,excerpt:b.excerpt?String(b.excerpt):void 0,path:S,source:"index"}),S&&f.set(S,{title:v||void 0,excerpt:b.excerpt?String(b.excerpt):void 0,slug:w});const E=Pl(l,b);if(!E||!E.slug||h.has(E.slug))continue;if(h.add(E.slug),p.has(E.slug)){const B=p.get(E.slug);B&&B.title&&(E.title=B.title,E._titleSource="index"),B&&B.excerpt&&(E.excerpt=B.excerpt)}d.push(E)}catch{continue}}}if(t)try{let m=0;for(const[b,w]of ee.entries()){try{m++,await Pt(m,128)}catch{}try{if(!b)continue;const k=String(b).split("::")[0];if(h.has(b)||u.has(k))continue;let S=null;if(typeof w=="string"?S=V(String(w)):w&&typeof w=="object"&&(S=V(String(w.default||""))),S&&c.has(S))continue;const E={loc:l+"?page="+encodeURIComponent(b),slug:b};if(p.has(b)){const B=p.get(b);B&&B.title&&(E.title=B.title,E._titleSource="index"),B&&B.excerpt&&(E.excerpt=B.excerpt)}else if(S){const B=f.get(S);B&&B.title&&(E.title=B.title,E._titleSource="path",!E.excerpt&&B.excerpt&&(E.excerpt=B.excerpt))}if(h.add(b),typeof b=="string"){const B=b.indexOf("/")!==-1||/\.(md|html?)$/i.test(b),H=E.title&&typeof E.title=="string"&&(E.title.indexOf("/")!==-1||/\.(md|html?)$/i.test(E.title));(!E.title||H||B)&&(E.title=Pa(b),E._titleSource="humanize")}d.push(E)}catch{}}try{if(i&&typeof i=="string"){const b=V(String(i));let w=null;try{Z&&Z.has(b)&&(w=Z.get(b))}catch{}w||(w=b);const k=String(w).split("::")[0];if(!h.has(w)&&!c.has(b)&&!u.has(k)){const S={loc:l+"?page="+encodeURIComponent(w),slug:w};if(p.has(w)){const v=p.get(w);v&&v.title&&(S.title=v.title,S._titleSource="index"),v&&v.excerpt&&(S.excerpt=v.excerpt)}h.add(w),d.push(S)}}}catch{}}catch{}try{const m=new Set,b=new Set(d.map(E=>String(E&&E.slug?E.slug:""))),w=new Set;for(const E of d)try{E&&E.sourcePath&&w.add(String(E.sourcePath))}catch{}const k=30;let S=0,v=0;for(const E of w){try{v++,await Pt(v,8)}catch{}if(S>=k)break;try{if(!E||typeof E!="string"||!y(E))continue;S+=1;const B=await Ce(E,e&&e.contentBase?e.contentBase:void 0);if(!B||!B.raw||B&&typeof B.status=="number"&&B.status===404)continue;const H=B.raw,W=(function(F){try{return String(F||"")}catch{return""}})(H),$=[],j=/\[[^\]]+\]\(([^)]+)\)/g;let G;for(;G=j.exec(W);)try{G&&G[1]&&$.push(G[1])}catch{}const ie=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;G=ie.exec(W);)try{G&&G[1]&&$.push(G[1])}catch{}for(const F of $)try{if(!F)continue;if(F.indexOf("?")!==-1||F.indexOf("=")!==-1)try{const U=new URL(F,l).searchParams.get("page");if(U){const le=String(U);!b.has(le)&&!m.has(le)&&(m.add(le),d.push({loc:l+"?page="+encodeURIComponent(le),slug:le}));continue}}catch{}let L=String(F).split(/[?#]/)[0];if(L=L.replace(/^\.\//,"").replace(/^\//,""),!L||!/\.(md|html?)$/i.test(L))continue;try{const D=V(L);if(Z&&Z.has(D)){const U=Z.get(D),le=String(U).split("::")[0];U&&!b.has(U)&&!m.has(U)&&!u.has(le)&&!c.has(D)&&(m.add(U),d.push({loc:l+"?page="+encodeURIComponent(U),slug:U,sourcePath:D}));continue}try{if(!y(D))continue;const U=await Ce(D,e&&e.contentBase?e.contentBase:void 0);if(U&&typeof U.status=="number"&&U.status===404)continue;if(U&&U.raw){const le=(U.raw||"").match(/^#\s+(.+)$/m),te=le&&le[1]?le[1].trim():"",ce=de(te||D),_e=String(ce).split("::")[0];ce&&!b.has(ce)&&!m.has(ce)&&!u.has(_e)&&(m.add(ce),d.push({loc:l+"?page="+encodeURIComponent(ce),slug:ce,sourcePath:D,title:te||void 0}))}}catch{}}catch{}}catch{}}catch{}}}catch{}try{const m=new Map;let b=0;for(const k of d){try{b++,await Pt(b,128)}catch{}try{if(!k||!k.slug)continue;m.set(String(k.slug),k)}catch{}}const w=new Set;for(const k of d)try{if(!k||!k.slug)continue;const S=String(k.slug),v=S.split("::")[0];if(!v)continue;S!==v&&!m.has(v)&&w.add(v)}catch{}for(const k of w)try{let S=null;if(p.has(k)){const v=p.get(k);S={loc:l+"?page="+encodeURIComponent(k),slug:k},v&&v.title&&(S.title=v.title,S._titleSource="index"),v&&v.excerpt&&(S.excerpt=v.excerpt),v&&v.path&&(S.sourcePath=v.path)}else if(f&&ee&&ee.has(k)){const v=ee.get(k);let E=null;if(typeof v=="string"?E=V(String(v)):v&&typeof v=="object"&&(E=V(String(v.default||""))),S={loc:l+"?page="+encodeURIComponent(k),slug:k},E&&f.has(E)){const B=f.get(E);B&&B.title&&(S.title=B.title,S._titleSource="path"),B&&B.excerpt&&(S.excerpt=B.excerpt),S.sourcePath=E}}S||(S={loc:l+"?page="+encodeURIComponent(k),slug:k,title:Pa(k)},S._titleSource="humanize"),m.has(k)||(d.push(S),m.set(k,S))}catch{}}catch{}const g=[];try{const m=new Set;let b=0;for(const w of d){try{b++,await Pt(b,128)}catch{}try{if(!w||!w.slug)continue;const k=String(w.slug),S=String(k).split("::")[0];if(u.has(S)||k.indexOf("::")!==-1||m.has(k))continue;m.add(k),g.push(w)}catch{}}}catch{}try{try{it(()=>"[runtimeSitemap] generateSitemapJson finalEntries.titleSource: "+JSON.stringify(g.map(m=>({slug:m.slug,title:m.title,titleSource:m._titleSource||null})),null,2))}catch{}}catch{}try{let b=0;const w=g.length,k=Array.from({length:Math.min(4,w)}).map(async()=>{for(;;){const S=b++;if(S>=w)break;const v=g[S];try{if(!v||!v.slug)continue;const E=String(v.slug).split("::")[0];if(u.has(E)||v._titleSource==="index")continue;let B=null;try{if(ee&&ee.has(v.slug)){const H=ee.get(v.slug);typeof H=="string"?B=V(String(H)):H&&typeof H=="object"&&(B=V(String(H.default||"")))}!B&&v.sourcePath&&(B=v.sourcePath)}catch{continue}if(!B||c.has(B)||!y(B))continue;try{const H=await Ce(B,e&&e.contentBase?e.contentBase:void 0);if(!H||!H.raw||H&&typeof H.status=="number"&&H.status===404)continue;if(H&&H.raw){const W=(H.raw||"").match(/^#\s+(.+)$/m),$=W&&W[1]?W[1].trim():"";$&&(v.title=$,v._titleSource="fetched")}}catch(H){it("[runtimeSitemap] fetch title failed for",B,H)}}catch(E){it("[runtimeSitemap] worker loop failure",E)}}});await Promise.all(k)}catch(m){it("[runtimeSitemap] title enrichment failed",m)}return{generatedAt:new Date().toISOString(),entries:g}}function ri(e){const t=e&&Array.isArray(e.entries)?e.entries:Array.isArray(e)?e:[];let n=`<?xml version="1.0" encoding="UTF-8"?>
`;n+=`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;for(const i of t)try{n+=`  <url>
`,n+=`    <loc>${De(String(i.loc||""))}</loc>
`,n+=`  </url>
`}catch{}return n+=`</urlset>
`,n}function ii(e){const t=e&&Array.isArray(e.entries)?e.entries:Array.isArray(e)?e:[],n=ti().split("?")[0];let i=`<?xml version="1.0" encoding="UTF-8"?>
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
`,i}function ai(e){const t=e&&Array.isArray(e.entries)?e.entries:Array.isArray(e)?e:[],n=ti().split("?")[0],i=e&&e.generatedAt?new Date(e.generatedAt).toISOString():new Date().toISOString();let r=`<?xml version="1.0" encoding="utf-8"?>
`;r+=`<feed xmlns="http://www.w3.org/2005/Atom">
`,r+=`<title>${De("Sitemap Atom")}</title>
`,r+=`<link href="${De(n)}" />
`,r+=`<updated>${De(i)}</updated>
`,r+=`<id>${De(n)}</id>
`;for(const a of t)try{const s=String(a.loc||""),l=a&&a.lastmod?new Date(a.lastmod).toISOString():i;r+=`<entry>
`,r+=`<title>${De(String(a.title||a.slug||a.loc||""))}</title>
`,a.excerpt&&(r+=`<summary>${De(String(a.excerpt))}</summary>
`),r+=`<link href="${De(s)}" />
`,r+=`<id>${De(s)}</id>
`,r+=`<updated>${De(l)}</updated>
`,r+=`</entry>
`}catch{}return r+=`</feed>
`,r}function $a(e,t="application/xml"){try{try{document.open(t,"replace")}catch{try{document.open()}catch{}}document.write(e),document.close();try{if(typeof Blob<"u"&&typeof URL<"u"&&URL.createObjectURL){const n=new Blob([e],{type:t}),i=URL.createObjectURL(n);try{location.href=i}catch{try{window.open(i,"_self")}catch{}}setTimeout(()=>{try{URL.revokeObjectURL(i)}catch{}},5e3)}}catch{}}catch{try{try{const i=document.createElement("pre");try{i.textContent=De(e)}catch{try{i.textContent=String(e)}catch{}}if(document&&document.body)try{if(typeof document.body.replaceChildren=="function")document.body.replaceChildren(i);else{for(;document.body.firstChild;)document.body.removeChild(document.body.firstChild);document.body.appendChild(i)}}catch{try{document.body.innerHTML="<pre>"+De(e)+"</pre>"}catch{}}}catch{}}catch{}}}function Ia(e){try{const t=e&&Array.isArray(e.entries)?e.entries:Array.isArray(e)?e:[];let n='<!doctype html><html><head><meta charset="utf-8"><title>Sitemap</title></head><body>';n+="<h1>Sitemap</h1><ul>";for(const i of t)try{n+=`<li><a href="${De(String(i&&i.loc?i.loc:""))}">${De(String(i&&(i.title||i.slug)||i&&i.loc||""))}</a></li>`}catch{}return n+="</ul></body></html>",n}catch{return"<!doctype html><html><body><pre>failed to render sitemap</pre></body></html>"}}function lr(e,t="application/xml"){try{if(typeof window>"u"){try{let i=null;t==="application/rss+xml"?i=ii(e):t==="application/atom+xml"?i=ai(e):t==="text/html"?i=Ia(e):i=ri(e),$a(i,t);try{typeof window<"u"&&(window.__nimbiSitemapRenderedAt=Date.now(),window.__nimbiSitemapJson=e,window.__nimbiSitemapFinal=e.entries||[])}catch{}}catch{}return}const n=Array.isArray(e&&e.entries)?e.entries.length:0;try{const i=window.__nimbiSitemapPendingWrite||null;if((!i||typeof i.len=="number"&&i.len<n)&&(window.__nimbiSitemapPendingWrite={finalJson:e,mimeType:t,len:n}),window.__nimbiSitemapWriteTimer)return;window.__nimbiSitemapWriteTimer=setTimeout(()=>{try{const r=window.__nimbiSitemapPendingWrite;if(!r)return;let a=null;r.mimeType==="application/rss+xml"?a=ii(r.finalJson):r.mimeType==="application/atom+xml"?a=ai(r.finalJson):r.mimeType==="text/html"?a=Ia(r.finalJson):a=ri(r.finalJson);try{$a(a,r.mimeType)}catch{}try{window.__nimbiSitemapRenderedAt=Date.now(),window.__nimbiSitemapJson=r.finalJson,window.__nimbiSitemapFinal=r.finalJson.entries||[]}catch{}}catch{}try{clearTimeout(window.__nimbiSitemapWriteTimer)}catch{}window.__nimbiSitemapWriteTimer=null,window.__nimbiSitemapPendingWrite=null},40)}catch{}}catch{}}async function $l(e={}){try{if(typeof document>"u"||typeof location>"u")return!1;let t=!1,n=!1,i=!1,r=!1;try{const u=new URLSearchParams(location.search||"");if(u.has("sitemap")){let h=!0;for(const d of u.keys())d!=="sitemap"&&(h=!1);h&&(t=!0)}if(u.has("rss")){let h=!0;for(const d of u.keys())d!=="rss"&&(h=!1);h&&(n=!0)}if(u.has("atom")){let h=!0;for(const d of u.keys())d!=="atom"&&(h=!1);h&&(i=!0)}}catch{}if(!t&&!n&&!i){const h=(location.pathname||"/").replace(/\/\/+/g,"/").split("/").filter(Boolean).pop()||"";if(!h||(t=/^(sitemap|sitemap\.xml)$/i.test(h),n=/^(rss|rss\.xml)$/i.test(h),i=/^(atom|atom\.xml)$/i.test(h),r=/^(sitemap|sitemap\.html)$/i.test(h),!t&&!n&&!i&&!r))return!1}let a=[];const s=typeof e.waitForIndexMs=="number"?e.waitForIndexMs:1/0;try{if(typeof Nt=="function")try{const u=await Nt({timeoutMs:s,contentBase:e&&e.contentBase,indexDepth:e&&e.indexDepth,noIndexing:e&&e.noIndexing,startBuild:!0});if(Array.isArray(u)&&u.length)if(Array.isArray(e.index)&&e.index.length){const h=new Map;try{for(const d of e.index)try{d&&d.slug&&h.set(String(d.slug),d)}catch{}for(const d of u)try{d&&d.slug&&h.set(String(d.slug),d)}catch{}}catch{}a=Array.from(h.values())}else a=u;else a=Array.isArray(e.index)&&e.index.length?e.index:Array.isArray(re)&&re.length?re:[]}catch{a=Array.isArray(e.index)&&e.index.length?e.index:Array.isArray(re)&&re.length?re:[]}else a=Array.isArray(re)&&re.length?re:Array.isArray(e.index)&&e.index.length?e.index:[]}catch{a=Array.isArray(e.index)&&e.index.length?e.index:Array.isArray(re)&&re.length?re:[]}try{if(Array.isArray(e.index)&&e.index.length)try{const u=new Map;for(const h of e.index)try{if(!h||!h.slug)continue;const d=String(h.slug).split("::")[0];if(!u.has(d))u.set(d,h);else{const p=u.get(d);p&&String(p.slug||"").indexOf("::")!==-1&&String(h.slug||"").indexOf("::")===-1&&u.set(d,h)}}catch{}try{it(()=>"[runtimeSitemap] providedIndex.dedupedByBase: "+JSON.stringify(Array.from(u.values()),null,2))}catch{it(()=>"[runtimeSitemap] providedIndex.dedupedByBase (count): "+String(u.size))}}catch(u){zn("[runtimeSitemap] logging provided index failed",u)}}catch{}if((!Array.isArray(a)||!a.length)&&typeof Xt=="function")try{const u=typeof e.waitForIndexMs=="number"?e.waitForIndexMs:1/0;let h=null;try{typeof Nt=="function"&&(h=await Nt({timeoutMs:u,contentBase:e&&e.contentBase,indexDepth:e&&e.indexDepth,noIndexing:e&&e.noIndexing,startBuild:!0}))}catch{h=null}if(Array.isArray(h)&&h.length)a=h;else{const d=typeof e.indexDepth=="number"?e.indexDepth:3,p=Array.isArray(e.noIndexing)?e.noIndexing:void 0,f=[];e&&e.homePage&&f.push(e.homePage),e&&e.navigationPage&&f.push(e.navigationPage),a=await Xt(e&&e.contentBase?e.contentBase:void 0,d,p,f.length?f:void 0)}}catch(u){zn("[runtimeSitemap] rebuild index failed",u),a=Array.isArray(re)&&re.length?re:[]}try{const u=Array.isArray(a)?a.length:0;try{it(()=>"[runtimeSitemap] usedIndex.full.length (before rebuild): "+String(u))}catch{}try{it(()=>"[runtimeSitemap] usedIndex.full (before rebuild): "+JSON.stringify(a,null,2))}catch{}}catch{}try{const u=[];e&&e.homePage&&u.push(e.homePage),e&&e.navigationPage&&u.push(e.navigationPage);const h=typeof e.indexDepth=="number"?e.indexDepth:3,d=Array.isArray(e.noIndexing)?e.noIndexing:void 0;let p=null;try{const f=typeof globalThis<"u"&&typeof globalThis.buildSearchIndexWorker=="function"?globalThis.buildSearchIndexWorker:void 0;if(typeof f=="function")try{p=await f(e&&e.contentBase?e.contentBase:void 0,h,d)}catch{p=null}}catch{p=null}if((!p||!p.length)&&typeof Xt=="function")try{p=await Xt(e&&e.contentBase?e.contentBase:void 0,h,d,u.length?u:void 0)}catch{p=null}if(Array.isArray(p)&&p.length){const f=new Map;try{for(const y of a)try{y&&y.slug&&f.set(String(y.slug),y)}catch{}for(const y of p)try{y&&y.slug&&f.set(String(y.slug),y)}catch{}}catch{}a=Array.from(f.values())}}catch(u){try{zn("[runtimeSitemap] rebuild index call failed",u)}catch{}}try{const u=Array.isArray(a)?a.length:0;try{it(()=>"[runtimeSitemap] usedIndex.full.length (after rebuild): "+String(u))}catch{}try{it(()=>"[runtimeSitemap] usedIndex.full (after rebuild): "+JSON.stringify(a,null,2))}catch{}}catch{}const l=await ni(Object.assign({},e,{index:a}));let o=[];try{const u=new Set,h=Array.isArray(l&&l.entries)?l.entries:[];for(const d of h)try{let p=null;if(d&&d.slug)p=String(d.slug);else if(d&&d.loc)try{p=new URL(String(d.loc)).searchParams.get("page")}catch{}if(!p)continue;const f=String(p).split("::")[0];if(!u.has(f)){u.add(f);const y=Object.assign({},d);y.baseSlug=f,o.push(y)}}catch{}try{it(()=>"[runtimeSitemap] finalEntries.dedupedByBase: "+JSON.stringify(o,null,2))}catch{it(()=>"[runtimeSitemap] finalEntries.dedupedByBase (count): "+String(o.length))}}catch{try{o=Array.isArray(l&&l.entries)?l.entries.slice(0):[]}catch{o=[]}}const c=Object.assign({},l||{},{entries:Array.isArray(o)?o:Array.isArray(l&&l.entries)?l.entries:[]});try{if(typeof window<"u")try{window.__nimbiSitemapJson=c,window.__nimbiSitemapFinal=o}catch{}}catch{}if(n){const u=Array.isArray(c&&c.entries)?c.entries.length:0;let h=-1;try{typeof window<"u"&&Array.isArray(window.__nimbiSitemapFinal)&&typeof window.__nimbiSitemapRenderedAt=="number"&&(h=window.__nimbiSitemapFinal.length)}catch{}if(h>u){try{it("[runtimeSitemap] skip RSS write: existing rendered sitemap larger",h,u)}catch{}return!0}return lr(c,"application/rss+xml"),!0}if(i){const u=Array.isArray(c&&c.entries)?c.entries.length:0;let h=-1;try{typeof window<"u"&&Array.isArray(window.__nimbiSitemapFinal)&&typeof window.__nimbiSitemapRenderedAt=="number"&&(h=window.__nimbiSitemapFinal.length)}catch{}if(h>u){try{it("[runtimeSitemap] skip Atom write: existing rendered sitemap larger",h,u)}catch{}return!0}return lr(c,"application/atom+xml"),!0}if(t){const u=Array.isArray(c&&c.entries)?c.entries.length:0;let h=-1;try{typeof window<"u"&&Array.isArray(window.__nimbiSitemapFinal)&&typeof window.__nimbiSitemapRenderedAt=="number"&&(h=window.__nimbiSitemapFinal.length)}catch{}if(h>u){try{it("[runtimeSitemap] skip XML write: existing rendered sitemap larger",h,u)}catch{}return!0}return lr(c,"application/xml"),!0}if(r)try{const h=(Array.isArray(c&&c.entries)?c.entries:[]).length;let d=-1;try{typeof window<"u"&&Array.isArray(window.__nimbiSitemapFinal)&&typeof window.__nimbiSitemapRenderedAt=="number"&&(d=window.__nimbiSitemapFinal.length)}catch{}if(d>h){try{it("[runtimeSitemap] skip HTML write: existing rendered sitemap larger",d,h)}catch{}return!0}return lr(c,"text/html"),!0}catch(u){return zn("[runtimeSitemap] render HTML failed",u),!1}return!1}catch(t){return zn("[runtimeSitemap] handleSitemapRequest failed",t),!1}}async function Il(e={}){try{const t=typeof e.waitForIndexMs=="number"?e.waitForIndexMs:1/0;let n=[];try{if(typeof Nt=="function")try{const s=await Nt({timeoutMs:t,contentBase:e&&e.contentBase,indexDepth:e&&e.indexDepth,noIndexing:e&&e.noIndexing,startBuild:!0});Array.isArray(s)&&s.length&&(n=s)}catch{}}catch{}(!Array.isArray(n)||!n.length)&&Array.isArray(re)&&re.length&&(n=re),(!Array.isArray(n)||!n.length)&&Array.isArray(e.index)&&e.index.length&&(n=e.index);const i=await ni(Object.assign({},e,{index:n}));let r=[];try{const s=new Set,l=Array.isArray(i&&i.entries)?i.entries:[];for(const o of l)try{let c=null;if(o&&o.slug)c=String(o.slug);else if(o&&o.loc)try{c=new URL(String(o.loc)).searchParams.get("page")}catch{c=null}if(!c)continue;const u=String(c).split("::")[0];if(!s.has(u)){s.add(u);const h=Object.assign({},o);h.baseSlug=u,r.push(h)}}catch{}}catch{try{r=Array.isArray(i&&i.entries)?i.entries.slice(0):[]}catch{r=[]}}const a=Object.assign({},i||{},{entries:Array.isArray(r)?r:Array.isArray(i&&i.entries)?i.entries:[]});try{if(typeof window<"u")try{window.__nimbiSitemapJson=a,window.__nimbiSitemapFinal=r}catch{}}catch{}return{json:a,deduped:r}}catch{return null}}const Pn=Object.freeze(Object.defineProperty({__proto__:null,exposeSitemapGlobals:Il,generateAtomXml:ai,generateRssXml:ii,generateSitemapJson:ni,generateSitemapXml:ri,handleSitemapRequest:$l},Symbol.toStringTag,{value:"Module"}));Be.BAD_LANGUAGES=wr,Be.SUPPORTED_HLJS_MAP=ve,Be._clearHooks=Ya,Be.addHook=Bn,Be.default=Ra,Be.ensureBulma=xi,Be.getVersion=za,Be.initCMS=Ra,Be.loadL10nFile=xr,Be.loadSupportedLanguages=_r,Be.observeCodeBlocks=ki,Be.onNavBuild=Qa,Be.onPageLoad=Xa,Be.registerLanguage=Jt,Be.runHooks=gr,Be.setHighlightTheme=as,Be.setLang=Sr,Be.setStyle=Si,Be.setThemeVars=os,Be.t=tn,Be.transformHtml=Ka,Object.defineProperties(Be,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})}));
