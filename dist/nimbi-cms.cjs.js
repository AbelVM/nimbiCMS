Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});var Qc=Object.create,Yi=Object.defineProperty,Xc=Object.getOwnPropertyDescriptor,Jc=Object.getOwnPropertyNames,Kc=Object.getPrototypeOf,Sl=Object.prototype.hasOwnProperty,El=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),ha=(e,t)=>{let n={};for(var r in e)Yi(n,r,{get:e[r],enumerable:!0});return t||Yi(n,Symbol.toStringTag,{value:"Module"}),n},eu=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(var i=Jc(t),a=0,o=i.length,s;a<o;a++)s=i[a],!Sl.call(e,s)&&s!==n&&Yi(e,s,{get:(l=>t[l]).bind(null,s),enumerable:!(r=Xc(t,s))||r.enumerable});return e},Al=(e,t,n)=>(n=e!=null?Qc(Kc(e)):{},eu(t||!e||!e.__esModule||!Sl.call(e,"default")?Yi(n,"default",{value:e,enumerable:!0}):n,e)),Js=Error,tu=typeof Js.isError=="function"?Js.isError:e=>e instanceof Error;function si(e){return tu(e)}function nu(e,t="ERR_ITEM"){return!e||typeof e!="object"?{error:!0,code:t,message:e?String(e):void 0,stack:void 0}:{error:!0,code:e.code||t,message:e.message,stack:e.stack}}function Ks(e){return!e||!e.error?String(e):`${e.code||"ERR"}: ${e.message||""}`}function ru(e,t){const n=new Error(`${e} queue is full`);return n.code="ERR_QUEUE_FULL",n.queueCapacity=t,n}var Qi=null;if(typeof process<"u"&&process?.hrtime&&typeof process.hrtime.bigint=="function")try{const e=Number(process.hrtime.bigint()/1000000n);Qi=Date.now()-e}catch{Qi=null}var eo=typeof performance<"u"&&typeof performance?.now=="function"&&typeof performance?.timeOrigin=="number"?()=>performance.timeOrigin+performance.now():null;function iu(e){if(eo)try{const t=eo();return e===void 0||Math.abs(t-e)<1e3?t:e}catch{}if(Qi!=null)try{const t=Number(process.hrtime.bigint()/1000000n)+Qi;return e===void 0||Math.abs(t-e)<1e3?t:e}catch{return e===void 0?Date.now():e}return e===void 0?Date.now():e}var tt=()=>iu(Date.now());function au(e,t){const{name:n,className:r,min:i=0,integer:a=!1,allowInfinity:o=!1,fallback:s,invalidMessage:l,minMessage:c,integerMessage:u}=t;if(e==null)return s!==void 0?s:e;const f=Number(e);if(f===Number.POSITIVE_INFINITY&&o)return f;if(!Number.isFinite(f))throw new TypeError(l??`${r}: \`${n}\` must be a finite number (received ${String(e)}). A non-finite limit would silently disable the check it guards.`);if(a&&!Number.isInteger(f))throw new TypeError(u??`${r}: \`${n}\` must be a whole number (received ${String(e)}). A fractional limit is silently rounded up by the first consumer, so it admits more than the number that was configured.`);if(f<i)throw new TypeError(c??`${r}: \`${n}\` must be >= ${i} (received ${f}).`);return f}function Fe(e,t){const n=au(e,t);if(typeof n!="number")throw new TypeError(`${t.className}: \`${t.name}\` must be a number or have a \`fallback\`, but resolved to ${String(n)}.`);return n}function to(e,t){return`${t}: \`ttl\` must be a finite number of milliseconds or Infinity (received ${JSON.stringify(e)??String(e)}). A value that is not a number concatenates rather than adds, and every expiry comparison against it is false — so the entry would never expire.`}function Tl(e,t){if(e==null||e===1/0)return 0;if(typeof e!="number"&&typeof e!="string")throw new TypeError(to(e,t));const n=Number(e);if(!Number.isFinite(n))throw new TypeError(to(e,t));return n}function su(e,t){if(e==null)return;const n=Number(e);if(!Number.isFinite(n)||!Number.isInteger(n)||n<-2147483648||n>2147483647)throw new TypeError(`${t}: \`seed\` must be a whole number in the int32 range (received ${String(e)}). The sketch mixes the seed into each hash row and truncates it to 32 bits, so a fractional or out-of-range value would silently become a different seed than the one you asked for. Omit it entirely for a random seed.`);return n}function ou(e,{name:t,className:n,optional:r=!0}){if(e==null){if(r)return null;throw new TypeError(`${n}: \`${t}\` is required.`)}if(typeof e!="function")throw new TypeError(`${n}: \`${t}\` must be a function.`);return e}function xt(e,t,n){if(!e||typeof e!="object")return;const r=new Set(t);for(const i of Object.keys(e)){if(r.has(i))continue;const a=[`${n}: unknown option \`${i}\`.`],o=lu(i,t);o&&a.push(`Did you mean \`${o}\`?`),a.push(`Accepted options: ${[...r].sort().join(", ")}.`);const s=new TypeError(a.join(" "));throw s.code="ERR_UNKNOWN_OPTION",s.option=i,s}}function lu(e,t){let n=null,r=1/0;for(const a of t){const o=cu(e,a);o<r&&(r=o,n=a)}if(n===null)return null;const i=Math.max(2,Math.floor(Math.max(e.length,n.length)/3));return r>0&&r<=i?n:null}function cu(e,t){if(e===t)return 0;if(e.length===0)return t.length;if(t.length===0)return e.length;let n=Array.from({length:t.length+1},(r,i)=>i);for(let r=1;r<=e.length;r+=1){const i=[r];for(let a=1;a<=t.length;a+=1)i[a]=Math.min(n[a]+1,i[a-1]+1,n[a-1]+(e[r-1]===t[a-1]?0:1));n=i}return n[t.length]}var tr=Object.freeze({error:"error",warn:"warn",info:"info",log:"log",debug:"debug",table:"table"}),uu=()=>typeof globalThis<"u"&&globalThis?.console?globalThis.console:typeof self<"u"&&self?.console?self.console:typeof window<"u"&&window?.console?window.console:typeof global<"u"&&global?.console?global.console:null,Wn=uu();function hu(e){return typeof Wn?.[e]=="function"}function Mi(e,...t){const n=Wn;!n||typeof n[e]!="function"||n[e](...t)}function fu(e){return typeof e=="number"?e:typeof e=="string"||typeof e=="boolean"?Number(e):e instanceof Number||e instanceof String||e instanceof Boolean?Number(e.valueOf()):NaN}function du(e){try{return JSON.stringify(e)}catch{try{const n=typeof WeakSet=="function"?new WeakSet:new Set;return JSON.stringify(e,function(r,i){if(i&&typeof i=="object"){if(n.has(i))return"[Circular]";n.add(i)}return typeof i=="function"?`[Function: ${i.name||"anonymous"}]`:typeof i=="symbol"?String(i):typeof i=="bigint"?i.toString()+"n":i})}catch{try{return String(e)}catch{return"[Unserializable]"}}}}var Ml=class{constructor(e=0,t={}){e&&typeof e=="object"&&["level","format","name","formatter","output","maxCounters"].some(r=>r in e)&&(t=e,e=void 0),xt(t,["level","format","name","formatter","output","maxCounters"],"PowerLogger"),this._debugLevel=0,this._counters=new Map,this._countersDropped=0;const n=Number(t?.maxCounters);this._maxCounters=Number.isFinite(n)&&n>=0?Math.floor(n):1e3,this._format=t?.format||"text",this.name=t?.name||null,this._formatter=typeof t?.formatter=="function"?t.formatter:null,this._output=typeof t?.output=="function"?t.output:null,this.setDebugLevel(e??t.level??0)}setDebugLevel(e){const t=fu(e);this._debugLevel=Number.isFinite(t)&&t>=0?Math.max(0,Math.min(3,Math.floor(t))):0}getDebugLevel(){return this._debugLevel}isDebugLevel(e=1){return Number(this._debugLevel)>=Number(e||1)}isDebug(){return this.isDebugLevel(1)}_resolveLogArgs(e){return e.map(t=>{if(typeof t=="function")try{return t()}catch(n){return n}return t})}_emit(e,t,n,r,i={}){if(!this.isDebugLevel(e))return;const a=this._resolveLogArgs(r);let o={level:n,msg:i.msgArray?a:a.length===1?a[0]:a,ts:tt(),format:this._format};if(this.name&&(o.name=this.name),this._formatter)try{const s=this._formatter(o);if(s!=null){if(typeof s=="string"){if(this._output){try{this._output(s)}catch(l){this._emitSinkError(l)}return}Mi(t,s);return}o=s}}catch{}if(this._output){try{this._output(o)}catch(s){this._emitSinkError(s)}return}if(hu(t))if(this._format==="json")try{Mi(t,typeof o=="string"?o:du(o))}catch{try{Mi(t,...Array.isArray(a)?a:[a])}catch{}}else Mi(t,...a)}_emitSinkError(e){try{typeof console<"u"&&typeof console.error=="function"&&console.error("PowerLogger: log sink threw",e)}catch{}}error(...e){if(!this.isDebugLevel(1))return;const t=e.map(n=>{try{if(n?.error)return Ks(n);if(si(n))return Ks(nu(n))}catch{}return n});this._emit(1,"error",tr.error,t)}warn(...e){this._emit(2,"warn",tr.warn,e)}info(...e){this._emit(3,"info",tr.info,e)}log(...e){this._emit(3,"log",tr.log,e)}debug(...e){this._emit(3,"debug",tr.debug,e)}table(...e){if(!this.isDebugLevel(3)||!Wn)return;if(this._format==="json"){this._emit(3,"log",tr.table,e,{msgArray:!0});return}const t=this._resolveLogArgs(e);typeof Wn.table=="function"?Wn.table(...t):typeof Wn.log=="function"&&Wn.log(...t)}incrementCounter(e){if(!this.isDebug())return;const t=String(e||"");if(!t)return;const n=this._counters.get(t);if(n!==void 0){this._counters.delete(t),this._counters.set(t,n+1);return}if(this._maxCounters>0&&this._counters.size>=this._maxCounters){const r=this._counters.keys().next();r.done||(this._counters.delete(r.value),this._countersDropped+=1)}this._counters.set(t,1)}getDebugCounters(){return Object.fromEntries(this._counters)}getDebugCountersDropped(){return this._countersDropped}resetDebugCounters(){this._counters=new Map,this._countersDropped=0}},Pn=new Ml(0);function pu(e){Pn.setDebugLevel(e)}function Cl(e=1){return Pn.isDebugLevel(e)}function Rl(){return Pn.isDebug()}function Fr(...e){Pn.error(...e)}function k(...e){Pn.warn(...e)}function kn(...e){Pn.info(...e)}function de(...e){Pn.log(...e)}function Ll(e){Pn.incrementCounter(e)}var Kr={onPageLoad:[],onNavBuild:[],transformHtml:[]};function fa(e,t){if(!Object.prototype.hasOwnProperty.call(Kr,e))throw new Error('Unknown hook "'+e+'"');if(typeof t!="function")throw new TypeError("hook callback must be a function");Kr[e].push(t)}function mu(e){fa("onPageLoad",e)}function gu(e){fa("onNavBuild",e)}function yu(e){fa("transformHtml",e)}async function Ja(e,t){const n=Kr[e]||[];for(const r of n)try{await r(t)}catch(i){try{k("[nimbi-cms] runHooks callback failed",i)}catch{}}}function _u(){Object.keys(Kr).forEach(e=>{Kr[e].length=0})}var wu=El(((e,t)=>{function n(S){return S instanceof Map?S.clear=S.delete=S.set=function(){throw new Error("map is read-only")}:S instanceof Set&&(S.add=S.clear=S.delete=function(){throw new Error("set is read-only")}),Object.freeze(S),Object.getOwnPropertyNames(S).forEach(X=>{const fe=S[X],Me=typeof fe;(Me==="object"||Me==="function")&&!Object.isFrozen(fe)&&n(fe)}),S}var r=class{constructor(S){S.data===void 0&&(S.data={}),this.data=S.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}};function i(S){return S.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function a(S,...X){const fe=Object.create(null);for(const Me in S)fe[Me]=S[Me];return X.forEach(function(Me){for(const We in Me)fe[We]=Me[We]}),fe}var o="</span>",s=S=>!!S.scope,l=(S,{prefix:X})=>{if(S.startsWith("language:"))return S.replace("language:","language-");if(S.includes(".")){const fe=S.split(".");return[`${X}${fe.shift()}`,...fe.map((Me,We)=>`${Me}${"_".repeat(We+1)}`)].join(" ")}return`${X}${S}`},c=class{constructor(S,X){this.buffer="",this.classPrefix=X.classPrefix,S.walk(this)}addText(S){this.buffer+=i(S)}openNode(S){if(!s(S))return;const X=l(S.scope,{prefix:this.classPrefix});this.span(X)}closeNode(S){s(S)&&(this.buffer+=o)}value(){return this.buffer}span(S){this.buffer+=`<span class="${S}">`}},u=(S={})=>{const X={children:[]};return Object.assign(X,S),X},f=class Pl{constructor(){this.rootNode=u(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(X){this.top.children.push(X)}openNode(X){const fe=u({scope:X});this.add(fe),this.stack.push(fe)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(X){return this.constructor._walk(X,this.rootNode)}static _walk(X,fe){return typeof fe=="string"?X.addText(fe):fe.children&&(X.openNode(fe),fe.children.forEach(Me=>this._walk(X,Me)),X.closeNode(fe)),X}static _collapse(X){typeof X!="string"&&X.children&&(X.children.every(fe=>typeof fe=="string")?X.children=[X.children.join("")]:X.children.forEach(fe=>{Pl._collapse(fe)}))}},d=class extends f{constructor(S){super(),this.options=S}addText(S){S!==""&&this.add(S)}startScope(S){this.openNode(S)}endScope(){this.closeNode()}__addSublanguage(S,X){const fe=S.root;X&&(fe.scope=`language:${X}`),this.add(fe)}toHTML(){return new c(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}};function p(S){return S?typeof S=="string"?S:S.source:null}function m(S){return h("(?=",S,")")}function g(S){return h("(?:",S,")*")}function y(S){return h("(?:",S,")?")}function h(...S){return S.map(X=>p(X)).join("")}function _(S){const X=S[S.length-1];return typeof X=="object"&&X.constructor===Object?(S.splice(S.length-1,1),X):{}}function w(...S){return"("+(_(S).capture?"":"?:")+S.map(X=>p(X)).join("|")+")"}function b(S){return new RegExp(S.toString()+"|").exec("").length-1}function x(S,X){const fe=S&&S.exec(X);return fe&&fe.index===0}var z=new RegExp(w(/\[(?:[^\\\]]|\\.)*\]/,/\(\?<(?![=!])[^>]+>/,/\(\?'[^']+'/,/\(\??/,/\\([1-9][0-9]*)/,/\\./));function D(S,{joinWith:X}){let fe=0;return S.map(Me=>{fe+=1;const We=fe;let Ge=p(Me),ye="";for(;Ge.length>0;){const pe=z.exec(Ge);if(!pe){ye+=Ge;break}ye+=Ge.substring(0,pe.index),Ge=Ge.substring(pe.index+pe[0].length),pe[0][0]==="\\"&&pe[1]?ye+="\\"+String(Number(pe[1])+We):(ye+=pe[0],(pe[0]==="("||/^\(\?[<']/.test(pe[0]))&&fe++)}return ye}).map(Me=>`(${Me})`).join(X)}var B=/\b\B/,j="[a-zA-Z]\\w*",re="[a-zA-Z_]\\w*",ae="\\b\\d+(\\.\\d+)?",J="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",R="\\b(0b[01]+)",N="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",M=(S={})=>{const X=/^#![ ]*\//;return S.binary&&(S.begin=h(X,/.*\b/,S.binary,/\b.*/)),a({scope:"meta",begin:X,end:/$/,relevance:0,"on:begin":(fe,Me)=>{fe.index!==0&&Me.ignoreMatch()}},S)},A={begin:"\\\\[\\s\\S]",relevance:0},O={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[A]},H={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[A]},L={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},Q=function(S,X,fe={}){const Me=a({scope:"comment",begin:S,end:X,contains:[]},fe);Me.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const We=w("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return Me.contains.push({begin:h(/[ ]+/,"(",We,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),Me},ee=Q("//","$"),he=Q("/\\*","\\*/"),me=Q("#","$"),xe={scope:"number",begin:ae,relevance:0},Pe={scope:"number",begin:J,relevance:0},ce={scope:"number",begin:R,relevance:0},De={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[A,{begin:/\[/,end:/\]/,relevance:0,contains:[A]}]},Ke={scope:"title",begin:j,relevance:0},ot={scope:"title",begin:re,relevance:0},E={begin:"\\.\\s*[a-zA-Z_]\\w*",relevance:0},P=function(S){return Object.assign(S,{"on:begin":(X,fe)=>{fe.data._beginMatch=X[1]},"on:end":(X,fe)=>{fe.data._beginMatch!==X[1]&&fe.ignoreMatch()}})},G=Object.freeze({__proto__:null,APOS_STRING_MODE:O,BACKSLASH_ESCAPE:A,BINARY_NUMBER_MODE:ce,BINARY_NUMBER_RE:R,COMMENT:Q,C_BLOCK_COMMENT_MODE:he,C_LINE_COMMENT_MODE:ee,C_NUMBER_MODE:Pe,C_NUMBER_RE:J,END_SAME_AS_BEGIN:P,HASH_COMMENT_MODE:me,IDENT_RE:j,MATCH_NOTHING_RE:B,METHOD_GUARD:E,NUMBER_MODE:xe,NUMBER_RE:ae,PHRASAL_WORDS_MODE:L,QUOTE_STRING_MODE:H,REGEXP_MODE:De,RE_STARTERS_RE:N,SHEBANG:M,TITLE_MODE:Ke,UNDERSCORE_IDENT_RE:re,UNDERSCORE_TITLE_MODE:ot});function U(S,X){S.input[S.index-1]==="."&&X.ignoreMatch()}function C(S,X){S.className!==void 0&&(S.scope=S.className,delete S.className)}function F(S,X){X&&S.beginKeywords&&(S.begin="\\b("+S.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",S.__beforeBegin=U,S.keywords=S.keywords||S.beginKeywords,delete S.beginKeywords,S.relevance===void 0&&(S.relevance=0))}function $(S,X){Array.isArray(S.illegal)&&(S.illegal=w(...S.illegal))}function te(S,X){if(S.match){if(S.begin||S.end)throw new Error("begin & end are not supported with match");S.begin=S.match,delete S.match}}function W(S,X){S.relevance===void 0&&(S.relevance=1)}var V=(S,X)=>{if(!S.beforeMatch)return;if(S.starts)throw new Error("beforeMatch cannot be used with starts");const fe=Object.assign({},S);Object.keys(S).forEach(Me=>{delete S[Me]}),S.keywords=fe.keywords,S.begin=h(fe.beforeMatch,m(fe.begin)),S.starts={relevance:0,contains:[Object.assign(fe,{endsParent:!0})]},S.relevance=0,delete fe.beforeMatch},Z=["of","and","for","in","not","or","if","then","parent","list","value"],oe="keyword";function ge(S,X,fe=oe){const Me=Object.create(null);return typeof S=="string"?We(fe,S.split(" ")):Array.isArray(S)?We(fe,S):Object.keys(S).forEach(function(Ge){Object.assign(Me,ge(S[Ge],X,Ge))}),Me;function We(Ge,ye){X&&(ye=ye.map(pe=>pe.toLowerCase())),ye.forEach(function(pe){const Ae=pe.split("|");Me[Ae[0]]=[Ge,Ne(Ae[0],Ae[1])]})}}function Ne(S,X){return X?Number(X):Re(S)?0:1}function Re(S){return Z.includes(S.toLowerCase())}var Oe={},Se=S=>{console.error(S)},qe=(S,...X)=>{console.log(`WARN: ${S}`,...X)},Be=(S,X)=>{Oe[`${S}/${X}`]||(console.log(`Deprecated as of ${S}. ${X}`),Oe[`${S}/${X}`]=!0)},Ht=new Error;function Nn(S,X,{key:fe}){let Me=0;const We=S[fe],Ge={},ye={};for(let pe=1;pe<=X.length;pe++)ye[pe+Me]=We[pe],Ge[pe+Me]=!0,Me+=b(X[pe-1]);S[fe]=ye,S[fe]._emit=Ge,S[fe]._multi=!0}function Xn(S){if(Array.isArray(S.begin)){if(S.skip||S.excludeBegin||S.returnBegin)throw Se("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),Ht;if(typeof S.beginScope!="object"||S.beginScope===null)throw Se("beginScope must be object"),Ht;Nn(S,S.begin,{key:"beginScope"}),S.begin=D(S.begin,{joinWith:""})}}function _r(S){if(Array.isArray(S.end)){if(S.skip||S.excludeEnd||S.returnEnd)throw Se("skip, excludeEnd, returnEnd not compatible with endScope: {}"),Ht;if(typeof S.endScope!="object"||S.endScope===null)throw Se("endScope must be object"),Ht;Nn(S,S.end,{key:"endScope"}),S.end=D(S.end,{joinWith:""})}}function hn(S){S.scope&&typeof S.scope=="object"&&S.scope!==null&&(S.beginScope=S.scope,delete S.scope)}function Jn(S){hn(S),typeof S.beginScope=="string"&&(S.beginScope={_wrap:S.beginScope}),typeof S.endScope=="string"&&(S.endScope={_wrap:S.endScope}),Xn(S),_r(S)}function Kn(S){function X(ye,pe){return new RegExp(p(ye),"m"+(S.case_insensitive?"i":"")+(S.unicodeRegex?"u":"")+(pe?"g":""))}class fe{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(pe,Ae){Ae.position=this.position++,this.matchIndexes[this.matchAt]=Ae,this.regexes.push([Ae,pe]),this.matchAt+=b(pe)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const pe=this.regexes.map(Ae=>Ae[1]);this.matcherRe=X(D(pe,{joinWith:"|"}),!0),this.lastIndex=0}exec(pe){this.matcherRe.lastIndex=this.lastIndex;const Ae=this.matcherRe.exec(pe);if(!Ae)return null;const st=Ae.findIndex((fn,On)=>On>0&&fn!==void 0),Je=this.matchIndexes[st];return Ae.splice(0,st),Object.assign(Ae,Je)}}class Me{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(pe){if(this.multiRegexes[pe])return this.multiRegexes[pe];const Ae=new fe;return this.rules.slice(pe).forEach(([st,Je])=>Ae.addRule(st,Je)),Ae.compile(),this.multiRegexes[pe]=Ae,Ae}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(pe,Ae){this.rules.push([pe,Ae]),Ae.type==="begin"&&this.count++}exec(pe){const Ae=this.getMatcher(this.regexIndex);Ae.lastIndex=this.lastIndex;let st=Ae.exec(pe);if(this.resumingScanAtSamePosition()&&!(st&&st.index===this.lastIndex)){const Je=this.getMatcher(0);Je.lastIndex=this.lastIndex+1,st=Je.exec(pe)}return st&&(this.regexIndex+=st.position+1,this.regexIndex===this.count&&this.considerAll()),st}}function We(ye){const pe=new Me;return ye.contains.forEach(Ae=>pe.addRule(Ae.begin,{rule:Ae,type:"begin"})),ye.terminatorEnd&&pe.addRule(ye.terminatorEnd,{type:"end"}),ye.illegal&&pe.addRule(ye.illegal,{type:"illegal"}),pe}function Ge(ye,pe){const Ae=ye;if(ye.isCompiled)return Ae;[C,te,Jn,V].forEach(Je=>Je(ye,pe)),S.compilerExtensions.forEach(Je=>Je(ye,pe)),ye.__beforeBegin=null,[F,$,W].forEach(Je=>Je(ye,pe)),ye.isCompiled=!0;let st=null;return typeof ye.keywords=="object"&&ye.keywords.$pattern&&(ye.keywords=Object.assign({},ye.keywords),st=ye.keywords.$pattern,delete ye.keywords.$pattern),st=st||/\w+/,ye.keywords&&(ye.keywords=ge(ye.keywords,S.case_insensitive)),Ae.keywordPatternRe=X(st,!0),pe&&(ye.begin||(ye.begin=/\B|\b/),Ae.beginRe=X(Ae.begin),!ye.end&&!ye.endsWithParent&&(ye.end=/\B|\b/),ye.end&&(Ae.endRe=X(Ae.end)),Ae.terminatorEnd=p(Ae.end)||"",ye.endsWithParent&&pe.terminatorEnd&&(Ae.terminatorEnd+=(ye.end?"|":"")+pe.terminatorEnd)),ye.illegal&&(Ae.illegalRe=X(ye.illegal)),ye.contains||(ye.contains=[]),ye.contains=[].concat(...ye.contains.map(function(Je){return gi(Je==="self"?ye:Je)})),ye.contains.forEach(function(Je){Ge(Je,Ae)}),ye.starts&&Ge(ye.starts,pe),Ae.matcher=We(Ae),Ae}if(S.compilerExtensions||(S.compilerExtensions=[]),S.contains&&S.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return S.classNameAliases=a(S.classNameAliases||{}),Ge(S)}function wr(S){return S?S.endsWithParent||wr(S.starts):!1}function gi(S){return S.variants&&!S.cachedVariants&&(S.cachedVariants=S.variants.map(function(X){return a(S,{variants:null},X)})),S.cachedVariants?S.cachedVariants:wr(S)?a(S,{starts:S.starts?a(S.starts):null}):Object.isFrozen(S)?a(S):S}var yi="11.12.0",br=class extends Error{constructor(S,X){super(S),this.name="HTMLInjectionError",this.html=X}},In=i,nn=a,rn=Symbol("nomatch"),_i=7,vr=function(S){const X=Object.create(null),fe=Object.create(null),Me=[];let We=!0;const Ge="Could not find the language '{}', did you forget to load/include a language module?",ye={disableAutodetect:!0,name:"Plain text",contains:[]};let pe={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:d};function Ae(ne){return pe.noHighlightRe.test(ne)}function st(ne){let ve=ne.className+" ";ve+=ne.parentNode?ne.parentNode.className:"";const Ie=pe.languageDetectRe.exec(ve);if(Ie){const Ve=Yt(Ie[1]);return Ve||(qe(Ge.replace("{}",Ie[1])),qe("Falling back to no-highlight mode for this block.",ne)),Ve?Ie[1]:"no-highlight"}return ve.split(/\s+/).find(Ve=>Ae(Ve)||Yt(Ve))}function Je(ne,ve,Ie){let Ve="",nt="";typeof ve=="object"?(Ve=ne,Ie=ve.ignoreIllegals,nt=ve.language):(Be("10.7.0","highlight(lang, code, ...args) has been deprecated."),Be("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),nt=ne,Ve=ve),Ie===void 0&&(Ie=!0);const Ct={code:Ve,language:nt};sn("before:highlight",Ct);const Tt=Ct.result?Ct.result:fn(Ct.language,Ct.code,Ie);return Tt.code=Ct.code,sn("after:highlight",Tt),Tt}function fn(ne,ve,Ie,Ve){const nt=Object.create(null);function Ct(I,q){return I.keywords[q]}function Tt(){if(!Te.keywords){rt.addText(He);return}let I=0;Te.keywordPatternRe.lastIndex=0;let q=Te.keywordPatternRe.exec(He),ue="";for(;q;){ue+=He.substring(I,q.index);const we=Ft.case_insensitive?q[0].toLowerCase():q[0],Le=Ct(Te,we);if(Le){const[it,St]=Le;if(rt.addText(ue),ue="",nt[we]=(nt[we]||0)+1,nt[we]<=_i&&(K+=St),it.startsWith("_"))ue+=q[0];else{const gn=Ft.classNameAliases[it]||it;Gt(q[0],gn)}}else ue+=q[0];I=Te.keywordPatternRe.lastIndex,q=Te.keywordPatternRe.exec(He)}ue+=He.substring(I),rt.addText(ue)}function Rt(){if(He==="")return;let I=null;if(typeof Te.subLanguage=="string"){if(!X[Te.subLanguage]){rt.addText(He);return}I=fn(Te.subLanguage,He,!0,Tr[Te.subLanguage]),Tr[Te.subLanguage]=I._top}else I=kr(He,Te.subLanguage.length?Te.subLanguage:null);Te.relevance>0&&(K+=I.relevance),rt.__addSublanguage(I._emitter,I.language)}function wt(){Te.subLanguage!=null?Rt():Tt(),He=""}function Gt(I,q){I!==""&&(rt.startScope(q),rt.addText(I),rt.endScope())}function pn(I,q){let ue=1;const we=q.length-1;for(;ue<=we;){if(!I._emit[ue]){ue++;continue}const Le=Ft.classNameAliases[I[ue]]||I[ue],it=q[ue];Le?Gt(it,Le):(He=it,Tt(),He=""),ue++}}function Lt(I,q){return I.scope&&typeof I.scope=="string"&&rt.openNode(Ft.classNameAliases[I.scope]||I.scope),I.beginScope&&(I.beginScope._wrap?(Gt(He,Ft.classNameAliases[I.beginScope._wrap]||I.beginScope._wrap),He=""):I.beginScope._multi&&(pn(I.beginScope,q),He="")),Te=Object.create(I,{parent:{value:Te}}),Te}function Ei(I,q,ue){let we=x(I.endRe,ue);if(we){if(I["on:end"]){const Le=new r(I);I["on:end"](q,Le),Le.isMatchIgnored&&(we=!1)}if(we){for(;I.endsParent&&I.parent;)I=I.parent;return I}}if(I.endsWithParent)return Ei(I.parent,q,ue)}function er(I){return Te.matcher.regexIndex===0?(He+=I[0],1):(Y=!0,0)}function Ea(I){const q=I[0],ue=I.rule,we=new r(ue),Le=[ue.__beforeBegin,ue["on:begin"]];for(const it of Le)if(it&&(it(I,we),we.isMatchIgnored))return er(q);return ue.skip?He+=q:(ue.excludeBegin&&(He+=q),wt(),!ue.returnBegin&&!ue.excludeBegin&&(He=q)),Lt(ue,I),ue.returnBegin?0:q.length}function Ai(I){const q=I[0],ue=ve.substring(I.index),we=Ei(Te,I,ue);if(!we)return rn;const Le=Te;Te.endScope&&Te.endScope._wrap?(wt(),Gt(q,Te.endScope._wrap)):Te.endScope&&Te.endScope._multi?(wt(),pn(Te.endScope,I)):Le.skip?He+=q:(Le.returnEnd||Le.excludeEnd||(He+=q),wt(),Le.excludeEnd&&(He=q));do Te.scope&&rt.closeNode(),!Te.skip&&!Te.subLanguage&&(K+=Te.relevance),Te=Te.parent;while(Te!==we.parent);return we.starts&&Lt(we.starts,I),Le.returnEnd?0:q.length}function mn(){const I=[];for(let q=Te;q!==Ft;q=q.parent)q.scope&&I.unshift(q.scope);I.forEach(q=>rt.openNode(q))}let Dn={};function Er(I,q){const ue=q&&q[0];if(He+=I,ue==null)return wt(),0;if(Dn.type==="begin"&&q.type==="end"&&Dn.index===q.index&&ue===""){if(He+=ve.slice(q.index,q.index+1),!We){const we=new Error(`0 width match regex (${ne})`);throw we.languageName=ne,we.badRule=Dn.rule,we}return 1}if(Dn=q,q.type==="begin")return Ea(q);if(q.type==="illegal"&&!Ie){const we=new Error('Illegal lexeme "'+ue+'" for mode "'+(Te.scope||"<unnamed>")+'"');throw we.mode=Te,we}else if(q.type==="end"){const we=Ai(q);if(we!==rn)return we}if(q.type==="illegal"&&ue==="")return q.index===ve.length||(He+=`
`),1;if(T>1e5&&T>q.index*3)throw new Error("potential infinite loop, way more iterations than matches");return He+=ue,ue.length}const Ft=Yt(ne);if(!Ft)throw Se(Ge.replace("{}",ne)),new Error('Unknown language: "'+ne+'"');const Ti=Kn(Ft);let Ar="",Te=Ve||Ti;const Tr={},rt=new pe.__emitter(pe);mn();let He="",K=0,v=0,T=0,Y=!1;try{if(Ft.__emitTokens)Ft.__emitTokens(ve,rt);else{for(Te.matcher.considerAll();;){T++,Y?Y=!1:Te.matcher.considerAll(),Te.matcher.lastIndex=v;const I=Te.matcher.exec(ve);if(!I)break;const q=Er(ve.substring(v,I.index),I);v=I.index+q}Er(ve.substring(v))}return rt.finalize(),Ar=rt.toHTML(),{language:ne,value:Ar,relevance:K,illegal:!1,_emitter:rt,_top:Te}}catch(I){if(I.message&&I.message.includes("Illegal"))return{language:ne,value:In(ve),illegal:!0,relevance:0,_illegalBy:{message:I.message,index:v,context:ve.slice(v-100,v+100),mode:I.mode,resultSoFar:Ar},_emitter:rt};if(We)return{language:ne,value:In(ve),illegal:!1,relevance:0,errorRaised:I,_emitter:rt,_top:Te};throw I}}function On(ne){const ve={value:In(ne),illegal:!1,relevance:0,_top:ye,_emitter:new pe.__emitter(pe)};return ve._emitter.addText(ne),ve}function kr(ne,ve){ve=ve||pe.languages||Object.keys(X);const Ie=On(ne),Ve=ve.filter(Yt).filter(xi).map(Rt=>fn(Rt,ne,!1));Ve.unshift(Ie);const[nt,Ct]=Ve.sort((Rt,wt)=>{if(Rt.relevance!==wt.relevance)return wt.relevance-Rt.relevance;if(Rt.language&&wt.language){if(Yt(Rt.language).supersetOf===wt.language)return 1;if(Yt(wt.language).supersetOf===Rt.language)return-1}return 0}),Tt=nt;return Tt.secondBest=Ct,Tt}function zn(ne,ve,Ie){const Ve=ve&&fe[ve]||Ie;ne.classList.add("hljs"),ne.classList.add(`language-${Ve}`)}function xr(ne){let ve=null;const Ie=st(ne);if(Ae(Ie))return;if(sn("before:highlightElement",{el:ne,language:Ie}),ne.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",ne);return}if(ne.children.length>0&&(pe.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(ne)),pe.throwUnescapedHTML))throw new br("One of your code blocks includes unescaped HTML.",ne.innerHTML);ve=ne;const Ve=ve.textContent,nt=Ie?Je(Ve,{language:Ie,ignoreIllegals:!0}):kr(Ve);ne.innerHTML=nt.value,ne.dataset.highlighted="yes",zn(ne,Ie,nt.language),ne.result={language:nt.language,re:nt.relevance,relevance:nt.relevance},nt.secondBest&&(ne.secondBest={language:nt.secondBest.language,relevance:nt.secondBest.relevance}),sn("after:highlightElement",{el:ne,result:nt,text:Ve})}function xa(ne){pe=nn(pe,ne)}const et=()=>{$n(),Be("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function dn(){$n(),Be("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let wi=!1;function $n(){function ne(){$n()}if(document.readyState==="loading"){wi||window.addEventListener("DOMContentLoaded",ne,!1),wi=!0;return}document.querySelectorAll(pe.cssSelector).forEach(xr)}function Sr(ne,ve){let Ie=null;try{Ie=ve(S)}catch(Ve){if(Se("Language definition for '{}' could not be registered.".replace("{}",ne)),We)Se(Ve);else throw Ve;Ie=ye}Ie.name||(Ie.name=ne),X[ne]=Ie,Ie.rawDefinition=ve.bind(null,S),Ie.aliases&&ki(Ie.aliases,{languageName:ne})}function bi(ne){delete X[ne];for(const ve of Object.keys(fe))fe[ve]===ne&&delete fe[ve]}function vi(){return Object.keys(X)}function Yt(ne){return ne=(ne||"").toLowerCase(),X[ne]||X[fe[ne]]}function ki(ne,{languageName:ve}){typeof ne=="string"&&(ne=[ne]),ne.forEach(Ie=>{fe[Ie.toLowerCase()]=ve})}function xi(ne){const ve=Yt(ne);return ve&&!ve.disableAutodetect}function Sa(ne){ne["before:highlightBlock"]&&!ne["before:highlightElement"]&&(ne["before:highlightElement"]=ve=>{ne["before:highlightBlock"](Object.assign({block:ve.el},ve))}),ne["after:highlightBlock"]&&!ne["after:highlightElement"]&&(ne["after:highlightElement"]=ve=>{ne["after:highlightBlock"](Object.assign({block:ve.el},ve))})}function Qt(ne){Sa(ne),Me.push(ne)}function Si(ne){const ve=Me.indexOf(ne);ve!==-1&&Me.splice(ve,1)}function sn(ne,ve){const Ie=ne;Me.forEach(function(Ve){Ve[Ie]&&Ve[Ie](ve)})}function on(ne){return Be("10.7.0","highlightBlock will be removed entirely in v12.0"),Be("10.7.0","Please use highlightElement now."),xr(ne)}Object.assign(S,{highlight:Je,highlightAuto:kr,highlightAll:$n,highlightElement:xr,highlightBlock:on,configure:xa,initHighlighting:et,initHighlightingOnLoad:dn,registerLanguage:Sr,unregisterLanguage:bi,listLanguages:vi,getLanguage:Yt,registerAliases:ki,autoDetection:xi,inherit:nn,addPlugin:Qt,removePlugin:Si}),S.debugMode=function(){We=!1},S.safeMode=function(){We=!0},S.versionString=yi,S.regex={concat:h,lookahead:m,either:w,optional:y,anyNumberOfTimes:g};for(const ne in G)typeof G[ne]=="object"&&n(G[ne]);return Object.assign(S,G),S},an=vr({});an.newInstance=()=>vr({}),t.exports=an,an.HighlightJS=an,an.default=an})),bu=Al(wu()),Ye=bu.default,Xt=64,vu=6,ku=63,no=.673,xu=27;function Su(e){return e=e+2654435761|0,e=Math.imul(e^e>>>16,73244475),e=Math.imul(e^e>>>16,73244475),(e^e>>>16)>>>0}var Eu=class{registers;constructor(){this.registers=new Uint8Array(Xt)}addHash(e){const t=Su(e|0),n=t&ku,r=t>>>vu,i=r===0?xu:Math.min(26,Math.clz32(r)-5);i>this.registers[n]&&(this.registers[n]=i)}cardinality(){let e=0,t=0;for(let n=0;n<Xt;n++){const r=this.registers[n];e+=Math.pow(2,-r),r===0&&(t+=1)}if(t===Xt)return 0;if(t>0){const n=no*Xt*Xt/e;return n<=Xt*2.5?Math.max(1,Math.round(Xt*Math.log(Xt/t))):Math.round(n)}return Math.round(no*Xt*Xt/e)}reset(){this.registers.fill(0)}},ro=64,io=4,ao=10;function Au(e,t){return e=e+t|0,e=Math.imul(e^e>>>16,73244475),e=Math.imul(e^e>>>16,73244475),(e^e>>>16)>>>0}function Tu(e){const t=String(e);let n=-2128831035;for(let r=0;r<t.length;r+=1)n=Math.imul(n^t.charCodeAt(r),16777619);return n}function Mu(e){const t=typeof e;return t==="function"||t==="object"&&e!==null}var Cu=class{constructor({width:e=ro,depth:t=io,sampleSize:n=ao,seed:r}={}){const i=Math.max(2,1<<Math.ceil(Math.log2(Math.max(2,Math.floor(Number(e)||ro))))),a=Math.max(1,Math.min(8,Math.floor(Number(t)||io)));this.width=i,this.depth=a,this.mask=i-1,this.sampleSize=Math.max(1,Math.floor(Number(n)||ao)),this.counters=new Uint8Array(i*a>>>1),this.sample=0,this.resets=0,this.seed=(Number.isFinite(r)?Number(r):Math.floor(Math.random()*4294967295))|0,this._hll=new Eu,this._ids=null,this._nextId=0}_hash(e){if(!Mu(e))return Tu(e);const t=this._ids||(this._ids=new WeakMap);let n=t.get(e);return n===void 0&&(n=this._nextId,this._nextId+=1,t.set(e,n)),n|0}size(){return this.counters.byteLength}_indexFor(e,t){return t*this.width+(Au(e,this.seed+t*2654435761)&this.mask)|0}_get(e){const t=this.counters[e>>1];return e&1?t>>>4:t&15}_set(e,t){const n=e>>1,r=this.counters[n];this.counters[n]=e&1?(r&15|(t&15)<<4)&255:r&240|t&15}increment(e){const t=this._hash(e);let n=!1;for(let r=0;r<this.depth;r+=1){const i=this._indexFor(t,r),a=this._get(i);a<15&&(this._set(i,a+1),n=!0)}n&&(this._hll.addHash(t),this.sample+=1,this.sample>=this.sampleSize&&(this.reset(),this.sample=0))}estimate(e){const t=this._hash(e);let n=15;for(let r=0;r<this.depth;r+=1){const i=this._get(this._indexFor(t,r));i<n&&(n=i)}return n}reset(){const e=this.counters,t=e.length;if(t>=4){const r=new Uint32Array(e.buffer,e.byteOffset,t>>>2);for(let i=0;i<r.length;i+=1){const a=r[i];r[i]=a>>>1&117901063|(a>>>5&117901063)<<4}}for(let r=t&-4;r<t;r+=1)e[r]=e[r]>>>1&7|(e[r]>>>5&7)<<4;this.resets+=1;const n=this._hll.cardinality();this._hll.reset(),this.sampleSize=Math.max(10,Math.round(10*n))}clear(){this.counters.fill(0),this.sample=0,this.resets=0}};var Ru=".";function Lu(e,t){const n={};if(typeof e!="string"||e===""||t==null||typeof t!="object")return n;const r=(i,a)=>{for(const[o,s]of Object.entries(i)){const l=a?`${a}${Ru}${o}`:o;s==null?n[l]=null:Array.isArray(s)||(typeof s=="object"?r(s,l):typeof s=="number"&&!Number.isFinite(s)?n[l]=String(s):(typeof s=="number"||typeof s=="boolean"||typeof s=="string")&&(n[l]=s))}};return r(t,e),n}var Pu=class{constructor(e={}){xt(e,["prefix"],"MetricsCollector"),this._sources=new Map,this._prefix=typeof e?.prefix=="string"?e.prefix:""}register(e,t){if(typeof e!="string"||e==="")throw new TypeError("MetricsCollector.register: `name` must be a non-empty string");if(typeof t!="function")throw new TypeError("MetricsCollector.register: `read` must be a function");return this._sources.set(e,t),this}unregister(e){return this._sources.delete(e)}snapshot(){const e={},t={};for(const[n,r]of this._sources){let i;try{i=r()}catch(o){t[n]=si(o)?o.message:String(o);continue}const a=Lu(this._prefix+n,i);for(const[o,s]of Object.entries(a))e[o]=s}return{version:1,collectedAt:Date.now(),sources:[...this._sources.keys()],series:e,errors:t}}names(){return[...this._sources.keys()]}},Nu=new Pu;function Es(e,t,n){const r=n?.observability;if(!r)return null;if(r!==!0){if(!(typeof r=="object"&&typeof r.register=="function"))throw new TypeError(`${t}: \`observability\` must be \`true\` or a MetricsCollector, not ${typeof r} (${String(r)}).`)}const i=r===!0?Nu:r,a=e,o=a?.getStats,s=a?.stats,l=typeof o=="function"?()=>o.call(a):typeof s=="function"?()=>s.call(a):null;return l?(i.register(t,l),{name:t,unregister:()=>i.unregister(t)}):null}function As(e){return!e||typeof e.unregister!="function"?!1:e.unregister()}function Ta(e,t,n={}){const r=setTimeout(e,t);return!n.keepProcessAlive&&typeof r?.unref=="function"&&r.unref(),r}function Ma(e,t,n={}){const r=setInterval(e,t);return!n.keepProcessAlive&&typeof r?.unref=="function"&&r.unref(),r}var da=1e3,Iu=60*da,Ka=30*da,Ou=1e4,fm=Object.freeze({CONNECTING:0,OPEN:1,CLOSING:2,CLOSED:3}),so=1e4,oo=.2,lo=1e3;var co=60*da,zu=1e3,uo=Iu,$u=1e3,Du=5e3,Bu=.05,Uu=.7,Fu=200,Wu=16,ju=4,qu=1e6;function Hu(e){const t=Math.min(Math.max(1,Number(e)||1),qu),n=Math.ceil(Wu*t/ju);return Math.max(2,1<<Math.ceil(Math.log2(n)))}var Gu=Object.freeze(["map","head","tail","pool","currentWeight","hits","misses","evictions","rejected","expirations"]),Vu=Object.freeze(["maxEntries","maxInflightRefreshes","maxWeight","weightFn","defaultTTL","maxPoolSize","rejectOversized","onEvict","onExpire","initialPoolSize","maxCleanupPerTick","defaultAsyncTimeout","now","onError","admission","windowSize","seed","policy","allowStale","staleTtl","fetchMethod","observability"]),oi=class{constructor(e={}){xt(e,Vu,"PowerCache");const{maxEntries:t=1/0,maxInflightRefreshes:n,maxWeight:r=1/0,weightFn:i=()=>1,defaultTTL:a=uo,allowStale:o=!1,staleTtl:s=1/0,fetchMethod:l=null,maxPoolSize:c=zu,rejectOversized:u=!1,onEvict:f=null,onExpire:d=null,initialPoolSize:p=0,maxCleanupPerTick:m=100,defaultAsyncTimeout:g=Ka,onError:y=null,policy:h="lru",admission:_="none",windowSize:w=0,seed:b,now:x}=e;if(arguments.length>0&&arguments[0]!=null&&typeof arguments[0]!="object")throw new TypeError("PowerCache options must be an object");if(this.maxEntries=Fe(t,{name:"maxEntries",className:"PowerCache",integer:!0,min:0,allowInfinity:!0}),n===void 0?this.maxInflightRefreshes=Number.isFinite(this.maxEntries)?this.maxEntries:1024:this.maxInflightRefreshes=Fe(n,{name:"maxInflightRefreshes",className:"PowerCache",integer:!0,min:0}),this.maxWeight=Fe(r,{name:"maxWeight",className:"PowerCache",min:0,allowInfinity:!0}),this.maxPoolSize=Fe(c,{name:"maxPoolSize",className:"PowerCache",integer:!0,min:0,allowInfinity:!0}),this.weightFn=ou(i,{name:"weightFn",className:"PowerCache"})?i:()=>1,this.defaultTTL=a,this.allowStale=!!o,s!==1/0&&!(Number.isFinite(s)&&s>=0))throw new TypeError(`PowerCache: \`staleTtl\` must be a non-negative finite number or Infinity (received ${String(s)}). An unparseable stale window would compare false against every entry and silently disable stale serving.`);if(this.allowStale&&!("staleTtl"in arguments[0]))throw new TypeError("PowerCache: `allowStale` requires an explicit `staleTtl`. A stale window with no bound serves a value expired at any point in the past — measured at five years — so the bound is required. Pass the window you can tolerate, or `staleTtl: Infinity` to opt out of it on purpose.");if(this.staleTtl=s,l!=null&&typeof l!="function")throw new TypeError("fetchMethod must be a function when supplied");this.fetchMethod=l,this._now=typeof x=="function"?x:tt,this.rejectOversized=!!u,this.onEvict=typeof f=="function"?f:null,this.onError=typeof y=="function"?y:null,this._weightErrors=0,this.onExpire=typeof d=="function"?d:null,this.maxCleanupPerTick=Number.isFinite(+m)?Math.max(1,+m):100,this._map=new Map,this._head=null,this._tail=null,this._pool=[];for(let D=0;D<Math.min(p||0,this.maxPoolSize);D++)this._pool.push({key:null,value:null,weight:0,expiresAt:0,prev:null,next:null,inWindow:!1,visited:!1,queue:"main"});this._currentWeight=0,this._hits=0,this._staleServes=0,this._misses=0,this._evictions=0,this._refreshesSkipped=0,this._refreshesFailed=0,this._refreshesAborted=0,this._rejected=0,this._rejectedAdmission=0,this._expirations=0;for(const D of Gu){const B=`_${D}`;Object.defineProperty(this,D,{configurable:!0,enumerable:!1,get(){return this[B]},set(j){this[B]=j}})}if(this._cleanupTimer=null,this._cleanupRunning=!1,this._cleanupParams=null,this._cleanupCursor=null,this._cleanupCursorValid=!1,this._evictionCandidate=null,this._sieveHand=null,this._smallHead=null,this._smallTail=null,this._smallSize=0,this._ghostHead=null,this._ghostTail=null,this._ghostSize=0,this._smallMaxSize=0,this._ghostMaxSize=0,this._ghostMap=new Map,this._smallMap=new Map,this._policy=h==="slru"?"slru":h==="sieve"?"sieve":h==="s3fifo"?"s3fifo":"lru",this._policy==="s3fifo"){const D=Number.isFinite(this.maxEntries)?this.maxEntries:1e3;this._smallMaxSize=Math.max(1,Math.floor(D*.1)),this._ghostMaxSize=Math.max(1,Math.floor(D*.2))}const z=su(b,"PowerCache");this._sketch=_==="tinylfu"&&this._policy==="lru"?new Cu({width:Hu(this.maxEntries),sampleSize:Math.max(1,Fu*Math.min(this.maxEntries,1e6)),seed:z}):null,this._windowSize=this._sketch&&this._policy==="lru"?w===null?Math.min(Math.max(4,Math.ceil(this.maxEntries*.01)),Math.floor(this.maxEntries/4)):Math.max(0,Math.floor(Number(w)||0)):0,this._windowSize>=this.maxEntries&&this.maxEntries>=4&&(this._windowSize=Math.floor(this.maxEntries/4)),this._windowStartMemo=null,this._windowTail=null,this._probationEnd=null,this._inflightPromises=new Map,this._inflightControllers=new Map,this._defaultAsyncTimeout=Number.isFinite(Number(g))?Math.max(0,Math.floor(Number(g))):3e4,this._metrics=Es(this,"cache",arguments[0]||{})}_allocNode(e,t,n,r){const i=this._pool.pop()||{key:null,value:null,weight:0,expiresAt:0,prev:null,next:null,inWindow:!1,visited:!1,queue:"main"};return i.key=e,i.value=t,i.weight=n||0,i.expiresAt=r||0,i.prev=null,i.next=null,i.inWindow=!1,i.visited=!1,i.queue="main",i}_computeWeight(e,t){if(t!=null){const n=+t;return Number.isFinite(n)?Math.max(0,n):0}try{const n=+this.weightFn(e);return Number.isFinite(n)?Math.max(0,n):0}catch(n){return this._weightErrors++,this._notifyError(n,"PowerCache weightFn threw"),0}}_notifyError(e,t){try{if(typeof this.onError=="function"){this.onError(e,t);return}}catch{}try{typeof console<"u"&&typeof console.error=="function"&&console.error(t,e)}catch{}}_freeNode(e){e.key=null,e.value=null,e.weight=0,e.expiresAt=0,e.prev=null,e.next=null,this._pool.length<this.maxPoolSize&&this._pool.push(e)}_removeExpiredNode(e,t){if(!e.expiresAt||e.expiresAt>t)return!1;const n=e.key,r=e.value;this._unlinkNode(e);try{this.onExpire&&this.onExpire(n,r)}catch(i){this._notifyError(i,"PowerCache onExpire callback threw")}return this._freeNode(e),this._expirations++,!0}_fetchValidNode(e,{ignoreExpiry:t=!1,countMiss:n=!1,allowExpired:r=!1,now:i}={}){let a=this._map.get(e);if(!a&&(this._policy==="s3fifo"&&(a=this._smallMap.get(e)||this._ghostMap.get(e)),!a))return n&&this._misses++,null;const o=t||!a.expiresAt?0:i!==void 0?i:this._now();return o&&a.expiresAt<=o?r?a:(this._removeExpiredNode(a,o),n&&this._misses++,null):a}_staleServable(e,t){return this.staleTtl===1/0?!0:t<=e.expiresAt+this.staleTtl}_abortInflight(e,t="evicted"){const n=this._inflightControllers.get(e);return!n||n.signal.aborted?!1:(n.abort(new Error(`PowerCache: in-flight fetch for a ${t} key was aborted`)),this._refreshesAborted+=1,!0)}_refreshStaleEntry(e,t,{ttl:n=void 0,weight:r=void 0}={}){if(this._inflightPromises.has(e))return;if(this._inflightPromises.size>=this.maxInflightRefreshes){this._refreshesSkipped+=1;return}const i=new AbortController,a=Promise.resolve().then(()=>t(i.signal)).then(o=>{try{this.set(e,o,{ttl:n,weight:r})}catch(s){this._notifyError(s,"PowerCache: storing a refreshed value threw")}return o}).catch(()=>{i.signal.aborted||(this._refreshesFailed+=1)}).finally(()=>{this._inflightControllers.delete(e),this._inflightPromises.delete(e)});this._inflightPromises.set(e,a),this._inflightControllers.set(e,i)}_append(e){if(!this._tail){if(this._policy==="s3fifo"){this._s3fifoAppendSmall(e);return}this._head=this._tail=e,this._evictionCandidate=this._head,this._policy==="slru"&&(this._probationEnd=e),this._policy==="sieve"&&(this._sieveHand=e);return}if(this._policy==="slru"){this._insertIntoProbation(e);return}if(this._policy==="sieve"){e.prev=this._tail,e.next=null,this._tail.next=e,this._tail=e;return}if(this._policy==="s3fifo"){this._s3fifoAppendSmall(e);return}e.prev=this._tail,e.next=null,this._tail.next=e,this._tail=e}_insertIntoProbation(e){const t=this._probationEnd;if(!t)e.next=this._head,e.prev=null,this._head&&(this._head.prev=e),this._head=e,this._evictionCandidate=e;else if(t===this._tail)e.prev=this._tail,e.next=null,this._tail.next=e,this._tail=e;else{const n=t.next;n&&(e.prev=t,e.next=n,t.next=e,n.prev=e)}this._probationEnd=e}_unlinkNode(e,{advanceEvictionCandidate:t=!1}={}){const n=e.next;return this._map.delete(e.key),this._currentWeight-=e.weight||0,this._cleanupCursor===e&&(this._cleanupCursor=n),this._cleanupCursorValid=!!this._cleanupCursor,t&&(this._evictionCandidate=n),this._remove(e),n}_remove(e){const t=e.prev,n=e.next;t?t.next=n:this._head=n,t||(this._evictionCandidate=this._head),n?n.prev=t:this._tail=t,this._probationEnd===e&&(this._probationEnd=t),this._policy==="sieve"&&this._sieveHand===e&&(this._sieveHand=e.next||this._head),this._policy==="s3fifo"&&(e.queue==="small"?this._s3fifoRemoveFromSmall(e):e.queue==="ghost"&&this._s3fifoRemoveFromGhost(e)),e.inWindow&&(this._windowStartMemo=null,this._windowTail=null),e.prev=e.next=null}_s3fifoAppendSmall(e){this._smallTail?(this._smallTail.next=e,e.prev=this._smallTail,this._smallTail=e):this._smallHead=this._smallTail=e,e.next=null,e.queue="small",this._smallMap.set(e.key,e),this._smallSize+=1}_s3fifoAppendMain(e){this._tail?(e.prev=this._tail,e.next=null,this._tail.next=e,this._tail=e):(this._head=this._tail=e,this._evictionCandidate=this._head),this._map.set(e.key,e)}_s3fifoAppendGhost(e){this._ghostTail?(this._ghostTail.next=e,e.prev=this._ghostTail,this._ghostTail=e):this._ghostHead=this._ghostTail=e,e.next=null,e.queue="ghost",this._ghostMap.set(e.key,e),this._ghostSize+=1}_s3fifoRemoveFromSmall(e){const t=e.prev,n=e.next;t?t.next=n:this._smallHead=n,n?n.prev=t:this._smallTail=t,this._smallMap.delete(e.key),this._smallSize-=1}_s3fifoRemoveFromGhost(e){const t=e.prev,n=e.next;t?t.next=n:this._ghostHead=n,n?n.prev=t:this._ghostTail=t,this._ghostMap.delete(e.key),this._ghostSize-=1}_moveToTail(e){if(this._policy==="slru"){const t=this._probationEnd===e,n=e.prev;if(this._tail===e){t&&(this._probationEnd=n);return}this._remove(e),e.prev=this._tail,e.next=null,this._tail&&(this._tail.next=e),this._tail=e,t&&(this._probationEnd=n);return}if(this._policy==="sieve"){e.visited=!0;return}if(this._policy==="s3fifo"){e.queue==="small"?(this._s3fifoRemoveFromSmall(e),e.queue="main",e.prev=null,e.next=null,this._s3fifoAppendMain(e),this._evictIfNeeded()):e.queue==="ghost"&&(this._s3fifoRemoveFromGhost(e),e.queue="main",e.prev=null,e.next=null,this._s3fifoAppendMain(e),this._evictIfNeeded());return}if(this._windowSize>0){if(!e.inWindow){this._remove(e),this._insertAtMainSpaceMrU(e);return}if(this._tail===e)return;this._remove(e),this._append(e);return}this._tail!==e&&(this._remove(e),this._append(e))}_windowOldest(){const e=this._windowStartMemo;if(e!==null&&(e.prev===null||!e.prev.inWindow)&&this._windowTail===this._tail)return e;let t=this._tail;if(!t||!t.inWindow)return this._windowStartMemo=null,this._windowTail=this._tail,null;for(;t.prev&&t.prev.inWindow;)t=t.prev;return this._windowStartMemo=t,this._windowTail=this._tail,t}_windowVictim(){const e=this._windowOldest();return!e||e===this._head?null:e.prev}_insertAtMainSpaceMrU(e){const t=this._windowOldest();if(!t){e.prev=this._tail,e.next=null,this._tail?this._tail.next=e:(this._head=e,this._evictionCandidate=e),this._tail=e;return}const n=t.prev;e.prev=n,e.next=t,n?n.next=e:(this._head=e,this._evictionCandidate=e),t.prev=e}_promoteFromWindow(e){this._remove(e),this._insertAtMainSpaceMrU(e),e.inWindow=!1}_evictNode(e){if(!e)return;const t=e.key,n=e.value;this._unlinkNode(e,{advanceEvictionCandidate:!0}),this._evictions++;try{this.onEvict&&this.onEvict(t,n,"evicted")}catch(r){this._notifyError(r,"PowerCache onEvict callback threw")}this._freeNode(e)}_arbitrateWindow(e){if(this._map.size<=this._windowSize)return;const t=this._windowOldest();if(!t)return;const n=this._windowVictim();if(!(n!=null&&e>=this.maxEntries)){this._promoteFromWindow(t);return}if(!n)return;const r=n.key;this._sketch.estimate(t.key)>this._sketch.estimate(r)?(this._evictNode(n),this._promoteFromWindow(t)):(this._rejectedAdmission+=1,this._evictNode(t))}_evictIfNeeded(){if(this._policy==="sieve"){this._sieveEvict();return}if(this._policy==="s3fifo"){this._s3fifoEvict();return}for(;this._map.size>this.maxEntries||this._currentWeight>this.maxWeight;){const e=this._evictionCandidate||this._head;if(!e)break;const t=e.key,n=e.value;this._abortInflight(t,"evicted"),this._unlinkNode(e,{advanceEvictionCandidate:!0}),this._evictions++;try{this.onEvict&&this.onEvict(t,n,"evicted")}catch(r){this._notifyError(r,"PowerCache onEvict callback threw")}this._freeNode(e)}this._evictionCandidate||(this._evictionCandidate=this._head)}_sieveEvict(){for(;(this._map.size>this.maxEntries||this._currentWeight>this.maxWeight)&&!(!this._sieveHand&&(this._sieveHand=this._head,!this._sieveHand));){const e=this._sieveHand;if(this._sieveHand=e.next||this._tail,e.visited){e.visited=!1;continue}const t=e.key,n=e.value;this._abortInflight(t,"evicted"),this._unlinkNode(e,{advanceEvictionCandidate:!1}),this._evictions++;try{this.onEvict&&this.onEvict(t,n,"evicted")}catch(r){this._notifyError(r,"PowerCache onEvict callback threw")}this._freeNode(e)}}_s3fifoEvict(){for(;this._smallSize>this._smallMaxSize;){const e=this._smallHead;if(!e)break;if(this._ghostSize<this._ghostMaxSize)this._s3fifoRemoveFromSmall(e),this._s3fifoAppendGhost(e);else{this._s3fifoRemoveFromSmall(e),this._evictions++;const t=e.key,n=e.value;this._abortInflight(t,"evicted");try{this.onEvict&&this.onEvict(t,n,"evicted")}catch(r){this._notifyError(r,"PowerCache onEvict callback threw")}this._freeNode(e)}}for(;this._map.size>=this.maxEntries||this._currentWeight>this.maxWeight;){const e=this._evictionCandidate||this._head;if(!e)break;if(this._ghostSize<this._ghostMaxSize)this._unlinkNode(e,{advanceEvictionCandidate:!0}),this._s3fifoAppendGhost(e);else{const t=e.key,n=e.value;this._abortInflight(t,"evicted"),this._unlinkNode(e,{advanceEvictionCandidate:!0}),this._evictions++;try{this.onEvict&&this.onEvict(t,n,"evicted")}catch(r){this._notifyError(r,"PowerCache onEvict callback threw")}this._freeNode(e)}}this._evictionCandidate||(this._evictionCandidate=this._head)}_expiresAt(e,t){return e==null||e===1/0?0:t+Tl(e,"PowerCache")}_rejectIfOversized(e,t,n){if(!this.rejectOversized||!Number.isFinite(this.maxWeight)||n<=this.maxWeight)return!1;this._rejected++;try{this.onEvict&&this.onEvict(e,t,"rejected-oversized")}catch(r){this._notifyError(r,"PowerCache onEvict callback threw (rejected-oversized)")}return!0}_insertNew(e,t,n,r,i){if(this._sketch&&this._windowSize>0){const o=this._allocNode(e,t,n,r);return this._map.set(e,o),o.inWindow=!0,this._append(o),this._currentWeight+=o.weight||0,this._arbitrateWindow(i),!0}if(this._sketch&&this._map.size>=this.maxEntries){const o=this._evictionCandidate||this._head,s=this._sketch.estimate(e);if(o&&this._sketch.estimate(o.key)>=s)return this._rejectedAdmission+=1,!1}const a=this._allocNode(e,t,n,r);return this._policy!=="s3fifo"&&this._map.set(e,a),this._append(a),this._currentWeight+=a.weight||0,!0}set(e,t,{ttl:n=this.defaultTTL,weight:r=null}={}){const i=this._now(),a=this._expiresAt(n,i),o=this._computeWeight(t,r);if(this._rejectIfOversized(e,t,o))return!1;let s=this._map.get(e);if(s===void 0&&this._policy==="s3fifo"&&(s=this._smallMap.get(e)||this._ghostMap.get(e)),s!==void 0)this._updateExisting(s,t,o,a);else if(!this._insertNew(e,t,o,a,this._map.size))return this;return this._sketch?.increment(e),this._evictIfNeeded(),this}_updateExisting(e,t,n,r){this._currentWeight-=e.weight||0,e.value=t,e.weight=n,e.expiresAt=r,this._currentWeight+=e.weight||0,this._moveToTail(e)}get(e){const t=this._fetchValidNode(e,{countMiss:!0});if(t)return this._moveToTail(t),this._hits++,this._sketch?.increment(e),t.value}peek(e){const t=this._fetchValidNode(e);return t?t.value:void 0}has(e,{ignoreExpiry:t=!1}={}){return!!this._fetchValidNode(e,{ignoreExpiry:t})}getOrFetch(e,t,n={}){const r=t??this.fetchMethod;return typeof r!="function"?Promise.reject(new TypeError("PowerCache.getOrFetch: no factory given and no `fetchMethod` configured")):this.getOrSetAsync(e,r,n)}getOrSet(e,t,{ttl:n=void 0,weight:r=void 0,staleWhileRevalidate:i=this.allowStale}={}){const a=this._now(),o=this._fetchValidNode(e,{countMiss:!1,allowExpired:i,now:a});if(o)if(o.expiresAt&&o.expiresAt<=a){if(typeof t=="function"&&this._staleServable(o,a))return this._moveToTail(o),this._hits++,this._staleServes++,this._refreshStaleEntry(e,t,{ttl:n,weight:r}),o.value;this._removeExpiredNode(o,a),this._misses++}else return this._moveToTail(o),this._hits++,o.value;else this._misses++;if(typeof t=="function"){const s=t();return typeof s?.then=="function"?s.then(l=>{try{this.set(e,l,{ttl:n,weight:r})}catch(c){this._notifyError(c,"PowerCache: storing an async value threw")}return l}):(this.set(e,s,{ttl:n,weight:r}),s)}return this.set(e,t,{ttl:n,weight:r}),t}setMany(e,{ttl:t=void 0,weight:n=void 0}={}){const r=this._now(),i=this._expiresAt(t,r);for(const a of e){if(!a)continue;const[o,s]=a,l=this._computeWeight(s,n);if(this._rejectIfOversized(o,s,l))continue;const c=this._map.get(o);if(c!==void 0)this._updateExisting(c,s,l,i);else if(!this._insertNew(o,s,l,i,this._map.size))continue;this._sketch?.increment(o)}return this._evictIfNeeded(),this}getMany(e,{ignoreExpiry:t=!1}={}){const n=new Map;for(const r of e){const i=this._fetchValidNode(r,{ignoreExpiry:t,countMiss:!0});i&&(this._moveToTail(i),this._hits++,n.set(r,i.value))}return n}touch(e,t=void 0){const n=this._now(),r=this._fetchValidNode(e,{now:n});return r?(t!==void 0&&(r.expiresAt=this._expiresAt(t,n)),this._moveToTail(r),!0):!1}getOrSetAsync(e,t,{ttl:n=void 0,weight:r=void 0,staleWhileRevalidate:i=this.allowStale,timeout:a=void 0}={}){if(typeof t!="function")return Promise.resolve(this.getOrSet(e,t,{ttl:n,weight:r}));const o=this._now(),s=this._map.get(e);if(s)if(s.expiresAt&&s.expiresAt<=o){if(i&&this._staleServable(s,o))return this._moveToTail(s),this._hits++,this._staleServes++,this._refreshStaleEntry(e,t,{ttl:n,weight:r}),Promise.resolve(s.value);this._removeExpiredNode(s,o)}else return this._moveToTail(s),this._hits++,Promise.resolve(s.value);if(this._inflightPromises.has(e))return this._inflightPromises.get(e);this._misses++;const l=new AbortController;let c;try{c=Promise.resolve().then(()=>t(l.signal))}catch(p){return Promise.reject(p)}const u=Number.isFinite(Number(a))?Math.max(0,Math.floor(Number(a))):Number.isFinite(Number(this._defaultAsyncTimeout))?this._defaultAsyncTimeout:void 0;let f=c;if(typeof u=="number"&&Number.isFinite(u)&&u>0){let p;f=new Promise((m,g)=>{p=setTimeout(()=>{try{g(new Error("getOrSetAsync timeout"))}catch{}},u),c.then(y=>{try{p&&clearTimeout(p)}catch(h){this._notifyError(h,"PowerCache: clearTimeout threw")}m(y)},y=>{try{p&&clearTimeout(p)}catch(h){this._notifyError(h,"PowerCache: clearTimeout threw")}g(y)})})}c.then(p=>{try{this.set(e,p,{ttl:n,weight:r})}catch(m){this._notifyError(m,"PowerCache getOrSetAsync: storing a late value threw")}},()=>{});const d=f.finally(()=>{this._abortInflight(e,"timed out"),this._inflightPromises.delete(e),this._inflightControllers.delete(e)});return this._inflightPromises.set(e,c),this._inflightControllers.set(e,l),d}hasEqual(e,t,n={}){const{ignoreExpiry:r=!1,maxNodes:i,compareFn:a}=n||{},o=this._fetchValidNode(e,{ignoreExpiry:r});if(!o)return!1;const s=o.value;return s===t?!0:typeof s!="object"||s===null||typeof t!="object"||t===null?s===t:ar(s,t,Zu({maxNodes:i,compareFn:a}))}delete(e){this._abortInflight(e,"deleted");let t=this._map.get(e);if(!t&&this._policy==="s3fifo"&&(t=this._smallMap.get(e)||this._ghostMap.get(e)),!t)return!1;this._unlinkNode(t);try{this.onEvict&&this.onEvict(t.key,t.value,"deleted")}catch(n){this._notifyError(n,"PowerCache onEvict callback threw (deleted)")}return this._freeNode(t),!0}invalidate(e){if(typeof e!="function")throw new TypeError(`PowerCache invalidate(predicate): predicate must be a function, got ${typeof e}`);const t=[];for(let r=this._head;r;r=r.next)e(r.key,r.value)&&t.push(r);let n=0;for(const r of t)if(this._map.get(r.key)===r){this._abortInflight(r.key,"invalidated"),this._unlinkNode(r),this._evictions+=1,n+=1;try{this.onEvict&&this.onEvict(r.key,r.value,"invalidated")}catch(i){this._notifyError(i,"PowerCache onEvict callback threw (invalidated)")}this._freeNode(r)}return(!this._evictionCandidate||!Ci(this._evictionCandidate,this._head,this._tail))&&(this._evictionCandidate=this._head),n}evict(e=1){if(typeof e!="number"||!Number.isInteger(e)||e<0)throw new TypeError(`PowerCache evict(count): count must be a non-negative integer number, got ${typeof e=="string"?`'${e}'`:String(e)}`);let t=0;for(;t<e;){const n=this._evictionCandidate||this._head;if(!n)break;this._abortInflight(n.key,"evicted"),this._unlinkNode(n,{advanceEvictionCandidate:!0}),this._evictions+=1,t+=1;try{this.onEvict&&this.onEvict(n.key,n.value,"evicted")}catch(r){this._notifyError(r,"PowerCache onEvict callback threw")}this._freeNode(n)}return this._evictionCandidate||(this._evictionCandidate=this._head),t}clear(){for(const e of[...this._inflightPromises.keys()])this._abortInflight(e,"cleared");for(let e=this._head;e;){const t=e.next;this._freeNode(e),e=t}this._head=this._tail=null,this._map.clear(),this._smallMap?.clear(),this._ghostMap?.clear(),this._smallSize=0,this._ghostSize=0,this._smallHead=this._smallTail=null,this._ghostHead=this._ghostTail=null,this._sieveHand=null,this._sketch?.clear(),this._rejectedAdmission=0,this._currentWeight=0,this._cleanupCursor=null,this._cleanupCursorValid=!1,this._evictionCandidate=null,this._probationEnd=null,this._inflightPromises.clear()}cleanupExpired(){return this.cleanupExpiredUpTo()}cleanupExpiredUpTo(e=1/0){const t=this._now();let n=0,r=this._cleanupCursor&&this._cleanupCursorValid?this._cleanupCursor:this._head;for(;r&&n<e;){const i=r.next;if(r.expiresAt&&r.expiresAt<=t){const a=r.key,o=r.value;this._unlinkNode(r);try{this.onExpire&&this.onExpire(a,o)}catch(s){this._notifyError(s,"PowerCache onExpire callback threw")}this._freeNode(r),this._expirations++}r=i,n++}return this._cleanupCursor=r||this._head,this._cleanupCursorValid=!!this._cleanupCursor,n}startCleanup(e={}){const t={name:"interval",className:"PowerCache",min:1,integer:!0,fallback:Math.max(da,Math.min(this.defaultTTL||6e4,uo))};let n,r;if(typeof e=="number")n=Fe(e,t),r=this.maxCleanupPerTick;else{const i=e.interval??e.intervalMs;n=Fe(i,t),r=Number.isFinite(Number(e.maxCleanupPerTick))?Math.max(1,Number(e.maxCleanupPerTick)):this.maxCleanupPerTick}this.stopCleanup(),this._cleanupParams={interval:n,maxCleanupPerTick:r},this._cleanupTimer=Ta(()=>this._cleanupTick(),n)}stopCleanup(){this._cleanupTimer&&(clearTimeout(this._cleanupTimer),this._cleanupTimer=null),this._cleanupRunning=!1,this._cleanupParams=null}dispose(){this[Symbol.dispose]()}[Symbol.dispose](){As(this._metrics),this._metrics=null;try{this.stopCleanup()}catch{}try{this.clear()}catch{}}async[Symbol.asyncDispose](){try{this.stopCleanup()}catch{}try{this.clear()}catch{}}_cleanupTick(){if(this._cleanupTimer!=null){if(this._cleanupRunning){this._cleanupParams&&(this._cleanupTimer=Ta(()=>this._cleanupTick(),this._cleanupParams.interval));return}this._cleanupRunning=!0;try{this._cleanupParams&&this.cleanupExpiredUpTo(this._cleanupParams.maxCleanupPerTick)}finally{this._cleanupRunning=!1}this._cleanupParams&&(this._cleanupTimer=Ta(()=>this._cleanupTick(),this._cleanupParams.interval))}}get size(){return this._policy==="s3fifo"?this._map.size+this._smallSize+this._ghostSize:this._map.size}get hitRate(){const e=(this._hits||0)+(this._misses||0);return e?this._hits/e:0}stats(){return{size:this.size,weight:this._currentWeight,hits:this._hits,misses:this._misses,staleServes:this._staleServes,evictions:this._evictions,expirations:this._expirations,rejected:this._rejected,rejectedAdmission:this._rejectedAdmission,weightErrors:this._weightErrors,refreshesSkipped:this._refreshesSkipped,refreshesFailed:this._refreshesFailed,refreshesAborted:this._refreshesAborted,poolSize:this._pool.length}}getStats(){return this.stats()}resize({maxEntries:e,maxWeight:t}={}){Number.isFinite(Number(e))&&(this.maxEntries=Math.max(0,Number(e))),Number.isFinite(Number(t))&&(this.maxWeight=Math.max(0,Number(t))),this._evictIfNeeded(),this._cleanupCursor=null,this._cleanupCursorValid=!1,this._evictionCandidate=this._head}*entries(e="MRU"){const t=e==="MRU"?"prev":"next";let n=e==="MRU"?this._tail:this._head,r=this.size;for(;n;){if(r--<=0)return;const i=n[t];yield[n.key,n.value],Ci(n,this._head,this._tail)?Ci(i,this._head,this._tail)?n=i:n=n[t]:n=Ci(i,this._head,this._tail)?i:null}}[Symbol.iterator](){return this.entries("MRU")}*keys(e="MRU"){for(const[t]of this.entries(e))yield t}*values(e="MRU"){for(const[,t]of this.entries(e))yield t}};function Ci(e,t,n){return e?e.prev!==null||e.next!==null||e===t||e===n:!1}function Zu(e){const t=e||{};return{seen:t.seen??null,nodes:0,maxNodes:Number.isFinite(t.maxNodes)?Math.max(1,Math.floor(Number(t.maxNodes))):Ou,compareFn:typeof t.compareFn=="function"?t.compareFn:null,exhausted:!1}}function ar(e,t,n,r=0){if(r>100)return e===t;if(n.exhausted)return!1;if(n.nodes>=n.maxNodes)return n.exhausted=!0,!1;if(n.nodes+=1,e===t)return!0;if(n.compareFn){const s=n.compareFn(e,t);if(s!==void 0)return!!s}if(e==null||t==null||typeof e!="object"||typeof t!="object")return e===t;n.seen||(n.seen=new WeakMap);let i=n.seen.get(e);if(i?.has(t))return!0;if(i||(i=new WeakSet,n.seen.set(e,i)),i.add(t),Object.getPrototypeOf(e)!==Object.getPrototypeOf(t))return!1;if(typeof Uint8Array<"u"&&e instanceof Uint8Array){if(!(t instanceof Uint8Array)||e.length!==t.length)return!1;for(let s=0;s<e.length;s++)if(e[s]!==t[s])return!1;return!0}if(Array.isArray(e)){if(!Array.isArray(t)||e.length!==t.length)return!1;for(let s=0;s<e.length;s++)if(!ar(e[s],t[s],n,r+1))return!1;return!0}if(ArrayBuffer.isView(e)){if(!ArrayBuffer.isView(t)||e.byteLength!==t.byteLength)return!1;const s=new Uint8Array(e.buffer,e.byteOffset||0,e.byteLength),l=new Uint8Array(t.buffer,t.byteOffset||0,t.byteLength);for(let c=0;c<s.length;c++)if(s[c]!==l[c])return!1;return!0}if(e instanceof ArrayBuffer){if(!(t instanceof ArrayBuffer)||e.byteLength!==t.byteLength)return!1;const s=new Uint8Array(e),l=new Uint8Array(t);for(let c=0;c<s.length;c++)if(s[c]!==l[c])return!1;return!0}if(e instanceof Date)return t instanceof Date?e.getTime()===t.getTime():!1;if(e instanceof RegExp)return t instanceof RegExp?e.toString()===t.toString():!1;if(e instanceof Map){if(!(t instanceof Map)||e.size!==t.size)return!1;for(const[s,l]of e)if(!t.has(s)||!ar(l,t.get(s),n,r+1))return!1;return!0}if(e instanceof Set){if(!(t instanceof Set)||e.size!==t.size)return!1;let s=!0;for(const m of e)if(m!==null&&typeof m=="object"){s=!1;break}if(s){for(const m of e)if(!t.has(m))return!1;return!0}const l=Array.from(t),c=new Array(l.length).fill(!1),u=new Map;for(let m=0;m<l.length;m++)u.set(l[m],m);const f=m=>{try{return JSON.stringify(m,(g,y)=>y instanceof Date?{__type:"Date",v:y.getTime()}:y instanceof RegExp?{__type:"RegExp",v:y.toString()}:typeof ArrayBuffer<"u"&&ArrayBuffer.isView(y)?{__type:"TypedArray",v:Array.from(new Uint8Array(y.buffer,y.byteOffset||0,y.byteLength))}:typeof ArrayBuffer<"u"&&y instanceof ArrayBuffer?{__type:"ArrayBuffer",v:Array.from(new Uint8Array(y))}:y)}catch{return null}},d=new Map,p=[];for(let m=0;m<l.length;m++){const g=f(l[m]);if(g==null)p.push(m);else{const y=d.get(g);y?y.push(m):d.set(g,[m])}}for(const m of e){const g=u.get(m);if(g!==void 0&&!c[g]){c[g]=!0;continue}const y=f(m);let h=!1;if(y!=null){const _=d.get(y)||[];for(const w of _)if(!c[w]&&ar(m,l[w],n,r+1)){c[w]=!0,h=!0;break}if(h)continue}for(let _=0;_<l.length;_++)if(!c[_]&&ar(m,l[_],n,r+1)){c[_]=!0,h=!0;break}if(!h)return!1}return!0}const a=Object.keys(e),o=Object.keys(t);if(a.length!==o.length)return!1;for(let s=0;s<a.length;s++){const l=a[s];if(!Object.prototype.hasOwnProperty.call(t,l)||!ar(e[l],t[l],n,r+1))return!1}return!0}var mr=class{constructor(e,t={}){xt(t,["keyResolver","cacheOptions","ttl","weight"],"PowerMemoizer"),xt(t,["admission","allowStale","cacheOptions","defaultAsyncTimeout","defaultTTL","fetchMethod","initialPoolSize","keyResolver","maxCleanupPerTick","maxEntries","maxInflightRefreshes","maxPoolSize","maxWeight","now","observability","onError","onEvict","onExpire","policy","rejectOversized","staleTtl","ttl","weight","weightFn","windowSize"],"PowerCache");const{keyResolver:n=ho,cacheOptions:r={},ttl:i,weight:a}=t;if(this.keyResolver=typeof n=="function"?n:ho,this.cache=new oi(r),this._inflight=new Map,this._defaultMemoizeOptions={},i!==void 0&&(this._defaultMemoizeOptions.ttl=i),a!==void 0&&(this._defaultMemoizeOptions.weight=a),this.run=()=>{throw new TypeError("No function supplied to PowerMemoizer; call memoize(fn) to create a memoized wrapper.")},this._originalFn=null,this._receiverIds=new WeakMap,this._nextReceiverId=0,typeof e=="function"){this._originalFn=e;try{this._fnWrapper=this.memoize(e),this.run=(...o)=>{if(typeof this._fnWrapper=="function")return this._fnWrapper(...o)}}catch{}}}_receiverKey(e,t){let n;return e!==null&&(typeof e=="object"||typeof e=="function")?(n=this._receiverIds.get(e),n===void 0&&(n=this._nextReceiverId++,this._receiverIds.set(e,n))):n=`p${String(e)}`,`r${n}:${this.keyResolver(...t)}`}_memoize(e,{ttl:t,weight:n}={}){if(typeof e!="function")throw new TypeError("fn must be a function");const r=this;return function(...a){const o=this===void 0||this===null?null:this,s=o===null?r.keyResolver(...a):r._receiverKey(o,a),l=r.cache._fetchValidNode(s);if(l!==null)return l.value;if(r._inflight.has(s))return r._inflight.get(s);const c=o===null?e(...a):e.apply(o,a);if(typeof c?.then=="function"){const u=(async()=>{try{const f=await c;try{r.cache.set(s,f,{ttl:t,weight:n})}catch{}return f}finally{r._inflight.delete(s)}})();return r._inflight.set(s,u),u}return r.cache.set(s,c,{ttl:t,weight:n}),c}}memoize(e,t={}){if(typeof e!="function")throw new TypeError("fn must be a function");const n=t&&(Object.prototype.hasOwnProperty.call(t,"ttl")||Object.prototype.hasOwnProperty.call(t,"weight"))?t:this._defaultMemoizeOptions,r=this._memoize(e,n),i=this;return r.get=function(...a){return i._getFor(r,this,a)},r.has=function(...a){return i._hasFor(r,this,a)},r.delete=function(...a){return i._deleteFor(r,this,a)},r.clear=()=>this.clear(),r.stats=()=>this.stats(),r.cache=this.cache,r.original=e,r}get(...e){return this._lookup(this.keyResolver(...e))}has(...e){return this.cache.has(this.keyResolver(...e))}delete(...e){return this._evict(this.keyResolver(...e))}_scopedKey(e,t,n){return t===e||t==null?this.keyResolver(...n):this._receiverKey(t,n)}_lookup(e){return this.cache.get(e)}_evict(e){return this._inflight.has(e)&&this._inflight.delete(e),this.cache.delete(e)}_getFor(e,t,n){return this._lookup(this._scopedKey(e,t,n))}_hasFor(e,t,n){return this.cache.has(this._scopedKey(e,t,n))}_deleteFor(e,t,n){return this._evict(this._scopedKey(e,t,n))}clear(){this._inflight.clear(),this.cache.clear()}stats(){return this.cache.stats()}getStats(){return this.stats()}[Symbol.dispose](){typeof this.cache?.[Symbol.dispose]=="function"&&this.cache[Symbol.dispose]()}dispose(){this[Symbol.dispose]()}};function sr(e,t){const n=typeof e;if(e===null)return"n:";if(n==="string")return"s:"+e.length+":"+e;if(n==="number")return"d:"+String(e);if(n==="boolean")return"b:"+(e?"1":"0");if(n==="undefined")return"u:";if(n==="bigint")return"g:"+e.toString();if(n==="symbol")throw new TypeError("simpleArgsKey() does not support symbol arguments");if(n==="function")throw new TypeError("simpleArgsKey() does not support function arguments - two closures cannot be told apart. Pass a key explicitly, or supply a `keyResolver`.");if(t.has(e))return"c:";t.add(e);try{if(Array.isArray(e)){let a="A:[";for(let o=0;o<e.length;o++)o&&(a+=","),a+=sr(e[o],t);return a+"]"}if(e instanceof Date)return"D:"+e.getTime();if(e instanceof RegExp)return"R:"+e.source+"/"+e.flags;if(si(e))return"E:"+e.name+":"+e.message;if(e instanceof Map){let a="Mp:[",o=!0;for(const[s,l]of e)o||(a+=","),o=!1,a+=sr(s,t)+"="+sr(l,t);return a+"]"}if(e instanceof Set){let a="St:[",o=!0;for(const s of e)o||(a+=","),o=!1,a+=sr(s,t);return a+"]"}let r="O:{",i=!0;for(const a of Object.keys(e))i||(r+=","),i=!1,r+="s:"+a.length+":"+a+"="+sr(e[a],t);return r+"}"}finally{t.delete(e)}}function ho(...e){if(e.length===0)return"";const t=new Set;let n="";for(let r=0;r<e.length;r++)r&&(n+="|"),n+=sr(e[r],t);return n}function li(e,t){Object.prototype.hasOwnProperty.call(e,t)||Object.defineProperty(e,t,{value:()=>{},enumerable:!1,writable:!0,configurable:!0})}var Yu=class{constructor(e=0,t={}){xt(t,["defaultTTL","onExpire","now"],"PowerTTLMap");let n=t,r=e;e!=null&&typeof e=="object"&&(n=e,r=0),this._defaultTTL=Number(n?.defaultTTL??r)||0,this._onExpire=typeof n?.onExpire=="function"?n.onExpire:null,this._now=typeof n?.now=="function"?n.now:tt,this._map=new Map,this._expirations=new Map,this._nextExpiryAt=0,this._nextExpiryDirty=!1,this._disposed=!1}_resolveTtl(e,t){if(e!=null&&typeof e=="object"&&!Array.isArray(e)&&(e=e.ttl),e==null)return t;if(e===1/0)return 0;const n=Tl(e,"PowerTTLMap");if(n<0)throw new RangeError(`PowerTTLMap: \`ttl\` must be zero (no expiry) or positive (received ${String(e)}). A negative TTL would store an expiry in the past that every comparison reads as live.`);return n}set(e,t,n){if(this._disposed)throw new TypeError("PowerTTLMap: cannot `set()` after `dispose()`. The instance is released; construct a new PowerTTLMap, or use `clear()` before disposing if you meant to reuse it.");const r=this._resolveTtl(n,this._defaultTTL),i=r>0?this._now()+r+1:0,a=this._expirations.get(e)||0;return this._map.set(e,{value:t,expiresAt:i}),i?this._expirations.set(e,i):this._expirations.delete(e),this._updateNextExpiryOnWrite(a,i),this}_expireKey(e,t){if(!t)return;const n=t.expiresAt||this._expirations.get(e)||0;try{const r=t.value;if(this._map.delete(e),this._expirations.delete(e),n&&this._nextExpiryAt===n&&(this._nextExpiryDirty=!0),typeof this._onExpire=="function")try{this._onExpire(e,r)}catch{}}catch{}}_checkExpire(e,t){return t?t.expiresAt&&this._now()>t.expiresAt?(this._expireKey(e,t),!0):!1:!0}get(e){const t=this._map.get(e);if(!(t===void 0||this._checkExpire(e,t)))return t.value}has(e){const t=this._map.get(e);return!this._checkExpire(e,t)}delete(e){const t=this._expirations.get(e)||0;return this._expirations.delete(e),t&&this._nextExpiryAt===t&&(this._nextExpiryDirty=!0),this._map.delete(e)}reset(){this.clear()}clear(){this._map.clear(),this._expirations.clear(),this._nextExpiryAt=0,this._nextExpiryDirty=!1}touch(e,t){const n=this._map.get(e);if(!n)return!1;if(n.expiresAt&&this._now()>n.expiresAt)return this._expireKey(e,n),!1;const r=n.expiresAt||0,i=this._resolveTtl(t,this._defaultTTL);return n.expiresAt=i>0?this._now()+i+1:0,n.expiresAt?this._expirations.set(e,n.expiresAt):this._expirations.delete(e),this._updateNextExpiryOnWrite(r,n.expiresAt),!0}get size(){return this._map.size}get expiredCount(){if(!this._map.size||!this._expirations.size)return 0;const e=this._now();let t=0;for(const n of this._expirations.values())n&&e>n&&t++;return t}purge(){if(!this._map.size||!this._expirations.size)return 0;const e=this._now();let t=0;for(const n of this._expirations.values())n&&e>n&&t++;return t&&this._sweepExpirations(e),t}_updateNextExpiryOnWrite(e,t){e&&this._nextExpiryAt===e&&e!==t&&(this._nextExpiryDirty=!0),t&&(!this._nextExpiryAt||t<this._nextExpiryAt)&&(this._nextExpiryAt=t)}_sweepExpirations(e){let t=0;for(const[n,r]of this._expirations){if(r&&e>r){const i=this._map.get(n);this._expireKey(n,i);continue}r&&(!t||r<t)&&(t=r)}this._nextExpiryAt=t,this._nextExpiryDirty=!1}*entries(){const e=this._now();for(const[t,n]of this._map){if(n.expiresAt&&e>n.expiresAt){this._expireKey(t,n);continue}yield[t,n.value]}}*keys(){for(const[e]of this.entries())yield e}*values(){for(const[,e]of this.entries())yield e}forEach(e,t){for(const[n,r]of this.entries())e.call(t,r,n,this)}[Symbol.iterator](){return this.entries()}dispose(){this._disposed||(this._disposed=!0,this.clear(),li(this,"clear"))}[Symbol.dispose](){this.dispose()}},Qu=new oi({maxEntries:500}),Ri=new Yu(0),Ca=3e5;async function Xu(e,t){try{if(!e||Ca>0&&Ri.has(e))return null;try{const n=await Qu.getOrSetAsync(e,async()=>{const r=await t();if(r==null)throw new Error("importCache: loader returned null");return r});return Ri.delete(e),n}catch{return Ca>0?Ri.set(e,1,Ca):Ri.delete(e),null}}catch{return null}}var Hn="11.12.0",ze=new Map,Ju=`https://raw.githubusercontent.com/highlightjs/highlight.js/${Hn}/SUPPORTED_LANGUAGES.md`,tn={shell:"bash",sh:"bash",zsh:"bash",js:"javascript",ts:"typescript",py:"python",csharp:"cs","c#":"cs"};tn.html="xml";tn.xhtml="xml";tn.markup="xml";var Ts=new Set(["magic","undefined"]),En=null,Ku=3,eh=3e5,ei=new Map;function fo(e){try{const t=ei.get(e);return t?t.openUntil&&Date.now()<t.openUntil?!0:(t.openUntil&&Date.now()>=t.openUntil&&ei.delete(e),!1):!1}catch{return!1}}function po(e){if(e)try{const t=ei.get(e)||{failures:0,openUntil:0,warned:!1};if(t.failures=(t.failures||0)+1,t.failures>=Ku&&(t.openUntil=Date.now()+eh,!t.warned)){try{k("[codeblocksManager] CDN circuit opened for "+e+"; skipping CDN imports temporarily")}catch{}t.warned=!0}ei.set(e,t)}catch{}}function mo(e){try{e&&ei.delete(e)}catch{}}var go=null;async function Ms(e=Ju){if(e)return En||(En=(async()=>{try{const t=await fetch(e);if(!t.ok)return;const n=(await t.text()).split(/\r?\n/);let r=-1;for(let l=0;l<n.length;l++)if(/\|\s*Language\s*\|/i.test(n[l])){r=l;break}if(r===-1)return;const i=n[r].replace(/^\||\|$/g,"").split("|").map(l=>l.trim().toLowerCase());let a=i.findIndex(l=>/alias|aliases|equivalent|alt|alternates?/i.test(l));a===-1&&(a=1);let o=i.findIndex(l=>/file|filename|module|module name|module-name|short|slug/i.test(l));if(o===-1){const l=i.findIndex(c=>/language/i.test(c));o=l!==-1?l:0}let s=[];for(let l=r+1;l<n.length;l++){const c=n[l].trim();if(!c||!c.startsWith("|"))break;const u=c.replace(/^\||\|$/g,"").split("|").map(m=>m.trim());if(u.every(m=>/^-+$/.test(m)))continue;const f=u;if(!f.length)continue;const d=(f[o]||f[0]||"").toString().trim().toLowerCase();if(!d||/^-+$/.test(d))continue;ze.set(d,d);const p=f[a]||"";if(p){const m=String(p).split(",").map(g=>g.replace(/`/g,"").trim()).filter(Boolean);if(m.length){const g=m[0].toLowerCase().replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/gi,"");g&&/[a-z0-9]/i.test(g)&&(ze.set(g,g),s.push(g))}}}try{const l=[];for(const c of s){const u=String(c??"").replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/gi,"");u&&/[a-z0-9]/i.test(u)?l.push(u):ze.delete(c)}s=l}catch(l){k("[codeblocksManager] cleanup aliases failed",l)}try{let l=0;for(const c of Array.from(ze.keys())){if(!c||/^-+$/.test(c)||!/[a-z0-9]/i.test(c)){ze.delete(c),l++;continue}if(/^[:]+/.test(c)){const u=c.replace(/^[:]+/,"");if(u&&/[a-z0-9]/i.test(u)){const f=ze.get(c);ze.delete(c),ze.set(u,f)}else ze.delete(c),l++}}for(const[c,u]of Array.from(ze.entries()))(!u||/^-+$/.test(u)||!/[a-z0-9]/i.test(u))&&(ze.delete(c),l++);try{const c=":---------------------";ze.has(c)&&(ze.delete(c),l++)}catch(c){k("[codeblocksManager] remove sep key failed",c)}try{Array.from(ze.keys()).sort()}catch(c){k("[codeblocksManager] compute supported keys failed",c)}}catch(l){k("[codeblocksManager] ignored error",l)}}catch(t){k("[codeblocksManager] loadSupportedLanguages failed",t)}})(),En)}var Ra=new Set,yo=new Set;function La(e,t,n){const r=String(e||"").toLowerCase();if(!(!r||yo.has(r))){yo.add(r);try{k("[codeblocksManager] language import failed; using plaintext/highlightElement fallback",{language:e,candidates:Array.isArray(t)?t:[],error:n?String(n?.message||n):"unknown"})}catch{}}}async function fr(e,t){if(En||(async()=>{try{await Ms()}catch(i){k("[codeblocksManager] loadSupportedLanguages (IIFE) failed",i)}})(),En)try{await En}catch{}if(e=e==null?"":String(e),e=e.trim(),!e)return!1;const n=e.toLowerCase();if(Ts.has(n))return!1;if(ze.size&&!ze.has(n)){const i=tn;if(!i[n]&&!i[e])return!1}if(Ra.has(e))return!0;const r=tn;try{const i=(t||e||"").toString().replace(/\.js$/i,"").trim(),a=(r[e]||e||"").toString(),o=(r[i]||i||"").toString();let s=Array.from(new Set([a,o,i,e,r[i],r[e]].filter(Boolean))).map(u=>String(u).toLowerCase()).filter(u=>u&&u!=="undefined");ze.size&&(s=s.filter(u=>{if(ze.has(u))return!0;const f=tn[u];return!!(f&&ze.has(f))}));let l=null,c=null;for(const u of s)try{if(l=await Xu(u,async()=>{try{if(typeof go=="function")try{return await go(u)}catch{return null}try{try{return await import(`highlight.js/lib/languages/${u}.js`)}catch{return await import(`highlight.js/lib/languages/${u}`)}}catch{}if(!Hn)return null;try{const f=`https://cdn.jsdelivr.net/npm/highlight.js@${Hn}/es/languages/${u}.js`;let d=null;try{d=new URL(f).host}catch{d=null}if(!fo(d))try{const p=await import(f);return mo(d),p}catch{po(d)}try{const p=`https://cdn.jsdelivr.net/npm/highlight.js@${Hn}/lib/languages/${u}.js`;let m=null;try{m=new URL(p).host}catch{m=null}if(!fo(m))try{const g=await import(p);return mo(m),g}catch{return po(m),null}}catch{return null}}catch{try{return await import(`https://cdn.jsdelivr.net/npm/highlight.js@${Hn}/lib/languages/${u}.js`)}catch{return null}}}catch{return null}}),l){const f=l.default||l;try{const d=ze.size&&ze.get(e)||u||e;return Ye.registerLanguage(d,f),Ra.add(d),d!==e&&(Ye.registerLanguage(e,f),Ra.add(e)),!0}catch(d){c=d}}}catch(f){c=f}return c?(La(e,s,c),!1):(s.length&&La(e,s,null),!1)}catch(i){return La(e,[],i),!1}}var Pa=null;function Nl(e){const t=e?.querySelector?e:typeof document<"u"?document:null;En||(async()=>{try{await Ms()}catch(a){k("[codeblocksManager] loadSupportedLanguages (observer) failed",a)}})();const n=tn;typeof IntersectionObserver<"u"&&!Pa&&(Pa=new IntersectionObserver((a,o)=>{a.forEach(s=>{if(!s.isIntersecting)return;const l=s.target;try{o.unobserve(l)}catch(c){k("[codeblocksManager] observer unobserve failed",c)}(async()=>{try{const c=l.getAttribute&&l.getAttribute("class")||l.className||"",u=c.match(/language-([a-zA-Z0-9_+-]+)/)||c.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(u&&u[1]){const f=(u[1]||"").toLowerCase(),d=n[f]||f,p=ze.size&&(ze.get(d)||ze.get(String(d).toLowerCase()))||d;try{await fr(p)}catch(m){k("[codeblocksManager] registerLanguage failed",m)}try{try{const m=l.textContent||l.innerText||"";m!=null&&(l.textContent=m)}catch{}try{l?.dataset?.highlighted&&delete l.dataset.highlighted}catch{}Ye.highlightElement(l)}catch(m){k("[codeblocksManager] hljs.highlightElement failed",m)}}else try{const f=l.textContent||"";try{if(Ye&&typeof Ye.getLanguage=="function"&&Ye.getLanguage("plaintext")){const d=Ye.highlight(f,{language:"plaintext"});if(d&&d.value)try{if(typeof document<"u"&&document.createRange&&typeof document.createRange=="function"){const p=document.createRange().createContextualFragment(d.value);if(typeof l.replaceChildren=="function")l.replaceChildren(...Array.from(p.childNodes));else{for(;l.firstChild;)l.removeChild(l.firstChild);l.appendChild(p)}}else l.innerHTML=d.value}catch{try{l.innerHTML=d.value}catch{}}}}catch{try{Ye.highlightElement(l)}catch(p){k("[codeblocksManager] fallback highlightElement failed",p)}}}catch(f){k("[codeblocksManager] auto-detect plaintext failed",f)}}catch(c){k("[codeblocksManager] observer entry processing failed",c)}})()})},{root:null,rootMargin:"300px",threshold:.1}));const r=Pa,i=t?.querySelectorAll?t.querySelectorAll("pre code"):[];if(!r){i.forEach(async a=>{try{const o=a.getAttribute&&a.getAttribute("class")||a.className||"",s=o.match(/language-([a-zA-Z0-9_+-]+)/)||o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(s&&s[1]){const l=(s[1]||"").toLowerCase(),c=n[l]||l,u=ze.size&&(ze.get(c)||ze.get(String(c).toLowerCase()))||c;try{await fr(u)}catch(f){k("[codeblocksManager] registerLanguage failed (no observer)",f)}}try{try{const l=a.textContent||a.innerText||"";l!=null&&(a.textContent=l)}catch{}try{a&&a.dataset&&a.dataset.highlighted&&delete a.dataset.highlighted}catch{}Ye.highlightElement(a)}catch(l){k("[codeblocksManager] hljs.highlightElement failed (no observer)",l)}}catch(o){k("[codeblocksManager] loadSupportedLanguages fallback ignored error",o)}});return}i.forEach(a=>{try{r.observe(a)}catch(o){k("[codeblocksManager] observe failed",o)}})}function th(e,{useCdn:t=!0}={}){const n=typeof document<"u"&&document.head&&document.head.querySelector?document.head.querySelector("link[data-hl-theme]"):typeof document<"u"?document.querySelector("link[data-hl-theme]"):null,r=n?.getAttribute?n.getAttribute("data-hl-theme"):null,i=e==null?"default":String(e),a=i&&String(i).toLowerCase()||"";if(a==="default"||a==="monokai"){try{n?.parentNode&&n.parentNode.removeChild(n)}catch{}return}if(r&&r.toLowerCase()===a)return;if(!t){try{k("Requested highlight theme not bundled; set useCdn=true to load theme from CDN")}catch{}return}if(!Hn){try{k("Cannot load highlight.js theme from CDN: HIGHLIGHT_JS_VERSION is not defined")}catch{}return}const o=a,s=`https://cdn.jsdelivr.net/npm/highlight.js@${Hn}/styles/${o}.css`,l=document.createElement("link");l.rel="stylesheet",l.href=s,l.setAttribute("data-hl-theme",o),l.addEventListener("load",()=>{try{n?.parentNode&&n.parentNode.removeChild(n)}catch{}}),document.head.appendChild(l)}var ci=e=>e===void 0?"__undefined":String(e),nh=new mr(function(e){return String(e??"").replace(/^[.\/]+/,"")},{keyResolver:ci,cacheOptions:{maxEntries:2e3}}),rh=new mr(function(e){return String(e??"").replace(/\/+$/,"")},{keyResolver:ci,cacheOptions:{maxEntries:2e3}}),ih=new mr(function(e){return Zn(String(e??""))+"/"},{keyResolver:ci,cacheOptions:{maxEntries:2e3}}),dm=new mr(function(e){try{const t=String(e??"");return t.includes("%")?t:encodeURI(t)}catch(t){return k("[helpers] encodeURL failed",t),String(e??"")}},{keyResolver:ci,cacheOptions:{maxEntries:2e3}}),ah=new mr(function(e){try{if(!e&&e!==0)return"";const t=String(e),n={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:" "};return t.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g,(r,i)=>{if(!i)return r;if(i[0]==="#")try{return i[1]==="x"||i[1]==="X"?String.fromCharCode(parseInt(i.slice(2),16)):String.fromCharCode(parseInt(i.slice(1),10))}catch{return r}return n[i]!==void 0?n[i]:r})}catch{return String(e??"")}},{keyResolver:ci,cacheOptions:{maxEntries:2e3}});function Xi(e){return!e||typeof e!="string"?!1:/^(https?:)?\/\//.test(e)||e.startsWith("mailto:")||e.startsWith("tel:")}var se=e=>nh.run(e),Zn=e=>rh.run(e),Rn=e=>ih.run(e);function sh(e){try{if(!e||typeof document>"u"||!document.head||e.startsWith("data:")||document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`))return;const t=document.createElement("link");t.rel="preload",t.as="image",t.href=e,document.head.appendChild(t)}catch(t){k("[helpers] preloadImage failed",t)}}var oh=["https://cdn.jsdelivr.net","https://unpkg.com"];function lh(){try{if(typeof document>"u"||!document.head)return;for(const e of oh)try{if(document.querySelector(`link[rel="preconnect"][href="${e}"]`))continue;const t=document.createElement("link");t.rel="preconnect",t.href=e,t.crossOrigin="anonymous",document.head.appendChild(t)}catch{}}catch{}}function ch(e,t="monokai"){try{if(typeof document>"u"||!document.head||!e)return;const n=`https://cdn.jsdelivr.net/npm/highlight.js@${e}/styles/${t}.css`;try{if(document.querySelector(`link[rel="preload"][href="${n}"]`))return;const r=document.createElement("link");r.rel="preload",r.as="style",r.href=n,r.crossOrigin="anonymous",r.fetchPriority="high",document.head.appendChild(r)}catch{}}catch{}}var es=null;function uh(e){es=typeof e=="string"?e:null}function Cs(e){if(es&&e&&typeof e.setAttribute=="function")try{e.setAttribute("nonce",es)}catch{}}function Na(e,t=0,n=!1){try{if(typeof window>"u"||!e||!e.querySelectorAll)return;const r=Array.from(e.querySelectorAll("img"));if(!r.length)return;const i=e,a=i?.getBoundingClientRect?i.getBoundingClientRect():null,o=0,s=typeof window<"u"&&(window.innerHeight||document.documentElement.clientHeight)||0,l=a?Math.max(o,a.top):o,c=(a?Math.min(s,a.bottom):s)+Number(t||0);let u=0;i&&(u=i.clientHeight||(a?a.height:0)),u||(u=s-o);let f=.6;try{const g=i&&window.getComputedStyle?window.getComputedStyle(i):null,y=g?.getPropertyValue?g.getPropertyValue("--nimbi-image-max-height-ratio"):null,h=y?parseFloat(y):NaN;!Number.isNaN(h)&&h>0&&h<=1&&(f=h)}catch(g){k("[helpers] read CSS ratio failed",g)}const d=Math.max(200,Math.floor(u*f));let p=null,m=!1;if(r.forEach(g=>{try{const y=g.getAttribute?.("loading"),h=y==="eager",_=g?.getBoundingClientRect?g.getBoundingClientRect():null,w=g.src||g.getAttribute?.("src"),b=_?.height>1?_.height:d,x=_?_.top:0,z=x+b;_&&b>0&&x<=c&&z>=l&&!m?(g.setAttribute?(g.setAttribute("loading","eager"),g.setAttribute("fetchpriority","high"),g.setAttribute("data-eager-by-nimbi","1")):(g.loading="eager",g.fetchPriority="high"),sh(w),m=!0):!h&&g.setAttribute&&g.setAttribute("loading","lazy"),!p&&_?.top<=c&&(p={img:g,src:w,rect:_,beforeLoading:y,explicitEager:h})}catch(y){k("[helpers] setEagerForAboveFoldImages per-image failed",y)}}),!m&&p){const{img:g,src:y,explicitEager:h}=p;if(!h)try{g.setAttribute?(g.setAttribute("loading","eager"),g.setAttribute("fetchpriority","high"),g.setAttribute("data-eager-by-nimbi","1")):(g.loading="eager",g.fetchPriority="high"),m=!0}catch(_){k("[helpers] setEagerForAboveFoldImages fallback failed",_)}}}catch(r){k("[helpers] setEagerForAboveFoldImages failed",r)}}function je(e,t=null,n){try{const r=typeof n=="string"?n:typeof window<"u"&&window.location?window.location.search:"",i=new URLSearchParams(r.startsWith("?")?r.slice(1):r),a=String(e??"");i.delete("page");const o=new URLSearchParams;o.set("page",a);for(const[c,u]of i.entries())o.append(c,u);const s=o.toString();let l=s?`?${s}`:"";return t&&(l+=`#${encodeURIComponent(t)}`),l||`?page=${encodeURIComponent(a)}`}catch{const i=`?page=${encodeURIComponent(String(e??""))}`;return t?`${i}#${encodeURIComponent(t)}`:i}}function Ji(e){try{const t=e();return t&&typeof t.then=="function"?t.catch(n=>{k("[helpers] safe swallowed error",n)}):t}catch(t){k("[helpers] safe swallowed error",t)}}try{typeof globalThis<"u"&&!globalThis.safe&&(globalThis.safe=Ji)}catch(e){k("[helpers] global attach failed",e)}var hh=e=>ah.run(e),Il=()=>typeof navigator<"u"&&navigator.hardwareConcurrency?Math.max(1,Math.floor(navigator.hardwareConcurrency/2)):2,jn="light";function fh(e,t={}){if(document.querySelector(`link[href="${e}"]`))return;const n=document.createElement("link");if(n.rel="stylesheet",n.href=e,Object.entries(t).forEach(([r,i])=>n.setAttribute(r,i)),document.head.appendChild(n),t["data-bulmaswatch-theme"])try{if(n.getAttribute("data-bulmaswatch-observer"))return;let r=Number(n.getAttribute("data-bulmaswatch-move-count")||0),i=!1,a=null;try{const l=n.getAttribute("data-bulmaswatch-observer");l&&(a=document.querySelector(`[data-bulmaswatch-observer="${l}"]`))}catch{a=null}const o=()=>{try{if(i)return;const l=n.parentNode;if(!l||l.lastElementChild===n)return;const c=Number(n.getAttribute("data-bulmaswatch-move-count")||0);if(c>=1e3){if(n.setAttribute("data-bulmaswatch-move-stopped","1"),a)try{a.disconnect()}catch{}return}i=!0;try{l.appendChild(n)}catch{}const u=c+1;n.setAttribute("data-bulmaswatch-move-count",String(u)),i=!1}catch{}};a||(a=new MutationObserver(o));try{a.observe(document.head,{childList:!0}),n.setAttribute("data-bulmaswatch-observer","1"),n.setAttribute("data-bulmaswatch-move-count",String(r))}catch{}const s=document.head;s?.lastElementChild!==n&&s?.appendChild(n)}catch{}}function Ia(){try{const e=typeof document<"u"&&document?.head?document.head:document,t=Array.from(e.querySelectorAll("link[data-bulmaswatch-theme]"));for(const n of t)n?.parentNode?.removeChild(n)}catch{}try{const e=typeof document<"u"&&document?.head?document.head:document,t=Array.from(e.querySelectorAll("style[data-bulma-override]"));for(const n of t)n?.parentNode?.removeChild(n)}catch{}}async function Ol(e="none",t="/"){try{de("[bulmaManager] ensureBulma called",{bulmaCustomize:e,pageDir:t})}catch{}if(!e)return;if(e==="none"){try{Ia()}catch{}return}const n=[t+"bulma.css","/bulma.css"],r=Array.from(new Set(n));if(e==="local"){if(Ia(),document.querySelector("style[data-bulma-override]"))return;for(const i of r)try{const a=await fetch(i,{method:"GET"});if(a.ok){const o=await a.text(),s=document.createElement("style");s.setAttribute("data-bulma-override",i),Cs(s),s.appendChild(document.createTextNode(`
/* bulma override: ${i} */
`+o)),document.head.appendChild(s);return}}catch(a){k("[bulmaManager] fetch local bulma candidate failed",a)}return}try{const i=String(e).trim();if(!i)return;Ia(),fh(`https://unpkg.com/bulmaswatch/${encodeURIComponent(i)}/bulmaswatch.min.css`,{"data-bulmaswatch-theme":i})}catch(i){k("[bulmaManager] ensureBulma failed",i)}}function zl(e){jn=e==="dark"?"dark":e==="system"?"system":"light";try{const t=Array.from(document.querySelectorAll(".nimbi-mount"));if(t.length>0)for(const n of t)jn==="dark"?n.setAttribute("data-theme","dark"):jn==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme");else{const n=document.documentElement;jn==="dark"?n.setAttribute("data-theme","dark"):jn==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme")}}catch{}}function dh(e){const t=document.documentElement;for(const[n,r]of Object.entries(e||{}))try{t.style.setProperty(`--${n}`,r)}catch(i){k("[bulmaManager] setThemeVars failed for",n,i)}}function $l(e){if(!e||!(e instanceof HTMLElement))return()=>{};const t=e.closest?.(".nimbi-mount")||null;try{t&&(jn==="dark"?t.setAttribute("data-theme","dark"):jn==="light"?t.setAttribute("data-theme","light"):t.removeAttribute("data-theme"))}catch{}return()=>{}}var Dl={en:{navigation:"Navigation",onThisPage:"On this page",home:"Home",scrollToTop:"Scroll to top",readingTime:"{minutes} min read",searchPlaceholder:"Search…",searchNoResults:"No results",imagePreviewTitle:"Image preview",imagePreviewFit:"Fit to screen",imagePreviewOriginal:"Original size",imagePreviewZoomOut:"Zoom out",imagePreviewZoomIn:"Zoom in",imagePreviewClose:"Close"},es:{navigation:"Navegación",onThisPage:"En esta página",home:"Inicio",scrollToTop:"Ir arriba",readingTime:"{minutes} min de lectura",searchPlaceholder:"Buscar…",searchNoResults:"Sin resultados",imagePreviewTitle:"Previsualización de imagen",imagePreviewFit:"Ajustar a la pantalla",imagePreviewOriginal:"Tamaño original",imagePreviewZoomOut:"Alejar",imagePreviewZoomIn:"Acercar",imagePreviewClose:"Cerrar"},de:{navigation:"Navigation",onThisPage:"Auf dieser Seite",home:"Startseite",scrollToTop:"Nach oben",readingTime:"{minutes} min Lesezeit",searchPlaceholder:"Suchen…",searchNoResults:"Keine Ergebnisse",imagePreviewTitle:"Bildvorschau",imagePreviewFit:"An Bildschirm anpassen",imagePreviewOriginal:"Originalgröße",imagePreviewZoomOut:"Verkleinern",imagePreviewZoomIn:"Vergrößern",imagePreviewClose:"Schließen"},fr:{navigation:"Navigation",onThisPage:"Sur cette page",home:"Accueil",scrollToTop:"Aller en haut",readingTime:"{minutes} min de lecture",searchPlaceholder:"Rechercher…",searchNoResults:"Aucun résultat",imagePreviewTitle:"Aperçu de l’image",imagePreviewFit:"Ajuster à l’écran",imagePreviewOriginal:"Taille originale",imagePreviewZoomOut:"Dézoomer",imagePreviewZoomIn:"Zoomer",imagePreviewClose:"Fermer"},pt:{navigation:"Navegação",onThisPage:"Nesta página",home:"Início",scrollToTop:"Ir para o topo",readingTime:"{minutes} min de leitura",searchPlaceholder:"Procurar…",searchNoResults:"Sem resultados",imagePreviewTitle:"Visualização da imagem",imagePreviewFit:"Ajustar à tela",imagePreviewOriginal:"Tamanho original",imagePreviewZoomOut:"Diminuir",imagePreviewZoomIn:"Aumentar",imagePreviewClose:"Fechar"}},_o=Object.freeze(["exponential","linear","fixed","decorrelated"]),Oa=class{constructor(e={}){xt(e,["ratio","observability","capacity"],"PowerRetryBudget");const{ratio:t=oo,capacity:n=10}=e||{};if(this._ratio=Fe(t,{name:"ratio",className:"PowerRetryBudget",min:0,fallback:oo}),this._ratio>1)throw new TypeError(`PowerRetryBudget: \`ratio\` must be <= 1 (received ${this._ratio}). A budget larger than 1 permits more retries than requests.`);this._capacity=Fe(n,{name:"capacity",className:"PowerRetryBudget",integer:!0,min:1,fallback:10}),this._tokens=this._capacity,this._retries=0,this._refused=0,this._funded=0,this._executions=0,this._outcomes=Object.create(null),this._metrics=Es(this,"retryBudget",e)}get ratio(){return this._ratio}get capacity(){return this._capacity}recordRequest(){return this._funded+=1,this._tokens=Math.min(this._capacity,this._tokens+this._ratio),this._tokens}tryConsumeRetry(){return this._tokens<1?(this._refused+=1,!1):(this._tokens-=1,this._retries+=1,!0)}recordOutcome(e={}){const t=typeof e.kind=="string"?e.kind:"failure",n={success:0,cancellation:0,timeout:.5,throttled:1,failure:.25},r=e.penalty===void 0?n[t]??n.failure:e.penalty;if(!Number.isFinite(r)||r<0)throw new TypeError("outcome penalty must be a finite number >= 0");return this._tokens=Math.max(0,this._tokens-r),this._outcomes[t]=(this._outcomes[t]||0)+1,this._tokens}execute(e,t={}){return this._executions+=1,Ki.run(e,{...t,budget:this})}available(){return this._tokens}reset(){this._tokens=this._capacity,this._retries=0,this._refused=0,this._funded=0,this._outcomes=Object.create(null)}dispose(){As(this._metrics),this._metrics=null}[Symbol.dispose](){this.dispose()}stats(){return{ratio:this._ratio,capacity:this._capacity,available:this._tokens,requests:this._funded,retries:this._retries,refused:this._refused,executions:this._executions,retryRate:this._executions>0?this._retries/this._executions:0,refusalRate:this._funded>0?this._refused/this._funded:0,outcomes:{...this._outcomes}}}getStats(){return this.stats()}};function ph(e,t){return t?new Promise((n,r)=>{if(t.aborted){r(ts(t.reason));return}const i=()=>{clearTimeout(a),r(ts(t.reason))},a=setTimeout(()=>{t.removeEventListener("abort",i),n()},e);t.addEventListener("abort",i,{once:!0})}):new Promise(n=>setTimeout(n,e))}function ts(e){return Object.assign(new Error("Aborted"),{code:"EABORT",reason:e,attempts:0})}function mh(e){if(typeof e!="string"||!_o.includes(e))throw new TypeError(`PowerRetry: \`backoff\` must be one of ${_o.join(", ")} (received ${String(e)}).`);return e}function wo(e,t){if(e==null)return null;if(e instanceof Oa)return e;if(typeof e=="number")return new Oa({ratio:e});if(typeof e=="object")return typeof e.constructor?.tryConsumeRetry=="function"?e:new Oa(e);throw new TypeError(`${t}: \`budget\` must be a PowerRetryBudget, a { ratio, capacity } object, or a ratio number (received ${typeof e}).`)}function gh(e){const{maxAttempts:t=3,backoff:n="exponential",baseDelay:r=100,maxDelay:i=so,jitter:a=!0,attemptTimeout:o,hedgeDelay:s=0,retryAfter:l,signal:c}=e||{},u=Fe(t,{name:"maxAttempts",className:"PowerRetry",min:1,integer:!0,fallback:3,invalidMessage:"maxAttempts must be a positive finite number",minMessage:"maxAttempts must be a positive finite number"}),f=mh(n),d=Fe(r,{name:"baseDelay",className:"PowerRetry",min:0,fallback:100}),p=Fe(i,{name:"maxDelay",className:"PowerRetry",min:0,fallback:so}),m=o==null?0:Fe(o,{name:"attemptTimeout",className:"PowerRetry",min:1,fallback:0}),g=s==null?0:Fe(s,{name:"hedgeDelay",className:"PowerRetry",min:0,fallback:0});if(f==="decorrelated"&&!a)throw new TypeError('PowerRetry: `backoff: "decorrelated"` is defined as a randomised walk, so `jitter: false` contradicts it. Use `fixed` or `exponential` if you want a deterministic delay.');return{attempts:u,strategy:f,base:d,cap:p,timeoutMs:m,hedgeMs:g,jitter:a,retryAfter:l,signal:c}}var Ki=class Bl{constructor(t={}){xt(t,["maxAttempts","backoff","baseDelay","maxDelay","jitter","retryIf","classifyError","onRetry","attemptTimeout","budget","hedgeDelay","hedgeIf","circuit","retryAfter","signal"],"PowerRetry");const{budget:n=null,signal:r=null,...i}=t||{};this._options=i,this._defaultSignal=r,this._budget=wo(n,"PowerRetry")}run(t,n={}){const r={...this._options,...n};return r.budget==null&&this._budget&&(r.budget=this._budget),r.signal==null&&this._defaultSignal&&(r.signal=this._defaultSignal),Bl.run(t,r)}static async run(t,n={}){if(typeof t!="function")throw new TypeError("fn must be a function");const{retryIf:r=()=>!0,classifyError:i,onRetry:a,budget:o=null,circuit:s=null,hedgeIf:l}=n||{},c=gh(n);if(s!=null&&typeof s.call!="function")throw new TypeError("PowerRetry: `circuit` must expose call(fn)");const u=wo(o,"PowerRetry.run");u&&u.recordRequest();const{attempts:f,strategy:d,base:p,cap:m,timeoutMs:g,hedgeMs:y,jitter:h,retryAfter:_,signal:w}=c;let b=p;const x=B=>{if(d==="decorrelated"){const re=Math.max(p,b*3);return b=Math.min(m,p+Math.random()*(re-p)),Math.round(b)}let j;return d==="linear"?j=p*B:d==="fixed"?j=p:j=p*Math.pow(2,B-1),j>m&&(j=m),h&&(j=Math.round(j*(.5+Math.random()*.5))),j},z=B=>{let j=y>0&&B===1;if(j&&typeof l=="function")try{j=l({attempt:B,budget:u,circuit:s})!==!1}catch{j=!1}const re=typeof AbortController=="function",ae=[],J=Q=>{const ee=Q&&re?new AbortController:null,he=(async()=>t(ee?ee.signal:void 0))();return ae.push({promise:he,controller:ee}),he},R=[J(g>0||j)];let N=null,M=!1;if(j&&(!u||u.tryConsumeRetry())){const Q=new Promise((ee,he)=>{N=setTimeout(()=>{N=null,M=!0,J(!0).then(ee,he)},y)});R.push(Q)}let A=null,O=!1;g>0&&R.push(new Promise((Q,ee)=>{A=setTimeout(()=>{O=!0,ee(Object.assign(new Error("Attempt timed out"),{code:"ETIMEOUT",attempts:B,attemptTimeout:g}))},g)}));let H=-1;const L=R.map((Q,ee)=>Q.then(he=>(H===-1&&(H=ee),he),he=>{throw H===-1&&(H=ee),he}));return Promise.race(L).finally(()=>{if(A&&clearTimeout(A),N&&(clearTimeout(N),N=null),!!(O||M))for(let Q=0;Q<ae.length;Q++){if(!O&&Q===H)continue;const{controller:ee}=ae[Q];if(ee)try{ee.abort()}catch{}}})};let D=null;for(let B=1;B<=f;B++){if(w&&w.aborted)throw ts(w.reason);try{return await(s?s.call(()=>z(B)):z(B))}catch(j){if(D=j,j?.code==="ECIRCUITOPEN")throw j;if(u&&typeof i=="function")try{const J=i(j,B);J&&typeof J=="object"&&u.recordOutcome(J)}catch{}let re;try{re=typeof r=="function"?!!await r(j):!!r}catch{re=!1}if(!re||B===f||u&&!u.tryConsumeRetry())break;let ae=x(B);if(typeof _=="function")try{const J=_(j,B);Number.isFinite(J)&&J>=0&&(ae=Math.min(m,J))}catch{}if(typeof a=="function")try{a(B,j,ae)}catch{}await ph(ae,w)}}throw D}},Wr=class{static async run(e,t={}){if(typeof e!="function")throw new TypeError("fn must be a function");const{maxAttempts:n=1,attemptTimeout:r=null,totalTimeout:i=null,retryDelay:a=0,retryIf:o=()=>!0,signal:s=null,onRetry:l,backoff:c,baseDelay:u,maxDelay:f,jitter:d}=t||{},p=Fe(n,{name:"maxAttempts",className:"PowerDeadline",min:1,integer:!0,fallback:1}),m=r==null?null:Fe(r,{name:"attemptTimeout",className:"PowerDeadline",min:1}),g=i==null?null:Fe(i,{name:"totalTimeout",className:"PowerDeadline",min:1}),y=Fe(a,{name:"retryDelay",className:"PowerDeadline",min:0,fallback:0}),h=typeof o=="function"?o:()=>!!o,_=tt(),w=g!==null?_+g:null,b=w!==null&&typeof AbortController<"u"?new AbortController:null,x=()=>{if(!s)return null;if(s.aborted)return{promise:Promise.reject(Li(s.reason,_,g)),cleanup:null};let re=null;return{promise:new Promise((ae,J)=>{const R=()=>{J(Li(s.reason,_,g))};s.addEventListener("abort",R,{once:!0}),re=()=>s.removeEventListener("abort",R)}),cleanup:re}},z=async(re,ae)=>{const J=tt();if(w!==null&&J>=w){const L=new Error("Deadline exceeded");throw L.code="EDEADLINE",L.attempts=re,L.elapsedMs=tt()-_,L}if(s?.aborted){const L=Li(s.reason,_,g);throw L.attempts=re,L.attemptTimeout=m,L.totalTimeout=g,L}if(ae?.aborted){const L=Li(ae.reason,_,g);throw L.attempts=re,L.attemptTimeout=m,L.totalTimeout=g,L}const R=bo(ae,b?b.signal:null),N=bo(s,R.signal),M=N.signal,A=x(),O=[Promise.resolve().then(()=>e(M))],H=[R.detach,N.detach];if(w!==null){const L=w-tt();let Q;const ee=new Promise((he,me)=>{const xe=setTimeout(()=>{if(b)try{b.abort()}catch{}const Pe=new Error("Deadline exceeded");Pe.code="EDEADLINE",Pe.attempts=re,Pe.elapsedMs=tt()-_,me(Pe)},L);Q=()=>clearTimeout(xe)});O.push(ee),H.push(Q)}A&&(O.push(A.promise),typeof A.cleanup=="function"&&H.push(A.cleanup));try{return await Promise.race(O)}catch(L){if(L&&typeof L=="object"){const Q=L;Q.attempts=re,Q.attemptTimeout=m,Q.totalTimeout=g}throw L}finally{for(const L of H)typeof L=="function"&&L()}},D={maxAttempts:p,attemptTimeout:m,retryIf:re=>re&&(re.code==="EABORT"||re.code==="EDEADLINE")?!1:h(re),onRetry:l};typeof c<"u"&&(D.backoff=c),typeof u<"u"&&(D.baseDelay=u),typeof f<"u"&&(D.maxDelay=f),typeof d<"u"&&(D.jitter=d),y>0&&typeof D.backoff>"u"&&(D.backoff="fixed",D.baseDelay=y,D.maxDelay=y,D.jitter=!1);let B=0;const j=async re=>(B+=1,z(B,re));return Ki.run(j,D)}constructor(e={}){xt(e,["maxAttempts","attemptTimeout","totalTimeout","retryDelay","retryIf","signal","onRetry","backoff","baseDelay","maxDelay","jitter"],"PowerDeadline"),this._options=e||{}}async run(e,t={}){return this.constructor.run(e,Object.assign({},this._options,t))}},Li=(e,t,n)=>{const r=new Error("Aborted");return r.code="EABORT",r.reason=e,r.attempts=0,r.elapsedMs=tt()-t,r.totalTimeout=n,r},bo=(e,t)=>{const n=()=>{};if(!e&&!t)return{signal:void 0,detach:n};if(!e)return{signal:t,detach:n};if(!t)return{signal:e,detach:n};if(typeof AbortController>"u")return{signal:e,detach:n};if(e.aborted||t.aborted){const l=new AbortController,c=e.aborted?e.reason:t.reason;try{l.abort(c)}catch{l.abort()}return{signal:l.signal,detach:n}}const r=new AbortController,i=l=>{try{r.abort(l&&l.target&&"reason"in l.target?l.target.reason:void 0)}catch{}},a=[e,t].filter(l=>l&&typeof l.addEventListener=="function"&&typeof l.removeEventListener=="function");for(const l of a)l.addEventListener("abort",i,{once:!0});let o=!1;const s=()=>{if(!o){o=!0;for(const l of a)try{l.removeEventListener("abort",i)}catch{}}};return{signal:r.signal,detach:s}},yh=ha({currentLang:()=>Bt,formatDate:()=>wh,formatNumber:()=>bh,loadL10nFile:()=>Rs,setLang:()=>Ls,t:()=>Gn,tPlural:()=>_h}),Kt=structuredClone(Dl),ea="en";if(typeof navigator<"u"){const e=navigator.language||navigator.languages?.[0]||"en";ea=String(e).split("-")[0].toLowerCase()}Dl[ea]||(ea="en");var Bt=ea;function Gn(e,t={}){let n=(Kt[Bt]||Kt.en)?.[e]||Kt.en[e]||"";for(const r of Object.keys(t)){const i=r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");n=n.replace(new RegExp(`\\{${i}\\}`,"g"),String(t[r]))}return n}async function Rs(e,t){if(!e)return;let n=e;const r=async i=>{if(Wr&&typeof Wr.run=="function")return await Wr.run(()=>fetch(i),{attemptTimeout:1e4,maxAttempts:1});let a=null;try{typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function"&&(a=AbortSignal.timeout(1e4))}catch{}return await fetch(i,a?{signal:a}:void 0)};try{/^https?:\/\//.test(e)||(/^file:\/\//i.test(e)?n=e:n=new URL(e,location.origin+t).toString());const i=await r(n);if(!i.ok)return;const a=await i.json();for(const o of Object.keys(a||{}))Kt[o]=Object.assign({},Kt[o]||{},a[o])}catch{}}function _h(e,t,n={}){try{const r=Kt[Bt]||Kt.en,i=new Intl.PluralRules(Bt).select(t),a=`${e}.${i}`;let o=r?.[a]||"";if(!o){const l=r?.[e];l&&typeof l=="object"?o=l[i]||"":typeof l=="string"&&(o=l)}if(o||(o=Kt.en[a]||""),!o){const l=Kt.en[e];l&&typeof l=="object"?o=l[i]||"":typeof l=="string"&&(o=l)}const s={count:String(t),...n};for(const l of Object.keys(s)){const c=l.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");o=o.replace(new RegExp(`\\{${c}\\}`,"g"),String(s[l]))}return o}catch{return Gn(e,n)}}function wh(e,t={}){try{const n=e instanceof Date?e:new Date(e);return isNaN(n.getTime())?String(e):new Intl.DateTimeFormat(Bt,{year:"numeric",month:"short",day:"numeric",...t}).format(n)}catch{return String(e)}}function bh(e,t={}){try{return new Intl.NumberFormat(Bt,t).format(e)}catch{return String(e)}}function Ls(e){const t=String(e??"").split("-")[0].toLowerCase();Bt=Kt[t]?t:"en";try{if(typeof document<"u"&&document.documentElement){document.documentElement.setAttribute("lang",t);try{const n=new Intl.Locale(t||"en"),r=n.textInfo&&n.textInfo.direction==="rtl"||["ar","he","fa","ur","ps","sd","ug","ku","dv","yi"].includes(t);document.documentElement.setAttribute("dir",r?"rtl":"ltr")}catch{}}}catch{}try{typeof window<"u"&&window.__nimbiUI&&typeof window.__nimbiUI.renderByQuery=="function"&&window.__nimbiUI.renderByQuery().catch(()=>{})}catch{}}var ie=new Map,_e=new Map,ht=[],Qe=new Set;function vh(e){ht=e}var kt=new Set,ta=!1;function Fi(){return ta}function lr(e){if(kh(),kt.clear(),Array.isArray(ht)&&ht.length)for(const t of ht)t&&kt.add(t);else for(const t of Qe)t&&kt.add(t);vo(ie),vo(_e),ta=!0}try{Object.defineProperty(lr,"_refreshed",{get(){return ta},set(e){ta=!!e},configurable:!0})}catch{}function vo(e){if(!(!e||typeof e.values!="function"))for(const t of e.values())t&&kt.add(t)}function ko(e){if(!e||typeof e.set!="function")return;const t=e.set;e.set=function(n,r){return r&&typeof r=="string"?kt.add(r):r?.default&&kt.add(r.default),t.call(this,n,r)}}var xo=!1;function kh(){xo||(ko(ie),ko(_e),xo=!0)}function xh(e){try{return String(e??"").split("/").map(t=>encodeURIComponent(t)).join("/")}catch{return String(e??"")}}function So(e,t=null,n=void 0){let r="#/"+xh(String(e??""));t&&(r+="#"+encodeURIComponent(String(t)));try{let i="";if(typeof n=="string")i=n;else if(typeof location<"u"&&location?.search)i=location.search;else if(typeof location<"u"&&location?.hash)try{const a=yt(location.href);a?.params&&(i=a.params)}catch{}if(i){const a=typeof i=="string"&&i.startsWith("?")?i.slice(1):i;try{const o=new URLSearchParams(a);o.delete("page");const s=o.toString();s&&(r+="?"+s)}catch{const s=String(a??"").replace(/^page=[^&]*&?/,"");s&&(r+="?"+s)}}}catch{}return r}function yt(e){try{const t=new URL(e,typeof location<"u"?location.href:"http://localhost/"),n=t.searchParams.get("page");if(n){let i=null,a="";if(t.hash){const l=t.hash.replace(/^#/,"");if(l.includes("&")){const c=l.split("&");i=c.shift()||null,a=c.join("&")}else i=l||null}const o=new URLSearchParams(t.search);o.delete("page");const s=[o.toString(),a].filter(Boolean).join("&");return{type:"canonical",page:decodeURIComponent(n),anchor:i,params:s}}const r=t.hash?decodeURIComponent(t.hash.replace(/^#/,"")):"";if(r&&r.startsWith("/")){let i=r,a="";if(i.indexOf("?")!==-1){const l=i.split("?");i=l.shift()||"",a=l.join("?")||""}let o=i,s=null;if(o.indexOf("#")!==-1){const l=o.split("#");o=l.shift()||"",s=l.join("#")||null}return{type:"cosmetic",page:o.replace(/^\/+/,"")||null,anchor:s,params:a}}return{type:"path",page:(t.pathname||"").replace(/^\//,"")||null,anchor:t.hash?t.hash.replace(/^#/,""):null,params:t.search?t.search.replace(/^\?/,""):""}}catch{return{type:"unknown",page:e,anchor:null,params:""}}}var Pi=typeof DOMParser<"u"?new DOMParser:null;function at(){return Pi||(typeof DOMParser<"u"?(Pi=new DOMParser,Pi):null)}function ur(e){if(e.startsWith("---")){const t=e.indexOf(`
---`,3);if(t!==-1){const n=e.slice(3,t+0).trim(),r=e.slice(t+4).trimStart(),i={};return n.split(/\r?\n/).forEach(a=>{const o=a.match(/^([^:]+):\s*(.*)$/);o&&(i[o[1].trim()]=o[2].trim())}),{content:r,data:i}}}return{content:e,data:{}}}var Ul=`let S, _;
function K() {
	return S !== void 0 ? S === !1 ? null : S : typeof TextEncoder < "u" ? (S = new TextEncoder(), S) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (S = { encode: (e) => new Uint8Array(Buffer.from(e)) }, S) : null;
}
function B(e) {
	if (e instanceof ArrayBuffer) return !0;
	try {
		return typeof Reflect.get(ArrayBuffer.prototype, "byteLength", e) == "number";
	} catch {
		return !1;
	}
}
function v(e) {
	if (typeof SharedArrayBuffer > "u") return !1;
	if (e instanceof SharedArrayBuffer) return !0;
	try {
		return typeof Reflect.get(SharedArrayBuffer.prototype, "byteLength", e) == "number";
	} catch {
		return !1;
	}
}
function X() {
	return _ !== void 0 ? _ === !1 ? null : _ : typeof TextDecoder < "u" ? (_ = new TextDecoder(), _) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (_ = { decode: (e) => Buffer.from(e).toString("utf8") }, _) : null;
}
const D = (e, t) => {
	if (e instanceof Uint8Array) return e;
	if (ArrayBuffer.isView(e)) return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
	if (B(e)) return new Uint8Array(e);
	if (v(e)) return new Uint8Array(e);
	const r = t ?? JSON.stringify(e);
	if (typeof r != "string") throw new TypeError(\`PowerBuffer.o2u8: JSON.stringify returned \${r === void 0 ? "undefined" : typeof r} for a value of type \${typeof e}, which is not encodable. Functions, Symbols and \\\`undefined\\\` have no JSON representation.\`);
	const n = K();
	if (typeof n?.encode == "function") return n.encode(r);
	throw new Error("No TextEncoder or Buffer available to encode object");
}, k = (e) => {
	let t;
	if (e instanceof Uint8Array) t = e;
	else if (ArrayBuffer.isView(e)) t = new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
	else if (B(e)) t = new Uint8Array(e);
	else if (v(e)) t = new Uint8Array(e);
	else if (typeof Buffer < "u" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(e)) t = new Uint8Array(e);
	else throw new TypeError("Unsupported input to u82o, expected ArrayBuffer/TypedArray/Buffer");
	const r = X();
	if (typeof r?.decode == "function") return JSON.parse(r.decode(t));
	throw new Error("No TextDecoder or Buffer available to decode object");
};
function Z(e, t) {
	const { name: r, className: n, min: s = 0, integer: o = !1, allowInfinity: i = !1, fallback: a, invalidMessage: l, minMessage: c, integerMessage: d } = t;
	if (e == null) return a !== void 0 ? a : e;
	const h = Number(e);
	if (h === Number.POSITIVE_INFINITY && i) return h;
	if (!Number.isFinite(h)) throw new TypeError(l ?? \`\${n}: \\\`\${r}\\\` must be a finite number (received \${String(e)}). A non-finite limit would silently disable the check it guards.\`);
	if (o && !Number.isInteger(h)) throw new TypeError(d ?? \`\${n}: \\\`\${r}\\\` must be a whole number (received \${String(e)}). A fractional limit is silently rounded up by the first consumer, so it admits more than the number that was configured.\`);
	if (h < s) throw new TypeError(c ?? \`\${n}: \\\`\${r}\\\` must be >= \${s} (received \${h}).\`);
	return h;
}
function ee(e, t) {
	const r = Z(e, t);
	if (typeof r != "number") throw new TypeError(\`\${t.className}: \\\`\${t.name}\\\` must be a number or have a \\\`fallback\\\`, but resolved to \${String(r)}.\`);
	return r;
}
const b = Object.freeze({
	JSON: 0,
	RAW: 2
});
const W = /* @__PURE__ */ new Set([
	"framed",
	"legacy",
	"negotiated"
]);
for (const e of [
	"add",
	"delete",
	"clear"
]) Object.defineProperty(W, e, {
	value: () => {
		throw new TypeError(\`MESSAGE_CODECS is read-only: \\\`\${e}()\\\` would let a consumer widen the set of codecs a pool accepts, and PowerPool validates against it.\`);
	},
	enumerable: !1,
	writable: !1,
	configurable: !1
});
const te = /* @__PURE__ */ new Map([[b.JSON, "json"], [b.RAW, "raw"]]), re = /* @__PURE__ */ new Map([["json", b.JSON], ["raw", b.RAW]]);
function F() {
	return typeof structuredClone == "function";
}
function M(e) {
	return B(e) || typeof ArrayBuffer < "u" && ArrayBuffer.isView(e);
}
function V(e) {
	return M(e) ? "raw" : "json";
}
function ne(e, t = {}) {
	const r = t.codec || V(e), n = re.get(r);
	if (n === void 0) throw new TypeError(\`PowerMessageCodec: unknown codec "\${r}". Expected "json" or "raw". For structured-clone speed on a MessagePort/Worker use encodeNativeEnvelope() instead.\`);
	let s;
	if (n === b.RAW) {
		if (!M(e)) throw new TypeError("PowerMessageCodec: the \\"raw\\" codec requires an ArrayBuffer or a typed array");
		s = B(e) ? new Uint8Array(e) : new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
	} else s = D(e);
	return U(n, s);
}
function U(e, t) {
	const r = new Uint8Array(6 + t.length);
	return r[0] = 1, r[1] = e, r[2] = t.length & 255, r[3] = t.length >>> 8 & 255, r[4] = t.length >>> 16 & 255, r[5] = t.length >>> 24 & 255, r.set(t, 6), r;
}
function oe(e) {
	if (typeof e == "string") return U(b.JSON, D(null, e));
	if (!M(e)) throw new TypeError("PowerMessageCodec: frameEncodedJson() requires a Uint8Array or a JSON string");
	return U(b.JSON, T(e));
}
function N(e, t = 0) {
	return (e[t + 2] | e[t + 3] << 8 | e[t + 4] << 16 | e[t + 5] << 24) >>> 0;
}
function x(e, t = {}) {
	const r = t.strict !== !1, n = T(e);
	if (n.length < 6) throw new RangeError(\`PowerMessageCodec: frame is \${n.length} bytes, shorter than the 6-byte header\`);
	const s = n[0];
	if (r && s !== 1) throw new RangeError(\`PowerMessageCodec: unsupported protocol version \${s} (expected 1)\`);
	const o = te.get(n[1]);
	if (o === void 0) throw new RangeError(\`PowerMessageCodec: unknown codec id \${n[1]}\`);
	const i = N(n);
	if (n.length < 6 + i) throw new RangeError(\`PowerMessageCodec: frame declares a \${i}-byte payload but only \${n.length - 6} bytes are present (truncated frame)\`);
	const a = 6, l = a + i;
	return {
		version: s,
		codec: o,
		value: o === "raw" ? t.rawAsBytes === !0 ? n.subarray(a, l) : n.slice(a, l) : k(n.subarray(a, l)),
		byteLength: l
	};
}
function ie(e) {
	if (e?.maxFrameBytes === void 0) throw new TypeError("PowerMessageCodec: createFrameDecoder() requires \`maxFrameBytes\`. A frame declares its own payload length, so a peer that sends a header and then stops would pin this buffer at whatever size it named. Pass \`Infinity\` to accept that risk explicitly.");
	const t = ee(e.maxFrameBytes, {
		name: "maxFrameBytes",
		className: "PowerMessageCodec.createFrameDecoder",
		min: 6,
		integer: !0,
		allowInfinity: !0
	}), r = e.strict !== !1, n = e.rawAsBytes === !0, s = 1024;
	let o = new Uint8Array(s), i = 0, a = 0;
	function l(c) {
		if (a + c <= o.length) return;
		const d = a - i;
		if (d + c <= o.length) o.copyWithin(0, i, a);
		else {
			let h = o.length || s;
			for (; h < d + c;) h *= 2;
			const g = new Uint8Array(h);
			g.set(o.subarray(i, a)), o = g;
		}
		i = 0, a = d;
	}
	return {
		/**
		* Feed the next chunk of the stream, and take every complete frame out of it.
		*
		* @param {Uint8Array|ArrayBuffer|DataView} chunk - Whatever the transport
		*   handed over. It is copied in, so the caller may reuse or transfer its
		*   buffer immediately.
		* @returns {Array<{version:number, codec:'json'|'raw', value:any, byteLength:number}>}
		*   The frames completed by this chunk — **every** one of them, not the
		*   first. Empty when the chunk held no complete frame, which includes the
		*   ordinary case of a chunk too short to hold a header yet.
		*/
		push(c) {
			const d = T(c);
			l(d.length), o.set(d, a), a += d.length;
			const h = [];
			for (; a - i >= 6;) {
				const g = N(o, i);
				if (6 + g > t) throw new RangeError(\`PowerMessageCodec: frame declares \${6 + g} bytes, over the maxFrameBytes limit of \${t}\`);
				if (a - i < 6 + g) break;
				const $ = x(o.subarray(i, a), {
					strict: r,
					rawAsBytes: n
				});
				h.push($), i += $.byteLength;
			}
			return i === a && (i = 0, a = 0), h;
		},
		/**
		* Report what is still buffered, for end-of-stream.
		*
		* @param {Object} [flushOptions]
		* @param {boolean} [flushOptions.strict=false] - Throw a \`RangeError\`
		*   naming the shortfall instead of returning the bytes.
		* @returns {Uint8Array} A **copy** of the unconsumed remainder, safe to
		*   keep after the decoder is reused or disposed. Zero-length means the
		*   stream ended on a frame boundary and nothing was lost.
		*/
		flush(c = {}) {
			const d = a - i;
			if (d > 0 && c.strict === !0) {
				const h = d < 6 ? null : N(o, i), g = h === null ? 6 : 6 + h;
				throw new RangeError(\`PowerMessageCodec: stream ended mid-frame — \${d} of \${g} bytes buffered\` + (h === null ? ", not even a whole header" : ""));
			}
			return o.slice(i, a);
		},
		/** Bytes currently held for an incomplete frame. */
		get pendingBytes() {
			return a - i;
		},
		/**
		* Drop any incomplete frame and start over, keeping the buffer for reuse.
		*
		* For a stream that has desynchronised and cannot be resynchronised: once a
		* frame is mis-parsed the length prefix is no longer trustworthy, so the
		* bytes after it cannot be framed either.
		*/
		reset() {
			i = 0, a = 0;
		},
		/**
		* Release the buffer.
		*
		* This is a **state reset**, not a cancellation: the decoder owns no timer,
		* no listener and no handle of any kind, only bytes. It is safe to keep
		* pushing afterwards — the next \`push\` allocates a fresh buffer — so a
		* \`using\` block that disposes early does not leave a dead object behind.
		*/
		dispose() {
			this.reset(), o = /* @__PURE__ */ new Uint8Array(0);
		},
		[Symbol.dispose]() {
			this.dispose();
		}
	};
}
function ae(e) {
	if (!F()) throw new TypeError("PowerMessageCodec: structuredClone is unavailable in this runtime. Use encodeMessage() for a portable JSON frame instead.");
	const t = structuredClone(e);
	return {
		message: t,
		transfer: Y(t)
	};
}
function se(e) {
	if (typeof SharedArrayBuffer < "u" && e.buffer instanceof SharedArrayBuffer) return [];
	if (e.byteOffset !== 0 || e.byteLength !== e.buffer.byteLength) throw new RangeError(\`PowerMessageCodec: refusing to build a transfer list for a \${e.byteLength}-byte view at offset \${e.byteOffset} of a \${e.buffer.byteLength}-byte buffer — transferring \\\`frame.buffer\\\` would detach the whole buffer, including bytes outside this frame. Copy the view, or transfer the buffer it fills.\`);
	return [e.buffer];
}
const I = "__pp";
function J(e) {
	return e !== null && typeof e == "object" && e.__pp === 1 && e.kind === "envelope" && "value" in e;
}
function ce(e) {
	return e !== null && typeof e == "object" && e.__pp === 1 && e.kind === "capabilities" && Array.isArray(e.codecs);
}
function fe(e, t = {}) {
	const r = {
		[I]: 1,
		kind: "envelope",
		value: e
	};
	return t.correlationId != null && (r.correlationId = String(t.correlationId)), r;
}
function z(e = {}) {
	const t = Array.isArray(e.codecs) && e.codecs.length ? e.codecs.filter((r) => r === "json" || r === "native") : ["json", "native"];
	return {
		[I]: 1,
		kind: "capabilities",
		codecs: t.includes("json") ? t : ["json", ...t],
		protocol: 1
	};
}
function Y(e, t = 8) {
	const r = [], n = /* @__PURE__ */ new Set(), s = (o, i) => {
		if (!(!o || i > t)) {
			if (o instanceof ArrayBuffer) {
				n.has(o) || (n.add(o), r.push(o));
				return;
			}
			if (ArrayBuffer.isView(o)) {
				n.has(o.buffer) || (n.add(o.buffer), r.push(o.buffer));
				return;
			}
			if (typeof o == "object") for (const a of Object.keys(o)) s(o[a], i + 1);
		}
	};
	return s(e, 0), r;
}
function q(e) {
	if (J(e)) return {
		codec: "native",
		value: e.value,
		correlationId: e.correlationId
	};
	if (B(e) || ArrayBuffer.isView(e)) {
		const t = T(e);
		if (t.length >= 6 && t[0] === 1) {
			const r = x(t);
			return {
				codec: r.codec,
				value: r.value,
				correlationId: void 0
			};
		}
		if (!le(t[0])) throw t[0] === 1 ? /* @__PURE__ */ new RangeError(\`PowerMessageCodec: truncated frame — \${t.length} byte(s) is shorter than the 6-byte header\`) : /* @__PURE__ */ new RangeError(\`PowerMessageCodec: unsupported protocol version \${t[0]} (expected 1)\`);
		return {
			codec: "legacy",
			value: k(t),
			correlationId: void 0
		};
	}
	return {
		codec: "raw",
		value: e,
		correlationId: void 0
	};
}
function le(e) {
	return e === 32 || e === 9 || e === 10 || e === 13 ? !0 : e >= 32;
}
function T(e) {
	if (e instanceof Uint8Array) return e;
	if (B(e)) return new Uint8Array(e);
	if (typeof ArrayBuffer < "u" && ArrayBuffer.isView(e)) return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
	throw new TypeError("PowerMessageCodec: expected a Uint8Array, ArrayBuffer or DataView");
}
Object.freeze({
	MESSAGE_PROTOCOL_VERSION: 1,
	CODECS: b,
	MESSAGE_CODECS: W,
	HEADER_BYTES: 6,
	encodeMessage: ne,
	decodeMessage: x,
	createFrameDecoder: ie,
	frameEncodedJson: oe,
	encodeNative: ae,
	canUseNativeClone: F,
	selectCodec: V,
	isRawPayload: M,
	frameTransferList: se,
	NATIVE_ENVELOPE_KEY: I,
	NATIVE_PROTOCOL_VERSION: 1,
	isNativeEnvelope: J,
	isCapabilityAnnouncement: ce,
	encodeNativeEnvelope: fe,
	announceCapabilities: z,
	collectTransferables: Y,
	decodeInbound: q
});
function ue(e) {
	if (e.startsWith("---")) {
		const t = e.indexOf(\`
---\`, 3);
		if (t !== -1) {
			const r = e.slice(3, t + 0).trim(), n = e.slice(t + 4).trimStart(), s = {};
			return r.split(/\\r?\\n/).forEach((o) => {
				const i = o.match(/^([^:]+):\\s*(.*)$/);
				i && (s[i[1].trim()] = i[2].trim());
			}), {
				content: n,
				data: s
			};
		}
	}
	return {
		content: e,
		data: {}
	};
}
let R = null, P = [];
const L = 1e3, de = 4;
function C(e) {
	let t = String(e ?? "").toLowerCase().replace(/[^a-z0-9\\- ]/g, "").replace(/ /g, "-");
	return t = t.replace(/(?:-?)(?:md|html)$/g, ""), t = t.replace(/-+/g, "-"), t = t.replace(/^-|-$/g, ""), t.length > 80 && (t = t.slice(0, 80).replace(/-+$/g, "")), t;
}
function A(e) {
	return String(e ?? "").replace(/^[./]+/, "");
}
function he(e) {
	return String(e ?? "").replace(/\\/+$/, "");
}
function O(e) {
	return he(e) + "/";
}
function ye(e, t) {
	if (!e || typeof e != "string") return !1;
	if (e.startsWith("//")) return !0;
	if (/^[a-z][a-z0-9+.-]*:/i.test(e)) {
		if (t && typeof t == "string") try {
			const r = new URL(e), n = new URL(t);
			if (r.origin === n.origin) return !r.pathname.startsWith(n.pathname);
		} catch {}
		return !0;
	}
	return !1;
}
function G(e) {
	const t = typeof location < "u" && location.origin ? location.origin : "http://localhost", r = String(e ?? "");
	return r ? /^[a-z][a-z0-9+.-]*:/i.test(r) ? O(r) : r.startsWith("/") ? t + O(r) : t + "/" + O(r) : t + "/";
}
async function H(e, t) {
	const r = G(t), n = new URL(String(e ?? "").replace(/^\\//, ""), r).toString(), s = await fetch(n);
	return !s || !s.ok ? null : await s.text();
}
async function pe(e, t, r = de) {
	const n = Array.isArray(e) ? e.slice() : [], s = Math.max(1, Number(r) || 1), o = [];
	for (let i = 0; i < Math.min(s, n.length); i++) o.push((async () => {
		for (; n.length;) {
			const a = n.shift();
			a != null && await t(a);
		}
	})());
	await Promise.all(o);
}
async function j(e, t = L, r = void 0) {
	const n = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), o = [""];
	if (Array.isArray(r)) for (const l of r) try {
		const c = A(l);
		c && o.push(c);
	} catch {}
	const i = G(e), a = O(new URL(i).pathname);
	for (; o.length && o.length <= t;) {
		const l = o.shift();
		if (l == null || n.has(l)) continue;
		n.add(l);
		const c = new URL(String(l ?? ""), i).toString();
		let d = null;
		try {
			const y = await fetch(c);
			if (!y || !y.ok) continue;
			d = await y.text();
		} catch {
			continue;
		}
		if (!d) continue;
		const h = [], g = /<a\\s+[^>]*href=["']([^"']+)["'][^>]*>/gi, $ = /(?:^|[^!])\\[[^\\]]+\\]\\(([^)]+)\\)/g;
		let m = null;
		for (; m = g.exec(d);) try {
			m?.[1] && h.push(m[1]);
		} catch {}
		for (; m = $.exec(d);) try {
			m?.[1] && h.push(m[1]);
		} catch {}
		for (const y of h) {
			if (!y || ye(y, i) || y.startsWith("..") || y.includes("/../")) continue;
			if (y.endsWith("/")) {
				try {
					const f = new URL(y, c);
					let u = f.pathname.startsWith(a) ? f.pathname.slice(a.length) : f.pathname.replace(/^\\//, "");
					u = O(A(u)), n.has(u) || o.push(u);
				} catch {}
				continue;
			}
			if (/\\.(md|html?)($|[?#])/i.test(y)) {
				try {
					const f = new URL(y, c);
					let u = f.pathname.startsWith(a) ? f.pathname.slice(a.length) : f.pathname.replace(/^\\//, "");
					u = A(u).split(/[?#]/)[0], u && (s.add(u), n.has(u) || o.push(u));
				} catch {}
				try {
					const f = new URL(y, i);
					let u = f.pathname.startsWith(a) ? f.pathname.slice(a.length) : f.pathname.replace(/^\\//, "");
					u = A(u).split(/[?#]/)[0], u && !s.has(u) && (s.add(u), n.has(u) || o.push(u));
				} catch {}
				continue;
			}
			let w = y.split(/[?#]/)[0].replace(/\\/+$/, ""), p = null;
			try {
				const f = new URL(y, i);
				p = f.pathname.startsWith(a) ? f.pathname.slice(a.length) : f.pathname.replace(/^\\//, "");
			} catch {}
			try {
				const f = new URL(y, c);
				w = f.pathname.startsWith(a) ? f.pathname.slice(a.length) : f.pathname.replace(/^\\//, "");
			} catch {}
			w = A(w).split(/[?#]/)[0].replace(/\\/+$/, ""), p && (p = A(p).split(/[?#]/)[0].replace(/\\/+$/, ""));
			const E = String(w).split("/").pop() || "";
			if (!/\\.[^./]+$/i.test(E)) {
				if (w) {
					const f = [
						\`\${w}.md\`,
						\`\${w}.html\`,
						\`\${w}/README.md\`,
						\`\${w}/README.html\`
					];
					for (const u of f) s.add(u), n.has(u) || o.push(u);
				}
				if (p && p !== w) {
					const f = [
						\`\${p}.md\`,
						\`\${p}.html\`,
						\`\${p}/README.md\`,
						\`\${p}/README.html\`
					];
					for (const u of f) s.has(u) || (s.add(u), n.has(u) || o.push(u));
				}
			}
		}
	}
	return Array.from(s);
}
function ge(e, t) {
	const r = String(e ?? "");
	if (t) return {
		title: ((r.match(/<title[^>]*>([\\s\\S]*?)<\\/title>/i) || [])[1] || (r.match(/<h1[^>]*>([\\s\\S]*?)<\\/h1>/i) || [])[1] || "").replace(/<[^>]+>/g, "").trim(),
		excerpt: ((r.match(/<p[^>]*>([\\s\\S]*?)<\\/p>/i) || [])[1] || "").replace(/<[^>]+>/g, "").trim()
	};
	const n = ((r.match(/^#\\s+(.+)$/m) || [])[1] || "").trim(), s = r.split(/\\r?\\n\\s*\\r?\\n/);
	let o = "";
	for (let i = 1; i < s.length; i++) {
		const a = s[i].trim();
		if (a && !/^#/.test(a)) {
			o = a.replace(/\\r?\\n/g, " ");
			break;
		}
	}
	return {
		title: n,
		excerpt: o
	};
}
async function Q(e, t = 1, r = void 0, n = void 0) {
	if (R) return R;
	R = (async () => {
		const s = Array.isArray(r) ? new Set(r.map((c) => A(c))) : /* @__PURE__ */ new Set(), o = Array.isArray(n) ? n.map((c) => A(c)).filter(Boolean) : [], i = await j(e, L, o), a = Array.from(new Set(i.concat(o))).filter((c) => /\\.(md|html?)$/i.test(c)).filter((c) => !Array.from(s).some((d) => d && (c === d || c.startsWith(d + "/")))), l = [];
		return await pe(a, async (c) => {
			const d = await H(c, e);
			if (!d) return;
			const h = /\\.html?$/i.test(c), { title: g, excerpt: $ } = ge(d, h), m = C(g || c);
			let y = null, w = null;
			try {
				if (!h) {
					const { data: p } = ue(d), E = p.dateModified || p.date || p.lastmod;
					if (E) {
						const u = new Date(E);
						isNaN(u.getTime()) || (y = u.toISOString().split("T")[0]);
					}
					const f = p.image || p.og_image || p.cover || p.featured_image;
					f && String(f).trim() && (w = String(f).trim());
				}
			} catch {}
			if (l.push({
				slug: m,
				title: g,
				excerpt: $,
				path: c,
				lastmod: y,
				image: w
			}), Number(t) >= 2) {
				const p = h ? /<h2[^>]*>([\\s\\S]*?)<\\/h2>/gi : /^##\\s+(.+)$/gm;
				let E = null;
				for (; E = p.exec(d);) {
					const f = String(E[1] ?? "").replace(/<[^>]+>/g, "").trim();
					f && l.push({
						slug: \`\${m}::\${C(f)}\`,
						title: f,
						excerpt: "",
						path: c,
						parentTitle: g || "",
						lastmod: y
					});
				}
			}
		}), P = l, P;
	})();
	try {
		return await R;
	} finally {
		R = null;
	}
}
async function we(e, t, r) {
	const n = C(e);
	if (!n) return null;
	const s = await Q(t), o = (Array.isArray(s) ? s : []).find((l) => {
		try {
			return String(l?.slug ?? "").split("::")[0] === n;
		} catch {
			return !1;
		}
	});
	if (o?.path) return o.path;
	const i = [\`\${n}.html\`, \`\${n}.md\`];
	for (const l of i) try {
		if (await H(l, t)) return l;
	} catch {}
	const a = await j(t, r || L);
	for (const l of a) if (C(String(l ?? "").replace(/^.*\\//, "").replace(/\\.(md|html?)$/i, "")) === n) return l;
	return null;
}
try {
	typeof postMessage == "function" && postMessage(z({ native: !0 }));
} catch {}
onmessage = async (e) => {
	const t = q(e.data), r = t.value, n = t.correlationId ?? r.correlationId, s = (i) => {
		n != null ? postMessage({
			correlationId: n,
			response: i
		}) : postMessage({
			id: r.id,
			result: i
		});
	}, o = (i) => {
		n != null ? postMessage({
			correlationId: n,
			response: { error: String(i) }
		}) : postMessage({
			id: r.id,
			error: String(i)
		});
	};
	try {
		if (r.type === "buildSearchIndex") {
			const { contentBase: i, indexDepth: a, noIndexing: l, seedPaths: c } = r;
			try {
				s(await Q(i, a, l, c));
			} catch (d) {
				o(d);
			}
			return;
		}
		if (r.type === "crawlForSlug") {
			const { slug: i, base: a, maxQueue: l } = r;
			try {
				const c = await we(i, a, l);
				s(c === void 0 ? null : c);
			} catch (c) {
				o(c);
			}
			return;
		}
	} catch (i) {
		o(i);
	}
};
`,Eo=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",Ul],{type:"text/javascript;charset=utf-8"});function Sh(e){let t;try{if(t=Eo&&(self.URL||self.webkitURL).createObjectURL(Eo),!t)throw"";const n=new Worker(t,{type:"module",name:e?.name});return n.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(t)}),n}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(Ul),{type:"module",name:e?.name})}}var Bn,Un;function Eh(){return Bn!==void 0?Bn===!1?null:Bn:typeof TextEncoder<"u"?(Bn=new TextEncoder,Bn):typeof Buffer<"u"&&typeof Buffer.from=="function"?(Bn={encode:e=>new Uint8Array(Buffer.from(e))},Bn):null}function gr(e){if(e instanceof ArrayBuffer)return!0;try{return typeof Reflect.get(ArrayBuffer.prototype,"byteLength",e)=="number"}catch{return!1}}function Fl(e){if(typeof SharedArrayBuffer>"u")return!1;if(e instanceof SharedArrayBuffer)return!0;try{return typeof Reflect.get(SharedArrayBuffer.prototype,"byteLength",e)=="number"}catch{return!1}}function Ah(){return Un!==void 0?Un===!1?null:Un:typeof TextDecoder<"u"?(Un=new TextDecoder,Un):typeof Buffer<"u"&&typeof Buffer.from=="function"?(Un={decode:e=>Buffer.from(e).toString("utf8")},Un):null}var cr=(e,t)=>{if(e instanceof Uint8Array)return e;if(ArrayBuffer.isView(e))return new Uint8Array(e.buffer,e.byteOffset,e.byteLength);if(gr(e))return new Uint8Array(e);if(Fl(e))return new Uint8Array(e);const n=t??JSON.stringify(e);if(typeof n!="string")throw new TypeError(`PowerBuffer.o2u8: JSON.stringify returned ${n===void 0?"undefined":typeof n} for a value of type ${typeof e}, which is not encodable. Functions, Symbols and \`undefined\` have no JSON representation.`);const r=Eh();if(typeof r?.encode=="function")return r.encode(n);throw new Error("No TextEncoder or Buffer available to encode object")},Ps=e=>{let t;if(e instanceof Uint8Array)t=e;else if(ArrayBuffer.isView(e))t=new Uint8Array(e.buffer,e.byteOffset,e.byteLength);else if(gr(e))t=new Uint8Array(e);else if(Fl(e))t=new Uint8Array(e);else if(typeof Buffer<"u"&&typeof Buffer.isBuffer=="function"&&Buffer.isBuffer(e))t=new Uint8Array(e);else throw new TypeError("Unsupported input to u82o, expected ArrayBuffer/TypedArray/Buffer");const n=Ah();if(typeof n?.decode=="function")return JSON.parse(n.decode(t));throw new Error("No TextDecoder or Buffer available to decode object")};function jr(e){const t=e?.reason;if(si(t))return t;try{return new DOMException("The operation was aborted","AbortError")}catch{const n=new Error("The operation was aborted");return n.name="AbortError",n}}var Th=null;function Ao(){const e=Th||(typeof require<"u"?require:null);if(e)return e("worker_threads").Worker;throw new Error("WorkerAgnostic: Node worker_threads is not available synchronously in pure ESM. Call `await preloadNode()` (imported from `performance-helpers` or `performance-helpers/WorkerAgnostic`) once before constructing a string-source worker, or set globalThis.Worker. A factory function does not need this preload.")}function To(){return typeof window<"u"&&typeof window.document<"u"?"browser":typeof self<"u"&&typeof self.importScripts=="function"?"webworker":typeof process<"u"&&process.versions?.node?"node":"unknown"}var za=["message","error","messageerror"];function Mh(e){const t={...e};return delete t.onError,t}function Mo(e,t,n){const r=typeof globalThis<"u"&&globalThis.Worker||(typeof Worker<"u"?Worker:void 0);if(typeof r=="function"&&typeof e=="string"&&(n==="node"||n==="unknown"))return new r(e,t);if(n==="node"||n==="browser"||n==="webworker"){if(typeof e=="function")return Co(e,()=>Ao(),t,n);if(typeof e=="string")return n==="node"?new(Ao())(e,t):Wl(e,t);throw new Error("Invalid workerSource: expected Worker factory or path string")}if(typeof e=="function")return Co(e,void 0,t,"unknown");throw new Error("Unsupported environment for WorkerAgnostic: cannot resolve a string workerSource without a global Worker or a known runtime")}function Co(e,t,n,r){if(typeof e.prototype>"u")return Ro(e(),t,n,r);try{return new e}catch(i){if(i instanceof TypeError&&/not a constructor|cannot be invoked without\s*'new'|Class constructor|not constructable/i.test(String(i?.message)))return Ro(e(),t,n,r);throw i}}function Ro(e,t,n,r){if(e&&typeof e.then=="function")throw new TypeError("WorkerAgnostic: an async worker factory was passed. Construct the worker synchronously, or await the factory yourself and pass the instance.");return e&&typeof e=="object"&&typeof e.postMessage=="function"?e:typeof e=="string"?r==="node"?new(typeof t=="function"?t():t)(e,n):Wl(e,n):e&&typeof e=="object"?e:{}}function Wl(e,t){const n=t&&typeof t=="object"?t.baseUrl:void 0;let r=typeof n=="string"?n:void 0;if(!r&&typeof document<"u"){const i=document.currentScript;i?.src&&(r=i.src)}!r&&typeof location<"u"&&location.href&&(r=location.href);try{if(r)return new Worker(new URL(e,r),t)}catch{}return new Worker(e,t)}function Ch(e){if(Array.isArray(e))return e;if(e&&typeof e=="object"&&Array.isArray(e.transfer))return e.transfer}var Rh=class{constructor(e,t={}){this.env=To(),this.options=t&&typeof t=="object"?t:{},this._onError=typeof this.options.onError=="function"?this.options.onError:null,this._wired=[],this._wiredProperties=[],this._disposed=!1,this._listeners=new Map,this.worker=Mo(e,this._onError?Mh(this.options):this.options,this.env),this._wireEvents()}static create(e,t){return Mo(e,t||{},To())}_wireEvents(){const e=this.worker;if(!e)return;const t=[];if(typeof e.addEventListener=="function"){this._nativeModel="listener";for(const n of za){const r=(...i)=>this._dispatch(n,...i);e.addEventListener(n,r),t.push([n,r])}}else if(typeof e.on=="function"){this._nativeModel="emitter";for(const n of za){const r=(...i)=>this._dispatch(n,...i);e.on(n,r),t.push([n,r])}}else{this._nativeModel="property";const n=[];for(const r of za){const i=r==="message"?"onmessage":r==="error"?"onerror":"onmessageerror",a=(...o)=>this._dispatch(r,...o);n.push([i,e[i]]),e[i]=a,t.push([r,a])}this._wiredProperties=n}this._wired=t}dispose(){if(this._disposed)return;this._disposed=!0;const e=this.worker;if(e){for(const[t,n]of this._wired??[])try{this._nativeModel==="listener"&&typeof e.removeEventListener=="function"?e.removeEventListener(t,n):this._nativeModel==="emitter"&&typeof e.off=="function"&&e.off(t,n)}catch{}if(this._nativeModel==="property"){const t=e;for(const[n,r]of this._wiredProperties??[])(t[n]!==void 0||r!==void 0)&&(t[n]=r)}}this._listeners.clear(),this._wired=[],this._wiredProperties=[]}[Symbol.dispose](){this.dispose()}_dispatch(e,...t){const n=this._listeners.get(e);if(!n||!n.size)return;let r;if(e==="message"){const i=t[0];r=[{data:this._nativeModel==="emitter"?i:i&&typeof i=="object"&&"data"in i?i.data:i,originalEvent:i}]}else r=t;for(const i of n)try{i(...r)}catch(a){this._notifyError(a,{type:e,listener:i})}}_notifyError(e,t){if(this._onError)try{this._onError(e,t)}catch{}}addEventListener(e,t){return typeof t!="function"?this:(this._listeners.has(e)||this._listeners.set(e,new Set),this._listeners.get(e).add(t),this)}removeEventListener(e,t){const n=this._listeners.get(e);return n&&(n.delete(t),n.size===0&&this._listeners.delete(e)),this}on(e,t){return this.addEventListener(e,t)}off(e,t){return this.removeEventListener(e,t)}postMessage(e,t){const n=this.worker;if(!n||typeof n.postMessage!="function")throw new Error("Underlying worker does not implement postMessage");const r=Ch(t);return r&&r.length?n.postMessage(e,r):n.postMessage(e)}terminate(){const e=this.worker;if(!e||typeof e.terminate!="function")return Promise.resolve();try{const t=e.terminate();return t&&typeof t.then=="function"?t:Promise.resolve(t)}catch(t){return Promise.reject(t)}}};function nr(e){if(e==null)return 1;const t=e.weight;return typeof t=="number"&&Number.isFinite(t)?t:1}var Wi=class{constructor(e=16){if(e&&typeof e=="object"&&"initialCapacity"in e){const r=e;xt(r,["initialCapacity"],"PowerQueue"),e=r.initialCapacity}const t=Fe(e,{name:"initialCapacity",className:"PowerQueue",min:0,fallback:16}),n=Math.max(2,t);for(this._capacity=1;this._capacity<n;)this._capacity<<=1;this._mask=this._capacity-1,this._buffer=new Array(this._capacity),this._head=0,this._tail=0,this._size=0,this._totalWeight=0}push(e){return this._size===this._capacity&&this._grow(),this._buffer[this._tail]=e,this._tail=this._tail+1&this._mask,this._size++,this._totalWeight+=nr(e),this._size}shift(){if(this._size===0)return;const e=this._buffer[this._head];return this._buffer[this._head]=void 0,this._head=this._head+1&this._mask,this._size--,this._totalWeight-=nr(e),e}peek(){return this._size===0?void 0:this._buffer[this._head]}reset(){this.clear()}clear(){if(this._size===0)return;let e=this._head;for(let t=0;t<this._size;t++)this._buffer[e]=void 0,e=e+1&this._mask;this._head=this._tail=0,this._size=0,this._totalWeight=0}shrink(e=16){const t=Fe(e,{name:"minimum",className:"PowerQueue",min:0,fallback:16}),n=Math.max(2,t,this._size);let r=1;for(;r<n;)r<<=1;if(r>=this._capacity)return this._capacity;const i=new Array(r);for(let a=0;a<this._size;a++)i[a]=this._buffer[this._head+a&this._mask];return this._buffer=i,this._capacity=r,this._mask=r-1,this._head=0,this._tail=this._size&this._mask,this._capacity}fill(e,t=1){const n=Fe(t,{name:"count",className:"PowerQueue",min:0,integer:!0,fallback:0}),r=nr(e)*n;for(let i=0;i<n;i++)this._size===this._capacity&&this._grow(),this._buffer[this._tail]=e,this._tail=this._tail+1&this._mask,this._size++;return this._totalWeight+=r,this._size}get capacity(){return this._capacity}get isEmpty(){return this._size===0}*[Symbol.iterator](){const e=this._head;for(let t=0;t<this._size;t++)yield this._buffer[e+t&this._mask]}values(){return this[Symbol.iterator]()}*keys(){for(let e=0;e<this._size;e++)yield e}*entries(){for(let e=0;e<this._size;e++)yield[e,this._buffer[this._head+e&this._mask]]}*drain(){for(;this._size>0;)yield this.shift()}toArray(){const e=new Array(this._size);for(let t=0;t<this._size;t++)e[t]=this._buffer[this._head+t&this._mask];return e}_grow(){const e=this._buffer,t=this._capacity<<1,n=new Array(t);for(let r=0;r<this._size;r++)n[r]=e[this._head+r&this._mask];this._buffer=n,this._capacity=t,this._mask=t-1,this._head=0,this._tail=this._size&this._mask}pushMany(e){if(!Array.isArray(e)||e.length===0)return this._size;const t=this._size+e.length;for(;this._capacity<t;)this._grow();const n=Math.min(e.length,this._capacity-this._tail);for(let i=0;i<n;i++)this._buffer[this._tail+i]=e[i];this._tail=this._tail+n&this._mask;let r=n;for(;r<e.length;){const i=Math.min(e.length-r,this._capacity-this._tail);for(let a=0;a<i;a++)this._buffer[this._tail+a]=e[r+a];this._tail=this._tail+i&this._mask,r+=i}this._size=t;for(let i=0;i<e.length;i++)this._totalWeight+=nr(e[i]);return this._size}get length(){return this._size}get totalWeight(){return this._totalWeight}removeAt(e){if(e<0||e>=this._size)return;const t=this._buffer,n=this._mask,r=this._head,i=t[r+e&n];for(let o=e;o<this._size-1;o++)t[r+o&n]=t[r+o+1&n];const a=r+this._size-1&n;return t[a]=void 0,this._tail=a,this._size--,this._totalWeight-=nr(i),i}shiftHighestPriority(e){if(this._size===0)return;let t=0,n=e(this._buffer[this._head&this._mask]);for(let r=1;r<this._size;r++){const i=e(this._buffer[this._head+r&this._mask]);i>n&&(n=i,t=r)}return this.removeAt(t)}unshiftMany(e){if(!Array.isArray(e)||e.length===0)return this._size;const t=this._size+e.length;for(;this._capacity<t;)this._grow();const n=this._head-e.length&this._mask;for(let r=0;r<e.length;r++)this._buffer[n+r&this._mask]=e[r];this._head=n,this._size=t;for(let r=0;r<e.length;r++)this._totalWeight+=nr(e[r]);return this._size}},Lh=Symbol("PowerSubscriberSet.original");function rr(e){return"deref"in e&&typeof e.deref=="function"}var ln=class{constructor(e={}){xt(e,["weak","maxListeners"],"PowerSubscriberSet");const{weak:t=!1,maxListeners:n=0}=e||{};this._weak=!!t,this._maxListeners=Fe(n,{name:"maxListeners",className:"PowerSubscriberSet",integer:!0,min:0,fallback:0}),this._listeners=new Set,this._onceMap=new WeakMap,this._finalization=this._ensureFinalization()}get size(){return this._cleanup(),this._listeners.size}add(e){if(typeof e!="function"){if(!this._weak||!e||typeof e.deref!="function")throw new TypeError("listener must be a function");if(this._maxListeners>0&&this.size+1>this._maxListeners)throw new Error(`PowerSubscriberSet: adding listener exceeds maxListeners (${this._maxListeners})`);return this._listeners.add(e),()=>this.delete(e)}if(this._maxListeners>0&&this.size+1>this._maxListeners)throw new Error(`PowerSubscriberSet: adding listener exceeds maxListeners (${this._maxListeners})`);const t=this._makeEntry(e);return this._listeners.add(t),()=>this.delete(e)}addOnce(e){if(typeof e!="function")throw new TypeError("listener must be a function");const t=((...r)=>(this.delete(e),e(...r)));try{t[Lh]=e}catch{}if(this._maxListeners>0&&this.size+1>this._maxListeners)throw new Error(`PowerSubscriberSet: adding listener exceeds maxListeners (${this._maxListeners})`);this._onceMap.set(e,t);const n=this._makeEntry(t);return this._listeners.add(n),()=>this.delete(e)}delete(e){let t=e;if(!rr(e)){const n=this._onceMap.get(e);n&&(t=n,this._onceMap.delete(e))}if(!this._weak)return this._listeners.delete(t);for(const n of this._listeners){if(n===t)return this._listeners.delete(n),this._finalization&&rr(n)&&this._finalization.unregister(n),!0;const r=this._deref(n);if(!r){this._listeners.delete(n);continue}if(r===t)return this._listeners.delete(n),this._finalization&&rr(n)&&this._finalization.unregister(n),!0}return!1}forEach(e){for(const t of this._listeners){const n=this._deref(t);if(!n){this._listeners.delete(t);continue}e(n)}}reset(){this.clear()}clear(){if(this._finalization){for(const e of this._listeners)rr(e)&&this._finalization.unregister(e);this._finalization=null}this._listeners.clear(),this._onceMap=new WeakMap}values(){this._cleanup();const e=[];for(const t of this._listeners){const n=this._deref(t);n&&e.push(n)}return e}*[Symbol.iterator](){for(const e of this._listeners){const t=this._deref(e);if(!t){this._listeners.delete(e);continue}yield t}}_cleanup(){if(!(!this._weak||typeof WeakRef>"u"))for(const e of this._listeners)rr(e)&&!e.deref()&&this._listeners.delete(e)}_makeEntry(e){if(this._weak&&typeof WeakRef<"u"){const t=new WeakRef(e),n=this._ensureFinalization();if(n)try{n.register(e,{ref:t},t)}catch{}return t}return e}_ensureFinalization(){return this._finalization?this._finalization:!this._weak||typeof WeakRef>"u"||typeof FinalizationRegistry>"u"?null:(this._finalization=new FinalizationRegistry(e=>{this._listeners.delete(e.ref)}),this._finalization)}_deref(e){return rr(e)?e.deref():e}dispose(){this.clear(),li(this,"clear")}[Symbol.dispose](){this.dispose()}};function $a(e){if(e){if(typeof e.cleanup=="function"){try{e.cleanup()}catch{}return}if(typeof e._cleanup=="function"){try{e._cleanup()}catch{}return}if(typeof e[Symbol.iterator]=="function"&&typeof e.delete=="function")for(const t of e)(typeof t?.deref=="function"?t.deref():t)||e.delete(t)}}function Ni(e,t){let n;try{n=e(t)}catch{return}return n!=null&&typeof n.then=="function"&&n.then(void 0,()=>{}),n}var Ph=class{constructor(e={}){xt(e,["maxListeners","weak"],"PowerEventBus"),this._listeners=new Map,this._maxListeners=Fe(e.maxListeners,{name:"maxListeners",className:"PowerEventBus",min:0,fallback:0}),this._weak=!!e.weak,this._fr=null,this._finalizationRefs=new WeakMap,this._eventFinalizationRefs=new Map,this._wildcards=new Map}_isWildcard(e){return e.includes("*")}_wildcardRegex(e){const t=e.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*/g,"[^:]*");return new RegExp(`^${t}$`)}_ensureFinalizationRegistry(){return!this._weak||typeof FinalizationRegistry>"u"?null:this._fr?this._fr:(this._fr=new FinalizationRegistry(e=>{try{const{event:t,ref:n}=e,r=this._listeners.get(t),i=this._eventFinalizationRefs.get(t);if(i&&n&&(i.delete(n),i.size===0&&this._eventFinalizationRefs.delete(t)),!r)return;$a(r),r.size===0&&(this._listeners.delete(t),this._eventFinalizationRefs.delete(t))}catch{}}),this._fr)}cleanup(){if(this._weak){for(const[e,t]of this._listeners)$a(t),t.size===0&&(this._clearWeakListenerEvent(e),this._listeners.delete(e));for(const[e,t]of this._wildcards)$a(t),t.size===0&&(this._clearWeakListenerEvent(e),this._wildcards.delete(e))}}on(e,t){if(typeof t!="function")throw new TypeError("listener must be a function");const n=this._isWildcard(e)?this._wildcards:this._listeners;let r=this._getBucket(e,n);r||(r=new ln({maxListeners:this._maxListeners,weak:this._weak}),n.set(e,r));const i=r.add(t);return this._registerWeakListener(t,e)?()=>{i(),this._unregisterWeakListener(t,e)}:i}_getBucket(e,t=this._listeners){const n=t.get(e);if(!n)return null;if(n instanceof ln)return n;const r=new ln({maxListeners:this._maxListeners,weak:this._weak});for(const i of n){const a="deref"in i?i.deref():i;a&&r.add(a)}return t.set(e,r),r}_registerWeakListener(e,t){const n=this._ensureFinalizationRegistry();if(!n||typeof WeakRef>"u")return null;const r=new WeakRef(e);try{const i={event:t,ref:r};n.register(e,i,r);let a=this._finalizationRefs.get(e);a||(a=new Map,this._finalizationRefs.set(e,a));let o=a.get(t);o||(o=new Set,a.set(t,o)),o.add(r);let s=this._eventFinalizationRefs.get(t);s||(s=new Set,this._eventFinalizationRefs.set(t,s)),s.add(r)}catch{return null}return r}_unregisterWeakListener(e,t){if(!this._fr||!this._finalizationRefs.has(e))return;const n=this._finalizationRefs.get(e);if(!n||n.size===0){this._finalizationRefs.delete(e);return}const r=t!==void 0?[t]:Array.from(n.keys());for(const i of r){const a=n.get(i);if(!a||a.size===0){n.delete(i);continue}for(const o of a){try{this._fr.unregister(o)}catch{}const s=this._eventFinalizationRefs.get(i);s&&(s.delete(o),s.size===0&&this._eventFinalizationRefs.delete(i))}n.delete(i)}n.size===0&&this._finalizationRefs.delete(e)}_clearWeakListenerEvent(e){if(!this._fr)return;const t=this._eventFinalizationRefs.get(e);if(t){for(const n of t)try{this._fr.unregister(n)}catch{}this._eventFinalizationRefs.delete(e)}}once(e,t){if(typeof t!="function")throw new TypeError("listener must be a function");const n=this._isWildcard(e)?this._wildcards:this._listeners;let r=this._getBucket(e,n);r||(r=new ln({maxListeners:this._maxListeners,weak:this._weak}),n.set(e,r));const i=r.addOnce(t);return this._registerWeakListener(t,e)?()=>{i(),this._unregisterWeakListener(t,e)}:i}off(e,t){const n=this._isWildcard(e)?this._wildcards:this._listeners,r=this._getBucket(e,n);r&&(r.delete(t),this._unregisterWeakListener(t,e),r.size===0&&(this._clearWeakListenerEvent(e),n.delete(e)))}emit(e,t){let n=!1;const r=this._listeners.get(e);if(r&&r.size>0)if(r instanceof ln){for(const i of r.values())n=!0,Ni(i,t);r.size===0&&(this._clearWeakListenerEvent(e),this._listeners.delete(e))}else{const i=r.size>0;for(const a of[...r]){const o="deref"in a?a.deref():a;if(!o){r.delete(a);continue}n=!0,Ni(o,t)}r.size===0&&(this._clearWeakListenerEvent(e),this._listeners.delete(e)),i&&(n=!0)}for(const[i,a]of this._wildcards)if(this._wildcardRegex(i).test(e)&&a.size!==0)if(a instanceof ln){for(const o of a.values())n=!0,Ni(o,t);a.size===0&&(this._clearWeakListenerEvent(i),this._wildcards.delete(i))}else{for(const o of[...a]){const s="deref"in o?o.deref():o;if(!s){a.delete(o);continue}n=!0,Ni(s,t)}a.size===0&&(this._clearWeakListenerEvent(i),this._wildcards.delete(i))}return n}*_iterBucketListeners(e){if(e instanceof ln){yield*e;return}for(const t of e){const n="deref"in t?t.deref():t;if(!n){e.delete(t);continue}yield n}}async emitAsync(e,t,{concurrency:n=1/0}={}){const r=this._listeners.get(e);if((!r||r.size===0)&&this._wildcards.size===0)return!1;const i=Number.isFinite(+n)&&+n>0?Math.max(1,Math.floor(+n)):1/0,a=async c=>{try{await c(t)}catch{}},o=new Set;let s=!1;const l=async(c,u)=>{for(const f of this._iterBucketListeners(c)){if(!f)continue;s=!0;const d=Promise.resolve().then(()=>a(f)).finally(()=>{o.delete(d)});o.add(d),Number.isFinite(i)&&o.size>=i&&await Promise.race(o)}c.size===0&&(this._clearWeakListenerEvent(u),this._listeners.delete(u))};r&&r.size>0&&await l(r,e);for(const[c,u]of this._wildcards)this._wildcardRegex(c).test(e)&&u.size!==0&&await l(u,c);return o.size&&await Promise.all(o),s}listeners(e){const t=[],n=this._listeners.get(e);if(n)if(n instanceof ln)t.push(...n.values());else for(const r of n){const i="deref"in r?r.deref():r;i&&t.push(i)}for(const[r,i]of this._wildcards)if(this._wildcardRegex(r).test(e))if(i instanceof ln)t.push(...i.values());else for(const a of i){const o="deref"in a?a.deref():a;o&&t.push(o)}return t}clear(e){if(e===void 0){for(const t of this._eventFinalizationRefs.keys())this._clearWeakListenerEvent(t);this._eventFinalizationRefs.clear(),this._finalizationRefs=new WeakMap,this._listeners.clear(),this._wildcards.clear();return}this._clearWeakListenerEvent(e),this._listeners.delete(e);for(const[t]of this._wildcards)this._wildcardRegex(t).test(e)&&(this._clearWeakListenerEvent(t),this._wildcards.delete(t))}reset(e){this.clear(e)}dispose(){this.clear(),li(this,"clear")}[Symbol.dispose](){this.dispose()}},Nh=class{constructor(e={}){if(xt(e,["setpoint","kp","ki","kd","derivativeFilter","min","max","feedforward","feedforwardGain","dt"],"PowerServo"),this._setpoint=0,this.setpoint=yn(e.setpoint,0),this._kp=yn(e.kp,0),this._ki=yn(e.ki,0),this._kd=yn(e.kd,0),this._derivativeFilter=Ih(yn(e.derivativeFilter,0),0,.999),this._min=No(e.min,-1/0,Number.NEGATIVE_INFINITY,1/0),this._max=No(e.max,1/0,Number.NEGATIVE_INFINITY,1/0),this.max<this.min)throw new RangeError(`PowerServo: max (${this.max}) must be >= min (${this.min})`);const t=e.feedforward;if(t!=null&&typeof t!="function"&&typeof t!="number")throw new TypeError(`PowerServo: feedforward must be a function or a number, got ${typeof t}`);this._feedforward=t??null,this._feedforwardGain=yn(e.feedforwardGain,0),this._defaultDt=Math.max(0,yn(e.dt,1)),this._integral=0,this._previousMeasured=null,this._derivative=0,this._output=0,this._error=0,this._saturated=!1}get setpoint(){return this._setpoint}set setpoint(e){if(typeof e!="number"||!Number.isFinite(e))throw new TypeError(`PowerServo: setpoint must be a finite number, got ${e}`);this._setpoint=e}get min(){return this._min}set min(e){const t=Po(e,"min");if(t>this._max)throw new RangeError(`PowerServo: min (${t}) must be <= max (${this._max})`);this._min=t}get max(){return this._max}set max(e){const t=Po(e,"max");if(t<this._min)throw new RangeError(`PowerServo: max (${t}) must be >= min (${this._min})`);this._max=t}step(e,t,n=0){if(!Number.isFinite(e))throw new TypeError(`PowerServo: measured must be a finite number, got ${e}`);const r=t===void 0?this._defaultDt:Math.max(0,yn(t,0)),i=this.setpoint-e;let a=0;this._kd!==0&&(this._previousMeasured!==null&&r>0&&(a=(this._previousMeasured-e)/r),this._derivative=this._derivativeFilter===0?a:this._derivative+this._derivativeFilter*(a-this._derivative)),this._previousMeasured=e;const o=this._kp*i+this._ki*this._integral+this._kd*this._derivative;let s=0;if(typeof this._feedforward=="function"){const c=this._feedforward({measured:e,setpoint:this.setpoint,disturbance:n,output:this._output});if(typeof c!="number"||!Number.isFinite(c))throw new TypeError(`PowerServo: feedforward returned ${c}, expected a finite number`);s=c}else this._feedforwardGain!==0&&(s=this._feedforwardGain*n);const l=Oh(s+o,this.min,this.max);if(this._ki!==0){this._integral+=i*r;const c=this._ki*this._integral,u=this.min-s-this._kp*i,f=this.max-s-this._kp*i;c<u?this._integral=Lo(u,this._ki):c>f&&(this._integral=Lo(f,this._ki))}return this._output=l,this._error=i,this._saturated=l===this.min||l===this.max,l}get output(){return this._output}get error(){return this._error}get integral(){return this._integral}get derivative(){return this._derivative}get saturated(){return this._saturated}reset(){this._integral=0,this._previousMeasured=null,this._derivative=0,this._output=0,this._error=0,this._saturated=!1}dispose(){this.reset()}[Symbol.dispose](){this.dispose()}};function Lo(e,t){const n=e/t;return Number.isFinite(n)?n:0}function Po(e,t){if(typeof e!="number"||Number.isNaN(e))throw new TypeError(`PowerServo: ${t} must be a number, got ${e}`);return e}function yn(e,t){return typeof e=="number"&&Number.isFinite(e)?e:t}function Ih(e,t,n){return Math.max(t,Math.min(n,e))}function No(e,t,n,r){if(e==null)return t;const i=typeof e=="number"?e:Number(e);return Number.isNaN(i)?t:i===1/0||i===-1/0?i:Math.max(n,Math.min(r,i))}function Oh(e,t,n){return e<t?t:e>n?n:e}var Ln=Object.freeze({JSON:0,RAW:2});var Ns=new Set(["framed","legacy","negotiated"]);for(const e of["add","delete","clear"])Object.defineProperty(Ns,e,{value:()=>{throw new TypeError(`MESSAGE_CODECS is read-only: \`${e}()\` would let a consumer widen the set of codecs a pool accepts, and PowerPool validates against it.`)},enumerable:!1,writable:!1,configurable:!1});var zh=new Map([[Ln.JSON,"json"],[Ln.RAW,"raw"]]),$h=new Map([["json",Ln.JSON],["raw",Ln.RAW]]);function Is(){return typeof structuredClone=="function"}function ui(e){return gr(e)||typeof ArrayBuffer<"u"&&ArrayBuffer.isView(e)}function jl(e){return ui(e)?"raw":"json"}function ql(e,t={}){const n=t.codec||jl(e),r=$h.get(n);if(r===void 0)throw new TypeError(`PowerMessageCodec: unknown codec "${n}". Expected "json" or "raw". For structured-clone speed on a MessagePort/Worker use encodeNativeEnvelope() instead.`);let i;if(r===Ln.RAW){if(!ui(e))throw new TypeError('PowerMessageCodec: the "raw" codec requires an ArrayBuffer or a typed array');i=gr(e)?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)}else i=cr(e);return ns(r,i)}function ns(e,t){const n=new Uint8Array(6+t.length);return n[0]=1,n[1]=e,n[2]=t.length&255,n[3]=t.length>>>8&255,n[4]=t.length>>>16&255,n[5]=t.length>>>24&255,n.set(t,6),n}function Hl(e){if(typeof e=="string")return ns(Ln.JSON,cr(null,e));if(!ui(e))throw new TypeError("PowerMessageCodec: frameEncodedJson() requires a Uint8Array or a JSON string");return ns(Ln.JSON,ga(e))}function rs(e,t=0){return(e[t+2]|e[t+3]<<8|e[t+4]<<16|e[t+5]<<24)>>>0}function pa(e,t={}){const n=t.strict!==!1,r=ga(e);if(r.length<6)throw new RangeError(`PowerMessageCodec: frame is ${r.length} bytes, shorter than the 6-byte header`);const i=r[0];if(n&&i!==1)throw new RangeError(`PowerMessageCodec: unsupported protocol version ${i} (expected 1)`);const a=zh.get(r[1]);if(a===void 0)throw new RangeError(`PowerMessageCodec: unknown codec id ${r[1]}`);const o=rs(r);if(r.length<6+o)throw new RangeError(`PowerMessageCodec: frame declares a ${o}-byte payload but only ${r.length-6} bytes are present (truncated frame)`);const s=6,l=s+o;return{version:i,codec:a,value:a==="raw"?t.rawAsBytes===!0?r.subarray(s,l):r.slice(s,l):Ps(r.subarray(s,l)),byteLength:l}}function Dh(e){if(e?.maxFrameBytes===void 0)throw new TypeError("PowerMessageCodec: createFrameDecoder() requires `maxFrameBytes`. A frame declares its own payload length, so a peer that sends a header and then stops would pin this buffer at whatever size it named. Pass `Infinity` to accept that risk explicitly.");const t=Fe(e.maxFrameBytes,{name:"maxFrameBytes",className:"PowerMessageCodec.createFrameDecoder",min:6,integer:!0,allowInfinity:!0}),n=e.strict!==!1,r=e.rawAsBytes===!0,i=1024;let a=new Uint8Array(i),o=0,s=0;function l(c){if(s+c<=a.length)return;const u=s-o;if(u+c<=a.length)a.copyWithin(0,o,s);else{let f=a.length||i;for(;f<u+c;)f*=2;const d=new Uint8Array(f);d.set(a.subarray(o,s)),a=d}o=0,s=u}return{push(c){const u=ga(c);l(u.length),a.set(u,s),s+=u.length;const f=[];for(;s-o>=6;){const d=rs(a,o);if(6+d>t)throw new RangeError(`PowerMessageCodec: frame declares ${6+d} bytes, over the maxFrameBytes limit of ${t}`);if(s-o<6+d)break;const p=pa(a.subarray(o,s),{strict:n,rawAsBytes:r});f.push(p),o+=p.byteLength}return o===s&&(o=0,s=0),f},flush(c={}){const u=s-o;if(u>0&&c.strict===!0){const f=u<6?null:rs(a,o),d=f===null?6:6+f;throw new RangeError(`PowerMessageCodec: stream ended mid-frame — ${u} of ${d} bytes buffered`+(f===null?", not even a whole header":""))}return a.slice(o,s)},get pendingBytes(){return s-o},reset(){o=0,s=0},dispose(){this.reset(),a=new Uint8Array(0)},[Symbol.dispose](){this.dispose()}}}function Gl(e){if(!Is())throw new TypeError("PowerMessageCodec: structuredClone is unavailable in this runtime. Use encodeMessage() for a portable JSON frame instead.");const t=structuredClone(e);return{message:t,transfer:zs(t)}}function Bh(e){if(typeof SharedArrayBuffer<"u"&&e.buffer instanceof SharedArrayBuffer)return[];if(e.byteOffset!==0||e.byteLength!==e.buffer.byteLength)throw new RangeError(`PowerMessageCodec: refusing to build a transfer list for a ${e.byteLength}-byte view at offset ${e.byteOffset} of a ${e.buffer.byteLength}-byte buffer — transferring \`frame.buffer\` would detach the whole buffer, including bytes outside this frame. Copy the view, or transfer the buffer it fills.`);return[e.buffer]}var Os="__pp";function ma(e){return e!==null&&typeof e=="object"&&e.__pp===1&&e.kind==="envelope"&&"value"in e}function Vl(e){return e!==null&&typeof e=="object"&&e.__pp===1&&e.kind==="capabilities"&&Array.isArray(e.codecs)}function Zl(e,t={}){const n={[Os]:1,kind:"envelope",value:e};return t.correlationId!=null&&(n.correlationId=String(t.correlationId)),n}function Uh(e={}){const t=Array.isArray(e.codecs)&&e.codecs.length?e.codecs.filter(n=>n==="json"||n==="native"):["json","native"];return{[Os]:1,kind:"capabilities",codecs:t.includes("json")?t:["json",...t],protocol:1}}function zs(e,t=8){const n=[],r=new Set,i=(a,o)=>{if(!(!a||o>t)){if(a instanceof ArrayBuffer){r.has(a)||(r.add(a),n.push(a));return}if(ArrayBuffer.isView(a)){r.has(a.buffer)||(r.add(a.buffer),n.push(a.buffer));return}if(typeof a=="object")for(const s of Object.keys(a))i(a[s],o+1)}};return i(e,0),n}function Fh(e){if(ma(e))return{codec:"native",value:e.value,correlationId:e.correlationId};if(gr(e)||ArrayBuffer.isView(e)){const t=ga(e);if(t.length>=6&&t[0]===1){const n=pa(t);return{codec:n.codec,value:n.value,correlationId:void 0}}if(!Wh(t[0]))throw t[0]===1?new RangeError(`PowerMessageCodec: truncated frame — ${t.length} byte(s) is shorter than the 6-byte header`):new RangeError(`PowerMessageCodec: unsupported protocol version ${t[0]} (expected 1)`);return{codec:"legacy",value:Ps(t),correlationId:void 0}}return{codec:"raw",value:e,correlationId:void 0}}function Wh(e){return e===32||e===9||e===10||e===13?!0:e>=32}function ga(e){if(e instanceof Uint8Array)return e;if(gr(e))return new Uint8Array(e);if(typeof ArrayBuffer<"u"&&ArrayBuffer.isView(e))return new Uint8Array(e.buffer,e.byteOffset,e.byteLength);throw new TypeError("PowerMessageCodec: expected a Uint8Array, ArrayBuffer or DataView")}var pm=Object.freeze({MESSAGE_PROTOCOL_VERSION:1,CODECS:Ln,MESSAGE_CODECS:Ns,HEADER_BYTES:6,encodeMessage:ql,decodeMessage:pa,createFrameDecoder:Dh,frameEncodedJson:Hl,encodeNative:Gl,canUseNativeClone:Is,selectCodec:jl,isRawPayload:ui,frameTransferList:Bh,NATIVE_ENVELOPE_KEY:Os,NATIVE_PROTOCOL_VERSION:1,isNativeEnvelope:ma,isCapabilityAnnouncement:Vl,encodeNativeEnvelope:Zl,announceCapabilities:Uh,collectTransferables:zs,decodeInbound:Fh}),Ii=null,Io=!1;function jh(e){if(!e||typeof e!="object"||typeof SharedArrayBuffer=="function"&&e instanceof SharedArrayBuffer)return!1;if(!Io){Io=!0;try{const t=globalThis.process?.getBuiltinModule?.("node:worker_threads")?.markAsUntransferable??null;Ii=typeof t=="function"?t:null}catch{Ii=null}}if(!Ii)return!1;try{return Ii(e),!0}catch{return!1}}var qh=Math.floor(Math.random()*4294967295).toString(36),Hh=0;function Da(e,t){const n=new Error(t);return n.code=e,n}function Gh(e){if(!Array.isArray(e))return!0;for(let t=0;t<e.length;t++){const n=e[t];if(n instanceof ArrayBuffer){if(Oo(n))return!1}else if(ArrayBuffer.isView(n)){if(Oo(n.buffer))return!1}else if(n===null||typeof n!="object")return!1}return!0}function Oo(e){return e?.detached===!0}var zo=class{constructor(e,t,n){this._underlying=e,this._logger=t,this._pool=n,this.onmessage=null,this.onerror=null,this.onmessageerror=null}postMessage(e,t){let n=e,r=t;if(n instanceof Uint8Array||ArrayBuffer.isView(n)||n instanceof ArrayBuffer){if(Array.isArray(r))try{r.length?this._underlying.postMessage(n,r):this._underlying.postMessage(n);return}catch(i){throw this._logger.error(i,"Failed to postMessage to underlying worker"),i}if(!r){const i=n instanceof ArrayBuffer?n:n.buffer;i?.byteLength>0&&(r=[i])}try{r?.length?this._underlying.postMessage(n,r):this._underlying.postMessage(n)}catch(i){throw this._logger.error(i,"Failed to postMessage to underlying worker"),i}return}if(n!==null&&typeof n=="object"&&!ArrayBuffer.isView(n)&&!(n instanceof ArrayBuffer)&&!ma(n))try{const i=this._pool._encodeForTransfer(e).slice();if(!r)r=[i.buffer];else if(Array.isArray(r))r.includes(i.buffer)||r.push(i.buffer);else{const a=Array.from(r);a.includes(i.buffer)||a.push(i.buffer),r=a}n=i}catch{r=t,n=e}try{r?.length?this._underlying.postMessage(n,r):this._underlying.postMessage(n)}catch(i){throw this._logger.error(i,"Failed to postMessage to underlying worker"),i}}addEventListener(...e){return this._underlying.addEventListener(...e)}removeEventListener(...e){return this._underlying.removeEventListener(...e)}terminate(){typeof this._underlying.terminate=="function"&&this._underlying.terminate()}},Vh=class extends Error{constructor(e="PowerPool has been shut down"){super(e),this.name="PowerPoolShutdownError",this.code="ERR_POOL_TERMINATED"}},$s=class{constructor(e,t={}){xt(t,["size","minSize","maxSize","workerOptions","maxTasksPerWorker","idleTimeout","taskQueue","queuePolicy","lazy","debugLevel","listenerMaxListeners","weakListeners","queueHighThreshold","maxQueueLength","observability","maxDrainWaiters","autoScale","awaitResponseTimeout","slowTaskThreshold","maxListeners","messageCodec","encodeCacheLimit","encodeCacheByteLimit","idempotencyTtlMs","priority","priorityAgingMs"],"PowerPool"),t===null&&(t={});const n=typeof navigator<"u"&&navigator.hardwareConcurrency||2,{size:r=Math.min(n,2),minSize:i=2,maxSize:a=Math.max(r,n),workerOptions:o={},maxTasksPerWorker:s,idleTimeout:l=co,taskQueue:c=!0,queuePolicy:u="enqueue",lazy:f=!0,awaitResponseTimeout:d=Ka,slowTaskThreshold:p=1/0,autoScale:m=!1,priorityAgingMs:g=0}=t;if(!Number.isFinite(g)||g<0)throw new RangeError("PowerPool: `priorityAgingMs` must be finite and >= 0");this._priorityAgingMs=g;const y=s===void 0&&m?1:s??1/0;if(typeof e!="function"&&typeof e!="string")throw new TypeError("PowerPool workerSource must be a function or string");this._workerSource=e,this._workerOptions=o,this._maxTasksPerWorker=y,this.minSize=Fe(i,{name:"minSize",className:"PowerPool",integer:!0,min:0,fallback:2}),this.maxSize=Math.max(this.minSize,Fe(a,{name:"maxSize",className:"PowerPool",integer:!0,min:0,fallback:this.minSize})),this.idleTimeout=Fe(l,{name:"idleTimeout",className:"PowerPool",min:0,allowInfinity:!0,fallback:co}),this.taskQueueEnabled=!!c,this._queuePolicy=["enqueue","drop-oldest","drop-newest","reject"].includes(u)?u:"enqueue",this._maxQueueLength=Fe(t.maxQueueLength,{name:"maxQueueLength",className:"PowerPool",integer:!0,min:0,allowInfinity:!0,fallback:1/0}),this._maxDrainWaiters=Fe(t.maxDrainWaiters,{name:"maxDrainWaiters",className:"PowerPool",integer:!0,min:1,fallback:100}),this._drainWaiters=0,this._createdAt=tt(),this._totalWorkersCreated=0,this._totalTasksCompleted=0,this._postFailures=0,this._taskDurationsWelfordCount=0,this._taskDurationsWelfordMean=0,this._taskDurationsWelfordM2=0,this._taskDurationsMin=Number.POSITIVE_INFINITY,this._taskDurationsMax=Number.NEGATIVE_INFINITY,this._queueWaitWelfordCount=0,this._queueWaitWelfordMean=0,this._queueWaitWelfordM2=0,this._queueWaitMin=Number.POSITIVE_INFINITY,this._queueWaitMax=Number.NEGATIVE_INFINITY,this._slowTaskThreshold=Number.isFinite(p)?Number(p):1/0,this._slowTaskCount=0,this._ewmaLatency=null,this._autoScale=null,this._autoScaleInterval=null,this._lastAutoScaleAt=0,this._lastAutoScaleReason=null,this._lastAutoScaleOutcome=null,this._terminatedWorkerTaskCountsTotal=0,this._terminatedWorkerTaskCountsCount=0,this.workers=[],this.queue=new Wi;const h={maxListeners:t?.listenerMaxListeners??t?.maxListeners,weak:!!t?.weakListeners};this._bus=new Ph(h),this._queueHighThreshold=Number.isFinite(Number(t?.queueHighThreshold))?Math.max(0,Math.floor(Number(t?.queueHighThreshold))):1/0,this._queueHighCrossed=!1,this._onmessage=null,this._onerror=null,this._onidle=null,this._onresize=null,this._nextIndex=0,this._nextWorkerId=0,this._activeTasks=0,this._isIdle=!0,this._queuePaused=!1,this._messageCodec=Ns.has(t.messageCodec)?t.messageCodec:"framed",this._nativeCloneAvailable=Is(),this._terminated=!1;const _=typeof t?.debugLevel=="number"?t.debugLevel:1;if(this._logger=new Ml(_,{name:"powerPool"}),arguments.length>1&&arguments[1]!=null&&typeof arguments[1]!="object")throw new TypeError("PowerPool options must be an object");this._pendingResponses=new Map,this._underlyingToWorkerObj=new Map,this._defaultAwaitResponseTimeout=Number.isFinite(Number(d))?Math.max(0,Math.floor(Number(d))):Ka;const w=f?Math.min(this.minSize,this.maxSize):Math.min(Math.max(r,this.minSize),this.maxSize);for(let x=0;x<w;x++)try{this._addWorkerInstance()}catch(z){if((typeof z?.message=="string"?z.message:"").includes("Invalid workerSource"))throw z;try{this._logger.error(z,"Initial worker creation failed")}catch(D){this._debugLog?.(D,"Initial worker creation: logger error")}try{this._bus.emit("pool:error",{phase:"init",error:z})}catch(D){this._debugLog?.(D,"Initial worker creation: bus.emit failed")}break}this._reaperInterval=Ma(()=>this._reapIdleWorkers(),Math.max(lo,Math.floor(this.idleTimeout/2))),this._encodeCache=new Map,this._encodeCacheLimit=Math.max(16,t?.encodeCacheLimit?t.encodeCacheLimit:64),this._encodeCacheByteLimit=Number.isFinite(Number(t?.encodeCacheByteLimit))?Math.max(0,Number(t?.encodeCacheByteLimit)):1/0,this._encodeCacheBytes=0;const b=Number(t?.idempotencyTtlMs);if(this._idempotencyTtlMs=Number.isFinite(b)&&b>0?b:0,this._idempotency=this._idempotencyTtlMs>0?new Map:null,this._idempotencyLookups=0,this._idempotencyDuplicatesInFlight=0,this._idempotencyDuplicatesSettled=0,this._idempotencyExpired=0,this._idempotencySize=0,t?.autoScale){const x=typeof t.autoScale=="object"?t.autoScale:{},z=Number.isFinite(Number(x.intervalMs))?Math.max(100,Math.floor(x.intervalMs)):$u,D=Number.isFinite(Number(x.targetMs))?Math.max(1,Number(x.targetMs)):50,B=Number.isFinite(Number(x.alpha))?Math.max(0,Math.min(1,Number(x.alpha))):.2,j=Number.isFinite(Number(x.cooldownMs))?Math.max(0,Math.floor(x.cooldownMs)):Du,re=Number.isFinite(Number(x.hysteresis))?Math.max(0,Math.min(1,Number(x.hysteresis))):.2,ae=Number.isFinite(Number(x.stepUp))?Math.max(1,Math.floor(Number(x.stepUp))):1,J=Number.isFinite(Number(x.stepDown))?Math.max(1,Math.floor(Number(x.stepDown))):1,R=Number.isFinite(Number(x.backoffFactor))?Math.max(1,Number(x.backoffFactor)):1,N=Number.isFinite(Number(x.backoffMaxMultiplier))?Math.max(1,Number(x.backoffMaxMultiplier)):8,M=Number.isFinite(Number(x.backoffResetMs))?Math.max(0,Math.floor(Number(x.backoffResetMs))):j*4,A=["ewma","aimd","vegas","gradient2"].includes(x.policy)?x.policy:"ewma",O=Number.isFinite(Number(x.limitMin))?Math.max(1,Math.floor(Number(x.limitMin))):1,H=Number.isFinite(Number(x.limitMax))?Math.max(O,Math.floor(Number(x.limitMax))):Math.max(this.maxSize,O),L=Number.isFinite(Number(x.longWindowAlpha))?Math.max(.001,Math.min(1,Number(x.longWindowAlpha))):Bu,Q=Number.isFinite(Number(x.aimdBeta))?Math.max(.1,Math.min(.99,Number(x.aimdBeta))):Uu;this._autoScale={enabled:!0,intervalMs:z,targetMs:D,alpha:B,cooldownMs:j,hysteresis:re,stepUp:ae,stepDown:J,backoffFactor:R,backoffMaxMultiplier:N,backoffResetMs:M,policy:A,limitMin:O,limitMax:H,longWindowAlpha:L,aimdBeta:Q},this._autoScaleBackoffMultiplier=1,this._adaptiveLimit=Math.max(O,Math.min(H,this.minSize||O)),this._longEwmaLatency=null,this._minLatencyWindow=Number.POSITIVE_INFINITY,this._lastAdaptiveLimit=this._adaptiveLimit,this._congestion=!1;try{this._autoScaleInterval=Ma(()=>this._autoScaleTick(),z)}catch(ee){this._debugLog?.(ee,"autoScale: interval setup failed")}}this._metrics=Es(this,"pool",t)}_debugLog(e,t){try{typeof this._logger?.debug=="function"&&(e?this._logger.debug(e,t||"swallowed error"):this._logger.debug(t||"swallowed error"))}catch(n){try{typeof console<"u"&&typeof console.debug=="function"&&console.debug(n,t||"swallowed error")}catch{}}}_ensureReaper(){try{this._reaperInterval||(this._reaperInterval=Ma(()=>this._reapIdleWorkers(),Math.max(lo,Math.floor(this.idleTimeout/2))))}catch(e){this._debugLog?.(e,"_ensureReaper: setInterval failed")}}_createPendingResponsePromise(e,t){const n=e!=null?String(e):e;let r=null;return{pendingPromise:new Promise((i,a)=>{this._pendingResponses.get(n)&&(this._debugLog?.(null,"createPendingResponsePromise: duplicate correlationId, rejecting previous waiter"),this._cleanupPendingResponse(n,{rejectWith:(()=>{const s=new Error(`duplicate correlationId: ${n}`);return s.code="ERR_POOL_DUPLICATE_CORRELATION_ID",s})()})),r={resolve:i,reject:a,timer:null};const o=Number.isFinite(Number(t?.timeout))?Math.max(0,Math.floor(Number(t?.timeout))):Number.isFinite(Number(this._defaultAwaitResponseTimeout))?this._defaultAwaitResponseTimeout:void 0;Number.isFinite(o)&&o>0&&(r.timer=setTimeout(()=>{try{this._cleanupPendingResponse(n,{rejectWith:new Error("postMessage response timeout")})}catch{try{a(new Error("postMessage response timeout"))}catch(l){this._debugLog?.(l,"createPendingResponsePromise: reject fallback failed")}}},o)),this._pendingResponses.set(n,r)}),correlationKey:n}}_encodeForWorker(e,t){if(!t||t.deferred!==!0)return t;if(this._messageCodec==="negotiated"&&e?.protocol?.native){const n=this._encodeNativeForWorker(t);if(n)return n}return this._frameObjectForTransfer(t.message,t.transfer,{cache:t.correlationId==null})}_encodeNativeForWorker(e){if(!this._nativeCloneAvailable)return null;const t=e.message;let n=t,r;if(zs(t).length>0){const i=Gl(t);n=i.message,r=i.transfer}try{return{message:Zl(n),transfer:r}}catch(i){return this._debugLog?.(i,"_encodeNativeForWorker: not cloneable, framing instead"),null}}_applyCapabilities(e,t){const n=Array.isArray(t?.codecs)?t.codecs:[],r=["json"];this._nativeCloneAvailable&&n.includes("native")&&r.push("native");const i=r.includes("native"),a=e?.protocol?{...e.protocol}:null;if(!(a&&a.native===i&&a.announced)){e&&(e.protocol={codecs:r,native:i,announced:!0});try{this._bus.emit("pool:protocol",{workerId:e?.id,codecs:r,previous:a?.codecs??["json"]})}catch(o){this._debugLog?.(o,"_applyCapabilities: bus.emit failed")}}}_postToWorkerObj(e,t,n,r,i,a){t=this._encodeForWorker(e,t);const o=e?.worker instanceof zo?e.worker._underlying:null;if(t!=null&&t.message!=null&&typeof t.message=="object"&&!ArrayBuffer.isView(t.message)&&!(t.message instanceof ArrayBuffer)&&Array.isArray(t.transfer)&&t.transfer.length>0&&typeof o?.postMessage=="function"&&Gh(t.transfer))try{return o.postMessage(t.message,t.transfer),typeof e._startTimes?.push=="function"&&e._startTimes.push(n),this._markPendingWorker(i,e.id),e.tasks++,this._activeTasks++,e.lastActive=n,this._isIdle&&this._updateIdleState(),r?a:!0}catch(s){return this._failPost(s,r,i,a,{scope:"postToWorkerObj: direct postMessage failed"})}try{return this._dispatchToWorker(e,t,{correlationId:i,startTime:n}),this._isIdle&&this._updateIdleState(),r?a:!0}catch(s){return this._failPost(s,r,i,a,{scope:"postToWorkerObj: wrapper postMessage failed"})}}_dispatchToWorker(e,t,n={}){const{correlationId:r,startTime:i=tt()}=n,a=t.deferred?{...this._frameObjectForTransfer(t.message,t.transfer,{cache:t.correlationId==null})}:t,{worker:o}=e;return a.transfer?.length?o.postMessage(a.message,a.transfer):o.postMessage(a.message),typeof e._startTimes?.push=="function"&&e._startTimes.push(i),this._markPendingWorker(r,e.id),e.tasks+=1,this._activeTasks+=1,e.lastActive=i,i}_recordQueueWait(e){if(!Number.isFinite(e))return;const t=this._queueWaitWelfordCount+1,n=e-this._queueWaitWelfordMean;this._queueWaitWelfordMean+=n/t,this._queueWaitWelfordM2+=n*(e-this._queueWaitWelfordMean),this._queueWaitWelfordCount=t,this._queueWaitMin=Math.min(this._queueWaitMin,e),this._queueWaitMax=Math.max(this._queueWaitMax,e)}_reportPostFailure(e,t){this._postFailures+=1;try{this._logger.error(e,`${t}: failed to post`)}catch(n){this._debugLog?.(n,`${t}: logger.error failed`)}try{this._bus.emit("pool:error",{phase:"postMessageBatch",error:e,scope:t})}catch(n){this._debugLog?.(n,`${t}: bus.emit failed`)}return!1}_failPost(e,t,n,r,i){if(t&&n){try{this._cleanupPendingResponse(n,{rejectWith:e})}catch(a){this._debugLog?.(a,`${i?.scope??"failPost"}: cleanupPendingResponse failed`)}try{this._logger.error(e,"Failed to postMessage to worker")}catch(a){this._debugLog?.(a,`${i?.scope??"failPost"}: logger.error failed`)}return r}try{this._logger.error(e,"Failed to postMessage to worker")}catch(a){this._debugLog?.(a,`${i?.scope??"failPost"}: logger.error failed`)}return!1}_tryGrowPool(e,t,n,r,i,a,o){let s;try{s=this._addWorkerInstance()}catch(c){try{this._logger.error(c,"Failed to grow pool")}catch(u){this._debugLog?.(u,"tryGrowPool: logger.error failed")}try{this._bus.emit("pool:error",{phase:"grow",error:c})}catch(u){this._debugLog?.(u,"tryGrowPool: bus.emit failed")}if(i&&a){try{this._cleanupPendingResponse(a,{rejectWith:c})}catch(u){this._debugLog?.(u,"tryGrowPool: cleanupPendingResponse failed")}return o}return!1}if(!s){if(i&&a){try{this._cleanupPendingResponse(a,{rejectWith:new Error("failed to add worker")})}catch(c){this._debugLog?.(c,"tryGrowPool: cleanupPendingResponse failed")}return o}return!1}const l=this._prepareForTransfer(e,t,n);return this._postToWorkerObj(s,l,r,i,a,o)}_resolveBatchCorrelationIds(e,t){const n=new Array(e.length),r=new Set;for(let i=0;i<e.length;i++){const a=String(t(i,e[i]||{}));if(r.has(a)||this._pendingResponses.has(a)){const o=new Error(`postMessageBatch correlationIdFactory produced a duplicate correlationId: "${a}" (item ${i})`);throw o.code="ERR_POOL_DUPLICATE_CORRELATION_ID",o}r.add(a),n[i]=a}return n}_reserveQueueSlots(e){const t=this._maxQueueLength;if(!Number.isFinite(t))return e;let n=t-this.queue.length;if(n>=e)return e;if(this._queuePolicy==="drop-oldest"){let r=e-n;for(;r>0&&this.queue.length>0;){r--;const i=this.queue.shift();i?.correlationId!=null&&this._cleanupPendingResponse(i.correlationId,{rejectWith:new Error("postMessage queued task dropped by policy")})}n=t-this.queue.length}return n>0?n:0}_enqueueOrReject(e,t,n,r,i){const a=this._queuePolicy;if(a==="reject")return t&&n?(this._cleanupPendingResponse(n,{rejectWith:new Error("postMessage rejected by queue policy")}),r):!1;if(a==="drop-newest"&&this.queue.length>0)return t&&n?(this._cleanupPendingResponse(n,{rejectWith:new Error("postMessage rejected by queue policy")}),r):!1;if(a==="drop-oldest"&&this.queue.length>0){const s=this.queue.shift();s?.correlationId!=null&&this._cleanupPendingResponse(s.correlationId,{rejectWith:new Error("postMessage queued task dropped by policy")})}else if(this._reserveQueueSlots(1)===0)return t&&n?(this._cleanupPendingResponse(n,{rejectWith:(()=>{const s=new Error(`postMessage rejected: task queue is full (maxQueueLength ${this._maxQueueLength})`);return s.code="ERR_POOL_QUEUE_FULL",s})()}),r):!1;const o={message:e.message,transfer:e.transfer,enqueuedAt:tt()};i?.deadlineAt!==void 0&&(o.deadlineAt=i.deadlineAt),e.deferred===!0&&(o.deferred=!0),t&&n&&(o.correlationId=n),i?.priority!=null&&(o.priority=i.priority),this.queue.push(o);try{Number.isFinite(this._queueHighThreshold)&&this.queue.length>this._queueHighThreshold&&!this._queueHighCrossed&&(this._queueHighCrossed=!0,this._bus.emit("pool:queue:high",{length:this.queue.length,threshold:this._queueHighThreshold}))}catch(s){this._debugLog?.(s,"enqueueOrReject: bus.emit failed")}return this._updateIdleState(),t?r:!0}_terminateWorker(e,t="unknown"){if(!e)return null;const n=e.id??null;e.tasks>0&&this._decrementActiveTasks(e.tasks),e.tasks=0,this._rejectPendingForWorker(n,t),e.tasksSettled=!0;try{e._agnostic?.dispose()}catch(r){this._debugLog?.(r,`_terminateWorker(${t}): worker dispose failed`)}try{e.worker?.terminate()}catch(r){this._debugLog?.(r,`_terminateWorker(${t}): worker.terminate failed`)}return this._deleteWorkerUnderlyingMapping(e),this._terminatedWorkerTaskCountsTotal+=e.completedTasks||0,this._terminatedWorkerTaskCountsCount+=1,n}_rejectPendingForWorker(e,t="unknown"){if(e==null||!this._pendingResponses?.size)return 0;const n=[];try{for(const[r,i]of this._pendingResponses)i?.workerId===e&&n.push(r)}catch(r){return this._debugLog?.(r,"_rejectPendingForWorker: scan failed"),0}for(const r of n)try{this._cleanupPendingResponse(r,{rejectWith:Da("ERR_POOL_WORKER_TERMINATED",`postMessage failed: worker ${e} was terminated (${t}) before responding`)})}catch(i){this._debugLog?.(i,"_rejectPendingForWorker: cleanup failed")}return n.length}_markPendingWorker(e,t){if(!(e==null||t==null))try{const n=this._pendingResponses.get(String(e));n&&(n.workerId=t)}catch(n){this._debugLog?.(n,"_markPendingWorker: failed")}}_assertNotTerminated(){if(!this._terminated)return;const e=new Error("PowerPool has been shut down");throw e.code="ERR_POOL_TERMINATED",e}_clearLifecycleIntervals(){try{this._reaperInterval&&(clearInterval(this._reaperInterval),this._reaperInterval=null)}catch(e){this._debugLog?.(e,"clearLifecycleIntervals: clearInterval(reaper) failed")}try{this._autoScaleInterval&&(clearInterval(this._autoScaleInterval),this._autoScaleInterval=null)}catch(e){this._debugLog?.(e,"clearLifecycleIntervals: clearInterval(autoScale) failed")}}shutdown(){if(this._terminated)return;this._terminated=!0,this._clearLifecycleIntervals();try{for(const[t]of this._pendingResponses)try{this._cleanupPendingResponse(t,{rejectWith:new Vh("pool:shutdown")})}catch(n){this._debugLog?.(n,"shutdown: cleanup pending response")}try{typeof this._pendingResponses?.clear=="function"&&this._pendingResponses.clear()}catch(t){this._debugLog?.(t,"shutdown: pendingResponses.clear failed")}}catch(t){this._debugLog?.(t,"shutdown: iterate pending responses")}const e=[];try{for(const t of this.workers){const n=this._terminateWorker(t,"shutdown");n!=null&&e.push(n)}}catch(t){this._debugLog?.(t,"shutdown: terminate workers loop")}try{this._underlyingToWorkerObj&&this._underlyingToWorkerObj.clear()}catch(t){this._debugLog?.(t,"shutdown: underlyingToWorkerObj.clear failed")}e.length&&this._bus.emit("pool:scale",{action:"remove",reason:"shutdown",terminated:e,count:e.length}),this.workers=[],this.queue=new Wi,this._queueHighCrossed=!1,this._activeTasks=0,this._updateIdleState()}_encodeForTransfer(e,{cache:t=!0}={}){try{if(!t)return cr(e);const n=JSON.stringify(e);if(typeof n=="string"&&n.length>2048)return cr(e);const r=this._encodeCache.get(n);if(r){try{this._encodeCache.delete(n),this._encodeCache.set(n,r)}catch{}return r}const i=cr(e,n),a=i?.byteLength||0,o=()=>this._encodeCache.size>=this._encodeCacheLimit||this._encodeCacheByteLimit!==1/0&&this._encodeCacheBytes+a>this._encodeCacheByteLimit;for(;o();){const s=[],l=this._encodeCache.keys(),c=10;for(;o()&&s.length<c;){const u=l.next();if(u.done)break;s.push(u.value)}if(!s.length)break;for(const u of s){try{const f=this._encodeCache.get(u),d=typeof f?.byteLength=="number"?f.byteLength:0;this._encodeCacheBytes=Math.max(0,this._encodeCacheBytes-d)}catch{}this._encodeCache.delete(u)}}return this._encodeCache.set(n,i),i?.byteLength&&(this._encodeCacheBytes+=i.byteLength),jh(i?.buffer),i}catch{return cr(e)}}prepareBuffers(e,t={}){if(!Array.isArray(e))throw new Error("prepareBuffers expects an array");const{clone:n=!1,zeroCopy:r=!1}=t,i=new Array(e.length);for(let a=0;a<e.length;a++){const o=e[a]&&typeof e[a]=="object"&&"message"in e[a]?e[a]:{message:e[a]},s=o.message,l=o.transfer;if(l){i[a]={message:s,transfer:l};continue}if(s!==null&&typeof s=="object"&&!ArrayBuffer.isView(s)&&!(s instanceof ArrayBuffer)){if(r){i[a]={message:s,transfer:void 0};continue}if(n||this._messageCodec==="legacy")try{const c=this._encodeForTransfer(s),u=n?c.slice():c;i[a]={message:u,transfer:n?[u.buffer]:void 0,deferred:this._messageCodec!=="legacy"},this._messageCodec!=="legacy"&&(i[a]={...this._frameObjectForTransfer(s,l),deferred:!1});continue}catch{i[a]={message:s,transfer:void 0};continue}i[a]={message:s,transfer:l,deferred:!0};continue}if(s instanceof ArrayBuffer||ArrayBuffer.isView(s)){const c=s instanceof ArrayBuffer?s:s.buffer;i[a]={message:s,transfer:[c]};continue}i[a]={message:s,transfer:void 0}}return i}_prepareForTransfer(e,t,n){const r=!!n?.zeroCopy;if(e instanceof Uint8Array||ArrayBuffer.isView(e)||e instanceof ArrayBuffer){const i=e instanceof ArrayBuffer?e:e.buffer;if(!t){if(this._messageCodec==="framed"&&ui(e))try{const s=ql(e,{codec:"raw"});return{message:s,transfer:[s.buffer]}}catch(s){this._debugLog?.(s,"_prepareForTransfer: framing binary failed")}if(i?.byteLength===0)try{const s=e instanceof ArrayBuffer?e.slice(0):new Uint8Array(e);return{message:s,transfer:[s.buffer]}}catch{return{message:e,transfer:void 0}}return{message:e,transfer:[i]}}if(Array.isArray(t))return{message:e,transfer:t};if(t.length===0)return{message:e,transfer:[i]};const a=[];let o=!1;for(const s of t)a.push(s),s===i&&(o=!0);return o||a.push(i),{message:e,transfer:a}}if(e!==null&&typeof e=="object"&&!ArrayBuffer.isView(e)&&!(e instanceof ArrayBuffer)){if(r)return{message:e,transfer:t};if(this._messageCodec==="negotiated")return{message:e,transfer:t,deferred:!0};const i=!!(n?.awaitResponse||n?.correlationId!=null);return this._frameObjectForTransfer(e,t,{cache:!i})}return{message:e,transfer:t}}_frameObjectForTransfer(e,t,n){try{const r=this._encodeForTransfer(e,{cache:n?.cache}),i=(this._messageCodec==="legacy"?r:Hl(r)).slice();let a=t;if(!a||Array.isArray(a)&&a.length===0)a=[i.buffer];else if(Array.isArray(a)){let o=!1;for(const s of a)if(s===i.buffer){o=!0;break}o||(a=[...a,i.buffer])}else if(a.length===0)a=[i.buffer];else{const o=[];let s=!1;for(const l of a)o.push(l),l===i.buffer&&(s=!0);s||o.push(i.buffer),a=o}return{message:i,transfer:a}}catch(r){return this._debugLog?.(r,"_prepareForTransfer: could not frame, posting raw"),this._messageCodec!=="legacy"&&this._logger?.warn?.(`PowerPool: message could not be framed and was posted unframed (messageCodec is "${this._messageCodec}"). A worker using decodeMessage() will reject it. Cause: `+(si(r)?r.message:String(r))),{message:e,transfer:t}}}_decrementActiveTasks(e=1){try{const t=Number.isFinite(Number(e))?Math.max(0,Math.floor(Number(e))):1;this._activeTasks=Math.max(0,this._activeTasks-t)}catch{this._activeTasks=0}}resize(e){let t=this.minSize,n=this.maxSize;if(e!=null&&typeof e=="object")Number.isFinite(e.minSize)&&(t=Math.max(0,Math.floor(e.minSize))),Number.isFinite(e.maxSize)&&(n=Math.max(t,Math.floor(e.maxSize)));else{const a=Number(e);if(!Number.isFinite(a))return;n=Math.max(t,Math.floor(a))}this.minSize=Math.max(0,t),this.maxSize=Math.max(this.minSize,n);let r=0;for(;this.workers.length<this.minSize&&this.workers.length<this.maxSize;)try{const a=this.workers.length;if(this._addWorkerInstance(),this.workers.length===a)break;r++}catch(a){try{this._logger.error(a,"resize: add worker failed")}catch(o){this._debugLog?.(o,"resize: logger.error failed")}try{this._bus.emit("pool:error",{phase:"resize",error:a})}catch(o){this._debugLog?.(o,"resize: bus.emit failed")}break}const i=[];for(;this.workers.length>this.maxSize;){const a=this.workers.pop(),o=this._terminateWorker(a,"resize");o!=null&&i.push(o)}if(i.length||r){const a={data:{type:"pool:resize",terminated:i,added:r}};if(this._onresize)try{this._onresize(a)}catch(o){this._logger.error(o,"Pool onresize handler error")}this._bus.emit("resize",a),this._bus.emit("pool:scale",{added:r,terminated:i,minSize:this.minSize,maxSize:this.maxSize})}this._updateIdleState()}_createWorkerInstance(){return new Rh(this._workerSource,{...this._workerOptions,onError:(e,t)=>this._onWorkerListenerError(e,t)})}_onWorkerListenerError(e,t){this._logger.error(e,`worker ${t?.type??"event"} handler failed`),this._debugLog?.(e,`_onWorkerListenerError: worker ${t?.type??"event"}`)}_deleteWorkerUnderlyingMapping(e){try{const t=e?.worker?._underlying;t&&this._underlyingToWorkerObj&&this._underlyingToWorkerObj.delete(t)}catch(t){this._debugLog?.(t,"_deleteWorkerUnderlyingMapping failed")}}_addWorkerInstance(e){e==null&&(e=this._nextWorkerId++);const t=this._createWorkerInstance(),n=t.worker,r=new zo(n,this._logger,this),i={id:e,worker:r,_agnostic:t,tasks:0,lastActive:tt(),latencyEwma:null,_startTimes:new Wi,protocol:{codecs:["json"],native:!1,announced:!1},completedTasks:0,tasksSettled:!1};this.workers.push(i),this._totalWorkersCreated++,this._bus.emit("pool:scale",{action:"add",id:i.id,minSize:this.minSize,maxSize:this.maxSize});try{this._underlyingToWorkerObj.set(n,i)}catch{}r.onmessage=l=>{const c=tt();if(i.tasksSettled){this._debugLog?.(new Error("late message from a settled worker"),"ignoring decrement for already-settled worker");return}i.tasks=Math.max(0,i.tasks-1),this._decrementActiveTasks(1),i.lastActive=c;try{const u=l?.data,f=u&&typeof u=="object"?u.correlationId:void 0,d=f??l?.correlationId;if(d!=null){const p=String(d),m=Object.prototype.hasOwnProperty.call(u,"response")?u.response:u;this._cleanupPendingResponse(p,{resolveWith:m})}}catch(u){this._debugLog?.(u,"worker.onmessage: resolve pending response")}try{const u=i._startTimes?.length?i._startTimes.shift():null;let f=null;try{const d=l?.data,p=typeof d?.duration=="number"?d.duration:l?.duration;if(typeof p=="number"&&Number.isFinite(p)?f=Math.max(0,Number(p)):u!=null&&(f=Math.max(0,c-u)),f!=null){const m=this._autoScale?.alpha||.2;if(this._autoScale&&this._autoScale.policy!=="ewma"){const _=this._autoScale.longWindowAlpha;this._longEwmaLatency==null?this._longEwmaLatency=f:this._longEwmaLatency=_*f+(1-_)*this._longEwmaLatency,f<this._minLatencyWindow&&(this._minLatencyWindow=f)}i.latencyEwma==null?i.latencyEwma=f:i.latencyEwma=m*f+(1-m)*i.latencyEwma,this._ewmaLatency==null?this._ewmaLatency=f:this._ewmaLatency=m*f+(1-m)*this._ewmaLatency,this._totalTasksCompleted=(this._totalTasksCompleted||0)+1,i.completedTasks=(i.completedTasks||0)+1;const g=this._taskDurationsWelfordCount;this._taskDurationsWelfordCount=g+1;const y=f-this._taskDurationsWelfordMean;this._taskDurationsWelfordMean+=y/this._taskDurationsWelfordCount;const h=f-this._taskDurationsWelfordMean;this._taskDurationsWelfordM2+=y*h,f<this._taskDurationsMin&&(this._taskDurationsMin=f),f>this._taskDurationsMax&&(this._taskDurationsMax=f),Number.isFinite(this._slowTaskThreshold)&&f>this._slowTaskThreshold&&(this._slowTaskCount=(this._slowTaskCount||0)+1)}}catch(d){this._debugLog?.(d,"worker.onmessage: latency tracking inner")}}catch(u){this._debugLog?.(u,"worker.onmessage: latency tracking outer")}if(!this._queuePaused&&this.queue.length>0&&i.tasks<this._maxTasksPerWorker){let u;for(;this.queue.length>0&&(u=this.queue.shiftHighestPriority(f=>{const d=f.priority??0;return this._priorityAgingMs>0?d+Math.max(0,c-f.enqueuedAt)/this._priorityAgingMs:d}),!(u.deadlineAt===void 0||u.deadlineAt>c));){if(u.correlationId!=null){const f=new Error("postMessage queued task deadline elapsed");f.code="EDEADLINE",this._cleanupPendingResponse(u.correlationId,{rejectWith:f})}u=null}if(u)try{this._recordQueueWait(c-u.enqueuedAt);const f=this._encodeForWorker(i,u);this._dispatchToWorker(i,f,{correlationId:u.correlationId,startTime:c})}catch(f){this._debugLog?.(f,"dispatch queued message to worker failed"),this._logger.error(f,"Failed to dispatch queued message to worker")}this._queueHighCrossed&&this.queue.length<=this._queueHighThreshold&&(this._queueHighCrossed=!1)}if(this._onmessage)try{this._onmessage(l)}catch(u){this._logger.error(u,"Pool onmessage handler error")}this._bus.emit("message",l),this._updateIdleState()};const a=l=>{const c=l?.data;let u=c,f=null;if(Vl(c)){this._applyCapabilities(i,c);return}if(ma(c)&&(u=c.value,f=c),c&&(c instanceof ArrayBuffer||ArrayBuffer.isView(c)))try{this._messageCodec!=="legacy"?u=pa(c).value:u=Ps(c)}catch(p){try{s(p)}catch(m){this._debugLog?.(m,"_handleMessage: _handleMessageError failed")}u=c}const d=u===c?l:{data:u,originalEvent:l&&"originalEvent"in l?l.originalEvent:l};if(f&&(f.correlationId!=null&&(d.correlationId=f.correlationId),typeof f.duration=="number"&&(d.duration=f.duration)),typeof r.onmessage=="function")try{r.onmessage(d)}catch(p){this._logger.error(p,"worker wrapper onmessage error")}},o=l=>{if(typeof r.onerror=="function")try{r.onerror(l)}catch(c){this._logger.error(c,"worker wrapper onerror error")}if(typeof this._onerror=="function")try{this._onerror(l)}catch(c){this._logger.error(c,"pool onerror handler error")}this._bus.emit("error",l)},s=l=>{if(typeof r.onmessageerror=="function")try{r.onmessageerror(l)}catch(c){this._logger.error(c,"worker wrapper onmessageerror error")}this._bus.emit("messageerror",l)};return t.on("message",a),t.on("error",o),t.on("messageerror",s),i}_findLeastLoadedWorker(){if(!this.workers.length)return null;let e=null,t=1/0,n=Number.POSITIVE_INFINITY;for(let r=0;r<this.workers.length;r++){const i=this.workers[r],a=i.latencyEwma!=null?i.latencyEwma:Number.POSITIVE_INFINITY;(i.tasks<t||i.tasks===t&&a<n)&&(e=i,t=i.tasks,n=a)}return e}_idempotencyBegin(e,t){this._idempotencyLookups+=1;const n=this._idempotency;if(e==null||!n)return!0;const r=String(e);this._idempotencySweep(t);const i=n.get(r);return i!==void 0?(i.settledAt===null?this._idempotencyDuplicatesInFlight+=1:this._idempotencyDuplicatesSettled+=1,!1):(n.set(r,{settledAt:null}),this._idempotencySize=n.size,!0)}_idempotencySettle(e,t){if(e==null)return;const n=this._idempotency;if(!n)return;const r=String(e),i=n.get(r);i!==void 0&&(i.settledAt=t,this._idempotencySize=n.size)}_idempotencyRelease(e){if(e==null)return;const t=this._idempotency;t&&(t.delete(String(e)),this._idempotencySize=t.size)}_idempotencySweep(e){const t=this._idempotency;if(!t||t.size===0)return;const n=this._idempotencyTtlMs;let r=0;for(const i of[...t.keys()]){if(r>=32)break;r+=1;const a=t.get(i);if(a&&a.settledAt!==null&&e-a.settledAt>=n&&(t.delete(i),this._idempotencyExpired+=1),r>=t.size)break}this._idempotencySize=t.size}postMessage(e,t,n){if(!this._idempotency)return this._postMessageInner(e,t,n);const r=tt(),i=n?.idempotencyKey;if(!this._idempotencyBegin(i,r))return!1;let a;try{a=this._postMessageInner(e,t,n)}catch(o){throw this._idempotencyRelease(i),o}return a===!1?this._idempotencyRelease(i):this._idempotencySettle(i,r),a}request(e,t){const{transfer:n,...r}=t??{};return this.postMessage(e,n,{...r,awaitResponse:!0})}_postMessageInner(e,t,n){this._assertNotTerminated(),n=n||void 0;const r=tt();if(n?.deadlineAt!==void 0&&!Number.isFinite(n.deadlineAt))throw new TypeError("postMessage deadlineAt must be finite");const i=n?.workerId!=null?n.workerId:null,a=i==null&&this.workers.length===1&&this._maxTasksPerWorker===1/0,o=i!=null?this.workers.find(p=>p.id===i):a?this.workers[0]:this._findLeastLoadedWorker(),s=!!(n?.awaitResponse||n?.correlationId!=null);let l,c;if(s){if(l=n.correlationId!=null?String(n.correlationId):this._generateCorrelationId(),!(e!==null&&typeof e=="object"&&!ArrayBuffer.isView(e)&&!(e instanceof ArrayBuffer)))throw new Error("postMessage awaitResponse requires a plain-object message");e=Object.assign({},e,{correlationId:l});const p=this._createPendingResponsePromise(l,n);c=p.pendingPromise,l=p.correlationKey}if(n?.deadlineAt!==void 0&&n.deadlineAt<=r){const p=new Error("postMessage deadline elapsed");return p.code="EDEADLINE",s&&l?(this._cleanupPendingResponse(l,{rejectWith:p}),c):!1}const u=this._autoScale?.policy&&this._autoScale.policy!=="ewma"?Math.max(1,Math.ceil(this._adaptiveLimit)):null;if(u!==null&&this._activeTasks>=u){if(this.taskQueueEnabled){const p=this._prepareForTransfer(e,t,n);return this._enqueueOrReject(p,s,l,c,n)}return s&&l?(this._cleanupPendingResponse(l,{rejectWith:new Error("adaptive concurrency limit reached")}),c):!1}if(o?.tasks<this._maxTasksPerWorker)try{const p=r,m=this._prepareForTransfer(e,t,n);return this._postToWorkerObj(o,m,p,s,l,c)}catch(p){if(s&&l){try{this._cleanupPendingResponse(l,{rejectWith:p})}catch(m){this._debugLog?.(m,"postMessage: cleanupPendingResponse failed")}try{this._logger.error(p,"Failed to postMessage to worker")}catch(m){this._debugLog?.(m,"postMessage: logger.error failed")}return c}try{this._logger.error(p,"Failed to postMessage to worker")}catch(m){this._debugLog?.(m,"postMessage: logger.error failed")}return!1}if(i!=null&&(!o||o.tasks>=this._maxTasksPerWorker)){if(s&&l){try{this._cleanupPendingResponse(l,{rejectWith:new Error("targeted worker unavailable")})}catch(p){this._debugLog?.(p,"postMessage: cleanupPendingResponse failed")}return c}return!1}if(i==null&&this.workers.length<this.maxSize){const p=r;return this._tryGrowPool(e,t,n,p,s,l,c)}if(this.taskQueueEnabled){const p=this._prepareForTransfer(e,t,n);return this._enqueueOrReject(p,s,l,c,n)}if(!this.workers.length)return s?c:!1;const f=this._nextIndex%this.workers.length;this._nextIndex=(this._nextIndex+1)%this.workers.length;const d=this.workers[f];try{const p=r,m=this._prepareForTransfer(e,t,n);return this._postToWorkerObj(d,m,p,s,l,c)}catch(p){if(s&&l){try{this._cleanupPendingResponse(l,{rejectWith:p})}catch(m){this._debugLog?.(m,"postMessage: cleanupPendingResponse failed")}try{this._logger.error(p,"Failed to postMessage to fallback worker")}catch(m){this._debugLog?.(m,"postMessage: logger.error failed")}return c}try{this._logger.error(p,"Failed to postMessage to fallback worker")}catch(m){this._debugLog?.(m,"postMessage: logger.error failed")}return!1}}_generateCorrelationId(){return`${qh}-${(Hh++).toString(36)}`}_cleanupPendingResponse(e,t={}){const n=e!=null?String(e):e,r=this._pendingResponses.get(n);if(!r)return!1;try{if(r.timer)try{clearTimeout(r.timer)}catch(i){this._debugLog?.(i,"_cleanupPendingResponse: clearTimeout failed")}}catch(i){this._debugLog?.(i,"_cleanupPendingResponse: timer check failed")}try{Object.prototype.hasOwnProperty.call(t,"resolveWith")?r.resolve(t.resolveWith):Object.prototype.hasOwnProperty.call(t,"rejectWith")&&r.reject(t.rejectWith)}catch(i){this._debugLog?.(i,"_cleanupPendingResponse: resolve/reject failed")}finally{try{this._pendingResponses.delete(n)}catch(i){this._debugLog?.(i,"_cleanupPendingResponse: delete failed")}}return!0}broadcast(e,t){const n=tt();let r=null;const i=e!==null&&typeof e=="object"&&!ArrayBuffer.isView(e)&&!(e instanceof ArrayBuffer);for(const a of this.workers)try{let o=e,s=t;if(!s&&i)try{r==null&&(r=this._encodeForTransfer(e));const l=r.slice();o=l,s=[l.buffer]}catch{o=e,s=void 0}this._dispatchToWorker(a,{message:o,transfer:s},{startTime:n})}catch(o){this._logger.error(o,"broadcast error")}this._updateIdleState()}_normalizeStopThePressOptions(e){const t=typeof e?.recreateWorkers<"u"?!!e.recreateWorkers:!0,n=typeof e=="object"?Object.assign({},e):void 0;return n&&delete n.recreateWorkers,{recreate:t,fwdOptions:n}}_resetPoolForStopThePress({recreate:e,scope:t}){try{typeof this.queue?.clear=="function"&&this.queue.clear()}catch(a){this._logger.error(a,`${t}: failed to clear queue`)}try{this._queueHighCrossed=!1}catch(a){this._debugLog?.(a,"_resetPoolForStopThePress: queueHighCrossed reset failed")}try{for(const[a]of this._pendingResponses)try{this._cleanupPendingResponse(a,{rejectWith:new Error(`${t}: cancelled pending response`)})}catch(o){this._debugLog?.(o,"_resetPoolForStopThePress: cleanupPendingResponse failed")}}catch(a){this._logger.error(a,`${t}: failed to cancel pending responses`)}let n,r;try{const a=this.workers;if(n=Number(a?.length)||0,Array.isArray(a))r=a.slice();else{r=new Array(n);for(let o=0;o<n;o++)r[o]=a[o]}}catch(a){this._logger.error(a,`${t}: failed to snapshot workers`),n=0,r=[]}const i=r.map(a=>a?.id).filter(a=>a!=null);try{for(let a=r.length-1;a>=0;a--){const o=r[a],s=this._terminateWorker(o,`${t}:reset`);s!=null&&i.push(s)}this.workers.length=0,this._activeTasks=0}catch(a){this._logger.error(a,`${t}: failed while terminating workers`)}if(e||this._clearLifecycleIntervals(),e){const a=Math.max(this.minSize,Math.min(n,this.maxSize));for(let o=0;o<a;o++)try{const s=this.workers.length;if(this._addWorkerInstance(),this.workers.length===s)break}catch(s){try{this._logger.error(s,"recreate: add worker failed")}catch(l){this._debugLog?.(l,"recreate: logger.error failed")}try{this._bus.emit("pool:error",{phase:"recreate",error:s})}catch(l){this._debugLog?.(l,"recreate: bus.emit failed")}break}try{this._ensureReaper()}catch(o){this._debugLog?.(o,"recreate: ensureReaper failed")}}return this._updateIdleState(),{currentCount:n,terminatedIds:i}}stopThePress(e,t,n){const{recreate:r,fwdOptions:i}=this._normalizeStopThePressOptions(n),{currentCount:a,terminatedIds:o}=this._resetPoolForStopThePress({recreate:r,scope:"stopThePress"});try{o?.length&&this._bus.emit("pool:scale",{action:"remove",terminated:o,count:a})}catch(s){this._logger.error(s,"pool scale stopThePress listener error")}if(!r)try{return this._enqueueOrReject(this._prepareForTransfer(e,t,n),!1,void 0,void 0,n)}catch(s){return this._logger.error(s,"stopThePress: enqueue after reset failed"),!1}return this.postMessage(e,t,i)}postMessageBatch(e,t){this._assertNotTerminated();const n=tt();if(!Array.isArray(e))throw new Error("postMessageBatch expects an array of {message, transfer?}");const r=!!(t?.awaitResponse||t?.correlationId!=null),i=typeof t?.correlationIdFactory=="function"?t.correlationIdFactory:null;if(r){if(t?.correlationId!=null&&e.length>1&&!i)throw new Error("postMessageBatch cannot use a fixed correlationId for multiple items; provide options.correlationIdFactory or omit correlationId");const m=i?this._resolveBatchCorrelationIds(e,i):null,g=new Array(e.length);for(let y=0;y<e.length;y++){const h=e[y]||{},_=Object.assign({},t);m&&(_.correlationId=m[y]),g[y]=this.postMessage(h.message,h.transfer,_)}return g}const a=new Array(e.length),o=[],s=t?.workerId!=null?t.workerId:null,l=this.prepareBuffers(e,{zeroCopy:!!t?.zeroCopy}),c=this._autoScale?.policy&&this._autoScale.policy!=="ewma"?Math.max(1,Math.ceil(this._adaptiveLimit)):null;let u=c===null?Number.POSITIVE_INFINITY:Math.max(0,c-this._activeTasks);if(s==null&&this.workers.length===1&&this._maxTasksPerWorker===1/0&&c===null){const m=this.workers[0];let g=!1;for(let y=0;y<e.length;y+=1){const h=l[y]||{message:e[y]?.message,transfer:e[y]?.transfer};try{this._dispatchToWorker(m,h,{startTime:n}),g=!0,a[y]=!0}catch(_){a[y]=this._reportPostFailure(_,"postMessageBatch:single-worker")}}return g&&this._updateIdleState(),a}const f=s!=null;let d;if(f){if(d=this.workers.find(m=>m.id===s),!d)return e.map(()=>!1)}else d=this._findLeastLoadedWorker();let p=!1;for(let m=0;m<e.length;m++){const g=e[m]||{},y=l[m]||{message:g.message,transfer:g.transfer};let h=!1;if(u<=0){this.taskQueueEnabled?(o.push({message:y.message,transfer:y.transfer,index:m,priority:t?.priority??0}),a[m]=!0):a[m]=!1;continue}d?.tasks>=this._maxTasksPerWorker&&(d=null);let _=d;if(!_&&!f&&(_=this._findLeastLoadedWorker()),_?.tasks<this._maxTasksPerWorker)try{this._dispatchToWorker(_,y,{startTime:n}),p=!0,a[m]=!0,h=!0,u--,d=_.tasks<this._maxTasksPerWorker?_:null}catch(w){a[m]=this._reportPostFailure(w,"postMessageBatch:dispatch"),h=!0}if(!h&&s==null&&this.workers.length<this.maxSize)try{const w=this._addWorkerInstance();w?(this._dispatchToWorker(w,y,{startTime:n}),p=!0,a[m]=!0,h=!0,u--,d=w.tasks<this._maxTasksPerWorker?w:null):(a[m]=!1,h=!0)}catch(w){a[m]=this._reportPostFailure(w,"postMessageBatch:add-worker"),h=!0}if(!h){if(s!=null){a[m]=!1;continue}if(this.taskQueueEnabled){const w=this._queuePolicy;if(w==="reject"||w==="drop-newest"&&this.queue.length>0)a[m]=!1;else{if(w==="drop-oldest"&&this.queue.length>0){const b=this.queue.shift();b?.correlationId!=null&&this._cleanupPendingResponse(b.correlationId,{rejectWith:new Error("postMessage queued task dropped by policy")})}o.push({message:y.message,transfer:y.transfer,index:m,priority:t?.priority??0}),a[m]=!0}}else if(!this.workers.length)a[m]=!1;else{const w=this._nextIndex%this.workers.length;this._nextIndex=(this._nextIndex+1)%this.workers.length;const b=this.workers[w];try{this._dispatchToWorker(b,y,{startTime:n}),p=!0,a[m]=!0,u--}catch(x){a[m]=!1,this._logger.error(x,"Failed to postMessage to fallback worker")}}}}if(o.length)try{const m=this._reserveQueueSlots(o.length);if(m<o.length){for(let g=m;g<o.length;g++)a[o[g].index]=!1;o.length=m}if(!o.length)this._logger.error?.(new Error(`postMessageBatch rejected ${e.length-m} task(s): task queue is full (maxQueueLength ${this._maxQueueLength})`),"postMessageBatch: queue full");else{const g=tt();for(const y of o)y.enqueuedAt=g;this.queue.pushMany(o),p=!0;try{Number.isFinite(this._queueHighThreshold)&&this.queue.length>this._queueHighThreshold&&!this._queueHighCrossed&&(this._queueHighCrossed=!0,this._bus.emit("pool:queue:high",{length:this.queue.length,threshold:this._queueHighThreshold}))}catch(y){this._debugLog?.(y,"postMessageBatch: bus.emit pool:queue:high failed")}}}catch(m){this._logger.error(m,"postMessageBatch: failed to enqueue prepared items")}return p&&this._updateIdleState(),a}stopThePressBatch(e,t){const{recreate:n,fwdOptions:r}=this._normalizeStopThePressOptions(t);this._resetPoolForStopThePress({recreate:n,scope:"stopThePressBatch"});try{return this.postMessageBatch(e,r)}catch(i){try{this._logger.error(i,"stopThePressBatch: postMessageBatch failed")}catch(a){this._debugLog?.(a,"stopThePressBatch: logger.error failed")}try{return new Array(e?e.length:0).fill(!1)}catch{return[]}}}addWorker(){if(this._terminated)return this._debugLog?.(null,"addWorker: pool terminated, ignoring"),null;let e;try{e=this._addWorkerInstance()}catch(t){try{this._logger.error(t,"addWorker: failed")}catch(n){this._debugLog?.(n,"addWorker: logger.error failed")}try{this._bus.emit("pool:error",{phase:"addWorker",error:t})}catch(n){this._debugLog?.(n,"addWorker: bus.emit failed")}return null}return e&&this._updateIdleState(),e}removeWorker(){const e=this.workers.pop();e&&(this._terminateWorker(e,"removeWorker"),this._updateIdleState())}_reapIdleWorkers(){if(this.idleTimeout<=0)return;const e=tt(),t=[];for(let n=this.workers.length-1;n>=0;n--){const r=this.workers[n];if(this.workers.length<=this.minSize)break;if(r.tasks===0&&e-(r.lastActive||0)>this.idleTimeout){const i=this._terminateWorker(r,"idle-reap");i!=null&&t.push(i);const a=this.workers.length-1;n===a?this.workers.pop():this.workers[n]=this.workers.pop()}}if(t.length)try{this._bus.emit("pool:scale",{action:"remove",reason:"idle-reap",terminated:t,count:t.length})}catch(n){this._debugLog?.(n,"_reapIdleWorkers: bus.emit failed")}this._updateIdleState()}_autoscaleSteps(e,t,n,r){if(!(n>1)||e==null||!(t>0))return Math.max(1,n||1);this._autoscaleServo??=new Nh({setpoint:1,kp:1,ki:.25,min:-n,max:n}),this._autoscaleServo.max!==n&&(this._autoscaleServo.max=n,this._autoscaleServo.min=-n,this._autoscaleServo.reset());const i=e/t,a=Math.abs(this._autoscaleServo.step(i,r));return Number.isFinite(a)?Math.max(1,Math.min(n,Math.round(a))):1}_updateAdaptiveLimit(){const e=this._autoScale;if(!e||e.policy==="ewma")return this._adaptiveLimit;const t=e.limitMin,n=e.limitMax,r=this._ewmaLatency,i=this._longEwmaLatency,a=this.queue.length,o=this._adaptiveLimit;if(r==null)return o;let s=o;switch(e.policy){case"aimd":{const c=i!=null&&r>i*1.25;this._congestion=c,s=c?o*e.aimdBeta:o+1;break}case"vegas":{const c=this._minLatencyWindow;if(!Number.isFinite(c)||c<=0){s=o+1;break}const u=3*Math.log10(Math.max(2,o)),f=6*Math.log10(Math.max(2,o)),d=o*(1-c/Math.max(r,c));d<u?(this._congestion=!1,s=o+u):d>f?(this._congestion=!0,s=o-f):this._congestion=!1;break}case"gradient2":{if(i==null||i<=0){s=o+1;break}const c=Math.max(.5,Math.min(1,i/r));s=c*o+a,this._congestion=c<1;break}default:return o}if(!Number.isFinite(s))return o;const l=o*.8+Math.max(t,Math.min(n,s))*.2;return this._adaptiveLimit=Math.max(t,Math.min(n,l)),this._lastAdaptiveLimit=o,this._adaptiveLimit}_autoScaleTick(){try{if(this._terminated||!this._autoScale||!this._autoScale.enabled)return;const e=tt(),t=this._autoScale;this._lastAutoScaleAt&&t.backoffResetMs&&e-this._lastAutoScaleAt>t.backoffResetMs&&(this._autoScaleBackoffMultiplier=1,this._autoscaleServo=null);const n=Math.floor((t.cooldownMs||0)*(this._autoScaleBackoffMultiplier||1));if(this._lastAutoScaleAt&&e-this._lastAutoScaleAt<n)return;this._updateAdaptiveLimit();const r=t.targetMs,i=t.hysteresis||.2,a=this._ewmaLatency,o=this.workers.length,s=r*(1+i),l=a!=null?a>s:!1,c=this.queue.length>Math.ceil(o*(1+i));if(l||c){if(this._lastAutoScaleReason=l&&c?"latency+queue":l?"latency":"queue",o<this.maxSize)try{const d=t.stepUp||1,p=this._autoscaleSteps(a,r,d,t.intervalMs/1e3),m=Math.min(this.maxSize-o,p);let g=0,y=!1;for(let h=0;h<m;h++)try{const _=this.workers.length;if(this._addWorkerInstance(),this.workers.length===_)break;g++}catch(_){y=!0,this._debugLog?.(_,"autoScale: addWorker failed");try{this._bus.emit("pool:error",{phase:"autoScale:add",error:_})}catch(w){this._debugLog?.(w,"autoScale: bus.emit failed")}break}this._lastAutoScaleOutcome=g>0?"added":y?"failed":"no-op",g>0&&(this._lastAutoScaleAt=e,this._autoScaleBackoffMultiplier=Math.min((this._autoScaleBackoffMultiplier||1)*(t.backoffFactor||1),t.backoffMaxMultiplier||8))}catch(d){this._lastAutoScaleOutcome="failed",this._debugLog?.(d,"autoScale: addWorker failed outer")}else this._lastAutoScaleOutcome="blocked";return}const u=r*Math.max(0,1-i),f=a!=null?a<u:!1;if(!l&&!c&&!f&&this._autoscaleServo&&this._autoscaleServo.reset(),f&&this.queue.length===0)if(this._lastAutoScaleReason="latency",o>this.minSize)try{const d=t.stepDown||1,p=this._autoscaleSteps(a,r,d,t.intervalMs/1e3),m=Math.min(o-this.minSize,p);let g=0;for(let y=this.workers.length-1;y>=0&&g<m;y--){const h=this.workers[y];if(!h||h.tasks>0)continue;this._terminateWorker(h,"autoscale");const _=this.workers.length-1;y===_?this.workers.pop():this.workers[y]=this.workers.pop(),g++}g>0?(this._lastAutoScaleOutcome="removed",this._lastAutoScaleAt=e,this._autoScaleBackoffMultiplier=Math.min((this._autoScaleBackoffMultiplier||1)*(t.backoffFactor||1),t.backoffMaxMultiplier||8)):this._lastAutoScaleOutcome="blocked"}catch(d){this._lastAutoScaleOutcome="failed",this._debugLog?.(d,"autoScale: remove worker failed")}else this._lastAutoScaleOutcome="blocked"}catch(e){this._debugLog?.(e,"autoScaleTick outer")}}_buildIdleEvent(){const e=this;let t,n=!1,r,i=!1;return{data:{type:"pool:idle",get workers(){return i||(r=e.workers.map(a=>({id:a.id,tasks:a.tasks,lastActive:a.lastActive})),i=!0),r},get stats(){return n||(t=e.getStats(),n=!0),t}}}}_emitIdle(){const e=this._buildIdleEvent();if(this._isIdle=!0,this._onmessage)try{this._onmessage(e)}catch(t){this._logger.error(t,"Pool onmessage handler error")}if(this._onidle)try{this._onidle(e)}catch(t){this._logger.error(t,"Pool onidle handler error")}try{this._bus.emit("message",e)}catch(t){this._logger.error(t,"pool listener error")}try{this._bus.emit("idle",e)}catch(t){this._logger.error(t,"pool idle listener error")}}_updateIdleState(){const e=this.queue.length===0,t=this._activeTasks===0&&e;t&&!this._isIdle?this._emitIdle():!t&&this._isIdle&&(this._isIdle=!1)}terminate(){try{this.shutdown()}catch{}}dispose(){As(this._metrics),this._metrics=null,this[Symbol.dispose]()}[Symbol.dispose](){this.shutdown()}async[Symbol.asyncDispose](){try{await this.drain()}catch{}this.terminate()}getStats(){const e=this.workers.map(x=>({id:x.id,tasks:x.tasks,lastActive:x.lastActive})),t=this.workers.filter(x=>x.protocol?.native).length,n={mode:this._messageCodec,nativeAvailable:this._nativeCloneAvailable,nativeWorkers:t,workers:this.workers.map(x=>({id:x.id,codecs:x.protocol?.codecs??["json"]}))},r=tt(),i=this._createdAt!=null?Math.max(0,r-this._createdAt):0,a=this._totalWorkersCreated||this.workers.length,o=this._totalTasksCompleted||0,s=this._terminatedWorkerTaskCountsCount||0,l=this._terminatedWorkerTaskCountsTotal||0;let c=0;for(const x of this.workers)c+=x.completedTasks||0;const u=s+(this.workers.length||0),f=u>0?(l+c)/u:0;let d=0,p=0,m=0,g=0,y=0;const h=this._taskDurationsWelfordCount||0;if(h>0){d=this._taskDurationsMin===Number.POSITIVE_INFINITY?0:this._taskDurationsMin,p=this._taskDurationsMax===Number.NEGATIVE_INFINITY?0:this._taskDurationsMax,m=this._taskDurationsWelfordMean;const x=h>1?this._taskDurationsWelfordM2/h:0;g=Math.sqrt(x),y=h>0?(this._slowTaskCount||0)/h*100:0}const _=this._queueWaitWelfordCount||0,w=_>1?this._queueWaitWelfordM2/_:0,b={count:_,min:_>0?this._queueWaitMin:0,max:_>0?this._queueWaitMax:0,average:_>0?this._queueWaitWelfordMean:0,stddev:Math.sqrt(w)};return{status:e,protocol:n,performance:{poolLiveDuration:i,totalWorkersCreated:a,totalTasksPerformed:o,averageTasksPerWorkerUntilTermination:f,timePerTask:{max:p,min:d,average:m,stddev:g},queueWait:b,percentSlowTasks:y,concurrencyLimit:this._autoScale&&this._autoScale.policy!=="ewma"?Math.round(this._adaptiveLimit*100)/100:null,autoScalePolicy:this._autoScale&&this._autoScaleInterval?this._autoScale.policy:null,congestion:this._autoScale?!!this._congestion:null,lastScaleReason:this._autoScale?this._lastAutoScaleReason:null,lastScaleOutcome:this._autoScale?this._lastAutoScaleOutcome:null,idleReapingActive:this._reaperInterval!==null&&this._reaperInterval!==void 0},postFailures:this._postFailures,idempotency:{enabled:this._idempotency!==null,ttlMs:this._idempotencyTtlMs,lookups:this._idempotencyLookups,duplicatesInFlight:this._idempotencyDuplicatesInFlight,duplicatesSettled:this._idempotencyDuplicatesSettled,expired:this._idempotencyExpired,size:this._idempotencySize},queueLength:this.queue.length,queueDepth:this.queue.length,queuePressure:Number.isFinite(this._maxQueueLength)?Math.min(1,this.queue.length/Math.max(1,this._maxQueueLength)):this.queue.length>0?1:0,activeTasks:this._activeTasks,workerCount:this.workers.length,minSize:this.minSize,maxSize:this.maxSize,isIdle:this._activeTasks===0&&this.queue.length===0}}drain(e={}){const t=e?.signal??null,n=Number(e?.timeout),r=Number.isFinite(n)&&n>0?Math.floor(n):0,i=this.queue.length===0;return this._activeTasks===0&&i?t?.aborted?Promise.reject(jr(t)):Promise.resolve(this.getStats()):t?.aborted?Promise.reject(jr(t)):this._drainWaiters>=this._maxDrainWaiters?Promise.reject(Da("ERR_POOL_DRAIN_TOO_MANY_WAITERS",`drain(): ${this._drainWaiters} drain(s) already waiting (maxDrainWaiters ${this._maxDrainWaiters})`)):(this._drainWaiters++,new Promise((a,o)=>{let s=null,l=!1;const c=()=>{if(!l){l=!0,s&&(clearTimeout(s),s=null),this._drainWaiters--;try{this.removeEventListener("idle",u)}catch(p){this._debugLog?.(p,"drain: removeEventListener failed")}}},u=()=>{c(),a(this.getStats())},f=()=>{c(),o(jr(t))};r&&(s=setTimeout(()=>{c(),o(Da("ERR_POOL_DRAIN_TIMEOUT",`drain(): pool did not become idle within ${r}ms`))},r)),t&&t.addEventListener("abort",f,{once:!0}),this.addEventListener("idle",u)}))}addEventListener(e,t){if(typeof t=="function"&&(this._bus.on(e,t),e==="idle")){const n=this.queue.length===0;if(this._activeTasks===0&&n){const r=this._buildIdleEvent();try{t(r)}catch(i){this._logger.error(i,"pool idle listener error")}}}}removeEventListener(e,t){!t||typeof t!="function"||this._bus.off(e,t)}get onresize(){return this._onresize}set onresize(e){this._onresize=e}get onmessage(){return this._onmessage}set onmessage(e){this._onmessage=e}get onerror(){return this._onerror}set onerror(e){this._onerror=e}get onidle(){return this._onidle}set onidle(e){if(this._onidle=e,typeof e=="function"){const t=this.queue.length===0;if(this._activeTasks===0&&t){const n=this._buildIdleEvent();try{e(n)}catch(r){this._logger.error(r,"Pool onidle handler error")}}}}pauseQueue(){this._queuePaused=!0}resumeQueue(){this._queuePaused&&(this._queuePaused=!1,this._dispatchQueuedTasks())}pause(){return this.pauseQueue()}resume(){return this.resumeQueue()}get queuePaused(){return this._queuePaused}_dispatchQueuedTasks(){if(this._queuePaused||!this.taskQueueEnabled||this.queue.length===0)return;const e=this.queue,t=this._maxTasksPerWorker,n=this._autoScale?.policy&&this._autoScale.policy!=="ewma"?Math.max(1,Math.ceil(this._adaptiveLimit)):null;let r=n===null?Number.POSITIVE_INFINITY:Math.max(0,n-this._activeTasks);const i=tt();let a=!1;for(const o of this.workers){let s=t-o.tasks;for(;s>0&&r>0&&e.length>0;){const l=e.shift();try{const c=this._encodeForWorker(o,l);this._dispatchToWorker(o,c,{correlationId:l.correlationId,startTime:i}),s--,r--,o.lastActive=i,a=!0}catch(c){this._debugLog?.(c,"dispatch queued message to worker failed"),this._logger.error(c,"Failed to dispatch queued message to worker");break}}}this._queueHighCrossed&&this.queue.length<=this._queueHighThreshold&&(this._queueHighCrossed=!1),a&&this._updateIdleState()}};function $o(e){!e?.onAbort||!e.signal||(e.signal.removeEventListener("abort",e.onAbort),e.onAbort=null)}var Zh=class{constructor(e={}){xt(e,["capacity","queueCapacity","initialTokens","className","limitName"],"PowerPermitGate");const{capacity:t,queueCapacity:n,initialTokens:r}=e||{},i=typeof e?.className=="string"?e.className:"PowerPermitGate",a=typeof e?.limitName=="string"&&e.limitName?e.limitName:"capacity";this._className=i,this._capacity=Fe(t,{name:a,className:i,min:1,integer:!0,fallback:1}),this._queueCapacity=n==null?1/0:Fe(n,{name:"queueCapacity",className:i,min:0,integer:!0,allowInfinity:!0}),this._available=r==null?this._capacity:Math.min(this._capacity,Fe(r,{name:"initialTokens",className:i,min:0,integer:!0})),this._waiters=new Wi(16),this._held=0,this._cancelledWaiters=0}get capacity(){return this._capacity}get available(){return this._available}get pending(){return Math.max(0,this._waiters.length-this._cancelledWaiters)}get queueCapacity(){return this._queueCapacity}get isFull(){return this.pending>=this._queueCapacity}get active(){return this._held}acquire(e={}){let t;try{t=Fe(e?.weight,{name:"weight",className:this._className,min:1,integer:!0,fallback:1})}catch(r){return Promise.reject(r)}if(t>this._capacity)return Promise.reject(new TypeError(`${this._className}: \`weight\` (${t}) exceeds \`capacity\` (${this._capacity}). A waiter heavier than the pool can never be granted.`));const n=e?.signal??null;return n?.aborted?Promise.reject(jr(n)):this._available>=t?Promise.resolve(this._grant(t)):this.isFull?Promise.reject(ru(this._className,this._queueCapacity)):new Promise((r,i)=>{const a={resolve:r,reject:i,signal:n??null,onAbort:null,cancelled:!1,weight:t};this._waiters.push(a),n&&(a.onAbort=()=>{a.cancelled||(a.cancelled=!0,this._cancelledWaiters+=1,$o(a),i(jr(n)))},n.addEventListener("abort",a.onAbort,{once:!0}))})}tryAcquire(e=1){const t=Fe(e,{name:"weight",className:this._className,min:1,integer:!0,fallback:1});return this._available>=t?this._grant(t):null}release(e=1){const t=Math.max(0,Math.floor(Number(e)||1)),n=this._available,r=t-this._serveWaiters(t,!1);return r>0&&(this._available=Math.min(this._capacity,this._available+r)),this._held=Math.max(0,this._held-r),this._available-n}reset(e={}){const{available:t=this._capacity,reason:n=new Error("PowerPermitGate reset")}=e,r=Math.min(this._capacity,Math.max(0,Math.floor(Number(t)||0)));for(;this._waiters.length>0;){const i=this._waiters.shift();typeof i?.reject=="function"&&i.reject(n)}this._cancelledWaiters=0,this._available=Math.max(0,Math.min(r,this._capacity-this._held))}_makeRelease(e=1){let t=!1;return()=>{t||(t=!0,this.release(e))}}_grant(e=1){return this._available-=e,this._held+=e,this._makeRelease(e)}_grantTo(e,t){const n=e.weight??1;t&&(this._available-=n,this._held+=n),e.resolve(this._makeRelease(n))}_serveWaiters(e,t){let n=0;for(;n<e&&this._waiters.length>0;){const r=this._waiters.peek();if(r?.cancelled){this._cancelledWaiters=Math.max(0,this._cancelledWaiters-1),this._waiters.shift();continue}if(typeof r?.resolve!="function"){this._waiters.shift();continue}const i=r.weight??1;if(i>e-n)break;this._waiters.shift(),$o(r),this._grantTo(r,t),n+=i}return n}dispose(){this.reset(),li(this,"reset")}[Symbol.dispose](){this.dispose()}},Yl=class{constructor(e=1,t=void 0){if(e&&typeof e=="object"&&("limit"in e||"queueCapacity"in e)){const n=e;xt(n,["limit","queueCapacity"],"PowerSemaphore"),e=n.limit,t=n.queueCapacity}this._gate=new Zh({capacity:e,initialTokens:e,queueCapacity:t,className:"PowerSemaphore",limitName:"limit"})}get limit(){return this._gate.capacity}get active(){return this._gate.active}get pending(){return this._gate.pending}get available(){return this._gate.available}get isLocked(){return this._gate.available===0}get queueCapacity(){return this._gate.queueCapacity}get isFull(){return this._gate.isFull}acquire(e={}){return this._gate.acquire(e)}tryAcquire(){return this._gate.tryAcquire()}async run(e,t={}){const n=await this.acquire(t);try{return await e()}finally{n()}}reset(){this._gate.reset({available:this._gate.capacity})}dispose(){this.reset(),li(this,"reset")}[Symbol.dispose](){this.dispose()}};function Yh(){return typeof requestIdleCallback=="function"?new Promise(e=>{try{requestIdleCallback(e,{timeout:50})}catch{setTimeout(e,0)}}):new Promise(e=>setTimeout(e,0))}async function xn(e,t=50){try{if(!e||!t)return;e%t===0&&await Yh()}catch{}}var Qh=ha({CRAWL_MAX_QUEUE:()=>lc,HOME_SLUG:()=>en,_setAllMd:()=>ic,_setSearchIndex:()=>Hr,_storeSlugMapping:()=>vt,addSlugResolver:()=>nf,allMarkdownPaths:()=>ht,allMarkdownPathsSet:()=>Qe,availableLanguages:()=>pt,awaitSearchIndex:()=>os,buildSearchIndex:()=>Vn,buildSearchIndexWorker:()=>is,clearFetchCache:()=>cf,clearListCaches:()=>af,crawlAllMarkdown:()=>dc,crawlCache:()=>Hi,crawlForSlug:()=>fc,crawlForSlugWorker:()=>tf,defaultCrawlMaxQueue:()=>fi,ensureSlug:()=>pc,fetchCache:()=>Dt,fetchMarkdown:()=>Xe,getFetchConcurrency:()=>Vr,getLanguages:()=>Bs,getSearchIndex:()=>mf,homePage:()=>At,initSlugWorker:()=>_a,isExternalLink:()=>lf,isExternalLinkWithBase:()=>hi,listPathsFetched:()=>ra,listSlugCache:()=>Gr,mdToSlug:()=>_e,negativeFetchCache:()=>Mn,notFoundPage:()=>ke,removeSlugResolver:()=>rf,resolveSlugPath:()=>dr,searchIndex:()=>le,setContentBase:()=>Us,setDefaultCrawlMaxQueue:()=>cc,setFetchCacheMaxSize:()=>uf,setFetchCacheTTL:()=>hf,setFetchConcurrency:()=>oc,setFetchMarkdown:()=>df,setFetchNegativeCacheTTL:()=>sc,setHomePage:()=>rc,setLanguages:()=>Jl,setNegativeFetchCacheMaxSize:()=>ff,setNotFoundPage:()=>nc,setSkipRootReadme:()=>Xl,skipRootReadme:()=>Ds,slugResolvers:()=>wa,slugToMd:()=>ie,slugify:()=>be,storeSlugMapping:()=>ft,teardownSlugWorkerPool:()=>Kh,unescapeMarkdown:()=>qi,uniqueSlug:()=>Tn,watchForColdHashRoute:()=>ji,whenSearchIndexReady:()=>An}),Do=0,na=new Map;function ji(e){try{if(!e)return;let t=en,n="";if(e.type==="cosmetic"){const i=e.page!=null&&String(e.page).trim()!=="";t=i?String(e.page):en,n="#/"+(i?String(e.page):""),e.anchor&&(n+="#"+String(e.anchor)),e.params&&(n+="?"+String(e.params))}else if(e.type==="path"){const i=e.page!=null&&String(e.page).trim()!=="";t=i?String(e.page):en,n="/"+(i?String(e.page):""),e.anchor&&(n+="#"+String(e.anchor)),e.params&&(n+="?"+String(e.params))}else if(e.type==="canonical")if(e.page)t=e.page,n="?page="+encodeURIComponent(e.page),e.anchor&&(n+="#"+String(e.anchor)),e.params&&(n+="?"+String(e.params));else{t=en;try{n=typeof location<"u"&&location?.pathname?String(location.pathname):"/",typeof location<"u"&&location?.search&&(n+=String(location.search)),typeof location<"u"&&location?.hash&&(n+=String(location.hash))}catch{n="/"}}else return;const r=na.get(t)||[];r.push(n),na.set(t,r)}catch{}}function Ql(e,t){try{const n=String(e??""),r=na.get(n);if(!r||!r.length)return;try{const i=typeof globalThis<"u"?globalThis:null;if(i){try{i.__nimbiColdRouteResolved||(i.__nimbiColdRouteResolved=[])}catch{}for(const a of r)try{const o={slug:n,token:a,rel:String(t??"")};try{i.__nimbiColdRouteResolved.push(o)}catch{}try{i?.dispatchEvent?.(new CustomEvent("nimbi.coldRouteResolved",{detail:o}))}catch{}try{i?.__nimbiUI?.renderByQuery?.().catch(()=>{})}catch{}}catch{}}}catch{}na.delete(n)}catch{}}try{ie.set=function(e,t){const n=Map.prototype.has.call(this,e),r=Map.prototype.set.call(this,e,t);try{n||Ql(e,typeof t=="string"?t:t?.default??Object.values(t?.langs??{})[0]??"")}catch{}return r}}catch{}var pt=[],Ds=!1;function Xl(e){Ds=!!e}function Jl(e){pt=Array.isArray(e)?e.slice():[]}function Bs(){return pt}async function Kl(e,t,n=4,r){if(!Array.isArray(e)||e.length===0)return[];const i=new Yl(Math.max(1,Number(n)||1));return Promise.all(e.map((a,o)=>i.run(()=>t(a,o),{signal:r})))}var ya=Il(),Xh={intervalMs:750,targetMs:120,hysteresis:.3,cooldownMs:1e3,stepUp:1,stepDown:1},qr=null;function Jh(){const e={size:ya,minSize:2,autoScale:Xh,messageCodec:"negotiated",maxQueueLength:100};try{e.debugLevel=0}catch{}try{return new $s(Sh,e)}catch{return{workers:[],postMessage:async()=>{throw new Error("slug worker unavailable")}}}}function ec(){return qr||(qr=Jh()),qr}function Kh(){const e=qr;if(qr=null,!!e)try{typeof e.drain=="function"&&e.drain().catch(()=>{}),typeof e.terminate=="function"&&e.terminate(),typeof e.dispose=="function"&&e.dispose()}catch(t){k("[slugManager] teardownSlugWorkerPool failed",t)}}function ef(){try{return Rl()}catch{return!1}}function _a(){return ec().workers?.[0]?.worker?._underlying??null}function tc(e){return _a?.()?ec().postMessage(e,void 0,{awaitResponse:!0,timeout:5e3}).then(t=>{if(t?.error)throw new Error(t.error);return t}).catch(t=>{throw(t?.message||"").includes("postMessage response timeout")?new Error("worker timeout"):t}):Promise.reject(new Error("slug worker required but unavailable"))}async function is(e,t=1,n=void 0,r=void 0){if(!_a?.())throw new Error("slug worker required but unavailable");return await tc({type:"buildSearchIndex",contentBase:e,indexDepth:t,noIndexing:n,seedPaths:r})}async function tf(e,t,n){if(!_a?.())throw new Error("slug worker required but unavailable");return tc({type:"crawlForSlug",slug:e,base:t,maxQueue:n})}function vt(e,t){if(!e)return;let n=null;try{n=se(typeof t=="string"?t:String(t??""))}catch{n=String(t??"")}if(n){try{if(pt?.length){const r=String(n).split("/")[0],i=Array.isArray(pt)?pt.length>8?(pt._set||=new Set(pt)).has(r):pt.includes(r):!1;let a=ie.get(e);if(!a||typeof a=="string")a={default:typeof a=="string"?se(a):void 0,langs:{}};else try{a.default&&(a.default=se(a.default))}catch{}i?a.langs[r]=n:a.default=n,ie.set(e,a)}else{const r=ie.has(e)?ie.get(e):void 0;if(!r)ie.set(e,n);else{let i=null;try{typeof r=="string"?i=se(r):r&&typeof r=="object"&&(i=r.default?se(r.default):null)}catch{i=null}if(i===n)ie.set(e,n);else{let a=null,o=2;for(;a=`${e}-${o}`,!!ie.has(a);){let s=ie.get(a),l=null;try{typeof s=="string"?l=se(s):s&&typeof s=="object"&&(l=s.default?se(s.default):null)}catch{l=null}if(l===n){e=a;break}if(o+=1,o>1e4)break}try{if(!ie.has(a))ie.set(a,n),e=a;else if(ie.get(a)===n)e=a;else{const s=new Set;for(const c of ie.keys())s.add(c);const l=typeof Tn=="function"?Tn(e,s):`${e}-2`;ie.set(l,n),e=l}}catch(s){k("[slugManager] slug collision resolution failed",s)}}}}}catch{}try{if(n){try{_e.set(n,e)}catch{}Qe&&!Qe.has(n)&&(Qe.add(n),Array.isArray(ht)&&ht.push(n))}}catch{}}}function ft(e,t){return vt(e,t)}var wa=new Set;function nf(e){typeof e=="function"&&wa.add(e)}function rf(e){typeof e=="function"&&wa.delete(e)}var as={},ke="_404.md",At=null,en="_home";function nc(e){if(e==null){ke=null;return}ke=String(e??"")}function rc(e){if(e==null){At=null;return}At=String(e??"");try{try{Ql(en,At)}catch{}}catch{}}function ic(e){as=e||{}}function Hr(e){try{if(Array.isArray(le)||(le=[]),!Array.isArray(e))return;try{le.length=0;for(const t of e)le.push(t);try{if(typeof window<"u")try{window.__nimbiLiveSearchIndex=le}catch{}}catch{}}catch(t){de("[slugManager] replacing searchIndex by assignment fallback",t);try{le=Array.from(e)}catch{}}}catch{}}var Gr=new Map,ra=new Set;function af(){Gr.clear(),ra.clear()}function sf(e){if(!e||e.length===0)return"";let t=e[0];for(let r=1;r<e.length;r++){const i=e[r];let a=0;const o=Math.min(t.length,i.length);for(;a<o&&t[a]===i[a];)a++;t=t.slice(0,a)}const n=t.lastIndexOf("/");return n===-1?t:t.slice(0,n+1)}var of=new mr(function(e){let n=String(e??"").toLowerCase().replace(/[^a-z0-9\- ]/g,"").replace(/ /g,"-");return n=n.replace(/(?:-?)(?:md|html)$/,""),n=n.replace(/-+/g,"-"),n=n.replace(/^-|-$/g,""),n.length>80&&(n=n.slice(0,80).replace(/-+$/g,"")),n},{keyResolver:e=>e===void 0?"__undefined":String(e),cacheOptions:{maxEntries:2e3}}),be=e=>of.run(e);function Us(e){ie.clear(),_e.clear(),vh([]);try{Qe.clear()}catch{}pt=pt||[];const t=!!pt?.length,n=new Set,r=Object.keys(as||{});if(!r.length)return;let i="";try{if(e){try{/^[a-z][a-z0-9+.-]*:/i.test(String(e))?i=new URL(String(e)).pathname:i=String(e??"")}catch(a){i=String(e??""),de("[slugManager] parse contentBase failed",a)}i=Rn(i)}}catch(a){i="",de("[slugManager] setContentBase prefix derivation failed",a)}i||(i=sf(r));for(const a of r){let o=a;i&&a.startsWith(i)?o=se(a.slice(i.length)):o=se(a),ht.push(o);try{Qe.add(o)}catch{}const s=as[a];if(typeof s=="string"){const l=(s||"").match(/^#\s+(.+)$/m);if(l&&l[1]){const c=be(l[1].trim());if(c)try{let u=c;if(t||(u=Tn(u,n)),t){const f=o.split("/")[0],d=Array.isArray(pt)?pt.length>8?(pt._set||=new Set(pt)).has(f):pt.includes(f):!1;let p=ie.get(u);(!p||typeof p=="string")&&(p={default:typeof p=="string"?p:void 0,langs:{}}),d?p.langs[f]=o:p.default=o,ie.set(u,p)}else ie.set(u,o),n.add(u);_e.set(o,u)}catch(u){de("[slugManager] set slug mapping failed",u)}}}}try{lr()}catch(a){de("[slugManager] refreshIndexPaths failed",a)}}try{Us()}catch(e){de("[slugManager] initial setContentBase failed",e)}function Tn(e,t){if(!t.has(e))return e;let n=2,r=`${e}-${n}`;for(;t.has(r);)n+=1,r=`${e}-${n}`;return r}function lf(e){return hi(e,void 0)}function hi(e,t){if(!e)return!1;if(e.startsWith("//"))return!0;if(/^[a-z][a-z0-9+.-]*:/i.test(e)){if(t&&typeof t=="string")try{const n=new URL(e),r=new URL(t);return n.origin!==r.origin?!0:!n.pathname.startsWith(r.pathname)}catch{return!0}return!0}if(e.startsWith("/")&&t&&typeof t=="string")try{const n=new URL(e,t),r=new URL(t);return n.origin!==r.origin?!0:!n.pathname.startsWith(r.pathname)}catch{return!0}return!1}function qi(e){return e==null?e:String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g,(t,n)=>n)}function dr(e){if(!e||!ie.has(e))return null;const t=ie.get(e);if(!t)return null;if(typeof t=="string")return t;if(pt?.length&&Bt&&t.langs&&t.langs[Bt])return t.langs[Bt];if(t.default)return t.default;if(t.langs){const n=Object.keys(t.langs);if(n.length)return t.langs[n[0]]}return null}var Dt=new oi({maxEntries:2e3});function cf(){Dt.clear(),Mn.clear()}var Mn=new oi({maxEntries:2e3}),ac=6e4;function sc(e){ac=Number(e)||0}function uf(e){try{const t=Math.max(0,Number(e)||0);Dt&&typeof Dt.maxEntries<"u"&&(Dt.maxEntries=t)}catch{}}function hf(e){try{const t=Math.max(0,Number(e)||0);Dt&&typeof Dt.defaultTTL<"u"&&(Dt.defaultTTL=t)}catch{}}function ff(e){try{const t=Math.max(0,Number(e)||0);Mn&&typeof Mn.maxEntries<"u"&&(Mn.maxEntries=t)}catch{}}var ss=Math.max(1,Math.min(ya,5));function oc(e){try{ss=Math.max(1,Number(e)||1)}catch{ss=1}}function Vr(){return ss}var Xe=async function(e,t,n){if(!e)throw new Error("path required");try{if(typeof e=="string"&&(e.indexOf("?page=")!==-1||e.startsWith("?")||e.startsWith("#/")||e.indexOf("#/")!==-1))try{const u=yt(e);u?.page&&(e=u.page)}catch{}}catch{}try{const u=(String(e??"").match(/([^\/]+)\.md(?:$|[?#])/)||[])[1],f=typeof e=="string"&&String(e).indexOf("/")===-1;if(u&&f&&ie.has(u)){const d=dr(u)||ie.get(u);d&&d!==e&&(e=d)}}catch(u){de("[slugManager] slug mapping normalization failed",u)}try{if(typeof e=="string"&&e.indexOf("::")!==-1){const u=String(e).split("::",1)[0];if(u)try{if(ie.has(u)){const f=dr(u)||ie.get(u);f?e=f:e=u}else e=u}catch{e=u}}}catch(u){de("[slugManager] path sanitize failed",u)}try{if(t)try{let u=(/^[a-z][a-z0-9+.-]*:/i.test(String(t))?new URL(String(t)):new URL(String(t),typeof location<"u"?location.origin:"http://localhost")).pathname||"";if(u=u.replace(/^\/+|\/+$/g,""),u)try{const f=String(e??"");if(!/^[a-z][a-z0-9+.-]*:/i.test(f)){let d=f.replace(/^\/+/,"");d===u?e="":d.startsWith(u+"/")?e=d.slice(u.length+1):e=d}}catch{}}catch{}}catch{}if(!(n?.force===!0||typeof ke=="string"&&ke||ie?.size||Qe?.size||Rl()))throw new Error("failed to fetch md");const r=t==null?"":Zn(String(t));let i="";try{const u=typeof location<"u"&&location?.origin?location.origin:"http://localhost";let f=u.replace(/\/$/,"")+"/";r&&(/^[a-z][a-z0-9+.-]*:/i.test(r)?f=r.replace(/\/$/,"")+"/":r.startsWith("/")?f=u.replace(/\/$/,"")+r.replace(/\/$/,"")+"/":f=u.replace(/\/$/,"")+"/"+r.replace(/\/$/,"")+"/");try{i=new URL(e.replace(/^\//,""),f).toString()}catch{i=u.replace(/\/$/,"")+"/"+e.replace(/^\//,"")}}catch{i=(typeof location<"u"&&location.origin?location.origin:"http://localhost")+"/"+e.replace(/^\//,"")}const a=n?.signal,o=async u=>{const f=n&&typeof n.timeoutMs=="number"?Math.max(0,Number(n.timeoutMs)||0):1e4;try{if(typeof Wr=="function"){const p=new Wr({timeout:f});let m=p.signal;try{if(a&&typeof AbortSignal<"u"&&typeof AbortSignal.any=="function"&&p.signal instanceof AbortSignal)m=AbortSignal.any([a,p.signal]);else if(a&&typeof AbortSignal<"u"){const g=new AbortController;try{a.addEventListener("abort",()=>g.abort(),{once:!0})}catch{}try{p.signal.addEventListener("abort",()=>g.abort(),{once:!0})}catch{}try{(a?.aborted||p.signal?.aborted)&&g.abort()}catch{}m=g.signal}}catch{}try{return await p.run(async()=>{const y=async()=>{if(m?.aborted){const _=new Error("aborted");throw _.name="AbortError",_}return await fetch(u,m?{signal:m,referrerPolicy:"no-referrer"}:{referrerPolicy:"no-referrer"})};if(typeof Ki=="function")try{const _=new Ki({attempts:3,factor:2,minDelay:50});if(typeof _.run=="function")return await _.run(async()=>{const w=await y();if(w&&typeof w.status=="number"&&w.status>=500){const b=new Error("server error");throw b.status=w.status,b}return w})}catch{}let h;for(let _=0;_<3;_++){if(m?.aborted){const w=new Error("aborted");throw w.name="AbortError",w}try{const w=await y();if(w&&typeof w.status=="number"&&w.status>=500){if(h=new Error("server error"),h.status=w.status,_<2){const b=Math.pow(2,_)*50;await new Promise(x=>setTimeout(x,b));continue}throw h}return w}catch(w){if(w&&w.name==="AbortError")throw w;if(h=w,_<2){const b=Math.pow(2,_)*50;await new Promise(x=>setTimeout(x,b));continue}throw h}}})}catch{}}}catch{}let d=a||null;try{!d&&typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function"?d=AbortSignal.timeout(f):d&&typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function"&&typeof AbortSignal.any=="function"&&(d=AbortSignal.any([d,AbortSignal.timeout(f)]))}catch{}return await fetch(u,d?{signal:d}:void 0)};try{const u=Mn.get(i);if(u&&u>Date.now())return Promise.reject(new Error("failed to fetch md"));u&&Mn.delete(i)}catch{}if(Dt.has(i))return Dt.get(i);const s=(async()=>{let u;try{u=await o(i)}catch(g){try{Fr("fetchMarkdown failed:",()=>({url:i,status:"fetch-error",error:g&&g.message?g.message:String(g)}))}catch{}throw new Error("failed to fetch md")}if(!u||typeof u.ok!="boolean"||!u.ok){if(u&&u.status===404&&typeof ke=="string"&&ke)try{const y=`${r}/${ke}`,h=await o(y);if(h&&typeof h.ok=="boolean"&&h.ok)return{raw:await h.text(),status:404}}catch(y){de("[slugManager] fetching fallback 404 failed",y)}let g="";try{u&&typeof u.clone=="function"?g=await u.clone().text():u&&typeof u.text=="function"?g=await u.text():g=""}catch(y){g="",de("[slugManager] reading error body failed",y)}try{const y=u?u.status:void 0;if(y===404)try{k("fetchMarkdown failed (404):",()=>({url:i,status:y,statusText:u?u.statusText:void 0,body:g.slice(0,200)}))}catch{}else try{Fr("fetchMarkdown failed:",()=>({url:i,status:y,statusText:u?u.statusText:void 0,body:g.slice(0,200)}))}catch{}}catch{}throw new Error("failed to fetch md")}const f=await u.text(),d=f.trim().slice(0,128).toLowerCase(),p=/^(?:<!doctype|<html|<title|<h1)/.test(d),m=p||String(e??"").toLowerCase().endsWith(".html");if(p&&String(e??"").toLowerCase().endsWith(".md")){try{if(typeof ke=="string"&&ke){const g=`${r}/${ke}`,y=await o(g);if(y.ok)return{raw:await y.text(),status:404}}}catch(g){de("[slugManager] fetching fallback 404 failed",g)}throw ef()&&Fr("fetchMarkdown: server returned HTML for .md request",i),new Error("failed to fetch md")}return m?{raw:f,isHtml:!0}:{raw:f}})();Dt.set(i,s);let l=null,c=s;try{if(a&&typeof a=="object"){const u=new Promise((f,d)=>{try{if(a.aborted){const p=new Error("aborted");return p.name="AbortError",d(p)}}catch{}l=()=>{const p=new Error("aborted");p.name="AbortError";try{a.removeEventListener&&a.removeEventListener("abort",l)}catch{}d(p)};try{a.addEventListener&&a.addEventListener("abort",l)}catch{}});c=Promise.race([s,u])}}catch{}return c.finally(()=>{try{l&&a&&typeof a.removeEventListener=="function"&&a.removeEventListener("abort",l)}catch{}}).catch(u=>{if(u&&(u.name==="AbortError"||u.code==="EABORT"||u.code==="EDEADLINE")){try{Dt.delete(i)}catch{}throw u}try{Mn.set(i,Date.now()+ac)}catch{}try{Dt.delete(i)}catch{}throw u})};function df(e){typeof e=="function"&&(Xe=e)}var Hi=new Map;function pf(e){if(!e||typeof e!="string")return"";let t=e.replace(/```[\s\S]*?```/g,"");return t=t.replace(/<pre[\s\S]*?<\/pre>/gi,""),t=t.replace(/<code[\s\S]*?<\/code>/gi,""),t=t.replace(/<!--([\s\S]*?)-->/g,""),t=t.replace(/^ {4,}.*$/gm,""),t=t.replace(/`[^`]*`/g,""),t}var le=[];function mf(){return le}try{if(typeof window<"u")try{Object.defineProperty(window,"__nimbiSearchIndex",{get(){return le},enumerable:!0,configurable:!0})}catch{try{window.__nimbiSearchIndex=le}catch{}}}catch{}try{if(typeof window<"u")try{Object.defineProperty(window,"__nimbiIndexReady",{get(){return os},enumerable:!0,configurable:!0})}catch{try{window.__nimbiIndexReady=os}catch{}}}catch{}var Sn=null;async function Vn(e,t=1,n=void 0,r=void 0){const i=Array.isArray(n)?Array.from(new Set((n||[]).map(a=>se(String(a??""))))):[];try{const a=se(String(ke??""));a&&!i.includes(a)&&i.push(a)}catch{}if(le&&le.length&&t===1&&!le.some(a=>{try{return i.includes(se(String(a.path??"")))}catch{return!1}}))return le;if(Sn)return Sn;Sn=(async()=>{let a=Array.isArray(n)?Array.from(new Set((n||[]).map(h=>se(String(h??""))))):[],o=new Set(a);try{const h=se(String(ke??""));h&&!o.has(h)&&(o.add(h),a.push(h))}catch{}const s=h=>{if(!o||o.size===0)return!1;for(const _ of o)if(_&&(h===_||h.startsWith(_+"/")))return!0;return!1};let l=[];try{if(Array.isArray(r)&&r.length)for(const h of r)try{const _=se(String(h??""));_&&l.push(_)}catch{}}catch{}if(Array.isArray(ht)&&ht.length){const h=new Set(l);for(const _ of ht)h.has(_)||(l.push(_),h.add(_))}if(!l.length){if(_e&&typeof _e.size=="number"&&_e.size)try{l=Array.from(_e.keys())}catch{l=[]}else for(const h of ie.values())if(h){if(typeof h=="string")l.push(h);else if(h&&typeof h=="object"){h.default&&l.push(h.default);const _=h.langs||{};for(const w of Object.keys(_||{}))try{_[w]&&l.push(_[w])}catch{}}}}try{const h=await dc(e);h&&h.length&&(l=l.concat(h))}catch(h){de("[slugManager] crawlAllMarkdown during buildSearchIndex failed",h)}try{const h=new Set(l),_=[...l],w=Math.max(1,Math.min(Vr(),_.length||Vr()));let b=0;const x=async()=>{for(;!(h.size>fi);){const D=_.shift();if(!D)break;try{const B=await Xe(D,e);if(B&&B.raw){if(B.status===404)continue;let j=B.raw;const re=[],ae=String(D??"").replace(/^.*\//,"");if(/^readme(?:\.md)?$/i.test(ae)&&Ds&&(!D||!D.includes("/")))continue;const J=pf(j),R=/\[[^\]]+\]\(([^)]+)\)/g;let N;for(;N=R.exec(J);)re.push(N[1]);const M=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;N=M.exec(J);)re.push(N[1]);const A=D&&D.includes("/")?D.substring(0,D.lastIndexOf("/")+1):"";for(let O of re)try{if(hi(O,e)||O.startsWith("..")||O.indexOf("/../")!==-1||(A&&!O.startsWith("./")&&!O.startsWith("/")&&!O.startsWith("../")&&(O=A+O),O=se(O),!O||O.startsWith("#")||O.startsWith("?")))continue;if(!/\.(md|html?)(?:$|[?#])/i.test(O)){const H=O.split(/[?#]/)[0].replace(/\/+$/,""),L=String(H).split("/").pop()||"";if(/\.[^./]+$/i.test(L))continue;const Q=[`${H}.md`,`${H}.html`,`${H}/README.md`,`${H}/README.html`];for(const ee of Q)!ee||s(ee)||h.has(ee)||(h.add(ee),_.push(ee),l.push(ee));continue}if(O=O.split(/[?#]/)[0],s(O))continue;h.has(O)||(h.add(O),_.push(O),l.push(O))}catch(H){de("[slugManager] href processing failed",O,H)}}}catch(B){de("[slugManager] discovery fetch failed for",D,B)}try{b++,await xn(b,32)}catch{}}},z=[];for(let D=0;D<w;D++)z.push(x());await Promise.all(z)}catch(h){de("[slugManager] discovery loop failed",h)}const c=new Set;l=l.filter(h=>!h||c.has(h)||s(h)?!1:(c.add(h),!0));const u=[],f=new Map,d=l.filter(h=>/\.(?:md|html?)(?:$|[?#])/i.test(h)),p=Math.max(1,Math.min(Vr(),d.length||1)),m=d.slice(),g=[];for(let h=0;h<p;h++)g.push((async()=>{for(;m.length;){const _=m.shift();if(!_)break;try{const w=await Xe(_,e);f.set(_,w)}catch(w){de("[slugManager] buildSearchIndex: entry fetch failed",_,w),f.set(_,null)}}})());await Promise.all(g);let y=0;for(const h of l){try{y++,await xn(y,16)}catch{}if(/\.(?:md|html?)(?:$|[?#])/i.test(h))try{const _=f.get(h);if(!_||!_.raw||_.status===404)continue;let w="",b="",x=null,z=null;if(_.isHtml)try{const B=at(),j=B?B.parseFromString(_.raw,"text/html"):null,re=j?j.querySelector("title")||j.querySelector("h1"):null;re&&re.textContent&&(w=re.textContent.trim());const ae=j?j.querySelector("p"):null;if(ae&&ae.textContent&&(b=ae.textContent.trim()),t>=2)try{const J=j?j.querySelector("h1"):null,R=J&&J.textContent?J.textContent.trim():w||"";try{const M=_e?.has?.(h)?_e?.get?.(h):null;if(M)x=M;else{let A=be(w||h);const O=new Set;try{for(const L of ie.keys())O.add(L)}catch{}try{for(const L of u)L&&L.slug&&O.add(String(L.slug).split("::")[0])}catch{}let H=!1;try{if(ie.has(A)){const L=ie.get(A);if(typeof L=="string")L===h&&(H=!0);else if(L&&typeof L=="object"){L.default===h&&(H=!0);for(const Q of Object.keys(L.langs||{}))if(L.langs[Q]===h){H=!0;break}}}}catch{}!H&&O.has(A)&&(A=Tn(A,O)),x=A;try{_e?.has?.(h)||vt(x,h)}catch{}}}catch(M){de("[slugManager] derive pageSlug failed",M)}const N=Array.from(j.querySelectorAll("h2"));for(const M of N)try{const A=(M.textContent||"").trim();if(!A)continue;const O=M.id?M.id:be(A),H=x?`${x}::${O}`:`${be(h)}::${O}`;let L="",Q=M.nextElementSibling;for(;Q&&Q.tagName&&Q.tagName.toLowerCase()==="script";)Q=Q.nextElementSibling;Q&&Q.textContent&&(L=String(Q.textContent).trim()),u.push({slug:H,title:A,excerpt:L,path:h,parentTitle:R})}catch(A){de("[slugManager] indexing H2 failed",A)}if(t===3)try{const M=Array.from(j.querySelectorAll("h3"));for(const A of M)try{const O=(A.textContent||"").trim();if(!O)continue;const H=A.id?A.id:be(O),L=x?`${x}::${H}`:`${be(h)}::${H}`;let Q="",ee=A.nextElementSibling;for(;ee&&ee.tagName&&ee.tagName.toLowerCase()==="script";)ee=ee.nextElementSibling;ee&&ee.textContent&&(Q=String(ee.textContent).trim()),u.push({slug:L,title:O,excerpt:Q,path:h,parentTitle:R})}catch(O){de("[slugManager] indexing H3 failed",O)}}catch(M){de("[slugManager] collect H3s failed",M)}}catch(J){de("[slugManager] collect H2s failed",J)}}catch(B){de("[slugManager] parsing HTML for index failed",B)}else{const B=_.raw,j=B.match(/^#\s+(.+)$/m);w=j?j[1].trim():"";try{w=qi(w)}catch{}const re=B.split(/\r?\n\s*\r?\n/);if(re.length>1)for(let ae=1;ae<re.length;ae++){const J=re[ae].trim();if(J&&!/^#/.test(J)){b=J.replace(/\r?\n/g," ");break}}try{const{data:ae}=ur(B),J=ae.image||ae.og_image||ae.cover||ae.featured_image;J&&String(J).trim()&&(z=String(J).trim())}catch{}if(t>=2){let ae="";try{const J=(B.match(/^#\s+(.+)$/m)||[])[1];ae=J?J.trim():"";try{const M=_e?.has?.(h)?_e?.get?.(h):null;if(M)x=M;else{let A=be(w||h);const O=new Set;try{for(const L of ie.keys())O.add(L)}catch{}try{for(const L of u)L&&L.slug&&O.add(String(L.slug).split("::")[0])}catch{}let H=!1;try{if(ie.has(A)){const L=ie.get(A);if(typeof L=="string")L===h&&(H=!0);else if(L&&typeof L=="object"){L.default===h&&(H=!0);for(const Q of Object.keys(L.langs||{}))if(L.langs[Q]===h){H=!0;break}}}}catch{}!H&&O.has(A)&&(A=Tn(A,O)),x=A;try{_e?.has?.(h)||vt(x,h)}catch{}}}catch(M){de("[slugManager] derive pageSlug failed",M)}const R=/^##\s+(.+)$/gm;let N;for(;N=R.exec(B);)try{const M=(N[1]||"").trim(),A=qi(M);if(!M)continue;const O=be(M),H=x?`${x}::${O}`:`${be(h)}::${O}`,L=B.slice(R.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),Q=L&&L[1]?String(L[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";u.push({slug:H,title:A,excerpt:Q,path:h,parentTitle:ae})}catch(M){de("[slugManager] indexing markdown H2 failed",M)}}catch(J){de("[slugManager] collect markdown H2s failed",J)}if(t===3)try{const J=/^###\s+(.+)$/gm;let R;for(;R=J.exec(B);)try{const N=(R[1]||"").trim(),M=qi(N);if(!N)continue;const A=be(N),O=x?`${x}::${A}`:`${be(h)}::${A}`,H=B.slice(J.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),L=H&&H[1]?String(H[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";u.push({slug:O,title:M,excerpt:L,path:h,parentTitle:ae})}catch(N){de("[slugManager] indexing markdown H3 failed",N)}}catch(J){de("[slugManager] collect markdown H3s failed",J)}}}let D="";try{_e?.has?.(h)&&(D=_e?.get?.(h))}catch(B){de("[slugManager] mdToSlug access failed",B)}if(!D){try{if(!x){const B=_e?.has?.(h)?_e?.get?.(h):null;if(B)x=B;else{let j=be(w||h);const re=new Set;try{for(const J of ie.keys())re.add(J)}catch{}try{for(const J of u)J&&J.slug&&re.add(String(J.slug).split("::")[0])}catch{}let ae=!1;try{if(ie.has(j)){const J=ie.get(j);if(typeof J=="string")J===h&&(ae=!0);else if(J&&typeof J=="object"){J.default===h&&(ae=!0);for(const R of Object.keys(J.langs||{}))if(J.langs[R]===h){ae=!0;break}}}}catch{}!ae&&re.has(j)&&(j=Tn(j,re)),x=j;try{_e?.has?.(h)||vt(x,h)}catch{}}}}catch(B){de("[slugManager] derive pageSlug failed",B)}D=x||be(w||h)}u.push({slug:D,title:w,excerpt:b,path:h,image:z})}catch(_){de("[slugManager] buildSearchIndex: entry processing failed",_)}}try{const h=u.filter(_=>{try{return!s(String(_.path??""))}catch{return!0}});try{Array.isArray(le)||(le=[]),le.length=0;for(const _ of h)le.push(_)}catch{try{le=Array.from(h)}catch{le=h}}try{if(typeof window<"u"){try{window.__nimbiResolvedIndex=le}catch{}try{const _=[],w=new Set;for(const b of le)try{if(!b||!b.slug)continue;const x=String(b.slug).split("::")[0];if(w.has(x))continue;w.add(x);const z={slug:x};b.title?z.title=String(b.title):b.parentTitle&&(z.title=String(b.parentTitle)),b.path&&(z.path=String(b.path)),_.push(z)}catch{}try{window.__nimbiSitemapJson={generatedAt:new Date().toISOString(),entries:_}}catch{}try{window.__nimbiSitemapFinal=_}catch{}}catch{}}}catch{}}catch(h){de("[slugManager] filtering index by excludes failed",h);try{Array.isArray(le)||(le=[]),le.length=0;for(const _ of u)le.push(_)}catch{try{le=Array.from(u)}catch{le=u}}try{if(typeof window<"u")try{window.__nimbiResolvedIndex=le}catch{}}catch{}}return le})();try{await Sn}catch(a){de("[slugManager] awaiting _indexPromise failed",a)}return Sn=null,le}async function An(e={}){try{const t=typeof e.timeoutMs=="number"?e.timeoutMs:8e3,n=e.contentBase,r=typeof e.indexDepth=="number"?e.indexDepth:1,i=Array.isArray(e.noIndexing)?e.noIndexing:void 0,a=Array.isArray(e.seedPaths)?e.seedPaths:void 0,o=typeof e.startBuild=="boolean"?e.startBuild:!0;if(Array.isArray(le)&&le.length&&!Sn&&!o)return le;if(Sn){try{await Sn}catch{}return le}if(o){try{if(typeof is=="function")try{const l=await is(n,r,i,a);if(Array.isArray(l)&&l.length){try{Hr(l)}catch{}return le}}catch{}}catch{}try{return await Vn(n,r,i,a),le}catch{}}const s=Date.now();for(;Date.now()-s<t;){if(Array.isArray(le)&&le.length)return le;await new Promise(l=>setTimeout(l,150))}return le}catch{return le}}async function os(e={}){try{const t=Object.assign({},e);typeof t.startBuild!="boolean"&&(t.startBuild=!0),typeof t.timeoutMs!="number"&&(t.timeoutMs=1/0);try{return await An(t)}catch{return le}}catch{return le}}var lc=1e3,fi=lc;function cc(e){typeof e=="number"&&e>=0&&(fi=e)}var uc=at(),hc="a[href]",fc=async function(e,t,n=fi){if(Hi.has(e))return Hi.get(e);let r=null;const i=new Set,a=[""],o=typeof location<"u"&&location.origin?location.origin:"http://localhost";let s=o+"/";try{t&&(/^[a-z][a-z0-9+.-]*:/i.test(String(t))?s=String(t).replace(/\/$/,"")+"/":String(t).startsWith("/")?s=o+String(t).replace(/\/$/,"")+"/":s=o+"/"+String(t).replace(/\/$/,"")+"/")}catch{s=o+"/"}const l=Math.max(1,Math.min(ya,6));for(;a.length&&!r&&!(a.length>n);)await Kl(a.splice(0,l),async c=>{if(c==null||i.has(c))return;i.add(c);let u="";try{u=new URL(c||"",s).toString()}catch{u=(String(t??"")||o)+"/"+String(c??"").replace(/^\//,"")}try{let f;try{f=await globalThis.fetch(u)}catch(y){de("[slugManager] crawlForSlug: fetch failed",{url:u,error:y});return}if(!f||!f.ok){f&&!f.ok&&de("[slugManager] crawlForSlug: directory fetch non-ok",{url:u,status:f.status});return}const d=await f.text(),p=uc.parseFromString(d,"text/html");let m=[];try{p&&typeof p.getElementsByTagName=="function"?m=p.getElementsByTagName("a"):p&&typeof p.querySelectorAll=="function"?m=p.querySelectorAll(hc):m=[]}catch{try{m=p.getElementsByTagName?p.getElementsByTagName("a"):[]}catch{m=[]}}const g=u;for(const y of m)try{if(r)break;let h=y.getAttribute("href")||"";if(!h||hi(h,t)||h.startsWith("..")||h.indexOf("/../")!==-1)continue;if(h.endsWith("/")){try{const _=new URL(h,g),w=new URL(s).pathname,b=_.pathname.startsWith(w)?_.pathname.slice(w.length):_.pathname.replace(/^\//,""),x=Rn(se(b));i.has(x)||a.push(x)}catch{const w=se(c+h);i.has(w)||a.push(w)}continue}if(h.toLowerCase().endsWith(".md")){let _="";try{const w=new URL(h,g),b=new URL(s).pathname;_=w.pathname.startsWith(b)?w.pathname.slice(b.length):w.pathname.replace(/^\//,"")}catch{_=(c+h).replace(/^\//,"")}_=se(_);try{if(_e?.has?.(_))continue;for(const w of ie.values());}catch(w){de("[slugManager] slug map access failed",w)}try{const w=await Xe(_,t);if(w&&w.raw){const b=(w.raw||"").match(/^#\s+(.+)$/m);if(b&&b[1]&&be(b[1].trim())===e){r=_;break}}}catch(w){de("[slugManager] crawlForSlug: fetchMarkdown failed",w)}}}catch(h){de("[slugManager] crawlForSlug: link iteration failed",h)}}catch(f){de("[slugManager] crawlForSlug: directory fetch failed",f)}},l);return Hi.set(e,r),r};async function dc(e,t=fi){const n=new Set,r=new Set,i=[""],a=typeof location<"u"&&location.origin?location.origin:"http://localhost";let o=a+"/";try{e&&(/^[a-z][a-z0-9+.-]*:/i.test(String(e))?o=String(e).replace(/\/$/,"")+"/":String(e).startsWith("/")?o=a+String(e).replace(/\/$/,"")+"/":o=a+"/"+String(e).replace(/\/$/,"")+"/")}catch{o=a+"/"}const s=Math.max(1,Math.min(ya,6));for(;i.length&&!(i.length>t);)await Kl(i.splice(0,s),async l=>{if(l==null||r.has(l))return;r.add(l);let c="";try{c=new URL(l||"",o).toString()}catch{c=(String(e??"")||a)+"/"+String(l??"").replace(/^\//,"")}try{let u;try{u=await globalThis.fetch(c)}catch(g){de("[slugManager] crawlAllMarkdown: fetch failed",{url:c,error:g});return}if(!u||!u.ok){u&&!u.ok&&de("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:c,status:u.status});return}const f=await u.text(),d=uc.parseFromString(f,"text/html");let p=[];try{d&&typeof d.getElementsByTagName=="function"?p=d.getElementsByTagName("a"):d&&typeof d.querySelectorAll=="function"?p=d.querySelectorAll(hc):p=[]}catch{try{p=d.getElementsByTagName?d.getElementsByTagName("a"):[]}catch{p=[]}}const m=c;for(const g of p)try{let y=g.getAttribute("href")||"";if(!y||hi(y,e)||y.startsWith("..")||y.indexOf("/../")!==-1)continue;if(y.endsWith("/")){try{const _=new URL(y,m),w=new URL(o).pathname,b=_.pathname.startsWith(w)?_.pathname.slice(w.length):_.pathname.replace(/^\//,""),x=Rn(se(b));r.has(x)||i.push(x)}catch{const w=l+y;r.has(w)||i.push(w)}continue}let h="";try{const _=new URL(y,m),w=new URL(o).pathname;h=_.pathname.startsWith(w)?_.pathname.slice(w.length):_.pathname.replace(/^\//,"")}catch{h=(l+y).replace(/^\//,"")}if(h=se(h),/\.(md|html?)$/i.test(h))n.add(h);else{const _=h.split(/[?#]/)[0].replace(/\/+$/,""),w=String(_).split("/").pop()||"";if(/\.[^./]+$/i.test(w))continue;_&&(n.add(`${_}.md`),n.add(`${_}.html`),n.add(`${_}/README.md`),n.add(`${_}/README.html`))}}catch(y){de("[slugManager] crawlAllMarkdown: link iteration failed",y)}}catch(u){de("[slugManager] crawlAllMarkdown: directory fetch failed",u)}},s);return Array.from(n)}async function pc(e,t,n){if(e&&typeof e=="string"&&(e=se(e),e=Zn(e)),ie.has(e))return dr(e)||ie.get(e);try{if(!(typeof ke=="string"&&ke||ie.has(e)||Qe&&Qe.size||Fi()||typeof t=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(t)))return null}catch{}for(const i of wa)try{const a=await i(e,t);if(a)return vt(e,a),a}catch(a){de("[slugManager] slug resolver failed",a)}if(Qe&&Qe.size){for(const i of ht)try{const a=String(i??"").replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(a&&be(a)===e)return vt(e,i),i}catch(a){de("[slugManager] filename fast-path match failed",a)}if(Gr.has(e)){const i=Gr.get(e);return vt(e,i),i}for(const i of ht)if(!ra.has(i))try{const a=await Xe(i,t);if(a&&a.raw){const o=(a.raw||"").match(/^#\s+(.+)$/m);if(o&&o[1]){const s=be(o[1].trim());if(ra.add(i),s&&Gr.set(s,i),s===e)return vt(e,i),i}}}catch(a){de("[slugManager] manifest title fetch failed",a)}try{Do++,await xn(Do,8)}catch{}}const r=[`${e}.html`,`${e}.md`];for(const i of r)try{const a=await Xe(i,t);if(a&&a.raw)return vt(e,i),i}catch(a){de("[slugManager] candidate fetch failed",a)}try{const i=await Vn(t);if(i&&i.length){const a=i.find(o=>o.slug===e);if(a)return vt(e,a.path),a.path}}catch(i){de("[slugManager] buildSearchIndex lookup failed",i)}try{const i=await fc(e,t,n);if(i)return vt(e,i),i}catch(i){de("[slugManager] crawlForSlug lookup failed",i)}if(Qe&&Qe.size)for(const i of ht)try{const a=i.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(be(a)===e)return vt(e,i),i}catch(a){de("[slugManager] build-time filename match failed",a)}try{if(At&&typeof At=="string"&&At.trim())try{const i=await Xe(At,t);if(i&&i.raw){const a=(i.raw||"").match(/^#\s+(.+)$/m);if(a&&a[1]&&be(a[1].trim())===e)return vt(e,At),At}}catch(i){de("[slugManager] home page fetch failed",i)}}catch(i){de("[slugManager] home page fetch failed",i)}return null}var gf=El(((e,t)=>{function n(s,l){return l.some(([c,u])=>c<=s&&s<=u)}function r(s){return typeof s!="string"?!1:n(s.charCodeAt(0),[[12352,12447],[19968,40959],[44032,55203],[131072,191456]])}function i(s){return` 
\r	`.includes(s)}function a(s){return typeof s!="string"?!1:n(s.charCodeAt(0),[[33,47],[58,64],[91,96],[123,126],[12288,12351],[65280,65519]])}function o(s,l={}){let c=0,u=0,f=s.length-1;const d=l.wordsPerMinute||200,p=l.wordBound||i;for(;p(s[u]);)u++;for(;p(s[f]);)f--;const m=`${s}
`;for(let h=u;h<=f;h++)if((r(m[h])||!p(m[h])&&(p(m[h+1])||r(m[h+1])))&&c++,r(m[h]))for(;h<=f&&(a(m[h+1])||p(m[h+1]));)h++;const g=c/d,y=Math.round(g*60*1e3);return{text:Math.ceil(g.toFixed(2))+" min read",minutes:g,time:y,words:c}}t.exports=o})),yf=Al(gf(),1),zr=new Map,_f=200;function wf(e){const t=String(e??"");let n=0;for(let r=0;r<t.length;r++){const i=t.charCodeAt(r);n=(n<<5)-n+i|0}return`${t.length}:${n}`}function bf(e,t){if(zr.set(e,new WeakRef(t)),zr.size>_f){const n=zr.keys().next().value;n&&zr.delete(n)}}function vf(e){try{return e.deref()}catch{return}}function kf(e){return e?String(e).trim().split(/\s+/).filter(Boolean).length:0}function xf(e){const t=wf(e),n=vf(zr.get(t));if(n)return Object.assign({},n);const r=(0,yf.default)(e||""),i={readingTime:r,wordCount:typeof r.words=="number"?r.words:kf(e)};return bf(t,i),Object.assign({},i)}function ti(e,t){const n=typeof CSS<"u"&&CSS.escape?CSS.escape(String(e)):String(e);let r=document.querySelector(`meta[name="${n}"]`);r||(r=document.createElement("meta"),r.setAttribute("name",e),document.head.appendChild(r)),r.setAttribute("content",t)}function Sf(){try{if(typeof document>"u"||!document.head)return;try{if(!document.querySelector("meta[charset]")){const e=document.createElement("meta");e.setAttribute("charset","utf-8"),document.head.prepend(e)}}catch{}try{if(!document.querySelector('meta[name="viewport"]')){const e=document.createElement("meta");e.setAttribute("name","viewport"),e.setAttribute("content","width=device-width, initial-scale=1"),document.head.appendChild(e)}}catch{}}catch{}}function gt(e,t,n){let r=`meta[${e}="${typeof CSS<"u"&&CSS.escape?CSS.escape(String(t)):String(t)}"]`,i=document.querySelector(r);i||(i=document.createElement("meta"),i.setAttribute(e,t),document.head.appendChild(i)),i.setAttribute("content",n)}function mc(e,t){try{if(!e)return;const n=typeof CSS<"u"&&CSS.escape?CSS.escape(String(e)):String(e);let r=document.querySelector(`link[rel="${n}"]`);r||(r=document.createElement("link"),r.setAttribute("rel",e),document.head.appendChild(r)),r.setAttribute("href",t)}catch(n){k("[seoManager] upsertLinkRel failed",n)}}function gc(e){try{if(typeof document>"u"||!document.head)return;const t=Bs();if(!Array.isArray(t)||t.length===0)return;try{const n=typeof location<"u"&&location?.origin?location.origin+location.pathname.split("?")[0]:"";if(!n)return;const r=e||"",i=r?`${n}?page=${encodeURIComponent(r)}`:n;try{document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(a=>a.remove())}catch{}for(const a of t)try{const o=`${i}&lang=${encodeURIComponent(String(a))}`,s=document.createElement("link");s.setAttribute("rel","alternate"),s.setAttribute("hreflang",String(a)),s.setAttribute("href",o),document.head.appendChild(s)}catch{}try{const a=document.createElement("link");a.setAttribute("rel","alternate"),a.setAttribute("hreflang","x-default"),a.setAttribute("href",i),document.head.appendChild(a)}catch{}}catch(n){k("[seoManager] setHreflangTags failed",n)}}catch(t){k("[seoManager] setHreflangTags failed",t)}}function Ef(e,t,n,r,i){gt("property","og:title",t&&String(t).trim()?t:e.title||document.title);const a=r&&String(r).trim()?r:e.description||"";a&&String(a).trim()&&gt("property","og:description",a),a&&String(a).trim()&&gt("name","twitter:description",a),gt("name","twitter:card",e.twitter_card||"summary_large_image");const o=n||e.image;o&&(gt("property","og:image",o),gt("name","twitter:image",o),e.image_width&&gt("property","og:image:width",String(e.image_width)),e.image_height&&gt("property","og:image:height",String(e.image_height))),gt("property","og:type",i||e.og_type||(e.type==="Article"?"article":"website"));try{const s=typeof navigator<"u"&&(navigator.language||navigator.languages?.[0])||"en";gt("property","og:locale",String(s).replace("-","_").toLowerCase());const l=Bs();if(Array.isArray(l)&&l.length>0)for(const c of l)try{gt("property","og:locale:alternate",String(c).replace("-","_").toLowerCase())}catch{}}catch{}if(e.date)try{const s=new Date(e.date);isNaN(s.getTime())||gt("property","article:published_time",s.toISOString())}catch{}if(e.dateModified)try{const s=new Date(e.dateModified);isNaN(s.getTime())||gt("property","article:modified_time",s.toISOString())}catch{}e.twitter_site&&gt("name","twitter:site",String(e.twitter_site)),e.twitter_creator&&gt("name","twitter:creator",String(e.twitter_creator))}function Fs(e,t,n,r,i=""){const a=e.meta||{},o=document?.querySelector&&document.querySelector('meta[name="description"]')?.getAttribute("content")||"",s=r&&String(r).trim()?r:a.description&&String(a.description).trim()?a.description:o&&String(o).trim()?o:"";s&&String(s).trim()&&ti("description",s),ti("robots",a.robots||"index,follow"),Ef(a,t,n,s,a.type),gc(e.slug||e.meta?.slug||"")}function yc(){try{for(const e of['meta[name="site"]','meta[name="site-name"]','meta[name="siteName"]','meta[property="og:site_name"]','meta[name="twitter:site"]']){const t=document.querySelector(e);if(t){const n=t.getAttribute("content")||"";if(n?.trim())return n.trim()}}}catch(e){k("[seoManager] getSiteNameFromMeta failed",e)}return""}function Ws(e,t,n,r,i,a=""){try{let d=function(_){try{const w=se(_);try{return(location.origin+location.pathname).split("?")[0]+"?page="+encodeURIComponent(w)}catch{return location.href.split("#")[0]}}catch{return location.href.split("#")[0]}},m=function(_,w){try{const b=String(w?.type||"").trim();if(b)return b;const x=String(_||"").replace(/^\/+|\/+$/g,"").toLowerCase();if(!x||x==="index"||x==="home")return"WebPage";const z=x.split("/"),D=z[0]||"",B=z[z.length-1]||"",j={about:"AboutPage",contact:"ContactPage",blog:"Blog",posts:"Blog",article:"Article",articles:"Article",news:"NewsArticle",product:"Product",products:"Product",event:"Event",events:"Event",person:"ProfilePage",people:"ProfilePage",author:"ProfilePage",authors:"ProfilePage",search:"SearchResultsPage",faq:"FAQPage",faqs:"FAQPage",help:"WebPage",support:"WebPage",docs:"TechArticle",documentation:"TechArticle",tutorial:"TechArticle",howto:"HowTo","how-to":"HowTo",recipe:"Recipe",recipes:"Recipe",review:"Review",reviews:"Review",video:"VideoObject",videos:"VideoObject",audio:"AudioObject",podcast:"PodcastEpisode"};return z.length===1&&j[D]?j[D]:j[B]?j[B]:"Article"}catch{return"Article"}};var o=d,s=m;const l=e.meta||{},c=n&&String(n).trim()?n:l.title||a||document.title,u=i&&String(i).trim()?i:l.description||document.querySelector('meta[name="description"]')?.getAttribute("content")||"",f=r||l.image||null,p=d(t);p&&mc("canonical",p);try{gt("property","og:url",p)}catch(_){k("[seoManager] upsertMeta og:url failed",_)}const g={"@context":"https://schema.org","@type":m(t,l),headline:c||"",description:u||"",url:p||location.href.split("#")[0]};f&&(g.image=String(f)),l.date&&(g.datePublished=l.date),l.dateModified&&(g.dateModified=l.dateModified),l.author&&(g.author={"@type":"Person",name:String(l.author)});try{let _="";l.publisher&&(_=typeof l.publisher=="string"?String(l.publisher).trim():l.publisher?.name?String(l.publisher.name).trim():""),_||(_=yc()),_&&(g.publisher={"@type":"Organization",name:_})}catch{}p&&(g.mainEntityOfPage={"@type":"WebPage","@id":p});const y="nimbi-jsonld";let h=document.getElementById(y);h||(h=document.createElement("script"),h.type="application/ld+json",h.id=y,Cs(h),document.head.appendChild(h)),h.textContent=JSON.stringify(g,null,2).replace(/<\/script>/gi,"<\\/script>")}catch(l){k("[seoManager] setStructuredData failed",l)}}var ia=typeof window<"u"&&window.__SEO_MAP?window.__SEO_MAP:{};function Af(e){try{if(!e||typeof e!="object"){ia={};return}ia=Object.assign({},e)}catch(t){k("[seoManager] setSeoMap failed",t)}}function Tf(e,t=""){try{if(!e)return;const n=ia?.[e]?ia[e]:typeof window<"u"&&window.__SEO_MAP?.[e]?window.__SEO_MAP[e]:null;try{const r=location.origin+location.pathname+"?page="+encodeURIComponent(String(e??""));mc("canonical",r);try{gt("property","og:url",r)}catch{}}catch{}if(!n)return;try{n.title&&(document.title=String(n.title))}catch{}try{n.description&&ti("description",String(n.description))}catch{}try{try{Fs({meta:n,slug:e},n.title||void 0,n.image||void 0,n.description||void 0,t)}catch{}}catch{}try{gc(e)}catch{}try{Ws({meta:n},e,n.title||void 0,n.image||void 0,n.description||void 0,t)}catch(r){k("[seoManager] inject structured data failed",r)}}catch(n){k("[seoManager] injectSeoForPage failed",n)}}function Gi(e={},t="",n=void 0,r=void 0){try{const i=e||{},a=typeof n=="string"&&n.trim()?n:i.title||"Not Found",o=typeof r=="string"&&r.trim()?r:i.description||"";try{ti("robots","noindex,follow")}catch{}try{o&&String(o).trim()&&ti("description",String(o))}catch{}try{Fs({meta:Object.assign({},i,{robots:"noindex,follow"})},a,i.image||void 0,o)}catch{}try{Ws({meta:Object.assign({},i,{title:a,description:o})},t||"",a,i.image||void 0,o)}catch{}}catch(i){k("[seoManager] markNotFound failed",i)}}function Mf(e,t,n,r,i,a,o,s,l,c,u){try{if(r?.querySelector){const f=r.querySelector(".menu-label");f&&(f.textContent=s?.textContent||e("onThisPage"))}}catch(f){k("[seoManager] update toc label failed",f)}try{const f=n.meta?.title?String(n.meta.title).trim():"",d=i?.querySelector?.("img")||null,p=d&&(d.getAttribute("src")||d.src)||null;let m="";try{let h="";try{const _=s||i?.querySelector?.("h1")||null;if(_){let w=_.nextElementSibling;const b=[];for(;w&&!(w.tagName&&w.tagName.toLowerCase()==="h2");){try{if(w.classList?.contains("nimbi-article-subtitle")){w=w.nextElementSibling;continue}}catch{}const x=(w.textContent||"").trim();x&&b.push(x),w=w.nextElementSibling}b.length&&(h=b.join(" ").replace(/\s+/g," ").trim()),!h&&l&&(h=String(l).trim())}}catch(_){k("[seoManager] compute descOverride failed",_)}h&&String(h).length>160&&(h=String(h).slice(0,157).trim()+"..."),m=h}catch(h){k("[seoManager] compute descOverride failed",h)}let g="";try{f&&(g=f)}catch{}if(!g)try{s?.textContent&&(g=String(s.textContent).trim())}catch{}if(!g)try{const h=i.querySelector("h2");h?.textContent&&(g=String(h.textContent).trim())}catch{}g||(g=a||"");try{Fs(n,g||void 0,p,m)}catch(h){k("[seoManager] setMetaTags failed",h)}try{Ws(n,c,g||void 0,p,m,t)}catch(h){k("[seoManager] setStructuredData failed",h)}const y=yc();g?y?document.title=`${y} - ${g}`:document.title=`${t||"Site"} - ${g}`:f?document.title=f:document.title=t||document.title}catch(f){k("[seoManager] applyPageMeta failed",f)}try{try{i.querySelectorAll(".nimbi-reading-time")?.forEach(f=>f.remove())}catch{}if(l){const f=xf(u?.raw||""),d=f?.readingTime?f.readingTime:null,p=typeof d?.minutes=="number"?Math.ceil(d.minutes):0,m=p?e("readingTime",{minutes:p}):"";if(!m)return;const g=i.querySelector("h1");if(g){const y=i.querySelector(".nimbi-article-subtitle");try{if(y){const h=document.createElement("span");h.className="nimbi-reading-time",h.textContent=m,y.appendChild(h)}else{const h=document.createElement("p");h.className="nimbi-article-subtitle is-6 has-text-grey-light";const _=document.createElement("span");_.className="nimbi-reading-time",_.textContent=m,h.appendChild(_);try{g.parentElement.insertBefore(h,g.nextSibling)}catch{try{g.insertAdjacentElement("afterend",h)}catch{}}}}catch{try{const _=document.createElement("p");_.className="nimbi-article-subtitle is-6 has-text-grey-light";const w=document.createElement("span");w.className="nimbi-reading-time",w.textContent=m,_.appendChild(w),g.insertAdjacentElement("afterend",_)}catch{}}}}}catch(f){k("[seoManager] reading time update failed",f)}}var aa=100;function Bo(e){aa=e,bc()}function Pt(){try{if(Cl(2))return!0}catch{}try{return!1}catch{return!1}}var Ut=3e5,Cf=6e4,Mr=null,Cr=null;function It(e,t,n){try{if(typeof Xe=="function"&&typeof Xe.length=="number"&&Xe.length>=3)return Xe(e,t,{signal:n})}catch{}return Xe(e,t)}function Uo(e){Ut=e;try{qt.defaultTTL=Ut>0?Ut:1/0}catch{}_c()}function _c(){try{Mr!==null&&(clearInterval(Mr),Mr=null)}catch{}if(Ut>0)try{Mr=setInterval(Pf,Cf)}catch{Mr=null}}var qt=new oi({maxEntries:aa,defaultTTL:Ut>0?Ut:1/0});_c();function wc(e){return!!e&&typeof e=="object"&&Object.prototype.hasOwnProperty.call(e,"value")&&Object.prototype.hasOwnProperty.call(e,"ts")}function bc(){try{qt.maxEntries=aa}catch{}for(;qt.size>aa;){const e=qt.keys("LRU").next().value;if(e===void 0)break;qt.delete(e)}}function Rf(e){const t=qt.get(e);if(t!==void 0){if(wc(t)){const n=Date.now();if(Ut>0&&t.ts+Ut<n){qt.delete(e);return}return t.value}return t}}function Lf(e,t){qt.set(e,t,{ttl:Ut>0?Ut:1/0}),bc()}function Pf(){if(!Ut||Ut<=0)return;const e=Date.now(),t=Array.from(qt.keys("LRU"));for(const n of t){qt.has(n);const r=qt.peek(n);wc(r)&&r.ts+Ut<e&&qt.delete(n)}}async function Nf(e,t,n){const r=new Set(kt);let i=[];try{if(typeof document<"u"&&document.getElementsByClassName){const a=o=>{const s=document.getElementsByClassName(o);for(let l=0;l<s.length;l++){const c=s[l].getElementsByTagName("a");for(let u=0;u<c.length;u++)i.push(c[u])}};a("nimbi-site-navbar"),a("navbar"),a("nimbi-nav")}else i=Array.from(document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a"))}catch{try{i=Array.from(document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a"))}catch{i=[]}}for(const a of Array.from(i||[])){const o=a.getAttribute("href")||"";if(o)try{try{const d=yt(o);if(d){if(d.type==="canonical"&&d.page){const p=se(d.page);if(p){r.add(p);continue}}if(d.type==="cosmetic"&&d.page){const p=d.page;if(ie.has(p)){const m=ie.get(p);if(m)return m}continue}}}catch{}const s=new URL(o,location.href);if(s.origin!==location.origin)continue;const l=(s.hash||s.pathname).match(/([^#?]+\.md)(?:$|[?#])/)||(s.pathname||"").match(/([^#?]+\.md)(?:$|[?#])/);if(l){let d=se(l[1]);d&&r.add(d);continue}const c=(a.textContent||"").trim(),u=(s.pathname||"").replace(/^.*\//,"");if(c&&be(c)===e||u&&be(u.replace(/\.(html?|md)$/i,""))===e)return s.toString();if(/\.(html?)$/i.test(s.pathname)){let d=s.pathname.replace(/^\//,"");r.add(d);continue}const f=s.pathname||"";if(f){const d=new URL(t),p=Rn(d.pathname);if(f.indexOf(p)!==-1){let m=f.startsWith(p)?f.slice(p.length):f;m=se(m),m&&r.add(m)}}}catch(s){k("[router] malformed URL while discovering index candidates",s)}}for(const a of r)try{if(!a||!String(a).includes(".md"))continue;const o=await It(a,t,n);if(!o||!o.raw)continue;const s=(o.raw||"").match(/^#\s+(.+)$/m);if(s){const l=(s[1]||"").trim();if(l&&be(l)===e)return a}}catch(o){k("[router] fetchMarkdown during index discovery failed",o)}return null}function If(e){const t=[];if(String(e).includes(".md")||String(e).includes(".html"))/index\.html$/i.test(e)||t.push(e);else try{const n=decodeURIComponent(String(e??""));if(ie.has(n)){const r=dr(n)||ie.get(n);r&&(/\.(md|html?)$/i.test(r)?/index\.html$/i.test(r)||t.push(r):(t.push(r),t.push(r+".html")))}else{if(kt&&kt.size)for(const r of kt){const i=r.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(be(i)===n&&!/index\.html$/i.test(r)){t.push(r);break}}!t.length&&n&&!/\.(md|html?)$/i.test(n)&&(t.push(n+".html"),t.push(n+".md"))}}catch(n){k("[router] buildPageCandidates failed during slug handling",n)}return t}async function Of(e,t){const n=e||"";try{try{Ll("fetchPageData")}catch{}}catch{}try{if(Cr&&typeof Cr.abort=="function")try{Cr.abort()}catch{}}catch{}Cr=typeof AbortController<"u"?new AbortController:null;const r=Cr;let i=null;try{const h=yt(typeof location<"u"?location.href:"");h?.anchor&&(i=h.anchor)}catch{try{i=location?.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null}catch{i=null}}let a=e||"";try{(!a||String(a).trim()==="")&&typeof At=="string"&&At&&(a=String(At))}catch{}let o=null,s=null;const l=String(n??"").includes(".md")||String(n??"").includes(".html");if(a&&String(a).includes("::")){const h=String(a).split("::",2);a=h[0],o=h[1]||null}const c=`${e}|||${typeof yh<"u"&&Bt?Bt:""}`,u=Rf(c);if(u)a=u.resolved,o=u.anchor||o;else{if(!String(a).includes(".md")&&!String(a).includes(".html")){let h=decodeURIComponent(String(a??""));if(h&&typeof h=="string"&&(h=se(h),h=Zn(h)),ie.has(h))a=dr(h)||ie.get(h);else{let _=await Nf(h,t,r?r.signal:void 0);if(_)a=_;else if(Fi()&&kt&&kt.size||typeof t=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(t)){const w=await pc(h,t);w&&(a=w)}}}Lf(c,{resolved:a,anchor:o})}let f=!0;try{const h=String(a??"").includes(".md")||String(a??"").includes(".html")||a&&(a.startsWith("http://")||a.startsWith("https://")||a.startsWith("/"));f=typeof ke=="string"&&ke||ie.has(a)||kt&&kt.size||Fi()||l||h}catch{f=!0}!o&&i&&(o=i);try{if(f&&a&&(a.startsWith("http://")||a.startsWith("https://")||a.startsWith("/"))){const h=a.startsWith("/")?new URL(a,location.origin).toString():a;try{const _=await fetch(h,r?{signal:r.signal}:void 0);if(_&&_.ok){const w=await _.text(),b=typeof _?.headers?.get=="function"&&_.headers.get("content-type")||"",x=(w||"").toLowerCase();if(b&&b.indexOf&&b.indexOf("text/html")!==-1||x.indexOf("<!doctype")!==-1||x.indexOf("<html")!==-1){if(!l)try{let z=h;try{z=new URL(h).pathname.replace(/^\//,"")}catch{z=String(h??"").replace(/^\//,"")}const D=z.replace(/\.html$/i,".md");try{const B=await It(D,t,r?r.signal:void 0);if(B?.raw)return{data:B,pagePath:D,anchor:o}}catch{}if(typeof ke=="string"&&ke)try{const B=await It(ke,t,r?r.signal:void 0);if(B&&B.raw){try{Gi(B.meta||{},ke)}catch{}return{data:B,pagePath:ke,anchor:o}}}catch{}try{s=new Error("site shell detected (absolute fetch)")}catch{}}catch{}if(x.indexOf('<div id="app"')!==-1||x.indexOf("nimbi-cms")!==-1||x.indexOf("nimbi-mount")!==-1||x.indexOf("nimbi-")!==-1||x.indexOf("initcms(")!==-1||x.indexOf("window.nimbi")!==-1||/\bnimbi\b/.test(x))try{let z=h;try{z=new URL(h).pathname.replace(/^\//,"")}catch{z=String(h??"").replace(/^\//,"")}const D=z.replace(/\.html$/i,".md");try{const B=await It(D,t,r?r.signal:void 0);if(B?.raw)return{data:B,pagePath:D,anchor:o}}catch{}if(typeof ke=="string"&&ke)try{const B=await It(ke,t,r?r.signal:void 0);if(B&&B.raw){try{Gi(B.meta||{},ke)}catch{}return{data:B,pagePath:ke,anchor:o}}}catch{}try{s=new Error("site shell detected (absolute fetch)")}catch{}}catch{}}}}catch{}}}catch{}const d=If(a);try{if(Pt())try{de("[router-debug] fetchPageData candidates",{originalRaw:n,resolved:a,pageCandidates:d})}catch{}}catch{}const p=String(n??"").includes(".md")||String(n??"").includes(".html");let m=null;if(!p)try{let h=decodeURIComponent(String(n??""));h=se(h),h=Zn(h),h&&!/\.(md|html?)$/i.test(h)&&(m=h)}catch{m=null}if(p&&d.length===0&&(String(a).includes(".md")||String(a).includes(".html"))&&d.push(a),d.length===0&&(String(a).includes(".md")||String(a).includes(".html"))&&d.push(a),d.length===1&&/index\.html$/i.test(d[0])&&!p&&!ie.has(a)&&!ie.has(decodeURIComponent(String(a??"")))&&!String(a??"").includes("/"))throw new Error("Unknown slug: index.html fallback prevented");let g=null,y=null;try{const h=String(a??"").includes(".md")||String(a??"").includes(".html")||a&&(a.startsWith("http://")||a.startsWith("https://")||a.startsWith("/"));f=typeof ke=="string"&&ke||ie.has(a)||kt&&kt.size||Fi()||p||h}catch{f=!0}if(!f)s=new Error("no page data");else for(const h of d)if(h)try{const _=se(h);if(g=await It(_,t,r?r.signal:void 0),y=_,m&&!ie.has(m))try{let w="";if(g&&g.isHtml)try{const b=at();if(b){const x=b.parseFromString(g.raw||"","text/html"),z=x.querySelector("h1")||x.querySelector("title");z&&z.textContent&&(w=z.textContent.trim())}}catch{}else{const b=(g&&g.raw||"").match(/^#\s+(.+)$/m);b&&b[1]&&(w=b[1].trim())}if(w&&be(w)!==m)try{if(/\.html$/i.test(_)){const b=_.replace(/\.html$/i,".md");if(new Set(d).has(b))try{const x=await It(b,t,r?r.signal:void 0);if(x?.raw)g=x,y=b;else if(typeof ke=="string"&&ke)try{const z=await It(ke,t,r?r.signal:void 0);if(z&&z.raw)g=z,y=ke;else{g=null,y=null,s=new Error("slug mismatch for candidate");continue}}catch{g=null,y=null,s=new Error("slug mismatch for candidate");continue}else{g=null,y=null,s=new Error("slug mismatch for candidate");continue}}catch{try{const z=await It(ke,t,r?r.signal:void 0);if(z&&z.raw)g=z,y=ke;else{g=null,y=null,s=new Error("slug mismatch for candidate");continue}}catch{g=null,y=null,s=new Error("slug mismatch for candidate");continue}}else{g=null,y=null,s=new Error("slug mismatch for candidate");continue}}else{g=null,y=null,s=new Error("slug mismatch for candidate");continue}}catch{g=null,y=null,s=new Error("slug mismatch for candidate");continue}}catch{}try{if(!p&&/\.html$/i.test(_)){const w=_.replace(/\.html$/i,".md");if(new Set(d).has(w))try{const b=String(g&&g.raw||"").trim().slice(0,128).toLowerCase();if(g&&g.isHtml||/^(?:<!doctype|<html|<title|<h1)/i.test(b)||b.indexOf('<div id="app"')!==-1||b.indexOf("nimbi-")!==-1||b.indexOf("nimbi")!==-1||b.indexOf("initcms(")!==-1){let x=!1;try{const z=await It(w,t,r?r.signal:void 0);if(z?.raw)g=z,y=w,x=!0;else if(typeof ke=="string"&&ke)try{const D=await It(ke,t,r?r.signal:void 0);D&&D.raw&&(g=D,y=ke,x=!0)}catch{}}catch{try{const D=await It(ke,t,r?r.signal:void 0);D&&D.raw&&(g=D,y=ke,x=!0)}catch{}}if(!x){g=null,y=null,s=new Error("site shell detected (candidate HTML rejected)");continue}}}catch{}}}catch{}try{if(Pt())try{de("[router-debug] fetchPageData accepted candidate",{candidate:_,pagePath:y,isHtml:g&&g.isHtml,snippet:g&&g.raw?String(g.raw).slice(0,160):null})}catch{}}catch{}break}catch(_){s=_;try{Pt()&&k("[router] candidate fetch failed",{candidate:h,contentBase:t,err:_&&_.message||_})}catch{}}if(!g){const h=s&&(s.message||String(s))||null,_=h&&/failed to fetch md|site shell detected/i.test(h);try{if(Pt())try{de("[router-debug] fetchPageData no data",{originalRaw:n,resolved:a,pageCandidates:d,fetchError:h})}catch{}}catch{}if(_)try{if(Pt())try{k("[router] fetchPageData: no page data (expected)",{originalRaw:n,resolved:a,pageCandidates:d,contentBase:t,fetchError:h})}catch{}}catch{}else try{if(Pt())try{Fr("[router] fetchPageData: no page data for",{originalRaw:n,resolved:a,pageCandidates:d,contentBase:t,fetchError:h})}catch{}}catch{}if(typeof ke=="string"&&ke)try{const w=await It(ke,t,r?r.signal:void 0);if(w&&w.raw){try{Gi(w.meta||{},ke)}catch{}return{data:w,pagePath:ke,anchor:o}}}catch{}try{if(p&&String(n??"").toLowerCase().includes(".html"))try{const w=new URL(String(n??""),location.href).toString();Pt()&&k("[router] attempting absolute HTML fetch fallback",w);const b=await fetch(w,r?{signal:r.signal}:void 0);if(b&&b.ok){const x=await b.text(),z=b&&b.headers&&typeof b.headers.get=="function"&&b.headers.get("content-type")||"",D=(x||"").toLowerCase(),B=z&&z.indexOf&&z.indexOf("text/html")!==-1||D.indexOf("<!doctype")!==-1||D.indexOf("<html")!==-1;if(!B&&Pt())try{k("[router] absolute fetch returned non-HTML",()=>({abs:w,contentType:z,snippet:D.slice(0,200)}))}catch{}if(B){const j=(x||"").toLowerCase();if(/<title>\s*index of\b/i.test(x)||/<h1>\s*index of\b/i.test(x)||j.indexOf("parent directory")!==-1||/<title>\s*directory listing/i.test(x)||/<h1>\s*directory listing/i.test(x))try{Pt()&&k("[router] absolute fetch returned directory listing; treating as not found",{abs:w})}catch{}else try{const re=w,ae=new URL(".",re).toString();try{const R=at();if(R){const N=R.parseFromString(x||"","text/html"),M=(L,Q)=>{try{const ee=Q.getAttribute(L)||"";if(!ee||/^(https?:)?\/\//i.test(ee)||ee.startsWith("/")||ee.startsWith("#"))return;try{const he=new URL(ee,re).toString();Q.setAttribute(L,he)}catch(he){k("[router] rewrite attribute failed",L,he)}}catch(ee){k("[router] rewrite helper failed",ee)}},A=N.querySelectorAll("[src],[href],[srcset],[poster]"),O=[];for(const L of Array.from(A||[]))try{const Q=L.tagName?L.tagName.toLowerCase():"";if(Q==="a")continue;if(L.hasAttribute("src")){const ee=L.getAttribute("src");M("src",L);const he=L.getAttribute("src");ee!==he&&O.push({attr:"src",tag:Q,before:ee,after:he})}if(L.hasAttribute("href")&&Q==="link"){const ee=L.getAttribute("href");M("href",L);const he=L.getAttribute("href");ee!==he&&O.push({attr:"href",tag:Q,before:ee,after:he})}if(L.hasAttribute("href")&&Q!=="link"){const ee=L.getAttribute("href");M("href",L);const he=L.getAttribute("href");ee!==he&&O.push({attr:"href",tag:Q,before:ee,after:he})}if(L.hasAttribute("xlink:href")){const ee=L.getAttribute("xlink:href");M("xlink:href",L);const he=L.getAttribute("xlink:href");ee!==he&&O.push({attr:"xlink:href",tag:Q,before:ee,after:he})}if(L.hasAttribute("poster")){const ee=L.getAttribute("poster");M("poster",L);const he=L.getAttribute("poster");ee!==he&&O.push({attr:"poster",tag:Q,before:ee,after:he})}if(L.hasAttribute("srcset")){const ee=(L.getAttribute("srcset")||"").split(",").map(he=>he.trim()).filter(Boolean).map(he=>{const[me,xe]=he.split(/\s+/,2);if(!me||/^(https?:)?\/\//i.test(me)||me.startsWith("/"))return he;try{const Pe=new URL(me,re).toString();return xe?`${Pe} ${xe}`:Pe}catch{return he}}).join(", ");L.setAttribute("srcset",ee)}}catch{}const H=N.documentElement&&N.documentElement.outerHTML?N.documentElement.outerHTML:x;try{Pt()&&O&&O.length&&k("[router] rewritten asset refs",{abs:w,rewritten:O})}catch{}return{data:{raw:H,isHtml:!0},pagePath:String(n??""),anchor:o}}}catch{}let J=x;try{let R=String(x??"");R=R.replace(/srcset\s*=\s*"([^"]*)"/gi,(N,M)=>`srcset="${String(M??"").split(",").map(A=>A.trim()).filter(Boolean).map(A=>{const[O,H]=A.split(/\s+/,2);if(!O||/^(https?:)?\/\//i.test(O)||O.startsWith("/")||O.startsWith("#"))return A;try{const L=new URL(O,re).toString();return H?`${L} ${H}`:L}catch{return A}}).join(", ")}"`),R=R.replace(/<(?!a\b)([^>]*?)\bhref\s*=\s*"([^"]*)"/gi,(N,M,A)=>{if(!A||/^(https?:)?\/\//i.test(A)||A.startsWith("/")||A.startsWith("#"))return N;try{const O=new URL(A,re).toString();return N.replace(`href="${A}"`,`href="${O}"`)}catch{return N}}),R=R.replace(/\bsrc\s*=\s*"([^"]*)"/gi,(N,M)=>{if(!M||/^(https?:)?\/\//i.test(M)||M.startsWith("/")||M.startsWith("#"))return N;try{return`src="${new URL(M,re).toString()}"`}catch{return N}}),R=R.replace(/\bxlink:href\s*=\s*"([^"]*)"/gi,(N,M)=>{if(!M||/^(https?:)?\/\//i.test(M)||M.startsWith("/")||M.startsWith("#"))return N;try{return`xlink:href="${new URL(M,re).toString()}"`}catch{return N}}),R=R.replace(/\bposter\s*=\s*"([^"]*)"/gi,(N,M)=>{if(!M||/^(https?:)?\/\//i.test(M)||M.startsWith("/")||M.startsWith("#"))return N;try{return`poster="${new URL(M,re).toString()}"`}catch{return N}}),J=R}catch{J=x}return/<base\s+[^>]*>/i.test(J)||(/<head[^>]*>/i.test(J)?J=J.replace(/(<head[^>]*>)/i,`$1<base href="${ae}">`):J=`<base href="${ae}">`+J),{data:{raw:J,isHtml:!0},pagePath:String(n??""),anchor:o}}catch{return{data:{raw:x,isHtml:!0},pagePath:String(n??""),anchor:o}}}}}catch(w){Pt()&&k("[router] absolute HTML fetch fallback failed",w)}}catch{}try{const w=decodeURIComponent(String(a??""));if(w&&!/\.(md|html?)$/i.test(w)&&typeof ke=="string"&&ke&&Pt()){const b=[`/assets/${w}.html`,`/assets/${w}/index.html`];for(const x of b)try{const z=await fetch(x,Object.assign({method:"GET"},r?{signal:r.signal}:{}));if(z&&z.ok)return{data:{raw:await z.text(),isHtml:!0},pagePath:x.replace(/^\//,""),anchor:o}}catch{}}}catch(w){Pt()&&k("[router] assets fallback failed",w)}throw new Error("no page data")}return{data:g,pagePath:y,anchor:o}}function js(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Qn=js();function vc(e){Qn=e}var qn={exec:()=>null};function ir(e){let t=[];return n=>{let r=Math.max(0,Math.min(3,n-1)),i=t[r];return i||(i=e(r),t[r]=i),i}}function Ce(e,t=""){let n=typeof e=="string"?e:e.source,r={replace:(i,a)=>{let o=typeof a=="string"?a:a.source;return o=o.replace(_t.caret,"$1"),n=n.replace(i,o),r},getRegex:()=>new RegExp(n,t)};return r}var zf=((e="")=>{try{return!!new RegExp("(?<=1)(?<!1)"+e)}catch{return!1}})(),_t={codeRemoveIndent:/^(?: {0,3}\t| {1,4})/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,endingSpaceTabChar:/[ \t]$/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,leadingSpaceTab:/^[ \t]+/,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,numericCharacterReference:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/g,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:ir(e=>new RegExp(`^ {0,${e}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),hrRegex:ir(e=>new RegExp(`^ {0,${e}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)),fencesBeginRegex:ir(e=>new RegExp(`^ {0,${e}}(?:\`\`\`|~~~)`)),headingBeginRegex:ir(e=>new RegExp(`^ {0,${e}}#`)),htmlBeginRegex:ir(e=>new RegExp(`^ {0,${e}}(?:</?(?:${pi})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))`,"i")),blockquoteBeginRegex:ir(e=>new RegExp(`^ {0,${e}}>`))},$f=/^(?:[ \t]*(?:\n|$))+/,Df=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Bf=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,di=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Uf=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,qs=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,kc=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,xc=Ce(kc).replace(/bull/g,qs).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Ff=Ce(kc).replace(/bull/g,qs).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Hs=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/,Wf=/^[^\n]+/,Gs=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,jf=Ce(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Gs).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),qf=Ce(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,qs).getRegex(),pi="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Vs=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Hf=Ce("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Vs).replace("tag",pi).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Sc=e=>Ce(Hs).replace("hr",di).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list",e).replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",pi).getRegex(),Gf=Sc(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/),Vf=Sc(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/),Zs={blockquote:Ce(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Vf).getRegex(),code:Df,def:jf,fences:Bf,heading:Uf,hr:di,html:Hf,lheading:xc,list:qf,newline:$f,paragraph:Gf,table:qn,text:Wf},Fo=Ce("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",di).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",pi).getRegex(),Zf={...Zs,lheading:Ff,table:Fo,paragraph:Ce(Hs).replace("hr",di).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Fo).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",pi).getRegex()},Yf={...Zs,html:Ce(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Vs).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:qn,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:Ce(Hs).replace("hr",di).replace("heading",` *#{1,6} *[^
]`).replace("lheading",xc).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Qf=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Xf=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Ec=/^( {2,}|\\)\n(?!\s*$)[ \t]*/,Jf=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,un=/[\p{P}\p{S}]/u,yr=/[\s\p{P}\p{S}]/u,mi=/[^\s\p{P}\p{S}]/u,Kf=Ce(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,yr).getRegex(),ed=/[\p{Pi}\p{Ps}"']/u,Ac=/(?!~)[\p{P}\p{S}]/u,td=/(?!~)[\s\p{P}\p{S}]/u,nd=/(?:[^\s\p{P}\p{S}]|~)/u,rd=Ce(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",zf?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Tc=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,id=Ce(Tc,"u").replace(/punct/g,un).getRegex(),ad=Ce(Tc,"u").replace(/punct/g,Ac).getRegex(),sd=Ce(/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/,"u").replace(/openQuote/g,ed).replace(/punct/g,un).getRegex(),Mc="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",od=Ce(Mc,"gu").replace(/notPunctSpace/g,mi).replace(/punctSpace/g,yr).replace(/punct/g,un).getRegex(),ld=Ce(Mc,"gu").replace(/notPunctSpace/g,nd).replace(/punctSpace/g,td).replace(/punct/g,Ac).getRegex(),cd=Ce("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)","gu").replace(/notPunctSpace/g,mi).replace(/punctSpace/g,yr).replace(/punct/g,un).getRegex(),ud=Ce("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,mi).replace(/punctSpace/g,yr).replace(/punct/g,un).getRegex(),hd=Ce("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)","gu").replace(/notPunctSpace/g,mi).replace(/punctSpace/g,yr).replace(/punct/g,un).getRegex(),fd=Ce(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,un).getRegex(),dd=Ce("^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)","gu").replace(/notPunctSpace/g,mi).replace(/punctSpace/g,yr).replace(/punct/g,un).getRegex(),pd=Ce(/\\(punct)/,"gu").replace(/punct/g,un).getRegex(),md=Ce(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),gd=Ce(Vs).replace("(?:-->|$)","-->").getRegex(),yd=Ce("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",gd).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Cc=/\[(?:\\[\s\S]|[^\[\]\\])*\]/,sa=Ce(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets",Cc).getRegex(),_d=Ce(/^!?\[(label)\]\([ \t\n]*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?[ \t\n]*\)/).replace("label",sa).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),wd=Ce(/^!?\[(label)\]\[(ref)\]/).replace("label",sa).replace("ref",Gs).getRegex(),bd=Ce(/^!?\[(ref)\](?:\[\])?/).replace("ref",Gs).getRegex(),Wo=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/,vd=Ce(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets",Cc).getRegex(),kd=Ce("reflink|nolink(?!\\()","g").replace("reflink",Ce(/^!?\[(label)\]\[(ref)\]/).replace("label",vd).replace("ref",Wo).getRegex()).replace("nolink",Ce(/^!?\[(ref)\](?:\[\])?/).replace("ref",Wo).getRegex()).getRegex(),jo=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,xd=Ce(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g,/[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),Ys={_backpedal:qn,anyPunctuation:pd,autolink:md,blockSkip:rd,br:Ec,code:Xf,del:qn,delLDelim:qn,delRDelim:qn,emStrongLDelim:id,emStrongRDelimAst:od,emStrongRDelimUnd:ud,escape:Qf,link:_d,nolink:bd,punctuation:Kf,reflink:wd,reflinkSearch:kd,tag:yd,text:Jf,url:qn},Sd={...Ys,emStrongLDelim:sd,emStrongRDelimAst:cd,emStrongRDelimUnd:hd,link:Ce(/^!?\[(label)\]\((.*?)\)/).replace("label",sa).getRegex(),reflink:Ce(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",sa).getRegex()},ls={...Ys,emStrongRDelimAst:ld,emStrongLDelim:ad,delLDelim:fd,delRDelim:dd,url:Ce(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol",xd).replace("protocol",jo).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:Ce(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol",jo).replace(/emailProtocol/g,/(?:mailto|xmpp):/).getRegex()},Ed={...ls,br:Ce(Ec).replace("{2,}","*").getRegex(),text:Ce(ls.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Oi={normal:Zs,gfm:Zf,pedantic:Yf},Rr={normal:Ys,gfm:ls,breaks:Ed,pedantic:Sd},Ad={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},qo=e=>Ad[e];function Ot(e,t){if(t){if(_t.escapeTest.test(e))return e.replace(_t.escapeReplace,qo)}else if(_t.escapeTestNoEncode.test(e))return e.replace(_t.escapeReplaceNoEncode,qo);return e}function Td(e){return e.replace(_t.numericCharacterReference,(t,n,r)=>{let i=n===void 0?Number.parseInt(r,16):Number.parseInt(n,10);return i===0||i>1114111||i>=55296&&i<=57343?"�":String.fromCodePoint(i)})}function Ho(e){try{e=encodeURI(e).replace(_t.percentDecode,"%")}catch{return null}return e}function Go(e,t){let n=e.replace(_t.findPipe,(i,a,o)=>{let s=!1,l=a;for(;--l>=0&&o[l]==="\\";)s=!s;return s?"|":" |"}).split(_t.splitPipe),r=0;if(n[0].trim()||n.shift(),n.length>0&&!n.at(-1)?.trim()&&n.pop(),t)if(n.length>t)n.splice(t);else for(;n.length<t;)n.push("");for(;r<n.length;r++)n[r]=n[r].trim().replace(_t.slashPipe,"|");return n}function _n(e,t,n){let r=e.length;if(r===0)return"";let i=0;for(;i<r;){let a=e.charAt(r-i-1);if(a===t&&!n)i++;else if(a!==t&&n)i++;else break}return e.slice(0,r-i)}function Vo(e){let t=e.split(`
`),n=t.length-1;for(;n>=0&&_t.blankLine.test(t[n]);)n--;return t.length-n<=2?e:t.slice(0,n+1).join(`
`)}function oa(e){return e.trim().toLowerCase().toUpperCase().toLowerCase()}function Zo(e,t){if(e.indexOf(t[0])===-1&&e.indexOf(t[1])===-1)return-1;let n=0;for(let r=0;r<e.length;r++)if(e[r]==="\\")r++;else if(e[r]===t[0])n++;else if(e[r]===t[1]&&(n--,n<0))return r;return n>0?-2:-1}function Yo(e,t=0){let n=t,r="";for(let i of e)if(i==="	"){let a=4-n%4;r+=" ".repeat(a),n+=a}else r+=i,n++;return r}function Qo(e,t,n,r,i){let a=t.href,o=t.title||null,s=e[1].replace(i.other.outputLinkReplace,"$1"),l=e[0].charAt(0)==="!";r.state.inLink=!0;let c=r.state.linkEmitted,u=r.state.inRawBlock;r.state.linkEmitted=!1;let f=r.inlineTokens(s),d=r.state.linkEmitted;if(r.state.linkEmitted=c,r.state.inLink=!1,!l){if(d){r.state.inRawBlock=u;return}r.state.linkEmitted=!0}return{type:l?"image":"link",raw:n,href:a,title:o,text:s,tokens:f}}function Md(e,t,n){let r=e.match(n.other.indentCodeCompensation);if(r===null)return t;let i=r[1];return t.split(`
`).map(a=>{let o=a.match(n.other.beginningSpace);if(o===null)return a;let[s]=o;return a.slice(Math.min(s.length,i.length))}).join(`
`)}function Xo(e,t,n,r){if(!t.includes("<"))return!1;for(let i=0;i<t.length;i++){if(t[i]==="\\"){i++;continue}if(t[i]==="`"){let s=r.inline.code.exec(t.slice(i));if(s){i+=s[0].length-1;continue}}if(t[i]!=="<")continue;let a=e.slice(n+i),o=r.inline.tag.exec(a)||r.inline.autolink.exec(a);if(o){if(o[0].length>t.length-i)return!0;i+=o[0].length-1}}return!1}var la=class{options;rules;lexer;constructor(e){this.options=e||Qn}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=this.options.pedantic?t[0]:Vo(t[0]);return{type:"code",raw:n,codeBlockStyle:"indented",text:n.replace(this.rules.other.codeRemoveIndent,"")}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],r=Md(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:r}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let r=_n(n,"#");(this.options.pedantic||!r||this.rules.other.endingSpaceTabChar.test(r))&&(n=r.trim())}return{type:"heading",raw:_n(t[0],`
`),depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:_n(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=_n(t[0],`
`).split(`
`),r="",i="",a=[];for(;n.length>0;){let o=!1,s=[],l=0;for(;l<n.length;l++)if(this.rules.other.blockquoteStart.test(n[l]))s.push(n[l]),o=!0;else if(!o)s.push(n[l]);else break;n=n.slice(l);let c=s.join(`
`),u=c.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");r=r?`${r}
${c}`:c,i=i?`${i}
${u}`:u;let f=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(u,a,!0),this.lexer.state.top=f,n.length===0)break;let d=a.at(-1);if(d?.type==="code")break;if(d?.type==="blockquote"){let p=d,m=n.join(`
`),g=p.raw+`
`+m.replace(this.rules.other.blockquoteSetextReplace2,""),y=this.blockquote(g);a[a.length-1]=y;let h=g.substring(y.raw.length).replace(/^\n/,""),_=h?h.split(`
`).length:0,w=_?n.slice(0,-_):n;w.length>0&&(r=`${r}
${w.join(`
`)}`),i=i.substring(0,i.length-p.text.length)+y.text;break}else if(d?.type==="list"){let p=d,m=p.raw+`
`+n.join(`
`),g=this.list(m);a[a.length-1]=g,r=r.substring(0,r.length-d.raw.length)+g.raw,i=i.substring(0,i.length-p.raw.length)+g.raw,n=m.substring(a.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:r,tokens:a,text:i}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),r=n.length>1,i={type:"list",raw:"",ordered:r,start:r?+n.slice(0,-1):"",loose:!1,items:[]};n=r?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=r?n:"[*+-]");let a=this.rules.other.listItemRegex(n),o=!1;for(;e;){let l=!1,c="",u="";if(!(t=a.exec(e))||this.rules.block.hr.test(e))break;c=t[0],e=e.substring(c.length);let f=t[2].split(`
`,1)[0],d=t[1].length,p=this.options.pedantic?Yo(f,d):f.replace(this.rules.other.leadingSpaceTab,h=>Yo(h,d)),m=e.split(`
`,1)[0],g=!p.trim(),y=0;if(this.options.pedantic?(y=2,u=p.trimStart()):g?y=d+1:(y=p.search(this.rules.other.nonSpaceChar),y=y>4?1:y,u=p.slice(y),y+=d),g&&this.rules.other.blankLine.test(m)&&(c+=m+`
`,e=e.substring(m.length+1),l=!0),!l){let h=this.rules.other.nextBulletRegex(y),_=this.rules.other.hrRegex(y),w=this.rules.other.fencesBeginRegex(y),b=this.rules.other.headingBeginRegex(y),x=this.rules.other.htmlBeginRegex(y),z=this.rules.other.blockquoteBeginRegex(y);for(;e;){let D=e.split(`
`,1)[0],B;if(m=D,this.options.pedantic?(m=m.replace(this.rules.other.listReplaceNesting,"  "),B=m):B=m.replace(this.rules.other.leadingSpaceTab,j=>j.replace(this.rules.other.tabCharGlobal,"    ")),w.test(m)||b.test(m)||x.test(m)||z.test(m)||h.test(m)||_.test(m))break;if(B.search(this.rules.other.nonSpaceChar)>=y||!m.trim())u+=`
`+B.slice(y);else{if(g||p.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||w.test(p)||b.test(p)||_.test(p))break;u+=`
`+m}g=!m.trim(),c+=D+`
`,e=e.substring(D.length+1),p=B.slice(y)}}i.loose||(o?i.loose=!0:this.rules.other.doubleBlankLine.test(c)&&(o=!0)),i.items.push({type:"list_item",raw:c,task:!!this.options.gfm&&this.rules.other.listIsTask.test(u),loose:!1,text:u,tokens:[]}),i.raw+=c}let s=i.items.at(-1);if(s)s.raw=s.raw.trimEnd(),s.text=s.text.trimEnd();else return;i.raw=i.raw.trimEnd();for(let l of i.items)if(this.lexer.state.top=!1,l.tokens=this.lexer.blockTokens(l.text,[]),!i.loose){let c=l.tokens.filter(u=>u.type==="space");i.loose=c.length>0&&c.some(u=>this.rules.other.anyLine.test(u.raw))}for(let l of i.items){let c=l.tokens[0];if(l.task&&(c?.type==="text"||c?.type==="paragraph")){l.text=l.text.replace(this.rules.other.listReplaceTask,""),c.raw=c.raw.replace(this.rules.other.listReplaceTask,""),c.text=c.text.replace(this.rules.other.listReplaceTask,"");for(let f=this.lexer.inlineQueue.length-1;f>=0;f--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[f].src)){this.lexer.inlineQueue[f].src=this.lexer.inlineQueue[f].src.replace(this.rules.other.listReplaceTask,"");break}let u=this.rules.other.listTaskCheckbox.exec(l.raw);if(u){let f={type:"checkbox",raw:u[0]+" ",checked:u[0]!=="[ ]"};l.checked=f.checked,i.loose?l.tokens[0]&&["paragraph","text"].includes(l.tokens[0].type)&&"tokens"in l.tokens[0]&&l.tokens[0].tokens?(l.tokens[0].raw=f.raw+l.tokens[0].raw,l.tokens[0].text=f.raw+l.tokens[0].text,l.tokens[0].tokens.unshift(f)):l.tokens.unshift({type:"paragraph",raw:f.raw,text:f.raw,tokens:[f]}):l.tokens.unshift(f)}}else l.task&&(l.task=!1)}if(i.loose)for(let l of i.items){l.loose=!0;for(let c of l.tokens)c.type==="text"&&(c.type="paragraph")}return i}}html(e){let t=this.rules.block.html.exec(e);if(t){let n=Vo(t[0]);return{type:"html",block:!0,raw:n,pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:n}}}def(e){let t=this.rules.block.def.exec(e);if(t){if(!this.rules.other.startAngleBracket.test(t[2])&&Zo(t[2],"()")!==-1)return;let n=oa(t[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",i=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:_n(t[0],`
`),href:r,title:i}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=Go(t[1]),r=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),i=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],a={type:"table",raw:_n(t[0],`
`),header:[],align:[],rows:[]};if(n.length===r.length){for(let o of r)this.rules.other.tableAlignRight.test(o)?a.align.push("right"):this.rules.other.tableAlignCenter.test(o)?a.align.push("center"):this.rules.other.tableAlignLeft.test(o)?a.align.push("left"):a.align.push(null);for(let o=0;o<n.length;o++)a.header.push({text:n[o],tokens:this.lexer.inline(n[o]),header:!0,align:a.align[o]});for(let o of i)a.rows.push(Go(o,a.header.length).map((s,l)=>({text:s,tokens:this.lexer.inline(s),header:!1,align:a.align[l]})));return a}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t){let n=t[1].trim();return{type:"heading",raw:_n(t[0],`
`),depth:t[2].charAt(0)==="="?1:2,text:n,tokens:this.lexer.inline(n)}}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){if(this.lexer.state.linkParenPossible===!1)return;let t=this.rules.inline.link.exec(e);if(t){let n=t[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&Xo(e,t[1],n,this.rules))return;let r=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(r)){if(!this.rules.other.endAngleBracket.test(r))return;let o=_n(r.slice(0,-1),"\\");if((r.length-o.length)%2===0)return}else{let o=Zo(t[2],"()");if(o===-2)return;if(o>-1){let s=(t[0].indexOf("!")===0?5:4)+t[1].length+o;t[2]=t[2].substring(0,o),t[0]=t[0].substring(0,s).trim(),t[3]=""}}let i=t[2],a="";if(this.options.pedantic){let o=this.rules.other.pedanticHrefTitle.exec(i);o&&(i=o[1],a=o[3])}else a=t[3]?t[3].slice(1,-1):"";return i=i.trim(),this.rules.other.startAngleBracket.test(i)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(r)?i=i.slice(1):i=i.slice(1,-1)),Qo(t,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:a&&a.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let r=n[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&Xo(e,n[1],r,this.rules))return;let i=t[oa((n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "))];if(!i){let a=n[0].charAt(0);return{type:"text",raw:a,text:a}}return Qo(n,i,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let r=this.rules.inline.emStrongLDelim.exec(e);if(!(!r||!r[1]&&!r[2]&&!r[3]&&!r[4]||r[4]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(r[1]||r[3])||!n||this.rules.inline.punctuation.exec(n))){let i=[...r[0]].length-1,a,o,s=i,l=0,c=r[0][0],u=n===c,f=c==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(f.lastIndex=0,t=t.slice(-1*e.length+i);(r=f.exec(t))!==null;){if(a=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!a)continue;if(o=[...a].length,r[3]||r[4]){s+=o;continue}else if(r[5]||r[6]){if(i%3&&!((i+o)%3)){l+=o;continue}if(u)break}if(s-=o,s>0)continue;o=Math.min(o,o+s+l);let d=[...r[0]][0].length,p=e.slice(0,i+r.index+d+o);if(Math.min(i,o)%2){let g=p.slice(1,-1);return{type:"em",raw:p,text:g,tokens:this.lexer.inlineTokens(g)}}let m=p.slice(2,-2);return{type:"strong",raw:p,text:m,tokens:this.lexer.inlineTokens(m)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),r=this.rules.other.nonSpaceChar.test(n),i=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return r&&i&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,n=""){let r=this.rules.inline.delLDelim.exec(e);if(r&&(!r[1]||!n||this.rules.inline.punctuation.exec(n))){let i=[...r[0]].length-1,a,o,s=i,l=this.rules.inline.delRDelim;for(l.lastIndex=0,t=t.slice(-1*e.length+i);(r=l.exec(t))!==null;){if(a=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!a||(o=[...a].length,o!==i))continue;if(r[3]||r[4]){s+=o;continue}if(s-=o,s>0)continue;o=Math.min(o,o+s);let c=[...r[0]][0].length,u=e.slice(0,i+r.index+c+o),f=u.slice(i,-i);return{type:"del",raw:u,text:f,tokens:this.lexer.inlineTokens(f)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,r;return t[2]==="@"?(n=t[1],r="mailto:"+n):(n=t[1],r=n),{type:"link",raw:t[0],text:n,href:r,autolink:!0,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,r;if(t[2]==="@")n=t[0],r="mailto:"+n;else{let i;do i=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(i!==t[0]);n=t[0],t[1]==="www."?r="http://"+t[0]:r=t[0]}return{type:"link",raw:t[0],text:n,href:r,autolink:!0,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:n?t[0]:Td(t[0]),escaped:n}}}},Vt=class cs{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||Qn,this.options.tokenizer=this.options.tokenizer||new la,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,linkEmitted:!1,linkParenPossible:!0,top:!0};let n={other:_t,block:Oi.normal,inline:Rr.normal};this.options.pedantic?(n.block=Oi.pedantic,n.inline=Rr.pedantic):this.options.gfm&&(n.block=Oi.gfm,this.options.breaks?n.inline=Rr.breaks:n.inline=Rr.gfm),this.tokenizer.rules=n}static get rules(){return{block:Oi,inline:Rr}}static lex(t,n){return new cs(n).lex(t)}static lexInline(t,n){return new cs(n).inlineTokens(t)}lex(t){t=t.replace(_t.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let r=this.inlineQueue[n];this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],r=!1){this.tokenizer.lexer=this,this.options.pedantic&&(t=t.replace(_t.tabCharGlobal,"    ").replace(_t.spaceLine,""));let i=1/0;for(;t;){if(t.length<i)i=t.length;else{this.infiniteLoopError(t.charCodeAt(0));break}let a;if(this.options.extensions?.block?.some(s=>(a=s.call({lexer:this},t,n))?(t=t.substring(a.raw.length),n.push(a),!0):!1))continue;if(a=this.tokenizer.space(t)){t=t.substring(a.raw.length);let s=n.at(-1);a.raw.length===1&&s!==void 0?s.raw+=`
`:n.push(a);continue}if(a=this.tokenizer.code(t)){t=t.substring(a.raw.length);let s=n.at(-1);s?.type==="paragraph"||s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+a.raw,s.text+=`
`+a.text,this.inlineQueue.at(-1).src=s.text):n.push(a);continue}if(a=this.tokenizer.fences(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.heading(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.hr(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.blockquote(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.list(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.html(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.def(t)){t=t.substring(a.raw.length);let s=n.at(-1);s?.type==="paragraph"||s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+a.raw,s.text+=`
`+a.raw,this.inlineQueue.at(-1).src=s.text):this.tokens.links[a.tag]||(this.tokens.links[a.tag]={href:a.href,title:a.title},n.push(a));continue}if(a=this.tokenizer.table(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.lheading(t)){t=t.substring(a.raw.length),n.push(a);continue}let o=t;if(this.options.extensions?.startBlock){let s=1/0,l=t.slice(1),c;this.options.extensions.startBlock.forEach(u=>{c=u.call({lexer:this},l),typeof c=="number"&&c>=0&&(s=Math.min(s,c))}),s<1/0&&s>=0&&(o=t.substring(0,s+1))}if(this.state.top&&(a=this.tokenizer.paragraph(o))){let s=n.at(-1);r&&s?.type==="paragraph"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+a.raw,s.text+=`
`+a.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):n.push(a),r=o.length!==t.length,t=t.substring(a.raw.length);continue}if(a=this.tokenizer.text(t)){t=t.substring(a.raw.length);let s=n.at(-1);s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+a.raw,s.text+=`
`+a.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):n.push(a);continue}if(t){this.infiniteLoopError(t.charCodeAt(0));break}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}linkInText(t){if(!t.includes("["))return!1;let n=this.tokenizer.rules.inline.link;for(let r of t.matchAll(this.tokenizer.rules.inline.blockSkip))if(n.test(r[0])&&t.charAt(r.index-1)!=="!")return!0;for(let r of t.matchAll(this.tokenizer.rules.inline.reflinkSearch)){let i=r[0],a=i.lastIndexOf("[");if(!(i.charAt(0)==="!"||!Object.hasOwn(this.tokens.links,oa(i.slice(a+1,-1))))&&!(a>1&&this.linkInText(i.slice(1,a-1))))return!0}return!1}inlineTokens(t,n=[]){this.tokenizer.lexer=this;let r=this.state.linkParenPossible;this.state.linkParenPossible=r&&t.includes(")");try{return this.#e(t,n)}finally{this.state.linkParenPossible=r}}#e(t,n){let r=t;if(this.tokens.links&&t.includes("[")){let s=this.tokenizer.rules.inline.reflinkSearch,l=c=>{let u=c.lastIndexOf("[");if(!Object.hasOwn(this.tokens.links,oa(c.slice(u+1,-1))))return c;if(u>1&&c.charAt(0)!=="!"){let f=c.slice(1,u-1);if(this.linkInText(f))return"["+f.replace(s,l)+"]["+"a".repeat(c.length-u-2)+"]"}return"["+"a".repeat(c.length-2)+"]"};r=r.replace(s,l)}r=r.replace(this.tokenizer.rules.inline.anyPunctuation,s=>"+".repeat(s.length)),r=r.replace(this.tokenizer.rules.inline.blockSkip,(s,l,c)=>{let u=c?c.length:0;return s.slice(0,u)+"["+"a".repeat(s.length-u-2)+"]"}),r=this.options.hooks?.emStrongMask?.call({lexer:this},r)??r;let i=!1,a="",o=1/0;for(;t;){if(t.length<o)o=t.length;else{this.infiniteLoopError(t.charCodeAt(0));break}i||(a=""),i=!1;let s;if(this.options.extensions?.inline?.some(c=>(s=c.call({lexer:this},t,n))?(t=t.substring(s.raw.length),n.push(s),!0):!1))continue;if(s=this.tokenizer.escape(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.tag(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.link(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(s.raw.length);let c=n.at(-1);s.type==="text"&&c?.type==="text"?(c.raw+=s.raw,c.text+=s.text):n.push(s);continue}if(s=this.tokenizer.emStrong(t,r,a)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.codespan(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.br(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.del(t,r,a)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.autolink(t)){t=t.substring(s.raw.length),n.push(s);continue}if(!this.state.inLink&&(s=this.tokenizer.url(t))){t=t.substring(s.raw.length),n.push(s);continue}let l=t;if(this.options.extensions?.startInline){let c=1/0,u=t.slice(1),f;this.options.extensions.startInline.forEach(d=>{f=d.call({lexer:this},u),typeof f=="number"&&f>=0&&(c=Math.min(c,f))}),c<1/0&&c>=0&&(l=t.substring(0,c+1))}if(s=this.tokenizer.inlineText(l)){t=t.substring(s.raw.length),s.raw.slice(-1)!=="_"&&(a=s.raw.slice(-1)),i=!0;let c=n.at(-1);c?.type==="text"?(c.raw+=s.raw,c.text+=s.text):n.push(s);continue}if(t){this.infiniteLoopError(t.charCodeAt(0));break}}return n}infiniteLoopError(t){let n="Infinite loop on byte: "+t;if(this.options.silent)console.error(n);else throw new Error(n)}},ca=class{options;parser;constructor(e){this.options=e||Qn}space(e){return""}code({text:e,lang:t,escaped:n}){let r=(t||"").match(_t.notSpaceStart)?.[0],i=e?e.replace(_t.endingNewline,"")+`
`:"";return r?'<pre><code class="language-'+Ot(r)+'">'+(n?i:Ot(i,!0))+`</code></pre>
`:"<pre><code>"+(n?i:Ot(i,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return""}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,r="";for(let o=0;o<e.items.length;o++){let s=e.items[o];r+=this.listitem(s)}let i=t?"ol":"ul",a=t&&n!==1?' start="'+n+'"':"";return"<"+i+a+`>
`+r+"</"+i+`>
`}listitem(e){return`<li>${this.parser.parse(e.tokens)}</li>
`}checkbox({checked:e}){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",n="";for(let i=0;i<e.header.length;i++)n+=this.tablecell(e.header[i]);t+=this.tablerow({text:n});let r="";for(let i=0;i<e.rows.length;i++){let a=e.rows[i];n="";for(let o=0;o<a.length;o++)n+=this.tablecell(a[o]);r+=this.tablerow({text:n})}return r&&(r=`<tbody>${r}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+r+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),n=e.header?"th":"td";return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${Ot(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,text:n,tokens:r,autolink:i}){let a=i?Ot(n,!0):this.parser.parseInline(r),o=Ho(e);if(o===null)return a;e=Ot(o,i);let s='<a href="'+e+'"';return t&&(s+=' title="'+Ot(t)+'"'),s+=">"+a+"</a>",s}image({href:e,title:t,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));let i=Ho(e);if(i===null)return Ot(n);e=i;let a=`<img src="${Ot(e)}" alt="${Ot(n)}"`;return t&&(a+=` title="${Ot(t)}"`),a+=">",a}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:Ot(e.text)}},Qs=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},Zt=class us{options;renderer;textRenderer;constructor(t){this.options=t||Qn,this.options.renderer=this.options.renderer||new ca,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Qs}static parse(t,n){return new us(n).parse(t)}static parseInline(t,n){return new us(n).parseInline(t)}parse(t){this.renderer.parser=this;let n="";for(let r=0;r<t.length;r++){let i=t[r];if(this.options.extensions?.renderers?.[i.type]){let o=i,s=this.options.extensions.renderers[o.type].call({parser:this},o);if(s!==!1||!["space","hr","heading","code","table","blockquote","list","checkbox","html","def","paragraph","text"].includes(o.type)){n+=s||"";continue}}let a=i;switch(a.type){case"space":n+=this.renderer.space(a);break;case"hr":n+=this.renderer.hr(a);break;case"heading":n+=this.renderer.heading(a);break;case"code":n+=this.renderer.code(a);break;case"table":n+=this.renderer.table(a);break;case"blockquote":n+=this.renderer.blockquote(a);break;case"list":n+=this.renderer.list(a);break;case"checkbox":n+=this.renderer.checkbox(a);break;case"html":n+=this.renderer.html(a);break;case"def":n+=this.renderer.def(a);break;case"paragraph":n+=this.renderer.paragraph(a);break;case"text":n+=this.renderer.text(a);break;default:{let o='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return n}parseInline(t,n=this.renderer){this.renderer.parser=this;let r="";for(let i=0;i<t.length;i++){let a=t[i];if(this.options.extensions?.renderers?.[a.type]){let s=this.options.extensions.renderers[a.type].call({parser:this},a);if(s!==!1||!["escape","html","link","image","checkbox","strong","em","codespan","br","del","text"].includes(a.type)){r+=s||"";continue}}let o=a;switch(o.type){case"escape":r+=n.text(o);break;case"html":r+=n.html(o);break;case"link":r+=n.link(o);break;case"image":r+=n.image(o);break;case"checkbox":r+=n.checkbox(o);break;case"strong":r+=n.strong(o);break;case"em":r+=n.em(o);break;case"codespan":r+=n.codespan(o);break;case"br":r+=n.br(o);break;case"del":r+=n.del(o);break;case"text":r+=n.text(o);break;default:{let s='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(s),"";throw new Error(s)}}}return r}},$r=class{options;block;constructor(e){this.options=e||Qn}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(e=this.block){return e?Vt.lex:Vt.lexInline}provideParser(e=this.block){return e?Zt.parse:Zt.parseInline}},Cd=class{defaults=js();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Zt;Renderer=ca;TextRenderer=Qs;Lexer=Vt;Tokenizer=la;Hooks=$r;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let r of e)switch(n=n.concat(t.call(this,r)),r.type){case"table":{let i=r;for(let a of i.header)n=n.concat(this.walkTokens(a.tokens,t));for(let a of i.rows)for(let o of a)n=n.concat(this.walkTokens(o.tokens,t));break}case"list":{let i=r;n=n.concat(this.walkTokens(i.items,t));break}default:{let i=r;this.defaults.extensions?.childTokens?.[i.type]?this.defaults.extensions.childTokens[i.type].forEach(a=>{let o=i[a].flat(1/0);n=n.concat(this.walkTokens(o,t))}):i.tokens&&(n=n.concat(this.walkTokens(i.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let r={...n};if(r.async=this.defaults.async||r.async||!1,n.extensions&&(n.extensions.forEach(i=>{if(!i.name)throw new Error("extension name required");if("renderer"in i){let a=t.renderers[i.name];a?t.renderers[i.name]=function(...o){let s=i.renderer.apply(this,o);return s===!1&&(s=a.apply(this,o)),s}:t.renderers[i.name]=i.renderer}if("tokenizer"in i){if(!i.level||i.level!=="block"&&i.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let a=t[i.level];a?a.unshift(i.tokenizer):t[i.level]=[i.tokenizer],i.start&&(i.level==="block"?t.startBlock?t.startBlock.push(i.start):t.startBlock=[i.start]:i.level==="inline"&&(t.startInline?t.startInline.push(i.start):t.startInline=[i.start]))}"childTokens"in i&&i.childTokens&&(t.childTokens[i.name]=i.childTokens)}),r.extensions=t),n.renderer){let i=this.defaults.renderer||new ca(this.defaults);for(let a in n.renderer){if(!(a in i))throw new Error(`renderer '${a}' does not exist`);if(["options","parser"].includes(a))continue;let o=a,s=n.renderer[o],l=i[o];i[o]=(...c)=>{let u=s.apply(i,c);return u===!1&&(u=l.apply(i,c)),u||""}}r.renderer=i}if(n.tokenizer){let i=this.defaults.tokenizer||new la(this.defaults);for(let a in n.tokenizer){if(!(a in i))throw new Error(`tokenizer '${a}' does not exist`);if(["options","rules","lexer"].includes(a))continue;let o=a,s=n.tokenizer[o],l=i[o];i[o]=(...c)=>{let u=s.apply(i,c);return u===!1&&(u=l.apply(i,c)),u}}r.tokenizer=i}if(n.hooks){let i=this.defaults.hooks||new $r;for(let a in n.hooks){if(!(a in i))throw new Error(`hook '${a}' does not exist`);if(["options","block"].includes(a))continue;let o=a,s=n.hooks[o],l=i[o];$r.passThroughHooks.has(a)?i[o]=c=>{if(this.defaults.async&&$r.passThroughHooksRespectAsync.has(a))return(async()=>{let f=await s.call(i,c);return l.call(i,f)})();let u=s.call(i,c);return l.call(i,u)}:i[o]=(...c)=>{if(this.defaults.async)return(async()=>{let f=await s.apply(i,c);return f===!1&&(f=await l.apply(i,c)),f})();let u=s.apply(i,c);return u===!1&&(u=l.apply(i,c)),u}}r.hooks=i}if(n.walkTokens){let i=this.defaults.walkTokens,a=n.walkTokens;r.walkTokens=function(o){let s=[];return s.push(a.call(this,o)),i&&(s=s.concat(i.call(this,o))),s}}this.defaults={...this.defaults,...r}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return Vt.lex(e,t??this.defaults)}parser(e,t){return Zt.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let r={...n},i={...this.defaults,...r},a=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&r.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(i.hooks&&(i.hooks.options=i,i.hooks.block=e),i.async)return(async()=>{let o=i.hooks?await i.hooks.preprocess(t):t,s=await(i.hooks?await i.hooks.provideLexer(e):e?Vt.lex:Vt.lexInline)(o,i),l=i.hooks?await i.hooks.processAllTokens(s):s;i.walkTokens&&await Promise.all(this.walkTokens(l,i.walkTokens));let c=await(i.hooks?await i.hooks.provideParser(e):e?Zt.parse:Zt.parseInline)(l,i);return i.hooks?await i.hooks.postprocess(c):c})().catch(a);try{i.hooks&&(t=i.hooks.preprocess(t));let o=(i.hooks?i.hooks.provideLexer(e):e?Vt.lex:Vt.lexInline)(t,i);i.hooks&&(o=i.hooks.processAllTokens(o)),i.walkTokens&&this.walkTokens(o,i.walkTokens);let s=(i.hooks?i.hooks.provideParser(e):e?Zt.parse:Zt.parseInline)(o,i);return i.hooks&&(s=i.hooks.postprocess(s)),s}catch(o){return a(o)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let r="<p>An error occurred:</p><pre>"+Ot(n.message+"",!0)+"</pre>";return t?Promise.resolve(r):r}if(t)return Promise.reject(n);throw n}}},Yn=new Cd;function $e(e,t){return Yn.parse(e,t)}$e.options=$e.setOptions=function(e){return Yn.setOptions(e),$e.defaults=Yn.defaults,vc($e.defaults),$e};$e.getDefaults=js;$e.defaults=Qn;function Rd(...e){return Yn.use(...e),$e.defaults=Yn.defaults,vc($e.defaults),$e}$e.use=Rd;$e.walkTokens=function(e,t){return Yn.walkTokens(e,t)};$e.parseInline=Yn.parseInline;$e.Parser=Zt;$e.parser=Zt.parse;$e.Renderer=ca;$e.TextRenderer=Qs;$e.Lexer=Vt;$e.lexer=Vt.lex;$e.Tokenizer=la;$e.Hooks=$r;$e.parse=$e;var mm=$e.options,gm=$e.setOptions,ym=$e.walkTokens,_m=$e.parseInline,wm=Zt.parse,bm=Vt.lex,Rc=`var Hi = Object.create, Cn = Object.defineProperty, Wi = Object.getOwnPropertyDescriptor, Gi = Object.getOwnPropertyNames, qi = Object.getPrototypeOf, hi = Object.prototype.hasOwnProperty, Vi = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), Zi = (e, t) => {
	let n = {};
	for (var r in e) Cn(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || Cn(n, Symbol.toStringTag, { value: "Module" }), n;
}, Yi = (e, t, n, r) => {
	if (t && typeof t == "object" || typeof t == "function") for (var i = Gi(t), s = 0, l = i.length, o; s < l; s++) o = i[s], !hi.call(e, o) && o !== n && Cn(e, o, {
		get: ((u) => t[u]).bind(null, o),
		enumerable: !(r = Wi(t, o)) || r.enumerable
	});
	return e;
}, Xi = (e, t, n) => (n = e != null ? Hi(qi(e)) : {}, Yi(t || !e || !e.__esModule || !hi.call(e, "default") ? Cn(n, "default", {
	value: e,
	enumerable: !0
}) : n, e)), Mr = /* @__PURE__ */ Zi({
	Hooks: () => Pt,
	Lexer: () => Oe,
	Marked: () => xi,
	Parser: () => Ne,
	Renderer: () => an,
	TextRenderer: () => $n,
	Tokenizer: () => on,
	defaults: () => st,
	getDefaults: () => zn,
	lexer: () => Xs,
	marked: () => j,
	options: () => Ws,
	parse: () => Zs,
	parseInline: () => Vs,
	parser: () => Ys,
	setOptions: () => Gs,
	use: () => Ei,
	walkTokens: () => qs
});
function zn() {
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
var st = zn();
function fi(e) {
	st = e;
}
var wt = { exec: () => null };
function Mt(e) {
	let t = [];
	return (n) => {
		let r = Math.max(0, Math.min(3, n - 1)), i = t[r];
		return i || (i = e(r), t[r] = i), i;
	};
}
function I(e, t = "") {
	let n = typeof e == "string" ? e : e.source, r = {
		replace: (i, s) => {
			let l = typeof s == "string" ? s : s.source;
			return l = l.replace(ae.caret, "$1"), n = n.replace(i, l), r;
		},
		getRegex: () => new RegExp(n, t)
	};
	return r;
}
var Ki = ((e = "") => {
	try {
		return !!new RegExp("(?<=1)(?<!1)" + e);
	} catch {
		return !1;
	}
})(), ae = {
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
	listItemRegex: (e) => new RegExp(\`^( {0,3}\${e})((?:[	 ][^\\\\n]*)?(?:\\\\n|$))\`),
	nextBulletRegex: Mt((e) => new RegExp(\`^ {0,\${e}}(?:[*+-]|\\\\d{1,9}[.)])((?:[ 	][^\\\\n]*)?(?:\\\\n|$))\`)),
	hrRegex: Mt((e) => new RegExp(\`^ {0,\${e}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\\\*[ 	]*){3,})(?:\\\\n+|$)\`)),
	fencesBeginRegex: Mt((e) => new RegExp(\`^ {0,\${e}}(?:\\\`\\\`\\\`|~~~)\`)),
	headingBeginRegex: Mt((e) => new RegExp(\`^ {0,\${e}}#\`)),
	htmlBeginRegex: Mt((e) => new RegExp(\`^ {0,\${e}}(?:</?(?:\${cn})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))\`, "i")),
	blockquoteBeginRegex: Mt((e) => new RegExp(\`^ {0,\${e}}>\`))
}, Ji = /^(?:[ \\t]*(?:\\n|$))+/, Qi = /^((?: {4}| {0,3}\\t)[^\\n]+(?:\\n(?:[ \\t]*(?:\\n|$))*)?)+/, es = /^ {0,3}(\`{3,}(?=[^\`\\n]*(?:\\n|$))|~{3,})([^\\n]*)(?:\\n|$)(?:|([\\s\\S]*?)(?:\\n|$))(?: {0,3}\\1[~\`]* *(?=\\n|$)|$)/, ln = /^ {0,3}((?:-[\\t ]*){3,}|(?:_[ \\t]*){3,}|(?:\\*[ \\t]*){3,})(?:\\n+|$)/, ts = /^ {0,3}(#{1,6})(?=\\s|$)(.*)(?:\\n+|$)/, fr = / {0,3}(?:[*+-]|\\d{1,9}[.)])/, pi = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\\n(?!\\s*?\\n|bull |fences|blockquote|heading|hr|html|table))+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/, di = I(pi).replace(/bull/g, fr).replace(/blockCode/g, /(?: {4}| {0,3}\\t)/).replace(/fences/g, / {0,3}(?:\`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\\t ]*){3,}|(?:_[ \\t]*){3,}|(?:\\*[ \\t]*){3,})(?:\\n+|$)/).replace(/html/g, / {0,3}<[^\\n>]+>\\n/).replace(/\\|table/g, "").getRegex(), ns = I(pi).replace(/bull/g, fr).replace(/blockCode/g, /(?: {4}| {0,3}\\t)/).replace(/fences/g, / {0,3}(?:\`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\\s|$)/).replace(/hr/g, / {0,3}(?:(?:-[\\t ]*){3,}|(?:_[ \\t]*){3,}|(?:\\*[ \\t]*){3,})(?:\\n+|$)/).replace(/html/g, / {0,3}<[^\\n>]+>\\n/).replace(/table/g, / {0,3}\\|?(?:[:\\- ]*\\|)+[\\:\\- ]*\\n/).getRegex(), pr = /^([^\\n]+(?:\\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \\t]+\\n)[^\\n]+)*)/, rs = /^[^\\n]+/, dr = /(?!\\s*\\])(?:\\\\[\\s\\S]|[^\\[\\]\\\\])+/, is = I(/^ {0,3}\\[(label)\\]: *(?:\\n[ \\t]*)?([^<\\s][^\\s]*|<.*?>)(?:(?: +(?:\\n[ \\t]*)?| *\\n[ \\t]*)(title))? *(?:\\n+|$)/).replace("label", dr).replace("title", /(?:"(?:\\\\"?|[^"\\\\])*"|'[^'\\n]*(?:\\n[^'\\n]+)*\\n?'|\\([^()]*\\))/).getRegex(), ss = I(/^(bull)([ \\t][^\\n]*?)?(?:\\n|$)/).replace(/bull/g, fr).getRegex(), cn = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", gr = /<!--(?:-?>|[\\s\\S]*?(?:-->|$))/, os = I("^ {0,3}(?:<(script|pre|style|textarea)[\\\\s>][\\\\s\\\\S]*?(?:</\\\\1>[^\\\\n]*\\\\n*|$)|comment[^\\\\n]*(\\\\n+|$)|<\\\\?[\\\\s\\\\S]*?(?:\\\\?>[^\\\\n]*\\\\n*|$)|<![A-Z][\\\\s\\\\S]*?(?:>[^\\\\n]*\\\\n*|$)|<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?(?:\\\\]\\\\]>[^\\\\n]*\\\\n*|$)|</?(tag)(?: +|\\\\n|/?>)[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\\\s*>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$))", "i").replace("comment", gr).replace("tag", cn).replace("attribute", / +[a-zA-Z:_][\\w.:-]*(?: *= *"[^"\\n]*"| *= *'[^'\\n]*'| *= *[^\\s"'=<>\`]+)?/).getRegex(), gi = (e) => I(pr).replace("hr", ln).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*(?:\\\\n|$))|~~~)[^\\\\n]*(?:\\\\n|$)").replace("list", e).replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", cn).getRegex(), as = gi(/ {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]/), ls = gi(/ {0,3}(?:[*+-]|\\d{1,9}[.)])(?:[ \\t]|\\n|$)/), mr = {
	blockquote: I(/^( {0,3}> ?(paragraph|[^\\n]*)(?:\\n|$))+/).replace("paragraph", ls).getRegex(),
	code: Qi,
	def: is,
	fences: es,
	heading: ts,
	hr: ln,
	html: os,
	lheading: di,
	list: ss,
	newline: Ji,
	paragraph: as,
	table: wt,
	text: rs
}, Or = I("^ *([^\\\\n ].*)\\\\n {0,3}((?:\\\\| *)?:?-+:? *(?:\\\\| *:?-+:? *)*(?:\\\\| *)?)(?:\\\\n((?:(?! *\\\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\\\n|$))*)\\\\n*|$)").replace("hr", ln).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\\\n]").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*(?:\\\\n|$))|~~~)[^\\\\n]*(?:\\\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", cn).getRegex(), cs = {
	...mr,
	lheading: ns,
	table: Or,
	paragraph: I(pr).replace("hr", ln).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("|lheading", "").replace("table", Or).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*(?:\\\\n|$))|~~~)[^\\\\n]*(?:\\\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]+[^ \\\\t\\\\n]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", cn).getRegex()
}, us = {
	...mr,
	html: I(\`^ *(?:comment *(?:\\\\n|\\\\s*$)|<(tag)[\\\\s\\\\S]+?</\\\\1> *(?:\\\\n{2,}|\\\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\\\s[^'"/>\\\\s]*)*?/?> *(?:\\\\n{2,}|\\\\s*$))\`).replace("comment", gr).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\\\b)\\\\w+(?!:|[^\\\\w\\\\s@]*@)\\\\b").getRegex(),
	def: /^ *\\[([^\\]]+)\\]: *<?([^\\s>]+)>?(?: +(["(][^\\n]+[")]))? *(?:\\n+|$)/,
	heading: /^(#{1,6})(.*)(?:\\n+|$)/,
	fences: wt,
	lheading: /^(.+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/,
	paragraph: I(pr).replace("hr", ln).replace("heading", \` *#{1,6} *[^
]\`).replace("lheading", di).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, hs = /^\\\\([!"#$%&'()*+,\\-./:;<=>?@\\[\\]\\\\^_\`{|}~])/, fs = /^(\`+)([^\`]|[^\`][\\s\\S]*?[^\`])\\1(?!\`)/, mi = /^( {2,}|\\\\)\\n(?!\\s*$)[ \\t]*/, ps = /^(\`+|[^\`])(?:(?= {2,}\\n)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*_]|\\b_|$)|[^ ](?= {2,}\\n)))/, Ge = /[\\p{P}\\p{S}]/u, It = /[\\s\\p{P}\\p{S}]/u, un = /[^\\s\\p{P}\\p{S}]/u, ds = I(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, It).getRegex(), gs = /[\\p{Pi}\\p{Ps}"']/u, _i = /(?!~)[\\p{P}\\p{S}]/u, ms = /(?!~)[\\s\\p{P}\\p{S}]/u, _s = /(?:[^\\s\\p{P}\\p{S}]|~)/u, bs = I(/link|precode-code|html/, "g").replace("link", /\\[(?:[^\\[\\]\`]|(?<a>\`+)[^\`]+\\k<a>(?!\`))*?\\]\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)]|\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)])*\\))*\\)/).replace("precode-", Ki ? "(?<!\`)()" : "(^^|[^\`])").replace("code", /(?<b>\`+)[^\`]+\\k<b>(?!\`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), bi = /^(?:\\*+(?:((?!\\*)punct)|([^\\s*]))?)|^_+(?:((?!_)punct)|([^\\s_]))?/, ys = I(bi, "u").replace(/punct/g, Ge).getRegex(), ws = I(bi, "u").replace(/punct/g, _i).getRegex(), xs = I(/^(?:\\*+(?:((?!\\*)(?!openQuote)punct)|([^\\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\\s_]))?/, "u").replace(/openQuote/g, gs).replace(/punct/g, Ge).getRegex(), yi = "^[^_*]*?__[^_*]*?\\\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\\\*)punct(\\\\*+)(?=[\\\\s]|$)|notPunctSpace(\\\\*+)(?!\\\\*)(?=punctSpace|$)|(?!\\\\*)punctSpace(\\\\*+)(?=notPunctSpace)|[\\\\s](\\\\*+)(?!\\\\*)(?=punct)|(?!\\\\*)punct(\\\\*+)(?!\\\\*)(?=punct)|notPunctSpace(\\\\*+)(?=notPunctSpace)", Es = I(yi, "gu").replace(/notPunctSpace/g, un).replace(/punctSpace/g, It).replace(/punct/g, Ge).getRegex(), ks = I(yi, "gu").replace(/notPunctSpace/g, _s).replace(/punctSpace/g, ms).replace(/punct/g, _i).getRegex(), Ts = I("^[^_*]*?__[^_*]*?\\\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\\\*)punct(\\\\*+)(?=[\\\\s]|$)|notPunctSpace(\\\\*+)(?!\\\\*)(?=punctSpace|$)|(?!\\\\*)[\\\\s](\\\\*+)(?=notPunctSpace)|[\\\\s](\\\\*+)(?!\\\\*)(?=punct)|(?!\\\\*)punct(\\\\*+)(?!\\\\*)(?=punct)|(?:(?!\\\\*)punct|notPunctSpace)(\\\\*+)(?!\\\\*)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, un).replace(/punctSpace/g, It).replace(/punct/g, Ge).getRegex(), vs = I("^[^_*]*?\\\\*\\\\*[^_*]*?_[^_*]*?(?=\\\\*\\\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, un).replace(/punctSpace/g, It).replace(/punct/g, Ge).getRegex(), Ss = I("^[^_*]*?\\\\*\\\\*[^_*]*?_[^_*]*?(?=\\\\*\\\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\\\s](_+)(?=notPunctSpace)|[\\\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, un).replace(/punctSpace/g, It).replace(/punct/g, Ge).getRegex(), As = I(/^~~?(?:((?!~)punct)|[^\\s~])/, "u").replace(/punct/g, Ge).getRegex(), Rs = I("^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, un).replace(/punctSpace/g, It).replace(/punct/g, Ge).getRegex(), Ms = I(/\\\\(punct)/, "gu").replace(/punct/g, Ge).getRegex(), Os = I(/^<(scheme:[^\\s\\x00-\\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Ns = I(gr).replace("(?:-->|$)", "-->").getRegex(), Ps = I("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\\\s*/?>|^<\\\\?[\\\\s\\\\S]*?\\\\?>|^<![a-zA-Z]+\\\\s[\\\\s\\\\S]*?>|^<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?\\\\]\\\\]>").replace("comment", Ns).replace("attribute", /\\s+[a-zA-Z:_][\\w.:-]*(?:\\s*=\\s*"[^"]*"|\\s*=\\s*'[^']*'|\\s*=\\s*[^\\s"'=<>\`]+)?/).getRegex(), wi = /\\[(?:\\\\[\\s\\S]|[^\\[\\]\\\\])*\\]/, In = I(/(?:\\[(?:brackets|\\\\[\\s\\S]|[^\\[\\]\\\\])*\\]|\\\\[\\s\\S]|\`+(?!\`)[^\`]*?\`+(?!\`)|\`\`+(?=\\])|[^\\[\\]\\\\\`])*?/).replace("brackets", wi).getRegex(), Cs = I(/^!?\\[(label)\\]\\([ \\t\\n]*(href)(?:(?:[ \\t]+(?:\\n[ \\t]*)?|\\n[ \\t]*)(title))?[ \\t\\n]*\\)/).replace("label", In).replace("href", /<(?:\\\\.|[^\\n<>\\\\])+>|[^ \\t\\n\\x00-\\x1f]+|(?=\\))/).replace("title", /"(?:\\\\"?|[^"\\\\])*"|'(?:\\\\'?|[^'\\\\])*'|\\((?:\\\\\\)?|[^)\\\\])*\\)/).getRegex(), Is = I(/^!?\\[(label)\\]\\[(ref)\\]/).replace("label", In).replace("ref", dr).getRegex(), Ls = I(/^!?\\[(ref)\\](?:\\[\\])?/).replace("ref", dr).getRegex(), Nr = /(?!\\s*\\])(?:\\\\[\\s\\S]|[^\\[\\]\\\\]){1,999}/, Ds = I(/(?:[^\\[\\]\\\\\`]*(?:\\[(?:brackets|\\\\[\\s\\S]|[^\\[\\]\\\\])*\\]|\\\\[\\s\\S]|\`+(?!\`)[^\`]*?\`+(?!\`)|\`\`+(?=\\]))){0,999}?[^\\[\\]\\\\\`]*?/).replace("brackets", wi).getRegex(), zs = I("reflink|nolink(?!\\\\()", "g").replace("reflink", I(/^!?\\[(label)\\]\\[(ref)\\]/).replace("label", Ds).replace("ref", Nr).getRegex()).replace("nolink", I(/^!?\\[(ref)\\](?:\\[\\])?/).replace("ref", Nr).getRegex()).getRegex(), Pr = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, $s = I(/(?:mailto:email|xmpp:email(?:\\/[A-Za-z0-9@.]+)?)/).replace(/email/g, /[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\\w-])/).getRegex(), _r = {
	_backpedal: wt,
	anyPunctuation: Ms,
	autolink: Os,
	blockSkip: bs,
	br: mi,
	code: fs,
	del: wt,
	delLDelim: wt,
	delRDelim: wt,
	emStrongLDelim: ys,
	emStrongRDelimAst: Es,
	emStrongRDelimUnd: vs,
	escape: hs,
	link: Cs,
	nolink: Ls,
	punctuation: ds,
	reflink: Is,
	reflinkSearch: zs,
	tag: Ps,
	text: ps,
	url: wt
}, Bs = {
	..._r,
	emStrongLDelim: xs,
	emStrongRDelimAst: Ts,
	emStrongRDelimUnd: Ss,
	link: I(/^!?\\[(label)\\]\\((.*?)\\)/).replace("label", In).getRegex(),
	reflink: I(/^!?\\[(label)\\]\\s*\\[([^\\]]*)\\]/).replace("label", In).getRegex()
}, sr = {
	..._r,
	emStrongRDelimAst: ks,
	emStrongLDelim: ws,
	delLDelim: As,
	delRDelim: Rs,
	url: I(/^emailProtocol|^((?:protocol):\\/\\/|www\\.)(?:[a-zA-Z0-9\\-]+\\.?)+[^\\s<]*|^email/).replace("emailProtocol", $s).replace("protocol", Pr).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\\w-])/).getRegex(),
	_backpedal: /(?:[^?!.,:;*_'"~()&]+|\\([^)]*\\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
	del: /^(~~?)(?=[^\\s~])((?:\\\\[\\s\\S]|[^\\\\])*?(?:\\\\[\\s\\S]|[^\\s~\\\\]))\\1(?=[^~]|$)/,
	text: I(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(\`+|~+|[^\`~])(?:(?=[\`~])|(?= {2,}\\n)|(?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*~_]|\\b_|protocol:\\/\\/|www\\.|$)|[^ ](?= {2,}\\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-](?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@))))/).replace("protocol", Pr).replace(/emailProtocol/g, /(?:mailto|xmpp):/).getRegex()
}, Us = {
	...sr,
	br: I(mi).replace("{2,}", "*").getRegex(),
	text: I(sr.text).replace("\\\\b_", "\\\\b_| {2,}\\\\n").replace(/\\{2,\\}/g, "*").getRegex()
}, An = {
	normal: mr,
	gfm: cs,
	pedantic: us
}, Qt = {
	normal: _r,
	gfm: sr,
	breaks: Us,
	pedantic: Bs
}, Fs = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\\"": "&quot;",
	"'": "&#39;"
}, Cr = (e) => Fs[e];
function Te(e, t) {
	if (t) {
		if (ae.escapeTest.test(e)) return e.replace(ae.escapeReplace, Cr);
	} else if (ae.escapeTestNoEncode.test(e)) return e.replace(ae.escapeReplaceNoEncode, Cr);
	return e;
}
function js(e) {
	return e.replace(ae.numericCharacterReference, (t, n, r) => {
		let i = n === void 0 ? Number.parseInt(r, 16) : Number.parseInt(n, 10);
		return i === 0 || i > 1114111 || i >= 55296 && i <= 57343 ? "�" : String.fromCodePoint(i);
	});
}
function Ir(e) {
	try {
		e = encodeURI(e).replace(ae.percentDecode, "%");
	} catch {
		return null;
	}
	return e;
}
function Lr(e, t) {
	let n = e.replace(ae.findPipe, (i, s, l) => {
		let o = !1, u = s;
		for (; --u >= 0 && l[u] === "\\\\";) o = !o;
		return o ? "|" : " |";
	}).split(ae.splitPipe), r = 0;
	if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), t) if (n.length > t) n.splice(t);
	else for (; n.length < t;) n.push("");
	for (; r < n.length; r++) n[r] = n[r].trim().replace(ae.slashPipe, "|");
	return n;
}
function tt(e, t, n) {
	let r = e.length;
	if (r === 0) return "";
	let i = 0;
	for (; i < r;) {
		let s = e.charAt(r - i - 1);
		if (s === t && !n) i++;
		else if (s !== t && n) i++;
		else break;
	}
	return e.slice(0, r - i);
}
function Dr(e) {
	let t = e.split(\`
\`), n = t.length - 1;
	for (; n >= 0 && ae.blankLine.test(t[n]);) n--;
	return t.length - n <= 2 ? e : t.slice(0, n + 1).join(\`
\`);
}
function Ln(e) {
	return e.trim().toLowerCase().toUpperCase().toLowerCase();
}
function zr(e, t) {
	if (e.indexOf(t[0]) === -1 && e.indexOf(t[1]) === -1) return -1;
	let n = 0;
	for (let r = 0; r < e.length; r++) if (e[r] === "\\\\") r++;
	else if (e[r] === t[0]) n++;
	else if (e[r] === t[1] && (n--, n < 0)) return r;
	return n > 0 ? -2 : -1;
}
function $r(e, t = 0) {
	let n = t, r = "";
	for (let i of e) if (i === "	") {
		let s = 4 - n % 4;
		r += " ".repeat(s), n += s;
	} else r += i, n++;
	return r;
}
function Br(e, t, n, r, i) {
	let s = t.href, l = t.title || null, o = e[1].replace(i.other.outputLinkReplace, "$1"), u = e[0].charAt(0) === "!";
	r.state.inLink = !0;
	let f = r.state.linkEmitted, g = r.state.inRawBlock;
	r.state.linkEmitted = !1;
	let w = r.inlineTokens(o), P = r.state.linkEmitted;
	if (r.state.linkEmitted = f, r.state.inLink = !1, !u) {
		if (P) {
			r.state.inRawBlock = g;
			return;
		}
		r.state.linkEmitted = !0;
	}
	return {
		type: u ? "image" : "link",
		raw: n,
		href: s,
		title: l,
		text: o,
		tokens: w
	};
}
function Hs(e, t, n) {
	let r = e.match(n.other.indentCodeCompensation);
	if (r === null) return t;
	let i = r[1];
	return t.split(\`
\`).map((s) => {
		let l = s.match(n.other.beginningSpace);
		if (l === null) return s;
		let [o] = l;
		return s.slice(Math.min(o.length, i.length));
	}).join(\`
\`);
}
function Ur(e, t, n, r) {
	if (!t.includes("<")) return !1;
	for (let i = 0; i < t.length; i++) {
		if (t[i] === "\\\\") {
			i++;
			continue;
		}
		if (t[i] === "\`") {
			let o = r.inline.code.exec(t.slice(i));
			if (o) {
				i += o[0].length - 1;
				continue;
			}
		}
		if (t[i] !== "<") continue;
		let s = e.slice(n + i), l = r.inline.tag.exec(s) || r.inline.autolink.exec(s);
		if (l) {
			if (l[0].length > t.length - i) return !0;
			i += l[0].length - 1;
		}
	}
	return !1;
}
var on = class {
	options;
	rules;
	lexer;
	constructor(e) {
		this.options = e || st;
	}
	space(e) {
		let t = this.rules.block.newline.exec(e);
		if (t && t[0].length > 0) return {
			type: "space",
			raw: t[0]
		};
	}
	code(e) {
		let t = this.rules.block.code.exec(e);
		if (t) {
			let n = this.options.pedantic ? t[0] : Dr(t[0]);
			return {
				type: "code",
				raw: n,
				codeBlockStyle: "indented",
				text: n.replace(this.rules.other.codeRemoveIndent, "")
			};
		}
	}
	fences(e) {
		let t = this.rules.block.fences.exec(e);
		if (t) {
			let n = t[0], r = Hs(n, t[3] || "", this.rules);
			return {
				type: "code",
				raw: n,
				lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2],
				text: r
			};
		}
	}
	heading(e) {
		let t = this.rules.block.heading.exec(e);
		if (t) {
			let n = t[2].trim();
			if (this.rules.other.endingHash.test(n)) {
				let r = tt(n, "#");
				(this.options.pedantic || !r || this.rules.other.endingSpaceTabChar.test(r)) && (n = r.trim());
			}
			return {
				type: "heading",
				raw: tt(t[0], \`
\`),
				depth: t[1].length,
				text: n,
				tokens: this.lexer.inline(n)
			};
		}
	}
	hr(e) {
		let t = this.rules.block.hr.exec(e);
		if (t) return {
			type: "hr",
			raw: tt(t[0], \`
\`)
		};
	}
	blockquote(e) {
		let t = this.rules.block.blockquote.exec(e);
		if (t) {
			let n = tt(t[0], \`
\`).split(\`
\`), r = "", i = "", s = [];
			for (; n.length > 0;) {
				let l = !1, o = [], u = 0;
				for (; u < n.length; u++) if (this.rules.other.blockquoteStart.test(n[u])) o.push(n[u]), l = !0;
				else if (!l) o.push(n[u]);
				else break;
				n = n.slice(u);
				let f = o.join(\`
\`), g = f.replace(this.rules.other.blockquoteSetextReplace, \`
    $1\`).replace(this.rules.other.blockquoteSetextReplace2, "");
				r = r ? \`\${r}
\${f}\` : f, i = i ? \`\${i}
\${g}\` : g;
				let w = this.lexer.state.top;
				if (this.lexer.state.top = !0, this.lexer.blockTokens(g, s, !0), this.lexer.state.top = w, n.length === 0) break;
				let P = s.at(-1);
				if (P?.type === "code") break;
				if (P?.type === "blockquote") {
					let M = P, T = n.join(\`
\`), z = M.raw + \`
\` + T.replace(this.rules.other.blockquoteSetextReplace2, ""), R = this.blockquote(z);
					s[s.length - 1] = R;
					let $ = z.substring(R.raw.length).replace(/^\\n/, ""), re = $ ? $.split(\`
\`).length : 0, ee = re ? n.slice(0, -re) : n;
					ee.length > 0 && (r = \`\${r}
\${ee.join(\`
\`)}\`), i = i.substring(0, i.length - M.text.length) + R.text;
					break;
				} else if (P?.type === "list") {
					let M = P, T = M.raw + \`
\` + n.join(\`
\`), z = this.list(T);
					s[s.length - 1] = z, r = r.substring(0, r.length - P.raw.length) + z.raw, i = i.substring(0, i.length - M.raw.length) + z.raw, n = T.substring(s.at(-1).raw.length).split(\`
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
	list(e) {
		let t = this.rules.block.list.exec(e);
		if (t) {
			let n = t[1].trim(), r = n.length > 1, i = {
				type: "list",
				raw: "",
				ordered: r,
				start: r ? +n.slice(0, -1) : "",
				loose: !1,
				items: []
			};
			n = r ? \`\\\\d{1,9}\\\\\${n.slice(-1)}\` : \`\\\\\${n}\`, this.options.pedantic && (n = r ? n : "[*+-]");
			let s = this.rules.other.listItemRegex(n), l = !1;
			for (; e;) {
				let u = !1, f = "", g = "";
				if (!(t = s.exec(e)) || this.rules.block.hr.test(e)) break;
				f = t[0], e = e.substring(f.length);
				let w = t[2].split(\`
\`, 1)[0], P = t[1].length, M = this.options.pedantic ? $r(w, P) : w.replace(this.rules.other.leadingSpaceTab, ($) => $r($, P)), T = e.split(\`
\`, 1)[0], z = !M.trim(), R = 0;
				if (this.options.pedantic ? (R = 2, g = M.trimStart()) : z ? R = P + 1 : (R = M.search(this.rules.other.nonSpaceChar), R = R > 4 ? 1 : R, g = M.slice(R), R += P), z && this.rules.other.blankLine.test(T) && (f += T + \`
\`, e = e.substring(T.length + 1), u = !0), !u) {
					let $ = this.rules.other.nextBulletRegex(R), re = this.rules.other.hrRegex(R), ee = this.rules.other.fencesBeginRegex(R), he = this.rules.other.headingBeginRegex(R), ye = this.rules.other.htmlBeginRegex(R), Ce = this.rules.other.blockquoteBeginRegex(R);
					for (; e;) {
						let X = e.split(\`
\`, 1)[0], de;
						if (T = X, this.options.pedantic ? (T = T.replace(this.rules.other.listReplaceNesting, "  "), de = T) : de = T.replace(this.rules.other.leadingSpaceTab, (te) => te.replace(this.rules.other.tabCharGlobal, "    ")), ee.test(T) || he.test(T) || ye.test(T) || Ce.test(T) || $.test(T) || re.test(T)) break;
						if (de.search(this.rules.other.nonSpaceChar) >= R || !T.trim()) g += \`
\` + de.slice(R);
						else {
							if (z || M.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || ee.test(M) || he.test(M) || re.test(M)) break;
							g += \`
\` + T;
						}
						z = !T.trim(), f += X + \`
\`, e = e.substring(X.length + 1), M = de.slice(R);
					}
				}
				i.loose || (l ? i.loose = !0 : this.rules.other.doubleBlankLine.test(f) && (l = !0)), i.items.push({
					type: "list_item",
					raw: f,
					task: !!this.options.gfm && this.rules.other.listIsTask.test(g),
					loose: !1,
					text: g,
					tokens: []
				}), i.raw += f;
			}
			let o = i.items.at(-1);
			if (o) o.raw = o.raw.trimEnd(), o.text = o.text.trimEnd();
			else return;
			i.raw = i.raw.trimEnd();
			for (let u of i.items) if (this.lexer.state.top = !1, u.tokens = this.lexer.blockTokens(u.text, []), !i.loose) {
				let f = u.tokens.filter((g) => g.type === "space");
				i.loose = f.length > 0 && f.some((g) => this.rules.other.anyLine.test(g.raw));
			}
			for (let u of i.items) {
				let f = u.tokens[0];
				if (u.task && (f?.type === "text" || f?.type === "paragraph")) {
					u.text = u.text.replace(this.rules.other.listReplaceTask, ""), f.raw = f.raw.replace(this.rules.other.listReplaceTask, ""), f.text = f.text.replace(this.rules.other.listReplaceTask, "");
					for (let w = this.lexer.inlineQueue.length - 1; w >= 0; w--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[w].src)) {
						this.lexer.inlineQueue[w].src = this.lexer.inlineQueue[w].src.replace(this.rules.other.listReplaceTask, "");
						break;
					}
					let g = this.rules.other.listTaskCheckbox.exec(u.raw);
					if (g) {
						let w = {
							type: "checkbox",
							raw: g[0] + " ",
							checked: g[0] !== "[ ]"
						};
						u.checked = w.checked, i.loose ? u.tokens[0] && ["paragraph", "text"].includes(u.tokens[0].type) && "tokens" in u.tokens[0] && u.tokens[0].tokens ? (u.tokens[0].raw = w.raw + u.tokens[0].raw, u.tokens[0].text = w.raw + u.tokens[0].text, u.tokens[0].tokens.unshift(w)) : u.tokens.unshift({
							type: "paragraph",
							raw: w.raw,
							text: w.raw,
							tokens: [w]
						}) : u.tokens.unshift(w);
					}
				} else u.task && (u.task = !1);
			}
			if (i.loose) for (let u of i.items) {
				u.loose = !0;
				for (let f of u.tokens) f.type === "text" && (f.type = "paragraph");
			}
			return i;
		}
	}
	html(e) {
		let t = this.rules.block.html.exec(e);
		if (t) {
			let n = Dr(t[0]);
			return {
				type: "html",
				block: !0,
				raw: n,
				pre: t[1] === "pre" || t[1] === "script" || t[1] === "style",
				text: n
			};
		}
	}
	def(e) {
		let t = this.rules.block.def.exec(e);
		if (t) {
			if (!this.rules.other.startAngleBracket.test(t[2]) && zr(t[2], "()") !== -1) return;
			let n = Ln(t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), r = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
			return {
				type: "def",
				tag: n,
				raw: tt(t[0], \`
\`),
				href: r,
				title: i
			};
		}
	}
	table(e) {
		let t = this.rules.block.table.exec(e);
		if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
		let n = Lr(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(\`
\`) : [], s = {
			type: "table",
			raw: tt(t[0], \`
\`),
			header: [],
			align: [],
			rows: []
		};
		if (n.length === r.length) {
			for (let l of r) this.rules.other.tableAlignRight.test(l) ? s.align.push("right") : this.rules.other.tableAlignCenter.test(l) ? s.align.push("center") : this.rules.other.tableAlignLeft.test(l) ? s.align.push("left") : s.align.push(null);
			for (let l = 0; l < n.length; l++) s.header.push({
				text: n[l],
				tokens: this.lexer.inline(n[l]),
				header: !0,
				align: s.align[l]
			});
			for (let l of i) s.rows.push(Lr(l, s.header.length).map((o, u) => ({
				text: o,
				tokens: this.lexer.inline(o),
				header: !1,
				align: s.align[u]
			})));
			return s;
		}
	}
	lheading(e) {
		let t = this.rules.block.lheading.exec(e);
		if (t) {
			let n = t[1].trim();
			return {
				type: "heading",
				raw: tt(t[0], \`
\`),
				depth: t[2].charAt(0) === "=" ? 1 : 2,
				text: n,
				tokens: this.lexer.inline(n)
			};
		}
	}
	paragraph(e) {
		let t = this.rules.block.paragraph.exec(e);
		if (t) {
			let n = t[1].charAt(t[1].length - 1) === \`
\` ? t[1].slice(0, -1) : t[1];
			return {
				type: "paragraph",
				raw: t[0],
				text: n,
				tokens: this.lexer.inline(n)
			};
		}
	}
	text(e) {
		let t = this.rules.block.text.exec(e);
		if (t) return {
			type: "text",
			raw: t[0],
			text: t[0],
			tokens: this.lexer.inline(t[0])
		};
	}
	escape(e) {
		let t = this.rules.inline.escape.exec(e);
		if (t) return {
			type: "escape",
			raw: t[0],
			text: t[1]
		};
	}
	tag(e) {
		let t = this.rules.inline.tag.exec(e);
		if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = !1), {
			type: "html",
			raw: t[0],
			inLink: this.lexer.state.inLink,
			inRawBlock: this.lexer.state.inRawBlock,
			block: !1,
			text: t[0]
		};
	}
	link(e) {
		if (this.lexer.state.linkParenPossible === !1) return;
		let t = this.rules.inline.link.exec(e);
		if (t) {
			let n = t[0].charAt(0) === "!" ? 2 : 1;
			if (!this.options.pedantic && Ur(e, t[1], n, this.rules)) return;
			let r = t[2].trim();
			if (!this.options.pedantic && this.rules.other.startAngleBracket.test(r)) {
				if (!this.rules.other.endAngleBracket.test(r)) return;
				let l = tt(r.slice(0, -1), "\\\\");
				if ((r.length - l.length) % 2 === 0) return;
			} else {
				let l = zr(t[2], "()");
				if (l === -2) return;
				if (l > -1) {
					let o = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + l;
					t[2] = t[2].substring(0, l), t[0] = t[0].substring(0, o).trim(), t[3] = "";
				}
			}
			let i = t[2], s = "";
			if (this.options.pedantic) {
				let l = this.rules.other.pedanticHrefTitle.exec(i);
				l && (i = l[1], s = l[3]);
			} else s = t[3] ? t[3].slice(1, -1) : "";
			return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? i = i.slice(1) : i = i.slice(1, -1)), Br(t, {
				href: i && i.replace(this.rules.inline.anyPunctuation, "$1"),
				title: s && s.replace(this.rules.inline.anyPunctuation, "$1")
			}, t[0], this.lexer, this.rules);
		}
	}
	reflink(e, t) {
		let n;
		if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
			let r = n[0].charAt(0) === "!" ? 2 : 1;
			if (!this.options.pedantic && Ur(e, n[1], r, this.rules)) return;
			let i = t[Ln((n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "))];
			if (!i) {
				let s = n[0].charAt(0);
				return {
					type: "text",
					raw: s,
					text: s
				};
			}
			return Br(n, i, n[0], this.lexer, this.rules);
		}
	}
	emStrong(e, t, n = "") {
		let r = this.rules.inline.emStrongLDelim.exec(e);
		if (!(!r || !r[1] && !r[2] && !r[3] && !r[4] || r[4] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[3]) || !n || this.rules.inline.punctuation.exec(n))) {
			let i = [...r[0]].length - 1, s, l, o = i, u = 0, f = r[0][0], g = n === f, w = f === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
			for (w.lastIndex = 0, t = t.slice(-1 * e.length + i); (r = w.exec(t)) !== null;) {
				if (s = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !s) continue;
				if (l = [...s].length, r[3] || r[4]) {
					o += l;
					continue;
				} else if (r[5] || r[6]) {
					if (i % 3 && !((i + l) % 3)) {
						u += l;
						continue;
					}
					if (g) break;
				}
				if (o -= l, o > 0) continue;
				l = Math.min(l, l + o + u);
				let P = [...r[0]][0].length, M = e.slice(0, i + r.index + P + l);
				if (Math.min(i, l) % 2) {
					let z = M.slice(1, -1);
					return {
						type: "em",
						raw: M,
						text: z,
						tokens: this.lexer.inlineTokens(z)
					};
				}
				let T = M.slice(2, -2);
				return {
					type: "strong",
					raw: M,
					text: T,
					tokens: this.lexer.inlineTokens(T)
				};
			}
		}
	}
	codespan(e) {
		let t = this.rules.inline.code.exec(e);
		if (t) {
			let n = t[2].replace(this.rules.other.newLineCharGlobal, " "), r = this.rules.other.nonSpaceChar.test(n), i = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
			return r && i && (n = n.substring(1, n.length - 1)), {
				type: "codespan",
				raw: t[0],
				text: n
			};
		}
	}
	br(e) {
		let t = this.rules.inline.br.exec(e);
		if (t) return {
			type: "br",
			raw: t[0]
		};
	}
	del(e, t, n = "") {
		let r = this.rules.inline.delLDelim.exec(e);
		if (r && (!r[1] || !n || this.rules.inline.punctuation.exec(n))) {
			let i = [...r[0]].length - 1, s, l, o = i, u = this.rules.inline.delRDelim;
			for (u.lastIndex = 0, t = t.slice(-1 * e.length + i); (r = u.exec(t)) !== null;) {
				if (s = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !s || (l = [...s].length, l !== i)) continue;
				if (r[3] || r[4]) {
					o += l;
					continue;
				}
				if (o -= l, o > 0) continue;
				l = Math.min(l, l + o);
				let f = [...r[0]][0].length, g = e.slice(0, i + r.index + f + l), w = g.slice(i, -i);
				return {
					type: "del",
					raw: g,
					text: w,
					tokens: this.lexer.inlineTokens(w)
				};
			}
		}
	}
	autolink(e) {
		let t = this.rules.inline.autolink.exec(e);
		if (t) {
			let n, r;
			return t[2] === "@" ? (n = t[1], r = "mailto:" + n) : (n = t[1], r = n), {
				type: "link",
				raw: t[0],
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
	url(e) {
		let t;
		if (t = this.rules.inline.url.exec(e)) {
			let n, r;
			if (t[2] === "@") n = t[0], r = "mailto:" + n;
			else {
				let i;
				do
					i = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
				while (i !== t[0]);
				n = t[0], t[1] === "www." ? r = "http://" + t[0] : r = t[0];
			}
			return {
				type: "link",
				raw: t[0],
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
	inlineText(e) {
		let t = this.rules.inline.text.exec(e);
		if (t) {
			let n = this.lexer.state.inRawBlock;
			return {
				type: "text",
				raw: t[0],
				text: n ? t[0] : js(t[0]),
				escaped: n
			};
		}
	}
}, Oe = class or {
	tokens;
	options;
	state;
	inlineQueue;
	tokenizer;
	constructor(t) {
		this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || st, this.options.tokenizer = this.options.tokenizer || new on(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
			inLink: !1,
			inRawBlock: !1,
			linkEmitted: !1,
			linkParenPossible: !0,
			top: !0
		};
		let n = {
			other: ae,
			block: An.normal,
			inline: Qt.normal
		};
		this.options.pedantic ? (n.block = An.pedantic, n.inline = Qt.pedantic) : this.options.gfm && (n.block = An.gfm, this.options.breaks ? n.inline = Qt.breaks : n.inline = Qt.gfm), this.tokenizer.rules = n;
	}
	static get rules() {
		return {
			block: An,
			inline: Qt
		};
	}
	static lex(t, n) {
		return new or(n).lex(t);
	}
	static lexInline(t, n) {
		return new or(n).inlineTokens(t);
	}
	lex(t) {
		t = t.replace(ae.carriageReturn, \`
\`), this.blockTokens(t, this.tokens);
		for (let n = 0; n < this.inlineQueue.length; n++) {
			let r = this.inlineQueue[n];
			this.inlineTokens(r.src, r.tokens);
		}
		return this.inlineQueue = [], this.tokens;
	}
	blockTokens(t, n = [], r = !1) {
		this.tokenizer.lexer = this, this.options.pedantic && (t = t.replace(ae.tabCharGlobal, "    ").replace(ae.spaceLine, ""));
		let i = 1 / 0;
		for (; t;) {
			if (t.length < i) i = t.length;
			else {
				this.infiniteLoopError(t.charCodeAt(0));
				break;
			}
			let s;
			if (this.options.extensions?.block?.some((o) => (s = o.call({ lexer: this }, t, n)) ? (t = t.substring(s.raw.length), n.push(s), !0) : !1)) continue;
			if (s = this.tokenizer.space(t)) {
				t = t.substring(s.raw.length);
				let o = n.at(-1);
				s.raw.length === 1 && o !== void 0 ? o.raw += \`
\` : n.push(s);
				continue;
			}
			if (s = this.tokenizer.code(t)) {
				t = t.substring(s.raw.length);
				let o = n.at(-1);
				o?.type === "paragraph" || o?.type === "text" ? (o.raw += (o.raw.endsWith(\`
\`) ? "" : \`
\`) + s.raw, o.text += \`
\` + s.text, this.inlineQueue.at(-1).src = o.text) : n.push(s);
				continue;
			}
			if (s = this.tokenizer.fences(t)) {
				t = t.substring(s.raw.length), n.push(s);
				continue;
			}
			if (s = this.tokenizer.heading(t)) {
				t = t.substring(s.raw.length), n.push(s);
				continue;
			}
			if (s = this.tokenizer.hr(t)) {
				t = t.substring(s.raw.length), n.push(s);
				continue;
			}
			if (s = this.tokenizer.blockquote(t)) {
				t = t.substring(s.raw.length), n.push(s);
				continue;
			}
			if (s = this.tokenizer.list(t)) {
				t = t.substring(s.raw.length), n.push(s);
				continue;
			}
			if (s = this.tokenizer.html(t)) {
				t = t.substring(s.raw.length), n.push(s);
				continue;
			}
			if (s = this.tokenizer.def(t)) {
				t = t.substring(s.raw.length);
				let o = n.at(-1);
				o?.type === "paragraph" || o?.type === "text" ? (o.raw += (o.raw.endsWith(\`
\`) ? "" : \`
\`) + s.raw, o.text += \`
\` + s.raw, this.inlineQueue.at(-1).src = o.text) : this.tokens.links[s.tag] || (this.tokens.links[s.tag] = {
					href: s.href,
					title: s.title
				}, n.push(s));
				continue;
			}
			if (s = this.tokenizer.table(t)) {
				t = t.substring(s.raw.length), n.push(s);
				continue;
			}
			if (s = this.tokenizer.lheading(t)) {
				t = t.substring(s.raw.length), n.push(s);
				continue;
			}
			let l = t;
			if (this.options.extensions?.startBlock) {
				let o = 1 / 0, u = t.slice(1), f;
				this.options.extensions.startBlock.forEach((g) => {
					f = g.call({ lexer: this }, u), typeof f == "number" && f >= 0 && (o = Math.min(o, f));
				}), o < 1 / 0 && o >= 0 && (l = t.substring(0, o + 1));
			}
			if (this.state.top && (s = this.tokenizer.paragraph(l))) {
				let o = n.at(-1);
				r && o?.type === "paragraph" ? (o.raw += (o.raw.endsWith(\`
\`) ? "" : \`
\`) + s.raw, o.text += \`
\` + s.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : n.push(s), r = l.length !== t.length, t = t.substring(s.raw.length);
				continue;
			}
			if (s = this.tokenizer.text(t)) {
				t = t.substring(s.raw.length);
				let o = n.at(-1);
				o?.type === "text" ? (o.raw += (o.raw.endsWith(\`
\`) ? "" : \`
\`) + s.raw, o.text += \`
\` + s.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : n.push(s);
				continue;
			}
			if (t) {
				this.infiniteLoopError(t.charCodeAt(0));
				break;
			}
		}
		return this.state.top = !0, n;
	}
	inline(t, n = []) {
		return this.inlineQueue.push({
			src: t,
			tokens: n
		}), n;
	}
	linkInText(t) {
		if (!t.includes("[")) return !1;
		let n = this.tokenizer.rules.inline.link;
		for (let r of t.matchAll(this.tokenizer.rules.inline.blockSkip)) if (n.test(r[0]) && t.charAt(r.index - 1) !== "!") return !0;
		for (let r of t.matchAll(this.tokenizer.rules.inline.reflinkSearch)) {
			let i = r[0], s = i.lastIndexOf("[");
			if (!(i.charAt(0) === "!" || !Object.hasOwn(this.tokens.links, Ln(i.slice(s + 1, -1)))) && !(s > 1 && this.linkInText(i.slice(1, s - 1)))) return !0;
		}
		return !1;
	}
	inlineTokens(t, n = []) {
		this.tokenizer.lexer = this;
		let r = this.state.linkParenPossible;
		this.state.linkParenPossible = r && t.includes(")");
		try {
			return this.#e(t, n);
		} finally {
			this.state.linkParenPossible = r;
		}
	}
	#e(t, n) {
		let r = t;
		if (this.tokens.links && t.includes("[")) {
			let o = this.tokenizer.rules.inline.reflinkSearch, u = (f) => {
				let g = f.lastIndexOf("[");
				if (!Object.hasOwn(this.tokens.links, Ln(f.slice(g + 1, -1)))) return f;
				if (g > 1 && f.charAt(0) !== "!") {
					let w = f.slice(1, g - 1);
					if (this.linkInText(w)) return "[" + w.replace(o, u) + "][" + "a".repeat(f.length - g - 2) + "]";
				}
				return "[" + "a".repeat(f.length - 2) + "]";
			};
			r = r.replace(o, u);
		}
		r = r.replace(this.tokenizer.rules.inline.anyPunctuation, (o) => "+".repeat(o.length)), r = r.replace(this.tokenizer.rules.inline.blockSkip, (o, u, f) => {
			let g = f ? f.length : 0;
			return o.slice(0, g) + "[" + "a".repeat(o.length - g - 2) + "]";
		}), r = this.options.hooks?.emStrongMask?.call({ lexer: this }, r) ?? r;
		let i = !1, s = "", l = 1 / 0;
		for (; t;) {
			if (t.length < l) l = t.length;
			else {
				this.infiniteLoopError(t.charCodeAt(0));
				break;
			}
			i || (s = ""), i = !1;
			let o;
			if (this.options.extensions?.inline?.some((f) => (o = f.call({ lexer: this }, t, n)) ? (t = t.substring(o.raw.length), n.push(o), !0) : !1)) continue;
			if (o = this.tokenizer.escape(t)) {
				t = t.substring(o.raw.length), n.push(o);
				continue;
			}
			if (o = this.tokenizer.tag(t)) {
				t = t.substring(o.raw.length), n.push(o);
				continue;
			}
			if (o = this.tokenizer.link(t)) {
				t = t.substring(o.raw.length), n.push(o);
				continue;
			}
			if (o = this.tokenizer.reflink(t, this.tokens.links)) {
				t = t.substring(o.raw.length);
				let f = n.at(-1);
				o.type === "text" && f?.type === "text" ? (f.raw += o.raw, f.text += o.text) : n.push(o);
				continue;
			}
			if (o = this.tokenizer.emStrong(t, r, s)) {
				t = t.substring(o.raw.length), n.push(o);
				continue;
			}
			if (o = this.tokenizer.codespan(t)) {
				t = t.substring(o.raw.length), n.push(o);
				continue;
			}
			if (o = this.tokenizer.br(t)) {
				t = t.substring(o.raw.length), n.push(o);
				continue;
			}
			if (o = this.tokenizer.del(t, r, s)) {
				t = t.substring(o.raw.length), n.push(o);
				continue;
			}
			if (o = this.tokenizer.autolink(t)) {
				t = t.substring(o.raw.length), n.push(o);
				continue;
			}
			if (!this.state.inLink && (o = this.tokenizer.url(t))) {
				t = t.substring(o.raw.length), n.push(o);
				continue;
			}
			let u = t;
			if (this.options.extensions?.startInline) {
				let f = 1 / 0, g = t.slice(1), w;
				this.options.extensions.startInline.forEach((P) => {
					w = P.call({ lexer: this }, g), typeof w == "number" && w >= 0 && (f = Math.min(f, w));
				}), f < 1 / 0 && f >= 0 && (u = t.substring(0, f + 1));
			}
			if (o = this.tokenizer.inlineText(u)) {
				t = t.substring(o.raw.length), o.raw.slice(-1) !== "_" && (s = o.raw.slice(-1)), i = !0;
				let f = n.at(-1);
				f?.type === "text" ? (f.raw += o.raw, f.text += o.text) : n.push(o);
				continue;
			}
			if (t) {
				this.infiniteLoopError(t.charCodeAt(0));
				break;
			}
		}
		return n;
	}
	infiniteLoopError(t) {
		let n = "Infinite loop on byte: " + t;
		if (this.options.silent) console.error(n);
		else throw new Error(n);
	}
}, an = class {
	options;
	parser;
	constructor(e) {
		this.options = e || st;
	}
	space(e) {
		return "";
	}
	code({ text: e, lang: t, escaped: n }) {
		let r = (t || "").match(ae.notSpaceStart)?.[0], i = e ? e.replace(ae.endingNewline, "") + \`
\` : "";
		return r ? "<pre><code class=\\"language-" + Te(r) + "\\">" + (n ? i : Te(i, !0)) + \`</code></pre>
\` : "<pre><code>" + (n ? i : Te(i, !0)) + \`</code></pre>
\`;
	}
	blockquote({ tokens: e }) {
		return \`<blockquote>
\${this.parser.parse(e)}</blockquote>
\`;
	}
	html({ text: e }) {
		return e;
	}
	def(e) {
		return "";
	}
	heading({ tokens: e, depth: t }) {
		return \`<h\${t}>\${this.parser.parseInline(e)}</h\${t}>
\`;
	}
	hr(e) {
		return \`<hr>
\`;
	}
	list(e) {
		let t = e.ordered, n = e.start, r = "";
		for (let l = 0; l < e.items.length; l++) {
			let o = e.items[l];
			r += this.listitem(o);
		}
		let i = t ? "ol" : "ul", s = t && n !== 1 ? " start=\\"" + n + "\\"" : "";
		return "<" + i + s + \`>
\` + r + "</" + i + \`>
\`;
	}
	listitem(e) {
		return \`<li>\${this.parser.parse(e.tokens)}</li>
\`;
	}
	checkbox({ checked: e }) {
		return "<input " + (e ? "checked=\\"\\" " : "") + "disabled=\\"\\" type=\\"checkbox\\"> ";
	}
	paragraph({ tokens: e }) {
		return \`<p>\${this.parser.parseInline(e)}</p>
\`;
	}
	table(e) {
		let t = "", n = "";
		for (let i = 0; i < e.header.length; i++) n += this.tablecell(e.header[i]);
		t += this.tablerow({ text: n });
		let r = "";
		for (let i = 0; i < e.rows.length; i++) {
			let s = e.rows[i];
			n = "";
			for (let l = 0; l < s.length; l++) n += this.tablecell(s[l]);
			r += this.tablerow({ text: n });
		}
		return r && (r = \`<tbody>\${r}</tbody>\`), \`<table>
<thead>
\` + t + \`</thead>
\` + r + \`</table>
\`;
	}
	tablerow({ text: e }) {
		return \`<tr>
\${e}</tr>
\`;
	}
	tablecell(e) {
		let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
		return (e.align ? \`<\${n} align="\${e.align}">\` : \`<\${n}>\`) + t + \`</\${n}>
\`;
	}
	strong({ tokens: e }) {
		return \`<strong>\${this.parser.parseInline(e)}</strong>\`;
	}
	em({ tokens: e }) {
		return \`<em>\${this.parser.parseInline(e)}</em>\`;
	}
	codespan({ text: e }) {
		return \`<code>\${Te(e, !0)}</code>\`;
	}
	br(e) {
		return "<br>";
	}
	del({ tokens: e }) {
		return \`<del>\${this.parser.parseInline(e)}</del>\`;
	}
	link({ href: e, title: t, text: n, tokens: r, autolink: i }) {
		let s = i ? Te(n, !0) : this.parser.parseInline(r), l = Ir(e);
		if (l === null) return s;
		e = Te(l, i);
		let o = "<a href=\\"" + e + "\\"";
		return t && (o += " title=\\"" + Te(t) + "\\""), o += ">" + s + "</a>", o;
	}
	image({ href: e, title: t, text: n, tokens: r }) {
		r && (n = this.parser.parseInline(r, this.parser.textRenderer));
		let i = Ir(e);
		if (i === null) return Te(n);
		e = i;
		let s = \`<img src="\${Te(e)}" alt="\${Te(n)}"\`;
		return t && (s += \` title="\${Te(t)}"\`), s += ">", s;
	}
	text(e) {
		return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : Te(e.text);
	}
}, $n = class {
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
}, Ne = class ar {
	options;
	renderer;
	textRenderer;
	constructor(t) {
		this.options = t || st, this.options.renderer = this.options.renderer || new an(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new $n();
	}
	static parse(t, n) {
		return new ar(n).parse(t);
	}
	static parseInline(t, n) {
		return new ar(n).parseInline(t);
	}
	parse(t) {
		this.renderer.parser = this;
		let n = "";
		for (let r = 0; r < t.length; r++) {
			let i = t[r];
			if (this.options.extensions?.renderers?.[i.type]) {
				let l = i, o = this.options.extensions.renderers[l.type].call({ parser: this }, l);
				if (o !== !1 || ![
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
				].includes(l.type)) {
					n += o || "";
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
					let l = "Token with \\"" + s.type + "\\" type was not found.";
					if (this.options.silent) return console.error(l), "";
					throw new Error(l);
				}
			}
		}
		return n;
	}
	parseInline(t, n = this.renderer) {
		this.renderer.parser = this;
		let r = "";
		for (let i = 0; i < t.length; i++) {
			let s = t[i];
			if (this.options.extensions?.renderers?.[s.type]) {
				let o = this.options.extensions.renderers[s.type].call({ parser: this }, s);
				if (o !== !1 || ![
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
					r += o || "";
					continue;
				}
			}
			let l = s;
			switch (l.type) {
				case "escape":
					r += n.text(l);
					break;
				case "html":
					r += n.html(l);
					break;
				case "link":
					r += n.link(l);
					break;
				case "image":
					r += n.image(l);
					break;
				case "checkbox":
					r += n.checkbox(l);
					break;
				case "strong":
					r += n.strong(l);
					break;
				case "em":
					r += n.em(l);
					break;
				case "codespan":
					r += n.codespan(l);
					break;
				case "br":
					r += n.br(l);
					break;
				case "del":
					r += n.del(l);
					break;
				case "text":
					r += n.text(l);
					break;
				default: {
					let o = "Token with \\"" + l.type + "\\" type was not found.";
					if (this.options.silent) return console.error(o), "";
					throw new Error(o);
				}
			}
		}
		return r;
	}
}, Pt = class {
	options;
	block;
	constructor(e) {
		this.options = e || st;
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
	provideLexer(e = this.block) {
		return e ? Oe.lex : Oe.lexInline;
	}
	provideParser(e = this.block) {
		return e ? Ne.parse : Ne.parseInline;
	}
}, xi = class {
	defaults = zn();
	options = this.setOptions;
	parse = this.parseMarkdown(!0);
	parseInline = this.parseMarkdown(!1);
	Parser = Ne;
	Renderer = an;
	TextRenderer = $n;
	Lexer = Oe;
	Tokenizer = on;
	Hooks = Pt;
	constructor(...e) {
		this.use(...e);
	}
	walkTokens(e, t) {
		let n = [];
		for (let r of e) switch (n = n.concat(t.call(this, r)), r.type) {
			case "table": {
				let i = r;
				for (let s of i.header) n = n.concat(this.walkTokens(s.tokens, t));
				for (let s of i.rows) for (let l of s) n = n.concat(this.walkTokens(l.tokens, t));
				break;
			}
			case "list": {
				let i = r;
				n = n.concat(this.walkTokens(i.items, t));
				break;
			}
			default: {
				let i = r;
				this.defaults.extensions?.childTokens?.[i.type] ? this.defaults.extensions.childTokens[i.type].forEach((s) => {
					let l = i[s].flat(1 / 0);
					n = n.concat(this.walkTokens(l, t));
				}) : i.tokens && (n = n.concat(this.walkTokens(i.tokens, t)));
			}
		}
		return n;
	}
	use(...e) {
		let t = this.defaults.extensions || {
			renderers: {},
			childTokens: {}
		};
		return e.forEach((n) => {
			let r = { ...n };
			if (r.async = this.defaults.async || r.async || !1, n.extensions && (n.extensions.forEach((i) => {
				if (!i.name) throw new Error("extension name required");
				if ("renderer" in i) {
					let s = t.renderers[i.name];
					s ? t.renderers[i.name] = function(...l) {
						let o = i.renderer.apply(this, l);
						return o === !1 && (o = s.apply(this, l)), o;
					} : t.renderers[i.name] = i.renderer;
				}
				if ("tokenizer" in i) {
					if (!i.level || i.level !== "block" && i.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
					let s = t[i.level];
					s ? s.unshift(i.tokenizer) : t[i.level] = [i.tokenizer], i.start && (i.level === "block" ? t.startBlock ? t.startBlock.push(i.start) : t.startBlock = [i.start] : i.level === "inline" && (t.startInline ? t.startInline.push(i.start) : t.startInline = [i.start]));
				}
				"childTokens" in i && i.childTokens && (t.childTokens[i.name] = i.childTokens);
			}), r.extensions = t), n.renderer) {
				let i = this.defaults.renderer || new an(this.defaults);
				for (let s in n.renderer) {
					if (!(s in i)) throw new Error(\`renderer '\${s}' does not exist\`);
					if (["options", "parser"].includes(s)) continue;
					let l = s, o = n.renderer[l], u = i[l];
					i[l] = (...f) => {
						let g = o.apply(i, f);
						return g === !1 && (g = u.apply(i, f)), g || "";
					};
				}
				r.renderer = i;
			}
			if (n.tokenizer) {
				let i = this.defaults.tokenizer || new on(this.defaults);
				for (let s in n.tokenizer) {
					if (!(s in i)) throw new Error(\`tokenizer '\${s}' does not exist\`);
					if ([
						"options",
						"rules",
						"lexer"
					].includes(s)) continue;
					let l = s, o = n.tokenizer[l], u = i[l];
					i[l] = (...f) => {
						let g = o.apply(i, f);
						return g === !1 && (g = u.apply(i, f)), g;
					};
				}
				r.tokenizer = i;
			}
			if (n.hooks) {
				let i = this.defaults.hooks || new Pt();
				for (let s in n.hooks) {
					if (!(s in i)) throw new Error(\`hook '\${s}' does not exist\`);
					if (["options", "block"].includes(s)) continue;
					let l = s, o = n.hooks[l], u = i[l];
					Pt.passThroughHooks.has(s) ? i[l] = (f) => {
						if (this.defaults.async && Pt.passThroughHooksRespectAsync.has(s)) return (async () => {
							let w = await o.call(i, f);
							return u.call(i, w);
						})();
						let g = o.call(i, f);
						return u.call(i, g);
					} : i[l] = (...f) => {
						if (this.defaults.async) return (async () => {
							let w = await o.apply(i, f);
							return w === !1 && (w = await u.apply(i, f)), w;
						})();
						let g = o.apply(i, f);
						return g === !1 && (g = u.apply(i, f)), g;
					};
				}
				r.hooks = i;
			}
			if (n.walkTokens) {
				let i = this.defaults.walkTokens, s = n.walkTokens;
				r.walkTokens = function(l) {
					let o = [];
					return o.push(s.call(this, l)), i && (o = o.concat(i.call(this, l))), o;
				};
			}
			this.defaults = {
				...this.defaults,
				...r
			};
		}), this;
	}
	setOptions(e) {
		return this.defaults = {
			...this.defaults,
			...e
		}, this;
	}
	lexer(e, t) {
		return Oe.lex(e, t ?? this.defaults);
	}
	parser(e, t) {
		return Ne.parse(e, t ?? this.defaults);
	}
	parseMarkdown(e) {
		return (t, n) => {
			let r = { ...n }, i = {
				...this.defaults,
				...r
			}, s = this.onError(!!i.silent, !!i.async);
			if (this.defaults.async === !0 && r.async === !1) return s(/* @__PURE__ */ new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
			if (typeof t > "u" || t === null) return s(/* @__PURE__ */ new Error("marked(): input parameter is undefined or null"));
			if (typeof t != "string") return s(/* @__PURE__ */ new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
			if (i.hooks && (i.hooks.options = i, i.hooks.block = e), i.async) return (async () => {
				let l = i.hooks ? await i.hooks.preprocess(t) : t, o = await (i.hooks ? await i.hooks.provideLexer(e) : e ? Oe.lex : Oe.lexInline)(l, i), u = i.hooks ? await i.hooks.processAllTokens(o) : o;
				i.walkTokens && await Promise.all(this.walkTokens(u, i.walkTokens));
				let f = await (i.hooks ? await i.hooks.provideParser(e) : e ? Ne.parse : Ne.parseInline)(u, i);
				return i.hooks ? await i.hooks.postprocess(f) : f;
			})().catch(s);
			try {
				i.hooks && (t = i.hooks.preprocess(t));
				let l = (i.hooks ? i.hooks.provideLexer(e) : e ? Oe.lex : Oe.lexInline)(t, i);
				i.hooks && (l = i.hooks.processAllTokens(l)), i.walkTokens && this.walkTokens(l, i.walkTokens);
				let o = (i.hooks ? i.hooks.provideParser(e) : e ? Ne.parse : Ne.parseInline)(l, i);
				return i.hooks && (o = i.hooks.postprocess(o)), o;
			} catch (l) {
				return s(l);
			}
		};
	}
	onError(e, t) {
		return (n) => {
			if (n.message += \`
Please report this to https://github.com/markedjs/marked.\`, e) {
				let r = "<p>An error occurred:</p><pre>" + Te(n.message + "", !0) + "</pre>";
				return t ? Promise.resolve(r) : r;
			}
			if (t) return Promise.reject(n);
			throw n;
		};
	}
}, xt = new xi();
function j(e, t) {
	return xt.parse(e, t);
}
j.options = j.setOptions = function(e) {
	return xt.setOptions(e), j.defaults = xt.defaults, fi(j.defaults), j;
};
j.getDefaults = zn;
j.defaults = st;
function Ei(...e) {
	return xt.use(...e), j.defaults = xt.defaults, fi(j.defaults), j;
}
j.use = Ei;
j.walkTokens = function(e, t) {
	return xt.walkTokens(e, t);
};
j.parseInline = xt.parseInline;
j.Parser = Ne;
j.parser = Ne.parse;
j.Renderer = an;
j.TextRenderer = $n;
j.Lexer = Oe;
j.lexer = Oe.lex;
j.Tokenizer = on;
j.Hooks = Pt;
j.parse = j;
var Ws = j.options, Gs = j.setOptions, qs = j.walkTokens, Vs = j.parseInline, Zs = j, Ys = Ne.parse, Xs = Oe.lex;
function Ks(e, t) {
	this.v = e, this.k = t;
}
function Fr(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function Js(e) {
	if (Array.isArray(e)) return e;
}
function Qs(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, s, l, o = [], u = !0, f = !1;
		try {
			if (s = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				u = !1;
			} else for (; !(u = (r = s.call(n)).done) && (o.push(r.value), o.length !== t); u = !0);
		} catch (g) {
			f = !0, i = g;
		} finally {
			try {
				if (!u && n.return != null && (l = n.return(), Object(l) !== l)) return;
			} finally {
				if (f) throw i;
			}
		}
		return o;
	}
}
function eo() {
	throw new TypeError(\`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.\`);
}
function to(e, t) {
	return Js(e) || Qs(e, t) || no(e, t) || eo();
}
function no(e, t) {
	if (e) {
		if (typeof e == "string") return Fr(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Fr(e, t) : void 0;
	}
}
function Rn(e) {
	var t, n;
	function r(s, l) {
		try {
			var o = e[s](l), u = o.value, f = u instanceof Ks;
			Promise.resolve(f ? u.v : u).then(function(g) {
				if (f) {
					var w = s === "return" && u.k ? s : "next";
					if (!u.k || g.done) return r(w, g);
					g = e[w](g).value;
				}
				i(!!o.done, g);
			}, function(g) {
				r("throw", g);
			});
		} catch (g) {
			i(2, g);
		}
	}
	function i(s, l) {
		s === 2 ? t.reject(l) : t.resolve({
			value: l,
			done: s
		}), (t = t.next) ? r(t.key, t.arg) : n = null;
	}
	this._invoke = function(s, l) {
		return new Promise(function(o, u) {
			var f = {
				key: s,
				arg: l,
				resolve: o,
				reject: u,
				next: null
			};
			n ? n = n.next = f : (t = n = f, r(s, l));
		});
	}, typeof e.return != "function" && (this.return = void 0);
}
Rn.prototype[typeof Symbol == "function" && Symbol.asyncIterator || "@@asyncIterator"] = function() {
	return this;
}, Rn.prototype.next = function(e) {
	return this._invoke("next", e);
}, Rn.prototype.throw = function(e) {
	return this._invoke("throw", e);
}, Rn.prototype.return = function(e) {
	return this._invoke("return", e);
};
const ki = Object.entries, jr = Object.setPrototypeOf, ro = Object.isFrozen, io = Object.getPrototypeOf, so = Object.getOwnPropertyDescriptor;
let se = Object.freeze, oe = Object.seal, Ot = Object.create, Ti = typeof Reflect < "u" && Reflect, lr = Ti.apply, cr = Ti.construct;
se || (se = function(t) {
	return t;
});
oe || (oe = function(t) {
	return t;
});
lr || (lr = function(t, n) {
	for (var r = arguments.length, i = new Array(r > 2 ? r - 2 : 0), s = 2; s < r; s++) i[s - 2] = arguments[s];
	return t.apply(n, i);
});
cr || (cr = function(t) {
	for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++) r[i - 1] = arguments[i];
	return new t(...r);
});
const bt = ie(Array.prototype.forEach);
Array.prototype.indexOf;
const oo = ie(Array.prototype.lastIndexOf), Hr = ie(Array.prototype.pop), en = ie(Array.prototype.push);
Array.prototype.slice;
const ao = ie(Array.prototype.splice), Ct = Array.isArray, rn = ie(String.prototype.toLowerCase), Kn = ie(String.prototype.toString), Wr = ie(String.prototype.match), tn = ie(String.prototype.replace), Gr = ie(String.prototype.indexOf), lo = ie(String.prototype.trim), co = ie(Number.prototype.toString), uo = ie(Boolean.prototype.toString), qr = typeof BigInt > "u" ? null : ie(BigInt.prototype.toString), Vr = typeof Symbol > "u" ? null : ie(Symbol.prototype.toString), _e = ie(Object.prototype.hasOwnProperty), nn = ie(Object.prototype.toString), ue = ie(RegExp.prototype.test), nt = ho(TypeError);
function ie(e) {
	return function(t) {
		t instanceof RegExp && (t.lastIndex = 0);
		for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++) r[i - 1] = arguments[i];
		return lr(e, t, r);
	};
}
function ho(e) {
	return function() {
		for (var t = arguments.length, n = new Array(t), r = 0; r < t; r++) n[r] = arguments[r];
		return cr(e, n);
	};
}
function B(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : rn;
	if (jr && jr(e, null), !Ct(t)) return e;
	let r = t.length;
	for (; r--;) {
		let i = t[r];
		if (typeof i == "string") {
			const s = n(i);
			s !== i && (ro(t) || (t[r] = s), i = s);
		}
		e[i] = !0;
	}
	return e;
}
function fo(e) {
	for (let t = 0; t < e.length; t++) _e(e, t) || (e[t] = null);
	return e;
}
function ve(e) {
	const t = Ot(null);
	for (const r of ki(e)) {
		var n = to(r, 2);
		const i = n[0], s = n[1];
		_e(e, i) && (Ct(s) ? t[i] = fo(s) : s && typeof s == "object" && s.constructor === Object ? t[i] = ve(s) : t[i] = s);
	}
	return t;
}
function po(e) {
	switch (typeof e) {
		case "string": return e;
		case "number": return co(e);
		case "boolean": return uo(e);
		case "bigint": return qr ? qr(e) : "0";
		case "symbol": return Vr ? Vr(e) : "Symbol()";
		case "undefined": return nn(e);
		case "function":
		case "object": {
			if (e === null) return nn(e);
			const t = e, n = Me(t, "toString");
			if (typeof n == "function") {
				const r = n(t);
				return typeof r == "string" ? r : nn(r);
			}
			return nn(e);
		}
		default: return nn(e);
	}
}
function Me(e, t) {
	for (; e !== null;) {
		const r = so(e, t);
		if (r) {
			if (r.get) return ie(r.get);
			if (typeof r.value == "function") return ie(r.value);
		}
		e = io(e);
	}
	function n() {
		return null;
	}
	return n;
}
function go(e) {
	try {
		return ue(e, ""), !0;
	} catch {
		return !1;
	}
}
const Zr = se([
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
]), Jn = se([
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
]), Qn = se([
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
]), mo = se([
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
]), er = se([
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
]), _o = se([
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
]), Yr = se(["#text"]), Xr = se([
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
]), tr = se([
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
]), Kr = se([
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
]), Mn = se([
	"xlink:href",
	"xml:id",
	"xlink:title",
	"xml:space",
	"xmlns:xlink"
]), bo = oe(/{{[\\w\\W]*|^[\\w\\W]*}}/g), yo = oe(/<%[\\w\\W]*|^[\\w\\W]*%>/g), wo = oe(/\\\${[\\w\\W]*/g), xo = oe(/^data-[\\-\\w.\\u00B7-\\uFFFF]+$/), Eo = oe(/^aria-[\\-\\w]+$/), Jr = oe(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\\-]+(?:[^a-z+.\\-:]|$))/i), ko = oe(/^(?:\\w+script|data):/i), To = oe(/[\\u0000-\\u0020\\u00A0\\u1680\\u180E\\u2000-\\u2029\\u205F\\u3000]/g), vo = oe(/^html$/i), So = oe(/^[a-z][.\\w]*(-[.\\w]+)+$/i), Qr = oe(/<[/\\w!]/g), ei = oe(/<[/\\w]/g), Ao = oe(/<\\/no(script|embed|frames)/i), Ro = oe(/\\/>/i), ke = {
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
}, vi = [
	"style",
	"script",
	"xmp",
	"iframe",
	"noembed",
	"noframes",
	"plaintext",
	"noscript"
], Mo = se(B({}, vi)), Oo = (function() {
	const e = {};
	return bt(vi, (t) => {
		e[t] = oe(new RegExp("</" + t + "(?=[\\\\t\\\\n\\\\f\\\\r />])", "i"));
	}), se(e);
})(), No = function() {
	return typeof window > "u" ? null : window;
}, Po = function(t, n) {
	if (typeof t != "object" || typeof t.createPolicy != "function") return null;
	let r = null;
	const i = "data-tt-policy-suffix";
	n && n.hasAttribute(i) && (r = n.getAttribute(i));
	const s = "dompurify" + (r ? "#" + r : "");
	try {
		return t.createPolicy(s, {
			createHTML(l) {
				return l;
			},
			createScriptURL(l) {
				return l;
			}
		});
	} catch {
		return console.warn("TrustedTypes policy " + s + " could not be created."), null;
	}
}, ti = function() {
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
}, rt = function(t, n, r, i) {
	return _e(t, n) && Ct(t[n]) ? B(i.base ? ve(i.base) : {}, t[n], i.transform) : r;
}, nr = function(t, n, r) {
	const i = _e(t, n) ? t[n] : void 0;
	return i && typeof i == "object" ? ve(i) : r();
};
function Si() {
	let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : No();
	const t = (b) => Si(b);
	if (t.version = "3.4.16", t.removed = [], !e || !e.document || e.document.nodeType !== ke.document || !e.Element) return t.isSupported = !1, t;
	let n = e.document;
	const r = n, i = r.currentScript;
	e.DocumentFragment;
	const s = e.HTMLTemplateElement, l = e.Node, o = e.Element, u = e.NodeFilter;
	e.NamedNodeMap === void 0 && (e.NamedNodeMap || e.MozNamedAttrMap), e.HTMLFormElement;
	const f = e.DOMParser, g = e.trustedTypes, w = o.prototype, P = Me(w, "cloneNode"), M = Me(w, "remove"), T = Me(w, "removeAttributeNode"), z = Me(w, "nextSibling"), R = Me(w, "childNodes"), $ = Me(w, "parentNode"), re = Me(w, "shadowRoot"), ee = Me(w, "attributes"), he = l && l.prototype ? Me(l.prototype, "nodeType") : null, ye = l && l.prototype ? Me(l.prototype, "nodeName") : null, Ce = l && l.prototype ? Me(l.prototype, "ownerDocument") : null, X = function(a) {
		return he ? he(a) : a.nodeType;
	}, de = function(a) {
		return ye ? ye(a) : a.nodeName;
	};
	if (typeof s == "function") {
		const b = n.createElement("template");
		b.content && b.content.ownerDocument && (n = b.content.ownerDocument);
	}
	let te, Ie = "", Et, Dt = !1, qe = 0;
	const hn = function() {
		if (qe > 0) throw nt("A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the \\"DOMPurify and Trusted Types\\" section of the README.");
	}, Ve = function(a) {
		hn(), qe++;
		try {
			return te.createHTML(a);
		} finally {
			qe--;
		}
	}, ot = function(a) {
		hn(), qe++;
		try {
			return te.createScriptURL(a);
		} finally {
			qe--;
		}
	}, jn = function() {
		return Dt || (Et = Po(g, i), Dt = !0), Et;
	}, kt = n, zt = kt.implementation, at = kt.createNodeIterator, Hn = kt.createDocumentFragment, Wn = kt.getElementsByTagName, Gn = r.importNode;
	let V = ti();
	t.isSupported = typeof ki == "function" && typeof $ == "function" && zt && zt.createHTMLDocument !== void 0;
	const Er = bo, kr = yo, Tr = wo, vr = xo, Sr = Eo, Ar = ko, qn = To, Tt = So;
	let fn = Jr, G = null;
	const $t = B({}, [
		...Zr,
		...Jn,
		...Qn,
		...er,
		...Yr
	]);
	let q = null;
	const Bt = B({}, [
		...Xr,
		...tr,
		...Kr,
		...Mn
	]);
	let Se = Object.seal(Ot(null, {
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
	})), lt = null, pn = null;
	const Le = Object.seal(Ot(null, {
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
	let Ut = !0, Ft = !0, dn = !1, jt = !0, le = !1, De = !0, ge = !1, Ze = !1, ct = null, vt = null, Ht = !1, Ye = !1, St = !1, At = !1, Wt = !0, gn = !1;
	const mn = "user-content-";
	let Gt = !0, ut = !1, Ue = {}, Fe = null;
	const _n = B({}, [
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
	let qt = null;
	const je = B({}, [
		"audio",
		"video",
		"img",
		"source",
		"image",
		"track"
	]);
	let c = null;
	const _ = B({}, [
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
	]), E = "http://www.w3.org/1998/Math/MathML", C = "http://www.w3.org/2000/svg", U = "http://www.w3.org/1999/xhtml";
	let H = U, v = !1, k = null;
	const O = B({}, [
		E,
		C,
		U
	], Kn), ne = se([
		"mi",
		"mo",
		"mn",
		"ms",
		"mtext"
	]);
	let Z = B({}, ne);
	const Xe = se(["annotation-xml"]);
	let ht = B({}, Xe);
	const Vt = B({}, [
		"title",
		"style",
		"font",
		"a",
		"script"
	]);
	let ft = null;
	const Zt = ["application/xhtml+xml", "text/html"], Vn = "text/html";
	let Y = null, Ke = null;
	const bn = n.createElement("form"), pt = function(a) {
		return a instanceof RegExp || a instanceof Function;
	}, Yt = function() {
		let a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		if (Ke && Ke === a) return;
		(!a || typeof a != "object") && (a = {}), a = ve(a), ft = Zt.indexOf(a.PARSER_MEDIA_TYPE) === -1 ? Vn : a.PARSER_MEDIA_TYPE, Y = ft === "application/xhtml+xml" ? Kn : rn, G = rt(a, "ALLOWED_TAGS", $t, { transform: Y }), q = rt(a, "ALLOWED_ATTR", Bt, { transform: Y }), k = rt(a, "ALLOWED_NAMESPACES", O, { transform: Kn }), c = rt(a, "ADD_URI_SAFE_ATTR", _, {
			transform: Y,
			base: _
		}), qt = rt(a, "ADD_DATA_URI_TAGS", je, {
			transform: Y,
			base: je
		}), Fe = rt(a, "FORBID_CONTENTS", _n, { transform: Y }), lt = rt(a, "FORBID_TAGS", ve({}), { transform: Y }), pn = rt(a, "FORBID_ATTR", ve({}), { transform: Y }), Ue = _e(a, "USE_PROFILES") ? a.USE_PROFILES && typeof a.USE_PROFILES == "object" ? ve(a.USE_PROFILES) : a.USE_PROFILES : !1, Ut = a.ALLOW_ARIA_ATTR !== !1, Ft = a.ALLOW_DATA_ATTR !== !1, dn = a.ALLOW_UNKNOWN_PROTOCOLS || !1, jt = a.ALLOW_SELF_CLOSE_IN_ATTR !== !1, le = a.SAFE_FOR_TEMPLATES || !1, De = a.SAFE_FOR_XML !== !1, ge = a.WHOLE_DOCUMENT || !1, Ye = a.RETURN_DOM || !1, St = a.RETURN_DOM_FRAGMENT || !1, At = a.RETURN_TRUSTED_TYPE || !1, Ht = a.FORCE_BODY || !1, Wt = a.SANITIZE_DOM !== !1, gn = a.SANITIZE_NAMED_PROPS || !1, Gt = a.KEEP_CONTENT !== !1, ut = a.IN_PLACE || !1, fn = go(a.ALLOWED_URI_REGEXP) ? a.ALLOWED_URI_REGEXP : Jr, H = typeof a.NAMESPACE == "string" ? a.NAMESPACE : U, Z = nr(a, "MATHML_TEXT_INTEGRATION_POINTS", () => B({}, ne)), ht = nr(a, "HTML_INTEGRATION_POINTS", () => B({}, Xe));
		const h = nr(a, "CUSTOM_ELEMENT_HANDLING", () => Ot(null));
		if (Se = Ot(null), _e(h, "tagNameCheck") && pt(h.tagNameCheck) && (Se.tagNameCheck = h.tagNameCheck), _e(h, "attributeNameCheck") && pt(h.attributeNameCheck) && (Se.attributeNameCheck = h.attributeNameCheck), _e(h, "allowCustomizedBuiltInElements") && typeof h.allowCustomizedBuiltInElements == "boolean" && (Se.allowCustomizedBuiltInElements = h.allowCustomizedBuiltInElements), oe(Se), le && (Ft = !1), St && (Ye = !0), Ue && (G = B({}, Yr), q = Ot(null), Ue.html === !0 && (B(G, Zr), B(q, Xr)), Ue.svg === !0 && (B(G, Jn), B(q, tr), B(q, Mn)), Ue.svgFilters === !0 && (B(G, Qn), B(q, tr), B(q, Mn)), Ue.mathMl === !0 && (B(G, er), B(q, Kr), B(q, Mn))), Le.tagCheck = null, Le.attributeCheck = null, _e(a, "ADD_TAGS") && (typeof a.ADD_TAGS == "function" ? Le.tagCheck = a.ADD_TAGS : Ct(a.ADD_TAGS) && (G === $t && (G = ve(G)), B(G, a.ADD_TAGS, Y))), _e(a, "ADD_ATTR") && (typeof a.ADD_ATTR == "function" ? Le.attributeCheck = a.ADD_ATTR : Ct(a.ADD_ATTR) && (q === Bt && (q = ve(q)), B(q, a.ADD_ATTR, Y))), _e(a, "ADD_FORBID_CONTENTS") && Ct(a.ADD_FORBID_CONTENTS) && (Fe === _n && (Fe = ve(Fe)), B(Fe, a.ADD_FORBID_CONTENTS, Y)), Gt && (G["#text"] = !0), ge && B(G, [
			"html",
			"head",
			"body"
		]), G.table && (B(G, ["tbody"]), delete lt.tbody), a.TRUSTED_TYPES_POLICY) {
			if (typeof a.TRUSTED_TYPES_POLICY.createHTML != "function") throw nt("TRUSTED_TYPES_POLICY configuration option must provide a \\"createHTML\\" hook.");
			if (typeof a.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw nt("TRUSTED_TYPES_POLICY configuration option must provide a \\"createScriptURL\\" hook.");
			const m = te;
			te = a.TRUSTED_TYPES_POLICY;
			try {
				Ie = Ve("");
			} catch (p) {
				throw te = m, p;
			}
		} else a.TRUSTED_TYPES_POLICY === null ? (te = void 0, Ie = "") : (te === void 0 && (te = jn()), te && typeof Ie == "string" && (Ie = Ve("")));
		se && se(a), Ke = a;
	}, yn = B({}, [
		...Jn,
		...Qn,
		...mo
	]), wn = B({}, [...er, ..._o]), ze = function(a, h, m) {
		return h.namespaceURI === U ? a === "svg" : h.namespaceURI === E ? a === "svg" && (m === "annotation-xml" || Z[m]) : !!yn[a];
	}, xn = function(a, h, m) {
		return h.namespaceURI === U ? a === "math" : h.namespaceURI === C ? a === "math" && ht[m] : !!wn[a];
	}, En = function(a, h, m) {
		return h.namespaceURI === C && !ht[m] || h.namespaceURI === E && !Z[m] ? !1 : !wn[a] && (Vt[a] || !yn[a]);
	}, Zn = function(a) {
		let h = $(a);
		(!h || !h.tagName) && (h = {
			namespaceURI: H,
			tagName: "template"
		});
		const m = rn(a.tagName), p = rn(h.tagName);
		return k[a.namespaceURI] ? a.namespaceURI === C ? ze(m, h, p) : a.namespaceURI === E ? xn(m, h, p) : a.namespaceURI === U ? En(m, h, p) : !!(ft === "application/xhtml+xml" && k[a.namespaceURI]) : !1;
	}, $e = function(a) {
		en(t.removed, { element: a });
		try {
			$(a).removeChild(a);
		} catch {
			if (M(a), !$(a)) throw nt("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
		}
	}, kn = function(a, h, m) {
		try {
			T(a, h);
		} catch {
			try {
				a.removeAttribute(m);
			} catch {}
		}
	}, He = function(a) {
		A(a);
		const h = R(a);
		if (h) {
			const p = [];
			bt(h, (d) => {
				en(p, d);
			}), bt(p, (d) => {
				try {
					M(d);
				} catch {}
			});
		}
		const m = ee(a);
		if (m) for (let p = m.length - 1; p >= 0; --p) {
			const d = m[p], x = d && d.name;
			typeof x == "string" && kn(a, d, x);
		}
	}, We = function(a, h, m) {
		if (!m) try {
			m = h.getAttributeNode(a);
		} catch {
			m = null;
		}
		en(t.removed, {
			attribute: m || null,
			from: h
		});
		try {
			m ? T(h, m) : h.removeAttribute(a);
		} catch {
			try {
				h.removeAttribute(a);
			} catch {}
		}
		if (a === "is") if (Ye || St) try {
			$e(h);
		} catch {}
		else try {
			h.setAttribute(a, "");
		} catch {}
	}, y = function(a) {
		const h = ee(a);
		if (h) for (let m = h.length - 1; m >= 0; --m) {
			const p = h[m], d = p && p.name;
			typeof d != "string" || q[Y(d)] || kn(a, p, d);
		}
	}, A = function(a) {
		const h = [a];
		for (; h.length > 0;) {
			const m = h.pop();
			X(m) === ke.element && y(m);
			const p = R(m);
			if (p) for (let d = p.length - 1; d >= 0; --d) h.push(p[d]);
		}
	}, D = function(a, h) {
		return De ? a === "patchsrc" ? !0 : a === "for" && h !== "label" && h !== "output" : !1;
	}, W = function(a) {
		if (!De) return;
		const h = [a];
		for (; h.length > 0;) {
			const m = h.pop(), p = X(m);
			if (p === ke.processingInstruction || p === ke.comment && ue(ei, m.data)) {
				try {
					M(m);
				} catch {}
				continue;
			}
			if (p === ke.element) {
				const x = m, S = Y(de(m));
				try {
					x.hasAttribute && x.hasAttribute("patchsrc") && x.removeAttribute("patchsrc"), x.hasAttribute && x.hasAttribute("for") && D("for", S) && x.removeAttribute("for");
				} catch {}
			}
			const d = R(m);
			if (d) for (let x = d.length - 1; x >= 0; --x) h.push(d[x]);
		}
	}, K = function(a) {
		let h = null, m = null;
		if (Ht) a = "<remove></remove>" + a;
		else {
			const x = Wr(a, /^[\\r\\n\\t ]+/);
			m = x && x[0];
		}
		ft === "application/xhtml+xml" && H === U && (a = "<html xmlns=\\"http://www.w3.org/1999/xhtml\\"><head></head><body>" + a + "</body></html>");
		const p = te ? Ve(a) : a;
		if (H === U) try {
			h = new f().parseFromString(p, ft);
		} catch {}
		if (!h || !h.documentElement) {
			h = zt.createDocument(H, "template", null);
			try {
				h.documentElement.innerHTML = v ? Ie : p;
			} catch {}
		}
		const d = h.body || h.documentElement;
		return a && m && d.insertBefore(n.createTextNode(m), d.childNodes[0] || null), H === U ? Wn.call(h, ge ? "html" : "body")[0] : ge ? h.documentElement : d;
	}, we = function(a) {
		const h = Ce ? Ce(a) : a.ownerDocument;
		return at.call(h || a, a, u.SHOW_ELEMENT | u.SHOW_COMMENT | u.SHOW_TEXT | u.SHOW_PROCESSING_INSTRUCTION | u.SHOW_CDATA_SECTION, null);
	}, me = function(a) {
		return a = tn(a, Er, " "), a = tn(a, kr, " "), a = tn(a, Tr, " "), a;
	}, xe = function(a) {
		var h;
		a.normalize();
		const m = Ce ? Ce(a) : a.ownerDocument, p = at.call(m || a, a, u.SHOW_TEXT | u.SHOW_COMMENT | u.SHOW_CDATA_SECTION | u.SHOW_PROCESSING_INSTRUCTION, null);
		let d = p.nextNode();
		for (; d;) d.data = me(d.data), d = p.nextNode();
		const x = (h = a.querySelectorAll) === null || h === void 0 ? void 0 : h.call(a, "template");
		x && bt(x, (S) => {
			Pe(S.content) && xe(S.content);
		});
	}, ce = function(a) {
		const h = ye ? ye(a) : null;
		return typeof h != "string" || Y(h) !== "form" ? !1 : typeof a.nodeName != "string" || typeof a.textContent != "string" || typeof a.removeChild != "function" || a.attributes !== ee(a) || typeof a.removeAttribute != "function" || typeof a.removeAttributeNode != "function" || typeof a.getAttributeNode != "function" || typeof a.setAttribute != "function" || typeof a.namespaceURI != "string" || typeof a.insertBefore != "function" || typeof a.hasChildNodes != "function" || a.nodeType !== he(a) || a.childNodes !== R(a);
	}, Pe = function(a) {
		if (!he || typeof a != "object" || a === null) return !1;
		try {
			return he(a) === ke.documentFragment;
		} catch {
			return !1;
		}
	}, Je = function(a) {
		if (!he || typeof a != "object" || a === null) return !1;
		try {
			return typeof he(a) == "number";
		} catch {
			return !1;
		}
	};
	function Ee(b, a, h) {
		b.length !== 0 && bt(b, (m) => {
			m.call(t, a, h, Ke);
		});
	}
	const Tn = function(a, h) {
		return !!(De && a.hasChildNodes() && !Je(a.firstElementChild) && ue(Qr, a.textContent) && ue(Qr, a.innerHTML) || De && a.namespaceURI === U && Mo[h] && (Je(a.firstElementChild) || typeof a.textContent == "string" && ue(Oo[h], a.textContent)) || a.nodeType === ke.processingInstruction || De && a.nodeType === ke.comment && ue(ei, a.data));
	}, Rt = function(a, h) {
		if (a instanceof RegExp) return ue(a, h);
		if (a instanceof Function) {
			for (var m = arguments.length, p = new Array(m > 2 ? m - 2 : 0), d = 2; d < m; d++) p[d - 2] = arguments[d];
			return !!a(h, ...p);
		}
		return !1;
	}, Yn = function(a, h, m) {
		if (!lt[h] && Sn(h) && Rt(Se.tagNameCheck, h)) return !1;
		if (Gt && !Fe[h]) {
			const p = $(a), d = R(a);
			if (d && p) {
				const x = d.length;
				for (let S = x - 1; S >= 0; --S) {
					const L = a === m ? P(d[S], !0) : d[S];
					p.insertBefore(L, z(a));
				}
			}
		}
		return $e(a), !0;
	}, vn = function(a, h, m, p) {
		return a.length === 0 ? h : h === m || h === p ? ve(h) : h;
	}, Qe = function(a, h) {
		return a === h || $(a) !== null ? !1 : (ut && A(a), !0);
	}, dt = function(a, h) {
		if (Ee(V.beforeSanitizeElements, a, null), Qe(a, h)) return !0;
		if (ce(a)) return $e(a), !0;
		const m = Y(de(a));
		if (G = vn(V.uponSanitizeElement, G, $t, ct), Ee(V.uponSanitizeElement, a, {
			tagName: m,
			allowedTags: G
		}), Qe(a, h)) return !0;
		if (Tn(a, m)) return $e(a), !0;
		if (lt[m] || !(Le.tagCheck instanceof Function && Le.tagCheck(m)) && !G[m]) {
			const p = Yn(a, m, h);
			return p === !1 && (Ee(V.afterSanitizeElements, a, null), Qe(a, h)) ? !0 : p;
		}
		if (X(a) === ke.element && !Zn(a) || (m === "noscript" || m === "noembed" || m === "noframes") && ue(Ao, a.innerHTML)) return $e(a), !0;
		if (le && a.nodeType === ke.text) {
			const p = me(a.textContent);
			a.textContent !== p && (en(t.removed, { element: a.cloneNode() }), a.textContent = p);
		}
		return Ee(V.afterSanitizeElements, a, null), Qe(a, h);
	}, Xt = function(a, h, m) {
		if (pn[h] || D(h, a) || Wt && (h === "id" || h === "name") && (m in n || m in bn)) return !1;
		const p = q[h] || Le.attributeCheck instanceof Function && Le.attributeCheck(h, a);
		return Ft && ue(vr, h) || Ut && ue(Sr, h) ? !0 : p ? c[h] || ue(fn, tn(m, qn, "")) || (h === "src" || h === "xlink:href" || h === "href") && a !== "script" && Gr(m, "data:") === 0 && qt[a] || dn && !ue(Ar, tn(m, qn, "")) ? !0 : !m : Sn(a) && Rt(Se.tagNameCheck, a) && Rt(Se.attributeNameCheck, h, a) || h === "is" && Se.allowCustomizedBuiltInElements && Rt(Se.tagNameCheck, m);
	}, Ae = B({}, [
		"annotation-xml",
		"color-profile",
		"font-face",
		"font-face-format",
		"font-face-name",
		"font-face-src",
		"font-face-uri",
		"missing-glyph"
	]), Sn = function(a) {
		return !Ae[rn(a)] && ue(Tt, a);
	}, Kt = function(a, h, m, p) {
		if (te && typeof g == "object" && typeof g.getAttributeType == "function" && !m) switch (g.getAttributeType(a, h)) {
			case "TrustedHTML": return Ve(p);
			case "TrustedScriptURL": return ot(p);
		}
		return p;
	}, N = function(a, h, m, p) {
		try {
			return m ? a.setAttributeNS(m, h, p) : a.setAttribute(h, p), ce(a) ? ($e(a), !1) : !0;
		} catch {
			return We(h, a), !1;
		}
	}, Jt = function(a, h) {
		if (Ee(V.beforeSanitizeAttributes, a, null), Qe(a, h)) return;
		const m = a.attributes;
		if (!m || ce(a)) return;
		q = vn(V.uponSanitizeAttribute, q, Bt, vt);
		const p = {
			attrName: "",
			attrValue: "",
			keepAttr: !0,
			allowedAttributes: q,
			forceKeepAttr: void 0
		};
		let d = m.length;
		const x = Y(a.nodeName);
		for (; d--;) {
			const S = m[d], L = S.name, Q = S.namespaceURI, fe = S.value, et = Y(L), Xn = fe;
			let pe = L === "value" ? Xn : lo(Xn), Rr = !1;
			if (p.attrName = et, p.attrValue = pe, p.keepAttr = !0, p.forceKeepAttr = void 0, Ee(V.uponSanitizeAttribute, a, p), pe = p.attrValue, gn && (et === "id" || et === "name") && Gr(pe, mn) !== 0 && (We(L, a, S), pe = mn + pe, Rr = !0), De && ue(/((--!?|])>)|<\\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, pe)) {
				We(L, a, S);
				continue;
			}
			if (et === "attributename" && Wr(pe, "href")) {
				We(L, a, S);
				continue;
			}
			if (!p.forceKeepAttr) {
				if (!p.keepAttr) {
					We(L, a, S);
					continue;
				}
				if (!jt && ue(Ro, pe)) {
					We(L, a, S);
					continue;
				}
				if (le && (pe = me(pe)), !Xt(x, et, pe)) {
					We(L, a, S);
					continue;
				}
				pe = Kt(x, et, Q, pe), pe !== Xn && N(a, L, Q, pe) && Rr && Hr(t.removed);
			}
		}
		Ee(V.afterSanitizeAttributes, a, null), Qe(a, h);
	}, J = function(a) {
		let h = null;
		const m = we(a);
		for (Ee(V.beforeSanitizeShadowDOM, a, null); h = m.nextNode();) if (Ee(V.uponSanitizeShadowNode, h, null), dt(h, a), Jt(h, a), Pe(h.content) && J(h.content), X(h) === ke.element) {
			const p = re(h);
			Pe(p) && (F(p), J(p));
		}
		Ee(V.afterSanitizeShadowDOM, a, null);
	}, F = function(a) {
		const h = [{
			node: a,
			shadow: null
		}];
		for (; h.length > 0;) {
			const m = h.pop();
			if (m.shadow) {
				J(m.shadow);
				continue;
			}
			const p = m.node, d = X(p) === ke.element, x = R(p);
			if (x) for (let S = x.length - 1; S >= 0; --S) h.push({
				node: x[S],
				shadow: null
			});
			if (d) {
				const S = ye ? ye(p) : null;
				if (typeof S == "string" && Y(S) === "template") {
					const L = p.content;
					Pe(L) && h.push({
						node: L,
						shadow: null
					});
				}
			}
			if (d) {
				const S = re(p);
				Pe(S) && h.push({
					node: null,
					shadow: S
				}, {
					node: S,
					shadow: null
				});
			}
		}
	};
	return t.sanitize = function(b) {
		let a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, h = null, m = null, p = null, d = null;
		if (v = !b, v && (b = "<!-->"), typeof b != "string" && !Je(b) && (b = po(b), typeof b != "string")) throw nt("dirty is not a string, aborting");
		if (!t.isSupported) return b;
		Ze ? (G = ct, q = vt) : Yt(a), (V.uponSanitizeElement.length > 0 || V.uponSanitizeAttribute.length > 0) && (G = ve(G)), V.uponSanitizeAttribute.length > 0 && (q = ve(q)), t.removed = [];
		const x = ut && typeof b != "string" && Je(b);
		if (x) {
			W(b);
			const Q = de(b);
			if (typeof Q == "string") {
				const fe = Y(Q);
				if (!G[fe] || lt[fe]) throw He(b), nt("root node is forbidden and cannot be sanitized in-place");
			}
			if (ce(b)) throw He(b), nt("root node is clobbered and cannot be sanitized in-place");
			try {
				F(b);
			} catch (fe) {
				throw He(b), fe;
			}
		} else if (Je(b)) h = K("<!---->"), m = h.ownerDocument.importNode(b, !0), m.nodeType === ke.element && m.nodeName === "BODY" || m.nodeName === "HTML" ? h = m : h.appendChild(m), F(h);
		else {
			if (!Ye && !le && !ge && b.indexOf("<") === -1) return te && At ? Ve(b) : b;
			if (h = K(b), !h) return Ye ? null : At ? Ie : "";
		}
		h && Ht && $e(h.firstChild);
		const S = x ? b : h;
		try {
			const Q = we(S);
			for (; p = Q.nextNode();) dt(p, S), Jt(p, S), Pe(p.content) && J(p.content);
		} catch (Q) {
			throw x && (He(b), bt(t.removed, (fe) => {
				fe.element && A(fe.element);
			})), Q;
		}
		if (x) {
			let Q = !1;
			if (bt(t.removed, (fe) => {
				fe.element && (fe.element === b && (Q = !0), A(fe.element));
			}), Q) throw nt("a node selected for removal could not be safely returned; refusing to sanitize in place");
			return le && xe(b), b;
		}
		if (Ye) {
			if (le && xe(h), St) for (d = Hn.call(h.ownerDocument); h.firstChild;) d.appendChild(h.firstChild);
			else d = h;
			return (q.shadowroot || q.shadowrootmode) && (d = Gn.call(r, d, !0)), d;
		}
		let L = ge ? h.outerHTML : h.innerHTML;
		return ge && G["!doctype"] && h.ownerDocument && h.ownerDocument.doctype && h.ownerDocument.doctype.name && ue(vo, h.ownerDocument.doctype.name) && (L = "<!DOCTYPE " + h.ownerDocument.doctype.name + \`>
\` + L), le && (L = me(L)), te && At ? Ve(L) : L;
	}, t.setConfig = function() {
		let b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		Yt(b), Ze = !0, ct = G, vt = q;
	}, t.clearConfig = function() {
		Ke = null, Ze = !1, ct = null, vt = null, te = Et, Ie = "";
	}, t.isValidAttribute = function(b, a, h) {
		Ke || Yt({});
		const m = Y(b), p = Y(a);
		return Xt(m, p, h);
	}, t.addHook = function(b, a) {
		typeof a == "function" && _e(V, b) && en(V[b], a);
	}, t.removeHook = function(b, a) {
		if (_e(V, b)) {
			if (a !== void 0) {
				const h = oo(V[b], a);
				return h === -1 ? void 0 : ao(V[b], h, 1)[0];
			}
			return Hr(V[b]);
		}
	}, t.removeHooks = function(b) {
		_e(V, b) && (V[b] = []);
	}, t.removeAllHooks = function() {
		V = ti();
	}, t;
}
var On = Si();
function Co() {
	return typeof window < "u" && window.document ? window : typeof self < "u" ? self : {
		document: {
			nodeType: 9,
			createElement: () => ({}),
			createDocumentFragment: () => ({}),
			implementation: { createHTMLDocument: () => ({
				documentElement: {},
				body: {},
				createElement: () => ({}),
				createDocumentFragment: () => ({})
			}) }
		},
		Element: class {},
		Node: class {},
		NodeFilter: {
			SHOW_ELEMENT: 1,
			SHOW_TEXT: 3
		},
		DOMParser: class {},
		trustedTypes: void 0
	};
}
let Re = null;
function Ai() {
	return Re || (typeof On?.sanitize == "function" ? Re = On.sanitize.bind(On) : Re = On(Co()), typeof Re == "function" && typeof Re.sanitize == "function" ? Re = Re.sanitize.bind(Re) : typeof Re == "function" && Re.isSupported === !1 && (Re = (e) => String(e ?? ""))), Re;
}
function Ri(e) {
	if (e.startsWith("---")) {
		const t = e.indexOf(\`
---\`, 3);
		if (t !== -1) {
			const n = e.slice(3, t + 0).trim(), r = e.slice(t + 4).trimStart(), i = {};
			return n.split(/\\r?\\n/).forEach((s) => {
				const l = s.match(/^([^:]+):\\s*(.*)$/);
				l && (i[l[1].trim()] = l[2].trim());
			}), {
				content: r,
				data: i
			};
		}
	}
	return {
		content: e,
		data: {}
	};
}
const Be = 64, Io = 6, Lo = 63, ni = .673, Do = 27;
function zo(e) {
	return e = e + 2654435761 | 0, e = Math.imul(e ^ e >>> 16, 73244475), e = Math.imul(e ^ e >>> 16, 73244475), (e ^ e >>> 16) >>> 0;
}
var $o = class {
	/** @type {Uint8Array} One byte per register. Ranks run 1..27, so a byte —
	*  not a nibble — is what this needs; the earlier "low nibble" comment was
	*  wrong and would have capped the estimator at 15 leading zeros. */
	registers;
	constructor() {
		this.registers = new Uint8Array(Be);
	}
	/**
	* Add an element to the estimator. The argument may be a raw value: it is
	* finalised internally, so \`addHash(0)\`, \`addHash(1)\` ... estimate correctly
	* rather than saturating.
	* @param {*} hash - A 32-bit hash value, or any value coercible to one.
	* @returns {void}
	*/
	addHash(e) {
		const t = zo(e | 0), n = t & Lo, r = t >>> Io, i = r === 0 ? Do : Math.min(26, Math.clz32(r) - 5);
		i > this.registers[n] && (this.registers[n] = i);
	}
	/**
	* Estimate the number of distinct elements added.
	* @returns {number} Cardinality estimate.
	*/
	cardinality() {
		let e = 0, t = 0;
		for (let n = 0; n < Be; n++) {
			const r = this.registers[n];
			e += Math.pow(2, -r), r === 0 && (t += 1);
		}
		if (t === Be) return 0;
		if (t > 0) {
			const n = ni * Be * Be / e;
			return n <= Be * 2.5 ? Math.max(1, Math.round(Be * Math.log(Be / t))) : Math.round(n);
		}
		return Math.round(ni * Be * Be / e);
	}
	/**
	* Reset all registers to zero.
	* @returns {void}
	*/
	reset() {
		this.registers.fill(0);
	}
};
const ri = 64, ii = 4, si = 10;
function Bo(e, t) {
	return e = e + t | 0, e = Math.imul(e ^ e >>> 16, 73244475), e = Math.imul(e ^ e >>> 16, 73244475), (e ^ e >>> 16) >>> 0;
}
function Uo(e) {
	const t = String(e);
	let n = -2128831035;
	for (let r = 0; r < t.length; r += 1) n = Math.imul(n ^ t.charCodeAt(r), 16777619);
	return n;
}
function Fo(e) {
	const t = typeof e;
	return t === "function" || t === "object" && e !== null;
}
var jo = class {
	/**
	* @param {Object} [options]
	* @param {number} [options.width=64] Columns per row, rounded up to a power
	*   of two. The sketch's memory is \`width * depth / 2\` bytes.
	* @param {number} [options.depth=4] Hash rows. More rows cost memory and buy
	*   accuracy; four is the usual choice and is what the reference
	*   implementations use.
	* @param {number} [options.sampleSize=10] \`size()\` increments between
	*   half-life resets.
	* @param {number} [options.seed] Per-cache seed, so two caches do not share a
	*   hash pattern. Random when omitted.
	*/
	constructor({ width: e = ri, depth: t = ii, sampleSize: n = si, seed: r } = {}) {
		const i = Math.max(2, 1 << Math.ceil(Math.log2(Math.max(2, Math.floor(Number(e) || ri))))), s = Math.max(1, Math.min(8, Math.floor(Number(t) || ii)));
		this.width = i, this.depth = s, this.mask = i - 1, this.sampleSize = Math.max(1, Math.floor(Number(n) || si)), this.counters = new Uint8Array(i * s >>> 1), this.sample = 0, this.resets = 0, this.seed = (Number.isFinite(r) ? Number(r) : Math.floor(Math.random() * 4294967295)) | 0, this._hll = new $o(), this._ids = null, this._nextId = 0;
	}
	/**
	* Hash a key by the identity the cache gives it.
	*
	* Primitives take the string path, which is unchanged: one \`typeof\` check is
	* the entire added cost on the common path, and the FNV loop below it is
	* byte-for-byte what it was.
	*
	* Object keys get a \`WeakMap\` id, and the **id** is hashed rather than the
	* object, so the cost does not scale with anything the caller put in the key —
	* the \`String(obj)\` path it replaces was \`O(size of the object)\`.
	*
	* **No salt, and that is deliberate.** The obvious worry is that id \`3\` and the
	* string key \`'3'\` land on one counter. They cannot: \`_indexFor\` runs \`mix32\`
	* per row, and the two arrive as different hashes — \`3\` and FNV-1a of \`"3"\`,
	* which is not a small integer. And where two hashes *do* share a column that
	* is the Count-Min collision the sketch already exists to absorb, in the safe
	* direction. An earlier draft of this carried a salt and a comment justifying
	* it; the justification did not survive checking, so the salt went too.
	*
	* @param {*} key
	* @returns {number} The 32-bit hash, unmixed and unmasked.
	* @private
	*/
	_hash(e) {
		if (!Fo(e)) return Uo(e);
		const t = this._ids || (this._ids = /* @__PURE__ */ new WeakMap());
		let n = t.get(e);
		return n === void 0 && (n = this._nextId, this._nextId += 1, t.set(e, n)), n | 0;
	}
	/**
	* The sketch's footprint in bytes. Exposed so a caller can reason about the
	* memory an admission filter costs.
	* @returns {number}
	*/
	size() {
		return this.counters.byteLength;
	}
	/**
	* Column index for an already-hashed key in row \`row\`.
	*
	* \`mix32\` still runs per row — the rows must stay independent, or the sketch
	* degenerates to one effective row — but it is a fixed number of integer ops
	* rather than a loop over the key's characters.
	*
	* @param {number} hash - From {@link hashKey}, computed once per call.
	* @param {number} row
	* @returns {number}
	* @private
	*/
	_indexFor(e, t) {
		return t * this.width + (Bo(e, this.seed + t * 2654435761) & this.mask) | 0;
	}
	/**
	* Read one 4-bit counter.
	* @param {number} index - Flat counter index.
	* @returns {number} 0..15.
	* @private
	*/
	_get(e) {
		const t = this.counters[e >> 1];
		return e & 1 ? t >>> 4 : t & 15;
	}
	/**
	* Write one 4-bit counter, saturating at 15.
	* @param {number} index
	* @param {number} value
	* @returns {void}
	* @private
	*/
	_set(e, t) {
		const n = e >> 1, r = this.counters[n];
		this.counters[n] = e & 1 ? (r & 15 | (t & 15) << 4) & 255 : r & 240 | t & 15;
	}
	/**
	* Record one occurrence of \`key\` and, periodically, age the whole sketch.
	*
	* The sample counter advances only when an increment was **effective** — when
	* at least one row's counter actually moved. Caffeine does the same
	* (\`incrementAt\` returns false once a counter is saturated, and only an
	* effective increment advances \`size\`). Advancing it unconditionally meant
	* that a fully saturated sketch reset on schedule anyway, so the half-life
	* was measured in *operations* rather than in *changes to the estimates*:
	* every increment after saturation was a no-op on the data and a full
	* countdown on the clock, and the sketch halved far more often than
	* \`sampleSize\` describes.
	* @param {*} key
	* @returns {void}
	*/
	increment(e) {
		const t = this._hash(e);
		let n = !1;
		for (let r = 0; r < this.depth; r += 1) {
			const i = this._indexFor(t, r), s = this._get(i);
			s < 15 && (this._set(i, s + 1), n = !0);
		}
		n && (this._hll.addHash(t), this.sample += 1, this.sample >= this.sampleSize && (this.reset(), this.sample = 0));
	}
	/**
	* Estimated frequency of \`key\`: the minimum across rows, which is what makes
	* this Count-Min rather than plain counting. Overcounting is the only error
	* mode, and the safe one - a key can look slightly hotter than it is, never
	* colder.
	* @param {*} key
	* @returns {number} 0..15.
	*/
	estimate(e) {
		const t = this._hash(e);
		let n = 15;
		for (let r = 0; r < this.depth; r += 1) {
			const i = this._get(this._indexFor(t, r));
			i < n && (n = i);
		}
		return n;
	}
	/**
	* The half-life reset: halve every counter, dropping the odd ones.
	*
	* \`>> 1\` on a nibble is floor division by two, so a counter of 1 becomes 0
	* and 2 becomes 1. That rounding *down* is deliberate - it is what gives the
	* window its exponential decay, and it biases towards forgetting rather than
	* remembering, which is the right direction for an admission filter.
	* @returns {void}
	*/
	reset() {
		const e = this.counters, t = e.length;
		if (t >= 4) {
			const r = new Uint32Array(e.buffer, e.byteOffset, t >>> 2);
			for (let i = 0; i < r.length; i += 1) {
				const s = r[i];
				r[i] = s >>> 1 & 117901063 | (s >>> 5 & 117901063) << 4;
			}
		}
		for (let r = t & -4; r < t; r += 1) e[r] = e[r] >>> 1 & 7 | (e[r] >>> 5 & 7) << 4;
		this.resets += 1;
		const n = this._hll.cardinality();
		this._hll.reset(), this.sampleSize = Math.max(10, Math.round(10 * n));
	}
	/**
	* Clear every counter. Used by \`PowerCache.reset()\` - a reset cache has no
	* frequency history, and carrying one across would bias the next admission
	* decisions toward a workload that no longer exists.
	* @returns {void}
	*/
	clear() {
		this.counters.fill(0), this.sample = 0, this.resets = 0;
	}
};
let Dn = null;
if (typeof process < "u" && process?.hrtime && typeof process.hrtime.bigint == "function") try {
	const e = Number(process.hrtime.bigint() / 1000000n);
	Dn = Date.now() - e;
} catch {
	Dn = null;
}
const oi = typeof performance < "u" && typeof performance?.now == "function" && typeof performance?.timeOrigin == "number" ? () => performance.timeOrigin + performance.now() : null;
function Ho(e) {
	if (oi) try {
		const t = oi();
		return e === void 0 || Math.abs(t - e) < 1e3 ? t : e;
	} catch {}
	if (Dn != null) try {
		const t = Number(process.hrtime.bigint() / 1000000n) + Dn;
		return e === void 0 || Math.abs(t - e) < 1e3 ? t : e;
	} catch {
		return e === void 0 ? Date.now() : e;
	}
	return e === void 0 ? Date.now() : e;
}
const Mi = () => Ho(Date.now());
function Wo(e, t) {
	const { name: n, className: r, min: i = 0, integer: s = !1, allowInfinity: l = !1, fallback: o, invalidMessage: u, minMessage: f, integerMessage: g } = t;
	if (e == null) return o !== void 0 ? o : e;
	const w = Number(e);
	if (w === Number.POSITIVE_INFINITY && l) return w;
	if (!Number.isFinite(w)) throw new TypeError(u ?? \`\${r}: \\\`\${n}\\\` must be a finite number (received \${String(e)}). A non-finite limit would silently disable the check it guards.\`);
	if (s && !Number.isInteger(w)) throw new TypeError(g ?? \`\${r}: \\\`\${n}\\\` must be a whole number (received \${String(e)}). A fractional limit is silently rounded up by the first consumer, so it admits more than the number that was configured.\`);
	if (w < i) throw new TypeError(f ?? \`\${r}: \\\`\${n}\\\` must be >= \${i} (received \${w}).\`);
	return w;
}
function yt(e, t) {
	const n = Wo(e, t);
	if (typeof n != "number") throw new TypeError(\`\${t.className}: \\\`\${t.name}\\\` must be a number or have a \\\`fallback\\\`, but resolved to \${String(n)}.\`);
	return n;
}
function ai(e, t) {
	return \`\${t}: \\\`ttl\\\` must be a finite number of milliseconds or Infinity (received \${JSON.stringify(e) ?? String(e)}). A value that is not a number concatenates rather than adds, and every expiry comparison against it is false — so the entry would never expire.\`;
}
function Oi(e, t) {
	if (e == null || e === 1 / 0) return 0;
	if (typeof e != "number" && typeof e != "string") throw new TypeError(ai(e, t));
	const n = Number(e);
	if (!Number.isFinite(n)) throw new TypeError(ai(e, t));
	return n;
}
function Go(e, t) {
	if (e == null) return;
	const n = Number(e);
	if (!Number.isFinite(n) || !Number.isInteger(n) || n < -2147483648 || n > 2147483647) throw new TypeError(\`\${t}: \\\`seed\\\` must be a whole number in the int32 range (received \${String(e)}). The sketch mixes the seed into each hash row and truncates it to 32 bits, so a fractional or out-of-range value would silently become a different seed than the one you asked for. Omit it entirely for a random seed.\`);
	return n;
}
function qo(e, { name: t, className: n, optional: r = !0 }) {
	if (e == null) {
		if (r) return null;
		throw new TypeError(\`\${n}: \\\`\${t}\\\` is required.\`);
	}
	if (typeof e != "function") throw new TypeError(\`\${n}: \\\`\${t}\\\` must be a function.\`);
	return e;
}
function br(e, t, n) {
	if (!e || typeof e != "object") return;
	const r = new Set(t);
	for (const i of Object.keys(e)) {
		if (r.has(i)) continue;
		const s = [\`\${n}: unknown option \\\`\${i}\\\`.\`], l = Vo(i, t);
		l && s.push(\`Did you mean \\\`\${l}\\\`?\`), s.push(\`Accepted options: \${[...r].sort().join(", ")}.\`);
		const o = new TypeError(s.join(" "));
		throw o.code = "ERR_UNKNOWN_OPTION", o.option = i, o;
	}
}
function Vo(e, t) {
	let n = null, r = 1 / 0;
	for (const s of t) {
		const l = Zo(e, s);
		l < r && (r = l, n = s);
	}
	if (n === null) return null;
	const i = Math.max(2, Math.floor(Math.max(e.length, n.length) / 3));
	return r > 0 && r <= i ? n : null;
}
function Zo(e, t) {
	if (e === t) return 0;
	if (e.length === 0) return t.length;
	if (t.length === 0) return e.length;
	let n = Array.from({ length: t.length + 1 }, (r, i) => i);
	for (let r = 1; r <= e.length; r += 1) {
		const i = [r];
		for (let s = 1; s <= t.length; s += 1) i[s] = Math.min(n[s] + 1, i[s - 1] + 1, n[s - 1] + (e[r - 1] === t[s - 1] ? 0 : 1));
		n = i;
	}
	return n[t.length];
}
const li = Error, Yo = typeof li.isError == "function" ? li.isError : (
/** @param {unknown} value */
(e) => e instanceof Error);
function Xo(e) {
	return Yo(e);
}
const Ko = ".";
function Jo(e, t) {
	const n = {};
	if (typeof e != "string" || e === "" || t == null || typeof t != "object") return n;
	const r = (i, s) => {
		for (const [l, o] of Object.entries(i)) {
			const u = s ? \`\${s}\${Ko}\${l}\` : l;
			o == null ? n[u] = null : Array.isArray(o) || (typeof o == "object" ? r(o, u) : typeof o == "number" && !Number.isFinite(o) ? n[u] = String(o) : (typeof o == "number" || typeof o == "boolean" || typeof o == "string") && (n[u] = o));
		}
	};
	return r(t, e), n;
}
var Qo = class {
	/**
	* @param {Object} [options]
	* @param {string} [options.prefix=''] Prepended to every series key, so two
	*   collectors in one process do not collide.
	*/
	constructor(e = {}) {
		br(e, ["prefix"], "MetricsCollector"), this._sources = /* @__PURE__ */ new Map(), this._prefix = typeof e?.prefix == "string" ? e.prefix : "";
	}
	/**
	* Register a named source. The callback is called on each \`snapshot()\` and
	* should return that helper's \`stats()\`.
	*
	* Re-registering a name replaces the previous source rather than adding a
	* second series for it, so a caller that re-registers on reconfigure does not
	* silently double-count.
	*
	* @param {string} name - Series prefix for this source.
	* @param {() => *} read - Returns the source's current stats.
	* @returns {this}
	*/
	register(e, t) {
		if (typeof e != "string" || e === "") throw new TypeError("MetricsCollector.register: \`name\` must be a non-empty string");
		if (typeof t != "function") throw new TypeError("MetricsCollector.register: \`read\` must be a function");
		return this._sources.set(e, t), this;
	}
	/**
	* Stop reporting a source. The key disappears from the next snapshot rather
	* than reporting its last known value, which would be a lie: a number frozen
	* at deregistration looks exactly like a number that stopped moving.
	*
	* @param {string} name
	* @returns {boolean} Whether a source was removed.
	*/
	unregister(e) {
		return this._sources.delete(e);
	}
	/**
	* Take a point-in-time snapshot of every registered source.
	*
	* One source throwing does not lose the others. A metrics sink that goes
	* blank because one helper misbehaved is worse than one that reports
	* everything except the broken thing, so the failure is recorded under
	* \`<name>.error\` and the rest is still collected.
	*
	* @returns {{version: number, collectedAt: number, sources: string[], series: Record<string, *>, errors: Record<string, string>}}
	*/
	snapshot() {
		const e = {}, t = {};
		for (const [n, r] of this._sources) {
			let i;
			try {
				i = r();
			} catch (l) {
				t[n] = Xo(l) ? l.message : String(l);
				continue;
			}
			const s = Jo(this._prefix + n, i);
			for (const [l, o] of Object.entries(s)) e[l] = o;
		}
		return {
			version: 1,
			collectedAt: Date.now(),
			sources: [...this._sources.keys()],
			series: e,
			errors: t
		};
	}
	/**
	* The registered source names.
	*
	* @returns {string[]}
	*/
	names() {
		return [...this._sources.keys()];
	}
};
const ea = new Qo();
function ta(e, t, n) {
	const r = n?.observability;
	if (!r) return null;
	if (r !== !0) {
		if (!(typeof r == "object" && typeof r.register == "function")) throw new TypeError(\`\${t}: \\\`observability\\\` must be \\\`true\\\` or a MetricsCollector, not \${typeof r} (\${String(r)}).\`);
	}
	const i = r === !0 ? ea : r, s = e, l = s?.getStats, o = s?.stats, u = typeof l == "function" ? () => l.call(s) : typeof o == "function" ? () => o.call(s) : null;
	return u ? (i.register(t, u), {
		name: t,
		unregister: () => i.unregister(t)
	}) : null;
}
function na(e) {
	return !e || typeof e.unregister != "function" ? !1 : e.unregister();
}
function rr(e, t, n = {}) {
	const r = setTimeout(e, t);
	return !n.keepProcessAlive && typeof r?.unref == "function" && r.unref(), r;
}
const Bn = 1e3, ra = 60 * Bn, ia = 30 * Bn, sa = 1e4;
Object.freeze({
	CONNECTING: 0,
	OPEN: 1,
	CLOSING: 2,
	CLOSED: 3
});
const oa = 1e3, ci = ra, aa = 200, la = 16, ca = 4, ua = 1e6;
function ha(e) {
	const t = Math.min(Math.max(1, Number(e) || 1), ua), n = Math.ceil(la * t / ca);
	return Math.max(2, 1 << Math.ceil(Math.log2(n)));
}
const fa = Object.freeze([
	"map",
	"head",
	"tail",
	"pool",
	"currentWeight",
	"hits",
	"misses",
	"evictions",
	"rejected",
	"expirations"
]), pa = Object.freeze([
	"maxEntries",
	"maxInflightRefreshes",
	"maxWeight",
	"weightFn",
	"defaultTTL",
	"maxPoolSize",
	"rejectOversized",
	"onEvict",
	"onExpire",
	"initialPoolSize",
	"maxCleanupPerTick",
	"defaultAsyncTimeout",
	"now",
	"onError",
	"admission",
	"windowSize",
	"seed",
	"policy",
	"allowStale",
	"staleTtl",
	"fetchMethod",
	"observability"
]);
var da = class {
	/**
	* Create a PowerCache.
	*
	* The options type is the \`PowerCacheOptions\` typedef, not a second inline
	* list. The two had drifted: \`defaultAsyncTimeout\`, \`onError\` and \`policy\`
	* were destructured here and documented in the typedef, but absent from a
	* duplicated \`@param\` list on this constructor - so TypeScript synthesised an
	* options type without them, the body failed to type-check against its own
	* signature, and the three options were missing from the published
	* declarations. One source of truth, not two that have to be kept in step.
	*
	* @param {PowerCacheOptions} [options]
	* @throws {TypeError} When a non-object is provided as the options argument.
	*/
	constructor(e = {}) {
		br(e, pa, "PowerCache");
		const { maxEntries: t = 1 / 0, maxInflightRefreshes: n, maxWeight: r = 1 / 0, weightFn: i = () => 1, defaultTTL: s = ci, allowStale: l = !1, staleTtl: o = 1 / 0, fetchMethod: u = null, maxPoolSize: f = oa, rejectOversized: g = !1, onEvict: w = null, onExpire: P = null, initialPoolSize: M = 0, maxCleanupPerTick: T = 100, defaultAsyncTimeout: z = ia, onError: R = null, policy: $ = "lru", admission: re = "none", windowSize: ee = 0, seed: he, now: ye } = e;
		if (arguments.length > 0 && arguments[0] != null && typeof arguments[0] != "object") throw new TypeError("PowerCache options must be an object");
		if (this.maxEntries = yt(t, {
			name: "maxEntries",
			className: "PowerCache",
			integer: !0,
			min: 0,
			allowInfinity: !0
		}), n === void 0 ? this.maxInflightRefreshes = Number.isFinite(this.maxEntries) ? this.maxEntries : 1024 : this.maxInflightRefreshes = yt(n, {
			name: "maxInflightRefreshes",
			className: "PowerCache",
			integer: !0,
			min: 0
		}), this.maxWeight = yt(r, {
			name: "maxWeight",
			className: "PowerCache",
			min: 0,
			allowInfinity: !0
		}), this.maxPoolSize = yt(f, {
			name: "maxPoolSize",
			className: "PowerCache",
			integer: !0,
			min: 0,
			allowInfinity: !0
		}), this.weightFn = qo(i, {
			name: "weightFn",
			className: "PowerCache"
		}) ? i : () => 1, this.defaultTTL = s, this.allowStale = !!l, o !== 1 / 0 && !(Number.isFinite(o) && o >= 0)) throw new TypeError(\`PowerCache: \\\`staleTtl\\\` must be a non-negative finite number or Infinity (received \${String(o)}). An unparseable stale window would compare false against every entry and silently disable stale serving.\`);
		if (this.allowStale && !("staleTtl" in arguments[0])) throw new TypeError("PowerCache: \`allowStale\` requires an explicit \`staleTtl\`. A stale window with no bound serves a value expired at any point in the past — measured at five years — so the bound is required. Pass the window you can tolerate, or \`staleTtl: Infinity\` to opt out of it on purpose.");
		if (this.staleTtl = o, u != null && typeof u != "function") throw new TypeError("fetchMethod must be a function when supplied");
		this.fetchMethod = u, this._now = typeof ye == "function" ? ye : Mi, this.rejectOversized = !!g, this.onEvict = typeof w == "function" ? w : null, this.onError = typeof R == "function" ? R : null, this._weightErrors = 0, this.onExpire = typeof P == "function" ? P : null, this.maxCleanupPerTick = Number.isFinite(+T) ? Math.max(1, +T) : 100, this._map = /* @__PURE__ */ new Map(), this._head = null, this._tail = null, this._pool = [];
		for (let X = 0; X < Math.min(M || 0, this.maxPoolSize); X++) this._pool.push({
			key: null,
			value: null,
			weight: 0,
			expiresAt: 0,
			prev: null,
			next: null,
			inWindow: !1,
			visited: !1,
			queue: "main"
		});
		this._currentWeight = 0, this._hits = 0, this._staleServes = 0, this._misses = 0, this._evictions = 0, this._refreshesSkipped = 0, this._refreshesFailed = 0, this._refreshesAborted = 0, this._rejected = 0, this._rejectedAdmission = 0, this._expirations = 0;
		for (const X of fa) {
			const de = \`_\${X}\`;
			Object.defineProperty(this, X, {
				configurable: !0,
				enumerable: !1,
				get() {
					return this[de];
				},
				set(te) {
					this[de] = te;
				}
			});
		}
		if (this._cleanupTimer = null, this._cleanupRunning = !1, this._cleanupParams = null, this._cleanupCursor = null, this._cleanupCursorValid = !1, this._evictionCandidate = null, this._sieveHand = null, this._smallHead = null, this._smallTail = null, this._smallSize = 0, this._ghostHead = null, this._ghostTail = null, this._ghostSize = 0, this._smallMaxSize = 0, this._ghostMaxSize = 0, this._ghostMap = /* @__PURE__ */ new Map(), this._smallMap = /* @__PURE__ */ new Map(), this._policy = $ === "slru" ? "slru" : $ === "sieve" ? "sieve" : $ === "s3fifo" ? "s3fifo" : "lru", this._policy === "s3fifo") {
			const X = Number.isFinite(this.maxEntries) ? this.maxEntries : 1e3;
			this._smallMaxSize = Math.max(1, Math.floor(X * .1)), this._ghostMaxSize = Math.max(1, Math.floor(X * .2));
		}
		const Ce = Go(he, "PowerCache");
		this._sketch = re === "tinylfu" && this._policy === "lru" ? new jo({
			width: ha(this.maxEntries),
			sampleSize: Math.max(1, aa * Math.min(this.maxEntries, 1e6)),
			seed: Ce
		}) : null, this._windowSize = this._sketch && this._policy === "lru" ? ee === null ? Math.min(Math.max(4, Math.ceil(this.maxEntries * .01)), Math.floor(this.maxEntries / 4)) : Math.max(0, Math.floor(Number(ee) || 0)) : 0, this._windowSize >= this.maxEntries && this.maxEntries >= 4 && (this._windowSize = Math.floor(this.maxEntries / 4)), this._windowStartMemo = null, this._windowTail = null, this._probationEnd = null, this._inflightPromises = /* @__PURE__ */ new Map(), this._inflightControllers = /* @__PURE__ */ new Map(), this._defaultAsyncTimeout = Number.isFinite(Number(z)) ? Math.max(0, Math.floor(Number(z))) : 3e4, this._metrics = ta(this, "cache", arguments[0] || {});
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
	_allocNode(e, t, n, r) {
		const i = this._pool.pop() || {
			key: null,
			value: null,
			weight: 0,
			expiresAt: 0,
			prev: null,
			next: null,
			inWindow: !1,
			visited: !1,
			queue: "main"
		};
		return i.key = e, i.value = t, i.weight = n || 0, i.expiresAt = r || 0, i.prev = null, i.next = null, i.inWindow = !1, i.visited = !1, i.queue = "main", i;
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
	_computeWeight(e, t) {
		if (t != null) {
			const n = +t;
			return Number.isFinite(n) ? Math.max(0, n) : 0;
		}
		try {
			const n = +this.weightFn(e);
			return Number.isFinite(n) ? Math.max(0, n) : 0;
		} catch (n) {
			return this._weightErrors++, this._notifyError(n, "PowerCache weightFn threw"), 0;
		}
	}
	/**
	* Report an internal failure (a throwing user callback, a failing
	* \`weightFn\`, ...) exactly once, through the configured \`onError\` handler
	* when present and otherwise to \`console.error\`.
	*
	* Every catch site in this class funnels through here, so a swallowed
	* failure is consistent and observable rather than invisible in some paths
	* and logged in others.
	*
	* @param {any} err - The thrown value.
	* @param {string} msg - Human-readable context.
	* @returns {void}
	* @private
	*/
	_notifyError(e, t) {
		try {
			if (typeof this.onError == "function") {
				this.onError(e, t);
				return;
			}
		} catch {}
		try {
			typeof console < "u" && typeof console.error == "function" && console.error(t, e);
		} catch {}
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
	_freeNode(e) {
		e.key = null, e.value = null, e.weight = 0, e.expiresAt = 0, e.prev = null, e.next = null, this._pool.length < this.maxPoolSize && this._pool.push(e);
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
	_removeExpiredNode(e, t) {
		if (!e.expiresAt || e.expiresAt > t) return !1;
		const n = e.key, r = e.value;
		this._unlinkNode(e);
		try {
			this.onExpire && this.onExpire(n, r);
		} catch (i) {
			this._notifyError(i, "PowerCache onExpire callback threw");
		}
		return this._freeNode(e), this._expirations++, !0;
	}
	/**
	* Fetch a node and validate expiry.
	* @public
	* @param {*} key
	* @param {Object} [options]
	* @param {boolean} [options.ignoreExpiry=false]
	* @param {boolean} [options.countMiss=false]
	* @param {boolean} [options.allowExpired=false] Return an expired node instead
	*   of \`null\`. Read by \`_fetchValidNode\` and passed by \`getOrSet\` when
	*   \`staleWhileRevalidate\` is on; previously read but never documented, so it
	*   was missing from the declared options type.
	* @param {number} [options.now] A clock reading the caller has already taken.
	*   Threading it in halves the clock reads on the hot path (PERF-003):
	*   \`getOrSet\` and \`touch\` each read the clock and then called this, which read
	*   it again — and \`utils/now.js\` puts \`nowMs()\` at 141 ns and calls it "on the
	*   hot path of essentially every helper". Omit it and this reads its own, so
	*   the callers that have no reading to pass are unaffected.
	* @returns {CacheNode|null}
	*/
	_fetchValidNode(e, { ignoreExpiry: t = !1, countMiss: n = !1, allowExpired: r = !1, now: i } = {}) {
		let s = this._map.get(e);
		if (!s && (this._policy === "s3fifo" && (s = this._smallMap.get(e) || this._ghostMap.get(e)), !s)) return n && this._misses++, null;
		const l = t || !s.expiresAt ? 0 : i !== void 0 ? i : this._now();
		return l && s.expiresAt <= l ? r ? s : (this._removeExpiredNode(s, l), n && this._misses++, null) : s;
	}
	/**
	* Whether an expired node may still be served at \`now\`.
	*
	* The whole point of the row, and the predicate that makes
	* \`staleWhileRevalidate\` safe: a stale value is servable only **within
	* \`staleTtl\` of its \`expiresAt\`**. Before this, the flag had no upper bound at
	* all and a value five years past expiry was still returned as "stale".
	*
	* \`staleTtl === 0\` means the feature is off, which is the default and the
	* pre-existing behaviour, so nothing changes for a caller who never asked for
	* it. \`Infinity\` means explicitly unbounded.
	*
	* @private
	* @param {CacheNode} node
	* @param {number} now
	* @returns {boolean}
	*/
	_staleServable(e, t) {
		return this.staleTtl === 1 / 0 ? !0 : t <= e.expiresAt + this.staleTtl;
	}
	/**
	* Signal the factory in flight for \`key\`, if there is one.
	*
	* The linkage \`lru-cache\` documents: *"if the key is evicted or deleted before
	* the fetchMethod resolves, the AbortSignal passed to the fetchMethod will
	* receive an abort event."* Before this there was no cancellation path at all
	* — measured, zero occurrences of \`AbortController\` in this file — so an
	* evicted key's factory ran to completion and then wrote its result into a
	* cache that no longer wanted it.
	*
	* Aborting is a **request**, not a kill. A factory that predates this takes no
	* argument and cannot be stopped, so it still completes and still stores; the
	* signal is there for a factory that can cooperate, and refusing to store
	* because a key was deleted would lose the value for a caller that wanted it.
	*
	* @private
	* @param {*} key
	* @param {string} [reason] - Diagnostic surfaced through \`onError\`.
	* @returns {boolean} Whether a factory was signalled.
	*/
	_abortInflight(e, t = "evicted") {
		const n = this._inflightControllers.get(e);
		return !n || n.signal.aborted ? !1 : (n.abort(/* @__PURE__ */ new Error(\`PowerCache: in-flight fetch for a \${t} key was aborted\`)), this._refreshesAborted += 1, !0);
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
	_refreshStaleEntry(e, t, { ttl: n = void 0, weight: r = void 0 } = {}) {
		if (this._inflightPromises.has(e)) return;
		if (this._inflightPromises.size >= this.maxInflightRefreshes) {
			this._refreshesSkipped += 1;
			return;
		}
		const i = new AbortController(), s = Promise.resolve().then(() => t(i.signal)).then((l) => {
			try {
				this.set(e, l, {
					ttl: n,
					weight: r
				});
			} catch (o) {
				this._notifyError(o, "PowerCache: storing a refreshed value threw");
			}
			return l;
		}).catch(() => {
			i.signal.aborted || (this._refreshesFailed += 1);
		}).finally(() => {
			this._inflightControllers.delete(e), this._inflightPromises.delete(e);
		});
		this._inflightPromises.set(e, s), this._inflightControllers.set(e, i);
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
	_append(e) {
		if (!this._tail) {
			if (this._policy === "s3fifo") {
				this._s3fifoAppendSmall(e);
				return;
			}
			this._head = this._tail = e, this._evictionCandidate = this._head, this._policy === "slru" && (this._probationEnd = e), this._policy === "sieve" && (this._sieveHand = e);
			return;
		}
		if (this._policy === "slru") {
			this._insertIntoProbation(e);
			return;
		}
		if (this._policy === "sieve") {
			e.prev = this._tail, e.next = null, this._tail.next = e, this._tail = e;
			return;
		}
		if (this._policy === "s3fifo") {
			this._s3fifoAppendSmall(e);
			return;
		}
		e.prev = this._tail, e.next = null, this._tail.next = e, this._tail = e;
	}
	/**
	* Splice \`node\` in as the new MRU of the probation segment (SLRU only).
	*
	* The list puts probation at the front and protected behind it, so a new
	* entry goes immediately *before* the protected LRU rather than at the tail.
	* The head-splice case (no probation segment exists yet) is what stops a
	* freshly-emptied cache from growing its probation at the wrong end.
	*
	* @private
	* @param {CacheNode} node
	* @returns {void}
	*/
	_insertIntoProbation(e) {
		const t = this._probationEnd;
		if (!t) e.next = this._head, e.prev = null, this._head && (this._head.prev = e), this._head = e, this._evictionCandidate = e;
		else if (t === this._tail) e.prev = this._tail, e.next = null, this._tail.next = e, this._tail = e;
		else {
			const n = t.next;
			n && (e.prev = t, e.next = n, t.next = e, n.prev = e);
		}
		this._probationEnd = e;
	}
	/**
	* Unlink a node and update every piece of bookkeeping that depends on it.
	*
	* Four call sites - expiry, eviction, \`delete()\` and the cleanup sweep -
	* each had their own copy of this sequence, which is exactly the kind of
	* duplication that lets one path drift. The only difference between them is
	* that eviction sweeps must also advance \`_evictionCandidate\`, hence the
	* flag.
	*
	* A cursor may only ever name a live node: \`_remove\` nulls both links, so a
	* cursor left pointing at a removed node would be handed by \`_evictIfNeeded\`
	* to \`_unlinkNode\`, whose \`!p\` and \`!n\` branches would set \`head\` and \`tail\`
	* to \`null\` and destroy the list. That is unreachable today — the eviction
	* sweeps pass the flag, and every other caller happens to remove the head,
	* which \`_remove\` repairs — and \`review.md\`'s CACHE-001 records it as
	* \`**[verified]**\` when it is not. **If you add a fifth call site, advance the
	* cursor when it is on the node you are removing**, or assert the invariant
	* that currently guards it. See \`test/powerCache.cursor.ttl.test.js\`.
	*
	* @private
	* @param {CacheNode} node - Node to unlink. Must currently be in the list.
	* @param {Object} [options]
	* @param {boolean} [options.advanceEvictionCandidate=false] - Also move the
	*   eviction cursor past the removed node.
	* @returns {CacheNode|null} The node that followed it, now at this position.
	*/
	_unlinkNode(e, { advanceEvictionCandidate: t = !1 } = {}) {
		const n = e.next;
		return this._map.delete(e.key), this._currentWeight -= e.weight || 0, this._cleanupCursor === e && (this._cleanupCursor = n), this._cleanupCursorValid = !!this._cleanupCursor, t && (this._evictionCandidate = n), this._remove(e), n;
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
	_remove(e) {
		const t = e.prev, n = e.next;
		t ? t.next = n : this._head = n, t || (this._evictionCandidate = this._head), n ? n.prev = t : this._tail = t, this._probationEnd === e && (this._probationEnd = t), this._policy === "sieve" && this._sieveHand === e && (this._sieveHand = e.next || this._head), this._policy === "s3fifo" && (e.queue === "small" ? this._s3fifoRemoveFromSmall(e) : e.queue === "ghost" && this._s3fifoRemoveFromGhost(e)), e.inWindow && (this._windowStartMemo = null, this._windowTail = null), e.prev = e.next = null;
	}
	/** @param {CacheNode} node */
	_s3fifoAppendSmall(e) {
		this._smallTail ? (this._smallTail.next = e, e.prev = this._smallTail, this._smallTail = e) : this._smallHead = this._smallTail = e, e.next = null, e.queue = "small", this._smallMap.set(e.key, e), this._smallSize += 1;
	}
	/** @param {CacheNode} node */
	_s3fifoAppendMain(e) {
		this._tail ? (e.prev = this._tail, e.next = null, this._tail.next = e, this._tail = e) : (this._head = this._tail = e, this._evictionCandidate = this._head), this._map.set(e.key, e);
	}
	/** @param {CacheNode} node */
	_s3fifoAppendGhost(e) {
		this._ghostTail ? (this._ghostTail.next = e, e.prev = this._ghostTail, this._ghostTail = e) : this._ghostHead = this._ghostTail = e, e.next = null, e.queue = "ghost", this._ghostMap.set(e.key, e), this._ghostSize += 1;
	}
	/** @param {CacheNode} node */
	_s3fifoRemoveFromSmall(e) {
		const t = e.prev, n = e.next;
		t ? t.next = n : this._smallHead = n, n ? n.prev = t : this._smallTail = t, this._smallMap.delete(e.key), this._smallSize -= 1;
	}
	/** @param {CacheNode} node */
	_s3fifoRemoveFromGhost(e) {
		const t = e.prev, n = e.next;
		t ? t.next = n : this._ghostHead = n, n ? n.prev = t : this._ghostTail = t, this._ghostMap.delete(e.key), this._ghostSize -= 1;
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
	_moveToTail(e) {
		if (this._policy === "slru") {
			const t = this._probationEnd === e, n = e.prev;
			if (this._tail === e) {
				t && (this._probationEnd = n);
				return;
			}
			this._remove(e), e.prev = this._tail, e.next = null, this._tail && (this._tail.next = e), this._tail = e, t && (this._probationEnd = n);
			return;
		}
		if (this._policy === "sieve") {
			e.visited = !0;
			return;
		}
		if (this._policy === "s3fifo") {
			e.queue === "small" ? (this._s3fifoRemoveFromSmall(e), e.queue = "main", e.prev = null, e.next = null, this._s3fifoAppendMain(e), this._evictIfNeeded()) : e.queue === "ghost" && (this._s3fifoRemoveFromGhost(e), e.queue = "main", e.prev = null, e.next = null, this._s3fifoAppendMain(e), this._evictIfNeeded());
			return;
		}
		if (this._windowSize > 0) {
			if (!e.inWindow) {
				this._remove(e), this._insertAtMainSpaceMrU(e);
				return;
			}
			if (this._tail === e) return;
			this._remove(e), this._append(e);
			return;
		}
		this._tail !== e && (this._remove(e), this._append(e));
	}
	/**
	* The oldest node in the admission window, or \`null\` when the window is empty.
	*
	* Derived from the tail run of flagged nodes rather than maintained as a
	* pointer, and derived by *following the flag* rather than by walking back a
	* fixed number of steps. Both halves matter:
	*
	* - A pointer has to be updated by every mutation of the list. Every attempt
	*   that maintained one missed a mutation, and produced a counter reading
	*   negative some distance from the splice that caused it.
	* - A fixed walk of \`windowSize\` steps is only right while the window is
	*   **full**. A challenger that loses arbitration is dropped and the window is
	*   briefly one short, at which point the walk reaches past the boundary into
	*   main space: \`main space, k-47, k-6, window\` with the window's two
	*   survivors after it, which put a recency bump for \`k-6\` *behind* a key
	*   inserted fifty sets later and quietly destroyed the recency order of main
	*   space. The window is "the flagged run at the tail" at every fill level,
	*   and that is what this returns.
	*
	* The flag is the source of truth for _membership_ because it is set in
	* exactly one place (admission) and cleared in exactly one (promotion or
	* drop). List consistency against it is checked by \`test/powerCache.window.test.js\`,
	* which is the half this cannot verify on its own.
	*
	* **The walk is memoised, and the memo is validated rather than maintained.**
	* This is deliberately not the maintained pointer the note above describes as
	* having failed: a pointer has to be *corrected* by every mutation, and the
	* way it went wrong was producing a confidently wrong answer, because a node
	* with a correct \`inWindow\` flag can still sit on the wrong side of the
	* boundary. Here the memo can only be **trusted or discarded**, never
	* adjusted, so a mistake in reasoning about some mutation costs a walk and
	* nothing else — and the conditions below are each individually
	* necessary, so the failure mode is a stale memo rather than a wrong one.
	*
	* The memo is valid when the walk would return the same node, and the two
	* checks are the complete set of ways that can stop being true:
	*
	* 1. \`memo.prev === null || !memo.prev.inWindow\`. If the node *before* the
	*    memo is now flagged, the memo is no longer the start of the run.
	* 2. \`this._windowTail === this._tail\`, where \`_windowTail\` is the tail at the
	*    moment of the walk. This is what makes a memo written before an unlink
	*    comparable to the list afterwards: the tail is unchanged, the removed node
	*    was not the memo, and the run's start is genuinely unmoved — so a walk
	*    would return the same node and skipping it is correct.
	*
	* **There is deliberately no \`memo.inWindow\` check**, and it was there first.
	* It is redundant rather than merely untested: every way a node stops being
	* flagged is a promotion or a drop, and both of those *unlink* it, and \`_remove\`
	* discards the memo for any window node it unlinks. Deleting the check left
	// every test in \`test/powerCache.window.test.js\` passing, and the reason it
	* is safe to delete is that \`_remove\` is the single funnel every unlink passes
	* through. The same test run is what established it — the check had survived
	* deleting it, which is how a guard nobody has watched fail gets deleted
	* instead of justified.
	*
	* **There is also no \`memo === this._tail\` condition**, and the first draft of
	* this had one. The walk starts at the tail and walks *backwards*, so the
	* window's oldest node is the tail only when the window holds a single entry —
	* requiring it made the memo miss on *every* read while a multi-entry window was
	* resident, which is precisely the case the row is about. It measured 1.00
	* calls per get and zero benefit, and the diagnostic that found it printed which
	* condition had failed rather than a bare count.
	*
	* The case that is *not* free is a node removed from the window **immediately
	* before the memo**, which moves the run's start without touching the tail or
	* the memo. That is one unlink, and it is covered by the same rule the rest
	* of this class uses: any unlink of a window node drops the memo, because
	* \`_remove\` cannot know whether it removed the run's start and a wrong guess
	* is the failure this whole design exists to avoid. Dropping it costs one
	* walk, which is what the walk is for.
	*
	* @private
	* @returns {CacheNode|null}
	*/
	_windowOldest() {
		const e = this._windowStartMemo;
		if (e !== null && (e.prev === null || !e.prev.inWindow) && this._windowTail === this._tail) return e;
		let t = this._tail;
		if (!t || !t.inWindow) return this._windowStartMemo = null, this._windowTail = this._tail, null;
		for (; t.prev && t.prev.inWindow;) t = t.prev;
		return this._windowStartMemo = t, this._windowTail = this._tail, t;
	}
	/**
	* The eviction candidate in main space: the entry just below the window.
	*
	* \`null\` when the window holds the whole list, which is the cold-cache case
	* the note calls out: with no main space there is nothing to compare against,
	* and evicting a node against *itself* would remove it from \`_map\` and lose
	* it permanently.
	*
	* @private
	* @returns {CacheNode|null}
	*/
	_windowVictim() {
		const e = this._windowOldest();
		return !e || e === this._head ? null : e.prev;
	}
	/**
	* Splice an unlinked node in at the MRU end of main space — immediately
	* before the window's oldest entry.
	*
	* This is the *one* splice that may place a node on the main-space side of
	* the boundary, and every path that leaves the window goes through it.
	* Appending to the tail instead is the error three separate implementations
	* made: it puts a main-space node back inside the window region, the region
	* and the counter stop describing the same set of nodes, and the visible
	* symptom is a counter bug some distance from its cause.
	*
	* Falls back to the tail when the window is empty (main space then runs to
	* the end of the list) and to a head fix when there is no main space at all.
	*
	* @private
	* @param {CacheNode} node - An unlinked node. Its links are overwritten.
	* @returns {void}
	*/
	_insertAtMainSpaceMrU(e) {
		const t = this._windowOldest();
		if (!t) {
			e.prev = this._tail, e.next = null, this._tail ? this._tail.next = e : (this._head = e, this._evictionCandidate = e), this._tail = e;
			return;
		}
		const n = t.prev;
		e.prev = n, e.next = t, n ? n.next = e : (this._head = e, this._evictionCandidate = e), t.prev = e;
	}
	/**
	* Move a node out of the window and into main space, in front of the window.
	*
	* @private
	* @param {CacheNode} node - A linked window node.
	* @returns {void}
	*/
	_promoteFromWindow(e) {
		this._remove(e), this._insertAtMainSpaceMrU(e), e.inWindow = !1;
	}
	/**
	* Evict one node, reporting it and returning it to the node pool.
	*
	* Single-node sibling of \`_evictIfNeeded\`, for the paths that displace a
	* specific victim rather than sweeping. Sharing the unlink/report/free
	* sequence is what keeps \`onEvict\` firing on every path — a window eviction
	* that skipped the callback would be invisible to every user cleanup and to
	* the pool's own node accounting.
	*
	* @private
	* @param {CacheNode} node
	* @returns {void}
	*/
	_evictNode(e) {
		if (!e) return;
		const t = e.key, n = e.value;
		this._unlinkNode(e, { advanceEvictionCandidate: !0 }), this._evictions++;
		try {
			this.onEvict && this.onEvict(t, n, "evicted");
		} catch (r) {
			this._notifyError(r, "PowerCache onEvict callback threw");
		}
		this._freeNode(e);
	}
	/**
	* Admit a new key into the window, then arbitrate the window's oldest entry.
	*
	* Called after a new key has been appended at the tail. Once the window is
	* full, its oldest entry is the challenger: it either takes a place in main
	* space or is dropped, and which one is the only place the sketch arbitrates.
	*
	* Two rules here are not in the W-TinyLFU *description* and both were found
	* by attempting it (see \`adr/0003-tinylfu-admission-window.md\`):
	*
	* - **The challenger wins ties.** A tie means "no evidence either is better",
	*   and discarding the challenger discards the only evidence the filter has.
	*   Refusing ties is what made a fill-then-read caller lose every key written
	*   after the first few, because they all tie at estimate 1.
	* - **Only arbitrate at capacity.** While main space has room the filter has
	*   nothing to protect and a comparison has no signal — every fresh key sits
	*   at estimate 1, so every comparison is a tie and the churn evicts the
	*   entry the previous \`set\` just promoted. Measured: a 40-key warm ended with
	*   5 entries instead of 40. Caffeine's \`admit\` makes the same check.
	*
	* \`previousSize\` is the count **before** the arrival, and it has to be. A
	* cache filled to exactly \`maxEntries\` has been full the whole time the last
	* key was arriving; testing the count *after* the insert makes the final key
	* of every fill contend with a main-space victim it should have been promoted
	* past, which drops it. That is a 40-key warm ending at 39 — one key short,
	* no error, and invisible unless the test checks the count.
	*
	* @private
	* @param {number} previousSize - \`this._map.size\` before this arrival.
	* @returns {void}
	*/
	_arbitrateWindow(e) {
		if (this._map.size <= this._windowSize) return;
		const t = this._windowOldest();
		if (!t) return;
		const n = this._windowVictim();
		if (!(n != null && e >= this.maxEntries)) {
			this._promoteFromWindow(t);
			return;
		}
		if (!n) return;
		const r = n.key;
		this._sketch.estimate(t.key) > this._sketch.estimate(r) ? (this._evictNode(n), this._promoteFromWindow(t)) : (this._rejectedAdmission += 1, this._evictNode(t));
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
		if (this._policy === "sieve") {
			this._sieveEvict();
			return;
		}
		if (this._policy === "s3fifo") {
			this._s3fifoEvict();
			return;
		}
		for (; this._map.size > this.maxEntries || this._currentWeight > this.maxWeight;) {
			const e = this._evictionCandidate || this._head;
			if (!e) break;
			const t = e.key, n = e.value;
			this._abortInflight(t, "evicted"), this._unlinkNode(e, { advanceEvictionCandidate: !0 }), this._evictions++;
			try {
				this.onEvict && this.onEvict(t, n, "evicted");
			} catch (r) {
				this._notifyError(r, "PowerCache onEvict callback threw");
			}
			this._freeNode(e);
		}
		this._evictionCandidate || (this._evictionCandidate = this._head);
	}
	/** SIEVE eviction: scan from tail, clear visited bits, evict first unvisited. */
	_sieveEvict() {
		for (; (this._map.size > this.maxEntries || this._currentWeight > this.maxWeight) && !(!this._sieveHand && (this._sieveHand = this._head, !this._sieveHand));) {
			const e = this._sieveHand;
			if (this._sieveHand = e.next || this._tail, e.visited) {
				e.visited = !1;
				continue;
			}
			const t = e.key, n = e.value;
			this._abortInflight(t, "evicted"), this._unlinkNode(e, { advanceEvictionCandidate: !1 }), this._evictions++;
			try {
				this.onEvict && this.onEvict(t, n, "evicted");
			} catch (r) {
				this._notifyError(r, "PowerCache onEvict callback threw");
			}
			this._freeNode(e);
		}
	}
	/** S3-FIFO eviction: enforce Small, Main, and Ghost queue limits. */
	_s3fifoEvict() {
		for (; this._smallSize > this._smallMaxSize;) {
			const e = this._smallHead;
			if (!e) break;
			if (this._ghostSize < this._ghostMaxSize) this._s3fifoRemoveFromSmall(e), this._s3fifoAppendGhost(e);
			else {
				this._s3fifoRemoveFromSmall(e), this._evictions++;
				const t = e.key, n = e.value;
				this._abortInflight(t, "evicted");
				try {
					this.onEvict && this.onEvict(t, n, "evicted");
				} catch (r) {
					this._notifyError(r, "PowerCache onEvict callback threw");
				}
				this._freeNode(e);
			}
		}
		for (; this._map.size >= this.maxEntries || this._currentWeight > this.maxWeight;) {
			const e = this._evictionCandidate || this._head;
			if (!e) break;
			if (this._ghostSize < this._ghostMaxSize) this._unlinkNode(e, { advanceEvictionCandidate: !0 }), this._s3fifoAppendGhost(e);
			else {
				const t = e.key, n = e.value;
				this._abortInflight(t, "evicted"), this._unlinkNode(e, { advanceEvictionCandidate: !0 }), this._evictions++;
				try {
					this.onEvict && this.onEvict(t, n, "evicted");
				} catch (r) {
					this._notifyError(r, "PowerCache onEvict callback threw");
				}
				this._freeNode(e);
			}
		}
		this._evictionCandidate || (this._evictionCandidate = this._head);
	}
	/**
	* Normalise a caller-supplied TTL into the \`expiresAt\` this entry stores.
	*
	* The arithmetic used to be written out at each of \`set\`, \`setMany\` and
	* \`touch\`, and \`now + ttl\` on a non-number does **string concatenation** rather
	* than failing. With \`now === 3000\`, \`{ ttl: 'abc' }\` therefore stored
	* \`expiresAt === '3000abc'\`; every expiry test then compared a number against a
	* string, produced \`NaN\`, and \`NaN > anything\` is \`false\` — so the entry never
	* expired. A one-character typo in a config value silently disabled expiry,
	* which is the worst direction a cache has to fail in: it looks like the value
	* it was given, and memory grows until something else breaks.
	*
	* A numeric *string* is still accepted, because \`'1000'\` from an environment
	* variable is a reasonable thing to pass and rejecting it would be pedantry.
	* What is rejected is anything that does not name a duration — including
	* \`{ ttl: [] }\` and \`{ ttl: true }\`, which \`Number()\` would happily coerce to 0
	* and 1.
	*
	* @private
	* @param {number|string|null|undefined} ttl - Caller-supplied TTL in ms.
	* @param {number} now - The clock reading this expiry is relative to.
	* @returns {number} \`0\` for "no expiry", otherwise an absolute expiry.
	* @throws {TypeError} If \`ttl\` is neither nullish, \`Infinity\`, nor a finite
	*   number.
	*/
	_expiresAt(e, t) {
		return e == null || e === 1 / 0 ? 0 : t + Oi(e, "PowerCache");
	}
	/**
	* The oversize rejection, shared by \`set\` and \`setMany\`.
	*
	* Extracted because \`setMany\` used to carry its own copy of the insert path and
	* this check was the first thing it omitted: a 999-byte value written through
	* \`set\` was refused with \`onEvict\` reporting \`'rejected-oversized'\`, and the
	* same value written through \`setMany\` was admitted and then swept out by the
	* bulk eviction pass with the **wrong reason**, \`'evicted'\`. A caller watching
	* \`onEvict\` to count rejections — which is the only way to observe them, since
	* \`setMany\` returns \`this\` for chaining — was counting the wrong thing.
	*
	* @private
	* @param {*} key
	* @param {*} value
	* @param {number} w - Already-computed weight.
	* @returns {boolean} \`true\` when the insert was rejected and must be skipped.
	*/
	_rejectIfOversized(e, t, n) {
		if (!this.rejectOversized || !Number.isFinite(this.maxWeight) || n <= this.maxWeight) return !1;
		this._rejected++;
		try {
			this.onEvict && this.onEvict(e, t, "rejected-oversized");
		} catch (r) {
			this._notifyError(r, "PowerCache onEvict callback threw (rejected-oversized)");
		}
		return !0;
	}
	/**
	* Insert a key that is not already present, applying the admission policy.
	*
	* Shared by \`set\` and \`setMany\` for the same reason as
	* {@link PowerCache#_rejectIfOversized}: \`setMany\` omitted the TinyLFU sketch
	* and the admission window entirely, so a bulk load was invisible to admission
	* — \`sketch.estimate(key) === 0\` for every key written that way, and a
	* frequency-driven filter cannot judge a key it has never seen.
	*
	* @private
	* @param {*} key
	* @param {*} value
	* @param {number} w - Already-computed weight.
	* @param {number} expiresAt - Already-computed absolute expiry.
	* @param {number} previousSize - \`this._map.size\` before this insert, which the
	*   window arbitration needs to tell "grew by one" from "replaced one".
	* @returns {boolean} \`false\` when the admission filter refused the key.
	*/
	_insertNew(e, t, n, r, i) {
		if (this._sketch && this._windowSize > 0) {
			const l = this._allocNode(e, t, n, r);
			return this._map.set(e, l), l.inWindow = !0, this._append(l), this._currentWeight += l.weight || 0, this._arbitrateWindow(i), !0;
		}
		if (this._sketch && this._map.size >= this.maxEntries) {
			const l = this._evictionCandidate || this._head, o = this._sketch.estimate(e);
			if (l && this._sketch.estimate(l.key) >= o) return this._rejectedAdmission += 1, !1;
		}
		const s = this._allocNode(e, t, n, r);
		return this._policy !== "s3fifo" && this._map.set(e, s), this._append(s), this._currentWeight += s.weight || 0, !0;
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
	* @param {number|null} [options.weight] - Optional explicit weight for the entry. If omitted, \`weightFn\` is used.
	* @returns {this|false} \`this\` on success, or \`false\` when insertion was rejected due to oversize.
	*/
	set(e, t, { ttl: n = this.defaultTTL, weight: r = null } = {}) {
		const i = this._now(), s = this._expiresAt(n, i), l = this._computeWeight(t, r);
		if (this._rejectIfOversized(e, t, l)) return !1;
		let o = this._map.get(e);
		if (o === void 0 && this._policy === "s3fifo" && (o = this._smallMap.get(e) || this._ghostMap.get(e)), o !== void 0) this._updateExisting(o, t, l, s);
		else if (!this._insertNew(e, t, l, s, this._map.size)) return this;
		return this._sketch?.increment(e), this._evictIfNeeded(), this;
	}
	/**
	* Overwrite an entry that is already in the cache.
	*
	* Shared by \`set\` and \`setMany\`. Split out for the same reason as the insert
	* path above: \`setMany\` had its own copy of this arithmetic too, so the two
	* had already drifted on the TTL and on admission before the weight bookkeeping
	* was checked.
	*
	* @private
	* @param {*} node - The already-fetched node from \`_map\`, passed in rather than
	*   re-fetched. This used to take a \`key\` and call \`this._map.get(key)\` itself,
	*   which made every caller read the map twice — see PERF-003 at the call site.
	* @param {*} value
	* @param {number} w - Already-computed weight.
	* @param {number} expiresAt - Already-computed absolute expiry.
	* @returns {void}
	*/
	_updateExisting(e, t, n, r) {
		this._currentWeight -= e.weight || 0, e.value = t, e.weight = n, e.expiresAt = r, this._currentWeight += e.weight || 0, this._moveToTail(e);
	}
	/**
	* Retrieve a value and mark it as recently used.
	* @param {*} key
	* @returns {*|undefined} The stored value or \`undefined\` if missing/expired.
	*/
	get(e) {
		const t = this._fetchValidNode(e, { countMiss: !0 });
		if (t) return this._moveToTail(t), this._hits++, this._sketch?.increment(e), t.value;
	}
	/**
	* Get a value without updating recency.
	* Returns \`undefined\` for missing or expired entries.
	* @param {*} key
	* @returns {*|undefined}
	*/
	peek(e) {
		const t = this._fetchValidNode(e);
		return t ? t.value : void 0;
	}
	/**
	* Check membership without affecting recency.
	* @param {*} key
	* @param {Object} [options]
	* @param {boolean} [options.ignoreExpiry=false] If true, consider expired entries as present.
	* @returns {boolean}
	*/
	has(e, { ignoreExpiry: t = !1 } = {}) {
		return !!this._fetchValidNode(e, { ignoreExpiry: t });
	}
	/**
	* \`getOrSetAsync\` using the cache's \`fetchMethod\` when no per-call factory is
	* given.
	*
	* The reason this exists rather than as a required argument: the row's shape
	* (\`fetchMethod\` on the instance) removes a function literal from **every**
	* call site, which is most of the cost of the async cache API in a hot path.
	* The per-call factory still wins, so one caller can override a cache-wide
	* default — a cache is often keyed by more than one kind of resource.
	*
	* @param {*} key
	* @param {Function} [factory] Overrides the cache's \`fetchMethod\`.
	* @param {PowerCacheGetOrFetchOptions} [options] Passed through to \`getOrSetAsync\`.
	* @returns {Promise<*>}
	*/
	getOrFetch(e, t, n = {}) {
		const r = t ?? this.fetchMethod;
		return typeof r != "function" ? Promise.reject(/* @__PURE__ */ new TypeError("PowerCache.getOrFetch: no factory given and no \`fetchMethod\` configured")) : this.getOrSetAsync(e, r, n);
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
	getOrSet(e, t, { ttl: n = void 0, weight: r = void 0, staleWhileRevalidate: i = this.allowStale } = {}) {
		const s = this._now(), l = this._fetchValidNode(e, {
			countMiss: !1,
			allowExpired: i,
			now: s
		});
		if (l) if (l.expiresAt && l.expiresAt <= s) {
			if (typeof t == "function" && this._staleServable(l, s)) return this._moveToTail(l), this._hits++, this._staleServes++, this._refreshStaleEntry(e, t, {
				ttl: n,
				weight: r
			}), l.value;
			this._removeExpiredNode(l, s), this._misses++;
		} else return this._moveToTail(l), this._hits++, l.value;
		else this._misses++;
		if (typeof t == "function") {
			const o = t();
			return typeof o?.then == "function" ? o.then((u) => {
				try {
					this.set(e, u, {
						ttl: n,
						weight: r
					});
				} catch (f) {
					this._notifyError(f, "PowerCache: storing an async value threw");
				}
				return u;
			}) : (this.set(e, o, {
				ttl: n,
				weight: r
			}), o);
		}
		return this.set(e, t, {
			ttl: n,
			weight: r
		}), t;
	}
	/**
	* Bulk set multiple entries. Accepts an iterable/array of [key, value] pairs.
	* Computes weight once per value and applies a single eviction pass at the end.
	*
	* The per-entry decisions are \`set\`'s, not a second set of them: oversize
	* rejection, the TinyLFU sketch and the admission window are all applied here.
	* \`setMany\` used to insert through a simplified path that did none of the
	* three, so a bulk load was invisible to admission and a rejected value came
	* back out of the bulk eviction pass wearing the wrong \`onEvict\` reason.
	*
	* **It still returns \`this\`, not \`false\`, when a value is rejected** — that is
	* its documented contract for chaining, and changing it would be a breaking API
	* change for a batch of a thousand entries. The signal is \`onEvict\` with
	* \`'rejected-oversized'\`, and \`stats().rejected\` afterwards. \`set\` returns
	* \`false\` because it can.
	*
	* @param {Iterable<[*,*]>} entries
	* @param {Object} [options]
	* @param {number} [options.ttl]
	* @param {number} [options.weight]
	* @returns {this}
	*/
	setMany(e, { ttl: t = void 0, weight: n = void 0 } = {}) {
		const r = this._now(), i = this._expiresAt(t, r);
		for (const s of e) {
			if (!s) continue;
			const [l, o] = s, u = this._computeWeight(o, n);
			if (this._rejectIfOversized(l, o, u)) continue;
			const f = this._map.get(l);
			if (f !== void 0) this._updateExisting(f, o, u, i);
			else if (!this._insertNew(l, o, u, i, this._map.size)) continue;
			this._sketch?.increment(l);
		}
		return this._evictIfNeeded(), this;
	}
	/**
	* Bulk get multiple keys. Returns a Map of found entries.
	* @param {Iterable<*>} keys
	* @param {Object} [options]
	* @param {boolean} [options.ignoreExpiry=false]
	* @returns {Map<string, *>} One entry per resolved key, in input order.
	*/
	getMany(e, { ignoreExpiry: t = !1 } = {}) {
		const n = /* @__PURE__ */ new Map();
		for (const r of e) {
			const i = this._fetchValidNode(r, {
				ignoreExpiry: t,
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
	touch(e, t = void 0) {
		const n = this._now(), r = this._fetchValidNode(e, { now: n });
		return r ? (t !== void 0 && (r.expiresAt = this._expiresAt(t, n)), this._moveToTail(r), !0) : !1;
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
	* @param {number} [options.timeout] Per-call override of the cache's \`defaultAsyncTimeout\`, in ms.
	* @returns {Promise<*>}
	*/
	getOrSetAsync(e, t, { ttl: n = void 0, weight: r = void 0, staleWhileRevalidate: i = this.allowStale, timeout: s = void 0 } = {}) {
		if (typeof t != "function") return Promise.resolve(this.getOrSet(e, t, {
			ttl: n,
			weight: r
		}));
		const l = this._now(), o = this._map.get(e);
		if (o) if (o.expiresAt && o.expiresAt <= l) {
			if (i && this._staleServable(o, l)) return this._moveToTail(o), this._hits++, this._staleServes++, this._refreshStaleEntry(e, t, {
				ttl: n,
				weight: r
			}), Promise.resolve(o.value);
			this._removeExpiredNode(o, l);
		} else return this._moveToTail(o), this._hits++, Promise.resolve(o.value);
		if (this._inflightPromises.has(e)) return this._inflightPromises.get(e);
		this._misses++;
		const u = new AbortController();
		let f;
		try {
			f = Promise.resolve().then(() => t(u.signal));
		} catch (M) {
			return Promise.reject(M);
		}
		const g = Number.isFinite(Number(s)) ? Math.max(0, Math.floor(Number(s))) : Number.isFinite(Number(this._defaultAsyncTimeout)) ? this._defaultAsyncTimeout : void 0;
		let w = f;
		if (typeof g == "number" && Number.isFinite(g) && g > 0) {
			let M;
			w = new Promise((T, z) => {
				M = setTimeout(() => {
					try {
						z(/* @__PURE__ */ new Error("getOrSetAsync timeout"));
					} catch {}
				}, g), f.then((R) => {
					try {
						M && clearTimeout(M);
					} catch ($) {
						this._notifyError($, "PowerCache: clearTimeout threw");
					}
					T(R);
				}, (R) => {
					try {
						M && clearTimeout(M);
					} catch ($) {
						this._notifyError($, "PowerCache: clearTimeout threw");
					}
					z(R);
				});
			});
		}
		f.then((M) => {
			try {
				this.set(e, M, {
					ttl: n,
					weight: r
				});
			} catch (T) {
				this._notifyError(T, "PowerCache getOrSetAsync: storing a late value threw");
			}
		}, () => {});
		const P = w.finally(() => {
			this._abortInflight(e, "timed out"), this._inflightPromises.delete(e), this._inflightControllers.delete(e);
		});
		return this._inflightPromises.set(e, f), this._inflightControllers.set(e, u), P;
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
	* @param {{ignoreExpiry?: boolean, maxNodes?: number, compareFn?: function(any, any): boolean}} [options]
	*   \`ignoreExpiry\` considers expired entries as present; \`maxNodes\` bounds how far
	*   the scan goes and \`compareFn\` replaces the default deep comparison.
	* @returns {boolean}
	*/
	hasEqual(e, t, n = {}) {
		const { ignoreExpiry: r = !1, maxNodes: i, compareFn: s } = n || {}, l = this._fetchValidNode(e, { ignoreExpiry: r });
		if (!l) return !1;
		const o = l.value;
		return o === t ? !0 : typeof o != "object" || o === null || typeof t != "object" || t === null ? o === t : Nt(o, t, ga({
			maxNodes: i,
			compareFn: s
		}));
	}
	/**
	* Delete an entry from the cache.
	* @param {*} key
	* @returns {boolean} true if the key was removed.
	*/
	delete(e) {
		this._abortInflight(e, "deleted");
		let t = this._map.get(e);
		if (!t && this._policy === "s3fifo" && (t = this._smallMap.get(e) || this._ghostMap.get(e)), !t) return !1;
		this._unlinkNode(t);
		try {
			this.onEvict && this.onEvict(t.key, t.value, "deleted");
		} catch (n) {
			this._notifyError(n, "PowerCache onEvict callback threw (deleted)");
		}
		return this._freeNode(t), !0;
	}
	/**
	* Remove every entry the predicate selects, and return how many went.
	*
	* The row that asked for this (\`GAP-017\`) also asked for
	* \`entriesAscending()\` / \`entriesDescending()\`. **Those are not added**, and
	* the reason is worth more than the two methods would be: \`entries(order)\`
	* already takes \`'LRU'\` and \`'MRU'\`, so an alias pair for the same two orders
	* is a second spelling of one decision, and a second spelling is a second
	* thing to document, to type, to test and to keep in sync. Every reference
	* implementation checked has them because it does **not** have an order
	* parameter — this one does, and the parameter is the whole capability.
	*
	* The predicate is evaluated over a **snapshot** of the entries before any of
	* them is removed. Two reasons, and the second is the important one:
	*
	* 1. \`entries()\` documents that removing two *adjacent* entries in one
	*    iteration step can end its walk early, so driving removal off the public
	*    generator would silently drop matches. This walks the list directly
	*    instead, and the list is not being mutated while the predicate runs.
	* 2. A predicate that throws leaves the cache **untouched**. Collecting first
	*    means a failure cannot leave half the entries gone, which is the one
	*    outcome a bulk-removal API must never produce — there is no way to undo
	*    it and no counter that would tell a caller which half survived.
	*
	* @param {(key: *, value: *) => boolean} predicate - Return truthy to remove.
	* @returns {number} Entries removed.
	*/
	invalidate(e) {
		if (typeof e != "function") throw new TypeError(\`PowerCache invalidate(predicate): predicate must be a function, got \${typeof e}\`);
		const t = [];
		for (let r = this._head; r; r = r.next) e(r.key, r.value) && t.push(r);
		let n = 0;
		for (const r of t) if (this._map.get(r.key) === r) {
			this._abortInflight(r.key, "invalidated"), this._unlinkNode(r), this._evictions += 1, n += 1;
			try {
				this.onEvict && this.onEvict(r.key, r.value, "invalidated");
			} catch (i) {
				this._notifyError(i, "PowerCache onEvict callback threw (invalidated)");
			}
			this._freeNode(r);
		}
		return (!this._evictionCandidate || !Nn(this._evictionCandidate, this._head, this._tail)) && (this._evictionCandidate = this._head), n;
	}
	/**
	* Evict up to \`count\` entries, least-recently-used first, and return how many
	* went.
	*
	* Distinct from the sweep \`maxEntries\` drives, which evicts until the cache is
	* *within* its limit and reports no number. This is the explicit version: a
	* caller shedding memory before a spike, or after a deploy, wants a count and a
	* return value, not a cache that happens to be smaller.
	*
	* \`count\` above the current size removes everything and reports the real
	* number removed rather than the number asked for — reporting the request
	* would make \`evict(1e9)\` on an empty cache report 1000000000.
	*
	* \`count\` must be a \`number\`, and \`Number()\` is deliberately **not** used to
	* coerce: it would turn \`null\` into 0, \`true\` into 1 and \`'3'\` into 3, so
	* \`evict(null)\` would silently do nothing and \`evict(true)\` would silently evict
	* one. This is the same rule the TTL normaliser in this class already applies,
	* for the same reason — a typo in a count must not read as a deliberate value.
	*
	* @param {number} [count=1]
	* @returns {number} Entries removed.
	*/
	evict(e = 1) {
		if (typeof e != "number" || !Number.isInteger(e) || e < 0) throw new TypeError(\`PowerCache evict(count): count must be a non-negative integer number, got \${typeof e == "string" ? \`'\${e}'\` : String(e)}\`);
		let t = 0;
		for (; t < e;) {
			const n = this._evictionCandidate || this._head;
			if (!n) break;
			this._abortInflight(n.key, "evicted"), this._unlinkNode(n, { advanceEvictionCandidate: !0 }), this._evictions += 1, t += 1;
			try {
				this.onEvict && this.onEvict(n.key, n.value, "evicted");
			} catch (r) {
				this._notifyError(r, "PowerCache onEvict callback threw");
			}
			this._freeNode(n);
		}
		return this._evictionCandidate || (this._evictionCandidate = this._head), t;
	}
	/**
	* Clear the cache and return nodes to the pool.
	* @returns {void}
	*/
	clear() {
		for (const e of [...this._inflightPromises.keys()]) this._abortInflight(e, "cleared");
		for (let e = this._head; e;) {
			const t = e.next;
			this._freeNode(e), e = t;
		}
		this._head = this._tail = null, this._map.clear(), this._smallMap?.clear(), this._ghostMap?.clear(), this._smallSize = 0, this._ghostSize = 0, this._smallHead = this._smallTail = null, this._ghostHead = this._ghostTail = null, this._sieveHand = null, this._sketch?.clear(), this._rejectedAdmission = 0, this._currentWeight = 0, this._cleanupCursor = null, this._cleanupCursorValid = !1, this._evictionCandidate = null, this._probationEnd = null, this._inflightPromises.clear();
	}
	/**
	* Remove expired entries by scanning from least-recently used to most.
	* @returns {void}
	*/
	/**
	* @returns {number} How many expired entries the sweep removed.
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
	cleanupExpiredUpTo(e = 1 / 0) {
		const t = this._now();
		let n = 0, r = this._cleanupCursor && this._cleanupCursorValid ? this._cleanupCursor : this._head;
		for (; r && n < e;) {
			const i = r.next;
			if (r.expiresAt && r.expiresAt <= t) {
				const s = r.key, l = r.value;
				this._unlinkNode(r);
				try {
					this.onExpire && this.onExpire(s, l);
				} catch (o) {
					this._notifyError(o, "PowerCache onExpire callback threw");
				}
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
	* @param {number|{interval?: number, intervalMs?: number, maxCleanupPerTick?: number}} [intervalOrOptions] -
	*   Cleanup interval in ms, or an options object. Written as one type expression rather
	*   than a bare \`{Object}\` with nested \`@param\` tags: those tags are only valid when
	*   the parent is a bare object, so the earlier spelling had to be \`{number|Object}\`
	*   and every property read off it was an error. Spelling the shape out removes the
	*   reason the nested tags were dropped.
	* @returns {void}
	*/
	startCleanup(e = {}) {
		const t = {
			name: "interval",
			className: "PowerCache",
			min: 1,
			integer: !0,
			fallback: Math.max(Bn, Math.min(this.defaultTTL || 6e4, ci))
		};
		let n, r;
		if (typeof e == "number") n = yt(e, t), r = this.maxCleanupPerTick;
		else n = yt(e.interval ?? e.intervalMs, t), r = Number.isFinite(Number(e.maxCleanupPerTick)) ? Math.max(1, Number(e.maxCleanupPerTick)) : this.maxCleanupPerTick;
		this.stopCleanup(), this._cleanupParams = {
			interval: n,
			maxCleanupPerTick: r
		}, this._cleanupTimer = rr(() => this._cleanupTick(), n);
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
	/**
	* Named alias for the \`Symbol.dispose\` implementation, so callers who do not
	* want to reach for the symbol still have something to call.
	* @returns {void}
	*/
	dispose() {
		this[Symbol.dispose]();
	}
	[Symbol.dispose]() {
		na(this._metrics), this._metrics = null;
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
				this._cleanupParams && (this._cleanupTimer = rr(() => this._cleanupTick(), this._cleanupParams.interval));
				return;
			}
			this._cleanupRunning = !0;
			try {
				this._cleanupParams && this.cleanupExpiredUpTo(this._cleanupParams.maxCleanupPerTick);
			} finally {
				this._cleanupRunning = !1;
			}
			this._cleanupParams && (this._cleanupTimer = rr(() => this._cleanupTick(), this._cleanupParams.interval));
		}
	}
	/**
	* Current number of entries in cache.
	* @returns {number}
	*/
	get size() {
		return this._policy === "s3fifo" ? this._map.size + this._smallSize + this._ghostSize : this._map.size;
	}
	/**
	* Hit rate as a fraction (hits / (hits + misses)).
	* @returns {number}
	*/
	get hitRate() {
		const e = (this._hits || 0) + (this._misses || 0);
		return e ? this._hits / e : 0;
	}
	/**
	* Return runtime statistics for the cache.
	*
	* Two of these counters were unreachable until CACHE-011, and both are read
	* for opposite reasons. \`rejectedAdmission\` is the *policy working*: non-zero
	* under \`admission: 'tinylfu'\` is what makes a scan-resistant cache
	* scan-resistant, so a benchmark that reports zero rejections has measured
	* nothing and a monitoring dashboard that expects a non-zero floor after a
	* traffic shift should be told the filter stopped running.
	* \`weightErrors\` is the opposite — a swallowed failure. \`weightFn\` threw, the
	* throw was routed to \`onError\` if one exists, and the entry was skipped; a
	* cache silently under-weighting itself will evict too much, or too little, and
	* nothing else in this object moves when it does.
	*
	* Both were private fields with tests reading them directly, which is the tell
	* that they were meant to be public: \`PowerCache\` publishes the rest of its
	* counters here and lets \`attach()\` flatten them into metric series, so a
	* field missing from \`stats()\` is a field no collector can ever see.
	*
	* @returns {{size:number, weight:number, hits:number, misses:number, staleServes:number,
	*   evictions:number, expirations:number, rejected:number, rejectedAdmission:number,
	*   weightErrors:number, refreshesSkipped:number, refreshesFailed:number,
	*   refreshesAborted:number, poolSize:number}}
	*/
	stats() {
		return {
			size: this.size,
			weight: this._currentWeight,
			hits: this._hits,
			misses: this._misses,
			staleServes: this._staleServes,
			evictions: this._evictions,
			expirations: this._expirations,
			rejected: this._rejected,
			rejectedAdmission: this._rejectedAdmission,
			weightErrors: this._weightErrors,
			refreshesSkipped: this._refreshesSkipped,
			refreshesFailed: this._refreshesFailed,
			refreshesAborted: this._refreshesAborted,
			poolSize: this._pool.length
		};
	}
	/**
	* Alias for {@link stats}.
	*
	* See \`guides/stats-naming.md\` for why both spellings exist and why this
	* method is written out per class.
	*/
	getStats() {
		return this.stats();
	}
	/**
	* Resize the cache limits and evict if necessary.
	* @param {Object} options
	* @param {number} [options.maxEntries]
	* @param {number} [options.maxWeight]
	*/
	resize({ maxEntries: e, maxWeight: t } = {}) {
		Number.isFinite(Number(e)) && (this.maxEntries = Math.max(0, Number(e))), Number.isFinite(Number(t)) && (this.maxWeight = Math.max(0, Number(t))), this._evictIfNeeded(), this._cleanupCursor = null, this._cleanupCursorValid = !1, this._evictionCandidate = this._head;
	}
	/**
	* Iterate entries in LRU or MRU order.
	*
	* **Mutating the cache from inside the loop is supported, and the walk reads
	* the next link *before* each \`yield\` rather than after.** A walk that advanced
	* after the resume was silently cut short by any mutation of the node the
	* iterator was standing on, because \`_remove\` nulls both links on the node it
	* removes — so \`for (const [k] of cache.entries()) cache.delete(k)\`, the most
	* natural way to write "empty this cache", removed exactly one entry and left
	* the rest, while \`size\` reported the truth afterwards so nothing raised.
	* \`cleanupExpired()\` called from inside the loop was worse, because a caller
	* has no reason to know that calling a public maintenance method is a
	* mutation: a bulk export that swept each turn silently exported nothing.
	*
	* The contract, since a live iterator that can skip is only a legitimate
	* choice when it is a stated one:
	*
	* - Removing the entry currently being visited continues at the next one.
	* - Removing an entry not yet visited skips it (it is gone), and the walk
	*   completes.
	* - Entries *added* during the walk are not visited: the walk started at the
	*   then-tail, and inserting an entry moves the tail out from under it.
	* - Removing two *adjacent* entries in one iteration step may end the walk
	*   early. That is the one residual loss, it needs two removals before a
	*   single resume, and closing it would mean snapshotting the walk into an
	*   array — an allocation on every call to a bulk-export API.
	*
	* **A recency mutation (\`get()\`, \`touch()\`, or \`set()\` on a key already in the
	* list) relinks the entry to the MRU end, which is behind an MRU-first cursor,
	* so the walk arrives back at it.** Left alone that is an infinite loop, not a
	* wrong answer, and it was reachable from one line of loop body. The walk now
	* visits at most as many entries as existed when it started, which ends the
	* cycle; the entries beyond that point are *not* reported, so a loop that
	* refreshes recency as it goes sees a prefix rather than a full pass. Collect
	* the keys first (\`Array.from(cache.keys())\`) if you need every entry.
	*
	* @param {'LRU'|'MRU'} [order='MRU']
	* @returns {IterableIterator<[*,*]>}
	*/
	*entries(e = "MRU") {
		const t = e === "MRU" ? "prev" : "next";
		let n = e === "MRU" ? this._tail : this._head, r = this.size;
		for (; n;) {
			if (r-- <= 0) return;
			const i = n[t];
			yield [n.key, n.value], Nn(n, this._head, this._tail) ? Nn(i, this._head, this._tail) ? n = i : n = n[t] : n = Nn(i, this._head, this._tail) ? i : null;
		}
	}
	[Symbol.iterator]() {
		return this.entries("MRU");
	}
	/**
	* Iterate keys in LRU or MRU order.
	* @param {'LRU'|'MRU'} [order='MRU']
	*/
	*keys(e = "MRU") {
		for (const [t] of this.entries(e)) yield t;
	}
	/**
	* Iterate values in LRU or MRU order.
	* @param {'LRU'|'MRU'} [order='MRU']
	*/
	*values(e = "MRU") {
		for (const [, t] of this.entries(e)) yield t;
	}
};
function Nn(e, t, n) {
	return e ? e.prev !== null || e.next !== null || e === t || e === n : !1;
}
function ga(e) {
	const t = e || {};
	return {
		seen: t.seen ?? null,
		nodes: 0,
		maxNodes: Number.isFinite(t.maxNodes) ? Math.max(1, Math.floor(Number(t.maxNodes))) : sa,
		compareFn: typeof t.compareFn == "function" ? t.compareFn : null,
		exhausted: !1
	};
}
function Nt(e, t, n, r = 0) {
	if (r > 100) return e === t;
	if (n.exhausted) return !1;
	if (n.nodes >= n.maxNodes) return n.exhausted = !0, !1;
	if (n.nodes += 1, e === t) return !0;
	if (n.compareFn) {
		const o = n.compareFn(e, t);
		if (o !== void 0) return !!o;
	}
	if (e == null || t == null || typeof e != "object" || typeof t != "object") return e === t;
	n.seen || (n.seen = /* @__PURE__ */ new WeakMap());
	let i = n.seen.get(e);
	if (i?.has(t)) return !0;
	if (i || (i = /* @__PURE__ */ new WeakSet(), n.seen.set(e, i)), i.add(t), Object.getPrototypeOf(e) !== Object.getPrototypeOf(t)) return !1;
	if (typeof Uint8Array < "u" && e instanceof Uint8Array) {
		if (!(t instanceof Uint8Array) || e.length !== t.length) return !1;
		for (let o = 0; o < e.length; o++) if (e[o] !== t[o]) return !1;
		return !0;
	}
	if (Array.isArray(e)) {
		if (!Array.isArray(t) || e.length !== t.length) return !1;
		for (let o = 0; o < e.length; o++) if (!Nt(e[o], t[o], n, r + 1)) return !1;
		return !0;
	}
	if (ArrayBuffer.isView(e)) {
		if (!ArrayBuffer.isView(t) || e.byteLength !== t.byteLength) return !1;
		const o = new Uint8Array(e.buffer, e.byteOffset || 0, e.byteLength), u = new Uint8Array(t.buffer, t.byteOffset || 0, t.byteLength);
		for (let f = 0; f < o.length; f++) if (o[f] !== u[f]) return !1;
		return !0;
	}
	if (e instanceof ArrayBuffer) {
		if (!(t instanceof ArrayBuffer) || e.byteLength !== t.byteLength) return !1;
		const o = new Uint8Array(e), u = new Uint8Array(t);
		for (let f = 0; f < o.length; f++) if (o[f] !== u[f]) return !1;
		return !0;
	}
	if (e instanceof Date) return t instanceof Date ? e.getTime() === t.getTime() : !1;
	if (e instanceof RegExp) return t instanceof RegExp ? e.toString() === t.toString() : !1;
	if (e instanceof Map) {
		if (!(t instanceof Map) || e.size !== t.size) return !1;
		for (const [o, u] of e) if (!t.has(o) || !Nt(u, t.get(o), n, r + 1)) return !1;
		return !0;
	}
	if (e instanceof Set) {
		if (!(t instanceof Set) || e.size !== t.size) return !1;
		let o = !0;
		for (const T of e) if (T !== null && typeof T == "object") {
			o = !1;
			break;
		}
		if (o) {
			for (const T of e) if (!t.has(T)) return !1;
			return !0;
		}
		const u = Array.from(t), f = new Array(u.length).fill(!1), g = /* @__PURE__ */ new Map();
		for (let T = 0; T < u.length; T++) g.set(u[T], T);
		const w = (T) => {
			try {
				return JSON.stringify(T, (z, R) => R instanceof Date ? {
					__type: "Date",
					v: R.getTime()
				} : R instanceof RegExp ? {
					__type: "RegExp",
					v: R.toString()
				} : typeof ArrayBuffer < "u" && ArrayBuffer.isView(R) ? {
					__type: "TypedArray",
					v: Array.from(new Uint8Array(R.buffer, R.byteOffset || 0, R.byteLength))
				} : typeof ArrayBuffer < "u" && R instanceof ArrayBuffer ? {
					__type: "ArrayBuffer",
					v: Array.from(new Uint8Array(R))
				} : R);
			} catch {
				return null;
			}
		}, P = /* @__PURE__ */ new Map(), M = [];
		for (let T = 0; T < u.length; T++) {
			const z = w(u[T]);
			if (z == null) M.push(T);
			else {
				const R = P.get(z);
				R ? R.push(T) : P.set(z, [T]);
			}
		}
		for (const T of e) {
			const z = g.get(T);
			if (z !== void 0 && !f[z]) {
				f[z] = !0;
				continue;
			}
			const R = w(T);
			let $ = !1;
			if (R != null) {
				const re = P.get(R) || [];
				for (const ee of re) if (!f[ee] && Nt(T, u[ee], n, r + 1)) {
					f[ee] = !0, $ = !0;
					break;
				}
				if ($) continue;
			}
			for (let re = 0; re < u.length; re++) if (!f[re] && Nt(T, u[re], n, r + 1)) {
				f[re] = !0, $ = !0;
				break;
			}
			if (!$) return !1;
		}
		return !0;
	}
	const s = Object.keys(e), l = Object.keys(t);
	if (s.length !== l.length) return !1;
	for (let o = 0; o < s.length; o++) {
		const u = s[o];
		if (!Object.prototype.hasOwnProperty.call(t, u) || !Nt(e[u], t[u], n, r + 1)) return !1;
	}
	return !0;
}
function ma(e, t) {
	Object.prototype.hasOwnProperty.call(e, t) || Object.defineProperty(e, t, {
		value: () => {},
		enumerable: !1,
		writable: !0,
		configurable: !0
	});
}
var _a = class {
	/**
	* @param {number|PowerTTLMapOptions} [defaultTTL=0] Default TTL in milliseconds for keys set
	*   without explicit ttl (0 = no expiry). Accepts either a positional number or an options
	*   object \`{ defaultTTL, onExpire }\` for consistency with the other helpers.
	* @param {PowerTTLMapOptions} [options={}] Options object (used when the first arg is a number).
	*/
	constructor(e = 0, t = {}) {
		br(t, [
			"defaultTTL",
			"onExpire",
			"now"
		], "PowerTTLMap");
		let n = t, r = e;
		e != null && typeof e == "object" && (n = e, r = 0), this._defaultTTL = Number(n?.defaultTTL ?? r) || 0, this._onExpire = typeof n?.onExpire == "function" ? n.onExpire : null, this._now = typeof n?.now == "function" ? n.now : Mi, this._map = /* @__PURE__ */ new Map(), this._expirations = /* @__PURE__ */ new Map(), this._nextExpiryAt = 0, this._nextExpiryDirty = !1, this._disposed = !1;
	}
	/**
	* Resolve a TTL argument that may be either a positional number or an
	* options object \`{ ttl }\` (matching the \`PowerCache.set\` convention).
	* @private
	* @param {number|{ttl?:number}|undefined} ttl
	* @param {number} fallback Default TTL when \`ttl\` is nullish.
	* @returns {number} Resolved TTL in ms (0 = no expiry).
	*/
	_resolveTtl(e, t) {
		if (e != null && typeof e == "object" && !Array.isArray(e) && (e = e.ttl), e == null) return t;
		if (e === 1 / 0) return 0;
		const n = Oi(e, "PowerTTLMap");
		if (n < 0) throw new RangeError(\`PowerTTLMap: \\\`ttl\\\` must be zero (no expiry) or positive (received \${String(e)}). A negative TTL would store an expiry in the past that every comparison reads as live.\`);
		return n;
	}
	/**
	* Set a key with optional TTL (ms).
	* @param {any} key
	* @param {any} value
	* @param {number|{ttl?:number}} [ttl] TTL in milliseconds for this key. Accepts either a
	*   positional number or an options object \`{ ttl }\` for consistency with \`PowerCache.set\`.
	* @returns {this}
	*/
	set(e, t, n) {
		if (this._disposed) throw new TypeError("PowerTTLMap: cannot \`set()\` after \`dispose()\`. The instance is released; construct a new PowerTTLMap, or use \`clear()\` before disposing if you meant to reuse it.");
		const r = this._resolveTtl(n, this._defaultTTL), i = r > 0 ? this._now() + r + 1 : 0, s = this._expirations.get(e) || 0;
		return this._map.set(e, {
			value: t,
			expiresAt: i
		}), i ? this._expirations.set(e, i) : this._expirations.delete(e), this._updateNextExpiryOnWrite(s, i), this;
	}
	/**
	* Internal: remove an entry, invoking \`onExpire\` for its value.
	*
	* This helper centralizes expiry removal for \`get\`, \`has\`, \`touch\`, the
	* iterators and the size sweep. When the entry is expired it is removed from
	* the underlying map.
	*
	* Note it returns nothing. The JSDoc claimed \`@returns {boolean} "true when
	* the entry is missing or expired"\`, which has never been true - and no caller
	* reads a result, because the callers that need to know use \`_checkExpire\`,
	* which answers separately.
	*
	* @private
	* @param {any} key - Map key to check
	* @param {TTLMapEntry} [entry] - Stored entry, or \`undefined\` when the key is
	*   absent.
	* @returns {void}
	*/
	_expireKey(e, t) {
		if (!t) return;
		const n = t.expiresAt || this._expirations.get(e) || 0;
		try {
			const r = t.value;
			if (this._map.delete(e), this._expirations.delete(e), n && this._nextExpiryAt === n && (this._nextExpiryDirty = !0), typeof this._onExpire == "function") try {
				this._onExpire(e, r);
			} catch {}
		} catch {}
	}
	/**
	* Whether a key needs removing: absent, or present and past its expiry.
	* @param {any} key
	* @param {TTLMapEntry} [entry]
	* @returns {boolean}
	*/
	_checkExpire(e, t) {
		return t ? t.expiresAt && this._now() > t.expiresAt ? (this._expireKey(e, t), !0) : !1 : !0;
	}
	/**
	* Get a value, returning \`undefined\` when missing or expired.
	* @param {any} key
	* @returns {any|undefined}
	*/
	get(e) {
		const t = this._map.get(e);
		if (!(t === void 0 || this._checkExpire(e, t))) return t.value;
	}
	/**
	* Check whether a key exists and is not expired.
	* @param {any} key
	* @returns {boolean}
	*/
	has(e) {
		const t = this._map.get(e);
		return !this._checkExpire(e, t);
	}
	/**
	* Delete a key.
	* @param {any} key
	* @returns {boolean}
	*/
	delete(e) {
		const t = this._expirations.get(e) || 0;
		return this._expirations.delete(e), t && this._nextExpiryAt === t && (this._nextExpiryDirty = !0), this._map.delete(e);
	}
	/**
	* Remove all entries.
	* @returns {void}
	*/
	/**
	* Alias for {@link PowerTTLMap#clear}.
	*
	* \`clear()\` here empties the container, and "reset" is a natural second word
	* for exactly that - so a caller who reaches for \`reset()\` on this class gets
	* the obvious thing instead of a \`TypeError\`. No limiter gets this alias: for
	* \`PowerThrottle\` and \`PowerPermitGate\`, \`reset()\` *refills* and \`clear()\`
	* would read as the opposite, and the two are deliberately not synonyms.
	*
	* @returns {void}
	*/
	reset() {
		this.clear();
	}
	clear() {
		this._map.clear(), this._expirations.clear(), this._nextExpiryAt = 0, this._nextExpiryDirty = !1;
	}
	/**
	* Refresh TTL for an existing key. No-op if missing/expired.
	* @param {any} key
	* @param {number|{ttl?:number}} [ttl]
	* @returns {boolean} True when TTL refreshed.
	*/
	touch(e, t) {
		const n = this._map.get(e);
		if (!n) return !1;
		if (n.expiresAt && this._now() > n.expiresAt) return this._expireKey(e, n), !1;
		const r = n.expiresAt || 0, i = this._resolveTtl(t, this._defaultTTL);
		return n.expiresAt = i > 0 ? this._now() + i + 1 : 0, n.expiresAt ? this._expirations.set(e, n.expiresAt) : this._expirations.delete(e), this._updateNextExpiryOnWrite(r, n.expiresAt), !0;
	}
	/**
	* Number of entries currently resident in the map.
	*
	* **This is \`Map.size\`, not "how many entries are still live".** The two
	* used to be the same getter, and that was a design smell: reading \`.size\`
	* called \`_sweepExpirations\`, which iterates the expiration index, removes
	* entries, and fires \`onExpire\` for each. A property read with a callback
	* side effect is not a property read — it is an operation wearing a
	* property's syntax, so \`if (map.size)\` was a mutation, a \`size\` check in a
	* render loop was O(k) per frame, and the cost of the answer was invisible
	* at the call site.
	*
	* Expired-but-not-yet-swept entries are resident and are therefore counted.
	* That is the honest meaning of the number, it is O(1), and it is what
	* \`Map\` users expect. Use {@link PowerTTLMap#expiredCount} when you want the
	* live count, or {@link PowerTTLMap#purge} to actually collect.
	*
	* @returns {number}
	*/
	get size() {
		return this._map.size;
	}
	/**
	* How many resident entries are past their expiry and awaiting collection.
	*
	* The live count is \`size - expiredCount\`. Read-only: this does not sweep and
	* does not fire \`onExpire\`, so it is safe to use as a diagnostic without
	* changing the map. It does walk the expiration index, so it is O(k) in the
	* number of entries that *have* an expiry — which is why the hot path reads
	* {@link PowerTTLMap#size} and this is for reporting.
	*
	* @returns {number}
	*/
	get expiredCount() {
		if (!this._map.size || !this._expirations.size) return 0;
		const e = this._now();
		let t = 0;
		for (const n of this._expirations.values()) n && e > n && t++;
		return t;
	}
	/**
	* Collect every entry that is already past its expiry, firing \`onExpire\` for
	* each.
	*
	* The explicit spelling of what \`size\` used to do implicitly. Reads and
	* \`expiredCount\` are pure; collection is opt-in.
	*
	* @returns {number} How many entries were removed.
	*/
	purge() {
		if (!this._map.size || !this._expirations.size) return 0;
		const e = this._now();
		let t = 0;
		for (const n of this._expirations.values()) n && e > n && t++;
		return t && this._sweepExpirations(e), t;
	}
	/**
	* Keep \`_nextExpiryAt\` pointing at the soonest live expiry, invalidating the
	* cached \`size\` shortcut when the entry that held it is gone or replaced.
	*
	* @param {number} prevExpiry - The key's expiry before this write, \`0\` if none.
	* @param {number} nextExpiry - The key's expiry after this write, \`0\` if none.
	* @returns {void}
	*/
	_updateNextExpiryOnWrite(e, t) {
		e && this._nextExpiryAt === e && e !== t && (this._nextExpiryDirty = !0), t && (!this._nextExpiryAt || t < this._nextExpiryAt) && (this._nextExpiryAt = t);
	}
	/**
	* Drop every expired entry the expiration index knows about, then recompute
	* the soonest remaining expiry.
	*
	* @param {number} now
	* @returns {void}
	*/
	_sweepExpirations(e) {
		let t = 0;
		for (const [n, r] of this._expirations) {
			if (r && e > r) {
				const i = this._map.get(n);
				this._expireKey(n, i);
				continue;
			}
			r && (!t || r < t) && (t = r);
		}
		this._nextExpiryAt = t, this._nextExpiryDirty = !1;
	}
	/**
	* Iterate entries [key, value] skipping expired entries.
	*
	* Expired entries encountered during the walk are **collected** as a side
	* effect, firing \`onExpire\`. That is deliberate and is a different situation
	* from {@link PowerTTLMap#size}: iteration is an operation, so a caller can
	* see it happen, whereas a property read cannot.
	*
	* @returns {IterableIterator<[any, any]>}
	*/
	*entries() {
		const e = this._now();
		for (const [t, n] of this._map) {
			if (n.expiresAt && e > n.expiresAt) {
				this._expireKey(t, n);
				continue;
			}
			yield [t, n.value];
		}
	}
	/**
	* Iterate keys of non-expired entries.
	* @returns {IterableIterator<any>}
	*/
	*keys() {
		for (const [e] of this.entries()) yield e;
	}
	/**
	* Iterate values of non-expired entries.
	* @returns {IterableIterator<any>}
	*/
	*values() {
		for (const [, e] of this.entries()) yield e;
	}
	/**
	* Call \`cb\` for each non-expired entry.
	* @param {(value:any, key:any, map:PowerTTLMap)=>void} cb
	* @param {any} [thisArg]
	* @returns {void}
	*/
	forEach(e, t) {
		for (const [n, r] of this.entries()) e.call(t, r, n, this);
	}
	/**
	* Default iterator yielding \`[key, value]\` pairs for non-expired entries.
	*/
	[Symbol.iterator]() {
		return this.entries();
	}
	/**
	* Release every resource this instance holds.
	*
	* Idempotent, and safe to call while the instance is idle. Exists so the
	* instance works with \`using\` / \`await using\` and gives callers an explicit
	* name to call.
	*
	* **Afterwards the map is inert rather than reusable: \`set()\` throws.** That is
	* the fix in CACHE-014, and it is a deliberate choice against the alternative of
	* leaving the instance writable. \`dispose()\` neutralises \`clear()\` so a second
	* call is a no-op, so an instance that still accepted writes would hold entries
	* the caller had no way to remove. Reads keep working and report an empty map.
	*
	* @returns {void}
	*/
	dispose() {
		this._disposed || (this._disposed = !0, this.clear(), ma(this, "clear"));
	}
	/**
	* Alias for {@link dispose}, so \`using x = new X()\` releases the instance
	* deterministically at scope exit.
	* @returns {void}
	*/
	[Symbol.dispose]() {
		this.dispose();
	}
};
const ba = new da({ maxEntries: 500 }), Pn = new _a(0);
let ir = 3e5;
async function ya(e, t) {
	try {
		if (!e || Pn.has(e)) return null;
		try {
			const n = await ba.getOrSetAsync(e, async () => {
				const r = await t();
				if (r == null) throw new Error("importCache: loader returned null");
				return r;
			});
			return Pn.delete(e), n;
		} catch {
			return Pn.set(e, 1, ir), null;
		}
	} catch {
		return null;
	}
}
async function wa(e) {
	return await ya(e, async () => {
		try {
			return await import(e);
		} catch {
			return null;
		}
	});
}
let gt, mt;
function xa() {
	return gt !== void 0 ? gt === !1 ? null : gt : typeof TextEncoder < "u" ? (gt = new TextEncoder(), gt) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (gt = { encode: (e) => new Uint8Array(Buffer.from(e)) }, gt) : null;
}
function Lt(e) {
	if (e instanceof ArrayBuffer) return !0;
	try {
		return typeof Reflect.get(ArrayBuffer.prototype, "byteLength", e) == "number";
	} catch {
		return !1;
	}
}
function Ni(e) {
	if (typeof SharedArrayBuffer > "u") return !1;
	if (e instanceof SharedArrayBuffer) return !0;
	try {
		return typeof Reflect.get(SharedArrayBuffer.prototype, "byteLength", e) == "number";
	} catch {
		return !1;
	}
}
function Ea() {
	return mt !== void 0 ? mt === !1 ? null : mt : typeof TextDecoder < "u" ? (mt = new TextDecoder(), mt) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (mt = { decode: (e) => Buffer.from(e).toString("utf8") }, mt) : null;
}
const Pi = (e, t) => {
	if (e instanceof Uint8Array) return e;
	if (ArrayBuffer.isView(e)) return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
	if (Lt(e)) return new Uint8Array(e);
	if (Ni(e)) return new Uint8Array(e);
	const n = t ?? JSON.stringify(e);
	if (typeof n != "string") throw new TypeError(\`PowerBuffer.o2u8: JSON.stringify returned \${n === void 0 ? "undefined" : typeof n} for a value of type \${typeof e}, which is not encodable. Functions, Symbols and \\\`undefined\\\` have no JSON representation.\`);
	const r = xa();
	if (typeof r?.encode == "function") return r.encode(n);
	throw new Error("No TextEncoder or Buffer available to encode object");
}, Ci = (e) => {
	let t;
	if (e instanceof Uint8Array) t = e;
	else if (ArrayBuffer.isView(e)) t = new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
	else if (Lt(e)) t = new Uint8Array(e);
	else if (Ni(e)) t = new Uint8Array(e);
	else if (typeof Buffer < "u" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(e)) t = new Uint8Array(e);
	else throw new TypeError("Unsupported input to u82o, expected ArrayBuffer/TypedArray/Buffer");
	const n = Ea();
	if (typeof n?.decode == "function") return JSON.parse(n.decode(t));
	throw new Error("No TextDecoder or Buffer available to decode object");
};
const it = Object.freeze({
	JSON: 0,
	RAW: 2
});
const Ii = /* @__PURE__ */ new Set([
	"framed",
	"legacy",
	"negotiated"
]);
for (const e of [
	"add",
	"delete",
	"clear"
]) Object.defineProperty(Ii, e, {
	value: () => {
		throw new TypeError(\`MESSAGE_CODECS is read-only: \\\`\${e}()\\\` would let a consumer widen the set of codecs a pool accepts, and PowerPool validates against it.\`);
	},
	enumerable: !1,
	writable: !1,
	configurable: !1
});
const ka = /* @__PURE__ */ new Map([[it.JSON, "json"], [it.RAW, "raw"]]), Ta = /* @__PURE__ */ new Map([["json", it.JSON], ["raw", it.RAW]]);
function Li() {
	return typeof structuredClone == "function";
}
function Un(e) {
	return Lt(e) || typeof ArrayBuffer < "u" && ArrayBuffer.isView(e);
}
function Di(e) {
	return Un(e) ? "raw" : "json";
}
function va(e, t = {}) {
	const n = t.codec || Di(e), r = Ta.get(n);
	if (r === void 0) throw new TypeError(\`PowerMessageCodec: unknown codec "\${n}". Expected "json" or "raw". For structured-clone speed on a MessagePort/Worker use encodeNativeEnvelope() instead.\`);
	let i;
	if (r === it.RAW) {
		if (!Un(e)) throw new TypeError("PowerMessageCodec: the \\"raw\\" codec requires an ArrayBuffer or a typed array");
		i = Lt(e) ? new Uint8Array(e) : new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
	} else i = Pi(e);
	return ur(r, i);
}
function ur(e, t) {
	const n = new Uint8Array(6 + t.length);
	return n[0] = 1, n[1] = e, n[2] = t.length & 255, n[3] = t.length >>> 8 & 255, n[4] = t.length >>> 16 & 255, n[5] = t.length >>> 24 & 255, n.set(t, 6), n;
}
function Sa(e) {
	if (typeof e == "string") return ur(it.JSON, Pi(null, e));
	if (!Un(e)) throw new TypeError("PowerMessageCodec: frameEncodedJson() requires a Uint8Array or a JSON string");
	return ur(it.JSON, Fn(e));
}
function hr(e, t = 0) {
	return (e[t + 2] | e[t + 3] << 8 | e[t + 4] << 16 | e[t + 5] << 24) >>> 0;
}
function yr(e, t = {}) {
	const n = t.strict !== !1, r = Fn(e);
	if (r.length < 6) throw new RangeError(\`PowerMessageCodec: frame is \${r.length} bytes, shorter than the 6-byte header\`);
	const i = r[0];
	if (n && i !== 1) throw new RangeError(\`PowerMessageCodec: unsupported protocol version \${i} (expected 1)\`);
	const s = ka.get(r[1]);
	if (s === void 0) throw new RangeError(\`PowerMessageCodec: unknown codec id \${r[1]}\`);
	const l = hr(r);
	if (r.length < 6 + l) throw new RangeError(\`PowerMessageCodec: frame declares a \${l}-byte payload but only \${r.length - 6} bytes are present (truncated frame)\`);
	const o = 6, u = o + l;
	return {
		version: i,
		codec: s,
		value: s === "raw" ? t.rawAsBytes === !0 ? r.subarray(o, u) : r.slice(o, u) : Ci(r.subarray(o, u)),
		byteLength: u
	};
}
function Aa(e) {
	if (e?.maxFrameBytes === void 0) throw new TypeError("PowerMessageCodec: createFrameDecoder() requires \`maxFrameBytes\`. A frame declares its own payload length, so a peer that sends a header and then stops would pin this buffer at whatever size it named. Pass \`Infinity\` to accept that risk explicitly.");
	const t = yt(e.maxFrameBytes, {
		name: "maxFrameBytes",
		className: "PowerMessageCodec.createFrameDecoder",
		min: 6,
		integer: !0,
		allowInfinity: !0
	}), n = e.strict !== !1, r = e.rawAsBytes === !0, i = 1024;
	let s = new Uint8Array(i), l = 0, o = 0;
	function u(f) {
		if (o + f <= s.length) return;
		const g = o - l;
		if (g + f <= s.length) s.copyWithin(0, l, o);
		else {
			let w = s.length || i;
			for (; w < g + f;) w *= 2;
			const P = new Uint8Array(w);
			P.set(s.subarray(l, o)), s = P;
		}
		l = 0, o = g;
	}
	return {
		/**
		* Feed the next chunk of the stream, and take every complete frame out of it.
		*
		* @param {Uint8Array|ArrayBuffer|DataView} chunk - Whatever the transport
		*   handed over. It is copied in, so the caller may reuse or transfer its
		*   buffer immediately.
		* @returns {Array<{version:number, codec:'json'|'raw', value:any, byteLength:number}>}
		*   The frames completed by this chunk — **every** one of them, not the
		*   first. Empty when the chunk held no complete frame, which includes the
		*   ordinary case of a chunk too short to hold a header yet.
		*/
		push(f) {
			const g = Fn(f);
			u(g.length), s.set(g, o), o += g.length;
			const w = [];
			for (; o - l >= 6;) {
				const P = hr(s, l);
				if (6 + P > t) throw new RangeError(\`PowerMessageCodec: frame declares \${6 + P} bytes, over the maxFrameBytes limit of \${t}\`);
				if (o - l < 6 + P) break;
				const M = yr(s.subarray(l, o), {
					strict: n,
					rawAsBytes: r
				});
				w.push(M), l += M.byteLength;
			}
			return l === o && (l = 0, o = 0), w;
		},
		/**
		* Report what is still buffered, for end-of-stream.
		*
		* @param {Object} [flushOptions]
		* @param {boolean} [flushOptions.strict=false] - Throw a \`RangeError\`
		*   naming the shortfall instead of returning the bytes.
		* @returns {Uint8Array} A **copy** of the unconsumed remainder, safe to
		*   keep after the decoder is reused or disposed. Zero-length means the
		*   stream ended on a frame boundary and nothing was lost.
		*/
		flush(f = {}) {
			const g = o - l;
			if (g > 0 && f.strict === !0) {
				const w = g < 6 ? null : hr(s, l), P = w === null ? 6 : 6 + w;
				throw new RangeError(\`PowerMessageCodec: stream ended mid-frame — \${g} of \${P} bytes buffered\` + (w === null ? ", not even a whole header" : ""));
			}
			return s.slice(l, o);
		},
		/** Bytes currently held for an incomplete frame. */
		get pendingBytes() {
			return o - l;
		},
		/**
		* Drop any incomplete frame and start over, keeping the buffer for reuse.
		*
		* For a stream that has desynchronised and cannot be resynchronised: once a
		* frame is mis-parsed the length prefix is no longer trustworthy, so the
		* bytes after it cannot be framed either.
		*/
		reset() {
			l = 0, o = 0;
		},
		/**
		* Release the buffer.
		*
		* This is a **state reset**, not a cancellation: the decoder owns no timer,
		* no listener and no handle of any kind, only bytes. It is safe to keep
		* pushing afterwards — the next \`push\` allocates a fresh buffer — so a
		* \`using\` block that disposes early does not leave a dead object behind.
		*/
		dispose() {
			this.reset(), s = /* @__PURE__ */ new Uint8Array(0);
		},
		[Symbol.dispose]() {
			this.dispose();
		}
	};
}
function Ra(e) {
	if (!Li()) throw new TypeError("PowerMessageCodec: structuredClone is unavailable in this runtime. Use encodeMessage() for a portable JSON frame instead.");
	const t = structuredClone(e);
	return {
		message: t,
		transfer: Bi(t)
	};
}
function Ma(e) {
	if (typeof SharedArrayBuffer < "u" && e.buffer instanceof SharedArrayBuffer) return [];
	if (e.byteOffset !== 0 || e.byteLength !== e.buffer.byteLength) throw new RangeError(\`PowerMessageCodec: refusing to build a transfer list for a \${e.byteLength}-byte view at offset \${e.byteOffset} of a \${e.buffer.byteLength}-byte buffer — transferring \\\`frame.buffer\\\` would detach the whole buffer, including bytes outside this frame. Copy the view, or transfer the buffer it fills.\`);
	return [e.buffer];
}
const wr = "__pp";
function zi(e) {
	return e !== null && typeof e == "object" && e.__pp === 1 && e.kind === "envelope" && "value" in e;
}
function Oa(e) {
	return e !== null && typeof e == "object" && e.__pp === 1 && e.kind === "capabilities" && Array.isArray(e.codecs);
}
function Na(e, t = {}) {
	const n = {
		[wr]: 1,
		kind: "envelope",
		value: e
	};
	return t.correlationId != null && (n.correlationId = String(t.correlationId)), n;
}
function $i(e = {}) {
	const t = Array.isArray(e.codecs) && e.codecs.length ? e.codecs.filter((n) => n === "json" || n === "native") : ["json", "native"];
	return {
		[wr]: 1,
		kind: "capabilities",
		codecs: t.includes("json") ? t : ["json", ...t],
		protocol: 1
	};
}
function Bi(e, t = 8) {
	const n = [], r = /* @__PURE__ */ new Set(), i = (s, l) => {
		if (!(!s || l > t)) {
			if (s instanceof ArrayBuffer) {
				r.has(s) || (r.add(s), n.push(s));
				return;
			}
			if (ArrayBuffer.isView(s)) {
				r.has(s.buffer) || (r.add(s.buffer), n.push(s.buffer));
				return;
			}
			if (typeof s == "object") for (const o of Object.keys(s)) i(s[o], l + 1);
		}
	};
	return i(e, 0), n;
}
function Ui(e) {
	if (zi(e)) return {
		codec: "native",
		value: e.value,
		correlationId: e.correlationId
	};
	if (Lt(e) || ArrayBuffer.isView(e)) {
		const t = Fn(e);
		if (t.length >= 6 && t[0] === 1) {
			const n = yr(t);
			return {
				codec: n.codec,
				value: n.value,
				correlationId: void 0
			};
		}
		if (!Pa(t[0])) throw t[0] === 1 ? /* @__PURE__ */ new RangeError(\`PowerMessageCodec: truncated frame — \${t.length} byte(s) is shorter than the 6-byte header\`) : /* @__PURE__ */ new RangeError(\`PowerMessageCodec: unsupported protocol version \${t[0]} (expected 1)\`);
		return {
			codec: "legacy",
			value: Ci(t),
			correlationId: void 0
		};
	}
	return {
		codec: "raw",
		value: e,
		correlationId: void 0
	};
}
function Pa(e) {
	return e === 32 || e === 9 || e === 10 || e === 13 ? !0 : e >= 32;
}
function Fn(e) {
	if (e instanceof Uint8Array) return e;
	if (Lt(e)) return new Uint8Array(e);
	if (typeof ArrayBuffer < "u" && ArrayBuffer.isView(e)) return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
	throw new TypeError("PowerMessageCodec: expected a Uint8Array, ArrayBuffer or DataView");
}
Object.freeze({
	MESSAGE_PROTOCOL_VERSION: 1,
	CODECS: it,
	MESSAGE_CODECS: Ii,
	HEADER_BYTES: 6,
	encodeMessage: va,
	decodeMessage: yr,
	createFrameDecoder: Aa,
	frameEncodedJson: Sa,
	encodeNative: Ra,
	canUseNativeClone: Li,
	selectCodec: Di,
	isRawPayload: Un,
	frameTransferList: Ma,
	NATIVE_ENVELOPE_KEY: wr,
	NATIVE_PROTOCOL_VERSION: 1,
	isNativeEnvelope: zi,
	isCapabilityAnnouncement: Oa,
	encodeNativeEnvelope: Na,
	announceCapabilities: $i,
	collectTransferables: Bi,
	decodeInbound: Ui
});
var La = (/* @__PURE__ */ Xi((/* @__PURE__ */ Vi(((e, t) => {
	function n(c) {
		return c instanceof Map ? c.clear = c.delete = c.set = function() {
			throw new Error("map is read-only");
		} : c instanceof Set && (c.add = c.clear = c.delete = function() {
			throw new Error("set is read-only");
		}), Object.freeze(c), Object.getOwnPropertyNames(c).forEach((_) => {
			const E = c[_], C = typeof E;
			(C === "object" || C === "function") && !Object.isFrozen(E) && n(E);
		}), c;
	}
	var r = class {
		/**
		* @param {CompiledMode} mode
		*/
		constructor(c) {
			c.data === void 0 && (c.data = {}), this.data = c.data, this.isMatchIgnored = !1;
		}
		ignoreMatch() {
			this.isMatchIgnored = !0;
		}
	};
	function i(c) {
		return c.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
	}
	function s(c, ..._) {
		const E = /* @__PURE__ */ Object.create(null);
		for (const C in c) E[C] = c[C];
		return _.forEach(function(C) {
			for (const U in C) E[U] = C[U];
		}), E;
	}
	const l = "</span>", o = (c) => !!c.scope, u = (c, { prefix: _ }) => {
		if (c.startsWith("language:")) return c.replace("language:", "language-");
		if (c.includes(".")) {
			const E = c.split(".");
			return [\`\${_}\${E.shift()}\`, ...E.map((C, U) => \`\${C}\${"_".repeat(U + 1)}\`)].join(" ");
		}
		return \`\${_}\${c}\`;
	};
	var f = class {
		/**
		* Creates a new HTMLRenderer
		*
		* @param {Tree} parseTree - the parse tree (must support \`walk\` API)
		* @param {{classPrefix: string}} options
		*/
		constructor(c, _) {
			this.buffer = "", this.classPrefix = _.classPrefix, c.walk(this);
		}
		/**
		* Adds texts to the output stream
		*
		* @param {string} text */
		addText(c) {
			this.buffer += i(c);
		}
		/**
		* Adds a node open to the output stream (if needed)
		*
		* @param {Node} node */
		openNode(c) {
			if (!o(c)) return;
			const _ = u(c.scope, { prefix: this.classPrefix });
			this.span(_);
		}
		/**
		* Adds a node close to the output stream (if needed)
		*
		* @param {Node} node */
		closeNode(c) {
			o(c) && (this.buffer += l);
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
		span(c) {
			this.buffer += \`<span class="\${c}">\`;
		}
	};
	const g = (c = {}) => {
		const _ = { children: [] };
		return Object.assign(_, c), _;
	};
	var w = class Fi {
		constructor() {
			this.rootNode = g(), this.stack = [this.rootNode];
		}
		get top() {
			return this.stack[this.stack.length - 1];
		}
		get root() {
			return this.rootNode;
		}
		/** @param {Node} node */
		add(_) {
			this.top.children.push(_);
		}
		/** @param {string} scope */
		openNode(_) {
			const E = g({ scope: _ });
			this.add(E), this.stack.push(E);
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
		walk(_) {
			return this.constructor._walk(_, this.rootNode);
		}
		/**
		* @param {Renderer} builder
		* @param {Node} node
		*/
		static _walk(_, E) {
			return typeof E == "string" ? _.addText(E) : E.children && (_.openNode(E), E.children.forEach((C) => this._walk(_, C)), _.closeNode(E)), _;
		}
		/**
		* @param {Node} node
		*/
		static _collapse(_) {
			typeof _ != "string" && _.children && (_.children.every((E) => typeof E == "string") ? _.children = [_.children.join("")] : _.children.forEach((E) => {
				Fi._collapse(E);
			}));
		}
	}, P = class extends w {
		/**
		* @param {*} options
		*/
		constructor(c) {
			super(), this.options = c;
		}
		/**
		* @param {string} text
		*/
		addText(c) {
			c !== "" && this.add(c);
		}
		/** @param {string} scope */
		startScope(c) {
			this.openNode(c);
		}
		endScope() {
			this.closeNode();
		}
		/**
		* @param {Emitter & {root: DataNode}} emitter
		* @param {string} name
		*/
		__addSublanguage(c, _) {
			const E = c.root;
			_ && (E.scope = \`language:\${_}\`), this.add(E);
		}
		toHTML() {
			return new f(this, this.options).value();
		}
		finalize() {
			return this.closeAllNodes(), !0;
		}
	};
	function M(c) {
		return c ? typeof c == "string" ? c : c.source : null;
	}
	function T(c) {
		return $("(?=", c, ")");
	}
	function z(c) {
		return $("(?:", c, ")*");
	}
	function R(c) {
		return $("(?:", c, ")?");
	}
	function $(...c) {
		return c.map((_) => M(_)).join("");
	}
	function re(c) {
		const _ = c[c.length - 1];
		return typeof _ == "object" && _.constructor === Object ? (c.splice(c.length - 1, 1), _) : {};
	}
	function ee(...c) {
		return "(" + (re(c).capture ? "" : "?:") + c.map((_) => M(_)).join("|") + ")";
	}
	function he(c) {
		return new RegExp(c.toString() + "|").exec("").length - 1;
	}
	function ye(c, _) {
		const E = c && c.exec(_);
		return E && E.index === 0;
	}
	const Ce = new RegExp(ee(/\\[(?:[^\\\\\\]]|\\\\.)*\\]/, /\\(\\?<(?![=!])[^>]+>/, /\\(\\?'[^']+'/, /\\(\\??/, /\\\\([1-9][0-9]*)/, /\\\\./));
	function X(c, { joinWith: _ }) {
		let E = 0;
		return c.map((C) => {
			E += 1;
			const U = E;
			let H = M(C), v = "";
			for (; H.length > 0;) {
				const k = Ce.exec(H);
				if (!k) {
					v += H;
					break;
				}
				v += H.substring(0, k.index), H = H.substring(k.index + k[0].length), k[0][0] === "\\\\" && k[1] ? v += "\\\\" + String(Number(k[1]) + U) : (v += k[0], (k[0] === "(" || /^\\(\\?[<']/.test(k[0])) && E++);
			}
			return v;
		}).map((C) => \`(\${C})\`).join(_);
	}
	const de = /\\b\\B/, te = "[a-zA-Z]\\\\w*", Ie = "[a-zA-Z_]\\\\w*", Et = "\\\\b\\\\d+(\\\\.\\\\d+)?", Dt = "(-?)(\\\\b0[xX][a-fA-F0-9]+|(\\\\b\\\\d+(\\\\.\\\\d*)?|\\\\.\\\\d+)([eE][-+]?\\\\d+)?)", qe = "\\\\b(0b[01]+)", hn = "!|!=|!==|%|%=|&|&&|&=|\\\\*|\\\\*=|\\\\+|\\\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\\\?|\\\\[|\\\\{|\\\\(|\\\\^|\\\\^=|\\\\||\\\\|=|\\\\|\\\\||~", Ve = (c = {}) => {
		const _ = /^#![ ]*\\//;
		return c.binary && (c.begin = $(_, /.*\\b/, c.binary, /\\b.*/)), s({
			scope: "meta",
			begin: _,
			end: /$/,
			relevance: 0,
			/** @type {ModeCallback} */
			"on:begin": (E, C) => {
				E.index !== 0 && C.ignoreMatch();
			}
		}, c);
	}, ot = {
		begin: "\\\\\\\\[\\\\s\\\\S]",
		relevance: 0
	}, jn = {
		scope: "string",
		begin: "'",
		end: "'",
		illegal: "\\\\n",
		contains: [ot]
	}, kt = {
		scope: "string",
		begin: "\\"",
		end: "\\"",
		illegal: "\\\\n",
		contains: [ot]
	}, zt = { begin: /\\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\\b/ }, at = function(c, _, E = {}) {
		const C = s({
			scope: "comment",
			begin: c,
			end: _,
			contains: []
		}, E);
		C.contains.push({
			scope: "doctag",
			begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
			end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
			excludeBegin: !0,
			relevance: 0
		});
		const U = ee("I", "a", "is", "so", "us", "to", "at", "if", "in", "it", "on", /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, /[A-Za-z]+[-][a-z]+/, /[A-Za-z][a-z]{2,}/);
		return C.contains.push({ begin: $(/[ ]+/, "(", U, /[.]?[:]?([.][ ]|[ ])/, "){3}") }), C;
	}, Hn = at("//", "$"), Wn = at("/\\\\*", "\\\\*/"), Gn = at("#", "$");
	var Tt = /* @__PURE__ */ Object.freeze({
		__proto__: null,
		APOS_STRING_MODE: jn,
		BACKSLASH_ESCAPE: ot,
		BINARY_NUMBER_MODE: {
			scope: "number",
			begin: qe,
			relevance: 0
		},
		BINARY_NUMBER_RE: qe,
		COMMENT: at,
		C_BLOCK_COMMENT_MODE: Wn,
		C_LINE_COMMENT_MODE: Hn,
		C_NUMBER_MODE: {
			scope: "number",
			begin: Dt,
			relevance: 0
		},
		C_NUMBER_RE: Dt,
		END_SAME_AS_BEGIN: function(c) {
			return Object.assign(c, {
				/** @type {ModeCallback} */
				"on:begin": (_, E) => {
					E.data._beginMatch = _[1];
				},
				/** @type {ModeCallback} */
				"on:end": (_, E) => {
					E.data._beginMatch !== _[1] && E.ignoreMatch();
				}
			});
		},
		HASH_COMMENT_MODE: Gn,
		IDENT_RE: te,
		MATCH_NOTHING_RE: de,
		METHOD_GUARD: {
			begin: "\\\\.\\\\s*[a-zA-Z_]\\\\w*",
			relevance: 0
		},
		NUMBER_MODE: {
			scope: "number",
			begin: Et,
			relevance: 0
		},
		NUMBER_RE: Et,
		PHRASAL_WORDS_MODE: zt,
		QUOTE_STRING_MODE: kt,
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
		RE_STARTERS_RE: hn,
		SHEBANG: Ve,
		TITLE_MODE: {
			scope: "title",
			begin: te,
			relevance: 0
		},
		UNDERSCORE_IDENT_RE: Ie,
		UNDERSCORE_TITLE_MODE: {
			scope: "title",
			begin: Ie,
			relevance: 0
		}
	});
	function fn(c, _) {
		c.input[c.index - 1] === "." && _.ignoreMatch();
	}
	function G(c, _) {
		c.className !== void 0 && (c.scope = c.className, delete c.className);
	}
	function $t(c, _) {
		_ && c.beginKeywords && (c.begin = "\\\\b(" + c.beginKeywords.split(" ").join("|") + ")(?!\\\\.)(?=\\\\b|\\\\s)", c.__beforeBegin = fn, c.keywords = c.keywords || c.beginKeywords, delete c.beginKeywords, c.relevance === void 0 && (c.relevance = 0));
	}
	function q(c, _) {
		Array.isArray(c.illegal) && (c.illegal = ee(...c.illegal));
	}
	function Bt(c, _) {
		if (c.match) {
			if (c.begin || c.end) throw new Error("begin & end are not supported with match");
			c.begin = c.match, delete c.match;
		}
	}
	function Se(c, _) {
		c.relevance === void 0 && (c.relevance = 1);
	}
	const lt = (c, _) => {
		if (!c.beforeMatch) return;
		if (c.starts) throw new Error("beforeMatch cannot be used with starts");
		const E = Object.assign({}, c);
		Object.keys(c).forEach((C) => {
			delete c[C];
		}), c.keywords = E.keywords, c.begin = $(E.beforeMatch, T(E.begin)), c.starts = {
			relevance: 0,
			contains: [Object.assign(E, { endsParent: !0 })]
		}, c.relevance = 0, delete E.beforeMatch;
	}, pn = [
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
	], Le = "keyword";
	function Ut(c, _, E = Le) {
		const C = /* @__PURE__ */ Object.create(null);
		return typeof c == "string" ? U(E, c.split(" ")) : Array.isArray(c) ? U(E, c) : Object.keys(c).forEach(function(H) {
			Object.assign(C, Ut(c[H], _, H));
		}), C;
		function U(H, v) {
			_ && (v = v.map((k) => k.toLowerCase())), v.forEach(function(k) {
				const O = k.split("|");
				C[O[0]] = [H, Ft(O[0], O[1])];
			});
		}
	}
	function Ft(c, _) {
		return _ ? Number(_) : dn(c) ? 0 : 1;
	}
	function dn(c) {
		return pn.includes(c.toLowerCase());
	}
	const jt = {}, le = (c) => {
		console.error(c);
	}, De = (c, ..._) => {
		console.log(\`WARN: \${c}\`, ..._);
	}, ge = (c, _) => {
		jt[\`\${c}/\${_}\`] || (console.log(\`Deprecated as of \${c}. \${_}\`), jt[\`\${c}/\${_}\`] = !0);
	}, Ze = /* @__PURE__ */ new Error();
	function ct(c, _, { key: E }) {
		let C = 0;
		const U = c[E], H = {}, v = {};
		for (let k = 1; k <= _.length; k++) v[k + C] = U[k], H[k + C] = !0, C += he(_[k - 1]);
		c[E] = v, c[E]._emit = H, c[E]._multi = !0;
	}
	function vt(c) {
		if (Array.isArray(c.begin)) {
			if (c.skip || c.excludeBegin || c.returnBegin) throw le("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Ze;
			if (typeof c.beginScope != "object" || c.beginScope === null) throw le("beginScope must be object"), Ze;
			ct(c, c.begin, { key: "beginScope" }), c.begin = X(c.begin, { joinWith: "" });
		}
	}
	function Ht(c) {
		if (Array.isArray(c.end)) {
			if (c.skip || c.excludeEnd || c.returnEnd) throw le("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Ze;
			if (typeof c.endScope != "object" || c.endScope === null) throw le("endScope must be object"), Ze;
			ct(c, c.end, { key: "endScope" }), c.end = X(c.end, { joinWith: "" });
		}
	}
	function Ye(c) {
		c.scope && typeof c.scope == "object" && c.scope !== null && (c.beginScope = c.scope, delete c.scope);
	}
	function St(c) {
		Ye(c), typeof c.beginScope == "string" && (c.beginScope = { _wrap: c.beginScope }), typeof c.endScope == "string" && (c.endScope = { _wrap: c.endScope }), vt(c), Ht(c);
	}
	function At(c) {
		function _(v, k) {
			return new RegExp(M(v), "m" + (c.case_insensitive ? "i" : "") + (c.unicodeRegex ? "u" : "") + (k ? "g" : ""));
		}
		class E {
			constructor() {
				this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
			}
			addRule(k, O) {
				O.position = this.position++, this.matchIndexes[this.matchAt] = O, this.regexes.push([O, k]), this.matchAt += he(k) + 1;
			}
			compile() {
				this.regexes.length === 0 && (this.exec = () => null);
				const k = this.regexes.map((O) => O[1]);
				this.matcherRe = _(X(k, { joinWith: "|" }), !0), this.lastIndex = 0;
			}
			/** @param {string} s */
			exec(k) {
				this.matcherRe.lastIndex = this.lastIndex;
				const O = this.matcherRe.exec(k);
				if (!O) return null;
				const ne = O.findIndex((Xe, ht) => ht > 0 && Xe !== void 0), Z = this.matchIndexes[ne];
				return O.splice(0, ne), Object.assign(O, Z);
			}
		}
		class C {
			constructor() {
				this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
			}
			getMatcher(k) {
				if (this.multiRegexes[k]) return this.multiRegexes[k];
				const O = new E();
				return this.rules.slice(k).forEach(([ne, Z]) => O.addRule(ne, Z)), O.compile(), this.multiRegexes[k] = O, O;
			}
			resumingScanAtSamePosition() {
				return this.regexIndex !== 0;
			}
			considerAll() {
				this.regexIndex = 0;
			}
			addRule(k, O) {
				this.rules.push([k, O]), O.type === "begin" && this.count++;
			}
			/** @param {string} s */
			exec(k) {
				const O = this.getMatcher(this.regexIndex);
				O.lastIndex = this.lastIndex;
				let ne = O.exec(k);
				if (this.resumingScanAtSamePosition() && !(ne && ne.index === this.lastIndex)) {
					const Z = this.getMatcher(0);
					Z.lastIndex = this.lastIndex + 1, ne = Z.exec(k);
				}
				return ne && (this.regexIndex += ne.position + 1, this.regexIndex === this.count && this.considerAll()), ne;
			}
		}
		function U(v) {
			const k = new C();
			return v.contains.forEach((O) => k.addRule(O.begin, {
				rule: O,
				type: "begin"
			})), v.terminatorEnd && k.addRule(v.terminatorEnd, { type: "end" }), v.illegal && k.addRule(v.illegal, { type: "illegal" }), k;
		}
		function H(v, k) {
			const O = v;
			if (v.isCompiled) return O;
			[
				G,
				Bt,
				St,
				lt
			].forEach((Z) => Z(v, k)), c.compilerExtensions.forEach((Z) => Z(v, k)), v.__beforeBegin = null, [
				$t,
				q,
				Se
			].forEach((Z) => Z(v, k)), v.isCompiled = !0;
			let ne = null;
			return typeof v.keywords == "object" && v.keywords.$pattern && (v.keywords = Object.assign({}, v.keywords), ne = v.keywords.$pattern, delete v.keywords.$pattern), ne = ne || /\\w+/, v.keywords && (v.keywords = Ut(v.keywords, c.case_insensitive)), O.keywordPatternRe = _(ne, !0), k && (v.begin || (v.begin = /\\B|\\b/), O.beginRe = _(O.begin), !v.end && !v.endsWithParent && (v.end = /\\B|\\b/), v.end && (O.endRe = _(O.end)), O.terminatorEnd = M(O.end) || "", v.endsWithParent && k.terminatorEnd && (O.terminatorEnd += (v.end ? "|" : "") + k.terminatorEnd)), v.illegal && (O.illegalRe = _(v.illegal)), v.contains || (v.contains = []), v.contains = [].concat(...v.contains.map(function(Z) {
				return gn(Z === "self" ? v : Z);
			})), v.contains.forEach(function(Z) {
				H(Z, O);
			}), v.starts && H(v.starts, k), O.matcher = U(O), O;
		}
		if (c.compilerExtensions || (c.compilerExtensions = []), c.contains && c.contains.includes("self")) throw new Error("ERR: contains \`self\` is not supported at the top-level of a language.  See documentation.");
		return c.classNameAliases = s(c.classNameAliases || {}), H(c);
	}
	function Wt(c) {
		return c ? c.endsWithParent || Wt(c.starts) : !1;
	}
	function gn(c) {
		return c.variants && !c.cachedVariants && (c.cachedVariants = c.variants.map(function(_) {
			return s(c, { variants: null }, _);
		})), c.cachedVariants ? c.cachedVariants : Wt(c) ? s(c, { starts: c.starts ? s(c.starts) : null }) : Object.isFrozen(c) ? s(c) : c;
	}
	var mn = "11.12.0", Gt = class extends Error {
		constructor(c, _) {
			super(c), this.name = "HTMLInjectionError", this.html = _;
		}
	};
	const ut = i, Ue = s, Fe = /* @__PURE__ */ Symbol("nomatch"), _n = 7, qt = function(c) {
		const _ = /* @__PURE__ */ Object.create(null), E = /* @__PURE__ */ Object.create(null), C = [];
		let U = !0;
		const H = "Could not find the language '{}', did you forget to load/include a language module?", v = {
			disableAutodetect: !0,
			name: "Plain text",
			contains: []
		};
		let k = {
			ignoreUnescapedHTML: !1,
			throwUnescapedHTML: !1,
			noHighlightRe: /^(no-?highlight)$/i,
			languageDetectRe: /\\blang(?:uage)?-([\\w-]+)\\b/i,
			classPrefix: "hljs-",
			cssSelector: "pre code",
			languages: null,
			__emitter: P
		};
		function O(y) {
			return k.noHighlightRe.test(y);
		}
		function ne(y) {
			let A = y.className + " ";
			A += y.parentNode ? y.parentNode.className : "";
			const D = k.languageDetectRe.exec(A);
			if (D) {
				const W = ze(D[1]);
				return W || (De(H.replace("{}", D[1])), De("Falling back to no-highlight mode for this block.", y)), W ? D[1] : "no-highlight";
			}
			return A.split(/\\s+/).find((W) => O(W) || ze(W));
		}
		function Z(y, A, D) {
			let W = "", K = "";
			typeof A == "object" ? (W = y, D = A.ignoreIllegals, K = A.language) : (ge("10.7.0", "highlight(lang, code, ...args) has been deprecated."), ge("10.7.0", \`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277\`), K = y, W = A), D === void 0 && (D = !0);
			const we = {
				code: W,
				language: K
			};
			He("before:highlight", we);
			const me = we.result ? we.result : Xe(we.language, we.code, D);
			return me.code = we.code, He("after:highlight", me), me;
		}
		function Xe(y, A, D, W) {
			const K = /* @__PURE__ */ Object.create(null);
			function we(p, d) {
				return p.keywords[d];
			}
			function me() {
				if (!N.keywords) {
					J.addText(F);
					return;
				}
				let p = 0;
				N.keywordPatternRe.lastIndex = 0;
				let d = N.keywordPatternRe.exec(F), x = "";
				for (; d;) {
					x += F.substring(p, d.index);
					const S = Ae.case_insensitive ? d[0].toLowerCase() : d[0], L = we(N, S);
					if (L) {
						const [Q, fe] = L;
						if (J.addText(x), x = "", K[S] = (K[S] || 0) + 1, K[S] <= _n && (b += fe), Q.startsWith("_")) x += d[0];
						else {
							const et = Ae.classNameAliases[Q] || Q;
							Pe(d[0], et);
						}
					} else x += d[0];
					p = N.keywordPatternRe.lastIndex, d = N.keywordPatternRe.exec(F);
				}
				x += F.substring(p), J.addText(x);
			}
			function xe() {
				if (F === "") return;
				let p = null;
				if (typeof N.subLanguage == "string") {
					if (!_[N.subLanguage]) {
						J.addText(F);
						return;
					}
					p = Xe(N.subLanguage, F, !0, Jt[N.subLanguage]), Jt[N.subLanguage] = p._top;
				} else p = Vt(F, N.subLanguage.length ? N.subLanguage : null);
				N.relevance > 0 && (b += p.relevance), J.__addSublanguage(p._emitter, p.language);
			}
			function ce() {
				N.subLanguage != null ? xe() : me(), F = "";
			}
			function Pe(p, d) {
				p !== "" && (J.startScope(d), J.addText(p), J.endScope());
			}
			function Je(p, d) {
				let x = 1;
				const S = d.length - 1;
				for (; x <= S;) {
					if (!p._emit[x]) {
						x++;
						continue;
					}
					const L = Ae.classNameAliases[p[x]] || p[x], Q = d[x];
					L ? Pe(Q, L) : (F = Q, me(), F = ""), x++;
				}
			}
			function Ee(p, d) {
				return p.scope && typeof p.scope == "string" && J.openNode(Ae.classNameAliases[p.scope] || p.scope), p.beginScope && (p.beginScope._wrap ? (Pe(F, Ae.classNameAliases[p.beginScope._wrap] || p.beginScope._wrap), F = "") : p.beginScope._multi && (Je(p.beginScope, d), F = "")), N = Object.create(p, { parent: { value: N } }), N;
			}
			function Tn(p, d, x) {
				let S = ye(p.endRe, x);
				if (S) {
					if (p["on:end"]) {
						const L = new r(p);
						p["on:end"](d, L), L.isMatchIgnored && (S = !1);
					}
					if (S) {
						for (; p.endsParent && p.parent;) p = p.parent;
						return p;
					}
				}
				if (p.endsWithParent) return Tn(p.parent, d, x);
			}
			function Rt(p) {
				return N.matcher.regexIndex === 0 ? (F += p[0], 1) : (m = !0, 0);
			}
			function Yn(p) {
				const d = p[0], x = p.rule, S = new r(x), L = [x.__beforeBegin, x["on:begin"]];
				for (const Q of L) if (Q && (Q(p, S), S.isMatchIgnored)) return Rt(d);
				return x.skip ? F += d : (x.excludeBegin && (F += d), ce(), !x.returnBegin && !x.excludeBegin && (F = d)), Ee(x, p), x.returnBegin ? 0 : d.length;
			}
			function vn(p) {
				const d = p[0], x = A.substring(p.index), S = Tn(N, p, x);
				if (!S) return Fe;
				const L = N;
				N.endScope && N.endScope._wrap ? (ce(), Pe(d, N.endScope._wrap)) : N.endScope && N.endScope._multi ? (ce(), Je(N.endScope, p)) : L.skip ? F += d : (L.returnEnd || L.excludeEnd || (F += d), ce(), L.excludeEnd && (F = d));
				do
					N.scope && J.closeNode(), !N.skip && !N.subLanguage && (b += N.relevance), N = N.parent;
				while (N !== S.parent);
				return S.starts && Ee(S.starts, p), L.returnEnd ? 0 : d.length;
			}
			function Qe() {
				const p = [];
				for (let d = N; d !== Ae; d = d.parent) d.scope && p.unshift(d.scope);
				p.forEach((d) => J.openNode(d));
			}
			let dt = {};
			function Xt(p, d) {
				const x = d && d[0];
				if (F += p, x == null) return ce(), 0;
				if (dt.type === "begin" && d.type === "end" && dt.index === d.index && x === "") {
					if (F += A.slice(d.index, d.index + 1), !U) {
						const S = /* @__PURE__ */ new Error(\`0 width match regex (\${y})\`);
						throw S.languageName = y, S.badRule = dt.rule, S;
					}
					return 1;
				}
				if (dt = d, d.type === "begin") return Yn(d);
				if (d.type === "illegal" && !D) {
					const S = /* @__PURE__ */ new Error("Illegal lexeme \\"" + x + "\\" for mode \\"" + (N.scope || "<unnamed>") + "\\"");
					throw S.mode = N, S;
				} else if (d.type === "end") {
					const S = vn(d);
					if (S !== Fe) return S;
				}
				if (d.type === "illegal" && x === "") return d.index === A.length || (F += \`
\`), 1;
				if (h > 1e5 && h > d.index * 3) throw /* @__PURE__ */ new Error("potential infinite loop, way more iterations than matches");
				return F += x, x.length;
			}
			const Ae = ze(y);
			if (!Ae) throw le(H.replace("{}", y)), /* @__PURE__ */ new Error("Unknown language: \\"" + y + "\\"");
			const Sn = At(Ae);
			let Kt = "", N = W || Sn;
			const Jt = {}, J = new k.__emitter(k);
			Qe();
			let F = "", b = 0, a = 0, h = 0, m = !1;
			try {
				if (Ae.__emitTokens) Ae.__emitTokens(A, J);
				else {
					for (N.matcher.considerAll();;) {
						h++, m ? m = !1 : N.matcher.considerAll(), N.matcher.lastIndex = a;
						const p = N.matcher.exec(A);
						if (!p) break;
						const d = Xt(A.substring(a, p.index), p);
						a = p.index + d;
					}
					Xt(A.substring(a));
				}
				return J.finalize(), Kt = J.toHTML(), {
					language: y,
					value: Kt,
					relevance: b,
					illegal: !1,
					_emitter: J,
					_top: N
				};
			} catch (p) {
				if (p.message && p.message.includes("Illegal")) return {
					language: y,
					value: ut(A),
					illegal: !0,
					relevance: 0,
					_illegalBy: {
						message: p.message,
						index: a,
						context: A.slice(a - 100, a + 100),
						mode: p.mode,
						resultSoFar: Kt
					},
					_emitter: J
				};
				if (U) return {
					language: y,
					value: ut(A),
					illegal: !1,
					relevance: 0,
					errorRaised: p,
					_emitter: J,
					_top: N
				};
				throw p;
			}
		}
		function ht(y) {
			const A = {
				value: ut(y),
				illegal: !1,
				relevance: 0,
				_top: v,
				_emitter: new k.__emitter(k)
			};
			return A._emitter.addText(y), A;
		}
		function Vt(y, A) {
			A = A || k.languages || Object.keys(_);
			const D = ht(y), W = A.filter(ze).filter(En).map((xe) => Xe(xe, y, !1));
			W.unshift(D);
			const [K, we] = W.sort((xe, ce) => {
				if (xe.relevance !== ce.relevance) return ce.relevance - xe.relevance;
				if (xe.language && ce.language) {
					if (ze(xe.language).supersetOf === ce.language) return 1;
					if (ze(ce.language).supersetOf === xe.language) return -1;
				}
				return 0;
			}), me = K;
			return me.secondBest = we, me;
		}
		function ft(y, A, D) {
			const W = A && E[A] || D;
			y.classList.add("hljs"), y.classList.add(\`language-\${W}\`);
		}
		function Zt(y) {
			let A = null;
			const D = ne(y);
			if (O(D)) return;
			if (He("before:highlightElement", {
				el: y,
				language: D
			}), y.dataset.highlighted) {
				console.log("Element previously highlighted. To highlight again, first unset \`dataset.highlighted\`.", y);
				return;
			}
			if (y.children.length > 0 && (k.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(y)), k.throwUnescapedHTML)) throw new Gt("One of your code blocks includes unescaped HTML.", y.innerHTML);
			A = y;
			const W = A.textContent, K = D ? Z(W, {
				language: D,
				ignoreIllegals: !0
			}) : Vt(W);
			y.innerHTML = K.value, y.dataset.highlighted = "yes", ft(y, D, K.language), y.result = {
				language: K.language,
				re: K.relevance,
				relevance: K.relevance
			}, K.secondBest && (y.secondBest = {
				language: K.secondBest.language,
				relevance: K.secondBest.relevance
			}), He("after:highlightElement", {
				el: y,
				result: K,
				text: W
			});
		}
		function Vn(y) {
			k = Ue(k, y);
		}
		const Y = () => {
			pt(), ge("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
		};
		function Ke() {
			pt(), ge("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
		}
		let bn = !1;
		function pt() {
			function y() {
				pt();
			}
			if (document.readyState === "loading") {
				bn || window.addEventListener("DOMContentLoaded", y, !1), bn = !0;
				return;
			}
			document.querySelectorAll(k.cssSelector).forEach(Zt);
		}
		function Yt(y, A) {
			let D = null;
			try {
				D = A(c);
			} catch (W) {
				if (le("Language definition for '{}' could not be registered.".replace("{}", y)), U) le(W);
				else throw W;
				D = v;
			}
			D.name || (D.name = y), _[y] = D, D.rawDefinition = A.bind(null, c), D.aliases && xn(D.aliases, { languageName: y });
		}
		function yn(y) {
			delete _[y];
			for (const A of Object.keys(E)) E[A] === y && delete E[A];
		}
		function wn() {
			return Object.keys(_);
		}
		function ze(y) {
			return y = (y || "").toLowerCase(), _[y] || _[E[y]];
		}
		function xn(y, { languageName: A }) {
			typeof y == "string" && (y = [y]), y.forEach((D) => {
				E[D.toLowerCase()] = A;
			});
		}
		function En(y) {
			const A = ze(y);
			return A && !A.disableAutodetect;
		}
		function Zn(y) {
			y["before:highlightBlock"] && !y["before:highlightElement"] && (y["before:highlightElement"] = (A) => {
				y["before:highlightBlock"](Object.assign({ block: A.el }, A));
			}), y["after:highlightBlock"] && !y["after:highlightElement"] && (y["after:highlightElement"] = (A) => {
				y["after:highlightBlock"](Object.assign({ block: A.el }, A));
			});
		}
		function $e(y) {
			Zn(y), C.push(y);
		}
		function kn(y) {
			const A = C.indexOf(y);
			A !== -1 && C.splice(A, 1);
		}
		function He(y, A) {
			const D = y;
			C.forEach(function(W) {
				W[D] && W[D](A);
			});
		}
		function We(y) {
			return ge("10.7.0", "highlightBlock will be removed entirely in v12.0"), ge("10.7.0", "Please use highlightElement now."), Zt(y);
		}
		Object.assign(c, {
			highlight: Z,
			highlightAuto: Vt,
			highlightAll: pt,
			highlightElement: Zt,
			highlightBlock: We,
			configure: Vn,
			initHighlighting: Y,
			initHighlightingOnLoad: Ke,
			registerLanguage: Yt,
			unregisterLanguage: yn,
			listLanguages: wn,
			getLanguage: ze,
			registerAliases: xn,
			autoDetection: En,
			inherit: Ue,
			addPlugin: $e,
			removePlugin: kn
		}), c.debugMode = function() {
			U = !1;
		}, c.safeMode = function() {
			U = !0;
		}, c.versionString = mn, c.regex = {
			concat: $,
			lookahead: T,
			either: ee,
			optional: R,
			anyNumberOfTimes: z
		};
		for (const y in Tt) typeof Tt[y] == "object" && n(Tt[y]);
		return Object.assign(c, Tt), c;
	}, je = qt({});
	je.newInstance = () => qt({}), t.exports = je, je.HighlightJS = je, je.default = je;
})))())).default;
try {
	typeof postMessage == "function" && postMessage($i({ native: !0 }));
} catch {}
const sn = Mr && (j || Mr) || void 0, ui = /\`\`\`\\s*([a-zA-Z0-9_\\-+]+)?/g, Da = /* @__PURE__ */ new Set([
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
]), za = {
	1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
	2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
	3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
	4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
	5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
	6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
};
let be = null;
function $a(e) {
	try {
		if (!e && e !== 0) return "";
		const t = String(e), n = {
			amp: "&",
			lt: "<",
			gt: ">",
			quot: "\\"",
			apos: "'",
			nbsp: " "
		};
		return t.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (r, i) => {
			if (!i) return r;
			if (i[0] === "#") try {
				return i[1] === "x" || i[1] === "X" ? String.fromCharCode(parseInt(i.slice(2), 16)) : String.fromCharCode(parseInt(i.slice(1), 10));
			} catch {
				return r;
			}
			return n[i] !== void 0 ? n[i] : r;
		});
	} catch {
		return String(e ?? "");
	}
}
function Ba(e, t) {
	const n = String(e ?? "");
	if (!n || n.length <= t) return [n];
	const r = /^#{1,6}\\s.*$/gm, i = [];
	let s;
	for (; (s = r.exec(n)) !== null;) i.push(s.index);
	if (!i.length || i.length < 2) {
		const f = [];
		for (let g = 0; g < n.length; g += t) f.push(n.slice(g, g + t));
		return f;
	}
	const l = [];
	i[0] > 0 && l.push(n.slice(0, i[0]));
	for (let f = 0; f < i.length; f++) {
		const g = i[f], w = f + 1 < i.length ? i[f + 1] : n.length;
		l.push(n.slice(g, w));
	}
	const o = [];
	let u = "";
	for (const f of l) {
		if (!u && f.length >= t) {
			o.push(f);
			continue;
		}
		u.length + f.length <= t ? u += f : (u && o.push(u), u = f);
	}
	return u && o.push(u), o;
}
function Ua(e) {
	try {
		return String(e ?? "").toLowerCase().trim().replace(/[^a-z0-9\\-\\s]+/g, "").replace(/\\s+/g, "-");
	} catch {
		return "heading";
	}
}
async function Fa(e) {
	return await wa(e);
}
async function xr() {
	if (be) return be;
	try {
		be = La || null;
	} catch {
		be = null;
	}
	return be;
}
function ja(e) {
	return e <= 2 ? "has-text-weight-bold" : e <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal";
}
function ji(e, t = /* @__PURE__ */ new Map()) {
	const n = [];
	let r = String(e ?? "");
	return r = r.replace(/<h([1-6])([^>]*)>([\\s\\S]*?)<\\/h\\1>/g, (i, s, l, o) => {
		const u = Number(s);
		let f = o.replace(/<[^>]+>/g, "").trim();
		try {
			f = $a(f);
		} catch {}
		let g = null;
		const w = (l || "").match(/\\sid="([^"]+)"/);
		w && (g = w[1]);
		const P = g || Ua(f) || "heading", M = (t.get(P) || 0) + 1;
		t.set(P, M);
		const T = M === 1 ? P : P + "-" + M;
		n.push({
			level: u,
			text: f,
			id: T
		});
		const z = \`\${za[u]} \${ja(u)}\`.trim();
		return \`<h\${u} \${((l || "").replace(/\\s*(id|class)="[^"]*"/g, "") + \` id="\${T}" class="\${z}"\`).trim()}>\${o}</h\${u}>\`;
	}), r = r.replace(/<img([^>]*)>/g, (i, s) => /\\bloading=/.test(s) ? \`<img\${s}>\` : /\\bdata-want-lazy=/.test(s) ? \`<img\${s}>\` : \`<img\${s} loading="lazy">\`), {
		html: r,
		toc: n
	};
}
async function Ha(e, t) {
	try {
		if (!await xr()) return {
			type: "register-error",
			name: e,
			error: "hljs unavailable"
		};
		const n = await Fa(t), r = n ? n.default || n : null;
		return r ? (be.registerLanguage(e, r), {
			type: "registered",
			name: e
		}) : {
			type: "register-error",
			name: e,
			error: "failed to import language module"
		};
	} catch (n) {
		return {
			type: "register-error",
			name: e,
			error: String(n)
		};
	}
}
function Wa(e, t, n) {
	const r = /* @__PURE__ */ new Set(), i = new RegExp(ui.source, ui.flags);
	let s;
	for (; s = i.exec(t || "");) {
		if (!s[1]) continue;
		const l = String(s[1]).toLowerCase();
		if (l && (l.length >= 5 && l.length <= 30 && /^[a-z][a-z0-9_\\-+]*$/.test(l) && r.add(l), Da.has(l) && r.add(l), n?.length)) try {
			n.indexOf(l) !== -1 && r.add(l);
		} catch {}
	}
	return {
		id: e,
		result: Array.from(r)
	};
}
async function Ga(e, t = /* @__PURE__ */ new Map()) {
	const { content: n, data: r } = Ri(e || "");
	await xr().catch(() => {});
	const i = ji(Ai()(sn.parse(n)), t);
	return {
		html: i.html,
		meta: r || {},
		toc: i.toc
	};
}
async function qa(e, t) {
	const n = e.id, r = Number(e.chunkSize) || 65536, { content: i, data: s } = Ri(e.md || "");
	await xr().catch(() => {});
	const l = Ba(i, r), o = /* @__PURE__ */ new Map();
	for (let f = 0; f < l.length; f++) {
		const g = ji(Ai()(sn.parse(l[f])), o);
		t({
			id: n,
			type: "chunk",
			html: g.html,
			toc: g.toc,
			index: f,
			isLast: f === l.length - 1
		});
	}
	const u = {
		id: n,
		type: "done",
		meta: s || {}
	};
	return t(u), u;
}
function _t(e, t) {
	typeof postMessage == "function" && (t?.length ? postMessage(e, t) : postMessage(e));
}
function Va(e = globalThis) {
	const t = async (n) => {
		const r = Ui(n.data), i = r.value, s = r.correlationId ?? i.correlationId, l = (u) => {
			s != null ? _t({
				correlationId: s,
				response: u
			}) : _t({
				id: i.id,
				result: u
			});
		}, o = (u) => {
			s != null ? _t({
				correlationId: s,
				response: { error: String(u) }
			}) : _t({
				id: i.id,
				error: String(u)
			});
		};
		try {
			if (i?.type === "register") {
				const u = await Ha(i?.name, i?.url);
				s != null ? l(u) : _t(u);
				return;
			}
			if (i?.type === "detect") {
				_t(Wa(i?.id, i?.md || "", i?.supported || []));
				return;
			}
			if (i?.type === "stream") {
				await qa(i, (u) => _t(u));
				return;
			}
			l(await Ga(i?.md || "", /* @__PURE__ */ new Map()));
		} catch (u) {
			o(u);
		}
	};
	return e && (e.onmessage = t), t;
}
sn && typeof sn.setOptions == "function" && sn.setOptions({
	gfm: !0,
	headerIds: !0,
	mangle: !1,
	highlighted: (e, t) => {
		try {
			return be && t && typeof be.getLanguage == "function" && be.getLanguage(t) ? be.highlight(e, { language: t }).value : be && typeof be.getLanguage == "function" && be.getLanguage("plaintext") ? be.highlight(e, { language: "plaintext" }).value : e;
		} catch {
			return e;
		}
	}
});
Va(globalThis);
`,Jo=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",Rc],{type:"text/javascript;charset=utf-8"});function Ld(e){let t;try{if(t=Jo&&(self.URL||self.webkitURL).createObjectURL(Jo),!t)throw"";const n=new Worker(t,{type:"module",name:e?.name});return n.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(t)}),n}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(Rc),{type:"module",name:e?.name})}}var Dr={100:"💯",1234:"🔢",grinning:"😀",grimacing:"😬",grin:"😁",joy:"😂",rofl:"🤣",partying:"🥳",smiley:"😃",smile:"😄",sweat_smile:"😅",laughing:"😆",innocent:"😇",wink:"😉",blush:"😊",slightly_smiling_face:"🙂",upside_down_face:"🙃",relaxed:"☺️",yum:"😋",relieved:"😌",heart_eyes:"😍",smiling_face_with_three_hearts:"🥰",kissing_heart:"😘",kissing:"😗",kissing_smiling_eyes:"😙",kissing_closed_eyes:"😚",stuck_out_tongue_winking_eye:"😜",zany:"🤪",raised_eyebrow:"🤨",monocle:"🧐",stuck_out_tongue_closed_eyes:"😝",stuck_out_tongue:"😛",money_mouth_face:"🤑",nerd_face:"🤓",sunglasses:"😎",star_struck:"🤩",clown_face:"🤡",cowboy_hat_face:"🤠",hugs:"🤗",smirk:"😏",no_mouth:"😶",neutral_face:"😐",expressionless:"😑",unamused:"😒",roll_eyes:"🙄",thinking:"🤔",lying_face:"🤥",hand_over_mouth:"🤭",shushing:"🤫",symbols_over_mouth:"🤬",exploding_head:"🤯",flushed:"😳",disappointed:"😞",worried:"😟",angry:"😠",rage:"😡",pensive:"😔",confused:"😕",slightly_frowning_face:"🙁",frowning_face:"☹",persevere:"😣",confounded:"😖",tired_face:"😫",weary:"😩",pleading:"🥺",triumph:"😤",open_mouth:"😮",scream:"😱",fearful:"😨",cold_sweat:"😰",hushed:"😯",frowning:"😦",anguished:"😧",cry:"😢",disappointed_relieved:"😥",drooling_face:"🤤",sleepy:"😪",sweat:"😓",hot:"🥵",cold:"🥶",sob:"😭",dizzy_face:"😵",astonished:"😲",zipper_mouth_face:"🤐",nauseated_face:"🤢",sneezing_face:"🤧",vomiting:"🤮",mask:"😷",face_with_thermometer:"🤒",face_with_head_bandage:"🤕",woozy:"🥴",sleeping:"😴",zzz:"💤",poop:"💩",smiling_imp:"😈",imp:"👿",japanese_ogre:"👹",japanese_goblin:"👺",skull:"💀",ghost:"👻",alien:"👽",robot:"🤖",smiley_cat:"😺",smile_cat:"😸",joy_cat:"😹",heart_eyes_cat:"😻",smirk_cat:"😼",kissing_cat:"😽",scream_cat:"🙀",crying_cat_face:"😿",pouting_cat:"😾",palms_up:"🤲",raised_hands:"🙌",clap:"👏",wave:"👋",call_me_hand:"🤙","+1":"👍","-1":"👎",facepunch:"👊",fist:"✊",fist_left:"🤛",fist_right:"🤜",v:"✌",ok_hand:"👌",raised_hand:"✋",raised_back_of_hand:"🤚",open_hands:"👐",muscle:"💪",pray:"🙏",foot:"🦶",leg:"🦵",handshake:"🤝",point_up:"☝",point_up_2:"👆",point_down:"👇",point_left:"👈",point_right:"👉",fu:"🖕",raised_hand_with_fingers_splayed:"🖐",love_you:"🤟",metal:"🤘",crossed_fingers:"🤞",vulcan_salute:"🖖",writing_hand:"✍",selfie:"🤳",nail_care:"💅",lips:"👄",tooth:"🦷",tongue:"👅",ear:"👂",nose:"👃",eye:"👁",eyes:"👀",brain:"🧠",bust_in_silhouette:"👤",busts_in_silhouette:"👥",speaking_head:"🗣",baby:"👶",child:"🧒",boy:"👦",girl:"👧",adult:"🧑",man:"👨",woman:"👩",blonde_woman:"👱‍♀️",blonde_man:"👱",bearded_person:"🧔",older_adult:"🧓",older_man:"👴",older_woman:"👵",man_with_gua_pi_mao:"👲",woman_with_headscarf:"🧕",woman_with_turban:"👳‍♀️",man_with_turban:"👳",policewoman:"👮‍♀️",policeman:"👮",construction_worker_woman:"👷‍♀️",construction_worker_man:"👷",guardswoman:"💂‍♀️",guardsman:"💂",female_detective:"🕵️‍♀️",male_detective:"🕵",woman_health_worker:"👩‍⚕️",man_health_worker:"👨‍⚕️",woman_farmer:"👩‍🌾",man_farmer:"👨‍🌾",woman_cook:"👩‍🍳",man_cook:"👨‍🍳",woman_student:"👩‍🎓",man_student:"👨‍🎓",woman_singer:"👩‍🎤",man_singer:"👨‍🎤",woman_teacher:"👩‍🏫",man_teacher:"👨‍🏫",woman_factory_worker:"👩‍🏭",man_factory_worker:"👨‍🏭",woman_technologist:"👩‍💻",man_technologist:"👨‍💻",woman_office_worker:"👩‍💼",man_office_worker:"👨‍💼",woman_mechanic:"👩‍🔧",man_mechanic:"👨‍🔧",woman_scientist:"👩‍🔬",man_scientist:"👨‍🔬",woman_artist:"👩‍🎨",man_artist:"👨‍🎨",woman_firefighter:"👩‍🚒",man_firefighter:"👨‍🚒",woman_pilot:"👩‍✈️",man_pilot:"👨‍✈️",woman_astronaut:"👩‍🚀",man_astronaut:"👨‍🚀",woman_judge:"👩‍⚖️",man_judge:"👨‍⚖️",woman_superhero:"🦸‍♀️",man_superhero:"🦸‍♂️",woman_supervillain:"🦹‍♀️",man_supervillain:"🦹‍♂️",mrs_claus:"🤶",santa:"🎅",sorceress:"🧙‍♀️",wizard:"🧙‍♂️",woman_elf:"🧝‍♀️",man_elf:"🧝‍♂️",woman_vampire:"🧛‍♀️",man_vampire:"🧛‍♂️",woman_zombie:"🧟‍♀️",man_zombie:"🧟‍♂️",woman_genie:"🧞‍♀️",man_genie:"🧞‍♂️",mermaid:"🧜‍♀️",merman:"🧜‍♂️",woman_fairy:"🧚‍♀️",man_fairy:"🧚‍♂️",angel:"👼",pregnant_woman:"🤰",breastfeeding:"🤱",princess:"👸",prince:"🤴",bride_with_veil:"👰",man_in_tuxedo:"🤵",running_woman:"🏃‍♀️",running_man:"🏃",walking_woman:"🚶‍♀️",walking_man:"🚶",dancer:"💃",man_dancing:"🕺",dancing_women:"👯",dancing_men:"👯‍♂️",couple:"👫",two_men_holding_hands:"👬",two_women_holding_hands:"👭",bowing_woman:"🙇‍♀️",bowing_man:"🙇",man_facepalming:"🤦‍♂️",woman_facepalming:"🤦‍♀️",woman_shrugging:"🤷",man_shrugging:"🤷‍♂️",tipping_hand_woman:"💁",tipping_hand_man:"💁‍♂️",no_good_woman:"🙅",no_good_man:"🙅‍♂️",ok_woman:"🙆",ok_man:"🙆‍♂️",raising_hand_woman:"🙋",raising_hand_man:"🙋‍♂️",pouting_woman:"🙎",pouting_man:"🙎‍♂️",frowning_woman:"🙍",frowning_man:"🙍‍♂️",haircut_woman:"💇",haircut_man:"💇‍♂️",massage_woman:"💆",massage_man:"💆‍♂️",woman_in_steamy_room:"🧖‍♀️",man_in_steamy_room:"🧖‍♂️",couple_with_heart_woman_man:"💑",couple_with_heart_woman_woman:"👩‍❤️‍👩",couple_with_heart_man_man:"👨‍❤️‍👨",couplekiss_man_woman:"💏",couplekiss_woman_woman:"👩‍❤️‍💋‍👩",couplekiss_man_man:"👨‍❤️‍💋‍👨",family_man_woman_boy:"👪",family_man_woman_girl:"👨‍👩‍👧",family_man_woman_girl_boy:"👨‍👩‍👧‍👦",family_man_woman_boy_boy:"👨‍👩‍👦‍👦",family_man_woman_girl_girl:"👨‍👩‍👧‍👧",family_woman_woman_boy:"👩‍👩‍👦",family_woman_woman_girl:"👩‍👩‍👧",family_woman_woman_girl_boy:"👩‍👩‍👧‍👦",family_woman_woman_boy_boy:"👩‍👩‍👦‍👦",family_woman_woman_girl_girl:"👩‍👩‍👧‍👧",family_man_man_boy:"👨‍👨‍👦",family_man_man_girl:"👨‍👨‍👧",family_man_man_girl_boy:"👨‍👨‍👧‍👦",family_man_man_boy_boy:"👨‍👨‍👦‍👦",family_man_man_girl_girl:"👨‍👨‍👧‍👧",family_woman_boy:"👩‍👦",family_woman_girl:"👩‍👧",family_woman_girl_boy:"👩‍👧‍👦",family_woman_boy_boy:"👩‍👦‍👦",family_woman_girl_girl:"👩‍👧‍👧",family_man_boy:"👨‍👦",family_man_girl:"👨‍👧",family_man_girl_boy:"👨‍👧‍👦",family_man_boy_boy:"👨‍👦‍👦",family_man_girl_girl:"👨‍👧‍👧",yarn:"🧶",thread:"🧵",coat:"🧥",labcoat:"🥼",womans_clothes:"👚",tshirt:"👕",jeans:"👖",necktie:"👔",dress:"👗",bikini:"👙",kimono:"👘",lipstick:"💄",kiss:"💋",footprints:"👣",flat_shoe:"🥿",high_heel:"👠",sandal:"👡",boot:"👢",mans_shoe:"👞",athletic_shoe:"👟",hiking_boot:"🥾",socks:"🧦",gloves:"🧤",scarf:"🧣",womans_hat:"👒",tophat:"🎩",billed_hat:"🧢",rescue_worker_helmet:"⛑",mortar_board:"🎓",crown:"👑",school_satchel:"🎒",luggage:"🧳",pouch:"👝",purse:"👛",handbag:"👜",briefcase:"💼",eyeglasses:"👓",dark_sunglasses:"🕶",goggles:"🥽",ring:"💍",closed_umbrella:"🌂",dog:"🐶",cat:"🐱",mouse:"🐭",hamster:"🐹",rabbit:"🐰",fox_face:"🦊",bear:"🐻",panda_face:"🐼",koala:"🐨",tiger:"🐯",lion:"🦁",cow:"🐮",pig:"🐷",pig_nose:"🐽",frog:"🐸",squid:"🦑",octopus:"🐙",shrimp:"🦐",monkey_face:"🐵",gorilla:"🦍",see_no_evil:"🙈",hear_no_evil:"🙉",speak_no_evil:"🙊",monkey:"🐒",chicken:"🐔",penguin:"🐧",bird:"🐦",baby_chick:"🐤",hatching_chick:"🐣",hatched_chick:"🐥",duck:"🦆",eagle:"🦅",owl:"🦉",bat:"🦇",wolf:"🐺",boar:"🐗",horse:"🐴",unicorn:"🦄",honeybee:"🐝",bug:"🐛",butterfly:"🦋",snail:"🐌",beetle:"🐞",ant:"🐜",grasshopper:"🦗",spider:"🕷",scorpion:"🦂",crab:"🦀",snake:"🐍",lizard:"🦎","t-rex":"🦖",sauropod:"🦕",turtle:"🐢",tropical_fish:"🐠",fish:"🐟",blowfish:"🐡",dolphin:"🐬",shark:"🦈",whale:"🐳",whale2:"🐋",crocodile:"🐊",leopard:"🐆",zebra:"🦓",tiger2:"🐅",water_buffalo:"🐃",ox:"🐂",cow2:"🐄",deer:"🦌",dromedary_camel:"🐪",camel:"🐫",giraffe:"🦒",elephant:"🐘",rhinoceros:"🦏",goat:"🐐",ram:"🐏",sheep:"🐑",racehorse:"🐎",pig2:"🐖",rat:"🐀",mouse2:"🐁",rooster:"🐓",turkey:"🦃",dove:"🕊",dog2:"🐕",poodle:"🐩",cat2:"🐈",rabbit2:"🐇",chipmunk:"🐿",hedgehog:"🦔",raccoon:"🦝",llama:"🦙",hippopotamus:"🦛",kangaroo:"🦘",badger:"🦡",swan:"🦢",peacock:"🦚",parrot:"🦜",lobster:"🦞",mosquito:"🦟",paw_prints:"🐾",dragon:"🐉",dragon_face:"🐲",cactus:"🌵",christmas_tree:"🎄",evergreen_tree:"🌲",deciduous_tree:"🌳",palm_tree:"🌴",seedling:"🌱",herb:"🌿",shamrock:"☘",four_leaf_clover:"🍀",bamboo:"🎍",tanabata_tree:"🎋",leaves:"🍃",fallen_leaf:"🍂",maple_leaf:"🍁",ear_of_rice:"🌾",hibiscus:"🌺",sunflower:"🌻",rose:"🌹",wilted_flower:"🥀",tulip:"🌷",blossom:"🌼",cherry_blossom:"🌸",bouquet:"💐",mushroom:"🍄",chestnut:"🌰",jack_o_lantern:"🎃",shell:"🐚",spider_web:"🕸",earth_americas:"🌎",earth_africa:"🌍",earth_asia:"🌏",full_moon:"🌕",waning_gibbous_moon:"🌖",last_quarter_moon:"🌗",waning_crescent_moon:"🌘",new_moon:"🌑",waxing_crescent_moon:"🌒",first_quarter_moon:"🌓",waxing_gibbous_moon:"🌔",new_moon_with_face:"🌚",full_moon_with_face:"🌝",first_quarter_moon_with_face:"🌛",last_quarter_moon_with_face:"🌜",sun_with_face:"🌞",crescent_moon:"🌙",star:"⭐",star2:"🌟",dizzy:"💫",sparkles:"✨",comet:"☄",sunny:"☀️",sun_behind_small_cloud:"🌤",partly_sunny:"⛅",sun_behind_large_cloud:"🌥",sun_behind_rain_cloud:"🌦",cloud:"☁️",cloud_with_rain:"🌧",cloud_with_lightning_and_rain:"⛈",cloud_with_lightning:"🌩",zap:"⚡",fire:"🔥",boom:"💥",snowflake:"❄️",cloud_with_snow:"🌨",snowman:"⛄",snowman_with_snow:"☃",wind_face:"🌬",dash:"💨",tornado:"🌪",fog:"🌫",open_umbrella:"☂",umbrella:"☔",droplet:"💧",sweat_drops:"💦",ocean:"🌊",green_apple:"🍏",apple:"🍎",pear:"🍐",tangerine:"🍊",lemon:"🍋",banana:"🍌",watermelon:"🍉",grapes:"🍇",strawberry:"🍓",melon:"🍈",cherries:"🍒",peach:"🍑",pineapple:"🍍",coconut:"🥥",kiwi_fruit:"🥝",mango:"🥭",avocado:"🥑",broccoli:"🥦",tomato:"🍅",eggplant:"🍆",cucumber:"🥒",carrot:"🥕",hot_pepper:"🌶",potato:"🥔",corn:"🌽",leafy_greens:"🥬",sweet_potato:"🍠",peanuts:"🥜",honey_pot:"🍯",croissant:"🥐",bread:"🍞",baguette_bread:"🥖",bagel:"🥯",pretzel:"🥨",cheese:"🧀",egg:"🥚",bacon:"🥓",steak:"🥩",pancakes:"🥞",poultry_leg:"🍗",meat_on_bone:"🍖",bone:"🦴",fried_shrimp:"🍤",fried_egg:"🍳",hamburger:"🍔",fries:"🍟",stuffed_flatbread:"🥙",hotdog:"🌭",pizza:"🍕",sandwich:"🥪",canned_food:"🥫",spaghetti:"🍝",taco:"🌮",burrito:"🌯",green_salad:"🥗",shallow_pan_of_food:"🥘",ramen:"🍜",stew:"🍲",fish_cake:"🍥",fortune_cookie:"🥠",sushi:"🍣",bento:"🍱",curry:"🍛",rice_ball:"🍙",rice:"🍚",rice_cracker:"🍘",oden:"🍢",dango:"🍡",shaved_ice:"🍧",ice_cream:"🍨",icecream:"🍦",pie:"🥧",cake:"🍰",cupcake:"🧁",moon_cake:"🥮",birthday:"🎂",custard:"🍮",candy:"🍬",lollipop:"🍭",chocolate_bar:"🍫",popcorn:"🍿",dumpling:"🥟",doughnut:"🍩",cookie:"🍪",milk_glass:"🥛",beer:"🍺",beers:"🍻",clinking_glasses:"🥂",wine_glass:"🍷",tumbler_glass:"🥃",cocktail:"🍸",tropical_drink:"🍹",champagne:"🍾",sake:"🍶",tea:"🍵",cup_with_straw:"🥤",coffee:"☕",baby_bottle:"🍼",salt:"🧂",spoon:"🥄",fork_and_knife:"🍴",plate_with_cutlery:"🍽",bowl_with_spoon:"🥣",takeout_box:"🥡",chopsticks:"🥢",soccer:"⚽",basketball:"🏀",football:"🏈",baseball:"⚾",softball:"🥎",tennis:"🎾",volleyball:"🏐",rugby_football:"🏉",flying_disc:"🥏","8ball":"🎱",golf:"⛳",golfing_woman:"🏌️‍♀️",golfing_man:"🏌",ping_pong:"🏓",badminton:"🏸",goal_net:"🥅",ice_hockey:"🏒",field_hockey:"🏑",lacrosse:"🥍",cricket:"🏏",ski:"🎿",skier:"⛷",snowboarder:"🏂",person_fencing:"🤺",women_wrestling:"🤼‍♀️",men_wrestling:"🤼‍♂️",woman_cartwheeling:"🤸‍♀️",man_cartwheeling:"🤸‍♂️",woman_playing_handball:"🤾‍♀️",man_playing_handball:"🤾‍♂️",ice_skate:"⛸",curling_stone:"🥌",skateboard:"🛹",sled:"🛷",bow_and_arrow:"🏹",fishing_pole_and_fish:"🎣",boxing_glove:"🥊",martial_arts_uniform:"🥋",rowing_woman:"🚣‍♀️",rowing_man:"🚣",climbing_woman:"🧗‍♀️",climbing_man:"🧗‍♂️",swimming_woman:"🏊‍♀️",swimming_man:"🏊",woman_playing_water_polo:"🤽‍♀️",man_playing_water_polo:"🤽‍♂️",woman_in_lotus_position:"🧘‍♀️",man_in_lotus_position:"🧘‍♂️",surfing_woman:"🏄‍♀️",surfing_man:"🏄",bath:"🛀",basketball_woman:"⛹️‍♀️",basketball_man:"⛹",weight_lifting_woman:"🏋️‍♀️",weight_lifting_man:"🏋",biking_woman:"🚴‍♀️",biking_man:"🚴",mountain_biking_woman:"🚵‍♀️",mountain_biking_man:"🚵",horse_racing:"🏇",business_suit_levitating:"🕴",trophy:"🏆",running_shirt_with_sash:"🎽",medal_sports:"🏅",medal_military:"🎖","1st_place_medal":"🥇","2nd_place_medal":"🥈","3rd_place_medal":"🥉",reminder_ribbon:"🎗",rosette:"🏵",ticket:"🎫",tickets:"🎟",performing_arts:"🎭",art:"🎨",circus_tent:"🎪",woman_juggling:"🤹‍♀️",man_juggling:"🤹‍♂️",microphone:"🎤",headphones:"🎧",musical_score:"🎼",musical_keyboard:"🎹",drum:"🥁",saxophone:"🎷",trumpet:"🎺",guitar:"🎸",violin:"🎻",clapper:"🎬",video_game:"🎮",space_invader:"👾",dart:"🎯",game_die:"🎲",chess_pawn:"♟",slot_machine:"🎰",jigsaw:"🧩",bowling:"🎳",red_car:"🚗",taxi:"🚕",blue_car:"🚙",bus:"🚌",trolleybus:"🚎",racing_car:"🏎",police_car:"🚓",ambulance:"🚑",fire_engine:"🚒",minibus:"🚐",truck:"🚚",articulated_lorry:"🚛",tractor:"🚜",kick_scooter:"🛴",motorcycle:"🏍",bike:"🚲",motor_scooter:"🛵",rotating_light:"🚨",oncoming_police_car:"🚔",oncoming_bus:"🚍",oncoming_automobile:"🚘",oncoming_taxi:"🚖",aerial_tramway:"🚡",mountain_cableway:"🚠",suspension_railway:"🚟",railway_car:"🚃",train:"🚋",monorail:"🚝",bullettrain_side:"🚄",bullettrain_front:"🚅",light_rail:"🚈",mountain_railway:"🚞",steam_locomotive:"🚂",train2:"🚆",metro:"🚇",tram:"🚊",station:"🚉",flying_saucer:"🛸",helicopter:"🚁",small_airplane:"🛩",airplane:"✈️",flight_departure:"🛫",flight_arrival:"🛬",sailboat:"⛵",motor_boat:"🛥",speedboat:"🚤",ferry:"⛴",passenger_ship:"🛳",rocket:"🚀",artificial_satellite:"🛰",seat:"💺",canoe:"🛶",anchor:"⚓",construction:"🚧",fuelpump:"⛽",busstop:"🚏",vertical_traffic_light:"🚦",traffic_light:"🚥",checkered_flag:"🏁",ship:"🚢",ferris_wheel:"🎡",roller_coaster:"🎢",carousel_horse:"🎠",building_construction:"🏗",foggy:"🌁",tokyo_tower:"🗼",factory:"🏭",fountain:"⛲",rice_scene:"🎑",mountain:"⛰",mountain_snow:"🏔",mount_fuji:"🗻",volcano:"🌋",japan:"🗾",camping:"🏕",tent:"⛺",national_park:"🏞",motorway:"🛣",railway_track:"🛤",sunrise:"🌅",sunrise_over_mountains:"🌄",desert:"🏜",beach_umbrella:"🏖",desert_island:"🏝",city_sunrise:"🌇",city_sunset:"🌆",cityscape:"🏙",night_with_stars:"🌃",bridge_at_night:"🌉",milky_way:"🌌",stars:"🌠",sparkler:"🎇",fireworks:"🎆",rainbow:"🌈",houses:"🏘",european_castle:"🏰",japanese_castle:"🏯",stadium:"🏟",statue_of_liberty:"🗽",house:"🏠",house_with_garden:"🏡",derelict_house:"🏚",office:"🏢",department_store:"🏬",post_office:"🏣",european_post_office:"🏤",hospital:"🏥",bank:"🏦",hotel:"🏨",convenience_store:"🏪",school:"🏫",love_hotel:"🏩",wedding:"💒",classical_building:"🏛",church:"⛪",mosque:"🕌",synagogue:"🕍",kaaba:"🕋",shinto_shrine:"⛩",watch:"⌚",iphone:"📱",calling:"📲",computer:"💻",keyboard:"⌨",desktop_computer:"🖥",printer:"🖨",computer_mouse:"🖱",trackball:"🖲",joystick:"🕹",clamp:"🗜",minidisc:"💽",floppy_disk:"💾",cd:"💿",dvd:"📀",vhs:"📼",camera:"📷",camera_flash:"📸",video_camera:"📹",movie_camera:"🎥",film_projector:"📽",film_strip:"🎞",telephone_receiver:"📞",phone:"☎️",pager:"📟",fax:"📠",tv:"📺",radio:"📻",studio_microphone:"🎙",level_slider:"🎚",control_knobs:"🎛",compass:"🧭",stopwatch:"⏱",timer_clock:"⏲",alarm_clock:"⏰",mantelpiece_clock:"🕰",hourglass_flowing_sand:"⏳",hourglass:"⌛",satellite:"📡",battery:"🔋",electric_plug:"🔌",bulb:"💡",flashlight:"🔦",candle:"🕯",fire_extinguisher:"🧯",wastebasket:"🗑",oil_drum:"🛢",money_with_wings:"💸",dollar:"💵",yen:"💴",euro:"💶",pound:"💷",moneybag:"💰",credit_card:"💳",gem:"💎",balance_scale:"⚖",toolbox:"🧰",wrench:"🔧",hammer:"🔨",hammer_and_pick:"⚒",hammer_and_wrench:"🛠",pick:"⛏",nut_and_bolt:"🔩",gear:"⚙",brick:"🧱",chains:"⛓",magnet:"🧲",gun:"🔫",bomb:"💣",firecracker:"🧨",hocho:"🔪",dagger:"🗡",crossed_swords:"⚔",shield:"🛡",smoking:"🚬",skull_and_crossbones:"☠",coffin:"⚰",funeral_urn:"⚱",amphora:"🏺",crystal_ball:"🔮",prayer_beads:"📿",nazar_amulet:"🧿",barber:"💈",alembic:"⚗",telescope:"🔭",microscope:"🔬",hole:"🕳",pill:"💊",syringe:"💉",dna:"🧬",microbe:"🦠",petri_dish:"🧫",test_tube:"🧪",thermometer:"🌡",broom:"🧹",basket:"🧺",toilet_paper:"🧻",label:"🏷",bookmark:"🔖",toilet:"🚽",shower:"🚿",bathtub:"🛁",soap:"🧼",sponge:"🧽",lotion_bottle:"🧴",key:"🔑",old_key:"🗝",couch_and_lamp:"🛋",sleeping_bed:"🛌",bed:"🛏",door:"🚪",bellhop_bell:"🛎",teddy_bear:"🧸",framed_picture:"🖼",world_map:"🗺",parasol_on_ground:"⛱",moyai:"🗿",shopping:"🛍",shopping_cart:"🛒",balloon:"🎈",flags:"🎏",ribbon:"🎀",gift:"🎁",confetti_ball:"🎊",tada:"🎉",dolls:"🎎",wind_chime:"🎐",crossed_flags:"🎌",izakaya_lantern:"🏮",red_envelope:"🧧",email:"✉️",envelope_with_arrow:"📩",incoming_envelope:"📨","e-mail":"📧",love_letter:"💌",postbox:"📮",mailbox_closed:"📪",mailbox:"📫",mailbox_with_mail:"📬",mailbox_with_no_mail:"📭",package:"📦",postal_horn:"📯",inbox_tray:"📥",outbox_tray:"📤",scroll:"📜",page_with_curl:"📃",bookmark_tabs:"📑",receipt:"🧾",bar_chart:"📊",chart_with_upwards_trend:"📈",chart_with_downwards_trend:"📉",page_facing_up:"📄",date:"📅",calendar:"📆",spiral_calendar:"🗓",card_index:"📇",card_file_box:"🗃",ballot_box:"🗳",file_cabinet:"🗄",clipboard:"📋",spiral_notepad:"🗒",file_folder:"📁",open_file_folder:"📂",card_index_dividers:"🗂",newspaper_roll:"🗞",newspaper:"📰",notebook:"📓",closed_book:"📕",green_book:"📗",blue_book:"📘",orange_book:"📙",notebook_with_decorative_cover:"📔",ledger:"📒",books:"📚",open_book:"📖",safety_pin:"🧷",link:"🔗",paperclip:"📎",paperclips:"🖇",scissors:"✂️",triangular_ruler:"📐",straight_ruler:"📏",abacus:"🧮",pushpin:"📌",round_pushpin:"📍",triangular_flag_on_post:"🚩",white_flag:"🏳",black_flag:"🏴",rainbow_flag:"🏳️‍🌈",closed_lock_with_key:"🔐",lock:"🔒",unlock:"🔓",lock_with_ink_pen:"🔏",pen:"🖊",fountain_pen:"🖋",black_nib:"✒️",memo:"📝",pencil2:"✏️",crayon:"🖍",paintbrush:"🖌",mag:"🔍",mag_right:"🔎",heart:"❤️",orange_heart:"🧡",yellow_heart:"💛",green_heart:"💚",blue_heart:"💙",purple_heart:"💜",black_heart:"🖤",broken_heart:"💔",heavy_heart_exclamation:"❣",two_hearts:"💕",revolving_hearts:"💞",heartbeat:"💓",heartpulse:"💗",sparkling_heart:"💖",cupid:"💘",gift_heart:"💝",heart_decoration:"💟",peace_symbol:"☮",latin_cross:"✝",star_and_crescent:"☪",om:"🕉",wheel_of_dharma:"☸",star_of_david:"✡",six_pointed_star:"🔯",menorah:"🕎",yin_yang:"☯",orthodox_cross:"☦",place_of_worship:"🛐",ophiuchus:"⛎",aries:"♈",taurus:"♉",gemini:"♊",cancer:"♋",leo:"♌",virgo:"♍",libra:"♎",scorpius:"♏",sagittarius:"♐",capricorn:"♑",aquarius:"♒",pisces:"♓",id:"🆔",atom_symbol:"⚛",u7a7a:"🈳",u5272:"🈹",radioactive:"☢",biohazard:"☣",mobile_phone_off:"📴",vibration_mode:"📳",u6709:"🈶",u7121:"🈚",u7533:"🈸",u55b6:"🈺",u6708:"🈷️",eight_pointed_black_star:"✴️",vs:"🆚",accept:"🉑",white_flower:"💮",ideograph_advantage:"🉐",secret:"㊙️",congratulations:"㊗️",u5408:"🈴",u6e80:"🈵",u7981:"🈲",a:"🅰️",b:"🅱️",ab:"🆎",cl:"🆑",o2:"🅾️",sos:"🆘",no_entry:"⛔",name_badge:"📛",no_entry_sign:"🚫",x:"❌",o:"⭕",stop_sign:"🛑",anger:"💢",hotsprings:"♨️",no_pedestrians:"🚷",do_not_litter:"🚯",no_bicycles:"🚳","non-potable_water":"🚱",underage:"🔞",no_mobile_phones:"📵",exclamation:"❗",grey_exclamation:"❕",question:"❓",grey_question:"❔",bangbang:"‼️",interrobang:"⁉️",low_brightness:"🔅",high_brightness:"🔆",trident:"🔱",fleur_de_lis:"⚜",part_alternation_mark:"〽️",warning:"⚠️",children_crossing:"🚸",beginner:"🔰",recycle:"♻️",u6307:"🈯",chart:"💹",sparkle:"❇️",eight_spoked_asterisk:"✳️",negative_squared_cross_mark:"❎",white_check_mark:"✅",diamond_shape_with_a_dot_inside:"💠",cyclone:"🌀",loop:"➿",globe_with_meridians:"🌐",m:"Ⓜ️",atm:"🏧",sa:"🈂️",passport_control:"🛂",customs:"🛃",baggage_claim:"🛄",left_luggage:"🛅",wheelchair:"♿",no_smoking:"🚭",wc:"🚾",parking:"🅿️",potable_water:"🚰",mens:"🚹",womens:"🚺",baby_symbol:"🚼",restroom:"🚻",put_litter_in_its_place:"🚮",cinema:"🎦",signal_strength:"📶",koko:"🈁",ng:"🆖",ok:"🆗",up:"🆙",cool:"🆒",new:"🆕",free:"🆓",zero:"0️⃣",one:"1️⃣",two:"2️⃣",three:"3️⃣",four:"4️⃣",five:"5️⃣",six:"6️⃣",seven:"7️⃣",eight:"8️⃣",nine:"9️⃣",keycap_ten:"🔟",asterisk:"*⃣",eject_button:"⏏️",arrow_forward:"▶️",pause_button:"⏸",next_track_button:"⏭",stop_button:"⏹",record_button:"⏺",play_or_pause_button:"⏯",previous_track_button:"⏮",fast_forward:"⏩",rewind:"⏪",twisted_rightwards_arrows:"🔀",repeat:"🔁",repeat_one:"🔂",arrow_backward:"◀️",arrow_up_small:"🔼",arrow_down_small:"🔽",arrow_double_up:"⏫",arrow_double_down:"⏬",arrow_right:"➡️",arrow_left:"⬅️",arrow_up:"⬆️",arrow_down:"⬇️",arrow_upper_right:"↗️",arrow_lower_right:"↘️",arrow_lower_left:"↙️",arrow_upper_left:"↖️",arrow_up_down:"↕️",left_right_arrow:"↔️",arrows_counterclockwise:"🔄",arrow_right_hook:"↪️",leftwards_arrow_with_hook:"↩️",arrow_heading_up:"⤴️",arrow_heading_down:"⤵️",hash:"#️⃣",information_source:"ℹ️",abc:"🔤",abcd:"🔡",capital_abcd:"🔠",symbols:"🔣",musical_note:"🎵",notes:"🎶",wavy_dash:"〰️",curly_loop:"➰",heavy_check_mark:"✔️",arrows_clockwise:"🔃",heavy_plus_sign:"➕",heavy_minus_sign:"➖",heavy_division_sign:"➗",heavy_multiplication_x:"✖️",infinity:"♾",heavy_dollar_sign:"💲",currency_exchange:"💱",copyright:"©️",registered:"®️",tm:"™️",end:"🔚",back:"🔙",on:"🔛",top:"🔝",soon:"🔜",ballot_box_with_check:"☑️",radio_button:"🔘",white_circle:"⚪",black_circle:"⚫",red_circle:"🔴",large_blue_circle:"🔵",small_orange_diamond:"🔸",small_blue_diamond:"🔹",large_orange_diamond:"🔶",large_blue_diamond:"🔷",small_red_triangle:"🔺",black_small_square:"▪️",white_small_square:"▫️",black_large_square:"⬛",white_large_square:"⬜",small_red_triangle_down:"🔻",black_medium_square:"◼️",white_medium_square:"◻️",black_medium_small_square:"◾",white_medium_small_square:"◽",black_square_button:"🔲",white_square_button:"🔳",speaker:"🔈",sound:"🔉",loud_sound:"🔊",mute:"🔇",mega:"📣",loudspeaker:"📢",bell:"🔔",no_bell:"🔕",black_joker:"🃏",mahjong:"🀄",spades:"♠️",clubs:"♣️",hearts:"♥️",diamonds:"♦️",flower_playing_cards:"🎴",thought_balloon:"💭",right_anger_bubble:"🗯",speech_balloon:"💬",left_speech_bubble:"🗨",clock1:"🕐",clock2:"🕑",clock3:"🕒",clock4:"🕓",clock5:"🕔",clock6:"🕕",clock7:"🕖",clock8:"🕗",clock9:"🕘",clock10:"🕙",clock11:"🕚",clock12:"🕛",clock130:"🕜",clock230:"🕝",clock330:"🕞",clock430:"🕟",clock530:"🕠",clock630:"🕡",clock730:"🕢",clock830:"🕣",clock930:"🕤",clock1030:"🕥",clock1130:"🕦",clock1230:"🕧",afghanistan:"🇦🇫",aland_islands:"🇦🇽",albania:"🇦🇱",algeria:"🇩🇿",american_samoa:"🇦🇸",andorra:"🇦🇩",angola:"🇦🇴",anguilla:"🇦🇮",antarctica:"🇦🇶",antigua_barbuda:"🇦🇬",argentina:"🇦🇷",armenia:"🇦🇲",aruba:"🇦🇼",australia:"🇦🇺",austria:"🇦🇹",azerbaijan:"🇦🇿",bahamas:"🇧🇸",bahrain:"🇧🇭",bangladesh:"🇧🇩",barbados:"🇧🇧",belarus:"🇧🇾",belgium:"🇧🇪",belize:"🇧🇿",benin:"🇧🇯",bermuda:"🇧🇲",bhutan:"🇧🇹",bolivia:"🇧🇴",caribbean_netherlands:"🇧🇶",bosnia_herzegovina:"🇧🇦",botswana:"🇧🇼",brazil:"🇧🇷",british_indian_ocean_territory:"🇮🇴",british_virgin_islands:"🇻🇬",brunei:"🇧🇳",bulgaria:"🇧🇬",burkina_faso:"🇧🇫",burundi:"🇧🇮",cape_verde:"🇨🇻",cambodia:"🇰🇭",cameroon:"🇨🇲",canada:"🇨🇦",canary_islands:"🇮🇨",cayman_islands:"🇰🇾",central_african_republic:"🇨🇫",chad:"🇹🇩",chile:"🇨🇱",cn:"🇨🇳",christmas_island:"🇨🇽",cocos_islands:"🇨🇨",colombia:"🇨🇴",comoros:"🇰🇲",congo_brazzaville:"🇨🇬",congo_kinshasa:"🇨🇩",cook_islands:"🇨🇰",costa_rica:"🇨🇷",croatia:"🇭🇷",cuba:"🇨🇺",curacao:"🇨🇼",cyprus:"🇨🇾",czech_republic:"🇨🇿",denmark:"🇩🇰",djibouti:"🇩🇯",dominica:"🇩🇲",dominican_republic:"🇩🇴",ecuador:"🇪🇨",egypt:"🇪🇬",el_salvador:"🇸🇻",equatorial_guinea:"🇬🇶",eritrea:"🇪🇷",estonia:"🇪🇪",ethiopia:"🇪🇹",eu:"🇪🇺",falkland_islands:"🇫🇰",faroe_islands:"🇫🇴",fiji:"🇫🇯",finland:"🇫🇮",fr:"🇫🇷",french_guiana:"🇬🇫",french_polynesia:"🇵🇫",french_southern_territories:"🇹🇫",gabon:"🇬🇦",gambia:"🇬🇲",georgia:"🇬🇪",de:"🇩🇪",ghana:"🇬🇭",gibraltar:"🇬🇮",greece:"🇬🇷",greenland:"🇬🇱",grenada:"🇬🇩",guadeloupe:"🇬🇵",guam:"🇬🇺",guatemala:"🇬🇹",guernsey:"🇬🇬",guinea:"🇬🇳",guinea_bissau:"🇬🇼",guyana:"🇬🇾",haiti:"🇭🇹",honduras:"🇭🇳",hong_kong:"🇭🇰",hungary:"🇭🇺",iceland:"🇮🇸",india:"🇮🇳",indonesia:"🇮🇩",iran:"🇮🇷",iraq:"🇮🇶",ireland:"🇮🇪",isle_of_man:"🇮🇲",israel:"🇮🇱",it:"🇮🇹",cote_divoire:"🇨🇮",jamaica:"🇯🇲",jp:"🇯🇵",jersey:"🇯🇪",jordan:"🇯🇴",kazakhstan:"🇰🇿",kenya:"🇰🇪",kiribati:"🇰🇮",kosovo:"🇽🇰",kuwait:"🇰🇼",kyrgyzstan:"🇰🇬",laos:"🇱🇦",latvia:"🇱🇻",lebanon:"🇱🇧",lesotho:"🇱🇸",liberia:"🇱🇷",libya:"🇱🇾",liechtenstein:"🇱🇮",lithuania:"🇱🇹",luxembourg:"🇱🇺",macau:"🇲🇴",macedonia:"🇲🇰",madagascar:"🇲🇬",malawi:"🇲🇼",malaysia:"🇲🇾",maldives:"🇲🇻",mali:"🇲🇱",malta:"🇲🇹",marshall_islands:"🇲🇭",martinique:"🇲🇶",mauritania:"🇲🇷",mauritius:"🇲🇺",mayotte:"🇾🇹",mexico:"🇲🇽",micronesia:"🇫🇲",moldova:"🇲🇩",monaco:"🇲🇨",mongolia:"🇲🇳",montenegro:"🇲🇪",montserrat:"🇲🇸",morocco:"🇲🇦",mozambique:"🇲🇿",myanmar:"🇲🇲",namibia:"🇳🇦",nauru:"🇳🇷",nepal:"🇳🇵",netherlands:"🇳🇱",new_caledonia:"🇳🇨",new_zealand:"🇳🇿",nicaragua:"🇳🇮",niger:"🇳🇪",nigeria:"🇳🇬",niue:"🇳🇺",norfolk_island:"🇳🇫",northern_mariana_islands:"🇲🇵",north_korea:"🇰🇵",norway:"🇳🇴",oman:"🇴🇲",pakistan:"🇵🇰",palau:"🇵🇼",palestinian_territories:"🇵🇸",panama:"🇵🇦",papua_new_guinea:"🇵🇬",paraguay:"🇵🇾",peru:"🇵🇪",philippines:"🇵🇭",pitcairn_islands:"🇵🇳",poland:"🇵🇱",portugal:"🇵🇹",puerto_rico:"🇵🇷",qatar:"🇶🇦",reunion:"🇷🇪",romania:"🇷🇴",ru:"🇷🇺",rwanda:"🇷🇼",st_barthelemy:"🇧🇱",st_helena:"🇸🇭",st_kitts_nevis:"🇰🇳",st_lucia:"🇱🇨",st_pierre_miquelon:"🇵🇲",st_vincent_grenadines:"🇻🇨",samoa:"🇼🇸",san_marino:"🇸🇲",sao_tome_principe:"🇸🇹",saudi_arabia:"🇸🇦",senegal:"🇸🇳",serbia:"🇷🇸",seychelles:"🇸🇨",sierra_leone:"🇸🇱",singapore:"🇸🇬",sint_maarten:"🇸🇽",slovakia:"🇸🇰",slovenia:"🇸🇮",solomon_islands:"🇸🇧",somalia:"🇸🇴",south_africa:"🇿🇦",south_georgia_south_sandwich_islands:"🇬🇸",kr:"🇰🇷",south_sudan:"🇸🇸",es:"🇪🇸",sri_lanka:"🇱🇰",sudan:"🇸🇩",suriname:"🇸🇷",swaziland:"🇸🇿",sweden:"🇸🇪",switzerland:"🇨🇭",syria:"🇸🇾",taiwan:"🇹🇼",tajikistan:"🇹🇯",tanzania:"🇹🇿",thailand:"🇹🇭",timor_leste:"🇹🇱",togo:"🇹🇬",tokelau:"🇹🇰",tonga:"🇹🇴",trinidad_tobago:"🇹🇹",tunisia:"🇹🇳",tr:"🇹🇷",turkmenistan:"🇹🇲",turks_caicos_islands:"🇹🇨",tuvalu:"🇹🇻",uganda:"🇺🇬",ukraine:"🇺🇦",united_arab_emirates:"🇦🇪",uk:"🇬🇧",england:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",scotland:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",wales:"🏴󠁧󠁢󠁷󠁬󠁳󠁿",us:"🇺🇸",us_virgin_islands:"🇻🇮",uruguay:"🇺🇾",uzbekistan:"🇺🇿",vanuatu:"🇻🇺",vatican_city:"🇻🇦",venezuela:"🇻🇪",vietnam:"🇻🇳",wallis_futuna:"🇼🇫",western_sahara:"🇪🇭",yemen:"🇾🇪",zambia:"🇿🇲",zimbabwe:"🇿🇼",united_nations:"🇺🇳",pirate_flag:"🏴‍☠️"};function Pd(e,t){this.v=e,this.k=t}function Ko(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function Nd(e){if(Array.isArray(e))return e}function Id(e,t){var n=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(n!=null){var r,i,a,o,s=[],l=!0,c=!1;try{if(a=(n=n.call(e)).next,t===0){if(Object(n)!==n)return;l=!1}else for(;!(l=(r=a.call(n)).done)&&(s.push(r.value),s.length!==t);l=!0);}catch(u){c=!0,i=u}finally{try{if(!l&&n.return!=null&&(o=n.return(),Object(o)!==o))return}finally{if(c)throw i}}return s}}function Od(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function zd(e,t){return Nd(e)||Id(e,t)||$d(e,t)||Od()}function $d(e,t){if(e){if(typeof e=="string")return Ko(e,t);var n={}.toString.call(e).slice(8,-1);return n==="Object"&&e.constructor&&(n=e.constructor.name),n==="Map"||n==="Set"?Array.from(e):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Ko(e,t):void 0}}function zi(e){var t,n;function r(a,o){try{var s=e[a](o),l=s.value,c=l instanceof Pd;Promise.resolve(c?l.v:l).then(function(u){if(c){var f=a==="return"&&l.k?a:"next";if(!l.k||u.done)return r(f,u);u=e[f](u).value}i(!!s.done,u)},function(u){r("throw",u)})}catch(u){i(2,u)}}function i(a,o){a===2?t.reject(o):t.resolve({value:o,done:a}),(t=t.next)?r(t.key,t.arg):n=null}this._invoke=function(a,o){return new Promise(function(s,l){var c={key:a,arg:o,resolve:s,reject:l,next:null};n?n=n.next=c:(t=n=c,r(a,o))})},typeof e.return!="function"&&(this.return=void 0)}zi.prototype[typeof Symbol=="function"&&Symbol.asyncIterator||"@@asyncIterator"]=function(){return this},zi.prototype.next=function(e){return this._invoke("next",e)},zi.prototype.throw=function(e){return this._invoke("throw",e)},zi.prototype.return=function(e){return this._invoke("return",e)};var Lc=Object.entries,el=Object.setPrototypeOf,Dd=Object.isFrozen,Bd=Object.getPrototypeOf,Ud=Object.getOwnPropertyDescriptor,dt=Object.freeze,mt=Object.seal,or=Object.create,Pc=typeof Reflect<"u"&&Reflect,hs=Pc.apply,fs=Pc.construct;dt||(dt=function(t){return t});mt||(mt=function(t){return t});hs||(hs=function(t,n){for(var r=arguments.length,i=new Array(r>2?r-2:0),a=2;a<r;a++)i[a-2]=arguments[a];return t.apply(n,i)});fs||(fs=function(t){for(var n=arguments.length,r=new Array(n>1?n-1:0),i=1;i<n;i++)r[i-1]=arguments[i];return new t(...r)});var Fn=ct(Array.prototype.forEach);Array.prototype.indexOf;var Fd=ct(Array.prototype.lastIndexOf),tl=ct(Array.prototype.pop),Lr=ct(Array.prototype.push);Array.prototype.slice;var Wd=ct(Array.prototype.splice),hr=Array.isArray,Br=ct(String.prototype.toLowerCase),Ba=ct(String.prototype.toString),nl=ct(String.prototype.match),Pr=ct(String.prototype.replace),rl=ct(String.prototype.indexOf),jd=ct(String.prototype.trim),qd=ct(Number.prototype.toString),Hd=ct(Boolean.prototype.toString),il=typeof BigInt>"u"?null:ct(BigInt.prototype.toString),al=typeof Symbol>"u"?null:ct(Symbol.prototype.toString),Mt=ct(Object.prototype.hasOwnProperty),Nr=ct(Object.prototype.toString),bt=ct(RegExp.prototype.test),wn=Gd(TypeError);function ct(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var n=arguments.length,r=new Array(n>1?n-1:0),i=1;i<n;i++)r[i-1]=arguments[i];return hs(e,t,r)}}function Gd(e){return function(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];return fs(e,n)}}function Ue(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Br;if(el&&el(e,null),!hr(t))return e;let r=t.length;for(;r--;){let i=t[r];if(typeof i=="string"){const a=n(i);a!==i&&(Dd(t)||(t[r]=a),i=a)}e[i]=!0}return e}function Vd(e){for(let t=0;t<e.length;t++)Mt(e,t)||(e[t]=null);return e}function zt(e){const t=or(null);for(const r of Lc(e)){var n=zd(r,2);const i=n[0],a=n[1];Mt(e,i)&&(hr(a)?t[i]=Vd(a):a&&typeof a=="object"&&a.constructor===Object?t[i]=zt(a):t[i]=a)}return t}function Zd(e){switch(typeof e){case"string":return e;case"number":return qd(e);case"boolean":return Hd(e);case"bigint":return il?il(e):"0";case"symbol":return al?al(e):"Symbol()";case"undefined":return Nr(e);case"function":case"object":{if(e===null)return Nr(e);const t=e,n=jt(t,"toString");if(typeof n=="function"){const r=n(t);return typeof r=="string"?r:Nr(r)}return Nr(e)}default:return Nr(e)}}function jt(e,t){for(;e!==null;){const r=Ud(e,t);if(r){if(r.get)return ct(r.get);if(typeof r.value=="function")return ct(r.value)}e=Bd(e)}function n(){return null}return n}function Yd(e){try{return bt(e,""),!0}catch{return!1}}var sl=dt(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Ua=dt(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Fa=dt(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),Qd=dt(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Wa=dt(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),Xd=dt(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),ol=dt(["#text"]),ll=dt(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","command","commandfor","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns"]),ja=dt(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dominant-baseline","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","pointer-events","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-orientation","text-rendering","textlength","type","u1","u2","unicode","values","vector-effect","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),cl=dt(["accent","accentunder","align","bevelled","close","columnalign","columnlines","columnspacing","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lquote","lspace","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),$i=dt(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),Jd=mt(/{{[\w\W]*|^[\w\W]*}}/g),Kd=mt(/<%[\w\W]*|^[\w\W]*%>/g),ep=mt(/\${[\w\W]*/g),tp=mt(/^data-[\-\w.\u00B7-\uFFFF]+$/),np=mt(/^aria-[\-\w]+$/),ul=mt(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),rp=mt(/^(?:\w+script|data):/i),ip=mt(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),ap=mt(/^html$/i),sp=mt(/^[a-z][.\w]*(-[.\w]+)+$/i),hl=mt(/<[/\w!]/g),fl=mt(/<[/\w]/g),op=mt(/<\/no(script|embed|frames)/i),lp=mt(/\/>/i),Nt={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,processingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},Nc=["style","script","xmp","iframe","noembed","noframes","plaintext","noscript"],cp=dt(Ue({},Nc)),up=(function(){const e={};return Fn(Nc,t=>{e[t]=mt(new RegExp("</"+t+"(?=[\\t\\n\\f\\r />])","i"))}),dt(e)})(),hp=function(){return typeof window>"u"?null:window},fp=function(t,n){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let r=null;const i="data-tt-policy-suffix";n&&n.hasAttribute(i)&&(r=n.getAttribute(i));const a="dompurify"+(r?"#"+r:"");try{return t.createPolicy(a,{createHTML(o){return o},createScriptURL(o){return o}})}catch{return console.warn("TrustedTypes policy "+a+" could not be created."),null}},dl=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},bn=function(t,n,r,i){return Mt(t,n)&&hr(t[n])?Ue(i.base?zt(i.base):{},t[n],i.transform):r},qa=function(t,n,r){const i=Mt(t,n)?t[n]:void 0;return i&&typeof i=="object"?zt(i):r()};function Ic(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:hp();const t=K=>Ic(K);if(t.version="3.4.16",t.removed=[],!e||!e.document||e.document.nodeType!==Nt.document||!e.Element)return t.isSupported=!1,t;let n=e.document;const r=n,i=r.currentScript;e.DocumentFragment;const a=e.HTMLTemplateElement,o=e.Node,s=e.Element,l=e.NodeFilter;e.NamedNodeMap===void 0&&(e.NamedNodeMap||e.MozNamedAttrMap),e.HTMLFormElement;const c=e.DOMParser,u=e.trustedTypes,f=s.prototype,d=jt(f,"cloneNode"),p=jt(f,"remove"),m=jt(f,"removeAttributeNode"),g=jt(f,"nextSibling"),y=jt(f,"childNodes"),h=jt(f,"parentNode"),_=jt(f,"shadowRoot"),w=jt(f,"attributes"),b=o&&o.prototype?jt(o.prototype,"nodeType"):null,x=o&&o.prototype?jt(o.prototype,"nodeName"):null,z=o&&o.prototype?jt(o.prototype,"ownerDocument"):null,D=function(v){return b?b(v):v.nodeType},B=function(v){return x?x(v):v.nodeName};if(typeof a=="function"){const K=n.createElement("template");K.content&&K.content.ownerDocument&&(n=K.content.ownerDocument)}let j,re="",ae,J=!1,R=0;const N=function(){if(R>0)throw wn('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.')},M=function(v){N(),R++;try{return j.createHTML(v)}finally{R--}},A=function(v){N(),R++;try{return j.createScriptURL(v)}finally{R--}},O=function(){return J||(ae=fp(u,i),J=!0),ae},H=n,L=H.implementation,Q=H.createNodeIterator,ee=H.createDocumentFragment,he=H.getElementsByTagName,me=r.importNode;let xe=dl();t.isSupported=typeof Lc=="function"&&typeof h=="function"&&L&&L.createHTMLDocument!==void 0;const Pe=Jd,ce=Kd,De=ep,Ke=tp,ot=np,E=rp,P=ip,G=sp;let U=ul,C=null;const F=Ue({},[...sl,...Ua,...Fa,...Wa,...ol]);let $=null;const te=Ue({},[...ll,...ja,...cl,...$i]);let W=Object.seal(or(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),V=null,Z=null;const oe=Object.seal(or(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let ge=!0,Ne=!0,Re=!1,Oe=!0,Se=!1,qe=!0,Be=!1,Ht=!1,Nn=null,Xn=null,_r=!1,hn=!1,Jn=!1,Kn=!1,wr=!0,gi=!1;const yi="user-content-";let br=!0,In=!1,nn={},rn=null;const _i=Ue({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","selectedcontent","style","svg","template","thead","title","video","xmp"]);let vr=null;const an=Ue({},["audio","video","img","source","image","track"]);let S=null;const X=Ue({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),fe="http://www.w3.org/1998/Math/MathML",Me="http://www.w3.org/2000/svg",We="http://www.w3.org/1999/xhtml";let Ge=We,ye=!1,pe=null;const Ae=Ue({},[fe,Me,We],Ba),st=dt(["mi","mo","mn","ms","mtext"]);let Je=Ue({},st);const fn=dt(["annotation-xml"]);let On=Ue({},fn);const kr=Ue({},["title","style","font","a","script"]);let zn=null;const xr=["application/xhtml+xml","text/html"],xa="text/html";let et=null,dn=null;const wi=n.createElement("form"),$n=function(v){return v instanceof RegExp||v instanceof Function},Sr=function(){let v=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(dn&&dn===v)return;(!v||typeof v!="object")&&(v={}),v=zt(v),zn=xr.indexOf(v.PARSER_MEDIA_TYPE)===-1?xa:v.PARSER_MEDIA_TYPE,et=zn==="application/xhtml+xml"?Ba:Br,C=bn(v,"ALLOWED_TAGS",F,{transform:et}),$=bn(v,"ALLOWED_ATTR",te,{transform:et}),pe=bn(v,"ALLOWED_NAMESPACES",Ae,{transform:Ba}),S=bn(v,"ADD_URI_SAFE_ATTR",X,{transform:et,base:X}),vr=bn(v,"ADD_DATA_URI_TAGS",an,{transform:et,base:an}),rn=bn(v,"FORBID_CONTENTS",_i,{transform:et}),V=bn(v,"FORBID_TAGS",zt({}),{transform:et}),Z=bn(v,"FORBID_ATTR",zt({}),{transform:et}),nn=Mt(v,"USE_PROFILES")?v.USE_PROFILES&&typeof v.USE_PROFILES=="object"?zt(v.USE_PROFILES):v.USE_PROFILES:!1,ge=v.ALLOW_ARIA_ATTR!==!1,Ne=v.ALLOW_DATA_ATTR!==!1,Re=v.ALLOW_UNKNOWN_PROTOCOLS||!1,Oe=v.ALLOW_SELF_CLOSE_IN_ATTR!==!1,Se=v.SAFE_FOR_TEMPLATES||!1,qe=v.SAFE_FOR_XML!==!1,Be=v.WHOLE_DOCUMENT||!1,hn=v.RETURN_DOM||!1,Jn=v.RETURN_DOM_FRAGMENT||!1,Kn=v.RETURN_TRUSTED_TYPE||!1,_r=v.FORCE_BODY||!1,wr=v.SANITIZE_DOM!==!1,gi=v.SANITIZE_NAMED_PROPS||!1,br=v.KEEP_CONTENT!==!1,In=v.IN_PLACE||!1,U=Yd(v.ALLOWED_URI_REGEXP)?v.ALLOWED_URI_REGEXP:ul,Ge=typeof v.NAMESPACE=="string"?v.NAMESPACE:We,Je=qa(v,"MATHML_TEXT_INTEGRATION_POINTS",()=>Ue({},st)),On=qa(v,"HTML_INTEGRATION_POINTS",()=>Ue({},fn));const T=qa(v,"CUSTOM_ELEMENT_HANDLING",()=>or(null));if(W=or(null),Mt(T,"tagNameCheck")&&$n(T.tagNameCheck)&&(W.tagNameCheck=T.tagNameCheck),Mt(T,"attributeNameCheck")&&$n(T.attributeNameCheck)&&(W.attributeNameCheck=T.attributeNameCheck),Mt(T,"allowCustomizedBuiltInElements")&&typeof T.allowCustomizedBuiltInElements=="boolean"&&(W.allowCustomizedBuiltInElements=T.allowCustomizedBuiltInElements),mt(W),Se&&(Ne=!1),Jn&&(hn=!0),nn&&(C=Ue({},ol),$=or(null),nn.html===!0&&(Ue(C,sl),Ue($,ll)),nn.svg===!0&&(Ue(C,Ua),Ue($,ja),Ue($,$i)),nn.svgFilters===!0&&(Ue(C,Fa),Ue($,ja),Ue($,$i)),nn.mathMl===!0&&(Ue(C,Wa),Ue($,cl),Ue($,$i))),oe.tagCheck=null,oe.attributeCheck=null,Mt(v,"ADD_TAGS")&&(typeof v.ADD_TAGS=="function"?oe.tagCheck=v.ADD_TAGS:hr(v.ADD_TAGS)&&(C===F&&(C=zt(C)),Ue(C,v.ADD_TAGS,et))),Mt(v,"ADD_ATTR")&&(typeof v.ADD_ATTR=="function"?oe.attributeCheck=v.ADD_ATTR:hr(v.ADD_ATTR)&&($===te&&($=zt($)),Ue($,v.ADD_ATTR,et))),Mt(v,"ADD_FORBID_CONTENTS")&&hr(v.ADD_FORBID_CONTENTS)&&(rn===_i&&(rn=zt(rn)),Ue(rn,v.ADD_FORBID_CONTENTS,et)),br&&(C["#text"]=!0),Be&&Ue(C,["html","head","body"]),C.table&&(Ue(C,["tbody"]),delete V.tbody),v.TRUSTED_TYPES_POLICY){if(typeof v.TRUSTED_TYPES_POLICY.createHTML!="function")throw wn('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof v.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw wn('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');const Y=j;j=v.TRUSTED_TYPES_POLICY;try{re=M("")}catch(I){throw j=Y,I}}else v.TRUSTED_TYPES_POLICY===null?(j=void 0,re=""):(j===void 0&&(j=O()),j&&typeof re=="string"&&(re=M("")));dt&&dt(v),dn=v},bi=Ue({},[...Ua,...Fa,...Qd]),vi=Ue({},[...Wa,...Xd]),Yt=function(v,T,Y){return T.namespaceURI===We?v==="svg":T.namespaceURI===fe?v==="svg"&&(Y==="annotation-xml"||Je[Y]):!!bi[v]},ki=function(v,T,Y){return T.namespaceURI===We?v==="math":T.namespaceURI===Me?v==="math"&&On[Y]:!!vi[v]},xi=function(v,T,Y){return T.namespaceURI===Me&&!On[Y]||T.namespaceURI===fe&&!Je[Y]?!1:!vi[v]&&(kr[v]||!bi[v])},Sa=function(v){let T=h(v);(!T||!T.tagName)&&(T={namespaceURI:Ge,tagName:"template"});const Y=Br(v.tagName),I=Br(T.tagName);return pe[v.namespaceURI]?v.namespaceURI===Me?Yt(Y,T,I):v.namespaceURI===fe?ki(Y,T,I):v.namespaceURI===We?xi(Y,T,I):!!(zn==="application/xhtml+xml"&&pe[v.namespaceURI]):!1},Qt=function(v){Lr(t.removed,{element:v});try{h(v).removeChild(v)}catch{if(p(v),!h(v))throw wn("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place")}},Si=function(v,T,Y){try{m(v,T)}catch{try{v.removeAttribute(Y)}catch{}}},sn=function(v){ve(v);const T=y(v);if(T){const I=[];Fn(T,q=>{Lr(I,q)}),Fn(I,q=>{try{p(q)}catch{}})}const Y=w(v);if(Y)for(let I=Y.length-1;I>=0;--I){const q=Y[I],ue=q&&q.name;typeof ue=="string"&&Si(v,q,ue)}},on=function(v,T,Y){if(!Y)try{Y=T.getAttributeNode(v)}catch{Y=null}Lr(t.removed,{attribute:Y||null,from:T});try{Y?m(T,Y):T.removeAttribute(v)}catch{try{T.removeAttribute(v)}catch{}}if(v==="is")if(hn||Jn)try{Qt(T)}catch{}else try{T.setAttribute(v,"")}catch{}},ne=function(v){const T=w(v);if(T)for(let Y=T.length-1;Y>=0;--Y){const I=T[Y],q=I&&I.name;typeof q!="string"||$[et(q)]||Si(v,I,q)}},ve=function(v){const T=[v];for(;T.length>0;){const Y=T.pop();D(Y)===Nt.element&&ne(Y);const I=y(Y);if(I)for(let q=I.length-1;q>=0;--q)T.push(I[q])}},Ie=function(v,T){return qe?v==="patchsrc"?!0:v==="for"&&T!=="label"&&T!=="output":!1},Ve=function(v){if(!qe)return;const T=[v];for(;T.length>0;){const Y=T.pop(),I=D(Y);if(I===Nt.processingInstruction||I===Nt.comment&&bt(fl,Y.data)){try{p(Y)}catch{}continue}if(I===Nt.element){const ue=Y,we=et(B(Y));try{ue.hasAttribute&&ue.hasAttribute("patchsrc")&&ue.removeAttribute("patchsrc"),ue.hasAttribute&&ue.hasAttribute("for")&&Ie("for",we)&&ue.removeAttribute("for")}catch{}}const q=y(Y);if(q)for(let ue=q.length-1;ue>=0;--ue)T.push(q[ue])}},nt=function(v){let T=null,Y=null;if(_r)v="<remove></remove>"+v;else{const ue=nl(v,/^[\r\n\t ]+/);Y=ue&&ue[0]}zn==="application/xhtml+xml"&&Ge===We&&(v='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+v+"</body></html>");const I=j?M(v):v;if(Ge===We)try{T=new c().parseFromString(I,zn)}catch{}if(!T||!T.documentElement){T=L.createDocument(Ge,"template",null);try{T.documentElement.innerHTML=ye?re:I}catch{}}const q=T.body||T.documentElement;return v&&Y&&q.insertBefore(n.createTextNode(Y),q.childNodes[0]||null),Ge===We?he.call(T,Be?"html":"body")[0]:Be?T.documentElement:q},Ct=function(v){const T=z?z(v):v.ownerDocument;return Q.call(T||v,v,l.SHOW_ELEMENT|l.SHOW_COMMENT|l.SHOW_TEXT|l.SHOW_PROCESSING_INSTRUCTION|l.SHOW_CDATA_SECTION,null)},Tt=function(v){return v=Pr(v,Pe," "),v=Pr(v,ce," "),v=Pr(v,De," "),v},Rt=function(v){var T;v.normalize();const Y=z?z(v):v.ownerDocument,I=Q.call(Y||v,v,l.SHOW_TEXT|l.SHOW_COMMENT|l.SHOW_CDATA_SECTION|l.SHOW_PROCESSING_INSTRUCTION,null);let q=I.nextNode();for(;q;)q.data=Tt(q.data),q=I.nextNode();const ue=(T=v.querySelectorAll)===null||T===void 0?void 0:T.call(v,"template");ue&&Fn(ue,we=>{Gt(we.content)&&Rt(we.content)})},wt=function(v){const T=x?x(v):null;return typeof T!="string"||et(T)!=="form"?!1:typeof v.nodeName!="string"||typeof v.textContent!="string"||typeof v.removeChild!="function"||v.attributes!==w(v)||typeof v.removeAttribute!="function"||typeof v.removeAttributeNode!="function"||typeof v.getAttributeNode!="function"||typeof v.setAttribute!="function"||typeof v.namespaceURI!="string"||typeof v.insertBefore!="function"||typeof v.hasChildNodes!="function"||v.nodeType!==b(v)||v.childNodes!==y(v)},Gt=function(v){if(!b||typeof v!="object"||v===null)return!1;try{return b(v)===Nt.documentFragment}catch{return!1}},pn=function(v){if(!b||typeof v!="object"||v===null)return!1;try{return typeof b(v)=="number"}catch{return!1}};function Lt(K,v,T){K.length!==0&&Fn(K,Y=>{Y.call(t,v,T,dn)})}const Ei=function(v,T){return!!(qe&&v.hasChildNodes()&&!pn(v.firstElementChild)&&bt(hl,v.textContent)&&bt(hl,v.innerHTML)||qe&&v.namespaceURI===We&&cp[T]&&(pn(v.firstElementChild)||typeof v.textContent=="string"&&bt(up[T],v.textContent))||v.nodeType===Nt.processingInstruction||qe&&v.nodeType===Nt.comment&&bt(fl,v.data))},er=function(v,T){if(v instanceof RegExp)return bt(v,T);if(v instanceof Function){for(var Y=arguments.length,I=new Array(Y>2?Y-2:0),q=2;q<Y;q++)I[q-2]=arguments[q];return!!v(T,...I)}return!1},Ea=function(v,T,Y){if(!V[T]&&Ti(T)&&er(W.tagNameCheck,T))return!1;if(br&&!rn[T]){const I=h(v),q=y(v);if(q&&I){const ue=q.length;for(let we=ue-1;we>=0;--we){const Le=v===Y?d(q[we],!0):q[we];I.insertBefore(Le,g(v))}}}return Qt(v),!0},Ai=function(v,T,Y,I){return v.length===0?T:T===Y||T===I?zt(T):T},mn=function(v,T){return v===T||h(v)!==null?!1:(In&&ve(v),!0)},Dn=function(v,T){if(Lt(xe.beforeSanitizeElements,v,null),mn(v,T))return!0;if(wt(v))return Qt(v),!0;const Y=et(B(v));if(C=Ai(xe.uponSanitizeElement,C,F,Nn),Lt(xe.uponSanitizeElement,v,{tagName:Y,allowedTags:C}),mn(v,T))return!0;if(Ei(v,Y))return Qt(v),!0;if(V[Y]||!(oe.tagCheck instanceof Function&&oe.tagCheck(Y))&&!C[Y]){const I=Ea(v,Y,T);return I===!1&&(Lt(xe.afterSanitizeElements,v,null),mn(v,T))?!0:I}if(D(v)===Nt.element&&!Sa(v)||(Y==="noscript"||Y==="noembed"||Y==="noframes")&&bt(op,v.innerHTML))return Qt(v),!0;if(Se&&v.nodeType===Nt.text){const I=Tt(v.textContent);v.textContent!==I&&(Lr(t.removed,{element:v.cloneNode()}),v.textContent=I)}return Lt(xe.afterSanitizeElements,v,null),mn(v,T)},Er=function(v,T,Y){if(Z[T]||Ie(T,v)||wr&&(T==="id"||T==="name")&&(Y in n||Y in wi))return!1;const I=$[T]||oe.attributeCheck instanceof Function&&oe.attributeCheck(T,v);return Ne&&bt(Ke,T)||ge&&bt(ot,T)?!0:I?S[T]||bt(U,Pr(Y,P,""))||(T==="src"||T==="xlink:href"||T==="href")&&v!=="script"&&rl(Y,"data:")===0&&vr[v]||Re&&!bt(E,Pr(Y,P,""))?!0:!Y:Ti(v)&&er(W.tagNameCheck,v)&&er(W.attributeNameCheck,T,v)||T==="is"&&W.allowCustomizedBuiltInElements&&er(W.tagNameCheck,Y)},Ft=Ue({},["annotation-xml","color-profile","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","missing-glyph"]),Ti=function(v){return!Ft[Br(v)]&&bt(G,v)},Ar=function(v,T,Y,I){if(j&&typeof u=="object"&&typeof u.getAttributeType=="function"&&!Y)switch(u.getAttributeType(v,T)){case"TrustedHTML":return M(I);case"TrustedScriptURL":return A(I)}return I},Te=function(v,T,Y,I){try{return Y?v.setAttributeNS(Y,T,I):v.setAttribute(T,I),wt(v)?(Qt(v),!1):!0}catch{return on(T,v),!1}},Tr=function(v,T){if(Lt(xe.beforeSanitizeAttributes,v,null),mn(v,T))return;const Y=v.attributes;if(!Y||wt(v))return;$=Ai(xe.uponSanitizeAttribute,$,te,Xn);const I={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:$,forceKeepAttr:void 0};let q=Y.length;const ue=et(v.nodeName);for(;q--;){const we=Y[q],Le=we.name,it=we.namespaceURI,St=we.value,gn=et(Le),Aa=St;let Et=Le==="value"?Aa:jd(Aa),Xs=!1;if(I.attrName=gn,I.attrValue=Et,I.keepAttr=!0,I.forceKeepAttr=void 0,Lt(xe.uponSanitizeAttribute,v,I),Et=I.attrValue,gi&&(gn==="id"||gn==="name")&&rl(Et,yi)!==0&&(on(Le,v,we),Et=yi+Et,Xs=!0),qe&&bt(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,Et)){on(Le,v,we);continue}if(gn==="attributename"&&nl(Et,"href")){on(Le,v,we);continue}if(!I.forceKeepAttr){if(!I.keepAttr){on(Le,v,we);continue}if(!Oe&&bt(lp,Et)){on(Le,v,we);continue}if(Se&&(Et=Tt(Et)),!Er(ue,gn,Et)){on(Le,v,we);continue}Et=Ar(ue,gn,it,Et),Et!==Aa&&Te(v,Le,it,Et)&&Xs&&tl(t.removed)}}Lt(xe.afterSanitizeAttributes,v,null),mn(v,T)},rt=function(v){let T=null;const Y=Ct(v);for(Lt(xe.beforeSanitizeShadowDOM,v,null);T=Y.nextNode();)if(Lt(xe.uponSanitizeShadowNode,T,null),Dn(T,v),Tr(T,v),Gt(T.content)&&rt(T.content),D(T)===Nt.element){const I=_(T);Gt(I)&&(He(I),rt(I))}Lt(xe.afterSanitizeShadowDOM,v,null)},He=function(v){const T=[{node:v,shadow:null}];for(;T.length>0;){const Y=T.pop();if(Y.shadow){rt(Y.shadow);continue}const I=Y.node,q=D(I)===Nt.element,ue=y(I);if(ue)for(let we=ue.length-1;we>=0;--we)T.push({node:ue[we],shadow:null});if(q){const we=x?x(I):null;if(typeof we=="string"&&et(we)==="template"){const Le=I.content;Gt(Le)&&T.push({node:Le,shadow:null})}}if(q){const we=_(I);Gt(we)&&T.push({node:null,shadow:we},{node:we,shadow:null})}}};return t.sanitize=function(K){let v=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},T=null,Y=null,I=null,q=null;if(ye=!K,ye&&(K="<!-->"),typeof K!="string"&&!pn(K)&&(K=Zd(K),typeof K!="string"))throw wn("dirty is not a string, aborting");if(!t.isSupported)return K;Ht?(C=Nn,$=Xn):Sr(v),(xe.uponSanitizeElement.length>0||xe.uponSanitizeAttribute.length>0)&&(C=zt(C)),xe.uponSanitizeAttribute.length>0&&($=zt($)),t.removed=[];const ue=In&&typeof K!="string"&&pn(K);if(ue){Ve(K);const it=B(K);if(typeof it=="string"){const St=et(it);if(!C[St]||V[St])throw sn(K),wn("root node is forbidden and cannot be sanitized in-place")}if(wt(K))throw sn(K),wn("root node is clobbered and cannot be sanitized in-place");try{He(K)}catch(St){throw sn(K),St}}else if(pn(K))T=nt("<!---->"),Y=T.ownerDocument.importNode(K,!0),Y.nodeType===Nt.element&&Y.nodeName==="BODY"||Y.nodeName==="HTML"?T=Y:T.appendChild(Y),He(T);else{if(!hn&&!Se&&!Be&&K.indexOf("<")===-1)return j&&Kn?M(K):K;if(T=nt(K),!T)return hn?null:Kn?re:""}T&&_r&&Qt(T.firstChild);const we=ue?K:T;try{const it=Ct(we);for(;I=it.nextNode();)Dn(I,we),Tr(I,we),Gt(I.content)&&rt(I.content)}catch(it){throw ue&&(sn(K),Fn(t.removed,St=>{St.element&&ve(St.element)})),it}if(ue){let it=!1;if(Fn(t.removed,St=>{St.element&&(St.element===K&&(it=!0),ve(St.element))}),it)throw wn("a node selected for removal could not be safely returned; refusing to sanitize in place");return Se&&Rt(K),K}if(hn){if(Se&&Rt(T),Jn)for(q=ee.call(T.ownerDocument);T.firstChild;)q.appendChild(T.firstChild);else q=T;return($.shadowroot||$.shadowrootmode)&&(q=me.call(r,q,!0)),q}let Le=Be?T.outerHTML:T.innerHTML;return Be&&C["!doctype"]&&T.ownerDocument&&T.ownerDocument.doctype&&T.ownerDocument.doctype.name&&bt(ap,T.ownerDocument.doctype.name)&&(Le="<!DOCTYPE "+T.ownerDocument.doctype.name+`>
`+Le),Se&&(Le=Tt(Le)),j&&Kn?M(Le):Le},t.setConfig=function(){let K=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};Sr(K),Ht=!0,Nn=C,Xn=$},t.clearConfig=function(){dn=null,Ht=!1,Nn=null,Xn=null,j=ae,re=""},t.isValidAttribute=function(K,v,T){dn||Sr({});const Y=et(K),I=et(v);return Er(Y,I,T)},t.addHook=function(K,v){typeof v=="function"&&Mt(xe,K)&&Lr(xe[K],v)},t.removeHook=function(K,v){if(Mt(xe,K)){if(v!==void 0){const T=Fd(xe[K],v);return T===-1?void 0:Wd(xe[K],T,1)[0]}return tl(xe[K])}},t.removeHooks=function(K){Mt(xe,K)&&(xe[K]=[])},t.removeAllHooks=function(){xe=dl()},t}var Di=Ic();function dp(){return typeof window<"u"&&window.document?window:typeof self<"u"?self:{document:{nodeType:9,createElement:()=>({}),createDocumentFragment:()=>({}),implementation:{createHTMLDocument:()=>({documentElement:{},body:{},createElement:()=>({}),createDocumentFragment:()=>({})})}},Element:class{},Node:class{},NodeFilter:{SHOW_ELEMENT:1,SHOW_TEXT:3},DOMParser:class{},trustedTypes:void 0}}var Wt=null;function Ha(){return Wt||(typeof Di?.sanitize=="function"?Wt=Di.sanitize.bind(Di):Wt=Di(dp()),typeof Wt=="function"&&typeof Wt.sanitize=="function"?Wt=Wt.sanitize.bind(Wt):typeof Wt=="function"&&Wt.isSupported===!1&&(Wt=e=>String(e??""))),Wt}var pp=ha({_sendToRenderer:()=>zc,_slugifyLocal:()=>ps,_splitIntoSections:()=>$c,addMarkdownExtension:()=>ds,detectFenceLanguages:()=>ua,detectFenceLanguagesAsync:()=>gs,initRendererWorker:()=>ba,markdownPlugins:()=>Cn,parseMarkdownToHtml:()=>pr,setMarkdownExtensions:()=>wp,slugify:()=>be,streamParseMarkdown:()=>ms,teardownRendererWorkerPool:()=>_p}),mp=Il(),gp={intervalMs:500,targetMs:75,hysteresis:.25,cooldownMs:500,stepUp:1,stepDown:1},Zr=null;function yp(){const e={size:mp,minSize:2,autoScale:gp,messageCodec:"negotiated",maxQueueLength:100};try{typeof{}<"u"&&(e.debugLevel=0)}catch{}try{return new $s(Ld,e)}catch{return{workers:[],postMessage:async()=>{throw new Error("renderer worker unavailable")}}}}function Oc(){return Zr||(Zr=yp()),Zr}function _p(){const e=Zr;if(Zr=null,!!e)try{typeof e.drain=="function"&&e.drain().catch(()=>{}),typeof e.terminate=="function"&&e.terminate(),typeof e.dispose=="function"&&e.dispose()}catch(t){k("[markdown] teardownRendererWorkerPool failed",t)}}var ba=()=>Oc().workers?.[0]?.worker?._underlying??null,zc=(e,t=3e3)=>ba?.()?Oc().postMessage(e,void 0,{awaitResponse:!0,timeout:t}).then(n=>{if(n?.error)throw new Error(n.error);return n}).catch(n=>{throw(n?.message||"").includes("postMessage response timeout")?new Error("worker timeout"):n}):Promise.reject(new Error("renderer worker unavailable")),Cn=[];function ds(e){if(e&&(typeof e=="object"||typeof e=="function")){Cn.push(e);try{$e.use(e)}catch(t){k("[markdown] failed to apply plugin",t)}}}function wp(e){Cn.length=0,Array.isArray(e)&&Cn.push(...e.filter(t=>t&&typeof t=="object"));try{Cn.forEach(t=>$e.use(t))}catch(t){k("[markdown] failed to apply markdown extensions",t)}}function ps(e){return be(e)}function $c(e,t){const n=String(e??"");if(!n||n.length<=t)return[n];const r=/^#{1,6}\s.*$/gm,i=[];let a;for(;(a=r.exec(n))!==null;)i.push(a.index);if(!i.length||i.length<2){const c=[];for(let u=0;u<n.length;u+=t)c.push(n.slice(u,u+t));return c}const o=[];i[0]>0&&o.push(n.slice(0,i[0]));for(let c=0;c<i.length;c++){const u=i[c],f=c+1<i.length?i[c+1]:n.length;o.push(n.slice(u,f))}const s=[];let l="";for(const c of o){if(!l&&c.length>=t){s.push(c);continue}l.length+c.length<=t?l+=c:(l&&s.push(l),l=c)}return l&&s.push(l),s}async function ms(e,t,n={}){const r=n?.chunkSize?Number(n.chunkSize):65536,i=typeof t=="function"?t:()=>{},{content:a,data:o}=ur(String(e??""));let s=a;try{s=String(s??"").replace(/:([^:\s]+):/g,(f,d)=>Dr[d]||f)}catch{}ba?.();const l=$c(s,r),c=at(),u=new Map;for(let f=0;f<l.length;f++){const d=l[f],p=await pr(d);let m=String(p?.html||""),g=[];if(c)try{const h=c.parseFromString(m,"text/html");h.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(_=>{try{const w=Number(_.tagName.substring(1)),b=(_.textContent||"").trim(),x=ps(b),z=(u.get(x)||0)+1;u.set(x,z);const D=z===1?x:x+"-"+z;_.id=D,g.push({level:w,text:b,id:D})}catch{}});try{typeof XMLSerializer<"u"?m=new XMLSerializer().serializeToString(h.body).replace(/^<body[^>]*>/i,"").replace(/<\/body>$/i,""):m=Array.from(h.body.childNodes||[]).map(_=>typeof _?.outerHTML=="string"?_.outerHTML:typeof _?.textContent=="string"?_.textContent:"").join("")}catch{}}catch{}else try{const h=[];m=m.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(_,w,b,x)=>{const z=Number(w),D=x.replace(/<[^>]+>/g,"").trim(),B=ps(D),j=(u.get(B)||0)+1;u.set(B,j);const re=j===1?B:B+"-"+j;return h.push({level:z,text:D,id:re}),`<h${z} ${(b||"").replace(/\s*(id|class)="[^"]*"/g,"")} id="${re}">${x}</h${z}>`}),g=h}catch{}const y={index:f,isLast:f===l.length-1,meta:f===0?o||{}:{},toc:g};try{i(m,y)}catch{}}}async function pr(e){if(Cn?.length){let{content:r,data:i}=ur(e||"");try{r=String(r??"").replace(/:([^:\s]+):/g,(o,s)=>Dr[s]||o)}catch{}$e.setOptions({gfm:!0});try{Cn.forEach(o=>$e.use(o))}catch(o){k("[markdown] apply plugins failed",o)}const a=Ha()($e.parse(r));try{const o=at();if(o){const s=o.parseFromString(a,"text/html"),l=s.querySelectorAll("h1,h2,h3,h4,h5,h6"),c=[],u=new Set,f=d=>{const p={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},m=d<=2?"has-text-weight-bold":d<=4?"has-text-weight-semibold":"has-text-weight-normal";return(p[d]+" "+m).trim()};l.forEach(d=>{try{const p=Number(d.tagName.substring(1)),m=(d.textContent||"").trim();let g=be(m)||"heading",y=g,h=2;for(;u.has(y);)y=g+"-"+h,h+=1;u.add(y),d.id=y,d.className=f(p),c.push({level:p,text:m,id:y})}catch{}});try{(typeof s?.getElementsByTagName=="function"?Array.from(s.getElementsByTagName("img")):typeof s?.querySelectorAll=="function"?Array.from(s.querySelectorAll("img")):[]).forEach(d=>{try{const p=d.getAttribute?.("loading"),m=d.getAttribute?.("data-want-lazy");!p&&!m&&d.setAttribute?.("loading","lazy");try{const g=d.getAttribute?.("alt");if(!g||!String(g).trim()){const y=d.getAttribute?.("src")||"";if(y){const h=String(y).split("/").pop().replace(/\.[^.]+$/,"");h&&d.setAttribute("alt",h.replace(/[-_]+/g," "))}}}catch{}}catch{}})}catch{}try{s.querySelectorAll("pre code, code[class]").forEach(d=>{try{const p=d.getAttribute?.("class")||d.className||"",m=String(p??"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(m)try{d.setAttribute?.("class",m)}catch{d.className=m}else try{d.removeAttribute?.("class")}catch{d.className=""}}catch{}})}catch{}try{let d=null;try{typeof XMLSerializer<"u"?d=new XMLSerializer().serializeToString(s.body).replace(/^<body[^>]*>/i,"").replace(/<\/body>$/i,""):d=Array.from(s.body.childNodes||[]).map(p=>typeof p?.outerHTML=="string"?p.outerHTML:typeof p?.textContent=="string"?p.textContent:"").join("")}catch{try{d=s.body.innerHTML}catch{d=""}}return{html:d,meta:i||{},toc:c}}catch{return{html:"",meta:i||{},toc:c}}}}catch{}return{html:a,meta:i||{},toc:[]}}try{e=String(e??"").replace(/:([^:\s]+):/g,(r,i)=>Dr[i]||r)}catch{}let t;t=ba?.();try{if(Ye?.getLanguage?.("plaintext")&&/```\s*\n/.test(String(e??""))){let{content:r,data:i}=ur(e||"");try{r=String(r??"").replace(/:([^:\s]+):/g,(l,c)=>Dr[c]||l)}catch{}$e.setOptions({gfm:!0,highlighted:(l,c)=>{try{return c&&Ye?.getLanguage?.(c)?Ye.highlight(l,{language:c}).value:Ye?.getLanguage?.("plaintext")?Ye.highlight(l,{language:"plaintext"}).value:l}catch{return l}}});let a=Ha()($e.parse(r));try{a=a.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g,(l,c)=>{try{if(c&&typeof Ye?.highlight=="function")try{const u=Ye.highlight(c,{language:"plaintext"});return`<pre><code>${u?.value?u.value:u}</code></pre>`}catch{try{if(typeof Ye?.highlightElement=="function"){const f={innerHTML:c};return Ye.highlightElement(f),`<pre><code>${f.innerHTML}</code></pre>`}}catch{}}}catch{}return l})}catch{}const o=[],s=new Set;return a=a.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(l,c,u,f)=>{const d=Number(c),p=f.replace(/<[^>]+>/g,"").trim();let m=be(p)||"heading",g=m,y=2;for(;s.has(g);)g=m+"-"+y,y+=1;s.add(g),o.push({level:d,text:p,id:g});const h={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},_=d<=2?"has-text-weight-bold":d<=4?"has-text-weight-semibold":"has-text-weight-normal",w=(h[d]+" "+_).trim();return`<h${d} ${((u||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${g}" class="${w}"`).trim()}>${f}</h${d}>`}),a=a.replace(/<img([^>]*)>/g,(l,c)=>/\bloading=/.test(c)?`<img${c}>`:/\bdata-want-lazy=/.test(c)?`<img${c}>`:`<img${c} loading="lazy">`),{html:a,meta:i||{},toc:o}}}catch{}if(!t)try{let{content:r,data:i}=ur(e||"");try{r=String(r??"").replace(/:([^:\s]+):/g,(a,o)=>Dr[o]||a)}catch{}return $e.setOptions({gfm:!0,highlighted:(a,o)=>{try{return o&&Ye?.getLanguage?.(o)?Ye.highlight(a,{language:o}).value:Ye?.getLanguage?.("plaintext")?Ye.highlight(a,{language:"plaintext"}).value:a}catch{return a}}}),{html:Ha()($e.parse(r)),meta:i||{}}}catch{throw new Error("renderer worker required but unavailable")}const n=await zc({type:"render",md:e});if(!n||typeof n!="object"||n.html===void 0)throw new Error("renderer worker returned invalid response");try{const r=new Map,i=[],a=s=>{const l={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},c=s<=2?"has-text-weight-bold":s<=4?"has-text-weight-semibold":"has-text-weight-normal";return(l[s]+" "+c).trim()};let o=n.html;o=o.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(s,l,c,u)=>{const f=Number(l),d=u.replace(/<[^>]+>/g,"").trim(),p=(c||"").match(/\sid="([^"]+)"/),m=p?p[1]:be(d)||"heading",g=(r.get(m)||0)+1;r.set(m,g);const y=g===1?m:m+"-"+g;i.push({level:f,text:d,id:y});const h=a(f);return`<h${f} ${((c||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${y}" class="${h}"`).trim()}>${u}</h${f}>`});try{const s=typeof document<"u"&&document.documentElement?.getAttribute?.("data-nimbi-logo-moved")||"";if(s){const l=at();if(l){const c=l.parseFromString(o,"text/html");(typeof c?.getElementsByTagName=="function"?Array.from(c.getElementsByTagName("img")):typeof c?.querySelectorAll=="function"?Array.from(c.querySelectorAll("img")):[]).forEach(u=>{try{const f=u?.getAttribute?.("src")||"";(f?new URL(f,location.href).toString():"")===s&&u.remove()}catch{}});try{typeof XMLSerializer<"u"?o=new XMLSerializer().serializeToString(c.body).replace(/^<body[^>]*>/i,"").replace(/<\/body>$/i,""):o=Array.from(c.body.childNodes||[]).map(u=>typeof u?.outerHTML=="string"?u.outerHTML:typeof u?.textContent=="string"?u.textContent:"").join("")}catch{try{o=c.body.innerHTML}catch{}}}else try{const c=s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");o=o.replace(new RegExp(`<img[^>]*src=\\"${c}\\"[^>]*>`,"g"),"")}catch{}}}catch{}return{html:o,meta:n.meta||{},toc:i}}catch{return{html:n.html,meta:n.meta||{},toc:n.toc||[]}}}function ua(e,t){const n=new Set,r=/```\s*([a-zA-Z0-9_\-+]+)?/g,i=new Set(["then","now","if","once","so","and","or","but","when","the","a","an","as","let","const","var","export","import","from","true","false","null","npm","run","echo","sudo","this","that","have","using","some","return","returns","function","console","log","error","warn","class","new","undefined","with","select","from","where","join","on","group","order","by","having","as","into","values","like","limit","offset","create","table","index","view","insert","update","delete","returning","and","or","not","all","any","exists","case","when","then","else","end","distance","geometry","you","which","would","why","cool","other","same","everything","check"]),a=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);let o;for(;o=r.exec(e);)if(o[1]){const s=o[1].toLowerCase();if(Ts.has(s)||t?.size&&s.length<3&&!t.has(s)&&!t.has(tn?.[s]))continue;if(t?.size){if(t.has(s)){const l=t.get(s);l&&n.add(l);continue}if(tn?.[s]){const l=tn[s];if(t.has(l)){const c=t.get(l)||l;n.add(c);continue}}}(a.has(s)||s.length>=5&&s.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(s)&&!i.has(s))&&n.add(s)}return n}async function gs(e,t){return Cn?.length,ua(e||"",t)}function bp(e,t=150,n={}){let r=null;const i=!!n.leading;return function(...o){const s=this;if(r&&clearTimeout(r),i&&!r)try{e.apply(s,o)}catch{}r=setTimeout(()=>{if(r=null,!i)try{e.apply(s,o)}catch{}},t)}}function vp(e){let t=!1,n=null,r=null;return function(...a){if(n=a,r=this,t)return;t=!0;try{e.apply(this,a)}catch{}n=null,r=null;const o=()=>{if(t=!1,!n)return;const s=n,l=r;n=null,r=null,t=!0;try{e.apply(l,s)}catch{}typeof requestAnimationFrame=="function"?requestAnimationFrame(o):setTimeout(o,16)};typeof requestAnimationFrame=="function"?requestAnimationFrame(o):setTimeout(o,16)}}function kp(){let e=[],t=!1;return function(r){typeof r=="function"&&(e.push(r),!t&&(t=!0,typeof requestAnimationFrame=="function"?requestAnimationFrame(()=>{t=!1;const i=e.slice(0);e.length=0;for(const a of i)try{a()}catch{}}):setTimeout(()=>{t=!1;const i=e.slice(0);e.length=0;for(const a of i)try{a()}catch{}},0)))}}var Vi=kp(),Dc=`let C = typeof DOMParser < "u" ? new DOMParser() : null;
function ne() {
	return C || (typeof DOMParser < "u" ? (C = new DOMParser(), C) : null);
}
function v(e) {
	return String(e ?? "").replace(/^[./]+/, "");
}
function H(e) {
	return String(e ?? "").replace(/\\/+$/, "");
}
function oe(e) {
	return H(e) + "/";
}
function ie(e) {
	const r = String(e ?? "");
	return /^(https?:)?\\/\\//.test(r) || r.startsWith("mailto:") || r.startsWith("tel:");
}
function R(e, r = null) {
	const t = encodeURIComponent(String(e ?? ""));
	return r ? \`?page=\${t}#\${encodeURIComponent(String(r))}\` : \`?page=\${t}\`;
}
function I(e) {
	return String(e ?? "").toLowerCase().trim().replace(/[^a-z0-9\\-\\s]+/g, "").replace(/\\s+/g, "-");
}
function W(e, r) {
	try {
		if (!e) return e;
		const t = String(r ?? "").replace(/^\\/+|\\/+$/g, "");
		if (!t) return String(e ?? "");
		let n = String(e ?? "").replace(/^\\/+/, "");
		const i = t + "/";
		for (; n.startsWith(i);) n = n.slice(i.length);
		return n === t ? "" : n;
	} catch {
		return String(e ?? "");
	}
}
function j() {
	if (typeof DOMParser > "u") return null;
	const e = ne();
	try {
		if (e?.constructor === DOMParser) return e;
	} catch {}
	return new DOMParser();
}
function S(e) {
	return String(e ?? "").replace(/^.*\\//, "");
}
function se(e) {
	const r = /* @__PURE__ */ new Map();
	try {
		if (!e || typeof e != "object") return r;
		for (const [t, n] of Object.entries(e || {})) try {
			if (!t || !n) continue;
			r.set(String(n), String(t));
		} catch {}
	} catch {}
	return r;
}
function ce(e, r) {
	try {
		const t = String(e ?? "");
		return t ? t.includes("/") || /\\.(?:md|html?)$/i.test(t) ? t : se(r?.pathToSlug).get(t) || e : e;
	} catch {
		return e;
	}
}
function ae(e, r = 2) {
	try {
		const t = String(e ?? "").split("/").filter(Boolean);
		return t.length ? t.slice(-Math.max(1, Math.min(r, t.length))).join("/") : "";
	} catch {
		return String(e ?? "");
	}
}
function fe(e, r) {
	if (!e || !r) return null;
	try {
		if (r.has(e)) return r.get(e);
	} catch {}
	const t = S(e);
	try {
		if (t && r.has(t)) return r.get(t);
	} catch {}
	const n = ae(e, 2);
	try {
		for (const [i, o] of r.entries()) if (!(!i || !o) && (i === e || i === t || String(i).endsWith(\`/\${n}\`))) return o;
	} catch {}
	return null;
}
function ue(e) {
	return new Map(Object.entries(e?.pathToSlug || {}));
}
function m(e, r, t, n) {
	const i = String(t ?? ""), o = String(n ?? "");
	!i || !o || e.has(i) || (e.set(i, o), r.push({
		path: i,
		slug: o
	}));
}
async function F(e, r) {
	const t = new URL(String(e ?? ""), String(r || (typeof location < "u" ? location.href : "http://localhost/"))), n = await fetch(t.toString());
	return !n || !n.ok ? null : await n.text();
}
function V(e, r) {
	if (!e) return null;
	if (!r) {
		const t = String(e).match(/^#\\s+(.+)$/m);
		return t?.[1] ? I(t[1].trim()) : null;
	}
	try {
		const t = j();
		if (!t) return null;
		const n = t.parseFromString(String(e), "text/html"), i = n.querySelector("title")?.textContent?.trim(), o = n.querySelector("h1")?.textContent?.trim();
		return I(i || o || "") || null;
	} catch {
		return null;
	}
}
async function J(e, r, t) {
	const n = Array.from(e || []);
	if (!n.length) return;
	const i = Math.max(1, Number(r) || 1);
	let o = 0;
	const s = Array.from({ length: Math.min(i, n.length) }, async () => {
		for (; o < n.length;) {
			const c = n[o];
			o += 1, await t(c);
		}
	});
	await Promise.all(s);
}
async function le(e, r, t, n = {}) {
	const i = j();
	if (!i) return {
		html: String(e ?? ""),
		mappings: []
	};
	const o = i.parseFromString(String(e ?? ""), "text/html"), s = o.body.querySelectorAll("a");
	if (!s || !s.length) return {
		html: o.body.innerHTML,
		mappings: []
	};
	let c = "/";
	try {
		c = oe(new URL(String(r ?? ""), typeof location < "u" ? location.href : "http://localhost/").pathname);
	} catch {}
	t = ce(t, n);
	const u = ue(n), d = [], h = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), w = [], B = [], re = String(n?.homeSlug || "_home");
	for (const f of Array.from(s)) try {
		try {
			if (f?.closest?.("h1,h2,h3,h4,h5,h6")) continue;
		} catch {}
		const a = f.getAttribute("href") || "";
		if (!a || ie(a)) continue;
		try {
			if ((a.startsWith("?") || a.includes("?")) && t) {
				const y = new URL(a, String(r || (typeof location < "u" ? location.href : "http://localhost/"))), p = y.searchParams.get("page");
				if (p && !p.includes("/")) {
					const O = t.includes("/") ? t.slice(0, t.lastIndexOf("/") + 1) : "";
					if (O) {
						const A = v(O + p);
						f.setAttribute("href", R(A, y.hash ? y.hash.replace(/^#/, "") : null));
						continue;
					}
				}
			}
		} catch {}
		if (a.startsWith("/") && !a.endsWith(".md")) continue;
		const T = a.match(/^([^#?]+\\.md)(?:#(.+))?$/);
		if (T) {
			let y = T[1];
			const p = T[2];
			!y.startsWith("/") && t && (y = (t.includes("/") ? t.slice(0, t.lastIndexOf("/") + 1) : "") + y);
			const O = new URL(y, String(r || (typeof location < "u" ? location.href : "http://localhost/"))).pathname;
			let A = O.startsWith(c) ? O.slice(c.length) : O;
			A = v(W(A, c)), w.push({
				node: f,
				rel: A,
				frag: p
			}), u.has(A) || h.add(A);
			continue;
		}
		let x = a;
		!a.startsWith("/") && t && (a.startsWith("#") ? x = t + a : x = (t.includes("/") ? t.slice(0, t.lastIndexOf("/") + 1) : "") + a);
		const $ = new URL(x, String(r || (typeof location < "u" ? location.href : "http://localhost/"))).pathname || "";
		if (!$ || !$.includes(c)) continue;
		let g = $.startsWith(c) ? $.slice(c.length) : $;
		if (g = v(W(g, c)), g = H(g), g || (g = re), !g.endsWith(".md")) {
			const y = fe(g, u);
			if (y) f.setAttribute("href", R(y));
			else {
				const p = /\\.[^/]+$/.test(g) ? g : \`\${g}.html\`;
				l.add(p), B.push({
					node: f,
					rel: p,
					fallbackRel: g
				});
			}
		}
	} catch {}
	if (n?.allowProbe) await J(h, 6, async (f) => {
		try {
			const a = V(await F(f, r), !1);
			if (!a) return;
			m(u, d, f, a), m(u, d, S(f), a);
		} catch {}
	}), await J(l, 5, async (f) => {
		try {
			const a = V(await F(f, r), !0);
			if (!a) return;
			m(u, d, f, a), m(u, d, S(f), a);
		} catch {}
	});
	else {
		for (const f of h) {
			const a = I(S(f).replace(/\\.md$/i, ""));
			a && (m(u, d, f, a), m(u, d, S(f), a));
		}
		for (const f of l) {
			const a = I(S(f).replace(/\\.html$/i, ""));
			a && (m(u, d, f, a), m(u, d, S(f), a));
		}
	}
	for (const f of w) {
		const a = u.get(f.rel);
		f.node.setAttribute("href", R(a || f.rel, f.frag || null));
	}
	for (const f of B) {
		const a = u.get(f.rel) || u.get(S(f.rel)) || u.get(f.fallbackRel);
		f.node.setAttribute("href", R(a || f.rel));
	}
	return {
		html: o.body.innerHTML,
		mappings: d
	};
}
let E, M;
function de() {
	return E !== void 0 ? E === !1 ? null : E : typeof TextEncoder < "u" ? (E = new TextEncoder(), E) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (E = { encode: (e) => new Uint8Array(Buffer.from(e)) }, E) : null;
}
function _(e) {
	if (e instanceof ArrayBuffer) return !0;
	try {
		return typeof Reflect.get(ArrayBuffer.prototype, "byteLength", e) == "number";
	} catch {
		return !1;
	}
}
function q(e) {
	if (typeof SharedArrayBuffer > "u") return !1;
	if (e instanceof SharedArrayBuffer) return !0;
	try {
		return typeof Reflect.get(SharedArrayBuffer.prototype, "byteLength", e) == "number";
	} catch {
		return !1;
	}
}
function he() {
	return M !== void 0 ? M === !1 ? null : M : typeof TextDecoder < "u" ? (M = new TextDecoder(), M) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (M = { decode: (e) => Buffer.from(e).toString("utf8") }, M) : null;
}
const Y = (e, r) => {
	if (e instanceof Uint8Array) return e;
	if (ArrayBuffer.isView(e)) return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
	if (_(e)) return new Uint8Array(e);
	if (q(e)) return new Uint8Array(e);
	const t = r ?? JSON.stringify(e);
	if (typeof t != "string") throw new TypeError(\`PowerBuffer.o2u8: JSON.stringify returned \${t === void 0 ? "undefined" : typeof t} for a value of type \${typeof e}, which is not encodable. Functions, Symbols and \\\`undefined\\\` have no JSON representation.\`);
	const n = de();
	if (typeof n?.encode == "function") return n.encode(t);
	throw new Error("No TextEncoder or Buffer available to encode object");
}, z = (e) => {
	let r;
	if (e instanceof Uint8Array) r = e;
	else if (ArrayBuffer.isView(e)) r = new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
	else if (_(e)) r = new Uint8Array(e);
	else if (q(e)) r = new Uint8Array(e);
	else if (typeof Buffer < "u" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(e)) r = new Uint8Array(e);
	else throw new TypeError("Unsupported input to u82o, expected ArrayBuffer/TypedArray/Buffer");
	const t = he();
	if (typeof t?.decode == "function") return JSON.parse(t.decode(r));
	throw new Error("No TextDecoder or Buffer available to decode object");
};
function ye(e, r) {
	const { name: t, className: n, min: i = 0, integer: o = !1, allowInfinity: s = !1, fallback: c, invalidMessage: u, minMessage: d, integerMessage: h } = r;
	if (e == null) return c !== void 0 ? c : e;
	const l = Number(e);
	if (l === Number.POSITIVE_INFINITY && s) return l;
	if (!Number.isFinite(l)) throw new TypeError(u ?? \`\${n}: \\\`\${t}\\\` must be a finite number (received \${String(e)}). A non-finite limit would silently disable the check it guards.\`);
	if (o && !Number.isInteger(l)) throw new TypeError(h ?? \`\${n}: \\\`\${t}\\\` must be a whole number (received \${String(e)}). A fractional limit is silently rounded up by the first consumer, so it admits more than the number that was configured.\`);
	if (l < i) throw new TypeError(d ?? \`\${n}: \\\`\${t}\\\` must be >= \${i} (received \${l}).\`);
	return l;
}
function ge(e, r) {
	const t = ye(e, r);
	if (typeof t != "number") throw new TypeError(\`\${r.className}: \\\`\${r.name}\\\` must be a number or have a \\\`fallback\\\`, but resolved to \${String(t)}.\`);
	return t;
}
const b = Object.freeze({
	JSON: 0,
	RAW: 2
});
const G = /* @__PURE__ */ new Set([
	"framed",
	"legacy",
	"negotiated"
]);
for (const e of [
	"add",
	"delete",
	"clear"
]) Object.defineProperty(G, e, {
	value: () => {
		throw new TypeError(\`MESSAGE_CODECS is read-only: \\\`\${e}()\\\` would let a consumer widen the set of codecs a pool accepts, and PowerPool validates against it.\`);
	},
	enumerable: !1,
	writable: !1,
	configurable: !1
});
const we = /* @__PURE__ */ new Map([[b.JSON, "json"], [b.RAW, "raw"]]), pe = /* @__PURE__ */ new Map([["json", b.JSON], ["raw", b.RAW]]);
function K() {
	return typeof structuredClone == "function";
}
function N(e) {
	return _(e) || typeof ArrayBuffer < "u" && ArrayBuffer.isView(e);
}
function Q(e) {
	return N(e) ? "raw" : "json";
}
function me(e, r = {}) {
	const t = r.codec || Q(e), n = pe.get(t);
	if (n === void 0) throw new TypeError(\`PowerMessageCodec: unknown codec "\${t}". Expected "json" or "raw". For structured-clone speed on a MessagePort/Worker use encodeNativeEnvelope() instead.\`);
	let i;
	if (n === b.RAW) {
		if (!N(e)) throw new TypeError("PowerMessageCodec: the \\"raw\\" codec requires an ArrayBuffer or a typed array");
		i = _(e) ? new Uint8Array(e) : new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
	} else i = Y(e);
	return U(n, i);
}
function U(e, r) {
	const t = new Uint8Array(6 + r.length);
	return t[0] = 1, t[1] = e, t[2] = r.length & 255, t[3] = r.length >>> 8 & 255, t[4] = r.length >>> 16 & 255, t[5] = r.length >>> 24 & 255, t.set(r, 6), t;
}
function Se(e) {
	if (typeof e == "string") return U(b.JSON, Y(null, e));
	if (!N(e)) throw new TypeError("PowerMessageCodec: frameEncodedJson() requires a Uint8Array or a JSON string");
	return U(b.JSON, P(e));
}
function L(e, r = 0) {
	return (e[r + 2] | e[r + 3] << 8 | e[r + 4] << 16 | e[r + 5] << 24) >>> 0;
}
function D(e, r = {}) {
	const t = r.strict !== !1, n = P(e);
	if (n.length < 6) throw new RangeError(\`PowerMessageCodec: frame is \${n.length} bytes, shorter than the 6-byte header\`);
	const i = n[0];
	if (t && i !== 1) throw new RangeError(\`PowerMessageCodec: unsupported protocol version \${i} (expected 1)\`);
	const o = we.get(n[1]);
	if (o === void 0) throw new RangeError(\`PowerMessageCodec: unknown codec id \${n[1]}\`);
	const s = L(n);
	if (n.length < 6 + s) throw new RangeError(\`PowerMessageCodec: frame declares a \${s}-byte payload but only \${n.length - 6} bytes are present (truncated frame)\`);
	const c = 6, u = c + s;
	return {
		version: i,
		codec: o,
		value: o === "raw" ? r.rawAsBytes === !0 ? n.subarray(c, u) : n.slice(c, u) : z(n.subarray(c, u)),
		byteLength: u
	};
}
function be(e) {
	if (e?.maxFrameBytes === void 0) throw new TypeError("PowerMessageCodec: createFrameDecoder() requires \`maxFrameBytes\`. A frame declares its own payload length, so a peer that sends a header and then stops would pin this buffer at whatever size it named. Pass \`Infinity\` to accept that risk explicitly.");
	const r = ge(e.maxFrameBytes, {
		name: "maxFrameBytes",
		className: "PowerMessageCodec.createFrameDecoder",
		min: 6,
		integer: !0,
		allowInfinity: !0
	}), t = e.strict !== !1, n = e.rawAsBytes === !0, i = 1024;
	let o = new Uint8Array(i), s = 0, c = 0;
	function u(d) {
		if (c + d <= o.length) return;
		const h = c - s;
		if (h + d <= o.length) o.copyWithin(0, s, c);
		else {
			let l = o.length || i;
			for (; l < h + d;) l *= 2;
			const w = new Uint8Array(l);
			w.set(o.subarray(s, c)), o = w;
		}
		s = 0, c = h;
	}
	return {
		/**
		* Feed the next chunk of the stream, and take every complete frame out of it.
		*
		* @param {Uint8Array|ArrayBuffer|DataView} chunk - Whatever the transport
		*   handed over. It is copied in, so the caller may reuse or transfer its
		*   buffer immediately.
		* @returns {Array<{version:number, codec:'json'|'raw', value:any, byteLength:number}>}
		*   The frames completed by this chunk — **every** one of them, not the
		*   first. Empty when the chunk held no complete frame, which includes the
		*   ordinary case of a chunk too short to hold a header yet.
		*/
		push(d) {
			const h = P(d);
			u(h.length), o.set(h, c), c += h.length;
			const l = [];
			for (; c - s >= 6;) {
				const w = L(o, s);
				if (6 + w > r) throw new RangeError(\`PowerMessageCodec: frame declares \${6 + w} bytes, over the maxFrameBytes limit of \${r}\`);
				if (c - s < 6 + w) break;
				const B = D(o.subarray(s, c), {
					strict: t,
					rawAsBytes: n
				});
				l.push(B), s += B.byteLength;
			}
			return s === c && (s = 0, c = 0), l;
		},
		/**
		* Report what is still buffered, for end-of-stream.
		*
		* @param {Object} [flushOptions]
		* @param {boolean} [flushOptions.strict=false] - Throw a \`RangeError\`
		*   naming the shortfall instead of returning the bytes.
		* @returns {Uint8Array} A **copy** of the unconsumed remainder, safe to
		*   keep after the decoder is reused or disposed. Zero-length means the
		*   stream ended on a frame boundary and nothing was lost.
		*/
		flush(d = {}) {
			const h = c - s;
			if (h > 0 && d.strict === !0) {
				const l = h < 6 ? null : L(o, s), w = l === null ? 6 : 6 + l;
				throw new RangeError(\`PowerMessageCodec: stream ended mid-frame — \${h} of \${w} bytes buffered\` + (l === null ? ", not even a whole header" : ""));
			}
			return o.slice(s, c);
		},
		/** Bytes currently held for an incomplete frame. */
		get pendingBytes() {
			return c - s;
		},
		/**
		* Drop any incomplete frame and start over, keeping the buffer for reuse.
		*
		* For a stream that has desynchronised and cannot be resynchronised: once a
		* frame is mis-parsed the length prefix is no longer trustworthy, so the
		* bytes after it cannot be framed either.
		*/
		reset() {
			s = 0, c = 0;
		},
		/**
		* Release the buffer.
		*
		* This is a **state reset**, not a cancellation: the decoder owns no timer,
		* no listener and no handle of any kind, only bytes. It is safe to keep
		* pushing afterwards — the next \`push\` allocates a fresh buffer — so a
		* \`using\` block that disposes early does not leave a dead object behind.
		*/
		dispose() {
			this.reset(), o = /* @__PURE__ */ new Uint8Array(0);
		},
		[Symbol.dispose]() {
			this.dispose();
		}
	};
}
function Ae(e) {
	if (!K()) throw new TypeError("PowerMessageCodec: structuredClone is unavailable in this runtime. Use encodeMessage() for a portable JSON frame instead.");
	const r = structuredClone(e);
	return {
		message: r,
		transfer: ee(r)
	};
}
function Ee(e) {
	if (typeof SharedArrayBuffer < "u" && e.buffer instanceof SharedArrayBuffer) return [];
	if (e.byteOffset !== 0 || e.byteLength !== e.buffer.byteLength) throw new RangeError(\`PowerMessageCodec: refusing to build a transfer list for a \${e.byteLength}-byte view at offset \${e.byteOffset} of a \${e.buffer.byteLength}-byte buffer — transferring \\\`frame.buffer\\\` would detach the whole buffer, including bytes outside this frame. Copy the view, or transfer the buffer it fills.\`);
	return [e.buffer];
}
const k = "__pp";
function X(e) {
	return e !== null && typeof e == "object" && e.__pp === 1 && e.kind === "envelope" && "value" in e;
}
function Me(e) {
	return e !== null && typeof e == "object" && e.__pp === 1 && e.kind === "capabilities" && Array.isArray(e.codecs);
}
function Oe(e, r = {}) {
	const t = {
		[k]: 1,
		kind: "envelope",
		value: e
	};
	return r.correlationId != null && (t.correlationId = String(r.correlationId)), t;
}
function Z(e = {}) {
	const r = Array.isArray(e.codecs) && e.codecs.length ? e.codecs.filter((t) => t === "json" || t === "native") : ["json", "native"];
	return {
		[k]: 1,
		kind: "capabilities",
		codecs: r.includes("json") ? r : ["json", ...r],
		protocol: 1
	};
}
function ee(e, r = 8) {
	const t = [], n = /* @__PURE__ */ new Set(), i = (o, s) => {
		if (!(!o || s > r)) {
			if (o instanceof ArrayBuffer) {
				n.has(o) || (n.add(o), t.push(o));
				return;
			}
			if (ArrayBuffer.isView(o)) {
				n.has(o.buffer) || (n.add(o.buffer), t.push(o.buffer));
				return;
			}
			if (typeof o == "object") for (const c of Object.keys(o)) i(o[c], s + 1);
		}
	};
	return i(e, 0), t;
}
function te(e) {
	if (X(e)) return {
		codec: "native",
		value: e.value,
		correlationId: e.correlationId
	};
	if (_(e) || ArrayBuffer.isView(e)) {
		const r = P(e);
		if (r.length >= 6 && r[0] === 1) {
			const t = D(r);
			return {
				codec: t.codec,
				value: t.value,
				correlationId: void 0
			};
		}
		if (!_e(r[0])) throw r[0] === 1 ? /* @__PURE__ */ new RangeError(\`PowerMessageCodec: truncated frame — \${r.length} byte(s) is shorter than the 6-byte header\`) : /* @__PURE__ */ new RangeError(\`PowerMessageCodec: unsupported protocol version \${r[0]} (expected 1)\`);
		return {
			codec: "legacy",
			value: z(r),
			correlationId: void 0
		};
	}
	return {
		codec: "raw",
		value: e,
		correlationId: void 0
	};
}
function _e(e) {
	return e === 32 || e === 9 || e === 10 || e === 13 ? !0 : e >= 32;
}
function P(e) {
	if (e instanceof Uint8Array) return e;
	if (_(e)) return new Uint8Array(e);
	if (typeof ArrayBuffer < "u" && ArrayBuffer.isView(e)) return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
	throw new TypeError("PowerMessageCodec: expected a Uint8Array, ArrayBuffer or DataView");
}
Object.freeze({
	MESSAGE_PROTOCOL_VERSION: 1,
	CODECS: b,
	MESSAGE_CODECS: G,
	HEADER_BYTES: 6,
	encodeMessage: me,
	decodeMessage: D,
	createFrameDecoder: be,
	frameEncodedJson: Se,
	encodeNative: Ae,
	canUseNativeClone: K,
	selectCodec: Q,
	isRawPayload: N,
	frameTransferList: Ee,
	NATIVE_ENVELOPE_KEY: k,
	NATIVE_PROTOCOL_VERSION: 1,
	isNativeEnvelope: X,
	isCapabilityAnnouncement: Me,
	encodeNativeEnvelope: Oe,
	announceCapabilities: Z,
	collectTransferables: ee,
	decodeInbound: te
});
try {
	typeof postMessage == "function" && postMessage(Z({ native: !0 }));
} catch {}
onmessage = async (e) => {
	const r = te(e.data), t = r.value, n = r.correlationId ?? t.correlationId, i = (s) => {
		n != null ? postMessage({
			correlationId: n,
			response: s
		}) : postMessage({
			id: t.id,
			result: s
		});
	}, o = (s) => {
		n != null ? postMessage({
			correlationId: n,
			response: { error: String(s) }
		}) : postMessage({
			id: t.id,
			error: String(s)
		});
	};
	try {
		if (t.type === "rewriteAnchors") {
			const { html: s, contentBase: c, pagePath: u, snapshot: d } = t;
			try {
				i(await le(s, c, u, d));
			} catch (h) {
				o(h);
			}
			return;
		}
	} catch (s) {
		o(s);
	}
};
`,pl=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",Dc],{type:"text/javascript;charset=utf-8"});function xp(e){let t;try{if(t=pl&&(self.URL||self.webkitURL).createObjectURL(pl),!t)throw"";const n=new Worker(t,{type:"module",name:e?.name});return n.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(t)}),n}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(Dc),{type:"module",name:e?.name})}}function $t(e,t=null){try{const n=typeof location<"u"&&location&&typeof location.pathname=="string"&&location.pathname||"/";return String(n)+So(e,t)}catch{return So(e,t)}}async function ys(e,t,n=4,r){if(!Array.isArray(e)||e.length===0)return[];const i=new Yl(Math.max(1,Number(n)||1));return Promise.all(e.map((a,o)=>i.run(()=>t(a,o),{signal:r})))}function Sp(...e){try{k(...e)}catch{}}function ni(e){try{if(Cl(3))return!0}catch{}try{if(typeof ke=="string"&&ke)return!0}catch{}try{if(ie?.size)return!0}catch{}try{if(Qe?.size)return!0}catch{}return!1}function Ep(e,t){try{return new URL(e,t).pathname}catch{try{return new URL(e,typeof location<"u"?location.href:"http://localhost/").pathname}catch{try{return(String(t??"").replace(/\/$/,"")+"/"+String(e??"").replace(/^\//,"")).replace(/\/\\+/g,"/")}catch{return String(e??"")}}}}function ri(e){try{const t=String(e??"");if(!t)return e;if(t.includes("/")||/\.(?:md|html?)$/i.test(t))return t;if(ie?.has?.(t)){const n=ie.get(t);if(typeof n=="string")return n;if(n&&typeof n=="object")return n.default||t}}catch{}return e}function Bc(e,t=2){try{const n=String(e??"").split("/").filter(Boolean);return n.length?n.slice(-Math.max(1,Math.min(t,n.length))).join("/"):""}catch{return String(e??"")}}function Uc(){try{if(typeof window>"u")return null;let e=null;if(Array.isArray(window.__nimbiResolvedIndex)?e=window.__nimbiResolvedIndex:Array.isArray(window.__nimbiSitemapFinal)?e=window.__nimbiSitemapFinal:window.__nimbiSitemapJson&&Array.isArray(window.__nimbiSitemapJson.entries)&&(e=window.__nimbiSitemapJson.entries),!Array.isArray(e))return null;const t=new Map;for(const n of e)try{if(!n||typeof n!="object")continue;let r=null;if(typeof n.path=="string")r=n.path;else if(typeof n.sourcePath=="string")r=n.sourcePath;else if(typeof n.loc=="string")try{const o=new URL(n.loc,location.href);r=String(o.pathname).replace(/^\//,"")}catch{r=n.loc}const i=typeof n.slug=="string"?n.slug:null;if(!r||!i)continue;t.has(r)||t.set(r,i);const a=String(r).replace(/^.*\//,"");a&&!t.has(a)&&t.set(a,i)}catch{continue}return t}catch{return null}}function Ga(e){if(!e)return null;try{if(_e?.has?.(e))return _e.get(e)}catch{}const t=String(e??"").replace(/^.*\//,"");try{if(t&&_e?.has?.(t))return _e.get(t)}catch{}const n=Uc();try{if(n?.has?.(e))return n.get(e);if(t&&n?.has?.(t))return n.get(t)}catch{}const r=Bc(e,2);try{for(const[i,a]of ie||[]){let o=null;if(typeof a=="string"?o=a:a&&typeof a=="object"&&(o=a.default||""),!!o&&(o===e||o===t||o.endsWith(`/${r}`)))return i}if(n){for(const[i,a]of n.entries())if(i===e||i===t||String(i).endsWith(`/${r}`))return a}}catch{}return null}function ii(e,t){try{if(!e)return e;if(!t)return String(e??"");const n=String(t??"").replace(/^\/+|\/+$/g,"");if(!n)return String(e??"");let r=String(e??"");r=r.replace(/^\/+/,"");const i=n+"/";for(;r.startsWith(i);)r=r.slice(i.length);return r===n?"":r}catch{return String(e??"")}}function Ap(e,t){const n=document.createElement("aside");n.className="menu box nimbi-nav",n.setAttribute("role","navigation");try{n.setAttribute("aria-label",e("navigation"))}catch{}const r=document.createElement("p");r.className="menu-label",r.textContent=e("navigation"),n.appendChild(r);const i=document.createElement("ul");i.className="menu-list";try{const a=document.createDocumentFragment();t.forEach(o=>{const s=document.createElement("li"),l=document.createElement("a");try{const c=String(o.path??"");try{l.setAttribute("href",je(c))}catch{c?.indexOf("/")===-1?l.setAttribute("href","#"+encodeURIComponent(c)):l.setAttribute("href",$t(c))}}catch{l.setAttribute("href","#"+o.path)}if(l.textContent=o.name,s.appendChild(l),o.children?.length){const c=document.createElement("ul");o.children.forEach(u=>{const f=document.createElement("li"),d=document.createElement("a");try{const p=String(u.path??"");try{d.setAttribute("href",je(p))}catch{p?.indexOf("/")===-1?d.setAttribute("href","#"+encodeURIComponent(p)):d.setAttribute("href",$t(p))}}catch{d.setAttribute("href","#"+u.path)}d.textContent=u.name,f.appendChild(d),c.appendChild(f)}),s.appendChild(c)}a.appendChild(s)}),i.appendChild(a)}catch{t.forEach(o=>{try{const s=document.createElement("li"),l=document.createElement("a");try{const c=String(o.path??"");try{l.setAttribute("href",je(c))}catch{c?.indexOf("/")===-1?l.setAttribute("href","#"+encodeURIComponent(c)):l.setAttribute("href",$t(c))}}catch{l.setAttribute("href","#"+o.path)}if(l.textContent=o.name,s.appendChild(l),o.children?.length){const c=document.createElement("ul");o.children.forEach(u=>{const f=document.createElement("li"),d=document.createElement("a");try{const p=String(u.path??"");try{d.setAttribute("href",je(p))}catch{p?.indexOf("/")===-1?d.setAttribute("href","#"+encodeURIComponent(p)):d.setAttribute("href",$t(p))}}catch{d.setAttribute("href","#"+u.path)}d.textContent=u.name,f.appendChild(d),c.appendChild(f)}),s.appendChild(c)}i.appendChild(s)}catch(s){k("[htmlBuilder] createNavTree item failed",s)}})}return n.appendChild(i),n}function Tp(e,t,n=""){const r=document.createElement("aside");r.className="menu box nimbi-toc-inner is-hidden-mobile";const i=document.createElement("p");i.className="menu-label",i.textContent=e("onThisPage"),r.appendChild(i);const a=document.createElement("ul");a.className="menu-list";try{const s={};(t||[]).forEach(l=>{try{if(!l||l.level===1)return;const c=Number(l.level)>=2?Number(l.level):2,u=document.createElement("li"),f=document.createElement("a"),d=hh(l.text||""),p=l.id||be(d);f.textContent=d;try{const h=String(n??"").replace(/^[\.\/]+/,""),_=h&&_e?.has?.(h)?_e.get(h):h;_?f.href=je(_,p):f.href=`#${encodeURIComponent(p)}`}catch(h){k("[htmlBuilder] buildTocElement href normalization failed",h),f.href=`#${encodeURIComponent(p)}`}if(u.appendChild(f),c===2){a.appendChild(u),s[2]=u,Object.keys(s).forEach(h=>{Number(h)>2&&delete s[h]});return}let m=c-1;for(;m>2&&!s[m];)m--;m<2&&(m=2);let g=s[m];if(!g){a.appendChild(u),s[c]=u;return}let y=g.querySelector("ul");y||(y=document.createElement("ul"),g.appendChild(y)),y.appendChild(u),s[c]=u}catch(c){k("[htmlBuilder] buildTocElement item failed",c,l)}})}catch(s){k("[htmlBuilder] buildTocElement failed",s)}const o=document.createElement("nav");try{o.setAttribute("aria-label",e("onThisPage"))}catch{}return o.appendChild(a),r.appendChild(o),a.querySelectorAll("li").length<=1?null:r}function Fc(e){e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(t=>{t.id||(t.id=be(t.textContent||""))})}function Mp(e,t,n){try{const r=e.querySelectorAll?.("img")||[];if(r?.length){const i=t?.includes("/")?t.substring(0,t.lastIndexOf("/")+1):"";r.forEach(a=>{const o=a.getAttribute("src")||"";if(o&&!(/^(https?:)?\/\//.test(o)||o.startsWith("/")))try{a.src=new URL(i+o,n).toString();try{a.getAttribute("loading")||a.setAttribute("data-want-lazy","1")}catch(s){k("[htmlBuilder] set image loading attribute failed",s)}}catch(s){k("[htmlBuilder] resolve image src failed",s)}})}}catch(r){k("[htmlBuilder] lazyLoadImages failed",r)}}function ml(e,t,n){try{t=ri(t),t=ri(t);const r=t?.includes("/")?t.substring(0,t.lastIndexOf("/")+1):"";let i=null;try{const s=new URL(n,location.href);i=new URL(r||".",s).toString()}catch{try{i=new URL(r||".",location.href).toString()}catch{i=r||"./"}}let a=null;try{a=e.querySelectorAll("[src],[href],[srcset],[poster]")}catch{const l=[];try{l.push(...Array.from(e.getElementsByTagName("img")||[]))}catch{}try{l.push(...Array.from(e.getElementsByTagName("link")||[]))}catch{}try{l.push(...Array.from(e.getElementsByTagName("video")||[]))}catch{}try{l.push(...Array.from(e.getElementsByTagName("use")||[]))}catch{}try{l.push(...Array.from(e.querySelectorAll("[srcset]")||[]))}catch{}a=l}let o=Array.from(a||[]);try{const s=Array.from(e.getElementsByTagName("use")||[]);for(const l of s)o.indexOf(l)===-1&&o.push(l)}catch{}for(const s of Array.from(o||[]))try{const l=s.tagName?s.tagName.toLowerCase():"",c=u=>{try{const f=s.getAttribute(u)||"";if(!f||/^(https?:)?\/\//i.test(f)||f.startsWith("/")||f.startsWith("#"))return;try{s.setAttribute(u,new URL(f,i).toString())}catch(d){k("[htmlBuilder] rewrite asset attribute failed",u,f,d)}}catch(f){k("[htmlBuilder] rewriteAttr failed",f)}};if(s.hasAttribute?.("src")&&c("src"),s.hasAttribute?.("href")&&l!=="a"&&c("href"),s.hasAttribute?.("xlink:href")&&c("xlink:href"),s.hasAttribute?.("poster")&&c("poster"),s.hasAttribute?.("srcset")){const u=(s.getAttribute("srcset")||"").split(",").map(f=>f.trim()).filter(Boolean).map(f=>{const[d,p]=f.split(/\s+/,2);if(!d||/^(https?:)?\/\//i.test(d)||d.startsWith("/"))return f;try{const m=new URL(d,i).toString();return p?`${m} ${p}`:m}catch{return f}}).join(", ");s.setAttribute("srcset",u)}}catch(l){k("[htmlBuilder] rewriteRelativeAssets node processing failed",l)}}catch(r){k("[htmlBuilder] rewriteRelativeAssets failed",r)}}var gl="",Va=null,yl="";async function Wc(e,t,n,r={}){try{n=ri(n),r=r||{},r.canonical=r.canonical!==!1;const i=e.querySelectorAll?.("a")||[];if(!i.length)return;let a,o;if(t===gl&&Va)a=Va,o=yl;else{try{a=new URL(t,location.href),o=Rn(a.pathname)}catch{try{a=new URL(t,location.href),o=Rn(a.pathname)}catch{a=null,o="/"}}gl=t,Va=a,yl=o}const s=new Set,l=[],c=new Set,u=[];for(const f of Array.from(i))try{try{if(f?.closest?.("h1,h2,h3,h4,h5,h6"))continue}catch{}const d=f.getAttribute?.("href")||"";if(!d)continue;if(Xi(d)){try{f.setAttribute("rel","noopener noreferrer nofollow")}catch{}continue}try{if(d.startsWith("?")||d.indexOf("?")!==-1)try{const m=new URL(d,t||location.href),g=m.searchParams.get("page");if(g&&g.indexOf("/")===-1&&n){const y=n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"";if(y){const h=se(y+g),_=r?.canonical?je(h,m.hash?m.hash.replace(/^#/,""):null):$t(h,m.hash?m.hash.replace(/^#/,""):null);f.setAttribute("href",_);continue}}}catch{}}catch{}if(d.startsWith("/")&&!d.endsWith(".md"))continue;const p=d.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(p){let m=p[1];const g=p[2];!m.startsWith("/")&&n&&(m=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+m);try{const y=new URL(m,t).pathname;let h=y.startsWith(o)?y.slice(o.length):y;h=ii(h,o),h=se(h),l.push({node:f,mdPathRaw:m,frag:g,rel:h}),_e?.has?.(h)||s.add(h)}catch(y){k("[htmlBuilder] resolve mdPath failed",y)}continue}try{let m=d;!d.startsWith("/")&&n&&(d.startsWith("#")?m=n+d:m=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+d);const g=new URL(m,t).pathname||"";if(g&&g.indexOf(o)!==-1){let y=g.startsWith(o)?g.slice(o.length):g;if(y=ii(y,o),y=se(y),y=Zn(y),y||(y=en),!y.endsWith(".md")){const h=Ga(y);if(h){const _=r?.canonical?je(h,null):$t(h);f.setAttribute("href",_)}else{let _=y;try{/\.[^\/]+$/.test(String(y??""))||(_=String(y??"")+".html")}catch{_=y}c.add(_),u.push({node:f,rel:_})}}}}catch(m){k("[htmlBuilder] resolving href to URL failed",m)}}catch(d){k("[htmlBuilder] processing anchor failed",d)}if(s.size)if(!ni(t)||r?.allowProbe===!1){try{k("[htmlBuilder] skipping md title probes (probing disabled)")}catch{}for(const f of Array.from(s))try{const d=String(f).match(/([^\/]+)\.md$/),p=d&&d[1];if(p){const m=be(p);if(m)try{ft(m,f)}catch(g){k("[htmlBuilder] setting fallback slug mapping failed",g)}}}catch{}}else await ys(Array.from(s),async f=>{try{try{const p=String(f).match(/([^\/]+)\.md$/),m=p&&p[1];if(m&&ie.has(m)){try{const g=ie.get(m);if(g)try{const y=typeof g=="string"?g:g?.default?g.default:null;y&&ft(m,y)}catch(y){k("[htmlBuilder] _storeSlugMapping failed",y)}}catch(g){k("[htmlBuilder] reading slugToMd failed",g)}return}}catch(p){k("[htmlBuilder] basename slug lookup failed",p)}const d=await Xe(f,t);if(d?.raw){const p=(d.raw||"").match(/^#\s+(.+)$/m);if(p&&p[1]){const m=be(p[1].trim());if(m)try{ft(m,f)}catch(g){k("[htmlBuilder] setting slug mapping failed",g)}}}}catch(d){k("[htmlBuilder] fetchMarkdown during rewriteAnchors failed",d)}},6);if(c.size)if(!ni(t)||r?.allowProbe===!1){try{k("[htmlBuilder] skipping html title probes (probing disabled)")}catch{}for(const f of Array.from(c))try{const d=String(f).match(/([^\/]+)\.html$/),p=d&&d[1];if(p){const m=be(p);if(m)try{ft(m,f)}catch(g){k("[htmlBuilder] setting fallback html slug mapping failed",g)}}}catch{}}else await ys(Array.from(c),async f=>{try{const d=await Xe(f,t);if(d&&d.raw)try{const p=at(),m=p?p.parseFromString(d.raw,"text/html"):null,g=m?m.querySelector("title"):null,y=m?m.querySelector("h1"):null,h=g&&g.textContent&&g.textContent.trim()?g.textContent.trim():y&&y.textContent?y.textContent.trim():null;if(h){const _=be(h);if(_)try{ft(_,f)}catch(w){k("[htmlBuilder] setting html slug mapping failed",w)}}}catch(p){k("[htmlBuilder] parse fetched HTML failed",p)}}catch(d){k("[htmlBuilder] fetchMarkdown for htmlPending failed",d)}},5);for(const f of l){const{node:d,frag:p,rel:m}=f;let g=Ga(m);if(g){const y=r?.canonical?je(g,p):$t(g,p);d.setAttribute("href",y)}else{const y=r?.canonical?je(m,p):$t(m,p);d.setAttribute("href",y)}}for(const f of u){const{node:d,rel:p}=f;let m=Ga(p);if(!m)try{const g=String(p??"").replace(/^.*\//,"");_e?.has?.(g)&&(m=_e?.get?.(g))}catch(g){k("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo",g)}if(m){const g=r?.canonical?je(m,null):$t(m);d.setAttribute("href",g)}else{const g=r?.canonical?je(p,null):$t(p);d.setAttribute("href",g)}}}catch(i){k("[htmlBuilder] rewriteAnchors failed",i)}}function Cp(e,t,n,r){const i=t.querySelector("h1"),a=i?(i.textContent||"").trim():"";let o="";try{let s="";try{e&&e.meta&&e.meta.title&&(s=String(e.meta.title).trim())}catch{}if(!s&&a&&(s=a),!s)try{const l=t.querySelector("h2");l&&l.textContent&&(s=String(l.textContent).trim())}catch{}!s&&n&&(s=String(n)),s&&(o=be(s)),o||(o=en);try{if(n){try{ft(o,n)}catch(l){k("[htmlBuilder] computeSlug set slug mapping failed",l)}try{const l=se(String(n??""));if(_e?.has?.(l))o=_e.get(l);else try{for(const[c,u]of ie||[])try{const f=typeof u=="string"?u:u?.default?u.default:null;if(f&&se(String(f))===l){o=c;break}}catch{}}catch{}}catch{}}}catch(l){k("[htmlBuilder] computeSlug set slug mapping failed",l)}try{let l=r||"";if(!l)try{const c=yt(typeof location<"u"?location.href:"");c?.anchor&&c?.page&&String(c.page)===String(o)?l=c.anchor:l=""}catch{l=""}try{history.replaceState({page:o},"",$t(o,l))}catch(c){k("[htmlBuilder] computeSlug history replace failed",c)}}catch(l){k("[htmlBuilder] computeSlug inner failed",l)}}catch(s){k("[htmlBuilder] computeSlug failed",s)}try{if(e?.meta?.title&&i){const s=String(e.meta.title).trim();if(s&&s!==a){try{o&&(i.id=o)}catch{}try{if(Array.isArray(e.toc))for(const l of e.toc)try{if(l&&Number(l.level)===1&&String(l.text).trim()===(a||"").trim()){l.id=o;break}}catch{}}catch{}}}}catch{}return{topH1:i,h1Text:a,slugKey:o}}async function Rp(e,t,n={}){if(!e||!e.length)return;const r=new Set;for(const o of Array.from(e||[]))try{const s=o.getAttribute("href")||"";if(!s)continue;let l=se(s).split(/::|#/,2)[0];try{const u=l.indexOf("?");u!==-1&&(l=l.slice(0,u))}catch{}if(!l||(l.includes(".")||(l=l+".html"),!/\.html(?:$|[?#])/.test(l)&&!l.toLowerCase().endsWith(".html")))continue;const c=l;try{if(_e?.has?.(c))continue}catch(u){k("[htmlBuilder] mdToSlug check failed",u)}try{let u=!1;for(const f of ie.values())if(f===c){u=!0;break}if(u)continue}catch(u){k("[htmlBuilder] slugToMd iteration failed",u)}r.add(c)}catch(s){k("[htmlBuilder] preScanHtmlSlugs anchor iteration failed",s)}if(!r.size)return;if(!ni(t)||n?.allowProbe===!1){try{k("[htmlBuilder] skipping preScanHtmlSlugs (probing disabled)")}catch{}for(const o of Array.from(r))try{const s=String(o).match(/([^\/]+)\.html$/),l=s&&s[1];if(l){const c=be(l);if(c)try{ft(c,o)}catch(u){k("[htmlBuilder] setting fallback preScanHtmlSlugs mapping failed",u)}}}catch{}return}const i=async o=>{try{const s=await Xe(o,t);if(s&&s.raw)try{const l=at().parseFromString(s.raw,"text/html"),c=l.querySelector("title"),u=l.querySelector("h1"),f=c?.textContent&&c.textContent.trim()?c.textContent.trim():u?.textContent?u.textContent.trim():null;if(f){const d=be(f);if(d)try{ft(d,o)}catch(p){k("[htmlBuilder] set slugToMd/mdToSlug failed",p)}}}catch(l){k("[htmlBuilder] parse HTML title failed",l)}}catch(s){k("[htmlBuilder] fetchAndExtract failed",s)}},a=Array.from(r);await ys(a,i,Math.max(1,Math.min(Vr(),a.length||1)))}async function Lp(e,t,n={}){if(!e||!e.length)return;const r=[],i=new Set;let a="";try{const o=new URL(t,typeof location<"u"?location.href:"http://localhost/");a=Rn(o.pathname)}catch(o){a="",k("[htmlBuilder] preMapMdSlugs parse base failed",o)}for(const o of Array.from(e||[]))try{const s=o.getAttribute("href")||"";if(!s)continue;const l=s.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(l){let c=se(l[1]);try{let u;try{u=Ep(c,t)}catch(d){u=c,k("[htmlBuilder] resolve mdPath URL failed",d)}let f=u&&a&&u.startsWith(a)?u.slice(a.length):String(u??"").replace(/^\//,"");f=ii(f,a),r.push({rel:f}),_e?.has?.(f)||i.add(f)}catch(u){k("[htmlBuilder] rewriteAnchors failed",u)}continue}}catch(s){k("[htmlBuilder] preMapMdSlugs anchor iteration failed",s)}if(i.size){if(!ni(t)||n?.allowProbe===!1){try{k("[htmlBuilder] skipping preMapMdSlugs probes (probing disabled)")}catch{}for(const o of Array.from(i))try{const s=String(o).match(/([^\/]+)\.md$/),l=s&&s[1];if(l){const c=be(l);if(c)try{ft(c,o)}catch(u){k("[htmlBuilder] setting fallback preMapMdSlugs mapping failed",u)}}}catch{}return}await Promise.all(Array.from(i).map(async o=>{try{const s=String(o).match(/([^\/]+)\.md$/),l=s&&s[1];if(l&&ie.has(l)){try{const c=ie.get(l);if(c)try{const u=typeof c=="string"?c:c?.default?c.default:null;u&&ft(l,u)}catch(u){k("[htmlBuilder] _storeSlugMapping failed",u)}}catch(c){k("[htmlBuilder] preMapMdSlugs slug map access failed",c)}return}}catch(s){k("[htmlBuilder] preMapMdSlugs basename check failed",s)}try{const s=await Xe(o,t);if(s&&s.raw){const l=(s.raw||"").match(/^#\s+(.+)$/m);if(l&&l[1]){const c=be(l[1].trim());if(c)try{ft(c,o)}catch(u){k("[htmlBuilder] preMapMdSlugs setting slug mapping failed",u)}}}}catch(s){k("[htmlBuilder] preMapMdSlugs fetch failed",s)}}))}}function Za(e){try{const t=at().parseFromString(e||"","text/html");Fc(t);try{t.querySelectorAll("img").forEach(i=>{try{i.getAttribute("loading")||i.setAttribute("data-want-lazy","1")}catch(a){k("[htmlBuilder] parseHtml set image loading attribute failed",a)}})}catch(i){k("[htmlBuilder] parseHtml query images failed",i)}t.querySelectorAll("pre code, code[class]").forEach(i=>{try{const a=i.getAttribute?.("class")||i.className||"",o=a.match(/language-([a-zA-Z0-9_+-]+)/)||a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(o&&o[1]){const s=(o[1]||"").toLowerCase(),l=ze.size&&(ze.get(s)||ze.get(String(s).toLowerCase()))||s;try{(async()=>{try{await fr(l)}catch(c){k("[htmlBuilder] registerLanguage failed",c)}})()}catch(c){k("[htmlBuilder] schedule registerLanguage failed",c)}}else try{if(Ye&&typeof Ye.getLanguage=="function"&&Ye.getLanguage("plaintext")){const s=Ye.highlight?Ye.highlight(i.textContent||"",{language:"plaintext"}):null;if(s&&s.value)try{if(typeof document<"u"&&document.createRange&&typeof document.createRange=="function"){const l=document.createRange().createContextualFragment(s.value);if(typeof i.replaceChildren=="function")i.replaceChildren(...Array.from(l.childNodes));else{for(;i.firstChild;)i.removeChild(i.firstChild);i.appendChild(l)}}else i.innerHTML=s.value}catch{try{i.innerHTML=s.value}catch{}}}}catch(s){k("[htmlBuilder] plaintext highlight fallback failed",s)}}catch(a){k("[htmlBuilder] code element processing failed",a)}});const n=[];t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(i=>{n.push({level:Number(i.tagName.substring(1)),text:(i.textContent||"").trim(),id:i.id})});const r={};try{const i=t.querySelector("title");i?.textContent&&String(i.textContent).trim()&&(r.title=String(i.textContent).trim())}catch{}return{html:t.body.innerHTML,meta:r,toc:n}}catch(t){return k("[htmlBuilder] parseHtml failed",t),{html:e||"",meta:{},toc:[]}}}async function jc(e){const t=gs?await gs(e||"",ze):ua(e||"",ze),n=new Set(t),r=[];for(const i of n)try{const a=ze.size&&(ze.get(i)||ze.get(String(i).toLowerCase()))||i;try{r.push(fr(a))}catch(o){k("[htmlBuilder] ensureLanguages push canonical failed",o)}if(String(i)!==String(a))try{r.push(fr(i))}catch(o){k("[htmlBuilder] ensureLanguages push alias failed",o)}}catch(a){k("[htmlBuilder] ensureLanguages inner failed",a)}try{await Promise.all(r)}catch(i){k("[htmlBuilder] ensureLanguages failed",i)}}async function Pp(e){if(await jc(e),pr){const t=await pr(e||"");return!t||typeof t!="object"?{html:String(e??""),meta:{},toc:[]}:(Array.isArray(t.toc)||(t.toc=[]),t.meta||(t.meta={}),t)}return{html:String(e??""),meta:{},toc:[]}}async function Np(e,t,n,r,i){let a=null,o=null;if(t.isHtml)try{const d=at();if(d){const p=d.parseFromString(t.raw||"","text/html");try{ml(p.body,n,i)}catch(m){k("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)",m)}a=Za(p.documentElement?.outerHTML?p.documentElement.outerHTML:t?.raw||"")}else a=Za(t.raw||"")}catch{a=Za(t.raw||"")}else{const d=t.raw||"",p=65536;if(d&&d.length>p&&ms){try{await jc(d)}catch{}o=document.createElement("article"),o.id="main",o.className="nimbi-article content",o.setAttribute("itemscope",""),o.setAttribute("itemtype","https://schema.org/Article");const m=[];let g={};try{await ms(d,(y,h)=>{try{h&&h.meta&&(g=Object.assign(g,h.meta))}catch{}try{h&&Array.isArray(h.toc)&&h.toc.length&&m.push(...h.toc)}catch{}try{Vi(()=>{try{const _=at();if(_){const w=_.parseFromString(String(y??""),"text/html"),b=Array.from(w.body.childNodes||[]);b.length?o.append(...b):o.insertAdjacentHTML("beforeend",y||"")}else{const w=document&&typeof document.createRange=="function"?document.createRange():null;if(w&&typeof w.createContextualFragment=="function"){const b=w.createContextualFragment(String(y??""));o.append(...Array.from(b.childNodes))}else o.insertAdjacentHTML("beforeend",y||"")}}catch{try{o.insertAdjacentHTML("beforeend",y||"")}catch{}}})}catch{}},{chunkSize:p})}catch(y){k("[htmlBuilder] streamParseMarkdown failed, falling back",y)}a={html:o.innerHTML,meta:g||{},toc:m}}else a=await Pp(t.raw||"")}let s;if(o)s=o;else{s=document.createElement("article"),s.id="main",s.className="nimbi-article content",s.setAttribute("itemscope",""),s.setAttribute("itemtype","https://schema.org/Article");try{const d=at&&at();if(d){const p=d.parseFromString(String(a.html??""),"text/html"),m=Array.from(p.body.childNodes||[]);m.length?s.replaceChildren(...m):s.innerHTML=a.html}else try{const p=document&&typeof document.createRange=="function"?document.createRange():null;if(p&&typeof p.createContextualFragment=="function"){const m=p.createContextualFragment(String(a.html??""));s.replaceChildren(...Array.from(m.childNodes))}else s.innerHTML=a.html}catch{s.innerHTML=a.html}}catch{try{s.innerHTML=a.html}catch(p){k("[htmlBuilder] set article html failed",p)}}}try{ml(s,n,i)}catch(d){k("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle",d)}try{Fc(s)}catch(d){k("[htmlBuilder] addHeadingIds failed",d)}try{s.querySelectorAll("pre code, code[class]").forEach(d=>{try{const p=d.getAttribute?.("class")||d.className||"",m=String(p??"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(m)try{d.setAttribute?.("class",m)}catch(g){d.className=m,k("[htmlBuilder] set element class failed",g)}else try{d.removeAttribute?.("class")}catch(g){d.className="",k("[htmlBuilder] remove element class failed",g)}}catch(p){k("[htmlBuilder] code element cleanup failed",p)}})}catch(d){k("[htmlBuilder] processing code elements failed",d)}Mp(s,n,i);try{(s.querySelectorAll?.("img")||[]).forEach(d=>{try{const p=d.parentElement;if(!p||p.tagName.toLowerCase()!=="p"||p.childNodes.length!==1)return;const m=document.createElement("figure");m.className="image",p.replaceWith(m),m.appendChild(d)}catch{}})}catch(d){k("[htmlBuilder] wrap images in Bulma image helper failed",d)}try{(s.querySelectorAll?.("table")||[]).forEach(d=>{try{if(d.classList)d.classList.contains("table")||d.classList.add("table");else{const p=d.getAttribute?.("class")||"",m=String(p??"").split(/\s+/).filter(Boolean);m.indexOf("table")===-1&&m.push("table");try{d.setAttribute?.("class",m.join(" "))}catch{d.className=m.join(" ")}}}catch{}})}catch(d){k("[htmlBuilder] add Bulma table class failed",d)}const{topH1:l,h1Text:c,slugKey:u}=Cp(a,s,n,r);try{if(l&&(a?.meta?.author||a?.meta?.date)&&!l.parentElement?.querySelector?.(".nimbi-article-subtitle")){const d=a.meta.author?String(a.meta.author).trim():"",p=a.meta.date?String(a.meta.date).trim():"";let m="";try{const y=new Date(p);p&&!isNaN(y.getTime())?m=y.toLocaleDateString():m=p}catch{m=p}const g=[];if(d&&g.push(d),m&&g.push(m),g.length){const y=document.createElement("p"),h=g[0]?String(g[0]).replace(/"/g,"").trim():"",_=g.slice(1);if(y.className="nimbi-article-subtitle is-6 has-text-grey-light",h){const w=document.createElement("span");w.className="nimbi-article-author",w.textContent=h,y.appendChild(w)}if(_.length){const w=document.createElement("span");w.className="nimbi-article-meta",w.textContent=_.join(" • "),y.appendChild(w)}try{l.parentElement.insertBefore(y,l.nextSibling)}catch{try{l.insertAdjacentElement("afterend",y)}catch{}}}}}catch{}try{if(l&&l.parentElement&&l.parentElement.tagName!=="HEADER"){const d=l.parentElement,p=document.createElement("header");p.className="nimbi-article-header",d.insertBefore(p,l),p.appendChild(l);const m=p.nextElementSibling;if(m&&m.classList?.contains("nimbi-article-subtitle")){const g=document.createElement("footer");g.className="nimbi-article-footer",p.insertAdjacentElement("afterend",g),g.appendChild(m)}}}catch{}try{await Up(s,i,n)}catch(d){Sp("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread",d),await Wc(s,i,n)}const f=Tp(e,a.toc,n);return{article:s,parsed:a,toc:f,topH1:l,h1Text:c,slugKey:u}}function Ip(e,t=!1){if(!(!e||!e.querySelectorAll))try{const n=Array.from(e.querySelectorAll("script"));if(!t){for(const r of n)try{r.parentNode?.removeChild(r)}catch{}return}for(const r of n)try{const i=document.createElement("script"),a=new Set(["src","type","async","defer","crossorigin","integrity","nomodule","referrerpolicy","id","class","nonce"]);for(const s of r.attributes)try{a.has(s.name)&&i.setAttribute(s.name,s.value)}catch{}if(i.hasAttribute("nonce")||Cs(i),!r.src){const s=r.textContent||"";let l=!1;try{new Function(s)(),l=!0}catch{l=!1}if(l){r.parentNode?.removeChild(r);try{kn("[htmlBuilder] executed inline script via Function")}catch{}try{(document.head||document.body||document.documentElement).appendChild(i)}catch{try{try{i.type="text/javascript"}catch{}(document.head||document.body||document.documentElement).appendChild(i)}catch(u){try{k("[htmlBuilder] injected script append failed, skipping",{src:o,err:u})}catch{}}}continue}try{i.type="module"}catch{}i.textContent=s}if(r.src)try{if(document.querySelector?.(`script[src="${r.src}"]`)){r.parentNode?.removeChild(r);continue}}catch{}const o=r.src||"<inline>";i.addEventListener("error",s=>{try{k("[htmlBuilder] injected script error",{src:o,ev:s})}catch{}}),i.addEventListener("load",()=>{try{kn("[htmlBuilder] injected script loaded",{src:o,hasNimbi:!!(window&&window.nimbiCMS)})}catch{}});try{(document.head||document.body||document.documentElement).appendChild(i)}catch{try{try{i.type="text/javascript"}catch{}(document.head||document.body||document.documentElement).appendChild(i)}catch(l){try{k("[htmlBuilder] injected script append failed, skipping",{src:o,err:l})}catch{}}}r.parentNode?.removeChild(r);try{kn("[htmlBuilder] executed injected script",o)}catch{}}catch(i){k("[htmlBuilder] execute injected script failed",i)}}catch{}}function _l(e,t,n){if(e)try{typeof e.replaceChildren=="function"?e.replaceChildren():e.innerHTML=""}catch{try{e.innerHTML=""}catch{}}const r=document.createElement("article");r.className="nimbi-article content nimbi-not-found",r.setAttribute("aria-live","polite");const i=document.createElement("h1");i.textContent=t&&t("notFound")||"Page not found";const a=document.createElement("p");a.textContent=n?.message?String(n.message):"Failed to resolve the requested page.",r.appendChild(i),r.appendChild(a),e&&e.appendChild&&e.appendChild(r);try{if(!ke)try{const o=document.createElement("p");o.textContent=(t&&t("goHome")||"Go back to")+" ";const s=document.createElement("a");try{s.href=je(At)}catch{s.href=je(At||"")}s.textContent=t&&t("home")||"Home",o.appendChild(s),e&&e.appendChild&&e.appendChild(o)}catch{}}catch{}try{try{Gi({title:t&&t("notFound")||"Not Found",description:t&&t("notFoundDescription")||""},ke,t&&t("notFound")||"Not Found",t&&t("notFoundDescription")||"")}catch{}}catch{}try{try{const o=typeof window<"u"&&window.__nimbiNotFoundRedirect?String(window.__nimbiNotFoundRedirect).trim():null;if(o)try{const s=new URL(o,location.origin).toString();if((location.href||"").split("#")[0]!==s)try{location.replace(s)}catch{location.href=s}}catch{}}catch{}}catch{}}var Op={intervalMs:500,targetMs:80,hysteresis:.25,cooldownMs:600,stepUp:1,stepDown:1},qc=(()=>{const e={size:2,minSize:2,autoScale:Op,messageCodec:"negotiated",maxQueueLength:100};try{e.debugLevel=0}catch{}try{return new $s(xp,e)}catch{return{workers:[],postMessage:async()=>{throw new Error("anchor worker unavailable")}}}})();function zp(e){if(!e)return null;try{if(_e?.has?.(e))return _e.get(e)}catch{}try{const r=String(e).replace(/^.*\//,"");if(r&&_e?.has?.(r))return _e.get(r)}catch{}const t=Uc();try{if(t?.has?.(e))return t.get(e);const r=String(e).replace(/^.*\//,"");if(r&&t?.has?.(r))return t.get(r)}catch{}const n=Bc(e,2);try{for(const[r,i]of ie||[]){if(i===e)return r;const a=String(e).replace(/^.*\//,"");if(i===a)return r;if(typeof i=="string"){if(i.endsWith(`/${n}`))return r}else if(i&&typeof i=="object"){if(i.default===e||i.default===a||i.default&&i.default.endsWith(`/${n}`))return r;const o=i.langs&&typeof i.langs=="object"?Object.values(i.langs):[];if(o.includes(e)||o.includes(a))return r;for(const s of o)if(typeof s=="string"&&s.endsWith(`/${n}`))return r}}if(t)for(const[r,i]of t.entries()){const a=String(e).replace(/^.*\//,"");if(r===e||r===a||String(r).endsWith(`/${n}`))return i}}catch{}return null}function $p(e,t,n){n=ri(n);const r=new Set;let i="/";try{const o=new URL(t,location.href);i=Rn(o.pathname)}catch{}try{const o=Array.from(e?.querySelectorAll?.("a")||[]);for(const s of o)try{try{if(s?.closest?.("h1,h2,h3,h4,h5,h6"))continue}catch{}const l=s.getAttribute?.("href")||"";if(!l||Xi(l)||l.startsWith("/")&&!l.endsWith(".md"))continue;const c=l.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(c){let p=c[1];!p.startsWith("/")&&n&&(p=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+p);const m=new URL(p,t).pathname;let g=m.startsWith(i)?m.slice(i.length):m;g=se(ii(g,i)),r.add(g),r.add(String(g).replace(/^.*\//,""));continue}let u=l;!l.startsWith("/")&&n&&(l.startsWith("#")?u=n+l:u=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+l);const f=new URL(u,t).pathname||"";if(!f||f.indexOf(i)===-1)continue;let d=f.startsWith(i)?f.slice(i.length):f;d=se(ii(d,i)),d=Zn(d),d||(d=en),r.add(d),r.add(String(d).replace(/^.*\//,"")),/\.[^/]+$/.test(String(d??""))||(r.add(d+".html"),r.add((d+".html").replace(/^.*\//,"")))}catch{}}catch{}const a={};for(const o of r){const s=zp(o);s&&(a[o]=s)}return{allowProbe:ni(t),homeSlug:en,pathToSlug:a}}function Dp(){return qc.workers?.[0]?.worker?._underlying??null}function Bp(e){return qc.postMessage(e,void 0,{awaitResponse:!0,timeout:2e3}).then(t=>{if(t&&typeof t=="object"&&t.error)throw new Error(t.error);return t}).catch(t=>{throw(t?.message||"").includes("postMessage response timeout")?new Error("worker timeout"):t})}async function Up(e,t,n){if(!Dp())throw new Error("anchor worker unavailable");if(!e||typeof e.innerHTML!="string")throw new Error("invalid article element");n=ri(n);const r=String(e.innerHTML),i=$p(e,t,n),a=await Bp({type:"rewriteAnchors",html:r,contentBase:t,pagePath:n,snapshot:i}),o=a&&typeof a=="object"&&typeof a.html=="string"?a.html:a;if(a&&typeof a=="object"&&Array.isArray(a.mappings))for(const l of a.mappings)try{l&&l.slug&&l.path&&ft(l.slug,l.path)}catch(c){k("[htmlBuilder] storing worker anchor mapping failed",c)}let s=!1;if(typeof o=="string")try{const l=String(o??"").includes(".md");String(r??"").includes(".md")&&l&&(s=!0);const c=at&&at();if(c){const u=c.parseFromString(String(o??""),"text/html"),f=Array.from(u.body.childNodes||[]);f.length?e.replaceChildren(...f):e.innerHTML=o}else try{const u=document&&typeof document.createRange=="function"?document.createRange():null;if(u&&typeof u.createContextualFragment=="function"){const f=u.createContextualFragment(String(o??""));e.replaceChildren(...Array.from(f.childNodes))}else e.innerHTML=o}catch{e.innerHTML=o}}catch(l){k("[htmlBuilder] applying rewritten anchors failed",l),s=!0}if(s)try{await Wc(e,t,n)}catch(l){k("[htmlBuilder] main-thread fallback after worker rewrite failed",l)}}function Fp(e){try{e.addEventListener("click",t=>{const n=t.target?.closest?.("a")||null;if(!n)return;const r=n.getAttribute?.("href")||"";try{const i=yt(r),a=i?.page??null,o=i?.anchor??null;if(!a&&!o)return;t.preventDefault();let s=null;try{history?.state?.page&&(s=history.state.page)}catch(l){s=null,k("[htmlBuilder] access history.state failed",l)}try{s||(s=new URL(location.href).searchParams.get("page"))}catch(l){k("[htmlBuilder] parse current location failed",l)}if(!a&&o||a&&s&&String(a)===String(s)){try{if(!a&&o)try{history.replaceState(history.state,"",(location.pathname||"")+(location.search||"")+(o?"#"+encodeURIComponent(o):""))}catch(l){k("[htmlBuilder] history.replaceState failed",l)}else try{history.replaceState({page:s||a},"",$t(s||a,o))}catch(l){k("[htmlBuilder] history.replaceState failed",l)}}catch(l){k("[htmlBuilder] update history for anchor failed",l)}try{t.stopImmediatePropagation&&t.stopImmediatePropagation(),t.stopPropagation&&t.stopPropagation()}catch(l){k("[htmlBuilder] stopPropagation failed",l)}try{_s(o)}catch(l){k("[htmlBuilder] scrollToAnchorOrTop failed",l)}return}history.pushState({page:a},"",$t(a,o));try{if(typeof window<"u"&&typeof window.renderByQuery=="function")try{const l=window.renderByQuery();l&&typeof l.catch=="function"&&l.catch(()=>{})}catch(l){k("[htmlBuilder] window.renderByQuery failed",l)}else if(typeof window<"u")try{window.dispatchEvent(new PopStateEvent("popstate"))}catch(l){k("[htmlBuilder] dispatch popstate failed",l)}else try{const l=renderByQuery();l&&typeof l.catch=="function"&&l.catch(()=>{})}catch(l){k("[htmlBuilder] renderByQuery failed",l)}}catch(l){k("[htmlBuilder] SPA navigation invocation failed",l)}}catch(i){k("[htmlBuilder] non-URL href in attachTocClickHandler",i)}})}catch(t){k("[htmlBuilder] attachTocClickHandler failed",t)}}function _s(e){const t=document.querySelector(".nimbi-cms")||null;if(e){const n=document.getElementById(e);if(n)try{const r=()=>{try{if(t&&t.scrollTo&&t.contains(n)){const i=n.getBoundingClientRect().top-t.getBoundingClientRect().top+t.scrollTop;t.scrollTo({top:i,behavior:"smooth"})}else try{n.scrollIntoView({behavior:"smooth",block:"start"})}catch{try{n.scrollIntoView()}catch(a){k("[htmlBuilder] scrollIntoView failed",a)}}}catch{try{n.scrollIntoView()}catch(a){k("[htmlBuilder] final scroll fallback failed",a)}}};try{requestAnimationFrame(()=>setTimeout(r,50))}catch(i){k("[htmlBuilder] scheduling scroll failed",i),setTimeout(r,50)}}catch(r){try{n.scrollIntoView()}catch(i){k("[htmlBuilder] final scroll fallback failed",i)}k("[htmlBuilder] doScroll failed",r)}}else try{t&&t.scrollTo?t.scrollTo({top:0,behavior:"smooth"}):window.scrollTo(0,0)}catch(n){try{window.scrollTo(0,0)}catch(r){k("[htmlBuilder] window.scrollTo failed",r)}k("[htmlBuilder] scroll to top failed",n)}}function Wp(e,t,{mountOverlay:n=null,container:r=null,mountEl:i=null,navWrap:a=null,t:o=null}={}){try{const s=typeof o=="function"?o:()=>{},l=r||document.querySelector(".nimbi-cms"),c=i||document.querySelector(".nimbi-mount"),u=n||document.querySelector(".nimbi-overlay"),f=a||document.querySelector(".nimbi-nav-wrap");let d=document.querySelector(".nimbi-scroll-top");if(!d){d=document.createElement("button"),d.className="nimbi-scroll-top button is-primary is-rounded is-small",d.setAttribute("aria-label",s("scrollToTop")||"Scroll to top"),d.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';try{u&&u.appendChild?u.appendChild(d):l&&l.appendChild?l.appendChild(d):c&&c.appendChild?c.appendChild(d):document.body.appendChild(d)}catch{try{document.body.appendChild(d)}catch(g){k("[htmlBuilder] append scroll top button failed",g)}}try{try{$l(d)}catch{}}catch(m){k("[htmlBuilder] set scroll-top button theme registration failed",m)}d.addEventListener("click",()=>{try{r&&r.scrollTo?r.scrollTo({top:0,left:0,behavior:"smooth"}):i&&i.scrollTo?i.scrollTo({top:0,left:0,behavior:"smooth"}):window.scrollTo({top:0,left:0,behavior:"smooth"})}catch{try{r&&(r.scrollTop=0)}catch(g){k("[htmlBuilder] fallback container scrollTop failed",g)}try{i&&(i.scrollTop=0)}catch(g){k("[htmlBuilder] fallback mountEl scrollTop failed",g)}try{document.documentElement.scrollTop=0}catch(g){k("[htmlBuilder] fallback document scrollTop failed",g)}}})}const p=f?.querySelector?.(".menu-label")||null;if(t){if(!d._nimbiObserver)if(typeof globalThis<"u"&&typeof globalThis.IntersectionObserver<"u"){const m=globalThis.IntersectionObserver,g=new m(y=>{for(const h of y)h.target instanceof Element&&(h.isIntersecting?(d.classList.remove("show"),p&&p.classList.remove("show")):(d.classList.add("show"),p&&p.classList.add("show")))},{root:r instanceof Element?r:i instanceof Element?i:null,threshold:0});d._nimbiObserver=g}else d._nimbiObserver=null;try{d._nimbiObserver&&typeof d._nimbiObserver.disconnect=="function"&&d._nimbiObserver.disconnect()}catch(m){k("[htmlBuilder] observer disconnect failed",m)}try{d._nimbiObserver&&typeof d._nimbiObserver.observe=="function"&&d._nimbiObserver.observe(t)}catch(m){k("[htmlBuilder] observer observe failed",m)}try{const m=()=>{try{const g=l instanceof Element?l.getBoundingClientRect():{top:0,bottom:window.innerHeight},y=t.getBoundingClientRect();y.bottom<g.top||y.top>g.bottom?(d.classList.add("show"),p&&p.classList.add("show")):(d.classList.remove("show"),p&&p.classList.remove("show"))}catch(g){k("[htmlBuilder] checkIntersect failed",g)}};m(),typeof globalThis<"u"&&typeof globalThis.IntersectionObserver<"u"||setTimeout(m,100)}catch(m){k("[htmlBuilder] checkIntersect outer failed",m)}}else{d.classList.remove("show"),p&&p.classList.remove("show");const m=r instanceof Element?r:i instanceof Element?i:window,g=()=>{try{(m===window?window.scrollY:m.scrollTop||0)>10?(d.classList.add("show"),p&&p.classList.add("show")):(d.classList.remove("show"),p&&p.classList.remove("show"))}catch(y){k("[htmlBuilder] onScroll handler failed",y)}};Ji(()=>m.addEventListener("scroll",vp(g))),g()}}catch(s){k("[htmlBuilder] ensureScrollTopButton failed",s)}}var Ir=null,wl=[],Hc=1e3,jp=4;function bl(e){let t=String(e??"").toLowerCase().replace(/[^a-z0-9\- ]/g,"").replace(/ /g,"-");return t=t.replace(/(?:-?)(?:md|html)$/g,""),t=t.replace(/-+/g,"-"),t=t.replace(/^-|-$/g,""),t.length>80&&(t=t.slice(0,80).replace(/-+$/g,"")),t}function vn(e){return String(e??"").replace(/^[./]+/,"")}function qp(e){return String(e??"").replace(/\/+$/,"")}function Yr(e){return qp(e)+"/"}function Hp(e,t){if(!e||typeof e!="string")return!1;if(e.startsWith("//"))return!0;if(/^[a-z][a-z0-9+.-]*:/i.test(e)){if(t&&typeof t=="string")try{const n=new URL(e),r=new URL(t);if(n.origin===r.origin)return!n.pathname.startsWith(r.pathname)}catch{}return!0}return!1}function Gc(e){const t=typeof location<"u"&&location.origin?location.origin:"http://localhost",n=String(e??"");return n?/^[a-z][a-z0-9+.-]*:/i.test(n)?Yr(n):n.startsWith("/")?t+Yr(n):t+"/"+Yr(n):t+"/"}async function Gp(e,t){const n=Gc(t),r=new URL(String(e??"").replace(/^\//,""),n).toString(),i=await fetch(r);return!i||!i.ok?null:await i.text()}async function Vp(e,t,n=jp){const r=Array.isArray(e)?e.slice():[],i=Math.max(1,Number(n)||1),a=[];for(let o=0;o<Math.min(i,r.length);o++)a.push((async()=>{for(;r.length;){const s=r.shift();s!=null&&await t(s)}})());await Promise.all(a)}async function Zp(e,t=Hc,n=void 0){const r=new Set,i=new Set,a=[""];if(Array.isArray(n))for(const l of n)try{const c=vn(l);c&&a.push(c)}catch{}const o=Gc(e),s=Yr(new URL(o).pathname);for(;a.length&&a.length<=t;){const l=a.shift();if(l==null||r.has(l))continue;r.add(l);const c=new URL(String(l??""),o).toString();let u=null;try{const g=await fetch(c);if(!g||!g.ok)continue;u=await g.text()}catch{continue}if(!u)continue;const f=[],d=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi,p=/(?:^|[^!])\[[^\]]+\]\(([^)]+)\)/g;let m=null;for(;m=d.exec(u);)try{m?.[1]&&f.push(m[1])}catch{}for(;m=p.exec(u);)try{m?.[1]&&f.push(m[1])}catch{}for(const g of f){if(!g||Hp(g,o)||g.startsWith("..")||g.includes("/../"))continue;if(g.endsWith("/")){try{const w=new URL(g,c);let b=w.pathname.startsWith(s)?w.pathname.slice(s.length):w.pathname.replace(/^\//,"");b=Yr(vn(b)),r.has(b)||a.push(b)}catch{}continue}if(/\.(md|html?)($|[?#])/i.test(g)){try{const w=new URL(g,c);let b=w.pathname.startsWith(s)?w.pathname.slice(s.length):w.pathname.replace(/^\//,"");b=vn(b).split(/[?#]/)[0],b&&(i.add(b),r.has(b)||a.push(b))}catch{}try{const w=new URL(g,o);let b=w.pathname.startsWith(s)?w.pathname.slice(s.length):w.pathname.replace(/^\//,"");b=vn(b).split(/[?#]/)[0],b&&!i.has(b)&&(i.add(b),r.has(b)||a.push(b))}catch{}continue}let y=g.split(/[?#]/)[0].replace(/\/+$/,""),h=null;try{const w=new URL(g,o);h=w.pathname.startsWith(s)?w.pathname.slice(s.length):w.pathname.replace(/^\//,"")}catch{}try{const w=new URL(g,c);y=w.pathname.startsWith(s)?w.pathname.slice(s.length):w.pathname.replace(/^\//,"")}catch{}y=vn(y).split(/[?#]/)[0].replace(/\/+$/,""),h&&(h=vn(h).split(/[?#]/)[0].replace(/\/+$/,""));const _=String(y).split("/").pop()||"";if(!/\.[^./]+$/i.test(_)){if(y){const w=[`${y}.md`,`${y}.html`,`${y}/README.md`,`${y}/README.html`];for(const b of w)i.add(b),r.has(b)||a.push(b)}if(h&&h!==y){const w=[`${h}.md`,`${h}.html`,`${h}/README.md`,`${h}/README.html`];for(const b of w)i.has(b)||(i.add(b),r.has(b)||a.push(b))}}}}return Array.from(i)}function Yp(e,t){const n=String(e??"");if(t)return{title:((n.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[])[1]||(n.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||[])[1]||"").replace(/<[^>]+>/g,"").trim(),excerpt:((n.match(/<p[^>]*>([\s\S]*?)<\/p>/i)||[])[1]||"").replace(/<[^>]+>/g,"").trim()};const r=((n.match(/^#\s+(.+)$/m)||[])[1]||"").trim(),i=n.split(/\r?\n\s*\r?\n/);let a="";for(let o=1;o<i.length;o++){const s=i[o].trim();if(s&&!/^#/.test(s)){a=s.replace(/\r?\n/g," ");break}}return{title:r,excerpt:a}}async function Qp(e,t=1,n=void 0,r=void 0){if(Ir)return Ir;Ir=(async()=>{const i=Array.isArray(n)?new Set(n.map(c=>vn(c))):new Set,a=Array.isArray(r)?r.map(c=>vn(c)).filter(Boolean):[],o=await Zp(e,Hc,a),s=Array.from(new Set(o.concat(a))).filter(c=>/\.(md|html?)$/i.test(c)).filter(c=>!Array.from(i).some(u=>u&&(c===u||c.startsWith(u+"/")))),l=[];return await Vp(s,async c=>{const u=await Gp(c,e);if(!u)return;const f=/\.html?$/i.test(c),{title:d,excerpt:p}=Yp(u,f),m=bl(d||c);let g=null,y=null;try{if(!f){const{data:h}=ur(u),_=h.dateModified||h.date||h.lastmod;if(_){const b=new Date(_);isNaN(b.getTime())||(g=b.toISOString().split("T")[0])}const w=h.image||h.og_image||h.cover||h.featured_image;w&&String(w).trim()&&(y=String(w).trim())}}catch{}if(l.push({slug:m,title:d,excerpt:p,path:c,lastmod:g,image:y}),Number(t)>=2){const h=f?/<h2[^>]*>([\s\S]*?)<\/h2>/gi:/^##\s+(.+)$/gm;let _=null;for(;_=h.exec(u);){const w=String(_[1]??"").replace(/<[^>]+>/g,"").trim();w&&l.push({slug:`${m}::${bl(w)}`,title:w,excerpt:"",path:c,parentTitle:d||"",lastmod:g})}}}),wl=l,wl})();try{return await Ir}finally{Ir=null}}async function Vc(){return Qh}async function Xp(e,t=1,n=void 0,r=void 0){return(await Vc()).buildSearchIndexWorker(e,t,n,r)}async function Jp(e={}){return(await Vc()).awaitSearchIndex(e)}var Ya=ha({attachSitemapDownloadUI:()=>xs,clearSitemapWriteTimer:()=>Zc,exposeSitemapGlobals:()=>Ss,generateAtomXml:()=>vs,generateLlmsTxt:()=>ks,generateRobotsTxt:()=>tm,generateRssXml:()=>bs,generateSitemapJson:()=>ka,generateSitemapXml:()=>ws,handleSitemapRequest:()=>ai});function va(){try{if(typeof location?.pathname=="string")return String(location.origin+location.pathname.split("?")[0])}catch{}return"http://localhost/"}function Ze(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}function vl(e){try{return!e||typeof e!="string"?"":(e.split("/").filter(Boolean).pop()||e).replace(/\.[a-z0-9]+$/i,"").replace(/[-_]+/g," ").split(" ").map(t=>t?t.charAt(0).toUpperCase()+t.slice(1):"").join(" ").trim()}catch{return String(e)}}function Kp(e){try{if(!e||typeof e!="string")return null;const t=e.trim();if(!t)return null;if(/^[a-z][a-z0-9+.-]*:/i.test(t))return t;if(t.startsWith("//"))return"https:"+t;try{if(typeof location<"u"&&location.origin)return new URL(t,location.origin).href}catch{}return t}catch{return null}}function em(e,t){try{const n=t?.slug?String(t.slug):null;if(!n)return null;const r={loc:e+"?page="+encodeURIComponent(n),slug:n};return t.title&&(r.title=String(t.title)),t.excerpt&&(r.excerpt=String(t.excerpt)),t.path&&(r.sourcePath=se(String(t.path))),t.image&&(r.image=String(t.image)),r}catch{return null}}async function ka(e={}){const{includeAllMarkdown:t=!0,index:n,homePage:r,navigationPage:i,notFoundPage:a}=e||{},o=va().split("?")[0];let s=Array.isArray(le)&&le.length?le:Array.isArray(n)?n:[];if(Array.isArray(n)&&n.length&&Array.isArray(le)&&le.length){const y=new Map;try{for(const h of n)try{h?.slug&&y.set(String(h.slug),h)}catch{}for(const h of le)try{h?.slug&&y.set(String(h.slug),h)}catch{}}catch{}s=Array.from(y.values())}const l=new Set;try{typeof a=="string"&&a.trim()&&l.add(se(String(a)))}catch{}try{typeof i=="string"&&i.trim()&&l.add(se(String(i)))}catch{}const c=new Set;try{if(typeof a=="string"&&a.trim()){const y=se(String(a));try{if(typeof _e?.has=="function"&&_e.has(y))try{c.add(_e.get(y))}catch{}else try{const h=await Xe(y,e?.contentBase?e.contentBase:void 0);if(h?.raw)try{let _=null;if(h.isHtml)try{const w=at();if(w){const b=w.parseFromString(h.raw,"text/html"),x=b.querySelector("h1")||b.querySelector("title");x&&x.textContent&&(_=x.textContent.trim())}else{const b=(h.raw||"").match(/<h1[^>]*>(.*?)<\/h1>|<title[^>]*>(.*?)<\/title>/i);b&&(_=(b[1]||b[2]||"").trim())}}catch{}else{const w=(h.raw||"").match(/^#\s+(.+)$/m);w&&w[1]&&(_=w[1].trim())}_&&c.add(be(_))}catch{}}catch{}}catch{}}}catch{}const u=new Set,f=[],d=new Map,p=new Map,m=y=>{try{if(!y||typeof y!="string")return!1;const h=se(String(y));try{if(typeof Qe?.has=="function"&&Qe.has(h))return!0}catch{}try{if(typeof _e?.has=="function"&&_e.has(h))return!0}catch{}try{if(p?.has(h))return!0}catch{}try{if(typeof _e?.keys=="function"&&_e.size)for(const _ of _e.keys())try{if(se(String(_))===h)return!0}catch{}else for(const _ of ie.values())try{if(!_)continue;if(typeof _=="string"){if(se(String(_))===h)return!0}else if(_&&typeof _=="object"){if(_.default&&se(String(_.default))===h)return!0;const w=_.langs||{};for(const b of Object.keys(w||{}))try{if(w[b]&&se(String(w[b]))===h)return!0}catch{}}}catch{}}catch{}}catch{}return!1};if(Array.isArray(s)&&s.length){let y=0;for(const h of s){try{y++,await xn(y,64)}catch{}try{if(!h?.slug)continue;const _=String(h.slug),w=String(_).split("::")[0];if(c.has(w))continue;const b=h.path?se(String(h.path)):null;if(b&&l.has(b))continue;const x=h.title?String(h.title):h.parentTitle?String(h.parentTitle):void 0;d.set(_,{title:x||void 0,excerpt:h.excerpt?String(h.excerpt):void 0,path:b,source:"index",image:h.image?String(h.image):void 0}),b&&p.set(b,{title:x||void 0,excerpt:h.excerpt?String(h.excerpt):void 0,slug:_,image:h.image?String(h.image):void 0});const z=em(o,h);if(!z||!z.slug||u.has(z.slug))continue;if(u.add(z.slug),d.has(z.slug)){const D=d.get(z.slug);D?.title&&(z.title=D.title,z._titleSource="index"),D?.excerpt&&(z.excerpt=D.excerpt),D?.image&&(z.image=D.image)}f.push(z)}catch{continue}}}if(t)try{let y=0;for(const[h,_]of ie.entries()){try{y++,await xn(y,128)}catch{}try{if(!h)continue;const w=String(h).split("::")[0];if(u.has(h)||c.has(w))continue;let b=null;if(typeof _=="string"?b=se(String(_)):_&&typeof _=="object"&&(b=se(String(_.default??""))),b&&l.has(b))continue;const x={loc:o+"?page="+encodeURIComponent(h),slug:h};if(d.has(h)){const z=d.get(h);z?.title&&(x.title=z.title,x._titleSource="index"),z?.excerpt&&(x.excerpt=z.excerpt),z?.image&&(x.image=z.image)}else if(b){const z=p.get(b);z?.title&&(x.title=z.title,x._titleSource="path",!x.excerpt&&z?.excerpt&&(x.excerpt=z.excerpt)),!x.image&&z?.image&&(x.image=z.image)}if(u.add(h),typeof h=="string"){const z=h.indexOf("/")!==-1||/\.(md|html?)$/i.test(h),D=x.title&&typeof x.title=="string"&&(x.title.indexOf("/")!==-1||/\.(md|html?)$/i.test(x.title));(!x.title||D||z)&&(x.title=vl(h),x._titleSource="humanize")}f.push(x)}catch{}}try{if(r&&typeof r=="string"){const h=se(String(r));let _=null;try{typeof _e?.has=="function"&&_e.has(h)&&(_=_e.get(h))}catch{}_||(_=h);const w=String(_).split("::")[0];if(!u.has(_)&&!l.has(h)&&!c.has(w)){const b={loc:o+"?page="+encodeURIComponent(_),slug:_};if(d.has(_)){const x=d.get(_);x?.title&&(b.title=x.title,b._titleSource="index"),x?.excerpt&&(b.excerpt=x.excerpt),x?.image&&(b.image=x.image)}u.add(_),f.push(b)}}}catch{}}catch{}try{const y=new Set,h=new Set(f.map(z=>String(z?.slug??""))),_=new Set;for(const z of f)try{z?.sourcePath&&_.add(String(z.sourcePath))}catch{}const w=30;let b=0,x=0;for(const z of _){try{x++,await xn(x,8)}catch{}if(b>=w)break;try{if(!z||typeof z!="string"||!m(z))continue;b+=1;const D=await Xe(z,e?.contentBase?e.contentBase:void 0);if(!D||!D.raw||D&&typeof D.status=="number"&&D.status===404)continue;const B=(function(R){try{return String(R??"")}catch{return""}})(D.raw),j=[],re=/\[[^\]]+\]\(([^)]+)\)/g;let ae;for(;ae=re.exec(B);)try{ae?.[1]&&j.push(ae[1])}catch{}const J=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;ae=J.exec(B);)try{ae?.[1]&&j.push(ae[1])}catch{}for(const R of j)try{if(!R)continue;if(R.indexOf("?")!==-1||R.indexOf("=")!==-1)try{const M=new URL(R,o).searchParams.get("page");if(M){const A=String(M);!h.has(A)&&!y.has(A)&&(y.add(A),f.push({loc:o+"?page="+encodeURIComponent(A),slug:A}));continue}}catch{}let N=String(R).split(/[?#]/)[0];if(N=N.replace(/^\.\//,"").replace(/^\//,""),!N||!/\.(md|html?)$/i.test(N))continue;try{const M=se(N);if(_e?.has?.(M)){const A=_e?.get?.(M),O=String(A).split("::")[0];A&&!h.has(A)&&!y.has(A)&&!c.has(O)&&!l.has(M)&&(y.add(A),f.push({loc:o+"?page="+encodeURIComponent(A),slug:A,sourcePath:M}));continue}try{if(!m(M))continue;const A=await Xe(M,e?.contentBase?e.contentBase:void 0);if(A&&typeof A.status=="number"&&A.status===404)continue;if(A&&A.raw){const O=(A.raw||"").match(/^#\s+(.+)$/m),H=O&&O[1]?O[1].trim():"",L=be(H||M),Q=String(L).split("::")[0];L&&!h.has(L)&&!y.has(L)&&!c.has(Q)&&(y.add(L),f.push({loc:o+"?page="+encodeURIComponent(L),slug:L,sourcePath:M,title:H||void 0}))}}catch{}}catch{}}catch{}}catch{}}}catch{}try{const y=new Map;let h=0;for(const w of f){try{h++,await xn(h,128)}catch{}try{if(!w||!w.slug)continue;y.set(String(w.slug),w)}catch{}}const _=new Set;for(const w of f)try{if(!w||!w.slug)continue;const b=String(w.slug),x=b.split("::")[0];if(!x)continue;b!==x&&!y.has(x)&&_.add(x)}catch{}for(const w of _)try{let b=null;if(d.has(w)){const x=d.get(w);b={loc:o+"?page="+encodeURIComponent(w),slug:w},x?.title&&(b.title=x.title,b._titleSource="index"),x?.excerpt&&(b.excerpt=x.excerpt),x?.path&&(b.sourcePath=x.path),x?.lastmod&&(b.lastmod=x.lastmod),x?.image&&(b.image=x.image)}else if(p&&ie?.has?.(w)){const x=ie?.get?.(w);let z=null;if(typeof x=="string"?z=se(String(x)):x&&typeof x=="object"&&(z=se(String(x.default??""))),b={loc:o+"?page="+encodeURIComponent(w),slug:w},z&&p.has(z)){const D=p.get(z);D?.title&&(b.title=D.title,b._titleSource="path"),D?.excerpt&&(b.excerpt=D.excerpt),b.sourcePath=z,D?.lastmod&&(b.lastmod=D.lastmod),D?.image&&(b.image=D.image)}}b||(b={loc:o+"?page="+encodeURIComponent(w),slug:w,title:vl(w)},b._titleSource="humanize"),y.has(w)||(f.push(b),y.set(w,b))}catch{}}catch{}const g=[];try{const y=new Set;let h=0;for(const _ of f){try{h++,await xn(h,128)}catch{}try{if(!_||!_.slug)continue;const w=String(_.slug),b=String(w).split("::")[0];if(c.has(b)||w.indexOf("::")!==-1||y.has(w))continue;y.add(w),g.push(_)}catch{}}}catch{}try{try{de(()=>"[runtimeSitemap] generateSitemapJson finalEntries.titleSource: "+JSON.stringify(g.map(y=>({slug:y.slug,title:y.title,titleSource:y._titleSource||null})),null,2))}catch{}}catch{}try{let h=0;const _=g.length,w=Array.from({length:Math.min(4,_)}).map(async()=>{for(;;){const b=h++;if(b>=_)break;const x=g[b];try{if(!x||!x.slug)continue;const z=String(x.slug).split("::")[0];if(c.has(z)||x._titleSource==="index")continue;let D=null;try{if(ie?.has?.(x.slug)){const B=ie?.get?.(x.slug);typeof B=="string"?D=se(String(B)):B&&typeof B=="object"&&(D=se(String(B.default??"")))}!D&&x.sourcePath&&(D=x.sourcePath)}catch{continue}if(!D||l.has(D)||!m(D))continue;try{const B=await Xe(D,e?.contentBase?e.contentBase:void 0);if(!B||!B.raw||B&&typeof B.status=="number"&&B.status===404)continue;if(B&&B.raw){const j=(B.raw||"").match(/^#\s+(.+)$/m),re=j&&j[1]?j[1].trim():"";re&&(x.title=re,x._titleSource="fetched")}}catch(B){de("[runtimeSitemap] fetch title failed for",D,B)}}catch(z){de("[runtimeSitemap] worker loop failure",z)}}});await Promise.all(w)}catch(y){de("[runtimeSitemap] title enrichment failed",y)}return{generatedAt:new Date().toISOString(),entries:g}}function ws(e){const t=Array.isArray(e?.entries)?e.entries:Array.isArray(e)?e:[];let n=`<?xml version="1.0" encoding="UTF-8"?>
`;n+=`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;for(const r of t)try{if(n+=`  <url>
`,n+=`    <loc>${Ze(String(r.loc??""))}</loc>
`,r.lastmod&&(n+=`    <lastmod>${Ze(String(r.lastmod))}</lastmod>
`),r.changefreq&&(n+=`    <changefreq>${Ze(String(r.changefreq))}</changefreq>
`),r.priority&&(n+=`    <priority>${Ze(String(r.priority))}</priority>
`),r.hreflang){const i=Array.isArray(r.hreflang)?r.hreflang:[r.hreflang];for(const a of i)n+=`    <xhtml:link rel="alternate" hreflang="${Ze(String(a.lang))}" href="${Ze(String(a.href))}" />
`}if(r.image){const i=Kp(String(r.image));i&&(n+=`    <image:image>
`,n+=`      <image:loc>${Ze(i)}</image:loc>
`,n+=`    </image:image>
`)}n+=`  </url>
`}catch{}return n+=`</urlset>
`,n}function bs(e){const t=Array.isArray(e?.entries)?e.entries:Array.isArray(e)?e:[],n=va().split("?")[0];let r=`<?xml version="1.0" encoding="UTF-8"?>
`;r+=`<rss version="2.0">
`,r+=`<channel>
`,r+=`<title>${Ze("Sitemap RSS")}</title>
`,r+=`<link>${Ze(n)}</link>
`,r+=`<description>${Ze("RSS feed generated from site index")}</description>
`,r+=`<lastBuildDate>${Ze(e?.generatedAt?new Date(e.generatedAt).toUTCString():new Date().toUTCString())}</lastBuildDate>
`;for(const i of t)try{const a=String(i.loc??"");r+=`<item>
`,r+=`<title>${Ze(String(i.title||i.slug||(i.loc??"")))}</title>
`,i.excerpt&&(r+=`<description>${Ze(String(i.excerpt))}</description>
`),r+=`<link>${Ze(a)}</link>
`,r+=`<guid>${Ze(a)}</guid>
`,r+=`</item>
`}catch{}return r+=`</channel>
`,r+=`</rss>
`,r}function vs(e){const t=Array.isArray(e?.entries)?e.entries:Array.isArray(e)?e:[],n=va().split("?")[0],r=e?.generatedAt?new Date(e.generatedAt).toISOString():new Date().toISOString();let i=`<?xml version="1.0" encoding="utf-8"?>
`;i+=`<feed xmlns="http://www.w3.org/2005/Atom">
`,i+=`<title>${Ze("Sitemap Atom")}</title>
`,i+=`<link href="${Ze(n)}" />
`,i+=`<updated>${Ze(r)}</updated>
`,i+=`<id>${Ze(n)}</id>
`;for(const a of t)try{const o=String(a.loc??""),s=a?.lastmod?new Date(a.lastmod).toISOString():r;i+=`<entry>
`,i+=`<title>${Ze(String(a.title||a.slug||(a.loc??"")))}</title>
`,a.excerpt&&(i+=`<summary>${Ze(String(a.excerpt))}</summary>
`),i+=`<link href="${Ze(o)}" />
`,i+=`<id>${Ze(o)}</id>
`,i+=`<updated>${Ze(s)}</updated>
`,i+=`</entry>
`}catch{}return i+=`</feed>
`,i}function tm(e={}){const{sitemapUrl:t,disallow:n=[]}=e||{};let r=`User-agent: *
`;for(const i of n)r+=`Disallow: ${String(i)}
`;return typeof t=="string"&&t.trim()&&(r+=`Sitemap: ${String(t.trim())}
`),r}function ks(e,t={}){const n=Array.isArray(e?.entries)?e.entries:Array.isArray(e)?e:[],r=va().split("?")[0];let i=String(t?.name??"").trim();if(!i)try{i=typeof document<"u"&&document.title?String(document.title).split(/[|\-–—]/)[0].trim():""}catch{}i||(i="Site");const a=String(t?.description??"").trim();let o=`# ${i}
`;a&&(o+=`
> ${a}
`),n.length&&(o+=`
`);for(const s of n)try{const l=String(s?.title||s?.slug||"").trim();if(!l)continue;const c=s?.slug?String(s.slug):null,u=String(s?.loc||(c?`${r}?page=${encodeURIComponent(c)}`:r)),f=s?.excerpt?`: ${String(s.excerpt).replace(/\s+/g," ").trim()}`:"";o+=`- [${l}](${u})${f}
`}catch{}return o}function Zc(){try{typeof window<"u"&&window.__nimbiSitemapWriteTimer&&(clearTimeout(window.__nimbiSitemapWriteTimer),window.__nimbiSitemapWriteTimer=null,window.__nimbiSitemapPendingWrite=null)}catch{}}function kl(e,t="application/xml"){try{try{document.open(t,"replace")}catch{try{document.open()}catch{}}document.write(e),document.close();try{if(typeof Blob<"u"&&typeof URL<"u"&&URL.createObjectURL){const n=new Blob([e],{type:t}),r=URL.createObjectURL(n);try{location.href=r}catch{try{window.open(r,"_self")}catch{}}setTimeout(()=>{try{URL.revokeObjectURL(r)}catch{}},5e3)}}catch{}}catch{try{try{const r=document.createElement("pre");try{r.textContent=Ze(e)}catch{try{r.textContent=String(e)}catch{}}if(document&&document.body)try{if(typeof document.body.replaceChildren=="function")document.body.replaceChildren(r);else{for(;document.body.firstChild;)document.body.removeChild(document.body.firstChild);document.body.appendChild(r)}}catch{try{document.body.innerHTML="<pre>"+Ze(e)+"</pre>"}catch{}}}catch{}}catch{}}}function xl(e){try{const t=Array.isArray(e?.entries)?e.entries:Array.isArray(e)?e:[];let n='<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Sitemap</title></head><body>';n+="<h1>Sitemap</h1><ul>";for(const r of t)try{n+=`<li><a href="${Ze(String(r&&r.loc?r.loc:""))}">${Ze(String(r&&(r.title||r.slug)||r&&r.loc||""))}</a></li>`}catch{}return n+="</ul></body></html>",n}catch{return"<!doctype html><html><body><pre>failed to render sitemap</pre></body></html>"}}function Or(e,t="application/xml"){try{if(typeof window>"u"){try{let r=null;t==="application/rss+xml"?r=bs(e):t==="application/atom+xml"?r=vs(e):t==="text/html"?r=xl(e):t==="text/plain"?r=ks(e):r=ws(e),kl(r,t);try{typeof window<"u"&&(window.__nimbiSitemapRenderedAt=Date.now(),window.__nimbiSitemapJson=e,window.__nimbiSitemapFinal=e.entries||[])}catch{}}catch{}return}const n=Array.isArray(e?.entries)?e.entries.length:0;try{const r=window.__nimbiSitemapPendingWrite||null;(!r||typeof r.len=="number"&&r.len<n)&&(window.__nimbiSitemapPendingWrite={finalJson:e,mimeType:t,len:n}),window.__nimbiSitemapWriteTimer&&(clearTimeout(window.__nimbiSitemapWriteTimer),window.__nimbiSitemapWriteTimer=null),window.__nimbiSitemapWriteTimer=setTimeout(()=>{try{if(typeof window>"u")return;const i=window.__nimbiSitemapPendingWrite;if(!i)return;let a=null;i.mimeType==="application/rss+xml"?a=bs(i.finalJson):i.mimeType==="application/atom+xml"?a=vs(i.finalJson):i.mimeType==="text/html"?a=xl(i.finalJson):i.mimeType==="text/plain"?a=ks(i.finalJson):a=ws(i.finalJson);try{kl(a,i.mimeType)}catch{}try{window.__nimbiSitemapRenderedAt=Date.now(),window.__nimbiSitemapJson=i.finalJson,window.__nimbiSitemapFinal=i.finalJson.entries||[]}catch{}}catch{}try{typeof window<"u"&&clearTimeout(window.__nimbiSitemapWriteTimer)}catch{}try{typeof window<"u"&&(window.__nimbiSitemapWriteTimer=null,window.__nimbiSitemapPendingWrite=null)}catch{}},40)}catch{}try{window.__nimbiSitemapUnloadListenerAttached||(window.__nimbiSitemapUnloadListenerAttached=!0,window.addEventListener("beforeunload",Zc))}catch{}}catch{}}async function ai(e={}){try{if(typeof document>"u"||typeof location>"u")return!1;let t=!1,n=!1,r=!1,i=!1,a=!1;try{const f=new URLSearchParams(location.search||"");if(f.has("sitemap")){let d=!0;for(const p of f.keys())p!=="sitemap"&&(d=!1);d&&(t=!0)}if(f.has("rss")){let d=!0;for(const p of f.keys())p!=="rss"&&(d=!1);d&&(n=!0)}if(f.has("atom")){let d=!0;for(const p of f.keys())p!=="atom"&&(d=!1);d&&(r=!0)}if(f.has("llms")){let d=!0;for(const p of f.keys())p!=="llms"&&(d=!1);d&&(a=!0)}}catch{}if(!t&&!n&&!r&&!a){const f=(location.pathname||"/").replace(/\/\/+/g,"/").split("/").filter(Boolean).pop()||"";if(!f||(t=/^(sitemap|sitemap\.xml)$/i.test(f),n=/^(rss|rss\.xml)$/i.test(f),r=/^(atom|atom\.xml)$/i.test(f),i=/^(sitemap|sitemap\.html)$/i.test(f),a=/^llms\.txt$/i.test(f),!t&&!n&&!r&&!i&&!a))return!1}let o=[];const s=typeof e.waitForIndexMs=="number"?e.waitForIndexMs:1/0;try{if(typeof An=="function")try{const f=await An({timeoutMs:s,contentBase:e?.contentBase,indexDepth:e?.indexDepth,noIndexing:e?.noIndexing,startBuild:!0});if(Array.isArray(f)&&f.length)if(Array.isArray(e.index)&&e.index.length){const d=new Map;try{for(const p of e.index)try{p?.slug&&d.set(String(p.slug),p)}catch{}for(const p of f)try{p?.slug&&d.set(String(p.slug),p)}catch{}}catch{}o=Array.from(d.values())}else o=f;else o=Array.isArray(e.index)&&e.index.length?e.index:Array.isArray(le)&&le.length?le:[]}catch{o=Array.isArray(e.index)&&e.index.length?e.index:Array.isArray(le)&&le.length?le:[]}else o=Array.isArray(le)&&le.length?le:Array.isArray(e.index)&&e.index.length?e.index:[]}catch{o=Array.isArray(e.index)&&e.index.length?e.index:Array.isArray(le)&&le.length?le:[]}try{if(Array.isArray(e.index)&&e.index.length)try{const f=new Map;for(const d of e.index)try{if(!d||!d.slug)continue;const p=String(d.slug).split("::")[0];if(!f.has(p))f.set(p,d);else{const m=f.get(p);m&&String(m.slug??"").indexOf("::")!==-1&&String(d.slug??"").indexOf("::")===-1&&f.set(p,d)}}catch{}try{de(()=>"[runtimeSitemap] providedIndex.dedupedByBase: "+JSON.stringify(Array.from(f.values()),null,2))}catch{de(()=>"[runtimeSitemap] providedIndex.dedupedByBase (count): "+String(f.size))}}catch(f){k("[runtimeSitemap] logging provided index failed",f)}}catch{}if((!Array.isArray(o)||!o.length)&&typeof Vn=="function")try{const f=typeof e.waitForIndexMs=="number"?e.waitForIndexMs:1/0;let d=null;try{typeof An=="function"&&(d=await An({timeoutMs:f,contentBase:e?.contentBase,indexDepth:e?.indexDepth,noIndexing:e?.noIndexing,startBuild:!0}))}catch{d=null}if(Array.isArray(d)&&d.length)o=d;else{const p=typeof e.indexDepth=="number"?e.indexDepth:3,m=Array.isArray(e.noIndexing)?e.noIndexing:void 0,g=[];e?.homePage&&g.push(e.homePage),e?.navigationPage&&g.push(e.navigationPage),o=await Vn(e?.contentBase,p,m,g.length?g:void 0)}}catch(f){k("[runtimeSitemap] rebuild index failed",f),o=Array.isArray(le)&&le.length?le:[]}try{const f=Array.isArray(o)?o.length:0;try{de(()=>"[runtimeSitemap] usedIndex.full.length (before rebuild): "+String(f))}catch{}try{de(()=>"[runtimeSitemap] usedIndex.full (before rebuild): "+JSON.stringify(o,null,2))}catch{}}catch{}try{const f=[];e?.homePage&&f.push(e.homePage),e?.navigationPage&&f.push(e.navigationPage);const d=typeof e.indexDepth=="number"?e.indexDepth:3,p=Array.isArray(e.noIndexing)?e.noIndexing:void 0;let m=null;try{const g=typeof globalThis<"u"&&typeof globalThis.buildSearchIndexWorker=="function"?globalThis.buildSearchIndexWorker:void 0;if(typeof g=="function")try{m=await g(e?.contentBase,d,p)}catch{m=null}}catch{m=null}if((!m||!m.length)&&typeof Vn=="function")try{m=await Vn(e?.contentBase,d,p,f.length?f:void 0)}catch{m=null}if(Array.isArray(m)&&m.length){const g=new Map;try{for(const y of o)try{y?.slug&&g.set(String(y.slug),y)}catch{}for(const y of m)try{y?.slug&&g.set(String(y.slug),y)}catch{}}catch{}o=Array.from(g.values())}}catch(f){try{k("[runtimeSitemap] rebuild index call failed",f)}catch{}}try{const f=Array.isArray(o)?o.length:0;try{de(()=>"[runtimeSitemap] usedIndex.full.length (after rebuild): "+String(f))}catch{}try{de(()=>"[runtimeSitemap] usedIndex.full (after rebuild): "+JSON.stringify(o,null,2))}catch{}}catch{}const l=await ka(Object.assign({},e,{index:o}));let c=[];try{const f=new Set,d=Array.isArray(l?.entries)?l.entries:[];for(const p of d)try{let m=null;if(p&&p.slug)m=String(p.slug);else if(p&&p.loc)try{m=new URL(String(p.loc)).searchParams.get("page")}catch{}if(!m)continue;const g=String(m).split("::")[0];if(!f.has(g)){f.add(g);const y=Object.assign({},p);y.baseSlug=g,c.push(y)}}catch{}try{de(()=>"[runtimeSitemap] finalEntries.dedupedByBase: "+JSON.stringify(c,null,2))}catch{de(()=>"[runtimeSitemap] finalEntries.dedupedByBase (count): "+String(c.length))}}catch{try{c=Array.isArray(l?.entries)?l.entries.slice(0):[]}catch{c=[]}}const u=Object.assign({},l||{},{entries:Array.isArray(c)?c:Array.isArray(l?.entries)?l.entries:[]});try{if(typeof window<"u")try{window.__nimbiSitemapJson=u,window.__nimbiSitemapFinal=c}catch{}}catch{}if(a)return Or(u,"text/plain"),!0;if(n){const f=Array.isArray(u?.entries)?u.entries.length:0;let d=-1;try{typeof window<"u"&&Array.isArray(window.__nimbiSitemapFinal)&&typeof window.__nimbiSitemapRenderedAt=="number"&&(d=window.__nimbiSitemapFinal.length)}catch{}if(d>f){try{de("[runtimeSitemap] skip RSS write: existing rendered sitemap larger",d,f)}catch{}return!0}return Or(u,"application/rss+xml"),!0}if(r){const f=Array.isArray(u?.entries)?u.entries.length:0;let d=-1;try{typeof window<"u"&&Array.isArray(window.__nimbiSitemapFinal)&&typeof window.__nimbiSitemapRenderedAt=="number"&&(d=window.__nimbiSitemapFinal.length)}catch{}if(d>f){try{de("[runtimeSitemap] skip Atom write: existing rendered sitemap larger",d,f)}catch{}return!0}return Or(u,"application/atom+xml"),!0}if(t){const f=Array.isArray(u?.entries)?u.entries.length:0;let d=-1;try{typeof window<"u"&&Array.isArray(window.__nimbiSitemapFinal)&&typeof window.__nimbiSitemapRenderedAt=="number"&&(d=window.__nimbiSitemapFinal.length)}catch{}if(d>f){try{de("[runtimeSitemap] skip XML write: existing rendered sitemap larger",d,f)}catch{}return!0}return Or(u,"application/xml"),!0}if(i)try{const f=(Array.isArray(u?.entries)?u.entries:[]).length;let d=-1;try{typeof window<"u"&&Array.isArray(window.__nimbiSitemapFinal)&&typeof window.__nimbiSitemapRenderedAt=="number"&&(d=window.__nimbiSitemapFinal.length)}catch{}if(d>f){try{de("[runtimeSitemap] skip HTML write: existing rendered sitemap larger",d,f)}catch{}return!0}return Or(u,"text/html"),!0}catch(f){return k("[runtimeSitemap] render HTML failed",f),!1}return!1}catch(t){return k("[runtimeSitemap] handleSitemapRequest failed",t),!1}}function xs(e,t={}){try{if(!e||typeof document>"u")return null;const n=document.createElement("button");return n.type="button",n.className="button is-small is-light",n.textContent="Download sitemap",n.setAttribute("aria-label","Download sitemap JSON"),n.addEventListener("click",async()=>{try{const r=await ka(),i=JSON.stringify(r,null,2),a=new Blob([i],{type:"application/json"}),o=URL.createObjectURL(a);try{const s=document.createElement("a");s.href=o,s.download=String(t?.filename||"sitemap.json").replace(/\\/g,"_").replace(/[^A-Za-z0-9_.-]/g,"_").replace(/^_+/,"").replace(/_+$/,"")||"sitemap.json",s.className="nimbi-sitemap-download",document.body.appendChild(s),s.click(),s.remove()}finally{setTimeout(()=>{try{URL.revokeObjectURL(o)}catch{}},0)}}catch(r){k("[runtimeSitemap] attachSitemapDownloadUI click failed",r)}}),e.appendChild(n),n}catch(n){return k("[runtimeSitemap] attachSitemapDownloadUI failed",n),null}}async function Ss(e={}){try{const t=typeof e.waitForIndexMs=="number"?e.waitForIndexMs:1/0;let n=[];try{if(typeof An=="function")try{const o=await An({timeoutMs:t,contentBase:e?.contentBase,indexDepth:e?.indexDepth,noIndexing:e?.noIndexing,startBuild:!0});Array.isArray(o)&&o.length&&(n=o)}catch{}}catch{}(!Array.isArray(n)||!n.length)&&Array.isArray(le)&&le.length&&(n=le),(!Array.isArray(n)||!n.length)&&Array.isArray(e.index)&&e.index.length&&(n=e.index);const r=await ka(Object.assign({},e,{index:n}));let i=[];try{const o=new Set,s=Array.isArray(r?.entries)?r.entries:[];for(const l of s)try{let c=null;if(l&&l.slug)c=String(l.slug);else if(l&&l.loc)try{c=new URL(String(l.loc)).searchParams.get("page")}catch{c=null}if(!c)continue;const u=String(c).split("::")[0];if(!o.has(u)){o.add(u);const f=Object.assign({},l);f.baseSlug=u,i.push(f)}}catch{}}catch{try{i=Array.isArray(r?.entries)?r.entries.slice(0):[]}catch{i=[]}}const a=Object.assign({},r||{},{entries:Array.isArray(i)?i:Array.isArray(r?.entries)?r.entries:[]});try{if(typeof window<"u")try{window.__nimbiSitemapJson=a,window.__nimbiSitemapFinal=i}catch{}}catch{}return{json:a,deduped:i}}catch{return null}}function nm(e){try{if(!Array.isArray(e))return e;e.forEach(t=>{try{if(!t||typeof t!="object")return;let n=typeof t.slug=="string"?String(t.slug):"",r=null;if(n&&n.indexOf("::")!==-1){const s=n.split("::");n=s[0]||"",r=s.slice(1).join("::")||null}const i=!!(n&&(n.indexOf(".")!==-1||n.indexOf("/")!==-1));let a="";try{if(t.path&&typeof t.path=="string"){const s=se(String(t.path??""));if(a=findSlugForPath(s)||_e?.get(s)||"",!a)if(t.title&&String(t.title).trim())a=be(String(t.title).trim());else{const l=s.replace(/^.*\//,"").replace(/\.(?:md|html?)$/i,"");a=be(l||s)}}else if(i){const s=String(n).replace(/\.(?:md|html?)$/i,""),l=findSlugForPath(s)||_e?.get(s)||"";l?a=l:t.title&&String(t.title).trim()?a=be(String(t.title).trim()):a=be(s)}else!n&&t.title&&String(t.title).trim()?a=be(String(t.title).trim()):a=n||""}catch{try{a=t.title&&String(t.title).trim()?be(String(t.title).trim()):n?be(n):""}catch{a=n}}let o=a||"";r&&(o=o?`${o}::${r}`:`${be(r)}`),o&&(t.slug=o);try{if(t.path&&o){const s=String(o).split("::")[0];try{ft(s,se(String(t.path??"")))}catch{}}}catch{}}catch{}})}catch{}return e}async function rm(e,t,n,r,i,a,o,s,l="eager",c=1,u=void 0,f="favicon",d){if(!e||!(e instanceof HTMLElement))throw new TypeError("navbarWrap must be an HTMLElement");const p=at(),m=p?p.parseFromString(n||"","text/html"):null,g=m?m.querySelectorAll("a"):[];await Ji(()=>Rp(g,r)),await Ji(()=>Lp(g,r));try{he(g,r)}catch{}try{if(t&&t instanceof HTMLElement&&(!t.hasAttribute||!t.hasAttribute("role")))try{t.setAttribute("role","main")}catch{}}catch{}let y=null,h=null,_=null,w=null,b=null,x=null,z=null,D=!1,B=null;const j=new Map,re=(E,P,G,U)=>{d?E.addEventListener(P,G,{...U,signal:d}):E.addEventListener(P,G,U)};function ae(){try{const E=typeof M<"u"&&M&&M.querySelector?M.querySelector(".navbar-burger"):e&&e.querySelector?e.querySelector(".navbar-burger"):typeof document<"u"?document.querySelector(".navbar-burger"):null,P=E?.dataset?.target??null,G=P?typeof M<"u"&&M&&M.querySelector?M.querySelector(`#${P}`)||document.getElementById(P):e&&e.querySelector?e.querySelector(`#${P}`):typeof document<"u"?document.getElementById(P):null:null;if(E?.classList?.contains("is-active")){try{E.classList.remove("is-active")}catch{}try{E.setAttribute("aria-expanded","false")}catch{}if(G?.classList)try{G.classList.remove("is-active")}catch{}}}catch(E){k("[nimbi-cms] closeMobileMenu failed",E)}}async function J(){const E=t&&t instanceof HTMLElement?t:typeof document<"u"?document.querySelector(".nimbi-content"):null;try{E&&E.classList.add("is-inactive")}catch{}try{const P=o?.();P&&typeof P.then=="function"&&await P}catch(P){try{k("[nimbi-cms] renderByQuery failed",P)}catch{}}finally{try{if(typeof requestAnimationFrame=="function")requestAnimationFrame(()=>{try{E&&E.classList.remove("is-inactive")}catch{}});else try{E&&E.classList.remove("is-inactive")}catch{}}catch{try{E&&E.classList.remove("is-inactive")}catch{}}}}function R(E){try{let P=E&&typeof E.slug=="string"?String(E.slug):"",G=null;try{P&&P.indexOf("::")!==-1&&(G=P.split("::").slice(1).join("::")||null)}catch{}try{if(E&&E.path&&typeof E.path=="string"){const U=se(String(E.path??"")),C=U.replace(/^.*\//,"");try{if(j&&j.has(U))return{page:j.get(U),hash:G};if(j&&j.has(C))return{page:j.get(C),hash:G}}catch{}try{if(_e?.has?.(U))return{page:_e.get(U),hash:G}}catch{}try{const F=ee(U);if(F)return{page:F,hash:G}}catch{}}}catch{}if(P&&P.indexOf("::")!==-1){const U=P.split("::");P=U[0]||"",G=U.slice(1).join("::")||null}if(P&&(P.includes(".")||P.includes("/"))){const U=se(E&&E.path?String(E.path):P),C=U.replace(/^.*\//,"");try{if(j&&j.has(U))return{page:j.get(U),hash:G};if(j&&j.has(C))return{page:j.get(C),hash:G}}catch{}try{let F=ee(U);if(!F)try{const $=String(U??"").replace(/^\/+/,""),te=$.replace(/^.*\//,"");for(const[W,V]of ie.entries())try{let Z=null;if(typeof V=="string"?Z=se(String(V??"")):V&&typeof V=="object"&&(V.default?Z=se(String(V.default??"")):Z=null),!Z)continue;if(Z===$||Z.endsWith("/"+$)||$.endsWith("/"+Z)||Z.endsWith(te)||$.endsWith(te)){F=W;break}}catch{}}catch{}if(F)P=F;else try{const $=String(P).replace(/\.(?:md|html?)$/i,"");P=be($||U)}catch{P=be(U)}}catch{P=be(U)}}return!P&&E&&E.path&&(P=be(se(String(E.path??"")))),{page:P,hash:G}}catch{return{page:E&&E.slug||"",hash:null}}}const N=()=>y||(y=(async()=>{try{const E=typeof globalThis<"u"?globalThis.buildSearchIndex:void 0,P=typeof globalThis<"u"?globalThis.buildSearchIndexWorker:void 0,G=typeof E=="function"?E:Qp,U=typeof P=="function"?P:Xp,C=[];try{i&&C.push(i)}catch{}try{navigationPage&&C.push(navigationPage)}catch{}if(l==="lazy"&&typeof U=="function")try{const F=await U(r,c,u,C.length?C:void 0);if(F&&F.length){try{try{Hr(F)}catch{}}catch{}return F}}catch(F){k("[nimbi-cms] worker builder threw",F)}return typeof G=="function"?await G(r,c,u,C.length?C:void 0):[]}catch(E){return k("[nimbi-cms] buildSearchIndex failed",E),y=null,[]}finally{if(h){try{h.removeAttribute("disabled")}catch{}try{_&&_.classList.remove("is-loading")}catch{}}}})(),y.then(E=>{try{try{B=Array.isArray(E)?E:null}catch{B=null}try{nm(E)}catch{}try{if(typeof window<"u"){try{(async()=>{try{try{try{Hr(Array.isArray(E)?E:[])}catch{}Object.defineProperty(window,"__nimbiResolvedIndex",{get(){return Array.isArray(le)?le:Array.isArray(B)?B:[]},enumerable:!0,configurable:!0})}catch{try{window.__nimbiResolvedIndex=Array.isArray(le)?le:Array.isArray(B)?B:[]}catch{}}}catch{try{window.__nimbiResolvedIndex=Array.isArray(le)?le:Array.isArray(B)?B:[]}catch{}}})()}catch{}try{window.__nimbi_contentBase=r}catch{}try{window.__nimbi_indexDepth=c}catch{}try{window.__nimbi_noIndexing=u}catch{}}}catch{}const P=String((h&&h.value)??"").trim().toLowerCase();if(!P||!Array.isArray(E)||!E.length)return;const G=E.filter(C=>C.title&&C.title.toLowerCase().includes(P)||C.excerpt&&C.excerpt.toLowerCase().includes(P));if(!G||!G.length)return;const U=typeof b<"u"&&b?b:typeof document<"u"?document.getElementById("nimbi-search-results"):null;if(!U)return;try{typeof U.replaceChildren=="function"?U.replaceChildren():U.innerHTML=""}catch{try{U.innerHTML=""}catch{}}try{const C=document.createElement("div");C.className="panel nimbi-search-panel",G.slice(0,10).forEach(F=>{try{if(F.parentTitle){const V=document.createElement("p");V.className="panel-heading nimbi-search-title nimbi-search-parent",V.textContent=F.parentTitle,C.appendChild(V)}const $=document.createElement("a");$.className="panel-block nimbi-search-result";const te=R(F);$.href=je(te.page,te.hash),$.setAttribute("role","button");try{if(F.path&&typeof F.path=="string")try{ft(te.page,F.path)}catch{}}catch{}const W=document.createElement("div");W.className="is-size-6 has-text-weight-semibold",W.textContent=F.title,$.appendChild(W),$.addEventListener("click",()=>{try{U.classList.add("is-hidden")}catch{}}),C.appendChild($)}catch{}}),Vi(()=>{try{U.classList.remove("is-hidden"),U.appendChild(C)}catch{}})}catch{}}catch{}}).catch(()=>{}).finally(()=>{(async()=>{try{if(D)return;D=!0;try{await ai({homePage:i,contentBase:r,indexDepth:c,noIndexing:u,includeAllMarkdown:!0})}catch(E){k("[nimbi-cms] sitemap trigger failed",E)}}catch(E){try{k("[nimbi-cms] sitemap dynamic import failed",E)}catch{}}})()}),y),M=document.createElement("nav");M.className="navbar",M.setAttribute("role","navigation"),M.setAttribute("aria-label","main navigation");const A=document.createElement("div");A.className="navbar-brand";const O=g[0],H=document.createElement("a");if(H.className="navbar-item",O){const E=O?.getAttribute?.("href")||"#";try{const P=new URL(E,location.href).searchParams.get("page"),G=P?decodeURIComponent(P):i;let U=null;try{typeof G=="string"&&(/(?:\.md|\.html?)$/i.test(G)||G.includes("/"))&&(U=ee(G))}catch{}!U&&typeof G=="string"&&!String(G).includes(".")&&(U=G),H.href=je(U||G),(!H.textContent||!String(H.textContent).trim())&&(H.textContent=a("home"))}catch{try{const G=typeof i=="string"&&(/(?:\.md|\.html?)$/i.test(i)||i.includes("/"))?ee(i):typeof i=="string"&&!i.includes(".")?i:null;H.href=je(G||i)}catch{H.href=je(i)}H.textContent=a("home")}}else H.href=je(i),H.textContent=a("home");async function L(E){try{if(!E||E==="none")return null;if(E==="favicon")try{const P=document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');if(!P)return null;const G=P?.getAttribute?.("href")||"";return G&&/\.png(?:\?|$)/i.test(G)?new URL(G,location.href).toString():null}catch{return null}if(E==="copy-first"||E==="move-first")try{const P=await Xe(i,r);if(!P||!P.raw)return null;const G=at(),U=G?G.parseFromString(P.raw,"text/html"):null,C=U?U.querySelector("img"):null;if(!C)return null;const F=C?.getAttribute?.("src")||"";if(!F)return null;const $=new URL(F,location.href).toString();if(E==="move-first")try{document.documentElement.setAttribute("data-nimbi-logo-moved",$)}catch{}return $}catch{return null}try{return new URL(E,location.href).toString()}catch{return null}}catch{return null}}let Q=null;try{Q=await L(f)}catch{Q=null}if(Q)try{const E=document.createElement("img");E.className="nimbi-navbar-logo";const P=a&&typeof a=="function"&&(a("home")||a("siteLogo"))||"";E.alt=P,E.title=P,E.src=Q;try{(!H.textContent||!String(H.textContent).trim())&&(H.textContent=P)}catch{}try{H.insertBefore(E,H.firstChild)}catch{try{H.appendChild(E)}catch{}}}catch{}A.appendChild(H),H.addEventListener("click",function(E){const P=H.getAttribute("href")||"";if(P.startsWith("?page=")){E.preventDefault();const G=new URL(P,location.href),U=G.searchParams.get("page"),C=G.hash?G.hash.replace(/^#/,""):null;history.pushState({page:U},"",je(U,C)),J();try{ae()}catch{}}});function ee(E){try{if(!E)return null;const P=se(String(E??""));try{if(_e?.has?.(P))return _e.get(P)}catch{}const G=P.replace(/^.*\//,"");try{if(_e?.has?.(G))return _e.get(G)}catch{}try{for(const[U,C]of ie.entries())if(C){if(typeof C=="string"){if(se(C)===P)return U}else if(C&&typeof C=="object"){if(C.default&&se(C.default)===P)return U;const F=C.langs||{};for(const $ in F)if(F[$]&&se(F[$])===P)return U}}}catch{}return null}catch{return null}}async function he(E,P){try{if(!E||!E.length)return;const G=[];for(let te=0;te<E.length;te++)try{const W=E[te];if(!W||typeof W.getAttribute!="function")continue;const V=W.getAttribute("href")||"";if(!V||Xi(V))continue;let Z=null;try{const Se=yt(V);Se&&Se.page&&(Z=Se.page)}catch{}if(!Z){const Se=String(V??"").split(/[?#]/,1),qe=Se&&Se[0]?Se[0]:V;(/\.(?:md|html?)$/i.test(qe)||qe.indexOf("/")!==-1)&&(Z=se(String(qe??"")))}if(!Z)continue;try{if(P&&typeof P=="string")try{let Se=new URL(P,typeof location<"u"?location.origin:"http://localhost").pathname||"";if(Se=Se.replace(/^\/+|\/+$/g,""),Se){let qe=String(Z??"");qe=qe.replace(/^\/+/,""),qe===Se?Z="":qe.startsWith(Se+"/")?Z=qe.slice(Se.length+1):Z=qe}}catch{}}catch{}const oe=se(String(Z??"")),ge=oe.replace(/^.*\//,"");let Ne=null;try{j&&j.has(oe)&&(Ne=j.get(oe))}catch{}try{!Ne&&_e?.has?.(oe)&&(Ne=_e.get(oe))}catch{}if(Ne)continue;let Re=null;try{Re=W.textContent&&String(W.textContent).trim()?String(W.textContent).trim():null}catch{Re=null}let Oe=null;if(Re)Oe=be(Re);else{const Se=ge.replace(/\.(?:md|html?)$/i,"");Oe=be(Se||oe)}if(Oe)try{G.push({path:oe,candidate:Oe})}catch{}}catch{}if(!G.length)return;const U=3;let C=0;const F=async()=>{for(;C<G.length;){const te=G[C++];if(!(!te||!te.path))try{const W=await Xe(te.path,P);if(!W||!W.raw)continue;let V=null;if(W.isHtml)try{const Z=at(),oe=Z?Z.parseFromString(W.raw,"text/html"):null,ge=oe?oe.querySelector("h1")||oe.querySelector("title"):null;ge&&ge.textContent&&(V=String(ge.textContent).trim())}catch{}else try{const Z=W.raw.match(/^#\s+(.+)$/m);Z&&Z[1]&&(V=String(Z[1]).trim())}catch{}if(V){const Z=be(V);if(Z&&Z!==te.candidate){try{ft(Z,te.path)}catch{}try{j.set(te.path,Z)}catch{}try{j.set(te.path.replace(/^.*\//,""),Z)}catch{}try{try{if(Array.isArray(le)){let oe=!1;for(const ge of le)try{if(ge&&ge.path===te.path&&ge.slug){const Ne=String(ge.slug).split("::").slice(1).join("::");ge.slug=Ne?`${Z}::${Ne}`:Z,oe=!0}}catch{}try{oe&&Hr(le)}catch{}}}catch{}}catch{}}}}catch{}}},$=[];for(let te=0;te<U;te++)$.push(F());try{await Promise.all($)}catch{}}catch{}}const me=document.createElement("a");me.className="navbar-burger",me.setAttribute("role","button"),me.setAttribute("aria-label","menu"),me.setAttribute("aria-expanded","false");const xe="nimbi-navbar-menu";me.dataset.target=xe,me.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>',A.appendChild(me);try{me.addEventListener("click",E=>{try{const P=me.dataset&&me.dataset.target?me.dataset.target:null,G=P?M&&M.querySelector?M.querySelector(`#${P}`)||(e&&e.querySelector?e.querySelector(`#${P}`):document.getElementById(P)):e&&e.querySelector?e.querySelector(`#${P}`)||document.getElementById(P):typeof document<"u"?document.getElementById(P):null:null;me.classList.contains("is-active")?(me.classList.remove("is-active"),me.setAttribute("aria-expanded","false"),G&&G.classList.remove("is-active")):(me.classList.add("is-active"),me.setAttribute("aria-expanded","true"),G&&G.classList.add("is-active"))}catch(P){k("[nimbi-cms] navbar burger toggle failed",P)}})}catch(E){k("[nimbi-cms] burger event binding failed",E)}const Pe=document.createElement("div");Pe.className="navbar-menu",Pe.id=xe;const ce=document.createElement("div");ce.className="navbar-start";let De=null,Ke=null;if(!s)De=null,h=null,w=null,b=null,x=null;else{De=document.createElement("div"),De.className="navbar-end",Ke=document.createElement("div"),Ke.className="navbar-item",h=document.createElement("input"),h.className="input",h.type="search",h.placeholder=a("searchPlaceholder")||"",h.id="nimbi-search";try{const U=(a&&typeof a=="function"?a("searchAria"):null)||h.placeholder||"Search";try{h.setAttribute("aria-label",U)}catch{}try{h.setAttribute("aria-controls","nimbi-search-results")}catch{}try{h.setAttribute("aria-autocomplete","list")}catch{}try{h.setAttribute("role","combobox")}catch{}}catch{}l==="eager"&&(h.disabled=!0),_=document.createElement("div"),_.className="control",l==="eager"&&_.classList.add("is-loading"),_.setAttribute("aria-live","polite"),_.appendChild(h),Ke.appendChild(_),w=document.createElement("div"),w.className="dropdown is-right",w.id="nimbi-search-dropdown";const E=document.createElement("div");E.className="dropdown-trigger",E.setAttribute("aria-expanded","false"),E.appendChild(Ke);const P=document.createElement("div");P.className="dropdown-menu",P.setAttribute("role","menu"),b=document.createElement("div"),b.id="nimbi-search-results",b.className="dropdown-content nimbi-search-results",b.setAttribute("role","listbox"),b.setAttribute("aria-hidden","true"),b.setAttribute("aria-live","polite"),b.setAttribute("aria-relevant","all"),x=b,P.appendChild(b),w.appendChild(E),w.appendChild(P),De.appendChild(w);const G=U=>{if(!b)return;try{if(typeof b.replaceChildren=="function")b.replaceChildren();else for(;b.firstChild;)b.removeChild(b.firstChild)}catch{try{b.innerHTML=""}catch{}}let C=-1;function F(W){try{const V=b.querySelector(".nimbi-search-result.is-selected");V&&V.classList.remove("is-selected");const Z=b.querySelectorAll(".nimbi-search-result");if(!Z||!Z.length){C=-1;try{h&&h.removeAttribute("aria-activedescendant")}catch{}return}if(W<0){C=-1;try{h&&h.removeAttribute("aria-activedescendant")}catch{}return}W>=Z.length&&(W=Z.length-1);const oe=Z[W];if(oe){oe.classList.add("is-selected"),C=W;try{oe.scrollIntoView({block:"nearest"})}catch{}try{h&&oe.id&&h.setAttribute("aria-activedescendant",oe.id)}catch{}}}catch{}}function $(W){try{const V=W.key,Z=b.querySelectorAll(".nimbi-search-result");if(!Z||!Z.length)return;if(V==="ArrowDown"){W.preventDefault(),F(C<0?0:Math.min(Z.length-1,C+1));return}if(V==="ArrowUp"){W.preventDefault(),F(C<=0?0:C-1);return}if(V==="Enter"){W.preventDefault();const oe=b.querySelector(".nimbi-search-result.is-selected")||b.querySelector(".nimbi-search-result");if(oe)try{oe.click()}catch{}return}if(V==="Escape"){try{w.classList.remove("is-active");try{E.setAttribute("aria-expanded","false")}catch{}}catch{}try{document.documentElement.classList.remove("nimbi-search-open")}catch{}try{b.classList.add("is-hidden")}catch{}try{b.classList.remove("is-open")}catch{}try{b.removeAttribute("tabindex")}catch{}try{b.removeEventListener("keydown",$)}catch{}try{h&&h.focus()}catch{}try{h&&h.removeEventListener("keydown",te)}catch{}return}}catch{}}function te(W){try{if(W&&W.key==="ArrowDown"){W.preventDefault();try{b.focus()}catch{}F(0)}}catch{}}try{const W=String((h&&h.value)??"").trim();if(!U||!U.length){if(!W){try{w&&w.classList.remove("is-active")}catch{}try{document.documentElement.classList.remove("nimbi-search-open")}catch{}try{b&&(b.classList.add("is-hidden"),b.classList.remove("is-open"),b.removeAttribute("tabindex"))}catch{}try{b&&b.removeEventListener("keydown",$)}catch{}return}try{const V=document.createElement("div");V.className="panel nimbi-search-panel";const Z=document.createElement("p");Z.className="panel-block nimbi-search-no-results",Z.textContent=a&&typeof a=="function"?a("searchNoResults"):"No results",V.appendChild(Z),Vi(()=>{try{b.appendChild(V)}catch{}})}catch{}if(w){w.classList.add("is-active");try{E.setAttribute("aria-expanded","true")}catch{}try{document.documentElement.classList.add("nimbi-search-open")}catch{}}try{b.classList.remove("is-hidden")}catch{}try{b.classList.add("is-open")}catch{}try{b.setAttribute("aria-hidden","false")}catch{}try{b.setAttribute("tabindex","0")}catch{}return}}catch{}try{const W=document.createElement("div");W.className="panel nimbi-search-panel";const V=document.createDocumentFragment();U.forEach(Z=>{if(Z.parentTitle){const Re=document.createElement("p");Re.textContent=Z.parentTitle,Re.className="panel-heading nimbi-search-title nimbi-search-parent",V.appendChild(Re)}const oe=document.createElement("a");oe.className="panel-block nimbi-search-result";const ge=R(Z);oe.href=je(ge.page,ge.hash),oe.setAttribute("role","button");try{if(Z.path&&typeof Z.path=="string")try{ft(ge.page,Z.path)}catch{}}catch{}const Ne=document.createElement("div");Ne.className="is-size-6 has-text-weight-semibold",Ne.textContent=Z.title,oe.appendChild(Ne),oe.addEventListener("click",Re=>{try{try{Re&&Re.preventDefault&&Re.preventDefault()}catch{}try{Re&&Re.stopPropagation&&Re.stopPropagation()}catch{}if(w){w.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-search-open")}catch{}}try{b.classList.add("is-hidden");try{b.setAttribute("aria-hidden","true")}catch{}}catch{}try{b.classList.remove("is-open")}catch{}try{b.removeAttribute("tabindex")}catch{}try{b.removeEventListener("keydown",$)}catch{}try{h&&h.removeEventListener("keydown",te)}catch{}try{const Oe=oe.getAttribute&&oe.getAttribute("href")||"";let Se=null,qe=null;try{const Be=new URL(Oe,location.href);Se=Be.searchParams.get("page"),qe=Be.hash?Be.hash.replace(/^#/,""):null}catch{}if(Se)try{history.pushState({page:Se},"",je(Se,qe));try{J()}catch{try{typeof window<"u"&&typeof window.renderByQuery=="function"&&window.renderByQuery()}catch{}}return}catch{}}catch{}try{window.location.href=oe.href}catch{}}catch{}}),V.appendChild(oe)}),W.appendChild(V),Vi(()=>{try{b.appendChild(W)}catch{}})}catch{}if(w){w.classList.add("is-active");try{document.documentElement.classList.add("nimbi-search-open")}catch{}}try{b.classList.remove("is-hidden")}catch{}try{b.classList.add("is-open")}catch{}try{b.setAttribute("tabindex","0")}catch{}try{b.addEventListener("keydown",$)}catch{}try{h&&h.addEventListener("keydown",te)}catch{}};if(h){const U=bp(async()=>{const C=h||(typeof M<"u"&&M&&M.querySelector?M.querySelector("input#nimbi-search"):e&&e.querySelector?e.querySelector("input#nimbi-search"):typeof document<"u"?document.querySelector("input#nimbi-search"):null),F=String((C&&C.value)??"").trim().toLowerCase();if(!F){try{w&&w.classList.remove("is-active")}catch{}try{document.documentElement.classList.remove("nimbi-search-open")}catch{}try{b&&(b.classList.add("is-hidden"),b.classList.remove("is-open"),b.removeAttribute("tabindex"))}catch{}return}try{await N();let $=await y;(!Array.isArray($)||!$.length)&&(Array.isArray(window.__nimbiSearchIndex)&&window.__nimbiSearchIndex.length?$=window.__nimbiSearchIndex:Array.isArray(window.__nimbiResolvedIndex)&&window.__nimbiResolvedIndex.length&&($=window.__nimbiResolvedIndex));const te=Array.isArray($)?$.filter(W=>W.title&&W.title.toLowerCase().includes(F)||W.excerpt&&W.excerpt.toLowerCase().includes(F)):[];G(te.slice(0,10))}catch($){y=null,k("[nimbi-cms] search input handler failed",$),G([])}},50);try{h.addEventListener("input",U)}catch{}}if(l==="eager"){try{y=N()}catch(U){k("[nimbi-cms] eager search index init failed",U),y=Promise.resolve([])}y.finally(()=>{const U=h||(typeof M<"u"&&M&&M.querySelector?M.querySelector("input#nimbi-search"):e&&e.querySelector?e.querySelector("input#nimbi-search"):typeof document<"u"?document.querySelector("input#nimbi-search"):null);if(U){try{U.removeAttribute("disabled")}catch{}try{_&&_.classList.remove("is-loading")}catch{}}(async()=>{try{if(D)return;D=!0;const C=await y.catch(()=>[]);try{await ai({index:Array.isArray(C)?C:void 0,homePage:i,contentBase:r,indexDepth:c,noIndexing:u,includeAllMarkdown:!0})}catch(F){k("[nimbi-cms] sitemap trigger failed",F)}}catch(C){try{k("[nimbi-cms] sitemap dynamic import failed",C)}catch{}}})()})}try{z=U=>{try{const C=U&&U.target;if(!x||!x.classList.contains("is-open")&&x.style&&!x.classList.contains("is-hidden")||C&&(x.contains(C)||h&&(C===h||h.contains&&h.contains(C))))return;if(w){w.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-search-open")}catch{}}try{x.classList.add("is-hidden")}catch{}try{x.classList.remove("is-open")}catch{}}catch{}},re(document,"click",z,!0),re(document,"touchstart",z,!0)}catch{}}const ot=document.createDocumentFragment();for(let E=0;E<g.length;E++){const P=g[E];if(E===0)continue;const G=P.getAttribute("href")||"#";let U=G;const C=document.createElement("a");C.className="navbar-item";try{let F=null;try{F=yt(String(G??""))}catch{F=null}let $=null,te=null;if(F&&(F.type==="canonical"&&F.page||F.type==="cosmetic"&&F.page)&&($=F.page,te=F.anchor),$&&(/\.(?:md|html?)$/i.test($)||$.includes("/")?U=$:C.href=je($,te)),/^[^#]*\.md(?:$|[#?])/.test(U)||U.endsWith(".md")){const W=se(U).split(/::|#/,2),V=W[0],Z=W[1],oe=ee(V);oe?C.href=je(oe,Z):C.href=je(V,Z)}else if(/\.html(?:$|[#?])/.test(U)||U.endsWith(".html")){const W=se(U).split(/::|#/,2);let V=W[0];V&&!V.toLowerCase().endsWith(".html")&&(V=V+".html");const Z=W[1],oe=ee(V);if(oe)C.href=je(oe,Z);else try{const ge=await Xe(V,r);if(ge&&ge.raw)try{const Ne=at(),Re=Ne?Ne.parseFromString(ge.raw,"text/html"):null,Oe=Re?Re.querySelector("title"):null,Se=Re?Re.querySelector("h1"):null,qe=Oe&&Oe.textContent&&Oe.textContent.trim()?Oe.textContent.trim():Se&&Se.textContent?Se.textContent.trim():null;if(qe){const Be=be(qe);if(Be){try{ft(Be,V)}catch(Ht){k("[nimbi-cms] slugToMd/mdToSlug set failed",Ht)}C.href=je(Be,Z)}else C.href=je(V,Z)}else C.href=je(V,Z)}catch{C.href=je(V,Z)}else C.href=U}catch{C.href=U}}else C.href=U}catch(F){k("[nimbi-cms] nav item href parse failed",F),C.href=U}try{const F=P.textContent&&String(P.textContent).trim()?String(P.textContent).trim():null;if(F)try{const $=be(F);if($){const te=C.getAttribute("href")||"";let W=null;if(/^[^#?]*\.(?:md|html?)(?:$|[?#])/i.test(te))W=se(String(te??"").split(/[?#]/)[0]);else try{const V=yt(te);V&&V.type==="canonical"&&V.page&&(W=se(V.page))}catch{}if(W){let V=!1;try{if(/\.(?:html?)(?:$|[?#])/i.test(String(W??"")))V=!0;else if(/\.(?:md)(?:$|[?#])/i.test(String(W??"")))V=!1;else{const Z=String(W??"").replace(/^\.\//,""),oe=Z.replace(/^.*\//,"");Qe&&Qe.size&&(Qe.has(Z)||Qe.has(oe))&&(V=!0)}}catch{V=!1}if(V)try{const Z=se(String(W??"").split(/[?#]/)[0]);let oe=!1;try{ee&&typeof ee=="function"&&ee(Z)&&(oe=!0)}catch{}try{ft($,W)}catch{}try{if(Z){try{j.set(Z,$)}catch{}try{const ge=Z.replace(/^.*\//,"");ge&&j.set(ge,$)}catch{}}}catch{}if(oe)try{C.href=je($)}catch{}}catch{}}}}catch($){k("[nimbi-cms] nav slug mapping failed",$)}}catch(F){k("[nimbi-cms] nav slug mapping failed",F)}C.textContent=P.textContent||U,ot.appendChild(C)}try{ce.appendChild(ot)}catch{}Pe.appendChild(ce),De&&Pe.appendChild(De),M.appendChild(A),M.appendChild(Pe),e.appendChild(M);try{const E=P=>{try{const G=typeof M<"u"&&M&&M.querySelector?M.querySelector(".navbar-burger"):e&&e.querySelector?e.querySelector(".navbar-burger"):typeof document<"u"?document.querySelector(".navbar-burger"):null;if(!G||!G.classList.contains("is-active"))return;const U=G&&G.closest?G.closest(".navbar"):M;if(U&&U.contains(P.target))return;ae()}catch{}};re(document,"click",E,!0),re(document,"touchstart",E,!0)}catch{}try{Pe.addEventListener("click",E=>{const P=E.target&&E.target.closest?E.target.closest("a"):null;if(!P)return;const G=P.getAttribute("href")||"";try{const U=new URL(G,location.href),C=U.searchParams.get("page"),F=U.hash?U.hash.replace(/^#/,""):null;C&&(E.preventDefault(),history.pushState({page:C},"",je(C,F)),J())}catch(U){k("[nimbi-cms] navbar click handler failed",U)}try{const U=typeof M<"u"&&M&&M.querySelector?M.querySelector(".navbar-burger"):e&&e.querySelector?e.querySelector(".navbar-burger"):null,C=U&&U.dataset?U.dataset.target:null,F=C?M&&M.querySelector?M.querySelector(`#${C}`)||(e&&e.querySelector?e.querySelector(`#${C}`):document.getElementById(C)):e&&e.querySelector?e.querySelector(`#${C}`)||document.getElementById(C):typeof document<"u"?document.getElementById(C):null:null;U&&U.classList.contains("is-active")&&(U.classList.remove("is-active"),U.setAttribute("aria-expanded","false"),F&&F.classList.remove("is-active"))}catch(U){k("[nimbi-cms] mobile menu close failed",U)}})}catch(E){k("[nimbi-cms] attach content click handler failed",E)}try{t.addEventListener("click",E=>{const P=E.target&&E.target.closest?E.target.closest("a"):null;if(!P)return;const G=P.getAttribute("href")||"";if(G&&!Xi(G))try{const U=new URL(G,location.href),C=U.searchParams.get("page"),F=U.hash?U.hash.replace(/^#/,""):null;C&&(E.preventDefault(),history.pushState({page:C},"",je(C,F)),J())}catch(U){k("[nimbi-cms] container click URL parse failed",U)}})}catch(E){k("[nimbi-cms] build navbar failed",E)}return{navbar:M,linkEls:g}}try{document.addEventListener("input",e=>{try{if(e&&e.target&&e.target.id==="nimbi-search"){const t=document.getElementById("nimbi-search-results");if(t&&e.target&&e.target.value)try{t.classList.remove("is-hidden")}catch{}}}catch{}},!0)}catch{}var lt=null,Ee=null,ut=1,Jt=(e,t)=>t,Qr=0,Xr=0,Zi=()=>{},Ur=.25;function im(){if(lt&&document.contains(lt))return lt;lt=null;const e=document.createElement("dialog");e.className="nimbi-image-preview modal",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-label",Jt("imagePreviewTitle","Image preview"));try{const A=document.createElement("div");A.className="modal-background";const O=document.createElement("div");O.className="modal-content";const H=document.createElement("div");H.className="nimbi-image-preview__content box",H.setAttribute("role","document");const L=document.createElement("button");L.className="button is-small nimbi-image-preview__close",L.type="button",L.setAttribute("data-nimbi-preview-close",""),L.textContent="✕",L.setAttribute("aria-hidden","true");const Q=document.createElement("div");Q.className="nimbi-image-preview__image-wrapper";const ee=document.createElement("img");ee.setAttribute("data-nimbi-preview-image",""),ee.alt="",Q.appendChild(ee);const he=document.createElement("div");he.className="nimbi-image-preview__controls";const me=document.createElement("div");me.className="nimbi-image-preview__group";const xe=document.createElement("button");xe.className="button is-small",xe.type="button",xe.setAttribute("data-nimbi-preview-fit",""),xe.textContent="⤢",xe.setAttribute("aria-hidden","true");const Pe=document.createElement("button");Pe.className="button is-small",Pe.type="button",Pe.setAttribute("data-nimbi-preview-original",""),Pe.textContent="1:1",Pe.setAttribute("aria-hidden","true");const ce=document.createElement("button");ce.className="button is-small",ce.type="button",ce.setAttribute("data-nimbi-preview-reset",""),ce.textContent="⟲",ce.setAttribute("aria-hidden","true"),me.appendChild(xe),me.appendChild(Pe),me.appendChild(ce);const De=document.createElement("div");De.className="nimbi-image-preview__group";const Ke=document.createElement("button");Ke.className="button is-small",Ke.type="button",Ke.setAttribute("data-nimbi-preview-zoom-out",""),Ke.textContent="−",Ke.setAttribute("aria-hidden","true");const ot=document.createElement("div");ot.className="nimbi-image-preview__zoom",ot.setAttribute("data-nimbi-preview-zoom-label",""),ot.textContent="100%";const E=document.createElement("button");E.className="button is-small",E.type="button",E.setAttribute("data-nimbi-preview-zoom-in",""),E.textContent="＋",E.setAttribute("aria-hidden","true"),De.appendChild(Ke),De.appendChild(ot),De.appendChild(E),he.appendChild(me),he.appendChild(De),H.appendChild(L),H.appendChild(Q),H.appendChild(he),O.appendChild(H),e.appendChild(A),e.appendChild(O)}catch{e.innerHTML=`
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
    `}e.addEventListener("click",A=>{A.target===e&&Qa()}),e.addEventListener("wheel",A=>{if(!re())return;A.preventDefault();const O=A.deltaY<0?Ur:-Ur;cn(ut+O),c(),u()},{passive:!1}),e.addEventListener("keydown",A=>{if(A.key==="Escape"){Qa();return}if(ut>1){const O=e.querySelector(".nimbi-image-preview__image-wrapper");if(!O)return;const H=40;switch(A.key){case"ArrowUp":O.scrollTop-=H,A.preventDefault();break;case"ArrowDown":O.scrollTop+=H,A.preventDefault();break;case"ArrowLeft":O.scrollLeft-=H,A.preventDefault();break;case"ArrowRight":O.scrollLeft+=H,A.preventDefault()}}}),document.body.appendChild(e),lt=e,Ee=e.querySelector("[data-nimbi-preview-image]");const t=e.querySelector("[data-nimbi-preview-fit]"),n=e.querySelector("[data-nimbi-preview-original]"),r=e.querySelector("[data-nimbi-preview-zoom-in]"),i=e.querySelector("[data-nimbi-preview-zoom-out]"),a=e.querySelector("[data-nimbi-preview-reset]"),o=e.querySelector("[data-nimbi-preview-close]"),s=e.querySelector("[data-nimbi-preview-zoom-label]"),l=e.querySelector("[data-nimbi-preview-zoom-hud]");function c(){s&&(s.textContent=`${Math.round(ut*100)}%`)}const u=()=>{l&&(l.textContent=`${Math.round(ut*100)}%`,l.classList.add("visible"),clearTimeout(l._timeout),l._timeout=setTimeout(()=>l.classList.remove("visible"),800))};Zi=c,r.addEventListener("click",()=>{cn(ut+Ur),c(),u()}),i.addEventListener("click",()=>{cn(ut-Ur),c(),u()}),t.addEventListener("click",()=>{Jr(),c(),u()}),n.addEventListener("click",()=>{cn(1),c(),u()}),a.addEventListener("click",()=>{Jr(),c(),u()}),o.addEventListener("click",Qa),t.title=Jt("imagePreviewFit","Fit to screen"),n.title=Jt("imagePreviewOriginal","Original size"),i.title=Jt("imagePreviewZoomOut","Zoom out"),r.title=Jt("imagePreviewZoomIn","Zoom in"),o.title=Jt("imagePreviewClose","Close"),o.setAttribute("aria-label",Jt("imagePreviewClose","Close"));let f=!1,d=0,p=0,m=0,g=0;const y=new Map;let h=0,_=1;const w=(A,O)=>{const H=A.x-O.x,L=A.y-O.y;return Math.hypot(H,L)},b=()=>{f=!1,y.clear(),h=0,Ee&&(Ee.classList.add("is-panning"),Ee.classList.remove("is-grabbing"))};let x=0,z=0,D=0;const B=A=>{const O=Date.now(),H=O-x,L=A.clientX-z,Q=A.clientY-D;x=O,z=A.clientX,D=A.clientY,H<300&&Math.hypot(L,Q)<30&&(cn(ut>1?1:2),c(),A.preventDefault())},j=A=>{cn(ut>1?1:2),c(),A.preventDefault()},re=()=>lt?typeof lt.open=="boolean"?lt.open:lt.classList.contains("is-active"):!1,ae=(A,O,H=1)=>{if(y.has(H)&&y.set(H,{x:A,y:O}),y.size===2){const he=Array.from(y.values()),me=w(he[0],he[1]);if(h>0){const xe=me/h;cn(_*xe)}return}if(!f)return;const L=Ee.closest(".nimbi-image-preview__image-wrapper");if(!L)return;const Q=A-d,ee=O-p;L.scrollLeft=m-Q,L.scrollTop=g-ee},J=(A,O,H=1)=>{if(!re())return;if(y.set(H,{x:A,y:O}),y.size===2){const Q=Array.from(y.values());h=w(Q[0],Q[1]),_=ut;return}const L=Ee.closest(".nimbi-image-preview__image-wrapper");L&&(L.scrollWidth>L.clientWidth||L.scrollHeight>L.clientHeight)&&(f=!0,d=A,p=O,m=L.scrollLeft,g=L.scrollTop,Ee.classList.add("is-panning"),Ee.classList.remove("is-grabbing"),window.addEventListener("pointermove",R),window.addEventListener("pointerup",N),window.addEventListener("pointercancel",N))},R=A=>{f&&(A.preventDefault(),ae(A.clientX,A.clientY,A.pointerId))},N=()=>{b(),window.removeEventListener("pointermove",R),window.removeEventListener("pointerup",N),window.removeEventListener("pointercancel",N)};Ee.addEventListener("pointerdown",A=>{A.preventDefault(),J(A.clientX,A.clientY,A.pointerId)}),Ee.addEventListener("pointermove",A=>{(f||y.size===2)&&A.preventDefault(),ae(A.clientX,A.clientY,A.pointerId)}),Ee.addEventListener("pointerup",A=>{A.preventDefault(),A.pointerType==="touch"&&B(A),b()}),Ee.addEventListener("dblclick",j),Ee.addEventListener("pointercancel",b),Ee.addEventListener("mousedown",A=>{A.preventDefault(),J(A.clientX,A.clientY,1)}),Ee.addEventListener("mousemove",A=>{f&&A.preventDefault(),ae(A.clientX,A.clientY,1)}),Ee.addEventListener("mouseup",A=>{A.preventDefault(),b()});const M=e.querySelector(".nimbi-image-preview__image-wrapper");return M&&(M.addEventListener("pointerdown",A=>{if(J(A.clientX,A.clientY,A.pointerId),A?.target?.tagName==="IMG")try{A.target.classList.add("is-grabbing")}catch{}}),M.addEventListener("pointermove",A=>{ae(A.clientX,A.clientY,A.pointerId)}),M.addEventListener("pointerup",b),M.addEventListener("pointercancel",b),M.addEventListener("mousedown",A=>{if(J(A.clientX,A.clientY,1),A?.target?.tagName==="IMG")try{A.target.classList.add("is-grabbing")}catch{}}),M.addEventListener("mousemove",A=>{ae(A.clientX,A.clientY,1)}),M.addEventListener("mouseup",b)),e}function cn(e){if(!Ee)return;const t=Number(e);ut=Number.isFinite(t)?Math.max(.1,Math.min(4,t)):1;const n=Ee.getBoundingClientRect(),r=Qr||Ee.naturalWidth||Ee.width||n.width||0,i=Xr||Ee.naturalHeight||Ee.height||n.height||0;if(r&&i){Ee.style.setProperty("--nimbi-preview-img-max-width","none"),Ee.style.setProperty("--nimbi-preview-img-max-height","none"),Ee.style.setProperty("--nimbi-preview-img-width",`${r*ut}px`),Ee.style.setProperty("--nimbi-preview-img-height",`${i*ut}px`),Ee.style.setProperty("--nimbi-preview-img-transform","none");try{Ee.style.width=`${r*ut}px`,Ee.style.height=`${i*ut}px`,Ee.style.transform="none"}catch{}}else{Ee.style.setProperty("--nimbi-preview-img-max-width",""),Ee.style.setProperty("--nimbi-preview-img-max-height",""),Ee.style.setProperty("--nimbi-preview-img-width",""),Ee.style.setProperty("--nimbi-preview-img-height",""),Ee.style.setProperty("--nimbi-preview-img-transform",`scale(${ut})`);try{Ee.style.transform=`scale(${ut})`}catch{}}Ee&&(Ee.classList.add("is-panning"),Ee.classList.remove("is-grabbing"))}function Jr(){if(!Ee)return;const e=Ee.closest(".nimbi-image-preview__image-wrapper");if(!e)return;const t=e.getBoundingClientRect();if(t.width===0||t.height===0)return;const n=Qr||Ee.naturalWidth||t.width,r=Xr||Ee.naturalHeight||t.height;if(!n||!r)return;const i=t.width/n,a=t.height/r,o=Math.min(i,a,1);cn(Number.isFinite(o)?o:1)}function am(e,t="",n=0,r=0){const i=im();ut=1,Qr=n||0,Xr=r||0,Ee.src=e;try{if(!t)try{const o=new URL(e,typeof location<"u"?location.href:"").pathname||"",s=(o.substring(o.lastIndexOf("/")+1)||e).replace(/\.[^/.]+$/,"").replace(/[-_]+/g," ");t=Jt("imagePreviewDefaultAlt",s||"Image")}catch{t=Jt("imagePreviewDefaultAlt","Image")}}catch{}Ee.alt=t,Ee.style.transform="scale(1)";const a=()=>{Qr=Ee.naturalWidth||Ee.width||0,Xr=Ee.naturalHeight||Ee.height||0};if(a(),Jr(),Zi(),requestAnimationFrame(()=>{Jr(),Zi()}),!Qr||!Xr){const o=()=>{a(),requestAnimationFrame(()=>{Jr(),Zi()}),Ee.removeEventListener("load",o)};Ee.addEventListener("load",o)}typeof i.showModal=="function"&&(i.open||i.showModal()),i.classList.add("is-active");try{document.documentElement.classList.add("nimbi-image-preview-open")}catch{}i.focus();try{const o=i.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');if(o.length){const s=o[0],l=o[o.length-1],c=u=>{try{if(u.key!=="Tab")return;u.shiftKey?document.activeElement===s&&(u.preventDefault(),l.focus()):document.activeElement===l&&(u.preventDefault(),s.focus())}catch{}};i.addEventListener("keydown",c),i._focusTrapHandler=c}}catch{}}function Qa(){if(lt){typeof lt.close=="function"&&lt.open&&lt.close(),lt.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-image-preview-open")}catch{}try{lt._focusTrapHandler&&(lt.removeEventListener("keydown",lt._focusTrapHandler),lt._focusTrapHandler=null)}catch{}}}function sm(e,{t,zoomStep:n=.25}={}){if(!e||!e.querySelectorAll)return;Jt=(p,m)=>(typeof t=="function"?t(p):void 0)||m,Ur=n,e.addEventListener("click",p=>{const m=p.target;if(!m||m.tagName!=="IMG")return;const g=m;g.src&&(g.closest("a")?.getAttribute?.("href")||am(g.src,g.alt||"",g.naturalWidth||0,g.naturalHeight||0))});let r=!1,i=0,a=0,o=0,s=0;const l=new Map;let c=0,u=1;const f=(p,m)=>{const g=p.x-m.x,y=p.y-m.y;return Math.hypot(g,y)};e.addEventListener("pointerdown",p=>{const m=p.target;if(!m||m.tagName!=="IMG")return;const g=m.closest("a");if(g&&g.getAttribute("href")||!lt||!lt.open)return;if(l.set(p.pointerId,{x:p.clientX,y:p.clientY}),l.size===2){const h=Array.from(l.values());c=f(h[0],h[1]),u=ut;return}const y=m.closest(".nimbi-image-preview__image-wrapper");if(y&&!(ut<=1)){p.preventDefault(),r=!0,i=p.clientX,a=p.clientY,o=y.scrollLeft,s=y.scrollTop,m.setPointerCapture(p.pointerId);try{m.classList.add("is-grabbing")}catch{}}}),e.addEventListener("pointermove",p=>{if(l.has(p.pointerId)&&l.set(p.pointerId,{x:p.clientX,y:p.clientY}),l.size===2){p.preventDefault();const _=Array.from(l.values()),w=f(_[0],_[1]);if(c>0){const b=w/c;cn(u*b)}return}if(!r)return;p.preventDefault();const m=p.target;if(m?.closest?.("a")?.getAttribute?.("href"))return;const g=m.closest(".nimbi-image-preview__image-wrapper");if(!g)return;const y=p.clientX-i,h=p.clientY-a;g.scrollLeft=o-y,g.scrollTop=s-h});const d=()=>{r=!1,l.clear(),c=0;try{const p=document.querySelector("[data-nimbi-preview-image]");p&&(p.classList.add("is-panning"),p.classList.remove("is-grabbing"))}catch{}};e.addEventListener("pointerup",d),e.addEventListener("pointercancel",d)}function om(e){const{contentWrap:t,navWrap:n,container:r,mountOverlay:i=null,t:a,contentBase:o,homePage:s,initialDocumentTitle:l,runHooks:c,allowEmbeddedScripts:u=!1,signal:f}=e||{};if(!t||!(t instanceof HTMLElement))throw new TypeError("contentWrap must be an HTMLElement");let d=null;const p={},m=Ap(a,[{path:s,name:a("home"),isIndex:!0,children:[]}]),g=new Map,y=12;let h=!1,_=!1;function w(R){try{if(!R)return;if(typeof R.replaceChildren=="function")return R.replaceChildren();for(;R.firstChild;)R.removeChild(R.firstChild)}catch{try{R&&(R.innerHTML="")}catch{}}}function b(R){try{const N=String(R?.raw||""),M=N.length;return`${M}:${N.slice(0,120)}:${N.slice(Math.max(0,M-120))}`}catch{return"0::"}}function x(R){const N=g.get(R);return N?(g.delete(R),g.set(R,N),N):null}function z(R,N){try{for(g.has(R)&&g.delete(R),g.set(R,N);g.size>y;){const M=g.keys().next().value;g.delete(M)}}catch{}}async function D(R,N){let M,A,O;try{({data:M,pagePath:A,anchor:O}=await Of(R,o))}catch(ce){const De=ce?.message?String(ce.message):"",Ke=(!ke||typeof ke!="string"||!ke)&&/no page data/i.test(De);try{if(Ke)try{k("[nimbi-cms] fetchPageData (expected missing)",ce)}catch{}else try{Fr("[nimbi-cms] fetchPageData failed",ce)}catch{}}catch{}try{!ke&&n&&w(n)}catch{}_l(t,a,ce);return}!O&&N&&(O=N);try{_s(null)}catch(ce){k("[nimbi-cms] scrollToAnchorOrTop failed",ce)}try{w(t)}catch{try{t.innerHTML=""}catch{}}const H=`${String(A??"")}|||${b(M)}`,L=x(H);let Q,ee,he,me,xe,Pe;L?.articleTemplate?(Q=L.articleTemplate.cloneNode(!0),he=L.tocTemplate?L.tocTemplate.cloneNode(!0):null,me=Q.querySelector("h1"),xe=me?(me.textContent||"").trim():L.h1Text||"",Pe=L.slugKey||me&&me.id||"",ee={meta:Object.assign({},L.meta||{})}):({article:Q,parsed:ee,toc:he,topH1:me,h1Text:xe,slugKey:Pe}=await Np(a,M,A,O,o),z(H,{articleTemplate:Q.cloneNode(!0),tocTemplate:he?he.cloneNode(!0):null,meta:Object.assign({},ee?.meta||{}),h1Text:xe||"",slugKey:Pe||""})),Mf(a,l,ee,he,Q,A,O,me,xe,Pe,M);try{w(n)}catch{try{n.innerHTML=""}catch{}}he&&(n.appendChild(he),Fp(he));try{await c("transformHtml",{article:Q,parsed:ee,toc:he,pagePath:A,anchor:O,topH1:me,h1Text:xe,slugKey:Pe,data:M})}catch(ce){k("[nimbi-cms] transformHtml hooks failed",ce)}try{if(!document.querySelector(".nimbi-skip-link")){const ce=document.createElement("a");ce.className="nimbi-skip-link",ce.href="#main",ce.textContent="Skip to content",ce.setAttribute("aria-label","Skip to content");const De=document.querySelector(".nimbi-mount")||document.querySelector(".nimbi-cms")||document.body;De&&De.firstChild?De.insertBefore(ce,De.firstChild):De&&De.appendChild(ce)}}catch{}try{let ce=t.querySelector("main.nimbi-main");ce||(ce=document.createElement("main"),ce.className="nimbi-main",t.appendChild(ce)),ce.appendChild(Q)}catch{t.appendChild(Q)}try{Nl(Q)}catch(ce){k("[nimbi-cms] observeCodeBlocks failed",ce)}try{Ip(Q,u)}catch(ce){k("[nimbi-cms] executeEmbeddedScripts failed",ce)}try{sm(Q,{t:a})}catch(ce){k("[nimbi-cms] attachImagePreview failed",ce)}try{Na(r,100,!1),typeof requestAnimationFrame=="function"&&requestAnimationFrame(()=>Na(r,100,!1))}catch(ce){k("[nimbi-cms] setEagerForAboveFoldImages failed",ce)}_s(O),Wp(Q,me,{mountOverlay:i,container:r,navWrap:n,t:a});try{await c("onPageLoad",{data:M,pagePath:A,anchor:O,article:Q,toc:he,topH1:me,h1Text:xe,slugKey:Pe,contentWrap:t,navWrap:n})}catch(ce){k("[nimbi-cms] onPageLoad hooks failed",ce)}d=A}async function B(){const R=typeof performance<"u"&&typeof performance.now=="function"?performance.now():null;if(h){_=!0;return}h=!0;try{try{Ll("renderByQuery")}catch{}let N=yt(location.href);try{if(N?.type==="path"&&N?.page&&o)try{const O=typeof o=="string"?new URL(o,location.href).pathname:"",H=String(O??"").replace(/^\/+|\/+$/g,""),L=String(N.page??"").replace(/^\/+|\/+$/g,"");H&&L===H&&(N.page=null)}catch{}}catch{}if(N?.type==="path"&&N?.page)try{let O="?page="+encodeURIComponent(N.page||"");N.params&&(O+=(O.includes("?")?"&":"?")+N.params),N.anchor&&(O+="#"+encodeURIComponent(N.anchor));try{history.replaceState(history.state,"",O)}catch{try{history.replaceState({},"",O)}catch{}}N=yt(location.href)}catch{}const M=N?.page?N.page:s,A=N?.anchor?N.anchor:null;if(typeof document.startViewTransition=="function")try{await document.startViewTransition(async()=>{await D(M,A)}).finished}catch{}else await D(M,A)}catch(N){k("[nimbi-cms] renderByQuery failed",N);try{!ke&&n&&w(n)}catch{}_l(t,a,N)}finally{if(R!==null)try{const N=performance.now()-R;typeof window<"u"&&window.__nimbiRenderTimings&&window.__nimbiRenderTimings.push(N)}catch{}if(h=!1,_){_=!1;try{await B()}catch{}}}}const j=(R,N,M,A)=>{f?R.addEventListener(N,M,{...A,signal:f}):R.addEventListener(N,M,A)};j(window,"popstate",B),j(window,"hashchange",B);const re=()=>`nimbi-cms-scroll:${location.pathname}${location.search}`,ae=()=>{try{const R=r||document.querySelector(".nimbi-cms");if(!R)return;const N={top:R.scrollTop||0,left:R.scrollLeft||0};sessionStorage.setItem(re(),JSON.stringify(N))}catch(R){if(R&&R.name==="QuotaExceededError"){try{p[re()]={top:(r||document.querySelector(".nimbi-cms"))?.scrollTop||0,left:(r||document.querySelector(".nimbi-cms"))?.scrollLeft||0}}catch{}return}k("[nimbi-cms] save scroll position failed",R)}},J=()=>{try{const R=r||document.querySelector(".nimbi-cms");if(!R)return;let N=null;try{const M=sessionStorage.getItem(re());M&&(N=JSON.parse(M))}catch{}!N&&p[re()]&&(N=p[re()]),N&&typeof N?.top=="number"&&R.scrollTo({top:N.top,left:N.left||0,behavior:"auto"})}catch{}};return j(window,"pageshow",R=>{if(R.persisted)try{J(),Na(r,100,!1)}catch(N){k("[nimbi-cms] bfcache restore failed",N)}}),j(window,"pagehide",()=>{try{ae()}catch(R){k("[nimbi-cms] save scroll position failed",R)}}),{renderByQuery:B,siteNav:m,getCurrentPagePath:()=>d}}function lm(e){try{let t=typeof e=="string"?e:typeof window<"u"&&window.location?window.location.search:"";if(!t&&typeof window<"u"&&window.location)try{const a=yt(window.location.href);a&&a.params&&(t=a.params.startsWith("?")?a.params:"?"+a.params)}catch{t=""}if(!t)return{};const n=new URLSearchParams(t.startsWith("?")?t.slice(1):t),r={},i=a=>{if(a==null)return;const o=String(a).toLowerCase();if(o==="1"||o==="true"||o==="yes")return!0;if(o==="0"||o==="false"||o==="no")return!1};if(n.has("contentPath")&&(r.contentPath=n.get("contentPath")),n.has("searchIndex")){const a=i(n.get("searchIndex"));typeof a=="boolean"&&(r.searchIndex=a)}if(n.has("searchIndexMode")){const a=n.get("searchIndexMode");(a==="eager"||a==="lazy")&&(r.searchIndexMode=a)}if(n.has("defaultStyle")){const a=n.get("defaultStyle");(a==="light"||a==="dark"||a==="system")&&(r.defaultStyle=a)}if(n.has("bulmaCustomize")&&(r.bulmaCustomize=n.get("bulmaCustomize")),n.has("lang")&&(r.lang=n.get("lang")),n.has("l10nFile")){const a=n.get("l10nFile");r.l10nFile=a==="null"?null:a}if(n.has("cacheTtlMinutes")){const a=Number(n.get("cacheTtlMinutes"));Number.isFinite(a)&&a>=0&&(r.cacheTtlMinutes=a)}if(n.has("cacheMaxEntries")){const a=Number(n.get("cacheMaxEntries"));Number.isInteger(a)&&a>=0&&(r.cacheMaxEntries=a)}if(n.has("homePage")&&(r.homePage=n.get("homePage")),n.has("navigationPage")&&(r.navigationPage=n.get("navigationPage")),n.has("notFoundPage")){const a=n.get("notFoundPage");r.notFoundPage=a==="null"?null:a}if(n.has("availableLanguages")&&(r.availableLanguages=n.get("availableLanguages").split(",").map(a=>a.trim()).filter(Boolean)),n.has("fetchConcurrency")){const a=Number(n.get("fetchConcurrency"));Number.isInteger(a)&&a>=1&&(r.fetchConcurrency=a)}if(n.has("negativeFetchCacheTTL")){const a=Number(n.get("negativeFetchCacheTTL"));Number.isFinite(a)&&a>=0&&(r.negativeFetchCacheTTL=a)}if(n.has("indexDepth")){const a=Number(n.get("indexDepth"));Number.isInteger(a)&&(a===1||a===2||a===3)&&(r.indexDepth=a)}if(n.has("noIndexing")){const a=(n.get("noIndexing")||"").split(",").map(o=>o.trim()).filter(Boolean);a.length&&(r.noIndexing=a)}return r}catch{return{}}}function Xa(e){if(typeof e!="string")return!1;const t=e.trim();if(!t||t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))return!1;const n=t.replace(/^\.\//,"");return!!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n)}function cm(e){if(typeof e!="string")return!1;const t=e.trim();if(!t)return!1;if(t==="."||t==="./")return!0;if(t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))return!1;const n=t.replace(/^\.\//,"");return!!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\/?$/.test(n)}var um="monokai",Bi="",Ui=null;async function Yc(e={}){if(!e||typeof e!="object")throw new TypeError("initCMS(options): options must be an object");const t=lm();if(t&&(t.contentPath||t.homePage||t.notFoundPage||t.navigationPage))if(e&&e.allowUrlPathOverrides===!0)try{k("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage/navigationPage")}catch{}else{try{k("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage/navigationPage")}catch{}delete t.contentPath,delete t.homePage,delete t.notFoundPage,delete t.navigationPage}const n=Object.assign({},t,e);try{Object.prototype.hasOwnProperty.call(n,"debugLevel")&&pu(n.debugLevel)}catch{}try{kn("[nimbi-cms] initCMS called",()=>({options:n}))}catch{}t&&typeof t.bulmaCustomize=="string"&&t.bulmaCustomize.trim()&&(n.bulmaCustomize=t.bulmaCustomize);let{el:r,contentPath:i="/content",crawlMaxQueue:a=1e3,searchIndex:o=!0,searchIndexMode:s="eager",indexDepth:l=1,noIndexing:c=void 0,defaultStyle:u="light",bulmaCustomize:f="none",lang:d=void 0,l10nFile:p=null,cacheTtlMinutes:m=5,cacheMaxEntries:g,markdownExtensions:y,availableLanguages:h,homePage:_=null,notFoundPage:w=null,navigationPage:b="_navigation.md",allowEmbeddedScripts:x=!1,exposeSitemap:z=!0,cspNonce:D=null}=n;try{typeof _=="string"&&_.startsWith("./")&&(_=_.replace(/^\.\//,""))}catch{}try{typeof w=="string"&&w.startsWith("./")&&(w=w.replace(/^\.\//,""))}catch{}try{typeof b=="string"&&b.startsWith("./")&&(b=b.replace(/^[.]\//,""))}catch{}const{navbarLogo:B="favicon"}=n,{skipRootReadme:j=!1}=n,re=R=>{try{const N=document.querySelector(r);if(N&&N instanceof Element)try{const M=()=>{const O=document.createElement("div");O.className="nimbi-init-error";const H=document.createElement("strong");H.textContent="NimbiCMS failed to initialize:",O.appendChild(H);try{O.appendChild(document.createElement("br"))}catch{}const L=document.createElement("pre");return L.textContent=String(R),O.appendChild(L),O},A=M();try{if(typeof N.replaceChildren=="function")N.replaceChildren(A);else{for(;N.firstChild;)N.removeChild(N.firstChild);N.appendChild(A)}}catch{try{for(;N.firstChild;)N.removeChild(N.firstChild);N.appendChild(M())}catch{}}}catch{}}catch{}};if(n.contentPath!=null&&!cm(n.contentPath))throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');if(_!=null&&!Xa(_))throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');if(w!=null&&!Xa(w))throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');if(b!=null&&!Xa(b))throw new TypeError('initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html');if(!r)throw new Error("el is required");let ae=r;if(typeof r=="string"){if(ae=document.querySelector(r),!ae)throw new Error(`el selector "${r}" did not match any element`)}else if(!(r instanceof Element))throw new TypeError("el must be a CSS selector string or a DOM element");try{if(ae&&ae._nimbiCmsInitialized)throw new Error("initCMS already called on this element")}catch(R){if(R instanceof Error&&/already called/.test(R.message))throw R}if(typeof i!="string"||!i.trim())throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');if(typeof o!="boolean")throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');if(s!=null&&s!=="eager"&&s!=="lazy")throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');if(l!=null&&l!==1&&l!==2&&l!==3)throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');if(u!=="light"&&u!=="dark"&&u!=="system")throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');if(f!=null&&typeof f!="string")throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');if(d!=null&&typeof d!="string")throw new TypeError('initCMS(options): "lang" must be a string when provided');if(p!=null&&typeof p!="string")throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');if(m!=null&&(typeof m!="number"||!Number.isFinite(m)||m<0))throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');if(g!=null&&(typeof g!="number"||!Number.isInteger(g)||g<0))throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');if(y!=null&&(!Array.isArray(y)||y.some(R=>!R||typeof R!="object")))throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');if(h!=null&&(!Array.isArray(h)||h.some(R=>typeof R!="string"||!R.trim())))throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');if(c!=null&&(!Array.isArray(c)||c.some(R=>typeof R!="string"||!R.trim())))throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');if(c=Array.isArray(c)?Array.from(new Set(c.map(R=>{try{return se(String(R??""))}catch{return""}}).filter(Boolean))):void 0,j!=null&&typeof j!="boolean")throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');if(x!=null&&typeof x!="boolean")throw new TypeError('initCMS(options): "allowEmbeddedScripts" must be a boolean when provided');if(n.fetchConcurrency!=null&&(typeof n.fetchConcurrency!="number"||!Number.isInteger(n.fetchConcurrency)||n.fetchConcurrency<1))throw new TypeError('initCMS(options): "fetchConcurrency" must be a positive integer when provided');if(n.negativeFetchCacheTTL!=null&&(typeof n.negativeFetchCacheTTL!="number"||!Number.isFinite(n.negativeFetchCacheTTL)||n.negativeFetchCacheTTL<0))throw new TypeError('initCMS(options): "negativeFetchCacheTTL" must be a non-negative number (ms) when provided');if(_!=null&&(typeof _!="string"||!_.trim()||!/\.(md|html)$/.test(_)))throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');if(w!=null&&(typeof w!="string"||!w.trim()||!/\.(md|html)$/.test(w)))throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');const J=!!o;try{Xl(!!j)}catch(R){k("[nimbi-cms] setSkipRootReadme failed",R)}try{try{n?.seoMap&&typeof n.seoMap=="object"&&Af(n.seoMap)}catch{}try{lh()}catch{}try{D&&uh(D)}catch{}try{const R="11.12.0";R&&ch(R,um)}catch{}try{typeof window<"u"&&(window.__nimbiRenderingErrors__||(window.__nimbiRenderingErrors__=[]),window.addEventListener("error",function(R){try{const N={type:"error",message:R?.message?String(R.message):"",filename:R?.filename?String(R.filename):"",lineno:R?.lineno?R.lineno:null,colno:R?.colno?R.colno:null,stack:R?.error?.stack?R.error.stack:null,time:Date.now()};try{k("[nimbi-cms] runtime error",N.message)}catch{}window.__nimbiRenderingErrors__.push(N)}catch{}},{signal:Ui.signal}),window.addEventListener("unhandledrejection",function(R){try{const N={type:"unhandledrejection",reason:R?.reason?String(R.reason):"",time:Date.now()};try{k("[nimbi-cms] unhandledrejection",N.reason)}catch{}window.__nimbiRenderingErrors__.push(N)}catch{}}))}catch{}try{const R=yt(typeof window<"u"?window.location.href:""),N=R?.page?R.page:_||void 0;try{Sf()}catch{}try{N&&Tf(N,Bi||"")}catch{}}catch{}await(async()=>{try{ae.classList.add("nimbi-mount")}catch(E){k("[nimbi-cms] mount element setup failed",E)}const R=document.createElement("section");R.className="section";const N=document.createElement("div");N.className="container nimbi-cms";const M=document.createElement("div");M.className="columns";const A=document.createElement("div");A.className="column is-hidden-mobile is-3-tablet nimbi-nav-wrap",A.setAttribute("role","navigation");try{const E=typeof Gn=="function"?Gn("navigation"):null;E&&A.setAttribute("aria-label",E)}catch(E){k("[nimbi-cms] set nav aria-label failed",E)}M.appendChild(A);const O=document.createElement("main");O.className="column nimbi-content",O.setAttribute("role","main"),M.appendChild(O),N.appendChild(M),R.appendChild(N);const H=A,L=O;ae.appendChild(R);let Q=null;try{Q=ae.querySelector(".nimbi-overlay"),Q||(Q=document.createElement("div"),Q.className="nimbi-overlay",ae.appendChild(Q))}catch(E){Q=null,k("[nimbi-cms] mount overlay setup failed",E)}const ee=location.pathname||"/";let he;if(ee.endsWith("/"))he=ee;else{const E=ee.substring(ee.lastIndexOf("/")+1);E&&!E.includes(".")?he=ee+"/":he=ee.substring(0,ee.lastIndexOf("/")+1)}try{Bi=document.title||""}catch(E){Bi="",k("[nimbi-cms] read initial document title failed",E)}let me=i;Object.prototype.hasOwnProperty.call(n,"contentPath");const xe=typeof location<"u"&&location?.origin?location.origin:"http://localhost",Pe=new URL(he,xe).toString();(me==="."||me==="./")&&(me="");try{me=String(me??"").replace(/\\/g,"/")}catch{me=String(me??"")}me.startsWith("/")&&(me=me.replace(/^\/+/,"")),me&&!me.endsWith("/")&&(me=me+"/");try{if(me&&he&&he!=="/"){const E=he.replace(/^\/+/,"").replace(/\/+$/,"")+"/";E&&me.startsWith(E)&&(me=me.slice(E.length))}}catch{}try{if(me)var ce=new URL(me,Pe.endsWith("/")?Pe:Pe+"/").toString();else var ce=Pe}catch{try{if(me)var ce=new URL("/"+me,xe).toString();else var ce=new URL(he,xe).toString()}catch{var ce=xe}}p&&await Rs(p,he),h&&Array.isArray(h)&&Jl(h),d&&Ls(d);try{if(typeof document<"u"&&document.documentElement){const E=typeof d=="string"&&d.trim()?d.trim().split("-")[0]:Bt;try{document.documentElement.setAttribute("lang",E)}catch{}try{const P=new Intl.Locale(E||"en"),G=P.textInfo&&P.textInfo.direction==="rtl"||["ar","he","fa","ur","ps","sd","ug","ku","dv","yi"].includes(String(E||"").split("-")[0].toLowerCase());document.documentElement.setAttribute("dir",G?"rtl":"ltr")}catch{}}}catch{}if(typeof m=="number"&&m>=0&&typeof Uo=="function"&&Uo(m*60*1e3),typeof g=="number"&&g>=0&&typeof Bo=="function"&&Bo(g),y&&Array.isArray(y)&&y.length)try{y.forEach(E=>{typeof E=="object"&&pp&&typeof ds=="function"&&ds(E)})}catch(E){k("[nimbi-cms] applying markdownExtensions failed",E)}try{if(typeof a=="number")try{cc(a)}catch(E){k("[nimbi-cms] setDefaultCrawlMaxQueue failed",E)}if(typeof n.fetchConcurrency=="number")try{oc(n.fetchConcurrency)}catch(E){k("[nimbi-cms] setFetchConcurrency failed",E)}if(typeof n.negativeFetchCacheTTL=="number")try{sc(n.negativeFetchCacheTTL)}catch(E){k("[nimbi-cms] setFetchNegativeCacheTTL failed",E)}}catch(E){k("[nimbi-cms] setDefaultCrawlMaxQueue failed",E)}try{try{const E=n?.manifest?n.manifest:typeof globalThis<"u"&&globalThis.__NIMBI_CMS_MANIFEST__?globalThis.__NIMBI_CMS_MANIFEST__:typeof window<"u"&&window.__NIMBI_CMS_MANIFEST__?window.__NIMBI_CMS_MANIFEST__:null;if(E&&typeof E=="object")try{ic(E),kn?.("[nimbi-cms diagnostic] applied content manifest",()=>({manifestKeys:Object.keys(E).length}))}catch(P){k?.("[nimbi-cms] applying content manifest failed",P)}try{try{const P=yt(typeof window<"u"?window.location.href:"");if(P)try{if(P.type==="cosmetic")try{ji(P)}catch{}else if(P.type==="canonical")try{ji(P)}catch{}else if(P.type==="path")try{const G=(typeof location<"u"&&location?.pathname?String(location.pathname):"/").replace(/\/\/+$/,""),U=(he||"").replace(/\/\/+$/,"");let C="";try{C=new URL(ce).pathname.replace(/\/\/+$/,"")}catch{C=""}if(G===U||G===C||G==="")try{ji({type:"path",page:null,anchor:P.anchor||null,params:P.params||""})}catch{}}catch{}}catch{}}catch{}Us(ce)}catch(P){k("[nimbi-cms] setContentBase failed",P)}try{try{kn("[nimbi-cms diagnostic] after setContentBase",()=>({manifestKeys:Object.keys(E??{}).length??0,slugToMdSize:ie?.size??void 0,allMarkdownPathsLength:ht?.length??void 0,allMarkdownPathsSetSize:Qe?.size??void 0,searchIndexLength:searchIndex?.length??void 0}))}catch{}}catch{}}catch{}}catch(E){k("[nimbi-cms] setContentBase failed",E)}try{nc(w)}catch(E){k("[nimbi-cms] setNotFoundPage failed",E)}try{if(typeof window<"u"&&window.__nimbiAutoAttachSitemapUI)try{Ya&&typeof xs=="function"&&xs(document.body,{filename:"sitemap.json"})}catch{}}catch{}let De=null,Ke=null;try{if(!Object.prototype.hasOwnProperty.call(n,"homePage")&&b)try{const P=[],G=[];try{b&&G.push(String(b))}catch{}try{const C=String(b??"").replace(/^_/,"");C&&C!==String(b)&&G.push(C)}catch{}try{G.push("navigation.md")}catch{}try{G.push("assets/navigation.md")}catch{}const U=[];for(const C of G)try{if(!C)continue;const F=String(C);U.includes(F)||U.push(F)}catch{}for(const C of U){P.push(C);try{if(Ke=await Xe(C,ce,{force:!0}),Ke&&Ke.raw){try{b=C}catch{}try{k("[nimbi-cms] fetched navigation candidate",C,"contentBase=",ce)}catch{}De=await pr(Ke.raw||"");try{const F=at();if(F&&De&&De.html){const $=F.parseFromString(De.html,"text/html").querySelector("a");if($)try{const te=$?.getAttribute?.("href")||"",W=yt(te);try{k("[nimbi-cms] parsed nav first-link href",te,"->",W)}catch{}if(W?.page&&(W.type==="path"||W.type==="canonical")&&(W.page.includes(".")||W.page.includes("/"))){_=W.page;try{k("[nimbi-cms] derived homePage from navigation",_)}catch{}break}}catch{}}}catch{}}}catch{}}}catch{}try{k("[nimbi-cms] final homePage before slugManager setHomePage",_)}catch{}try{rc(_)}catch(P){k("[nimbi-cms] setHomePage failed",P)}let E=!0;try{const P=yt(typeof location<"u"?location.href:"");P&&P.type==="cosmetic"&&(typeof w>"u"||w==null)&&(E=!1)}catch{}if(E&&_)try{await Xe(_,ce,{force:!0})}catch(P){throw new Error(`Required ${_} not found at ${ce}${_}: ${P&&P.message?P.message:String(P)}`)}}catch(E){throw E}zl(u),await Ol(f,he),Ui=typeof window<"u"?new AbortController:{signal:{abort:()=>{}}};const ot=om({contentWrap:L,navWrap:H,container:N,mountOverlay:Q,t:Gn,contentBase:ce,homePage:_,initialDocumentTitle:Bi,runHooks:Ja,allowEmbeddedScripts:x,signal:Ui.signal});try{if(typeof window<"u"){try{window.__nimbiUI=ot,window.__nimbiRenderTimings||(window.__nimbiRenderTimings=[])}catch{}window.addEventListener("nimbi.coldRouteResolved",function(E){ot?.renderByQuery?.().catch(P=>{k?.("[nimbi-cms] renderByQuery failed for cold-route event",P)})}),(Array.isArray(window.__nimbiColdRouteResolved)?window.__nimbiColdRouteResolved.slice():null)?.length&&(ot?.renderByQuery?.().catch(()=>{}),window.__nimbiColdRouteResolved=[])}}catch{}try{const E=document.createElement("header");E.className="nimbi-site-navbar",ae.insertBefore(E,R);let P=Ke,G=De;G||(P=await Xe(b,ce,{force:!0}),G=await pr(P.raw||""));const{navbar:U,linkEls:C}=await rm(E,N,G.html||"",ce,_,Gn,ot.renderByQuery,J,s,l,c,B,Ui.signal);try{await Ja("onNavBuild",{navWrap:H,navbar:U,linkEls:C,contentBase:ce})}catch(F){k("[nimbi-cms] onNavBuild hooks failed",F)}try{try{if(C&&C.length){for(const F of Array.from(C||[]))try{const $=F?.getAttribute?.("href")||"";if(!$)continue;let te=String($??"").split(/::|#/,1)[0];if(te=String(te??"").split("?")[0],!te)continue;/\.(?:md|html?)$/.test(te)||(te=te+".html");let W=null;try{W=se(String(te??""))}catch{W=String(te??"")}const V=String(W??"").replace(/^.*\//,"").replace(/\?.*$/,"");if(!V)continue;try{let Z=null;try{Z=be(V.replace(/\.(?:md|html?)$/i,""))}catch{Z=String(V??"").replace(/\s+/g,"-").toLowerCase()}if(!Z)continue;let oe=Z;try{if(ie&&typeof ie.has=="function"&&ie.has(Z)){const ge=ie.get(Z);let Ne=!1;try{if(typeof ge=="string")ge===te&&(Ne=!0);else if(ge&&typeof ge=="object"){ge.default===te&&(Ne=!0);for(const Re of Object.keys(ge.langs||{}))if(ge.langs[Re]===te){Ne=!0;break}}}catch{}if(!Ne)try{oe=Tn(Z,new Set(ie.keys()))}catch{oe=Z}}}catch{}try{try{vt(oe,W)}catch{}try{_e?.set?.(W,oe)}catch{}try{if(!Qe?.has?.(W))try{Qe?.add?.(W),Array.isArray(ht)&&ht.push(W)}catch{}}catch{}}catch{}}catch{}}catch{}try{lr(ce)}catch{}}}catch{}}catch{}try{let F=!1;try{const $=new URLSearchParams(location.search||"");($.has("sitemap")||$.has("rss")||$.has("atom"))&&(F=!0)}catch{}try{const $=(location.pathname||"/").replace(/\/\/+/g,"/").split("/").filter(Boolean).pop()||"";$&&/^(sitemap|sitemap\.xml|rss|rss\.xml|atom|atom\.xml)$/i.test($)&&(F=!0)}catch{}if(F)try{try{const $=[];_&&$.push(_),b&&$.push(b);try{await Jp({contentBase:ce,indexDepth:Math.max(l||1,3),noIndexing:c,seedPaths:$.length?$:void 0,startBuild:!0,timeoutMs:1/0})}catch{}}catch{}try{if(Ya&&typeof ai=="function"&&await ai({includeAllMarkdown:!0,homePage:_,navigationPage:b,notFoundPage:w,contentBase:ce,indexDepth:l,noIndexing:c}))return}catch{}}catch{}else if(z===!0||typeof window<"u"&&window.__nimbiExposeSitemap)try{if(Ya&&typeof Ss=="function")try{Ss({includeAllMarkdown:!0,homePage:_,navigationPage:b,notFoundPage:w,contentBase:ce,indexDepth:l,noIndexing:c}).catch(()=>{})}catch{}}catch{}}catch{}try{try{if(typeof lr=="function")try{lr(ce);try{try{kn("[nimbi-cms diagnostic] after refreshIndexPaths",()=>({slugToMdSize:typeof ie?.size=="number"?ie?.size:void 0,allMarkdownPathsLength:Array.isArray(ht)?ht.length:void 0,allMarkdownPathsSetSize:typeof Qe?.size=="number"?Qe?.size:void 0}))}catch{}}catch{}try{const $=typeof ie?.size=="number"?ie?.size:0;let te=!1;try{if(!manifest){$<30&&(te=!0);try{const W=yt(typeof location<"u"?location.href:"");if(W){if(W.type==="cosmetic"&&W.page)try{ie.has(W.page)||(te=!0)}catch{}else if((W.type==="path"||W.type==="canonical")&&W.page)try{const V=se(W.page);!_e?.has?.(V)&&!Qe?.has?.(V)&&(te=!0)}catch{}}}catch{}}}catch{}if(te){let W=null;try{W=typeof window<"u"&&(window.__nimbiSitemapFinal||window.__nimbiResolvedIndex||window.__nimbiSearchIndex||window.__nimbiLiveSearchIndex||window.__nimbiSearchIndex)||null}catch{W=null}if(Array.isArray(W)&&W.length){let V=0;for(const Z of W)try{if(!Z||!Z.slug)continue;const oe=String(Z.slug).split("::")[0];if(ie.has(oe))continue;let ge=Z.sourcePath||Z.path||null;if(!ge&&Array.isArray(W)){const Re=(W||[]).find(Oe=>Oe&&Oe.slug===Z.slug);Re&&Re.path&&(ge=Re.path)}if(!ge)continue;try{ge=String(ge)}catch{continue}let Ne=null;try{const Re=ce&&typeof ce=="string"?ce:typeof location<"u"&&location.origin?location.origin+"/":"";try{const Oe=new URL(ge,Re),Se=new URL(Re);if(Oe.origin===Se.origin){const qe=Se.pathname||"/";let Be=Oe.pathname||"";Be.startsWith(qe)&&(Be=Be.slice(qe.length)),Be.startsWith("/")&&(Be=Be.slice(1)),Ne=se(Be)}else Ne=se(Oe.pathname||"")}catch{Ne=se(ge)}}catch{Ne=se(ge)}if(!Ne)continue;Ne=String(Ne).split(/[?#]/)[0],Ne=se(Ne);try{vt(oe,Ne)}catch{}V++}catch{}if(V){try{kn("[nimbi-cms diagnostic] populated slugToMd from sitemap/searchIndex",()=>({added:V,total:typeof ie?.size=="number"?ie?.size:void 0}))}catch{}try{lr(ce)}catch{}try{typeof window<"u"&&window.__nimbiUI&&typeof window.__nimbiUI.renderByQuery=="function"&&window.__nimbiUI.renderByQuery().catch(()=>{})}catch{}}}}}catch{}}catch($){k("[nimbi-cms] refreshIndexPaths after nav build failed",$)}}catch{}const F=()=>{const $=E?.getBoundingClientRect&&Math.round(E.getBoundingClientRect().height)||E?.offsetHeight||0;if($>0){try{ae.style.setProperty("--nimbi-site-navbar-height",`${$}px`)}catch(te){k("[nimbi-cms] set CSS var failed",te)}try{N.style.paddingTop=""}catch(te){k("[nimbi-cms] set container paddingTop failed",te)}try{const te=ae?.getBoundingClientRect&&Math.round(ae.getBoundingClientRect().height)||ae?.clientHeight||0;if(te>0){const W=Math.max(0,te-$);try{N.style.setProperty("--nimbi-cms-height",`${W}px`)}catch(V){k("[nimbi-cms] set --nimbi-cms-height failed",V)}}else try{N.style.setProperty("--nimbi-cms-height","calc(100vh - var(--nimbi-site-navbar-height))")}catch(W){k("[nimbi-cms] set --nimbi-cms-height failed",W)}}catch(te){k("[nimbi-cms] compute container height failed",te)}try{E.style.setProperty("--nimbi-site-navbar-height",`${$}px`)}catch(te){k("[nimbi-cms] set navbar CSS var failed",te)}}};F();try{if(typeof ResizeObserver<"u"){const $=new ResizeObserver(()=>F());try{$.observe(E)}catch(te){k("[nimbi-cms] ResizeObserver.observe failed",te)}}}catch($){k("[nimbi-cms] ResizeObserver setup failed",$)}}catch(F){k("[nimbi-cms] compute navbar height failed",F)}}catch(E){k("[nimbi-cms] build navigation failed",E)}try{const E="1.1.0",P=F=>{const $=document.createElement("a");$.className="nimbi-version-label tag is-small",$.textContent=`nimbiCMS v. ${E}`,$.href=F||"#",$.target="_blank",$.rel="noopener noreferrer nofollow",$.setAttribute("aria-label",`nimbiCMS version ${E}`),$.classList.add("is-hidden");try{$l($)}catch{}try{ae.appendChild($);const te=()=>{try{$.classList.remove("is-hidden")}catch{}};try{setTimeout(te,3e3)}catch{te()}}catch(te){k("[nimbi-cms] append version label failed",te)}},G="https://abelvm.github.io/nimbiCMS/",U=(()=>{try{return new URL(G).toString()}catch{}return"#"})(),C=()=>{try{P(U)}catch(F){k("[nimbi-cms] building version label failed",F)}};try{let F=!1;const $=()=>{F||(F=!0,C())},te=W=>{try{window.addEventListener(W,$,{once:!0,passive:!0})}catch{try{window.addEventListener(W,$,{once:!0})}catch{}}};te("pointerdown"),te("keydown"),te("touchstart"),te("wheel")}catch(F){k("[nimbi-cms] version label defer failed",F),C()}}catch(E){k("[nimbi-cms] version label setup failed",E)}})()}catch(R){throw re(R),R}}async function hm(){try{if("1.1.0".trim())return"1.1.0"}catch{}return"0.0.0"}exports.BAD_LANGUAGES=Ts;exports.SUPPORTED_HLJS_MAP=ze;exports._clearHooks=_u;exports.addHook=fa;exports.default=Yc;exports.ensureBulma=Ol;exports.getVersion=hm;exports.initCMS=Yc;exports.loadL10nFile=Rs;exports.loadSupportedLanguages=Ms;exports.observeCodeBlocks=Nl;exports.onNavBuild=gu;exports.onPageLoad=mu;exports.registerLanguage=fr;exports.runHooks=Ja;exports.setHighlightTheme=th;exports.setLang=Ls;exports.setStyle=zl;exports.setThemeVars=dh;exports.t=Gn;exports.transformHtml=yu;
