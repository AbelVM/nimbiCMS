Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});var wh=Object.create,na=Object.defineProperty,bh=Object.getOwnPropertyDescriptor,vh=Object.getOwnPropertyNames,kh=Object.getPrototypeOf,Ql=Object.prototype.hasOwnProperty,Xl=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),Sa=(e,t)=>{let n={};for(var r in e)na(n,r,{get:e[r],enumerable:!0});return t||na(n,Symbol.toStringTag,{value:"Module"}),n},xh=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(var i=vh(t),a=0,o=i.length,s;a<o;a++)s=i[a],!Ql.call(e,s)&&s!==n&&na(e,s,{get:(l=>t[l]).bind(null,s),enumerable:!(r=bh(t,s))||r.enumerable});return e},Kl=(e,t,n)=>(n=e!=null?wh(kh(e)):{},xh(t||!e||!e.__esModule||!Ql.call(e,"default")?na(n,"default",{value:e,enumerable:!0}):n,e)),_o=Error,Sh=typeof _o.isError=="function"?_o.isError:e=>e instanceof Error;function gi(e){return Sh(e)}function Eh(e,t="ERR_ITEM"){return!e||typeof e!="object"?{error:!0,code:t,message:e?String(e):void 0,stack:void 0}:{error:!0,code:e.code||t,message:e.message,stack:e.stack}}function wo(e){return!e||!e.error?String(e):`${e.code||"ERR"}: ${e.message||""}`}function Ah(e,t){const n=new Error(`${e} queue is full`);return n.code="ERR_QUEUE_FULL",n.queueCapacity=t,n}var ra=null;if(typeof process<"u"&&process?.hrtime&&typeof process.hrtime.bigint=="function")try{const e=Number(process.hrtime.bigint()/1000000n);ra=Date.now()-e}catch{ra=null}var bo=typeof performance<"u"&&typeof performance?.now=="function"&&typeof performance?.timeOrigin=="number"?()=>performance.timeOrigin+performance.now():null;function Th(e){if(bo)try{const t=bo();return e===void 0||Math.abs(t-e)<1e3?t:e}catch{}if(ra!=null)try{const t=Number(process.hrtime.bigint()/1000000n)+ra;return e===void 0||Math.abs(t-e)<1e3?t:e}catch{return e===void 0?Date.now():e}return e===void 0?Date.now():e}var rt=()=>Th(Date.now());function Mh(e,t){const{name:n,className:r,min:i=0,integer:a=!1,allowInfinity:o=!1,fallback:s,invalidMessage:l,minMessage:c,integerMessage:f}=t;if(e==null)return s!==void 0?s:e;const u=Number(e);if(u===Number.POSITIVE_INFINITY&&o)return u;if(!Number.isFinite(u))throw new TypeError(l??`${r}: \`${n}\` must be a finite number (received ${String(e)}). A non-finite limit would silently disable the check it guards.`);if(a&&!Number.isInteger(u))throw new TypeError(f??`${r}: \`${n}\` must be a whole number (received ${String(e)}). A fractional limit is silently rounded up by the first consumer, so it admits more than the number that was configured.`);if(u<i)throw new TypeError(c??`${r}: \`${n}\` must be >= ${i} (received ${u}).`);return u}function je(e,t){const n=Mh(e,t);if(typeof n!="number")throw new TypeError(`${t.className}: \`${t.name}\` must be a number or have a \`fallback\`, but resolved to ${String(n)}.`);return n}function vo(e,t){return`${t}: \`ttl\` must be a finite number of milliseconds or Infinity (received ${JSON.stringify(e)??String(e)}). A value that is not a number concatenates rather than adds, and every expiry comparison against it is false — so the entry would never expire.`}function Jl(e,t){if(e==null||e===1/0)return 0;if(typeof e!="number"&&typeof e!="string")throw new TypeError(vo(e,t));const n=Number(e);if(!Number.isFinite(n))throw new TypeError(vo(e,t));return n}function Ch(e,t){if(e==null)return;const n=Number(e);if(!Number.isFinite(n)||!Number.isInteger(n)||n<-2147483648||n>2147483647)throw new TypeError(`${t}: \`seed\` must be a whole number in the int32 range (received ${String(e)}). The sketch mixes the seed into each hash row and truncates it to 32 bits, so a fractional or out-of-range value would silently become a different seed than the one you asked for. Omit it entirely for a random seed.`);return n}function Rh(e,{name:t,className:n,optional:r=!0}){if(e==null){if(r)return null;throw new TypeError(`${n}: \`${t}\` is required.`)}if(typeof e!="function")throw new TypeError(`${n}: \`${t}\` must be a function.`);return e}function Et(e,t,n){if(!e||typeof e!="object")return;const r=new Set(t);for(const i of Object.keys(e)){if(r.has(i))continue;const a=[`${n}: unknown option \`${i}\`.`],o=Ph(i,t);o&&a.push(`Did you mean \`${o}\`?`),a.push(`Accepted options: ${[...r].sort().join(", ")}.`);const s=new TypeError(a.join(" "));throw s.code="ERR_UNKNOWN_OPTION",s.option=i,s}}function Ph(e,t){let n=null,r=1/0;for(const a of t){const o=Lh(e,a);o<r&&(r=o,n=a)}if(n===null)return null;const i=Math.max(2,Math.floor(Math.max(e.length,n.length)/3));return r>0&&r<=i?n:null}function Lh(e,t){if(e===t)return 0;if(e.length===0)return t.length;if(t.length===0)return e.length;let n=Array.from({length:t.length+1},(r,i)=>i);for(let r=1;r<=e.length;r+=1){const i=[r];for(let a=1;a<=t.length;a+=1)i[a]=Math.min(n[a]+1,i[a-1]+1,n[a-1]+(e[r-1]===t[a-1]?0:1));n=i}return n[t.length]}var ar=Object.freeze({error:"error",warn:"warn",info:"info",log:"log",debug:"debug",table:"table"}),Nh=()=>typeof globalThis<"u"&&globalThis?.console?globalThis.console:typeof self<"u"&&self?.console?self.console:typeof window<"u"&&window?.console?window.console:typeof global<"u"&&global?.console?global.console:null,Gn=Nh();function Ih(e){return typeof Gn?.[e]=="function"}function $i(e,...t){const n=Gn;!n||typeof n[e]!="function"||n[e](...t)}function Oh(e){return typeof e=="number"?e:typeof e=="string"||typeof e=="boolean"?Number(e):e instanceof Number||e instanceof String||e instanceof Boolean?Number(e.valueOf()):NaN}function zh(e){try{return JSON.stringify(e)}catch{try{const n=typeof WeakSet=="function"?new WeakSet:new Set;return JSON.stringify(e,function(r,i){if(i&&typeof i=="object"){if(n.has(i))return"[Circular]";n.add(i)}return typeof i=="function"?`[Function: ${i.name||"anonymous"}]`:typeof i=="symbol"?String(i):typeof i=="bigint"?i.toString()+"n":i})}catch{try{return String(e)}catch{return"[Unserializable]"}}}}var ec=class{constructor(e=0,t={}){e&&typeof e=="object"&&["level","format","name","formatter","output","maxCounters"].some(r=>r in e)&&(t=e,e=void 0),Et(t,["level","format","name","formatter","output","maxCounters"],"PowerLogger"),this._debugLevel=0,this._counters=new Map,this._countersDropped=0;const n=Number(t?.maxCounters);this._maxCounters=Number.isFinite(n)&&n>=0?Math.floor(n):1e3,this._format=t?.format||"text",this.name=t?.name||null,this._formatter=typeof t?.formatter=="function"?t.formatter:null,this._output=typeof t?.output=="function"?t.output:null,this.setDebugLevel(e??t.level??0)}setDebugLevel(e){const t=Oh(e);this._debugLevel=Number.isFinite(t)&&t>=0?Math.max(0,Math.min(3,Math.floor(t))):0}getDebugLevel(){return this._debugLevel}isDebugLevel(e=1){return Number(this._debugLevel)>=Number(e||1)}isDebug(){return this.isDebugLevel(1)}_resolveLogArgs(e){return e.map(t=>{if(typeof t=="function")try{return t()}catch(n){return n}return t})}_emit(e,t,n,r,i={}){if(!this.isDebugLevel(e))return;const a=this._resolveLogArgs(r);let o={level:n,msg:i.msgArray?a:a.length===1?a[0]:a,ts:rt(),format:this._format};if(this.name&&(o.name=this.name),this._formatter)try{const s=this._formatter(o);if(s!=null){if(typeof s=="string"){if(this._output){try{this._output(s)}catch(l){this._emitSinkError(l)}return}$i(t,s);return}o=s}}catch{}if(this._output){try{this._output(o)}catch(s){this._emitSinkError(s)}return}if(Ih(t))if(this._format==="json")try{$i(t,typeof o=="string"?o:zh(o))}catch{try{$i(t,...Array.isArray(a)?a:[a])}catch{}}else $i(t,...a)}_emitSinkError(e){try{typeof console<"u"&&typeof console.error=="function"&&console.error("PowerLogger: log sink threw",e)}catch{}}error(...e){if(!this.isDebugLevel(1))return;const t=e.map(n=>{try{if(n?.error)return wo(n);if(gi(n))return wo(Eh(n))}catch{}return n});this._emit(1,"error",ar.error,t)}warn(...e){this._emit(2,"warn",ar.warn,e)}info(...e){this._emit(3,"info",ar.info,e)}log(...e){this._emit(3,"log",ar.log,e)}debug(...e){this._emit(3,"debug",ar.debug,e)}table(...e){if(!this.isDebugLevel(3)||!Gn)return;if(this._format==="json"){this._emit(3,"log",ar.table,e,{msgArray:!0});return}const t=this._resolveLogArgs(e);typeof Gn.table=="function"?Gn.table(...t):typeof Gn.log=="function"&&Gn.log(...t)}incrementCounter(e){if(!this.isDebug())return;const t=String(e||"");if(!t)return;const n=this._counters.get(t);if(n!==void 0){this._counters.delete(t),this._counters.set(t,n+1);return}if(this._maxCounters>0&&this._counters.size>=this._maxCounters){const r=this._counters.keys().next();r.done||(this._counters.delete(r.value),this._countersDropped+=1)}this._counters.set(t,1)}getDebugCounters(){return Object.fromEntries(this._counters)}getDebugCountersDropped(){return this._countersDropped}resetDebugCounters(){this._counters=new Map,this._countersDropped=0}},$n=new ec(0);function $h(e){$n.setDebugLevel(e)}function tc(e=1){return $n.isDebugLevel(e)}function nc(){return $n.isDebug()}function Gr(...e){$n.error(...e)}function x(...e){$n.warn(...e)}function nn(...e){$n.info(...e)}function ue(...e){$n.log(...e)}function yr(e){$n.incrementCounter(e)}var oi={onPageLoad:[],onNavBuild:[],transformHtml:[]};function Ea(e,t){if(!Object.prototype.hasOwnProperty.call(oi,e))throw new Error('Unknown hook "'+e+'"');if(typeof t!="function")throw new TypeError("hook callback must be a function");oi[e].push(t)}function Fh(e){Ea("onPageLoad",e)}function Dh(e){Ea("onNavBuild",e)}function Uh(e){Ea("transformHtml",e)}async function fs(e,t){const n=oi[e]||[];for(const r of n)try{await r(t)}catch(i){try{x("[nimbi-cms] runHooks callback failed",i)}catch{}}}function jh(){Object.keys(oi).forEach(e=>{oi[e].length=0})}var Bh=Xl(((e,t)=>{function n(S){return S instanceof Map?S.clear=S.delete=S.set=function(){throw new Error("map is read-only")}:S instanceof Set&&(S.add=S.clear=S.delete=function(){throw new Error("set is read-only")}),Object.freeze(S),Object.getOwnPropertyNames(S).forEach(ee=>{const he=S[ee],Re=typeof he;(Re==="object"||Re==="function")&&!Object.isFrozen(he)&&n(he)}),S}var r=class{constructor(S){S.data===void 0&&(S.data={}),this.data=S.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}};function i(S){return S.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function a(S,...ee){const he=Object.create(null);for(const Re in S)he[Re]=S[Re];return ee.forEach(function(Re){for(const We in Re)he[We]=Re[We]}),he}var o="</span>",s=S=>!!S.scope,l=(S,{prefix:ee})=>{if(S.startsWith("language:"))return S.replace("language:","language-");if(S.includes(".")){const he=S.split(".");return[`${ee}${he.shift()}`,...he.map((Re,We)=>`${Re}${"_".repeat(We+1)}`)].join(" ")}return`${ee}${S}`},c=class{constructor(S,ee){this.buffer="",this.classPrefix=ee.classPrefix,S.walk(this)}addText(S){this.buffer+=i(S)}openNode(S){if(!s(S))return;const ee=l(S.scope,{prefix:this.classPrefix});this.span(ee)}closeNode(S){s(S)&&(this.buffer+=o)}value(){return this.buffer}span(S){this.buffer+=`<span class="${S}">`}},f=(S={})=>{const ee={children:[]};return Object.assign(ee,S),ee},u=class rc{constructor(){this.rootNode=f(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(ee){this.top.children.push(ee)}openNode(ee){const he=f({scope:ee});this.add(he),this.stack.push(he)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(ee){return this.constructor._walk(ee,this.rootNode)}static _walk(ee,he){return typeof he=="string"?ee.addText(he):he.children&&(ee.openNode(he),he.children.forEach(Re=>this._walk(ee,Re)),ee.closeNode(he)),ee}static _collapse(ee){typeof ee!="string"&&ee.children&&(ee.children.every(he=>typeof he=="string")?ee.children=[ee.children.join("")]:ee.children.forEach(he=>{rc._collapse(he)}))}},h=class extends u{constructor(S){super(),this.options=S}addText(S){S!==""&&this.add(S)}startScope(S){this.openNode(S)}endScope(){this.closeNode()}__addSublanguage(S,ee){const he=S.root;ee&&(he.scope=`language:${ee}`),this.add(he)}toHTML(){return new c(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}};function p(S){return S?typeof S=="string"?S:S.source:null}function m(S){return d("(?=",S,")")}function y(S){return d("(?:",S,")*")}function g(S){return d("(?:",S,")?")}function d(...S){return S.map(ee=>p(ee)).join("")}function _(S){const ee=S[S.length-1];return typeof ee=="object"&&ee.constructor===Object?(S.splice(S.length-1,1),ee):{}}function w(...S){return"("+(_(S).capture?"":"?:")+S.map(ee=>p(ee)).join("|")+")"}function k(S){return new RegExp(S.toString()+"|").exec("").length-1}function v(S,ee){const he=S&&S.exec(ee);return he&&he.index===0}var I=new RegExp(w(/\[(?:[^\\\]]|\\.)*\]/,/\(\?<(?![=!])[^>]+>/,/\(\?'[^']+'/,/\(\??/,/\\([1-9][0-9]*)/,/\\./));function N(S,{joinWith:ee}){let he=0;return S.map(Re=>{he+=1;const We=he;let Ge=p(Re),me="";for(;Ge.length>0;){const fe=I.exec(Ge);if(!fe){me+=Ge;break}me+=Ge.substring(0,fe.index),Ge=Ge.substring(fe.index+fe[0].length),fe[0][0]==="\\"&&fe[1]?me+="\\"+String(Number(fe[1])+We):(me+=fe[0],(fe[0]==="("||/^\(\?[<']/.test(fe[0]))&&he++)}return me}).map(Re=>`(${Re})`).join(ee)}var z=/\b\B/,W="[a-zA-Z]\\w*",q="[a-zA-Z_]\\w*",ae="\\b\\d+(\\.\\d+)?",G="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",ke="\\b(0b[01]+)",Y="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",B=(S={})=>{const ee=/^#![ ]*\//;return S.binary&&(S.begin=d(ee,/.*\b/,S.binary,/\b.*/)),a({scope:"meta",begin:ee,end:/$/,relevance:0,"on:begin":(he,Re)=>{he.index!==0&&Re.ignoreMatch()}},S)},E={begin:"\\\\[\\s\\S]",relevance:0},A={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[E]},C={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[E]},M={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},se=function(S,ee,he={}){const Re=a({scope:"comment",begin:S,end:ee,contains:[]},he);Re.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const We=w("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return Re.contains.push({begin:d(/[ ]+/,"(",We,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),Re},K=se("//","$"),de=se("/\\*","\\*/"),ye=se("#","$"),Q={scope:"number",begin:ae,relevance:0},Be={scope:"number",begin:G,relevance:0},Fe={scope:"number",begin:ke,relevance:0},Se={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[E,{begin:/\[/,end:/\]/,relevance:0,contains:[E]}]},Ve={scope:"title",begin:W,relevance:0},De={scope:"title",begin:q,relevance:0},Je={begin:"\\.\\s*[a-zA-Z_]\\w*",relevance:0},D=function(S){return Object.assign(S,{"on:begin":(ee,he)=>{he.data._beginMatch=ee[1]},"on:end":(ee,he)=>{he.data._beginMatch!==ee[1]&&he.ignoreMatch()}})},T=Object.freeze({__proto__:null,APOS_STRING_MODE:A,BACKSLASH_ESCAPE:E,BINARY_NUMBER_MODE:Fe,BINARY_NUMBER_RE:ke,COMMENT:se,C_BLOCK_COMMENT_MODE:de,C_LINE_COMMENT_MODE:K,C_NUMBER_MODE:Be,C_NUMBER_RE:G,END_SAME_AS_BEGIN:D,HASH_COMMENT_MODE:ye,IDENT_RE:W,MATCH_NOTHING_RE:z,METHOD_GUARD:Je,NUMBER_MODE:Q,NUMBER_RE:ae,PHRASAL_WORDS_MODE:M,QUOTE_STRING_MODE:C,REGEXP_MODE:Se,RE_STARTERS_RE:Y,SHEBANG:B,TITLE_MODE:Ve,UNDERSCORE_IDENT_RE:q,UNDERSCORE_TITLE_MODE:De});function U(S,ee){S.input[S.index-1]==="."&&ee.ignoreMatch()}function L(S,ee){S.className!==void 0&&(S.scope=S.className,delete S.className)}function $(S,ee){ee&&S.beginKeywords&&(S.begin="\\b("+S.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",S.__beforeBegin=U,S.keywords=S.keywords||S.beginKeywords,delete S.beginKeywords,S.relevance===void 0&&(S.relevance=0))}function P(S,ee){Array.isArray(S.illegal)&&(S.illegal=w(...S.illegal))}function Z(S,ee){if(S.match){if(S.begin||S.end)throw new Error("begin & end are not supported with match");S.begin=S.match,delete S.match}}function H(S,ee){S.relevance===void 0&&(S.relevance=1)}var j=(S,ee)=>{if(!S.beforeMatch)return;if(S.starts)throw new Error("beforeMatch cannot be used with starts");const he=Object.assign({},S);Object.keys(S).forEach(Re=>{delete S[Re]}),S.keywords=he.keywords,S.begin=d(he.beforeMatch,m(he.begin)),S.starts={relevance:0,contains:[Object.assign(he,{endsParent:!0})]},S.relevance=0,delete he.beforeMatch},F=["of","and","for","in","not","or","if","then","parent","list","value"],V="keyword";function ie(S,ee,he=V){const Re=Object.create(null);return typeof S=="string"?We(he,S.split(" ")):Array.isArray(S)?We(he,S):Object.keys(S).forEach(function(Ge){Object.assign(Re,ie(S[Ge],ee,Ge))}),Re;function We(Ge,me){ee&&(me=me.map(fe=>fe.toLowerCase())),me.forEach(function(fe){const Me=fe.split("|");Re[Me[0]]=[Ge,pe(Me[0],Me[1])]})}}function pe(S,ee){return ee?Number(ee):Te(S)?0:1}function Te(S){return F.includes(S.toLowerCase())}var Le={},Ee=S=>{console.error(S)},we=(S,...ee)=>{console.log(`WARN: ${S}`,...ee)},Oe=(S,ee)=>{Le[`${S}/${ee}`]||(console.log(`Deprecated as of ${S}. ${ee}`),Le[`${S}/${ee}`]=!0)},gt=new Error;function et(S,ee,{key:he}){let Re=0;const We=S[he],Ge={},me={};for(let fe=1;fe<=ee.length;fe++)me[fe+Re]=We[fe],Ge[fe+Re]=!0,Re+=k(ee[fe-1]);S[he]=me,S[he]._emit=Ge,S[he]._multi=!0}function Fn(S){if(Array.isArray(S.begin)){if(S.skip||S.excludeBegin||S.returnBegin)throw Ee("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),gt;if(typeof S.beginScope!="object"||S.beginScope===null)throw Ee("beginScope must be object"),gt;et(S,S.begin,{key:"beginScope"}),S.begin=N(S.begin,{joinWith:""})}}function Er(S){if(Array.isArray(S.end)){if(S.skip||S.excludeEnd||S.returnEnd)throw Ee("skip, excludeEnd, returnEnd not compatible with endScope: {}"),gt;if(typeof S.endScope!="object"||S.endScope===null)throw Ee("endScope must be object"),gt;et(S,S.end,{key:"endScope"}),S.end=N(S.end,{joinWith:""})}}function gn(S){S.scope&&typeof S.scope=="object"&&S.scope!==null&&(S.beginScope=S.scope,delete S.scope)}function nr(S){gn(S),typeof S.beginScope=="string"&&(S.beginScope={_wrap:S.beginScope}),typeof S.endScope=="string"&&(S.endScope={_wrap:S.endScope}),Fn(S),Er(S)}function rr(S){function ee(me,fe){return new RegExp(p(me),"m"+(S.case_insensitive?"i":"")+(S.unicodeRegex?"u":"")+(fe?"g":""))}class he{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(fe,Me){Me.position=this.position++,this.matchIndexes[this.matchAt]=Me,this.regexes.push([Me,fe]),this.matchAt+=k(fe)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const fe=this.regexes.map(Me=>Me[1]);this.matcherRe=ee(N(fe,{joinWith:"|"}),!0),this.lastIndex=0}exec(fe){this.matcherRe.lastIndex=this.lastIndex;const Me=this.matcherRe.exec(fe);if(!Me)return null;const lt=Me.findIndex((yn,Un)=>Un>0&&yn!==void 0),tt=this.matchIndexes[lt];return Me.splice(0,lt),Object.assign(Me,tt)}}class Re{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(fe){if(this.multiRegexes[fe])return this.multiRegexes[fe];const Me=new he;return this.rules.slice(fe).forEach(([lt,tt])=>Me.addRule(lt,tt)),Me.compile(),this.multiRegexes[fe]=Me,Me}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(fe,Me){this.rules.push([fe,Me]),Me.type==="begin"&&this.count++}exec(fe){const Me=this.getMatcher(this.regexIndex);Me.lastIndex=this.lastIndex;let lt=Me.exec(fe);if(this.resumingScanAtSamePosition()&&!(lt&&lt.index===this.lastIndex)){const tt=this.getMatcher(0);tt.lastIndex=this.lastIndex+1,lt=tt.exec(fe)}return lt&&(this.regexIndex+=lt.position+1,this.regexIndex===this.count&&this.considerAll()),lt}}function We(me){const fe=new Re;return me.contains.forEach(Me=>fe.addRule(Me.begin,{rule:Me,type:"begin"})),me.terminatorEnd&&fe.addRule(me.terminatorEnd,{type:"end"}),me.illegal&&fe.addRule(me.illegal,{type:"illegal"}),fe}function Ge(me,fe){const Me=me;if(me.isCompiled)return Me;[L,Z,nr,j].forEach(tt=>tt(me,fe)),S.compilerExtensions.forEach(tt=>tt(me,fe)),me.__beforeBegin=null,[$,P,H].forEach(tt=>tt(me,fe)),me.isCompiled=!0;let lt=null;return typeof me.keywords=="object"&&me.keywords.$pattern&&(me.keywords=Object.assign({},me.keywords),lt=me.keywords.$pattern,delete me.keywords.$pattern),lt=lt||/\w+/,me.keywords&&(me.keywords=ie(me.keywords,S.case_insensitive)),Me.keywordPatternRe=ee(lt,!0),fe&&(me.begin||(me.begin=/\B|\b/),Me.beginRe=ee(Me.begin),!me.end&&!me.endsWithParent&&(me.end=/\B|\b/),me.end&&(Me.endRe=ee(Me.end)),Me.terminatorEnd=p(Me.end)||"",me.endsWithParent&&fe.terminatorEnd&&(Me.terminatorEnd+=(me.end?"|":"")+fe.terminatorEnd)),me.illegal&&(Me.illegalRe=ee(me.illegal)),me.contains||(me.contains=[]),me.contains=[].concat(...me.contains.map(function(tt){return Ei(tt==="self"?me:tt)})),me.contains.forEach(function(tt){Ge(tt,Me)}),me.starts&&Ge(me.starts,fe),Me.matcher=We(Me),Me}if(S.compilerExtensions||(S.compilerExtensions=[]),S.contains&&S.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return S.classNameAliases=a(S.classNameAliases||{}),Ge(S)}function Ar(S){return S?S.endsWithParent||Ar(S.starts):!1}function Ei(S){return S.variants&&!S.cachedVariants&&(S.cachedVariants=S.variants.map(function(ee){return a(S,{variants:null},ee)})),S.cachedVariants?S.cachedVariants:Ar(S)?a(S,{starts:S.starts?a(S.starts):null}):Object.isFrozen(S)?a(S):S}var Ai="11.12.0",Tr=class extends Error{constructor(S,ee){super(S),this.name="HTMLInjectionError",this.html=ee}},Dn=i,on=a,ln=Symbol("nomatch"),Ti=7,Mr=function(S){const ee=Object.create(null),he=Object.create(null),Re=[];let We=!0;const Ge="Could not find the language '{}', did you forget to load/include a language module?",me={disableAutodetect:!0,name:"Plain text",contains:[]};let fe={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:h};function Me(re){return fe.noHighlightRe.test(re)}function lt(re){let ve=re.className+" ";ve+=re.parentNode?re.parentNode.className:"";const Ie=fe.languageDetectRe.exec(ve);if(Ie){const Ze=Xt(Ie[1]);return Ze||(we(Ge.replace("{}",Ie[1])),we("Falling back to no-highlight mode for this block.",re)),Ze?Ie[1]:"no-highlight"}return ve.split(/\s+/).find(Ze=>Me(Ze)||Xt(Ze))}function tt(re,ve,Ie){let Ze="",it="";typeof ve=="object"?(Ze=re,Ie=ve.ignoreIllegals,it=ve.language):(Oe("10.7.0","highlight(lang, code, ...args) has been deprecated."),Oe("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),it=re,Ze=ve),Ie===void 0&&(Ie=!0);const Nt={code:Ze,language:it};hn("before:highlight",Nt);const Rt=Nt.result?Nt.result:yn(Nt.language,Nt.code,Ie);return Rt.code=Nt.code,hn("after:highlight",Rt),Rt}function yn(re,ve,Ie,Ze){const it=Object.create(null);function Nt(O,X){return O.keywords[X]}function Rt(){if(!Ce.keywords){at.addText(He);return}let O=0;Ce.keywordPatternRe.lastIndex=0;let X=Ce.keywordPatternRe.exec(He),ce="";for(;X;){ce+=He.substring(O,X.index);const _e=Wt.case_insensitive?X[0].toLowerCase():X[0],Ne=Nt(Ce,_e);if(Ne){const[st,At]=Ne;if(at.addText(ce),ce="",it[_e]=(it[_e]||0)+1,it[_e]<=Ti&&(te+=At),st.startsWith("_"))ce+=X[0];else{const vn=Wt.classNameAliases[st]||st;Gt(X[0],vn)}}else ce+=X[0];O=Ce.keywordPatternRe.lastIndex,X=Ce.keywordPatternRe.exec(He)}ce+=He.substring(O),at.addText(ce)}function It(){if(He==="")return;let O=null;if(typeof Ce.subLanguage=="string"){if(!ee[Ce.subLanguage]){at.addText(He);return}O=yn(Ce.subLanguage,He,!0,Ir[Ce.subLanguage]),Ir[Ce.subLanguage]=O._top}else O=Cr(He,Ce.subLanguage.length?Ce.subLanguage:null);Ce.relevance>0&&(te+=O.relevance),at.__addSublanguage(O._emitter,O.language)}function vt(){Ce.subLanguage!=null?It():Rt(),He=""}function Gt(O,X){O!==""&&(at.startScope(X),at.addText(O),at.endScope())}function wn(O,X){let ce=1;const _e=X.length-1;for(;ce<=_e;){if(!O._emit[ce]){ce++;continue}const Ne=Wt.classNameAliases[O[ce]]||O[ce],st=X[ce];Ne?Gt(st,Ne):(He=st,Rt(),He=""),ce++}}function Ot(O,X){return O.scope&&typeof O.scope=="string"&&at.openNode(Wt.classNameAliases[O.scope]||O.scope),O.beginScope&&(O.beginScope._wrap?(Gt(He,Wt.classNameAliases[O.beginScope._wrap]||O.beginScope._wrap),He=""):O.beginScope._multi&&(wn(O.beginScope,X),He="")),Ce=Object.create(O,{parent:{value:Ce}}),Ce}function Ii(O,X,ce){let _e=v(O.endRe,ce);if(_e){if(O["on:end"]){const Ne=new r(O);O["on:end"](X,Ne),Ne.isMatchIgnored&&(_e=!1)}if(_e){for(;O.endsParent&&O.parent;)O=O.parent;return O}}if(O.endsWithParent)return Ii(O.parent,X,ce)}function ir(O){return Ce.matcher.regexIndex===0?(He+=O[0],1):(J=!0,0)}function Fa(O){const X=O[0],ce=O.rule,_e=new r(ce),Ne=[ce.__beforeBegin,ce["on:begin"]];for(const st of Ne)if(st&&(st(O,_e),_e.isMatchIgnored))return ir(X);return ce.skip?He+=X:(ce.excludeBegin&&(He+=X),vt(),!ce.returnBegin&&!ce.excludeBegin&&(He=X)),Ot(ce,O),ce.returnBegin?0:X.length}function Oi(O){const X=O[0],ce=ve.substring(O.index),_e=Ii(Ce,O,ce);if(!_e)return ln;const Ne=Ce;Ce.endScope&&Ce.endScope._wrap?(vt(),Gt(X,Ce.endScope._wrap)):Ce.endScope&&Ce.endScope._multi?(vt(),wn(Ce.endScope,O)):Ne.skip?He+=X:(Ne.returnEnd||Ne.excludeEnd||(He+=X),vt(),Ne.excludeEnd&&(He=X));do Ce.scope&&at.closeNode(),!Ce.skip&&!Ce.subLanguage&&(te+=Ce.relevance),Ce=Ce.parent;while(Ce!==_e.parent);return _e.starts&&Ot(_e.starts,O),Ne.returnEnd?0:X.length}function bn(){const O=[];for(let X=Ce;X!==Wt;X=X.parent)X.scope&&O.unshift(X.scope);O.forEach(X=>at.openNode(X))}let Wn={};function Lr(O,X){const ce=X&&X[0];if(He+=O,ce==null)return vt(),0;if(Wn.type==="begin"&&X.type==="end"&&Wn.index===X.index&&ce===""){if(He+=ve.slice(X.index,X.index+1),!We){const _e=new Error(`0 width match regex (${re})`);throw _e.languageName=re,_e.badRule=Wn.rule,_e}return 1}if(Wn=X,X.type==="begin")return Fa(X);if(X.type==="illegal"&&!Ie){const _e=new Error('Illegal lexeme "'+ce+'" for mode "'+(Ce.scope||"<unnamed>")+'"');throw _e.mode=Ce,_e}else if(X.type==="end"){const _e=Oi(X);if(_e!==ln)return _e}if(X.type==="illegal"&&ce==="")return X.index===ve.length||(He+=`
`),1;if(R>1e5&&R>X.index*3)throw new Error("potential infinite loop, way more iterations than matches");return He+=ce,ce.length}const Wt=Xt(re);if(!Wt)throw Ee(Ge.replace("{}",re)),new Error('Unknown language: "'+re+'"');const zi=rr(Wt);let Nr="",Ce=Ze||zi;const Ir={},at=new fe.__emitter(fe);bn();let He="",te=0,b=0,R=0,J=!1;try{if(Wt.__emitTokens)Wt.__emitTokens(ve,at);else{for(Ce.matcher.considerAll();;){R++,J?J=!1:Ce.matcher.considerAll(),Ce.matcher.lastIndex=b;const O=Ce.matcher.exec(ve);if(!O)break;const X=Lr(ve.substring(b,O.index),O);b=O.index+X}Lr(ve.substring(b))}return at.finalize(),Nr=at.toHTML(),{language:re,value:Nr,relevance:te,illegal:!1,_emitter:at,_top:Ce}}catch(O){if(O.message&&O.message.includes("Illegal"))return{language:re,value:Dn(ve),illegal:!0,relevance:0,_illegalBy:{message:O.message,index:b,context:ve.slice(b-100,b+100),mode:O.mode,resultSoFar:Nr},_emitter:at};if(We)return{language:re,value:Dn(ve),illegal:!1,relevance:0,errorRaised:O,_emitter:at,_top:Ce};throw O}}function Un(re){const ve={value:Dn(re),illegal:!1,relevance:0,_top:me,_emitter:new fe.__emitter(fe)};return ve._emitter.addText(re),ve}function Cr(re,ve){ve=ve||fe.languages||Object.keys(ee);const Ie=Un(re),Ze=ve.filter(Xt).filter(Li).map(It=>yn(It,re,!1));Ze.unshift(Ie);const[it,Nt]=Ze.sort((It,vt)=>{if(It.relevance!==vt.relevance)return vt.relevance-It.relevance;if(It.language&&vt.language){if(Xt(It.language).supersetOf===vt.language)return 1;if(Xt(vt.language).supersetOf===It.language)return-1}return 0}),Rt=it;return Rt.secondBest=Nt,Rt}function jn(re,ve,Ie){const Ze=ve&&he[ve]||Ie;re.classList.add("hljs"),re.classList.add(`language-${Ze}`)}function Rr(re){let ve=null;const Ie=lt(re);if(Me(Ie))return;if(hn("before:highlightElement",{el:re,language:Ie}),re.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",re);return}if(re.children.length>0&&(fe.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(re)),fe.throwUnescapedHTML))throw new Tr("One of your code blocks includes unescaped HTML.",re.innerHTML);ve=re;const Ze=ve.textContent,it=Ie?tt(Ze,{language:Ie,ignoreIllegals:!0}):Cr(Ze);re.innerHTML=it.value,re.dataset.highlighted="yes",jn(re,Ie,it.language),re.result={language:it.language,re:it.relevance,relevance:it.relevance},it.secondBest&&(re.secondBest={language:it.secondBest.language,relevance:it.secondBest.relevance}),hn("after:highlightElement",{el:re,result:it,text:Ze})}function za(re){fe=on(fe,re)}const nt=()=>{Bn(),Oe("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function _n(){Bn(),Oe("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let Mi=!1;function Bn(){function re(){Bn()}if(document.readyState==="loading"){Mi||window.addEventListener("DOMContentLoaded",re,!1),Mi=!0;return}document.querySelectorAll(fe.cssSelector).forEach(Rr)}function Pr(re,ve){let Ie=null;try{Ie=ve(S)}catch(Ze){if(Ee("Language definition for '{}' could not be registered.".replace("{}",re)),We)Ee(Ze);else throw Ze;Ie=me}Ie.name||(Ie.name=re),ee[re]=Ie,Ie.rawDefinition=ve.bind(null,S),Ie.aliases&&Pi(Ie.aliases,{languageName:re})}function Ci(re){delete ee[re];for(const ve of Object.keys(he))he[ve]===re&&delete he[ve]}function Ri(){return Object.keys(ee)}function Xt(re){return re=(re||"").toLowerCase(),ee[re]||ee[he[re]]}function Pi(re,{languageName:ve}){typeof re=="string"&&(re=[re]),re.forEach(Ie=>{he[Ie.toLowerCase()]=ve})}function Li(re){const ve=Xt(re);return ve&&!ve.disableAutodetect}function $a(re){re["before:highlightBlock"]&&!re["before:highlightElement"]&&(re["before:highlightElement"]=ve=>{re["before:highlightBlock"](Object.assign({block:ve.el},ve))}),re["after:highlightBlock"]&&!re["after:highlightElement"]&&(re["after:highlightElement"]=ve=>{re["after:highlightBlock"](Object.assign({block:ve.el},ve))})}function Kt(re){$a(re),Re.push(re)}function Ni(re){const ve=Re.indexOf(re);ve!==-1&&Re.splice(ve,1)}function hn(re,ve){const Ie=re;Re.forEach(function(Ze){Ze[Ie]&&Ze[Ie](ve)})}function un(re){return Oe("10.7.0","highlightBlock will be removed entirely in v12.0"),Oe("10.7.0","Please use highlightElement now."),Rr(re)}Object.assign(S,{highlight:tt,highlightAuto:Cr,highlightAll:Bn,highlightElement:Rr,highlightBlock:un,configure:za,initHighlighting:nt,initHighlightingOnLoad:_n,registerLanguage:Pr,unregisterLanguage:Ci,listLanguages:Ri,getLanguage:Xt,registerAliases:Pi,autoDetection:Li,inherit:on,addPlugin:Kt,removePlugin:Ni}),S.debugMode=function(){We=!1},S.safeMode=function(){We=!0},S.versionString=Ai,S.regex={concat:d,lookahead:m,either:w,optional:g,anyNumberOfTimes:y};for(const re in T)typeof T[re]=="object"&&n(T[re]);return Object.assign(S,T),S},cn=Mr({});cn.newInstance=()=>Mr({}),t.exports=cn,cn.HighlightJS=cn,cn.default=cn})),Wh=Kl(Bh()),Qe=Wh.default,Jt=64,qh=6,Hh=63,ko=.673,Vh=27;function Gh(e){return e=e+2654435761|0,e=Math.imul(e^e>>>16,73244475),e=Math.imul(e^e>>>16,73244475),(e^e>>>16)>>>0}var Zh=class{registers;constructor(){this.registers=new Uint8Array(Jt)}addHash(e){const t=Gh(e|0),n=t&Hh,r=t>>>qh,i=r===0?Vh:Math.min(26,Math.clz32(r)-5);i>this.registers[n]&&(this.registers[n]=i)}cardinality(){let e=0,t=0;for(let n=0;n<Jt;n++){const r=this.registers[n];e+=Math.pow(2,-r),r===0&&(t+=1)}if(t===Jt)return 0;if(t>0){const n=ko*Jt*Jt/e;return n<=Jt*2.5?Math.max(1,Math.round(Jt*Math.log(Jt/t))):Math.round(n)}return Math.round(ko*Jt*Jt/e)}reset(){this.registers.fill(0)}},xo=64,So=4,Eo=10;function Yh(e,t){return e=e+t|0,e=Math.imul(e^e>>>16,73244475),e=Math.imul(e^e>>>16,73244475),(e^e>>>16)>>>0}function Qh(e){const t=String(e);let n=-2128831035;for(let r=0;r<t.length;r+=1)n=Math.imul(n^t.charCodeAt(r),16777619);return n}function Xh(e){const t=typeof e;return t==="function"||t==="object"&&e!==null}var Kh=class{constructor({width:e=xo,depth:t=So,sampleSize:n=Eo,seed:r}={}){const i=Math.max(2,1<<Math.ceil(Math.log2(Math.max(2,Math.floor(Number(e)||xo))))),a=Math.max(1,Math.min(8,Math.floor(Number(t)||So)));this.width=i,this.depth=a,this.mask=i-1,this.sampleSize=Math.max(1,Math.floor(Number(n)||Eo)),this.counters=new Uint8Array(i*a>>>1),this.sample=0,this.resets=0,this.seed=(Number.isFinite(r)?Number(r):Math.floor(Math.random()*4294967295))|0,this._hll=new Zh,this._ids=null,this._nextId=0}_hash(e){if(!Xh(e))return Qh(e);const t=this._ids||(this._ids=new WeakMap);let n=t.get(e);return n===void 0&&(n=this._nextId,this._nextId+=1,t.set(e,n)),n|0}size(){return this.counters.byteLength}_indexFor(e,t){return t*this.width+(Yh(e,this.seed+t*2654435761)&this.mask)|0}_get(e){const t=this.counters[e>>1];return e&1?t>>>4:t&15}_set(e,t){const n=e>>1,r=this.counters[n];this.counters[n]=e&1?(r&15|(t&15)<<4)&255:r&240|t&15}increment(e){const t=this._hash(e);let n=!1;for(let r=0;r<this.depth;r+=1){const i=this._indexFor(t,r),a=this._get(i);a<15&&(this._set(i,a+1),n=!0)}n&&(this._hll.addHash(t),this.sample+=1,this.sample>=this.sampleSize&&(this.reset(),this.sample=0))}estimate(e){const t=this._hash(e);let n=15;for(let r=0;r<this.depth;r+=1){const i=this._get(this._indexFor(t,r));i<n&&(n=i)}return n}reset(){const e=this.counters,t=e.length;if(t>=4){const r=new Uint32Array(e.buffer,e.byteOffset,t>>>2);for(let i=0;i<r.length;i+=1){const a=r[i];r[i]=a>>>1&117901063|(a>>>5&117901063)<<4}}for(let r=t&-4;r<t;r+=1)e[r]=e[r]>>>1&7|(e[r]>>>5&7)<<4;this.resets+=1;const n=this._hll.cardinality();this._hll.reset(),this.sampleSize=Math.max(10,Math.round(10*n))}clear(){this.counters.fill(0),this.sample=0,this.resets=0}};var Jh=".";function eu(e,t){const n={};if(typeof e!="string"||e===""||t==null||typeof t!="object")return n;const r=(i,a)=>{for(const[o,s]of Object.entries(i)){const l=a?`${a}${Jh}${o}`:o;s==null?n[l]=null:Array.isArray(s)||(typeof s=="object"?r(s,l):typeof s=="number"&&!Number.isFinite(s)?n[l]=String(s):(typeof s=="number"||typeof s=="boolean"||typeof s=="string")&&(n[l]=s))}};return r(t,e),n}var tu=class{constructor(e={}){Et(e,["prefix"],"MetricsCollector"),this._sources=new Map,this._prefix=typeof e?.prefix=="string"?e.prefix:""}register(e,t){if(typeof e!="string"||e==="")throw new TypeError("MetricsCollector.register: `name` must be a non-empty string");if(typeof t!="function")throw new TypeError("MetricsCollector.register: `read` must be a function");return this._sources.set(e,t),this}unregister(e){return this._sources.delete(e)}snapshot(){const e={},t={};for(const[n,r]of this._sources){let i;try{i=r()}catch(o){t[n]=gi(o)?o.message:String(o);continue}const a=eu(this._prefix+n,i);for(const[o,s]of Object.entries(a))e[o]=s}return{version:1,collectedAt:Date.now(),sources:[...this._sources.keys()],series:e,errors:t}}names(){return[...this._sources.keys()]}},nu=new tu;function Ds(e,t,n){const r=n?.observability;if(!r)return null;if(r!==!0){if(!(typeof r=="object"&&typeof r.register=="function"))throw new TypeError(`${t}: \`observability\` must be \`true\` or a MetricsCollector, not ${typeof r} (${String(r)}).`)}const i=r===!0?nu:r,a=e,o=a?.getStats,s=a?.stats,l=typeof o=="function"?()=>o.call(a):typeof s=="function"?()=>s.call(a):null;return l?(i.register(t,l),{name:t,unregister:()=>i.unregister(t)}):null}function Us(e){return!e||typeof e.unregister!="function"?!1:e.unregister()}function Ua(e,t,n={}){const r=setTimeout(e,t);return!n.keepProcessAlive&&typeof r?.unref=="function"&&r.unref(),r}function ja(e,t,n={}){const r=setInterval(e,t);return!n.keepProcessAlive&&typeof r?.unref=="function"&&r.unref(),r}var Aa=1e3,ru=60*Aa,ds=30*Aa,iu=1e4,qm=Object.freeze({CONNECTING:0,OPEN:1,CLOSING:2,CLOSED:3}),Ao=1e4,To=.2,Mo=1e3;var Co=60*Aa,au=1e3,Ro=ru,su=1e3,ou=5e3,lu=.05,cu=.7,hu=200,uu=16,fu=4,du=1e6;function pu(e){const t=Math.min(Math.max(1,Number(e)||1),du),n=Math.ceil(uu*t/fu);return Math.max(2,1<<Math.ceil(Math.log2(n)))}var mu=Object.freeze(["map","head","tail","pool","currentWeight","hits","misses","evictions","rejected","expirations"]),gu=Object.freeze(["maxEntries","maxInflightRefreshes","maxWeight","weightFn","defaultTTL","maxPoolSize","rejectOversized","onEvict","onExpire","initialPoolSize","maxCleanupPerTick","defaultAsyncTimeout","now","onError","admission","windowSize","seed","policy","allowStale","staleTtl","fetchMethod","observability"]),vr=class{constructor(e={}){Et(e,gu,"PowerCache");const{maxEntries:t=1/0,maxInflightRefreshes:n,maxWeight:r=1/0,weightFn:i=()=>1,defaultTTL:a=Ro,allowStale:o=!1,staleTtl:s=1/0,fetchMethod:l=null,maxPoolSize:c=au,rejectOversized:f=!1,onEvict:u=null,onExpire:h=null,initialPoolSize:p=0,maxCleanupPerTick:m=100,defaultAsyncTimeout:y=ds,onError:g=null,policy:d="lru",admission:_="none",windowSize:w=0,seed:k,now:v}=e;if(arguments.length>0&&arguments[0]!=null&&typeof arguments[0]!="object")throw new TypeError("PowerCache options must be an object");if(this.maxEntries=je(t,{name:"maxEntries",className:"PowerCache",integer:!0,min:0,allowInfinity:!0}),n===void 0?this.maxInflightRefreshes=Number.isFinite(this.maxEntries)?this.maxEntries:1024:this.maxInflightRefreshes=je(n,{name:"maxInflightRefreshes",className:"PowerCache",integer:!0,min:0}),this.maxWeight=je(r,{name:"maxWeight",className:"PowerCache",min:0,allowInfinity:!0}),this.maxPoolSize=je(c,{name:"maxPoolSize",className:"PowerCache",integer:!0,min:0,allowInfinity:!0}),this.weightFn=Rh(i,{name:"weightFn",className:"PowerCache"})?i:()=>1,this.defaultTTL=a,this.allowStale=!!o,s!==1/0&&!(Number.isFinite(s)&&s>=0))throw new TypeError(`PowerCache: \`staleTtl\` must be a non-negative finite number or Infinity (received ${String(s)}). An unparseable stale window would compare false against every entry and silently disable stale serving.`);if(this.allowStale&&!("staleTtl"in arguments[0]))throw new TypeError("PowerCache: `allowStale` requires an explicit `staleTtl`. A stale window with no bound serves a value expired at any point in the past — measured at five years — so the bound is required. Pass the window you can tolerate, or `staleTtl: Infinity` to opt out of it on purpose.");if(this.staleTtl=s,l!=null&&typeof l!="function")throw new TypeError("fetchMethod must be a function when supplied");this.fetchMethod=l,this._now=typeof v=="function"?v:rt,this.rejectOversized=!!f,this.onEvict=typeof u=="function"?u:null,this.onError=typeof g=="function"?g:null,this._weightErrors=0,this.onExpire=typeof h=="function"?h:null,this.maxCleanupPerTick=Number.isFinite(+m)?Math.max(1,+m):100,this._map=new Map,this._head=null,this._tail=null,this._pool=[];for(let N=0;N<Math.min(p||0,this.maxPoolSize);N++)this._pool.push({key:null,value:null,weight:0,expiresAt:0,prev:null,next:null,inWindow:!1,visited:!1,queue:"main"});this._currentWeight=0,this._hits=0,this._staleServes=0,this._misses=0,this._evictions=0,this._refreshesSkipped=0,this._refreshesFailed=0,this._refreshesAborted=0,this._rejected=0,this._rejectedAdmission=0,this._expirations=0;for(const N of mu){const z=`_${N}`;Object.defineProperty(this,N,{configurable:!0,enumerable:!1,get(){return this[z]},set(W){this[z]=W}})}if(this._cleanupTimer=null,this._cleanupRunning=!1,this._cleanupParams=null,this._cleanupCursor=null,this._cleanupCursorValid=!1,this._evictionCandidate=null,this._sieveHand=null,this._smallHead=null,this._smallTail=null,this._smallSize=0,this._ghostHead=null,this._ghostTail=null,this._ghostSize=0,this._smallMaxSize=0,this._ghostMaxSize=0,this._ghostMap=new Map,this._smallMap=new Map,this._policy=d==="slru"?"slru":d==="sieve"?"sieve":d==="s3fifo"?"s3fifo":"lru",this._policy==="s3fifo"){const N=Number.isFinite(this.maxEntries)?this.maxEntries:1e3;this._smallMaxSize=Math.max(1,Math.floor(N*.1)),this._ghostMaxSize=Math.max(1,Math.floor(N*.2))}const I=Ch(k,"PowerCache");this._sketch=_==="tinylfu"&&this._policy==="lru"?new Kh({width:pu(this.maxEntries),sampleSize:Math.max(1,hu*Math.min(this.maxEntries,1e6)),seed:I}):null,this._windowSize=this._sketch&&this._policy==="lru"?w===null?Math.min(Math.max(4,Math.ceil(this.maxEntries*.01)),Math.floor(this.maxEntries/4)):Math.max(0,Math.floor(Number(w)||0)):0,this._windowSize>=this.maxEntries&&this.maxEntries>=4&&(this._windowSize=Math.floor(this.maxEntries/4)),this._windowStartMemo=null,this._windowTail=null,this._probationEnd=null,this._inflightPromises=new Map,this._inflightControllers=new Map,this._defaultAsyncTimeout=Number.isFinite(Number(y))?Math.max(0,Math.floor(Number(y))):3e4,this._metrics=Ds(this,"cache",arguments[0]||{})}_allocNode(e,t,n,r){const i=this._pool.pop()||{key:null,value:null,weight:0,expiresAt:0,prev:null,next:null,inWindow:!1,visited:!1,queue:"main"};return i.key=e,i.value=t,i.weight=n||0,i.expiresAt=r||0,i.prev=null,i.next=null,i.inWindow=!1,i.visited=!1,i.queue="main",i}_computeWeight(e,t){if(t!=null){const n=+t;return Number.isFinite(n)?Math.max(0,n):0}try{const n=+this.weightFn(e);return Number.isFinite(n)?Math.max(0,n):0}catch(n){return this._weightErrors++,this._notifyError(n,"PowerCache weightFn threw"),0}}_notifyError(e,t){try{if(typeof this.onError=="function"){this.onError(e,t);return}}catch{}try{typeof console<"u"&&typeof console.error=="function"&&console.error(t,e)}catch{}}_freeNode(e){e.key=null,e.value=null,e.weight=0,e.expiresAt=0,e.prev=null,e.next=null,this._pool.length<this.maxPoolSize&&this._pool.push(e)}_removeExpiredNode(e,t){if(!e.expiresAt||e.expiresAt>t)return!1;const n=e.key,r=e.value;this._unlinkNode(e);try{this.onExpire&&this.onExpire(n,r)}catch(i){this._notifyError(i,"PowerCache onExpire callback threw")}return this._freeNode(e),this._expirations++,!0}_fetchValidNode(e,{ignoreExpiry:t=!1,countMiss:n=!1,allowExpired:r=!1,now:i}={}){let a=this._map.get(e);if(!a&&(this._policy==="s3fifo"&&(a=this._smallMap.get(e)||this._ghostMap.get(e)),!a))return n&&this._misses++,null;const o=t||!a.expiresAt?0:i!==void 0?i:this._now();return o&&a.expiresAt<=o?r?a:(this._removeExpiredNode(a,o),n&&this._misses++,null):a}_staleServable(e,t){return this.staleTtl===1/0?!0:t<=e.expiresAt+this.staleTtl}_abortInflight(e,t="evicted"){const n=this._inflightControllers.get(e);return!n||n.signal.aborted?!1:(n.abort(new Error(`PowerCache: in-flight fetch for a ${t} key was aborted`)),this._refreshesAborted+=1,!0)}_refreshStaleEntry(e,t,{ttl:n=void 0,weight:r=void 0}={}){if(this._inflightPromises.has(e))return;if(this._inflightPromises.size>=this.maxInflightRefreshes){this._refreshesSkipped+=1;return}const i=new AbortController,a=Promise.resolve().then(()=>t(i.signal)).then(o=>{try{this.set(e,o,{ttl:n,weight:r})}catch(s){this._notifyError(s,"PowerCache: storing a refreshed value threw")}return o}).catch(()=>{i.signal.aborted||(this._refreshesFailed+=1)}).finally(()=>{this._inflightControllers.delete(e),this._inflightPromises.delete(e)});this._inflightPromises.set(e,a),this._inflightControllers.set(e,i)}_append(e){if(!this._tail){if(this._policy==="s3fifo"){this._s3fifoAppendSmall(e);return}this._head=this._tail=e,this._evictionCandidate=this._head,this._policy==="slru"&&(this._probationEnd=e),this._policy==="sieve"&&(this._sieveHand=e);return}if(this._policy==="slru"){this._insertIntoProbation(e);return}if(this._policy==="sieve"){e.prev=this._tail,e.next=null,this._tail.next=e,this._tail=e;return}if(this._policy==="s3fifo"){this._s3fifoAppendSmall(e);return}e.prev=this._tail,e.next=null,this._tail.next=e,this._tail=e}_insertIntoProbation(e){const t=this._probationEnd;if(!t)e.next=this._head,e.prev=null,this._head&&(this._head.prev=e),this._head=e,this._evictionCandidate=e;else if(t===this._tail)e.prev=this._tail,e.next=null,this._tail.next=e,this._tail=e;else{const n=t.next;n&&(e.prev=t,e.next=n,t.next=e,n.prev=e)}this._probationEnd=e}_unlinkNode(e,{advanceEvictionCandidate:t=!1}={}){const n=e.next;return this._map.delete(e.key),this._currentWeight-=e.weight||0,this._cleanupCursor===e&&(this._cleanupCursor=n),this._cleanupCursorValid=!!this._cleanupCursor,t&&(this._evictionCandidate=n),this._remove(e),n}_remove(e){const t=e.prev,n=e.next;t?t.next=n:this._head=n,t||(this._evictionCandidate=this._head),n?n.prev=t:this._tail=t,this._probationEnd===e&&(this._probationEnd=t),this._policy==="sieve"&&this._sieveHand===e&&(this._sieveHand=e.next||this._head),this._policy==="s3fifo"&&(e.queue==="small"?this._s3fifoRemoveFromSmall(e):e.queue==="ghost"&&this._s3fifoRemoveFromGhost(e)),e.inWindow&&(this._windowStartMemo=null,this._windowTail=null),e.prev=e.next=null}_s3fifoAppendSmall(e){this._smallTail?(this._smallTail.next=e,e.prev=this._smallTail,this._smallTail=e):this._smallHead=this._smallTail=e,e.next=null,e.queue="small",this._smallMap.set(e.key,e),this._smallSize+=1}_s3fifoAppendMain(e){this._tail?(e.prev=this._tail,e.next=null,this._tail.next=e,this._tail=e):(this._head=this._tail=e,this._evictionCandidate=this._head),this._map.set(e.key,e)}_s3fifoAppendGhost(e){this._ghostTail?(this._ghostTail.next=e,e.prev=this._ghostTail,this._ghostTail=e):this._ghostHead=this._ghostTail=e,e.next=null,e.queue="ghost",this._ghostMap.set(e.key,e),this._ghostSize+=1}_s3fifoRemoveFromSmall(e){const t=e.prev,n=e.next;t?t.next=n:this._smallHead=n,n?n.prev=t:this._smallTail=t,this._smallMap.delete(e.key),this._smallSize-=1}_s3fifoRemoveFromGhost(e){const t=e.prev,n=e.next;t?t.next=n:this._ghostHead=n,n?n.prev=t:this._ghostTail=t,this._ghostMap.delete(e.key),this._ghostSize-=1}_moveToTail(e){if(this._policy==="slru"){const t=this._probationEnd===e,n=e.prev;if(this._tail===e){t&&(this._probationEnd=n);return}this._remove(e),e.prev=this._tail,e.next=null,this._tail&&(this._tail.next=e),this._tail=e,t&&(this._probationEnd=n);return}if(this._policy==="sieve"){e.visited=!0;return}if(this._policy==="s3fifo"){e.queue==="small"?(this._s3fifoRemoveFromSmall(e),e.queue="main",e.prev=null,e.next=null,this._s3fifoAppendMain(e),this._evictIfNeeded()):e.queue==="ghost"&&(this._s3fifoRemoveFromGhost(e),e.queue="main",e.prev=null,e.next=null,this._s3fifoAppendMain(e),this._evictIfNeeded());return}if(this._windowSize>0){if(!e.inWindow){this._remove(e),this._insertAtMainSpaceMrU(e);return}if(this._tail===e)return;this._remove(e),this._append(e);return}this._tail!==e&&(this._remove(e),this._append(e))}_windowOldest(){const e=this._windowStartMemo;if(e!==null&&(e.prev===null||!e.prev.inWindow)&&this._windowTail===this._tail)return e;let t=this._tail;if(!t||!t.inWindow)return this._windowStartMemo=null,this._windowTail=this._tail,null;for(;t.prev&&t.prev.inWindow;)t=t.prev;return this._windowStartMemo=t,this._windowTail=this._tail,t}_windowVictim(){const e=this._windowOldest();return!e||e===this._head?null:e.prev}_insertAtMainSpaceMrU(e){const t=this._windowOldest();if(!t){e.prev=this._tail,e.next=null,this._tail?this._tail.next=e:(this._head=e,this._evictionCandidate=e),this._tail=e;return}const n=t.prev;e.prev=n,e.next=t,n?n.next=e:(this._head=e,this._evictionCandidate=e),t.prev=e}_promoteFromWindow(e){this._remove(e),this._insertAtMainSpaceMrU(e),e.inWindow=!1}_evictNode(e){if(!e)return;const t=e.key,n=e.value;this._unlinkNode(e,{advanceEvictionCandidate:!0}),this._evictions++;try{this.onEvict&&this.onEvict(t,n,"evicted")}catch(r){this._notifyError(r,"PowerCache onEvict callback threw")}this._freeNode(e)}_arbitrateWindow(e){if(this._map.size<=this._windowSize)return;const t=this._windowOldest();if(!t)return;const n=this._windowVictim();if(!(n!=null&&e>=this.maxEntries)){this._promoteFromWindow(t);return}if(!n)return;const r=n.key;this._sketch.estimate(t.key)>this._sketch.estimate(r)?(this._evictNode(n),this._promoteFromWindow(t)):(this._rejectedAdmission+=1,this._evictNode(t))}_evictIfNeeded(){if(this._policy==="sieve"){this._sieveEvict();return}if(this._policy==="s3fifo"){this._s3fifoEvict();return}for(;this._map.size>this.maxEntries||this._currentWeight>this.maxWeight;){const e=this._evictionCandidate||this._head;if(!e)break;const t=e.key,n=e.value;this._abortInflight(t,"evicted"),this._unlinkNode(e,{advanceEvictionCandidate:!0}),this._evictions++;try{this.onEvict&&this.onEvict(t,n,"evicted")}catch(r){this._notifyError(r,"PowerCache onEvict callback threw")}this._freeNode(e)}this._evictionCandidate||(this._evictionCandidate=this._head)}_sieveEvict(){for(;(this._map.size>this.maxEntries||this._currentWeight>this.maxWeight)&&!(!this._sieveHand&&(this._sieveHand=this._head,!this._sieveHand));){const e=this._sieveHand;if(this._sieveHand=e.next||this._tail,e.visited){e.visited=!1;continue}const t=e.key,n=e.value;this._abortInflight(t,"evicted"),this._unlinkNode(e,{advanceEvictionCandidate:!1}),this._evictions++;try{this.onEvict&&this.onEvict(t,n,"evicted")}catch(r){this._notifyError(r,"PowerCache onEvict callback threw")}this._freeNode(e)}}_s3fifoEvict(){for(;this._smallSize>this._smallMaxSize;){const e=this._smallHead;if(!e)break;if(this._ghostSize<this._ghostMaxSize)this._s3fifoRemoveFromSmall(e),this._s3fifoAppendGhost(e);else{this._s3fifoRemoveFromSmall(e),this._evictions++;const t=e.key,n=e.value;this._abortInflight(t,"evicted");try{this.onEvict&&this.onEvict(t,n,"evicted")}catch(r){this._notifyError(r,"PowerCache onEvict callback threw")}this._freeNode(e)}}for(;this._map.size>=this.maxEntries||this._currentWeight>this.maxWeight;){const e=this._evictionCandidate||this._head;if(!e)break;if(this._ghostSize<this._ghostMaxSize)this._unlinkNode(e,{advanceEvictionCandidate:!0}),this._s3fifoAppendGhost(e);else{const t=e.key,n=e.value;this._abortInflight(t,"evicted"),this._unlinkNode(e,{advanceEvictionCandidate:!0}),this._evictions++;try{this.onEvict&&this.onEvict(t,n,"evicted")}catch(r){this._notifyError(r,"PowerCache onEvict callback threw")}this._freeNode(e)}}this._evictionCandidate||(this._evictionCandidate=this._head)}_expiresAt(e,t){return e==null||e===1/0?0:t+Jl(e,"PowerCache")}_rejectIfOversized(e,t,n){if(!this.rejectOversized||!Number.isFinite(this.maxWeight)||n<=this.maxWeight)return!1;this._rejected++;try{this.onEvict&&this.onEvict(e,t,"rejected-oversized")}catch(r){this._notifyError(r,"PowerCache onEvict callback threw (rejected-oversized)")}return!0}_insertNew(e,t,n,r,i){if(this._sketch&&this._windowSize>0){const o=this._allocNode(e,t,n,r);return this._map.set(e,o),o.inWindow=!0,this._append(o),this._currentWeight+=o.weight||0,this._arbitrateWindow(i),!0}if(this._sketch&&this._map.size>=this.maxEntries){const o=this._evictionCandidate||this._head,s=this._sketch.estimate(e);if(o&&this._sketch.estimate(o.key)>=s)return this._rejectedAdmission+=1,!1}const a=this._allocNode(e,t,n,r);return this._policy!=="s3fifo"&&this._map.set(e,a),this._append(a),this._currentWeight+=a.weight||0,!0}set(e,t,{ttl:n=this.defaultTTL,weight:r=null}={}){const i=this._now(),a=this._expiresAt(n,i),o=this._computeWeight(t,r);if(this._rejectIfOversized(e,t,o))return!1;let s=this._map.get(e);if(s===void 0&&this._policy==="s3fifo"&&(s=this._smallMap.get(e)||this._ghostMap.get(e)),s!==void 0)this._updateExisting(s,t,o,a);else if(!this._insertNew(e,t,o,a,this._map.size))return this;return this._sketch?.increment(e),this._evictIfNeeded(),this}_updateExisting(e,t,n,r){this._currentWeight-=e.weight||0,e.value=t,e.weight=n,e.expiresAt=r,this._currentWeight+=e.weight||0,this._moveToTail(e)}get(e){const t=this._fetchValidNode(e,{countMiss:!0});if(t)return this._moveToTail(t),this._hits++,this._sketch?.increment(e),t.value}peek(e){const t=this._fetchValidNode(e);return t?t.value:void 0}has(e,{ignoreExpiry:t=!1}={}){return!!this._fetchValidNode(e,{ignoreExpiry:t})}getOrFetch(e,t,n={}){const r=t??this.fetchMethod;return typeof r!="function"?Promise.reject(new TypeError("PowerCache.getOrFetch: no factory given and no `fetchMethod` configured")):this.getOrSetAsync(e,r,n)}getOrSet(e,t,{ttl:n=void 0,weight:r=void 0,staleWhileRevalidate:i=this.allowStale}={}){const a=this._now(),o=this._fetchValidNode(e,{countMiss:!1,allowExpired:i,now:a});if(o)if(o.expiresAt&&o.expiresAt<=a){if(typeof t=="function"&&this._staleServable(o,a))return this._moveToTail(o),this._hits++,this._staleServes++,this._refreshStaleEntry(e,t,{ttl:n,weight:r}),o.value;this._removeExpiredNode(o,a),this._misses++}else return this._moveToTail(o),this._hits++,o.value;else this._misses++;if(typeof t=="function"){const s=t();return typeof s?.then=="function"?s.then(l=>{try{this.set(e,l,{ttl:n,weight:r})}catch(c){this._notifyError(c,"PowerCache: storing an async value threw")}return l}):(this.set(e,s,{ttl:n,weight:r}),s)}return this.set(e,t,{ttl:n,weight:r}),t}setMany(e,{ttl:t=void 0,weight:n=void 0}={}){const r=this._now(),i=this._expiresAt(t,r);for(const a of e){if(!a)continue;const[o,s]=a,l=this._computeWeight(s,n);if(this._rejectIfOversized(o,s,l))continue;const c=this._map.get(o);if(c!==void 0)this._updateExisting(c,s,l,i);else if(!this._insertNew(o,s,l,i,this._map.size))continue;this._sketch?.increment(o)}return this._evictIfNeeded(),this}getMany(e,{ignoreExpiry:t=!1}={}){const n=new Map;for(const r of e){const i=this._fetchValidNode(r,{ignoreExpiry:t,countMiss:!0});i&&(this._moveToTail(i),this._hits++,n.set(r,i.value))}return n}touch(e,t=void 0){const n=this._now(),r=this._fetchValidNode(e,{now:n});return r?(t!==void 0&&(r.expiresAt=this._expiresAt(t,n)),this._moveToTail(r),!0):!1}getOrSetAsync(e,t,{ttl:n=void 0,weight:r=void 0,staleWhileRevalidate:i=this.allowStale,timeout:a=void 0}={}){if(typeof t!="function")return Promise.resolve(this.getOrSet(e,t,{ttl:n,weight:r}));const o=this._now(),s=this._map.get(e);if(s)if(s.expiresAt&&s.expiresAt<=o){if(i&&this._staleServable(s,o))return this._moveToTail(s),this._hits++,this._staleServes++,this._refreshStaleEntry(e,t,{ttl:n,weight:r}),Promise.resolve(s.value);this._removeExpiredNode(s,o)}else return this._moveToTail(s),this._hits++,Promise.resolve(s.value);if(this._inflightPromises.has(e))return this._inflightPromises.get(e);this._misses++;const l=new AbortController;let c;try{c=Promise.resolve().then(()=>t(l.signal))}catch(p){return Promise.reject(p)}const f=Number.isFinite(Number(a))?Math.max(0,Math.floor(Number(a))):Number.isFinite(Number(this._defaultAsyncTimeout))?this._defaultAsyncTimeout:void 0;let u=c;if(typeof f=="number"&&Number.isFinite(f)&&f>0){let p;u=new Promise((m,y)=>{p=setTimeout(()=>{try{y(new Error("getOrSetAsync timeout"))}catch{}},f),c.then(g=>{try{p&&clearTimeout(p)}catch(d){this._notifyError(d,"PowerCache: clearTimeout threw")}m(g)},g=>{try{p&&clearTimeout(p)}catch(d){this._notifyError(d,"PowerCache: clearTimeout threw")}y(g)})})}c.then(p=>{try{this.set(e,p,{ttl:n,weight:r})}catch(m){this._notifyError(m,"PowerCache getOrSetAsync: storing a late value threw")}},()=>{});const h=u.finally(()=>{this._abortInflight(e,"timed out"),this._inflightPromises.delete(e),this._inflightControllers.delete(e)});return this._inflightPromises.set(e,c),this._inflightControllers.set(e,l),h}hasEqual(e,t,n={}){const{ignoreExpiry:r=!1,maxNodes:i,compareFn:a}=n||{},o=this._fetchValidNode(e,{ignoreExpiry:r});if(!o)return!1;const s=o.value;return s===t?!0:typeof s!="object"||s===null||typeof t!="object"||t===null?s===t:cr(s,t,yu({maxNodes:i,compareFn:a}))}delete(e){this._abortInflight(e,"deleted");let t=this._map.get(e);if(!t&&this._policy==="s3fifo"&&(t=this._smallMap.get(e)||this._ghostMap.get(e)),!t)return!1;this._unlinkNode(t);try{this.onEvict&&this.onEvict(t.key,t.value,"deleted")}catch(n){this._notifyError(n,"PowerCache onEvict callback threw (deleted)")}return this._freeNode(t),!0}invalidate(e){if(typeof e!="function")throw new TypeError(`PowerCache invalidate(predicate): predicate must be a function, got ${typeof e}`);const t=[];for(let r=this._head;r;r=r.next)e(r.key,r.value)&&t.push(r);let n=0;for(const r of t)if(this._map.get(r.key)===r){this._abortInflight(r.key,"invalidated"),this._unlinkNode(r),this._evictions+=1,n+=1;try{this.onEvict&&this.onEvict(r.key,r.value,"invalidated")}catch(i){this._notifyError(i,"PowerCache onEvict callback threw (invalidated)")}this._freeNode(r)}return(!this._evictionCandidate||!Fi(this._evictionCandidate,this._head,this._tail))&&(this._evictionCandidate=this._head),n}evict(e=1){if(typeof e!="number"||!Number.isInteger(e)||e<0)throw new TypeError(`PowerCache evict(count): count must be a non-negative integer number, got ${typeof e=="string"?`'${e}'`:String(e)}`);let t=0;for(;t<e;){const n=this._evictionCandidate||this._head;if(!n)break;this._abortInflight(n.key,"evicted"),this._unlinkNode(n,{advanceEvictionCandidate:!0}),this._evictions+=1,t+=1;try{this.onEvict&&this.onEvict(n.key,n.value,"evicted")}catch(r){this._notifyError(r,"PowerCache onEvict callback threw")}this._freeNode(n)}return this._evictionCandidate||(this._evictionCandidate=this._head),t}clear(){for(const e of[...this._inflightPromises.keys()])this._abortInflight(e,"cleared");for(let e=this._head;e;){const t=e.next;this._freeNode(e),e=t}this._head=this._tail=null,this._map.clear(),this._smallMap?.clear(),this._ghostMap?.clear(),this._smallSize=0,this._ghostSize=0,this._smallHead=this._smallTail=null,this._ghostHead=this._ghostTail=null,this._sieveHand=null,this._sketch?.clear(),this._rejectedAdmission=0,this._currentWeight=0,this._cleanupCursor=null,this._cleanupCursorValid=!1,this._evictionCandidate=null,this._probationEnd=null,this._inflightPromises.clear()}cleanupExpired(){return this.cleanupExpiredUpTo()}cleanupExpiredUpTo(e=1/0){const t=this._now();let n=0,r=this._cleanupCursor&&this._cleanupCursorValid?this._cleanupCursor:this._head;for(;r&&n<e;){const i=r.next;if(r.expiresAt&&r.expiresAt<=t){const a=r.key,o=r.value;this._unlinkNode(r);try{this.onExpire&&this.onExpire(a,o)}catch(s){this._notifyError(s,"PowerCache onExpire callback threw")}this._freeNode(r),this._expirations++}r=i,n++}return this._cleanupCursor=r||this._head,this._cleanupCursorValid=!!this._cleanupCursor,n}startCleanup(e={}){const t={name:"interval",className:"PowerCache",min:1,integer:!0,fallback:Math.max(Aa,Math.min(this.defaultTTL||6e4,Ro))};let n,r;if(typeof e=="number")n=je(e,t),r=this.maxCleanupPerTick;else{const i=e.interval??e.intervalMs;n=je(i,t),r=Number.isFinite(Number(e.maxCleanupPerTick))?Math.max(1,Number(e.maxCleanupPerTick)):this.maxCleanupPerTick}this.stopCleanup(),this._cleanupParams={interval:n,maxCleanupPerTick:r},this._cleanupTimer=Ua(()=>this._cleanupTick(),n)}stopCleanup(){this._cleanupTimer&&(clearTimeout(this._cleanupTimer),this._cleanupTimer=null),this._cleanupRunning=!1,this._cleanupParams=null}dispose(){this[Symbol.dispose]()}[Symbol.dispose](){Us(this._metrics),this._metrics=null;try{this.stopCleanup()}catch{}try{this.clear()}catch{}}async[Symbol.asyncDispose](){try{this.stopCleanup()}catch{}try{this.clear()}catch{}}_cleanupTick(){if(this._cleanupTimer!=null){if(this._cleanupRunning){this._cleanupParams&&(this._cleanupTimer=Ua(()=>this._cleanupTick(),this._cleanupParams.interval));return}this._cleanupRunning=!0;try{this._cleanupParams&&this.cleanupExpiredUpTo(this._cleanupParams.maxCleanupPerTick)}finally{this._cleanupRunning=!1}this._cleanupParams&&(this._cleanupTimer=Ua(()=>this._cleanupTick(),this._cleanupParams.interval))}}get size(){return this._policy==="s3fifo"?this._map.size+this._smallSize+this._ghostSize:this._map.size}get hitRate(){const e=(this._hits||0)+(this._misses||0);return e?this._hits/e:0}stats(){return{size:this.size,weight:this._currentWeight,hits:this._hits,misses:this._misses,staleServes:this._staleServes,evictions:this._evictions,expirations:this._expirations,rejected:this._rejected,rejectedAdmission:this._rejectedAdmission,weightErrors:this._weightErrors,refreshesSkipped:this._refreshesSkipped,refreshesFailed:this._refreshesFailed,refreshesAborted:this._refreshesAborted,poolSize:this._pool.length}}getStats(){return this.stats()}resize({maxEntries:e,maxWeight:t}={}){Number.isFinite(Number(e))&&(this.maxEntries=Math.max(0,Number(e))),Number.isFinite(Number(t))&&(this.maxWeight=Math.max(0,Number(t))),this._evictIfNeeded(),this._cleanupCursor=null,this._cleanupCursorValid=!1,this._evictionCandidate=this._head}*entries(e="MRU"){const t=e==="MRU"?"prev":"next";let n=e==="MRU"?this._tail:this._head,r=this.size;for(;n;){if(r--<=0)return;const i=n[t];yield[n.key,n.value],Fi(n,this._head,this._tail)?Fi(i,this._head,this._tail)?n=i:n=n[t]:n=Fi(i,this._head,this._tail)?i:null}}[Symbol.iterator](){return this.entries("MRU")}*keys(e="MRU"){for(const[t]of this.entries(e))yield t}*values(e="MRU"){for(const[,t]of this.entries(e))yield t}};function Fi(e,t,n){return e?e.prev!==null||e.next!==null||e===t||e===n:!1}function yu(e){const t=e||{};return{seen:t.seen??null,nodes:0,maxNodes:Number.isFinite(t.maxNodes)?Math.max(1,Math.floor(Number(t.maxNodes))):iu,compareFn:typeof t.compareFn=="function"?t.compareFn:null,exhausted:!1}}function cr(e,t,n,r=0){if(r>100)return e===t;if(n.exhausted)return!1;if(n.nodes>=n.maxNodes)return n.exhausted=!0,!1;if(n.nodes+=1,e===t)return!0;if(n.compareFn){const s=n.compareFn(e,t);if(s!==void 0)return!!s}if(e==null||t==null||typeof e!="object"||typeof t!="object")return e===t;n.seen||(n.seen=new WeakMap);let i=n.seen.get(e);if(i?.has(t))return!0;if(i||(i=new WeakSet,n.seen.set(e,i)),i.add(t),Object.getPrototypeOf(e)!==Object.getPrototypeOf(t))return!1;if(typeof Uint8Array<"u"&&e instanceof Uint8Array){if(!(t instanceof Uint8Array)||e.length!==t.length)return!1;for(let s=0;s<e.length;s++)if(e[s]!==t[s])return!1;return!0}if(Array.isArray(e)){if(!Array.isArray(t)||e.length!==t.length)return!1;for(let s=0;s<e.length;s++)if(!cr(e[s],t[s],n,r+1))return!1;return!0}if(ArrayBuffer.isView(e)){if(!ArrayBuffer.isView(t)||e.byteLength!==t.byteLength)return!1;const s=new Uint8Array(e.buffer,e.byteOffset||0,e.byteLength),l=new Uint8Array(t.buffer,t.byteOffset||0,t.byteLength);for(let c=0;c<s.length;c++)if(s[c]!==l[c])return!1;return!0}if(e instanceof ArrayBuffer){if(!(t instanceof ArrayBuffer)||e.byteLength!==t.byteLength)return!1;const s=new Uint8Array(e),l=new Uint8Array(t);for(let c=0;c<s.length;c++)if(s[c]!==l[c])return!1;return!0}if(e instanceof Date)return t instanceof Date?e.getTime()===t.getTime():!1;if(e instanceof RegExp)return t instanceof RegExp?e.toString()===t.toString():!1;if(e instanceof Map){if(!(t instanceof Map)||e.size!==t.size)return!1;for(const[s,l]of e)if(!t.has(s)||!cr(l,t.get(s),n,r+1))return!1;return!0}if(e instanceof Set){if(!(t instanceof Set)||e.size!==t.size)return!1;let s=!0;for(const m of e)if(m!==null&&typeof m=="object"){s=!1;break}if(s){for(const m of e)if(!t.has(m))return!1;return!0}const l=Array.from(t),c=new Array(l.length).fill(!1),f=new Map;for(let m=0;m<l.length;m++)f.set(l[m],m);const u=m=>{try{return JSON.stringify(m,(y,g)=>g instanceof Date?{__type:"Date",v:g.getTime()}:g instanceof RegExp?{__type:"RegExp",v:g.toString()}:typeof ArrayBuffer<"u"&&ArrayBuffer.isView(g)?{__type:"TypedArray",v:Array.from(new Uint8Array(g.buffer,g.byteOffset||0,g.byteLength))}:typeof ArrayBuffer<"u"&&g instanceof ArrayBuffer?{__type:"ArrayBuffer",v:Array.from(new Uint8Array(g))}:g)}catch{return null}},h=new Map,p=[];for(let m=0;m<l.length;m++){const y=u(l[m]);if(y==null)p.push(m);else{const g=h.get(y);g?g.push(m):h.set(y,[m])}}for(const m of e){const y=f.get(m);if(y!==void 0&&!c[y]){c[y]=!0;continue}const g=u(m);let d=!1;if(g!=null){const _=h.get(g)||[];for(const w of _)if(!c[w]&&cr(m,l[w],n,r+1)){c[w]=!0,d=!0;break}if(d)continue}for(let _=0;_<l.length;_++)if(!c[_]&&cr(m,l[_],n,r+1)){c[_]=!0,d=!0;break}if(!d)return!1}return!0}const a=Object.keys(e),o=Object.keys(t);if(a.length!==o.length)return!1;for(let s=0;s<a.length;s++){const l=a[s];if(!Object.prototype.hasOwnProperty.call(t,l)||!cr(e[l],t[l],n,r+1))return!1}return!0}var kr=class{constructor(e,t={}){Et(t,["keyResolver","cacheOptions","ttl","weight"],"PowerMemoizer"),Et(t,["admission","allowStale","cacheOptions","defaultAsyncTimeout","defaultTTL","fetchMethod","initialPoolSize","keyResolver","maxCleanupPerTick","maxEntries","maxInflightRefreshes","maxPoolSize","maxWeight","now","observability","onError","onEvict","onExpire","policy","rejectOversized","staleTtl","ttl","weight","weightFn","windowSize"],"PowerCache");const{keyResolver:n=Po,cacheOptions:r={},ttl:i,weight:a}=t;if(this.keyResolver=typeof n=="function"?n:Po,this.cache=new vr(r),this._inflight=new Map,this._defaultMemoizeOptions={},i!==void 0&&(this._defaultMemoizeOptions.ttl=i),a!==void 0&&(this._defaultMemoizeOptions.weight=a),this.run=()=>{throw new TypeError("No function supplied to PowerMemoizer; call memoize(fn) to create a memoized wrapper.")},this._originalFn=null,this._receiverIds=new WeakMap,this._nextReceiverId=0,typeof e=="function"){this._originalFn=e;try{this._fnWrapper=this.memoize(e),this.run=(...o)=>{if(typeof this._fnWrapper=="function")return this._fnWrapper(...o)}}catch{}}}_receiverKey(e,t){let n;return e!==null&&(typeof e=="object"||typeof e=="function")?(n=this._receiverIds.get(e),n===void 0&&(n=this._nextReceiverId++,this._receiverIds.set(e,n))):n=`p${String(e)}`,`r${n}:${this.keyResolver(...t)}`}_memoize(e,{ttl:t,weight:n}={}){if(typeof e!="function")throw new TypeError("fn must be a function");const r=this;return function(...a){const o=this===void 0||this===null?null:this,s=o===null?r.keyResolver(...a):r._receiverKey(o,a),l=r.cache._fetchValidNode(s);if(l!==null)return l.value;if(r._inflight.has(s))return r._inflight.get(s);const c=o===null?e(...a):e.apply(o,a);if(typeof c?.then=="function"){const f=(async()=>{try{const u=await c;try{r.cache.set(s,u,{ttl:t,weight:n})}catch{}return u}finally{r._inflight.delete(s)}})();return r._inflight.set(s,f),f}return r.cache.set(s,c,{ttl:t,weight:n}),c}}memoize(e,t={}){if(typeof e!="function")throw new TypeError("fn must be a function");const n=t&&(Object.prototype.hasOwnProperty.call(t,"ttl")||Object.prototype.hasOwnProperty.call(t,"weight"))?t:this._defaultMemoizeOptions,r=this._memoize(e,n),i=this;return r.get=function(...a){return i._getFor(r,this,a)},r.has=function(...a){return i._hasFor(r,this,a)},r.delete=function(...a){return i._deleteFor(r,this,a)},r.clear=()=>this.clear(),r.stats=()=>this.stats(),r.cache=this.cache,r.original=e,r}get(...e){return this._lookup(this.keyResolver(...e))}has(...e){return this.cache.has(this.keyResolver(...e))}delete(...e){return this._evict(this.keyResolver(...e))}_scopedKey(e,t,n){return t===e||t==null?this.keyResolver(...n):this._receiverKey(t,n)}_lookup(e){return this.cache.get(e)}_evict(e){return this._inflight.has(e)&&this._inflight.delete(e),this.cache.delete(e)}_getFor(e,t,n){return this._lookup(this._scopedKey(e,t,n))}_hasFor(e,t,n){return this.cache.has(this._scopedKey(e,t,n))}_deleteFor(e,t,n){return this._evict(this._scopedKey(e,t,n))}clear(){this._inflight.clear(),this.cache.clear()}stats(){return this.cache.stats()}getStats(){return this.stats()}[Symbol.dispose](){typeof this.cache?.[Symbol.dispose]=="function"&&this.cache[Symbol.dispose]()}dispose(){this[Symbol.dispose]()}};function hr(e,t){const n=typeof e;if(e===null)return"n:";if(n==="string")return"s:"+e.length+":"+e;if(n==="number")return"d:"+String(e);if(n==="boolean")return"b:"+(e?"1":"0");if(n==="undefined")return"u:";if(n==="bigint")return"g:"+e.toString();if(n==="symbol")throw new TypeError("simpleArgsKey() does not support symbol arguments");if(n==="function")throw new TypeError("simpleArgsKey() does not support function arguments - two closures cannot be told apart. Pass a key explicitly, or supply a `keyResolver`.");if(t.has(e))return"c:";t.add(e);try{if(Array.isArray(e)){let a="A:[";for(let o=0;o<e.length;o++)o&&(a+=","),a+=hr(e[o],t);return a+"]"}if(e instanceof Date)return"D:"+e.getTime();if(e instanceof RegExp)return"R:"+e.source+"/"+e.flags;if(gi(e))return"E:"+e.name+":"+e.message;if(e instanceof Map){let a="Mp:[",o=!0;for(const[s,l]of e)o||(a+=","),o=!1,a+=hr(s,t)+"="+hr(l,t);return a+"]"}if(e instanceof Set){let a="St:[",o=!0;for(const s of e)o||(a+=","),o=!1,a+=hr(s,t);return a+"]"}let r="O:{",i=!0;for(const a of Object.keys(e))i||(r+=","),i=!1,r+="s:"+a.length+":"+a+"="+hr(e[a],t);return r+"}"}finally{t.delete(e)}}function Po(...e){if(e.length===0)return"";const t=new Set;let n="";for(let r=0;r<e.length;r++)r&&(n+="|"),n+=hr(e[r],t);return n}function yi(e,t){Object.prototype.hasOwnProperty.call(e,t)||Object.defineProperty(e,t,{value:()=>{},enumerable:!1,writable:!0,configurable:!0})}var _u=class{constructor(e=0,t={}){Et(t,["defaultTTL","onExpire","now"],"PowerTTLMap");let n=t,r=e;e!=null&&typeof e=="object"&&(n=e,r=0),this._defaultTTL=Number(n?.defaultTTL??r)||0,this._onExpire=typeof n?.onExpire=="function"?n.onExpire:null,this._now=typeof n?.now=="function"?n.now:rt,this._map=new Map,this._expirations=new Map,this._nextExpiryAt=0,this._nextExpiryDirty=!1,this._disposed=!1}_resolveTtl(e,t){if(e!=null&&typeof e=="object"&&!Array.isArray(e)&&(e=e.ttl),e==null)return t;if(e===1/0)return 0;const n=Jl(e,"PowerTTLMap");if(n<0)throw new RangeError(`PowerTTLMap: \`ttl\` must be zero (no expiry) or positive (received ${String(e)}). A negative TTL would store an expiry in the past that every comparison reads as live.`);return n}set(e,t,n){if(this._disposed)throw new TypeError("PowerTTLMap: cannot `set()` after `dispose()`. The instance is released; construct a new PowerTTLMap, or use `clear()` before disposing if you meant to reuse it.");const r=this._resolveTtl(n,this._defaultTTL),i=r>0?this._now()+r+1:0,a=this._expirations.get(e)||0;return this._map.set(e,{value:t,expiresAt:i}),i?this._expirations.set(e,i):this._expirations.delete(e),this._updateNextExpiryOnWrite(a,i),this}_expireKey(e,t){if(!t)return;const n=t.expiresAt||this._expirations.get(e)||0;try{const r=t.value;if(this._map.delete(e),this._expirations.delete(e),n&&this._nextExpiryAt===n&&(this._nextExpiryDirty=!0),typeof this._onExpire=="function")try{this._onExpire(e,r)}catch{}}catch{}}_checkExpire(e,t){return t?t.expiresAt&&this._now()>t.expiresAt?(this._expireKey(e,t),!0):!1:!0}get(e){const t=this._map.get(e);if(!(t===void 0||this._checkExpire(e,t)))return t.value}has(e){const t=this._map.get(e);return!this._checkExpire(e,t)}delete(e){const t=this._expirations.get(e)||0;return this._expirations.delete(e),t&&this._nextExpiryAt===t&&(this._nextExpiryDirty=!0),this._map.delete(e)}reset(){this.clear()}clear(){this._map.clear(),this._expirations.clear(),this._nextExpiryAt=0,this._nextExpiryDirty=!1}touch(e,t){const n=this._map.get(e);if(!n)return!1;if(n.expiresAt&&this._now()>n.expiresAt)return this._expireKey(e,n),!1;const r=n.expiresAt||0,i=this._resolveTtl(t,this._defaultTTL);return n.expiresAt=i>0?this._now()+i+1:0,n.expiresAt?this._expirations.set(e,n.expiresAt):this._expirations.delete(e),this._updateNextExpiryOnWrite(r,n.expiresAt),!0}get size(){return this._map.size}get expiredCount(){if(!this._map.size||!this._expirations.size)return 0;const e=this._now();let t=0;for(const n of this._expirations.values())n&&e>n&&t++;return t}purge(){if(!this._map.size||!this._expirations.size)return 0;const e=this._now();let t=0;for(const n of this._expirations.values())n&&e>n&&t++;return t&&this._sweepExpirations(e),t}_updateNextExpiryOnWrite(e,t){e&&this._nextExpiryAt===e&&e!==t&&(this._nextExpiryDirty=!0),t&&(!this._nextExpiryAt||t<this._nextExpiryAt)&&(this._nextExpiryAt=t)}_sweepExpirations(e){let t=0;for(const[n,r]of this._expirations){if(r&&e>r){const i=this._map.get(n);this._expireKey(n,i);continue}r&&(!t||r<t)&&(t=r)}this._nextExpiryAt=t,this._nextExpiryDirty=!1}*entries(){const e=this._now();for(const[t,n]of this._map){if(n.expiresAt&&e>n.expiresAt){this._expireKey(t,n);continue}yield[t,n.value]}}*keys(){for(const[e]of this.entries())yield e}*values(){for(const[,e]of this.entries())yield e}forEach(e,t){for(const[n,r]of this.entries())e.call(t,r,n,this)}[Symbol.iterator](){return this.entries()}dispose(){this._disposed||(this._disposed=!0,this.clear(),yi(this,"clear"))}[Symbol.dispose](){this.dispose()}},wu=new vr({maxEntries:500,policy:"slru"}),Di=new _u(0),Ba=3e5;async function bu(e,t){try{if(!e||Ba>0&&Di.has(e))return null;try{const n=await wu.getOrSetAsync(e,async()=>{const r=await t();if(r==null)throw new Error("importCache: loader returned null");return r});return Di.delete(e),n}catch{return Ba>0?Di.set(e,1,Ba):Di.delete(e),null}}catch{return null}}var Qn="11.12.0",ze=new Map,vu=`https://raw.githubusercontent.com/highlightjs/highlight.js/${Qn}/SUPPORTED_LANGUAGES.md`,sn={shell:"bash",sh:"bash",zsh:"bash",js:"javascript",ts:"typescript",py:"python",csharp:"cs","c#":"cs"};sn.html="xml";sn.xhtml="xml";sn.markup="xml";var js=new Set(["magic","undefined"]),Cn=null,ku=3,xu=3e5,li=new Map;function Lo(e){try{const t=li.get(e);return t?t.openUntil&&Date.now()<t.openUntil?!0:(t.openUntil&&Date.now()>=t.openUntil&&li.delete(e),!1):!1}catch{return!1}}function No(e){if(e)try{const t=li.get(e)||{failures:0,openUntil:0,warned:!1};if(t.failures=(t.failures||0)+1,t.failures>=ku&&(t.openUntil=Date.now()+xu,!t.warned)){try{x("[codeblocksManager] CDN circuit opened for "+e+"; skipping CDN imports temporarily")}catch{}t.warned=!0}li.set(e,t)}catch{}}function Io(e){try{e&&li.delete(e)}catch{}}var Oo=null;async function Bs(e=vu){if(e)return Cn||(Cn=(async()=>{try{const t=await fetch(e);if(!t.ok)return;const n=(await t.text()).split(/\r?\n/);let r=-1;for(let l=0;l<n.length;l++)if(/\|\s*Language\s*\|/i.test(n[l])){r=l;break}if(r===-1)return;const i=n[r].replace(/^\||\|$/g,"").split("|").map(l=>l.trim().toLowerCase());let a=i.findIndex(l=>/alias|aliases|equivalent|alt|alternates?/i.test(l));a===-1&&(a=1);let o=i.findIndex(l=>/file|filename|module|module name|module-name|short|slug/i.test(l));if(o===-1){const l=i.findIndex(c=>/language/i.test(c));o=l!==-1?l:0}let s=[];for(let l=r+1;l<n.length;l++){const c=n[l].trim();if(!c||!c.startsWith("|"))break;const f=c.replace(/^\||\|$/g,"").split("|").map(m=>m.trim());if(f.every(m=>/^-+$/.test(m)))continue;const u=f;if(!u.length)continue;const h=(u[o]||u[0]||"").toString().trim().toLowerCase();if(!h||/^-+$/.test(h))continue;ze.set(h,h);const p=u[a]||"";if(p){const m=String(p).split(",").map(y=>y.replace(/`/g,"").trim()).filter(Boolean);if(m.length){const y=m[0].toLowerCase().replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/gi,"");y&&/[a-z0-9]/i.test(y)&&(ze.set(y,y),s.push(y))}}}try{const l=[];for(const c of s){const f=String(c??"").replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/gi,"");f&&/[a-z0-9]/i.test(f)?l.push(f):ze.delete(c)}s=l}catch(l){x("[codeblocksManager] cleanup aliases failed",l)}try{let l=0;for(const c of Array.from(ze.keys())){if(!c||/^-+$/.test(c)||!/[a-z0-9]/i.test(c)){ze.delete(c),l++;continue}if(/^[:]+/.test(c)){const f=c.replace(/^[:]+/,"");if(f&&/[a-z0-9]/i.test(f)){const u=ze.get(c);ze.delete(c),ze.set(f,u)}else ze.delete(c),l++}}for(const[c,f]of Array.from(ze.entries()))(!f||/^-+$/.test(f)||!/[a-z0-9]/i.test(f))&&(ze.delete(c),l++);try{const c=":---------------------";ze.has(c)&&(ze.delete(c),l++)}catch(c){x("[codeblocksManager] remove sep key failed",c)}try{Array.from(ze.keys()).sort()}catch(c){x("[codeblocksManager] compute supported keys failed",c)}}catch(l){x("[codeblocksManager] ignored error",l)}}catch(t){x("[codeblocksManager] loadSupportedLanguages failed",t)}})(),Cn)}var Wa=new Set,zo=new Set;function qa(e,t,n){const r=String(e||"").toLowerCase();if(!(!r||zo.has(r))){zo.add(r);try{x("[codeblocksManager] language import failed; using plaintext/highlightElement fallback",{language:e,candidates:Array.isArray(t)?t:[],error:n?String(n?.message||n):"unknown"})}catch{}}}async function _r(e,t){if(Cn||(async()=>{try{await Bs()}catch(i){x("[codeblocksManager] loadSupportedLanguages (IIFE) failed",i)}})(),Cn)try{await Cn}catch{}if(e=e==null?"":String(e),e=e.trim(),!e)return!1;const n=e.toLowerCase();if(js.has(n))return!1;if(ze.size&&!ze.has(n)){const i=sn;if(!i[n]&&!i[e])return!1}if(Wa.has(e))return!0;const r=sn;try{const i=(t||e||"").toString().replace(/\.js$/i,"").trim(),a=(r[e]||e||"").toString(),o=(r[i]||i||"").toString();let s=Array.from(new Set([a,o,i,e,r[i],r[e]].filter(Boolean))).map(f=>String(f).toLowerCase()).filter(f=>f&&f!=="undefined");ze.size&&(s=s.filter(f=>{if(ze.has(f))return!0;const u=sn[f];return!!(u&&ze.has(u))}));let l=null,c=null;for(const f of s)try{if(l=await bu(f,async()=>{try{if(typeof Oo=="function")try{return await Oo(f)}catch{return null}try{try{return await import(`highlight.js/lib/languages/${f}.js`)}catch{return await import(`highlight.js/lib/languages/${f}`)}}catch{}if(!Qn)return null;try{const u=`https://cdn.jsdelivr.net/npm/highlight.js@${Qn}/es/languages/${f}.js`;let h=null;try{h=new URL(u).host}catch{h=null}if(!Lo(h))try{const p=await import(u);return Io(h),p}catch{No(h)}try{const p=`https://cdn.jsdelivr.net/npm/highlight.js@${Qn}/lib/languages/${f}.js`;let m=null;try{m=new URL(p).host}catch{m=null}if(!Lo(m))try{const y=await import(p);return Io(m),y}catch{return No(m),null}}catch{return null}}catch{try{return await import(`https://cdn.jsdelivr.net/npm/highlight.js@${Qn}/lib/languages/${f}.js`)}catch{return null}}}catch{return null}}),l){const u=l.default||l;try{const h=ze.size&&ze.get(e)||f||e;return Qe.registerLanguage(h,u),Wa.add(h),h!==e&&(Qe.registerLanguage(e,u),Wa.add(e)),!0}catch(h){c=h}}}catch(u){c=u}return c?(qa(e,s,c),!1):(s.length&&qa(e,s,null),!1)}catch(i){return qa(e,[],i),!1}}var Ha=null;function ic(e){const t=e?.querySelector?e:typeof document<"u"?document:null;Cn||(async()=>{try{await Bs()}catch(a){x("[codeblocksManager] loadSupportedLanguages (observer) failed",a)}})();const n=sn;typeof IntersectionObserver<"u"&&!Ha&&(Ha=new IntersectionObserver((a,o)=>{a.forEach(s=>{if(!s.isIntersecting)return;const l=s.target;try{o.unobserve(l)}catch(c){x("[codeblocksManager] observer unobserve failed",c)}(async()=>{try{const c=l.getAttribute&&l.getAttribute("class")||l.className||"",f=c.match(/language-([a-zA-Z0-9_+-]+)/)||c.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(f&&f[1]){const u=(f[1]||"").toLowerCase(),h=n[u]||u,p=ze.size&&(ze.get(h)||ze.get(String(h).toLowerCase()))||h;try{await _r(p)}catch(m){x("[codeblocksManager] registerLanguage failed",m)}try{try{const m=l.textContent||l.innerText||"";m!=null&&(l.textContent=m)}catch{}try{l?.dataset?.highlighted&&delete l.dataset.highlighted}catch{}Qe.highlightElement(l)}catch(m){x("[codeblocksManager] hljs.highlightElement failed",m)}}else try{const u=l.textContent||"";try{if(Qe&&typeof Qe.getLanguage=="function"&&Qe.getLanguage("plaintext")){const h=Qe.highlight(u,{language:"plaintext"});if(h&&h.value)try{if(typeof document<"u"&&document.createRange&&typeof document.createRange=="function"){const p=document.createRange().createContextualFragment(h.value);if(typeof l.replaceChildren=="function")l.replaceChildren(...Array.from(p.childNodes));else{for(;l.firstChild;)l.removeChild(l.firstChild);l.appendChild(p)}}else l.innerHTML=h.value}catch{try{l.innerHTML=h.value}catch{}}}}catch{try{Qe.highlightElement(l)}catch(p){x("[codeblocksManager] fallback highlightElement failed",p)}}}catch(u){x("[codeblocksManager] auto-detect plaintext failed",u)}}catch(c){x("[codeblocksManager] observer entry processing failed",c)}})()})},{root:null,rootMargin:"300px",threshold:.1}));const r=Ha,i=t?.querySelectorAll?t.querySelectorAll("pre code"):[];if(!r){i.forEach(async a=>{try{const o=a.getAttribute&&a.getAttribute("class")||a.className||"",s=o.match(/language-([a-zA-Z0-9_+-]+)/)||o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(s&&s[1]){const l=(s[1]||"").toLowerCase(),c=n[l]||l,f=ze.size&&(ze.get(c)||ze.get(String(c).toLowerCase()))||c;try{await _r(f)}catch(u){x("[codeblocksManager] registerLanguage failed (no observer)",u)}}try{try{const l=a.textContent||a.innerText||"";l!=null&&(a.textContent=l)}catch{}try{a&&a.dataset&&a.dataset.highlighted&&delete a.dataset.highlighted}catch{}Qe.highlightElement(a)}catch(l){x("[codeblocksManager] hljs.highlightElement failed (no observer)",l)}}catch(o){x("[codeblocksManager] loadSupportedLanguages fallback ignored error",o)}});return}i.forEach(a=>{try{r.observe(a)}catch(o){x("[codeblocksManager] observe failed",o)}})}function Su(e,{useCdn:t=!0}={}){const n=typeof document<"u"&&document.head&&document.head.querySelector?document.head.querySelector("link[data-hl-theme]"):typeof document<"u"?document.querySelector("link[data-hl-theme]"):null,r=n?.getAttribute?n.getAttribute("data-hl-theme"):null,i=e==null?"default":String(e),a=i&&String(i).toLowerCase()||"";if(a==="default"||a==="monokai"){try{n?.parentNode&&n.parentNode.removeChild(n)}catch{}return}if(r&&r.toLowerCase()===a)return;if(!t){try{x("Requested highlight theme not bundled; set useCdn=true to load theme from CDN")}catch{}return}if(!Qn){try{x("Cannot load highlight.js theme from CDN: HIGHLIGHT_JS_VERSION is not defined")}catch{}return}const o=a,s=`https://cdn.jsdelivr.net/npm/highlight.js@${Qn}/styles/${o}.css`,l=document.createElement("link");l.rel="stylesheet",l.href=s,l.setAttribute("data-hl-theme",o),l.addEventListener("load",()=>{try{n?.parentNode&&n.parentNode.removeChild(n)}catch{}}),document.head.appendChild(l)}var _i=e=>e===void 0?"__undefined":String(e),Eu=new kr(function(e){return String(e??"").replace(/^[.\/]+/,"")},{keyResolver:_i,cacheOptions:{maxEntries:2e3}}),Au=new kr(function(e){return String(e??"").replace(/\/+$/,"")},{keyResolver:_i,cacheOptions:{maxEntries:2e3}}),Tu=new kr(function(e){return Jn(String(e??""))+"/"},{keyResolver:_i,cacheOptions:{maxEntries:2e3}}),Hm=new kr(function(e){try{const t=String(e??"");return t.includes("%")?t:encodeURI(t)}catch(t){return x("[helpers] encodeURL failed",t),String(e??"")}},{keyResolver:_i,cacheOptions:{maxEntries:2e3}}),Mu=new kr(function(e){try{if(!e&&e!==0)return"";const t=String(e),n={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:" "};return t.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g,(r,i)=>{if(!i)return r;if(i[0]==="#")try{return i[1]==="x"||i[1]==="X"?String.fromCharCode(parseInt(i.slice(2),16)):String.fromCharCode(parseInt(i.slice(1),10))}catch{return r}return n[i]!==void 0?n[i]:r})}catch{return String(e??"")}},{keyResolver:_i,cacheOptions:{maxEntries:2e3}});function ia(e){return!e||typeof e!="string"?!1:/^(https?:)?\/\//.test(e)||e.startsWith("mailto:")||e.startsWith("tel:")}var oe=e=>Eu.run(e);function ci(e,t=2){try{const n=String(e??"").split("/").filter(Boolean);return n.length?n.slice(-Math.max(1,Math.min(t,n.length))).join("/"):""}catch{return String(e??"")}}var Jn=e=>Au.run(e),On=e=>Tu.run(e);function Cu(e){try{if(!e||typeof document>"u"||!document.head||e.startsWith("data:")||document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`))return;const t=document.createElement("link");t.rel="preload",t.as="image",t.href=e,document.head.appendChild(t)}catch(t){x("[helpers] preloadImage failed",t)}}var Ru=["https://cdn.jsdelivr.net","https://unpkg.com"];function Pu(){try{if(typeof document>"u"||!document.head)return;for(const e of Ru)try{if(document.querySelector(`link[rel="preconnect"][href="${e}"]`))continue;const t=document.createElement("link");t.rel="preconnect",t.href=e,t.crossOrigin="anonymous",document.head.appendChild(t)}catch{}}catch{}}function Lu(e,t="monokai"){try{if(typeof document>"u"||!document.head||!e)return;const n=`https://cdn.jsdelivr.net/npm/highlight.js@${e}/styles/${t}.css`;try{if(document.querySelector(`link[rel="preload"][href="${n}"]`))return;const r=document.createElement("link");r.rel="preload",r.as="style",r.href=n,r.crossOrigin="anonymous",r.fetchPriority="high",document.head.appendChild(r)}catch{}}catch{}}var ps=null;function Nu(e){ps=typeof e=="string"?e:null}function Ws(e){if(ps&&e&&typeof e.setAttribute=="function")try{e.setAttribute("nonce",ps)}catch{}}function Va(e,t=0,n=!1){try{if(typeof window>"u"||!e||!e.querySelectorAll)return;const r=Array.from(e.querySelectorAll("img"));if(!r.length)return;const i=e,a=i?.getBoundingClientRect?i.getBoundingClientRect():null,o=0,s=typeof window<"u"&&(window.innerHeight||document.documentElement.clientHeight)||0,l=a?Math.max(o,a.top):o,c=(a?Math.min(s,a.bottom):s)+Number(t||0);let f=0;i&&(f=i.clientHeight||(a?a.height:0)),f||(f=s-o);let u=.6;try{const y=i&&window.getComputedStyle?window.getComputedStyle(i):null,g=y?.getPropertyValue?y.getPropertyValue("--nimbi-image-max-height-ratio"):null,d=g?parseFloat(g):NaN;!Number.isNaN(d)&&d>0&&d<=1&&(u=d)}catch(y){x("[helpers] read CSS ratio failed",y)}const h=Math.max(200,Math.floor(f*u));let p=null,m=!1;if(r.forEach(y=>{try{const g=y.getAttribute?.("loading"),d=g==="eager",_=y?.getBoundingClientRect?y.getBoundingClientRect():null,w=y.src||y.getAttribute?.("src"),k=_?.height>1?_.height:h,v=_?_.top:0,I=v+k;_&&k>0&&v<=c&&I>=l&&!m?(y.setAttribute?(y.setAttribute("loading","eager"),y.setAttribute("fetchpriority","high"),y.setAttribute("data-eager-by-nimbi","1")):(y.loading="eager",y.fetchPriority="high"),Cu(w),m=!0):!d&&y.setAttribute&&y.setAttribute("loading","lazy"),!p&&_?.top<=c&&(p={img:y,src:w,rect:_,beforeLoading:g,explicitEager:d})}catch(g){x("[helpers] setEagerForAboveFoldImages per-image failed",g)}}),!m&&p){const{img:y,src:g,explicitEager:d}=p;if(!d)try{y.setAttribute?(y.setAttribute("loading","eager"),y.setAttribute("fetchpriority","high"),y.setAttribute("data-eager-by-nimbi","1")):(y.loading="eager",y.fetchPriority="high"),m=!0}catch(_){x("[helpers] setEagerForAboveFoldImages fallback failed",_)}}}catch(r){x("[helpers] setEagerForAboveFoldImages failed",r)}}function qe(e,t=null,n){try{const r=typeof n=="string"?n:typeof window<"u"&&window.location?window.location.search:"",i=new URLSearchParams(r.startsWith("?")?r.slice(1):r),a=String(e??"");i.delete("page");const o=new URLSearchParams;o.set("page",a);for(const[c,f]of i.entries())o.append(c,f);const s=o.toString();let l=s?`?${s}`:"";return t&&(l+=`#${encodeURIComponent(t)}`),l||`?page=${encodeURIComponent(a)}`}catch{const i=`?page=${encodeURIComponent(String(e??""))}`;return t?`${i}#${encodeURIComponent(t)}`:i}}function aa(e){try{const t=e();return t&&typeof t.then=="function"?t.catch(n=>{x("[helpers] safe swallowed error",n)}):t}catch(t){x("[helpers] safe swallowed error",t)}}try{typeof globalThis<"u"&&!globalThis.safe&&(globalThis.safe=aa)}catch(e){x("[helpers] global attach failed",e)}var Iu=e=>Mu.run(e),ac=()=>typeof navigator<"u"&&navigator.hardwareConcurrency?Math.max(1,Math.floor(navigator.hardwareConcurrency/2)):2,Zn="light";function Ou(e,t={}){if(document.querySelector(`link[href="${e}"]`))return;const n=document.createElement("link");if(n.rel="stylesheet",n.href=e,Object.entries(t).forEach(([r,i])=>n.setAttribute(r,i)),document.head.appendChild(n),t["data-bulmaswatch-theme"])try{if(n.getAttribute("data-bulmaswatch-observer"))return;let r=Number(n.getAttribute("data-bulmaswatch-move-count")||0),i=!1,a=null;try{const l=n.getAttribute("data-bulmaswatch-observer");l&&(a=document.querySelector(`[data-bulmaswatch-observer="${l}"]`))}catch{a=null}const o=()=>{try{if(i)return;const l=n.parentNode;if(!l||l.lastElementChild===n)return;const c=Number(n.getAttribute("data-bulmaswatch-move-count")||0);if(c>=1e3){if(n.setAttribute("data-bulmaswatch-move-stopped","1"),a)try{a.disconnect()}catch{}return}i=!0;try{l.appendChild(n)}catch{}const f=c+1;n.setAttribute("data-bulmaswatch-move-count",String(f)),i=!1}catch{}};a||(a=new MutationObserver(o));try{a.observe(document.head,{childList:!0}),n.setAttribute("data-bulmaswatch-observer","1"),n.setAttribute("data-bulmaswatch-move-count",String(r))}catch{}const s=document.head;s?.lastElementChild!==n&&s?.appendChild(n)}catch{}}function Ga(){try{const e=typeof document<"u"&&document?.head?document.head:document,t=Array.from(e.querySelectorAll("link[data-bulmaswatch-theme]"));for(const n of t)n?.parentNode?.removeChild(n)}catch{}try{const e=typeof document<"u"&&document?.head?document.head:document,t=Array.from(e.querySelectorAll("style[data-bulma-override]"));for(const n of t)n?.parentNode?.removeChild(n)}catch{}}async function sc(e="none",t="/"){try{ue("[bulmaManager] ensureBulma called",{bulmaCustomize:e,pageDir:t})}catch{}if(!e)return;if(e==="none"){try{Ga()}catch{}return}const n=[t+"bulma.css","/bulma.css"],r=Array.from(new Set(n));if(e==="local"){if(Ga(),document.querySelector("style[data-bulma-override]"))return;for(const i of r)try{const a=await fetch(i,{method:"GET"});if(a.ok){const o=await a.text(),s=document.createElement("style");s.setAttribute("data-bulma-override",i),Ws(s),s.appendChild(document.createTextNode(`
/* bulma override: ${i} */
`+o)),document.head.appendChild(s);return}}catch(a){x("[bulmaManager] fetch local bulma candidate failed",a)}return}try{const i=String(e).trim();if(!i)return;Ga(),Ou(`https://unpkg.com/bulmaswatch/${encodeURIComponent(i)}/bulmaswatch.min.css`,{"data-bulmaswatch-theme":i})}catch(i){x("[bulmaManager] ensureBulma failed",i)}}function oc(e){Zn=e==="dark"?"dark":e==="system"?"system":"light";try{const t=Array.from(document.querySelectorAll(".nimbi-mount"));if(t.length>0)for(const n of t)Zn==="dark"?n.setAttribute("data-theme","dark"):Zn==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme");else{const n=document.documentElement;Zn==="dark"?n.setAttribute("data-theme","dark"):Zn==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme")}}catch{}}function zu(e){const t=document.documentElement;for(const[n,r]of Object.entries(e||{}))try{t.style.setProperty(`--${n}`,r)}catch(i){x("[bulmaManager] setThemeVars failed for",n,i)}}function lc(e){if(!e||!(e instanceof HTMLElement))return()=>{};const t=e.closest?.(".nimbi-mount")||null;try{t&&(Zn==="dark"?t.setAttribute("data-theme","dark"):Zn==="light"?t.setAttribute("data-theme","light"):t.removeAttribute("data-theme"))}catch{}return()=>{}}var cc={en:{navigation:"Navigation",onThisPage:"On this page",home:"Home",scrollToTop:"Scroll to top",readingTime:"{minutes} min read",searchPlaceholder:"Search…",searchNoResults:"No results",imagePreviewTitle:"Image preview",imagePreviewFit:"Fit to screen",imagePreviewOriginal:"Original size",imagePreviewZoomOut:"Zoom out",imagePreviewZoomIn:"Zoom in",imagePreviewClose:"Close"},es:{navigation:"Navegación",onThisPage:"En esta página",home:"Inicio",scrollToTop:"Ir arriba",readingTime:"{minutes} min de lectura",searchPlaceholder:"Buscar…",searchNoResults:"Sin resultados",imagePreviewTitle:"Previsualización de imagen",imagePreviewFit:"Ajustar a la pantalla",imagePreviewOriginal:"Tamaño original",imagePreviewZoomOut:"Alejar",imagePreviewZoomIn:"Acercar",imagePreviewClose:"Cerrar"},de:{navigation:"Navigation",onThisPage:"Auf dieser Seite",home:"Startseite",scrollToTop:"Nach oben",readingTime:"{minutes} min Lesezeit",searchPlaceholder:"Suchen…",searchNoResults:"Keine Ergebnisse",imagePreviewTitle:"Bildvorschau",imagePreviewFit:"An Bildschirm anpassen",imagePreviewOriginal:"Originalgröße",imagePreviewZoomOut:"Verkleinern",imagePreviewZoomIn:"Vergrößern",imagePreviewClose:"Schließen"},fr:{navigation:"Navigation",onThisPage:"Sur cette page",home:"Accueil",scrollToTop:"Aller en haut",readingTime:"{minutes} min de lecture",searchPlaceholder:"Rechercher…",searchNoResults:"Aucun résultat",imagePreviewTitle:"Aperçu de l’image",imagePreviewFit:"Ajuster à l’écran",imagePreviewOriginal:"Taille originale",imagePreviewZoomOut:"Dézoomer",imagePreviewZoomIn:"Zoomer",imagePreviewClose:"Fermer"},pt:{navigation:"Navegação",onThisPage:"Nesta página",home:"Início",scrollToTop:"Ir para o topo",readingTime:"{minutes} min de leitura",searchPlaceholder:"Procurar…",searchNoResults:"Sem resultados",imagePreviewTitle:"Visualização da imagem",imagePreviewFit:"Ajustar à tela",imagePreviewOriginal:"Tamanho original",imagePreviewZoomOut:"Diminuir",imagePreviewZoomIn:"Aumentar",imagePreviewClose:"Fechar"}},$o=Object.freeze(["exponential","linear","fixed","decorrelated"]),Za=class{constructor(e={}){Et(e,["ratio","observability","capacity"],"PowerRetryBudget");const{ratio:t=To,capacity:n=10}=e||{};if(this._ratio=je(t,{name:"ratio",className:"PowerRetryBudget",min:0,fallback:To}),this._ratio>1)throw new TypeError(`PowerRetryBudget: \`ratio\` must be <= 1 (received ${this._ratio}). A budget larger than 1 permits more retries than requests.`);this._capacity=je(n,{name:"capacity",className:"PowerRetryBudget",integer:!0,min:1,fallback:10}),this._tokens=this._capacity,this._retries=0,this._refused=0,this._funded=0,this._executions=0,this._outcomes=Object.create(null),this._metrics=Ds(this,"retryBudget",e)}get ratio(){return this._ratio}get capacity(){return this._capacity}recordRequest(){return this._funded+=1,this._tokens=Math.min(this._capacity,this._tokens+this._ratio),this._tokens}tryConsumeRetry(){return this._tokens<1?(this._refused+=1,!1):(this._tokens-=1,this._retries+=1,!0)}recordOutcome(e={}){const t=typeof e.kind=="string"?e.kind:"failure",n={success:0,cancellation:0,timeout:.5,throttled:1,failure:.25},r=e.penalty===void 0?n[t]??n.failure:e.penalty;if(!Number.isFinite(r)||r<0)throw new TypeError("outcome penalty must be a finite number >= 0");return this._tokens=Math.max(0,this._tokens-r),this._outcomes[t]=(this._outcomes[t]||0)+1,this._tokens}execute(e,t={}){return this._executions+=1,sa.run(e,{...t,budget:this})}available(){return this._tokens}reset(){this._tokens=this._capacity,this._retries=0,this._refused=0,this._funded=0,this._outcomes=Object.create(null)}dispose(){Us(this._metrics),this._metrics=null}[Symbol.dispose](){this.dispose()}stats(){return{ratio:this._ratio,capacity:this._capacity,available:this._tokens,requests:this._funded,retries:this._retries,refused:this._refused,executions:this._executions,retryRate:this._executions>0?this._retries/this._executions:0,refusalRate:this._funded>0?this._refused/this._funded:0,outcomes:{...this._outcomes}}}getStats(){return this.stats()}};function $u(e,t){return t?new Promise((n,r)=>{if(t.aborted){r(ms(t.reason));return}const i=()=>{clearTimeout(a),r(ms(t.reason))},a=setTimeout(()=>{t.removeEventListener("abort",i),n()},e);t.addEventListener("abort",i,{once:!0})}):new Promise(n=>setTimeout(n,e))}function ms(e){return Object.assign(new Error("Aborted"),{code:"EABORT",reason:e,attempts:0})}function Fu(e){if(typeof e!="string"||!$o.includes(e))throw new TypeError(`PowerRetry: \`backoff\` must be one of ${$o.join(", ")} (received ${String(e)}).`);return e}function Fo(e,t){if(e==null)return null;if(e instanceof Za)return e;if(typeof e=="number")return new Za({ratio:e});if(typeof e=="object")return typeof e.constructor?.tryConsumeRetry=="function"?e:new Za(e);throw new TypeError(`${t}: \`budget\` must be a PowerRetryBudget, a { ratio, capacity } object, or a ratio number (received ${typeof e}).`)}function Du(e){const{maxAttempts:t=3,backoff:n="exponential",baseDelay:r=100,maxDelay:i=Ao,jitter:a=!0,attemptTimeout:o,hedgeDelay:s=0,retryAfter:l,signal:c}=e||{},f=je(t,{name:"maxAttempts",className:"PowerRetry",min:1,integer:!0,fallback:3,invalidMessage:"maxAttempts must be a positive finite number",minMessage:"maxAttempts must be a positive finite number"}),u=Fu(n),h=je(r,{name:"baseDelay",className:"PowerRetry",min:0,fallback:100}),p=je(i,{name:"maxDelay",className:"PowerRetry",min:0,fallback:Ao}),m=o==null?0:je(o,{name:"attemptTimeout",className:"PowerRetry",min:1,fallback:0}),y=s==null?0:je(s,{name:"hedgeDelay",className:"PowerRetry",min:0,fallback:0});if(u==="decorrelated"&&!a)throw new TypeError('PowerRetry: `backoff: "decorrelated"` is defined as a randomised walk, so `jitter: false` contradicts it. Use `fixed` or `exponential` if you want a deterministic delay.');return{attempts:f,strategy:u,base:h,cap:p,timeoutMs:m,hedgeMs:y,jitter:a,retryAfter:l,signal:c}}var sa=class hc{constructor(t={}){Et(t,["maxAttempts","backoff","baseDelay","maxDelay","jitter","retryIf","classifyError","onRetry","attemptTimeout","budget","hedgeDelay","hedgeIf","circuit","retryAfter","signal"],"PowerRetry");const{budget:n=null,signal:r=null,...i}=t||{};this._options=i,this._defaultSignal=r,this._budget=Fo(n,"PowerRetry")}run(t,n={}){const r={...this._options,...n};return r.budget==null&&this._budget&&(r.budget=this._budget),r.signal==null&&this._defaultSignal&&(r.signal=this._defaultSignal),hc.run(t,r)}static async run(t,n={}){if(typeof t!="function")throw new TypeError("fn must be a function");const{retryIf:r=()=>!0,classifyError:i,onRetry:a,budget:o=null,circuit:s=null,hedgeIf:l}=n||{},c=Du(n);if(s!=null&&typeof s.call!="function")throw new TypeError("PowerRetry: `circuit` must expose call(fn)");const f=Fo(o,"PowerRetry.run");f&&f.recordRequest();const{attempts:u,strategy:h,base:p,cap:m,timeoutMs:y,hedgeMs:g,jitter:d,retryAfter:_,signal:w}=c;let k=p;const v=z=>{if(h==="decorrelated"){const q=Math.max(p,k*3);return k=Math.min(m,p+Math.random()*(q-p)),Math.round(k)}let W;return h==="linear"?W=p*z:h==="fixed"?W=p:W=p*Math.pow(2,z-1),W>m&&(W=m),d&&(W=Math.round(W*(.5+Math.random()*.5))),W},I=z=>{let W=g>0&&z===1;if(W&&typeof l=="function")try{W=l({attempt:z,budget:f,circuit:s})!==!1}catch{W=!1}const q=typeof AbortController=="function",ae=[],G=se=>{const K=se&&q?new AbortController:null,de=(async()=>t(K?K.signal:void 0))();return ae.push({promise:de,controller:K}),de},ke=[G(y>0||W)];let Y=null,B=!1;if(W&&(!f||f.tryConsumeRetry())){const se=new Promise((K,de)=>{Y=setTimeout(()=>{Y=null,B=!0,G(!0).then(K,de)},g)});ke.push(se)}let E=null,A=!1;y>0&&ke.push(new Promise((se,K)=>{E=setTimeout(()=>{A=!0,K(Object.assign(new Error("Attempt timed out"),{code:"ETIMEOUT",attempts:z,attemptTimeout:y}))},y)}));let C=-1;const M=ke.map((se,K)=>se.then(de=>(C===-1&&(C=K),de),de=>{throw C===-1&&(C=K),de}));return Promise.race(M).finally(()=>{if(E&&clearTimeout(E),Y&&(clearTimeout(Y),Y=null),!!(A||B))for(let se=0;se<ae.length;se++){if(!A&&se===C)continue;const{controller:K}=ae[se];if(K)try{K.abort()}catch{}}})};let N=null;for(let z=1;z<=u;z++){if(w&&w.aborted)throw ms(w.reason);try{return await(s?s.call(()=>I(z)):I(z))}catch(W){if(N=W,W?.code==="ECIRCUITOPEN")throw W;if(f&&typeof i=="function")try{const G=i(W,z);G&&typeof G=="object"&&f.recordOutcome(G)}catch{}let q;try{q=typeof r=="function"?!!await r(W):!!r}catch{q=!1}if(!q||z===u||f&&!f.tryConsumeRetry())break;let ae=v(z);if(typeof _=="function")try{const G=_(W,z);Number.isFinite(G)&&G>=0&&(ae=Math.min(m,G))}catch{}if(typeof a=="function")try{a(z,W,ae)}catch{}await $u(ae,w)}}throw N}},Zr=class{static async run(e,t={}){if(typeof e!="function")throw new TypeError("fn must be a function");const{maxAttempts:n=1,attemptTimeout:r=null,totalTimeout:i=null,retryDelay:a=0,retryIf:o=()=>!0,signal:s=null,onRetry:l,backoff:c,baseDelay:f,maxDelay:u,jitter:h}=t||{},p=je(n,{name:"maxAttempts",className:"PowerDeadline",min:1,integer:!0,fallback:1}),m=r==null?null:je(r,{name:"attemptTimeout",className:"PowerDeadline",min:1}),y=i==null?null:je(i,{name:"totalTimeout",className:"PowerDeadline",min:1}),g=je(a,{name:"retryDelay",className:"PowerDeadline",min:0,fallback:0}),d=typeof o=="function"?o:()=>!!o,_=rt(),w=y!==null?_+y:null,k=w!==null&&typeof AbortController<"u"?new AbortController:null,v=()=>{if(!s)return null;if(s.aborted)return{promise:Promise.reject(Ui(s.reason,_,y)),cleanup:null};let q=null;return{promise:new Promise((ae,G)=>{const ke=()=>{G(Ui(s.reason,_,y))};s.addEventListener("abort",ke,{once:!0}),q=()=>s.removeEventListener("abort",ke)}),cleanup:q}},I=async(q,ae)=>{const G=rt();if(w!==null&&G>=w){const M=new Error("Deadline exceeded");throw M.code="EDEADLINE",M.attempts=q,M.elapsedMs=rt()-_,M}if(s?.aborted){const M=Ui(s.reason,_,y);throw M.attempts=q,M.attemptTimeout=m,M.totalTimeout=y,M}if(ae?.aborted){const M=Ui(ae.reason,_,y);throw M.attempts=q,M.attemptTimeout=m,M.totalTimeout=y,M}const ke=Do(ae,k?k.signal:null),Y=Do(s,ke.signal),B=Y.signal,E=v(),A=[Promise.resolve().then(()=>e(B))],C=[ke.detach,Y.detach];if(w!==null){const M=w-rt();let se;const K=new Promise((de,ye)=>{const Q=setTimeout(()=>{if(k)try{k.abort()}catch{}const Be=new Error("Deadline exceeded");Be.code="EDEADLINE",Be.attempts=q,Be.elapsedMs=rt()-_,ye(Be)},M);se=()=>clearTimeout(Q)});A.push(K),C.push(se)}E&&(A.push(E.promise),typeof E.cleanup=="function"&&C.push(E.cleanup));try{return await Promise.race(A)}catch(M){if(M&&typeof M=="object"){const se=M;se.attempts=q,se.attemptTimeout=m,se.totalTimeout=y}throw M}finally{for(const M of C)typeof M=="function"&&M()}},N={maxAttempts:p,attemptTimeout:m,retryIf:q=>q&&(q.code==="EABORT"||q.code==="EDEADLINE")?!1:d(q),onRetry:l};typeof c<"u"&&(N.backoff=c),typeof f<"u"&&(N.baseDelay=f),typeof u<"u"&&(N.maxDelay=u),typeof h<"u"&&(N.jitter=h),g>0&&typeof N.backoff>"u"&&(N.backoff="fixed",N.baseDelay=g,N.maxDelay=g,N.jitter=!1);let z=0;const W=async q=>(z+=1,I(z,q));return sa.run(W,N)}constructor(e={}){Et(e,["maxAttempts","attemptTimeout","totalTimeout","retryDelay","retryIf","signal","onRetry","backoff","baseDelay","maxDelay","jitter"],"PowerDeadline"),this._options=e||{}}async run(e,t={}){return this.constructor.run(e,Object.assign({},this._options,t))}},Ui=(e,t,n)=>{const r=new Error("Aborted");return r.code="EABORT",r.reason=e,r.attempts=0,r.elapsedMs=rt()-t,r.totalTimeout=n,r},Do=(e,t)=>{const n=()=>{};if(!e&&!t)return{signal:void 0,detach:n};if(!e)return{signal:t,detach:n};if(!t)return{signal:e,detach:n};if(typeof AbortController>"u")return{signal:e,detach:n};if(e.aborted||t.aborted){const l=new AbortController,c=e.aborted?e.reason:t.reason;try{l.abort(c)}catch{l.abort()}return{signal:l.signal,detach:n}}const r=new AbortController,i=l=>{try{r.abort(l&&l.target&&"reason"in l.target?l.target.reason:void 0)}catch{}},a=[e,t].filter(l=>l&&typeof l.addEventListener=="function"&&typeof l.removeEventListener=="function");for(const l of a)l.addEventListener("abort",i,{once:!0});let o=!1;const s=()=>{if(!o){o=!0;for(const l of a)try{l.removeEventListener("abort",i)}catch{}}};return{signal:r.signal,detach:s}},Uu=Sa({currentLang:()=>Lt,formatDate:()=>Bu,formatNumber:()=>Wu,loadL10nFile:()=>qs,setLang:()=>Hs,t:()=>Xn,tPlural:()=>ju}),rn=structuredClone(cc),oa="en";if(typeof navigator<"u"){const e=navigator.language||navigator.languages?.[0]||"en";oa=String(e).split("-")[0].toLowerCase()}cc[oa]||(oa="en");var Lt=oa;function Xn(e,t={}){let n=(rn[Lt]||rn.en)?.[e]||rn.en[e]||"";for(const r of Object.keys(t)){const i=r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");n=n.replace(new RegExp(`\\{${i}\\}`,"g"),String(t[r]))}return n}async function qs(e,t){if(!e)return;let n=e;const r=async i=>{if(Zr&&typeof Zr.run=="function")return await Zr.run(()=>fetch(i),{attemptTimeout:1e4,maxAttempts:1});let a=null;try{typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function"&&(a=AbortSignal.timeout(1e4))}catch{}return await fetch(i,a?{signal:a}:void 0)};try{/^https?:\/\//.test(e)||(/^file:\/\//i.test(e)?n=e:n=new URL(e,location.origin+t).toString());const i=await r(n);if(!i.ok)return;const a=await i.json();for(const o of Object.keys(a||{}))rn[o]=Object.assign({},rn[o]||{},a[o])}catch{}}function ju(e,t,n={}){try{const r=rn[Lt]||rn.en,i=new Intl.PluralRules(Lt).select(t),a=`${e}.${i}`;let o=r?.[a]||"";if(!o){const l=r?.[e];l&&typeof l=="object"?o=l[i]||"":typeof l=="string"&&(o=l)}if(o||(o=rn.en[a]||""),!o){const l=rn.en[e];l&&typeof l=="object"?o=l[i]||"":typeof l=="string"&&(o=l)}const s={count:String(t),...n};for(const l of Object.keys(s)){const c=l.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");o=o.replace(new RegExp(`\\{${c}\\}`,"g"),String(s[l]))}return o}catch{return Xn(e,n)}}function Bu(e,t={}){try{const n=e instanceof Date?e:new Date(e);return isNaN(n.getTime())?String(e):new Intl.DateTimeFormat(Lt,{year:"numeric",month:"short",day:"numeric",...t}).format(n)}catch{return String(e)}}function Wu(e,t={}){try{return new Intl.NumberFormat(Lt,t).format(e)}catch{return String(e)}}function Hs(e){const t=String(e??"").split("-")[0].toLowerCase();Lt=rn[t]?t:"en";try{if(typeof document<"u"&&document.documentElement){document.documentElement.setAttribute("lang",t);try{const n=new Intl.Locale(t||"en"),r=n.textInfo&&n.textInfo.direction==="rtl"||["ar","he","fa","ur","ps","sd","ug","ku","dv","yi"].includes(t);document.documentElement.setAttribute("dir",r?"rtl":"ltr")}catch{}}}catch{}try{typeof window<"u"&&window.__nimbiUI&&typeof window.__nimbiUI.renderByQuery=="function"&&window.__nimbiUI.renderByQuery().catch(()=>{})}catch{}}var ne=new Map,ge=new Map,ft=[],Xe=new Set;function qu(e){ft=e}var wt=new Set,hi=!1;function Qi(){return hi}function Hu(e){hi=!!e}function dr(e){if(Vu(),wt.clear(),Array.isArray(ft)&&ft.length)for(const t of ft)t&&wt.add(t);else for(const t of Xe)t&&wt.add(t);Uo(ne),Uo(ge),hi=!0}try{Object.defineProperty(dr,"_refreshed",{get(){return hi},set(e){hi=!!e},configurable:!0})}catch{}function Uo(e){if(!(!e||typeof e.values!="function"))for(const t of e.values())t&&wt.add(t)}function jo(e){if(!e||typeof e.set!="function")return;const t=e.set;e.set=function(n,r){return r&&typeof r=="string"?wt.add(r):r?.default&&wt.add(r.default),t.call(this,n,r)}}var Bo=!1;function Vu(){Bo||(jo(ne),jo(ge),Bo=!0)}function Gu(e){try{return String(e??"").split("/").map(t=>encodeURIComponent(t)).join("/")}catch{return String(e??"")}}function Wo(e,t=null,n=void 0){let r="#/"+Gu(String(e??""));t&&(r+="#"+encodeURIComponent(String(t)));try{let i="";if(typeof n=="string")i=n;else if(typeof location<"u"&&location?.search)i=location.search;else if(typeof location<"u"&&location?.hash)try{const a=dt(location.href);a?.params&&(i=a.params)}catch{}if(i){const a=typeof i=="string"&&i.startsWith("?")?i.slice(1):i;try{const o=new URLSearchParams(a);o.delete("page");const s=o.toString();s&&(r+="?"+s)}catch{const s=String(a??"").replace(/^page=[^&]*&?/,"");s&&(r+="?"+s)}}}catch{}return r}function dt(e){try{const t=new URL(e,typeof location<"u"?location.href:"http://localhost/"),n=t.searchParams.get("page");if(n){let o=null,s="";if(t.hash){const f=t.hash.replace(/^#/,"");if(f.includes("&")){const u=f.split("&");o=u.shift()||null,s=u.join("&")}else o=f||null}const l=new URLSearchParams(t.search);l.delete("page");const c=[l.toString(),s].filter(Boolean).join("&");return{type:"canonical",page:decodeURIComponent(n),anchor:o,params:c}}const r=t.hash?decodeURIComponent(t.hash.replace(/^#/,"")):"";if(r&&r.startsWith("/")){let o=r,s="";if(o.indexOf("?")!==-1){const f=o.split("?");o=f.shift()||"",s=f.join("?")||""}let l=o,c=null;if(l.indexOf("#")!==-1){const f=l.split("#");l=f.shift()||"",c=f.join("#")||null}return{type:"cosmetic",page:l.replace(/^\/+/,"")||null,anchor:c,params:s}}let i=t.hash?t.hash.replace(/^#/,""):"",a=t.search?t.search.replace(/^\?/,""):"";if(i.includes("?")){const o=i.split("?");i=o.shift()||"",a=[a,o.join("?")].filter(Boolean).join("&")}return{type:"path",page:(t.pathname||"").replace(/^\//,"")||null,anchor:i||null,params:a}}catch{return{type:"unknown",page:e,anchor:null,params:""}}}var ji=typeof DOMParser<"u"?new DOMParser:null;function ot(){return ji||(typeof DOMParser<"u"?(ji=new DOMParser,ji):null)}function Yr(e){if(e.startsWith("---")){const t=e.indexOf(`
---`,3);if(t!==-1){const n=e.slice(3,t+0).trim(),r=e.slice(t+4).trimStart(),i={};return n.split(/\r?\n/).forEach(a=>{const o=a.match(/^([^:]+):\s*(.*)$/);o&&(i[o[1].trim()]=o[2].trim())}),{content:r,data:i}}}return{content:e,data:{}}}var uc=`let _, $;
function te() {
	return _ !== void 0 ? _ === !1 ? null : _ : typeof TextEncoder < "u" ? (_ = new TextEncoder(), _) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (_ = { encode: (e) => new Uint8Array(Buffer.from(e)) }, _) : null;
}
function R(e) {
	if (e instanceof ArrayBuffer) return !0;
	try {
		return typeof Reflect.get(ArrayBuffer.prototype, "byteLength", e) == "number";
	} catch {
		return !1;
	}
}
function V(e) {
	if (typeof SharedArrayBuffer > "u") return !1;
	if (e instanceof SharedArrayBuffer) return !0;
	try {
		return typeof Reflect.get(SharedArrayBuffer.prototype, "byteLength", e) == "number";
	} catch {
		return !1;
	}
}
function re() {
	return $ !== void 0 ? $ === !1 ? null : $ : typeof TextDecoder < "u" ? ($ = new TextDecoder(), $) : typeof Buffer < "u" && typeof Buffer.from == "function" ? ($ = { decode: (e) => Buffer.from(e).toString("utf8") }, $) : null;
}
const J = (e, t) => {
	if (e instanceof Uint8Array) return e;
	if (ArrayBuffer.isView(e)) return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
	if (R(e)) return new Uint8Array(e);
	if (V(e)) return new Uint8Array(e);
	const r = t ?? JSON.stringify(e);
	if (typeof r != "string") throw new TypeError(\`PowerBuffer.o2u8: JSON.stringify returned \${r === void 0 ? "undefined" : typeof r} for a value of type \${typeof e}, which is not encodable. Functions, Symbols and \\\`undefined\\\` have no JSON representation.\`);
	const n = te();
	if (typeof n?.encode == "function") return n.encode(r);
	throw new Error("No TextEncoder or Buffer available to encode object");
}, z = (e) => {
	let t;
	if (e instanceof Uint8Array) t = e;
	else if (ArrayBuffer.isView(e)) t = new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
	else if (R(e)) t = new Uint8Array(e);
	else if (V(e)) t = new Uint8Array(e);
	else if (typeof Buffer < "u" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(e)) t = new Uint8Array(e);
	else throw new TypeError("Unsupported input to u82o, expected ArrayBuffer/TypedArray/Buffer");
	const r = re();
	if (typeof r?.decode == "function") return JSON.parse(r.decode(t));
	throw new Error("No TextDecoder or Buffer available to decode object");
};
function ne(e, t) {
	const { name: r, className: n, min: s = 0, integer: i = !1, allowInfinity: o = !1, fallback: a, invalidMessage: l, minMessage: u, integerMessage: y } = t;
	if (e == null) return a !== void 0 ? a : e;
	const d = Number(e);
	if (d === Number.POSITIVE_INFINITY && o) return d;
	if (!Number.isFinite(d)) throw new TypeError(l ?? \`\${n}: \\\`\${r}\\\` must be a finite number (received \${String(e)}). A non-finite limit would silently disable the check it guards.\`);
	if (i && !Number.isInteger(d)) throw new TypeError(y ?? \`\${n}: \\\`\${r}\\\` must be a whole number (received \${String(e)}). A fractional limit is silently rounded up by the first consumer, so it admits more than the number that was configured.\`);
	if (d < s) throw new TypeError(u ?? \`\${n}: \\\`\${r}\\\` must be >= \${s} (received \${d}).\`);
	return d;
}
function ie(e, t) {
	const r = ne(e, t);
	if (typeof r != "number") throw new TypeError(\`\${t.className}: \\\`\${t.name}\\\` must be a number or have a \\\`fallback\\\`, but resolved to \${String(r)}.\`);
	return r;
}
const E = Object.freeze({
	JSON: 0,
	RAW: 2
});
const Y = /* @__PURE__ */ new Set([
	"framed",
	"legacy",
	"negotiated"
]);
for (const e of [
	"add",
	"delete",
	"clear"
]) Object.defineProperty(Y, e, {
	value: () => {
		throw new TypeError(\`MESSAGE_CODECS is read-only: \\\`\${e}()\\\` would let a consumer widen the set of codecs a pool accepts, and PowerPool validates against it.\`);
	},
	enumerable: !1,
	writable: !1,
	configurable: !1
});
const oe = /* @__PURE__ */ new Map([[E.JSON, "json"], [E.RAW, "raw"]]), ae = /* @__PURE__ */ new Map([["json", E.JSON], ["raw", E.RAW]]);
function q() {
	return typeof structuredClone == "function";
}
function U(e) {
	return R(e) || typeof ArrayBuffer < "u" && ArrayBuffer.isView(e);
}
function j(e) {
	return U(e) ? "raw" : "json";
}
function se(e, t = {}) {
	const r = t.codec || j(e), n = ae.get(r);
	if (n === void 0) throw new TypeError(\`PowerMessageCodec: unknown codec "\${r}". Expected "json" or "raw". For structured-clone speed on a MessagePort/Worker use encodeNativeEnvelope() instead.\`);
	let s;
	if (n === E.RAW) {
		if (!U(e)) throw new TypeError("PowerMessageCodec: the \\"raw\\" codec requires an ArrayBuffer or a typed array");
		s = R(e) ? new Uint8Array(e) : new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
	} else s = J(e);
	return I(n, s);
}
function I(e, t) {
	const r = new Uint8Array(6 + t.length);
	return r[0] = 1, r[1] = e, r[2] = t.length & 255, r[3] = t.length >>> 8 & 255, r[4] = t.length >>> 16 & 255, r[5] = t.length >>> 24 & 255, r.set(t, 6), r;
}
function ce(e) {
	if (typeof e == "string") return I(E.JSON, J(null, e));
	if (!U(e)) throw new TypeError("PowerMessageCodec: frameEncodedJson() requires a Uint8Array or a JSON string");
	return I(E.JSON, x(e));
}
function P(e, t = 0) {
	return (e[t + 2] | e[t + 3] << 8 | e[t + 4] << 16 | e[t + 5] << 24) >>> 0;
}
function v(e, t = {}) {
	const r = t.strict !== !1, n = x(e);
	if (n.length < 6) throw new RangeError(\`PowerMessageCodec: frame is \${n.length} bytes, shorter than the 6-byte header\`);
	const s = n[0];
	if (r && s !== 1) throw new RangeError(\`PowerMessageCodec: unsupported protocol version \${s} (expected 1)\`);
	const i = oe.get(n[1]);
	if (i === void 0) throw new RangeError(\`PowerMessageCodec: unknown codec id \${n[1]}\`);
	const o = P(n);
	if (n.length < 6 + o) throw new RangeError(\`PowerMessageCodec: frame declares a \${o}-byte payload but only \${n.length - 6} bytes are present (truncated frame)\`);
	const a = 6, l = a + o;
	return {
		version: s,
		codec: i,
		value: i === "raw" ? t.rawAsBytes === !0 ? n.subarray(a, l) : n.slice(a, l) : z(n.subarray(a, l)),
		byteLength: l
	};
}
function fe(e) {
	if (e?.maxFrameBytes === void 0) throw new TypeError("PowerMessageCodec: createFrameDecoder() requires \`maxFrameBytes\`. A frame declares its own payload length, so a peer that sends a header and then stops would pin this buffer at whatever size it named. Pass \`Infinity\` to accept that risk explicitly.");
	const t = ie(e.maxFrameBytes, {
		name: "maxFrameBytes",
		className: "PowerMessageCodec.createFrameDecoder",
		min: 6,
		integer: !0,
		allowInfinity: !0
	}), r = e.strict !== !1, n = e.rawAsBytes === !0, s = 1024;
	let i = new Uint8Array(s), o = 0, a = 0;
	function l(u) {
		if (a + u <= i.length) return;
		const y = a - o;
		if (y + u <= i.length) i.copyWithin(0, o, a);
		else {
			let d = i.length || s;
			for (; d < y + u;) d *= 2;
			const h = new Uint8Array(d);
			h.set(i.subarray(o, a)), i = h;
		}
		o = 0, a = y;
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
		push(u) {
			const y = x(u);
			l(y.length), i.set(y, a), a += y.length;
			const d = [];
			for (; a - o >= 6;) {
				const h = P(i, o);
				if (6 + h > t) throw new RangeError(\`PowerMessageCodec: frame declares \${6 + h} bytes, over the maxFrameBytes limit of \${t}\`);
				if (a - o < 6 + h) break;
				const p = v(i.subarray(o, a), {
					strict: r,
					rawAsBytes: n
				});
				d.push(p), o += p.byteLength;
			}
			return o === a && (o = 0, a = 0), d;
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
		flush(u = {}) {
			const y = a - o;
			if (y > 0 && u.strict === !0) {
				const d = y < 6 ? null : P(i, o), h = d === null ? 6 : 6 + d;
				throw new RangeError(\`PowerMessageCodec: stream ended mid-frame — \${y} of \${h} bytes buffered\` + (d === null ? ", not even a whole header" : ""));
			}
			return i.slice(o, a);
		},
		/** Bytes currently held for an incomplete frame. */
		get pendingBytes() {
			return a - o;
		},
		/**
		* Drop any incomplete frame and start over, keeping the buffer for reuse.
		*
		* For a stream that has desynchronised and cannot be resynchronised: once a
		* frame is mis-parsed the length prefix is no longer trustworthy, so the
		* bytes after it cannot be framed either.
		*/
		reset() {
			o = 0, a = 0;
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
			this.reset(), i = /* @__PURE__ */ new Uint8Array(0);
		},
		[Symbol.dispose]() {
			this.dispose();
		}
	};
}
function le(e) {
	if (!q()) throw new TypeError("PowerMessageCodec: structuredClone is unavailable in this runtime. Use encodeMessage() for a portable JSON frame instead.");
	const t = structuredClone(e);
	return {
		message: t,
		transfer: K(t)
	};
}
function ue(e) {
	if (typeof SharedArrayBuffer < "u" && e.buffer instanceof SharedArrayBuffer) return [];
	if (e.byteOffset !== 0 || e.byteLength !== e.buffer.byteLength) throw new RangeError(\`PowerMessageCodec: refusing to build a transfer list for a \${e.byteLength}-byte view at offset \${e.byteOffset} of a \${e.buffer.byteLength}-byte buffer — transferring \\\`frame.buffer\\\` would detach the whole buffer, including bytes outside this frame. Copy the view, or transfer the buffer it fills.\`);
	return [e.buffer];
}
const D = "__pp";
function G(e) {
	return e !== null && typeof e == "object" && e.__pp === 1 && e.kind === "envelope" && "value" in e;
}
function de(e) {
	return e !== null && typeof e == "object" && e.__pp === 1 && e.kind === "capabilities" && Array.isArray(e.codecs);
}
function he(e, t = {}) {
	const r = {
		[D]: 1,
		kind: "envelope",
		value: e
	};
	return t.correlationId != null && (r.correlationId = String(t.correlationId)), r;
}
function H(e = {}) {
	const t = Array.isArray(e.codecs) && e.codecs.length ? e.codecs.filter((r) => r === "json" || r === "native") : ["json", "native"];
	return {
		[D]: 1,
		kind: "capabilities",
		codecs: t.includes("json") ? t : ["json", ...t],
		protocol: 1
	};
}
function K(e, t = 8) {
	const r = [], n = /* @__PURE__ */ new Set(), s = (i, o) => {
		if (!(!i || o > t)) {
			if (i instanceof ArrayBuffer) {
				n.has(i) || (n.add(i), r.push(i));
				return;
			}
			if (ArrayBuffer.isView(i)) {
				n.has(i.buffer) || (n.add(i.buffer), r.push(i.buffer));
				return;
			}
			if (typeof i == "object") for (const a of Object.keys(i)) s(i[a], o + 1);
		}
	};
	return s(e, 0), r;
}
function Q(e) {
	if (G(e)) return {
		codec: "native",
		value: e.value,
		correlationId: e.correlationId
	};
	if (R(e) || ArrayBuffer.isView(e)) {
		const t = x(e);
		if (t.length >= 6 && t[0] === 1) {
			const r = v(t);
			return {
				codec: r.codec,
				value: r.value,
				correlationId: void 0
			};
		}
		if (!ye(t[0])) throw t[0] === 1 ? /* @__PURE__ */ new RangeError(\`PowerMessageCodec: truncated frame — \${t.length} byte(s) is shorter than the 6-byte header\`) : /* @__PURE__ */ new RangeError(\`PowerMessageCodec: unsupported protocol version \${t[0]} (expected 1)\`);
		return {
			codec: "legacy",
			value: z(t),
			correlationId: void 0
		};
	}
	return {
		codec: "raw",
		value: e,
		correlationId: void 0
	};
}
function ye(e) {
	return e === 32 || e === 9 || e === 10 || e === 13 ? !0 : e >= 32;
}
function x(e) {
	if (e instanceof Uint8Array) return e;
	if (R(e)) return new Uint8Array(e);
	if (typeof ArrayBuffer < "u" && ArrayBuffer.isView(e)) return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
	throw new TypeError("PowerMessageCodec: expected a Uint8Array, ArrayBuffer or DataView");
}
Object.freeze({
	MESSAGE_PROTOCOL_VERSION: 1,
	CODECS: E,
	MESSAGE_CODECS: Y,
	HEADER_BYTES: 6,
	encodeMessage: se,
	decodeMessage: v,
	createFrameDecoder: fe,
	frameEncodedJson: ce,
	encodeNative: le,
	canUseNativeClone: q,
	selectCodec: j,
	isRawPayload: U,
	frameTransferList: ue,
	NATIVE_ENVELOPE_KEY: D,
	NATIVE_PROTOCOL_VERSION: 1,
	isNativeEnvelope: G,
	isCapabilityAnnouncement: de,
	encodeNativeEnvelope: he,
	announceCapabilities: H,
	collectTransferables: K,
	decodeInbound: Q
});
function ge(e) {
	if (e.startsWith("---")) {
		const t = e.indexOf(\`
---\`, 3);
		if (t !== -1) {
			const r = e.slice(3, t + 0).trim(), n = e.slice(t + 4).trimStart(), s = {};
			return r.split(/\\r?\\n/).forEach((i) => {
				const o = i.match(/^([^:]+):\\s*(.*)$/);
				o && (s[o[1].trim()] = o[2].trim());
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
let M = null, N = null, L = [];
const k = 1e3, pe = 4;
function T(e) {
	let t = String(e ?? "").toLowerCase().replace(/[^a-z0-9\\- ]/g, "").replace(/ /g, "-");
	return t = t.replace(/(?:-?)(?:md|html)$/g, ""), t = t.replace(/-+/g, "-"), t = t.replace(/^-|-$/g, ""), t.length > 80 && (t = t.slice(0, 80).replace(/-+$/g, "")), t;
}
function b(e) {
	return String(e ?? "").replace(/^[./]+/, "");
}
function we(e) {
	return String(e ?? "").replace(/\\/+$/, "");
}
function C(e) {
	return we(e) + "/";
}
function me(e, t) {
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
function W(e) {
	const t = typeof location < "u" && location.origin ? location.origin : "http://localhost", r = String(e ?? "");
	return r ? /^[a-z][a-z0-9+.-]*:/i.test(r) ? C(r) : r.startsWith("/") ? t + C(r) : t + "/" + C(r) : t + "/";
}
async function X(e, t) {
	const r = W(t), n = new URL(String(e ?? "").replace(/^\\//, ""), r).toString(), s = await fetch(n);
	return !s || !s.ok ? null : await s.text();
}
async function Ae(e, t, r = pe) {
	const n = Array.isArray(e) ? e.slice() : [], s = Math.max(1, Number(r) || 1), i = [];
	for (let o = 0; o < Math.min(s, n.length); o++) i.push((async () => {
		for (; n.length;) {
			const a = n.shift();
			a != null && await t(a);
		}
	})());
	await Promise.all(i);
}
async function Z(e, t = k, r = void 0) {
	const n = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), i = [""];
	if (Array.isArray(r)) for (const l of r) try {
		const u = b(l);
		u && i.push(u);
	} catch {}
	const o = W(e), a = C(new URL(o).pathname);
	for (; i.length && i.length <= t;) {
		const l = i.shift();
		if (l == null || n.has(l)) continue;
		n.add(l);
		const u = new URL(String(l ?? ""), o).toString();
		let y = null;
		try {
			const g = await fetch(u);
			if (!g || !g.ok) continue;
			y = await g.text();
		} catch {
			continue;
		}
		if (!y) continue;
		const d = [], h = /<a\\s+[^>]*href=["']([^"']+)["'][^>]*>/gi, p = /(?:^|[^!])\\[[^\\]]+\\]\\(([^)]+)\\)/g;
		let A = null;
		for (; A = h.exec(y);) try {
			A?.[1] && d.push(A[1]);
		} catch {}
		for (; A = p.exec(y);) try {
			A?.[1] && d.push(A[1]);
		} catch {}
		for (const g of d) {
			if (!g || me(g, o) || g.startsWith("..") || g.includes("/../")) continue;
			if (g.endsWith("/")) {
				try {
					const f = new URL(g, u);
					let c = f.pathname.startsWith(a) ? f.pathname.slice(a.length) : f.pathname.replace(/^\\//, "");
					c = C(b(c)), n.has(c) || i.push(c);
				} catch {}
				continue;
			}
			if (/\\.(md|html?)($|[?#])/i.test(g)) {
				try {
					const f = new URL(g, u);
					let c = f.pathname.startsWith(a) ? f.pathname.slice(a.length) : f.pathname.replace(/^\\//, "");
					c = b(c).split(/[?#]/)[0], c && (s.add(c), n.has(c) || i.push(c));
				} catch {}
				try {
					const f = new URL(g, o);
					let c = f.pathname.startsWith(a) ? f.pathname.slice(a.length) : f.pathname.replace(/^\\//, "");
					c = b(c).split(/[?#]/)[0], c && !s.has(c) && (s.add(c), n.has(c) || i.push(c));
				} catch {}
				continue;
			}
			let m = g.split(/[?#]/)[0].replace(/\\/+$/, ""), w = null;
			try {
				const f = new URL(g, o);
				w = f.pathname.startsWith(a) ? f.pathname.slice(a.length) : f.pathname.replace(/^\\//, "");
			} catch {}
			try {
				const f = new URL(g, u);
				m = f.pathname.startsWith(a) ? f.pathname.slice(a.length) : f.pathname.replace(/^\\//, "");
			} catch {}
			m = b(m).split(/[?#]/)[0].replace(/\\/+$/, ""), w && (w = b(w).split(/[?#]/)[0].replace(/\\/+$/, ""));
			const B = String(m).split("/").pop() || "";
			if (!/\\.[^./]+$/i.test(B)) {
				if (m) {
					const f = [
						\`\${m}.md\`,
						\`\${m}.html\`,
						\`\${m}/README.md\`,
						\`\${m}/README.html\`
					];
					for (const c of f) s.add(c), n.has(c) || i.push(c);
				}
				if (w && w !== m) {
					const f = [
						\`\${w}.md\`,
						\`\${w}.html\`,
						\`\${w}/README.md\`,
						\`\${w}/README.html\`
					];
					for (const c of f) s.has(c) || (s.add(c), n.has(c) || i.push(c));
				}
			}
		}
	}
	return Array.from(s);
}
function be(e, t) {
	const r = String(e ?? "");
	if (t) return {
		title: ((r.match(/<title[^>]*>([\\s\\S]*?)<\\/title>/i) || [])[1] || (r.match(/<h1[^>]*>([\\s\\S]*?)<\\/h1>/i) || [])[1] || "").replace(/<[^>]+>/g, "").trim(),
		excerpt: ((r.match(/<p[^>]*>([\\s\\S]*?)<\\/p>/i) || [])[1] || "").replace(/<[^>]+>/g, "").trim()
	};
	const n = ((r.match(/^#\\s+(.+)$/m) || [])[1] || "").trim(), s = r.split(/\\r?\\n\\s*\\r?\\n/);
	let i = "";
	for (let o = 1; o < s.length; o++) {
		const a = s[o].trim();
		if (a && !/^#/.test(a)) {
			i = a.replace(/\\r?\\n/g, " ");
			break;
		}
	}
	return {
		title: n,
		excerpt: i
	};
}
async function ee(e, t = 1, r = void 0, n = void 0) {
	const s = globalThis?.window?.__nimbiRuntimeManifest?.language || "", i = JSON.stringify([
		W(e),
		Number(t) || 1,
		Array.isArray(r) ? r.map(b).sort() : [],
		Array.isArray(n) ? n.map(b).sort() : [],
		s
	]);
	if (M && N === i) return M;
	N = i, M = (async () => {
		const o = Array.isArray(r) ? new Set(r.map((h) => b(h))) : /* @__PURE__ */ new Set(), a = Array.isArray(n) ? n.map((h) => b(h)).filter(Boolean) : [], l = await Z(e, k, a), u = Array.from(new Set(l.concat(a))).filter((h) => /\\.(md|html?)$/i.test(h)).filter((h) => !Array.from(o).some((p) => p && (h === p || h.startsWith(p + "/")))), y = [];
		await Ae(u, async (h) => {
			const p = await X(h, e);
			if (!p) return;
			const A = /\\.html?$/i.test(h), { title: g, excerpt: m } = be(p, A), w = T(g || h);
			let B = null, f = null;
			try {
				if (!A) {
					const { data: c } = ge(p), O = c.dateModified || c.date || c.lastmod;
					if (O) {
						const F = new Date(O);
						isNaN(F.getTime()) || (B = F.toISOString().split("T")[0]);
					}
					const S = c.image || c.og_image || c.cover || c.featured_image;
					S && String(S).trim() && (f = String(S).trim());
				}
			} catch {}
			if (y.push({
				slug: w,
				title: g,
				excerpt: m,
				path: h,
				lastmod: B,
				image: f
			}), Number(t) >= 2) {
				const c = A ? /<h2[^>]*>([\\s\\S]*?)<\\/h2>/gi : /^##\\s+(.+)$/gm;
				let O = null;
				for (; O = c.exec(p);) {
					const S = String(O[1] ?? "").replace(/<[^>]+>/g, "").trim();
					S && y.push({
						slug: \`\${w}::\${T(S)}\`,
						title: S,
						excerpt: "",
						path: h,
						parentTitle: g || "",
						lastmod: B
					});
				}
			}
		}), L = y;
		const d = globalThis?.window?.__nimbiRuntimeManifest;
		return d && Number.isInteger(d.generation) && Object.defineProperty(L, "manifest", {
			value: d,
			enumerable: !1,
			configurable: !0
		}), L;
	})();
	try {
		return await M;
	} finally {
		N === i && (M = null, N = null);
	}
}
async function Ee(e, t, r) {
	const n = T(e);
	if (!n) return null;
	const s = await ee(t), i = (Array.isArray(s) ? s : []).find((l) => {
		try {
			return String(l?.slug ?? "").split("::")[0] === n;
		} catch {
			return !1;
		}
	});
	if (i?.path) return i.path;
	const o = [\`\${n}.html\`, \`\${n}.md\`];
	for (const l of o) try {
		if (await X(l, t)) return l;
	} catch {}
	const a = await Z(t, r || k);
	for (const l of a) if (T(String(l ?? "").replace(/^.*\\//, "").replace(/\\.(md|html?)$/i, "")) === n) return l;
	return null;
}
try {
	typeof postMessage == "function" && postMessage(H({ native: !0 }));
} catch {}
onmessage = async (e) => {
	const t = Q(e.data), r = t.value, n = t.correlationId ?? r.correlationId, s = (o) => {
		n != null ? postMessage({
			correlationId: n,
			response: o
		}) : postMessage({
			id: r.id,
			result: o
		});
	}, i = (o) => {
		n != null ? postMessage({
			correlationId: n,
			response: { error: String(o) }
		}) : postMessage({
			id: r.id,
			error: String(o)
		});
	};
	try {
		if (r.type === "buildSearchIndex") {
			const { contentBase: o, indexDepth: a, noIndexing: l, seedPaths: u } = r;
			try {
				s(await ee(o, a, l, u));
			} catch (y) {
				i(y);
			}
			return;
		}
		if (r.type === "crawlForSlug") {
			const { slug: o, base: a, maxQueue: l } = r;
			try {
				const u = await Ee(o, a, l);
				s(u === void 0 ? null : u);
			} catch (u) {
				i(u);
			}
			return;
		}
	} catch (o) {
		i(o);
	}
};
`,qo=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",uc],{type:"text/javascript;charset=utf-8"});function Zu(e){let t;try{if(t=qo&&(self.URL||self.webkitURL).createObjectURL(qo),!t)throw"";const n=new Worker(t,{type:"module",name:e?.name});return n.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(t)}),n}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(uc),{type:"module",name:e?.name})}}var qn,Hn;function Yu(){return qn!==void 0?qn===!1?null:qn:typeof TextEncoder<"u"?(qn=new TextEncoder,qn):typeof Buffer<"u"&&typeof Buffer.from=="function"?(qn={encode:e=>new Uint8Array(Buffer.from(e))},qn):null}function xr(e){if(e instanceof ArrayBuffer)return!0;try{return typeof Reflect.get(ArrayBuffer.prototype,"byteLength",e)=="number"}catch{return!1}}function fc(e){if(typeof SharedArrayBuffer>"u")return!1;if(e instanceof SharedArrayBuffer)return!0;try{return typeof Reflect.get(SharedArrayBuffer.prototype,"byteLength",e)=="number"}catch{return!1}}function Qu(){return Hn!==void 0?Hn===!1?null:Hn:typeof TextDecoder<"u"?(Hn=new TextDecoder,Hn):typeof Buffer<"u"&&typeof Buffer.from=="function"?(Hn={decode:e=>Buffer.from(e).toString("utf8")},Hn):null}var pr=(e,t)=>{if(e instanceof Uint8Array)return e;if(ArrayBuffer.isView(e))return new Uint8Array(e.buffer,e.byteOffset,e.byteLength);if(xr(e))return new Uint8Array(e);if(fc(e))return new Uint8Array(e);const n=t??JSON.stringify(e);if(typeof n!="string")throw new TypeError(`PowerBuffer.o2u8: JSON.stringify returned ${n===void 0?"undefined":typeof n} for a value of type ${typeof e}, which is not encodable. Functions, Symbols and \`undefined\` have no JSON representation.`);const r=Yu();if(typeof r?.encode=="function")return r.encode(n);throw new Error("No TextEncoder or Buffer available to encode object")},Vs=e=>{let t;if(e instanceof Uint8Array)t=e;else if(ArrayBuffer.isView(e))t=new Uint8Array(e.buffer,e.byteOffset,e.byteLength);else if(xr(e))t=new Uint8Array(e);else if(fc(e))t=new Uint8Array(e);else if(typeof Buffer<"u"&&typeof Buffer.isBuffer=="function"&&Buffer.isBuffer(e))t=new Uint8Array(e);else throw new TypeError("Unsupported input to u82o, expected ArrayBuffer/TypedArray/Buffer");const n=Qu();if(typeof n?.decode=="function")return JSON.parse(n.decode(t));throw new Error("No TextDecoder or Buffer available to decode object")};function Qr(e){const t=e?.reason;if(gi(t))return t;try{return new DOMException("The operation was aborted","AbortError")}catch{const n=new Error("The operation was aborted");return n.name="AbortError",n}}var Xu=null;function Ho(){const e=Xu||(typeof require<"u"?require:null);if(e)return e("worker_threads").Worker;throw new Error("WorkerAgnostic: Node worker_threads is not available synchronously in pure ESM. Call `await preloadNode()` (imported from `performance-helpers` or `performance-helpers/WorkerAgnostic`) once before constructing a string-source worker, or set globalThis.Worker. A factory function does not need this preload.")}function Vo(){return typeof window<"u"&&typeof window.document<"u"?"browser":typeof self<"u"&&typeof self.importScripts=="function"?"webworker":typeof process<"u"&&process.versions?.node?"node":"unknown"}var Ya=["message","error","messageerror"];function Ku(e){const t={...e};return delete t.onError,t}function Go(e,t,n){const r=typeof globalThis<"u"&&globalThis.Worker||(typeof Worker<"u"?Worker:void 0);if(typeof r=="function"&&typeof e=="string"&&(n==="node"||n==="unknown"))return new r(e,t);if(n==="node"||n==="browser"||n==="webworker"){if(typeof e=="function")return Zo(e,()=>Ho(),t,n);if(typeof e=="string")return n==="node"?new(Ho())(e,t):dc(e,t);throw new Error("Invalid workerSource: expected Worker factory or path string")}if(typeof e=="function")return Zo(e,void 0,t,"unknown");throw new Error("Unsupported environment for WorkerAgnostic: cannot resolve a string workerSource without a global Worker or a known runtime")}function Zo(e,t,n,r){if(typeof e.prototype>"u")return Yo(e(),t,n,r);try{return new e}catch(i){if(i instanceof TypeError&&/not a constructor|cannot be invoked without\s*'new'|Class constructor|not constructable/i.test(String(i?.message)))return Yo(e(),t,n,r);throw i}}function Yo(e,t,n,r){if(e&&typeof e.then=="function")throw new TypeError("WorkerAgnostic: an async worker factory was passed. Construct the worker synchronously, or await the factory yourself and pass the instance.");return e&&typeof e=="object"&&typeof e.postMessage=="function"?e:typeof e=="string"?r==="node"?new(typeof t=="function"?t():t)(e,n):dc(e,n):e&&typeof e=="object"?e:{}}function dc(e,t){const n=t&&typeof t=="object"?t.baseUrl:void 0;let r=typeof n=="string"?n:void 0;if(!r&&typeof document<"u"){const i=document.currentScript;i?.src&&(r=i.src)}!r&&typeof location<"u"&&location.href&&(r=location.href);try{if(r)return new Worker(new URL(e,r),t)}catch{}return new Worker(e,t)}function Ju(e){if(Array.isArray(e))return e;if(e&&typeof e=="object"&&Array.isArray(e.transfer))return e.transfer}var ef=class{constructor(e,t={}){this.env=Vo(),this.options=t&&typeof t=="object"?t:{},this._onError=typeof this.options.onError=="function"?this.options.onError:null,this._wired=[],this._wiredProperties=[],this._disposed=!1,this._listeners=new Map,this.worker=Go(e,this._onError?Ku(this.options):this.options,this.env),this._wireEvents()}static create(e,t){return Go(e,t||{},Vo())}_wireEvents(){const e=this.worker;if(!e)return;const t=[];if(typeof e.addEventListener=="function"){this._nativeModel="listener";for(const n of Ya){const r=(...i)=>this._dispatch(n,...i);e.addEventListener(n,r),t.push([n,r])}}else if(typeof e.on=="function"){this._nativeModel="emitter";for(const n of Ya){const r=(...i)=>this._dispatch(n,...i);e.on(n,r),t.push([n,r])}}else{this._nativeModel="property";const n=[];for(const r of Ya){const i=r==="message"?"onmessage":r==="error"?"onerror":"onmessageerror",a=(...o)=>this._dispatch(r,...o);n.push([i,e[i]]),e[i]=a,t.push([r,a])}this._wiredProperties=n}this._wired=t}dispose(){if(this._disposed)return;this._disposed=!0;const e=this.worker;if(e){for(const[t,n]of this._wired??[])try{this._nativeModel==="listener"&&typeof e.removeEventListener=="function"?e.removeEventListener(t,n):this._nativeModel==="emitter"&&typeof e.off=="function"&&e.off(t,n)}catch{}if(this._nativeModel==="property"){const t=e;for(const[n,r]of this._wiredProperties??[])(t[n]!==void 0||r!==void 0)&&(t[n]=r)}}this._listeners.clear(),this._wired=[],this._wiredProperties=[]}[Symbol.dispose](){this.dispose()}_dispatch(e,...t){const n=this._listeners.get(e);if(!n||!n.size)return;let r;if(e==="message"){const i=t[0];r=[{data:this._nativeModel==="emitter"?i:i&&typeof i=="object"&&"data"in i?i.data:i,originalEvent:i}]}else r=t;for(const i of n)try{i(...r)}catch(a){this._notifyError(a,{type:e,listener:i})}}_notifyError(e,t){if(this._onError)try{this._onError(e,t)}catch{}}addEventListener(e,t){return typeof t!="function"?this:(this._listeners.has(e)||this._listeners.set(e,new Set),this._listeners.get(e).add(t),this)}removeEventListener(e,t){const n=this._listeners.get(e);return n&&(n.delete(t),n.size===0&&this._listeners.delete(e)),this}on(e,t){return this.addEventListener(e,t)}off(e,t){return this.removeEventListener(e,t)}postMessage(e,t){const n=this.worker;if(!n||typeof n.postMessage!="function")throw new Error("Underlying worker does not implement postMessage");const r=Ju(t);return r&&r.length?n.postMessage(e,r):n.postMessage(e)}terminate(){const e=this.worker;if(!e||typeof e.terminate!="function")return Promise.resolve();try{const t=e.terminate();return t&&typeof t.then=="function"?t:Promise.resolve(t)}catch(t){return Promise.reject(t)}}};function sr(e){if(e==null)return 1;const t=e.weight;return typeof t=="number"&&Number.isFinite(t)?t:1}var Xi=class{constructor(e=16){if(e&&typeof e=="object"&&"initialCapacity"in e){const r=e;Et(r,["initialCapacity"],"PowerQueue"),e=r.initialCapacity}const t=je(e,{name:"initialCapacity",className:"PowerQueue",min:0,fallback:16}),n=Math.max(2,t);for(this._capacity=1;this._capacity<n;)this._capacity<<=1;this._mask=this._capacity-1,this._buffer=new Array(this._capacity),this._head=0,this._tail=0,this._size=0,this._totalWeight=0}push(e){return this._size===this._capacity&&this._grow(),this._buffer[this._tail]=e,this._tail=this._tail+1&this._mask,this._size++,this._totalWeight+=sr(e),this._size}shift(){if(this._size===0)return;const e=this._buffer[this._head];return this._buffer[this._head]=void 0,this._head=this._head+1&this._mask,this._size--,this._totalWeight-=sr(e),e}peek(){return this._size===0?void 0:this._buffer[this._head]}reset(){this.clear()}clear(){if(this._size===0)return;let e=this._head;for(let t=0;t<this._size;t++)this._buffer[e]=void 0,e=e+1&this._mask;this._head=this._tail=0,this._size=0,this._totalWeight=0}shrink(e=16){const t=je(e,{name:"minimum",className:"PowerQueue",min:0,fallback:16}),n=Math.max(2,t,this._size);let r=1;for(;r<n;)r<<=1;if(r>=this._capacity)return this._capacity;const i=new Array(r);for(let a=0;a<this._size;a++)i[a]=this._buffer[this._head+a&this._mask];return this._buffer=i,this._capacity=r,this._mask=r-1,this._head=0,this._tail=this._size&this._mask,this._capacity}fill(e,t=1){const n=je(t,{name:"count",className:"PowerQueue",min:0,integer:!0,fallback:0}),r=sr(e)*n;for(let i=0;i<n;i++)this._size===this._capacity&&this._grow(),this._buffer[this._tail]=e,this._tail=this._tail+1&this._mask,this._size++;return this._totalWeight+=r,this._size}get capacity(){return this._capacity}get isEmpty(){return this._size===0}*[Symbol.iterator](){const e=this._head;for(let t=0;t<this._size;t++)yield this._buffer[e+t&this._mask]}values(){return this[Symbol.iterator]()}*keys(){for(let e=0;e<this._size;e++)yield e}*entries(){for(let e=0;e<this._size;e++)yield[e,this._buffer[this._head+e&this._mask]]}*drain(){for(;this._size>0;)yield this.shift()}toArray(){const e=new Array(this._size);for(let t=0;t<this._size;t++)e[t]=this._buffer[this._head+t&this._mask];return e}_grow(){const e=this._buffer,t=this._capacity<<1,n=new Array(t);for(let r=0;r<this._size;r++)n[r]=e[this._head+r&this._mask];this._buffer=n,this._capacity=t,this._mask=t-1,this._head=0,this._tail=this._size&this._mask}pushMany(e){if(!Array.isArray(e)||e.length===0)return this._size;const t=this._size+e.length;for(;this._capacity<t;)this._grow();const n=Math.min(e.length,this._capacity-this._tail);for(let i=0;i<n;i++)this._buffer[this._tail+i]=e[i];this._tail=this._tail+n&this._mask;let r=n;for(;r<e.length;){const i=Math.min(e.length-r,this._capacity-this._tail);for(let a=0;a<i;a++)this._buffer[this._tail+a]=e[r+a];this._tail=this._tail+i&this._mask,r+=i}this._size=t;for(let i=0;i<e.length;i++)this._totalWeight+=sr(e[i]);return this._size}get length(){return this._size}get totalWeight(){return this._totalWeight}removeAt(e){if(e<0||e>=this._size)return;const t=this._buffer,n=this._mask,r=this._head,i=t[r+e&n];for(let o=e;o<this._size-1;o++)t[r+o&n]=t[r+o+1&n];const a=r+this._size-1&n;return t[a]=void 0,this._tail=a,this._size--,this._totalWeight-=sr(i),i}shiftHighestPriority(e){if(this._size===0)return;let t=0,n=e(this._buffer[this._head&this._mask]);for(let r=1;r<this._size;r++){const i=e(this._buffer[this._head+r&this._mask]);i>n&&(n=i,t=r)}return this.removeAt(t)}unshiftMany(e){if(!Array.isArray(e)||e.length===0)return this._size;const t=this._size+e.length;for(;this._capacity<t;)this._grow();const n=this._head-e.length&this._mask;for(let r=0;r<e.length;r++)this._buffer[n+r&this._mask]=e[r];this._head=n,this._size=t;for(let r=0;r<e.length;r++)this._totalWeight+=sr(e[r]);return this._size}},tf=Symbol("PowerSubscriberSet.original");function or(e){return"deref"in e&&typeof e.deref=="function"}var fn=class{constructor(e={}){Et(e,["weak","maxListeners"],"PowerSubscriberSet");const{weak:t=!1,maxListeners:n=0}=e||{};this._weak=!!t,this._maxListeners=je(n,{name:"maxListeners",className:"PowerSubscriberSet",integer:!0,min:0,fallback:0}),this._listeners=new Set,this._onceMap=new WeakMap,this._finalization=this._ensureFinalization()}get size(){return this._cleanup(),this._listeners.size}add(e){if(typeof e!="function"){if(!this._weak||!e||typeof e.deref!="function")throw new TypeError("listener must be a function");if(this._maxListeners>0&&this.size+1>this._maxListeners)throw new Error(`PowerSubscriberSet: adding listener exceeds maxListeners (${this._maxListeners})`);return this._listeners.add(e),()=>this.delete(e)}if(this._maxListeners>0&&this.size+1>this._maxListeners)throw new Error(`PowerSubscriberSet: adding listener exceeds maxListeners (${this._maxListeners})`);const t=this._makeEntry(e);return this._listeners.add(t),()=>this.delete(e)}addOnce(e){if(typeof e!="function")throw new TypeError("listener must be a function");const t=((...r)=>(this.delete(e),e(...r)));try{t[tf]=e}catch{}if(this._maxListeners>0&&this.size+1>this._maxListeners)throw new Error(`PowerSubscriberSet: adding listener exceeds maxListeners (${this._maxListeners})`);this._onceMap.set(e,t);const n=this._makeEntry(t);return this._listeners.add(n),()=>this.delete(e)}delete(e){let t=e;if(!or(e)){const n=this._onceMap.get(e);n&&(t=n,this._onceMap.delete(e))}if(!this._weak)return this._listeners.delete(t);for(const n of this._listeners){if(n===t)return this._listeners.delete(n),this._finalization&&or(n)&&this._finalization.unregister(n),!0;const r=this._deref(n);if(!r){this._listeners.delete(n);continue}if(r===t)return this._listeners.delete(n),this._finalization&&or(n)&&this._finalization.unregister(n),!0}return!1}forEach(e){for(const t of this._listeners){const n=this._deref(t);if(!n){this._listeners.delete(t);continue}e(n)}}reset(){this.clear()}clear(){if(this._finalization){for(const e of this._listeners)or(e)&&this._finalization.unregister(e);this._finalization=null}this._listeners.clear(),this._onceMap=new WeakMap}values(){this._cleanup();const e=[];for(const t of this._listeners){const n=this._deref(t);n&&e.push(n)}return e}*[Symbol.iterator](){for(const e of this._listeners){const t=this._deref(e);if(!t){this._listeners.delete(e);continue}yield t}}_cleanup(){if(!(!this._weak||typeof WeakRef>"u"))for(const e of this._listeners)or(e)&&!e.deref()&&this._listeners.delete(e)}_makeEntry(e){if(this._weak&&typeof WeakRef<"u"){const t=new WeakRef(e),n=this._ensureFinalization();if(n)try{n.register(e,{ref:t},t)}catch{}return t}return e}_ensureFinalization(){return this._finalization?this._finalization:!this._weak||typeof WeakRef>"u"||typeof FinalizationRegistry>"u"?null:(this._finalization=new FinalizationRegistry(e=>{this._listeners.delete(e.ref)}),this._finalization)}_deref(e){return or(e)?e.deref():e}dispose(){this.clear(),yi(this,"clear")}[Symbol.dispose](){this.dispose()}};function Qa(e){if(e){if(typeof e.cleanup=="function"){try{e.cleanup()}catch{}return}if(typeof e._cleanup=="function"){try{e._cleanup()}catch{}return}if(typeof e[Symbol.iterator]=="function"&&typeof e.delete=="function")for(const t of e)(typeof t?.deref=="function"?t.deref():t)||e.delete(t)}}function Bi(e,t){let n;try{n=e(t)}catch{return}return n!=null&&typeof n.then=="function"&&n.then(void 0,()=>{}),n}var nf=class{constructor(e={}){Et(e,["maxListeners","weak"],"PowerEventBus"),this._listeners=new Map,this._maxListeners=je(e.maxListeners,{name:"maxListeners",className:"PowerEventBus",min:0,fallback:0}),this._weak=!!e.weak,this._fr=null,this._finalizationRefs=new WeakMap,this._eventFinalizationRefs=new Map,this._wildcards=new Map}_isWildcard(e){return e.includes("*")}_wildcardRegex(e){const t=e.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*/g,"[^:]*");return new RegExp(`^${t}$`)}_ensureFinalizationRegistry(){return!this._weak||typeof FinalizationRegistry>"u"?null:this._fr?this._fr:(this._fr=new FinalizationRegistry(e=>{try{const{event:t,ref:n}=e,r=this._listeners.get(t),i=this._eventFinalizationRefs.get(t);if(i&&n&&(i.delete(n),i.size===0&&this._eventFinalizationRefs.delete(t)),!r)return;Qa(r),r.size===0&&(this._listeners.delete(t),this._eventFinalizationRefs.delete(t))}catch{}}),this._fr)}cleanup(){if(this._weak){for(const[e,t]of this._listeners)Qa(t),t.size===0&&(this._clearWeakListenerEvent(e),this._listeners.delete(e));for(const[e,t]of this._wildcards)Qa(t),t.size===0&&(this._clearWeakListenerEvent(e),this._wildcards.delete(e))}}on(e,t){if(typeof t!="function")throw new TypeError("listener must be a function");const n=this._isWildcard(e)?this._wildcards:this._listeners;let r=this._getBucket(e,n);r||(r=new fn({maxListeners:this._maxListeners,weak:this._weak}),n.set(e,r));const i=r.add(t);return this._registerWeakListener(t,e)?()=>{i(),this._unregisterWeakListener(t,e)}:i}_getBucket(e,t=this._listeners){const n=t.get(e);if(!n)return null;if(n instanceof fn)return n;const r=new fn({maxListeners:this._maxListeners,weak:this._weak});for(const i of n){const a="deref"in i?i.deref():i;a&&r.add(a)}return t.set(e,r),r}_registerWeakListener(e,t){const n=this._ensureFinalizationRegistry();if(!n||typeof WeakRef>"u")return null;const r=new WeakRef(e);try{const i={event:t,ref:r};n.register(e,i,r);let a=this._finalizationRefs.get(e);a||(a=new Map,this._finalizationRefs.set(e,a));let o=a.get(t);o||(o=new Set,a.set(t,o)),o.add(r);let s=this._eventFinalizationRefs.get(t);s||(s=new Set,this._eventFinalizationRefs.set(t,s)),s.add(r)}catch{return null}return r}_unregisterWeakListener(e,t){if(!this._fr||!this._finalizationRefs.has(e))return;const n=this._finalizationRefs.get(e);if(!n||n.size===0){this._finalizationRefs.delete(e);return}const r=t!==void 0?[t]:Array.from(n.keys());for(const i of r){const a=n.get(i);if(!a||a.size===0){n.delete(i);continue}for(const o of a){try{this._fr.unregister(o)}catch{}const s=this._eventFinalizationRefs.get(i);s&&(s.delete(o),s.size===0&&this._eventFinalizationRefs.delete(i))}n.delete(i)}n.size===0&&this._finalizationRefs.delete(e)}_clearWeakListenerEvent(e){if(!this._fr)return;const t=this._eventFinalizationRefs.get(e);if(t){for(const n of t)try{this._fr.unregister(n)}catch{}this._eventFinalizationRefs.delete(e)}}once(e,t){if(typeof t!="function")throw new TypeError("listener must be a function");const n=this._isWildcard(e)?this._wildcards:this._listeners;let r=this._getBucket(e,n);r||(r=new fn({maxListeners:this._maxListeners,weak:this._weak}),n.set(e,r));const i=r.addOnce(t);return this._registerWeakListener(t,e)?()=>{i(),this._unregisterWeakListener(t,e)}:i}off(e,t){const n=this._isWildcard(e)?this._wildcards:this._listeners,r=this._getBucket(e,n);r&&(r.delete(t),this._unregisterWeakListener(t,e),r.size===0&&(this._clearWeakListenerEvent(e),n.delete(e)))}emit(e,t){let n=!1;const r=this._listeners.get(e);if(r&&r.size>0)if(r instanceof fn){for(const i of r.values())n=!0,Bi(i,t);r.size===0&&(this._clearWeakListenerEvent(e),this._listeners.delete(e))}else{const i=r.size>0;for(const a of[...r]){const o="deref"in a?a.deref():a;if(!o){r.delete(a);continue}n=!0,Bi(o,t)}r.size===0&&(this._clearWeakListenerEvent(e),this._listeners.delete(e)),i&&(n=!0)}for(const[i,a]of this._wildcards)if(this._wildcardRegex(i).test(e)&&a.size!==0)if(a instanceof fn){for(const o of a.values())n=!0,Bi(o,t);a.size===0&&(this._clearWeakListenerEvent(i),this._wildcards.delete(i))}else{for(const o of[...a]){const s="deref"in o?o.deref():o;if(!s){a.delete(o);continue}n=!0,Bi(s,t)}a.size===0&&(this._clearWeakListenerEvent(i),this._wildcards.delete(i))}return n}*_iterBucketListeners(e){if(e instanceof fn){yield*e;return}for(const t of e){const n="deref"in t?t.deref():t;if(!n){e.delete(t);continue}yield n}}async emitAsync(e,t,{concurrency:n=1/0}={}){const r=this._listeners.get(e);if((!r||r.size===0)&&this._wildcards.size===0)return!1;const i=Number.isFinite(+n)&&+n>0?Math.max(1,Math.floor(+n)):1/0,a=async c=>{try{await c(t)}catch{}},o=new Set;let s=!1;const l=async(c,f)=>{for(const u of this._iterBucketListeners(c)){if(!u)continue;s=!0;const h=Promise.resolve().then(()=>a(u)).finally(()=>{o.delete(h)});o.add(h),Number.isFinite(i)&&o.size>=i&&await Promise.race(o)}c.size===0&&(this._clearWeakListenerEvent(f),this._listeners.delete(f))};r&&r.size>0&&await l(r,e);for(const[c,f]of this._wildcards)this._wildcardRegex(c).test(e)&&f.size!==0&&await l(f,c);return o.size&&await Promise.all(o),s}listeners(e){const t=[],n=this._listeners.get(e);if(n)if(n instanceof fn)t.push(...n.values());else for(const r of n){const i="deref"in r?r.deref():r;i&&t.push(i)}for(const[r,i]of this._wildcards)if(this._wildcardRegex(r).test(e))if(i instanceof fn)t.push(...i.values());else for(const a of i){const o="deref"in a?a.deref():a;o&&t.push(o)}return t}clear(e){if(e===void 0){for(const t of this._eventFinalizationRefs.keys())this._clearWeakListenerEvent(t);this._eventFinalizationRefs.clear(),this._finalizationRefs=new WeakMap,this._listeners.clear(),this._wildcards.clear();return}this._clearWeakListenerEvent(e),this._listeners.delete(e);for(const[t]of this._wildcards)this._wildcardRegex(t).test(e)&&(this._clearWeakListenerEvent(t),this._wildcards.delete(t))}reset(e){this.clear(e)}dispose(){this.clear(),yi(this,"clear")}[Symbol.dispose](){this.dispose()}},rf=class{constructor(e={}){if(Et(e,["setpoint","kp","ki","kd","derivativeFilter","min","max","feedforward","feedforwardGain","dt"],"PowerServo"),this._setpoint=0,this.setpoint=kn(e.setpoint,0),this._kp=kn(e.kp,0),this._ki=kn(e.ki,0),this._kd=kn(e.kd,0),this._derivativeFilter=af(kn(e.derivativeFilter,0),0,.999),this._min=Ko(e.min,-1/0,Number.NEGATIVE_INFINITY,1/0),this._max=Ko(e.max,1/0,Number.NEGATIVE_INFINITY,1/0),this.max<this.min)throw new RangeError(`PowerServo: max (${this.max}) must be >= min (${this.min})`);const t=e.feedforward;if(t!=null&&typeof t!="function"&&typeof t!="number")throw new TypeError(`PowerServo: feedforward must be a function or a number, got ${typeof t}`);this._feedforward=t??null,this._feedforwardGain=kn(e.feedforwardGain,0),this._defaultDt=Math.max(0,kn(e.dt,1)),this._integral=0,this._previousMeasured=null,this._derivative=0,this._output=0,this._error=0,this._saturated=!1}get setpoint(){return this._setpoint}set setpoint(e){if(typeof e!="number"||!Number.isFinite(e))throw new TypeError(`PowerServo: setpoint must be a finite number, got ${e}`);this._setpoint=e}get min(){return this._min}set min(e){const t=Xo(e,"min");if(t>this._max)throw new RangeError(`PowerServo: min (${t}) must be <= max (${this._max})`);this._min=t}get max(){return this._max}set max(e){const t=Xo(e,"max");if(t<this._min)throw new RangeError(`PowerServo: max (${t}) must be >= min (${this._min})`);this._max=t}step(e,t,n=0){if(!Number.isFinite(e))throw new TypeError(`PowerServo: measured must be a finite number, got ${e}`);const r=t===void 0?this._defaultDt:Math.max(0,kn(t,0)),i=this.setpoint-e;let a=0;this._kd!==0&&(this._previousMeasured!==null&&r>0&&(a=(this._previousMeasured-e)/r),this._derivative=this._derivativeFilter===0?a:this._derivative+this._derivativeFilter*(a-this._derivative)),this._previousMeasured=e;const o=this._kp*i+this._ki*this._integral+this._kd*this._derivative;let s=0;if(typeof this._feedforward=="function"){const c=this._feedforward({measured:e,setpoint:this.setpoint,disturbance:n,output:this._output});if(typeof c!="number"||!Number.isFinite(c))throw new TypeError(`PowerServo: feedforward returned ${c}, expected a finite number`);s=c}else this._feedforwardGain!==0&&(s=this._feedforwardGain*n);const l=sf(s+o,this.min,this.max);if(this._ki!==0){this._integral+=i*r;const c=this._ki*this._integral,f=this.min-s-this._kp*i,u=this.max-s-this._kp*i;c<f?this._integral=Qo(f,this._ki):c>u&&(this._integral=Qo(u,this._ki))}return this._output=l,this._error=i,this._saturated=l===this.min||l===this.max,l}get output(){return this._output}get error(){return this._error}get integral(){return this._integral}get derivative(){return this._derivative}get saturated(){return this._saturated}reset(){this._integral=0,this._previousMeasured=null,this._derivative=0,this._output=0,this._error=0,this._saturated=!1}dispose(){this.reset()}[Symbol.dispose](){this.dispose()}};function Qo(e,t){const n=e/t;return Number.isFinite(n)?n:0}function Xo(e,t){if(typeof e!="number"||Number.isNaN(e))throw new TypeError(`PowerServo: ${t} must be a number, got ${e}`);return e}function kn(e,t){return typeof e=="number"&&Number.isFinite(e)?e:t}function af(e,t,n){return Math.max(t,Math.min(n,e))}function Ko(e,t,n,r){if(e==null)return t;const i=typeof e=="number"?e:Number(e);return Number.isNaN(i)?t:i===1/0||i===-1/0?i:Math.max(n,Math.min(r,i))}function sf(e,t,n){return e<t?t:e>n?n:e}var zn=Object.freeze({JSON:0,RAW:2});var Gs=new Set(["framed","legacy","negotiated"]);for(const e of["add","delete","clear"])Object.defineProperty(Gs,e,{value:()=>{throw new TypeError(`MESSAGE_CODECS is read-only: \`${e}()\` would let a consumer widen the set of codecs a pool accepts, and PowerPool validates against it.`)},enumerable:!1,writable:!1,configurable:!1});var of=new Map([[zn.JSON,"json"],[zn.RAW,"raw"]]),lf=new Map([["json",zn.JSON],["raw",zn.RAW]]);function Zs(){return typeof structuredClone=="function"}function wi(e){return xr(e)||typeof ArrayBuffer<"u"&&ArrayBuffer.isView(e)}function pc(e){return wi(e)?"raw":"json"}function mc(e,t={}){const n=t.codec||pc(e),r=lf.get(n);if(r===void 0)throw new TypeError(`PowerMessageCodec: unknown codec "${n}". Expected "json" or "raw". For structured-clone speed on a MessagePort/Worker use encodeNativeEnvelope() instead.`);let i;if(r===zn.RAW){if(!wi(e))throw new TypeError('PowerMessageCodec: the "raw" codec requires an ArrayBuffer or a typed array');i=xr(e)?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)}else i=pr(e);return gs(r,i)}function gs(e,t){const n=new Uint8Array(6+t.length);return n[0]=1,n[1]=e,n[2]=t.length&255,n[3]=t.length>>>8&255,n[4]=t.length>>>16&255,n[5]=t.length>>>24&255,n.set(t,6),n}function gc(e){if(typeof e=="string")return gs(zn.JSON,pr(null,e));if(!wi(e))throw new TypeError("PowerMessageCodec: frameEncodedJson() requires a Uint8Array or a JSON string");return gs(zn.JSON,Ca(e))}function ys(e,t=0){return(e[t+2]|e[t+3]<<8|e[t+4]<<16|e[t+5]<<24)>>>0}function Ta(e,t={}){const n=t.strict!==!1,r=Ca(e);if(r.length<6)throw new RangeError(`PowerMessageCodec: frame is ${r.length} bytes, shorter than the 6-byte header`);const i=r[0];if(n&&i!==1)throw new RangeError(`PowerMessageCodec: unsupported protocol version ${i} (expected 1)`);const a=of.get(r[1]);if(a===void 0)throw new RangeError(`PowerMessageCodec: unknown codec id ${r[1]}`);const o=ys(r);if(r.length<6+o)throw new RangeError(`PowerMessageCodec: frame declares a ${o}-byte payload but only ${r.length-6} bytes are present (truncated frame)`);const s=6,l=s+o;return{version:i,codec:a,value:a==="raw"?t.rawAsBytes===!0?r.subarray(s,l):r.slice(s,l):Vs(r.subarray(s,l)),byteLength:l}}function cf(e){if(e?.maxFrameBytes===void 0)throw new TypeError("PowerMessageCodec: createFrameDecoder() requires `maxFrameBytes`. A frame declares its own payload length, so a peer that sends a header and then stops would pin this buffer at whatever size it named. Pass `Infinity` to accept that risk explicitly.");const t=je(e.maxFrameBytes,{name:"maxFrameBytes",className:"PowerMessageCodec.createFrameDecoder",min:6,integer:!0,allowInfinity:!0}),n=e.strict!==!1,r=e.rawAsBytes===!0,i=1024;let a=new Uint8Array(i),o=0,s=0;function l(c){if(s+c<=a.length)return;const f=s-o;if(f+c<=a.length)a.copyWithin(0,o,s);else{let u=a.length||i;for(;u<f+c;)u*=2;const h=new Uint8Array(u);h.set(a.subarray(o,s)),a=h}o=0,s=f}return{push(c){const f=Ca(c);l(f.length),a.set(f,s),s+=f.length;const u=[];for(;s-o>=6;){const h=ys(a,o);if(6+h>t)throw new RangeError(`PowerMessageCodec: frame declares ${6+h} bytes, over the maxFrameBytes limit of ${t}`);if(s-o<6+h)break;const p=Ta(a.subarray(o,s),{strict:n,rawAsBytes:r});u.push(p),o+=p.byteLength}return o===s&&(o=0,s=0),u},flush(c={}){const f=s-o;if(f>0&&c.strict===!0){const u=f<6?null:ys(a,o),h=u===null?6:6+u;throw new RangeError(`PowerMessageCodec: stream ended mid-frame — ${f} of ${h} bytes buffered`+(u===null?", not even a whole header":""))}return a.slice(o,s)},get pendingBytes(){return s-o},reset(){o=0,s=0},dispose(){this.reset(),a=new Uint8Array(0)},[Symbol.dispose](){this.dispose()}}}function yc(e){if(!Zs())throw new TypeError("PowerMessageCodec: structuredClone is unavailable in this runtime. Use encodeMessage() for a portable JSON frame instead.");const t=structuredClone(e);return{message:t,transfer:Qs(t)}}function hf(e){if(typeof SharedArrayBuffer<"u"&&e.buffer instanceof SharedArrayBuffer)return[];if(e.byteOffset!==0||e.byteLength!==e.buffer.byteLength)throw new RangeError(`PowerMessageCodec: refusing to build a transfer list for a ${e.byteLength}-byte view at offset ${e.byteOffset} of a ${e.buffer.byteLength}-byte buffer — transferring \`frame.buffer\` would detach the whole buffer, including bytes outside this frame. Copy the view, or transfer the buffer it fills.`);return[e.buffer]}var Ys="__pp";function Ma(e){return e!==null&&typeof e=="object"&&e.__pp===1&&e.kind==="envelope"&&"value"in e}function _c(e){return e!==null&&typeof e=="object"&&e.__pp===1&&e.kind==="capabilities"&&Array.isArray(e.codecs)}function wc(e,t={}){const n={[Ys]:1,kind:"envelope",value:e};return t.correlationId!=null&&(n.correlationId=String(t.correlationId)),n}function uf(e={}){const t=Array.isArray(e.codecs)&&e.codecs.length?e.codecs.filter(n=>n==="json"||n==="native"):["json","native"];return{[Ys]:1,kind:"capabilities",codecs:t.includes("json")?t:["json",...t],protocol:1}}function Qs(e,t=8){const n=[],r=new Set,i=(a,o)=>{if(!(!a||o>t)){if(a instanceof ArrayBuffer){r.has(a)||(r.add(a),n.push(a));return}if(ArrayBuffer.isView(a)){r.has(a.buffer)||(r.add(a.buffer),n.push(a.buffer));return}if(typeof a=="object")for(const s of Object.keys(a))i(a[s],o+1)}};return i(e,0),n}function ff(e){if(Ma(e))return{codec:"native",value:e.value,correlationId:e.correlationId};if(xr(e)||ArrayBuffer.isView(e)){const t=Ca(e);if(t.length>=6&&t[0]===1){const n=Ta(t);return{codec:n.codec,value:n.value,correlationId:void 0}}if(!df(t[0]))throw t[0]===1?new RangeError(`PowerMessageCodec: truncated frame — ${t.length} byte(s) is shorter than the 6-byte header`):new RangeError(`PowerMessageCodec: unsupported protocol version ${t[0]} (expected 1)`);return{codec:"legacy",value:Vs(t),correlationId:void 0}}return{codec:"raw",value:e,correlationId:void 0}}function df(e){return e===32||e===9||e===10||e===13?!0:e>=32}function Ca(e){if(e instanceof Uint8Array)return e;if(xr(e))return new Uint8Array(e);if(typeof ArrayBuffer<"u"&&ArrayBuffer.isView(e))return new Uint8Array(e.buffer,e.byteOffset,e.byteLength);throw new TypeError("PowerMessageCodec: expected a Uint8Array, ArrayBuffer or DataView")}var Vm=Object.freeze({MESSAGE_PROTOCOL_VERSION:1,CODECS:zn,MESSAGE_CODECS:Gs,HEADER_BYTES:6,encodeMessage:mc,decodeMessage:Ta,createFrameDecoder:cf,frameEncodedJson:gc,encodeNative:yc,canUseNativeClone:Zs,selectCodec:pc,isRawPayload:wi,frameTransferList:hf,NATIVE_ENVELOPE_KEY:Ys,NATIVE_PROTOCOL_VERSION:1,isNativeEnvelope:Ma,isCapabilityAnnouncement:_c,encodeNativeEnvelope:wc,announceCapabilities:uf,collectTransferables:Qs,decodeInbound:ff}),Wi=null,Jo=!1;function pf(e){if(!e||typeof e!="object"||typeof SharedArrayBuffer=="function"&&e instanceof SharedArrayBuffer)return!1;if(!Jo){Jo=!0;try{const t=globalThis.process?.getBuiltinModule?.("node:worker_threads")?.markAsUntransferable??null;Wi=typeof t=="function"?t:null}catch{Wi=null}}if(!Wi)return!1;try{return Wi(e),!0}catch{return!1}}var mf=Math.floor(Math.random()*4294967295).toString(36),gf=0;function Xa(e,t){const n=new Error(t);return n.code=e,n}function yf(e){if(!Array.isArray(e))return!0;for(let t=0;t<e.length;t++){const n=e[t];if(n instanceof ArrayBuffer){if(el(n))return!1}else if(ArrayBuffer.isView(n)){if(el(n.buffer))return!1}else if(n===null||typeof n!="object")return!1}return!0}function el(e){return e?.detached===!0}var tl=class{constructor(e,t,n){this._underlying=e,this._logger=t,this._pool=n,this.onmessage=null,this.onerror=null,this.onmessageerror=null}postMessage(e,t){let n=e,r=t;if(n instanceof Uint8Array||ArrayBuffer.isView(n)||n instanceof ArrayBuffer){if(Array.isArray(r))try{r.length?this._underlying.postMessage(n,r):this._underlying.postMessage(n);return}catch(i){throw this._logger.error(i,"Failed to postMessage to underlying worker"),i}if(!r){const i=n instanceof ArrayBuffer?n:n.buffer;i?.byteLength>0&&(r=[i])}try{r?.length?this._underlying.postMessage(n,r):this._underlying.postMessage(n)}catch(i){throw this._logger.error(i,"Failed to postMessage to underlying worker"),i}return}if(n!==null&&typeof n=="object"&&!ArrayBuffer.isView(n)&&!(n instanceof ArrayBuffer)&&!Ma(n))try{const i=this._pool._encodeForTransfer(e).slice();if(!r)r=[i.buffer];else if(Array.isArray(r))r.includes(i.buffer)||r.push(i.buffer);else{const a=Array.from(r);a.includes(i.buffer)||a.push(i.buffer),r=a}n=i}catch{r=t,n=e}try{r?.length?this._underlying.postMessage(n,r):this._underlying.postMessage(n)}catch(i){throw this._logger.error(i,"Failed to postMessage to underlying worker"),i}}addEventListener(...e){return this._underlying.addEventListener(...e)}removeEventListener(...e){return this._underlying.removeEventListener(...e)}terminate(){typeof this._underlying.terminate=="function"&&this._underlying.terminate()}},_f=class extends Error{constructor(e="PowerPool has been shut down"){super(e),this.name="PowerPoolShutdownError",this.code="ERR_POOL_TERMINATED"}},Xs=class{constructor(e,t={}){Et(t,["size","minSize","maxSize","workerOptions","maxTasksPerWorker","idleTimeout","taskQueue","queuePolicy","lazy","debugLevel","listenerMaxListeners","weakListeners","queueHighThreshold","maxQueueLength","observability","maxDrainWaiters","autoScale","awaitResponseTimeout","slowTaskThreshold","maxListeners","messageCodec","encodeCacheLimit","encodeCacheByteLimit","idempotencyTtlMs","priority","priorityAgingMs"],"PowerPool"),t===null&&(t={});const n=typeof navigator<"u"&&navigator.hardwareConcurrency||2,{size:r=Math.min(n,2),minSize:i=2,maxSize:a=Math.max(r,n),workerOptions:o={},maxTasksPerWorker:s,idleTimeout:l=Co,taskQueue:c=!0,queuePolicy:f="enqueue",lazy:u=!0,awaitResponseTimeout:h=ds,slowTaskThreshold:p=1/0,autoScale:m=!1,priorityAgingMs:y=0}=t;if(!Number.isFinite(y)||y<0)throw new RangeError("PowerPool: `priorityAgingMs` must be finite and >= 0");this._priorityAgingMs=y;const g=s===void 0&&m?1:s??1/0;if(typeof e!="function"&&typeof e!="string")throw new TypeError("PowerPool workerSource must be a function or string");this._workerSource=e,this._workerOptions=o,this._maxTasksPerWorker=g,this.minSize=je(i,{name:"minSize",className:"PowerPool",integer:!0,min:0,fallback:2}),this.maxSize=Math.max(this.minSize,je(a,{name:"maxSize",className:"PowerPool",integer:!0,min:0,fallback:this.minSize})),this.idleTimeout=je(l,{name:"idleTimeout",className:"PowerPool",min:0,allowInfinity:!0,fallback:Co}),this.taskQueueEnabled=!!c,this._queuePolicy=["enqueue","drop-oldest","drop-newest","reject"].includes(f)?f:"enqueue",this._maxQueueLength=je(t.maxQueueLength,{name:"maxQueueLength",className:"PowerPool",integer:!0,min:0,allowInfinity:!0,fallback:1/0}),this._maxDrainWaiters=je(t.maxDrainWaiters,{name:"maxDrainWaiters",className:"PowerPool",integer:!0,min:1,fallback:100}),this._drainWaiters=0,this._createdAt=rt(),this._totalWorkersCreated=0,this._totalTasksCompleted=0,this._postFailures=0,this._taskDurationsWelfordCount=0,this._taskDurationsWelfordMean=0,this._taskDurationsWelfordM2=0,this._taskDurationsMin=Number.POSITIVE_INFINITY,this._taskDurationsMax=Number.NEGATIVE_INFINITY,this._queueWaitWelfordCount=0,this._queueWaitWelfordMean=0,this._queueWaitWelfordM2=0,this._queueWaitMin=Number.POSITIVE_INFINITY,this._queueWaitMax=Number.NEGATIVE_INFINITY,this._slowTaskThreshold=Number.isFinite(p)?Number(p):1/0,this._slowTaskCount=0,this._ewmaLatency=null,this._autoScale=null,this._autoScaleInterval=null,this._lastAutoScaleAt=0,this._lastAutoScaleReason=null,this._lastAutoScaleOutcome=null,this._terminatedWorkerTaskCountsTotal=0,this._terminatedWorkerTaskCountsCount=0,this.workers=[],this.queue=new Xi;const d={maxListeners:t?.listenerMaxListeners??t?.maxListeners,weak:!!t?.weakListeners};this._bus=new nf(d),this._queueHighThreshold=Number.isFinite(Number(t?.queueHighThreshold))?Math.max(0,Math.floor(Number(t?.queueHighThreshold))):1/0,this._queueHighCrossed=!1,this._onmessage=null,this._onerror=null,this._onidle=null,this._onresize=null,this._nextIndex=0,this._nextWorkerId=0,this._activeTasks=0,this._isIdle=!0,this._queuePaused=!1,this._messageCodec=Gs.has(t.messageCodec)?t.messageCodec:"framed",this._nativeCloneAvailable=Zs(),this._terminated=!1;const _=typeof t?.debugLevel=="number"?t.debugLevel:1;if(this._logger=new ec(_,{name:"powerPool"}),arguments.length>1&&arguments[1]!=null&&typeof arguments[1]!="object")throw new TypeError("PowerPool options must be an object");this._pendingResponses=new Map,this._underlyingToWorkerObj=new Map,this._defaultAwaitResponseTimeout=Number.isFinite(Number(h))?Math.max(0,Math.floor(Number(h))):ds;const w=u?Math.min(this.minSize,this.maxSize):Math.min(Math.max(r,this.minSize),this.maxSize);for(let v=0;v<w;v++)try{this._addWorkerInstance()}catch(I){if((typeof I?.message=="string"?I.message:"").includes("Invalid workerSource"))throw I;try{this._logger.error(I,"Initial worker creation failed")}catch(N){this._debugLog?.(N,"Initial worker creation: logger error")}try{this._bus.emit("pool:error",{phase:"init",error:I})}catch(N){this._debugLog?.(N,"Initial worker creation: bus.emit failed")}break}this._reaperInterval=ja(()=>this._reapIdleWorkers(),Math.max(Mo,Math.floor(this.idleTimeout/2))),this._encodeCache=new Map,this._encodeCacheLimit=Math.max(16,t?.encodeCacheLimit?t.encodeCacheLimit:64),this._encodeCacheByteLimit=Number.isFinite(Number(t?.encodeCacheByteLimit))?Math.max(0,Number(t?.encodeCacheByteLimit)):1/0,this._encodeCacheBytes=0;const k=Number(t?.idempotencyTtlMs);if(this._idempotencyTtlMs=Number.isFinite(k)&&k>0?k:0,this._idempotency=this._idempotencyTtlMs>0?new Map:null,this._idempotencyLookups=0,this._idempotencyDuplicatesInFlight=0,this._idempotencyDuplicatesSettled=0,this._idempotencyExpired=0,this._idempotencySize=0,t?.autoScale){const v=typeof t.autoScale=="object"?t.autoScale:{},I=Number.isFinite(Number(v.intervalMs))?Math.max(100,Math.floor(v.intervalMs)):su,N=Number.isFinite(Number(v.targetMs))?Math.max(1,Number(v.targetMs)):50,z=Number.isFinite(Number(v.alpha))?Math.max(0,Math.min(1,Number(v.alpha))):.2,W=Number.isFinite(Number(v.cooldownMs))?Math.max(0,Math.floor(v.cooldownMs)):ou,q=Number.isFinite(Number(v.hysteresis))?Math.max(0,Math.min(1,Number(v.hysteresis))):.2,ae=Number.isFinite(Number(v.stepUp))?Math.max(1,Math.floor(Number(v.stepUp))):1,G=Number.isFinite(Number(v.stepDown))?Math.max(1,Math.floor(Number(v.stepDown))):1,ke=Number.isFinite(Number(v.backoffFactor))?Math.max(1,Number(v.backoffFactor)):1,Y=Number.isFinite(Number(v.backoffMaxMultiplier))?Math.max(1,Number(v.backoffMaxMultiplier)):8,B=Number.isFinite(Number(v.backoffResetMs))?Math.max(0,Math.floor(Number(v.backoffResetMs))):W*4,E=["ewma","aimd","vegas","gradient2"].includes(v.policy)?v.policy:"ewma",A=Number.isFinite(Number(v.limitMin))?Math.max(1,Math.floor(Number(v.limitMin))):1,C=Number.isFinite(Number(v.limitMax))?Math.max(A,Math.floor(Number(v.limitMax))):Math.max(this.maxSize,A),M=Number.isFinite(Number(v.longWindowAlpha))?Math.max(.001,Math.min(1,Number(v.longWindowAlpha))):lu,se=Number.isFinite(Number(v.aimdBeta))?Math.max(.1,Math.min(.99,Number(v.aimdBeta))):cu;this._autoScale={enabled:!0,intervalMs:I,targetMs:N,alpha:z,cooldownMs:W,hysteresis:q,stepUp:ae,stepDown:G,backoffFactor:ke,backoffMaxMultiplier:Y,backoffResetMs:B,policy:E,limitMin:A,limitMax:C,longWindowAlpha:M,aimdBeta:se},this._autoScaleBackoffMultiplier=1,this._adaptiveLimit=Math.max(A,Math.min(C,this.minSize||A)),this._longEwmaLatency=null,this._minLatencyWindow=Number.POSITIVE_INFINITY,this._lastAdaptiveLimit=this._adaptiveLimit,this._congestion=!1;try{this._autoScaleInterval=ja(()=>this._autoScaleTick(),I)}catch(K){this._debugLog?.(K,"autoScale: interval setup failed")}}this._metrics=Ds(this,"pool",t)}_debugLog(e,t){try{typeof this._logger?.debug=="function"&&(e?this._logger.debug(e,t||"swallowed error"):this._logger.debug(t||"swallowed error"))}catch(n){try{typeof console<"u"&&typeof console.debug=="function"&&console.debug(n,t||"swallowed error")}catch{}}}_ensureReaper(){try{this._reaperInterval||(this._reaperInterval=ja(()=>this._reapIdleWorkers(),Math.max(Mo,Math.floor(this.idleTimeout/2))))}catch(e){this._debugLog?.(e,"_ensureReaper: setInterval failed")}}_createPendingResponsePromise(e,t){const n=e!=null?String(e):e;let r=null;return{pendingPromise:new Promise((i,a)=>{this._pendingResponses.get(n)&&(this._debugLog?.(null,"createPendingResponsePromise: duplicate correlationId, rejecting previous waiter"),this._cleanupPendingResponse(n,{rejectWith:(()=>{const s=new Error(`duplicate correlationId: ${n}`);return s.code="ERR_POOL_DUPLICATE_CORRELATION_ID",s})()})),r={resolve:i,reject:a,timer:null};const o=Number.isFinite(Number(t?.timeout))?Math.max(0,Math.floor(Number(t?.timeout))):Number.isFinite(Number(this._defaultAwaitResponseTimeout))?this._defaultAwaitResponseTimeout:void 0;Number.isFinite(o)&&o>0&&(r.timer=setTimeout(()=>{try{this._cleanupPendingResponse(n,{rejectWith:new Error("postMessage response timeout")})}catch{try{a(new Error("postMessage response timeout"))}catch(l){this._debugLog?.(l,"createPendingResponsePromise: reject fallback failed")}}},o)),this._pendingResponses.set(n,r)}),correlationKey:n}}_encodeForWorker(e,t){if(!t||t.deferred!==!0)return t;if(this._messageCodec==="negotiated"&&e?.protocol?.native){const n=this._encodeNativeForWorker(t);if(n)return n}return this._frameObjectForTransfer(t.message,t.transfer,{cache:t.correlationId==null})}_encodeNativeForWorker(e){if(!this._nativeCloneAvailable)return null;const t=e.message;let n=t,r;if(Qs(t).length>0){const i=yc(t);n=i.message,r=i.transfer}try{return{message:wc(n),transfer:r}}catch(i){return this._debugLog?.(i,"_encodeNativeForWorker: not cloneable, framing instead"),null}}_applyCapabilities(e,t){const n=Array.isArray(t?.codecs)?t.codecs:[],r=["json"];this._nativeCloneAvailable&&n.includes("native")&&r.push("native");const i=r.includes("native"),a=e?.protocol?{...e.protocol}:null;if(!(a&&a.native===i&&a.announced)){e&&(e.protocol={codecs:r,native:i,announced:!0});try{this._bus.emit("pool:protocol",{workerId:e?.id,codecs:r,previous:a?.codecs??["json"]})}catch(o){this._debugLog?.(o,"_applyCapabilities: bus.emit failed")}}}_postToWorkerObj(e,t,n,r,i,a){t=this._encodeForWorker(e,t);const o=e?.worker instanceof tl?e.worker._underlying:null;if(t!=null&&t.message!=null&&typeof t.message=="object"&&!ArrayBuffer.isView(t.message)&&!(t.message instanceof ArrayBuffer)&&Array.isArray(t.transfer)&&t.transfer.length>0&&typeof o?.postMessage=="function"&&yf(t.transfer))try{return o.postMessage(t.message,t.transfer),typeof e._startTimes?.push=="function"&&e._startTimes.push(n),this._markPendingWorker(i,e.id),e.tasks++,this._activeTasks++,e.lastActive=n,this._isIdle&&this._updateIdleState(),r?a:!0}catch(s){return this._failPost(s,r,i,a,{scope:"postToWorkerObj: direct postMessage failed"})}try{return this._dispatchToWorker(e,t,{correlationId:i,startTime:n}),this._isIdle&&this._updateIdleState(),r?a:!0}catch(s){return this._failPost(s,r,i,a,{scope:"postToWorkerObj: wrapper postMessage failed"})}}_dispatchToWorker(e,t,n={}){const{correlationId:r,startTime:i=rt()}=n,a=t.deferred?{...this._frameObjectForTransfer(t.message,t.transfer,{cache:t.correlationId==null})}:t,{worker:o}=e;return a.transfer?.length?o.postMessage(a.message,a.transfer):o.postMessage(a.message),typeof e._startTimes?.push=="function"&&e._startTimes.push(i),this._markPendingWorker(r,e.id),e.tasks+=1,this._activeTasks+=1,e.lastActive=i,i}_recordQueueWait(e){if(!Number.isFinite(e))return;const t=this._queueWaitWelfordCount+1,n=e-this._queueWaitWelfordMean;this._queueWaitWelfordMean+=n/t,this._queueWaitWelfordM2+=n*(e-this._queueWaitWelfordMean),this._queueWaitWelfordCount=t,this._queueWaitMin=Math.min(this._queueWaitMin,e),this._queueWaitMax=Math.max(this._queueWaitMax,e)}_reportPostFailure(e,t){this._postFailures+=1;try{this._logger.error(e,`${t}: failed to post`)}catch(n){this._debugLog?.(n,`${t}: logger.error failed`)}try{this._bus.emit("pool:error",{phase:"postMessageBatch",error:e,scope:t})}catch(n){this._debugLog?.(n,`${t}: bus.emit failed`)}return!1}_failPost(e,t,n,r,i){if(t&&n){try{this._cleanupPendingResponse(n,{rejectWith:e})}catch(a){this._debugLog?.(a,`${i?.scope??"failPost"}: cleanupPendingResponse failed`)}try{this._logger.error(e,"Failed to postMessage to worker")}catch(a){this._debugLog?.(a,`${i?.scope??"failPost"}: logger.error failed`)}return r}try{this._logger.error(e,"Failed to postMessage to worker")}catch(a){this._debugLog?.(a,`${i?.scope??"failPost"}: logger.error failed`)}return!1}_tryGrowPool(e,t,n,r,i,a,o){let s;try{s=this._addWorkerInstance()}catch(c){try{this._logger.error(c,"Failed to grow pool")}catch(f){this._debugLog?.(f,"tryGrowPool: logger.error failed")}try{this._bus.emit("pool:error",{phase:"grow",error:c})}catch(f){this._debugLog?.(f,"tryGrowPool: bus.emit failed")}if(i&&a){try{this._cleanupPendingResponse(a,{rejectWith:c})}catch(f){this._debugLog?.(f,"tryGrowPool: cleanupPendingResponse failed")}return o}return!1}if(!s){if(i&&a){try{this._cleanupPendingResponse(a,{rejectWith:new Error("failed to add worker")})}catch(c){this._debugLog?.(c,"tryGrowPool: cleanupPendingResponse failed")}return o}return!1}const l=this._prepareForTransfer(e,t,n);return this._postToWorkerObj(s,l,r,i,a,o)}_resolveBatchCorrelationIds(e,t){const n=new Array(e.length),r=new Set;for(let i=0;i<e.length;i++){const a=String(t(i,e[i]||{}));if(r.has(a)||this._pendingResponses.has(a)){const o=new Error(`postMessageBatch correlationIdFactory produced a duplicate correlationId: "${a}" (item ${i})`);throw o.code="ERR_POOL_DUPLICATE_CORRELATION_ID",o}r.add(a),n[i]=a}return n}_reserveQueueSlots(e){const t=this._maxQueueLength;if(!Number.isFinite(t))return e;let n=t-this.queue.length;if(n>=e)return e;if(this._queuePolicy==="drop-oldest"){let r=e-n;for(;r>0&&this.queue.length>0;){r--;const i=this.queue.shift();i?.correlationId!=null&&this._cleanupPendingResponse(i.correlationId,{rejectWith:new Error("postMessage queued task dropped by policy")})}n=t-this.queue.length}return n>0?n:0}_enqueueOrReject(e,t,n,r,i){const a=this._queuePolicy;if(a==="reject")return t&&n?(this._cleanupPendingResponse(n,{rejectWith:new Error("postMessage rejected by queue policy")}),r):!1;if(a==="drop-newest"&&this.queue.length>0)return t&&n?(this._cleanupPendingResponse(n,{rejectWith:new Error("postMessage rejected by queue policy")}),r):!1;if(a==="drop-oldest"&&this.queue.length>0){const s=this.queue.shift();s?.correlationId!=null&&this._cleanupPendingResponse(s.correlationId,{rejectWith:new Error("postMessage queued task dropped by policy")})}else if(this._reserveQueueSlots(1)===0)return t&&n?(this._cleanupPendingResponse(n,{rejectWith:(()=>{const s=new Error(`postMessage rejected: task queue is full (maxQueueLength ${this._maxQueueLength})`);return s.code="ERR_POOL_QUEUE_FULL",s})()}),r):!1;const o={message:e.message,transfer:e.transfer,enqueuedAt:rt()};i?.deadlineAt!==void 0&&(o.deadlineAt=i.deadlineAt),e.deferred===!0&&(o.deferred=!0),t&&n&&(o.correlationId=n),i?.priority!=null&&(o.priority=i.priority),this.queue.push(o);try{Number.isFinite(this._queueHighThreshold)&&this.queue.length>this._queueHighThreshold&&!this._queueHighCrossed&&(this._queueHighCrossed=!0,this._bus.emit("pool:queue:high",{length:this.queue.length,threshold:this._queueHighThreshold}))}catch(s){this._debugLog?.(s,"enqueueOrReject: bus.emit failed")}return this._updateIdleState(),t?r:!0}_terminateWorker(e,t="unknown"){if(!e)return null;const n=e.id??null;e.tasks>0&&this._decrementActiveTasks(e.tasks),e.tasks=0,this._rejectPendingForWorker(n,t),e.tasksSettled=!0;try{e._agnostic?.dispose()}catch(r){this._debugLog?.(r,`_terminateWorker(${t}): worker dispose failed`)}try{e.worker?.terminate()}catch(r){this._debugLog?.(r,`_terminateWorker(${t}): worker.terminate failed`)}return this._deleteWorkerUnderlyingMapping(e),this._terminatedWorkerTaskCountsTotal+=e.completedTasks||0,this._terminatedWorkerTaskCountsCount+=1,n}_rejectPendingForWorker(e,t="unknown"){if(e==null||!this._pendingResponses?.size)return 0;const n=[];try{for(const[r,i]of this._pendingResponses)i?.workerId===e&&n.push(r)}catch(r){return this._debugLog?.(r,"_rejectPendingForWorker: scan failed"),0}for(const r of n)try{this._cleanupPendingResponse(r,{rejectWith:Xa("ERR_POOL_WORKER_TERMINATED",`postMessage failed: worker ${e} was terminated (${t}) before responding`)})}catch(i){this._debugLog?.(i,"_rejectPendingForWorker: cleanup failed")}return n.length}_markPendingWorker(e,t){if(!(e==null||t==null))try{const n=this._pendingResponses.get(String(e));n&&(n.workerId=t)}catch(n){this._debugLog?.(n,"_markPendingWorker: failed")}}_assertNotTerminated(){if(!this._terminated)return;const e=new Error("PowerPool has been shut down");throw e.code="ERR_POOL_TERMINATED",e}_clearLifecycleIntervals(){try{this._reaperInterval&&(clearInterval(this._reaperInterval),this._reaperInterval=null)}catch(e){this._debugLog?.(e,"clearLifecycleIntervals: clearInterval(reaper) failed")}try{this._autoScaleInterval&&(clearInterval(this._autoScaleInterval),this._autoScaleInterval=null)}catch(e){this._debugLog?.(e,"clearLifecycleIntervals: clearInterval(autoScale) failed")}}shutdown(){if(this._terminated)return;this._terminated=!0,this._clearLifecycleIntervals();try{for(const[t]of this._pendingResponses)try{this._cleanupPendingResponse(t,{rejectWith:new _f("pool:shutdown")})}catch(n){this._debugLog?.(n,"shutdown: cleanup pending response")}try{typeof this._pendingResponses?.clear=="function"&&this._pendingResponses.clear()}catch(t){this._debugLog?.(t,"shutdown: pendingResponses.clear failed")}}catch(t){this._debugLog?.(t,"shutdown: iterate pending responses")}const e=[];try{for(const t of this.workers){const n=this._terminateWorker(t,"shutdown");n!=null&&e.push(n)}}catch(t){this._debugLog?.(t,"shutdown: terminate workers loop")}try{this._underlyingToWorkerObj&&this._underlyingToWorkerObj.clear()}catch(t){this._debugLog?.(t,"shutdown: underlyingToWorkerObj.clear failed")}e.length&&this._bus.emit("pool:scale",{action:"remove",reason:"shutdown",terminated:e,count:e.length}),this.workers=[],this.queue=new Xi,this._queueHighCrossed=!1,this._activeTasks=0,this._updateIdleState()}_encodeForTransfer(e,{cache:t=!0}={}){try{if(!t)return pr(e);const n=JSON.stringify(e);if(typeof n=="string"&&n.length>2048)return pr(e);const r=this._encodeCache.get(n);if(r){try{this._encodeCache.delete(n),this._encodeCache.set(n,r)}catch{}return r}const i=pr(e,n),a=i?.byteLength||0,o=()=>this._encodeCache.size>=this._encodeCacheLimit||this._encodeCacheByteLimit!==1/0&&this._encodeCacheBytes+a>this._encodeCacheByteLimit;for(;o();){const s=[],l=this._encodeCache.keys(),c=10;for(;o()&&s.length<c;){const f=l.next();if(f.done)break;s.push(f.value)}if(!s.length)break;for(const f of s){try{const u=this._encodeCache.get(f),h=typeof u?.byteLength=="number"?u.byteLength:0;this._encodeCacheBytes=Math.max(0,this._encodeCacheBytes-h)}catch{}this._encodeCache.delete(f)}}return this._encodeCache.set(n,i),i?.byteLength&&(this._encodeCacheBytes+=i.byteLength),pf(i?.buffer),i}catch{return pr(e)}}prepareBuffers(e,t={}){if(!Array.isArray(e))throw new Error("prepareBuffers expects an array");const{clone:n=!1,zeroCopy:r=!1}=t,i=new Array(e.length);for(let a=0;a<e.length;a++){const o=e[a]&&typeof e[a]=="object"&&"message"in e[a]?e[a]:{message:e[a]},s=o.message,l=o.transfer;if(l){i[a]={message:s,transfer:l};continue}if(s!==null&&typeof s=="object"&&!ArrayBuffer.isView(s)&&!(s instanceof ArrayBuffer)){if(r){i[a]={message:s,transfer:void 0};continue}if(n||this._messageCodec==="legacy")try{const c=this._encodeForTransfer(s),f=n?c.slice():c;i[a]={message:f,transfer:n?[f.buffer]:void 0,deferred:this._messageCodec!=="legacy"},this._messageCodec!=="legacy"&&(i[a]={...this._frameObjectForTransfer(s,l),deferred:!1});continue}catch{i[a]={message:s,transfer:void 0};continue}i[a]={message:s,transfer:l,deferred:!0};continue}if(s instanceof ArrayBuffer||ArrayBuffer.isView(s)){const c=s instanceof ArrayBuffer?s:s.buffer;i[a]={message:s,transfer:[c]};continue}i[a]={message:s,transfer:void 0}}return i}_prepareForTransfer(e,t,n){const r=!!n?.zeroCopy;if(e instanceof Uint8Array||ArrayBuffer.isView(e)||e instanceof ArrayBuffer){const i=e instanceof ArrayBuffer?e:e.buffer;if(!t){if(this._messageCodec==="framed"&&wi(e))try{const s=mc(e,{codec:"raw"});return{message:s,transfer:[s.buffer]}}catch(s){this._debugLog?.(s,"_prepareForTransfer: framing binary failed")}if(i?.byteLength===0)try{const s=e instanceof ArrayBuffer?e.slice(0):new Uint8Array(e);return{message:s,transfer:[s.buffer]}}catch{return{message:e,transfer:void 0}}return{message:e,transfer:[i]}}if(Array.isArray(t))return{message:e,transfer:t};if(t.length===0)return{message:e,transfer:[i]};const a=[];let o=!1;for(const s of t)a.push(s),s===i&&(o=!0);return o||a.push(i),{message:e,transfer:a}}if(e!==null&&typeof e=="object"&&!ArrayBuffer.isView(e)&&!(e instanceof ArrayBuffer)){if(r)return{message:e,transfer:t};if(this._messageCodec==="negotiated")return{message:e,transfer:t,deferred:!0};const i=!!(n?.awaitResponse||n?.correlationId!=null);return this._frameObjectForTransfer(e,t,{cache:!i})}return{message:e,transfer:t}}_frameObjectForTransfer(e,t,n){try{const r=this._encodeForTransfer(e,{cache:n?.cache}),i=(this._messageCodec==="legacy"?r:gc(r)).slice();let a=t;if(!a||Array.isArray(a)&&a.length===0)a=[i.buffer];else if(Array.isArray(a)){let o=!1;for(const s of a)if(s===i.buffer){o=!0;break}o||(a=[...a,i.buffer])}else if(a.length===0)a=[i.buffer];else{const o=[];let s=!1;for(const l of a)o.push(l),l===i.buffer&&(s=!0);s||o.push(i.buffer),a=o}return{message:i,transfer:a}}catch(r){return this._debugLog?.(r,"_prepareForTransfer: could not frame, posting raw"),this._messageCodec!=="legacy"&&this._logger?.warn?.(`PowerPool: message could not be framed and was posted unframed (messageCodec is "${this._messageCodec}"). A worker using decodeMessage() will reject it. Cause: `+(gi(r)?r.message:String(r))),{message:e,transfer:t}}}_decrementActiveTasks(e=1){try{const t=Number.isFinite(Number(e))?Math.max(0,Math.floor(Number(e))):1;this._activeTasks=Math.max(0,this._activeTasks-t)}catch{this._activeTasks=0}}resize(e){let t=this.minSize,n=this.maxSize;if(e!=null&&typeof e=="object")Number.isFinite(e.minSize)&&(t=Math.max(0,Math.floor(e.minSize))),Number.isFinite(e.maxSize)&&(n=Math.max(t,Math.floor(e.maxSize)));else{const a=Number(e);if(!Number.isFinite(a))return;n=Math.max(t,Math.floor(a))}this.minSize=Math.max(0,t),this.maxSize=Math.max(this.minSize,n);let r=0;for(;this.workers.length<this.minSize&&this.workers.length<this.maxSize;)try{const a=this.workers.length;if(this._addWorkerInstance(),this.workers.length===a)break;r++}catch(a){try{this._logger.error(a,"resize: add worker failed")}catch(o){this._debugLog?.(o,"resize: logger.error failed")}try{this._bus.emit("pool:error",{phase:"resize",error:a})}catch(o){this._debugLog?.(o,"resize: bus.emit failed")}break}const i=[];for(;this.workers.length>this.maxSize;){const a=this.workers.pop(),o=this._terminateWorker(a,"resize");o!=null&&i.push(o)}if(i.length||r){const a={data:{type:"pool:resize",terminated:i,added:r}};if(this._onresize)try{this._onresize(a)}catch(o){this._logger.error(o,"Pool onresize handler error")}this._bus.emit("resize",a),this._bus.emit("pool:scale",{added:r,terminated:i,minSize:this.minSize,maxSize:this.maxSize})}this._updateIdleState()}_createWorkerInstance(){return new ef(this._workerSource,{...this._workerOptions,onError:(e,t)=>this._onWorkerListenerError(e,t)})}_onWorkerListenerError(e,t){this._logger.error(e,`worker ${t?.type??"event"} handler failed`),this._debugLog?.(e,`_onWorkerListenerError: worker ${t?.type??"event"}`)}_deleteWorkerUnderlyingMapping(e){try{const t=e?.worker?._underlying;t&&this._underlyingToWorkerObj&&this._underlyingToWorkerObj.delete(t)}catch(t){this._debugLog?.(t,"_deleteWorkerUnderlyingMapping failed")}}_addWorkerInstance(e){e==null&&(e=this._nextWorkerId++);const t=this._createWorkerInstance(),n=t.worker,r=new tl(n,this._logger,this),i={id:e,worker:r,_agnostic:t,tasks:0,lastActive:rt(),latencyEwma:null,_startTimes:new Xi,protocol:{codecs:["json"],native:!1,announced:!1},completedTasks:0,tasksSettled:!1};this.workers.push(i),this._totalWorkersCreated++,this._bus.emit("pool:scale",{action:"add",id:i.id,minSize:this.minSize,maxSize:this.maxSize});try{this._underlyingToWorkerObj.set(n,i)}catch{}r.onmessage=l=>{const c=rt();if(i.tasksSettled){this._debugLog?.(new Error("late message from a settled worker"),"ignoring decrement for already-settled worker");return}i.tasks=Math.max(0,i.tasks-1),this._decrementActiveTasks(1),i.lastActive=c;try{const f=l?.data,u=f&&typeof f=="object"?f.correlationId:void 0,h=u??l?.correlationId;if(h!=null){const p=String(h),m=Object.prototype.hasOwnProperty.call(f,"response")?f.response:f;this._cleanupPendingResponse(p,{resolveWith:m})}}catch(f){this._debugLog?.(f,"worker.onmessage: resolve pending response")}try{const f=i._startTimes?.length?i._startTimes.shift():null;let u=null;try{const h=l?.data,p=typeof h?.duration=="number"?h.duration:l?.duration;if(typeof p=="number"&&Number.isFinite(p)?u=Math.max(0,Number(p)):f!=null&&(u=Math.max(0,c-f)),u!=null){const m=this._autoScale?.alpha||.2;if(this._autoScale&&this._autoScale.policy!=="ewma"){const _=this._autoScale.longWindowAlpha;this._longEwmaLatency==null?this._longEwmaLatency=u:this._longEwmaLatency=_*u+(1-_)*this._longEwmaLatency,u<this._minLatencyWindow&&(this._minLatencyWindow=u)}i.latencyEwma==null?i.latencyEwma=u:i.latencyEwma=m*u+(1-m)*i.latencyEwma,this._ewmaLatency==null?this._ewmaLatency=u:this._ewmaLatency=m*u+(1-m)*this._ewmaLatency,this._totalTasksCompleted=(this._totalTasksCompleted||0)+1,i.completedTasks=(i.completedTasks||0)+1;const y=this._taskDurationsWelfordCount;this._taskDurationsWelfordCount=y+1;const g=u-this._taskDurationsWelfordMean;this._taskDurationsWelfordMean+=g/this._taskDurationsWelfordCount;const d=u-this._taskDurationsWelfordMean;this._taskDurationsWelfordM2+=g*d,u<this._taskDurationsMin&&(this._taskDurationsMin=u),u>this._taskDurationsMax&&(this._taskDurationsMax=u),Number.isFinite(this._slowTaskThreshold)&&u>this._slowTaskThreshold&&(this._slowTaskCount=(this._slowTaskCount||0)+1)}}catch(h){this._debugLog?.(h,"worker.onmessage: latency tracking inner")}}catch(f){this._debugLog?.(f,"worker.onmessage: latency tracking outer")}if(!this._queuePaused&&this.queue.length>0&&i.tasks<this._maxTasksPerWorker){let f;for(;this.queue.length>0&&(f=this.queue.shiftHighestPriority(u=>{const h=u.priority??0;return this._priorityAgingMs>0?h+Math.max(0,c-u.enqueuedAt)/this._priorityAgingMs:h}),!(f.deadlineAt===void 0||f.deadlineAt>c));){if(f.correlationId!=null){const u=new Error("postMessage queued task deadline elapsed");u.code="EDEADLINE",this._cleanupPendingResponse(f.correlationId,{rejectWith:u})}f=null}if(f)try{this._recordQueueWait(c-f.enqueuedAt);const u=this._encodeForWorker(i,f);this._dispatchToWorker(i,u,{correlationId:f.correlationId,startTime:c})}catch(u){this._debugLog?.(u,"dispatch queued message to worker failed"),this._logger.error(u,"Failed to dispatch queued message to worker")}this._queueHighCrossed&&this.queue.length<=this._queueHighThreshold&&(this._queueHighCrossed=!1)}if(this._onmessage)try{this._onmessage(l)}catch(f){this._logger.error(f,"Pool onmessage handler error")}this._bus.emit("message",l),this._updateIdleState()};const a=l=>{const c=l?.data;let f=c,u=null;if(_c(c)){this._applyCapabilities(i,c);return}if(Ma(c)&&(f=c.value,u=c),c&&(c instanceof ArrayBuffer||ArrayBuffer.isView(c)))try{this._messageCodec!=="legacy"?f=Ta(c).value:f=Vs(c)}catch(p){try{s(p)}catch(m){this._debugLog?.(m,"_handleMessage: _handleMessageError failed")}f=c}const h=f===c?l:{data:f,originalEvent:l&&"originalEvent"in l?l.originalEvent:l};if(u&&(u.correlationId!=null&&(h.correlationId=u.correlationId),typeof u.duration=="number"&&(h.duration=u.duration)),typeof r.onmessage=="function")try{r.onmessage(h)}catch(p){this._logger.error(p,"worker wrapper onmessage error")}},o=l=>{if(typeof r.onerror=="function")try{r.onerror(l)}catch(c){this._logger.error(c,"worker wrapper onerror error")}if(typeof this._onerror=="function")try{this._onerror(l)}catch(c){this._logger.error(c,"pool onerror handler error")}this._bus.emit("error",l)},s=l=>{if(typeof r.onmessageerror=="function")try{r.onmessageerror(l)}catch(c){this._logger.error(c,"worker wrapper onmessageerror error")}this._bus.emit("messageerror",l)};return t.on("message",a),t.on("error",o),t.on("messageerror",s),i}_findLeastLoadedWorker(){if(!this.workers.length)return null;let e=null,t=1/0,n=Number.POSITIVE_INFINITY;for(let r=0;r<this.workers.length;r++){const i=this.workers[r],a=i.latencyEwma!=null?i.latencyEwma:Number.POSITIVE_INFINITY;(i.tasks<t||i.tasks===t&&a<n)&&(e=i,t=i.tasks,n=a)}return e}_idempotencyBegin(e,t){this._idempotencyLookups+=1;const n=this._idempotency;if(e==null||!n)return!0;const r=String(e);this._idempotencySweep(t);const i=n.get(r);return i!==void 0?(i.settledAt===null?this._idempotencyDuplicatesInFlight+=1:this._idempotencyDuplicatesSettled+=1,!1):(n.set(r,{settledAt:null}),this._idempotencySize=n.size,!0)}_idempotencySettle(e,t){if(e==null)return;const n=this._idempotency;if(!n)return;const r=String(e),i=n.get(r);i!==void 0&&(i.settledAt=t,this._idempotencySize=n.size)}_idempotencyRelease(e){if(e==null)return;const t=this._idempotency;t&&(t.delete(String(e)),this._idempotencySize=t.size)}_idempotencySweep(e){const t=this._idempotency;if(!t||t.size===0)return;const n=this._idempotencyTtlMs;let r=0;for(const i of[...t.keys()]){if(r>=32)break;r+=1;const a=t.get(i);if(a&&a.settledAt!==null&&e-a.settledAt>=n&&(t.delete(i),this._idempotencyExpired+=1),r>=t.size)break}this._idempotencySize=t.size}postMessage(e,t,n){if(!this._idempotency)return this._postMessageInner(e,t,n);const r=rt(),i=n?.idempotencyKey;if(!this._idempotencyBegin(i,r))return!1;let a;try{a=this._postMessageInner(e,t,n)}catch(o){throw this._idempotencyRelease(i),o}return a===!1?this._idempotencyRelease(i):this._idempotencySettle(i,r),a}request(e,t){const{transfer:n,...r}=t??{};return this.postMessage(e,n,{...r,awaitResponse:!0})}_postMessageInner(e,t,n){this._assertNotTerminated(),n=n||void 0;const r=rt();if(n?.deadlineAt!==void 0&&!Number.isFinite(n.deadlineAt))throw new TypeError("postMessage deadlineAt must be finite");const i=n?.workerId!=null?n.workerId:null,a=i==null&&this.workers.length===1&&this._maxTasksPerWorker===1/0,o=i!=null?this.workers.find(p=>p.id===i):a?this.workers[0]:this._findLeastLoadedWorker(),s=!!(n?.awaitResponse||n?.correlationId!=null);let l,c;if(s){if(l=n.correlationId!=null?String(n.correlationId):this._generateCorrelationId(),!(e!==null&&typeof e=="object"&&!ArrayBuffer.isView(e)&&!(e instanceof ArrayBuffer)))throw new Error("postMessage awaitResponse requires a plain-object message");e=Object.assign({},e,{correlationId:l});const p=this._createPendingResponsePromise(l,n);c=p.pendingPromise,l=p.correlationKey}if(n?.deadlineAt!==void 0&&n.deadlineAt<=r){const p=new Error("postMessage deadline elapsed");return p.code="EDEADLINE",s&&l?(this._cleanupPendingResponse(l,{rejectWith:p}),c):!1}const f=this._autoScale?.policy&&this._autoScale.policy!=="ewma"?Math.max(1,Math.ceil(this._adaptiveLimit)):null;if(f!==null&&this._activeTasks>=f){if(this.taskQueueEnabled){const p=this._prepareForTransfer(e,t,n);return this._enqueueOrReject(p,s,l,c,n)}return s&&l?(this._cleanupPendingResponse(l,{rejectWith:new Error("adaptive concurrency limit reached")}),c):!1}if(o?.tasks<this._maxTasksPerWorker)try{const p=r,m=this._prepareForTransfer(e,t,n);return this._postToWorkerObj(o,m,p,s,l,c)}catch(p){if(s&&l){try{this._cleanupPendingResponse(l,{rejectWith:p})}catch(m){this._debugLog?.(m,"postMessage: cleanupPendingResponse failed")}try{this._logger.error(p,"Failed to postMessage to worker")}catch(m){this._debugLog?.(m,"postMessage: logger.error failed")}return c}try{this._logger.error(p,"Failed to postMessage to worker")}catch(m){this._debugLog?.(m,"postMessage: logger.error failed")}return!1}if(i!=null&&(!o||o.tasks>=this._maxTasksPerWorker)){if(s&&l){try{this._cleanupPendingResponse(l,{rejectWith:new Error("targeted worker unavailable")})}catch(p){this._debugLog?.(p,"postMessage: cleanupPendingResponse failed")}return c}return!1}if(i==null&&this.workers.length<this.maxSize){const p=r;return this._tryGrowPool(e,t,n,p,s,l,c)}if(this.taskQueueEnabled){const p=this._prepareForTransfer(e,t,n);return this._enqueueOrReject(p,s,l,c,n)}if(!this.workers.length)return s?c:!1;const u=this._nextIndex%this.workers.length;this._nextIndex=(this._nextIndex+1)%this.workers.length;const h=this.workers[u];try{const p=r,m=this._prepareForTransfer(e,t,n);return this._postToWorkerObj(h,m,p,s,l,c)}catch(p){if(s&&l){try{this._cleanupPendingResponse(l,{rejectWith:p})}catch(m){this._debugLog?.(m,"postMessage: cleanupPendingResponse failed")}try{this._logger.error(p,"Failed to postMessage to fallback worker")}catch(m){this._debugLog?.(m,"postMessage: logger.error failed")}return c}try{this._logger.error(p,"Failed to postMessage to fallback worker")}catch(m){this._debugLog?.(m,"postMessage: logger.error failed")}return!1}}_generateCorrelationId(){return`${mf}-${(gf++).toString(36)}`}_cleanupPendingResponse(e,t={}){const n=e!=null?String(e):e,r=this._pendingResponses.get(n);if(!r)return!1;try{if(r.timer)try{clearTimeout(r.timer)}catch(i){this._debugLog?.(i,"_cleanupPendingResponse: clearTimeout failed")}}catch(i){this._debugLog?.(i,"_cleanupPendingResponse: timer check failed")}try{Object.prototype.hasOwnProperty.call(t,"resolveWith")?r.resolve(t.resolveWith):Object.prototype.hasOwnProperty.call(t,"rejectWith")&&r.reject(t.rejectWith)}catch(i){this._debugLog?.(i,"_cleanupPendingResponse: resolve/reject failed")}finally{try{this._pendingResponses.delete(n)}catch(i){this._debugLog?.(i,"_cleanupPendingResponse: delete failed")}}return!0}broadcast(e,t){const n=rt();let r=null;const i=e!==null&&typeof e=="object"&&!ArrayBuffer.isView(e)&&!(e instanceof ArrayBuffer);for(const a of this.workers)try{let o=e,s=t;if(!s&&i)try{r==null&&(r=this._encodeForTransfer(e));const l=r.slice();o=l,s=[l.buffer]}catch{o=e,s=void 0}this._dispatchToWorker(a,{message:o,transfer:s},{startTime:n})}catch(o){this._logger.error(o,"broadcast error")}this._updateIdleState()}_normalizeStopThePressOptions(e){const t=typeof e?.recreateWorkers<"u"?!!e.recreateWorkers:!0,n=typeof e=="object"?Object.assign({},e):void 0;return n&&delete n.recreateWorkers,{recreate:t,fwdOptions:n}}_resetPoolForStopThePress({recreate:e,scope:t}){try{typeof this.queue?.clear=="function"&&this.queue.clear()}catch(a){this._logger.error(a,`${t}: failed to clear queue`)}try{this._queueHighCrossed=!1}catch(a){this._debugLog?.(a,"_resetPoolForStopThePress: queueHighCrossed reset failed")}try{for(const[a]of this._pendingResponses)try{this._cleanupPendingResponse(a,{rejectWith:new Error(`${t}: cancelled pending response`)})}catch(o){this._debugLog?.(o,"_resetPoolForStopThePress: cleanupPendingResponse failed")}}catch(a){this._logger.error(a,`${t}: failed to cancel pending responses`)}let n,r;try{const a=this.workers;if(n=Number(a?.length)||0,Array.isArray(a))r=a.slice();else{r=new Array(n);for(let o=0;o<n;o++)r[o]=a[o]}}catch(a){this._logger.error(a,`${t}: failed to snapshot workers`),n=0,r=[]}const i=r.map(a=>a?.id).filter(a=>a!=null);try{for(let a=r.length-1;a>=0;a--){const o=r[a],s=this._terminateWorker(o,`${t}:reset`);s!=null&&i.push(s)}this.workers.length=0,this._activeTasks=0}catch(a){this._logger.error(a,`${t}: failed while terminating workers`)}if(e||this._clearLifecycleIntervals(),e){const a=Math.max(this.minSize,Math.min(n,this.maxSize));for(let o=0;o<a;o++)try{const s=this.workers.length;if(this._addWorkerInstance(),this.workers.length===s)break}catch(s){try{this._logger.error(s,"recreate: add worker failed")}catch(l){this._debugLog?.(l,"recreate: logger.error failed")}try{this._bus.emit("pool:error",{phase:"recreate",error:s})}catch(l){this._debugLog?.(l,"recreate: bus.emit failed")}break}try{this._ensureReaper()}catch(o){this._debugLog?.(o,"recreate: ensureReaper failed")}}return this._updateIdleState(),{currentCount:n,terminatedIds:i}}stopThePress(e,t,n){const{recreate:r,fwdOptions:i}=this._normalizeStopThePressOptions(n),{currentCount:a,terminatedIds:o}=this._resetPoolForStopThePress({recreate:r,scope:"stopThePress"});try{o?.length&&this._bus.emit("pool:scale",{action:"remove",terminated:o,count:a})}catch(s){this._logger.error(s,"pool scale stopThePress listener error")}if(!r)try{return this._enqueueOrReject(this._prepareForTransfer(e,t,n),!1,void 0,void 0,n)}catch(s){return this._logger.error(s,"stopThePress: enqueue after reset failed"),!1}return this.postMessage(e,t,i)}postMessageBatch(e,t){this._assertNotTerminated();const n=rt();if(!Array.isArray(e))throw new Error("postMessageBatch expects an array of {message, transfer?}");const r=!!(t?.awaitResponse||t?.correlationId!=null),i=typeof t?.correlationIdFactory=="function"?t.correlationIdFactory:null;if(r){if(t?.correlationId!=null&&e.length>1&&!i)throw new Error("postMessageBatch cannot use a fixed correlationId for multiple items; provide options.correlationIdFactory or omit correlationId");const m=i?this._resolveBatchCorrelationIds(e,i):null,y=new Array(e.length);for(let g=0;g<e.length;g++){const d=e[g]||{},_=Object.assign({},t);m&&(_.correlationId=m[g]),y[g]=this.postMessage(d.message,d.transfer,_)}return y}const a=new Array(e.length),o=[],s=t?.workerId!=null?t.workerId:null,l=this.prepareBuffers(e,{zeroCopy:!!t?.zeroCopy}),c=this._autoScale?.policy&&this._autoScale.policy!=="ewma"?Math.max(1,Math.ceil(this._adaptiveLimit)):null;let f=c===null?Number.POSITIVE_INFINITY:Math.max(0,c-this._activeTasks);if(s==null&&this.workers.length===1&&this._maxTasksPerWorker===1/0&&c===null){const m=this.workers[0];let y=!1;for(let g=0;g<e.length;g+=1){const d=l[g]||{message:e[g]?.message,transfer:e[g]?.transfer};try{this._dispatchToWorker(m,d,{startTime:n}),y=!0,a[g]=!0}catch(_){a[g]=this._reportPostFailure(_,"postMessageBatch:single-worker")}}return y&&this._updateIdleState(),a}const u=s!=null;let h;if(u){if(h=this.workers.find(m=>m.id===s),!h)return e.map(()=>!1)}else h=this._findLeastLoadedWorker();let p=!1;for(let m=0;m<e.length;m++){const y=e[m]||{},g=l[m]||{message:y.message,transfer:y.transfer};let d=!1;if(f<=0){this.taskQueueEnabled?(o.push({message:g.message,transfer:g.transfer,index:m,priority:t?.priority??0}),a[m]=!0):a[m]=!1;continue}h?.tasks>=this._maxTasksPerWorker&&(h=null);let _=h;if(!_&&!u&&(_=this._findLeastLoadedWorker()),_?.tasks<this._maxTasksPerWorker)try{this._dispatchToWorker(_,g,{startTime:n}),p=!0,a[m]=!0,d=!0,f--,h=_.tasks<this._maxTasksPerWorker?_:null}catch(w){a[m]=this._reportPostFailure(w,"postMessageBatch:dispatch"),d=!0}if(!d&&s==null&&this.workers.length<this.maxSize)try{const w=this._addWorkerInstance();w?(this._dispatchToWorker(w,g,{startTime:n}),p=!0,a[m]=!0,d=!0,f--,h=w.tasks<this._maxTasksPerWorker?w:null):(a[m]=!1,d=!0)}catch(w){a[m]=this._reportPostFailure(w,"postMessageBatch:add-worker"),d=!0}if(!d){if(s!=null){a[m]=!1;continue}if(this.taskQueueEnabled){const w=this._queuePolicy;if(w==="reject"||w==="drop-newest"&&this.queue.length>0)a[m]=!1;else{if(w==="drop-oldest"&&this.queue.length>0){const k=this.queue.shift();k?.correlationId!=null&&this._cleanupPendingResponse(k.correlationId,{rejectWith:new Error("postMessage queued task dropped by policy")})}o.push({message:g.message,transfer:g.transfer,index:m,priority:t?.priority??0}),a[m]=!0}}else if(!this.workers.length)a[m]=!1;else{const w=this._nextIndex%this.workers.length;this._nextIndex=(this._nextIndex+1)%this.workers.length;const k=this.workers[w];try{this._dispatchToWorker(k,g,{startTime:n}),p=!0,a[m]=!0,f--}catch(v){a[m]=!1,this._logger.error(v,"Failed to postMessage to fallback worker")}}}}if(o.length)try{const m=this._reserveQueueSlots(o.length);if(m<o.length){for(let y=m;y<o.length;y++)a[o[y].index]=!1;o.length=m}if(!o.length)this._logger.error?.(new Error(`postMessageBatch rejected ${e.length-m} task(s): task queue is full (maxQueueLength ${this._maxQueueLength})`),"postMessageBatch: queue full");else{const y=rt();for(const g of o)g.enqueuedAt=y;this.queue.pushMany(o),p=!0;try{Number.isFinite(this._queueHighThreshold)&&this.queue.length>this._queueHighThreshold&&!this._queueHighCrossed&&(this._queueHighCrossed=!0,this._bus.emit("pool:queue:high",{length:this.queue.length,threshold:this._queueHighThreshold}))}catch(g){this._debugLog?.(g,"postMessageBatch: bus.emit pool:queue:high failed")}}}catch(m){this._logger.error(m,"postMessageBatch: failed to enqueue prepared items")}return p&&this._updateIdleState(),a}stopThePressBatch(e,t){const{recreate:n,fwdOptions:r}=this._normalizeStopThePressOptions(t);this._resetPoolForStopThePress({recreate:n,scope:"stopThePressBatch"});try{return this.postMessageBatch(e,r)}catch(i){try{this._logger.error(i,"stopThePressBatch: postMessageBatch failed")}catch(a){this._debugLog?.(a,"stopThePressBatch: logger.error failed")}try{return new Array(e?e.length:0).fill(!1)}catch{return[]}}}addWorker(){if(this._terminated)return this._debugLog?.(null,"addWorker: pool terminated, ignoring"),null;let e;try{e=this._addWorkerInstance()}catch(t){try{this._logger.error(t,"addWorker: failed")}catch(n){this._debugLog?.(n,"addWorker: logger.error failed")}try{this._bus.emit("pool:error",{phase:"addWorker",error:t})}catch(n){this._debugLog?.(n,"addWorker: bus.emit failed")}return null}return e&&this._updateIdleState(),e}removeWorker(){const e=this.workers.pop();e&&(this._terminateWorker(e,"removeWorker"),this._updateIdleState())}_reapIdleWorkers(){if(this.idleTimeout<=0)return;const e=rt(),t=[];for(let n=this.workers.length-1;n>=0;n--){const r=this.workers[n];if(this.workers.length<=this.minSize)break;if(r.tasks===0&&e-(r.lastActive||0)>this.idleTimeout){const i=this._terminateWorker(r,"idle-reap");i!=null&&t.push(i);const a=this.workers.length-1;n===a?this.workers.pop():this.workers[n]=this.workers.pop()}}if(t.length)try{this._bus.emit("pool:scale",{action:"remove",reason:"idle-reap",terminated:t,count:t.length})}catch(n){this._debugLog?.(n,"_reapIdleWorkers: bus.emit failed")}this._updateIdleState()}_autoscaleSteps(e,t,n,r){if(!(n>1)||e==null||!(t>0))return Math.max(1,n||1);this._autoscaleServo??=new rf({setpoint:1,kp:1,ki:.25,min:-n,max:n}),this._autoscaleServo.max!==n&&(this._autoscaleServo.max=n,this._autoscaleServo.min=-n,this._autoscaleServo.reset());const i=e/t,a=Math.abs(this._autoscaleServo.step(i,r));return Number.isFinite(a)?Math.max(1,Math.min(n,Math.round(a))):1}_updateAdaptiveLimit(){const e=this._autoScale;if(!e||e.policy==="ewma")return this._adaptiveLimit;const t=e.limitMin,n=e.limitMax,r=this._ewmaLatency,i=this._longEwmaLatency,a=this.queue.length,o=this._adaptiveLimit;if(r==null)return o;let s=o;switch(e.policy){case"aimd":{const c=i!=null&&r>i*1.25;this._congestion=c,s=c?o*e.aimdBeta:o+1;break}case"vegas":{const c=this._minLatencyWindow;if(!Number.isFinite(c)||c<=0){s=o+1;break}const f=3*Math.log10(Math.max(2,o)),u=6*Math.log10(Math.max(2,o)),h=o*(1-c/Math.max(r,c));h<f?(this._congestion=!1,s=o+f):h>u?(this._congestion=!0,s=o-u):this._congestion=!1;break}case"gradient2":{if(i==null||i<=0){s=o+1;break}const c=Math.max(.5,Math.min(1,i/r));s=c*o+a,this._congestion=c<1;break}default:return o}if(!Number.isFinite(s))return o;const l=o*.8+Math.max(t,Math.min(n,s))*.2;return this._adaptiveLimit=Math.max(t,Math.min(n,l)),this._lastAdaptiveLimit=o,this._adaptiveLimit}_autoScaleTick(){try{if(this._terminated||!this._autoScale||!this._autoScale.enabled)return;const e=rt(),t=this._autoScale;this._lastAutoScaleAt&&t.backoffResetMs&&e-this._lastAutoScaleAt>t.backoffResetMs&&(this._autoScaleBackoffMultiplier=1,this._autoscaleServo=null);const n=Math.floor((t.cooldownMs||0)*(this._autoScaleBackoffMultiplier||1));if(this._lastAutoScaleAt&&e-this._lastAutoScaleAt<n)return;this._updateAdaptiveLimit();const r=t.targetMs,i=t.hysteresis||.2,a=this._ewmaLatency,o=this.workers.length,s=r*(1+i),l=a!=null?a>s:!1,c=this.queue.length>Math.ceil(o*(1+i));if(l||c){if(this._lastAutoScaleReason=l&&c?"latency+queue":l?"latency":"queue",o<this.maxSize)try{const h=t.stepUp||1,p=this._autoscaleSteps(a,r,h,t.intervalMs/1e3),m=Math.min(this.maxSize-o,p);let y=0,g=!1;for(let d=0;d<m;d++)try{const _=this.workers.length;if(this._addWorkerInstance(),this.workers.length===_)break;y++}catch(_){g=!0,this._debugLog?.(_,"autoScale: addWorker failed");try{this._bus.emit("pool:error",{phase:"autoScale:add",error:_})}catch(w){this._debugLog?.(w,"autoScale: bus.emit failed")}break}this._lastAutoScaleOutcome=y>0?"added":g?"failed":"no-op",y>0&&(this._lastAutoScaleAt=e,this._autoScaleBackoffMultiplier=Math.min((this._autoScaleBackoffMultiplier||1)*(t.backoffFactor||1),t.backoffMaxMultiplier||8))}catch(h){this._lastAutoScaleOutcome="failed",this._debugLog?.(h,"autoScale: addWorker failed outer")}else this._lastAutoScaleOutcome="blocked";return}const f=r*Math.max(0,1-i),u=a!=null?a<f:!1;if(!l&&!c&&!u&&this._autoscaleServo&&this._autoscaleServo.reset(),u&&this.queue.length===0)if(this._lastAutoScaleReason="latency",o>this.minSize)try{const h=t.stepDown||1,p=this._autoscaleSteps(a,r,h,t.intervalMs/1e3),m=Math.min(o-this.minSize,p);let y=0;for(let g=this.workers.length-1;g>=0&&y<m;g--){const d=this.workers[g];if(!d||d.tasks>0)continue;this._terminateWorker(d,"autoscale");const _=this.workers.length-1;g===_?this.workers.pop():this.workers[g]=this.workers.pop(),y++}y>0?(this._lastAutoScaleOutcome="removed",this._lastAutoScaleAt=e,this._autoScaleBackoffMultiplier=Math.min((this._autoScaleBackoffMultiplier||1)*(t.backoffFactor||1),t.backoffMaxMultiplier||8)):this._lastAutoScaleOutcome="blocked"}catch(h){this._lastAutoScaleOutcome="failed",this._debugLog?.(h,"autoScale: remove worker failed")}else this._lastAutoScaleOutcome="blocked"}catch(e){this._debugLog?.(e,"autoScaleTick outer")}}_buildIdleEvent(){const e=this;let t,n=!1,r,i=!1;return{data:{type:"pool:idle",get workers(){return i||(r=e.workers.map(a=>({id:a.id,tasks:a.tasks,lastActive:a.lastActive})),i=!0),r},get stats(){return n||(t=e.getStats(),n=!0),t}}}}_emitIdle(){const e=this._buildIdleEvent();if(this._isIdle=!0,this._onmessage)try{this._onmessage(e)}catch(t){this._logger.error(t,"Pool onmessage handler error")}if(this._onidle)try{this._onidle(e)}catch(t){this._logger.error(t,"Pool onidle handler error")}try{this._bus.emit("message",e)}catch(t){this._logger.error(t,"pool listener error")}try{this._bus.emit("idle",e)}catch(t){this._logger.error(t,"pool idle listener error")}}_updateIdleState(){const e=this.queue.length===0,t=this._activeTasks===0&&e;t&&!this._isIdle?this._emitIdle():!t&&this._isIdle&&(this._isIdle=!1)}terminate(){try{this.shutdown()}catch{}}dispose(){Us(this._metrics),this._metrics=null,this[Symbol.dispose]()}[Symbol.dispose](){this.shutdown()}async[Symbol.asyncDispose](){try{await this.drain()}catch{}this.terminate()}getStats(){const e=this.workers.map(v=>({id:v.id,tasks:v.tasks,lastActive:v.lastActive})),t=this.workers.filter(v=>v.protocol?.native).length,n={mode:this._messageCodec,nativeAvailable:this._nativeCloneAvailable,nativeWorkers:t,workers:this.workers.map(v=>({id:v.id,codecs:v.protocol?.codecs??["json"]}))},r=rt(),i=this._createdAt!=null?Math.max(0,r-this._createdAt):0,a=this._totalWorkersCreated||this.workers.length,o=this._totalTasksCompleted||0,s=this._terminatedWorkerTaskCountsCount||0,l=this._terminatedWorkerTaskCountsTotal||0;let c=0;for(const v of this.workers)c+=v.completedTasks||0;const f=s+(this.workers.length||0),u=f>0?(l+c)/f:0;let h=0,p=0,m=0,y=0,g=0;const d=this._taskDurationsWelfordCount||0;if(d>0){h=this._taskDurationsMin===Number.POSITIVE_INFINITY?0:this._taskDurationsMin,p=this._taskDurationsMax===Number.NEGATIVE_INFINITY?0:this._taskDurationsMax,m=this._taskDurationsWelfordMean;const v=d>1?this._taskDurationsWelfordM2/d:0;y=Math.sqrt(v),g=d>0?(this._slowTaskCount||0)/d*100:0}const _=this._queueWaitWelfordCount||0,w=_>1?this._queueWaitWelfordM2/_:0,k={count:_,min:_>0?this._queueWaitMin:0,max:_>0?this._queueWaitMax:0,average:_>0?this._queueWaitWelfordMean:0,stddev:Math.sqrt(w)};return{status:e,protocol:n,performance:{poolLiveDuration:i,totalWorkersCreated:a,totalTasksPerformed:o,averageTasksPerWorkerUntilTermination:u,timePerTask:{max:p,min:h,average:m,stddev:y},queueWait:k,percentSlowTasks:g,concurrencyLimit:this._autoScale&&this._autoScale.policy!=="ewma"?Math.round(this._adaptiveLimit*100)/100:null,autoScalePolicy:this._autoScale&&this._autoScaleInterval?this._autoScale.policy:null,congestion:this._autoScale?!!this._congestion:null,lastScaleReason:this._autoScale?this._lastAutoScaleReason:null,lastScaleOutcome:this._autoScale?this._lastAutoScaleOutcome:null,idleReapingActive:this._reaperInterval!==null&&this._reaperInterval!==void 0},postFailures:this._postFailures,idempotency:{enabled:this._idempotency!==null,ttlMs:this._idempotencyTtlMs,lookups:this._idempotencyLookups,duplicatesInFlight:this._idempotencyDuplicatesInFlight,duplicatesSettled:this._idempotencyDuplicatesSettled,expired:this._idempotencyExpired,size:this._idempotencySize},queueLength:this.queue.length,queueDepth:this.queue.length,queuePressure:Number.isFinite(this._maxQueueLength)?Math.min(1,this.queue.length/Math.max(1,this._maxQueueLength)):this.queue.length>0?1:0,activeTasks:this._activeTasks,workerCount:this.workers.length,minSize:this.minSize,maxSize:this.maxSize,isIdle:this._activeTasks===0&&this.queue.length===0}}drain(e={}){const t=e?.signal??null,n=Number(e?.timeout),r=Number.isFinite(n)&&n>0?Math.floor(n):0,i=this.queue.length===0;return this._activeTasks===0&&i?t?.aborted?Promise.reject(Qr(t)):Promise.resolve(this.getStats()):t?.aborted?Promise.reject(Qr(t)):this._drainWaiters>=this._maxDrainWaiters?Promise.reject(Xa("ERR_POOL_DRAIN_TOO_MANY_WAITERS",`drain(): ${this._drainWaiters} drain(s) already waiting (maxDrainWaiters ${this._maxDrainWaiters})`)):(this._drainWaiters++,new Promise((a,o)=>{let s=null,l=!1;const c=()=>{if(!l){l=!0,s&&(clearTimeout(s),s=null),this._drainWaiters--;try{this.removeEventListener("idle",f)}catch(p){this._debugLog?.(p,"drain: removeEventListener failed")}}},f=()=>{c(),a(this.getStats())},u=()=>{c(),o(Qr(t))};r&&(s=setTimeout(()=>{c(),o(Xa("ERR_POOL_DRAIN_TIMEOUT",`drain(): pool did not become idle within ${r}ms`))},r)),t&&t.addEventListener("abort",u,{once:!0}),this.addEventListener("idle",f)}))}addEventListener(e,t){if(typeof t=="function"&&(this._bus.on(e,t),e==="idle")){const n=this.queue.length===0;if(this._activeTasks===0&&n){const r=this._buildIdleEvent();try{t(r)}catch(i){this._logger.error(i,"pool idle listener error")}}}}removeEventListener(e,t){!t||typeof t!="function"||this._bus.off(e,t)}get onresize(){return this._onresize}set onresize(e){this._onresize=e}get onmessage(){return this._onmessage}set onmessage(e){this._onmessage=e}get onerror(){return this._onerror}set onerror(e){this._onerror=e}get onidle(){return this._onidle}set onidle(e){if(this._onidle=e,typeof e=="function"){const t=this.queue.length===0;if(this._activeTasks===0&&t){const n=this._buildIdleEvent();try{e(n)}catch(r){this._logger.error(r,"Pool onidle handler error")}}}}pauseQueue(){this._queuePaused=!0}resumeQueue(){this._queuePaused&&(this._queuePaused=!1,this._dispatchQueuedTasks())}pause(){return this.pauseQueue()}resume(){return this.resumeQueue()}get queuePaused(){return this._queuePaused}_dispatchQueuedTasks(){if(this._queuePaused||!this.taskQueueEnabled||this.queue.length===0)return;const e=this.queue,t=this._maxTasksPerWorker,n=this._autoScale?.policy&&this._autoScale.policy!=="ewma"?Math.max(1,Math.ceil(this._adaptiveLimit)):null;let r=n===null?Number.POSITIVE_INFINITY:Math.max(0,n-this._activeTasks);const i=rt();let a=!1;for(const o of this.workers){let s=t-o.tasks;for(;s>0&&r>0&&e.length>0;){const l=e.shift();try{const c=this._encodeForWorker(o,l);this._dispatchToWorker(o,c,{correlationId:l.correlationId,startTime:i}),s--,r--,o.lastActive=i,a=!0}catch(c){this._debugLog?.(c,"dispatch queued message to worker failed"),this._logger.error(c,"Failed to dispatch queued message to worker");break}}}this._queueHighCrossed&&this.queue.length<=this._queueHighThreshold&&(this._queueHighCrossed=!1),a&&this._updateIdleState()}},_s=new Map,nl=new Map,rl=new Map;function Ks(e="unknown",t=0){const n=String(e||"unknown");nl.set(n,(nl.get(n)||0)+1);const r=Number(t);Number.isFinite(r)&&r>0&&rl.set(n,(rl.get(n)||0)+r)}function Js(e,t){return e&&t&&_s.set(e,t),t}function eo(e,t){_s.get(e)===t&&_s.delete(e)}function il(e){!e?.onAbort||!e.signal||(e.signal.removeEventListener("abort",e.onAbort),e.onAbort=null)}var wf=class{constructor(e={}){Et(e,["capacity","queueCapacity","initialTokens","className","limitName"],"PowerPermitGate");const{capacity:t,queueCapacity:n,initialTokens:r}=e||{},i=typeof e?.className=="string"?e.className:"PowerPermitGate",a=typeof e?.limitName=="string"&&e.limitName?e.limitName:"capacity";this._className=i,this._capacity=je(t,{name:a,className:i,min:1,integer:!0,fallback:1}),this._queueCapacity=n==null?1/0:je(n,{name:"queueCapacity",className:i,min:0,integer:!0,allowInfinity:!0}),this._available=r==null?this._capacity:Math.min(this._capacity,je(r,{name:"initialTokens",className:i,min:0,integer:!0})),this._waiters=new Xi(16),this._held=0,this._cancelledWaiters=0}get capacity(){return this._capacity}get available(){return this._available}get pending(){return Math.max(0,this._waiters.length-this._cancelledWaiters)}get queueCapacity(){return this._queueCapacity}get isFull(){return this.pending>=this._queueCapacity}get active(){return this._held}acquire(e={}){let t;try{t=je(e?.weight,{name:"weight",className:this._className,min:1,integer:!0,fallback:1})}catch(r){return Promise.reject(r)}if(t>this._capacity)return Promise.reject(new TypeError(`${this._className}: \`weight\` (${t}) exceeds \`capacity\` (${this._capacity}). A waiter heavier than the pool can never be granted.`));const n=e?.signal??null;return n?.aborted?Promise.reject(Qr(n)):this._available>=t?Promise.resolve(this._grant(t)):this.isFull?Promise.reject(Ah(this._className,this._queueCapacity)):new Promise((r,i)=>{const a={resolve:r,reject:i,signal:n??null,onAbort:null,cancelled:!1,weight:t};this._waiters.push(a),n&&(a.onAbort=()=>{a.cancelled||(a.cancelled=!0,this._cancelledWaiters+=1,il(a),i(Qr(n)))},n.addEventListener("abort",a.onAbort,{once:!0}))})}tryAcquire(e=1){const t=je(e,{name:"weight",className:this._className,min:1,integer:!0,fallback:1});return this._available>=t?this._grant(t):null}release(e=1){const t=Math.max(0,Math.floor(Number(e)||1)),n=this._available,r=t-this._serveWaiters(t,!1);return r>0&&(this._available=Math.min(this._capacity,this._available+r)),this._held=Math.max(0,this._held-r),this._available-n}reset(e={}){const{available:t=this._capacity,reason:n=new Error("PowerPermitGate reset")}=e,r=Math.min(this._capacity,Math.max(0,Math.floor(Number(t)||0)));for(;this._waiters.length>0;){const i=this._waiters.shift();typeof i?.reject=="function"&&i.reject(n)}this._cancelledWaiters=0,this._available=Math.max(0,Math.min(r,this._capacity-this._held))}_makeRelease(e=1){let t=!1;return()=>{t||(t=!0,this.release(e))}}_grant(e=1){return this._available-=e,this._held+=e,this._makeRelease(e)}_grantTo(e,t){const n=e.weight??1;t&&(this._available-=n,this._held+=n),e.resolve(this._makeRelease(n))}_serveWaiters(e,t){let n=0;for(;n<e&&this._waiters.length>0;){const r=this._waiters.peek();if(r?.cancelled){this._cancelledWaiters=Math.max(0,this._cancelledWaiters-1),this._waiters.shift();continue}if(typeof r?.resolve!="function"){this._waiters.shift();continue}const i=r.weight??1;if(i>e-n)break;this._waiters.shift(),il(r),this._grantTo(r,t),n+=i}return n}dispose(){this.reset(),yi(this,"reset")}[Symbol.dispose](){this.dispose()}},bc=class{constructor(e=1,t=void 0){if(e&&typeof e=="object"&&("limit"in e||"queueCapacity"in e)){const n=e;Et(n,["limit","queueCapacity"],"PowerSemaphore"),e=n.limit,t=n.queueCapacity}this._gate=new wf({capacity:e,initialTokens:e,queueCapacity:t,className:"PowerSemaphore",limitName:"limit"})}get limit(){return this._gate.capacity}get active(){return this._gate.active}get pending(){return this._gate.pending}get available(){return this._gate.available}get isLocked(){return this._gate.available===0}get queueCapacity(){return this._gate.queueCapacity}get isFull(){return this._gate.isFull}acquire(e={}){return this._gate.acquire(e)}tryAcquire(){return this._gate.tryAcquire()}async run(e,t={}){const n=await this.acquire(t);try{return await e()}finally{n()}}reset(){this._gate.reset({available:this._gate.capacity})}dispose(){this.reset(),yi(this,"reset")}[Symbol.dispose](){this.dispose()}};function bf(){if(typeof globalThis.scheduler?.yield=="function")try{return globalThis.scheduler.yield()}catch{}return typeof requestIdleCallback=="function"?new Promise(e=>{try{requestIdleCallback(e,{timeout:50})}catch{setTimeout(e,0)}}):new Promise(e=>setTimeout(e,0))}async function An(e,t=50){try{if(!e||!t)return;e%t===0&&await bf()}catch{}}var vf=Sa({CRAWL_MAX_QUEUE:()=>Oc,HOME_SLUG:()=>an,_setAllMd:()=>Rc,_setSearchIndex:()=>Kr,_storeSlugMapping:()=>St,addSlugResolver:()=>Af,allMarkdownPaths:()=>ft,allMarkdownPathsSet:()=>Xe,availableLanguages:()=>yt,awaitSearchIndex:()=>ks,buildSearchIndex:()=>Rn,buildSearchIndexWorker:()=>ws,clearCrawlCache:()=>ao,clearFetchCache:()=>Pc,clearListCaches:()=>ro,crawlAllMarkdown:()=>Uc,crawlCache:()=>ei,crawlForSlug:()=>Dc,crawlForSlugWorker:()=>Ef,defaultCrawlMaxQueue:()=>vi,ensureSlug:()=>jc,fetchCache:()=>Ct,fetchMarkdown:()=>Ke,getFetchCacheDiagnostics:()=>Pf,getFetchConcurrency:()=>ti,getLanguages:()=>no,getSearchIndex:()=>Ff,homePage:()=>Mt,initSlugWorker:()=>Pa,isExternalLink:()=>Rf,isExternalLinkWithBase:()=>bi,listPathsFetched:()=>ca,listSlugCache:()=>Jr,mdToSlug:()=>ge,negativeFetchCache:()=>pn,notFoundPage:()=>xe,removeSlugResolver:()=>Tf,resolveSlugPath:()=>wr,searchIndex:()=>le,setContentBase:()=>io,setDefaultCrawlMaxQueue:()=>zc,setFetchCacheMaxSize:()=>Nf,setFetchCacheTTL:()=>If,setFetchConcurrency:()=>Ic,setFetchMarkdown:()=>zf,setFetchNegativeCacheTTL:()=>Nc,setHomePage:()=>Cc,setLanguages:()=>xc,setNegativeFetchCacheMaxSize:()=>Of,setNotFoundPage:()=>Mc,setSkipRootReadme:()=>kc,skipRootReadme:()=>to,slugResolvers:()=>La,slugToMd:()=>ne,slugify:()=>be,storeSlugMapping:()=>pt,teardownSlugWorkerPool:()=>Ac,unescapeMarkdown:()=>Ji,uniqueSlug:()=>Nn,watchForColdHashRoute:()=>Ki,whenSearchIndexReady:()=>Pn}),al=0,la=new Map;function Ki(e){try{if(!e)return;let t=an,n="";if(e.type==="cosmetic"){const i=e.page!=null&&String(e.page).trim()!=="";t=i?String(e.page):an,n="#/"+(i?String(e.page):""),e.anchor&&(n+="#"+String(e.anchor)),e.params&&(n+="?"+String(e.params))}else if(e.type==="path"){const i=e.page!=null&&String(e.page).trim()!=="";t=i?String(e.page):an,n="/"+(i?String(e.page):""),e.anchor&&(n+="#"+String(e.anchor)),e.params&&(n+="?"+String(e.params))}else if(e.type==="canonical")if(e.page)t=e.page,n="?page="+encodeURIComponent(e.page),e.anchor&&(n+="#"+String(e.anchor)),e.params&&(n+="?"+String(e.params));else{t=an;try{n=typeof location<"u"&&location?.pathname?String(location.pathname):"/",typeof location<"u"&&location?.search&&(n+=String(location.search)),typeof location<"u"&&location?.hash&&(n+=String(location.hash))}catch{n="/"}}else return;const r=la.get(t)||[];r.push(n),la.set(t,r)}catch{}}function vc(e,t){try{const n=String(e??""),r=la.get(n);if(!r||!r.length)return;try{const i=typeof globalThis<"u"?globalThis:null;if(i){try{i.__nimbiColdRouteResolved||(i.__nimbiColdRouteResolved=[])}catch{}for(const a of r)try{const o={slug:n,token:a,rel:String(t??"")};try{i.__nimbiColdRouteResolved.push(o),i.__nimbiColdRouteResolved.length>50&&i.__nimbiColdRouteResolved.splice(0,i.__nimbiColdRouteResolved.length-50)}catch{}try{i?.dispatchEvent?.(new CustomEvent("nimbi.coldRouteResolved",{detail:o}))}catch{}try{i?.__nimbiUI?.renderByQuery?.().catch(()=>{})}catch{}}catch{}}}catch{}la.delete(n)}catch{}}try{ne._nimbiVersion=0,ne.set=function(e,t){const n=Map.prototype.has.call(this,e),r=Map.prototype.set.call(this,e,t);this._nimbiVersion+=1;try{n||vc(e,typeof t=="string"?t:t?.default??Object.values(t?.langs??{})[0]??"")}catch{}return r},ne.clear=function(){Map.prototype.clear.call(this),this._nimbiVersion+=1}}catch{}var yt=[],to=!1;function kc(e){to=!!e}function xc(e){yt=Array.isArray(e)?e.slice():[]}function no(){return yt}async function Sc(e,t,n=4,r){if(!Array.isArray(e)||e.length===0)return[];const i=new bc(Math.max(1,Number(n)||1));return Promise.all(e.map((a,o)=>i.run(()=>t(a,o),{signal:r})))}var Ra=ac(),kf={intervalMs:750,targetMs:120,hysteresis:.3,cooldownMs:1e3,stepUp:1,stepDown:1},Xr=null;function xf(){const e={size:Ra,minSize:2,autoScale:kf,messageCodec:"negotiated",maxQueueLength:100};try{e.debugLevel=0}catch{}try{return Js("slug",new Xs(Zu,e))}catch{return{workers:[],postMessage:async()=>{throw new Error("slug worker unavailable")}}}}function Ec(){return Xr||(Xr=xf()),Xr}function Ac(){const e=Xr;if(Xr=null,!e)return Promise.resolve();eo("slug",e);try{const t=e[Symbol.asyncDispose];return typeof t=="function"?Promise.resolve(t.call(e)).catch(()=>{}):(typeof e.drain=="function"?Promise.resolve(e.drain()):Promise.resolve()).catch(()=>{}).then(()=>{typeof e.terminate=="function"&&e.terminate()})}catch(t){return x("[slugManager] teardownSlugWorkerPool failed",t),Promise.resolve()}}function Sf(){try{return nc()}catch{return!1}}function qi(e,t,n){if(n)return{kind:n.name==="AbortError"?"aborted":"network-error",url:e,error:n.message||String(n)};const r=typeof t?.headers?.get=="function"&&t.headers.get("content-type")||"";return{kind:t?.ok?"invalid-response":"http-error",url:e,status:t?.status,statusText:t?.statusText,redirected:t?.redirected===!0,contentType:r}}function Pa(){return Ec().workers?.[0]?.worker?._underlying??null}function Tc(e){return Pa?.()?Ec().postMessage(e,void 0,{awaitResponse:!0,timeout:5e3}).then(t=>{if(t?.error)throw new Error(t.error);return t}).catch(t=>{throw(t?.message||"").includes("postMessage response timeout")?new Error("worker timeout"):t}):Promise.reject(new Error("slug worker required but unavailable"))}async function ws(e,t=1,n=void 0,r=void 0){if(!Pa?.())throw new Error("slug worker required but unavailable");return await Tc({type:"buildSearchIndex",contentBase:e,indexDepth:t,noIndexing:n,seedPaths:r})}async function Ef(e,t,n){if(!Pa?.())throw new Error("slug worker required but unavailable");return Tc({type:"crawlForSlug",slug:e,base:t,maxQueue:n})}function St(e,t){if(!e)return;let n=null;try{n=oe(typeof t=="string"?t:String(t??""))}catch{n=String(t??"")}if(n){try{if(yt?.length){const r=String(n).split("/")[0],i=Array.isArray(yt)?yt.length>8?(yt._set||=new Set(yt)).has(r):yt.includes(r):!1;let a=ne.get(e);if(!a||typeof a=="string")a={default:typeof a=="string"?oe(a):void 0,langs:{}};else try{a.default&&(a.default=oe(a.default))}catch{}i?a.langs[r]=n:a.default=n,ne.set(e,a)}else{const r=ne.has(e)?ne.get(e):void 0;if(!r)ne.set(e,n);else{let i=null;try{typeof r=="string"?i=oe(r):r&&typeof r=="object"&&(i=r.default?oe(r.default):null)}catch{i=null}if(i===n)ne.set(e,n);else{let a=null,o=2;for(;a=`${e}-${o}`,!!ne.has(a);){let s=ne.get(a),l=null;try{typeof s=="string"?l=oe(s):s&&typeof s=="object"&&(l=s.default?oe(s.default):null)}catch{l=null}if(l===n){e=a;break}if(o+=1,o>1e4)break}try{if(!ne.has(a))ne.set(a,n),e=a;else if(ne.get(a)===n)e=a;else{const s=new Set;for(const c of ne.keys())s.add(c);const l=typeof Nn=="function"?Nn(e,s):`${e}-2`;ne.set(l,n),e=l}}catch(s){x("[slugManager] slug collision resolution failed",s)}}}}}catch{}try{if(n){try{ge.set(n,e)}catch{}Xe&&!Xe.has(n)&&(Xe.add(n),Array.isArray(ft)&&ft.push(n))}}catch{}}}function pt(e,t){return St(e,t)}var La=new Set;function Af(e){typeof e=="function"&&La.add(e)}function Tf(e){typeof e=="function"&&La.delete(e)}var bs={},xe="_404.md",Mt=null,an="_home";function Mc(e){if(e==null){xe=null;return}xe=String(e??"")}function Cc(e){if(e==null){Mt=null;return}Mt=String(e??"");try{try{vc(an,Mt)}catch{}}catch{}}function Rc(e){bs=e||{}}function Kr(e){try{if(Array.isArray(le)||(le=[]),!Array.isArray(e)||le.length>e.length)return;try{le.length=0;for(const t of e)le.push(t);try{if(typeof window<"u")try{window.__nimbiLiveSearchIndex=le}catch{}}catch{}}catch(t){ue("[slugManager] replacing searchIndex by assignment fallback",t);try{le=Array.from(e)}catch{}}}catch{}}var Jr=new Map,ca=new Set,ei=new Map;function ro(){Jr.clear(),ca.clear()}function Mf(e){if(!e||e.length===0)return"";let t=e[0];for(let r=1;r<e.length;r++){const i=e[r];let a=0;const o=Math.min(t.length,i.length);for(;a<o&&t[a]===i[a];)a++;t=t.slice(0,a)}const n=t.lastIndexOf("/");return n===-1?t:t.slice(0,n+1)}var Cf=new kr(function(e){let n=String(e??"").toLowerCase().replace(/[^a-z0-9\- ]/g,"").replace(/ /g,"-");return n=n.replace(/(?:-?)(?:md|html)$/,""),n=n.replace(/-+/g,"-"),n=n.replace(/^-|-$/g,""),n.length>80&&(n=n.slice(0,80).replace(/-+$/g,"")),n},{keyResolver:e=>e===void 0?"__undefined":String(e),cacheOptions:{maxEntries:2e3}}),be=e=>Cf.run(e);function io(e){ro(),ao(),ne.clear(),ge.clear(),qu([]);try{Xe.clear()}catch{}yt=yt||[];const t=!!yt?.length,n=new Set,r=Object.keys(bs||{});if(!r.length)return;let i="";try{if(e){try{/^[a-z][a-z0-9+.-]*:/i.test(String(e))?i=new URL(String(e)).pathname:i=String(e??"")}catch(a){i=String(e??""),ue("[slugManager] parse contentBase failed",a)}i=On(i)}}catch(a){i="",ue("[slugManager] setContentBase prefix derivation failed",a)}i||(i=Mf(r));for(const a of r){let o=a;i&&a.startsWith(i)?o=oe(a.slice(i.length)):o=oe(a),ft.push(o);try{Xe.add(o)}catch{}const s=bs[a];if(typeof s=="string"){const l=(s||"").match(/^#\s+(.+)$/m);if(l&&l[1]){const c=be(l[1].trim());if(c)try{let f=c;if(t||(f=Nn(f,n)),t){const u=o.split("/")[0],h=Array.isArray(yt)?yt.length>8?(yt._set||=new Set(yt)).has(u):yt.includes(u):!1;let p=ne.get(f);(!p||typeof p=="string")&&(p={default:typeof p=="string"?p:void 0,langs:{}}),h?p.langs[u]=o:p.default=o,ne.set(f,p)}else ne.set(f,o),n.add(f);ge.set(o,f)}catch(f){ue("[slugManager] set slug mapping failed",f)}}}}try{dr()}catch(a){ue("[slugManager] refreshIndexPaths failed",a)}}try{io()}catch(e){ue("[slugManager] initial setContentBase failed",e)}function Nn(e,t){if(!t.has(e))return e;let n=2,r=`${e}-${n}`;for(;t.has(r);)n+=1,r=`${e}-${n}`;return r}function Rf(e){return bi(e,void 0)}function bi(e,t){if(!e)return!1;if(e.startsWith("//"))return!0;if(/^[a-z][a-z0-9+.-]*:/i.test(e)){if(t&&typeof t=="string")try{const n=new URL(e),r=new URL(t);return n.origin!==r.origin?!0:!n.pathname.startsWith(r.pathname)}catch{return!0}return!0}if(e.startsWith("/")&&t&&typeof t=="string")try{const n=new URL(e,t),r=new URL(t);return n.origin!==r.origin?!0:!n.pathname.startsWith(r.pathname)}catch{return!0}return!1}function Ji(e){return e==null?e:String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g,(t,n)=>n)}function wr(e){if(!e||!ne.has(e))return null;const t=ne.get(e);if(!t)return null;if(typeof t=="string")return t;if(yt?.length&&Lt&&t.langs&&t.langs[Lt])return t.langs[Lt];if(t.default)return t.default;if(t.langs){const n=Object.keys(t.langs);if(n.length)return t.langs[n[0]]}return null}var Ct=new vr({maxEntries:2e3});function Pc(){Ct.clear(),pn.clear()}function Pf(){return{fetchEntries:Number(Ct.size)||0,negativeEntries:Number(pn.size)||0,maxEntries:Number(Ct.maxEntries)||0}}var pn=new vr({maxEntries:2e3});function Lf(e){try{const t=globalThis?.window?.__nimbiRuntimeManifest;if(t&&Number.isInteger(t.generation))return`${e}|||generation:${t.generation}|||language:${t.language||""}`}catch{}return e}var Lc=6e4;function Nc(e){Lc=Number(e)||0}function Nf(e){try{const t=Math.max(0,Number(e)||0);Ct&&typeof Ct.maxEntries<"u"&&(Ct.maxEntries=t)}catch{}}function If(e){try{const t=Math.max(0,Number(e)||0);Ct&&typeof Ct.defaultTTL<"u"&&(Ct.defaultTTL=t)}catch{}}function Of(e){try{const t=Math.max(0,Number(e)||0);pn&&typeof pn.maxEntries<"u"&&(pn.maxEntries=t)}catch{}}var vs=Math.max(1,Math.min(Ra,5));function Ic(e){try{vs=Math.max(1,Number(e)||1)}catch{vs=1}}function ti(){return vs}var Ke=async function(e,t,n){if(!e)throw new Error("path required");try{if(typeof e=="string"&&(e.indexOf("?page=")!==-1||e.startsWith("?")||e.startsWith("#/")||e.indexOf("#/")!==-1))try{const u=dt(e);u?.page&&(e=u.page)}catch{}}catch{}try{const u=(String(e??"").match(/([^\/]+)\.md(?:$|[?#])/)||[])[1],h=typeof e=="string"&&String(e).indexOf("/")===-1;if(u&&h&&ne.has(u)){const p=wr(u)||ne.get(u);p&&p!==e&&(e=p)}}catch(u){ue("[slugManager] slug mapping normalization failed",u)}try{if(typeof e=="string"&&e.indexOf("::")!==-1){const u=String(e).split("::",1)[0];if(u)try{if(ne.has(u)){const h=wr(u)||ne.get(u);h?e=h:e=u}else e=u}catch{e=u}}}catch(u){ue("[slugManager] path sanitize failed",u)}try{if(t)try{let u=(/^[a-z][a-z0-9+.-]*:/i.test(String(t))?new URL(String(t)):new URL(String(t),typeof location<"u"?location.origin:"http://localhost")).pathname||"";if(u=u.replace(/^\/+|\/+$/g,""),u)try{const h=String(e??"");if(!/^[a-z][a-z0-9+.-]*:/i.test(h)){let p=h.replace(/^\/+/,"");p===u?e="":p.startsWith(u+"/")?e=p.slice(u.length+1):e=p}}catch{}}catch{}}catch{}if(!(n?.force===!0||typeof xe=="string"&&xe||ne?.size||Xe?.size||nc()))throw new Error("failed to fetch md");const r=t==null?"":Jn(String(t));let i="";try{const u=typeof location<"u"&&location?.origin?location.origin:"http://localhost";let h=u.replace(/\/$/,"")+"/";r&&(/^[a-z][a-z0-9+.-]*:/i.test(r)?h=r.replace(/\/$/,"")+"/":r.startsWith("/")?h=u.replace(/\/$/,"")+r.replace(/\/$/,"")+"/":h=u.replace(/\/$/,"")+"/"+r.replace(/\/$/,"")+"/");try{i=new URL(e.replace(/^\//,""),h).toString()}catch{i=u.replace(/\/$/,"")+"/"+e.replace(/^\//,"")}}catch{i=(typeof location<"u"&&location.origin?location.origin:"http://localhost")+"/"+e.replace(/^\//,"")}const a=n?.signal,o=async u=>{const h=n&&typeof n.timeoutMs=="number"?Math.max(0,Number(n.timeoutMs)||0):1e4;if(typeof Zr=="function"){const m=new Zr({totalTimeout:h});m.signal;try{if(a&&typeof AbortSignal<"u"&&typeof AbortSignal.any=="function"&&m.signal instanceof AbortSignal)AbortSignal.any([a,m.signal]);else if(a&&typeof AbortSignal<"u"){const y=new AbortController;try{a.addEventListener("abort",()=>y.abort(),{once:!0})}catch{}try{m.signal.addEventListener("abort",()=>y.abort(),{once:!0})}catch{}try{(a?.aborted||m.signal?.aborted)&&y.abort()}catch{}y.signal}}catch{}return await m.run(async y=>{const g=y||a||m.signal,d=3,_=async()=>{if(g?.aborted){const k=new Error("aborted");throw k.name="AbortError",k}return await fetch(u,g?{signal:g,referrerPolicy:"no-referrer"}:{referrerPolicy:"no-referrer"})};if(typeof sa=="function"){const k=new sa({maxAttempts:d,backoff:"exponential",baseDelay:50,jitter:!1});if(typeof k.run=="function")return await k.run(async()=>{const v=await _();if(v&&typeof v.status=="number"&&v.status>=500){const I=new Error("server error");throw I.status=v.status,I}return v})}let w;for(let k=0;k<d;k++){if(g?.aborted){const v=new Error("aborted");throw v.name="AbortError",v}try{const v=await _();if(v&&typeof v.status=="number"&&v.status>=500){if(w=new Error("server error"),w.status=v.status,k<2){const I=Math.pow(2,k)*50;await new Promise(N=>setTimeout(N,I));continue}throw w}return v}catch(v){if(v&&v.name==="AbortError")throw v;if(w=v,k<2){const I=Math.pow(2,k)*50;await new Promise(N=>setTimeout(N,I));continue}throw w}}},a?{signal:a}:void 0)}let p=a||null;try{!p&&typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function"?p=AbortSignal.timeout(h):p&&typeof AbortSignal<"u"&&typeof AbortSignal.timeout=="function"&&typeof AbortSignal.any=="function"&&(p=AbortSignal.any([p,AbortSignal.timeout(h)]))}catch{}return await fetch(u,p?{signal:p}:void 0)},s=Lf(i);try{const u=pn.get(s);if(u&&u>Date.now())return Promise.reject(new Error("failed to fetch md"));u&&pn.delete(s)}catch{}if(Ct.has(s))return Ct.get(s);const l=(async()=>{let u;try{u=await o(i)}catch(g){try{Gr("fetchMarkdown failed:",()=>qi(i,null,g))}catch{}throw new Error("failed to fetch md")}if(!u||typeof u.ok!="boolean"||!u.ok){if(u&&u.status===404&&typeof xe=="string"&&xe)try{const d=`${r}/${xe}`,_=await o(d);if(_&&typeof _.ok=="boolean"&&_.ok)return{raw:await _.text(),status:404}}catch(d){ue("[slugManager] fetching fallback 404 failed",d)}let g="";try{u&&typeof u.clone=="function"?g=await u.clone().text():u&&typeof u.text=="function"?g=await u.text():g=""}catch(d){g="",ue("[slugManager] reading error body failed",d)}try{if((u?u.status:void 0)===404)try{x("fetchMarkdown failed (404):",()=>({...qi(i,u),body:g.slice(0,200)}))}catch{}else try{Gr("fetchMarkdown failed:",()=>({...qi(i,u),body:g.slice(0,200)}))}catch{}}catch{}throw new Error("failed to fetch md")}const h=await u.text(),p=h.trim().slice(0,128).toLowerCase(),m=/^(?:<!doctype|<html|<title|<h1)/.test(p),y=m||String(e??"").toLowerCase().endsWith(".html");if(m&&String(e??"").toLowerCase().endsWith(".md")){try{if(typeof xe=="string"&&xe){const g=`${r}/${xe}`,d=await o(g);if(d.ok)return{raw:await d.text(),status:404}}}catch(g){ue("[slugManager] fetching fallback 404 failed",g)}throw Sf()&&Gr("fetchMarkdown: invalid content type for .md request",()=>({...qi(i,u),expected:"text/markdown or text/plain"})),new Error("failed to fetch md")}return y?{raw:h,isHtml:!0}:{raw:h}})();Ct.set(s,l);let c=null,f=l;try{if(a&&typeof a=="object"){const u=new Promise((h,p)=>{try{if(a.aborted){const m=new Error("aborted");return m.name="AbortError",p(m)}}catch{}c=()=>{const m=new Error("aborted");m.name="AbortError";try{a.removeEventListener&&a.removeEventListener("abort",c)}catch{}p(m)};try{a.addEventListener&&a.addEventListener("abort",c)}catch{}});f=Promise.race([l,u])}}catch{}return f.finally(()=>{try{c&&a&&typeof a.removeEventListener=="function"&&a.removeEventListener("abort",c)}catch{}}).catch(u=>{if(u&&(u.name==="AbortError"||u.code==="EABORT"||u.code==="EDEADLINE")){try{Ct.delete(s)}catch{}throw u}try{pn.set(s,Date.now()+Lc)}catch{}try{Ct.delete(s)}catch{}throw u})};function zf(e){typeof e=="function"&&(Ke=e)}function ao(){ei.clear()}function $f(e){if(!e||typeof e!="string")return"";let t=e.replace(/```[\s\S]*?```/g,"");return t=t.replace(/<pre[\s\S]*?<\/pre>/gi,""),t=t.replace(/<code[\s\S]*?<\/code>/gi,""),t=t.replace(/<!--([\s\S]*?)-->/g,""),t=t.replace(/^ {4,}.*$/gm,""),t=t.replace(/`[^`]*`/g,""),t}var le=[];function Ff(){return le}try{if(typeof window<"u")try{Object.defineProperty(window,"__nimbiSearchIndex",{get(){return le},enumerable:!0,configurable:!0})}catch{try{window.__nimbiSearchIndex=le}catch{}}}catch{}try{if(typeof window<"u")try{Object.defineProperty(window,"__nimbiIndexReady",{get(){return ks},enumerable:!0,configurable:!0})}catch{try{window.__nimbiIndexReady=ks}catch{}}}catch{}var Tn=null;async function Rn(e,t=1,n=void 0,r=void 0){const i=Array.isArray(n)?Array.from(new Set((n||[]).map(a=>oe(String(a??""))))):[];try{const a=oe(String(xe??""));a&&!i.includes(a)&&i.push(a)}catch{}if(le&&le.length&&t===1&&!le.some(a=>{try{return i.includes(oe(String(a.path??"")))}catch{return!1}}))return le;if(Tn)return Tn;Tn=(async()=>{let a=Array.isArray(n)?Array.from(new Set((n||[]).map(d=>oe(String(d??""))))):[],o=new Set(a);try{const d=oe(String(xe??""));d&&!o.has(d)&&(o.add(d),a.push(d))}catch{}const s=d=>{if(!o||o.size===0)return!1;for(const _ of o)if(_&&(d===_||d.startsWith(_+"/")))return!0;return!1};let l=[];try{if(Array.isArray(r)&&r.length)for(const d of r)try{const _=oe(String(d??""));_&&l.push(_)}catch{}}catch{}if(Array.isArray(ft)&&ft.length){const d=new Set(l);for(const _ of ft)d.has(_)||(l.push(_),d.add(_))}if(!l.length){if(ge&&typeof ge.size=="number"&&ge.size)try{l=Array.from(ge.keys())}catch{l=[]}else for(const d of ne.values())if(d){if(typeof d=="string")l.push(d);else if(d&&typeof d=="object"){d.default&&l.push(d.default);const _=d.langs||{};for(const w of Object.keys(_||{}))try{_[w]&&l.push(_[w])}catch{}}}}try{const d=await Uc(e);d&&d.length&&(l=l.concat(d))}catch(d){ue("[slugManager] crawlAllMarkdown during buildSearchIndex failed",d)}try{const d=new Set(l),_=[...l],w=Math.max(1,Math.min(ti(),_.length||ti()));let k=0;const v=async()=>{for(;!(d.size>vi);){const N=_.shift();if(!N)break;try{const z=await Ke(N,e);if(z&&z.raw){if(z.status===404)continue;let W=z.raw;const q=[],ae=String(N??"").replace(/^.*\//,"");if(/^readme(?:\.md)?$/i.test(ae)&&to&&(!N||!N.includes("/")))continue;const G=$f(W),ke=/\[[^\]]+\]\(([^)]+)\)/g;let Y;for(;Y=ke.exec(G);)q.push(Y[1]);const B=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;Y=B.exec(G);)q.push(Y[1]);const E=N&&N.includes("/")?N.substring(0,N.lastIndexOf("/")+1):"";for(let A of q)try{if(bi(A,e)||A.startsWith("..")||A.indexOf("/../")!==-1||(E&&!A.startsWith("./")&&!A.startsWith("/")&&!A.startsWith("../")&&(A=E+A),A=oe(A),!A||A.startsWith("#")||A.startsWith("?")))continue;if(!/\.(md|html?)(?:$|[?#])/i.test(A)){const C=A.split(/[?#]/)[0].replace(/\/+$/,""),M=String(C).split("/").pop()||"";if(/\.[^./]+$/i.test(M))continue;const se=[`${C}.md`,`${C}.html`,`${C}/README.md`,`${C}/README.html`];for(const K of se)!K||s(K)||d.has(K)||(d.add(K),_.push(K),l.push(K));continue}if(A=A.split(/[?#]/)[0],s(A))continue;d.has(A)||(d.add(A),_.push(A),l.push(A))}catch(C){ue("[slugManager] href processing failed",A,C)}}}catch(z){ue("[slugManager] discovery fetch failed for",N,z)}try{k++,await An(k,32)}catch{}}},I=[];for(let N=0;N<w;N++)I.push(v());await Promise.all(I)}catch(d){ue("[slugManager] discovery loop failed",d)}const c=new Set;l=l.filter(d=>!d||c.has(d)||s(d)?!1:(c.add(d),!0));const f=[],u=new Map,h=l.filter(d=>/\.(?:md|html?)(?:$|[?#])/i.test(d)),p=Math.max(1,Math.min(ti(),h.length||1)),m=h.slice(),y=[];for(let d=0;d<p;d++)y.push((async()=>{for(;m.length;){const _=m.shift();if(!_)break;try{const w=await Ke(_,e);u.set(_,w)}catch(w){ue("[slugManager] buildSearchIndex: entry fetch failed",_,w),u.set(_,null)}}})());await Promise.all(y);let g=0;for(const d of l){try{g++,await An(g,16)}catch{}if(/\.(?:md|html?)(?:$|[?#])/i.test(d))try{const _=u.get(d);if(!_||!_.raw||_.status===404)continue;let w="",k="",v=null,I=null;if(_.isHtml)try{const z=ot(),W=z?z.parseFromString(_.raw,"text/html"):null,q=W?W.querySelector("title")||W.querySelector("h1"):null;q&&q.textContent&&(w=q.textContent.trim());const ae=W?W.querySelector("p"):null;if(ae&&ae.textContent&&(k=ae.textContent.trim()),t>=2)try{const G=W?W.querySelector("h1"):null,ke=G&&G.textContent?G.textContent.trim():w||"";try{const B=ge?.has?.(d)?ge?.get?.(d):null;if(B)v=B;else{let E=be(w||d);const A=new Set;try{for(const M of ne.keys())A.add(M)}catch{}try{for(const M of f)M&&M.slug&&A.add(String(M.slug).split("::")[0])}catch{}let C=!1;try{if(ne.has(E)){const M=ne.get(E);if(typeof M=="string")M===d&&(C=!0);else if(M&&typeof M=="object"){M.default===d&&(C=!0);for(const se of Object.keys(M.langs||{}))if(M.langs[se]===d){C=!0;break}}}}catch{}!C&&A.has(E)&&(E=Nn(E,A)),v=E;try{ge?.has?.(d)||St(v,d)}catch{}}}catch(B){ue("[slugManager] derive pageSlug failed",B)}const Y=Array.from(W.querySelectorAll("h2"));for(const B of Y)try{const E=(B.textContent||"").trim();if(!E)continue;const A=B.id?B.id:be(E),C=v?`${v}::${A}`:`${be(d)}::${A}`;let M="",se=B.nextElementSibling;for(;se&&se.tagName&&se.tagName.toLowerCase()==="script";)se=se.nextElementSibling;se&&se.textContent&&(M=String(se.textContent).trim()),f.push({slug:C,title:E,excerpt:M,path:d,parentTitle:ke})}catch(E){ue("[slugManager] indexing H2 failed",E)}if(t===3)try{const B=Array.from(W.querySelectorAll("h3"));for(const E of B)try{const A=(E.textContent||"").trim();if(!A)continue;const C=E.id?E.id:be(A),M=v?`${v}::${C}`:`${be(d)}::${C}`;let se="",K=E.nextElementSibling;for(;K&&K.tagName&&K.tagName.toLowerCase()==="script";)K=K.nextElementSibling;K&&K.textContent&&(se=String(K.textContent).trim()),f.push({slug:M,title:A,excerpt:se,path:d,parentTitle:ke})}catch(A){ue("[slugManager] indexing H3 failed",A)}}catch(B){ue("[slugManager] collect H3s failed",B)}}catch(G){ue("[slugManager] collect H2s failed",G)}}catch(z){ue("[slugManager] parsing HTML for index failed",z)}else{const z=_.raw,W=z.match(/^#\s+(.+)$/m);w=W?W[1].trim():"";try{w=Ji(w)}catch{}const q=z.split(/\r?\n\s*\r?\n/);if(q.length>1)for(let ae=1;ae<q.length;ae++){const G=q[ae].trim();if(G&&!/^#/.test(G)){k=G.replace(/\r?\n/g," ");break}}try{const{data:ae}=Yr(z),G=ae.image||ae.og_image||ae.cover||ae.featured_image;G&&String(G).trim()&&(I=String(G).trim())}catch{}if(t>=2){let ae="";try{const G=(z.match(/^#\s+(.+)$/m)||[])[1];ae=G?G.trim():"";try{const B=ge?.has?.(d)?ge?.get?.(d):null;if(B)v=B;else{let E=be(w||d);const A=new Set;try{for(const M of ne.keys())A.add(M)}catch{}try{for(const M of f)M&&M.slug&&A.add(String(M.slug).split("::")[0])}catch{}let C=!1;try{if(ne.has(E)){const M=ne.get(E);if(typeof M=="string")M===d&&(C=!0);else if(M&&typeof M=="object"){M.default===d&&(C=!0);for(const se of Object.keys(M.langs||{}))if(M.langs[se]===d){C=!0;break}}}}catch{}!C&&A.has(E)&&(E=Nn(E,A)),v=E;try{ge?.has?.(d)||St(v,d)}catch{}}}catch(B){ue("[slugManager] derive pageSlug failed",B)}const ke=/^##\s+(.+)$/gm;let Y;for(;Y=ke.exec(z);)try{const B=(Y[1]||"").trim(),E=Ji(B);if(!B)continue;const A=be(B),C=v?`${v}::${A}`:`${be(d)}::${A}`,M=z.slice(ke.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),se=M&&M[1]?String(M[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";f.push({slug:C,title:E,excerpt:se,path:d,parentTitle:ae})}catch(B){ue("[slugManager] indexing markdown H2 failed",B)}}catch(G){ue("[slugManager] collect markdown H2s failed",G)}if(t===3)try{const G=/^###\s+(.+)$/gm;let ke;for(;ke=G.exec(z);)try{const Y=(ke[1]||"").trim(),B=Ji(Y);if(!Y)continue;const E=be(Y),A=v?`${v}::${E}`:`${be(d)}::${E}`,C=z.slice(G.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),M=C&&C[1]?String(C[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";f.push({slug:A,title:B,excerpt:M,path:d,parentTitle:ae})}catch(Y){ue("[slugManager] indexing markdown H3 failed",Y)}}catch(G){ue("[slugManager] collect markdown H3s failed",G)}}}let N="";try{ge?.has?.(d)&&(N=ge?.get?.(d))}catch(z){ue("[slugManager] mdToSlug access failed",z)}if(!N){try{if(!v){const z=ge?.has?.(d)?ge?.get?.(d):null;if(z)v=z;else{let W=be(w||d);const q=new Set;try{for(const G of ne.keys())q.add(G)}catch{}try{for(const G of f)G&&G.slug&&q.add(String(G.slug).split("::")[0])}catch{}let ae=!1;try{if(ne.has(W)){const G=ne.get(W);if(typeof G=="string")G===d&&(ae=!0);else if(G&&typeof G=="object"){G.default===d&&(ae=!0);for(const ke of Object.keys(G.langs||{}))if(G.langs[ke]===d){ae=!0;break}}}}catch{}!ae&&q.has(W)&&(W=Nn(W,q)),v=W;try{ge?.has?.(d)||St(v,d)}catch{}}}}catch(z){ue("[slugManager] derive pageSlug failed",z)}N=v||be(w||d)}f.push({slug:N,title:w,excerpt:k,path:d,image:I})}catch(_){ue("[slugManager] buildSearchIndex: entry processing failed",_)}}try{const d=f.filter(_=>{try{return!s(String(_.path??""))}catch{return!0}});try{if(Array.isArray(le)||(le=[]),le.length>d.length)return le;le.length=0;for(const _ of d)le.push(_)}catch{try{le=Array.from(d)}catch{le=d}}try{if(typeof window<"u"){try{window.__nimbiResolvedIndex=le}catch{}try{const _=[],w=new Set;for(const k of le)try{if(!k||!k.slug)continue;const v=String(k.slug).split("::")[0];if(w.has(v))continue;w.add(v);const I={slug:v};k.title?I.title=String(k.title):k.parentTitle&&(I.title=String(k.parentTitle)),k.path&&(I.path=String(k.path)),_.push(I)}catch{}try{window.__nimbiSitemapJson={generatedAt:new Date().toISOString(),entries:_}}catch{}try{window.__nimbiSitemapFinal=_}catch{}}catch{}}}catch{}}catch(d){ue("[slugManager] filtering index by excludes failed",d);try{if(Array.isArray(le)||(le=[]),le.length>f.length)return le;le.length=0;for(const _ of f)le.push(_)}catch{try{le=Array.from(f)}catch{le=f}}try{if(typeof window<"u")try{window.__nimbiResolvedIndex=le}catch{}}catch{}}return le})();try{await Tn}catch(a){ue("[slugManager] awaiting _indexPromise failed",a)}return Tn=null,le}async function Pn(e={}){try{const t=typeof e.timeoutMs=="number"?e.timeoutMs:8e3,n=e.contentBase,r=typeof e.indexDepth=="number"?e.indexDepth:1,i=Array.isArray(e.noIndexing)?e.noIndexing:void 0,a=Array.isArray(e.seedPaths)?e.seedPaths:void 0,o=typeof e.startBuild=="boolean"?e.startBuild:!0;if(Array.isArray(le)&&le.length&&!Tn&&!o)return le;if(Tn){try{await Tn}catch{}return le}if(o){try{if(typeof ws=="function")try{const c=await ws(n,r,i,a);if(Array.isArray(c)&&c.length){try{Kr(c)}catch{}return le}}catch{}}catch{}const l=Date.now();try{return await Rn(n,r,i,a),le}catch{}finally{Ks("slug-main-thread",Date.now()-l)}}const s=Date.now();for(;Date.now()-s<t;){if(Array.isArray(le)&&le.length)return le;await new Promise(l=>setTimeout(l,150))}return le}catch{return le}}async function ks(e={}){try{const t=Object.assign({},e);typeof t.startBuild!="boolean"&&(t.startBuild=!0),typeof t.timeoutMs!="number"&&(t.timeoutMs=1/0);try{return await Pn(t)}catch{return le}}catch{return le}}var Oc=1e3,vi=Oc;function zc(e){typeof e=="number"&&e>=0&&(vi=e)}var $c=ot(),Fc="a[href]",Dc=async function(e,t,n=vi){if(ei.has(e))return ei.get(e);let r=null;const i=new Set,a=[""],o=typeof location<"u"&&location.origin?location.origin:"http://localhost";let s=o+"/";try{t&&(/^[a-z][a-z0-9+.-]*:/i.test(String(t))?s=String(t).replace(/\/$/,"")+"/":String(t).startsWith("/")?s=o+String(t).replace(/\/$/,"")+"/":s=o+"/"+String(t).replace(/\/$/,"")+"/")}catch{s=o+"/"}const l=Math.max(1,Math.min(Ra,6));for(;a.length&&!r&&!(a.length>n);)await Sc(a.splice(0,l),async c=>{if(c==null||i.has(c))return;i.add(c);let f="";try{f=new URL(c||"",s).toString()}catch{f=(String(t??"")||o)+"/"+String(c??"").replace(/^\//,"")}try{let u;try{u=await globalThis.fetch(f)}catch(g){ue("[slugManager] crawlForSlug: fetch failed",{url:f,error:g});return}if(!u||!u.ok){u&&!u.ok&&ue("[slugManager] crawlForSlug: directory fetch non-ok",{url:f,status:u.status});return}const h=await u.text(),p=$c.parseFromString(h,"text/html");let m=[];try{p&&typeof p.getElementsByTagName=="function"?m=p.getElementsByTagName("a"):p&&typeof p.querySelectorAll=="function"?m=p.querySelectorAll(Fc):m=[]}catch{try{m=p.getElementsByTagName?p.getElementsByTagName("a"):[]}catch{m=[]}}const y=f;for(const g of m)try{if(r)break;let d=g.getAttribute("href")||"";if(!d||bi(d,t)||d.startsWith("..")||d.indexOf("/../")!==-1)continue;if(d.endsWith("/")){try{const _=new URL(d,y),w=new URL(s).pathname,k=_.pathname.startsWith(w)?_.pathname.slice(w.length):_.pathname.replace(/^\//,""),v=On(oe(k));i.has(v)||a.push(v)}catch{const w=oe(c+d);i.has(w)||a.push(w)}continue}if(d.toLowerCase().endsWith(".md")){let _="";try{const w=new URL(d,y),k=new URL(s).pathname;_=w.pathname.startsWith(k)?w.pathname.slice(k.length):w.pathname.replace(/^\//,"")}catch{_=(c+d).replace(/^\//,"")}_=oe(_);try{if(ge?.has?.(_))continue;for(const w of ne.values());}catch(w){ue("[slugManager] slug map access failed",w)}try{const w=await Ke(_,t);if(w&&w.raw){const k=(w.raw||"").match(/^#\s+(.+)$/m);if(k&&k[1]&&be(k[1].trim())===e){r=_;break}}}catch(w){ue("[slugManager] crawlForSlug: fetchMarkdown failed",w)}}}catch(d){ue("[slugManager] crawlForSlug: link iteration failed",d)}}catch(u){ue("[slugManager] crawlForSlug: directory fetch failed",u)}},l);return ei.set(e,r),r};async function Uc(e,t=vi){const n=new Set,r=new Set,i=[""],a=typeof location<"u"&&location.origin?location.origin:"http://localhost";let o=a+"/";try{e&&(/^[a-z][a-z0-9+.-]*:/i.test(String(e))?o=String(e).replace(/\/$/,"")+"/":String(e).startsWith("/")?o=a+String(e).replace(/\/$/,"")+"/":o=a+"/"+String(e).replace(/\/$/,"")+"/")}catch{o=a+"/"}const s=Math.max(1,Math.min(Ra,6));for(;i.length&&!(i.length>t);)await Sc(i.splice(0,s),async l=>{if(l==null||r.has(l))return;r.add(l);let c="";try{c=new URL(l||"",o).toString()}catch{c=(String(e??"")||a)+"/"+String(l??"").replace(/^\//,"")}try{let f;try{f=await globalThis.fetch(c)}catch(y){ue("[slugManager] crawlAllMarkdown: fetch failed",{url:c,error:y});return}if(!f||!f.ok){f&&!f.ok&&ue("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:c,status:f.status});return}const u=await f.text(),h=$c.parseFromString(u,"text/html");let p=[];try{h&&typeof h.getElementsByTagName=="function"?p=h.getElementsByTagName("a"):h&&typeof h.querySelectorAll=="function"?p=h.querySelectorAll(Fc):p=[]}catch{try{p=h.getElementsByTagName?h.getElementsByTagName("a"):[]}catch{p=[]}}const m=c;for(const y of p)try{let g=y.getAttribute("href")||"";if(!g||bi(g,e)||g.startsWith("..")||g.indexOf("/../")!==-1)continue;if(g.endsWith("/")){try{const _=new URL(g,m),w=new URL(o).pathname,k=_.pathname.startsWith(w)?_.pathname.slice(w.length):_.pathname.replace(/^\//,""),v=On(oe(k));r.has(v)||i.push(v)}catch{const w=l+g;r.has(w)||i.push(w)}continue}let d="";try{const _=new URL(g,m),w=new URL(o).pathname;d=_.pathname.startsWith(w)?_.pathname.slice(w.length):_.pathname.replace(/^\//,"")}catch{d=(l+g).replace(/^\//,"")}if(d=oe(d),/\.(md|html?)$/i.test(d))n.add(d);else{const _=d.split(/[?#]/)[0].replace(/\/+$/,""),w=String(_).split("/").pop()||"";if(/\.[^./]+$/i.test(w))continue;_&&(n.add(`${_}.md`),n.add(`${_}.html`),n.add(`${_}/README.md`),n.add(`${_}/README.html`))}}catch(g){ue("[slugManager] crawlAllMarkdown: link iteration failed",g)}}catch(f){ue("[slugManager] crawlAllMarkdown: directory fetch failed",f)}},s);return Array.from(n)}async function jc(e,t,n){if(e&&typeof e=="string"&&(e=oe(e),e=Jn(e)),ne.has(e))return wr(e)||ne.get(e);try{if(!(typeof xe=="string"&&xe||ne.has(e)||Xe&&Xe.size||Qi()||typeof t=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(t)))return null}catch{}for(const i of La)try{const a=await i(e,t);if(a)return St(e,a),a}catch(a){ue("[slugManager] slug resolver failed",a)}if(Xe&&Xe.size){for(const i of ft)try{const a=String(i??"").replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(a&&be(a)===e)return St(e,i),i}catch(a){ue("[slugManager] filename fast-path match failed",a)}if(Jr.has(e)){const i=Jr.get(e);return St(e,i),i}for(const i of ft)if(!ca.has(i))try{const a=await Ke(i,t);if(a&&a.raw){const o=(a.raw||"").match(/^#\s+(.+)$/m);if(o&&o[1]){const s=be(o[1].trim());if(ca.add(i),s&&Jr.set(s,i),s===e)return St(e,i),i}}}catch(a){ue("[slugManager] manifest title fetch failed",a)}try{al++,await An(al,8)}catch{}}const r=[`${e}.html`,`${e}.md`];for(const i of r)try{const a=await Ke(i,t);if(a&&a.raw)return St(e,i),i}catch(a){ue("[slugManager] candidate fetch failed",a)}try{const i=await Rn(t);if(i&&i.length){const a=i.find(o=>o.slug===e);if(a)return St(e,a.path),a.path}}catch(i){ue("[slugManager] buildSearchIndex lookup failed",i)}try{const i=await Dc(e,t,n);if(i)return St(e,i),i}catch(i){ue("[slugManager] crawlForSlug lookup failed",i)}if(Xe&&Xe.size)for(const i of ft)try{const a=i.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(be(a)===e)return St(e,i),i}catch(a){ue("[slugManager] build-time filename match failed",a)}try{if(Mt&&typeof Mt=="string"&&Mt.trim())try{const i=await Ke(Mt,t);if(i&&i.raw){const a=(i.raw||"").match(/^#\s+(.+)$/m);if(a&&a[1]&&be(a[1].trim())===e)return St(e,Mt),Mt}}catch(i){ue("[slugManager] home page fetch failed",i)}}catch(i){ue("[slugManager] home page fetch failed",i)}return null}var Df=Xl(((e,t)=>{function n(s,l){return l.some(([c,f])=>c<=s&&s<=f)}function r(s){return typeof s!="string"?!1:n(s.charCodeAt(0),[[12352,12447],[19968,40959],[44032,55203],[131072,191456]])}function i(s){return` 
\r	`.includes(s)}function a(s){return typeof s!="string"?!1:n(s.charCodeAt(0),[[33,47],[58,64],[91,96],[123,126],[12288,12351],[65280,65519]])}function o(s,l={}){let c=0,f=0,u=s.length-1;const h=l.wordsPerMinute||200,p=l.wordBound||i;for(;p(s[f]);)f++;for(;p(s[u]);)u--;const m=`${s}
`;for(let d=f;d<=u;d++)if((r(m[d])||!p(m[d])&&(p(m[d+1])||r(m[d+1])))&&c++,r(m[d]))for(;d<=u&&(a(m[d+1])||p(m[d+1]));)d++;const y=c/h,g=Math.round(y*60*1e3);return{text:Math.ceil(y.toFixed(2))+" min read",minutes:y,time:g,words:c}}t.exports=o})),Uf=Kl(Df(),1),jr=new Map,jf=200;function Bf(e){const t=String(e??"");let n=0;for(let r=0;r<t.length;r++){const i=t.charCodeAt(r);n=(n<<5)-n+i|0}return`${t.length}:${n}`}function Wf(e,t){if(jr.set(e,new WeakRef(t)),jr.size>jf){const n=jr.keys().next().value;n&&jr.delete(n)}}function qf(e){try{return e.deref()}catch{return}}function Hf(e){return e?String(e).trim().split(/\s+/).filter(Boolean).length:0}function Vf(e){const t=Bf(e),n=qf(jr.get(t));if(n)return Object.assign({},n);const r=(0,Uf.default)(e||""),i={readingTime:r,wordCount:typeof r.words=="number"?r.words:Hf(e)};return Wf(t,i),Object.assign({},i)}function ui(e,t){const n=typeof CSS<"u"&&CSS.escape?CSS.escape(String(e)):String(e);let r=document.querySelector(`meta[name="${n}"]`);r||(r=document.createElement("meta"),r.setAttribute("name",e),document.head.appendChild(r)),r.setAttribute("content",t)}function Gf(){try{if(typeof document>"u"||!document.head)return;try{if(!document.querySelector("meta[charset]")){const e=document.createElement("meta");e.setAttribute("charset","utf-8"),document.head.prepend(e)}}catch{}try{if(!document.querySelector('meta[name="viewport"]')){const e=document.createElement("meta");e.setAttribute("name","viewport"),e.setAttribute("content","width=device-width, initial-scale=1"),document.head.appendChild(e)}}catch{}}catch{}}function xt(e,t,n){let r=`meta[${e}="${typeof CSS<"u"&&CSS.escape?CSS.escape(String(t)):String(t)}"]`,i=document.querySelector(r);i||(i=document.createElement("meta"),i.setAttribute(e,t),document.head.appendChild(i)),i.setAttribute("content",n)}function sl(e,t,n){const r=typeof CSS<"u"&&CSS.escape?CSS.escape(String(t)):String(t);document.querySelectorAll(`meta[${e}="${r}"]`).forEach(i=>i.remove());for(const i of n){const a=document.createElement("meta");a.setAttribute(e,t),a.setAttribute("content",String(i)),document.head.appendChild(a)}}function Bc(e,t){try{if(!e)return;const n=typeof CSS<"u"&&CSS.escape?CSS.escape(String(e)):String(e);let r=document.querySelector(`link[rel="${n}"]`);r||(r=document.createElement("link"),r.setAttribute("rel",e),document.head.appendChild(r)),r.setAttribute("href",t)}catch(n){x("[seoManager] upsertLinkRel failed",n)}}function Wc(e){if(!Array.isArray(e))return[];const t=new Set;for(const n of e)try{const r=new Intl.Locale(String(n)).toString();r.toLowerCase()!=="x-default"&&t.add(r)}catch{}return[...t]}function qc(e){try{if(typeof document>"u"||!document.head)return;document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(n=>n.remove());const t=Wc(no());if(!Array.isArray(t)||t.length===0)return;try{const n=typeof location<"u"&&location?.origin?location.origin+location.pathname.split("?")[0]:"";if(!n)return;const r=e||"",i=r?`${n}?page=${encodeURIComponent(r)}`:n;for(const a of t)try{const o=`${i}${i.includes("?")?"&":"?"}lang=${encodeURIComponent(String(a))}`,s=document.createElement("link");s.setAttribute("rel","alternate"),s.setAttribute("hreflang",String(a)),s.setAttribute("href",o),document.head.appendChild(s)}catch{}try{const a=document.createElement("link");a.setAttribute("rel","alternate"),a.setAttribute("hreflang","x-default"),a.setAttribute("href",i),document.head.appendChild(a)}catch{}}catch(n){x("[seoManager] setHreflangTags failed",n)}}catch(t){x("[seoManager] setHreflangTags failed",t)}}function Zf(e,t,n,r,i){xt("property","og:title",t&&String(t).trim()?t:e.title||document.title);const a=r&&String(r).trim()?r:e.description||"";a&&String(a).trim()&&xt("property","og:description",a),a&&String(a).trim()&&xt("name","twitter:description",a),xt("name","twitter:card",e.twitter_card||"summary_large_image");const o=n||e.image;o&&(xt("property","og:image",o),xt("name","twitter:image",o),e.image_width&&xt("property","og:image:width",String(e.image_width)),e.image_height&&xt("property","og:image:height",String(e.image_height))),xt("property","og:type",i||e.og_type||(e.type==="Article"?"article":"website"));try{const s=typeof navigator<"u"&&(navigator.language||navigator.languages?.[0])||"en";xt("property","og:locale",String(s).replace("-","_").toLowerCase());const l=Wc(no());Array.isArray(l)&&l.length>0?sl("property","og:locale:alternate",l.map(c=>String(c).replace("-","_").toLowerCase())):sl("property","og:locale:alternate",[])}catch{}if(e.date)try{const s=new Date(e.date);isNaN(s.getTime())||xt("property","article:published_time",s.toISOString())}catch{}if(e.dateModified)try{const s=new Date(e.dateModified);isNaN(s.getTime())||xt("property","article:modified_time",s.toISOString())}catch{}e.twitter_site&&xt("name","twitter:site",String(e.twitter_site)),e.twitter_creator&&xt("name","twitter:creator",String(e.twitter_creator))}function so(e,t,n,r,i=""){const a=e.meta||{},o=document?.querySelector&&document.querySelector('meta[name="description"]')?.getAttribute("content")||"",s=r&&String(r).trim()?r:a.description&&String(a.description).trim()?a.description:o&&String(o).trim()?o:"";s&&String(s).trim()&&ui("description",s),ui("robots",a.robots||"index,follow"),Zf(a,t,n,s,a.type),qc(e.slug||e.meta?.slug||"")}function xs(){try{for(const e of['meta[name="site"]','meta[name="site-name"]','meta[name="siteName"]','meta[property="og:site_name"]','meta[name="twitter:site"]']){const t=document.querySelector(e);if(t){const n=t.getAttribute("content")||"";if(n?.trim())return n.trim()}}}catch(e){x("[seoManager] getSiteNameFromMeta failed",e)}return""}function oo(e,t,n,r,i,a=""){try{let h=function(v){try{const I=oe(v);try{return(location.origin+location.pathname).split("?")[0]+"?page="+encodeURIComponent(I)}catch{return location.href.split("#")[0]}}catch{return location.href.split("#")[0]}},m=function(v,I){try{const N=String(I?.type||"").trim();if(N)return N;const z=String(v||"").replace(/^\/+|\/+$/g,"").toLowerCase();if(!z||z==="index"||z==="home")return"WebPage";const W=z.split("/"),q=W[0]||"",ae=W[W.length-1]||"",G={about:"AboutPage",contact:"ContactPage",blog:"Blog",posts:"Blog",article:"Article",articles:"Article",news:"NewsArticle",product:"Product",products:"Product",event:"Event",events:"Event",person:"ProfilePage",people:"ProfilePage",author:"ProfilePage",authors:"ProfilePage",search:"SearchResultsPage",faq:"FAQPage",faqs:"FAQPage",help:"WebPage",support:"WebPage",docs:"TechArticle",documentation:"TechArticle",tutorial:"TechArticle",howto:"HowTo","how-to":"HowTo",recipe:"Recipe",recipes:"Recipe",review:"Review",reviews:"Review",video:"VideoObject",videos:"VideoObject",audio:"AudioObject",podcast:"PodcastEpisode"};return W.length===1&&G[q]?G[q]:G[ae]?G[ae]:"Article"}catch{return"Article"}};var o=h,s=m;const l=e.meta||{},c=n&&String(n).trim()?n:l.title||a||document.title,f=i&&String(i).trim()?i:l.description||document.querySelector('meta[name="description"]')?.getAttribute("content")||"",u=r||l.image||null,p=h(t);p&&Bc("canonical",p);try{xt("property","og:url",p)}catch(v){x("[seoManager] upsertMeta og:url failed",v)}const y=m(t,l),g=p?`${p}#webpage`:`${location.href}#webpage`,d=xs()||a||"",_={"@context":"https://schema.org","@type":y,"@id":g,headline:c||"",description:f||"",url:p||location.href.split("#")[0]};try{const v=l.inLanguage||document.documentElement.lang;v&&(_.inLanguage=String(v)),d&&(_.isPartOf={"@type":"WebSite","@id":`${location.origin}#website`,name:d,url:location.origin})}catch{}u&&(_.image=String(u)),l.date&&(_.datePublished=l.date),l.dateModified&&(_.dateModified=l.dateModified),l.author&&(_.author={"@type":"Person",name:String(l.author)});try{let v="";l.publisher&&(v=typeof l.publisher=="string"?String(l.publisher).trim():l.publisher?.name?String(l.publisher.name).trim():""),v||(v=xs()),v&&(_.publisher={"@type":"Organization","@id":`${location.origin}#organization`,name:v})}catch{}if(p&&(_.mainEntityOfPage={"@type":"WebPage","@id":g}),Array.isArray(l.breadcrumbs)&&l.breadcrumbs.length){const v=l.breadcrumbs.filter(I=>I&&I.name).map((I,N)=>({"@type":"ListItem",position:N+1,name:String(I.name),...I.url?{item:String(I.url)}:{}}));v.length&&(_.breadcrumb={"@type":"BreadcrumbList",itemListElement:v})}const w="nimbi-jsonld";let k=document.getElementById(w);k||(k=document.createElement("script"),k.type="application/ld+json",k.id=w,Ws(k),document.head.appendChild(k)),k.textContent=JSON.stringify(_,null,2).replace(/<\/script>/gi,"<\\/script>")}catch(l){x("[seoManager] setStructuredData failed",l)}}var ha=typeof window<"u"&&window.__SEO_MAP?window.__SEO_MAP:{};function Yf(e){try{if(!e||typeof e!="object"){ha={};return}ha=Object.assign({},e)}catch(t){x("[seoManager] setSeoMap failed",t)}}function Qf(e,t=""){try{if(!e)return;const n=typeof window<"u"?window.__nimbiRuntimeManifest:null;n&&Number.isInteger(n.generation)&&document.documentElement?.setAttribute("data-nimbi-generation",String(n.generation));const r=ha?.[e]?ha[e]:typeof window<"u"&&window.__SEO_MAP?.[e]?window.__SEO_MAP[e]:null;try{const i=location.origin+location.pathname+"?page="+encodeURIComponent(String(e??""));Bc("canonical",i);try{xt("property","og:url",i)}catch{}}catch{}if(!r)return;try{r.title&&(document.title=String(r.title))}catch{}try{r.description&&ui("description",String(r.description))}catch{}try{try{so({meta:r,slug:e},r.title||void 0,r.image||void 0,r.description||void 0,t)}catch{}}catch{}try{qc(e)}catch{}try{oo({meta:r},e,r.title||void 0,r.image||void 0,r.description||void 0,t)}catch(i){x("[seoManager] inject structured data failed",i)}}catch(n){x("[seoManager] injectSeoForPage failed",n)}}function ea(e={},t="",n=void 0,r=void 0){try{const i=e||{},a=typeof n=="string"&&n.trim()?n:i.title||"Not Found",o=typeof r=="string"&&r.trim()?r:i.description||"";try{ui("robots","noindex,follow")}catch{}try{o&&String(o).trim()&&ui("description",String(o))}catch{}try{so({meta:Object.assign({},i,{robots:"noindex,follow"})},a,i.image||void 0,o)}catch{}try{oo({meta:Object.assign({},i,{title:a,description:o})},t||"",a,i.image||void 0,o)}catch{}}catch(i){x("[seoManager] markNotFound failed",i)}}function Xf(e,t,n,r,i,a,o,s,l,c,f){try{if(r?.querySelector){const u=r.querySelector(".menu-label");u&&(u.textContent=s?.textContent||e("onThisPage"))}}catch(u){x("[seoManager] update toc label failed",u)}try{const u=n.meta?.title?String(n.meta.title).trim():"",h=i?.querySelector?.("img")||null,p=h&&(h.getAttribute("src")||h.src)||null;let m="";try{let d="";try{const _=s||i?.querySelector?.("h1")||null;if(_){let w=_.nextElementSibling;const k=[];for(;w&&!(w.tagName&&w.tagName.toLowerCase()==="h2");){try{if(w.classList?.contains("nimbi-article-subtitle")){w=w.nextElementSibling;continue}}catch{}const v=(w.textContent||"").trim();v&&k.push(v),w=w.nextElementSibling}k.length&&(d=k.join(" ").replace(/\s+/g," ").trim()),!d&&l&&(d=String(l).trim())}}catch(_){x("[seoManager] compute descOverride failed",_)}d&&String(d).length>160&&(d=String(d).slice(0,157).trim()+"..."),m=d}catch(d){x("[seoManager] compute descOverride failed",d)}let y="";try{u&&(y=u)}catch{}if(!y)try{s?.textContent&&(y=String(s.textContent).trim())}catch{}if(!y)try{const d=i.querySelector("h2");d?.textContent&&(y=String(d.textContent).trim())}catch{}y||(y=a||"");try{so(n,y||void 0,p,m)}catch(d){x("[seoManager] setMetaTags failed",d)}try{oo(n,c,y||void 0,p,m,t)}catch(d){x("[seoManager] setStructuredData failed",d)}const g=xs();y?g?document.title=`${g} - ${y}`:document.title=`${t||"Site"} - ${y}`:u?document.title=u:document.title=t||document.title}catch(u){x("[seoManager] applyPageMeta failed",u)}try{try{i.querySelectorAll(".nimbi-reading-time")?.forEach(u=>u.remove())}catch{}if(l){const u=Vf(f?.raw||""),h=u?.readingTime?u.readingTime:null,p=typeof h?.minutes=="number"?Math.ceil(h.minutes):0,m=p?e("readingTime",{minutes:p}):"";if(!m)return;const y=i.querySelector("h1");if(y){const g=i.querySelector(".nimbi-article-subtitle");try{if(g){const d=document.createElement("span");d.className="nimbi-reading-time",d.textContent=m,g.appendChild(d)}else{const d=document.createElement("p");d.className="nimbi-article-subtitle is-6 has-text-grey-light";const _=document.createElement("span");_.className="nimbi-reading-time",_.textContent=m,d.appendChild(_);try{y.parentElement.insertBefore(d,y.nextSibling)}catch{try{y.insertAdjacentElement("afterend",d)}catch{}}}}catch{try{const _=document.createElement("p");_.className="nimbi-article-subtitle is-6 has-text-grey-light";const w=document.createElement("span");w.className="nimbi-reading-time",w.textContent=m,_.appendChild(w),y.insertAdjacentElement("afterend",_)}catch{}}}}}catch(u){x("[seoManager] reading time update failed",u)}}var ua=100;function ol(e){ua=e,Vc()}function zt(){try{if(tc(2))return!0}catch{}try{return!1}catch{return!1}}var Bt=3e5,Kf=6e4,Mn=null,Or=null;function Ft(e,t,n){try{if(typeof Ke=="function"&&typeof Ke.length=="number"&&Ke.length>=3)return Ke(e,t,{signal:n})}catch{}return Ke(e,t)}function ll(e){Bt=e;try{Vt.defaultTTL=Bt>0?Bt:1/0}catch{}Jf()}function Jf(){try{Mn!==null&&(clearInterval(Mn),Mn=null)}catch{}if(Bt>0)try{Mn=setInterval(nd,Kf)}catch{Mn=null}}var Vt=new vr({maxEntries:ua,defaultTTL:Bt>0?Bt:1/0});function Hc(e){return!!e&&typeof e=="object"&&Object.prototype.hasOwnProperty.call(e,"value")&&Object.prototype.hasOwnProperty.call(e,"ts")}function Vc(){try{Vt.maxEntries=ua}catch{}for(;Vt.size>ua;){const e=Vt.keys("LRU").next().value;if(e===void 0)break;Vt.delete(e)}}function cl(){wt.clear();try{Hu(!1)}catch(e){x("[router] _clearIndexCache: refreshIndexPaths reset failed",e)}}function ed(e){const t=Vt.get(e);if(t!==void 0){if(Hc(t)){const n=Date.now();if(Bt>0&&t.ts+Bt<n){Vt.delete(e);return}return t.value}return t}}function td(e,t){Vt.set(e,t,{ttl:Bt>0?Bt:1/0}),Vc()}function nd(){if(!Bt||Bt<=0)return;const e=Date.now(),t=Array.from(Vt.keys("LRU"));for(const n of t){Vt.has(n);const r=Vt.peek(n);Hc(r)&&r.ts+Bt<e&&Vt.delete(n)}}function hl(){Mn!==null&&(clearInterval(Mn),Mn=null)}async function rd(e,t,n){const r=new Set(wt);let i=[];try{if(typeof document<"u"&&document.getElementsByClassName){const a=o=>{const s=document.getElementsByClassName(o);for(let l=0;l<s.length;l++){const c=s[l].getElementsByTagName("a");for(let f=0;f<c.length;f++)i.push(c[f])}};a("nimbi-site-navbar"),a("navbar"),a("nimbi-nav")}else i=Array.from(document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a"))}catch{try{i=Array.from(document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a"))}catch{i=[]}}for(const a of Array.from(i||[])){const o=a.getAttribute("href")||"";if(o)try{try{const h=dt(o);if(h){if(h.type==="canonical"&&h.page){const p=oe(h.page);if(p){r.add(p);continue}}if(h.type==="cosmetic"&&h.page){const p=h.page;if(ne.has(p)){const m=ne.get(p);if(m)return m}continue}}}catch{}const s=new URL(o,location.href);if(s.origin!==location.origin)continue;const l=(s.hash||s.pathname).match(/([^#?]+\.md)(?:$|[?#])/)||(s.pathname||"").match(/([^#?]+\.md)(?:$|[?#])/);if(l){let h=oe(l[1]);h&&r.add(h);continue}const c=(a.textContent||"").trim(),f=(s.pathname||"").replace(/^.*\//,"");if(c&&be(c)===e||f&&be(f.replace(/\.(html?|md)$/i,""))===e)return s.toString();if(/\.(html?)$/i.test(s.pathname)){let h=s.pathname.replace(/^\//,"");r.add(h);continue}const u=s.pathname||"";if(u){const h=new URL(t),p=On(h.pathname);if(u.indexOf(p)!==-1){let m=u.startsWith(p)?u.slice(p.length):u;m=oe(m),m&&r.add(m)}}}catch(s){x("[router] malformed URL while discovering index candidates",s)}}for(const a of r)try{if(!a||!String(a).includes(".md"))continue;const o=await Ft(a,t,n);if(!o||!o.raw)continue;const s=(o.raw||"").match(/^#\s+(.+)$/m);if(s){const l=(s[1]||"").trim();if(l&&be(l)===e)return a}}catch(o){x("[router] fetchMarkdown during index discovery failed",o)}return null}function id(e){const t=[];if(String(e).includes(".md")||String(e).includes(".html"))/index\.html$/i.test(e)||t.push(e);else try{const n=decodeURIComponent(String(e??""));if(ne.has(n)){const r=wr(n)||ne.get(n);r&&(/\.(md|html?)$/i.test(r)?/index\.html$/i.test(r)||t.push(r):(t.push(r),t.push(r+".html")))}else{if(wt&&wt.size)for(const r of wt){const i=r.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(be(i)===n&&!/index\.html$/i.test(r)){t.push(r);break}}!t.length&&n&&!/\.(md|html?)$/i.test(n)&&(t.push(n+".html"),t.push(n+".md"))}}catch(n){x("[router] buildPageCandidates failed during slug handling",n)}return t}async function ad(e,t){const n=e||"";try{try{yr("fetchPageData")}catch{}}catch{}try{if(Or&&typeof Or.abort=="function")try{Or.abort()}catch{}}catch{}Or=typeof AbortController<"u"?new AbortController:null;const r=Or;let i=null;try{const w=dt(typeof location<"u"?location.href:"");w?.anchor&&(i=w.anchor)}catch{try{i=location?.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null}catch{i=null}}let a=e||"";try{(!a||String(a).trim()==="")&&typeof Mt=="string"&&Mt&&(a=String(Mt))}catch{}let o=null,s=null;const l=String(n??"").includes(".md")||String(n??"").includes(".html");if(a&&String(a).includes("::")){const w=String(a).split("::",2);a=w[0],o=w[1]||null}const c=typeof Uu<"u"&&Lt?Lt:"";let f=String(t??"");try{f=new URL(f,typeof location<"u"?location.href:"http://localhost/").href}catch{}const u=`${e}|||${c}|||${f}`,h=ed(u);if(h)a=h.resolved,o=h.anchor||o;else{if(!String(a).includes(".md")&&!String(a).includes(".html")){let w=decodeURIComponent(String(a??""));if(w&&typeof w=="string"&&(w=oe(w),w=Jn(w)),ne.has(w))a=wr(w)||ne.get(w);else{let k=await rd(w,t,r?r.signal:void 0);if(k)a=k;else if(Qi()&&wt&&wt.size||typeof t=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(t)){const v=await jc(w,t);v&&(a=v)}}}td(u,{resolved:a,anchor:o})}let p=!0;try{const w=String(a??"").includes(".md")||String(a??"").includes(".html")||a&&(a.startsWith("http://")||a.startsWith("https://")||a.startsWith("/"));p=typeof xe=="string"&&xe||ne.has(a)||wt&&wt.size||Qi()||l||w}catch{p=!0}!o&&i&&(o=i);try{if(p&&a&&(a.startsWith("http://")||a.startsWith("https://")||a.startsWith("/"))){const w=a.startsWith("/")?new URL(a,location.origin).toString():a;try{const k=await fetch(w,r?{signal:r.signal}:void 0);if(k&&k.ok){const v=await k.text(),I=typeof k?.headers?.get=="function"&&k.headers.get("content-type")||"",N=(v||"").toLowerCase();if(I&&I.indexOf&&I.indexOf("text/html")!==-1||N.indexOf("<!doctype")!==-1||N.indexOf("<html")!==-1){if(!l)try{let z=w;try{z=new URL(w).pathname.replace(/^\//,"")}catch{z=String(w??"").replace(/^\//,"")}const W=z.replace(/\.html$/i,".md");try{const q=await Ft(W,t,r?r.signal:void 0);if(q?.raw)return{data:q,pagePath:W,anchor:o}}catch{}if(typeof xe=="string"&&xe)try{const q=await Ft(xe,t,r?r.signal:void 0);if(q&&q.raw){try{ea(q.meta||{},xe)}catch{}return{data:q,pagePath:xe,anchor:o}}}catch{}try{s=new Error("site shell detected (absolute fetch)")}catch{}}catch{}if(N.indexOf('<div id="app"')!==-1||N.indexOf("nimbi-cms")!==-1||N.indexOf("nimbi-mount")!==-1||N.indexOf("nimbi-")!==-1||N.indexOf("initcms(")!==-1||N.indexOf("window.nimbi")!==-1||/\bnimbi\b/.test(N))try{let z=w;try{z=new URL(w).pathname.replace(/^\//,"")}catch{z=String(w??"").replace(/^\//,"")}const W=z.replace(/\.html$/i,".md");try{const q=await Ft(W,t,r?r.signal:void 0);if(q?.raw)return{data:q,pagePath:W,anchor:o}}catch{}if(typeof xe=="string"&&xe)try{const q=await Ft(xe,t,r?r.signal:void 0);if(q&&q.raw){try{ea(q.meta||{},xe)}catch{}return{data:q,pagePath:xe,anchor:o}}}catch{}try{s=new Error("site shell detected (absolute fetch)")}catch{}}catch{}}}}catch{}}}catch{}const m=id(a);try{if(zt())try{ue("[router-debug] fetchPageData candidates",{originalRaw:n,resolved:a,pageCandidates:m})}catch{}}catch{}const y=String(n??"").includes(".md")||String(n??"").includes(".html");let g=null;if(!y)try{let w=decodeURIComponent(String(n??""));w=oe(w),w=Jn(w),w&&!/\.(md|html?)$/i.test(w)&&(g=w)}catch{g=null}if(y&&m.length===0&&(String(a).includes(".md")||String(a).includes(".html"))&&m.push(a),m.length===0&&(String(a).includes(".md")||String(a).includes(".html"))&&m.push(a),m.length===1&&/index\.html$/i.test(m[0])&&!y&&!ne.has(a)&&!ne.has(decodeURIComponent(String(a??"")))&&!String(a??"").includes("/"))throw new Error("Unknown slug: index.html fallback prevented");let d=null,_=null;try{const w=String(a??"").includes(".md")||String(a??"").includes(".html")||a&&(a.startsWith("http://")||a.startsWith("https://")||a.startsWith("/"));p=typeof xe=="string"&&xe||ne.has(a)||wt&&wt.size||Qi()||y||w}catch{p=!0}if(!p)s=new Error("no page data");else for(const w of m)if(w)try{const k=oe(w);if(d=await Ft(k,t,r?r.signal:void 0),_=k,g&&!ne.has(g))try{let v="";if(d&&d.isHtml)try{const I=ot();if(I){const N=I.parseFromString(d.raw||"","text/html"),z=N.querySelector("h1")||N.querySelector("title");z&&z.textContent&&(v=z.textContent.trim())}}catch{}else{const I=(d&&d.raw||"").match(/^#\s+(.+)$/m);I&&I[1]&&(v=I[1].trim())}if(v&&be(v)!==g)try{if(/\.html$/i.test(k)){const I=k.replace(/\.html$/i,".md");if(new Set(m).has(I))try{const N=await Ft(I,t,r?r.signal:void 0);if(N?.raw)d=N,_=I;else if(typeof xe=="string"&&xe)try{const z=await Ft(xe,t,r?r.signal:void 0);if(z&&z.raw)d=z,_=xe;else{d=null,_=null,s=new Error("slug mismatch for candidate");continue}}catch{d=null,_=null,s=new Error("slug mismatch for candidate");continue}else{d=null,_=null,s=new Error("slug mismatch for candidate");continue}}catch{try{const z=await Ft(xe,t,r?r.signal:void 0);if(z&&z.raw)d=z,_=xe;else{d=null,_=null,s=new Error("slug mismatch for candidate");continue}}catch{d=null,_=null,s=new Error("slug mismatch for candidate");continue}}else{d=null,_=null,s=new Error("slug mismatch for candidate");continue}}else{d=null,_=null,s=new Error("slug mismatch for candidate");continue}}catch{d=null,_=null,s=new Error("slug mismatch for candidate");continue}}catch{}try{if(!y&&/\.html$/i.test(k)){const v=k.replace(/\.html$/i,".md");if(new Set(m).has(v))try{const I=String(d&&d.raw||"").trim().slice(0,128).toLowerCase();if(d&&d.isHtml||/^(?:<!doctype|<html|<title|<h1)/i.test(I)||I.indexOf('<div id="app"')!==-1||I.indexOf("nimbi-")!==-1||I.indexOf("nimbi")!==-1||I.indexOf("initcms(")!==-1){let N=!1;try{const z=await Ft(v,t,r?r.signal:void 0);if(z?.raw)d=z,_=v,N=!0;else if(typeof xe=="string"&&xe)try{const W=await Ft(xe,t,r?r.signal:void 0);W&&W.raw&&(d=W,_=xe,N=!0)}catch{}}catch{try{const W=await Ft(xe,t,r?r.signal:void 0);W&&W.raw&&(d=W,_=xe,N=!0)}catch{}}if(!N){d=null,_=null,s=new Error("site shell detected (candidate HTML rejected)");continue}}}catch{}}}catch{}try{if(zt())try{ue("[router-debug] fetchPageData accepted candidate",{candidate:k,pagePath:_,isHtml:d&&d.isHtml,snippet:d&&d.raw?String(d.raw).slice(0,160):null})}catch{}}catch{}break}catch(k){s=k;try{zt()&&x("[router] candidate fetch failed",{candidate:w,contentBase:t,err:k&&k.message||k})}catch{}}if(!d){const w=s&&(s.message||String(s))||null,k=w&&/failed to fetch md|site shell detected/i.test(w);try{if(zt())try{ue("[router-debug] fetchPageData no data",{originalRaw:n,resolved:a,pageCandidates:m,fetchError:w})}catch{}}catch{}if(k)try{if(zt())try{x("[router] fetchPageData: no page data (expected)",{originalRaw:n,resolved:a,pageCandidates:m,contentBase:t,fetchError:w})}catch{}}catch{}else try{if(zt())try{Gr("[router] fetchPageData: no page data for",{originalRaw:n,resolved:a,pageCandidates:m,contentBase:t,fetchError:w})}catch{}}catch{}if(typeof xe=="string"&&xe)try{const v=await Ft(xe,t,r?r.signal:void 0);if(v&&v.raw){try{ea(v.meta||{},xe)}catch{}return{data:v,pagePath:xe,anchor:o}}}catch{}try{if(y&&String(n??"").toLowerCase().includes(".html"))try{const v=new URL(String(n??""),location.href).toString();zt()&&x("[router] attempting absolute HTML fetch fallback",v);const I=await fetch(v,r?{signal:r.signal}:void 0);if(I&&I.ok){const N=await I.text(),z=I&&I.headers&&typeof I.headers.get=="function"&&I.headers.get("content-type")||"",W=(N||"").toLowerCase(),q=z&&z.indexOf&&z.indexOf("text/html")!==-1||W.indexOf("<!doctype")!==-1||W.indexOf("<html")!==-1;if(!q&&zt())try{x("[router] absolute fetch returned non-HTML",()=>({abs:v,contentType:z,snippet:W.slice(0,200)}))}catch{}if(q){const ae=(N||"").toLowerCase();if(/<title>\s*index of\b/i.test(N)||/<h1>\s*index of\b/i.test(N)||ae.indexOf("parent directory")!==-1||/<title>\s*directory listing/i.test(N)||/<h1>\s*directory listing/i.test(N))try{zt()&&x("[router] absolute fetch returned directory listing; treating as not found",{abs:v})}catch{}else try{const G=v,ke=new URL(".",G).toString();try{const B=ot();if(B){const E=B.parseFromString(N||"","text/html"),A=(K,de)=>{try{const ye=de.getAttribute(K)||"";if(!ye||/^(https?:)?\/\//i.test(ye)||ye.startsWith("/")||ye.startsWith("#"))return;try{const Q=new URL(ye,G).toString();de.setAttribute(K,Q)}catch(Q){x("[router] rewrite attribute failed",K,Q)}}catch(ye){x("[router] rewrite helper failed",ye)}},C=E.querySelectorAll("[src],[href],[srcset],[poster]"),M=[];for(const K of Array.from(C||[]))try{const de=K.tagName?K.tagName.toLowerCase():"";if(de==="a")continue;if(K.hasAttribute("src")){const ye=K.getAttribute("src");A("src",K);const Q=K.getAttribute("src");ye!==Q&&M.push({attr:"src",tag:de,before:ye,after:Q})}if(K.hasAttribute("href")&&de==="link"){const ye=K.getAttribute("href");A("href",K);const Q=K.getAttribute("href");ye!==Q&&M.push({attr:"href",tag:de,before:ye,after:Q})}if(K.hasAttribute("href")&&de!=="link"){const ye=K.getAttribute("href");A("href",K);const Q=K.getAttribute("href");ye!==Q&&M.push({attr:"href",tag:de,before:ye,after:Q})}if(K.hasAttribute("xlink:href")){const ye=K.getAttribute("xlink:href");A("xlink:href",K);const Q=K.getAttribute("xlink:href");ye!==Q&&M.push({attr:"xlink:href",tag:de,before:ye,after:Q})}if(K.hasAttribute("poster")){const ye=K.getAttribute("poster");A("poster",K);const Q=K.getAttribute("poster");ye!==Q&&M.push({attr:"poster",tag:de,before:ye,after:Q})}if(K.hasAttribute("srcset")){const ye=(K.getAttribute("srcset")||"").split(",").map(Q=>Q.trim()).filter(Boolean).map(Q=>{const[Be,Fe]=Q.split(/\s+/,2);if(!Be||/^(https?:)?\/\//i.test(Be)||Be.startsWith("/"))return Q;try{const Se=new URL(Be,G).toString();return Fe?`${Se} ${Fe}`:Se}catch{return Q}}).join(", ");K.setAttribute("srcset",ye)}}catch{}const se=E.documentElement&&E.documentElement.outerHTML?E.documentElement.outerHTML:N;try{zt()&&M&&M.length&&x("[router] rewritten asset refs",{abs:v,rewritten:M})}catch{}return{data:{raw:se,isHtml:!0},pagePath:String(n??""),anchor:o}}}catch{}let Y=N;try{let B=String(N??"");B=B.replace(/srcset\s*=\s*"([^"]*)"/gi,(E,A)=>`srcset="${String(A??"").split(",").map(C=>C.trim()).filter(Boolean).map(C=>{const[M,se]=C.split(/\s+/,2);if(!M||/^(https?:)?\/\//i.test(M)||M.startsWith("/")||M.startsWith("#"))return C;try{const K=new URL(M,G).toString();return se?`${K} ${se}`:K}catch{return C}}).join(", ")}"`),B=B.replace(/<(?!a\b)([^>]*?)\bhref\s*=\s*"([^"]*)"/gi,(E,A,C)=>{if(!C||/^(https?:)?\/\//i.test(C)||C.startsWith("/")||C.startsWith("#"))return E;try{const M=new URL(C,G).toString();return E.replace(`href="${C}"`,`href="${M}"`)}catch{return E}}),B=B.replace(/\bsrc\s*=\s*"([^"]*)"/gi,(E,A)=>{if(!A||/^(https?:)?\/\//i.test(A)||A.startsWith("/")||A.startsWith("#"))return E;try{return`src="${new URL(A,G).toString()}"`}catch{return E}}),B=B.replace(/\bxlink:href\s*=\s*"([^"]*)"/gi,(E,A)=>{if(!A||/^(https?:)?\/\//i.test(A)||A.startsWith("/")||A.startsWith("#"))return E;try{return`xlink:href="${new URL(A,G).toString()}"`}catch{return E}}),B=B.replace(/\bposter\s*=\s*"([^"]*)"/gi,(E,A)=>{if(!A||/^(https?:)?\/\//i.test(A)||A.startsWith("/")||A.startsWith("#"))return E;try{return`poster="${new URL(A,G).toString()}"`}catch{return E}}),Y=B}catch{Y=N}return/<base\s+[^>]*>/i.test(Y)||(/<head[^>]*>/i.test(Y)?Y=Y.replace(/(<head[^>]*>)/i,`$1<base href="${ke}">`):Y=`<base href="${ke}">`+Y),{data:{raw:Y,isHtml:!0},pagePath:String(n??""),anchor:o}}catch{return{data:{raw:N,isHtml:!0},pagePath:String(n??""),anchor:o}}}}}catch(v){zt()&&x("[router] absolute HTML fetch fallback failed",v)}}catch{}try{const v=decodeURIComponent(String(a??""));if(v&&!/\.(md|html?)$/i.test(v)&&typeof xe=="string"&&xe&&zt()){const I=[`/assets/${v}.html`,`/assets/${v}/index.html`];for(const N of I)try{const z=await fetch(N,Object.assign({method:"GET"},r?{signal:r.signal}:{}));if(z&&z.ok)return{data:{raw:await z.text(),isHtml:!0},pagePath:N.replace(/^\//,""),anchor:o}}catch{}}}catch(v){zt()&&x("[router] assets fallback failed",v)}throw new Error("no page data")}return{data:d,pagePath:_,anchor:o}}function lo(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var tr=lo();function Gc(e){tr=e}var Yn={exec:()=>null};function lr(e){let t=[];return n=>{let r=Math.max(0,Math.min(3,n-1)),i=t[r];return i||(i=e(r),t[r]=i),i}}function Pe(e,t=""){let n=typeof e=="string"?e:e.source,r={replace:(i,a)=>{let o=typeof a=="string"?a:a.source;return o=o.replace(bt.caret,"$1"),n=n.replace(i,o),r},getRegex:()=>new RegExp(n,t)};return r}var sd=((e="")=>{try{return!!new RegExp("(?<=1)(?<!1)"+e)}catch{return!1}})(),bt={codeRemoveIndent:/^(?: {0,3}\t| {1,4})/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,endingSpaceTabChar:/[ \t]$/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,leadingSpaceTab:/^[ \t]+/,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,numericCharacterReference:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/g,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:lr(e=>new RegExp(`^ {0,${e}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),hrRegex:lr(e=>new RegExp(`^ {0,${e}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)),fencesBeginRegex:lr(e=>new RegExp(`^ {0,${e}}(?:\`\`\`|~~~)`)),headingBeginRegex:lr(e=>new RegExp(`^ {0,${e}}#`)),htmlBeginRegex:lr(e=>new RegExp(`^ {0,${e}}(?:</?(?:${xi})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))`,"i")),blockquoteBeginRegex:lr(e=>new RegExp(`^ {0,${e}}>`))},od=/^(?:[ \t]*(?:\n|$))+/,ld=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,cd=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,ki=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,hd=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,co=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Zc=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Yc=Pe(Zc).replace(/bull/g,co).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),ud=Pe(Zc).replace(/bull/g,co).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),ho=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/,fd=/^[^\n]+/,uo=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,dd=Pe(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",uo).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),pd=Pe(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,co).getRegex(),xi="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",fo=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,md=Pe("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",fo).replace("tag",xi).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Qc=e=>Pe(ho).replace("hr",ki).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list",e).replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",xi).getRegex(),gd=Qc(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/),yd=Qc(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/),po={blockquote:Pe(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",yd).getRegex(),code:ld,def:dd,fences:cd,heading:hd,hr:ki,html:md,lheading:Yc,list:pd,newline:od,paragraph:gd,table:Yn,text:fd},ul=Pe("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",ki).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",xi).getRegex(),_d={...po,lheading:ud,table:ul,paragraph:Pe(ho).replace("hr",ki).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",ul).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",xi).getRegex()},wd={...po,html:Pe(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",fo).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Yn,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:Pe(ho).replace("hr",ki).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Yc).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},bd=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,vd=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Xc=/^( {2,}|\\)\n(?!\s*$)[ \t]*/,kd=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,mn=/[\p{P}\p{S}]/u,Sr=/[\s\p{P}\p{S}]/u,Si=/[^\s\p{P}\p{S}]/u,xd=Pe(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Sr).getRegex(),Sd=/[\p{Pi}\p{Ps}"']/u,Kc=/(?!~)[\p{P}\p{S}]/u,Ed=/(?!~)[\s\p{P}\p{S}]/u,Ad=/(?:[^\s\p{P}\p{S}]|~)/u,Td=Pe(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",sd?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Jc=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,Md=Pe(Jc,"u").replace(/punct/g,mn).getRegex(),Cd=Pe(Jc,"u").replace(/punct/g,Kc).getRegex(),Rd=Pe(/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/,"u").replace(/openQuote/g,Sd).replace(/punct/g,mn).getRegex(),eh="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Pd=Pe(eh,"gu").replace(/notPunctSpace/g,Si).replace(/punctSpace/g,Sr).replace(/punct/g,mn).getRegex(),Ld=Pe(eh,"gu").replace(/notPunctSpace/g,Ad).replace(/punctSpace/g,Ed).replace(/punct/g,Kc).getRegex(),Nd=Pe("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)","gu").replace(/notPunctSpace/g,Si).replace(/punctSpace/g,Sr).replace(/punct/g,mn).getRegex(),Id=Pe("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Si).replace(/punctSpace/g,Sr).replace(/punct/g,mn).getRegex(),Od=Pe("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)","gu").replace(/notPunctSpace/g,Si).replace(/punctSpace/g,Sr).replace(/punct/g,mn).getRegex(),zd=Pe(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,mn).getRegex(),$d=Pe("^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)","gu").replace(/notPunctSpace/g,Si).replace(/punctSpace/g,Sr).replace(/punct/g,mn).getRegex(),Fd=Pe(/\\(punct)/,"gu").replace(/punct/g,mn).getRegex(),Dd=Pe(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Ud=Pe(fo).replace("(?:-->|$)","-->").getRegex(),jd=Pe("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Ud).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),th=/\[(?:\\[\s\S]|[^\[\]\\])*\]/,fa=Pe(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets",th).getRegex(),Bd=Pe(/^!?\[(label)\]\([ \t\n]*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?[ \t\n]*\)/).replace("label",fa).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Wd=Pe(/^!?\[(label)\]\[(ref)\]/).replace("label",fa).replace("ref",uo).getRegex(),qd=Pe(/^!?\[(ref)\](?:\[\])?/).replace("ref",uo).getRegex(),fl=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/,Hd=Pe(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets",th).getRegex(),Vd=Pe("reflink|nolink(?!\\()","g").replace("reflink",Pe(/^!?\[(label)\]\[(ref)\]/).replace("label",Hd).replace("ref",fl).getRegex()).replace("nolink",Pe(/^!?\[(ref)\](?:\[\])?/).replace("ref",fl).getRegex()).getRegex(),dl=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Gd=Pe(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g,/[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),mo={_backpedal:Yn,anyPunctuation:Fd,autolink:Dd,blockSkip:Td,br:Xc,code:vd,del:Yn,delLDelim:Yn,delRDelim:Yn,emStrongLDelim:Md,emStrongRDelimAst:Pd,emStrongRDelimUnd:Id,escape:bd,link:Bd,nolink:qd,punctuation:xd,reflink:Wd,reflinkSearch:Vd,tag:jd,text:kd,url:Yn},Zd={...mo,emStrongLDelim:Rd,emStrongRDelimAst:Nd,emStrongRDelimUnd:Od,link:Pe(/^!?\[(label)\]\((.*?)\)/).replace("label",fa).getRegex(),reflink:Pe(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",fa).getRegex()},Ss={...mo,emStrongRDelimAst:Ld,emStrongLDelim:Cd,delLDelim:zd,delRDelim:$d,url:Pe(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol",Gd).replace("protocol",dl).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:Pe(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol",dl).replace(/emailProtocol/g,/(?:mailto|xmpp):/).getRegex()},Yd={...Ss,br:Pe(Xc).replace("{2,}","*").getRegex(),text:Pe(Ss.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Hi={normal:po,gfm:_d,pedantic:wd},zr={normal:mo,gfm:Ss,breaks:Yd,pedantic:Zd},Qd={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},pl=e=>Qd[e];function Dt(e,t){if(t){if(bt.escapeTest.test(e))return e.replace(bt.escapeReplace,pl)}else if(bt.escapeTestNoEncode.test(e))return e.replace(bt.escapeReplaceNoEncode,pl);return e}function Xd(e){return e.replace(bt.numericCharacterReference,(t,n,r)=>{let i=n===void 0?Number.parseInt(r,16):Number.parseInt(n,10);return i===0||i>1114111||i>=55296&&i<=57343?"�":String.fromCodePoint(i)})}function ml(e){try{e=encodeURI(e).replace(bt.percentDecode,"%")}catch{return null}return e}function gl(e,t){let n=e.replace(bt.findPipe,(i,a,o)=>{let s=!1,l=a;for(;--l>=0&&o[l]==="\\";)s=!s;return s?"|":" |"}).split(bt.splitPipe),r=0;if(n[0].trim()||n.shift(),n.length>0&&!n.at(-1)?.trim()&&n.pop(),t)if(n.length>t)n.splice(t);else for(;n.length<t;)n.push("");for(;r<n.length;r++)n[r]=n[r].trim().replace(bt.slashPipe,"|");return n}function xn(e,t,n){let r=e.length;if(r===0)return"";let i=0;for(;i<r;){let a=e.charAt(r-i-1);if(a===t&&!n)i++;else if(a!==t&&n)i++;else break}return e.slice(0,r-i)}function yl(e){let t=e.split(`
`),n=t.length-1;for(;n>=0&&bt.blankLine.test(t[n]);)n--;return t.length-n<=2?e:t.slice(0,n+1).join(`
`)}function da(e){return e.trim().toLowerCase().toUpperCase().toLowerCase()}function _l(e,t){if(e.indexOf(t[0])===-1&&e.indexOf(t[1])===-1)return-1;let n=0;for(let r=0;r<e.length;r++)if(e[r]==="\\")r++;else if(e[r]===t[0])n++;else if(e[r]===t[1]&&(n--,n<0))return r;return n>0?-2:-1}function wl(e,t=0){let n=t,r="";for(let i of e)if(i==="	"){let a=4-n%4;r+=" ".repeat(a),n+=a}else r+=i,n++;return r}function bl(e,t,n,r,i){let a=t.href,o=t.title||null,s=e[1].replace(i.other.outputLinkReplace,"$1"),l=e[0].charAt(0)==="!";r.state.inLink=!0;let c=r.state.linkEmitted,f=r.state.inRawBlock;r.state.linkEmitted=!1;let u=r.inlineTokens(s),h=r.state.linkEmitted;if(r.state.linkEmitted=c,r.state.inLink=!1,!l){if(h){r.state.inRawBlock=f;return}r.state.linkEmitted=!0}return{type:l?"image":"link",raw:n,href:a,title:o,text:s,tokens:u}}function Kd(e,t,n){let r=e.match(n.other.indentCodeCompensation);if(r===null)return t;let i=r[1];return t.split(`
`).map(a=>{let o=a.match(n.other.beginningSpace);if(o===null)return a;let[s]=o;return a.slice(Math.min(s.length,i.length))}).join(`
`)}function vl(e,t,n,r){if(!t.includes("<"))return!1;for(let i=0;i<t.length;i++){if(t[i]==="\\"){i++;continue}if(t[i]==="`"){let s=r.inline.code.exec(t.slice(i));if(s){i+=s[0].length-1;continue}}if(t[i]!=="<")continue;let a=e.slice(n+i),o=r.inline.tag.exec(a)||r.inline.autolink.exec(a);if(o){if(o[0].length>t.length-i)return!0;i+=o[0].length-1}}return!1}var pa=class{options;rules;lexer;constructor(e){this.options=e||tr}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=this.options.pedantic?t[0]:yl(t[0]);return{type:"code",raw:n,codeBlockStyle:"indented",text:n.replace(this.rules.other.codeRemoveIndent,"")}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],r=Kd(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:r}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let r=xn(n,"#");(this.options.pedantic||!r||this.rules.other.endingSpaceTabChar.test(r))&&(n=r.trim())}return{type:"heading",raw:xn(t[0],`
`),depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:xn(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=xn(t[0],`
`).split(`
`),r="",i="",a=[];for(;n.length>0;){let o=!1,s=[],l=0;for(;l<n.length;l++)if(this.rules.other.blockquoteStart.test(n[l]))s.push(n[l]),o=!0;else if(!o)s.push(n[l]);else break;n=n.slice(l);let c=s.join(`
`),f=c.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");r=r?`${r}
${c}`:c,i=i?`${i}
${f}`:f;let u=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(f,a,!0),this.lexer.state.top=u,n.length===0)break;let h=a.at(-1);if(h?.type==="code")break;if(h?.type==="blockquote"){let p=h,m=n.join(`
`),y=p.raw+`
`+m.replace(this.rules.other.blockquoteSetextReplace2,""),g=this.blockquote(y);a[a.length-1]=g;let d=y.substring(g.raw.length).replace(/^\n/,""),_=d?d.split(`
`).length:0,w=_?n.slice(0,-_):n;w.length>0&&(r=`${r}
${w.join(`
`)}`),i=i.substring(0,i.length-p.text.length)+g.text;break}else if(h?.type==="list"){let p=h,m=p.raw+`
`+n.join(`
`),y=this.list(m);a[a.length-1]=y,r=r.substring(0,r.length-h.raw.length)+y.raw,i=i.substring(0,i.length-p.raw.length)+y.raw,n=m.substring(a.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:r,tokens:a,text:i}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),r=n.length>1,i={type:"list",raw:"",ordered:r,start:r?+n.slice(0,-1):"",loose:!1,items:[]};n=r?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=r?n:"[*+-]");let a=this.rules.other.listItemRegex(n),o=!1;for(;e;){let l=!1,c="",f="";if(!(t=a.exec(e))||this.rules.block.hr.test(e))break;c=t[0],e=e.substring(c.length);let u=t[2].split(`
`,1)[0],h=t[1].length,p=this.options.pedantic?wl(u,h):u.replace(this.rules.other.leadingSpaceTab,d=>wl(d,h)),m=e.split(`
`,1)[0],y=!p.trim(),g=0;if(this.options.pedantic?(g=2,f=p.trimStart()):y?g=h+1:(g=p.search(this.rules.other.nonSpaceChar),g=g>4?1:g,f=p.slice(g),g+=h),y&&this.rules.other.blankLine.test(m)&&(c+=m+`
`,e=e.substring(m.length+1),l=!0),!l){let d=this.rules.other.nextBulletRegex(g),_=this.rules.other.hrRegex(g),w=this.rules.other.fencesBeginRegex(g),k=this.rules.other.headingBeginRegex(g),v=this.rules.other.htmlBeginRegex(g),I=this.rules.other.blockquoteBeginRegex(g);for(;e;){let N=e.split(`
`,1)[0],z;if(m=N,this.options.pedantic?(m=m.replace(this.rules.other.listReplaceNesting,"  "),z=m):z=m.replace(this.rules.other.leadingSpaceTab,W=>W.replace(this.rules.other.tabCharGlobal,"    ")),w.test(m)||k.test(m)||v.test(m)||I.test(m)||d.test(m)||_.test(m))break;if(z.search(this.rules.other.nonSpaceChar)>=g||!m.trim())f+=`
`+z.slice(g);else{if(y||p.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||w.test(p)||k.test(p)||_.test(p))break;f+=`
`+m}y=!m.trim(),c+=N+`
`,e=e.substring(N.length+1),p=z.slice(g)}}i.loose||(o?i.loose=!0:this.rules.other.doubleBlankLine.test(c)&&(o=!0)),i.items.push({type:"list_item",raw:c,task:!!this.options.gfm&&this.rules.other.listIsTask.test(f),loose:!1,text:f,tokens:[]}),i.raw+=c}let s=i.items.at(-1);if(s)s.raw=s.raw.trimEnd(),s.text=s.text.trimEnd();else return;i.raw=i.raw.trimEnd();for(let l of i.items)if(this.lexer.state.top=!1,l.tokens=this.lexer.blockTokens(l.text,[]),!i.loose){let c=l.tokens.filter(f=>f.type==="space");i.loose=c.length>0&&c.some(f=>this.rules.other.anyLine.test(f.raw))}for(let l of i.items){let c=l.tokens[0];if(l.task&&(c?.type==="text"||c?.type==="paragraph")){l.text=l.text.replace(this.rules.other.listReplaceTask,""),c.raw=c.raw.replace(this.rules.other.listReplaceTask,""),c.text=c.text.replace(this.rules.other.listReplaceTask,"");for(let u=this.lexer.inlineQueue.length-1;u>=0;u--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[u].src)){this.lexer.inlineQueue[u].src=this.lexer.inlineQueue[u].src.replace(this.rules.other.listReplaceTask,"");break}let f=this.rules.other.listTaskCheckbox.exec(l.raw);if(f){let u={type:"checkbox",raw:f[0]+" ",checked:f[0]!=="[ ]"};l.checked=u.checked,i.loose?l.tokens[0]&&["paragraph","text"].includes(l.tokens[0].type)&&"tokens"in l.tokens[0]&&l.tokens[0].tokens?(l.tokens[0].raw=u.raw+l.tokens[0].raw,l.tokens[0].text=u.raw+l.tokens[0].text,l.tokens[0].tokens.unshift(u)):l.tokens.unshift({type:"paragraph",raw:u.raw,text:u.raw,tokens:[u]}):l.tokens.unshift(u)}}else l.task&&(l.task=!1)}if(i.loose)for(let l of i.items){l.loose=!0;for(let c of l.tokens)c.type==="text"&&(c.type="paragraph")}return i}}html(e){let t=this.rules.block.html.exec(e);if(t){let n=yl(t[0]);return{type:"html",block:!0,raw:n,pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:n}}}def(e){let t=this.rules.block.def.exec(e);if(t){if(!this.rules.other.startAngleBracket.test(t[2])&&_l(t[2],"()")!==-1)return;let n=da(t[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",i=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:xn(t[0],`
`),href:r,title:i}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=gl(t[1]),r=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),i=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],a={type:"table",raw:xn(t[0],`
`),header:[],align:[],rows:[]};if(n.length===r.length){for(let o of r)this.rules.other.tableAlignRight.test(o)?a.align.push("right"):this.rules.other.tableAlignCenter.test(o)?a.align.push("center"):this.rules.other.tableAlignLeft.test(o)?a.align.push("left"):a.align.push(null);for(let o=0;o<n.length;o++)a.header.push({text:n[o],tokens:this.lexer.inline(n[o]),header:!0,align:a.align[o]});for(let o of i)a.rows.push(gl(o,a.header.length).map((s,l)=>({text:s,tokens:this.lexer.inline(s),header:!1,align:a.align[l]})));return a}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t){let n=t[1].trim();return{type:"heading",raw:xn(t[0],`
`),depth:t[2].charAt(0)==="="?1:2,text:n,tokens:this.lexer.inline(n)}}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){if(this.lexer.state.linkParenPossible===!1)return;let t=this.rules.inline.link.exec(e);if(t){let n=t[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&vl(e,t[1],n,this.rules))return;let r=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(r)){if(!this.rules.other.endAngleBracket.test(r))return;let o=xn(r.slice(0,-1),"\\");if((r.length-o.length)%2===0)return}else{let o=_l(t[2],"()");if(o===-2)return;if(o>-1){let s=(t[0].indexOf("!")===0?5:4)+t[1].length+o;t[2]=t[2].substring(0,o),t[0]=t[0].substring(0,s).trim(),t[3]=""}}let i=t[2],a="";if(this.options.pedantic){let o=this.rules.other.pedanticHrefTitle.exec(i);o&&(i=o[1],a=o[3])}else a=t[3]?t[3].slice(1,-1):"";return i=i.trim(),this.rules.other.startAngleBracket.test(i)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(r)?i=i.slice(1):i=i.slice(1,-1)),bl(t,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:a&&a.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let r=n[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&vl(e,n[1],r,this.rules))return;let i=t[da((n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "))];if(!i){let a=n[0].charAt(0);return{type:"text",raw:a,text:a}}return bl(n,i,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let r=this.rules.inline.emStrongLDelim.exec(e);if(!(!r||!r[1]&&!r[2]&&!r[3]&&!r[4]||r[4]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(r[1]||r[3])||!n||this.rules.inline.punctuation.exec(n))){let i=[...r[0]].length-1,a,o,s=i,l=0,c=r[0][0],f=n===c,u=c==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(u.lastIndex=0,t=t.slice(-1*e.length+i);(r=u.exec(t))!==null;){if(a=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!a)continue;if(o=[...a].length,r[3]||r[4]){s+=o;continue}else if(r[5]||r[6]){if(i%3&&!((i+o)%3)){l+=o;continue}if(f)break}if(s-=o,s>0)continue;o=Math.min(o,o+s+l);let h=[...r[0]][0].length,p=e.slice(0,i+r.index+h+o);if(Math.min(i,o)%2){let y=p.slice(1,-1);return{type:"em",raw:p,text:y,tokens:this.lexer.inlineTokens(y)}}let m=p.slice(2,-2);return{type:"strong",raw:p,text:m,tokens:this.lexer.inlineTokens(m)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),r=this.rules.other.nonSpaceChar.test(n),i=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return r&&i&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,n=""){let r=this.rules.inline.delLDelim.exec(e);if(r&&(!r[1]||!n||this.rules.inline.punctuation.exec(n))){let i=[...r[0]].length-1,a,o,s=i,l=this.rules.inline.delRDelim;for(l.lastIndex=0,t=t.slice(-1*e.length+i);(r=l.exec(t))!==null;){if(a=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!a||(o=[...a].length,o!==i))continue;if(r[3]||r[4]){s+=o;continue}if(s-=o,s>0)continue;o=Math.min(o,o+s);let c=[...r[0]][0].length,f=e.slice(0,i+r.index+c+o),u=f.slice(i,-i);return{type:"del",raw:f,text:u,tokens:this.lexer.inlineTokens(u)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,r;return t[2]==="@"?(n=t[1],r="mailto:"+n):(n=t[1],r=n),{type:"link",raw:t[0],text:n,href:r,autolink:!0,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,r;if(t[2]==="@")n=t[0],r="mailto:"+n;else{let i;do i=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(i!==t[0]);n=t[0],t[1]==="www."?r="http://"+t[0]:r=t[0]}return{type:"link",raw:t[0],text:n,href:r,autolink:!0,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:n?t[0]:Xd(t[0]),escaped:n}}}},Yt=class Es{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||tr,this.options.tokenizer=this.options.tokenizer||new pa,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,linkEmitted:!1,linkParenPossible:!0,top:!0};let n={other:bt,block:Hi.normal,inline:zr.normal};this.options.pedantic?(n.block=Hi.pedantic,n.inline=zr.pedantic):this.options.gfm&&(n.block=Hi.gfm,this.options.breaks?n.inline=zr.breaks:n.inline=zr.gfm),this.tokenizer.rules=n}static get rules(){return{block:Hi,inline:zr}}static lex(t,n){return new Es(n).lex(t)}static lexInline(t,n){return new Es(n).inlineTokens(t)}lex(t){t=t.replace(bt.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let r=this.inlineQueue[n];this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],r=!1){this.tokenizer.lexer=this,this.options.pedantic&&(t=t.replace(bt.tabCharGlobal,"    ").replace(bt.spaceLine,""));let i=1/0;for(;t;){if(t.length<i)i=t.length;else{this.infiniteLoopError(t.charCodeAt(0));break}let a;if(this.options.extensions?.block?.some(s=>(a=s.call({lexer:this},t,n))?(t=t.substring(a.raw.length),n.push(a),!0):!1))continue;if(a=this.tokenizer.space(t)){t=t.substring(a.raw.length);let s=n.at(-1);a.raw.length===1&&s!==void 0?s.raw+=`
`:n.push(a);continue}if(a=this.tokenizer.code(t)){t=t.substring(a.raw.length);let s=n.at(-1);s?.type==="paragraph"||s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+a.raw,s.text+=`
`+a.text,this.inlineQueue.at(-1).src=s.text):n.push(a);continue}if(a=this.tokenizer.fences(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.heading(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.hr(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.blockquote(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.list(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.html(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.def(t)){t=t.substring(a.raw.length);let s=n.at(-1);s?.type==="paragraph"||s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+a.raw,s.text+=`
`+a.raw,this.inlineQueue.at(-1).src=s.text):this.tokens.links[a.tag]||(this.tokens.links[a.tag]={href:a.href,title:a.title},n.push(a));continue}if(a=this.tokenizer.table(t)){t=t.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.lheading(t)){t=t.substring(a.raw.length),n.push(a);continue}let o=t;if(this.options.extensions?.startBlock){let s=1/0,l=t.slice(1),c;this.options.extensions.startBlock.forEach(f=>{c=f.call({lexer:this},l),typeof c=="number"&&c>=0&&(s=Math.min(s,c))}),s<1/0&&s>=0&&(o=t.substring(0,s+1))}if(this.state.top&&(a=this.tokenizer.paragraph(o))){let s=n.at(-1);r&&s?.type==="paragraph"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+a.raw,s.text+=`
`+a.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):n.push(a),r=o.length!==t.length,t=t.substring(a.raw.length);continue}if(a=this.tokenizer.text(t)){t=t.substring(a.raw.length);let s=n.at(-1);s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+a.raw,s.text+=`
`+a.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):n.push(a);continue}if(t){this.infiniteLoopError(t.charCodeAt(0));break}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}linkInText(t){if(!t.includes("["))return!1;let n=this.tokenizer.rules.inline.link;for(let r of t.matchAll(this.tokenizer.rules.inline.blockSkip))if(n.test(r[0])&&t.charAt(r.index-1)!=="!")return!0;for(let r of t.matchAll(this.tokenizer.rules.inline.reflinkSearch)){let i=r[0],a=i.lastIndexOf("[");if(!(i.charAt(0)==="!"||!Object.hasOwn(this.tokens.links,da(i.slice(a+1,-1))))&&!(a>1&&this.linkInText(i.slice(1,a-1))))return!0}return!1}inlineTokens(t,n=[]){this.tokenizer.lexer=this;let r=this.state.linkParenPossible;this.state.linkParenPossible=r&&t.includes(")");try{return this.#e(t,n)}finally{this.state.linkParenPossible=r}}#e(t,n){let r=t;if(this.tokens.links&&t.includes("[")){let s=this.tokenizer.rules.inline.reflinkSearch,l=c=>{let f=c.lastIndexOf("[");if(!Object.hasOwn(this.tokens.links,da(c.slice(f+1,-1))))return c;if(f>1&&c.charAt(0)!=="!"){let u=c.slice(1,f-1);if(this.linkInText(u))return"["+u.replace(s,l)+"]["+"a".repeat(c.length-f-2)+"]"}return"["+"a".repeat(c.length-2)+"]"};r=r.replace(s,l)}r=r.replace(this.tokenizer.rules.inline.anyPunctuation,s=>"+".repeat(s.length)),r=r.replace(this.tokenizer.rules.inline.blockSkip,(s,l,c)=>{let f=c?c.length:0;return s.slice(0,f)+"["+"a".repeat(s.length-f-2)+"]"}),r=this.options.hooks?.emStrongMask?.call({lexer:this},r)??r;let i=!1,a="",o=1/0;for(;t;){if(t.length<o)o=t.length;else{this.infiniteLoopError(t.charCodeAt(0));break}i||(a=""),i=!1;let s;if(this.options.extensions?.inline?.some(c=>(s=c.call({lexer:this},t,n))?(t=t.substring(s.raw.length),n.push(s),!0):!1))continue;if(s=this.tokenizer.escape(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.tag(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.link(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(s.raw.length);let c=n.at(-1);s.type==="text"&&c?.type==="text"?(c.raw+=s.raw,c.text+=s.text):n.push(s);continue}if(s=this.tokenizer.emStrong(t,r,a)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.codespan(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.br(t)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.del(t,r,a)){t=t.substring(s.raw.length),n.push(s);continue}if(s=this.tokenizer.autolink(t)){t=t.substring(s.raw.length),n.push(s);continue}if(!this.state.inLink&&(s=this.tokenizer.url(t))){t=t.substring(s.raw.length),n.push(s);continue}let l=t;if(this.options.extensions?.startInline){let c=1/0,f=t.slice(1),u;this.options.extensions.startInline.forEach(h=>{u=h.call({lexer:this},f),typeof u=="number"&&u>=0&&(c=Math.min(c,u))}),c<1/0&&c>=0&&(l=t.substring(0,c+1))}if(s=this.tokenizer.inlineText(l)){t=t.substring(s.raw.length),s.raw.slice(-1)!=="_"&&(a=s.raw.slice(-1)),i=!0;let c=n.at(-1);c?.type==="text"?(c.raw+=s.raw,c.text+=s.text):n.push(s);continue}if(t){this.infiniteLoopError(t.charCodeAt(0));break}}return n}infiniteLoopError(t){let n="Infinite loop on byte: "+t;if(this.options.silent)console.error(n);else throw new Error(n)}},ma=class{options;parser;constructor(e){this.options=e||tr}space(e){return""}code({text:e,lang:t,escaped:n}){let r=(t||"").match(bt.notSpaceStart)?.[0],i=e?e.replace(bt.endingNewline,"")+`
`:"";return r?'<pre><code class="language-'+Dt(r)+'">'+(n?i:Dt(i,!0))+`</code></pre>
`:"<pre><code>"+(n?i:Dt(i,!0))+`</code></pre>
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
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${Dt(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,text:n,tokens:r,autolink:i}){let a=i?Dt(n,!0):this.parser.parseInline(r),o=ml(e);if(o===null)return a;e=Dt(o,i);let s='<a href="'+e+'"';return t&&(s+=' title="'+Dt(t)+'"'),s+=">"+a+"</a>",s}image({href:e,title:t,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));let i=ml(e);if(i===null)return Dt(n);e=i;let a=`<img src="${Dt(e)}" alt="${Dt(n)}"`;return t&&(a+=` title="${Dt(t)}"`),a+=">",a}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:Dt(e.text)}},go=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},Qt=class As{options;renderer;textRenderer;constructor(t){this.options=t||tr,this.options.renderer=this.options.renderer||new ma,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new go}static parse(t,n){return new As(n).parse(t)}static parseInline(t,n){return new As(n).parseInline(t)}parse(t){this.renderer.parser=this;let n="";for(let r=0;r<t.length;r++){let i=t[r];if(this.options.extensions?.renderers?.[i.type]){let o=i,s=this.options.extensions.renderers[o.type].call({parser:this},o);if(s!==!1||!["space","hr","heading","code","table","blockquote","list","checkbox","html","def","paragraph","text"].includes(o.type)){n+=s||"";continue}}let a=i;switch(a.type){case"space":n+=this.renderer.space(a);break;case"hr":n+=this.renderer.hr(a);break;case"heading":n+=this.renderer.heading(a);break;case"code":n+=this.renderer.code(a);break;case"table":n+=this.renderer.table(a);break;case"blockquote":n+=this.renderer.blockquote(a);break;case"list":n+=this.renderer.list(a);break;case"checkbox":n+=this.renderer.checkbox(a);break;case"html":n+=this.renderer.html(a);break;case"def":n+=this.renderer.def(a);break;case"paragraph":n+=this.renderer.paragraph(a);break;case"text":n+=this.renderer.text(a);break;default:{let o='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return n}parseInline(t,n=this.renderer){this.renderer.parser=this;let r="";for(let i=0;i<t.length;i++){let a=t[i];if(this.options.extensions?.renderers?.[a.type]){let s=this.options.extensions.renderers[a.type].call({parser:this},a);if(s!==!1||!["escape","html","link","image","checkbox","strong","em","codespan","br","del","text"].includes(a.type)){r+=s||"";continue}}let o=a;switch(o.type){case"escape":r+=n.text(o);break;case"html":r+=n.html(o);break;case"link":r+=n.link(o);break;case"image":r+=n.image(o);break;case"checkbox":r+=n.checkbox(o);break;case"strong":r+=n.strong(o);break;case"em":r+=n.em(o);break;case"codespan":r+=n.codespan(o);break;case"br":r+=n.br(o);break;case"del":r+=n.del(o);break;case"text":r+=n.text(o);break;default:{let s='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(s),"";throw new Error(s)}}}return r}},Br=class{options;block;constructor(e){this.options=e||tr}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(e=this.block){return e?Yt.lex:Yt.lexInline}provideParser(e=this.block){return e?Qt.parse:Qt.parseInline}},Jd=class{defaults=lo();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Qt;Renderer=ma;TextRenderer=go;Lexer=Yt;Tokenizer=pa;Hooks=Br;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let r of e)switch(n=n.concat(t.call(this,r)),r.type){case"table":{let i=r;for(let a of i.header)n=n.concat(this.walkTokens(a.tokens,t));for(let a of i.rows)for(let o of a)n=n.concat(this.walkTokens(o.tokens,t));break}case"list":{let i=r;n=n.concat(this.walkTokens(i.items,t));break}default:{let i=r;this.defaults.extensions?.childTokens?.[i.type]?this.defaults.extensions.childTokens[i.type].forEach(a=>{let o=i[a].flat(1/0);n=n.concat(this.walkTokens(o,t))}):i.tokens&&(n=n.concat(this.walkTokens(i.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let r={...n};if(r.async=this.defaults.async||r.async||!1,n.extensions&&(n.extensions.forEach(i=>{if(!i.name)throw new Error("extension name required");if("renderer"in i){let a=t.renderers[i.name];a?t.renderers[i.name]=function(...o){let s=i.renderer.apply(this,o);return s===!1&&(s=a.apply(this,o)),s}:t.renderers[i.name]=i.renderer}if("tokenizer"in i){if(!i.level||i.level!=="block"&&i.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let a=t[i.level];a?a.unshift(i.tokenizer):t[i.level]=[i.tokenizer],i.start&&(i.level==="block"?t.startBlock?t.startBlock.push(i.start):t.startBlock=[i.start]:i.level==="inline"&&(t.startInline?t.startInline.push(i.start):t.startInline=[i.start]))}"childTokens"in i&&i.childTokens&&(t.childTokens[i.name]=i.childTokens)}),r.extensions=t),n.renderer){let i=this.defaults.renderer||new ma(this.defaults);for(let a in n.renderer){if(!(a in i))throw new Error(`renderer '${a}' does not exist`);if(["options","parser"].includes(a))continue;let o=a,s=n.renderer[o],l=i[o];i[o]=(...c)=>{let f=s.apply(i,c);return f===!1&&(f=l.apply(i,c)),f||""}}r.renderer=i}if(n.tokenizer){let i=this.defaults.tokenizer||new pa(this.defaults);for(let a in n.tokenizer){if(!(a in i))throw new Error(`tokenizer '${a}' does not exist`);if(["options","rules","lexer"].includes(a))continue;let o=a,s=n.tokenizer[o],l=i[o];i[o]=(...c)=>{let f=s.apply(i,c);return f===!1&&(f=l.apply(i,c)),f}}r.tokenizer=i}if(n.hooks){let i=this.defaults.hooks||new Br;for(let a in n.hooks){if(!(a in i))throw new Error(`hook '${a}' does not exist`);if(["options","block"].includes(a))continue;let o=a,s=n.hooks[o],l=i[o];Br.passThroughHooks.has(a)?i[o]=c=>{if(this.defaults.async&&Br.passThroughHooksRespectAsync.has(a))return(async()=>{let u=await s.call(i,c);return l.call(i,u)})();let f=s.call(i,c);return l.call(i,f)}:i[o]=(...c)=>{if(this.defaults.async)return(async()=>{let u=await s.apply(i,c);return u===!1&&(u=await l.apply(i,c)),u})();let f=s.apply(i,c);return f===!1&&(f=l.apply(i,c)),f}}r.hooks=i}if(n.walkTokens){let i=this.defaults.walkTokens,a=n.walkTokens;r.walkTokens=function(o){let s=[];return s.push(a.call(this,o)),i&&(s=s.concat(i.call(this,o))),s}}this.defaults={...this.defaults,...r}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return Yt.lex(e,t??this.defaults)}parser(e,t){return Qt.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let r={...n},i={...this.defaults,...r},a=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&r.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(i.hooks&&(i.hooks.options=i,i.hooks.block=e),i.async)return(async()=>{let o=i.hooks?await i.hooks.preprocess(t):t,s=await(i.hooks?await i.hooks.provideLexer(e):e?Yt.lex:Yt.lexInline)(o,i),l=i.hooks?await i.hooks.processAllTokens(s):s;i.walkTokens&&await Promise.all(this.walkTokens(l,i.walkTokens));let c=await(i.hooks?await i.hooks.provideParser(e):e?Qt.parse:Qt.parseInline)(l,i);return i.hooks?await i.hooks.postprocess(c):c})().catch(a);try{i.hooks&&(t=i.hooks.preprocess(t));let o=(i.hooks?i.hooks.provideLexer(e):e?Yt.lex:Yt.lexInline)(t,i);i.hooks&&(o=i.hooks.processAllTokens(o)),i.walkTokens&&this.walkTokens(o,i.walkTokens);let s=(i.hooks?i.hooks.provideParser(e):e?Qt.parse:Qt.parseInline)(o,i);return i.hooks&&(s=i.hooks.postprocess(s)),s}catch(o){return a(o)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let r="<p>An error occurred:</p><pre>"+Dt(n.message+"",!0)+"</pre>";return t?Promise.resolve(r):r}if(t)return Promise.reject(n);throw n}}},er=new Jd;function $e(e,t){return er.parse(e,t)}$e.options=$e.setOptions=function(e){return er.setOptions(e),$e.defaults=er.defaults,Gc($e.defaults),$e};$e.getDefaults=lo;$e.defaults=tr;function ep(...e){return er.use(...e),$e.defaults=er.defaults,Gc($e.defaults),$e}$e.use=ep;$e.walkTokens=function(e,t){return er.walkTokens(e,t)};$e.parseInline=er.parseInline;$e.Parser=Qt;$e.parser=Qt.parse;$e.Renderer=ma;$e.TextRenderer=go;$e.Lexer=Yt;$e.lexer=Yt.lex;$e.Tokenizer=pa;$e.Hooks=Br;$e.parse=$e;var Gm=$e.options,Zm=$e.setOptions,Ym=$e.walkTokens,Qm=$e.parseInline,Xm=Qt.parse,Km=Yt.lex,nh=`var Hi = Object.create, Cn = Object.defineProperty, Wi = Object.getOwnPropertyDescriptor, Gi = Object.getOwnPropertyNames, qi = Object.getPrototypeOf, hi = Object.prototype.hasOwnProperty, Vi = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), Zi = (e, t) => {
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
const ba = new da({
	maxEntries: 500,
	policy: "slru"
}), Pn = new _a(0);
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
`,kl=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",nh],{type:"text/javascript;charset=utf-8"});function tp(e){let t;try{if(t=kl&&(self.URL||self.webkitURL).createObjectURL(kl),!t)throw"";const n=new Worker(t,{type:"module",name:e?.name});return n.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(t)}),n}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(nh),{type:"module",name:e?.name})}}var Wr={100:"💯",1234:"🔢",grinning:"😀",grimacing:"😬",grin:"😁",joy:"😂",rofl:"🤣",partying:"🥳",smiley:"😃",smile:"😄",sweat_smile:"😅",laughing:"😆",innocent:"😇",wink:"😉",blush:"😊",slightly_smiling_face:"🙂",upside_down_face:"🙃",relaxed:"☺️",yum:"😋",relieved:"😌",heart_eyes:"😍",smiling_face_with_three_hearts:"🥰",kissing_heart:"😘",kissing:"😗",kissing_smiling_eyes:"😙",kissing_closed_eyes:"😚",stuck_out_tongue_winking_eye:"😜",zany:"🤪",raised_eyebrow:"🤨",monocle:"🧐",stuck_out_tongue_closed_eyes:"😝",stuck_out_tongue:"😛",money_mouth_face:"🤑",nerd_face:"🤓",sunglasses:"😎",star_struck:"🤩",clown_face:"🤡",cowboy_hat_face:"🤠",hugs:"🤗",smirk:"😏",no_mouth:"😶",neutral_face:"😐",expressionless:"😑",unamused:"😒",roll_eyes:"🙄",thinking:"🤔",lying_face:"🤥",hand_over_mouth:"🤭",shushing:"🤫",symbols_over_mouth:"🤬",exploding_head:"🤯",flushed:"😳",disappointed:"😞",worried:"😟",angry:"😠",rage:"😡",pensive:"😔",confused:"😕",slightly_frowning_face:"🙁",frowning_face:"☹",persevere:"😣",confounded:"😖",tired_face:"😫",weary:"😩",pleading:"🥺",triumph:"😤",open_mouth:"😮",scream:"😱",fearful:"😨",cold_sweat:"😰",hushed:"😯",frowning:"😦",anguished:"😧",cry:"😢",disappointed_relieved:"😥",drooling_face:"🤤",sleepy:"😪",sweat:"😓",hot:"🥵",cold:"🥶",sob:"😭",dizzy_face:"😵",astonished:"😲",zipper_mouth_face:"🤐",nauseated_face:"🤢",sneezing_face:"🤧",vomiting:"🤮",mask:"😷",face_with_thermometer:"🤒",face_with_head_bandage:"🤕",woozy:"🥴",sleeping:"😴",zzz:"💤",poop:"💩",smiling_imp:"😈",imp:"👿",japanese_ogre:"👹",japanese_goblin:"👺",skull:"💀",ghost:"👻",alien:"👽",robot:"🤖",smiley_cat:"😺",smile_cat:"😸",joy_cat:"😹",heart_eyes_cat:"😻",smirk_cat:"😼",kissing_cat:"😽",scream_cat:"🙀",crying_cat_face:"😿",pouting_cat:"😾",palms_up:"🤲",raised_hands:"🙌",clap:"👏",wave:"👋",call_me_hand:"🤙","+1":"👍","-1":"👎",facepunch:"👊",fist:"✊",fist_left:"🤛",fist_right:"🤜",v:"✌",ok_hand:"👌",raised_hand:"✋",raised_back_of_hand:"🤚",open_hands:"👐",muscle:"💪",pray:"🙏",foot:"🦶",leg:"🦵",handshake:"🤝",point_up:"☝",point_up_2:"👆",point_down:"👇",point_left:"👈",point_right:"👉",fu:"🖕",raised_hand_with_fingers_splayed:"🖐",love_you:"🤟",metal:"🤘",crossed_fingers:"🤞",vulcan_salute:"🖖",writing_hand:"✍",selfie:"🤳",nail_care:"💅",lips:"👄",tooth:"🦷",tongue:"👅",ear:"👂",nose:"👃",eye:"👁",eyes:"👀",brain:"🧠",bust_in_silhouette:"👤",busts_in_silhouette:"👥",speaking_head:"🗣",baby:"👶",child:"🧒",boy:"👦",girl:"👧",adult:"🧑",man:"👨",woman:"👩",blonde_woman:"👱‍♀️",blonde_man:"👱",bearded_person:"🧔",older_adult:"🧓",older_man:"👴",older_woman:"👵",man_with_gua_pi_mao:"👲",woman_with_headscarf:"🧕",woman_with_turban:"👳‍♀️",man_with_turban:"👳",policewoman:"👮‍♀️",policeman:"👮",construction_worker_woman:"👷‍♀️",construction_worker_man:"👷",guardswoman:"💂‍♀️",guardsman:"💂",female_detective:"🕵️‍♀️",male_detective:"🕵",woman_health_worker:"👩‍⚕️",man_health_worker:"👨‍⚕️",woman_farmer:"👩‍🌾",man_farmer:"👨‍🌾",woman_cook:"👩‍🍳",man_cook:"👨‍🍳",woman_student:"👩‍🎓",man_student:"👨‍🎓",woman_singer:"👩‍🎤",man_singer:"👨‍🎤",woman_teacher:"👩‍🏫",man_teacher:"👨‍🏫",woman_factory_worker:"👩‍🏭",man_factory_worker:"👨‍🏭",woman_technologist:"👩‍💻",man_technologist:"👨‍💻",woman_office_worker:"👩‍💼",man_office_worker:"👨‍💼",woman_mechanic:"👩‍🔧",man_mechanic:"👨‍🔧",woman_scientist:"👩‍🔬",man_scientist:"👨‍🔬",woman_artist:"👩‍🎨",man_artist:"👨‍🎨",woman_firefighter:"👩‍🚒",man_firefighter:"👨‍🚒",woman_pilot:"👩‍✈️",man_pilot:"👨‍✈️",woman_astronaut:"👩‍🚀",man_astronaut:"👨‍🚀",woman_judge:"👩‍⚖️",man_judge:"👨‍⚖️",woman_superhero:"🦸‍♀️",man_superhero:"🦸‍♂️",woman_supervillain:"🦹‍♀️",man_supervillain:"🦹‍♂️",mrs_claus:"🤶",santa:"🎅",sorceress:"🧙‍♀️",wizard:"🧙‍♂️",woman_elf:"🧝‍♀️",man_elf:"🧝‍♂️",woman_vampire:"🧛‍♀️",man_vampire:"🧛‍♂️",woman_zombie:"🧟‍♀️",man_zombie:"🧟‍♂️",woman_genie:"🧞‍♀️",man_genie:"🧞‍♂️",mermaid:"🧜‍♀️",merman:"🧜‍♂️",woman_fairy:"🧚‍♀️",man_fairy:"🧚‍♂️",angel:"👼",pregnant_woman:"🤰",breastfeeding:"🤱",princess:"👸",prince:"🤴",bride_with_veil:"👰",man_in_tuxedo:"🤵",running_woman:"🏃‍♀️",running_man:"🏃",walking_woman:"🚶‍♀️",walking_man:"🚶",dancer:"💃",man_dancing:"🕺",dancing_women:"👯",dancing_men:"👯‍♂️",couple:"👫",two_men_holding_hands:"👬",two_women_holding_hands:"👭",bowing_woman:"🙇‍♀️",bowing_man:"🙇",man_facepalming:"🤦‍♂️",woman_facepalming:"🤦‍♀️",woman_shrugging:"🤷",man_shrugging:"🤷‍♂️",tipping_hand_woman:"💁",tipping_hand_man:"💁‍♂️",no_good_woman:"🙅",no_good_man:"🙅‍♂️",ok_woman:"🙆",ok_man:"🙆‍♂️",raising_hand_woman:"🙋",raising_hand_man:"🙋‍♂️",pouting_woman:"🙎",pouting_man:"🙎‍♂️",frowning_woman:"🙍",frowning_man:"🙍‍♂️",haircut_woman:"💇",haircut_man:"💇‍♂️",massage_woman:"💆",massage_man:"💆‍♂️",woman_in_steamy_room:"🧖‍♀️",man_in_steamy_room:"🧖‍♂️",couple_with_heart_woman_man:"💑",couple_with_heart_woman_woman:"👩‍❤️‍👩",couple_with_heart_man_man:"👨‍❤️‍👨",couplekiss_man_woman:"💏",couplekiss_woman_woman:"👩‍❤️‍💋‍👩",couplekiss_man_man:"👨‍❤️‍💋‍👨",family_man_woman_boy:"👪",family_man_woman_girl:"👨‍👩‍👧",family_man_woman_girl_boy:"👨‍👩‍👧‍👦",family_man_woman_boy_boy:"👨‍👩‍👦‍👦",family_man_woman_girl_girl:"👨‍👩‍👧‍👧",family_woman_woman_boy:"👩‍👩‍👦",family_woman_woman_girl:"👩‍👩‍👧",family_woman_woman_girl_boy:"👩‍👩‍👧‍👦",family_woman_woman_boy_boy:"👩‍👩‍👦‍👦",family_woman_woman_girl_girl:"👩‍👩‍👧‍👧",family_man_man_boy:"👨‍👨‍👦",family_man_man_girl:"👨‍👨‍👧",family_man_man_girl_boy:"👨‍👨‍👧‍👦",family_man_man_boy_boy:"👨‍👨‍👦‍👦",family_man_man_girl_girl:"👨‍👨‍👧‍👧",family_woman_boy:"👩‍👦",family_woman_girl:"👩‍👧",family_woman_girl_boy:"👩‍👧‍👦",family_woman_boy_boy:"👩‍👦‍👦",family_woman_girl_girl:"👩‍👧‍👧",family_man_boy:"👨‍👦",family_man_girl:"👨‍👧",family_man_girl_boy:"👨‍👧‍👦",family_man_boy_boy:"👨‍👦‍👦",family_man_girl_girl:"👨‍👧‍👧",yarn:"🧶",thread:"🧵",coat:"🧥",labcoat:"🥼",womans_clothes:"👚",tshirt:"👕",jeans:"👖",necktie:"👔",dress:"👗",bikini:"👙",kimono:"👘",lipstick:"💄",kiss:"💋",footprints:"👣",flat_shoe:"🥿",high_heel:"👠",sandal:"👡",boot:"👢",mans_shoe:"👞",athletic_shoe:"👟",hiking_boot:"🥾",socks:"🧦",gloves:"🧤",scarf:"🧣",womans_hat:"👒",tophat:"🎩",billed_hat:"🧢",rescue_worker_helmet:"⛑",mortar_board:"🎓",crown:"👑",school_satchel:"🎒",luggage:"🧳",pouch:"👝",purse:"👛",handbag:"👜",briefcase:"💼",eyeglasses:"👓",dark_sunglasses:"🕶",goggles:"🥽",ring:"💍",closed_umbrella:"🌂",dog:"🐶",cat:"🐱",mouse:"🐭",hamster:"🐹",rabbit:"🐰",fox_face:"🦊",bear:"🐻",panda_face:"🐼",koala:"🐨",tiger:"🐯",lion:"🦁",cow:"🐮",pig:"🐷",pig_nose:"🐽",frog:"🐸",squid:"🦑",octopus:"🐙",shrimp:"🦐",monkey_face:"🐵",gorilla:"🦍",see_no_evil:"🙈",hear_no_evil:"🙉",speak_no_evil:"🙊",monkey:"🐒",chicken:"🐔",penguin:"🐧",bird:"🐦",baby_chick:"🐤",hatching_chick:"🐣",hatched_chick:"🐥",duck:"🦆",eagle:"🦅",owl:"🦉",bat:"🦇",wolf:"🐺",boar:"🐗",horse:"🐴",unicorn:"🦄",honeybee:"🐝",bug:"🐛",butterfly:"🦋",snail:"🐌",beetle:"🐞",ant:"🐜",grasshopper:"🦗",spider:"🕷",scorpion:"🦂",crab:"🦀",snake:"🐍",lizard:"🦎","t-rex":"🦖",sauropod:"🦕",turtle:"🐢",tropical_fish:"🐠",fish:"🐟",blowfish:"🐡",dolphin:"🐬",shark:"🦈",whale:"🐳",whale2:"🐋",crocodile:"🐊",leopard:"🐆",zebra:"🦓",tiger2:"🐅",water_buffalo:"🐃",ox:"🐂",cow2:"🐄",deer:"🦌",dromedary_camel:"🐪",camel:"🐫",giraffe:"🦒",elephant:"🐘",rhinoceros:"🦏",goat:"🐐",ram:"🐏",sheep:"🐑",racehorse:"🐎",pig2:"🐖",rat:"🐀",mouse2:"🐁",rooster:"🐓",turkey:"🦃",dove:"🕊",dog2:"🐕",poodle:"🐩",cat2:"🐈",rabbit2:"🐇",chipmunk:"🐿",hedgehog:"🦔",raccoon:"🦝",llama:"🦙",hippopotamus:"🦛",kangaroo:"🦘",badger:"🦡",swan:"🦢",peacock:"🦚",parrot:"🦜",lobster:"🦞",mosquito:"🦟",paw_prints:"🐾",dragon:"🐉",dragon_face:"🐲",cactus:"🌵",christmas_tree:"🎄",evergreen_tree:"🌲",deciduous_tree:"🌳",palm_tree:"🌴",seedling:"🌱",herb:"🌿",shamrock:"☘",four_leaf_clover:"🍀",bamboo:"🎍",tanabata_tree:"🎋",leaves:"🍃",fallen_leaf:"🍂",maple_leaf:"🍁",ear_of_rice:"🌾",hibiscus:"🌺",sunflower:"🌻",rose:"🌹",wilted_flower:"🥀",tulip:"🌷",blossom:"🌼",cherry_blossom:"🌸",bouquet:"💐",mushroom:"🍄",chestnut:"🌰",jack_o_lantern:"🎃",shell:"🐚",spider_web:"🕸",earth_americas:"🌎",earth_africa:"🌍",earth_asia:"🌏",full_moon:"🌕",waning_gibbous_moon:"🌖",last_quarter_moon:"🌗",waning_crescent_moon:"🌘",new_moon:"🌑",waxing_crescent_moon:"🌒",first_quarter_moon:"🌓",waxing_gibbous_moon:"🌔",new_moon_with_face:"🌚",full_moon_with_face:"🌝",first_quarter_moon_with_face:"🌛",last_quarter_moon_with_face:"🌜",sun_with_face:"🌞",crescent_moon:"🌙",star:"⭐",star2:"🌟",dizzy:"💫",sparkles:"✨",comet:"☄",sunny:"☀️",sun_behind_small_cloud:"🌤",partly_sunny:"⛅",sun_behind_large_cloud:"🌥",sun_behind_rain_cloud:"🌦",cloud:"☁️",cloud_with_rain:"🌧",cloud_with_lightning_and_rain:"⛈",cloud_with_lightning:"🌩",zap:"⚡",fire:"🔥",boom:"💥",snowflake:"❄️",cloud_with_snow:"🌨",snowman:"⛄",snowman_with_snow:"☃",wind_face:"🌬",dash:"💨",tornado:"🌪",fog:"🌫",open_umbrella:"☂",umbrella:"☔",droplet:"💧",sweat_drops:"💦",ocean:"🌊",green_apple:"🍏",apple:"🍎",pear:"🍐",tangerine:"🍊",lemon:"🍋",banana:"🍌",watermelon:"🍉",grapes:"🍇",strawberry:"🍓",melon:"🍈",cherries:"🍒",peach:"🍑",pineapple:"🍍",coconut:"🥥",kiwi_fruit:"🥝",mango:"🥭",avocado:"🥑",broccoli:"🥦",tomato:"🍅",eggplant:"🍆",cucumber:"🥒",carrot:"🥕",hot_pepper:"🌶",potato:"🥔",corn:"🌽",leafy_greens:"🥬",sweet_potato:"🍠",peanuts:"🥜",honey_pot:"🍯",croissant:"🥐",bread:"🍞",baguette_bread:"🥖",bagel:"🥯",pretzel:"🥨",cheese:"🧀",egg:"🥚",bacon:"🥓",steak:"🥩",pancakes:"🥞",poultry_leg:"🍗",meat_on_bone:"🍖",bone:"🦴",fried_shrimp:"🍤",fried_egg:"🍳",hamburger:"🍔",fries:"🍟",stuffed_flatbread:"🥙",hotdog:"🌭",pizza:"🍕",sandwich:"🥪",canned_food:"🥫",spaghetti:"🍝",taco:"🌮",burrito:"🌯",green_salad:"🥗",shallow_pan_of_food:"🥘",ramen:"🍜",stew:"🍲",fish_cake:"🍥",fortune_cookie:"🥠",sushi:"🍣",bento:"🍱",curry:"🍛",rice_ball:"🍙",rice:"🍚",rice_cracker:"🍘",oden:"🍢",dango:"🍡",shaved_ice:"🍧",ice_cream:"🍨",icecream:"🍦",pie:"🥧",cake:"🍰",cupcake:"🧁",moon_cake:"🥮",birthday:"🎂",custard:"🍮",candy:"🍬",lollipop:"🍭",chocolate_bar:"🍫",popcorn:"🍿",dumpling:"🥟",doughnut:"🍩",cookie:"🍪",milk_glass:"🥛",beer:"🍺",beers:"🍻",clinking_glasses:"🥂",wine_glass:"🍷",tumbler_glass:"🥃",cocktail:"🍸",tropical_drink:"🍹",champagne:"🍾",sake:"🍶",tea:"🍵",cup_with_straw:"🥤",coffee:"☕",baby_bottle:"🍼",salt:"🧂",spoon:"🥄",fork_and_knife:"🍴",plate_with_cutlery:"🍽",bowl_with_spoon:"🥣",takeout_box:"🥡",chopsticks:"🥢",soccer:"⚽",basketball:"🏀",football:"🏈",baseball:"⚾",softball:"🥎",tennis:"🎾",volleyball:"🏐",rugby_football:"🏉",flying_disc:"🥏","8ball":"🎱",golf:"⛳",golfing_woman:"🏌️‍♀️",golfing_man:"🏌",ping_pong:"🏓",badminton:"🏸",goal_net:"🥅",ice_hockey:"🏒",field_hockey:"🏑",lacrosse:"🥍",cricket:"🏏",ski:"🎿",skier:"⛷",snowboarder:"🏂",person_fencing:"🤺",women_wrestling:"🤼‍♀️",men_wrestling:"🤼‍♂️",woman_cartwheeling:"🤸‍♀️",man_cartwheeling:"🤸‍♂️",woman_playing_handball:"🤾‍♀️",man_playing_handball:"🤾‍♂️",ice_skate:"⛸",curling_stone:"🥌",skateboard:"🛹",sled:"🛷",bow_and_arrow:"🏹",fishing_pole_and_fish:"🎣",boxing_glove:"🥊",martial_arts_uniform:"🥋",rowing_woman:"🚣‍♀️",rowing_man:"🚣",climbing_woman:"🧗‍♀️",climbing_man:"🧗‍♂️",swimming_woman:"🏊‍♀️",swimming_man:"🏊",woman_playing_water_polo:"🤽‍♀️",man_playing_water_polo:"🤽‍♂️",woman_in_lotus_position:"🧘‍♀️",man_in_lotus_position:"🧘‍♂️",surfing_woman:"🏄‍♀️",surfing_man:"🏄",bath:"🛀",basketball_woman:"⛹️‍♀️",basketball_man:"⛹",weight_lifting_woman:"🏋️‍♀️",weight_lifting_man:"🏋",biking_woman:"🚴‍♀️",biking_man:"🚴",mountain_biking_woman:"🚵‍♀️",mountain_biking_man:"🚵",horse_racing:"🏇",business_suit_levitating:"🕴",trophy:"🏆",running_shirt_with_sash:"🎽",medal_sports:"🏅",medal_military:"🎖","1st_place_medal":"🥇","2nd_place_medal":"🥈","3rd_place_medal":"🥉",reminder_ribbon:"🎗",rosette:"🏵",ticket:"🎫",tickets:"🎟",performing_arts:"🎭",art:"🎨",circus_tent:"🎪",woman_juggling:"🤹‍♀️",man_juggling:"🤹‍♂️",microphone:"🎤",headphones:"🎧",musical_score:"🎼",musical_keyboard:"🎹",drum:"🥁",saxophone:"🎷",trumpet:"🎺",guitar:"🎸",violin:"🎻",clapper:"🎬",video_game:"🎮",space_invader:"👾",dart:"🎯",game_die:"🎲",chess_pawn:"♟",slot_machine:"🎰",jigsaw:"🧩",bowling:"🎳",red_car:"🚗",taxi:"🚕",blue_car:"🚙",bus:"🚌",trolleybus:"🚎",racing_car:"🏎",police_car:"🚓",ambulance:"🚑",fire_engine:"🚒",minibus:"🚐",truck:"🚚",articulated_lorry:"🚛",tractor:"🚜",kick_scooter:"🛴",motorcycle:"🏍",bike:"🚲",motor_scooter:"🛵",rotating_light:"🚨",oncoming_police_car:"🚔",oncoming_bus:"🚍",oncoming_automobile:"🚘",oncoming_taxi:"🚖",aerial_tramway:"🚡",mountain_cableway:"🚠",suspension_railway:"🚟",railway_car:"🚃",train:"🚋",monorail:"🚝",bullettrain_side:"🚄",bullettrain_front:"🚅",light_rail:"🚈",mountain_railway:"🚞",steam_locomotive:"🚂",train2:"🚆",metro:"🚇",tram:"🚊",station:"🚉",flying_saucer:"🛸",helicopter:"🚁",small_airplane:"🛩",airplane:"✈️",flight_departure:"🛫",flight_arrival:"🛬",sailboat:"⛵",motor_boat:"🛥",speedboat:"🚤",ferry:"⛴",passenger_ship:"🛳",rocket:"🚀",artificial_satellite:"🛰",seat:"💺",canoe:"🛶",anchor:"⚓",construction:"🚧",fuelpump:"⛽",busstop:"🚏",vertical_traffic_light:"🚦",traffic_light:"🚥",checkered_flag:"🏁",ship:"🚢",ferris_wheel:"🎡",roller_coaster:"🎢",carousel_horse:"🎠",building_construction:"🏗",foggy:"🌁",tokyo_tower:"🗼",factory:"🏭",fountain:"⛲",rice_scene:"🎑",mountain:"⛰",mountain_snow:"🏔",mount_fuji:"🗻",volcano:"🌋",japan:"🗾",camping:"🏕",tent:"⛺",national_park:"🏞",motorway:"🛣",railway_track:"🛤",sunrise:"🌅",sunrise_over_mountains:"🌄",desert:"🏜",beach_umbrella:"🏖",desert_island:"🏝",city_sunrise:"🌇",city_sunset:"🌆",cityscape:"🏙",night_with_stars:"🌃",bridge_at_night:"🌉",milky_way:"🌌",stars:"🌠",sparkler:"🎇",fireworks:"🎆",rainbow:"🌈",houses:"🏘",european_castle:"🏰",japanese_castle:"🏯",stadium:"🏟",statue_of_liberty:"🗽",house:"🏠",house_with_garden:"🏡",derelict_house:"🏚",office:"🏢",department_store:"🏬",post_office:"🏣",european_post_office:"🏤",hospital:"🏥",bank:"🏦",hotel:"🏨",convenience_store:"🏪",school:"🏫",love_hotel:"🏩",wedding:"💒",classical_building:"🏛",church:"⛪",mosque:"🕌",synagogue:"🕍",kaaba:"🕋",shinto_shrine:"⛩",watch:"⌚",iphone:"📱",calling:"📲",computer:"💻",keyboard:"⌨",desktop_computer:"🖥",printer:"🖨",computer_mouse:"🖱",trackball:"🖲",joystick:"🕹",clamp:"🗜",minidisc:"💽",floppy_disk:"💾",cd:"💿",dvd:"📀",vhs:"📼",camera:"📷",camera_flash:"📸",video_camera:"📹",movie_camera:"🎥",film_projector:"📽",film_strip:"🎞",telephone_receiver:"📞",phone:"☎️",pager:"📟",fax:"📠",tv:"📺",radio:"📻",studio_microphone:"🎙",level_slider:"🎚",control_knobs:"🎛",compass:"🧭",stopwatch:"⏱",timer_clock:"⏲",alarm_clock:"⏰",mantelpiece_clock:"🕰",hourglass_flowing_sand:"⏳",hourglass:"⌛",satellite:"📡",battery:"🔋",electric_plug:"🔌",bulb:"💡",flashlight:"🔦",candle:"🕯",fire_extinguisher:"🧯",wastebasket:"🗑",oil_drum:"🛢",money_with_wings:"💸",dollar:"💵",yen:"💴",euro:"💶",pound:"💷",moneybag:"💰",credit_card:"💳",gem:"💎",balance_scale:"⚖",toolbox:"🧰",wrench:"🔧",hammer:"🔨",hammer_and_pick:"⚒",hammer_and_wrench:"🛠",pick:"⛏",nut_and_bolt:"🔩",gear:"⚙",brick:"🧱",chains:"⛓",magnet:"🧲",gun:"🔫",bomb:"💣",firecracker:"🧨",hocho:"🔪",dagger:"🗡",crossed_swords:"⚔",shield:"🛡",smoking:"🚬",skull_and_crossbones:"☠",coffin:"⚰",funeral_urn:"⚱",amphora:"🏺",crystal_ball:"🔮",prayer_beads:"📿",nazar_amulet:"🧿",barber:"💈",alembic:"⚗",telescope:"🔭",microscope:"🔬",hole:"🕳",pill:"💊",syringe:"💉",dna:"🧬",microbe:"🦠",petri_dish:"🧫",test_tube:"🧪",thermometer:"🌡",broom:"🧹",basket:"🧺",toilet_paper:"🧻",label:"🏷",bookmark:"🔖",toilet:"🚽",shower:"🚿",bathtub:"🛁",soap:"🧼",sponge:"🧽",lotion_bottle:"🧴",key:"🔑",old_key:"🗝",couch_and_lamp:"🛋",sleeping_bed:"🛌",bed:"🛏",door:"🚪",bellhop_bell:"🛎",teddy_bear:"🧸",framed_picture:"🖼",world_map:"🗺",parasol_on_ground:"⛱",moyai:"🗿",shopping:"🛍",shopping_cart:"🛒",balloon:"🎈",flags:"🎏",ribbon:"🎀",gift:"🎁",confetti_ball:"🎊",tada:"🎉",dolls:"🎎",wind_chime:"🎐",crossed_flags:"🎌",izakaya_lantern:"🏮",red_envelope:"🧧",email:"✉️",envelope_with_arrow:"📩",incoming_envelope:"📨","e-mail":"📧",love_letter:"💌",postbox:"📮",mailbox_closed:"📪",mailbox:"📫",mailbox_with_mail:"📬",mailbox_with_no_mail:"📭",package:"📦",postal_horn:"📯",inbox_tray:"📥",outbox_tray:"📤",scroll:"📜",page_with_curl:"📃",bookmark_tabs:"📑",receipt:"🧾",bar_chart:"📊",chart_with_upwards_trend:"📈",chart_with_downwards_trend:"📉",page_facing_up:"📄",date:"📅",calendar:"📆",spiral_calendar:"🗓",card_index:"📇",card_file_box:"🗃",ballot_box:"🗳",file_cabinet:"🗄",clipboard:"📋",spiral_notepad:"🗒",file_folder:"📁",open_file_folder:"📂",card_index_dividers:"🗂",newspaper_roll:"🗞",newspaper:"📰",notebook:"📓",closed_book:"📕",green_book:"📗",blue_book:"📘",orange_book:"📙",notebook_with_decorative_cover:"📔",ledger:"📒",books:"📚",open_book:"📖",safety_pin:"🧷",link:"🔗",paperclip:"📎",paperclips:"🖇",scissors:"✂️",triangular_ruler:"📐",straight_ruler:"📏",abacus:"🧮",pushpin:"📌",round_pushpin:"📍",triangular_flag_on_post:"🚩",white_flag:"🏳",black_flag:"🏴",rainbow_flag:"🏳️‍🌈",closed_lock_with_key:"🔐",lock:"🔒",unlock:"🔓",lock_with_ink_pen:"🔏",pen:"🖊",fountain_pen:"🖋",black_nib:"✒️",memo:"📝",pencil2:"✏️",crayon:"🖍",paintbrush:"🖌",mag:"🔍",mag_right:"🔎",heart:"❤️",orange_heart:"🧡",yellow_heart:"💛",green_heart:"💚",blue_heart:"💙",purple_heart:"💜",black_heart:"🖤",broken_heart:"💔",heavy_heart_exclamation:"❣",two_hearts:"💕",revolving_hearts:"💞",heartbeat:"💓",heartpulse:"💗",sparkling_heart:"💖",cupid:"💘",gift_heart:"💝",heart_decoration:"💟",peace_symbol:"☮",latin_cross:"✝",star_and_crescent:"☪",om:"🕉",wheel_of_dharma:"☸",star_of_david:"✡",six_pointed_star:"🔯",menorah:"🕎",yin_yang:"☯",orthodox_cross:"☦",place_of_worship:"🛐",ophiuchus:"⛎",aries:"♈",taurus:"♉",gemini:"♊",cancer:"♋",leo:"♌",virgo:"♍",libra:"♎",scorpius:"♏",sagittarius:"♐",capricorn:"♑",aquarius:"♒",pisces:"♓",id:"🆔",atom_symbol:"⚛",u7a7a:"🈳",u5272:"🈹",radioactive:"☢",biohazard:"☣",mobile_phone_off:"📴",vibration_mode:"📳",u6709:"🈶",u7121:"🈚",u7533:"🈸",u55b6:"🈺",u6708:"🈷️",eight_pointed_black_star:"✴️",vs:"🆚",accept:"🉑",white_flower:"💮",ideograph_advantage:"🉐",secret:"㊙️",congratulations:"㊗️",u5408:"🈴",u6e80:"🈵",u7981:"🈲",a:"🅰️",b:"🅱️",ab:"🆎",cl:"🆑",o2:"🅾️",sos:"🆘",no_entry:"⛔",name_badge:"📛",no_entry_sign:"🚫",x:"❌",o:"⭕",stop_sign:"🛑",anger:"💢",hotsprings:"♨️",no_pedestrians:"🚷",do_not_litter:"🚯",no_bicycles:"🚳","non-potable_water":"🚱",underage:"🔞",no_mobile_phones:"📵",exclamation:"❗",grey_exclamation:"❕",question:"❓",grey_question:"❔",bangbang:"‼️",interrobang:"⁉️",low_brightness:"🔅",high_brightness:"🔆",trident:"🔱",fleur_de_lis:"⚜",part_alternation_mark:"〽️",warning:"⚠️",children_crossing:"🚸",beginner:"🔰",recycle:"♻️",u6307:"🈯",chart:"💹",sparkle:"❇️",eight_spoked_asterisk:"✳️",negative_squared_cross_mark:"❎",white_check_mark:"✅",diamond_shape_with_a_dot_inside:"💠",cyclone:"🌀",loop:"➿",globe_with_meridians:"🌐",m:"Ⓜ️",atm:"🏧",sa:"🈂️",passport_control:"🛂",customs:"🛃",baggage_claim:"🛄",left_luggage:"🛅",wheelchair:"♿",no_smoking:"🚭",wc:"🚾",parking:"🅿️",potable_water:"🚰",mens:"🚹",womens:"🚺",baby_symbol:"🚼",restroom:"🚻",put_litter_in_its_place:"🚮",cinema:"🎦",signal_strength:"📶",koko:"🈁",ng:"🆖",ok:"🆗",up:"🆙",cool:"🆒",new:"🆕",free:"🆓",zero:"0️⃣",one:"1️⃣",two:"2️⃣",three:"3️⃣",four:"4️⃣",five:"5️⃣",six:"6️⃣",seven:"7️⃣",eight:"8️⃣",nine:"9️⃣",keycap_ten:"🔟",asterisk:"*⃣",eject_button:"⏏️",arrow_forward:"▶️",pause_button:"⏸",next_track_button:"⏭",stop_button:"⏹",record_button:"⏺",play_or_pause_button:"⏯",previous_track_button:"⏮",fast_forward:"⏩",rewind:"⏪",twisted_rightwards_arrows:"🔀",repeat:"🔁",repeat_one:"🔂",arrow_backward:"◀️",arrow_up_small:"🔼",arrow_down_small:"🔽",arrow_double_up:"⏫",arrow_double_down:"⏬",arrow_right:"➡️",arrow_left:"⬅️",arrow_up:"⬆️",arrow_down:"⬇️",arrow_upper_right:"↗️",arrow_lower_right:"↘️",arrow_lower_left:"↙️",arrow_upper_left:"↖️",arrow_up_down:"↕️",left_right_arrow:"↔️",arrows_counterclockwise:"🔄",arrow_right_hook:"↪️",leftwards_arrow_with_hook:"↩️",arrow_heading_up:"⤴️",arrow_heading_down:"⤵️",hash:"#️⃣",information_source:"ℹ️",abc:"🔤",abcd:"🔡",capital_abcd:"🔠",symbols:"🔣",musical_note:"🎵",notes:"🎶",wavy_dash:"〰️",curly_loop:"➰",heavy_check_mark:"✔️",arrows_clockwise:"🔃",heavy_plus_sign:"➕",heavy_minus_sign:"➖",heavy_division_sign:"➗",heavy_multiplication_x:"✖️",infinity:"♾",heavy_dollar_sign:"💲",currency_exchange:"💱",copyright:"©️",registered:"®️",tm:"™️",end:"🔚",back:"🔙",on:"🔛",top:"🔝",soon:"🔜",ballot_box_with_check:"☑️",radio_button:"🔘",white_circle:"⚪",black_circle:"⚫",red_circle:"🔴",large_blue_circle:"🔵",small_orange_diamond:"🔸",small_blue_diamond:"🔹",large_orange_diamond:"🔶",large_blue_diamond:"🔷",small_red_triangle:"🔺",black_small_square:"▪️",white_small_square:"▫️",black_large_square:"⬛",white_large_square:"⬜",small_red_triangle_down:"🔻",black_medium_square:"◼️",white_medium_square:"◻️",black_medium_small_square:"◾",white_medium_small_square:"◽",black_square_button:"🔲",white_square_button:"🔳",speaker:"🔈",sound:"🔉",loud_sound:"🔊",mute:"🔇",mega:"📣",loudspeaker:"📢",bell:"🔔",no_bell:"🔕",black_joker:"🃏",mahjong:"🀄",spades:"♠️",clubs:"♣️",hearts:"♥️",diamonds:"♦️",flower_playing_cards:"🎴",thought_balloon:"💭",right_anger_bubble:"🗯",speech_balloon:"💬",left_speech_bubble:"🗨",clock1:"🕐",clock2:"🕑",clock3:"🕒",clock4:"🕓",clock5:"🕔",clock6:"🕕",clock7:"🕖",clock8:"🕗",clock9:"🕘",clock10:"🕙",clock11:"🕚",clock12:"🕛",clock130:"🕜",clock230:"🕝",clock330:"🕞",clock430:"🕟",clock530:"🕠",clock630:"🕡",clock730:"🕢",clock830:"🕣",clock930:"🕤",clock1030:"🕥",clock1130:"🕦",clock1230:"🕧",afghanistan:"🇦🇫",aland_islands:"🇦🇽",albania:"🇦🇱",algeria:"🇩🇿",american_samoa:"🇦🇸",andorra:"🇦🇩",angola:"🇦🇴",anguilla:"🇦🇮",antarctica:"🇦🇶",antigua_barbuda:"🇦🇬",argentina:"🇦🇷",armenia:"🇦🇲",aruba:"🇦🇼",australia:"🇦🇺",austria:"🇦🇹",azerbaijan:"🇦🇿",bahamas:"🇧🇸",bahrain:"🇧🇭",bangladesh:"🇧🇩",barbados:"🇧🇧",belarus:"🇧🇾",belgium:"🇧🇪",belize:"🇧🇿",benin:"🇧🇯",bermuda:"🇧🇲",bhutan:"🇧🇹",bolivia:"🇧🇴",caribbean_netherlands:"🇧🇶",bosnia_herzegovina:"🇧🇦",botswana:"🇧🇼",brazil:"🇧🇷",british_indian_ocean_territory:"🇮🇴",british_virgin_islands:"🇻🇬",brunei:"🇧🇳",bulgaria:"🇧🇬",burkina_faso:"🇧🇫",burundi:"🇧🇮",cape_verde:"🇨🇻",cambodia:"🇰🇭",cameroon:"🇨🇲",canada:"🇨🇦",canary_islands:"🇮🇨",cayman_islands:"🇰🇾",central_african_republic:"🇨🇫",chad:"🇹🇩",chile:"🇨🇱",cn:"🇨🇳",christmas_island:"🇨🇽",cocos_islands:"🇨🇨",colombia:"🇨🇴",comoros:"🇰🇲",congo_brazzaville:"🇨🇬",congo_kinshasa:"🇨🇩",cook_islands:"🇨🇰",costa_rica:"🇨🇷",croatia:"🇭🇷",cuba:"🇨🇺",curacao:"🇨🇼",cyprus:"🇨🇾",czech_republic:"🇨🇿",denmark:"🇩🇰",djibouti:"🇩🇯",dominica:"🇩🇲",dominican_republic:"🇩🇴",ecuador:"🇪🇨",egypt:"🇪🇬",el_salvador:"🇸🇻",equatorial_guinea:"🇬🇶",eritrea:"🇪🇷",estonia:"🇪🇪",ethiopia:"🇪🇹",eu:"🇪🇺",falkland_islands:"🇫🇰",faroe_islands:"🇫🇴",fiji:"🇫🇯",finland:"🇫🇮",fr:"🇫🇷",french_guiana:"🇬🇫",french_polynesia:"🇵🇫",french_southern_territories:"🇹🇫",gabon:"🇬🇦",gambia:"🇬🇲",georgia:"🇬🇪",de:"🇩🇪",ghana:"🇬🇭",gibraltar:"🇬🇮",greece:"🇬🇷",greenland:"🇬🇱",grenada:"🇬🇩",guadeloupe:"🇬🇵",guam:"🇬🇺",guatemala:"🇬🇹",guernsey:"🇬🇬",guinea:"🇬🇳",guinea_bissau:"🇬🇼",guyana:"🇬🇾",haiti:"🇭🇹",honduras:"🇭🇳",hong_kong:"🇭🇰",hungary:"🇭🇺",iceland:"🇮🇸",india:"🇮🇳",indonesia:"🇮🇩",iran:"🇮🇷",iraq:"🇮🇶",ireland:"🇮🇪",isle_of_man:"🇮🇲",israel:"🇮🇱",it:"🇮🇹",cote_divoire:"🇨🇮",jamaica:"🇯🇲",jp:"🇯🇵",jersey:"🇯🇪",jordan:"🇯🇴",kazakhstan:"🇰🇿",kenya:"🇰🇪",kiribati:"🇰🇮",kosovo:"🇽🇰",kuwait:"🇰🇼",kyrgyzstan:"🇰🇬",laos:"🇱🇦",latvia:"🇱🇻",lebanon:"🇱🇧",lesotho:"🇱🇸",liberia:"🇱🇷",libya:"🇱🇾",liechtenstein:"🇱🇮",lithuania:"🇱🇹",luxembourg:"🇱🇺",macau:"🇲🇴",macedonia:"🇲🇰",madagascar:"🇲🇬",malawi:"🇲🇼",malaysia:"🇲🇾",maldives:"🇲🇻",mali:"🇲🇱",malta:"🇲🇹",marshall_islands:"🇲🇭",martinique:"🇲🇶",mauritania:"🇲🇷",mauritius:"🇲🇺",mayotte:"🇾🇹",mexico:"🇲🇽",micronesia:"🇫🇲",moldova:"🇲🇩",monaco:"🇲🇨",mongolia:"🇲🇳",montenegro:"🇲🇪",montserrat:"🇲🇸",morocco:"🇲🇦",mozambique:"🇲🇿",myanmar:"🇲🇲",namibia:"🇳🇦",nauru:"🇳🇷",nepal:"🇳🇵",netherlands:"🇳🇱",new_caledonia:"🇳🇨",new_zealand:"🇳🇿",nicaragua:"🇳🇮",niger:"🇳🇪",nigeria:"🇳🇬",niue:"🇳🇺",norfolk_island:"🇳🇫",northern_mariana_islands:"🇲🇵",north_korea:"🇰🇵",norway:"🇳🇴",oman:"🇴🇲",pakistan:"🇵🇰",palau:"🇵🇼",palestinian_territories:"🇵🇸",panama:"🇵🇦",papua_new_guinea:"🇵🇬",paraguay:"🇵🇾",peru:"🇵🇪",philippines:"🇵🇭",pitcairn_islands:"🇵🇳",poland:"🇵🇱",portugal:"🇵🇹",puerto_rico:"🇵🇷",qatar:"🇶🇦",reunion:"🇷🇪",romania:"🇷🇴",ru:"🇷🇺",rwanda:"🇷🇼",st_barthelemy:"🇧🇱",st_helena:"🇸🇭",st_kitts_nevis:"🇰🇳",st_lucia:"🇱🇨",st_pierre_miquelon:"🇵🇲",st_vincent_grenadines:"🇻🇨",samoa:"🇼🇸",san_marino:"🇸🇲",sao_tome_principe:"🇸🇹",saudi_arabia:"🇸🇦",senegal:"🇸🇳",serbia:"🇷🇸",seychelles:"🇸🇨",sierra_leone:"🇸🇱",singapore:"🇸🇬",sint_maarten:"🇸🇽",slovakia:"🇸🇰",slovenia:"🇸🇮",solomon_islands:"🇸🇧",somalia:"🇸🇴",south_africa:"🇿🇦",south_georgia_south_sandwich_islands:"🇬🇸",kr:"🇰🇷",south_sudan:"🇸🇸",es:"🇪🇸",sri_lanka:"🇱🇰",sudan:"🇸🇩",suriname:"🇸🇷",swaziland:"🇸🇿",sweden:"🇸🇪",switzerland:"🇨🇭",syria:"🇸🇾",taiwan:"🇹🇼",tajikistan:"🇹🇯",tanzania:"🇹🇿",thailand:"🇹🇭",timor_leste:"🇹🇱",togo:"🇹🇬",tokelau:"🇹🇰",tonga:"🇹🇴",trinidad_tobago:"🇹🇹",tunisia:"🇹🇳",tr:"🇹🇷",turkmenistan:"🇹🇲",turks_caicos_islands:"🇹🇨",tuvalu:"🇹🇻",uganda:"🇺🇬",ukraine:"🇺🇦",united_arab_emirates:"🇦🇪",uk:"🇬🇧",england:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",scotland:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",wales:"🏴󠁧󠁢󠁷󠁬󠁳󠁿",us:"🇺🇸",us_virgin_islands:"🇻🇮",uruguay:"🇺🇾",uzbekistan:"🇺🇿",vanuatu:"🇻🇺",vatican_city:"🇻🇦",venezuela:"🇻🇪",vietnam:"🇻🇳",wallis_futuna:"🇼🇫",western_sahara:"🇪🇭",yemen:"🇾🇪",zambia:"🇿🇲",zimbabwe:"🇿🇼",united_nations:"🇺🇳",pirate_flag:"🏴‍☠️"};function np(e,t){this.v=e,this.k=t}function xl(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function rp(e){if(Array.isArray(e))return e}function ip(e,t){var n=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(n!=null){var r,i,a,o,s=[],l=!0,c=!1;try{if(a=(n=n.call(e)).next,t===0){if(Object(n)!==n)return;l=!1}else for(;!(l=(r=a.call(n)).done)&&(s.push(r.value),s.length!==t);l=!0);}catch(f){c=!0,i=f}finally{try{if(!l&&n.return!=null&&(o=n.return(),Object(o)!==o))return}finally{if(c)throw i}}return s}}function ap(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function sp(e,t){return rp(e)||ip(e,t)||op(e,t)||ap()}function op(e,t){if(e){if(typeof e=="string")return xl(e,t);var n={}.toString.call(e).slice(8,-1);return n==="Object"&&e.constructor&&(n=e.constructor.name),n==="Map"||n==="Set"?Array.from(e):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?xl(e,t):void 0}}function Vi(e){var t,n;function r(a,o){try{var s=e[a](o),l=s.value,c=l instanceof np;Promise.resolve(c?l.v:l).then(function(f){if(c){var u=a==="return"&&l.k?a:"next";if(!l.k||f.done)return r(u,f);f=e[u](f).value}i(!!s.done,f)},function(f){r("throw",f)})}catch(f){i(2,f)}}function i(a,o){a===2?t.reject(o):t.resolve({value:o,done:a}),(t=t.next)?r(t.key,t.arg):n=null}this._invoke=function(a,o){return new Promise(function(s,l){var c={key:a,arg:o,resolve:s,reject:l,next:null};n?n=n.next=c:(t=n=c,r(a,o))})},typeof e.return!="function"&&(this.return=void 0)}Vi.prototype[typeof Symbol=="function"&&Symbol.asyncIterator||"@@asyncIterator"]=function(){return this},Vi.prototype.next=function(e){return this._invoke("next",e)},Vi.prototype.throw=function(e){return this._invoke("throw",e)},Vi.prototype.return=function(e){return this._invoke("return",e)};var rh=Object.entries,Sl=Object.setPrototypeOf,lp=Object.isFrozen,cp=Object.getPrototypeOf,hp=Object.getOwnPropertyDescriptor,mt=Object.freeze,_t=Object.seal,ur=Object.create,ih=typeof Reflect<"u"&&Reflect,Ts=ih.apply,Ms=ih.construct;mt||(mt=function(t){return t});_t||(_t=function(t){return t});Ts||(Ts=function(t,n){for(var r=arguments.length,i=new Array(r>2?r-2:0),a=2;a<r;a++)i[a-2]=arguments[a];return t.apply(n,i)});Ms||(Ms=function(t){for(var n=arguments.length,r=new Array(n>1?n-1:0),i=1;i<n;i++)r[i-1]=arguments[i];return new t(...r)});var Vn=ht(Array.prototype.forEach);Array.prototype.indexOf;var up=ht(Array.prototype.lastIndexOf),El=ht(Array.prototype.pop),$r=ht(Array.prototype.push);Array.prototype.slice;var fp=ht(Array.prototype.splice),gr=Array.isArray,qr=ht(String.prototype.toLowerCase),Ka=ht(String.prototype.toString),Al=ht(String.prototype.match),Fr=ht(String.prototype.replace),Tl=ht(String.prototype.indexOf),dp=ht(String.prototype.trim),pp=ht(Number.prototype.toString),mp=ht(Boolean.prototype.toString),Ml=typeof BigInt>"u"?null:ht(BigInt.prototype.toString),Cl=typeof Symbol>"u"?null:ht(Symbol.prototype.toString),Pt=ht(Object.prototype.hasOwnProperty),Dr=ht(Object.prototype.toString),kt=ht(RegExp.prototype.test),Sn=gp(TypeError);function ht(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var n=arguments.length,r=new Array(n>1?n-1:0),i=1;i<n;i++)r[i-1]=arguments[i];return Ts(e,t,r)}}function gp(e){return function(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];return Ms(e,n)}}function Ue(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:qr;if(Sl&&Sl(e,null),!gr(t))return e;let r=t.length;for(;r--;){let i=t[r];if(typeof i=="string"){const a=n(i);a!==i&&(lp(t)||(t[r]=a),i=a)}e[i]=!0}return e}function yp(e){for(let t=0;t<e.length;t++)Pt(e,t)||(e[t]=null);return e}function Ut(e){const t=ur(null);for(const r of rh(e)){var n=sp(r,2);const i=n[0],a=n[1];Pt(e,i)&&(gr(a)?t[i]=yp(a):a&&typeof a=="object"&&a.constructor===Object?t[i]=Ut(a):t[i]=a)}return t}function _p(e){switch(typeof e){case"string":return e;case"number":return pp(e);case"boolean":return mp(e);case"bigint":return Ml?Ml(e):"0";case"symbol":return Cl?Cl(e):"Symbol()";case"undefined":return Dr(e);case"function":case"object":{if(e===null)return Dr(e);const t=e,n=Ht(t,"toString");if(typeof n=="function"){const r=n(t);return typeof r=="string"?r:Dr(r)}return Dr(e)}default:return Dr(e)}}function Ht(e,t){for(;e!==null;){const r=hp(e,t);if(r){if(r.get)return ht(r.get);if(typeof r.value=="function")return ht(r.value)}e=cp(e)}function n(){return null}return n}function wp(e){try{return kt(e,""),!0}catch{return!1}}var Rl=mt(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Ja=mt(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),es=mt(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),bp=mt(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),ts=mt(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),vp=mt(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Pl=mt(["#text"]),Ll=mt(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","command","commandfor","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns"]),ns=mt(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dominant-baseline","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","pointer-events","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-orientation","text-rendering","textlength","type","u1","u2","unicode","values","vector-effect","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Nl=mt(["accent","accentunder","align","bevelled","close","columnalign","columnlines","columnspacing","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lquote","lspace","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),Gi=mt(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),kp=_t(/{{[\w\W]*|^[\w\W]*}}/g),xp=_t(/<%[\w\W]*|^[\w\W]*%>/g),Sp=_t(/\${[\w\W]*/g),Ep=_t(/^data-[\-\w.\u00B7-\uFFFF]+$/),Ap=_t(/^aria-[\-\w]+$/),Il=_t(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Tp=_t(/^(?:\w+script|data):/i),Mp=_t(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Cp=_t(/^html$/i),Rp=_t(/^[a-z][.\w]*(-[.\w]+)+$/i),Ol=_t(/<[/\w!]/g),zl=_t(/<[/\w]/g),Pp=_t(/<\/no(script|embed|frames)/i),Lp=_t(/\/>/i),$t={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,processingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},ah=["style","script","xmp","iframe","noembed","noframes","plaintext","noscript"],Np=mt(Ue({},ah)),Ip=(function(){const e={};return Vn(ah,t=>{e[t]=_t(new RegExp("</"+t+"(?=[\\t\\n\\f\\r />])","i"))}),mt(e)})(),Op=function(){return typeof window>"u"?null:window},zp=function(t,n){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let r=null;const i="data-tt-policy-suffix";n&&n.hasAttribute(i)&&(r=n.getAttribute(i));const a="dompurify"+(r?"#"+r:"");try{return t.createPolicy(a,{createHTML(o){return o},createScriptURL(o){return o}})}catch{return console.warn("TrustedTypes policy "+a+" could not be created."),null}},$l=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},En=function(t,n,r,i){return Pt(t,n)&&gr(t[n])?Ue(i.base?Ut(i.base):{},t[n],i.transform):r},rs=function(t,n,r){const i=Pt(t,n)?t[n]:void 0;return i&&typeof i=="object"?Ut(i):r()};function sh(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Op();const t=te=>sh(te);if(t.version="3.4.16",t.removed=[],!e||!e.document||e.document.nodeType!==$t.document||!e.Element)return t.isSupported=!1,t;let n=e.document;const r=n,i=r.currentScript;e.DocumentFragment;const a=e.HTMLTemplateElement,o=e.Node,s=e.Element,l=e.NodeFilter;e.NamedNodeMap===void 0&&(e.NamedNodeMap||e.MozNamedAttrMap),e.HTMLFormElement;const c=e.DOMParser,f=e.trustedTypes,u=s.prototype,h=Ht(u,"cloneNode"),p=Ht(u,"remove"),m=Ht(u,"removeAttributeNode"),y=Ht(u,"nextSibling"),g=Ht(u,"childNodes"),d=Ht(u,"parentNode"),_=Ht(u,"shadowRoot"),w=Ht(u,"attributes"),k=o&&o.prototype?Ht(o.prototype,"nodeType"):null,v=o&&o.prototype?Ht(o.prototype,"nodeName"):null,I=o&&o.prototype?Ht(o.prototype,"ownerDocument"):null,N=function(b){return k?k(b):b.nodeType},z=function(b){return v?v(b):b.nodeName};if(typeof a=="function"){const te=n.createElement("template");te.content&&te.content.ownerDocument&&(n=te.content.ownerDocument)}let W,q="",ae,G=!1,ke=0;const Y=function(){if(ke>0)throw Sn('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.')},B=function(b){Y(),ke++;try{return W.createHTML(b)}finally{ke--}},E=function(b){Y(),ke++;try{return W.createScriptURL(b)}finally{ke--}},A=function(){return G||(ae=zp(f,i),G=!0),ae},C=n,M=C.implementation,se=C.createNodeIterator,K=C.createDocumentFragment,de=C.getElementsByTagName,ye=r.importNode;let Q=$l();t.isSupported=typeof rh=="function"&&typeof d=="function"&&M&&M.createHTMLDocument!==void 0;const Be=kp,Fe=xp,Se=Sp,Ve=Ep,De=Ap,Je=Tp,D=Mp,T=Rp;let U=Il,L=null;const $=Ue({},[...Rl,...Ja,...es,...ts,...Pl]);let P=null;const Z=Ue({},[...Ll,...ns,...Nl,...Gi]);let H=Object.seal(ur(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),j=null,F=null;const V=Object.seal(ur(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let ie=!0,pe=!0,Te=!1,Le=!0,Ee=!1,we=!0,Oe=!1,gt=!1,et=null,Fn=null,Er=!1,gn=!1,nr=!1,rr=!1,Ar=!0,Ei=!1;const Ai="user-content-";let Tr=!0,Dn=!1,on={},ln=null;const Ti=Ue({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","selectedcontent","style","svg","template","thead","title","video","xmp"]);let Mr=null;const cn=Ue({},["audio","video","img","source","image","track"]);let S=null;const ee=Ue({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),he="http://www.w3.org/1998/Math/MathML",Re="http://www.w3.org/2000/svg",We="http://www.w3.org/1999/xhtml";let Ge=We,me=!1,fe=null;const Me=Ue({},[he,Re,We],Ka),lt=mt(["mi","mo","mn","ms","mtext"]);let tt=Ue({},lt);const yn=mt(["annotation-xml"]);let Un=Ue({},yn);const Cr=Ue({},["title","style","font","a","script"]);let jn=null;const Rr=["application/xhtml+xml","text/html"],za="text/html";let nt=null,_n=null;const Mi=n.createElement("form"),Bn=function(b){return b instanceof RegExp||b instanceof Function},Pr=function(){let b=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(_n&&_n===b)return;(!b||typeof b!="object")&&(b={}),b=Ut(b),jn=Rr.indexOf(b.PARSER_MEDIA_TYPE)===-1?za:b.PARSER_MEDIA_TYPE,nt=jn==="application/xhtml+xml"?Ka:qr,L=En(b,"ALLOWED_TAGS",$,{transform:nt}),P=En(b,"ALLOWED_ATTR",Z,{transform:nt}),fe=En(b,"ALLOWED_NAMESPACES",Me,{transform:Ka}),S=En(b,"ADD_URI_SAFE_ATTR",ee,{transform:nt,base:ee}),Mr=En(b,"ADD_DATA_URI_TAGS",cn,{transform:nt,base:cn}),ln=En(b,"FORBID_CONTENTS",Ti,{transform:nt}),j=En(b,"FORBID_TAGS",Ut({}),{transform:nt}),F=En(b,"FORBID_ATTR",Ut({}),{transform:nt}),on=Pt(b,"USE_PROFILES")?b.USE_PROFILES&&typeof b.USE_PROFILES=="object"?Ut(b.USE_PROFILES):b.USE_PROFILES:!1,ie=b.ALLOW_ARIA_ATTR!==!1,pe=b.ALLOW_DATA_ATTR!==!1,Te=b.ALLOW_UNKNOWN_PROTOCOLS||!1,Le=b.ALLOW_SELF_CLOSE_IN_ATTR!==!1,Ee=b.SAFE_FOR_TEMPLATES||!1,we=b.SAFE_FOR_XML!==!1,Oe=b.WHOLE_DOCUMENT||!1,gn=b.RETURN_DOM||!1,nr=b.RETURN_DOM_FRAGMENT||!1,rr=b.RETURN_TRUSTED_TYPE||!1,Er=b.FORCE_BODY||!1,Ar=b.SANITIZE_DOM!==!1,Ei=b.SANITIZE_NAMED_PROPS||!1,Tr=b.KEEP_CONTENT!==!1,Dn=b.IN_PLACE||!1,U=wp(b.ALLOWED_URI_REGEXP)?b.ALLOWED_URI_REGEXP:Il,Ge=typeof b.NAMESPACE=="string"?b.NAMESPACE:We,tt=rs(b,"MATHML_TEXT_INTEGRATION_POINTS",()=>Ue({},lt)),Un=rs(b,"HTML_INTEGRATION_POINTS",()=>Ue({},yn));const R=rs(b,"CUSTOM_ELEMENT_HANDLING",()=>ur(null));if(H=ur(null),Pt(R,"tagNameCheck")&&Bn(R.tagNameCheck)&&(H.tagNameCheck=R.tagNameCheck),Pt(R,"attributeNameCheck")&&Bn(R.attributeNameCheck)&&(H.attributeNameCheck=R.attributeNameCheck),Pt(R,"allowCustomizedBuiltInElements")&&typeof R.allowCustomizedBuiltInElements=="boolean"&&(H.allowCustomizedBuiltInElements=R.allowCustomizedBuiltInElements),_t(H),Ee&&(pe=!1),nr&&(gn=!0),on&&(L=Ue({},Pl),P=ur(null),on.html===!0&&(Ue(L,Rl),Ue(P,Ll)),on.svg===!0&&(Ue(L,Ja),Ue(P,ns),Ue(P,Gi)),on.svgFilters===!0&&(Ue(L,es),Ue(P,ns),Ue(P,Gi)),on.mathMl===!0&&(Ue(L,ts),Ue(P,Nl),Ue(P,Gi))),V.tagCheck=null,V.attributeCheck=null,Pt(b,"ADD_TAGS")&&(typeof b.ADD_TAGS=="function"?V.tagCheck=b.ADD_TAGS:gr(b.ADD_TAGS)&&(L===$&&(L=Ut(L)),Ue(L,b.ADD_TAGS,nt))),Pt(b,"ADD_ATTR")&&(typeof b.ADD_ATTR=="function"?V.attributeCheck=b.ADD_ATTR:gr(b.ADD_ATTR)&&(P===Z&&(P=Ut(P)),Ue(P,b.ADD_ATTR,nt))),Pt(b,"ADD_FORBID_CONTENTS")&&gr(b.ADD_FORBID_CONTENTS)&&(ln===Ti&&(ln=Ut(ln)),Ue(ln,b.ADD_FORBID_CONTENTS,nt)),Tr&&(L["#text"]=!0),Oe&&Ue(L,["html","head","body"]),L.table&&(Ue(L,["tbody"]),delete j.tbody),b.TRUSTED_TYPES_POLICY){if(typeof b.TRUSTED_TYPES_POLICY.createHTML!="function")throw Sn('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof b.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw Sn('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');const J=W;W=b.TRUSTED_TYPES_POLICY;try{q=B("")}catch(O){throw W=J,O}}else b.TRUSTED_TYPES_POLICY===null?(W=void 0,q=""):(W===void 0&&(W=A()),W&&typeof q=="string"&&(q=B("")));mt&&mt(b),_n=b},Ci=Ue({},[...Ja,...es,...bp]),Ri=Ue({},[...ts,...vp]),Xt=function(b,R,J){return R.namespaceURI===We?b==="svg":R.namespaceURI===he?b==="svg"&&(J==="annotation-xml"||tt[J]):!!Ci[b]},Pi=function(b,R,J){return R.namespaceURI===We?b==="math":R.namespaceURI===Re?b==="math"&&Un[J]:!!Ri[b]},Li=function(b,R,J){return R.namespaceURI===Re&&!Un[J]||R.namespaceURI===he&&!tt[J]?!1:!Ri[b]&&(Cr[b]||!Ci[b])},$a=function(b){let R=d(b);(!R||!R.tagName)&&(R={namespaceURI:Ge,tagName:"template"});const J=qr(b.tagName),O=qr(R.tagName);return fe[b.namespaceURI]?b.namespaceURI===Re?Xt(J,R,O):b.namespaceURI===he?Pi(J,R,O):b.namespaceURI===We?Li(J,R,O):!!(jn==="application/xhtml+xml"&&fe[b.namespaceURI]):!1},Kt=function(b){$r(t.removed,{element:b});try{d(b).removeChild(b)}catch{if(p(b),!d(b))throw Sn("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place")}},Ni=function(b,R,J){try{m(b,R)}catch{try{b.removeAttribute(J)}catch{}}},hn=function(b){ve(b);const R=g(b);if(R){const O=[];Vn(R,X=>{$r(O,X)}),Vn(O,X=>{try{p(X)}catch{}})}const J=w(b);if(J)for(let O=J.length-1;O>=0;--O){const X=J[O],ce=X&&X.name;typeof ce=="string"&&Ni(b,X,ce)}},un=function(b,R,J){if(!J)try{J=R.getAttributeNode(b)}catch{J=null}$r(t.removed,{attribute:J||null,from:R});try{J?m(R,J):R.removeAttribute(b)}catch{try{R.removeAttribute(b)}catch{}}if(b==="is")if(gn||nr)try{Kt(R)}catch{}else try{R.setAttribute(b,"")}catch{}},re=function(b){const R=w(b);if(R)for(let J=R.length-1;J>=0;--J){const O=R[J],X=O&&O.name;typeof X!="string"||P[nt(X)]||Ni(b,O,X)}},ve=function(b){const R=[b];for(;R.length>0;){const J=R.pop();N(J)===$t.element&&re(J);const O=g(J);if(O)for(let X=O.length-1;X>=0;--X)R.push(O[X])}},Ie=function(b,R){return we?b==="patchsrc"?!0:b==="for"&&R!=="label"&&R!=="output":!1},Ze=function(b){if(!we)return;const R=[b];for(;R.length>0;){const J=R.pop(),O=N(J);if(O===$t.processingInstruction||O===$t.comment&&kt(zl,J.data)){try{p(J)}catch{}continue}if(O===$t.element){const ce=J,_e=nt(z(J));try{ce.hasAttribute&&ce.hasAttribute("patchsrc")&&ce.removeAttribute("patchsrc"),ce.hasAttribute&&ce.hasAttribute("for")&&Ie("for",_e)&&ce.removeAttribute("for")}catch{}}const X=g(J);if(X)for(let ce=X.length-1;ce>=0;--ce)R.push(X[ce])}},it=function(b){let R=null,J=null;if(Er)b="<remove></remove>"+b;else{const ce=Al(b,/^[\r\n\t ]+/);J=ce&&ce[0]}jn==="application/xhtml+xml"&&Ge===We&&(b='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+b+"</body></html>");const O=W?B(b):b;if(Ge===We)try{R=new c().parseFromString(O,jn)}catch{}if(!R||!R.documentElement){R=M.createDocument(Ge,"template",null);try{R.documentElement.innerHTML=me?q:O}catch{}}const X=R.body||R.documentElement;return b&&J&&X.insertBefore(n.createTextNode(J),X.childNodes[0]||null),Ge===We?de.call(R,Oe?"html":"body")[0]:Oe?R.documentElement:X},Nt=function(b){const R=I?I(b):b.ownerDocument;return se.call(R||b,b,l.SHOW_ELEMENT|l.SHOW_COMMENT|l.SHOW_TEXT|l.SHOW_PROCESSING_INSTRUCTION|l.SHOW_CDATA_SECTION,null)},Rt=function(b){return b=Fr(b,Be," "),b=Fr(b,Fe," "),b=Fr(b,Se," "),b},It=function(b){var R;b.normalize();const J=I?I(b):b.ownerDocument,O=se.call(J||b,b,l.SHOW_TEXT|l.SHOW_COMMENT|l.SHOW_CDATA_SECTION|l.SHOW_PROCESSING_INSTRUCTION,null);let X=O.nextNode();for(;X;)X.data=Rt(X.data),X=O.nextNode();const ce=(R=b.querySelectorAll)===null||R===void 0?void 0:R.call(b,"template");ce&&Vn(ce,_e=>{Gt(_e.content)&&It(_e.content)})},vt=function(b){const R=v?v(b):null;return typeof R!="string"||nt(R)!=="form"?!1:typeof b.nodeName!="string"||typeof b.textContent!="string"||typeof b.removeChild!="function"||b.attributes!==w(b)||typeof b.removeAttribute!="function"||typeof b.removeAttributeNode!="function"||typeof b.getAttributeNode!="function"||typeof b.setAttribute!="function"||typeof b.namespaceURI!="string"||typeof b.insertBefore!="function"||typeof b.hasChildNodes!="function"||b.nodeType!==k(b)||b.childNodes!==g(b)},Gt=function(b){if(!k||typeof b!="object"||b===null)return!1;try{return k(b)===$t.documentFragment}catch{return!1}},wn=function(b){if(!k||typeof b!="object"||b===null)return!1;try{return typeof k(b)=="number"}catch{return!1}};function Ot(te,b,R){te.length!==0&&Vn(te,J=>{J.call(t,b,R,_n)})}const Ii=function(b,R){return!!(we&&b.hasChildNodes()&&!wn(b.firstElementChild)&&kt(Ol,b.textContent)&&kt(Ol,b.innerHTML)||we&&b.namespaceURI===We&&Np[R]&&(wn(b.firstElementChild)||typeof b.textContent=="string"&&kt(Ip[R],b.textContent))||b.nodeType===$t.processingInstruction||we&&b.nodeType===$t.comment&&kt(zl,b.data))},ir=function(b,R){if(b instanceof RegExp)return kt(b,R);if(b instanceof Function){for(var J=arguments.length,O=new Array(J>2?J-2:0),X=2;X<J;X++)O[X-2]=arguments[X];return!!b(R,...O)}return!1},Fa=function(b,R,J){if(!j[R]&&zi(R)&&ir(H.tagNameCheck,R))return!1;if(Tr&&!ln[R]){const O=d(b),X=g(b);if(X&&O){const ce=X.length;for(let _e=ce-1;_e>=0;--_e){const Ne=b===J?h(X[_e],!0):X[_e];O.insertBefore(Ne,y(b))}}}return Kt(b),!0},Oi=function(b,R,J,O){return b.length===0?R:R===J||R===O?Ut(R):R},bn=function(b,R){return b===R||d(b)!==null?!1:(Dn&&ve(b),!0)},Wn=function(b,R){if(Ot(Q.beforeSanitizeElements,b,null),bn(b,R))return!0;if(vt(b))return Kt(b),!0;const J=nt(z(b));if(L=Oi(Q.uponSanitizeElement,L,$,et),Ot(Q.uponSanitizeElement,b,{tagName:J,allowedTags:L}),bn(b,R))return!0;if(Ii(b,J))return Kt(b),!0;if(j[J]||!(V.tagCheck instanceof Function&&V.tagCheck(J))&&!L[J]){const O=Fa(b,J,R);return O===!1&&(Ot(Q.afterSanitizeElements,b,null),bn(b,R))?!0:O}if(N(b)===$t.element&&!$a(b)||(J==="noscript"||J==="noembed"||J==="noframes")&&kt(Pp,b.innerHTML))return Kt(b),!0;if(Ee&&b.nodeType===$t.text){const O=Rt(b.textContent);b.textContent!==O&&($r(t.removed,{element:b.cloneNode()}),b.textContent=O)}return Ot(Q.afterSanitizeElements,b,null),bn(b,R)},Lr=function(b,R,J){if(F[R]||Ie(R,b)||Ar&&(R==="id"||R==="name")&&(J in n||J in Mi))return!1;const O=P[R]||V.attributeCheck instanceof Function&&V.attributeCheck(R,b);return pe&&kt(Ve,R)||ie&&kt(De,R)?!0:O?S[R]||kt(U,Fr(J,D,""))||(R==="src"||R==="xlink:href"||R==="href")&&b!=="script"&&Tl(J,"data:")===0&&Mr[b]||Te&&!kt(Je,Fr(J,D,""))?!0:!J:zi(b)&&ir(H.tagNameCheck,b)&&ir(H.attributeNameCheck,R,b)||R==="is"&&H.allowCustomizedBuiltInElements&&ir(H.tagNameCheck,J)},Wt=Ue({},["annotation-xml","color-profile","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","missing-glyph"]),zi=function(b){return!Wt[qr(b)]&&kt(T,b)},Nr=function(b,R,J,O){if(W&&typeof f=="object"&&typeof f.getAttributeType=="function"&&!J)switch(f.getAttributeType(b,R)){case"TrustedHTML":return B(O);case"TrustedScriptURL":return E(O)}return O},Ce=function(b,R,J,O){try{return J?b.setAttributeNS(J,R,O):b.setAttribute(R,O),vt(b)?(Kt(b),!1):!0}catch{return un(R,b),!1}},Ir=function(b,R){if(Ot(Q.beforeSanitizeAttributes,b,null),bn(b,R))return;const J=b.attributes;if(!J||vt(b))return;P=Oi(Q.uponSanitizeAttribute,P,Z,Fn);const O={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:P,forceKeepAttr:void 0};let X=J.length;const ce=nt(b.nodeName);for(;X--;){const _e=J[X],Ne=_e.name,st=_e.namespaceURI,At=_e.value,vn=nt(Ne),Da=At;let Tt=Ne==="value"?Da:dp(Da),yo=!1;if(O.attrName=vn,O.attrValue=Tt,O.keepAttr=!0,O.forceKeepAttr=void 0,Ot(Q.uponSanitizeAttribute,b,O),Tt=O.attrValue,Ei&&(vn==="id"||vn==="name")&&Tl(Tt,Ai)!==0&&(un(Ne,b,_e),Tt=Ai+Tt,yo=!0),we&&kt(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,Tt)){un(Ne,b,_e);continue}if(vn==="attributename"&&Al(Tt,"href")){un(Ne,b,_e);continue}if(!O.forceKeepAttr){if(!O.keepAttr){un(Ne,b,_e);continue}if(!Le&&kt(Lp,Tt)){un(Ne,b,_e);continue}if(Ee&&(Tt=Rt(Tt)),!Lr(ce,vn,Tt)){un(Ne,b,_e);continue}Tt=Nr(ce,vn,st,Tt),Tt!==Da&&Ce(b,Ne,st,Tt)&&yo&&El(t.removed)}}Ot(Q.afterSanitizeAttributes,b,null),bn(b,R)},at=function(b){let R=null;const J=Nt(b);for(Ot(Q.beforeSanitizeShadowDOM,b,null);R=J.nextNode();)if(Ot(Q.uponSanitizeShadowNode,R,null),Wn(R,b),Ir(R,b),Gt(R.content)&&at(R.content),N(R)===$t.element){const O=_(R);Gt(O)&&(He(O),at(O))}Ot(Q.afterSanitizeShadowDOM,b,null)},He=function(b){const R=[{node:b,shadow:null}];for(;R.length>0;){const J=R.pop();if(J.shadow){at(J.shadow);continue}const O=J.node,X=N(O)===$t.element,ce=g(O);if(ce)for(let _e=ce.length-1;_e>=0;--_e)R.push({node:ce[_e],shadow:null});if(X){const _e=v?v(O):null;if(typeof _e=="string"&&nt(_e)==="template"){const Ne=O.content;Gt(Ne)&&R.push({node:Ne,shadow:null})}}if(X){const _e=_(O);Gt(_e)&&R.push({node:null,shadow:_e},{node:_e,shadow:null})}}};return t.sanitize=function(te){let b=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},R=null,J=null,O=null,X=null;if(me=!te,me&&(te="<!-->"),typeof te!="string"&&!wn(te)&&(te=_p(te),typeof te!="string"))throw Sn("dirty is not a string, aborting");if(!t.isSupported)return te;gt?(L=et,P=Fn):Pr(b),(Q.uponSanitizeElement.length>0||Q.uponSanitizeAttribute.length>0)&&(L=Ut(L)),Q.uponSanitizeAttribute.length>0&&(P=Ut(P)),t.removed=[];const ce=Dn&&typeof te!="string"&&wn(te);if(ce){Ze(te);const st=z(te);if(typeof st=="string"){const At=nt(st);if(!L[At]||j[At])throw hn(te),Sn("root node is forbidden and cannot be sanitized in-place")}if(vt(te))throw hn(te),Sn("root node is clobbered and cannot be sanitized in-place");try{He(te)}catch(At){throw hn(te),At}}else if(wn(te))R=it("<!---->"),J=R.ownerDocument.importNode(te,!0),J.nodeType===$t.element&&J.nodeName==="BODY"||J.nodeName==="HTML"?R=J:R.appendChild(J),He(R);else{if(!gn&&!Ee&&!Oe&&te.indexOf("<")===-1)return W&&rr?B(te):te;if(R=it(te),!R)return gn?null:rr?q:""}R&&Er&&Kt(R.firstChild);const _e=ce?te:R;try{const st=Nt(_e);for(;O=st.nextNode();)Wn(O,_e),Ir(O,_e),Gt(O.content)&&at(O.content)}catch(st){throw ce&&(hn(te),Vn(t.removed,At=>{At.element&&ve(At.element)})),st}if(ce){let st=!1;if(Vn(t.removed,At=>{At.element&&(At.element===te&&(st=!0),ve(At.element))}),st)throw Sn("a node selected for removal could not be safely returned; refusing to sanitize in place");return Ee&&It(te),te}if(gn){if(Ee&&It(R),nr)for(X=K.call(R.ownerDocument);R.firstChild;)X.appendChild(R.firstChild);else X=R;return(P.shadowroot||P.shadowrootmode)&&(X=ye.call(r,X,!0)),X}let Ne=Oe?R.outerHTML:R.innerHTML;return Oe&&L["!doctype"]&&R.ownerDocument&&R.ownerDocument.doctype&&R.ownerDocument.doctype.name&&kt(Cp,R.ownerDocument.doctype.name)&&(Ne="<!DOCTYPE "+R.ownerDocument.doctype.name+`>
`+Ne),Ee&&(Ne=Rt(Ne)),W&&rr?B(Ne):Ne},t.setConfig=function(){let te=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};Pr(te),gt=!0,et=L,Fn=P},t.clearConfig=function(){_n=null,gt=!1,et=null,Fn=null,W=ae,q=""},t.isValidAttribute=function(te,b,R){_n||Pr({});const J=nt(te),O=nt(b);return Lr(J,O,R)},t.addHook=function(te,b){typeof b=="function"&&Pt(Q,te)&&$r(Q[te],b)},t.removeHook=function(te,b){if(Pt(Q,te)){if(b!==void 0){const R=up(Q[te],b);return R===-1?void 0:fp(Q[te],R,1)[0]}return El(Q[te])}},t.removeHooks=function(te){Pt(Q,te)&&(Q[te]=[])},t.removeAllHooks=function(){Q=$l()},t}var Zi=sh();function $p(){return typeof window<"u"&&window.document?window:typeof self<"u"?self:{document:{nodeType:9,createElement:()=>({}),createDocumentFragment:()=>({}),implementation:{createHTMLDocument:()=>({documentElement:{},body:{},createElement:()=>({}),createDocumentFragment:()=>({})})}},Element:class{},Node:class{},NodeFilter:{SHOW_ELEMENT:1,SHOW_TEXT:3},DOMParser:class{},trustedTypes:void 0}}var qt=null;function is(){return qt||(typeof Zi?.sanitize=="function"?qt=Zi.sanitize.bind(Zi):qt=Zi($p()),typeof qt=="function"&&typeof qt.sanitize=="function"?qt=qt.sanitize.bind(qt):typeof qt=="function"&&qt.isSupported===!1&&(qt=e=>String(e??""))),qt}var Fp=Sa({_sendToRenderer:()=>ch,_slugifyLocal:()=>Rs,_splitIntoSections:()=>hh,addMarkdownExtension:()=>Cs,detectFenceLanguages:()=>ga,detectFenceLanguagesAsync:()=>Ls,initRendererWorker:()=>Na,markdownPlugins:()=>In,parseMarkdownToHtml:()=>br,setMarkdownExtensions:()=>Bp,slugify:()=>be,streamParseMarkdown:()=>Ps,teardownRendererWorkerPool:()=>lh}),Dp=ac(),Up={intervalMs:500,targetMs:75,hysteresis:.25,cooldownMs:500,stepUp:1,stepDown:1},ni=null;function jp(){const e={size:Dp,minSize:2,autoScale:Up,messageCodec:"negotiated",maxQueueLength:100};try{typeof{}<"u"&&(e.debugLevel=0)}catch{}try{return Js("renderer",new Xs(tp,e))}catch{return{workers:[],postMessage:async()=>{throw new Error("renderer worker unavailable")}}}}function oh(){return ni||(ni=jp()),ni}function lh(){const e=ni;if(ni=null,!e)return Promise.resolve();eo("renderer",e);try{const t=e[Symbol.asyncDispose];return typeof t=="function"?Promise.resolve(t.call(e)).catch(()=>{}):(typeof e.drain=="function"?Promise.resolve(e.drain()):Promise.resolve()).catch(()=>{}).then(()=>{typeof e.terminate=="function"&&e.terminate()})}catch(t){return x("[markdown] teardownRendererWorkerPool failed",t),Promise.resolve()}}var Na=()=>oh().workers?.[0]?.worker?._underlying??null,ch=(e,t=3e3)=>Na?.()?oh().postMessage(e,void 0,{awaitResponse:!0,timeout:t}).then(n=>{if(n?.error)throw new Error(n.error);return n}).catch(n=>{throw(n?.message||"").includes("postMessage response timeout")?new Error("worker timeout"):n}):Promise.reject(new Error("renderer worker unavailable")),In=[];function Cs(e){if(e&&(typeof e=="object"||typeof e=="function")){In.push(e);try{$e.use(e)}catch(t){x("[markdown] failed to apply plugin",t)}}}function Bp(e){In.length=0,Array.isArray(e)&&In.push(...e.filter(t=>t&&typeof t=="object"));try{In.forEach(t=>$e.use(t))}catch(t){x("[markdown] failed to apply markdown extensions",t)}}function Rs(e){return be(e)}function hh(e,t){const n=String(e??"");if(!n||n.length<=t)return[n];const r=/^#{1,6}\s.*$/gm,i=[];let a;for(;(a=r.exec(n))!==null;)i.push(a.index);if(!i.length||i.length<2){const c=[];for(let f=0;f<n.length;f+=t)c.push(n.slice(f,f+t));return c}const o=[];i[0]>0&&o.push(n.slice(0,i[0]));for(let c=0;c<i.length;c++){const f=i[c],u=c+1<i.length?i[c+1]:n.length;o.push(n.slice(f,u))}const s=[];let l="";for(const c of o){if(!l&&c.length>=t){s.push(c);continue}l.length+c.length<=t?l+=c:(l&&s.push(l),l=c)}return l&&s.push(l),s}async function Ps(e,t,n={}){const r=n?.chunkSize?Number(n.chunkSize):65536,i=typeof t=="function"?t:()=>{},{content:a,data:o}=Yr(String(e??""));let s=a;try{s=String(s??"").replace(/:([^:\s]+):/g,(h,p)=>Wr[p]||h)}catch{}Na?.();const l=Date.now(),c=hh(s,r),f=ot(),u=new Map;for(let h=0;h<c.length;h++){const p=c[h],m=await br(p);let y=String(m?.html||""),g=[];if(f)try{const _=f.parseFromString(y,"text/html");_.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(w=>{try{const k=Number(w.tagName.substring(1)),v=(w.textContent||"").trim(),I=Rs(v),N=(u.get(I)||0)+1;u.set(I,N);const z=N===1?I:I+"-"+N;w.id=z,g.push({level:k,text:v,id:z})}catch{}});try{typeof XMLSerializer<"u"?y=new XMLSerializer().serializeToString(_.body).replace(/^<body[^>]*>/i,"").replace(/<\/body>$/i,""):y=Array.from(_.body.childNodes||[]).map(w=>typeof w?.outerHTML=="string"?w.outerHTML:typeof w?.textContent=="string"?w.textContent:"").join("")}catch{}}catch{}else try{const _=[];y=y.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(w,k,v,I)=>{const N=Number(k),z=I.replace(/<[^>]+>/g,"").trim(),W=Rs(z),q=(u.get(W)||0)+1;u.set(W,q);const ae=q===1?W:W+"-"+q;return _.push({level:N,text:z,id:ae}),`<h${N} ${(v||"").replace(/\s*(id|class)="[^"]*"/g,"")} id="${ae}">${I}</h${N}>`}),g=_}catch{}const d={index:h,isLast:h===c.length-1,meta:h===0?o||{}:{},toc:g};try{i(y,d)}catch{}}Ks("renderer-main-thread",Date.now()-l)}async function Wp(e){if(In?.length){let{content:r,data:i}=Yr(e||"");try{r=String(r??"").replace(/:([^:\s]+):/g,(o,s)=>Wr[s]||o)}catch{}$e.setOptions({gfm:!0});try{In.forEach(o=>$e.use(o))}catch(o){x("[markdown] apply plugins failed",o)}const a=is()($e.parse(r));try{const o=ot();if(o){const s=o.parseFromString(a,"text/html"),l=s.querySelectorAll("h1,h2,h3,h4,h5,h6"),c=[],f=new Set,u=h=>{const p={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},m=h<=2?"has-text-weight-bold":h<=4?"has-text-weight-semibold":"has-text-weight-normal";return(p[h]+" "+m).trim()};l.forEach(h=>{try{const p=Number(h.tagName.substring(1)),m=(h.textContent||"").trim();let y=be(m)||"heading",g=y,d=2;for(;f.has(g);)g=y+"-"+d,d+=1;f.add(g),h.id=g,h.className=u(p),c.push({level:p,text:m,id:g})}catch{}});try{(typeof s?.getElementsByTagName=="function"?Array.from(s.getElementsByTagName("img")):typeof s?.querySelectorAll=="function"?Array.from(s.querySelectorAll("img")):[]).forEach(h=>{try{const p=h.getAttribute?.("loading"),m=h.getAttribute?.("data-want-lazy");!p&&!m&&h.setAttribute?.("loading","lazy");try{const y=h.getAttribute?.("alt");if(!y||!String(y).trim()){const g=h.getAttribute?.("src")||"";if(g){const d=String(g).split("/").pop().replace(/\.[^.]+$/,"");d&&h.setAttribute("alt",d.replace(/[-_]+/g," "))}}}catch{}}catch{}})}catch{}try{s.querySelectorAll("pre code, code[class]").forEach(h=>{try{const p=h.getAttribute?.("class")||h.className||"",m=String(p??"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(m)try{h.setAttribute?.("class",m)}catch{h.className=m}else try{h.removeAttribute?.("class")}catch{h.className=""}}catch{}})}catch{}try{let h=null;try{typeof XMLSerializer<"u"?h=new XMLSerializer().serializeToString(s.body).replace(/^<body[^>]*>/i,"").replace(/<\/body>$/i,""):h=Array.from(s.body.childNodes||[]).map(p=>typeof p?.outerHTML=="string"?p.outerHTML:typeof p?.textContent=="string"?p.textContent:"").join("")}catch{try{h=s.body.innerHTML}catch{h=""}}return{html:h,meta:i||{},toc:c}}catch{return{html:"",meta:i||{},toc:c}}}}catch{}return{html:a,meta:i||{},toc:[]}}try{e=String(e??"").replace(/:([^:\s]+):/g,(r,i)=>Wr[i]||r)}catch{}let t;t=Na?.();try{if(Qe?.getLanguage?.("plaintext")&&/```\s*\n/.test(String(e??""))){let{content:r,data:i}=Yr(e||"");try{r=String(r??"").replace(/:([^:\s]+):/g,(l,c)=>Wr[c]||l)}catch{}$e.setOptions({gfm:!0,highlighted:(l,c)=>{try{return c&&Qe?.getLanguage?.(c)?Qe.highlight(l,{language:c}).value:Qe?.getLanguage?.("plaintext")?Qe.highlight(l,{language:"plaintext"}).value:l}catch{return l}}});let a=is()($e.parse(r));try{a=a.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g,(l,c)=>{try{if(c&&typeof Qe?.highlight=="function")try{const f=Qe.highlight(c,{language:"plaintext"});return`<pre><code>${f?.value?f.value:f}</code></pre>`}catch{try{if(typeof Qe?.highlightElement=="function"){const u={innerHTML:c};return Qe.highlightElement(u),`<pre><code>${u.innerHTML}</code></pre>`}}catch{}}}catch{}return l})}catch{}const o=[],s=new Set;return a=a.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(l,c,f,u)=>{const h=Number(c),p=u.replace(/<[^>]+>/g,"").trim();let m=be(p)||"heading",y=m,g=2;for(;s.has(y);)y=m+"-"+g,g+=1;s.add(y),o.push({level:h,text:p,id:y});const d={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},_=h<=2?"has-text-weight-bold":h<=4?"has-text-weight-semibold":"has-text-weight-normal",w=(d[h]+" "+_).trim();return`<h${h} ${((f||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${y}" class="${w}"`).trim()}>${u}</h${h}>`}),a=a.replace(/<img([^>]*)>/g,(l,c)=>/\bloading=/.test(c)?`<img${c}>`:/\bdata-want-lazy=/.test(c)?`<img${c}>`:`<img${c} loading="lazy">`),{html:a,meta:i||{},toc:o}}}catch{}if(!t)try{let{content:r,data:i}=Yr(e||"");try{r=String(r??"").replace(/:([^:\s]+):/g,(a,o)=>Wr[o]||a)}catch{}return $e.setOptions({gfm:!0,highlighted:(a,o)=>{try{return o&&Qe?.getLanguage?.(o)?Qe.highlight(a,{language:o}).value:Qe?.getLanguage?.("plaintext")?Qe.highlight(a,{language:"plaintext"}).value:a}catch{return a}}}),{html:is()($e.parse(r)),meta:i||{}}}catch{throw new Error("renderer worker required but unavailable")}const n=await ch({type:"render",md:e});if(!n||typeof n!="object"||n.html===void 0)throw new Error("renderer worker returned invalid response");try{const r=new Map,i=[],a=s=>{const l={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},c=s<=2?"has-text-weight-bold":s<=4?"has-text-weight-semibold":"has-text-weight-normal";return(l[s]+" "+c).trim()};let o=n.html;o=o.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(s,l,c,f)=>{const u=Number(l),h=f.replace(/<[^>]+>/g,"").trim(),p=(c||"").match(/\sid="([^"]+)"/),m=p?p[1]:be(h)||"heading",y=(r.get(m)||0)+1;r.set(m,y);const g=y===1?m:m+"-"+y;i.push({level:u,text:h,id:g});const d=a(u);return`<h${u} ${((c||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${g}" class="${d}"`).trim()}>${f}</h${u}>`});try{const s=typeof document<"u"&&document.documentElement?.getAttribute?.("data-nimbi-logo-moved")||"";if(s){const l=ot();if(l){const c=l.parseFromString(o,"text/html");(typeof c?.getElementsByTagName=="function"?Array.from(c.getElementsByTagName("img")):typeof c?.querySelectorAll=="function"?Array.from(c.querySelectorAll("img")):[]).forEach(f=>{try{const u=f?.getAttribute?.("src")||"";(u?new URL(u,location.href).toString():"")===s&&f.remove()}catch{}});try{typeof XMLSerializer<"u"?o=new XMLSerializer().serializeToString(c.body).replace(/^<body[^>]*>/i,"").replace(/<\/body>$/i,""):o=Array.from(c.body.childNodes||[]).map(f=>typeof f?.outerHTML=="string"?f.outerHTML:typeof f?.textContent=="string"?f.textContent:"").join("")}catch{try{o=c.body.innerHTML}catch{}}}else try{const c=s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");o=o.replace(new RegExp(`<img[^>]*src=\\"${c}\\"[^>]*>`,"g"),"")}catch{}}}catch{}return{html:o,meta:n.meta||{},toc:i}}catch{return{html:n.html,meta:n.meta||{},toc:n.toc||[]}}}async function br(e){const t=typeof performance?.now=="function"?performance.now():Date.now();try{return await Wp(e)}finally{const n=typeof performance?.now=="function"?performance.now():Date.now(),r=Math.max(0,n-t);yr("markdownParse"),yr(r<10?"markdownParseDurationLt10ms":r<50?"markdownParseDurationLt50ms":"markdownParseDurationGe50ms"),nn("[markdown] parse duration",{duration:r})}}function ga(e,t){const n=new Set,r=/```\s*([a-zA-Z0-9_\-+]+)?/g,i=new Set(["then","now","if","once","so","and","or","but","when","the","a","an","as","let","const","var","export","import","from","true","false","null","npm","run","echo","sudo","this","that","have","using","some","return","returns","function","console","log","error","warn","class","new","undefined","with","select","from","where","join","on","group","order","by","having","as","into","values","like","limit","offset","create","table","index","view","insert","update","delete","returning","and","or","not","all","any","exists","case","when","then","else","end","distance","geometry","you","which","would","why","cool","other","same","everything","check"]),a=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);let o;for(;o=r.exec(e);)if(o[1]){const s=o[1].toLowerCase();if(js.has(s)||t?.size&&s.length<3&&!t.has(s)&&!t.has(sn?.[s]))continue;if(t?.size){if(t.has(s)){const l=t.get(s);l&&n.add(l);continue}if(sn?.[s]){const l=sn[s];if(t.has(l)){const c=t.get(l)||l;n.add(c);continue}}}(a.has(s)||s.length>=5&&s.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(s)&&!i.has(s))&&n.add(s)}return n}async function Ls(e,t){return In?.length,ga(e||"",t)}function qp(e,t=150,n={}){let r=null;const i=!!n.leading;function a(...o){const s=this;if(r&&clearTimeout(r),i&&!r)try{e.apply(s,o)}catch{}r=setTimeout(()=>{if(r=null,!i)try{e.apply(s,o)}catch{}},t)}return a.cancel=()=>{r&&clearTimeout(r),r=null},a}function Hp(e){let t=!1,n=null,r=null;function i(...a){if(n=a,r=this,t)return;t=!0;try{e.apply(this,a)}catch{}n=null,r=null;const o=()=>{if(t=!1,!n)return;const s=n,l=r;n=null,r=null,t=!0;try{e.apply(l,s)}catch{}typeof requestAnimationFrame=="function"?requestAnimationFrame(o):setTimeout(o,16)};typeof requestAnimationFrame=="function"?requestAnimationFrame(o):setTimeout(o,16)}return i.cancel=()=>{t=!1,n=null,r=null},i}function Vp(){let e=[],t=!1;return function(r){if(typeof r!="function")return;const i={fn:r,cancelled:!1};if(e.push(i),!t)return t=!0,typeof requestAnimationFrame=="function"?requestAnimationFrame(()=>{t=!1;const a=e.slice(0);e.length=0;for(const o of a)try{o.cancelled||o.fn()}catch{}}):setTimeout(()=>{t=!1;const a=e.slice(0);e.length=0;for(const o of a)try{o.cancelled||o.fn()}catch{}},0),{cancel:()=>{i.cancelled=!0}}}}var Gp=Vp(),uh=`let B = typeof DOMParser < "u" ? new DOMParser() : null;
function Oe() {
	return B || (typeof DOMParser < "u" ? (B = new DOMParser(), B) : null);
}
const re = Error, Ie = typeof re.isError == "function" ? re.isError : (
/** @param {unknown} value */
(e) => e instanceof Error);
function ee(e) {
	return Ie(e);
}
function Re(e, t = "ERR_ITEM") {
	return !e || typeof e != "object" ? {
		error: !0,
		code: t,
		message: e ? String(e) : void 0,
		stack: void 0
	} : {
		error: !0,
		code: e.code || t,
		message: e.message,
		stack: e.stack
	};
}
function ne(e) {
	return !e || !e.error ? String(e) : \`\${e.code || "ERR"}: \${e.message || ""}\`;
}
let H = null;
if (typeof process < "u" && process?.hrtime && typeof process.hrtime.bigint == "function") try {
	const e = Number(process.hrtime.bigint() / 1000000n);
	H = Date.now() - e;
} catch {
	H = null;
}
const se = typeof performance < "u" && typeof performance?.now == "function" && typeof performance?.timeOrigin == "number" ? () => performance.timeOrigin + performance.now() : null;
function ze(e) {
	if (se) try {
		const t = se();
		return e === void 0 || Math.abs(t - e) < 1e3 ? t : e;
	} catch {}
	if (H != null) try {
		const t = Number(process.hrtime.bigint() / 1000000n) + H;
		return e === void 0 || Math.abs(t - e) < 1e3 ? t : e;
	} catch {
		return e === void 0 ? Date.now() : e;
	}
	return e === void 0 ? Date.now() : e;
}
const ge = () => ze(Date.now());
function Le(e, t) {
	const { name: i, className: r, min: n = 0, integer: s = !1, allowInfinity: a = !1, fallback: o, invalidMessage: l, minMessage: c, integerMessage: d } = t;
	if (e == null) return o !== void 0 ? o : e;
	const u = Number(e);
	if (u === Number.POSITIVE_INFINITY && a) return u;
	if (!Number.isFinite(u)) throw new TypeError(l ?? \`\${r}: \\\`\${i}\\\` must be a finite number (received \${String(e)}). A non-finite limit would silently disable the check it guards.\`);
	if (s && !Number.isInteger(u)) throw new TypeError(d ?? \`\${r}: \\\`\${i}\\\` must be a whole number (received \${String(e)}). A fractional limit is silently rounded up by the first consumer, so it admits more than the number that was configured.\`);
	if (u < n) throw new TypeError(c ?? \`\${r}: \\\`\${i}\\\` must be >= \${n} (received \${u}).\`);
	return u;
}
function k(e, t) {
	const i = Le(e, t);
	if (typeof i != "number") throw new TypeError(\`\${t.className}: \\\`\${t.name}\\\` must be a number or have a \\\`fallback\\\`, but resolved to \${String(i)}.\`);
	return i;
}
function oe(e, t) {
	return \`\${t}: \\\`ttl\\\` must be a finite number of milliseconds or Infinity (received \${JSON.stringify(e) ?? String(e)}). A value that is not a number concatenates rather than adds, and every expiry comparison against it is false — so the entry would never expire.\`;
}
function Fe(e, t) {
	if (e == null || e === 1 / 0) return 0;
	if (typeof e != "number" && typeof e != "string") throw new TypeError(oe(e, t));
	const i = Number(e);
	if (!Number.isFinite(i)) throw new TypeError(oe(e, t));
	return i;
}
function Ue(e, t) {
	if (e == null) return;
	const i = Number(e);
	if (!Number.isFinite(i) || !Number.isInteger(i) || i < -2147483648 || i > 2147483647) throw new TypeError(\`\${t}: \\\`seed\\\` must be a whole number in the int32 range (received \${String(e)}). The sketch mixes the seed into each hash row and truncates it to 32 bits, so a fractional or out-of-range value would silently become a different seed than the one you asked for. Omit it entirely for a random seed.\`);
	return i;
}
function $e(e, { name: t, className: i, optional: r = !0 }) {
	if (e == null) {
		if (r) return null;
		throw new TypeError(\`\${i}: \\\`\${t}\\\` is required.\`);
	}
	if (typeof e != "function") throw new TypeError(\`\${i}: \\\`\${t}\\\` must be a function.\`);
	return e;
}
function F(e, t, i) {
	if (!e || typeof e != "object") return;
	const r = new Set(t);
	for (const n of Object.keys(e)) {
		if (r.has(n)) continue;
		const s = [\`\${i}: unknown option \\\`\${n}\\\`.\`], a = Be(n, t);
		a && s.push(\`Did you mean \\\`\${a}\\\`?\`), s.push(\`Accepted options: \${[...r].sort().join(", ")}.\`);
		const o = new TypeError(s.join(" "));
		throw o.code = "ERR_UNKNOWN_OPTION", o.option = n, o;
	}
}
function Be(e, t) {
	let i = null, r = 1 / 0;
	for (const s of t) {
		const a = We(e, s);
		a < r && (r = a, i = s);
	}
	if (i === null) return null;
	const n = Math.max(2, Math.floor(Math.max(e.length, i.length) / 3));
	return r > 0 && r <= n ? i : null;
}
function We(e, t) {
	if (e === t) return 0;
	if (e.length === 0) return t.length;
	if (t.length === 0) return e.length;
	let i = Array.from({ length: t.length + 1 }, (r, n) => n);
	for (let r = 1; r <= e.length; r += 1) {
		const n = [r];
		for (let s = 1; s <= t.length; s += 1) n[s] = Math.min(i[s] + 1, n[s - 1] + 1, i[s - 1] + (e[r - 1] === t[s - 1] ? 0 : 1));
		i = n;
	}
	return i[t.length];
}
const I = Object.freeze({
	error: "error",
	warn: "warn",
	info: "info",
	log: "log",
	debug: "debug",
	table: "table"
}), De = () => typeof globalThis < "u" && globalThis?.console ? globalThis.console : typeof self < "u" && self?.console ? self.console : typeof window < "u" && window?.console ? window.console : typeof global < "u" && global?.console ? global.console : null, O = De();
function je(e) {
	return typeof O?.[e] == "function";
}
function W(e, ...t) {
	const i = O;
	!i || typeof i[e] != "function" || i[e](...t);
}
function He(e) {
	return typeof e == "number" ? e : typeof e == "string" || typeof e == "boolean" ? Number(e) : e instanceof Number || e instanceof String || e instanceof Boolean ? Number(e.valueOf()) : NaN;
}
function Ve(e) {
	try {
		return JSON.stringify(e);
	} catch {
		try {
			const i = typeof WeakSet == "function" ? /* @__PURE__ */ new WeakSet() : /* @__PURE__ */ new Set();
			return JSON.stringify(e, function(r, n) {
				if (n && typeof n == "object") {
					if (i.has(n)) return "[Circular]";
					i.add(n);
				}
				return typeof n == "function" ? \`[Function: \${n.name || "anonymous"}]\` : typeof n == "symbol" ? String(n) : typeof n == "bigint" ? n.toString() + "n" : n;
			});
		} catch {
			try {
				return String(e);
			} catch {
				return "[Unserializable]";
			}
		}
	}
}
var qe = class {
	/**
	* Create a PowerLogger instance.
	* @param {number} [level=0] Initial debug level (0..3)
	* @param {PowerLoggerOptions} [options] - The \`PowerLoggerOptions\` typedef
	*   already existed and already declared \`name\`/\`formatter\`/\`output\`; the
	*   constructor was taking a bare \`{Object}\` instead, which is why reading
	*   any of them was an error and a custom sink needed a cast.
	*/
	constructor(e = 0, t = {}) {
		e && typeof e == "object" && [
			"level",
			"format",
			"name",
			"formatter",
			"output",
			"maxCounters"
		].some((r) => r in e) && (t = e, e = void 0), F(t, [
			"level",
			"format",
			"name",
			"formatter",
			"output",
			"maxCounters"
		], "PowerLogger"), this._debugLevel = 0, this._counters = /* @__PURE__ */ new Map(), this._countersDropped = 0;
		const i = Number(t?.maxCounters);
		this._maxCounters = Number.isFinite(i) && i >= 0 ? Math.floor(i) : 1e3, this._format = t?.format || "text", this.name = t?.name || null, this._formatter = typeof t?.formatter == "function" ? t.formatter : null, this._output = typeof t?.output == "function" ? t.output : null, this.setDebugLevel(e ?? t.level ?? 0);
	}
	/**
	* Set the global debug level.
	*
	* Coerced with \`Number()\` and clamped to 0..3; anything that does not coerce
	* to a finite non-negative number leaves the level at 0. See
	* {@link coerceDebugLevel} for what the coercion accepts.
	*
	* @param {number} level - Integer in range 0..3
	* @returns {void}
	*/
	setDebugLevel(e) {
		const t = He(e);
		this._debugLevel = Number.isFinite(t) && t >= 0 ? Math.max(0, Math.min(3, Math.floor(t))) : 0;
	}
	/**
	* Get the current debug level.
	* @returns {number} The configured debug level (0..3)
	*/
	getDebugLevel() {
		return this._debugLevel;
	}
	/**
	* Determine whether the current debug level is >= \`level\`.
	* @param {number} [level=1]
	* @returns {boolean}
	*/
	isDebugLevel(e = 1) {
		return Number(this._debugLevel) >= Number(e || 1);
	}
	/**
	* Convenience: whether any debugging is enabled (level > 0).
	* @returns {boolean}
	*/
	isDebug() {
		return this.isDebugLevel(1);
	}
	/**
	* Normalize log arguments by lazily evaluating function values.
	* @private
	* @param {any[]} args
	* @returns {any[]}
	*/
	_resolveLogArgs(e) {
		return e.map((t) => {
			if (typeof t == "function") try {
				return t();
			} catch (i) {
				return i;
			}
			return t;
		});
	}
	/**
	* Internal helper to emit logs with unified JSON/text formatting.
	* @private
	* @param {number} threshold - minimum debug level required to emit
	* @param {PowerLoggerConsoleMethod} consoleMethod - name of console method to call (error, warn, info, log, debug)
	* @param {string} levelLabel - textual level label for JSON mode
	* @param {any[]} args - original arguments array
	* @param {PowerLoggerEmitOptions} [opts]
	*/
	_emit(e, t, i, r, n = {}) {
		if (!this.isDebugLevel(e)) return;
		const s = this._resolveLogArgs(r);
		let a = {
			level: i,
			msg: n.msgArray ? s : s.length === 1 ? s[0] : s,
			ts: ge(),
			format: this._format
		};
		if (this.name && (a.name = this.name), this._formatter) try {
			const o = this._formatter(a);
			if (o != null) {
				if (typeof o == "string") {
					if (this._output) {
						try {
							this._output(o);
						} catch (l) {
							this._emitSinkError(l);
						}
						return;
					}
					W(t, o);
					return;
				}
				a = o;
			}
		} catch {}
		if (this._output) {
			try {
				this._output(a);
			} catch (o) {
				this._emitSinkError(o);
			}
			return;
		}
		if (je(t)) if (this._format === "json") try {
			W(t, typeof a == "string" ? a : Ve(a));
		} catch {
			try {
				W(t, ...Array.isArray(s) ? s : [s]);
			} catch {}
		}
		else W(t, ...s);
	}
	/**
	* Report a failure raised by a user-supplied log sink.
	*
	* A sink that throws must not be able to take the logger - and therefore the
	* pool, cache or circuit that owns it - down with it, but the failure still
	* has to be visible somewhere. Escalate to \`console.error\` once, guarded, and
	* give up if that fails too.
	*
	* @param {any} err - The value thrown by the sink.
	* @returns {void}
	*/
	_emitSinkError(e) {
		try {
			typeof console < "u" && typeof console.error == "function" && console.error("PowerLogger: log sink threw", e);
		} catch {}
	}
	/**
	* Log an error-level message when debug level is >= 1.
	* Accepts values or functions (lazy evaluated).
	*
	* Errors are formatted on the way through rather than left to the transport,
	* so a sink always receives a readable message instead of an \`Error\` object.
	*
	* The narrowing is \`isError()\`, and the second clause is **not** redundant -
	* it is what decides plain objects, which are formatted by \`normalizeError\`
	* like errors are.
	*
	* It was previously \`a instanceof Error || (a && typeof a === 'object')\`, and
	* that object clause is why this method was **already** realm-safe: a
	* cross-realm \`Error\` fails \`instanceof\` but is \`typeof 'object'\`, and
	* \`normalizeError\` reads only \`.code\` / \`.message\` / \`.stack\`, all of which a
	* cross-realm error has. So the row's premise - that \`powerLogger\` was
	* realm-fragile - is false, and was verified by logging a \`vm\`-created
	* \`TypeError\` and a local one and diffing the emitted payloads (identical
	* once \`ts\` is stripped) *before* any edit.
	*
	* The \`instanceof\` half is changed anyway because \`isError()\` is the honest
	* test, it is what the other sites use, and leaving one \`instanceof\` behind
	* invites the reading that this method is realm-fragile when it never was.
	*
	* @param {...any} args
	* @returns {void}
	*/
	error(...e) {
		if (!this.isDebugLevel(1)) return;
		const t = e.map((i) => {
			try {
				if (i?.error) return ne(i);
				if (ee(i)) return ne(Re(i));
			} catch {}
			return i;
		});
		this._emit(1, "error", I.error, t);
	}
	/**
	* Log a warning-level message when debug level is >= 2.
	* @param {...any} args
	* @returns {void}
	*/
	warn(...e) {
		this._emit(2, "warn", I.warn, e);
	}
	/**
	* Log an info-level message when debug level is >= 3.
	* @param {...any} args
	* @returns {void}
	*/
	info(...e) {
		this._emit(3, "info", I.info, e);
	}
	/**
	* Log a verbose message when debug level is >= 3.
	* @param {...any} args
	* @returns {void}
	*/
	log(...e) {
		this._emit(3, "log", I.log, e);
	}
	/**
	* Log using \`console.debug\` when level >= 3 (alias for verbose debug output).
	* Accepts values or functions (lazy evaluated).
	* Supports JSON mode similar to other methods.
	* @param {...any} args
	* @returns {void}
	*/
	debug(...e) {
		this._emit(3, "debug", I.debug, e);
	}
	/**
	* Display tabular data. Uses \`console.table\` when available.
	* In JSON mode emits \`{ level: 'table', msg: args, ts }\` where \`msg\` is an array of arguments.
	* @param {...any} args
	* @returns {void}
	*/
	table(...e) {
		if (!this.isDebugLevel(3) || !O) return;
		if (this._format === "json") {
			this._emit(3, "log", I.table, e, { msgArray: !0 });
			return;
		}
		const t = this._resolveLogArgs(e);
		typeof O.table == "function" ? O.table(...t) : typeof O.log == "function" && O.log(...t);
	}
	/**
	* Increment an internal named counter (no-op when debug is disabled).
	* Useful for lightweight instrumentation in tests.
	* @param {string} name
	* @returns {void}
	*/
	incrementCounter(e) {
		if (!this.isDebug()) return;
		const t = String(e || "");
		if (!t) return;
		const i = this._counters.get(t);
		if (i !== void 0) {
			this._counters.delete(t), this._counters.set(t, i + 1);
			return;
		}
		if (this._maxCounters > 0 && this._counters.size >= this._maxCounters) {
			const r = this._counters.keys().next();
			r.done || (this._counters.delete(r.value), this._countersDropped += 1);
		}
		this._counters.set(t, 1);
	}
	/**
	* Read counters as a plain object snapshot.
	* @returns {Record<string,number>}
	*/
	getDebugCounters() {
		return Object.fromEntries(this._counters);
	}
	/**
	* How many counters have been dropped because the cap was reached.
	*
	* Exists because a silent cap is a cap nobody can trust: a logger quietly
	* discarding keys looks identical to a logger nobody incremented, and the
	* difference matters when you are reading the snapshot to work out what happened.
	* A plain number rather than a field on the snapshot, because the snapshot is
	* \`Record<string, number>\` and a reserved key would collide with a counter a
	* caller legitimately named \`dropped\`.
	*
	* @returns {number}
	*/
	getDebugCountersDropped() {
		return this._countersDropped;
	}
	/**
	* Reset all internal counters (test helper).
	*
	* The drop count is reset with them. Leaving it would mean a fresh
	* \`getDebugCountersDropped()\` reported drops from a previous life, which is the
	* "counter that is not reset when everything else is" bug this repo has hit
	* before on \`PowerCache._rejectedAdmission\`.
	*
	* @returns {void}
	*/
	resetDebugCounters() {
		this._counters = /* @__PURE__ */ new Map(), this._countersDropped = 0;
	}
};
const Ke = new qe(0);
function V(...e) {
	Ke.warn(...e);
}
const M = 64, Je = 6, Ge = 63, ae = .673, Ye = 27;
function Xe(e) {
	return e = e + 2654435761 | 0, e = Math.imul(e ^ e >>> 16, 73244475), e = Math.imul(e ^ e >>> 16, 73244475), (e ^ e >>> 16) >>> 0;
}
var Ze = class {
	/** @type {Uint8Array} One byte per register. Ranks run 1..27, so a byte —
	*  not a nibble — is what this needs; the earlier "low nibble" comment was
	*  wrong and would have capped the estimator at 15 leading zeros. */
	registers;
	constructor() {
		this.registers = new Uint8Array(M);
	}
	/**
	* Add an element to the estimator. The argument may be a raw value: it is
	* finalised internally, so \`addHash(0)\`, \`addHash(1)\` ... estimate correctly
	* rather than saturating.
	* @param {*} hash - A 32-bit hash value, or any value coercible to one.
	* @returns {void}
	*/
	addHash(e) {
		const t = Xe(e | 0), i = t & Ge, r = t >>> Je, n = r === 0 ? Ye : Math.min(26, Math.clz32(r) - 5);
		n > this.registers[i] && (this.registers[i] = n);
	}
	/**
	* Estimate the number of distinct elements added.
	* @returns {number} Cardinality estimate.
	*/
	cardinality() {
		let e = 0, t = 0;
		for (let i = 0; i < M; i++) {
			const r = this.registers[i];
			e += Math.pow(2, -r), r === 0 && (t += 1);
		}
		if (t === M) return 0;
		if (t > 0) {
			const i = ae * M * M / e;
			return i <= M * 2.5 ? Math.max(1, Math.round(M * Math.log(M / t))) : Math.round(i);
		}
		return Math.round(ae * M * M / e);
	}
	/**
	* Reset all registers to zero.
	* @returns {void}
	*/
	reset() {
		this.registers.fill(0);
	}
};
const le = 64, he = 4, ce = 10;
function Qe(e, t) {
	return e = e + t | 0, e = Math.imul(e ^ e >>> 16, 73244475), e = Math.imul(e ^ e >>> 16, 73244475), (e ^ e >>> 16) >>> 0;
}
function et(e) {
	const t = String(e);
	let i = -2128831035;
	for (let r = 0; r < t.length; r += 1) i = Math.imul(i ^ t.charCodeAt(r), 16777619);
	return i;
}
function tt(e) {
	const t = typeof e;
	return t === "function" || t === "object" && e !== null;
}
var it = class {
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
	constructor({ width: e = le, depth: t = he, sampleSize: i = ce, seed: r } = {}) {
		const n = Math.max(2, 1 << Math.ceil(Math.log2(Math.max(2, Math.floor(Number(e) || le))))), s = Math.max(1, Math.min(8, Math.floor(Number(t) || he)));
		this.width = n, this.depth = s, this.mask = n - 1, this.sampleSize = Math.max(1, Math.floor(Number(i) || ce)), this.counters = new Uint8Array(n * s >>> 1), this.sample = 0, this.resets = 0, this.seed = (Number.isFinite(r) ? Number(r) : Math.floor(Math.random() * 4294967295)) | 0, this._hll = new Ze(), this._ids = null, this._nextId = 0;
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
		if (!tt(e)) return et(e);
		const t = this._ids || (this._ids = /* @__PURE__ */ new WeakMap());
		let i = t.get(e);
		return i === void 0 && (i = this._nextId, this._nextId += 1, t.set(e, i)), i | 0;
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
		return t * this.width + (Qe(e, this.seed + t * 2654435761) & this.mask) | 0;
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
		const i = e >> 1, r = this.counters[i];
		this.counters[i] = e & 1 ? (r & 15 | (t & 15) << 4) & 255 : r & 240 | t & 15;
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
		let i = !1;
		for (let r = 0; r < this.depth; r += 1) {
			const n = this._indexFor(t, r), s = this._get(n);
			s < 15 && (this._set(n, s + 1), i = !0);
		}
		i && (this._hll.addHash(t), this.sample += 1, this.sample >= this.sampleSize && (this.reset(), this.sample = 0));
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
		let i = 15;
		for (let r = 0; r < this.depth; r += 1) {
			const n = this._get(this._indexFor(t, r));
			n < i && (i = n);
		}
		return i;
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
			for (let n = 0; n < r.length; n += 1) {
				const s = r[n];
				r[n] = s >>> 1 & 117901063 | (s >>> 5 & 117901063) << 4;
			}
		}
		for (let r = t & -4; r < t; r += 1) e[r] = e[r] >>> 1 & 7 | (e[r] >>> 5 & 7) << 4;
		this.resets += 1;
		const i = this._hll.cardinality();
		this._hll.reset(), this.sampleSize = Math.max(10, Math.round(10 * i));
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
const rt = ".";
function nt(e, t) {
	const i = {};
	if (typeof e != "string" || e === "" || t == null || typeof t != "object") return i;
	const r = (n, s) => {
		for (const [a, o] of Object.entries(n)) {
			const l = s ? \`\${s}\${rt}\${a}\` : a;
			o == null ? i[l] = null : Array.isArray(o) || (typeof o == "object" ? r(o, l) : typeof o == "number" && !Number.isFinite(o) ? i[l] = String(o) : (typeof o == "number" || typeof o == "boolean" || typeof o == "string") && (i[l] = o));
		}
	};
	return r(t, e), i;
}
var st = class {
	/**
	* @param {Object} [options]
	* @param {string} [options.prefix=''] Prepended to every series key, so two
	*   collectors in one process do not collide.
	*/
	constructor(e = {}) {
		F(e, ["prefix"], "MetricsCollector"), this._sources = /* @__PURE__ */ new Map(), this._prefix = typeof e?.prefix == "string" ? e.prefix : "";
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
		for (const [i, r] of this._sources) {
			let n;
			try {
				n = r();
			} catch (a) {
				t[i] = ee(a) ? a.message : String(a);
				continue;
			}
			const s = nt(this._prefix + i, n);
			for (const [a, o] of Object.entries(s)) e[a] = o;
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
const ot = new st();
function at(e, t, i) {
	const r = i?.observability;
	if (!r) return null;
	if (r !== !0) {
		if (!(typeof r == "object" && typeof r.register == "function")) throw new TypeError(\`\${t}: \\\`observability\\\` must be \\\`true\\\` or a MetricsCollector, not \${typeof r} (\${String(r)}).\`);
	}
	const n = r === !0 ? ot : r, s = e, a = s?.getStats, o = s?.stats, l = typeof a == "function" ? () => a.call(s) : typeof o == "function" ? () => o.call(s) : null;
	return l ? (n.register(t, l), {
		name: t,
		unregister: () => n.unregister(t)
	}) : null;
}
function lt(e) {
	return !e || typeof e.unregister != "function" ? !1 : e.unregister();
}
function Y(e, t, i = {}) {
	const r = setTimeout(e, t);
	return !i.keepProcessAlive && typeof r?.unref == "function" && r.unref(), r;
}
const K = 1e3, ht = 60 * K, ct = 30 * K, ft = 1e4;
Object.freeze({
	CONNECTING: 0,
	OPEN: 1,
	CLOSING: 2,
	CLOSED: 3
});
const ut = 1e3, fe = ht, dt = 200, _t = 16, mt = 4, pt = 1e6;
function gt(e) {
	const t = Math.min(Math.max(1, Number(e) || 1), pt), i = Math.ceil(_t * t / mt);
	return Math.max(2, 1 << Math.ceil(Math.log2(i)));
}
const yt = Object.freeze([
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
]), wt = Object.freeze([
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
var vt = class {
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
		F(e, wt, "PowerCache");
		const { maxEntries: t = 1 / 0, maxInflightRefreshes: i, maxWeight: r = 1 / 0, weightFn: n = () => 1, defaultTTL: s = fe, allowStale: a = !1, staleTtl: o = 1 / 0, fetchMethod: l = null, maxPoolSize: c = ut, rejectOversized: d = !1, onEvict: u = null, onExpire: m = null, initialPoolSize: p = 0, maxCleanupPerTick: _ = 100, defaultAsyncTimeout: f = ct, onError: h = null, policy: g = "lru", admission: b = "none", windowSize: E = 0, seed: v, now: y } = e;
		if (arguments.length > 0 && arguments[0] != null && typeof arguments[0] != "object") throw new TypeError("PowerCache options must be an object");
		if (this.maxEntries = k(t, {
			name: "maxEntries",
			className: "PowerCache",
			integer: !0,
			min: 0,
			allowInfinity: !0
		}), i === void 0 ? this.maxInflightRefreshes = Number.isFinite(this.maxEntries) ? this.maxEntries : 1024 : this.maxInflightRefreshes = k(i, {
			name: "maxInflightRefreshes",
			className: "PowerCache",
			integer: !0,
			min: 0
		}), this.maxWeight = k(r, {
			name: "maxWeight",
			className: "PowerCache",
			min: 0,
			allowInfinity: !0
		}), this.maxPoolSize = k(c, {
			name: "maxPoolSize",
			className: "PowerCache",
			integer: !0,
			min: 0,
			allowInfinity: !0
		}), this.weightFn = $e(n, {
			name: "weightFn",
			className: "PowerCache"
		}) ? n : () => 1, this.defaultTTL = s, this.allowStale = !!a, o !== 1 / 0 && !(Number.isFinite(o) && o >= 0)) throw new TypeError(\`PowerCache: \\\`staleTtl\\\` must be a non-negative finite number or Infinity (received \${String(o)}). An unparseable stale window would compare false against every entry and silently disable stale serving.\`);
		if (this.allowStale && !("staleTtl" in arguments[0])) throw new TypeError("PowerCache: \`allowStale\` requires an explicit \`staleTtl\`. A stale window with no bound serves a value expired at any point in the past — measured at five years — so the bound is required. Pass the window you can tolerate, or \`staleTtl: Infinity\` to opt out of it on purpose.");
		if (this.staleTtl = o, l != null && typeof l != "function") throw new TypeError("fetchMethod must be a function when supplied");
		this.fetchMethod = l, this._now = typeof y == "function" ? y : ge, this.rejectOversized = !!d, this.onEvict = typeof u == "function" ? u : null, this.onError = typeof h == "function" ? h : null, this._weightErrors = 0, this.onExpire = typeof m == "function" ? m : null, this.maxCleanupPerTick = Number.isFinite(+_) ? Math.max(1, +_) : 100, this._map = /* @__PURE__ */ new Map(), this._head = null, this._tail = null, this._pool = [];
		for (let w = 0; w < Math.min(p || 0, this.maxPoolSize); w++) this._pool.push({
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
		for (const w of yt) {
			const x = \`_\${w}\`;
			Object.defineProperty(this, w, {
				configurable: !0,
				enumerable: !1,
				get() {
					return this[x];
				},
				set(ke) {
					this[x] = ke;
				}
			});
		}
		if (this._cleanupTimer = null, this._cleanupRunning = !1, this._cleanupParams = null, this._cleanupCursor = null, this._cleanupCursorValid = !1, this._evictionCandidate = null, this._sieveHand = null, this._smallHead = null, this._smallTail = null, this._smallSize = 0, this._ghostHead = null, this._ghostTail = null, this._ghostSize = 0, this._smallMaxSize = 0, this._ghostMaxSize = 0, this._ghostMap = /* @__PURE__ */ new Map(), this._smallMap = /* @__PURE__ */ new Map(), this._policy = g === "slru" ? "slru" : g === "sieve" ? "sieve" : g === "s3fifo" ? "s3fifo" : "lru", this._policy === "s3fifo") {
			const w = Number.isFinite(this.maxEntries) ? this.maxEntries : 1e3;
			this._smallMaxSize = Math.max(1, Math.floor(w * .1)), this._ghostMaxSize = Math.max(1, Math.floor(w * .2));
		}
		const S = Ue(v, "PowerCache");
		this._sketch = b === "tinylfu" && this._policy === "lru" ? new it({
			width: gt(this.maxEntries),
			sampleSize: Math.max(1, dt * Math.min(this.maxEntries, 1e6)),
			seed: S
		}) : null, this._windowSize = this._sketch && this._policy === "lru" ? E === null ? Math.min(Math.max(4, Math.ceil(this.maxEntries * .01)), Math.floor(this.maxEntries / 4)) : Math.max(0, Math.floor(Number(E) || 0)) : 0, this._windowSize >= this.maxEntries && this.maxEntries >= 4 && (this._windowSize = Math.floor(this.maxEntries / 4)), this._windowStartMemo = null, this._windowTail = null, this._probationEnd = null, this._inflightPromises = /* @__PURE__ */ new Map(), this._inflightControllers = /* @__PURE__ */ new Map(), this._defaultAsyncTimeout = Number.isFinite(Number(f)) ? Math.max(0, Math.floor(Number(f))) : 3e4, this._metrics = at(this, "cache", arguments[0] || {});
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
	_allocNode(e, t, i, r) {
		const n = this._pool.pop() || {
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
		return n.key = e, n.value = t, n.weight = i || 0, n.expiresAt = r || 0, n.prev = null, n.next = null, n.inWindow = !1, n.visited = !1, n.queue = "main", n;
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
			const i = +t;
			return Number.isFinite(i) ? Math.max(0, i) : 0;
		}
		try {
			const i = +this.weightFn(e);
			return Number.isFinite(i) ? Math.max(0, i) : 0;
		} catch (i) {
			return this._weightErrors++, this._notifyError(i, "PowerCache weightFn threw"), 0;
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
		const i = e.key, r = e.value;
		this._unlinkNode(e);
		try {
			this.onExpire && this.onExpire(i, r);
		} catch (n) {
			this._notifyError(n, "PowerCache onExpire callback threw");
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
	_fetchValidNode(e, { ignoreExpiry: t = !1, countMiss: i = !1, allowExpired: r = !1, now: n } = {}) {
		let s = this._map.get(e);
		if (!s && (this._policy === "s3fifo" && (s = this._smallMap.get(e) || this._ghostMap.get(e)), !s)) return i && this._misses++, null;
		const a = t || !s.expiresAt ? 0 : n !== void 0 ? n : this._now();
		return a && s.expiresAt <= a ? r ? s : (this._removeExpiredNode(s, a), i && this._misses++, null) : s;
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
		const i = this._inflightControllers.get(e);
		return !i || i.signal.aborted ? !1 : (i.abort(/* @__PURE__ */ new Error(\`PowerCache: in-flight fetch for a \${t} key was aborted\`)), this._refreshesAborted += 1, !0);
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
	_refreshStaleEntry(e, t, { ttl: i = void 0, weight: r = void 0 } = {}) {
		if (this._inflightPromises.has(e)) return;
		if (this._inflightPromises.size >= this.maxInflightRefreshes) {
			this._refreshesSkipped += 1;
			return;
		}
		const n = new AbortController(), s = Promise.resolve().then(() => t(n.signal)).then((a) => {
			try {
				this.set(e, a, {
					ttl: i,
					weight: r
				});
			} catch (o) {
				this._notifyError(o, "PowerCache: storing a refreshed value threw");
			}
			return a;
		}).catch(() => {
			n.signal.aborted || (this._refreshesFailed += 1);
		}).finally(() => {
			this._inflightControllers.delete(e), this._inflightPromises.delete(e);
		});
		this._inflightPromises.set(e, s), this._inflightControllers.set(e, n);
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
			const i = t.next;
			i && (e.prev = t, e.next = i, t.next = e, i.prev = e);
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
		const i = e.next;
		return this._map.delete(e.key), this._currentWeight -= e.weight || 0, this._cleanupCursor === e && (this._cleanupCursor = i), this._cleanupCursorValid = !!this._cleanupCursor, t && (this._evictionCandidate = i), this._remove(e), i;
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
		const t = e.prev, i = e.next;
		t ? t.next = i : this._head = i, t || (this._evictionCandidate = this._head), i ? i.prev = t : this._tail = t, this._probationEnd === e && (this._probationEnd = t), this._policy === "sieve" && this._sieveHand === e && (this._sieveHand = e.next || this._head), this._policy === "s3fifo" && (e.queue === "small" ? this._s3fifoRemoveFromSmall(e) : e.queue === "ghost" && this._s3fifoRemoveFromGhost(e)), e.inWindow && (this._windowStartMemo = null, this._windowTail = null), e.prev = e.next = null;
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
		const t = e.prev, i = e.next;
		t ? t.next = i : this._smallHead = i, i ? i.prev = t : this._smallTail = t, this._smallMap.delete(e.key), this._smallSize -= 1;
	}
	/** @param {CacheNode} node */
	_s3fifoRemoveFromGhost(e) {
		const t = e.prev, i = e.next;
		t ? t.next = i : this._ghostHead = i, i ? i.prev = t : this._ghostTail = t, this._ghostMap.delete(e.key), this._ghostSize -= 1;
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
			const t = this._probationEnd === e, i = e.prev;
			if (this._tail === e) {
				t && (this._probationEnd = i);
				return;
			}
			this._remove(e), e.prev = this._tail, e.next = null, this._tail && (this._tail.next = e), this._tail = e, t && (this._probationEnd = i);
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
		const i = t.prev;
		e.prev = i, e.next = t, i ? i.next = e : (this._head = e, this._evictionCandidate = e), t.prev = e;
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
		const t = e.key, i = e.value;
		this._unlinkNode(e, { advanceEvictionCandidate: !0 }), this._evictions++;
		try {
			this.onEvict && this.onEvict(t, i, "evicted");
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
		const i = this._windowVictim();
		if (!(i != null && e >= this.maxEntries)) {
			this._promoteFromWindow(t);
			return;
		}
		if (!i) return;
		const r = i.key;
		this._sketch.estimate(t.key) > this._sketch.estimate(r) ? (this._evictNode(i), this._promoteFromWindow(t)) : (this._rejectedAdmission += 1, this._evictNode(t));
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
			const t = e.key, i = e.value;
			this._abortInflight(t, "evicted"), this._unlinkNode(e, { advanceEvictionCandidate: !0 }), this._evictions++;
			try {
				this.onEvict && this.onEvict(t, i, "evicted");
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
			const t = e.key, i = e.value;
			this._abortInflight(t, "evicted"), this._unlinkNode(e, { advanceEvictionCandidate: !1 }), this._evictions++;
			try {
				this.onEvict && this.onEvict(t, i, "evicted");
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
				const t = e.key, i = e.value;
				this._abortInflight(t, "evicted");
				try {
					this.onEvict && this.onEvict(t, i, "evicted");
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
				const t = e.key, i = e.value;
				this._abortInflight(t, "evicted"), this._unlinkNode(e, { advanceEvictionCandidate: !0 }), this._evictions++;
				try {
					this.onEvict && this.onEvict(t, i, "evicted");
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
		return e == null || e === 1 / 0 ? 0 : t + Fe(e, "PowerCache");
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
	_rejectIfOversized(e, t, i) {
		if (!this.rejectOversized || !Number.isFinite(this.maxWeight) || i <= this.maxWeight) return !1;
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
	_insertNew(e, t, i, r, n) {
		if (this._sketch && this._windowSize > 0) {
			const a = this._allocNode(e, t, i, r);
			return this._map.set(e, a), a.inWindow = !0, this._append(a), this._currentWeight += a.weight || 0, this._arbitrateWindow(n), !0;
		}
		if (this._sketch && this._map.size >= this.maxEntries) {
			const a = this._evictionCandidate || this._head, o = this._sketch.estimate(e);
			if (a && this._sketch.estimate(a.key) >= o) return this._rejectedAdmission += 1, !1;
		}
		const s = this._allocNode(e, t, i, r);
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
	set(e, t, { ttl: i = this.defaultTTL, weight: r = null } = {}) {
		const n = this._now(), s = this._expiresAt(i, n), a = this._computeWeight(t, r);
		if (this._rejectIfOversized(e, t, a)) return !1;
		let o = this._map.get(e);
		if (o === void 0 && this._policy === "s3fifo" && (o = this._smallMap.get(e) || this._ghostMap.get(e)), o !== void 0) this._updateExisting(o, t, a, s);
		else if (!this._insertNew(e, t, a, s, this._map.size)) return this;
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
	_updateExisting(e, t, i, r) {
		this._currentWeight -= e.weight || 0, e.value = t, e.weight = i, e.expiresAt = r, this._currentWeight += e.weight || 0, this._moveToTail(e);
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
	getOrFetch(e, t, i = {}) {
		const r = t ?? this.fetchMethod;
		return typeof r != "function" ? Promise.reject(/* @__PURE__ */ new TypeError("PowerCache.getOrFetch: no factory given and no \`fetchMethod\` configured")) : this.getOrSetAsync(e, r, i);
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
	getOrSet(e, t, { ttl: i = void 0, weight: r = void 0, staleWhileRevalidate: n = this.allowStale } = {}) {
		const s = this._now(), a = this._fetchValidNode(e, {
			countMiss: !1,
			allowExpired: n,
			now: s
		});
		if (a) if (a.expiresAt && a.expiresAt <= s) {
			if (typeof t == "function" && this._staleServable(a, s)) return this._moveToTail(a), this._hits++, this._staleServes++, this._refreshStaleEntry(e, t, {
				ttl: i,
				weight: r
			}), a.value;
			this._removeExpiredNode(a, s), this._misses++;
		} else return this._moveToTail(a), this._hits++, a.value;
		else this._misses++;
		if (typeof t == "function") {
			const o = t();
			return typeof o?.then == "function" ? o.then((l) => {
				try {
					this.set(e, l, {
						ttl: i,
						weight: r
					});
				} catch (c) {
					this._notifyError(c, "PowerCache: storing an async value threw");
				}
				return l;
			}) : (this.set(e, o, {
				ttl: i,
				weight: r
			}), o);
		}
		return this.set(e, t, {
			ttl: i,
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
	setMany(e, { ttl: t = void 0, weight: i = void 0 } = {}) {
		const r = this._now(), n = this._expiresAt(t, r);
		for (const s of e) {
			if (!s) continue;
			const [a, o] = s, l = this._computeWeight(o, i);
			if (this._rejectIfOversized(a, o, l)) continue;
			const c = this._map.get(a);
			if (c !== void 0) this._updateExisting(c, o, l, n);
			else if (!this._insertNew(a, o, l, n, this._map.size)) continue;
			this._sketch?.increment(a);
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
		const i = /* @__PURE__ */ new Map();
		for (const r of e) {
			const n = this._fetchValidNode(r, {
				ignoreExpiry: t,
				countMiss: !0
			});
			n && (this._moveToTail(n), this._hits++, i.set(r, n.value));
		}
		return i;
	}
	/**
	* Touch an entry: update its recency and optionally refresh TTL without
	* reading or modifying the stored value.
	* @param {*} key
	* @param {number} [ttl] - Optional per-call TTL in ms. Use \`null\`/\`Infinity\` to disable expiry.
	* @returns {boolean} True if the entry existed (and was not expired), false otherwise.
	*/
	touch(e, t = void 0) {
		const i = this._now(), r = this._fetchValidNode(e, { now: i });
		return r ? (t !== void 0 && (r.expiresAt = this._expiresAt(t, i)), this._moveToTail(r), !0) : !1;
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
	getOrSetAsync(e, t, { ttl: i = void 0, weight: r = void 0, staleWhileRevalidate: n = this.allowStale, timeout: s = void 0 } = {}) {
		if (typeof t != "function") return Promise.resolve(this.getOrSet(e, t, {
			ttl: i,
			weight: r
		}));
		const a = this._now(), o = this._map.get(e);
		if (o) if (o.expiresAt && o.expiresAt <= a) {
			if (n && this._staleServable(o, a)) return this._moveToTail(o), this._hits++, this._staleServes++, this._refreshStaleEntry(e, t, {
				ttl: i,
				weight: r
			}), Promise.resolve(o.value);
			this._removeExpiredNode(o, a);
		} else return this._moveToTail(o), this._hits++, Promise.resolve(o.value);
		if (this._inflightPromises.has(e)) return this._inflightPromises.get(e);
		this._misses++;
		const l = new AbortController();
		let c;
		try {
			c = Promise.resolve().then(() => t(l.signal));
		} catch (p) {
			return Promise.reject(p);
		}
		const d = Number.isFinite(Number(s)) ? Math.max(0, Math.floor(Number(s))) : Number.isFinite(Number(this._defaultAsyncTimeout)) ? this._defaultAsyncTimeout : void 0;
		let u = c;
		if (typeof d == "number" && Number.isFinite(d) && d > 0) {
			let p;
			u = new Promise((_, f) => {
				p = setTimeout(() => {
					try {
						f(/* @__PURE__ */ new Error("getOrSetAsync timeout"));
					} catch {}
				}, d), c.then((h) => {
					try {
						p && clearTimeout(p);
					} catch (g) {
						this._notifyError(g, "PowerCache: clearTimeout threw");
					}
					_(h);
				}, (h) => {
					try {
						p && clearTimeout(p);
					} catch (g) {
						this._notifyError(g, "PowerCache: clearTimeout threw");
					}
					f(h);
				});
			});
		}
		c.then((p) => {
			try {
				this.set(e, p, {
					ttl: i,
					weight: r
				});
			} catch (_) {
				this._notifyError(_, "PowerCache getOrSetAsync: storing a late value threw");
			}
		}, () => {});
		const m = u.finally(() => {
			this._abortInflight(e, "timed out"), this._inflightPromises.delete(e), this._inflightControllers.delete(e);
		});
		return this._inflightPromises.set(e, c), this._inflightControllers.set(e, l), m;
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
	hasEqual(e, t, i = {}) {
		const { ignoreExpiry: r = !1, maxNodes: n, compareFn: s } = i || {}, a = this._fetchValidNode(e, { ignoreExpiry: r });
		if (!a) return !1;
		const o = a.value;
		return o === t ? !0 : typeof o != "object" || o === null || typeof t != "object" || t === null ? o === t : R(o, t, bt({
			maxNodes: n,
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
		} catch (i) {
			this._notifyError(i, "PowerCache onEvict callback threw (deleted)");
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
		let i = 0;
		for (const r of t) if (this._map.get(r.key) === r) {
			this._abortInflight(r.key, "invalidated"), this._unlinkNode(r), this._evictions += 1, i += 1;
			try {
				this.onEvict && this.onEvict(r.key, r.value, "invalidated");
			} catch (n) {
				this._notifyError(n, "PowerCache onEvict callback threw (invalidated)");
			}
			this._freeNode(r);
		}
		return (!this._evictionCandidate || !D(this._evictionCandidate, this._head, this._tail)) && (this._evictionCandidate = this._head), i;
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
			const i = this._evictionCandidate || this._head;
			if (!i) break;
			this._abortInflight(i.key, "evicted"), this._unlinkNode(i, { advanceEvictionCandidate: !0 }), this._evictions += 1, t += 1;
			try {
				this.onEvict && this.onEvict(i.key, i.value, "evicted");
			} catch (r) {
				this._notifyError(r, "PowerCache onEvict callback threw");
			}
			this._freeNode(i);
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
		let i = 0, r = this._cleanupCursor && this._cleanupCursorValid ? this._cleanupCursor : this._head;
		for (; r && i < e;) {
			const n = r.next;
			if (r.expiresAt && r.expiresAt <= t) {
				const s = r.key, a = r.value;
				this._unlinkNode(r);
				try {
					this.onExpire && this.onExpire(s, a);
				} catch (o) {
					this._notifyError(o, "PowerCache onExpire callback threw");
				}
				this._freeNode(r), this._expirations++;
			}
			r = n, i++;
		}
		return this._cleanupCursor = r || this._head, this._cleanupCursorValid = !!this._cleanupCursor, i;
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
			fallback: Math.max(K, Math.min(this.defaultTTL || 6e4, fe))
		};
		let i, r;
		if (typeof e == "number") i = k(e, t), r = this.maxCleanupPerTick;
		else i = k(e.interval ?? e.intervalMs, t), r = Number.isFinite(Number(e.maxCleanupPerTick)) ? Math.max(1, Number(e.maxCleanupPerTick)) : this.maxCleanupPerTick;
		this.stopCleanup(), this._cleanupParams = {
			interval: i,
			maxCleanupPerTick: r
		}, this._cleanupTimer = Y(() => this._cleanupTick(), i);
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
		lt(this._metrics), this._metrics = null;
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
				this._cleanupParams && (this._cleanupTimer = Y(() => this._cleanupTick(), this._cleanupParams.interval));
				return;
			}
			this._cleanupRunning = !0;
			try {
				this._cleanupParams && this.cleanupExpiredUpTo(this._cleanupParams.maxCleanupPerTick);
			} finally {
				this._cleanupRunning = !1;
			}
			this._cleanupParams && (this._cleanupTimer = Y(() => this._cleanupTick(), this._cleanupParams.interval));
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
		let i = e === "MRU" ? this._tail : this._head, r = this.size;
		for (; i;) {
			if (r-- <= 0) return;
			const n = i[t];
			yield [i.key, i.value], D(i, this._head, this._tail) ? D(n, this._head, this._tail) ? i = n : i = i[t] : i = D(n, this._head, this._tail) ? n : null;
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
function D(e, t, i) {
	return e ? e.prev !== null || e.next !== null || e === t || e === i : !1;
}
function bt(e) {
	const t = e || {};
	return {
		seen: t.seen ?? null,
		nodes: 0,
		maxNodes: Number.isFinite(t.maxNodes) ? Math.max(1, Math.floor(Number(t.maxNodes))) : ft,
		compareFn: typeof t.compareFn == "function" ? t.compareFn : null,
		exhausted: !1
	};
}
function R(e, t, i, r = 0) {
	if (r > 100) return e === t;
	if (i.exhausted) return !1;
	if (i.nodes >= i.maxNodes) return i.exhausted = !0, !1;
	if (i.nodes += 1, e === t) return !0;
	if (i.compareFn) {
		const o = i.compareFn(e, t);
		if (o !== void 0) return !!o;
	}
	if (e == null || t == null || typeof e != "object" || typeof t != "object") return e === t;
	i.seen || (i.seen = /* @__PURE__ */ new WeakMap());
	let n = i.seen.get(e);
	if (n?.has(t)) return !0;
	if (n || (n = /* @__PURE__ */ new WeakSet(), i.seen.set(e, n)), n.add(t), Object.getPrototypeOf(e) !== Object.getPrototypeOf(t)) return !1;
	if (typeof Uint8Array < "u" && e instanceof Uint8Array) {
		if (!(t instanceof Uint8Array) || e.length !== t.length) return !1;
		for (let o = 0; o < e.length; o++) if (e[o] !== t[o]) return !1;
		return !0;
	}
	if (Array.isArray(e)) {
		if (!Array.isArray(t) || e.length !== t.length) return !1;
		for (let o = 0; o < e.length; o++) if (!R(e[o], t[o], i, r + 1)) return !1;
		return !0;
	}
	if (ArrayBuffer.isView(e)) {
		if (!ArrayBuffer.isView(t) || e.byteLength !== t.byteLength) return !1;
		const o = new Uint8Array(e.buffer, e.byteOffset || 0, e.byteLength), l = new Uint8Array(t.buffer, t.byteOffset || 0, t.byteLength);
		for (let c = 0; c < o.length; c++) if (o[c] !== l[c]) return !1;
		return !0;
	}
	if (e instanceof ArrayBuffer) {
		if (!(t instanceof ArrayBuffer) || e.byteLength !== t.byteLength) return !1;
		const o = new Uint8Array(e), l = new Uint8Array(t);
		for (let c = 0; c < o.length; c++) if (o[c] !== l[c]) return !1;
		return !0;
	}
	if (e instanceof Date) return t instanceof Date ? e.getTime() === t.getTime() : !1;
	if (e instanceof RegExp) return t instanceof RegExp ? e.toString() === t.toString() : !1;
	if (e instanceof Map) {
		if (!(t instanceof Map) || e.size !== t.size) return !1;
		for (const [o, l] of e) if (!t.has(o) || !R(l, t.get(o), i, r + 1)) return !1;
		return !0;
	}
	if (e instanceof Set) {
		if (!(t instanceof Set) || e.size !== t.size) return !1;
		let o = !0;
		for (const _ of e) if (_ !== null && typeof _ == "object") {
			o = !1;
			break;
		}
		if (o) {
			for (const _ of e) if (!t.has(_)) return !1;
			return !0;
		}
		const l = Array.from(t), c = new Array(l.length).fill(!1), d = /* @__PURE__ */ new Map();
		for (let _ = 0; _ < l.length; _++) d.set(l[_], _);
		const u = (_) => {
			try {
				return JSON.stringify(_, (f, h) => h instanceof Date ? {
					__type: "Date",
					v: h.getTime()
				} : h instanceof RegExp ? {
					__type: "RegExp",
					v: h.toString()
				} : typeof ArrayBuffer < "u" && ArrayBuffer.isView(h) ? {
					__type: "TypedArray",
					v: Array.from(new Uint8Array(h.buffer, h.byteOffset || 0, h.byteLength))
				} : typeof ArrayBuffer < "u" && h instanceof ArrayBuffer ? {
					__type: "ArrayBuffer",
					v: Array.from(new Uint8Array(h))
				} : h);
			} catch {
				return null;
			}
		}, m = /* @__PURE__ */ new Map(), p = [];
		for (let _ = 0; _ < l.length; _++) {
			const f = u(l[_]);
			if (f == null) p.push(_);
			else {
				const h = m.get(f);
				h ? h.push(_) : m.set(f, [_]);
			}
		}
		for (const _ of e) {
			const f = d.get(_);
			if (f !== void 0 && !c[f]) {
				c[f] = !0;
				continue;
			}
			const h = u(_);
			let g = !1;
			if (h != null) {
				const b = m.get(h) || [];
				for (const E of b) if (!c[E] && R(_, l[E], i, r + 1)) {
					c[E] = !0, g = !0;
					break;
				}
				if (g) continue;
			}
			for (let b = 0; b < l.length; b++) if (!c[b] && R(_, l[b], i, r + 1)) {
				c[b] = !0, g = !0;
				break;
			}
			if (!g) return !1;
		}
		return !0;
	}
	const s = Object.keys(e), a = Object.keys(t);
	if (s.length !== a.length) return !1;
	for (let o = 0; o < s.length; o++) {
		const l = s[o];
		if (!Object.prototype.hasOwnProperty.call(t, l) || !R(e[l], t[l], i, r + 1)) return !1;
	}
	return !0;
}
var U = class {
	/**
	* Create a PowerMemoizer.
	* @param {Function} [fn] - Optional function to memoize immediately.
	* @param {PowerMemoizerOptions} [options]
	*/
	constructor(e, t = {}) {
		F(t, [
			"keyResolver",
			"cacheOptions",
			"ttl",
			"weight"
		], "PowerMemoizer"), F(t, [
			"admission",
			"allowStale",
			"cacheOptions",
			"defaultAsyncTimeout",
			"defaultTTL",
			"fetchMethod",
			"initialPoolSize",
			"keyResolver",
			"maxCleanupPerTick",
			"maxEntries",
			"maxInflightRefreshes",
			"maxPoolSize",
			"maxWeight",
			"now",
			"observability",
			"onError",
			"onEvict",
			"onExpire",
			"policy",
			"rejectOversized",
			"staleTtl",
			"ttl",
			"weight",
			"weightFn",
			"windowSize"
		], "PowerCache");
		const { keyResolver: i = ue, cacheOptions: r = {}, ttl: n, weight: s } = t;
		if (this.keyResolver = typeof i == "function" ? i : ue, this.cache = new vt(r), this._inflight = /* @__PURE__ */ new Map(), this._defaultMemoizeOptions = {}, n !== void 0 && (this._defaultMemoizeOptions.ttl = n), s !== void 0 && (this._defaultMemoizeOptions.weight = s), this.run = () => {
			throw new TypeError("No function supplied to PowerMemoizer; call memoize(fn) to create a memoized wrapper.");
		}, this._originalFn = null, this._receiverIds = /* @__PURE__ */ new WeakMap(), this._nextReceiverId = 0, typeof e == "function") {
			this._originalFn = e;
			try {
				this._fnWrapper = this.memoize(e), this.run = (...a) => {
					if (typeof this._fnWrapper == "function") return this._fnWrapper(...a);
				};
			} catch {}
		}
	}
	/**
	* Wrap a function with memoization.
	* @private
	* @param {Function} fn - Function to memoize. May return a Promise.
	* @param {Object} [options]
	* @param {number} [options.ttl] - Per-entry TTL in ms (overrides cache default)
	* @param {number} [options.weight] - Optional explicit weight for the entry
	* @returns {Function} Memoized function
	*/
	/**
	* Build a cache key that includes the receiver's identity, so memoizing a
	* method keeps one entry per object instead of collapsing every caller's
	* result into a single shared entry.
	*
	* Object and function receivers get a monotonic id from a per-instance
	* \`WeakMap\`. Primitive receivers (\`memoized.call(5, x)\`) fall back to their
	* string form, which is still correct because the same primitive receiver
	* necessarily has the same state.
	*
	* @param {any} receiver - The \`this\` value the wrapper was called with.
	* @param {any[]} args - The call arguments.
	* @returns {string} Cache key scoped to \`receiver\`.
	* @private
	*/
	_receiverKey(e, t) {
		let i;
		return e !== null && (typeof e == "object" || typeof e == "function") ? (i = this._receiverIds.get(e), i === void 0 && (i = this._nextReceiverId++, this._receiverIds.set(e, i))) : i = \`p\${String(e)}\`, \`r\${i}:\${this.keyResolver(...t)}\`;
	}
	/**
	* Wrap \`fn\` so every call goes through this memoizer's cache.
	*
	* Documented because it is a real (private) seam: \`memoize()\` normalises the
	* options before calling it, and the declaration had no JSDoc at all, so the
	* emitted signature was \`{ ttl, weight }?: {}\` - a destructuring pattern typed
	* as the empty object, which is not assignable from anything. That is a
	* declaration error in the published \`.d.ts\`, not a runtime one.
	*
	* @param {F} fn - Function to wrap.
	* @param {{ttl?: number, weight?: number}} [options] Per-wrapper overrides merged
	*   over the defaults. Documented here for the reader; the parameter is
	*   destructured in the signature, so it is the inline cast on the default that
	*   actually types it - a \`@param\` tag cannot bind to it.
	* @returns {import('../jsdoc-types.js').MemoizedFunction<F>} The memoized wrapper.
	* @template {Function} F
	* @private
	*/
	_memoize(e, { ttl: t, weight: i } = {}) {
		if (typeof e != "function") throw new TypeError("fn must be a function");
		const r = this;
		return function(...s) {
			const a = this === void 0 || this === null ? null : this, o = a === null ? r.keyResolver(...s) : r._receiverKey(a, s), l = r.cache._fetchValidNode(o);
			if (l !== null) return l.value;
			if (r._inflight.has(o)) return r._inflight.get(o);
			const c = a === null ? e(...s) : e.apply(a, s);
			if (typeof c?.then == "function") {
				const d = (async () => {
					try {
						const u = await c;
						try {
							r.cache.set(o, u, {
								ttl: t,
								weight: i
							});
						} catch {}
						return u;
					} finally {
						r._inflight.delete(o);
					}
				})();
				return r._inflight.set(o, d), d;
			}
			return r.cache.set(o, c, {
				ttl: t,
				weight: i
			}), c;
		};
	}
	/**
	* Public API to memoize an arbitrary function using this PowerMemoizer instance's cache.
	* Mirrors the behavior used by the constructor when a function is supplied —
	* returns a callable memoized function with helpers attached (\`get\`, \`has\`, \`delete\`, \`clear\`, \`stats\`, \`cache\`).
	* @param {F} fn - Function to memoize
	* @param {Object} [options] - Optional per-wrapper options { ttl, weight }
	* @returns {import('../jsdoc-types.js').MemoizedFunction<F>} The memoized
	*   wrapper, callable like \`fn\` and
	*   carrying \`get\`/\`has\`/\`delete\`/\`clear\`/\`stats\`/\`cache\`/\`original\`.
	* @template {Function} F
	*/
	memoize(e, t = {}) {
		if (typeof e != "function") throw new TypeError("fn must be a function");
		const i = t && (Object.prototype.hasOwnProperty.call(t, "ttl") || Object.prototype.hasOwnProperty.call(t, "weight")) ? t : this._defaultMemoizeOptions, r = this._memoize(e, i), n = this;
		return r.get = function(...s) {
			return n._getFor(r, this, s);
		}, r.has = function(...s) {
			return n._hasFor(r, this, s);
		}, r.delete = function(...s) {
			return n._deleteFor(r, this, s);
		}, r.clear = () => this.clear(), r.stats = () => this.stats(), r.cache = this.cache, r.original = e, r;
	}
	/**
	* Retrieve a cached value for the given call args (if present).
	* @param  {...*} args
	* @returns {*|undefined}
	*/
	get(...e) {
		return this._lookup(this.keyResolver(...e));
	}
	/**
	* Check presence for the given call args.
	* @param  {...*} args
	* @returns {boolean}
	*/
	has(...e) {
		return this.cache.has(this.keyResolver(...e));
	}
	/**
	* Delete the cached entry for the given call args.
	* Also clears any inflight Promise for the key.
	* @param  {...*} args
	* @returns {boolean}
	*/
	delete(...e) {
		return this._evict(this.keyResolver(...e));
	}
	/**
	* Key an attached helper should use, given the helper's own receiver.
	*
	* The helpers are the only way to reach a **method**-memoized entry, and they
	* used to be arrow functions, which discarded their receiver entirely. So
	* \`memo.call(obj, 10)\` stored under \`r1:10\` while \`memo.get(10)\` looked up
	* \`10\`: the entry existed, was invisible, and could not be invalidated by any
	* of \`get\`/\`has\`/\`delete\`. They are ordinary functions now, and this is where
	* the receiver is turned back into a key.
	*
	* Calling a helper plainly — \`memo.get(10)\` — leaves the memoized function as
	* the receiver, and that must resolve the **unscoped** key, because a plain
	* \`memo(10)\` call is what stored it. So the guide's documented
	* \`get(...args)\` keeps working unchanged, and
	* \`memo.get.call(obj, 10)\` reaches the entry \`memo.call(obj, 10)\` stored.
	*
	* A \`null\`/absent receiver is the detached-helper case (\`const g = memo.get\`),
	* which resolved the unscoped key before this change and still does.
	*
	* @param {Function} memoizedFn - The wrapper the helper is attached to.
	* @param {any} receiver - The helper's \`this\`.
	* @param {any[]} args
	* @returns {string}
	* @private
	*/
	_scopedKey(e, t, i) {
		return t === e || t == null ? this.keyResolver(...i) : this._receiverKey(t, i);
	}
	/**
	* @param {string} key
	* @returns {*|undefined}
	* @private
	*/
	_lookup(e) {
		return this.cache.get(e);
	}
	/**
	* @param {string} key
	* @returns {boolean}
	* @private
	*/
	_evict(e) {
		return this._inflight.has(e) && this._inflight.delete(e), this.cache.delete(e);
	}
	/**
	* @param {Function} memoizedFn
	* @param {any} receiver
	* @param {any[]} args
	* @returns {*|undefined}
	* @private
	*/
	_getFor(e, t, i) {
		return this._lookup(this._scopedKey(e, t, i));
	}
	/**
	* @param {Function} memoizedFn
	* @param {any} receiver
	* @param {any[]} args
	* @returns {boolean}
	* @private
	*/
	_hasFor(e, t, i) {
		return this.cache.has(this._scopedKey(e, t, i));
	}
	/**
	* @param {Function} memoizedFn
	* @param {any} receiver
	* @param {any[]} args
	* @returns {boolean}
	* @private
	*/
	_deleteFor(e, t, i) {
		return this._evict(this._scopedKey(e, t, i));
	}
	/**
	* Clear all cached entries and any inflight markers.
	* @returns {void}
	*/
	clear() {
		this._inflight.clear(), this.cache.clear();
	}
	/**
	* Expose underlying cache stats.
	* @returns {Object}
	*/
	stats() {
		return this.cache.stats();
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
	* Release the underlying cache.
	*
	* \`PowerMemoizer\` owns no state of its own - it delegates to a \`PowerCache\`
	* - so disposal forwards to it. The inner cache is not replaced, so a
	* disposed memoizer's \`cache\` reference stays readable.
	*
	* @returns {void}
	*/
	[Symbol.dispose]() {
		typeof this.cache?.[Symbol.dispose] == "function" && this.cache[Symbol.dispose]();
	}
	/**
	* Named alias for the \`Symbol.dispose\` implementation, so callers who do not
	* want to reach for the symbol still have something to call.
	* @returns {void}
	*/
	dispose() {
		this[Symbol.dispose]();
	}
};
function z(e, t) {
	const i = typeof e;
	if (e === null) return "n:";
	if (i === "string") return "s:" + e.length + ":" + e;
	if (i === "number") return "d:" + String(e);
	if (i === "boolean") return "b:" + (e ? "1" : "0");
	if (i === "undefined") return "u:";
	if (i === "bigint") return "g:" + e.toString();
	if (i === "symbol") throw new TypeError("simpleArgsKey() does not support symbol arguments");
	if (i === "function") throw new TypeError("simpleArgsKey() does not support function arguments - two closures cannot be told apart. Pass a key explicitly, or supply a \`keyResolver\`.");
	if (t.has(e)) return "c:";
	t.add(e);
	try {
		if (Array.isArray(e)) {
			let s = "A:[";
			for (let a = 0; a < e.length; a++) a && (s += ","), s += z(e[a], t);
			return s + "]";
		}
		if (e instanceof Date) return "D:" + e.getTime();
		if (e instanceof RegExp) return "R:" + e.source + "/" + e.flags;
		if (ee(e)) return "E:" + e.name + ":" + e.message;
		if (e instanceof Map) {
			let s = "Mp:[", a = !0;
			for (const [o, l] of e) a || (s += ","), a = !1, s += z(o, t) + "=" + z(l, t);
			return s + "]";
		}
		if (e instanceof Set) {
			let s = "St:[", a = !0;
			for (const o of e) a || (s += ","), a = !1, s += z(o, t);
			return s + "]";
		}
		let r = "O:{", n = !0;
		for (const s of Object.keys(e)) n || (r += ","), n = !1, r += "s:" + s.length + ":" + s + "=" + z(e[s], t);
		return r + "}";
	} finally {
		t.delete(e);
	}
}
function ue(...e) {
	if (e.length === 0) return "";
	const t = /* @__PURE__ */ new Set();
	let i = "";
	for (let r = 0; r < e.length; r++) r && (i += "|"), i += z(e[r], t);
	return i;
}
const $ = (e) => e === void 0 ? "__undefined" : String(e), Et = new U(function(e) {
	return String(e ?? "").replace(/^[.\\/]+/, "");
}, {
	keyResolver: $,
	cacheOptions: { maxEntries: 2e3 }
}), St = new U(function(e) {
	return String(e ?? "").replace(/\\/+$/, "");
}, {
	keyResolver: $,
	cacheOptions: { maxEntries: 2e3 }
}), xt = new U(function(e) {
	return we(String(e ?? "")) + "/";
}, {
	keyResolver: $,
	cacheOptions: { maxEntries: 2e3 }
});
new U(function(e) {
	try {
		const t = String(e ?? "");
		return t.includes("%") ? t : encodeURI(t);
	} catch (t) {
		return V("[helpers] encodeURL failed", t), String(e ?? "");
	}
}, {
	keyResolver: $,
	cacheOptions: { maxEntries: 2e3 }
});
new U(function(e) {
	try {
		if (!e && e !== 0) return "";
		const t = String(e), i = {
			amp: "&",
			lt: "<",
			gt: ">",
			quot: "\\"",
			apos: "'",
			nbsp: " "
		};
		return t.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (r, n) => {
			if (!n) return r;
			if (n[0] === "#") try {
				return n[1] === "x" || n[1] === "X" ? String.fromCharCode(parseInt(n.slice(2), 16)) : String.fromCharCode(parseInt(n.slice(1), 10));
			} catch {
				return r;
			}
			return i[n] !== void 0 ? i[n] : r;
		});
	} catch {
		return String(e ?? "");
	}
}, {
	keyResolver: $,
	cacheOptions: { maxEntries: 2e3 }
});
function Mt(e) {
	return !e || typeof e != "string" ? !1 : /^(https?:)?\\/\\//.test(e) || e.startsWith("mailto:") || e.startsWith("tel:");
}
const X = (e) => Et.run(e);
function A(e) {
	return String(e ?? "").replace(/^.*\\//, "");
}
function ye(e, t = 2) {
	try {
		const i = String(e ?? "").split("/").filter(Boolean);
		return i.length ? i.slice(-Math.max(1, Math.min(t, i.length))).join("/") : "";
	} catch {
		return String(e ?? "");
	}
}
const we = (e) => St.run(e), At = (e) => xt.run(e);
function Tt(e) {
	try {
		const t = e();
		return t && typeof t.then == "function" ? t.catch((i) => {
			V("[helpers] safe swallowed error", i);
		}) : t;
	} catch (t) {
		V("[helpers] safe swallowed error", t);
	}
}
try {
	typeof globalThis < "u" && !globalThis.safe && (globalThis.safe = Tt);
} catch (e) {
	V("[helpers] global attach failed", e);
}
function j(e, t = null) {
	const i = encodeURIComponent(String(e ?? ""));
	return t ? \`?page=\${i}#\${encodeURIComponent(String(t))}\` : \`?page=\${i}\`;
}
function q(e) {
	return String(e ?? "").toLowerCase().trim().replace(/[^a-z0-9\\-\\s]+/g, "").replace(/\\s+/g, "-");
}
function de(e, t) {
	try {
		if (!e) return e;
		const i = String(t ?? "").replace(/^\\/+|\\/+$/g, "");
		if (!i) return String(e ?? "");
		let r = String(e ?? "").replace(/^\\/+/, "");
		const n = i + "/";
		for (; r.startsWith(n);) r = r.slice(n.length);
		return r === i ? "" : r;
	} catch {
		return String(e ?? "");
	}
}
function ve() {
	if (typeof DOMParser > "u") return null;
	const e = Oe();
	try {
		if (e?.constructor === DOMParser) return e;
	} catch {}
	return new DOMParser();
}
function Ct(e) {
	const t = /* @__PURE__ */ new Map();
	try {
		if (!e || typeof e != "object") return t;
		for (const [i, r] of Object.entries(e || {})) try {
			if (!i || !r) continue;
			t.set(String(r), String(i));
		} catch {}
	} catch {}
	return t;
}
function Nt(e, t) {
	try {
		const i = String(e ?? "");
		return i ? i.includes("/") || /\\.(?:md|html?)$/i.test(i) ? i : Ct(t?.pathToSlug).get(i) || e : e;
	} catch {
		return e;
	}
}
function Pt(e, t) {
	if (!e || !t) return null;
	try {
		if (t.has(e)) return t.get(e);
	} catch {}
	const i = A(e);
	try {
		if (i && t.has(i)) return t.get(i);
		const r = ye(e, 2);
		if (r && t.has(r)) return t.get(r);
	} catch {}
	return null;
}
function kt(e) {
	const t = /* @__PURE__ */ new Map();
	for (const [i, r] of Object.entries(e?.pathToSlug || {})) {
		if (!i || !r) continue;
		t.has(i) || t.set(i, r);
		const n = A(i);
		n && !t.has(n) && t.set(n, r);
		const s = ye(i, 2);
		s && !t.has(s) && t.set(s, r);
	}
	return t;
}
function T(e, t, i, r) {
	const n = String(i ?? ""), s = String(r ?? "");
	!n || !s || e.has(n) || (e.set(n, s), t.push({
		path: n,
		slug: s
	}));
}
async function _e(e, t) {
	const i = new URL(String(e ?? ""), String(t || (typeof location < "u" ? location.href : "http://localhost/"))), r = await fetch(i.toString());
	return !r || !r.ok ? null : await r.text();
}
function me(e, t) {
	if (!e) return null;
	if (!t) {
		const i = String(e).match(/^#\\s+(.+)$/m);
		return i?.[1] ? q(i[1].trim()) : null;
	}
	try {
		const i = ve();
		if (!i) return null;
		const r = i.parseFromString(String(e), "text/html"), n = r.querySelector("title")?.textContent?.trim(), s = r.querySelector("h1")?.textContent?.trim();
		return q(n || s || "") || null;
	} catch {
		return null;
	}
}
async function pe(e, t, i) {
	const r = Array.from(e || []);
	if (!r.length) return;
	const n = Math.max(1, Number(t) || 1);
	let s = 0;
	const a = Array.from({ length: Math.min(n, r.length) }, async () => {
		for (; s < r.length;) {
			const o = r[s];
			s += 1, await i(o);
		}
	});
	await Promise.all(a);
}
async function Ot(e, t, i, r = {}) {
	const n = ve();
	if (!n) return {
		html: String(e ?? ""),
		mappings: []
	};
	const s = n.parseFromString(String(e ?? ""), "text/html"), a = s.body.querySelectorAll("a");
	if (!a || !a.length) return {
		html: s.body.innerHTML,
		mappings: []
	};
	let o = "/";
	try {
		const f = new URL(String(t ?? ""), typeof location < "u" ? location.href : "http://localhost/");
		o = At(f.pathname);
	} catch {}
	i = Nt(i, r);
	const l = kt(r), c = [], d = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), m = [], p = [], _ = String(r?.homeSlug || "_home");
	for (const f of Array.from(a)) try {
		try {
			if (f?.closest?.("h1,h2,h3,h4,h5,h6")) continue;
		} catch {}
		const h = f.getAttribute("href") || "";
		if (!h || Mt(h)) continue;
		try {
			if ((h.startsWith("?") || h.includes("?")) && i) {
				const y = new URL(h, String(t || (typeof location < "u" ? location.href : "http://localhost/"))), S = y.searchParams.get("page");
				if (S && !S.includes("/")) {
					const w = i.includes("/") ? i.slice(0, i.lastIndexOf("/") + 1) : "";
					if (w) {
						const x = X(w + S);
						f.setAttribute("href", j(x, y.hash ? y.hash.replace(/^#/, "") : null));
						continue;
					}
				}
			}
		} catch {}
		if (h.startsWith("/") && !h.endsWith(".md")) continue;
		const g = h.match(/^([^#?]+\\.md)(?:#(.+))?$/);
		if (g) {
			let y = g[1];
			const S = g[2];
			!y.startsWith("/") && i && (y = (i.includes("/") ? i.slice(0, i.lastIndexOf("/") + 1) : "") + y);
			const w = new URL(y, String(t || (typeof location < "u" ? location.href : "http://localhost/"))).pathname;
			let x = w.startsWith(o) ? w.slice(o.length) : w;
			x = X(de(x, o)), m.push({
				node: f,
				rel: x,
				frag: S
			}), l.has(x) || d.add(x);
			continue;
		}
		let b = h;
		!h.startsWith("/") && i && (h.startsWith("#") ? b = i + h : b = (i.includes("/") ? i.slice(0, i.lastIndexOf("/") + 1) : "") + h);
		const E = new URL(b, String(t || (typeof location < "u" ? location.href : "http://localhost/"))).pathname || "";
		if (!E || !E.includes(o)) continue;
		let v = E.startsWith(o) ? E.slice(o.length) : E;
		if (v = X(de(v, o)), v = we(v), v || (v = _), !v.endsWith(".md")) {
			const y = Pt(v, l);
			if (y) f.setAttribute("href", j(y));
			else {
				const S = /\\.[^/]+$/.test(v) ? v : \`\${v}.html\`;
				u.add(S), p.push({
					node: f,
					rel: S,
					fallbackRel: v
				});
			}
		}
	} catch {}
	if (r?.allowProbe) await pe(d, 6, async (f) => {
		try {
			const h = me(await _e(f, t), !1);
			if (!h) return;
			T(l, c, f, h), T(l, c, A(f), h);
		} catch {}
	}), await pe(u, 5, async (f) => {
		try {
			const h = me(await _e(f, t), !0);
			if (!h) return;
			T(l, c, f, h), T(l, c, A(f), h);
		} catch {}
	});
	else {
		for (const f of d) {
			const h = q(A(f).replace(/\\.md$/i, ""));
			h && (T(l, c, f, h), T(l, c, A(f), h));
		}
		for (const f of u) {
			const h = q(A(f).replace(/\\.html$/i, ""));
			h && (T(l, c, f, h), T(l, c, A(f), h));
		}
	}
	for (const f of m) {
		const h = l.get(f.rel);
		f.node.setAttribute("href", j(h || f.rel, f.frag || null));
	}
	for (const f of p) {
		const h = l.get(f.rel) || l.get(A(f.rel)) || l.get(f.fallbackRel);
		f.node.setAttribute("href", j(h || f.rel));
	}
	return {
		html: s.body.innerHTML,
		mappings: c
	};
}
let N, P;
function It() {
	return N !== void 0 ? N === !1 ? null : N : typeof TextEncoder < "u" ? (N = new TextEncoder(), N) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (N = { encode: (e) => new Uint8Array(Buffer.from(e)) }, N) : null;
}
function L(e) {
	if (e instanceof ArrayBuffer) return !0;
	try {
		return typeof Reflect.get(ArrayBuffer.prototype, "byteLength", e) == "number";
	} catch {
		return !1;
	}
}
function be(e) {
	if (typeof SharedArrayBuffer > "u") return !1;
	if (e instanceof SharedArrayBuffer) return !0;
	try {
		return typeof Reflect.get(SharedArrayBuffer.prototype, "byteLength", e) == "number";
	} catch {
		return !1;
	}
}
function Rt() {
	return P !== void 0 ? P === !1 ? null : P : typeof TextDecoder < "u" ? (P = new TextDecoder(), P) : typeof Buffer < "u" && typeof Buffer.from == "function" ? (P = { decode: (e) => Buffer.from(e).toString("utf8") }, P) : null;
}
const Ee = (e, t) => {
	if (e instanceof Uint8Array) return e;
	if (ArrayBuffer.isView(e)) return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
	if (L(e)) return new Uint8Array(e);
	if (be(e)) return new Uint8Array(e);
	const i = t ?? JSON.stringify(e);
	if (typeof i != "string") throw new TypeError(\`PowerBuffer.o2u8: JSON.stringify returned \${i === void 0 ? "undefined" : typeof i} for a value of type \${typeof e}, which is not encodable. Functions, Symbols and \\\`undefined\\\` have no JSON representation.\`);
	const r = It();
	if (typeof r?.encode == "function") return r.encode(i);
	throw new Error("No TextEncoder or Buffer available to encode object");
}, Se = (e) => {
	let t;
	if (e instanceof Uint8Array) t = e;
	else if (ArrayBuffer.isView(e)) t = new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
	else if (L(e)) t = new Uint8Array(e);
	else if (be(e)) t = new Uint8Array(e);
	else if (typeof Buffer < "u" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(e)) t = new Uint8Array(e);
	else throw new TypeError("Unsupported input to u82o, expected ArrayBuffer/TypedArray/Buffer");
	const i = Rt();
	if (typeof i?.decode == "function") return JSON.parse(i.decode(t));
	throw new Error("No TextDecoder or Buffer available to decode object");
};
const C = Object.freeze({
	JSON: 0,
	RAW: 2
});
const xe = /* @__PURE__ */ new Set([
	"framed",
	"legacy",
	"negotiated"
]);
for (const e of [
	"add",
	"delete",
	"clear"
]) Object.defineProperty(xe, e, {
	value: () => {
		throw new TypeError(\`MESSAGE_CODECS is read-only: \\\`\${e}()\\\` would let a consumer widen the set of codecs a pool accepts, and PowerPool validates against it.\`);
	},
	enumerable: !1,
	writable: !1,
	configurable: !1
});
const zt = /* @__PURE__ */ new Map([[C.JSON, "json"], [C.RAW, "raw"]]), Lt = /* @__PURE__ */ new Map([["json", C.JSON], ["raw", C.RAW]]);
function Me() {
	return typeof structuredClone == "function";
}
function J(e) {
	return L(e) || typeof ArrayBuffer < "u" && ArrayBuffer.isView(e);
}
function Ae(e) {
	return J(e) ? "raw" : "json";
}
function Ft(e, t = {}) {
	const i = t.codec || Ae(e), r = Lt.get(i);
	if (r === void 0) throw new TypeError(\`PowerMessageCodec: unknown codec "\${i}". Expected "json" or "raw". For structured-clone speed on a MessagePort/Worker use encodeNativeEnvelope() instead.\`);
	let n;
	if (r === C.RAW) {
		if (!J(e)) throw new TypeError("PowerMessageCodec: the \\"raw\\" codec requires an ArrayBuffer or a typed array");
		n = L(e) ? new Uint8Array(e) : new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
	} else n = Ee(e);
	return Z(r, n);
}
function Z(e, t) {
	const i = new Uint8Array(6 + t.length);
	return i[0] = 1, i[1] = e, i[2] = t.length & 255, i[3] = t.length >>> 8 & 255, i[4] = t.length >>> 16 & 255, i[5] = t.length >>> 24 & 255, i.set(t, 6), i;
}
function Ut(e) {
	if (typeof e == "string") return Z(C.JSON, Ee(null, e));
	if (!J(e)) throw new TypeError("PowerMessageCodec: frameEncodedJson() requires a Uint8Array or a JSON string");
	return Z(C.JSON, G(e));
}
function Q(e, t = 0) {
	return (e[t + 2] | e[t + 3] << 8 | e[t + 4] << 16 | e[t + 5] << 24) >>> 0;
}
function te(e, t = {}) {
	const i = t.strict !== !1, r = G(e);
	if (r.length < 6) throw new RangeError(\`PowerMessageCodec: frame is \${r.length} bytes, shorter than the 6-byte header\`);
	const n = r[0];
	if (i && n !== 1) throw new RangeError(\`PowerMessageCodec: unsupported protocol version \${n} (expected 1)\`);
	const s = zt.get(r[1]);
	if (s === void 0) throw new RangeError(\`PowerMessageCodec: unknown codec id \${r[1]}\`);
	const a = Q(r);
	if (r.length < 6 + a) throw new RangeError(\`PowerMessageCodec: frame declares a \${a}-byte payload but only \${r.length - 6} bytes are present (truncated frame)\`);
	const o = 6, l = o + a;
	return {
		version: n,
		codec: s,
		value: s === "raw" ? t.rawAsBytes === !0 ? r.subarray(o, l) : r.slice(o, l) : Se(r.subarray(o, l)),
		byteLength: l
	};
}
function $t(e) {
	if (e?.maxFrameBytes === void 0) throw new TypeError("PowerMessageCodec: createFrameDecoder() requires \`maxFrameBytes\`. A frame declares its own payload length, so a peer that sends a header and then stops would pin this buffer at whatever size it named. Pass \`Infinity\` to accept that risk explicitly.");
	const t = k(e.maxFrameBytes, {
		name: "maxFrameBytes",
		className: "PowerMessageCodec.createFrameDecoder",
		min: 6,
		integer: !0,
		allowInfinity: !0
	}), i = e.strict !== !1, r = e.rawAsBytes === !0, n = 1024;
	let s = new Uint8Array(n), a = 0, o = 0;
	function l(c) {
		if (o + c <= s.length) return;
		const d = o - a;
		if (d + c <= s.length) s.copyWithin(0, a, o);
		else {
			let u = s.length || n;
			for (; u < d + c;) u *= 2;
			const m = new Uint8Array(u);
			m.set(s.subarray(a, o)), s = m;
		}
		a = 0, o = d;
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
			const d = G(c);
			l(d.length), s.set(d, o), o += d.length;
			const u = [];
			for (; o - a >= 6;) {
				const m = Q(s, a);
				if (6 + m > t) throw new RangeError(\`PowerMessageCodec: frame declares \${6 + m} bytes, over the maxFrameBytes limit of \${t}\`);
				if (o - a < 6 + m) break;
				const p = te(s.subarray(a, o), {
					strict: i,
					rawAsBytes: r
				});
				u.push(p), a += p.byteLength;
			}
			return a === o && (a = 0, o = 0), u;
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
			const d = o - a;
			if (d > 0 && c.strict === !0) {
				const u = d < 6 ? null : Q(s, a), m = u === null ? 6 : 6 + u;
				throw new RangeError(\`PowerMessageCodec: stream ended mid-frame — \${d} of \${m} bytes buffered\` + (u === null ? ", not even a whole header" : ""));
			}
			return s.slice(a, o);
		},
		/** Bytes currently held for an incomplete frame. */
		get pendingBytes() {
			return o - a;
		},
		/**
		* Drop any incomplete frame and start over, keeping the buffer for reuse.
		*
		* For a stream that has desynchronised and cannot be resynchronised: once a
		* frame is mis-parsed the length prefix is no longer trustworthy, so the
		* bytes after it cannot be framed either.
		*/
		reset() {
			a = 0, o = 0;
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
function Bt(e) {
	if (!Me()) throw new TypeError("PowerMessageCodec: structuredClone is unavailable in this runtime. Use encodeMessage() for a portable JSON frame instead.");
	const t = structuredClone(e);
	return {
		message: t,
		transfer: Ne(t)
	};
}
function Wt(e) {
	if (typeof SharedArrayBuffer < "u" && e.buffer instanceof SharedArrayBuffer) return [];
	if (e.byteOffset !== 0 || e.byteLength !== e.buffer.byteLength) throw new RangeError(\`PowerMessageCodec: refusing to build a transfer list for a \${e.byteLength}-byte view at offset \${e.byteOffset} of a \${e.buffer.byteLength}-byte buffer — transferring \\\`frame.buffer\\\` would detach the whole buffer, including bytes outside this frame. Copy the view, or transfer the buffer it fills.\`);
	return [e.buffer];
}
const ie = "__pp";
function Te(e) {
	return e !== null && typeof e == "object" && e.__pp === 1 && e.kind === "envelope" && "value" in e;
}
function Dt(e) {
	return e !== null && typeof e == "object" && e.__pp === 1 && e.kind === "capabilities" && Array.isArray(e.codecs);
}
function jt(e, t = {}) {
	const i = {
		[ie]: 1,
		kind: "envelope",
		value: e
	};
	return t.correlationId != null && (i.correlationId = String(t.correlationId)), i;
}
function Ce(e = {}) {
	const t = Array.isArray(e.codecs) && e.codecs.length ? e.codecs.filter((i) => i === "json" || i === "native") : ["json", "native"];
	return {
		[ie]: 1,
		kind: "capabilities",
		codecs: t.includes("json") ? t : ["json", ...t],
		protocol: 1
	};
}
function Ne(e, t = 8) {
	const i = [], r = /* @__PURE__ */ new Set(), n = (s, a) => {
		if (!(!s || a > t)) {
			if (s instanceof ArrayBuffer) {
				r.has(s) || (r.add(s), i.push(s));
				return;
			}
			if (ArrayBuffer.isView(s)) {
				r.has(s.buffer) || (r.add(s.buffer), i.push(s.buffer));
				return;
			}
			if (typeof s == "object") for (const o of Object.keys(s)) n(s[o], a + 1);
		}
	};
	return n(e, 0), i;
}
function Pe(e) {
	if (Te(e)) return {
		codec: "native",
		value: e.value,
		correlationId: e.correlationId
	};
	if (L(e) || ArrayBuffer.isView(e)) {
		const t = G(e);
		if (t.length >= 6 && t[0] === 1) {
			const i = te(t);
			return {
				codec: i.codec,
				value: i.value,
				correlationId: void 0
			};
		}
		if (!Ht(t[0])) throw t[0] === 1 ? /* @__PURE__ */ new RangeError(\`PowerMessageCodec: truncated frame — \${t.length} byte(s) is shorter than the 6-byte header\`) : /* @__PURE__ */ new RangeError(\`PowerMessageCodec: unsupported protocol version \${t[0]} (expected 1)\`);
		return {
			codec: "legacy",
			value: Se(t),
			correlationId: void 0
		};
	}
	return {
		codec: "raw",
		value: e,
		correlationId: void 0
	};
}
function Ht(e) {
	return e === 32 || e === 9 || e === 10 || e === 13 ? !0 : e >= 32;
}
function G(e) {
	if (e instanceof Uint8Array) return e;
	if (L(e)) return new Uint8Array(e);
	if (typeof ArrayBuffer < "u" && ArrayBuffer.isView(e)) return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
	throw new TypeError("PowerMessageCodec: expected a Uint8Array, ArrayBuffer or DataView");
}
Object.freeze({
	MESSAGE_PROTOCOL_VERSION: 1,
	CODECS: C,
	MESSAGE_CODECS: xe,
	HEADER_BYTES: 6,
	encodeMessage: Ft,
	decodeMessage: te,
	createFrameDecoder: $t,
	frameEncodedJson: Ut,
	encodeNative: Bt,
	canUseNativeClone: Me,
	selectCodec: Ae,
	isRawPayload: J,
	frameTransferList: Wt,
	NATIVE_ENVELOPE_KEY: ie,
	NATIVE_PROTOCOL_VERSION: 1,
	isNativeEnvelope: Te,
	isCapabilityAnnouncement: Dt,
	encodeNativeEnvelope: jt,
	announceCapabilities: Ce,
	collectTransferables: Ne,
	decodeInbound: Pe
});
try {
	typeof postMessage == "function" && postMessage(Ce({ native: !0 }));
} catch {}
onmessage = async (e) => {
	const t = Pe(e.data), i = t.value, r = t.correlationId ?? i.correlationId, n = (a) => {
		r != null ? postMessage({
			correlationId: r,
			response: a
		}) : postMessage({
			id: i.id,
			result: a
		});
	}, s = (a) => {
		r != null ? postMessage({
			correlationId: r,
			response: { error: String(a) }
		}) : postMessage({
			id: i.id,
			error: String(a)
		});
	};
	try {
		if (i.type === "rewriteAnchors") {
			const { html: a, contentBase: o, pagePath: l, snapshot: c } = i;
			try {
				n(await Ot(a, o, l, c));
			} catch (d) {
				s(d);
			}
			return;
		}
	} catch (a) {
		s(a);
	}
};
`,Fl=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",uh],{type:"text/javascript;charset=utf-8"});function Zp(e){let t;try{if(t=Fl&&(self.URL||self.webkitURL).createObjectURL(Fl),!t)throw"";const n=new Worker(t,{type:"module",name:e?.name});return n.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(t)}),n}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(uh),{type:"module",name:e?.name})}}function jt(e,t=null){try{const n=typeof location<"u"&&location&&typeof location.pathname=="string"&&location.pathname||"/";return String(n)+Wo(e,t)}catch{return Wo(e,t)}}async function Ns(e,t,n=4,r){if(!Array.isArray(e)||e.length===0)return[];const i=new bc(Math.max(1,Number(n)||1));return Promise.all(e.map((a,o)=>i.run(()=>t(a,o),{signal:r})))}function Yp(...e){try{x(...e)}catch{}}function fi(e){try{if(tc(3))return!0}catch{}try{if(typeof xe=="string"&&xe)return!0}catch{}try{if(ne?.size)return!0}catch{}try{if(Xe?.size)return!0}catch{}return!1}function Qp(e,t){try{return new URL(e,t).pathname}catch{try{return new URL(e,typeof location<"u"?location.href:"http://localhost/").pathname}catch{try{return(String(t??"").replace(/\/$/,"")+"/"+String(e??"").replace(/^\//,"")).replace(/\/\\+/g,"/")}catch{return String(e??"")}}}}function di(e){try{const t=String(e??"");if(!t)return e;if(t.includes("/")||/\.(?:md|html?)$/i.test(t))return t;if(ne?.has?.(t)){const n=ne.get(t);if(typeof n=="string")return n;if(n&&typeof n=="object")return n.default||t}}catch{}return e}var Dl=null,Ul=null,jl=-1,as=null;function Xp(){try{const e=ne?._nimbiVersion??ne?.size??0;if(as&&jl===e)return as;const t=new Map;for(const[n,r]of ne||[]){const i=[];if(typeof r=="string")i.push(r);else if(r&&typeof r=="object"&&(typeof r.default=="string"&&i.push(r.default),r.langs&&typeof r.langs=="object"))for(const a of Object.values(r.langs))typeof a=="string"&&i.push(a);for(const a of i){const o=a.replace(/^.*\//,""),s=ci(a,2);for(const l of[a,o,s])l&&!t.has(l)&&t.set(l,n)}}return jl=e,as=t,t}catch{return null}}function fh(){try{if(typeof window>"u")return null;let e=null;if(Array.isArray(window.__nimbiResolvedIndex)?e=window.__nimbiResolvedIndex:Array.isArray(window.__nimbiSitemapFinal)?e=window.__nimbiSitemapFinal:window.__nimbiSitemapJson&&Array.isArray(window.__nimbiSitemapJson.entries)&&(e=window.__nimbiSitemapJson.entries),!Array.isArray(e))return null;if(e===Dl)return Ul;const t=new Map;for(const n of e)try{if(!n||typeof n!="object")continue;let r=null;if(typeof n.path=="string")r=n.path;else if(typeof n.sourcePath=="string")r=n.sourcePath;else if(typeof n.loc=="string")try{const s=new URL(n.loc,location.href);r=String(s.pathname).replace(/^\//,"")}catch{r=n.loc}const i=typeof n.slug=="string"?n.slug:null;if(!r||!i)continue;t.has(r)||t.set(r,i);const a=String(r).replace(/^.*\//,"");a&&!t.has(a)&&t.set(a,i);const o=ci(r,2);o&&!t.has(o)&&t.set(o,i)}catch{continue}return Dl=e,Ul=t,t}catch{return null}}function ss(e){if(!e)return null;try{if(ge?.has?.(e))return ge.get(e)}catch{}const t=String(e??"").replace(/^.*\//,"");try{if(t&&ge?.has?.(t))return ge.get(t)}catch{}const n=fh();try{if(n?.has?.(e))return n.get(e);if(t&&n?.has?.(t))return n.get(t);const i=ci(e,2);if(i&&n?.has?.(i))return n.get(i)}catch{}const r=ci(e,2);try{for(const[i,a]of ne||[]){let o=null;if(typeof a=="string"?o=a:a&&typeof a=="object"&&(o=a.default||""),!!o&&(o===e||o===t||o.endsWith(`/${r}`)))return i}}catch{}return null}function pi(e,t){try{if(!e)return e;if(!t)return String(e??"");const n=String(t??"").replace(/^\/+|\/+$/g,"");if(!n)return String(e??"");let r=String(e??"");r=r.replace(/^\/+/,"");const i=n+"/";for(;r.startsWith(i);)r=r.slice(i.length);return r===n?"":r}catch{return String(e??"")}}function Kp(e,t){const n=document.createElement("aside");n.className="menu box nimbi-nav",n.setAttribute("role","navigation");try{n.setAttribute("aria-label",e("navigation"))}catch{}const r=document.createElement("p");r.className="menu-label",r.textContent=e("navigation"),n.appendChild(r);const i=document.createElement("ul");i.className="menu-list";try{const a=document.createDocumentFragment();t.forEach(o=>{const s=document.createElement("li"),l=document.createElement("a");try{const c=String(o.path??"");try{l.setAttribute("href",qe(c))}catch{c?.indexOf("/")===-1?l.setAttribute("href","#"+encodeURIComponent(c)):l.setAttribute("href",jt(c))}}catch{l.setAttribute("href","#"+o.path)}if(l.textContent=o.name,s.appendChild(l),o.children?.length){const c=document.createElement("ul");o.children.forEach(f=>{const u=document.createElement("li"),h=document.createElement("a");try{const p=String(f.path??"");try{h.setAttribute("href",qe(p))}catch{p?.indexOf("/")===-1?h.setAttribute("href","#"+encodeURIComponent(p)):h.setAttribute("href",jt(p))}}catch{h.setAttribute("href","#"+f.path)}h.textContent=f.name,u.appendChild(h),c.appendChild(u)}),s.appendChild(c)}a.appendChild(s)}),i.appendChild(a)}catch{t.forEach(o=>{try{const s=document.createElement("li"),l=document.createElement("a");try{const c=String(o.path??"");try{l.setAttribute("href",qe(c))}catch{c?.indexOf("/")===-1?l.setAttribute("href","#"+encodeURIComponent(c)):l.setAttribute("href",jt(c))}}catch{l.setAttribute("href","#"+o.path)}if(l.textContent=o.name,s.appendChild(l),o.children?.length){const c=document.createElement("ul");o.children.forEach(f=>{const u=document.createElement("li"),h=document.createElement("a");try{const p=String(f.path??"");try{h.setAttribute("href",qe(p))}catch{p?.indexOf("/")===-1?h.setAttribute("href","#"+encodeURIComponent(p)):h.setAttribute("href",jt(p))}}catch{h.setAttribute("href","#"+f.path)}h.textContent=f.name,u.appendChild(h),c.appendChild(u)}),s.appendChild(c)}i.appendChild(s)}catch(s){x("[htmlBuilder] createNavTree item failed",s)}})}return n.appendChild(i),n}function Jp(e,t,n=""){const r=document.createElement("aside");r.className="menu box nimbi-toc-inner is-hidden-mobile";const i=document.createElement("p");i.className="menu-label",i.textContent=e("onThisPage"),r.appendChild(i);const a=document.createElement("ul");a.className="menu-list";try{const s={};(t||[]).forEach(l=>{try{if(!l||l.level===1)return;const c=Number(l.level)>=2?Number(l.level):2,f=document.createElement("li"),u=document.createElement("a"),h=Iu(l.text||""),p=l.id||be(h);u.textContent=h;try{const d=String(n??"").replace(/^[\.\/]+/,""),_=d&&ge?.has?.(d)?ge.get(d):d;_?u.href=qe(_,p):u.href=`#${encodeURIComponent(p)}`}catch(d){x("[htmlBuilder] buildTocElement href normalization failed",d),u.href=`#${encodeURIComponent(p)}`}if(f.appendChild(u),c===2){a.appendChild(f),s[2]=f,Object.keys(s).forEach(d=>{Number(d)>2&&delete s[d]});return}let m=c-1;for(;m>2&&!s[m];)m--;m<2&&(m=2);let y=s[m];if(!y){a.appendChild(f),s[c]=f;return}let g=y.querySelector("ul");g||(g=document.createElement("ul"),y.appendChild(g)),g.appendChild(f),s[c]=f}catch(c){x("[htmlBuilder] buildTocElement item failed",c,l)}})}catch(s){x("[htmlBuilder] buildTocElement failed",s)}const o=document.createElement("nav");try{o.setAttribute("aria-label",e("onThisPage"))}catch{}return o.appendChild(a),r.appendChild(o),a.querySelectorAll("li").length<=1?null:r}function dh(e){e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(t=>{t.id||(t.id=be(t.textContent||""))})}function em(e,t,n){try{const r=e.querySelectorAll?.("img")||[];if(r?.length){const i=t?.includes("/")?t.substring(0,t.lastIndexOf("/")+1):"";r.forEach(a=>{const o=a.getAttribute("src")||"";if(o&&!(/^(https?:)?\/\//.test(o)||o.startsWith("/")))try{a.src=new URL(i+o,n).toString();try{a.getAttribute("loading")||a.setAttribute("data-want-lazy","1")}catch(s){x("[htmlBuilder] set image loading attribute failed",s)}}catch(s){x("[htmlBuilder] resolve image src failed",s)}})}}catch(r){x("[htmlBuilder] lazyLoadImages failed",r)}}function Bl(e,t,n){try{t=di(t),t=di(t);const r=t?.includes("/")?t.substring(0,t.lastIndexOf("/")+1):"";let i=null;try{const s=new URL(n,location.href);i=new URL(r||".",s).toString()}catch{try{i=new URL(r||".",location.href).toString()}catch{i=r||"./"}}let a=null;try{a=e.querySelectorAll("[src],[href],[srcset],[poster]")}catch{const l=[];try{l.push(...Array.from(e.getElementsByTagName("img")||[]))}catch{}try{l.push(...Array.from(e.getElementsByTagName("link")||[]))}catch{}try{l.push(...Array.from(e.getElementsByTagName("video")||[]))}catch{}try{l.push(...Array.from(e.getElementsByTagName("use")||[]))}catch{}try{l.push(...Array.from(e.querySelectorAll("[srcset]")||[]))}catch{}a=l}let o=Array.from(a||[]);try{const s=Array.from(e.getElementsByTagName("use")||[]);for(const l of s)o.indexOf(l)===-1&&o.push(l)}catch{}for(const s of Array.from(o||[]))try{const l=s.tagName?s.tagName.toLowerCase():"",c=f=>{try{const u=s.getAttribute(f)||"";if(!u||/^(https?:)?\/\//i.test(u)||u.startsWith("/")||u.startsWith("#"))return;try{s.setAttribute(f,new URL(u,i).toString())}catch(h){x("[htmlBuilder] rewrite asset attribute failed",f,u,h)}}catch(u){x("[htmlBuilder] rewriteAttr failed",u)}};if(s.hasAttribute?.("src")&&c("src"),s.hasAttribute?.("href")&&l!=="a"&&c("href"),s.hasAttribute?.("xlink:href")&&c("xlink:href"),s.hasAttribute?.("poster")&&c("poster"),s.hasAttribute?.("srcset")){const f=(s.getAttribute("srcset")||"").split(",").map(u=>u.trim()).filter(Boolean).map(u=>{const[h,p]=u.split(/\s+/,2);if(!h||/^(https?:)?\/\//i.test(h)||h.startsWith("/"))return u;try{const m=new URL(h,i).toString();return p?`${m} ${p}`:m}catch{return u}}).join(", ");s.setAttribute("srcset",f)}}catch(l){x("[htmlBuilder] rewriteRelativeAssets node processing failed",l)}}catch(r){x("[htmlBuilder] rewriteRelativeAssets failed",r)}}var Wl="",os=null,ql="";async function ph(e,t,n,r={}){try{n=di(n),r=r||{},r.canonical=r.canonical!==!1;const i=e.querySelectorAll?.("a")||[];if(!i.length)return;let a,o;if(t===Wl&&os)a=os,o=ql;else{try{a=new URL(t,location.href),o=On(a.pathname)}catch{try{a=new URL(t,location.href),o=On(a.pathname)}catch{a=null,o="/"}}Wl=t,os=a,ql=o}const s=new Set,l=[],c=new Set,f=[];for(const u of Array.from(i))try{try{if(u?.closest?.("h1,h2,h3,h4,h5,h6"))continue}catch{}const h=u.getAttribute?.("href")||"";if(!h)continue;if(ia(h)){try{u.setAttribute("rel","noopener noreferrer nofollow")}catch{}continue}try{if(h.startsWith("?")||h.indexOf("?")!==-1)try{const m=new URL(h,t||location.href),y=m.searchParams.get("page");if(y&&y.indexOf("/")===-1&&n){const g=n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"";if(g){const d=oe(g+y),_=r?.canonical?qe(d,m.hash?m.hash.replace(/^#/,""):null):jt(d,m.hash?m.hash.replace(/^#/,""):null);u.setAttribute("href",_);continue}}}catch{}}catch{}if(h.startsWith("/")&&!h.endsWith(".md"))continue;const p=h.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(p){let m=p[1];const y=p[2];!m.startsWith("/")&&n&&(m=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+m);try{const g=new URL(m,t).pathname;let d=g.startsWith(o)?g.slice(o.length):g;d=pi(d,o),d=oe(d),l.push({node:u,mdPathRaw:m,frag:y,rel:d}),ge?.has?.(d)||s.add(d)}catch(g){x("[htmlBuilder] resolve mdPath failed",g)}continue}try{let m=h;!h.startsWith("/")&&n&&(h.startsWith("#")?m=n+h:m=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+h);const y=new URL(m,t).pathname||"";if(y&&y.indexOf(o)!==-1){let g=y.startsWith(o)?y.slice(o.length):y;if(g=pi(g,o),g=oe(g),g=Jn(g),g||(g=an),!g.endsWith(".md")){const d=ss(g);if(d){const _=r?.canonical?qe(d,null):jt(d);u.setAttribute("href",_)}else{let _=g;try{/\.[^\/]+$/.test(String(g??""))||(_=String(g??"")+".html")}catch{_=g}c.add(_),f.push({node:u,rel:_})}}}}catch(m){x("[htmlBuilder] resolving href to URL failed",m)}}catch(h){x("[htmlBuilder] processing anchor failed",h)}if(s.size)if(!fi(t)||r?.allowProbe===!1){try{x("[htmlBuilder] skipping md title probes (probing disabled)")}catch{}for(const u of Array.from(s))try{const h=String(u).match(/([^\/]+)\.md$/),p=h&&h[1];if(p){const m=be(p);if(m)try{pt(m,u)}catch(y){x("[htmlBuilder] setting fallback slug mapping failed",y)}}}catch{}}else await Ns(Array.from(s),async u=>{try{try{const p=String(u).match(/([^\/]+)\.md$/),m=p&&p[1];if(m&&ne.has(m)){try{const y=ne.get(m);if(y)try{const g=typeof y=="string"?y:y?.default?y.default:null;g&&pt(m,g)}catch(g){x("[htmlBuilder] _storeSlugMapping failed",g)}}catch(y){x("[htmlBuilder] reading slugToMd failed",y)}return}}catch(p){x("[htmlBuilder] basename slug lookup failed",p)}const h=await Ke(u,t);if(h?.raw){const p=(h.raw||"").match(/^#\s+(.+)$/m);if(p&&p[1]){const m=be(p[1].trim());if(m)try{pt(m,u)}catch(y){x("[htmlBuilder] setting slug mapping failed",y)}}}}catch(h){x("[htmlBuilder] fetchMarkdown during rewriteAnchors failed",h)}},6);if(c.size)if(!fi(t)||r?.allowProbe===!1){try{x("[htmlBuilder] skipping html title probes (probing disabled)")}catch{}for(const u of Array.from(c))try{const h=String(u).match(/([^\/]+)\.html$/),p=h&&h[1];if(p){const m=be(p);if(m)try{pt(m,u)}catch(y){x("[htmlBuilder] setting fallback html slug mapping failed",y)}}}catch{}}else await Ns(Array.from(c),async u=>{try{const h=await Ke(u,t);if(h&&h.raw)try{const p=ot(),m=p?p.parseFromString(h.raw,"text/html"):null,y=m?m.querySelector("title"):null,g=m?m.querySelector("h1"):null,d=y&&y.textContent&&y.textContent.trim()?y.textContent.trim():g&&g.textContent?g.textContent.trim():null;if(d){const _=be(d);if(_)try{pt(_,u)}catch(w){x("[htmlBuilder] setting html slug mapping failed",w)}}}catch(p){x("[htmlBuilder] parse fetched HTML failed",p)}}catch(h){x("[htmlBuilder] fetchMarkdown for htmlPending failed",h)}},5);for(const u of l){const{node:h,frag:p,rel:m}=u;let y=ss(m);if(y){const g=r?.canonical?qe(y,p):jt(y,p);h.setAttribute("href",g)}else{const g=r?.canonical?qe(m,p):jt(m,p);h.setAttribute("href",g)}}for(const u of f){const{node:h,rel:p}=u;let m=ss(p);if(!m)try{const y=String(p??"").replace(/^.*\//,"");ge?.has?.(y)&&(m=ge?.get?.(y))}catch(y){x("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo",y)}if(m){const y=r?.canonical?qe(m,null):jt(m);h.setAttribute("href",y)}else{const y=r?.canonical?qe(p,null):jt(p);h.setAttribute("href",y)}}}catch(i){x("[htmlBuilder] rewriteAnchors failed",i)}}function tm(e,t,n,r){const i=t.querySelector("h1"),a=i?(i.textContent||"").trim():"";let o="";try{let s="";try{e&&e.meta&&e.meta.title&&(s=String(e.meta.title).trim())}catch{}if(!s&&a&&(s=a),!s)try{const l=t.querySelector("h2");l&&l.textContent&&(s=String(l.textContent).trim())}catch{}!s&&n&&(s=String(n)),s&&(o=be(s)),o||(o=an);try{if(n){try{pt(o,n)}catch(l){x("[htmlBuilder] computeSlug set slug mapping failed",l)}try{const l=oe(String(n??""));if(ge?.has?.(l))o=ge.get(l);else try{for(const[c,f]of ne||[])try{const u=typeof f=="string"?f:f?.default?f.default:null;if(u&&oe(String(u))===l){o=c;break}}catch{}}catch{}}catch{}}}catch(l){x("[htmlBuilder] computeSlug set slug mapping failed",l)}try{let l=r||"";if(!l)try{const c=dt(typeof location<"u"?location.href:"");c?.anchor&&c?.page&&String(c.page)===String(o)?l=c.anchor:l=""}catch{l=""}try{history.replaceState({page:o},"",jt(o,l))}catch(c){x("[htmlBuilder] computeSlug history replace failed",c)}}catch(l){x("[htmlBuilder] computeSlug inner failed",l)}}catch(s){x("[htmlBuilder] computeSlug failed",s)}try{if(e?.meta?.title&&i){const s=String(e.meta.title).trim();if(s&&s!==a){try{o&&(i.id=o)}catch{}try{if(Array.isArray(e.toc))for(const l of e.toc)try{if(l&&Number(l.level)===1&&String(l.text).trim()===(a||"").trim()){l.id=o;break}}catch{}}catch{}}}}catch{}return{topH1:i,h1Text:a,slugKey:o}}async function nm(e,t,n={}){if(!e||!e.length)return;const r=new Set;for(const o of Array.from(e||[]))try{const s=o.getAttribute("href")||"";if(!s)continue;let l=oe(s).split(/::|#/,2)[0];try{const f=l.indexOf("?");f!==-1&&(l=l.slice(0,f))}catch{}if(!l||(l.includes(".")||(l=l+".html"),!/\.html(?:$|[?#])/.test(l)&&!l.toLowerCase().endsWith(".html")))continue;const c=l;try{if(ge?.has?.(c))continue}catch(f){x("[htmlBuilder] mdToSlug check failed",f)}try{let f=!1;for(const u of ne.values())if(u===c){f=!0;break}if(f)continue}catch(f){x("[htmlBuilder] slugToMd iteration failed",f)}r.add(c)}catch(s){x("[htmlBuilder] preScanHtmlSlugs anchor iteration failed",s)}if(!r.size)return;if(!fi(t)||n?.allowProbe===!1){try{x("[htmlBuilder] skipping preScanHtmlSlugs (probing disabled)")}catch{}for(const o of Array.from(r))try{const s=String(o).match(/([^\/]+)\.html$/),l=s&&s[1];if(l){const c=be(l);if(c)try{pt(c,o)}catch(f){x("[htmlBuilder] setting fallback preScanHtmlSlugs mapping failed",f)}}}catch{}return}const i=async o=>{try{const s=await Ke(o,t);if(s&&s.raw)try{const l=ot().parseFromString(s.raw,"text/html"),c=l.querySelector("title"),f=l.querySelector("h1"),u=c?.textContent&&c.textContent.trim()?c.textContent.trim():f?.textContent?f.textContent.trim():null;if(u){const h=be(u);if(h)try{pt(h,o)}catch(p){x("[htmlBuilder] set slugToMd/mdToSlug failed",p)}}}catch(l){x("[htmlBuilder] parse HTML title failed",l)}}catch(s){x("[htmlBuilder] fetchAndExtract failed",s)}},a=Array.from(r);await Ns(a,i,Math.max(1,Math.min(ti(),a.length||1)))}async function rm(e,t,n={}){if(!e||!e.length)return;const r=[],i=new Set;let a="";try{const o=new URL(t,typeof location<"u"?location.href:"http://localhost/");a=On(o.pathname)}catch(o){a="",x("[htmlBuilder] preMapMdSlugs parse base failed",o)}for(const o of Array.from(e||[]))try{const s=o.getAttribute("href")||"";if(!s)continue;const l=s.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(l){let c=oe(l[1]);try{let f;try{f=Qp(c,t)}catch(h){f=c,x("[htmlBuilder] resolve mdPath URL failed",h)}let u=f&&a&&f.startsWith(a)?f.slice(a.length):String(f??"").replace(/^\//,"");u=pi(u,a),r.push({rel:u}),ge?.has?.(u)||i.add(u)}catch(f){x("[htmlBuilder] rewriteAnchors failed",f)}continue}}catch(s){x("[htmlBuilder] preMapMdSlugs anchor iteration failed",s)}if(i.size){if(!fi(t)||n?.allowProbe===!1){try{x("[htmlBuilder] skipping preMapMdSlugs probes (probing disabled)")}catch{}for(const o of Array.from(i))try{const s=String(o).match(/([^\/]+)\.md$/),l=s&&s[1];if(l){const c=be(l);if(c)try{pt(c,o)}catch(f){x("[htmlBuilder] setting fallback preMapMdSlugs mapping failed",f)}}}catch{}return}await Promise.all(Array.from(i).map(async o=>{try{const s=String(o).match(/([^\/]+)\.md$/),l=s&&s[1];if(l&&ne.has(l)){try{const c=ne.get(l);if(c)try{const f=typeof c=="string"?c:c?.default?c.default:null;f&&pt(l,f)}catch(f){x("[htmlBuilder] _storeSlugMapping failed",f)}}catch(c){x("[htmlBuilder] preMapMdSlugs slug map access failed",c)}return}}catch(s){x("[htmlBuilder] preMapMdSlugs basename check failed",s)}try{const s=await Ke(o,t);if(s&&s.raw){const l=(s.raw||"").match(/^#\s+(.+)$/m);if(l&&l[1]){const c=be(l[1].trim());if(c)try{pt(c,o)}catch(f){x("[htmlBuilder] preMapMdSlugs setting slug mapping failed",f)}}}}catch(s){x("[htmlBuilder] preMapMdSlugs fetch failed",s)}}))}}function ls(e){try{const t=ot().parseFromString(e||"","text/html");dh(t);try{t.querySelectorAll("img").forEach(i=>{try{i.getAttribute("loading")||i.setAttribute("data-want-lazy","1")}catch(a){x("[htmlBuilder] parseHtml set image loading attribute failed",a)}})}catch(i){x("[htmlBuilder] parseHtml query images failed",i)}t.querySelectorAll("pre code, code[class]").forEach(i=>{try{const a=i.getAttribute?.("class")||i.className||"",o=a.match(/language-([a-zA-Z0-9_+-]+)/)||a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(o&&o[1]){const s=(o[1]||"").toLowerCase(),l=ze.size&&(ze.get(s)||ze.get(String(s).toLowerCase()))||s;try{(async()=>{try{await _r(l)}catch(c){x("[htmlBuilder] registerLanguage failed",c)}})()}catch(c){x("[htmlBuilder] schedule registerLanguage failed",c)}}else try{if(Qe&&typeof Qe.getLanguage=="function"&&Qe.getLanguage("plaintext")){const s=Qe.highlight?Qe.highlight(i.textContent||"",{language:"plaintext"}):null;if(s&&s.value)try{if(typeof document<"u"&&document.createRange&&typeof document.createRange=="function"){const l=document.createRange().createContextualFragment(s.value);if(typeof i.replaceChildren=="function")i.replaceChildren(...Array.from(l.childNodes));else{for(;i.firstChild;)i.removeChild(i.firstChild);i.appendChild(l)}}else i.innerHTML=s.value}catch{try{i.innerHTML=s.value}catch{}}}}catch(s){x("[htmlBuilder] plaintext highlight fallback failed",s)}}catch(a){x("[htmlBuilder] code element processing failed",a)}});const n=[];t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(i=>{n.push({level:Number(i.tagName.substring(1)),text:(i.textContent||"").trim(),id:i.id})});const r={};try{const i=t.querySelector("title");i?.textContent&&String(i.textContent).trim()&&(r.title=String(i.textContent).trim())}catch{}return{html:t.body.innerHTML,meta:r,toc:n}}catch(t){return x("[htmlBuilder] parseHtml failed",t),{html:e||"",meta:{},toc:[]}}}async function mh(e){const t=Ls?await Ls(e||"",ze):ga(e||"",ze),n=new Set(t),r=[];for(const i of n)try{const a=ze.size&&(ze.get(i)||ze.get(String(i).toLowerCase()))||i;try{r.push(_r(a))}catch(o){x("[htmlBuilder] ensureLanguages push canonical failed",o)}if(String(i)!==String(a))try{r.push(_r(i))}catch(o){x("[htmlBuilder] ensureLanguages push alias failed",o)}}catch(a){x("[htmlBuilder] ensureLanguages inner failed",a)}try{await Promise.all(r)}catch(i){x("[htmlBuilder] ensureLanguages failed",i)}}async function im(e){if(await mh(e),br){const t=await br(e||"");return!t||typeof t!="object"?{html:String(e??""),meta:{},toc:[]}:(Array.isArray(t.toc)||(t.toc=[]),t.meta||(t.meta={}),t)}return{html:String(e??""),meta:{},toc:[]}}async function am(e,t,n,r,i){let a=null,o=null;if(t.isHtml)try{const h=ot();if(h){const p=h.parseFromString(t.raw||"","text/html");try{Bl(p.body,n,i)}catch(m){x("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)",m)}a=ls(p.documentElement?.outerHTML?p.documentElement.outerHTML:t?.raw||"")}else a=ls(t.raw||"")}catch{a=ls(t.raw||"")}else{const h=t.raw||"",p=65536;if(h&&h.length>p&&Ps){try{await mh(h)}catch{}o=document.createElement("article"),o.id="main",o.className="nimbi-article content",o.setAttribute("itemscope",""),o.setAttribute("itemtype","https://schema.org/Article");const m=[];let y={};try{await Ps(h,(g,d)=>{try{d&&d.meta&&(y=Object.assign(y,d.meta))}catch{}try{d&&Array.isArray(d.toc)&&d.toc.length&&m.push(...d.toc)}catch{}try{Gp(()=>{try{const _=ot();if(_){const w=_.parseFromString(String(g??""),"text/html"),k=Array.from(w.body.childNodes||[]);k.length?o.append(...k):o.insertAdjacentHTML("beforeend",g||"")}else{const w=document&&typeof document.createRange=="function"?document.createRange():null;if(w&&typeof w.createContextualFragment=="function"){const k=w.createContextualFragment(String(g??""));o.append(...Array.from(k.childNodes))}else o.insertAdjacentHTML("beforeend",g||"")}}catch{try{o.insertAdjacentHTML("beforeend",g||"")}catch{}}})}catch{}},{chunkSize:p})}catch(g){x("[htmlBuilder] streamParseMarkdown failed, falling back",g)}a={html:o.innerHTML,meta:y||{},toc:m}}else a=await im(t.raw||"")}let s;if(o)s=o;else{s=document.createElement("article"),s.id="main",s.className="nimbi-article content",s.setAttribute("itemscope",""),s.setAttribute("itemtype","https://schema.org/Article");try{const h=ot&&ot();if(h){const p=h.parseFromString(String(a.html??""),"text/html"),m=Array.from(p.body.childNodes||[]);m.length?s.replaceChildren(...m):s.innerHTML=a.html}else try{const p=document&&typeof document.createRange=="function"?document.createRange():null;if(p&&typeof p.createContextualFragment=="function"){const m=p.createContextualFragment(String(a.html??""));s.replaceChildren(...Array.from(m.childNodes))}else s.innerHTML=a.html}catch{s.innerHTML=a.html}}catch{try{s.innerHTML=a.html}catch(p){x("[htmlBuilder] set article html failed",p)}}}try{Bl(s,n,i)}catch(h){x("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle",h)}try{dh(s)}catch(h){x("[htmlBuilder] addHeadingIds failed",h)}try{s.querySelectorAll("pre code, code[class]").forEach(h=>{try{const p=h.getAttribute?.("class")||h.className||"",m=String(p??"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(m)try{h.setAttribute?.("class",m)}catch(y){h.className=m,x("[htmlBuilder] set element class failed",y)}else try{h.removeAttribute?.("class")}catch(y){h.className="",x("[htmlBuilder] remove element class failed",y)}}catch(p){x("[htmlBuilder] code element cleanup failed",p)}})}catch(h){x("[htmlBuilder] processing code elements failed",h)}em(s,n,i);try{(s.querySelectorAll?.("img")||[]).forEach(h=>{try{const p=h.parentElement;if(!p||p.tagName.toLowerCase()!=="p"||p.childNodes.length!==1)return;const m=document.createElement("figure");m.className="image",p.replaceWith(m),m.appendChild(h)}catch{}})}catch(h){x("[htmlBuilder] wrap images in Bulma image helper failed",h)}try{(s.querySelectorAll?.("table")||[]).forEach(h=>{try{if(h.classList)h.classList.contains("table")||h.classList.add("table");else{const p=h.getAttribute?.("class")||"",m=String(p??"").split(/\s+/).filter(Boolean);m.indexOf("table")===-1&&m.push("table");try{h.setAttribute?.("class",m.join(" "))}catch{h.className=m.join(" ")}}}catch{}})}catch(h){x("[htmlBuilder] add Bulma table class failed",h)}const{topH1:l,h1Text:c,slugKey:f}=tm(a,s,n,r);try{if(l&&(a?.meta?.author||a?.meta?.date)&&!l.parentElement?.querySelector?.(".nimbi-article-subtitle")){const h=a.meta.author?String(a.meta.author).trim():"",p=a.meta.date?String(a.meta.date).trim():"";let m="";try{const g=new Date(p);p&&!isNaN(g.getTime())?m=g.toLocaleDateString():m=p}catch{m=p}const y=[];if(h&&y.push(h),m&&y.push(m),y.length){const g=document.createElement("p"),d=y[0]?String(y[0]).replace(/"/g,"").trim():"",_=y.slice(1);if(g.className="nimbi-article-subtitle is-6 has-text-grey-light",d){const w=document.createElement("span");w.className="nimbi-article-author",w.textContent=d,g.appendChild(w)}if(_.length){const w=document.createElement("span");w.className="nimbi-article-meta",w.textContent=_.join(" • "),g.appendChild(w)}try{l.parentElement.insertBefore(g,l.nextSibling)}catch{try{l.insertAdjacentElement("afterend",g)}catch{}}}}}catch{}try{if(l&&l.parentElement&&l.parentElement.tagName!=="HEADER"){const h=l.parentElement,p=document.createElement("header");p.className="nimbi-article-header",h.insertBefore(p,l),p.appendChild(l);const m=p.nextElementSibling;if(m&&m.classList?.contains("nimbi-article-subtitle")){const y=document.createElement("footer");y.className="nimbi-article-footer",p.insertAdjacentElement("afterend",y),y.appendChild(m)}}}catch{}try{await pm(s,i,n)}catch(h){Yp("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread",h),await ph(s,i,n)}const u=Jp(e,a.toc,n);return{article:s,parsed:a,toc:u,topH1:l,h1Text:c,slugKey:f}}function sm(e,t=!1,n=[]){if(!(!e||!e.querySelectorAll))try{const r=Array.from(e.querySelectorAll("script"));if(!t){for(const i of r)try{i.parentNode?.removeChild(i)}catch{}return}for(const i of r)try{if(i.src){const l=new URL(i.src,document.baseURI),c=new Set(Array.isArray(n)?n.map(f=>String(f).replace(/\/$/,"")):[]);if(l.origin!==window.location.origin&&!c.has(l.origin)){i.parentNode?.removeChild(i),x("[htmlBuilder] blocked external embedded script",{origin:l.origin});continue}}const a=document.createElement("script"),o=new Set(["src","type","async","defer","crossorigin","integrity","nomodule","referrerpolicy","id","class","nonce"]);for(const l of i.attributes)try{o.has(l.name)&&a.setAttribute(l.name,l.value)}catch{}if(a.hasAttribute("nonce")||Ws(a),!i.src){const l=i.textContent||"";let c=!1;try{new Function(l)(),c=!0}catch{c=!1}if(c){i.parentNode?.removeChild(i);try{nn("[htmlBuilder] executed inline script via Function")}catch{}try{(document.head||document.body||document.documentElement).appendChild(a)}catch{try{try{a.type="text/javascript"}catch{}(document.head||document.body||document.documentElement).appendChild(a)}catch(u){try{x("[htmlBuilder] injected script append failed, skipping",{src:s,err:u})}catch{}}}continue}try{a.type="module"}catch{}a.textContent=l}if(i.src)try{if(document.querySelector?.(`script[src="${i.src}"]`)){i.parentNode?.removeChild(i);continue}}catch{}const s=i.src||"<inline>";a.addEventListener("error",l=>{try{x("[htmlBuilder] injected script error",{src:s,ev:l})}catch{}}),a.addEventListener("load",()=>{try{nn("[htmlBuilder] injected script loaded",{src:s,hasNimbi:!!(window&&window.nimbiCMS)})}catch{}});try{(document.head||document.body||document.documentElement).appendChild(a)}catch{try{try{a.type="text/javascript"}catch{}(document.head||document.body||document.documentElement).appendChild(a)}catch(c){try{x("[htmlBuilder] injected script append failed, skipping",{src:s,err:c})}catch{}}}i.parentNode?.removeChild(i);try{nn("[htmlBuilder] executed injected script",s)}catch{}}catch(a){x("[htmlBuilder] execute injected script failed",a)}}catch{}}function Hl(e,t,n){if(e)try{typeof e.replaceChildren=="function"?e.replaceChildren():e.innerHTML=""}catch{try{e.innerHTML=""}catch{}}const r=document.createElement("article");r.className="nimbi-article content nimbi-not-found",r.setAttribute("aria-live","polite");const i=document.createElement("h1");i.textContent=t&&t("notFound")||"Page not found";const a=document.createElement("p");a.textContent=n?.message?String(n.message):"Failed to resolve the requested page.",r.appendChild(i),r.appendChild(a),e&&e.appendChild&&e.appendChild(r);try{if(!xe)try{const o=document.createElement("p");o.textContent=(t&&t("goHome")||"Go back to")+" ";const s=document.createElement("a");try{s.href=qe(Mt)}catch{s.href=qe(Mt||"")}s.textContent=t&&t("home")||"Home",o.appendChild(s),e&&e.appendChild&&e.appendChild(o)}catch{}}catch{}try{try{ea({title:t&&t("notFound")||"Not Found",description:t&&t("notFoundDescription")||""},xe,t&&t("notFound")||"Not Found",t&&t("notFoundDescription")||"")}catch{}}catch{}try{try{const o=typeof window<"u"&&window.__nimbiNotFoundRedirect?String(window.__nimbiNotFoundRedirect).trim():null;if(o)try{const s=new URL(o,location.origin).toString();if((location.href||"").split("#")[0]!==s)try{location.replace(s)}catch{location.href=s}}catch{}}catch{}}catch{}}var om={intervalMs:500,targetMs:80,hysteresis:.25,cooldownMs:600,stepUp:1,stepDown:1};function lm(){const e={size:2,minSize:2,autoScale:om,messageCodec:"negotiated",maxQueueLength:100};try{e.debugLevel=0}catch{}try{return Js("anchor",new Xs(Zp,e))}catch{return{workers:[],postMessage:async()=>{throw new Error("anchor worker unavailable")}}}}var ri=null;function gh(){return ri||(ri=lm()),ri}function cm(e){if(!e)return null;try{if(ge?.has?.(e))return ge.get(e)}catch{}try{const n=String(e).replace(/^.*\//,"");if(n&&ge?.has?.(n))return ge.get(n)}catch{}const t=fh();try{if(t?.has?.(e))return t.get(e);const n=String(e).replace(/^.*\//,"");if(n&&t?.has?.(n))return t.get(n)}catch{}try{const n=String(e).replace(/^.*\//,""),r=Xp();if(r?.has(e))return r.get(e);if(r?.has(n))return r.get(n);const i=ci(e,2);if(r?.has(i))return r.get(i);if(t)for(const[a,o]of t.entries()){const s=String(e).replace(/^.*\//,"");if(a===e||a===s||String(a).endsWith(`/${i}`))return o}}catch{}return null}function hm(e,t,n){n=di(n);const r=new Set;let i="/";try{const o=new URL(t,location.href);i=On(o.pathname)}catch{}try{const o=Array.from(e?.querySelectorAll?.("a")||[]);for(const s of o)try{try{if(s?.closest?.("h1,h2,h3,h4,h5,h6"))continue}catch{}const l=s.getAttribute?.("href")||"";if(!l||ia(l)||l.startsWith("/")&&!l.endsWith(".md"))continue;const c=l.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(c){let p=c[1];!p.startsWith("/")&&n&&(p=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+p);const m=new URL(p,t).pathname;let y=m.startsWith(i)?m.slice(i.length):m;y=oe(pi(y,i)),r.add(y),r.add(String(y).replace(/^.*\//,""));continue}let f=l;!l.startsWith("/")&&n&&(l.startsWith("#")?f=n+l:f=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+l);const u=new URL(f,t).pathname||"";if(!u||u.indexOf(i)===-1)continue;let h=u.startsWith(i)?u.slice(i.length):u;h=oe(pi(h,i)),h=Jn(h),h||(h=an),r.add(h),r.add(String(h).replace(/^.*\//,"")),/\.[^/]+$/.test(String(h??""))||(r.add(h+".html"),r.add((h+".html").replace(/^.*\//,"")))}catch{}}catch{}const a={};for(const o of r){const s=cm(o);s&&(a[o]=s)}return{allowProbe:fi(t),homeSlug:an,pathToSlug:a}}function um(){return gh().workers?.[0]?.worker?._underlying??null}function fm(){const e=ri;if(ri=null,!e)return Promise.resolve();eo("anchor",e);try{const t=e[Symbol.asyncDispose];return typeof t=="function"?Promise.resolve(t.call(e)).catch(()=>{}):(typeof e.drain=="function"?Promise.resolve(e.drain()):Promise.resolve()).catch(()=>{}).then(()=>{typeof e.terminate=="function"&&e.terminate()})}catch(t){return x("[htmlBuilder] teardownAnchorWorkerPool failed",t),Promise.resolve()}}function dm(e){return gh().postMessage(e,void 0,{awaitResponse:!0,timeout:2e3}).then(t=>{if(t&&typeof t=="object"&&t.error)throw new Error(t.error);return t}).catch(t=>{throw(t?.message||"").includes("postMessage response timeout")?new Error("worker timeout"):t})}async function pm(e,t,n){if(!um())throw new Error("anchor worker unavailable");if(!e||typeof e.innerHTML!="string")throw new Error("invalid article element");n=di(n);const r=String(e.innerHTML),i=hm(e,t,n),a=await dm({type:"rewriteAnchors",html:r,contentBase:t,pagePath:n,snapshot:i}),o=a&&typeof a=="object"&&typeof a.html=="string"?a.html:a;if(a&&typeof a=="object"&&Array.isArray(a.mappings))for(const l of a.mappings)try{l&&l.slug&&l.path&&pt(l.slug,l.path)}catch(c){x("[htmlBuilder] storing worker anchor mapping failed",c)}let s=!1;if(typeof o=="string")try{const l=String(o??"").includes(".md");String(r??"").includes(".md")&&l&&(s=!0);const c=ot&&ot();if(c){const f=c.parseFromString(String(o??""),"text/html"),u=Array.from(f.body.childNodes||[]);u.length?e.replaceChildren(...u):e.innerHTML=o}else try{const f=document&&typeof document.createRange=="function"?document.createRange():null;if(f&&typeof f.createContextualFragment=="function"){const u=f.createContextualFragment(String(o??""));e.replaceChildren(...Array.from(u.childNodes))}else e.innerHTML=o}catch{e.innerHTML=o}}catch(l){x("[htmlBuilder] applying rewritten anchors failed",l),s=!0}if(s){const l=Date.now();try{await ph(e,t,n)}catch(c){x("[htmlBuilder] main-thread fallback after worker rewrite failed",c)}finally{Ks("anchor-main-thread",Date.now()-l)}}}function mm(e){try{e.addEventListener("click",t=>{const n=t.target?.closest?.("a")||null;if(!n)return;const r=n.getAttribute?.("href")||"";try{const i=dt(r),a=i?.page??null,o=i?.anchor??null;if(!a&&!o)return;t.preventDefault();let s=null;try{history?.state?.page&&(s=history.state.page)}catch(l){s=null,x("[htmlBuilder] access history.state failed",l)}try{s||(s=new URL(location.href).searchParams.get("page"))}catch(l){x("[htmlBuilder] parse current location failed",l)}if(!a&&o||a&&s&&String(a)===String(s)){try{if(!a&&o)try{history.replaceState(history.state,"",(location.pathname||"")+(location.search||"")+(o?"#"+encodeURIComponent(o):""))}catch(l){x("[htmlBuilder] history.replaceState failed",l)}else try{history.replaceState({page:s||a},"",jt(s||a,o))}catch(l){x("[htmlBuilder] history.replaceState failed",l)}}catch(l){x("[htmlBuilder] update history for anchor failed",l)}try{t.stopImmediatePropagation&&t.stopImmediatePropagation(),t.stopPropagation&&t.stopPropagation()}catch(l){x("[htmlBuilder] stopPropagation failed",l)}try{Is(o)}catch(l){x("[htmlBuilder] scrollToAnchorOrTop failed",l)}return}history.pushState({page:a},"",jt(a,o));try{if(typeof window<"u"&&typeof window.renderByQuery=="function")try{const l=window.renderByQuery();l&&typeof l.catch=="function"&&l.catch(()=>{})}catch(l){x("[htmlBuilder] window.renderByQuery failed",l)}else if(typeof window<"u")try{window.dispatchEvent(new PopStateEvent("popstate"))}catch(l){x("[htmlBuilder] dispatch popstate failed",l)}else try{const l=renderByQuery();l&&typeof l.catch=="function"&&l.catch(()=>{})}catch(l){x("[htmlBuilder] renderByQuery failed",l)}}catch(l){x("[htmlBuilder] SPA navigation invocation failed",l)}}catch(i){x("[htmlBuilder] non-URL href in attachTocClickHandler",i)}})}catch(t){x("[htmlBuilder] attachTocClickHandler failed",t)}}function Is(e){const t=document.querySelector(".nimbi-cms")||null;if(e){const n=document.getElementById(e);if(n)try{const r=()=>{try{if(t&&t.scrollTo&&t.contains(n)){const i=n.getBoundingClientRect().top-t.getBoundingClientRect().top+t.scrollTop;t.scrollTo({top:i,behavior:"smooth"})}else try{n.scrollIntoView({behavior:"smooth",block:"start"})}catch{try{n.scrollIntoView()}catch(a){x("[htmlBuilder] scrollIntoView failed",a)}}}catch{try{n.scrollIntoView()}catch(a){x("[htmlBuilder] final scroll fallback failed",a)}}};try{requestAnimationFrame(()=>setTimeout(r,50))}catch(i){x("[htmlBuilder] scheduling scroll failed",i),setTimeout(r,50)}}catch(r){try{n.scrollIntoView()}catch(i){x("[htmlBuilder] final scroll fallback failed",i)}x("[htmlBuilder] doScroll failed",r)}}else try{t&&t.scrollTo?t.scrollTo({top:0,behavior:"smooth"}):window.scrollTo(0,0)}catch(n){try{window.scrollTo(0,0)}catch(r){x("[htmlBuilder] window.scrollTo failed",r)}x("[htmlBuilder] scroll to top failed",n)}}function gm(e,t,{mountOverlay:n=null,container:r=null,mountEl:i=null,navWrap:a=null,t:o=null}={}){try{const s=typeof o=="function"?o:()=>{},l=r||document.querySelector(".nimbi-cms"),c=i||document.querySelector(".nimbi-mount"),f=n||document.querySelector(".nimbi-overlay"),u=a||document.querySelector(".nimbi-nav-wrap");let h=document.querySelector(".nimbi-scroll-top");if(!h){h=document.createElement("button"),h.className="nimbi-scroll-top button is-primary is-rounded is-small",h.setAttribute("aria-label",s("scrollToTop")||"Scroll to top"),h.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';try{f&&f.appendChild?f.appendChild(h):l&&l.appendChild?l.appendChild(h):c&&c.appendChild?c.appendChild(h):document.body.appendChild(h)}catch{try{document.body.appendChild(h)}catch(y){x("[htmlBuilder] append scroll top button failed",y)}}try{try{lc(h)}catch{}}catch(m){x("[htmlBuilder] set scroll-top button theme registration failed",m)}h.addEventListener("click",()=>{try{r&&r.scrollTo?r.scrollTo({top:0,left:0,behavior:"smooth"}):i&&i.scrollTo?i.scrollTo({top:0,left:0,behavior:"smooth"}):window.scrollTo({top:0,left:0,behavior:"smooth"})}catch{try{r&&(r.scrollTop=0)}catch(y){x("[htmlBuilder] fallback container scrollTop failed",y)}try{i&&(i.scrollTop=0)}catch(y){x("[htmlBuilder] fallback mountEl scrollTop failed",y)}try{document.documentElement.scrollTop=0}catch(y){x("[htmlBuilder] fallback document scrollTop failed",y)}}})}const p=u?.querySelector?.(".menu-label")||null;if(t){if(!h._nimbiObserver)if(typeof globalThis<"u"&&typeof globalThis.IntersectionObserver<"u"){const m=globalThis.IntersectionObserver,y=new m(g=>{for(const d of g)d.target instanceof Element&&(d.isIntersecting?(h.classList.remove("show"),p&&p.classList.remove("show")):(h.classList.add("show"),p&&p.classList.add("show")))},{root:r instanceof Element?r:i instanceof Element?i:null,threshold:0});h._nimbiObserver=y}else h._nimbiObserver=null;try{h._nimbiObserver&&typeof h._nimbiObserver.disconnect=="function"&&h._nimbiObserver.disconnect()}catch(m){x("[htmlBuilder] observer disconnect failed",m)}try{h._nimbiObserver&&typeof h._nimbiObserver.observe=="function"&&h._nimbiObserver.observe(t)}catch(m){x("[htmlBuilder] observer observe failed",m)}try{const m=()=>{try{const y=l instanceof Element?l.getBoundingClientRect():{top:0,bottom:window.innerHeight},g=t.getBoundingClientRect();g.bottom<y.top||g.top>y.bottom?(h.classList.add("show"),p&&p.classList.add("show")):(h.classList.remove("show"),p&&p.classList.remove("show"))}catch(y){x("[htmlBuilder] checkIntersect failed",y)}};m(),typeof globalThis<"u"&&typeof globalThis.IntersectionObserver<"u"||setTimeout(m,100)}catch(m){x("[htmlBuilder] checkIntersect outer failed",m)}}else{h.classList.remove("show"),p&&p.classList.remove("show");const m=r instanceof Element?r:i instanceof Element?i:window,y=()=>{try{(m===window?window.scrollY:m.scrollTop||0)>10?(h.classList.add("show"),p&&p.classList.add("show")):(h.classList.remove("show"),p&&p.classList.remove("show"))}catch(g){x("[htmlBuilder] onScroll handler failed",g)}};aa(()=>m.addEventListener("scroll",Hp(y))),y()}}catch(s){x("[htmlBuilder] ensureScrollTopButton failed",s)}}var fr={created:0,constructionFailures:0,blobUrlsCreated:0,blobUrlsRevoked:0,blobCacheEvictions:0};function tn(e){if(typeof Blob<"u"&&typeof URL<"u"&&e)try{tn._blobUrlCache||(tn._blobUrls=new Set,tn._blobUrlCache=new vr({maxEntries:200,onEvict:(i,a)=>{try{typeof URL<"u"&&a&&(URL.revokeObjectURL(a),fr.blobUrlsRevoked+=1,fr.blobCacheEvictions+=1)}catch{}tn._blobUrls?.delete(a)}}));const t=tn._blobUrlCache;let n=t.get(e);if(!n){const i=new Blob([e],{type:"application/javascript"});n=URL.createObjectURL(i),t.set(e,n),tn._blobUrls.add(n),fr.blobUrlsCreated+=1}let r=null;try{r=new Worker(n,{type:"module"})}catch(i){try{x("[worker-manager] Worker construction failed",i)}catch{}return fr.constructionFailures+=1,yr("workerConstructionFailure"),null}try{r.addEventListener("error",i=>{try{x("[worker-manager] Worker error",i)}catch{}})}catch{}return fr.created+=1,yr("workerCreated"),r}catch(t){try{x("[worker-manager] createWorkerFromRaw failed",t)}catch{}}return null}function ym(){const e=tn._blobUrls;if(e){for(const t of e)try{typeof URL<"u"&&URL.revokeObjectURL(t),fr.blobUrlsRevoked+=1}catch{}e.clear(),tn._blobUrlCache?.clear?.(),delete tn._blobUrlCache,delete tn._blobUrls}}var _m=null,wm=null,bm=[];function vm(){_m=null,wm=null,bm=[]}async function yh(){return vf}async function km(e,t=1,n=void 0,r=void 0){return(await yh()).buildSearchIndexWorker(e,t,n,r)}async function xm(e={}){return(await yh()).awaitSearchIndex(e)}var cs=Sa({attachSitemapDownloadUI:()=>zs,clearSitemapWriteTimer:()=>ka,exposeSitemapGlobals:()=>$s,generateAtomXml:()=>ba,generateLlmsTxt:()=>va,generateRobotsTxt:()=>Am,generateRssXml:()=>wa,generateSitemapJson:()=>Oa,generateSitemapXml:()=>_a,handleSitemapRequest:()=>mi}),ya=new Set;function Ia(e){try{if(e){const t=new URL(e,"http://localhost/");return`${t.origin}${t.pathname.replace(/[^/]*$/,"")||"/"}`}if(typeof location?.pathname=="string")return String(location.origin+location.pathname.split("?")[0])}catch{}return"http://localhost/"}function Ye(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}function Vl(e){try{return!e||typeof e!="string"?"":(e.split("/").filter(Boolean).pop()||e).replace(/\.[a-z0-9]+$/i,"").replace(/[-_]+/g," ").split(" ").map(t=>t?t.charAt(0).toUpperCase()+t.slice(1):"").join(" ").trim()}catch{return String(e)}}function Sm(e){try{if(!e||typeof e!="string")return null;const t=e.trim();if(!t)return null;if(/^[a-z][a-z0-9+.-]*:/i.test(t))return t;if(t.startsWith("//"))return"https:"+t;try{if(typeof location<"u"&&location.origin)return new URL(t,location.origin).href}catch{}return t}catch{return null}}function Em(e,t){try{const n=t?.slug?String(t.slug):null;if(!n)return null;const r={loc:e+"?page="+encodeURIComponent(n),slug:n};return t.title&&(r.title=String(t.title)),t.excerpt&&(r.excerpt=String(t.excerpt)),t.path&&(r.sourcePath=oe(String(t.path))),t.image&&(r.image=String(t.image)),r}catch{return null}}async function Oa(e={}){const{includeAllMarkdown:t=!0,index:n,homePage:r,navigationPage:i,notFoundPage:a}=e||{},o=Ia(e.baseUrl).split("?")[0];let s=Array.isArray(le)&&le.length?le:Array.isArray(n)?n:[];if(Array.isArray(n)&&n.length&&Array.isArray(le)&&le.length){const g=new Map;try{for(const d of n)try{d?.slug&&g.set(String(d.slug),d)}catch{}for(const d of le)try{d?.slug&&g.set(String(d.slug),d)}catch{}}catch{}s=Array.from(g.values())}const l=new Set;try{typeof a=="string"&&a.trim()&&l.add(oe(String(a)))}catch{}try{typeof i=="string"&&i.trim()&&l.add(oe(String(i)))}catch{}const c=new Set;try{if(typeof a=="string"&&a.trim()){const g=oe(String(a));try{if(typeof ge?.has=="function"&&ge.has(g))try{c.add(ge.get(g))}catch{}else try{const d=await Ke(g,e?.contentBase?e.contentBase:void 0);if(d?.raw)try{let _=null;if(d.isHtml)try{const w=ot();if(w){const k=w.parseFromString(d.raw,"text/html"),v=k.querySelector("h1")||k.querySelector("title");v&&v.textContent&&(_=v.textContent.trim())}else{const k=(d.raw||"").match(/<h1[^>]*>(.*?)<\/h1>|<title[^>]*>(.*?)<\/title>/i);k&&(_=(k[1]||k[2]||"").trim())}}catch{}else{const w=(d.raw||"").match(/^#\s+(.+)$/m);w&&w[1]&&(_=w[1].trim())}_&&c.add(be(_))}catch{}}catch{}}catch{}}}catch{}const f=new Set,u=[],h=new Map,p=new Map,m=g=>{try{if(!g||typeof g!="string")return!1;const d=oe(String(g));try{if(typeof Xe?.has=="function"&&Xe.has(d))return!0}catch{}try{if(typeof ge?.has=="function"&&ge.has(d))return!0}catch{}try{if(p?.has(d))return!0}catch{}try{if(typeof ge?.keys=="function"&&ge.size)for(const _ of ge.keys())try{if(oe(String(_))===d)return!0}catch{}else for(const _ of ne.values())try{if(!_)continue;if(typeof _=="string"){if(oe(String(_))===d)return!0}else if(_&&typeof _=="object"){if(_.default&&oe(String(_.default))===d)return!0;const w=_.langs||{};for(const k of Object.keys(w||{}))try{if(w[k]&&oe(String(w[k]))===d)return!0}catch{}}}catch{}}catch{}}catch{}return!1};if(Array.isArray(s)&&s.length){let g=0;for(const d of s){try{g++,await An(g,64)}catch{}try{if(!d?.slug)continue;const _=String(d.slug),w=String(_).split("::")[0];if(c.has(w))continue;const k=d.path?oe(String(d.path)):null;if(k&&l.has(k))continue;const v=d.title?String(d.title):d.parentTitle?String(d.parentTitle):void 0;h.set(_,{title:v||void 0,excerpt:d.excerpt?String(d.excerpt):void 0,path:k,source:"index",image:d.image?String(d.image):void 0}),k&&p.set(k,{title:v||void 0,excerpt:d.excerpt?String(d.excerpt):void 0,slug:_,image:d.image?String(d.image):void 0});const I=Em(o,d);if(!I||!I.slug||f.has(I.slug))continue;if(f.add(I.slug),h.has(I.slug)){const N=h.get(I.slug);N?.title&&(I.title=N.title,I._titleSource="index"),N?.excerpt&&(I.excerpt=N.excerpt),N?.image&&(I.image=N.image)}u.push(I)}catch{continue}}}if(t)try{let g=0;for(const[d,_]of ne.entries()){try{g++,await An(g,128)}catch{}try{if(!d)continue;const w=String(d).split("::")[0];if(f.has(d)||c.has(w))continue;let k=null;if(typeof _=="string"?k=oe(String(_)):_&&typeof _=="object"&&(k=oe(String(_.default??""))),k&&l.has(k))continue;const v={loc:o+"?page="+encodeURIComponent(d),slug:d};if(h.has(d)){const I=h.get(d);I?.title&&(v.title=I.title,v._titleSource="index"),I?.excerpt&&(v.excerpt=I.excerpt),I?.image&&(v.image=I.image)}else if(k){const I=p.get(k);I?.title&&(v.title=I.title,v._titleSource="path",!v.excerpt&&I?.excerpt&&(v.excerpt=I.excerpt)),!v.image&&I?.image&&(v.image=I.image)}if(f.add(d),typeof d=="string"){const I=d.indexOf("/")!==-1||/\.(md|html?)$/i.test(d),N=v.title&&typeof v.title=="string"&&(v.title.indexOf("/")!==-1||/\.(md|html?)$/i.test(v.title));(!v.title||N||I)&&(v.title=Vl(d),v._titleSource="humanize")}u.push(v)}catch{}}try{if(r&&typeof r=="string"){const d=oe(String(r));let _=null;try{typeof ge?.has=="function"&&ge.has(d)&&(_=ge.get(d))}catch{}_||(_=d);const w=String(_).split("::")[0];if(!f.has(_)&&!l.has(d)&&!c.has(w)){const k={loc:o+"?page="+encodeURIComponent(_),slug:_};if(h.has(_)){const v=h.get(_);v?.title&&(k.title=v.title,k._titleSource="index"),v?.excerpt&&(k.excerpt=v.excerpt),v?.image&&(k.image=v.image)}f.add(_),u.push(k)}}}catch{}}catch{}try{const g=new Set,d=new Set(u.map(I=>String(I?.slug??""))),_=new Set;for(const I of u)try{I?.sourcePath&&_.add(String(I.sourcePath))}catch{}const w=30;let k=0,v=0;for(const I of _){try{v++,await An(v,8)}catch{}if(k>=w)break;try{if(!I||typeof I!="string"||!m(I))continue;k+=1;const N=await Ke(I,e?.contentBase?e.contentBase:void 0);if(!N||!N.raw||N&&typeof N.status=="number"&&N.status===404)continue;const z=(function(ke){try{return String(ke??"")}catch{return""}})(N.raw),W=[],q=/\[[^\]]+\]\(([^)]+)\)/g;let ae;for(;ae=q.exec(z);)try{ae?.[1]&&W.push(ae[1])}catch{}const G=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;ae=G.exec(z);)try{ae?.[1]&&W.push(ae[1])}catch{}for(const ke of W)try{if(!ke)continue;if(ke.indexOf("?")!==-1||ke.indexOf("=")!==-1)try{const B=new URL(ke,o).searchParams.get("page");if(B){const E=String(B);!d.has(E)&&!g.has(E)&&(g.add(E),u.push({loc:o+"?page="+encodeURIComponent(E),slug:E}));continue}}catch{}let Y=String(ke).split(/[?#]/)[0];if(Y=Y.replace(/^\.\//,"").replace(/^\//,""),!Y||!/\.(md|html?)$/i.test(Y))continue;try{const B=oe(Y);if(ge?.has?.(B)){const E=ge?.get?.(B),A=String(E).split("::")[0];E&&!d.has(E)&&!g.has(E)&&!c.has(A)&&!l.has(B)&&(g.add(E),u.push({loc:o+"?page="+encodeURIComponent(E),slug:E,sourcePath:B}));continue}try{if(!m(B))continue;const E=await Ke(B,e?.contentBase?e.contentBase:void 0);if(E&&typeof E.status=="number"&&E.status===404)continue;if(E&&E.raw){const A=(E.raw||"").match(/^#\s+(.+)$/m),C=A&&A[1]?A[1].trim():"",M=be(C||B),se=String(M).split("::")[0];M&&!d.has(M)&&!g.has(M)&&!c.has(se)&&(g.add(M),u.push({loc:o+"?page="+encodeURIComponent(M),slug:M,sourcePath:B,title:C||void 0}))}}catch{}}catch{}}catch{}}catch{}}}catch{}try{const g=new Map;let d=0;for(const w of u){try{d++,await An(d,128)}catch{}try{if(!w||!w.slug)continue;g.set(String(w.slug),w)}catch{}}const _=new Set;for(const w of u)try{if(!w||!w.slug)continue;const k=String(w.slug),v=k.split("::")[0];if(!v)continue;k!==v&&!g.has(v)&&_.add(v)}catch{}for(const w of _)try{let k=null;if(h.has(w)){const v=h.get(w);k={loc:o+"?page="+encodeURIComponent(w),slug:w},v?.title&&(k.title=v.title,k._titleSource="index"),v?.excerpt&&(k.excerpt=v.excerpt),v?.path&&(k.sourcePath=v.path),v?.lastmod&&(k.lastmod=v.lastmod),v?.image&&(k.image=v.image)}else if(p&&ne?.has?.(w)){const v=ne?.get?.(w);let I=null;if(typeof v=="string"?I=oe(String(v)):v&&typeof v=="object"&&(I=oe(String(v.default??""))),k={loc:o+"?page="+encodeURIComponent(w),slug:w},I&&p.has(I)){const N=p.get(I);N?.title&&(k.title=N.title,k._titleSource="path"),N?.excerpt&&(k.excerpt=N.excerpt),k.sourcePath=I,N?.lastmod&&(k.lastmod=N.lastmod),N?.image&&(k.image=N.image)}}k||(k={loc:o+"?page="+encodeURIComponent(w),slug:w,title:Vl(w)},k._titleSource="humanize"),g.has(w)||(u.push(k),g.set(w,k))}catch{}}catch{}const y=[];try{const g=new Set;let d=0;for(const _ of u){try{d++,await An(d,128)}catch{}try{if(!_||!_.slug)continue;const w=String(_.slug),k=String(w).split("::")[0];if(c.has(k)||w.indexOf("::")!==-1||g.has(w))continue;g.add(w),y.push(_)}catch{}}}catch{}try{try{ue(()=>"[runtimeSitemap] generateSitemapJson finalEntries.titleSource: "+JSON.stringify(y.map(g=>({slug:g.slug,title:g.title,titleSource:g._titleSource||null})),null,2))}catch{}}catch{}try{let d=0;const _=y.length,w=Array.from({length:Math.min(4,_)}).map(async()=>{for(;;){const k=d++;if(k>=_)break;const v=y[k];try{if(!v||!v.slug)continue;const I=String(v.slug).split("::")[0];if(c.has(I)||v._titleSource==="index")continue;let N=null;try{if(ne?.has?.(v.slug)){const z=ne?.get?.(v.slug);typeof z=="string"?N=oe(String(z)):z&&typeof z=="object"&&(N=oe(String(z.default??"")))}!N&&v.sourcePath&&(N=v.sourcePath)}catch{continue}if(!N||l.has(N)||!m(N))continue;try{const z=await Ke(N,e?.contentBase?e.contentBase:void 0);if(!z||!z.raw||z&&typeof z.status=="number"&&z.status===404)continue;if(z&&z.raw){const W=(z.raw||"").match(/^#\s+(.+)$/m),q=W&&W[1]?W[1].trim():"";q&&(v.title=q,v._titleSource="fetched")}}catch(z){ue("[runtimeSitemap] fetch title failed for",N,z)}}catch(I){ue("[runtimeSitemap] worker loop failure",I)}}});await Promise.all(w)}catch(g){ue("[runtimeSitemap] title enrichment failed",g)}return{generatedAt:new Date().toISOString(),entries:y}}function _a(e){const t=Array.isArray(e?.entries)?e.entries:Array.isArray(e)?e:[];let n=`<?xml version="1.0" encoding="UTF-8"?>
`;n+=`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;for(const r of t)try{if(n+=`  <url>
`,n+=`    <loc>${Ye(String(r.loc??""))}</loc>
`,r.lastmod&&(n+=`    <lastmod>${Ye(String(r.lastmod))}</lastmod>
`),r.changefreq&&(n+=`    <changefreq>${Ye(String(r.changefreq))}</changefreq>
`),r.priority&&(n+=`    <priority>${Ye(String(r.priority))}</priority>
`),r.hreflang){const i=Array.isArray(r.hreflang)?r.hreflang:[r.hreflang];for(const a of i)n+=`    <xhtml:link rel="alternate" hreflang="${Ye(String(a.lang))}" href="${Ye(String(a.href))}" />
`}if(r.image){const i=Sm(String(r.image));i&&(n+=`    <image:image>
`,n+=`      <image:loc>${Ye(i)}</image:loc>
`,n+=`    </image:image>
`)}n+=`  </url>
`}catch{}return n+=`</urlset>
`,n}function wa(e){const t=Array.isArray(e?.entries)?e.entries:Array.isArray(e)?e:[],n=Ia().split("?")[0];let r=`<?xml version="1.0" encoding="UTF-8"?>
`;r+=`<rss version="2.0">
`,r+=`<channel>
`,r+=`<title>${Ye("Sitemap RSS")}</title>
`,r+=`<link>${Ye(n)}</link>
`,r+=`<description>${Ye("RSS feed generated from site index")}</description>
`,r+=`<lastBuildDate>${Ye(e?.generatedAt?new Date(e.generatedAt).toUTCString():new Date().toUTCString())}</lastBuildDate>
`;for(const i of t)try{const a=String(i.loc??"");r+=`<item>
`,r+=`<title>${Ye(String(i.title||i.slug||(i.loc??"")))}</title>
`,i.excerpt&&(r+=`<description>${Ye(String(i.excerpt))}</description>
`),r+=`<link>${Ye(a)}</link>
`,r+=`<guid>${Ye(a)}</guid>
`,r+=`</item>
`}catch{}return r+=`</channel>
`,r+=`</rss>
`,r}function ba(e){const t=Array.isArray(e?.entries)?e.entries:Array.isArray(e)?e:[],n=Ia().split("?")[0],r=e?.generatedAt?new Date(e.generatedAt).toISOString():new Date().toISOString();let i=`<?xml version="1.0" encoding="utf-8"?>
`;i+=`<feed xmlns="http://www.w3.org/2005/Atom">
`,i+=`<title>${Ye("Sitemap Atom")}</title>
`,i+=`<link href="${Ye(n)}" />
`,i+=`<updated>${Ye(r)}</updated>
`,i+=`<id>${Ye(n)}</id>
`;for(const a of t)try{const o=String(a.loc??""),s=a?.lastmod?new Date(a.lastmod).toISOString():r;i+=`<entry>
`,i+=`<title>${Ye(String(a.title||a.slug||(a.loc??"")))}</title>
`,a.excerpt&&(i+=`<summary>${Ye(String(a.excerpt))}</summary>
`),i+=`<link href="${Ye(o)}" />
`,i+=`<id>${Ye(o)}</id>
`,i+=`<updated>${Ye(s)}</updated>
`,i+=`</entry>
`}catch{}return i+=`</feed>
`,i}function Am(e={}){const{sitemapUrl:t,disallow:n=[]}=e||{};let r=`User-agent: *
`;for(const i of n)r+=`Disallow: ${String(i)}
`;return typeof t=="string"&&t.trim()&&(r+=`Sitemap: ${String(t.trim())}
`),r}function va(e,t={}){const n=Array.isArray(e?.entries)?e.entries:Array.isArray(e)?e:[],r=Ia().split("?")[0];let i=String(t?.name??"").trim();if(!i)try{i=typeof document<"u"&&document.title?String(document.title).split(/[|\-–—]/)[0].trim():""}catch{}i||(i="Site");const a=String(t?.description??"").trim();let o=`# ${i}
`;a&&(o+=`
> ${a}
`),n.length&&(o+=`
`);for(const s of n)try{const l=String(s?.title||s?.slug||"").trim();if(!l)continue;const c=s?.slug?String(s.slug):null,f=String(s?.loc||(c?`${r}?page=${encodeURIComponent(c)}`:r)),u=s?.excerpt?`: ${String(s.excerpt).replace(/\s+/g," ").trim()}`:"";o+=`- [${l}](${f})${u}
`}catch{}return o}function ka(){try{typeof window<"u"&&window.__nimbiSitemapWriteTimer&&(clearTimeout(window.__nimbiSitemapWriteTimer),window.__nimbiSitemapWriteTimer=null,window.__nimbiSitemapPendingWrite=null);for(const e of ya)clearTimeout(e);ya.clear()}catch{}}function Gl(e,t="application/xml"){try{try{document.open(t,"replace")}catch{try{document.open()}catch{}}document.write(e),document.close();try{if(typeof Blob<"u"&&typeof URL<"u"&&URL.createObjectURL){const n=new Blob([e],{type:t}),r=URL.createObjectURL(n);try{location.href=r}catch{try{window.open(r,"_self")}catch{}}const i=setTimeout(()=>{try{URL.revokeObjectURL(r)}catch{}ya.delete(i)},5e3);ya.add(i)}}catch{}}catch{try{try{const r=document.createElement("pre");try{r.textContent=Ye(e)}catch{try{r.textContent=String(e)}catch{}}if(document&&document.body)try{if(typeof document.body.replaceChildren=="function")document.body.replaceChildren(r);else{for(;document.body.firstChild;)document.body.removeChild(document.body.firstChild);document.body.appendChild(r)}}catch{try{document.body.innerHTML="<pre>"+Ye(e)+"</pre>"}catch{}}}catch{}}catch{}}}function Os(e){try{const t=Array.isArray(e?.entries)?e.entries:Array.isArray(e)?e:[];let n='<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Sitemap</title></head><body>';n+="<h1>Sitemap</h1><ul>";for(const r of t)try{n+=`<li><a href="${Ye(String(r&&r.loc?r.loc:""))}">${Ye(String(r&&(r.title||r.slug)||r&&r.loc||""))}</a></li>`}catch{}return n+="</ul></body></html>",n}catch{return"<!doctype html><html><body><pre>failed to render sitemap</pre></body></html>"}}function Tm(e,t,n){const r=n||globalThis?.window?.__nimbiRuntimeManifest||null,i=r?.generation,a={"content-type":t};Number.isInteger(i)&&(a["x-nimbi-generation"]=String(i)),typeof r?.language=="string"&&r.language&&(a["x-nimbi-language"]=r.language),typeof r?.contentBase=="string"&&r.contentBase&&(a["x-nimbi-content-base"]=r.contentBase);let o;return t==="application/rss+xml"?o=wa(e):t==="application/atom+xml"?o=ba(e):t==="text/html"?o=Os(e):t==="text/plain"?o=va(e):o=_a(e),typeof globalThis?.Response=="function"?new globalThis.Response(o,{headers:a}):o}function Ur(e,t="application/xml"){try{if(typeof window>"u"){try{let r=null;t==="application/rss+xml"?r=wa(e):t==="application/atom+xml"?r=ba(e):t==="text/html"?r=Os(e):t==="text/plain"?r=va(e):r=_a(e),Gl(r,t);try{typeof window<"u"&&(window.__nimbiSitemapRenderedAt=Date.now(),window.__nimbiSitemapJson=e,window.__nimbiSitemapFinal=e.entries||[])}catch{}}catch{}return}const n=Array.isArray(e?.entries)?e.entries.length:0;try{const r=window.__nimbiSitemapPendingWrite||null;(!r||typeof r.len=="number"&&r.len<n)&&(window.__nimbiSitemapPendingWrite={finalJson:e,mimeType:t,len:n}),window.__nimbiSitemapWriteTimer&&(clearTimeout(window.__nimbiSitemapWriteTimer),window.__nimbiSitemapWriteTimer=null),window.__nimbiSitemapWriteTimer=setTimeout(()=>{try{if(typeof window>"u")return;const i=window.__nimbiSitemapPendingWrite;if(!i)return;let a=null;i.mimeType==="application/rss+xml"?a=wa(i.finalJson):i.mimeType==="application/atom+xml"?a=ba(i.finalJson):i.mimeType==="text/html"?a=Os(i.finalJson):i.mimeType==="text/plain"?a=va(i.finalJson):a=_a(i.finalJson);try{Gl(a,i.mimeType)}catch{}try{window.__nimbiSitemapRenderedAt=Date.now(),window.__nimbiSitemapJson=i.finalJson,window.__nimbiSitemapFinal=i.finalJson.entries||[]}catch{}}catch{}try{typeof window<"u"&&clearTimeout(window.__nimbiSitemapWriteTimer)}catch{}try{typeof window<"u"&&(window.__nimbiSitemapWriteTimer=null,window.__nimbiSitemapPendingWrite=null)}catch{}},40)}catch{}try{window.__nimbiSitemapUnloadListenerAttached||(window.__nimbiSitemapUnloadListenerAttached=!0,window.addEventListener("beforeunload",ka))}catch{}}catch{}}async function mi(e={}){try{let t;try{e.url?t=new URL(e.url,"http://localhost/"):typeof location<"u"?t=location:t={pathname:"/",search:"",href:"http://localhost/"}}catch{return!1}if(!e.returnResponse&&typeof document>"u")return!1;let n=!1,r=!1,i=!1,a=!1,o=!1;try{const h=new URLSearchParams(t.search||"");if(h.has("sitemap")){let p=!0;for(const m of h.keys())m!=="sitemap"&&(p=!1);p&&(n=!0)}if(h.has("rss")){let p=!0;for(const m of h.keys())m!=="rss"&&(p=!1);p&&(r=!0)}if(h.has("atom")){let p=!0;for(const m of h.keys())m!=="atom"&&(p=!1);p&&(i=!0)}if(h.has("llms")){let p=!0;for(const m of h.keys())m!=="llms"&&(p=!1);p&&(o=!0)}}catch{}if(!n&&!r&&!i&&!o){const h=(t.pathname||"/").replace(/\/\/+/g,"/").split("/").filter(Boolean).pop()||"";if(!h||(n=/^(sitemap|sitemap\.xml)$/i.test(h),r=/^(rss|rss\.xml)$/i.test(h),i=/^(atom|atom\.xml)$/i.test(h),a=/^(sitemap|sitemap\.html)$/i.test(h),o=/^llms\.txt$/i.test(h),!n&&!r&&!i&&!a&&!o))return!1}let s=[];const l=typeof e.waitForIndexMs=="number"?e.waitForIndexMs:1/0;try{if(typeof Pn=="function")try{const h=await Pn({timeoutMs:l,contentBase:e?.contentBase,indexDepth:e?.indexDepth,noIndexing:e?.noIndexing,startBuild:!0});if(Array.isArray(h)&&h.length)if(Array.isArray(e.index)&&e.index.length){const p=new Map;try{for(const m of e.index)try{m?.slug&&p.set(String(m.slug),m)}catch{}for(const m of h)try{m?.slug&&p.set(String(m.slug),m)}catch{}}catch{}s=Array.from(p.values())}else s=h;else s=Array.isArray(e.index)&&e.index.length?e.index:Array.isArray(le)&&le.length?le:[]}catch{s=Array.isArray(e.index)&&e.index.length?e.index:Array.isArray(le)&&le.length?le:[]}else s=Array.isArray(le)&&le.length?le:Array.isArray(e.index)&&e.index.length?e.index:[]}catch{s=Array.isArray(e.index)&&e.index.length?e.index:Array.isArray(le)&&le.length?le:[]}try{if(Array.isArray(e.index)&&e.index.length)try{const h=new Map;for(const p of e.index)try{if(!p||!p.slug)continue;const m=String(p.slug).split("::")[0];if(!h.has(m))h.set(m,p);else{const y=h.get(m);y&&String(y.slug??"").indexOf("::")!==-1&&String(p.slug??"").indexOf("::")===-1&&h.set(m,p)}}catch{}try{ue(()=>"[runtimeSitemap] providedIndex.dedupedByBase: "+JSON.stringify(Array.from(h.values()),null,2))}catch{ue(()=>"[runtimeSitemap] providedIndex.dedupedByBase (count): "+String(h.size))}}catch(h){x("[runtimeSitemap] logging provided index failed",h)}}catch{}if((!Array.isArray(s)||!s.length)&&typeof Rn=="function")try{const h=typeof e.waitForIndexMs=="number"?e.waitForIndexMs:1/0;let p=null;try{typeof Pn=="function"&&(p=await Pn({timeoutMs:h,contentBase:e?.contentBase,indexDepth:e?.indexDepth,noIndexing:e?.noIndexing,startBuild:!0}))}catch{p=null}if(Array.isArray(p)&&p.length)s=p;else{const m=typeof e.indexDepth=="number"?e.indexDepth:3,y=Array.isArray(e.noIndexing)?e.noIndexing:void 0,g=[];e?.homePage&&g.push(e.homePage),e?.navigationPage&&g.push(e.navigationPage),s=await Rn(e?.contentBase,m,y,g.length?g:void 0)}}catch(h){x("[runtimeSitemap] rebuild index failed",h),s=Array.isArray(le)&&le.length?le:[]}try{const h=Array.isArray(s)?s.length:0;try{ue(()=>"[runtimeSitemap] usedIndex.full.length (before rebuild): "+String(h))}catch{}try{ue(()=>"[runtimeSitemap] usedIndex.full (before rebuild): "+JSON.stringify(s,null,2))}catch{}}catch{}try{const h=[];e?.homePage&&h.push(e.homePage),e?.navigationPage&&h.push(e.navigationPage);const p=typeof e.indexDepth=="number"?e.indexDepth:3,m=Array.isArray(e.noIndexing)?e.noIndexing:void 0;let y=null;try{const g=typeof globalThis<"u"&&typeof globalThis.buildSearchIndexWorker=="function"?globalThis.buildSearchIndexWorker:void 0;if(typeof g=="function")try{y=await g(e?.contentBase,p,m)}catch{y=null}}catch{y=null}if((!y||!y.length)&&typeof Rn=="function")try{y=await Rn(e?.contentBase,p,m,h.length?h:void 0)}catch{y=null}if(Array.isArray(y)&&y.length){const g=new Map;try{for(const d of s)try{d?.slug&&g.set(String(d.slug),d)}catch{}for(const d of y)try{d?.slug&&g.set(String(d.slug),d)}catch{}}catch{}s=Array.from(g.values())}}catch(h){try{x("[runtimeSitemap] rebuild index call failed",h)}catch{}}try{const h=Array.isArray(s)?s.length:0;try{ue(()=>"[runtimeSitemap] usedIndex.full.length (after rebuild): "+String(h))}catch{}try{ue(()=>"[runtimeSitemap] usedIndex.full (after rebuild): "+JSON.stringify(s,null,2))}catch{}}catch{}const c=await Oa(Object.assign({},e,e.url?{baseUrl:t.href}:{},{index:s}));let f=[];try{const h=new Set,p=Array.isArray(c?.entries)?c.entries:[];for(const m of p)try{let y=null;if(m&&m.slug)y=String(m.slug);else if(m&&m.loc)try{y=new URL(String(m.loc)).searchParams.get("page")}catch{}if(!y)continue;const g=String(y).split("::")[0];if(!h.has(g)){h.add(g);const d=Object.assign({},m);d.baseSlug=g,f.push(d)}}catch{}try{ue(()=>"[runtimeSitemap] finalEntries.dedupedByBase: "+JSON.stringify(f,null,2))}catch{ue(()=>"[runtimeSitemap] finalEntries.dedupedByBase (count): "+String(f.length))}}catch{try{f=Array.isArray(c?.entries)?c.entries.slice(0):[]}catch{f=[]}}const u=Object.assign({},c||{},{entries:Array.isArray(f)?f:Array.isArray(c?.entries)?c.entries:[]});if(e.returnResponse)return Tm(u,r?"application/rss+xml":i?"application/atom+xml":o?"text/plain":a?"text/html":"application/xml",e.runtimeManifest);try{if(typeof window<"u")try{window.__nimbiSitemapJson=u,window.__nimbiSitemapFinal=f}catch{}}catch{}if(o)return Ur(u,"text/plain"),!0;if(r){const h=Array.isArray(u?.entries)?u.entries.length:0;let p=-1;try{typeof window<"u"&&Array.isArray(window.__nimbiSitemapFinal)&&typeof window.__nimbiSitemapRenderedAt=="number"&&(p=window.__nimbiSitemapFinal.length)}catch{}if(p>h){try{ue("[runtimeSitemap] skip RSS write: existing rendered sitemap larger",p,h)}catch{}return!0}return Ur(u,"application/rss+xml"),!0}if(i){const h=Array.isArray(u?.entries)?u.entries.length:0;let p=-1;try{typeof window<"u"&&Array.isArray(window.__nimbiSitemapFinal)&&typeof window.__nimbiSitemapRenderedAt=="number"&&(p=window.__nimbiSitemapFinal.length)}catch{}if(p>h){try{ue("[runtimeSitemap] skip Atom write: existing rendered sitemap larger",p,h)}catch{}return!0}return Ur(u,"application/atom+xml"),!0}if(n){const h=Array.isArray(u?.entries)?u.entries.length:0;let p=-1;try{typeof window<"u"&&Array.isArray(window.__nimbiSitemapFinal)&&typeof window.__nimbiSitemapRenderedAt=="number"&&(p=window.__nimbiSitemapFinal.length)}catch{}if(p>h){try{ue("[runtimeSitemap] skip XML write: existing rendered sitemap larger",p,h)}catch{}return!0}return Ur(u,"application/xml"),!0}if(a)try{const h=(Array.isArray(u?.entries)?u.entries:[]).length;let p=-1;try{typeof window<"u"&&Array.isArray(window.__nimbiSitemapFinal)&&typeof window.__nimbiSitemapRenderedAt=="number"&&(p=window.__nimbiSitemapFinal.length)}catch{}if(p>h){try{ue("[runtimeSitemap] skip HTML write: existing rendered sitemap larger",p,h)}catch{}return!0}return Ur(u,"text/html"),!0}catch(h){return x("[runtimeSitemap] render HTML failed",h),!1}return!1}catch(t){return x("[runtimeSitemap] handleSitemapRequest failed",t),!1}}function zs(e,t={}){try{if(!e||typeof document>"u")return null;const n=document.createElement("button");return n.type="button",n.className="button is-small is-light",n.textContent="Download sitemap",n.setAttribute("aria-label","Download sitemap JSON"),n.addEventListener("click",async()=>{try{const r=await Oa(),i=JSON.stringify(r,null,2),a=new Blob([i],{type:"application/json"}),o=URL.createObjectURL(a);try{const s=document.createElement("a");s.href=o,s.download=String(t?.filename||"sitemap.json").replace(/\\/g,"_").replace(/[^A-Za-z0-9_.-]/g,"_").replace(/^_+/,"").replace(/_+$/,"")||"sitemap.json",s.className="nimbi-sitemap-download",document.body.appendChild(s),s.click(),s.remove()}finally{setTimeout(()=>{try{URL.revokeObjectURL(o)}catch{}},0)}}catch(r){x("[runtimeSitemap] attachSitemapDownloadUI click failed",r)}}),e.appendChild(n),n}catch(n){return x("[runtimeSitemap] attachSitemapDownloadUI failed",n),null}}async function $s(e={}){try{const t=typeof e.waitForIndexMs=="number"?e.waitForIndexMs:1/0;let n=[];try{if(typeof Pn=="function")try{const o=await Pn({timeoutMs:t,contentBase:e?.contentBase,indexDepth:e?.indexDepth,noIndexing:e?.noIndexing,startBuild:!0});Array.isArray(o)&&o.length&&(n=o)}catch{}}catch{}(!Array.isArray(n)||!n.length)&&Array.isArray(le)&&le.length&&(n=le),(!Array.isArray(n)||!n.length)&&Array.isArray(e.index)&&e.index.length&&(n=e.index);const r=await Oa(Object.assign({},e,{index:n}));let i=[];try{const o=new Set,s=Array.isArray(r?.entries)?r.entries:[];for(const l of s)try{let c=null;if(l&&l.slug)c=String(l.slug);else if(l&&l.loc)try{c=new URL(String(l.loc)).searchParams.get("page")}catch{c=null}if(!c)continue;const f=String(c).split("::")[0];if(!o.has(f)){o.add(f);const u=Object.assign({},l);u.baseSlug=f,i.push(u)}}catch{}}catch{try{i=Array.isArray(r?.entries)?r.entries.slice(0):[]}catch{i=[]}}const a=Object.assign({},r||{},{entries:Array.isArray(i)?i:Array.isArray(r?.entries)?r.entries:[]});try{if(typeof window<"u")try{window.__nimbiSitemapJson=a,window.__nimbiSitemapFinal=i}catch{}}catch{}return{json:a,deduped:i}}catch{return null}}function Mm(e){try{if(!Array.isArray(e))return e;e.forEach(t=>{try{if(!t||typeof t!="object")return;let n=typeof t.slug=="string"?String(t.slug):"",r=null;if(n&&n.indexOf("::")!==-1){const s=n.split("::");n=s[0]||"",r=s.slice(1).join("::")||null}const i=!!(n&&(n.indexOf(".")!==-1||n.indexOf("/")!==-1));let a="";try{if(t.path&&typeof t.path=="string"){const s=oe(String(t.path??""));if(a=findSlugForPath(s)||ge?.get(s)||"",!a)if(t.title&&String(t.title).trim())a=be(String(t.title).trim());else{const l=s.replace(/^.*\//,"").replace(/\.(?:md|html?)$/i,"");a=be(l||s)}}else if(i){const s=String(n).replace(/\.(?:md|html?)$/i,""),l=findSlugForPath(s)||ge?.get(s)||"";l?a=l:t.title&&String(t.title).trim()?a=be(String(t.title).trim()):a=be(s)}else!n&&t.title&&String(t.title).trim()?a=be(String(t.title).trim()):a=n||""}catch{try{a=t.title&&String(t.title).trim()?be(String(t.title).trim()):n?be(n):""}catch{a=n}}let o=a||"";r&&(o=o?`${o}::${r}`:`${be(r)}`),o&&(t.slug=o);try{if(t.path&&o){const s=String(o).split("::")[0];try{pt(s,oe(String(t.path??"")))}catch{}}}catch{}}catch{}})}catch{}return e}async function Cm(e,t,n,r,i,a,o,s,l="eager",c=1,f=void 0,u="favicon",h){if(!e||!(e instanceof HTMLElement))throw new TypeError("navbarWrap must be an HTMLElement");const p=ot(),m=p?p.parseFromString(n||"","text/html"):null,y=m?m.querySelectorAll("a"):[];await aa(()=>nm(y,r)),await aa(()=>rm(y,r));try{ye(y,r)}catch{}try{if(t&&t instanceof HTMLElement&&(!t.hasAttribute||!t.hasAttribute("role")))try{t.setAttribute("role","main")}catch{}}catch{}let g=null,d=null,_=null,w=null,k=null,v=null,I=null,N=0,z=!1,W=null;const q=new Map,ae=(D,T,U,L)=>{h?D.addEventListener(T,U,{...L,signal:h}):D.addEventListener(T,U,L)};function G(){try{const D=typeof E<"u"&&E&&E.querySelector?E.querySelector(".navbar-burger"):e&&e.querySelector?e.querySelector(".navbar-burger"):typeof document<"u"?document.querySelector(".navbar-burger"):null,T=D?.dataset?.target??null,U=T?typeof E<"u"&&E&&E.querySelector?E.querySelector(`#${T}`)||document.getElementById(T):e&&e.querySelector?e.querySelector(`#${T}`):typeof document<"u"?document.getElementById(T):null:null;if(D?.classList?.contains("is-active")){try{D.classList.remove("is-active")}catch{}try{D.setAttribute("aria-expanded","false")}catch{}if(U?.classList)try{U.classList.remove("is-active")}catch{}}}catch(D){x("[nimbi-cms] closeMobileMenu failed",D)}}async function ke(){const D=t&&t instanceof HTMLElement?t:typeof document<"u"?document.querySelector(".nimbi-content"):null;try{D&&D.classList.add("is-inactive")}catch{}try{const T=o?.();T&&typeof T.then=="function"&&await T}catch(T){try{x("[nimbi-cms] renderByQuery failed",T)}catch{}}finally{try{if(typeof requestAnimationFrame=="function")requestAnimationFrame(()=>{try{D&&D.classList.remove("is-inactive")}catch{}});else try{D&&D.classList.remove("is-inactive")}catch{}}catch{try{D&&D.classList.remove("is-inactive")}catch{}}}}function Y(D){try{let T=D&&typeof D.slug=="string"?String(D.slug):"",U=null;try{T&&T.indexOf("::")!==-1&&(U=T.split("::").slice(1).join("::")||null)}catch{}try{if(D&&D.path&&typeof D.path=="string"){const L=oe(String(D.path??"")),$=L.replace(/^.*\//,"");try{if(q&&q.has(L))return{page:q.get(L),hash:U};if(q&&q.has($))return{page:q.get($),hash:U}}catch{}try{if(ge?.has?.(L))return{page:ge.get(L),hash:U}}catch{}try{const P=de(L);if(P)return{page:P,hash:U}}catch{}}}catch{}if(T&&T.indexOf("::")!==-1){const L=T.split("::");T=L[0]||"",U=L.slice(1).join("::")||null}if(T&&(T.includes(".")||T.includes("/"))){const L=oe(D&&D.path?String(D.path):T),$=L.replace(/^.*\//,"");try{if(q&&q.has(L))return{page:q.get(L),hash:U};if(q&&q.has($))return{page:q.get($),hash:U}}catch{}try{let P=de(L);if(!P)try{const Z=String(L??"").replace(/^\/+/,""),H=Z.replace(/^.*\//,"");for(const[j,F]of ne.entries())try{let V=null;if(typeof F=="string"?V=oe(String(F??"")):F&&typeof F=="object"&&(F.default?V=oe(String(F.default??"")):V=null),!V)continue;if(V===Z||V.endsWith("/"+Z)||Z.endsWith("/"+V)||V.endsWith(H)||Z.endsWith(H)){P=j;break}}catch{}}catch{}if(P)T=P;else try{const Z=String(T).replace(/\.(?:md|html?)$/i,"");T=be(Z||L)}catch{T=be(L)}}catch{T=be(L)}}return!T&&D&&D.path&&(T=be(oe(String(D.path??"")))),{page:T,hash:U}}catch{return{page:D&&D.slug||"",hash:null}}}const B=()=>g||(g=(async()=>{try{const D=typeof globalThis<"u"?globalThis.buildSearchIndex:void 0,T=typeof globalThis<"u"?globalThis.buildSearchIndexWorker:void 0,U=typeof D=="function"?D:Rn,L=typeof T=="function"?T:km,$=[];try{i&&$.push(i)}catch{}try{navigationPage&&$.push(navigationPage)}catch{}try{for(const P of y||[]){const Z=P?.getAttribute?.("href")||"";/\.(?:md|html?)($|[?#])/i.test(Z)&&$.push(Z.split(/[?#]/)[0])}}catch{}if(l==="lazy"&&typeof L=="function")try{const P=await L(r,c,f,$.length?$:void 0);if(P&&P.length){try{try{Kr(P)}catch{}}catch{}return P}}catch(P){x("[nimbi-cms] worker builder threw",P)}return typeof U=="function"?await U(r,c,f,$.length?$:void 0):[]}catch(D){return x("[nimbi-cms] buildSearchIndex failed",D),g=null,[]}finally{if(d){try{d.removeAttribute("disabled")}catch{}try{_&&_.classList.remove("is-loading"),_&&_.setAttribute("aria-busy","false"),v&&v.setAttribute("aria-busy","false")}catch{}}}})(),g.then(D=>{try{try{W=Array.isArray(D)?D:null}catch{W=null}try{Mm(D)}catch{}try{if(typeof window<"u"){try{(async()=>{try{try{try{Kr(Array.isArray(D)?D:[])}catch{}Object.defineProperty(window,"__nimbiResolvedIndex",{get(){return Array.isArray(le)?le:Array.isArray(W)?W:[]},enumerable:!0,configurable:!0})}catch{try{window.__nimbiResolvedIndex=Array.isArray(le)?le:Array.isArray(W)?W:[]}catch{}}}catch{try{window.__nimbiResolvedIndex=Array.isArray(le)?le:Array.isArray(W)?W:[]}catch{}}})()}catch{}try{window.__nimbi_contentBase=r}catch{}try{window.__nimbi_indexDepth=c}catch{}try{window.__nimbi_noIndexing=f}catch{}}}catch{}const T=String((d&&d.value)??"").trim().toLowerCase();if(!T||!Array.isArray(D)||!D.length)return;const U=D.filter($=>String($.title??"").toLowerCase().includes(T)||String($.excerpt??"").toLowerCase().includes(T));if(!U||!U.length)return;const L=typeof k<"u"&&k?k:typeof document<"u"?document.getElementById("nimbi-search-results"):null;if(!L)return;try{typeof L.replaceChildren=="function"?L.replaceChildren():L.innerHTML=""}catch{try{L.innerHTML=""}catch{}}try{const $=document.createElement("div");$.className="panel nimbi-search-panel",U.slice(0,10).forEach(P=>{try{if(P.parentTitle){const F=document.createElement("p");F.className="panel-heading nimbi-search-title nimbi-search-parent",F.textContent=P.parentTitle,$.appendChild(F)}const Z=document.createElement("a");Z.className="panel-block nimbi-search-result";const H=Y(P);Z.href=qe(H.page,H.hash),Z.setAttribute("role","button");try{if(P.path&&typeof P.path=="string")try{pt(H.page,P.path)}catch{}}catch{}const j=document.createElement("div");j.className="is-size-6 has-text-weight-semibold",j.textContent=P.title,Z.appendChild(j),Z.addEventListener("click",()=>{try{L.classList.add("is-hidden")}catch{}}),$.appendChild(Z)}catch{}});try{L.classList.remove("is-hidden"),L.appendChild($)}catch{}}catch{}}catch{}}).catch(()=>{}).finally(()=>{(async()=>{try{if(z)return;z=!0;try{await mi({homePage:i,contentBase:r,indexDepth:c,noIndexing:f,includeAllMarkdown:!0})}catch(D){x("[nimbi-cms] sitemap trigger failed",D)}}catch(D){try{x("[nimbi-cms] sitemap dynamic import failed",D)}catch{}}})()}),g),E=document.createElement("nav");E.className="navbar",E.setAttribute("role","navigation"),E.setAttribute("aria-label","main navigation");const A=document.createElement("div");A.className="navbar-brand";const C=y[0],M=document.createElement("a");if(M.className="navbar-item",C){const D=C?.getAttribute?.("href")||"#";try{const T=new URL(D,location.href).searchParams.get("page"),U=T?decodeURIComponent(T):i;let L=null;try{typeof U=="string"&&(/(?:\.md|\.html?)$/i.test(U)||U.includes("/"))&&(L=de(U))}catch{}!L&&typeof U=="string"&&!String(U).includes(".")&&(L=U),M.href=qe(L||U),(!M.textContent||!String(M.textContent).trim())&&(M.textContent=a("home"))}catch{try{const U=typeof i=="string"&&(/(?:\.md|\.html?)$/i.test(i)||i.includes("/"))?de(i):typeof i=="string"&&!i.includes(".")?i:null;M.href=qe(U||i)}catch{M.href=qe(i)}M.textContent=a("home")}}else M.href=qe(i),M.textContent=a("home");async function se(D){try{if(!D||D==="none")return null;if(D==="favicon")try{const T=document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');if(!T)return null;const U=T?.getAttribute?.("href")||"";return U&&/\.png(?:\?|$)/i.test(U)?new URL(U,location.href).toString():null}catch{return null}if(D==="copy-first"||D==="move-first")try{const T=await Ke(i,r);if(!T||!T.raw)return null;const U=ot(),L=U?U.parseFromString(T.raw,"text/html"):null,$=L?L.querySelector("img"):null;if(!$)return null;const P=$?.getAttribute?.("src")||"";if(!P)return null;const Z=new URL(P,location.href).toString();if(D==="move-first")try{document.documentElement.setAttribute("data-nimbi-logo-moved",Z)}catch{}return Z}catch{return null}try{return new URL(D,location.href).toString()}catch{return null}}catch{return null}}let K=null;try{K=await se(u)}catch{K=null}if(K)try{const D=document.createElement("img");D.className="nimbi-navbar-logo";const T=a&&typeof a=="function"&&(a("home")||a("siteLogo"))||"";D.alt=T,D.title=T,D.src=K;try{(!M.textContent||!String(M.textContent).trim())&&(M.textContent=T)}catch{}try{M.insertBefore(D,M.firstChild)}catch{try{M.appendChild(D)}catch{}}}catch{}A.appendChild(M),M.addEventListener("click",function(D){const T=M.getAttribute("href")||"";if(T.startsWith("?page=")){D.preventDefault();const U=new URL(T,location.href),L=U.searchParams.get("page"),$=U.hash?U.hash.replace(/^#/,""):null;history.pushState({page:L},"",qe(L,$)),ke();try{G()}catch{}}});function de(D){try{if(!D)return null;const T=oe(String(D??""));try{if(ge?.has?.(T))return ge.get(T)}catch{}const U=T.replace(/^.*\//,"");try{if(ge?.has?.(U))return ge.get(U)}catch{}try{for(const[L,$]of ne.entries())if($){if(typeof $=="string"){if(oe($)===T)return L}else if($&&typeof $=="object"){if($.default&&oe($.default)===T)return L;const P=$.langs||{};for(const Z in P)if(P[Z]&&oe(P[Z])===T)return L}}}catch{}return null}catch{return null}}async function ye(D,T){try{if(!D||!D.length)return;const U=[];for(let H=0;H<D.length;H++)try{const j=D[H];if(!j||typeof j.getAttribute!="function")continue;const F=j.getAttribute("href")||"";if(!F||ia(F))continue;let V=null;try{const we=dt(F);we&&we.page&&(V=we.page)}catch{}if(!V){const we=String(F??"").split(/[?#]/,1),Oe=we&&we[0]?we[0]:F;(/\.(?:md|html?)$/i.test(Oe)||Oe.indexOf("/")!==-1)&&(V=oe(String(Oe??"")))}if(!V)continue;try{if(T&&typeof T=="string")try{let we=new URL(T,typeof location<"u"?location.origin:"http://localhost").pathname||"";if(we=we.replace(/^\/+|\/+$/g,""),we){let Oe=String(V??"");Oe=Oe.replace(/^\/+/,""),Oe===we?V="":Oe.startsWith(we+"/")?V=Oe.slice(we.length+1):V=Oe}}catch{}}catch{}const ie=oe(String(V??"")),pe=ie.replace(/^.*\//,"");let Te=null;try{q&&q.has(ie)&&(Te=q.get(ie))}catch{}try{!Te&&ge?.has?.(ie)&&(Te=ge.get(ie))}catch{}if(Te)continue;let Le=null;try{Le=j.textContent&&String(j.textContent).trim()?String(j.textContent).trim():null}catch{Le=null}let Ee=null;if(Le)Ee=be(Le);else{const we=pe.replace(/\.(?:md|html?)$/i,"");Ee=be(we||ie)}if(Ee)try{U.push({path:ie,candidate:Ee})}catch{}}catch{}if(!U.length)return;const L=3;let $=0;const P=async()=>{for(;$<U.length;){const H=U[$++];if(!(!H||!H.path))try{const j=await Ke(H.path,T);if(!j||!j.raw)continue;let F=null;if(j.isHtml)try{const V=ot(),ie=V?V.parseFromString(j.raw,"text/html"):null,pe=ie?ie.querySelector("h1")||ie.querySelector("title"):null;pe&&pe.textContent&&(F=String(pe.textContent).trim())}catch{}else try{const V=j.raw.match(/^#\s+(.+)$/m);V&&V[1]&&(F=String(V[1]).trim())}catch{}if(F){const V=be(F);if(V&&V!==H.candidate){try{pt(V,H.path)}catch{}try{q.set(H.path,V)}catch{}try{q.set(H.path.replace(/^.*\//,""),V)}catch{}try{try{if(Array.isArray(le)){let ie=!1;for(const pe of le)try{if(pe&&pe.path===H.path&&pe.slug){const Te=String(pe.slug).split("::").slice(1).join("::");pe.slug=Te?`${V}::${Te}`:V,ie=!0}}catch{}try{ie&&Kr(le)}catch{}}}catch{}}catch{}}}}catch{}}},Z=[];for(let H=0;H<L;H++)Z.push(P());try{await Promise.all(Z)}catch{}}catch{}}const Q=document.createElement("button");Q.className="navbar-burger",Q.type="button",Q.setAttribute("aria-label","menu"),Q.setAttribute("aria-expanded","false");const Be="nimbi-navbar-menu";Q.setAttribute("aria-controls",Be),Q.dataset.target=Be,Q.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>',A.appendChild(Q);try{Q.addEventListener("click",D=>{try{const T=Q.dataset&&Q.dataset.target?Q.dataset.target:null,U=T?E&&E.querySelector?E.querySelector(`#${T}`)||(e&&e.querySelector?e.querySelector(`#${T}`):document.getElementById(T)):e&&e.querySelector?e.querySelector(`#${T}`)||document.getElementById(T):typeof document<"u"?document.getElementById(T):null:null;Q.classList.contains("is-active")?(Q.classList.remove("is-active"),Q.setAttribute("aria-expanded","false"),U&&U.classList.remove("is-active")):(Q.classList.add("is-active"),Q.setAttribute("aria-expanded","true"),U&&U.classList.add("is-active"))}catch(T){x("[nimbi-cms] navbar burger toggle failed",T)}}),Q.addEventListener("keydown",D=>{D.key==="Escape"&&(G(),Q.focus())})}catch(D){x("[nimbi-cms] burger event binding failed",D)}const Fe=document.createElement("div");Fe.className="navbar-menu",Fe.id=Be;const Se=document.createElement("div");Se.className="navbar-start";let Ve=null,De=null;if(!s)Ve=null,d=null,w=null,k=null,v=null;else{Ve=document.createElement("div"),Ve.className="navbar-end",De=document.createElement("div"),De.className="navbar-item",d=document.createElement("input"),d.className="input",d.type="search",d.placeholder=a("searchPlaceholder")||"",d.id="nimbi-search";try{const L=(a&&typeof a=="function"?a("searchAria"):null)||d.placeholder||"Search";try{d.setAttribute("aria-label",L)}catch{}try{d.setAttribute("aria-controls","nimbi-search-results")}catch{}try{d.setAttribute("aria-autocomplete","list")}catch{}try{d.setAttribute("aria-expanded","false")}catch{}try{d.setAttribute("role","combobox")}catch{}}catch{}l==="eager"&&(d.disabled=!0),_=document.createElement("div"),_.className="control",l==="eager"&&(_.classList.add("is-loading"),_.setAttribute("aria-busy","true")),_.setAttribute("aria-live","polite"),_.appendChild(d),De.appendChild(_),w=document.createElement("div"),w.className="dropdown is-right",w.id="nimbi-search-dropdown";const D=document.createElement("div");D.className="dropdown-trigger",D.appendChild(De);const T=document.createElement("div");T.className="dropdown-menu",T.setAttribute("role","menu"),k=document.createElement("div"),k.id="nimbi-search-results",k.className="dropdown-content nimbi-search-results",k.setAttribute("role","listbox"),k.setAttribute("aria-hidden","true"),k.setAttribute("aria-live","polite"),k.setAttribute("aria-relevant","all"),k.setAttribute("aria-busy",l==="eager"?"true":"false"),v=k,T.appendChild(k),w.appendChild(D),w.appendChild(T),Ve.appendChild(w);const U=L=>{if(!k)return;try{if(typeof k.replaceChildren=="function")k.replaceChildren();else for(;k.firstChild;)k.removeChild(k.firstChild)}catch{try{k.innerHTML=""}catch{}}let $=-1;function P(j){try{const F=k.querySelector(".nimbi-search-result.is-selected");F&&(F.classList.remove("is-selected"),F.setAttribute("aria-selected","false"));const V=k.querySelectorAll(".nimbi-search-result");if(!V||!V.length){$=-1;try{d&&d.removeAttribute("aria-activedescendant")}catch{}return}if(j<0){$=-1;try{d&&d.removeAttribute("aria-activedescendant")}catch{}return}j>=V.length&&(j=V.length-1);const ie=V[j];if(ie){ie.classList.add("is-selected"),ie.setAttribute("aria-selected","true"),$=j;try{ie.scrollIntoView({block:"nearest"})}catch{}try{d&&ie.id&&d.setAttribute("aria-activedescendant",ie.id)}catch{}}}catch{}}function Z(j){try{const F=j.key,V=k.querySelectorAll(".nimbi-search-result");if(!V||!V.length)return;if(F==="ArrowDown"){j.preventDefault(),P($<0?0:Math.min(V.length-1,$+1));return}if(F==="ArrowUp"){j.preventDefault(),P($<=0?0:$-1);return}if(F==="Enter"){j.preventDefault();const ie=k.querySelector(".nimbi-search-result.is-selected")||k.querySelector(".nimbi-search-result");if(ie)try{ie.click()}catch{}return}if(F==="Escape"){try{w.classList.remove("is-active");try{d.setAttribute("aria-expanded","false")}catch{}}catch{}try{document.documentElement.classList.remove("nimbi-search-open")}catch{}try{k.classList.add("is-hidden")}catch{}try{k.classList.remove("is-open")}catch{}try{k.removeAttribute("tabindex")}catch{}try{k.removeEventListener("keydown",Z)}catch{}try{d&&d.focus()}catch{}try{d&&d.removeEventListener("keydown",H)}catch{}return}}catch{}}function H(j){try{if(j&&j.key==="ArrowDown"){j.preventDefault();try{k.focus()}catch{}P(0)}}catch{}}try{const j=String((d&&d.value)??"").trim();if(!L||!L.length){if(!j){try{w&&w.classList.remove("is-active")}catch{}try{document.documentElement.classList.remove("nimbi-search-open")}catch{}try{k&&(k.classList.add("is-hidden"),k.classList.remove("is-open"),k.removeAttribute("tabindex"))}catch{}try{k&&k.removeEventListener("keydown",Z)}catch{}return}try{const F=document.createElement("div");F.className="panel nimbi-search-panel";const V=document.createElement("p");V.className="panel-block nimbi-search-no-results",V.textContent=a&&typeof a=="function"?a("searchNoResults"):"No results",F.appendChild(V),k.appendChild(F)}catch{}if(w){w.classList.add("is-active");try{d.setAttribute("aria-expanded","true")}catch{}try{document.documentElement.classList.add("nimbi-search-open")}catch{}}try{k.classList.remove("is-hidden")}catch{}try{k.classList.add("is-open")}catch{}try{k.setAttribute("aria-hidden","false")}catch{}try{k.setAttribute("tabindex","0")}catch{}return}}catch{}try{const j=document.createElement("div");j.className="panel nimbi-search-panel";const F=document.createDocumentFragment();L.forEach((V,ie)=>{if(V.parentTitle){const Ee=document.createElement("p");Ee.textContent=V.parentTitle,Ee.className="panel-heading nimbi-search-title nimbi-search-parent",F.appendChild(Ee)}const pe=document.createElement("a");pe.className="panel-block nimbi-search-result",pe.id=`nimbi-search-result-${ie}`,pe.setAttribute("role","option"),pe.setAttribute("aria-selected","false");const Te=Y(V);pe.href=qe(Te.page,Te.hash);try{if(V.path&&typeof V.path=="string")try{pt(Te.page,V.path)}catch{}}catch{}const Le=document.createElement("div");Le.className="is-size-6 has-text-weight-semibold",Le.textContent=V.title,pe.appendChild(Le),pe.addEventListener("click",Ee=>{try{try{Ee&&Ee.preventDefault&&Ee.preventDefault()}catch{}try{Ee&&Ee.stopPropagation&&Ee.stopPropagation()}catch{}if(w){w.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-search-open")}catch{}}try{k.classList.add("is-hidden");try{k.setAttribute("aria-hidden","true")}catch{}}catch{}try{k.classList.remove("is-open")}catch{}try{k.removeAttribute("tabindex")}catch{}try{k.removeEventListener("keydown",Z)}catch{}try{d&&d.removeEventListener("keydown",H)}catch{}try{const we=pe.getAttribute&&pe.getAttribute("href")||"";let Oe=null,gt=null;try{const et=new URL(we,location.href);Oe=et.searchParams.get("page"),gt=et.hash?et.hash.replace(/^#/,""):null}catch{}if(Oe)try{history.pushState({page:Oe},"",qe(Oe,gt));try{ke()}catch{try{typeof window<"u"&&typeof window.renderByQuery=="function"&&window.renderByQuery()}catch{}}return}catch{}}catch{}try{window.location.href=pe.href}catch{}}catch{}}),F.appendChild(pe)}),j.appendChild(F),k.appendChild(j)}catch{}if(w){w.classList.add("is-active");try{document.documentElement.classList.add("nimbi-search-open")}catch{}}try{k.classList.remove("is-hidden")}catch{}try{k.classList.add("is-open")}catch{}try{k.setAttribute("tabindex","0")}catch{}try{k.addEventListener("keydown",Z)}catch{}try{d&&d.addEventListener("keydown",H)}catch{}};if(d){const L=qp(async()=>{const $=++N,P=d||(typeof E<"u"&&E&&E.querySelector?E.querySelector("input#nimbi-search"):e&&e.querySelector?e.querySelector("input#nimbi-search"):typeof document<"u"?document.querySelector("input#nimbi-search"):null),Z=String((P&&P.value)??"").trim().toLowerCase();if(!Z){try{w&&w.classList.remove("is-active")}catch{}try{document.documentElement.classList.remove("nimbi-search-open")}catch{}try{k&&(k.classList.add("is-hidden"),k.classList.remove("is-open"),k.removeAttribute("tabindex"))}catch{}return}try{let H=window.__nimbiResolvedIndex;if(!Array.isArray(H)||!H.length){if(await B(),$!==N)return;H=await g}if($!==N)return;const j=[H,window.__nimbiSearchIndex,window.__nimbiResolvedIndex,window.__nimbiLiveSearchIndex].filter(V=>Array.isArray(V)&&(!Array.isArray(H)||V.length>H.length));j.length&&(H=j.reduce((V,ie)=>ie.length>V.length?ie:V));let F=Array.isArray(H)?H.filter(V=>String(V.title??"").toLowerCase().includes(Z)||String(V.excerpt??"").toLowerCase().includes(Z)):[];if(!F.length)for(const V of[window.__nimbiSearchIndex,window.__nimbiResolvedIndex,window.__nimbiLiveSearchIndex]){if(!Array.isArray(V))continue;const ie=V.filter(pe=>String(pe.title??"").toLowerCase().includes(Z)||String(pe.excerpt??"").toLowerCase().includes(Z));if(ie.length){F=ie;break}}F.sort((V,ie)=>{const pe=Te=>{const Le=String(Te.title??"").toLowerCase(),Ee=String(Te.excerpt??"").toLowerCase();return Le===Z?0:Le.startsWith(Z)?1:Le.split(/\s+/).some(we=>we.startsWith(Z))?2:Le.includes(Z)?3:Ee.includes(Z)?4:5};return pe(V)-pe(ie)}),U(F.slice(0,10))}catch(H){g=null,x("[nimbi-cms] search input handler failed",H),U([])}},50);try{d.addEventListener("input",L),h?.addEventListener("abort",L.cancel,{once:!0})}catch{}}if(l==="eager"){try{g=B()}catch(L){x("[nimbi-cms] eager search index init failed",L),g=Promise.resolve([])}g.finally(()=>{const L=d||(typeof E<"u"&&E&&E.querySelector?E.querySelector("input#nimbi-search"):e&&e.querySelector?e.querySelector("input#nimbi-search"):typeof document<"u"?document.querySelector("input#nimbi-search"):null);if(L){try{L.removeAttribute("disabled")}catch{}try{_&&_.classList.remove("is-loading")}catch{}}(async()=>{try{if(z)return;z=!0;const $=await g.catch(()=>[]);try{await mi({index:Array.isArray($)?$:void 0,homePage:i,contentBase:r,indexDepth:c,noIndexing:f,includeAllMarkdown:!0})}catch(P){x("[nimbi-cms] sitemap trigger failed",P)}}catch($){try{x("[nimbi-cms] sitemap dynamic import failed",$)}catch{}}})()})}try{I=L=>{try{const $=L&&L.target;if(!v||!v.classList.contains("is-open")&&v.style&&!v.classList.contains("is-hidden")||$&&(v.contains($)||d&&($===d||d.contains&&d.contains($))))return;if(w){w.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-search-open")}catch{}}try{v.classList.add("is-hidden")}catch{}try{v.classList.remove("is-open")}catch{}}catch{}},ae(document,"click",I,!0),ae(document,"touchstart",I,!0)}catch{}}const Je=document.createDocumentFragment();for(let D=0;D<y.length;D++){const T=y[D];if(D===0)continue;const U=T.getAttribute("href")||"#";let L=U;const $=document.createElement("a");$.className="navbar-item";try{let P=null;try{P=dt(String(U??""))}catch{P=null}let Z=null,H=null;if(P&&(P.type==="canonical"&&P.page||P.type==="cosmetic"&&P.page)&&(Z=P.page,H=P.anchor),Z&&(/\.(?:md|html?)$/i.test(Z)||Z.includes("/")?L=Z:$.href=qe(Z,H)),/^[^#]*\.md(?:$|[#?])/.test(L)||L.endsWith(".md")){const j=oe(L).split(/::|#/,2),F=j[0],V=j[1],ie=de(F);ie?$.href=qe(ie,V):$.href=qe(F,V)}else if(/\.html(?:$|[#?])/.test(L)||L.endsWith(".html")){const j=oe(L).split(/::|#/,2);let F=j[0];F&&!F.toLowerCase().endsWith(".html")&&(F=F+".html");const V=j[1],ie=de(F);if(ie)$.href=qe(ie,V);else try{const pe=await Ke(F,r);if(pe&&pe.raw)try{const Te=ot(),Le=Te?Te.parseFromString(pe.raw,"text/html"):null,Ee=Le?Le.querySelector("title"):null,we=Le?Le.querySelector("h1"):null,Oe=Ee&&Ee.textContent&&Ee.textContent.trim()?Ee.textContent.trim():we&&we.textContent?we.textContent.trim():null;if(Oe){const gt=be(Oe);if(gt){try{pt(gt,F)}catch(et){x("[nimbi-cms] slugToMd/mdToSlug set failed",et)}$.href=qe(gt,V)}else $.href=qe(F,V)}else $.href=qe(F,V)}catch{$.href=qe(F,V)}else $.href=L}catch{$.href=L}}else $.href=L}catch(P){x("[nimbi-cms] nav item href parse failed",P),$.href=L}try{const P=T.textContent&&String(T.textContent).trim()?String(T.textContent).trim():null;if(P)try{const Z=be(P);if(Z){const H=$.getAttribute("href")||"";let j=null;if(/^[^#?]*\.(?:md|html?)(?:$|[?#])/i.test(H))j=oe(String(H??"").split(/[?#]/)[0]);else try{const F=dt(H);F&&F.type==="canonical"&&F.page&&(j=oe(F.page))}catch{}if(j){let F=!1;try{if(/\.(?:html?)(?:$|[?#])/i.test(String(j??"")))F=!0;else if(/\.(?:md)(?:$|[?#])/i.test(String(j??"")))F=!1;else{const V=String(j??"").replace(/^\.\//,""),ie=V.replace(/^.*\//,"");Xe&&Xe.size&&(Xe.has(V)||Xe.has(ie))&&(F=!0)}}catch{F=!1}if(F)try{const V=oe(String(j??"").split(/[?#]/)[0]);let ie=!1;try{de&&typeof de=="function"&&de(V)&&(ie=!0)}catch{}try{pt(Z,j)}catch{}try{if(V){try{q.set(V,Z)}catch{}try{const pe=V.replace(/^.*\//,"");pe&&q.set(pe,Z)}catch{}}}catch{}if(ie)try{$.href=qe(Z)}catch{}}catch{}}}}catch(Z){x("[nimbi-cms] nav slug mapping failed",Z)}}catch(P){x("[nimbi-cms] nav slug mapping failed",P)}$.textContent=T.textContent||L,Je.appendChild($)}try{Se.appendChild(Je)}catch{}Fe.appendChild(Se),Ve&&Fe.appendChild(Ve),E.appendChild(A),E.appendChild(Fe),e.appendChild(E);try{const D=T=>{try{const U=typeof E<"u"&&E&&E.querySelector?E.querySelector(".navbar-burger"):e&&e.querySelector?e.querySelector(".navbar-burger"):typeof document<"u"?document.querySelector(".navbar-burger"):null;if(!U||!U.classList.contains("is-active"))return;const L=U&&U.closest?U.closest(".navbar"):E;if(L&&L.contains(T.target))return;G()}catch{}};ae(document,"click",D,!0),ae(document,"touchstart",D,!0)}catch{}try{Fe.addEventListener("click",D=>{const T=D.target&&D.target.closest?D.target.closest("a"):null;if(!T)return;const U=T.getAttribute("href")||"";try{const L=new URL(U,location.href),$=L.searchParams.get("page"),P=L.hash?L.hash.replace(/^#/,""):null;$&&(D.preventDefault(),history.pushState({page:$},"",qe($,P)),ke())}catch(L){x("[nimbi-cms] navbar click handler failed",L)}try{const L=typeof E<"u"&&E&&E.querySelector?E.querySelector(".navbar-burger"):e&&e.querySelector?e.querySelector(".navbar-burger"):null,$=L&&L.dataset?L.dataset.target:null,P=$?E&&E.querySelector?E.querySelector(`#${$}`)||(e&&e.querySelector?e.querySelector(`#${$}`):document.getElementById($)):e&&e.querySelector?e.querySelector(`#${$}`)||document.getElementById($):typeof document<"u"?document.getElementById($):null:null;L&&L.classList.contains("is-active")&&(L.classList.remove("is-active"),L.setAttribute("aria-expanded","false"),P&&P.classList.remove("is-active"))}catch(L){x("[nimbi-cms] mobile menu close failed",L)}})}catch(D){x("[nimbi-cms] attach content click handler failed",D)}try{t.addEventListener("click",D=>{const T=D.target&&D.target.closest?D.target.closest("a"):null;if(!T)return;const U=T.getAttribute("href")||"";if(U&&!ia(U))try{const L=new URL(U,location.href),$=L.searchParams.get("page"),P=L.hash?L.hash.replace(/^#/,""):null;$&&(D.preventDefault(),history.pushState({page:$},"",qe($,P)),ke())}catch(L){x("[nimbi-cms] container click URL parse failed",L)}})}catch(D){x("[nimbi-cms] build navbar failed",D)}return{navbar:E,linkEls:y,manifest:typeof window<"u"?window.__nimbiRuntimeManifest??null:null}}try{document.addEventListener("input",e=>{try{if(e&&e.target&&e.target.id==="nimbi-search"){const t=document.getElementById("nimbi-search-results");if(t&&e.target&&e.target.value)try{t.classList.remove("is-hidden")}catch{}}}catch{}},!0)}catch{}var ct=null,Ae=null,ut=1,en=(e,t)=>t,ii=0,ai=0,ta=()=>{},Hr=.25;function Rm(){if(ct&&document.contains(ct))return ct;ct=null;const e=document.createElement("dialog");e.className="nimbi-image-preview modal",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-label",en("imagePreviewTitle","Image preview"));try{const E=document.createElement("div");E.className="modal-background";const A=document.createElement("div");A.className="modal-content";const C=document.createElement("div");C.className="nimbi-image-preview__content box",C.setAttribute("role","document");const M=document.createElement("button");M.className="button is-small nimbi-image-preview__close",M.type="button",M.setAttribute("data-nimbi-preview-close",""),M.textContent="✕",M.setAttribute("aria-hidden","true");const se=document.createElement("div");se.className="nimbi-image-preview__image-wrapper";const K=document.createElement("img");K.setAttribute("data-nimbi-preview-image",""),K.alt="",se.appendChild(K);const de=document.createElement("div");de.className="nimbi-image-preview__controls";const ye=document.createElement("div");ye.className="nimbi-image-preview__group";const Q=document.createElement("button");Q.className="button is-small",Q.type="button",Q.setAttribute("data-nimbi-preview-fit",""),Q.textContent="⤢",Q.setAttribute("aria-hidden","true");const Be=document.createElement("button");Be.className="button is-small",Be.type="button",Be.setAttribute("data-nimbi-preview-original",""),Be.textContent="1:1",Be.setAttribute("aria-hidden","true");const Fe=document.createElement("button");Fe.className="button is-small",Fe.type="button",Fe.setAttribute("data-nimbi-preview-reset",""),Fe.textContent="⟲",Fe.setAttribute("aria-hidden","true"),ye.appendChild(Q),ye.appendChild(Be),ye.appendChild(Fe);const Se=document.createElement("div");Se.className="nimbi-image-preview__group";const Ve=document.createElement("button");Ve.className="button is-small",Ve.type="button",Ve.setAttribute("data-nimbi-preview-zoom-out",""),Ve.textContent="−",Ve.setAttribute("aria-hidden","true");const De=document.createElement("div");De.className="nimbi-image-preview__zoom",De.setAttribute("data-nimbi-preview-zoom-label",""),De.textContent="100%";const Je=document.createElement("button");Je.className="button is-small",Je.type="button",Je.setAttribute("data-nimbi-preview-zoom-in",""),Je.textContent="＋",Je.setAttribute("aria-hidden","true"),Se.appendChild(Ve),Se.appendChild(De),Se.appendChild(Je),de.appendChild(ye),de.appendChild(Se),C.appendChild(M),C.appendChild(se),C.appendChild(de),A.appendChild(C),e.appendChild(E),e.appendChild(A)}catch{e.innerHTML=`
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
    `}e.addEventListener("click",E=>{E.target===e&&hs()}),e.addEventListener("wheel",E=>{if(!q())return;E.preventDefault();const A=E.deltaY<0?Hr:-Hr;dn(ut+A),c(),f()},{passive:!1}),e.addEventListener("keydown",E=>{if(E.key==="Escape"){hs();return}if(ut>1){const A=e.querySelector(".nimbi-image-preview__image-wrapper");if(!A)return;const C=40;switch(E.key){case"ArrowUp":A.scrollTop-=C,E.preventDefault();break;case"ArrowDown":A.scrollTop+=C,E.preventDefault();break;case"ArrowLeft":A.scrollLeft-=C,E.preventDefault();break;case"ArrowRight":A.scrollLeft+=C,E.preventDefault()}}}),document.body.appendChild(e),ct=e,Ae=e.querySelector("[data-nimbi-preview-image]");const t=e.querySelector("[data-nimbi-preview-fit]"),n=e.querySelector("[data-nimbi-preview-original]"),r=e.querySelector("[data-nimbi-preview-zoom-in]"),i=e.querySelector("[data-nimbi-preview-zoom-out]"),a=e.querySelector("[data-nimbi-preview-reset]"),o=e.querySelector("[data-nimbi-preview-close]"),s=e.querySelector("[data-nimbi-preview-zoom-label]"),l=e.querySelector("[data-nimbi-preview-zoom-hud]");function c(){s&&(s.textContent=`${Math.round(ut*100)}%`)}const f=()=>{l&&(l.textContent=`${Math.round(ut*100)}%`,l.classList.add("visible"),clearTimeout(l._timeout),l._timeout=setTimeout(()=>l.classList.remove("visible"),800))};ta=c,r.addEventListener("click",()=>{dn(ut+Hr),c(),f()}),i.addEventListener("click",()=>{dn(ut-Hr),c(),f()}),t.addEventListener("click",()=>{si(),c(),f()}),n.addEventListener("click",()=>{dn(1),c(),f()}),a.addEventListener("click",()=>{si(),c(),f()}),o.addEventListener("click",hs),t.title=en("imagePreviewFit","Fit to screen"),n.title=en("imagePreviewOriginal","Original size"),i.title=en("imagePreviewZoomOut","Zoom out"),r.title=en("imagePreviewZoomIn","Zoom in"),o.title=en("imagePreviewClose","Close"),o.setAttribute("aria-label",en("imagePreviewClose","Close"));let u=!1,h=0,p=0,m=0,y=0;const g=new Map;let d=0,_=1;const w=(E,A)=>{const C=E.x-A.x,M=E.y-A.y;return Math.hypot(C,M)},k=()=>{u=!1,g.clear(),d=0,Ae&&(Ae.classList.add("is-panning"),Ae.classList.remove("is-grabbing"))};let v=0,I=0,N=0;const z=E=>{const A=Date.now(),C=A-v,M=E.clientX-I,se=E.clientY-N;v=A,I=E.clientX,N=E.clientY,C<300&&Math.hypot(M,se)<30&&(dn(ut>1?1:2),c(),E.preventDefault())},W=E=>{dn(ut>1?1:2),c(),E.preventDefault()},q=()=>ct?typeof ct.open=="boolean"?ct.open:ct.classList.contains("is-active"):!1,ae=(E,A,C=1)=>{if(g.has(C)&&g.set(C,{x:E,y:A}),g.size===2){const de=Array.from(g.values()),ye=w(de[0],de[1]);if(d>0){const Q=ye/d;dn(_*Q)}return}if(!u)return;const M=Ae.closest(".nimbi-image-preview__image-wrapper");if(!M)return;const se=E-h,K=A-p;M.scrollLeft=m-se,M.scrollTop=y-K},G=(E,A,C=1)=>{if(!q())return;if(g.set(C,{x:E,y:A}),g.size===2){const se=Array.from(g.values());d=w(se[0],se[1]),_=ut;return}const M=Ae.closest(".nimbi-image-preview__image-wrapper");M&&(M.scrollWidth>M.clientWidth||M.scrollHeight>M.clientHeight)&&(u=!0,h=E,p=A,m=M.scrollLeft,y=M.scrollTop,Ae.classList.add("is-panning"),Ae.classList.remove("is-grabbing"),window.addEventListener("pointermove",ke),window.addEventListener("pointerup",Y),window.addEventListener("pointercancel",Y))},ke=E=>{u&&(E.preventDefault(),ae(E.clientX,E.clientY,E.pointerId))},Y=()=>{k(),window.removeEventListener("pointermove",ke),window.removeEventListener("pointerup",Y),window.removeEventListener("pointercancel",Y)};Ae.addEventListener("pointerdown",E=>{E.preventDefault(),G(E.clientX,E.clientY,E.pointerId)}),Ae.addEventListener("pointermove",E=>{(u||g.size===2)&&E.preventDefault(),ae(E.clientX,E.clientY,E.pointerId)}),Ae.addEventListener("pointerup",E=>{E.preventDefault(),E.pointerType==="touch"&&z(E),k()}),Ae.addEventListener("dblclick",W),Ae.addEventListener("pointercancel",k),Ae.addEventListener("mousedown",E=>{E.preventDefault(),G(E.clientX,E.clientY,1)}),Ae.addEventListener("mousemove",E=>{u&&E.preventDefault(),ae(E.clientX,E.clientY,1)}),Ae.addEventListener("mouseup",E=>{E.preventDefault(),k()});const B=e.querySelector(".nimbi-image-preview__image-wrapper");return B&&(B.addEventListener("pointerdown",E=>{if(G(E.clientX,E.clientY,E.pointerId),E?.target?.tagName==="IMG")try{E.target.classList.add("is-grabbing")}catch{}}),B.addEventListener("pointermove",E=>{ae(E.clientX,E.clientY,E.pointerId)}),B.addEventListener("pointerup",k),B.addEventListener("pointercancel",k),B.addEventListener("mousedown",E=>{if(G(E.clientX,E.clientY,1),E?.target?.tagName==="IMG")try{E.target.classList.add("is-grabbing")}catch{}}),B.addEventListener("mousemove",E=>{ae(E.clientX,E.clientY,1)}),B.addEventListener("mouseup",k)),e}function dn(e){if(!Ae)return;const t=Number(e);ut=Number.isFinite(t)?Math.max(.1,Math.min(4,t)):1;const n=Ae.getBoundingClientRect(),r=ii||Ae.naturalWidth||Ae.width||n.width||0,i=ai||Ae.naturalHeight||Ae.height||n.height||0;if(r&&i){Ae.style.setProperty("--nimbi-preview-img-max-width","none"),Ae.style.setProperty("--nimbi-preview-img-max-height","none"),Ae.style.setProperty("--nimbi-preview-img-width",`${r*ut}px`),Ae.style.setProperty("--nimbi-preview-img-height",`${i*ut}px`),Ae.style.setProperty("--nimbi-preview-img-transform","none");try{Ae.style.width=`${r*ut}px`,Ae.style.height=`${i*ut}px`,Ae.style.transform="none"}catch{}}else{Ae.style.setProperty("--nimbi-preview-img-max-width",""),Ae.style.setProperty("--nimbi-preview-img-max-height",""),Ae.style.setProperty("--nimbi-preview-img-width",""),Ae.style.setProperty("--nimbi-preview-img-height",""),Ae.style.setProperty("--nimbi-preview-img-transform",`scale(${ut})`);try{Ae.style.transform=`scale(${ut})`}catch{}}Ae&&(Ae.classList.add("is-panning"),Ae.classList.remove("is-grabbing"))}function si(){if(!Ae)return;const e=Ae.closest(".nimbi-image-preview__image-wrapper");if(!e)return;const t=e.getBoundingClientRect();if(t.width===0||t.height===0)return;const n=ii||Ae.naturalWidth||t.width,r=ai||Ae.naturalHeight||t.height;if(!n||!r)return;const i=t.width/n,a=t.height/r,o=Math.min(i,a,1);dn(Number.isFinite(o)?o:1)}function Pm(e,t="",n=0,r=0){const i=Rm();ut=1,ii=n||0,ai=r||0,Ae.src=e;try{if(!t)try{const o=new URL(e,typeof location<"u"?location.href:"").pathname||"",s=(o.substring(o.lastIndexOf("/")+1)||e).replace(/\.[^/.]+$/,"").replace(/[-_]+/g," ");t=en("imagePreviewDefaultAlt",s||"Image")}catch{t=en("imagePreviewDefaultAlt","Image")}}catch{}Ae.alt=t,Ae.style.transform="scale(1)";const a=()=>{ii=Ae.naturalWidth||Ae.width||0,ai=Ae.naturalHeight||Ae.height||0};if(a(),si(),ta(),requestAnimationFrame(()=>{si(),ta()}),!ii||!ai){const o=()=>{a(),requestAnimationFrame(()=>{si(),ta()}),Ae.removeEventListener("load",o)};Ae.addEventListener("load",o)}typeof i.showModal=="function"&&(i.open||i.showModal()),i.classList.add("is-active");try{document.documentElement.classList.add("nimbi-image-preview-open")}catch{}i.focus();try{const o=i.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');if(o.length){const s=o[0],l=o[o.length-1],c=f=>{try{if(f.key!=="Tab")return;f.shiftKey?document.activeElement===s&&(f.preventDefault(),l.focus()):document.activeElement===l&&(f.preventDefault(),s.focus())}catch{}};i.addEventListener("keydown",c),i._focusTrapHandler=c}}catch{}}function hs(){if(ct){typeof ct.close=="function"&&ct.open&&ct.close(),ct.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-image-preview-open")}catch{}try{ct._focusTrapHandler&&(ct.removeEventListener("keydown",ct._focusTrapHandler),ct._focusTrapHandler=null)}catch{}}}function Lm(e,{t,zoomStep:n=.25}={}){if(!e||!e.querySelectorAll)return;en=(p,m)=>(typeof t=="function"?t(p):void 0)||m,Hr=n,e.addEventListener("click",p=>{const m=p.target;if(!m||m.tagName!=="IMG")return;const y=m;y.src&&(y.closest("a")?.getAttribute?.("href")||Pm(y.src,y.alt||"",y.naturalWidth||0,y.naturalHeight||0))});let r=!1,i=0,a=0,o=0,s=0;const l=new Map;let c=0,f=1;const u=(p,m)=>{const y=p.x-m.x,g=p.y-m.y;return Math.hypot(y,g)};e.addEventListener("pointerdown",p=>{const m=p.target;if(!m||m.tagName!=="IMG")return;const y=m.closest("a");if(y&&y.getAttribute("href")||!ct||!ct.open)return;if(l.set(p.pointerId,{x:p.clientX,y:p.clientY}),l.size===2){const d=Array.from(l.values());c=u(d[0],d[1]),f=ut;return}const g=m.closest(".nimbi-image-preview__image-wrapper");if(g&&!(ut<=1)){p.preventDefault(),r=!0,i=p.clientX,a=p.clientY,o=g.scrollLeft,s=g.scrollTop,m.setPointerCapture(p.pointerId);try{m.classList.add("is-grabbing")}catch{}}}),e.addEventListener("pointermove",p=>{if(l.has(p.pointerId)&&l.set(p.pointerId,{x:p.clientX,y:p.clientY}),l.size===2){p.preventDefault();const _=Array.from(l.values()),w=u(_[0],_[1]);if(c>0){const k=w/c;dn(f*k)}return}if(!r)return;p.preventDefault();const m=p.target;if(m?.closest?.("a")?.getAttribute?.("href"))return;const y=m.closest(".nimbi-image-preview__image-wrapper");if(!y)return;const g=p.clientX-i,d=p.clientY-a;y.scrollLeft=o-g,y.scrollTop=s-d});const h=()=>{r=!1,l.clear(),c=0;try{const p=document.querySelector("[data-nimbi-preview-image]");p&&(p.classList.add("is-panning"),p.classList.remove("is-grabbing"))}catch{}};e.addEventListener("pointerup",h),e.addEventListener("pointercancel",h)}function Nm(e){const{contentWrap:t,navWrap:n,container:r,mountOverlay:i=null,t:a,contentBase:o,homePage:s,initialDocumentTitle:l,runHooks:c,allowEmbeddedScripts:f=!1,embeddedScriptOrigins:u=[],signal:h}=e||{};if(!t||!(t instanceof HTMLElement))throw new TypeError("contentWrap must be an HTMLElement");let p=null;const m={},y=Kp(a,[{path:s,name:a("home"),isIndex:!0,children:[]}]),g=new Map,d=12;let _=!1,w=!1,k=[];function v(A){try{if(!A)return;if(typeof A.replaceChildren=="function")return A.replaceChildren();for(;A.firstChild;)A.removeChild(A.firstChild)}catch{try{A&&(A.innerHTML="")}catch{}}}function I(A){try{const C=String(A?.raw||""),M=C.length;return`${M}:${C.slice(0,120)}:${C.slice(Math.max(0,M-120))}`}catch{return"0::"}}function N(A){const C=g.get(A);return C?(g.delete(A),g.set(A,C),C):null}function z(A,C){try{for(g.has(A)&&g.delete(A),g.set(A,C);g.size>d;){const M=g.keys().next().value;g.delete(M)}}catch{}}async function W(A,C,M){const se=M?dt(M):null,K=()=>!se||(()=>{try{const P=dt(location.href);return P?.page===se?.page&&P?.anchor===se?.anchor}catch{return location.href===M}})();let de,ye,Q;try{({data:de,pagePath:ye,anchor:Q}=await ad(A,o))}catch(P){const Z=P?.message?String(P.message):"",H=(!xe||typeof xe!="string"||!xe)&&/no page data/i.test(Z);try{if(H)try{x("[nimbi-cms] fetchPageData (expected missing)",P)}catch{}else try{Gr("[nimbi-cms] fetchPageData failed",P)}catch{}}catch{}try{!xe&&n&&v(n)}catch{}if(!K())return;Hl(t,a,P);return}if(!K())return;!Q&&C&&(Q=C);try{Is(null)}catch(P){x("[nimbi-cms] scrollToAnchorOrTop failed",P)}const Be=`${String(ye??"")}|||${I(de)}`,Fe=N(Be);let Se,Ve,De,Je,D,T;if(Fe?.articleTemplate)Se=Fe.articleTemplate.cloneNode(!0),De=Fe.tocTemplate?Fe.tocTemplate.cloneNode(!0):null,Je=Se.querySelector("h1"),D=Je?(Je.textContent||"").trim():Fe.h1Text||"",T=Fe.slugKey||Je&&Je.id||"",Ve={meta:Object.assign({},Fe.meta||{})};else{if({article:Se,parsed:Ve,toc:De,topH1:Je,h1Text:D,slugKey:T}=await am(a,de,ye,Q,o),!K())return;z(Be,{articleTemplate:Se.cloneNode(!0),tocTemplate:De?De.cloneNode(!0):null,meta:Object.assign({},Ve?.meta||{}),h1Text:D||"",slugKey:T||""})}if(!K())return;try{await c("transformHtml",{article:Se,parsed:Ve,toc:De,pagePath:ye,anchor:Q,topH1:Je,h1Text:D,slugKey:T,data:de})}catch(P){x("[nimbi-cms] transformHtml hooks failed",P)}if(!K())return;const U=document.activeElement,L=U===document.body||t.contains(U)||n.contains(U),$=document.createElement("main");$.className="nimbi-main",$.appendChild(Se),De&&mm(De);try{t.replaceChildren($),n.replaceChildren(...De?[De]:[])}catch{v(t),v(n),t.appendChild($),De&&n.appendChild(De)}try{if(!document.querySelector(".nimbi-skip-link")){const P=document.createElement("a");P.className="nimbi-skip-link",P.href="#main",P.textContent="Skip to content",P.setAttribute("aria-label","Skip to content");const Z=document.querySelector(".nimbi-mount")||document.querySelector(".nimbi-cms")||document.body;Z&&Z.firstChild?Z.insertBefore(P,Z.firstChild):Z&&Z.appendChild(P)}}catch{}try{L&&K()&&($.tabIndex=-1,$.focus({preventScroll:!0}))}catch{}Xf(a,l,Ve,De,Se,ye,Q,Je,D,T,de);try{ic(Se)}catch(P){x("[nimbi-cms] observeCodeBlocks failed",P)}try{sm(Se,f,u)}catch(P){x("[nimbi-cms] executeEmbeddedScripts failed",P)}try{Lm(Se,{t:a})}catch(P){x("[nimbi-cms] attachImagePreview failed",P)}try{Va(r,100,!1),typeof requestAnimationFrame=="function"&&requestAnimationFrame(()=>Va(r,100,!1))}catch(P){x("[nimbi-cms] setEagerForAboveFoldImages failed",P)}Is(Q),gm(Se,Je,{mountOverlay:i,container:r,navWrap:n,t:a});try{await c("onPageLoad",{data:de,pagePath:ye,anchor:Q,article:Se,toc:De,topH1:Je,h1Text:D,slugKey:T,contentWrap:t,navWrap:n})}catch(P){x("[nimbi-cms] onPageLoad hooks failed",P)}p=ye}async function q(){const A=typeof performance<"u"&&typeof performance.now=="function"?performance.now():null;if(_)return w=!0,new Promise(C=>{k.push(C)});_=!0;try{try{yr("renderByQuery")}catch{}let C=dt(location.href);try{if(C?.type==="path"&&C?.page&&o)try{const K=typeof o=="string"?new URL(o,location.href).pathname:"",de=String(K??"").replace(/^\/+|\/+$/g,""),ye=String(C.page??"").replace(/^\/+|\/+$/g,"");de&&ye===de&&(C.page=null)}catch{}}catch{}if(C?.type==="path"&&C?.page)try{let K="?page="+encodeURIComponent(C.page||"");C.params&&(K+=(K.includes("?")?"&":"?")+C.params),C.anchor&&(K+="#"+encodeURIComponent(C.anchor));try{history.replaceState(history.state,"",K)}catch{try{history.replaceState({},"",K)}catch{}}C=dt(location.href)}catch{}const M=C?.page?C.page:s,se=C?.anchor?C.anchor:null;if(typeof document.startViewTransition=="function")try{await document.startViewTransition(async()=>{await W(M,se,location.href)}).finished}catch{}else await W(M,se,location.href)}catch(C){x("[nimbi-cms] renderByQuery failed",C);try{!xe&&n&&v(n)}catch{}Hl(t,a,C)}finally{if(A!==null)try{const M=performance.now()-A;typeof window<"u"&&window.__nimbiRenderTimings&&(window.__nimbiRenderTimings.push(M),window.__nimbiRenderTimings.length>50&&window.__nimbiRenderTimings.splice(0,window.__nimbiRenderTimings.length-50))}catch{}if(_=!1,w){w=!1;try{await q()}catch{}}const C=k;k=[];for(const M of C)M()}}const ae=(A,C,M,se)=>{h?A.addEventListener(C,M,{...se,signal:h}):A.addEventListener(C,M,se)};ae(window,"popstate",q),ae(window,"hashchange",q);const G=A=>{try{document.documentElement.dataset.nimbiConnection=A?"online":"offline",document.dispatchEvent(new CustomEvent("nimbi.connectionchange",{detail:{online:A}}))}catch(C){x("[nimbi-cms] connection state update failed",C)}};G(typeof navigator>"u"||navigator.onLine!==!1),ae(window,"online",()=>G(!0)),ae(window,"offline",()=>G(!1));const ke=()=>{try{const A=document.visibilityState==="hidden"?"hidden":"visible";document.documentElement.dataset.nimbiVisibility=A,document.dispatchEvent(new CustomEvent("nimbi.visibilitychange",{detail:{state:A,hidden:A==="hidden"}}))}catch(A){x("[nimbi-cms] visibility state update failed",A)}};ke(),ae(document,"visibilitychange",ke);const Y=()=>`nimbi-cms-scroll:${location.pathname}${location.search}`,B=()=>{try{const A=r||document.querySelector(".nimbi-cms");if(!A)return;const C={top:A.scrollTop||0,left:A.scrollLeft||0};sessionStorage.setItem(Y(),JSON.stringify(C))}catch(A){if(A&&A.name==="QuotaExceededError"){try{m[Y()]={top:(r||document.querySelector(".nimbi-cms"))?.scrollTop||0,left:(r||document.querySelector(".nimbi-cms"))?.scrollLeft||0}}catch{}return}x("[nimbi-cms] save scroll position failed",A)}},E=()=>{try{const A=r||document.querySelector(".nimbi-cms");if(!A)return;let C=null;try{const M=sessionStorage.getItem(Y());M&&(C=JSON.parse(M))}catch{}!C&&m[Y()]&&(C=m[Y()]),C&&typeof C?.top=="number"&&A.scrollTo({top:C.top,left:C.left||0,behavior:"auto"})}catch{}};return ae(window,"pageshow",A=>{if(A.persisted)try{E(),Va(r,100,!1)}catch(C){x("[nimbi-cms] bfcache restore failed",C)}}),ae(window,"pagehide",()=>{try{B()}catch(A){x("[nimbi-cms] save scroll position failed",A)}}),{renderByQuery:q,siteNav:y,getCurrentPagePath:()=>p}}var Zl=50;function Yl(e){const t=e.map(r=>r.duration).filter(Number.isFinite).sort((r,i)=>r-i),n=r=>t.length?t[Math.min(t.length-1,Math.floor((t.length-1)*r))]:0;return{count:t.length,p50:n(.5),p75:n(.75),p95:n(.95),max:t.at(-1)||0,interactionCount:e.filter(r=>r.interactionId>0).length}}function Im(e,t={}){const n=globalThis.PerformanceObserver;if(typeof n>"u")return()=>{};const r=Number(t?.sampleRate),i=Number.isFinite(r)?Math.min(1,Math.max(0,r)):1,a=[],o=[],s=c=>{if(i<1&&Math.random()>=i)return;const f=Number(globalThis.performance?.memory?.usedJSHeapSize);a.push({name:c.name,startTime:Number(c.startTime)||0,duration:Number(c.duration)||0,...Number.isFinite(f)?{heapUsedBytes:f}:{},interactionId:Number(c.interactionId)||0,processingStart:Number(c.processingStart)||0,processingEnd:Number(c.processingEnd)||0}),a.length>Zl&&a.splice(0,a.length-Zl);try{typeof window<"u"&&(window.__nimbiPerformanceDiagnosticsSummary=Yl(a))}catch{}try{nn("[nimbi] performance entry",a[a.length-1])}catch{}};for(const c of["long-animation-frame","longtask","event"])try{if(!n.supportedEntryTypes?.includes(c))continue;const f=new n(u=>{u.getEntries().forEach(s)});f.observe({type:c,buffered:!0,...c==="event"?{durationThreshold:16}:{}}),o.push(f)}catch{}try{typeof window<"u"&&(window.__nimbiPerformanceDiagnostics=a,window.__nimbiPerformanceDiagnosticsSummary=Yl(a))}catch{}const l=()=>{o.forEach(c=>c.disconnect()),o.length=0,a.length=0;try{typeof window<"u"&&(window.__nimbiPerformanceDiagnostics=null),typeof window<"u"&&(window.__nimbiPerformanceDiagnosticsSummary=null)}catch{}};try{e?.addEventListener("abort",l,{once:!0})}catch{}return l}function Om({generation:e,contentBase:t="",language:n="",source:r=null}){const i=r&&typeof r=="object"&&!Array.isArray(r)?Object.freeze({...r}):r;return Object.freeze({generation:e,contentBase:t,language:n,source:i})}function zm(e){try{let t=typeof e=="string"?e:typeof window<"u"&&window.location?window.location.search:"";if(!t&&typeof window<"u"&&window.location)try{const a=dt(window.location.href);a&&a.params&&(t=a.params.startsWith("?")?a.params:"?"+a.params)}catch{t=""}if(!t)return{};const n=new URLSearchParams(t.startsWith("?")?t.slice(1):t),r={},i=a=>{if(a==null)return;const o=String(a).toLowerCase();if(o==="1"||o==="true"||o==="yes")return!0;if(o==="0"||o==="false"||o==="no")return!1};if(n.has("contentPath")&&(r.contentPath=n.get("contentPath")),n.has("searchIndex")){const a=i(n.get("searchIndex"));typeof a=="boolean"&&(r.searchIndex=a)}if(n.has("searchIndexMode")){const a=n.get("searchIndexMode");(a==="eager"||a==="lazy")&&(r.searchIndexMode=a)}if(n.has("defaultStyle")){const a=n.get("defaultStyle");(a==="light"||a==="dark"||a==="system")&&(r.defaultStyle=a)}if(n.has("bulmaCustomize")&&(r.bulmaCustomize=n.get("bulmaCustomize")),n.has("lang")&&(r.lang=n.get("lang")),n.has("l10nFile")){const a=n.get("l10nFile");r.l10nFile=a==="null"?null:a}if(n.has("cacheTtlMinutes")){const a=Number(n.get("cacheTtlMinutes"));Number.isFinite(a)&&a>=0&&(r.cacheTtlMinutes=a)}if(n.has("cacheMaxEntries")){const a=Number(n.get("cacheMaxEntries"));Number.isInteger(a)&&a>=0&&(r.cacheMaxEntries=a)}if(n.has("homePage")&&(r.homePage=n.get("homePage")),n.has("navigationPage")&&(r.navigationPage=n.get("navigationPage")),n.has("notFoundPage")){const a=n.get("notFoundPage");r.notFoundPage=a==="null"?null:a}if(n.has("availableLanguages")&&(r.availableLanguages=n.get("availableLanguages").split(",").map(a=>a.trim()).filter(Boolean)),n.has("fetchConcurrency")){const a=Number(n.get("fetchConcurrency"));Number.isInteger(a)&&a>=1&&(r.fetchConcurrency=a)}if(n.has("negativeFetchCacheTTL")){const a=Number(n.get("negativeFetchCacheTTL"));Number.isFinite(a)&&a>=0&&(r.negativeFetchCacheTTL=a)}if(n.has("indexDepth")){const a=Number(n.get("indexDepth"));Number.isInteger(a)&&(a===1||a===2||a===3)&&(r.indexDepth=a)}if(n.has("noIndexing")){const a=(n.get("noIndexing")||"").split(",").map(o=>o.trim()).filter(Boolean);a.length&&(r.noIndexing=a)}return r}catch{return{}}}function us(e){if(typeof e!="string")return!1;const t=e.trim();if(!t||t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))return!1;const n=t.replace(/^\.\//,"");return!!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n)}function $m(e){if(typeof e!="string")return!1;const t=e.trim();if(!t)return!1;if(t==="."||t==="./")return!0;if(t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))return!1;const n=t.replace(/^\.\//,"");return!!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\/?$/.test(n)}var Fm="monokai",Yi="",Zt=null,Ln=null,Kn=null,Dm=0,mr=null,Fs=()=>{},xa=new Set;function Um(e,t,n=Zt?.signal){const r=setTimeout(()=>{xa.delete(r),!n?.aborted&&e()},t);return xa.add(r),r}function jm(){for(const e of xa)clearTimeout(e);xa.clear()}function Vr(e,t=null){try{if(typeof window>"u")return;window.__nimbiRecoveryState={state:e,generation:mr,error:t?String(t?.message||t).slice(0,2e3):null}}catch{}}async function _h(e={}){if(!e||typeof e!="object")throw new TypeError("initCMS(options): options must be an object");Vr("loading"),Ln&&(await Ln,Ln=null);try{Pc(),ro(),ao(),vm()}catch{}const t=zm();if(t&&(t.contentPath||t.homePage||t.notFoundPage||t.navigationPage))if(e&&e.allowUrlPathOverrides===!0)try{x("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage/navigationPage")}catch{}else{try{x("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage/navigationPage")}catch{}delete t.contentPath,delete t.homePage,delete t.notFoundPage,delete t.navigationPage}const n=Object.assign({},t,e);if(n.manifest!=null&&(typeof n.manifest!="object"||Array.isArray(n.manifest)))throw new TypeError("initCMS(options): manifest must be a plain object");if(n.onRuntimeError!=null&&typeof n.onRuntimeError!="function")throw new TypeError("initCMS(options): onRuntimeError must be a function");try{Object.prototype.hasOwnProperty.call(n,"debugLevel")&&$h(n.debugLevel)}catch{}try{nn("[nimbi-cms] initCMS called",()=>({options:n}))}catch{}t&&typeof t.bulmaCustomize=="string"&&t.bulmaCustomize.trim()&&(n.bulmaCustomize=t.bulmaCustomize);let{el:r,contentPath:i="/content",crawlMaxQueue:a=1e3,searchIndex:o=!0,searchIndexMode:s="eager",indexDepth:l=1,noIndexing:c=void 0,defaultStyle:f="light",bulmaCustomize:u="none",lang:h=void 0,l10nFile:p=null,cacheTtlMinutes:m=5,cacheMaxEntries:y,markdownExtensions:g,availableLanguages:d,homePage:_=null,notFoundPage:w=null,navigationPage:k="_navigation.md",allowEmbeddedScripts:v=!1,embeddedScriptOrigins:I=[],exposeSitemap:N=!0,cspNonce:z=null}=n;try{typeof _=="string"&&_.startsWith("./")&&(_=_.replace(/^\.\//,""))}catch{}try{typeof w=="string"&&w.startsWith("./")&&(w=w.replace(/^\.\//,""))}catch{}try{typeof k=="string"&&k.startsWith("./")&&(k=k.replace(/^[.]\//,""))}catch{}const{navbarLogo:W="favicon"}=n,{skipRootReadme:q=!1}=n,ae=Y=>{try{const B=document.querySelector(r);if(B&&B instanceof Element)try{const E=()=>{const C=document.createElement("div");C.className="nimbi-init-error";const M=document.createElement("strong");M.textContent="NimbiCMS failed to initialize:",C.appendChild(M);try{C.appendChild(document.createElement("br"))}catch{}const se=document.createElement("pre");return se.textContent=String(Y),C.appendChild(se),C},A=E();try{if(typeof B.replaceChildren=="function")B.replaceChildren(A);else{for(;B.firstChild;)B.removeChild(B.firstChild);B.appendChild(A)}}catch{try{for(;B.firstChild;)B.removeChild(B.firstChild);B.appendChild(E())}catch{}}}catch{}}catch{}};if(n.contentPath!=null&&!$m(n.contentPath))throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');if(_!=null&&!us(_))throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');if(w!=null&&!us(w))throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');if(k!=null&&!us(k))throw new TypeError('initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html');if(!r)throw new Error("el is required");let G=r;if(typeof r=="string"){if(G=document.querySelector(r),!G)throw new Error(`el selector "${r}" did not match any element`)}else if(!(r instanceof Element))throw new TypeError("el must be a CSS selector string or a DOM element");try{if(G&&G._nimbiCmsInitialized)throw new Error("initCMS already called on this element")}catch(Y){if(Y instanceof Error&&/already called/.test(Y.message))throw Y}if(Kn&&Kn!==G&&Kn.isConnected&&(await Bm(),Ln=null),typeof i!="string"||!i.trim())throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');if(typeof o!="boolean")throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');if(s!=null&&s!=="eager"&&s!=="lazy")throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');if(l!=null&&l!==1&&l!==2&&l!==3)throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');if(f!=="light"&&f!=="dark"&&f!=="system")throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');if(u!=null&&typeof u!="string")throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');if(h!=null&&typeof h!="string")throw new TypeError('initCMS(options): "lang" must be a string when provided');if(p!=null&&typeof p!="string")throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');if(m!=null&&(typeof m!="number"||!Number.isFinite(m)||m<0))throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');if(y!=null&&(typeof y!="number"||!Number.isInteger(y)||y<0))throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');if(g!=null&&(!Array.isArray(g)||g.some(Y=>!Y||typeof Y!="object")))throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');if(d!=null&&(!Array.isArray(d)||d.some(Y=>typeof Y!="string"||!Y.trim())))throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');if(c!=null&&(!Array.isArray(c)||c.some(Y=>typeof Y!="string"||!Y.trim())))throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');if(c=Array.isArray(c)?Array.from(new Set(c.map(Y=>{try{return oe(String(Y??""))}catch{return""}}).filter(Boolean))):void 0,q!=null&&typeof q!="boolean")throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');if(v!=null&&typeof v!="boolean")throw new TypeError('initCMS(options): "allowEmbeddedScripts" must be a boolean when provided');if(!Array.isArray(I)||I.some(Y=>{if(typeof Y!="string"||!Y.trim())return!0;try{const B=new URL(Y);return!/^https?:$/.test(B.protocol)||B.username!==""||B.password!==""||B.pathname!=="/"||B.search!==""||B.hash!==""}catch{return!0}}))throw new TypeError('initCMS(options): "embeddedScriptOrigins" must contain only absolute http(s) origins');if(n.fetchConcurrency!=null&&(typeof n.fetchConcurrency!="number"||!Number.isInteger(n.fetchConcurrency)||n.fetchConcurrency<1))throw new TypeError('initCMS(options): "fetchConcurrency" must be a positive integer when provided');if(n.negativeFetchCacheTTL!=null&&(typeof n.negativeFetchCacheTTL!="number"||!Number.isFinite(n.negativeFetchCacheTTL)||n.negativeFetchCacheTTL<0))throw new TypeError('initCMS(options): "negativeFetchCacheTTL" must be a non-negative number (ms) when provided');if(_!=null&&(typeof _!="string"||!_.trim()||!/\.(md|html)$/.test(_)))throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');if(w!=null&&(typeof w!="string"||!w.trim()||!/\.(md|html)$/.test(w)))throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');const ke=!!o;try{kc(!!q)}catch(Y){x("[nimbi-cms] setSkipRootReadme failed",Y)}try{try{n?.seoMap&&typeof n.seoMap=="object"&&Yf(n.seoMap)}catch{}try{Pu()}catch{}try{Nu(z||null)}catch{}try{const Y="11.12.0";Y&&Lu(Y,Fm)}catch{}try{if(typeof window<"u"){window.__nimbiRenderingErrors__||(window.__nimbiRenderingErrors__=[]);const Y=mr,B=A=>String(A).replace(/([?&](?:token|key|secret|password|auth)[^=]*=)[^&]*/gi,"$1[redacted]").replace(/([?&][^#\s=]+)=([^&#\s]*)/g,"$1=[redacted]").replace(/#.*$/,"#"),E=A=>{const C={...A,runtimeId:Y};for(const M of["message","reason","filename","stack"])C[M]!=null&&(C[M]=B(C[M]).slice(0,2e3));window.__nimbiRenderingErrors__.push(C),window.__nimbiRenderingErrors__.length>50&&window.__nimbiRenderingErrors__.splice(0,window.__nimbiRenderingErrors__.length-50);try{n.onRuntimeError?.({...C})}catch{}};window.addEventListener("error",function(A){try{const C={type:"error",message:A?.message?String(A.message):"",filename:A?.filename?String(A.filename):"",lineno:A?.lineno?A.lineno:null,colno:A?.colno?A.colno:null,stack:A?.error?.stack?A.error.stack:null,time:Date.now()};try{x("[nimbi-cms] runtime error",C.message)}catch{}E(C)}catch{}},{signal:Zt.signal}),window.addEventListener("unhandledrejection",function(A){try{const C={type:"unhandledrejection",reason:A?.reason?String(A.reason):"",time:Date.now()};try{x("[nimbi-cms] unhandledrejection",C.reason)}catch{}E(C)}catch{}},{signal:Zt.signal})}}catch{}try{const Y=dt(typeof window<"u"?window.location.href:""),B=Y?.page?Y.page:_||void 0;try{Gf()}catch{}try{B&&Qf(B,Yi||"")}catch{}}catch{}await(async()=>{try{G.classList.add("nimbi-mount")}catch(T){x("[nimbi-cms] mount element setup failed",T)}const Y=document.createElement("section");Y.className="section";const B=document.createElement("div");B.className="container nimbi-cms",B.tabIndex=0;const E=document.createElement("div");E.className="columns";const A=document.createElement("div");A.className="column is-hidden-mobile is-3-tablet nimbi-nav-wrap",A.setAttribute("role","navigation");try{const T=typeof Xn=="function"?Xn("navigation"):null;T&&A.setAttribute("aria-label",T)}catch(T){x("[nimbi-cms] set nav aria-label failed",T)}E.appendChild(A);const C=document.createElement("main");C.className="column nimbi-content",C.setAttribute("role","main"),E.appendChild(C),B.appendChild(E),Y.appendChild(B);const M=A,se=C;G.appendChild(Y);let K=null;try{K=G.querySelector(".nimbi-overlay"),K||(K=document.createElement("div"),K.className="nimbi-overlay",G.appendChild(K))}catch(T){K=null,x("[nimbi-cms] mount overlay setup failed",T)}const de=location.pathname||"/";let ye;if(de.endsWith("/"))ye=de;else{const T=de.substring(de.lastIndexOf("/")+1);T&&!T.includes(".")?ye=de+"/":ye=de.substring(0,de.lastIndexOf("/")+1)}try{Yi=document.title||""}catch(T){Yi="",x("[nimbi-cms] read initial document title failed",T)}let Q=i;Object.prototype.hasOwnProperty.call(n,"contentPath");const Be=typeof location<"u"&&location?.origin?location.origin:"http://localhost",Fe=new URL(ye,Be).toString();(Q==="."||Q==="./")&&(Q="");try{Q=String(Q??"").replace(/\\/g,"/")}catch{Q=String(Q??"")}Q.startsWith("/")&&(Q=Q.replace(/^\/+/,"")),Q&&!Q.endsWith("/")&&(Q=Q+"/");try{if(Q&&ye&&ye!=="/"){const T=ye.replace(/^\/+/,"").replace(/\/+$/,"")+"/";T&&Q.startsWith(T)&&(Q=Q.slice(T.length))}}catch{}try{if(Q)var Se=new URL(Q,Fe.endsWith("/")?Fe:Fe+"/").toString();else var Se=Fe}catch{try{if(Q)var Se=new URL("/"+Q,Be).toString();else var Se=new URL(ye,Be).toString()}catch{var Se=Be}}p&&await qs(p,ye),d&&Array.isArray(d)&&xc(d),h&&Hs(h);try{if(typeof document<"u"&&document.documentElement){const T=typeof h=="string"&&h.trim()?h.trim().split("-")[0]:Lt;try{document.documentElement.setAttribute("lang",T)}catch{}try{const U=new Intl.Locale(T||"en"),L=U.textInfo&&U.textInfo.direction==="rtl"||["ar","he","fa","ur","ps","sd","ug","ku","dv","yi"].includes(String(T||"").split("-")[0].toLowerCase());document.documentElement.setAttribute("dir",L?"rtl":"ltr")}catch{}}}catch{}if(typeof m=="number"&&m>=0&&typeof ll=="function"&&ll(m*60*1e3),typeof y=="number"&&y>=0&&typeof ol=="function"&&ol(y),g&&Array.isArray(g)&&g.length)try{g.forEach(T=>{typeof T=="object"&&Fp&&typeof Cs=="function"&&Cs(T)})}catch(T){x("[nimbi-cms] applying markdownExtensions failed",T)}try{if(typeof a=="number")try{zc(a)}catch(T){x("[nimbi-cms] setDefaultCrawlMaxQueue failed",T)}if(typeof n.fetchConcurrency=="number")try{Ic(n.fetchConcurrency)}catch(T){x("[nimbi-cms] setFetchConcurrency failed",T)}if(typeof n.negativeFetchCacheTTL=="number")try{Nc(n.negativeFetchCacheTTL)}catch(T){x("[nimbi-cms] setFetchNegativeCacheTTL failed",T)}}catch(T){x("[nimbi-cms] setDefaultCrawlMaxQueue failed",T)}try{try{const T=n?.manifest?n.manifest:typeof globalThis<"u"&&globalThis.__NIMBI_CMS_MANIFEST__?globalThis.__NIMBI_CMS_MANIFEST__:typeof window<"u"&&window.__NIMBI_CMS_MANIFEST__?window.__NIMBI_CMS_MANIFEST__:null;if(T&&typeof T=="object")try{Rc(T),nn?.("[nimbi-cms diagnostic] applied content manifest",()=>({manifestKeys:Object.keys(T).length}))}catch(U){x?.("[nimbi-cms] applying content manifest failed",U)}try{try{const U=dt(typeof window<"u"?window.location.href:"");if(U)try{if(U.type==="cosmetic")try{Ki(U)}catch{}else if(U.type==="canonical")try{Ki(U)}catch{}else if(U.type==="path")try{const L=(typeof location<"u"&&location?.pathname?String(location.pathname):"/").replace(/\/\/+$/,""),$=(ye||"").replace(/\/\/+$/,"");let P="";try{P=new URL(Se).pathname.replace(/\/\/+$/,"")}catch{P=""}if(L===$||L===P||L==="")try{Ki({type:"path",page:null,anchor:U.anchor||null,params:U.params||""})}catch{}}catch{}}catch{}}catch{}io(Se)}catch(U){x("[nimbi-cms] setContentBase failed",U)}try{try{nn("[nimbi-cms diagnostic] after setContentBase",()=>({manifestKeys:Object.keys(T??{}).length??0,slugToMdSize:ne?.size??void 0,allMarkdownPathsLength:ft?.length??void 0,allMarkdownPathsSetSize:Xe?.size??void 0,searchIndexLength:searchIndex?.length??void 0}))}catch{}}catch{}}catch{}}catch(T){x("[nimbi-cms] setContentBase failed",T)}try{Mc(w)}catch(T){x("[nimbi-cms] setNotFoundPage failed",T)}try{if(typeof window<"u"&&window.__nimbiAutoAttachSitemapUI)try{cs&&typeof zs=="function"&&zs(document.body,{filename:"sitemap.json"})}catch{}}catch{}let Ve=null,De=null;try{if(!Object.prototype.hasOwnProperty.call(n,"homePage")&&k)try{const U=[],L=[];try{k&&L.push(String(k))}catch{}try{const P=String(k??"").replace(/^_/,"");P&&P!==String(k)&&L.push(P)}catch{}try{L.push("navigation.md")}catch{}try{L.push("assets/navigation.md")}catch{}const $=[];for(const P of L)try{if(!P)continue;const Z=String(P);$.includes(Z)||$.push(Z)}catch{}for(const P of $){U.push(P);try{if(De=await Ke(P,Se,{force:!0}),De&&De.raw){try{k=P}catch{}try{x("[nimbi-cms] fetched navigation candidate",P,"contentBase=",Se)}catch{}Ve=await br(De.raw||"");try{const Z=ot();if(Z&&Ve&&Ve.html){const H=Z.parseFromString(Ve.html,"text/html").querySelector("a");if(H)try{const j=H?.getAttribute?.("href")||"",F=dt(j);try{x("[nimbi-cms] parsed nav first-link href",j,"->",F)}catch{}if(F?.page&&(F.type==="path"||F.type==="canonical")&&(F.page.includes(".")||F.page.includes("/"))){_=F.page;try{x("[nimbi-cms] derived homePage from navigation",_)}catch{}break}}catch{}}}catch{}}}catch{}}}catch{}try{x("[nimbi-cms] final homePage before slugManager setHomePage",_)}catch{}try{Cc(_)}catch(U){x("[nimbi-cms] setHomePage failed",U)}let T=!0;try{const U=dt(typeof location<"u"?location.href:"");U&&U.type==="cosmetic"&&(typeof w>"u"||w==null)&&(T=!1)}catch{}if(T&&_)try{await Ke(_,Se,{force:!0})}catch(U){throw new Error(`Required ${_} not found at ${Se}${_}: ${U&&U.message?U.message:String(U)}`)}}catch(T){throw T}oc(f),await sc(u,ye),Zt=typeof window<"u"?new AbortController:{signal:{abort:()=>{}}},mr=++Dm,Vr("loading");const Je=Om({generation:mr,contentBase:Se,language:Lt,source:n.manifest??null});Fs=n.performanceDiagnostics===!0?Im(Zt.signal):()=>{};const D=Nm({contentWrap:se,navWrap:M,container:B,mountOverlay:K,t:Xn,contentBase:Se,homePage:_,initialDocumentTitle:Yi,runHooks:fs,allowEmbeddedScripts:v,embeddedScriptOrigins:I,signal:Zt.signal});try{if(typeof window<"u"){try{window.__nimbiUI=D,window.__nimbiRuntimeId=mr,window.__nimbiRuntimeManifest=Je,window.__nimbiRenderTimings||(window.__nimbiRenderTimings=[])}catch{}window.addEventListener("nimbi.coldRouteResolved",function(){D?.renderByQuery?.().catch(T=>{x?.("[nimbi-cms] renderByQuery failed for cold-route event",T)})},{signal:Zt.signal}),(Array.isArray(window.__nimbiColdRouteResolved)?window.__nimbiColdRouteResolved.slice():null)?.length&&(D?.renderByQuery?.().catch(()=>{}),window.__nimbiColdRouteResolved=[])}}catch{}try{const T=document.createElement("header");T.className="nimbi-site-navbar",G.insertBefore(T,Y);let U=De,L=Ve;L||(U=await Ke(k,Se,{force:!0}),L=await br(U.raw||""));const{navbar:$,linkEls:P}=await Cm(T,B,L.html||"",Se,_,Xn,D.renderByQuery,ke,s,l,c,W,Zt.signal);try{await fs("onNavBuild",{navWrap:M,navbar:$,linkEls:P,contentBase:Se})}catch(Z){x("[nimbi-cms] onNavBuild hooks failed",Z)}try{try{if(P&&P.length){for(const Z of Array.from(P||[]))try{const H=Z?.getAttribute?.("href")||"";if(!H)continue;let j=String(H??"").split(/::|#/,1)[0];if(j=String(j??"").split("?")[0],!j)continue;/\.(?:md|html?)$/.test(j)||(j=j+".html");let F=null;try{F=oe(String(j??""))}catch{F=String(j??"")}const V=String(F??"").replace(/^.*\//,"").replace(/\?.*$/,"");if(!V)continue;try{let ie=null;try{ie=be(V.replace(/\.(?:md|html?)$/i,""))}catch{ie=String(V??"").replace(/\s+/g,"-").toLowerCase()}if(!ie)continue;let pe=ie;try{if(ne&&typeof ne.has=="function"&&ne.has(ie)){const Te=ne.get(ie);let Le=!1;try{if(typeof Te=="string")Te===j&&(Le=!0);else if(Te&&typeof Te=="object"){Te.default===j&&(Le=!0);for(const Ee of Object.keys(Te.langs||{}))if(Te.langs[Ee]===j){Le=!0;break}}}catch{}if(!Le)try{pe=Nn(ie,new Set(ne.keys()))}catch{pe=ie}}}catch{}try{try{St(pe,F)}catch{}try{ge?.set?.(F,pe)}catch{}try{if(!Xe?.has?.(F))try{Xe?.add?.(F),Array.isArray(ft)&&ft.push(F)}catch{}}catch{}}catch{}}catch{}}catch{}try{dr(Se)}catch{}}}catch{}}catch{}try{let Z=!1;try{const H=new URLSearchParams(location.search||"");(H.has("sitemap")||H.has("rss")||H.has("atom"))&&(Z=!0)}catch{}try{const H=(location.pathname||"/").replace(/\/\/+/g,"/").split("/").filter(Boolean).pop()||"";H&&/^(sitemap|sitemap\.xml|rss|rss\.xml|atom|atom\.xml)$/i.test(H)&&(Z=!0)}catch{}if(Z)try{try{const H=[];_&&H.push(_),k&&H.push(k);try{await xm({contentBase:Se,indexDepth:Math.max(l||1,3),noIndexing:c,seedPaths:H.length?H:void 0,startBuild:!0,timeoutMs:1/0})}catch{}}catch{}try{if(cs&&typeof mi=="function"&&await mi({includeAllMarkdown:!0,homePage:_,navigationPage:k,notFoundPage:w,contentBase:Se,indexDepth:l,noIndexing:c}))return}catch{}}catch{}else if(N===!0||typeof window<"u"&&window.__nimbiExposeSitemap)try{if(cs&&typeof $s=="function")try{$s({includeAllMarkdown:!0,homePage:_,navigationPage:k,notFoundPage:w,contentBase:Se,indexDepth:l,noIndexing:c}).catch(()=>{})}catch{}}catch{}}catch{}try{try{if(typeof dr=="function")try{dr(Se);try{try{nn("[nimbi-cms diagnostic] after refreshIndexPaths",()=>({slugToMdSize:typeof ne?.size=="number"?ne?.size:void 0,allMarkdownPathsLength:Array.isArray(ft)?ft.length:void 0,allMarkdownPathsSetSize:typeof Xe?.size=="number"?Xe?.size:void 0}))}catch{}}catch{}try{const H=typeof ne?.size=="number"?ne?.size:0;let j=!1;try{if(!manifest){H<30&&(j=!0);try{const F=dt(typeof location<"u"?location.href:"");if(F){if(F.type==="cosmetic"&&F.page)try{ne.has(F.page)||(j=!0)}catch{}else if((F.type==="path"||F.type==="canonical")&&F.page)try{const V=oe(F.page);!ge?.has?.(V)&&!Xe?.has?.(V)&&(j=!0)}catch{}}}catch{}}}catch{}if(j){let F=null;try{F=typeof window<"u"&&(window.__nimbiSitemapFinal||window.__nimbiResolvedIndex||window.__nimbiSearchIndex||window.__nimbiLiveSearchIndex||window.__nimbiSearchIndex)||null}catch{F=null}if(Array.isArray(F)&&F.length){let V=0;for(const ie of F)try{if(!ie||!ie.slug)continue;const pe=String(ie.slug).split("::")[0];if(ne.has(pe))continue;let Te=ie.sourcePath||ie.path||null;if(!Te&&Array.isArray(F)){const Ee=(F||[]).find(we=>we&&we.slug===ie.slug);Ee&&Ee.path&&(Te=Ee.path)}if(!Te)continue;try{Te=String(Te)}catch{continue}let Le=null;try{const Ee=Se&&typeof Se=="string"?Se:typeof location<"u"&&location.origin?location.origin+"/":"";try{const we=new URL(Te,Ee),Oe=new URL(Ee);if(we.origin===Oe.origin){const gt=Oe.pathname||"/";let et=we.pathname||"";et.startsWith(gt)&&(et=et.slice(gt.length)),et.startsWith("/")&&(et=et.slice(1)),Le=oe(et)}else Le=oe(we.pathname||"")}catch{Le=oe(Te)}}catch{Le=oe(Te)}if(!Le)continue;Le=String(Le).split(/[?#]/)[0],Le=oe(Le);try{St(pe,Le)}catch{}V++}catch{}if(V){try{nn("[nimbi-cms diagnostic] populated slugToMd from sitemap/searchIndex",()=>({added:V,total:typeof ne?.size=="number"?ne?.size:void 0}))}catch{}try{dr(Se)}catch{}try{typeof window<"u"&&window.__nimbiUI&&typeof window.__nimbiUI.renderByQuery=="function"&&window.__nimbiUI.renderByQuery().catch(()=>{})}catch{}}}}}catch{}}catch(H){x("[nimbi-cms] refreshIndexPaths after nav build failed",H)}}catch{}const Z=()=>{const H=T?.getBoundingClientRect&&Math.round(T.getBoundingClientRect().height)||T?.offsetHeight||0;if(H>0){try{G.style.setProperty("--nimbi-site-navbar-height",`${H}px`)}catch(j){x("[nimbi-cms] set CSS var failed",j)}try{B.style.paddingTop=""}catch(j){x("[nimbi-cms] set container paddingTop failed",j)}try{const j=G?.getBoundingClientRect&&Math.round(G.getBoundingClientRect().height)||G?.clientHeight||0;if(j>0){const F=Math.max(0,j-H);try{B.style.setProperty("--nimbi-cms-height",`${F}px`)}catch(V){x("[nimbi-cms] set --nimbi-cms-height failed",V)}}else try{B.style.setProperty("--nimbi-cms-height","calc(100vh - var(--nimbi-site-navbar-height))")}catch(F){x("[nimbi-cms] set --nimbi-cms-height failed",F)}}catch(j){x("[nimbi-cms] compute container height failed",j)}try{T.style.setProperty("--nimbi-site-navbar-height",`${H}px`)}catch(j){x("[nimbi-cms] set navbar CSS var failed",j)}}};Z();try{if(typeof ResizeObserver<"u"){const H=new ResizeObserver(()=>Z());try{H.observe(T)}catch(j){x("[nimbi-cms] ResizeObserver.observe failed",j)}}}catch(H){x("[nimbi-cms] ResizeObserver setup failed",H)}}catch(Z){x("[nimbi-cms] compute navbar height failed",Z)}}catch(T){x("[nimbi-cms] build navigation failed",T)}try{const T="1.1.0",U=Z=>{const H=document.createElement("a");H.className="nimbi-version-label tag is-small",H.textContent=`nimbiCMS v. ${T}`,H.href=Z||"#",H.target="_blank",H.rel="noopener noreferrer nofollow",H.setAttribute("aria-label",`nimbiCMS version ${T}`),H.classList.add("is-hidden");try{lc(H)}catch{}try{G.appendChild(H);const j=()=>{try{H.classList.remove("is-hidden")}catch{}};try{Um(j,3e3)}catch{j()}}catch(j){x("[nimbi-cms] append version label failed",j)}},L="https://abelvm.github.io/nimbiCMS/",$=(()=>{try{return new URL(L).toString()}catch{}return"#"})(),P=()=>{try{U($)}catch(Z){x("[nimbi-cms] building version label failed",Z)}};try{let Z=!1;const H=()=>{Z||(Z=!0,P())},j=F=>{try{window.addEventListener(F,H,{once:!0,passive:!0,signal:Zt?.signal})}catch{try{window.addEventListener(F,H,{once:!0})}catch{}}};j("pointerdown"),j("keydown"),j("touchstart"),j("wheel")}catch(Z){x("[nimbi-cms] version label defer failed",Z),P()}}catch(T){x("[nimbi-cms] version label setup failed",T)}})()}catch(Y){throw Vr("failed",Y),ae(Y),Y}G._nimbiCmsInitialized=!0,Kn=G,Vr("ready")}function Bm(){return Ln||(Ln=(async()=>{typeof hl=="function"&&hl();try{typeof window<"u"&&(window.__nimbiUI=null,window.__nimbiRenderingErrors__=null,window.__nimbiRenderTimings=null,window.__nimbiRuntimeId=null,Vr("idle"))}catch{}try{Zt&&Zt.abort()}catch{}jm();try{typeof ka=="function"&&ka()}catch{}try{Fs(),Fs=()=>{}}catch{}await Promise.all([lh(),Ac(),fm()]),ym();try{typeof cl=="function"&&cl()}catch{}try{typeof document<"u"&&(document.querySelector(".nimbi-skip-link")?.remove(),document.querySelector(".nimbi-scroll-top")?.remove(),document.querySelector(".nimbi-mount > section")?.remove())}catch{}try{mr=null,Kn&&(Kn._nimbiCmsInitialized=!1),Kn=null}catch{}})(),Ln)}async function Wm(){try{if("1.1.0".trim())return"1.1.0"}catch{}return"0.0.0"}exports.BAD_LANGUAGES=js;exports.SUPPORTED_HLJS_MAP=ze;exports._clearHooks=jh;exports.addHook=Ea;exports.default=_h;exports.ensureBulma=sc;exports.getVersion=Wm;exports.initCMS=_h;exports.loadL10nFile=qs;exports.loadSupportedLanguages=Bs;exports.observeCodeBlocks=ic;exports.onNavBuild=Dh;exports.onPageLoad=Fh;exports.registerLanguage=_r;exports.runHooks=fs;exports.setHighlightTheme=Su;exports.setLang=Hs;exports.setStyle=oc;exports.setThemeVars=zu;exports.t=Xn;exports.transformHtml=Uh;
