Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const _=require("./rolldown-runtime-DGqZhkpL.cjs");function Nl(e,t="ERR_ITEM"){return!e||typeof e!="object"?{error:!0,code:t,message:e?String(e):void 0,stack:void 0}:{error:!0,code:e.code||t,message:e.message,stack:e.stack}}function fa(e){return!e||!e.error?String(e):`${e.code||"ERR"}: ${e.message||""}`}var ji=null;if(typeof process<"u"&&process?.hrtime&&typeof process.hrtime.bigint=="function")try{const e=Number(process.hrtime.bigint()/1000000n);ji=Date.now()-e}catch{ji=null}var qe=()=>{const e=Date.now();if(typeof performance<"u"&&typeof performance?.now=="function"&&typeof performance?.timeOrigin=="number")try{const t=performance.timeOrigin+performance.now();return Math.abs(t-e)<1e3?t:e}catch{}if(ji!=null)try{const t=Number(process.hrtime.bigint()/1000000n)+ji;return Math.abs(t-e)<1e3?t:e}catch{return e}return e},Yn=Object.freeze({error:"error",warn:"warn",info:"info",log:"log",debug:"debug",table:"table"}),Il=()=>typeof globalThis<"u"&&globalThis?.console?globalThis.console:typeof self<"u"&&self?.console?self.console:typeof window<"u"&&window?.console?window.console:typeof global<"u"&&global?.console?global.console:null,Ht=Il();function Ol(e){try{return JSON.stringify(e)}catch{try{const n=typeof WeakSet=="function"?new WeakSet:new Set;return JSON.stringify(e,function(r,i){if(i&&typeof i=="object"){if(n.has(i))return"[Circular]";n.add(i)}return typeof i=="function"?`[Function: ${i.name||"anonymous"}]`:typeof i=="symbol"?String(i):typeof i=="bigint"?i.toString()+"n":i})}catch{try{return String(e)}catch{return"[Unserializable]"}}}}var wo=class{constructor(e=0,t={}){this._debugLevel=0,this._counters=Object.create(null),this._format=t?.format||"text",this.name=t?.name||null,this._formatter=typeof t?.formatter=="function"?t.formatter:null,this._output=typeof t?.output=="function"?t.output:null,this.setDebugLevel(e)}setDebugLevel(e){let t=NaN;typeof e=="number"?t=e:typeof e=="string"||typeof e=="boolean"?t=Number(e):(e instanceof Number||e instanceof String||e instanceof Boolean)&&(t=Number(e.valueOf())),this._debugLevel=Number.isFinite(t)&&t>=0?Math.max(0,Math.min(3,Math.floor(t))):0}getDebugLevel(){return this._debugLevel}isDebugLevel(e=1){return Number(this._debugLevel)>=Number(e||1)}isDebug(){return this.isDebugLevel(1)}_resolveLogArgs(e){return e.map(t=>{if(typeof t=="function")try{return t()}catch(n){return n}return t})}_emit(e,t,n,r,i={}){if(!this.isDebugLevel(e))return;const s=this._resolveLogArgs(r);let o={level:n,msg:i.msgArray?s:s.length===1?s[0]:s,ts:qe(),format:this._format};if(this.name&&(o.name=this.name),this._formatter)try{const a=this._formatter(o);if(a!=null){if(typeof a=="string"){if(this._output){try{this._output(a)}catch{}return}typeof Ht?.[t]=="function"&&Ht[t](a);return}o=a}}catch{}if(this._output){try{this._output(o)}catch{}return}if(typeof Ht?.[t]=="function")if(this._format==="json")try{const a=typeof o=="string"?o:Ol(o);Ht[t](a)}catch{try{Ht[t](...Array.isArray(s)?s:[s])}catch{}}else Ht[t](...s)}error(...e){const t=e.map(n=>{try{if(n?.error)return fa(n);if(n instanceof Error||n&&typeof n=="object")return fa(Nl(n))}catch{}return n});this._emit(1,"error",Yn.error,t)}warn(...e){this._emit(2,"warn",Yn.warn,e)}info(...e){this._emit(3,"info",Yn.info,e)}log(...e){this._emit(3,"log",Yn.log,e)}debug(...e){this._emit(3,"debug",Yn.debug,e)}table(...e){if(!this.isDebugLevel(3)||!Ht)return;if(this._format==="json"){this._emit(3,"log",Yn.table,e,{msgArray:!0});return}const t=this._resolveLogArgs(e);typeof Ht.table=="function"?Ht.table(...t):typeof Ht.log=="function"&&Ht.log(...t)}incrementCounter(e){if(!this.isDebug())return;const t=String(e||"");t&&(this._counters[t]=(this._counters[t]||0)+1)}getDebugCounters(){return Object.assign({},this._counters)}resetDebugCounters(){this._counters=Object.create(null)}},jn=new wo(0);function zl(e){jn.setDebugLevel(e)}function So(e=1){return jn.isDebugLevel(e)}function vo(){return jn.isDebug()}function Pr(...e){jn.error(...e)}function k(...e){jn.warn(...e)}function wn(...e){jn.info(...e)}function ge(...e){jn.log(...e)}function ko(e){jn.incrementCounter(e)}var Br={onPageLoad:[],onNavBuild:[],transformHtml:[]};function Wi(e,t){if(!Object.prototype.hasOwnProperty.call(Br,e))throw new Error('Unknown hook "'+e+'"');if(typeof t!="function")throw new TypeError("hook callback must be a function");Br[e].push(t)}function ql(e){Wi("onPageLoad",e)}function $l(e){Wi("onNavBuild",e)}function Dl(e){Wi("transformHtml",e)}async function ws(e,t){const n=Br[e]||[];for(const r of n)try{await r(t)}catch(i){try{k("[nimbi-cms] runHooks callback failed",i)}catch{}}}function Bl(){Object.keys(Br).forEach(e=>{Br[e].length=0})}var Ul=_.__commonJSMin(((e,t)=>{function n(x){return x instanceof Map?x.clear=x.delete=x.set=function(){throw new Error("map is read-only")}:x instanceof Set&&(x.add=x.clear=x.delete=function(){throw new Error("set is read-only")}),Object.freeze(x),Object.getOwnPropertyNames(x).forEach(X=>{const de=x[X],je=typeof de;(je==="object"||je==="function")&&!Object.isFrozen(de)&&n(de)}),x}var r=class{constructor(x){x.data===void 0&&(x.data={}),this.data=x.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}};function i(x){return x.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function s(x,...X){const de=Object.create(null);for(const je in x)de[je]=x[je];return X.forEach(function(je){for(const We in je)de[We]=je[We]}),de}var o="</span>",a=x=>!!x.scope,l=(x,{prefix:X})=>{if(x.startsWith("language:"))return x.replace("language:","language-");if(x.includes(".")){const de=x.split(".");return[`${X}${de.shift()}`,...de.map((je,We)=>`${je}${"_".repeat(We+1)}`)].join(" ")}return`${X}${x}`},c=class{constructor(x,X){this.buffer="",this.classPrefix=X.classPrefix,x.walk(this)}addText(x){this.buffer+=i(x)}openNode(x){if(!a(x))return;const X=l(x.scope,{prefix:this.classPrefix});this.span(X)}closeNode(x){a(x)&&(this.buffer+=o)}value(){return this.buffer}span(x){this.buffer+=`<span class="${x}">`}},u=(x={})=>{const X={children:[]};return Object.assign(X,x),X},d=class xo{constructor(){this.rootNode=u(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(X){this.top.children.push(X)}openNode(X){const de=u({scope:X});this.add(de),this.stack.push(de)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(X){return this.constructor._walk(X,this.rootNode)}static _walk(X,de){return typeof de=="string"?X.addText(de):de.children&&(X.openNode(de),de.children.forEach(je=>this._walk(X,je)),X.closeNode(de)),X}static _collapse(X){typeof X!="string"&&X.children&&(X.children.every(de=>typeof de=="string")?X.children=[X.children.join("")]:X.children.forEach(de=>{xo._collapse(de)}))}},f=class extends d{constructor(x){super(),this.options=x}addText(x){x!==""&&this.add(x)}startScope(x){this.openNode(x)}endScope(){this.closeNode()}__addSublanguage(x,X){const de=x.root;X&&(de.scope=`language:${X}`),this.add(de)}toHTML(){return new c(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}};function g(x){return x?typeof x=="string"?x:x.source:null}function m(x){return h("(?=",x,")")}function p(x){return h("(?:",x,")*")}function y(x){return h("(?:",x,")?")}function h(...x){return x.map(X=>g(X)).join("")}function w(x){const X=x[x.length-1];return typeof X=="object"&&X.constructor===Object?(x.splice(x.length-1,1),X):{}}function b(...x){return"("+(w(x).capture?"":"?:")+x.map(X=>g(X)).join("|")+")"}function S(x){return new RegExp(x.toString()+"|").exec("").length-1}function A(x,X){const de=x&&x.exec(X);return de&&de.index===0}var z=new RegExp(b(/\[(?:[^\\\]]|\\.)*\]/,/\(\?<(?![=!])[^>]+>/,/\(\?'[^']+'/,/\(\??/,/\\([1-9][0-9]*)/,/\\./));function U(x,{joinWith:X}){let de=0;return x.map(je=>{de+=1;const We=de;let Ve=g(je),ye="";for(;Ve.length>0;){const pe=z.exec(Ve);if(!pe){ye+=Ve;break}ye+=Ve.substring(0,pe.index),Ve=Ve.substring(pe.index+pe[0].length),pe[0][0]==="\\"&&pe[1]?ye+="\\"+String(Number(pe[1])+We):(ye+=pe[0],(pe[0]==="("||/^\(\?[<']/.test(pe[0]))&&de++)}return ye}).map(je=>`(${je})`).join(X)}var W=/\b\B/,Y="[a-zA-Z]\\w*",ae="[a-zA-Z_]\\w*",he="\\b\\d+(\\.\\d+)?",ie="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",R="\\b(0b[01]+)",N="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",M=(x={})=>{const X=/^#![ ]*\//;return x.binary&&(x.begin=h(X,/.*\b/,x.binary,/\b.*/)),s({scope:"meta",begin:X,end:/$/,relevance:0,"on:begin":(de,je)=>{de.index!==0&&je.ignoreMatch()}},x)},T={begin:"\\\\[\\s\\S]",relevance:0},I={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[T]},Q={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[T]},q={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},ne=function(x,X,de={}){const je=s({scope:"comment",begin:x,end:X,contains:[]},de);je.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const We=b("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return je.contains.push({begin:h(/[ ]+/,"(",We,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),je},le=ne("//","$"),_e=ne("/\\*","\\*/"),fe=ne("#","$"),xe={scope:"number",begin:he,relevance:0},$e={scope:"number",begin:ie,relevance:0},ce={scope:"number",begin:R,relevance:0},De={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[T,{begin:/\[/,end:/\]/,relevance:0,contains:[T]}]},et={scope:"title",begin:Y,relevance:0},ot={scope:"title",begin:ae,relevance:0},E={begin:"\\.\\s*[a-zA-Z_]\\w*",relevance:0},L=function(x){return Object.assign(x,{"on:begin":(X,de)=>{de.data._beginMatch=X[1]},"on:end":(X,de)=>{de.data._beginMatch!==X[1]&&de.ignoreMatch()}})},H=Object.freeze({__proto__:null,APOS_STRING_MODE:I,BACKSLASH_ESCAPE:T,BINARY_NUMBER_MODE:ce,BINARY_NUMBER_RE:R,COMMENT:ne,C_BLOCK_COMMENT_MODE:_e,C_LINE_COMMENT_MODE:le,C_NUMBER_MODE:$e,C_NUMBER_RE:ie,END_SAME_AS_BEGIN:L,HASH_COMMENT_MODE:fe,IDENT_RE:Y,MATCH_NOTHING_RE:W,METHOD_GUARD:E,NUMBER_MODE:xe,NUMBER_RE:he,PHRASAL_WORDS_MODE:q,QUOTE_STRING_MODE:Q,REGEXP_MODE:De,RE_STARTERS_RE:N,SHEBANG:M,TITLE_MODE:et,UNDERSCORE_IDENT_RE:ae,UNDERSCORE_TITLE_MODE:ot});function $(x,X){x.input[x.index-1]==="."&&X.ignoreMatch()}function P(x,X){x.className!==void 0&&(x.scope=x.className,delete x.className)}function D(x,X){X&&x.beginKeywords&&(x.begin="\\b("+x.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",x.__beforeBegin=$,x.keywords=x.keywords||x.beginKeywords,delete x.beginKeywords,x.relevance===void 0&&(x.relevance=0))}function O(x,X){Array.isArray(x.illegal)&&(x.illegal=b(...x.illegal))}function J(x,X){if(x.match){if(x.begin||x.end)throw new Error("begin & end are not supported with match");x.begin=x.match,delete x.match}}function B(x,X){x.relevance===void 0&&(x.relevance=1)}var G=(x,X)=>{if(!x.beforeMatch)return;if(x.starts)throw new Error("beforeMatch cannot be used with starts");const de=Object.assign({},x);Object.keys(x).forEach(je=>{delete x[je]}),x.keywords=de.keywords,x.begin=h(de.beforeMatch,m(de.begin)),x.starts={relevance:0,contains:[Object.assign(de,{endsParent:!0})]},x.relevance=0,delete de.beforeMatch},V=["of","and","for","in","not","or","if","then","parent","list","value"],se="keyword";function me(x,X,de=se){const je=Object.create(null);return typeof x=="string"?We(de,x.split(" ")):Array.isArray(x)?We(de,x):Object.keys(x).forEach(function(Ve){Object.assign(je,me(x[Ve],X,Ve))}),je;function We(Ve,ye){X&&(ye=ye.map(pe=>pe.toLowerCase())),ye.forEach(function(pe){const Te=pe.split("|");je[Te[0]]=[Ve,Ce(Te[0],Te[1])]})}}function Ce(x,X){return X?Number(X):Re(x)?0:1}function Re(x){return V.includes(x.toLowerCase())}var Ie={},Ee=x=>{console.error(x)},He=(x,...X)=>{console.log(`WARN: ${x}`,...X)},Be=(x,X)=>{Ie[`${x}/${X}`]||(console.log(`Deprecated as of ${x}. ${X}`),Ie[`${x}/${X}`]=!0)},Wt=new Error;function Pn(x,X,{key:de}){let je=0;const We=x[de],Ve={},ye={};for(let pe=1;pe<=X.length;pe++)ye[pe+je]=We[pe],Ve[pe+je]=!0,je+=S(X[pe-1]);x[de]=ye,x[de]._emit=Ve,x[de]._multi=!0}function Gn(x){if(Array.isArray(x.begin)){if(x.skip||x.excludeBegin||x.returnBegin)throw Ee("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),Wt;if(typeof x.beginScope!="object"||x.beginScope===null)throw Ee("beginScope must be object"),Wt;Pn(x,x.begin,{key:"beginScope"}),x.begin=U(x.begin,{joinWith:""})}}function lr(x){if(Array.isArray(x.end)){if(x.skip||x.excludeEnd||x.returnEnd)throw Ee("skip, excludeEnd, returnEnd not compatible with endScope: {}"),Wt;if(typeof x.endScope!="object"||x.endScope===null)throw Ee("endScope must be object"),Wt;Pn(x,x.end,{key:"endScope"}),x.end=U(x.end,{joinWith:""})}}function ln(x){x.scope&&typeof x.scope=="object"&&x.scope!==null&&(x.beginScope=x.scope,delete x.scope)}function Vn(x){ln(x),typeof x.beginScope=="string"&&(x.beginScope={_wrap:x.beginScope}),typeof x.endScope=="string"&&(x.endScope={_wrap:x.endScope}),Gn(x),lr(x)}function Zn(x){function X(ye,pe){return new RegExp(g(ye),"m"+(x.case_insensitive?"i":"")+(x.unicodeRegex?"u":"")+(pe?"g":""))}class de{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(pe,Te){Te.position=this.position++,this.matchIndexes[this.matchAt]=Te,this.regexes.push([Te,pe]),this.matchAt+=S(pe)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const pe=this.regexes.map(Te=>Te[1]);this.matcherRe=X(U(pe,{joinWith:"|"}),!0),this.lastIndex=0}exec(pe){this.matcherRe.lastIndex=this.lastIndex;const Te=this.matcherRe.exec(pe);if(!Te)return null;const at=Te.findIndex((cn,Ln)=>Ln>0&&cn!==void 0),Je=this.matchIndexes[at];return Te.splice(0,at),Object.assign(Te,Je)}}class je{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(pe){if(this.multiRegexes[pe])return this.multiRegexes[pe];const Te=new de;return this.rules.slice(pe).forEach(([at,Je])=>Te.addRule(at,Je)),Te.compile(),this.multiRegexes[pe]=Te,Te}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(pe,Te){this.rules.push([pe,Te]),Te.type==="begin"&&this.count++}exec(pe){const Te=this.getMatcher(this.regexIndex);Te.lastIndex=this.lastIndex;let at=Te.exec(pe);if(this.resumingScanAtSamePosition()&&!(at&&at.index===this.lastIndex)){const Je=this.getMatcher(0);Je.lastIndex=this.lastIndex+1,at=Je.exec(pe)}return at&&(this.regexIndex+=at.position+1,this.regexIndex===this.count&&this.considerAll()),at}}function We(ye){const pe=new je;return ye.contains.forEach(Te=>pe.addRule(Te.begin,{rule:Te,type:"begin"})),ye.terminatorEnd&&pe.addRule(ye.terminatorEnd,{type:"end"}),ye.illegal&&pe.addRule(ye.illegal,{type:"illegal"}),pe}function Ve(ye,pe){const Te=ye;if(ye.isCompiled)return Te;[P,J,Vn,G].forEach(Je=>Je(ye,pe)),x.compilerExtensions.forEach(Je=>Je(ye,pe)),ye.__beforeBegin=null,[D,O,B].forEach(Je=>Je(ye,pe)),ye.isCompiled=!0;let at=null;return typeof ye.keywords=="object"&&ye.keywords.$pattern&&(ye.keywords=Object.assign({},ye.keywords),at=ye.keywords.$pattern,delete ye.keywords.$pattern),at=at||/\w+/,ye.keywords&&(ye.keywords=me(ye.keywords,x.case_insensitive)),Te.keywordPatternRe=X(at,!0),pe&&(ye.begin||(ye.begin=/\B|\b/),Te.beginRe=X(Te.begin),!ye.end&&!ye.endsWithParent&&(ye.end=/\B|\b/),ye.end&&(Te.endRe=X(Te.end)),Te.terminatorEnd=g(Te.end)||"",ye.endsWithParent&&pe.terminatorEnd&&(Te.terminatorEnd+=(ye.end?"|":"")+pe.terminatorEnd)),ye.illegal&&(Te.illegalRe=X(ye.illegal)),ye.contains||(ye.contains=[]),ye.contains=[].concat(...ye.contains.map(function(Je){return ti(Je==="self"?ye:Je)})),ye.contains.forEach(function(Je){Ve(Je,Te)}),ye.starts&&Ve(ye.starts,pe),Te.matcher=We(Te),Te}if(x.compilerExtensions||(x.compilerExtensions=[]),x.contains&&x.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return x.classNameAliases=s(x.classNameAliases||{}),Ve(x)}function cr(x){return x?x.endsWithParent||cr(x.starts):!1}function ti(x){return x.variants&&!x.cachedVariants&&(x.cachedVariants=x.variants.map(function(X){return s(x,{variants:null},X)})),x.cachedVariants?x.cachedVariants:cr(x)?s(x,{starts:x.starts?s(x.starts):null}):Object.isFrozen(x)?s(x):x}var ni="11.12.0",ur=class extends Error{constructor(x,X){super(x),this.name="HTMLInjectionError",this.html=X}},Rn=i,en=s,tn=Symbol("nomatch"),ri=7,hr=function(x){const X=Object.create(null),de=Object.create(null),je=[];let We=!0;const Ve="Could not find the language '{}', did you forget to load/include a language module?",ye={disableAutodetect:!0,name:"Plain text",contains:[]};let pe={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:f};function Te(ee){return pe.noHighlightRe.test(ee)}function at(ee){let ve=ee.className+" ";ve+=ee.parentNode?ee.parentNode.className:"";const Ne=pe.languageDetectRe.exec(ve);if(Ne){const Ze=Zt(Ne[1]);return Ze||(He(Ve.replace("{}",Ne[1])),He("Falling back to no-highlight mode for this block.",ee)),Ze?Ne[1]:"no-highlight"}return ve.split(/\s+/).find(Ze=>Te(Ze)||Zt(Ze))}function Je(ee,ve,Ne){let Ze="",nt="";typeof ve=="object"?(Ze=ee,Ne=ve.ignoreIllegals,nt=ve.language):(Be("10.7.0","highlight(lang, code, ...args) has been deprecated."),Be("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),nt=ee,Ze=ve),Ne===void 0&&(Ne=!0);const Mt={code:Ze,language:nt};rn("before:highlight",Mt);const At=Mt.result?Mt.result:cn(Mt.language,Mt.code,Ne);return At.code=Mt.code,rn("after:highlight",At),At}function cn(ee,ve,Ne,Ze){const nt=Object.create(null);function Mt(C,F){return C.keywords[F]}function At(){if(!Me.keywords){rt.addText(Ge);return}let C=0;Me.keywordPatternRe.lastIndex=0;let F=Me.keywordPatternRe.exec(Ge),ue="";for(;F;){ue+=Ge.substring(C,F.index);const we=Dt.case_insensitive?F[0].toLowerCase():F[0],Le=Mt(Me,we);if(Le){const[it,kt]=Le;if(rt.addText(ue),ue="",nt[we]=(nt[we]||0)+1,nt[we]<=ri&&(K+=kt),it.startsWith("_"))ue+=F[0];else{const dn=Dt.classNameAliases[it]||it;Ft(F[0],dn)}}else ue+=F[0];C=Me.keywordPatternRe.lastIndex,F=Me.keywordPatternRe.exec(Ge)}ue+=Ge.substring(C),rt.addText(ue)}function jt(){if(Ge==="")return;let C=null;if(typeof Me.subLanguage=="string"){if(!X[Me.subLanguage]){rt.addText(Ge);return}C=cn(Me.subLanguage,Ge,!0,_r[Me.subLanguage]),_r[Me.subLanguage]=C._top}else C=fr(Ge,Me.subLanguage.length?Me.subLanguage:null);Me.relevance>0&&(K+=C.relevance),rt.__addSublanguage(C._emitter,C.language)}function bt(){Me.subLanguage!=null?jt():At(),Ge=""}function Ft(C,F){C!==""&&(rt.startScope(F),rt.addText(C),rt.endScope())}function hn(C,F){let ue=1;const we=F.length-1;for(;ue<=we;){if(!C._emit[ue]){ue++;continue}const Le=Dt.classNameAliases[C[ue]]||C[ue],it=F[ue];Le?Ft(it,Le):(Ge=it,At(),Ge=""),ue++}}function Pt(C,F){return C.scope&&typeof C.scope=="string"&&rt.openNode(Dt.classNameAliases[C.scope]||C.scope),C.beginScope&&(C.beginScope._wrap?(Ft(Ge,Dt.classNameAliases[C.beginScope._wrap]||C.beginScope._wrap),Ge=""):C.beginScope._multi&&(hn(C.beginScope,F),Ge="")),Me=Object.create(C,{parent:{value:Me}}),Me}function ui(C,F,ue){let we=A(C.endRe,ue);if(we){if(C["on:end"]){const Le=new r(C);C["on:end"](F,Le),Le.isMatchIgnored&&(we=!1)}if(we){for(;C.endsParent&&C.parent;)C=C.parent;return C}}if(C.endsWithParent)return ui(C.parent,F,ue)}function Xn(C){return Me.matcher.regexIndex===0?(Ge+=C[0],1):(Z=!0,0)}function Ki(C){const F=C[0],ue=C.rule,we=new r(ue),Le=[ue.__beforeBegin,ue["on:begin"]];for(const it of Le)if(it&&(it(C,we),we.isMatchIgnored))return Xn(F);return ue.skip?Ge+=F:(ue.excludeBegin&&(Ge+=F),bt(),!ue.returnBegin&&!ue.excludeBegin&&(Ge=F)),Pt(ue,C),ue.returnBegin?0:F.length}function hi(C){const F=C[0],ue=ve.substring(C.index),we=ui(Me,C,ue);if(!we)return tn;const Le=Me;Me.endScope&&Me.endScope._wrap?(bt(),Ft(F,Me.endScope._wrap)):Me.endScope&&Me.endScope._multi?(bt(),hn(Me.endScope,C)):Le.skip?Ge+=F:(Le.returnEnd||Le.excludeEnd||(Ge+=F),bt(),Le.excludeEnd&&(Ge=F));do Me.scope&&rt.closeNode(),!Me.skip&&!Me.subLanguage&&(K+=Me.relevance),Me=Me.parent;while(Me!==we.parent);return we.starts&&Pt(we.starts,C),Le.returnEnd?0:F.length}function fn(){const C=[];for(let F=Me;F!==Dt;F=F.parent)F.scope&&C.unshift(F.scope);C.forEach(F=>rt.openNode(F))}let In={};function pr(C,F){const ue=F&&F[0];if(Ge+=C,ue==null)return bt(),0;if(In.type==="begin"&&F.type==="end"&&In.index===F.index&&ue===""){if(Ge+=ve.slice(F.index,F.index+1),!We){const we=new Error(`0 width match regex (${ee})`);throw we.languageName=ee,we.badRule=In.rule,we}return 1}if(In=F,F.type==="begin")return Ki(F);if(F.type==="illegal"&&!Ne){const we=new Error('Illegal lexeme "'+ue+'" for mode "'+(Me.scope||"<unnamed>")+'"');throw we.mode=Me,we}else if(F.type==="end"){const we=hi(F);if(we!==tn)return we}if(F.type==="illegal"&&ue==="")return F.index===ve.length||(Ge+=`
`),1;if(j>1e5&&j>F.index*3)throw new Error("potential infinite loop, way more iterations than matches");return Ge+=ue,ue.length}const Dt=Zt(ee);if(!Dt)throw Ee(Ve.replace("{}",ee)),new Error('Unknown language: "'+ee+'"');const fi=Zn(Dt);let mr="",Me=Ze||fi;const _r={},rt=new pe.__emitter(pe);fn();let Ge="",K=0,v=0,j=0,Z=!1;try{if(Dt.__emitTokens)Dt.__emitTokens(ve,rt);else{for(Me.matcher.considerAll();;){j++,Z?Z=!1:Me.matcher.considerAll(),Me.matcher.lastIndex=v;const C=Me.matcher.exec(ve);if(!C)break;const F=pr(ve.substring(v,C.index),C);v=C.index+F}pr(ve.substring(v))}return rt.finalize(),mr=rt.toHTML(),{language:ee,value:mr,relevance:K,illegal:!1,_emitter:rt,_top:Me}}catch(C){if(C.message&&C.message.includes("Illegal"))return{language:ee,value:Rn(ve),illegal:!0,relevance:0,_illegalBy:{message:C.message,index:v,context:ve.slice(v-100,v+100),mode:C.mode,resultSoFar:mr},_emitter:rt};if(We)return{language:ee,value:Rn(ve),illegal:!1,relevance:0,errorRaised:C,_emitter:rt,_top:Me};throw C}}function Ln(ee){const ve={value:Rn(ee),illegal:!1,relevance:0,_top:ye,_emitter:new pe.__emitter(pe)};return ve._emitter.addText(ee),ve}function fr(ee,ve){ve=ve||pe.languages||Object.keys(X);const Ne=Ln(ee),Ze=ve.filter(Zt).filter(li).map(jt=>cn(jt,ee,!1));Ze.unshift(Ne);const[nt,Mt]=Ze.sort((jt,bt)=>{if(jt.relevance!==bt.relevance)return bt.relevance-jt.relevance;if(jt.language&&bt.language){if(Zt(jt.language).supersetOf===bt.language)return 1;if(Zt(bt.language).supersetOf===jt.language)return-1}return 0}),At=nt;return At.secondBest=Mt,At}function Cn(ee,ve,Ne){const Ze=ve&&de[ve]||Ne;ee.classList.add("hljs"),ee.classList.add(`language-${Ze}`)}function dr(ee){let ve=null;const Ne=at(ee);if(Te(Ne))return;if(rn("before:highlightElement",{el:ee,language:Ne}),ee.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",ee);return}if(ee.children.length>0&&(pe.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(ee)),pe.throwUnescapedHTML))throw new ur("One of your code blocks includes unescaped HTML.",ee.innerHTML);ve=ee;const Ze=ve.textContent,nt=Ne?Je(Ze,{language:Ne,ignoreIllegals:!0}):fr(Ze);ee.innerHTML=nt.value,ee.dataset.highlighted="yes",Cn(ee,Ne,nt.language),ee.result={language:nt.language,re:nt.relevance,relevance:nt.relevance},nt.secondBest&&(ee.secondBest={language:nt.secondBest.language,relevance:nt.secondBest.relevance}),rn("after:highlightElement",{el:ee,result:nt,text:Ze})}function Yi(ee){pe=en(pe,ee)}const tt=()=>{Nn(),Be("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function un(){Nn(),Be("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let ii=!1;function Nn(){function ee(){Nn()}if(document.readyState==="loading"){ii||window.addEventListener("DOMContentLoaded",ee,!1),ii=!0;return}document.querySelectorAll(pe.cssSelector).forEach(dr)}function gr(ee,ve){let Ne=null;try{Ne=ve(x)}catch(Ze){if(Ee("Language definition for '{}' could not be registered.".replace("{}",ee)),We)Ee(Ze);else throw Ze;Ne=ye}Ne.name||(Ne.name=ee),X[ee]=Ne,Ne.rawDefinition=ve.bind(null,x),Ne.aliases&&oi(Ne.aliases,{languageName:ee})}function si(ee){delete X[ee];for(const ve of Object.keys(de))de[ve]===ee&&delete de[ve]}function ai(){return Object.keys(X)}function Zt(ee){return ee=(ee||"").toLowerCase(),X[ee]||X[de[ee]]}function oi(ee,{languageName:ve}){typeof ee=="string"&&(ee=[ee]),ee.forEach(Ne=>{de[Ne.toLowerCase()]=ve})}function li(ee){const ve=Zt(ee);return ve&&!ve.disableAutodetect}function Qi(ee){ee["before:highlightBlock"]&&!ee["before:highlightElement"]&&(ee["before:highlightElement"]=ve=>{ee["before:highlightBlock"](Object.assign({block:ve.el},ve))}),ee["after:highlightBlock"]&&!ee["after:highlightElement"]&&(ee["after:highlightElement"]=ve=>{ee["after:highlightBlock"](Object.assign({block:ve.el},ve))})}function Xt(ee){Qi(ee),je.push(ee)}function ci(ee){const ve=je.indexOf(ee);ve!==-1&&je.splice(ve,1)}function rn(ee,ve){const Ne=ee;je.forEach(function(Ze){Ze[Ne]&&Ze[Ne](ve)})}function sn(ee){return Be("10.7.0","highlightBlock will be removed entirely in v12.0"),Be("10.7.0","Please use highlightElement now."),dr(ee)}Object.assign(x,{highlight:Je,highlightAuto:fr,highlightAll:Nn,highlightElement:dr,highlightBlock:sn,configure:Yi,initHighlighting:tt,initHighlightingOnLoad:un,registerLanguage:gr,unregisterLanguage:si,listLanguages:ai,getLanguage:Zt,registerAliases:oi,autoDetection:li,inherit:en,addPlugin:Xt,removePlugin:ci}),x.debugMode=function(){We=!1},x.safeMode=function(){We=!0},x.versionString=ni,x.regex={concat:h,lookahead:m,either:b,optional:y,anyNumberOfTimes:p};for(const ee in H)typeof H[ee]=="object"&&n(H[ee]);return Object.assign(x,H),x},nn=hr({});nn.newInstance=()=>hr({}),t.exports=nn,nn.HighlightJS=nn,nn.default=nn})),Wl=_.__toESM(Ul()),Ye=Wl.default,Fi=1e3,Fl=60*Fi,Ss=30*Fi,Hl=1e4,da=1e3;var Gl=60*Fi,Vl=1e3,ga=Fl,Zl=1e3,Xl=5e3,Zr=class{constructor({maxEntries:e=1/0,maxWeight:t=1/0,weightFn:n=()=>1,defaultTTL:r=ga,maxPoolSize:i=Vl,rejectOversized:s=!1,onEvict:o=null,onExpire:a=null,initialPoolSize:l=0,maxCleanupPerTick:c=100,eagerCleanupOnRead:u=!1,defaultAsyncTimeout:d=Ss}={}){if(arguments.length>0&&arguments[0]!=null&&typeof arguments[0]!="object")throw new TypeError("PowerCache options must be an object");this.maxEntries=e,this.maxWeight=t,this.weightFn=n,this.defaultTTL=r,this.maxPoolSize=i,this.rejectOversized=!!s,this.onEvict=typeof o=="function"?o:null,this.onExpire=typeof a=="function"?a:null,this.maxCleanupPerTick=Number.isFinite(+c)?Math.max(1,+c):100,this.eagerCleanupOnRead=!!u,this._map=new Map,this._head=null,this._tail=null,this._pool=[];for(let f=0;f<Math.min(l||0,this.maxPoolSize);f++)this._pool.push({key:null,value:null,weight:0,expiresAt:0,prev:null,next:null});this._currentWeight=0,this._hits=0,this._misses=0,this._evictions=0,this._rejected=0,this._expirations=0,Object.defineProperty(this,"map",{configurable:!0,enumerable:!1,get(){return this._map},set(f){this._map=f}}),Object.defineProperty(this,"head",{configurable:!0,enumerable:!1,get(){return this._head},set(f){this._head=f}}),Object.defineProperty(this,"tail",{configurable:!0,enumerable:!1,get(){return this._tail},set(f){this._tail=f}}),Object.defineProperty(this,"pool",{configurable:!0,enumerable:!1,get(){return this._pool},set(f){this._pool=f}}),Object.defineProperty(this,"currentWeight",{configurable:!0,enumerable:!1,get(){return this._currentWeight},set(f){this._currentWeight=f}}),Object.defineProperty(this,"hits",{configurable:!0,enumerable:!1,get(){return this._hits},set(f){this._hits=f}}),Object.defineProperty(this,"misses",{configurable:!0,enumerable:!1,get(){return this._misses},set(f){this._misses=f}}),Object.defineProperty(this,"evictions",{configurable:!0,enumerable:!1,get(){return this._evictions},set(f){this._evictions=f}}),Object.defineProperty(this,"rejected",{configurable:!0,enumerable:!1,get(){return this._rejected},set(f){this._rejected=f}}),Object.defineProperty(this,"expirations",{configurable:!0,enumerable:!1,get(){return this._expirations},set(f){this._expirations=f}}),this._cleanupTimer=null,this._cleanupRunning=!1,this._cleanupParams=null,this._cleanupCursor=null,this._cleanupCursorValid=!1,this._evictionCandidate=null,this._inflightPromises=new Map,this._defaultAsyncTimeout=Number.isFinite(Number(d))?Math.max(0,Math.floor(Number(d))):3e4}_allocNode(e,t,n,r){const i=this._pool.pop()||{key:null,value:null,weight:0,expiresAt:0,prev:null,next:null};return i.key=e,i.value=t,i.weight=n||0,i.expiresAt=r||0,i.prev=null,i.next=null,i}_computeWeight(e,t){if(t!=null){const n=+t;return Number.isFinite(n)?Math.max(0,n):0}try{const n=+this.weightFn(e);return Number.isFinite(n)?Math.max(0,n):0}catch{return 0}}_freeNode(e){e.key=null,e.value=null,e.weight=0,e.expiresAt=0,e.prev=null,e.next=null,this._pool.length<this.maxPoolSize&&this._pool.push(e)}_removeExpiredNode(e,t){if(!e.expiresAt||e.expiresAt>t)return!1;const n=e.key,r=e.value,i=e.next;this._map.delete(n),this._currentWeight-=e.weight||0,this._cleanupCursor===e&&(this._cleanupCursor=i),this._cleanupCursorValid=!!this._cleanupCursor,this._remove(e);try{this.onExpire&&this.onExpire(n,r)}catch(s){try{typeof this._logger?.error=="function"?this._logger.error(s,"PowerCache onExpire callback threw"):typeof console<"u"&&typeof console.error=="function"&&console.error("PowerCache onExpire callback threw",s)}catch{}}return this._freeNode(e),this._expirations++,!0}_fetchValidNode(e,{ignoreExpiry:t=!1,countMiss:n=!1,allowExpired:r=!1}={}){const i=this._map.get(e);if(!i)return n&&this._misses++,null;const s=!t&&i.expiresAt?qe():0;return s&&i.expiresAt<=s?r?i:(this._removeExpiredNode(i,s),n&&this._misses++,null):i}_refreshStaleEntry(e,t,{ttl:n=void 0,weight:r=void 0}={}){if(this._inflightPromises.has(e))return;let i;try{i=Promise.resolve().then(()=>t())}catch{return}const s=i.then(o=>{try{this.set(e,o,{ttl:n,weight:r})}catch{}return o}).catch(()=>{}).finally(()=>{this._inflightPromises.delete(e)});this._inflightPromises.set(e,s)}_append(e){if(!this._tail){this._head=this._tail=e,this._evictionCandidate=this._head;return}e.prev=this._tail,e.next=null,this._tail.next=e,this._tail=e}_remove(e){const t=e.prev,n=e.next;t?t.next=n:this._head=n,t||(this._evictionCandidate=this._head),n?n.prev=t:this._tail=t,e.prev=e.next=null}_moveToTail(e){this._tail!==e&&(this._remove(e),this._append(e))}_evictIfNeeded(){for(;this._map.size>this.maxEntries||this._currentWeight>this.maxWeight;){const e=this._evictionCandidate||this._head;if(!e)break;const t=e.next,n=e.key,r=e.value;this._cleanupCursor===e&&(this._cleanupCursor=t),this._cleanupCursorValid=!!this._cleanupCursor,this._evictionCandidate=t,this._remove(e),this._map.delete(n),this._currentWeight-=e.weight||0,this._evictions++;try{this.onEvict&&this.onEvict(n,r,"evicted")}catch(i){try{typeof this._logger?.error=="function"?this._logger.error(i,"PowerCache onEvict callback threw"):typeof console<"u"&&typeof console.error=="function"&&console.error("PowerCache onEvict callback threw",i)}catch{}}this._freeNode(e)}this._evictionCandidate||(this._evictionCandidate=this._head)}set(e,t,{ttl:n=this.defaultTTL,weight:r=null}={}){const i=qe(),s=n==null||n===1/0?0:i+n,o=this._computeWeight(t,r);if(this.rejectOversized&&Number.isFinite(this.maxWeight)&&o>this.maxWeight){this._rejected++;try{this.onEvict&&this.onEvict(e,t,"rejected-oversized")}catch{}return!1}if(this._map.has(e)){const a=this._map.get(e);this._currentWeight-=a.weight||0,a.value=t,a.weight=o,a.expiresAt=s,this._currentWeight+=a.weight||0,this._moveToTail(a)}else{const a=this._allocNode(e,t,o,s);this._map.set(e,a),this._append(a),this._currentWeight+=a.weight||0}return this._evictIfNeeded(),this}get(e){const t=this._fetchValidNode(e,{countMiss:!0});if(t)return this._moveToTail(t),this._hits++,t.value}peek(e){const t=this._fetchValidNode(e);return t?t.value:void 0}has(e,{ignoreExpiry:t=!1}={}){return!!this._fetchValidNode(e,{ignoreExpiry:t})}getOrSet(e,t,{ttl:n=void 0,weight:r=void 0,staleWhileRevalidate:i=!1}={}){const s=qe(),o=this._fetchValidNode(e,{countMiss:!1,allowExpired:i});if(o)if(o.expiresAt&&o.expiresAt<=s){if(typeof t=="function")return this._moveToTail(o),this._hits++,this._refreshStaleEntry(e,t,{ttl:n,weight:r}),o.value;this._removeExpiredNode(o,s),this._misses++}else return this._moveToTail(o),this._hits++,o.value;else this._misses++;if(typeof t=="function"){const a=t();return typeof a?.then=="function"?a.then(l=>{try{this.set(e,l,{ttl:n,weight:r})}catch{}return l}):(this.set(e,a,{ttl:n,weight:r}),a)}return this.set(e,t,{ttl:n,weight:r}),t}setMany(e,{ttl:t=void 0,weight:n=void 0}={}){const r=qe(),i=t==null||t===1/0?0:r+t;for(const s of e){if(!s)continue;const[o,a]=s,l=this._computeWeight(a,n);if(this._map.has(o)){const c=this._map.get(o);this._currentWeight-=c.weight||0,c.value=a,c.weight=l,c.expiresAt=i,this._currentWeight+=c.weight||0,this._moveToTail(c)}else{const c=this._allocNode(o,a,l,i);this._map.set(o,c),this._append(c),this._currentWeight+=c.weight||0}}return this._evictIfNeeded(),this}getMany(e,{ignoreExpiry:t=!1}={}){const n=new Map;for(const r of e){const i=this._fetchValidNode(r,{ignoreExpiry:t,countMiss:!0});i&&(this._moveToTail(i),this._hits++,n.set(r,i.value))}return n}touch(e,t=void 0){const n=this._fetchValidNode(e);if(!n)return!1;const r=qe();return t!==void 0&&(n.expiresAt=t==null||t===1/0?0:r+t),this._moveToTail(n),!0}getOrSetAsync(e,t,{ttl:n=void 0,weight:r=void 0,staleWhileRevalidate:i=!1,timeout:s=void 0}={}){if(typeof t!="function")return Promise.resolve(this.getOrSet(e,t,{ttl:n,weight:r}));const o=qe(),a=this._map.get(e);if(a)if(a.expiresAt&&a.expiresAt<=o){if(i)return this._moveToTail(a),this._hits++,this._refreshStaleEntry(e,t,{ttl:n,weight:r}),Promise.resolve(a.value);this._removeExpiredNode(a,o)}else return this._moveToTail(a),this._hits++,Promise.resolve(a.value);if(this._inflightPromises.has(e))return this._inflightPromises.get(e);this._misses++;let l;try{l=Promise.resolve().then(()=>t())}catch(f){return Promise.reject(f)}const c=Number.isFinite(Number(s))?Math.max(0,Math.floor(Number(s))):Number.isFinite(Number(this._defaultAsyncTimeout))?this._defaultAsyncTimeout:void 0;let u=l;if(Number.isFinite(c)&&c>0){let f=null;u=new Promise((g,m)=>{f=setTimeout(()=>{try{m(new Error("getOrSetAsync timeout"))}catch{}},c),l.then(p=>{try{clearTimeout(f)}catch{}g(p)},p=>{try{clearTimeout(f)}catch{}m(p)})})}const d=u.then(f=>{try{this.set(e,f,{ttl:n,weight:r})}catch{}return f}).finally(()=>{this._inflightPromises.delete(e)});return this._inflightPromises.set(e,d),d}hasEqual(e,t,{ignoreExpiry:n=!1,seen:r=void 0}={}){const i=this._fetchValidNode(e,{ignoreExpiry:n});if(!i)return!1;const s=i.value;return s===t?!0:typeof s!="object"||s===null||typeof t!="object"||t===null?s===t:Kn(s,t,r)}hasEqualWithSeen(e,t,n,{ignoreExpiry:r=!1}={}){return this.hasEqual(e,t,{ignoreExpiry:r,seen:n})}delete(e){const t=this._map.get(e);if(!t)return!1;const n=t.next;this._map.delete(e),this._currentWeight-=t.weight||0,this._cleanupCursor===t&&(this._cleanupCursor=n),this._cleanupCursorValid=!!this._cleanupCursor,this._remove(t);try{this.onEvict&&this.onEvict(t.key,t.value,"deleted")}catch{}return this._freeNode(t),!0}clear(){for(let e=this._head;e;){const t=e.next;this._freeNode(e),e=t}this._head=this._tail=null,this._map.clear(),this._currentWeight=0,this._cleanupCursor=null,this._cleanupCursorValid=!1,this._evictionCandidate=null}cleanupExpired(){return this.cleanupExpiredUpTo()}cleanupExpiredUpTo(e=1/0){const t=qe();let n=0,r=this._cleanupCursor&&this._cleanupCursorValid?this._cleanupCursor:this._head;for(;r&&n<e;){const i=r.next;if(r.expiresAt&&r.expiresAt<=t){const s=r.key,o=r.value;this._map.delete(s),this._currentWeight-=r.weight||0,this._cleanupCursor===r&&(this._cleanupCursor=i),this._cleanupCursorValid=!!this._cleanupCursor,this._remove(r);try{this.onExpire&&this.onExpire(s,o)}catch{}this._freeNode(r),this._expirations++}r=i,n++}return this._cleanupCursor=r||this._head,this._cleanupCursorValid=!!this._cleanupCursor,n}startCleanup(e={}){let t,n;typeof e=="number"?(t=e,n=this.maxCleanupPerTick):(t=Number.isFinite(+e.interval)?+e.interval:Math.max(Fi,Math.min(this.defaultTTL||6e4,ga)),n=Number.isFinite(+e.maxCleanupPerTick)?Math.max(1,+e.maxCleanupPerTick):this.maxCleanupPerTick),this.stopCleanup(),this._cleanupParams={interval:t,maxCleanupPerTick:n},this._cleanupTimer=setTimeout(()=>this._cleanupTick(),t)}stopCleanup(){this._cleanupTimer&&(clearTimeout(this._cleanupTimer),this._cleanupTimer=null),this._cleanupRunning=!1,this._cleanupParams=null}[Symbol.dispose](){try{this.stopCleanup()}catch{}try{this.clear()}catch{}}async[Symbol.asyncDispose](){try{this.stopCleanup()}catch{}try{this.clear()}catch{}}_cleanupTick(){if(this._cleanupTimer!=null){if(this._cleanupRunning){this._cleanupTimer=setTimeout(()=>this._cleanupTick(),this._cleanupParams.interval);return}this._cleanupRunning=!0;try{this.cleanupExpiredUpTo(this._cleanupParams.maxCleanupPerTick)}finally{this._cleanupRunning=!1}this._cleanupTimer=setTimeout(()=>this._cleanupTick(),this._cleanupParams.interval)}}get size(){return this._map.size}get hitRate(){const e=(this._hits||0)+(this._misses||0);return e?this._hits/e:0}stats(){return{size:this.size,weight:this._currentWeight,hits:this._hits,misses:this._misses,evictions:this._evictions,expirations:this._expirations,rejected:this._rejected,poolSize:this._pool.length}}resize({maxEntries:e,maxWeight:t}={}){Number.isFinite(+e)&&(this.maxEntries=Math.max(0,+e)),Number.isFinite(+t)&&(this.maxWeight=Math.max(0,+t)),this._evictIfNeeded(),this._cleanupCursor=null,this._cleanupCursorValid=!1,this._evictionCandidate=this.head}*entries(e="MRU"){if(e==="MRU")for(let t=this._tail;t;t=t.prev)yield[t.key,t.value];else for(let t=this._head;t;t=t.next)yield[t.key,t.value]}[Symbol.iterator](){return this.entries("MRU")}*keys(e="MRU"){for(const[t]of this.entries(e))yield t}*values(e="MRU"){for(const[,t]of this.entries(e))yield t}};function Kn(e,t,n=void 0,r=0){if(r>100)return e===t;if(e===t)return!0;if(e==null||t==null||typeof e!="object"||typeof t!="object")return e===t;n||(n=new WeakMap);let i=n.get(e);if(i?.has(t))return!0;if(i||(i=new WeakSet,n.set(e,i)),i.add(t),Object.getPrototypeOf(e)!==Object.getPrototypeOf(t))return!1;if(typeof Uint8Array<"u"&&e instanceof Uint8Array){if(!(t instanceof Uint8Array)||e.length!==t.length)return!1;for(let a=0;a<e.length;a++)if(e[a]!==t[a])return!1;return!0}if(Array.isArray(e)){if(!Array.isArray(t)||e.length!==t.length)return!1;for(let a=0;a<e.length;a++)if(!Kn(e[a],t[a],n,r+1))return!1;return!0}if(ArrayBuffer.isView(e)){if(!ArrayBuffer.isView(t)||e.byteLength!==t.byteLength)return!1;const a=new Uint8Array(e.buffer,e.byteOffset||0,e.byteLength),l=new Uint8Array(t.buffer,t.byteOffset||0,t.byteLength);for(let c=0;c<a.length;c++)if(a[c]!==l[c])return!1;return!0}if(e instanceof ArrayBuffer){if(!(t instanceof ArrayBuffer)||e.byteLength!==t.byteLength)return!1;const a=new Uint8Array(e),l=new Uint8Array(t);for(let c=0;c<a.length;c++)if(a[c]!==l[c])return!1;return!0}if(e instanceof Date)return t instanceof Date?e.getTime()===t.getTime():!1;if(e instanceof RegExp)return t instanceof RegExp?e.toString()===t.toString():!1;if(e instanceof Map){if(!(t instanceof Map)||e.size!==t.size)return!1;for(const[a,l]of e)if(!t.has(a)||!Kn(l,t.get(a),n,r+1))return!1;return!0}if(e instanceof Set){if(!(t instanceof Set)||e.size!==t.size)return!1;let a=!0;for(const m of e)if(m!==null&&typeof m=="object"){a=!1;break}if(a){for(const m of e)if(!t.has(m))return!1;return!0}const l=Array.from(t),c=new Array(l.length).fill(!1),u=new Map;for(let m=0;m<l.length;m++)u.set(l[m],m);const d=m=>{try{return JSON.stringify(m,(p,y)=>y instanceof Date?{__type:"Date",v:y.getTime()}:y instanceof RegExp?{__type:"RegExp",v:y.toString()}:typeof ArrayBuffer<"u"&&ArrayBuffer.isView(y)?{__type:"TypedArray",v:Array.from(new Uint8Array(y.buffer,y.byteOffset||0,y.byteLength))}:typeof ArrayBuffer<"u"&&y instanceof ArrayBuffer?{__type:"ArrayBuffer",v:Array.from(new Uint8Array(y))}:y)}catch{return null}},f=new Map,g=[];for(let m=0;m<l.length;m++){const p=d(l[m]);if(p==null)g.push(m);else{const y=f.get(p);y?y.push(m):f.set(p,[m])}}for(const m of e){const p=u.get(m);if(p!==void 0&&!c[p]){c[p]=!0;continue}const y=d(m);let h=!1;if(y!=null){const w=f.get(y)||[];for(const b of w)if(!c[b]&&Kn(m,l[b],n,r+1)){c[b]=!0,h=!0;break}if(h)continue}for(let w=0;w<l.length;w++)if(!c[w]&&Kn(m,l[w],n,r+1)){c[w]=!0,h=!0;break}if(!h)return!1}return!0}const s=Object.keys(e),o=Object.keys(t);if(s.length!==o.length)return!1;for(let a=0;a<s.length;a++){const l=s[a];if(!Object.prototype.hasOwnProperty.call(t,l)||!Kn(e[l],t[l],n,r+1))return!1}return!0}var ar=class vs{constructor(t,n={}){const{keyResolver:r=(...a)=>JSON.stringify(a),cacheOptions:i={},ttl:s,weight:o}=n;if(this.keyResolver=typeof r=="function"?r:(...a)=>JSON.stringify(a),this.cache=new Zr(i),this._inflight=new Map,this._defaultMemoizeOptions={},s!==void 0&&(this._defaultMemoizeOptions.ttl=s),o!==void 0&&(this._defaultMemoizeOptions.weight=o),this.run=()=>{throw new TypeError("No function supplied to PowerMemoizer; call memoize(fn) to create a memoized wrapper.")},this._originalFn=null,typeof t=="function"){this._originalFn=t;try{this._fnWrapper=this.memoize(t),this.run=(...a)=>this._fnWrapper(...a)}catch{}}}_memoize(t,{ttl:n,weight:r}={}){if(typeof t!="function")throw new TypeError("fn must be a function");const i=this;return function(...o){const a=i.keyResolver(...o);if(i.cache.has(a))return i.cache.get(a);if(i._inflight.has(a))return i._inflight.get(a);const l=t(...o);if(typeof l?.then=="function"){const c=(async()=>{try{const u=await l;try{i.cache.set(a,u,{ttl:n,weight:r})}catch{}return u}finally{i._inflight.delete(a)}})();return i._inflight.set(a,c),c}return i.cache.set(a,l,{ttl:n,weight:r}),l}}memoize(t,n={}){if(typeof t!="function")throw new TypeError("fn must be a function");const r=n&&(Object.prototype.hasOwnProperty.call(n,"ttl")||Object.prototype.hasOwnProperty.call(n,"weight"))?n:this._defaultMemoizeOptions,i=this._memoize(t,r);i.get=(...s)=>this.get(...s),i.has=(...s)=>this.has(...s),i.delete=(...s)=>this.delete(...s),i.clear=()=>this.clear(),i.stats=()=>this.stats(),i.cache=this.cache,i.original=t;try{Object.setPrototypeOf(i,vs.prototype),i.constructor=vs}catch{}return i}get(...t){return this.cache.get(this.keyResolver(...t))}has(...t){return this.cache.has(this.keyResolver(...t))}delete(...t){const n=this.keyResolver(...t);return this._inflight.has(n)&&this._inflight.delete(n),this.cache.delete(n)}clear(){this._inflight.clear(),this.cache.clear()}stats(){return this.cache.stats()}},Yl=class{constructor(e=0,t={}){e!=null&&typeof e=="object"&&(t=e,e=0),this._defaultTTL=Number(t?.defaultTTL??e)||0,this._onExpire=typeof t?.onExpire=="function"?t.onExpire:null,this._map=new Map,this._expirations=new Map,this._nextExpiryAt=0,this._nextExpiryDirty=!1}_resolveTtl(e,t){return e!=null&&typeof e=="object"&&(e=e.ttl),e==null?t:Number(e)||0}set(e,t,n){const r=this._resolveTtl(n,this._defaultTTL),i=r>0?qe()+r+1:0,s=this._expirations.get(e)||0;return this._map.set(e,{value:t,expiresAt:i}),i?this._expirations.set(e,i):this._expirations.delete(e),this._updateNextExpiryOnWrite(s,i),this}_expireKey(e,t){if(!t)return;const n=t.expiresAt||this._expirations.get(e)||0;try{const r=t.value;if(this._map.delete(e),this._expirations.delete(e),n&&this._nextExpiryAt===n&&(this._nextExpiryDirty=!0),typeof this._onExpire=="function")try{this._onExpire(e,r)}catch{}}catch{}}_checkExpire(e,t){return t?t.expiresAt&&qe()>t.expiresAt?(this._expireKey(e,t),!0):!1:!0}get(e){const t=this._map.get(e);if(!this._checkExpire(e,t))return t.value}has(e){const t=this._map.get(e);return!this._checkExpire(e,t)}delete(e){const t=this._expirations.get(e)||0;return this._expirations.delete(e),t&&this._nextExpiryAt===t&&(this._nextExpiryDirty=!0),this._map.delete(e)}clear(){this._map.clear(),this._expirations.clear(),this._nextExpiryAt=0,this._nextExpiryDirty=!1}touch(e,t){const n=this._map.get(e);if(!n)return!1;if(n.expiresAt&&qe()>n.expiresAt)return this._expireKey(e,n),!1;const r=n.expiresAt||0,i=this._resolveTtl(t,this._defaultTTL);return n.expiresAt=i>0?qe()+i+1:0,n.expiresAt?this._expirations.set(e,n.expiresAt):this._expirations.delete(e),this._updateNextExpiryOnWrite(r,n.expiresAt),!0}get size(){if(!this._map.size)return 0;if(!this._expirations.size)return this._map.size;const e=qe();return!this._nextExpiryDirty&&this._nextExpiryAt&&e<=this._nextExpiryAt?this._map.size:(this._sweepExpirations(e),this._map.size)}_updateNextExpiryOnWrite(e,t){e&&this._nextExpiryAt===e&&e!==t&&(this._nextExpiryDirty=!0),t&&(!this._nextExpiryAt||t<this._nextExpiryAt)&&(this._nextExpiryAt=t)}_sweepExpirations(e){let t=0;for(const[n,r]of this._expirations){if(r&&e>r){const i=this._map.get(n);this._expireKey(n,i);continue}r&&(!t||r<t)&&(t=r)}this._nextExpiryAt=t,this._nextExpiryDirty=!1}*entries(){const e=qe();for(const[t,n]of this._map){if(n.expiresAt&&e>n.expiresAt){this._expireKey(t,n);continue}yield[t,n.value]}}*keys(){for(const[e]of this.entries())yield e}*values(){for(const[,e]of this.entries())yield e}forEach(e,t){for(const[n,r]of this.entries())e.call(t,r,n,this)}[Symbol.iterator](){return this.entries()}},Ql=new Zr({maxEntries:500}),di=new Yl(0),es=3e5;async function Kl(e,t){try{if(!e||es>0&&di.has(e))return null;try{const n=await Ql.getOrSetAsync(e,async()=>{const r=await t();if(r==null)throw new Error("importCache: loader returned null");return r});return di.delete(e),n}catch{return es>0?di.set(e,1,es):di.delete(e),null}}catch{return null}}var Jl=Object.assign({"../node_modules/highlight.js/lib/languages/1c.js":()=>Promise.resolve().then(()=>_.__toESM(require("./1c-7xpVID8Q.cjs").default,1)),"../node_modules/highlight.js/lib/languages/1c.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./1c.js-BR357fcW.cjs").default,1)),"../node_modules/highlight.js/lib/languages/abnf.js":()=>Promise.resolve().then(()=>_.__toESM(require("./abnf-CehM3WYF.cjs").default,1)),"../node_modules/highlight.js/lib/languages/abnf.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./abnf.js-CGngJvh7.cjs").default,1)),"../node_modules/highlight.js/lib/languages/accesslog.js":()=>Promise.resolve().then(()=>_.__toESM(require("./accesslog-BvPtwd3h.cjs").default,1)),"../node_modules/highlight.js/lib/languages/accesslog.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./accesslog.js-BinDn9WT.cjs").default,1)),"../node_modules/highlight.js/lib/languages/actionscript.js":()=>Promise.resolve().then(()=>_.__toESM(require("./actionscript-DfYbOPG6.cjs").default,1)),"../node_modules/highlight.js/lib/languages/actionscript.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./actionscript.js-Be_1jAsv.cjs").default,1)),"../node_modules/highlight.js/lib/languages/ada.js":()=>Promise.resolve().then(()=>_.__toESM(require("./ada-zpSCY8qr.cjs").default,1)),"../node_modules/highlight.js/lib/languages/ada.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./ada.js-CWDFlmMI.cjs").default,1)),"../node_modules/highlight.js/lib/languages/angelscript.js":()=>Promise.resolve().then(()=>_.__toESM(require("./angelscript-8mT6tdxu.cjs").default,1)),"../node_modules/highlight.js/lib/languages/angelscript.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./angelscript.js-ZKKbuC_e.cjs").default,1)),"../node_modules/highlight.js/lib/languages/apache.js":()=>Promise.resolve().then(()=>_.__toESM(require("./apache-C8G7cD6P.cjs").default,1)),"../node_modules/highlight.js/lib/languages/apache.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./apache.js-xoS7v6pS.cjs").default,1)),"../node_modules/highlight.js/lib/languages/applescript.js":()=>Promise.resolve().then(()=>_.__toESM(require("./applescript-CynG67W2.cjs").default,1)),"../node_modules/highlight.js/lib/languages/applescript.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./applescript.js-B1tG989H.cjs").default,1)),"../node_modules/highlight.js/lib/languages/arcade.js":()=>Promise.resolve().then(()=>_.__toESM(require("./arcade-PYUJJqt5.cjs").default,1)),"../node_modules/highlight.js/lib/languages/arcade.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./arcade.js-V8JsfqPK.cjs").default,1)),"../node_modules/highlight.js/lib/languages/arduino.js":()=>Promise.resolve().then(()=>_.__toESM(require("./arduino-pZwPmBnH.cjs").default,1)),"../node_modules/highlight.js/lib/languages/arduino.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./arduino.js-Bgrn8Sq2.cjs").default,1)),"../node_modules/highlight.js/lib/languages/armasm.js":()=>Promise.resolve().then(()=>_.__toESM(require("./armasm-C6n_VUHb.cjs").default,1)),"../node_modules/highlight.js/lib/languages/armasm.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./armasm.js-DnbPF8Ap.cjs").default,1)),"../node_modules/highlight.js/lib/languages/asciidoc.js":()=>Promise.resolve().then(()=>_.__toESM(require("./asciidoc-DnyrYxxh.cjs").default,1)),"../node_modules/highlight.js/lib/languages/asciidoc.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./asciidoc.js-Caf_ZoH5.cjs").default,1)),"../node_modules/highlight.js/lib/languages/aspectj.js":()=>Promise.resolve().then(()=>_.__toESM(require("./aspectj-B6CpJRmS.cjs").default,1)),"../node_modules/highlight.js/lib/languages/aspectj.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./aspectj.js-jsr4o8Sz.cjs").default,1)),"../node_modules/highlight.js/lib/languages/autohotkey.js":()=>Promise.resolve().then(()=>_.__toESM(require("./autohotkey-mzR23rXY.cjs").default,1)),"../node_modules/highlight.js/lib/languages/autohotkey.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./autohotkey.js-D12wU2jA.cjs").default,1)),"../node_modules/highlight.js/lib/languages/autoit.js":()=>Promise.resolve().then(()=>_.__toESM(require("./autoit-DBAjZBja.cjs").default,1)),"../node_modules/highlight.js/lib/languages/autoit.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./autoit.js-BRTa9bv6.cjs").default,1)),"../node_modules/highlight.js/lib/languages/avrasm.js":()=>Promise.resolve().then(()=>_.__toESM(require("./avrasm-CruuowMi.cjs").default,1)),"../node_modules/highlight.js/lib/languages/avrasm.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./avrasm.js-BjQEGqmE.cjs").default,1)),"../node_modules/highlight.js/lib/languages/awk.js":()=>Promise.resolve().then(()=>_.__toESM(require("./awk-CtyqnVCc.cjs").default,1)),"../node_modules/highlight.js/lib/languages/awk.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./awk.js-CA81OR6j.cjs").default,1)),"../node_modules/highlight.js/lib/languages/axapta.js":()=>Promise.resolve().then(()=>_.__toESM(require("./axapta-BEbJykdr.cjs").default,1)),"../node_modules/highlight.js/lib/languages/axapta.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./axapta.js-ydeK-Z8w.cjs").default,1)),"../node_modules/highlight.js/lib/languages/bash.js":()=>Promise.resolve().then(()=>_.__toESM(require("./bash-LZTULchV.cjs").default,1)),"../node_modules/highlight.js/lib/languages/bash.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./bash.js-jtaSIFqv.cjs").default,1)),"../node_modules/highlight.js/lib/languages/basic.js":()=>Promise.resolve().then(()=>_.__toESM(require("./basic-1NrqUc13.cjs").default,1)),"../node_modules/highlight.js/lib/languages/basic.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./basic.js-BNCECj1I.cjs").default,1)),"../node_modules/highlight.js/lib/languages/bnf.js":()=>Promise.resolve().then(()=>_.__toESM(require("./bnf-DSS6GphR.cjs").default,1)),"../node_modules/highlight.js/lib/languages/bnf.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./bnf.js-BoLNN0wC.cjs").default,1)),"../node_modules/highlight.js/lib/languages/brainfuck.js":()=>Promise.resolve().then(()=>_.__toESM(require("./brainfuck-DvpuFb5S.cjs").default,1)),"../node_modules/highlight.js/lib/languages/brainfuck.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./brainfuck.js-XYE3pF-X.cjs").default,1)),"../node_modules/highlight.js/lib/languages/c.js":()=>Promise.resolve().then(()=>_.__toESM(require("./c-CLbeJH2g.cjs").default,1)),"../node_modules/highlight.js/lib/languages/c.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./c.js-Dg0SRcqk.cjs").default,1)),"../node_modules/highlight.js/lib/languages/cal.js":()=>Promise.resolve().then(()=>_.__toESM(require("./cal-C3i779so.cjs").default,1)),"../node_modules/highlight.js/lib/languages/cal.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./cal.js-DQi-kNdA.cjs").default,1)),"../node_modules/highlight.js/lib/languages/capnproto.js":()=>Promise.resolve().then(()=>_.__toESM(require("./capnproto-CNgTKLhs.cjs").default,1)),"../node_modules/highlight.js/lib/languages/capnproto.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./capnproto.js-DBldHfPh.cjs").default,1)),"../node_modules/highlight.js/lib/languages/ceylon.js":()=>Promise.resolve().then(()=>_.__toESM(require("./ceylon-DdTfRVj-.cjs").default,1)),"../node_modules/highlight.js/lib/languages/ceylon.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./ceylon.js-rSc1QzU8.cjs").default,1)),"../node_modules/highlight.js/lib/languages/clean.js":()=>Promise.resolve().then(()=>_.__toESM(require("./clean-gXIgmA5i.cjs").default,1)),"../node_modules/highlight.js/lib/languages/clean.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./clean.js-C0DQZwRe.cjs").default,1)),"../node_modules/highlight.js/lib/languages/clojure-repl.js":()=>Promise.resolve().then(()=>_.__toESM(require("./clojure-repl-DrbDcJMw.cjs").default,1)),"../node_modules/highlight.js/lib/languages/clojure-repl.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./clojure-repl.js-DNe6k_nT.cjs").default,1)),"../node_modules/highlight.js/lib/languages/clojure.js":()=>Promise.resolve().then(()=>_.__toESM(require("./clojure-BgakzVMr.cjs").default,1)),"../node_modules/highlight.js/lib/languages/clojure.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./clojure.js-BEODdGTW.cjs").default,1)),"../node_modules/highlight.js/lib/languages/cmake.js":()=>Promise.resolve().then(()=>_.__toESM(require("./cmake-DXWemG2z.cjs").default,1)),"../node_modules/highlight.js/lib/languages/cmake.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./cmake.js-DmuEdSmI.cjs").default,1)),"../node_modules/highlight.js/lib/languages/coffeescript.js":()=>Promise.resolve().then(()=>_.__toESM(require("./coffeescript-BuePFkLm.cjs").default,1)),"../node_modules/highlight.js/lib/languages/coffeescript.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./coffeescript.js-B-OZqTYQ.cjs").default,1)),"../node_modules/highlight.js/lib/languages/coq.js":()=>Promise.resolve().then(()=>_.__toESM(require("./coq-taaUMaF3.cjs").default,1)),"../node_modules/highlight.js/lib/languages/coq.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./coq.js-DEAp_50F.cjs").default,1)),"../node_modules/highlight.js/lib/languages/cos.js":()=>Promise.resolve().then(()=>_.__toESM(require("./cos-BXZ3_5d1.cjs").default,1)),"../node_modules/highlight.js/lib/languages/cos.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./cos.js-C4CiiZYz.cjs").default,1)),"../node_modules/highlight.js/lib/languages/cpp.js":()=>Promise.resolve().then(()=>_.__toESM(require("./cpp-BtLu9m_S.cjs").default,1)),"../node_modules/highlight.js/lib/languages/cpp.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./cpp.js-LIPE6196.cjs").default,1)),"../node_modules/highlight.js/lib/languages/crmsh.js":()=>Promise.resolve().then(()=>_.__toESM(require("./crmsh-Cn0AMNUX.cjs").default,1)),"../node_modules/highlight.js/lib/languages/crmsh.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./crmsh.js-Dt0OFOPK.cjs").default,1)),"../node_modules/highlight.js/lib/languages/crystal.js":()=>Promise.resolve().then(()=>_.__toESM(require("./crystal-DsbBeRHd.cjs").default,1)),"../node_modules/highlight.js/lib/languages/crystal.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./crystal.js-owi-wX3E.cjs").default,1)),"../node_modules/highlight.js/lib/languages/csharp.js":()=>Promise.resolve().then(()=>_.__toESM(require("./csharp-CrH4x55k.cjs").default,1)),"../node_modules/highlight.js/lib/languages/csharp.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./csharp.js-Sb3HwDFs.cjs").default,1)),"../node_modules/highlight.js/lib/languages/csp.js":()=>Promise.resolve().then(()=>_.__toESM(require("./csp-CM0mmsyh.cjs").default,1)),"../node_modules/highlight.js/lib/languages/csp.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./csp.js-b4gUz0TP.cjs").default,1)),"../node_modules/highlight.js/lib/languages/css.js":()=>Promise.resolve().then(()=>_.__toESM(require("./css-CHUvJ0h_.cjs").default,1)),"../node_modules/highlight.js/lib/languages/css.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./css.js-NhA2vOvz.cjs").default,1)),"../node_modules/highlight.js/lib/languages/d.js":()=>Promise.resolve().then(()=>_.__toESM(require("./d-BD3fOkw4.cjs").default,1)),"../node_modules/highlight.js/lib/languages/d.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./d.js-DylgDJJB.cjs").default,1)),"../node_modules/highlight.js/lib/languages/dart.js":()=>Promise.resolve().then(()=>_.__toESM(require("./dart-C0V445Rg.cjs").default,1)),"../node_modules/highlight.js/lib/languages/dart.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./dart.js-Bp8mj1Pc.cjs").default,1)),"../node_modules/highlight.js/lib/languages/delphi.js":()=>Promise.resolve().then(()=>_.__toESM(require("./delphi-DF7O7JGq.cjs").default,1)),"../node_modules/highlight.js/lib/languages/delphi.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./delphi.js-DGRqMmcW.cjs").default,1)),"../node_modules/highlight.js/lib/languages/diff.js":()=>Promise.resolve().then(()=>_.__toESM(require("./diff-sMyaxWNB.cjs").default,1)),"../node_modules/highlight.js/lib/languages/diff.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./diff.js-sbdn_b9o.cjs").default,1)),"../node_modules/highlight.js/lib/languages/django.js":()=>Promise.resolve().then(()=>_.__toESM(require("./django-A3wI9_Qm.cjs").default,1)),"../node_modules/highlight.js/lib/languages/django.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./django.js--ZFt_m3H.cjs").default,1)),"../node_modules/highlight.js/lib/languages/dns.js":()=>Promise.resolve().then(()=>_.__toESM(require("./dns-IMlJwxoe.cjs").default,1)),"../node_modules/highlight.js/lib/languages/dns.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./dns.js-T4pe-lzl.cjs").default,1)),"../node_modules/highlight.js/lib/languages/dockerfile.js":()=>Promise.resolve().then(()=>_.__toESM(require("./dockerfile-BHneCHw5.cjs").default,1)),"../node_modules/highlight.js/lib/languages/dockerfile.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./dockerfile.js-Dc4tqqmd.cjs").default,1)),"../node_modules/highlight.js/lib/languages/dos.js":()=>Promise.resolve().then(()=>_.__toESM(require("./dos-DYefdxup.cjs").default,1)),"../node_modules/highlight.js/lib/languages/dos.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./dos.js-CeUpBaVc.cjs").default,1)),"../node_modules/highlight.js/lib/languages/dsconfig.js":()=>Promise.resolve().then(()=>_.__toESM(require("./dsconfig-D3r6mXT5.cjs").default,1)),"../node_modules/highlight.js/lib/languages/dsconfig.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./dsconfig.js-BaDYIUF0.cjs").default,1)),"../node_modules/highlight.js/lib/languages/dts.js":()=>Promise.resolve().then(()=>_.__toESM(require("./dts-CJvuZm6U.cjs").default,1)),"../node_modules/highlight.js/lib/languages/dts.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./dts.js-BzLOYxAQ.cjs").default,1)),"../node_modules/highlight.js/lib/languages/dust.js":()=>Promise.resolve().then(()=>_.__toESM(require("./dust-P-HswCG9.cjs").default,1)),"../node_modules/highlight.js/lib/languages/dust.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./dust.js-C4EQBpEg.cjs").default,1)),"../node_modules/highlight.js/lib/languages/ebnf.js":()=>Promise.resolve().then(()=>_.__toESM(require("./ebnf-Cero-jvV.cjs").default,1)),"../node_modules/highlight.js/lib/languages/ebnf.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./ebnf.js-0puZ-KlR.cjs").default,1)),"../node_modules/highlight.js/lib/languages/elixir.js":()=>Promise.resolve().then(()=>_.__toESM(require("./elixir-BqMF66H0.cjs").default,1)),"../node_modules/highlight.js/lib/languages/elixir.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./elixir.js-DXt32MR2.cjs").default,1)),"../node_modules/highlight.js/lib/languages/elm.js":()=>Promise.resolve().then(()=>_.__toESM(require("./elm-XyWWpW8W.cjs").default,1)),"../node_modules/highlight.js/lib/languages/elm.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./elm.js-DUeTIY_L.cjs").default,1)),"../node_modules/highlight.js/lib/languages/erb.js":()=>Promise.resolve().then(()=>_.__toESM(require("./erb-CfSh-nY1.cjs").default,1)),"../node_modules/highlight.js/lib/languages/erb.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./erb.js-D-bfXQGo.cjs").default,1)),"../node_modules/highlight.js/lib/languages/erlang-repl.js":()=>Promise.resolve().then(()=>_.__toESM(require("./erlang-repl-CXT2IkTj.cjs").default,1)),"../node_modules/highlight.js/lib/languages/erlang-repl.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./erlang-repl.js-BxgB3Rqp.cjs").default,1)),"../node_modules/highlight.js/lib/languages/erlang.js":()=>Promise.resolve().then(()=>_.__toESM(require("./erlang-sHlAhWqD.cjs").default,1)),"../node_modules/highlight.js/lib/languages/erlang.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./erlang.js-C-SKEOq1.cjs").default,1)),"../node_modules/highlight.js/lib/languages/excel.js":()=>Promise.resolve().then(()=>_.__toESM(require("./excel-Be3Ow2MF.cjs").default,1)),"../node_modules/highlight.js/lib/languages/excel.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./excel.js-8bHN3xVh.cjs").default,1)),"../node_modules/highlight.js/lib/languages/fix.js":()=>Promise.resolve().then(()=>_.__toESM(require("./fix-CSYMjOzL.cjs").default,1)),"../node_modules/highlight.js/lib/languages/fix.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./fix.js-BT_qdosH.cjs").default,1)),"../node_modules/highlight.js/lib/languages/flix.js":()=>Promise.resolve().then(()=>_.__toESM(require("./flix-DC4_A2bm.cjs").default,1)),"../node_modules/highlight.js/lib/languages/flix.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./flix.js-ZrZ6MTJM.cjs").default,1)),"../node_modules/highlight.js/lib/languages/fortran.js":()=>Promise.resolve().then(()=>_.__toESM(require("./fortran-eTXBMiiU.cjs").default,1)),"../node_modules/highlight.js/lib/languages/fortran.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./fortran.js-DPNQxZUt.cjs").default,1)),"../node_modules/highlight.js/lib/languages/freedesktop.js":()=>Promise.resolve().then(()=>_.__toESM(require("./freedesktop-BDqN19LE.cjs").default,1)),"../node_modules/highlight.js/lib/languages/freedesktop.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./freedesktop.js-BRdrE1I9.cjs").default,1)),"../node_modules/highlight.js/lib/languages/fsharp.js":()=>Promise.resolve().then(()=>_.__toESM(require("./fsharp-CuUABAZ-.cjs").default,1)),"../node_modules/highlight.js/lib/languages/fsharp.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./fsharp.js-BeWqjrPG.cjs").default,1)),"../node_modules/highlight.js/lib/languages/gams.js":()=>Promise.resolve().then(()=>_.__toESM(require("./gams-D79Dog9E.cjs").default,1)),"../node_modules/highlight.js/lib/languages/gams.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./gams.js-ERYXiXaV.cjs").default,1)),"../node_modules/highlight.js/lib/languages/gauss.js":()=>Promise.resolve().then(()=>_.__toESM(require("./gauss-DSE0Q71-.cjs").default,1)),"../node_modules/highlight.js/lib/languages/gauss.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./gauss.js-B1qbxByi.cjs").default,1)),"../node_modules/highlight.js/lib/languages/gcode.js":()=>Promise.resolve().then(()=>_.__toESM(require("./gcode-DmeVnsg1.cjs").default,1)),"../node_modules/highlight.js/lib/languages/gcode.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./gcode.js-pQjpHpOv.cjs").default,1)),"../node_modules/highlight.js/lib/languages/gherkin.js":()=>Promise.resolve().then(()=>_.__toESM(require("./gherkin-DT4Qeldr.cjs").default,1)),"../node_modules/highlight.js/lib/languages/gherkin.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./gherkin.js-BD6EvnWI.cjs").default,1)),"../node_modules/highlight.js/lib/languages/glsl.js":()=>Promise.resolve().then(()=>_.__toESM(require("./glsl-B4_bjoCe.cjs").default,1)),"../node_modules/highlight.js/lib/languages/glsl.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./glsl.js-ghFNDWvL.cjs").default,1)),"../node_modules/highlight.js/lib/languages/gml.js":()=>Promise.resolve().then(()=>_.__toESM(require("./gml-12-z-JoQ.cjs").default,1)),"../node_modules/highlight.js/lib/languages/gml.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./gml.js-DlKXFe_V.cjs").default,1)),"../node_modules/highlight.js/lib/languages/go.js":()=>Promise.resolve().then(()=>_.__toESM(require("./go-wsZqG06w.cjs").default,1)),"../node_modules/highlight.js/lib/languages/go.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./go.js-DZX98dNv.cjs").default,1)),"../node_modules/highlight.js/lib/languages/golo.js":()=>Promise.resolve().then(()=>_.__toESM(require("./golo-XBopqdQM.cjs").default,1)),"../node_modules/highlight.js/lib/languages/golo.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./golo.js-Cghs9IOG.cjs").default,1)),"../node_modules/highlight.js/lib/languages/gradle.js":()=>Promise.resolve().then(()=>_.__toESM(require("./gradle-B_bESC-K.cjs").default,1)),"../node_modules/highlight.js/lib/languages/gradle.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./gradle.js-CaFGi2no.cjs").default,1)),"../node_modules/highlight.js/lib/languages/graphql.js":()=>Promise.resolve().then(()=>_.__toESM(require("./graphql-OLpA_cqu.cjs").default,1)),"../node_modules/highlight.js/lib/languages/graphql.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./graphql.js-BWKnJnOj.cjs").default,1)),"../node_modules/highlight.js/lib/languages/groovy.js":()=>Promise.resolve().then(()=>_.__toESM(require("./groovy-Ddy-HI71.cjs").default,1)),"../node_modules/highlight.js/lib/languages/groovy.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./groovy.js-DX53AtHa.cjs").default,1)),"../node_modules/highlight.js/lib/languages/haml.js":()=>Promise.resolve().then(()=>_.__toESM(require("./haml-DAIWCOwY.cjs").default,1)),"../node_modules/highlight.js/lib/languages/haml.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./haml.js-Bc9kyouk.cjs").default,1)),"../node_modules/highlight.js/lib/languages/handlebars.js":()=>Promise.resolve().then(()=>_.__toESM(require("./handlebars-B6lclxiE.cjs").default,1)),"../node_modules/highlight.js/lib/languages/handlebars.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./handlebars.js-DmMhJVjI.cjs").default,1)),"../node_modules/highlight.js/lib/languages/haskell.js":()=>Promise.resolve().then(()=>_.__toESM(require("./haskell-BHkm4YnD.cjs").default,1)),"../node_modules/highlight.js/lib/languages/haskell.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./haskell.js-Roa5Rs8g.cjs").default,1)),"../node_modules/highlight.js/lib/languages/haxe.js":()=>Promise.resolve().then(()=>_.__toESM(require("./haxe-apOy-ePm.cjs").default,1)),"../node_modules/highlight.js/lib/languages/haxe.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./haxe.js-XzI5_kn8.cjs").default,1)),"../node_modules/highlight.js/lib/languages/hsp.js":()=>Promise.resolve().then(()=>_.__toESM(require("./hsp-jjyKXEmZ.cjs").default,1)),"../node_modules/highlight.js/lib/languages/hsp.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./hsp.js-CwuW5Trf.cjs").default,1)),"../node_modules/highlight.js/lib/languages/http.js":()=>Promise.resolve().then(()=>_.__toESM(require("./http-B1CImLMd.cjs").default,1)),"../node_modules/highlight.js/lib/languages/http.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./http.js-DR0eEDMQ.cjs").default,1)),"../node_modules/highlight.js/lib/languages/hy.js":()=>Promise.resolve().then(()=>_.__toESM(require("./hy-Bw_XF9fx.cjs").default,1)),"../node_modules/highlight.js/lib/languages/hy.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./hy.js-2V0OL_9u.cjs").default,1)),"../node_modules/highlight.js/lib/languages/inform7.js":()=>Promise.resolve().then(()=>_.__toESM(require("./inform7-DZCGZ9Oi.cjs").default,1)),"../node_modules/highlight.js/lib/languages/inform7.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./inform7.js-CBMzN_P0.cjs").default,1)),"../node_modules/highlight.js/lib/languages/ini.js":()=>Promise.resolve().then(()=>_.__toESM(require("./ini-C7chpcCE.cjs").default,1)),"../node_modules/highlight.js/lib/languages/ini.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./ini.js-gc1WBlJS.cjs").default,1)),"../node_modules/highlight.js/lib/languages/irpf90.js":()=>Promise.resolve().then(()=>_.__toESM(require("./irpf90-Benp5l08.cjs").default,1)),"../node_modules/highlight.js/lib/languages/irpf90.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./irpf90.js-ZaUgCNS4.cjs").default,1)),"../node_modules/highlight.js/lib/languages/isbl.js":()=>Promise.resolve().then(()=>_.__toESM(require("./isbl-544LU0MN.cjs").default,1)),"../node_modules/highlight.js/lib/languages/isbl.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./isbl.js-CMf5-V3r.cjs").default,1)),"../node_modules/highlight.js/lib/languages/java.js":()=>Promise.resolve().then(()=>_.__toESM(require("./java-DrWGSqNs.cjs").default,1)),"../node_modules/highlight.js/lib/languages/java.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./java.js-dDJnEdgW.cjs").default,1)),"../node_modules/highlight.js/lib/languages/javascript.js":()=>Promise.resolve().then(()=>_.__toESM(require("./javascript-DocrcY8C.cjs").default,1)),"../node_modules/highlight.js/lib/languages/javascript.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./javascript.js-BWjDVgFz.cjs").default,1)),"../node_modules/highlight.js/lib/languages/jboss-cli.js":()=>Promise.resolve().then(()=>_.__toESM(require("./jboss-cli-DnQrb7Zq.cjs").default,1)),"../node_modules/highlight.js/lib/languages/jboss-cli.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./jboss-cli.js-DGxFZ-59.cjs").default,1)),"../node_modules/highlight.js/lib/languages/json.js":()=>Promise.resolve().then(()=>_.__toESM(require("./json-D2j7f5P7.cjs").default,1)),"../node_modules/highlight.js/lib/languages/json.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./json.js-B7Rbpq9S.cjs").default,1)),"../node_modules/highlight.js/lib/languages/julia-repl.js":()=>Promise.resolve().then(()=>_.__toESM(require("./julia-repl-8N0gpBR8.cjs").default,1)),"../node_modules/highlight.js/lib/languages/julia-repl.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./julia-repl.js-rXGjHCgG.cjs").default,1)),"../node_modules/highlight.js/lib/languages/julia.js":()=>Promise.resolve().then(()=>_.__toESM(require("./julia-CVbmnrgV.cjs").default,1)),"../node_modules/highlight.js/lib/languages/julia.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./julia.js-BPzryF11.cjs").default,1)),"../node_modules/highlight.js/lib/languages/kotlin.js":()=>Promise.resolve().then(()=>_.__toESM(require("./kotlin-Bp3o8BXX.cjs").default,1)),"../node_modules/highlight.js/lib/languages/kotlin.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./kotlin.js-Dd1_bWc9.cjs").default,1)),"../node_modules/highlight.js/lib/languages/lasso.js":()=>Promise.resolve().then(()=>_.__toESM(require("./lasso-CEd98nnD.cjs").default,1)),"../node_modules/highlight.js/lib/languages/lasso.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./lasso.js-BVKjOs6U.cjs").default,1)),"../node_modules/highlight.js/lib/languages/latex.js":()=>Promise.resolve().then(()=>_.__toESM(require("./latex-D0RGfqiW.cjs").default,1)),"../node_modules/highlight.js/lib/languages/latex.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./latex.js-BBlPDw8G.cjs").default,1)),"../node_modules/highlight.js/lib/languages/ldif.js":()=>Promise.resolve().then(()=>_.__toESM(require("./ldif-D8m2qQDy.cjs").default,1)),"../node_modules/highlight.js/lib/languages/ldif.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./ldif.js-Cc-00AUY.cjs").default,1)),"../node_modules/highlight.js/lib/languages/leaf.js":()=>Promise.resolve().then(()=>_.__toESM(require("./leaf-CUtH_ONr.cjs").default,1)),"../node_modules/highlight.js/lib/languages/leaf.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./leaf.js-Cj2R9wOe.cjs").default,1)),"../node_modules/highlight.js/lib/languages/less.js":()=>Promise.resolve().then(()=>_.__toESM(require("./less-B3ugo0b2.cjs").default,1)),"../node_modules/highlight.js/lib/languages/less.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./less.js-CmWDJSjI.cjs").default,1)),"../node_modules/highlight.js/lib/languages/lisp.js":()=>Promise.resolve().then(()=>_.__toESM(require("./lisp-DX5C-j_u.cjs").default,1)),"../node_modules/highlight.js/lib/languages/lisp.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./lisp.js-B5vgGL_S.cjs").default,1)),"../node_modules/highlight.js/lib/languages/livecodeserver.js":()=>Promise.resolve().then(()=>_.__toESM(require("./livecodeserver-HTCD6j2-.cjs").default,1)),"../node_modules/highlight.js/lib/languages/livecodeserver.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./livecodeserver.js-x0GpVTp6.cjs").default,1)),"../node_modules/highlight.js/lib/languages/livescript.js":()=>Promise.resolve().then(()=>_.__toESM(require("./livescript-Dcc4Mo7g.cjs").default,1)),"../node_modules/highlight.js/lib/languages/livescript.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./livescript.js-Djnc4uBe.cjs").default,1)),"../node_modules/highlight.js/lib/languages/llvm.js":()=>Promise.resolve().then(()=>_.__toESM(require("./llvm-BFnng0-N.cjs").default,1)),"../node_modules/highlight.js/lib/languages/llvm.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./llvm.js-DGVE5P9h.cjs").default,1)),"../node_modules/highlight.js/lib/languages/lsl.js":()=>Promise.resolve().then(()=>_.__toESM(require("./lsl-BJsCjL-h.cjs").default,1)),"../node_modules/highlight.js/lib/languages/lsl.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./lsl.js-Cjur-aJY.cjs").default,1)),"../node_modules/highlight.js/lib/languages/lua.js":()=>Promise.resolve().then(()=>_.__toESM(require("./lua-DM-wrZuz.cjs").default,1)),"../node_modules/highlight.js/lib/languages/lua.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./lua.js-DsQNHgEK.cjs").default,1)),"../node_modules/highlight.js/lib/languages/makefile.js":()=>Promise.resolve().then(()=>_.__toESM(require("./makefile-Du-2Fi-a.cjs").default,1)),"../node_modules/highlight.js/lib/languages/makefile.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./makefile.js-CokfJaMW.cjs").default,1)),"../node_modules/highlight.js/lib/languages/markdown.js":()=>Promise.resolve().then(()=>_.__toESM(require("./markdown-XZcOKWhR.cjs").default,1)),"../node_modules/highlight.js/lib/languages/markdown.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./markdown.js-BaNE-3d3.cjs").default,1)),"../node_modules/highlight.js/lib/languages/mathematica.js":()=>Promise.resolve().then(()=>_.__toESM(require("./mathematica-D-ri2c9l.cjs").default,1)),"../node_modules/highlight.js/lib/languages/mathematica.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./mathematica.js-DrzLiOAC.cjs").default,1)),"../node_modules/highlight.js/lib/languages/matlab.js":()=>Promise.resolve().then(()=>_.__toESM(require("./matlab-Bj1OHSNu.cjs").default,1)),"../node_modules/highlight.js/lib/languages/matlab.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./matlab.js-D55BfUca.cjs").default,1)),"../node_modules/highlight.js/lib/languages/maxima.js":()=>Promise.resolve().then(()=>_.__toESM(require("./maxima-DOqwVju1.cjs").default,1)),"../node_modules/highlight.js/lib/languages/maxima.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./maxima.js-D9SuC6Kk.cjs").default,1)),"../node_modules/highlight.js/lib/languages/mel.js":()=>Promise.resolve().then(()=>_.__toESM(require("./mel-DJskduyJ.cjs").default,1)),"../node_modules/highlight.js/lib/languages/mel.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./mel.js-DTY--CV3.cjs").default,1)),"../node_modules/highlight.js/lib/languages/mercury.js":()=>Promise.resolve().then(()=>_.__toESM(require("./mercury-BcZVTHo5.cjs").default,1)),"../node_modules/highlight.js/lib/languages/mercury.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./mercury.js-DZH2B6yp.cjs").default,1)),"../node_modules/highlight.js/lib/languages/mipsasm.js":()=>Promise.resolve().then(()=>_.__toESM(require("./mipsasm-BEsxyZIG.cjs").default,1)),"../node_modules/highlight.js/lib/languages/mipsasm.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./mipsasm.js-DZ4w8kVN.cjs").default,1)),"../node_modules/highlight.js/lib/languages/mizar.js":()=>Promise.resolve().then(()=>_.__toESM(require("./mizar-R32B7QQA.cjs").default,1)),"../node_modules/highlight.js/lib/languages/mizar.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./mizar.js-DEQiV4tw.cjs").default,1)),"../node_modules/highlight.js/lib/languages/mojolicious.js":()=>Promise.resolve().then(()=>_.__toESM(require("./mojolicious-CbZPHgti.cjs").default,1)),"../node_modules/highlight.js/lib/languages/mojolicious.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./mojolicious.js-BPWcJTMb.cjs").default,1)),"../node_modules/highlight.js/lib/languages/monkey.js":()=>Promise.resolve().then(()=>_.__toESM(require("./monkey-BlY2KDPS.cjs").default,1)),"../node_modules/highlight.js/lib/languages/monkey.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./monkey.js-Bhmjt4jI.cjs").default,1)),"../node_modules/highlight.js/lib/languages/moonscript.js":()=>Promise.resolve().then(()=>_.__toESM(require("./moonscript-BteOToM3.cjs").default,1)),"../node_modules/highlight.js/lib/languages/moonscript.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./moonscript.js-CJIW8WAr.cjs").default,1)),"../node_modules/highlight.js/lib/languages/n1ql.js":()=>Promise.resolve().then(()=>_.__toESM(require("./n1ql-DI5cg70k.cjs").default,1)),"../node_modules/highlight.js/lib/languages/n1ql.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./n1ql.js-Cmac1nng.cjs").default,1)),"../node_modules/highlight.js/lib/languages/nestedtext.js":()=>Promise.resolve().then(()=>_.__toESM(require("./nestedtext-Dd5l7e78.cjs").default,1)),"../node_modules/highlight.js/lib/languages/nestedtext.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./nestedtext.js-CPsWZFRO.cjs").default,1)),"../node_modules/highlight.js/lib/languages/nginx.js":()=>Promise.resolve().then(()=>_.__toESM(require("./nginx-sNIo6wov.cjs").default,1)),"../node_modules/highlight.js/lib/languages/nginx.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./nginx.js-q2l7Df8z.cjs").default,1)),"../node_modules/highlight.js/lib/languages/nim.js":()=>Promise.resolve().then(()=>_.__toESM(require("./nim-De6VTy6d.cjs").default,1)),"../node_modules/highlight.js/lib/languages/nim.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./nim.js-DRepkz_J.cjs").default,1)),"../node_modules/highlight.js/lib/languages/nix.js":()=>Promise.resolve().then(()=>_.__toESM(require("./nix-D8lGYC5x.cjs").default,1)),"../node_modules/highlight.js/lib/languages/nix.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./nix.js-wxvohFgv.cjs").default,1)),"../node_modules/highlight.js/lib/languages/node-repl.js":()=>Promise.resolve().then(()=>_.__toESM(require("./node-repl-B1PV2ol5.cjs").default,1)),"../node_modules/highlight.js/lib/languages/node-repl.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./node-repl.js-B1P_OnL1.cjs").default,1)),"../node_modules/highlight.js/lib/languages/nsis.js":()=>Promise.resolve().then(()=>_.__toESM(require("./nsis-CJEzhL04.cjs").default,1)),"../node_modules/highlight.js/lib/languages/nsis.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./nsis.js-Dn0MqeSG.cjs").default,1)),"../node_modules/highlight.js/lib/languages/objectivec.js":()=>Promise.resolve().then(()=>_.__toESM(require("./objectivec-DEkTVJD2.cjs").default,1)),"../node_modules/highlight.js/lib/languages/objectivec.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./objectivec.js-BedMt3CU.cjs").default,1)),"../node_modules/highlight.js/lib/languages/ocaml.js":()=>Promise.resolve().then(()=>_.__toESM(require("./ocaml-hgsJDuI7.cjs").default,1)),"../node_modules/highlight.js/lib/languages/ocaml.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./ocaml.js-BAX57l4z.cjs").default,1)),"../node_modules/highlight.js/lib/languages/openscad.js":()=>Promise.resolve().then(()=>_.__toESM(require("./openscad-CqLifJEH.cjs").default,1)),"../node_modules/highlight.js/lib/languages/openscad.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./openscad.js-CBn4bw1V.cjs").default,1)),"../node_modules/highlight.js/lib/languages/oxygene.js":()=>Promise.resolve().then(()=>_.__toESM(require("./oxygene-DwuQ9gAX.cjs").default,1)),"../node_modules/highlight.js/lib/languages/oxygene.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./oxygene.js-BZSdb26F.cjs").default,1)),"../node_modules/highlight.js/lib/languages/parser3.js":()=>Promise.resolve().then(()=>_.__toESM(require("./parser3-CgtGfgMV.cjs").default,1)),"../node_modules/highlight.js/lib/languages/parser3.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./parser3.js-DXEF5L2f.cjs").default,1)),"../node_modules/highlight.js/lib/languages/perl.js":()=>Promise.resolve().then(()=>_.__toESM(require("./perl-DdSBqjze.cjs").default,1)),"../node_modules/highlight.js/lib/languages/perl.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./perl.js-7AIcGKq5.cjs").default,1)),"../node_modules/highlight.js/lib/languages/pf.js":()=>Promise.resolve().then(()=>_.__toESM(require("./pf-BDVAr3db.cjs").default,1)),"../node_modules/highlight.js/lib/languages/pf.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./pf.js-Cmh9T_Il.cjs").default,1)),"../node_modules/highlight.js/lib/languages/pgsql.js":()=>Promise.resolve().then(()=>_.__toESM(require("./pgsql-DS3Bhgdi.cjs").default,1)),"../node_modules/highlight.js/lib/languages/pgsql.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./pgsql.js-0mAtUj2Q.cjs").default,1)),"../node_modules/highlight.js/lib/languages/php-template.js":()=>Promise.resolve().then(()=>_.__toESM(require("./php-template-p6KSftUn.cjs").default,1)),"../node_modules/highlight.js/lib/languages/php-template.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./php-template.js-bNQkw97o.cjs").default,1)),"../node_modules/highlight.js/lib/languages/php.js":()=>Promise.resolve().then(()=>_.__toESM(require("./php-C_M085S7.cjs").default,1)),"../node_modules/highlight.js/lib/languages/php.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./php.js-C2e7qNSh.cjs").default,1)),"../node_modules/highlight.js/lib/languages/plaintext.js":()=>Promise.resolve().then(()=>_.__toESM(require("./plaintext-YXsrDPqQ.cjs").default,1)),"../node_modules/highlight.js/lib/languages/plaintext.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./plaintext.js-LQ8EWij9.cjs").default,1)),"../node_modules/highlight.js/lib/languages/pony.js":()=>Promise.resolve().then(()=>_.__toESM(require("./pony-B21x8psk.cjs").default,1)),"../node_modules/highlight.js/lib/languages/pony.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./pony.js-eV0-1Ztv.cjs").default,1)),"../node_modules/highlight.js/lib/languages/powershell.js":()=>Promise.resolve().then(()=>_.__toESM(require("./powershell-BeXYmqrM.cjs").default,1)),"../node_modules/highlight.js/lib/languages/powershell.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./powershell.js-DdheDHzs.cjs").default,1)),"../node_modules/highlight.js/lib/languages/processing.js":()=>Promise.resolve().then(()=>_.__toESM(require("./processing-CeDUoGvP.cjs").default,1)),"../node_modules/highlight.js/lib/languages/processing.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./processing.js-fPdfHXDJ.cjs").default,1)),"../node_modules/highlight.js/lib/languages/profile.js":()=>Promise.resolve().then(()=>_.__toESM(require("./profile-DA1eyRJ5.cjs").default,1)),"../node_modules/highlight.js/lib/languages/profile.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./profile.js-gxp6e5mo.cjs").default,1)),"../node_modules/highlight.js/lib/languages/prolog.js":()=>Promise.resolve().then(()=>_.__toESM(require("./prolog-m2EjKk7Q.cjs").default,1)),"../node_modules/highlight.js/lib/languages/prolog.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./prolog.js-CpWQWeKY.cjs").default,1)),"../node_modules/highlight.js/lib/languages/properties.js":()=>Promise.resolve().then(()=>_.__toESM(require("./properties-xp8M5mtM.cjs").default,1)),"../node_modules/highlight.js/lib/languages/properties.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./properties.js-DiHEhgi8.cjs").default,1)),"../node_modules/highlight.js/lib/languages/protobuf.js":()=>Promise.resolve().then(()=>_.__toESM(require("./protobuf-CBXYqfoR.cjs").default,1)),"../node_modules/highlight.js/lib/languages/protobuf.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./protobuf.js-UyfGFDBZ.cjs").default,1)),"../node_modules/highlight.js/lib/languages/puppet.js":()=>Promise.resolve().then(()=>_.__toESM(require("./puppet-B8s1t0oD.cjs").default,1)),"../node_modules/highlight.js/lib/languages/puppet.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./puppet.js-CO5J9of7.cjs").default,1)),"../node_modules/highlight.js/lib/languages/purebasic.js":()=>Promise.resolve().then(()=>_.__toESM(require("./purebasic-e9I5YAd0.cjs").default,1)),"../node_modules/highlight.js/lib/languages/purebasic.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./purebasic.js-B0KGBawX.cjs").default,1)),"../node_modules/highlight.js/lib/languages/python-repl.js":()=>Promise.resolve().then(()=>_.__toESM(require("./python-repl-DaR7ZA0j.cjs").default,1)),"../node_modules/highlight.js/lib/languages/python-repl.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./python-repl.js-DTqvLPwI.cjs").default,1)),"../node_modules/highlight.js/lib/languages/python.js":()=>Promise.resolve().then(()=>_.__toESM(require("./python-BabXNodD.cjs").default,1)),"../node_modules/highlight.js/lib/languages/python.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./python.js-DnyyImUa.cjs").default,1)),"../node_modules/highlight.js/lib/languages/q.js":()=>Promise.resolve().then(()=>_.__toESM(require("./q-_JOX9Z-g.cjs").default,1)),"../node_modules/highlight.js/lib/languages/q.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./q.js-DY-DkZNW.cjs").default,1)),"../node_modules/highlight.js/lib/languages/qml.js":()=>Promise.resolve().then(()=>_.__toESM(require("./qml-DHdxPurO.cjs").default,1)),"../node_modules/highlight.js/lib/languages/qml.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./qml.js-DlIcVefy.cjs").default,1)),"../node_modules/highlight.js/lib/languages/r.js":()=>Promise.resolve().then(()=>_.__toESM(require("./r-DGNAj4aN.cjs").default,1)),"../node_modules/highlight.js/lib/languages/r.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./r.js-FacRCTOX.cjs").default,1)),"../node_modules/highlight.js/lib/languages/reasonml.js":()=>Promise.resolve().then(()=>_.__toESM(require("./reasonml-DEqtYzLr.cjs").default,1)),"../node_modules/highlight.js/lib/languages/reasonml.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./reasonml.js-CBL46pWy.cjs").default,1)),"../node_modules/highlight.js/lib/languages/rib.js":()=>Promise.resolve().then(()=>_.__toESM(require("./rib-DQu0cE6a.cjs").default,1)),"../node_modules/highlight.js/lib/languages/rib.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./rib.js-CtMFgiZa.cjs").default,1)),"../node_modules/highlight.js/lib/languages/roboconf.js":()=>Promise.resolve().then(()=>_.__toESM(require("./roboconf-DLnzrh3Q.cjs").default,1)),"../node_modules/highlight.js/lib/languages/roboconf.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./roboconf.js-DLCvSePj.cjs").default,1)),"../node_modules/highlight.js/lib/languages/routeros.js":()=>Promise.resolve().then(()=>_.__toESM(require("./routeros-CIJsAbZr.cjs").default,1)),"../node_modules/highlight.js/lib/languages/routeros.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./routeros.js-DKAiFqWb.cjs").default,1)),"../node_modules/highlight.js/lib/languages/rsl.js":()=>Promise.resolve().then(()=>_.__toESM(require("./rsl-nuSkTkUl.cjs").default,1)),"../node_modules/highlight.js/lib/languages/rsl.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./rsl.js-Bm0JJLZ0.cjs").default,1)),"../node_modules/highlight.js/lib/languages/ruby.js":()=>Promise.resolve().then(()=>_.__toESM(require("./ruby-FqjBoH-y.cjs").default,1)),"../node_modules/highlight.js/lib/languages/ruby.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./ruby.js-DsVRRciJ.cjs").default,1)),"../node_modules/highlight.js/lib/languages/ruleslanguage.js":()=>Promise.resolve().then(()=>_.__toESM(require("./ruleslanguage-kUYTRTlt.cjs").default,1)),"../node_modules/highlight.js/lib/languages/ruleslanguage.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./ruleslanguage.js-DsYDJSsV.cjs").default,1)),"../node_modules/highlight.js/lib/languages/rust.js":()=>Promise.resolve().then(()=>_.__toESM(require("./rust-CXyttlu1.cjs").default,1)),"../node_modules/highlight.js/lib/languages/rust.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./rust.js-CtaEN25S.cjs").default,1)),"../node_modules/highlight.js/lib/languages/sas.js":()=>Promise.resolve().then(()=>_.__toESM(require("./sas-BrWi1N3n.cjs").default,1)),"../node_modules/highlight.js/lib/languages/sas.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./sas.js-bKc_Q6jT.cjs").default,1)),"../node_modules/highlight.js/lib/languages/scala.js":()=>Promise.resolve().then(()=>_.__toESM(require("./scala-BDZofrzo.cjs").default,1)),"../node_modules/highlight.js/lib/languages/scala.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./scala.js-C04bU-4c.cjs").default,1)),"../node_modules/highlight.js/lib/languages/scheme.js":()=>Promise.resolve().then(()=>_.__toESM(require("./scheme-C9W9Egmd.cjs").default,1)),"../node_modules/highlight.js/lib/languages/scheme.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./scheme.js-BMYGIjs8.cjs").default,1)),"../node_modules/highlight.js/lib/languages/scilab.js":()=>Promise.resolve().then(()=>_.__toESM(require("./scilab-DxNYYVVe.cjs").default,1)),"../node_modules/highlight.js/lib/languages/scilab.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./scilab.js-BmI3Qvho.cjs").default,1)),"../node_modules/highlight.js/lib/languages/scss.js":()=>Promise.resolve().then(()=>_.__toESM(require("./scss-Sq0W8Nt3.cjs").default,1)),"../node_modules/highlight.js/lib/languages/scss.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./scss.js-BOdwR3p7.cjs").default,1)),"../node_modules/highlight.js/lib/languages/shell.js":()=>Promise.resolve().then(()=>_.__toESM(require("./shell-B1JCP2rn.cjs").default,1)),"../node_modules/highlight.js/lib/languages/shell.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./shell.js-B3MBDtyb.cjs").default,1)),"../node_modules/highlight.js/lib/languages/smali.js":()=>Promise.resolve().then(()=>_.__toESM(require("./smali-Dj7gPJXS.cjs").default,1)),"../node_modules/highlight.js/lib/languages/smali.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./smali.js-CUgK9k4O.cjs").default,1)),"../node_modules/highlight.js/lib/languages/smalltalk.js":()=>Promise.resolve().then(()=>_.__toESM(require("./smalltalk-l4AT3nY0.cjs").default,1)),"../node_modules/highlight.js/lib/languages/smalltalk.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./smalltalk.js-BGCgzMs1.cjs").default,1)),"../node_modules/highlight.js/lib/languages/sml.js":()=>Promise.resolve().then(()=>_.__toESM(require("./sml-Bq4eaY0H.cjs").default,1)),"../node_modules/highlight.js/lib/languages/sml.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./sml.js-HvaELMjn.cjs").default,1)),"../node_modules/highlight.js/lib/languages/sqf.js":()=>Promise.resolve().then(()=>_.__toESM(require("./sqf-BZz39Pic.cjs").default,1)),"../node_modules/highlight.js/lib/languages/sqf.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./sqf.js-CrthGvb1.cjs").default,1)),"../node_modules/highlight.js/lib/languages/sql.js":()=>Promise.resolve().then(()=>_.__toESM(require("./sql-C8xnwdE2.cjs").default,1)),"../node_modules/highlight.js/lib/languages/sql.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./sql.js-BoU2TsrW.cjs").default,1)),"../node_modules/highlight.js/lib/languages/stan.js":()=>Promise.resolve().then(()=>_.__toESM(require("./stan-BrCuHKvY.cjs").default,1)),"../node_modules/highlight.js/lib/languages/stan.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./stan.js-PaYdENc-.cjs").default,1)),"../node_modules/highlight.js/lib/languages/stata.js":()=>Promise.resolve().then(()=>_.__toESM(require("./stata-Bns1e2d5.cjs").default,1)),"../node_modules/highlight.js/lib/languages/stata.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./stata.js-B9WmfXFH.cjs").default,1)),"../node_modules/highlight.js/lib/languages/step21.js":()=>Promise.resolve().then(()=>_.__toESM(require("./step21-DdSaqED1.cjs").default,1)),"../node_modules/highlight.js/lib/languages/step21.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./step21.js-BCMvCKrT.cjs").default,1)),"../node_modules/highlight.js/lib/languages/stylus.js":()=>Promise.resolve().then(()=>_.__toESM(require("./stylus-3CPY_iyk.cjs").default,1)),"../node_modules/highlight.js/lib/languages/stylus.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./stylus.js-C9m96lSh.cjs").default,1)),"../node_modules/highlight.js/lib/languages/subunit.js":()=>Promise.resolve().then(()=>_.__toESM(require("./subunit-DfUwnpC9.cjs").default,1)),"../node_modules/highlight.js/lib/languages/subunit.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./subunit.js-DOHolS5G.cjs").default,1)),"../node_modules/highlight.js/lib/languages/swift.js":()=>Promise.resolve().then(()=>_.__toESM(require("./swift-Bp-HP-Xp.cjs").default,1)),"../node_modules/highlight.js/lib/languages/swift.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./swift.js-p8ryOkPl.cjs").default,1)),"../node_modules/highlight.js/lib/languages/taggerscript.js":()=>Promise.resolve().then(()=>_.__toESM(require("./taggerscript-DsXy8B5q.cjs").default,1)),"../node_modules/highlight.js/lib/languages/taggerscript.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./taggerscript.js-2vgwWVzy.cjs").default,1)),"../node_modules/highlight.js/lib/languages/tap.js":()=>Promise.resolve().then(()=>_.__toESM(require("./tap-ClIu_Cwx.cjs").default,1)),"../node_modules/highlight.js/lib/languages/tap.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./tap.js-DbMtTTIp.cjs").default,1)),"../node_modules/highlight.js/lib/languages/tcl.js":()=>Promise.resolve().then(()=>_.__toESM(require("./tcl-AtoKwnyG.cjs").default,1)),"../node_modules/highlight.js/lib/languages/tcl.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./tcl.js-CMYCl9IM.cjs").default,1)),"../node_modules/highlight.js/lib/languages/thrift.js":()=>Promise.resolve().then(()=>_.__toESM(require("./thrift-eqb5ad3-.cjs").default,1)),"../node_modules/highlight.js/lib/languages/thrift.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./thrift.js-DwA8SfXH.cjs").default,1)),"../node_modules/highlight.js/lib/languages/tp.js":()=>Promise.resolve().then(()=>_.__toESM(require("./tp-Cr7WS0JD.cjs").default,1)),"../node_modules/highlight.js/lib/languages/tp.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./tp.js-DK1z1P3f.cjs").default,1)),"../node_modules/highlight.js/lib/languages/twig.js":()=>Promise.resolve().then(()=>_.__toESM(require("./twig-C2XdZkfk.cjs").default,1)),"../node_modules/highlight.js/lib/languages/twig.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./twig.js-jGhmeMYu.cjs").default,1)),"../node_modules/highlight.js/lib/languages/typescript.js":()=>Promise.resolve().then(()=>_.__toESM(require("./typescript-DpbBoxML.cjs").default,1)),"../node_modules/highlight.js/lib/languages/typescript.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./typescript.js-C0KUXFpi.cjs").default,1)),"../node_modules/highlight.js/lib/languages/vala.js":()=>Promise.resolve().then(()=>_.__toESM(require("./vala-B3FFN8sw.cjs").default,1)),"../node_modules/highlight.js/lib/languages/vala.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./vala.js-vfhDYRuA.cjs").default,1)),"../node_modules/highlight.js/lib/languages/vbnet.js":()=>Promise.resolve().then(()=>_.__toESM(require("./vbnet-BR56pKlD.cjs").default,1)),"../node_modules/highlight.js/lib/languages/vbnet.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./vbnet.js-C40193Rl.cjs").default,1)),"../node_modules/highlight.js/lib/languages/vbscript-html.js":()=>Promise.resolve().then(()=>_.__toESM(require("./vbscript-html-C6CZ29UG.cjs").default,1)),"../node_modules/highlight.js/lib/languages/vbscript-html.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./vbscript-html.js-jIY4j8Rh.cjs").default,1)),"../node_modules/highlight.js/lib/languages/vbscript.js":()=>Promise.resolve().then(()=>_.__toESM(require("./vbscript-e900iNED.cjs").default,1)),"../node_modules/highlight.js/lib/languages/vbscript.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./vbscript.js-rpbuwInv.cjs").default,1)),"../node_modules/highlight.js/lib/languages/verilog.js":()=>Promise.resolve().then(()=>_.__toESM(require("./verilog-ahvVPk-f.cjs").default,1)),"../node_modules/highlight.js/lib/languages/verilog.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./verilog.js-DI8IYuVf.cjs").default,1)),"../node_modules/highlight.js/lib/languages/vhdl.js":()=>Promise.resolve().then(()=>_.__toESM(require("./vhdl-BLbL1Xe7.cjs").default,1)),"../node_modules/highlight.js/lib/languages/vhdl.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./vhdl.js-pBQIv2ml.cjs").default,1)),"../node_modules/highlight.js/lib/languages/vim.js":()=>Promise.resolve().then(()=>_.__toESM(require("./vim-ByUfaHvG.cjs").default,1)),"../node_modules/highlight.js/lib/languages/vim.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./vim.js-BEnmitfI.cjs").default,1)),"../node_modules/highlight.js/lib/languages/wasm.js":()=>Promise.resolve().then(()=>_.__toESM(require("./wasm-DcUSfqPz.cjs").default,1)),"../node_modules/highlight.js/lib/languages/wasm.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./wasm.js-BMzPPCJK.cjs").default,1)),"../node_modules/highlight.js/lib/languages/wren.js":()=>Promise.resolve().then(()=>_.__toESM(require("./wren-DwycCadj.cjs").default,1)),"../node_modules/highlight.js/lib/languages/wren.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./wren.js-Bq7ljy1m.cjs").default,1)),"../node_modules/highlight.js/lib/languages/x86asm.js":()=>Promise.resolve().then(()=>_.__toESM(require("./x86asm-Dyv904iL.cjs").default,1)),"../node_modules/highlight.js/lib/languages/x86asm.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./x86asm.js-BIZahpBG.cjs").default,1)),"../node_modules/highlight.js/lib/languages/xl.js":()=>Promise.resolve().then(()=>_.__toESM(require("./xl-BIBFk2OS.cjs").default,1)),"../node_modules/highlight.js/lib/languages/xl.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./xl.js-CjfdyOFo.cjs").default,1)),"../node_modules/highlight.js/lib/languages/xml.js":()=>Promise.resolve().then(()=>_.__toESM(require("./xml-DSpFv5WL.cjs").default,1)),"../node_modules/highlight.js/lib/languages/xml.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./xml.js-Cn2luDj5.cjs").default,1)),"../node_modules/highlight.js/lib/languages/xquery.js":()=>Promise.resolve().then(()=>_.__toESM(require("./xquery-C4S9Usc0.cjs").default,1)),"../node_modules/highlight.js/lib/languages/xquery.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./xquery.js-CeRmEHwo.cjs").default,1)),"../node_modules/highlight.js/lib/languages/yaml.js":()=>Promise.resolve().then(()=>_.__toESM(require("./yaml-BONCVKAM.cjs").default,1)),"../node_modules/highlight.js/lib/languages/yaml.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./yaml.js-Cjtck25U.cjs").default,1)),"../node_modules/highlight.js/lib/languages/zephir.js":()=>Promise.resolve().then(()=>_.__toESM(require("./zephir-DuycYrMr.cjs").default,1)),"../node_modules/highlight.js/lib/languages/zephir.js.js":()=>Promise.resolve().then(()=>_.__toESM(require("./zephir.js-CuxG4i9e.cjs").default,1))}),Dn="11.12.0",Oe=new Map,ec=`https://raw.githubusercontent.com/highlightjs/highlight.js/${Dn}/SUPPORTED_LANGUAGES.md`,Jt={shell:"bash",sh:"bash",zsh:"bash",js:"javascript",ts:"typescript",py:"python",csharp:"cs","c#":"cs"};Jt.html="xml";Jt.xhtml="xml";Jt.markup="xml";var Hs=new Set(["magic","undefined"]),kn=null,tc=3,nc=3e5,Ur=new Map;function pa(e){try{const t=Ur.get(e);return t?t.openUntil&&Date.now()<t.openUntil?!0:(t.openUntil&&Date.now()>=t.openUntil&&Ur.delete(e),!1):!1}catch{return!1}}function ma(e){if(e)try{const t=Ur.get(e)||{failures:0,openUntil:0,warned:!1};if(t.failures=(t.failures||0)+1,t.failures>=tc&&(t.openUntil=Date.now()+nc,!t.warned)){try{k("[codeblocksManager] CDN circuit opened for "+e+"; skipping CDN imports temporarily")}catch{}t.warned=!0}Ur.set(e,t)}catch{}}function _a(e){try{e&&Ur.delete(e)}catch{}}var ya=null;async function Gs(e=ec){if(e)return kn||(kn=(async()=>{try{const t=await fetch(e);if(!t.ok)return;const n=(await t.text()).split(/\r?\n/);let r=-1;for(let l=0;l<n.length;l++)if(/\|\s*Language\s*\|/i.test(n[l])){r=l;break}if(r===-1)return;const i=n[r].replace(/^\||\|$/g,"").split("|").map(l=>l.trim().toLowerCase());let s=i.findIndex(l=>/alias|aliases|equivalent|alt|alternates?/i.test(l));s===-1&&(s=1);let o=i.findIndex(l=>/file|filename|module|module name|module-name|short|slug/i.test(l));if(o===-1){const l=i.findIndex(c=>/language/i.test(c));o=l!==-1?l:0}let a=[];for(let l=r+1;l<n.length;l++){const c=n[l].trim();if(!c||!c.startsWith("|"))break;const u=c.replace(/^\||\|$/g,"").split("|").map(m=>m.trim());if(u.every(m=>/^-+$/.test(m)))continue;const d=u;if(!d.length)continue;const f=(d[o]||d[0]||"").toString().trim().toLowerCase();if(!f||/^-+$/.test(f))continue;Oe.set(f,f);const g=d[s]||"";if(g){const m=String(g).split(",").map(p=>p.replace(/`/g,"").trim()).filter(Boolean);if(m.length){const p=m[0].toLowerCase().replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/gi,"");p&&/[a-z0-9]/i.test(p)&&(Oe.set(p,p),a.push(p))}}}try{const l=[];for(const c of a){const u=String(c??"").replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/gi,"");u&&/[a-z0-9]/i.test(u)?l.push(u):Oe.delete(c)}a=l}catch(l){k("[codeblocksManager] cleanup aliases failed",l)}try{let l=0;for(const c of Array.from(Oe.keys())){if(!c||/^-+$/.test(c)||!/[a-z0-9]/i.test(c)){Oe.delete(c),l++;continue}if(/^[:]+/.test(c)){const u=c.replace(/^[:]+/,"");if(u&&/[a-z0-9]/i.test(u)){const d=Oe.get(c);Oe.delete(c),Oe.set(u,d)}else Oe.delete(c),l++}}for(const[c,u]of Array.from(Oe.entries()))(!u||/^-+$/.test(u)||!/[a-z0-9]/i.test(u))&&(Oe.delete(c),l++);try{const c=":---------------------";Oe.has(c)&&(Oe.delete(c),l++)}catch(c){k("[codeblocksManager] remove sep key failed",c)}try{Array.from(Oe.keys()).sort()}catch(c){k("[codeblocksManager] compute supported keys failed",c)}}catch(l){k("[codeblocksManager] ignored error",l)}}catch(t){k("[codeblocksManager] loadSupportedLanguages failed",t)}})(),kn)}var ts=new Set,ba=new Set;function ns(e,t,n){const r=String(e||"").toLowerCase();if(!(!r||ba.has(r))){ba.add(r);try{k("[codeblocksManager] language import failed; using plaintext/highlightElement fallback",{language:e,candidates:Array.isArray(t)?t:[],error:n?String(n?.message||n):"unknown"})}catch{}}}async function rr(e,t){if(kn||(async()=>{try{await Gs()}catch(i){k("[codeblocksManager] loadSupportedLanguages (IIFE) failed",i)}})(),kn)try{await kn}catch{}if(e=e==null?"":String(e),e=e.trim(),!e)return!1;const n=e.toLowerCase();if(Hs.has(n))return!1;if(Oe.size&&!Oe.has(n)){const i=Jt;if(!i[n]&&!i[e])return!1}if(ts.has(e))return!0;const r=Jt;try{const i=(t||e||"").toString().replace(/\.js$/i,"").trim(),s=(r[e]||e||"").toString(),o=(r[i]||i||"").toString();let a=Array.from(new Set([s,o,i,e,r[i],r[e]].filter(Boolean))).map(u=>String(u).toLowerCase()).filter(u=>u&&u!=="undefined");Oe.size&&(a=a.filter(u=>{if(Oe.has(u))return!0;const d=Jt[u];return!!(d&&Oe.has(d))}));let l=null,c=null;for(const u of a)try{if(l=await Kl(u,async()=>{try{if(typeof ya=="function")try{return await ya(u)}catch{return null}const d=`highlight.js/lib/languages/${u}.js`,f=Jl[d];if(f&&typeof f=="function")try{return await f()}catch{}try{try{return await import(`highlight.js/lib/languages/${u}.js`)}catch{return await import(`highlight.js/lib/languages/${u}`)}}catch{}if(!Dn)return null;try{const g=`https://cdn.jsdelivr.net/npm/highlight.js@${Dn}/es/languages/${u}.js`;let m=null;try{m=new URL(g).host}catch{m=null}if(!pa(m))try{const p=await import(g);return _a(m),p}catch{ma(m)}try{const p=`https://cdn.jsdelivr.net/npm/highlight.js@${Dn}/lib/languages/${u}.js`;let y=null;try{y=new URL(p).host}catch{y=null}if(!pa(y))try{const h=await import(p);return _a(y),h}catch{return ma(y),null}}catch{return null}}catch{try{return await import(`https://cdn.jsdelivr.net/npm/highlight.js@${Dn}/lib/languages/${u}.js`)}catch{return null}}}catch{return null}}),l){const d=l.default||l;try{const f=Oe.size&&Oe.get(e)||u||e;return Ye.registerLanguage(f,d),ts.add(f),f!==e&&(Ye.registerLanguage(e,d),ts.add(e)),!0}catch(f){c=f}}}catch(d){c=d}return c?(ns(e,a,c),!1):(a.length&&ns(e,a,null),!1)}catch(i){return ns(e,[],i),!1}}var rs=null;function Eo(e){const t=e?.querySelector?e:typeof document<"u"?document:null;kn||(async()=>{try{await Gs()}catch(s){k("[codeblocksManager] loadSupportedLanguages (observer) failed",s)}})();const n=Jt;typeof IntersectionObserver<"u"&&!rs&&(rs=new IntersectionObserver((s,o)=>{s.forEach(a=>{if(!a.isIntersecting)return;const l=a.target;try{o.unobserve(l)}catch(c){k("[codeblocksManager] observer unobserve failed",c)}(async()=>{try{const c=l.getAttribute&&l.getAttribute("class")||l.className||"",u=c.match(/language-([a-zA-Z0-9_+-]+)/)||c.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(u&&u[1]){const d=(u[1]||"").toLowerCase(),f=n[d]||d,g=Oe.size&&(Oe.get(f)||Oe.get(String(f).toLowerCase()))||f;try{await rr(g)}catch(m){k("[codeblocksManager] registerLanguage failed",m)}try{try{const m=l.textContent||l.innerText||"";m!=null&&(l.textContent=m)}catch{}try{l?.dataset?.highlighted&&delete l.dataset.highlighted}catch{}Ye.highlightElement(l)}catch(m){k("[codeblocksManager] hljs.highlightElement failed",m)}}else try{const d=l.textContent||"";try{if(Ye&&typeof Ye.getLanguage=="function"&&Ye.getLanguage("plaintext")){const f=Ye.highlight(d,{language:"plaintext"});if(f&&f.value)try{if(typeof document<"u"&&document.createRange&&typeof document.createRange=="function"){const g=document.createRange().createContextualFragment(f.value);if(typeof l.replaceChildren=="function")l.replaceChildren(...Array.from(g.childNodes));else{for(;l.firstChild;)l.removeChild(l.firstChild);l.appendChild(g)}}else l.innerHTML=f.value}catch{try{l.innerHTML=f.value}catch{}}}}catch{try{Ye.highlightElement(l)}catch(g){k("[codeblocksManager] fallback highlightElement failed",g)}}}catch(d){k("[codeblocksManager] auto-detect plaintext failed",d)}}catch(c){k("[codeblocksManager] observer entry processing failed",c)}})()})},{root:null,rootMargin:"300px",threshold:.1}));const r=rs,i=t?.querySelectorAll?t.querySelectorAll("pre code"):[];if(!r){i.forEach(async s=>{try{const o=s.getAttribute&&s.getAttribute("class")||s.className||"",a=o.match(/language-([a-zA-Z0-9_+-]+)/)||o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(a&&a[1]){const l=(a[1]||"").toLowerCase(),c=n[l]||l,u=Oe.size&&(Oe.get(c)||Oe.get(String(c).toLowerCase()))||c;try{await rr(u)}catch(d){k("[codeblocksManager] registerLanguage failed (no observer)",d)}}try{try{const l=s.textContent||s.innerText||"";l!=null&&(s.textContent=l)}catch{}try{s&&s.dataset&&s.dataset.highlighted&&delete s.dataset.highlighted}catch{}Ye.highlightElement(s)}catch(l){k("[codeblocksManager] hljs.highlightElement failed (no observer)",l)}}catch(o){k("[codeblocksManager] loadSupportedLanguages fallback ignored error",o)}});return}i.forEach(s=>{try{r.observe(s)}catch(o){k("[codeblocksManager] observe failed",o)}})}function rc(e,{useCdn:t=!0}={}){const n=typeof document<"u"&&document.head&&document.head.querySelector?document.head.querySelector("link[data-hl-theme]"):typeof document<"u"?document.querySelector("link[data-hl-theme]"):null,r=n?.getAttribute?n.getAttribute("data-hl-theme"):null,i=e==null?"default":String(e),s=i&&String(i).toLowerCase()||"";if(s==="default"||s==="monokai"){try{n?.parentNode&&n.parentNode.removeChild(n)}catch{}return}if(r&&r.toLowerCase()===s)return;if(!t){try{k("Requested highlight theme not bundled; set useCdn=true to load theme from CDN")}catch{}return}if(!Dn){try{k("Cannot load highlight.js theme from CDN: HIGHLIGHT_JS_VERSION is not defined")}catch{}return}const o=s,a=`https://cdn.jsdelivr.net/npm/highlight.js@${Dn}/styles/${o}.css`,l=document.createElement("link");l.rel="stylesheet",l.href=a,l.setAttribute("data-hl-theme",o),l.addEventListener("load",()=>{try{n?.parentNode&&n.parentNode.removeChild(n)}catch{}}),document.head.appendChild(l)}var Xr=e=>e===void 0?"__undefined":String(e),ic=new ar(function(e){return String(e??"").replace(/^[.\/]+/,"")},{keyResolver:Xr,cacheOptions:{maxEntries:2e3}}),sc=new ar(function(e){return String(e??"").replace(/\/+$/,"")},{keyResolver:Xr,cacheOptions:{maxEntries:2e3}}),ac=new ar(function(e){return Wn(String(e??""))+"/"},{keyResolver:Xr,cacheOptions:{maxEntries:2e3}}),Qf=new ar(function(e){try{const t=String(e??"");return t.includes("%")?t:encodeURI(t)}catch(t){return k("[helpers] encodeURL failed",t),String(e??"")}},{keyResolver:Xr,cacheOptions:{maxEntries:2e3}}),oc=new ar(function(e){try{if(!e&&e!==0)return"";const t=String(e),n={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:" "};return t.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g,(r,i)=>{if(!i)return r;if(i[0]==="#")try{return i[1]==="x"||i[1]==="X"?String.fromCharCode(parseInt(i.slice(2),16)):String.fromCharCode(parseInt(i.slice(1),10))}catch{return r}return n[i]!==void 0?n[i]:r})}catch{return String(e??"")}},{keyResolver:Xr,cacheOptions:{maxEntries:2e3}});function Pi(e){return!e||typeof e!="string"?!1:/^(https?:)?\/\//.test(e)||e.startsWith("mailto:")||e.startsWith("tel:")}var re=e=>ic.run(e),Wn=e=>sc.run(e),Mn=e=>ac.run(e);function lc(e){try{if(!e||typeof document>"u"||!document.head||e.startsWith("data:")||document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`))return;const t=document.createElement("link");t.rel="preload",t.as="image",t.href=e,document.head.appendChild(t)}catch(t){k("[helpers] preloadImage failed",t)}}var cc=["https://cdn.jsdelivr.net","https://unpkg.com"];function uc(){try{if(typeof document>"u"||!document.head)return;for(const e of cc)try{if(document.querySelector(`link[rel="preconnect"][href="${e}"]`))continue;const t=document.createElement("link");t.rel="preconnect",t.href=e,t.crossOrigin="anonymous",document.head.appendChild(t)}catch{}}catch{}}function hc(e,t="monokai"){try{if(typeof document>"u"||!document.head||!e)return;const n=`https://cdn.jsdelivr.net/npm/highlight.js@${e}/styles/${t}.css`;try{if(document.querySelector(`link[rel="preload"][href="${n}"]`))return;const r=document.createElement("link");r.rel="preload",r.as="style",r.href=n,r.crossOrigin="anonymous",r.fetchPriority="high",document.head.appendChild(r)}catch{}}catch{}}var ks=null;function fc(e){ks=typeof e=="string"?e:null}function Vs(e){if(ks&&e&&typeof e.setAttribute=="function")try{e.setAttribute("nonce",ks)}catch{}}function is(e,t=0,n=!1){try{if(typeof window>"u"||!e||!e.querySelectorAll)return;const r=Array.from(e.querySelectorAll("img"));if(!r.length)return;const i=e,s=i?.getBoundingClientRect?i.getBoundingClientRect():null,o=0,a=typeof window<"u"&&(window.innerHeight||document.documentElement.clientHeight)||0,l=s?Math.max(o,s.top):o,c=(s?Math.min(a,s.bottom):a)+Number(t||0);let u=0;i&&(u=i.clientHeight||(s?s.height:0)),u||(u=a-o);let d=.6;try{const p=i&&window.getComputedStyle?window.getComputedStyle(i):null,y=p?.getPropertyValue?p.getPropertyValue("--nimbi-image-max-height-ratio"):null,h=y?parseFloat(y):NaN;!Number.isNaN(h)&&h>0&&h<=1&&(d=h)}catch(p){k("[helpers] read CSS ratio failed",p)}const f=Math.max(200,Math.floor(u*d));let g=null,m=!1;if(r.forEach(p=>{try{const y=p.getAttribute?.("loading"),h=y==="eager",w=p?.getBoundingClientRect?p.getBoundingClientRect():null,b=p.src||p.getAttribute?.("src"),S=w?.height>1?w.height:f,A=w?w.top:0,z=A+S;w&&S>0&&A<=c&&z>=l&&!m?(p.setAttribute?(p.setAttribute("loading","eager"),p.setAttribute("fetchpriority","high"),p.setAttribute("data-eager-by-nimbi","1")):(p.loading="eager",p.fetchPriority="high"),lc(b),m=!0):!h&&p.setAttribute&&p.setAttribute("loading","lazy"),!g&&w?.top<=c&&(g={img:p,src:b,rect:w,beforeLoading:y,explicitEager:h})}catch(y){k("[helpers] setEagerForAboveFoldImages per-image failed",y)}}),!m&&g){const{img:p,src:y,explicitEager:h}=g;if(!h)try{p.setAttribute?(p.setAttribute("loading","eager"),p.setAttribute("fetchpriority","high"),p.setAttribute("data-eager-by-nimbi","1")):(p.loading="eager",p.fetchPriority="high"),m=!0}catch(w){k("[helpers] setEagerForAboveFoldImages fallback failed",w)}}}catch(r){k("[helpers] setEagerForAboveFoldImages failed",r)}}function Fe(e,t=null,n){try{const r=typeof n=="string"?n:typeof window<"u"&&window.location?window.location.search:"",i=new URLSearchParams(r.startsWith("?")?r.slice(1):r),s=String(e??"");i.delete("page");const o=new URLSearchParams;o.set("page",s);for(const[c,u]of i.entries())o.append(c,u);const a=o.toString();let l=a?`?${a}`:"";return t&&(l+=`#${encodeURIComponent(t)}`),l||`?page=${encodeURIComponent(s)}`}catch{const i=`?page=${encodeURIComponent(String(e??""))}`;return t?`${i}#${encodeURIComponent(t)}`:i}}function Ri(e){try{const t=e();return t&&typeof t.then=="function"?t.catch(n=>{k("[helpers] safe swallowed error",n)}):t}catch(t){k("[helpers] safe swallowed error",t)}}try{typeof globalThis<"u"&&!globalThis.safe&&(globalThis.safe=Ri)}catch(e){k("[helpers] global attach failed",e)}var dc=e=>oc.run(e),Ao=()=>typeof navigator<"u"&&navigator.hardwareConcurrency?Math.max(1,Math.floor(navigator.hardwareConcurrency/2)):2,qn="light";function gc(e,t={}){if(document.querySelector(`link[href="${e}"]`))return;const n=document.createElement("link");if(n.rel="stylesheet",n.href=e,Object.entries(t).forEach(([r,i])=>n.setAttribute(r,i)),document.head.appendChild(n),t["data-bulmaswatch-theme"])try{if(n.getAttribute("data-bulmaswatch-observer"))return;let r=Number(n.getAttribute("data-bulmaswatch-move-count")||0),i=!1,s=null;try{const l=n.getAttribute("data-bulmaswatch-observer");l&&(s=document.querySelector(`[data-bulmaswatch-observer="${l}"]`))}catch{s=null}const o=()=>{try{if(i)return;const l=n.parentNode;if(!l||l.lastElementChild===n)return;const c=Number(n.getAttribute("data-bulmaswatch-move-count")||0);if(c>=1e3){if(n.setAttribute("data-bulmaswatch-move-stopped","1"),s)try{s.disconnect()}catch{}return}i=!0;try{l.appendChild(n)}catch{}const u=c+1;n.setAttribute("data-bulmaswatch-move-count",String(u)),i=!1}catch{}};s||(s=new MutationObserver(o));try{s.observe(document.head,{childList:!0}),n.setAttribute("data-bulmaswatch-observer","1"),n.setAttribute("data-bulmaswatch-move-count",String(r))}catch{}const a=document.head;a?.lastElementChild!==n&&a?.appendChild(n)}catch{}}function ss(){try{const e=typeof document<"u"&&document?.head?document.head:document,t=Array.from(e.querySelectorAll("link[data-bulmaswatch-theme]"));for(const n of t)n?.parentNode?.removeChild(n)}catch{}try{const e=typeof document<"u"&&document?.head?document.head:document,t=Array.from(e.querySelectorAll("style[data-bulma-override]"));for(const n of t)n?.parentNode?.removeChild(n)}catch{}}async function To(e="none",t="/"){try{ge("[bulmaManager] ensureBulma called",{bulmaCustomize:e,pageDir:t})}catch{}if(!e)return;if(e==="none"){try{ss()}catch{}return}const n=[t+"bulma.css","/bulma.css"],r=Array.from(new Set(n));if(e==="local"){if(ss(),document.querySelector("style[data-bulma-override]"))return;for(const i of r)try{const s=await fetch(i,{method:"GET"});if(s.ok){const o=await s.text(),a=document.createElement("style");a.setAttribute("data-bulma-override",i),Vs(a),a.appendChild(document.createTextNode(`
/* bulma override: ${i} */
`+o)),document.head.appendChild(a);return}}catch(s){k("[bulmaManager] fetch local bulma candidate failed",s)}return}try{const i=String(e).trim();if(!i)return;ss(),gc(`https://unpkg.com/bulmaswatch/${encodeURIComponent(i)}/bulmaswatch.min.css`,{"data-bulmaswatch-theme":i})}catch(i){k("[bulmaManager] ensureBulma failed",i)}}function Mo(e){qn=e==="dark"?"dark":e==="system"?"system":"light";try{const t=Array.from(document.querySelectorAll(".nimbi-mount"));if(t.length>0)for(const n of t)qn==="dark"?n.setAttribute("data-theme","dark"):qn==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme");else{const n=document.documentElement;qn==="dark"?n.setAttribute("data-theme","dark"):qn==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme")}}catch{}}function pc(e){const t=document.documentElement;for(const[n,r]of Object.entries(e||{}))try{t.style.setProperty(`--${n}`,r)}catch(i){k("[bulmaManager] setThemeVars failed for",n,i)}}function jo(e){if(!e||!(e instanceof HTMLElement))return()=>{};const t=e.closest?.(".nimbi-mount")||null;try{t&&(qn==="dark"?t.setAttribute("data-theme","dark"):qn==="light"?t.setAttribute("data-theme","light"):t.removeAttribute("data-theme"))}catch{}return()=>{}}var Po={en:{navigation:"Navigation",onThisPage:"On this page",home:"Home",scrollToTop:"Scroll to top",readingTime:"{minutes} min read",searchPlaceholder:"Search…",searchNoResults:"No results",imagePreviewTitle:"Image preview",imagePreviewFit:"Fit to screen",imagePreviewOriginal:"Original size",imagePreviewZoomOut:"Zoom out",imagePreviewZoomIn:"Zoom in",imagePreviewClose:"Close"},es:{navigation:"Navegación",onThisPage:"En esta página",home:"Inicio",scrollToTop:"Ir arriba",readingTime:"{minutes} min de lectura",searchPlaceholder:"Buscar…",searchNoResults:"Sin resultados",imagePreviewTitle:"Previsualización de imagen",imagePreviewFit:"Ajustar a la pantalla",imagePreviewOriginal:"Tamaño original",imagePreviewZoomOut:"Alejar",imagePreviewZoomIn:"Acercar",imagePreviewClose:"Cerrar"},de:{navigation:"Navigation",onThisPage:"Auf dieser Seite",home:"Startseite",scrollToTop:"Nach oben",readingTime:"{minutes} min Lesezeit",searchPlaceholder:"Suchen…",searchNoResults:"Keine Ergebnisse",imagePreviewTitle:"Bildvorschau",imagePreviewFit:"An Bildschirm anpassen",imagePreviewOriginal:"Originalgröße",imagePreviewZoomOut:"Verkleinern",imagePreviewZoomIn:"Vergrößern",imagePreviewClose:"Schließen"},fr:{navigation:"Navigation",onThisPage:"Sur cette page",home:"Accueil",scrollToTop:"Aller en haut",readingTime:"{minutes} min de lecture",searchPlaceholder:"Rechercher…",searchNoResults:"Aucun résultat",imagePreviewTitle:"Aperçu de l’image",imagePreviewFit:"Ajuster à l’écran",imagePreviewOriginal:"Taille originale",imagePreviewZoomOut:"Dézoomer",imagePreviewZoomIn:"Zoomer",imagePreviewClose:"Fermer"},pt:{navigation:"Navegação",onThisPage:"Nesta página",home:"Início",scrollToTop:"Ir para o topo",readingTime:"{minutes} min de leitura",searchPlaceholder:"Procurar…",searchNoResults:"Sem resultados",imagePreviewTitle:"Visualização da imagem",imagePreviewFit:"Ajustar à tela",imagePreviewOriginal:"Tamanho original",imagePreviewZoomOut:"Diminuir",imagePreviewZoomIn:"Aumentar",imagePreviewClose:"Fechar"}},xs=class{constructor(e={}){this._options=e||{}}static async run(e,t={}){if(typeof e!="function")throw new TypeError("fn must be a function");const{maxAttempts:n=3,backoff:r="exponential",baseDelay:i=100,maxDelay:s=Hl,jitter:o=!0,attemptTimeout:a,retryIf:l=()=>!0,onRetry:c}=t,u=Number(n);if(!Number.isFinite(u)||u<=0)throw new TypeError("maxAttempts must be a positive finite number");const d=Math.floor(u),f=m=>{let p;return r==="linear"?p=i*m:r==="fixed"?p=i:p=i*Math.pow(2,m-1),p>s&&(p=s),o&&(p=Math.round(p*(.5+Math.random()*.5))),p};let g;for(let m=1;m<=d;m++){let p=null,y;typeof a=="number"&&a>0&&typeof AbortController<"u"&&(p=new AbortController,y=p.signal);try{const h=(async()=>e(y))();if(p){let w,b=!1;try{return await Promise.race([h,new Promise((S,A)=>{w=setTimeout(()=>{b=!0;const z=new Error("Attempt timed out");z.code="ETIMEOUT",z.attempts=m,z.attemptTimeout=a,A(z)},a)})])}finally{if(w&&clearTimeout(w),b&&p)try{p.abort()}catch{}}}return await h}catch(h){if(g=h,!(typeof l=="function"?l(h):l)||m===d)break;const w=f(m);try{typeof c=="function"&&c(m,h,w)}catch{}await new Promise(b=>setTimeout(b,w))}}throw g}async run(e,t={}){const n=Object.assign({},this._options||{},t||{});return this.constructor.run(e,n)}},Rr=class{static async run(e,t={}){if(typeof e!="function")throw new TypeError("fn must be a function");const{maxAttempts:n=1,attemptTimeout:r=null,totalTimeout:i=null,retryDelay:s=0,retryIf:o=()=>!0,signal:a=null,onRetry:l,backoff:c,baseDelay:u,maxDelay:d,jitter:f}=t||{},g=Math.max(1,Math.floor(Number(n)||1)),m=Number(r)>0?Number(r):null,p=Number(i)>0?Number(i):null,y=Math.max(0,Number(s)||0),h=typeof o=="function"?o:()=>!!o,w=qe(),b=p!==null?w+p:null,S=b!==null&&typeof AbortController<"u"?new AbortController:null,A=()=>{if(!a)return null;if(a.aborted)return{promise:Promise.reject(wa(a.reason,w,p)),cleanup:null};let ae=null;return{promise:new Promise((he,ie)=>{const R=()=>{ie(wa(a.reason,w,p))};a.addEventListener("abort",R,{once:!0}),ae=()=>a.removeEventListener("abort",R)}),cleanup:ae}},z=async(ae,he)=>{const ie=qe();if(b!==null&&ie>=b){const I=new Error("Deadline exceeded");throw I.code="EDEADLINE",I.attempts=ae,I.elapsedMs=qe()-w,I}const R=Sa(a,Sa(he,S?S.signal:null)),N=A(),M=[Promise.resolve().then(()=>e(R))],T=[];if(b!==null){const I=b-qe();let Q;const q=new Promise((ne,le)=>{const _e=setTimeout(()=>{if(S)try{S.abort()}catch{}const fe=new Error("Deadline exceeded");fe.code="EDEADLINE",fe.attempts=ae,fe.elapsedMs=qe()-w,le(fe)},I);Q=()=>clearTimeout(_e)});M.push(q),T.push(Q)}N&&(M.push(N.promise),typeof N.cleanup=="function"&&T.push(N.cleanup));try{return await Promise.race(M)}catch(I){throw I&&typeof I=="object"&&(I.attempts=ae,I.attemptTimeout=m,I.totalTimeout=p),I}finally{for(const I of T)typeof I=="function"&&I()}},U={maxAttempts:g,attemptTimeout:m,retryIf:ae=>ae&&(ae.code==="EABORT"||ae.code==="EDEADLINE")?!1:h(ae),onRetry:l};typeof c<"u"&&(U.backoff=c),typeof u<"u"&&(U.baseDelay=u),typeof d<"u"&&(U.maxDelay=d),typeof f<"u"&&(U.jitter=f),y>0&&typeof U.backoff>"u"&&(U.backoff="fixed",U.baseDelay=y,U.maxDelay=y,U.jitter=!1);let W=0;const Y=async ae=>(W+=1,z(W,ae));return xs.run(Y,U)}constructor(e={}){this._options=e||{}}async run(e,t={}){return this.constructor.run(e,Object.assign({},this._options,t))}},wa=(e,t,n)=>{const r=new Error("Aborted");return r.code="EABORT",r.reason=e,r.attempts=0,r.elapsedMs=qe()-t,r.totalTimeout=n,r},Sa=(e,t)=>{if(!e&&!t)return;if(!e)return t;if(!t||typeof AbortController>"u")return e;const n=new AbortController,r=()=>{try{n.abort()}catch{}};return typeof e.addEventListener=="function"&&e.addEventListener("abort",r,{once:!0}),typeof t.addEventListener=="function"&&t.addEventListener("abort",r,{once:!0}),n.signal},mc=_.__exportAll({currentLang:()=>qt,formatDate:()=>yc,formatNumber:()=>bc,loadL10nFile:()=>Zs,setLang:()=>Xs,t:()=>Bn,tPlural:()=>_c}),Qt=JSON.parse(JSON.stringify(Po)),Li="en";if(typeof navigator<"u"){const e=navigator.language||navigator.languages?.[0]||"en";Li=String(e).split("-")[0].toLowerCase()}Po[Li]||(Li="en");var qt=Li;function Bn(e,t={}){let n=(Qt[qt]||Qt.en)?.[e]||Qt.en[e]||"";for(const r of Object.keys(t)){const i=r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");n=n.replace(new RegExp(`\\{${i}\\}`,"g"),String(t[r]))}return n}async function Zs(e,t){if(!e)return;let n=e;const r=async i=>{if(Rr&&typeof Rr.run=="function")return await Rr.run(()=>fetch(i),{attemptTimeout:1e4,maxAttempts:1});let s=null;try{typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function"&&(s=AbortSignal.timeout(1e4))}catch{}return await fetch(i,s?{signal:s}:void 0)};try{/^https?:\/\//.test(e)||(/^file:\/\//i.test(e)?n=e:n=new URL(e,location.origin+t).toString());const i=await r(n);if(!i.ok)return;const s=await i.json();for(const o of Object.keys(s||{}))Qt[o]=Object.assign({},Qt[o]||{},s[o])}catch{}}function _c(e,t,n={}){try{const r=Qt[qt]||Qt.en,i=new Intl.PluralRules(qt).select(t),s=`${e}.${i}`;let o=r?.[s]||"";if(!o){const l=r?.[e];l&&typeof l=="object"?o=l[i]||"":typeof l=="string"&&(o=l)}if(o||(o=Qt.en[s]||""),!o){const l=Qt.en[e];l&&typeof l=="object"?o=l[i]||"":typeof l=="string"&&(o=l)}const a={count:String(t),...n};for(const l of Object.keys(a)){const c=l.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");o=o.replace(new RegExp(`\\{${c}\\}`,"g"),String(a[l]))}return o}catch{return Bn(e,n)}}function yc(e,t={}){try{const n=e instanceof Date?e:new Date(e);return isNaN(n.getTime())?String(e):new Intl.DateTimeFormat(qt,{year:"numeric",month:"short",day:"numeric",...t}).format(n)}catch{return String(e)}}function bc(e,t={}){try{return new Intl.NumberFormat(qt,t).format(e)}catch{return String(e)}}function Xs(e){const t=String(e??"").split("-")[0].toLowerCase();qt=Qt[t]?t:"en";try{if(typeof document<"u"&&document.documentElement){document.documentElement.setAttribute("lang",t);try{const n=new Intl.Locale(t||"en"),r=n.textInfo&&n.textInfo.direction==="rtl"||["ar","he","fa","ur","ps","sd","ug","ku","dv","yi"].includes(t);document.documentElement.setAttribute("dir",r?"rtl":"ltr")}catch{}}}catch{}try{typeof window<"u"&&window.__nimbiUI&&typeof window.__nimbiUI.renderByQuery=="function"&&window.__nimbiUI.renderByQuery().catch(()=>{})}catch{}}var te=new Map,be=new Map,ht=[],Qe=new Set;function wc(e){ht=e}var vt=new Set,Ci=!1;function Si(){return Ci}function er(e){if(Sc(),vt.clear(),Array.isArray(ht)&&ht.length)for(const t of ht)t&&vt.add(t);else for(const t of Qe)t&&vt.add(t);va(te),va(be),Ci=!0}try{Object.defineProperty(er,"_refreshed",{get(){return Ci},set(e){Ci=!!e},configurable:!0})}catch{}function va(e){if(!(!e||typeof e.values!="function"))for(const t of e.values())t&&vt.add(t)}function ka(e){if(!e||typeof e.set!="function")return;const t=e.set;e.set=function(n,r){return r&&typeof r=="string"?vt.add(r):r?.default&&vt.add(r.default),t.call(this,n,r)}}var xa=!1;function Sc(){xa||(ka(te),ka(be),xa=!0)}function vc(e){try{return String(e??"").split("/").map(t=>encodeURIComponent(t)).join("/")}catch{return String(e??"")}}function Ea(e,t=null,n=void 0){let r="#/"+vc(String(e??""));t&&(r+="#"+encodeURIComponent(String(t)));try{let i="";if(typeof n=="string")i=n;else if(typeof location<"u"&&location?.search)i=location.search;else if(typeof location<"u"&&location?.hash)try{const s=_t(location.href);s?.params&&(i=s.params)}catch{}if(i){const s=typeof i=="string"&&i.startsWith("?")?i.slice(1):i;try{const o=new URLSearchParams(s);o.delete("page");const a=o.toString();a&&(r+="?"+a)}catch{const a=String(s??"").replace(/^page=[^&]*&?/,"");a&&(r+="?"+a)}}}catch{}return r}function _t(e){try{const t=new URL(e,typeof location<"u"?location.href:"http://localhost/"),n=t.searchParams.get("page");if(n){let i=null,s="";if(t.hash){const l=t.hash.replace(/^#/,"");if(l.includes("&")){const c=l.split("&");i=c.shift()||null,s=c.join("&")}else i=l||null}const o=new URLSearchParams(t.search);o.delete("page");const a=[o.toString(),s].filter(Boolean).join("&");return{type:"canonical",page:decodeURIComponent(n),anchor:i,params:a}}const r=t.hash?decodeURIComponent(t.hash.replace(/^#/,"")):"";if(r&&r.startsWith("/")){let i=r,s="";if(i.indexOf("?")!==-1){const l=i.split("?");i=l.shift()||"",s=l.join("?")||""}let o=i,a=null;if(o.indexOf("#")!==-1){const l=o.split("#");o=l.shift()||"",a=l.join("#")||null}return{type:"cosmetic",page:o.replace(/^\/+/,"")||null,anchor:a,params:s}}return{type:"path",page:(t.pathname||"").replace(/^\//,"")||null,anchor:t.hash?t.hash.replace(/^#/,""):null,params:t.search?t.search.replace(/^\?/,""):""}}catch{return{type:"unknown",page:e,anchor:null,params:""}}}var gi=typeof DOMParser<"u"?new DOMParser:null;function st(){return gi||(typeof DOMParser<"u"?(gi=new DOMParser,gi):null)}function tr(e){if(e.startsWith("---")){const t=e.indexOf(`
---`,3);if(t!==-1){const n=e.slice(3,t+0).trim(),r=e.slice(t+4).trimStart(),i={};return n.split(/\r?\n/).forEach(s=>{const o=s.match(/^([^:]+):\s*(.*)$/);o&&(i[o[1].trim()]=o[2].trim())}),{content:r,data:i}}}return{content:e,data:{}}}var Ro=`let y, w;
function N() {
	return y !== void 0 ? y === !1 ? null : y : typeof TextEncoder < "u" ? (y = new TextEncoder(), y) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (y = { encode: (t) => new Uint8Array(Buffer.from(t)) }, y) : (y = !1, null);
}
function k() {
	return w !== void 0 ? w === !1 ? null : w : typeof TextDecoder < "u" ? (w = new TextDecoder(), w) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (w = { decode: (t) => Buffer.from(t).toString("utf8") }, w) : (w = !1, null);
}
const L = (t, e) => {
	if (t instanceof Uint8Array) return t;
	if (ArrayBuffer.isView(t)) return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
	if (t instanceof ArrayBuffer) return new Uint8Array(t);
	const n = e ?? JSON.stringify(t), i = N();
	if (typeof i?.encode == "function") return i.encode(n);
	throw new Error("No TextEncoder or Buffer available to encode object");
}, z = (t) => {
	let e;
	if (t instanceof Uint8Array) e = t;
	else if (ArrayBuffer.isView(t)) e = new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
	else if (t instanceof ArrayBuffer) e = new Uint8Array(t);
	else if (typeof Buffer < "u" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(t)) e = new Uint8Array(t);
	else throw new TypeError("Unsupported input to u82o, expected ArrayBuffer/TypedArray/Buffer");
	const n = k();
	if (typeof n?.decode == "function") return JSON.parse(n.decode(e));
	if (typeof TextDecoder < "u") return JSON.parse(new TextDecoder().decode(e));
	throw new Error("No TextDecoder or Buffer available to decode object");
};
function O(t) {
	if (t.startsWith("---")) {
		const e = t.indexOf(\`
---\`, 3);
		if (e !== -1) {
			const n = t.slice(3, e + 0).trim(), i = t.slice(e + 4).trimStart(), o = {};
			return n.split(/\\r?\\n/).forEach((a) => {
				const c = a.match(/^([^:]+):\\s*(.*)$/);
				c && (o[c[1].trim()] = c[2].trim());
			}), {
				content: i,
				data: o
			};
		}
	}
	return {
		content: t,
		data: {}
	};
}
let U = null, T = [];
const B = 1e3, C = 4;
function E(t) {
	let e = String(t ?? "").toLowerCase().replace(/[^a-z0-9\\- ]/g, "").replace(/ /g, "-");
	return e = e.replace(/(?:-?)(?:md|html)$/g, ""), e = e.replace(/-+/g, "-"), e = e.replace(/^-|-$/g, ""), e.length > 80 && (e = e.slice(0, 80).replace(/-+$/g, "")), e;
}
function S(t) {
	return String(t ?? "").replace(/^[./]+/, "");
}
function b(t) {
	return String(t ?? "").replace(/\\/+$/, "");
}
function $(t) {
	return b(t) + "/";
}
function I(t, e) {
	if (!t || typeof t != "string") return !1;
	if (t.startsWith("//")) return !0;
	if (/^[a-z][a-z0-9+.-]*:/i.test(t)) {
		if (e && typeof e == "string") try {
			const n = new URL(t), i = new URL(e);
			if (n.origin === i.origin) return !n.pathname.startsWith(i.pathname);
		} catch {}
		return !0;
	}
	return !1;
}
function D(t) {
	const e = typeof location < "u" && location.origin ? location.origin : "http://localhost", n = String(t ?? "");
	return n ? /^[a-z][a-z0-9+.-]*:/i.test(n) ? $(n) : n.startsWith("/") ? e + $(n) : e + "/" + $(n) : e + "/";
}
async function M(t, e) {
	const n = D(e), i = new URL(String(t ?? "").replace(/^\\//, ""), n).toString(), o = await fetch(i);
	return !o || !o.ok ? null : await o.text();
}
async function F(t, e, n = C) {
	const i = Array.isArray(t) ? t.slice() : [], o = Math.max(1, Number(n) || 1), a = [];
	for (let c = 0; c < Math.min(o, i.length); c++) a.push((async () => {
		for (; i.length;) {
			const f = i.shift();
			f != null && await e(f);
		}
	})());
	await Promise.all(a);
}
async function W(t, e = B, n = void 0) {
	const i = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set(), a = [""];
	if (Array.isArray(n)) for (const u of n) try {
		const l = S(u);
		l && a.push(l);
	} catch {}
	const c = D(t), f = $(new URL(c).pathname);
	for (; a.length && a.length <= e;) {
		const u = a.shift();
		if (u == null || i.has(u)) continue;
		i.add(u);
		const l = new URL(String(u ?? ""), c).toString();
		let p = null;
		try {
			const h = await fetch(l);
			if (!h || !h.ok) continue;
			p = await h.text();
		} catch {
			continue;
		}
		if (!p) continue;
		const A = [], x = /<a\\s+[^>]*href=["']([^"']+)["'][^>]*>/gi, R = /(?:^|[^!])\\[[^\\]]+\\]\\(([^)]+)\\)/g;
		let g = null;
		for (; g = x.exec(p);) try {
			g?.[1] && A.push(g[1]);
		} catch {}
		for (; g = R.exec(p);) try {
			g?.[1] && A.push(g[1]);
		} catch {}
		for (const h of A) {
			if (!h || I(h, c) || h.startsWith("..") || h.includes("/../")) continue;
			if (h.endsWith("/")) {
				try {
					const r = new URL(h, l);
					let s = r.pathname.startsWith(f) ? r.pathname.slice(f.length) : r.pathname.replace(/^\\//, "");
					s = $(S(s)), i.has(s) || a.push(s);
				} catch {}
				continue;
			}
			if (/\\.(md|html?)($|[?#])/i.test(h)) {
				try {
					const r = new URL(h, l);
					let s = r.pathname.startsWith(f) ? r.pathname.slice(f.length) : r.pathname.replace(/^\\//, "");
					s = S(s).split(/[?#]/)[0], s && (o.add(s), i.has(s) || a.push(s));
				} catch {}
				try {
					const r = new URL(h, c);
					let s = r.pathname.startsWith(f) ? r.pathname.slice(f.length) : r.pathname.replace(/^\\//, "");
					s = S(s).split(/[?#]/)[0], s && !o.has(s) && (o.add(s), i.has(s) || a.push(s));
				} catch {}
				continue;
			}
			let m = h.split(/[?#]/)[0].replace(/\\/+$/, ""), d = null;
			try {
				const r = new URL(h, c);
				d = r.pathname.startsWith(f) ? r.pathname.slice(f.length) : r.pathname.replace(/^\\//, "");
			} catch {}
			try {
				const r = new URL(h, l);
				m = r.pathname.startsWith(f) ? r.pathname.slice(f.length) : r.pathname.replace(/^\\//, "");
			} catch {}
			m = S(m).split(/[?#]/)[0].replace(/\\/+$/, ""), d && (d = S(d).split(/[?#]/)[0].replace(/\\/+$/, ""));
			const _ = String(m).split("/").pop() || "";
			if (!/\\.[^./]+$/i.test(_)) {
				if (m) {
					const r = [
						\`\${m}.md\`,
						\`\${m}.html\`,
						\`\${m}/README.md\`,
						\`\${m}/README.html\`
					];
					for (const s of r) o.add(s), i.has(s) || a.push(s);
				}
				if (d && d !== m) {
					const r = [
						\`\${d}.md\`,
						\`\${d}.html\`,
						\`\${d}/README.md\`,
						\`\${d}/README.html\`
					];
					for (const s of r) o.has(s) || (o.add(s), i.has(s) || a.push(s));
				}
			}
		}
	}
	return Array.from(o);
}
function P(t, e) {
	const n = String(t ?? "");
	if (e) return {
		title: ((n.match(/<title[^>]*>([\\s\\S]*?)<\\/title>/i) || [])[1] || (n.match(/<h1[^>]*>([\\s\\S]*?)<\\/h1>/i) || [])[1] || "").replace(/<[^>]+>/g, "").trim(),
		excerpt: ((n.match(/<p[^>]*>([\\s\\S]*?)<\\/p>/i) || [])[1] || "").replace(/<[^>]+>/g, "").trim()
	};
	const i = ((n.match(/^#\\s+(.+)$/m) || [])[1] || "").trim(), o = n.split(/\\r?\\n\\s*\\r?\\n/);
	let a = "";
	for (let c = 1; c < o.length; c++) {
		const f = o[c].trim();
		if (f && !/^#/.test(f)) {
			a = f.replace(/\\r?\\n/g, " ");
			break;
		}
	}
	return {
		title: i,
		excerpt: a
	};
}
async function v(t, e = 1, n = void 0, i = void 0) {
	if (U) return U;
	U = (async () => {
		const o = Array.isArray(n) ? new Set(n.map((l) => S(l))) : /* @__PURE__ */ new Set(), a = Array.isArray(i) ? i.map((l) => S(l)).filter(Boolean) : [], c = await W(t, B, a), f = Array.from(new Set(c.concat(a))).filter((l) => /\\.(md|html?)$/i.test(l)).filter((l) => !Array.from(o).some((p) => p && (l === p || l.startsWith(p + "/")))), u = [];
		return await F(f, async (l) => {
			const p = await M(l, t);
			if (!p) return;
			const A = /\\.html?$/i.test(l), { title: x, excerpt: R } = P(p, A), g = E(x || l);
			let h = null, m = null;
			try {
				if (!A) {
					const { data: d } = O(p), _ = d.dateModified || d.date || d.lastmod;
					if (_) {
						const s = new Date(_);
						isNaN(s.getTime()) || (h = s.toISOString().split("T")[0]);
					}
					const r = d.image || d.og_image || d.cover || d.featured_image;
					r && String(r).trim() && (m = String(r).trim());
				}
			} catch {}
			if (u.push({
				slug: g,
				title: x,
				excerpt: R,
				path: l,
				lastmod: h,
				image: m
			}), Number(e) >= 2) {
				const d = A ? /<h2[^>]*>([\\s\\S]*?)<\\/h2>/gi : /^##\\s+(.+)$/gm;
				let _ = null;
				for (; _ = d.exec(p);) {
					const r = String(_[1] ?? "").replace(/<[^>]+>/g, "").trim();
					r && u.push({
						slug: \`\${g}::\${E(r)}\`,
						title: r,
						excerpt: "",
						path: l,
						parentTitle: x || "",
						lastmod: h
					});
				}
			}
		}), T = u, T;
	})();
	try {
		return await U;
	} finally {
		U = null;
	}
}
async function J(t, e, n) {
	const i = E(t);
	if (!i) return null;
	const o = await v(e), a = (Array.isArray(o) ? o : []).find((u) => {
		try {
			return String(u?.slug ?? "").split("::")[0] === i;
		} catch {
			return !1;
		}
	});
	if (a?.path) return a.path;
	const c = [\`\${i}.html\`, \`\${i}.md\`];
	for (const u of c) try {
		if (await M(u, e)) return u;
	} catch {}
	const f = await W(e, n || B);
	for (const u of f) if (E(String(u ?? "").replace(/^.*\\//, "").replace(/\\.(md|html?)$/i, "")) === i) return u;
	return null;
}
function q(t) {
	try {
		return z(t);
	} catch {
		return t || {};
	}
}
onmessage = async (t) => {
	const e = q(t.data), { correlationId: n } = e, i = (a) => {
		if (n != null) {
			const c = L({
				correlationId: n,
				response: a
			});
			postMessage(c, [c.buffer]);
		} else postMessage({
			id: e.id,
			result: a
		});
	}, o = (a) => {
		if (n != null) {
			const c = L({
				correlationId: n,
				response: { error: String(a) }
			});
			postMessage(c, [c.buffer]);
		} else postMessage({
			id: e.id,
			error: String(a)
		});
	};
	try {
		if (e.type === "buildSearchIndex") {
			const { contentBase: a, indexDepth: c, noIndexing: f, seedPaths: u } = e;
			try {
				i(await v(a, c, f, u));
			} catch (l) {
				o(l);
			}
			return;
		}
		if (e.type === "crawlForSlug") {
			const { slug: a, base: c, maxQueue: f } = e;
			try {
				const u = await J(a, c, f);
				i(u === void 0 ? null : u);
			} catch (u) {
				o(u);
			}
			return;
		}
	} catch (a) {
		o(a);
	}
};
`,Aa=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",Ro],{type:"text/javascript;charset=utf-8"});function kc(e){let t;try{if(t=Aa&&(self.URL||self.webkitURL).createObjectURL(Aa),!t)throw"";const n=new Worker(t,{type:"module",name:e?.name});return n.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(t)}),n}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(Ro),{type:"module",name:e?.name})}}var gn,pn;function xc(){return gn!==void 0?gn===!1?null:gn:typeof TextEncoder<"u"?(gn=new TextEncoder,gn):typeof Buffer<"u"&&typeof Buffer.from=="function"?(gn={encode:e=>new Uint8Array(Buffer.from(e))},gn):(gn=!1,null)}function Ec(){return pn!==void 0?pn===!1?null:pn:typeof TextDecoder<"u"?(pn=new TextDecoder,pn):typeof Buffer<"u"&&typeof Buffer.from=="function"?(pn={decode:e=>Buffer.from(e).toString("utf8")},pn):(pn=!1,null)}var as=(e,t)=>{if(e instanceof Uint8Array)return e;if(ArrayBuffer.isView(e))return new Uint8Array(e.buffer,e.byteOffset,e.byteLength);if(e instanceof ArrayBuffer)return new Uint8Array(e);const n=t??JSON.stringify(e),r=xc();if(typeof r?.encode=="function")return r.encode(n);throw new Error("No TextEncoder or Buffer available to encode object")},Ac=e=>{let t;if(e instanceof Uint8Array)t=e;else if(ArrayBuffer.isView(e))t=new Uint8Array(e.buffer,e.byteOffset,e.byteLength);else if(e instanceof ArrayBuffer)t=new Uint8Array(e);else if(typeof Buffer<"u"&&typeof Buffer.isBuffer=="function"&&Buffer.isBuffer(e))t=new Uint8Array(e);else throw new TypeError("Unsupported input to u82o, expected ArrayBuffer/TypedArray/Buffer");const n=Ec();if(typeof n?.decode=="function")return JSON.parse(n.decode(t));if(typeof TextDecoder<"u")return JSON.parse(new TextDecoder().decode(t));throw new Error("No TextDecoder or Buffer available to decode object")},Tc=null;function Mc(){const e=Tc||(typeof require<"u"?require:null);if(e)return e("worker_threads").Worker;throw new Error("WorkerAgnostic: Node worker_threads is not available synchronously in pure ESM. Call `await WorkerAgnostic.preloadNode()` once before constructing a string-source worker, set globalThis.Worker, or pass a factory function instead of a path string.")}function Ta(){return typeof window<"u"&&typeof window.document<"u"?"browser":typeof self<"u"&&typeof self.importScripts=="function"?"webworker":typeof process<"u"&&process.versions?.node?"node":"unknown"}var Ma=["message","error","messageerror"];function ja(e,t,n){const r=typeof globalThis<"u"&&globalThis.Worker||(typeof Worker<"u"?Worker:void 0);if(typeof r=="function"&&typeof e=="string")return new r(e,t);if(n==="node"||n==="browser"||n==="webworker"){const i=n==="node"?Mc():void 0;if(typeof e=="function")return Pa(e,i,t,n);if(typeof e=="string")return n==="node"?new i(e,t):Lo(e,t);throw new Error("Invalid workerSource: expected Worker factory or path string")}if(typeof e=="function")return Pa(e,void 0,t,"unknown");throw new Error("Unsupported environment for WorkerAgnostic: cannot resolve a string workerSource without a global Worker or a known runtime")}function Pa(e,t,n,r){if(typeof e.prototype>"u")return Ra(e(),t,n,r);try{return new e}catch(i){if(i instanceof TypeError&&/not a constructor|cannot be invoked without\s*'new'|Class constructor|not constructable/i.test(String(i?.message)))return Ra(e(),t,n,r);throw i}}function Ra(e,t,n,r){return e&&typeof e=="object"&&typeof e.postMessage=="function"?e:typeof e=="string"?r==="node"?new t(e,n):Lo(e,n):e&&typeof e=="object"?e:{}}function Lo(e,t){let n;try{n=new Function("try { return import.meta?.url } catch (e) { return undefined }")()}catch{n=void 0}if(!n&&typeof document<"u"){const r=document.currentScript;r?.src&&(n=r.src)}!n&&typeof location<"u"&&location.href&&(n=location.href);try{if(n)return new Worker(new URL(e,n),t)}catch{}return new Worker(e,t)}function jc(e){if(Array.isArray(e))return e;if(e&&typeof e=="object"&&Array.isArray(e.transfer))return e.transfer}var Pc=class{constructor(e,t={}){this.env=Ta(),this.options=t&&typeof t=="object"?t:{},this._listeners=new Map,this.worker=ja(e,this.options,this.env),this._wireEvents()}static create(e,t){return ja(e,t||{},Ta())}_wireEvents(){const e=this.worker;if(e)if(typeof e.addEventListener=="function"){this._nativeModel="listener";for(const t of Ma)e.addEventListener(t,(...n)=>this._dispatch(t,...n))}else if(typeof e.on=="function"){this._nativeModel="emitter";for(const t of Ma)e.on(t,(...n)=>this._dispatch(t,...n))}else this._nativeModel="property",e.onmessage=(...t)=>this._dispatch("message",...t),e.onerror=(...t)=>this._dispatch("error",...t),e.onmessageerror=(...t)=>this._dispatch("messageerror",...t)}_dispatch(e,...t){const n=this._listeners.get(e);if(!n||!n.size)return;let r;if(e==="message"){const i=t[0];r=[{data:this._nativeModel==="emitter"?i:i&&typeof i=="object"&&"data"in i?i.data:i,originalEvent:i}]}else r=t;for(const i of n)try{i(...r)}catch{}}addEventListener(e,t){return typeof t!="function"?this:(this._listeners.has(e)||this._listeners.set(e,new Set),this._listeners.get(e).add(t),this)}removeEventListener(e,t){const n=this._listeners.get(e);return n&&(n.delete(t),n.size===0&&this._listeners.delete(e)),this}on(e,t){return this.addEventListener(e,t)}off(e,t){return this.removeEventListener(e,t)}postMessage(e,t){const n=this.worker;if(!n||typeof n.postMessage!="function")throw new Error("Underlying worker does not implement postMessage");const r=jc(t);return r&&r.length?n.postMessage(e,r):n.postMessage(e)}terminate(){const e=this.worker;if(!e||typeof e.terminate!="function")return Promise.resolve();try{const t=e.terminate();return t&&typeof t.then=="function"?t:Promise.resolve(t)}catch(t){return Promise.reject(t)}}},vi=class{constructor(e=16){const t=Math.max(2,Number(e)||16);for(this._capacity=1;this._capacity<t;)this._capacity<<=1;this._mask=this._capacity-1,this._buffer=new Array(this._capacity),this._head=0,this._tail=0,this._size=0}push(e){return this._size===this._capacity&&this._grow(),this._buffer[this._tail]=e,this._tail=this._tail+1&this._mask,this._size++,this._size}shift(){if(this._size===0)return;const e=this._buffer[this._head];return this._buffer[this._head]=void 0,this._head=this._head+1&this._mask,this._size--,e}peek(){return this._size===0?void 0:this._buffer[this._head]}clear(){if(this._size===0)return;let e=this._head;for(let t=0;t<this._size;t++)this._buffer[e]=void 0,e=e+1&this._mask;this._head=this._tail=0,this._size=0}get capacity(){return this._capacity}get isEmpty(){return this._size===0}*[Symbol.iterator](){let e=this._head;for(let t=0;t<this._size;t++)yield this._buffer[e+t&this._mask]}values(){return this[Symbol.iterator]()}*keys(){for(let e=0;e<this._size;e++)yield e}*entries(){for(let e=0;e<this._size;e++)yield[e,this._buffer[this._head+e&this._mask]]}*drain(){for(;this._size>0;)yield this.shift()}toArray(){const e=new Array(this._size);for(let t=0;t<this._size;t++)e[t]=this._buffer[this._head+t&this._mask];return e}_grow(){const e=this._buffer,t=this._capacity<<1,n=new Array(t);for(let r=0;r<this._size;r++)n[r]=e[this._head+r&this._mask];this._buffer=n,this._capacity=t,this._mask=t-1,this._head=0,this._tail=this._size&this._mask}pushMany(e){if(!Array.isArray(e)||e.length===0)return this._size;const t=this._size+e.length;for(;this._capacity<t;)this._grow();const n=Math.min(e.length,this._capacity-this._tail);for(let i=0;i<n;i++)this._buffer[this._tail+i]=e[i];this._tail=this._tail+n&this._mask;let r=n;for(;r<e.length;){const i=Math.min(e.length-r,this._capacity-this._tail);for(let s=0;s<i;s++)this._buffer[this._tail+s]=e[r+s];this._tail=this._tail+i&this._mask,r+=i}return this._size=t,this._size}get length(){return this._size}unshiftMany(e){if(!Array.isArray(e)||e.length===0)return this._size;const t=this._size+e.length;for(;this._capacity<t;)this._grow();let n=this._head-e.length&this._mask;for(let r=0;r<e.length;r++)this._buffer[n+r&this._mask]=e[r];return this._head=n,this._size=t,this._size}},Rc=Symbol("PowerSubscriberSet.original"),On=class{constructor(e={}){const{weak:t=!1,maxListeners:n=0}=e||{};this._weak=!!t,this._maxListeners=Number.isFinite(Number(n))?Math.max(0,Math.floor(Number(n))):0,this._listeners=new Set,this._onceMap=new WeakMap,this._finalization=null,this._weak&&typeof WeakRef<"u"&&typeof FinalizationRegistry<"u"&&(this._finalization=new FinalizationRegistry(r=>{this._listeners.delete(r.ref)}))}get size(){return this._cleanup(),this._listeners.size}add(e){if(typeof e!="function"){if(!this._weak||!e||typeof e.deref!="function")throw new TypeError("listener must be a function");if(this._maxListeners>0&&this.size+1>this._maxListeners)throw new Error(`PowerSubscriberSet: adding listener exceeds maxListeners (${this._maxListeners})`);return this._listeners.add(e),()=>this.delete(e)}if(this._maxListeners>0&&this.size+1>this._maxListeners)throw new Error(`PowerSubscriberSet: adding listener exceeds maxListeners (${this._maxListeners})`);const t=this._makeEntry(e);return this._listeners.add(t),()=>this.delete(e)}addOnce(e){if(typeof e!="function")throw new TypeError("listener must be a function");const t=(...r)=>{try{e(...r)}finally{this.delete(e)}};try{t[Rc]=e}catch{}if(this._maxListeners>0&&this.size+1>this._maxListeners)throw new Error(`PowerSubscriberSet: adding listener exceeds maxListeners (${this._maxListeners})`);this._onceMap.set(e,t);const n=this._makeEntry(t);return this._listeners.add(n),()=>this.delete(e)}delete(e){let t=e;const n=this._onceMap.get(e);n&&(t=n,this._onceMap.delete(e));for(const r of this._listeners){if(r===t)return this._listeners.delete(r),this._finalization&&typeof r.deref=="function"&&this._finalization.unregister(r),!0;const i=this._deref(r);if(!i){this._listeners.delete(r);continue}if(i===t)return this._listeners.delete(r),this._finalization&&typeof r.deref=="function"&&this._finalization.unregister(r),!0}return!1}forEach(e){for(const t of this._listeners){const n=this._deref(t);if(!n){this._listeners.delete(t);continue}e(n)}}clear(){this._listeners.clear(),this._onceMap=new WeakMap}values(){this._cleanup();const e=[];for(const t of this._listeners){const n=this._deref(t);n&&e.push(n)}return e}*[Symbol.iterator](){for(const e of this._listeners){const t=this._deref(e);if(!t){this._listeners.delete(e);continue}yield t}}_cleanup(){if(!(!this._weak||typeof WeakRef>"u"))for(const e of this._listeners)typeof e?.deref=="function"&&!e.deref()&&this._listeners.delete(e)}_makeEntry(e){if(this._weak&&typeof WeakRef<"u"){const t=new WeakRef(e);if(this._finalization)try{this._finalization.register(e,{ref:t},t)}catch{}return t}return e}_deref(e){return typeof e?.deref=="function"?e.deref():e}};function La(e){if(e){if(typeof e.cleanup=="function"){try{e.cleanup()}catch{}return}if(typeof e._cleanup=="function"){try{e._cleanup()}catch{}return}if(typeof e[Symbol.iterator]=="function"&&typeof e.delete=="function")for(const t of e)(typeof t?.deref=="function"?t.deref():t)||e.delete(t)}}var Lc=class{constructor(e={}){this._listeners=new Map,this._maxListeners=Number.isFinite(Number(e.maxListeners))?Math.max(0,Number(e.maxListeners)):0,this._weak=!!e.weak,this._fr=null,this._finalizationRefs=new WeakMap,this._eventFinalizationRefs=new Map}_ensureFinalizationRegistry(){return!this._weak||typeof FinalizationRegistry>"u"?null:this._fr?this._fr:(this._fr=new FinalizationRegistry(e=>{try{const{event:t,ref:n}=e,r=this._listeners.get(t),i=this._eventFinalizationRefs.get(t);if(i&&n&&(i.delete(n),i.size===0&&this._eventFinalizationRefs.delete(t)),!r)return;La(r),r.size===0&&(this._listeners.delete(t),this._eventFinalizationRefs.delete(t))}catch{}}),this._fr)}cleanup(){if(this._weak)for(const[e,t]of this._listeners)La(t),t.size===0&&(this._clearWeakListenerEvent(e),this._listeners.delete(e))}on(e,t){if(typeof t!="function")throw new TypeError("listener must be a function");let n=this._getBucket(e);n||(n=new On({maxListeners:this._maxListeners,weak:this._weak}),this._listeners.set(e,n));const r=n.add(t);return this._registerWeakListener(t,e)?()=>{r(),this._unregisterWeakListener(t,e)}:r}_getBucket(e){let t=this._listeners.get(e);if(!t)return null;if(t instanceof On)return t;if(typeof t?.[Symbol.iterator]=="function"){const n=new On({maxListeners:this._maxListeners,weak:this._weak});for(const r of t){const i=typeof r?.deref=="function"?r.deref():r;i&&n.add(i)}return this._listeners.set(e,n),n}return null}_registerWeakListener(e,t){const n=this._ensureFinalizationRegistry();if(!n||typeof WeakRef>"u")return null;const r=new WeakRef(e);try{n.register(e,{event:t,ref:r},r);let i=this._finalizationRefs.get(e);i||(i=new Map,this._finalizationRefs.set(e,i));let s=i.get(t);s||(s=new Set,i.set(t,s)),s.add(r);let o=this._eventFinalizationRefs.get(t);o||(o=new Set,this._eventFinalizationRefs.set(t,o)),o.add(r)}catch{return null}return r}_unregisterWeakListener(e,t){if(!this._fr||!this._finalizationRefs.has(e))return;const n=this._finalizationRefs.get(e);if(!n||n.size===0){this._finalizationRefs.delete(e);return}const r=t!==void 0?[t]:Array.from(n.keys());for(const i of r){const s=n.get(i);if(!s||s.size===0){n.delete(i);continue}for(const o of s){try{this._fr.unregister(o)}catch{}const a=this._eventFinalizationRefs.get(i);a&&(a.delete(o),a.size===0&&this._eventFinalizationRefs.delete(i))}n.delete(i)}n.size===0&&this._finalizationRefs.delete(e)}_clearWeakListenerEvent(e){if(!this._fr)return;const t=this._eventFinalizationRefs.get(e);if(t){for(const n of t)try{this._fr.unregister(n)}catch{}this._eventFinalizationRefs.delete(e)}}once(e,t){if(typeof t!="function")throw new TypeError("listener must be a function");let n=this._getBucket(e);n||(n=new On({maxListeners:this._maxListeners,weak:this._weak}),this._listeners.set(e,n));const r=n.addOnce(t);return this._registerWeakListener(t,e)?()=>{r(),this._unregisterWeakListener(t,e)}:r}off(e,t){const n=this._getBucket(e);n&&(n.delete(t),this._unregisterWeakListener(t,e),n.size===0&&(this._clearWeakListenerEvent(e),this._listeners.delete(e)))}emit(e,t){const n=this._listeners.get(e);if(!n||n.size===0)return!1;if(n instanceof On){let i=!1;return n.forEach(s=>{i=!0;try{s(t)}catch{}}),n.size===0&&(this._clearWeakListenerEvent(e),this._listeners.delete(e)),i}const r=n.size>0;for(const i of n){const s=typeof i?.deref=="function"?i.deref():i;if(!s){n.delete(i);continue}try{s(t)}catch{}}return n.size===0&&(this._clearWeakListenerEvent(e),this._listeners.delete(e)),r}*_iterBucketListeners(e){if(e instanceof On){yield*e;return}for(const t of e){const n=typeof t?.deref=="function"?t.deref():t;if(!n){e.delete(t);continue}yield n}}async emitAsync(e,t,{concurrency:n=1/0}={}){const r=this._listeners.get(e);if(!r||r.size===0)return!1;const i=Number.isFinite(+n)&&+n>0?Math.max(1,Math.floor(+n)):1/0,s=async l=>{try{await l(t)}catch{}},o=new Set;let a=!1;for(const l of this._iterBucketListeners(r)){if(!l)continue;a=!0;const c=Promise.resolve().then(()=>s(l)).finally(()=>{o.delete(c)});o.add(c),Number.isFinite(i)&&o.size>=i&&await Promise.race(o)}return o.size&&await Promise.all(o),r.size===0&&(this._clearWeakListenerEvent(e),this._listeners.delete(e)),a}listeners(e){const t=this._listeners.get(e);return t?t instanceof On?t.values():Array.from(t).map(n=>typeof n?.deref=="function"?n.deref():n).filter(Boolean):[]}clear(e){if(e===void 0){for(const t of this._eventFinalizationRefs.keys())this._clearWeakListenerEvent(t);this._eventFinalizationRefs.clear(),this._finalizationRefs=new WeakMap,this._listeners.clear();return}this._clearWeakListenerEvent(e),this._listeners.delete(e)}},Cc=class{constructor(e,t,n){this._underlying=e,this._logger=t,this._pool=n,this.onmessage=null,this.onerror=null,this.onmessageerror=null}postMessage(e,t){let n=e,r=t;if(n instanceof Uint8Array||ArrayBuffer.isView(n)||n instanceof ArrayBuffer){if(Array.isArray(r))try{r.length?this._underlying.postMessage(n,r):this._underlying.postMessage(n);return}catch(i){throw this._logger.error(i,"Failed to postMessage to underlying worker"),i}if(!r){const i=n instanceof ArrayBuffer?n:n.buffer;i?.byteLength>0&&(r=[i])}try{r?.length?this._underlying.postMessage(n,r):this._underlying.postMessage(n)}catch(i){throw this._logger.error(i,"Failed to postMessage to underlying worker"),i}return}if(n!==null&&typeof n=="object"&&!ArrayBuffer.isView(n)&&!(n instanceof ArrayBuffer))try{const i=this._pool._encodeForTransfer(e).slice();if(!r)r=[i.buffer];else if(Array.isArray(r))r.includes(i.buffer)||r.push(i.buffer);else{const s=Array.from(r);s.includes(i.buffer)||s.push(i.buffer),r=s}n=i}catch{r=t,n=e}try{r?.length?this._underlying.postMessage(n,r):this._underlying.postMessage(n)}catch(i){throw this._logger.error(i,"Failed to postMessage to underlying worker"),i}}addEventListener(...e){return this._underlying.addEventListener(...e)}removeEventListener(...e){return this._underlying.removeEventListener(...e)}terminate(){typeof this._underlying.terminate=="function"&&this._underlying.terminate()}},Nc=class extends Error{constructor(e="PowerPool has been shut down"){super(e),this.name="PowerPoolShutdownError"}},Ys=class{constructor(e,t={}){const n=typeof navigator<"u"&&navigator.hardwareConcurrency||2,{size:r=Math.min(n,2),minSize:i=2,maxSize:s=Math.max(r,n),workerOptions:o={},maxTasksPerWorker:a,idleTimeout:l=Gl,taskQueue:c=!0,queuePolicy:u="enqueue",lazy:d=!0,awaitResponseTimeout:f=Ss,slowTaskThreshold:g=1/0,autoScale:m=!1}=t,p=a===void 0&&m?1:a??1/0;if(typeof e!="function"&&typeof e!="string")throw new TypeError("PowerPool workerSource must be a function or string");this._workerSource=e,this._workerOptions=o,this._maxTasksPerWorker=p,this.minSize=Math.max(0,i),this.maxSize=Math.max(this.minSize,s),this.idleTimeout=Math.max(0,l),this.taskQueueEnabled=!!c,this._queuePolicy=["enqueue","drop-oldest","drop-newest","reject"].includes(u)?u:"enqueue",this._createdAt=qe(),this._totalWorkersCreated=0,this._totalTasksCompleted=0,this._taskDurationsWelfordCount=0,this._taskDurationsWelfordMean=0,this._taskDurationsWelfordM2=0,this._taskDurationsMin=Number.POSITIVE_INFINITY,this._taskDurationsMax=Number.NEGATIVE_INFINITY,this._slowTaskThreshold=Number.isFinite(g)?Number(g):1/0,this._slowTaskCount=0,this._ewmaLatency=null,this._autoScale=null,this._autoScaleInterval=null,this._lastAutoScaleAt=0,this._terminatedWorkerTaskCountsTotal=0,this._terminatedWorkerTaskCountsCount=0,this.workers=[],this.queue=new vi;const y={maxListeners:t?.listenerMaxListeners??t?.maxListeners,weak:!!t?.weakListeners};this._bus=new Lc(y),this._queueHighThreshold=Number.isFinite(Number(t?.queueHighThreshold))?Math.max(0,Math.floor(Number(t?.queueHighThreshold))):1/0,this._queueHighCrossed=!1,this._onmessage=null,this._onerror=null,this._onidle=null,this._onresize=null,this._nextIndex=0,this._nextWorkerId=0,this._correlationCounter=0,this._activeTasks=0,this._isIdle=!0,this._queuePaused=!1;const h=typeof t?.debugLevel=="number"?t.debugLevel:1;if(this._logger=new wo(h,{name:"powerPool"}),arguments.length>1&&arguments[1]!=null&&typeof arguments[1]!="object")throw new TypeError("PowerPool options must be an object");this._pendingResponses=new Map,this._underlyingToWorkerObj=new Map,this._defaultAwaitResponseTimeout=Number.isFinite(Number(f))?Math.max(0,Math.floor(Number(f))):Ss;const w=d?Math.min(this.minSize,this.maxSize):Math.min(Math.max(r,this.minSize),this.maxSize);for(let b=0;b<w;b++)try{this._addWorkerInstance()}catch(S){try{if((S?.message?String(S.message):"").includes("Invalid workerSource"))throw S}catch(A){throw A}try{this._logger.error(S,"Initial worker creation failed")}catch(A){this._debugLog?.(A,"Initial worker creation: logger error")}try{this._bus.emit("pool:error",{phase:"init",error:S})}catch(A){this._debugLog?.(A,"Initial worker creation: bus.emit failed")}break}if(this._reaperInterval=setInterval(()=>this._reapIdleWorkers(),Math.max(da,Math.floor(this.idleTimeout/2))),this._encodeCache=new Map,this._encodeCacheLimit=Math.max(16,t?.encodeCacheLimit?t.encodeCacheLimit:64),this._encodeCacheByteLimit=Number.isFinite(Number(t?.encodeCacheByteLimit))?Math.max(0,Number(t?.encodeCacheByteLimit)):1/0,this._encodeCacheBytes=0,t?.autoScale){const b=typeof t.autoScale=="object"?t.autoScale:{},S=Number.isFinite(Number(b.intervalMs))?Math.max(100,Math.floor(b.intervalMs)):Zl,A=Number.isFinite(Number(b.targetMs))?Math.max(1,Number(b.targetMs)):50,z=Number.isFinite(Number(b.alpha))?Math.max(0,Math.min(1,Number(b.alpha))):.2,U=Number.isFinite(Number(b.cooldownMs))?Math.max(0,Math.floor(b.cooldownMs)):Xl,W=Number.isFinite(Number(b.hysteresis))?Math.max(0,Math.min(1,Number(b.hysteresis))):.2,Y=Number.isFinite(Number(b.stepUp))?Math.max(1,Math.floor(Number(b.stepUp))):1,ae=Number.isFinite(Number(b.stepDown))?Math.max(1,Math.floor(Number(b.stepDown))):1,he=Number.isFinite(Number(b.backoffFactor))?Math.max(1,Number(b.backoffFactor)):1,ie=Number.isFinite(Number(b.backoffMaxMultiplier))?Math.max(1,Number(b.backoffMaxMultiplier)):8,R=Number.isFinite(Number(b.backoffResetMs))?Math.max(0,Math.floor(Number(b.backoffResetMs))):U*4;this._autoScale={enabled:!0,intervalMs:S,targetMs:A,alpha:z,cooldownMs:U,hysteresis:W,stepUp:Y,stepDown:ae,backoffFactor:he,backoffMaxMultiplier:ie,backoffResetMs:R},this._autoScaleBackoffMultiplier=1;try{this._autoScaleInterval=setInterval(()=>this._autoScaleTick(),S)}catch(N){this._debugLog?.(N,"autoScale: interval setup failed")}}}_debugLog(e,t){try{typeof this._logger?.debug=="function"&&(e?this._logger.debug(e,t||"swallowed error"):this._logger.debug(t||"swallowed error"))}catch(n){try{typeof console<"u"&&typeof console.debug=="function"&&console.debug(n,t||"swallowed error")}catch{}}}_ensureReaper(){try{this._reaperInterval||(this._reaperInterval=setInterval(()=>this._reapIdleWorkers(),Math.max(da,Math.floor(this.idleTimeout/2))))}catch(e){this._debugLog?.(e,"_ensureReaper: setInterval failed")}}_createPendingResponsePromise(e,t){const n=e!=null?String(e):e;let r=null;return{pendingPromise:new Promise((i,s)=>{r={resolve:i,reject:s,timer:null};const o=Number.isFinite(Number(t?.timeout))?Math.max(0,Math.floor(Number(t?.timeout))):Number.isFinite(Number(this._defaultAwaitResponseTimeout))?this._defaultAwaitResponseTimeout:void 0;Number.isFinite(o)&&o>0&&(r.timer=setTimeout(()=>{try{this._cleanupPendingResponse(n,{rejectWith:new Error("postMessage response timeout")})}catch{try{s(new Error("postMessage response timeout"))}catch(l){this._debugLog?.(l,"createPendingResponsePromise: reject fallback failed")}}},o)),this._pendingResponses.set(n,r)}),correlationKey:n}}_postToWorkerObj(e,t,n,r,i,s){if(t&&t.message&&typeof t.message=="object"&&t.message!==null&&!ArrayBuffer.isView(t.message)&&!(t.message instanceof ArrayBuffer)&&Array.isArray(t.transfer)&&t.transfer.length>0&&e?.worker?._underlying?.postMessage)try{return e.worker._underlying.postMessage(t.message,t.transfer),typeof e._startTimes?.push=="function"&&e._startTimes.push(n),e.tasks++,this._activeTasks++,e.lastActive=n,this._isIdle&&this._updateIdleState(),r?s:!0}catch{}try{return t.transfer?.length?e.worker.postMessage(t.message,t.transfer):e.worker.postMessage(t.message),typeof e._startTimes?.push=="function"&&e._startTimes.push(n),e.tasks++,this._activeTasks++,e.lastActive=n,this._isIdle&&this._updateIdleState(),r?s:!0}catch(o){if(r&&i){try{this._cleanupPendingResponse(i,{rejectWith:o})}catch(a){this._debugLog?.(a,"postToWorkerObj: cleanupPendingResponse failed")}try{this._logger.error(o,"Failed to postMessage to worker")}catch(a){this._debugLog?.(a,"postToWorkerObj: logger.error failed")}return s}try{this._logger.error(o,"Failed to postMessage to worker")}catch(a){this._debugLog?.(a,"postToWorkerObj: logger.error failed")}return!1}}_tryGrowPool(e,t,n,r,i,s,o){let a;try{a=this._addWorkerInstance()}catch(c){try{this._logger.error(c,"Failed to grow pool")}catch(u){this._debugLog?.(u,"tryGrowPool: logger.error failed")}try{this._bus.emit("pool:error",{phase:"grow",error:c})}catch(u){this._debugLog?.(u,"tryGrowPool: bus.emit failed")}if(i&&s){try{this._cleanupPendingResponse(s,{rejectWith:c})}catch(u){this._debugLog?.(u,"tryGrowPool: cleanupPendingResponse failed")}return o}return!1}if(!a){if(i&&s){try{this._cleanupPendingResponse(s,{rejectWith:new Error("failed to add worker")})}catch(c){this._debugLog?.(c,"tryGrowPool: cleanupPendingResponse failed")}return o}return!1}const l=this._prepareForTransfer(e,t,n);return this._postToWorkerObj(a,l,r,i,s,o)}_enqueueOrReject(e,t,n,r){const i=this._queuePolicy;if(i==="reject")return t&&n?(this._cleanupPendingResponse(n,{rejectWith:new Error("postMessage rejected by queue policy")}),r):!1;if(i==="drop-newest"&&this.queue.length>0)return t&&n?(this._cleanupPendingResponse(n,{rejectWith:new Error("postMessage rejected by queue policy")}),r):!1;if(i==="drop-oldest"&&this.queue.length>0){const o=this.queue.shift();o?.correlationId!=null&&this._cleanupPendingResponse(o.correlationId,{rejectWith:new Error("postMessage queued task dropped by policy")})}const s={message:e.message,transfer:e.transfer};t&&n&&(s.correlationId=n),this.queue.push(s);try{Number.isFinite(this._queueHighThreshold)&&this.queue.length>this._queueHighThreshold&&!this._queueHighCrossed&&(this._queueHighCrossed=!0,this._bus.emit("pool:queue:high",{length:this.queue.length,threshold:this._queueHighThreshold}))}catch(o){this._debugLog?.(o,"enqueueOrReject: bus.emit failed")}return this._updateIdleState(),t?r:!0}_clearLifecycleIntervals(){try{this._reaperInterval&&(clearInterval(this._reaperInterval),this._reaperInterval=null)}catch(e){this._debugLog?.(e,"clearLifecycleIntervals: clearInterval(reaper) failed")}try{this._autoScaleInterval&&(clearInterval(this._autoScaleInterval),this._autoScaleInterval=null)}catch(e){this._debugLog?.(e,"clearLifecycleIntervals: clearInterval(autoScale) failed")}}shutdown(){this._clearLifecycleIntervals();try{for(const[t]of this._pendingResponses)try{this._cleanupPendingResponse(t,{rejectWith:new Nc("pool:shutdown")})}catch(n){this._debugLog?.(n,"shutdown: cleanup pending response")}try{typeof this._pendingResponses?.clear=="function"&&this._pendingResponses.clear()}catch(t){this._debugLog?.(t,"shutdown: pendingResponses.clear failed")}}catch(t){this._debugLog?.(t,"shutdown: iterate pending responses")}try{for(const t of this.workers)try{t.worker.terminate()}catch(n){this._debugLog?.(n,"shutdown: terminate worker")}}catch(t){this._debugLog?.(t,"shutdown: terminate workers loop")}try{this._underlyingToWorkerObj&&this._underlyingToWorkerObj.clear()}catch(t){this._debugLog?.(t,"shutdown: underlyingToWorkerObj.clear failed")}const e=this.workers.map(t=>t?.id).filter(t=>t!=null);e?.length&&this._bus.emit("pool:scale",{action:"remove",terminated:e,count:e.length}),this.workers=[],this.queue=new vi,this._queueHighCrossed=!1,this._activeTasks=0,this._updateIdleState()}_encodeForTransfer(e){try{const t=JSON.stringify(e);if(typeof t=="string"&&t.length>2048)return as(e);const n=this._encodeCache.get(t);if(n){try{this._encodeCache.delete(t),this._encodeCache.set(t,n)}catch{}return n}const r=as(e,t),i=r?.byteLength||0,s=()=>this._encodeCache.size>=this._encodeCacheLimit||this._encodeCacheByteLimit!==1/0&&this._encodeCacheBytes+i>this._encodeCacheByteLimit;for(;s();){const o=[],a=this._encodeCache.keys(),l=10;for(;s()&&o.length<l;){const c=a.next();if(c.done)break;o.push(c.value)}if(!o.length)break;for(const c of o){try{const u=this._encodeCache.get(c),d=typeof u?.byteLength=="number"?u.byteLength:0;this._encodeCacheBytes=Math.max(0,this._encodeCacheBytes-d)}catch{}this._encodeCache.delete(c)}}return this._encodeCache.set(t,r),r?.byteLength&&(this._encodeCacheBytes+=r.byteLength),r}catch{return as(e)}}prepareBuffers(e,t={}){if(!Array.isArray(e))throw new Error("prepareBuffers expects an array");const{clone:n=!0,zeroCopy:r=!1}=t,i=new Array(e.length);for(let s=0;s<e.length;s++){const o=e[s]&&typeof e[s]=="object"&&"message"in e[s]?e[s]:{message:e[s]},a=o.message,l=o.transfer;if(l){i[s]={message:a,transfer:l};continue}if(a!==null&&typeof a=="object"&&!ArrayBuffer.isView(a)&&!(a instanceof ArrayBuffer)){if(r){i[s]={message:a,transfer:void 0};continue}try{const c=this._encodeForTransfer(a),u=n?c.slice():c;i[s]={message:u,transfer:n?[u.buffer]:void 0};continue}catch{i[s]={message:a,transfer:void 0};continue}}if(a instanceof ArrayBuffer||ArrayBuffer.isView(a)){const c=a instanceof ArrayBuffer?a:a.buffer;i[s]={message:a,transfer:[c]};continue}i[s]={message:a,transfer:void 0}}return i}_prepareForTransfer(e,t,n){const r=!!n?.zeroCopy;if(e instanceof Uint8Array||ArrayBuffer.isView(e)||e instanceof ArrayBuffer){const i=e instanceof ArrayBuffer?e:e.buffer;if(!t){if(i?.byteLength===0)try{const a=e instanceof ArrayBuffer?e.slice(0):new Uint8Array(e);return{message:a,transfer:[a.buffer]}}catch{return{message:e,transfer:void 0}}return{message:e,transfer:[i]}}if(Array.isArray(t))return{message:e,transfer:t};if(t.length===0)return{message:e,transfer:[i]};const s=[];let o=!1;for(const a of t)s.push(a),a===i&&(o=!0);return o||s.push(i),{message:e,transfer:s}}if(e!==null&&typeof e=="object"&&!ArrayBuffer.isView(e)&&!(e instanceof ArrayBuffer)){if(r)return{message:e,transfer:t};try{const i=this._encodeForTransfer(e).slice();let s=t;if(!s||Array.isArray(s)&&s.length===0)s=[i.buffer];else if(Array.isArray(s)){let o=!1;for(const a of s)if(a===i.buffer){o=!0;break}o||(s=[...s,i.buffer])}else if(s.length===0)s=[i.buffer];else{const o=[];let a=!1;for(const l of s)o.push(l),l===i.buffer&&(a=!0);a||o.push(i.buffer),s=o}return{message:i,transfer:s}}catch{return{message:e,transfer:t}}}return{message:e,transfer:t}}_decrementActiveTasks(e=1){try{const t=Number.isFinite(Number(e))?Math.max(0,Math.floor(Number(e))):1;this._activeTasks=Math.max(0,this._activeTasks-t)}catch{this._activeTasks=0}}resize(e){let t=this.minSize,n=this.maxSize;if(e!=null&&typeof e=="object")Number.isFinite(e.minSize)&&(t=Math.max(0,Math.floor(e.minSize))),Number.isFinite(e.maxSize)&&(n=Math.max(t,Math.floor(e.maxSize)));else{const s=Number(e);if(!Number.isFinite(s))return;n=Math.max(t,Math.floor(s))}this.minSize=Math.max(0,t),this.maxSize=Math.max(this.minSize,n);let r=0;for(;this.workers.length<this.minSize&&this.workers.length<this.maxSize;)try{const s=this.workers.length;if(this._addWorkerInstance(),this.workers.length===s)break;r++}catch(s){try{this._logger.error(s,"resize: add worker failed")}catch(o){this._debugLog?.(o,"resize: logger.error failed")}try{this._bus.emit("pool:error",{phase:"resize",error:s})}catch(o){this._debugLog?.(o,"resize: bus.emit failed")}break}const i=[];for(;this.workers.length>this.maxSize;){const s=this.workers.pop();if(s){this._decrementActiveTasks(s.tasks||0);try{s.worker.terminate()}catch(o){this._debugLog?.(o,"resize: worker.terminate failed")}this._deleteWorkerUnderlyingMapping(s),this._terminatedWorkerTaskCountsTotal+=s.completedTasks||0,this._terminatedWorkerTaskCountsCount+=1,i.push(s.id)}}if(i.length||r){const s={data:{type:"pool:resize",terminated:i,added:r}};if(this._onresize)try{this._onresize(s)}catch(o){this._logger.error(o,"Pool onresize handler error")}this._bus.emit("resize",s),this._bus.emit("pool:scale",{added:r,terminated:i,minSize:this.minSize,maxSize:this.maxSize})}this._updateIdleState()}_createWorkerInstance(){return Pc.create(this._workerSource,this._workerOptions)}_deleteWorkerUnderlyingMapping(e){try{const t=e?.worker?._underlying;t&&this._underlyingToWorkerObj&&this._underlyingToWorkerObj.delete(t)}catch(t){this._debugLog?.(t,"_deleteWorkerUnderlyingMapping failed")}}_addWorkerInstance(e){e==null&&(e=this._nextWorkerId++);const t=this._createWorkerInstance(),n=new Cc(t,this._logger,this),r={id:e,worker:n,tasks:0,lastActive:qe(),latencyEwma:null,_startTimes:new vi};r.completedTasks=0,this.workers.push(r),this._totalWorkersCreated++,this._bus.emit("pool:scale",{action:"add",id:r.id,minSize:this.minSize,maxSize:this.maxSize});try{this._underlyingToWorkerObj.set(t,r)}catch{}n.onmessage=a=>{const l=qe();r.tasks=Math.max(0,r.tasks-1),this._decrementActiveTasks(1),r.lastActive=l;try{const c=a?.data;if(c&&typeof c=="object"&&c.correlationId!=null){const u=String(c.correlationId),d=Object.prototype.hasOwnProperty.call(c,"response")?c.response:c;this._cleanupPendingResponse(u,{resolveWith:d})}}catch(c){this._debugLog?.(c,"worker.onmessage: resolve pending response")}try{const c=r._startTimes?.length?r._startTimes.shift():null;let u=null;try{const d=a?.data;if(typeof d?.duration=="number"&&Number.isFinite(d.duration)?u=Math.max(0,Number(d.duration)):c!=null&&(u=Math.max(0,l-c)),u!=null){const f=this._autoScale?.alpha||.2;r.latencyEwma==null?r.latencyEwma=u:r.latencyEwma=f*u+(1-f)*r.latencyEwma,this._ewmaLatency==null?this._ewmaLatency=u:this._ewmaLatency=f*u+(1-f)*this._ewmaLatency,this._totalTasksCompleted=(this._totalTasksCompleted||0)+1,r.completedTasks=(r.completedTasks||0)+1;const g=1,m=this._taskDurationsWelfordCount;this._taskDurationsWelfordCount=m+g;const p=u-this._taskDurationsWelfordMean;this._taskDurationsWelfordMean+=p*g/this._taskDurationsWelfordCount;const y=u-this._taskDurationsWelfordMean;this._taskDurationsWelfordM2+=p*y,u<this._taskDurationsMin&&(this._taskDurationsMin=u),u>this._taskDurationsMax&&(this._taskDurationsMax=u),Number.isFinite(this._slowTaskThreshold)&&u>this._slowTaskThreshold&&(this._slowTaskCount=(this._slowTaskCount||0)+1)}}catch(d){this._debugLog?.(d,"worker.onmessage: latency tracking inner")}}catch(c){this._debugLog?.(c,"worker.onmessage: latency tracking outer")}if(!this._queuePaused&&this.queue.length>0&&r.tasks<this._maxTasksPerWorker){const c=this.queue.shift();try{c.transfer?n.postMessage(c.message,c.transfer):n.postMessage(c.message),r._startTimes.push(l),r.tasks++,this._activeTasks++}catch(u){this._debugLog?.(u,"dispatch queued message to worker failed"),this._logger.error(u,"Failed to dispatch queued message to worker")}this._queueHighCrossed&&this.queue.length<=this._queueHighThreshold&&(this._queueHighCrossed=!1)}if(this._onmessage)try{this._onmessage(a)}catch(c){this._logger.error(c,"Pool onmessage handler error")}this._bus.emit("message",a),this._updateIdleState()};const i=a=>{let l=a?.data!==void 0?a.data:a,c=l;if(l&&(l instanceof ArrayBuffer||ArrayBuffer.isView(l)))try{c=Ac(l)}catch(d){try{o(d)}catch(f){this._debugLog?.(f,"_handleMessage: _handleMessageError failed")}c=l}const u=a?.data!==void 0&&c===l?a:{data:c,originalEvent:a};if(typeof n.onmessage=="function")try{n.onmessage(u)}catch(d){this._logger.error(d,"worker wrapper onmessage error")}},s=a=>{if(typeof n.onerror=="function")try{n.onerror(a)}catch(l){this._logger.error(l,"worker wrapper onerror error")}this._bus.emit("error",a)},o=a=>{if(typeof n.onmessageerror=="function")try{n.onmessageerror(a)}catch(l){this._logger.error(l,"worker wrapper onmessageerror error")}this._bus.emit("messageerror",a)};if(typeof t.addEventListener=="function"){try{t.addEventListener("message",i)}catch(a){this._debugLog?.(a,"attach addEventListener message")}try{t.addEventListener("error",s)}catch(a){this._debugLog?.(a,"attach addEventListener error")}try{t.addEventListener("messageerror",o)}catch(a){this._debugLog?.(a,"attach addEventListener messageerror")}}else if(typeof t.on=="function"){try{t.on("message",i)}catch(a){this._debugLog?.(a,"attach underlying.on message")}try{t.on("error",s)}catch(a){this._debugLog?.(a,"attach underlying.on error")}try{t.on("messageerror",o)}catch(a){this._debugLog?.(a,"attach underlying.on messageerror")}}else{try{t.onmessage=i}catch(a){this._debugLog?.(a,"assign underlying.onmessage")}try{t.onerror=s}catch(a){this._debugLog?.(a,"assign underlying.onerror")}try{t.onmessageerror=o}catch(a){this._debugLog?.(a,"assign underlying.onmessageerror")}}return r}_findLeastLoadedWorker(){if(!this.workers.length)return null;let e=null,t=1/0,n=Number.POSITIVE_INFINITY;for(let r=0;r<this.workers.length;r++){const i=this.workers[r],s=i.latencyEwma!=null?i.latencyEwma:Number.POSITIVE_INFINITY;(i.tasks<t||i.tasks===t&&s<n)&&(e=i,t=i.tasks,n=s)}return e}postMessage(e,t,n){n=n||void 0;const r=qe(),i=n?.workerId!=null?n.workerId:null,s=i==null&&this.workers.length===1&&this._maxTasksPerWorker===1/0,o=i!=null?this.workers.find(f=>f.id===i):s?this.workers[0]:this._findLeastLoadedWorker(),a=!!(n?.awaitResponse||n?.correlationId!=null);let l,c;if(a){if(l=n.correlationId!=null?String(n.correlationId):this._generateCorrelationId(),!(e!==null&&typeof e=="object"&&!ArrayBuffer.isView(e)&&!(e instanceof ArrayBuffer)))throw new Error("postMessage awaitResponse requires a plain-object message");e=Object.assign({},e,{correlationId:l});const f=this._createPendingResponsePromise(l,n);c=f.pendingPromise,l=f.correlationKey}if(o?.tasks<this._maxTasksPerWorker)try{const f=r,g=this._prepareForTransfer(e,t,n);return this._postToWorkerObj(o,g,f,a,l,c)}catch(f){if(a&&l){try{this._cleanupPendingResponse(l,{rejectWith:f})}catch(g){this._debugLog?.(g,"postMessage: cleanupPendingResponse failed")}try{this._logger.error(f,"Failed to postMessage to worker")}catch(g){this._debugLog?.(g,"postMessage: logger.error failed")}return c}try{this._logger.error(f,"Failed to postMessage to worker")}catch(g){this._debugLog?.(g,"postMessage: logger.error failed")}return!1}if(i!=null&&(!o||o.tasks>=this._maxTasksPerWorker)){if(a&&l){try{this._cleanupPendingResponse(l,{rejectWith:new Error("targeted worker unavailable")})}catch(f){this._debugLog?.(f,"postMessage: cleanupPendingResponse failed")}return c}return!1}if(i==null&&this.workers.length<this.maxSize){const f=r;return this._tryGrowPool(e,t,n,f,a,l,c)}if(this.taskQueueEnabled){const f=this._prepareForTransfer(e,t,n);return this._enqueueOrReject(f,a,l,c)}if(!this.workers.length)return a?c:!1;const u=this._nextIndex%this.workers.length;this._nextIndex=(this._nextIndex+1)%this.workers.length;const d=this.workers[u];try{const f=r,g=this._prepareForTransfer(e,t,n);return this._postToWorkerObj(d,g,f,a,l,c)}catch(f){if(a&&l){try{this._cleanupPendingResponse(l,{rejectWith:f})}catch(g){this._debugLog?.(g,"postMessage: cleanupPendingResponse failed")}try{this._logger.error(f,"Failed to postMessage to fallback worker")}catch(g){this._debugLog?.(g,"postMessage: logger.error failed")}return c}try{this._logger.error(f,"Failed to postMessage to fallback worker")}catch(g){this._debugLog?.(g,"postMessage: logger.error failed")}return!1}}_generateCorrelationId(){try{const t=typeof globalThis<"u"?globalThis.crypto:void 0;if(typeof t?.randomUUID=="function")return`${t.randomUUID()}-${this._correlationCounter++}`}catch{}try{const t=typeof globalThis<"u"?globalThis.crypto:void 0;if(typeof t?.getRandomValues=="function"){const n=new Uint8Array(16);return t.getRandomValues(n),`${Array.from(n).map(i=>i.toString(16).padStart(2,"0")).join("")}-${this._correlationCounter++}`}}catch{}const e=Math.floor(Math.random()*4294967295).toString(16);return`cid-${Math.floor(qe()).toString(36)}-${e}-${this._correlationCounter++}`}_cleanupPendingResponse(e,t={}){const n=e!=null?String(e):e,r=this._pendingResponses.get(n);if(!r)return!1;try{if(r.timer)try{clearTimeout(r.timer)}catch(i){this._debugLog?.(i,"_cleanupPendingResponse: clearTimeout failed")}}catch(i){this._debugLog?.(i,"_cleanupPendingResponse: timer check failed")}try{Object.prototype.hasOwnProperty.call(t,"resolveWith")?r.resolve(t.resolveWith):Object.prototype.hasOwnProperty.call(t,"rejectWith")&&r.reject(t.rejectWith)}catch(i){this._debugLog?.(i,"_cleanupPendingResponse: resolve/reject failed")}finally{try{this._pendingResponses.delete(n)}catch(i){this._debugLog?.(i,"_cleanupPendingResponse: delete failed")}}return!0}broadcast(e,t){const n=qe();let r=null;const i=e!==null&&typeof e=="object"&&!ArrayBuffer.isView(e)&&!(e instanceof ArrayBuffer);for(const s of this.workers)try{let o=e,a=t;if(!a&&i)try{r==null&&(r=this._encodeForTransfer(e));const l=r.slice();o=l,a=[l.buffer]}catch{o=e,a=void 0}a?.length?s.worker.postMessage(o,a):s.worker.postMessage(o),typeof s._startTimes?.push=="function"&&s._startTimes.push(n),s.tasks++,this._activeTasks++,s.lastActive=n}catch(o){this._logger.error(o,"broadcast error")}this._updateIdleState()}_normalizeStopThePressOptions(e){const t=typeof e?.recreateWorkers<"u"?!!e.recreateWorkers:!0,n=typeof e=="object"?Object.assign({},e):void 0;return n&&delete n.recreateWorkers,{recreate:t,fwdOptions:n}}_resetPoolForStopThePress({recreate:e,scope:t}){try{typeof this.queue?.clear=="function"&&this.queue.clear()}catch(s){this._logger.error(s,`${t}: failed to clear queue`)}try{this._queueHighCrossed=!1}catch(s){this._debugLog?.(s,"_resetPoolForStopThePress: queueHighCrossed reset failed")}try{for(const[s]of this._pendingResponses)try{this._cleanupPendingResponse(s,{rejectWith:new Error(`${t}: cancelled pending response`)})}catch(o){this._debugLog?.(o,"_resetPoolForStopThePress: cleanupPendingResponse failed")}}catch(s){this._logger.error(s,`${t}: failed to cancel pending responses`)}let n=0,r=[];try{const s=this.workers;if(n=Number(s?.length)||0,Array.isArray(s))r=s.slice();else{r=new Array(n);for(let o=0;o<n;o++)r[o]=s[o]}}catch(s){this._logger.error(s,`${t}: failed to snapshot workers`),n=0,r=[]}const i=r.map(s=>s?.id).filter(s=>s!=null);try{for(let s=r.length-1;s>=0;s--){const o=r[s];this._terminatedWorkerTaskCountsTotal+=o.completedTasks||0,this._terminatedWorkerTaskCountsCount+=1;try{o.worker.terminate()}catch(a){this._debugLog?.(a,"_resetPoolForStopThePress: worker.terminate failed")}this._deleteWorkerUnderlyingMapping(o)}this.workers.length=0,this._activeTasks=0}catch(s){this._logger.error(s,`${t}: failed while terminating workers`)}if(e||this._clearLifecycleIntervals(),e){const s=Math.max(this.minSize,Math.min(n,this.maxSize));for(let o=0;o<s;o++)try{const a=this.workers.length;if(this._addWorkerInstance(),this.workers.length===a)break}catch(a){try{this._logger.error(a,"recreate: add worker failed")}catch(l){this._debugLog?.(l,"recreate: logger.error failed")}try{this._bus.emit("pool:error",{phase:"recreate",error:a})}catch(l){this._debugLog?.(l,"recreate: bus.emit failed")}break}try{this._ensureReaper()}catch(o){this._debugLog?.(o,"recreate: ensureReaper failed")}}return this._updateIdleState(),{currentCount:n,terminatedIds:i}}stopThePress(e,t,n){const{recreate:r,fwdOptions:i}=this._normalizeStopThePressOptions(n),{currentCount:s,terminatedIds:o}=this._resetPoolForStopThePress({recreate:r,scope:"stopThePress"});try{o?.length&&this._bus.emit("pool:scale",{action:"remove",terminated:o,count:s})}catch(a){this._logger.error(a,"pool scale stopThePress listener error")}return this.postMessage(e,t,i)}postMessageBatch(e,t){if(!Array.isArray(e))throw new Error("postMessageBatch expects an array of {message, transfer?}");const n=!!(t?.awaitResponse||t?.correlationId!=null),r=typeof t?.correlationIdFactory=="function"?t.correlationIdFactory:null;if(n){if(t?.correlationId!=null&&e.length>1&&!r)throw new Error("postMessageBatch cannot use a fixed correlationId for multiple items; provide options.correlationIdFactory or omit correlationId");const d=new Array(e.length);for(let f=0;f<e.length;f++){const g=e[f]||{},m=Object.assign({},t);r&&(m.correlationId=String(r(f,g))),d[f]=this.postMessage(g.message,g.transfer,m)}return d}const i=new Array(e.length),s=[],o=t?.workerId!=null?t.workerId:null,a=this.prepareBuffers(e,{clone:!0,zeroCopy:!!t?.zeroCopy});if(o==null&&this.workers.length===1&&this._maxTasksPerWorker===1/0){const d=this.workers[0];let f=!1;for(let g=0;g<e.length;g++){const m=a[g]||{message:e[g]?.message,transfer:e[g]?.transfer};try{const p=qe();m.transfer?.length?d.worker.postMessage(m.message,m.transfer):d.worker.postMessage(m.message),typeof d._startTimes?.push=="function"&&d._startTimes.push(p),d.tasks++,this._activeTasks++,d.lastActive=p,f=!0,i[g]=!0}catch{i[g]=!1}}return f&&this._updateIdleState(),i}const l=o!=null;let c=null;if(l){if(c=this.workers.find(d=>d.id===o),!c)return e.map(()=>!1)}else c=this._findLeastLoadedWorker();let u=!1;for(let d=0;d<e.length;d++){const f=e[d]||{},g=a[d]||{message:f.message,transfer:f.transfer};let m=!1;c?.tasks>=this._maxTasksPerWorker&&(c=null);let p=c;if(!p&&!l&&(p=this._findLeastLoadedWorker()),p?.tasks<this._maxTasksPerWorker)try{const y=qe();g.transfer?.length?p.worker.postMessage(g.message,g.transfer):p.worker.postMessage(g.message),typeof p._startTimes?.push=="function"&&p._startTimes.push(y),p.tasks++,this._activeTasks++,p.lastActive=y,u=!0,i[d]=!0,m=!0,c=p.tasks<this._maxTasksPerWorker?p:null}catch{i[d]=!1,m=!0}if(!m&&o==null&&this.workers.length<this.maxSize)try{const y=this._addWorkerInstance();if(!y)i[d]=!1,m=!0;else{const h=qe();g.transfer?.length?y.worker.postMessage(g.message,g.transfer):y.worker.postMessage(g.message),typeof y._startTimes?.push=="function"&&y._startTimes.push(h),y.tasks++,this._activeTasks++,y.lastActive=h,u=!0,i[d]=!0,m=!0,c=y.tasks<this._maxTasksPerWorker?y:null}}catch(y){try{this._logger.error(y,"postMessageBatch: add worker failed")}catch{}try{this._bus.emit("pool:error",{phase:"postMessageBatch",error:y})}catch{}i[d]=!1,m=!0}if(!m){if(o!=null){i[d]=!1;continue}if(this.taskQueueEnabled){const y=this._queuePolicy;if(y==="reject"||y==="drop-newest"&&this.queue.length>0)i[d]=!1;else{if(y==="drop-oldest"&&this.queue.length>0){const h=this.queue.shift();h?.correlationId!=null&&this._cleanupPendingResponse(h.correlationId,{rejectWith:new Error("postMessage queued task dropped by policy")})}s.push({message:g.message,transfer:g.transfer}),i[d]=!0}}else if(!this.workers.length)i[d]=!1;else{const y=this._nextIndex%this.workers.length;this._nextIndex=(this._nextIndex+1)%this.workers.length;const h=this.workers[y];try{const w=qe();g.transfer?.length?h.worker.postMessage(g.message,g.transfer):h.worker.postMessage(g.message),typeof h._startTimes?.push=="function"&&h._startTimes.push(w),h.tasks++,this._activeTasks++,h.lastActive=w,u=!0,i[d]=!0}catch(w){i[d]=!1,this._logger.error(w,"Failed to postMessage to fallback worker")}}}}if(s.length)try{this.queue.pushMany(s),u=!0;try{Number.isFinite(this._queueHighThreshold)&&this.queue.length>this._queueHighThreshold&&!this._queueHighCrossed&&(this._queueHighCrossed=!0,this._bus.emit("pool:queue:high",{length:this.queue.length,threshold:this._queueHighThreshold}))}catch(d){this._debugLog?.(d,"postMessageBatch: bus.emit pool:queue:high failed")}}catch(d){this._logger.error(d,"postMessageBatch: failed to enqueue prepared items")}return u&&this._updateIdleState(),i}stopThePressBatch(e,t){const{recreate:n,fwdOptions:r}=this._normalizeStopThePressOptions(t);this._resetPoolForStopThePress({recreate:n,scope:"stopThePressBatch"});try{return this.postMessageBatch(e,r)}catch(i){try{this._logger.error(i,"stopThePressBatch: postMessageBatch failed")}catch(s){this._debugLog?.(s,"stopThePressBatch: logger.error failed")}try{return new Array(e?e.length:0).fill(!1)}catch{return[]}}}addWorker(){try{return this._addWorkerInstance()}catch(e){try{this._logger.error(e,"addWorker: failed")}catch(t){this._debugLog?.(t,"addWorker: logger.error failed")}try{this._bus.emit("pool:error",{phase:"addWorker",error:e})}catch(t){this._debugLog?.(t,"addWorker: bus.emit failed")}return null}}removeWorker(){const e=this.workers.pop();if(e){this._decrementActiveTasks(e.tasks||0);try{e.worker.terminate()}catch(t){this._debugLog?.(t,"removeWorker: worker.terminate failed")}this._deleteWorkerUnderlyingMapping(e),this._terminatedWorkerTaskCountsTotal+=e.completedTasks||0,this._terminatedWorkerTaskCountsCount+=1}}_reapIdleWorkers(){if(this.idleTimeout<=0)return;const e=qe();for(let t=this.workers.length-1;t>=0;t--){const n=this.workers[t];if(this.workers.length<=this.minSize)break;if(n.tasks===0&&e-(n.lastActive||0)>this.idleTimeout){try{n.worker.terminate()}catch(i){this._debugLog?.(i,"_reapIdleWorkers: worker.terminate failed")}try{const i=n.worker?._underlying;i&&this._underlyingToWorkerObj&&this._underlyingToWorkerObj.delete(i)}catch(i){this._debugLog?.(i,"_reapIdleWorkers: underlyingToWorkerObj.delete failed")}const r=this.workers.length-1;t===r?this.workers.pop():this.workers[t]=this.workers.pop()}}this._updateIdleState()}_autoScaleTick(){try{if(!this._autoScale||!this._autoScale.enabled)return;const e=qe(),t=this._autoScale;this._lastAutoScaleAt&&t.backoffResetMs&&e-this._lastAutoScaleAt>t.backoffResetMs&&(this._autoScaleBackoffMultiplier=1);const n=Math.floor((t.cooldownMs||0)*(this._autoScaleBackoffMultiplier||1));if(this._lastAutoScaleAt&&e-this._lastAutoScaleAt<n)return;const r=t.targetMs,i=t.hysteresis||.2,s=this._ewmaLatency,o=this.workers.length,a=r*(1+i),l=s!=null?s>a:!1,c=this.queue.length>Math.ceil(o*(1+i));if(l||c){if(o<this.maxSize)try{const d=Math.min(this.maxSize-o,t.stepUp||1);for(let f=0;f<d;f++)try{const g=this.workers.length;if(this._addWorkerInstance(),this.workers.length===g)break}catch(g){this._debugLog?.(g,"autoScale: addWorker failed");try{this._bus.emit("pool:error",{phase:"autoScale:add",error:g})}catch(m){this._debugLog?.(m,"autoScale: bus.emit failed")}break}this._lastAutoScaleAt=e,this._autoScaleBackoffMultiplier=Math.min((this._autoScaleBackoffMultiplier||1)*(t.backoffFactor||1),t.backoffMaxMultiplier||8)}catch(d){this._debugLog?.(d,"autoScale: addWorker failed outer")}return}const u=r*Math.max(0,1-i);if(s!=null&&s<u&&this.queue.length===0&&o>this.minSize)try{const d=Math.min(o-this.minSize,t.stepDown||1);let f=0;for(let g=this.workers.length-1;g>=0&&f<d;g--){const m=this.workers[g];if(!m||m.tasks>0)continue;try{m.worker.terminate()}catch(y){this._debugLog?.(y,"autoScale: terminate worker")}this._deleteWorkerUnderlyingMapping(m),this._terminatedWorkerTaskCountsTotal+=m.completedTasks||0,this._terminatedWorkerTaskCountsCount+=1;const p=this.workers.length-1;g===p?this.workers.pop():this.workers[g]=this.workers.pop(),f++}f>0&&(this._lastAutoScaleAt=e,this._autoScaleBackoffMultiplier=Math.min((this._autoScaleBackoffMultiplier||1)*(t.backoffFactor||1),t.backoffMaxMultiplier||8))}catch(d){this._debugLog?.(d,"autoScale: remove worker failed")}}catch(e){this._debugLog?.(e,"autoScaleTick outer")}}_buildIdleEvent(){const e=this;let t,n=!1;return{data:{type:"pool:idle",get stats(){return n||(t=e.getStats(),n=!0),t}}}}_emitIdle(){const e=this._buildIdleEvent();if(this._isIdle=!0,this._onmessage)try{this._onmessage(e)}catch(t){this._logger.error(t,"Pool onmessage handler error")}if(this._onidle)try{this._onidle(e)}catch(t){this._logger.error(t,"Pool onidle handler error")}try{this._bus.emit("message",e)}catch(t){this._logger.error(t,"pool listener error")}try{this._bus.emit("idle",e)}catch(t){this._logger.error(t,"pool idle listener error")}}_updateIdleState(){const e=this.queue.length===0,t=this._activeTasks===0&&e;t&&!this._isIdle?this._emitIdle():!t&&this._isIdle&&(this._isIdle=!1)}terminate(){try{this.shutdown()}catch{}}[Symbol.dispose](){this.shutdown()}async[Symbol.asyncDispose](){try{await this.drain()}catch{}this.terminate()}getStats(){const e=this.workers.map(y=>({id:y.id,tasks:y.tasks,lastActive:y.lastActive})),t=qe(),n=this._createdAt!=null?Math.max(0,t-this._createdAt):0,r=this._totalWorkersCreated||this.workers.length,i=this._totalTasksCompleted||0,s=this._terminatedWorkerTaskCountsCount||0,o=this._terminatedWorkerTaskCountsTotal||0;let a=0;for(const y of this.workers)a+=y.completedTasks||0;const l=s+(this.workers.length||0),c=l>0?(o+a)/l:0;let u=0,d=0,f=0,g=0,m=0;const p=this._taskDurationsWelfordCount||0;if(p>0){u=this._taskDurationsMin===Number.POSITIVE_INFINITY?0:this._taskDurationsMin,d=this._taskDurationsMax===Number.NEGATIVE_INFINITY?0:this._taskDurationsMax,f=this._taskDurationsWelfordMean;const y=p>1?this._taskDurationsWelfordM2/p:0;g=Math.sqrt(y),m=p>0?(this._slowTaskCount||0)/p*100:0}return{status:e,performance:{poolLiveDuration:n,totalWorkersCreated:r,totalTasksPerformed:i,averageTasksPerWorkerUntilTermination:c,timePerTask:{max:d,min:u,average:f,stddev:g},percentSlowTasks:m},queueLength:this.queue.length,activeTasks:this._activeTasks,workerCount:this.workers.length,minSize:this.minSize,maxSize:this.maxSize,isIdle:this._activeTasks===0&&this.queue.length===0}}drain(){const e=this.queue.length===0;return this._activeTasks===0&&e?Promise.resolve(this.getStats()):new Promise(t=>{const n=()=>{try{this.removeEventListener("idle",n)}catch(r){this._debugLog?.(r,"drain: removeEventListener failed")}t(this.getStats())};this.addEventListener("idle",n)})}addEventListener(e,t){if(typeof t=="function"&&(this._bus.on(e,t),e==="idle")){const n=this.queue.length===0;if(this._activeTasks===0&&n){const r=this._buildIdleEvent();try{t(r)}catch(i){this._logger.error(i,"pool idle listener error")}}}}removeEventListener(e,t){!t||typeof t!="function"||this._bus.off(e,t)}get onresize(){return this._onresize}set onresize(e){this._onresize=e}get onmessage(){return this._onmessage}set onmessage(e){this._onmessage=e}get onerror(){return this._onerror}set onerror(e){this._onerror=e}get onidle(){return this._onidle}set onidle(e){if(this._onidle=e,typeof e=="function"){const t=this.queue.length===0;if(this._activeTasks===0&&t){const n=this._buildIdleEvent();try{e(n)}catch(r){this._logger.error(r,"Pool onidle handler error")}}}}pauseQueue(){this._queuePaused=!0}resumeQueue(){this._queuePaused&&(this._queuePaused=!1,this._dispatchQueuedTasks())}pause(){return this.pauseQueue()}resume(){return this.resumeQueue()}get queuePaused(){return this._queuePaused}_dispatchQueuedTasks(){if(this._queuePaused||!this.taskQueueEnabled||this.queue.length===0)return;const e=this.queue,t=this._maxTasksPerWorker,n=qe();let r=!1;for(const i of this.workers){let s=t-i.tasks;for(;s>0&&e.length>0;){const o=e.shift();try{o.transfer?.length?i.worker.postMessage(o.message,o.transfer):i.worker.postMessage(o.message),typeof i._startTimes?.push=="function"&&i._startTimes.push(n),i.tasks++,s--,this._activeTasks++,i.lastActive=n,r=!0}catch(a){this._debugLog?.(a,"dispatch queued message to worker failed"),this._logger.error(a,"Failed to dispatch queued message to worker");break}}}this._queueHighCrossed&&this.queue.length<=this._queueHighThreshold&&(this._queueHighCrossed=!1),r&&this._updateIdleState()}},Ic=class{constructor(e={}){const{capacity:t=1,queueCapacity:n=1/0,initialTokens:r}=e||{};this._capacity=Math.max(1,Math.floor(Number(t)||1)),this._queueCapacity=Number.isFinite(Number(n))?Math.max(0,Math.floor(Number(n))):1/0,this._available=Number.isFinite(r)?Math.min(this._capacity,Math.max(0,Math.floor(Number(r)))):this._capacity,this._waiters=new vi(16)}get capacity(){return this._capacity}get available(){return this._available}get pending(){return this._waiters.length}get queueCapacity(){return this._queueCapacity}get isFull(){return this._waiters.length>=this._queueCapacity}get active(){return this._capacity-this._available}acquire(){return this._available>0?Promise.resolve(this._grant()):this.isFull?Promise.reject(new Error("PowerPermitGate queue is full")):new Promise((e,t)=>{this._waiters.push({resolve:e,reject:t})})}tryAcquire(){return this._available>0?this._grant():null}release(e=1){let t=Math.max(0,Math.floor(Number(e)||1));for(;t>0&&this._waiters.length>0;){const n=this._waiters.shift();typeof n?.resolve=="function"&&(n.resolve(this._makeRelease()),t-=1)}t>0&&(this._available=Math.min(this._capacity,this._available+t))}reset(e={}){const{available:t=this._capacity,reason:n=new Error("PowerPermitGate reset")}=e;for(this._available=Math.min(this._capacity,Math.max(0,Math.floor(Number(t)||0)));this._waiters.length>0;){const r=this._waiters.shift();typeof r?.reject=="function"&&r.reject(n)}}_makeRelease(){let e=!1;return()=>{e||(e=!0,this.release(1))}}_grant(){return this._available-=1,this._makeRelease()}},Co=class{constructor(e=1){this._gate=new Ic({capacity:e,initialTokens:e})}get limit(){return this._gate.capacity}get active(){return this._gate.active}get pending(){return this._gate.pending}get available(){return this._gate.available}get isLocked(){return this._gate.available===0}acquire(){return this._gate.acquire()}tryAcquire(){return this._gate.tryAcquire()}async run(e){const t=await this.acquire();try{return await e()}finally{t()}}reset(){this._gate.reset({available:this._gate.capacity})}};function Oc(){return typeof requestIdleCallback=="function"?new Promise(e=>{try{requestIdleCallback(e,{timeout:50})}catch{setTimeout(e,0)}}):new Promise(e=>setTimeout(e,0))}async function Sn(e,t=50){try{if(!e||!t)return;e%t===0&&await Oc()}catch{}}var zc=_.__exportAll({CRAWL_MAX_QUEUE:()=>Go,HOME_SLUG:()=>Kt,_setAllMd:()=>Uo,_setSearchIndex:()=>Cr,_storeSlugMapping:()=>St,addSlugResolver:()=>Wc,allMarkdownPaths:()=>ht,allMarkdownPathsSet:()=>Qe,availableLanguages:()=>gt,awaitSearchIndex:()=>Ms,buildSearchIndex:()=>Un,buildSearchIndexWorker:()=>Es,clearFetchCache:()=>Xc,clearListCaches:()=>Hc,crawlAllMarkdown:()=>Qo,crawlCache:()=>Ei,crawlForSlug:()=>Yo,crawlForSlugWorker:()=>Uc,defaultCrawlMaxQueue:()=>Qr,ensureSlug:()=>Ko,fetchCache:()=>zt,fetchMarkdown:()=>Ke,getFetchConcurrency:()=>Ir,getLanguages:()=>Ks,getSearchIndex:()=>tu,homePage:()=>Et,initSlugWorker:()=>Gi,isExternalLink:()=>Zc,isExternalLinkWithBase:()=>Yr,listPathsFetched:()=>Ii,listSlugCache:()=>Nr,mdToSlug:()=>be,negativeFetchCache:()=>An,notFoundPage:()=>ke,removeSlugResolver:()=>Fc,resolveSlugPath:()=>ir,searchIndex:()=>oe,setContentBase:()=>Js,setDefaultCrawlMaxQueue:()=>Vo,setFetchCacheMaxSize:()=>Yc,setFetchCacheTTL:()=>Qc,setFetchConcurrency:()=>Ho,setFetchMarkdown:()=>Jc,setFetchNegativeCacheTTL:()=>Fo,setHomePage:()=>Bo,setLanguages:()=>Oo,setNegativeFetchCacheMaxSize:()=>Kc,setNotFoundPage:()=>Do,setSkipRootReadme:()=>Io,skipRootReadme:()=>Qs,slugResolvers:()=>Vi,slugToMd:()=>te,slugify:()=>Se,storeSlugMapping:()=>ft,teardownSlugWorkerPool:()=>Dc,unescapeMarkdown:()=>xi,uniqueSlug:()=>En,watchForColdHashRoute:()=>ki,whenSearchIndexReady:()=>xn}),Ca=0,Ni=new Map;function ki(e){try{if(!e)return;let t=Kt,n="";if(e.type==="cosmetic"){const i=e.page!=null&&String(e.page).trim()!=="";t=i?String(e.page):Kt,n="#/"+(i?String(e.page):""),e.anchor&&(n+="#"+String(e.anchor)),e.params&&(n+="?"+String(e.params))}else if(e.type==="path"){const i=e.page!=null&&String(e.page).trim()!=="";t=i?String(e.page):Kt,n="/"+(i?String(e.page):""),e.anchor&&(n+="#"+String(e.anchor)),e.params&&(n+="?"+String(e.params))}else if(e.type==="canonical")if(e.page)t=e.page,n="?page="+encodeURIComponent(e.page),e.anchor&&(n+="#"+String(e.anchor)),e.params&&(n+="?"+String(e.params));else{t=Kt;try{n=typeof location<"u"&&location?.pathname?String(location.pathname):"/",typeof location<"u"&&location?.search&&(n+=String(location.search)),typeof location<"u"&&location?.hash&&(n+=String(location.hash))}catch{n="/"}}else return;const r=Ni.get(t)||[];r.push(n),Ni.set(t,r)}catch{}}function No(e,t){try{const n=String(e??""),r=Ni.get(n);if(!r||!r.length)return;try{const i=typeof globalThis<"u"?globalThis:null;if(i){try{i.__nimbiColdRouteResolved||(i.__nimbiColdRouteResolved=[])}catch{}for(const s of r)try{const o={slug:n,token:s,rel:String(t??"")};try{i.__nimbiColdRouteResolved.push(o)}catch{}try{i?.dispatchEvent?.(new CustomEvent("nimbi.coldRouteResolved",{detail:o}))}catch{}try{i?.__nimbiUI?.renderByQuery?.().catch(()=>{})}catch{}}catch{}}}catch{}Ni.delete(n)}catch{}}try{te.set=function(e,t){const n=Map.prototype.has.call(this,e),r=Map.prototype.set.call(this,e,t);try{n||No(e,typeof t=="string"?t:t?.default??Object.values(t?.langs??{})[0]??"")}catch{}return r}}catch{}var gt=[],Qs=!1;function Io(e){Qs=!!e}function Oo(e){gt=Array.isArray(e)?e.slice():[]}function Ks(){return gt}async function zo(e,t,n=4,r){if(!Array.isArray(e)||e.length===0)return[];const i=new Co(Math.max(1,Number(n)||1));return Promise.all(e.map((s,o)=>i.run(()=>t(s,o),{signal:r})))}var Hi=Ao(),qc={intervalMs:750,targetMs:120,hysteresis:.3,cooldownMs:1e3,stepUp:1,stepDown:1},Lr=null;function $c(){const e={size:Hi,minSize:2,autoScale:qc,messageCodec:"legacy",maxQueueLength:100};try{e.debugLevel=0}catch{}try{return new Ys(kc,e)}catch{return{workers:[],postMessage:async()=>{throw new Error("slug worker unavailable")}}}}function qo(){return Lr||(Lr=$c()),Lr}function Dc(){const e=Lr;if(Lr=null,!!e)try{typeof e.drain=="function"&&e.drain().catch(()=>{}),typeof e.terminate=="function"&&e.terminate(),typeof e.dispose=="function"&&e.dispose()}catch(t){k("[slugManager] teardownSlugWorkerPool failed",t)}}function Bc(){try{return vo()}catch{return!1}}function Gi(){return qo().workers?.[0]?.worker?._underlying??null}function $o(e){return Gi?.()?qo().postMessage(e,void 0,{awaitResponse:!0,timeout:5e3}).then(t=>{if(t?.error)throw new Error(t.error);return t}).catch(t=>{throw(t?.message||"").includes("postMessage response timeout")?new Error("worker timeout"):t}):Promise.reject(new Error("slug worker required but unavailable"))}async function Es(e,t=1,n=void 0,r=void 0){if(!Gi?.())throw new Error("slug worker required but unavailable");return await $o({type:"buildSearchIndex",contentBase:e,indexDepth:t,noIndexing:n,seedPaths:r})}async function Uc(e,t,n){if(!Gi?.())throw new Error("slug worker required but unavailable");return $o({type:"crawlForSlug",slug:e,base:t,maxQueue:n})}function St(e,t){if(!e)return;let n=null;try{n=re(typeof t=="string"?t:String(t??""))}catch{n=String(t??"")}if(n){try{if(gt?.length){const r=String(n).split("/")[0],i=Array.isArray(gt)?gt.length>8?(gt._set||=new Set(gt)).has(r):gt.includes(r):!1;let s=te.get(e);if(!s||typeof s=="string")s={default:typeof s=="string"?re(s):void 0,langs:{}};else try{s.default&&(s.default=re(s.default))}catch{}i?s.langs[r]=n:s.default=n,te.set(e,s)}else{const r=te.has(e)?te.get(e):void 0;if(!r)te.set(e,n);else{let i=null;try{typeof r=="string"?i=re(r):r&&typeof r=="object"&&(i=r.default?re(r.default):null)}catch{i=null}if(i===n)te.set(e,n);else{let s=null,o=2;for(;s=`${e}-${o}`,!!te.has(s);){let a=te.get(s),l=null;try{typeof a=="string"?l=re(a):a&&typeof a=="object"&&(l=a.default?re(a.default):null)}catch{l=null}if(l===n){e=s;break}if(o+=1,o>1e4)break}try{if(!te.has(s))te.set(s,n),e=s;else if(te.get(s)===n)e=s;else{const a=new Set;for(const c of te.keys())a.add(c);const l=typeof En=="function"?En(e,a):`${e}-2`;te.set(l,n),e=l}}catch(a){k("[slugManager] slug collision resolution failed",a)}}}}}catch{}try{if(n){try{be.set(n,e)}catch{}Qe&&!Qe.has(n)&&(Qe.add(n),Array.isArray(ht)&&ht.push(n))}}catch{}}}function ft(e,t){return St(e,t)}var Vi=new Set;function Wc(e){typeof e=="function"&&Vi.add(e)}function Fc(e){typeof e=="function"&&Vi.delete(e)}var As={},ke="_404.md",Et=null,Kt="_home";function Do(e){if(e==null){ke=null;return}ke=String(e??"")}function Bo(e){if(e==null){Et=null;return}Et=String(e??"");try{try{No(Kt,Et)}catch{}}catch{}}function Uo(e){As=e||{}}function Cr(e){try{if(Array.isArray(oe)||(oe=[]),!Array.isArray(e))return;try{oe.length=0;for(const t of e)oe.push(t);try{if(typeof window<"u")try{window.__nimbiLiveSearchIndex=oe}catch{}}catch{}}catch(t){ge("[slugManager] replacing searchIndex by assignment fallback",t);try{oe=Array.from(e)}catch{}}}catch{}}var Nr=new Map,Ii=new Set;function Hc(){Nr.clear(),Ii.clear()}function Gc(e){if(!e||e.length===0)return"";let t=e[0];for(let r=1;r<e.length;r++){const i=e[r];let s=0;const o=Math.min(t.length,i.length);for(;s<o&&t[s]===i[s];)s++;t=t.slice(0,s)}const n=t.lastIndexOf("/");return n===-1?t:t.slice(0,n+1)}var Vc=new ar(function(e){let n=String(e??"").toLowerCase().replace(/[^a-z0-9\- ]/g,"").replace(/ /g,"-");return n=n.replace(/(?:-?)(?:md|html)$/,""),n=n.replace(/-+/g,"-"),n=n.replace(/^-|-$/g,""),n.length>80&&(n=n.slice(0,80).replace(/-+$/g,"")),n},{keyResolver:e=>e===void 0?"__undefined":String(e),cacheOptions:{maxEntries:2e3}}),Se=e=>Vc.run(e);function Js(e){te.clear(),be.clear(),wc([]);try{Qe.clear()}catch{}gt=gt||[];const t=!!gt?.length,n=new Set,r=Object.keys(As||{});if(!r.length)return;let i="";try{if(e){try{/^[a-z][a-z0-9+.-]*:/i.test(String(e))?i=new URL(String(e)).pathname:i=String(e??"")}catch(s){i=String(e??""),ge("[slugManager] parse contentBase failed",s)}i=Mn(i)}}catch(s){i="",ge("[slugManager] setContentBase prefix derivation failed",s)}i||(i=Gc(r));for(const s of r){let o=s;i&&s.startsWith(i)?o=re(s.slice(i.length)):o=re(s),ht.push(o);try{Qe.add(o)}catch{}const a=As[s];if(typeof a=="string"){const l=(a||"").match(/^#\s+(.+)$/m);if(l&&l[1]){const c=Se(l[1].trim());if(c)try{let u=c;if(t||(u=En(u,n)),t){const d=o.split("/")[0],f=Array.isArray(gt)?gt.length>8?(gt._set||=new Set(gt)).has(d):gt.includes(d):!1;let g=te.get(u);(!g||typeof g=="string")&&(g={default:typeof g=="string"?g:void 0,langs:{}}),f?g.langs[d]=o:g.default=o,te.set(u,g)}else te.set(u,o),n.add(u);be.set(o,u)}catch(u){ge("[slugManager] set slug mapping failed",u)}}}}try{er()}catch(s){ge("[slugManager] refreshIndexPaths failed",s)}}try{Js()}catch(e){ge("[slugManager] initial setContentBase failed",e)}function En(e,t){if(!t.has(e))return e;let n=2,r=`${e}-${n}`;for(;t.has(r);)n+=1,r=`${e}-${n}`;return r}function Zc(e){return Yr(e,void 0)}function Yr(e,t){if(!e)return!1;if(e.startsWith("//"))return!0;if(/^[a-z][a-z0-9+.-]*:/i.test(e)){if(t&&typeof t=="string")try{const n=new URL(e),r=new URL(t);return n.origin!==r.origin?!0:!n.pathname.startsWith(r.pathname)}catch{return!0}return!0}if(e.startsWith("/")&&t&&typeof t=="string")try{const n=new URL(e,t),r=new URL(t);return n.origin!==r.origin?!0:!n.pathname.startsWith(r.pathname)}catch{return!0}return!1}function xi(e){return e==null?e:String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g,(t,n)=>n)}function ir(e){if(!e||!te.has(e))return null;const t=te.get(e);if(!t)return null;if(typeof t=="string")return t;if(gt?.length&&qt&&t.langs&&t.langs[qt])return t.langs[qt];if(t.default)return t.default;if(t.langs){const n=Object.keys(t.langs);if(n.length)return t.langs[n[0]]}return null}var zt=new Zr({maxEntries:2e3});function Xc(){zt.clear(),An.clear()}var An=new Zr({maxEntries:2e3}),Wo=6e4;function Fo(e){Wo=Number(e)||0}function Yc(e){try{const t=Math.max(0,Number(e)||0);zt&&typeof zt.maxEntries<"u"&&(zt.maxEntries=t)}catch{}}function Qc(e){try{const t=Math.max(0,Number(e)||0);zt&&typeof zt.defaultTTL<"u"&&(zt.defaultTTL=t)}catch{}}function Kc(e){try{const t=Math.max(0,Number(e)||0);An&&typeof An.maxEntries<"u"&&(An.maxEntries=t)}catch{}}var Ts=Math.max(1,Math.min(Hi,5));function Ho(e){try{Ts=Math.max(1,Number(e)||1)}catch{Ts=1}}function Ir(){return Ts}var Ke=async function(e,t,n){if(!e)throw new Error("path required");try{if(typeof e=="string"&&(e.indexOf("?page=")!==-1||e.startsWith("?")||e.startsWith("#/")||e.indexOf("#/")!==-1))try{const u=_t(e);u?.page&&(e=u.page)}catch{}}catch{}try{const u=(String(e??"").match(/([^\/]+)\.md(?:$|[?#])/)||[])[1],d=typeof e=="string"&&String(e).indexOf("/")===-1;if(u&&d&&te.has(u)){const f=ir(u)||te.get(u);f&&f!==e&&(e=f)}}catch(u){ge("[slugManager] slug mapping normalization failed",u)}try{if(typeof e=="string"&&e.indexOf("::")!==-1){const u=String(e).split("::",1)[0];if(u)try{if(te.has(u)){const d=ir(u)||te.get(u);d?e=d:e=u}else e=u}catch{e=u}}}catch(u){ge("[slugManager] path sanitize failed",u)}try{if(t)try{let u=(/^[a-z][a-z0-9+.-]*:/i.test(String(t))?new URL(String(t)):new URL(String(t),typeof location<"u"?location.origin:"http://localhost")).pathname||"";if(u=u.replace(/^\/+|\/+$/g,""),u)try{const d=String(e??"");if(!/^[a-z][a-z0-9+.-]*:/i.test(d)){let f=d.replace(/^\/+/,"");f===u?e="":f.startsWith(u+"/")?e=f.slice(u.length+1):e=f}}catch{}}catch{}}catch{}if(!(n?.force===!0||typeof ke=="string"&&ke||te?.size||Qe?.size||vo()))throw new Error("failed to fetch md");const r=t==null?"":Wn(String(t));let i="";try{const u=typeof location<"u"&&location?.origin?location.origin:"http://localhost";let d=u.replace(/\/$/,"")+"/";r&&(/^[a-z][a-z0-9+.-]*:/i.test(r)?d=r.replace(/\/$/,"")+"/":r.startsWith("/")?d=u.replace(/\/$/,"")+r.replace(/\/$/,"")+"/":d=u.replace(/\/$/,"")+"/"+r.replace(/\/$/,"")+"/");try{i=new URL(e.replace(/^\//,""),d).toString()}catch{i=u.replace(/\/$/,"")+"/"+e.replace(/^\//,"")}}catch{i=(typeof location<"u"&&location.origin?location.origin:"http://localhost")+"/"+e.replace(/^\//,"")}const s=n?.signal,o=async u=>{const d=n&&typeof n.timeoutMs=="number"?Math.max(0,Number(n.timeoutMs)||0):1e4;try{if(typeof Rr=="function"){const g=new Rr({timeout:d});let m=g.signal;try{if(s&&typeof AbortSignal<"u"&&typeof AbortSignal.any=="function"&&g.signal instanceof AbortSignal)m=AbortSignal.any([s,g.signal]);else if(s&&typeof AbortSignal<"u"){const p=new AbortController;try{s.addEventListener("abort",()=>p.abort(),{once:!0})}catch{}try{g.signal.addEventListener("abort",()=>p.abort(),{once:!0})}catch{}try{(s?.aborted||g.signal?.aborted)&&p.abort()}catch{}m=p.signal}}catch{}try{return await g.run(async()=>{const y=async()=>{if(m?.aborted){const w=new Error("aborted");throw w.name="AbortError",w}return await fetch(u,m?{signal:m,referrerPolicy:"no-referrer"}:{referrerPolicy:"no-referrer"})};if(typeof xs=="function")try{const w=new xs({attempts:3,factor:2,minDelay:50});if(typeof w.run=="function")return await w.run(async()=>{const b=await y();if(b&&typeof b.status=="number"&&b.status>=500){const S=new Error("server error");throw S.status=b.status,S}return b})}catch{}let h;for(let w=0;w<3;w++){if(m?.aborted){const b=new Error("aborted");throw b.name="AbortError",b}try{const b=await y();if(b&&typeof b.status=="number"&&b.status>=500){if(h=new Error("server error"),h.status=b.status,w<2){const S=Math.pow(2,w)*50;await new Promise(A=>setTimeout(A,S));continue}throw h}return b}catch(b){if(b&&b.name==="AbortError")throw b;if(h=b,w<2){const S=Math.pow(2,w)*50;await new Promise(A=>setTimeout(A,S));continue}throw h}}})}catch{}}}catch{}let f=s||null;try{!f&&typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function"?f=AbortSignal.timeout(d):f&&typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function"&&typeof AbortSignal.any=="function"&&(f=AbortSignal.any([f,AbortSignal.timeout(d)]))}catch{}return await fetch(u,f?{signal:f}:void 0)};try{const u=An.get(i);if(u&&u>Date.now())return Promise.reject(new Error("failed to fetch md"));u&&An.delete(i)}catch{}if(zt.has(i))return zt.get(i);const a=(async()=>{let u;try{u=await o(i)}catch(p){try{Pr("fetchMarkdown failed:",()=>({url:i,status:"fetch-error",error:p&&p.message?p.message:String(p)}))}catch{}throw new Error("failed to fetch md")}if(!u||typeof u.ok!="boolean"||!u.ok){if(u&&u.status===404&&typeof ke=="string"&&ke)try{const y=`${r}/${ke}`,h=await o(y);if(h&&typeof h.ok=="boolean"&&h.ok)return{raw:await h.text(),status:404}}catch(y){ge("[slugManager] fetching fallback 404 failed",y)}let p="";try{u&&typeof u.clone=="function"?p=await u.clone().text():u&&typeof u.text=="function"?p=await u.text():p=""}catch(y){p="",ge("[slugManager] reading error body failed",y)}try{const y=u?u.status:void 0;if(y===404)try{k("fetchMarkdown failed (404):",()=>({url:i,status:y,statusText:u?u.statusText:void 0,body:p.slice(0,200)}))}catch{}else try{Pr("fetchMarkdown failed:",()=>({url:i,status:y,statusText:u?u.statusText:void 0,body:p.slice(0,200)}))}catch{}}catch{}throw new Error("failed to fetch md")}const d=await u.text(),f=d.trim().slice(0,128).toLowerCase(),g=/^(?:<!doctype|<html|<title|<h1)/.test(f),m=g||String(e??"").toLowerCase().endsWith(".html");if(g&&String(e??"").toLowerCase().endsWith(".md")){try{if(typeof ke=="string"&&ke){const p=`${r}/${ke}`,y=await o(p);if(y.ok)return{raw:await y.text(),status:404}}}catch(p){ge("[slugManager] fetching fallback 404 failed",p)}throw Bc()&&Pr("fetchMarkdown: server returned HTML for .md request",i),new Error("failed to fetch md")}return m?{raw:d,isHtml:!0}:{raw:d}})();zt.set(i,a);let l=null,c=a;try{if(s&&typeof s=="object"){const u=new Promise((d,f)=>{try{if(s.aborted){const g=new Error("aborted");return g.name="AbortError",f(g)}}catch{}l=()=>{const g=new Error("aborted");g.name="AbortError";try{s.removeEventListener&&s.removeEventListener("abort",l)}catch{}f(g)};try{s.addEventListener&&s.addEventListener("abort",l)}catch{}});c=Promise.race([a,u])}}catch{}return c.finally(()=>{try{l&&s&&typeof s.removeEventListener=="function"&&s.removeEventListener("abort",l)}catch{}}).catch(u=>{if(u&&(u.name==="AbortError"||u.code==="EABORT"||u.code==="EDEADLINE")){try{zt.delete(i)}catch{}throw u}try{An.set(i,Date.now()+Wo)}catch{}try{zt.delete(i)}catch{}throw u})};function Jc(e){typeof e=="function"&&(Ke=e)}var Ei=new Map;function eu(e){if(!e||typeof e!="string")return"";let t=e.replace(/```[\s\S]*?```/g,"");return t=t.replace(/<pre[\s\S]*?<\/pre>/gi,""),t=t.replace(/<code[\s\S]*?<\/code>/gi,""),t=t.replace(/<!--([\s\S]*?)-->/g,""),t=t.replace(/^ {4,}.*$/gm,""),t=t.replace(/`[^`]*`/g,""),t}var oe=[];function tu(){return oe}try{if(typeof window<"u")try{Object.defineProperty(window,"__nimbiSearchIndex",{get(){return oe},enumerable:!0,configurable:!0})}catch{try{window.__nimbiSearchIndex=oe}catch{}}}catch{}try{if(typeof window<"u")try{Object.defineProperty(window,"__nimbiIndexReady",{get(){return Ms},enumerable:!0,configurable:!0})}catch{try{window.__nimbiIndexReady=Ms}catch{}}}catch{}var vn=null;async function Un(e,t=1,n=void 0,r=void 0){const i=Array.isArray(n)?Array.from(new Set((n||[]).map(s=>re(String(s??""))))):[];try{const s=re(String(ke??""));s&&!i.includes(s)&&i.push(s)}catch{}if(oe&&oe.length&&t===1&&!oe.some(s=>{try{return i.includes(re(String(s.path??"")))}catch{return!1}}))return oe;if(vn)return vn;vn=(async()=>{let s=Array.isArray(n)?Array.from(new Set((n||[]).map(h=>re(String(h??""))))):[],o=new Set(s);try{const h=re(String(ke??""));h&&!o.has(h)&&(o.add(h),s.push(h))}catch{}const a=h=>{if(!o||o.size===0)return!1;for(const w of o)if(w&&(h===w||h.startsWith(w+"/")))return!0;return!1};let l=[];try{if(Array.isArray(r)&&r.length)for(const h of r)try{const w=re(String(h??""));w&&l.push(w)}catch{}}catch{}if(Array.isArray(ht)&&ht.length){const h=new Set(l);for(const w of ht)h.has(w)||(l.push(w),h.add(w))}if(!l.length){if(be&&typeof be.size=="number"&&be.size)try{l=Array.from(be.keys())}catch{l=[]}else for(const h of te.values())if(h){if(typeof h=="string")l.push(h);else if(h&&typeof h=="object"){h.default&&l.push(h.default);const w=h.langs||{};for(const b of Object.keys(w||{}))try{w[b]&&l.push(w[b])}catch{}}}}try{const h=await Qo(e);h&&h.length&&(l=l.concat(h))}catch(h){ge("[slugManager] crawlAllMarkdown during buildSearchIndex failed",h)}try{const h=new Set(l),w=[...l],b=Math.max(1,Math.min(Ir(),w.length||Ir()));let S=0;const A=async()=>{for(;!(h.size>Qr);){const U=w.shift();if(!U)break;try{const W=await Ke(U,e);if(W&&W.raw){if(W.status===404)continue;let Y=W.raw;const ae=[],he=String(U??"").replace(/^.*\//,"");if(/^readme(?:\.md)?$/i.test(he)&&Qs&&(!U||!U.includes("/")))continue;const ie=eu(Y),R=/\[[^\]]+\]\(([^)]+)\)/g;let N;for(;N=R.exec(ie);)ae.push(N[1]);const M=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;N=M.exec(ie);)ae.push(N[1]);const T=U&&U.includes("/")?U.substring(0,U.lastIndexOf("/")+1):"";for(let I of ae)try{if(Yr(I,e)||I.startsWith("..")||I.indexOf("/../")!==-1||(T&&!I.startsWith("./")&&!I.startsWith("/")&&!I.startsWith("../")&&(I=T+I),I=re(I),!I||I.startsWith("#")||I.startsWith("?")))continue;if(!/\.(md|html?)(?:$|[?#])/i.test(I)){const Q=I.split(/[?#]/)[0].replace(/\/+$/,""),q=String(Q).split("/").pop()||"";if(/\.[^./]+$/i.test(q))continue;const ne=[`${Q}.md`,`${Q}.html`,`${Q}/README.md`,`${Q}/README.html`];for(const le of ne)!le||a(le)||h.has(le)||(h.add(le),w.push(le),l.push(le));continue}if(I=I.split(/[?#]/)[0],a(I))continue;h.has(I)||(h.add(I),w.push(I),l.push(I))}catch(Q){ge("[slugManager] href processing failed",I,Q)}}}catch(W){ge("[slugManager] discovery fetch failed for",U,W)}try{S++,await Sn(S,32)}catch{}}},z=[];for(let U=0;U<b;U++)z.push(A());await Promise.all(z)}catch(h){ge("[slugManager] discovery loop failed",h)}const c=new Set;l=l.filter(h=>!h||c.has(h)||a(h)?!1:(c.add(h),!0));const u=[],d=new Map,f=l.filter(h=>/\.(?:md|html?)(?:$|[?#])/i.test(h)),g=Math.max(1,Math.min(Ir(),f.length||1)),m=f.slice(),p=[];for(let h=0;h<g;h++)p.push((async()=>{for(;m.length;){const w=m.shift();if(!w)break;try{const b=await Ke(w,e);d.set(w,b)}catch(b){ge("[slugManager] buildSearchIndex: entry fetch failed",w,b),d.set(w,null)}}})());await Promise.all(p);let y=0;for(const h of l){try{y++,await Sn(y,16)}catch{}if(/\.(?:md|html?)(?:$|[?#])/i.test(h))try{const w=d.get(h);if(!w||!w.raw||w.status===404)continue;let b="",S="",A=null,z=null;if(w.isHtml)try{const W=st(),Y=W?W.parseFromString(w.raw,"text/html"):null,ae=Y?Y.querySelector("title")||Y.querySelector("h1"):null;ae&&ae.textContent&&(b=ae.textContent.trim());const he=Y?Y.querySelector("p"):null;if(he&&he.textContent&&(S=he.textContent.trim()),t>=2)try{const ie=Y?Y.querySelector("h1"):null,R=ie&&ie.textContent?ie.textContent.trim():b||"";try{const M=be?.has?.(h)?be?.get?.(h):null;if(M)A=M;else{let T=Se(b||h);const I=new Set;try{for(const q of te.keys())I.add(q)}catch{}try{for(const q of u)q&&q.slug&&I.add(String(q.slug).split("::")[0])}catch{}let Q=!1;try{if(te.has(T)){const q=te.get(T);if(typeof q=="string")q===h&&(Q=!0);else if(q&&typeof q=="object"){q.default===h&&(Q=!0);for(const ne of Object.keys(q.langs||{}))if(q.langs[ne]===h){Q=!0;break}}}}catch{}!Q&&I.has(T)&&(T=En(T,I)),A=T;try{be?.has?.(h)||St(A,h)}catch{}}}catch(M){ge("[slugManager] derive pageSlug failed",M)}const N=Array.from(Y.querySelectorAll("h2"));for(const M of N)try{const T=(M.textContent||"").trim();if(!T)continue;const I=M.id?M.id:Se(T),Q=A?`${A}::${I}`:`${Se(h)}::${I}`;let q="",ne=M.nextElementSibling;for(;ne&&ne.tagName&&ne.tagName.toLowerCase()==="script";)ne=ne.nextElementSibling;ne&&ne.textContent&&(q=String(ne.textContent).trim()),u.push({slug:Q,title:T,excerpt:q,path:h,parentTitle:R})}catch(T){ge("[slugManager] indexing H2 failed",T)}if(t===3)try{const M=Array.from(Y.querySelectorAll("h3"));for(const T of M)try{const I=(T.textContent||"").trim();if(!I)continue;const Q=T.id?T.id:Se(I),q=A?`${A}::${Q}`:`${Se(h)}::${Q}`;let ne="",le=T.nextElementSibling;for(;le&&le.tagName&&le.tagName.toLowerCase()==="script";)le=le.nextElementSibling;le&&le.textContent&&(ne=String(le.textContent).trim()),u.push({slug:q,title:I,excerpt:ne,path:h,parentTitle:R})}catch(I){ge("[slugManager] indexing H3 failed",I)}}catch(M){ge("[slugManager] collect H3s failed",M)}}catch(ie){ge("[slugManager] collect H2s failed",ie)}}catch(W){ge("[slugManager] parsing HTML for index failed",W)}else{const W=w.raw,Y=W.match(/^#\s+(.+)$/m);b=Y?Y[1].trim():"";try{b=xi(b)}catch{}const ae=W.split(/\r?\n\s*\r?\n/);if(ae.length>1)for(let he=1;he<ae.length;he++){const ie=ae[he].trim();if(ie&&!/^#/.test(ie)){S=ie.replace(/\r?\n/g," ");break}}try{const{data:he}=tr(W),ie=he.image||he.og_image||he.cover||he.featured_image;ie&&String(ie).trim()&&(z=String(ie).trim())}catch{}if(t>=2){let he="";try{const ie=(W.match(/^#\s+(.+)$/m)||[])[1];he=ie?ie.trim():"";try{const M=be?.has?.(h)?be?.get?.(h):null;if(M)A=M;else{let T=Se(b||h);const I=new Set;try{for(const q of te.keys())I.add(q)}catch{}try{for(const q of u)q&&q.slug&&I.add(String(q.slug).split("::")[0])}catch{}let Q=!1;try{if(te.has(T)){const q=te.get(T);if(typeof q=="string")q===h&&(Q=!0);else if(q&&typeof q=="object"){q.default===h&&(Q=!0);for(const ne of Object.keys(q.langs||{}))if(q.langs[ne]===h){Q=!0;break}}}}catch{}!Q&&I.has(T)&&(T=En(T,I)),A=T;try{be?.has?.(h)||St(A,h)}catch{}}}catch(M){ge("[slugManager] derive pageSlug failed",M)}const R=/^##\s+(.+)$/gm;let N;for(;N=R.exec(W);)try{const M=(N[1]||"").trim(),T=xi(M);if(!M)continue;const I=Se(M),Q=A?`${A}::${I}`:`${Se(h)}::${I}`,q=W.slice(R.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),ne=q&&q[1]?String(q[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";u.push({slug:Q,title:T,excerpt:ne,path:h,parentTitle:he})}catch(M){ge("[slugManager] indexing markdown H2 failed",M)}}catch(ie){ge("[slugManager] collect markdown H2s failed",ie)}if(t===3)try{const ie=/^###\s+(.+)$/gm;let R;for(;R=ie.exec(W);)try{const N=(R[1]||"").trim(),M=xi(N);if(!N)continue;const T=Se(N),I=A?`${A}::${T}`:`${Se(h)}::${T}`,Q=W.slice(ie.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),q=Q&&Q[1]?String(Q[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";u.push({slug:I,title:M,excerpt:q,path:h,parentTitle:he})}catch(N){ge("[slugManager] indexing markdown H3 failed",N)}}catch(ie){ge("[slugManager] collect markdown H3s failed",ie)}}}let U="";try{be?.has?.(h)&&(U=be?.get?.(h))}catch(W){ge("[slugManager] mdToSlug access failed",W)}if(!U){try{if(!A){const W=be?.has?.(h)?be?.get?.(h):null;if(W)A=W;else{let Y=Se(b||h);const ae=new Set;try{for(const ie of te.keys())ae.add(ie)}catch{}try{for(const ie of u)ie&&ie.slug&&ae.add(String(ie.slug).split("::")[0])}catch{}let he=!1;try{if(te.has(Y)){const ie=te.get(Y);if(typeof ie=="string")ie===h&&(he=!0);else if(ie&&typeof ie=="object"){ie.default===h&&(he=!0);for(const R of Object.keys(ie.langs||{}))if(ie.langs[R]===h){he=!0;break}}}}catch{}!he&&ae.has(Y)&&(Y=En(Y,ae)),A=Y;try{be?.has?.(h)||St(A,h)}catch{}}}}catch(W){ge("[slugManager] derive pageSlug failed",W)}U=A||Se(b||h)}u.push({slug:U,title:b,excerpt:S,path:h,image:z})}catch(w){ge("[slugManager] buildSearchIndex: entry processing failed",w)}}try{const h=u.filter(w=>{try{return!a(String(w.path??""))}catch{return!0}});try{Array.isArray(oe)||(oe=[]),oe.length=0;for(const w of h)oe.push(w)}catch{try{oe=Array.from(h)}catch{oe=h}}try{if(typeof window<"u"){try{window.__nimbiResolvedIndex=oe}catch{}try{const w=[],b=new Set;for(const S of oe)try{if(!S||!S.slug)continue;const A=String(S.slug).split("::")[0];if(b.has(A))continue;b.add(A);const z={slug:A};S.title?z.title=String(S.title):S.parentTitle&&(z.title=String(S.parentTitle)),S.path&&(z.path=String(S.path)),w.push(z)}catch{}try{window.__nimbiSitemapJson={generatedAt:new Date().toISOString(),entries:w}}catch{}try{window.__nimbiSitemapFinal=w}catch{}}catch{}}}catch{}}catch(h){ge("[slugManager] filtering index by excludes failed",h);try{Array.isArray(oe)||(oe=[]),oe.length=0;for(const w of u)oe.push(w)}catch{try{oe=Array.from(u)}catch{oe=u}}try{if(typeof window<"u")try{window.__nimbiResolvedIndex=oe}catch{}}catch{}}return oe})();try{await vn}catch(s){ge("[slugManager] awaiting _indexPromise failed",s)}return vn=null,oe}async function xn(e={}){try{const t=typeof e.timeoutMs=="number"?e.timeoutMs:8e3,n=e.contentBase,r=typeof e.indexDepth=="number"?e.indexDepth:1,i=Array.isArray(e.noIndexing)?e.noIndexing:void 0,s=Array.isArray(e.seedPaths)?e.seedPaths:void 0,o=typeof e.startBuild=="boolean"?e.startBuild:!0;if(Array.isArray(oe)&&oe.length&&!vn&&!o)return oe;if(vn){try{await vn}catch{}return oe}if(o){try{if(typeof Es=="function")try{const l=await Es(n,r,i,s);if(Array.isArray(l)&&l.length){try{Cr(l)}catch{}return oe}}catch{}}catch{}try{return await Un(n,r,i,s),oe}catch{}}const a=Date.now();for(;Date.now()-a<t;){if(Array.isArray(oe)&&oe.length)return oe;await new Promise(l=>setTimeout(l,150))}return oe}catch{return oe}}async function Ms(e={}){try{const t=Object.assign({},e);typeof t.startBuild!="boolean"&&(t.startBuild=!0),typeof t.timeoutMs!="number"&&(t.timeoutMs=1/0);try{return await xn(t)}catch{return oe}}catch{return oe}}var Go=1e3,Qr=Go;function Vo(e){typeof e=="number"&&e>=0&&(Qr=e)}var Zo=st(),Xo="a[href]",Yo=async function(e,t,n=Qr){if(Ei.has(e))return Ei.get(e);let r=null;const i=new Set,s=[""],o=typeof location<"u"&&location.origin?location.origin:"http://localhost";let a=o+"/";try{t&&(/^[a-z][a-z0-9+.-]*:/i.test(String(t))?a=String(t).replace(/\/$/,"")+"/":String(t).startsWith("/")?a=o+String(t).replace(/\/$/,"")+"/":a=o+"/"+String(t).replace(/\/$/,"")+"/")}catch{a=o+"/"}const l=Math.max(1,Math.min(Hi,6));for(;s.length&&!r&&!(s.length>n);)await zo(s.splice(0,l),async c=>{if(c==null||i.has(c))return;i.add(c);let u="";try{u=new URL(c||"",a).toString()}catch{u=(String(t??"")||o)+"/"+String(c??"").replace(/^\//,"")}try{let d;try{d=await globalThis.fetch(u)}catch(y){ge("[slugManager] crawlForSlug: fetch failed",{url:u,error:y});return}if(!d||!d.ok){d&&!d.ok&&ge("[slugManager] crawlForSlug: directory fetch non-ok",{url:u,status:d.status});return}const f=await d.text(),g=Zo.parseFromString(f,"text/html");let m=[];try{g&&typeof g.getElementsByTagName=="function"?m=g.getElementsByTagName("a"):g&&typeof g.querySelectorAll=="function"?m=g.querySelectorAll(Xo):m=[]}catch{try{m=g.getElementsByTagName?g.getElementsByTagName("a"):[]}catch{m=[]}}const p=u;for(const y of m)try{if(r)break;let h=y.getAttribute("href")||"";if(!h||Yr(h,t)||h.startsWith("..")||h.indexOf("/../")!==-1)continue;if(h.endsWith("/")){try{const w=new URL(h,p),b=new URL(a).pathname,S=w.pathname.startsWith(b)?w.pathname.slice(b.length):w.pathname.replace(/^\//,""),A=Mn(re(S));i.has(A)||s.push(A)}catch{const b=re(c+h);i.has(b)||s.push(b)}continue}if(h.toLowerCase().endsWith(".md")){let w="";try{const b=new URL(h,p),S=new URL(a).pathname;w=b.pathname.startsWith(S)?b.pathname.slice(S.length):b.pathname.replace(/^\//,"")}catch{w=(c+h).replace(/^\//,"")}w=re(w);try{if(be?.has?.(w))continue;for(const b of te.values());}catch(b){ge("[slugManager] slug map access failed",b)}try{const b=await Ke(w,t);if(b&&b.raw){const S=(b.raw||"").match(/^#\s+(.+)$/m);if(S&&S[1]&&Se(S[1].trim())===e){r=w;break}}}catch(b){ge("[slugManager] crawlForSlug: fetchMarkdown failed",b)}}}catch(h){ge("[slugManager] crawlForSlug: link iteration failed",h)}}catch(d){ge("[slugManager] crawlForSlug: directory fetch failed",d)}},l);return Ei.set(e,r),r};async function Qo(e,t=Qr){const n=new Set,r=new Set,i=[""],s=typeof location<"u"&&location.origin?location.origin:"http://localhost";let o=s+"/";try{e&&(/^[a-z][a-z0-9+.-]*:/i.test(String(e))?o=String(e).replace(/\/$/,"")+"/":String(e).startsWith("/")?o=s+String(e).replace(/\/$/,"")+"/":o=s+"/"+String(e).replace(/\/$/,"")+"/")}catch{o=s+"/"}const a=Math.max(1,Math.min(Hi,6));for(;i.length&&!(i.length>t);)await zo(i.splice(0,a),async l=>{if(l==null||r.has(l))return;r.add(l);let c="";try{c=new URL(l||"",o).toString()}catch{c=(String(e??"")||s)+"/"+String(l??"").replace(/^\//,"")}try{let u;try{u=await globalThis.fetch(c)}catch(p){ge("[slugManager] crawlAllMarkdown: fetch failed",{url:c,error:p});return}if(!u||!u.ok){u&&!u.ok&&ge("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:c,status:u.status});return}const d=await u.text(),f=Zo.parseFromString(d,"text/html");let g=[];try{f&&typeof f.getElementsByTagName=="function"?g=f.getElementsByTagName("a"):f&&typeof f.querySelectorAll=="function"?g=f.querySelectorAll(Xo):g=[]}catch{try{g=f.getElementsByTagName?f.getElementsByTagName("a"):[]}catch{g=[]}}const m=c;for(const p of g)try{let y=p.getAttribute("href")||"";if(!y||Yr(y,e)||y.startsWith("..")||y.indexOf("/../")!==-1)continue;if(y.endsWith("/")){try{const w=new URL(y,m),b=new URL(o).pathname,S=w.pathname.startsWith(b)?w.pathname.slice(b.length):w.pathname.replace(/^\//,""),A=Mn(re(S));r.has(A)||i.push(A)}catch{const b=l+y;r.has(b)||i.push(b)}continue}let h="";try{const w=new URL(y,m),b=new URL(o).pathname;h=w.pathname.startsWith(b)?w.pathname.slice(b.length):w.pathname.replace(/^\//,"")}catch{h=(l+y).replace(/^\//,"")}if(h=re(h),/\.(md|html?)$/i.test(h))n.add(h);else{const w=h.split(/[?#]/)[0].replace(/\/+$/,""),b=String(w).split("/").pop()||"";if(/\.[^./]+$/i.test(b))continue;w&&(n.add(`${w}.md`),n.add(`${w}.html`),n.add(`${w}/README.md`),n.add(`${w}/README.html`))}}catch(y){ge("[slugManager] crawlAllMarkdown: link iteration failed",y)}}catch(u){ge("[slugManager] crawlAllMarkdown: directory fetch failed",u)}},a);return Array.from(n)}async function Ko(e,t,n){if(e&&typeof e=="string"&&(e=re(e),e=Wn(e)),te.has(e))return ir(e)||te.get(e);try{if(!(typeof ke=="string"&&ke||te.has(e)||Qe&&Qe.size||Si()||typeof t=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(t)))return null}catch{}for(const i of Vi)try{const s=await i(e,t);if(s)return St(e,s),s}catch(s){ge("[slugManager] slug resolver failed",s)}if(Qe&&Qe.size){for(const i of ht)try{const s=String(i??"").replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(s&&Se(s)===e)return St(e,i),i}catch(s){ge("[slugManager] filename fast-path match failed",s)}if(Nr.has(e)){const i=Nr.get(e);return St(e,i),i}for(const i of ht)if(!Ii.has(i))try{const s=await Ke(i,t);if(s&&s.raw){const o=(s.raw||"").match(/^#\s+(.+)$/m);if(o&&o[1]){const a=Se(o[1].trim());if(Ii.add(i),a&&Nr.set(a,i),a===e)return St(e,i),i}}}catch(s){ge("[slugManager] manifest title fetch failed",s)}try{Ca++,await Sn(Ca,8)}catch{}}const r=[`${e}.html`,`${e}.md`];for(const i of r)try{const s=await Ke(i,t);if(s&&s.raw)return St(e,i),i}catch(s){ge("[slugManager] candidate fetch failed",s)}try{const i=await Un(t);if(i&&i.length){const s=i.find(o=>o.slug===e);if(s)return St(e,s.path),s.path}}catch(i){ge("[slugManager] buildSearchIndex lookup failed",i)}try{const i=await Yo(e,t,n);if(i)return St(e,i),i}catch(i){ge("[slugManager] crawlForSlug lookup failed",i)}if(Qe&&Qe.size)for(const i of ht)try{const s=i.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(Se(s)===e)return St(e,i),i}catch(s){ge("[slugManager] build-time filename match failed",s)}try{if(Et&&typeof Et=="string"&&Et.trim())try{const i=await Ke(Et,t);if(i&&i.raw){const s=(i.raw||"").match(/^#\s+(.+)$/m);if(s&&s[1]&&Se(s[1].trim())===e)return St(e,Et),Et}}catch(i){ge("[slugManager] home page fetch failed",i)}}catch(i){ge("[slugManager] home page fetch failed",i)}return null}var nu=_.__commonJSMin(((e,t)=>{function n(a,l){return l.some(([c,u])=>c<=a&&a<=u)}function r(a){return typeof a!="string"?!1:n(a.charCodeAt(0),[[12352,12447],[19968,40959],[44032,55203],[131072,191456]])}function i(a){return` 
\r	`.includes(a)}function s(a){return typeof a!="string"?!1:n(a.charCodeAt(0),[[33,47],[58,64],[91,96],[123,126],[12288,12351],[65280,65519]])}function o(a,l={}){let c=0,u=0,d=a.length-1;const f=l.wordsPerMinute||200,g=l.wordBound||i;for(;g(a[u]);)u++;for(;g(a[d]);)d--;const m=`${a}
`;for(let h=u;h<=d;h++)if((r(m[h])||!g(m[h])&&(g(m[h+1])||r(m[h+1])))&&c++,r(m[h]))for(;h<=d&&(s(m[h+1])||g(m[h+1]));)h++;const p=c/f,y=Math.round(p*60*1e3);return{text:Math.ceil(p.toFixed(2))+" min read",minutes:p,time:y,words:c}}t.exports=o})),ru=_.__toESM(nu(),1),Er=new Map,iu=200;function su(e){const t=String(e??"");let n=0;for(let r=0;r<t.length;r++){const i=t.charCodeAt(r);n=(n<<5)-n+i|0}return`${t.length}:${n}`}function au(e,t){if(Er.set(e,t),Er.size>iu){const n=Er.keys().next().value;n&&Er.delete(n)}}function ou(e){return e?String(e).trim().split(/\s+/).filter(Boolean).length:0}function lu(e){const t=su(e),n=Er.get(t);if(n)return Object.assign({},n);const r=(0,ru.default)(e||""),i={readingTime:r,wordCount:typeof r.words=="number"?r.words:ou(e)};return au(t,i),Object.assign({},i)}function Wr(e,t){const n=typeof CSS<"u"&&CSS.escape?CSS.escape(String(e)):String(e);let r=document.querySelector(`meta[name="${n}"]`);r||(r=document.createElement("meta"),r.setAttribute("name",e),document.head.appendChild(r)),r.setAttribute("content",t)}function cu(){try{if(typeof document>"u"||!document.head)return;try{if(!document.querySelector("meta[charset]")){const e=document.createElement("meta");e.setAttribute("charset","utf-8"),document.head.prepend(e)}}catch{}try{if(!document.querySelector('meta[name="viewport"]')){const e=document.createElement("meta");e.setAttribute("name","viewport"),e.setAttribute("content","width=device-width, initial-scale=1"),document.head.appendChild(e)}}catch{}}catch{}}function mt(e,t,n){let r=`meta[${e}="${typeof CSS<"u"&&CSS.escape?CSS.escape(String(t)):String(t)}"]`,i=document.querySelector(r);i||(i=document.createElement("meta"),i.setAttribute(e,t),document.head.appendChild(i)),i.setAttribute("content",n)}function Jo(e,t){try{if(!e)return;const n=typeof CSS<"u"&&CSS.escape?CSS.escape(String(e)):String(e);let r=document.querySelector(`link[rel="${n}"]`);r||(r=document.createElement("link"),r.setAttribute("rel",e),document.head.appendChild(r)),r.setAttribute("href",t)}catch(n){k("[seoManager] upsertLinkRel failed",n)}}function el(e){try{if(typeof document>"u"||!document.head)return;const t=Ks();if(!Array.isArray(t)||t.length===0)return;try{const n=typeof location<"u"&&location?.origin?location.origin+location.pathname.split("?")[0]:"";if(!n)return;const r=e||"",i=r?`${n}?page=${encodeURIComponent(r)}`:n;try{document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(s=>s.remove())}catch{}for(const s of t)try{const o=`${i}&lang=${encodeURIComponent(String(s))}`,a=document.createElement("link");a.setAttribute("rel","alternate"),a.setAttribute("hreflang",String(s)),a.setAttribute("href",o),document.head.appendChild(a)}catch{}try{const s=document.createElement("link");s.setAttribute("rel","alternate"),s.setAttribute("hreflang","x-default"),s.setAttribute("href",i),document.head.appendChild(s)}catch{}}catch(n){k("[seoManager] setHreflangTags failed",n)}}catch(t){k("[seoManager] setHreflangTags failed",t)}}function uu(e,t,n,r,i){mt("property","og:title",t&&String(t).trim()?t:e.title||document.title);const s=r&&String(r).trim()?r:e.description||"";s&&String(s).trim()&&mt("property","og:description",s),s&&String(s).trim()&&mt("name","twitter:description",s),mt("name","twitter:card",e.twitter_card||"summary_large_image");const o=n||e.image;o&&(mt("property","og:image",o),mt("name","twitter:image",o),e.image_width&&mt("property","og:image:width",String(e.image_width)),e.image_height&&mt("property","og:image:height",String(e.image_height))),mt("property","og:type",i||e.og_type||(e.type==="Article"?"article":"website"));try{const a=typeof navigator<"u"&&(navigator.language||navigator.languages?.[0])||"en";mt("property","og:locale",String(a).replace("-","_").toLowerCase());const l=Ks();if(Array.isArray(l)&&l.length>0)for(const c of l)try{mt("property","og:locale:alternate",String(c).replace("-","_").toLowerCase())}catch{}}catch{}if(e.date)try{const a=new Date(e.date);isNaN(a.getTime())||mt("property","article:published_time",a.toISOString())}catch{}if(e.dateModified)try{const a=new Date(e.dateModified);isNaN(a.getTime())||mt("property","article:modified_time",a.toISOString())}catch{}e.twitter_site&&mt("name","twitter:site",String(e.twitter_site)),e.twitter_creator&&mt("name","twitter:creator",String(e.twitter_creator))}function ea(e,t,n,r,i=""){const s=e.meta||{},o=document?.querySelector&&document.querySelector('meta[name="description"]')?.getAttribute("content")||"",a=r&&String(r).trim()?r:s.description&&String(s.description).trim()?s.description:o&&String(o).trim()?o:"";a&&String(a).trim()&&Wr("description",a),Wr("robots",s.robots||"index,follow"),uu(s,t,n,a,s.type),el(e.slug||e.meta?.slug||"")}function tl(){try{for(const e of['meta[name="site"]','meta[name="site-name"]','meta[name="siteName"]','meta[property="og:site_name"]','meta[name="twitter:site"]']){const t=document.querySelector(e);if(t){const n=t.getAttribute("content")||"";if(n?.trim())return n.trim()}}}catch(e){k("[seoManager] getSiteNameFromMeta failed",e)}return""}function ta(e,t,n,r,i,s=""){try{let f=function(w){try{const b=re(w);try{return(location.origin+location.pathname).split("?")[0]+"?page="+encodeURIComponent(b)}catch{return location.href.split("#")[0]}}catch{return location.href.split("#")[0]}},m=function(w,b){try{const S=String(b?.type||"").trim();if(S)return S;const A=String(w||"").replace(/^\/+|\/+$/g,"").toLowerCase();if(!A||A==="index"||A==="home")return"WebPage";const z=A.split("/"),U=z[0]||"",W=z[z.length-1]||"",Y={about:"AboutPage",contact:"ContactPage",blog:"Blog",posts:"Blog",article:"Article",articles:"Article",news:"NewsArticle",product:"Product",products:"Product",event:"Event",events:"Event",person:"ProfilePage",people:"ProfilePage",author:"ProfilePage",authors:"ProfilePage",search:"SearchResultsPage",faq:"FAQPage",faqs:"FAQPage",help:"WebPage",support:"WebPage",docs:"TechArticle",documentation:"TechArticle",tutorial:"TechArticle",howto:"HowTo","how-to":"HowTo",recipe:"Recipe",recipes:"Recipe",review:"Review",reviews:"Review",video:"VideoObject",videos:"VideoObject",audio:"AudioObject",podcast:"PodcastEpisode"};return z.length===1&&Y[U]?Y[U]:Y[W]?Y[W]:"Article"}catch{return"Article"}};var o=f,a=m;const l=e.meta||{},c=n&&String(n).trim()?n:l.title||s||document.title,u=i&&String(i).trim()?i:l.description||document.querySelector('meta[name="description"]')?.getAttribute("content")||"",d=r||l.image||null,g=f(t);g&&Jo("canonical",g);try{mt("property","og:url",g)}catch(w){k("[seoManager] upsertMeta og:url failed",w)}const p={"@context":"https://schema.org","@type":m(t,l),headline:c||"",description:u||"",url:g||location.href.split("#")[0]};d&&(p.image=String(d)),l.date&&(p.datePublished=l.date),l.dateModified&&(p.dateModified=l.dateModified),l.author&&(p.author={"@type":"Person",name:String(l.author)});try{const w=tl();w&&(p.publisher={"@type":"Organization",name:w})}catch{}g&&(p.mainEntityOfPage={"@type":"WebPage","@id":g});const y="nimbi-jsonld";let h=document.getElementById(y);h||(h=document.createElement("script"),h.type="application/ld+json",h.id=y,Vs(h),document.head.appendChild(h)),h.textContent=JSON.stringify(p,null,2).replace(/<\/script>/gi,"<\\/script>")}catch(l){k("[seoManager] setStructuredData failed",l)}}var Oi=typeof window<"u"&&window.__SEO_MAP?window.__SEO_MAP:{};function hu(e){try{if(!e||typeof e!="object"){Oi={};return}Oi=Object.assign({},e)}catch(t){k("[seoManager] setSeoMap failed",t)}}function fu(e,t=""){try{if(!e)return;const n=Oi?.[e]?Oi[e]:typeof window<"u"&&window.__SEO_MAP?.[e]?window.__SEO_MAP[e]:null;try{const r=location.origin+location.pathname+"?page="+encodeURIComponent(String(e??""));Jo("canonical",r);try{mt("property","og:url",r)}catch{}}catch{}if(!n)return;try{n.title&&(document.title=String(n.title))}catch{}try{n.description&&Wr("description",String(n.description))}catch{}try{try{ea({meta:n,slug:e},n.title||void 0,n.image||void 0,n.description||void 0,t)}catch{}}catch{}try{el(e)}catch{}try{ta({meta:n},e,n.title||void 0,n.image||void 0,n.description||void 0,t)}catch(r){k("[seoManager] inject structured data failed",r)}}catch(n){k("[seoManager] injectSeoForPage failed",n)}}function Ai(e={},t="",n=void 0,r=void 0){try{const i=e||{},s=typeof n=="string"&&n.trim()?n:i.title||"Not Found",o=typeof r=="string"&&r.trim()?r:i.description||"";try{Wr("robots","noindex,follow")}catch{}try{o&&String(o).trim()&&Wr("description",String(o))}catch{}try{ea({meta:Object.assign({},i,{robots:"noindex,follow"})},s,i.image||void 0,o)}catch{}try{ta({meta:Object.assign({},i,{title:s,description:o})},t||"",s,i.image||void 0,o)}catch{}}catch(i){k("[seoManager] markNotFound failed",i)}}function du(e,t,n,r,i,s,o,a,l,c,u){try{if(r?.querySelector){const d=r.querySelector(".menu-label");d&&(d.textContent=a?.textContent||e("onThisPage"))}}catch(d){k("[seoManager] update toc label failed",d)}try{const d=n.meta?.title?String(n.meta.title).trim():"",f=i?.querySelector?.("img")||null,g=f&&(f.getAttribute("src")||f.src)||null;let m="";try{let h="";try{const w=a||i?.querySelector?.("h1")||null;if(w){let b=w.nextElementSibling;const S=[];for(;b&&!(b.tagName&&b.tagName.toLowerCase()==="h2");){try{if(b.classList?.contains("nimbi-article-subtitle")){b=b.nextElementSibling;continue}}catch{}const A=(b.textContent||"").trim();A&&S.push(A),b=b.nextElementSibling}S.length&&(h=S.join(" ").replace(/\s+/g," ").trim()),!h&&l&&(h=String(l).trim())}}catch(w){k("[seoManager] compute descOverride failed",w)}h&&String(h).length>160&&(h=String(h).slice(0,157).trim()+"..."),m=h}catch(h){k("[seoManager] compute descOverride failed",h)}let p="";try{d&&(p=d)}catch{}if(!p)try{a?.textContent&&(p=String(a.textContent).trim())}catch{}if(!p)try{const h=i.querySelector("h2");h?.textContent&&(p=String(h.textContent).trim())}catch{}p||(p=s||"");try{ea(n,p||void 0,g,m)}catch(h){k("[seoManager] setMetaTags failed",h)}try{ta(n,c,p||void 0,g,m,t)}catch(h){k("[seoManager] setStructuredData failed",h)}const y=tl();p?y?document.title=`${y} - ${p}`:document.title=`${t||"Site"} - ${p}`:d?document.title=d:document.title=t||document.title}catch(d){k("[seoManager] applyPageMeta failed",d)}try{try{i.querySelectorAll(".nimbi-reading-time")?.forEach(d=>d.remove())}catch{}if(l){const d=lu(u?.raw||""),f=d?.readingTime?d.readingTime:null,g=typeof f?.minutes=="number"?Math.ceil(f.minutes):0,m=g?e("readingTime",{minutes:g}):"";if(!m)return;const p=i.querySelector("h1");if(p){const y=i.querySelector(".nimbi-article-subtitle");try{if(y){const h=document.createElement("span");h.className="nimbi-reading-time",h.textContent=m,y.appendChild(h)}else{const h=document.createElement("p");h.className="nimbi-article-subtitle is-6 has-text-grey-light";const w=document.createElement("span");w.className="nimbi-reading-time",w.textContent=m,h.appendChild(w);try{p.parentElement.insertBefore(h,p.nextSibling)}catch{try{p.insertAdjacentElement("afterend",h)}catch{}}}}catch{try{const w=document.createElement("p");w.className="nimbi-article-subtitle is-6 has-text-grey-light";const b=document.createElement("span");b.className="nimbi-reading-time",b.textContent=m,w.appendChild(b),p.insertAdjacentElement("afterend",w)}catch{}}}}}catch(d){k("[seoManager] reading time update failed",d)}}var zi=100;function Na(e){zi=e,il()}function Rt(){try{if(So(2))return!0}catch{}try{return!1}catch{return!1}}var $t=3e5,gu=6e4,yr=null,br=null;function Ct(e,t,n){try{if(typeof Ke=="function"&&typeof Ke.length=="number"&&Ke.length>=3)return Ke(e,t,{signal:n})}catch{}return Ke(e,t)}function Ia(e){$t=e;try{Ut.defaultTTL=$t>0?$t:1/0}catch{}nl()}function nl(){try{yr!==null&&(clearInterval(yr),yr=null)}catch{}if($t>0)try{yr=setInterval(_u,gu)}catch{yr=null}}var Ut=new Zr({maxEntries:zi,defaultTTL:$t>0?$t:1/0});nl();function rl(e){return!!e&&typeof e=="object"&&Object.prototype.hasOwnProperty.call(e,"value")&&Object.prototype.hasOwnProperty.call(e,"ts")}function il(){try{Ut.maxEntries=zi}catch{}for(;Ut.size>zi;){const e=Ut.keys("LRU").next().value;if(e===void 0)break;Ut.delete(e)}}function pu(e){const t=Ut.get(e);if(t!==void 0){if(rl(t)){const n=Date.now();if($t>0&&t.ts+$t<n){Ut.delete(e);return}return t.value}return t}}function mu(e,t){Ut.set(e,t,{ttl:$t>0?$t:1/0}),il()}function _u(){if(!$t||$t<=0)return;const e=Date.now(),t=Array.from(Ut.keys("LRU"));for(const n of t){Ut.has(n);const r=Ut.peek(n);rl(r)&&r.ts+$t<e&&Ut.delete(n)}}async function yu(e,t,n){const r=new Set(vt);let i=[];try{if(typeof document<"u"&&document.getElementsByClassName){const s=o=>{const a=document.getElementsByClassName(o);for(let l=0;l<a.length;l++){const c=a[l].getElementsByTagName("a");for(let u=0;u<c.length;u++)i.push(c[u])}};s("nimbi-site-navbar"),s("navbar"),s("nimbi-nav")}else i=Array.from(document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a"))}catch{try{i=Array.from(document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a"))}catch{i=[]}}for(const s of Array.from(i||[])){const o=s.getAttribute("href")||"";if(o)try{try{const f=_t(o);if(f){if(f.type==="canonical"&&f.page){const g=re(f.page);if(g){r.add(g);continue}}if(f.type==="cosmetic"&&f.page){const g=f.page;if(te.has(g)){const m=te.get(g);if(m)return m}continue}}}catch{}const a=new URL(o,location.href);if(a.origin!==location.origin)continue;const l=(a.hash||a.pathname).match(/([^#?]+\.md)(?:$|[?#])/)||(a.pathname||"").match(/([^#?]+\.md)(?:$|[?#])/);if(l){let f=re(l[1]);f&&r.add(f);continue}const c=(s.textContent||"").trim(),u=(a.pathname||"").replace(/^.*\//,"");if(c&&Se(c)===e||u&&Se(u.replace(/\.(html?|md)$/i,""))===e)return a.toString();if(/\.(html?)$/i.test(a.pathname)){let f=a.pathname.replace(/^\//,"");r.add(f);continue}const d=a.pathname||"";if(d){const f=new URL(t),g=Mn(f.pathname);if(d.indexOf(g)!==-1){let m=d.startsWith(g)?d.slice(g.length):d;m=re(m),m&&r.add(m)}}}catch(a){k("[router] malformed URL while discovering index candidates",a)}}for(const s of r)try{if(!s||!String(s).includes(".md"))continue;const o=await Ct(s,t,n);if(!o||!o.raw)continue;const a=(o.raw||"").match(/^#\s+(.+)$/m);if(a){const l=(a[1]||"").trim();if(l&&Se(l)===e)return s}}catch(o){k("[router] fetchMarkdown during index discovery failed",o)}return null}function bu(e){const t=[];if(String(e).includes(".md")||String(e).includes(".html"))/index\.html$/i.test(e)||t.push(e);else try{const n=decodeURIComponent(String(e??""));if(te.has(n)){const r=ir(n)||te.get(n);r&&(/\.(md|html?)$/i.test(r)?/index\.html$/i.test(r)||t.push(r):(t.push(r),t.push(r+".html")))}else{if(vt&&vt.size)for(const r of vt){const i=r.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(Se(i)===n&&!/index\.html$/i.test(r)){t.push(r);break}}!t.length&&n&&!/\.(md|html?)$/i.test(n)&&(t.push(n+".html"),t.push(n+".md"))}}catch(n){k("[router] buildPageCandidates failed during slug handling",n)}return t}async function wu(e,t){const n=e||"";try{try{ko("fetchPageData")}catch{}}catch{}try{if(br&&typeof br.abort=="function")try{br.abort()}catch{}}catch{}br=typeof AbortController<"u"?new AbortController:null;const r=br;let i=null;try{const h=_t(typeof location<"u"?location.href:"");h?.anchor&&(i=h.anchor)}catch{try{i=location?.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null}catch{i=null}}let s=e||"";try{(!s||String(s).trim()==="")&&typeof Et=="string"&&Et&&(s=String(Et))}catch{}let o=null,a=null;const l=String(n??"").includes(".md")||String(n??"").includes(".html");if(s&&String(s).includes("::")){const h=String(s).split("::",2);s=h[0],o=h[1]||null}const c=`${e}|||${typeof mc<"u"&&qt?qt:""}`,u=pu(c);if(u)s=u.resolved,o=u.anchor||o;else{if(!String(s).includes(".md")&&!String(s).includes(".html")){let h=decodeURIComponent(String(s??""));if(h&&typeof h=="string"&&(h=re(h),h=Wn(h)),te.has(h))s=ir(h)||te.get(h);else{let w=await yu(h,t,r?r.signal:void 0);if(w)s=w;else if(Si()&&vt&&vt.size||typeof t=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(t)){const b=await Ko(h,t);b&&(s=b)}}}mu(c,{resolved:s,anchor:o})}let d=!0;try{const h=String(s??"").includes(".md")||String(s??"").includes(".html")||s&&(s.startsWith("http://")||s.startsWith("https://")||s.startsWith("/"));d=typeof ke=="string"&&ke||te.has(s)||vt&&vt.size||Si()||l||h}catch{d=!0}!o&&i&&(o=i);try{if(d&&s&&(s.startsWith("http://")||s.startsWith("https://")||s.startsWith("/"))){const h=s.startsWith("/")?new URL(s,location.origin).toString():s;try{const w=await fetch(h,r?{signal:r.signal}:void 0);if(w&&w.ok){const b=await w.text(),S=typeof w?.headers?.get=="function"&&w.headers.get("content-type")||"",A=(b||"").toLowerCase();if(S&&S.indexOf&&S.indexOf("text/html")!==-1||A.indexOf("<!doctype")!==-1||A.indexOf("<html")!==-1){if(!l)try{let z=h;try{z=new URL(h).pathname.replace(/^\//,"")}catch{z=String(h??"").replace(/^\//,"")}const U=z.replace(/\.html$/i,".md");try{const W=await Ct(U,t,r?r.signal:void 0);if(W?.raw)return{data:W,pagePath:U,anchor:o}}catch{}if(typeof ke=="string"&&ke)try{const W=await Ct(ke,t,r?r.signal:void 0);if(W&&W.raw){try{Ai(W.meta||{},ke)}catch{}return{data:W,pagePath:ke,anchor:o}}}catch{}try{a=new Error("site shell detected (absolute fetch)")}catch{}}catch{}if(A.indexOf('<div id="app"')!==-1||A.indexOf("nimbi-cms")!==-1||A.indexOf("nimbi-mount")!==-1||A.indexOf("nimbi-")!==-1||A.indexOf("initcms(")!==-1||A.indexOf("window.nimbi")!==-1||/\bnimbi\b/.test(A))try{let z=h;try{z=new URL(h).pathname.replace(/^\//,"")}catch{z=String(h??"").replace(/^\//,"")}const U=z.replace(/\.html$/i,".md");try{const W=await Ct(U,t,r?r.signal:void 0);if(W?.raw)return{data:W,pagePath:U,anchor:o}}catch{}if(typeof ke=="string"&&ke)try{const W=await Ct(ke,t,r?r.signal:void 0);if(W&&W.raw){try{Ai(W.meta||{},ke)}catch{}return{data:W,pagePath:ke,anchor:o}}}catch{}try{a=new Error("site shell detected (absolute fetch)")}catch{}}catch{}}}}catch{}}}catch{}const f=bu(s);try{if(Rt())try{ge("[router-debug] fetchPageData candidates",{originalRaw:n,resolved:s,pageCandidates:f})}catch{}}catch{}const g=String(n??"").includes(".md")||String(n??"").includes(".html");let m=null;if(!g)try{let h=decodeURIComponent(String(n??""));h=re(h),h=Wn(h),h&&!/\.(md|html?)$/i.test(h)&&(m=h)}catch{m=null}if(g&&f.length===0&&(String(s).includes(".md")||String(s).includes(".html"))&&f.push(s),f.length===0&&(String(s).includes(".md")||String(s).includes(".html"))&&f.push(s),f.length===1&&/index\.html$/i.test(f[0])&&!g&&!te.has(s)&&!te.has(decodeURIComponent(String(s??"")))&&!String(s??"").includes("/"))throw new Error("Unknown slug: index.html fallback prevented");let p=null,y=null;try{const h=String(s??"").includes(".md")||String(s??"").includes(".html")||s&&(s.startsWith("http://")||s.startsWith("https://")||s.startsWith("/"));d=typeof ke=="string"&&ke||te.has(s)||vt&&vt.size||Si()||g||h}catch{d=!0}if(!d)a=new Error("no page data");else for(const h of f)if(h)try{const w=re(h);if(p=await Ct(w,t,r?r.signal:void 0),y=w,m&&!te.has(m))try{let b="";if(p&&p.isHtml)try{const S=st();if(S){const A=S.parseFromString(p.raw||"","text/html"),z=A.querySelector("h1")||A.querySelector("title");z&&z.textContent&&(b=z.textContent.trim())}}catch{}else{const S=(p&&p.raw||"").match(/^#\s+(.+)$/m);S&&S[1]&&(b=S[1].trim())}if(b&&Se(b)!==m)try{if(/\.html$/i.test(w)){const S=w.replace(/\.html$/i,".md");if(new Set(f).has(S))try{const A=await Ct(S,t,r?r.signal:void 0);if(A?.raw)p=A,y=S;else if(typeof ke=="string"&&ke)try{const z=await Ct(ke,t,r?r.signal:void 0);if(z&&z.raw)p=z,y=ke;else{p=null,y=null,a=new Error("slug mismatch for candidate");continue}}catch{p=null,y=null,a=new Error("slug mismatch for candidate");continue}else{p=null,y=null,a=new Error("slug mismatch for candidate");continue}}catch{try{const z=await Ct(ke,t,r?r.signal:void 0);if(z&&z.raw)p=z,y=ke;else{p=null,y=null,a=new Error("slug mismatch for candidate");continue}}catch{p=null,y=null,a=new Error("slug mismatch for candidate");continue}}else{p=null,y=null,a=new Error("slug mismatch for candidate");continue}}else{p=null,y=null,a=new Error("slug mismatch for candidate");continue}}catch{p=null,y=null,a=new Error("slug mismatch for candidate");continue}}catch{}try{if(!g&&/\.html$/i.test(w)){const b=w.replace(/\.html$/i,".md");if(new Set(f).has(b))try{const S=String(p&&p.raw||"").trim().slice(0,128).toLowerCase();if(p&&p.isHtml||/^(?:<!doctype|<html|<title|<h1)/i.test(S)||S.indexOf('<div id="app"')!==-1||S.indexOf("nimbi-")!==-1||S.indexOf("nimbi")!==-1||S.indexOf("initcms(")!==-1){let A=!1;try{const z=await Ct(b,t,r?r.signal:void 0);if(z?.raw)p=z,y=b,A=!0;else if(typeof ke=="string"&&ke)try{const U=await Ct(ke,t,r?r.signal:void 0);U&&U.raw&&(p=U,y=ke,A=!0)}catch{}}catch{try{const U=await Ct(ke,t,r?r.signal:void 0);U&&U.raw&&(p=U,y=ke,A=!0)}catch{}}if(!A){p=null,y=null,a=new Error("site shell detected (candidate HTML rejected)");continue}}}catch{}}}catch{}try{if(Rt())try{ge("[router-debug] fetchPageData accepted candidate",{candidate:w,pagePath:y,isHtml:p&&p.isHtml,snippet:p&&p.raw?String(p.raw).slice(0,160):null})}catch{}}catch{}break}catch(w){a=w;try{Rt()&&k("[router] candidate fetch failed",{candidate:h,contentBase:t,err:w&&w.message||w})}catch{}}if(!p){const h=a&&(a.message||String(a))||null,w=h&&/failed to fetch md|site shell detected/i.test(h);try{if(Rt())try{ge("[router-debug] fetchPageData no data",{originalRaw:n,resolved:s,pageCandidates:f,fetchError:h})}catch{}}catch{}if(w)try{if(Rt())try{k("[router] fetchPageData: no page data (expected)",{originalRaw:n,resolved:s,pageCandidates:f,contentBase:t,fetchError:h})}catch{}}catch{}else try{if(Rt())try{Pr("[router] fetchPageData: no page data for",{originalRaw:n,resolved:s,pageCandidates:f,contentBase:t,fetchError:h})}catch{}}catch{}if(typeof ke=="string"&&ke)try{const b=await Ct(ke,t,r?r.signal:void 0);if(b&&b.raw){try{Ai(b.meta||{},ke)}catch{}return{data:b,pagePath:ke,anchor:o}}}catch{}try{if(g&&String(n??"").toLowerCase().includes(".html"))try{const b=new URL(String(n??""),location.href).toString();Rt()&&k("[router] attempting absolute HTML fetch fallback",b);const S=await fetch(b,r?{signal:r.signal}:void 0);if(S&&S.ok){const A=await S.text(),z=S&&S.headers&&typeof S.headers.get=="function"&&S.headers.get("content-type")||"",U=(A||"").toLowerCase(),W=z&&z.indexOf&&z.indexOf("text/html")!==-1||U.indexOf("<!doctype")!==-1||U.indexOf("<html")!==-1;if(!W&&Rt())try{k("[router] absolute fetch returned non-HTML",()=>({abs:b,contentType:z,snippet:U.slice(0,200)}))}catch{}if(W){const Y=(A||"").toLowerCase();if(/<title>\s*index of\b/i.test(A)||/<h1>\s*index of\b/i.test(A)||Y.indexOf("parent directory")!==-1||/<title>\s*directory listing/i.test(A)||/<h1>\s*directory listing/i.test(A))try{Rt()&&k("[router] absolute fetch returned directory listing; treating as not found",{abs:b})}catch{}else try{const ae=b,he=new URL(".",ae).toString();try{const R=st();if(R){const N=R.parseFromString(A||"","text/html"),M=(q,ne)=>{try{const le=ne.getAttribute(q)||"";if(!le||/^(https?:)?\/\//i.test(le)||le.startsWith("/")||le.startsWith("#"))return;try{const _e=new URL(le,ae).toString();ne.setAttribute(q,_e)}catch(_e){k("[router] rewrite attribute failed",q,_e)}}catch(le){k("[router] rewrite helper failed",le)}},T=N.querySelectorAll("[src],[href],[srcset],[poster]"),I=[];for(const q of Array.from(T||[]))try{const ne=q.tagName?q.tagName.toLowerCase():"";if(ne==="a")continue;if(q.hasAttribute("src")){const le=q.getAttribute("src");M("src",q);const _e=q.getAttribute("src");le!==_e&&I.push({attr:"src",tag:ne,before:le,after:_e})}if(q.hasAttribute("href")&&ne==="link"){const le=q.getAttribute("href");M("href",q);const _e=q.getAttribute("href");le!==_e&&I.push({attr:"href",tag:ne,before:le,after:_e})}if(q.hasAttribute("href")&&ne!=="link"){const le=q.getAttribute("href");M("href",q);const _e=q.getAttribute("href");le!==_e&&I.push({attr:"href",tag:ne,before:le,after:_e})}if(q.hasAttribute("xlink:href")){const le=q.getAttribute("xlink:href");M("xlink:href",q);const _e=q.getAttribute("xlink:href");le!==_e&&I.push({attr:"xlink:href",tag:ne,before:le,after:_e})}if(q.hasAttribute("poster")){const le=q.getAttribute("poster");M("poster",q);const _e=q.getAttribute("poster");le!==_e&&I.push({attr:"poster",tag:ne,before:le,after:_e})}if(q.hasAttribute("srcset")){const le=(q.getAttribute("srcset")||"").split(",").map(_e=>_e.trim()).filter(Boolean).map(_e=>{const[fe,xe]=_e.split(/\s+/,2);if(!fe||/^(https?:)?\/\//i.test(fe)||fe.startsWith("/"))return _e;try{const $e=new URL(fe,ae).toString();return xe?`${$e} ${xe}`:$e}catch{return _e}}).join(", ");q.setAttribute("srcset",le)}}catch{}const Q=N.documentElement&&N.documentElement.outerHTML?N.documentElement.outerHTML:A;try{Rt()&&I&&I.length&&k("[router] rewritten asset refs",{abs:b,rewritten:I})}catch{}return{data:{raw:Q,isHtml:!0},pagePath:String(n??""),anchor:o}}}catch{}let ie=A;try{let R=String(A??"");R=R.replace(/srcset\s*=\s*"([^"]*)"/gi,(N,M)=>`srcset="${String(M??"").split(",").map(T=>T.trim()).filter(Boolean).map(T=>{const[I,Q]=T.split(/\s+/,2);if(!I||/^(https?:)?\/\//i.test(I)||I.startsWith("/")||I.startsWith("#"))return T;try{const q=new URL(I,ae).toString();return Q?`${q} ${Q}`:q}catch{return T}}).join(", ")}"`),R=R.replace(/<(?!a\b)([^>]*?)\bhref\s*=\s*"([^"]*)"/gi,(N,M,T)=>{if(!T||/^(https?:)?\/\//i.test(T)||T.startsWith("/")||T.startsWith("#"))return N;try{const I=new URL(T,ae).toString();return N.replace(`href="${T}"`,`href="${I}"`)}catch{return N}}),R=R.replace(/\bsrc\s*=\s*"([^"]*)"/gi,(N,M)=>{if(!M||/^(https?:)?\/\//i.test(M)||M.startsWith("/")||M.startsWith("#"))return N;try{return`src="${new URL(M,ae).toString()}"`}catch{return N}}),R=R.replace(/\bxlink:href\s*=\s*"([^"]*)"/gi,(N,M)=>{if(!M||/^(https?:)?\/\//i.test(M)||M.startsWith("/")||M.startsWith("#"))return N;try{return`xlink:href="${new URL(M,ae).toString()}"`}catch{return N}}),R=R.replace(/\bposter\s*=\s*"([^"]*)"/gi,(N,M)=>{if(!M||/^(https?:)?\/\//i.test(M)||M.startsWith("/")||M.startsWith("#"))return N;try{return`poster="${new URL(M,ae).toString()}"`}catch{return N}}),ie=R}catch{ie=A}return/<base\s+[^>]*>/i.test(ie)||(/<head[^>]*>/i.test(ie)?ie=ie.replace(/(<head[^>]*>)/i,`$1<base href="${he}">`):ie=`<base href="${he}">`+ie),{data:{raw:ie,isHtml:!0},pagePath:String(n??""),anchor:o}}catch{return{data:{raw:A,isHtml:!0},pagePath:String(n??""),anchor:o}}}}}catch(b){Rt()&&k("[router] absolute HTML fetch fallback failed",b)}}catch{}try{const b=decodeURIComponent(String(s??""));if(b&&!/\.(md|html?)$/i.test(b)&&typeof ke=="string"&&ke&&Rt()){const S=[`/assets/${b}.html`,`/assets/${b}/index.html`];for(const A of S)try{const z=await fetch(A,Object.assign({method:"GET"},r?{signal:r.signal}:{}));if(z&&z.ok)return{data:{raw:await z.text(),isHtml:!0},pagePath:A.replace(/^\//,""),anchor:o}}catch{}}}catch(b){Rt()&&k("[router] assets fallback failed",b)}throw new Error("no page data")}return{data:p,pagePath:y,anchor:o}}function na(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Hn=na();function sl(e){Hn=e}var $n={exec:()=>null};function Qn(e){let t=[];return n=>{let r=Math.max(0,Math.min(3,n-1)),i=t[r];return i||(i=e(r),t[r]=i),i}}function Pe(e,t=""){let n=typeof e=="string"?e:e.source,r={replace:(i,s)=>{let o=typeof s=="string"?s:s.source;return o=o.replace(yt.caret,"$1"),n=n.replace(i,o),r},getRegex:()=>new RegExp(n,t)};return r}var Su=((e="")=>{try{return!!new RegExp("(?<=1)(?<!1)"+e)}catch{return!1}})(),yt={codeRemoveIndent:/^(?: {0,3}\t| {1,4})/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,endingSpaceTabChar:/[ \t]$/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,leadingSpaceTab:/^[ \t]+/,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,numericCharacterReference:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/g,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:Qn(e=>new RegExp(`^ {0,${e}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),hrRegex:Qn(e=>new RegExp(`^ {0,${e}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)),fencesBeginRegex:Qn(e=>new RegExp(`^ {0,${e}}(?:\`\`\`|~~~)`)),headingBeginRegex:Qn(e=>new RegExp(`^ {0,${e}}#`)),htmlBeginRegex:Qn(e=>new RegExp(`^ {0,${e}}(?:</?(?:${Jr})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))`,"i")),blockquoteBeginRegex:Qn(e=>new RegExp(`^ {0,${e}}>`))},vu=/^(?:[ \t]*(?:\n|$))+/,ku=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,xu=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Kr=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Eu=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,ra=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,al=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,ol=Pe(al).replace(/bull/g,ra).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Au=Pe(al).replace(/bull/g,ra).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),ia=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/,Tu=/^[^\n]+/,sa=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Mu=Pe(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",sa).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),ju=Pe(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,ra).getRegex(),Jr="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",aa=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Pu=Pe("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",aa).replace("tag",Jr).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),ll=e=>Pe(ia).replace("hr",Kr).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list",e).replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Jr).getRegex(),Ru=ll(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/),Lu=ll(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/),oa={blockquote:Pe(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Lu).getRegex(),code:ku,def:Mu,fences:xu,heading:Eu,hr:Kr,html:Pu,lheading:ol,list:ju,newline:vu,paragraph:Ru,table:$n,text:Tu},Oa=Pe("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Kr).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Jr).getRegex(),Cu={...oa,lheading:Au,table:Oa,paragraph:Pe(ia).replace("hr",Kr).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Oa).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Jr).getRegex()},Nu={...oa,html:Pe(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",aa).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:$n,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:Pe(ia).replace("hr",Kr).replace("heading",` *#{1,6} *[^
]`).replace("lheading",ol).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Iu=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Ou=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,cl=/^( {2,}|\\)\n(?!\s*$)[ \t]*/,zu=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,on=/[\p{P}\p{S}]/u,or=/[\s\p{P}\p{S}]/u,ei=/[^\s\p{P}\p{S}]/u,qu=Pe(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,or).getRegex(),$u=/[\p{Pi}\p{Ps}"']/u,ul=/(?!~)[\p{P}\p{S}]/u,Du=/(?!~)[\s\p{P}\p{S}]/u,Bu=/(?:[^\s\p{P}\p{S}]|~)/u,Uu=Pe(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Su?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),hl=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,Wu=Pe(hl,"u").replace(/punct/g,on).getRegex(),Fu=Pe(hl,"u").replace(/punct/g,ul).getRegex(),Hu=Pe(/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/,"u").replace(/openQuote/g,$u).replace(/punct/g,on).getRegex(),fl="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Gu=Pe(fl,"gu").replace(/notPunctSpace/g,ei).replace(/punctSpace/g,or).replace(/punct/g,on).getRegex(),Vu=Pe(fl,"gu").replace(/notPunctSpace/g,Bu).replace(/punctSpace/g,Du).replace(/punct/g,ul).getRegex(),Zu=Pe("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)","gu").replace(/notPunctSpace/g,ei).replace(/punctSpace/g,or).replace(/punct/g,on).getRegex(),Xu=Pe("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,ei).replace(/punctSpace/g,or).replace(/punct/g,on).getRegex(),Yu=Pe("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)","gu").replace(/notPunctSpace/g,ei).replace(/punctSpace/g,or).replace(/punct/g,on).getRegex(),Qu=Pe(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,on).getRegex(),Ku=Pe("^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)","gu").replace(/notPunctSpace/g,ei).replace(/punctSpace/g,or).replace(/punct/g,on).getRegex(),Ju=Pe(/\\(punct)/,"gu").replace(/punct/g,on).getRegex(),eh=Pe(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),th=Pe(aa).replace("(?:-->|$)","-->").getRegex(),nh=Pe("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",th).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),dl=/\[(?:\\[\s\S]|[^\[\]\\])*\]/,qi=Pe(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets",dl).getRegex(),rh=Pe(/^!?\[(label)\]\([ \t\n]*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?[ \t\n]*\)/).replace("label",qi).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),ih=Pe(/^!?\[(label)\]\[(ref)\]/).replace("label",qi).replace("ref",sa).getRegex(),sh=Pe(/^!?\[(ref)\](?:\[\])?/).replace("ref",sa).getRegex(),za=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/,ah=Pe(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets",dl).getRegex(),oh=Pe("reflink|nolink(?!\\()","g").replace("reflink",Pe(/^!?\[(label)\]\[(ref)\]/).replace("label",ah).replace("ref",za).getRegex()).replace("nolink",Pe(/^!?\[(ref)\](?:\[\])?/).replace("ref",za).getRegex()).getRegex(),qa=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,lh=Pe(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g,/[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),la={_backpedal:$n,anyPunctuation:Ju,autolink:eh,blockSkip:Uu,br:cl,code:Ou,del:$n,delLDelim:$n,delRDelim:$n,emStrongLDelim:Wu,emStrongRDelimAst:Gu,emStrongRDelimUnd:Xu,escape:Iu,link:rh,nolink:sh,punctuation:qu,reflink:ih,reflinkSearch:oh,tag:nh,text:zu,url:$n},ch={...la,emStrongLDelim:Hu,emStrongRDelimAst:Zu,emStrongRDelimUnd:Yu,link:Pe(/^!?\[(label)\]\((.*?)\)/).replace("label",qi).getRegex(),reflink:Pe(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",qi).getRegex()},js={...la,emStrongRDelimAst:Vu,emStrongLDelim:Fu,delLDelim:Qu,delRDelim:Ku,url:Pe(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol",lh).replace("protocol",qa).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:Pe(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol",qa).replace(/emailProtocol/g,/(?:mailto|xmpp):/).getRegex()},uh={...js,br:Pe(cl).replace("{2,}","*").getRegex(),text:Pe(js.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},pi={normal:oa,gfm:Cu,pedantic:Nu},wr={normal:la,gfm:js,breaks:uh,pedantic:ch},hh={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},$a=e=>hh[e];function Nt(e,t){if(t){if(yt.escapeTest.test(e))return e.replace(yt.escapeReplace,$a)}else if(yt.escapeTestNoEncode.test(e))return e.replace(yt.escapeReplaceNoEncode,$a);return e}function fh(e){return e.replace(yt.numericCharacterReference,(t,n,r)=>{let i=n===void 0?Number.parseInt(r,16):Number.parseInt(n,10);return i===0||i>1114111||i>=55296&&i<=57343?"�":String.fromCodePoint(i)})}function Da(e){try{e=encodeURI(e).replace(yt.percentDecode,"%")}catch{return null}return e}function Ba(e,t){let n=e.replace(yt.findPipe,(i,s,o)=>{let a=!1,l=s;for(;--l>=0&&o[l]==="\\";)a=!a;return a?"|":" |"}).split(yt.splitPipe),r=0;if(n[0].trim()||n.shift(),n.length>0&&!n.at(-1)?.trim()&&n.pop(),t)if(n.length>t)n.splice(t);else for(;n.length<t;)n.push("");for(;r<n.length;r++)n[r]=n[r].trim().replace(yt.slashPipe,"|");return n}function mn(e,t,n){let r=e.length;if(r===0)return"";let i=0;for(;i<r;){let s=e.charAt(r-i-1);if(s===t&&!n)i++;else if(s!==t&&n)i++;else break}return e.slice(0,r-i)}function Ua(e){let t=e.split(`
`),n=t.length-1;for(;n>=0&&yt.blankLine.test(t[n]);)n--;return t.length-n<=2?e:t.slice(0,n+1).join(`
`)}function $i(e){return e.trim().toLowerCase().toUpperCase().toLowerCase()}function Wa(e,t){if(e.indexOf(t[0])===-1&&e.indexOf(t[1])===-1)return-1;let n=0;for(let r=0;r<e.length;r++)if(e[r]==="\\")r++;else if(e[r]===t[0])n++;else if(e[r]===t[1]&&(n--,n<0))return r;return n>0?-2:-1}function Fa(e,t=0){let n=t,r="";for(let i of e)if(i==="	"){let s=4-n%4;r+=" ".repeat(s),n+=s}else r+=i,n++;return r}function Ha(e,t,n,r,i){let s=t.href,o=t.title||null,a=e[1].replace(i.other.outputLinkReplace,"$1"),l=e[0].charAt(0)==="!";r.state.inLink=!0;let c=r.state.linkEmitted,u=r.state.inRawBlock;r.state.linkEmitted=!1;let d=r.inlineTokens(a),f=r.state.linkEmitted;if(r.state.linkEmitted=c,r.state.inLink=!1,!l){if(f){r.state.inRawBlock=u;return}r.state.linkEmitted=!0}return{type:l?"image":"link",raw:n,href:s,title:o,text:a,tokens:d}}function dh(e,t,n){let r=e.match(n.other.indentCodeCompensation);if(r===null)return t;let i=r[1];return t.split(`
`).map(s=>{let o=s.match(n.other.beginningSpace);if(o===null)return s;let[a]=o;return s.slice(Math.min(a.length,i.length))}).join(`
`)}function Ga(e,t,n,r){if(!t.includes("<"))return!1;for(let i=0;i<t.length;i++){if(t[i]==="\\"){i++;continue}if(t[i]==="`"){let a=r.inline.code.exec(t.slice(i));if(a){i+=a[0].length-1;continue}}if(t[i]!=="<")continue;let s=e.slice(n+i),o=r.inline.tag.exec(s)||r.inline.autolink.exec(s);if(o){if(o[0].length>t.length-i)return!0;i+=o[0].length-1}}return!1}var Di=class{options;rules;lexer;constructor(e){this.options=e||Hn}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=this.options.pedantic?t[0]:Ua(t[0]);return{type:"code",raw:n,codeBlockStyle:"indented",text:n.replace(this.rules.other.codeRemoveIndent,"")}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],r=dh(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:r}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let r=mn(n,"#");(this.options.pedantic||!r||this.rules.other.endingSpaceTabChar.test(r))&&(n=r.trim())}return{type:"heading",raw:mn(t[0],`
`),depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:mn(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=mn(t[0],`
`).split(`
`),r="",i="",s=[];for(;n.length>0;){let o=!1,a=[],l=0;for(;l<n.length;l++)if(this.rules.other.blockquoteStart.test(n[l]))a.push(n[l]),o=!0;else if(!o)a.push(n[l]);else break;n=n.slice(l);let c=a.join(`
`),u=c.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");r=r?`${r}
${c}`:c,i=i?`${i}
${u}`:u;let d=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(u,s,!0),this.lexer.state.top=d,n.length===0)break;let f=s.at(-1);if(f?.type==="code")break;if(f?.type==="blockquote"){let g=f,m=n.join(`
`),p=g.raw+`
`+m.replace(this.rules.other.blockquoteSetextReplace2,""),y=this.blockquote(p);s[s.length-1]=y;let h=p.substring(y.raw.length).replace(/^\n/,""),w=h?h.split(`
`).length:0,b=w?n.slice(0,-w):n;b.length>0&&(r=`${r}
${b.join(`
`)}`),i=i.substring(0,i.length-g.text.length)+y.text;break}else if(f?.type==="list"){let g=f,m=g.raw+`
`+n.join(`
`),p=this.list(m);s[s.length-1]=p,r=r.substring(0,r.length-f.raw.length)+p.raw,i=i.substring(0,i.length-g.raw.length)+p.raw,n=m.substring(s.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:r,tokens:s,text:i}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),r=n.length>1,i={type:"list",raw:"",ordered:r,start:r?+n.slice(0,-1):"",loose:!1,items:[]};n=r?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=r?n:"[*+-]");let s=this.rules.other.listItemRegex(n),o=!1;for(;e;){let l=!1,c="",u="";if(!(t=s.exec(e))||this.rules.block.hr.test(e))break;c=t[0],e=e.substring(c.length);let d=t[2].split(`
`,1)[0],f=t[1].length,g=this.options.pedantic?Fa(d,f):d.replace(this.rules.other.leadingSpaceTab,h=>Fa(h,f)),m=e.split(`
`,1)[0],p=!g.trim(),y=0;if(this.options.pedantic?(y=2,u=g.trimStart()):p?y=f+1:(y=g.search(this.rules.other.nonSpaceChar),y=y>4?1:y,u=g.slice(y),y+=f),p&&this.rules.other.blankLine.test(m)&&(c+=m+`
`,e=e.substring(m.length+1),l=!0),!l){let h=this.rules.other.nextBulletRegex(y),w=this.rules.other.hrRegex(y),b=this.rules.other.fencesBeginRegex(y),S=this.rules.other.headingBeginRegex(y),A=this.rules.other.htmlBeginRegex(y),z=this.rules.other.blockquoteBeginRegex(y);for(;e;){let U=e.split(`
`,1)[0],W;if(m=U,this.options.pedantic?(m=m.replace(this.rules.other.listReplaceNesting,"  "),W=m):W=m.replace(this.rules.other.leadingSpaceTab,Y=>Y.replace(this.rules.other.tabCharGlobal,"    ")),b.test(m)||S.test(m)||A.test(m)||z.test(m)||h.test(m)||w.test(m))break;if(W.search(this.rules.other.nonSpaceChar)>=y||!m.trim())u+=`
`+W.slice(y);else{if(p||g.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||b.test(g)||S.test(g)||w.test(g))break;u+=`
`+m}p=!m.trim(),c+=U+`
`,e=e.substring(U.length+1),g=W.slice(y)}}i.loose||(o?i.loose=!0:this.rules.other.doubleBlankLine.test(c)&&(o=!0)),i.items.push({type:"list_item",raw:c,task:!!this.options.gfm&&this.rules.other.listIsTask.test(u),loose:!1,text:u,tokens:[]}),i.raw+=c}let a=i.items.at(-1);if(a)a.raw=a.raw.trimEnd(),a.text=a.text.trimEnd();else return;i.raw=i.raw.trimEnd();for(let l of i.items)if(this.lexer.state.top=!1,l.tokens=this.lexer.blockTokens(l.text,[]),!i.loose){let c=l.tokens.filter(u=>u.type==="space");i.loose=c.length>0&&c.some(u=>this.rules.other.anyLine.test(u.raw))}for(let l of i.items){let c=l.tokens[0];if(l.task&&(c?.type==="text"||c?.type==="paragraph")){l.text=l.text.replace(this.rules.other.listReplaceTask,""),c.raw=c.raw.replace(this.rules.other.listReplaceTask,""),c.text=c.text.replace(this.rules.other.listReplaceTask,"");for(let d=this.lexer.inlineQueue.length-1;d>=0;d--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[d].src)){this.lexer.inlineQueue[d].src=this.lexer.inlineQueue[d].src.replace(this.rules.other.listReplaceTask,"");break}let u=this.rules.other.listTaskCheckbox.exec(l.raw);if(u){let d={type:"checkbox",raw:u[0]+" ",checked:u[0]!=="[ ]"};l.checked=d.checked,i.loose?l.tokens[0]&&["paragraph","text"].includes(l.tokens[0].type)&&"tokens"in l.tokens[0]&&l.tokens[0].tokens?(l.tokens[0].raw=d.raw+l.tokens[0].raw,l.tokens[0].text=d.raw+l.tokens[0].text,l.tokens[0].tokens.unshift(d)):l.tokens.unshift({type:"paragraph",raw:d.raw,text:d.raw,tokens:[d]}):l.tokens.unshift(d)}}else l.task&&(l.task=!1)}if(i.loose)for(let l of i.items){l.loose=!0;for(let c of l.tokens)c.type==="text"&&(c.type="paragraph")}return i}}html(e){let t=this.rules.block.html.exec(e);if(t){let n=Ua(t[0]);return{type:"html",block:!0,raw:n,pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:n}}}def(e){let t=this.rules.block.def.exec(e);if(t){if(!this.rules.other.startAngleBracket.test(t[2])&&Wa(t[2],"()")!==-1)return;let n=$i(t[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",i=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:mn(t[0],`
`),href:r,title:i}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=Ba(t[1]),r=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),i=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],s={type:"table",raw:mn(t[0],`
`),header:[],align:[],rows:[]};if(n.length===r.length){for(let o of r)this.rules.other.tableAlignRight.test(o)?s.align.push("right"):this.rules.other.tableAlignCenter.test(o)?s.align.push("center"):this.rules.other.tableAlignLeft.test(o)?s.align.push("left"):s.align.push(null);for(let o=0;o<n.length;o++)s.header.push({text:n[o],tokens:this.lexer.inline(n[o]),header:!0,align:s.align[o]});for(let o of i)s.rows.push(Ba(o,s.header.length).map((a,l)=>({text:a,tokens:this.lexer.inline(a),header:!1,align:s.align[l]})));return s}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t){let n=t[1].trim();return{type:"heading",raw:mn(t[0],`
`),depth:t[2].charAt(0)==="="?1:2,text:n,tokens:this.lexer.inline(n)}}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){if(this.lexer.state.linkParenPossible===!1)return;let t=this.rules.inline.link.exec(e);if(t){let n=t[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&Ga(e,t[1],n,this.rules))return;let r=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(r)){if(!this.rules.other.endAngleBracket.test(r))return;let o=mn(r.slice(0,-1),"\\");if((r.length-o.length)%2===0)return}else{let o=Wa(t[2],"()");if(o===-2)return;if(o>-1){let a=(t[0].indexOf("!")===0?5:4)+t[1].length+o;t[2]=t[2].substring(0,o),t[0]=t[0].substring(0,a).trim(),t[3]=""}}let i=t[2],s="";if(this.options.pedantic){let o=this.rules.other.pedanticHrefTitle.exec(i);o&&(i=o[1],s=o[3])}else s=t[3]?t[3].slice(1,-1):"";return i=i.trim(),this.rules.other.startAngleBracket.test(i)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(r)?i=i.slice(1):i=i.slice(1,-1)),Ha(t,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:s&&s.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let r=n[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&Ga(e,n[1],r,this.rules))return;let i=t[$i((n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "))];if(!i){let s=n[0].charAt(0);return{type:"text",raw:s,text:s}}return Ha(n,i,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let r=this.rules.inline.emStrongLDelim.exec(e);if(!(!r||!r[1]&&!r[2]&&!r[3]&&!r[4]||r[4]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(r[1]||r[3])||!n||this.rules.inline.punctuation.exec(n))){let i=[...r[0]].length-1,s,o,a=i,l=0,c=r[0][0],u=n===c,d=c==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(d.lastIndex=0,t=t.slice(-1*e.length+i);(r=d.exec(t))!==null;){if(s=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!s)continue;if(o=[...s].length,r[3]||r[4]){a+=o;continue}else if(r[5]||r[6]){if(i%3&&!((i+o)%3)){l+=o;continue}if(u)break}if(a-=o,a>0)continue;o=Math.min(o,o+a+l);let f=[...r[0]][0].length,g=e.slice(0,i+r.index+f+o);if(Math.min(i,o)%2){let p=g.slice(1,-1);return{type:"em",raw:g,text:p,tokens:this.lexer.inlineTokens(p)}}let m=g.slice(2,-2);return{type:"strong",raw:g,text:m,tokens:this.lexer.inlineTokens(m)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),r=this.rules.other.nonSpaceChar.test(n),i=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return r&&i&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,n=""){let r=this.rules.inline.delLDelim.exec(e);if(r&&(!r[1]||!n||this.rules.inline.punctuation.exec(n))){let i=[...r[0]].length-1,s,o,a=i,l=this.rules.inline.delRDelim;for(l.lastIndex=0,t=t.slice(-1*e.length+i);(r=l.exec(t))!==null;){if(s=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!s||(o=[...s].length,o!==i))continue;if(r[3]||r[4]){a+=o;continue}if(a-=o,a>0)continue;o=Math.min(o,o+a);let c=[...r[0]][0].length,u=e.slice(0,i+r.index+c+o),d=u.slice(i,-i);return{type:"del",raw:u,text:d,tokens:this.lexer.inlineTokens(d)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,r;return t[2]==="@"?(n=t[1],r="mailto:"+n):(n=t[1],r=n),{type:"link",raw:t[0],text:n,href:r,autolink:!0,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,r;if(t[2]==="@")n=t[0],r="mailto:"+n;else{let i;do i=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(i!==t[0]);n=t[0],t[1]==="www."?r="http://"+t[0]:r=t[0]}return{type:"link",raw:t[0],text:n,href:r,autolink:!0,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:n?t[0]:fh(t[0]),escaped:n}}}},Gt=class Ps{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||Hn,this.options.tokenizer=this.options.tokenizer||new Di,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,linkEmitted:!1,linkParenPossible:!0,top:!0};let n={other:yt,block:pi.normal,inline:wr.normal};this.options.pedantic?(n.block=pi.pedantic,n.inline=wr.pedantic):this.options.gfm&&(n.block=pi.gfm,this.options.breaks?n.inline=wr.breaks:n.inline=wr.gfm),this.tokenizer.rules=n}static get rules(){return{block:pi,inline:wr}}static lex(t,n){return new Ps(n).lex(t)}static lexInline(t,n){return new Ps(n).inlineTokens(t)}lex(t){t=t.replace(yt.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let r=this.inlineQueue[n];this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],r=!1){this.tokenizer.lexer=this,this.options.pedantic&&(t=t.replace(yt.tabCharGlobal,"    ").replace(yt.spaceLine,""));let i=1/0;for(;t;){if(t.length<i)i=t.length;else{this.infiniteLoopError(t.charCodeAt(0));break}let s;if(this.options.extensions?.block?.some(a=>(s=a.call({lexer:this},t,n))?(t=t.substring(s.raw.length),n.push(s),!0):!1))continue;if(s=this.tokenizer.space(t)){t=t.substring(s.raw.length);let a=n.at(-1);s.raw.length===1&&a!==void 0?a.raw+=`
`:n.push(s);continue}if(s=this.tokenizer.code(t)){t=t.substring(s.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+s.raw,a.text+=`
`+s.text,this.inlineQueue.at(-1).src=a.text):n.push(s);continue}if(s=this.tokenizer.fences(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.heading(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.hr(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.blockquote(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.list(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.html(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.def(t)){t=t.substring(s.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+s.raw,a.text+=`
`+s.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[s.tag]||(this.tokens.links[s.tag]={href:s.href,title:s.title},n.push(s));continue}if(s=this.tokenizer.table(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.lheading(t)){t=t.substring(s.raw.length),n.push(s);continue}let o=t;if(this.options.extensions?.startBlock){let a=1/0,l=t.slice(1),c;this.options.extensions.startBlock.forEach(u=>{c=u.call({lexer:this},l),typeof c=="number"&&c>=0&&(a=Math.min(a,c))}),a<1/0&&a>=0&&(o=t.substring(0,a+1))}if(this.state.top&&(s=this.tokenizer.paragraph(o))){let a=n.at(-1);r&&a?.type==="paragraph"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+s.raw,a.text+=`
`+s.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(s),r=o.length!==t.length,t=t.substring(s.raw.length);continue}if(s=this.tokenizer.text(t)){t=t.substring(s.raw.length);let a=n.at(-1);a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+s.raw,a.text+=`
`+s.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(s);continue}if(t){this.infiniteLoopError(t.charCodeAt(0));break}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}linkInText(t){if(!t.includes("["))return!1;let n=this.tokenizer.rules.inline.link;for(let r of t.matchAll(this.tokenizer.rules.inline.blockSkip))if(n.test(r[0])&&t.charAt(r.index-1)!=="!")return!0;for(let r of t.matchAll(this.tokenizer.rules.inline.reflinkSearch)){let i=r[0],s=i.lastIndexOf("[");if(!(i.charAt(0)==="!"||!Object.hasOwn(this.tokens.links,$i(i.slice(s+1,-1))))&&!(s>1&&this.linkInText(i.slice(1,s-1))))return!0}return!1}inlineTokens(t,n=[]){this.tokenizer.lexer=this;let r=this.state.linkParenPossible;this.state.linkParenPossible=r&&t.includes(")");try{return this.#e(t,n)}finally{this.state.linkParenPossible=r}}#e(t,n){let r=t;if(this.tokens.links&&t.includes("[")){let a=this.tokenizer.rules.inline.reflinkSearch,l=c=>{let u=c.lastIndexOf("[");if(!Object.hasOwn(this.tokens.links,$i(c.slice(u+1,-1))))return c;if(u>1&&c.charAt(0)!=="!"){let d=c.slice(1,u-1);if(this.linkInText(d))return"["+d.replace(a,l)+"]["+"a".repeat(c.length-u-2)+"]"}return"["+"a".repeat(c.length-2)+"]"};r=r.replace(a,l)}r=r.replace(this.tokenizer.rules.inline.anyPunctuation,a=>"+".repeat(a.length)),r=r.replace(this.tokenizer.rules.inline.blockSkip,(a,l,c)=>{let u=c?c.length:0;return a.slice(0,u)+"["+"a".repeat(a.length-u-2)+"]"}),r=this.options.hooks?.emStrongMask?.call({lexer:this},r)??r;let i=!1,s="",o=1/0;for(;t;){if(t.length<o)o=t.length;else{this.infiniteLoopError(t.charCodeAt(0));break}i||(s=""),i=!1;let a;if(this.options.extensions?.inline?.some(c=>(a=c.call({lexer:this},t,n))?(t=t.substring(a.raw.length),n.push(a),!0):!1))continue;if(a=this.tokenizer.escape(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.tag(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.link(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(a.raw.length);let c=n.at(-1);a.type==="text"&&c?.type==="text"?(c.raw+=a.raw,c.text+=a.text):n.push(a);continue}if(a=this.tokenizer.emStrong(t,r,s)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.codespan(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.br(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.del(t,r,s)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.autolink(t)){t=t.substring(a.raw.length),n.push(a);continue}if(!this.state.inLink&&(a=this.tokenizer.url(t))){t=t.substring(a.raw.length),n.push(a);continue}let l=t;if(this.options.extensions?.startInline){let c=1/0,u=t.slice(1),d;this.options.extensions.startInline.forEach(f=>{d=f.call({lexer:this},u),typeof d=="number"&&d>=0&&(c=Math.min(c,d))}),c<1/0&&c>=0&&(l=t.substring(0,c+1))}if(a=this.tokenizer.inlineText(l)){t=t.substring(a.raw.length),a.raw.slice(-1)!=="_"&&(s=a.raw.slice(-1)),i=!0;let c=n.at(-1);c?.type==="text"?(c.raw+=a.raw,c.text+=a.text):n.push(a);continue}if(t){this.infiniteLoopError(t.charCodeAt(0));break}}return n}infiniteLoopError(t){let n="Infinite loop on byte: "+t;if(this.options.silent)console.error(n);else throw new Error(n)}},Bi=class{options;parser;constructor(e){this.options=e||Hn}space(e){return""}code({text:e,lang:t,escaped:n}){let r=(t||"").match(yt.notSpaceStart)?.[0],i=e?e.replace(yt.endingNewline,"")+`
`:"";return r?'<pre><code class="language-'+Nt(r)+'">'+(n?i:Nt(i,!0))+`</code></pre>
`:"<pre><code>"+(n?i:Nt(i,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return""}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,r="";for(let o=0;o<e.items.length;o++){let a=e.items[o];r+=this.listitem(a)}let i=t?"ol":"ul",s=t&&n!==1?' start="'+n+'"':"";return"<"+i+s+`>
`+r+"</"+i+`>
`}listitem(e){return`<li>${this.parser.parse(e.tokens)}</li>
`}checkbox({checked:e}){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",n="";for(let i=0;i<e.header.length;i++)n+=this.tablecell(e.header[i]);t+=this.tablerow({text:n});let r="";for(let i=0;i<e.rows.length;i++){let s=e.rows[i];n="";for(let o=0;o<s.length;o++)n+=this.tablecell(s[o]);r+=this.tablerow({text:n})}return r&&(r=`<tbody>${r}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+r+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),n=e.header?"th":"td";return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${Nt(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,text:n,tokens:r,autolink:i}){let s=i?Nt(n,!0):this.parser.parseInline(r),o=Da(e);if(o===null)return s;e=Nt(o,i);let a='<a href="'+e+'"';return t&&(a+=' title="'+Nt(t)+'"'),a+=">"+s+"</a>",a}image({href:e,title:t,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));let i=Da(e);if(i===null)return Nt(n);e=i;let s=`<img src="${Nt(e)}" alt="${Nt(n)}"`;return t&&(s+=` title="${Nt(t)}"`),s+=">",s}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:Nt(e.text)}},ca=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},Vt=class Rs{options;renderer;textRenderer;constructor(t){this.options=t||Hn,this.options.renderer=this.options.renderer||new Bi,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new ca}static parse(t,n){return new Rs(n).parse(t)}static parseInline(t,n){return new Rs(n).parseInline(t)}parse(t){this.renderer.parser=this;let n="";for(let r=0;r<t.length;r++){let i=t[r];if(this.options.extensions?.renderers?.[i.type]){let o=i,a=this.options.extensions.renderers[o.type].call({parser:this},o);if(a!==!1||!["space","hr","heading","code","table","blockquote","list","checkbox","html","def","paragraph","text"].includes(o.type)){n+=a||"";continue}}let s=i;switch(s.type){case"space":n+=this.renderer.space(s);break;case"hr":n+=this.renderer.hr(s);break;case"heading":n+=this.renderer.heading(s);break;case"code":n+=this.renderer.code(s);break;case"table":n+=this.renderer.table(s);break;case"blockquote":n+=this.renderer.blockquote(s);break;case"list":n+=this.renderer.list(s);break;case"checkbox":n+=this.renderer.checkbox(s);break;case"html":n+=this.renderer.html(s);break;case"def":n+=this.renderer.def(s);break;case"paragraph":n+=this.renderer.paragraph(s);break;case"text":n+=this.renderer.text(s);break;default:{let o='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return n}parseInline(t,n=this.renderer){this.renderer.parser=this;let r="";for(let i=0;i<t.length;i++){let s=t[i];if(this.options.extensions?.renderers?.[s.type]){let a=this.options.extensions.renderers[s.type].call({parser:this},s);if(a!==!1||!["escape","html","link","image","checkbox","strong","em","codespan","br","del","text"].includes(s.type)){r+=a||"";continue}}let o=s;switch(o.type){case"escape":r+=n.text(o);break;case"html":r+=n.html(o);break;case"link":r+=n.link(o);break;case"image":r+=n.image(o);break;case"checkbox":r+=n.checkbox(o);break;case"strong":r+=n.strong(o);break;case"em":r+=n.em(o);break;case"codespan":r+=n.codespan(o);break;case"br":r+=n.br(o);break;case"del":r+=n.del(o);break;case"text":r+=n.text(o);break;default:{let a='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return r}},Ar=class{options;block;constructor(e){this.options=e||Hn}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(e=this.block){return e?Gt.lex:Gt.lexInline}provideParser(e=this.block){return e?Vt.parse:Vt.parseInline}},gh=class{defaults=na();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Vt;Renderer=Bi;TextRenderer=ca;Lexer=Gt;Tokenizer=Di;Hooks=Ar;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let r of e)switch(n=n.concat(t.call(this,r)),r.type){case"table":{let i=r;for(let s of i.header)n=n.concat(this.walkTokens(s.tokens,t));for(let s of i.rows)for(let o of s)n=n.concat(this.walkTokens(o.tokens,t));break}case"list":{let i=r;n=n.concat(this.walkTokens(i.items,t));break}default:{let i=r;this.defaults.extensions?.childTokens?.[i.type]?this.defaults.extensions.childTokens[i.type].forEach(s=>{let o=i[s].flat(1/0);n=n.concat(this.walkTokens(o,t))}):i.tokens&&(n=n.concat(this.walkTokens(i.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let r={...n};if(r.async=this.defaults.async||r.async||!1,n.extensions&&(n.extensions.forEach(i=>{if(!i.name)throw new Error("extension name required");if("renderer"in i){let s=t.renderers[i.name];s?t.renderers[i.name]=function(...o){let a=i.renderer.apply(this,o);return a===!1&&(a=s.apply(this,o)),a}:t.renderers[i.name]=i.renderer}if("tokenizer"in i){if(!i.level||i.level!=="block"&&i.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let s=t[i.level];s?s.unshift(i.tokenizer):t[i.level]=[i.tokenizer],i.start&&(i.level==="block"?t.startBlock?t.startBlock.push(i.start):t.startBlock=[i.start]:i.level==="inline"&&(t.startInline?t.startInline.push(i.start):t.startInline=[i.start]))}"childTokens"in i&&i.childTokens&&(t.childTokens[i.name]=i.childTokens)}),r.extensions=t),n.renderer){let i=this.defaults.renderer||new Bi(this.defaults);for(let s in n.renderer){if(!(s in i))throw new Error(`renderer '${s}' does not exist`);if(["options","parser"].includes(s))continue;let o=s,a=n.renderer[o],l=i[o];i[o]=(...c)=>{let u=a.apply(i,c);return u===!1&&(u=l.apply(i,c)),u||""}}r.renderer=i}if(n.tokenizer){let i=this.defaults.tokenizer||new Di(this.defaults);for(let s in n.tokenizer){if(!(s in i))throw new Error(`tokenizer '${s}' does not exist`);if(["options","rules","lexer"].includes(s))continue;let o=s,a=n.tokenizer[o],l=i[o];i[o]=(...c)=>{let u=a.apply(i,c);return u===!1&&(u=l.apply(i,c)),u}}r.tokenizer=i}if(n.hooks){let i=this.defaults.hooks||new Ar;for(let s in n.hooks){if(!(s in i))throw new Error(`hook '${s}' does not exist`);if(["options","block"].includes(s))continue;let o=s,a=n.hooks[o],l=i[o];Ar.passThroughHooks.has(s)?i[o]=c=>{if(this.defaults.async&&Ar.passThroughHooksRespectAsync.has(s))return(async()=>{let d=await a.call(i,c);return l.call(i,d)})();let u=a.call(i,c);return l.call(i,u)}:i[o]=(...c)=>{if(this.defaults.async)return(async()=>{let d=await a.apply(i,c);return d===!1&&(d=await l.apply(i,c)),d})();let u=a.apply(i,c);return u===!1&&(u=l.apply(i,c)),u}}r.hooks=i}if(n.walkTokens){let i=this.defaults.walkTokens,s=n.walkTokens;r.walkTokens=function(o){let a=[];return a.push(s.call(this,o)),i&&(a=a.concat(i.call(this,o))),a}}this.defaults={...this.defaults,...r}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return Gt.lex(e,t??this.defaults)}parser(e,t){return Vt.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let r={...n},i={...this.defaults,...r},s=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&r.async===!1)return s(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return s(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return s(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(i.hooks&&(i.hooks.options=i,i.hooks.block=e),i.async)return(async()=>{let o=i.hooks?await i.hooks.preprocess(t):t,a=await(i.hooks?await i.hooks.provideLexer(e):e?Gt.lex:Gt.lexInline)(o,i),l=i.hooks?await i.hooks.processAllTokens(a):a;i.walkTokens&&await Promise.all(this.walkTokens(l,i.walkTokens));let c=await(i.hooks?await i.hooks.provideParser(e):e?Vt.parse:Vt.parseInline)(l,i);return i.hooks?await i.hooks.postprocess(c):c})().catch(s);try{i.hooks&&(t=i.hooks.preprocess(t));let o=(i.hooks?i.hooks.provideLexer(e):e?Gt.lex:Gt.lexInline)(t,i);i.hooks&&(o=i.hooks.processAllTokens(o)),i.walkTokens&&this.walkTokens(o,i.walkTokens);let a=(i.hooks?i.hooks.provideParser(e):e?Vt.parse:Vt.parseInline)(o,i);return i.hooks&&(a=i.hooks.postprocess(a)),a}catch(o){return s(o)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let r="<p>An error occurred:</p><pre>"+Nt(n.message+"",!0)+"</pre>";return t?Promise.resolve(r):r}if(t)return Promise.reject(n);throw n}}},Fn=new gh;function ze(e,t){return Fn.parse(e,t)}ze.options=ze.setOptions=function(e){return Fn.setOptions(e),ze.defaults=Fn.defaults,sl(ze.defaults),ze};ze.getDefaults=na;ze.defaults=Hn;function ph(...e){return Fn.use(...e),ze.defaults=Fn.defaults,sl(ze.defaults),ze}ze.use=ph;ze.walkTokens=function(e,t){return Fn.walkTokens(e,t)};ze.parseInline=Fn.parseInline;ze.Parser=Vt;ze.parser=Vt.parse;ze.Renderer=Bi;ze.TextRenderer=ca;ze.Lexer=Gt;ze.lexer=Gt.lex;ze.Tokenizer=Di;ze.Hooks=Ar;ze.parse=ze;var Kf=ze.options,Jf=ze.setOptions,ed=ze.walkTokens,td=ze.parseInline,nd=Vt.parse,rd=Gt.lex,gl=`var hi = Object.create, vn = Object.defineProperty, pi = Object.getOwnPropertyDescriptor, fi = Object.getOwnPropertyNames, gi = Object.getPrototypeOf, Gr = Object.prototype.hasOwnProperty, di = (t, e) => () => (e || (t((e = { exports: {} }).exports, e), t = null), e.exports), mi = (t, e) => {
	let n = {};
	for (var r in t) vn(n, r, {
		get: t[r],
		enumerable: !0
	});
	return e || vn(n, Symbol.toStringTag, { value: "Module" }), n;
}, _i = (t, e, n, r) => {
	if (e && typeof e == "object" || typeof e == "function") for (var i = fi(e), s = 0, c = i.length, a; s < c; s++) a = i[s], !Gr.call(t, a) && a !== n && vn(t, a, {
		get: ((p) => e[p]).bind(null, a),
		enumerable: !(r = pi(e, a)) || r.enumerable
	});
	return t;
}, bi = (t, e, n) => (n = t != null ? hi(gi(t)) : {}, _i(e || !t || !t.__esModule || !Gr.call(t, "default") ? vn(n, "default", {
	value: t,
	enumerable: !0
}) : n, t)), mr = /* @__PURE__ */ mi({
	Hooks: () => Ot,
	Lexer: () => Re,
	Marked: () => ti,
	Parser: () => Oe,
	Renderer: () => nn,
	TextRenderer: () => Nn,
	Tokenizer: () => tn,
	defaults: () => st,
	getDefaults: () => Pn,
	lexer: () => bs,
	marked: () => j,
	options: () => ps,
	parse: () => ms,
	parseInline: () => ds,
	parser: () => _s,
	setOptions: () => fs,
	use: () => ni,
	walkTokens: () => gs
});
function Pn() {
	return {
		async: !1,
		breaks: !1,
		extensions: null,
		gfm: !0,
		hooks: null,
		pedantic: !1,
		renderer: null,
		silent: !1,
		tokenizer: null,
		walkTokens: null
	};
}
var st = Pn();
function qr(t) {
	st = t;
}
var _t = { exec: () => null };
function St(t) {
	let e = [];
	return (n) => {
		let r = Math.max(0, Math.min(3, n - 1)), i = e[r];
		return i || (i = t(r), e[r] = i), i;
	};
}
function L(t, e = "") {
	let n = typeof t == "string" ? t : t.source, r = {
		replace: (i, s) => {
			let c = typeof s == "string" ? s : s.source;
			return c = c.replace(oe.caret, "$1"), n = n.replace(i, c), r;
		},
		getRegex: () => new RegExp(n, e)
	};
	return r;
}
var xi = ((t = "") => {
	try {
		return !!new RegExp("(?<=1)(?<!1)" + t);
	} catch {
		return !1;
	}
})(), oe = {
	codeRemoveIndent: /^(?: {0,3}\\t| {1,4})/gm,
	outputLinkReplace: /\\\\([\\[\\]])/g,
	indentCodeCompensation: /^(\\s+)(?:\`\`\`)/,
	beginningSpace: /^\\s+/,
	endingHash: /#$/,
	startingSpaceChar: /^ /,
	endingSpaceChar: / $/,
	endingSpaceTabChar: /[ \\t]$/,
	nonSpaceChar: /[^ ]/,
	newLineCharGlobal: /\\n/g,
	tabCharGlobal: /\\t/g,
	leadingSpaceTab: /^[ \\t]+/,
	multipleSpaceGlobal: /\\s+/g,
	blankLine: /^[ \\t]*$/,
	doubleBlankLine: /\\n[ \\t]*\\n[ \\t]*$/,
	blockquoteStart: /^ {0,3}>/,
	blockquoteSetextReplace: /\\n {0,3}((?:=+|-+) *)(?=\\n|$)/g,
	blockquoteSetextReplace2: /^ {0,3}>[ \\t]?/gm,
	listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
	listIsTask: /^\\[[ xX]\\] +\\S/,
	listReplaceTask: /^\\[[ xX]\\] +/,
	listTaskCheckbox: /\\[[ xX]\\]/,
	anyLine: /\\n.*\\n/,
	hrefBrackets: /^<(.*)>$/,
	tableDelimiter: /[:|]/,
	tableAlignChars: /^\\||\\| *$/g,
	tableRowBlankLine: /\\n[ \\t]*$/,
	tableAlignRight: /^ *-+: *$/,
	tableAlignCenter: /^ *:-+: *$/,
	tableAlignLeft: /^ *:-+ *$/,
	startATag: /^<a /i,
	endATag: /^<\\/a>/i,
	startPreScriptTag: /^<(pre|code|kbd|script)(\\s|>)/i,
	endPreScriptTag: /^<\\/(pre|code|kbd|script)(\\s|>)/i,
	startAngleBracket: /^</,
	endAngleBracket: />$/,
	pedanticHrefTitle: /^([^'"]*[^\\s])\\s+(['"])(.*)\\2/,
	unicodeAlphaNumeric: /[\\p{L}\\p{N}]/u,
	numericCharacterReference: /&#(?:(\\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/g,
	escapeTest: /[&<>"']/,
	escapeReplace: /[&<>"']/g,
	escapeTestNoEncode: /[<>"']|&(?!(#\\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\\w+);)/,
	escapeReplaceNoEncode: /[<>"']|&(?!(#\\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\\w+);)/g,
	caret: /(^|[^\\[])\\^/g,
	percentDecode: /%25/g,
	findPipe: /\\|/g,
	splitPipe: / \\|/,
	slashPipe: /\\\\\\|/g,
	carriageReturn: /\\r\\n|\\r/g,
	spaceLine: /^ +$/gm,
	notSpaceStart: /^\\S*/,
	endingNewline: /\\n$/,
	listItemRegex: (t) => new RegExp(\`^( {0,3}\${t})((?:[	 ][^\\\\n]*)?(?:\\\\n|$))\`),
	nextBulletRegex: St((t) => new RegExp(\`^ {0,\${t}}(?:[*+-]|\\\\d{1,9}[.)])((?:[ 	][^\\\\n]*)?(?:\\\\n|$))\`)),
	hrRegex: St((t) => new RegExp(\`^ {0,\${t}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\\\*[ 	]*){3,})(?:\\\\n+|$)\`)),
	fencesBeginRegex: St((t) => new RegExp(\`^ {0,\${t}}(?:\\\`\\\`\\\`|~~~)\`)),
	headingBeginRegex: St((t) => new RegExp(\`^ {0,\${t}}#\`)),
	htmlBeginRegex: St((t) => new RegExp(\`^ {0,\${t}}(?:</?(?:\${sn})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))\`, "i")),
	blockquoteBeginRegex: St((t) => new RegExp(\`^ {0,\${t}}>\`))
}, yi = /^(?:[ \\t]*(?:\\n|$))+/, ki = /^((?: {4}| {0,3}\\t)[^\\n]+(?:\\n(?:[ \\t]*(?:\\n|$))*)?)+/, wi = /^ {0,3}(\`{3,}(?=[^\`\\n]*(?:\\n|$))|~{3,})([^\\n]*)(?:\\n|$)(?:|([\\s\\S]*?)(?:\\n|$))(?: {0,3}\\1[~\`]* *(?=\\n|$)|$)/, rn = /^ {0,3}((?:-[\\t ]*){3,}|(?:_[ \\t]*){3,}|(?:\\*[ \\t]*){3,})(?:\\n+|$)/, Ti = /^ {0,3}(#{1,6})(?=\\s|$)(.*)(?:\\n+|$)/, nr = / {0,3}(?:[*+-]|\\d{1,9}[.)])/, Zr = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\\n(?!\\s*?\\n|bull |fences|blockquote|heading|hr|html|table))+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/, Vr = L(Zr).replace(/bull/g, nr).replace(/blockCode/g, /(?: {4}| {0,3}\\t)/).replace(/fences/g, / {0,3}(?:\`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\\t ]*){3,}|(?:_[ \\t]*){3,}|(?:\\*[ \\t]*){3,})(?:\\n+|$)/).replace(/html/g, / {0,3}<[^\\n>]+>\\n/).replace(/\\|table/g, "").getRegex(), Ei = L(Zr).replace(/bull/g, nr).replace(/blockCode/g, /(?: {4}| {0,3}\\t)/).replace(/fences/g, / {0,3}(?:\`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\\t ]*){3,}|(?:_[ \\t]*){3,}|(?:\\*[ \\t]*){3,})(?:\\n+|$)/).replace(/html/g, / {0,3}<[^\\n>]+>\\n/).replace(/table/g, / {0,3}\\|?(?:[:\\- ]*\\|)+[\\:\\- ]*\\n/).getRegex(), rr = /^([^\\n]+(?:\\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \\t]+\\n)[^\\n]+)*)/, Ai = /^[^\\n]+/, ir = /(?!\\s*\\])(?:\\\\[\\s\\S]|[^\\[\\]\\\\])+/, Si = L(/^ {0,3}\\[(label)\\]: *(?:\\n[ \\t]*)?([^<\\s][^\\s]*|<.*?>)(?:(?: +(?:\\n[ \\t]*)?| *\\n[ \\t]*)(title))? *(?:\\n+|$)/).replace("label", ir).replace("title", /(?:"(?:\\\\"?|[^"\\\\])*"|'[^'\\n]*(?:\\n[^'\\n]+)*\\n?'|\\([^()]*\\))/).getRegex(), vi = L(/^(bull)([ \\t][^\\n]*?)?(?:\\n|$)/).replace(/bull/g, nr).getRegex(), sn = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", sr = /<!--(?:-?>|[\\s\\S]*?(?:-->|$))/, Ri = L("^ {0,3}(?:<(script|pre|style|textarea)[\\\\s>][\\\\s\\\\S]*?(?:</\\\\1>[^\\\\n]*\\\\n*|$)|comment[^\\\\n]*(\\\\n+|$)|<\\\\?[\\\\s\\\\S]*?(?:\\\\?>[^\\\\n]*\\\\n*|$)|<![A-Z][\\\\s\\\\S]*?(?:>[^\\\\n]*\\\\n*|$)|<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?(?:\\\\]\\\\]>[^\\\\n]*\\\\n*|$)|</?(tag)(?: +|\\\\n|/?>)[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\\\s*>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$))", "i").replace("comment", sr).replace("tag", sn).replace("attribute", / +[a-zA-Z:_][\\w.:-]*(?: *= *"[^"\\n]*"| *= *'[^'\\n]*'| *= *[^\\s"'=<>\`]+)?/).getRegex(), Xr = (t) => L(rr).replace("hr", rn).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*(?:\\\\n|$))|~~~)[^\\\\n]*(?:\\\\n|$)").replace("list", t).replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", sn).getRegex(), Oi = Xr(/ {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]/), Mi = Xr(/ {0,3}(?:[*+-]|\\d{1,9}[.)])(?:[ \\t]|\\n|$)/), or = {
	blockquote: L(/^( {0,3}> ?(paragraph|[^\\n]*)(?:\\n|$))+/).replace("paragraph", Mi).getRegex(),
	code: ki,
	def: Si,
	fences: wi,
	heading: Ti,
	hr: rn,
	html: Ri,
	lheading: Vr,
	list: vi,
	newline: yi,
	paragraph: Oi,
	table: _t,
	text: Ai
}, _r = L("^ *([^\\\\n ].*)\\\\n {0,3}((?:\\\\| *)?:?-+:? *(?:\\\\| *:?-+:? *)*(?:\\\\| *)?)(?:\\\\n((?:(?! *\\\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\\\n|$))*)\\\\n*|$)").replace("hr", rn).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\\\n]").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*(?:\\\\n|$))|~~~)[^\\\\n]*(?:\\\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", sn).getRegex(), Pi = {
	...or,
	lheading: Ei,
	table: _r,
	paragraph: L(rr).replace("hr", rn).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("|lheading", "").replace("table", _r).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*(?:\\\\n|$))|~~~)[^\\\\n]*(?:\\\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]+[^ \\\\t\\\\n]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", sn).getRegex()
}, Ni = {
	...or,
	html: L(\`^ *(?:comment *(?:\\\\n|\\\\s*$)|<(tag)[\\\\s\\\\S]+?</\\\\1> *(?:\\\\n{2,}|\\\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\\\s[^'"/>\\\\s]*)*?/?> *(?:\\\\n{2,}|\\\\s*$))\`).replace("comment", sr).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\\\b)\\\\w+(?!:|[^\\\\w\\\\s@]*@)\\\\b").getRegex(),
	def: /^ *\\[([^\\]]+)\\]: *<?([^\\s>]+)>?(?: +(["(][^\\n]+[")]))? *(?:\\n+|$)/,
	heading: /^(#{1,6})(.*)(?:\\n+|$)/,
	fences: _t,
	lheading: /^(.+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/,
	paragraph: L(rr).replace("hr", rn).replace("heading", \` *#{1,6} *[^
]\`).replace("lheading", Vr).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, Li = /^\\\\([!"#$%&'()*+,\\-./:;<=>?@\\[\\]\\\\^_\`{|}~])/, Ci = /^(\`+)([^\`]|[^\`][\\s\\S]*?[^\`])\\1(?!\`)/, Yr = /^( {2,}|\\\\)\\n(?!\\s*$)[ \\t]*/, Ii = /^(\`+|[^\`])(?:(?= {2,}\\n)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*_]|\\b_|$)|[^ ](?= {2,}\\n)))/, He = /[\\p{P}\\p{S}]/u, Pt = /[\\s\\p{P}\\p{S}]/u, on = /[^\\s\\p{P}\\p{S}]/u, Di = L(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Pt).getRegex(), zi = /[\\p{Pi}\\p{Ps}"']/u, Kr = /(?!~)[\\p{P}\\p{S}]/u, $i = /(?!~)[\\s\\p{P}\\p{S}]/u, Bi = /(?:[^\\s\\p{P}\\p{S}]|~)/u, Ui = L(/link|precode-code|html/, "g").replace("link", /\\[(?:[^\\[\\]\`]|(?<a>\`+)[^\`]+\\k<a>(?!\`))*?\\]\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)]|\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)])*\\))*\\)/).replace("precode-", xi ? "(?<!\`)()" : "(^^|[^\`])").replace("code", /(?<b>\`+)[^\`]+\\k<b>(?!\`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Qr = /^(?:\\*+(?:((?!\\*)punct)|([^\\s*]))?)|^_+(?:((?!_)punct)|([^\\s_]))?/, ji = L(Qr, "u").replace(/punct/g, He).getRegex(), Fi = L(Qr, "u").replace(/punct/g, Kr).getRegex(), Hi = L(/^(?:\\*+(?:((?!\\*)(?!openQuote)punct)|([^\\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\\s_]))?/, "u").replace(/openQuote/g, zi).replace(/punct/g, He).getRegex(), Jr = "^[^_*]*?__[^_*]*?\\\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\\\*)punct(\\\\*+)(?=[\\\\s]|$)|notPunctSpace(\\\\*+)(?!\\\\*)(?=punctSpace|$)|(?!\\\\*)punctSpace(\\\\*+)(?=notPunctSpace)|[\\\\s](\\\\*+)(?!\\\\*)(?=punct)|(?!\\\\*)punct(\\\\*+)(?!\\\\*)(?=punct)|notPunctSpace(\\\\*+)(?=notPunctSpace)", Wi = L(Jr, "gu").replace(/notPunctSpace/g, on).replace(/punctSpace/g, Pt).replace(/punct/g, He).getRegex(), Gi = L(Jr, "gu").replace(/notPunctSpace/g, Bi).replace(/punctSpace/g, $i).replace(/punct/g, Kr).getRegex(), qi = L("^[^_*]*?__[^_*]*?\\\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\\\*)punct(\\\\*+)(?=[\\\\s]|$)|notPunctSpace(\\\\*+)(?!\\\\*)(?=punctSpace|$)|(?!\\\\*)[\\\\s](\\\\*+)(?=notPunctSpace)|[\\\\s](\\\\*+)(?!\\\\*)(?=punct)|(?!\\\\*)punct(\\\\*+)(?!\\\\*)(?=punct)|(?:(?!\\\\*)punct|notPunctSpace)(\\\\*+)(?!\\\\*)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, on).replace(/punctSpace/g, Pt).replace(/punct/g, He).getRegex(), Zi = L("^[^_*]*?\\\\*\\\\*[^_*]*?_[^_*]*?(?=\\\\*\\\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, on).replace(/punctSpace/g, Pt).replace(/punct/g, He).getRegex(), Vi = L("^[^_*]*?\\\\*\\\\*[^_*]*?_[^_*]*?(?=\\\\*\\\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\\\s](_+)(?=notPunctSpace)|[\\\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, on).replace(/punctSpace/g, Pt).replace(/punct/g, He).getRegex(), Xi = L(/^~~?(?:((?!~)punct)|[^\\s~])/, "u").replace(/punct/g, He).getRegex(), Yi = L("^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, on).replace(/punctSpace/g, Pt).replace(/punct/g, He).getRegex(), Ki = L(/\\\\(punct)/, "gu").replace(/punct/g, He).getRegex(), Qi = L(/^<(scheme:[^\\s\\x00-\\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Ji = L(sr).replace("(?:-->|$)", "-->").getRegex(), es = L("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\\\s*/?>|^<\\\\?[\\\\s\\\\S]*?\\\\?>|^<![a-zA-Z]+\\\\s[\\\\s\\\\S]*?>|^<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?\\\\]\\\\]>").replace("comment", Ji).replace("attribute", /\\s+[a-zA-Z:_][\\w.:-]*(?:\\s*=\\s*"[^"]*"|\\s*=\\s*'[^']*'|\\s*=\\s*[^\\s"'=<>\`]+)?/).getRegex(), ei = /\\[(?:\\\\[\\s\\S]|[^\\[\\]\\\\])*\\]/, Rn = L(/(?:\\[(?:brackets|\\\\[\\s\\S]|[^\\[\\]\\\\])*\\]|\\\\[\\s\\S]|\`+(?!\`)[^\`]*?\`+(?!\`)|\`\`+(?=\\])|[^\\[\\]\\\\\`])*?/).replace("brackets", ei).getRegex(), ts = L(/^!?\\[(label)\\]\\([ \\t\\n]*(href)(?:(?:[ \\t]+(?:\\n[ \\t]*)?|\\n[ \\t]*)(title))?[ \\t\\n]*\\)/).replace("label", Rn).replace("href", /<(?:\\\\.|[^\\n<>\\\\])+>|[^ \\t\\n\\x00-\\x1f]+|(?=\\))/).replace("title", /"(?:\\\\"?|[^"\\\\])*"|'(?:\\\\'?|[^'\\\\])*'|\\((?:\\\\\\)?|[^)\\\\])*\\)/).getRegex(), ns = L(/^!?\\[(label)\\]\\[(ref)\\]/).replace("label", Rn).replace("ref", ir).getRegex(), rs = L(/^!?\\[(ref)\\](?:\\[\\])?/).replace("ref", ir).getRegex(), br = /(?!\\s*\\])(?:\\\\[\\s\\S]|[^\\[\\]\\\\]){1,999}/, is = L(/(?:[^\\[\\]\\\\\`]*(?:\\[(?:brackets|\\\\[\\s\\S]|[^\\[\\]\\\\])*\\]|\\\\[\\s\\S]|\`+(?!\`)[^\`]*?\`+(?!\`)|\`\`+(?=\\]))){0,999}?[^\\[\\]\\\\\`]*?/).replace("brackets", ei).getRegex(), ss = L("reflink|nolink(?!\\\\()", "g").replace("reflink", L(/^!?\\[(label)\\]\\[(ref)\\]/).replace("label", is).replace("ref", br).getRegex()).replace("nolink", L(/^!?\\[(ref)\\](?:\\[\\])?/).replace("ref", br).getRegex()).getRegex(), xr = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, os = L(/(?:mailto:email|xmpp:email(?:\\/[A-Za-z0-9@.]+)?)/).replace(/email/g, /[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\\w-])/).getRegex(), ar = {
	_backpedal: _t,
	anyPunctuation: Ki,
	autolink: Qi,
	blockSkip: Ui,
	br: Yr,
	code: Ci,
	del: _t,
	delLDelim: _t,
	delRDelim: _t,
	emStrongLDelim: ji,
	emStrongRDelimAst: Wi,
	emStrongRDelimUnd: Zi,
	escape: Li,
	link: ts,
	nolink: rs,
	punctuation: Di,
	reflink: ns,
	reflinkSearch: ss,
	tag: es,
	text: Ii,
	url: _t
}, as = {
	...ar,
	emStrongLDelim: Hi,
	emStrongRDelimAst: qi,
	emStrongRDelimUnd: Vi,
	link: L(/^!?\\[(label)\\]\\((.*?)\\)/).replace("label", Rn).getRegex(),
	reflink: L(/^!?\\[(label)\\]\\s*\\[([^\\]]*)\\]/).replace("label", Rn).getRegex()
}, Kn = {
	...ar,
	emStrongRDelimAst: Gi,
	emStrongLDelim: Fi,
	delLDelim: Xi,
	delRDelim: Yi,
	url: L(/^emailProtocol|^((?:protocol):\\/\\/|www\\.)(?:[a-zA-Z0-9\\-]+\\.?)+[^\\s<]*|^email/).replace("emailProtocol", os).replace("protocol", xr).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\\w-])/).getRegex(),
	_backpedal: /(?:[^?!.,:;*_'"~()&]+|\\([^)]*\\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
	del: /^(~~?)(?=[^\\s~])((?:\\\\[\\s\\S]|[^\\\\])*?(?:\\\\[\\s\\S]|[^\\s~\\\\]))\\1(?=[^~]|$)/,
	text: L(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(\`+|~+|[^\`~])(?:(?=[\`~])|(?= {2,}\\n)|(?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*~_]|\\b_|protocol:\\/\\/|www\\.|$)|[^ ](?= {2,}\\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-](?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@))))/).replace("protocol", xr).replace(/emailProtocol/g, /(?:mailto|xmpp):/).getRegex()
}, ls = {
	...Kn,
	br: L(Yr).replace("{2,}", "*").getRegex(),
	text: L(Kn.text).replace("\\\\b_", "\\\\b_| {2,}\\\\n").replace(/\\{2,\\}/g, "*").getRegex()
}, Tn = {
	normal: or,
	gfm: Pi,
	pedantic: Ni
}, Xt = {
	normal: ar,
	gfm: Kn,
	breaks: ls,
	pedantic: as
}, cs = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\\"": "&quot;",
	"'": "&#39;"
}, yr = (t) => cs[t];
function we(t, e) {
	if (e) {
		if (oe.escapeTest.test(t)) return t.replace(oe.escapeReplace, yr);
	} else if (oe.escapeTestNoEncode.test(t)) return t.replace(oe.escapeReplaceNoEncode, yr);
	return t;
}
function us(t) {
	return t.replace(oe.numericCharacterReference, (e, n, r) => {
		let i = n === void 0 ? Number.parseInt(r, 16) : Number.parseInt(n, 10);
		return i === 0 || i > 1114111 || i >= 55296 && i <= 57343 ? "�" : String.fromCodePoint(i);
	});
}
function kr(t) {
	try {
		t = encodeURI(t).replace(oe.percentDecode, "%");
	} catch {
		return null;
	}
	return t;
}
function wr(t, e) {
	let n = t.replace(oe.findPipe, (i, s, c) => {
		let a = !1, p = s;
		for (; --p >= 0 && c[p] === "\\\\";) a = !a;
		return a ? "|" : " |";
	}).split(oe.splitPipe), r = 0;
	if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e) if (n.length > e) n.splice(e);
	else for (; n.length < e;) n.push("");
	for (; r < n.length; r++) n[r] = n[r].trim().replace(oe.slashPipe, "|");
	return n;
}
function et(t, e, n) {
	let r = t.length;
	if (r === 0) return "";
	let i = 0;
	for (; i < r;) {
		let s = t.charAt(r - i - 1);
		if (s === e && !n) i++;
		else if (s !== e && n) i++;
		else break;
	}
	return t.slice(0, r - i);
}
function Tr(t) {
	let e = t.split(\`
\`), n = e.length - 1;
	for (; n >= 0 && oe.blankLine.test(e[n]);) n--;
	return e.length - n <= 2 ? t : e.slice(0, n + 1).join(\`
\`);
}
function On(t) {
	return t.trim().toLowerCase().toUpperCase().toLowerCase();
}
function Er(t, e) {
	if (t.indexOf(e[0]) === -1 && t.indexOf(e[1]) === -1) return -1;
	let n = 0;
	for (let r = 0; r < t.length; r++) if (t[r] === "\\\\") r++;
	else if (t[r] === e[0]) n++;
	else if (t[r] === e[1] && (n--, n < 0)) return r;
	return n > 0 ? -2 : -1;
}
function Ar(t, e = 0) {
	let n = e, r = "";
	for (let i of t) if (i === "	") {
		let s = 4 - n % 4;
		r += " ".repeat(s), n += s;
	} else r += i, n++;
	return r;
}
function Sr(t, e, n, r, i) {
	let s = e.href, c = e.title || null, a = t[1].replace(i.other.outputLinkReplace, "$1"), p = t[0].charAt(0) === "!";
	r.state.inLink = !0;
	let f = r.state.linkEmitted, b = r.state.inRawBlock;
	r.state.linkEmitted = !1;
	let T = r.inlineTokens(a), S = r.state.linkEmitted;
	if (r.state.linkEmitted = f, r.state.inLink = !1, !p) {
		if (S) {
			r.state.inRawBlock = b;
			return;
		}
		r.state.linkEmitted = !0;
	}
	return {
		type: p ? "image" : "link",
		raw: n,
		href: s,
		title: c,
		text: a,
		tokens: T
	};
}
function hs(t, e, n) {
	let r = t.match(n.other.indentCodeCompensation);
	if (r === null) return e;
	let i = r[1];
	return e.split(\`
\`).map((s) => {
		let c = s.match(n.other.beginningSpace);
		if (c === null) return s;
		let [a] = c;
		return s.slice(Math.min(a.length, i.length));
	}).join(\`
\`);
}
function vr(t, e, n, r) {
	if (!e.includes("<")) return !1;
	for (let i = 0; i < e.length; i++) {
		if (e[i] === "\\\\") {
			i++;
			continue;
		}
		if (e[i] === "\`") {
			let a = r.inline.code.exec(e.slice(i));
			if (a) {
				i += a[0].length - 1;
				continue;
			}
		}
		if (e[i] !== "<") continue;
		let s = t.slice(n + i), c = r.inline.tag.exec(s) || r.inline.autolink.exec(s);
		if (c) {
			if (c[0].length > e.length - i) return !0;
			i += c[0].length - 1;
		}
	}
	return !1;
}
var tn = class {
	options;
	rules;
	lexer;
	constructor(t) {
		this.options = t || st;
	}
	space(t) {
		let e = this.rules.block.newline.exec(t);
		if (e && e[0].length > 0) return {
			type: "space",
			raw: e[0]
		};
	}
	code(t) {
		let e = this.rules.block.code.exec(t);
		if (e) {
			let n = this.options.pedantic ? e[0] : Tr(e[0]);
			return {
				type: "code",
				raw: n,
				codeBlockStyle: "indented",
				text: n.replace(this.rules.other.codeRemoveIndent, "")
			};
		}
	}
	fences(t) {
		let e = this.rules.block.fences.exec(t);
		if (e) {
			let n = e[0], r = hs(n, e[3] || "", this.rules);
			return {
				type: "code",
				raw: n,
				lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2],
				text: r
			};
		}
	}
	heading(t) {
		let e = this.rules.block.heading.exec(t);
		if (e) {
			let n = e[2].trim();
			if (this.rules.other.endingHash.test(n)) {
				let r = et(n, "#");
				(this.options.pedantic || !r || this.rules.other.endingSpaceTabChar.test(r)) && (n = r.trim());
			}
			return {
				type: "heading",
				raw: et(e[0], \`
\`),
				depth: e[1].length,
				text: n,
				tokens: this.lexer.inline(n)
			};
		}
	}
	hr(t) {
		let e = this.rules.block.hr.exec(t);
		if (e) return {
			type: "hr",
			raw: et(e[0], \`
\`)
		};
	}
	blockquote(t) {
		let e = this.rules.block.blockquote.exec(t);
		if (e) {
			let n = et(e[0], \`
\`).split(\`
\`), r = "", i = "", s = [];
			for (; n.length > 0;) {
				let c = !1, a = [], p = 0;
				for (; p < n.length; p++) if (this.rules.other.blockquoteStart.test(n[p])) a.push(n[p]), c = !0;
				else if (!c) a.push(n[p]);
				else break;
				n = n.slice(p);
				let f = a.join(\`
\`), b = f.replace(this.rules.other.blockquoteSetextReplace, \`
    $1\`).replace(this.rules.other.blockquoteSetextReplace2, "");
				r = r ? \`\${r}
\${f}\` : f, i = i ? \`\${i}
\${b}\` : b;
				let T = this.lexer.state.top;
				if (this.lexer.state.top = !0, this.lexer.blockTokens(b, s, !0), this.lexer.state.top = T, n.length === 0) break;
				let S = s.at(-1);
				if (S?.type === "code") break;
				if (S?.type === "blockquote") {
					let C = S, v = n.join(\`
\`), z = C.raw + \`
\` + v.replace(this.rules.other.blockquoteSetextReplace2, ""), O = this.blockquote(z);
					s[s.length - 1] = O;
					let W = z.substring(O.raw.length).replace(/^\\n/, ""), re = W ? W.split(\`
\`).length : 0, ie = re ? n.slice(0, -re) : n;
					ie.length > 0 && (r = \`\${r}
\${ie.join(\`
\`)}\`), i = i.substring(0, i.length - C.text.length) + O.text;
					break;
				} else if (S?.type === "list") {
					let C = S, v = C.raw + \`
\` + n.join(\`
\`), z = this.list(v);
					s[s.length - 1] = z, r = r.substring(0, r.length - S.raw.length) + z.raw, i = i.substring(0, i.length - C.raw.length) + z.raw, n = v.substring(s.at(-1).raw.length).split(\`
\`);
					continue;
				}
			}
			return {
				type: "blockquote",
				raw: r,
				tokens: s,
				text: i
			};
		}
	}
	list(t) {
		let e = this.rules.block.list.exec(t);
		if (e) {
			let n = e[1].trim(), r = n.length > 1, i = {
				type: "list",
				raw: "",
				ordered: r,
				start: r ? +n.slice(0, -1) : "",
				loose: !1,
				items: []
			};
			n = r ? \`\\\\d{1,9}\\\\\${n.slice(-1)}\` : \`\\\\\${n}\`, this.options.pedantic && (n = r ? n : "[*+-]");
			let s = this.rules.other.listItemRegex(n), c = !1;
			for (; t;) {
				let p = !1, f = "", b = "";
				if (!(e = s.exec(t)) || this.rules.block.hr.test(t)) break;
				f = e[0], t = t.substring(f.length);
				let T = e[2].split(\`
\`, 1)[0], S = e[1].length, C = this.options.pedantic ? Ar(T, S) : T.replace(this.rules.other.leadingSpaceTab, (W) => Ar(W, S)), v = t.split(\`
\`, 1)[0], z = !C.trim(), O = 0;
				if (this.options.pedantic ? (O = 2, b = C.trimStart()) : z ? O = S + 1 : (O = C.search(this.rules.other.nonSpaceChar), O = O > 4 ? 1 : O, b = C.slice(O), O += S), z && this.rules.other.blankLine.test(v) && (f += v + \`
\`, t = t.substring(v.length + 1), p = !0), !p) {
					let W = this.rules.other.nextBulletRegex(O), re = this.rules.other.hrRegex(O), ie = this.rules.other.fencesBeginRegex(O), me = this.rules.other.headingBeginRegex(O), Ne = this.rules.other.htmlBeginRegex(O), We = this.rules.other.blockquoteBeginRegex(O);
					for (; t;) {
						let _e = t.split(\`
\`, 1)[0], Me;
						if (v = _e, this.options.pedantic ? (v = v.replace(this.rules.other.listReplaceNesting, "  "), Me = v) : Me = v.replace(this.rules.other.leadingSpaceTab, (te) => te.replace(this.rules.other.tabCharGlobal, "    ")), ie.test(v) || me.test(v) || Ne.test(v) || We.test(v) || W.test(v) || re.test(v)) break;
						if (Me.search(this.rules.other.nonSpaceChar) >= O || !v.trim()) b += \`
\` + Me.slice(O);
						else {
							if (z || C.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || ie.test(C) || me.test(C) || re.test(C)) break;
							b += \`
\` + v;
						}
						z = !v.trim(), f += _e + \`
\`, t = t.substring(_e.length + 1), C = Me.slice(O);
					}
				}
				i.loose || (c ? i.loose = !0 : this.rules.other.doubleBlankLine.test(f) && (c = !0)), i.items.push({
					type: "list_item",
					raw: f,
					task: !!this.options.gfm && this.rules.other.listIsTask.test(b),
					loose: !1,
					text: b,
					tokens: []
				}), i.raw += f;
			}
			let a = i.items.at(-1);
			if (a) a.raw = a.raw.trimEnd(), a.text = a.text.trimEnd();
			else return;
			i.raw = i.raw.trimEnd();
			for (let p of i.items) if (this.lexer.state.top = !1, p.tokens = this.lexer.blockTokens(p.text, []), !i.loose) {
				let f = p.tokens.filter((b) => b.type === "space");
				i.loose = f.length > 0 && f.some((b) => this.rules.other.anyLine.test(b.raw));
			}
			for (let p of i.items) {
				let f = p.tokens[0];
				if (p.task && (f?.type === "text" || f?.type === "paragraph")) {
					p.text = p.text.replace(this.rules.other.listReplaceTask, ""), f.raw = f.raw.replace(this.rules.other.listReplaceTask, ""), f.text = f.text.replace(this.rules.other.listReplaceTask, "");
					for (let T = this.lexer.inlineQueue.length - 1; T >= 0; T--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[T].src)) {
						this.lexer.inlineQueue[T].src = this.lexer.inlineQueue[T].src.replace(this.rules.other.listReplaceTask, "");
						break;
					}
					let b = this.rules.other.listTaskCheckbox.exec(p.raw);
					if (b) {
						let T = {
							type: "checkbox",
							raw: b[0] + " ",
							checked: b[0] !== "[ ]"
						};
						p.checked = T.checked, i.loose ? p.tokens[0] && ["paragraph", "text"].includes(p.tokens[0].type) && "tokens" in p.tokens[0] && p.tokens[0].tokens ? (p.tokens[0].raw = T.raw + p.tokens[0].raw, p.tokens[0].text = T.raw + p.tokens[0].text, p.tokens[0].tokens.unshift(T)) : p.tokens.unshift({
							type: "paragraph",
							raw: T.raw,
							text: T.raw,
							tokens: [T]
						}) : p.tokens.unshift(T);
					}
				} else p.task && (p.task = !1);
			}
			if (i.loose) for (let p of i.items) {
				p.loose = !0;
				for (let f of p.tokens) f.type === "text" && (f.type = "paragraph");
			}
			return i;
		}
	}
	html(t) {
		let e = this.rules.block.html.exec(t);
		if (e) {
			let n = Tr(e[0]);
			return {
				type: "html",
				block: !0,
				raw: n,
				pre: e[1] === "pre" || e[1] === "script" || e[1] === "style",
				text: n
			};
		}
	}
	def(t) {
		let e = this.rules.block.def.exec(t);
		if (e) {
			if (!this.rules.other.startAngleBracket.test(e[2]) && Er(e[2], "()") !== -1) return;
			let n = On(e[1]).replace(this.rules.other.multipleSpaceGlobal, " "), r = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
			return {
				type: "def",
				tag: n,
				raw: et(e[0], \`
\`),
				href: r,
				title: i
			};
		}
	}
	table(t) {
		let e = this.rules.block.table.exec(t);
		if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
		let n = wr(e[1]), r = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(\`
\`) : [], s = {
			type: "table",
			raw: et(e[0], \`
\`),
			header: [],
			align: [],
			rows: []
		};
		if (n.length === r.length) {
			for (let c of r) this.rules.other.tableAlignRight.test(c) ? s.align.push("right") : this.rules.other.tableAlignCenter.test(c) ? s.align.push("center") : this.rules.other.tableAlignLeft.test(c) ? s.align.push("left") : s.align.push(null);
			for (let c = 0; c < n.length; c++) s.header.push({
				text: n[c],
				tokens: this.lexer.inline(n[c]),
				header: !0,
				align: s.align[c]
			});
			for (let c of i) s.rows.push(wr(c, s.header.length).map((a, p) => ({
				text: a,
				tokens: this.lexer.inline(a),
				header: !1,
				align: s.align[p]
			})));
			return s;
		}
	}
	lheading(t) {
		let e = this.rules.block.lheading.exec(t);
		if (e) {
			let n = e[1].trim();
			return {
				type: "heading",
				raw: et(e[0], \`
\`),
				depth: e[2].charAt(0) === "=" ? 1 : 2,
				text: n,
				tokens: this.lexer.inline(n)
			};
		}
	}
	paragraph(t) {
		let e = this.rules.block.paragraph.exec(t);
		if (e) {
			let n = e[1].charAt(e[1].length - 1) === \`
\` ? e[1].slice(0, -1) : e[1];
			return {
				type: "paragraph",
				raw: e[0],
				text: n,
				tokens: this.lexer.inline(n)
			};
		}
	}
	text(t) {
		let e = this.rules.block.text.exec(t);
		if (e) return {
			type: "text",
			raw: e[0],
			text: e[0],
			tokens: this.lexer.inline(e[0])
		};
	}
	escape(t) {
		let e = this.rules.inline.escape.exec(t);
		if (e) return {
			type: "escape",
			raw: e[0],
			text: e[1]
		};
	}
	tag(t) {
		let e = this.rules.inline.tag.exec(t);
		if (e) return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), {
			type: "html",
			raw: e[0],
			inLink: this.lexer.state.inLink,
			inRawBlock: this.lexer.state.inRawBlock,
			block: !1,
			text: e[0]
		};
	}
	link(t) {
		if (this.lexer.state.linkParenPossible === !1) return;
		let e = this.rules.inline.link.exec(t);
		if (e) {
			let n = e[0].charAt(0) === "!" ? 2 : 1;
			if (!this.options.pedantic && vr(t, e[1], n, this.rules)) return;
			let r = e[2].trim();
			if (!this.options.pedantic && this.rules.other.startAngleBracket.test(r)) {
				if (!this.rules.other.endAngleBracket.test(r)) return;
				let c = et(r.slice(0, -1), "\\\\");
				if ((r.length - c.length) % 2 === 0) return;
			} else {
				let c = Er(e[2], "()");
				if (c === -2) return;
				if (c > -1) {
					let a = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + c;
					e[2] = e[2].substring(0, c), e[0] = e[0].substring(0, a).trim(), e[3] = "";
				}
			}
			let i = e[2], s = "";
			if (this.options.pedantic) {
				let c = this.rules.other.pedanticHrefTitle.exec(i);
				c && (i = c[1], s = c[3]);
			} else s = e[3] ? e[3].slice(1, -1) : "";
			return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? i = i.slice(1) : i = i.slice(1, -1)), Sr(e, {
				href: i && i.replace(this.rules.inline.anyPunctuation, "$1"),
				title: s && s.replace(this.rules.inline.anyPunctuation, "$1")
			}, e[0], this.lexer, this.rules);
		}
	}
	reflink(t, e) {
		let n;
		if ((n = this.rules.inline.reflink.exec(t)) || (n = this.rules.inline.nolink.exec(t))) {
			let r = n[0].charAt(0) === "!" ? 2 : 1;
			if (!this.options.pedantic && vr(t, n[1], r, this.rules)) return;
			let i = e[On((n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "))];
			if (!i) {
				let s = n[0].charAt(0);
				return {
					type: "text",
					raw: s,
					text: s
				};
			}
			return Sr(n, i, n[0], this.lexer, this.rules);
		}
	}
	emStrong(t, e, n = "") {
		let r = this.rules.inline.emStrongLDelim.exec(t);
		if (!(!r || !r[1] && !r[2] && !r[3] && !r[4] || r[4] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[3]) || !n || this.rules.inline.punctuation.exec(n))) {
			let i = [...r[0]].length - 1, s, c, a = i, p = 0, f = r[0][0], b = n === f, T = f === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
			for (T.lastIndex = 0, e = e.slice(-1 * t.length + i); (r = T.exec(e)) !== null;) {
				if (s = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !s) continue;
				if (c = [...s].length, r[3] || r[4]) {
					a += c;
					continue;
				} else if (r[5] || r[6]) {
					if (i % 3 && !((i + c) % 3)) {
						p += c;
						continue;
					}
					if (b) break;
				}
				if (a -= c, a > 0) continue;
				c = Math.min(c, c + a + p);
				let S = [...r[0]][0].length, C = t.slice(0, i + r.index + S + c);
				if (Math.min(i, c) % 2) {
					let z = C.slice(1, -1);
					return {
						type: "em",
						raw: C,
						text: z,
						tokens: this.lexer.inlineTokens(z)
					};
				}
				let v = C.slice(2, -2);
				return {
					type: "strong",
					raw: C,
					text: v,
					tokens: this.lexer.inlineTokens(v)
				};
			}
		}
	}
	codespan(t) {
		let e = this.rules.inline.code.exec(t);
		if (e) {
			let n = e[2].replace(this.rules.other.newLineCharGlobal, " "), r = this.rules.other.nonSpaceChar.test(n), i = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
			return r && i && (n = n.substring(1, n.length - 1)), {
				type: "codespan",
				raw: e[0],
				text: n
			};
		}
	}
	br(t) {
		let e = this.rules.inline.br.exec(t);
		if (e) return {
			type: "br",
			raw: e[0]
		};
	}
	del(t, e, n = "") {
		let r = this.rules.inline.delLDelim.exec(t);
		if (r && (!r[1] || !n || this.rules.inline.punctuation.exec(n))) {
			let i = [...r[0]].length - 1, s, c, a = i, p = this.rules.inline.delRDelim;
			for (p.lastIndex = 0, e = e.slice(-1 * t.length + i); (r = p.exec(e)) !== null;) {
				if (s = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !s || (c = [...s].length, c !== i)) continue;
				if (r[3] || r[4]) {
					a += c;
					continue;
				}
				if (a -= c, a > 0) continue;
				c = Math.min(c, c + a);
				let f = [...r[0]][0].length, b = t.slice(0, i + r.index + f + c), T = b.slice(i, -i);
				return {
					type: "del",
					raw: b,
					text: T,
					tokens: this.lexer.inlineTokens(T)
				};
			}
		}
	}
	autolink(t) {
		let e = this.rules.inline.autolink.exec(t);
		if (e) {
			let n, r;
			return e[2] === "@" ? (n = e[1], r = "mailto:" + n) : (n = e[1], r = n), {
				type: "link",
				raw: e[0],
				text: n,
				href: r,
				autolink: !0,
				tokens: [{
					type: "text",
					raw: n,
					text: n
				}]
			};
		}
	}
	url(t) {
		let e;
		if (e = this.rules.inline.url.exec(t)) {
			let n, r;
			if (e[2] === "@") n = e[0], r = "mailto:" + n;
			else {
				let i;
				do
					i = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
				while (i !== e[0]);
				n = e[0], e[1] === "www." ? r = "http://" + e[0] : r = e[0];
			}
			return {
				type: "link",
				raw: e[0],
				text: n,
				href: r,
				autolink: !0,
				tokens: [{
					type: "text",
					raw: n,
					text: n
				}]
			};
		}
	}
	inlineText(t) {
		let e = this.rules.inline.text.exec(t);
		if (e) {
			let n = this.lexer.state.inRawBlock;
			return {
				type: "text",
				raw: e[0],
				text: n ? e[0] : us(e[0]),
				escaped: n
			};
		}
	}
}, Re = class Qn {
	tokens;
	options;
	state;
	inlineQueue;
	tokenizer;
	constructor(e) {
		this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || st, this.options.tokenizer = this.options.tokenizer || new tn(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
			inLink: !1,
			inRawBlock: !1,
			linkEmitted: !1,
			linkParenPossible: !0,
			top: !0
		};
		let n = {
			other: oe,
			block: Tn.normal,
			inline: Xt.normal
		};
		this.options.pedantic ? (n.block = Tn.pedantic, n.inline = Xt.pedantic) : this.options.gfm && (n.block = Tn.gfm, this.options.breaks ? n.inline = Xt.breaks : n.inline = Xt.gfm), this.tokenizer.rules = n;
	}
	static get rules() {
		return {
			block: Tn,
			inline: Xt
		};
	}
	static lex(e, n) {
		return new Qn(n).lex(e);
	}
	static lexInline(e, n) {
		return new Qn(n).inlineTokens(e);
	}
	lex(e) {
		e = e.replace(oe.carriageReturn, \`
\`), this.blockTokens(e, this.tokens);
		for (let n = 0; n < this.inlineQueue.length; n++) {
			let r = this.inlineQueue[n];
			this.inlineTokens(r.src, r.tokens);
		}
		return this.inlineQueue = [], this.tokens;
	}
	blockTokens(e, n = [], r = !1) {
		this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(oe.tabCharGlobal, "    ").replace(oe.spaceLine, ""));
		let i = 1 / 0;
		for (; e;) {
			if (e.length < i) i = e.length;
			else {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
			let s;
			if (this.options.extensions?.block?.some((a) => (s = a.call({ lexer: this }, e, n)) ? (e = e.substring(s.raw.length), n.push(s), !0) : !1)) continue;
			if (s = this.tokenizer.space(e)) {
				e = e.substring(s.raw.length);
				let a = n.at(-1);
				s.raw.length === 1 && a !== void 0 ? a.raw += \`
\` : n.push(s);
				continue;
			}
			if (s = this.tokenizer.code(e)) {
				e = e.substring(s.raw.length);
				let a = n.at(-1);
				a?.type === "paragraph" || a?.type === "text" ? (a.raw += (a.raw.endsWith(\`
\`) ? "" : \`
\`) + s.raw, a.text += \`
\` + s.text, this.inlineQueue.at(-1).src = a.text) : n.push(s);
				continue;
			}
			if (s = this.tokenizer.fences(e)) {
				e = e.substring(s.raw.length), n.push(s);
				continue;
			}
			if (s = this.tokenizer.heading(e)) {
				e = e.substring(s.raw.length), n.push(s);
				continue;
			}
			if (s = this.tokenizer.hr(e)) {
				e = e.substring(s.raw.length), n.push(s);
				continue;
			}
			if (s = this.tokenizer.blockquote(e)) {
				e = e.substring(s.raw.length), n.push(s);
				continue;
			}
			if (s = this.tokenizer.list(e)) {
				e = e.substring(s.raw.length), n.push(s);
				continue;
			}
			if (s = this.tokenizer.html(e)) {
				e = e.substring(s.raw.length), n.push(s);
				continue;
			}
			if (s = this.tokenizer.def(e)) {
				e = e.substring(s.raw.length);
				let a = n.at(-1);
				a?.type === "paragraph" || a?.type === "text" ? (a.raw += (a.raw.endsWith(\`
\`) ? "" : \`
\`) + s.raw, a.text += \`
\` + s.raw, this.inlineQueue.at(-1).src = a.text) : this.tokens.links[s.tag] || (this.tokens.links[s.tag] = {
					href: s.href,
					title: s.title
				}, n.push(s));
				continue;
			}
			if (s = this.tokenizer.table(e)) {
				e = e.substring(s.raw.length), n.push(s);
				continue;
			}
			if (s = this.tokenizer.lheading(e)) {
				e = e.substring(s.raw.length), n.push(s);
				continue;
			}
			let c = e;
			if (this.options.extensions?.startBlock) {
				let a = 1 / 0, p = e.slice(1), f;
				this.options.extensions.startBlock.forEach((b) => {
					f = b.call({ lexer: this }, p), typeof f == "number" && f >= 0 && (a = Math.min(a, f));
				}), a < 1 / 0 && a >= 0 && (c = e.substring(0, a + 1));
			}
			if (this.state.top && (s = this.tokenizer.paragraph(c))) {
				let a = n.at(-1);
				r && a?.type === "paragraph" ? (a.raw += (a.raw.endsWith(\`
\`) ? "" : \`
\`) + s.raw, a.text += \`
\` + s.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = a.text) : n.push(s), r = c.length !== e.length, e = e.substring(s.raw.length);
				continue;
			}
			if (s = this.tokenizer.text(e)) {
				e = e.substring(s.raw.length);
				let a = n.at(-1);
				a?.type === "text" ? (a.raw += (a.raw.endsWith(\`
\`) ? "" : \`
\`) + s.raw, a.text += \`
\` + s.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = a.text) : n.push(s);
				continue;
			}
			if (e) {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
		}
		return this.state.top = !0, n;
	}
	inline(e, n = []) {
		return this.inlineQueue.push({
			src: e,
			tokens: n
		}), n;
	}
	linkInText(e) {
		if (!e.includes("[")) return !1;
		let n = this.tokenizer.rules.inline.link;
		for (let r of e.matchAll(this.tokenizer.rules.inline.blockSkip)) if (n.test(r[0]) && e.charAt(r.index - 1) !== "!") return !0;
		for (let r of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)) {
			let i = r[0], s = i.lastIndexOf("[");
			if (!(i.charAt(0) === "!" || !Object.hasOwn(this.tokens.links, On(i.slice(s + 1, -1)))) && !(s > 1 && this.linkInText(i.slice(1, s - 1)))) return !0;
		}
		return !1;
	}
	inlineTokens(e, n = []) {
		this.tokenizer.lexer = this;
		let r = this.state.linkParenPossible;
		this.state.linkParenPossible = r && e.includes(")");
		try {
			return this.#e(e, n);
		} finally {
			this.state.linkParenPossible = r;
		}
	}
	#e(e, n) {
		let r = e;
		if (this.tokens.links && e.includes("[")) {
			let a = this.tokenizer.rules.inline.reflinkSearch, p = (f) => {
				let b = f.lastIndexOf("[");
				if (!Object.hasOwn(this.tokens.links, On(f.slice(b + 1, -1)))) return f;
				if (b > 1 && f.charAt(0) !== "!") {
					let T = f.slice(1, b - 1);
					if (this.linkInText(T)) return "[" + T.replace(a, p) + "][" + "a".repeat(f.length - b - 2) + "]";
				}
				return "[" + "a".repeat(f.length - 2) + "]";
			};
			r = r.replace(a, p);
		}
		r = r.replace(this.tokenizer.rules.inline.anyPunctuation, (a) => "+".repeat(a.length)), r = r.replace(this.tokenizer.rules.inline.blockSkip, (a, p, f) => {
			let b = f ? f.length : 0;
			return a.slice(0, b) + "[" + "a".repeat(a.length - b - 2) + "]";
		}), r = this.options.hooks?.emStrongMask?.call({ lexer: this }, r) ?? r;
		let i = !1, s = "", c = 1 / 0;
		for (; e;) {
			if (e.length < c) c = e.length;
			else {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
			i || (s = ""), i = !1;
			let a;
			if (this.options.extensions?.inline?.some((f) => (a = f.call({ lexer: this }, e, n)) ? (e = e.substring(a.raw.length), n.push(a), !0) : !1)) continue;
			if (a = this.tokenizer.escape(e)) {
				e = e.substring(a.raw.length), n.push(a);
				continue;
			}
			if (a = this.tokenizer.tag(e)) {
				e = e.substring(a.raw.length), n.push(a);
				continue;
			}
			if (a = this.tokenizer.link(e)) {
				e = e.substring(a.raw.length), n.push(a);
				continue;
			}
			if (a = this.tokenizer.reflink(e, this.tokens.links)) {
				e = e.substring(a.raw.length);
				let f = n.at(-1);
				a.type === "text" && f?.type === "text" ? (f.raw += a.raw, f.text += a.text) : n.push(a);
				continue;
			}
			if (a = this.tokenizer.emStrong(e, r, s)) {
				e = e.substring(a.raw.length), n.push(a);
				continue;
			}
			if (a = this.tokenizer.codespan(e)) {
				e = e.substring(a.raw.length), n.push(a);
				continue;
			}
			if (a = this.tokenizer.br(e)) {
				e = e.substring(a.raw.length), n.push(a);
				continue;
			}
			if (a = this.tokenizer.del(e, r, s)) {
				e = e.substring(a.raw.length), n.push(a);
				continue;
			}
			if (a = this.tokenizer.autolink(e)) {
				e = e.substring(a.raw.length), n.push(a);
				continue;
			}
			if (!this.state.inLink && (a = this.tokenizer.url(e))) {
				e = e.substring(a.raw.length), n.push(a);
				continue;
			}
			let p = e;
			if (this.options.extensions?.startInline) {
				let f = 1 / 0, b = e.slice(1), T;
				this.options.extensions.startInline.forEach((S) => {
					T = S.call({ lexer: this }, b), typeof T == "number" && T >= 0 && (f = Math.min(f, T));
				}), f < 1 / 0 && f >= 0 && (p = e.substring(0, f + 1));
			}
			if (a = this.tokenizer.inlineText(p)) {
				e = e.substring(a.raw.length), a.raw.slice(-1) !== "_" && (s = a.raw.slice(-1)), i = !0;
				let f = n.at(-1);
				f?.type === "text" ? (f.raw += a.raw, f.text += a.text) : n.push(a);
				continue;
			}
			if (e) {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
		}
		return n;
	}
	infiniteLoopError(e) {
		let n = "Infinite loop on byte: " + e;
		if (this.options.silent) console.error(n);
		else throw new Error(n);
	}
}, nn = class {
	options;
	parser;
	constructor(t) {
		this.options = t || st;
	}
	space(t) {
		return "";
	}
	code({ text: t, lang: e, escaped: n }) {
		let r = (e || "").match(oe.notSpaceStart)?.[0], i = t ? t.replace(oe.endingNewline, "") + \`
\` : "";
		return r ? "<pre><code class=\\"language-" + we(r) + "\\">" + (n ? i : we(i, !0)) + \`</code></pre>
\` : "<pre><code>" + (n ? i : we(i, !0)) + \`</code></pre>
\`;
	}
	blockquote({ tokens: t }) {
		return \`<blockquote>
\${this.parser.parse(t)}</blockquote>
\`;
	}
	html({ text: t }) {
		return t;
	}
	def(t) {
		return "";
	}
	heading({ tokens: t, depth: e }) {
		return \`<h\${e}>\${this.parser.parseInline(t)}</h\${e}>
\`;
	}
	hr(t) {
		return \`<hr>
\`;
	}
	list(t) {
		let e = t.ordered, n = t.start, r = "";
		for (let c = 0; c < t.items.length; c++) {
			let a = t.items[c];
			r += this.listitem(a);
		}
		let i = e ? "ol" : "ul", s = e && n !== 1 ? " start=\\"" + n + "\\"" : "";
		return "<" + i + s + \`>
\` + r + "</" + i + \`>
\`;
	}
	listitem(t) {
		return \`<li>\${this.parser.parse(t.tokens)}</li>
\`;
	}
	checkbox({ checked: t }) {
		return "<input " + (t ? "checked=\\"\\" " : "") + "disabled=\\"\\" type=\\"checkbox\\"> ";
	}
	paragraph({ tokens: t }) {
		return \`<p>\${this.parser.parseInline(t)}</p>
\`;
	}
	table(t) {
		let e = "", n = "";
		for (let i = 0; i < t.header.length; i++) n += this.tablecell(t.header[i]);
		e += this.tablerow({ text: n });
		let r = "";
		for (let i = 0; i < t.rows.length; i++) {
			let s = t.rows[i];
			n = "";
			for (let c = 0; c < s.length; c++) n += this.tablecell(s[c]);
			r += this.tablerow({ text: n });
		}
		return r && (r = \`<tbody>\${r}</tbody>\`), \`<table>
<thead>
\` + e + \`</thead>
\` + r + \`</table>
\`;
	}
	tablerow({ text: t }) {
		return \`<tr>
\${t}</tr>
\`;
	}
	tablecell(t) {
		let e = this.parser.parseInline(t.tokens), n = t.header ? "th" : "td";
		return (t.align ? \`<\${n} align="\${t.align}">\` : \`<\${n}>\`) + e + \`</\${n}>
\`;
	}
	strong({ tokens: t }) {
		return \`<strong>\${this.parser.parseInline(t)}</strong>\`;
	}
	em({ tokens: t }) {
		return \`<em>\${this.parser.parseInline(t)}</em>\`;
	}
	codespan({ text: t }) {
		return \`<code>\${we(t, !0)}</code>\`;
	}
	br(t) {
		return "<br>";
	}
	del({ tokens: t }) {
		return \`<del>\${this.parser.parseInline(t)}</del>\`;
	}
	link({ href: t, title: e, text: n, tokens: r, autolink: i }) {
		let s = i ? we(n, !0) : this.parser.parseInline(r), c = kr(t);
		if (c === null) return s;
		t = we(c, i);
		let a = "<a href=\\"" + t + "\\"";
		return e && (a += " title=\\"" + we(e) + "\\""), a += ">" + s + "</a>", a;
	}
	image({ href: t, title: e, text: n, tokens: r }) {
		r && (n = this.parser.parseInline(r, this.parser.textRenderer));
		let i = kr(t);
		if (i === null) return we(n);
		t = i;
		let s = \`<img src="\${we(t)}" alt="\${we(n)}"\`;
		return e && (s += \` title="\${we(e)}"\`), s += ">", s;
	}
	text(t) {
		return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : we(t.text);
	}
}, Nn = class {
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
}, Oe = class Jn {
	options;
	renderer;
	textRenderer;
	constructor(e) {
		this.options = e || st, this.options.renderer = this.options.renderer || new nn(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Nn();
	}
	static parse(e, n) {
		return new Jn(n).parse(e);
	}
	static parseInline(e, n) {
		return new Jn(n).parseInline(e);
	}
	parse(e) {
		this.renderer.parser = this;
		let n = "";
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (this.options.extensions?.renderers?.[i.type]) {
				let c = i, a = this.options.extensions.renderers[c.type].call({ parser: this }, c);
				if (a !== !1 || ![
					"space",
					"hr",
					"heading",
					"code",
					"table",
					"blockquote",
					"list",
					"checkbox",
					"html",
					"def",
					"paragraph",
					"text"
				].includes(c.type)) {
					n += a || "";
					continue;
				}
			}
			let s = i;
			switch (s.type) {
				case "space":
					n += this.renderer.space(s);
					break;
				case "hr":
					n += this.renderer.hr(s);
					break;
				case "heading":
					n += this.renderer.heading(s);
					break;
				case "code":
					n += this.renderer.code(s);
					break;
				case "table":
					n += this.renderer.table(s);
					break;
				case "blockquote":
					n += this.renderer.blockquote(s);
					break;
				case "list":
					n += this.renderer.list(s);
					break;
				case "checkbox":
					n += this.renderer.checkbox(s);
					break;
				case "html":
					n += this.renderer.html(s);
					break;
				case "def":
					n += this.renderer.def(s);
					break;
				case "paragraph":
					n += this.renderer.paragraph(s);
					break;
				case "text":
					n += this.renderer.text(s);
					break;
				default: {
					let c = "Token with \\"" + s.type + "\\" type was not found.";
					if (this.options.silent) return console.error(c), "";
					throw new Error(c);
				}
			}
		}
		return n;
	}
	parseInline(e, n = this.renderer) {
		this.renderer.parser = this;
		let r = "";
		for (let i = 0; i < e.length; i++) {
			let s = e[i];
			if (this.options.extensions?.renderers?.[s.type]) {
				let a = this.options.extensions.renderers[s.type].call({ parser: this }, s);
				if (a !== !1 || ![
					"escape",
					"html",
					"link",
					"image",
					"checkbox",
					"strong",
					"em",
					"codespan",
					"br",
					"del",
					"text"
				].includes(s.type)) {
					r += a || "";
					continue;
				}
			}
			let c = s;
			switch (c.type) {
				case "escape":
					r += n.text(c);
					break;
				case "html":
					r += n.html(c);
					break;
				case "link":
					r += n.link(c);
					break;
				case "image":
					r += n.image(c);
					break;
				case "checkbox":
					r += n.checkbox(c);
					break;
				case "strong":
					r += n.strong(c);
					break;
				case "em":
					r += n.em(c);
					break;
				case "codespan":
					r += n.codespan(c);
					break;
				case "br":
					r += n.br(c);
					break;
				case "del":
					r += n.del(c);
					break;
				case "text":
					r += n.text(c);
					break;
				default: {
					let a = "Token with \\"" + c.type + "\\" type was not found.";
					if (this.options.silent) return console.error(a), "";
					throw new Error(a);
				}
			}
		}
		return r;
	}
}, Ot = class {
	options;
	block;
	constructor(t) {
		this.options = t || st;
	}
	static passThroughHooks = /* @__PURE__ */ new Set([
		"preprocess",
		"postprocess",
		"processAllTokens",
		"emStrongMask"
	]);
	static passThroughHooksRespectAsync = /* @__PURE__ */ new Set([
		"preprocess",
		"postprocess",
		"processAllTokens"
	]);
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
	provideLexer(t = this.block) {
		return t ? Re.lex : Re.lexInline;
	}
	provideParser(t = this.block) {
		return t ? Oe.parse : Oe.parseInline;
	}
}, ti = class {
	defaults = Pn();
	options = this.setOptions;
	parse = this.parseMarkdown(!0);
	parseInline = this.parseMarkdown(!1);
	Parser = Oe;
	Renderer = nn;
	TextRenderer = Nn;
	Lexer = Re;
	Tokenizer = tn;
	Hooks = Ot;
	constructor(...t) {
		this.use(...t);
	}
	walkTokens(t, e) {
		let n = [];
		for (let r of t) switch (n = n.concat(e.call(this, r)), r.type) {
			case "table": {
				let i = r;
				for (let s of i.header) n = n.concat(this.walkTokens(s.tokens, e));
				for (let s of i.rows) for (let c of s) n = n.concat(this.walkTokens(c.tokens, e));
				break;
			}
			case "list": {
				let i = r;
				n = n.concat(this.walkTokens(i.items, e));
				break;
			}
			default: {
				let i = r;
				this.defaults.extensions?.childTokens?.[i.type] ? this.defaults.extensions.childTokens[i.type].forEach((s) => {
					let c = i[s].flat(1 / 0);
					n = n.concat(this.walkTokens(c, e));
				}) : i.tokens && (n = n.concat(this.walkTokens(i.tokens, e)));
			}
		}
		return n;
	}
	use(...t) {
		let e = this.defaults.extensions || {
			renderers: {},
			childTokens: {}
		};
		return t.forEach((n) => {
			let r = { ...n };
			if (r.async = this.defaults.async || r.async || !1, n.extensions && (n.extensions.forEach((i) => {
				if (!i.name) throw new Error("extension name required");
				if ("renderer" in i) {
					let s = e.renderers[i.name];
					s ? e.renderers[i.name] = function(...c) {
						let a = i.renderer.apply(this, c);
						return a === !1 && (a = s.apply(this, c)), a;
					} : e.renderers[i.name] = i.renderer;
				}
				if ("tokenizer" in i) {
					if (!i.level || i.level !== "block" && i.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
					let s = e[i.level];
					s ? s.unshift(i.tokenizer) : e[i.level] = [i.tokenizer], i.start && (i.level === "block" ? e.startBlock ? e.startBlock.push(i.start) : e.startBlock = [i.start] : i.level === "inline" && (e.startInline ? e.startInline.push(i.start) : e.startInline = [i.start]));
				}
				"childTokens" in i && i.childTokens && (e.childTokens[i.name] = i.childTokens);
			}), r.extensions = e), n.renderer) {
				let i = this.defaults.renderer || new nn(this.defaults);
				for (let s in n.renderer) {
					if (!(s in i)) throw new Error(\`renderer '\${s}' does not exist\`);
					if (["options", "parser"].includes(s)) continue;
					let c = s, a = n.renderer[c], p = i[c];
					i[c] = (...f) => {
						let b = a.apply(i, f);
						return b === !1 && (b = p.apply(i, f)), b || "";
					};
				}
				r.renderer = i;
			}
			if (n.tokenizer) {
				let i = this.defaults.tokenizer || new tn(this.defaults);
				for (let s in n.tokenizer) {
					if (!(s in i)) throw new Error(\`tokenizer '\${s}' does not exist\`);
					if ([
						"options",
						"rules",
						"lexer"
					].includes(s)) continue;
					let c = s, a = n.tokenizer[c], p = i[c];
					i[c] = (...f) => {
						let b = a.apply(i, f);
						return b === !1 && (b = p.apply(i, f)), b;
					};
				}
				r.tokenizer = i;
			}
			if (n.hooks) {
				let i = this.defaults.hooks || new Ot();
				for (let s in n.hooks) {
					if (!(s in i)) throw new Error(\`hook '\${s}' does not exist\`);
					if (["options", "block"].includes(s)) continue;
					let c = s, a = n.hooks[c], p = i[c];
					Ot.passThroughHooks.has(s) ? i[c] = (f) => {
						if (this.defaults.async && Ot.passThroughHooksRespectAsync.has(s)) return (async () => {
							let T = await a.call(i, f);
							return p.call(i, T);
						})();
						let b = a.call(i, f);
						return p.call(i, b);
					} : i[c] = (...f) => {
						if (this.defaults.async) return (async () => {
							let T = await a.apply(i, f);
							return T === !1 && (T = await p.apply(i, f)), T;
						})();
						let b = a.apply(i, f);
						return b === !1 && (b = p.apply(i, f)), b;
					};
				}
				r.hooks = i;
			}
			if (n.walkTokens) {
				let i = this.defaults.walkTokens, s = n.walkTokens;
				r.walkTokens = function(c) {
					let a = [];
					return a.push(s.call(this, c)), i && (a = a.concat(i.call(this, c))), a;
				};
			}
			this.defaults = {
				...this.defaults,
				...r
			};
		}), this;
	}
	setOptions(t) {
		return this.defaults = {
			...this.defaults,
			...t
		}, this;
	}
	lexer(t, e) {
		return Re.lex(t, e ?? this.defaults);
	}
	parser(t, e) {
		return Oe.parse(t, e ?? this.defaults);
	}
	parseMarkdown(t) {
		return (e, n) => {
			let r = { ...n }, i = {
				...this.defaults,
				...r
			}, s = this.onError(!!i.silent, !!i.async);
			if (this.defaults.async === !0 && r.async === !1) return s(/* @__PURE__ */ new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
			if (typeof e > "u" || e === null) return s(/* @__PURE__ */ new Error("marked(): input parameter is undefined or null"));
			if (typeof e != "string") return s(/* @__PURE__ */ new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
			if (i.hooks && (i.hooks.options = i, i.hooks.block = t), i.async) return (async () => {
				let c = i.hooks ? await i.hooks.preprocess(e) : e, a = await (i.hooks ? await i.hooks.provideLexer(t) : t ? Re.lex : Re.lexInline)(c, i), p = i.hooks ? await i.hooks.processAllTokens(a) : a;
				i.walkTokens && await Promise.all(this.walkTokens(p, i.walkTokens));
				let f = await (i.hooks ? await i.hooks.provideParser(t) : t ? Oe.parse : Oe.parseInline)(p, i);
				return i.hooks ? await i.hooks.postprocess(f) : f;
			})().catch(s);
			try {
				i.hooks && (e = i.hooks.preprocess(e));
				let c = (i.hooks ? i.hooks.provideLexer(t) : t ? Re.lex : Re.lexInline)(e, i);
				i.hooks && (c = i.hooks.processAllTokens(c)), i.walkTokens && this.walkTokens(c, i.walkTokens);
				let a = (i.hooks ? i.hooks.provideParser(t) : t ? Oe.parse : Oe.parseInline)(c, i);
				return i.hooks && (a = i.hooks.postprocess(a)), a;
			} catch (c) {
				return s(c);
			}
		};
	}
	onError(t, e) {
		return (n) => {
			if (n.message += \`
Please report this to https://github.com/markedjs/marked.\`, t) {
				let r = "<p>An error occurred:</p><pre>" + we(n.message + "", !0) + "</pre>";
				return e ? Promise.resolve(r) : r;
			}
			if (e) return Promise.reject(n);
			throw n;
		};
	}
}, bt = new ti();
function j(t, e) {
	return bt.parse(t, e);
}
j.options = j.setOptions = function(t) {
	return bt.setOptions(t), j.defaults = bt.defaults, qr(j.defaults), j;
};
j.getDefaults = Pn;
j.defaults = st;
function ni(...t) {
	return bt.use(...t), j.defaults = bt.defaults, qr(j.defaults), j;
}
j.use = ni;
j.walkTokens = function(t, e) {
	return bt.walkTokens(t, e);
};
j.parseInline = bt.parseInline;
j.Parser = Oe;
j.parser = Oe.parse;
j.Renderer = nn;
j.TextRenderer = Nn;
j.Lexer = Re;
j.lexer = Re.lex;
j.Tokenizer = tn;
j.Hooks = Ot;
j.parse = j;
var ps = j.options, fs = j.setOptions, gs = j.walkTokens, ds = j.parseInline, ms = j, _s = Oe.parse, bs = Re.lex;
function xs(t, e) {
	this.v = t, this.k = e;
}
function Rr(t, e) {
	(e == null || e > t.length) && (e = t.length);
	for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
	return r;
}
function ys(t) {
	if (Array.isArray(t)) return t;
}
function ks(t, e) {
	var n = t == null ? null : typeof Symbol < "u" && t[Symbol.iterator] || t["@@iterator"];
	if (n != null) {
		var r, i, s, c, a = [], p = !0, f = !1;
		try {
			if (s = (n = n.call(t)).next, e === 0) {
				if (Object(n) !== n) return;
				p = !1;
			} else for (; !(p = (r = s.call(n)).done) && (a.push(r.value), a.length !== e); p = !0);
		} catch (b) {
			f = !0, i = b;
		} finally {
			try {
				if (!p && n.return != null && (c = n.return(), Object(c) !== c)) return;
			} finally {
				if (f) throw i;
			}
		}
		return a;
	}
}
function ws() {
	throw new TypeError(\`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.\`);
}
function Ts(t, e) {
	return ys(t) || ks(t, e) || Es(t, e) || ws();
}
function Es(t, e) {
	if (t) {
		if (typeof t == "string") return Rr(t, e);
		var n = {}.toString.call(t).slice(8, -1);
		return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Rr(t, e) : void 0;
	}
}
function En(t) {
	var e, n;
	function r(s, c) {
		try {
			var a = t[s](c), p = a.value, f = p instanceof xs;
			Promise.resolve(f ? p.v : p).then(function(b) {
				if (f) {
					var T = s === "return" && p.k ? s : "next";
					if (!p.k || b.done) return r(T, b);
					b = t[T](b).value;
				}
				i(!!a.done, b);
			}, function(b) {
				r("throw", b);
			});
		} catch (b) {
			i(2, b);
		}
	}
	function i(s, c) {
		s === 2 ? e.reject(c) : e.resolve({
			value: c,
			done: s
		}), (e = e.next) ? r(e.key, e.arg) : n = null;
	}
	this._invoke = function(s, c) {
		return new Promise(function(a, p) {
			var f = {
				key: s,
				arg: c,
				resolve: a,
				reject: p,
				next: null
			};
			n ? n = n.next = f : (e = n = f, r(s, c));
		});
	}, typeof t.return != "function" && (this.return = void 0);
}
En.prototype[typeof Symbol == "function" && Symbol.asyncIterator || "@@asyncIterator"] = function() {
	return this;
}, En.prototype.next = function(t) {
	return this._invoke("next", t);
}, En.prototype.throw = function(t) {
	return this._invoke("throw", t);
}, En.prototype.return = function(t) {
	return this._invoke("return", t);
};
const ri = Object.entries, Or = Object.setPrototypeOf, As = Object.isFrozen, Ss = Object.getPrototypeOf, vs = Object.getOwnPropertyDescriptor;
let ne = Object.freeze, se = Object.seal, vt = Object.create, ii = typeof Reflect < "u" && Reflect, er = ii.apply, tr = ii.construct;
ne || (ne = function(e) {
	return e;
});
se || (se = function(e) {
	return e;
});
er || (er = function(e, n) {
	for (var r = arguments.length, i = new Array(r > 2 ? r - 2 : 0), s = 2; s < r; s++) i[s - 2] = arguments[s];
	return e.apply(n, i);
});
tr || (tr = function(e) {
	for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++) r[i - 1] = arguments[i];
	return new e(...r);
});
const mt = ee(Array.prototype.forEach);
Array.prototype.indexOf;
const Rs = ee(Array.prototype.lastIndexOf), Mr = ee(Array.prototype.pop), Yt = ee(Array.prototype.push);
Array.prototype.slice;
const Os = ee(Array.prototype.splice), Mt = Array.isArray, Jt = ee(String.prototype.toLowerCase), Hn = ee(String.prototype.toString), Pr = ee(String.prototype.match), Kt = ee(String.prototype.replace), Nr = ee(String.prototype.indexOf), Ms = ee(String.prototype.trim), Ps = ee(Number.prototype.toString), Ns = ee(Boolean.prototype.toString), Lr = typeof BigInt > "u" ? null : ee(BigInt.prototype.toString), Cr = typeof Symbol > "u" ? null : ee(Symbol.prototype.toString), ge = ee(Object.prototype.hasOwnProperty), Qt = ee(Object.prototype.toString), ce = ee(RegExp.prototype.test), tt = Ls(TypeError);
function ee(t) {
	return function(e) {
		e instanceof RegExp && (e.lastIndex = 0);
		for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++) r[i - 1] = arguments[i];
		return er(t, e, r);
	};
}
function Ls(t) {
	return function() {
		for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++) n[r] = arguments[r];
		return tr(t, n);
	};
}
function $(t, e) {
	let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Jt;
	if (Or && Or(t, null), !Mt(e)) return t;
	let r = e.length;
	for (; r--;) {
		let i = e[r];
		if (typeof i == "string") {
			const s = n(i);
			s !== i && (As(e) || (e[r] = s), i = s);
		}
		t[i] = !0;
	}
	return t;
}
function Cs(t) {
	for (let e = 0; e < t.length; e++) ge(t, e) || (t[e] = null);
	return t;
}
function Te(t) {
	const e = vt(null);
	for (const r of ri(t)) {
		var n = Ts(r, 2);
		const i = n[0], s = n[1];
		ge(t, i) && (Mt(s) ? e[i] = Cs(s) : s && typeof s == "object" && s.constructor === Object ? e[i] = Te(s) : e[i] = s);
	}
	return e;
}
function Is(t) {
	switch (typeof t) {
		case "string": return t;
		case "number": return Ps(t);
		case "boolean": return Ns(t);
		case "bigint": return Lr ? Lr(t) : "0";
		case "symbol": return Cr ? Cr(t) : "Symbol()";
		case "undefined": return Qt(t);
		case "function":
		case "object": {
			if (t === null) return Qt(t);
			const e = t, n = ve(e, "toString");
			if (typeof n == "function") {
				const r = n(e);
				return typeof r == "string" ? r : Qt(r);
			}
			return Qt(t);
		}
		default: return Qt(t);
	}
}
function ve(t, e) {
	for (; t !== null;) {
		const r = vs(t, e);
		if (r) {
			if (r.get) return ee(r.get);
			if (typeof r.value == "function") return ee(r.value);
		}
		t = Ss(t);
	}
	function n() {
		return null;
	}
	return n;
}
function Ds(t) {
	try {
		return ce(t, ""), !0;
	} catch {
		return !1;
	}
}
const Ir = ne([
	"a",
	"abbr",
	"acronym",
	"address",
	"area",
	"article",
	"aside",
	"audio",
	"b",
	"bdi",
	"bdo",
	"big",
	"blink",
	"blockquote",
	"body",
	"br",
	"button",
	"canvas",
	"caption",
	"center",
	"cite",
	"code",
	"col",
	"colgroup",
	"content",
	"data",
	"datalist",
	"dd",
	"decorator",
	"del",
	"details",
	"dfn",
	"dialog",
	"dir",
	"div",
	"dl",
	"dt",
	"element",
	"em",
	"fieldset",
	"figcaption",
	"figure",
	"font",
	"footer",
	"form",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"head",
	"header",
	"hgroup",
	"hr",
	"html",
	"i",
	"img",
	"input",
	"ins",
	"kbd",
	"label",
	"legend",
	"li",
	"main",
	"map",
	"mark",
	"marquee",
	"menu",
	"menuitem",
	"meter",
	"nav",
	"nobr",
	"ol",
	"optgroup",
	"option",
	"output",
	"p",
	"picture",
	"pre",
	"progress",
	"q",
	"rp",
	"rt",
	"ruby",
	"s",
	"samp",
	"search",
	"section",
	"select",
	"shadow",
	"slot",
	"small",
	"source",
	"spacer",
	"span",
	"strike",
	"strong",
	"style",
	"sub",
	"summary",
	"sup",
	"table",
	"tbody",
	"td",
	"template",
	"textarea",
	"tfoot",
	"th",
	"thead",
	"time",
	"tr",
	"track",
	"tt",
	"u",
	"ul",
	"var",
	"video",
	"wbr"
]), Wn = ne([
	"svg",
	"a",
	"altglyph",
	"altglyphdef",
	"altglyphitem",
	"animatecolor",
	"animatemotion",
	"animatetransform",
	"circle",
	"clippath",
	"defs",
	"desc",
	"ellipse",
	"enterkeyhint",
	"exportparts",
	"filter",
	"font",
	"g",
	"glyph",
	"glyphref",
	"hkern",
	"image",
	"inputmode",
	"line",
	"lineargradient",
	"marker",
	"mask",
	"metadata",
	"mpath",
	"part",
	"path",
	"pattern",
	"polygon",
	"polyline",
	"radialgradient",
	"rect",
	"stop",
	"style",
	"switch",
	"symbol",
	"text",
	"textpath",
	"title",
	"tref",
	"tspan",
	"view",
	"vkern"
]), Gn = ne([
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence"
]), zs = ne([
	"animate",
	"color-profile",
	"cursor",
	"discard",
	"font-face",
	"font-face-format",
	"font-face-name",
	"font-face-src",
	"font-face-uri",
	"foreignobject",
	"hatch",
	"hatchpath",
	"mesh",
	"meshgradient",
	"meshpatch",
	"meshrow",
	"missing-glyph",
	"script",
	"set",
	"solidcolor",
	"unknown",
	"use"
]), qn = ne([
	"math",
	"menclose",
	"merror",
	"mfenced",
	"mfrac",
	"mglyph",
	"mi",
	"mlabeledtr",
	"mmultiscripts",
	"mn",
	"mo",
	"mover",
	"mpadded",
	"mphantom",
	"mroot",
	"mrow",
	"ms",
	"mspace",
	"msqrt",
	"mstyle",
	"msub",
	"msup",
	"msubsup",
	"mtable",
	"mtd",
	"mtext",
	"mtr",
	"munder",
	"munderover",
	"mprescripts"
]), $s = ne([
	"maction",
	"maligngroup",
	"malignmark",
	"mlongdiv",
	"mscarries",
	"mscarry",
	"msgroup",
	"mstack",
	"msline",
	"msrow",
	"semantics",
	"annotation",
	"annotation-xml",
	"mprescripts",
	"none"
]), Dr = ne(["#text"]), zr = ne([
	"accept",
	"action",
	"align",
	"alt",
	"autocapitalize",
	"autocomplete",
	"autopictureinpicture",
	"autoplay",
	"background",
	"bgcolor",
	"border",
	"capture",
	"cellpadding",
	"cellspacing",
	"checked",
	"cite",
	"class",
	"clear",
	"color",
	"cols",
	"colspan",
	"command",
	"commandfor",
	"controls",
	"controlslist",
	"coords",
	"crossorigin",
	"datetime",
	"decoding",
	"default",
	"dir",
	"disabled",
	"disablepictureinpicture",
	"disableremoteplayback",
	"download",
	"draggable",
	"enctype",
	"enterkeyhint",
	"exportparts",
	"face",
	"for",
	"headers",
	"height",
	"hidden",
	"high",
	"href",
	"hreflang",
	"id",
	"inert",
	"inputmode",
	"integrity",
	"ismap",
	"kind",
	"label",
	"lang",
	"list",
	"loading",
	"loop",
	"low",
	"max",
	"maxlength",
	"media",
	"method",
	"min",
	"minlength",
	"multiple",
	"muted",
	"name",
	"nonce",
	"noshade",
	"novalidate",
	"nowrap",
	"open",
	"optimum",
	"part",
	"pattern",
	"placeholder",
	"playsinline",
	"popover",
	"popovertarget",
	"popovertargetaction",
	"poster",
	"preload",
	"pubdate",
	"radiogroup",
	"readonly",
	"rel",
	"required",
	"rev",
	"reversed",
	"role",
	"rows",
	"rowspan",
	"spellcheck",
	"scope",
	"selected",
	"shape",
	"size",
	"sizes",
	"slot",
	"span",
	"srclang",
	"start",
	"src",
	"srcset",
	"step",
	"style",
	"summary",
	"tabindex",
	"title",
	"translate",
	"type",
	"usemap",
	"valign",
	"value",
	"width",
	"wrap",
	"xmlns"
]), Zn = ne([
	"accent-height",
	"accumulate",
	"additive",
	"alignment-baseline",
	"amplitude",
	"ascent",
	"attributename",
	"attributetype",
	"azimuth",
	"basefrequency",
	"baseline-shift",
	"begin",
	"bias",
	"by",
	"class",
	"clip",
	"clippathunits",
	"clip-path",
	"clip-rule",
	"color",
	"color-interpolation",
	"color-interpolation-filters",
	"color-profile",
	"color-rendering",
	"cx",
	"cy",
	"d",
	"dx",
	"dy",
	"diffuseconstant",
	"direction",
	"display",
	"divisor",
	"dominant-baseline",
	"dur",
	"edgemode",
	"elevation",
	"end",
	"exponent",
	"fill",
	"fill-opacity",
	"fill-rule",
	"filter",
	"filterunits",
	"flood-color",
	"flood-opacity",
	"font-family",
	"font-size",
	"font-size-adjust",
	"font-stretch",
	"font-style",
	"font-variant",
	"font-weight",
	"fx",
	"fy",
	"g1",
	"g2",
	"glyph-name",
	"glyphref",
	"gradientunits",
	"gradienttransform",
	"height",
	"href",
	"id",
	"image-rendering",
	"in",
	"in2",
	"intercept",
	"k",
	"k1",
	"k2",
	"k3",
	"k4",
	"kerning",
	"keypoints",
	"keysplines",
	"keytimes",
	"lang",
	"lengthadjust",
	"letter-spacing",
	"kernelmatrix",
	"kernelunitlength",
	"lighting-color",
	"local",
	"marker-end",
	"marker-mid",
	"marker-start",
	"markerheight",
	"markerunits",
	"markerwidth",
	"maskcontentunits",
	"maskunits",
	"max",
	"mask",
	"mask-type",
	"media",
	"method",
	"mode",
	"min",
	"name",
	"numoctaves",
	"offset",
	"operator",
	"opacity",
	"order",
	"orient",
	"orientation",
	"origin",
	"overflow",
	"paint-order",
	"path",
	"pathlength",
	"patterncontentunits",
	"patterntransform",
	"patternunits",
	"pointer-events",
	"points",
	"preservealpha",
	"preserveaspectratio",
	"primitiveunits",
	"r",
	"rx",
	"ry",
	"radius",
	"refx",
	"refy",
	"repeatcount",
	"repeatdur",
	"restart",
	"result",
	"rotate",
	"scale",
	"seed",
	"shape-rendering",
	"slope",
	"specularconstant",
	"specularexponent",
	"spreadmethod",
	"startoffset",
	"stddeviation",
	"stitchtiles",
	"stop-color",
	"stop-opacity",
	"stroke-dasharray",
	"stroke-dashoffset",
	"stroke-linecap",
	"stroke-linejoin",
	"stroke-miterlimit",
	"stroke-opacity",
	"stroke",
	"stroke-width",
	"style",
	"surfacescale",
	"systemlanguage",
	"tabindex",
	"tablevalues",
	"targetx",
	"targety",
	"transform",
	"transform-origin",
	"text-anchor",
	"text-decoration",
	"text-orientation",
	"text-rendering",
	"textlength",
	"type",
	"u1",
	"u2",
	"unicode",
	"values",
	"vector-effect",
	"viewbox",
	"visibility",
	"version",
	"vert-adv-y",
	"vert-origin-x",
	"vert-origin-y",
	"width",
	"word-spacing",
	"wrap",
	"writing-mode",
	"xchannelselector",
	"ychannelselector",
	"x",
	"x1",
	"x2",
	"xmlns",
	"y",
	"y1",
	"y2",
	"z",
	"zoomandpan"
]), $r = ne([
	"accent",
	"accentunder",
	"align",
	"bevelled",
	"close",
	"columnalign",
	"columnlines",
	"columnspacing",
	"columnspan",
	"denomalign",
	"depth",
	"dir",
	"display",
	"displaystyle",
	"encoding",
	"fence",
	"frame",
	"height",
	"href",
	"id",
	"largeop",
	"length",
	"linethickness",
	"lquote",
	"lspace",
	"mathbackground",
	"mathcolor",
	"mathsize",
	"mathvariant",
	"maxsize",
	"minsize",
	"movablelimits",
	"notation",
	"numalign",
	"open",
	"rowalign",
	"rowlines",
	"rowspacing",
	"rowspan",
	"rspace",
	"rquote",
	"scriptlevel",
	"scriptminsize",
	"scriptsizemultiplier",
	"selection",
	"separator",
	"separators",
	"stretchy",
	"subscriptshift",
	"supscriptshift",
	"symmetric",
	"voffset",
	"width",
	"xmlns"
]), An = ne([
	"xlink:href",
	"xml:id",
	"xlink:title",
	"xml:space",
	"xmlns:xlink"
]), Bs = se(/{{[\\w\\W]*|^[\\w\\W]*}}/g), Us = se(/<%[\\w\\W]*|^[\\w\\W]*%>/g), js = se(/\\\${[\\w\\W]*/g), Fs = se(/^data-[\\-\\w.\\u00B7-\\uFFFF]+$/), Hs = se(/^aria-[\\-\\w]+$/), Br = se(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\\-]+(?:[^a-z+.\\-:]|$))/i), Ws = se(/^(?:\\w+script|data):/i), Gs = se(/[\\u0000-\\u0020\\u00A0\\u1680\\u180E\\u2000-\\u2029\\u205F\\u3000]/g), qs = se(/^html$/i), Zs = se(/^[a-z][.\\w]*(-[.\\w]+)+$/i), Ur = se(/<[/\\w!]/g), jr = se(/<[/\\w]/g), Vs = se(/<\\/no(script|embed|frames)/i), Xs = se(/\\/>/i), ke = {
	element: 1,
	attribute: 2,
	text: 3,
	cdataSection: 4,
	entityReference: 5,
	entityNode: 6,
	processingInstruction: 7,
	comment: 8,
	document: 9,
	documentType: 10,
	documentFragment: 11,
	notation: 12
}, si = [
	"style",
	"script",
	"xmp",
	"iframe",
	"noembed",
	"noframes",
	"plaintext",
	"noscript"
], Ys = ne($({}, si)), Ks = (function() {
	const t = {};
	return mt(si, (e) => {
		t[e] = se(new RegExp("</" + e + "(?=[\\\\t\\\\n\\\\f\\\\r />])", "i"));
	}), ne(t);
})(), Qs = function() {
	return typeof window > "u" ? null : window;
}, Js = function(e, n) {
	if (typeof e != "object" || typeof e.createPolicy != "function") return null;
	let r = null;
	const i = "data-tt-policy-suffix";
	n && n.hasAttribute(i) && (r = n.getAttribute(i));
	const s = "dompurify" + (r ? "#" + r : "");
	try {
		return e.createPolicy(s, {
			createHTML(c) {
				return c;
			},
			createScriptURL(c) {
				return c;
			}
		});
	} catch {
		return console.warn("TrustedTypes policy " + s + " could not be created."), null;
	}
}, Fr = function() {
	return {
		afterSanitizeAttributes: [],
		afterSanitizeElements: [],
		afterSanitizeShadowDOM: [],
		beforeSanitizeAttributes: [],
		beforeSanitizeElements: [],
		beforeSanitizeShadowDOM: [],
		uponSanitizeAttribute: [],
		uponSanitizeElement: [],
		uponSanitizeShadowNode: []
	};
}, nt = function(e, n, r, i) {
	return ge(e, n) && Mt(e[n]) ? $(i.base ? Te(i.base) : {}, e[n], i.transform) : r;
}, Vn = function(e, n, r) {
	const i = ge(e, n) ? e[n] : void 0;
	return i && typeof i == "object" ? Te(i) : r();
};
function oi() {
	let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Qs();
	const e = (_) => oi(_);
	if (e.version = "3.4.16", e.removed = [], !t || !t.document || t.document.nodeType !== ke.document || !t.Element) return e.isSupported = !1, e;
	let n = t.document;
	const r = n, i = r.currentScript;
	t.DocumentFragment;
	const s = t.HTMLTemplateElement, c = t.Node, a = t.Element, p = t.NodeFilter;
	t.NamedNodeMap === void 0 && (t.NamedNodeMap || t.MozNamedAttrMap), t.HTMLFormElement;
	const f = t.DOMParser, b = t.trustedTypes, T = a.prototype, S = ve(T, "cloneNode"), C = ve(T, "remove"), v = ve(T, "removeAttributeNode"), z = ve(T, "nextSibling"), O = ve(T, "childNodes"), W = ve(T, "parentNode"), re = ve(T, "shadowRoot"), ie = ve(T, "attributes"), me = c && c.prototype ? ve(c.prototype, "nodeType") : null, Ne = c && c.prototype ? ve(c.prototype, "nodeName") : null, We = c && c.prototype ? ve(c.prototype, "ownerDocument") : null, _e = function(o) {
		return me ? me(o) : o.nodeType;
	}, Me = function(o) {
		return Ne ? Ne(o) : o.nodeName;
	};
	if (typeof s == "function") {
		const _ = n.createElement("template");
		_.content && _.content.ownerDocument && (n = _.content.ownerDocument);
	}
	let te, Le = "", xt, Nt = !1, Ge = 0;
	const an = function() {
		if (Ge > 0) throw tt("A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the \\"DOMPurify and Trusted Types\\" section of the README.");
	}, qe = function(o) {
		an(), Ge++;
		try {
			return te.createHTML(o);
		} finally {
			Ge--;
		}
	}, ot = function(o) {
		an(), Ge++;
		try {
			return te.createScriptURL(o);
		} finally {
			Ge--;
		}
	}, Cn = function() {
		return Nt || (xt = Js(b, i), Nt = !0), xt;
	}, yt = n, Lt = yt.implementation, at = yt.createNodeIterator, In = yt.createDocumentFragment, Dn = yt.getElementsByTagName, zn = r.importNode;
	let Z = Fr();
	e.isSupported = typeof ri == "function" && typeof W == "function" && Lt && Lt.createHTMLDocument !== void 0;
	const cr = Bs, ur = Us, hr = js, pr = Fs, fr = Hs, gr = Ws, $n = Gs, kt = Zs;
	let ln = Br, G = null;
	const Ct = $({}, [
		...Ir,
		...Wn,
		...Gn,
		...qn,
		...Dr
	]);
	let q = null;
	const It = $({}, [
		...zr,
		...Zn,
		...$r,
		...An
	]);
	let Ae = Object.seal(vt(null, {
		tagNameCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		attributeNameCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		allowCustomizedBuiltInElements: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: !1
		}
	})), lt = null, cn = null;
	const Ce = Object.seal(vt(null, {
		tagCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		attributeCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		}
	}));
	let Dt = !0, zt = !0, un = !1, $t = !0, ae = !1, Ie = !0, pe = !1, Ze = !1, ct = null, wt = null, Bt = !1, Ve = !1, Tt = !1, Et = !1, Ut = !0, hn = !1;
	const pn = "user-content-";
	let jt = !0, ut = !1, $e = {}, Be = null;
	const fn = $({}, [
		"annotation-xml",
		"audio",
		"colgroup",
		"desc",
		"foreignobject",
		"head",
		"iframe",
		"math",
		"mi",
		"mn",
		"mo",
		"ms",
		"mtext",
		"noembed",
		"noframes",
		"noscript",
		"plaintext",
		"script",
		"selectedcontent",
		"style",
		"svg",
		"template",
		"thead",
		"title",
		"video",
		"xmp"
	]);
	let Ft = null;
	const Ue = $({}, [
		"audio",
		"video",
		"img",
		"source",
		"image",
		"track"
	]);
	let l = null;
	const m = $({}, [
		"alt",
		"class",
		"for",
		"id",
		"label",
		"name",
		"pattern",
		"placeholder",
		"role",
		"summary",
		"title",
		"value",
		"style",
		"xmlns"
	]), k = "http://www.w3.org/1998/Math/MathML", N = "http://www.w3.org/2000/svg", B = "http://www.w3.org/1999/xhtml";
	let F = B, E = !1, w = null;
	const M = $({}, [
		k,
		N,
		B
	], Hn), J = ne([
		"mi",
		"mo",
		"mn",
		"ms",
		"mtext"
	]);
	let V = $({}, J);
	const Xe = ne(["annotation-xml"]);
	let ht = $({}, Xe);
	const Ht = $({}, [
		"title",
		"style",
		"font",
		"a",
		"script"
	]);
	let pt = null;
	const Wt = ["application/xhtml+xml", "text/html"], Bn = "text/html";
	let X = null, Ye = null;
	const gn = n.createElement("form"), ft = function(o) {
		return o instanceof RegExp || o instanceof Function;
	}, Gt = function() {
		let o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		if (Ye && Ye === o) return;
		(!o || typeof o != "object") && (o = {}), o = Te(o), pt = Wt.indexOf(o.PARSER_MEDIA_TYPE) === -1 ? Bn : o.PARSER_MEDIA_TYPE, X = pt === "application/xhtml+xml" ? Hn : Jt, G = nt(o, "ALLOWED_TAGS", Ct, { transform: X }), q = nt(o, "ALLOWED_ATTR", It, { transform: X }), w = nt(o, "ALLOWED_NAMESPACES", M, { transform: Hn }), l = nt(o, "ADD_URI_SAFE_ATTR", m, {
			transform: X,
			base: m
		}), Ft = nt(o, "ADD_DATA_URI_TAGS", Ue, {
			transform: X,
			base: Ue
		}), Be = nt(o, "FORBID_CONTENTS", fn, { transform: X }), lt = nt(o, "FORBID_TAGS", Te({}), { transform: X }), cn = nt(o, "FORBID_ATTR", Te({}), { transform: X }), $e = ge(o, "USE_PROFILES") ? o.USE_PROFILES && typeof o.USE_PROFILES == "object" ? Te(o.USE_PROFILES) : o.USE_PROFILES : !1, Dt = o.ALLOW_ARIA_ATTR !== !1, zt = o.ALLOW_DATA_ATTR !== !1, un = o.ALLOW_UNKNOWN_PROTOCOLS || !1, $t = o.ALLOW_SELF_CLOSE_IN_ATTR !== !1, ae = o.SAFE_FOR_TEMPLATES || !1, Ie = o.SAFE_FOR_XML !== !1, pe = o.WHOLE_DOCUMENT || !1, Ve = o.RETURN_DOM || !1, Tt = o.RETURN_DOM_FRAGMENT || !1, Et = o.RETURN_TRUSTED_TYPE || !1, Bt = o.FORCE_BODY || !1, Ut = o.SANITIZE_DOM !== !1, hn = o.SANITIZE_NAMED_PROPS || !1, jt = o.KEEP_CONTENT !== !1, ut = o.IN_PLACE || !1, ln = Ds(o.ALLOWED_URI_REGEXP) ? o.ALLOWED_URI_REGEXP : Br, F = typeof o.NAMESPACE == "string" ? o.NAMESPACE : B, V = Vn(o, "MATHML_TEXT_INTEGRATION_POINTS", () => $({}, J)), ht = Vn(o, "HTML_INTEGRATION_POINTS", () => $({}, Xe));
		const u = Vn(o, "CUSTOM_ELEMENT_HANDLING", () => vt(null));
		if (Ae = vt(null), ge(u, "tagNameCheck") && ft(u.tagNameCheck) && (Ae.tagNameCheck = u.tagNameCheck), ge(u, "attributeNameCheck") && ft(u.attributeNameCheck) && (Ae.attributeNameCheck = u.attributeNameCheck), ge(u, "allowCustomizedBuiltInElements") && typeof u.allowCustomizedBuiltInElements == "boolean" && (Ae.allowCustomizedBuiltInElements = u.allowCustomizedBuiltInElements), se(Ae), ae && (zt = !1), Tt && (Ve = !0), $e && (G = $({}, Dr), q = vt(null), $e.html === !0 && ($(G, Ir), $(q, zr)), $e.svg === !0 && ($(G, Wn), $(q, Zn), $(q, An)), $e.svgFilters === !0 && ($(G, Gn), $(q, Zn), $(q, An)), $e.mathMl === !0 && ($(G, qn), $(q, $r), $(q, An))), Ce.tagCheck = null, Ce.attributeCheck = null, ge(o, "ADD_TAGS") && (typeof o.ADD_TAGS == "function" ? Ce.tagCheck = o.ADD_TAGS : Mt(o.ADD_TAGS) && (G === Ct && (G = Te(G)), $(G, o.ADD_TAGS, X))), ge(o, "ADD_ATTR") && (typeof o.ADD_ATTR == "function" ? Ce.attributeCheck = o.ADD_ATTR : Mt(o.ADD_ATTR) && (q === It && (q = Te(q)), $(q, o.ADD_ATTR, X))), ge(o, "ADD_FORBID_CONTENTS") && Mt(o.ADD_FORBID_CONTENTS) && (Be === fn && (Be = Te(Be)), $(Be, o.ADD_FORBID_CONTENTS, X)), jt && (G["#text"] = !0), pe && $(G, [
			"html",
			"head",
			"body"
		]), G.table && ($(G, ["tbody"]), delete lt.tbody), o.TRUSTED_TYPES_POLICY) {
			if (typeof o.TRUSTED_TYPES_POLICY.createHTML != "function") throw tt("TRUSTED_TYPES_POLICY configuration option must provide a \\"createHTML\\" hook.");
			if (typeof o.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw tt("TRUSTED_TYPES_POLICY configuration option must provide a \\"createScriptURL\\" hook.");
			const d = te;
			te = o.TRUSTED_TYPES_POLICY;
			try {
				Le = qe("");
			} catch (h) {
				throw te = d, h;
			}
		} else o.TRUSTED_TYPES_POLICY === null ? (te = void 0, Le = "") : (te === void 0 && (te = Cn()), te && typeof Le == "string" && (Le = qe("")));
		ne && ne(o), Ye = o;
	}, dn = $({}, [
		...Wn,
		...Gn,
		...zs
	]), mn = $({}, [...qn, ...$s]), De = function(o, u, d) {
		return u.namespaceURI === B ? o === "svg" : u.namespaceURI === k ? o === "svg" && (d === "annotation-xml" || V[d]) : !!dn[o];
	}, _n = function(o, u, d) {
		return u.namespaceURI === B ? o === "math" : u.namespaceURI === N ? o === "math" && ht[d] : !!mn[o];
	}, bn = function(o, u, d) {
		return u.namespaceURI === N && !ht[d] || u.namespaceURI === k && !V[d] ? !1 : !mn[o] && (Ht[o] || !dn[o]);
	}, Un = function(o) {
		let u = W(o);
		(!u || !u.tagName) && (u = {
			namespaceURI: F,
			tagName: "template"
		});
		const d = Jt(o.tagName), h = Jt(u.tagName);
		return w[o.namespaceURI] ? o.namespaceURI === N ? De(d, u, h) : o.namespaceURI === k ? _n(d, u, h) : o.namespaceURI === B ? bn(d, u, h) : !!(pt === "application/xhtml+xml" && w[o.namespaceURI]) : !1;
	}, ze = function(o) {
		Yt(e.removed, { element: o });
		try {
			W(o).removeChild(o);
		} catch {
			if (C(o), !W(o)) throw tt("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
		}
	}, xn = function(o, u, d) {
		try {
			v(o, u);
		} catch {
			try {
				o.removeAttribute(d);
			} catch {}
		}
	}, je = function(o) {
		R(o);
		const u = O(o);
		if (u) {
			const h = [];
			mt(u, (g) => {
				Yt(h, g);
			}), mt(h, (g) => {
				try {
					C(g);
				} catch {}
			});
		}
		const d = ie(o);
		if (d) for (let h = d.length - 1; h >= 0; --h) {
			const g = d[h], y = g && g.name;
			typeof y == "string" && xn(o, g, y);
		}
	}, Fe = function(o, u, d) {
		if (!d) try {
			d = u.getAttributeNode(o);
		} catch {
			d = null;
		}
		Yt(e.removed, {
			attribute: d || null,
			from: u
		});
		try {
			d ? v(u, d) : u.removeAttribute(o);
		} catch {
			try {
				u.removeAttribute(o);
			} catch {}
		}
		if (o === "is") if (Ve || Tt) try {
			ze(u);
		} catch {}
		else try {
			u.setAttribute(o, "");
		} catch {}
	}, x = function(o) {
		const u = ie(o);
		if (u) for (let d = u.length - 1; d >= 0; --d) {
			const h = u[d], g = h && h.name;
			typeof g != "string" || q[X(g)] || xn(o, h, g);
		}
	}, R = function(o) {
		const u = [o];
		for (; u.length > 0;) {
			const d = u.pop();
			_e(d) === ke.element && x(d);
			const h = O(d);
			if (h) for (let g = h.length - 1; g >= 0; --g) u.push(h[g]);
		}
	}, D = function(o, u) {
		return Ie ? o === "patchsrc" ? !0 : o === "for" && u !== "label" && u !== "output" : !1;
	}, H = function(o) {
		if (!Ie) return;
		const u = [o];
		for (; u.length > 0;) {
			const d = u.pop(), h = _e(d);
			if (h === ke.processingInstruction || h === ke.comment && ce(jr, d.data)) {
				try {
					C(d);
				} catch {}
				continue;
			}
			if (h === ke.element) {
				const y = d, A = X(Me(d));
				try {
					y.hasAttribute && y.hasAttribute("patchsrc") && y.removeAttribute("patchsrc"), y.hasAttribute && y.hasAttribute("for") && D("for", A) && y.removeAttribute("for");
				} catch {}
			}
			const g = O(d);
			if (g) for (let y = g.length - 1; y >= 0; --y) u.push(g[y]);
		}
	}, Y = function(o) {
		let u = null, d = null;
		if (Bt) o = "<remove></remove>" + o;
		else {
			const y = Pr(o, /^[\\r\\n\\t ]+/);
			d = y && y[0];
		}
		pt === "application/xhtml+xml" && F === B && (o = "<html xmlns=\\"http://www.w3.org/1999/xhtml\\"><head></head><body>" + o + "</body></html>");
		const h = te ? qe(o) : o;
		if (F === B) try {
			u = new f().parseFromString(h, pt);
		} catch {}
		if (!u || !u.documentElement) {
			u = Lt.createDocument(F, "template", null);
			try {
				u.documentElement.innerHTML = E ? Le : h;
			} catch {}
		}
		const g = u.body || u.documentElement;
		return o && d && g.insertBefore(n.createTextNode(d), g.childNodes[0] || null), F === B ? Dn.call(u, pe ? "html" : "body")[0] : pe ? u.documentElement : g;
	}, be = function(o) {
		const u = We ? We(o) : o.ownerDocument;
		return at.call(u || o, o, p.SHOW_ELEMENT | p.SHOW_COMMENT | p.SHOW_TEXT | p.SHOW_PROCESSING_INSTRUCTION | p.SHOW_CDATA_SECTION, null);
	}, fe = function(o) {
		return o = Kt(o, cr, " "), o = Kt(o, ur, " "), o = Kt(o, hr, " "), o;
	}, xe = function(o) {
		var u;
		o.normalize();
		const d = We ? We(o) : o.ownerDocument, h = at.call(d || o, o, p.SHOW_TEXT | p.SHOW_COMMENT | p.SHOW_CDATA_SECTION | p.SHOW_PROCESSING_INSTRUCTION, null);
		let g = h.nextNode();
		for (; g;) g.data = fe(g.data), g = h.nextNode();
		const y = (u = o.querySelectorAll) === null || u === void 0 ? void 0 : u.call(o, "template");
		y && mt(y, (A) => {
			Pe(A.content) && xe(A.content);
		});
	}, le = function(o) {
		const u = Ne ? Ne(o) : null;
		return typeof u != "string" || X(u) !== "form" ? !1 : typeof o.nodeName != "string" || typeof o.textContent != "string" || typeof o.removeChild != "function" || o.attributes !== ie(o) || typeof o.removeAttribute != "function" || typeof o.removeAttributeNode != "function" || typeof o.getAttributeNode != "function" || typeof o.setAttribute != "function" || typeof o.namespaceURI != "string" || typeof o.insertBefore != "function" || typeof o.hasChildNodes != "function" || o.nodeType !== me(o) || o.childNodes !== O(o);
	}, Pe = function(o) {
		if (!me || typeof o != "object" || o === null) return !1;
		try {
			return me(o) === ke.documentFragment;
		} catch {
			return !1;
		}
	}, Ke = function(o) {
		if (!me || typeof o != "object" || o === null) return !1;
		try {
			return typeof me(o) == "number";
		} catch {
			return !1;
		}
	};
	function ye(_, o, u) {
		_.length !== 0 && mt(_, (d) => {
			d.call(e, o, u, Ye);
		});
	}
	const yn = function(o, u) {
		return !!(Ie && o.hasChildNodes() && !Ke(o.firstElementChild) && ce(Ur, o.textContent) && ce(Ur, o.innerHTML) || Ie && o.namespaceURI === B && Ys[u] && (Ke(o.firstElementChild) || typeof o.textContent == "string" && ce(Ks[u], o.textContent)) || o.nodeType === ke.processingInstruction || Ie && o.nodeType === ke.comment && ce(jr, o.data));
	}, At = function(o, u) {
		if (o instanceof RegExp) return ce(o, u);
		if (o instanceof Function) {
			for (var d = arguments.length, h = new Array(d > 2 ? d - 2 : 0), g = 2; g < d; g++) h[g - 2] = arguments[g];
			return !!o(u, ...h);
		}
		return !1;
	}, jn = function(o, u, d) {
		if (!lt[u] && wn(u) && At(Ae.tagNameCheck, u)) return !1;
		if (jt && !Be[u]) {
			const h = W(o), g = O(o);
			if (g && h) {
				const y = g.length;
				for (let A = y - 1; A >= 0; --A) {
					const I = o === d ? S(g[A], !0) : g[A];
					h.insertBefore(I, z(o));
				}
			}
		}
		return ze(o), !0;
	}, kn = function(o, u, d, h) {
		return o.length === 0 ? u : u === d || u === h ? Te(u) : u;
	}, Qe = function(o, u) {
		return o === u || W(o) !== null ? !1 : (ut && R(o), !0);
	}, gt = function(o, u) {
		if (ye(Z.beforeSanitizeElements, o, null), Qe(o, u)) return !0;
		if (le(o)) return ze(o), !0;
		const d = X(Me(o));
		if (G = kn(Z.uponSanitizeElement, G, Ct, ct), ye(Z.uponSanitizeElement, o, {
			tagName: d,
			allowedTags: G
		}), Qe(o, u)) return !0;
		if (yn(o, d)) return ze(o), !0;
		if (lt[d] || !(Ce.tagCheck instanceof Function && Ce.tagCheck(d)) && !G[d]) {
			const h = jn(o, d, u);
			return h === !1 && (ye(Z.afterSanitizeElements, o, null), Qe(o, u)) ? !0 : h;
		}
		if (_e(o) === ke.element && !Un(o) || (d === "noscript" || d === "noembed" || d === "noframes") && ce(Vs, o.innerHTML)) return ze(o), !0;
		if (ae && o.nodeType === ke.text) {
			const h = fe(o.textContent);
			o.textContent !== h && (Yt(e.removed, { element: o.cloneNode() }), o.textContent = h);
		}
		return ye(Z.afterSanitizeElements, o, null), Qe(o, u);
	}, qt = function(o, u, d) {
		if (cn[u] || D(u, o) || Ut && (u === "id" || u === "name") && (d in n || d in gn)) return !1;
		const h = q[u] || Ce.attributeCheck instanceof Function && Ce.attributeCheck(u, o);
		return zt && ce(pr, u) || Dt && ce(fr, u) ? !0 : h ? l[u] || ce(ln, Kt(d, $n, "")) || (u === "src" || u === "xlink:href" || u === "href") && o !== "script" && Nr(d, "data:") === 0 && Ft[o] || un && !ce(gr, Kt(d, $n, "")) ? !0 : !d : wn(o) && At(Ae.tagNameCheck, o) && At(Ae.attributeNameCheck, u, o) || u === "is" && Ae.allowCustomizedBuiltInElements && At(Ae.tagNameCheck, d);
	}, Se = $({}, [
		"annotation-xml",
		"color-profile",
		"font-face",
		"font-face-format",
		"font-face-name",
		"font-face-src",
		"font-face-uri",
		"missing-glyph"
	]), wn = function(o) {
		return !Se[Jt(o)] && ce(kt, o);
	}, Zt = function(o, u, d, h) {
		if (te && typeof b == "object" && typeof b.getAttributeType == "function" && !d) switch (b.getAttributeType(o, u)) {
			case "TrustedHTML": return qe(h);
			case "TrustedScriptURL": return ot(h);
		}
		return h;
	}, P = function(o, u, d, h) {
		try {
			return d ? o.setAttributeNS(d, u, h) : o.setAttribute(u, h), le(o) ? (ze(o), !1) : !0;
		} catch {
			return Fe(u, o), !1;
		}
	}, Vt = function(o, u) {
		if (ye(Z.beforeSanitizeAttributes, o, null), Qe(o, u)) return;
		const d = o.attributes;
		if (!d || le(o)) return;
		q = kn(Z.uponSanitizeAttribute, q, It, wt);
		const h = {
			attrName: "",
			attrValue: "",
			keepAttr: !0,
			allowedAttributes: q,
			forceKeepAttr: void 0
		};
		let g = d.length;
		const y = X(o.nodeName);
		for (; g--;) {
			const A = d[g], I = A.name, Q = A.namespaceURI, ue = A.value, Je = X(I), Fn = ue;
			let he = I === "value" ? Fn : Ms(Fn), dr = !1;
			if (h.attrName = Je, h.attrValue = he, h.keepAttr = !0, h.forceKeepAttr = void 0, ye(Z.uponSanitizeAttribute, o, h), he = h.attrValue, hn && (Je === "id" || Je === "name") && Nr(he, pn) !== 0 && (Fe(I, o, A), he = pn + he, dr = !0), Ie && ce(/((--!?|])>)|<\\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, he)) {
				Fe(I, o, A);
				continue;
			}
			if (Je === "attributename" && Pr(he, "href")) {
				Fe(I, o, A);
				continue;
			}
			if (!h.forceKeepAttr) {
				if (!h.keepAttr) {
					Fe(I, o, A);
					continue;
				}
				if (!$t && ce(Xs, he)) {
					Fe(I, o, A);
					continue;
				}
				if (ae && (he = fe(he)), !qt(y, Je, he)) {
					Fe(I, o, A);
					continue;
				}
				he = Zt(y, Je, Q, he), he !== Fn && P(o, I, Q, he) && dr && Mr(e.removed);
			}
		}
		ye(Z.afterSanitizeAttributes, o, null), Qe(o, u);
	}, K = function(o) {
		let u = null;
		const d = be(o);
		for (ye(Z.beforeSanitizeShadowDOM, o, null); u = d.nextNode();) if (ye(Z.uponSanitizeShadowNode, u, null), gt(u, o), Vt(u, o), Pe(u.content) && K(u.content), _e(u) === ke.element) {
			const h = re(u);
			Pe(h) && (U(h), K(h));
		}
		ye(Z.afterSanitizeShadowDOM, o, null);
	}, U = function(o) {
		const u = [{
			node: o,
			shadow: null
		}];
		for (; u.length > 0;) {
			const d = u.pop();
			if (d.shadow) {
				K(d.shadow);
				continue;
			}
			const h = d.node, g = _e(h) === ke.element, y = O(h);
			if (y) for (let A = y.length - 1; A >= 0; --A) u.push({
				node: y[A],
				shadow: null
			});
			if (g) {
				const A = Ne ? Ne(h) : null;
				if (typeof A == "string" && X(A) === "template") {
					const I = h.content;
					Pe(I) && u.push({
						node: I,
						shadow: null
					});
				}
			}
			if (g) {
				const A = re(h);
				Pe(A) && u.push({
					node: null,
					shadow: A
				}, {
					node: A,
					shadow: null
				});
			}
		}
	};
	return e.sanitize = function(_) {
		let o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, u = null, d = null, h = null, g = null;
		if (E = !_, E && (_ = "<!-->"), typeof _ != "string" && !Ke(_) && (_ = Is(_), typeof _ != "string")) throw tt("dirty is not a string, aborting");
		if (!e.isSupported) return _;
		Ze ? (G = ct, q = wt) : Gt(o), (Z.uponSanitizeElement.length > 0 || Z.uponSanitizeAttribute.length > 0) && (G = Te(G)), Z.uponSanitizeAttribute.length > 0 && (q = Te(q)), e.removed = [];
		const y = ut && typeof _ != "string" && Ke(_);
		if (y) {
			H(_);
			const Q = Me(_);
			if (typeof Q == "string") {
				const ue = X(Q);
				if (!G[ue] || lt[ue]) throw je(_), tt("root node is forbidden and cannot be sanitized in-place");
			}
			if (le(_)) throw je(_), tt("root node is clobbered and cannot be sanitized in-place");
			try {
				U(_);
			} catch (ue) {
				throw je(_), ue;
			}
		} else if (Ke(_)) u = Y("<!---->"), d = u.ownerDocument.importNode(_, !0), d.nodeType === ke.element && d.nodeName === "BODY" || d.nodeName === "HTML" ? u = d : u.appendChild(d), U(u);
		else {
			if (!Ve && !ae && !pe && _.indexOf("<") === -1) return te && Et ? qe(_) : _;
			if (u = Y(_), !u) return Ve ? null : Et ? Le : "";
		}
		u && Bt && ze(u.firstChild);
		const A = y ? _ : u;
		try {
			const Q = be(A);
			for (; h = Q.nextNode();) gt(h, A), Vt(h, A), Pe(h.content) && K(h.content);
		} catch (Q) {
			throw y && (je(_), mt(e.removed, (ue) => {
				ue.element && R(ue.element);
			})), Q;
		}
		if (y) {
			let Q = !1;
			if (mt(e.removed, (ue) => {
				ue.element && (ue.element === _ && (Q = !0), R(ue.element));
			}), Q) throw tt("a node selected for removal could not be safely returned; refusing to sanitize in place");
			return ae && xe(_), _;
		}
		if (Ve) {
			if (ae && xe(u), Tt) for (g = In.call(u.ownerDocument); u.firstChild;) g.appendChild(u.firstChild);
			else g = u;
			return (q.shadowroot || q.shadowrootmode) && (g = zn.call(r, g, !0)), g;
		}
		let I = pe ? u.outerHTML : u.innerHTML;
		return pe && G["!doctype"] && u.ownerDocument && u.ownerDocument.doctype && u.ownerDocument.doctype.name && ce(qs, u.ownerDocument.doctype.name) && (I = "<!DOCTYPE " + u.ownerDocument.doctype.name + \`>
\` + I), ae && (I = fe(I)), te && Et ? qe(I) : I;
	}, e.setConfig = function() {
		let _ = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		Gt(_), Ze = !0, ct = G, wt = q;
	}, e.clearConfig = function() {
		Ye = null, Ze = !1, ct = null, wt = null, te = xt, Le = "";
	}, e.isValidAttribute = function(_, o, u) {
		Ye || Gt({});
		const d = X(_), h = X(o);
		return qt(d, h, u);
	}, e.addHook = function(_, o) {
		typeof o == "function" && ge(Z, _) && Yt(Z[_], o);
	}, e.removeHook = function(_, o) {
		if (ge(Z, _)) {
			if (o !== void 0) {
				const u = Rs(Z[_], o);
				return u === -1 ? void 0 : Os(Z[_], u, 1)[0];
			}
			return Mr(Z[_]);
		}
	}, e.removeHooks = function(_) {
		ge(Z, _) && (Z[_] = []);
	}, e.removeAllHooks = function() {
		Z = Fr();
	}, e;
}
var ai = oi();
function li(t) {
	if (t.startsWith("---")) {
		const e = t.indexOf(\`
---\`, 3);
		if (e !== -1) {
			const n = t.slice(3, e + 0).trim(), r = t.slice(e + 4).trimStart(), i = {};
			return n.split(/\\r?\\n/).forEach((s) => {
				const c = s.match(/^([^:]+):\\s*(.*)$/);
				c && (i[c[1].trim()] = c[2].trim());
			}), {
				content: r,
				data: i
			};
		}
	}
	return {
		content: t,
		data: {}
	};
}
let Mn = null;
if (typeof process < "u" && process?.hrtime && typeof process.hrtime.bigint == "function") try {
	const t = Number(process.hrtime.bigint() / 1000000n);
	Mn = Date.now() - t;
} catch {
	Mn = null;
}
const Ee = () => {
	const t = Date.now();
	if (typeof performance < "u" && typeof performance?.now == "function" && typeof performance?.timeOrigin == "number") try {
		const e = performance.timeOrigin + performance.now();
		return Math.abs(e - t) < 1e3 ? e : t;
	} catch {}
	if (Mn != null) try {
		const e = Number(process.hrtime.bigint() / 1000000n) + Mn;
		return Math.abs(e - t) < 1e3 ? e : t;
	} catch {
		return t;
	}
	return t;
}, Ln = 1e3, eo = 60 * Ln, to = 30 * Ln, no = 1e3, Hr = eo;
var ro = class {
	/**
	* Create a PowerCache.
	* @param {Object} [options]
	* @param {number} [options.maxEntries=Infinity] Maximum number of entries.
	* @param {number} [options.maxWeight=Infinity] Maximum total weight across entries.
	* @param {function(*):number} [options.weightFn] Function to compute weight for a value.
	* @param {number} [options.defaultTTL=60000] Default TTL (ms) for entries.
	* @param {number} [options.maxPoolSize=1000] Maximum node pool size for reuse.
	* @param {boolean} [options.rejectOversized=false] If true, inserting an item whose weight > \`maxWeight\` will be rejected.
	* @param {function(*, *, string):void} [options.onEvict] Callback invoked when an item is evicted/deleted/rejected. Called as \`(key, value, reason)\` where reason is \`'evicted'|'deleted'|'rejected-oversized'\`.
	* @param {function(*, *):void} [options.onExpire] Callback invoked when an item expires. Called as \`(key, value)\`.
	* @param {number} [options.initialPoolSize=0] Prefill the internal node pool with this many nodes (capped by \`maxPoolSize\`).
	* @param {number} [options.maxCleanupPerTick=100] Default max nodes scanned per cleanup tick when running \`startCleanup()\`.
	* @param {boolean} [options.eagerCleanupOnRead=false] If true, \`peek()\` and \`has()\` will eagerly remove expired nodes when observed.
	* @throws {TypeError} When a non-object is provided as the options argument.
	*/
	constructor({ maxEntries: t = 1 / 0, maxWeight: e = 1 / 0, weightFn: n = () => 1, defaultTTL: r = Hr, maxPoolSize: i = no, rejectOversized: s = !1, onEvict: c = null, onExpire: a = null, initialPoolSize: p = 0, maxCleanupPerTick: f = 100, eagerCleanupOnRead: b = !1, defaultAsyncTimeout: T = to } = {}) {
		if (arguments.length > 0 && arguments[0] != null && typeof arguments[0] != "object") throw new TypeError("PowerCache options must be an object");
		this.maxEntries = t, this.maxWeight = e, this.weightFn = n, this.defaultTTL = r, this.maxPoolSize = i, this.rejectOversized = !!s, this.onEvict = typeof c == "function" ? c : null, this.onExpire = typeof a == "function" ? a : null, this.maxCleanupPerTick = Number.isFinite(+f) ? Math.max(1, +f) : 100, this.eagerCleanupOnRead = !!b, this._map = /* @__PURE__ */ new Map(), this._head = null, this._tail = null, this._pool = [];
		for (let S = 0; S < Math.min(p || 0, this.maxPoolSize); S++) this._pool.push({
			key: null,
			value: null,
			weight: 0,
			expiresAt: 0,
			prev: null,
			next: null
		});
		this._currentWeight = 0, this._hits = 0, this._misses = 0, this._evictions = 0, this._rejected = 0, this._expirations = 0, Object.defineProperty(this, "map", {
			configurable: !0,
			enumerable: !1,
			get() {
				return this._map;
			},
			set(S) {
				this._map = S;
			}
		}), Object.defineProperty(this, "head", {
			configurable: !0,
			enumerable: !1,
			get() {
				return this._head;
			},
			set(S) {
				this._head = S;
			}
		}), Object.defineProperty(this, "tail", {
			configurable: !0,
			enumerable: !1,
			get() {
				return this._tail;
			},
			set(S) {
				this._tail = S;
			}
		}), Object.defineProperty(this, "pool", {
			configurable: !0,
			enumerable: !1,
			get() {
				return this._pool;
			},
			set(S) {
				this._pool = S;
			}
		}), Object.defineProperty(this, "currentWeight", {
			configurable: !0,
			enumerable: !1,
			get() {
				return this._currentWeight;
			},
			set(S) {
				this._currentWeight = S;
			}
		}), Object.defineProperty(this, "hits", {
			configurable: !0,
			enumerable: !1,
			get() {
				return this._hits;
			},
			set(S) {
				this._hits = S;
			}
		}), Object.defineProperty(this, "misses", {
			configurable: !0,
			enumerable: !1,
			get() {
				return this._misses;
			},
			set(S) {
				this._misses = S;
			}
		}), Object.defineProperty(this, "evictions", {
			configurable: !0,
			enumerable: !1,
			get() {
				return this._evictions;
			},
			set(S) {
				this._evictions = S;
			}
		}), Object.defineProperty(this, "rejected", {
			configurable: !0,
			enumerable: !1,
			get() {
				return this._rejected;
			},
			set(S) {
				this._rejected = S;
			}
		}), Object.defineProperty(this, "expirations", {
			configurable: !0,
			enumerable: !1,
			get() {
				return this._expirations;
			},
			set(S) {
				this._expirations = S;
			}
		}), this._cleanupTimer = null, this._cleanupRunning = !1, this._cleanupParams = null, this._cleanupCursor = null, this._cleanupCursorValid = !1, this._evictionCandidate = null, this._inflightPromises = /* @__PURE__ */ new Map(), this._defaultAsyncTimeout = Number.isFinite(Number(T)) ? Math.max(0, Math.floor(Number(T))) : 3e4;
	}
	/**
	* Allocate a pool node or create a new one.
	*
	* This helper either reuses a node from the internal \`pool\` or creates a
	* fresh node object. The returned node is initialized with the provided
	* key/value/weight/expiresAt and has its \`prev\`/\`next\` pointers nulled.
	*
	* @private
	* @param {*} key
	* @param {*} value
	* @param {number} weight
	* @param {number} expiresAt
	* @returns {CacheNode}
	*/
	_allocNode(t, e, n, r) {
		const i = this._pool.pop() || {
			key: null,
			value: null,
			weight: 0,
			expiresAt: 0,
			prev: null,
			next: null
		};
		return i.key = t, i.value = e, i.weight = n || 0, i.expiresAt = r || 0, i.prev = null, i.next = null, i;
	}
	/**
	* Compute and validate a weight for a value.
	* If \`explicitWeight\` is provided it is normalized and returned.
	* Otherwise \`this.weightFn\` is invoked safely and any thrown error
	* or non-finite return value results in a weight of \`0\`.
	* @private
	* @param {*} value
	* @param {number|null|undefined} explicitWeight
	* @returns {number}
	*/
	_computeWeight(t, e) {
		if (e != null) {
			const n = +e;
			return Number.isFinite(n) ? Math.max(0, n) : 0;
		}
		try {
			const n = +this.weightFn(t);
			return Number.isFinite(n) ? Math.max(0, n) : 0;
		} catch {
			return 0;
		}
	}
	/**
	* Reset and return a node to the pool for reuse.
	*
	* This helper clears the node fields and returns it to the node pool when
	* the pool has capacity. It is called for evicted or deleted nodes to
	* reduce allocation churn.
	*
	* @private
	* @param {CacheNode} node
	* @returns {void}
	*/
	_freeNode(t) {
		t.key = null, t.value = null, t.weight = 0, t.expiresAt = 0, t.prev = null, t.next = null, this._pool.length < this.maxPoolSize && this._pool.push(t);
	}
	/**
	* Remove a node that has expired.
	*
	* Performs map deletion, linked-list unlink, invokes \`onExpire\`, returns the
	* node to the pool, and updates bookkeeping counters (\`misses\` and
	* \`expirations\`). This helper is called from several expiration paths and
	* centralizes the necessary cleanup steps.
	*
	* @private
	* @param {CacheNode} node
	* @param {number} now - Current timestamp (ms) used for comparisons
	* @remarks This helper does not modify the \`misses\` counter; callers should
	* increment \`this._misses\` when the removal corresponds to a user-facing
	* lookup (for example, \`get()\`/\`getMany()\`/\`getOrSet()\`).
	*/
	_removeExpiredNode(t, e) {
		if (!t.expiresAt || t.expiresAt > e) return !1;
		const n = t.key, r = t.value, i = t.next;
		this._map.delete(n), this._currentWeight -= t.weight || 0, this._cleanupCursor === t && (this._cleanupCursor = i), this._cleanupCursorValid = !!this._cleanupCursor, this._remove(t);
		try {
			this.onExpire && this.onExpire(n, r);
		} catch (s) {
			try {
				typeof this._logger?.error == "function" ? this._logger.error(s, "PowerCache onExpire callback threw") : typeof console < "u" && typeof console.error == "function" && console.error("PowerCache onExpire callback threw", s);
			} catch {}
		}
		return this._freeNode(t), this._expirations++, !0;
	}
	/**
	* Fetch a node and validate expiry.
	* @private
	* @param {*} key
	* @param {Object} [options]
	* @param {boolean} [options.ignoreExpiry=false]
	* @param {boolean} [options.countMiss=false]
	* @returns {CacheNode|null}
	*/
	_fetchValidNode(t, { ignoreExpiry: e = !1, countMiss: n = !1, allowExpired: r = !1 } = {}) {
		const i = this._map.get(t);
		if (!i) return n && this._misses++, null;
		const s = !e && i.expiresAt ? Ee() : 0;
		return s && i.expiresAt <= s ? r ? i : (this._removeExpiredNode(i, s), n && this._misses++, null) : i;
	}
	/**
	* Start a background refresh for an expired entry.
	*
	* If a refresh is already in flight for the key, this helper does nothing.
	* The refreshed value is written back to cache when the factory resolves.
	* Errors are swallowed so the stale value remains available.
	*
	* @private
	* @param {*} key
	* @param {Function} factory
	* @param {Object} [options]
	* @param {number} [options.ttl]
	* @param {number} [options.weight]
	* @returns {void}
	*/
	_refreshStaleEntry(t, e, { ttl: n = void 0, weight: r = void 0 } = {}) {
		if (this._inflightPromises.has(t)) return;
		let i;
		try {
			i = Promise.resolve().then(() => e());
		} catch {
			return;
		}
		const s = i.then((c) => {
			try {
				this.set(t, c, {
					ttl: n,
					weight: r
				});
			} catch {}
			return c;
		}).catch(() => {}).finally(() => {
			this._inflightPromises.delete(t);
		});
		this._inflightPromises.set(t, s);
	}
	/**
	* Append a node to the tail (mark it most-recently used).
	* This updates the linked-list pointers appropriately and is used when
	* inserting new nodes or promoting a node to MRU.
	*
	* @private
	* @param {CacheNode} node - Node to append at the tail.
	* @returns {void}
	*/
	_append(t) {
		if (!this._tail) {
			this._head = this._tail = t, this._evictionCandidate = this._head;
			return;
		}
		t.prev = this._tail, t.next = null, this._tail.next = t, this._tail = t;
	}
	/**
	* Remove a node from the linked list without freeing it. The node's
	* \`prev\`/\`next\` references are updated on neighbors and the node's links
	* are nulled. Does not modify \`this.map\` or bookkeeping counters; callers
	* are responsible for those actions.
	*
	* @private
	* @param {CacheNode} node - Node to unlink from the list.
	* @returns {void}
	*/
	_remove(t) {
		const e = t.prev, n = t.next;
		e ? e.next = n : this._head = n, e || (this._evictionCandidate = this._head), n ? n.prev = e : this._tail = e, t.prev = t.next = null;
	}
	/**
	* Move an existing node to the tail (mark as most-recently used).
	* Implemented as an unlink followed by an append. No-op when node is
	* already the tail.
	*
	* @private
	* @param {CacheNode} node - Node to promote to MRU position.
	* @returns {void}
	*/
	_moveToTail(t) {
		this._tail !== t && (this._remove(t), this._append(t));
	}
	/**
	* Evict nodes from the head (least-recently used) until the cache
	* satisfies both \`maxEntries\` and \`maxWeight\` constraints. For each
	* evicted node \`onEvict\` is invoked if provided and the node is returned
	* to the node pool via \`_freeNode\`.
	*
	* @private
	* @returns {void}
	*/
	_evictIfNeeded() {
		for (; this._map.size > this.maxEntries || this._currentWeight > this.maxWeight;) {
			const t = this._evictionCandidate || this._head;
			if (!t) break;
			const e = t.next, n = t.key, r = t.value;
			this._cleanupCursor === t && (this._cleanupCursor = e), this._cleanupCursorValid = !!this._cleanupCursor, this._evictionCandidate = e, this._remove(t), this._map.delete(n), this._currentWeight -= t.weight || 0, this._evictions++;
			try {
				this.onEvict && this.onEvict(n, r, "evicted");
			} catch (i) {
				try {
					typeof this._logger?.error == "function" ? this._logger.error(i, "PowerCache onEvict callback threw") : typeof console < "u" && typeof console.error == "function" && console.error("PowerCache onEvict callback threw", i);
				} catch {}
			}
			this._freeNode(t);
		}
		this._evictionCandidate || (this._evictionCandidate = this._head);
	}
	/**
	* Set a value in the cache (add or update).
	* Marks the entry as most-recently used.
	* If \`rejectOversized\` is enabled and the computed/explicit weight exceeds \`maxWeight\`,
	* the insertion will be rejected and \`set\` returns \`false\` (otherwise returns \`this\`).
	* @param {*} key - Cache key
	* @param {*} value - Value to store
	* @param {Object} [options]
	* @param {number} [options.ttl] - Time-to-live in ms. Use \`null\` or \`Infinity\` to disable expiration.
	* @param {number} [options.weight] - Optional explicit weight for the entry. If omitted, \`weightFn\` is used.
	* @returns {this|false} \`this\` on success, or \`false\` when insertion was rejected due to oversize.
	*/
	set(t, e, { ttl: n = this.defaultTTL, weight: r = null } = {}) {
		const i = Ee(), s = n == null || n === 1 / 0 ? 0 : i + n, c = this._computeWeight(e, r);
		if (this.rejectOversized && Number.isFinite(this.maxWeight) && c > this.maxWeight) {
			this._rejected++;
			try {
				this.onEvict && this.onEvict(t, e, "rejected-oversized");
			} catch {}
			return !1;
		}
		if (this._map.has(t)) {
			const a = this._map.get(t);
			this._currentWeight -= a.weight || 0, a.value = e, a.weight = c, a.expiresAt = s, this._currentWeight += a.weight || 0, this._moveToTail(a);
		} else {
			const a = this._allocNode(t, e, c, s);
			this._map.set(t, a), this._append(a), this._currentWeight += a.weight || 0;
		}
		return this._evictIfNeeded(), this;
	}
	/**
	* Retrieve a value and mark it as recently used.
	* @param {*} key
	* @returns {*|undefined} The stored value or \`undefined\` if missing/expired.
	*/
	get(t) {
		const e = this._fetchValidNode(t, { countMiss: !0 });
		if (e) return this._moveToTail(e), this._hits++, e.value;
	}
	/**
	* Get a value without updating recency.
	* Returns \`undefined\` for missing or expired entries.
	* @param {*} key
	* @returns {*|undefined}
	*/
	peek(t) {
		const e = this._fetchValidNode(t);
		return e ? e.value : void 0;
	}
	/**
	* Check membership without affecting recency.
	* @param {*} key
	* @param {Object} [options]
	* @param {boolean} [options.ignoreExpiry=false] If true, consider expired entries as present.
	* @returns {boolean}
	*/
	has(t, { ignoreExpiry: e = !1 } = {}) {
		return !!this._fetchValidNode(t, { ignoreExpiry: e });
	}
	/**
	* Atomically read-or-compute a value for \`key\`.
	* If the key is present and not expired the stored value is returned.
	* Otherwise \`factory\` is invoked to produce the value which is stored
	* in the cache and returned. \`factory\` may be a value (in which case it
	* is stored directly) or a function. If the function returns a Promise,
	* the Promise is returned and the resolved value is stored when it settles.
	*
	* Note: this method does not deduplicate concurrent async factories —
	* for async factories prefer \`getOrSetAsync\` or use
	* \`PowerMemoizer\` for inflight deduplication.
	*
	* @param {*} key
	* @param {Function|*} factory - Function that produces the value or a direct value.
	* @param {Object} [options]
	* @param {number} [options.ttl]
	* @param {number} [options.weight]
	* @param {boolean} [options.staleWhileRevalidate=false] If true, return an expired value immediately and refresh the cache in the background.
	* @returns {*|Promise<*>}
	*/
	getOrSet(t, e, { ttl: n = void 0, weight: r = void 0, staleWhileRevalidate: i = !1 } = {}) {
		const s = Ee(), c = this._fetchValidNode(t, {
			countMiss: !1,
			allowExpired: i
		});
		if (c) if (c.expiresAt && c.expiresAt <= s) {
			if (typeof e == "function") return this._moveToTail(c), this._hits++, this._refreshStaleEntry(t, e, {
				ttl: n,
				weight: r
			}), c.value;
			this._removeExpiredNode(c, s), this._misses++;
		} else return this._moveToTail(c), this._hits++, c.value;
		else this._misses++;
		if (typeof e == "function") {
			const a = e();
			return typeof a?.then == "function" ? a.then((p) => {
				try {
					this.set(t, p, {
						ttl: n,
						weight: r
					});
				} catch {}
				return p;
			}) : (this.set(t, a, {
				ttl: n,
				weight: r
			}), a);
		}
		return this.set(t, e, {
			ttl: n,
			weight: r
		}), e;
	}
	/**
	* Bulk set multiple entries. Accepts an iterable/array of [key, value] pairs.
	* Computes weight once per value and applies a single eviction pass at the end.
	* @param {Iterable<[*,*]>} entries
	* @param {Object} [options]
	* @param {number} [options.ttl]
	* @param {number} [options.weight]
	* @returns {this}
	*/
	setMany(t, { ttl: e = void 0, weight: n = void 0 } = {}) {
		const r = Ee(), i = e == null || e === 1 / 0 ? 0 : r + e;
		for (const s of t) {
			if (!s) continue;
			const [c, a] = s, p = this._computeWeight(a, n);
			if (this._map.has(c)) {
				const f = this._map.get(c);
				this._currentWeight -= f.weight || 0, f.value = a, f.weight = p, f.expiresAt = i, this._currentWeight += f.weight || 0, this._moveToTail(f);
			} else {
				const f = this._allocNode(c, a, p, i);
				this._map.set(c, f), this._append(f), this._currentWeight += f.weight || 0;
			}
		}
		return this._evictIfNeeded(), this;
	}
	/**
	* Bulk get multiple keys. Returns a Map of found entries.
	* @param {Iterable<*>} keys
	* @param {Object} [options]
	* @param {boolean} [options.ignoreExpiry=false]
	* @returns {Map}
	*/
	getMany(t, { ignoreExpiry: e = !1 } = {}) {
		const n = /* @__PURE__ */ new Map();
		for (const r of t) {
			const i = this._fetchValidNode(r, {
				ignoreExpiry: e,
				countMiss: !0
			});
			i && (this._moveToTail(i), this._hits++, n.set(r, i.value));
		}
		return n;
	}
	/**
	* Touch an entry: update its recency and optionally refresh TTL without
	* reading or modifying the stored value.
	* @param {*} key
	* @param {number} [ttl] - Optional per-call TTL in ms. Use \`null\`/\`Infinity\` to disable expiry.
	* @returns {boolean} True if the entry existed (and was not expired), false otherwise.
	*/
	touch(t, e = void 0) {
		const n = this._fetchValidNode(t);
		if (!n) return !1;
		const r = Ee();
		return e !== void 0 && (n.expiresAt = e == null || e === 1 / 0 ? 0 : r + e), this._moveToTail(n), !0;
	}
	/**
	* Async read-or-compute with inflight deduplication.
	* If a factory is already running for \`key\`, returns the same Promise.
	* Otherwise invokes \`asyncFactory\` and stores the resolved value in cache.
	* @param {*} key
	* @param {Function} asyncFactory - Function returning a Promise or value.
	* @param {Object} [options]
	* @param {number} [options.ttl]
	* @param {number} [options.weight]
	* @param {boolean} [options.staleWhileRevalidate=false] If true, return an expired value immediately and refresh the cache in the background.
	* @returns {Promise<*>}
	*/
	getOrSetAsync(t, e, { ttl: n = void 0, weight: r = void 0, staleWhileRevalidate: i = !1, timeout: s = void 0 } = {}) {
		if (typeof e != "function") return Promise.resolve(this.getOrSet(t, e, {
			ttl: n,
			weight: r
		}));
		const c = Ee(), a = this._map.get(t);
		if (a) if (a.expiresAt && a.expiresAt <= c) {
			if (i) return this._moveToTail(a), this._hits++, this._refreshStaleEntry(t, e, {
				ttl: n,
				weight: r
			}), Promise.resolve(a.value);
			this._removeExpiredNode(a, c);
		} else return this._moveToTail(a), this._hits++, Promise.resolve(a.value);
		if (this._inflightPromises.has(t)) return this._inflightPromises.get(t);
		this._misses++;
		let p;
		try {
			p = Promise.resolve().then(() => e());
		} catch (S) {
			return Promise.reject(S);
		}
		const f = Number.isFinite(Number(s)) ? Math.max(0, Math.floor(Number(s))) : Number.isFinite(Number(this._defaultAsyncTimeout)) ? this._defaultAsyncTimeout : void 0;
		let b = p;
		if (Number.isFinite(f) && f > 0) {
			let S = null;
			b = new Promise((C, v) => {
				S = setTimeout(() => {
					try {
						v(/* @__PURE__ */ new Error("getOrSetAsync timeout"));
					} catch {}
				}, f), p.then((z) => {
					try {
						clearTimeout(S);
					} catch {}
					C(z);
				}, (z) => {
					try {
						clearTimeout(S);
					} catch {}
					v(z);
				});
			});
		}
		const T = b.then((S) => {
			try {
				this.set(t, S, {
					ttl: n,
					weight: r
				});
			} catch {}
			return S;
		}).finally(() => {
			this._inflightPromises.delete(t);
		});
		return this._inflightPromises.set(t, T), T;
	}
	/**
	* Check membership without affecting recency and verify the stored value is deep-equal
	* to the provided \`value\`.
	*
	* Optimizations:
	* - Fast reference equality short-circuit
	* - Fast primitive checks
	* - Special-cases for Arrays, TypedArrays/ArrayBuffer, Date, RegExp, Map and Set
	* - WeakMap/WeakSet-based cycle detection
	*
	* @param {*} key
	* @param {*} value
	* @param {Object} [options]
	* @param {boolean} [options.ignoreExpiry=false] If true, consider expired entries as present.
	* @param {WeakMap} [options.seen] Optional reusable \`seen\` WeakMap for callers that
	*        perform many deep-equality checks and want to avoid per-call allocations.
	* @returns {boolean}
	*/
	hasEqual(t, e, { ignoreExpiry: n = !1, seen: r = void 0 } = {}) {
		const i = this._fetchValidNode(t, { ignoreExpiry: n });
		if (!i) return !1;
		const s = i.value;
		return s === e ? !0 : typeof s != "object" || s === null || typeof e != "object" || e === null ? s === e : Rt(s, e, r);
	}
	/**
	* Variant accepting an explicit \`seen\` WeakMap for reuse across many checks.
	* @param {*} key
	* @param {*} value
	* @param {WeakMap} seen
	* @param {Object} [options]
	* @param {boolean} [options.ignoreExpiry=false]
	* @returns {boolean}
	*/
	hasEqualWithSeen(t, e, n, { ignoreExpiry: r = !1 } = {}) {
		return this.hasEqual(t, e, {
			ignoreExpiry: r,
			seen: n
		});
	}
	/**
	* Delete an entry from the cache.
	* @param {*} key
	* @returns {boolean} true if the key was removed.
	*/
	delete(t) {
		const e = this._map.get(t);
		if (!e) return !1;
		const n = e.next;
		this._map.delete(t), this._currentWeight -= e.weight || 0, this._cleanupCursor === e && (this._cleanupCursor = n), this._cleanupCursorValid = !!this._cleanupCursor, this._remove(e);
		try {
			this.onEvict && this.onEvict(e.key, e.value, "deleted");
		} catch {}
		return this._freeNode(e), !0;
	}
	/**
	* Clear the cache and return nodes to the pool.
	* @returns {void}
	*/
	clear() {
		for (let t = this._head; t;) {
			const e = t.next;
			this._freeNode(t), t = e;
		}
		this._head = this._tail = null, this._map.clear(), this._currentWeight = 0, this._cleanupCursor = null, this._cleanupCursorValid = !1, this._evictionCandidate = null;
	}
	/**
	* Remove expired entries by scanning from least-recently used to most.
	* @returns {void}
	*/
	cleanupExpired() {
		return this.cleanupExpiredUpTo();
	}
	/**
	* Cleanup expired entries, scanning up to \`maxScan\` nodes.
	* Scanning resumes from an internal cursor so repeated small passes will cover the list
	* without repeatedly scanning the head of a very large cache. When the end is reached the
	* cursor wraps to the head.
	* @param {number} [maxScan=Infinity] Maximum nodes to scan in this pass.
	* @returns {number} Number of nodes scanned
	*/
	cleanupExpiredUpTo(t = 1 / 0) {
		const e = Ee();
		let n = 0, r = this._cleanupCursor && this._cleanupCursorValid ? this._cleanupCursor : this._head;
		for (; r && n < t;) {
			const i = r.next;
			if (r.expiresAt && r.expiresAt <= e) {
				const s = r.key, c = r.value;
				this._map.delete(s), this._currentWeight -= r.weight || 0, this._cleanupCursor === r && (this._cleanupCursor = i), this._cleanupCursorValid = !!this._cleanupCursor, this._remove(r);
				try {
					this.onExpire && this.onExpire(s, c);
				} catch {}
				this._freeNode(r), this._expirations++;
			}
			r = i, n++;
		}
		return this._cleanupCursor = r || this._head, this._cleanupCursorValid = !!this._cleanupCursor, n;
	}
	/**
	* Start periodic, non-blocking cleanup.
	* Accepts either a numeric interval (ms) or an options object \`{ interval, maxCleanupPerTick }\`.
	* The loop is implemented with \`setTimeout\` and scans up to \`maxCleanupPerTick\` nodes per pass
	* to avoid long event-loop stalls.
	* Note: call \`stopCleanup()\` to stop the periodic timer (for example, on application shutdown)
	* to ensure the internal timer is cleared and resources can be reclaimed.
	* @param {number|Object} [intervalOrOptions]
	* @param {number} [intervalOrOptions.interval] Interval between cleanup passes in ms.
	* @param {number} [intervalOrOptions.maxCleanupPerTick] Max nodes to scan per pass.
	* @returns {void}
	*/
	startCleanup(t = {}) {
		let e, n;
		typeof t == "number" ? (e = t, n = this.maxCleanupPerTick) : (e = Number.isFinite(+t.interval) ? +t.interval : Math.max(Ln, Math.min(this.defaultTTL || 6e4, Hr)), n = Number.isFinite(+t.maxCleanupPerTick) ? Math.max(1, +t.maxCleanupPerTick) : this.maxCleanupPerTick), this.stopCleanup(), this._cleanupParams = {
			interval: e,
			maxCleanupPerTick: n
		}, this._cleanupTimer = setTimeout(() => this._cleanupTick(), e);
	}
	/**
	* Stop periodic cleanup.
	* @returns {void}
	*/
	stopCleanup() {
		this._cleanupTimer && (clearTimeout(this._cleanupTimer), this._cleanupTimer = null), this._cleanupRunning = !1, this._cleanupParams = null;
	}
	/**
	* Synchronous disposal hook (TC39 Explicit Resource Management).
	* Stops any background cleanup and clears the cache.
	*/
	[Symbol.dispose]() {
		try {
			this.stopCleanup();
		} catch {}
		try {
			this.clear();
		} catch {}
	}
	/**
	* Asynchronous disposal hook. Provided for symmetry with \`using\`/\`await using\`.
	* Cache cleanup is synchronous so this simply performs the same actions and
	* returns a resolved Promise for await compatibility.
	*/
	async [Symbol.asyncDispose]() {
		try {
			this.stopCleanup();
		} catch {}
		try {
			this.clear();
		} catch {}
	}
	/**
	* Prototype tick used by the cleanup timer loop. Separated to avoid
	* allocating a per-call closure inside \`startCleanup()\`.
	* @private
	*/
	_cleanupTick() {
		if (this._cleanupTimer != null) {
			if (this._cleanupRunning) {
				this._cleanupTimer = setTimeout(() => this._cleanupTick(), this._cleanupParams.interval);
				return;
			}
			this._cleanupRunning = !0;
			try {
				this.cleanupExpiredUpTo(this._cleanupParams.maxCleanupPerTick);
			} finally {
				this._cleanupRunning = !1;
			}
			this._cleanupTimer = setTimeout(() => this._cleanupTick(), this._cleanupParams.interval);
		}
	}
	/**
	* Current number of entries in cache.
	* @returns {number}
	*/
	get size() {
		return this._map.size;
	}
	/**
	* Hit rate as a fraction (hits / (hits + misses)).
	* @returns {number}
	*/
	get hitRate() {
		const t = (this._hits || 0) + (this._misses || 0);
		return t ? this._hits / t : 0;
	}
	/**
	* Return runtime statistics for the cache.
	* @returns {{size:number, weight:number, hits:number, misses:number, evictions:number, rejected:number, poolSize:number}}
	*/
	stats() {
		return {
			size: this.size,
			weight: this._currentWeight,
			hits: this._hits,
			misses: this._misses,
			evictions: this._evictions,
			expirations: this._expirations,
			rejected: this._rejected,
			poolSize: this._pool.length
		};
	}
	/**
	* Resize the cache limits and evict if necessary.
	* @param {Object} options
	* @param {number} [options.maxEntries]
	* @param {number} [options.maxWeight]
	*/
	resize({ maxEntries: t, maxWeight: e } = {}) {
		Number.isFinite(+t) && (this.maxEntries = Math.max(0, +t)), Number.isFinite(+e) && (this.maxWeight = Math.max(0, +e)), this._evictIfNeeded(), this._cleanupCursor = null, this._cleanupCursorValid = !1, this._evictionCandidate = this.head;
	}
	/**
	* Iterate entries in LRU or MRU order.
	* @param {'LRU'|'MRU'} [order='MRU']
	* @returns {IterableIterator<[*,*]>}
	*/
	*entries(t = "MRU") {
		if (t === "MRU") for (let e = this._tail; e; e = e.prev) yield [e.key, e.value];
		else for (let e = this._head; e; e = e.next) yield [e.key, e.value];
	}
	[Symbol.iterator]() {
		return this.entries("MRU");
	}
	/**
	* Iterate keys in LRU or MRU order.
	* @param {'LRU'|'MRU'} [order='MRU']
	*/
	*keys(t = "MRU") {
		for (const [e] of this.entries(t)) yield e;
	}
	/**
	* Iterate values in LRU or MRU order.
	* @param {'LRU'|'MRU'} [order='MRU']
	*/
	*values(t = "MRU") {
		for (const [, e] of this.entries(t)) yield e;
	}
};
function Rt(t, e, n = void 0, r = 0) {
	if (r > 100) return t === e;
	if (t === e) return !0;
	if (t == null || e == null || typeof t != "object" || typeof e != "object") return t === e;
	n || (n = /* @__PURE__ */ new WeakMap());
	let i = n.get(t);
	if (i?.has(e)) return !0;
	if (i || (i = /* @__PURE__ */ new WeakSet(), n.set(t, i)), i.add(e), Object.getPrototypeOf(t) !== Object.getPrototypeOf(e)) return !1;
	if (typeof Uint8Array < "u" && t instanceof Uint8Array) {
		if (!(e instanceof Uint8Array) || t.length !== e.length) return !1;
		for (let a = 0; a < t.length; a++) if (t[a] !== e[a]) return !1;
		return !0;
	}
	if (Array.isArray(t)) {
		if (!Array.isArray(e) || t.length !== e.length) return !1;
		for (let a = 0; a < t.length; a++) if (!Rt(t[a], e[a], n, r + 1)) return !1;
		return !0;
	}
	if (ArrayBuffer.isView(t)) {
		if (!ArrayBuffer.isView(e) || t.byteLength !== e.byteLength) return !1;
		const a = new Uint8Array(t.buffer, t.byteOffset || 0, t.byteLength), p = new Uint8Array(e.buffer, e.byteOffset || 0, e.byteLength);
		for (let f = 0; f < a.length; f++) if (a[f] !== p[f]) return !1;
		return !0;
	}
	if (t instanceof ArrayBuffer) {
		if (!(e instanceof ArrayBuffer) || t.byteLength !== e.byteLength) return !1;
		const a = new Uint8Array(t), p = new Uint8Array(e);
		for (let f = 0; f < a.length; f++) if (a[f] !== p[f]) return !1;
		return !0;
	}
	if (t instanceof Date) return e instanceof Date ? t.getTime() === e.getTime() : !1;
	if (t instanceof RegExp) return e instanceof RegExp ? t.toString() === e.toString() : !1;
	if (t instanceof Map) {
		if (!(e instanceof Map) || t.size !== e.size) return !1;
		for (const [a, p] of t) if (!e.has(a) || !Rt(p, e.get(a), n, r + 1)) return !1;
		return !0;
	}
	if (t instanceof Set) {
		if (!(e instanceof Set) || t.size !== e.size) return !1;
		let a = !0;
		for (const v of t) if (v !== null && typeof v == "object") {
			a = !1;
			break;
		}
		if (a) {
			for (const v of t) if (!e.has(v)) return !1;
			return !0;
		}
		const p = Array.from(e), f = new Array(p.length).fill(!1), b = /* @__PURE__ */ new Map();
		for (let v = 0; v < p.length; v++) b.set(p[v], v);
		const T = (v) => {
			try {
				return JSON.stringify(v, (z, O) => O instanceof Date ? {
					__type: "Date",
					v: O.getTime()
				} : O instanceof RegExp ? {
					__type: "RegExp",
					v: O.toString()
				} : typeof ArrayBuffer < "u" && ArrayBuffer.isView(O) ? {
					__type: "TypedArray",
					v: Array.from(new Uint8Array(O.buffer, O.byteOffset || 0, O.byteLength))
				} : typeof ArrayBuffer < "u" && O instanceof ArrayBuffer ? {
					__type: "ArrayBuffer",
					v: Array.from(new Uint8Array(O))
				} : O);
			} catch {
				return null;
			}
		}, S = /* @__PURE__ */ new Map(), C = [];
		for (let v = 0; v < p.length; v++) {
			const z = T(p[v]);
			if (z == null) C.push(v);
			else {
				const O = S.get(z);
				O ? O.push(v) : S.set(z, [v]);
			}
		}
		for (const v of t) {
			const z = b.get(v);
			if (z !== void 0 && !f[z]) {
				f[z] = !0;
				continue;
			}
			const O = T(v);
			let W = !1;
			if (O != null) {
				const re = S.get(O) || [];
				for (const ie of re) if (!f[ie] && Rt(v, p[ie], n, r + 1)) {
					f[ie] = !0, W = !0;
					break;
				}
				if (W) continue;
			}
			for (let re = 0; re < p.length; re++) if (!f[re] && Rt(v, p[re], n, r + 1)) {
				f[re] = !0, W = !0;
				break;
			}
			if (!W) return !1;
		}
		return !0;
	}
	const s = Object.keys(t), c = Object.keys(e);
	if (s.length !== c.length) return !1;
	for (let a = 0; a < s.length; a++) {
		const p = s[a];
		if (!Object.prototype.hasOwnProperty.call(e, p) || !Rt(t[p], e[p], n, r + 1)) return !1;
	}
	return !0;
}
var io = class {
	/**
	* @param {number|PowerTTLMapOptions} [defaultTTL=0] Default TTL in milliseconds for keys set
	*   without explicit ttl (0 = no expiry). Accepts either a positional number or an options
	*   object \`{ defaultTTL, onExpire }\` for consistency with the other helpers.
	* @param {PowerTTLMapOptions} [options={}] Options object (used when the first arg is a number).
	*/
	/**
	* @typedef {import('./jsdoc-types.js').PowerTTLMapOptions} PowerTTLMapOptions
	*/
	constructor(t = 0, e = {}) {
		t != null && typeof t == "object" && (e = t, t = 0), this._defaultTTL = Number(e?.defaultTTL ?? t) || 0, this._onExpire = typeof e?.onExpire == "function" ? e.onExpire : null, this._map = /* @__PURE__ */ new Map(), this._expirations = /* @__PURE__ */ new Map(), this._nextExpiryAt = 0, this._nextExpiryDirty = !1;
	}
	/**
	* Resolve a TTL argument that may be either a positional number or an
	* options object \`{ ttl }\` (matching the \`PowerCache.set\` convention).
	* @private
	* @param {number|{ttl?:number}|undefined} ttl
	* @param {number} fallback Default TTL when \`ttl\` is nullish.
	* @returns {number} Resolved TTL in ms (0 = no expiry).
	*/
	_resolveTtl(t, e) {
		return t != null && typeof t == "object" && (t = t.ttl), t == null ? e : Number(t) || 0;
	}
	/**
	* Set a key with optional TTL (ms).
	* @param {any} key
	* @param {any} value
	* @param {number|{ttl?:number}} [ttl] TTL in milliseconds for this key. Accepts either a
	*   positional number or an options object \`{ ttl }\` for consistency with \`PowerCache.set\`.
	* @returns {this}
	*/
	set(t, e, n) {
		const r = this._resolveTtl(n, this._defaultTTL), i = r > 0 ? Ee() + r + 1 : 0, s = this._expirations.get(t) || 0;
		return this._map.set(t, {
			value: e,
			expiresAt: i
		}), i ? this._expirations.set(t, i) : this._expirations.delete(t), this._updateNextExpiryOnWrite(s, i), this;
	}
	/**
	* Internal: remove entry if expired; returns true if removed or missing.
	*
	* This helper centralizes expiry checks for \`get\`, \`has\`, and iteration
	* paths. When an entry is expired it is removed from the underlying map.
	*
	* @private
	* @param {any} key - Map key to check
	* @param {{value:any,expiresAt:number}|undefined} entry - Stored entry or undefined
	* @returns {boolean} true when the entry is missing or expired (and removed)
	*/
	_expireKey(t, e) {
		if (!e) return;
		const n = e.expiresAt || this._expirations.get(t) || 0;
		try {
			const r = e.value;
			if (this._map.delete(t), this._expirations.delete(t), n && this._nextExpiryAt === n && (this._nextExpiryDirty = !0), typeof this._onExpire == "function") try {
				this._onExpire(t, r);
			} catch {}
		} catch {}
	}
	_checkExpire(t, e) {
		return e ? e.expiresAt && Ee() > e.expiresAt ? (this._expireKey(t, e), !0) : !1 : !0;
	}
	/**
	* Get a value, returning \`undefined\` when missing or expired.
	* @param {any} key
	* @returns {any|undefined}
	*/
	get(t) {
		const e = this._map.get(t);
		if (!this._checkExpire(t, e)) return e.value;
	}
	/**
	* Check whether a key exists and is not expired.
	* @param {any} key
	* @returns {boolean}
	*/
	has(t) {
		const e = this._map.get(t);
		return !this._checkExpire(t, e);
	}
	/**
	* Delete a key.
	* @param {any} key
	* @returns {boolean}
	*/
	delete(t) {
		const e = this._expirations.get(t) || 0;
		return this._expirations.delete(t), e && this._nextExpiryAt === e && (this._nextExpiryDirty = !0), this._map.delete(t);
	}
	/**
	* Remove all entries.
	* @returns {void}
	*/
	clear() {
		this._map.clear(), this._expirations.clear(), this._nextExpiryAt = 0, this._nextExpiryDirty = !1;
	}
	/**
	* Refresh TTL for an existing key. No-op if missing/expired.
	* @param {any} key
	* @param {number|{ttl?:number}} [ttl]
	* @returns {boolean} True when TTL refreshed.
	*/
	touch(t, e) {
		const n = this._map.get(t);
		if (!n) return !1;
		if (n.expiresAt && Ee() > n.expiresAt) return this._expireKey(t, n), !1;
		const r = n.expiresAt || 0, i = this._resolveTtl(e, this._defaultTTL);
		return n.expiresAt = i > 0 ? Ee() + i + 1 : 0, n.expiresAt ? this._expirations.set(t, n.expiresAt) : this._expirations.delete(t), this._updateNextExpiryOnWrite(r, n.expiresAt), !0;
	}
	/**
	* Number of non-expired entries (purges expired entries lazily).
	* @returns {number}
	*/
	get size() {
		if (!this._map.size) return 0;
		if (!this._expirations.size) return this._map.size;
		const t = Ee();
		return !this._nextExpiryDirty && this._nextExpiryAt && t <= this._nextExpiryAt ? this._map.size : (this._sweepExpirations(t), this._map.size);
	}
	_updateNextExpiryOnWrite(t, e) {
		t && this._nextExpiryAt === t && t !== e && (this._nextExpiryDirty = !0), e && (!this._nextExpiryAt || e < this._nextExpiryAt) && (this._nextExpiryAt = e);
	}
	_sweepExpirations(t) {
		let e = 0;
		for (const [n, r] of this._expirations) {
			if (r && t > r) {
				const i = this._map.get(n);
				this._expireKey(n, i);
				continue;
			}
			r && (!e || r < e) && (e = r);
		}
		this._nextExpiryAt = e, this._nextExpiryDirty = !1;
	}
	/**
	* Iterate entries [key, value] skipping expired entries.
	* @returns {IterableIterator<[any, any]>}
	*/
	*entries() {
		const t = Ee();
		for (const [e, n] of this._map) {
			if (n.expiresAt && t > n.expiresAt) {
				this._expireKey(e, n);
				continue;
			}
			yield [e, n.value];
		}
	}
	/**
	* Iterate keys of non-expired entries.
	* @returns {IterableIterator<any>}
	*/
	*keys() {
		for (const [t] of this.entries()) yield t;
	}
	/**
	* Iterate values of non-expired entries.
	* @returns {IterableIterator<any>}
	*/
	*values() {
		for (const [, t] of this.entries()) yield t;
	}
	/**
	* Call \`cb\` for each non-expired entry.
	* @param {Function} cb
	* @param {any} [thisArg]
	*/
	forEach(t, e) {
		for (const [n, r] of this.entries()) t.call(e, r, n, this);
	}
	/**
	* Default iterator yielding \`[key, value]\` pairs for non-expired entries.
	*/
	[Symbol.iterator]() {
		return this.entries();
	}
};
const so = new ro({ maxEntries: 500 }), Sn = new io(0);
let Xn = 3e5;
async function oo(t, e) {
	try {
		if (!t || Sn.has(t)) return null;
		try {
			const n = await so.getOrSetAsync(t, async () => {
				const r = await e();
				if (r == null) throw new Error("importCache: loader returned null");
				return r;
			});
			return Sn.delete(t), n;
		} catch {
			return Sn.set(t, 1, Xn), null;
		}
	} catch {
		return null;
	}
}
async function ao(t) {
	return await oo(t, async () => {
		try {
			return await import(t);
		} catch {
			return null;
		}
	});
}
let rt, it;
function lo() {
	return rt !== void 0 ? rt === !1 ? null : rt : typeof TextEncoder < "u" ? (rt = new TextEncoder(), rt) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (rt = { encode: (t) => new Uint8Array(Buffer.from(t)) }, rt) : (rt = !1, null);
}
function co() {
	return it !== void 0 ? it === !1 ? null : it : typeof TextDecoder < "u" ? (it = new TextDecoder(), it) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (it = { decode: (t) => Buffer.from(t).toString("utf8") }, it) : (it = !1, null);
}
const Yn = (t, e) => {
	if (t instanceof Uint8Array) return t;
	if (ArrayBuffer.isView(t)) return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
	if (t instanceof ArrayBuffer) return new Uint8Array(t);
	const n = e ?? JSON.stringify(t), r = lo();
	if (typeof r?.encode == "function") return r.encode(n);
	throw new Error("No TextEncoder or Buffer available to encode object");
}, uo = (t) => {
	let e;
	if (t instanceof Uint8Array) e = t;
	else if (ArrayBuffer.isView(t)) e = new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
	else if (t instanceof ArrayBuffer) e = new Uint8Array(t);
	else if (typeof Buffer < "u" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(t)) e = new Uint8Array(t);
	else throw new TypeError("Unsupported input to u82o, expected ArrayBuffer/TypedArray/Buffer");
	const n = co();
	if (typeof n?.decode == "function") return JSON.parse(n.decode(e));
	if (typeof TextDecoder < "u") return JSON.parse(new TextDecoder().decode(e));
	throw new Error("No TextDecoder or Buffer available to decode object");
};
var fo = (/* @__PURE__ */ bi((/* @__PURE__ */ di(((t, e) => {
	function n(l) {
		return l instanceof Map ? l.clear = l.delete = l.set = function() {
			throw new Error("map is read-only");
		} : l instanceof Set && (l.add = l.clear = l.delete = function() {
			throw new Error("set is read-only");
		}), Object.freeze(l), Object.getOwnPropertyNames(l).forEach((m) => {
			const k = l[m], N = typeof k;
			(N === "object" || N === "function") && !Object.isFrozen(k) && n(k);
		}), l;
	}
	var r = class {
		/**
		* @param {CompiledMode} mode
		*/
		constructor(l) {
			l.data === void 0 && (l.data = {}), this.data = l.data, this.isMatchIgnored = !1;
		}
		ignoreMatch() {
			this.isMatchIgnored = !0;
		}
	};
	function i(l) {
		return l.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
	}
	function s(l, ...m) {
		const k = /* @__PURE__ */ Object.create(null);
		for (const N in l) k[N] = l[N];
		return m.forEach(function(N) {
			for (const B in N) k[B] = N[B];
		}), k;
	}
	const c = "</span>", a = (l) => !!l.scope, p = (l, { prefix: m }) => {
		if (l.startsWith("language:")) return l.replace("language:", "language-");
		if (l.includes(".")) {
			const k = l.split(".");
			return [\`\${m}\${k.shift()}\`, ...k.map((N, B) => \`\${N}\${"_".repeat(B + 1)}\`)].join(" ");
		}
		return \`\${m}\${l}\`;
	};
	var f = class {
		/**
		* Creates a new HTMLRenderer
		*
		* @param {Tree} parseTree - the parse tree (must support \`walk\` API)
		* @param {{classPrefix: string}} options
		*/
		constructor(l, m) {
			this.buffer = "", this.classPrefix = m.classPrefix, l.walk(this);
		}
		/**
		* Adds texts to the output stream
		*
		* @param {string} text */
		addText(l) {
			this.buffer += i(l);
		}
		/**
		* Adds a node open to the output stream (if needed)
		*
		* @param {Node} node */
		openNode(l) {
			if (!a(l)) return;
			const m = p(l.scope, { prefix: this.classPrefix });
			this.span(m);
		}
		/**
		* Adds a node close to the output stream (if needed)
		*
		* @param {Node} node */
		closeNode(l) {
			a(l) && (this.buffer += c);
		}
		/**
		* returns the accumulated buffer
		*/
		value() {
			return this.buffer;
		}
		/**
		* Builds a span element
		*
		* @param {string} className */
		span(l) {
			this.buffer += \`<span class="\${l}">\`;
		}
	};
	const b = (l = {}) => {
		const m = { children: [] };
		return Object.assign(m, l), m;
	};
	var T = class ci {
		constructor() {
			this.rootNode = b(), this.stack = [this.rootNode];
		}
		get top() {
			return this.stack[this.stack.length - 1];
		}
		get root() {
			return this.rootNode;
		}
		/** @param {Node} node */
		add(m) {
			this.top.children.push(m);
		}
		/** @param {string} scope */
		openNode(m) {
			const k = b({ scope: m });
			this.add(k), this.stack.push(k);
		}
		closeNode() {
			if (this.stack.length > 1) return this.stack.pop();
		}
		closeAllNodes() {
			for (; this.closeNode(););
		}
		toJSON() {
			return JSON.stringify(this.rootNode, null, 4);
		}
		/**
		* @typedef { import("./html_renderer").Renderer } Renderer
		* @param {Renderer} builder
		*/
		walk(m) {
			return this.constructor._walk(m, this.rootNode);
		}
		/**
		* @param {Renderer} builder
		* @param {Node} node
		*/
		static _walk(m, k) {
			return typeof k == "string" ? m.addText(k) : k.children && (m.openNode(k), k.children.forEach((N) => this._walk(m, N)), m.closeNode(k)), m;
		}
		/**
		* @param {Node} node
		*/
		static _collapse(m) {
			typeof m != "string" && m.children && (m.children.every((k) => typeof k == "string") ? m.children = [m.children.join("")] : m.children.forEach((k) => {
				ci._collapse(k);
			}));
		}
	}, S = class extends T {
		/**
		* @param {*} options
		*/
		constructor(l) {
			super(), this.options = l;
		}
		/**
		* @param {string} text
		*/
		addText(l) {
			l !== "" && this.add(l);
		}
		/** @param {string} scope */
		startScope(l) {
			this.openNode(l);
		}
		endScope() {
			this.closeNode();
		}
		/**
		* @param {Emitter & {root: DataNode}} emitter
		* @param {string} name
		*/
		__addSublanguage(l, m) {
			const k = l.root;
			m && (k.scope = \`language:\${m}\`), this.add(k);
		}
		toHTML() {
			return new f(this, this.options).value();
		}
		finalize() {
			return this.closeAllNodes(), !0;
		}
	};
	function C(l) {
		return l ? typeof l == "string" ? l : l.source : null;
	}
	function v(l) {
		return W("(?=", l, ")");
	}
	function z(l) {
		return W("(?:", l, ")*");
	}
	function O(l) {
		return W("(?:", l, ")?");
	}
	function W(...l) {
		return l.map((m) => C(m)).join("");
	}
	function re(l) {
		const m = l[l.length - 1];
		return typeof m == "object" && m.constructor === Object ? (l.splice(l.length - 1, 1), m) : {};
	}
	function ie(...l) {
		return "(" + (re(l).capture ? "" : "?:") + l.map((m) => C(m)).join("|") + ")";
	}
	function me(l) {
		return new RegExp(l.toString() + "|").exec("").length - 1;
	}
	function Ne(l, m) {
		const k = l && l.exec(m);
		return k && k.index === 0;
	}
	const We = new RegExp(ie(/\\[(?:[^\\\\\\]]|\\\\.)*\\]/, /\\(\\?<(?![=!])[^>]+>/, /\\(\\?'[^']+'/, /\\(\\??/, /\\\\([1-9][0-9]*)/, /\\\\./));
	function _e(l, { joinWith: m }) {
		let k = 0;
		return l.map((N) => {
			k += 1;
			const B = k;
			let F = C(N), E = "";
			for (; F.length > 0;) {
				const w = We.exec(F);
				if (!w) {
					E += F;
					break;
				}
				E += F.substring(0, w.index), F = F.substring(w.index + w[0].length), w[0][0] === "\\\\" && w[1] ? E += "\\\\" + String(Number(w[1]) + B) : (E += w[0], (w[0] === "(" || /^\\(\\?[<']/.test(w[0])) && k++);
			}
			return E;
		}).map((N) => \`(\${N})\`).join(m);
	}
	const Me = /\\b\\B/, te = "[a-zA-Z]\\\\w*", Le = "[a-zA-Z_]\\\\w*", xt = "\\\\b\\\\d+(\\\\.\\\\d+)?", Nt = "(-?)(\\\\b0[xX][a-fA-F0-9]+|(\\\\b\\\\d+(\\\\.\\\\d*)?|\\\\.\\\\d+)([eE][-+]?\\\\d+)?)", Ge = "\\\\b(0b[01]+)", an = "!|!=|!==|%|%=|&|&&|&=|\\\\*|\\\\*=|\\\\+|\\\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\\\?|\\\\[|\\\\{|\\\\(|\\\\^|\\\\^=|\\\\||\\\\|=|\\\\|\\\\||~", qe = (l = {}) => {
		const m = /^#![ ]*\\//;
		return l.binary && (l.begin = W(m, /.*\\b/, l.binary, /\\b.*/)), s({
			scope: "meta",
			begin: m,
			end: /$/,
			relevance: 0,
			/** @type {ModeCallback} */
			"on:begin": (k, N) => {
				k.index !== 0 && N.ignoreMatch();
			}
		}, l);
	}, ot = {
		begin: "\\\\\\\\[\\\\s\\\\S]",
		relevance: 0
	}, Cn = {
		scope: "string",
		begin: "'",
		end: "'",
		illegal: "\\\\n",
		contains: [ot]
	}, yt = {
		scope: "string",
		begin: "\\"",
		end: "\\"",
		illegal: "\\\\n",
		contains: [ot]
	}, Lt = { begin: /\\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\\b/ }, at = function(l, m, k = {}) {
		const N = s({
			scope: "comment",
			begin: l,
			end: m,
			contains: []
		}, k);
		N.contains.push({
			scope: "doctag",
			begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
			end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
			excludeBegin: !0,
			relevance: 0
		});
		const B = ie("I", "a", "is", "so", "us", "to", "at", "if", "in", "it", "on", /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, /[A-Za-z]+[-][a-z]+/, /[A-Za-z][a-z]{2,}/);
		return N.contains.push({ begin: W(/[ ]+/, "(", B, /[.]?[:]?([.][ ]|[ ])/, "){3}") }), N;
	}, In = at("//", "$"), Dn = at("/\\\\*", "\\\\*/"), zn = at("#", "$");
	var kt = /* @__PURE__ */ Object.freeze({
		__proto__: null,
		APOS_STRING_MODE: Cn,
		BACKSLASH_ESCAPE: ot,
		BINARY_NUMBER_MODE: {
			scope: "number",
			begin: Ge,
			relevance: 0
		},
		BINARY_NUMBER_RE: Ge,
		COMMENT: at,
		C_BLOCK_COMMENT_MODE: Dn,
		C_LINE_COMMENT_MODE: In,
		C_NUMBER_MODE: {
			scope: "number",
			begin: Nt,
			relevance: 0
		},
		C_NUMBER_RE: Nt,
		END_SAME_AS_BEGIN: function(l) {
			return Object.assign(l, {
				/** @type {ModeCallback} */
				"on:begin": (m, k) => {
					k.data._beginMatch = m[1];
				},
				/** @type {ModeCallback} */
				"on:end": (m, k) => {
					k.data._beginMatch !== m[1] && k.ignoreMatch();
				}
			});
		},
		HASH_COMMENT_MODE: zn,
		IDENT_RE: te,
		MATCH_NOTHING_RE: Me,
		METHOD_GUARD: {
			begin: "\\\\.\\\\s*[a-zA-Z_]\\\\w*",
			relevance: 0
		},
		NUMBER_MODE: {
			scope: "number",
			begin: xt,
			relevance: 0
		},
		NUMBER_RE: xt,
		PHRASAL_WORDS_MODE: Lt,
		QUOTE_STRING_MODE: yt,
		REGEXP_MODE: {
			scope: "regexp",
			begin: /\\/(?=[^/\\n]*\\/)/,
			end: /\\/[gimuy]*/,
			contains: [ot, {
				begin: /\\[/,
				end: /\\]/,
				relevance: 0,
				contains: [ot]
			}]
		},
		RE_STARTERS_RE: an,
		SHEBANG: qe,
		TITLE_MODE: {
			scope: "title",
			begin: te,
			relevance: 0
		},
		UNDERSCORE_IDENT_RE: Le,
		UNDERSCORE_TITLE_MODE: {
			scope: "title",
			begin: Le,
			relevance: 0
		}
	});
	function ln(l, m) {
		l.input[l.index - 1] === "." && m.ignoreMatch();
	}
	function G(l, m) {
		l.className !== void 0 && (l.scope = l.className, delete l.className);
	}
	function Ct(l, m) {
		m && l.beginKeywords && (l.begin = "\\\\b(" + l.beginKeywords.split(" ").join("|") + ")(?!\\\\.)(?=\\\\b|\\\\s)", l.__beforeBegin = ln, l.keywords = l.keywords || l.beginKeywords, delete l.beginKeywords, l.relevance === void 0 && (l.relevance = 0));
	}
	function q(l, m) {
		Array.isArray(l.illegal) && (l.illegal = ie(...l.illegal));
	}
	function It(l, m) {
		if (l.match) {
			if (l.begin || l.end) throw new Error("begin & end are not supported with match");
			l.begin = l.match, delete l.match;
		}
	}
	function Ae(l, m) {
		l.relevance === void 0 && (l.relevance = 1);
	}
	const lt = (l, m) => {
		if (!l.beforeMatch) return;
		if (l.starts) throw new Error("beforeMatch cannot be used with starts");
		const k = Object.assign({}, l);
		Object.keys(l).forEach((N) => {
			delete l[N];
		}), l.keywords = k.keywords, l.begin = W(k.beforeMatch, v(k.begin)), l.starts = {
			relevance: 0,
			contains: [Object.assign(k, { endsParent: !0 })]
		}, l.relevance = 0, delete k.beforeMatch;
	}, cn = [
		"of",
		"and",
		"for",
		"in",
		"not",
		"or",
		"if",
		"then",
		"parent",
		"list",
		"value"
	], Ce = "keyword";
	function Dt(l, m, k = Ce) {
		const N = /* @__PURE__ */ Object.create(null);
		return typeof l == "string" ? B(k, l.split(" ")) : Array.isArray(l) ? B(k, l) : Object.keys(l).forEach(function(F) {
			Object.assign(N, Dt(l[F], m, F));
		}), N;
		function B(F, E) {
			m && (E = E.map((w) => w.toLowerCase())), E.forEach(function(w) {
				const M = w.split("|");
				N[M[0]] = [F, zt(M[0], M[1])];
			});
		}
	}
	function zt(l, m) {
		return m ? Number(m) : un(l) ? 0 : 1;
	}
	function un(l) {
		return cn.includes(l.toLowerCase());
	}
	const $t = {}, ae = (l) => {
		console.error(l);
	}, Ie = (l, ...m) => {
		console.log(\`WARN: \${l}\`, ...m);
	}, pe = (l, m) => {
		$t[\`\${l}/\${m}\`] || (console.log(\`Deprecated as of \${l}. \${m}\`), $t[\`\${l}/\${m}\`] = !0);
	}, Ze = /* @__PURE__ */ new Error();
	function ct(l, m, { key: k }) {
		let N = 0;
		const B = l[k], F = {}, E = {};
		for (let w = 1; w <= m.length; w++) E[w + N] = B[w], F[w + N] = !0, N += me(m[w - 1]);
		l[k] = E, l[k]._emit = F, l[k]._multi = !0;
	}
	function wt(l) {
		if (Array.isArray(l.begin)) {
			if (l.skip || l.excludeBegin || l.returnBegin) throw ae("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Ze;
			if (typeof l.beginScope != "object" || l.beginScope === null) throw ae("beginScope must be object"), Ze;
			ct(l, l.begin, { key: "beginScope" }), l.begin = _e(l.begin, { joinWith: "" });
		}
	}
	function Bt(l) {
		if (Array.isArray(l.end)) {
			if (l.skip || l.excludeEnd || l.returnEnd) throw ae("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Ze;
			if (typeof l.endScope != "object" || l.endScope === null) throw ae("endScope must be object"), Ze;
			ct(l, l.end, { key: "endScope" }), l.end = _e(l.end, { joinWith: "" });
		}
	}
	function Ve(l) {
		l.scope && typeof l.scope == "object" && l.scope !== null && (l.beginScope = l.scope, delete l.scope);
	}
	function Tt(l) {
		Ve(l), typeof l.beginScope == "string" && (l.beginScope = { _wrap: l.beginScope }), typeof l.endScope == "string" && (l.endScope = { _wrap: l.endScope }), wt(l), Bt(l);
	}
	function Et(l) {
		function m(E, w) {
			return new RegExp(C(E), "m" + (l.case_insensitive ? "i" : "") + (l.unicodeRegex ? "u" : "") + (w ? "g" : ""));
		}
		class k {
			constructor() {
				this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
			}
			addRule(w, M) {
				M.position = this.position++, this.matchIndexes[this.matchAt] = M, this.regexes.push([M, w]), this.matchAt += me(w) + 1;
			}
			compile() {
				this.regexes.length === 0 && (this.exec = () => null);
				const w = this.regexes.map((M) => M[1]);
				this.matcherRe = m(_e(w, { joinWith: "|" }), !0), this.lastIndex = 0;
			}
			/** @param {string} s */
			exec(w) {
				this.matcherRe.lastIndex = this.lastIndex;
				const M = this.matcherRe.exec(w);
				if (!M) return null;
				const J = M.findIndex((Xe, ht) => ht > 0 && Xe !== void 0), V = this.matchIndexes[J];
				return M.splice(0, J), Object.assign(M, V);
			}
		}
		class N {
			constructor() {
				this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
			}
			getMatcher(w) {
				if (this.multiRegexes[w]) return this.multiRegexes[w];
				const M = new k();
				return this.rules.slice(w).forEach(([J, V]) => M.addRule(J, V)), M.compile(), this.multiRegexes[w] = M, M;
			}
			resumingScanAtSamePosition() {
				return this.regexIndex !== 0;
			}
			considerAll() {
				this.regexIndex = 0;
			}
			addRule(w, M) {
				this.rules.push([w, M]), M.type === "begin" && this.count++;
			}
			/** @param {string} s */
			exec(w) {
				const M = this.getMatcher(this.regexIndex);
				M.lastIndex = this.lastIndex;
				let J = M.exec(w);
				if (this.resumingScanAtSamePosition() && !(J && J.index === this.lastIndex)) {
					const V = this.getMatcher(0);
					V.lastIndex = this.lastIndex + 1, J = V.exec(w);
				}
				return J && (this.regexIndex += J.position + 1, this.regexIndex === this.count && this.considerAll()), J;
			}
		}
		function B(E) {
			const w = new N();
			return E.contains.forEach((M) => w.addRule(M.begin, {
				rule: M,
				type: "begin"
			})), E.terminatorEnd && w.addRule(E.terminatorEnd, { type: "end" }), E.illegal && w.addRule(E.illegal, { type: "illegal" }), w;
		}
		function F(E, w) {
			const M = E;
			if (E.isCompiled) return M;
			[
				G,
				It,
				Tt,
				lt
			].forEach((V) => V(E, w)), l.compilerExtensions.forEach((V) => V(E, w)), E.__beforeBegin = null, [
				Ct,
				q,
				Ae
			].forEach((V) => V(E, w)), E.isCompiled = !0;
			let J = null;
			return typeof E.keywords == "object" && E.keywords.$pattern && (E.keywords = Object.assign({}, E.keywords), J = E.keywords.$pattern, delete E.keywords.$pattern), J = J || /\\w+/, E.keywords && (E.keywords = Dt(E.keywords, l.case_insensitive)), M.keywordPatternRe = m(J, !0), w && (E.begin || (E.begin = /\\B|\\b/), M.beginRe = m(M.begin), !E.end && !E.endsWithParent && (E.end = /\\B|\\b/), E.end && (M.endRe = m(M.end)), M.terminatorEnd = C(M.end) || "", E.endsWithParent && w.terminatorEnd && (M.terminatorEnd += (E.end ? "|" : "") + w.terminatorEnd)), E.illegal && (M.illegalRe = m(E.illegal)), E.contains || (E.contains = []), E.contains = [].concat(...E.contains.map(function(V) {
				return hn(V === "self" ? E : V);
			})), E.contains.forEach(function(V) {
				F(V, M);
			}), E.starts && F(E.starts, w), M.matcher = B(M), M;
		}
		if (l.compilerExtensions || (l.compilerExtensions = []), l.contains && l.contains.includes("self")) throw new Error("ERR: contains \`self\` is not supported at the top-level of a language.  See documentation.");
		return l.classNameAliases = s(l.classNameAliases || {}), F(l);
	}
	function Ut(l) {
		return l ? l.endsWithParent || Ut(l.starts) : !1;
	}
	function hn(l) {
		return l.variants && !l.cachedVariants && (l.cachedVariants = l.variants.map(function(m) {
			return s(l, { variants: null }, m);
		})), l.cachedVariants ? l.cachedVariants : Ut(l) ? s(l, { starts: l.starts ? s(l.starts) : null }) : Object.isFrozen(l) ? s(l) : l;
	}
	var pn = "11.12.0", jt = class extends Error {
		constructor(l, m) {
			super(l), this.name = "HTMLInjectionError", this.html = m;
		}
	};
	const ut = i, $e = s, Be = /* @__PURE__ */ Symbol("nomatch"), fn = 7, Ft = function(l) {
		const m = /* @__PURE__ */ Object.create(null), k = /* @__PURE__ */ Object.create(null), N = [];
		let B = !0;
		const F = "Could not find the language '{}', did you forget to load/include a language module?", E = {
			disableAutodetect: !0,
			name: "Plain text",
			contains: []
		};
		let w = {
			ignoreUnescapedHTML: !1,
			throwUnescapedHTML: !1,
			noHighlightRe: /^(no-?highlight)$/i,
			languageDetectRe: /\\blang(?:uage)?-([\\w-]+)\\b/i,
			classPrefix: "hljs-",
			cssSelector: "pre code",
			languages: null,
			__emitter: S
		};
		function M(x) {
			return w.noHighlightRe.test(x);
		}
		function J(x) {
			let R = x.className + " ";
			R += x.parentNode ? x.parentNode.className : "";
			const D = w.languageDetectRe.exec(R);
			if (D) {
				const H = De(D[1]);
				return H || (Ie(F.replace("{}", D[1])), Ie("Falling back to no-highlight mode for this block.", x)), H ? D[1] : "no-highlight";
			}
			return R.split(/\\s+/).find((H) => M(H) || De(H));
		}
		function V(x, R, D) {
			let H = "", Y = "";
			typeof R == "object" ? (H = x, D = R.ignoreIllegals, Y = R.language) : (pe("10.7.0", "highlight(lang, code, ...args) has been deprecated."), pe("10.7.0", \`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277\`), Y = x, H = R), D === void 0 && (D = !0);
			const be = {
				code: H,
				language: Y
			};
			je("before:highlight", be);
			const fe = be.result ? be.result : Xe(be.language, be.code, D);
			return fe.code = be.code, je("after:highlight", fe), fe;
		}
		function Xe(x, R, D, H) {
			const Y = /* @__PURE__ */ Object.create(null);
			function be(h, g) {
				return h.keywords[g];
			}
			function fe() {
				if (!P.keywords) {
					K.addText(U);
					return;
				}
				let h = 0;
				P.keywordPatternRe.lastIndex = 0;
				let g = P.keywordPatternRe.exec(U), y = "";
				for (; g;) {
					y += U.substring(h, g.index);
					const A = Se.case_insensitive ? g[0].toLowerCase() : g[0], I = be(P, A);
					if (I) {
						const [Q, ue] = I;
						if (K.addText(y), y = "", Y[A] = (Y[A] || 0) + 1, Y[A] <= fn && (_ += ue), Q.startsWith("_")) y += g[0];
						else {
							const Je = Se.classNameAliases[Q] || Q;
							Pe(g[0], Je);
						}
					} else y += g[0];
					h = P.keywordPatternRe.lastIndex, g = P.keywordPatternRe.exec(U);
				}
				y += U.substring(h), K.addText(y);
			}
			function xe() {
				if (U === "") return;
				let h = null;
				if (typeof P.subLanguage == "string") {
					if (!m[P.subLanguage]) {
						K.addText(U);
						return;
					}
					h = Xe(P.subLanguage, U, !0, Vt[P.subLanguage]), Vt[P.subLanguage] = h._top;
				} else h = Ht(U, P.subLanguage.length ? P.subLanguage : null);
				P.relevance > 0 && (_ += h.relevance), K.__addSublanguage(h._emitter, h.language);
			}
			function le() {
				P.subLanguage != null ? xe() : fe(), U = "";
			}
			function Pe(h, g) {
				h !== "" && (K.startScope(g), K.addText(h), K.endScope());
			}
			function Ke(h, g) {
				let y = 1;
				const A = g.length - 1;
				for (; y <= A;) {
					if (!h._emit[y]) {
						y++;
						continue;
					}
					const I = Se.classNameAliases[h[y]] || h[y], Q = g[y];
					I ? Pe(Q, I) : (U = Q, fe(), U = ""), y++;
				}
			}
			function ye(h, g) {
				return h.scope && typeof h.scope == "string" && K.openNode(Se.classNameAliases[h.scope] || h.scope), h.beginScope && (h.beginScope._wrap ? (Pe(U, Se.classNameAliases[h.beginScope._wrap] || h.beginScope._wrap), U = "") : h.beginScope._multi && (Ke(h.beginScope, g), U = "")), P = Object.create(h, { parent: { value: P } }), P;
			}
			function yn(h, g, y) {
				let A = Ne(h.endRe, y);
				if (A) {
					if (h["on:end"]) {
						const I = new r(h);
						h["on:end"](g, I), I.isMatchIgnored && (A = !1);
					}
					if (A) {
						for (; h.endsParent && h.parent;) h = h.parent;
						return h;
					}
				}
				if (h.endsWithParent) return yn(h.parent, g, y);
			}
			function At(h) {
				return P.matcher.regexIndex === 0 ? (U += h[0], 1) : (d = !0, 0);
			}
			function jn(h) {
				const g = h[0], y = h.rule, A = new r(y), I = [y.__beforeBegin, y["on:begin"]];
				for (const Q of I) if (Q && (Q(h, A), A.isMatchIgnored)) return At(g);
				return y.skip ? U += g : (y.excludeBegin && (U += g), le(), !y.returnBegin && !y.excludeBegin && (U = g)), ye(y, h), y.returnBegin ? 0 : g.length;
			}
			function kn(h) {
				const g = h[0], y = R.substring(h.index), A = yn(P, h, y);
				if (!A) return Be;
				const I = P;
				P.endScope && P.endScope._wrap ? (le(), Pe(g, P.endScope._wrap)) : P.endScope && P.endScope._multi ? (le(), Ke(P.endScope, h)) : I.skip ? U += g : (I.returnEnd || I.excludeEnd || (U += g), le(), I.excludeEnd && (U = g));
				do
					P.scope && K.closeNode(), !P.skip && !P.subLanguage && (_ += P.relevance), P = P.parent;
				while (P !== A.parent);
				return A.starts && ye(A.starts, h), I.returnEnd ? 0 : g.length;
			}
			function Qe() {
				const h = [];
				for (let g = P; g !== Se; g = g.parent) g.scope && h.unshift(g.scope);
				h.forEach((g) => K.openNode(g));
			}
			let gt = {};
			function qt(h, g) {
				const y = g && g[0];
				if (U += h, y == null) return le(), 0;
				if (gt.type === "begin" && g.type === "end" && gt.index === g.index && y === "") {
					if (U += R.slice(g.index, g.index + 1), !B) {
						const A = /* @__PURE__ */ new Error(\`0 width match regex (\${x})\`);
						throw A.languageName = x, A.badRule = gt.rule, A;
					}
					return 1;
				}
				if (gt = g, g.type === "begin") return jn(g);
				if (g.type === "illegal" && !D) {
					const A = /* @__PURE__ */ new Error("Illegal lexeme \\"" + y + "\\" for mode \\"" + (P.scope || "<unnamed>") + "\\"");
					throw A.mode = P, A;
				} else if (g.type === "end") {
					const A = kn(g);
					if (A !== Be) return A;
				}
				if (g.type === "illegal" && y === "") return g.index === R.length || (U += \`
\`), 1;
				if (u > 1e5 && u > g.index * 3) throw /* @__PURE__ */ new Error("potential infinite loop, way more iterations than matches");
				return U += y, y.length;
			}
			const Se = De(x);
			if (!Se) throw ae(F.replace("{}", x)), /* @__PURE__ */ new Error("Unknown language: \\"" + x + "\\"");
			const wn = Et(Se);
			let Zt = "", P = H || wn;
			const Vt = {}, K = new w.__emitter(w);
			Qe();
			let U = "", _ = 0, o = 0, u = 0, d = !1;
			try {
				if (Se.__emitTokens) Se.__emitTokens(R, K);
				else {
					for (P.matcher.considerAll();;) {
						u++, d ? d = !1 : P.matcher.considerAll(), P.matcher.lastIndex = o;
						const h = P.matcher.exec(R);
						if (!h) break;
						const g = qt(R.substring(o, h.index), h);
						o = h.index + g;
					}
					qt(R.substring(o));
				}
				return K.finalize(), Zt = K.toHTML(), {
					language: x,
					value: Zt,
					relevance: _,
					illegal: !1,
					_emitter: K,
					_top: P
				};
			} catch (h) {
				if (h.message && h.message.includes("Illegal")) return {
					language: x,
					value: ut(R),
					illegal: !0,
					relevance: 0,
					_illegalBy: {
						message: h.message,
						index: o,
						context: R.slice(o - 100, o + 100),
						mode: h.mode,
						resultSoFar: Zt
					},
					_emitter: K
				};
				if (B) return {
					language: x,
					value: ut(R),
					illegal: !1,
					relevance: 0,
					errorRaised: h,
					_emitter: K,
					_top: P
				};
				throw h;
			}
		}
		function ht(x) {
			const R = {
				value: ut(x),
				illegal: !1,
				relevance: 0,
				_top: E,
				_emitter: new w.__emitter(w)
			};
			return R._emitter.addText(x), R;
		}
		function Ht(x, R) {
			R = R || w.languages || Object.keys(m);
			const D = ht(x), H = R.filter(De).filter(bn).map((xe) => Xe(xe, x, !1));
			H.unshift(D);
			const [Y, be] = H.sort((xe, le) => {
				if (xe.relevance !== le.relevance) return le.relevance - xe.relevance;
				if (xe.language && le.language) {
					if (De(xe.language).supersetOf === le.language) return 1;
					if (De(le.language).supersetOf === xe.language) return -1;
				}
				return 0;
			}), fe = Y;
			return fe.secondBest = be, fe;
		}
		function pt(x, R, D) {
			const H = R && k[R] || D;
			x.classList.add("hljs"), x.classList.add(\`language-\${H}\`);
		}
		function Wt(x) {
			let R = null;
			const D = J(x);
			if (M(D)) return;
			if (je("before:highlightElement", {
				el: x,
				language: D
			}), x.dataset.highlighted) {
				console.log("Element previously highlighted. To highlight again, first unset \`dataset.highlighted\`.", x);
				return;
			}
			if (x.children.length > 0 && (w.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(x)), w.throwUnescapedHTML)) throw new jt("One of your code blocks includes unescaped HTML.", x.innerHTML);
			R = x;
			const H = R.textContent, Y = D ? V(H, {
				language: D,
				ignoreIllegals: !0
			}) : Ht(H);
			x.innerHTML = Y.value, x.dataset.highlighted = "yes", pt(x, D, Y.language), x.result = {
				language: Y.language,
				re: Y.relevance,
				relevance: Y.relevance
			}, Y.secondBest && (x.secondBest = {
				language: Y.secondBest.language,
				relevance: Y.secondBest.relevance
			}), je("after:highlightElement", {
				el: x,
				result: Y,
				text: H
			});
		}
		function Bn(x) {
			w = $e(w, x);
		}
		const X = () => {
			ft(), pe("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
		};
		function Ye() {
			ft(), pe("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
		}
		let gn = !1;
		function ft() {
			function x() {
				ft();
			}
			if (document.readyState === "loading") {
				gn || window.addEventListener("DOMContentLoaded", x, !1), gn = !0;
				return;
			}
			document.querySelectorAll(w.cssSelector).forEach(Wt);
		}
		function Gt(x, R) {
			let D = null;
			try {
				D = R(l);
			} catch (H) {
				if (ae("Language definition for '{}' could not be registered.".replace("{}", x)), B) ae(H);
				else throw H;
				D = E;
			}
			D.name || (D.name = x), m[x] = D, D.rawDefinition = R.bind(null, l), D.aliases && _n(D.aliases, { languageName: x });
		}
		function dn(x) {
			delete m[x];
			for (const R of Object.keys(k)) k[R] === x && delete k[R];
		}
		function mn() {
			return Object.keys(m);
		}
		function De(x) {
			return x = (x || "").toLowerCase(), m[x] || m[k[x]];
		}
		function _n(x, { languageName: R }) {
			typeof x == "string" && (x = [x]), x.forEach((D) => {
				k[D.toLowerCase()] = R;
			});
		}
		function bn(x) {
			const R = De(x);
			return R && !R.disableAutodetect;
		}
		function Un(x) {
			x["before:highlightBlock"] && !x["before:highlightElement"] && (x["before:highlightElement"] = (R) => {
				x["before:highlightBlock"](Object.assign({ block: R.el }, R));
			}), x["after:highlightBlock"] && !x["after:highlightElement"] && (x["after:highlightElement"] = (R) => {
				x["after:highlightBlock"](Object.assign({ block: R.el }, R));
			});
		}
		function ze(x) {
			Un(x), N.push(x);
		}
		function xn(x) {
			const R = N.indexOf(x);
			R !== -1 && N.splice(R, 1);
		}
		function je(x, R) {
			const D = x;
			N.forEach(function(H) {
				H[D] && H[D](R);
			});
		}
		function Fe(x) {
			return pe("10.7.0", "highlightBlock will be removed entirely in v12.0"), pe("10.7.0", "Please use highlightElement now."), Wt(x);
		}
		Object.assign(l, {
			highlight: V,
			highlightAuto: Ht,
			highlightAll: ft,
			highlightElement: Wt,
			highlightBlock: Fe,
			configure: Bn,
			initHighlighting: X,
			initHighlightingOnLoad: Ye,
			registerLanguage: Gt,
			unregisterLanguage: dn,
			listLanguages: mn,
			getLanguage: De,
			registerAliases: _n,
			autoDetection: bn,
			inherit: $e,
			addPlugin: ze,
			removePlugin: xn
		}), l.debugMode = function() {
			B = !1;
		}, l.safeMode = function() {
			B = !0;
		}, l.versionString = pn, l.regex = {
			concat: W,
			lookahead: v,
			either: ie,
			optional: O,
			anyNumberOfTimes: z
		};
		for (const x in kt) typeof kt[x] == "object" && n(kt[x]);
		return Object.assign(l, kt), l;
	}, Ue = Ft({});
	Ue.newInstance = () => Ft({}), e.exports = Ue, Ue.HighlightJS = Ue, Ue.default = Ue;
})))())).default;
const en = mr && (j || mr) || void 0, Wr = /\`\`\`\\s*([a-zA-Z0-9_\\-+]+)?/g, go = /* @__PURE__ */ new Set([
	"bash",
	"sh",
	"zsh",
	"javascript",
	"js",
	"python",
	"py",
	"php",
	"java",
	"c",
	"cpp",
	"rust",
	"go",
	"ruby",
	"perl",
	"r",
	"scala",
	"swift",
	"kotlin",
	"cs",
	"csharp",
	"html",
	"css",
	"json",
	"xml",
	"yaml",
	"yml",
	"dockerfile",
	"docker"
]), mo = {
	1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
	2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
	3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
	4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
	5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
	6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
};
let de = null;
function _o(t) {
	try {
		if (!t && t !== 0) return "";
		const e = String(t), n = {
			amp: "&",
			lt: "<",
			gt: ">",
			quot: "\\"",
			apos: "'",
			nbsp: " "
		};
		return e.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (r, i) => {
			if (!i) return r;
			if (i[0] === "#") try {
				return i[1] === "x" || i[1] === "X" ? String.fromCharCode(parseInt(i.slice(2), 16)) : String.fromCharCode(parseInt(i.slice(1), 10));
			} catch {
				return r;
			}
			return n[i] !== void 0 ? n[i] : r;
		});
	} catch {
		return String(t ?? "");
	}
}
function bo(t, e) {
	const n = String(t ?? "");
	if (!n || n.length <= e) return [n];
	const r = /^#{1,6}\\s.*$/gm, i = [];
	let s;
	for (; (s = r.exec(n)) !== null;) i.push(s.index);
	if (!i.length || i.length < 2) {
		const f = [];
		for (let b = 0; b < n.length; b += e) f.push(n.slice(b, b + e));
		return f;
	}
	const c = [];
	i[0] > 0 && c.push(n.slice(0, i[0]));
	for (let f = 0; f < i.length; f++) {
		const b = i[f], T = f + 1 < i.length ? i[f + 1] : n.length;
		c.push(n.slice(b, T));
	}
	const a = [];
	let p = "";
	for (const f of c) {
		if (!p && f.length >= e) {
			a.push(f);
			continue;
		}
		p.length + f.length <= e ? p += f : (p && a.push(p), p = f);
	}
	return p && a.push(p), a;
}
function xo(t) {
	try {
		return String(t ?? "").toLowerCase().trim().replace(/[^a-z0-9\\-\\s]+/g, "").replace(/\\s+/g, "-");
	} catch {
		return "heading";
	}
}
async function yo(t) {
	return await ao(t);
}
async function lr() {
	if (de) return de;
	try {
		de = fo || null;
	} catch {
		de = null;
	}
	return de;
}
function ko(t) {
	return t <= 2 ? "has-text-weight-bold" : t <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
}
function ui(t, e = /* @__PURE__ */ new Map()) {
	const n = [];
	let r = String(t ?? "");
	return r = r.replace(/<h([1-6])([^>]*)>([\\s\\S]*?)<\\/h\\1>/g, (i, s, c, a) => {
		const p = Number(s);
		let f = a.replace(/<[^>]+>/g, "").trim();
		try {
			f = _o(f);
		} catch {}
		let b = null;
		const T = (c || "").match(/\\sid="([^"]+)"/);
		T && (b = T[1]);
		const S = b || xo(f) || "heading", C = (e.get(S) || 0) + 1;
		e.set(S, C);
		const v = C === 1 ? S : S + "-" + C;
		n.push({
			level: p,
			text: f,
			id: v
		});
		const z = \`\${mo[p]} \${ko(p)}\`.trim();
		return \`<h\${p} \${((c || "").replace(/\\s*(id|class)="[^"]*"/g, "") + \` id="\${v}" class="\${z}"\`).trim()}>\${a}</h\${p}>\`;
	}), r = r.replace(/<img([^>]*)>/g, (i, s) => /\\bloading=/.test(s) ? \`<img\${s}>\` : /\\bdata-want-lazy=/.test(s) ? \`<img\${s}>\` : \`<img\${s} loading="lazy">\`), {
		html: r,
		toc: n
	};
}
async function wo(t, e) {
	try {
		if (!await lr()) return {
			type: "register-error",
			name: t,
			error: "hljs unavailable"
		};
		const n = await yo(e), r = n ? n.default || n : null;
		return r ? (de.registerLanguage(t, r), {
			type: "registered",
			name: t
		}) : {
			type: "register-error",
			name: t,
			error: "failed to import language module"
		};
	} catch (n) {
		return {
			type: "register-error",
			name: t,
			error: String(n)
		};
	}
}
function To(t, e, n) {
	const r = /* @__PURE__ */ new Set(), i = new RegExp(Wr.source, Wr.flags);
	let s;
	for (; s = i.exec(e || "");) {
		if (!s[1]) continue;
		const c = String(s[1]).toLowerCase();
		if (c && (c.length >= 5 && c.length <= 30 && /^[a-z][a-z0-9_\\-+]*$/.test(c) && r.add(c), go.has(c) && r.add(c), n?.length)) try {
			n.indexOf(c) !== -1 && r.add(c);
		} catch {}
	}
	return {
		id: t,
		result: Array.from(r)
	};
}
async function Eo(t, e = /* @__PURE__ */ new Map()) {
	const { content: n, data: r } = li(t || "");
	await lr().catch(() => {});
	const i = ui(ai.sanitize(en.parse(n)), e);
	return {
		html: i.html,
		meta: r || {},
		toc: i.toc
	};
}
async function Ao(t, e) {
	const n = t.id, r = Number(t.chunkSize) || 65536, { content: i, data: s } = li(t.md || "");
	await lr().catch(() => {});
	const c = bo(i, r), a = /* @__PURE__ */ new Map();
	for (let f = 0; f < c.length; f++) {
		const b = ui(ai.sanitize(en.parse(c[f])), a);
		e({
			id: n,
			type: "chunk",
			html: b.html,
			toc: b.toc,
			index: f,
			isLast: f === c.length - 1
		});
	}
	const p = {
		id: n,
		type: "done",
		meta: s || {}
	};
	return e(p), p;
}
function dt(t, e) {
	typeof postMessage == "function" && (e?.length ? postMessage(t, e) : postMessage(t));
}
function So(t = globalThis) {
	const e = async (n) => {
		let r;
		try {
			r = uo(n.data);
		} catch {}
		r = r || n.data || {};
		const { correlationId: i } = r, s = (a) => {
			if (i != null) {
				const p = Yn({
					correlationId: i,
					response: a
				});
				dt(p, [p.buffer]);
			} else dt({
				id: r.id,
				result: a
			});
		}, c = (a) => {
			if (i != null) {
				const p = Yn({
					correlationId: i,
					response: { error: String(a) }
				});
				dt(p, [p.buffer]);
			} else dt({
				id: r.id,
				error: String(a)
			});
		};
		try {
			if (r?.type === "register") {
				const a = await wo(r?.name, r?.url);
				if (i != null) s(a);
				else {
					const p = Yn(a);
					dt(p, [p.buffer]);
				}
				return;
			}
			if (r?.type === "detect") {
				dt(To(r?.id, r?.md || "", r?.supported || []));
				return;
			}
			if (r?.type === "stream") {
				await Ao(r, (a) => dt(a));
				return;
			}
			s(await Eo(r?.md || "", /* @__PURE__ */ new Map()));
		} catch (a) {
			c(a);
		}
	};
	return t && (t.onmessage = e), e;
}
en && typeof en.setOptions == "function" && en.setOptions({
	gfm: !0,
	headerIds: !0,
	mangle: !1,
	highlighted: (t, e) => {
		try {
			return de && e && typeof de.getLanguage == "function" && de.getLanguage(e) ? de.highlight(t, { language: e }).value : de && typeof de.getLanguage == "function" && de.getLanguage("plaintext") ? de.highlight(t, { language: "plaintext" }).value : t;
		} catch {
			return t;
		}
	}
});
So(globalThis);
`,Va=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",gl],{type:"text/javascript;charset=utf-8"});function mh(e){let t;try{if(t=Va&&(self.URL||self.webkitURL).createObjectURL(Va),!t)throw"";const n=new Worker(t,{type:"module",name:e?.name});return n.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(t)}),n}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(gl),{type:"module",name:e?.name})}}var Tr={100:"💯",1234:"🔢",grinning:"😀",grimacing:"😬",grin:"😁",joy:"😂",rofl:"🤣",partying:"🥳",smiley:"😃",smile:"😄",sweat_smile:"😅",laughing:"😆",innocent:"😇",wink:"😉",blush:"😊",slightly_smiling_face:"🙂",upside_down_face:"🙃",relaxed:"☺️",yum:"😋",relieved:"😌",heart_eyes:"😍",smiling_face_with_three_hearts:"🥰",kissing_heart:"😘",kissing:"😗",kissing_smiling_eyes:"😙",kissing_closed_eyes:"😚",stuck_out_tongue_winking_eye:"😜",zany:"🤪",raised_eyebrow:"🤨",monocle:"🧐",stuck_out_tongue_closed_eyes:"😝",stuck_out_tongue:"😛",money_mouth_face:"🤑",nerd_face:"🤓",sunglasses:"😎",star_struck:"🤩",clown_face:"🤡",cowboy_hat_face:"🤠",hugs:"🤗",smirk:"😏",no_mouth:"😶",neutral_face:"😐",expressionless:"😑",unamused:"😒",roll_eyes:"🙄",thinking:"🤔",lying_face:"🤥",hand_over_mouth:"🤭",shushing:"🤫",symbols_over_mouth:"🤬",exploding_head:"🤯",flushed:"😳",disappointed:"😞",worried:"😟",angry:"😠",rage:"😡",pensive:"😔",confused:"😕",slightly_frowning_face:"🙁",frowning_face:"☹",persevere:"😣",confounded:"😖",tired_face:"😫",weary:"😩",pleading:"🥺",triumph:"😤",open_mouth:"😮",scream:"😱",fearful:"😨",cold_sweat:"😰",hushed:"😯",frowning:"😦",anguished:"😧",cry:"😢",disappointed_relieved:"😥",drooling_face:"🤤",sleepy:"😪",sweat:"😓",hot:"🥵",cold:"🥶",sob:"😭",dizzy_face:"😵",astonished:"😲",zipper_mouth_face:"🤐",nauseated_face:"🤢",sneezing_face:"🤧",vomiting:"🤮",mask:"😷",face_with_thermometer:"🤒",face_with_head_bandage:"🤕",woozy:"🥴",sleeping:"😴",zzz:"💤",poop:"💩",smiling_imp:"😈",imp:"👿",japanese_ogre:"👹",japanese_goblin:"👺",skull:"💀",ghost:"👻",alien:"👽",robot:"🤖",smiley_cat:"😺",smile_cat:"😸",joy_cat:"😹",heart_eyes_cat:"😻",smirk_cat:"😼",kissing_cat:"😽",scream_cat:"🙀",crying_cat_face:"😿",pouting_cat:"😾",palms_up:"🤲",raised_hands:"🙌",clap:"👏",wave:"👋",call_me_hand:"🤙","+1":"👍","-1":"👎",facepunch:"👊",fist:"✊",fist_left:"🤛",fist_right:"🤜",v:"✌",ok_hand:"👌",raised_hand:"✋",raised_back_of_hand:"🤚",open_hands:"👐",muscle:"💪",pray:"🙏",foot:"🦶",leg:"🦵",handshake:"🤝",point_up:"☝",point_up_2:"👆",point_down:"👇",point_left:"👈",point_right:"👉",fu:"🖕",raised_hand_with_fingers_splayed:"🖐",love_you:"🤟",metal:"🤘",crossed_fingers:"🤞",vulcan_salute:"🖖",writing_hand:"✍",selfie:"🤳",nail_care:"💅",lips:"👄",tooth:"🦷",tongue:"👅",ear:"👂",nose:"👃",eye:"👁",eyes:"👀",brain:"🧠",bust_in_silhouette:"👤",busts_in_silhouette:"👥",speaking_head:"🗣",baby:"👶",child:"🧒",boy:"👦",girl:"👧",adult:"🧑",man:"👨",woman:"👩",blonde_woman:"👱‍♀️",blonde_man:"👱",bearded_person:"🧔",older_adult:"🧓",older_man:"👴",older_woman:"👵",man_with_gua_pi_mao:"👲",woman_with_headscarf:"🧕",woman_with_turban:"👳‍♀️",man_with_turban:"👳",policewoman:"👮‍♀️",policeman:"👮",construction_worker_woman:"👷‍♀️",construction_worker_man:"👷",guardswoman:"💂‍♀️",guardsman:"💂",female_detective:"🕵️‍♀️",male_detective:"🕵",woman_health_worker:"👩‍⚕️",man_health_worker:"👨‍⚕️",woman_farmer:"👩‍🌾",man_farmer:"👨‍🌾",woman_cook:"👩‍🍳",man_cook:"👨‍🍳",woman_student:"👩‍🎓",man_student:"👨‍🎓",woman_singer:"👩‍🎤",man_singer:"👨‍🎤",woman_teacher:"👩‍🏫",man_teacher:"👨‍🏫",woman_factory_worker:"👩‍🏭",man_factory_worker:"👨‍🏭",woman_technologist:"👩‍💻",man_technologist:"👨‍💻",woman_office_worker:"👩‍💼",man_office_worker:"👨‍💼",woman_mechanic:"👩‍🔧",man_mechanic:"👨‍🔧",woman_scientist:"👩‍🔬",man_scientist:"👨‍🔬",woman_artist:"👩‍🎨",man_artist:"👨‍🎨",woman_firefighter:"👩‍🚒",man_firefighter:"👨‍🚒",woman_pilot:"👩‍✈️",man_pilot:"👨‍✈️",woman_astronaut:"👩‍🚀",man_astronaut:"👨‍🚀",woman_judge:"👩‍⚖️",man_judge:"👨‍⚖️",woman_superhero:"🦸‍♀️",man_superhero:"🦸‍♂️",woman_supervillain:"🦹‍♀️",man_supervillain:"🦹‍♂️",mrs_claus:"🤶",santa:"🎅",sorceress:"🧙‍♀️",wizard:"🧙‍♂️",woman_elf:"🧝‍♀️",man_elf:"🧝‍♂️",woman_vampire:"🧛‍♀️",man_vampire:"🧛‍♂️",woman_zombie:"🧟‍♀️",man_zombie:"🧟‍♂️",woman_genie:"🧞‍♀️",man_genie:"🧞‍♂️",mermaid:"🧜‍♀️",merman:"🧜‍♂️",woman_fairy:"🧚‍♀️",man_fairy:"🧚‍♂️",angel:"👼",pregnant_woman:"🤰",breastfeeding:"🤱",princess:"👸",prince:"🤴",bride_with_veil:"👰",man_in_tuxedo:"🤵",running_woman:"🏃‍♀️",running_man:"🏃",walking_woman:"🚶‍♀️",walking_man:"🚶",dancer:"💃",man_dancing:"🕺",dancing_women:"👯",dancing_men:"👯‍♂️",couple:"👫",two_men_holding_hands:"👬",two_women_holding_hands:"👭",bowing_woman:"🙇‍♀️",bowing_man:"🙇",man_facepalming:"🤦‍♂️",woman_facepalming:"🤦‍♀️",woman_shrugging:"🤷",man_shrugging:"🤷‍♂️",tipping_hand_woman:"💁",tipping_hand_man:"💁‍♂️",no_good_woman:"🙅",no_good_man:"🙅‍♂️",ok_woman:"🙆",ok_man:"🙆‍♂️",raising_hand_woman:"🙋",raising_hand_man:"🙋‍♂️",pouting_woman:"🙎",pouting_man:"🙎‍♂️",frowning_woman:"🙍",frowning_man:"🙍‍♂️",haircut_woman:"💇",haircut_man:"💇‍♂️",massage_woman:"💆",massage_man:"💆‍♂️",woman_in_steamy_room:"🧖‍♀️",man_in_steamy_room:"🧖‍♂️",couple_with_heart_woman_man:"💑",couple_with_heart_woman_woman:"👩‍❤️‍👩",couple_with_heart_man_man:"👨‍❤️‍👨",couplekiss_man_woman:"💏",couplekiss_woman_woman:"👩‍❤️‍💋‍👩",couplekiss_man_man:"👨‍❤️‍💋‍👨",family_man_woman_boy:"👪",family_man_woman_girl:"👨‍👩‍👧",family_man_woman_girl_boy:"👨‍👩‍👧‍👦",family_man_woman_boy_boy:"👨‍👩‍👦‍👦",family_man_woman_girl_girl:"👨‍👩‍👧‍👧",family_woman_woman_boy:"👩‍👩‍👦",family_woman_woman_girl:"👩‍👩‍👧",family_woman_woman_girl_boy:"👩‍👩‍👧‍👦",family_woman_woman_boy_boy:"👩‍👩‍👦‍👦",family_woman_woman_girl_girl:"👩‍👩‍👧‍👧",family_man_man_boy:"👨‍👨‍👦",family_man_man_girl:"👨‍👨‍👧",family_man_man_girl_boy:"👨‍👨‍👧‍👦",family_man_man_boy_boy:"👨‍👨‍👦‍👦",family_man_man_girl_girl:"👨‍👨‍👧‍👧",family_woman_boy:"👩‍👦",family_woman_girl:"👩‍👧",family_woman_girl_boy:"👩‍👧‍👦",family_woman_boy_boy:"👩‍👦‍👦",family_woman_girl_girl:"👩‍👧‍👧",family_man_boy:"👨‍👦",family_man_girl:"👨‍👧",family_man_girl_boy:"👨‍👧‍👦",family_man_boy_boy:"👨‍👦‍👦",family_man_girl_girl:"👨‍👧‍👧",yarn:"🧶",thread:"🧵",coat:"🧥",labcoat:"🥼",womans_clothes:"👚",tshirt:"👕",jeans:"👖",necktie:"👔",dress:"👗",bikini:"👙",kimono:"👘",lipstick:"💄",kiss:"💋",footprints:"👣",flat_shoe:"🥿",high_heel:"👠",sandal:"👡",boot:"👢",mans_shoe:"👞",athletic_shoe:"👟",hiking_boot:"🥾",socks:"🧦",gloves:"🧤",scarf:"🧣",womans_hat:"👒",tophat:"🎩",billed_hat:"🧢",rescue_worker_helmet:"⛑",mortar_board:"🎓",crown:"👑",school_satchel:"🎒",luggage:"🧳",pouch:"👝",purse:"👛",handbag:"👜",briefcase:"💼",eyeglasses:"👓",dark_sunglasses:"🕶",goggles:"🥽",ring:"💍",closed_umbrella:"🌂",dog:"🐶",cat:"🐱",mouse:"🐭",hamster:"🐹",rabbit:"🐰",fox_face:"🦊",bear:"🐻",panda_face:"🐼",koala:"🐨",tiger:"🐯",lion:"🦁",cow:"🐮",pig:"🐷",pig_nose:"🐽",frog:"🐸",squid:"🦑",octopus:"🐙",shrimp:"🦐",monkey_face:"🐵",gorilla:"🦍",see_no_evil:"🙈",hear_no_evil:"🙉",speak_no_evil:"🙊",monkey:"🐒",chicken:"🐔",penguin:"🐧",bird:"🐦",baby_chick:"🐤",hatching_chick:"🐣",hatched_chick:"🐥",duck:"🦆",eagle:"🦅",owl:"🦉",bat:"🦇",wolf:"🐺",boar:"🐗",horse:"🐴",unicorn:"🦄",honeybee:"🐝",bug:"🐛",butterfly:"🦋",snail:"🐌",beetle:"🐞",ant:"🐜",grasshopper:"🦗",spider:"🕷",scorpion:"🦂",crab:"🦀",snake:"🐍",lizard:"🦎","t-rex":"🦖",sauropod:"🦕",turtle:"🐢",tropical_fish:"🐠",fish:"🐟",blowfish:"🐡",dolphin:"🐬",shark:"🦈",whale:"🐳",whale2:"🐋",crocodile:"🐊",leopard:"🐆",zebra:"🦓",tiger2:"🐅",water_buffalo:"🐃",ox:"🐂",cow2:"🐄",deer:"🦌",dromedary_camel:"🐪",camel:"🐫",giraffe:"🦒",elephant:"🐘",rhinoceros:"🦏",goat:"🐐",ram:"🐏",sheep:"🐑",racehorse:"🐎",pig2:"🐖",rat:"🐀",mouse2:"🐁",rooster:"🐓",turkey:"🦃",dove:"🕊",dog2:"🐕",poodle:"🐩",cat2:"🐈",rabbit2:"🐇",chipmunk:"🐿",hedgehog:"🦔",raccoon:"🦝",llama:"🦙",hippopotamus:"🦛",kangaroo:"🦘",badger:"🦡",swan:"🦢",peacock:"🦚",parrot:"🦜",lobster:"🦞",mosquito:"🦟",paw_prints:"🐾",dragon:"🐉",dragon_face:"🐲",cactus:"🌵",christmas_tree:"🎄",evergreen_tree:"🌲",deciduous_tree:"🌳",palm_tree:"🌴",seedling:"🌱",herb:"🌿",shamrock:"☘",four_leaf_clover:"🍀",bamboo:"🎍",tanabata_tree:"🎋",leaves:"🍃",fallen_leaf:"🍂",maple_leaf:"🍁",ear_of_rice:"🌾",hibiscus:"🌺",sunflower:"🌻",rose:"🌹",wilted_flower:"🥀",tulip:"🌷",blossom:"🌼",cherry_blossom:"🌸",bouquet:"💐",mushroom:"🍄",chestnut:"🌰",jack_o_lantern:"🎃",shell:"🐚",spider_web:"🕸",earth_americas:"🌎",earth_africa:"🌍",earth_asia:"🌏",full_moon:"🌕",waning_gibbous_moon:"🌖",last_quarter_moon:"🌗",waning_crescent_moon:"🌘",new_moon:"🌑",waxing_crescent_moon:"🌒",first_quarter_moon:"🌓",waxing_gibbous_moon:"🌔",new_moon_with_face:"🌚",full_moon_with_face:"🌝",first_quarter_moon_with_face:"🌛",last_quarter_moon_with_face:"🌜",sun_with_face:"🌞",crescent_moon:"🌙",star:"⭐",star2:"🌟",dizzy:"💫",sparkles:"✨",comet:"☄",sunny:"☀️",sun_behind_small_cloud:"🌤",partly_sunny:"⛅",sun_behind_large_cloud:"🌥",sun_behind_rain_cloud:"🌦",cloud:"☁️",cloud_with_rain:"🌧",cloud_with_lightning_and_rain:"⛈",cloud_with_lightning:"🌩",zap:"⚡",fire:"🔥",boom:"💥",snowflake:"❄️",cloud_with_snow:"🌨",snowman:"⛄",snowman_with_snow:"☃",wind_face:"🌬",dash:"💨",tornado:"🌪",fog:"🌫",open_umbrella:"☂",umbrella:"☔",droplet:"💧",sweat_drops:"💦",ocean:"🌊",green_apple:"🍏",apple:"🍎",pear:"🍐",tangerine:"🍊",lemon:"🍋",banana:"🍌",watermelon:"🍉",grapes:"🍇",strawberry:"🍓",melon:"🍈",cherries:"🍒",peach:"🍑",pineapple:"🍍",coconut:"🥥",kiwi_fruit:"🥝",mango:"🥭",avocado:"🥑",broccoli:"🥦",tomato:"🍅",eggplant:"🍆",cucumber:"🥒",carrot:"🥕",hot_pepper:"🌶",potato:"🥔",corn:"🌽",leafy_greens:"🥬",sweet_potato:"🍠",peanuts:"🥜",honey_pot:"🍯",croissant:"🥐",bread:"🍞",baguette_bread:"🥖",bagel:"🥯",pretzel:"🥨",cheese:"🧀",egg:"🥚",bacon:"🥓",steak:"🥩",pancakes:"🥞",poultry_leg:"🍗",meat_on_bone:"🍖",bone:"🦴",fried_shrimp:"🍤",fried_egg:"🍳",hamburger:"🍔",fries:"🍟",stuffed_flatbread:"🥙",hotdog:"🌭",pizza:"🍕",sandwich:"🥪",canned_food:"🥫",spaghetti:"🍝",taco:"🌮",burrito:"🌯",green_salad:"🥗",shallow_pan_of_food:"🥘",ramen:"🍜",stew:"🍲",fish_cake:"🍥",fortune_cookie:"🥠",sushi:"🍣",bento:"🍱",curry:"🍛",rice_ball:"🍙",rice:"🍚",rice_cracker:"🍘",oden:"🍢",dango:"🍡",shaved_ice:"🍧",ice_cream:"🍨",icecream:"🍦",pie:"🥧",cake:"🍰",cupcake:"🧁",moon_cake:"🥮",birthday:"🎂",custard:"🍮",candy:"🍬",lollipop:"🍭",chocolate_bar:"🍫",popcorn:"🍿",dumpling:"🥟",doughnut:"🍩",cookie:"🍪",milk_glass:"🥛",beer:"🍺",beers:"🍻",clinking_glasses:"🥂",wine_glass:"🍷",tumbler_glass:"🥃",cocktail:"🍸",tropical_drink:"🍹",champagne:"🍾",sake:"🍶",tea:"🍵",cup_with_straw:"🥤",coffee:"☕",baby_bottle:"🍼",salt:"🧂",spoon:"🥄",fork_and_knife:"🍴",plate_with_cutlery:"🍽",bowl_with_spoon:"🥣",takeout_box:"🥡",chopsticks:"🥢",soccer:"⚽",basketball:"🏀",football:"🏈",baseball:"⚾",softball:"🥎",tennis:"🎾",volleyball:"🏐",rugby_football:"🏉",flying_disc:"🥏","8ball":"🎱",golf:"⛳",golfing_woman:"🏌️‍♀️",golfing_man:"🏌",ping_pong:"🏓",badminton:"🏸",goal_net:"🥅",ice_hockey:"🏒",field_hockey:"🏑",lacrosse:"🥍",cricket:"🏏",ski:"🎿",skier:"⛷",snowboarder:"🏂",person_fencing:"🤺",women_wrestling:"🤼‍♀️",men_wrestling:"🤼‍♂️",woman_cartwheeling:"🤸‍♀️",man_cartwheeling:"🤸‍♂️",woman_playing_handball:"🤾‍♀️",man_playing_handball:"🤾‍♂️",ice_skate:"⛸",curling_stone:"🥌",skateboard:"🛹",sled:"🛷",bow_and_arrow:"🏹",fishing_pole_and_fish:"🎣",boxing_glove:"🥊",martial_arts_uniform:"🥋",rowing_woman:"🚣‍♀️",rowing_man:"🚣",climbing_woman:"🧗‍♀️",climbing_man:"🧗‍♂️",swimming_woman:"🏊‍♀️",swimming_man:"🏊",woman_playing_water_polo:"🤽‍♀️",man_playing_water_polo:"🤽‍♂️",woman_in_lotus_position:"🧘‍♀️",man_in_lotus_position:"🧘‍♂️",surfing_woman:"🏄‍♀️",surfing_man:"🏄",bath:"🛀",basketball_woman:"⛹️‍♀️",basketball_man:"⛹",weight_lifting_woman:"🏋️‍♀️",weight_lifting_man:"🏋",biking_woman:"🚴‍♀️",biking_man:"🚴",mountain_biking_woman:"🚵‍♀️",mountain_biking_man:"🚵",horse_racing:"🏇",business_suit_levitating:"🕴",trophy:"🏆",running_shirt_with_sash:"🎽",medal_sports:"🏅",medal_military:"🎖","1st_place_medal":"🥇","2nd_place_medal":"🥈","3rd_place_medal":"🥉",reminder_ribbon:"🎗",rosette:"🏵",ticket:"🎫",tickets:"🎟",performing_arts:"🎭",art:"🎨",circus_tent:"🎪",woman_juggling:"🤹‍♀️",man_juggling:"🤹‍♂️",microphone:"🎤",headphones:"🎧",musical_score:"🎼",musical_keyboard:"🎹",drum:"🥁",saxophone:"🎷",trumpet:"🎺",guitar:"🎸",violin:"🎻",clapper:"🎬",video_game:"🎮",space_invader:"👾",dart:"🎯",game_die:"🎲",chess_pawn:"♟",slot_machine:"🎰",jigsaw:"🧩",bowling:"🎳",red_car:"🚗",taxi:"🚕",blue_car:"🚙",bus:"🚌",trolleybus:"🚎",racing_car:"🏎",police_car:"🚓",ambulance:"🚑",fire_engine:"🚒",minibus:"🚐",truck:"🚚",articulated_lorry:"🚛",tractor:"🚜",kick_scooter:"🛴",motorcycle:"🏍",bike:"🚲",motor_scooter:"🛵",rotating_light:"🚨",oncoming_police_car:"🚔",oncoming_bus:"🚍",oncoming_automobile:"🚘",oncoming_taxi:"🚖",aerial_tramway:"🚡",mountain_cableway:"🚠",suspension_railway:"🚟",railway_car:"🚃",train:"🚋",monorail:"🚝",bullettrain_side:"🚄",bullettrain_front:"🚅",light_rail:"🚈",mountain_railway:"🚞",steam_locomotive:"🚂",train2:"🚆",metro:"🚇",tram:"🚊",station:"🚉",flying_saucer:"🛸",helicopter:"🚁",small_airplane:"🛩",airplane:"✈️",flight_departure:"🛫",flight_arrival:"🛬",sailboat:"⛵",motor_boat:"🛥",speedboat:"🚤",ferry:"⛴",passenger_ship:"🛳",rocket:"🚀",artificial_satellite:"🛰",seat:"💺",canoe:"🛶",anchor:"⚓",construction:"🚧",fuelpump:"⛽",busstop:"🚏",vertical_traffic_light:"🚦",traffic_light:"🚥",checkered_flag:"🏁",ship:"🚢",ferris_wheel:"🎡",roller_coaster:"🎢",carousel_horse:"🎠",building_construction:"🏗",foggy:"🌁",tokyo_tower:"🗼",factory:"🏭",fountain:"⛲",rice_scene:"🎑",mountain:"⛰",mountain_snow:"🏔",mount_fuji:"🗻",volcano:"🌋",japan:"🗾",camping:"🏕",tent:"⛺",national_park:"🏞",motorway:"🛣",railway_track:"🛤",sunrise:"🌅",sunrise_over_mountains:"🌄",desert:"🏜",beach_umbrella:"🏖",desert_island:"🏝",city_sunrise:"🌇",city_sunset:"🌆",cityscape:"🏙",night_with_stars:"🌃",bridge_at_night:"🌉",milky_way:"🌌",stars:"🌠",sparkler:"🎇",fireworks:"🎆",rainbow:"🌈",houses:"🏘",european_castle:"🏰",japanese_castle:"🏯",stadium:"🏟",statue_of_liberty:"🗽",house:"🏠",house_with_garden:"🏡",derelict_house:"🏚",office:"🏢",department_store:"🏬",post_office:"🏣",european_post_office:"🏤",hospital:"🏥",bank:"🏦",hotel:"🏨",convenience_store:"🏪",school:"🏫",love_hotel:"🏩",wedding:"💒",classical_building:"🏛",church:"⛪",mosque:"🕌",synagogue:"🕍",kaaba:"🕋",shinto_shrine:"⛩",watch:"⌚",iphone:"📱",calling:"📲",computer:"💻",keyboard:"⌨",desktop_computer:"🖥",printer:"🖨",computer_mouse:"🖱",trackball:"🖲",joystick:"🕹",clamp:"🗜",minidisc:"💽",floppy_disk:"💾",cd:"💿",dvd:"📀",vhs:"📼",camera:"📷",camera_flash:"📸",video_camera:"📹",movie_camera:"🎥",film_projector:"📽",film_strip:"🎞",telephone_receiver:"📞",phone:"☎️",pager:"📟",fax:"📠",tv:"📺",radio:"📻",studio_microphone:"🎙",level_slider:"🎚",control_knobs:"🎛",compass:"🧭",stopwatch:"⏱",timer_clock:"⏲",alarm_clock:"⏰",mantelpiece_clock:"🕰",hourglass_flowing_sand:"⏳",hourglass:"⌛",satellite:"📡",battery:"🔋",electric_plug:"🔌",bulb:"💡",flashlight:"🔦",candle:"🕯",fire_extinguisher:"🧯",wastebasket:"🗑",oil_drum:"🛢",money_with_wings:"💸",dollar:"💵",yen:"💴",euro:"💶",pound:"💷",moneybag:"💰",credit_card:"💳",gem:"💎",balance_scale:"⚖",toolbox:"🧰",wrench:"🔧",hammer:"🔨",hammer_and_pick:"⚒",hammer_and_wrench:"🛠",pick:"⛏",nut_and_bolt:"🔩",gear:"⚙",brick:"🧱",chains:"⛓",magnet:"🧲",gun:"🔫",bomb:"💣",firecracker:"🧨",hocho:"🔪",dagger:"🗡",crossed_swords:"⚔",shield:"🛡",smoking:"🚬",skull_and_crossbones:"☠",coffin:"⚰",funeral_urn:"⚱",amphora:"🏺",crystal_ball:"🔮",prayer_beads:"📿",nazar_amulet:"🧿",barber:"💈",alembic:"⚗",telescope:"🔭",microscope:"🔬",hole:"🕳",pill:"💊",syringe:"💉",dna:"🧬",microbe:"🦠",petri_dish:"🧫",test_tube:"🧪",thermometer:"🌡",broom:"🧹",basket:"🧺",toilet_paper:"🧻",label:"🏷",bookmark:"🔖",toilet:"🚽",shower:"🚿",bathtub:"🛁",soap:"🧼",sponge:"🧽",lotion_bottle:"🧴",key:"🔑",old_key:"🗝",couch_and_lamp:"🛋",sleeping_bed:"🛌",bed:"🛏",door:"🚪",bellhop_bell:"🛎",teddy_bear:"🧸",framed_picture:"🖼",world_map:"🗺",parasol_on_ground:"⛱",moyai:"🗿",shopping:"🛍",shopping_cart:"🛒",balloon:"🎈",flags:"🎏",ribbon:"🎀",gift:"🎁",confetti_ball:"🎊",tada:"🎉",dolls:"🎎",wind_chime:"🎐",crossed_flags:"🎌",izakaya_lantern:"🏮",red_envelope:"🧧",email:"✉️",envelope_with_arrow:"📩",incoming_envelope:"📨","e-mail":"📧",love_letter:"💌",postbox:"📮",mailbox_closed:"📪",mailbox:"📫",mailbox_with_mail:"📬",mailbox_with_no_mail:"📭",package:"📦",postal_horn:"📯",inbox_tray:"📥",outbox_tray:"📤",scroll:"📜",page_with_curl:"📃",bookmark_tabs:"📑",receipt:"🧾",bar_chart:"📊",chart_with_upwards_trend:"📈",chart_with_downwards_trend:"📉",page_facing_up:"📄",date:"📅",calendar:"📆",spiral_calendar:"🗓",card_index:"📇",card_file_box:"🗃",ballot_box:"🗳",file_cabinet:"🗄",clipboard:"📋",spiral_notepad:"🗒",file_folder:"📁",open_file_folder:"📂",card_index_dividers:"🗂",newspaper_roll:"🗞",newspaper:"📰",notebook:"📓",closed_book:"📕",green_book:"📗",blue_book:"📘",orange_book:"📙",notebook_with_decorative_cover:"📔",ledger:"📒",books:"📚",open_book:"📖",safety_pin:"🧷",link:"🔗",paperclip:"📎",paperclips:"🖇",scissors:"✂️",triangular_ruler:"📐",straight_ruler:"📏",abacus:"🧮",pushpin:"📌",round_pushpin:"📍",triangular_flag_on_post:"🚩",white_flag:"🏳",black_flag:"🏴",rainbow_flag:"🏳️‍🌈",closed_lock_with_key:"🔐",lock:"🔒",unlock:"🔓",lock_with_ink_pen:"🔏",pen:"🖊",fountain_pen:"🖋",black_nib:"✒️",memo:"📝",pencil2:"✏️",crayon:"🖍",paintbrush:"🖌",mag:"🔍",mag_right:"🔎",heart:"❤️",orange_heart:"🧡",yellow_heart:"💛",green_heart:"💚",blue_heart:"💙",purple_heart:"💜",black_heart:"🖤",broken_heart:"💔",heavy_heart_exclamation:"❣",two_hearts:"💕",revolving_hearts:"💞",heartbeat:"💓",heartpulse:"💗",sparkling_heart:"💖",cupid:"💘",gift_heart:"💝",heart_decoration:"💟",peace_symbol:"☮",latin_cross:"✝",star_and_crescent:"☪",om:"🕉",wheel_of_dharma:"☸",star_of_david:"✡",six_pointed_star:"🔯",menorah:"🕎",yin_yang:"☯",orthodox_cross:"☦",place_of_worship:"🛐",ophiuchus:"⛎",aries:"♈",taurus:"♉",gemini:"♊",cancer:"♋",leo:"♌",virgo:"♍",libra:"♎",scorpius:"♏",sagittarius:"♐",capricorn:"♑",aquarius:"♒",pisces:"♓",id:"🆔",atom_symbol:"⚛",u7a7a:"🈳",u5272:"🈹",radioactive:"☢",biohazard:"☣",mobile_phone_off:"📴",vibration_mode:"📳",u6709:"🈶",u7121:"🈚",u7533:"🈸",u55b6:"🈺",u6708:"🈷️",eight_pointed_black_star:"✴️",vs:"🆚",accept:"🉑",white_flower:"💮",ideograph_advantage:"🉐",secret:"㊙️",congratulations:"㊗️",u5408:"🈴",u6e80:"🈵",u7981:"🈲",a:"🅰️",b:"🅱️",ab:"🆎",cl:"🆑",o2:"🅾️",sos:"🆘",no_entry:"⛔",name_badge:"📛",no_entry_sign:"🚫",x:"❌",o:"⭕",stop_sign:"🛑",anger:"💢",hotsprings:"♨️",no_pedestrians:"🚷",do_not_litter:"🚯",no_bicycles:"🚳","non-potable_water":"🚱",underage:"🔞",no_mobile_phones:"📵",exclamation:"❗",grey_exclamation:"❕",question:"❓",grey_question:"❔",bangbang:"‼️",interrobang:"⁉️",low_brightness:"🔅",high_brightness:"🔆",trident:"🔱",fleur_de_lis:"⚜",part_alternation_mark:"〽️",warning:"⚠️",children_crossing:"🚸",beginner:"🔰",recycle:"♻️",u6307:"🈯",chart:"💹",sparkle:"❇️",eight_spoked_asterisk:"✳️",negative_squared_cross_mark:"❎",white_check_mark:"✅",diamond_shape_with_a_dot_inside:"💠",cyclone:"🌀",loop:"➿",globe_with_meridians:"🌐",m:"Ⓜ️",atm:"🏧",sa:"🈂️",passport_control:"🛂",customs:"🛃",baggage_claim:"🛄",left_luggage:"🛅",wheelchair:"♿",no_smoking:"🚭",wc:"🚾",parking:"🅿️",potable_water:"🚰",mens:"🚹",womens:"🚺",baby_symbol:"🚼",restroom:"🚻",put_litter_in_its_place:"🚮",cinema:"🎦",signal_strength:"📶",koko:"🈁",ng:"🆖",ok:"🆗",up:"🆙",cool:"🆒",new:"🆕",free:"🆓",zero:"0️⃣",one:"1️⃣",two:"2️⃣",three:"3️⃣",four:"4️⃣",five:"5️⃣",six:"6️⃣",seven:"7️⃣",eight:"8️⃣",nine:"9️⃣",keycap_ten:"🔟",asterisk:"*⃣",eject_button:"⏏️",arrow_forward:"▶️",pause_button:"⏸",next_track_button:"⏭",stop_button:"⏹",record_button:"⏺",play_or_pause_button:"⏯",previous_track_button:"⏮",fast_forward:"⏩",rewind:"⏪",twisted_rightwards_arrows:"🔀",repeat:"🔁",repeat_one:"🔂",arrow_backward:"◀️",arrow_up_small:"🔼",arrow_down_small:"🔽",arrow_double_up:"⏫",arrow_double_down:"⏬",arrow_right:"➡️",arrow_left:"⬅️",arrow_up:"⬆️",arrow_down:"⬇️",arrow_upper_right:"↗️",arrow_lower_right:"↘️",arrow_lower_left:"↙️",arrow_upper_left:"↖️",arrow_up_down:"↕️",left_right_arrow:"↔️",arrows_counterclockwise:"🔄",arrow_right_hook:"↪️",leftwards_arrow_with_hook:"↩️",arrow_heading_up:"⤴️",arrow_heading_down:"⤵️",hash:"#️⃣",information_source:"ℹ️",abc:"🔤",abcd:"🔡",capital_abcd:"🔠",symbols:"🔣",musical_note:"🎵",notes:"🎶",wavy_dash:"〰️",curly_loop:"➰",heavy_check_mark:"✔️",arrows_clockwise:"🔃",heavy_plus_sign:"➕",heavy_minus_sign:"➖",heavy_division_sign:"➗",heavy_multiplication_x:"✖️",infinity:"♾",heavy_dollar_sign:"💲",currency_exchange:"💱",copyright:"©️",registered:"®️",tm:"™️",end:"🔚",back:"🔙",on:"🔛",top:"🔝",soon:"🔜",ballot_box_with_check:"☑️",radio_button:"🔘",white_circle:"⚪",black_circle:"⚫",red_circle:"🔴",large_blue_circle:"🔵",small_orange_diamond:"🔸",small_blue_diamond:"🔹",large_orange_diamond:"🔶",large_blue_diamond:"🔷",small_red_triangle:"🔺",black_small_square:"▪️",white_small_square:"▫️",black_large_square:"⬛",white_large_square:"⬜",small_red_triangle_down:"🔻",black_medium_square:"◼️",white_medium_square:"◻️",black_medium_small_square:"◾",white_medium_small_square:"◽",black_square_button:"🔲",white_square_button:"🔳",speaker:"🔈",sound:"🔉",loud_sound:"🔊",mute:"🔇",mega:"📣",loudspeaker:"📢",bell:"🔔",no_bell:"🔕",black_joker:"🃏",mahjong:"🀄",spades:"♠️",clubs:"♣️",hearts:"♥️",diamonds:"♦️",flower_playing_cards:"🎴",thought_balloon:"💭",right_anger_bubble:"🗯",speech_balloon:"💬",left_speech_bubble:"🗨",clock1:"🕐",clock2:"🕑",clock3:"🕒",clock4:"🕓",clock5:"🕔",clock6:"🕕",clock7:"🕖",clock8:"🕗",clock9:"🕘",clock10:"🕙",clock11:"🕚",clock12:"🕛",clock130:"🕜",clock230:"🕝",clock330:"🕞",clock430:"🕟",clock530:"🕠",clock630:"🕡",clock730:"🕢",clock830:"🕣",clock930:"🕤",clock1030:"🕥",clock1130:"🕦",clock1230:"🕧",afghanistan:"🇦🇫",aland_islands:"🇦🇽",albania:"🇦🇱",algeria:"🇩🇿",american_samoa:"🇦🇸",andorra:"🇦🇩",angola:"🇦🇴",anguilla:"🇦🇮",antarctica:"🇦🇶",antigua_barbuda:"🇦🇬",argentina:"🇦🇷",armenia:"🇦🇲",aruba:"🇦🇼",australia:"🇦🇺",austria:"🇦🇹",azerbaijan:"🇦🇿",bahamas:"🇧🇸",bahrain:"🇧🇭",bangladesh:"🇧🇩",barbados:"🇧🇧",belarus:"🇧🇾",belgium:"🇧🇪",belize:"🇧🇿",benin:"🇧🇯",bermuda:"🇧🇲",bhutan:"🇧🇹",bolivia:"🇧🇴",caribbean_netherlands:"🇧🇶",bosnia_herzegovina:"🇧🇦",botswana:"🇧🇼",brazil:"🇧🇷",british_indian_ocean_territory:"🇮🇴",british_virgin_islands:"🇻🇬",brunei:"🇧🇳",bulgaria:"🇧🇬",burkina_faso:"🇧🇫",burundi:"🇧🇮",cape_verde:"🇨🇻",cambodia:"🇰🇭",cameroon:"🇨🇲",canada:"🇨🇦",canary_islands:"🇮🇨",cayman_islands:"🇰🇾",central_african_republic:"🇨🇫",chad:"🇹🇩",chile:"🇨🇱",cn:"🇨🇳",christmas_island:"🇨🇽",cocos_islands:"🇨🇨",colombia:"🇨🇴",comoros:"🇰🇲",congo_brazzaville:"🇨🇬",congo_kinshasa:"🇨🇩",cook_islands:"🇨🇰",costa_rica:"🇨🇷",croatia:"🇭🇷",cuba:"🇨🇺",curacao:"🇨🇼",cyprus:"🇨🇾",czech_republic:"🇨🇿",denmark:"🇩🇰",djibouti:"🇩🇯",dominica:"🇩🇲",dominican_republic:"🇩🇴",ecuador:"🇪🇨",egypt:"🇪🇬",el_salvador:"🇸🇻",equatorial_guinea:"🇬🇶",eritrea:"🇪🇷",estonia:"🇪🇪",ethiopia:"🇪🇹",eu:"🇪🇺",falkland_islands:"🇫🇰",faroe_islands:"🇫🇴",fiji:"🇫🇯",finland:"🇫🇮",fr:"🇫🇷",french_guiana:"🇬🇫",french_polynesia:"🇵🇫",french_southern_territories:"🇹🇫",gabon:"🇬🇦",gambia:"🇬🇲",georgia:"🇬🇪",de:"🇩🇪",ghana:"🇬🇭",gibraltar:"🇬🇮",greece:"🇬🇷",greenland:"🇬🇱",grenada:"🇬🇩",guadeloupe:"🇬🇵",guam:"🇬🇺",guatemala:"🇬🇹",guernsey:"🇬🇬",guinea:"🇬🇳",guinea_bissau:"🇬🇼",guyana:"🇬🇾",haiti:"🇭🇹",honduras:"🇭🇳",hong_kong:"🇭🇰",hungary:"🇭🇺",iceland:"🇮🇸",india:"🇮🇳",indonesia:"🇮🇩",iran:"🇮🇷",iraq:"🇮🇶",ireland:"🇮🇪",isle_of_man:"🇮🇲",israel:"🇮🇱",it:"🇮🇹",cote_divoire:"🇨🇮",jamaica:"🇯🇲",jp:"🇯🇵",jersey:"🇯🇪",jordan:"🇯🇴",kazakhstan:"🇰🇿",kenya:"🇰🇪",kiribati:"🇰🇮",kosovo:"🇽🇰",kuwait:"🇰🇼",kyrgyzstan:"🇰🇬",laos:"🇱🇦",latvia:"🇱🇻",lebanon:"🇱🇧",lesotho:"🇱🇸",liberia:"🇱🇷",libya:"🇱🇾",liechtenstein:"🇱🇮",lithuania:"🇱🇹",luxembourg:"🇱🇺",macau:"🇲🇴",macedonia:"🇲🇰",madagascar:"🇲🇬",malawi:"🇲🇼",malaysia:"🇲🇾",maldives:"🇲🇻",mali:"🇲🇱",malta:"🇲🇹",marshall_islands:"🇲🇭",martinique:"🇲🇶",mauritania:"🇲🇷",mauritius:"🇲🇺",mayotte:"🇾🇹",mexico:"🇲🇽",micronesia:"🇫🇲",moldova:"🇲🇩",monaco:"🇲🇨",mongolia:"🇲🇳",montenegro:"🇲🇪",montserrat:"🇲🇸",morocco:"🇲🇦",mozambique:"🇲🇿",myanmar:"🇲🇲",namibia:"🇳🇦",nauru:"🇳🇷",nepal:"🇳🇵",netherlands:"🇳🇱",new_caledonia:"🇳🇨",new_zealand:"🇳🇿",nicaragua:"🇳🇮",niger:"🇳🇪",nigeria:"🇳🇬",niue:"🇳🇺",norfolk_island:"🇳🇫",northern_mariana_islands:"🇲🇵",north_korea:"🇰🇵",norway:"🇳🇴",oman:"🇴🇲",pakistan:"🇵🇰",palau:"🇵🇼",palestinian_territories:"🇵🇸",panama:"🇵🇦",papua_new_guinea:"🇵🇬",paraguay:"🇵🇾",peru:"🇵🇪",philippines:"🇵🇭",pitcairn_islands:"🇵🇳",poland:"🇵🇱",portugal:"🇵🇹",puerto_rico:"🇵🇷",qatar:"🇶🇦",reunion:"🇷🇪",romania:"🇷🇴",ru:"🇷🇺",rwanda:"🇷🇼",st_barthelemy:"🇧🇱",st_helena:"🇸🇭",st_kitts_nevis:"🇰🇳",st_lucia:"🇱🇨",st_pierre_miquelon:"🇵🇲",st_vincent_grenadines:"🇻🇨",samoa:"🇼🇸",san_marino:"🇸🇲",sao_tome_principe:"🇸🇹",saudi_arabia:"🇸🇦",senegal:"🇸🇳",serbia:"🇷🇸",seychelles:"🇸🇨",sierra_leone:"🇸🇱",singapore:"🇸🇬",sint_maarten:"🇸🇽",slovakia:"🇸🇰",slovenia:"🇸🇮",solomon_islands:"🇸🇧",somalia:"🇸🇴",south_africa:"🇿🇦",south_georgia_south_sandwich_islands:"🇬🇸",kr:"🇰🇷",south_sudan:"🇸🇸",es:"🇪🇸",sri_lanka:"🇱🇰",sudan:"🇸🇩",suriname:"🇸🇷",swaziland:"🇸🇿",sweden:"🇸🇪",switzerland:"🇨🇭",syria:"🇸🇾",taiwan:"🇹🇼",tajikistan:"🇹🇯",tanzania:"🇹🇿",thailand:"🇹🇭",timor_leste:"🇹🇱",togo:"🇹🇬",tokelau:"🇹🇰",tonga:"🇹🇴",trinidad_tobago:"🇹🇹",tunisia:"🇹🇳",tr:"🇹🇷",turkmenistan:"🇹🇲",turks_caicos_islands:"🇹🇨",tuvalu:"🇹🇻",uganda:"🇺🇬",ukraine:"🇺🇦",united_arab_emirates:"🇦🇪",uk:"🇬🇧",england:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",scotland:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",wales:"🏴󠁧󠁢󠁷󠁬󠁳󠁿",us:"🇺🇸",us_virgin_islands:"🇻🇮",uruguay:"🇺🇾",uzbekistan:"🇺🇿",vanuatu:"🇻🇺",vatican_city:"🇻🇦",venezuela:"🇻🇪",vietnam:"🇻🇳",wallis_futuna:"🇼🇫",western_sahara:"🇪🇭",yemen:"🇾🇪",zambia:"🇿🇲",zimbabwe:"🇿🇼",united_nations:"🇺🇳",pirate_flag:"🏴‍☠️"};function _h(e,t){this.v=e,this.k=t}function Za(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function yh(e){if(Array.isArray(e))return e}function bh(e,t){var n=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(n!=null){var r,i,s,o,a=[],l=!0,c=!1;try{if(s=(n=n.call(e)).next,t===0){if(Object(n)!==n)return;l=!1}else for(;!(l=(r=s.call(n)).done)&&(a.push(r.value),a.length!==t);l=!0);}catch(u){c=!0,i=u}finally{try{if(!l&&n.return!=null&&(o=n.return(),Object(o)!==o))return}finally{if(c)throw i}}return a}}function wh(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Sh(e,t){return yh(e)||bh(e,t)||vh(e,t)||wh()}function vh(e,t){if(e){if(typeof e=="string")return Za(e,t);var n={}.toString.call(e).slice(8,-1);return n==="Object"&&e.constructor&&(n=e.constructor.name),n==="Map"||n==="Set"?Array.from(e):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Za(e,t):void 0}}function mi(e){var t,n;function r(s,o){try{var a=e[s](o),l=a.value,c=l instanceof _h;Promise.resolve(c?l.v:l).then(function(u){if(c){var d=s==="return"&&l.k?s:"next";if(!l.k||u.done)return r(d,u);u=e[d](u).value}i(!!a.done,u)},function(u){r("throw",u)})}catch(u){i(2,u)}}function i(s,o){s===2?t.reject(o):t.resolve({value:o,done:s}),(t=t.next)?r(t.key,t.arg):n=null}this._invoke=function(s,o){return new Promise(function(a,l){var c={key:s,arg:o,resolve:a,reject:l,next:null};n?n=n.next=c:(t=n=c,r(s,o))})},typeof e.return!="function"&&(this.return=void 0)}mi.prototype[typeof Symbol=="function"&&Symbol.asyncIterator||"@@asyncIterator"]=function(){return this},mi.prototype.next=function(e){return this._invoke("next",e)},mi.prototype.throw=function(e){return this._invoke("throw",e)},mi.prototype.return=function(e){return this._invoke("return",e)};var pl=Object.entries,Xa=Object.setPrototypeOf,kh=Object.isFrozen,xh=Object.getPrototypeOf,Eh=Object.getOwnPropertyDescriptor,dt=Object.freeze,pt=Object.seal,Jn=Object.create,ml=typeof Reflect<"u"&&Reflect,Ls=ml.apply,Cs=ml.construct;dt||(dt=function(t){return t});pt||(pt=function(t){return t});Ls||(Ls=function(t,n){for(var r=arguments.length,i=new Array(r>2?r-2:0),s=2;s<r;s++)i[s-2]=arguments[s];return t.apply(n,i)});Cs||(Cs=function(t){for(var n=arguments.length,r=new Array(n>1?n-1:0),i=1;i<n;i++)r[i-1]=arguments[i];return new t(...r)});var zn=ct(Array.prototype.forEach);Array.prototype.indexOf;var Ah=ct(Array.prototype.lastIndexOf),Ya=ct(Array.prototype.pop),Sr=ct(Array.prototype.push);Array.prototype.slice;var Th=ct(Array.prototype.splice),nr=Array.isArray,Mr=ct(String.prototype.toLowerCase),os=ct(String.prototype.toString),Qa=ct(String.prototype.match),vr=ct(String.prototype.replace),Ka=ct(String.prototype.indexOf),Mh=ct(String.prototype.trim),jh=ct(Number.prototype.toString),Ph=ct(Boolean.prototype.toString),Ja=typeof BigInt>"u"?null:ct(BigInt.prototype.toString),eo=typeof Symbol>"u"?null:ct(Symbol.prototype.toString),Tt=ct(Object.prototype.hasOwnProperty),kr=ct(Object.prototype.toString),wt=ct(RegExp.prototype.test),_n=Rh(TypeError);function ct(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var n=arguments.length,r=new Array(n>1?n-1:0),i=1;i<n;i++)r[i-1]=arguments[i];return Ls(e,t,r)}}function Rh(e){return function(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];return Cs(e,n)}}function Ue(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Mr;if(Xa&&Xa(e,null),!nr(t))return e;let r=t.length;for(;r--;){let i=t[r];if(typeof i=="string"){const s=n(i);s!==i&&(kh(t)||(t[r]=s),i=s)}e[i]=!0}return e}function Lh(e){for(let t=0;t<e.length;t++)Tt(e,t)||(e[t]=null);return e}function It(e){const t=Jn(null);for(const r of pl(e)){var n=Sh(r,2);const i=n[0],s=n[1];Tt(e,i)&&(nr(s)?t[i]=Lh(s):s&&typeof s=="object"&&s.constructor===Object?t[i]=It(s):t[i]=s)}return t}function Ch(e){switch(typeof e){case"string":return e;case"number":return jh(e);case"boolean":return Ph(e);case"bigint":return Ja?Ja(e):"0";case"symbol":return eo?eo(e):"Symbol()";case"undefined":return kr(e);case"function":case"object":{if(e===null)return kr(e);const t=e,n=Bt(t,"toString");if(typeof n=="function"){const r=n(t);return typeof r=="string"?r:kr(r)}return kr(e)}default:return kr(e)}}function Bt(e,t){for(;e!==null;){const r=Eh(e,t);if(r){if(r.get)return ct(r.get);if(typeof r.value=="function")return ct(r.value)}e=xh(e)}function n(){return null}return n}function Nh(e){try{return wt(e,""),!0}catch{return!1}}var to=dt(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),ls=dt(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),cs=dt(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),Ih=dt(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),us=dt(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),Oh=dt(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),no=dt(["#text"]),ro=dt(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","command","commandfor","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns"]),hs=dt(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dominant-baseline","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","pointer-events","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-orientation","text-rendering","textlength","type","u1","u2","unicode","values","vector-effect","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),io=dt(["accent","accentunder","align","bevelled","close","columnalign","columnlines","columnspacing","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lquote","lspace","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),_i=dt(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),zh=pt(/{{[\w\W]*|^[\w\W]*}}/g),qh=pt(/<%[\w\W]*|^[\w\W]*%>/g),$h=pt(/\${[\w\W]*/g),Dh=pt(/^data-[\-\w.\u00B7-\uFFFF]+$/),Bh=pt(/^aria-[\-\w]+$/),so=pt(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Uh=pt(/^(?:\w+script|data):/i),Wh=pt(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Fh=pt(/^html$/i),Hh=pt(/^[a-z][.\w]*(-[.\w]+)+$/i),ao=pt(/<[/\w!]/g),oo=pt(/<[/\w]/g),Gh=pt(/<\/no(script|embed|frames)/i),Vh=pt(/\/>/i),Lt={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,processingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},_l=["style","script","xmp","iframe","noembed","noframes","plaintext","noscript"],Zh=dt(Ue({},_l)),Xh=(function(){const e={};return zn(_l,t=>{e[t]=pt(new RegExp("</"+t+"(?=[\\t\\n\\f\\r />])","i"))}),dt(e)})(),Yh=function(){return typeof window>"u"?null:window},Qh=function(t,n){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let r=null;const i="data-tt-policy-suffix";n&&n.hasAttribute(i)&&(r=n.getAttribute(i));const s="dompurify"+(r?"#"+r:"");try{return t.createPolicy(s,{createHTML(o){return o},createScriptURL(o){return o}})}catch{return console.warn("TrustedTypes policy "+s+" could not be created."),null}},lo=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},yn=function(t,n,r,i){return Tt(t,n)&&nr(t[n])?Ue(i.base?It(i.base):{},t[n],i.transform):r},fs=function(t,n,r){const i=Tt(t,n)?t[n]:void 0;return i&&typeof i=="object"?It(i):r()};function yl(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Yh();const t=K=>yl(K);if(t.version="3.4.16",t.removed=[],!e||!e.document||e.document.nodeType!==Lt.document||!e.Element)return t.isSupported=!1,t;let n=e.document;const r=n,i=r.currentScript;e.DocumentFragment;const s=e.HTMLTemplateElement,o=e.Node,a=e.Element,l=e.NodeFilter;e.NamedNodeMap===void 0&&(e.NamedNodeMap||e.MozNamedAttrMap),e.HTMLFormElement;const c=e.DOMParser,u=e.trustedTypes,d=a.prototype,f=Bt(d,"cloneNode"),g=Bt(d,"remove"),m=Bt(d,"removeAttributeNode"),p=Bt(d,"nextSibling"),y=Bt(d,"childNodes"),h=Bt(d,"parentNode"),w=Bt(d,"shadowRoot"),b=Bt(d,"attributes"),S=o&&o.prototype?Bt(o.prototype,"nodeType"):null,A=o&&o.prototype?Bt(o.prototype,"nodeName"):null,z=o&&o.prototype?Bt(o.prototype,"ownerDocument"):null,U=function(v){return S?S(v):v.nodeType},W=function(v){return A?A(v):v.nodeName};if(typeof s=="function"){const K=n.createElement("template");K.content&&K.content.ownerDocument&&(n=K.content.ownerDocument)}let Y,ae="",he,ie=!1,R=0;const N=function(){if(R>0)throw _n('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.')},M=function(v){N(),R++;try{return Y.createHTML(v)}finally{R--}},T=function(v){N(),R++;try{return Y.createScriptURL(v)}finally{R--}},I=function(){return ie||(he=Qh(u,i),ie=!0),he},Q=n,q=Q.implementation,ne=Q.createNodeIterator,le=Q.createDocumentFragment,_e=Q.getElementsByTagName,fe=r.importNode;let xe=lo();t.isSupported=typeof pl=="function"&&typeof h=="function"&&q&&q.createHTMLDocument!==void 0;const $e=zh,ce=qh,De=$h,et=Dh,ot=Bh,E=Uh,L=Wh,H=Hh;let $=so,P=null;const D=Ue({},[...to,...ls,...cs,...us,...no]);let O=null;const J=Ue({},[...ro,...hs,...io,..._i]);let B=Object.seal(Jn(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),G=null,V=null;const se=Object.seal(Jn(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let me=!0,Ce=!0,Re=!1,Ie=!0,Ee=!1,He=!0,Be=!1,Wt=!1,Pn=null,Gn=null,lr=!1,ln=!1,Vn=!1,Zn=!1,cr=!0,ti=!1;const ni="user-content-";let ur=!0,Rn=!1,en={},tn=null;const ri=Ue({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","selectedcontent","style","svg","template","thead","title","video","xmp"]);let hr=null;const nn=Ue({},["audio","video","img","source","image","track"]);let x=null;const X=Ue({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),de="http://www.w3.org/1998/Math/MathML",je="http://www.w3.org/2000/svg",We="http://www.w3.org/1999/xhtml";let Ve=We,ye=!1,pe=null;const Te=Ue({},[de,je,We],os),at=dt(["mi","mo","mn","ms","mtext"]);let Je=Ue({},at);const cn=dt(["annotation-xml"]);let Ln=Ue({},cn);const fr=Ue({},["title","style","font","a","script"]);let Cn=null;const dr=["application/xhtml+xml","text/html"],Yi="text/html";let tt=null,un=null;const ii=n.createElement("form"),Nn=function(v){return v instanceof RegExp||v instanceof Function},gr=function(){let v=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(un&&un===v)return;(!v||typeof v!="object")&&(v={}),v=It(v),Cn=dr.indexOf(v.PARSER_MEDIA_TYPE)===-1?Yi:v.PARSER_MEDIA_TYPE,tt=Cn==="application/xhtml+xml"?os:Mr,P=yn(v,"ALLOWED_TAGS",D,{transform:tt}),O=yn(v,"ALLOWED_ATTR",J,{transform:tt}),pe=yn(v,"ALLOWED_NAMESPACES",Te,{transform:os}),x=yn(v,"ADD_URI_SAFE_ATTR",X,{transform:tt,base:X}),hr=yn(v,"ADD_DATA_URI_TAGS",nn,{transform:tt,base:nn}),tn=yn(v,"FORBID_CONTENTS",ri,{transform:tt}),G=yn(v,"FORBID_TAGS",It({}),{transform:tt}),V=yn(v,"FORBID_ATTR",It({}),{transform:tt}),en=Tt(v,"USE_PROFILES")?v.USE_PROFILES&&typeof v.USE_PROFILES=="object"?It(v.USE_PROFILES):v.USE_PROFILES:!1,me=v.ALLOW_ARIA_ATTR!==!1,Ce=v.ALLOW_DATA_ATTR!==!1,Re=v.ALLOW_UNKNOWN_PROTOCOLS||!1,Ie=v.ALLOW_SELF_CLOSE_IN_ATTR!==!1,Ee=v.SAFE_FOR_TEMPLATES||!1,He=v.SAFE_FOR_XML!==!1,Be=v.WHOLE_DOCUMENT||!1,ln=v.RETURN_DOM||!1,Vn=v.RETURN_DOM_FRAGMENT||!1,Zn=v.RETURN_TRUSTED_TYPE||!1,lr=v.FORCE_BODY||!1,cr=v.SANITIZE_DOM!==!1,ti=v.SANITIZE_NAMED_PROPS||!1,ur=v.KEEP_CONTENT!==!1,Rn=v.IN_PLACE||!1,$=Nh(v.ALLOWED_URI_REGEXP)?v.ALLOWED_URI_REGEXP:so,Ve=typeof v.NAMESPACE=="string"?v.NAMESPACE:We,Je=fs(v,"MATHML_TEXT_INTEGRATION_POINTS",()=>Ue({},at)),Ln=fs(v,"HTML_INTEGRATION_POINTS",()=>Ue({},cn));const j=fs(v,"CUSTOM_ELEMENT_HANDLING",()=>Jn(null));if(B=Jn(null),Tt(j,"tagNameCheck")&&Nn(j.tagNameCheck)&&(B.tagNameCheck=j.tagNameCheck),Tt(j,"attributeNameCheck")&&Nn(j.attributeNameCheck)&&(B.attributeNameCheck=j.attributeNameCheck),Tt(j,"allowCustomizedBuiltInElements")&&typeof j.allowCustomizedBuiltInElements=="boolean"&&(B.allowCustomizedBuiltInElements=j.allowCustomizedBuiltInElements),pt(B),Ee&&(Ce=!1),Vn&&(ln=!0),en&&(P=Ue({},no),O=Jn(null),en.html===!0&&(Ue(P,to),Ue(O,ro)),en.svg===!0&&(Ue(P,ls),Ue(O,hs),Ue(O,_i)),en.svgFilters===!0&&(Ue(P,cs),Ue(O,hs),Ue(O,_i)),en.mathMl===!0&&(Ue(P,us),Ue(O,io),Ue(O,_i))),se.tagCheck=null,se.attributeCheck=null,Tt(v,"ADD_TAGS")&&(typeof v.ADD_TAGS=="function"?se.tagCheck=v.ADD_TAGS:nr(v.ADD_TAGS)&&(P===D&&(P=It(P)),Ue(P,v.ADD_TAGS,tt))),Tt(v,"ADD_ATTR")&&(typeof v.ADD_ATTR=="function"?se.attributeCheck=v.ADD_ATTR:nr(v.ADD_ATTR)&&(O===J&&(O=It(O)),Ue(O,v.ADD_ATTR,tt))),Tt(v,"ADD_FORBID_CONTENTS")&&nr(v.ADD_FORBID_CONTENTS)&&(tn===ri&&(tn=It(tn)),Ue(tn,v.ADD_FORBID_CONTENTS,tt)),ur&&(P["#text"]=!0),Be&&Ue(P,["html","head","body"]),P.table&&(Ue(P,["tbody"]),delete G.tbody),v.TRUSTED_TYPES_POLICY){if(typeof v.TRUSTED_TYPES_POLICY.createHTML!="function")throw _n('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof v.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw _n('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');const Z=Y;Y=v.TRUSTED_TYPES_POLICY;try{ae=M("")}catch(C){throw Y=Z,C}}else v.TRUSTED_TYPES_POLICY===null?(Y=void 0,ae=""):(Y===void 0&&(Y=I()),Y&&typeof ae=="string"&&(ae=M("")));dt&&dt(v),un=v},si=Ue({},[...ls,...cs,...Ih]),ai=Ue({},[...us,...Oh]),Zt=function(v,j,Z){return j.namespaceURI===We?v==="svg":j.namespaceURI===de?v==="svg"&&(Z==="annotation-xml"||Je[Z]):!!si[v]},oi=function(v,j,Z){return j.namespaceURI===We?v==="math":j.namespaceURI===je?v==="math"&&Ln[Z]:!!ai[v]},li=function(v,j,Z){return j.namespaceURI===je&&!Ln[Z]||j.namespaceURI===de&&!Je[Z]?!1:!ai[v]&&(fr[v]||!si[v])},Qi=function(v){let j=h(v);(!j||!j.tagName)&&(j={namespaceURI:Ve,tagName:"template"});const Z=Mr(v.tagName),C=Mr(j.tagName);return pe[v.namespaceURI]?v.namespaceURI===je?Zt(Z,j,C):v.namespaceURI===de?oi(Z,j,C):v.namespaceURI===We?li(Z,j,C):!!(Cn==="application/xhtml+xml"&&pe[v.namespaceURI]):!1},Xt=function(v){Sr(t.removed,{element:v});try{h(v).removeChild(v)}catch{if(g(v),!h(v))throw _n("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place")}},ci=function(v,j,Z){try{m(v,j)}catch{try{v.removeAttribute(Z)}catch{}}},rn=function(v){ve(v);const j=y(v);if(j){const C=[];zn(j,F=>{Sr(C,F)}),zn(C,F=>{try{g(F)}catch{}})}const Z=b(v);if(Z)for(let C=Z.length-1;C>=0;--C){const F=Z[C],ue=F&&F.name;typeof ue=="string"&&ci(v,F,ue)}},sn=function(v,j,Z){if(!Z)try{Z=j.getAttributeNode(v)}catch{Z=null}Sr(t.removed,{attribute:Z||null,from:j});try{Z?m(j,Z):j.removeAttribute(v)}catch{try{j.removeAttribute(v)}catch{}}if(v==="is")if(ln||Vn)try{Xt(j)}catch{}else try{j.setAttribute(v,"")}catch{}},ee=function(v){const j=b(v);if(j)for(let Z=j.length-1;Z>=0;--Z){const C=j[Z],F=C&&C.name;typeof F!="string"||O[tt(F)]||ci(v,C,F)}},ve=function(v){const j=[v];for(;j.length>0;){const Z=j.pop();U(Z)===Lt.element&&ee(Z);const C=y(Z);if(C)for(let F=C.length-1;F>=0;--F)j.push(C[F])}},Ne=function(v,j){return He?v==="patchsrc"?!0:v==="for"&&j!=="label"&&j!=="output":!1},Ze=function(v){if(!He)return;const j=[v];for(;j.length>0;){const Z=j.pop(),C=U(Z);if(C===Lt.processingInstruction||C===Lt.comment&&wt(oo,Z.data)){try{g(Z)}catch{}continue}if(C===Lt.element){const ue=Z,we=tt(W(Z));try{ue.hasAttribute&&ue.hasAttribute("patchsrc")&&ue.removeAttribute("patchsrc"),ue.hasAttribute&&ue.hasAttribute("for")&&Ne("for",we)&&ue.removeAttribute("for")}catch{}}const F=y(Z);if(F)for(let ue=F.length-1;ue>=0;--ue)j.push(F[ue])}},nt=function(v){let j=null,Z=null;if(lr)v="<remove></remove>"+v;else{const ue=Qa(v,/^[\r\n\t ]+/);Z=ue&&ue[0]}Cn==="application/xhtml+xml"&&Ve===We&&(v='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+v+"</body></html>");const C=Y?M(v):v;if(Ve===We)try{j=new c().parseFromString(C,Cn)}catch{}if(!j||!j.documentElement){j=q.createDocument(Ve,"template",null);try{j.documentElement.innerHTML=ye?ae:C}catch{}}const F=j.body||j.documentElement;return v&&Z&&F.insertBefore(n.createTextNode(Z),F.childNodes[0]||null),Ve===We?_e.call(j,Be?"html":"body")[0]:Be?j.documentElement:F},Mt=function(v){const j=z?z(v):v.ownerDocument;return ne.call(j||v,v,l.SHOW_ELEMENT|l.SHOW_COMMENT|l.SHOW_TEXT|l.SHOW_PROCESSING_INSTRUCTION|l.SHOW_CDATA_SECTION,null)},At=function(v){return v=vr(v,$e," "),v=vr(v,ce," "),v=vr(v,De," "),v},jt=function(v){var j;v.normalize();const Z=z?z(v):v.ownerDocument,C=ne.call(Z||v,v,l.SHOW_TEXT|l.SHOW_COMMENT|l.SHOW_CDATA_SECTION|l.SHOW_PROCESSING_INSTRUCTION,null);let F=C.nextNode();for(;F;)F.data=At(F.data),F=C.nextNode();const ue=(j=v.querySelectorAll)===null||j===void 0?void 0:j.call(v,"template");ue&&zn(ue,we=>{Ft(we.content)&&jt(we.content)})},bt=function(v){const j=A?A(v):null;return typeof j!="string"||tt(j)!=="form"?!1:typeof v.nodeName!="string"||typeof v.textContent!="string"||typeof v.removeChild!="function"||v.attributes!==b(v)||typeof v.removeAttribute!="function"||typeof v.removeAttributeNode!="function"||typeof v.getAttributeNode!="function"||typeof v.setAttribute!="function"||typeof v.namespaceURI!="string"||typeof v.insertBefore!="function"||typeof v.hasChildNodes!="function"||v.nodeType!==S(v)||v.childNodes!==y(v)},Ft=function(v){if(!S||typeof v!="object"||v===null)return!1;try{return S(v)===Lt.documentFragment}catch{return!1}},hn=function(v){if(!S||typeof v!="object"||v===null)return!1;try{return typeof S(v)=="number"}catch{return!1}};function Pt(K,v,j){K.length!==0&&zn(K,Z=>{Z.call(t,v,j,un)})}const ui=function(v,j){return!!(He&&v.hasChildNodes()&&!hn(v.firstElementChild)&&wt(ao,v.textContent)&&wt(ao,v.innerHTML)||He&&v.namespaceURI===We&&Zh[j]&&(hn(v.firstElementChild)||typeof v.textContent=="string"&&wt(Xh[j],v.textContent))||v.nodeType===Lt.processingInstruction||He&&v.nodeType===Lt.comment&&wt(oo,v.data))},Xn=function(v,j){if(v instanceof RegExp)return wt(v,j);if(v instanceof Function){for(var Z=arguments.length,C=new Array(Z>2?Z-2:0),F=2;F<Z;F++)C[F-2]=arguments[F];return!!v(j,...C)}return!1},Ki=function(v,j,Z){if(!G[j]&&fi(j)&&Xn(B.tagNameCheck,j))return!1;if(ur&&!tn[j]){const C=h(v),F=y(v);if(F&&C){const ue=F.length;for(let we=ue-1;we>=0;--we){const Le=v===Z?f(F[we],!0):F[we];C.insertBefore(Le,p(v))}}}return Xt(v),!0},hi=function(v,j,Z,C){return v.length===0?j:j===Z||j===C?It(j):j},fn=function(v,j){return v===j||h(v)!==null?!1:(Rn&&ve(v),!0)},In=function(v,j){if(Pt(xe.beforeSanitizeElements,v,null),fn(v,j))return!0;if(bt(v))return Xt(v),!0;const Z=tt(W(v));if(P=hi(xe.uponSanitizeElement,P,D,Pn),Pt(xe.uponSanitizeElement,v,{tagName:Z,allowedTags:P}),fn(v,j))return!0;if(ui(v,Z))return Xt(v),!0;if(G[Z]||!(se.tagCheck instanceof Function&&se.tagCheck(Z))&&!P[Z]){const C=Ki(v,Z,j);return C===!1&&(Pt(xe.afterSanitizeElements,v,null),fn(v,j))?!0:C}if(U(v)===Lt.element&&!Qi(v)||(Z==="noscript"||Z==="noembed"||Z==="noframes")&&wt(Gh,v.innerHTML))return Xt(v),!0;if(Ee&&v.nodeType===Lt.text){const C=At(v.textContent);v.textContent!==C&&(Sr(t.removed,{element:v.cloneNode()}),v.textContent=C)}return Pt(xe.afterSanitizeElements,v,null),fn(v,j)},pr=function(v,j,Z){if(V[j]||Ne(j,v)||cr&&(j==="id"||j==="name")&&(Z in n||Z in ii))return!1;const C=O[j]||se.attributeCheck instanceof Function&&se.attributeCheck(j,v);return Ce&&wt(et,j)||me&&wt(ot,j)?!0:C?x[j]||wt($,vr(Z,L,""))||(j==="src"||j==="xlink:href"||j==="href")&&v!=="script"&&Ka(Z,"data:")===0&&hr[v]||Re&&!wt(E,vr(Z,L,""))?!0:!Z:fi(v)&&Xn(B.tagNameCheck,v)&&Xn(B.attributeNameCheck,j,v)||j==="is"&&B.allowCustomizedBuiltInElements&&Xn(B.tagNameCheck,Z)},Dt=Ue({},["annotation-xml","color-profile","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","missing-glyph"]),fi=function(v){return!Dt[Mr(v)]&&wt(H,v)},mr=function(v,j,Z,C){if(Y&&typeof u=="object"&&typeof u.getAttributeType=="function"&&!Z)switch(u.getAttributeType(v,j)){case"TrustedHTML":return M(C);case"TrustedScriptURL":return T(C)}return C},Me=function(v,j,Z,C){try{return Z?v.setAttributeNS(Z,j,C):v.setAttribute(j,C),bt(v)?(Xt(v),!1):!0}catch{return sn(j,v),!1}},_r=function(v,j){if(Pt(xe.beforeSanitizeAttributes,v,null),fn(v,j))return;const Z=v.attributes;if(!Z||bt(v))return;O=hi(xe.uponSanitizeAttribute,O,J,Gn);const C={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:O,forceKeepAttr:void 0};let F=Z.length;const ue=tt(v.nodeName);for(;F--;){const we=Z[F],Le=we.name,it=we.namespaceURI,kt=we.value,dn=tt(Le),Ji=kt;let xt=Le==="value"?Ji:Mh(Ji),ha=!1;if(C.attrName=dn,C.attrValue=xt,C.keepAttr=!0,C.forceKeepAttr=void 0,Pt(xe.uponSanitizeAttribute,v,C),xt=C.attrValue,ti&&(dn==="id"||dn==="name")&&Ka(xt,ni)!==0&&(sn(Le,v,we),xt=ni+xt,ha=!0),He&&wt(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,xt)){sn(Le,v,we);continue}if(dn==="attributename"&&Qa(xt,"href")){sn(Le,v,we);continue}if(!C.forceKeepAttr){if(!C.keepAttr){sn(Le,v,we);continue}if(!Ie&&wt(Vh,xt)){sn(Le,v,we);continue}if(Ee&&(xt=At(xt)),!pr(ue,dn,xt)){sn(Le,v,we);continue}xt=mr(ue,dn,it,xt),xt!==Ji&&Me(v,Le,it,xt)&&ha&&Ya(t.removed)}}Pt(xe.afterSanitizeAttributes,v,null),fn(v,j)},rt=function(v){let j=null;const Z=Mt(v);for(Pt(xe.beforeSanitizeShadowDOM,v,null);j=Z.nextNode();)if(Pt(xe.uponSanitizeShadowNode,j,null),In(j,v),_r(j,v),Ft(j.content)&&rt(j.content),U(j)===Lt.element){const C=w(j);Ft(C)&&(Ge(C),rt(C))}Pt(xe.afterSanitizeShadowDOM,v,null)},Ge=function(v){const j=[{node:v,shadow:null}];for(;j.length>0;){const Z=j.pop();if(Z.shadow){rt(Z.shadow);continue}const C=Z.node,F=U(C)===Lt.element,ue=y(C);if(ue)for(let we=ue.length-1;we>=0;--we)j.push({node:ue[we],shadow:null});if(F){const we=A?A(C):null;if(typeof we=="string"&&tt(we)==="template"){const Le=C.content;Ft(Le)&&j.push({node:Le,shadow:null})}}if(F){const we=w(C);Ft(we)&&j.push({node:null,shadow:we},{node:we,shadow:null})}}};return t.sanitize=function(K){let v=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},j=null,Z=null,C=null,F=null;if(ye=!K,ye&&(K="<!-->"),typeof K!="string"&&!hn(K)&&(K=Ch(K),typeof K!="string"))throw _n("dirty is not a string, aborting");if(!t.isSupported)return K;Wt?(P=Pn,O=Gn):gr(v),(xe.uponSanitizeElement.length>0||xe.uponSanitizeAttribute.length>0)&&(P=It(P)),xe.uponSanitizeAttribute.length>0&&(O=It(O)),t.removed=[];const ue=Rn&&typeof K!="string"&&hn(K);if(ue){Ze(K);const it=W(K);if(typeof it=="string"){const kt=tt(it);if(!P[kt]||G[kt])throw rn(K),_n("root node is forbidden and cannot be sanitized in-place")}if(bt(K))throw rn(K),_n("root node is clobbered and cannot be sanitized in-place");try{Ge(K)}catch(kt){throw rn(K),kt}}else if(hn(K))j=nt("<!---->"),Z=j.ownerDocument.importNode(K,!0),Z.nodeType===Lt.element&&Z.nodeName==="BODY"||Z.nodeName==="HTML"?j=Z:j.appendChild(Z),Ge(j);else{if(!ln&&!Ee&&!Be&&K.indexOf("<")===-1)return Y&&Zn?M(K):K;if(j=nt(K),!j)return ln?null:Zn?ae:""}j&&lr&&Xt(j.firstChild);const we=ue?K:j;try{const it=Mt(we);for(;C=it.nextNode();)In(C,we),_r(C,we),Ft(C.content)&&rt(C.content)}catch(it){throw ue&&(rn(K),zn(t.removed,kt=>{kt.element&&ve(kt.element)})),it}if(ue){let it=!1;if(zn(t.removed,kt=>{kt.element&&(kt.element===K&&(it=!0),ve(kt.element))}),it)throw _n("a node selected for removal could not be safely returned; refusing to sanitize in place");return Ee&&jt(K),K}if(ln){if(Ee&&jt(j),Vn)for(F=le.call(j.ownerDocument);j.firstChild;)F.appendChild(j.firstChild);else F=j;return(O.shadowroot||O.shadowrootmode)&&(F=fe.call(r,F,!0)),F}let Le=Be?j.outerHTML:j.innerHTML;return Be&&P["!doctype"]&&j.ownerDocument&&j.ownerDocument.doctype&&j.ownerDocument.doctype.name&&wt(Fh,j.ownerDocument.doctype.name)&&(Le="<!DOCTYPE "+j.ownerDocument.doctype.name+`>
`+Le),Ee&&(Le=At(Le)),Y&&Zn?M(Le):Le},t.setConfig=function(){let K=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};gr(K),Wt=!0,Pn=P,Gn=O},t.clearConfig=function(){un=null,Wt=!1,Pn=null,Gn=null,Y=he,ae=""},t.isValidAttribute=function(K,v,j){un||gr({});const Z=tt(K),C=tt(v);return pr(Z,C,j)},t.addHook=function(K,v){typeof v=="function"&&Tt(xe,K)&&Sr(xe[K],v)},t.removeHook=function(K,v){if(Tt(xe,K)){if(v!==void 0){const j=Ah(xe[K],v);return j===-1?void 0:Th(xe[K],j,1)[0]}return Ya(xe[K])}},t.removeHooks=function(K){Tt(xe,K)&&(xe[K]=[])},t.removeAllHooks=function(){xe=lo()},t}var ds=yl(),Kh=_.__exportAll({_sendToRenderer:()=>wl,_slugifyLocal:()=>Is,_splitIntoSections:()=>Sl,addMarkdownExtension:()=>Ns,detectFenceLanguages:()=>Ui,detectFenceLanguagesAsync:()=>zs,initRendererWorker:()=>Zi,markdownPlugins:()=>Tn,parseMarkdownToHtml:()=>sr,setMarkdownExtensions:()=>rf,slugify:()=>Se,streamParseMarkdown:()=>Os,teardownRendererWorkerPool:()=>nf}),Jh=Ao(),ef={intervalMs:500,targetMs:75,hysteresis:.25,cooldownMs:500,stepUp:1,stepDown:1},Or=null;function tf(){const e={size:Jh,minSize:2,autoScale:ef,messageCodec:"legacy",maxQueueLength:100};try{typeof{}<"u"&&(e.debugLevel=0)}catch{}try{return new Ys(mh,e)}catch{return{workers:[],postMessage:async()=>{throw new Error("renderer worker unavailable")}}}}function bl(){return Or||(Or=tf()),Or}function nf(){const e=Or;if(Or=null,!!e)try{typeof e.drain=="function"&&e.drain().catch(()=>{}),typeof e.terminate=="function"&&e.terminate(),typeof e.dispose=="function"&&e.dispose()}catch(t){k("[markdown] teardownRendererWorkerPool failed",t)}}var Zi=()=>bl().workers?.[0]?.worker?._underlying??null,wl=(e,t=3e3)=>Zi?.()?bl().postMessage(e,void 0,{awaitResponse:!0,timeout:t}).then(n=>{if(n?.error)throw new Error(n.error);return n}).catch(n=>{throw(n?.message||"").includes("postMessage response timeout")?new Error("worker timeout"):n}):Promise.reject(new Error("renderer worker unavailable")),Tn=[];function Ns(e){if(e&&(typeof e=="object"||typeof e=="function")){Tn.push(e);try{ze.use(e)}catch(t){k("[markdown] failed to apply plugin",t)}}}function rf(e){Tn.length=0,Array.isArray(e)&&Tn.push(...e.filter(t=>t&&typeof t=="object"));try{Tn.forEach(t=>ze.use(t))}catch(t){k("[markdown] failed to apply markdown extensions",t)}}function Is(e){return Se(e)}function Sl(e,t){const n=String(e??"");if(!n||n.length<=t)return[n];const r=/^#{1,6}\s.*$/gm,i=[];let s;for(;(s=r.exec(n))!==null;)i.push(s.index);if(!i.length||i.length<2){const c=[];for(let u=0;u<n.length;u+=t)c.push(n.slice(u,u+t));return c}const o=[];i[0]>0&&o.push(n.slice(0,i[0]));for(let c=0;c<i.length;c++){const u=i[c],d=c+1<i.length?i[c+1]:n.length;o.push(n.slice(u,d))}const a=[];let l="";for(const c of o){if(!l&&c.length>=t){a.push(c);continue}l.length+c.length<=t?l+=c:(l&&a.push(l),l=c)}return l&&a.push(l),a}async function Os(e,t,n={}){const r=n?.chunkSize?Number(n.chunkSize):65536,i=typeof t=="function"?t:()=>{},{content:s,data:o}=tr(String(e??""));let a=s;try{a=String(a??"").replace(/:([^:\s]+):/g,(d,f)=>Tr[f]||d)}catch{}Zi?.();const l=Sl(a,r),c=st(),u=new Map;for(let d=0;d<l.length;d++){const f=l[d],g=await sr(f);let m=String(g?.html||""),p=[];if(c)try{const h=c.parseFromString(m,"text/html");h.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(w=>{try{const b=Number(w.tagName.substring(1)),S=(w.textContent||"").trim(),A=Is(S),z=(u.get(A)||0)+1;u.set(A,z);const U=z===1?A:A+"-"+z;w.id=U,p.push({level:b,text:S,id:U})}catch{}});try{typeof XMLSerializer<"u"?m=new XMLSerializer().serializeToString(h.body).replace(/^<body[^>]*>/i,"").replace(/<\/body>$/i,""):m=Array.from(h.body.childNodes||[]).map(w=>typeof w?.outerHTML=="string"?w.outerHTML:typeof w?.textContent=="string"?w.textContent:"").join("")}catch{}}catch{}else try{const h=[];m=m.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(w,b,S,A)=>{const z=Number(b),U=A.replace(/<[^>]+>/g,"").trim(),W=Is(U),Y=(u.get(W)||0)+1;u.set(W,Y);const ae=Y===1?W:W+"-"+Y;return h.push({level:z,text:U,id:ae}),`<h${z} ${(S||"").replace(/\s*(id|class)="[^"]*"/g,"")} id="${ae}">${A}</h${z}>`}),p=h}catch{}const y={index:d,isLast:d===l.length-1,meta:d===0?o||{}:{},toc:p};try{i(m,y)}catch{}}}async function sr(e){if(Tn?.length){let{content:r,data:i}=tr(e||"");try{r=String(r??"").replace(/:([^:\s]+):/g,(o,a)=>Tr[a]||o)}catch{}ze.setOptions({gfm:!0});try{Tn.forEach(o=>ze.use(o))}catch(o){k("[markdown] apply plugins failed",o)}const s=ds.sanitize(ze.parse(r));try{const o=st();if(o){const a=o.parseFromString(s,"text/html"),l=a.querySelectorAll("h1,h2,h3,h4,h5,h6"),c=[],u=new Set,d=f=>{const g={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},m=f<=2?"has-text-weight-bold":f<=4?"has-text-weight-semibold":"has-text-weight-normal";return(g[f]+" "+m).trim()};l.forEach(f=>{try{const g=Number(f.tagName.substring(1)),m=(f.textContent||"").trim();let p=Se(m)||"heading",y=p,h=2;for(;u.has(y);)y=p+"-"+h,h+=1;u.add(y),f.id=y,f.className=d(g),c.push({level:g,text:m,id:y})}catch{}});try{(typeof a?.getElementsByTagName=="function"?Array.from(a.getElementsByTagName("img")):typeof a?.querySelectorAll=="function"?Array.from(a.querySelectorAll("img")):[]).forEach(f=>{try{const g=f.getAttribute?.("loading"),m=f.getAttribute?.("data-want-lazy");!g&&!m&&f.setAttribute?.("loading","lazy");try{const p=f.getAttribute?.("alt");if(!p||!String(p).trim()){const y=f.getAttribute?.("src")||"";if(y){const h=String(y).split("/").pop().replace(/\.[^.]+$/,"");h&&f.setAttribute("alt",h.replace(/[-_]+/g," "))}}}catch{}}catch{}})}catch{}try{a.querySelectorAll("pre code, code[class]").forEach(f=>{try{const g=f.getAttribute?.("class")||f.className||"",m=String(g??"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(m)try{f.setAttribute?.("class",m)}catch{f.className=m}else try{f.removeAttribute?.("class")}catch{f.className=""}}catch{}})}catch{}try{let f=null;try{typeof XMLSerializer<"u"?f=new XMLSerializer().serializeToString(a.body).replace(/^<body[^>]*>/i,"").replace(/<\/body>$/i,""):f=Array.from(a.body.childNodes||[]).map(g=>typeof g?.outerHTML=="string"?g.outerHTML:typeof g?.textContent=="string"?g.textContent:"").join("")}catch{try{f=a.body.innerHTML}catch{f=""}}return{html:f,meta:i||{},toc:c}}catch{return{html:"",meta:i||{},toc:c}}}}catch{}return{html:s,meta:i||{},toc:[]}}try{e=String(e??"").replace(/:([^:\s]+):/g,(r,i)=>Tr[i]||r)}catch{}let t;t=Zi?.();try{if(Ye?.getLanguage?.("plaintext")&&/```\s*\n/.test(String(e??""))){let{content:r,data:i}=tr(e||"");try{r=String(r??"").replace(/:([^:\s]+):/g,(l,c)=>Tr[c]||l)}catch{}ze.setOptions({gfm:!0,highlighted:(l,c)=>{try{return c&&Ye?.getLanguage?.(c)?Ye.highlight(l,{language:c}).value:Ye?.getLanguage?.("plaintext")?Ye.highlight(l,{language:"plaintext"}).value:l}catch{return l}}});let s=ds.sanitize(ze.parse(r));try{s=s.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g,(l,c)=>{try{if(c&&typeof Ye?.highlight=="function")try{const u=Ye.highlight(c,{language:"plaintext"});return`<pre><code>${u?.value?u.value:u}</code></pre>`}catch{try{if(typeof Ye?.highlightElement=="function"){const d={innerHTML:c};return Ye.highlightElement(d),`<pre><code>${d.innerHTML}</code></pre>`}}catch{}}}catch{}return l})}catch{}const o=[],a=new Set;return s=s.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(l,c,u,d)=>{const f=Number(c),g=d.replace(/<[^>]+>/g,"").trim();let m=Se(g)||"heading",p=m,y=2;for(;a.has(p);)p=m+"-"+y,y+=1;a.add(p),o.push({level:f,text:g,id:p});const h={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},w=f<=2?"has-text-weight-bold":f<=4?"has-text-weight-semibold":"has-text-weight-normal",b=(h[f]+" "+w).trim();return`<h${f} ${((u||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${p}" class="${b}"`).trim()}>${d}</h${f}>`}),s=s.replace(/<img([^>]*)>/g,(l,c)=>/\bloading=/.test(c)?`<img${c}>`:/\bdata-want-lazy=/.test(c)?`<img${c}>`:`<img${c} loading="lazy">`),{html:s,meta:i||{},toc:o}}}catch{}if(!t)try{let{content:r,data:i}=tr(e||"");try{r=String(r??"").replace(/:([^:\s]+):/g,(s,o)=>Tr[o]||s)}catch{}return ze.setOptions({gfm:!0,highlighted:(s,o)=>{try{return o&&Ye?.getLanguage?.(o)?Ye.highlight(s,{language:o}).value:Ye?.getLanguage?.("plaintext")?Ye.highlight(s,{language:"plaintext"}).value:s}catch{return s}}}),{html:ds.sanitize(ze.parse(r)),meta:i||{}}}catch{throw new Error("renderer worker required but unavailable")}const n=await wl({type:"render",md:e});if(!n||typeof n!="object"||n.html===void 0)throw new Error("renderer worker returned invalid response");try{const r=new Map,i=[],s=a=>{const l={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},c=a<=2?"has-text-weight-bold":a<=4?"has-text-weight-semibold":"has-text-weight-normal";return(l[a]+" "+c).trim()};let o=n.html;o=o.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(a,l,c,u)=>{const d=Number(l),f=u.replace(/<[^>]+>/g,"").trim(),g=(c||"").match(/\sid="([^"]+)"/),m=g?g[1]:Se(f)||"heading",p=(r.get(m)||0)+1;r.set(m,p);const y=p===1?m:m+"-"+p;i.push({level:d,text:f,id:y});const h=s(d);return`<h${d} ${((c||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${y}" class="${h}"`).trim()}>${u}</h${d}>`});try{const a=typeof document<"u"&&document.documentElement?.getAttribute?.("data-nimbi-logo-moved")||"";if(a){const l=st();if(l){const c=l.parseFromString(o,"text/html");(typeof c?.getElementsByTagName=="function"?Array.from(c.getElementsByTagName("img")):typeof c?.querySelectorAll=="function"?Array.from(c.querySelectorAll("img")):[]).forEach(u=>{try{const d=u?.getAttribute?.("src")||"";(d?new URL(d,location.href).toString():"")===a&&u.remove()}catch{}});try{typeof XMLSerializer<"u"?o=new XMLSerializer().serializeToString(c.body).replace(/^<body[^>]*>/i,"").replace(/<\/body>$/i,""):o=Array.from(c.body.childNodes||[]).map(u=>typeof u?.outerHTML=="string"?u.outerHTML:typeof u?.textContent=="string"?u.textContent:"").join("")}catch{try{o=c.body.innerHTML}catch{}}}else try{const c=a.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");o=o.replace(new RegExp(`<img[^>]*src=\\"${c}\\"[^>]*>`,"g"),"")}catch{}}}catch{}return{html:o,meta:n.meta||{},toc:i}}catch{return{html:n.html,meta:n.meta||{},toc:n.toc||[]}}}function Ui(e,t){const n=new Set,r=/```\s*([a-zA-Z0-9_\-+]+)?/g,i=new Set(["then","now","if","once","so","and","or","but","when","the","a","an","as","let","const","var","export","import","from","true","false","null","npm","run","echo","sudo","this","that","have","using","some","return","returns","function","console","log","error","warn","class","new","undefined","with","select","from","where","join","on","group","order","by","having","as","into","values","like","limit","offset","create","table","index","view","insert","update","delete","returning","and","or","not","all","any","exists","case","when","then","else","end","distance","geometry","you","which","would","why","cool","other","same","everything","check"]),s=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);let o;for(;o=r.exec(e);)if(o[1]){const a=o[1].toLowerCase();if(Hs.has(a)||t?.size&&a.length<3&&!t.has(a)&&!t.has(Jt?.[a]))continue;if(t?.size){if(t.has(a)){const l=t.get(a);l&&n.add(l);continue}if(Jt?.[a]){const l=Jt[a];if(t.has(l)){const c=t.get(l)||l;n.add(c);continue}}}(s.has(a)||a.length>=5&&a.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(a)&&!i.has(a))&&n.add(a)}return n}async function zs(e,t){return Tn?.length,Ui(e||"",t)}function sf(e,t=150,n={}){let r=null;const i=!!n.leading;return function(...o){const a=this;if(r&&clearTimeout(r),i&&!r)try{e.apply(a,o)}catch{}r=setTimeout(()=>{if(r=null,!i)try{e.apply(a,o)}catch{}},t)}}function af(e){let t=!1,n=null,r=null;return function(...s){if(n=s,r=this,t)return;t=!0;try{e.apply(this,s)}catch{}n=null,r=null;const o=()=>{if(t=!1,!n)return;const a=n,l=r;n=null,r=null,t=!0;try{e.apply(l,a)}catch{}typeof requestAnimationFrame=="function"?requestAnimationFrame(o):setTimeout(o,16)};typeof requestAnimationFrame=="function"?requestAnimationFrame(o):setTimeout(o,16)}}function of(){let e=[],t=!1;return function(r){typeof r=="function"&&(e.push(r),!t&&(t=!0,typeof requestAnimationFrame=="function"?requestAnimationFrame(()=>{t=!1;const i=e.slice(0);e.length=0;for(const s of i)try{s()}catch{}}):setTimeout(()=>{t=!1;const i=e.slice(0);e.length=0;for(const s of i)try{s()}catch{}},0)))}}var Ti=of(),vl=`let M = typeof DOMParser < "u" ? new DOMParser() : null;
function H() {
	return M || (typeof DOMParser < "u" ? (M = new DOMParser(), M) : null);
}
function b(t) {
	return String(t ?? "").replace(/^[./]+/, "");
}
function I(t) {
	return String(t ?? "").replace(/\\/+$/, "");
}
function k(t) {
	return I(t) + "/";
}
function F(t) {
	const n = String(t ?? "");
	return /^(https?:)?\\/\\//.test(n) || n.startsWith("mailto:") || n.startsWith("tel:");
}
function _(t, n = null) {
	const e = encodeURIComponent(String(t ?? ""));
	return n ? \`?page=\${e}#\${encodeURIComponent(String(n))}\` : \`?page=\${e}\`;
}
function B(t) {
	return String(t ?? "").toLowerCase().trim().replace(/[^a-z0-9\\-\\s]+/g, "").replace(/\\s+/g, "-");
}
function $(t, n) {
	try {
		if (!t) return t;
		const e = String(n ?? "").replace(/^\\/+|\\/+$/g, "");
		if (!e) return String(t ?? "");
		let i = String(t ?? "").replace(/^\\/+/, "");
		const s = e + "/";
		for (; i.startsWith(s);) i = i.slice(s.length);
		return i === e ? "" : i;
	} catch {
		return String(t ?? "");
	}
}
function N() {
	if (typeof DOMParser > "u") return null;
	const t = H();
	try {
		if (t?.constructor === DOMParser) return t;
	} catch {}
	return new DOMParser();
}
function S(t) {
	return String(t ?? "").replace(/^.*\\//, "");
}
function q(t) {
	const n = /* @__PURE__ */ new Map();
	try {
		if (!t || typeof t != "object") return n;
		for (const [e, i] of Object.entries(t || {})) try {
			if (!e || !i) continue;
			n.set(String(i), String(e));
		} catch {}
	} catch {}
	return n;
}
function z(t, n) {
	try {
		const e = String(t ?? "");
		return e ? e.includes("/") || /\\.(?:md|html?)$/i.test(e) ? e : q(n?.pathToSlug).get(e) || t : t;
	} catch {
		return t;
	}
}
function J(t, n = 2) {
	try {
		const e = String(t ?? "").split("/").filter(Boolean);
		return e.length ? e.slice(-Math.max(1, Math.min(n, e.length))).join("/") : "";
	} catch {
		return String(t ?? "");
	}
}
function V(t, n) {
	if (!t || !n) return null;
	try {
		if (n.has(t)) return n.get(t);
	} catch {}
	const e = S(t);
	try {
		if (e && n.has(e)) return n.get(e);
	} catch {}
	const i = J(t, 2);
	try {
		for (const [s, c] of n.entries()) if (!(!s || !c) && (s === t || s === e || String(s).endsWith(\`/\${i}\`))) return c;
	} catch {}
	return null;
}
function G(t) {
	return new Map(Object.entries(t?.pathToSlug || {}));
}
function y(t, n, e, i) {
	const s = String(e ?? ""), c = String(i ?? "");
	!s || !c || t.has(s) || (t.set(s, c), n.push({
		path: s,
		slug: c
	}));
}
async function v(t, n) {
	const e = new URL(String(t ?? ""), String(n || (typeof location < "u" ? location.href : "http://localhost/"))), i = await fetch(e.toString());
	return !i || !i.ok ? null : await i.text();
}
function E(t, n) {
	if (!t) return null;
	if (!n) {
		const e = String(t).match(/^#\\s+(.+)$/m);
		return e?.[1] ? B(e[1].trim()) : null;
	}
	try {
		const e = N();
		if (!e) return null;
		const i = e.parseFromString(String(t), "text/html"), s = i.querySelector("title")?.textContent?.trim(), c = i.querySelector("h1")?.textContent?.trim();
		return B(s || c || "") || null;
	} catch {
		return null;
	}
}
async function L(t, n, e) {
	const i = Array.from(t || []);
	if (!i.length) return;
	const s = Math.max(1, Number(n) || 1);
	let c = 0;
	const u = Array.from({ length: Math.min(s, i.length) }, async () => {
		for (; c < i.length;) {
			const a = i[c];
			c += 1, await e(a);
		}
	});
	await Promise.all(u);
}
async function K(t, n, e, i = {}) {
	const s = N();
	if (!s) return {
		html: String(t ?? ""),
		mappings: []
	};
	const c = s.parseFromString(String(t ?? ""), "text/html"), u = c.body.querySelectorAll("a");
	if (!u || !u.length) return {
		html: c.body.innerHTML,
		mappings: []
	};
	let a = "/";
	try {
		a = k(new URL(String(n ?? ""), typeof location < "u" ? location.href : "http://localhost/").pathname);
	} catch {}
	e = z(e, i);
	const f = G(i), h = [], O = /* @__PURE__ */ new Set(), U = /* @__PURE__ */ new Set(), W = [], T = [], C = String(i?.homeSlug || "_home");
	for (const o of Array.from(u)) try {
		try {
			if (o?.closest?.("h1,h2,h3,h4,h5,h6")) continue;
		} catch {}
		const r = o.getAttribute("href") || "";
		if (!r || F(r)) continue;
		try {
			if ((r.startsWith("?") || r.includes("?")) && e) {
				const l = new URL(r, String(n || (typeof location < "u" ? location.href : "http://localhost/"))), g = l.searchParams.get("page");
				if (g && !g.includes("/")) {
					const A = e.includes("/") ? e.slice(0, e.lastIndexOf("/") + 1) : "";
					if (A) {
						const w = b(A + g);
						o.setAttribute("href", _(w, l.hash ? l.hash.replace(/^#/, "") : null));
						continue;
					}
				}
			}
		} catch {}
		if (r.startsWith("/") && !r.endsWith(".md")) continue;
		const R = r.match(/^([^#?]+\\.md)(?:#(.+))?$/);
		if (R) {
			let l = R[1];
			const g = R[2];
			!l.startsWith("/") && e && (l = (e.includes("/") ? e.slice(0, e.lastIndexOf("/") + 1) : "") + l);
			const A = new URL(l, String(n || (typeof location < "u" ? location.href : "http://localhost/"))).pathname;
			let w = A.startsWith(a) ? A.slice(a.length) : A;
			w = b($(w, a)), W.push({
				node: o,
				rel: w,
				frag: g
			}), f.has(w) || O.add(w);
			continue;
		}
		let D = r;
		!r.startsWith("/") && e && (r.startsWith("#") ? D = e + r : D = (e.includes("/") ? e.slice(0, e.lastIndexOf("/") + 1) : "") + r);
		const x = new URL(D, String(n || (typeof location < "u" ? location.href : "http://localhost/"))).pathname || "";
		if (!x || !x.includes(a)) continue;
		let d = x.startsWith(a) ? x.slice(a.length) : x;
		if (d = b($(d, a)), d = I(d), d || (d = C), !d.endsWith(".md")) {
			const l = V(d, f);
			if (l) o.setAttribute("href", _(l));
			else {
				const g = /\\.[^/]+$/.test(d) ? d : \`\${d}.html\`;
				U.add(g), T.push({
					node: o,
					rel: g,
					fallbackRel: d
				});
			}
		}
	} catch {}
	if (i?.allowProbe) await L(O, 6, async (o) => {
		try {
			const r = E(await v(o, n), !1);
			if (!r) return;
			y(f, h, o, r), y(f, h, S(o), r);
		} catch {}
	}), await L(U, 5, async (o) => {
		try {
			const r = E(await v(o, n), !0);
			if (!r) return;
			y(f, h, o, r), y(f, h, S(o), r);
		} catch {}
	});
	else {
		for (const o of O) {
			const r = B(S(o).replace(/\\.md$/i, ""));
			r && (y(f, h, o, r), y(f, h, S(o), r));
		}
		for (const o of U) {
			const r = B(S(o).replace(/\\.html$/i, ""));
			r && (y(f, h, o, r), y(f, h, S(o), r));
		}
	}
	for (const o of W) {
		const r = f.get(o.rel);
		o.node.setAttribute("href", _(r || o.rel, o.frag || null));
	}
	for (const o of T) {
		const r = f.get(o.rel) || f.get(S(o.rel)) || f.get(o.fallbackRel);
		o.node.setAttribute("href", _(r || o.rel));
	}
	return {
		html: c.body.innerHTML,
		mappings: h
	};
}
let p, m;
function Q() {
	return p !== void 0 ? p === !1 ? null : p : typeof TextEncoder < "u" ? (p = new TextEncoder(), p) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (p = { encode: (t) => new Uint8Array(Buffer.from(t)) }, p) : (p = !1, null);
}
function X() {
	return m !== void 0 ? m === !1 ? null : m : typeof TextDecoder < "u" ? (m = new TextDecoder(), m) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (m = { decode: (t) => Buffer.from(t).toString("utf8") }, m) : (m = !1, null);
}
const P = (t, n) => {
	if (t instanceof Uint8Array) return t;
	if (ArrayBuffer.isView(t)) return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
	if (t instanceof ArrayBuffer) return new Uint8Array(t);
	const e = n ?? JSON.stringify(t), i = Q();
	if (typeof i?.encode == "function") return i.encode(e);
	throw new Error("No TextEncoder or Buffer available to encode object");
}, Y = (t) => {
	let n;
	if (t instanceof Uint8Array) n = t;
	else if (ArrayBuffer.isView(t)) n = new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
	else if (t instanceof ArrayBuffer) n = new Uint8Array(t);
	else if (typeof Buffer < "u" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(t)) n = new Uint8Array(t);
	else throw new TypeError("Unsupported input to u82o, expected ArrayBuffer/TypedArray/Buffer");
	const e = X();
	if (typeof e?.decode == "function") return JSON.parse(e.decode(n));
	if (typeof TextDecoder < "u") return JSON.parse(new TextDecoder().decode(n));
	throw new Error("No TextDecoder or Buffer available to decode object");
};
onmessage = async (t) => {
	let n;
	try {
		n = Y(t.data);
	} catch {}
	n = n || t.data || {};
	const { correlationId: e } = n, i = (c) => {
		if (e != null) {
			const u = P({
				correlationId: e,
				response: c
			});
			postMessage(u, [u.buffer]);
		} else postMessage({
			id: n.id,
			result: c
		});
	}, s = (c) => {
		if (e != null) {
			const u = P({
				correlationId: e,
				response: { error: String(c) }
			});
			postMessage(u, [u.buffer]);
		} else postMessage({
			id: n.id,
			error: String(c)
		});
	};
	try {
		if (n.type === "rewriteAnchors") {
			const { html: c, contentBase: u, pagePath: a, snapshot: f } = n;
			try {
				i(await K(c, u, a, f));
			} catch (h) {
				s(h);
			}
			return;
		}
	} catch (c) {
		s(c);
	}
};
`,co=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",vl],{type:"text/javascript;charset=utf-8"});function lf(e){let t;try{if(t=co&&(self.URL||self.webkitURL).createObjectURL(co),!t)throw"";const n=new Worker(t,{type:"module",name:e?.name});return n.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(t)}),n}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(vl),{type:"module",name:e?.name})}}function Ot(e,t=null){try{const n=typeof location<"u"&&location&&typeof location.pathname=="string"&&location.pathname||"/";return String(n)+Ea(e,t)}catch{return Ea(e,t)}}async function qs(e,t,n=4,r){if(!Array.isArray(e)||e.length===0)return[];const i=new Co(Math.max(1,Number(n)||1));return Promise.all(e.map((s,o)=>i.run(()=>t(s,o),{signal:r})))}function cf(...e){try{k(...e)}catch{}}function Fr(e){try{if(So(3))return!0}catch{}try{if(typeof ke=="string"&&ke)return!0}catch{}try{if(te?.size)return!0}catch{}try{if(Qe?.size)return!0}catch{}return!1}function uf(e,t){try{return new URL(e,t).pathname}catch{try{return new URL(e,typeof location<"u"?location.href:"http://localhost/").pathname}catch{try{return(String(t??"").replace(/\/$/,"")+"/"+String(e??"").replace(/^\//,"")).replace(/\/\\+/g,"/")}catch{return String(e??"")}}}}function Hr(e){try{const t=String(e??"");if(!t)return e;if(t.includes("/")||/\.(?:md|html?)$/i.test(t))return t;if(te?.has?.(t)){const n=te.get(t);if(typeof n=="string")return n;if(n&&typeof n=="object")return n.default||t}}catch{}return e}function kl(e,t=2){try{const n=String(e??"").split("/").filter(Boolean);return n.length?n.slice(-Math.max(1,Math.min(t,n.length))).join("/"):""}catch{return String(e??"")}}function xl(){try{if(typeof window>"u")return null;let e=null;if(Array.isArray(window.__nimbiResolvedIndex)?e=window.__nimbiResolvedIndex:Array.isArray(window.__nimbiSitemapFinal)?e=window.__nimbiSitemapFinal:window.__nimbiSitemapJson&&Array.isArray(window.__nimbiSitemapJson.entries)&&(e=window.__nimbiSitemapJson.entries),!Array.isArray(e))return null;const t=new Map;for(const n of e)try{if(!n||typeof n!="object")continue;let r=null;if(typeof n.path=="string")r=n.path;else if(typeof n.sourcePath=="string")r=n.sourcePath;else if(typeof n.loc=="string")try{const o=new URL(n.loc,location.href);r=String(o.pathname).replace(/^\//,"")}catch{r=n.loc}const i=typeof n.slug=="string"?n.slug:null;if(!r||!i)continue;t.has(r)||t.set(r,i);const s=String(r).replace(/^.*\//,"");s&&!t.has(s)&&t.set(s,i)}catch{continue}return t}catch{return null}}function gs(e){if(!e)return null;try{if(be?.has?.(e))return be.get(e)}catch{}const t=String(e??"").replace(/^.*\//,"");try{if(t&&be?.has?.(t))return be.get(t)}catch{}const n=xl();try{if(n?.has?.(e))return n.get(e);if(t&&n?.has?.(t))return n.get(t)}catch{}const r=kl(e,2);try{for(const[i,s]of te||[]){let o=null;if(typeof s=="string"?o=s:s&&typeof s=="object"&&(o=s.default||""),!!o&&(o===e||o===t||o.endsWith(`/${r}`)))return i}if(n){for(const[i,s]of n.entries())if(i===e||i===t||String(i).endsWith(`/${r}`))return s}}catch{}return null}function Gr(e,t){try{if(!e)return e;if(!t)return String(e??"");const n=String(t??"").replace(/^\/+|\/+$/g,"");if(!n)return String(e??"");let r=String(e??"");r=r.replace(/^\/+/,"");const i=n+"/";for(;r.startsWith(i);)r=r.slice(i.length);return r===n?"":r}catch{return String(e??"")}}function hf(e,t){const n=document.createElement("aside");n.className="menu box nimbi-nav",n.setAttribute("role","navigation");try{n.setAttribute("aria-label",e("navigation"))}catch{}const r=document.createElement("p");r.className="menu-label",r.textContent=e("navigation"),n.appendChild(r);const i=document.createElement("ul");i.className="menu-list";try{const s=document.createDocumentFragment();t.forEach(o=>{const a=document.createElement("li"),l=document.createElement("a");try{const c=String(o.path??"");try{l.setAttribute("href",Fe(c))}catch{c?.indexOf("/")===-1?l.setAttribute("href","#"+encodeURIComponent(c)):l.setAttribute("href",Ot(c))}}catch{l.setAttribute("href","#"+o.path)}if(l.textContent=o.name,a.appendChild(l),o.children?.length){const c=document.createElement("ul");o.children.forEach(u=>{const d=document.createElement("li"),f=document.createElement("a");try{const g=String(u.path??"");try{f.setAttribute("href",Fe(g))}catch{g?.indexOf("/")===-1?f.setAttribute("href","#"+encodeURIComponent(g)):f.setAttribute("href",Ot(g))}}catch{f.setAttribute("href","#"+u.path)}f.textContent=u.name,d.appendChild(f),c.appendChild(d)}),a.appendChild(c)}s.appendChild(a)}),i.appendChild(s)}catch{t.forEach(o=>{try{const a=document.createElement("li"),l=document.createElement("a");try{const c=String(o.path??"");try{l.setAttribute("href",Fe(c))}catch{c?.indexOf("/")===-1?l.setAttribute("href","#"+encodeURIComponent(c)):l.setAttribute("href",Ot(c))}}catch{l.setAttribute("href","#"+o.path)}if(l.textContent=o.name,a.appendChild(l),o.children?.length){const c=document.createElement("ul");o.children.forEach(u=>{const d=document.createElement("li"),f=document.createElement("a");try{const g=String(u.path??"");try{f.setAttribute("href",Fe(g))}catch{g?.indexOf("/")===-1?f.setAttribute("href","#"+encodeURIComponent(g)):f.setAttribute("href",Ot(g))}}catch{f.setAttribute("href","#"+u.path)}f.textContent=u.name,d.appendChild(f),c.appendChild(d)}),a.appendChild(c)}i.appendChild(a)}catch(a){k("[htmlBuilder] createNavTree item failed",a)}})}return n.appendChild(i),n}function ff(e,t,n=""){const r=document.createElement("aside");r.className="menu box nimbi-toc-inner is-hidden-mobile",r.setAttribute("role","navigation");try{r.setAttribute("aria-label",e("onThisPage"))}catch{}const i=document.createElement("p");i.className="menu-label",i.textContent=e("onThisPage"),r.appendChild(i);const s=document.createElement("ul");s.className="menu-list";try{const o={};(t||[]).forEach(a=>{try{if(!a||a.level===1)return;const l=Number(a.level)>=2?Number(a.level):2,c=document.createElement("li"),u=document.createElement("a"),d=dc(a.text||""),f=a.id||Se(d);u.textContent=d;try{const y=String(n??"").replace(/^[\.\/]+/,""),h=y&&be?.has?.(y)?be.get(y):y;h?u.href=Fe(h,f):u.href=`#${encodeURIComponent(f)}`}catch(y){k("[htmlBuilder] buildTocElement href normalization failed",y),u.href=`#${encodeURIComponent(f)}`}if(c.appendChild(u),l===2){s.appendChild(c),o[2]=c,Object.keys(o).forEach(y=>{Number(y)>2&&delete o[y]});return}let g=l-1;for(;g>2&&!o[g];)g--;g<2&&(g=2);let m=o[g];if(!m){s.appendChild(c),o[l]=c;return}let p=m.querySelector("ul");p||(p=document.createElement("ul"),m.appendChild(p)),p.appendChild(c),o[l]=c}catch(l){k("[htmlBuilder] buildTocElement item failed",l,a)}})}catch(o){k("[htmlBuilder] buildTocElement failed",o)}return r.appendChild(s),s.querySelectorAll("li").length<=1?null:r}function El(e){e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(t=>{t.id||(t.id=Se(t.textContent||""))})}function df(e,t,n){try{const r=e.querySelectorAll?.("img")||[];if(r?.length){const i=t?.includes("/")?t.substring(0,t.lastIndexOf("/")+1):"";r.forEach(s=>{const o=s.getAttribute("src")||"";if(o&&!(/^(https?:)?\/\//.test(o)||o.startsWith("/")))try{s.src=new URL(i+o,n).toString();try{s.getAttribute("loading")||s.setAttribute("data-want-lazy","1")}catch(a){k("[htmlBuilder] set image loading attribute failed",a)}}catch(a){k("[htmlBuilder] resolve image src failed",a)}})}}catch(r){k("[htmlBuilder] lazyLoadImages failed",r)}}function uo(e,t,n){try{t=Hr(t),t=Hr(t);const r=t?.includes("/")?t.substring(0,t.lastIndexOf("/")+1):"";let i=null;try{const a=new URL(n,location.href);i=new URL(r||".",a).toString()}catch{try{i=new URL(r||".",location.href).toString()}catch{i=r||"./"}}let s=null;try{s=e.querySelectorAll("[src],[href],[srcset],[poster]")}catch{const l=[];try{l.push(...Array.from(e.getElementsByTagName("img")||[]))}catch{}try{l.push(...Array.from(e.getElementsByTagName("link")||[]))}catch{}try{l.push(...Array.from(e.getElementsByTagName("video")||[]))}catch{}try{l.push(...Array.from(e.getElementsByTagName("use")||[]))}catch{}try{l.push(...Array.from(e.querySelectorAll("[srcset]")||[]))}catch{}s=l}let o=Array.from(s||[]);try{const a=Array.from(e.getElementsByTagName("use")||[]);for(const l of a)o.indexOf(l)===-1&&o.push(l)}catch{}for(const a of Array.from(o||[]))try{const l=a.tagName?a.tagName.toLowerCase():"",c=u=>{try{const d=a.getAttribute(u)||"";if(!d||/^(https?:)?\/\//i.test(d)||d.startsWith("/")||d.startsWith("#"))return;try{a.setAttribute(u,new URL(d,i).toString())}catch(f){k("[htmlBuilder] rewrite asset attribute failed",u,d,f)}}catch(d){k("[htmlBuilder] rewriteAttr failed",d)}};if(a.hasAttribute?.("src")&&c("src"),a.hasAttribute?.("href")&&l!=="a"&&c("href"),a.hasAttribute?.("xlink:href")&&c("xlink:href"),a.hasAttribute?.("poster")&&c("poster"),a.hasAttribute?.("srcset")){const u=(a.getAttribute("srcset")||"").split(",").map(d=>d.trim()).filter(Boolean).map(d=>{const[f,g]=d.split(/\s+/,2);if(!f||/^(https?:)?\/\//i.test(f)||f.startsWith("/"))return d;try{const m=new URL(f,i).toString();return g?`${m} ${g}`:m}catch{return d}}).join(", ");a.setAttribute("srcset",u)}}catch(l){k("[htmlBuilder] rewriteRelativeAssets node processing failed",l)}}catch(r){k("[htmlBuilder] rewriteRelativeAssets failed",r)}}var ho="",ps=null,fo="";async function Al(e,t,n,r={}){try{n=Hr(n),r=r||{},r.canonical=r.canonical!==!1;const i=e.querySelectorAll?.("a")||[];if(!i.length)return;let s,o;if(t===ho&&ps)s=ps,o=fo;else{try{s=new URL(t,location.href),o=Mn(s.pathname)}catch{try{s=new URL(t,location.href),o=Mn(s.pathname)}catch{s=null,o="/"}}ho=t,ps=s,fo=o}const a=new Set,l=[],c=new Set,u=[];for(const d of Array.from(i))try{try{if(d?.closest?.("h1,h2,h3,h4,h5,h6"))continue}catch{}const f=d.getAttribute?.("href")||"";if(!f)continue;if(Pi(f)){try{d.setAttribute("rel","noopener noreferrer nofollow")}catch{}continue}try{if(f.startsWith("?")||f.indexOf("?")!==-1)try{const m=new URL(f,t||location.href),p=m.searchParams.get("page");if(p&&p.indexOf("/")===-1&&n){const y=n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"";if(y){const h=re(y+p),w=r?.canonical?Fe(h,m.hash?m.hash.replace(/^#/,""):null):Ot(h,m.hash?m.hash.replace(/^#/,""):null);d.setAttribute("href",w);continue}}}catch{}}catch{}if(f.startsWith("/")&&!f.endsWith(".md"))continue;const g=f.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(g){let m=g[1];const p=g[2];!m.startsWith("/")&&n&&(m=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+m);try{const y=new URL(m,t).pathname;let h=y.startsWith(o)?y.slice(o.length):y;h=Gr(h,o),h=re(h),l.push({node:d,mdPathRaw:m,frag:p,rel:h}),be?.has?.(h)||a.add(h)}catch(y){k("[htmlBuilder] resolve mdPath failed",y)}continue}try{let m=f;!f.startsWith("/")&&n&&(f.startsWith("#")?m=n+f:m=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+f);const p=new URL(m,t).pathname||"";if(p&&p.indexOf(o)!==-1){let y=p.startsWith(o)?p.slice(o.length):p;if(y=Gr(y,o),y=re(y),y=Wn(y),y||(y=Kt),!y.endsWith(".md")){const h=gs(y);if(h){const w=r?.canonical?Fe(h,null):Ot(h);d.setAttribute("href",w)}else{let w=y;try{/\.[^\/]+$/.test(String(y??""))||(w=String(y??"")+".html")}catch{w=y}c.add(w),u.push({node:d,rel:w})}}}}catch(m){k("[htmlBuilder] resolving href to URL failed",m)}}catch(f){k("[htmlBuilder] processing anchor failed",f)}if(a.size)if(!Fr(t)||r?.allowProbe===!1){try{k("[htmlBuilder] skipping md title probes (probing disabled)")}catch{}for(const d of Array.from(a))try{const f=String(d).match(/([^\/]+)\.md$/),g=f&&f[1];if(g){const m=Se(g);if(m)try{ft(m,d)}catch(p){k("[htmlBuilder] setting fallback slug mapping failed",p)}}}catch{}}else await qs(Array.from(a),async d=>{try{try{const g=String(d).match(/([^\/]+)\.md$/),m=g&&g[1];if(m&&te.has(m)){try{const p=te.get(m);if(p)try{const y=typeof p=="string"?p:p?.default?p.default:null;y&&ft(m,y)}catch(y){k("[htmlBuilder] _storeSlugMapping failed",y)}}catch(p){k("[htmlBuilder] reading slugToMd failed",p)}return}}catch(g){k("[htmlBuilder] basename slug lookup failed",g)}const f=await Ke(d,t);if(f?.raw){const g=(f.raw||"").match(/^#\s+(.+)$/m);if(g&&g[1]){const m=Se(g[1].trim());if(m)try{ft(m,d)}catch(p){k("[htmlBuilder] setting slug mapping failed",p)}}}}catch(f){k("[htmlBuilder] fetchMarkdown during rewriteAnchors failed",f)}},6);if(c.size)if(!Fr(t)||r?.allowProbe===!1){try{k("[htmlBuilder] skipping html title probes (probing disabled)")}catch{}for(const d of Array.from(c))try{const f=String(d).match(/([^\/]+)\.html$/),g=f&&f[1];if(g){const m=Se(g);if(m)try{ft(m,d)}catch(p){k("[htmlBuilder] setting fallback html slug mapping failed",p)}}}catch{}}else await qs(Array.from(c),async d=>{try{const f=await Ke(d,t);if(f&&f.raw)try{const g=st(),m=g?g.parseFromString(f.raw,"text/html"):null,p=m?m.querySelector("title"):null,y=m?m.querySelector("h1"):null,h=p&&p.textContent&&p.textContent.trim()?p.textContent.trim():y&&y.textContent?y.textContent.trim():null;if(h){const w=Se(h);if(w)try{ft(w,d)}catch(b){k("[htmlBuilder] setting html slug mapping failed",b)}}}catch(g){k("[htmlBuilder] parse fetched HTML failed",g)}}catch(f){k("[htmlBuilder] fetchMarkdown for htmlPending failed",f)}},5);for(const d of l){const{node:f,frag:g,rel:m}=d;let p=gs(m);if(p){const y=r?.canonical?Fe(p,g):Ot(p,g);f.setAttribute("href",y)}else{const y=r?.canonical?Fe(m,g):Ot(m,g);f.setAttribute("href",y)}}for(const d of u){const{node:f,rel:g}=d;let m=gs(g);if(!m)try{const p=String(g??"").replace(/^.*\//,"");be?.has?.(p)&&(m=be?.get?.(p))}catch(p){k("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo",p)}if(m){const p=r?.canonical?Fe(m,null):Ot(m);f.setAttribute("href",p)}else{const p=r?.canonical?Fe(g,null):Ot(g);f.setAttribute("href",p)}}}catch(i){k("[htmlBuilder] rewriteAnchors failed",i)}}function gf(e,t,n,r){const i=t.querySelector("h1"),s=i?(i.textContent||"").trim():"";let o="";try{let a="";try{e&&e.meta&&e.meta.title&&(a=String(e.meta.title).trim())}catch{}if(!a&&s&&(a=s),!a)try{const l=t.querySelector("h2");l&&l.textContent&&(a=String(l.textContent).trim())}catch{}!a&&n&&(a=String(n)),a&&(o=Se(a)),o||(o=Kt);try{if(n){try{ft(o,n)}catch(l){k("[htmlBuilder] computeSlug set slug mapping failed",l)}try{const l=re(String(n??""));if(be?.has?.(l))o=be.get(l);else try{for(const[c,u]of te||[])try{const d=typeof u=="string"?u:u?.default?u.default:null;if(d&&re(String(d))===l){o=c;break}}catch{}}catch{}}catch{}}}catch(l){k("[htmlBuilder] computeSlug set slug mapping failed",l)}try{let l=r||"";if(!l)try{const c=_t(typeof location<"u"?location.href:"");c?.anchor&&c?.page&&String(c.page)===String(o)?l=c.anchor:l=""}catch{l=""}try{history.replaceState({page:o},"",Ot(o,l))}catch(c){k("[htmlBuilder] computeSlug history replace failed",c)}}catch(l){k("[htmlBuilder] computeSlug inner failed",l)}}catch(a){k("[htmlBuilder] computeSlug failed",a)}try{if(e?.meta?.title&&i){const a=String(e.meta.title).trim();if(a&&a!==s){try{o&&(i.id=o)}catch{}try{if(Array.isArray(e.toc))for(const l of e.toc)try{if(l&&Number(l.level)===1&&String(l.text).trim()===(s||"").trim()){l.id=o;break}}catch{}}catch{}}}}catch{}return{topH1:i,h1Text:s,slugKey:o}}async function pf(e,t,n={}){if(!e||!e.length)return;const r=new Set;for(const o of Array.from(e||[]))try{const a=o.getAttribute("href")||"";if(!a)continue;let l=re(a).split(/::|#/,2)[0];try{const u=l.indexOf("?");u!==-1&&(l=l.slice(0,u))}catch{}if(!l||(l.includes(".")||(l=l+".html"),!/\.html(?:$|[?#])/.test(l)&&!l.toLowerCase().endsWith(".html")))continue;const c=l;try{if(be?.has?.(c))continue}catch(u){k("[htmlBuilder] mdToSlug check failed",u)}try{let u=!1;for(const d of te.values())if(d===c){u=!0;break}if(u)continue}catch(u){k("[htmlBuilder] slugToMd iteration failed",u)}r.add(c)}catch(a){k("[htmlBuilder] preScanHtmlSlugs anchor iteration failed",a)}if(!r.size)return;if(!Fr(t)||n?.allowProbe===!1){try{k("[htmlBuilder] skipping preScanHtmlSlugs (probing disabled)")}catch{}for(const o of Array.from(r))try{const a=String(o).match(/([^\/]+)\.html$/),l=a&&a[1];if(l){const c=Se(l);if(c)try{ft(c,o)}catch(u){k("[htmlBuilder] setting fallback preScanHtmlSlugs mapping failed",u)}}}catch{}return}const i=async o=>{try{const a=await Ke(o,t);if(a&&a.raw)try{const l=st().parseFromString(a.raw,"text/html"),c=l.querySelector("title"),u=l.querySelector("h1"),d=c?.textContent&&c.textContent.trim()?c.textContent.trim():u?.textContent?u.textContent.trim():null;if(d){const f=Se(d);if(f)try{ft(f,o)}catch(g){k("[htmlBuilder] set slugToMd/mdToSlug failed",g)}}}catch(l){k("[htmlBuilder] parse HTML title failed",l)}}catch(a){k("[htmlBuilder] fetchAndExtract failed",a)}},s=Array.from(r);await qs(s,i,Math.max(1,Math.min(Ir(),s.length||1)))}async function mf(e,t,n={}){if(!e||!e.length)return;const r=[],i=new Set;let s="";try{const o=new URL(t,typeof location<"u"?location.href:"http://localhost/");s=Mn(o.pathname)}catch(o){s="",k("[htmlBuilder] preMapMdSlugs parse base failed",o)}for(const o of Array.from(e||[]))try{const a=o.getAttribute("href")||"";if(!a)continue;const l=a.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(l){let c=re(l[1]);try{let u;try{u=uf(c,t)}catch(f){u=c,k("[htmlBuilder] resolve mdPath URL failed",f)}let d=u&&s&&u.startsWith(s)?u.slice(s.length):String(u??"").replace(/^\//,"");d=Gr(d,s),r.push({rel:d}),be?.has?.(d)||i.add(d)}catch(u){k("[htmlBuilder] rewriteAnchors failed",u)}continue}}catch(a){k("[htmlBuilder] preMapMdSlugs anchor iteration failed",a)}if(i.size){if(!Fr(t)||n?.allowProbe===!1){try{k("[htmlBuilder] skipping preMapMdSlugs probes (probing disabled)")}catch{}for(const o of Array.from(i))try{const a=String(o).match(/([^\/]+)\.md$/),l=a&&a[1];if(l){const c=Se(l);if(c)try{ft(c,o)}catch(u){k("[htmlBuilder] setting fallback preMapMdSlugs mapping failed",u)}}}catch{}return}await Promise.all(Array.from(i).map(async o=>{try{const a=String(o).match(/([^\/]+)\.md$/),l=a&&a[1];if(l&&te.has(l)){try{const c=te.get(l);if(c)try{const u=typeof c=="string"?c:c?.default?c.default:null;u&&ft(l,u)}catch(u){k("[htmlBuilder] _storeSlugMapping failed",u)}}catch(c){k("[htmlBuilder] preMapMdSlugs slug map access failed",c)}return}}catch(a){k("[htmlBuilder] preMapMdSlugs basename check failed",a)}try{const a=await Ke(o,t);if(a&&a.raw){const l=(a.raw||"").match(/^#\s+(.+)$/m);if(l&&l[1]){const c=Se(l[1].trim());if(c)try{ft(c,o)}catch(u){k("[htmlBuilder] preMapMdSlugs setting slug mapping failed",u)}}}}catch(a){k("[htmlBuilder] preMapMdSlugs fetch failed",a)}}))}}function ms(e){try{const t=st().parseFromString(e||"","text/html");El(t);try{t.querySelectorAll("img").forEach(i=>{try{i.getAttribute("loading")||i.setAttribute("data-want-lazy","1")}catch(s){k("[htmlBuilder] parseHtml set image loading attribute failed",s)}})}catch(i){k("[htmlBuilder] parseHtml query images failed",i)}t.querySelectorAll("pre code, code[class]").forEach(i=>{try{const s=i.getAttribute?.("class")||i.className||"",o=s.match(/language-([a-zA-Z0-9_+-]+)/)||s.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(o&&o[1]){const a=(o[1]||"").toLowerCase(),l=Oe.size&&(Oe.get(a)||Oe.get(String(a).toLowerCase()))||a;try{(async()=>{try{await rr(l)}catch(c){k("[htmlBuilder] registerLanguage failed",c)}})()}catch(c){k("[htmlBuilder] schedule registerLanguage failed",c)}}else try{if(Ye&&typeof Ye.getLanguage=="function"&&Ye.getLanguage("plaintext")){const a=Ye.highlight?Ye.highlight(i.textContent||"",{language:"plaintext"}):null;if(a&&a.value)try{if(typeof document<"u"&&document.createRange&&typeof document.createRange=="function"){const l=document.createRange().createContextualFragment(a.value);if(typeof i.replaceChildren=="function")i.replaceChildren(...Array.from(l.childNodes));else{for(;i.firstChild;)i.removeChild(i.firstChild);i.appendChild(l)}}else i.innerHTML=a.value}catch{try{i.innerHTML=a.value}catch{}}}}catch(a){k("[htmlBuilder] plaintext highlight fallback failed",a)}}catch(s){k("[htmlBuilder] code element processing failed",s)}});const n=[];t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(i=>{n.push({level:Number(i.tagName.substring(1)),text:(i.textContent||"").trim(),id:i.id})});const r={};try{const i=t.querySelector("title");i?.textContent&&String(i.textContent).trim()&&(r.title=String(i.textContent).trim())}catch{}return{html:t.body.innerHTML,meta:r,toc:n}}catch(t){return k("[htmlBuilder] parseHtml failed",t),{html:e||"",meta:{},toc:[]}}}async function Tl(e){const t=zs?await zs(e||"",Oe):Ui(e||"",Oe),n=new Set(t),r=[];for(const i of n)try{const s=Oe.size&&(Oe.get(i)||Oe.get(String(i).toLowerCase()))||i;try{r.push(rr(s))}catch(o){k("[htmlBuilder] ensureLanguages push canonical failed",o)}if(String(i)!==String(s))try{r.push(rr(i))}catch(o){k("[htmlBuilder] ensureLanguages push alias failed",o)}}catch(s){k("[htmlBuilder] ensureLanguages inner failed",s)}try{await Promise.all(r)}catch(i){k("[htmlBuilder] ensureLanguages failed",i)}}async function _f(e){if(await Tl(e),sr){const t=await sr(e||"");return!t||typeof t!="object"?{html:String(e??""),meta:{},toc:[]}:(Array.isArray(t.toc)||(t.toc=[]),t.meta||(t.meta={}),t)}return{html:String(e??""),meta:{},toc:[]}}async function yf(e,t,n,r,i){let s=null,o=null;if(t.isHtml)try{const f=st();if(f){const g=f.parseFromString(t.raw||"","text/html");try{uo(g.body,n,i)}catch(m){k("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)",m)}s=ms(g.documentElement?.outerHTML?g.documentElement.outerHTML:t?.raw||"")}else s=ms(t.raw||"")}catch{s=ms(t.raw||"")}else{const f=t.raw||"",g=65536;if(f&&f.length>g&&Os){try{await Tl(f)}catch{}o=document.createElement("article"),o.id="main",o.className="nimbi-article content",o.setAttribute("itemscope",""),o.setAttribute("itemtype","https://schema.org/Article");const m=[];let p={};try{await Os(f,(y,h)=>{try{h&&h.meta&&(p=Object.assign(p,h.meta))}catch{}try{h&&Array.isArray(h.toc)&&h.toc.length&&m.push(...h.toc)}catch{}try{Ti(()=>{try{const w=st();if(w){const b=w.parseFromString(String(y??""),"text/html"),S=Array.from(b.body.childNodes||[]);S.length?o.append(...S):o.insertAdjacentHTML("beforeend",y||"")}else{const b=document&&typeof document.createRange=="function"?document.createRange():null;if(b&&typeof b.createContextualFragment=="function"){const S=b.createContextualFragment(String(y??""));o.append(...Array.from(S.childNodes))}else o.insertAdjacentHTML("beforeend",y||"")}}catch{try{o.insertAdjacentHTML("beforeend",y||"")}catch{}}})}catch{}},{chunkSize:g})}catch(y){k("[htmlBuilder] streamParseMarkdown failed, falling back",y)}s={html:o.innerHTML,meta:p||{},toc:m}}else s=await _f(t.raw||"")}let a;if(o)a=o;else{a=document.createElement("article"),a.id="main",a.className="nimbi-article content",a.setAttribute("itemscope",""),a.setAttribute("itemtype","https://schema.org/Article");try{const f=st&&st();if(f){const g=f.parseFromString(String(s.html??""),"text/html"),m=Array.from(g.body.childNodes||[]);m.length?a.replaceChildren(...m):a.innerHTML=s.html}else try{const g=document&&typeof document.createRange=="function"?document.createRange():null;if(g&&typeof g.createContextualFragment=="function"){const m=g.createContextualFragment(String(s.html??""));a.replaceChildren(...Array.from(m.childNodes))}else a.innerHTML=s.html}catch{a.innerHTML=s.html}}catch{try{a.innerHTML=s.html}catch(g){k("[htmlBuilder] set article html failed",g)}}}try{uo(a,n,i)}catch(f){k("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle",f)}try{El(a)}catch(f){k("[htmlBuilder] addHeadingIds failed",f)}try{a.querySelectorAll("pre code, code[class]").forEach(f=>{try{const g=f.getAttribute?.("class")||f.className||"",m=String(g??"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(m)try{f.setAttribute?.("class",m)}catch(p){f.className=m,k("[htmlBuilder] set element class failed",p)}else try{f.removeAttribute?.("class")}catch(p){f.className="",k("[htmlBuilder] remove element class failed",p)}}catch(g){k("[htmlBuilder] code element cleanup failed",g)}})}catch(f){k("[htmlBuilder] processing code elements failed",f)}df(a,n,i);try{(a.querySelectorAll?.("img")||[]).forEach(f=>{try{const g=f.parentElement;if(!g||g.tagName.toLowerCase()!=="p"||g.childNodes.length!==1)return;const m=document.createElement("figure");m.className="image",g.replaceWith(m),m.appendChild(f)}catch{}})}catch(f){k("[htmlBuilder] wrap images in Bulma image helper failed",f)}try{(a.querySelectorAll?.("table")||[]).forEach(f=>{try{if(f.classList)f.classList.contains("table")||f.classList.add("table");else{const g=f.getAttribute?.("class")||"",m=String(g??"").split(/\s+/).filter(Boolean);m.indexOf("table")===-1&&m.push("table");try{f.setAttribute?.("class",m.join(" "))}catch{f.className=m.join(" ")}}}catch{}})}catch(f){k("[htmlBuilder] add Bulma table class failed",f)}const{topH1:l,h1Text:c,slugKey:u}=gf(s,a,n,r);try{if(l&&(s?.meta?.author||s?.meta?.date)&&!l.parentElement?.querySelector?.(".nimbi-article-subtitle")){const f=s.meta.author?String(s.meta.author).trim():"",g=s.meta.date?String(s.meta.date).trim():"";let m="";try{const y=new Date(g);g&&!isNaN(y.getTime())?m=y.toLocaleDateString():m=g}catch{m=g}const p=[];if(f&&p.push(f),m&&p.push(m),p.length){const y=document.createElement("p"),h=p[0]?String(p[0]).replace(/"/g,"").trim():"",w=p.slice(1);if(y.className="nimbi-article-subtitle is-6 has-text-grey-light",h){const b=document.createElement("span");b.className="nimbi-article-author",b.textContent=h,y.appendChild(b)}if(w.length){const b=document.createElement("span");b.className="nimbi-article-meta",b.textContent=w.join(" • "),y.appendChild(b)}try{l.parentElement.insertBefore(y,l.nextSibling)}catch{try{l.insertAdjacentElement("afterend",y)}catch{}}}}}catch{}try{await Ef(a,i,n)}catch(f){cf("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread",f),await Al(a,i,n)}const d=ff(e,s.toc,n);return{article:a,parsed:s,toc:d,topH1:l,h1Text:c,slugKey:u}}function bf(e,t=!1){if(!(!e||!e.querySelectorAll))try{const n=Array.from(e.querySelectorAll("script"));if(!t){for(const r of n)try{r.parentNode?.removeChild(r)}catch{}return}for(const r of n)try{const i=document.createElement("script"),s=new Set(["src","type","async","defer","crossorigin","integrity","nomodule","referrerpolicy","id","class","nonce"]);for(const a of r.attributes)try{s.has(a.name)&&i.setAttribute(a.name,a.value)}catch{}if(i.hasAttribute("nonce")||Vs(i),!r.src){const a=r.textContent||"";let l=!1;try{new Function(a)(),l=!0}catch{l=!1}if(l){r.parentNode?.removeChild(r);try{wn("[htmlBuilder] executed inline script via Function")}catch{}try{(document.head||document.body||document.documentElement).appendChild(i)}catch{try{try{i.type="text/javascript"}catch{}(document.head||document.body||document.documentElement).appendChild(i)}catch(u){try{k("[htmlBuilder] injected script append failed, skipping",{src:o,err:u})}catch{}}}continue}try{i.type="module"}catch{}i.textContent=a}if(r.src)try{if(document.querySelector?.(`script[src="${r.src}"]`)){r.parentNode?.removeChild(r);continue}}catch{}const o=r.src||"<inline>";i.addEventListener("error",a=>{try{k("[htmlBuilder] injected script error",{src:o,ev:a})}catch{}}),i.addEventListener("load",()=>{try{wn("[htmlBuilder] injected script loaded",{src:o,hasNimbi:!!(window&&window.nimbiCMS)})}catch{}});try{(document.head||document.body||document.documentElement).appendChild(i)}catch{try{try{i.type="text/javascript"}catch{}(document.head||document.body||document.documentElement).appendChild(i)}catch(l){try{k("[htmlBuilder] injected script append failed, skipping",{src:o,err:l})}catch{}}}r.parentNode?.removeChild(r);try{wn("[htmlBuilder] executed injected script",o)}catch{}}catch(i){k("[htmlBuilder] execute injected script failed",i)}}catch{}}function go(e,t,n){if(e)try{typeof e.replaceChildren=="function"?e.replaceChildren():e.innerHTML=""}catch{try{e.innerHTML=""}catch{}}const r=document.createElement("article");r.className="nimbi-article content nimbi-not-found",r.setAttribute("aria-live","polite");const i=document.createElement("h1");i.textContent=t&&t("notFound")||"Page not found";const s=document.createElement("p");s.textContent=n?.message?String(n.message):"Failed to resolve the requested page.",r.appendChild(i),r.appendChild(s),e&&e.appendChild&&e.appendChild(r);try{if(!ke)try{const o=document.createElement("p");o.textContent=(t&&t("goHome")||"Go back to")+" ";const a=document.createElement("a");try{a.href=Fe(Et)}catch{a.href=Fe(Et||"")}a.textContent=t&&t("home")||"Home",o.appendChild(a),e&&e.appendChild&&e.appendChild(o)}catch{}}catch{}try{try{Ai({title:t&&t("notFound")||"Not Found",description:t&&t("notFoundDescription")||""},ke,t&&t("notFound")||"Not Found",t&&t("notFoundDescription")||"")}catch{}}catch{}try{try{const o=typeof window<"u"&&window.__nimbiNotFoundRedirect?String(window.__nimbiNotFoundRedirect).trim():null;if(o)try{const a=new URL(o,location.origin).toString();if((location.href||"").split("#")[0]!==a)try{location.replace(a)}catch{location.href=a}}catch{}}catch{}}catch{}}var wf={intervalMs:500,targetMs:80,hysteresis:.25,cooldownMs:600,stepUp:1,stepDown:1},Ml=(()=>{const e={size:2,minSize:2,autoScale:wf,messageCodec:"legacy",maxQueueLength:100};try{e.debugLevel=0}catch{}try{return new Ys(lf,e)}catch{return{workers:[],postMessage:async()=>{throw new Error("anchor worker unavailable")}}}})();function Sf(e){if(!e)return null;try{if(be?.has?.(e))return be.get(e)}catch{}try{const r=String(e).replace(/^.*\//,"");if(r&&be?.has?.(r))return be.get(r)}catch{}const t=xl();try{if(t?.has?.(e))return t.get(e);const r=String(e).replace(/^.*\//,"");if(r&&t?.has?.(r))return t.get(r)}catch{}const n=kl(e,2);try{for(const[r,i]of te||[]){if(i===e)return r;const s=String(e).replace(/^.*\//,"");if(i===s)return r;if(typeof i=="string"){if(i.endsWith(`/${n}`))return r}else if(i&&typeof i=="object"){if(i.default===e||i.default===s||i.default&&i.default.endsWith(`/${n}`))return r;const o=i.langs&&typeof i.langs=="object"?Object.values(i.langs):[];if(o.includes(e)||o.includes(s))return r;for(const a of o)if(typeof a=="string"&&a.endsWith(`/${n}`))return r}}if(t)for(const[r,i]of t.entries()){const s=String(e).replace(/^.*\//,"");if(r===e||r===s||String(r).endsWith(`/${n}`))return i}}catch{}return null}function vf(e,t,n){n=Hr(n);const r=new Set;let i="/";try{const o=new URL(t,location.href);i=Mn(o.pathname)}catch{}try{const o=Array.from(e?.querySelectorAll?.("a")||[]);for(const a of o)try{try{if(a?.closest?.("h1,h2,h3,h4,h5,h6"))continue}catch{}const l=a.getAttribute?.("href")||"";if(!l||Pi(l)||l.startsWith("/")&&!l.endsWith(".md"))continue;const c=l.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(c){let g=c[1];!g.startsWith("/")&&n&&(g=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+g);const m=new URL(g,t).pathname;let p=m.startsWith(i)?m.slice(i.length):m;p=re(Gr(p,i)),r.add(p),r.add(String(p).replace(/^.*\//,""));continue}let u=l;!l.startsWith("/")&&n&&(l.startsWith("#")?u=n+l:u=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+l);const d=new URL(u,t).pathname||"";if(!d||d.indexOf(i)===-1)continue;let f=d.startsWith(i)?d.slice(i.length):d;f=re(Gr(f,i)),f=Wn(f),f||(f=Kt),r.add(f),r.add(String(f).replace(/^.*\//,"")),/\.[^/]+$/.test(String(f??""))||(r.add(f+".html"),r.add((f+".html").replace(/^.*\//,"")))}catch{}}catch{}const s={};for(const o of r){const a=Sf(o);a&&(s[o]=a)}return{allowProbe:Fr(t),homeSlug:Kt,pathToSlug:s}}function kf(){return Ml.workers?.[0]?.worker?._underlying??null}function xf(e){return Ml.postMessage(e,void 0,{awaitResponse:!0,timeout:2e3}).then(t=>{if(t&&typeof t=="object"&&t.error)throw new Error(t.error);return t}).catch(t=>{throw(t?.message||"").includes("postMessage response timeout")?new Error("worker timeout"):t})}async function Ef(e,t,n){if(!kf())throw new Error("anchor worker unavailable");if(!e||typeof e.innerHTML!="string")throw new Error("invalid article element");n=Hr(n);const r=String(e.innerHTML),i=vf(e,t,n),s=await xf({type:"rewriteAnchors",html:r,contentBase:t,pagePath:n,snapshot:i}),o=s&&typeof s=="object"&&typeof s.html=="string"?s.html:s;if(s&&typeof s=="object"&&Array.isArray(s.mappings))for(const l of s.mappings)try{l&&l.slug&&l.path&&ft(l.slug,l.path)}catch(c){k("[htmlBuilder] storing worker anchor mapping failed",c)}let a=!1;if(typeof o=="string")try{const l=String(o??"").includes(".md");String(r??"").includes(".md")&&l&&(a=!0);const c=st&&st();if(c){const u=c.parseFromString(String(o??""),"text/html"),d=Array.from(u.body.childNodes||[]);d.length?e.replaceChildren(...d):e.innerHTML=o}else try{const u=document&&typeof document.createRange=="function"?document.createRange():null;if(u&&typeof u.createContextualFragment=="function"){const d=u.createContextualFragment(String(o??""));e.replaceChildren(...Array.from(d.childNodes))}else e.innerHTML=o}catch{e.innerHTML=o}}catch(l){k("[htmlBuilder] applying rewritten anchors failed",l),a=!0}if(a)try{await Al(e,t,n)}catch(l){k("[htmlBuilder] main-thread fallback after worker rewrite failed",l)}}function Af(e){try{e.addEventListener("click",t=>{const n=t.target?.closest?.("a")||null;if(!n)return;const r=n.getAttribute?.("href")||"";try{const i=_t(r),s=i?.page??null,o=i?.anchor??null;if(!s&&!o)return;t.preventDefault();let a=null;try{history?.state?.page&&(a=history.state.page)}catch(l){a=null,k("[htmlBuilder] access history.state failed",l)}try{a||(a=new URL(location.href).searchParams.get("page"))}catch(l){k("[htmlBuilder] parse current location failed",l)}if(!s&&o||s&&a&&String(s)===String(a)){try{if(!s&&o)try{history.replaceState(history.state,"",(location.pathname||"")+(location.search||"")+(o?"#"+encodeURIComponent(o):""))}catch(l){k("[htmlBuilder] history.replaceState failed",l)}else try{history.replaceState({page:a||s},"",Ot(a||s,o))}catch(l){k("[htmlBuilder] history.replaceState failed",l)}}catch(l){k("[htmlBuilder] update history for anchor failed",l)}try{t.stopImmediatePropagation&&t.stopImmediatePropagation(),t.stopPropagation&&t.stopPropagation()}catch(l){k("[htmlBuilder] stopPropagation failed",l)}try{$s(o)}catch(l){k("[htmlBuilder] scrollToAnchorOrTop failed",l)}return}history.pushState({page:s},"",Ot(s,o));try{if(typeof window<"u"&&typeof window.renderByQuery=="function")try{const l=window.renderByQuery();l&&typeof l.catch=="function"&&l.catch(()=>{})}catch(l){k("[htmlBuilder] window.renderByQuery failed",l)}else if(typeof window<"u")try{window.dispatchEvent(new PopStateEvent("popstate"))}catch(l){k("[htmlBuilder] dispatch popstate failed",l)}else try{const l=renderByQuery();l&&typeof l.catch=="function"&&l.catch(()=>{})}catch(l){k("[htmlBuilder] renderByQuery failed",l)}}catch(l){k("[htmlBuilder] SPA navigation invocation failed",l)}}catch(i){k("[htmlBuilder] non-URL href in attachTocClickHandler",i)}})}catch(t){k("[htmlBuilder] attachTocClickHandler failed",t)}}function $s(e){const t=document.querySelector(".nimbi-cms")||null;if(e){const n=document.getElementById(e);if(n)try{const r=()=>{try{if(t&&t.scrollTo&&t.contains(n)){const i=n.getBoundingClientRect().top-t.getBoundingClientRect().top+t.scrollTop;t.scrollTo({top:i,behavior:"smooth"})}else try{n.scrollIntoView({behavior:"smooth",block:"start"})}catch{try{n.scrollIntoView()}catch(s){k("[htmlBuilder] scrollIntoView failed",s)}}}catch{try{n.scrollIntoView()}catch(s){k("[htmlBuilder] final scroll fallback failed",s)}}};try{requestAnimationFrame(()=>setTimeout(r,50))}catch(i){k("[htmlBuilder] scheduling scroll failed",i),setTimeout(r,50)}}catch(r){try{n.scrollIntoView()}catch(i){k("[htmlBuilder] final scroll fallback failed",i)}k("[htmlBuilder] doScroll failed",r)}}else try{t&&t.scrollTo?t.scrollTo({top:0,behavior:"smooth"}):window.scrollTo(0,0)}catch(n){try{window.scrollTo(0,0)}catch(r){k("[htmlBuilder] window.scrollTo failed",r)}k("[htmlBuilder] scroll to top failed",n)}}function Tf(e,t,{mountOverlay:n=null,container:r=null,mountEl:i=null,navWrap:s=null,t:o=null}={}){try{const a=typeof o=="function"?o:()=>{},l=r||document.querySelector(".nimbi-cms"),c=i||document.querySelector(".nimbi-mount"),u=n||document.querySelector(".nimbi-overlay"),d=s||document.querySelector(".nimbi-nav-wrap");let f=document.querySelector(".nimbi-scroll-top");if(!f){f=document.createElement("button"),f.className="nimbi-scroll-top button is-primary is-rounded is-small",f.setAttribute("aria-label",a("scrollToTop")||"Scroll to top"),f.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';try{u&&u.appendChild?u.appendChild(f):l&&l.appendChild?l.appendChild(f):c&&c.appendChild?c.appendChild(f):document.body.appendChild(f)}catch{try{document.body.appendChild(f)}catch(p){k("[htmlBuilder] append scroll top button failed",p)}}try{try{jo(f)}catch{}}catch(m){k("[htmlBuilder] set scroll-top button theme registration failed",m)}f.addEventListener("click",()=>{try{r&&r.scrollTo?r.scrollTo({top:0,left:0,behavior:"smooth"}):i&&i.scrollTo?i.scrollTo({top:0,left:0,behavior:"smooth"}):window.scrollTo({top:0,left:0,behavior:"smooth"})}catch{try{r&&(r.scrollTop=0)}catch(p){k("[htmlBuilder] fallback container scrollTop failed",p)}try{i&&(i.scrollTop=0)}catch(p){k("[htmlBuilder] fallback mountEl scrollTop failed",p)}try{document.documentElement.scrollTop=0}catch(p){k("[htmlBuilder] fallback document scrollTop failed",p)}}})}const g=d?.querySelector?.(".menu-label")||null;if(t){if(!f._nimbiObserver)if(typeof globalThis<"u"&&typeof globalThis.IntersectionObserver<"u"){const m=globalThis.IntersectionObserver,p=new m(y=>{for(const h of y)h.target instanceof Element&&(h.isIntersecting?(f.classList.remove("show"),g&&g.classList.remove("show")):(f.classList.add("show"),g&&g.classList.add("show")))},{root:r instanceof Element?r:i instanceof Element?i:null,threshold:0});f._nimbiObserver=p}else f._nimbiObserver=null;try{f._nimbiObserver&&typeof f._nimbiObserver.disconnect=="function"&&f._nimbiObserver.disconnect()}catch(m){k("[htmlBuilder] observer disconnect failed",m)}try{f._nimbiObserver&&typeof f._nimbiObserver.observe=="function"&&f._nimbiObserver.observe(t)}catch(m){k("[htmlBuilder] observer observe failed",m)}try{const m=()=>{try{const p=l instanceof Element?l.getBoundingClientRect():{top:0,bottom:window.innerHeight},y=t.getBoundingClientRect();y.bottom<p.top||y.top>p.bottom?(f.classList.add("show"),g&&g.classList.add("show")):(f.classList.remove("show"),g&&g.classList.remove("show"))}catch(p){k("[htmlBuilder] checkIntersect failed",p)}};m(),typeof globalThis<"u"&&typeof globalThis.IntersectionObserver<"u"||setTimeout(m,100)}catch(m){k("[htmlBuilder] checkIntersect outer failed",m)}}else{f.classList.remove("show"),g&&g.classList.remove("show");const m=r instanceof Element?r:i instanceof Element?i:window,p=()=>{try{(m===window?window.scrollY:m.scrollTop||0)>10?(f.classList.add("show"),g&&g.classList.add("show")):(f.classList.remove("show"),g&&g.classList.remove("show"))}catch(y){k("[htmlBuilder] onScroll handler failed",y)}};Ri(()=>m.addEventListener("scroll",af(p))),p()}}catch(a){k("[htmlBuilder] ensureScrollTopButton failed",a)}}var xr=null,po=[],jl=1e3,Mf=4;function mo(e){let t=String(e??"").toLowerCase().replace(/[^a-z0-9\- ]/g,"").replace(/ /g,"-");return t=t.replace(/(?:-?)(?:md|html)$/g,""),t=t.replace(/-+/g,"-"),t=t.replace(/^-|-$/g,""),t.length>80&&(t=t.slice(0,80).replace(/-+$/g,"")),t}function bn(e){return String(e??"").replace(/^[./]+/,"")}function jf(e){return String(e??"").replace(/\/+$/,"")}function zr(e){return jf(e)+"/"}function Pf(e,t){if(!e||typeof e!="string")return!1;if(e.startsWith("//"))return!0;if(/^[a-z][a-z0-9+.-]*:/i.test(e)){if(t&&typeof t=="string")try{const n=new URL(e),r=new URL(t);if(n.origin===r.origin)return!n.pathname.startsWith(r.pathname)}catch{}return!0}return!1}function Pl(e){const t=typeof location<"u"&&location.origin?location.origin:"http://localhost",n=String(e??"");return n?/^[a-z][a-z0-9+.-]*:/i.test(n)?zr(n):n.startsWith("/")?t+zr(n):t+"/"+zr(n):t+"/"}async function Rf(e,t){const n=Pl(t),r=new URL(String(e??"").replace(/^\//,""),n).toString(),i=await fetch(r);return!i||!i.ok?null:await i.text()}async function Lf(e,t,n=Mf){const r=Array.isArray(e)?e.slice():[],i=Math.max(1,Number(n)||1),s=[];for(let o=0;o<Math.min(i,r.length);o++)s.push((async()=>{for(;r.length;){const a=r.shift();a!=null&&await t(a)}})());await Promise.all(s)}async function Cf(e,t=jl,n=void 0){const r=new Set,i=new Set,s=[""];if(Array.isArray(n))for(const l of n)try{const c=bn(l);c&&s.push(c)}catch{}const o=Pl(e),a=zr(new URL(o).pathname);for(;s.length&&s.length<=t;){const l=s.shift();if(l==null||r.has(l))continue;r.add(l);const c=new URL(String(l??""),o).toString();let u=null;try{const p=await fetch(c);if(!p||!p.ok)continue;u=await p.text()}catch{continue}if(!u)continue;const d=[],f=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi,g=/(?:^|[^!])\[[^\]]+\]\(([^)]+)\)/g;let m=null;for(;m=f.exec(u);)try{m?.[1]&&d.push(m[1])}catch{}for(;m=g.exec(u);)try{m?.[1]&&d.push(m[1])}catch{}for(const p of d){if(!p||Pf(p,o)||p.startsWith("..")||p.includes("/../"))continue;if(p.endsWith("/")){try{const b=new URL(p,c);let S=b.pathname.startsWith(a)?b.pathname.slice(a.length):b.pathname.replace(/^\//,"");S=zr(bn(S)),r.has(S)||s.push(S)}catch{}continue}if(/\.(md|html?)($|[?#])/i.test(p)){try{const b=new URL(p,c);let S=b.pathname.startsWith(a)?b.pathname.slice(a.length):b.pathname.replace(/^\//,"");S=bn(S).split(/[?#]/)[0],S&&(i.add(S),r.has(S)||s.push(S))}catch{}try{const b=new URL(p,o);let S=b.pathname.startsWith(a)?b.pathname.slice(a.length):b.pathname.replace(/^\//,"");S=bn(S).split(/[?#]/)[0],S&&!i.has(S)&&(i.add(S),r.has(S)||s.push(S))}catch{}continue}let y=p.split(/[?#]/)[0].replace(/\/+$/,""),h=null;try{const b=new URL(p,o);h=b.pathname.startsWith(a)?b.pathname.slice(a.length):b.pathname.replace(/^\//,"")}catch{}try{const b=new URL(p,c);y=b.pathname.startsWith(a)?b.pathname.slice(a.length):b.pathname.replace(/^\//,"")}catch{}y=bn(y).split(/[?#]/)[0].replace(/\/+$/,""),h&&(h=bn(h).split(/[?#]/)[0].replace(/\/+$/,""));const w=String(y).split("/").pop()||"";if(!/\.[^./]+$/i.test(w)){if(y){const b=[`${y}.md`,`${y}.html`,`${y}/README.md`,`${y}/README.html`];for(const S of b)i.add(S),r.has(S)||s.push(S)}if(h&&h!==y){const b=[`${h}.md`,`${h}.html`,`${h}/README.md`,`${h}/README.html`];for(const S of b)i.has(S)||(i.add(S),r.has(S)||s.push(S))}}}}return Array.from(i)}function Nf(e,t){const n=String(e??"");if(t)return{title:((n.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[])[1]||(n.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||[])[1]||"").replace(/<[^>]+>/g,"").trim(),excerpt:((n.match(/<p[^>]*>([\s\S]*?)<\/p>/i)||[])[1]||"").replace(/<[^>]+>/g,"").trim()};const r=((n.match(/^#\s+(.+)$/m)||[])[1]||"").trim(),i=n.split(/\r?\n\s*\r?\n/);let s="";for(let o=1;o<i.length;o++){const a=i[o].trim();if(a&&!/^#/.test(a)){s=a.replace(/\r?\n/g," ");break}}return{title:r,excerpt:s}}async function If(e,t=1,n=void 0,r=void 0){if(xr)return xr;xr=(async()=>{const i=Array.isArray(n)?new Set(n.map(c=>bn(c))):new Set,s=Array.isArray(r)?r.map(c=>bn(c)).filter(Boolean):[],o=await Cf(e,jl,s),a=Array.from(new Set(o.concat(s))).filter(c=>/\.(md|html?)$/i.test(c)).filter(c=>!Array.from(i).some(u=>u&&(c===u||c.startsWith(u+"/")))),l=[];return await Lf(a,async c=>{const u=await Rf(c,e);if(!u)return;const d=/\.html?$/i.test(c),{title:f,excerpt:g}=Nf(u,d),m=mo(f||c);let p=null,y=null;try{if(!d){const{data:h}=tr(u),w=h.dateModified||h.date||h.lastmod;if(w){const S=new Date(w);isNaN(S.getTime())||(p=S.toISOString().split("T")[0])}const b=h.image||h.og_image||h.cover||h.featured_image;b&&String(b).trim()&&(y=String(b).trim())}}catch{}if(l.push({slug:m,title:f,excerpt:g,path:c,lastmod:p,image:y}),Number(t)>=2){const h=d?/<h2[^>]*>([\s\S]*?)<\/h2>/gi:/^##\s+(.+)$/gm;let w=null;for(;w=h.exec(u);){const b=String(w[1]??"").replace(/<[^>]+>/g,"").trim();b&&l.push({slug:`${m}::${mo(b)}`,title:b,excerpt:"",path:c,parentTitle:f||"",lastmod:p})}}}),po=l,po})();try{return await xr}finally{xr=null}}async function Rl(){return zc}async function Of(e,t=1,n=void 0,r=void 0){return(await Rl()).buildSearchIndexWorker(e,t,n,r)}async function zf(e={}){return(await Rl()).awaitSearchIndex(e)}var _s=_.__exportAll({attachSitemapDownloadUI:()=>Ws,clearSitemapWriteTimer:()=>Ll,exposeSitemapGlobals:()=>Fs,generateAtomXml:()=>Us,generateRobotsTxt:()=>Df,generateRssXml:()=>Bs,generateSitemapJson:()=>Xi,generateSitemapXml:()=>Ds,handleSitemapRequest:()=>Vr});function ua(){try{if(typeof location?.pathname=="string")return String(location.origin+location.pathname.split("?")[0])}catch{}return"http://localhost/"}function Xe(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}function _o(e){try{return!e||typeof e!="string"?"":(e.split("/").filter(Boolean).pop()||e).replace(/\.[a-z0-9]+$/i,"").replace(/[-_]+/g," ").split(" ").map(t=>t?t.charAt(0).toUpperCase()+t.slice(1):"").join(" ").trim()}catch{return String(e)}}function qf(e){try{if(!e||typeof e!="string")return null;const t=e.trim();if(!t)return null;if(/^[a-z][a-z0-9+.-]*:/i.test(t))return t;if(t.startsWith("//"))return"https:"+t;try{if(typeof location<"u"&&location.origin)return new URL(t,location.origin).href}catch{}return t}catch{return null}}function $f(e,t){try{const n=t?.slug?String(t.slug):null;if(!n)return null;const r={loc:e+"?page="+encodeURIComponent(n),slug:n};return t.title&&(r.title=String(t.title)),t.excerpt&&(r.excerpt=String(t.excerpt)),t.path&&(r.sourcePath=re(String(t.path))),t.image&&(r.image=String(t.image)),r}catch{return null}}async function Xi(e={}){const{includeAllMarkdown:t=!0,index:n,homePage:r,navigationPage:i,notFoundPage:s}=e||{},o=ua().split("?")[0];let a=Array.isArray(oe)&&oe.length?oe:Array.isArray(n)?n:[];if(Array.isArray(n)&&n.length&&Array.isArray(oe)&&oe.length){const y=new Map;try{for(const h of n)try{h?.slug&&y.set(String(h.slug),h)}catch{}for(const h of oe)try{h?.slug&&y.set(String(h.slug),h)}catch{}}catch{}a=Array.from(y.values())}const l=new Set;try{typeof s=="string"&&s.trim()&&l.add(re(String(s)))}catch{}try{typeof i=="string"&&i.trim()&&l.add(re(String(i)))}catch{}const c=new Set;try{if(typeof s=="string"&&s.trim()){const y=re(String(s));try{if(typeof be?.has=="function"&&be.has(y))try{c.add(be.get(y))}catch{}else try{const h=await Ke(y,e?.contentBase?e.contentBase:void 0);if(h?.raw)try{let w=null;if(h.isHtml)try{const b=st();if(b){const S=b.parseFromString(h.raw,"text/html"),A=S.querySelector("h1")||S.querySelector("title");A&&A.textContent&&(w=A.textContent.trim())}else{const S=(h.raw||"").match(/<h1[^>]*>(.*?)<\/h1>|<title[^>]*>(.*?)<\/title>/i);S&&(w=(S[1]||S[2]||"").trim())}}catch{}else{const b=(h.raw||"").match(/^#\s+(.+)$/m);b&&b[1]&&(w=b[1].trim())}w&&c.add(Se(w))}catch{}}catch{}}catch{}}}catch{}const u=new Set,d=[],f=new Map,g=new Map,m=y=>{try{if(!y||typeof y!="string")return!1;const h=re(String(y));try{if(typeof Qe?.has=="function"&&Qe.has(h))return!0}catch{}try{if(typeof be?.has=="function"&&be.has(h))return!0}catch{}try{if(g?.has(h))return!0}catch{}try{if(typeof be?.keys=="function"&&be.size)for(const w of be.keys())try{if(re(String(w))===h)return!0}catch{}else for(const w of te.values())try{if(!w)continue;if(typeof w=="string"){if(re(String(w))===h)return!0}else if(w&&typeof w=="object"){if(w.default&&re(String(w.default))===h)return!0;const b=w.langs||{};for(const S of Object.keys(b||{}))try{if(b[S]&&re(String(b[S]))===h)return!0}catch{}}}catch{}}catch{}}catch{}return!1};if(Array.isArray(a)&&a.length){let y=0;for(const h of a){try{y++,await Sn(y,64)}catch{}try{if(!h?.slug)continue;const w=String(h.slug),b=String(w).split("::")[0];if(c.has(b))continue;const S=h.path?re(String(h.path)):null;if(S&&l.has(S))continue;const A=h.title?String(h.title):h.parentTitle?String(h.parentTitle):void 0;f.set(w,{title:A||void 0,excerpt:h.excerpt?String(h.excerpt):void 0,path:S,source:"index",image:h.image?String(h.image):void 0}),S&&g.set(S,{title:A||void 0,excerpt:h.excerpt?String(h.excerpt):void 0,slug:w,image:h.image?String(h.image):void 0});const z=$f(o,h);if(!z||!z.slug||u.has(z.slug))continue;if(u.add(z.slug),f.has(z.slug)){const U=f.get(z.slug);U?.title&&(z.title=U.title,z._titleSource="index"),U?.excerpt&&(z.excerpt=U.excerpt),U?.image&&(z.image=U.image)}d.push(z)}catch{continue}}}if(t)try{let y=0;for(const[h,w]of te.entries()){try{y++,await Sn(y,128)}catch{}try{if(!h)continue;const b=String(h).split("::")[0];if(u.has(h)||c.has(b))continue;let S=null;if(typeof w=="string"?S=re(String(w)):w&&typeof w=="object"&&(S=re(String(w.default??""))),S&&l.has(S))continue;const A={loc:o+"?page="+encodeURIComponent(h),slug:h};if(f.has(h)){const z=f.get(h);z?.title&&(A.title=z.title,A._titleSource="index"),z?.excerpt&&(A.excerpt=z.excerpt),z?.image&&(A.image=z.image)}else if(S){const z=g.get(S);z?.title&&(A.title=z.title,A._titleSource="path",!A.excerpt&&z?.excerpt&&(A.excerpt=z.excerpt)),!A.image&&z?.image&&(A.image=z.image)}if(u.add(h),typeof h=="string"){const z=h.indexOf("/")!==-1||/\.(md|html?)$/i.test(h),U=A.title&&typeof A.title=="string"&&(A.title.indexOf("/")!==-1||/\.(md|html?)$/i.test(A.title));(!A.title||U||z)&&(A.title=_o(h),A._titleSource="humanize")}d.push(A)}catch{}}try{if(r&&typeof r=="string"){const h=re(String(r));let w=null;try{typeof be?.has=="function"&&be.has(h)&&(w=be.get(h))}catch{}w||(w=h);const b=String(w).split("::")[0];if(!u.has(w)&&!l.has(h)&&!c.has(b)){const S={loc:o+"?page="+encodeURIComponent(w),slug:w};if(f.has(w)){const A=f.get(w);A?.title&&(S.title=A.title,S._titleSource="index"),A?.excerpt&&(S.excerpt=A.excerpt),A?.image&&(S.image=A.image)}u.add(w),d.push(S)}}}catch{}}catch{}try{const y=new Set,h=new Set(d.map(z=>String(z?.slug??""))),w=new Set;for(const z of d)try{z?.sourcePath&&w.add(String(z.sourcePath))}catch{}const b=30;let S=0,A=0;for(const z of w){try{A++,await Sn(A,8)}catch{}if(S>=b)break;try{if(!z||typeof z!="string"||!m(z))continue;S+=1;const U=await Ke(z,e?.contentBase?e.contentBase:void 0);if(!U||!U.raw||U&&typeof U.status=="number"&&U.status===404)continue;const W=(function(R){try{return String(R??"")}catch{return""}})(U.raw),Y=[],ae=/\[[^\]]+\]\(([^)]+)\)/g;let he;for(;he=ae.exec(W);)try{he?.[1]&&Y.push(he[1])}catch{}const ie=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;he=ie.exec(W);)try{he?.[1]&&Y.push(he[1])}catch{}for(const R of Y)try{if(!R)continue;if(R.indexOf("?")!==-1||R.indexOf("=")!==-1)try{const M=new URL(R,o).searchParams.get("page");if(M){const T=String(M);!h.has(T)&&!y.has(T)&&(y.add(T),d.push({loc:o+"?page="+encodeURIComponent(T),slug:T}));continue}}catch{}let N=String(R).split(/[?#]/)[0];if(N=N.replace(/^\.\//,"").replace(/^\//,""),!N||!/\.(md|html?)$/i.test(N))continue;try{const M=re(N);if(be?.has?.(M)){const T=be?.get?.(M),I=String(T).split("::")[0];T&&!h.has(T)&&!y.has(T)&&!c.has(I)&&!l.has(M)&&(y.add(T),d.push({loc:o+"?page="+encodeURIComponent(T),slug:T,sourcePath:M}));continue}try{if(!m(M))continue;const T=await Ke(M,e?.contentBase?e.contentBase:void 0);if(T&&typeof T.status=="number"&&T.status===404)continue;if(T&&T.raw){const I=(T.raw||"").match(/^#\s+(.+)$/m),Q=I&&I[1]?I[1].trim():"",q=Se(Q||M),ne=String(q).split("::")[0];q&&!h.has(q)&&!y.has(q)&&!c.has(ne)&&(y.add(q),d.push({loc:o+"?page="+encodeURIComponent(q),slug:q,sourcePath:M,title:Q||void 0}))}}catch{}}catch{}}catch{}}catch{}}}catch{}try{const y=new Map;let h=0;for(const b of d){try{h++,await Sn(h,128)}catch{}try{if(!b||!b.slug)continue;y.set(String(b.slug),b)}catch{}}const w=new Set;for(const b of d)try{if(!b||!b.slug)continue;const S=String(b.slug),A=S.split("::")[0];if(!A)continue;S!==A&&!y.has(A)&&w.add(A)}catch{}for(const b of w)try{let S=null;if(f.has(b)){const A=f.get(b);S={loc:o+"?page="+encodeURIComponent(b),slug:b},A?.title&&(S.title=A.title,S._titleSource="index"),A?.excerpt&&(S.excerpt=A.excerpt),A?.path&&(S.sourcePath=A.path),A?.lastmod&&(S.lastmod=A.lastmod),A?.image&&(S.image=A.image)}else if(g&&te?.has?.(b)){const A=te?.get?.(b);let z=null;if(typeof A=="string"?z=re(String(A)):A&&typeof A=="object"&&(z=re(String(A.default??""))),S={loc:o+"?page="+encodeURIComponent(b),slug:b},z&&g.has(z)){const U=g.get(z);U?.title&&(S.title=U.title,S._titleSource="path"),U?.excerpt&&(S.excerpt=U.excerpt),S.sourcePath=z,U?.lastmod&&(S.lastmod=U.lastmod),U?.image&&(S.image=U.image)}}S||(S={loc:o+"?page="+encodeURIComponent(b),slug:b,title:_o(b)},S._titleSource="humanize"),y.has(b)||(d.push(S),y.set(b,S))}catch{}}catch{}const p=[];try{const y=new Set;let h=0;for(const w of d){try{h++,await Sn(h,128)}catch{}try{if(!w||!w.slug)continue;const b=String(w.slug),S=String(b).split("::")[0];if(c.has(S)||b.indexOf("::")!==-1||y.has(b))continue;y.add(b),p.push(w)}catch{}}}catch{}try{try{ge(()=>"[runtimeSitemap] generateSitemapJson finalEntries.titleSource: "+JSON.stringify(p.map(y=>({slug:y.slug,title:y.title,titleSource:y._titleSource||null})),null,2))}catch{}}catch{}try{let h=0;const w=p.length,b=Array.from({length:Math.min(4,w)}).map(async()=>{for(;;){const S=h++;if(S>=w)break;const A=p[S];try{if(!A||!A.slug)continue;const z=String(A.slug).split("::")[0];if(c.has(z)||A._titleSource==="index")continue;let U=null;try{if(te?.has?.(A.slug)){const W=te?.get?.(A.slug);typeof W=="string"?U=re(String(W)):W&&typeof W=="object"&&(U=re(String(W.default??"")))}!U&&A.sourcePath&&(U=A.sourcePath)}catch{continue}if(!U||l.has(U)||!m(U))continue;try{const W=await Ke(U,e?.contentBase?e.contentBase:void 0);if(!W||!W.raw||W&&typeof W.status=="number"&&W.status===404)continue;if(W&&W.raw){const Y=(W.raw||"").match(/^#\s+(.+)$/m),ae=Y&&Y[1]?Y[1].trim():"";ae&&(A.title=ae,A._titleSource="fetched")}}catch(W){ge("[runtimeSitemap] fetch title failed for",U,W)}}catch(z){ge("[runtimeSitemap] worker loop failure",z)}}});await Promise.all(b)}catch(y){ge("[runtimeSitemap] title enrichment failed",y)}return{generatedAt:new Date().toISOString(),entries:p}}function Ds(e){const t=Array.isArray(e?.entries)?e.entries:Array.isArray(e)?e:[];let n=`<?xml version="1.0" encoding="UTF-8"?>
`;n+=`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;for(const r of t)try{if(n+=`  <url>
`,n+=`    <loc>${Xe(String(r.loc??""))}</loc>
`,r.lastmod&&(n+=`    <lastmod>${Xe(String(r.lastmod))}</lastmod>
`),r.changefreq&&(n+=`    <changefreq>${Xe(String(r.changefreq))}</changefreq>
`),r.priority&&(n+=`    <priority>${Xe(String(r.priority))}</priority>
`),r.hreflang){const i=Array.isArray(r.hreflang)?r.hreflang:[r.hreflang];for(const s of i)n+=`    <xhtml:link rel="alternate" hreflang="${Xe(String(s.lang))}" href="${Xe(String(s.href))}" />
`}if(r.image){const i=qf(String(r.image));i&&(n+=`    <image:image>
`,n+=`      <image:loc>${Xe(i)}</image:loc>
`,n+=`    </image:image>
`)}n+=`  </url>
`}catch{}return n+=`</urlset>
`,n}function Bs(e){const t=Array.isArray(e?.entries)?e.entries:Array.isArray(e)?e:[],n=ua().split("?")[0];let r=`<?xml version="1.0" encoding="UTF-8"?>
`;r+=`<rss version="2.0">
`,r+=`<channel>
`,r+=`<title>${Xe("Sitemap RSS")}</title>
`,r+=`<link>${Xe(n)}</link>
`,r+=`<description>${Xe("RSS feed generated from site index")}</description>
`,r+=`<lastBuildDate>${Xe(e?.generatedAt?new Date(e.generatedAt).toUTCString():new Date().toUTCString())}</lastBuildDate>
`;for(const i of t)try{const s=String(i.loc??"");r+=`<item>
`,r+=`<title>${Xe(String(i.title||i.slug||(i.loc??"")))}</title>
`,i.excerpt&&(r+=`<description>${Xe(String(i.excerpt))}</description>
`),r+=`<link>${Xe(s)}</link>
`,r+=`<guid>${Xe(s)}</guid>
`,r+=`</item>
`}catch{}return r+=`</channel>
`,r+=`</rss>
`,r}function Us(e){const t=Array.isArray(e?.entries)?e.entries:Array.isArray(e)?e:[],n=ua().split("?")[0],r=e?.generatedAt?new Date(e.generatedAt).toISOString():new Date().toISOString();let i=`<?xml version="1.0" encoding="utf-8"?>
`;i+=`<feed xmlns="http://www.w3.org/2005/Atom">
`,i+=`<title>${Xe("Sitemap Atom")}</title>
`,i+=`<link href="${Xe(n)}" />
`,i+=`<updated>${Xe(r)}</updated>
`,i+=`<id>${Xe(n)}</id>
`;for(const s of t)try{const o=String(s.loc??""),a=s?.lastmod?new Date(s.lastmod).toISOString():r;i+=`<entry>
`,i+=`<title>${Xe(String(s.title||s.slug||(s.loc??"")))}</title>
`,s.excerpt&&(i+=`<summary>${Xe(String(s.excerpt))}</summary>
`),i+=`<link href="${Xe(o)}" />
`,i+=`<id>${Xe(o)}</id>
`,i+=`<updated>${Xe(a)}</updated>
`,i+=`</entry>
`}catch{}return i+=`</feed>
`,i}function Df(e={}){const{sitemapUrl:t,disallow:n=[]}=e||{};let r=`User-agent: *
`;for(const i of n)r+=`Disallow: ${String(i)}
`;return typeof t=="string"&&t.trim()&&(r+=`Sitemap: ${String(t.trim())}
`),r}function Ll(){try{typeof window<"u"&&window.__nimbiSitemapWriteTimer&&(clearTimeout(window.__nimbiSitemapWriteTimer),window.__nimbiSitemapWriteTimer=null,window.__nimbiSitemapPendingWrite=null)}catch{}}function yo(e,t="application/xml"){try{try{document.open(t,"replace")}catch{try{document.open()}catch{}}document.write(e),document.close();try{if(typeof Blob<"u"&&typeof URL<"u"&&URL.createObjectURL){const n=new Blob([e],{type:t}),r=URL.createObjectURL(n);try{location.href=r}catch{try{window.open(r,"_self")}catch{}}setTimeout(()=>{try{URL.revokeObjectURL(r)}catch{}},5e3)}}catch{}}catch{try{try{const r=document.createElement("pre");try{r.textContent=Xe(e)}catch{try{r.textContent=String(e)}catch{}}if(document&&document.body)try{if(typeof document.body.replaceChildren=="function")document.body.replaceChildren(r);else{for(;document.body.firstChild;)document.body.removeChild(document.body.firstChild);document.body.appendChild(r)}}catch{try{document.body.innerHTML="<pre>"+Xe(e)+"</pre>"}catch{}}}catch{}}catch{}}}function bo(e){try{const t=Array.isArray(e?.entries)?e.entries:Array.isArray(e)?e:[];let n='<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Sitemap</title></head><body>';n+="<h1>Sitemap</h1><ul>";for(const r of t)try{n+=`<li><a href="${Xe(String(r&&r.loc?r.loc:""))}">${Xe(String(r&&(r.title||r.slug)||r&&r.loc||""))}</a></li>`}catch{}return n+="</ul></body></html>",n}catch{return"<!doctype html><html><body><pre>failed to render sitemap</pre></body></html>"}}function yi(e,t="application/xml"){try{if(typeof window>"u"){try{let r=null;t==="application/rss+xml"?r=Bs(e):t==="application/atom+xml"?r=Us(e):t==="text/html"?r=bo(e):r=Ds(e),yo(r,t);try{typeof window<"u"&&(window.__nimbiSitemapRenderedAt=Date.now(),window.__nimbiSitemapJson=e,window.__nimbiSitemapFinal=e.entries||[])}catch{}}catch{}return}const n=Array.isArray(e?.entries)?e.entries.length:0;try{const r=window.__nimbiSitemapPendingWrite||null;(!r||typeof r.len=="number"&&r.len<n)&&(window.__nimbiSitemapPendingWrite={finalJson:e,mimeType:t,len:n}),window.__nimbiSitemapWriteTimer&&(clearTimeout(window.__nimbiSitemapWriteTimer),window.__nimbiSitemapWriteTimer=null),window.__nimbiSitemapWriteTimer=setTimeout(()=>{try{if(typeof window>"u")return;const i=window.__nimbiSitemapPendingWrite;if(!i)return;let s=null;i.mimeType==="application/rss+xml"?s=Bs(i.finalJson):i.mimeType==="application/atom+xml"?s=Us(i.finalJson):i.mimeType==="text/html"?s=bo(i.finalJson):s=Ds(i.finalJson);try{yo(s,i.mimeType)}catch{}try{window.__nimbiSitemapRenderedAt=Date.now(),window.__nimbiSitemapJson=i.finalJson,window.__nimbiSitemapFinal=i.finalJson.entries||[]}catch{}}catch{}try{typeof window<"u"&&clearTimeout(window.__nimbiSitemapWriteTimer)}catch{}try{typeof window<"u"&&(window.__nimbiSitemapWriteTimer=null,window.__nimbiSitemapPendingWrite=null)}catch{}},40)}catch{}try{window.__nimbiSitemapUnloadListenerAttached||(window.__nimbiSitemapUnloadListenerAttached=!0,window.addEventListener("beforeunload",Ll))}catch{}}catch{}}async function Vr(e={}){try{if(typeof document>"u"||typeof location>"u")return!1;let t=!1,n=!1,r=!1,i=!1;try{const u=new URLSearchParams(location.search||"");if(u.has("sitemap")){let d=!0;for(const f of u.keys())f!=="sitemap"&&(d=!1);d&&(t=!0)}if(u.has("rss")){let d=!0;for(const f of u.keys())f!=="rss"&&(d=!1);d&&(n=!0)}if(u.has("atom")){let d=!0;for(const f of u.keys())f!=="atom"&&(d=!1);d&&(r=!0)}}catch{}if(!t&&!n&&!r){const u=(location.pathname||"/").replace(/\/\/+/g,"/").split("/").filter(Boolean).pop()||"";if(!u||(t=/^(sitemap|sitemap\.xml)$/i.test(u),n=/^(rss|rss\.xml)$/i.test(u),r=/^(atom|atom\.xml)$/i.test(u),i=/^(sitemap|sitemap\.html)$/i.test(u),!t&&!n&&!r&&!i))return!1}let s=[];const o=typeof e.waitForIndexMs=="number"?e.waitForIndexMs:1/0;try{if(typeof xn=="function")try{const u=await xn({timeoutMs:o,contentBase:e?.contentBase,indexDepth:e?.indexDepth,noIndexing:e?.noIndexing,startBuild:!0});if(Array.isArray(u)&&u.length)if(Array.isArray(e.index)&&e.index.length){const d=new Map;try{for(const f of e.index)try{f?.slug&&d.set(String(f.slug),f)}catch{}for(const f of u)try{f?.slug&&d.set(String(f.slug),f)}catch{}}catch{}s=Array.from(d.values())}else s=u;else s=Array.isArray(e.index)&&e.index.length?e.index:Array.isArray(oe)&&oe.length?oe:[]}catch{s=Array.isArray(e.index)&&e.index.length?e.index:Array.isArray(oe)&&oe.length?oe:[]}else s=Array.isArray(oe)&&oe.length?oe:Array.isArray(e.index)&&e.index.length?e.index:[]}catch{s=Array.isArray(e.index)&&e.index.length?e.index:Array.isArray(oe)&&oe.length?oe:[]}try{if(Array.isArray(e.index)&&e.index.length)try{const u=new Map;for(const d of e.index)try{if(!d||!d.slug)continue;const f=String(d.slug).split("::")[0];if(!u.has(f))u.set(f,d);else{const g=u.get(f);g&&String(g.slug??"").indexOf("::")!==-1&&String(d.slug??"").indexOf("::")===-1&&u.set(f,d)}}catch{}try{ge(()=>"[runtimeSitemap] providedIndex.dedupedByBase: "+JSON.stringify(Array.from(u.values()),null,2))}catch{ge(()=>"[runtimeSitemap] providedIndex.dedupedByBase (count): "+String(u.size))}}catch(u){k("[runtimeSitemap] logging provided index failed",u)}}catch{}if((!Array.isArray(s)||!s.length)&&typeof Un=="function")try{const u=typeof e.waitForIndexMs=="number"?e.waitForIndexMs:1/0;let d=null;try{typeof xn=="function"&&(d=await xn({timeoutMs:u,contentBase:e?.contentBase,indexDepth:e?.indexDepth,noIndexing:e?.noIndexing,startBuild:!0}))}catch{d=null}if(Array.isArray(d)&&d.length)s=d;else{const f=typeof e.indexDepth=="number"?e.indexDepth:3,g=Array.isArray(e.noIndexing)?e.noIndexing:void 0,m=[];e?.homePage&&m.push(e.homePage),e?.navigationPage&&m.push(e.navigationPage),s=await Un(e?.contentBase,f,g,m.length?m:void 0)}}catch(u){k("[runtimeSitemap] rebuild index failed",u),s=Array.isArray(oe)&&oe.length?oe:[]}try{const u=Array.isArray(s)?s.length:0;try{ge(()=>"[runtimeSitemap] usedIndex.full.length (before rebuild): "+String(u))}catch{}try{ge(()=>"[runtimeSitemap] usedIndex.full (before rebuild): "+JSON.stringify(s,null,2))}catch{}}catch{}try{const u=[];e?.homePage&&u.push(e.homePage),e?.navigationPage&&u.push(e.navigationPage);const d=typeof e.indexDepth=="number"?e.indexDepth:3,f=Array.isArray(e.noIndexing)?e.noIndexing:void 0;let g=null;try{const m=typeof globalThis<"u"&&typeof globalThis.buildSearchIndexWorker=="function"?globalThis.buildSearchIndexWorker:void 0;if(typeof m=="function")try{g=await m(e?.contentBase,d,f)}catch{g=null}}catch{g=null}if((!g||!g.length)&&typeof Un=="function")try{g=await Un(e?.contentBase,d,f,u.length?u:void 0)}catch{g=null}if(Array.isArray(g)&&g.length){const m=new Map;try{for(const p of s)try{p?.slug&&m.set(String(p.slug),p)}catch{}for(const p of g)try{p?.slug&&m.set(String(p.slug),p)}catch{}}catch{}s=Array.from(m.values())}}catch(u){try{k("[runtimeSitemap] rebuild index call failed",u)}catch{}}try{const u=Array.isArray(s)?s.length:0;try{ge(()=>"[runtimeSitemap] usedIndex.full.length (after rebuild): "+String(u))}catch{}try{ge(()=>"[runtimeSitemap] usedIndex.full (after rebuild): "+JSON.stringify(s,null,2))}catch{}}catch{}const a=await Xi(Object.assign({},e,{index:s}));let l=[];try{const u=new Set,d=Array.isArray(a?.entries)?a.entries:[];for(const f of d)try{let g=null;if(f&&f.slug)g=String(f.slug);else if(f&&f.loc)try{g=new URL(String(f.loc)).searchParams.get("page")}catch{}if(!g)continue;const m=String(g).split("::")[0];if(!u.has(m)){u.add(m);const p=Object.assign({},f);p.baseSlug=m,l.push(p)}}catch{}try{ge(()=>"[runtimeSitemap] finalEntries.dedupedByBase: "+JSON.stringify(l,null,2))}catch{ge(()=>"[runtimeSitemap] finalEntries.dedupedByBase (count): "+String(l.length))}}catch{try{l=Array.isArray(a?.entries)?a.entries.slice(0):[]}catch{l=[]}}const c=Object.assign({},a||{},{entries:Array.isArray(l)?l:Array.isArray(a?.entries)?a.entries:[]});try{if(typeof window<"u")try{window.__nimbiSitemapJson=c,window.__nimbiSitemapFinal=l}catch{}}catch{}if(n){const u=Array.isArray(c?.entries)?c.entries.length:0;let d=-1;try{typeof window<"u"&&Array.isArray(window.__nimbiSitemapFinal)&&typeof window.__nimbiSitemapRenderedAt=="number"&&(d=window.__nimbiSitemapFinal.length)}catch{}if(d>u){try{ge("[runtimeSitemap] skip RSS write: existing rendered sitemap larger",d,u)}catch{}return!0}return yi(c,"application/rss+xml"),!0}if(r){const u=Array.isArray(c?.entries)?c.entries.length:0;let d=-1;try{typeof window<"u"&&Array.isArray(window.__nimbiSitemapFinal)&&typeof window.__nimbiSitemapRenderedAt=="number"&&(d=window.__nimbiSitemapFinal.length)}catch{}if(d>u){try{ge("[runtimeSitemap] skip Atom write: existing rendered sitemap larger",d,u)}catch{}return!0}return yi(c,"application/atom+xml"),!0}if(t){const u=Array.isArray(c?.entries)?c.entries.length:0;let d=-1;try{typeof window<"u"&&Array.isArray(window.__nimbiSitemapFinal)&&typeof window.__nimbiSitemapRenderedAt=="number"&&(d=window.__nimbiSitemapFinal.length)}catch{}if(d>u){try{ge("[runtimeSitemap] skip XML write: existing rendered sitemap larger",d,u)}catch{}return!0}return yi(c,"application/xml"),!0}if(i)try{const u=(Array.isArray(c?.entries)?c.entries:[]).length;let d=-1;try{typeof window<"u"&&Array.isArray(window.__nimbiSitemapFinal)&&typeof window.__nimbiSitemapRenderedAt=="number"&&(d=window.__nimbiSitemapFinal.length)}catch{}if(d>u){try{ge("[runtimeSitemap] skip HTML write: existing rendered sitemap larger",d,u)}catch{}return!0}return yi(c,"text/html"),!0}catch(u){return k("[runtimeSitemap] render HTML failed",u),!1}return!1}catch(t){return k("[runtimeSitemap] handleSitemapRequest failed",t),!1}}function Ws(e,t={}){try{if(!e||typeof document>"u")return null;const n=document.createElement("button");return n.type="button",n.className="button is-small is-light",n.textContent="Download sitemap",n.setAttribute("aria-label","Download sitemap JSON"),n.addEventListener("click",async()=>{try{const r=await Xi(),i=JSON.stringify(r,null,2),s=new Blob([i],{type:"application/json"}),o=URL.createObjectURL(s);try{const a=document.createElement("a");a.href=o,a.download=String(t?.filename||"sitemap.json").replace(/\\/g,"_").replace(/[^A-Za-z0-9_.-]/g,"_").replace(/^_+/,"").replace(/_+$/,"")||"sitemap.json",a.style.display="none",document.body.appendChild(a),a.click(),a.remove()}finally{setTimeout(()=>{try{URL.revokeObjectURL(o)}catch{}},0)}}catch(r){k("[runtimeSitemap] attachSitemapDownloadUI click failed",r)}}),e.appendChild(n),n}catch(n){return k("[runtimeSitemap] attachSitemapDownloadUI failed",n),null}}async function Fs(e={}){try{const t=typeof e.waitForIndexMs=="number"?e.waitForIndexMs:1/0;let n=[];try{if(typeof xn=="function")try{const o=await xn({timeoutMs:t,contentBase:e?.contentBase,indexDepth:e?.indexDepth,noIndexing:e?.noIndexing,startBuild:!0});Array.isArray(o)&&o.length&&(n=o)}catch{}}catch{}(!Array.isArray(n)||!n.length)&&Array.isArray(oe)&&oe.length&&(n=oe),(!Array.isArray(n)||!n.length)&&Array.isArray(e.index)&&e.index.length&&(n=e.index);const r=await Xi(Object.assign({},e,{index:n}));let i=[];try{const o=new Set,a=Array.isArray(r?.entries)?r.entries:[];for(const l of a)try{let c=null;if(l&&l.slug)c=String(l.slug);else if(l&&l.loc)try{c=new URL(String(l.loc)).searchParams.get("page")}catch{c=null}if(!c)continue;const u=String(c).split("::")[0];if(!o.has(u)){o.add(u);const d=Object.assign({},l);d.baseSlug=u,i.push(d)}}catch{}}catch{try{i=Array.isArray(r?.entries)?r.entries.slice(0):[]}catch{i=[]}}const s=Object.assign({},r||{},{entries:Array.isArray(i)?i:Array.isArray(r?.entries)?r.entries:[]});try{if(typeof window<"u")try{window.__nimbiSitemapJson=s,window.__nimbiSitemapFinal=i}catch{}}catch{}return{json:s,deduped:i}}catch{return null}}function Bf(e){try{if(!Array.isArray(e))return e;e.forEach(t=>{try{if(!t||typeof t!="object")return;let n=typeof t.slug=="string"?String(t.slug):"",r=null;if(n&&n.indexOf("::")!==-1){const a=n.split("::");n=a[0]||"",r=a.slice(1).join("::")||null}const i=!!(n&&(n.indexOf(".")!==-1||n.indexOf("/")!==-1));let s="";try{if(t.path&&typeof t.path=="string"){const a=re(String(t.path??""));if(s=findSlugForPath(a)||be?.get(a)||"",!s)if(t.title&&String(t.title).trim())s=Se(String(t.title).trim());else{const l=a.replace(/^.*\//,"").replace(/\.(?:md|html?)$/i,"");s=Se(l||a)}}else if(i){const a=String(n).replace(/\.(?:md|html?)$/i,""),l=findSlugForPath(a)||be?.get(a)||"";l?s=l:t.title&&String(t.title).trim()?s=Se(String(t.title).trim()):s=Se(a)}else!n&&t.title&&String(t.title).trim()?s=Se(String(t.title).trim()):s=n||""}catch{try{s=t.title&&String(t.title).trim()?Se(String(t.title).trim()):n?Se(n):""}catch{s=n}}let o=s||"";r&&(o=o?`${o}::${r}`:`${Se(r)}`),o&&(t.slug=o);try{if(t.path&&o){const a=String(o).split("::")[0];try{ft(a,re(String(t.path??"")))}catch{}}}catch{}}catch{}})}catch{}return e}async function Uf(e,t,n,r,i,s,o,a,l="eager",c=1,u=void 0,d="favicon",f){if(!e||!(e instanceof HTMLElement))throw new TypeError("navbarWrap must be an HTMLElement");const g=st(),m=g?g.parseFromString(n||"","text/html"):null,p=m?m.querySelectorAll("a"):[];await Ri(()=>pf(p,r)),await Ri(()=>mf(p,r));try{_e(p,r)}catch{}try{if(t&&t instanceof HTMLElement&&(!t.hasAttribute||!t.hasAttribute("role")))try{t.setAttribute("role","main")}catch{}}catch{}let y=null,h=null,w=null,b=null,S=null,A=null,z=null,U=!1,W=null;const Y=new Map,ae=(E,L,H,$)=>{f?E.addEventListener(L,H,{...$,signal:f}):E.addEventListener(L,H,$)};function he(){try{const E=typeof M<"u"&&M&&M.querySelector?M.querySelector(".navbar-burger"):e&&e.querySelector?e.querySelector(".navbar-burger"):typeof document<"u"?document.querySelector(".navbar-burger"):null,L=E?.dataset?.target??null,H=L?typeof M<"u"&&M&&M.querySelector?M.querySelector(`#${L}`)||document.getElementById(L):e&&e.querySelector?e.querySelector(`#${L}`):typeof document<"u"?document.getElementById(L):null:null;if(E?.classList?.contains("is-active")){try{E.classList.remove("is-active")}catch{}try{E.setAttribute("aria-expanded","false")}catch{}if(H?.classList)try{H.classList.remove("is-active")}catch{}}}catch(E){k("[nimbi-cms] closeMobileMenu failed",E)}}async function ie(){const E=t&&t instanceof HTMLElement?t:typeof document<"u"?document.querySelector(".nimbi-content"):null;try{E&&E.classList.add("is-inactive")}catch{}try{const L=o?.();L&&typeof L.then=="function"&&await L}catch(L){try{k("[nimbi-cms] renderByQuery failed",L)}catch{}}finally{try{if(typeof requestAnimationFrame=="function")requestAnimationFrame(()=>{try{E&&E.classList.remove("is-inactive")}catch{}});else try{E&&E.classList.remove("is-inactive")}catch{}}catch{try{E&&E.classList.remove("is-inactive")}catch{}}}}function R(E){try{let L=E&&typeof E.slug=="string"?String(E.slug):"",H=null;try{L&&L.indexOf("::")!==-1&&(H=L.split("::").slice(1).join("::")||null)}catch{}try{if(E&&E.path&&typeof E.path=="string"){const $=re(String(E.path??"")),P=$.replace(/^.*\//,"");try{if(Y&&Y.has($))return{page:Y.get($),hash:H};if(Y&&Y.has(P))return{page:Y.get(P),hash:H}}catch{}try{if(be?.has?.($))return{page:be.get($),hash:H}}catch{}try{const D=le($);if(D)return{page:D,hash:H}}catch{}}}catch{}if(L&&L.indexOf("::")!==-1){const $=L.split("::");L=$[0]||"",H=$.slice(1).join("::")||null}if(L&&(L.includes(".")||L.includes("/"))){const $=re(E&&E.path?String(E.path):L),P=$.replace(/^.*\//,"");try{if(Y&&Y.has($))return{page:Y.get($),hash:H};if(Y&&Y.has(P))return{page:Y.get(P),hash:H}}catch{}try{let D=le($);if(!D)try{const O=String($??"").replace(/^\/+/,""),J=O.replace(/^.*\//,"");for(const[B,G]of te.entries())try{let V=null;if(typeof G=="string"?V=re(String(G??"")):G&&typeof G=="object"&&(G.default?V=re(String(G.default??"")):V=null),!V)continue;if(V===O||V.endsWith("/"+O)||O.endsWith("/"+V)||V.endsWith(J)||O.endsWith(J)){D=B;break}}catch{}}catch{}if(D)L=D;else try{const O=String(L).replace(/\.(?:md|html?)$/i,"");L=Se(O||$)}catch{L=Se($)}}catch{L=Se($)}}return!L&&E&&E.path&&(L=Se(re(String(E.path??"")))),{page:L,hash:H}}catch{return{page:E&&E.slug||"",hash:null}}}const N=()=>y||(y=(async()=>{try{const E=typeof globalThis<"u"?globalThis.buildSearchIndex:void 0,L=typeof globalThis<"u"?globalThis.buildSearchIndexWorker:void 0,H=typeof E=="function"?E:If,$=typeof L=="function"?L:Of,P=[];try{i&&P.push(i)}catch{}try{navigationPage&&P.push(navigationPage)}catch{}if(l==="lazy"&&typeof $=="function")try{const D=await $(r,c,u,P.length?P:void 0);if(D&&D.length){try{try{Cr(D)}catch{}}catch{}return D}}catch(D){k("[nimbi-cms] worker builder threw",D)}return typeof H=="function"?await H(r,c,u,P.length?P:void 0):[]}catch(E){return k("[nimbi-cms] buildSearchIndex failed",E),y=null,[]}finally{if(h){try{h.removeAttribute("disabled")}catch{}try{w&&w.classList.remove("is-loading")}catch{}}}})(),y.then(E=>{try{try{W=Array.isArray(E)?E:null}catch{W=null}try{Bf(E)}catch{}try{if(typeof window<"u"){try{(async()=>{try{try{try{Cr(Array.isArray(E)?E:[])}catch{}Object.defineProperty(window,"__nimbiResolvedIndex",{get(){return Array.isArray(oe)?oe:Array.isArray(W)?W:[]},enumerable:!0,configurable:!0})}catch{try{window.__nimbiResolvedIndex=Array.isArray(oe)?oe:Array.isArray(W)?W:[]}catch{}}}catch{try{window.__nimbiResolvedIndex=Array.isArray(oe)?oe:Array.isArray(W)?W:[]}catch{}}})()}catch{}try{window.__nimbi_contentBase=r}catch{}try{window.__nimbi_indexDepth=c}catch{}try{window.__nimbi_noIndexing=u}catch{}}}catch{}const L=String((h&&h.value)??"").trim().toLowerCase();if(!L||!Array.isArray(E)||!E.length)return;const H=E.filter(P=>P.title&&P.title.toLowerCase().includes(L)||P.excerpt&&P.excerpt.toLowerCase().includes(L));if(!H||!H.length)return;const $=typeof S<"u"&&S?S:typeof document<"u"?document.getElementById("nimbi-search-results"):null;if(!$)return;try{typeof $.replaceChildren=="function"?$.replaceChildren():$.innerHTML=""}catch{try{$.innerHTML=""}catch{}}try{const P=document.createElement("div");P.className="panel nimbi-search-panel",H.slice(0,10).forEach(D=>{try{if(D.parentTitle){const G=document.createElement("p");G.className="panel-heading nimbi-search-title nimbi-search-parent",G.textContent=D.parentTitle,P.appendChild(G)}const O=document.createElement("a");O.className="panel-block nimbi-search-result";const J=R(D);O.href=Fe(J.page,J.hash),O.setAttribute("role","button");try{if(D.path&&typeof D.path=="string")try{ft(J.page,D.path)}catch{}}catch{}const B=document.createElement("div");B.className="is-size-6 has-text-weight-semibold",B.textContent=D.title,O.appendChild(B),O.addEventListener("click",()=>{try{$.style.display="none"}catch{}}),P.appendChild(O)}catch{}}),Ti(()=>{try{$.appendChild(P)}catch{}});try{$.style.display="block"}catch{}}catch{}}catch{}}).catch(()=>{}).finally(()=>{(async()=>{try{if(U)return;U=!0;try{await Vr({homePage:i,contentBase:r,indexDepth:c,noIndexing:u,includeAllMarkdown:!0})}catch(E){k("[nimbi-cms] sitemap trigger failed",E)}}catch(E){try{k("[nimbi-cms] sitemap dynamic import failed",E)}catch{}}})()}),y),M=document.createElement("nav");M.className="navbar",M.setAttribute("role","navigation"),M.setAttribute("aria-label","main navigation");const T=document.createElement("div");T.className="navbar-brand";const I=p[0],Q=document.createElement("a");if(Q.className="navbar-item",I){const E=I?.getAttribute?.("href")||"#";try{const L=new URL(E,location.href).searchParams.get("page"),H=L?decodeURIComponent(L):i;let $=null;try{typeof H=="string"&&(/(?:\.md|\.html?)$/i.test(H)||H.includes("/"))&&($=le(H))}catch{}!$&&typeof H=="string"&&!String(H).includes(".")&&($=H),Q.href=Fe($||H),(!Q.textContent||!String(Q.textContent).trim())&&(Q.textContent=s("home"))}catch{try{const H=typeof i=="string"&&(/(?:\.md|\.html?)$/i.test(i)||i.includes("/"))?le(i):typeof i=="string"&&!i.includes(".")?i:null;Q.href=Fe(H||i)}catch{Q.href=Fe(i)}Q.textContent=s("home")}}else Q.href=Fe(i),Q.textContent=s("home");async function q(E){try{if(!E||E==="none")return null;if(E==="favicon")try{const L=document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');if(!L)return null;const H=L?.getAttribute?.("href")||"";return H&&/\.png(?:\?|$)/i.test(H)?new URL(H,location.href).toString():null}catch{return null}if(E==="copy-first"||E==="move-first")try{const L=await Ke(i,r);if(!L||!L.raw)return null;const H=st(),$=H?H.parseFromString(L.raw,"text/html"):null,P=$?$.querySelector("img"):null;if(!P)return null;const D=P?.getAttribute?.("src")||"";if(!D)return null;const O=new URL(D,location.href).toString();if(E==="move-first")try{document.documentElement.setAttribute("data-nimbi-logo-moved",O)}catch{}return O}catch{return null}try{return new URL(E,location.href).toString()}catch{return null}}catch{return null}}let ne=null;try{ne=await q(d)}catch{ne=null}if(ne)try{const E=document.createElement("img");E.className="nimbi-navbar-logo";const L=s&&typeof s=="function"&&(s("home")||s("siteLogo"))||"";E.alt=L,E.title=L,E.src=ne;try{E.style.marginRight="0.5em"}catch{}try{(!Q.textContent||!String(Q.textContent).trim())&&(Q.textContent=L)}catch{}try{Q.insertBefore(E,Q.firstChild)}catch{try{Q.appendChild(E)}catch{}}}catch{}T.appendChild(Q),Q.addEventListener("click",function(E){const L=Q.getAttribute("href")||"";if(L.startsWith("?page=")){E.preventDefault();const H=new URL(L,location.href),$=H.searchParams.get("page"),P=H.hash?H.hash.replace(/^#/,""):null;history.pushState({page:$},"",Fe($,P)),ie();try{he()}catch{}}});function le(E){try{if(!E)return null;const L=re(String(E??""));try{if(be?.has?.(L))return be.get(L)}catch{}const H=L.replace(/^.*\//,"");try{if(be?.has?.(H))return be.get(H)}catch{}try{for(const[$,P]of te.entries())if(P){if(typeof P=="string"){if(re(P)===L)return $}else if(P&&typeof P=="object"){if(P.default&&re(P.default)===L)return $;const D=P.langs||{};for(const O in D)if(D[O]&&re(D[O])===L)return $}}}catch{}return null}catch{return null}}async function _e(E,L){try{if(!E||!E.length)return;const H=[];for(let J=0;J<E.length;J++)try{const B=E[J];if(!B||typeof B.getAttribute!="function")continue;const G=B.getAttribute("href")||"";if(!G||Pi(G))continue;let V=null;try{const Ee=_t(G);Ee&&Ee.page&&(V=Ee.page)}catch{}if(!V){const Ee=String(G??"").split(/[?#]/,1),He=Ee&&Ee[0]?Ee[0]:G;(/\.(?:md|html?)$/i.test(He)||He.indexOf("/")!==-1)&&(V=re(String(He??"")))}if(!V)continue;try{if(L&&typeof L=="string")try{let Ee=new URL(L,typeof location<"u"?location.origin:"http://localhost").pathname||"";if(Ee=Ee.replace(/^\/+|\/+$/g,""),Ee){let He=String(V??"");He=He.replace(/^\/+/,""),He===Ee?V="":He.startsWith(Ee+"/")?V=He.slice(Ee.length+1):V=He}}catch{}}catch{}const se=re(String(V??"")),me=se.replace(/^.*\//,"");let Ce=null;try{Y&&Y.has(se)&&(Ce=Y.get(se))}catch{}try{!Ce&&be?.has?.(se)&&(Ce=be.get(se))}catch{}if(Ce)continue;let Re=null;try{Re=B.textContent&&String(B.textContent).trim()?String(B.textContent).trim():null}catch{Re=null}let Ie=null;if(Re)Ie=Se(Re);else{const Ee=me.replace(/\.(?:md|html?)$/i,"");Ie=Se(Ee||se)}if(Ie)try{H.push({path:se,candidate:Ie})}catch{}}catch{}if(!H.length)return;const $=3;let P=0;const D=async()=>{for(;P<H.length;){const J=H[P++];if(!(!J||!J.path))try{const B=await Ke(J.path,L);if(!B||!B.raw)continue;let G=null;if(B.isHtml)try{const V=st(),se=V?V.parseFromString(B.raw,"text/html"):null,me=se?se.querySelector("h1")||se.querySelector("title"):null;me&&me.textContent&&(G=String(me.textContent).trim())}catch{}else try{const V=B.raw.match(/^#\s+(.+)$/m);V&&V[1]&&(G=String(V[1]).trim())}catch{}if(G){const V=Se(G);if(V&&V!==J.candidate){try{ft(V,J.path)}catch{}try{Y.set(J.path,V)}catch{}try{Y.set(J.path.replace(/^.*\//,""),V)}catch{}try{try{if(Array.isArray(oe)){let se=!1;for(const me of oe)try{if(me&&me.path===J.path&&me.slug){const Ce=String(me.slug).split("::").slice(1).join("::");me.slug=Ce?`${V}::${Ce}`:V,se=!0}}catch{}try{se&&Cr(oe)}catch{}}}catch{}}catch{}}}}catch{}}},O=[];for(let J=0;J<$;J++)O.push(D());try{await Promise.all(O)}catch{}}catch{}}const fe=document.createElement("a");fe.className="navbar-burger",fe.setAttribute("role","button"),fe.setAttribute("aria-label","menu"),fe.setAttribute("aria-expanded","false");const xe="nimbi-navbar-menu";fe.dataset.target=xe,fe.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>',T.appendChild(fe);try{fe.addEventListener("click",E=>{try{const L=fe.dataset&&fe.dataset.target?fe.dataset.target:null,H=L?M&&M.querySelector?M.querySelector(`#${L}`)||(e&&e.querySelector?e.querySelector(`#${L}`):document.getElementById(L)):e&&e.querySelector?e.querySelector(`#${L}`)||document.getElementById(L):typeof document<"u"?document.getElementById(L):null:null;fe.classList.contains("is-active")?(fe.classList.remove("is-active"),fe.setAttribute("aria-expanded","false"),H&&H.classList.remove("is-active")):(fe.classList.add("is-active"),fe.setAttribute("aria-expanded","true"),H&&H.classList.add("is-active"))}catch(L){k("[nimbi-cms] navbar burger toggle failed",L)}})}catch(E){k("[nimbi-cms] burger event binding failed",E)}const $e=document.createElement("div");$e.className="navbar-menu",$e.id=xe;const ce=document.createElement("div");ce.className="navbar-start";let De=null,et=null;if(!a)De=null,h=null,b=null,S=null,A=null;else{De=document.createElement("div"),De.className="navbar-end",et=document.createElement("div"),et.className="navbar-item",h=document.createElement("input"),h.className="input",h.type="search",h.placeholder=s("searchPlaceholder")||"",h.id="nimbi-search";try{const $=(s&&typeof s=="function"?s("searchAria"):null)||h.placeholder||"Search";try{h.setAttribute("aria-label",$)}catch{}try{h.setAttribute("aria-controls","nimbi-search-results")}catch{}try{h.setAttribute("aria-autocomplete","list")}catch{}try{h.setAttribute("role","combobox")}catch{}}catch{}l==="eager"&&(h.disabled=!0),w=document.createElement("div"),w.className="control",l==="eager"&&w.classList.add("is-loading"),w.setAttribute("aria-live","polite"),w.appendChild(h),et.appendChild(w),b=document.createElement("div"),b.className="dropdown is-right",b.id="nimbi-search-dropdown";const E=document.createElement("div");E.className="dropdown-trigger",E.setAttribute("aria-expanded","false"),E.appendChild(et);const L=document.createElement("div");L.className="dropdown-menu",L.setAttribute("role","menu"),S=document.createElement("div"),S.id="nimbi-search-results",S.className="dropdown-content nimbi-search-results",S.setAttribute("role","listbox"),S.setAttribute("aria-hidden","true"),S.setAttribute("aria-live","polite"),S.setAttribute("aria-relevant","all"),A=S,L.appendChild(S),b.appendChild(E),b.appendChild(L),De.appendChild(b);const H=$=>{if(!S)return;try{if(typeof S.replaceChildren=="function")S.replaceChildren();else for(;S.firstChild;)S.removeChild(S.firstChild)}catch{try{S.innerHTML=""}catch{}}let P=-1;function D(B){try{const G=S.querySelector(".nimbi-search-result.is-selected");G&&G.classList.remove("is-selected");const V=S.querySelectorAll(".nimbi-search-result");if(!V||!V.length){P=-1;try{h&&h.removeAttribute("aria-activedescendant")}catch{}return}if(B<0){P=-1;try{h&&h.removeAttribute("aria-activedescendant")}catch{}return}B>=V.length&&(B=V.length-1);const se=V[B];if(se){se.classList.add("is-selected"),P=B;try{se.scrollIntoView({block:"nearest"})}catch{}try{h&&se.id&&h.setAttribute("aria-activedescendant",se.id)}catch{}}}catch{}}function O(B){try{const G=B.key,V=S.querySelectorAll(".nimbi-search-result");if(!V||!V.length)return;if(G==="ArrowDown"){B.preventDefault(),D(P<0?0:Math.min(V.length-1,P+1));return}if(G==="ArrowUp"){B.preventDefault(),D(P<=0?0:P-1);return}if(G==="Enter"){B.preventDefault();const se=S.querySelector(".nimbi-search-result.is-selected")||S.querySelector(".nimbi-search-result");if(se)try{se.click()}catch{}return}if(G==="Escape"){try{b.classList.remove("is-active");try{E.setAttribute("aria-expanded","false")}catch{}}catch{}try{document.documentElement.classList.remove("nimbi-search-open")}catch{}try{S.style.display="none"}catch{}try{S.classList.remove("is-open")}catch{}try{S.removeAttribute("tabindex")}catch{}try{S.removeEventListener("keydown",O)}catch{}try{h&&h.focus()}catch{}try{h&&h.removeEventListener("keydown",J)}catch{}return}}catch{}}function J(B){try{if(B&&B.key==="ArrowDown"){B.preventDefault();try{S.focus()}catch{}D(0)}}catch{}}try{const B=String((h&&h.value)??"").trim();if(!$||!$.length){if(!B){try{b&&b.classList.remove("is-active")}catch{}try{document.documentElement.classList.remove("nimbi-search-open")}catch{}try{S&&(S.style.display="none",S.classList.remove("is-open"),S.removeAttribute("tabindex"))}catch{}try{S&&S.removeEventListener("keydown",O)}catch{}return}try{const G=document.createElement("div");G.className="panel nimbi-search-panel";const V=document.createElement("p");V.className="panel-block nimbi-search-no-results",V.textContent=s&&typeof s=="function"?s("searchNoResults"):"No results",G.appendChild(V),Ti(()=>{try{S.appendChild(G)}catch{}})}catch{}if(b){b.classList.add("is-active");try{E.setAttribute("aria-expanded","true")}catch{}try{document.documentElement.classList.add("nimbi-search-open")}catch{}}try{S.style.display="block"}catch{}try{S.classList.add("is-open")}catch{}try{S.setAttribute("aria-hidden","false")}catch{}try{S.setAttribute("tabindex","0")}catch{}return}}catch{}try{const B=document.createElement("div");B.className="panel nimbi-search-panel";const G=document.createDocumentFragment();$.forEach(V=>{if(V.parentTitle){const Re=document.createElement("p");Re.textContent=V.parentTitle,Re.className="panel-heading nimbi-search-title nimbi-search-parent",G.appendChild(Re)}const se=document.createElement("a");se.className="panel-block nimbi-search-result";const me=R(V);se.href=Fe(me.page,me.hash),se.setAttribute("role","button");try{if(V.path&&typeof V.path=="string")try{ft(me.page,V.path)}catch{}}catch{}const Ce=document.createElement("div");Ce.className="is-size-6 has-text-weight-semibold",Ce.textContent=V.title,se.appendChild(Ce),se.addEventListener("click",Re=>{try{try{Re&&Re.preventDefault&&Re.preventDefault()}catch{}try{Re&&Re.stopPropagation&&Re.stopPropagation()}catch{}if(b){b.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-search-open")}catch{}}try{S.style.display="none";try{S.setAttribute("aria-hidden","true")}catch{}}catch{}try{S.classList.remove("is-open")}catch{}try{S.removeAttribute("tabindex")}catch{}try{S.removeEventListener("keydown",O)}catch{}try{h&&h.removeEventListener("keydown",J)}catch{}try{const Ie=se.getAttribute&&se.getAttribute("href")||"";let Ee=null,He=null;try{const Be=new URL(Ie,location.href);Ee=Be.searchParams.get("page"),He=Be.hash?Be.hash.replace(/^#/,""):null}catch{}if(Ee)try{history.pushState({page:Ee},"",Fe(Ee,He));try{ie()}catch{try{typeof window<"u"&&typeof window.renderByQuery=="function"&&window.renderByQuery()}catch{}}return}catch{}}catch{}try{window.location.href=se.href}catch{}}catch{}}),G.appendChild(se)}),B.appendChild(G),Ti(()=>{try{S.appendChild(B)}catch{}})}catch{}if(b){b.classList.add("is-active");try{document.documentElement.classList.add("nimbi-search-open")}catch{}}try{S.style.display="block"}catch{}try{S.classList.add("is-open")}catch{}try{S.setAttribute("tabindex","0")}catch{}try{S.addEventListener("keydown",O)}catch{}try{h&&h.addEventListener("keydown",J)}catch{}};if(h){const $=sf(async()=>{const P=h||(typeof M<"u"&&M&&M.querySelector?M.querySelector("input#nimbi-search"):e&&e.querySelector?e.querySelector("input#nimbi-search"):typeof document<"u"?document.querySelector("input#nimbi-search"):null),D=String((P&&P.value)??"").trim().toLowerCase();if(!D){try{b&&b.classList.remove("is-active")}catch{}try{document.documentElement.classList.remove("nimbi-search-open")}catch{}try{S&&(S.style.display="none",S.classList.remove("is-open"),S.removeAttribute("tabindex"))}catch{}return}try{await N();let O=await y;(!Array.isArray(O)||!O.length)&&(Array.isArray(window.__nimbiSearchIndex)&&window.__nimbiSearchIndex.length?O=window.__nimbiSearchIndex:Array.isArray(window.__nimbiResolvedIndex)&&window.__nimbiResolvedIndex.length&&(O=window.__nimbiResolvedIndex));const J=Array.isArray(O)?O.filter(B=>B.title&&B.title.toLowerCase().includes(D)||B.excerpt&&B.excerpt.toLowerCase().includes(D)):[];H(J.slice(0,10))}catch(O){y=null,k("[nimbi-cms] search input handler failed",O),H([])}},50);try{h.addEventListener("input",$)}catch{}}if(l==="eager"){try{y=N()}catch($){k("[nimbi-cms] eager search index init failed",$),y=Promise.resolve([])}y.finally(()=>{const $=h||(typeof M<"u"&&M&&M.querySelector?M.querySelector("input#nimbi-search"):e&&e.querySelector?e.querySelector("input#nimbi-search"):typeof document<"u"?document.querySelector("input#nimbi-search"):null);if($){try{$.removeAttribute("disabled")}catch{}try{w&&w.classList.remove("is-loading")}catch{}}(async()=>{try{if(U)return;U=!0;const P=await y.catch(()=>[]);try{await Vr({index:Array.isArray(P)?P:void 0,homePage:i,contentBase:r,indexDepth:c,noIndexing:u,includeAllMarkdown:!0})}catch(D){k("[nimbi-cms] sitemap trigger failed",D)}}catch(P){try{k("[nimbi-cms] sitemap dynamic import failed",P)}catch{}}})()})}try{z=$=>{try{const P=$&&$.target;if(!A||!A.classList.contains("is-open")&&A.style&&A.style.display!=="block"||P&&(A.contains(P)||h&&(P===h||h.contains&&h.contains(P))))return;if(b){b.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-search-open")}catch{}}try{A.style.display="none"}catch{}try{A.classList.remove("is-open")}catch{}}catch{}},ae(document,"click",z,!0),ae(document,"touchstart",z,!0)}catch{}}const ot=document.createDocumentFragment();for(let E=0;E<p.length;E++){const L=p[E];if(E===0)continue;const H=L.getAttribute("href")||"#";let $=H;const P=document.createElement("a");P.className="navbar-item";try{let D=null;try{D=_t(String(H??""))}catch{D=null}let O=null,J=null;if(D&&(D.type==="canonical"&&D.page||D.type==="cosmetic"&&D.page)&&(O=D.page,J=D.anchor),O&&(/\.(?:md|html?)$/i.test(O)||O.includes("/")?$=O:P.href=Fe(O,J)),/^[^#]*\.md(?:$|[#?])/.test($)||$.endsWith(".md")){const B=re($).split(/::|#/,2),G=B[0],V=B[1],se=le(G);se?P.href=Fe(se,V):P.href=Fe(G,V)}else if(/\.html(?:$|[#?])/.test($)||$.endsWith(".html")){const B=re($).split(/::|#/,2);let G=B[0];G&&!G.toLowerCase().endsWith(".html")&&(G=G+".html");const V=B[1],se=le(G);if(se)P.href=Fe(se,V);else try{const me=await Ke(G,r);if(me&&me.raw)try{const Ce=st(),Re=Ce?Ce.parseFromString(me.raw,"text/html"):null,Ie=Re?Re.querySelector("title"):null,Ee=Re?Re.querySelector("h1"):null,He=Ie&&Ie.textContent&&Ie.textContent.trim()?Ie.textContent.trim():Ee&&Ee.textContent?Ee.textContent.trim():null;if(He){const Be=Se(He);if(Be){try{ft(Be,G)}catch(Wt){k("[nimbi-cms] slugToMd/mdToSlug set failed",Wt)}P.href=Fe(Be,V)}else P.href=Fe(G,V)}else P.href=Fe(G,V)}catch{P.href=Fe(G,V)}else P.href=$}catch{P.href=$}}else P.href=$}catch(D){k("[nimbi-cms] nav item href parse failed",D),P.href=$}try{const D=L.textContent&&String(L.textContent).trim()?String(L.textContent).trim():null;if(D)try{const O=Se(D);if(O){const J=P.getAttribute("href")||"";let B=null;if(/^[^#?]*\.(?:md|html?)(?:$|[?#])/i.test(J))B=re(String(J??"").split(/[?#]/)[0]);else try{const G=_t(J);G&&G.type==="canonical"&&G.page&&(B=re(G.page))}catch{}if(B){let G=!1;try{if(/\.(?:html?)(?:$|[?#])/i.test(String(B??"")))G=!0;else if(/\.(?:md)(?:$|[?#])/i.test(String(B??"")))G=!1;else{const V=String(B??"").replace(/^\.\//,""),se=V.replace(/^.*\//,"");Qe&&Qe.size&&(Qe.has(V)||Qe.has(se))&&(G=!0)}}catch{G=!1}if(G)try{const V=re(String(B??"").split(/[?#]/)[0]);let se=!1;try{le&&typeof le=="function"&&le(V)&&(se=!0)}catch{}try{ft(O,B)}catch{}try{if(V){try{Y.set(V,O)}catch{}try{const me=V.replace(/^.*\//,"");me&&Y.set(me,O)}catch{}}}catch{}if(se)try{P.href=Fe(O)}catch{}}catch{}}}}catch(O){k("[nimbi-cms] nav slug mapping failed",O)}}catch(D){k("[nimbi-cms] nav slug mapping failed",D)}P.textContent=L.textContent||$,ot.appendChild(P)}try{ce.appendChild(ot)}catch{}$e.appendChild(ce),De&&$e.appendChild(De),M.appendChild(T),M.appendChild($e),e.appendChild(M);try{const E=L=>{try{const H=typeof M<"u"&&M&&M.querySelector?M.querySelector(".navbar-burger"):e&&e.querySelector?e.querySelector(".navbar-burger"):typeof document<"u"?document.querySelector(".navbar-burger"):null;if(!H||!H.classList.contains("is-active"))return;const $=H&&H.closest?H.closest(".navbar"):M;if($&&$.contains(L.target))return;he()}catch{}};ae(document,"click",E,!0),ae(document,"touchstart",E,!0)}catch{}try{$e.addEventListener("click",E=>{const L=E.target&&E.target.closest?E.target.closest("a"):null;if(!L)return;const H=L.getAttribute("href")||"";try{const $=new URL(H,location.href),P=$.searchParams.get("page"),D=$.hash?$.hash.replace(/^#/,""):null;P&&(E.preventDefault(),history.pushState({page:P},"",Fe(P,D)),ie())}catch($){k("[nimbi-cms] navbar click handler failed",$)}try{const $=typeof M<"u"&&M&&M.querySelector?M.querySelector(".navbar-burger"):e&&e.querySelector?e.querySelector(".navbar-burger"):null,P=$&&$.dataset?$.dataset.target:null,D=P?M&&M.querySelector?M.querySelector(`#${P}`)||(e&&e.querySelector?e.querySelector(`#${P}`):document.getElementById(P)):e&&e.querySelector?e.querySelector(`#${P}`)||document.getElementById(P):typeof document<"u"?document.getElementById(P):null:null;$&&$.classList.contains("is-active")&&($.classList.remove("is-active"),$.setAttribute("aria-expanded","false"),D&&D.classList.remove("is-active"))}catch($){k("[nimbi-cms] mobile menu close failed",$)}})}catch(E){k("[nimbi-cms] attach content click handler failed",E)}try{t.addEventListener("click",E=>{const L=E.target&&E.target.closest?E.target.closest("a"):null;if(!L)return;const H=L.getAttribute("href")||"";if(H&&!Pi(H))try{const $=new URL(H,location.href),P=$.searchParams.get("page"),D=$.hash?$.hash.replace(/^#/,""):null;P&&(E.preventDefault(),history.pushState({page:P},"",Fe(P,D)),ie())}catch($){k("[nimbi-cms] container click URL parse failed",$)}})}catch(E){k("[nimbi-cms] build navbar failed",E)}return{navbar:M,linkEls:p}}try{document.addEventListener("input",e=>{try{if(e&&e.target&&e.target.id==="nimbi-search"){const t=document.getElementById("nimbi-search-results");if(t&&e.target&&e.target.value)try{t.style.display="block"}catch{}}}catch{}},!0)}catch{}var lt=null,Ae=null,ut=1,Yt=(e,t)=>t,qr=0,$r=0,Mi=()=>{},jr=.25;function Wf(){if(lt&&document.contains(lt))return lt;lt=null;const e=document.createElement("dialog");e.className="nimbi-image-preview modal",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-label",Yt("imagePreviewTitle","Image preview"));try{const T=document.createElement("div");T.className="modal-background";const I=document.createElement("div");I.className="modal-content";const Q=document.createElement("div");Q.className="nimbi-image-preview__content box",Q.setAttribute("role","document");const q=document.createElement("button");q.className="button is-small nimbi-image-preview__close",q.type="button",q.setAttribute("data-nimbi-preview-close",""),q.textContent="✕",q.setAttribute("aria-hidden","true");const ne=document.createElement("div");ne.className="nimbi-image-preview__image-wrapper";const le=document.createElement("img");le.setAttribute("data-nimbi-preview-image",""),le.alt="",ne.appendChild(le);const _e=document.createElement("div");_e.className="nimbi-image-preview__controls";const fe=document.createElement("div");fe.className="nimbi-image-preview__group";const xe=document.createElement("button");xe.className="button is-small",xe.type="button",xe.setAttribute("data-nimbi-preview-fit",""),xe.textContent="⤢",xe.setAttribute("aria-hidden","true");const $e=document.createElement("button");$e.className="button is-small",$e.type="button",$e.setAttribute("data-nimbi-preview-original",""),$e.textContent="1:1",$e.setAttribute("aria-hidden","true");const ce=document.createElement("button");ce.className="button is-small",ce.type="button",ce.setAttribute("data-nimbi-preview-reset",""),ce.textContent="⟲",ce.setAttribute("aria-hidden","true"),fe.appendChild(xe),fe.appendChild($e),fe.appendChild(ce);const De=document.createElement("div");De.className="nimbi-image-preview__group";const et=document.createElement("button");et.className="button is-small",et.type="button",et.setAttribute("data-nimbi-preview-zoom-out",""),et.textContent="−",et.setAttribute("aria-hidden","true");const ot=document.createElement("div");ot.className="nimbi-image-preview__zoom",ot.setAttribute("data-nimbi-preview-zoom-label",""),ot.textContent="100%";const E=document.createElement("button");E.className="button is-small",E.type="button",E.setAttribute("data-nimbi-preview-zoom-in",""),E.textContent="＋",E.setAttribute("aria-hidden","true"),De.appendChild(et),De.appendChild(ot),De.appendChild(E),_e.appendChild(fe),_e.appendChild(De),Q.appendChild(q),Q.appendChild(ne),Q.appendChild(_e),I.appendChild(Q),e.appendChild(T),e.appendChild(I)}catch{e.innerHTML=`
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="nimbi-image-preview__content box" role="document">
          <button class="button is-small nimbi-image-preview__close" type="button" data-nimbi-preview-close aria-hidden="true">✕</button>
          <div class="nimbi-image-preview__image-wrapper">
            <img data-nimbi-preview-image alt="" />
          </div>
          <div class="nimbi-image-preview__controls">
            <div class="nimbi-image-preview__group">
              <button class="button is-small" type="button" data-nimbi-preview-fit aria-hidden="true">⤢</button>
              <button class="button is-small" type="button" data-nimbi-preview-original aria-hidden="true">1:1</button>
              <button class="button is-small" type="button" data-nimbi-preview-reset aria-hidden="true">⟲</button>
            </div>
            <div class="nimbi-image-preview__group">
              <button class="button is-small" type="button" data-nimbi-preview-zoom-out aria-hidden="true">−</button>
              <div class="nimbi-image-preview__zoom" data-nimbi-preview-zoom-label>100%</div>
              <button class="button is-small" type="button" data-nimbi-preview-zoom-in aria-hidden="true">＋</button>
            </div>
          </div>
        </div>
      </div>
    `}e.addEventListener("click",T=>{T.target===e&&ys()}),e.addEventListener("wheel",T=>{if(!ae())return;T.preventDefault();const I=T.deltaY<0?jr:-jr;an(ut+I),c(),u()},{passive:!1}),e.addEventListener("keydown",T=>{if(T.key==="Escape"){ys();return}if(ut>1){const I=e.querySelector(".nimbi-image-preview__image-wrapper");if(!I)return;const Q=40;switch(T.key){case"ArrowUp":I.scrollTop-=Q,T.preventDefault();break;case"ArrowDown":I.scrollTop+=Q,T.preventDefault();break;case"ArrowLeft":I.scrollLeft-=Q,T.preventDefault();break;case"ArrowRight":I.scrollLeft+=Q,T.preventDefault()}}}),document.body.appendChild(e),lt=e,Ae=e.querySelector("[data-nimbi-preview-image]");const t=e.querySelector("[data-nimbi-preview-fit]"),n=e.querySelector("[data-nimbi-preview-original]"),r=e.querySelector("[data-nimbi-preview-zoom-in]"),i=e.querySelector("[data-nimbi-preview-zoom-out]"),s=e.querySelector("[data-nimbi-preview-reset]"),o=e.querySelector("[data-nimbi-preview-close]"),a=e.querySelector("[data-nimbi-preview-zoom-label]"),l=e.querySelector("[data-nimbi-preview-zoom-hud]");function c(){a&&(a.textContent=`${Math.round(ut*100)}%`)}const u=()=>{l&&(l.textContent=`${Math.round(ut*100)}%`,l.classList.add("visible"),clearTimeout(l._timeout),l._timeout=setTimeout(()=>l.classList.remove("visible"),800))};Mi=c,r.addEventListener("click",()=>{an(ut+jr),c(),u()}),i.addEventListener("click",()=>{an(ut-jr),c(),u()}),t.addEventListener("click",()=>{Dr(),c(),u()}),n.addEventListener("click",()=>{an(1),c(),u()}),s.addEventListener("click",()=>{Dr(),c(),u()}),o.addEventListener("click",ys),t.title=Yt("imagePreviewFit","Fit to screen"),n.title=Yt("imagePreviewOriginal","Original size"),i.title=Yt("imagePreviewZoomOut","Zoom out"),r.title=Yt("imagePreviewZoomIn","Zoom in"),o.title=Yt("imagePreviewClose","Close"),o.setAttribute("aria-label",Yt("imagePreviewClose","Close"));let d=!1,f=0,g=0,m=0,p=0;const y=new Map;let h=0,w=1;const b=(T,I)=>{const Q=T.x-I.x,q=T.y-I.y;return Math.hypot(Q,q)},S=()=>{d=!1,y.clear(),h=0,Ae&&(Ae.classList.add("is-panning"),Ae.classList.remove("is-grabbing"))};let A=0,z=0,U=0;const W=T=>{const I=Date.now(),Q=I-A,q=T.clientX-z,ne=T.clientY-U;A=I,z=T.clientX,U=T.clientY,Q<300&&Math.hypot(q,ne)<30&&(an(ut>1?1:2),c(),T.preventDefault())},Y=T=>{an(ut>1?1:2),c(),T.preventDefault()},ae=()=>lt?typeof lt.open=="boolean"?lt.open:lt.classList.contains("is-active"):!1,he=(T,I,Q=1)=>{if(y.has(Q)&&y.set(Q,{x:T,y:I}),y.size===2){const _e=Array.from(y.values()),fe=b(_e[0],_e[1]);if(h>0){const xe=fe/h;an(w*xe)}return}if(!d)return;const q=Ae.closest(".nimbi-image-preview__image-wrapper");if(!q)return;const ne=T-f,le=I-g;q.scrollLeft=m-ne,q.scrollTop=p-le},ie=(T,I,Q=1)=>{if(!ae())return;if(y.set(Q,{x:T,y:I}),y.size===2){const ne=Array.from(y.values());h=b(ne[0],ne[1]),w=ut;return}const q=Ae.closest(".nimbi-image-preview__image-wrapper");q&&(q.scrollWidth>q.clientWidth||q.scrollHeight>q.clientHeight)&&(d=!0,f=T,g=I,m=q.scrollLeft,p=q.scrollTop,Ae.classList.add("is-panning"),Ae.classList.remove("is-grabbing"),window.addEventListener("pointermove",R),window.addEventListener("pointerup",N),window.addEventListener("pointercancel",N))},R=T=>{d&&(T.preventDefault(),he(T.clientX,T.clientY,T.pointerId))},N=()=>{S(),window.removeEventListener("pointermove",R),window.removeEventListener("pointerup",N),window.removeEventListener("pointercancel",N)};Ae.addEventListener("pointerdown",T=>{T.preventDefault(),ie(T.clientX,T.clientY,T.pointerId)}),Ae.addEventListener("pointermove",T=>{(d||y.size===2)&&T.preventDefault(),he(T.clientX,T.clientY,T.pointerId)}),Ae.addEventListener("pointerup",T=>{T.preventDefault(),T.pointerType==="touch"&&W(T),S()}),Ae.addEventListener("dblclick",Y),Ae.addEventListener("pointercancel",S),Ae.addEventListener("mousedown",T=>{T.preventDefault(),ie(T.clientX,T.clientY,1)}),Ae.addEventListener("mousemove",T=>{d&&T.preventDefault(),he(T.clientX,T.clientY,1)}),Ae.addEventListener("mouseup",T=>{T.preventDefault(),S()});const M=e.querySelector(".nimbi-image-preview__image-wrapper");return M&&(M.addEventListener("pointerdown",T=>{if(ie(T.clientX,T.clientY,T.pointerId),T?.target?.tagName==="IMG")try{T.target.classList.add("is-grabbing")}catch{}}),M.addEventListener("pointermove",T=>{he(T.clientX,T.clientY,T.pointerId)}),M.addEventListener("pointerup",S),M.addEventListener("pointercancel",S),M.addEventListener("mousedown",T=>{if(ie(T.clientX,T.clientY,1),T?.target?.tagName==="IMG")try{T.target.classList.add("is-grabbing")}catch{}}),M.addEventListener("mousemove",T=>{he(T.clientX,T.clientY,1)}),M.addEventListener("mouseup",S)),e}function an(e){if(!Ae)return;const t=Number(e);ut=Number.isFinite(t)?Math.max(.1,Math.min(4,t)):1;const n=Ae.getBoundingClientRect(),r=qr||Ae.naturalWidth||Ae.width||n.width||0,i=$r||Ae.naturalHeight||Ae.height||n.height||0;if(r&&i){Ae.style.setProperty("--nimbi-preview-img-max-width","none"),Ae.style.setProperty("--nimbi-preview-img-max-height","none"),Ae.style.setProperty("--nimbi-preview-img-width",`${r*ut}px`),Ae.style.setProperty("--nimbi-preview-img-height",`${i*ut}px`),Ae.style.setProperty("--nimbi-preview-img-transform","none");try{Ae.style.width=`${r*ut}px`,Ae.style.height=`${i*ut}px`,Ae.style.transform="none"}catch{}}else{Ae.style.setProperty("--nimbi-preview-img-max-width",""),Ae.style.setProperty("--nimbi-preview-img-max-height",""),Ae.style.setProperty("--nimbi-preview-img-width",""),Ae.style.setProperty("--nimbi-preview-img-height",""),Ae.style.setProperty("--nimbi-preview-img-transform",`scale(${ut})`);try{Ae.style.transform=`scale(${ut})`}catch{}}Ae&&(Ae.classList.add("is-panning"),Ae.classList.remove("is-grabbing"))}function Dr(){if(!Ae)return;const e=Ae.closest(".nimbi-image-preview__image-wrapper");if(!e)return;const t=e.getBoundingClientRect();if(t.width===0||t.height===0)return;const n=qr||Ae.naturalWidth||t.width,r=$r||Ae.naturalHeight||t.height;if(!n||!r)return;const i=t.width/n,s=t.height/r,o=Math.min(i,s,1);an(Number.isFinite(o)?o:1)}function Ff(e,t="",n=0,r=0){const i=Wf();ut=1,qr=n||0,$r=r||0,Ae.src=e;try{if(!t)try{const o=new URL(e,typeof location<"u"?location.href:"").pathname||"",a=(o.substring(o.lastIndexOf("/")+1)||e).replace(/\.[^/.]+$/,"").replace(/[-_]+/g," ");t=Yt("imagePreviewDefaultAlt",a||"Image")}catch{t=Yt("imagePreviewDefaultAlt","Image")}}catch{}Ae.alt=t,Ae.style.transform="scale(1)";const s=()=>{qr=Ae.naturalWidth||Ae.width||0,$r=Ae.naturalHeight||Ae.height||0};if(s(),Dr(),Mi(),requestAnimationFrame(()=>{Dr(),Mi()}),!qr||!$r){const o=()=>{s(),requestAnimationFrame(()=>{Dr(),Mi()}),Ae.removeEventListener("load",o)};Ae.addEventListener("load",o)}typeof i.showModal=="function"&&(i.open||i.showModal()),i.classList.add("is-active");try{document.documentElement.classList.add("nimbi-image-preview-open")}catch{}i.focus();try{const o=i.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');if(o.length){const a=o[0],l=o[o.length-1],c=u=>{try{if(u.key!=="Tab")return;u.shiftKey?document.activeElement===a&&(u.preventDefault(),l.focus()):document.activeElement===l&&(u.preventDefault(),a.focus())}catch{}};i.addEventListener("keydown",c),i._focusTrapHandler=c}}catch{}}function ys(){if(lt){typeof lt.close=="function"&&lt.open&&lt.close(),lt.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-image-preview-open")}catch{}try{lt._focusTrapHandler&&(lt.removeEventListener("keydown",lt._focusTrapHandler),lt._focusTrapHandler=null)}catch{}}}function Hf(e,{t,zoomStep:n=.25}={}){if(!e||!e.querySelectorAll)return;Yt=(g,m)=>(typeof t=="function"?t(g):void 0)||m,jr=n,e.addEventListener("click",g=>{const m=g.target;if(!m||m.tagName!=="IMG")return;const p=m;p.src&&(p.closest("a")?.getAttribute?.("href")||Ff(p.src,p.alt||"",p.naturalWidth||0,p.naturalHeight||0))});let r=!1,i=0,s=0,o=0,a=0;const l=new Map;let c=0,u=1;const d=(g,m)=>{const p=g.x-m.x,y=g.y-m.y;return Math.hypot(p,y)};e.addEventListener("pointerdown",g=>{const m=g.target;if(!m||m.tagName!=="IMG")return;const p=m.closest("a");if(p&&p.getAttribute("href")||!lt||!lt.open)return;if(l.set(g.pointerId,{x:g.clientX,y:g.clientY}),l.size===2){const h=Array.from(l.values());c=d(h[0],h[1]),u=ut;return}const y=m.closest(".nimbi-image-preview__image-wrapper");if(y&&!(ut<=1)){g.preventDefault(),r=!0,i=g.clientX,s=g.clientY,o=y.scrollLeft,a=y.scrollTop,m.setPointerCapture(g.pointerId);try{m.classList.add("is-grabbing")}catch{}}}),e.addEventListener("pointermove",g=>{if(l.has(g.pointerId)&&l.set(g.pointerId,{x:g.clientX,y:g.clientY}),l.size===2){g.preventDefault();const w=Array.from(l.values()),b=d(w[0],w[1]);if(c>0){const S=b/c;an(u*S)}return}if(!r)return;g.preventDefault();const m=g.target;if(m?.closest?.("a")?.getAttribute?.("href"))return;const p=m.closest(".nimbi-image-preview__image-wrapper");if(!p)return;const y=g.clientX-i,h=g.clientY-s;p.scrollLeft=o-y,p.scrollTop=a-h});const f=()=>{r=!1,l.clear(),c=0;try{const g=document.querySelector("[data-nimbi-preview-image]");g&&(g.classList.add("is-panning"),g.classList.remove("is-grabbing"))}catch{}};e.addEventListener("pointerup",f),e.addEventListener("pointercancel",f)}function Gf(e){const{contentWrap:t,navWrap:n,container:r,mountOverlay:i=null,t:s,contentBase:o,homePage:a,initialDocumentTitle:l,runHooks:c,allowEmbeddedScripts:u=!1,signal:d}=e||{};if(!t||!(t instanceof HTMLElement))throw new TypeError("contentWrap must be an HTMLElement");let f=null;const g={},m=hf(s,[{path:a,name:s("home"),isIndex:!0,children:[]}]),p=new Map,y=12;let h=!1,w=!1;function b(R){try{if(!R)return;if(typeof R.replaceChildren=="function")return R.replaceChildren();for(;R.firstChild;)R.removeChild(R.firstChild)}catch{try{R&&(R.innerHTML="")}catch{}}}function S(R){try{const N=String(R?.raw||""),M=N.length;return`${M}:${N.slice(0,120)}:${N.slice(Math.max(0,M-120))}`}catch{return"0::"}}function A(R){const N=p.get(R);return N?(p.delete(R),p.set(R,N),N):null}function z(R,N){try{for(p.has(R)&&p.delete(R),p.set(R,N);p.size>y;){const M=p.keys().next().value;p.delete(M)}}catch{}}async function U(R,N){let M,T,I;try{({data:M,pagePath:T,anchor:I}=await wu(R,o))}catch(ce){const De=ce?.message?String(ce.message):"",et=(!ke||typeof ke!="string"||!ke)&&/no page data/i.test(De);try{if(et)try{k("[nimbi-cms] fetchPageData (expected missing)",ce)}catch{}else try{Pr("[nimbi-cms] fetchPageData failed",ce)}catch{}}catch{}try{!ke&&n&&b(n)}catch{}go(t,s,ce);return}!I&&N&&(I=N);try{$s(null)}catch(ce){k("[nimbi-cms] scrollToAnchorOrTop failed",ce)}try{b(t)}catch{try{t.innerHTML=""}catch{}}const Q=`${String(T??"")}|||${S(M)}`,q=A(Q);let ne,le,_e,fe,xe,$e;q?.articleTemplate?(ne=q.articleTemplate.cloneNode(!0),_e=q.tocTemplate?q.tocTemplate.cloneNode(!0):null,fe=ne.querySelector("h1"),xe=fe?(fe.textContent||"").trim():q.h1Text||"",$e=q.slugKey||fe&&fe.id||"",le={meta:Object.assign({},q.meta||{})}):({article:ne,parsed:le,toc:_e,topH1:fe,h1Text:xe,slugKey:$e}=await yf(s,M,T,I,o),z(Q,{articleTemplate:ne.cloneNode(!0),tocTemplate:_e?_e.cloneNode(!0):null,meta:Object.assign({},le?.meta||{}),h1Text:xe||"",slugKey:$e||""})),du(s,l,le,_e,ne,T,I,fe,xe,$e,M);try{b(n)}catch{try{n.innerHTML=""}catch{}}_e&&(n.appendChild(_e),Af(_e));try{await c("transformHtml",{article:ne,parsed:le,toc:_e,pagePath:T,anchor:I,topH1:fe,h1Text:xe,slugKey:$e,data:M})}catch(ce){k("[nimbi-cms] transformHtml hooks failed",ce)}try{if(!document.querySelector(".nimbi-skip-link")){const ce=document.createElement("a");ce.className="nimbi-skip-link",ce.href="#main",ce.textContent="Skip to content",ce.setAttribute("aria-label","Skip to content");const De=document.querySelector(".nimbi-mount")||document.querySelector(".nimbi-cms")||document.body;De&&De.firstChild?De.insertBefore(ce,De.firstChild):De&&De.appendChild(ce)}}catch{}try{let ce=t.querySelector("main.nimbi-main");ce||(ce=document.createElement("main"),ce.className="nimbi-main",t.appendChild(ce)),ce.appendChild(ne)}catch{t.appendChild(ne)}try{Eo(ne)}catch(ce){k("[nimbi-cms] observeCodeBlocks failed",ce)}try{bf(ne,u)}catch(ce){k("[nimbi-cms] executeEmbeddedScripts failed",ce)}try{Hf(ne,{t:s})}catch(ce){k("[nimbi-cms] attachImagePreview failed",ce)}try{is(r,100,!1),typeof requestAnimationFrame=="function"&&requestAnimationFrame(()=>is(r,100,!1))}catch(ce){k("[nimbi-cms] setEagerForAboveFoldImages failed",ce)}$s(I),Tf(ne,fe,{mountOverlay:i,container:r,navWrap:n,t:s});try{await c("onPageLoad",{data:M,pagePath:T,anchor:I,article:ne,toc:_e,topH1:fe,h1Text:xe,slugKey:$e,contentWrap:t,navWrap:n})}catch(ce){k("[nimbi-cms] onPageLoad hooks failed",ce)}f=T}async function W(){const R=typeof performance<"u"&&typeof performance.now=="function"?performance.now():null;if(h){w=!0;return}h=!0;try{try{ko("renderByQuery")}catch{}let N=_t(location.href);try{if(N?.type==="path"&&N?.page&&o)try{const M=typeof o=="string"?new URL(o,location.href).pathname:"",T=String(M??"").replace(/^\/+|\/+$/g,""),I=String(N.page??"").replace(/^\/+|\/+$/g,"");T&&I===T&&(N.page=null)}catch{}}catch{}if(N?.type==="path"&&N?.page)try{let M="?page="+encodeURIComponent(N.page||"");N.params&&(M+=(M.includes("?")?"&":"?")+N.params),N.anchor&&(M+="#"+encodeURIComponent(N.anchor));try{history.replaceState(history.state,"",M)}catch{try{history.replaceState({},"",M)}catch{}}N=_t(location.href)}catch{}await U(N?.page?N.page:a,N?.anchor?N.anchor:null)}catch(N){k("[nimbi-cms] renderByQuery failed",N);try{!ke&&n&&b(n)}catch{}go(t,s,N)}finally{if(R!==null)try{const N=performance.now()-R;typeof window<"u"&&window.__nimbiRenderTimings&&window.__nimbiRenderTimings.push(N)}catch{}if(h=!1,w){w=!1;try{await W()}catch{}}}}const Y=(R,N,M,T)=>{d?R.addEventListener(N,M,{...T,signal:d}):R.addEventListener(N,M,T)};Y(window,"popstate",W),Y(window,"hashchange",W);const ae=()=>`nimbi-cms-scroll:${location.pathname}${location.search}`,he=()=>{try{const R=r||document.querySelector(".nimbi-cms");if(!R)return;const N={top:R.scrollTop||0,left:R.scrollLeft||0};sessionStorage.setItem(ae(),JSON.stringify(N))}catch(R){if(R&&R.name==="QuotaExceededError"){try{g[ae()]={top:(r||document.querySelector(".nimbi-cms"))?.scrollTop||0,left:(r||document.querySelector(".nimbi-cms"))?.scrollLeft||0}}catch{}return}k("[nimbi-cms] save scroll position failed",R)}},ie=()=>{try{const R=r||document.querySelector(".nimbi-cms");if(!R)return;let N=null;try{const M=sessionStorage.getItem(ae());M&&(N=JSON.parse(M))}catch{}!N&&g[ae()]&&(N=g[ae()]),N&&typeof N?.top=="number"&&R.scrollTo({top:N.top,left:N.left||0,behavior:"auto"})}catch{}};return Y(window,"pageshow",R=>{if(R.persisted)try{ie(),is(r,100,!1)}catch(N){k("[nimbi-cms] bfcache restore failed",N)}}),Y(window,"pagehide",()=>{try{he()}catch(R){k("[nimbi-cms] save scroll position failed",R)}}),{renderByQuery:W,siteNav:m,getCurrentPagePath:()=>f}}function Vf(e){try{let t=typeof e=="string"?e:typeof window<"u"&&window.location?window.location.search:"";if(!t&&typeof window<"u"&&window.location)try{const s=_t(window.location.href);s&&s.params&&(t=s.params.startsWith("?")?s.params:"?"+s.params)}catch{t=""}if(!t)return{};const n=new URLSearchParams(t.startsWith("?")?t.slice(1):t),r={},i=s=>{if(s==null)return;const o=String(s).toLowerCase();if(o==="1"||o==="true"||o==="yes")return!0;if(o==="0"||o==="false"||o==="no")return!1};if(n.has("contentPath")&&(r.contentPath=n.get("contentPath")),n.has("searchIndex")){const s=i(n.get("searchIndex"));typeof s=="boolean"&&(r.searchIndex=s)}if(n.has("searchIndexMode")){const s=n.get("searchIndexMode");(s==="eager"||s==="lazy")&&(r.searchIndexMode=s)}if(n.has("defaultStyle")){const s=n.get("defaultStyle");(s==="light"||s==="dark"||s==="system")&&(r.defaultStyle=s)}if(n.has("bulmaCustomize")&&(r.bulmaCustomize=n.get("bulmaCustomize")),n.has("lang")&&(r.lang=n.get("lang")),n.has("l10nFile")){const s=n.get("l10nFile");r.l10nFile=s==="null"?null:s}if(n.has("cacheTtlMinutes")){const s=Number(n.get("cacheTtlMinutes"));Number.isFinite(s)&&s>=0&&(r.cacheTtlMinutes=s)}if(n.has("cacheMaxEntries")){const s=Number(n.get("cacheMaxEntries"));Number.isInteger(s)&&s>=0&&(r.cacheMaxEntries=s)}if(n.has("homePage")&&(r.homePage=n.get("homePage")),n.has("navigationPage")&&(r.navigationPage=n.get("navigationPage")),n.has("notFoundPage")){const s=n.get("notFoundPage");r.notFoundPage=s==="null"?null:s}if(n.has("availableLanguages")&&(r.availableLanguages=n.get("availableLanguages").split(",").map(s=>s.trim()).filter(Boolean)),n.has("fetchConcurrency")){const s=Number(n.get("fetchConcurrency"));Number.isInteger(s)&&s>=1&&(r.fetchConcurrency=s)}if(n.has("negativeFetchCacheTTL")){const s=Number(n.get("negativeFetchCacheTTL"));Number.isFinite(s)&&s>=0&&(r.negativeFetchCacheTTL=s)}if(n.has("indexDepth")){const s=Number(n.get("indexDepth"));Number.isInteger(s)&&(s===1||s===2||s===3)&&(r.indexDepth=s)}if(n.has("noIndexing")){const s=(n.get("noIndexing")||"").split(",").map(o=>o.trim()).filter(Boolean);s.length&&(r.noIndexing=s)}return r}catch{return{}}}function bs(e){if(typeof e!="string")return!1;const t=e.trim();if(!t||t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))return!1;const n=t.replace(/^\.\//,"");return!!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n)}function Zf(e){if(typeof e!="string")return!1;const t=e.trim();if(!t)return!1;if(t==="."||t==="./")return!0;if(t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))return!1;const n=t.replace(/^\.\//,"");return!!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\/?$/.test(n)}var Xf="monokai",bi="",wi=null;async function Cl(e={}){if(!e||typeof e!="object")throw new TypeError("initCMS(options): options must be an object");const t=Vf();if(t&&(t.contentPath||t.homePage||t.notFoundPage||t.navigationPage))if(e&&e.allowUrlPathOverrides===!0)try{k("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage/navigationPage")}catch{}else{try{k("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage/navigationPage")}catch{}delete t.contentPath,delete t.homePage,delete t.notFoundPage,delete t.navigationPage}const n=Object.assign({},t,e);try{Object.prototype.hasOwnProperty.call(n,"debugLevel")&&zl(n.debugLevel)}catch{}try{wn("[nimbi-cms] initCMS called",()=>({options:n}))}catch{}t&&typeof t.bulmaCustomize=="string"&&t.bulmaCustomize.trim()&&(n.bulmaCustomize=t.bulmaCustomize);let{el:r,contentPath:i="/content",crawlMaxQueue:s=1e3,searchIndex:o=!0,searchIndexMode:a="eager",indexDepth:l=1,noIndexing:c=void 0,defaultStyle:u="light",bulmaCustomize:d="none",lang:f=void 0,l10nFile:g=null,cacheTtlMinutes:m=5,cacheMaxEntries:p,markdownExtensions:y,availableLanguages:h,homePage:w=null,notFoundPage:b=null,navigationPage:S="_navigation.md",allowEmbeddedScripts:A=!1,exposeSitemap:z=!0,cspNonce:U=null}=n;try{typeof w=="string"&&w.startsWith("./")&&(w=w.replace(/^\.\//,""))}catch{}try{typeof b=="string"&&b.startsWith("./")&&(b=b.replace(/^\.\//,""))}catch{}try{typeof S=="string"&&S.startsWith("./")&&(S=S.replace(/^[.]\//,""))}catch{}const{navbarLogo:W="favicon"}=n,{skipRootReadme:Y=!1}=n,ae=R=>{try{const N=document.querySelector(r);if(N&&N instanceof Element)try{const M=()=>{const I=document.createElement("div");I.style.padding="1rem";try{I.style.fontFamily="system-ui, sans-serif"}catch{}I.style.color="#b00",I.style.background="#fee",I.style.border="1px solid #b00";const Q=document.createElement("strong");Q.textContent="NimbiCMS failed to initialize:",I.appendChild(Q);try{I.appendChild(document.createElement("br"))}catch{}const q=document.createElement("pre");try{q.style.whiteSpace="pre-wrap"}catch{}return q.textContent=String(R),I.appendChild(q),I},T=M();try{if(typeof N.replaceChildren=="function")N.replaceChildren(T);else{for(;N.firstChild;)N.removeChild(N.firstChild);N.appendChild(T)}}catch{try{for(;N.firstChild;)N.removeChild(N.firstChild);N.appendChild(M())}catch{}}}catch{}}catch{}};if(n.contentPath!=null&&!Zf(n.contentPath))throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');if(w!=null&&!bs(w))throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');if(b!=null&&!bs(b))throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');if(S!=null&&!bs(S))throw new TypeError('initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html');if(!r)throw new Error("el is required");let he=r;if(typeof r=="string"){if(he=document.querySelector(r),!he)throw new Error(`el selector "${r}" did not match any element`)}else if(!(r instanceof Element))throw new TypeError("el must be a CSS selector string or a DOM element");try{if(he&&he._nimbiCmsInitialized)throw new Error("initCMS already called on this element")}catch(R){if(R instanceof Error&&/already called/.test(R.message))throw R}if(typeof i!="string"||!i.trim())throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');if(typeof o!="boolean")throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');if(a!=null&&a!=="eager"&&a!=="lazy")throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');if(l!=null&&l!==1&&l!==2&&l!==3)throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');if(u!=="light"&&u!=="dark"&&u!=="system")throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');if(d!=null&&typeof d!="string")throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');if(f!=null&&typeof f!="string")throw new TypeError('initCMS(options): "lang" must be a string when provided');if(g!=null&&typeof g!="string")throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');if(m!=null&&(typeof m!="number"||!Number.isFinite(m)||m<0))throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');if(p!=null&&(typeof p!="number"||!Number.isInteger(p)||p<0))throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');if(y!=null&&(!Array.isArray(y)||y.some(R=>!R||typeof R!="object")))throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');if(h!=null&&(!Array.isArray(h)||h.some(R=>typeof R!="string"||!R.trim())))throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');if(c!=null&&(!Array.isArray(c)||c.some(R=>typeof R!="string"||!R.trim())))throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');if(c=Array.isArray(c)?Array.from(new Set(c.map(R=>{try{return re(String(R??""))}catch{return""}}).filter(Boolean))):void 0,Y!=null&&typeof Y!="boolean")throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');if(A!=null&&typeof A!="boolean")throw new TypeError('initCMS(options): "allowEmbeddedScripts" must be a boolean when provided');if(n.fetchConcurrency!=null&&(typeof n.fetchConcurrency!="number"||!Number.isInteger(n.fetchConcurrency)||n.fetchConcurrency<1))throw new TypeError('initCMS(options): "fetchConcurrency" must be a positive integer when provided');if(n.negativeFetchCacheTTL!=null&&(typeof n.negativeFetchCacheTTL!="number"||!Number.isFinite(n.negativeFetchCacheTTL)||n.negativeFetchCacheTTL<0))throw new TypeError('initCMS(options): "negativeFetchCacheTTL" must be a non-negative number (ms) when provided');if(w!=null&&(typeof w!="string"||!w.trim()||!/\.(md|html)$/.test(w)))throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');if(b!=null&&(typeof b!="string"||!b.trim()||!/\.(md|html)$/.test(b)))throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');const ie=!!o;try{Io(!!Y)}catch(R){k("[nimbi-cms] setSkipRootReadme failed",R)}try{try{n?.seoMap&&typeof n.seoMap=="object"&&hu(n.seoMap)}catch{}try{uc()}catch{}try{U&&fc(U)}catch{}try{const R="11.12.0";R&&hc(R,Xf)}catch{}try{typeof window<"u"&&(window.__nimbiRenderingErrors__||(window.__nimbiRenderingErrors__=[]),window.addEventListener("error",function(R){try{const N={type:"error",message:R?.message?String(R.message):"",filename:R?.filename?String(R.filename):"",lineno:R?.lineno?R.lineno:null,colno:R?.colno?R.colno:null,stack:R?.error?.stack?R.error.stack:null,time:Date.now()};try{k("[nimbi-cms] runtime error",N.message)}catch{}window.__nimbiRenderingErrors__.push(N)}catch{}},{signal:wi.signal}),window.addEventListener("unhandledrejection",function(R){try{const N={type:"unhandledrejection",reason:R?.reason?String(R.reason):"",time:Date.now()};try{k("[nimbi-cms] unhandledrejection",N.reason)}catch{}window.__nimbiRenderingErrors__.push(N)}catch{}}))}catch{}try{const R=_t(typeof window<"u"?window.location.href:""),N=R?.page?R.page:w||void 0;try{cu()}catch{}try{N&&fu(N,bi||"")}catch{}}catch{}await(async()=>{try{he.classList.add("nimbi-mount")}catch(E){k("[nimbi-cms] mount element setup failed",E)}const R=document.createElement("section");R.className="section";const N=document.createElement("div");N.className="container nimbi-cms";const M=document.createElement("div");M.className="columns";const T=document.createElement("div");T.className="column is-hidden-mobile is-3-tablet nimbi-nav-wrap",T.setAttribute("role","navigation");try{const E=typeof Bn=="function"?Bn("navigation"):null;E&&T.setAttribute("aria-label",E)}catch(E){k("[nimbi-cms] set nav aria-label failed",E)}M.appendChild(T);const I=document.createElement("main");I.className="column nimbi-content",I.setAttribute("role","main"),M.appendChild(I),N.appendChild(M),R.appendChild(N);const Q=T,q=I;he.appendChild(R);let ne=null;try{ne=he.querySelector(".nimbi-overlay"),ne||(ne=document.createElement("div"),ne.className="nimbi-overlay",he.appendChild(ne))}catch(E){ne=null,k("[nimbi-cms] mount overlay setup failed",E)}const le=location.pathname||"/";let _e;if(le.endsWith("/"))_e=le;else{const E=le.substring(le.lastIndexOf("/")+1);E&&!E.includes(".")?_e=le+"/":_e=le.substring(0,le.lastIndexOf("/")+1)}try{bi=document.title||""}catch(E){bi="",k("[nimbi-cms] read initial document title failed",E)}let fe=i;Object.prototype.hasOwnProperty.call(n,"contentPath");const xe=typeof location<"u"&&location?.origin?location.origin:"http://localhost",$e=new URL(_e,xe).toString();(fe==="."||fe==="./")&&(fe="");try{fe=String(fe??"").replace(/\\/g,"/")}catch{fe=String(fe??"")}fe.startsWith("/")&&(fe=fe.replace(/^\/+/,"")),fe&&!fe.endsWith("/")&&(fe=fe+"/");try{if(fe&&_e&&_e!=="/"){const E=_e.replace(/^\/+/,"").replace(/\/+$/,"")+"/";E&&fe.startsWith(E)&&(fe=fe.slice(E.length))}}catch{}try{if(fe)var ce=new URL(fe,$e.endsWith("/")?$e:$e+"/").toString();else var ce=$e}catch{try{if(fe)var ce=new URL("/"+fe,xe).toString();else var ce=new URL(_e,xe).toString()}catch{var ce=xe}}g&&await Zs(g,_e),h&&Array.isArray(h)&&Oo(h),f&&Xs(f);try{if(typeof document<"u"&&document.documentElement){const E=typeof f=="string"&&f.trim()?f.trim().split("-")[0]:qt;try{document.documentElement.setAttribute("lang",E)}catch{}try{const L=new Intl.Locale(E||"en"),H=L.textInfo&&L.textInfo.direction==="rtl"||["ar","he","fa","ur","ps","sd","ug","ku","dv","yi"].includes(String(E||"").split("-")[0].toLowerCase());document.documentElement.setAttribute("dir",H?"rtl":"ltr")}catch{}}}catch{}if(typeof m=="number"&&m>=0&&typeof Ia=="function"&&Ia(m*60*1e3),typeof p=="number"&&p>=0&&typeof Na=="function"&&Na(p),y&&Array.isArray(y)&&y.length)try{y.forEach(E=>{typeof E=="object"&&Kh&&typeof Ns=="function"&&Ns(E)})}catch(E){k("[nimbi-cms] applying markdownExtensions failed",E)}try{if(typeof s=="number")try{Vo(s)}catch(E){k("[nimbi-cms] setDefaultCrawlMaxQueue failed",E)}if(typeof n.fetchConcurrency=="number")try{Ho(n.fetchConcurrency)}catch(E){k("[nimbi-cms] setFetchConcurrency failed",E)}if(typeof n.negativeFetchCacheTTL=="number")try{Fo(n.negativeFetchCacheTTL)}catch(E){k("[nimbi-cms] setFetchNegativeCacheTTL failed",E)}}catch(E){k("[nimbi-cms] setDefaultCrawlMaxQueue failed",E)}try{try{const E=n?.manifest?n.manifest:typeof globalThis<"u"&&globalThis.__NIMBI_CMS_MANIFEST__?globalThis.__NIMBI_CMS_MANIFEST__:typeof window<"u"&&window.__NIMBI_CMS_MANIFEST__?window.__NIMBI_CMS_MANIFEST__:null;if(E&&typeof E=="object")try{Uo(E),wn?.("[nimbi-cms diagnostic] applied content manifest",()=>({manifestKeys:Object.keys(E).length}))}catch(L){k?.("[nimbi-cms] applying content manifest failed",L)}try{try{const L=_t(typeof window<"u"?window.location.href:"");if(L)try{if(L.type==="cosmetic")try{ki(L)}catch{}else if(L.type==="canonical")try{ki(L)}catch{}else if(L.type==="path")try{const H=(typeof location<"u"&&location?.pathname?String(location.pathname):"/").replace(/\/\/+$/,""),$=(_e||"").replace(/\/\/+$/,"");let P="";try{P=new URL(ce).pathname.replace(/\/\/+$/,"")}catch{P=""}if(H===$||H===P||H==="")try{ki({type:"path",page:null,anchor:L.anchor||null,params:L.params||""})}catch{}}catch{}}catch{}}catch{}Js(ce)}catch(L){k("[nimbi-cms] setContentBase failed",L)}try{try{wn("[nimbi-cms diagnostic] after setContentBase",()=>({manifestKeys:Object.keys(E??{}).length??0,slugToMdSize:te?.size??void 0,allMarkdownPathsLength:ht?.length??void 0,allMarkdownPathsSetSize:Qe?.size??void 0,searchIndexLength:searchIndex?.length??void 0}))}catch{}}catch{}}catch{}}catch(E){k("[nimbi-cms] setContentBase failed",E)}try{Do(b)}catch(E){k("[nimbi-cms] setNotFoundPage failed",E)}try{if(typeof window<"u"&&window.__nimbiAutoAttachSitemapUI)try{_s&&typeof Ws=="function"&&Ws(document.body,{filename:"sitemap.json"})}catch{}}catch{}let De=null,et=null;try{if(!Object.prototype.hasOwnProperty.call(n,"homePage")&&S)try{const L=[],H=[];try{S&&H.push(String(S))}catch{}try{const P=String(S??"").replace(/^_/,"");P&&P!==String(S)&&H.push(P)}catch{}try{H.push("navigation.md")}catch{}try{H.push("assets/navigation.md")}catch{}const $=[];for(const P of H)try{if(!P)continue;const D=String(P);$.includes(D)||$.push(D)}catch{}for(const P of $){L.push(P);try{if(et=await Ke(P,ce,{force:!0}),et&&et.raw){try{S=P}catch{}try{k("[nimbi-cms] fetched navigation candidate",P,"contentBase=",ce)}catch{}De=await sr(et.raw||"");try{const D=st();if(D&&De&&De.html){const O=D.parseFromString(De.html,"text/html").querySelector("a");if(O)try{const J=O?.getAttribute?.("href")||"",B=_t(J);try{k("[nimbi-cms] parsed nav first-link href",J,"->",B)}catch{}if(B?.page&&(B.type==="path"||B.type==="canonical")&&(B.page.includes(".")||B.page.includes("/"))){w=B.page;try{k("[nimbi-cms] derived homePage from navigation",w)}catch{}break}}catch{}}}catch{}}}catch{}}}catch{}try{k("[nimbi-cms] final homePage before slugManager setHomePage",w)}catch{}try{Bo(w)}catch(L){k("[nimbi-cms] setHomePage failed",L)}let E=!0;try{const L=_t(typeof location<"u"?location.href:"");L&&L.type==="cosmetic"&&(typeof b>"u"||b==null)&&(E=!1)}catch{}if(E&&w)try{await Ke(w,ce,{force:!0})}catch(L){throw new Error(`Required ${w} not found at ${ce}${w}: ${L&&L.message?L.message:String(L)}`)}}catch(E){throw E}Mo(u),await To(d,_e),wi=typeof window<"u"?new AbortController:{signal:{abort:()=>{}}};const ot=Gf({contentWrap:q,navWrap:Q,container:N,mountOverlay:ne,t:Bn,contentBase:ce,homePage:w,initialDocumentTitle:bi,runHooks:ws,allowEmbeddedScripts:A,signal:wi.signal});try{if(typeof window<"u"){try{window.__nimbiUI=ot,window.__nimbiRenderTimings||(window.__nimbiRenderTimings=[])}catch{}window.addEventListener("nimbi.coldRouteResolved",function(E){ot?.renderByQuery?.().catch(L=>{k?.("[nimbi-cms] renderByQuery failed for cold-route event",L)})}),(Array.isArray(window.__nimbiColdRouteResolved)?window.__nimbiColdRouteResolved.slice():null)?.length&&(ot?.renderByQuery?.().catch(()=>{}),window.__nimbiColdRouteResolved=[])}}catch{}try{const E=document.createElement("header");E.className="nimbi-site-navbar",he.insertBefore(E,R);let L=et,H=De;H||(L=await Ke(S,ce,{force:!0}),H=await sr(L.raw||""));const{navbar:$,linkEls:P}=await Uf(E,N,H.html||"",ce,w,Bn,ot.renderByQuery,ie,a,l,c,W,wi.signal);try{await ws("onNavBuild",{navWrap:Q,navbar:$,linkEls:P,contentBase:ce})}catch(D){k("[nimbi-cms] onNavBuild hooks failed",D)}try{try{if(P&&P.length){for(const D of Array.from(P||[]))try{const O=D?.getAttribute?.("href")||"";if(!O)continue;let J=String(O??"").split(/::|#/,1)[0];if(J=String(J??"").split("?")[0],!J)continue;/\.(?:md|html?)$/.test(J)||(J=J+".html");let B=null;try{B=re(String(J??""))}catch{B=String(J??"")}const G=String(B??"").replace(/^.*\//,"").replace(/\?.*$/,"");if(!G)continue;try{let V=null;try{V=Se(G.replace(/\.(?:md|html?)$/i,""))}catch{V=String(G??"").replace(/\s+/g,"-").toLowerCase()}if(!V)continue;let se=V;try{if(te&&typeof te.has=="function"&&te.has(V)){const me=te.get(V);let Ce=!1;try{if(typeof me=="string")me===J&&(Ce=!0);else if(me&&typeof me=="object"){me.default===J&&(Ce=!0);for(const Re of Object.keys(me.langs||{}))if(me.langs[Re]===J){Ce=!0;break}}}catch{}if(!Ce)try{se=En(V,new Set(te.keys()))}catch{se=V}}}catch{}try{try{St(se,B)}catch{}try{be?.set?.(B,se)}catch{}try{if(!Qe?.has?.(B))try{Qe?.add?.(B),Array.isArray(ht)&&ht.push(B)}catch{}}catch{}}catch{}}catch{}}catch{}try{er(ce)}catch{}}}catch{}}catch{}try{let D=!1;try{const O=new URLSearchParams(location.search||"");(O.has("sitemap")||O.has("rss")||O.has("atom"))&&(D=!0)}catch{}try{const O=(location.pathname||"/").replace(/\/\/+/g,"/").split("/").filter(Boolean).pop()||"";O&&/^(sitemap|sitemap\.xml|rss|rss\.xml|atom|atom\.xml)$/i.test(O)&&(D=!0)}catch{}if(D)try{try{const O=[];w&&O.push(w),S&&O.push(S);try{await zf({contentBase:ce,indexDepth:Math.max(l||1,3),noIndexing:c,seedPaths:O.length?O:void 0,startBuild:!0,timeoutMs:1/0})}catch{}}catch{}try{if(_s&&typeof Vr=="function"&&await Vr({includeAllMarkdown:!0,homePage:w,navigationPage:S,notFoundPage:b,contentBase:ce,indexDepth:l,noIndexing:c}))return}catch{}}catch{}else if(z===!0||typeof window<"u"&&window.__nimbiExposeSitemap)try{if(_s&&typeof Fs=="function")try{Fs({includeAllMarkdown:!0,homePage:w,navigationPage:S,notFoundPage:b,contentBase:ce,indexDepth:l,noIndexing:c}).catch(()=>{})}catch{}}catch{}}catch{}try{try{if(typeof er=="function")try{er(ce);try{try{wn("[nimbi-cms diagnostic] after refreshIndexPaths",()=>({slugToMdSize:typeof te?.size=="number"?te?.size:void 0,allMarkdownPathsLength:Array.isArray(ht)?ht.length:void 0,allMarkdownPathsSetSize:typeof Qe?.size=="number"?Qe?.size:void 0}))}catch{}}catch{}try{const O=typeof te?.size=="number"?te?.size:0;let J=!1;try{if(!manifest){O<30&&(J=!0);try{const B=_t(typeof location<"u"?location.href:"");if(B){if(B.type==="cosmetic"&&B.page)try{te.has(B.page)||(J=!0)}catch{}else if((B.type==="path"||B.type==="canonical")&&B.page)try{const G=re(B.page);!be?.has?.(G)&&!Qe?.has?.(G)&&(J=!0)}catch{}}}catch{}}}catch{}if(J){let B=null;try{B=typeof window<"u"&&(window.__nimbiSitemapFinal||window.__nimbiResolvedIndex||window.__nimbiSearchIndex||window.__nimbiLiveSearchIndex||window.__nimbiSearchIndex)||null}catch{B=null}if(Array.isArray(B)&&B.length){let G=0;for(const V of B)try{if(!V||!V.slug)continue;const se=String(V.slug).split("::")[0];if(te.has(se))continue;let me=V.sourcePath||V.path||null;if(!me&&Array.isArray(B)){const Re=(B||[]).find(Ie=>Ie&&Ie.slug===V.slug);Re&&Re.path&&(me=Re.path)}if(!me)continue;try{me=String(me)}catch{continue}let Ce=null;try{const Re=ce&&typeof ce=="string"?ce:typeof location<"u"&&location.origin?location.origin+"/":"";try{const Ie=new URL(me,Re),Ee=new URL(Re);if(Ie.origin===Ee.origin){const He=Ee.pathname||"/";let Be=Ie.pathname||"";Be.startsWith(He)&&(Be=Be.slice(He.length)),Be.startsWith("/")&&(Be=Be.slice(1)),Ce=re(Be)}else Ce=re(Ie.pathname||"")}catch{Ce=re(me)}}catch{Ce=re(me)}if(!Ce)continue;Ce=String(Ce).split(/[?#]/)[0],Ce=re(Ce);try{St(se,Ce)}catch{}G++}catch{}if(G){try{wn("[nimbi-cms diagnostic] populated slugToMd from sitemap/searchIndex",()=>({added:G,total:typeof te?.size=="number"?te?.size:void 0}))}catch{}try{er(ce)}catch{}try{typeof window<"u"&&window.__nimbiUI&&typeof window.__nimbiUI.renderByQuery=="function"&&window.__nimbiUI.renderByQuery().catch(()=>{})}catch{}}}}}catch{}}catch(O){k("[nimbi-cms] refreshIndexPaths after nav build failed",O)}}catch{}const D=()=>{const O=E?.getBoundingClientRect&&Math.round(E.getBoundingClientRect().height)||E?.offsetHeight||0;if(O>0){try{he.style.setProperty("--nimbi-site-navbar-height",`${O}px`)}catch(J){k("[nimbi-cms] set CSS var failed",J)}try{N.style.paddingTop=""}catch(J){k("[nimbi-cms] set container paddingTop failed",J)}try{const J=he?.getBoundingClientRect&&Math.round(he.getBoundingClientRect().height)||he?.clientHeight||0;if(J>0){const B=Math.max(0,J-O);try{N.style.setProperty("--nimbi-cms-height",`${B}px`)}catch(G){k("[nimbi-cms] set --nimbi-cms-height failed",G)}}else try{N.style.setProperty("--nimbi-cms-height","calc(100vh - var(--nimbi-site-navbar-height))")}catch(B){k("[nimbi-cms] set --nimbi-cms-height failed",B)}}catch(J){k("[nimbi-cms] compute container height failed",J)}try{E.style.setProperty("--nimbi-site-navbar-height",`${O}px`)}catch(J){k("[nimbi-cms] set navbar CSS var failed",J)}}};D();try{if(typeof ResizeObserver<"u"){const O=new ResizeObserver(()=>D());try{O.observe(E)}catch(J){k("[nimbi-cms] ResizeObserver.observe failed",J)}}}catch(O){k("[nimbi-cms] ResizeObserver setup failed",O)}}catch(D){k("[nimbi-cms] compute navbar height failed",D)}}catch(E){k("[nimbi-cms] build navigation failed",E)}try{const E="1.1.0",L=D=>{const O=document.createElement("a");O.className="nimbi-version-label tag is-small",O.textContent=`nimbiCMS v. ${E}`,O.href=D||"#",O.target="_blank",O.rel="noopener noreferrer nofollow",O.setAttribute("aria-label",`nimbiCMS version ${E}`),O.style.visibility="hidden",O.style.opacity="0",O.style.pointerEvents="none";try{jo(O)}catch{}try{he.appendChild(O);const J=()=>{try{O.style.visibility="",O.style.opacity="",O.style.pointerEvents=""}catch{}};try{setTimeout(J,3e3)}catch{J()}}catch(J){k("[nimbi-cms] append version label failed",J)}},H="https://abelvm.github.io/nimbiCMS/",$=(()=>{try{return new URL(H).toString()}catch{}return"#"})(),P=()=>{try{L($)}catch(D){k("[nimbi-cms] building version label failed",D)}};try{let D=!1;const O=()=>{D||(D=!0,P())},J=B=>{try{window.addEventListener(B,O,{once:!0,passive:!0})}catch{try{window.addEventListener(B,O,{once:!0})}catch{}}};J("pointerdown"),J("keydown"),J("touchstart"),J("wheel")}catch(D){k("[nimbi-cms] version label defer failed",D),P()}}catch(E){k("[nimbi-cms] version label setup failed",E)}})()}catch(R){throw ae(R),R}}async function Yf(){try{if("1.1.0".trim())return"1.1.0"}catch{}return"0.0.0"}exports.BAD_LANGUAGES=Hs;exports.SUPPORTED_HLJS_MAP=Oe;exports._clearHooks=Bl;exports.addHook=Wi;exports.default=Cl;exports.ensureBulma=To;exports.getVersion=Yf;exports.initCMS=Cl;exports.loadL10nFile=Zs;exports.loadSupportedLanguages=Gs;exports.observeCodeBlocks=Eo;exports.onNavBuild=$l;exports.onPageLoad=ql;exports.registerLanguage=rr;exports.runHooks=ws;exports.setHighlightTheme=rc;exports.setLang=Xs;exports.setStyle=Mo;exports.setThemeVars=pc;exports.t=Bn;exports.transformHtml=Dl;
